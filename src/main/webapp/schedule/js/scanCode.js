$(function(){
    //微信授权判断
    if (!sessionStorage.openid) {
        wechatCode(location.href);
    };
    var WXnum = {
        'wechatId': sessionStorage.openid
    };



    ajax_S(url.s_seac, WXnum, function(e){
            if (e.result == true){
                var method      = 'GetStudentLatestPcl';
                var studentCode = e.data.studentNo;
                var studentName = e.data.studentName;
                var schoolId    = '1';
                var appId       = '5037';
                var key         = 'v5k-dfss-dfd89dcc';
                var sign        = 'GetStudentLatestPcl';
                sign       += studentCode;
                sign       += studentName;
                sign       += schoolId;
                sign       += appId;
                sign       += '$';
                sign       += key;

                var classSign   = 'GetStudentDatePcl';
                classSign  += schoolId;
                classSign  += studentCode;
                classSign  += appId;
                classSign  += '$';
                classSign  += key;

                var url = 'http://testxcard.staff.xdf.cn/SkyData/h5/qrCode/teacherCode.html?method='+method+'&studentCode='+studentCode+'&studentName='+studentName+'&schoolId='+schoolId+'&appId='+appId+'&sign='+$.md5(sign.toLowerCase()).toUpperCase()+'&classSign='+$.md5(classSign.toLowerCase()).toUpperCase()+''

                location.href = url
            }else{
                layer.msg('您暂未绑定学生微信')
            }
    });














});