$(function(){
	$(".choose li").click(function(){
		if($(this).index()==0){
			$(".scoreType").css("animation","move 0.5s linear");
			$(".scoreType").css("bottom","0px");
			$(".chooseClass").css("animation","");
			$(".chooseClass").css("bottom","-440px");
			$(".classNumTime").css("animation","");
			$(".classNumTime").css("bottom","-440px");
		}else if($(this).index()==1){
			$(".chooseClass").css("animation","move 0.5s linear");
			$(".chooseClass").css("bottom","0px");
			$(".classNumTime").css("animation","");
			$(".classNumTime").css("bottom","-440px");
			$(".scoreType").css("animation","");
			$(".scoreType").css("bottom","-440px");
			$.ajax({
				type:"get",
				url:"http://10.73.84.62:8080/teacherData/queryTeacherLesson.do",
				async:true,
				success:function(res){
					/*console.log(JSON.stringify(res))*/
					console.log(res)
				}
			});
		}else if($(this).index()==2){
			$(".classNumTime").css("animation","move 0.5s linear");
			$(".classNumTime").css("bottom","0px");
			$(".chooseClass").css("animation","");
			$(".chooseClass").css("bottom","-440px");
			$(".scoreType").css("animation","");
			$(".scoreType").css("bottom","-440px");
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
	$(".scoreTypeBtn").click(function(){
		$(".scoreType").css("animation","");
		$(".scoreType").css("bottom","-440px");
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
	var layer1;
	var layer2;
	var layer3;
	$(".subtn").click(function(){
		for(var i = 0;i<$(".scoreList dt").length;i++){
			/*alert($(".scoreList dl dt").eq(i).html()=="")*/
			if($(".scoreList dl dt").eq(i).html()==""){
				 layer1=layer.open({
			        type: 1,
			        area: ['548px', '345px'],
			        shade:[0.2,'#000'],
			        title:'',
			        skin: '',
			        content:$(".noRecord")
			    })
				return false;
			}
			
		}
		 layer2 = layer.open({
	        type: 1,
	        area: ['548px', '345px'],
	        shade:[0.2,'#000'],
	        title:'',
	        skin: '',
	        content:$(".recordSub")
		})
	})
	$(".recordSub button").eq(1).click(function(){
		layer.close(layer2);
		layer3 = layer.open({
	        type: 1,
	        area: ['548px', '345px'],
	        shade:[0.2,'#000'],
	        title:'',
	        skin: '',
	        content:$(".recordSucc")
		})
	})
	$(".recordSucc button").click(function(){
		layer.close(layer3);
	})
	$(".noRecord button").click(function(){
		layer.close(layer1);
	})
	
	//判断中文长度
	function isChinese(str){  //判断是不是中文  
	    var reCh=/[u00-uff]/;  
	    return !reCh.test(str);  
	} 
	function lenStat(target){  
	    var strlen=0; //初始定义长度为0  
	    var txtval = $.trim(target.html());
	    for(var i=0;i<txtval.length;i++){  
		     if(isChinese(txtval.charAt(i))==true){ 
		      	strlen=strlen+2;//中文为2个字符  
		     }else{  
		      	strlen=strlen+1;//英文一个字符  
		     }  
	    }  
	    /*strlen=Math.ceil(strlen/2);*///中英文相加除2取整数  
	    return strlen;  
	}
	for(var i = 0;i<$(".scoreList dl").length;i++){
		var str = $(".scoreList dd").eq(i);
		/*console.log(str.html());*/
		var strLen = lenStat(str);
		/*console.log(strLen);*/
		if(lenStat(str)>8){
			str.css("font-size","17px");
		}
	}
	
	
})
