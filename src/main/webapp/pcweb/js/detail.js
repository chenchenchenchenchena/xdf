/* 查看作业 */

/*默认筛选条件*/
var stage = "";//默认全部
var grade = "";//默认全部
var subject = "";//默认全部
var currentSchoolId = "";//默认全部
var currentSchool = "";//默认全部
var beginTime = "";//默认全部
var endTime = "";//默认全部
var homeworkType = "0"//默认作业类型全部 0表示查询所以 1表示查询普通 2表示查询电子
var seacherName = "";
var totalCounts = "0";
var page = 1;
var pageSize = 15;
var currentStageCode;
var homeworkTeacherOrder = "";
var img_order_publish = "images/sort_h.png";
var publishOrder = "desc";//布置量的排序状态
var img_order_commit = "images/sort_h.png";
var commitOrder = "desc";//提交率的排序状态
var img_order_reply = "images/sort_h.png";
var replyOrder = "desc";//批复率的排序状态

require(['jquery-1.11.0.min'], function () {
    require(['jquery-ui.min'], function () {
        require(['jqPaginator.min'], function () {
            require(['layer'], function () {
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
                var params = JSON.parse(sessionStorage.homeworkDetailParams);
                homeworkType = params.homeworkType;
                currentSchoolId = params.schoolId;
                beginTime = params.beginTime;
                endTime = params.endTime;
                subject = params.paperSubject;
                grade = params.paperClass;
                stage = params.paperStage;
                currentSchool = params.schoolName;

                if (homeworkType == 1) {
                    $('.homewor_small_selecet ul li').eq(0).hide();
                    $('.homewor_small_selecet ul li').eq(1).hide();
                    $('.homewor_small_selecet ul li').eq(2).hide();
                } else {

                    $('.homewor_small_selecet ul li').eq(0).show();
                    $('.homewor_small_selecet ul li').eq(1).show();
                    $('.homewor_small_selecet ul li').eq(2).show();
                }

                $("#stage").html(stage);
                $("#grade").html(grade);
                $("#subject").html(subject);

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
                $('#seacher_hw').off("keyup").on('keyup',function(even){

                    if(even.keyCode==13){
                        $('.loading_pre').show();
                        $('.lesstime_Result').show();
                        SelectTeacherList();
                    }
                })
                $('#hw_selectBtn').click(function () {
                    $('.loading_pre').show();
                    $('.lesstime_Result').show();
                    SelectTeacherList();
                });

                //导出教师列表
                $('#expor_teacher').click(function () {
                    layer.msg('导出列表较慢，请您耐心等待');
                    if($('#teacher-list li') == undefined || $('#teacher-list li').length == 0){
                        layer.msg("暂无列表");
                        return false;
                    }
                    exporTeacherList();
                })

            });
        });
    });
});

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

//查看方式切换
function lookType(this_, flag) {
    if ($(this_).hasClass("homework_active")) {
        //如果已选中，则不做处理
    } else {
        var timeArray = getlastmonth();
        var today = timeArray[0];
        var lastMonth = timeArray[1];
        var halfYear = timeArray[3];
        var oneYear = timeArray[4];
        var lastWeek = timeArray[5];
        $(this_).addClass("homework_active")
        $(this_).siblings().removeClass("homework_active")
        if (flag == 0) {
            //一周前
            $('#date_input').val(lastWeek + " - " + today);
        } else if (flag == 1){
            //一月前
            $('#date_input').val(lastMonth + " - " + today);
        }else if (flag == 2){
            //半年前
            $('#date_input').val(halfYear + " - " + today);
        }else if (flag == 3){
            //一年前
            $('#date_input').val(oneYear + " - " + today);
        }
        SelectTeacherList();
    }
}

