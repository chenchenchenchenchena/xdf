$(function(){
//禁止浏览器拖动
    addEventListener("touchmove", function (event) {
        event.preventDefault();
    }, false);
    // localStorage.terEmail="caoxuefeng@xdf.cn";
    // sessionStorage.teacherId="TC41";
    // sessionStorage.schoolId="73";
    // sessionStorage.teacherName="曹雪峰";
    // sessionStorage.stuNumber = 'SS1508';
//点击显示图标
$(document).on('touchend','.title_s',function(){
    if($(this).siblings('.achievement_s').css('display')=='none'){
        $(this).siblings().show()
        $(this).siblings('.tab_sreport').children('div').eq(0).show()
        $(this).find('img').css('transform','rotate(-90deg)')
        $(this).siblings('.tab_sreport').css('padding-bottom','40px');
    }else{
       $(this).siblings().hide()
        $(this).find('img').css('transform','rotate(90deg)')
        $('.reportstu_S').hide()
        $('.tab_record span').eq(0).addClass('tab_recorac').siblings().removeClass('tab_recorac')
    }

});
    var Stujson = {'studentNo':sessionStorage.stuNumber,'tCode':'1','schoolId':sessionStorage.schoolId};
    Studata();  //调取
//切换显示方式
    $(document).on('touchend','.tab_record span',function(){
       if(!$(this).hasClass('tab_recorac')){
           $(this).addClass('tab_recorac').siblings().removeClass('tab_recorac');
           $(this).parent().prev().children('div').eq($(this).index()).show().siblings().hide()
       }
    });



// tab切换


    $('.tab-title li').on('touchend',function(){
        $('.no-data').hide()
        $(this).addClass('tab-active').siblings().removeClass('tab-active')
            if($(this).index()==1){
                Stujson.tCode = '2';
                $('.class_big').find('.classroom_s').remove();
                Studata()
            }else{
                Stujson.tCode = '1';
                $('.class_big').find('.classroom_s').remove();
                Studata()
            }
    });



var Xindex = '';
var Thistime = [];
var Xtwindex = [];
var pjIndex = [];
var mfInedx = [];
var timeIndex = [];
var Cindex = [];
var maxNumber = 0;
function Studata(){
ajaxRequest('post',Study.s_study,Stujson,function(e){
    console.log(e)
        if(e.data.length!=0){
            var class_ = e.data;

                for(var i = 0;i<class_.length;i++) {
                    for(var s = 0;s<class_[i].length;s++){
                        if(class_[i][s].fullMarks>maxNumber){
                            maxNumber = class_[i][s].fullMarks
                        }
                    }
                  Xindex = '0';
                  Thistime = [];
                  Xtwindex = [];
                  pjIndex = [];
                  mfInedx = [];
                  timeIndex = [];
                Cindex = [];
                $('.class_big').append('<div class="classroom_s"><div class="title_s"><h4>' + class_[i][0].className + '</h4> <img src="images/rightArrow.png" alt=""/> </div><div class="tab_sreport"><div id="chart_S' + i + '"></div><div class="reportstu_S"> <ul> <li>课次</li> </ul> <ul> <li>常效新</li> </ul> <ul> <li>平均分</li> </ul> </div></div><div class="tab_record"> <span class="tab_recorac">趋势图</span> <span>报表</span> </div><div class="achievement_s"></div>');


                for (var y = 0; y < class_[i].length; y++) {
                    $('.reportstu_S').eq(i).find('ul').eq(0).append('<li>' + e.data[i][y].lessonNO + '</li>');
                    $('.reportstu_S').eq(i).find('ul').eq(1).append('<li>' + (e.data[i][y].realGrade) + '</li>');
                    $('.reportstu_S').eq(i).find('ul').eq(1).find('li').eq(0).html(e.data[i][0].studentName);
                    $('title').html(e.data[i][0].studentName+'同学');
                    $('.reportstu_S').eq(i).find('ul').eq(2).append('<li>' + (e.data[i][y].avgGradeView) + '</li>');
                    $('.reportstu_S').eq(i).find('ul').css('width',146.5* $('.reportstu_S').eq(i).find('ul').eq(1).find('li').length);
                $('.tab_sreport').eq(0).find('div').eq(0).show();
                $('.achievement_s').eq(0).show();
                $('.tab_record').eq(0).show();
                $('.title_s').eq(0).find('img').css('transform', 'rotate(-90deg)');

                 Xindex = e.data[i][e.data[i].length - 1].lessonNO;
                /*
                 Xtwindex   //x轴
                 Cindex     //出门测
                 Rindex     //入门测
                 */
                }
                if(Xindex==e.data[0].length){
                    for(var j = 0;j<Xindex;j++){
                        Xtwindex.push(j+1);
                        Cindex.push(e.data[0][j].avgGradeView);
                        pjIndex.push(e.data[0][j].realGrade);
                        mfInedx.push('满分:'+e.data[0][j].fullMarks);
                        timeIndex.push(e.data[0][j].lessonTime.split(' ')[0]);
                    }
                }else{

                        for(var j = 0;j<Xindex;j++){
                            Xtwindex.push(j+1);
                            var buer = false;
                            for(var k = 0;k<e.data[i].length;k++){
                                if((j+1)==e.data[i][k].lessonNO){
                                    Cindex.push(e.data[i][k].avgGradeView);
                                    pjIndex.push(e.data[i][k].realGrade);
                                    mfInedx.push('满分:'+e.data[i][k].fullMarks);
                                    timeIndex.push(e.data[i][k].lessonTime.split(' ')[0]);
                                    buer = true;
                                    break;
                                }
                            }
                            if(buer!=true){
                                Cindex.push('0');
                                pjIndex.push('0');
                                mfInedx.push('0');
                                timeIndex.push('0');
                            }
                        }

                }
                console.log(Cindex);
                Echart('chart_S'+i+'',Xtwindex,Cindex,pjIndex,timeIndex,mfInedx,maxNumber)
            }

            $('.tab_sreport').css('padding','0');
            $('.tab_sreport').eq(0).css('padding-bottom','40px');
            $('.title_s').eq(0).siblings().show();
            $('.title_s').eq(0).find('img').css('transform','rotate(-90deg)');
            $('.classroom_s').css('border-bottom','1px solid #e1e1e1')
        }else{
            $('.no-data').show();
            $('.class_big').show();
            $('.classroom_s').css('border','none')
        }







})};





    function Echart(id,x,y1,y2,y3,y4,max){
        var myChart = echarts.init(document.getElementById(id));
        var option = {
        tooltip : {
            trigger: 'axis',
            triggerOn:'click',
            formatter: '{c2}<br />得分：{c}<br />平均分:{c1}<br />{c3}',
        },
        legend: {
            data:['个人得分','平均分'],
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
                },
                lable:{
                    normal:{
                        textStyle:{
                            fontSize:24
                        }
                    }
                }
            }
        ],
        yAxis : [
            {
                name:'分数',
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
                },
                lable:{
                    normal:{
                        textStyle:{
                            fontSize:24
                        }
                    }
                }
            }
        ],
        series : [
            {
                name:'个人得分',
                type:'line',
                data:y2,
                symbolSize:14,
                nameTextStyle:{
                    fontSize:24
                },
                axisLabel: {
                    show: true,
                },
                lable:{
                    normal:{
                        textStyle:{
                            fontSize:24
                        }
                    }
                }
            },
            {
                name:'平均分',
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
                },lable:{
                normal:{
                    textStyle:{
                        fontSize:24
                    }
                }
            }
            },
            {
                name:'日期',
                type:'line',
                data:y3,
                lable:{
                    normal:{
                        textStyle:{
                            fontSize:24
                        }
                    }
                }

            },
            {
                name:'总分',
                type:'line',
                data:y4,
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