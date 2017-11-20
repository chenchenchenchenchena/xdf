$(function(){
    //滑动事件
    $(document).on('touchstart mouusedown','.temp_list',function(){
        // e.stopPropagation();
        if($(this).children('.remove_temp')){
            var begin_s = parseInt(event.targetTouches[0].pageX);
            $(document).on('touchmove mousemove','.temp_list li',function(){
                var listHeight = $(this)[0].offsetHeight;
                console.log(listHeight);
                var move_s = parseInt(event.targetTouches[0].pageX);
                $(this).find('.remove_temp').css('height',listHeight+"px");
                $(this).find('.remove_temp span').css('height',listHeight+"px");
                $(this).find('.remove_temp span').css('line-height',listHeight+"px");
                if(begin_s-move_s>=20){
                    $(this).siblings().css('margin-left','0px');
                    $(this).siblings().find('.remove_temp').css('right','-270px');
                    $(this).css('margin-left','-181px');
                    $(this).find('.remove_temp').css('right','-0px');
                    $(this).parent().css('overflow','inherit');
                    $(this).css('margin-left','-50px');
                }else if(begin_s-move_s<=-20){
                    $(this).css('margin-left','0px');
                    $(this).find('.remove_temp').css('right','-270px');
                    $(this).parent().css('overflow','hidden');
                    $(this).css('margin-left','0');
                }
            });
        }
    });

    /**
     * 点击添加模版
     */
    $('.eBtn').click(function(){
        location.href = 'add_template.html';
    });
})