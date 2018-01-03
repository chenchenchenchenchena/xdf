//新建  编辑 用户

require(['jquery-1.11.0.min'], function () {
    require(['layer'],function() {
        // 重置左导航
        var number_l = 0;
        var url_l =  location.href;

        if(url_l.indexOf('homework')!=-1||url_l.indexOf('homeworkdetail')!=-1){
            number_l = 1;
        }
        else if(url_l.indexOf('lesstime')!=-1||url_l.indexOf('lesstime_detail')!=-1){
            number_l = 2;
        }
        else if(url_l.indexOf('power')!=-1||url_l.indexOf('userAdd')!=-1||url_l.indexOf('useredit')!=-1){
            number_l = 4
        }
        else if(url_l.indexOf('master')!=-1){
            number_l = 4
        }
        else if (url_l.indexOf('learn') != -1) {
            number_l = 3
        }
        var $bure_true = $('.left_nav ul li').eq(number_l);
        $bure_true.addClass('activ_nav').siblings().removeClass('activ_nav');

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
            data:JSON.stringify({'userId':sessionStorage.userId}),
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
            $('.adduser_sea img').off("click").on('click',seachUser);
            $('.adduser_sea input').off("keyup").on('keyup',function(){
                seachUser();
                var num_zz  = /^[0-9a-zA_Z]+$/;
                if(num_zz.test($(this).val())!=false){

                }else{
                    $(this).val(null);
                    $(this).blur();
                    $('.adduser_list').hide().find('li').remove();
                }
            });

            //搜索用户
            function seachUser(){
                $('.name_l').val(null);
                $('.comname_l').val(null);
                // console.log($(this).attr('src'))
                if($('.adduser_sea input').val()!=''){
                    $.ajax({
                        url:global.user_seac,
                        type: 'post',
                        asyns:false,
                        dataType: 'json',
                        data:JSON.stringify({"keyword":$('.power_screen input').val()}),
                        success:function(e){
                            if(e.data&&e.data.length!=0&&$('.power_screen input').val()!=''){
                                $('.adduser_list').find('li').remove();
                                for(var i = 0;i<e.data.length;i++){
                                    $('.adduser_list').show();
                                    $('.adduser_list').append('<li name="'+e.data[i].name+'" comname="'+e.data[i].companyName+'" deptName="'+e.data[i].deptName+'" userId="'+e.data[i].emailAddr+'">'+e.data[i].emailAddr+'</li>')
                                }
                            }else{
                                $('.new_username').hide();
                                $('.adduser_list').hide();
                                $('.adduser_list').find('li').remove();
                            }
                        }
                    });
                }else{
                    $('.adduser_list').hide();
                    $('.adduser_list').find('li').remove();
                }
            }

            //选取事件
            $('.adduser_list').off('click').on('click','li',function(){

                $('.adduser_sea input').val($(this).html());
                $('.adduser_sea input').attr('name',$(this).attr('name'));
                $('.adduser_sea input').attr('comname',$(this).attr('comname'));
                $('.adduser_sea input').attr('deptName',$(this).attr('deptName'));
                $('.adduser_sea input').attr('userId',$(this).attr('userId'));
                $('.name_l,.comname_l').siblings().css('width','auto')
                $('.name_l').val($('.adduser_sea input').attr('name'));
                $('.comname_l').val($('.adduser_sea input').attr('deptName'));
                $('.adduser_list').hide();
                $('.adduser_list').find('li').remove();
            });
            //面包屑
            $('.index_title h4 i').click(function(){
                history.go(-1)
            });
            $('.user_operation_cancel').eq(0).click(function(){
             });


            // 权限事件
            $('.user_powerlist').off("click").on('click','li',function(){
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
                $('.user_Enable').show();
            });
            $('.usernew_true').click(function(){
            var emailtest =  /[^\u4e00-\u9fa5]/;
            if( $(this).attr('checked')){
                layer.msg('正在提交');
                $('.user_Enable').hide();
                $('.user_Prompt_confirm').removeAttr('checked');

                return false;
            }
            if($('.homework_sea input').val()==''){
                layer.msg('请输入账号');
                $('.user_Enable').hide();
                $('.user_Prompt_confirm').removeAttr('checked');
                return false;
            }
            if($('.name_l').val()==''){
                layer.msg('请输入姓名');
                $('.user_Enable').hide();
                $('.user_Prompt_confirm').removeAttr('checked');
                return false;
            }
            if($('.comname_l').val()==''){
                layer.msg('请输入所在学校地区');
                $('.user_Enable').hide();
                $('.user_Prompt_confirm').removeAttr('checked');
                return false;
            }
            if($('.checked_power').length==0){
                layer.msg('请选择相关权限');
                $('.user_Enable').hide();
                $('.user_Prompt_confirm').removeAttr('checked');
                return false;
            }
            if($('.checked_school').length==0){
                layer.msg('请选择相关校区');
                $('.user_Enable').hide();
                $('.user_Prompt_confirm').removeAttr('checked');
                return false;
            }
            if(!emailtest.test($('.homework_sea input').val())){
                layer.msg('请输入合法账号');
                $('.user_Prompt_confirm').removeAttr('checked');
                $('.user_Enable').hide();
                return false;
            }

            $(this).attr('checked',true);
            var config = {
                loginId:$('.homework_sea input').val(),
                userName:$('.name_l').val(),
                email:$('.homework_sea input').val()+'@xdf.cn',
                department:$('.homework_sea input').attr('deptName'),
                school:$('.comname_l').val()
            };
                if($('.name_l').val()==''){
                    layer.msg('请输入姓名');
                    $('.user_Enable').hide();
                    return false;
                }
                if($('.comname_l').val()==''){
                    layer.msg('请输入所在学校地区');
                    $('.user_Enable').hide();
                    return false;
                }
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
                    if(e.result&&e.code!=1){
                        $.ajax({
                            url:global.user_power,
                            type: 'post',
                            asyns:false,
                            dataType: 'json',
                            data:JSON.stringify({userId:$('.homework_sea input').val(),functionIds:powerId.join(',')}),
                            success:function(e){
                                if(e.result){
                                    $('.user_operation_confirm').removeAttr('checked');
                                    layer.msg('新建成功');
                                    history.go(-1)
                                }else{
                                    $('.user_operation_confirm').removeAttr('checked');
                                    layer.msg('新建失败');
                                    $('.user_Enable').hide();
                                }
                            }
                        });
                    }else{
                        $('.user_Prompt_confirm').removeAttr('checked');
                        $('.user_Enable').hide();
                        layer.msg('请不要重复新建用户');
                    }
                }
            });
        });
            $('.user_Enable input:last-of-type').click(function(){
                $(this).parent().hide();
                $('.usernew_true').removeAttr('checked');
            })


    })
});