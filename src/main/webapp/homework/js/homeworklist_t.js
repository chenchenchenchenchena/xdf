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
	$(".firstList p").click(function(){
		if(flag){
			$(this).parent().css("background","url(images/jiao11.png) no-repeat right 55px");
			flag=false;
		}else{
			$(this).parent().css("background","url(images/jiao22222.png) no-repeat right 55px");
			flag=true;
		}
		$(this).parent().find(".secul").toggle();
	})
	//点击secul跳到reply_t
	$(".secul li").click(function(){
		location.href="reply_t.html";
	})
	//选择班
	$(".choose li").click(function(){
		if($(this).index()==0){
			$(".chooseClass").css("animation","move 1s linear");
			$(".chooseClass").css("bottom","0px");
		}else{
			$(".classNumTime").css("animation","move 1s linear");
			$(".classNumTime").css("bottom","0px");
		}
		
	})
	$(".chooseBtn").click(function(){
		$(".chooseClass").css("bottom","-440px");
	})
	$(".confirmBtn").click(function(){
		$(".classNumTime").css("bottom","-440px");
	})
})
