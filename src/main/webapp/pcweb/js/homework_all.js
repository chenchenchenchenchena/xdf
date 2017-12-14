/*默认筛选条件*/
var stage = "";//默认全部
var grade = "";//默认全部
var subject = "";//默认全部
var currentSchoolId = "";//默认全部
var currentSchool = "全部";//默认全部
var beginTime = "";//默认全部
var endTime = "";//默认全部
var homeworkType = "0"//默认作业类型全 部 0表示查询所以 1表示查询普通 2表示查询电子
var searchName = "";
var currentStageCode = "";
var totalCounts = "0";
var page = 1;
var pageSize = 15;
var publishD = "publishCount desc";//布置次数降序
var publishA = "publishCount asc";//布置次数升序
var reachD = "reachCount desc";//送达人次降序
var reachA = "reachCount asc";//送达人次升序
var commitD = "commitRate desc";//提交率降序
var commitA = "commitRate asc";//提交率升序
var replyD = "replyRate desc";//回复率降序
var replyA = "replyRate asc";//回复率升序
var homeWorkClassOrder = "";//排序类型

require(['jquery-1.11.0.min'], function () {
    require(['jquery-ui.min'], function () {
        require(['layer', 'requireConfig', 'jqPaginator.min'], function () {
            $('.loading_pre').show();

            laydate.render({
                elem: '#date_input',
                range: true //指定元素
            });

            //返回上一页
            $('#back_homework').click(function () {
                history.go(-1);
            });

            //从上个页面获取筛选数据,初始化页面
            var params = JSON.parse(sessionStorage.homeworkAllParams);
            homeworkType = params.homeworkType;
            currentSchoolId = params.schoolId;
            beginTime = params.beginTime;
            endTime = params.endTime;
            subject = params.paperSubject;
            grade = params.paperClass;
            stage = params.paperStage;
            currentSchool = params.schoolName;
            //初始化作业类型视图
            if (homeworkType == 0) {
                $('.homework_radiu ul li').eq(0).find('img').attr('src', "images/checked.png");
                $('.homework_radiu ul li').eq(1).find('img').attr('src', "images/check.png");
                $('.homework_radiu ul li').eq(2).find('img').attr('src', "images/check.png");
                $('.homewor_small_selecet ul li').eq(0).show();
                $('.homewor_small_selecet ul li').eq(1).show();
                $('.homewor_small_selecet ul li').eq(2).show();
            } else if (homeworkType == 1) {
                $('.homework_radiu ul li').eq(1).find('img').attr('src', "images/checked.png");
                $('.homework_radiu ul li').eq(0).find('img').attr('src', "images/check.png");
                $('.homework_radiu ul li').eq(2).find('img').attr('src', "images/check.png");

                $('.homewor_small_selecet ul li').eq(0).hide();
                $('.homewor_small_selecet ul li').eq(1).hide();
                $('.homewor_small_selecet ul li').eq(2).hide();
            } else if (homeworkType == 2) {
                $('.homework_radiu ul li').eq(2).find('img').attr('src', "images/checked.png");
                $('.homework_radiu ul li').eq(1).find('img').attr('src', "images/check.png");
                $('.homework_radiu ul li').eq(0).find('img').attr('src', "images/check.png");
                $('.homewor_small_selecet ul li').eq(0).show();
                $('.homewor_small_selecet ul li').eq(1).show();
                $('.homewor_small_selecet ul li').eq(2).show();
            }
            $("#stage").html(stage);
            $("#grade").html(grade);
            $("#subject").html(subject);
            //初始化时间段视图
            if (beginTime != undefined && endTime != undefined && beginTime != "" && endTime != "") {
                $('#date_input').val(params.beginTime + " - " + params.endTime);
            }
            //初始化分页控件
            initPage(totalCounts, page);
            //查询数据
            SelectTeacherList();

            //搜索点击事件
            $('#seacher_hw').parent().find('img').click(function () {
                $('.loading_pre').show();
                SelectTeacherList();
            });
            //搜索回车事件
            $('#seacher_hw').off("keyup").on('keyup', function (even) {

                if (even.keyCode == 13) {
                    $('.loading_pre').show();
                    $('.lesstime_Result').show();
                    SelectTeacherList();
                }
            });
            //筛选条件"确认"按钮 点击事件
            $('#hw_selectBtn').click(function () {
                $('.loading_pre').show();
                $('.lesstime_Result').show();
                SelectTeacherList();
            });
            //排序点击事件
            $(document).on('click','.sort_h',function(){
                var type = $(this).attr('type');
                var order = $(this).attr('data-order');
                if(type == "publishCount"){
                    if(order == 'desc'){
                        homeWorkClassOrder = publishD;
                        $(this).attr('data-order','asc');
                        $(this).attr('src','images/sort_t.png');
                    }else {
                        homeWorkClassOrder = publishA;
                        $(this).attr('data-order','desc');
                        $(this).attr('src','images/sort_c.png');
                    }
                }else if(type == "reachCount"){
                    if(order == 'desc'){
                        homeWorkClassOrder = reachD;
                        $(this).attr('data-order','asc');
                        $(this).attr('src','images/sort_t.png');
                    }else {
                        homeWorkClassOrder = reachA;
                        $(this).attr('data-order','desc');
                        $(this).attr('src','images/sort_c.png');
                    }
                }else if(type == "commitRate"){
                    if(order == 'desc'){
                        homeWorkClassOrder = commitD;
                        $(this).attr('data-order','asc');
                        $(this).attr('src','images/sort_t.png');
                    }else {
                        homeWorkClassOrder = commitA;
                        $(this).attr('data-order','desc');
                        $(this).attr('src','images/sort_c.png');
                    }
                }else if(type == "replyRate"){
                    if(order == 'desc'){
                        homeWorkClassOrder = replyD;
                        $(this).attr('data-order','asc');
                        $(this).attr('src','images/sort_t.png');
                    }else {
                        homeWorkClassOrder = replyA;
                        $(this).attr('data-order','desc');
                        $(this).attr('src','images/sort_c.png');
                    }
                }

                $(this).parent().siblings().find('.sort_h').attr('src','images/sort_h.png');
                page = 1;
                SelectTeacherList();
            })
        });
    });
});

