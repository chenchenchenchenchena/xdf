/* 配置文件*/

/*Life without love crt 2017-11-1 G*/
require(['jquery-1.11.0.min'],function(){
/*数据交互请求地址*/
    var global = {
    
    }
    
    
    
    /*用户下拉*/
    var timeout; 
    $('.user_name').hover(function(){
        $('.usermenu').stop().fadeIn();
        $('.user_name').css('background-image','url(../images/img_3.png)')
    },function(){
        timeout = setTimeout(function(){
            $('.usermenu').stop().fadeOut();
             $('.user_name').css('background-image','url(../images/img_1.png)')
        },500)
    })
    $('.usermenu').hover(function(){
        clearTimeout(timeout)
    },function(){
        $('.usermenu').stop().fadeOut();
        $('.user_name').css('background-image','url(../images/img_1.png)')
    })
    
})
