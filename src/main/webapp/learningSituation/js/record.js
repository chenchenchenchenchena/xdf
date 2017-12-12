$(function () {
    var layer1;
    var layer2;
    var layer3;
    var layer4;
    var layer5;
    var layer6;
    var load;
    var flag = 1;
    var student = [];
    var stuQuery=[];
    var pushStuent=[];
    var stuOpenId=[];
    var AppId = appId;
    var SecreT  = secreT;
    var urlPush;
    var start;
    var end;
    var that;
    $('.load_t').show();

    /*sessionStorage.openid = 'ofZfFwgizCmzR5XXMQtC5Wx5wZrA';*/
    // if(!sessionStorage.openid){
        // wechatCode(location.href)
    // }
    if(getRequest('state').state=='JT'||sessionStorage.signal){
        urlPush="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx67e16b7247bde1a8&redirect_uri=http://dt.xdf.cn/xdfdthome/learningSituation/report_t.html&response_type=code&scope=snsapi_userinfo&state=JT&connect_redirect=1#wechat_redirect";
    }else{
        urlPush="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxab29a3e2000b8d2a&redirect_uri=http://dt.xdf.cn/xdfdthome/learningSituation/report_t.html&response_type=code&scope=snsapi_userinfo&state=IQ&connect_redirect=1#wechat_redirect";
    }
    // localStorage.terEmail="caoxuefeng@xdf.cn";  //
    // sessionStorage.teacherId="TC41"; //
    // sessionStorage.schoolId="73";   //
    // sessionStorage.teacherName="曹雪峰";  //
    // sessionStorage.stuNumber = 'SS1508';  //
    /*localStorage.terEmail="hanqifan@xdf.cn";
   localStorage.teacherId="TC23";
   localStorage.schoolId="73";
   localStorage.teacherName="韩启凡";*/


    $(".txt").hide();
    $(".up").hide();
    $(".txtDiv").hide();
    // var firstLoad = layer.load();
    //录入数据
    var inputData = { "email": localStorage.terEmail,"schoolId":localStorage.schoolId};
    ajax_S(url.t_record,inputData,recordData);
    function recordData(e){
        if(e.Data==0){
            $('.load_t').hide();
            layer.msg(e.message)
        }
        if(e.result){
            console.log(e);
            // layer.close(firstLoad);
            if(e.resultMessage=="false"){
                layer.msg("该班级已结课");
                return false;
            }
            for (var i = 0; i < e.studycase_grade_type.length; i++) {
                var str2 = "<li>" + e.studycase_grade_type[i].tName + "</li><span style=display:none class=typeCode>" +  e.studycase_grade_type[i].tCode + "</span>";
                $(".scoreType ul").append(str2);
            }
            if(e.Data!=undefined&&e.Data.length>0){
                for (var i = 0; i < e.Data.length; i++) {
                    var beginDate = e.Data[i].beginDate.split(" ")[0];
                    var endDate = e.Data[i].endDate.split(" ")[0];
                    var master;
                    if(e.Data[i].masterTeacherName == undefined){
                        master = "";
                    }else {
                        master = e.Data[i].masterTeacherName;
                    }
                    var sMouth=e.Data[i].beginDate.split(" ")[0].split("-")[1];
                    var sDay=e.Data[i].beginDate.split(" ")[0].split("-")[2];
                    var eMouth=e.Data[i].endDate.split(" ")[0].split("-")[1];
                    var eDay=e.Data[i].endDate.split(" ")[0].split("-")[2];
                    var str = "<li data-beginDate='"+beginDate+"' data-endDate='"+endDate+"' data-master='"+master+"' style='white-space: nowrap;overflow-x:auto;'><span class='courseName'>" + e.Data[i].className + "</span>(<span class=classCode>" + e.Data[i].classCode + "</span>)</li><span class='courseTime' style='display: none'>("+sMouth+"."+sDay+"-"+eMouth+"."+eDay+")</span>";
                    $(".chooseClass ul").append(str);
                }
            }
        }else{
            // layer.close(firstLoad);
        }

        $(".chooseClass ul").on("click", "li", function () {
            $(".txt").show();
            $(".txtDiv").show();
            var stu = "";
            var stuArr = [];
            var str1 = "";
            $(this).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
            $(".classrome").html($(this).find(".courseName").html());
            $(".class").html($(this).find(".classCode").html());
            $(".classrome").attr('data-beginDate',$(this).attr('data-beginDate'));
            $(".classrome").attr('data-endDate',$(this).attr('data-endDate'));
            $(".classrome").attr('data-master',$(this).attr('data-master'));
            /*var spanObj = $(this).next();
            $(".class").html(spanObj.html());*/
            /*if($(".tCode").html()>0&&$(".tCode").html()<3){
                $(".classTime").html("");
            }*/
            /*$(".class").html($(".classCode").html());*/
            $(".scoreTitle input").val("");
            //班级及学生
            for (var i = 0; i < e.Data.length; i++) {
                if ($(".class").html() == e.Data[i].classCode) {
                    if(e.Data[i].studentData!=undefined&&e.Data[i].studentData.length>0){
                        for (var j = 0; j < e.Data[i].studentData.length; j++) {
                            var stuInfo = {name: e.Data[i].studentData[j].StudentName, scode: e.Data[i].studentData[j].StudentCode};
                            stuArr.push(stuInfo);
                        }
                        for (var r = 0; r < stuArr.length; r++) {
                            stu += "<dl><dt>" + stuArr[r].name + "</dt><dd>" + stuArr[r].name + "</dd><dd style=display:none class=code>" + stuArr[r].scode + "</dd><dd style=display:none class=flag>" + flag + "</dd></dl>";
                        }
                        if(e.Data[i].extraStudent != undefined && e.Data[i].extraStudent.length>0){
                            for(var h=0;h<e.Data[i].extraStudent.length;h++){
                                stu += "<dl><dt style='background: #ff6a6a'>" + e.Data[i].extraStudent[h].studentName + "</dt><dd>" + e.Data[i].extraStudent[h].studentName + "</dd><dd style=display:none class=code>" + e.Data[i].extraStudent[h].studentNo + "</dd><dd style=display:none class=flag>" + flag + "</dd></dl>";
                            }
                        }
                        var addDl="<div class='add'><p style='background: #c2c2c2;color:#fff;font-weight: 700;font-size: 28px;'>+</p><p>添加学生</p></div>"
                        $(".scoreList").html(stu);
                        $(".scoreList").append(addDl);
                    }else{
                        $(".scoreList").html("暂无学生成绩信息");
                    }
                    if(e.Data[i].LessonData.length==0){
                        str1="<span>暂无课次</span>";
                    }else{
                        for (var h = 0; h < e.Data[i].LessonData.length; h++) {
                            str1 += "<li>第<span class=lessonNo>" + e.Data[i].LessonData[h].lessonNo + "</span>课次(<span class=sectTime>" + e.Data[i].LessonData[h].sectTime + "</span>)</li>";
                        }
                    }
                    $(".classNumTime ul").html(str1);
                }

            }
            resetData();
        })

        //点击课次
        $(".classNumTime ul").on("click", "li", function () {
            $(this).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
            $(".classTime").html("第<span class=classnum>"+$(this).find(".lessonNo").html()+"</span>课次(<span class=lestime>"+$(this).find(".sectTime").html()+"</span>)");
            $(".scoreTitle input").val("");

        })
        //点击成绩类型
        $(".scoreType ul").on("click", "li", function () {
            $(this).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
            $(".st").html($(this).html());
            $(".scoreTitle input").val("");
            $(".totalScore").val(10);
            var typeObj = $(this).next();
            $(".tCode").html(typeObj.html());
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
        $('.load_t').hide();

    }
    //删除学生
    $(document).on("touchstart",".scoreList dl",function (event) {
        $(".scoreList dl").bind('contextmenu', function(e){
            e.preventDefault();
        });
        start = new Date().getTime();
    })
    $(document).on("touchend",".scoreList dl dt",function (event) {
        end = new Date().getTime();
        that=$(this);
        if((end-start)>1000){
            layer6=layer.open({
                type: 1,
                area: ['548px', '345px'],
                shade:[0.2,'#000'],
                title:'',
                skin: '',
                content:$(".deleteScore")
            })
        }
    })
    $(".deleteScore button").eq(0).click(function () {
        layer.close(layer6);
    })
    $(".deleteScore button").eq(1).click(function () {
        layer.close(layer6);
        var deName=that.siblings("dd").html();
        that.siblings(".flag").html(4);

        if (deName.length > 2) {
            var avater = deName.substring(deName.length - 2, deName.length);
            that.html(avater)
        } else {
            var avater = deName;
            that.html(avater);
        }
        var del={
            "studentNo":that.siblings(".code").html(),
            "flag":that.siblings(".flag").html()
        }
        student.push(del);
    })
    //添加学生信息
    /*var reNz=/^S{2}[0-9]{4}$/;*/
    var reNz=/^[a-zA-Z0-9]+$/;
    var reCh = /^[a-zA-Z\u4e00-\u9fa5]{2,}$/;
    var re=/^[a-zA-Z]+$/;
    var reZ=/^[\u4e00-\u9fa5]+$/;
    $(document).on('click','.add p',function () {
        $(".addMask").show();
        $("body,html").css({"width": "100%", "height": "100%", "overflow": "hidden"});
        $(".addStudent").show();
        $(".addName").val("");
        $(".addCode").val("");
    });
    $(".addBtn").click(function () {
        var judge=0;
        if(!reCh.test($(".addName").val())){
            layer.msg("请输入正确的姓名");
        }else if($(".addName").val()==""||$(".addName").val()==""&&$(".addCode").val()==""){
            layer.msg("姓名不能为空");
        }else if($(".addCode").val()==""){
            layer.msg("学号不能为空");
        }else if(!reNz.test($(".addCode").val())){
            layer.msg("请输入正确的学号");
        }else{
            for (var i = 0; i < $(".scoreList dl").length; i++) {
                if($(".addCode").val()==$(".scoreList dl").eq(i).find(".code").html()&&$(".addName").val()==$(".scoreList dl").eq(i).find("dd").eq(0).html()){
                    layer.msg("该学生已存在");
                    break;
                }
                if($(".addCode").val()==$(".scoreList dl").eq(i).find(".code").html()){
                    layer.msg("该学号已存在");
                    break;
                }
                judge++;
            }
            if(judge==$(".scoreList dl").length){
                layer5=layer.open({
                    type: 1,
                    area: ['545px', '400px'],
                    shade:0,
                    title:'',
                    skin: '',
                    content:$(".noDel")
                })
                $(".addStudent").hide();
            }
        }
    })
    $(".noDel button").eq(0).click(function () {
        layer.close(layer5);
        $(".addStudent").show();
    })
    $(".noDel button").eq(1).click(function () {
        $(this).attr('disabled', true);
        $(this).css('background', "#ccc");
        var addStu={
            "email":localStorage.terEmail,
            "schoolId":localStorage.schoolId,
            "classCode":$(".class").html(),
            "studentNo":$(".addCode").val(),
            "studentName":$(".addName").val()
        }
        ajax_S(url.t_addstu,addStu,addS);
    })

    $(".addCancel").click(function () {
        $(".addMask").hide();
        $(".addStudent").hide();
    });
    $(document).on('click','.layui-layer-close',function(){
        $('.addMask').hide();
    });
    function addS(e) {
        if(e.result){
            layer.close(layer5);
            $(".addMask").hide();
            $(".addStudent").hide();
            layer.msg(e.message);
            var addstudent = "<dl><dt style='background: #ff6a6a'>" + $(".addName").val() + "</dt><dd>" + $(".addName").val() + "</dd><dd style=display:none class=code>" + $(".addCode").val() + "</dd><dd style=display:none class=flag>" + flag + "</dd></dl>";
            $(".add").before(addstudent);
            var addlen=$(".scoreList dl").length;
            var ddStr = $(".scoreList dl").eq(addlen-1).find("dd").eq(0);
            var dtStr = $(".scoreList dl").eq(addlen-1).find("dt");
            var ddstrLen = lenStat(ddStr);
            if(re.test(ddStr.html())){
                if(lenStat(ddStr) >= 5){
                    if(lenStat(ddStr) >8){
                        ddStr.css("font-size", "20px");
                        ddStr.css("margin-top", "23px");
                    }
                    dtStr.html(ddStr.html().substr(- 4, 4));
                }else{
                    dtStr.html(ddStr.html());
                }

            }else if(reZ.test(ddStr.html())){
                if(lenStat(ddStr) >= 5){
                    if(lenStat(ddStr) > 8){
                        ddStr.css("font-size", "17px");
                        ddStr.css("margin-top", "23px");
                    }
                    dtStr.html(ddStr.html().substr(- 2, 2));
                }else{
                    dtStr.html(ddStr.html());
                }

            }else{
                if(reZ.test(ddStr.html().substr(-1, 1))){
                    if(reZ.test(ddStr.html().substr(-2, 1))){
                        dtStr.html(ddStr.html().substr(-2, 2));
                    }else{
                        dtStr.html(ddStr.html().substr(-3, 3));
                    }
                    if(lenStat(ddStr) > 8){
                        ddStr.css("font-size", "17px");
                        ddStr.css("margin-top", "23px");
                    }

                }else{
                    if(re.test(ddStr.html().substr(-1, 1))){
                        if(re.test(ddStr.html().substr(-2, 1))){
                            if(re.test(ddStr.html().substr(-3, 1))){
                                if(re.test(ddStr.html().substr(-4, 1))){
                                    dtStr.html(ddStr.html().substr(-4, 4));
                                }else{
                                    dtStr.html(ddStr.html().substr(-3, 3));
                                }
                            }else{
                                dtStr.html(ddStr.html().substr(-3, 3));
                            }
                        }else{
                            dtStr.html(ddStr.html().substr(-2, 2));
                        }
                    }
                    if(lenStat(ddStr) > 8){
                        ddStr.css("font-size", "17px");
                        ddStr.css("margin-top", "23px");
                    }
                }
            }
            $('.noDel button').eq(1).attr('disabled', false);
            $('.noDel button').eq(1).css('background', "#00b997");
        }else{
            layer.msg(e.message);
        }
    }
    //点击按钮收起功能
    var open=true;
    $(".txt span").click(function () {
        if(open){
            $(".scoreList").animate({"scrollTop":0},500);
            $(".choose").hide();
            $(".tab-title").css("margin-bottom","0px");
            $(".scoreList").css("height","757px");
            $(".txt").find("span").css("transform","rotate(180deg)");
            open=false;
        }else{
            $(".scoreList").animate({"scrollTop":0},500);
            $(".choose").show();
            $(".tab-title").css("margin-bottom","20px");
            $(".scoreList").css("height","312px");
            open=true;
            $(".txt").find("span").css("transform","rotate(360deg)")
        }
    })
    //录入表单
    $(".scoreTitle input").keyup(function(){
        if($(".scoreTitle input").val()!=''){
            if(parseFloat($(".scoreTitle input").val()) > parseFloat($(".totalScore").val())){
                $(".scoreTitle input").val(null)
            }
        }
        var html_ = $(".scoreTitle input").val();
        if(html_.indexOf('.')!=-1){
            var behind = html_.substr(html_.indexOf('.')+1,html_.length-html_.indexOf('.'))
            if(behind.length>=2){
                $(".scoreTitle input").val(null)
            }
        }
    });
    //满分表单
    $(".totalScore").blur(function(){
        if($(".totalScore").val().length>=4||parseInt($(".totalScore").val())<10||parseInt($(".totalScore").val())>999){
            $(".totalScore").val("");
        }
    })
    $(".totalScore").keyup(function(){
        resetData();
        $(".scoreTitle input").val("");
    })

    function saveData(){
        //禁用按钮
        $('.subtn').attr('disabled', "true");//禁用按钮
        load = layer.load(0,{shade: [0.8, '#000']});

        var lessonBeginDate = $(".classrome").attr('data-beginDate');
        var lessonEndDate = $(".classrome").attr('data-endDate');
        var masterTeacherName = $(".classrome").attr('data-master');
        var saveInfo = {
            "email": localStorage.terEmail,
            "teacherName": localStorage.teacherName,
            "gradeType": $(".tCode").html(),
            "className": $(".classrome").html(),
            "classCode": $(".class").html(),
            "lessonNo": $(".classTime").find(".classnum").html(),
            "lessonTime": $(".classTime").find(".lestime").html(),
            "fullMarks": $(".totalScore").val(),
            "schoolId":localStorage.schoolId,
            "student": student,
            "beginDate":lessonBeginDate,
            "endDate":lessonEndDate,
            "masterTeacherName":masterTeacherName
        }
        console.log(saveInfo)
        ajax_S(url.t_save,saveInfo,saveAjax)
    }

    function saveAjax(e){
        if(e.result){
            layer.close(load);
            layer3 = layer.open({
                type: 1,
                area: ['548px', '345px'],
                shade:[0.2,'#000'],
                title:'',
                skin: '',
                content:$(".recordSucc")
            })
            student=[];
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
        $('.subtn').removeAttr("disabled");
    }
    //获取openId
    function queryOpenid(){
        var queryOpenid={
            "schoolId":localStorage.schoolId,
            "stuQuery":stuQuery
        }
        ajax_S(url.w_openId,queryOpenid,openIdAjax);
    }
    function openIdAjax(e){
        if(e==null){
            return false;
        }else{
            stuid = [];
            for(var i=0;i<e.studentInfo.length;i++){
                var stuid={
                    "stuNo":e.studentInfo[i].studentNo,
                    "openId":e.studentInfo[i].wechatId
                }
                stuOpenId.push(stuid);
            }
        }
    }
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
            student = [];
            pushStuent = [];
            for (var i = 0; i < $(".scoreList dl").length; i++) {
                if (!isNaN(parseInt($(".scoreList dl").eq(i).find("dt").html()))) {
                    var studentinfo = {
                        "studentName": $(".scoreList dl").eq(i).find("dd").eq(0).html(),
                        "studentNo": $(".scoreList dl").eq(i).find("dd").eq(1).html(),
                        "flag": $(".scoreList dl").eq(i).find("dd").eq(2).html(),
                        "realGrade": parseFloat($(".scoreList dl").eq(i).find("dt").html())
                    }
                    var studentid={
                        "flag": $(".scoreList dl").eq(i).find("dd").eq(2).html(),
                        "studentNo": $(".scoreList dl").eq(i).find("dd").eq(1).html()
                    }
                    var pushStu={
                        "title":"亲爱的"+$(".scoreList dl").eq(i).find("dd").eq(0).html()+"家长，"+$(".scoreList dl").eq(i).find("dd").eq(0).html()+"同学本次考试成绩如下：",
                        "studentName": $(".scoreList dl").eq(i).find("dd").eq(0).html(),
                        "realGrade": parseFloat($(".scoreList dl").eq(i).find("dt").html())+"分",
                        "sNo": $(".scoreList dl").eq(i).find("dd").eq(1).html()
                    }
                    pushStuent.push(pushStu);
                    stuQuery.push(studentid);
                    student.push(studentinfo);
                }
            }
            var dtlength=$(".scoreList dt").length;
            if(student==""){
                layer.msg("没有录入成绩");
            }else if(student.length<dtlength){
                layer1=layer.open({
                    type: 1,
                    area: ['548px', '345px'],
                    shade:[0.2,'#000'],
                    title:'',
                    skin: '',
                    content:$(".noRecord")
                })

            }else{
                layer2=layer.open({
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

    $(".recordSub button").eq(0).click(function () {
        layer.close(layer2);
        student=[];
        stuOpenId=[];
    })
    $(".recordSub button").eq(1).click(function(){
        layer.close(layer2);
        saveData();
        queryOpenid();
    })

    $(".subFail button").eq(0).click(function(){
        layer.close(layer4);
        student=[];
        stuOpenId=[];
    })
    $(".subFail button").eq(1).click(function(){
        layer.close(layer4);
        saveData();
        queryOpenid();

    })

    $(".recordSucc button").click(function(){
        var classmate=[];
        layer.close(layer3);
        var push=pushInfo();
        for(var i=0;i<push.stuInfomation.length;i++){
            var classmateInfo={
                "childName":push.stuInfomation[i].studentName,
                "first":push.stuInfomation[i].title,
                "score":push.stuInfomation[i].realGrade,
                "openId":push.stuInfomation[i].openId
            }
            classmate.push(classmateInfo);
        }
        var pushwei={
            "appid":AppId,
            "secret":SecreT,
            "remark":"发送人:"+push.course+""+localStorage.teacherName+"老师感谢您对我们的支持。",
            "courseName":push.courseName,
            "time":push.time,
            "templateId":TemplateId_grade,
            /*"url":url_o2+"/xdfdthome/learningSituation/report_t.html",*/
            "url":urlPush,
            "info":classmate
        };
        ajax_S(url.w_push,pushwei,pushMsg);

    })
    function pushMsg(e){
        if(e.result){
            console.log(e)
            location.href="report_t.html";
        }else{
            console.log(message);
        }
    }
    $(".noRecord button").eq(0).click(function(){
        student=[];
        stuOpenId=[];
        layer.close(layer1);
    })
    $(".noRecord button").eq(1).click(function(){
        layer.close(layer1);
        saveData();
        queryOpenid();

    })



    $(".scoreType").hide();
    $(".chooseClass").hide();
    $(".classNumTime").hide();
    $(".mask").hide();
    $(".addMask").hide();
    $(".choose li").not("li:last-child").click(function () {
        $(".mask").show();
        $("body,html").css({"width": "100%", "height": "100%", "overflow": "hidden"})
        if ($(this).index() == 0) {
            $(".scoreType").show()
            $(".scoreType").css("animation", "move 0.3s linear");
            $(".scoreType").css("bottom", "0px");
            $(".chooseClass").hide();
            $(".classNumTime").hide();
        } else if ($(this).index() == 1) {
            $(".chooseClass").show();
            $(".chooseClass").css("animation", "move 0.3s linear");
            $(".chooseClass").css("bottom", "0px");
            $(".classNumTime").hide();
            $(".scoreType").hide();

        } else if ($(this).index() == 2) {
            $(".classNumTime").show();
            $(".classNumTime").css("animation", "move 0.3s linear");
            $(".classNumTime").css("bottom", "0px");
            $(".chooseClass").hide();
            $(".scoreType").hide();
        }

    })


    $(".mask").click(function(){
        $(".mask").hide();
        if($(".chooseClass").css("display")=="block"){
            if($(".classrome").html()!=""){
                if($(".classNumTime ul span").html()=="暂无课次"){
                    return false;
                }else{
                    $(".classNumTime ul").find("li").eq(0).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
                    $(".classTime").html("第<span class=classnum>"+$(".classNumTime ul").find("li").eq(0).find(".lessonNo").html()+"</span>课次(<span class=lestime>"+$(".classNumTime ul").find("li").eq(0).find(".sectTime").html()+"</span>)");
                    $(".chooseClass").css("display","none");
                    query();
                }

            }else{
                $(".chooseClass").css("display","none");
            }

        }
        if($(".scoreType").css("display")=="block"){
            $(".scoreType").css("display","none");
            if($(".tCode").html()>2&&$(".tCode").html()<6){
                $(".classTime").html("暂无课次");
                $(".choose").find("li").eq(2).hide();
                $(".scoreList").css("height","412px");
            }else{
                if($(".classrome").html()!=""){
                    $(".classNumTime ul").find("li").eq(0).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
                    $(".classTime").html("第<span class=classnum>"+$(".classNumTime ul").find("li").eq(0).find(".lessonNo").html()+"</span>课次(<span class=lestime>"+$(".classNumTime ul").find("li").eq(0).find(".sectTime").html()+"</span>)");
                }else{
                    $(".classTime").html(" ");
                }
                /*$(".classTime").html("");*/
                $(".choose").find("li").eq(2).show();
                $(".scoreList").css("height","312px");
            }
        }
        if($(".classNumTime").css("display")=="block"){
            $(".classNumTime").css("display","none");
            query();
        }
    })


    $(".chooseBtn").click(function () {

        $(".mask").hide();
        $("body,html").css({"width": "", "height": "", "overflow": ""})
        $(".chooseClass").hide();
        $(".chooseClass").css("animation", "");
        $(".chooseClass").css("bottom", "-440px");
        $(".classTime").html("第<span class=classnum>"+$(".classNumTime ul").find("li").eq(0).find(".lessonNo").html()+"</span>课次(<span class=lestime>"+$(".classNumTime ul").find("li").eq(0).find(".sectTime").html()+"</span>)");
        $(".classNumTime ul").find("li").eq(0).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
    })
    $(".confirmBtn").click(function () {
        $(".mask").hide();
        $("body,html").css({"width": "", "height": "", "overflow": ""});
        $(".classNumTime").hide();
        $(".classNumTime").css("animation", "");
        $(".classNumTime").css("bottom", "-440px");
    })
    $(".scoreTypeBtn").click(function () {
        if($(".tCode").html()>2&&$(".tCode").html()<6){
            $(".classTime").html("暂无课次");
            $(".choose").find("li").eq(2).hide();
            $(".scoreList").css("height","412px");
        }else{
            if($(".classrome").html()!=""){
                $(".classNumTime ul").find("li").eq(0).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
                $(".classTime").html("第<span class=classnum>"+$(".classNumTime ul").find("li").eq(0).find(".lessonNo").html()+"</span>课次(<span class=lestime>"+$(".classNumTime ul").find("li").eq(0).find(".sectTime").html()+"</span>)");
            }else{
                $(".classTime").html(" ");
            }
            $(".choose").find("li").eq(2).show();
            $(".scoreList").css("height","312px");
        }
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
        if($(".st").html()&&$(".classTime").html()&&$(".class").html()&&$(".scoreList").children()){
            var queryData={
                "teacherEmail":localStorage.terEmail,
                "classCode":$(".class").html(),
                "tCode":$(".tCode").html(),
                "schoolId":localStorage.schoolId,
                "lessonNo":$(".classTime").find(".classnum").html()
            };
            console.log(queryData);
            ajaxRequest("post",url.t_modify,queryData,queryAjax);
        }
    }
    function queryAjax(msg){
        console.log(msg);
        if(msg.code=="200"){
            if(msg.data.length==0){
                $(".totalScore").val(10);
                $(".totalScore").attr("readonly",false);
                resetData();
            }else{
                resetData();
                for(var j=0;j<$(".scoreList dl").length;j++){
                    for(var i=0;i<msg.data.length;i++){
                        $(".totalScore").val(msg.data[0].fullmarks);
                        $(".totalScore").attr("readonly","readonly");
                        if(msg.data[i].studentNo==$(".scoreList dl").eq(j).find(".code").html()){
                            $(".scoreList dl").eq(j).find("dt").html(msg.data[i].realgrade);
                        }
                    }
                }
                changeData();
            }
        }
    }


    //重置数据
    function resetData(){
        for(var j=0;j<$(".scoreList dl").length;j++){
            var ddStr = $(".scoreList dl").eq(j).find("dd").eq(0);
            var dtStr = $(".scoreList dl").eq(j).find("dt");
            var ddstrLen = lenStat(ddStr);
            if(re.test(ddStr.html())){
                if(lenStat(ddStr) >= 5){
                    if(lenStat(ddStr) >8){
                        ddStr.css("font-size", "20px");
                        ddStr.css("margin-top", "23px");
                    }
                    dtStr.html(ddStr.html().substr(- 4, 4));
                }else{
                    dtStr.html(ddStr.html());
                }

            }else if(reZ.test(ddStr.html())){
                if(lenStat(ddStr) >= 5){
                    if(lenStat(ddStr) > 8){
                        ddStr.css("font-size", "17px");
                        ddStr.css("margin-top", "23px");
                    }
                    dtStr.html(ddStr.html().substr(- 2, 2));
                }else{
                    dtStr.html(ddStr.html());
                }

            }else{
                if(reZ.test(ddStr.html().substr(-1, 1))){
                    if(reZ.test(ddStr.html().substr(-2, 1))){
                        dtStr.html(ddStr.html().substr(-2, 2));
                    }else{
                        dtStr.html(ddStr.html().substr(-3, 3));
                    }
                    if(lenStat(ddStr) > 8){
                        ddStr.css("font-size", "17px");
                        ddStr.css("margin-top", "23px");
                    }
                }else{
                    if(re.test(ddStr.html().substr(-1, 1))){
                        if(re.test(ddStr.html().substr(-2, 1))){
                            if(re.test(ddStr.html().substr(-3, 1))){
                                if(re.test(ddStr.html().substr(-4, 1))){
                                    dtStr.html(ddStr.html().substr(-4, 4));
                                }else{
                                    dtStr.html(ddStr.html().substr(-3, 3));
                                }
                            }else{
                                dtStr.html(ddStr.html().substr(-3, 3));
                            }
                        }else{
                            dtStr.html(ddStr.html().substr(-2, 2));
                        }
                    }
                    if(lenStat(ddStr) > 8){
                        ddStr.css("font-size", "17px");
                        ddStr.css("margin-top", "23px");
                    }
                }
            }

        }
    }
    //0-数据不动   1-添加   2-修改
    //修改数据
    function changeData(){
        for(var i=0;i<$(".scoreList dl").length;i++){
            $(".scoreList dl").find(".flag").html(0);
            if(isNaN(parseInt($(".scoreList dl").eq(i).find("dt").html()))){
                $(".scoreList dl").eq(i).attr("mark","add");
            }else{
                $(".scoreList dl").eq(i).attr("mark","update");
            }
        }
        $(".scoreList dl").click(function(){
            if($(this).attr("mark")=="add"){
                $(this).find(".flag").html(1);
            }else if($(this).attr("mark")=="update"){
                $(this).find(".flag").html(2);
            }
        })
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
//传推送数据
    function pushInfo(){
        var pushinfo={
            "courseName":$(".st").html(),
            "course":$(".classrome").html(),
            "time":"第"+$(".classnum").html()+"课次"+$(".lestime").html(),
            "stuInfomation":pushStuent
        }
        if($(".tCode").html()>2&&$(".tCode").html()<6){
            pushinfo.time=1;
        }
        /*for(var i=0;i<stuOpenId.length;i++){
            for(var j=0;j<pushinfo.stuInfomation.length;j++){
                if(stuOpenId[i].stuNo==pushinfo.stuInfomation[j].sNo){
                    pushinfo.stuInfomation[j].openId=stuOpenId[i].openId;
                }
            }
         }*/
        for(var j=0;j<pushinfo.stuInfomation.length;j++){
            for(var i=0;i<stuOpenId.length;i++){
                if(pushinfo.stuInfomation[j].sNo==stuOpenId[i].stuNo){
                    pushinfo.stuInfomation[j].openId=stuOpenId[i].openId;
                    break;
                }
            }
        }
        for(var j=0;j<pushinfo.stuInfomation.length;j++){
            if(!pushinfo.stuInfomation[j].openId){
                pushinfo.stuInfomation.splice(j,1);
                j--;
            }
        }
        return pushinfo;
    }
    //清缓存
    $(".txt i").click(function () {
        var redisData={"code":"redis","prefixKey":"teacher_class:"+$('.class').html()}
        ajax_S(url.t_redis,redisData,redisAjax)
    })
    function redisAjax(e) {
        if(e.result){
            layer.msg("刷新成功");
            location.reload();
        }else{
            layer.msg("刷新失败");
        }
    }
})

