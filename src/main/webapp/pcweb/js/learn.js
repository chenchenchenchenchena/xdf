/*默认筛选条件*/
var currentSchoolId = "";//默认全部
var currentSchool = "全部";//默认全部
var beginTime = "";//默认全部
var endTime = "";//默认全部
var seacherName = "";
var totalCounts = "0";
var page = 1;
var pageSize = 15;
var stuNumsOrder = "";
var img_order = "images/sort_h.png";
var order = "desc";

require(['jquery-1.11.0.min'], function () {
    require(['jquery-ui.min'], function () {
        require(['layer', 'requireConfig', 'jqPaginator.min'], function () {
            $('.loading_pre').show();

            // 重置左导航
            var number_l = 0;
            var url_l = location.href;

            if (url_l.indexOf('homework') != -1 || url_l.indexOf('homeworkdetail') != -1) {
                number_l = 1;
            }
            else if (url_l.indexOf('lesstime') != -1 || url_l.indexOf('lesstime_detail') != -1) {
                number_l = 2;
            }
            else if (url_l.indexOf('power') != -1 || url_l.indexOf('userAdd') != -1 || url_l.indexOf('useredit') != -1) {
                number_l = 3
            }
            else if (url_l.indexOf('master') != -1) {
                number_l = 4
            }
            else if (url_l.indexOf('learn') != -1) {
                number_l = 5
            }
            var $bure_true = $('.left_nav ul li').eq(number_l);
            $bure_true.addClass('activ_nav').siblings().removeClass('activ_nav');


            laydate.render({
                elem: '#date_input',
                range: true //指定元素
            });

            //默认为半年，与时间段为正向半联动。
            var today = new Date().Format("yyyy-MM-dd");
            var timeArray = getlastmonth();
            var halfYear = timeArray[3];
            $('#date_input').val(halfYear + " - " + today);

            //默认首次查询校区为全部
            currentSchoolId = localStorage.schoolList;
            currentSchool = "全部";

            //初始化分页控件
            initPage(totalCounts, page);
            //查询数据
            SelectList();

            //搜索点击事件
            $('#seacher_hw').parent().find('img').click(function () {
                $('.loading_pre').show();
                SelectList();
            });
            //搜索回车事件
            $('#seacher_hw').off("keyup").on('keyup', function (even) {

                if (even.keyCode == 13) {
                    $('.loading_pre').show();
                    $('.lesstime_Result').show();
                    SelectList();
                }
            });
            //筛选条件"确认"按钮 点击事件
            $('#hw_selectBtn').click(function () {
                $('.loading_pre').show();
                $('.lesstime_Result').show();
                SelectList();
            });

        });
    });
});

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
                    SelectList();
                }
            }
        });
    } else {
        $("#publicPage").html("");
    }
}

/**
 * 获取学情列表
 * @constructor
 */
function SelectList() {
    $('.loading_pre').show();

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
        'className': seacherName,
        'pageNum': page,
        'pageSize': pageSize,
        'beginDate': beginTime,
        'endDate': endTime,
        'stuNumsOrder': stuNumsOrder
    };
    $.ajax({
        type: "POST",
        url: global.lean_List,
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(params),
        success: function (e) {
            if (e.result) {
                if (e.Data.list != undefined && e.Data.list.length > 0) {

                    var list = e.Data.list;
                    totalCounts = e.Data.total;//总条数
                    $('.lesstime_Result').show();
                    $('.lesstime_Result').html("共" + totalCounts + "条数据");
                    var currentPage = e.Data.pageNum;
                    initPage(totalCounts, currentPage);
                    $('#learnReportList li').remove();
                    var str = '<li class="homework_list_title"><span>学校</span><span>班级编号</span><span>班级名称</span><span>主讲</span><span>班主任</span><span>学员量<img style="right: 0" src="' + img_order + '" alt="" onclick="get_order()" class="sort_h sort_homework" data-order="' + order + '"></span><span>导出本班汇总</span></li>';
                    $('#learnReportList').append(str);
                    for (var i = 0; i < list.length; i++) {
                        var classCode = list[i].classCode;
                        var className = list[i].className;
                        var schoolId = list[i].schoolId;
                        var schoolName = list[i].schoolName;
                        var stuNums = list[i].stuNums;
                        var teacherName = list[i].teacherName;
                        var masterTeacherName = list[i].masterTeacherName;
                        if (masterTeacherName == undefined) {
                            masterTeacherName = "暂无";
                        }
                        var itemHtml_ = '<li><span>' + schoolName + '</span><span>' + classCode + '</span><span>' + className + '</span><span>' + masterTeacherName + '</span><span>' + teacherName + '</span><span>' + stuNums + '</span><span><span style="width: auto"  data-schoolId="' + schoolId + '" data-schoolName="' + schoolName + '" class="look_details homework_operation">EXCEL</span></span></li>';
                        $('#learnReportList').append(itemHtml_);
                    }
                    $('.loading_pre').hide();

                } else {
                    layer.msg("暂无数据");
                    $('.loading_pre').hide();
                    $('#learnReportList li').remove();
                    $('.lesstime_Result').hide();
                    initPage(0, 1);
                }
            }
        }
    })
}


/**
 * 排序
 */
function  get_order(){
    if (order == 'desc') {
        stuNumsOrder = "stuNums desc";
        order = "asc";
        img_order = "images/sort_t.png";
    } else {
        stuNumsOrder = "stuNums asc";
        order = "desc";
        img_order = "images/sort_c.png";
    }
    page = 1;
    SelectList();
}
