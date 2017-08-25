/**
 * Created by zyc on 2017/8/22.
 */
$(document).ready(function() {

    $(".menu_list ul li").click(function() {
        //判断对象是显示还是隐藏
        if($(this).children(".div1").is(":hidden")){
            if(!$(this).children(".div1").is(":animated")) {
                $(this).children(".xiala").css({'transform':'rotate(90deg)'});
                $(this).children(".div1").animate({
                        height: 'show'
                    }, 500)
                    .end().siblings().find(".div1").hide(500);
            }
        } else {
            if(!$(this).children(".div1").is(":animated")) {
                $(this).children(".xiala").css({'transform':'rotate(0deg)'});
                $(this).children(".div1").animate({
                        height: 'hide'
                    }, 500)
                    .end().siblings().find(".div1").hide(500);
            }
        }
    });
    $('.div1').click(function(e){
        e.stopPropagation();
    });

    $(".menu_list ul li .div1 .zcd").click(function() {
        $(this).addClass("removes").siblings().removeClass("removes");
        $(".div1").each(function(){
            if($(this).is(":hidden")){
                $(this).children(".zcd").removeClass("removes");
            }
        });
    });

    $(".lis>.fuMenu").click(function() {
        $(".div1").each(function(){
            if(!$(this).is(":hidden")){
                $(this).parent().children("img").css({'transform':'rotate(0deg)'});
            }
        });
    });
    //点击图标展开菜单显示
    $("#hidIcon").click(function(){
        $(".mask").show();
        $(".leftMenu").css("display","block")
            .animate({"left":"0px"},"slow");
        $("body,html").css("overflow","hidden");
    })
    $(".mask").click(function(){
        $(this).hide();
        $(".leftMenu").animate({"left":"-300px"},"slow",function(){
            $(".leftMenu").css("display","none")
        });
        $("body,html").css("overflow","scroll");
    })
    $(".menu_list ul li").click(function () {
        $(".mask").hide();
        $(".leftMenu").animate({"left":"-300px"},"slow",function(){
            $(".leftMenu").css("display","none")
        });
        var top =$('.main div').eq($(this).index()).offset().top;
        $('body,html').scrollTop(top);
        $("body,html").css("overflow","auto");
    });
    $(".back").click(function () {
        // alert($(document).scrollTop())
        $("body,html").animate({"scrollTop":0},1000);
    })
    if(getRequest().state=='JT'||sessionStorage.G){
        sessionStorage.G = 0;
        if(location.href.indexOf('teaUser')!=-1){
            $('#account p').eq(0).html('用户关注东方双师微信公众号后，进入公众号主页面如图所示。');
            $('img[src="img/z1.png"]').attr('src','img/z1_.png');
            $('img[src="img/z2.png"]').attr('src','img/z2_.png');
            $('img[src="img/z12.png"]').attr('src','img/z2_.png');
            $('img[src="img/z23.png"]').attr('src','img/z2_.png');
            $('img[src="img/z36.png"]').attr('src','img/z2_.png');
        }
        if(location.href.indexOf('manual')!=-1){
            $('#account p').eq(0).html('新用户首次登陆需要关注东方双师微服务公众号，关注公众号后进入功能列表页面，点击【我的】按钮，弹出一个列表，点击【账户】按钮，进入登录页面。');
            $('.lwo_').html('作业进入，学员已经登录的，进入到东方双师微服务公众号列表页面，点击【作业】按钮，进入到学情功能页面，没有登录的点击【作业】按钮会跳转到登录页面，登录后退出到东方双师学校微服务公众号功能列表页面，再次点击【作业】按钮进入到学情功能页面')
            $('img[src="img/d1.png"]').attr('src','img/z1_.png');
            $('img[src="img/s1.png"]').attr('src','img/z2_.png');
        }






    }
    function getRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
});
