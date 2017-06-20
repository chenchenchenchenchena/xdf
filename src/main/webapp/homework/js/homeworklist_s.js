$(function(){
	//点击待交作业
	$(".secul").hide();
	$(".hwContent").show();
	$(".hwFinish").hide();
	$(".hwHeader ul li").click(function(){
		$(this).addClass("hwShow").siblings("li").removeClass("hwShow");
		if($(this).index()==0){
			$(".hwContent").show();
			$(".hwFinish").hide();
		}else{
			$(".hwContent").hide();
			$(".hwFinish").show();
		}
	})
	//点击已交作业列表
	var flag=true;
	$(".firstList").click(function(){
		if(flag){
			$(this).css("background","url(images/jiao11.png) no-repeat right 55px");
			flag=false;
		}else{
			$(this).css("background","url(images/jiao22222.png) no-repeat right 55px");
			flag=true;
		}
		$(this).find(".secul").toggle();
	})
	//点击作业排行榜
	$(".hwRankTitle").click(function(){
		location.href="studentrank_s.html";
	})
})