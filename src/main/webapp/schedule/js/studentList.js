$(function(){
	var flag=true;
	$(".studentList").hide();
	$(".teClass").tap(function(event){
		console.log($(".teClass").length);
		console.log($(this).index());
		if($(this).next().css("display")=="none"){
			$(this).find('.arrow').css("background","url(images/upArrow.png)");
			$(this).next().show();
		}else{
			$(this).find('.arrow').css("background","url(images/belowArrow.png)");
			$(this).next().hide();
		}
		$(this).find('.arrow').css("background-size","0.31rem 0.17rem")
		// $(".studentList").eq($(this).index()).toggle();
        event.stopPropagation();
	})
})
