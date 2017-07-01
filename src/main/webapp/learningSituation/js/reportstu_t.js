$(function(){



var maxindex = '';

    /*
     Xtwindex   //x轴
     Cindex     //出门测
     Rindex     //入门测
     */
var Xtwindex = [];
var Cindex = [];
var Rindex = [];


var Xindex = '';




//切换









ajaxRequest('post','http://dt.staff.xdf.cn/xdfdtmanager/teacherAnalysis/scoreStdReport.do',{'teacherEmail':'caoxuefeng@xdf.cn','classCode':'CZSPP008','tCode':'1','studentNo':'SS2431','schoolId':'73'},		function(e){
            console.log(e);
            maxindex = e.data[e.data.length-1].lessonNo
            for(var i = 0;i<e.data.length;i++) {
                Rindex.push(e.data[i].AvgGrade);
                $('.reportstu_S ul').eq(0).append('<li>'+(i+1)+'</li>')
                $('.reportstu_S ul').eq(1).append('<li>'+e.data[i].realGrade+'</li>')
                $('.reportstu_S ul').eq(2).append('<li>'+e.data[i].AvgGrade+'</li>')
            }
            for(var j = 0;j<maxindex;j++){
                Xtwindex.push(j)
            }
    var myChart = echarts.init(document.getElementById('chart_S'));
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
                data :Xtwindex,
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
                data:Rindex,
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
            /*
             Xtwindex   //x轴
             Cindex     //出门测
             Rindex     //入门测
             */








});

    $('.title_s').eq(0).siblings().show();
    $('.title_s').eq(0).find('img').css('transform','rotate(-90deg)')



function Echart(id,x,y1,y2){


}




});