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




























})