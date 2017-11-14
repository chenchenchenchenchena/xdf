require(['jquery-1.11.0.min'], function () {
    require(['layer','jqPaginator.min'],function() {
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
        var page = 1;
        var totalCounts = 0;
        initPage(totalCounts, page);
            $.ajax({
                url:global.user_list,
                type: 'post',
                asyns:false,
                dataType: 'json',
                data:JSON.stringify({'loginId':'','pageNum':page,'pageSize':'15'}),
                success:function(e){
                    if(e.Data.list){
                        var allLength = e.Data.list;
                        initPage(e.Data.total, e.Data.pageNum);
                        $('.PublicPage ').css({
                            'margin-top':'20px'
                        })
                        $('.power_list').find('li').eq(0).siblings().remove();
                        for(var i = 0;i<allLength.length;i++){
                            if(allLength[i].isEnabled==1){
                                str = '已启用'
                            }else{
                                str = '已禁用'
                            }

                            if(allLength[i].loginId=='ssdf'){
                                $('.power_list').append('<li><span title="'+allLength[i].school+'">'+allLength[i].school+'</span><span>'+allLength[i].userName+'</span><span>'+allLength[i].email+'</span><span>'+allLength[i].createTime+'</span><span>'+str+'</span><span></span></li>')
                            }else{
                                $('.power_list').append('<li><span title="'+allLength[i].school+'">'+allLength[i].school+'</span><span>'+allLength[i].userName+'</span><span>'+allLength[i].email+'</span><span>'+allLength[i].createTime+'</span><span>'+str+'</span><span><a href="javascript:;" class="homework_operation"  schoolId="'+allLength[i].auth+'" loginId="'+allLength[i].loginId+'" edite_bur="'+allLength[i].isEnabled+'" id_s="'+allLength[i].id+'">编辑</a></span></li>')
                            }
                        }
                    }
                }
            });

        //
        //
        // });

        $('.powerindex_sea img').off("click").on('click',seachlist);
        function seachlist(){
            $('.adduser_list').hide();
            $('.adduser_list').find('li').remove();
            // page++;
            $.ajax({
                url:global.user_list,
                type: 'post',
                asyns:false,
                dataType: 'json',
                data:JSON.stringify({'loginId':$('.powerindex_sea input').val(),'pageNum':'1','pageSize':'15'}),
                success:function(e){
                    if(!e.message){
                        var allLength = e.Data.list;
                        initPage(e.Data.total, e.Data.pageNum);
                        $('.PublicPage ').css({
                            // 'width':'812px',
                            'margin-top':'20px'
                        })
                        $('.power_list').find('li').eq(0).siblings().remove();
                        for(var i = 0;i<allLength.length;i++){
                            if(allLength[i].isEnabled==1){
                                str = '已启用'
                            }else{
                                str = '已禁用'
                            }

                            if(allLength[i].loginId=='ssdf'){
                                $('.power_list').append('<li><span title="'+allLength[i].school+'">'+allLength[i].school+'</span><span>'+allLength[i].userName+'</span><span>'+allLength[i].email+'</span><span>'+allLength[i].createTime+'</span><span>'+str+'</span><span></span></li>')
                            }else{
                                $('.power_list').append('<li><span title="'+allLength[i].school+'">'+allLength[i].school+'</span><span>'+allLength[i].userName+'</span><span>'+allLength[i].email+'</span><span>'+allLength[i].createTime+'</span><span>'+str+'</span><span><a href="javascript:;" class="homework_operation"  schoolId="'+allLength[i].auth+'" loginId="'+allLength[i].loginId+'" edite_bur="'+allLength[i].isEnabled+'" id_s="'+allLength[i].id+'">编辑</a></span></li>')
                            }
                        }
                        $('#publicPage').show();
                    }else{
                        $('.user_Prompt').show();
                        $('.adduser_list').find('li').remove();
                        // $('#publicPage').hide();
                    }
                }
            });
        }
        $('.user_Prompt_confirm').click(function(){
            $(this).parent().hide();
        });
        $(document).off("click").on('click','.homework_operation',function(){
            sessionStorage.loginId = $(this).attr('loginId');
            sessionStorage.schoolId = $(this).attr('schoolId');
            sessionStorage.id_s = $(this).attr('id_s');
            sessionStorage.edite_bur = $(this).attr('edite_bur');
            var url =  location.href;
            location.href =url.substr(0,url.indexOf('?'))+'#/useredit'
        });
        //搜索框事件
        // $('.powerindex_sea img').off("click").on('click',function(){
        //
        // });
        // $('.powerindex_sea input').off("keyup").on('keyup',seachUser);

        //搜索用户
        function seachUser(){
            if($('.powerindex_sea input').val()!=''){
                $.ajax({
                    url:global.user_seac,
                    type: 'post',
                    asyns:false,
                    dataType: 'json',
                    data:JSON.stringify({"keyword":$('.powerindex_sea input').val()}),
                    success:function(e){
                        if(e.data&&e.data.length!=0){
                            $('.adduser_list').find('li').remove();
                            for(var i = 0;i<e.data.length;i++){
                                $('.adduser_list').show();
                                $('.adduser_list').append('<li name="'+e.data[i].name+'" comname="'+e.data[i].companyName+'" deptName="'+e.data[i].deptName+'">'+e.data[i].emailAddr+'</li>')
                            }
                        }
                    }
                });
            }else{
                $('.adduser_list').hide();
                $('.adduser_list').find('li').remove();
            }
        }
        //选取用户列表
        $('.adduser_list').off("click").on('click','li',function(){
            $('.powerindex_sea input').val($(this).html());
            $('.powerindex_sea input').attr('name',$(this).attr('name'));
            $('.powerindex_sea input').attr('comname',$(this).attr('comname'));
            $('.powerindex_sea input').attr('deptName',$(this).attr('deptName'));
            $('.new_username').show().html('姓名：'+$('.adduser_sea input').attr('name'));
            $('.adduser_list').hide();
            $('.adduser_list').find('li').remove();
        });
    });
});
function initPage(totalCounts, currentPage) {
    if (totalCounts != null && totalCounts != 0) {
        $.jqPaginator("#publicPage", {
            totalCounts: totalCounts,
            pageSize: 15,
            visiblePages: 10,
            currentPage: currentPage,
            prev: '<a class="pPrev" href="javascript:;">上一页</a>',
            next: '<a class="pNext" href="javascript:;">下一页</a>',
            page: '<a href="javascript:;">{{page}}</a>',
            activeClass: 'pCurrent',
            onPageChange: function (num, type) {
                if (type != "init") {
                    page = num;
                    seachlist_(page);
                }
            }
        });
    } else {
        $("#publicPage").html("");
    }
}
function seachlist_(page){
    $('.adduser_list').hide();
    $('.adduser_list').find('li').remove();
    // page++;
    $.ajax({
        url:global.user_list,
        type: 'post',
        asyns:false,
        dataType: 'json',
        data:JSON.stringify({'loginId':$('.powerindex_sea input').val(),'pageNum':page,'pageSize':'15'}),
        success:function(e){
            if(!e.message){
                var allLength = e.Data.list;
                // initPage(allLength.length, e.Data.page);
                $('.PublicPage ').css({
                    // 'width':'812px',
                    'margin-top':'20px'
                })
                $('.power_list').find('li').eq(0).siblings().remove();
                for(var i = 0;i<allLength.length;i++){
                    if(allLength[i].isEnabled==1){
                        str = '已启用'
                    }else{
                        str = '已禁用'
                    }

                    if(allLength[i].loginId=='ssdf'){
                        $('.power_list').append('<li><span title="'+allLength[i].school+'">'+allLength[i].school+'</span><span>'+allLength[i].userName+'</span><span>'+allLength[i].email+'</span><span>'+allLength[i].createTime+'</span><span>'+str+'</span><span></span></li>')
                    }else{
                        $('.power_list').append('<li><span title="'+allLength[i].school+'">'+allLength[i].school+'</span><span>'+allLength[i].userName+'</span><span>'+allLength[i].email+'</span><span>'+allLength[i].createTime+'</span><span>'+str+'</span><span><a href="javascript:;" class="homework_operation"  schoolId="'+allLength[i].auth+'" loginId="'+allLength[i].loginId+'" edite_bur="'+allLength[i].isEnabled+'" id_s="'+allLength[i].id+'">编辑</a></span></li>')
                    }
                }
                $('#publicPage').show();
            }else{
                $('.user_Prompt').show();
                $('.adduser_list').find('li').remove();
                $('#publicPage').hide();
            }
        }
    });
}