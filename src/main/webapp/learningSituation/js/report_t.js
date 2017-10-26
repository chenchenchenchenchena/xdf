$(function(){
    if(!sessionStorage.openid){
        wechatCode(location.href);
    };
    if(!localStorage.terEmail){
            var WXnum  = {
                'wechatId':sessionStorage.openid
             };
            ajax_S(url.s_seac,WXnum,function(e){
                if(e.result==true){
                    if(!localStorage.userId_stu){
                        location.href = '../schedule/login_s.html'
                    }
                    sessionStorage.stuNumber = e.data.studentNo;
                    sessionStorage.schoolId = e.data.schoolId;
                    sessionStorage.studentName = e.data.studentName;
                    location.href = 'report_s.html';
                }else{
                    location.href = '../schedule/login_s.html'
                }

            });
    }
    $('body').css('height',$(window).height())
    var Shchool;
    if(localStorage.mastTeater){
        $('.big_select').show();
    }
    if(localStorage.mastTeater){
        var need_ = {
            'masterTeacherEmail':localStorage.terEmail,
            'gradeType':'1',
            'ifmore':'1',
        };
    }else{
        var need_ = {
            'teaEmail':localStorage.terEmail,
            'tCode':'1'
        };
        Interaction();
    }
   
    if(localStorage.mastTeater){
        // need_ = Shchool
    }
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
                    tabStr += "<li class='active_last' tCode='"+tabTypes[i].tCode+"'>"+tabTypes[i].tName+"</li>";
                }else {
                    tabStr += "<li tCode='"+tabTypes[i].tCode+"'>"+tabTypes[i].tName+"</li>";
                }

            }
            $('.report_tab').html(tabStr);
        }
    });
    $('.tab-title li:last').on('touchend',function(){
        if(!localStorage.mastTeater){
          $(this).find('a:last').attr('href','record.html')
        }else{
            alert('您当前的账户为主讲老师，暂仅能查看哦。')
        }
    })
//点击查看成绩排行成绩排行
$(document).on('touchend','.achievement_s>h4',function(){
    if($(this).hasClass('kthd')){
        if($(this).index()==0){
            sessionStorage.classcode = $(this).attr('classcode');
            sessionStorage.schoolid = $(this).attr('schoolid');
            location.href = 'class_t.html';
        }else{
            var title = $(this).parents('.achievement_s').siblings('.title_s').find('h4').html();
            sessionStorage.classcode = $(this).attr('classcode');
            sessionStorage.schoolid = $(this).attr('schoolid');
            localStorage.setItem('CLASSCODE',$(this).attr('classcode'));
            localStorage.setItem('SCHOOLID',$(this).attr('schoolid'));
            sessionStorage.grade_type = $('.active_last').index()+1;
            window.location.href = 'rankinglist_t.html?title='+title;
        }
    }else{
        var title = $(this).parents('.achievement_s').siblings('.title_s').find('h4').html();
        sessionStorage.classcode = $(this).attr('classcode');
        sessionStorage.schoolid = $(this).attr('schoolid');
        localStorage.setItem('CLASSCODE',$(this).attr('classcode'));
        localStorage.setItem('SCHOOLID',$(this).attr('schoolid'));
        sessionStorage.grade_type = $('.active_last').index()+1;
        sessionStorage.banzhutea = $(this).attr('teaemail')
        window.location.href = 'rankinglist_t.html?title='+title;
    }

});

//点击显示图标
$(document).on('tap','.title_s',function(){
    if($(this).siblings('.achievement_s').css('display')=='none'){
        $(this).siblings().show()
        $(this).find('img').css('transform','rotate(-90deg)')
    }else{
       $(this).siblings().hide()
        $(this).find('img').css('transform','rotate(90deg)')
    }

});

// 成绩类型切换 切换tab
$(document).on('touchend', '.report_tab li', function () {
    $(this).addClass('active_last').siblings().removeClass('active_last');
    need_.tCode = $(this).attr("tCode");
    Text_Grade = $(this).html();
    console.log(need_.tCode+"__"+Text_Grade);
    $('.class_big').find('.classroom_s').remove();
    if(localStorage.mastTeater){
        Interaction_master();
    }else{
     Interaction();
    }
});
   
function Interaction_master(){
        ajax_S(Study.t_self,need_,less_Inter);
    };

