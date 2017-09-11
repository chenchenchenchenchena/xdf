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
    var classList = [];
    var currentIndex = 0;


    //点击折叠切换
    $(document).on('touchend', '.title_s', function () {
        if ($(this).siblings().css('display') == 'none') {
            $(this).siblings().show()
            $(this).find('img').css('transform', 'rotate(-90deg)')
        } else {
            $(this).siblings().hide()
            $(this).find('img').css('transform', 'rotate(90deg)')
        }

    });
    if (remark == 2) {
        //表示：学生自己查看
        //获取学生所有已报班级的班级信息
        var emailm = {
            'studentCode': studentNo,
            'beginDate': sessionStorage.timetoday.split(' ')[0],
            'endDate': sessionStorage.timetoday.split(' ')[0],
            'schoolId': schoolId
        };
        ajax_S(url.s_stud, emailm, stusea);
        function stusea(e) {
            if (e.result) {

                var dataList = e.data.Data;
                //判断是否有班级信息
                if (undefined != dataList && dataList.length > 0) {
                    for (var i = 0; i < dataList.length; i++) {
                        var className = dataList[i].ClassName;
                        var classCode = dataList[i].ClassCode;

                        var titleData = {
                            className: className,
                            classCode: classCode
                        };
                        classList.push(titleData);
                    }

                }
            }

            //初始化页面布局
            if (classList.length > 0) {

                for (var j = 0; j < classList.length; j++) {
                    var data = {
                        classCode: classList[j].classCode,
                        schoolId: schoolId,
                        studentNo: studentNo
                    };
                    ajaxRequest("POST", homework_s.s_hw_report, JSON.stringify(data), getReport);
                }

            }else {

                $('.no-data').show();
                $('.class_big').hide();
            }


        }

    } else {
        //老师只能查看单个班级的学生作业报告
        //图表接口访问参数
        var data = {
            classCode: classCode,
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
            str += '<div class="classroom_s">' +
                '<div class="title_s">' +
                '<h4>' + classList[currentIndex].className + '</h4>' +
                '<img src="../learningSituation/images/rightArrow.png" alt="" style="transform: rotate(-90deg);"> ' +
                '</div> ' +
                '<div id="chart_S' + currentIndex + '" style="width: 690px; height: 360px;"></div>'
            '</div>';

            $('.class_big').append(str);
            var data = result.date;
            var data = [];
            data.push({score: 90, HomeworkTimes: "09-05"});
            data.push({score: 50, HomeworkTimes: "09-06"});
            data.push({score: 60, HomeworkTimes: "09-07"});
            data.push({score: 10, HomeworkTimes: "09-08"});
            data.push({score: 80, HomeworkTimes: "09-09"});
            for (var i = 0; i < data.length; i++) {
                var scoreDay = data[i];
                if (undefined != scoreDay) {
                    var score = scoreDay.score;
                    var HomeworkTimes = scoreDay.HomeworkTimes;
                    Grade_eve.push(score);
                    h_zhou_x.push(HomeworkTimes);
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