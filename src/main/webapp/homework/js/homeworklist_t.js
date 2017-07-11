$(function(){
	$(document).on('touchstart','.hwFinish .firstList',function(){
	    if($(this).find('ul').css('display')=='none'){
	       $(this).find('ul').show();
           $(this).css("background","url(images/jiao11.png) no-repeat right 55px");
        }else{
            $(this).find('ul').hide();
            $(this).css("background","url(images/jiao22222.png) no-repeat right 55px");
        }

    });






	//滑动事件
	$(document).on('touchstart','.tealist_s',function(){
		var begin_s = parseInt(event.targetTouches[0].pageX);

        $(document).on('touchmove','.tealist_s li',function(){
            var move_s = parseInt(event.targetTouches[0].pageX);
            if(begin_s-move_s>=50){
                $(this).css('margin-left','-181px');
                $(this).find('.remove_s').css('right','-30px');
                return false;
			}
			if(begin_s-move_s<=-50){
                $(this).css('margin-left','0px');
                $(this).find('.remove_s').css('right','-270px');
                return false;
            }
			// console.log(begin_s+'，'+move_s);
			$(this).css('margin-left',move_s-begin_s+'px');
        })
	})
    // ajax_S(homework_s.t_list,)





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