function Interaction(){

    ajaxRequest('post',Study.t_self,need_,less_Inter);
};
function less_Inter(e){
        if (e.data.length != 0 && e.data != undefined) {
        
            $('.no-data').hide();
            $('.class_big').show();
            for (var i = 0; i < e.data.length; i++) {
                var h_zhou_x = [];
                var time = [];
                var full_max = [];
                var max_Grade_ = '';
                var Grade_eve = [];

                var Data = e.data[i];
                var Grade = Data;
                var maxGrade = Data.data[Data.data.length - 1].lessonNO;
                max_Grade_ = Grade.fullMarksMax;
                if (Data.TeacherclassRoomState) {
                    html_yh = '<h4 class="grade kthd" classcode="' + e.data[i].classCode + '" schoolid="' + e.data[i].schoolId + '" style="left:40%;margin-right:20px;">查看课堂数据</h4>'
                } else {
                    html_yh = ''
                }

                $('.class_big').append('<div class="classroom_s"><div class="title_s"><h4>' + e.data[i].className + '</h4> <img src="images/rightArrow.png" alt=""/> </div><div id="chart_S' + i + '" style="width: 690px;height: 360px;display:none;"></div><div class="achievement_s" style="margin-top: -20px;">' + html_yh + '<h4 class="grade" classcode="' + e.data[i].classCode + '" schoolid="' + e.data[i].schoolId + '" teaemail="'+e.data[i].teacherEmail+'" style="left:70%;margin-right:20px;">查看成绩排名</h4></div></div>')
                for (var c = 0; c < Grade.data.length; c++) {
                    var lesson_num = Grade.data[c];
                    for (var b = 0; b < maxGrade; b++) {
                        if (c == 0) {
                            h_zhou_x.push(b + 1);
                            time.push('0');
                            full_max.push('0');
                            Grade_eve.push('0')
                        }
                        if (lesson_num.lessonNO == b + 1) {
                            time[b] = lesson_num.lessonTime.split(' ')[0];
                            full_max[b] = lesson_num.fullMarks;
                            Grade_eve[b] = lesson_num.avgGrade;
                        }
                    }
                    ;
                }
                ;
                Echart('chart_S' + i + '', Text_Grade, h_zhou_x, Grade_eve, full_max, time, max_Grade_)
                $('.classroom_s').eq(0).find('div').show();
            }
        } else {
            $('.no-data').show();
            $('.class_big').show();
        }
}
 //校区相关
 $(document).on('touchend',".select p",function(e){
    $(".select").toggleClass('open');
    e.stopPropagation();
});
$(document).on('touchend','.content_t .select ul li',function(e){
    var _this=$(this);
    $(".select > p").text(_this.attr('data-value'));
    _this.addClass("Selected").siblings().removeClass("Selected");
    $(".select").removeClass("open");
    e.stopPropagation();
});
var table={
    "tableName":"dict_school_info"
}
ajaxRequest("POST", url.s_select, table , selectData);
function selectData(e) {
    console.log(e);
    $(".select ul").html("");
    if(e.code=="200"){
        $(".select ul").append('<li>全部校区</li>')
        for(var i=0;i<e.data.length;i++){
            var str ='<li data-value='+e.data[i].tName+' data-code='+e.data[i].tCode+'>'+e.data[i].tName+'</li>';
            $(".select ul").append(str);
        }
        $('.content_t').find('li').eq(0).addClass('Selected');
        $('.content_t').find('p').eq(0).html('全部校区');
    }
}
$('.truorfal input').on('touchend',function(){
        need_.schoolId =  $('.Selected').attr('data-code');
        if( $('.Selected').attr('data-code')==undefined){
            need_.schoolId =''
        }
        $('.big_select').hide();
        Interaction_master();
})


function Echart(id,daTatext,x,y1,mf,time,max){
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
                name:'入门测',
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
                name:'日期',
                type:'line',
                data:time,
                lable:{
                    normal:{
                        textStyle:{
                            fontSize:24
                        }

                    }
                },
                lineStyle:{
                    normal:{
                        opacity:0
                    }
                },
                itemStyle:{
                    normal:{
                        opacity:0

                    }
                }


            },
            {
                name:'总分',
                type:'line',
                data:mf,
                lable:{
                    normal:{
                        textStyle:{
                            fontSize:24
                        }
                    }
                },
                lineStyle:{
                    normal:{
                        opacity:0
                    }
                },
                itemStyle:{
                    normal:{
                        opacity:0

                    }
                }
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
}

});