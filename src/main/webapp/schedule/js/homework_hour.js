/*
   G create 2017-09-29
   Come back again
*/

$(function(){
    $('.load_t').show();        
    
    if(!sessionStorage.openid){
        wechatCode(location.href);
    };

    if(!localStorage.terEmail){
            var WXnum  = {
                'wechatId':sessionStorage.openid
             };
            ajax_S(url.s_seac,WXnum,function(e){
                if(e.result==true){
                    if(!localStorage.userId_stu){
                        location.href = 'login_s.html'
                    }
                    sessionStorage.stuNumber = e.data.studentNo;
                    sessionStorage.schoolId = e.data.schoolId;
                    sessionStorage.studentName = e.data.studentName;
                    sessionStorage.timetoday = new Date().format("yyyy-MM-dd")
                    location.href = "studentInfo.html?remark=2&studentNo=" + sessionStorage.stuNumber + "&schoolId=" + sessionStorage.schoolId+"&tCode=1&studentName=" + sessionStorage.studentName;
                }else{
                    location.href = 'login_s.html'
                }

            });
    }
    if(!localStorage.mastTeater){
        var less_need_ = {
            'email':localStorage.terEmail,
            'schoolId':localStorage.schoolId
        }
        var less_need = {
            'email':localStorage.terEmail,
            'schoolId':localStorage.schoolId
        }
        homework() // 作业率请求
    }else{
        $('.big_select').show();
        var less_need_ = {
            'masterTeacherEmail':localStorage.terEmail,
            'ifmore':'1'
        }
        var less_need = {
            'email':localStorage.terEmail,
            'schoolId':localStorage.schoolId,
        }
    }
    //校区相关
    $(document).on('touchend',".select p",function(e){
        $(".select").toggleClass('open');
        e.stopPropagation();
    });
    $(document).on('touchend','.content_t .select ul li',function(e){
        var _this=$(this);
        $(".select > p").text(_this.attr('data-value'));
        _this.addClass("Selected").siblings().removeClass("Selected");
        $(".select").removeClass("open");
        e.stopPropagation();
    });
    var table={
        "tableName":"dict_school_info"
    }
    ajaxRequest("POST", url.s_select, table , selectData);
    function selectData(e) {
        console.log(e);
        $(".select ul").html("");
        if(e.code=="200"){
            $(".select ul").append('<li>全部校区</li>')
            for(var i=0;i<e.data.length;i++){
                var str ='<li data-value='+e.data[i].tName+' data-code='+e.data[i].tCode+'>'+e.data[i].tName+'</li>';
                $(".select ul").append(str);
            }
            $('.content_t').find('li').eq(0).addClass('Selected');
            $('.content_t').find('p').eq(0).html('全部校区');
        }
        $('.load_t').hide();        
        
    }
    $('.truorfal input').on('touchend',function(){
            $('.big_select').hide();
            less_need_.schoolId  =  $('.Selected').attr('data-code');
             if($('.Selected').attr('data-code')==undefined){
                less_need_.schoolId = '';
            }
            homework() // 作业率请求
    })
    function homework(){
        ajax_S(url.t_houehome,less_need_,function(e){
            if(e.result!=false&&e.data.length!=0){
                cnv('can_o',parseInt(e.sumcommitReplyt*100),'#ffbb37')
                cnv('can_t',parseInt(e.sdpfsumReplyt*100),'#ff6a6a')
                cnv('can_h',parseInt(e.dzsumcorrectReplyt*100),'#6ab4ff')
                //提交率
                $('.sdsumcommitReplyt').html('手动：'+parseInt(e.sdsumcommitReplyt*100)+'%')
                $('.dzsumcommitReplyt').html('电子：'+parseInt(e.dzsumcommitReplyt*100)+'%')
                //批复率
                $('.sdpfsumReplyt').html('手动：'+parseInt(e.sdpfsumReplyt*100)+'%')
                if(e.dzpfnum==0){
                    $('.sdpfsumReplyt').siblings('p').html('电子：0%')
                }
                //正确率
                $('.dzsumcorrectReplyt').html('电子：'+parseInt(e.dzsumcorrectReplyt*100)+'%')
                $('.canvs_more li').eq(0).siblings().remove();
                for(var i = 0;i<e.data.length;i++){
                    $('.canvs_more ul').append('<li><span>'+e.data[i].className+'</span><span>'+e.data[i].classCode+'</span><span>'+parseInt(e.data[i].classcommitReplyt*100)+'%</span><span>'+parseInt(e.data[i].classcorrectReplyt*100)+'%</span><span>'+parseInt(e.data[i].classDzCorcsReplyt*100)+'%</span></li>')
                }
            }else{
                $('.no-data').show();
                $('.no-data p').html(e.message);
                $('.canvs_hour_big div').eq(0).hide();
            }
        $('.load_t').hide()
        })
    }
    function lessontime(){
        //获取月课时 日课时
        ajax_S(url.t_hour,less_need,function(e){
            if(e.Data==undefined){
                $('.monthHours').html('0')
                $('.lessonHours').html('0')
            }else{
                $('.monthHours').html(e.Data[0].monthHours)
                $('.lessonHours').html(e.Data[0].lessonHours)
            }
        })
        //按月获取月课时
        ajax_S(url.t_hourmonth,less_need,function(e){
            $('.lesson_more li').eq(0).siblings().remove()
            for(var i = 0;i<e.Data.length;i++){
                $('.lesson_more ul').append('<li><span>'+e.Data[i].hisYear+'.'+e.Data[i].hisMonth+'</span><span>'+e.Data[i].lessonHours+'</span><span>'+e.Data[i].lessonNos+'</span></li>')
            }
            $('.load_t').hide();        
            
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
            $('.load_t').show();        
            homework();
            break;
            case 1:
            if(localStorage.mastTeater){
                less_need.mainspeaker = '1'
            }
            $('.load_t').show();        
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
            
            var r = bian*2*Math.PI/100;
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
            if(bian>=num){
                clearInterval(times)
            }
            init()
        },30)
    }
})