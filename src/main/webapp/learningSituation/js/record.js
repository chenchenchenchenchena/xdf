$(function () {
	var layer1;
    var layer2;
    var layer3;
    var layer4;
    var flag = 1;
    $(".txt").hide();
    $(".txtDiv").hide();
    sessionStorage.teacherEmail="caoxuefeng@xdf.cn";
    sessionStorage.teacherId="TC41";
    sessionStorage.schoolId="73";
    sessionStorage.teacherName="曹雪峰";
    
    
    //录入数据
    var inputData = {"sCode": sessionStorage.teacherId, "email": sessionStorage.teacherEmail,"schoolId":sessionStorage.schoolId};
    ajax_S(url.t_record,inputData,recordData);
    function recordData(e){
    	if(e.result){
        	if(e.resultMessage=="false"){
            	layer.msg("该班级已结课");
            	return false;
            }
        	for (var i = 0; i < e.Data.length; i++) {
                var str = "<li>" + e.Data[i].className + "</li><span style=display:none class=classCode>" + e.Data[i].classCode + "</span>";
                $(".chooseClass ul").append(str);
            }

            for (var i = 0; i < e.studycase_grade_type.length; i++) {
                var str2 = "<li>" + e.studycase_grade_type[i].tName + "</li>";
                $(".scoreType ul").append(str2);
            }
        }
            
           /* console.log(inputData)*/
           
        $(".chooseClass ul").on("click", "li", function () {
            $(".txt").show();
            $(".txtDiv").show();
            var stu = "";
            var stuArr = [];
            var str1 = "";
            $(this).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
            $(".classrome").html($(this).html());
            var spanObj = $(this).next();
            $(".class").html(spanObj.html());
            //课次及时间
            for (var i = 0; i < e.Data.length; i++) {
                if ($(".classrome").html() == e.Data[i].className) {
                    for (var j = 0; j < e.Data[i].studentData.length; j++) {
                        var stuInfo = {name: e.Data[i].studentData[j].stuName, scode: e.Data[i].studentData[j].stuCode};
                        stuArr.push(stuInfo);

                    }
                   /* console.log(stuArr);*/

                    var colId = "name";
                    //对json进行升序排序函数
                    var asc = function (x, y) {
                        return x[colId].localeCompare(y[colId])
                    }

                    stuArr.sort(asc); //升序排序
                    for (var r = 0; r < stuArr.length; r++) {
                        stu += "<dl><dt>" + stuArr[r].name + "</dt><dd>" + stuArr[r].name + "</dd><dd style=display:none class=code>" + stuArr[r].scode + "</dd><dd style=display:none class=flag>" + flag + "</dd></dl>";
                    }


                    $(".scoreList").html(stu);
                    for (var h = 0; h < e.Data[i].LessonData.length; h++) {
                        str1 += "<li>第" + e.Data[i].LessonData[h].lessonNo + "课次" + e.Data[i].LessonData[h].sectTime + "</li>";
                    }
                    $(".classNumTime ul").html(str1);
                }

            }
            for (var i = 0; i < $(".scoreList dl").length; i++) {
                var ddStr = $(".scoreList dd").eq(i);
                var dtStr = $(".scoreList dt").eq(i);
                /*console.log(str.html());*/
                var ddstrLen = lenStat(ddStr);
                /*console.log(strLen);*/
                if (lenStat(ddStr) > 8) {
                    ddStr.css("font-size", "17px");
                }
                if (lenStat(dtStr) > 4) {
                    dtStr.html().substring(lenStat(dtStr) - 5, lenStat(dtStr) - 1);
                    dtStr.html(dtStr.html().substring(lenStat(dtStr) - 5, lenStat(dtStr) - 1));
                }
            }
        })
            
            
        $(".classNumTime ul").on("click", "li", function () {
            $(this).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
            $(".classTime").html($(this).html());
        })
        $(".scoreType ul").on("click", "li", function () {
            $(this).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
            $(".st").html($(this).html());
        })
        
		
		//点击录成绩
		
		$(".scoreList").on("click", "dl", function () {
            var name = $(this).find("dd").html();
            $(".scoreTitle span").html(name);
            var totalScore = parseInt($(".totalScore").val());
            if ($(".scoreTitle input").val() != "" && parseInt($(".scoreTitle input").val()) <= totalScore) {
                $(this).find("dt").html($(".scoreTitle input").val());
            }

        })
    }
 
    
    
    $(".scoreTitle input").blur(function(){
    	if(parseInt($(".scoreTitle input").val()) > parseInt($(".totalScore").val())){
	    	$(".scoreTitle input").val("");
	    }
    })
    
    
    
    //保存
    /*var student = [];*/
    $(".subtn").click(function () {
        if($(".classrome").html()==""){
	         layer.open({
		         type: 1,
		         area: ['312px', '194px'],
		         shade:0,
		         title:'',
		         skin: '',
		         time:3000,
		         content:$(".classEmpty")
	         })
         }else if($(".classTime").html()==""){
	         layer.open({
		         type: 1,
		         area: ['312px', '194px'],
		         shade:0,
		         title:'',
		         skin: '',
		         time:3000,
		         content:$(".classTimeEmpty")
	         })
         }else{
	        for(var i = 0;i<$(".scoreList dt").length;i++){
	        /*alert($(".scoreList dl dt").eq(i).html()=="")*/
		        if(isNaN(parseInt($(".scoreList dl dt").eq(i).html()))){
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
	        
         	layer2=layer.open({
		         type: 1,
		         area: ['548px', '345px'],
		         shade:[0.2,'#000'],
		         title:'',
		         skin: '',
		         content:$(".recordSub")
	         })
		         	 
		      
	    }
        /*console.log(student);
        console.log($(".classrome").html());
        console.log($(".class").html());
        console.log($(".classTime").html());
        console.log($(".totalScore").html());
        console.log(student);*/
       
    })
    
    
    function saveData(){
    	 
    	var student = [];
    	for (var i = 0; i < $(".scoreList dl").length; i++) {
            if (!isNaN(parseInt($(".scoreList dl").eq(i).find("dt").html()))) {
                var studentinfo = {
                    "studentName": $(".scoreList dl").eq(i).find("dd").eq(0).html(),
                    "studentNo": $(".scoreList dl").eq(i).find("dd").eq(1).html(),
                    "flag": $(".scoreList dl").eq(i).find("dd").eq(2).html(),
                    "realGrade": parseInt($(".scoreList dl").eq(i).find("dt").html())
                }
                 student.push(studentinfo);
            }

           
        }
    	console.log(student);
    	var classNo = $(".classTime").html().substring(1,2);
        var classT = $(".classTime").html().substring(4,22);
        var saveInfo = {
            "email": sessionStorage.teacherEmail,
            "teacherName": sessionStorage.teacherName,
            "gradeType": $(".st").html(),
            "className": $(".classrome").html(),
            "classCode": $(".class").html(),
            "lessonNo": classNo,
            "lessonTime": classT,
            "fullMarks": $(".totalScore").val(),
            "schoolId":sessionStorage.schoolId,
            "student": student
        }
        if ($(".st").html() == "入门测") {
            saveInfo.gradeType = 1;
        } else {
            saveInfo.gradeType = 2;
        }
       
       ajax_S(url.t_save,saveInfo,saveAjax)
        
    }
    
    function saveAjax(e){
    	console.log(e)
    	var load = layer.load(0,{shade: [0.8, '#000']});
	   
	    if(e.result){
	    	layer.close(load);
	         layer3 = layer.open({
	             type: 1,
	             area: ['548px', '345px'],
	             shade:[0.2,'#000'],
	             title:'',
	             skin: '',
	             time:2000,
	             content:$(".recordSucc")
	         })
	     }else{
	   		layer.close(load);
	     	layer4 = layer.open({
	             type: 1,
	             area: ['548px', '345px'],
	             shade:[0.2,'#000'],
	             title:'',
	             skin: '',
	             content:$(".subFail")
	         })
	     }
    }
    
     $(".recordSub button").eq(0).click(function () {
        layer.close(layer2);
    })
     $(".recordSub button").eq(1).click(function(){
     	layer.close(layer2);
     	saveData();
     })
     
     $(".subFail button").eq(0).click(function(){
    	layer.close(layer4);
    })
    $(".subFail button").eq(1).click(function(){
    	layer.close(layer4);
    	saveData();
    })
    
    $(".recordSucc button").click(function(){
     	layer.close(layer3);
     })
    $(".noRecord button").eq(0).click(function(){
     	layer.close(layer1);
     })
     $(".noRecord button").eq(1).click(function(){
     	layer.close(layer1);
     	saveData();
     }) 
    
    
    
    $(".scoreType").hide();
    $(".chooseClass").hide();
    $(".classNumTime").hide();
    $(".mask").hide();
    $(".choose li").not("li:last-child").click(function () {

        $(".mask").show();
        $("body,html").css({"width": "100%", "height": "100%", "overflow": "hidden"})
        if ($(this).index() == 0) {
            $(".scoreType").show()
            $(".scoreType").css("animation", "move 0.5s linear");
            $(".scoreType").css("bottom", "0px");
            $(".chooseClass").hide();
            $(".classNumTime").hide();
        } else if ($(this).index() == 1) {
            $(".chooseClass").show();
            $(".chooseClass").css("animation", "move 0.5s linear");
            $(".chooseClass").css("bottom", "0px");
            $(".classNumTime").hide();
            $(".scoreType").hide();

        } else if ($(this).index() == 2) {
            $(".classNumTime").show();
            $(".classNumTime").css("animation", "move 0.5s linear");
            $(".classNumTime").css("bottom", "0px");
            $(".chooseClass").hide();
            $(".scoreType").hide();
        }

    })
    /*$(".totalScore").focus(function(){
     if(isNaN($(".totalScore").val())){
     $(".totalScore").attr("disabled","disabled");
     }
     })*/

    $(".chooseBtn").click(function () {
        $(".mask").hide();
        $("body,html").css({"width": "", "height": "", "overflow": ""})
        $(".chooseClass").hide();
        $(".chooseClass").css("animation", "");
        $(".chooseClass").css("bottom", "-440px");
    })
    $(".confirmBtn").click(function () {
        $(".mask").hide();
        $("body,html").css({"width": "", "height": "", "overflow": ""});
        $(".classNumTime").hide();
        $(".classNumTime").css("animation", "");
        $(".classNumTime").css("bottom", "-440px");
    })
    $(".scoreTypeBtn").click(function () {
        $(".mask").hide();
        $("body,html").css({"width": "", "height": "", "overflow": ""})
        $(".scoreType").hide();
        $(".scoreType").css("animation", "");
        $(".scoreType").css("bottom", "-440px");
    })


    //查询数据
    $(".confirmBtn").click(function(){
    	query();
    	
    })
    $(".scoreTypeBtn").click(function(){
    	query();
    	
    })
    $(".chooseBtn").click(function(){
    	query();
    	
    })
    function query(){
  		/*console.log($(".st").html());
	  	console.log($(".classTime").html());
	  	console.log($(".class").html())*/
	  	if($(".st").html()&&$(".classTime").html()&&$(".class").html()&&$(".scoreList").children()){
	    		
			    var queryData={
			    	"teacherEmail":sessionStorage.teacherEmail,
			    	"classCode":$(".class").html(),
			    	"tCode":$(".st").html(),
			    	"schoolId":sessionStorage.schoolId,
			    	"lessonNo":$(".classTime").html().substring(1,2)
			    };
			    console.log(queryData.lessonNo)
			     console.log(queryData.classCode)
			     if ($(".st").html() == "入门测") {
			        queryData.tCode = 1;
			    } else {
			        queryData.tCode = 2;
			    }
			    ajaxRequest("post",url.t_modify,queryData,queryAjax);
			    
			    /*$.ajax({
			    	type:"post",
			    	url:"http://dt.staff.xdf.cn/teacherAnalysis/teacherqueryLitimesdtGrade.do",
			    	async:true,
			    	dataType:"json",
			    	data:queryData,
			    	success:function(res){
			    		console.log(res);
			    		
		    			
			    		
			    	}
			    });*/
			    
			 } 
			
    }
    function queryAjax(msg){
    	if(msg.code=="200"){
			alert("查询数据");
			console.log(msg);
			if(msg.data.length==0){
				$(".totalScore").val("");
				resetData();
			}else{
				resetData();
				for(var j=0;j<$(".scoreList dl").length;j++){
					
					for(var i=0;i<msg.data.length;i++){
						/*console.log(res.data[0].fullmarks);*/
						$(".totalScore").val(msg.data[0].fullmarks);
						/*alert($(".scoreList dl").eq(j).find("dd").eq(2).html());*/
						if(msg.data[i].studentNo==$(".scoreList dl").eq(j).find(".code").html()){
							console.log("sssss")
							$(".scoreList dl").eq(j).find("dt").html(msg.data[i].realgrade);
						}
					}
				}
				 changeData();
			}
			
			/* changeData();*/
		}
		
		/*if(msg.data.length==0){
			$(".totalScore").val("");
		}*/
    }
    
    
    //重置数据
    function resetData(){
    	for(var j=0;j<$(".scoreList dl").length;j++){
            var ddStr = $(".scoreList dl").eq(j).find("dd").eq(0);
            var dtStr = $(".scoreList dl").eq(j).find("dt");
            /*console.log(ddStr.html());
            console.log(dtStr.html());*/
            /*console.log(str.html());*/
            var ddstrLen = lenStat(ddStr);
            /*console.log(strLen);*/
            if (lenStat(ddStr) > 8) {
                ddStr.css("font-size", "17px");
            }
            if (lenStat(ddStr) > 4) {
               /* dtStr.html().substring(lenStat(dtStr) - 5, lenStat(dtStr) - 1);*/
                dtStr.html(ddStr.html().substring(lenStat(ddStr) - 5, lenStat(ddStr) - 1));
            }else{
            	 dtStr.html(ddStr.html());
            }
    
		}
    }
    //0-数据不动   1-添加   2-修改
    
    //修改数据
    function changeData(){
    	/*$(".scoreTitle input").keyup(function(){*/
    		for(var i=0;i<$(".scoreList dl").length;i++){
    			$(".scoreList dl").find(".flag").html(0);
    			if(isNaN(parseInt($(".scoreList dl").eq(i).find("dt").html()))){
    				$(".scoreList dl").eq(i).attr("mark","add");
    			}else{
    				$(".scoreList dl").eq(i).attr("mark","update");
    			}
    			
    		}
    		console.log($(".scoreTitle input").val());
	    	/*if($(".scoreTitle input").val()){*/
	    		console.log(222);
	    		$(".scoreList dl").click(function(){
		    		/*if(isNaN($(this).find("dt").html())){
		    			console.log(333)
		    			$(this).find(".flag").html(1);
		    		}else{
		    			$(this).find(".flag").html(2);
		    		}*/
		    		if($(this).attr("mark")=="add"){
		    			console.log(333)
		    			$(this).find(".flag").html(1);
		    		}else if($(this).attr("mark")=="update"){
		    			$(this).find(".flag").html(2);
		    		}
			    })
	    		
	    	/*}*/
    	/*})*/
    }
    
    
    //判断中文长度
    function isChinese(str) {  //判断是不是中文
        var reCh = /[u00-uff]/;
        return !reCh.test(str);
    }

    function lenStat(target) {
        var strlen = 0; //初始定义长度为0
        var txtval = $.trim(target.html());
        for (var i = 0; i < txtval.length; i++) {
            if (isChinese(txtval.charAt(i)) == true) {
                strlen = strlen + 2;//中文为2个字符
            } else {
                strlen = strlen + 1;//英文一个字符
            }
        }
        /*strlen=Math.ceil(strlen/2);*///中英文相加除2取整数
        return strlen;
    }


})
