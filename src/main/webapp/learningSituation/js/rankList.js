/**
 * Created by zsj on 2017-06-28.
 */
$(function(){
    var loading,loading2;//loading效果
    $('title').html(GetRequest('title'));//动态获取页面标题
    $('.shared-content').hide();//隐藏分享页
    /** 获取成绩类型 */
    var reqData = {
        'tableName':"studycase_grade_type"
    };
    ajaxRequest('POST', url.t_dictionary,reqData, function(e){
        if(e.code==200){
            var tabTypes =  e.data;
            var tabStr = "";
            for (var i = 0; i < tabTypes.length; i++){
                if(i == 0){
                    tabStr += "<li class='tab-active' tCode='"+tabTypes[i].tCode+"'>"+tabTypes[i].tName+"</li>";
                }else {
                    tabStr += "<li tCode='"+tabTypes[i].tCode+"'>"+tabTypes[i].tName+"</li>";
                }

            }

            $('.tab-title').html(tabStr);
        }
    });

    getRankList("1");//默认显示出门测排行榜
    // 切换tab
    $(document).on('touchend','.tab-title li', function () {
        $(this).addClass('tab-active').siblings().removeClass('tab-active');
        $('.main-content,.no-data,.shared-content').hide();
        getRankList($(this).attr("tCode"));
        $('.main-content').attr('testState',$(this).attr("tCode"));
    });
    //链接到分享页
    var checkStuArry = [];// 传递选中学生号
    $(document).on('touchstart','.to-shared',function () {
        if($('.intro-test tr td .checked').length<=0){
            layer.msg("请选择要分享的学员");
            return ;
        }
        $('.intro-test tr td .check-box.checked').each(function () {
            checkStuArry.push($(this).attr('data-stuNo'));
            console.log(checkStuArry);
        });
        localStorage.studentNos = JSON.stringify({'checkStuArry':checkStuArry});
        $('.tab-title,.main-content,.no-data').hide();
        var testState = $('.main-content').attr('testState');
        window.location.href = "sharedranking_t.html?testState="+testState;
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
                    +'<th>名次浮动</th><th class="to-shared"><img  src="images/shareIcon.png" alt="分享"/></th></tr>';
                $(".intro-test>tbody").html(rankTitleHtml);
                $.each(datas,function(i,items){
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
                        +'<td>'+items.studentName+'</td><td>'+items.grade+'</td>'
                        +'<td><i class="change-state '+floatGradeCss+'"></i>'+parseInt(Math.abs(gradeFloat))+'分</td>'
                        +'<td><i class="change-state '+floatRankCss+'"></i>'+parseInt(Math.abs(rankFloat))+'名</td>'
                        +'<td><a class="link-to" href="reportstu_t.html?studentNo='+items.studentNo+'&tCode='+$('.main-content').attr('teststate')+'&studentName='+items.studentName+'"></a></td>'
                        +'</tr>';
                    $(".intro-test>tbody").append(rankListHtml);
                    $(".no-data").hide();
                    layer.close(loading);
                    $(".main-content").show();
                });
            }else{
                // $('.hwEmpty p').html("您没有已交作业哦~");
                $('.main-content').hide();
                layer.close(loading);
                $('.no-data').show();
            }
        }else{
            console.log("err:"+JSON.stringify(msg));
            $('.main-content').hide();
            layer.close(loading);
            $('.no-data').show();
        }
        // layer.close(loading);
    }


})
