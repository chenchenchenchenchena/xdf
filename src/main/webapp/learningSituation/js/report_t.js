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
var Thistime = [];
ajaxRequest('post',Study.t_self,{'teaEmail':'caoxuefeng@xdf.cn'},		function(e){
        console.log(e);
        if(e.data.length!=0){
            var Xtwindex = [];
            var Cindex = [];
            var Rindex = [];
            var classLen = e.data.length;
            for(var i = 0;i<classLen;i++){
                var xzhou = [];
                var yzhou_c = [];
                var yzhou_r = [];
                var mfInedx_r = [];
                var mfInedx_c = [];
                var timeIndex  = [];
$('.class_big').append('<div class="classroom_s"><div class="title_s"><h4>'+e.data[i].className+'</h4> <img src="images/rightArrow.png" alt=""/> </div><div id="chart_S'+i+'" style="width: 690px;height: 360px;display:none;"></div><div class="achievement_s"> <h4 classCode="'+e.data[i].classCode+'" schoolId="'+e.data[i].schoolId +'">查看成绩排行</h4> <img src="images/rightArrow.png" alt=""> </div></div>');
                $('.title_s').eq(0).siblings().show();
                $('.title_s').eq(0).find('img').css('transform','rotate(-90deg)')
                var Cindex = e.data[i].data[0].data.length;
                var Rindex = e.data[i].data[1].data.length;
                if(Cindex==0&&Rindex!=0){
                    var Cindex_max = 0;
                    var Rindex_max = e.data[i].data[1].data[Rindex-1].lessonNO;
                    if(Rindex_max!=Rindex) {
                        for (var j = 0; j < Rindex_max; j++) {
                            xzhou.push(j + 1);
                            yzhou_r.push('0');
                            var buer = false;
                            for (var k = 0; k < Rindex; k++) {
                                if ((j + 1) == e.data[i].data[1].data[k].lessonNO) {
                                    yzhou_c.push(e.data[i].data[1].data[k].avgGrade);
                                    mfInedx_r.push('满分：' + e.data[i].data[1].data[k].fullMarks);
                                    timeIndex.push(e.data[i].data[1].data[k].lessonTime.split(' ')[0]);
                                    buer = true;
                                    break;
                                }
                                mfInedx_c.push('满分：0')
                            }
                            if (buer != true) {
                                yzhou_c.push('0');
                                mfInedx_r.push('满分：0');
                                timeIndex.push('0');
                            }
                            mfInedx_c.push('满分：0')
                        }
                    }else {
                        for (var j = 0; j < Rindex_max; j++) {
                            xzhou.push(j + 1);
                            yzhou_c.push('0');
                            yzhou_r.push(e.data[i].data[1].data[j].avgGrade);
                            mfInedx_r.push('满分：' + e.data[i].data[1].data[j].fullMarks);
                            mfInedx_c.push('满分：0');
                            timeIndex.push(e.data[i].data[1].data[j].lessonTime.split(' ')[0]);
                        }
                    }
                    Echart('chart_S' + i + '', xzhou, yzhou_c, yzhou_r, mfInedx_r, timeIndex, mfInedx_c)
                    }else if(Cindex!=0&&Rindex==0){
                    var Cindex_max = e.data[i].data[0].data[Cindex-1].lessonNO;
                    var Rindex_max = 0;
                    if(Cindex_max!=Cindex){
                        for(var j = 0;j<Cindex_max;j++){
                            xzhou.push(j+1);
                            yzhou_r.push('0');
                            var buer = false;
                            for(var k = 0;k<Cindex;k++){
                                if((j+1)==e.data[i].data[0].data[k].lessonNO){
                                    yzhou_c.push(e.data[i].data[0].data[k].avgGrade);
                                    mfInedx_r.push('满分:'+e.data[i].data[0].data[k].fullMarks);
                                    timeIndex.push(e.data[i].data[0].data[k].lessonTime.split(' ')[0]);
                                    buer = true;
                                    break;
                                }
                                mfInedx_c.push('满分：0')
                            }
                            if(buer!=true){
                                yzhou_c.push('0');
                                mfInedx_r.push('满分：0');
                                timeIndex.push('0');
                            }
                            mfInedx_c.push('满分：0')
                        }
                        console.log(yzhou_c);
                        Echart('chart_S'+i+'',xzhou,yzhou_c,yzhou_r,mfInedx_r,timeIndex,mfInedx_c)
                    }else{
                        for(var j = 0;j<Cindex_max;j++){
                            xzhou.push(j+1);
                            yzhou_c.push('0');
                            yzhou_r.push(e.data[i].data[0].data[j].avgGrade);
                            mfInedx_r.push('满分：'+e.data[i].data[0].data[j].fullMarks);
                            mfInedx_c.push('满分：0');
                            timeIndex.push(e.data[i].data[0].data[j].lessonTime.split(' ')[0]);
                        }
                        Echart('chart_S'+i+'',xzhou,yzhou_r,yzhou_c,mfInedx_r,timeIndex,mfInedx_c)
                    }
                }else if(Cindex==0&&Rindex==0){
                    var Cindex_max = 0;
                    var Rindex_max = 0;
                }else{
                    
                }


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




function Echart(id,x,y1,y2,mf,time,mf_c){
var myChart = echarts.init(document.getElementById(id));
var option = {
        tooltip : {
            trigger: 'axis',
            triggerOn:'click',
            formatter: '{c2}<br />入门测：{c3},平均分：{c}<br />出门测：{c4},平均分：{c1}',
        },
        legend: {
            data:['入门测','出门测'],
            textStyle: {
                fontSize: 24
            },
            selectedMode:false
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
                name:'入门测',
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
                name:'出门测',
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
                data:time

            },
            {
                name:'总分',
                type:'line',
                data:mf
            },
            {
                name:'总分',
                type:'line',
                data:mf_c
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);

}




});