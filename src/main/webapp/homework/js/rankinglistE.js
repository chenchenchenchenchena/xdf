/**
 * Created by zyc on 2017/9/10.
 */
$(function () {
    var loading;
   /* ajaxRequest('post', homework_s.t_mmmm, {Tcid: getRequest('tid').tid}, function (e) {
        var Month = e.data.homeworkTime.substr(5, 2);
        var Day = e.data.homeworkTime.substr(8, 2);
        var teaName = e.data.teacherName;
        var json = {
            'title': '' + Month + '月' + Day + '日的优秀作业',
            'text': '' + teaName + '老师公布了今日的优秀作业，快看看你被选中了吗？',
            'url': 'https://mp.weixin.qq.com/misc/getheadimg?token=547158264&fakeid=3241894319&r=715597',
        };
        weChatData(json);
        var data = e.data;
        $('.title_s i').html(data.className);
        $('.title_s p').eq(1).html(data.teacherName + '老师');
        $('.title_s p').eq(2).html('日期:' + data.homeworkTime);
    });*/
    /*** 测试数据*/
        //链接到分享页
    var checkStuArry = [];// 传递选中学生号
    $(document).on('touchstart', '.shareBtn', function () {
        checkStuArry = [];
        if ($('.ranklibe .tr .check-box.checked').length <= 0) {
            layer.msg("请选择要分享的学员");
            return;
        }
        $('.ranklibe .tr .check-box.checked').each(function () {
            checkStuArry.push($(this).attr('data-stuNo'));
            console.log(checkStuArry);
        });
        localStorage.studentNos = JSON.stringify({'checkStuArry': checkStuArry});
        // $('.tab-title,.main-content,.no-data').hide();
        // var testState = $('.main-content').attr('testState');
        var testState = 1;
        var checkedTypeName = "入门测";
        /*window.location.href = "sharedrankingE_t.html?testState=" + testState + "&checkedTypeName=" + checkedTypeName;*/
        window.location.href = "sharedrankingE_t.html?tid="+sessionStorage.Tid;
    });
    // 全选
    var checkAll = false;//由于添加UI布局默认全选，则第一次点击"取消全选"初始值为false
    $(document).on('touchstart', '#check-all', function () {
        if (checkAll) {
            $('.ranklibe .check-box').addClass('checked');
            checkAll = false;
        } else {
            $('.ranklibe .check-box').removeClass('checked');
            checkAll = true;
        }
    });
    // 多选
    $(document).on('touchstart', '.ranklibe .tr', function () {
        $(this).find('.check-box').toggleClass('checked');
        if (!$(this).find('.check-box').hasClass('checked')) {
            //点击后没有勾选的情况
            $('#check-all .check-box').removeClass('checked');
            checkAll = true;
        } else {
            if ($('.ranklibe .tr .check-box.checked').length == $('.ranklibe .tr .check-box').length) {
                $('#check-all .check-box').addClass('checked');
                checkAll = false;
            }
        }
    });
    //获取电子作业排行数据
    getRankingData();

    function getRankingData() {
        loading=layer.load();
        var params = {'Tcid':getRequest('tid').tid};
        ajaxRequest("POST", homework_s.s_hw_rank_e, JSON.stringify(params), function (e) {
            if (e.result) {
               /* var homeworkTime = e.homeworkTime;*/
                var excellenHomrWork = e.excellenHomrWork;
                $('.title_s i').html(e.className);
                $('.title_s p').eq(1).html(e.teacherName + '老师');
                $('.title_s p').eq(2).html('日期:' + e.homeworkTime);
                if (undefined != excellenHomrWork && excellenHomrWork.length > 0) {
                    var strHtml = "";
                    for (var i = 0; i < excellenHomrWork.length; i++) {
                        // {
                        //     "score": "100",
                        //     "times": "27:05",
                        //     "studentName": "程巾哲",
                        //     "ranking": 1
                        // }
                        var ranking = excellenHomrWork[i].ranking;
                        var studentName = excellenHomrWork[i].studentName;
                        var times = excellenHomrWork[i].times;
                        var score = excellenHomrWork[i].score;
                        var studentNo=excellenHomrWork[i].studentNo;
                        var avater = "";
                        if (studentName.length > 2) {
                            avater = studentName.substring(studentName.length - 2, studentName.length);
                        } else {
                            avater = studentName;
                        }
                        strHtml += "<li class='tr'><span><i class='check-box checked' data-stuNo="+studentNo+"></i></span>" +
                            "<span><span class='first-num'>" + ranking + "</span></span>" +
                            "<span class='nameLeft'><i>" + avater + "</i></span>" +
                            "<span class='nameRight'>" + studentName + "</span>" +
                            "<span class='stuTime'>" + times + "</span>" +
                            "<span class='stuScore'>" + score + "</span></li>";
                    }
                    $('.ranklibe').append(strHtml);
                    layer.close(loading);
                    $('.ranklist-box').show();
                    $('.title_s').show();
                    $('.shareBtn').show();
                }else{
                    layer.close(loading);
                    $('.ranklist-box').hide();
                    $('.title_s').hide();
                    $('.shareBtn').hide();
                    $('.no-data').show();
                }
            }
        });

    }

});