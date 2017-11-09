require(['jquery-1.11.0.min'], function () {
    require(['layer'],function() {
        //获取校区列表
        $.ajax({
            url:global.school_All,
            type: 'post',
            asyns:false,
            dataType: 'json',
            data:{"tableName":"dict_school_info"},
            success:function(e){
              if(e.data){
                  $('.power_screen').find('li').eq(0).siblings().remove();
                  for(var i = 0;i<e.data.length;i++){
                    $('.power_screen ul').append('<li schoolId="'+e.data[i].tCode+'"><img src="images/tree_checkbox_0.gif" alt="">'+e.data[i].tName+'</li>')
                  }
              }
            }
        });
        //获取用户列表
        // $.ajax({
        //     url:global.user_list,
        //     type: 'post',
        //     asyns:false,
        //     dataType: 'json',
        //     data:JSON.stringify({"schoolId":"73",'loginId':'ssdf'}),
        //     success:function(e){
        //         console.log(e);
        //         if(e.dataList){
        //             $('.power_list').find('li').eq(0).siblings().remove();
        //             for(var i = 0;i<e.dataList.length;i++){
        //                 if(e.dataList[i].isEnabled==1){
        //                     str = '已启用'
        //                 }else{
        //                     str = '已禁用'
        //                 }
        //                 $('.power_list').append('<li><span>'+e.dataList[i].school+'</span><span>'+e.dataList[i].userName+'</span><span>'+e.dataList[i].email+'</span><span>'+e.dataList[i].createTime+'</span><span>'+str+'</span><span><a href="#/userAdd" class="homework_operation">编辑</a></span></li>')
        //             }
        //         }
        //     }
        // });
        //校区筛选点击
        $(document).on('click','.power_screen li',function(){
            if($(this).find('img').attr('src').indexOf('0')!=-1){
                $(this).addClass('checkedschool');
                $(this).find('img').attr('src','images/tree_checkbox_1.gif');
                $.ajax({
                    url:global.user_list,
                    type: 'post',
                    asyns:false,
                    dataType: 'json',
                    data:JSON.stringify({"schoolId":$(this).attr('schoolId'),'loginId':'ssdf'}),
                    success:function(e){
                        if(e.dataList){
                            for(var i = 0;i<e.dataList.length;i++){
                                if(e.dataList[i].isEnabled==1){
                                    str = '已启用'
                                }else{
                                    str = '已禁用'
                                }
                                $('.power_list').append('<li><span>'+e.dataList[i].school+'</span><span>'+e.dataList[i].userName+'</span><span>'+e.dataList[i].email+'</span><span>'+e.dataList[i].createTime+'</span><span>'+str+'</span><span><a href="#/userAdd" class="homework_operation">编辑</a></span></li>')
                            }
                        }
                    }
                });
            }else{
                $(this).removeClass('checkedschool');
                $(this).find('img').attr('src','images/tree_checkbox_0.gif');
                $('.power_list').find('li').eq(0).siblings().remove();
                for(var i = 0;i<$('.checkedschool').length;i++){
                    $.ajax({
                        url:global.user_list,
                        type: 'post',
                        asyns:false,
                        dataType: 'json',
                        data:JSON.stringify({"schoolId":$('.checkedschool').eq(i).attr('schoolId'),'loginId':'ssdf'}),
                        success:function(e){
                            if(e.dataList){
                                for(var i = 0;i<e.dataList.length;i++){
                                    if(e.dataList[i].isEnabled==1){
                                        str = '已启用'
                                    }else{
                                        str = '已禁用'
                                    }
                                    $('.power_list').append('<li><span>'+e.dataList[i].school+'</span><span>'+e.dataList[i].userName+'</span><span>'+e.dataList[i].email+'</span><span>'+e.dataList[i].createTime+'</span><span>'+str+'</span><span><a href="#/userAdd" class="homework_operation">编辑</a></span></li>')
                                }
                            }
                        }
                    });
                }
            }

        });
    });
});