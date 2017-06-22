function toLogin(serviceId) {

    var code_s = location.search.substring(location.search.indexOf('code') + 5, location.search.indexOf('&'));
    var state_s = location.search.substring(location.search.indexOf('state') + 6, location.search.length);
    var calbac = {
        'code': code_s,
        'e2State': state_s,
        'state': state_s
    };
    alert("code:"+code_s+"state_s:"+state_s);
    // var param = constructionParams(rsaEncryptedString(calbac), serviceId);
    $.ajax({
        url: "http://dt.staff.xdf.cn/xdfdtmanager/e2Login/pcLogin.do",
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(param),
        success: function (e) {
            showFunctionList(e);

        }
    });
}

var functionIds = [];

//显示功能列表
function showFunctionList(json) {
    alert(json.result);
    if (json.result == true) {
        setCookie("sid", json.sid, 1);
        setCookie("userName", json.userName, 1);
        setCookie("loginId", json.loginId, 1);
        setCookie("userId", json.userId, 1);
        setSoukeCookie(json);
        functionIds = [];
        var functionList = json.functionList;
        setFunctionList(functionList);
        localStorage.functionCheckedList = JSON.stringify(functionList);
        //功能列表
        setCookie("functionList", functionIds);
        jumpPage(json.functionList);
    } else {
        layer.msg(json.message, {icon: 5});

        setTimeout("toLogout('91411a1a05fd4571859044ed18892ac1')", 5000);
    }
}

