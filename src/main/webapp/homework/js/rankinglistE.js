/**
 * Created by zyc on 2017/9/10.
 */
$(function () {
    var voiceCount = 0;
    ajaxRequest('post', homework_s.t_mmmm, {Tcid: getRequest('tid').tid}, function (e) {
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
    });
    /*** 测试数据*/
    //链接到分享页
    var checkStuArry = [];// 传递选中学生号
    $(document).on('touchstart','.shareBtn',function () {
        if($('.ranklibe li .check-box').length<=0){
            layer.msg("请选择要分享的学员");
            return ;
        }
        $('.ranklibe li .check-box').each(function () {
            checkStuArry.push($(this).attr('data-stuNo'));
            console.log(checkStuArry);
        });
        localStorage.studentNos = JSON.stringify({'checkStuArry':checkStuArry});
        $('.tab-title,.main-content,.no-data').hide();
        var testState = $('.main-content').attr('testState');
        window.location.href = "sharedranking_t.html?testState="+testState+"&checkedTypeName="+checkedTypeName;
    });
    // 全选
    var checkAll = true;//默认全选
    $(document).on('touchstart','.check-tr',function () {
        if(checkAll){
            $('.ranklibe li .check-box').addClass('checked');
            checkAll = false;
        }else{
            $('.ranklibe li .check-box').removeClass('checked');
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

})