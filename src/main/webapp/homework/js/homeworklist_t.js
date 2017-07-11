$(function(){


    //tab
	$(document).on('touchstart','.hwFinish .firstList',function(){
	    if($(this).find('ul').css('display')=='none'){
	        
	       $(this).find('ul').show();
           $(this).css("background","url(images/jiao11.png) no-repeat right 55px");
        }else{
            $(this).find('ul').hide();
            $(this).css("background","url(images/jiao22222.png) no-repeat right 55px");
            $(this).find('ul li').css('margin-left','0px');
            $(this).find('ul li').find('.remove_s').css('right','-270px');
        }

    });


	//滑动事件
	$(document).on('touchstart','.tealist_s',function(){
		var begin_s = parseInt(event.targetTouches[0].pageX);
        $(document).on('touchmove','.tealist_s li',function(){
            var move_s = parseInt(event.targetTouches[0].pageX);
            if(begin_s-move_s>=20){
                $(this).siblings().css('margin-left','0px');
                $(this).siblings().find('.remove_s').css('right','-270px');
                $(this).css('margin-left','-181px');
                $(this).find('.remove_s').css('right','-30px');
                $(this).parent().css('overflow','inherit');
                return false;
			}
			if(begin_s-move_s<=-20){
                $(this).css('margin-left','0px');
                $(this).find('.remove_s').css('right','-270px');
                $(this).parent().css('overflow','hidden');
                return false;
            }
			// console.log(begin_s+'，'+move_s);
			$(this).css('margin-left',move_s-begin_s+'px');
			return false;
        })
        return false;

    });


	// 获取老师作业列表
    ajax_S(homework_s.t_list,{email:'caoxuefeng@xdf.cn','schoolId':'73'},function(e){
        console.log(e);
        if(e.data==undefined){
            $('.empty').show();
            $('.hwFinish').hide();
            $('.Prompt_s').hide();
        }
        var list_s = e.data;
        $('.Prompt_s i').html(e.SumUpnotCorrect);
        for(var a = 0;a<list_s.length;a++){
            $('.hwFinish>ul').append('<li class="firstList"> <p style="display:inline;">'+list_s[a][0].className+'&nbsp;('+list_s[a][0].studentNum+'人)</p><span class="state_st"></span><ul class="secul tealist_s"></ul></li>')
            for(var b = 0;b<list_s[a].length;b++){
                $('.tealist_s').eq(a).append(' <li><span>'+list_s[a][b].lessonTime.split(' ')[0].substr(5,6)+'</span><p class="state_s">已批:'+list_s[a][b].yescommit+'/未批:'+list_s[a][b].nocorrect+'/未交:'+list_s[a][b].yescorrect+'</p><span class="more_so">查看 <img src="images/B02-2_03.png" alt="" /></span><div class="remove_s"><span>修改</span><span class="delete_s">删除</span></div></li> ')
            }

        }
    })



    //查看更多




    // {
    //     "appid":"wxab29a3e2000b8d2a",
    //     "secret":"7739991fcce774c2281147eae3986ad9",
    //     "remark":"发送人",
    //     "courseName":"我是班级名字",
    //     "time":"2017年",
    //     "templateId":"tmR-IzIYH6sg-pspeZat6sQJZ4N0ThBpLjMGWDGEHfk",
    //     "url":"http://www.baidu.com",
    //     "info":[
    //     {"childName":"我是测试","first":"我是测试标题","score":"100000分","openId":"or2E7wXQqLPoNHoXcPQFu93lArDI"},
    // ]
    // }






























});