$(function(){
    //登录相关
    //if(!sessionStorage.openid){
    //    wechatCode(location.href);
    //};
    $('.load_t').show();
    var loading;
    if(!localStorage.terEmail&&sessionStorage.openid){
        var WXnum  = {
            'wechatId'  :sessionStorage.openid
        };
        ajax_S(url.s_seac,WXnum,function(e){
            if(e.result==true){
                if(!localStorage.userId_stu){
                    sessionStorage.homeCanfig=='home'
                    location.href = '../schedule/login_s.html'
                }else{
                    sessionStorage.stuNumber = e.data.studentNo;
                    sessionStorage.schoolId = e.data.schoolId;
                    sessionStorage.studentName = e.data.studentName;
                    location.href = 'homeworklist_s.html';
                }
            }else{
                sessionStorage.homeCanfig=='home'
                location.href = '../schedule/login_s.html'
            }
        });
    }
 
    //tab
    $('.hwHeader li:last').on('touchend',function(){
        if(localStorage.mastTeater){
            alert('您当前的账户为主讲老师，暂仅能查看哦。')
        }else{
            $(this).find('a').attr('href','workIndex.html')
        }
    })
	$(document).on('tap','.firstList>p',function(){
	    if($('.firstList').eq($(this).parent().index()).find('ul').css('display')=='none'){
            $('.firstList').eq($(this).parent().index()).find('ul').show();
            $('.firstList').eq($(this).parent().index()).css("background","url(images/jiao11.png) no-repeat right 55px");
        }else{
            $('.firstList').eq($(this).parent().index()).find('ul').hide();
            $('.firstList').eq($(this).parent().index()).css("background","url(images/jiao22222.png) no-repeat right 55px");
            $('.firstList').eq($(this).parent().index()).find('ul li').css('margin-left','0px');
            $('.firstList').eq($(this).parent().index()).find('ul li').find('.remove_s').css('right','-270px');
        }

    });


	//滑动事件
	$(document).on('touchstart mouusedown','.tealist_s',function(){
        // e.stopPropagation();
	    if($(this).children('.remove_s')){
            var begin_s = parseInt(event.targetTouches[0].pageX);
            $(document).on('touchmove mousemove','.tealist_s li',function(){
                var move_s = parseInt(event.targetTouches[0].pageX);
                if(begin_s-move_s>=20){
                    if(localStorage.mastTeater){
                        alert('您当前的账户为主讲老师，暂仅能查看哦。')
                        return false;
                    }
                    $(this).siblings().css('margin-left','0px');
                    $(this).siblings().find('.remove_s').css('right','-270px');
                    $(this).css('margin-left','-181px');
                    $(this).find('.remove_s').css('right','-0px');
                    $(this).parent().css('overflow','inherit');
                    $(this).css('margin-left','-50px');
                    // return false;
                }else if(begin_s-move_s<=-20){
                    $(this).css('margin-left','0px');
                    $(this).find('.remove_s').css('right','-270px');
                    $(this).parent().css('overflow','hidden');
                    $(this).css('margin-left','0');
                    // return false;
                }
                // return false;
            });
            // return false;
        }
    });

    //校区相关
   if(localStorage.mastTeater){
        $(document).on('touchend',".select p",function(e){
        $(".select").toggleClass('open');
        e.stopPropagation();
    });
    $(document).on('touchend','.content_t .select ul li',function(e){
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
            // $(".select ul").append('<li>全部校区</li>')
            for(var i=0;i<e.data.length;i++){
                var str ='<li data-value='+e.data[i].tName+' data-code='+e.data[i].tCode+'>'+e.data[i].tName+'</li>';
                $(".select ul").append(str);
            }
            $('.content_t').find('li').eq(0).addClass('Selected');
            $('.content_t').find('p').eq(0).html(e.data[0].tName);
            
        }
    
    }
   }
    $('.truorfal input').on('touchend',function(){
        $('.big_select').hide();
        need_mas.schoolId = $('.Selected').attr('data-code');
        if ($('.Selected').attr('data-code') == undefined) {
            need_mas.schoolId = '';
        }
        getList(need_mas);
    })
    //加载更多
    $('.mor_home').on('touchend',function(){
        need_mas.ifmore  = '2';
        getList(need_mas);
    })
    var Read = '';
    // 获取老师作业列表
    if(localStorage.mastTeater){
        $('.big_select').show();
        need_mas = {
            'masterTeacherEmail':localStorage.terEmail,
            'ifmore':'1'
        }
    }else{
        need_mas = {
            'email':localStorage.terEmail,
            'schoolId':localStorage.schoolId
        }
        getList(need_mas);
    }

    function getList(need_mas){
        if(loading == undefined){
            loading = layer.load();
        }
        ajax_S(homework_s.t_list, need_mas, function (e) {

            layer.close(loading);
            $('.load_t').hide();
            if (e.data == undefined) {

                $('.mor_home p').html('您暂时没有更多啦！！！')
                setTimeout(function () {
                    $('.mor_home').hide()
                }, 2000)
                return false;
            }
            $('.mor_home').show();
            var list_s = e.data;
            $('.Prompt_s i').html(e.SumUpnotCorrect);
            for (var a = 0; a < list_s.length; a++) {
                for (var c = 0; c < list_s[a].length; c++) {
                    if (list_s[a][c].readStatus == 0) {
                        Read = 'state_st';
                        break;
                    } else {
                        Read = '';
                    }
                }
                $('.hwFinish>ul').append('<li class="firstList" classCode="' + list_s[a][0].classCode + '" courseCode="' + list_s[a][0].courseCode + '"> <p style="display: inline-block;height: 100%;width: 100%;">' + list_s[a][0].className + '&nbsp;(' + list_s[a][0].studentNum + '人)</p><span class=' + Read + '></span><ul class="secul tealist_s"></ul></li>');
                for (var b = 0; b < list_s[a].length; b++) {
                    if ((parseInt(list_s[a][b].yescommit) + parseInt(list_s[a][b].nocorrect)) == list_s[a][0].studentNum || list_s[a][b].yescommit == list_s[a][0].studentNum) {
                        if (list_s[a][b].nocorrect == 0 && list_s[a][b].notcommit == 0) {
                            if (list_s[a][b].homeworkType == "") {
                                $('.tealist_s').eq(a).append(' <li><span>' + list_s[a][b].homeworkTime + '</span><p class="state_s">已批:' + list_s[a][b].yescorrect + '/未批:' + list_s[a][b].nocorrect + '/未交:' + list_s[a][b].notcommit + '</p><span class="more_so"  classCode="' + list_s[a][0].classCode + '" courseCode="' + list_s[a][0].courseCode + '" homeworkTime="' + list_s[a][b].homeworkTime + '" Tid="' + list_s[a][b].id + '">查看 <img src="images/B02-2_03.png" alt="" /></span></li> ')
                            } else {
                                $('.tealist_s').eq(a).append(' <li><span class="dian">电子</span><span>' + list_s[a][b].homeworkTime + '</span><p class="state_s">已批:' + list_s[a][b].yescorrect + '/未批:' + list_s[a][b].nocorrect + '/未交:' + list_s[a][b].notcommit + '</p><span class="more_so"  classCode="' + list_s[a][0].classCode + '" courseCode="' + list_s[a][0].courseCode + '" homeworkTime="' + list_s[a][b].homeworkTime + '" Tid="' + list_s[a][b].id + '">查看 <img src="images/B02-2_03.png" alt="" /></span></li> ')
                            }

                        } else {
                            if (list_s[a][b].homeworkType == "") {
                                $('.tealist_s').eq(a).append(' <li style="color:#000;"><span>' + list_s[a][b].homeworkTime + '</span><p class="state_s">已批:' + list_s[a][b].yescorrect + '/未批:' + list_s[a][b].nocorrect + '/未交:' + list_s[a][b].notcommit + '</p><span class="more_so"  classCode="' + list_s[a][0].classCode + '" courseCode="' + list_s[a][0].courseCode + '" homeworkTime="' + list_s[a][b].homeworkTime + '" Tid="' + list_s[a][b].id + '">查看 <img src="images/B02-2_03.png" alt="" /></span></li> ')
                            } else {
                                $('.tealist_s').eq(a).append(' <li style="color:#000;"><span class="dian">电子</span><span>' + list_s[a][b].homeworkTime + '</span><p class="state_s">已批:' + list_s[a][b].yescorrect + '/未批:' + list_s[a][b].nocorrect + '/未交:' + list_s[a][b].notcommit + '</p><span class="more_so"  classCode="' + list_s[a][0].classCode + '" courseCode="' + list_s[a][0].courseCode + '" homeworkTime="' + list_s[a][b].homeworkTime + '" Tid="' + list_s[a][b].id + '">查看 <img src="images/B02-2_03.png" alt="" /></span></li> ')
                            }

                        }
                    } else {
                        if (list_s[a][b].readStatus == 0) {
                            dis_l = 'state_st';
                        } else {
                            dis_l = '';
                        }
                        if (list_s[a][b].nocorrect == 0 && list_s[a][b].notcommit == 0) {
                            if (list_s[a][b].homeworkType == "") {
                                $('.tealist_s').eq(a).append(' <li><span>' + list_s[a][b].homeworkTime + '</span><p class="state_s">已批:' + list_s[a][b].yescorrect + '/未批:' + list_s[a][b].nocorrect + '/未交:' + list_s[a][b].notcommit + '</p><span class=' + dis_l + '></span><span class="more_so"  classCode="' + list_s[a][0].classCode + '" courseCode="' + list_s[a][0].courseCode + '" homeworkTime="' + list_s[a][b].homeworkTime + '" Tid="' + list_s[a][b].id + '">查看 <img src="images/B02-2_03.png" alt="" /></span><div class="remove_s"><span name="' + list_s[a][b].className + '" time="' + list_s[a][b].homeworkTime + '" know="' + list_s[a][b].knowledgePoint + '" text="' + decodeURI(list_s[a][b].description) + '" Id="' + list_s[a][b].id + '"  classCode="' + list_s[a][b].classCode + '">修改</span><span class="delete_s" id="' + list_s[a][b].id + '">删除</span></div></li> ')
                            } else {
                                $('.tealist_s').eq(a).append(' <li><span class="dian">电子</span><span>' + list_s[a][b].homeworkTime + '</span><p class="state_s">已批:' + list_s[a][b].yescorrect + '/未批:' + list_s[a][b].nocorrect + '/未交:' + list_s[a][b].notcommit + '</p><span class=' + dis_l + '></span><span class="more_so"  classCode="' + list_s[a][0].classCode + '" courseCode="' + list_s[a][0].courseCode + '" homeworkTime="' + list_s[a][b].homeworkTime + '" Tid="' + list_s[a][b].id + '">查看 <img src="images/B02-2_03.png" alt="" /></span><div class="remove_s"><span class="changeHw" Id="' + list_s[a][b].id + '">修改</span><span class="delete_s" id="' + list_s[a][b].id + '">删除</span></div></li> ')
                            }

                        } else {
                            if (list_s[a][b].homeworkType == "") {
                                $('.tealist_s').eq(a).append(' <li style="color:#000;"><span>' + list_s[a][b].homeworkTime + '</span><p class="state_s">已批:' + list_s[a][b].yescorrect + '/未批:' + list_s[a][b].nocorrect + '/未交:' + list_s[a][b].notcommit + '</p><span class=' + dis_l + '></span><span class="more_so"  classCode="' + list_s[a][0].classCode + '" courseCode="' + list_s[a][0].courseCode + '" homeworkTime="' + list_s[a][b].homeworkTime + '" Tid="' + list_s[a][b].id + '">查看 <img src="images/B02-2_03.png" alt="" /></span><div class="remove_s"><span name="' + list_s[a][b].className + '" time="' + list_s[a][b].homeworkTime + '" know="' + list_s[a][b].knowledgePoint + '" text="' + decodeURI(list_s[a][b].description) + '" Id="' + list_s[a][b].id + '" classCode="' + list_s[a][b].classCode + '">修改</span><span class="delete_s" id="' + list_s[a][b].id + '">删除</span></div></li> ')
                            } else {
                                $('.tealist_s').eq(a).append(' <li style="color:#000;"><span class="dian">电子</span><span>' + list_s[a][b].homeworkTime + '</span><p class="state_s">已批:' + list_s[a][b].yescorrect + '/未批:' + list_s[a][b].nocorrect + '/未交:' + list_s[a][b].notcommit + '</p><span class=' + dis_l + '></span><span class="more_so"  classCode="' + list_s[a][0].classCode + '" courseCode="' + list_s[a][0].courseCode + '" homeworkTime="' + list_s[a][b].homeworkTime + '" Tid="' + list_s[a][b].id + '">查看 <img src="images/B02-2_03.png" alt="" /></span><div class="remove_s"><span class="changeHw" Id="' + list_s[a][b].id + '">修改</span><span class="delete_s" id="' + list_s[a][b].id + '">删除</span></div></li> ')
                            }

                        }
                    }
                }

            }
        }, error);
    }

    function error(){
        $('.reload').show();
        $('.hwFinish').hide();
        $('.Prompt_s').hide();
        layer.close(loading);
        $('.load_t').hide();
    }
    $('.reload img').click(function(){
        $('.reload').hide();
        $('.hwFinish').show();
        $('.Prompt_s').show();
        getList(need_mas);

    });

    
    //查看更多
    $(document).on('touchend','.more_so',function(){
            ajaxRequest('pos' +
                't',homework_s.t_stat,{Tcid:$(this).attr('tid')},function(e){

            });
        sessionStorage.classCode_s = $(this).attr('classCode');
        sessionStorage.courseCode_s = $(this).attr('courseCode');
        sessionStorage.homeworkTime_s = $(this).attr('homeworkTime');
        sessionStorage.Tid = $(this).attr('tid');
        if($(this).siblings(".dian").html()=="电子") {
            location.href='gatherE.html';
        }else{
            location.href = 'reply_t.html';
        }

    });
    // 删除
    $(document).on('touchend','.delete_s',function(){
        $('.erro').show();
        $('.big_back').show();
        var id = $(this).attr('id');
        var smal = $(this).parents('li').index();
        var big  = $(this).parents('li').parents('li').index();
        $('.erro input:last-of-type').on('touchend',function(){
            $('.erro').hide();
            $('.big_back').hide();
            ajaxRequest('post',homework_s.t_dele,{'Tcid':id},function(e){
                console.log(e)
                if(e.code=='200'){
                    if($('.firstList').eq(big).find('li').length==1){
                        $('.firstList').eq(big).remove();
                    }else{
                        $('.firstList').eq(big).find('li').eq(smal).remove();
                    }
                }else{
                    layer.msg('删除失败')
                }
            })
        });
        $('.erro input:first-of-type').on('touchend',function(){
            $('.erro').hide();
            $('.big_back').hide();
        });
    });

    //修改
    $(document).on('touchend','.remove_s span:first-of-type',function(){

        sessionStorage.Classname_x =  $(this).attr('name');
        sessionStorage.ClassTime_x =  $(this).attr('time');
        sessionStorage.knowledgePoint_x =  $(this).attr('know');
        sessionStorage.description_x =  $(this).attr('text');
        sessionStorage.id_x =  $(this).attr('Id');
        sessionStorage.classCode_in = $(this).attr('classCode');
        location.href = 'Assignment.html'
    });

    //修改
    $(document).on('touchend','.changeHw',function () {
        location.href="AssignmentE.html?isModify=1&id="+$(this).attr("Id");
    })
});