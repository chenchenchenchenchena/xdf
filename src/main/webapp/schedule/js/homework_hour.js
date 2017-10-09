/*
   G create 2017-09-29
   Come back again
*/

$(function(){

    var less_need = {
        'email':localStorage.terEmail,
        'schoolId':localStorage.schoolId
    }
    homework() // 作业率请求
    function homework(){
        ajax_S(url.t_houehome,less_need,function(e){
            if(e.result!=false&&e.data.length!=0){
                cnv('can_o',e.sumcommitReplyt*100,'#ffbb37')
                cnv('can_t',e.sdpfsumReplyt*100,'#ff6a6a')
                cnv('can_h',e.dzsumcorrectReplyt*100,'#6ab4ff')
                //提交率
                $('.sdsumcommitReplyt').html('手动：'+parseInt(e.sdsumcommitReplyt*100)+'%')
                $('.dzsumcommitReplyt').html('电子：'+parseInt(e.dzsumcommitReplyt*100)+'%')
                //批复率
                $('.sdpfsumReplyt').html('手动：'+parseInt(e.sdpfsumReplyt*100)+'%')
                //正确率
                $('.dzsumcorrectReplyt').html('电子：'+parseInt(e.dzsumcorrectReplyt*100)+'%')
                for(var i = 0;i<e.data.length;i++){
                    $('.canvs_more ul').append('<li><span>'+e.data[i].className+'</span><span>'+e.data[i].classCode+'</span><span>'+e.data[i].classcommitReplyt*100+'%</span><span>'+e.data[i].classcorrectReplyt*100+'%</span><span>'+e.data[i].classDzCorcsReplyt*100+'%</span></li>')
                }
            }else{
                $('.no-data').show();
                $('.no-data p').html(e.message);
                $('.canvs_hour_big div').eq(0).hide();
            }
        
        })
    }
    function lessontime(){
        //获取月课时 日课时
        ajax_S(url.t_hour,less_need,function(e){
            $('.monthHours').html(e.Data[0].monthHours)
            $('.lessonHours').html(e.Data[0].lessonHours)
        })
        //按月获取月课时
        ajax_S(url.t_hourmonth,less_need,function(e){
            $('.lesson_more li').eq(0).siblings().remove()
            for(var i = 0;i<e.Data.length;i++){
                $('.lesson_more ul').append('<li><span>'+e.Data[i].hisYear+'.'+e.Data[i].hisMonth+'</span><span>'+e.Data[i].lessonHours+'</span><span>'+e.Data[i].lessonNos+'</span></li>')
            }
        })
    }



    //tab切换
    $('.tab-title li').on('touchend',function(){
       if(!$(this).hasClass('tab-active')){
          $('.no-data').hide();
          $(this).addClass('tab-active').siblings().removeClass('tab-active');
          $('.canvs_hour_big').children('div').eq($(this).index()).show().siblings().hide();
       }
        switch($(this).index()){
            case 0:
            homework();
            break;
            case 1:
            lessontime();
            break;
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
    // cnv('can_o')
    
    //环形图
    function cnv(id,num,color){
        var bian = 0    //这里改数值~
        var canvas = document.getElementById(id);
        var ctx = canvas.getContext("2d");
        var W = canvas.width;
        var H = canvas.height;
        var text,text_w;
        function init(){
            ctx.clearRect(0,0,W,H);
            ctx.beginPath();
            ctx.strokeStyle="#eee";
            ctx.lineWidth=4;
            ctx.arc(W/2,H/2,80,0,Math.PI*2,false);
            ctx.stroke();
            
            var r = bian*4.5*Math.PI/180;
            ctx.beginPath();
            var linear = ctx.createLinearGradient(100,100,200,100); 
            linear.addColorStop(0,color); 
            linear.addColorStop(1,color); 
            ctx.strokeStyle =linear;

            ctx.lineCap = 'round'
            ctx.lineWidth=10;
            ctx.arc(W/2,H/2,80,0-90*Math.PI/180,r-90*Math.PI/180,false);
            ctx.stroke();
            ctx.fillStyle="#333";
            ctx.font="34px abc";
            text = num+"%";
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