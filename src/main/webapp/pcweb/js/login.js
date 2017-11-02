/**
 * Created by liwei on 2017/11/1.
 */
//走e2登录
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
    var signPassword;
    var DiagnoseApp = angular.module('DiagnoseApp',['ui.router','ngCookies','ngFileUpload','Encrypt']);
    DiagnoseApp.controller('signPassword', function($scope, $rootScope, $http,$location, $timeout, $interval,Md5,Base64,Sha1) {
        // MD5加密当前日期
        $scope.md5vule = Md5.hex_md5(loginPassword);
    });

    var calbac = {
        'loginId': loginName,
        'password': signPassword
    };

    var url_o = 'http://dt.xdf.cn/xdfdtmanager/';
    var url = url_o + "e2Login/adminLogin.do";

    //app.controller('myCtrl', function($scope, $http) {
    //
    //    $scope.firstName= "John";
    //    $scope.lastName= "Doe";

        //$http.post(url, calbac).success(function (response){
        //    console.log(e);
        //    if (e.result == false) {
        //
        //        alert(e.message);
        //    } else {
        //
        //        sessionStorage.setItem("sid", e.sid, 1);
        //        sessionStorage.setItem("userName", e.userName, 1);
        //        sessionStorage.setItem("userId", e.userId, 1);
        //
        //    }
        //});

    //});

    //$.ajax({
    //    url: url_o + "e2Login/adminLogin.do",
    //    type: 'post',
    //    dataType: 'json',
    //    data: JSON.stringify(calbac),
    //    success: function (e) {
    //        console.log(e);
    //        if (e.result == false) {
    //
    //            alert(e.message);
    //        } else {
    //
    //            sessionStorage.setItem("sid", e.sid, 1);
    //            sessionStorage.setItem("userName", e.userName, 1);
    //            sessionStorage.setItem("userId", e.userId, 1);
    //
    //        }
    //
    //    }
    //})
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
                    setFunctionList(e.dataList);
                    localStorage.functionCheckedList = JSON.stringify(functionList);
                }
            }

        }
    });


}

//获取functionIds
function setFunctionList(f) {
    if (f.length > 0) {
        for (var i = 0; i < f.length; i++) {
            var functionId = f[i].id;
            var checked = f[i].checked;
            if (checked) {
                functionIds.push(functionId);
                if (f[i].children != undefined) {
                    setFunctionList(f[i].children);
                }
            }
        }
    }
    //保存功能列表functionIds
    sessionStorage.setItem("functionIds", functionIds);
}