$(function(){
    //请求整月数据超时处理
    var mastertae = [];

    function erro_f(){
        if($('.month_hour i')){
            $('.month_hour i').html('<img src="images/reload.png" class="reload_f" style="width:.6rem;height:.4rem;position:absolute;top:.62rem;">')
            // $('. ').hide();
            setInterval(menu_int,10);
        }
    }
    function erro_d(){
        if($('.month_hour i')){
            // $('.month_hour i').html('<img src="images/reload.png" style="width:.6rem;height:.4rem;position:absolute;top:.62rem;">')
            $('.reload_d').hide();
            $('.H-data').append('<img src="images/reload.png" class="reload_d" style="width:1.5rem;height:1.1rem;display:block;margin:1rem auto;">')
            $('.loading_s').eq(0).hide();
        }
    }
    $(document).on('touchend','.reload_f',function(){
        $('.month_hour i').html('<img src="images/loading_s.gif" style="width:.4rem;height:.4rem;position:absolute;top:.62rem;">');
        var  day = new Date($('#ymym').html().substring(0,4),month,'0');
        var daycount = day.getDate();
        var month = $('#ymym').html().substring($('#ymym').html().indexOf('年')+1,$('#ymym').html().indexOf('月'));
        if(month<10){
            month = '0'+month
        }
        var  day = new Date($('#ymym').html().substring(0,4),month,'0');
        var daycount = day.getDate();
        var menu_s = {
            'teacherEmail':localStorage.terEmail,
            'teacherCode':localStorage.teacherId,
            'schoolId':localStorage.schoolId,
            'beginDate':$('#ymym').html().substring(0,4)+'-'+month+'-01',
            'endDate':$('#ymym').html().substring(0,4)+'-'+month+'-'+daycount
        };
        monththis = month;
        ajax_S(url.s_emai,menu_s,menufunc,erro_f);
    })
    $(document).on('touchend','.reload_d',function(){
        $(this).hide();
        $('.loading_s').eq(0).show();
        if($('.xuanzhong')){
            var month  = $('.xuanzhong').attr('data_m');
            var day = $('.xuanzhong').attr('data_d');
            if(month<10){
                month = '0'+month
            }
            if(day<10){
                day = '0'+day
            }
            var time = ''+$('.xuanzhong').attr('data_y')+'-'+month+'-'+day+'';
        }else if($('.today')){
            var month  = $('.today').attr('data_m');
            var day = $('.today').attr('data_d');
            if(month<10){
                month = '0'+month
            }
            if(day<10){
                day = '0'+day
            }
            var time = ''+$('.today').attr('data_y')+'-'+month+'-'+day+'';
        }else if($('.xuanzhong_s')){
            var month  = $('.xuanzhong_s').attr('data_m');
            var day = $('.xuanzhong_s').attr('data_d');
            if(month<10){
                month = '0'+month
            }
            if(day<10){
                day = '0'+day
            }
            var time = ''+$('.xuanzhong_s').attr('data_y')+'-'+month+'-'+day+'';
        }
        var emailm = {
            'teacherEmail':localStorage.terEmail,
            'teacherCode':localStorage.teacherId,
            'schoolId':localStorage.schoolId,
            'beginDate':time,
            'endDate':time
        };
        this_dat_last = emailm

        ajax_S(url.s_emai,emailm,stusea,erro_d);
    })
// 本地测试数据
// sessionStorage.openid = 'ofZfFwgizCmzR5XXMQtsC5Wx5wZrA';
    // localStorage.terEmail = 'hanqifan@xdf.cn'
// sessionStorage.stuNum= 'sy1';
// 当前微信号
// $('.load_t').show();
var WXnum  = {
    'wechatId':sessionStorage.openid
};
var Shchool;
var time1 = new Date().format("yyyy-MM-dd");
//当天课程
var emailm = {
        'teacherEmail':localStorage.terEmail,
        'teacherCode':localStorage.teacherId,
        'schoolId':localStorage.schoolId,
        'beginDate':time1,
        'endDate':time1
};
//当月课程
var menu_s = {
    'teacherEmail':localStorage.terEmail,
    'teacherCode':localStorage.teacherId,
    'schoolId':localStorage.schoolId,
    'beginDate':new Date().format("yyyy-MM-01"),
    'endDate':new Date().format("yyyy-MM")+'-'+getCountDays()
};
    sessionStorage.removeItem("classData");
//储存课程信息
var curr_e = [];
$('.month_hour i').html('<img src="images/loading_s.gif" style="width:.4rem;height:.4rem;position:absolute;top:.62rem;">');
var this_dat_last;
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
    var need_see = [];
    sessionStorage.setItem("classData",JSON.stringify(e));
        $('.curriculum li').remove();
        if(e.result==false||e.data==undefined){
            $('.N-data').show();
            $('.loading_s').eq(0).hide();
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
            var begtime3 = begtime[1].substring(0,begtime[1].length);
            var endtime = curr_e[i].SectEnd.split(' ');
            var endtime2 = endtime[1].substring(0,begtime[1].length-3);
            var endtime3 = endtime[1].substring(0,begtime[1].length);
            // var remindedata = {
            //    'classCode':curr_e[i].ClassCode,
            //     'courseCode':curr_e[i].CourseCode,
            //     'email':localStorage.terEmail
            // };
            // var htmltx = '';
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

            //主讲判断
            if(Shchool!=undefined){
                if(curr_e[i].SchoolId==Shchool){
                    $('.curriculum').append('<li time_back="'+begtime3+'-'+endtime3+'" data-item="'+curr_e[i]+'" class="'+old+'" classCode="'+curr_e[i].ClassCode+'"><a href="javascript:;"><div class="CHour_s_more_left"><p>'+begtime2+'</p><span></span><p>'+endtime2+'</p></div><div class="CHour_s_more"><h4>'+curr_e[i].ClassName+'</h4><p><i>'+curr_e[i].LessonNo+' / '+curr_e[i].LessonCount+'</i>课次</p></div><div class="CHour_s_more_right"><img src="images/calendar_arrow_right.png" alt=""></div></a></li>')
                }
            }else{
                $('.curriculum').append('<li time_back="'+begtime3+'-'+endtime3+'" class="'+old+'" classCode="'+curr_e[i].ClassCode+'"><a href="javascript:;"><div class="CHour_s_more_left"><p>'+begtime2+'</p><span></span><p>'+endtime2+'</p></div><div class="CHour_s_more"><h4>'+curr_e[i].ClassName+'</h4><p><i>'+curr_e[i].LessonNo+' / '+curr_e[i].LessonCount+'</i>课次</p></div><div class="CHour_s_more_right"><img src="images/calendar_arrow_right.png" alt=""></div></a></li>')
            }
            $('.curriculum').show();
            var masterta = curr_e[i].Teachers.split(',');
            var tem_json = [{
                'lessonTime':begtime3+'-'+endtime3,
                'date':this_dat_last.beginDate
            }];
            var back_blur = false;
            for (var j = 0; j < mastertae.length; j++) {
                for (var k = 0; k < masterta.length; k++) {
                    if (mastertae[j].teacherName == masterta[k]) {
                        sessionStorage.masterTeacherName = masterta[k];
                        back_blur = true;
                    }
                }
            }
            if(back_blur==true){
            tem_json[0].masterTeacherName = sessionStorage.masterTeacherName;
            var url = 'http://10.162.7.57:8082/course/findPlayAddressByMasterMsg';
            $.ajax({
                url:url,
                type:'post',
                dataType:'json',
                contentType:"application/json",
                data:JSON.stringify(tem_json),
                success:function(response){
                    console.log(response.data);
                    for(ele in response.data){
                        if(response.data[ele]!=''){

                        $(".curriculum li[time_back='"+ele+"']").find('.CHour_s_more_right').append('<span class="see_back" back_src="'+response.data[ele].videoId+'">观看回放</span>')
                        console.log($(".curriculum li[time_back='"+ele+"']"))
                        }
                    }
                }
            });
            }
        }

        $('.loading_s').eq(0).hide();
        if($('.curriculum li').length==0){
            $('.N-data').show();
            $('.H-data').hide();
            $('.loading_s').hide();
        }




}
// <span class="tx" index="'+i+'">'+htmltx+'</span>
    //按月查课程
    $(document).on('touchend','.see_back',function(){
        sessionStorage.video_ulr = 'http://p.bokecc.com/player?vid='+$(this).attr('back_src')+'&siteid=C29A03BE981EBA5D&autoStart=false&width=100%&height=495&playerid=D07C0642596B964D&playertype=1';
        location.href = 'video_t.html';

        return false;
    });
    function menufunc(e){
    var arr = [];
    var arr_schoolid = [];
    var strIndex = '';
    dateH = [];
    if(e.result==false||e.message!=undefined){
        $('.loading_s').hide();
        $('.N-data').show();
        $('.month_hour i').html('0');
        // $('.load_t').hide();
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
    // $('.load_t').hide();
        setInterval(menu_int,10);

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
        $('.reload_d').hide();
        clearInterval(touchtime);
        $('.content td').removeClass('xuanzhong');
        $('.content td').removeClass('xuanzhong_s');
        if(touchtend<=1){
            if($('#now2').length!=0){
                layer.msg('日历控件加载失败，请刷新后重试');
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
                'teacherCode':localStorage.teacherId,
                'schoolId':localStorage.schoolId,
                'beginDate':time,
                'endDate':time
            };
            if(time1.split(' ')[0]>time){
                $(this).addClass('xuanzhong')
            }else if(time1.split(' ')[0]==time){
                $(this).addClass('today')
            }else{
                $(this).addClass('xuanzhong_s')
            }
            $('.H-data').show();
            $('.N-data').hide();
            $('.curriculum').hide();
            $('.loading_s').show();
            this_dat_last = emailm;
            ajax_S(url.s_emai,emailm,stusea,erro_d);
            // ajax_S(url.s_emai,menu_s,menufunc);
        }

    });
    this_dat_last = emailm
    ajax_S(url.data_s, '', function (e) {
        for (var i = 0; i < e.data.length; i++) {
            mastertae.push(e.data[i]);
        }
        ajax_S(url.s_emai,emailm,stusea,erro_d);
        ajax_S(url.s_emai,menu_s,menufunc,erro_f);
    },function(){
        layer.msg('当前网络不佳 请切换网络')
    });

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
    if(parseInt($('body').css('width'))<380){
        $('.nbxs').eq(0).css('margin-top','0rem');
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
        var dat_day_today= new Date().format("d");
        // console.log(monththis+'-****'+month)
        if(monththis!=month&&monththis!=undefined){
            var day_this = $('#ymym').html().substr(0,4)+'-'+ month+'-01';
            var dat_today = time1.split(' ')[0];
            var dat_month = time1.substr(5,2);
            var this_ ;
            // console.log($('.swiper-slide-active td[data_d="1"]').eq(0).addClass('xuanzhong'));
            if(month!=dat_month){

                if(day_this>dat_today){
                    $('.xuanzhong_s').removeClass('xuanzhong_s')
                   $('.swiper-slide-active td[data_d="1"]').eq(0).addClass('xuanzhong_s');
                    this_ = '.xuanzhong_s'
                }else{
                    $('.xuanzhong_s').removeClass('xuanzhong')
                    $('.swiper-slide-active td[data_d="1"]').eq(0).addClass('xuanzhong');
                    this_ = '.xuanzhong'
                }
            }
            else{
                this_ = '.today';
                $('.swiper-slide-active td[data_d="'+dat_day_today+'"]').eq(0).addClass('today').parents('tbody').find('td').removeClass('xuanzhong').removeClass('xuanzhong_s')
            }

            var month  = $(this_).attr('data_m');
            var day = $(this_).attr('data_d');
            if(month<10){
                month = '0'+month
            }
            if(day<10){
                day = '0'+day
            }
            $('.CHour_s_title span').eq(1).html(month+'-'+day)
            $('.CHour_s_title span:last-of-type').html('周'+$('#top_week').html().substring(2,3))

            var emailm = {
                'teacherEmail':localStorage.terEmail,
                'teacherCode':localStorage.teacherId,
                'schoolId':localStorage.schoolId,
                'beginDate':day_this,
                'endDate':day_this
            };
            $('.H-data').show();
            $('.N-data').hide();
            $('.curriculum').hide();
            $('.loading_s').show();
            this_dat_last = emailm

            ajax_S(url.s_emai,emailm,stusea,erro_d);
            $('.month_hour i').html('<img src="images/loading_s.gif" style="width:.4rem;height:.4rem;position:absolute;top:.62rem;">');
            var  day = new Date($('#ymym').html().substring(0,4),month,'0');
            var daycount = day.getDate();
            var menu_s = {
                'teacherEmail':localStorage.terEmail,
                'teacherCode':localStorage.teacherId,
                'schoolId':localStorage.schoolId,
                'beginDate':$('#ymym').html().substring(0,4)+'-'+month+'-01',
                'endDate':$('#ymym').html().substring(0,4)+'-'+month+'-'+daycount
            };
            monththis = month;
            ajax_S(url.s_emai,menu_s,menufunc,erro_f);
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
    $('body').ready(function(){
        $('.load_t').show();
    })
    $(function(){
        $('.load_t').hide();
    })
})