var weOpenFlag = 0;
var totalCounts = 0;
var currentPage = 1;
var pageSize = 15;
var currentCityId = '1';
var currentAreaId = '';
var currentDeptId = '';
var switchFlag = false;
var firstIn = true;
var currentType = 2;
var currentStatus = '';
var baseUrl = "http://dt.staff.xdf.cn/xdfdtmanager/";
// var baseUrl = "http://10.73.81.106:8080/xdfdtmanager/";

$(function () {
    var request = getRequest();
    var type = request["type"];
    if (type != '' && type != null && type != undefined) {
        currentType = type;
    }
});

function initPage(totalCounts, currentPage) {
    if (totalCounts != null && totalCounts != 0) {
        $.jqPaginator("#publicPage", {
            totalCounts: totalCounts,
            pageSize: pageSize,
            visiblePages: 10,
            currentPage: currentPage,
            prev: '<a class="pPrev" href="javascript:;">上一页</a>',
            next: '<a class="pNext" href="javascript:;">下一页</a>',
            page: '<a href="javascript:;">{{page}}</a>',
            activeClass: 'pCurrent',
            onPageChange: function (num, type) {
                if (type != "init") {
                    showList(num);
                }
            }
        });
    } else {
        $("#publicPage").html("");
    }
}
//搜索
function search() {
    firstIn = true;
    showList(1, currentCityId, currentAreaId, currentDeptId, currentStatus);
}

//新建发布信息
function createCk() {

    var publish = true;
    changeCenter('./setPublishInfo.html?publish=' + publish);
}


function changeTag() {
    $(".xdf_border").removeClass("xdf_border");
    $("#xdf_recommend").children()[currentType - 1].className = "xdf_border";
    var head = "";
    if (currentType == 1 || currentType == 2) {
        if (currentType == 1) {
            $(".set-new").html("<i></i>筹课抽奖");
            head += '<th width="20%">筹课名称</th>';
        }
        if (currentType == 2) {
            $(".set-new").html("<i></i>筹课");
            head += '<th width="20%">活动标题</th>';
        }
        //$(".li1").removeClass("li1");
        //$(".list1").children()[1].style.display = "none";
        //$("#m1").hide();

        head += '<th width="30%">筹课时间</th>';
        head += '<th width="12%">状态</th>';
        head += '<th width="10%">分享设置</th>';
        head += '<th width="30%">操作</th>';
    } else {
        $(".set-new").html("<i></i>点赞");
        //$(".list1").children()[0].className = "li1";
        //$(".list1").children()[1].style.display = "block";
        //$("#m1").show();
        head += '<th width="20%">名称</th>';
        head += '<th width="30%">活动时间</th>';
        head += '<th width="12%">状态</th>';
        head += '<th width="10%">分享设置</th>';
        head += '<th width="30%">操作</th>';
    }
    $("#ckListHead").html(head);
}


function pops(_this) {
    $(_this).find("div").first().toggle();
}

