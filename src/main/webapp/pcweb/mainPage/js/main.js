// var baseUrl = "http://dt.staff.xdf.cn/xdfdtmanager/";

// var baseUrl = "http://10.73.81.106:8080/xdfdtmanager/";
// var loginUrl = "http://dt.staff.xdf.cn/xdfdtmanager/e2Login/login.do";

//访问doLogin.do
//走e2登陆
function toLogin() {

    var code_s = location.search.substring(location.search.indexOf('code') + 5, location.search.indexOf('&'));
    var state_s = location.search.substring(location.search.indexOf('state') + 6, location.search.length);
    var calbac = {
        'code': code_s,
        'e2State': state_s,
        'state': state_s
    };
    // alert("code:" + code_s + "state_s:" + state_s);
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
                // clearCookie();
                toLogout();
            } else {

                // setCookie("sid", e.sid, 1);
                setCookie("userName", e.userName, 1);
                setCookie("userId", e.userId, 1);
                var userId = e.userId;
                userId = userId.split('@')[0];

                showFunctionList(userId);
            }

        }
    });
}

//不走e2登陆
function tLogin() {
    var loginName = $('#loginId').val();
    var loginPassword = $('#password').val();
    if(loginName == ""){

        layer.msg("登陆名不能为空", {icon: 5});
        return;
    }
    if(loginPassword == ""){
        layer.msg("登陆名不能为空", {icon: 5});
        return;
    }
    // ssdf_1234
    var signPassword = $.md5(loginPassword);

    // alert(signPassword);

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

                setCookie("sid", e.sid, 1);
                setCookie("userName", e.userName, 1);
                setCookie("userId", e.userId, 1);

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
                    setFunctionList(e.dataList);
                    localStorage.functionCheckedList = JSON.stringify(functionList);
                    jumpPage(e.dataList);
                    // window.location = "mainPage/main_page.html";
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
    setCookie("functionIds", functionIds);

}

//如果checked== true，则跳转页面
function jumpPage(functionList) {

    if (functionList.length > 0) {
        flag:
            for (var i = 0; i < functionList.length; i++) {
                var checked = functionList[i].checked;
                if (checked) {
                    try {
                        console.log(functionList[i].children);
                        if (functionList[i].children == undefined) {
                            break flag;
                        } else {
                            for (var j = 0; j < functionList[i].children.length; j++) {
                                var childChecked = functionList[i].children[j].checked;
                                try {
                                    var url = functionList[i].children[j].url;
                                    console.log(url);
                                    if (childChecked) {
                                        window.location = url;
                                        break flag;
                                    }
                                } catch (e) {
                                    break flag;
                                }
                            }
                        }

                    } catch (e) {
                        break flag;
                    }


                }
            }
    }
}

//初始化主页面
function initMainPage(funcId) {

    // $("#loginId").val(getCookie("loginId"));
    $("#userId").val(getCookie("userId"));
    $("#tokenId").val(getCookie("access_token"));
    // $("#schoolIdFinal").val(getCookie("schoolId"));
    // $("#areaIdFinal").val(getCookie("areaId"));
    // $("#deptIdFinal").val(getCookie("deptId"));
    $(".p176-nav-usename").html(getCookie("userName") + '<i class="p176-downIcon"></i>');
    initNavigationBar();
    initMenu(funcId);
}

//初始化主页面菜单栏
function initMenu(funcId) {
    if (null != localStorage.functionCheckedList) {
        var functionList = JSON.parse(localStorage.functionCheckedList);
        var menu = "";
        for (var i = 0; i < functionList.length; i++) {
            var functionId = functionList[i].id;
            var checked = functionList[i].checked;
            var functionName = functionList[i].name;
            var className = functionList[i].className;
            var children;
            try {
                children = functionList[i].children;
            } catch (e) {
                children = null;
            }
            if (checked) {
                menu += "<li>";
                if(children == null || (children != undefined && children.length == 0)){
                    menu += "<a href='javascript:;' title='" + functionName + "' data-functionId='" + functionId + "' onclick='changeMenu(this)' data-url='" + functionList[i].url + "'>"
                }else {
                    menu += "<a href='javascript:;' title='" + functionName + "' data-functionId='" + functionId + "'>";
                }

                menu += "<i class='" + className + "'></i>";
                menu += "<span class='collapse-hide fz18'>" + functionName + "</span>";
                menu += "</a>";
                if (children != null && functionList[i].children.length > 0) {
                    menu += "<ul class='p176-expand-ul' style=''>";
                    for (var j = 0; j < functionList[i].children.length; j++) {
                        var funChildName = functionList[i].children[j].name;
                        var funChildUrl;
                        try {
                            funChildUrl = functionList[i].children[j].url;
                        } catch (e) {
                            funChildUrl = null;
                        }
                        var funChildChecked = functionList[i].children[j].checked;
                        if (funChildChecked) {
                            if (funChildUrl == null) {
                                // funChildUrl = "activity.html"
                            }
                            menu += "<li>";
                            if (functionList[i].children[j].id == funcId) {
                                menu += "<a href='#' title='" + funChildName + "' class='on' data-functionId='" + functionList[i].children[j].id + "' onclick='changeMenu(this)' data-url='" + funChildUrl + "'>";
                            } else {
                                menu += "<a href='#' title='" + funChildName + "' class='' data-functionId='" + functionList[i].children[j].id + "' onclick='changeMenu(this)' data-url='" + funChildUrl + "'>";
                            }
                            menu += "<span class='collapse-hide' >" + funChildName + "</span>";
                            menu += "</a>";
                            menu += "</li>";
                        }
                    }
                    menu += "</ul>";
                }

                menu += "</li>";
            }
            $(".mtop10").html(menu);
        }
    }


}

function changeMenu(this_){
    var url = $(_this)[0].dataset.url;
    window.top.location.href = window.location.host+"xdfdthome/pcweb/"+url;
}

function initNavigationBar() {
    var navigationList = $("[data-functionId]");
    var functionIds = getCookie("functionIds");
    if (null != functionIds && functionIds.length > 0) {
        functionIds = functionIds.split(",");
    }
    for (var i = 0; i < navigationList.length; i++) {
        var navigation = navigationList[i];
        var functionId = navigation.dataset.functionid;

        if (functionIds.length > 0) {
            if ($.inArray(functionId, functionIds) < 0) {
                navigation.style.display = "none";
            }
        } else {
            navigation.style.display = "none";
        }
    }
}

//新建筹课页面初始方法，根据权限隐藏发布按钮
function courseInfoInit() {
    var request = getRequest();
    var publish = request["publish"];
    if (publish == 'false') {
        $(".releaseBtn").css("display", "none");
    }
}


function getRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function toLogout() {
    var businessP = {"returnUrl": getRootPath(), "sid": getCookie("sid")};
    jQuery.ajax({
        type: "POST",
        // url: Global.actionURL,
        url: url_o + "logout/doLogout.do",
        async: false,//同步
        dataType: 'json',
        data: JSON.stringify(businessP),
        success: function (json) {
            if (json.result == true) {
                clearCookie();
                window.top.location.href = json.logoutUrl;
            }
        }
    });
}