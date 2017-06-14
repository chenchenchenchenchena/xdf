$(function(){
if(!sessionStorage.openid){
    wechatCode(location.href)
}

var WXnum  = {
    'wechatId':sessionStorage.openid
}

ajax_S(url.s_seac,WXnum,stud)
var studentlogin=true;
var teacherlogin=true;


function stud(e){
    console.log(e)

    if(e.result==false){
        studentlogin = false;
    }
}

ajax_S(url.t_wxmo,WXnum,teac)
function teac(e){
    console.log(e)
    if(e.data=="goE2"){
        teacherlogin = false;
    }
}
setTimeout(function(){
    if(teacherlogin==false&&studentlogin==true){
            location.href = 'schedule_s.html'
    }
},1000)



var emailm = {
    'teacherEmail':'caoxuefeng@xdf.cn',
    'beginDate':'2017-02-04',
    'endDate':'2017-02-04'
}
var curr_e = [];
var menu_s = {
    'teacherEmail':'caoxuefeng@xdf.cn',
    'beginDate':'2017-02-01',
    'endDate':'2017-02-28'
}
var dateH = []
ajax_S(url.s_emai,emailm,stusea)
ajax_S(url.s_emai,menu_s,menufunc)


function menufunc(e){
    var arr = [];
    var moth = e.data.Data
    for(var i = 0;i<moth.length;i++){
       arr.push( moth[i].SectBegin.split(' ')[0])
    }
    // console.log(arr)
    // console.log(moth)
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
// console.log(dateH)
},100)
}

// inter_S   innet_S
// var data = new Date()
// alert(data)
// var th = '2017-07-09 19:00:00'
// var tr = '2017-08-07 19:00:00'
// alert(tr>th)
// var hour = data.getHours().toString()
// var minute = data.getMinutes().toString()
// if(minute<10){
// 	minute = '0'+minute
// }
// var newtime = hour+minute
// // newtime+= minute
// // console.log(newtime)
var time1 = new Date().format("yyyy-MM-dd hh:mm:ss");
console.log(time1);
setTimeout(function(){
	$('.CHour_s_title span:last-of-type').html('周'+$('#top_week').html().substring(2,3))
},1000)
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

$(document).on('touchstart',function(e){
        var even = e||even;
        start_s = parseInt(e.touches[0].pageX)
        $(document).on('touchend','.content td',function(e){
            var even = e||even;
            end_s = parseInt(e.changedTouches[0].pageX)
            if(start_s-end_s<50){
                var time = ''+$(this).attr('data_y')+'-'+$(this).attr('data_m')+'-'+$(this).attr('data_d')+''
                var emailm = {
                    'studentCode':'SS2303',
                    'beginDate':'2017-02-04',
                    'endDate':'2017-02-04'
                 }
                alert(time)
                ajax_S(url.s_stud,emailm,stusea)
            }
        $(document).on('touchend','.curriculum li',function(){
                sessionStorage.beginTime = $(this).find('p').html()
                sessionStorage.beginDate = '2017 -02-04 '+$(this).find('p').html()+''
                sessionStorage.endDate = '2017-02-04'
                location.href = 'detailsmany_t.html'
        })
        $(document).off('touchend','.content td')
        $(document).off('touchend','.curriculum li')
        })
})

// <li class=""><a href="javascript:;"><div class="CHour_s_more_left"><p>13:00</p><span></span><p>13:00</p></div><div class="CHour_s_more"><h4>初中全科一对一</h4><p><i>8/16</i>课次</p></div><div class="CHour_s_more_right"><img src="images/calendar_arrow_right.png" alt=""></div></a></li>







})