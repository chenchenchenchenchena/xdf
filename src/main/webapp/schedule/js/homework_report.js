/**
 * Created by xupingwei on 2017/9/7.
 */
$(function () {

    var Text_Grade = '成绩';
    var h_zhou_x = [];
    var Grade_eve = [];
    var className = GetRequest("className");
    var studentNo = GetRequest("studentNo");
    var classCode = GetRequest("classCode");
    var schoolId = GetRequest("schoolId");
    var remark = GetRequest("remark");
    var currentIndex = 0;


    //点击折叠切换
    $(document).on('touchend', '.title_s', function () {
        if ($(this).siblings().css('display') == 'none') {
            $(this).siblings().show();
            $(this).find('img').css('transform', 'rotate(-90deg)')
        } else {
            $(this).siblings().hide();
            $(this).find('img').css('transform', 'rotate(90deg)')
        }

    });
    var classCodeList = sessionStorage.classCodeList;
    if (remark == 2) {
        //表示：学生自己查看
        //获取学生所有已报班级的班级信息
        var classCodes = classCodeList.split(",");
        var data = {
            classCode: classCodes,
            schoolId: schoolId,
            studentNo: studentNo
        };
        ajaxRequest("POST", homework_s.s_hw_report, JSON.stringify(data), getReport);

    } else {
        //老师只能查看单个班级的学生作业报告
        //图表接口访问参数
        var data = {
            classCode: [classCode],
            schoolId: schoolId,
            studentNo: studentNo
        };
        ajaxRequest("POST", homework_s.s_hw_report, JSON.stringify(data), getReport);
    }

    function getReport(result) {
        if (result.result) {

            $('.no-data').hide();
            $('.class_big').show();
            var str = '';
            var data = result.date;
            // var data = [];
            // data.push({score: 90, HomeworkTimes: "09-05"});
            // data.push({score: 50, HomeworkTimes: "09-06"});
            // data.push({score: 60, HomeworkTimes: "09-07"});
            // data.push({score: 10, HomeworkTimes: "09-08"});
            // data.push({score: 80, HomeworkTimes: "09-09"});
            for (var i = 0; i < data.length; i++) {
                if (data[i].length > 0) {
                    str += '<div class="classroom_s">' +
                        '<div class="title_s">' +
                        '<h4></h4>' +
                        '<img src="../learningSituation/images/rightArrow.png" alt="" style="transform: rotate(-90deg);"> ' +
                        '</div> ' +
                        '<div id="chart_S' + i + '" style="width: 690px; height: 360px;"></div>'
                    '</div>';
                    $('.class_big').append(str);
                    for (var j = 0; j < data[i].length; j++) {
                        var scoreDay = data[i][j];
                        if (undefined != scoreDay) {
                            var score = scoreDay.score;
                            var HomeworkTimes = scoreDay.HomeworkTimes;
                            var className = scoreDay.className;
                            $('.chart_S'+i).siblings('.title_s').find("h4").html(className);
                            Grade_eve.push(score);
                            h_zhou_x.push(HomeworkTimes);
                        }
                    }
                }


            }

            Echart('chart_S' + currentIndex + '', Text_Grade, h_zhou_x, Grade_eve, 100);

            if (classList[currentIndex].classCode == classCode) {
                //表示当前班级的图标展示其他的折叠
                $('#chart_S' + currentIndex).show();
            } else {
                $('#chart_S' + currentIndex).hide();
            }

            currentIndex++;
        } else {
            $('.no-data').show();
            $('.class_big').hide();
        }
    }

    function Echart(id, series, x, dataItem, max) {
        var myChart = echarts.init(document.getElementById(id));
        var option = {
            tooltip: {
                trigger: 'axis',
                triggerOn: 'click',
                formatter: '满分：' + max + '<br />得分：{c}',
            },
            legend: {
                data: [series],
                textStyle: {
                    fontSize: 24
                },
                selectedMode: false
            },
            calculable: true,
            xAxis: [
                {
                    name: '日期',
                    type: 'category',
                    boundaryGap: false,
                    data: x,
                    nameTextStyle: {
                        fontSize: 24
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontSize: 24
                        }
                    }
                }
            ],
            yAxis: [
                {
                    name: '分数',
                    type: 'value',
                    max: max,
                    nameTextStyle: {
                        fontSize: 24
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontSize: 24
                        }
                    }
                }
            ],
            series: [
                {
                    name: series,
                    type: 'line',
                    data: dataItem,
                    symbolSize: 14,
                    nameTextStyle: {
                        fontSize: 24
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontSize: 24
                        }
                    },
                    lable: {
                        normal: {
                            textStyle: {
                                fontSize: 24
                            }
                        }
                    }
                }

            ]
        };

        // 为echarts对象加载数据
        myChart.setOption(option);
    }
});