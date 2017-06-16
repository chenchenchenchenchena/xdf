$(function(){
// 本地测试数据
// sessionStorage.openid = '11'
// sessionStorage.stuNum= 'sy1';
// 当前微信号
var WXnum  = {
    'wechatId':sessionStorage.openid
};
//当前学生登录状态
var studentlogin=true;
//当天课程
var emailm = {
    'studentCode':sessionStorage.stuNum,
    'beginDate':'2017-02-04',
    'endDate':'2017-02-04'
};
//当月课程
var menu_s = {
        'studentCode':sessionStorage.stuNum,
        'beginDate':'2017-02-01',
        'endDate':'2017-02-28'
};
//储存课程信息
var curr_e = [];
//储存当月的日期
var dateH = [];
//储存当前日期
var time1 = new Date().format("yyyy-MM-dd hh:mm:ss");
//储存日历本月日期
var time_this;
//微信是否授权
if(!sessionStorage.openid){
    wechatCode(location.href)
}
//判断长按的定时器
var touchtime;
var touchtend;


// 微信查询是否绑定微信  参数：当前微信号 学生
ajax_S(url.s_seac,WXnum,stud)

// 微信查询是否绑定微信  参数：当前微信号 学生
function stud(e){
    if(e.result==false){
        // 微信查询是否绑定微信  参数：当前微信号 老师
        ajax_S(url.t_wxmo,WXnum,teac);
    }else{
        //存储学员号
        sessionStorage.stuNum = e.data.studentNo;
    }
}
// 微信查询是否绑定微信  参数：当前微信号 老师
function teac(e){
    console.log(e)
    if(e.data=="goE2"){
        location.href = 'login_s.html';
    }else{
        location.href = 'schedule_t.html';
    }
}
//学生查询课程  整月查询
ajax_S(url.s_stud,menu_s,menufunc);
function menufunc(e){
    if(e.result==false){
        $('.H-data').hide();
        $('.N-data').show();
    }else{
        var arr = [];
        var moth = e.data.Data;
        for(var i = 0;i<moth.length;i++){
            arr.push( moth[i].SectBegin.split(' ')[0])
        }
        setTimeout(function(){
            var html_s = $('.swiper-slide-active table').find('td');
            var number = 0;
            for(var k = 0;k<html_s.length;k++){
                var month = html_s.eq(k).attr('data_m');
                var day   = html_s.eq(k).attr('data_d');
                if(month<10){
                    month = '0'+month
                }
                if(day<10){
                    day = '0'+day
                }
                if(!html_s.eq(k).hasClass('not_this')){
                    dateH.push(''+html_s.eq(k).attr('data_y')+'-'+month+'-'+day+'')
                }else{
                    number++
                }
            }
            for(var j = 0;j<dateH.length;j++){
                if(dateH[j]!=arr[j]){
                    if(dateH[j]>time1.split(' ')[0]){
                        html_s.eq(j+number).addClass('inter_S')
                    }else{
                        html_s.eq(j+number).addClass('innet_S')
                    }
                }
            }
        },100)
    }
}
//赋值今天是周几
setTimeout(function(){
	$('.CHour_s_title span:last-of-type').html('周'+$('#top_week').html().substring(2,3))
},1000)
//按天查询课程
ajax_S(url.s_stud,emailm,stusea)
//按天查询课程
function stusea(e){
    $('.stu_data li').remove();
    if(e.result==false){
        $('.H-data').hide();
        $('.N-data').show();
    }else{
        curr_e = e.data.Data
        var time_old = [];
        var old;
        // 录入开始时间
        for(var i = 0;i<curr_e.length;i++){
            var begtime = curr_e[i].BeginDate.split(' ');
            var begtime2 = begtime[1].substring(0,begtime[1].length-3);
            var endtime = curr_e[i].SectEnd.split(' ');
            var endtime2 = endtime[1].substring(0,begtime[1].length-3);
            var teaname = curr_e[i].Teachers.split(',');
            var zteaname;
            var jteaname;
            // console.log(begtime[1].substring(0,begtime[1].length-3))
            if(time1<curr_e[i].BeginDate){
                old = ''
            }else{
                old = 'activ_c'
            }
            for(var k = 0;k<teaname.length;k++){
                if(teaname[k]=='曹雪峰'){
                    zteaname = teaname[k]
                }else{
                    jteaname = teaname[k]
                }
            }
            $('.curriculum').append('<li class="'+old+'"><a href="javascript:;"><div class="CHour_s_more_left"><p>'+begtime2+'</p><span></span><p>'+endtime2+'</p></div><div class="CHour_s_more"><h4>'+curr_e[i].CourseName+'</h4><p><i>'+curr_e[i].LessonNo+' / '+curr_e[i].LessonCount+'</i>课次</p><p><i>班主任('+zteaname+')</i><span><i>主讲('+jteaname+')</i></span></p></div><div class="CHour_s_more_right"><img src="images/calendar_arrow_right.png" alt=""></div></a></li>')
            $('.loading_s').hide();
            $('.curriculum').show()
        }
    }

}


// $(document).on('touchend','.curriculum li',function(){
//     // alert(0)
//     sessionStorage.beginTime = $(this).find('p').html();
//     sessionStorage.beginDate = '2017-02-04 '+$(this).find('p').html()+'';
//     sessionStorage.endDate = '2017-02-04';
//     location.href = 'details_s.html'
// })
    $(document).on('touchstart','.content td',function(){
        touchtend = 0;
        touchtime = setInterval(function(){
            touchtend++
        },100)
    });

    $(document).on('touchend','.content td',function(){
        clearInterval(touchtime)
        $('.content td').removeClass('xuanzhong');
        $('.content td').removeClass('xuanzhong_s');
        if(touchtend<=1){
            var month  = $(this).attr('data_m')
            var day = $(this).attr('data_d')
            if(month<10){
                month = '0'+month
            }
            if(day<10){
                day = '0'+month
            }
            var time = ''+$(this).attr('data_y')+'-'+month+'-'+day+'';
            var emailm = {
                'studentCode':'SS2303',
                'beginDate':'2017-02-04',
                'endDate':'2017-02-04'
            };

            if(time1.split(' ')[0]>time){
                $(this).addClass('xuanzhong')
            }else{
                $(this).addClass('xuanzhong_s')
            }
            ajax_S(url.s_stud,emailm,stusea);
            ajax_S(url.s_stud,menu_s,menufunc)
        }

    });

});