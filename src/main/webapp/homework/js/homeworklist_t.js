$(function(){
    //获取页面跳转参数
    var checkedClassCode = GetRequest('classCode');

    //登录相关
    if(!sessionStorage.openid){
        wechatCode(location.href);
    };
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
        var this_ = $(this).parent();
	    if($('.firstList').eq($(this).parent().index()).find('ul').css('display')=='none'){
            $('.firstList').eq($(this).parent().index()).find('ul').show();
            $('.firstList').eq($(this).parent().index()).css("background","url(images/jiao11.png) no-repeat right 55px");
            getListDetails(this_);
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
        getList(need_mas,1);
    })
    //加载更多
    $('.mor_home').on('touchend',function(){
        need_mas.ifmore  = '2';
        getList(need_mas,2);
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
        getList(need_mas,3);
    }

    function getList(need_mas,flag){
        if(loading == undefined){
            loading = layer.load();
        }
        ajax_S(homework_s.t_hw_getClassList, need_mas, function (e) {

            layer.close(loading);
            $('.load_t').hide();
            if (e.data == undefined) {
                if(flag == 1){
                    $('.empty').show();
                    $('.hwFinish').hide();
                    $('.Prompt_s').hide();
                    $('.mor_home').hide();
                    return false;
                }else if(flag == 2){
                    $('.mor_home p').html('您暂时没有更多啦！！！')
                    setTimeout(function () {
                        $('.mor_home').hide()
                    }, 2000)
                    return false;
                }else {
                    $('.empty').show();
                    $('.hwFinish').hide();
                    $('.Prompt_s').hide();
                }
            }
            if(flag != 3){
                $('.mor_home').show();
            }
            for(var j = 0;j<e.data.length;j++){
            var list_s = e.data[j];
            $('.Prompt_s i').html(e.SumUpnotCorrect);
            for (var i = 0; i < list_s.length; i++) {

                if (list_s[i].readStatus == 0) {
                    Read = 'state_st';
                } else {
                    Read = '';
                }
                var courseCode = "";
                if(list_s[i].courseCode == undefined){
                    courseCode = "";
                }else {
                    courseCode = list_s[i].courseCode;
                }

                if(checkedClassCode != undefined && checkedClassCode == list_s[i].classCode){

                    //从老师主页点击进入作业列表：被选中的班级自动打开详情
                    $('.hwFinish>ul').append('<li class="firstList" style="background: url(images/jiao11.png) no-repeat right 55px" className="'+list_s[i].className+'" studentNum="'+list_s[i].studentNum+'" classCode="' + list_s[i].classCode + '" courseCode="' + courseCode + '"> ' +
                        '<p style="display: inline-block;height: 100%;width: 100%;">' + list_s[i].className + '&nbsp;(' + list_s[i].studentNum + '人)</p>' +
                        '<span class=' + Read + '></span><ul class="secul tealist_s" style="display: block"><div class="load_html"><img class="loading-back" src="../common/images/loading.gif" />' +
                        '<div class="load_fail"><img src="images/reload.png" > <span>重新加载</span></div></div></ul></li>');

                    getListDetails($('.firstList').eq(i));
                }else {
                    $('.hwFinish>ul').append('<li class="firstList" className="'+list_s[i].className+'" studentNum="'+list_s[i].studentNum+'" classCode="' + list_s[i].classCode + '" courseCode="' + courseCode + '"> ' +
                        '<p style="display: inline-block;height: 100%;width: 100%;">' + list_s[i].className + '&nbsp;(' + list_s[i].studentNum + '人)</p>' +
                        '<span class=' + Read + '></span><ul class="secul tealist_s"><div class="load_html"><img class="loading-back" src="../common/images/loading.gif" />' +
                        '<div class="load_fail"><img src="images/reload.png" > <span>重新加载</span></div></div></ul></li>');
                }

            }}
        }, error);
    }

    /**
     * 获取列表详情
     * @param this_
     */
    function getListDetails(this_){
        var classCode = this_.attr('classCode');
        var studentNum = this_.attr('studentNum');
        var className = this_.attr('className');

        var params = {
            'classCode':classCode
        };
        ajax_S(homework_s.t_hw_getClassDetails, params, function (e) {
            if(e.data != undefined && e.data.length > 0){
                this_.find('ul li').remove();
                var list = e.data;
                for (var i = 0; i < list.length; i++) {
                    var courseCode = "";
                    if(list[i].courseCode == undefined){
                        courseCode = "";
                    }else {
                        courseCode = list[i].courseCode;
                    }
                    if ((parseInt(list[i].yescommit) + parseInt(list[i].nocorrect)) == studentNum || list[i].yescommit == studentNum) {
                        if (list[i].nocorrect == 0 && list[i].notcommit == 0) {
                            if (list[i].homeworkType == "1") {
                                this_.find('ul').append(' <li><span class="homework_time_">' + list[i].homeworkTime + '</span><p class="state_s">已批:' + list[i].yescorrect + '/未批:' + list[i].nocorrect + '/未交:' + list[i].notcommit + '</p>' +
                                    '<span class="more_so"  classCode="' + list[i].classCode + '" courseCode="' + courseCode + '" homeworkTime="' + list[i].homeworkTime + '" Tid="' + list[i].id + '">查看 <img src="images/B02-2_03.png" alt="" /></span></li> ')
                            } else {
                                this_.find('ul').append(' <li><span class="dian">电子</span><span class="homework_time_" >' + list[i].homeworkTime + '</span>' +
                                    '<p class="state_s">已批:' + list[i].yescorrect + '/未批:' + list[i].nocorrect + '/未交:' + list[i].notcommit + '</p>' +
                                    '<span class="more_so"  classCode="' + classCode + '" courseCode="' + courseCode + '" homeworkTime="' + list[i].homeworkTime + '" Tid="' + list[i].id + '">查看 <img src="images/B02-2_03.png" alt="" /></span></li> ')
                            }

                        } else {
                            if (list[i].homeworkType == "1") {
                                this_.find('ul').append(' <li style="color:#000;"><span class="homework_time_">' + list[i].homeworkTime + '</span><p class="state_s">已批:' + list[i].yescorrect + '/未批:' + list[i].nocorrect + '/未交:' + list[i].notcommit + '</p>' +
                                    '<span class="more_so"  classCode="' + classCode + '" courseCode="' + courseCode + '" homeworkTime="' + list[i].homeworkTime + '" Tid="' + list[i].id + '">查看 <img src="images/B02-2_03.png" alt="" /></span></li> ')
                            } else {
                                this_.find('ul').append(' <li style="color:#000;"><span class="dian">电子</span><span class="homework_time_">' + list[i].homeworkTime + '</span><p class="state_s">已批:' + list[i].yescorrect + '/未批:' + list[i].nocorrect + '/未交:' + list[i].notcommit + '</p>' +
                                    '<span class="more_so"  classCode="' + classCode + '" courseCode="' + courseCode + '" homeworkTime="' + list[i].homeworkTime + '" Tid="' + list[i].id + '">查看 <img src="images/B02-2_03.png" alt="" /></span></li> ')
                            }

                        }
                    } else {
                        if (list[i].readStatus == 0) {
                            dis_l = 'state_st';
                        } else {
                            dis_l = '';
                        }
                        if (list[i].nocorrect == 0 && list[i].notcommit == 0) {
                            if (list[i].homeworkType == "1") {
                                this_.find('ul').append(' <li>' +
                                    '<span class="homework_time_">' + list[i].homeworkTime + '</span><p class="state_s">已批:' + list[i].yescorrect + '/未批:' + list[i].nocorrect + '/未交:' + list[i].notcommit + '</p>' +
                                    '<span class=' + dis_l + '></span><span class="more_so"  classCode="' + classCode + '" courseCode="' + courseCode + '" homeworkTime="' + list[i].homeworkTime + '" Tid="' + list[i].id + '">查看 <img src="images/B02-2_03.png" alt="" /></span><div class="remove_s">' +
                                    '<span name="' + className + '" time="' + list[i].homeworkTime + '" know="' + list[i].knowledgePoint + '" text="' + decodeURI(list[i].description) + '" Id="' + list[i].id + '"  classCode="' + classCode + '">修改</span><span class="delete_s" id="' + list[i].id + '">删除</span></div></li> ')
                            } else {
                                this_.find('ul').append(' <li>' +
                                    '<span class="dian">电子</span><span class="homework_time_">' + list[i].homeworkTime + '</span>' +
                                    '<p class="state_s">已批:' + list[i].yescorrect + '/未批:' + list[i].nocorrect + '/未交:' + list[i].notcommit + '</p>' +
                                    '<span class=' + dis_l + '></span><span class="more_so"  classCode="' + classCode + '" courseCode="' + courseCode + '" homeworkTime="' + list[i].homeworkTime + '" Tid="' + list[i].id + '">查看 <img src="images/B02-2_03.png" alt="" /></span>' +
                                    '<div class="remove_s"><span class="changeHw" Id="' + list[i].id + '">修改</span><span class="delete_s" id="' + list[i].id + '">删除</span></div></li> ')
                            }

                        } else {
                            if (list[i].homeworkType == "1") {
                                this_.find('ul').append(' <li style="color:#000;" >' +
                                    '<span class="homework_time_">' + list[i].homeworkTime + '</span><p class="state_s">已批:' + list[i].yescorrect + '/未批:' + list[i].nocorrect + '/未交:' + list[i].notcommit + '</p><span class=' + dis_l + '></span>' +
                                    '<span class="more_so"  classCode="' + classCode + '" courseCode="' + courseCode + '" homeworkTime="' + list[i].homeworkTime + '" Tid="' + list[i].id + '">查看 <img src="images/B02-2_03.png" alt="" /></span>' +
                                    '<div class="remove_s"><span name="' + className + '" time="' + list[i].homeworkTime + '" know="' + list[i].knowledgePoint + '" text="' + decodeURI(list[i].description) + '" Id="' + list[i].id + '" classCode="' + classCode + '">修改</span>' +
                                    '<span class="delete_s" id="' + list[i].id + '">删除</span></div></li> ')
                            } else {
                                this_.find('ul').append(' <li style="color:#000;">' +
                                    '<span class="dian">电子</span><span class="homework_time_">' + list[i].homeworkTime + '</span><p class="state_s">已批:' + list[i].yescorrect + '/未批:' + list[i].nocorrect + '/未交:' + list[i].notcommit + '</p><span class=' + dis_l + '></span>' +
                                    '<span class="more_so"  classCode="' + classCode + '" courseCode="' + courseCode + '" homeworkTime="' + list[i].homeworkTime + '" Tid="' + list[i].id + '">查看 <img src="images/B02-2_03.png" alt="" /></span>' +
                                    '<div class="remove_s"><span class="changeHw" Id="' + list[i].id + '">修改</span><span class="delete_s" id="' + list[i].id + '">删除</span></div></li> ')
                            }

                        }
                    }
                    if(list[i].homeworkType == "1"&&list[i].homeworkTime>new Date().format('yyyy-MM-dd')){
                        console.log(list[i].homeworkTime+'          '+new Date().format('yyyy-MM-dd'))
                        console.log(this_.find('li').eq(i))
                        this_.find('li').eq(i).find('.homework_time_').css('color','#00ba97');
                        this_.find('li').eq(i).find('.state_s').html('待推送......');
                        this_.find('li').eq(i).find('.state_s').css({
                            'color':'#00ba97'
                        })
                    }
                    if(list[i].homeworkType == "2"&&list[i].homeworkTime>new Date().format('yyyy-MM-dd')){
                        this_.find('li').eq(i).find('.homework_time_').css('color','#00ba97');
                        this_.find('li').eq(i).find('.state_s').html('待推送......');
                        this_.find('li').eq(i).find('.state_s').css({
                            'color':'#00ba97'
                        })
                    }
                }
                this_.find('ul').find('.loading-back').hide();
                this_.find('ul .load_html').hide();
            }
        },function(){

            this_.find('ul').find('.loading-back').hide();
            this_.find('ul').find('.load_fail').show();
        });


    }

    //局部刷新
    $(document).on('tap','ul .load_html .load_fail',function(){
        $(this).parent().parent().find('.loading-back').show();
        $(this).hide();
        getListDetails($(this).parent().parent().parent());
    });

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