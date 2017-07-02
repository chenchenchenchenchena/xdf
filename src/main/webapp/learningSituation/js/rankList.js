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
    // 获取入门测,出门测排行列表
    function getRankList(testState,pageState) {
        var reqData = {
            // 'teaEmail':'caoxuefeng@xdf.cn',
            // 'classCode':'CZSPP008',
            // 'schoolId':'73',
            // 'gradeType':testState
            'teaEmail':sessionStorage.teacherEmail,//教师邮箱  localStorage.terEmail
            'classCode':sessionStorage.classcode, //班级编号
            'schoolId':sessionStorage.schoolId, //校区id
            'gradeType':testState // 成绩类型 1 入门测 2 出门测
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
                var rankTitleHtml = '<tr><th>排名</th><th>姓名</th><th>本次分数</th><th>分数浮动</th>'
                    +'<th>名次浮动</th><th><img class="to-shared" src="images/shareIcon.png" alt="分享"/></th></tr>';
                $(".intro-test>tbody").html(rankTitleHtml);
                $.each(datas,function(i,items){
                    var rankCss,floatGradeCss,floatRankCss;
                    //名次样式
                    if(items.ranking==1){
                        rankCss = "first-num";
                    }else{
                        rankCss = "";
                    }
                    var gradeFloat = items.grade -  items.lastGrade;// 分数浮动
                    var rankFloat = items.ranking -  items.lastRanking;// 名次浮动
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
                    var rankListHtml='<tr><td><span class="'+rankCss+'">'+items.ranking+'</span></td>'
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
        }
        // layer.close(loading);
    }


})
