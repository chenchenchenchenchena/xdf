$(function(){


//点击查看成绩排行
$(document).on('touchend','.achievement_s>h4',function(){
    var title = $(this).parents('.achievement_s').siblings('.title_s').find('h4').html();
    console.log(title);
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
var Xtwindex = [];
ajaxRequest('post','http://dt.staff.xdf.cn/xdfdtmanager/teacherAnalysis/queryScoreReportByTeacherEmail.do',{'teaEmail':'test@xdf.cn'},		function(e){
        console.log(e);
        if(e.data!=undefined){
            var Cindex = [];
            var Rindex = [];
            var classIndex = e.data.length;
            for(var i = 0;i<e.data.length;i++){

$('.class_big').append('<div class="classroom_s"><div class="title_s"><h4>'+e.data[i].className+'</h4> <img src="images/rightArrow.png" alt=""/> </div><div id="chart_S'+i+'"></div><div class="achievement_s"> <h4>查看成绩排行</h4> <img src="images/rightArrow.png" alt=""> </div></div>')

            for(var k = 0;k<e.data[i].data.length;k++){
                console.log(e.data[i].data[k].gradeType);
                for(var u = 0;u<e.data[i].data[k].data.length;u++){
                    if(e.data[i].data[k].gradeType==1){
                        Rindex.push(e.data[i].data[k].data[u].avgGrade)
                    }else{
                        Cindex.push(e.data[i].data[k].data[u].avgGrade)
                    }
                }
                var maxIndex = e.data[i].data[k].data[e.data[i].data[k].data.length-1].lessonNO;
                if(e.data[i].data[0].data.length>e.data[i].data[1].data.length){
                    Xindex = e.data[i].data[0].data.length
                }else{
                    Xindex = e.data[i].data[1].data.length
                }
            }

            }
            for(var i = 0;i<Xindex;i++){
                Xtwindex.push(i+1);
            }
            /*
             Xtwindex   //x轴
             Cindex     //出门测
             Rindex     //入门测
             */
            for(y = 0;y<classIndex;y++){
                Echart('chart_S'+y+'',Xtwindex,Cindex,Rindex)
            }
            console.log(Rindex);

            $('.title_s').eq(0).siblings().show();
            $('.title_s').eq(0).find('img').css('transform','rotate(-90deg)')
        }else{
            layer.msg(e.message)
        }







})






function Echart(id,x,y1,y2){
var myChart = echarts.init(document.getElementById(id));
var option = {
        tooltip : {
            trigger: 'item'
        },
        legend: {
            data:['出门测','入门测'],
            left:'20px',
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
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);

}




});