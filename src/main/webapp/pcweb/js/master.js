/* 主讲权限 */


require(['jquery-1.11.0.min'], function () {
    require(['layer'],function() {
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
                        $('.master_list').append('<li><span>'+masterlist[i].teacherName+'</span><span>'+masterlist[i].accountId+'</span><span>'+masterlist[i].gradeCourse+'</span><span><a  href="javascript:;" class="master_edit" userName="'+masterlist[i].teacherName+'" email="'+masterlist[i].accountId+'">编辑</a><a href="javascript:;" class="master_confrim">禁用</a></span></li>')
                    }
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
        $(document).on('click','.master_edit',function(){
            $('.edit_s ').show();
            $('.back_big').show();
            var teaname    = $(this).attr('userName')
            sessionStorage.teaneamail = $(this).attr('email')
            $('.edit_s p b').html(teaname);
            Olddata();
        });
        //新增主讲校区
        $(document).on('click','.edit_s i',function(){
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
                $.ajax({
                    url:global.master_add,
                    type: 'post',
                    asyns:false,
                    dataType: 'json',
                    data:JSON.stringify(need),
                    success:function(e){
                        if(e.result==true){
                            layer.msg('操作成功');
                            Olddata();
                        }
                    }
                });
            }else{
                //删除编号
                if(confirm('确定删除吗？')){
                    var need_ = {
                        id:$(this).attr('id'),
                    };
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
                }

            }
        });
        //编辑取消
        $('.false_s,.true_s').on('click',function(){
            $('.back_big').hide();
            $('.edit_s').hide();
            $('.edit_s select').val('1');
            $('.tccode').val('');
            $('.old_s').children().remove();
        });
        //新建账户
        $('.master_adduser').on('click',function(){
            $('.add_l ').show();
            $('.back_big').show();
        });
        //新建 取消
        $('.false_l').on('click',function () {
            $('.back_big').hide();
            $('.add_l').hide();
        });
        //新建  确认
        $('.true_l').on('click',function () {
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
                layer.msg("科目不为空！")
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
            }
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
                        findList();
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
    });
});
