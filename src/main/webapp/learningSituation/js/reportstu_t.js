$(function(){



var Xtwindex = [];




var Xindex = '';
ajaxRequest('post','http://dt.staff.xdf.cn/xdfdtmanager/teacherAnalysis/scoreStdReport.do',{'teacherEmail':'caoxuefeng@xdf.cn','classCode':'CZ01UMHN2U121','tCode':'2','studentNo':'SS1174'},		function(e){
            if(sessionStorage.tCode==1){

            }else{
                console.log(e)
                Xindex = e.data
            }
            /*
             Xtwindex   //x轴
             Cindex     //出门测
             Rindex     //入门测
             */


    $('.title_s').eq(0).siblings().show();
    $('.title_s').eq(0).find('img').css('transform','rotate(-90deg)')





});






function Echart(id,x,y1,y2){
var myChart = echarts.init(document.getElementById(id));
var option = {
        tooltip : {
            trigger: 'axis',
            triggerOn:'click',
            formatter: '{c1}<br />{a2}:{c2}<br />平均分:{c}',
        },
        legend: {
            data:['出门测','入门测'],
            textStyle: {
                fontSize: 24
            }
        },
        calculable : true,
        xAxis : [
            {
                name:'课次',
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
                name:'分数',
                type : 'value',
                max : '10',
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
                name:'出门测',
                type:'line',
                data:y1,
                nameTextStyle:{
                    fontSize:24
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: 24
                    }
                }
            },
            {
                name:'入门测',
                type:'line',
                data:y2,
                nameTextStyle:{
                    fontSize:24
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: 24
                    }
                }
            },
            {
                name:'日期',
                type:'line',
                data:['11:00','12:00','13:00']

            },
            {
                name:'总分',
                type:'line',
                data:['10分','10分','10分']
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);

}




});