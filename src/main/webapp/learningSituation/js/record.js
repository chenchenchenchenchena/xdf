$(function(){
	$(".choose li").click(function(){
		if($(this).index()==1){
			$(".chooseClass").css("animation","move 0.5s linear");
			$(".chooseClass").css("bottom","0px");
			$(".classNumTime").css("animation","");
			$(".classNumTime").css("bottom","-440px");
		}else if($(this).index()==2){
			$(".classNumTime").css("animation","move 0.5s linear");
			$(".classNumTime").css("bottom","0px");
			$(".chooseClass").css("animation","");
			$(".chooseClass").css("bottom","-440px");
		}
		
	})
	$(".chooseBtn").click(function(){
		$(".chooseClass").css("animation","");
		$(".chooseClass").css("bottom","-440px");
	})
	$(".confirmBtn").click(function(){
		$(".classNumTime").css("animation","");
		$(".classNumTime").css("bottom","-440px");
	})
	var scoreArr = [];
	$(".scoreList dl").click(function(){
			var name = $(this).find("dd").html();
			$(".scoreTitle span").html(name);
			var totalScore = parseInt($(".totalScore").val());
		if($(".scoreTitle input").val()!=""&&parseInt($(".scoreTitle input").val())<=totalScore){
			/*var that = $(this);
			var other = $(this).siblings("dl");*/
			$(this).find("dt").html($(".scoreTitle input").val());
			scoreArr.push($(".scoreTitle input").val());
			console.log(scoreArr);
			/*$(".scoreTitle input").val("");*/
		}
		
	})
	/*function a(b){
		b.click(function(){
			for(var i = 0;i < $(".scoreList dl").length;i++){
				if($(".scoreList dl").eq(i).find("dd").html()==$(".scoreTitle span").html()){
					
					$(".scoreList dl").eq(i).find("dt").html($(".scoreTitle input").val());
				}
			}
			$(".scoreTitle input").val("");
		})
	}*/
	$(".subtn").click(function(){
		for(var i = 0;i<$(".scoreList dl").length;i++){
			if($(".scoreList dt").eq(i).html()==""){
				layer.open({
			        type: 1,
			        area: ['548px', '345px'],
			        shade:[0.2,'#000'],
			        title:'',
			        skin: '',
			        content:$(".noRecord")
			    })
			}else{
				layer.open({
			        type: 1,
			        area: ['548px', '345px'],
			        shade:[0.2,'#000'],
			        title:'',
			        skin: '',
			        content:$(".recordSub")
			    })
			}
		}
	})
	$(".recordSub button").eq(1).click(function(){
		$(".recordSub p").html("提交成功");
	})
})
