$(function(){
	var flagOne=true;
	$(".hwTeacherRankTitle").click(function(){
		if(flagOne){
			$(".hwInfo").show();
			$(this).css("background","url(images/jiao11.png) no-repeat 708px 38px #fff");
			flagOne=false;
		}else{
			$(".hwInfo").hide();
			$(this).css("background","url(images/jiao22222.png) no-repeat 708px 38px #fff");
			flagOne=true;
		}
		
	})
	//点击布置作业列表
	$(".hwHeader ul li").click(function(){
		$(this).addClass("hwShow").siblings("li").removeClass("hwShow");
		if($(this).index()==0){
			$(".thwList").show();
			$(".assignment").hide();
		}else{
			$(".thwList").hide();
			$(".assignment").show();
		}
	})
	//点击班级
	var flag=true;
	$(".secul").hide();
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
})
