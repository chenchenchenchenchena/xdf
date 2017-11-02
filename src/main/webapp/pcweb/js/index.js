/* 概况 */

require(['jquery-1.11.0.min'], function () {

    /*css 兼容*/
    $('.index_forms li:nth-child(odd)').css('background', '#f5fbfa')
    $('.index_forms li:first-of-type').css({
        'background': '#fff',
        'color': '#bababa'
    })

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
            // url: url_o + "/e2Login/pcLogin.do",
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

                }

            }
        });
    }

    $('.loginBtn').click(function(){
        tLogin();
    });
//不走e2登陆
    function tLogin() {
        var loginName = document.getElementById("loginId").value;
        var loginPassword = document.getElementById("password").value;
        if(loginName == ""){

            layer.msg("登陆名不能为空", {icon: 5});
            return;
        }
        if(loginPassword == ""){
            layer.msg("登陆名不能为空", {icon: 5});
            return;
        }
        var signPassword = "";
        var DiagnoseApp = angular.module('myApp',['ui.router','ngCookies','ngFileUpload','Encrypt']);
        DiagnoseApp.controller('signPassword', function($scope, $rootScope, $http,$location, $timeout, $interval,Md5,Base64,Sha1) {
            // MD5加密当前日期
            signPassword = Md5.hex_md5(loginPassword);
        });
        //signPassword = $.md5(loginPassword);
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

                }

            }
        })

    }


    /**
     * 退出登录
     */
    function toLogout() {
        var url = "";
        var returnUrl = getRootPath();
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
                    clearCookie();
                    window.top.location.href = returnUrl;
                }
            }
        });
    }

})


/**
 * 获取左侧兰功能列表
 */
var functionList = localStorage.functionCheckedList;
function loadMenu() {
    if (functionList != undefined && functionList.length > 0) {

        for (var i = 0; i < functionList.length; i++) {
            $('#'+functionList[i].id).html(functionList[i].text);
        }
    }
}


