/**
 * Created by xupingwei on 2017/8/22.
 */
var totalCounts = 0;
var currentPage = 1;
var pageSize = 15;
var currentCityId = '1';
var currentAreaId = '';
var currentDeptId = '';
var switchFlag = false;
var searchKey = "";
$(function () {
    initTopContent();
    findList("");
    initSwitch();
});

function initSwitch() {
    //大开关
    $("#m1").unbind('click').click(function () {
        $(this).prev().css("overflow", "hidden");
        if (switchFlag == false) {
            $(this).prev().css("height", $('.hot-classes .list1 li').eq(0).height());
            $(this).css("background-position", "0 -18px");
            switchFlag = true;
            $('.shou:visible').click();
        } else {
            $(this).prev().css("height", "auto");
            $(this).css("background-position", "0 0");
            switchFlag = false;
        }
    });
    $(".open").unbind('click').click(function () {
        $(this).parent().parent().css("height", "auto");
        $(this).hide();
        $(this).next().show();
        if (switchFlag) {
            $("#m1").prev().css("height", $('.hot-classes .list1 li').eq(0).height());
        }
    });
    $(".shou").unbind('click').click(function () {
        $(this).parent().parent().css("height", "30px");
        $(this).hide();
        $(this).prev().show();
        if (switchFlag) {
            $("#m1").prev().css("height", $('.hot-classes .list1 li').eq(0).height());
        }
    });

}

function initTopContent() {
//查询校区
    var table = {
        "tableName": "dict_school_info"
    };
    ajaxRequest("POST", url.s_select, table, selectData);
}
function selectData(json) {
    console.log(json);
    if (json.code == "200") {
        var schoolList = json.data;
        var cityContent = "<a href='#' class='cur' onclick='filterByCityId(this, \"" + "" + "\")' >全部</a>";
        //var cityContent = "";
        for (var i = 0; i < schoolList.length; i++) {
            var schoolId = schoolList[i].tCode;
            if (schoolId == "1") {
                cityContent += "<a href='# 'class='cur' onclick='filterByCityId(this, \"" + schoolList[i].tName + "\")' " +
                    " >" + schoolList[i].tName + "</a>";
            } else {
                cityContent += "<a href='#' onclick='filterByCityId(this, \"" + schoolList[i].tName + "\")'" +
                    " >" + schoolList[i].tName + "</a>";
            }
        }
        $(".xian-wid").html(cityContent);
        // initOpenAndShou1();
    } else {
        layer.msg("查询失败!", {icon: 5})
    }
}
function filterByCityId(_this, cityId) {
    $(".xian-wid .cur").removeClass("cur");
    $(_this).addClass("cur");
    if (cityId != "") {
        $(".list1 li").eq(1).show();
        $(".list1 li").eq(2).show();
        firstIn = true;
        currentCityId = cityId;

    } else {
        currentCityId = "";
        currentAreaId = "";
        currentDeptId = "";
        $(".list1 li").eq(1).hide();
        $(".list1 li").eq(2).hide();
        $("#userTbody").html("");
        $("#publicPage").html("");
    }

    if ($("#searchKey").val() != "") {
        searchKey = $("#searchKey").val();
        findList(currentCityId, searchKey);
    } else {
        searchKey = "";
        findList(currentCityId, searchKey);
    }
}

function searchByKey() {
    searchKey = $("#searchKey").val();
    if (searchKey == "") {
        layer.msg("请输入搜索关键字!", {icon: 5});
        return false;
    }
    findList(currentCityId, searchKey);
}

