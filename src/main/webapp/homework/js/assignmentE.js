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

    //设置当天默认值
    $('.time_S i').html(new Date().format("yyyy-MM-dd"));
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

    $('.Choice_s input').on('change', function () {
        $('.time_S i').html($(this).val())
    });
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
    //列表显示
    $(".searchE span").click(function () {
        $(".list").eq($(this).index()).toggle();
    })
    $(document).on("click",".listOne li",function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".searchE span").eq(0).html($(this).html());
        $(".searchE span").eq(0).css("color","#000");
    })
    $(document).on("click",".listTwo li",function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".searchE span").eq(1).html($(this).html());
        $(".searchE span").eq(1).css("color","#000");
    })
    $(document).on("click",".listThree li",function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".searchE span").eq(2).html($(this).html());
        $(".searchE span").eq(2).css("color","#000");
    })
    $(document).on("click",".listFour li",function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".searchE span").eq(3).html($(this).html());
        $(".searchE span").eq(3).css("color","#000");
    })
    $(document).on("click",".searchCon img",function () {
        if($(this).attr("src")=="images/yu.png"){
            $(this).attr("src","images/yu2.png");
        }else{
            $(this).attr("src","images/yu.png");
        }
    })
});
