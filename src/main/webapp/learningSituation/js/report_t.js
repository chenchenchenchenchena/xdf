$(function(){


//点击查看成绩排行
$(document).on('touchend','.achievement_s>h4',function(){
    var title = $(this).parents('.achievement_s').siblings('.title_s').find('h4').html();
    sessionStorage.classcode = $(this).attr('classcode')
    sessionStorage.schoolid = $(this).attr('schoolid')
    window.location.href = 'rankinglist_t.html?title='+title;
});
//点击显示图标
$(document).on('touchend','.title_s',function(){
    if($(this).siblings('.achievement_s').css('display')=='none'){
        $(this).siblings().show()
        $(this).find('img').css('transform','rotate(-90deg)')
    }else{
       $(this).siblings().hide()
        $(this).find('img').css('transform','rotate(90deg)')
    }

});








var Xindex = '';
ajaxRequest('post','http://dt.staff.xdf.cn/xdfdtmanager/teacherAnalysis/queryScoreReportByTeacherEmail.do',{'teaEmail':'caoxuefeng@xdf.cn'},		function(e){
        console.log(e);
        if(e.data.length!=0){
            var Xtwindex = [];
            var Cindex = [];
            var Rindex = [];
            var classLen = e.data.length;
            for(var i = 0;i<classLen;i++){
                 Cindex = [];
                 Rindex = [];
$('.class_big').append('<div class="classroom_s"><div class="title_s"><h4>'+e.data[i].className+'</h4> <img src="images/rightArrow.png" alt=""/> </div><div id="chart_S'+i+'"></div><div class="achievement_s"> <h4 classCode="'+e.data[i].classCode+'" schoolId="'+e.data[i].schoolId +'">查看成绩排行</h4> <img src="images/rightArrow.png" alt=""> </div></div>');
            var class_ = e.data[i];
            var classData = class_.data;

            for(var k = 0;k<classData.length;k++){
                Xtwindex = [];
                // console.log(e.data[i].data[k].gradeType);
                var crdata = classData[k].data;
                if(crdata == '' || crdata == []){
                    continue;
                }
                var crdataLen = classData[k].data.length;
                var maxIndex = 0;
                if( crdataLen > 0){
                    for(var u = 0;u<crdataLen;u++){
                        if(classData[k].gradeType==1){
                            Rindex.push(classData[k].data[u].avgGrade);
                        }else{
                            Cindex.push(classData[k].data[u].avgGrade);
                        }
                    }
                    console.log(classData[1].data[0]);

                    if(classData[0].data.length==1&&classData[1].data.length>1&&classData[0].data.length!=0){
                        if(classData[0].data[classData[0].data.length-1].lessonNO>classData[0].data[classData[0].data.length-1].lessonNO){
                            maxIndex = classData[0].data[classData[0].data.length].lessonNO;
                        }else{
                            maxIndex = classData[0].data[classData[0].data.length-1].lessonNO;
                        }
                    }else if(classData[0].data.length>1&&classData[1].data.length<=1&&classData[1].data.length!=0){
                        if(classData[0].data[classData[0].data.length-1].lessonNO>classData[1].data[0].lessonNO){
                            maxIndex =classData[0].data[classData[0].data.length-1].lessonNO;
                        }else{
                            maxIndex = classData[1].data[0].lessonNO
                        }
                    }else if(classData[0].data.length==0&&classData[1].data.length>1){
                        maxIndex = classData[1].data[classData[1].data.length-1].lessonNO
                    }else if(classData[1].data.length==0&&classData[0].data.length>1){
                        maxIndex = classData[0].data[classData[0].data.length-1].lessonNO
                    }else if(classData[0].data.length==0&&classData[1].data.length==1){
                         maxIndex = classData[1].data[0].lessonNO
                    }else if(classData[1].data.length==0&&classData[0].data.length==1){
                        maxIndex = classData[0].data[0].lessonNO
                    }
                    // if(classData[0].data[classData[k].data.length-1].lessonNO>classData[1].data[classData[k].data.length-1].lessonNO){
                    //
                    // }

                }

                // console.log(maxIndex)
                for(var p = 0;p<maxIndex;p++){
                    Xtwindex.push(p+1);
                }
                // for(y = 0;y<0;y++){
                // }

                // if(e.data[i].data[0].data.length>e.data[i].data[1].data.length){
                //     Xindex = e.data[i].data[0].data.length
                // }else{
                //     Xindex = e.data[i].data[1].data.length
                // }
            }
                Echart('chart_S'+i+'',Xtwindex,Cindex,Rindex)

            }

            /*
             Xtwindex   //x轴
             Cindex     //出门测
             Rindex     //入门测
             */


            $('.title_s').eq(0).siblings().show();
            $('.title_s').eq(0).find('img').css('transform','rotate(-90deg)')
        }else{
            $('.no-data').show();
            $('.class_big').show();
        }







})






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