var firstIn = true;
function findList(school, searchKey) {
    if (school == null) {
        school = "";
    }

    var requestJson = {
        school: school,
        loginId: searchKey
    };
    jQuery.ajax({
        type: "POST",
        url: url_o + "/user/getMarketPrivilegeList.do",
        async: true,//同步
        dataType: 'json',
        data: JSON.stringify(requestJson),
        success: function (json) {
            if (json.result == true) {
                var userList = json.dataList;
                totalCounts = userList.length;
                if (undefined == totalCounts || totalCounts <= 0) {
                    $("#userTbody").html("");
                    return;
                }
                // if (firstIn) {
                //     initPage(totalCounts, 1);
                //     firstIn = false;
                // }
                var str = "";
                for (var i = 0; i < userList.length; i++) {
                    var pid = userList[i].id;
                    var userId = userList[i].loginId;
                    var loginId = userList[i].loginId;
                    var userName = userList[i].userName;
                    var email = userList[i].email;
                    var department = userList[i].department;
                    var position = userList[i].position;
                    var school = userList[i].school;
                    var isEnabled = userList[i].isEnabled;
                    // var schoolCode = userList[i].schoolCode;
                    var schoolName = userList[i].school;
                    // var areaCode = userList[i].areaCode;
                    // var areaName = userList[i].areaName;
                    var auth = userList[i].auth;

                    if (i % 2 == 1) {
                        str += "<tr class='table-tr-odd'>"
                    } else {
                        str += "<tr class='table-tr-even'>"
                    }
                    str += "<td id='" + pid + "' style='display: none'>" + isEnabled + "</td>"
                    str += "<td style='display: none'>" + pid + "</td>"
                    str += "<td style='display: none'>" + userId + "</td>"
                    str += "<td style='display: none'>" + loginId + "</td>"
                    str += "<td>" + userName + "</td>"
                    str += "<td style='word-wrap:break-word'>" + email + "</td>"
                    str += "<td>" + schoolName + "</td>"

                    str += "<td>"
                    str += "<div class='p176-table-btnGroup'>";
                    if (loginId != "ssdf") {
                        str += "<a href='javascript:;' class='p176-btn-edit' onclick='javascript:updateExhibitionUser(\"" + pid + "\",\"" + userId + "\",\"" + loginId + "\"," +
                            "\"" + userName + "\",\"" + email + "\",\"" + department + "\",\"" + position + "\",\"" + school + "\",\"" + auth + "\");'><i></i>编辑</a>";
                        // str += "<a href='javascript:;' class='p176-btn-delete js-deleteBtn' onclick='javascript:deleteUser(\""+pid+"\",\""+userId+"\",this);'><i></i>删除</a> "


                        if (isEnabled == 1) {
                            str += "<a href='javascript:;' class='p176-btn-able' onclick='enabledUser(this,\"" + pid + "\")'><i></i>禁用</a>";
                        } else {
                            str += "<a href='javascript:;' class='p176-btn-disable' onclick='enabledUser(this,\"" + pid + "\")'><i></i>启用</a>";
                        }
                    }

                    str += "</div>";
                    str += "</td>";
                    str += "</tr>";

                }
                $("#userTbody").html(str);
            } else {
                layer.msg("查询失败!", {icon: 5});
            }
        }
    });
}

//禁用
function enabledUser(_this, userId) {
    var isEnable = $("#" + userId).html();
    var text;
    var buttons = [];
    if (isEnable == 1) {
        text = "确定禁用该数据?";
        buttons.push('禁用', '取消');
    } else {
        text = "确定启用该数据?";
        buttons.push('启用', '取消')
    }
    layer.confirm(text, {
        btn: buttons //按钮
    }, function () {
        var businessP = {"id": userId, "isEnabled": isEnable};
        jQuery.ajax({
            type: "POST",
            url: url_o + "user/enableUser.do",
            async: false,//同步
            dataType: 'json',
            data: JSON.stringify(businessP),
            success: function (json) {
                if (json.result == true) {
                    if (isEnable == 1) {
                        layer.msg("禁用成功!", {icon: 6});
                        $(_this).html("<i></i>启用");
                        $(_this).removeClass();
                        $(_this).addClass('p176-btn-disable');
                        $("#" + userId).html(0)
                    } else {
                        layer.msg("启用成功!", {icon: 6});
                        $(_this).html("<i></i>禁用");
                        $(_this).removeClass();
                        $(_this).addClass('p176-btn-able');
                        $("#" + userId).html(1)
                    }
                    //findList(1, currentCityId, currentAreaId, currentDeptId);
                } else {
                    if (isEnable == 1) {
                        layer.msg("禁用失败!", {icon: 5});
                    } else {
                        layer.msg("启用失败!", {icon: 5});
                    }
                }
            }
        });
    }, function () {

    });
}
//修改展示页面
function updateExhibitionUser(pid, userId, loginId, userName, email, department, position, school, auth) {
    window.location.href = 'userAdd.html?pid=' + pid + "&userId=" + userId + "&loginId=" + loginId + "&email=" + email + "&department=" + department + "&position=" + position + "&school=" + school + "&userName=" + encodeURI(userName) + "&auth=" + auth;

}
function initPage(totalCounts, currentPage) {
    //console.log("initPage: totalCounts --> " + totalCounts + "\tcurrentPage --> " + currentPage);
    if (totalCounts != null && totalCounts != 0) {
        jQuery.jqPaginator("#publicPage", {
            totalCounts: totalCounts,
            pageSize: pageSize,
            visiblePages: 10,
            currentPage: currentPage,
            prev: '<a class="pPrev" href="javascript:;">上一页</a>',
            next: '<a class="pNext" href="javascript:;">下一页</a>',
            page: '<a href="javascript:;">{{page}}</a>',
            activeClass: 'pCurrent',
            onPageChange: function (num, type) {
                // console.log("type --> " + type + "\tnum --> " + num + "\ttotalCounts --> " + totalCounts + "\tpageSize --> " + pageSize );
                if (type != "init") {
                    findList(num, currentCityId, currentAreaId, currentDeptId);
                }
            }
        });
    } else {
        $("#publicPage").html("");
    }
}