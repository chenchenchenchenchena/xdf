/**
 * Created by zyc on 2017/7/24.
 */
//sessionStorage.openid = 'ofZfFwgizCmzR5XXMQtC5Wx5wZrA'
// sessionStorage.stuNum= 'sy1';
$(function () {
    $('.name_s').html(localStorage.terEmail);
    $('.name_ema').html(localStorage.teacherName);
    $(".t_email button").click(function () {
        var temail={
            "email":$(".t_email input").val()+"@xdf.cn"
        }
        if($(".t_email input").val()==""){
            layer.msg("邮箱不能为空",{icon:6});
        }else{
            ajax_S(url.w_email,temail,terEmail);
        }

    })
    function terEmail(e){
        console.log(e.data)
        if(e.result==true){
            if(e.data!=undefined){
                location.href="login_t.html";
                // var teaname = jQuery.parseJSON(e.data);
                localStorage.terEmail = e.data.sEmail;
                localStorage.schoolId = e.data.nSchoolId;
                localStorage.teacherId=e.data.sCode;
                localStorage.teacherName=e.data.sName;
            }else{
                layer.msg("教师邮箱不存在",{icon:6});
            }

        }else{
            layer.msg("教师邮箱不正确",{icon:6});
        }
    }
//清除缓存
    function clear(){
        localStorage.removeItem("teacherId");
        localStorage.removeItem("terEmail");
        localStorage.removeItem("schoolId");
        localStorage.removeItem("teacherName");
    }
})



