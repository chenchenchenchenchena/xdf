/**
 * Created by zyc on 2017/7/24.
 */
//sessionStorage.openid = 'ofZfFwgizCmzR5XXMQtC5Wx5wZrA'
// sessionStorage.stuNum= 'sy1';
var temail={
    "email":$(".t_email").val()+"@xdf.cn"
}
$(".t_email button").click(function () {
    ajax_S(url.t_email,temail,teac);
})

function teac(e){
    console.log(e.data)
    if(e.result==true){
        location.href="login_t.html";
        // var teaname = jQuery.parseJSON(e.data);
        $('.name_s').html(e.data.sName);
        $('.name_ema').html(e.data.UserID);
        localStorage.terEmail = e.data.UserID;
        localStorage.sid = e.data.nSchoolId;
        localStorage.tid=e.data.sCode;

    }else{
        layer.msg("教师邮箱不正确");
    }
}
//清除缓存
function clear(){
    localStorage.removeItem("teacherId");
    localStorage.removeItem("terEmail");
    localStorage.removeItem("schoolId");
    localStorage.removeItem("teacherName");
}


