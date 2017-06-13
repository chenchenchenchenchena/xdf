$(function(){
var emailm = {
    'studentCode':'SS2303',
    'beginDate':'2017-02-04',
    'endDate':'2017-02-04'
}
var curr_e = [];


ajax_S(url.s_stud,emailm,stusea)
// ajax_S(url.data_s,'',sss)

function sss(e){
    console.log(e)
}
var time1 = new Date().format("yyyy-MM-dd hh:mm:ss");
setTimeout(function(){
	$('.CHour_s_title span:last-of-type').html('周'+$('#top_week').html().substring(2,3))
},1000)
function stusea(e){
    $('.stu_data li').remove()
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
        var teaname = curr_e[i].Teachers.split(',')
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


        $('.loading_s').hide()
    	$('.curriculum').show()
    }
}
$(document).on('touchend','.curriculum li',function(){
    // alert(0)
    sessionStorage.beginTime = $(this).find('p').html()
    sessionStorage.beginDate = '2017-02-04 '+$(this).find('p').html()+''
    sessionStorage.endDate = '2017-02-04'
    location.href = 'details_s.html'
})
var start_s;
var end_s;
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






})