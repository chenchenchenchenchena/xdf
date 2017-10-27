$(function(){
// 本地测试数据
// sessionStorage.openid = 'ofZfFwgizCmzR5XXMQtsC5Wx5wZrA';
    // localStorage.terEmail = 'hanqifan@xdf.cn'
// sessionStorage.stuNum= 'sy1';
// 当前微信号
$('.load_t').show();
var WXnum  = {
    'wechatId':sessionStorage.openid
};
var Shchool;
var time1 = new Date().format("yyyy-MM-dd");
//当天课程
var emailm = {
        'teacherEmail':localStorage.terEmail,
        'beginDate':time1,
        'endDate':time1
};
//当月课程
var menu_s = {
    'teacherEmail':localStorage.terEmail,
    'beginDate':new Date().format("yyyy-MM-01"),
    'endDate':new Date().format("yyyy-MM")+'-'+getCountDays()
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
    // if(!sessionStorage.openid){
    //         wechatCode(location.href)
    // };
//判断长按的定时器
var touchtime;
var touchtend;
    $('.js_jin').click(menu_int);
    // $(document).on('touchstart','.tc-bot-right',menu_int);

//按天查课程

function stusea(e){
        $('.curriculum li').remove();
        if(e.result==false||e.data==undefined){
            $('.N-data').show();
            $('.H-data').hide();
            // $('.load_t').hide();
            return;
        }else{
            $('.N-data').hide();
            $('.H-data').show();
            // $('.load_t').hide();
        }
        if(localStorage.mastTeater){
            Dta_d= e.data.Data;
            var curr_e = [];
            for(var v = 0;v<Dta_d.length;v++){
                var bure = false;
                if(v==0&&curr_e.length==0){
                    curr_e.push(Dta_d[v]);
                }else{
                    for(var f = 0;f<curr_e.length;f++){
                        if(Dta_d[v].SectBegin!=curr_e[f].SectBegin&&Dta_d[v].SectEnd!=curr_e[f].SectEnd){
                            bure = true;
                        }else{
                            bure = false;
                        }
                    }
                    if(bure){
                        curr_e.push(Dta_d[v]);
                    }
                }

            }
        }else{
            curr_e = e.data.Data
        }

        var time_old = [];
        var old;
        var Index =[];
        // 录入开始时间
        for(var i = 0;i<curr_e.length;i++){
            var begtime = curr_e[i].SectBegin.split(' ');
            var begtime2 = begtime[1].substring(0,begtime[1].length-3);
            var endtime = curr_e[i].SectEnd.split(' ');
            var endtime2 = endtime[1].substring(0,begtime[1].length-3);
            var remindedata = {
               'classCode':curr_e[i].ClassCode,
                'courseCode':curr_e[i].CourseCode,
                'email':localStorage.terEmail
            };
            var htmltx = '';
            // ajax_S(url.t_data,remindedata,function(e){
            //     if(e.result==false){
            //         layer.msg('请求参数不可以为空')
            //     }else{
            //         if(e.remindstatus==1){
            //             htmltx = '去布置作业'
            //         }else if(e.remindstatus==2){
            //             htmltx = ''+e.data[0].nostudentNum+'份作业待批改'
            //         }
            //         else if(e.remindstatus==3){
            //             htmltx = ''
            //         }
            //         $('.tx').each(function(){
            //             $('.tx').eq($(this).attr('index')).html(htmltx)
            //         });
            //         Index.push(htmltx);
            //         // 放作业提醒
            //         for(var i =0;i<Index.length;i++){
            //             if(Index[i]!=''){
            //                 $('.tx').eq(i).html(Index[i]);
            //                 $('.tx').eq(i).css('padding','.05rem .1rem');
            //             }
            //         }
            //     }
            // });
            if(time1<curr_e[i].SectEnd){
                old = ''
            }else{
                old = 'activ_c'
            }
            //存储数据
            var item = JSON.stringify(curr_e[i])+"@"+ JSON.stringify(e.subject);
            sessionStorage.setItem(curr_e[i].ClassCode,item);

            //主讲判断
            if(Shchool!=undefined){
                console.log(Shchool)
                if(curr_e[i].SchoolId==Shchool){
                    $('.curriculum').append('<li data-item="'+curr_e[i]+'" class="'+old+'" classCode="'+curr_e[i].ClassCode+'"><a href="javascript:;"><div class="CHour_s_more_left"><p>'+begtime2+'</p><span></span><p>'+endtime2+'</p></div><div class="CHour_s_more"><h4>'+curr_e[i].ClassName+'</h4><p><i>'+curr_e[i].LessonNo+' / '+curr_e[i].LessonCount+'</i>课次</p></div><div class="CHour_s_more_right"><img src="images/calendar_arrow_right.png" alt=""></div></a></li>')
                }
            }else{
                $('.curriculum').append('<li class="'+old+'" classCode="'+curr_e[i].ClassCode+'"><a href="javascript:;"><div class="CHour_s_more_left"><p>'+begtime2+'</p><span></span><p>'+endtime2+'</p></div><div class="CHour_s_more"><h4>'+curr_e[i].ClassName+'</h4><p><i>'+curr_e[i].LessonNo+' / '+curr_e[i].LessonCount+'</i>课次</p></div><div class="CHour_s_more_right"><img src="images/calendar_arrow_right.png" alt=""></div></a></li>')
            }
            $('.curriculum').show();
        }

        if($('.curriculum li').length==0){
            $('.N-data').show();
            $('.H-data').hide();
            $('.loading_s').hide();
        }
    }
// <span class="tx" index="'+i+'">'+htmltx+'</span>
    //按月查课程

    function menufunc(e){
    var arr = [];
    var arr_schoolid = [];
    var strIndex = '';
    dateH = [];
    if(e.result==false||e.message!=undefined){
        $('.H-data').hide();
        $('.N-data').show();
        $('.month_hour i').html('0');
        $('.load_t').hide();
    }else{
        if(localStorage.mastTeater){
            var Data_ = e.data.Data;
            var moth = [];
            var moth_less = 0;
            for(var v = 0;v<Data_.length;v++){
                var bure = false;
                if(Data_[v].SchoolId==Shchool&&Shchool!=undefined){
                    moth_less++
                }
                if(v==0&&moth.length==0){
                    moth.push(Data_[v]);
                }else{
                    for(var f = 0;f<moth.length;f++){
                        if(Data_[v].SectBegin!=moth[f].SectBegin&&Data_[v].SectEnd!=moth[f].SectEnd){
                            bure = true;
                        }else{
                            bure = false;
                        }
                    }
                    if(bure){
                        moth.push(Data_[v]);
                    }
                }
            }
            if(Shchool==undefined){
                $('.month_hour i').html(moth.length);
            }else{
                $('.month_hour i').html(moth_less);
             }
        }else{
            moth = e.data.Data
            $('.month_hour i').html(moth.length);
        }

    for(var i = 0;i<moth.length;i++){
       arr.push( moth[i].SectBegin.split(' ')[0])
       arr_schoolid.push( moth[i].SchoolId)
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
            if(k<20){
                number++
            }
        }
    }
    //有课的标志
    for(var j = 0;j<arr.length;j++){

            for(var k = 0;k<dateH.length;k++){
                if(dateH[k]==arr[j]){
                    if(arr[j]>new Date().format("yyyy-MM-dd")){
                        if(Shchool!=undefined){
                            if(arr_schoolid[k]==Shchool){
                             html_s.eq(k+number).addClass('inter_S')
                            }
                        }else{
                            html_s.eq(k+number).addClass('inter_S')
                        }
                    }else{
                        if(Shchool!=undefined){
                            if(arr_schoolid[k]==Shchool){
                                html_s.eq(k+number).addClass('innet_S');
                            }
                        }else{
                            html_s.eq(k+number).addClass('innet_S');
                        }
                    }
              }
            }

    }
},100)
setInterval(menu_int,10);
$('.load_t').hide();

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
            if($('#now2').length!=0){
                alert('日历控件加载失败，请刷新后重试');
                return false;
            }
            setTimeout(function(){
                $('.CHour_s_title span:last-of-type').html('周'+$('#top_week').html().substring(2,3))
            },1000)
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
            $('.CHour_s_title span').eq(1).html(month+'-'+day)
            // alert(time);
            var  day = new Date($(this).attr('data_y'),month,'0');
            var daycount = day.getDate();
            var emailm = {
                'teacherEmail':localStorage.terEmail,
                'beginDate':time,
                'endDate':time
            };
            //当月课程
            var menu_s = {
                'teacherEmail':localStorage.terEmail,
                'beginDate':time.substring(0,7)+'-01',
                'endDate':time.substring(0,7)+'-'+daycount
            };
            if(time1.split(' ')[0]>time){
                $(this).addClass('xuanzhong')
            }else if(time1.split(' ')[0]==time){
                $(this).addClass('today')
            }else{
                $(this).addClass('xuanzhong_s')
            }
            ajax_S(url.s_emai,emailm,stusea);
            // ajax_S(url.s_emai,menu_s,menufunc);
        }

    });
        ajax_S(url.s_emai,emailm,stusea);
        ajax_S(url.s_emai,menu_s,menufunc);
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
    if(month<10){
        month = '0'+month
    }
    if(day<10){
        day = '0'+day
    }
    var time_s =''+year+'-'+month+'-'+day+' '+$(this).find('.CHour_s_more_left p').eq(0).html()+':00';
    // alert(time_s)
    sessionStorage.timetoday = time_s;
    sessionStorage.classCode = $(this).attr('classCode');
    location.href = 'detailsmany_t.html'

});
    $('#ymym').change(function(){
        alert(0)
    })
    //判断ios
    var u = navigator.userAgent;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isiOS==true){
        $('.nbxs').eq(0).css('margin-top','-.25rem')
    }
    //存储今天时间
    var todaythis;
    //储存当前月期
    var monththis;
    setTimeout(function(){
        var month  = $('.today').attr('data_m');
        var day = $('.today').attr('data_d');
        if(month<10){
            month = '0'+month
        }
        monththis = month
        if(day<10){
            day = '0'+day
        }
         todaythis = ''+$('.today').attr('data_y')+'-'+month+'-'+day+'';
        $('.not_this').css('opacity','0')
    },100);
    //月课时
    function menu_int(){
        $('.not_this').css('opacity','0');
        var month = $('#ymym').html().substring($('#ymym').html().indexOf('年')+1,$('#ymym').html().indexOf('月'));
        if(month<10){
            month = '0'+month
        }
        if(monththis!=month){
            var  day = new Date($('#ymym').html().substring(0,4),month,'0');
            var daycount = day.getDate();
            var menu_s = {
                'teacherEmail':localStorage.terEmail,
                'beginDate':$('#ymym').html().substring(0,4)+'-'+month+'-01',
                'endDate':$('#ymym').html().substring(0,4)+'-'+month+'-'+daycount
            };
            monththis = month;
            ajax_S(url.s_emai,menu_s,menufunc);
        }
        var html_s = $('.swiper-slide-active table').find('td');
        for(var k = 0;k<html_s.length;k++){
            var month  = $(html_s).eq(k).attr('data_m');
            var day = $(html_s).eq(k).attr('data_d');
            if(month<10){
                month = '0'+month
            }
            if(day<10){
                day = '0'+day
            }
            var time2 = ''+$(html_s).eq(k).attr('data_y')+'-'+month+'-'+day+'';
            if(time2<todaythis){
                $(html_s).eq(k).css('color','#ccc')
            }else if(time2==todaythis){
                $(html_s).eq(k).css('color','#000')
            }
            else{
                $(html_s).eq(k).css('color','#000')
            }
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
            // $(".select ul").append('<li>全部校区</li>')
            for(var i=0;i<e.data.length;i++){
                var str ='<li data-value='+e.data[i].tName+' data-code='+e.data[i].tCode+'>'+e.data[i].tName+'</li>';
                $(".select ul").append(str);
            }
            // $('.content_t').find('li').eq(0).addClass('Selected');
            // $('.content_t').find('p').eq(0).html('全部校区');
        }
    }
    $('.truorfal input').on('touchend',function(){
            Shchool = $('.Selected').attr('data-code');
            $('.big_select').hide();

    })
})