$(function(){
// 本地测试数据
sessionStorage.openid = '11'
// sessionStorage.stuNum= 'sy1';
// 当前微信号
var WXnum  = {
    'wechatId':sessionStorage.openid
};
//当天课程
var emailm = {
        'teacherEmail':'caoxuefeng@xdf.cn',
        'beginDate':'2017-02-04',
        'endDate':'2017-02-04'
};
//当月课程
var menu_s = {
    'teacherEmail':'caoxuefeng@xdf.cn',
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
};
//判断长按的定时器
var touchtime;
var touchtend;
//微信查询是否绑定微信  参数：当前微信号 学生
ajax_S(url.s_seac,WXnum,stud);
function stud(e){
    console.log(e);
    if(e.result==false){
        ajax_S(url.t_wxmo,WXnum,teac);
    }else{
        sessionStorage.stuNum = e.data.studentNo;
    }
}


ajax_S(url.t_wxmo,WXnum,teac)
function teac(e){
    if(e.data=="goE2"){
        location.href = 'login_s.html';
    }
}
//按天查课程
ajax_S(url.s_emai,emailm,stusea);
function stusea(e){
        console.log(e)
        curr_e = e.data.Data
        var time_old = [];
        var old;
        // 录入开始时间
        for(var i = 0;i<curr_e.length;i++){
            var begtime = curr_e[i].BeginDate.split(' ')
            var begtime2 = begtime[1].substring(0,begtime[1].length-3)
            var endtime = curr_e[i].SectEnd.split(' ')
            var endtime2 = endtime[1].substring(0,begtime[1].length-3)
            // console.log(begtime[1].substring(0,begtime[1].length-3))
            if(time1<curr_e[i].BeginDate){
                old = ''
            }else{
                old = 'activ_c'
            }
            $('.curriculum').append('<li class="'+old+'"><a href="javascript:;"><div class="CHour_s_more_left"><p>'+begtime2+'</p><span></span><p>'+endtime2+'</p></div><div class="CHour_s_more"><h4>'+curr_e[i].CourseName+'</h4><p><i>'+curr_e[i].LessonNo+' / '+curr_e[i].LessonCount+'</i>课次</p></div><div class="CHour_s_more_right"><img src="images/calendar_arrow_right.png" alt=""></div></a></li>')
            $('.loading_s').hide()
            $('.curriculum').show()
        }
    }

    //按月查课程
    ajax_S(url.s_emai,menu_s,menufunc)
function menufunc(e){
    var arr = [];
    var moth = e.data.Data
    if(e.result==false){
        $('.H-data').hide();
        $('.N-data').show();
        $('.month_hour i').html('0');
    }else{
    $('.month_hour i').html(moth.length);
    for(var i = 0;i<moth.length;i++){
       arr.push( moth[i].SectBegin.split(' ')[0])
    }
    // console.log(arr)
    // console.log(moth)
    $('.month_hour i').html('0');
    setTimeout(function(){
    var html_s = $('.swiper-slide-active table').find('td')
    var number = 0;
    for(var k = 0;k<html_s.length;k++){
        var month = html_s.eq(k).attr('data_m')
        var day   = html_s.eq(k).attr('data_d')
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

//日历点击事件
    $(document).on('touchstart','.content td',function(){
        touchtend = 0;
        touchtime = setInterval(function(){
            touchtend++
        },100)
    });

    $(document).on('touchend','.content td',function(){
        clearInterval(touchtime);
        $('.content td').removeClass('xuanzhong');
        $('.content td').removeClass('xuanzhong_s');
        if(touchtend<=1){
            $('.content td').removeClass('today');
            var month  = $(this).attr('data_m');
            var day = $(this).attr('data_d');
            if(month<10){
                month = '0'+month
            }
            if(day<10){
                day = '0'+day
            }
            var time = ''+$(this).attr('data_y')+'-'+month+'-'+day+'';
            alert(time);
            var emailm = {
                'studentCode':'SS2303',
                'beginDate':'2017-02-04',
                'endDate':'2017-02-04'
            };

            if(time1.split(' ')[0]>time){
                $(this).addClass('xuanzhong')
            }else if(time1.split(' ')[0]==time){
                $(this).addClass('today')
            }else{
                $(this).addClass('xuanzhong_s')
            }
            ajax_S(url.s_emai,emailm,stusea);
            ajax_S(url.s_emai,menu_s,menufunc);
        }

    });

// <li class=""><a href="javascript:;"><div class="CHour_s_more_left"><p>13:00</p><span></span><p>13:00</p></div><div class="CHour_s_more"><h4>初中全科一对一</h4><p><i>8/16</i>课次</p></div><div class="CHour_s_more_right"><img src="images/calendar_arrow_right.png" alt=""></div></a></li>
//点击查看详情
$(document).on('click','.H-data li',function(){
    var year = $('#ymym').html().substring(0,$('#ymym').html().indexOf('年'));
    var month = $('#ymym').html().substring($('#ymym').html().indexOf('年')+1,$('#ymym').html().indexOf('月'));
    var day;
    $('.content td').each(function(){
        if($(this).hasClass('today')||$(this).hasClass('xuanzhong')||$(this).hasClass('xuanzhong_s')){
            day = $(this).find('i').html();
        }
    });
    var time_s =''+year+'-'+month+'-'+day+' '+$(this).find('.CHour_s_more_left p').eq(0).html()+'-'+$(this).find('.CHour_s_more_left p').eq(1).html()+''
    sessionStorage.timetoday = time_s;
    location.href = 'details_s.html'

})





})