var onlineUrl = 'dt.xdf.cn';
if(window.location.host == onlineUrl){   //正式环境
    var url_o = 'http://dt.xdf.cn/xdfdtmanager/';
}else{    //测试环境
    var url_o = 'http://dt.staff.xdf.cn/xdfdtmanager/';
}
//不走e2登陆
$(function(){
    $('#password').keydown(function(event){
        if(event.keyCode ==13){
            tLogin()
        }
    });
});

function tLogin() {
    var loginName = document.getElementById("loginId").value;
    var loginPassword = document.getElementById("password").value;
    if (loginName == "") {

        layer.msg("登陆名不能为空", {icon: 5});
        return;
    }
    if (loginPassword == "") {
        layer.msg("登陆名不能为空", {icon: 5});
        return;
    }
    var signPassword = "";
    signPassword = $.md5(loginPassword);
    var calbac = {
        'loginId': loginName,
        'password': signPassword
    };

    $.ajax({
        url: url_o + "e2Login/adminLogin.do",
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(calbac),
        success: function (e) {
            console.log(e);
            if (e.result == false) {
                layer.msg(e.message);
            } else {
                sessionStorage.setItem("sid", e.sid, 1);
                sessionStorage.setItem("userName", e.userName, 1);
                sessionStorage.setItem("userId", e.userId, 1);
                var functionList = e.functionList;
                sessionStorage.superstar = JSON.stringify(functionList);
                var schoolID = '';
                for(i in e.userList){
                    if(i==e.userList.length-1){
                        schoolID+=e.userList[i].schoolId;
                    }else{
                        schoolID+=e.userList[i].schoolId+',';
                    }
                }
                localStorage.schoolList = schoolID;

                location.href = 'index.html#/index'
            }
        }
    })

}

///**
// * 退出登录
// */
//function toLogout() {
//    var url = "";
//    var returnUrl = window.location.host;
//    var currentUser = sessionStorage.getItem("userId");
//    if(currentUser == "ssdf"){
//        //表示当前用户为超级管理员
//        returnUrl = returnUrl + "/pcweb/login_web.html";
//        url = url_o + "logout/doAdminLogout.do"
//    }else {
//        url = url_o + "logout/doLogout.do";
//    }
//
//    var businessP = {"returnUrl": returnUrl, "sid": sessionStorage.getItem("sid")};
//    jQuery.ajax({
//        type: "POST",
//        url: url,
//        async: false,//同步
//        dataType: 'json',
//        data: JSON.stringify(businessP),
//        success: function (json) {
//            if (json.result == true) {
//                    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
//                    if (keys) {
//
//                        for (var i = keys.length; i--;)
//                            setCookie(keys[i], 1, -1);
//                    }
//                sessionStorage.removeItem("sid")
//                sessionStorage.removeItem("userId")
//                sessionStorage.removeItem("userName")
//                window.top.location.href = returnUrl;
//            }
//        }
//    });
//}