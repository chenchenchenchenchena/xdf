/* 课时统计 */

/*全局参数*/
var currentCity = '';
var currentCityId = '';
var beginTime = '';
var endTime = '';
var lookType = '2';
var ECharts;
var schoolLookType_ = 1;//柱形图和列表的标志

require(['jquery-1.11.0.min'], function () {
    require(['jquery-ui.min', 'layer'], function () {
        require(['echarts.min'], function (echarts) {
            // 重置左导航
            var number_l = 0;
            var url_l = location.href;

            if (url_l.indexOf('homework') != -1 || url_l.indexOf('detail') != -1) {
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
            var $bure_true = $('.left_nav ul li').eq(number_l);
            $bure_true.addClass('activ_nav').siblings().removeClass('activ_nav');

            laydate.render({
                elem: '#date_input',
                range: true //指定元素
            });

            //默认是全部校区
            currentCityId = localStorage.schoolList;
            currentCity = "全部";
            SelectData();//根据默认筛选数据
            //筛选条件确定点击事件
            $('.select-btn').click(function () {
                //获取筛选条件
                var time = $('#date_input').val();
                if (time != undefined && time != "") {
                    beginTime = time.substring(0, 10);
                    endTime = time.substring(13, time.length);
                }
                SelectData();
            });

            ECharts = echarts;//保存图标实例化对象
        });
    });
});

/**
 * 曲线图/柱状图
 * @param id:捆绑的布局ID
 * @param campus:x轴
 * @param value:对应的值
 * @param type :line-曲线图,bar-柱状图
 * @param yName :y轴显示的名字
 * @param xName :x轴显示的名字
 */
function line_echar(id, campus, value, type, yName, xName) {
    var x = xName;
    if (xName == "日期") {
        var xType = parseInt(lookType);
        switch (xType) {
            case 0:
                x = "日";
                break;
            case 1:
                x = "周";
                break;
            case 2:
                x = "月";
                break;
            case 3:
                x = "年";
                break;
        }

    }
    var dataZoom_ = [{
        type: 'slider',
        start: 100,
        end: 50,
        handleSize: 8,
    }, {
        type: 'inside',
        start: 94,
        end: 100,
    }];
    var interval = {};
    var maxNum;
    if(xName == "校区"){

        if (campus.length <= 10) {
            dataZoom_ = [];
            maxNum = campus.length;
            interval = {
                interval: 0,
                rotate: -30
            };

        } else {
            maxNum = 10;
            interval = {
                rotate: -30
            };
        }
    }else {
        interval = {};
        if (campus.length <= 4) {
            dataZoom_ = [];
            maxNum = campus.length;

        } else {
            maxNum = 4;
        }
    }

    var myChart = ECharts.init(document.getElementById(id));
    myChart.clear();
    option = {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {

                //type : 'shadow'

            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: campus,
                axisTick: {
                    alignWithLabel: true

                },
                splitNumber:maxNum,//分割段数，默认为5
                name: x,
                nameGap: '-5',
                axisLabel: interval
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: yName,

            }
        ],
        dataZoom: dataZoom_,
        series: [
            {
                name: yName,
                type: type,
                barWidth: '60%',
                data: value
            }
        ]
    };
    myChart.setOption(option, true);
}

/**
 * 获取校区
 */
