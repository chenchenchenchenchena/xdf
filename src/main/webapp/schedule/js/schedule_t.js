$(function(){
var emailm = {
    'teacherEmail':'caoxuefeng@xdf.cn',
    'beginDate':'2017-02-04',
    'endDate':'2017-02-04'
}
var curr_e = [];


ajax_S(url.s_emai,emailm,stusea)



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
$(document).on('touchend','.curriculum li',function(){
    // alert(0)
    sessionStorage.beginTime = $(this).find('p').html()
    // sessionStorage.beginDate = $('.today').html()
    sessionStorage.beginDate = '2017-02-04 '+$(this).find('p').html()+''
    sessionStorage.endDate = '2017-02-04'
    // console.log($(this).find('p').html())
    // console.log($('.today').html())
    location.href = 'detailsmany_t.html'
})
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
        $(document).off('touchend','.content td')
        })
})

// <li class=""><a href="javascript:;"><div class="CHour_s_more_left"><p>13:00</p><span></span><p>13:00</p></div><div class="CHour_s_more"><h4>初中全科一对一</h4><p><i>8/16</i>课次</p></div><div class="CHour_s_more_right"><img src="images/calendar_arrow_right.png" alt=""></div></a></li>







})