/**
 *切换作业类型
 */
function changeHomeworkType(this_, flag) {
    $('#stage').siblings().hide();
    $('#grade').siblings().hide();
    $('#subject').siblings().hide();
    homeworkType = flag;
    $(this_).find('img').attr('src', "images/checked.png");
    $(this_).siblings().find('img').attr('src', "images/check.png");
    if (flag == 1) {
        //手动作业不能选择学段／年级／科目
        $('#stage').parent().parent().hide();
        $('#grade').parent().parent().hide();
        $('#subject').parent().parent().hide();
    } else {

        $('#stage').parent().parent().show();
        $('#grade').parent().parent().show();
        $('#subject').parent().parent().show();
    }
    /*重置筛选条件*/
    stage = "";
    grade = "";
    subject = "";
    $('#school').html("全部");
    $('#stage').html("全部");
    $('#grade').html("全部");
    $('#subject').html("全部");
    currentSchoolId = localStorage.schoolList;
    currentSchool = "全部";
    beginTime = "";
    endTime = "";
    var timeArray = getlastmonth();
    var today = timeArray[0];
    var halfYear = timeArray[3];
    $('#date_input').val(halfYear + " - " + today);//默认半年
    SelectTeacherList();

}


//校区展示
function getSchool() {
    $('#select_html>ul>li').find('ul').hide();
    if ($("#school").parent().find('ul').css('display') != 'none') {
        $("#school").parent().find('ul').hide();
    } else {
        if (sessionStorage.schoolList) {
            var json = JSON.parse(sessionStorage.schoolList);
            showSchoolList(json);
        } else {
            var table = {
                "tableName": "dict_school_info"
            };
            $.ajax({
                type: "POST",
                url: global.hw_dictList,
                dataType: 'json',
                data: table,
                success: function (e) {
                    sessionStorage.schoolList = JSON.stringify(e);
                    showSchoolList(e)
                }
            })
        }
    }

}

//筛选校区列表显示
function showSchoolList(e) {
    var schoolStr = localStorage.schoolList;// 全部的校区ID
    var schoolIdList = schoolStr.split(',');

    var schoolList = e.data;
    if (schoolList != undefined && schoolList.length > 0) {
        $("#school").parent().find("ul").html("");
        var cityContent = "<li onclick='filterByCityId(this, \"" + "全部" + "\")' data-schoolId='" + schoolStr + "'><span>全部</span></li>";
        for (var i = 0; i < schoolIdList.length; i++) {
            for (var j = 0; j < schoolList.length; j++) {
                var schoolId = schoolList[j].tCode;
                if (schoolIdList[i] == schoolId) {
                    cityContent += "<li onclick='filterByCityId(this, \"" + schoolList[j].tName + "\")' data-schoolId='" + schoolId + "' ><span>" + schoolList[j].tName + "</span></li>";
                }
            }

        }
        $("#school").parent().find("ul").html(cityContent);
    } else {
        layer.msg("查询失败!")
    }

    $("#school").parent().find("ul").show();
}

