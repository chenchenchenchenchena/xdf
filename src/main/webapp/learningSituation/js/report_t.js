$(function(){
var myChart = echarts.init(document.getElementById("chart_S"));
var option = {
    tooltip : {
        trigger: 'item'
    },
    legend: {
        data:['最高气温','最低气温']
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : ['周一','周二','周三','周四','周五','周六','周日','周日'],
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel : {
                formatter: '{value} °C'
            }
        }
    ],
    series : [
        {
            name:'最高气温',
            type:'line',
            data:[1, 2, 3, 4, 8, 6, 7],
        },
        {
            name:'最低气温',
            type:'line',
            data:[7, 6, 3, 2, 1, 0, 7],
        }
    ]
};

// 为echarts对象加载数据
myChart.setOption(option);






})