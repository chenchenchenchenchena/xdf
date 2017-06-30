$(function(){
	$(".txt").hide();
	$(".txtDiv").hide();
	var inputData={"sCode":"TC41","email":"caoxuefeng@xdf.cn"};
	$.ajax({
		type:"post",
		url:"http://dt.staff.xdf.cn/xdfdtmanager/teacherData/queryTeacherLesson.do",
		async:true,
		dataType:"json",
		data:JSON.stringify(inputData),
		success:function(res){
			/*console.log(JSON.stringify(res))*/
			console.log(res);
			console.log(inputData)
			for(var i =0;i<res.Data.length;i++){
				var str="<li>"+res.Data[i].className+"</li><span style=display:none class=classCode>"+res.Data[i].classCode+"</span>";
				/*var str1="<li>第"+res.Data[i].LessonData[0].lessonNo+"课次"+res.Data[i].LessonData[0].sectTime+"</li>";*/
				$(".chooseClass ul").append(str);
				/*$(".classNumTime ul").append(str1);*/
			}
			
			for(var i=0;i<res.studycase_grade_type.length;i++){
				var str2="<li>"+res.studycase_grade_type[i].tName+"</li>";
				$(".scoreType ul").append(str2);
			}
			$(".chooseClass ul").on("click","li",function(){
				/*alert(1);
				alert($(this));*/
				$(".txt").show();
				$(".txtDiv").show();
				var stu="";
				var stuArr=[];
				var str1="";
				var flag=0;
				/*alert($(this).index());*/
				$(this).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
				$(".classrome").html($(this).html());
				var spanObj=$(this).next();
				/*console.log(spanObj.html());*/
				$(".class").html(spanObj.html());
				//课次及时间
				/*for(var h=0;h<res.Data.length,h++){
					var str1="<li>第"+res.Data[i].LessonData[0].lessonNo+"课次"+res.Data[i].LessonData[0].sectTime+"</li>";
				}
				$(".classNumTime ul").append(str1);*/
				for(var i =0;i<res.Data.length;i++){
					if($(".classrome").html()==res.Data[i].className){
						for(var j =0;j<res.Data[i].studentData.length;j++){
							/*for(var r=0;r<res.Data[i].studentData[j].stuName;r++){*/
								var stuInfo={name:res.Data[i].studentData[j].stuName,scode:res.Data[i].studentData[j].stuCode};
								stuArr.push(stuInfo);
								/*stuArr.push(res.Data[i].studentData[j].stuName);*/
							/*}*/
							/*console.log(stuArr);*/
							 
							/*console.log(stuArr);*/
							/* stu+="<dl><dt>"+res.Data[i].studentData[j].stuName+"</dt><dd>"+res.Data[i].studentData[j].stuName+"</dd></dl>";*/
							
						}
						console.log(stuArr);
						
						var colId="name";
						  //对json进行升序排序函数 
						  var asc = function(x,y) 
						  { 
						  	return x[colId].localeCompare(y[colId])
						   /* return (x[colId] > y[colId]) ? 1 : -1 */
						  } 
						  
						 /* document.write("按age进行升序排序：<br>"); */
						  stuArr.sort(asc); //升序排序 
						  /*document.write(JSON.stringify(arr2));*/ 
						  for(var r=0;r<stuArr.length;r++){
								stu+="<dl><dt>"+stuArr[r].name+"</dt><dd>"+stuArr[r].name+"</dd><dd style=display:none>"+stuArr[r].scode+"</dd><dd style=display:none>"+flag+"</dd></dl>";
							} 
						
						/*stuArr.sort(function(a,b){ 
						    return a.localeCompare(b); 
						}); 
						console.log(stuArr);
						for(var r=0;r<stuArr.length;r++){
							stu+="<dl><dt>"+stuArr[r]+"</dt><dd>"+stuArr[r]+"</dd></dl>";
						}*/
						
						$(".scoreList").html(stu);
						for(var h=0;h<res.Data[i].LessonData.length;h++){
							str1+="<li>第"+res.Data[i].LessonData[h].lessonNo+"课次"+res.Data[i].LessonData[h].sectTime+"</li>";
						}
						$(".classNumTime ul").html(str1);
					}
					
				}
				for(var i = 0;i<$(".scoreList dl").length;i++){
						var ddStr = $(".scoreList dd").eq(i);
						var dtStr=$(".scoreList dt").eq(i);
						/*console.log(str.html());*/
						var ddstrLen = lenStat(ddStr);
						/*console.log(strLen);*/
						if(lenStat(ddStr)>8){
							ddStr.css("font-size","17px");
						}
						if(lenStat(dtStr)>4){
							dtStr.html().substring(lenStat(dtStr)-5,lenStat(dtStr)-1);
							dtStr.html(dtStr.html().substring(lenStat(dtStr)-5,lenStat(dtStr)-1));
						}
					}
			})
			$(".classNumTime ul").on("click","li",function(){
				$(this).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
				$(".classTime").html($(this).html());
			})
			$(".scoreType ul").on("click","li",function(){
				$(this).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
				$(".st").html($(this).html());
			})
			
			/*var scoreArr = [];*/
			$(".scoreList").on("click","dl",function(){
					var name = $(this).find("dd").html();
					$(".scoreTitle span").html(name);
					var totalScore = parseInt($(".totalScore").val());
				if($(".scoreTitle input").val()!=""&&parseInt($(".scoreTitle input").val())<=totalScore){
					/*var that = $(this);
					var other = $(this).siblings("dl");*/
					$(this).find("dt").html($(".scoreTitle input").val());
					/*scoreArr.push($(".scoreTitle input").val());*/
					/*console.log(scoreArr);*/
					/*$(".scoreTitle input").val("");*/
				}
				
			})
		}
	});
	//点击input
	$(".totalScore").focus(function(){
		$(".fen").show();
	})
	/*$(".totalScore").blur(function(){
		$(".fen").hide();
	})*/
	//保存
	var student=[];
	$(".succ").click(function(){
		for(var i =0;i<$(".scoreList dl").length;i++){
			var studentinfo={
				"studentname":$(".scoreList dl").eq(i).find("dd").eq(0).html(),
				"studentcode":$(".scoreList dl").eq(i).find("dd").eq(1).html(),
				"invalid":$(".scoreList dl").eq(i).find("dd").eq(2).html(),
				"realGrade":parseInt($(".scoreList dl").eq(i).find("dt").html())
			}
			student.push(studentinfo);
		}
		console.log($(".classrome").html());
		console.log($(".class").html());
		console.log($(".classTime").html());
		console.log($(".totalScore").html());
		console.log(student);
		var classNo=$(".classTime").html().substring(1,2);
		var classT=$(".classTime").html().substring(4,22);
		var saveInfo={
			"email":"caoxuefeng@xdf.cn",
			"teacherName":"曹雪峰",
			"gradeType":$(".st").html(),
			"className":$(".classrome").html(),
			"classCode":$(".class").html(),
			"lessonNo":classNo,
			"lessonTime":classT,
			"fullMarks":$(".totalScore").val(),
			"student":student
		}
		if($(".st").html()=="入门侧"){
			saveInfo.gradeType=1;
		}else{
			saveInfo.gradeType=2;
		}
		$.ajax({
			type:"post",
			url:"http://dt.staff.xdf.cn/xdfdtmanager/teacherData/addTeacherAnalysis.do",
			async:true,
			data:JSON.stringify(saveInfo),
			success:function(res){
				console.log(res)
			}
		});
	})
	$(".scoreType").hide();
	$(".chooseClass").hide();
	$(".classNumTime").hide();
	$(".mask").hide();
	$(".choose li").not("li:last-child").click(function(){
		
		$(".mask").show();
		$("body,html").css({"width": "100%","height": "100%","overflow": "hidden"})
		if($(this).index()==0){
			$(".scoreType").show()
			$(".scoreType").css("animation","move 0.5s linear");
			$(".scoreType").css("bottom","0px");
			$(".chooseClass").hide();
			/*$(".chooseClass").css("animation","");
			$(".chooseClass").css("bottom","-440px");*/
			$(".classNumTime").hide();
			/*$(".classNumTime").css("animation","");
			$(".classNumTime").css("bottom","-440px");*/
		}else if($(this).index()==1){
			$(".chooseClass").show();
			$(".chooseClass").css("animation","move 0.5s linear");
			$(".chooseClass").css("bottom","0px");
			$(".classNumTime").hide();
			/*$(".classNumTime").css("animation","");
			$(".classNumTime").css("bottom","-440px");*/
			$(".scoreType").hide();
			/*$(".scoreType").css("animation","");
			$(".scoreType").css("bottom","-440px");*/
			
		}else if($(this).index()==2){
			$(".classNumTime").show();
			$(".classNumTime").css("animation","move 0.5s linear");
			$(".classNumTime").css("bottom","0px");
			$(".chooseClass").hide();
			/*$(".chooseClass").css("animation","");
			$(".chooseClass").css("bottom","-440px");*/
			$(".scoreType").hide();
			/*$(".scoreType").css("animation","");
			$(".scoreType").css("bottom","-440px");*/
		}
		
	})
	/*$(".totalScore").focus(function(){
		if(isNaN($(".totalScore").val())){
			$(".totalScore").attr("disabled","disabled");
		}
	})*/
	
	$(".chooseBtn").click(function(){
		$(".mask").hide();
		$("body,html").css({"width": "","height": "","overflow": ""})
		$(".chooseClass").hide();
		$(".chooseClass").css("animation","");
		$(".chooseClass").css("bottom","-440px");
	})
	$(".confirmBtn").click(function(){
		$(".mask").hide();
		$("body,html").css({"width": "","height": "","overflow": ""});
		$(".classNumTime").hide();
		$(".classNumTime").css("animation","");
		$(".classNumTime").css("bottom","-440px");
	})
	$(".scoreTypeBtn").click(function(){
		$(".mask").hide();
		$("body,html").css({"width": "","height": "","overflow": ""})
		$(".scoreType").hide();
		$(".scoreType").css("animation","");
		$(".scoreType").css("bottom","-440px");
	})
	//选中
	/*$(".chooseClass ul").on("click","li",function(){
		alert(1);
		alert($(this));
		$(this).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
		$(".classrome").html($(this).html());
	})*/
	/*$(".chooseClass li").click(function(){
		$(this).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
		$(".classrome").html($(this).html());
	})*/
	/*$(".classNumTime li").click(function(){
		$(this).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
		$(".classTime").html($(this).html());
	})
	$(".scoreType li").click(function(){
		$(this).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
		$(".st").html($(this).html());
	})*/
	/*var scoreArr = [];
	$(".scoreList dl").click(function(){
			var name = $(this).find("dd").html();
			$(".scoreTitle span").html(name);
			var totalScore = parseInt($(".totalScore").val());
		if($(".scoreTitle input").val()!=""&&parseInt($(".scoreTitle input").val())<=totalScore){
			
			$(this).find("dt").html($(".scoreTitle input").val());
			scoreArr.push($(".scoreTitle input").val());
			console.log(scoreArr);
			
		}
		
	})*/
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
		if($(".classrome").html()==""){
		 	layer.open({
		        type: 1,
		        area: ['312px', '194px'],
		        shade:0,
		        title:'',
		        skin: '',
		        time:2000,
		        content:$(".classEmpty")
			})
		 }else if($(".classTime").html()==""){
		 	layer.open({
		        type: 1,
		        area: ['312px', '194px'],
		        shade:0,
		        title:'',
		        skin: '',
		        time:2000,
		        content:$(".classTimeEmpty")
			})
		 }else{
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
		 }
		
		
		 
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
	/*for(var i = 0;i<$(".scoreList dl").length;i++){
		var ddStr = $(".scoreList dd").eq(i);
		var dtStr=$(".scoreList dt").eq(i);
		
		var ddstrLen = lenStat(ddStr);
		
		if(lenStat(ddStr)>8){
			str.css("font-size","17px");
		}
		if(lenStat(dtStr)>4){
			dtStr.html().substring(lenStat(dtStr)-5,lenStat(dtStr)-1);
			dtStr.html(dtStr.html().substring(lenStat(dtStr)-5,lenStat(dtStr)-1));
		}
	}*/
	
	
})
