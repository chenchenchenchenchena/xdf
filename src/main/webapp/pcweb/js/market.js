//访问doLogin.do
function toLogin() {

    var code_s = location.search.substring(location.search.indexOf('code') + 5, location.search.indexOf('&'));
    var state_s = location.search.substring(location.search.indexOf('state') + 6, location.search.length);
    var calbac = {
        'code': code_s,
        'e2State': state_s,
        'state': state_s
    };
    alert("code:" + code_s + "state_s:" + state_s);
    $.ajax({
        url: "http://dt.staff.xdf.cn/xdfdtmanager/e2Login/doLogin.do",
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(calbac),
        success: function (e) {
            showFunctionList(e);

        }
    });
}

//定义一个存放功能ID的数组
var functionIds = [];

//显示功能列表
function showFunctionList(json) {
    console.log(json);
    if (json.result == true) {
        setCookie("sid", json.sid, 1);
        setCookie("userName", json.userName, 1);
        // setCookie("loginId", json.loginId, 1);
        setCookie("userId", json.userId, 1);

        functionIds = [];

        var functionList = Array(json.functionList);

        //获取functionIds
        setFunctionList(functionList);
        localStorage.functionCheckedList = JSON.stringify(functionList);
        //保存功能列表functionIds
        setCookie("functionList", functionIds);
        jumpPage(functionList);
    }
}

//获取functionIds
function setFunctionList(f) {
    if (f.length > 0) {
        var children;
        for (var i = 0; i < f.length; i++) {
            var fun = f[i];
            var functionId = fun.id;
            var checked = fun.checked;
            if (checked) {
                try {
                    children = Array(fun.children);
                } catch (e) {
                    children = [];
                }
                functionIds.push(functionId);
                setFunctionList(children);
            }
        }
    }
}

//如果checked== true，则跳转页面
function jumpPage(functionList) {
    if (functionList.length > 0) {
        flag:
            for (var i = 0; i < functionList.length; i++) {
                var fun = functionList[i];
                var checked = fun.checked;
                if (checked) {
                    try {
                        var children = Array(fun.children);
                        console.log(children);
                        for (var j = 0; j < children.length; j++) {
                            var child = children[j];
                            var childChecked = child.checked;
                            try {
                                var url = child.url;
                                console.log(child.url);
                                if (childChecked) {
                                    window.location = url;
                                    break flag;
                                }
                            } catch (e) {
                                break flag;
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
    // $("#userId").val(getCookie("userId"));
    // $("#tokenId").val(getCookie("access_token"));
    // $("#schoolIdFinal").val(getCookie("schoolId"));
    // $("#areaIdFinal").val(getCookie("areaId"));
    // $("#deptIdFinal").val(getCookie("deptId"));
    $(".p176-nav-usename").html(getCookie("userName") + '<i class="p176-downIcon"></i>');
    // initNavigationBar();
    initMenu(funcId);
}

//初始化主页面菜单栏
function initMenu(funcId) {
    var functionList = JSON.parse(localStorage.functionCheckedList);
    var menu = "";
    for (var i = 0; i < functionList.length; i++) {
        var fun = functionList[i];
        var functionId = fun.id;
        var checked = fun.checked;
        var functionName = fun.name;
        var className = fun.className;
        var children;
        try {
            children = fun.children;
        } catch (e) {
            children = null;
        }
        if (checked) {
            menu += "<li>";
            menu += "<a href='javascript:;' title='" + functionName + "' data-functionId='" + functionId + "'>";
            menu += "<i class='" + className + "'></i>";
            menu += "<span class='collapse-hide fz18'>" + functionName + "</span>";
            menu += "</a>";
            if (children != null && children.length > 0) {
                menu += "<ul class='p176-expand-ul' style=''>";
                for (var j = 0; j < children.length; j++) {
                    var funChild = children[j];
                    var funChildName = funChild.name;
                    var funChildUrl;
                    try {
                        funChildUrl = funChild.url;
                    } catch (e) {
                        funChildUrl = null;
                    }
                    var funChildChecked = funChild.checked;
                    if (funChildChecked) {
                        if (funChildUrl == null) {
                            // funChildUrl = "../system/404.html"
                        }
                        menu += "<li>";
                        if (funChild.id == funcId) {
                            menu += "<a href='#' title='" + funChildName + "' class='on' data-functionId='" + funChild.id + "' onclick='changeMenu(this)' data-url='" + funChildUrl + "'>";
                        } else {
                            menu += "<a href='#' title='" + funChildName + "' class='' data-functionId='" + funChild.id + "' onclick='changeMenu(this)' data-url='" + funChildUrl + "'>";
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


//
function showList() {

}

function initNavigationBar() {
    var navigationList = $("[data-functionId]");
    var functionIds = getCookie("functionIds");
    if (functionIds.length > 0) {
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


var marketJs = {
    loginUserIsAdmin: function (loginId) {
        if (loginId != '' && loginId != null && loginId != undefined) {
            //判断登录人是否是超级管理员（目前超管userId是zsxdf）
            if (loginId == 'zsxdf') {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}