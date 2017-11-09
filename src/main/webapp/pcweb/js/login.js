var url_o = 'http://dt.xdf.cn/xdfdtmanager/';
function toLogin() {
    var code_s = location.search.substring(location.search.indexOf('code') + 5, location.search.indexOf('&'));
    var state_s = location.search.substring(location.search.indexOf('state') + 6, location.search.length);
    var calbac = {
        'code': code_s,
        'e2State': state_s,
        'state': state_s
    };
    $.ajax({
        url: url_o + "/e2Login/doLogin.do",
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(calbac),
        success: function (e) {
            console.log(e);
            if (e.result == false) {

                alert(e.message);
                toLogout();
            } else {

                sessionStorage.setItem("userName", e.userName, 1);
                var userId = e.userId;
                userId = userId.split('@')[0];

                sessionStorage.setItem("userId", userId, 1);
                showFunctionList(userId);
            }
        }
    });
}


//不走e2登陆
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

                alert(e.message);
            } else {
                sessionStorage.setItem("sid", e.sid, 1);
                sessionStorage.setItem("userName", e.userName, 1);
                sessionStorage.setItem("userId", e.userId, 1);
                showFunctionList(e.userId);
            }

        }
    })

}

//定义一个存放功能ID的数组
var functionIds = [];

//显示功能列表
function showFunctionList(userId) {
    var param = {"userId": userId};
    jQuery.ajax({
        type: "POST",
        url: url_o + "/function/getAllFunction.do",
        async: false,//同步
        dataType: 'json',
        // data: getCookie("userId"),
        data: JSON.stringify(param),
        success: function (e) {
            if (e.result && e.dataList != undefined && e.dataList != null) {
                var functionList = e.dataList;
                if (functionList == undefined || functionList.length == 0) {
                    alert("当前用户没用功能权限，请切换用户");
                    toLogout();
                } else {
                    //获取functionIds
                    //setFunctionList(e.dataList);
                    localStorage.functionCheckedList = JSON.stringify(functionList);
                    window.location.href = "index.html"
                }
            }

        }
    });
}

/**
 * 退出登录
 */
function toLogout() {
    var url = "";
    var returnUrl = window.location.host;
    var currentUser = sessionStorage.getItem("userId");
    if(currentUser == "ssdf"){
        //表示当前用户为超级管理员
        returnUrl = returnUrl + "/pcweb/login_web.html";
        url = url_o + "logout/doAdminLogout.do"
    }else {
        url = url_o + "logout/doLogout.do";
    }

    var businessP = {"returnUrl": returnUrl, "sid": sessionStorage.getItem("sid")};
    jQuery.ajax({
        type: "POST",
        url: url,
        async: false,//同步
        dataType: 'json',
        data: JSON.stringify(businessP),
        success: function (json) {
            if (json.result == true) {
                    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
                    if (keys) {

                        for (var i = keys.length; i--;)
                            setCookie(keys[i], 1, -1);
                    }
                sessionStorage.removeItem("sid")
                sessionStorage.removeItem("userId")
                sessionStorage.removeItem("userName")
                window.top.location.href = returnUrl;
            }
        }
    });
}