//获取学段／年级／科目
function getSelectList(this_, type, flag) {
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
                async: true,//同步
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
            //保存被选学段，联动匹配年级
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
 * 作业统计-教师明细接口实现
 */
function SelectTeacherList() {
    $('.loading_pre').show();

    stage = $("#stage").html();
    grade = $("#grade").html();
    subject = $("#subject").html();

    //获取筛选条件
    var time = $('#date_input').val();
    if (time != "" && time != undefined) {
        beginTime = time.substring(0, 10);
        endTime = time.substring(13, time.length);
    }

    seacherName = $('#seacher_hw').val();
    if (seacherName == undefined) {
        seacherName = "";
    }

    if (stage == "全部") {
        stage = "";
    }
    if (grade == "全部") {
        grade = "";
    }
    if (subject == "全部") {
        subject = "";
    }

    var params = {
        'schoolId': currentSchoolId,
        'teacher': seacherName,
        'paperStage': stage,
        'paperClass': grade,
        'paperSubject': subject,
        'pageNum': page,
        'pageSize': pageSize,
        'beginTime': beginTime,
        'endTime': endTime,
        'homeworkType': homeworkType,
        'homeWorkTeacherOrder':homeworkTeacherOrder
    };
    $.ajax({
        type: "POST",
        url: global.hw_details,
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
                $('#teacher-list li').remove();
                var str = '<li class="homework_list_title"><span>姓名</span><span>布置量<img style="right: 0" src="' + img_order_publish + '" alt="" onclick="get_order(this)" class="sort_h sort_homework" data-type="1" data-order="' + publishOrder + '"></span><span>提交率<img style="right: 0" src="' + img_order_commit + '" alt="" onclick="get_order(this)" class="sort_h sort_homework" data-type="2" data-order="' + commitOrder + '"></span><span>批复率<img style="right: 0" src="' + img_order_reply + '" alt="" onclick="get_order(this)" class="sort_h sort_homework" data-type="3" data-order="' + replyOrder + '"></span><span>正确率（电子）</span></li>';
                $('#teacher-list').append(str);
                for (var i = 0; i < teacherList.length; i++) {
                    var teacherName = teacherList[i].teacherName;
                    var commitRate = teacherList[i].commitRate;
                    var correctRate = teacherList[i].correctRate;
                    var publishCount = teacherList[i].publishCount;
                    var replyRate = teacherList[i].replyRate;
                    var teacherEmail = teacherList[i].teacherEmail;
                    if(homeworkType != "1"){
                        var itemHtml_ = '<li><span>' + teacherName + '</span><span>' + publishCount + '</span><span>' + parseInt((commitRate * 100)) + '%</span><span>' + parseInt((replyRate * 100)) + '%</span><span>' + parseInt((correctRate * 100)) + '%</span></li>';
                    }else {
                        var itemHtml_ = '<li><span>' + teacherName + '</span><span>' + publishCount + '</span><span>' + parseInt((commitRate * 100)) + '%</span><span>' + parseInt((replyRate * 100)) + '%</span><span>暂无</span></li>';
                    }
                    $('#teacher-list').append(itemHtml_);
                }
                $('.loading_pre').hide();

            } else {
                layer.msg("暂无数据");
                $('.loading_pre').hide();

                $('#teacher-list li').remove();
                $('.lesstime_Result').hide();
                initPage(0, 1);
            }

        }
    })

}

//导出教师列表
function exporTeacherList() {
    window.location.href = global.hw_expor + "?schoolName=" + currentSchool + "&schoolId=" + currentSchoolId + "&homeworkType=" + homeworkType + "&teacher=" + seacherName + "&beginTime=" + beginTime + "&endTime=" + endTime + "&paperStage=" + stage + "&paperClass=" + grade + "&paperSubject=" + subject;
}


/**
 * 排序
 */
function get_order(this_){
    var orderThis = $(this_).attr('data-type');
    if (orderThis == '1') {//布置量
        if(publishOrder == 'desc'){
            homeworkTeacherOrder = "publishCount desc";
            publishOrder = "asc";
            img_order_publish = "images/sort_t.png";
        }else {
            homeworkTeacherOrder = "publishCount asc";
            publishOrder = "desc";
            img_order_publish = "images/sort_c.png";
        }

        commitOrder = "desc";
        img_order_commit = "images/sort_h.png";
        replyOrder = "desc";
        img_order_reply = "images/sort_h.png";

    } else if (orderThis == '2'){//提交率
        if(commitOrder == 'desc'){
            homeworkTeacherOrder = "commitRate desc";
            commitOrder = "asc";
            img_order_commit = "images/sort_t.png";
        }else {
            homeworkTeacherOrder = "commitRate asc";
            commitOrder = "desc";
            img_order_commit = "images/sort_c.png";
        }

        publishOrder = "desc";
        img_order_publish = "images/sort_h.png";
        replyOrder = "desc";
        img_order_reply = "images/sort_h.png";

    } else if (orderThis == '3'){//批复率
        if(replyOrder == 'desc'){
            homeworkTeacherOrder = "replyRate desc";
            replyOrder = "asc";
            img_order_reply = "images/sort_t.png";
        }else {
            homeworkTeacherOrder = "replyRate asc";
            replyOrder = "desc";
            img_order_reply = "images/sort_c.png";
        }
        commitOrder = "desc";
        img_order_commit = "images/sort_h.png";
        publishOrder = "desc";
        img_order_publish = "images/sort_h.png";
    }
    page = 1;
    SelectTeacherList();
}

