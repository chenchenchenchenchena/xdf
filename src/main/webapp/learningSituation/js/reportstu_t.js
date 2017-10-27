$(function(){
//禁止浏览器拖动
//     addEventListener("touchmove", function (event) {
//         event.preventDefault();
//     }, false);
    if(GetRequest('studentName')){
        $('title').html(GetRequest('studentName'));
    }
    $('body').hide();
    var Stujson = {
        'teacherEmail':localStorage.terEmail,
        'classCode':localStorage.getItem('CLASSCODE'),
        'tCode':GetRequest('tCode'),
        'studentNo':GetRequest('studentNo'),
        'schoolId':localStorage.getItem('SCHOOLID')
    };
    if(localStorage.mastTeater){
        Stujson.teacherEmail=sessionStorage.banzhutea
    }
    Studata();  //调取
//切换显示方式
    $(document).on('touchend','.tab_record span',function(){
        if(!$(this).hasClass('tab_recorac')){
            $(this).addClass('tab_recorac').siblings().removeClass('tab_recorac');
            $(this).parent().prev().children('div').eq($(this).index()).show().siblings().hide()
        }
    });
    var Text_Grade = '入门测';
    /** 获取成绩类型 */
    var reqData = {
        'tableName':"studycase_grade_type"
    };
    ajaxRequest('POST', url.t_dictionary,reqData, function(e){
        if(e.code==200){
            var tabTypes =  e.data;
            var tabStr = "";
            for (var i = 0; i < tabTypes.length; i++){
                if(i == 0){
                    //第一次进入页面  默认选中第一个tab
                    tabStr += "<li class='tab-active' tCode='"+tabTypes[i].tCode+"'>"+tabTypes[i].tName+"</li>";
                }else {
                    tabStr += "<li tCode='"+tabTypes[i].tCode+"'>"+tabTypes[i].tName+"</li>";
                }

            }
            $('.tab-title').html(tabStr);
            $('.tab-title li').eq(GetRequest('tCode')-1).addClass('tab-active').siblings().removeClass('tab-active');

        }
    });


var maxnumber = 0;
// tab切换
    $('.grade').on('touchend',function(){
        sessionStorage.stuNumber = getRequest('studentNo').studentNo;
        location.href = 'common_ts.html'
    });
    $(document).on('touchend','.tab-title li',function(){
        $('.no-data').hide();
        // $(this).addClass('tab-active').siblings().removeClass('tab-active');
        // Stujson.tCode = $(this).attr("tCode");
        // Studata();
        switch($(this).index()){
            case 0:
                var url_s = location.href.substr(0,location.href.indexOf('?'));
                location.href = url_s+'?studentNo='+GetRequest('studentNo')+'&tCode=1&studentName='+GetRequest('studentName')+'';
                break;
            case 1:
                var url_s = location.href.substr(0,location.href.indexOf('?'));
                location.href = url_s+'?studentNo='+GetRequest('studentNo')+'&tCode=2&studentName='+GetRequest('studentName')+'';
                break;
            case 2:
                var url_s = location.href.substr(0,location.href.indexOf('?'));
                location.href = url_s+'?studentNo='+GetRequest('studentNo')+'&tCode=3&studentName='+GetRequest('studentName')+'';
                break;
            case 3:
                var url_s = location.href.substr(0,location.href.indexOf('?'));
                location.href = url_s+'?studentNo='+GetRequest('studentNo')+'&tCode=4&studentName='+GetRequest('studentName')+'';
                break;
            case 4:
                var url_s = location.href.substr(0,location.href.indexOf('?'));
                location.href = url_s+'?studentNo='+GetRequest('studentNo')+'&tCode=5&studentName='+GetRequest('studentName')+'';
                break;
        }
    });




    function Studata(){
        ajaxRequest('post',Study.t_studt,Stujson,function(e){
            // $('.tab-active li').eq(GetRequest('tCode')).addClass('tab-active').sibling().removeClass('tab-active')
            var Xindex = '';
            var Thistime = [];
            var Xtwindex = [];
            var pjIndex = [];
            var mfInedx = [];
            var timeIndex = [];
            var Cindex = [];
            if(e.data.sdtInteractState==false&&e.data.sdtInteractState!=undefined){
                $('.grade').hide();
            }
            $('body').show();
            if(e.data.AvgrealGrade!=undefined){
                $('.reportstu_S ul').eq(0).find('li').eq(0).siblings().remove();
                $('.reportstu_S ul').eq(1).find('li').eq(1).siblings().remove();
                $('.reportstu_S ul').eq(2).find('li').eq(0).siblings().remove();
                $('title').html(e.data.realGrade[0].studentName);
                var stuSelf = e.data.realGrade;
                for(var s = 0;s<e.data.AvgrealGrade.length;s++){
                    // TODO
                    if(parseInt(e.data.AvgrealGrade[s].fullMarks)>maxnumber){
                        maxnumber =parseInt(e.data.AvgrealGrade[s].fullMarks)
                    }
                }
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
                       $('.reportstu_S ul').css('width',145*(stuSelf.length+1));
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
                   $('.reportstu_S ul').css('width',145*(stuSelf.length+1));

               }
               console.log(pjIndex);
                Echart('chart_S',Xtwindex,Cindex,pjIndex,timeIndex,mfInedx,maxnumber);
                $('.class_big').show();
                $('.title_s').eq(0).siblings().show();
                $('.title_s').eq(0).find('img').css('transform','rotate(-90deg)')
                $('.classroom_s').css('border-bottom','1px solid #e1e1e1')
            }else{
                $('.class_big').hide();
                $('.no-data').show();
                $('.class_big').hide();
                $('.classroom_s').css('bosrder','none')
            }







        })};





    function Echart(id,x,y1,y2,y3,y4,max){
        console.log(id+"---"+x+"---"+y1+"---"+y2+"---"+y3+"---"+y4+"---"+max);
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
            dataZoom: [{
                type: 'inside',
                throttle: 50
            }],
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
                    name:'个人得分',
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
                },
                {
                    name:'平均分',
                    type:'line',
                    data:y2,
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