function getSchool() {
    if ($('.homework_samll_one ul').css('display') != 'none') {
        $('.homework_samll_one ul').hide();
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

/**
 *筛选校区列表显示
 */
function showSchoolList(e) {
    var schoolStr = localStorage.schoolList;// 全部的校区ID
    var schoolIdList = schoolStr.split(',');

    var schoolList = e.data;
    if (schoolList != undefined && schoolList.length > 0) {
        $(".homework_samll_one ul").html("");
        var cityContent = "<li onclick='filterByCityId(this, \"" + "全部" + "\")' data-schoolId='" + schoolStr + "'><span>全部</span></li>";
        for (var i = 0; i < schoolIdList.length; i++) {
            for (var j = 0; j < schoolList.length; j++) {
                var schoolId = schoolList[j].tCode;
                if (schoolIdList[i] == schoolId) {
                    cityContent += "<li onclick='filterByCityId(this, \"" + schoolList[j].tName + "\")' data-schoolId='" + schoolId + "' ><span>" + schoolList[j].tName + "</span></li>";
                }
            }

        }
        $(".homework_samll_one ul").html(cityContent);
    } else {
        layer.msg("查询失败!")
    }

    $('.homework_samll_one ul').show();
}

/**
 * 点击选择校区
 */
function filterByCityId(_this, cityName) {
    currentCity = cityName;
    currentCityId = $(_this).attr('data-schoolId');
    $(".homework_samll_one h4").html(currentCity);
    $('.homework_samll_one ul').hide();
}

/**
 * 筛选数据接口实现
 * @constructor
 */
function SelectData() {
    var params = {
        "schoolId": currentCityId,
        'beginDate': beginTime,
        'endDate': endTime,
        'flag': lookType
    };
    $.ajax({
        type: "POST",
        url: global.lesstime_total,
        dataType: 'json',
        data: JSON.stringify(params),
        success: function (e) {
            if (e.result) {
                var teacherTotalData = e.TeacherTotalData;//校区对比集合
                var viewClassTeacherData = e.ViewClassTeacherData;//班主任集合
                var viewMasterTeacherData = e.ViewMasterTeacherData;//主讲老师集合
                var teacherData = e.TeacherData;//老师集合

                var masterTeacherTotal = 0;//主讲总课时
                var classTeacherTotal = 0;//班主任总课时
                var total = 0;//教师总课时
                var teacherXList = [];//老师趋势图数据X轴值
                var teacherYList = [];//老师趋势图数据Y轴值
                var headTeacherXList = [];//班主任趋势图数据X轴值
                var headTeacherYList = [];//班主任趋势图数据Y轴值
                var masterTeacherXList = [];//主讲趋势图数据X轴值
                var masterTeacherYList = [];//主讲趋势图数据Y轴值
                /*班主任趋势图数据*/
                for (var i = 0; i < viewClassTeacherData.length; i++) {
                    if (viewClassTeacherData[i].classTeacherViewTime != " " && viewClassTeacherData[i].classTeacherViewTime != "" && viewClassTeacherData[i].classTeacherViewTime != undefined) {
                        classTeacherTotal += parseInt(viewClassTeacherData[i].classTeacherViewTotal);
                        headTeacherXList.push(viewClassTeacherData[i].classTeacherViewTime);
                        headTeacherYList.push(parseInt(viewClassTeacherData[i].classTeacherViewTotal));
                    }
                }
                /*主讲趋势图数据*/
                for (var j = 0; j < viewMasterTeacherData.length; j++) {
                    if (viewMasterTeacherData[j].masterTeacherViewTime != " " && viewMasterTeacherData[j].masterTeacherViewTime != "" && viewMasterTeacherData[j].masterTeacherViewTime != undefined) {
                        masterTeacherTotal += parseInt(viewMasterTeacherData[j].masterTeacherViewTotal);
                        masterTeacherXList.push(viewMasterTeacherData[j].masterTeacherViewTime);
                        masterTeacherYList.push(parseInt(viewMasterTeacherData[j].masterTeacherViewTotal));
                    }
                }
                total = parseInt(masterTeacherTotal) + parseInt(classTeacherTotal);
                /*老师趋势图数据*/
                for (var i = 0; i < teacherData.length; i++) {
                    if (teacherData[i].time != " " && teacherData[i].time != "" && teacherData[i].time != undefined) {
                        teacherXList.push(teacherData[i].time);
                        teacherYList.push(teacherData[i].total);
                    }
                }

                /*课时统计的显示*/
                $('#head_lesstime h1').html(classTeacherTotal);//班主任
                $('#master_lesstime h1').html(masterTeacherTotal);//主讲
                $('#teacher_lesstime h1').html(total);//老师
                if (teacherXList.length == 0) {
                    //隐藏图，显示暂无数据
                    $('#teacher_echart').siblings().eq(1).show();
                    $('#teacher_echart').hide();

                } else {
                    $('#teacher_echart').siblings().eq(1).hide();
                    $('#teacher_echart').show();
                    line_echar('teacher_echart', teacherXList, teacherYList, 'line', "课时", "日期");

                }
                if (headTeacherXList.length == 0) {
                    $('#head_echart').siblings().eq(1).show();
                    $('#head_echart').hide();
                } else {
                    $('#head_echart').siblings().eq(1).hide();
                    $('#head_echart').show();
                    line_echar('head_echart', headTeacherXList, headTeacherYList, 'line', "课时", "日期");

                }
                if (masterTeacherXList.length == 0) {
                    $('#master_echart').siblings().eq(1).show();
                    $('#master_echart').hide();
                } else {
                    $('#master_echart').siblings().eq(1).hide();
                    $('#master_echart').show();
                    line_echar('master_echart', masterTeacherXList, masterTeacherYList, 'line', "课时", "日期");
                }


                /*校区数据处理展示*/
                if (teacherTotalData != undefined && teacherTotalData.length > 0) {

                    /*班课量/课时量趋势图数据*/
                    var lessonNumList = [];
                    var lessonHourList = [];
                    var schoolList = [];

                    $('.lesstime_list li').remove();
                    var str_th = '<li class="homework_list_title"><span>校区</span><span>班主任数量（人）</span><span>班课次（个）</span><span>课时量（h）</span></li>';
                    $('.lesstime_list').append(str_th);
                    for (var k = 0; k < teacherTotalData.length; k++) {

                        var headTeacherTotal = teacherTotalData[k].headTeacherTotal;//班主任数量
                        var totalLessonHour = parseInt(teacherTotalData[k].totalLessonHour);//分校区班主任课时总量
                        var totalLessonNos = parseInt(teacherTotalData[k].totalLessonNos);//分校区班主任班课总量
                        var schoolName = teacherTotalData[k].schoolName;//分校区名称
                        var schoolId = teacherTotalData[k].schoolId;//分校区id
                        lessonNumList.push(totalLessonNos);
                        lessonHourList.push(totalLessonHour);
                        schoolList.push(schoolName.substring(0, schoolName.length - 3));
                        if(schoolName != undefined && schoolName != ""){
                            var html_ = "<li><span>" + schoolName + "</span><span>" + headTeacherTotal + "</span><span>" + totalLessonNos + "</span><span>" + totalLessonHour + "</span></li>";
                            $('.lesstime_list').append(html_);
                            $('.lesstime_list li:nth-child(odd)').css('background', '#f5fbfa');
                        }

                    }
                    /*班课量/课时量趋势图展示*/
                    line_echar('class_echart', schoolList, lessonNumList, 'bar', "班课次", "校区");
                    line_echar('lesstime_echart', schoolList, lessonHourList, 'bar', "课时次", "校区");
                    if (schoolLookType_ == 1) {
                        //隐藏柱状图
                        $('.last_lesstime_chart').css('opacity', 1);
                        $('.last_lesstime_chart').hide();
                    }

                } else {
                    $('.lesstime_list li').remove();
                    layer.msg("暂无数据");
                }

            }
        }
    })
}

/**
 * 查看明细
 * @param this_
 * @param flag
 */
function lookDetails(this_, flag) {
    //flag:0表示班主任；1表示主讲
    var params = {
        'currentCityId': currentCityId,
        'currentCity': currentCity,
        'beginTime': beginTime,
        'endTime': endTime,
        'flag': flag
    }
    sessionStorage.lesstimeDetailParams = JSON.stringify(params);
    $(this_).attr('href', "#/lesstime_detail");

}

/**
 * 校区对比切换查看方式(柱状图/列表)
 * @param this_
 * @param flag
 */
function schoolLookType(this_, flag) {
    if ($(this_).hasClass("homework_active")) {
        //如果已选中，则不做处理
    } else {
        $(this_).addClass("homework_active")
        $(this_).siblings().removeClass("homework_active")
        schoolLookType_ = flag;
        if (flag == 1) {
            $('.last_lesstime_chart').hide();
            $('.lesstime_list').show();
        } else {
            $('.last_lesstime_chart').show();
            $('.lesstime_list').hide();

        }
    }
}

/**
 * 结果列表切换查看方式
 * @param this_
 * @param flag
 */
function resultLookType(this_, flag) {
    if ($(this_).hasClass("homework_active")) {
        //如果已选中，则不做处理
    } else {
        $(this_).addClass("homework_active")
        $(this_).siblings().removeClass("homework_active")
        lookType = flag + "";
        SelectData();
    }
}



