$(function(){
	var flag=true;
	$(".studentList").hide();
	$(".slist .listCon .teClass").tap(function(event){
		if($(".studentList").eq($(this).index()).css("display")=="none"){
			$(".arrow").eq($(this).index()).css("background","url(images/upArrow.png)");
			$(".studentList").eq($(this).index()).show();
		}else{
			$(".arrow").eq($(this).index()).css("background","url(images/belowArrow.png)");
			$(".studentList").eq($(this).index()).hide();
		}
		$(".arrow").eq($(this).index()).css("background-size","0.31rem 0.17rem")
		// $(".studentList").eq($(this).index()).toggle();
        event.stopPropagation();
	})
})
