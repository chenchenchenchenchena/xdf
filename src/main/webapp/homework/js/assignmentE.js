/**
 * Created by zyc on 2017/9/7.
 */
$(function () {
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
        sessionStorage.time=$('.time_S i').html();
        sessionStorage.class=$(".class_s i").html();
        location.href="homeworkEcon.html";
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
            layer1=layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade:[0.2,'#000'],
                title: '',
                skin: '',
                content: $(".areyok")
            })
        }
    })
    $(".areyok input").eq(0).click(function () {
        layer.close(layer1);
    })
    $(".areyok input").eq(1).click(function () {
        layer.close(layer1);
        layer.open({
            type: 1,
            area: ['312px', '194px'],
            shade:[0.2,'#000'],
            title: '',
            skin: '',
            time: 3000,
            content: $(".succ")
        })
    })
    //列表显示
    $(".searchE span").click(function () {
        $(".list").eq($(this).index()).toggle();
    })
    $(document).on("touchstart",".listOne li",function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".searchE span").eq(0).html($(this).html());
        $(".searchE span").eq(0).css("color","#000");
    })
    $(document).on("touchstart",".listTwo li",function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".searchE span").eq(1).html($(this).html());
        $(".searchE span").eq(1).css("color","#000");
    })
    $(document).on("touchstart",".listThree li",function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".searchE span").eq(2).html($(this).html());
        $(".searchE span").eq(2).css("color","#000");
    })
    $(document).on("touchstart",".listFour li",function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".searchE span").eq(3).html($(this).html());
        $(".searchE span").eq(3).css("color","#000");
    })
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
});
