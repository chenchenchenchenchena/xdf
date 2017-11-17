/* 主讲权限 */


require(['jquery-1.11.0.min'], function () {
    require(['layer'],function() {
        // 重置左导航
        var number_l = 0;
        var url_l =  location.href;

        if(url_l.indexOf('homework')!=-1||url_l.indexOf('detail')!=-1){
            number_l = 1;
        }
        else if(url_l.indexOf('lesstime')!=-1||url_l.indexOf('lesstime_detail')!=-1){
            number_l = 2;
        }
        else if(url_l.indexOf('power')!=-1||url_l.indexOf('userAdd')!=-1||url_l.indexOf('useredit')!=-1){
            number_l = 3
        }
        else if(url_l.indexOf('master')!=-1){
            number_l = 4
        }
        var $bure_true = $('.left_nav ul li').eq(number_l);
        $bure_true.addClass('activ_nav').siblings().removeClass('activ_nav');

        //请求主讲列表
        $.ajax({
            url:global.master_All,
            type: 'post',
            asyns:false,
            dataType: 'json',
            data:JSON.stringify(),
            success:function(e){
                if(e.data){
                    var masterlist = e.data;
                    for(var i = 0;i<masterlist.length;i++){
                        if(masterlist[i].gradeCourse==undefined){
                            masterlist[i].gradeCourse = '暂无科目'
                        };
                        var email = masterlist[i].accountId;
                        var invalid = masterlist[i].invalid;
                        var pid = masterlist[i].teacherId;
                        $('.master_list').append('<li><span>'+masterlist[i].teacherName+'</span><span>'+masterlist[i].accountId+'</span><span>'+masterlist[i].gradeCourse+'</span><span><a  href="javascript:;" class="master_edit" userName="'+masterlist[i].teacherName+'" email="'+email+'">编辑</a><a data-email="'+email+'" data-invalid="'+invalid+'" data-pid="'+pid+'" href="javascript:;" class="master_confrim">禁用</a></span></li>')
                    }
                    $('.master_list  li:nth-child(odd)').css('background', '#f5fbfa');
                }
            }
        });
        //请求校区
        $.ajax({
            url:global.school_All,
            type: 'post',
            asyns:false,
            dataType: 'json',
            data:{"tableName":"dict_school_info"},
            success:function(e){
                if(e.data){
                    for(var i = 0;i<e.data.length;i++){
                        $('#campus').append('<option value="'+e.data[i].tCode+'">'+e.data[i].tName+'</option>');
                    }
                }
            }
        });
        //编辑点击
        $('.master_list').on('click','.master_edit',function(){
            $('.edit_s ').show();
            $('.back_big').show();
            var teaname    = $(this).attr('userName');
            sessionStorage.teaneamail = $(this).attr('email');
            $('.edit_s p b').html(teaname);
            Olddata();
        });
        //新增主讲校区
        $('.edit_s').on('click','i',function(){
            if($(this).html()=='+'){
                //增加新编号
                if($('#campus').val()=='1'){
                    layer.msg('校区未选择');
                    return false;
                };
                if($('.tccode').val()==''){
                    layer.msg('主讲编号未输入');
                    return false;
                }
                var need = {
                    masterCodeData:[{
                        name:$('.edit_s b').html(),
                        code:$('.tccode').val(),
                        schoolId:$('#campus').val(),
                        schoolName:$('#campus option:selected').html(),
                        email:sessionStorage.teaneamail
                    }]
                };
                if($(this).attr('checked')){
                    layer.msg('正在提交');
                    return false;
                }
                $(this).attr('checked',true);
                $.ajax({
                    url:global.master_add,
                    type: 'post',
                    asyns:false,
                    dataType: 'json',
                    data:JSON.stringify(need),
                    success:function(e){
                        if(e.result==true){
                            layer.msg('操作成功');
                            $('.edit_s i').removeAttr('checked');
                            Olddata();
                        }else{
                            layer.msg('操作失败');
                            $('.edit_s i').removeAttr('checked')
                        }
                    }
                });
            }else{
                //删除编号

                var need_ = {
                    id:$(this).attr('id'),
                };
                    var text = "确定删除该数据?";
                    var buttons = [];
                    buttons.push('确认', '取消');
                layer.confirm(text, {
                    btn: buttons //按钮
                }, function () {

                    $.ajax({
                        url:global.master_reduce,
                        type: 'post',
                        asyns:false,
                        dataType: 'json',
                        data:JSON.stringify(need_),
                        success:function(e){
                            if(e.result){
                                layer.msg('删除成功')
                            }
                            $('.old_s').children().remove();
                            Olddata();
                        }
                    });
                }, function () {

                });
            }
        });
        //编辑取消
        $('.false_s,.true_s').off("click").on('click',function(){
            $('.back_big').hide();
            $('.edit_s').hide();
            $('.edit_s select').val('1');
            $('.tccode').val('');
            $('.old_s').children().remove();
        });
        //新建账户
        $('.master_adduser').off("click").on('click',function(){
            $('.add_l ').show();
            $('.back_big').show();
        });
        //新建 取消
        $('.false_l').off("click").on('click',function () {
            $('.back_big').hide();
            $('.add_l').hide();
        });
        //新建  确认
        $('.true_l').off("click").on('click',function () {
            var name = $('#add-name').val();
            var email = $('#add-email').val();
            var subject = $('#add-subject').val();
            if (name == undefined || name == "") {
                layer.msg("主讲名称不为空！")
                return;
            }
            if (email == undefined || email == "") {
                layer.msg("邮箱不为空！")
                return;
            }
            if (subject == undefined || subject == "") {
                layer.msg("科目不为空！");
                return;
            }
            var params = {
                'masterTeacherData':[
                    {
                        'name':name,
                        'email':email,
                        'gradeCourse':subject
                    }
                ]
            };
            $.ajax({
                url:global.master_new,
                type: 'post',
                asyns:false,
                dataType: 'json',
                data:JSON.stringify(params),
                success:function(json){
                    if(json.result){
                        $('.back_big').hide();
                        $('.add_l').hide();
                        layer.msg("添加成功!", {icon: 6});
                        location.reload();
                        // findList();
                    }else {
                        $('.back_big').hide();
                        $('.add_l').hide();
                        layer.msg("添加失败!", {icon: 6});
                        // alert(json.message);
                    }
                }
            });
        });
        //老的教师编号
        function Olddata(){
            var need = {
                email:sessionStorage.teaneamail
            };
            $.ajax({
                url:global.master_data,
                type: 'post',
                asyns:false,
                dataType: 'json',
                data:JSON.stringify({email:sessionStorage.teaneamail}),
                success:function(e){
                    if(e.Data.length!=0&&e.result!=false){
                        $('.old_s').children().remove();
                        for(var i = 0;i<e.Data.length;i++){
                            $('.old_s').append('<p><span>'+e.Data[i].schoolName+'</span><span>'+e.Data[i].mtCode+'</span><i id="'+e.Data[i].id+'">-</i></p>')
                        }
                        $('.edit_s').css('margin-top',-$('.edit_s').height()/2-40)
                    }else{
                        $('.old_s').hide();
                    }
                }
            });
        };
        //禁用点击
        $(document).off("click").on('click','.master_confrim',function(){
            var _this = this;
            var pid = $(this).attr('data-pid');
            var email = $(this).attr('data-email');
            var isEnable = $(this).attr('data-invalid');

            var text;
            var buttons = [];
            if (isEnable == 1) {
                text = "确定禁用该数据?";
                buttons.push('禁用', '取消');
            } else {
                text = "确定启用该数据?";
                buttons.push('启用', '取消')
            }
            layer.confirm(text, {
                btn: buttons //按钮
            }, function () {
                var params = {
                    'id':pid,
                    'invalid':isEnable,
                    'email':email
                };

                jQuery.ajax({
                    type: "POST",
                    url: url_o + "backEndMasterTeacherManager/enabledMasterTeacher.do",
                    async: false,//同步
                    dataType: 'json',
                    data: JSON.stringify(params),
                    success: function (json) {
                        if (json.result == true) {
                            if (isEnable == 1) {
                                layer.msg("禁用成功!", {icon: 6});
                                // $(_this).html("启用");
                                $(_this).attr('data-invalid',0);
                                location.reload();
                            } else {
                                layer.msg("启用成功!", {icon: 6});
                                $(_this).html("禁用");
                                $(_this).attr('data-invalid',1);
                                location.reload();
                            }
                        } else {
                            if (isEnable == 1) {
                                layer.msg("禁用失败!", {icon: 5});
                                location.reload();
                            } else {
                                layer.msg("启用失败!", {icon: 5});
                                location.reload();
                            }
                        }
                    }
                });
            }, function () {

            });
        });
    });
});
