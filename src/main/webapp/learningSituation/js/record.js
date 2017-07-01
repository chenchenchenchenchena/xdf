$(function () {
    $(".txt").hide();
    $(".txtDiv").hide();
    localStorage.teacherEmail="caoxuefeng@xdf.cn";
    localStorage.teacherId="TC41";
    localStorage.schoolId="73";
    localStorage.teacherName="曹雪峰";
    
    
    //录入数据
    var inputData = {"sCode": localStorage.teacherId, "email": localStorage.teacherEmail};
    $.ajax({
        type: "post",
        url: "http://dt.staff.xdf.cn/xdfdtmanager/teacherData/queryTeacherLesson.do",
        async: true,
        dataType: "json",
        data: JSON.stringify(inputData),
        success: function (res) {
            /*console.log(JSON.stringify(res))*/
            console.log(res);
            console.log(inputData)
            for (var i = 0; i < res.Data.length; i++) {
                var str = "<li>" + res.Data[i].className + "</li><span style=display:none class=classCode>" + res.Data[i].classCode + "</span>";
                $(".chooseClass ul").append(str);
            }

            for (var i = 0; i < res.studycase_grade_type.length; i++) {
                var str2 = "<li>" + res.studycase_grade_type[i].tName + "</li>";
                $(".scoreType ul").append(str2);
            }
            $(".chooseClass ul").on("click", "li", function () {
                /*alert(1);
                 alert($(this));*/
                $(".txt").show();
                $(".txtDiv").show();
                var stu = "";
                var stuArr = [];
                var str1 = "";
                var flag = 1;
                /*alert($(this).index());*/
                $(this).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
                $(".classrome").html($(this).html());
                var spanObj = $(this).next();
                /*console.log(spanObj.html());*/
                $(".class").html(spanObj.html());
                //课次及时间
                for (var i = 0; i < res.Data.length; i++) {
                    if ($(".classrome").html() == res.Data[i].className) {
                        for (var j = 0; j < res.Data[i].studentData.length; j++) {
                            var stuInfo = {name: res.Data[i].studentData[j].stuName, scode: res.Data[i].studentData[j].stuCode};
                            stuArr.push(stuInfo);

                        }
                        console.log(stuArr);

                        var colId = "name";
                        //对json进行升序排序函数
                        var asc = function (x, y) {
                            return x[colId].localeCompare(y[colId])
                            /* return (x[colId] > y[colId]) ? 1 : -1 */
                        }

                        stuArr.sort(asc); //升序排序
                        for (var r = 0; r < stuArr.length; r++) {
                            stu += "<dl><dt>" + stuArr[r].name + "</dt><dd>" + stuArr[r].name + "</dd><dd style=display:none class=code>" + stuArr[r].scode + "</dd><dd style=display:none class=flag>" + flag + "</dd></dl>";
                        }


                        $(".scoreList").html(stu);
                        for (var h = 0; h < res.Data[i].LessonData.length; h++) {
                            str1 += "<li>第" + res.Data[i].LessonData[h].lessonNo + "课次" + res.Data[i].LessonData[h].sectTime + "</li>";
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
			
			//录成绩
			
			$(".scoreList").on("click", "dl", function () {
                var name = $(this).find("dd").html();
                $(".scoreTitle span").html(name);
                var totalScore = parseInt($(".totalScore").val());
                if ($(".scoreTitle input").val() != "" && parseInt($(".scoreTitle input").val()) <= totalScore) {
                    $(this).find("dt").html($(".scoreTitle input").val());
                }

            })
        }
    });
    //点击input
    $(".totalScore").focus(function () {
        $(".fen").show();
    })
    /*$(".totalScore").blur(function(){
     $(".fen").hide();
     })*/
    
    
    
    
    //保存
    /*var student = [];*/
    $(".subtn").click(function () {
        
        /*console.log(student);
        console.log($(".classrome").html());
        console.log($(".class").html());
        console.log($(".classTime").html());
        console.log($(".totalScore").html());
        console.log(student);*/
        saveData();
    })
    function saveData(){
    	var student = [];
    	for (var i = 0; i < $(".scoreList dl").length; i++) {
            if (!isNaN(parseInt($(".scoreList dl").eq(i).find("dt").html()))) {
                var studentinfo = {
                    "studentName": $(".scoreList dl").eq(i).find("dd").eq(0).html(),
                    "studentNo": $(".scoreList dl").eq(i).find("dd").eq(1).html(),
                    "invalid": $(".scoreList dl").eq(i).find("dd").eq(2).html(),
                    "realGrade": parseInt($(".scoreList dl").eq(i).find("dt").html())
                }
            }

            student.push(studentinfo);
        }
    	console.log(student);
    	var classNo = $(".classTime").html().substring(1,2);
        var classT = $(".classTime").html().substring(4,22);
        var saveInfo = {
            "email": localStorage.teacherEmail,
            "teacherName": localStorage.teacherName,
            "gradeType": $(".st").html(),
            "className": $(".classrome").html(),
            "classCode": $(".class").html(),
            "lessonNo": classNo,
            "lessonTime": classT,
            "fullMarks": $(".totalScore").val(),
            "student": student
        }
        if ($(".st").html() == "入门测") {
            saveInfo.gradeType = 1;
        } else {
            saveInfo.gradeType = 2;
        }
        $.ajax({
            type: "post",
            url: "http://dt.staff.xdf.cn/xdfdtmanager/teacherData/addTeacherAnalysis.do",
            async: true,
            data: JSON.stringify(saveInfo),
            success: function (res) {
                console.log(res)
                if(res.result){
	                 layer3 = layer.open({
	                 type: 1,
	                 area: ['548px', '345px'],
	                 shade:[0.2,'#000'],
	                 title:'',
	                 skin: '',
	                 content:$(".recordSucc")
	                 })
                 }
               
            }
        });
    }
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


    var layer1;
    var layer2;
    var layer3;
    $(".subtn").click(function () {
        
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
    $(".recordSub button").eq(1).click(function () {
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
     
    
    
    //查询数据
    $(".confirmBtn").click(function(){
    	query();
    	changeData();
    })
    $(".scoreTypeBtn").click(function(){
    	query();
    	changeData();
    })
    $(".chooseBtn").click(function(){
    	query();
    	changeData();
    })
    function query(){
  		console.log($(".st").html());
	  	console.log($(".classTime").html());
	  	console.log($(".class").html())
	  	if($(".st").html()&&$(".classTime").html()&&$(".class").html()&&$(".scoreList").children()){
	    		
			    var queryData={
			    	"teacherEmail":localStorage.teacherEmail,
			    	"classCode":$(".class").html(),
			    	"tCode":$(".st").html(),
			    	"schoolId":localStorage.schoolId,
			    	"lessonNo":$(".classTime").html().substring(1,2)
			    };
			    console.log(queryData.lessonNo)
			     console.log(queryData.classCode)
			     if ($(".st").html() == "入门测") {
			        queryData.tCode = 1;
			    } else {
			        queryData.tCode = 2;
			    }
			    $.ajax({
			    	type:"post",
			    	url:"http://10.73.32.97:8080/xdfdtmanager/teacherAnalysis/teacherqueryLitimesdtGrade.do",
			    	async:true,
			    	dataType:"json",
			    	data:queryData,
			    	success:function(res){
			    		console.log(res);
			    		
		    			if(res.code=="200"){
		    				alert(111);
		    				for(var j=0;j<$(".scoreList dl").length;j++){
				    			for(var i=0;i<res.data.length;i++){
				    				/*console.log(res.data[0].fullmarks);*/
				    				$(".totalScore").val(res.data[0].fullmarks);
				    				/*alert($(".scoreList dl").eq(j).find("dd").eq(2).html());*/
				    				if(res.data[i].studentNo==$(".scoreList dl").eq(j).find(".code").html()){
				    					console.log("sssss")
				    					$(".scoreList dl").eq(j).find("dt").html(res.data[i].realgrade);
				    				}
				    			}
			    			}
		    			}
			    		
			    		if(res.data.length==0){
			    			$(".totalScore").val("");
			    		}
			    		
			    	}
			    });
			 } 
    }
    
    
    //修改数据
    function changeData(){
    	$(".scoreTitle input").keyup(function(){
    		console.log($(".scoreTitle input").val());
	    	if($(".scoreTitle input").val()){
	    		console.log(222);
	    		$(".scoreList dl").click(function(){
		    		if(isNaN($(this).find("dt").html())){
		    			console.log(333)
		    			$(this).find(".flag").html(3);
		    		}else{
		    			$(this).find(".flag").html(2);
		    		}
			    	
			    })
	    	}
    	})
    	
    	$(".subtn").click(function(){
    		saveData();
    	})
    	
	    /*var changeNum={"email": "caoxuefeng@xdf.cn"};
	    $.ajax({
	    	type:"post",
	    	url:"http://10.73.33.63:8080/teacherData/updateTeacherAnalysis.do",
	    	async:true,
	    	data:JSON.stringify(changeNum),
	    	dataType:"json",
	    	success:function(res){
	    		console.log(res);
	    	}
	    });*/
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
