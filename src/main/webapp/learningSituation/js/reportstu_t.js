$(function(){

    var Stujson = {'teacherEmail':localStorage.terEmail,'classCode':sessionStorage.classcode,'tCode':GetRequest('tCode'),'studentNo':GetRequest('studentNo'),'schoolId':sessionStorage.schoolId};
    Studata();  //调取
    if(GetRequest('tCode')=='2'){
        $('.tab-title li').eq(0).removeClass('tab-active').siblings().addClass('tab-active')
    }
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
            Stujson.tCode='2';
            // $('.class_big').find('.classroom_s').remove();
            Studata()
        }else{
            Stujson.tCode='1';
            // $('.class_big').find('.classroom_s').remove();
            Studata()
        }
    });




    function Studata(){

        ajaxRequest('post',Study.t_studt,Stujson,function(e){
            console.log(e);
            var Xindex = '';
            var Thistime = [];
            var Xtwindex = [];
            var pjIndex = [];
            var mfInedx = [];
            var timeIndex = [];
            var Cindex = [];
            if(e.data.AvgrealGrade!=undefined){
                var stuSelf = e.data.realGrade;
               if( stuSelf.length!=stuSelf[stuSelf.length-1].lessonNo){
                   for(var j = 0;j<e.data.AvgrealGrade.length;j++){
                       Xtwindex.push(j+1);
                       var buer = false;
                       for(var k = 0;k<stuSelf.length;k++){
                           if((j+1)==stuSelf[k].lessonNo){
                               Cindex.push(stuSelf[k].realGrade);
                               // pjIndex.push(e.data.AvgrealGrade[j].avgGrade);
                               mfInedx.push('满分:'+stuSelf[k].fullMarks);
                               timeIndex.push(stuSelf[k].lessonTime.split(' ')[0]);
                               buer = true;
                               break;
                           }
                       }
                       if(buer!=true){
                           Cindex.push('0');
                           // pjIndex.push('0');
                           mfInedx.push('0');
                           timeIndex.push('0');
                       }
                   }
                   for(var t = 0;t<e.data.AvgrealGrade.length;t++){
                       if(e.data.AvgrealGrade[t].avgGrade==undefined){
                           pjIndex.push('0')
                       }else{
                           pjIndex.push(e.data.AvgrealGrade[t].avgGrade)
                       }
                   }
                   if($('.reportstu_S ul').eq(0).find('li').length>=2){

                   }else{
                       for(var u = 0;u<stuSelf.length;u++){
                           $('.reportstu_S ul').eq(0).append('<li>'+stuSelf[u].lessonNo+'</li>');
                           $('.reportstu_S ul').eq(1).append('<li>'+stuSelf[u].realGrade+'</li>');
                           $('.reportstu_S ul').eq(1).find('li').eq(0).html(stuSelf[u].studentName);
                           $('.reportstu_S ul').eq(2).append('<li>'+e.data.AvgrealGrade[stuSelf[u].lessonNo-1].avgGrade+'</li>');
                       }
                   }

               }else{
                   for(var j = 0;j<stuSelf.length;j++){
                       Xtwindex.push(j+1);
                       Cindex.push(e.data.realGrade[j].realGrade);
                       pjIndex.push(e.data.AvgrealGrade[j].avgGrade);
                       mfInedx.push('满分:'+e.data.realGrade[j].fullMarks);
                       timeIndex.push(e.data.realGrade[j].lessonTime.split(' ')[0]);
                   }
                   for(var u = 0;u<stuSelf.length;u++){
                       $('.reportstu_S ul').eq(0).append('<li>'+stuSelf[u].lessonNo+'</li>');
                       $('.reportstu_S ul').eq(1).append('<li>'+stuSelf[u].realGrade+'</li>');
                       $('.reportstu_S ul').eq(1).find('li').eq(0).html(stuSelf[u].studentName);
                       $('.reportstu_S ul').eq(2).append('<li>'+e.data.AvgrealGrade[stuSelf[u].lessonNo-1].avgGrade+'</li>');
                   }
               }
               console.log(pjIndex)
                Echart('chart_S',Xtwindex,Cindex,pjIndex,timeIndex,mfInedx)
                $('.class_big').show();
                $('.title_s').eq(0).siblings().show();
                $('.title_s').eq(0).find('img').css('transform','rotate(-90deg)')
                $('.classroom_s').css('border-bottom','1px solid #e1e1e1')
            }else{
                $('.class_big').hide();
                $('.no-data').show();
                $('.class_big').hide();
                $('.classroom_s').css('border','none')
            }







        })};





    function Echart(id,x,y1,y2,y3,y4){
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
                    name:'个人得分',
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
                    name:'平均分',
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
                    data:y3

                },
                {
                    name:'总分',
                    type:'line',
                    data:y4
                }
            ]
        };

        // 为echarts对象加载数据
        myChart.setOption(option);

    }



});