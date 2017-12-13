
/*默认筛选条件*/
var currentSchoolId = "";//默认全部
var currentSchool = "全部";//默认全部
var beginTime = "";//默认全部
var endTime = "";//默认全部
var homeworkType = "0"//默认作业类型全 部 0表示查询所以 1表示查询普通 2表示查询电子
var seacherName = "";
var totalCounts = "0";
var page = 1;
var pageSize = 15;

require(['jquery-1.11.0.min'], function () {
    require(['jquery-ui.min'], function () {
        require(['layer', 'requireConfig'], function () {
            //$('.loading_pre').show();

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
            currentSchool = params.schoolName;
            //初始化作业类型视图
            if(homeworkType == 0){
                $('.homework_radiu ul li').eq(0).find('img').attr('src', "images/checked.png");
                $('.homework_radiu ul li').eq(1).siblings().find('img').attr('src', "images/check.png");
                $('.homework_radiu ul li').eq(2).siblings().find('img').attr('src', "images/check.png");
            }else if(homeworkType == 1){
                $('.homework_radiu ul li').eq(1).find('img').attr('src', "images/checked.png");
                $('.homework_radiu ul li').eq(0).siblings().find('img').attr('src', "images/check.png");
                $('.homework_radiu ul li').eq(2).siblings().find('img').attr('src', "images/check.png");
            }else if(homeworkType == 2){
                $('.homework_radiu ul li').eq(2).find('img').attr('src', "images/checked.png");
                $('.homework_radiu ul li').eq(1).siblings().find('img').attr('src', "images/check.png");
                $('.homework_radiu ul li').eq(0).siblings().find('img').attr('src', "images/check.png");
            }
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
            $('#seacher_hw').off("keyup").on('keyup',function(even){

                if(even.keyCode==13){
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
        });
    });
});

/**
 *切换作业类型
 */
function changeHomeworkType(this_, flag) {
    homeworkType = flag;
    $(this_).find('img').attr('src', "images/checked.png");
    $(this_).siblings().find('img').attr('src', "images/check.png");

    /*重置筛选条件*/
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

function SelectTeacherList(){
    //$('.loading_pre').show();

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

    var params = {
        'schoolId': currentSchoolId,
        'teacher': seacherName,
        'pageNum': page,
        'pageSize': pageSize,
        'beginTime': beginTime,
        'endTime': endTime,
        'homeworkType': homeworkType
    };
    //$.ajax({
    //    type: "POST",
    //    url: global.hw_details,
    //    dataType: 'json',
    //    contentType: "application/json",
    //    data: JSON.stringify(params),
    //    success: function (e) {
    //
    //    }
    //})
    $('.loading_pre').hide();
}
