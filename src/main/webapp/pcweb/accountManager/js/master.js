/**
 * Created by xupingwei on 2017/10/25.
 */
$(function () {
    var mastertae = [];
    var firstIn = true;
    findList();
    function findList() {

        ajax_S(url.data_s, '', function (json) {

            if (json.data.length > 0) {
                var userList = json.data;
                var str = "";
                for (var i = 0; i < userList.length; i++) {
                    var pid = userList[i].teacherId;
                    var userName = userList[i].loginName;
                    var email = userList[i].accountId;
                    var gradeCourse = userList[i].gradeCourse;
                    var isEnabled = userList[i].invalid;

                    if(gradeCourse == undefined){
                        gradeCourse = "";
                    }

                    if (i % 2 == 1) {
                        str += "<tr class='table-tr-odd'>"
                    } else {
                        str += "<tr class='table-tr-even'>"
                    }
                    str += "<td id='" + pid + "' style='display: none'>" + isEnabled + "</td>"
                    str += "<td id='" + pid + "' style='display: none'></td>";
                    str += "<td style='display: none'>" + pid + "</td>";
                    str += "<td>" + userName + "</td>";
                    str += "<td style='word-wrap:break-word'>" + email + "</td>";
                    str += "<td>" + gradeCourse + "</td>";

                    str += "<td>";
                    str += "<div class='p176-table-btnGroup'>";
                    // if (loginId != "ssdf") {
                        str += "<a href='javascript:;' class='p176-btn-edit' onclick='edite_s(this)' email="+email+" username="+userName+"><i></i>编辑</a>";
                        // str += "<a href='javascript:;' class='p176-btn-delete js-deleteBtn' onclick='javascript:deleteUser(\""+pid+"\",\""+userId+"\",this);'><i></i>删除</a> "

                        if (isEnabled == 1) {
                            str += "<a href='javascript:;' class='p176-btn-able' onclick='enabledUser(this,\"" + pid + "\")'><i></i>禁用</a>";
                        } else {
                            str += "<a href='javascript:;' class='p176-btn-disable' onclick='enabledUser(this,\"" + pid + "\")'><i></i>启用</a>";
                        }
                    str += "</div>";
                    str += "</td>";
                    str += "</tr>";

                }
                $("#userTbody").html(str);
            } else {
                layer.msg("查询失败!", {icon: 5});
            }
        });
    }


    $('.false_l').click(function () {
        $('.back_big').hide();
        $('.add_l').hide();
    });
    $('.true_l').click(function () {
        var name = $('#add-name').val();
        var email = $('#add-email').val();
        var subject = $('#add-subject').val();
        if (name == undefined || name == "") {
            alert("主讲名称不为空！")
            return;
        }
        if (email == undefined || email == "") {
            alert("邮箱不为空！")
            return;
        }
        if (subject == undefined || subject == "") {
            alert("科目不为空！")
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
        var url = url_o + "backEndMasterTeacherManager/addMasterTeacher.do";
        ajax_S(url, params, function (json) {
            if(json.result){
                $('.back_big').hide();
                $('.add_l').hide();
                layer.msg("添加成功!", {icon: 6});
            }else {

                $('.back_big').hide();
                $('.add_l').hide();
                layer.msg("添加失败!", {icon: 6});
                // alert(json.message);
            }
        });
    });
    //获取校区信息
    function campus(){
        var table={
            "tableName":"dict_school_info"
        }
        ajaxRequest("POST", url.s_select, table , selectData);
        function selectData(e) {
            for(var i = 0;i<e.data.length;i++){
                $('#campus').append('<option value="'+e.data[i].tCode+'">'+e.data[i].tName+'</option>');
            }
        }
    }
    campus();
    //编辑 确认 或者取消
    $('.false_s,.true_s').click(function(){
        $('.back_big').hide();
        $('.edit_s').hide();
        $('.edit_s select').val('1');
        $('.tccode').val('');
        $('.old_s').children().remove();
    });
   //编辑下 增加或者删除
    $(document).on('click','.edit_s i',function(){
        if($(this).html()=='+'){
            //增加新编号
            if($('#campus').val()=='1'){
                alert('校区未选择');
                return false;
            };
            if($('.tccode').val()==''){
                alert('主讲编号未输入');
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
            ajax_S(pcweb.t_add,need,function(e){
                console.log(e)
                if(e.result==true){
                    alert('操作成功');
                    Olddata();
                }
            });
        }else{
            //删除编号
           if(confirm('确定删除吗？')){
               var need_ = {
                    id:$(this).attr('id'),
               };
               ajax_S(pcweb.t_dele,need_,function(e){
                   if(e.result){
                       alert('删除成功')
                   }
                   $('.old_s').children().remove();
                   Olddata();
               });
           }

        }
    })
    //请求旧的教师编号
    function Olddata(){
        var need = {
            email:sessionStorage.teaneamail
        };
        ajax_S(pcweb.old_data,need,function(e){
            if(e.Data.length!=0&&e.result!=false){
                $('.old_s').children().remove();
                for(var i = 0;i<e.Data.length;i++){
                    $('.old_s').append('<p><span>'+e.Data[i].schoolName+'</span><span>'+e.Data[i].mtCode+'</span><i id="'+e.Data[i].id+'">-</i></p>')
                }
            }else{
                $('.old_s').hide();
            }
        })
    };
})

/**
 * 启用／禁用
 * @param pid
 */
function enabledUser(_this,pid) {
    var isEnable = $("#" + pid).html();
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
            'invalid':isEnable
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
                        $(_this).html("<i></i>启用");
                        $(_this).removeClass();
                        $(_this).addClass('p176-btn-disable');
                        $("#" + pid).html(0)
                    } else {
                        layer.msg("启用成功!", {icon: 6});
                        $(_this).html("<i></i>禁用");
                        $(_this).removeClass();
                        $(_this).addClass('p176-btn-able');
                        $("#" + pid).html(1)
                    }
                    //findList(1, currentCityId, currentAreaId, currentDeptId);
                } else {
                    if (isEnable == 1) {
                        layer.msg("禁用失败!", {icon: 5});
                    } else {
                        layer.msg("启用失败!", {icon: 5});
                    }
                }
            }
        });
    }, function () {

    });
}


/**
 * 新建账号
 */
function addMaster() {
    $('.back_big').show();
    $('.add_l').show();
}






















//编辑
function edite_s(self){
    $('.back_big').show();
    $('.edit_s').show();
    var teaname    = $(self).attr('userName')
    sessionStorage.teaneamail = $(self).attr('email')
    $('.edit_s p b').html(teaname);
    var need = {
        email:sessionStorage.teaneamail
    };
    ajax_S(pcweb.old_data,need,function(e){
        if(e.Data.length!=0&&e.result!=false){
            $('.old_s').children().remove();
            for(var i = 0;i<e.Data.length;i++){
                $('.old_s').append('<p><span>'+e.Data[i].schoolName+'</span><span>'+e.Data[i].mtCode+'</span><i id="'+e.Data[i].id+'">-</i></p>')
            }
        }else{
            $('.old_s').hide();
        }
    })
}