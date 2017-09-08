/**
 * Created by xupingwei on 2017/9/7.
 */
$(function () {
    var Text_Grade = '成绩';
    var h_zhou_x = [];
    var Grade_eve = [];
    h_zhou_x.push("8-5");
    h_zhou_x.push("8-10");
    h_zhou_x.push("8-20");
    h_zhou_x.push("8-25");
    h_zhou_x.push("8-30");

    Grade_eve.push(30);
    Grade_eve.push(60);
    Grade_eve.push(50);
    Grade_eve.push(70);
    Grade_eve.push(50);
    Echart('chart_S' + 0 + '', Text_Grade, h_zhou_x, Grade_eve,100);
    Echart('chart_S' + 1 + '', Text_Grade, h_zhou_x, Grade_eve, 100);

    function Echart(id, series, x, dataItem,max) {
        var myChart = echarts.init(document.getElementById(id));
        var option = {
            tooltip: {
                trigger: 'axis',
                triggerOn: 'click',
                formatter: '满分：'+max+'<br />得分：{c}',
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