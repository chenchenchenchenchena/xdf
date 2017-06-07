$(function(){
	$(".inputBox p").eq(1).hide();
	$(".studentTitle li").tap(function(){
		$(this).addClass("show").siblings().removeClass("show");
		$(".inputBox p").eq($(this).index()).show().siblings("p").hide();
	})
	$(".deterAss").tap(function(){
		$(this).css("background","#ff6a6a");
		$(this).html("解除关联");
	})



// 教师登录
$('.enter').click(function(){
	var  cbconfig = {'callbackFlag':'teacherWX'};
	$.ajax({
	    url: 'http://dt.staff.xdf.cn/xdfdtmanager/e2Login/login.do',
	    type: 'post',
	    dataType: 'json',
	    data:JSON.stringify(cbconfig),
	    success:function(e){
	        console.log(e)
	        location.href = e.url
	        sessionStorage.e2state = e.e2state
	        // alert(sessionStorage.e2state)
	    }
	})
})




























})