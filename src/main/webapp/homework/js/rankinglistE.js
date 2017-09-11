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
})