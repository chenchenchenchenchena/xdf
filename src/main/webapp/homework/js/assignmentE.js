/**
 * Created by zyc on 2017/9/7.
 */
$(function () {
    sessionStorage.paperId = "32273901-279E-450F-AAFD-BB96E292AF26";
    sessionStorage.paperUrl = "http://tps.staff.xdf.cn/gwots/testprocess/weixin/static/testing/index?paperId=" + sessionStorage.paperId;
    if (sessionStorage.paperUrl) {
        $('.sResolve a').attr("href", sessionStorage.paperUrl);
    }
    var trardata = {
        'teacherCode': localStorage.teacherId,
        'schoolId': localStorage.schoolId,
        'email': localStorage.terEmail
    };
    var layer1, layer2, loading;
    //作业内容
    if(sessionStorage.contentName){
        $(".content_s").find("i").html(sessionStorage.contentName);
    }
    if(sessionStorage.time){
        $('.time_S i').html(sessionStorage.time);
    }else{
        //设置当天默认值
        $('.time_S i').html(new Date().format("yyyy-MM-dd"));
    }
    if(sessionStorage.class){
        $(".class_s i").html(sessionStorage.class);
    }
    if (sessionStorage.hxCode) {
        $(".class_s i").attr("classcode", sessionStorage.hxCode);
    }
    if (sessionStorage.hxName) {
        $(".class_s i").attr("className", sessionStorage.hxName);
    }
    //获取班级信息
    ajax_S(homework_s.t_clas, trardata, function (e) {
        var className = e.data;
        for (var a = 0; a < className.length; a++) {
            $('.class_name ul').append('<li classCode="' + className[a].ClassCode + '"><img src="images/C05_06.png" alt="">' + className[a].ClassName + '</li>')
        }
    });
    //选择班
    $('.class_s').on('touchend click', function () {
        $('.class_name').show();
        $('.class_name').animate({'bottom': '0px'});
        $('.class_name').show();
        $('.big_back').show();
    });

    $(document).on('tap', '.class_name li', function () {
        var html_ = $('.class_name i').html();
        if ($(this).find('img').attr('src') == 'images/C05_06.png') {
            $(this).find('img').attr('src', 'images/C0503.png');
            html_++;
            $('.class_name i').html(html_);
        } else {
            $(this).find('img').attr('src', 'images/C05_06.png');
            html_--;
            $('.class_name i').html(html_);
        }
    });

    var className = '';
    var classCode = '';
    //确认班级
    $('.class_sub').on('touchend', function () {
        className = '';
        classCode = '';
        $(this).parent().find('li').each(function () {
            if ($(this).find('img').attr('src') == 'images/C0503.png') {
                className += $(this).text() + '；';
                classCode += $(this).attr('ClassCode') + ',';
            }
        });
        classCode = classCode.substr(0, classCode.length - 1);
        if (className == '') {
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classEmpty")
            })
        }
        if ($('.class_name i').html() != '0') {
            $('.class_s i').html('已选择' + $('.class_name i').html() + '个班&nbsp;&nbsp;' + className + ' ');
            $('.class_s i').attr("classcode", classCode);
            var class_n = className.replace(/\；/g, ',').substr(0, className.length - 1);
            $('.class_s i').attr("classname", class_n);
            $('.class_name').animate({'bottom': '-438px'});
            $('.big_back').hide();
        } else {
            $('.class_s i').html('');
        }
    });
    //作业时间
    $('.Choice_s input').on('change', function () {
        $('.time_S i').html($(this).val());
    });
    //点击蒙层
    $('.big_back').on('touchstart', function () {
        if ($('.class_name').css('display') == 'block') {
            $('.class_name').animate({'bottom': '-438px'});
            setTimeout(function () {
                $('.big_back').hide();
            }, 300);
            if ($('.class_s i').html() == '') {
                $('.class_name i').html('0');
                $('.class_name img').attr('src', 'images/C05_06.png');
                if ($('.class_name i').html() == '0') {
                    $('.class_s i').html('')
                }
            }
        }
    });
    //点击选择作业内容跳转
    $(".content_s").click(function () {
        sessionStorage.time = $('.time_S i').html();
        sessionStorage.class = $(".class_s i").html();
        sessionStorage.hxCode = $('.class_s i').attr('classcode');
        sessionStorage.hxName = $('.class_s i').attr('classname');
        location.href = "homeworkEcon.html";
    })
    //点击提交
    $(".tSub").click(function () {
        if($(".class_s i").html()==""){
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classEmpty")
            })
        }
        if($(".content_s i").html()==""){
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classTime")
            })
        }
        if($(".content_s i").html()!=""&&$(".class_s i").html()!=""&&$(".time_S i").html()!=""){
            sessionStorage.removeItem("contentName");
            sessionStorage.removeItem("time");
            sessionStorage.removeItem("class");
            layer1 = layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: [0.2, '#000'],
                title: '',
                skin: '',
                content: $(".areyok")
            })
        }
    });

    $(".areyok input").eq(0).click(function () {
        layer.close(layer1);
    });
    $(".areyok input").eq(1).click(function () {
        submit();
    });
    // //列表显示
    // $(".searchE span").click(function () {
    //     $(".list").eq($(this).index()).toggle().siblings().hide();
    // })
    // $(document).on("touchstart",".listOne li",function () {
    //     $(this).addClass("active").siblings().removeClass("active");
    //     $(".searchE span").eq(0).html($(this).html());
    //     $(".searchE span").eq(0).css("color","#000");
    // })
    // $(document).on("touchstart",".listTwo li",function () {
    //     $(this).addClass("active").siblings().removeClass("active");
    //     $(".searchE span").eq(1).html($(this).html());
    //     $(".searchE span").eq(1).css("color","#000");
    // })
    // $(document).on("touchstart",".listThree li",function () {
    //     $(this).addClass("active").siblings().removeClass("active");
    //     $(".searchE span").eq(2).html($(this).html());
    //     $(".searchE span").eq(2).css("color","#000");
    // })
    // $(document).on("touchstart",".listFour li",function () {
    //     $(this).addClass("active").siblings().removeClass("active");
    //     $(".searchE span").eq(3).html($(this).html());
    //     $(".searchE span").eq(3).css("color","#000");
    // })
    //选择作业内容
    $(document).on("touchstart",".searchCon img",function () {
        if($(this).attr("src")=="images/yu.png"){
            $(this).attr("src","images/yu2.png");
        }else{
            $(this).attr("src","images/yu.png");
        }
    })
    //点击筛选作业内容按钮
    $(".eBtn").click(function () {
        var checkNum=0;
        var contentName="";
        for(var i=0;i<$(".searchCon li").length;i++){
            if($(".searchCon li").eq(i).find("img").attr("src")=="images/yu2.png"){
                contentName+=$(".searchCon li").eq(i).find("h3").html()+";";
                checkNum++;
            }
        }
        contentName = contentName.substring(0, contentName.length - 1);
        console.log(contentName);
        console.log(checkNum);
        if(checkNum==0){
            layer.msg("请选择作业内容");
        }else{
            sessionStorage.contentName=contentName;
            console.log(sessionStorage.contentName);
           location.href="AssignmentE.html";
        }
    })
    //作业汇总
    var summaryData={"Tcid":/*"be0a11d4dde94b2a98c3b4d066baf9f1"*/sessionStorage.Tid}
    ajax_S(homework_s.t_summary,summaryData,summaryAjax);
    function summaryAjax(e) {
        console.log(e);
        if(e.code=="200"){
            var recordNum='<dl><dt><span>'+e.data.commitNum+'</span>/<span>'+e.data.StudentNum+'</span></dt><dd>完成量(人)</dd></dl><dl><dt>'+e.data.avgTimes+'</dt><dd>平均用时(min)</dd></dl>';
            $(".gHeader").append(recordNum);
           for(var i=0;i<e.data.data.commitArr.length;i++){
               var table='<tr><th>'+e.data.data.commitArr[i].studentName+'</th><th>'+e.data.data.commitArr[i].score+'</th><th>'+e.data.data.commitArr[i].replyTime+'</th><th>'+e.data.data.commitArr[i].times+'</th></tr>';
               $("tbody").append(table);
           }
            for(var i=0;i<e.data.data.nocommitArr.length;i++){
                var nocommit='<li><span>'+e.data.data.nocommitArr[i].studentName+'</span><span studentNo='+e.data.data.nocommitArr[i].studentNo+'>'+e.data.data.nocommitArr[i].studentName+'</span></li>';
                $(".noHw ul").append(nocommit);
                name();
            }

        }
    }
    //截取名字的长度
    function name() {
        var reNz=/^S{2}[0-9]{4}$/;
        var reCh = /^[a-zA-Z\u4e00-\u9fa5]{2,}$/;
        var re=/^[a-zA-Z]+$/;
        var reZ=/^[\u4e00-\u9fa5]+$/;
        for(var j=0;j<$(".noHw li").length;j++){
            var ddStr = $(".noHw li").eq(j).find("span").eq(1);
            var dtStr = $(".noHw li").eq(j).find("span").eq(0);
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


    /**
     * 提交布置作业
     */
    function submit() {
        var hwName_ = $('.content_s i').html();
        var paperName = hwName_.substring(0, hwName_.length - 1);
        var paperID = sessionStorage.paperId;
        var paperUrl = sessionStorage.paperUrl;
        //URL字段待定
        var params = {
            'appid': Global.appid,
            'secret': Global.secret,
            'url': "http://dt.xdf.cn/xdfdthome/homework/dohomework_s.html",
            'templateId': "X9u2z5OF33JCPXDuTGnw06fUt0n-7CSjCe5otNgXO6M",
            'teacherEmail': localStorage.terEmail,
            'teacherName': localStorage.teacherName,
            'schoolId': localStorage.schoolId,
            'classCode': $(".class_s i").attr("classcode"),
            'className': $(".class_s i").attr("classname"),
            'homeworkTime': $('.time_S i').html(),
            'knowledgePoint': "",
            'description': "",
            'homeworkType': "2",
            'paperId': paperID,
            'paperName': paperName,
            'paperUrl': paperUrl,
            'paperClass': "四年级",
            'paperStage': "第一阶段",
            'paperSubject': "第三课次",
            'fileInfo': ""
        };
        ajaxRequest("POST", homework_s.t_sbim, JSON.stringify(params), function (e) {
            if (e.result) {

                layer.close(layer1);
                layer.open({
                    type: 1,
                    area: ['312px', '194px'],
                    shade: [0.2, '#000'],
                    title: '',
                    skin: '',
                    time: 3000,
                    content: $(".succ")
                });

            } else {
                layer.close(layer1);
                layer.msg(e.message);
            }
        })
    }

});
