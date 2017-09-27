/*
   G create 2017-09-29
   Come back again
*/

$(function(){



























    //tab切换
    $('.tab-title li').on('touchend',function(){
       if(!$(this).hasClass('tab-active')){
          $(this).addClass('tab-active').siblings().removeClass('tab-active')
          $('.canvs_hour_big').children('div').eq($(this).index()).show().siblings().hide();
       }
    })
    //名词说明显示
    $('.canvs_more_tit img').on('touchend',function(){
        $('.big_back').show();
    })
    //名词说明隐藏
    $('.big_center img').on('touchend',function(){
        $('.big_back').hide();
    })
    $('.big_back').on('touchend',function(){
        $('.big_back').hide();
    })
    $('.big_center').on('touchend',function(){
        event.stopPropagation();
    })
    
    cnv('can_o')
    //环形图
    function cnv(id){
        var bian = 0    //这里改数值~
        var canvas = document.getElementById(id);
        var ctx = canvas.getContext("2d");
        var W = 168;
        var H = 168;
        var text,text_w;
        function init(){
            ctx.clearRect(0,0,W,H);
            ctx.beginPath();
            ctx.strokeStyle="#353393";
            ctx.lineWidth=4;
            ctx.arc(W/2,H/2,100,0,Math.PI*2,false);
            ctx.stroke();
            
            var r = bian*4.5*Math.PI/180;
            ctx.beginPath();
            var linear = ctx.createLinearGradient(100,100,200,100); 
            linear.addColorStop(0,'#00e5ff'); 
            linear.addColorStop(1,'#525ff4'); 
            ctx.strokeStyle =linear;

            ctx.lineCap = 'round'
            ctx.lineWidth=10;
            ctx.arc(W/2,H/2,100,0-90*Math.PI/180,r-90*Math.PI/180,false);
            ctx.stroke();
            ctx.fillStyle="#70dae3";
            ctx.font="50px abc";
            text = Math.floor(bian*4.5/360*80)+"/80";
            text_w = ctx.measureText(text).width;
            ctx.fillText(text,W/2 - text_w/2,H/2+15);
        }
        init()
        var times = setInterval(function(){
            bian +=1;
            if(bian==30){
                clearInterval(times)
            }
            init()
        },30)
    }
})