//点击选择校区
function filterByCityId(_this, schoolName) {
    currentSchool = schoolName;
    currentSchoolId = $(_this).attr('data-schoolId');
    $("#school").html(currentSchool);
    $("#school").parent().find("ul").hide();
}

//获取学段／年级／科目
function getSelectList(this_, type, flag) {
    $('#select_html>ul>li').find('ul').hide();
    if ($(this_).parent().find('ul').css('display') != 'none') {
        $(this_).parent().find('ul').hide();
    } else {
        var json;
        switch (flag) {
            case 0:
                json = sessionStorage.stageList;
                break;
            case 1:
                if (currentStageCode == undefined || currentStageCode == "") {
                    layer.msg("请先选择学段");
                    return false;
                }
                json = sessionStorage.gradelList;
                break;
            case 2:
                json = sessionStorage.subjectList;
                break;
        }
        if (json != undefined) {
            json = JSON.parse(json);
            showDrownList(json, this_, flag);
        } else {
            var table = {
                "tableName": type
            };
            $.ajax({
                type: "POST",
                url: global.hw_dictList,
                dataType: 'json',
                data: table,
                success: function (e) {
                    switch (flag) {
                        case 0:
                            sessionStorage.stageList = JSON.stringify(e);
                            break;
                        case 1:
                            sessionStorage.gradelList = JSON.stringify(e);
                            break;
                        case 2:
                            sessionStorage.subjectList = JSON.stringify(e);
                            break;
                    }
                    showDrownList(e, this_, flag);
                }
            })
        }
    }


}

//筛选学段／年级／科目列表显示
function showDrownList(json, this_, flag) {
    $(this_).parent().find('ul').show();
    $(this_).parent().parent().siblings().find('ul').hide();
    if (json.code == "200") {
        $(this_).siblings().find('ul').html("");
        var list = json.data;
        var content = "<li onclick='filterByDrownId(this, \"" + "全部" + "\"," + flag + ")' data-tCode=''><span>全部</span></li>";
        for (var i = 0; i < list.length; i++) {
            var tCode = list[i].tCode;
            if (flag == 1) {
                if (tCode.indexOf(currentStageCode) >= 0) {
                    content += "<li onclick='filterByDrownId(this, \"" + list[i].tName + "\"," + flag + ")' data-tCode='" + tCode + "' ><span>" + list[i].tName + "</span></li>";
                }
            } else {
                content += "<li onclick='filterByDrownId(this, \"" + list[i].tName + "\"," + flag + ")' data-tCode='" + tCode + "' ><span>" + list[i].tName + "</span></li>";
            }
        }

        $(this_).parent().find('ul').html(content);
    } else {
        layer.msg("查询失败!")
    }

    $(this_).parent().find('ul').show();
}

//点击选择学段／年级／科目
function filterByDrownId(_this, name, flag) {
    var id = $(_this).attr('data-tCode');
    $(_this).parent().parent().find('h4').html(name);
    $(_this).parent().parent().find('h4').attr('tCode', id);
    $(_this).parent().hide();
    if (flag == 0) {
        if (id == "") {
            currentStageCode = "";
        } else {
            currentStageCode = id.substring(0, 2);
        }
        //如果切换学段，则将年级科目置成默认值："全部"
        $('#grade').html("全部");
        $('#grade').attr('tCode', "");
        $('#subject').html("全部");
        $('#subject').attr('tCode', "");

    }
}

/**
 * 分页控件
 * @param totalCounts
 * @param currentPage
 */
function initPage(totalCounts, currentPage) {
    if (totalCounts != null && totalCounts != 0) {
        $.jqPaginator("#publicPage", {
            totalCounts: totalCounts,
            pageSize: pageSize,
            visiblePages: pageSize,
            currentPage: currentPage,
            prev: '<a class="pPrev" href="javascript:;">上一页</a>',
            next: '<a class="pNext" href="javascript:;">下一页</a>',
            page: '<a href="javascript:;">{{page}}</a>',
            activeClass: 'pCurrent',
            onPageChange: function (num, type) {
                if (type != "init") {
                    page = num;
                    SelectTeacherList();
                }
            }
        });
    } else {
        $("#publicPage").html("");
    }
}

/**
 * 获取列表
 * @constructor
 */
