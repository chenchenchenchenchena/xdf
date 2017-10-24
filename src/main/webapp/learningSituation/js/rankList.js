/**
 * Created by zsj on 2017-06-28.
 */
$(function(){

    var checkedLesson = [];
    var currentCheckedDay = {};

    sessionStorage.removeItem('dayList');
    var loading,loading2;//loading效果
    $('title').html(GetRequest('title'));//动态获取页面标题
    $('.shared-content').hide();//隐藏分享页
    var checkedTypeName = "入门测";
    /** 获取成绩类型 */
    var currentType = sessionStorage.grade_type;
    $('.main-content').attr('testState',currentType);
    var reqData = {
        'tableName':"studycase_grade_type"
    };
    
    ajaxRequest('POST', url.t_dictionary,reqData, function(e){
        if(e.code==200){
            var tabTypes =  e.data;
            var tabStr = "";
            for (var i = 0; i < tabTypes.length; i++){
                if(tabTypes[i].tCode == currentType){
                    tabStr += "<li class='tab-active' tCode='"+tabTypes[i].tCode+"'>"+tabTypes[i].tName+"</li>";
                    checkedTypeName = tabTypes[i].tName;
                }else {
                    tabStr += "<li tCode='"+tabTypes[i].tCode+"'>"+tabTypes[i].tName+"</li>";
                }

            }

            $('.tab-title').html(tabStr);
        }
    });
    getRankList(currentType);//默认显示出门测排行榜
    // 切换tab
    $(document).on('touchend','.tab-title li', function () {
        $(".classNumTime").hide();
        $(".classNumTime").css("animation", "");
        $(".classNumTime").css("bottom", "0px");
        $('#checkNumber').html("已选中0个日期");
        $(this).addClass('tab-active').siblings().removeClass('tab-active');
        $('.main-content,.no-data,.shared-content').hide();
        currentType = $(this).attr("tCode");
        getRankList($(this).attr("tCode"));
        $('.main-content').attr('testState',$(this).attr("tCode"));
        checkedTypeName = $(this).html();
        checkedLesson = [];
        sessionStorage.removeItem('lessonNo');

    });
    if(localStorage.mastTeater){
        $('.shareBtn').hide();
    }
    //链接到分享页
    var checkStuArry = [];// 传递选中学生号
    $('.shareBtn').on('touchend',function () {
        if ($('.intro-test tr td .checked').length <= 0) {
            layer.msg("请选择要分享的学员");
            return;
        }
        $('.intro-test tr td .check-box.checked').each(function () {
            checkStuArry.push($(this).attr('data-stuNo'));
            console.log(checkStuArry);
        });
        localStorage.studentNos = JSON.stringify(checkStuArry);
        sessionStorage.lessonNo = JSON.stringify(checkedLesson);
        $('.tab-title,.main-content,.no-data').hide();
        var testState = $('.main-content').attr('testState');
        if(checkedLesson.length == 0){
            window.location.href = "sharedranking_t.html?testState=" + testState + "&checkedTypeName=" + checkedTypeName+"&type=";
        }else {
            window.location.href = "sharedranking_t.html?testState=" + testState + "&checkedTypeName=" + checkedTypeName+"&type=student";
        }

    });
    // 全选
    var checkAll = true;//默认全选
    $(document).on('touchstart','.check-tr',function () {
        if(checkAll){
            $('.intro-test .check-box').addClass('checked');
            checkAll = false;
        }else{
            $('.intro-test .check-box').removeClass('checked');
            checkAll = true;
        }
    });
    // 多选
    $(document).on('touchstart','.intro-test tr .check-td',function () {
        $(this).find('.check-box').toggleClass('checked');
        if(!$(this).find('.check-box').hasClass('checked')){
            $('.check-tr .check-box').removeClass('checked');
            checkAll = true;
        }else{
            if($('.intro-test tr td .checked').length== $('.intro-test tr td .check-box').length){
                $('.intro-test .check-box').addClass('checked');
                checkAll = false;
            }
        }
    });
    //更换日期
    $(document).on('touchstart', '.change-day', function () {
        if ($(".classNumTime").css("display") == "block") {
            $(".classNumTime").css("display", "none");
            $('#checkNumber').html("已选中0个日期");
        } else {
            $(".classNumTime").css("display", "block");
            //获取课次列表

            var params = {
                'classCode': localStorage.getItem('CLASSCODE'),
                'tCode': currentType,
                'schoolId': localStorage.getItem('SCHOOLID')
            };
            ajaxRequest("POST", Study.t_getStudyDate, params, function (e) {
                if (e.code == 200) {
                    // {
                    //     "gradeType": "1",
                    //     "classCode": "AYP5EB02",
                    //     "schoolId": "73",
                    //     "date": "2017-09-16",
                    //     "lessonNo": "1"
                    // }
                    if (e.data != undefined && e.data.length != 0) {
                        // sessionStorage.dayList = JSON.stringify(e.data);
                        var strHtml_ = "";
                        var num = 0;
                        for (var i = 0; i < e.data.length; i++) {
                            if(e.data[i].lessonNo == currentCheckedDay.lessonNO && e.data[i].date.indexOf(currentCheckedDay.lessonTime) > -1){
                                strHtml_ += "<li class='chooseClassActive' data-lesson='" + e.data[i].lessonNo + "' date='" + e.data[i].date + "'><span>" + e.data[i].date + "   （第" + e.data[i].lessonNo + "课次）</span></li>";
                                num++;
                            }else {
                                strHtml_ += "<li data-lesson='" + e.data[i].lessonNo + "' date='" + e.data[i].date + "'><span>" + e.data[i].date + "   （第" + e.data[i].lessonNo + "课次）</span></li>";
                            }
                        }
                        $('#checkNumber').html("已选中"+num+"个日期");
                        $('.classNumTime').find('ul').html(strHtml_);
                    }
                }
            })
        }


    });
    $(document).on('touchstart','.classNumTime ul li',function () {
        var checkNum = $('.classNumTime ul .chooseClassActive').length;
        if($(this).hasClass('chooseClassActive')){
            $(this).removeClass("chooseClassActive");
            checkNum--;
            $('#checkNumber').html("已选中"+checkNum+"个日期");
        }else {

            if(checkNum<2){
                $(this).addClass("chooseClassActive");
                checkNum++;
                $('#checkNumber').html("已选中"+checkNum+"个日期");
            }
        }

    });

    $(".confirmBtn").click(function () {
        checkedLesson = [];
        sessionStorage.removeItem('lessonNo');
        $("body,html").css({"width": "", "height": "", "overflow": ""});
        $(".classNumTime").hide();
        $(".classNumTime").css("animation", "");
        $(".classNumTime").css("bottom", "0px");
        $('#checkNumber').html("已选中0个日期");
        var len = $('.classNumTime ul li').length;
        for (var i = 0;i<len;i++){
            if($('.classNumTime ul li').eq(i).hasClass('chooseClassActive')){
                var lessonNo = $('.classNumTime ul li').eq(i).attr('data-lesson');
                checkedLesson.push(lessonNo);
            }
        }


        if(checkedLesson.length == 0){
            getRankList(currentType);//默认显示出门测排行榜
        }else {
            var params = {
                'classCode':localStorage.getItem('CLASSCODE'),
                'gradeType':currentType,
                'schoolId':localStorage.getItem('SCHOOLID'),
                'lessonNos':checkedLesson,
                'studentNos':[]
            };
            ajaxRequest("POST",Study.s_gradeByLessonNo,params,getRankListSuccess)
        }


    });

    // 获取入门测,出门测排行列表
    function getRankList(testState,pageState) {
        var reqData = {
            // 'teaEmail':'gaowei23@xdf.cn',
            // 'classCode':'HDXP5MA03',
            // 'schoolId':'73',
            // 'gradeType':'1',
            'teaEmail':localStorage.terEmail,   //教师邮箱  localStorage.terEmail
            'classCode':localStorage.getItem('CLASSCODE'), //班级编号
            'schoolId':localStorage.getItem('SCHOOLID'), //校区id
            'gradeType':testState, // 成绩类型 1 入门测 2 出门测
            'studentNos':[] //选中的学生号
        };
        if(localStorage.terEmail){
            reqData.teaEmail = sessionStorage.banzhutea
        }
        $('.main-content,.no-data').hide();

        // if(pageState=="shared"){
        //     ajaxRequest('POST', url.t_rankl,reqData, getSharedListSuccess);
        // }else{
            loading = layer.load();
            ajaxRequest('POST', url.t_rankl,reqData, getRankListSuccess);
        // }

    }

    function getRankListSuccess(msg){
        $(".main-content>table>tbody").html(" ");
        if(msg.code==200){
            if(msg.data!='undefined' && msg.data.length>0){
                var datas = msg.data;
                var rankTitleHtml = '<tr><th class="check-tr"><i id="check-all" class="check-box checked"></i></th><th>排名</th><th>姓名</th><th>本次分数</th><th>分数浮动</th>'
                    +'<th>名次浮动</th><th class="change-day"><img  src="images/change_day.png" alt="分享"/></th></tr>';
                $(".intro-test>tbody").html(rankTitleHtml);
                $.each(datas,function(i,items){
                    //记住当前年级类型下默认日期
                    currentCheckedDay = {'lessonNO':items.lessonNO,'lessonTime':items.lessonTime.split(' ')[0]};

                    var rankCss,floatGradeCss,floatRankCss;
                    //名次样式
                    if(items.ranking==1){
                        rankCss = "first-num";
                    }else{
                        rankCss = "";
                    }
                    var gradeFloat,rankFloat;
                    if(items.lastGrade<=0){
                        gradeFloat = items.grade;
                    }else{
                        gradeFloat = items.grade -  items.lastGrade;// 分数浮动
                    }
                    if(items.lastRanking<=0){
                        rankFloat = 0;
                    }else{
                        rankFloat = items.ranking -  items.lastRanking;// 名次浮动
                    }
                    if (gradeFloat>=0){
                        floatGradeCss = "state-up";
                    }else{
                        floatGradeCss = "state-down";
                    }
                    if (rankFloat<=0){
                        floatRankCss = "state-up";
                    }else{
                        floatRankCss = "state-down";
                    }
                    var rankListHtml='<tr><td class="check-td"><i class="check-box checked" data-stuNo="'+items.studentNo+'"></i></td><td><span class="'+rankCss+'">'+items.ranking+'</span></td>'
                        +'<td>'+items.studentName+'</td><td style="text-align: left;padding-left: 47px;">'+items.grade+'</td>'
                        +'<td style="text-align: left; padding-left: 20px;"><i class="change-state '+floatGradeCss+'"></i>'+parseInt(Math.abs(gradeFloat))+'分</td>'
                        +'<td style="text-align: left; padding-left: 20px;"><i class="change-state '+floatRankCss+'"></i>'+parseInt(Math.abs(rankFloat))+'名</td>'
                        +'<td><a class="link-to" href="reportstu_t.html?studentNo='+items.studentNo+'&tCode='+$('.main-content').attr('teststate')+'&studentName='+items.studentName+'"></a></td>'
                        +'</tr>';
                    $(".intro-test>tbody").append(rankListHtml);
                    $(".no-data").hide();
                    layer.close(loading);
                    $(".main-content").show();
                    $('.share-big').show();
                });
                if(localStorage.mastTeater){
                     $('.check-tr,.check-td').hide();
                }
            }else{
                // $('.hwEmpty p').html("您没有已交作业哦~");
                $('.main-content').hide();
                layer.close(loading);
                $('.no-data').show();
                $('.share-big').hide();
            }
        }else{
            console.log("err:"+JSON.stringify(msg));
            $('.main-content').hide();
            layer.close(loading);
            $('.no-data').show();
            $('.share-big').hide();
        }
        // layer.close(loading);
    }


})
