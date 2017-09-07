/**
 * Created by xupingwei on 2017/9/7.
 */
$(function () {
    var Text_Grade = "意向";
    var h_zhou_x =[];
    var Grade_eve = [];
    h_zhou_x.push("周一");
    h_zhou_x.push("周二");
    h_zhou_x.push("周三");
    h_zhou_x.push("周四");
    h_zhou_x.push("周五");
    h_zhou_x.push("周六");
    h_zhou_x.push("周日");

    Grade_eve.push(250);
    Grade_eve.push(1000);
    Grade_eve.push(500);
    Grade_eve.push(600);
    Grade_eve.push(600);
    Grade_eve.push(800);
    Grade_eve.push(1500);
    Echart('chart_S'+0+'',Text_Grade,h_zhou_x,Grade_eve,1500);
    Echart('chart_S'+1+'',Text_Grade,h_zhou_x,Grade_eve,1500);

    function Echart(id,daTatext,x,y1,max){
        var myChart = echarts.init(document.getElementById(id));
        var option = {
            tooltip : {
                trigger: 'axis',
                triggerOn:'click',
                formatter: '{c1}<br />总分：{c2},平均分：{c}',
            },
            legend: {
                data:[daTatext],
                textStyle: {
                    fontSize: 24
                },
                selectedMode:false
            },
            calculable : true,
            xAxis : [
                {
                    name:'',
                    type : 'category',
                    boundaryGap : false,
                    data :x,
                    nameTextStyle:{
                        fontSize:24
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontSize: 24
                        }
                    }
                }
            ],
            yAxis : [
                {
                    name:'',
                    type : 'value',
                    max:max,
                    nameTextStyle:{
                        fontSize:24
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontSize: 24
                        }
                    }
                }
            ],
            series : [
                {
                    name:Text_Grade,
                    type:'line',
                    data:y1,
                    symbolSize:14,
                    nameTextStyle:{
                        fontSize:24
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontSize: 24
                        }
                    },
                    lable:{
                        normal:{
                            textStyle:{
                                fontSize:24
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