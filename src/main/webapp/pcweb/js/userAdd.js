//新建  编辑 用户

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
                    $('.user_schoollist').find('li').eq(0).siblings().remove();
                    $('.user_schoollist ul').prepend('<li class="user_schoolall"><img src="images/tree_checkbox_0.gif" alt="">全部</li>');
                    for(var i = 0;i<e.data.length;i++){
                        $('.user_schoollist ul').append('<li schoolId="'+e.data[i].tCode+'"><img src="images/tree_checkbox_0.gif" alt="">'+e.data[i].tName+'</li>')
                    }
                    $('.user_schoollist li').on('click',function(){
                        if($(this).hasClass('user_schoolall')){
                            if($(this).find('img').attr('src').indexOf('0')!=-1){
                                $(this).parent().find('img').attr('src','images/tree_checkbox_1.gif');
                                $('.user_schoollist li').addClass('checked_school')
                            }else{
                                $(this).parent().find('img').attr('src','images/tree_checkbox_0.gif');
                                $('.user_schoollist li').removeClass('checked_school')
                            }
                        }else if($(this).find('img').attr('src').indexOf('0')!=-1){
                            $(this).addClass('checked_school');
                            $(this).find('img').attr('src','images/tree_checkbox_1.gif');
                            if($('.checked_school').length==$('.user_schoollist li').length-1){
                                $('.user_schoolall').find('img').attr('src','images/tree_checkbox_1.gif')
                            }

                        }else{
                            if($('.user_schoolall').find('img').attr('src').indexOf('1')!=-1){
                                $('.user_schoolall').find('img').attr('src','images/tree_checkbox_0.gif')
                            }
                            $(this).find('img').attr('src','images/tree_checkbox_0.gif')
                            $(this).removeClass('checked_school')
                        }
                    });
                }
            }
        });
        //左侧菜单栏
        $.ajax({
            url:global.left_nav,
            type: 'post',
            asyns:false,
            dataType: 'json',
            data:JSON.stringify({'userId':'v_kouchen'}),
            success:function(e){
                if(e.result){
                    var onelist = e.dataList;
                    for(var i = 0;i<onelist.length;i++){
                        var onelistbure = onelist[i];
                            $('.user_powerlist ul').prepend('<li class="user_powerall"><img src="images/tree_checkbox_0.gif" alt="">全部</li>');
                            for(var k = 0;k<onelistbure.children.length;k++){
                                var twolist = onelistbure.children[k];
                                if(twolist.isValid ==1){
                                    $('.user_powerlist ul').append('<li id="'+twolist.id+'"><img src="images/tree_checkbox_0.gif" alt="">'+twolist.text+'</li>')
                                }
                            }
                    }
                }
            }
        });

            //搜索框事件
            $('.adduser_sea img').on('click',seachUser);
            $('.adduser_sea input').on('keyup',seachUser);
            //选取邮箱
            $(document).on('click','.adduser_list li',function(){
                $('.adduser_sea input').val($(this).html());
                $('.adduser_sea input').attr('name',$(this).attr('name'));
                $('.adduser_sea input').attr('comname',$(this).attr('comname'));
                $('.adduser_sea input').attr('deptName',$(this).attr('deptName'));
                $('.new_username').show().html('姓名：'+$('.adduser_sea input').attr('name'));
                $('.adduser_list').hide();
                $('.adduser_list').find('li').remove();
            });
            function seachUser(){
                if($('.adduser_sea input').val()!=''){
                    $.ajax({
                        url:global.user_seac,
                        type: 'post',
                        asyns:false,
                        dataType: 'json',
                        data:JSON.stringify({"keyword":$('.power_screen input').val()}),
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
            //选取事件

            // 权限事件
            $(document).on('click','.user_powerlist li',function(){
                if($(this).hasClass('user_powerall')){
                    if($(this).find('img').attr('src').indexOf('0')!=-1){
                        $(this).parent().find('img').attr('src','images/tree_checkbox_1.gif');
                        $('.user_powerlist li').addClass('checked_power')
                    }else{
                        $(this).parent().find('img').attr('src','images/tree_checkbox_0.gif');
                        $('.user_powerlist li').removeClass('checked_power')
                    }
                }else if($(this).find('img').attr('src').indexOf('0')!=-1){
                    $(this).addClass('checked_power');
                    $(this).find('img').attr('src','images/tree_checkbox_1.gif')
                    if($('.checked_power').length==$('.user_powerlist li').length-1){
                        $('.user_powerall').find('img').attr('src','images/tree_checkbox_1.gif')
                    }
                }else{
                    if($('.user_powerall').find('img').attr('src').indexOf('1')!=-1){
                        $('.user_powerall').find('img').attr('src','images/tree_checkbox_0.gif')
                        $('.user_powerall').removeClass('checked_power')
                    }
                    $(this).find('img').attr('src','images/tree_checkbox_0.gif')
                    $(this).removeClass('checked_power')
                }
            })

            //新建用户提交
            $('.user_operation_confirm').on('click',function(){
                var emailtest =  /[^\u4e00-\u9fa5]/;
                if( $(this).attr('checked')){
                    layer.msg('正在提交');
                    return false;
                }
                if($('.homework_sea input').val()==''){
                    layer.msg('请输入账号');
                    return false;
                }
                if($('.checked_power').length==0){
                    layer.msg('请选择相关权限');
                    return false;
                }
                if($('.checked_school').length==0){
                    layer.msg('请选择相关校区');
                    return false;
                }
                if(!emailtest.test($('.homework_sea input').val())){
                    layer.msg('请输入合法账号');
                    return false;
                }
                $(this).attr('checked',true);
                var config = {
                    loginId:$('.homework_sea input').val(),
                    userName:$('.homework_sea input').attr('name'),
                    email:$('.homework_sea input').val()+'@xdf.cn',
                    department:$('.homework_sea input').attr('deptName'),
                    school:$('.homework_sea input').attr('comname')
                };
                var schoolId = [];
                var powerId = [];
                for(var k = 0;k<$('.checked_school').length;k++){
                    if($('.checked_school').eq(k).attr('schoolid')!=undefined){
                        schoolId.push($('.checked_school').eq(k).attr('schoolid'))
                    }
                }
                for(var k = 0;k<$('.checked_power').length;k++){
                    if($('.checked_power').eq(k).attr('id')!=undefined){
                        powerId.push($('.checked_power').eq(k).attr('id'))
                    }
                }
                config.auth = schoolId.join(',');
                $.ajax({
                    url:global.user_addnew,
                    type: 'post',
                    asyns:false,
                    dataType: 'json',
                    data:JSON.stringify(config),
                    success:function(e){
                        if(e.result){
                            $.ajax({
                                url:global.user_power,
                                type: 'post',
                                asyns:false,
                                dataType: 'json',
                                data:JSON.stringify({userId:$('.homework_sea input').val(),functionIds:powerId.join(',')}),
                                success:function(e){
                                    if(e.result){
                                        $('.user_operation_confirm').removeAttr('checked');
                                        layer.msg('新建成功')
                                    }else{
                                        $('.user_operation_confirm').removeAttr('checked');
                                        layer.msg('新建失败')
                                    }
                                }
                            });
                        }
                    }
                });
            })




    })
});