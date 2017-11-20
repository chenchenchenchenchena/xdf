$(function(){
    /*---------全局参数定义--------start*/

    var delTempLayer;

    /*---------全局参数定义--------end*/


    //滑动事件
    $(document).on('touchstart mouusedown','.temp_list',function(){
        // e.stopPropagation();
        if($(this).children('.remove_temp')){
            var begin_s = parseInt(event.targetTouches[0].pageX);
            $(document).on('touchmove mousemove','.temp_list li',function(){
                var listHeight = $(this)[0].offsetHeight;
                if(event.targetTouches != undefined && event.targetTouches[0] != undefined){
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
                }

            });
        }
    });

    /**
     * 编辑
     */
    $(document).on('touchend','.edit_temp',function () {
        location.href="add_template.html";
    });

    /**
     * 删除
     */
    $(document).on('touchend','.delete_temp',function () {
        delTempLayer = layer.open({
            type: 1,
            area: ['548px', '345px'],
            shade: [0.2, '#000'],
            title: '',
            skin: '',
            content: $(".erro")
        })
    });
    // 删除模版-取消
    $(document).on('touchend', '.erro button', function () {
        layer.close(delTempLayer);
    });
    // 删除模版-确定
    $(document).on('touchend', '.erro button', function () {

        var index = parseInt($(this).attr('voice-index'));
        layer.close(delTempLayer);
    });

    /**
     * 点击添加模版
     */
    $('.eBtn').click(function(){
        location.href = 'add_template.html';
    });
})