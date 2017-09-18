$(function(){
    /* 测试 */

    // if(!sessionStorage.openid){
    //     sessionStorage.openid = 'abcd123'
    // }
    if(!sessionStorage.openid){
        wechatCode(location.href)
    }
    var WXnum  = {
        'wechatId':sessionStorage.openid
    };
    var code_s = location.search.substring(location.search.indexOf('code')+5,location.search.indexOf('&'));
    var state_s = location.search.substring(location.search.indexOf('state')+6,location.search.length);
    var calbac = {
        'code':code_s,
        'u2State':state_s,
        'state':state_s
    };
    var teacherlogin=true;
    //学生是否绑定
    ajax_S(url.s_seac,WXnum,function(e){
        if(e.result==false){
            $('.card').show();
            $('.enter').show();
            //判断老师是否绑定
            ajax_S(url.t_wxmo,WXnum,function(daTa){
                if(daTa.data!='goE2'&&daTa.result!=false&&daTa.result!=undefined){
                    location.href = 'login_t.html'
                }else{
                    if(!localStorage.firstU2){
                        if(!localStorage.welCome){
                            location.href = 'welcome.html'
                        }else{
                            ajax_S(url.e_elast,{'callbackFlag':'schedule'},function(Json){
                                localStorage.firstU2 = '1';
                                location.href = Json.url;
                            });
                        }
                    }else{
                        ajax_S(url.t_stulas,calbac,function(Json){
                            if(Json.result==true){
                                localStorage.userId_stu = Json.data.userId;
                                localStorage.Phonenum = Json.data.mobile;
                                localStorage.SId  =  Json.sid;
                                var a = new Date();
                                var b = a.getTime()+1000*60*2;
                                localStorage.useridTime =new Date(b).format("yyyy-MM-dd hh:mm:ss")
                            }
                        })
                    }
                }
            });
        }else{
            if(e.data.userid==undefined||e.data.userid==''||!localStorage.userId_stu){
                //进行过u2登录
                if( localStorage.firstU2 ){
                    ajax_S(url.t_stulas,calbac,function(daTa){
                        if(daTa.result==true){
                            localStorage.userId_stu = daTa.data.userId;
                            localStorage.Phonenum = daTa.data.mobile;
                            localStorage.SId  =  daTa.sid;
                            var a = new Date();
                            var b = a.getTime()+1000*60*2;
                            localStorage.useridTime =new Date(b).format("yyyy-MM-dd hh:mm:ss")
                        }
                    });
                    if(!localStorage.userId_stu){
                        ajax_S(url.e_elast,{'callbackFlag':'schedule'},function(e){
                            localStorage.firstU2 = '1';
                            location.href = e.url;
                        });
                    }
                }else{
                    ajax_S(url.e_elast,{'callbackFlag':'schedule'},function(e){
                        localStorage.firstU2 = '1';
                        location.href = e.url;
                    });
                }
            };
            sessionStorage.stuNumber = e.data.studentNo;
            if(!localStorage.useridTime){
                ajax_S(url.t_stulas,calbac,function(daTa){
                    if(daTa.result==true){
                        localStorage.userId_stu = daTa.data.userId;
                        localStorage.Phonenum = daTa.data.mobile;
                        localStorage.SId  =  daTa.sid;
                        var a = new Date();
                        var b = a.getTime()+1000*60*2;
                        localStorage.useridTime =new Date(b).format("yyyy-MM-dd hh:mm:ss")
                    }
                })
            }
            if(e.data.userid==''){
                var stumore  = {'StudentCode':e.data.studentNo,'wechatId':sessionStorage.openid,'nickName':encodeURIComponent(encodeURIComponent(sessionStorage.nickname)),'headImg': sessionStorage.headimgurl,'userid': localStorage.userId_stu,'Mobile': localStorage.Phonenum};
                ajax_S(url.s_bind,stumore,function(Json){
                    if(Json.data==undefined){
                        layer.msg(Json.message);
                    }else{
                        $('.true_last').css('background','#00ba97');
                        layer.msg('绑定成功');
                        $('.deterAss').hide();
                    }
                })
            }
            if(e.data.userid!=localStorage.userId_stu&&e.data.userid!=''&&localStorage.userId_stu!=undefined){
                layer.msg('当前登录的账号与学员绑定的账号不一致,正在前往重新登陆');
                setTimeout(function(){
                    ajax_S(url.u_loout,{'sid':localStorage.SId,'returnUrl':url.t_back},function(Json){
                        if(Json.result){
                            localStorage.removeItem('useridTime');
                            localStorage.removeItem('userId_stu');
                            localStorage.removeItem('SId');
                            localStorage.removeItem('Phonenum');
                            localStorage.removeItem('firstU2');
                            location.href = Json.logoutUrl;
                        }
                    })
                },1000);
                return false;
           }
            if(new Date().format("yyyy-MM-dd hh:mm:ss")>= localStorage.useridTime){
                layer.msg('当前登录的账号已过期,正在前往重新登陆');
                setTimeout(function(){
                    ajax_S(url.u_loout,{'sid':localStorage.SId,'returnUrl':url.t_back},function(Json){
                        if(Json.result){
                            localStorage.removeItem('useridTime');
                            localStorage.removeItem('userId_stu');
                            localStorage.removeItem('SId');
                            localStorage.removeItem('Phonenum');
                            localStorage.removeItem('firstU2');
                            location.href = Json.logoutUrl;
                        }
                    })
                },1000);
                return false;
            }
            $('.enter').hide();
            $('.content').hide();
            if(e.data.relatedState=='1'&&e.data.mobile==''){
                sessionStorage.stuNumber = e.data.studentNo;
                $('.search').show();
                $('.stuname').html(e.data.studentName);
                $('.stutel').html('');
                $('.deterAss').hide();
                $('.stuInfo li').eq(0).html('关联结果：');
                $('.studentTitle').hide();
                $('.inputBox').hide();
                $('.enter').hide();
                $('.search').css('margin-top','.2rem')
            }else{
                sessionStorage.stuNumber = e.data.studentNo;
                //手机号+姓名查询
                $('.searchTwo').show();
                $('.card').hide();
                $('.studentTitle').hide();
                $('.inputBox').hide();
                $('.enter').show();
                $('.searchTwo li').eq(0).html('关联结果：');
                $('.stuNum li').eq(1).remove();
                $('.stuNum').append('<li class="new_S"><span  style="display:inline-block;width:2rem;text-align:right;">姓名</span><span class="stu_num">'+e.data.studentName+'</span></li>');
                $('.stuNum').append('<li class="new_S"><span  style="display:inline-block;width:2rem;text-align:right;">手机号</span><span class="stu_num">'+e.data.mobile+'</span></li>');
                $('.searchTwo').css('margin-top','.5rem');
                if(e.data.relatedState=='1'){
                    $('.Relation').html('取消关联')
                }else{
                    $('.Relation').html('确认关联')

                }
                $('.enter').hide()
            }
        }
    });


















    function clear(){
        sessionStorage.removeItem("schoolId");
        sessionStorage.removeItem("stuNum");
        sessionStorage.removeItem("studentName");
        sessionStorage.removeItem("stuNumber");
        sessionStorage.removeItem("mobile");
    }

    // tab切换
    $(".studentTitle li").on('touchend',function(){
        if($(this).index()==1){
            $('.card').hide();
            $('.search').hide();
            $('.noSearch').hide();

        }else{
            $('.card').show();
            $('.searchTwo').hide();
            $('.noSearch').hide();
        }
        $(this).addClass("show").siblings().removeClass("show");
        $(".inputBox p").eq($(this).index()).show().siblings("p").hide();
        $('input').val('')
    });

    //查询学生信息  学员号查询
    function stusea(e){
        var num = /^\w+$/
        if($('.studentLogin input').val()==''){
            layer.msg('请先输入学员号');
            return false;
        }
        if(!num.test($('.studentLogin input').val())){
            layer.msg('请输入正确格式学员号');
            return false;
        }
        if(e.result==true){
            $('.noSearch').hide();
            $('.card').hide();
            $('.search').show();
            $('.stuname').html(e.data.studentName);
            $('.stutel').html('');
            sessionStorage.stuNumber = $('.studentLogin input').val();
            sessionStorage.schoolId = e.data.schoolId;
            if(e.data.relatedState=='0'){
                $('.deterAss').html('立即关联')
                $('.deterAss').css('background','#00ba97')

            }else{
                $('.deterAss').html('解除关联')
                $('.deterAss').css('background','#fc1010')
            }

        }else{
            $('.search').hide()
            $('.card').hide();
            $('.noSearch').show();
            layer.msg('没有查到相关信息');
        }
    }

    //学员号查询点击
    $('.numb_log').click(function(){
        var stumore  = {'StudentCode':$('.stunum').val(),'wechatId':sessionStorage.openid,'nickName':encodeURIComponent(encodeURIComponent(sessionStorage.nickname)),'headImg': sessionStorage.headimgurl,'schoolid':$('.Selected').attr('data-code')};
        ajax_S(url.s_seac,stumore,stusea)
    });
    //关联点击
    $('.deterAss').click(function(){
        $('.noRecord').show();

    });
    $('.Esc_last').on('touchend',function(){
        $('.noRecord').hide();
    });
    $('.true_last').on('touchend',function(){
        if($(this).css('background-color')=='rgb(204, 204, 204)'){
            layer.msg('正在提交，请稍后');
            return false;
        }
        $(this).css('background','#ccc');
        var stumore  = {'StudentCode':$('.stunum').val(),'wechatId':sessionStorage.openid,'nickName':encodeURIComponent(encodeURIComponent(sessionStorage.nickname)),'headImg': sessionStorage.headimgurl,'userid': localStorage.userId_stu,'Mobile': localStorage.Phonenum};
        if($('.stunum').val()==''){
            stumore.StudentCode = sessionStorage.stuNumber
        }
        // 关联点击
        // if($(this).html()=='立即关联'){
            ajax_S(url.s_bind,stumore,function(e){
                if(e.data==undefined){
                    layer.msg(e.message);
                    // clear();
                    $('.deterAss').html('立即关联');
                    $('.deterAss').css('background','#00ba97');
                        location.href = 'login_s.html'
                    // location.reload()
                }else{
                    var a = new Date();
                    var b = a.getTime()+1000*60*2;
                    localStorage.useridTime =new Date(b).format("yyyy-MM-dd hh:mm:ss")
                    $('.true_last').css('background','#00ba97');
                    sessionStorage.stuNum = e.data.studentNo;
                    sessionStorage.studentName=e.data.studentName;
                    sessionStorage.mobile=e.data.mobile;
                    sessionStorage.schoolId=e.data.schoolId;
                    layer.msg('绑定成功');
                    $('.deterAss').hide();
                    if(sessionStorage.studayCanfig=='studay'){
                        location.href = '../learningSituation/report_t.html';
                        sessionStorage.removeItem('studayCanfig')
                    }else{
                        location.href = 'schedule_s.html';
                    }
                }
            })
        // }
        //解绑
        // else{
        //     ajax_S(url.s_nobd,stumore,s_bind)
        //
        // }



    });
    // 姓名手机号查询
    function name_se(e){
        $('.noSearch').hide();
        $('.searchTwo').hide();
        $('.new_S').remove();
        console.log(e);
        var  studentNo =  e.data
        var tel  = /^1[34578]\d{9}$/
        if($('.phoneNumber').val()==''||$('.stname').val()==''){
            layer.msg('请先将信息填写完整');
            return false;
        }
        if(!tel.test($('.phoneNumber').val())){
            layer.msg('请输入正确格式手机号');
            return false;
        }
        if(e.result==false){
            $('.noSearch').show()
            return false;
        }
        $('.searchTwo').show()
        var  num = 0;
        var  bindz = ''
        for(var i = 0;i<studentNo.length;i++){
            if(studentNo[i].state=='0'){
                bindz = '确认关联'
            }else{
                bindz = '取消关联'
            }
            $('.stuNum').append('<li class="new_S"><span>学员号'+i+1+':</span><span class="stu_num">'+studentNo[i].stNo+'</span><button class="Relation">'+bindz+'</button></li>')
            sessionStorage.stuTel = $('.phoneNumber').val()
        }
        $('.enter').hide()
    }

    $('.tel_log').click(function(){
        var stuname = {'name':$('.stname').val(),'mobile':$('.phoneNumber').val(),'wechatId':sessionStorage.openid,'nickName':encodeURIComponent(encodeURIComponent(sessionStorage.nickname)),'headImg': sessionStorage.headimgurl,'schoolid':$('.Selected').attr('data-code')}
        ajax_S(url.s_nafu,stuname,name_se)//ajax请求
    })

    function telbind(e){
        if(e.result==true&&e.data==undefined){
            layer.msg(e.message)
            location.href = 'login_s.html'
            clear();
        }else if(e.result==false){
            layer.msg(e.message)
            // layer.msg('关联成功')
            $('.deterAss').html('解除关联');
            $('.deterAss').css('background','#fc1010');
            clear();
        }else{
            layer.msg('绑定成功');
            $('.deterAss').html('解除关联');
            ajax_S(url.s_seac,WXnum,stuc);
        }
    }

    $(document).on('click','.Relation',function(){
        if($(this).html()=='确认关联'){
            var stunum  = $('.stu_num').eq($(this).parent().index()-1).text();
            var stumore = {'StudentCode':stunum,'wechatId':sessionStorage.openid,'Mobile':sessionStorage.stuTel,'nickName':encodeURIComponent(encodeURIComponent(sessionStorage.nickname)),'headImg': sessionStorage.headimgurl,'userid': localStorage.userId_stu,'Mobile': localStorage.Phonenum};
            ajax_S(url.s_bind,stumore,telbind)
            // $(this).html('解除关联')
        }else{
            var stunum  = $('.stu_num').eq($(this).parent().index()-1).text();
            var stumore = {'StudentCode':stunum,'wechatId':sessionStorage.openid,'nickName':encodeURIComponent(encodeURIComponent(sessionStorage.nickname)),'headImg': sessionStorage.headimgurl,'userid': localStorage.userId_stu,'Mobile': localStorage.Phonenum};
            ajax_S(url.s_nobd,stumore,telbind);
            $(this).html('确认关联')
        }

    })

    //校区相关
    $(".select p").click(function(e){
        if(!sessionStorage.signal){return false;}
        $(".select").toggleClass('open');
        e.stopPropagation();
    });
    $(document).on('click','.content .select ul li',function(e){
        /* $(".content .select ul li").click(function(e){*/
        var _this=$(this);
        $(".select > p").text(_this.attr('data-value'));
        _this.addClass("Selected").siblings().removeClass("Selected");
        $(".select").removeClass("open");
        e.stopPropagation();
    });
    var table={
        "tableName":"dict_school_info"
    }
    ajaxRequest("POST", url.s_select, table , selectData);
    function selectData(e) {
        console.log(e);
        $(".select ul").html("");
        if(e.code=="200"){
            for(var i=0;i<e.data.length;i++){
                var str ='<li data-value='+e.data[i].tName+' data-code='+e.data[i].tCode+'>'+e.data[i].tName+'</li>';
                $(".select ul").append(str);
            }
            $('.content').find('li').eq(0).addClass('Selected');
            $('.content').find('p').eq(0).html(e.data[0].tName);
        }
    }




});