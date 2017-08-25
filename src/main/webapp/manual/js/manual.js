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
        })
        $("body,html").css("overflow","scroll");
    })
    $(".menu_list ul li").click(function () {
        $(".mask").hide();
        $(".leftMenu").animate({"left":"-300px"},"slow",function(){
            $(".leftMenu").css("display","none")
        })
        var top =$('.main div').eq($(this).index()).offset().top;
        $('body,html').scrollTop(top);
        $("body,html").css("overflow","auto");
    })
    $(".back").click(function () {
        // alert($(document).scrollTop())
        $("body,html").animate({"scrollTop":0},1000);
    })

});
