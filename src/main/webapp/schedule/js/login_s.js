$(function(){
	// tab切换
	$(".studentTitle li").tap(function(){
		$(this).addClass("show").siblings().removeClass("show");
		$(".inputBox p").eq($(this).index()).show().siblings("p").hide();
	})

	var wxnumber = {'email':'','wechatId':Wxid}
	ajax_S(url.t_wxmo,wxnumber,Wxtea)//ajax请求

	function Wxtea(e){
		if(e.data!='goE2'){
			location.href = 'schedule_t.html'
		}
	}



















})