//状态 0:待发布，1：未开始，2：进行中，3：已结束，4：提前结束'
function showList(page, cityId, areaId, deptId, status) {
    if (cityId == null) {
        cityId = "";
    }
    if (areaId == null) {
        areaId = "";
    }
    if (deptId == null) {
        deptId = "";
    }
    var nameText = $("#nameText").val();
    if (nameText == null) {
        nameText = "";
    }
    var requestJson = {
        schoolId: cityId,
        loginId: getCookie("loginId"),
        areaId: areaId,
        deptId: deptId,
        status: status,
        nameText: nameText,
        currentPage: page,
        pageSize: pageSize
    };
    var serverId = "";
    if (currentType == 1) { //筹课抽奖
        serverId = "066495bbda9341e5b379043259dd7a23";
    } else if (currentType == 2) {  //筹课
        serverId = "63e8e90eeb984ab38bc81394e2c43d8f";
    }
    var d = constructionParams(rsaEncryptedString(requestJson), serverId);
    jQuery.ajax({
        type: "POST",
        url: Global.actionURL,
        async: false,//同步
        dataType: 'json',
        data: JSON.stringify(d),
        success: function (json) {
            if (json.result == true) {
                totalCounts = json.totalCount;
                initPage(totalCounts, page);
                var ckList = json.dataList;
                var str = "";
                for (var i = 0; i < ckList.length; i++) {
                    var id = ckList[i]["id"];
                    var name = ckList[i]["name"];
                    if (currentType == 1) {//筹课抽奖
                        var time = ckList[i]["time"];
                        var rewardTime = ckList[i]["rewardTime"];
                        if (rewardTime != null && rewardTime != "") {
                            if (timeText != "") {
                                timeText += "</br>";
                            }
                            timeText += "奖品已抽完:历时" + rewardTime + "小时";
                        }
                    } else if (currentType == 2) {  //筹课
                        var time = ckList[i]["r_time"];
                    }
                    var statuss = ckList[i]["status"];
                    var statusText = "";
                    if (statuss == 0) {
                        statusText = "待发布"
                    }
                    if (statuss == 1) {
                        statusText = "未开始"
                    }
                    if (statuss == 2) {
                        statusText = "进行中"
                    }
                    if (statuss == 3) {
                        statusText = "已结束"
                    }
                    if (statuss == 4) {
                        statusText = "提前结束"
                    }

                    var fundTime = ckList[i]["fundTime"];
                    var forceTime = ckList[i]["forceTime"];

                    var timeText = "";
                    if (fundTime != null && fundTime != "") {
                        timeText += "名额已满:历时" + fundTime + "小时";
                    }
                    if (forceTime != null && forceTime != "") {
                        if (timeText != "") {
                            timeText += "</br>";
                        }
                        timeText += "手动结束:历时" + forceTime + "小时";
                    }

                    if (i % 2 == 1) {
                        str += "<tr class='table-tr-odd'>"
                    } else {
                        str += "<tr class='table-tr-even'>"
                    }

                    str += "<td style='display:none'>" + id + "</td>";
                    str += "<td id='name'>" + name + "</td>";
                    str += "<td id='time'>" + time + "</td>";

                    if ((statuss == 2 || statuss == 4) && timeText != "") {
                        str += "<td id='status'>" + statusText + "<div id='menus' onmouseover='pops(this)'" +
                            " onmouseout='pops(this)'><div class='aa' style='display:none'>" + timeText + "</div></div></td>";
                    } else {
                        str += "<td id='status'>" + statusText + "</td>";
                    }

                    str += "<td>";
                    str += "<div class='p176-share'>";
                    str += "<a href='javascript:;' onclick='openWeChat(this,\"" + id + "\")' class='p176-share-icon" +
                        " js-share-drop' ></a>";
                    str += "<div class='p176-share-wrap'>";
                    str += "<div class='p176-share-con clearfix'>";
                    str += "<ul class='p176-share-left'>";
                    str += "<li class='p176-wx'><a href='javascript:;'><i></i>微信扫描二维码</a></li>";
                    str += "<li class='mLeft20 mtop10'><img style='width:150px;height:150px'" +
                        " src='../../images/wxcode.png' alt=''></li>";
                    str += "</ul>";
                    str += "</div>";
                    //str += "<div class='p176-share-con clearfix'>";
                    //str += "<a" +
                    //    " href='http://xytest.staff.xdf.cn/wechat_v1.5/activity/activityInfo.aspx?channel=Wechat&activityId=" + id
                    //str += "' >分享链接</a>";
                    //str += "</div>"
                    str += "<div class='p176-share-bottom'>";
                    str += "<a href='javascript:;' onclick='closeWeChat(this)' style='padding:6px" +
                        " 22px;background:red;color:#fff;margin-left:10px;line-height:32px;' >关闭</a>";
                    str += "</div>";
                    str += "</div>";
                    str += "</div>";
                    str += "</td>";
                    str += "<td>";
                    str += "<div class='p176-table-btnGroup'>";
                    str += "<a href='#' onclick='copyTemplate(\"" + id + "\")' class='p176-btn-copy'" +
                        " data-functionId='10201'><i></i>复制模版</a>";
                    if (statuss == 0 || statuss == 1) {
                        str += "<a href='#' onclick='ckEdit(\"" + id + "\", \"" + areaId + "\")' class='p176-btn-edit'" +
                            " data-functionId='10202'><i></i>编辑</a>";
                    }
                    if (statuss == 0) {
                        var userId = getCookie("loginId");
                        str += "<a href='#' onclick='ckPublish(\"" + id + "\", \"" + userId + "\")'" +
                            " class='p176-btn-release' data-functionId='10203'><i></i>发布</a>";
                        str += "<a href='#' onclick='ckDelete(\"" + id + "\", \"" + userId + "\")'" +
                            " class='p176-btn-release'><i></i>删除</a>";
                    }
                    if (statuss == 1) {
                        str += "<a href='#' onclick='ckRollback(\"" + id + "\")' class='p176-btn-recall" +
                            " js-recallBtn' data-functionId='10203'><i></i>撤回</a>";
                    }
                    if (statuss == 2) {
                        str += "<a href='#' onclick='over(\"" + id + "\")' class='p176-btn-end'" +
                            " data-functionId='10203'><i></i>结束</a>";
                    }
                    str += "</div>";
                    str += "</td>";
                    str += "</tr>";
                }
                $("#ckListTbody").html(str);
            } else {
                layer.msg("查询失败!", {icon: 5});
            }
            initNavigationBar();
        }
    });
}


