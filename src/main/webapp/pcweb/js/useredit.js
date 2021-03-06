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
            number_l = 3
        }
        else if(url_l.indexOf('master')!=-1){
            number_l = 4
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
                    $('.user_editlist').find('li').eq(0).siblings().remove();
                    $('.user_editlist ul').prepend('<li class="user_schoolall"><img src="images/tree_checkbox_0.gif" alt="">全部</li>');
                    var school_sess = sessionStorage.schoolId.split(',');
                    for(var i = 0;i<e.data.length;i++){
                        var bure = false;
                        for(var k= 0;k<school_sess.length;k++){
                            if(school_sess[k]==e.data[i].tCode){
                                $('.user_editlist ul').append('<li schoolId="'+e.data[i].tCode+'" class="checked_school"><img src="images/tree_checkbox_1.gif" alt="">'+e.data[i].tName+'</li>')
                                bure = true;
                                break;
                            }
                        }
                        if(bure==false){
                            $('.user_editlist ul').append('<li schoolId="'+e.data[i].tCode+'"><img src="images/tree_checkbox_0.gif" alt="">'+e.data[i].tName+'</li>')
                        }
                    }
                    if($('.checked_school').length==e.data.length){
                        $('.user_schoolall').find('img').attr('src','images/tree_checkbox_1.gif');
                        $('.user_editlist li').addClass('checked_school')
                    }
                }
            }
        });
        //左侧菜单栏
        $.ajax({
            url:global.left_nav,
            type: 'post',
            asyns:false,
            dataType: 'json',
            data:JSON.stringify({'userId':sessionStorage.loginId}),
            success:function(e){
                if(e.result){
                    var onelist = e.dataList;
                    for(var i = 0;i<onelist.length;i++){
                        var onelistbure = onelist[i];
                        $('.user_editp_powerlist ul').prepend('<li class="user_powerall"><img src="images/tree_checkbox_0.gif" alt="">全部</li>');
                        for(var k = 0;k<onelistbure.children.length;k++){
                            var twolist = onelistbure.children[k];
                            if(twolist.isValid==1){
                            if(twolist.checked ==true){
                                $('.user_editp_powerlist ul').append('<li id="'+twolist.id+'" class="checked_power"><img src="images/tree_checkbox_1.gif" alt="">'+twolist.text+'</li>')
                            }else{
                                $('.user_editp_powerlist ul').append('<li id="'+twolist.id+'"><img src="images/tree_checkbox_0.gif" alt="">'+twolist.text+'</li>')
                            }
                            }
                        }
                    }
                    if($('.checked_power').length==onelistbure.children.length){
                        $('.user_editp_powerlist').find('img').attr('src','images/tree_checkbox_1.gif')
                        $('.user_editp_powerlist li').addClass('checked_power')
                    }

                }
            }
        });

        //名字重置
        $('.user_sea_last input').val(sessionStorage.loginId);
        $('.user_sea_last input').attr('disabled',true);
        $('.user_sea_last').css('background','rgb(235, 235, 228)');
        $('.user_sea_last input').css('background','rgb(235, 235, 228)');
        if(sessionStorage.edite_bur==1){
            $('.user_operation_confirm').html('禁用')
        }else{
            $('.user_operation_confirm').html('启用')
        }
        $('.index_title h4 i').click(function(){
            history.go(-1)
        });
        //选取邮箱
        $(document).off("click").on('click','.adduser_list li',function(){
            $('.user_sea_last input').val($(this).html());
            $('.user_sea_last input').attr('name',$(this).attr('name'));
            $('.adduser_list').hide();
            $('.adduser_list').find('li').remove();
        });
        //禁用或启用
        $('.user_operation_confirm').click(function(){
            if($(this).html()=='禁用'){
                $('.user_erro').show();
            }else{
                $('.user_Enable').show();
            }
        });
        //确认禁用
        $('.user_erro_true').click(function(){
            $.ajax({
                url:global.user_power_,
                type: 'post',
                asyns:false,
                dataType: 'json',
                data:JSON.stringify({"id":sessionStorage.id_s,'isEnabled':'1'}),
                success:function(e){
                    if(e.result){
                        layer.msg('禁用成功');
                        $('.user_operation_confirm').html('启用')
                        $('.user_erro').hide();
                        sessionStorage.edite_bur = 0;
                        history.go(-1)
                    }
                }
            });

        });
        //确认启用
        $('.user_Enable_true').click(function(){
            $.ajax({
                url:global.user_power_,
                type: 'post',
                asyns:false,
                dataType: 'json',
                data:JSON.stringify({"id":sessionStorage.id_s,'isEnabled':'0'}),
                success:function(e){
                    if(e.result){
                        layer.msg('启用成功');
                        $('.user_operation_confirm').html('启用');
                        $('.user_Enable').hide();
                        sessionStorage.edite_bur = 1;
                        history.go(-1);
                    }
                }
            });
        });

        //取消
        $('.user_esc').click(function(){
            $(this).parent().hide();
        });
        $('.user_operation_cancel').eq(0).click(function(){
            history.go(-1)
        });
        function seachUser(){
            if($('.user_sea_last input').val()!=''){
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
                                $('.adduser_list').append('<li name="'+e.data[i].name+'">'+e.data[i].emailAddr+'</li>')
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
        $('.user_editlist').off("click").on('click','li',function(){
            if($(this).hasClass('user_schoolall')){
                if($(this).find('img').attr('src').indexOf('0')!=-1){
                    $(this).parent().find('img').attr('src','images/tree_checkbox_1.gif');
                    $('.user_editlist li').addClass('checked_school')
                }else{
                    $(this).parent().find('img').attr('src','images/tree_checkbox_0.gif');
                    $('.user_editlist li').removeClass('checked_school')
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
        // 权限事件
        $(document).off("click").on('click','.user_powerlist li',function(){
            if($(this).hasClass('user_powerall')){
                if($(this).find('img').attr('src').indexOf('0')!=-1){
                    $(this).parent().find('img').attr('src','images/tree_checkbox_1.gif');
                    $('.user_editp_powerlist li').addClass('checked_power')
                }else{
                    $(this).parent().find('img').attr('src','images/tree_checkbox_0.gif');
                    $('.user_editp_powerlist li').removeClass('checked_power')
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

        //编辑用户提交
        $('.user_edite_two').off("click").on('click',function(){
            if($('.checked_power').length==0){
                layer.msg('请选择相关权限');
                return false;
            }
            if($('.checked_school').length==0){
                layer.msg('请选择相关校区');
                return false;
            }
            $(this).attr('checked',true);
            var config = {
                userid:$('.user_sea_last input').val(),
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
            config.functionIds = powerId.join(',');
            $.ajax({
                url:global.user_edit,
                type: 'post',
                asyns:false,
                dataType: 'json',
                data:JSON.stringify(config),
                success:function(e){
                    if(e.result){
                        if(e.result){
                            $(this).removeAttr('checked');
                            layer.msg('修改成功');
                            history.go(-1);
                        }else{
                            $(this).removeAttr('checked');
                            layer.msg('修改失败')
                        }
                    }
                }
            });
        })


    })
});