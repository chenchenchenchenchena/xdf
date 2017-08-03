/**
 * Created by zsj on 2017-06-28.
 */
$(function(){
    var loading,loading2;//loading效果
    console.log("title:"+GetRequest('title'));
    console.log("title:"+decodeURI(encodeURI(GetRequest('title'))));
    $('title').html(GetRequest('title'));//动态获取页面标题
    $('.shared-content').hide();//隐藏分享页
    getRankList("1");//默认显示出门测排行榜
    // 切换tab
    $(document).on('touchend','.tab-title li', function () {
        $(this).addClass('tab-active').siblings().removeClass('tab-active');
        $('.main-content,.no-data,.shared-content').hide();
        // alert($(".tab-title li").index(this));
        // $('.main-content table').eq($(".tab-title li").index(this)).show();
        getRankList($(".tab-title li").index(this)+1);
        $('.main-content').attr('testState',$(".tab-title li").index(this)+1);
    });
    //链接到分享页
    $(document).on('touchstart','.to-shared',function () {
        $('.tab-title,.main-content,.no-data').hide();
        // $('.shared-content').show();
        var testState = $('.main-content').attr('testState');
        var stateContent;
        if(testState=="1"){
            stateContent = "入门测";
        }else{
            stateContent = "出门测";
        }
        window.location.href = "sharedranking_t.html?testState="+testState;
        // $('title').html(stateContent+"排行榜");//动态获取页面标题
        // $('.rankTitle>span').html(stateContent);
        // getRankList(testState,"shared");//
    });
    // 全选
    var checkAll = false;//默认不全选
    $(document).on('touchstart','#check-all',function () {
        if(checkAll){
            $('.intro-test .check-box').removeClass('checked');
            checkAll = false;
        }else{
            $('.intro-test .check-box').addClass('checked');
            checkAll = true;
        }
    });
    // 多选
    $(document).on('touchstart','.intro-test tr td .check-box',function () {
        $(this).toggleClass('checked');
    });
    // 传递选中学生号
    var checkStuArry = [];
    $(document).on('touchstart','.to-shared',function () {
        $('.intro-test tr td .check-box.checked').each(function () {
            checkStuArry.push($(this).attr('data-stuNo'));
            console.log(checkStuArry);
        });
        localStorage.studentNos = JSON.stringify({'checkStuArry':checkStuArry});
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
                var rankTitleHtml = '<tr><th><i id="check-all" class="check-box"></i></th><th>排名</th><th>姓名</th><th>本次分数</th><th>分数浮动</th>'
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
                    var rankListHtml='<tr><td><i class="check-box" data-stuNo="'+items.studentNo+'"></i></td><td><span class="'+rankCss+'">'+items.ranking+'</span></td>'
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