function setSoukeCookie(json) {
    var soukeData = json.soukeData;
    //授课
    setCookie("soukeData", soukeData, 1);
}

function setFunctionList(functionList) {
    if (functionList.length > 0) {
        for (var i = 0; i < functionList.length; i++) {
            var fun = functionList[i];
            var functionId = fun.id;
            var checked = fun.checked;
            if (checked) {
                functionIds.push(functionId);
                setFunctionList(fun.children);
            }
        }
    }
}

function jumpPage(functionList) {
    if (functionList.length > 0) {
        flag:
            for (var i = 0; i < functionList.length; i++) {
                var fun = functionList[i];
                var checked = fun.checked;
                if (checked) {
                    var children = fun.children;
                    for (var j = 0; j < children.length; j++) {
                        var child = children[j];
                        var childChecked = child.checked;
                        var url = child.url.substring(1);
                        if (childChecked) {
                            window.location = url;
                            break flag;
                        }
                    }
                }
            }
    }
}

function toLogout(serviceId) {
    var businessP = {"returnUrl": getRootPath() + "/index.html", "sid": getCookie("sid")};
    var param = constructionParams(rsaEncryptedString(businessP), serviceId);
    jQuery.ajax({
        type: "POST",
        url: Global.actionURL,
        async: false,//同步
        dataType: 'json',
        data: JSON.stringify(param),
        success: function (json) {
            if (json.result == true) {
                clearCookie();
                window.top.location.href = json.logoutUrl;
            }
        }
    });
}
function initMainPage(funcId) {
    $("#loginId").val(getCookie("loginId"));
    $("#userId").val(getCookie("userId"));
    $("#tokenId").val(getCookie("access_token"));
    $("#schoolIdFinal").val(getCookie("schoolId"));
    $("#areaIdFinal").val(getCookie("areaId"));
    $("#deptIdFinal").val(getCookie("deptId"));
    $(".p176-nav-usename").html(getCookie("userName") + '<i class="p176-downIcon"></i>');
    //initNavigationBar();
    initMenu(funcId);
    getSchoolNames();
    //initFrameContent();
}

