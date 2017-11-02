/**
 * Created by xupingwei on 2017/11/1.
 */
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
    app.controller('myCtrl', function($scope,$http) {
        var calbac = {
            'loginId': "ssdf@xdf.cn",
            'password': "ssdf!@#123"
        };

        var url_o = 'http://dt.xdf.cn/xdfdtmanager/';
        var url = url_o + "e2Login/adminLogin.do";
        $http({
            method: 'POST',
            url: url,
            data:calbac
        }).then(function successCallback(response){
            console.log(response);
        });
    });

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