function SelectTeacherList() {
    $('.loading_pre').show();

    //获取筛选条件
    var time = $('#date_input').val();
    if (time != "" && time != undefined) {
        beginTime = time.substring(0, 10);
        endTime = time.substring(13, time.length);
    }

    searchName = $('#seacher_hw').val();
    if (searchName == undefined) {
        searchName = "";
    }

    if ($('#subject').html() != '全部') {
        subject = $('#subject').html();
    } else {
        subject = "";
    }
    if ($('#grade').html() != '全部') {
        grade = $('#grade').html();
    } else {
        grade = "";
    }
    if ($('#stage').html() != '全部') {
        stage = $('#stage').html();
    } else {
        stage = "";
    }

    var params = {
        'schoolId': currentSchoolId,
        'searchName': searchName,
        'pageNum': page,
        'pageSize': pageSize,
        'beginTime': beginTime,
        'endTime': endTime,
        'homeworkType': homeworkType,
        'homeWorkClassOrder': homeWorkClassOrder,
        'paperSubject': subject,
        'paperClass': grade,
        'paperStage': stage
    };
    $.ajax({
        type: "POST",
        url: global.hw_all,
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(params),
        success: function (e) {
            if (e.list != undefined && e.list.length > 0) {

                var teacherList = e.list;
                totalCounts = e.total;//总条数
                $('.lesstime_Result').show();
                $('.lesstime_Result').html("共" + totalCounts + "条数据");
                var currentPage = e.pageNum;
                initPage(totalCounts, currentPage);
                var strTitle = $('.homework_list_title');
                $('#homeworkAllList li').remove();
                $('#homeworkAllList').append(strTitle);
                for (var i = 0; i < teacherList.length; i++) {
                    var className = isNULL(teacherList[i].className);
                    var classCode = isNULL(teacherList[i].classCode);
                    var masterTeacherName = isNULL(teacherList[i].masterTeacherName);
                    var teacherName = isNULL(teacherList[i].teacherName);
                    var commitCount = parseINT(teacherList[i].commitCount);
                    var commitRate = parsePercent(teacherList[i].commitRate);
                    var correctRate = parsePercent(teacherList[i].correctRate);
                    var publishCount = parseINT(teacherList[i].publishCount);
                    var replyRate = parsePercent(teacherList[i].replyRate);
                    var reachCount = parseINT(teacherList[i].reachCount);
                    var schoolId = teacherList[i].schoolId;
                    var schoolName = teacherList[i].schoolName;
                    if(homeworkType == 1){
                        var itemHtml_ = '<li><span style="width: 14%">' + className + '</span><span>' + classCode + '</span><span style="width: 14%">' + schoolName + '</span><span>' + masterTeacherName + '</span><span>' + teacherName + '</span>' +
                            '<span>' + publishCount + '</span><span>' + reachCount + '</span><span>' + commitRate + '</span><span>' + replyRate + '</span><span>' + "暂无" + '</span><span><span style="width: auto" class=" homework_operation">查看分析</span></span></li>';

                    }else {
                        var itemHtml_ = '<li><span style="width: 14%">' + className + '</span><span>' + classCode + '</span><span style="width: 14%">' + schoolName + '</span><span>' + masterTeacherName + '</span><span>' + teacherName + '</span>' +
                            '<span>' + publishCount + '</span><span>' + reachCount + '</span><span>' + commitRate + '</span><span>' + replyRate + '</span><span>' + correctRate + '</span><span><span style="width: auto" class=" homework_operation">查看分析</span></span></li>';

                    }


                    $('#homeworkAllList').append(itemHtml_);
                }
                $('.loading_pre').hide();

            } else {
                layer.msg("暂无数据");
                $('.loading_pre').hide();

                $('#homeworkAllList li').remove();
                $('.lesstime_Result').hide();
                initPage(0, 1);
            }
        }
    });
}

/**
 * 判断是否为空
 * @param str
 * @returns {*}
 */
function isNULL(str) {
    if (str == undefined || str == "") {
        return "暂无";
    } else {
        return str;
    }
}
/**
 * 将string转成Int
 * @param str
 * @returns {*}
 */
function parseINT(str) {
    if (str == undefined || str == "") {
        return 0;
    } else {
        return parseInt(str);
    }
}
/**
 * 将string转成百分比
 * @param str
 * @returns {*}
 */
function parsePercent(str) {
    if (str == undefined || str == "" || str == "0" ) {
        return 0 + "%";
    }else {
        return parseInt(parseFloat(str).toFixed(2) * 100) + "%";
    }
}
