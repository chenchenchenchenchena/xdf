$(function() {
    var this_dat_last;
     //请求整月数据超时处理
     function erro_f(){
        if($('.month_hour i')){
            $('.month_hour i').html('<img src="images/reload.png" class="reload_f" style="width:.6rem;height:.4rem;position:absolute;top:.62rem;">')
            $('.load_t').hide();
            setInterval(menu_int,10);
        }
    }
    function erro_d(){
        if($('.month_hour i')){
            $('.reload_d').hide();
            // $('.month_hour i').html('<img src="images/reload.png" style="width:.6rem;height:.4rem;position:absolute;top:.62rem;">')
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
            'studentCode': sessionStorage.stuNum,
            'schoolId':sessionStorage.schoolId,
            'beginDate':$('#ymym').html().substring(0,4)+'-'+month+'-01',
            'endDate':$('#ymym').html().substring(0,4)+'-'+month+'-'+daycount
        };
        monththis = month;
        ajax_S(url.s_seac,menu_s,menufunc,erro_f);
    })
    $(document).on('touchend','.reload_d',function(){
        $(this).hide();
        $('.loading_s').eq(0).show();
        if($('.xuanzhong').length!=0){
            var month  = $('.xuanzhong').attr('data_m');
            var day = $('.xuanzhong').attr('data_d');
            if(month<10){
                month = '0'+month
            }
            if(day<10){
                day = '0'+day
            }
            var time = ''+$('.xuanzhong').attr('data_y')+'-'+month+'-'+day+'';
        }else if($('.today').length!=0){
            var month  = $('.today').attr('data_m');
            var day = $('.today').attr('data_d');
            if(month<10){
                month = '0'+month
            }
            if(day<10){
                day = '0'+day
            }
            var time = ''+$('.today').attr('data_y')+'-'+month+'-'+day+'';
        }else if($('.xuanzhong_s').length!=0){
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
            'studentCode': sessionStorage.stuNum,
            'beginDate': time,
            'endDate': time,
            'schoolId':sessionStorage.schoolId
        };
        this_dat_last = emailm;
        ajax_S(url.s_seac,emailm,stusea,erro_d);
    })
    if (!sessionStorage.openid) {
        wechatCode(location.href);
    };
    $('.load_t').show();        
    $('.month_hour i').html('<img src="images/loading_s.gif" style="width:.4rem;height:.4rem;position:absolute;top:.62rem;">');
    
    //判断ios
    var u = navigator.userAgent;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS == true) {
        $('.nbxs').eq(0).css('margin-t*op', '-.25rem')
    }
    // sessionStorage.openid='ofZfFwn_wASl8ax5WPoEZ5-ssPU0';
    // 当前微信号
    var WXnum = {
        'wechatId': sessionStorage.openid
    };
    //储存课程信息
    var curr_e = [];
    //储存当月的日期
    var dateH = [];
    //储存当前日期
    var time1 = new Date().format("yyyy-MM-dd");
    //储存日历本月日期
    var time_this;

    //判断长按的定时器
    var touchtime;
    var touchtend;
    var mastertae = [];
    var color = '';
    //存储主讲老师
    var masterteacher = '';
    //当天课程
    ajax_S(url.s_seac, WXnum, stud);
    var emailm = {
        'studentCode': sessionStorage.stuNum,
        'beginDate': time1,
        'endDate': time1,
        'schoolId':sessionStorage.schoolId
    };
    //当月课程
    var menu_s = {
        'studentCode': sessionStorage.stuNum,
        'beginDate': new Date().format("yyyy-MM-01"),
        'endDate': new Date().format("yyyy-MM") + '-' + getCountDays(),
        'schoolId':sessionStorage.schoolId
    };

    // 微信查询是否绑定微信  参数：当前微信号 学生
    $('.js_jin').click(function () {
        var emailm = {
            'studentCode': sessionStorage.stuNum,
            'beginDate': time1,
            'endDate': time1,
            'schoolId':sessionStorage.schoolId

        };
        this_dat_last = emailm;

        ajax_S(url.s_stud, emailm, stusea,erro_d);
        var month = $('.today').attr('data_m');
        var day = new Date($('#ymym').html().substring(0, 4), month, '0');
        var daycount = day.getDate();
        var menu_s = {
            'studentCode': sessionStorage.stuNum,
            'beginDate': $('#ymym').html().substring(0, 4) + '-' + month + '-01',
            'endDate': $('#ymym').html().substring(0, 4) + '-' + month + '-' + daycount,
            'schoolId':sessionStorage.schoolId

        };
        // ajax_S(url.s_stud, menu_s, menufunc);
        monththis = month
    })
    // 微信查询是否绑定微信  参数：当前微信号 学生
    function stud(e) {
        if (e.result == false) {
            // 微信查询是否绑定微信  参数：当前微信号 老师
            ajax_S(url.t_wxmo, WXnum, teac);

        } else {
            if(!localStorage.userId_stu){
                location.href = 'login_s.html'
            }
            // 存储学员号
            sessionStorage.stuNum = e.data.studentNo;
            sessionStorage.stuNumber = e.data.studentNo;
            sessionStorage.schoolId = e.data.schoolId;
            sessionStorage.studentName = e.data.studentName;
            var emailm = {
                'studentCode': sessionStorage.stuNum,
                'beginDate': time1,
                'endDate': time1,
                'schoolId':sessionStorage.schoolId
            };
            //当月课程
            var menu_s = {
                'studentCode': sessionStorage.stuNum,
                'beginDate': new Date().format("yyyy-MM-01"),
                'endDate': new Date().format("yyyy-MM") + '-' + getCountDays(),
                'schoolId':sessionStorage.schoolId
            };
            this_dat_last = emailm;

            ajax_S(url.s_stud, emailm, stusea,erro_d);
            ajax_S(url.s_stud, menu_s, menufunc,erro_f);
            ajax_S(url.data_s, '1', function (e) {
                for (var i = 0; i < e.data.length; i++) {
                    masterteacher += e.data[i].teacherName + ','
                    mastertae.push(e.data[i]);
                }
            });
        }
    }
    // 微信查询是否绑定微信  参数：当前微信号 老师
    function teac(e) {
        if (e.data == "goE2") {
            if (localStorage.terEmail) {
                location.href = 'schedule_t.html';
                sessionStorage.removeItem('callbackconfig')
            }else{
                location.href = 'login_s.html'
            }
            sessionStorage.callbackconfig = 'schedule'
        } else if (localStorage.terEmail) {
            location.href = 'schedule_t.html';
            sessionStorage.removeItem('callbackconfig')
        } else {

                location.href = 'login_s.html'

        }
    }

    //学生查询课程  整月查询
    function menufunc(e) {
        var arr = [];
        dateH = [];
        if (e.result == false || e.message!=undefined) {
            $('.loading_s').hide();
            $('.N-data').show();
            $('.month_hour i').html('0');
            $('.load_t').hide();        
        } else {
            $('.load_t').hide();                    
            setInterval(menu_int, 1000);
            var moth = e.data.Data;
            $('.month_hour i').html(moth.length);
            for (var i = 0; i < moth.length; i++) {
                arr.push(moth[i].SectBegin.split(' ')[0])
            }
            setTimeout(function () {
                var html_s = $('.swiper-slide-active table').find('td');
                var number = 0;
                for (var k = 0; k < html_s.length; k++) {
                    var month = html_s.eq(k).attr('data_m');
                    var day = html_s.eq(k).attr('data_d');
                    if (month < 10) {
                        month = '0' + month
                    }
                    if (day < 10) {
                        day = '0' + day
                    }
                    if (!html_s.eq(k).hasClass('not_this') && !html_s.eq(k).hasClass('js_up')) {
                        dateH.push('' + html_s.eq(k).attr('data_y') + '-' + month + '-' + day + '')
                    } else {
                        if (k < 20) {
                            number++
                        }
                    }
                }

                for (var j = 0; j < arr.length; j++) {

                    for (var k = 0; k < dateH.length; k++) {
                        if (arr[j] == dateH[k]) {
                            if (arr[j] > new Date().format("yyyy-MM-dd")) {
                                html_s.eq(k + number).addClass('inter_S')

                            } else {
                                html_s.eq(k + number).addClass('innet_S')
                            }
                        }
                    }

                }
            }, 100)
        }
    }

    //赋值今天是周几
    setTimeout(function () {
        $('.CHour_s_title span:last-of-type').html('周' + $('#top_week').html().substring(2, 3))
    }, 1000);
    // ajax_S(url.data_s,'1',function(e){
    //     for(var i = 0;i<e.data.length;i++){
    //         masterteacher+=e.data[i].teacherName+','
    //     }
    // });
    //按天查询课程
    //按天查询课程

    function stusea(e) {
        var teacherr_m = masterteacher.split(',');
        $('.stu_data li').remove();
        if (e.result == false) {
            $('.loading_s').hide();
            $('.curriculum').hide();
            $('.N-data').show();
        } else {
            $('.H-data').show();
            $('.N-data').hide();
            curr_e = e.data.Data;
            var time_old = [];
            var Index = [];

            var old;

            // 录入开始时间
            for (var i = 0; i < curr_e.length; i++) {
                var masterta = e.data.Data[i].Teachers.split(',');
                var masteaname = '';
                for (var j = 0; j < mastertae.length; j++) {
                    for (var k = 0; k < masterta.length; k++) {
                        if (mastertae[j].teacherName == masterta[k]) {
                            jteaname = masterta[k]
                            masterta.splice(k,1)
                        }
                    }
                }
                var begtime = curr_e[i].SectBegin.split(' ');
                var begtime2 = begtime[1].substring(0, begtime[1].length - 3);
                var begtime3 = begtime[1].substring(0, begtime[1].length);
                var endtime = curr_e[i].SectEnd.split(' ');
                var endtime2 = endtime[1].substring(0, begtime[1].length - 3);
                var endtime3 = endtime[1].substring(0, begtime[1].length);
                var teaname = curr_e[i].Teachers.split(',');
                var zteaname;
                var jteaname;
                var remindedata = {
                    'classCode': curr_e[i].ClassCode,
                    // 'courseCode': curr_e[i].CourseCode,
                    'studentNo': sessionStorage.stuNum,
                    'schoolId':sessionStorage.schoolId
                };
                var htmltx = '';

                if (time1 < curr_e[i].SectEnd) {
                    old = ''
                    color = '#000'
                } else {
                    old = 'activ_c'
                    color = '#ccc'
                }
                if(jteaname==undefined){
                    jteaname = '暂无'
                }
                if(masterta==''||masterta==undefined){
                    masterta  = '暂无'
                }
                $('.curriculum').append('<li class="' + old + '" time_back="'+begtime3+'-'+endtime3+'"><a href="javascript:;"><div class="CHour_s_more_left"><p>' + begtime2 + '</p><span></span><p>' + endtime2 + '</p></div><div class="CHour_s_more"><h4>' + curr_e[i].ClassName + '</h4><p><i style="color:'+color+'" >主讲(' + jteaname + ')</i><span><i style="color:'+color+'" >班主任(' + masterta + ')</i></span></p><p><i>' + curr_e[i].LessonNo + ' / ' + curr_e[i].LessonCount + '</i>课次</p></div><div class="CHour_s_more_right"><img src="images/calendar_arrow_right.png" alt=""></div></a></li>')
                $('.loading_s').hide();
                $('.curriculum').show();
                var tem_json = [{
                    'masterTeacherName':jteaname,
                    'lessonTime':begtime3+'-'+endtime3,
                    'date':this_dat_last.beginDate
                }];
                var url = 'http://10.162.7.137:8082/course/findPlayAddressByMasterMsg';
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
                // <span class="tx" index="'+i+'">'+htmltx+'</span>
                // ajax_S(url.s_data,remindedata,function(e){
                //     if(e.result==false){
                //         layer.msg('请求参数不可以为空')
                //     }else{
                //         if(e.remindstatus==1){
                //             htmltx = '有新作业'
                //         }else if(e.remindstatus==2){
                //             htmltx = ''
                //         }
                //         else if(e.remindstatus==3){
                //             htmltx = '查看批复'
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
            }
        }
        $('.loading_s').hide();
        

        //
    };
    // <span>12个带交作业</span>
    //日历点击事件
    $(document).on('touchstart', '.content td', function () {
        touchtend = 0;
        touchtime = setInterval(function () {
            touchtend++
        }, 100)
    });

    $(document).on('touchend', '.content td', function () {
        clearInterval(touchtime);
        $('.content td').removeClass('xuanzhong');
        $('.content td').removeClass('xuanzhong_s');
        if (touchtend <= 1) {
            if($('#now2').length!=0){
                alert('日历控件加载失败，请刷新后重试');
                return false;
            }
            $('.reload_d').hide();
            setTimeout(function () {
                $('.CHour_s_title span:last-of-type').html('周' + $('#top_week').html().substring(2, 3))
            }, 1000)
            $('.content td').removeClass('today');
            var month = $(this).attr('data_m');
            var day = $(this).attr('data_d');
            if (month < 10) {
                month = '0' + month
            }
            if (day < 10) {
                day = '0' + day
            }
            $('.CHour_s_title span').eq(1).html(month + '-' + day)
            var time = '' + $(this).attr('data_y') + '-' + month + '-' + day + '';
            var day = new Date($(this).attr('data_y'), month, '0');
            var daycount = day.getDate();
            var emailm = {
                'studentCode': sessionStorage.stuNum,
                'beginDate': time,
                'endDate': time,
                'schoolId':sessionStorage.schoolId

            };
            //当月课程
            var menu_s = {
                'studentCode': sessionStorage.stuNum,
                'beginDate': time.substring(0, 7) + '-01',
                'endDate': time.substring(0, 7) + '-' + daycount,
                'schoolId':sessionStorage.schoolId

            };
            if (time1.split(' ')[0] > time) {
                $(this).addClass('xuanzhong')
            } else if (time1.split(' ')[0] == time) {
                $(this).addClass('today')
            } else {
                $(this).addClass('xuanzhong_s')
            }
            $('.H-data').show();
            $('.N-data').hide();
            $('.curriculum').hide();
            $('.loading_s').show();
            this_dat_last = emailm;

            ajax_S(url.s_stud, emailm, stusea,erro_d);
            // ajax_S(url.s_stud, menu_s, menufunc);
        }
    });
    //点击查看详情
    $(document).on('click', '.H-data li', function () {
        var year = $('#ymym').html().substring(0, $('#ymym').html().indexOf('年'));
        var month = $('#ymym').html().substring($('#ymym').html().indexOf('年') + 1, $('#ymym').html().indexOf('月'));
        var day;
        $('.content td').each(function () {
            if ($(this).hasClass('today') || $(this).hasClass('xuanzhong') || $(this).hasClass('xuanzhong_s')) {
                day = $(this).find('i').html();
            }
        });
        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }
        $('.CHour_s_title span').eq(1).html(month + '-' + day)
        var time_s = '' + year + '-' + month + '-' + day + ' ' + $(this).find('.CHour_s_more_left p').eq(0).html() + ':00'
        sessionStorage.timetoday = time_s;
        location.href = 'details_s.html'

    });
    var todaythis;
    //储存当前月期
    var monththis;
    setTimeout(function () {
        var month = $('.today').attr('data_m');
        var day = $('.today').attr('data_d');
        if (month < 10) {
            month = '0' + month
        }
        monththis = month;
        if (day < 10) {
            day = '0' + day
        }
        todaythis = '' + $('.today').attr('data_y') + '-' + month + '-' + day + '';
        $('.not_this').css('opacity', '0');
    }, 100);
    function menu_int() {
        $('.not_this').css('opacity','0');
        var month = $('#ymym').html().substring($('#ymym').html().indexOf('年')+1,$('#ymym').html().indexOf('月'));
        if(month<10){
            month = '0'+month
        }
        var dat_day_today= new Date().format("d");

        if(monththis!=month){
            var day_this = $('#ymym').html().substr(0,4)+'-'+ month+'-01';
            var dat_today = time1.split(' ')[0];
            var dat_month = time1.substr(5,2);
            var this_;
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
                var emailm = {
                    'studentCode': sessionStorage.stuNum,
                    'beginDate': day_this,
                    'endDate': day_this,
                    'schoolId':sessionStorage.schoolId
                };
                $('.H-data').show();
                $('.N-data').hide();
                $('.curriculum').hide();
                $('.loading_s').show();
                this_dat_last = emailm;

                ajax_S(url.s_stud, emailm, stusea,erro_d);
            }
            else{
                this_ = '.today';
                $('.swiper-slide-active td[data_d="'+dat_day_today+'"]').eq(0).addClass('today').parents('tbody').find('td').removeClass('xuanzhong').removeClass('xuanzhong_s')
            }
            var month_  = $(this_).attr('data_m');
            var day_ = $(this_).attr('data_d');
            if(month_<10){
                month_ = '0'+month_
            }
            if(day_<10){
                day_ = '0'+day_
            }
            $('.CHour_s_title span').eq(1).html(month_+'-'+day_)
            $('.CHour_s_title span:last-of-type').html('周'+$('#top_week').html().substring(2,3))

            $('.month_hour i').html('<img src="images/loading_s.gif" style="width:.4rem;height:.4rem;position:absolute;top:.62rem;">');

            var time = '' + $(this_).attr('data_y') + '-' + month + '-' + day + '';
            var day = new Date($(this_).attr('data_y'), month, '0');
            var daycount = day.getDate();
            var menu_s = {
                'studentCode': sessionStorage.stuNum,
                'beginDate':$('#ymym').html().substring(0,4)+'-'+month+'-01',
                'endDate':$('#ymym').html().substring(0,4)+'-'+month+'-'+daycount,
                'schoolId':sessionStorage.schoolId

            };
            monththis = month;
            ajax_S(url.s_stud, menu_s, menufunc);
        }

        var html_s = $('.swiper-slide-active table').find('td');
        for (var k = 0; k < html_s.length; k++) {
            var month = $(html_s).eq(k).attr('data_m');
            var day = $(html_s).eq(k).attr('data_d');
            if (month < 10) {
                month = '0' + month
            }
            if (day < 10) {
                day = '0' + day
            }
            var time2 = '' + $(html_s).eq(k).attr('data_y') + '-' + month + '-' + day + '';
            if (time2 < todaythis) {
                $(html_s).eq(k).css('color', '#ccc')
            }
        }
    }


    $('.js_jin').click(function(){
        var time1 = new Date().format("yyyy-MM-dd");
        var menu_s = {
            'teacherEmail':localStorage.terEmail,
            'beginDate':new Date().format("yyyy-MM-01"),
            'endDate':new Date().format("yyyy-MM")+'-'+getCountDays(),
            'schoolId':sessionStorage.schoolId

        };
        this_dat_last = emailm;

        ajax_S(url.s_emai,emailm,stusea,erro_d);
        var month  = $('.today').attr('data_m');
        var  day = new Date($('#ymym').html().substring(0,4),month,'0');
        var daycount = day.getDate();
        var menu_s = {
            'teacherEmail':localStorage.terEmail,
            'beginDate':$('#ymym').html().substring(0,4)+'-'+month+'-01',
            'endDate':$('#ymym').html().substring(0,4)+'-'+month+'-'+daycount,
            'schoolId':sessionStorage.schoolId

        };
        ajax_S(url.s_emai,menu_s,menufunc,erro_f);
        monththis = month
    });
    $(document).on('touchstart','.tc-bot-right',function(){
        var time1 = new Date().format("yyyy-MM-dd");
        var menu_s = {
            'teacherEmail':localStorage.terEmail,
            'beginDate':new Date().format("yyyy-MM-01"),
            'endDate':new Date().format("yyyy-MM")+'-'+getCountDays(),
            'schoolId':sessionStorage.schoolId

        };
        this_dat_last = emailm;

        ajax_S(url.s_emai,emailm,stusea,erro_d);
        var month  = $('.today').attr('data_m');
        var  day = new Date($('#ymym').html().substring(0,4),month,'0');
        var daycount = day.getDate();
        var menu_s = {
            'teacherEmail':localStorage.terEmail,
            'beginDate':$('#ymym').html().substring(0,4)+'-'+month+'-01',
            'endDate':$('#ymym').html().substring(0,4)+'-'+month+'-'+daycount,
            'schoolId':sessionStorage.schoolId

        };
        ajax_S(url.s_emai,menu_s,menufunc,erro_f);
        monththis = month
    });
});