/* 查看作业 */

/*默认筛选条件*/
var dateMonth = '6';// 默认半年
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

require(['jquery-1.11.0.min'], function () {
    require(['jquery-ui.min'], function () {
        require(['jqPaginator.min'], function () {
            require(['layer'], function () {

                laydate.render({
                    elem: '#date_input',
                    range: true //指定元素
                });

                var params = {
                    'homeworkType': homeworkType,
                    'schoolId': currentSchoolId,
                    'dateMonth': dateMonth,
                    'beginTime': beginTime,
                    'endTime': endTime,
                    'paperSubject': subject,
                    'paperClass': grade,
                    'paperStage': stage
                };
                sessionStorage.homeworkDetailParams = JSON.stringify(params);


                //从上个页面获取筛选数据
                var params = JSON.parse(sessionStorage.homeworkDetailParams);
                homeworkType = params.homeworkType;
                currentSchoolId = params.schoolId;
                dateMonth = params.dateMonth;
                beginTime = params.beginTime;
                endTime = params.endTime;
                subject = params.paperSubject;
                grade = params.paperClass;
                stage = params.paperStage;
                $('#select-school h4').html(params.currentCity);
                if(beginTime != undefined && endTime != undefined && beginTime != "" && endTime != ""){
                    $('#date_input').val(params.beginTime+" - "+params.endTime);
                }
                //初始化分页控件
                initPage(totalCounts, page);

                //查询数据
                SelectTeacherList();

                //导出教师列表
                $('#expor_teacher').click(function(){
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
function lookType(this_,flag){
    if($(this_).hasClass("homework_active")){
        //如果已选中，则不做处理
    }else {
        $(this_).addClass("homework_active")
        $(this_).siblings().removeClass("homework_active")
        if(flag == 1){
            dateMonth = '6';
        }else {
            dateMonth = '12';
        }
        SelectTeacherList();
    }
}

//校区展示
function getSchool() {
    if (sessionStorage.schoolList) {
        var json = JSON.parse(sessionStorage.schoolList);
        showSchoolList(json);
    } else {
        var table = {
            "tableName": "dict_school_info"
        };
        $.ajax({
            type: "POST",
            url: url_o + 'dict/getDictListByTableName.do',
            async: true,//同步
            dataType: 'json',
            data: table,
            success: function (e) {
                sessionStorage.schoolList = JSON.stringify(e);
                showSchoolList(e)
            }
        })
    }

}

//筛选校区列表显示
function showSchoolList(e){
    var schoolStr = localStorage.schoolList;// 全部的校区ID
    var schoolIdList = schoolStr.split(',');

    var schoolList = e.data;
    if (schoolList != undefined && schoolList.length > 0 ) {
        $("#school").parent().find("ul").html("");
        var cityContent = "<li onclick='filterByCityId(this, \"" + "全部" + "\")' data-schoolId='"+schoolStr+"'><span>全部</span></li>";
        for (var i = 0; i < schoolIdList.length; i++) {
            for(var j = 0;j < schoolList.length;j++){
                var schoolId = schoolList[j].tCode;
                if(schoolIdList[i] == schoolId){
                    cityContent += "<li onclick='filterByCityId(this, \"" + schoolList[j].tName + "\")' data-schoolId='"+schoolId+"' ><span>" + schoolList[j].tName + "</span></li>";
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

    var json;
    switch (flag) {
        case 1:
            json = JSON.parse(sessionStorage.stageList);
            break;
        case 2:
            json = JSON.parse(sessionStorage.gradelList);
            break;
        case 3:
            json = JSON.parse(sessionStorage.subjectList);
            break;
    }
    if (json != undefined) {
        showDrownList(json, this_);
    } else {
        var table = {
            "tableName": type
        };
        $.ajax({
            type: "POST",
            url: url_o + 'dict/getDictListByTableName.do',
            async: true,//同步
            dataType: 'json',
            data: table,
            success: function (e) {
                switch (flag) {
                    case 1:
                        sessionStorage.stageList = JSON.stringify(e);
                        break;
                    case 2:
                        sessionStorage.gradelList = JSON.stringify(e);
                        break;
                    case 3:
                        sessionStorage.subjectList = JSON.stringify(e);
                        break;
                }
                showDrownList(e, this_);
            }
        })
    }

}

//筛选学段／年级／科目列表显示
function showDrownList(json, this_) {
    if (json.code == "200") {
        $(this_).siblings().find('ul').html("");
        var list = json.data;
        var content = "<li onclick='filterByDrownId(this, \"" + "全部" + "\")' data-tCode=''><span>全部</span></li>";
        for (var i = 0; i < list.length; i++) {
            var tCode = list[i].tCode;
            content += "<li onclick='filterByDrownId(this, \"" + list[i].tName + "\")' data-tCode='" + tCode + "' ><span>" + list[i].tName + "</span></li>";

        }
        $(this_).parent().find('ul').html(content);
    } else {
        layer.msg("查询失败!")
    }

    $(this_).parent().find('ul').show();
}

//点击选择学段／年级／科目
function filterByDrownId(_this, name) {
    var id = $(_this).attr('data-tCode');
    $(_this).parent().parent().find('h4').html(name);
    $(_this).parent().parent().find('h4').attr('tCode', id);
    $(_this).parent().hide();
}

//作业统计-教师明细接口实现
function SelectTeacherList(){
    stage = $("#stage").html();
    grade = $("#grade").html();
    subject = $("#subject").html();

    var time = $('#date_input').val();
    if(time != "" && time != undefined){
        beginTime = time.substring(0,10);
        endTime = time.substring(13,time.length);
    }

    currentSchoolId = $("#school").attr('school-id');
    if(currentSchoolId == ""){
        currentSchoolId = localStorage.schoolList
        currentSchool = "全部";
    }
    if (currentSchoolId == "-1") {
        currentSchoolId = "";
    }

    var params = {
        'schoolId':currentSchoolId,
        'pageNum':page,
        'pageSize':pageSize
    }
    $.ajax({
        type: "POST",
        url: global.hw_details,
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(params),
        success: function (e) {

            if(e.list != undefined && e.list.length > 0){
                var teacherList = e.list;
                totalCounts = e.total;//总条数
                $('.lesstime_Result').html("共"+totalCounts+"条数据");
                var currentPage = e.pageNum;
                initPage(totalCounts, currentPage);
                $('#teacher-list li').remove();
                var str = '<li class="homework_list_title"><span>姓名</span><span>布置量</span><span>提交率</span><span>批复率</span><span>正确率（电子）</span></li>';
                $('#teacher-list').append(str);
                for (var i = 0; i < teacherList.length; i++) {
                    var teacherName = teacherList[i].teacherName;
                    var commitRate = teacherList[i].commitRate;
                    var correctRate = teacherList[i].correctRate;
                    var publishCount = teacherList[i].publishCount;
                    var replyRate = teacherList[i].replyRate;
                    var teacherEmail = teacherList[i].teacherEmail;
                    var itemHtml_ = '<li><span>'+teacherName+'</span><span>'+publishCount+'</span><span>'+parseInt((commitRate*100))+'%</span><span>'+parseInt((replyRate*100))+'%</span><span>'+parseInt((correctRate*100))+'%</span></li>';
                    $('#teacher-list').append(itemHtml_);
                }
            }

        }
    })

}

//导出教师列表
function exporTeacherList(){
    window.location.href = global.hw_expor;
}


