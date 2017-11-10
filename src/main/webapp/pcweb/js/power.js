require(['jquery-1.11.0.min'], function () {
    require(['layer'],function() {
        //获取校区列表
        // $.ajax({
        //     url:global.school_All,
        //     type: 'post',
        //     asyns:false,
        //     dataType: 'json',
        //     data:{"tableName":"dict_school_info"},
        //     success:function(e){
        //       if(e.data){
        //           $('.power_index').find('li').eq(0).siblings().remove();
        //           for(var i = 0;i<e.data.length;i++){
        //             $('.power_index ul').append('<li schoolId="'+e.data[i].tCode+'"><img src="images/tree_checkbox_0.gif" alt="">'+e.data[i].tName+'</li>')
        //           }
        //       }
        //     }
        // });
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
        // $(document).on('click','.power_index li',function(){
        //     if($('.homework_sea input').val()!=''){
        //         var schoolid = $('.checkedschool').attr('schoolid')
        //     }else{
        //         var schoolid = $(this).attr('schoolId')
        //     }
        //     if($(this).hasClass('checkedschool')){
        //         $('.power_list').find('li').eq(0).siblings().remove();
        //         $(this).find('img').attr('src','images/tree_checkbox_0.gif');
        //         $(this).removeClass('checkedschool')
        //         return false;
        //     }
        //     $(this).find('img').attr('src','images/tree_checkbox_1.gif');
        //     $(this).addClass('checkedschool');
        //     $(this).siblings().removeClass('checkedschool');
        //     $(this).siblings().find('img').attr('src','images/tree_checkbox_0.gif');
            $.ajax({
                url:global.user_list,
                type: 'post',
                asyns:false,
                dataType: 'json',
                data:JSON.stringify({'loginId':''}),
                success:function(e){
                    if(e.dataList){
                        $('.power_list').find('li').eq(0).siblings().remove();
                        for(var i = 0;i<e.dataList.length;i++){
                            if(e.dataList[i].isEnabled==1){
                                str = '已启用'
                            }else{
                                str = '已禁用'
                            }
                            if(e.dataList[i].id==1){
                                $('.power_list').append('<li><span>'+e.dataList[i].school+'</span><span>'+e.dataList[i].userName+'</span><span>'+e.dataList[i].email+'</span><span>'+e.dataList[i].createTime+'</span><span>'+str+'</span><span></span></li>')
                            }else{
                                $('.power_list').append('<li><span>'+e.dataList[i].school+'</span><span>'+e.dataList[i].userName+'</span><span>'+e.dataList[i].email+'</span><span>'+e.dataList[i].createTime+'</span><span>'+str+'</span><span><a href="javascript:;" class="homework_operation"  schoolId="'+e.dataList[i].auth+'" loginId="'+e.dataList[i].loginId+'" edite_bur="'+e.dataList[i].isEnabled+'">编辑</a></span></li>')
                            }
                        }
                    }
                }
            });
        //
        //
        // });

        $('.powerindex_sea img').on('click',function(){
            $.ajax({
                url:global.user_list,
                type: 'post',
                asyns:false,
                dataType: 'json',
                data:JSON.stringify({'loginId':$('.homework_sea input').val()}),
                success:function(e){
                    if(e.dataList){
                        $('.power_list').find('li').eq(0).siblings().remove();
                        for(var i = 0;i<e.dataList.length;i++){
                            if(e.dataList[i].isEnabled==1){
                                str = '已启用'
                            }else{
                                str = '已禁用'
                            }
                            if(e.dataList[i].id==1){
                                $('.power_list').append('<li><span>'+e.dataList[i].school+'</span><span>'+e.dataList[i].userName+'</span><span>'+e.dataList[i].email+'</span><span>'+e.dataList[i].createTime+'</span><span>'+str+'</span><span></span></li>')
                            }else{
                                $('.power_list').append('<li><span>'+e.dataList[i].school+'</span><span>'+e.dataList[i].userName+'</span><span>'+e.dataList[i].email+'</span><span>'+e.dataList[i].createTime+'</span><span>'+str+'</span><span><a href="javascript:;" class="homework_operation"  schoolId="'+e.dataList[i].auth+'" loginId="'+e.dataList[i].isEnabled+'">编辑</a></span></li>')
                            }
                        }
                    }
                }
            });
        })
        $(document).on('click','.homework_operation',function(){
            sessionStorage.loginId = $(this).attr('loginId');
            sessionStorage.schoolId = $(this).attr('schoolId');
            sessionStorage.edite_bur = $(this).attr('edite_bur');
            var url =  location.href;
            location.href =url.substr(0,url.indexOf('?'))+'#/useredit'
        });


    });
});