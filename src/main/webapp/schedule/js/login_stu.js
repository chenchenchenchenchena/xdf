/**
 * Created by zyc on 2017/7/31.
 */
$(function(){
   if(!sessionStorage.openid){
        wechatCode(location.href)
    }
    var WXnum  = {
        'wechatId':sessionStorage.openid
    };
    var teacherlogin=true;

    ajax_S(url.s_seac,WXnum,function(e){
        if(e.result==false){
            $('.card').show();
            $('.enter').show();
            //判断老师是否绑定
            ajax_S(url.t_wxmo,WXnum,function(daTa){
                if(daTa.data!='goE2'&&daTa.result!=false&&e.result!=undefined){
                    location.href = 'login_t.html'
                }else{
                    if(!sessionStorage.firstU2){
                        if(!sessionStorage.welCome){
                            location.href = 'welcome.html'
                        }else{
                            sessionStorage.removeItem('welCome');
                            ajax_S(url.e_elast,{'callbackFlag':'schedule'},function(e){
                                sessionStorage.firstU2 = '1';
                                location.href = e.url;
                            });
                        }
                    }else{
                        sessionStorage.removeItem('firstU2');
                        ajax_S(url.t_stulas,calbac,function(e){
                            localStorage.userId_stu = e.data.userId;
                            localStorage.Phonenum = e.data.mobile;
                            localStorage.SId  =  e.sid;
                        })
                    }
                }
            });
        }else{
            if(e.data.userid==undefined||e.data.userid==''||!localStorage.userId_stu){
                //进行过u2登录
                if( sessionStorage.firstU2 ){
                    sessionStorage.removeItem('firstU2');
                    ajax_S(url.t_stulas,calbac,function(e){
                        localStorage.userId_stu = e.data.userId;
                        localStorage.Phonenum = e.data.mobile;
                        localStorage.SId  =  e.sid;
                    })
                }else{
                    ajax_S(url.e_elast,{'callbackFlag':'schedule'},function(e){
                        sessionStorage.firstU2 = '1';
                        location.href = e.url;
                        var time_ = new Date().format("yyyy-MM-dd");
                        location.useridTime =getNewDay(time_,10)
                    });
                }
            };
            sessionStorage.stuNumber = e.data.studentNo;
            if(e.data.userid!=localStorage.userId_stu){
                layer.msg('当前登录的账号与学员绑定的账号不一致,正在前往重新登陆');
                setTimeout(function(){
                    ajax_S(url.u_loout,{'sid':localStorage.SId,'returnUrl':url.t_back},function(e){
                        if(e.result){
                            location.href = e.logoutUrl;
                        }
                    })
                },1000);
                return false;
            }
            if(new Date().format("yyyy-MM-dd")>= location.useridTime){
                layer.msg('当前登录的账号已过期,正在前往重新登陆');
                setTimeout(function(){
                    ajax_S(url.u_loout,{'sid':localStorage.SId,'returnUrl':''},function(e){
                        if(e.result){
                            location.href = e.logoutUrl;
                        }
                    })
                },1000);
                return false;
            }
            $('.enter').hide();
            if(e.data.relatedState=='1'&&e.data.mobile==''){
                $('.search').show();
                $('.stuname').html(e.data.studentName);
                $('.stutel').html('');
                $('.deterAss').hide();
                $('.stuInfo li').eq(0).html('关联结果：');
                $('.studentTitle').hide();
                $('.inputBox').hide();
                $('.search').css('margin-top','.2rem')
            }else{
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
            $(".studentLogin").eq(0).hide();
            $(".studentLogin").eq(1).show();
            $(".content").show();
            var table={
                "tableName":"dict_school_info"
            }
            ajaxRequest("POST", url.s_select, table , selectData);
        }else{
            $('.card').show();
            $('.searchTwo').hide();
            $('.noSearch').hide();
            $(".studentLogin").eq(1).hide();
            $(".studentLogin").eq(0).show();
            $(".content").hide();
        }
        $(this).addClass("show").siblings().removeClass("show");
        $(".inputBox p").eq($(this).index()).show().siblings("p").hide();
        $('input').val('')
    })
    var wxnumber = {'email':'','wechatId':sessionStorage.openid}

    //查询校区
    function selectData(e) {
        console.log(e);
        $(".select ul").html("");
        if(e.code=="200"){
            for(var i=0;i<e.data.length;i++){
                var str ='<li data-value='+e.data[i].tName+' data-code='+e.data[i].tCode+'>'+e.data[i].tName+'</li>';
                $(".select ul").append(str);
            }
        }
    }

    //查询学生信息  学员号查询
    function stusea(e){
        var num = /^\w+$/;
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
                $('.deterAss').html('立即关联');
                $('.deterAss').css('background','#00ba97')

            }else{
                $('.deterAss').html('解除关联');
                $('.deterAss').css('background','#fc1010')
            }

        }else{
            $('.search').hide();
            $('.card').hide();
            $('.noSearch').show();
            layer.msg('没有查到相关信息');
        }
    }
    function s_bind(e){
        console.log(e);
        if(e.data==undefined){
            layer.msg(e.message);
            clear();
            $('.deterAss').html('立即关联');
            $('.deterAss').css('background','#00ba97');
            location.href = 'login_s.html'

            // location.reload()
        }else{
            sessionStorage.stuNum = $('.stunum').val();
            sessionStorage.stuNumber=$('.stunum').val();
            sessionStorage.studentName=$(".stname").val();
            sessionStorage.mobile=e.data.mobile;
            sessionStorage.schoolId=e.data.schoolId;
            layer.msg('绑定成功');
            if(sessionStorage.studayCanfig=='studay'){
                location.href = '../learningSituation/report_t.html';
                sessionStorage.removeItem('studayCanfig')
            }else{
                location.href = 'schedule_s.html';
            }
            $('.deterAss').html('解除关联');
            $('.deterAss').css('background','#fc1010');
        }
    }


    //学员号查询点击
    $('.numb_log').click(function(){
        var stumore  = {'StudentCode':$('.stunum').val(),'wechatId':sessionStorage.openid,'nickName':encodeURIComponent(encodeURIComponent(sessionStorage.nickname)),'headImg': sessionStorage.headimgurl}
        ajax_S(url.s_seac,stumore,stusea)
    })
    //关联点击
    $('.deterAss').click(function(){
        var stumore  = {'StudentCode':$('.stunum').val(),'wechatId':sessionStorage.openid,'nickName':encodeURIComponent(encodeURIComponent(sessionStorage.nickname)),'headImg': sessionStorage.headimgurl};
        if($('.stunum').val()==''){
            stumore.StudentCode = sessionStorage.stuNumber
        }
        // 关联点击
        // alert($(this).html())
        if($(this).html()=='立即关联'){
            ajax_S(url.s_bind,stumore,s_bind)
        }
        //解绑
        else{
            ajax_S(url.s_nobd,stumore,s_bind)

        }
    })
    ajax_S(url.t_wxmo,wxnumber,Wxtea)//ajax请求




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
       /* console.log($(".select ul").find(".Selected").attr("data-code"));*/
        var stuname = {'name':$('.stname').val(),'mobile':$('.phoneNumber').val(),'wechatId':sessionStorage.openid,'nickName':encodeURIComponent(encodeURIComponent(sessionStorage.nickname)),'headImg': sessionStorage.headimgurl,"schoolId":$(".select ul").find(".Selected").attr("data-code")}
        // var stuname = {};
        // var name = $('.stname').val();
        // var mobile  = $('.phoneNumber').val();
        // stuname['name'] = name;
        // stuname['mobile'] = mobile;
        // var stuname = {'name':'常效新','mobile':'13739607950','wechatId':sessionStorage.openid}
        ajax_S(url.s_nafu,stuname,name_se)//ajax请求
    })


    function telbind(e){
        console.log(e);
        // alert(e.message.length!=0)
        if(e.result==true&&e.data==undefined){
            layer.msg(e.message)
            location.href = 'login_s.html'
            clear();
        }else if(e.result==false){
            layer.msg(e.message);
            // layer.msg('关联成功')
            $('.deterAss').html('解除关联');
            $('.deterAss').css('background','#fc1010')
            location.href = 'login_s.html';
            clear();
        }else{
            layer.msg('绑定成功');
            $('.deterAss').html('解除关联');
            ajax_S(url.s_seac,WXnum,stuc);
        }
    }


    $(document).on('click','.Relation',function(){
        if($(this).html()=='确认关联'){
            var stunum  = $('.stu_num').eq($(this).parent().index()-1).text()
            var stumore = {'StudentCode':stunum,'wechatId':sessionStorage.openid,'Mobile':sessionStorage.stuTel,'nickName':encodeURIComponent(encodeURIComponent(sessionStorage.nickname)),'headImg': sessionStorage.headimgurl}
            ajax_S(url.s_bind,stumore,telbind)
            // $(this).html('解除关联')
        }else{
            var stunum  = $('.stu_num').eq($(this).parent().index()-1).text()
            var stumore = {'StudentCode':stunum,'wechatId':sessionStorage.openid,'nickName':encodeURIComponent(encodeURIComponent(sessionStorage.nickname)),'headImg': sessionStorage.headimgurl}
            ajax_S(url.s_nobd,stumore,telbind)
            $(this).html('确认关联')
        }

    })
    // var WXnumber = [
    // 	'ofZfFwrZfm6zzyUCXsgpvE-0qH08'
    // 	// 'ofZfFwlCe5Br7LEYIf16fO-di2O0',
    //    // 'ofZfFwsBvoqZaBMFovXrJn6e9kEM'
    // ];
    //
    // for(var i = 0;i<WXnumber.length;i++){
    // var json = {
    //
    //    "touser":WXnumber[i],
    //
    //    "template_id":"abx4ixmg5kmC6eHacDAtjOkzbNg-sp47LZt7LNe6VT4",
    //    "url":"",
    //    "data":{
    //
    //        "Date":{
    //
    //            "value":"06月07日 19时24分",
    //
    //            "color":"#173177"
    //
    //        }
    //    }
    //
    // };
    // ajax_S('https://api.weixin.qq.com/cgi-bin/message/template/send?access_token='+sessionStorage.access_token+'',json,function(e){
    // console.log(e)
    // })

    // }
    //select
    $(".select p").click(function(e){
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

    $(document).on('click',function(){
        $(".select").removeClass("open");
    })




})