function initMenu(funcId) {
    var functionList = JSON.parse(localStorage.functionCheckedList);
    var menu = "";
    for (var i = 0; i < functionList.length; i++) {
        var fun = functionList[i];
        var functionId = fun.id;
        var checked = fun.checked;
        var functionName = fun.name;
        var className = fun.className;
        var children = fun.children;
        if (checked) {
            menu += "<li>";
            menu += "<a href='javascript:;' title='" + functionName + "' data-functionId='" + functionId + "'>";
            menu += "<i class='p176-class-icon " + className + "'></i>";
            menu += "<span class='collapse-hide fz18'>" + functionName + "</span>";
            menu += "</a>";
            if (children != null && children.length > 0) {
                menu += "<ul class='p176-expand-ul' style=''>";
                for (var j = 0; j < children.length; j++) {
                    var funChild = children[j];
                    var funChildName = funChild.name;
                    var funChildUrl = funChild.url;
                    var funChildChecked = funChild.checked;
                    if (funChildChecked) {
                        if (funChildUrl == null) {
                            funChildUrl = "../system/404.html"
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


function initFrameContent() {
    var navigationList = $("[data-url]");

    if (navigationList.length > 0) {
        for (var i = 0; i < navigationList.length; i++) {
            var navigation = navigationList[i];

            if ("none" != navigation.style.display) {
                var url = navigation.dataset.url;
                $(".p176-expand-ul").find("a").removeClass("on");
                $(navigation).parent("a").addClass("on");
                //$("#centerIframeId").attr("src", url);
                break;
            }
        }
    }
}


function getSchoolNames() {
    var businessP = {"loginId": getCookie("loginId"), "userId": getCookie("userId")};
    var param = constructionParams(rsaEncryptedString(businessP), "3577775ef8e849d9ab63dad2202584e0");
    jQuery.ajax({
        type: "POST",
        url: Global.actionURL,
        // url: "http://localhost:8080/market/sschool/getSschoolListByUser.do",
        async: false,//同步
        dataType: 'json',
        data: JSON.stringify(param),
        success: function (json) {
            if (json.result == true) {
                setSchoolNames(json.dataList);
            }
        }
    });
}

function setSchoolNames(schoolNames) {
    if (schoolNames.length > 0) {
        $("#schoolName1").html(getCookie("schoolName") == null ? schoolNames[0].sName : getCookie("schoolName") + '<i class="dropdown-white"></i>');
        $("#schoolIdFinal").val(getCookie("schoolId") == null ? schoolNames[0].sCode : getCookie("schoolId"));


        setCookie("schoolId", getCookie("schoolId") == null ? schoolNames[0].sCode : getCookie("schoolId"), 1);
        setCookie("schoolName", getCookie("schoolName") == null ? schoolNames[0].sName : getCookie("schoolName"), 1);
        $("#schoolName1").show();

        getAreaName(getCookie("schoolId") == null ? schoolNames[0].sCode : getCookie("schoolId"));
        getDeptNames(getCookie("schoolId") == null ? schoolNames[0].sCode : getCookie("schoolId"));

        var $schoolName = $("#schoolName");
        for (var i = 0; i < schoolNames.length; i++) {
            $schoolLi = $("<li id='" + schoolNames[i].sCode + "'>" + schoolNames[i].sName + "</li>");
            $schoolLi.click(
                function () {
                    $("#schoolName1").html($(this).text() + '<i class="dropdown-white"></i>');
                    $(".b-sub-menu").hide();
                    $(".js-ads-drop a").removeClass('on');
                    $("#schoolIdFinal").val($(this).attr("id"));
                    $("#areaIdFinal").val("");
                    $("#deptIdFinal").val("");
                    setCookie("schoolId", $(this).attr("id"), 1);
                    setCookie("schoolName", $(this).text(), 1);
                    setCookie("areaId", "", 1);
                    setCookie("areaName", "", 1);
                    setCookie("deptId", "", 1);
                    setCookie("deptName", "", 1);
                    $("#areaName").children().remove();
                    $("#deptName").children().remove();
                    getAreaName($(this).attr("id"));
                    getDeptNames($(this).attr("id"));
                    location.reload();
                }
            );
            $schoolName.append($schoolLi);
        }
    }
}

function getAreaName(schoolId) {

    var businessP = {"loginId": getCookie("loginId"), "userId": getCookie("userId"), "nSchoolId": schoolId};
    var param = constructionParams(rsaEncryptedString(businessP), "8ec2ce035be84cde916f6c0772fab0e1");

    jQuery.ajax({
        type: "POST",
        url: Global.actionURL,
        // url: "http://localhost:8080/market/sschool/getSschoolListByUser.do",
        async: false,//同步
        dataType: 'json',
        data: JSON.stringify(param),
        success: function (json) {
            if (json.result == true) {
                setAreaName(json.dataList);
            }
        }
    });
}

function getDeptNames(schoolId) {
    var businessP = {"loginId": getCookie("loginId"), "userId": getCookie("userId"), "nSchoolId": schoolId};
    var param = constructionParams(rsaEncryptedString(businessP), "53fb691dae024332bad735c419efda19");
    jQuery.ajax({
        type: "POST",
        url: Global.actionURL,
        // url: "http://localhost:8080/market/sdept/getSdeptList.do",
        async: false,//同步
        dataType: 'json',
        data: JSON.stringify(param),
        success: function (json) {
            if (json.result == true) {
                setDeptNames(json.dataList);
            }
        }
    });
}

function setAreaName(areaNames) {
    var userId = getCookie("loginId");
    if (marketJs.loginUserIsAdmin(userId)) {
        var all = {sCode: "All", sName: "全部"};
        areaNames.splice(0, 0, all);

    }
    if (areaNames.length > 0) {
        $("#areaName1").html((getCookie("areaName") ? getCookie("areaName") : areaNames[0].sName) + '<i' +
            ' class="dropdown-white"></i>');
        var sCode = getCookie("areaId") ? getCookie("areaId") : areaNames[0].sCode;
        if (sCode == "All") {
            sCode = "";
        }
        setCookie("areaId", sCode, 1);
        setCookie("areaName", getCookie("areaName") ? getCookie("areaName") : areaNames[0].sName, 1);
        $("#areaName1").show();

        var $areaName = $("#areaName");
        for (var i = 0; i < areaNames.length; i++) {
            $areaLi = $("<li id='" + areaNames[i].sCode + "'>" + areaNames[i].sName + "</li>");
            $areaLi.click(
                function () {
                    $("#areaName1").html($(this).text() + '<i class="dropdown-white"></i>');
                    $(".a-sub-menu").hide();
                    var areaId = $(this).attr("id");
                    if (areaId == "All") {
                        areaId = "";
                    }
                    $("#areaIdFinal").val(areaId);
                    setCookie("areaId", areaId, 1);
                    setCookie("areaName", $(this).text(), 1);
                    $(".js-area-drop a").removeClass('on');
                    location.reload();
                }
            );
            $areaName.append($areaLi);
        }
    }

}

function setDeptNames(deptNames) {
    if (deptNames.length > 0) {
        $("#deptName1").html((getCookie("deptName") ? getCookie("deptName") : deptNames[0].sName) + '<i' +
            ' class="dropdown-white"></i>');
        setCookie("deptId", getCookie("deptId") ? getCookie("deptId") : deptNames[0].sCode, 1);
        setCookie("deptName", getCookie("deptName") ? getCookie("deptName") : deptNames[0].sName, 1);
        $("#deptName1").show();

        var $deptName = $("#deptName");
        for (var i = 0; i < deptNames.length; i++) {
            $deptLi = $("<li id='" + deptNames[i].sCode + "'>" + deptNames[i].sName + "</li>");
            $deptLi.click(
                function () {
                    $("#deptName1").html($(this).text() + '<i class="dropdown-white"></i>');
                    $(".p-sub-menu").hide();
                    $("#deptIdFinal").val($(this).attr("id"));
                    setCookie("deptId", $(this).attr("id"), 1);
                    setCookie("deptName", $(this).text(), 1);
                    location.reload();
                }
            );
            $deptName.append($deptLi);
        }
    }

}

function modifyPwd(serviceId) {
    var passwordR = $("#oldPwd").val();
    var passwordN = $("#newPwd").val();
    var passwordNC = $("#newPwdC").val();

    if (passwordR.replace(/^\s+|\s+$/g, "") == '') {
        layer.msg("请输入密码", {icon: 5});
        $("#oldPwd").focus();
        return false;
    }
    if (passwordR.replace(/^\s+|\s+$/g, "").length < 6) {
        layer.msg("密码长度最低为六位.", {icon: 5});
        $("#oldPwd").focus();
        return false;
    }
    if (passwordR.replace(/^\s+|\s+$/g, "").length > 18) {
        layer.msg("密码最大长度为十八位.", {icon: 5});
        $("#oldPwd").focus();
        return false;
    }
    if (passwordN.replace(/^\s+|\s+$/g, "") == '') {
        layer.msg("请输入新密码", {icon: 5});
        $("#newPwd").focus();
        return false;
    }
    if (passwordN.replace(/^\s+|\s+$/g, "").length < 6) {
        layer.msg("新密码长度最低为六位.", {icon: 5});
        $("#newPwd").focus();
        return false;
    }
    if (passwordN.replace(/^\s+|\s+$/g, "").length > 18) {
        layer.msg("新密码最大长度为十八位.", {icon: 5});
        $("#newPwd").focus();
        return false;
    }
    if (passwordNC.replace(/^\s+|\s+$/g, "") == '') {
        layer.msg("请输入确认密码", {icon: 5});
        $("#newPwdC").focus();
        return false;
    }
    if (passwordNC.replace(/^\s+|\s+$/g, "").length < 6) {
        layer.msg("确认密码长度最低为六位.", {icon: 5});
        $("#newPwdC").focus();
        return false;
    }
    if (passwordNC.replace(/^\s+|\s+$/g, "").length > 18) {
        layer.msg("确认密码最大长度为十八位.", {icon: 5});
        $("#newPwdC").focus();
        return false;
    }
    if (passwordN.replace(/^\s+|\s+$/g, "") != passwordNC.replace(/^\s+|\s+$/g, "")) {
        layer.msg("两次输入的密码不一致,请重新输入.", {icon: 5});
        $("#newPwdC").focus();
        return false;
    }
    var businessP = {"userId": getCookie("userId"), "oldPwd": passwordR, "newPwd": passwordN};
    var param = constructionParams(rsaEncryptedString(businessP), serviceId);
    jQuery.ajax({
        type: "POST",
        url: Global.actionURL,
        async: false,//同步
        dataType: 'json',
        data: JSON.stringify(param),
        success: function (json) {
            if (json.result == true) {
                layer.msg(json.message, {icon: 6});
                toLogout("91411a1a05fd4571859044ed18892ac1");
            } else {
                layer.msg(json.message, {icon: 5});
            }
        }
    });
}
function getPageContent() {
    var content = $("#divHidden")[0].innerHTML;
    $("#divPage")[0].innerHTML = content;
}

function tLogin() {
    var param = {"code": code, "state": state, "e2State": e2State};
    jQuery.ajax({
        type: "POST",
        url: "./../tlogin.do",
        async: true,//同步
        dataType: 'json',
        data: JSON.stringify(param),
        success: function (json) {
            if (json.result == true) {
                window.location = "mainPage.html";
                setCookie("sid", json.sid, 1);
                setCookie("userName", json.userName, 1);
                setCookie("loginId", json.loginId, 1);
                setCookie("userId", json.userId, 1);
                setSoukeCookie(json);
                functionIds = [];
                setFunctionList(json.functionList);
                setCookie("functionIds", functionIds);
            } else {
                layer.msg(json.message, {icon: 5});
                toLogout("91411a1a05fd4571859044ed18892ac1");
            }
        }
    });
}

//新建筹课页面初始方法，根据权限隐藏发布按钮
function courseInfoInit() {
    var request = getRequest();
    var publish = request["publish"];
    if (publish == 'false') {
        $(".releaseBtn").css("display", "none");
    }
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

/*
 //模态加载
 function showLoading() {
 var loadDiv = [];
 //页面有滚动条，获取整个body的高度；
 var height = document.body.scrollHeight + 'px';
 loadDiv.push('<div id="myLoadingModal" ');
 loadDiv.push('style="z-index:2000;top:0px;position:absolute;height:'+ height +';width:100%;background-color:white;opacity: 0.9;text-align:center;"');
 loadDiv.push('>');
 loadDiv.push('<img src="' + getRootPath() + '/images/loading/loading-1.gif" style="left:45%;top:40%;position:fixed;">');
 loadDiv.push('</div>');
 $("body").append(loadDiv.join(""));
 }
 //模态加载取消
 function hideLoading() {
 var $loading = $("#myLoadingModal");
 $loading.hide();
 $loading.remove();
 }
 */