//状态 0:待发布，1：未开始，2：进行中，3：已结束，4：提前结束'
function showList(page) {
    var requestJson = {
        currentPage: page,
        pageSize: pageSize
    };
    jQuery.ajax({
        type: "POST",
        url: baseUrl + "raiseClass/getNewCkList.do",
        async: false,//同步
        dataType: 'json',
        data: JSON.stringify(requestJson),
        success: function (json) {
            console.log(json);
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
                    var status = ckList[i]["status"];
                    var statusText = "";
                    if (status == 0) {
                        statusText = "待发布"
                    }
                    if (status == 1) {
                        statusText = "未开始"
                    }
                    if (status == 2) {
                        statusText = "进行中"
                    }
                    if (status == 3) {
                        statusText = "已结束"
                    }
                    if (status == 4) {
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

                    if ((status == 2 || status == 4) && timeText != "") {
                        str += "<td id='status'>" + statusText + "<div id='menus' onmouseover='pops(this)'" +
                            " onmouseout='pops(this)'><div class='aa' style='display:none'>" + timeText + "</div></div></td>";
                    } else {
                        str += "<td id='status'>" + statusText + "</td>";
                    }

                    str += "<td>";
                    // str += "<div class='p176-share'>";
                    // str += "<a href='javascript:;' onclick='openWeChat(this,\"" + id + "\")' class='p176-share-icon" +
                    //     " js-share-drop' ></a>";
                    // str += "<div class='p176-share-wrap'>";
                    // str += "<div class='p176-share-con clearfix'>";
                    // str += "<ul class='p176-share-left'>";
                    // str += "<li class='p176-wx'><a href='javascript:;'><i></i>微信扫描二维码</a></li>";
                    // str += "<li class='mLeft20 mtop10'><img style='width:150px;height:150px' alt=''></li>";
                    // str += "</ul>";
                    // str += "</div>";
                    //str += "<div class='p176-share-con clearfix'>";
                    //str += "<a" +
                    //    " href='http://xytest.staff.xdf.cn/wechat_v1.5/activity/activityInfo.aspx?channel=Wechat&activityId=" + id
                    //str += "' >分享链接</a>";
                    //str += "</div>"
                    str += "<div class='p176-share-bottom'>";
                    // str += "<a href='javascript:;' onclick='closeWeChat(this)' style='padding:6px" +
                    //     " 22px;background:red;color:#fff;margin-left:10px;line-height:32px;' >关闭</a>";
                    str += "</div>";
                    // str += "</div>";
                    // str += "</div>";
                    str += "</td>";
                    str += "<td>";
                    str += "<div class='p176-table-btnGroup'>";
                    str += "<a href='#' class='p176-btn-copy'" +
                        " data-functionId='101'><i></i>复制模版</a>";
                    if (status == 0 || status == 1) {
                        str += "<a href='#' onclick='ckEdit(\"" + id + "\")' class='p176-btn-edit'" +
                            " data-functionId='10202'><i></i>编辑</a>";
                    }
                    if (status == 0) {
                        var userId = getCookie("loginId");
                        str += "<a href='#' " +
                            " class='p176-btn-release' onclick='ckPublish(\"" + id + "\")' data-functionId='101'><i></i>发布</a>";
                        str += "<a href='#' onclick='ckDelete(\"" + id + "\")' class='p176-btn-release'><i></i>删除</a>";
                    }
                    if (status == 1) {
                        str += "<a href='#'  class='p176-btn-recall" +
                            " js-recallBtn' onclick='ckRollback(\"" + id + "\")' data-functionId='101'><i></i>撤回</a>";
                    }
                    if (status == 2) {
                        str += "<a href='#' onclick='over(\"" + id + "\")' class='p176-btn-end'" +
                            " data-functionId='101'><i></i>结束</a>";
                    }
                    str += "</div>";
                    str += "</td>";
                    str += "</tr>";
                }
                $("#ckListTbody").html(str);
            } else {
                layer.msg("查询失败!", {icon: 5});
            }
            // initNavigationBar();
        }
    });
}

//列表删除
function ckDelete(id) {
    layer.confirm("确认删除？", {
        btn: ['删除', '取消'] //按钮
    }, function () {
        var businessP = {"ckId": id};
        jQuery.ajax({
            type: "POST",
            url: baseUrl + "raiseClass/newCkDelete.do",
            async: false,//同步
            dataType: 'json',
            data: JSON.stringify(businessP),
            success: function (json) {
                if (json.result == true) {
                    layer.msg(json.message, {icon: 6});
                    showList(1, currentCityId, currentAreaId, currentDeptId, currentStatus);
                } else {
                    layer.msg(json.message, {icon: 5});
                }
            }
        });
    }, function () {

    });
}

//编辑
function ckEdit(id) {

    window.location.href = 'updateRaiseClassInfo.html?ckId=' + id;
}

//撤回
function ckRollback(id) {
    layer.confirm('确认撤回？', {
        btn: ['撤回', '取消'] //按钮
    }, function () {
        var businessP = {"ckId": id};
        var serviceId = '';

        jQuery.ajax({
            type: "POST",
            url: baseUrl + "raiseClass/rollbackNewCk.do",
            async: false,//同步
            dataType: 'json',
            data: JSON.stringify(businessP),
            success: function (json) {
                if (json.result == true) {
                    layer.msg("撤回成功!", {icon: 6});
                    showList(1, currentCityId, currentAreaId, currentDeptId, currentStatus);
                } else {
                    layer.msg("撤回失败!", {icon: 5});
                }
            }
        });
    }, function () {

    });
}

