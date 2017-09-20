/**
 * Created by xupingwei on 2017/9/7.
 */
$(function () {

    var Text_Grade = '成绩';
    var h_zhou_x = [];
    var Grade_eve = [];
    var hwType = [];
    var className = GetRequest("className");
    var studentNo = GetRequest("studentNo");
    var classCode = GetRequest("classCode");
    var schoolId = GetRequest("schoolId");
    var remark = GetRequest("remark");


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
    var classCodes = [];
    if (remark == 2) {
        //表示：学生自己查看
        //获取学生所有已报班级的班级信息
        classCodes = classCodeList.split(",");
        var data = {
            'classCode': classCodes,
            'schoolId': schoolId,
            'studentNo': studentNo
        };
        ajaxRequest("POST", homework_s.s_hw_report, JSON.stringify(data), getReport);

    } else {
        //老师只能查看单个班级的学生作业报告
        //图表接口访问参数
        classCodes.push(classCode);
        var data = {
            'classCode': [classCode],
            'schoolId': schoolId,
            'studentNo': studentNo
        };
        ajaxRequest("POST", homework_s.s_hw_report, JSON.stringify(data), getReport);
    }

    function getReport(e) {
        e = JSON.parse(e);
        if (e.result) {

            $('.no-data').hide();
            $('.class_big').show();
            var str = '';
            var data = e.data;

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
                    var maxScore = 0;
                    for (var j = 0; j < data[i].length; j++) {
                        var scoreDay = data[i][j];
                        if (undefined != scoreDay) {
                            var score = parseInt(scoreDay.score);
                            if(scoreDay.score == undefined || scoreDay.score == ""){
                                score = 0;
                            }
                            var HomeworkTimes = scoreDay.HomeworkTimes;
                            var homeworkType = scoreDay.homeworkType;
                            var hwTypeText = "";
                            if (homeworkType == 2 || homeworkType == "2") {
                                hwTypeText = "电子作业";
                            } else {
                                hwTypeText = "普通作业";
                            }

                            var className = scoreDay.className;
                            $('#chart_S' + i).siblings('.title_s').find("h4").html(className);
                            var d = {name: hwTypeText, value: score};
                            Grade_eve.push(d);
                            h_zhou_x.push(HomeworkTimes);
                            hwType.push(hwTypeText);
                            if (score > maxScore) {
                                maxScore = score;
                            }
                        }
                    }

                    Echart('chart_S' + i + '', Text_Grade, h_zhou_x, Grade_eve, maxScore, hwType);

                    if (undefined != classCodes && classCodes != "" && classCodes[i] == classCode) {
                        //表示当前班级的图标展示其他的折叠
                        $('#chart_S' + i).show();
                    } else {
                        $('#chart_S' + i).hide();
                    }
                }


            }
        } else {
            $('.no-data').show();
            $('.class_big').hide();
        }
    }

    function Echart(id, series, x, dataItem, max, hwType) {
        var myChart = echarts.init(document.getElementById(id));
        var option = {
            tooltip: {
                trigger: 'axis',
                triggerOn: 'click',
                formatter: function (params) {
                    return '' + params[0].data.name +':'+params[0].data.value+'分';
                }
            },
            legend: {
                data: [series],
                textStyle: {
                    fontSize: 24
                },
                selectedMode: false
            },
            calculable: true,
            dataZoom: [{
                type: 'inside',
                throttle: 50
            }],
            xAxis: [
                {
                    name: '日期',
                    type: 'category',
                    boundaryGap: false,
                    data: x,
                    axisLine: {
                        onZero: true
                    },
                    nameTextStyle: {
                        fontSize: 24
                    },
                    axisLabel:{
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
                    smooth: true,
                    nameTextStyle: {
                        fontSize: 2
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