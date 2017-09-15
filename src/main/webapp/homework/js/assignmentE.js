/**
 * Created by zyc on 2017/9/7.
 */
$(function () {

    var paperIdSub;

    var isModify = GetRequest("isModify");
    var Tcid = GetRequest("id");
    if(isModify == 1){
        ajaxRequest('post', homework_s.t_seac, {'Tcid': Tcid}, function (e) {
            if(e.code == 200){
                var data = e.data;
                if(undefined != data && data != ""){

                    paperIdSub = data.paperId;

                    $(".class_s i").attr("classcode",data.classCode);
                    $(".class_s i").attr("classname",data.className);
                    sessionStorage.paperId = data.paperId;
                    sessionStorage.paperUrl = data.paperUrl;
                    sessionStorage.gradeName = data.paperName;
                    sessionStorage.stageName = data.paperStage;
                    sessionStorage.subjectName = data.paperSubject;

                    $(".content_s").find("i").html(data.className);
                    $('.time_S i').html(data.homeworkTime);
                }
            }
        });
    }

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
        if(isModify == 1){
        }else {
            $('.class_name').show();
            $('.class_name').animate({'bottom': '0px'});
            $('.class_name').show();
            $('.big_back').show();
        }
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
        if(isModify == 1){
            //修改作业不可选
        }else {
            $('.time_S i').html($(this).val());
        }

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
        location.href = "homeworkEcon.html?paperId="+paperIdSub;

    });
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
    //选择作业内容
    $(document).on("touchstart",".searchCon img",function () {
        if($(this).attr("src")=="images/yu.png"){
            $(this).attr("src","images/yu2.png");
        }else{
            $(this).attr("src","images/yu.png");
        }
    });

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
            'url': "http://dt.staff.xdf.cn/xdfdthome/homework/pushhomeworkE.html",
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
            'paperClass': sessionStorage.gradeName,
            'paperStage': sessionStorage.stageName,
            'paperSubject': sessionStorage.subjectName,
            'fileInfo': ""
        };

        if(isModify == 1){

            ajaxRequest("POST", homework_s.t_erro, JSON.stringify(params), function (e) {
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
                    location.href = "homeworklist_t.html";
                } else {
                    layer.close(layer1);
                    layer.msg(e.message);
                }
            })
        }else {

            // homework_s.t_sbim
            // var url1 = "http://10.200.80.120:8080/xdfdtmanager/teacherData/addHomeWork.do";
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
                    location.href = "homeworklist_t.html";
                } else {
                    layer.close(layer1);
                    layer.msg(e.message);
                }
            });
        }

    }

});