//结束
function over(id) {
    layer.confirm('确认结束？', {
        btn: ['结束', '取消'] //按钮
    }, function () {
        var businessP = {"ckId": id};
        jQuery.ajax({
            type: "POST",
            url: baseUrl + "raiseClass/newCkOver.do",
            async: false,//同步
            dataType: 'json',
            data: JSON.stringify(businessP),
            success: function (json) {
                if (json.result == true) {
                    layer.msg("结束成功!", {icon: 6});
                    showList(1, currentCityId, currentAreaId, currentDeptId, currentStatus);
                } else {
                    layer.msg("结束失败!", {icon: 5});
                }
            }
        });
    }, function () {

    });
}


//列表发布
function ckPublish(id) {
    layer.confirm("确认发布？", {
        btn: ['发布', '取消'] //按钮
    }, function () {
        var businessP = {"ckId": id};
        jQuery.ajax({
            type: "POST",
            url:baseUrl+"raiseClass/newCkPublish.do",
            async: false,//同步
            dataType: 'json',
            data: JSON.stringify(businessP),
            success: function (json) {
                if (json.result == true) {
                    layer.msg(json.message, {icon: 6});
                    showList(1, currentCityId, currentAreaId, currentDeptId, currentStatus);
                } else {
                    layer.msg(json.message, {icon: 5});
                }
            }
        });
    }, function () {

    });
}



//复制模板
function copyTemplate(id) {
    var businessP = {"ckId": id, "userId": getCookie("loginId")};
    var serverId = "";
    if (currentType == 1) { //筹课抽奖
        serverId = "6e276708fbab42e4bcde289f462ed290";
    } else if (currentType == 2) {  //筹课
        serverId = "f9fc5147c8144366958ee417581306d0";
    }
    // var d = constructionParams(rsaEncryptedString(businessP), serverId);
    jQuery.ajax({
        type: "POST",
        url: Global.actionURL,
        async: false,//同步
        dataType: 'json',
        data: JSON.stringify(businessP),
        success: function (json) {
            if (json.result == true) {
                layer.msg("复制成功!", {icon: 6});
                showList(1, currentCityId, currentAreaId, currentDeptId, currentStatus);
            } else {
                layer.msg("复制失败!", {icon: 5});
            }
        }
    });
}



//关闭二维码
function closeWeChat(_this) {
    weOpenFlag = 0;
    $(_this.parentNode.parentNode).css("display", "none");
}
//打开二维码
function openWeChat(_this, id) {
    if (weOpenFlag == 0) {
        var businessP = {"ckId": id};
        var serverId = "";
        if (currentType == 1) { //筹课抽奖
            serverId = "364f6dfe304b49cb8066af354b1be7d8";
        } else if (currentType == 2) {  //筹课
            serverId = "59e82e08ab9745cca3f952e3b7e8603d";
        }
        // var d = constructionParams(rsaEncryptedString(businessP), serverId);
        jQuery.ajax({
            type: "POST",
            url: Global.actionURL,
            async: false,//同步
            dataType: 'json',
            data: JSON.stringify(businessP),
            success: function (json) {
                if (json.result == true) {
                    $(_this).next().css("display", "inline");
                    if (json.url !== "") {
                        $(_this).next().find("img").attr("src", json.url);
                    }
                } else {
                    layer.msg(json.message, {icon: 5});
                }
            }
        });
    }
    weOpenFlag = 1;
}



function changeCkCenter(type) {
    currentType = type;
    changeTag();//切换tab，改变表格head
    //查询数据
    if (currentType == 1) {//筹课抽奖
        showList(1, currentCityId, currentAreaId, currentDeptId, currentStatus);
    } else if (currentType == 2) {//筹课
        showList(1, currentCityId, currentAreaId, currentDeptId, currentStatus);
    } else if (currentType == 3) {//点赞

    }
}











