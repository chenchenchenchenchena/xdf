// var baseUrl = "http://dt.staff.xdf.cn/xdfdtmanager/";

// var baseUrl = "http://10.73.81.106:8080/xdfdtmanager/";
var loginUrl = "http://dt.staff.xdf.cn/xdfdtmanager/e2Login/login.do";
//访问doLogin.do
function toLogin() {

    var code_s = location.search.substring(location.search.indexOf('code') + 5, location.search.indexOf('&'));
    var state_s = location.search.substring(location.search.indexOf('state') + 6, location.search.length);
    var calbac = {
        'code': code_s,
        'e2State': state_s,
        'state': state_s
        // 'userId': "v_liwei8"
    };
    // alert("code:" + code_s + "state_s:" + state_s);
    $.ajax({
        url: baseUrl + "/e2Login/doLogin.do",
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
                showFunctionList(e);
            }

        }
    });
    // var e = {"result": true, "sid": "", "userName": "v_liwei8", "userId": "TC23"}
    // showFunctionList(e);
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

        // functionIds = [];
        var functionList = json.functionList;
        // var functionList = [{
        //     'id': "101",
        //     'checked': true,
        //     'name': "作业",
        //     'className': "HX001",
        //     'children': [{
        //         'id': "10101",
        //         'name': "出门表",
        //         'url': 'raiseMain.html',
        //         'checked': true
        //     }, {
        //         'id': "10102",
        //         'name': "入门表",
        //         'url': 'raiseMain.html',
        //         'checked': true
        //     }]
        // }, {
        //     'id': "102",
        //     'checked': true,
        //     'name': "课表",
        //     'className': "HX001",
        //     'children': [{
        //         'id': "10201",
        //         'name': "出门表",
        //         'url': "",
        //         'checked': true
        //     }, {
        //         'id': "10202",
        //         'name': "入门表",
        //         'url': 'raiseMain.html',
        //         'checked': true
        //     }]
        // }, {
        //     'id': "103",
        //     'checked': true,
        //     'name': "学情",
        //     'className': "HX001",
        //     'children': [{
        //         'id': "10301",
        //         'name': "出门表",
        //         'url': 'raiseMain.html',
        //         'checked': true
        //     }, {
        //         'id': "10302",
        //         'name': "入门表",
        //         'url': 'raiseMain.html',
        //         'checked': true
        //     }]
        // }, {
        //     'id': "104",
        //     'checked': true,
        //     'name': "账号权限",
        //     'className': "HX001",
        //     'children': [{
        //         'id': "10401",
        //         'name': "帐号管理",
        //         'url': 'userList.html',
        //         'checked': true
        //     }]
        // }];
        if (functionList == undefined || functionList.length == 0) {
            alert("当前用户没用功能权限，请切换用户");
            toLogout();
        } else {
            //获取functionIds
            setFunctionList(json.functionList);
            localStorage.functionCheckedList = JSON.stringify(functionList);
            jumpPage(json.functionList);
        }


    }
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
                menu += "<a href='javascript:;' title='" + functionName + "' data-functionId='" + functionId + "'>";
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