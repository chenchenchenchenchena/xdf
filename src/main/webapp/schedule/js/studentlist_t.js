$(function () {

    // var stuname = sessionStorage.s.split(',');
    var stuInfo = JSON.parse(sessionStorage.stuList).stuInfoKey;
    var teaname = sessionStorage.t.split(',');
    var studentNo = sessionStorage.studentCode;
    var studentName = sessionStorage.studentName;

    for (var i = 0; i < teaname.length; i++) {
        if (teaname[i] != '' && teaname[i] != undefined) {
            $('.slist').append('<li class="listCon"><ul class="teClass">' +
                '<li>' + teaname[i] + '老师班(' + sessionStorage.cc + ')' +
                '</li><li class="arrow"></li></ul><ul class="studentList"></ul></li>');
            if (stuInfo.length > 0) {
                for (var k = 0; k < stuInfo.length; k++) {
                    var mobile = stuInfo[k].mobile;
                    $('.studentList').eq(i - 1).append('<li><i>' + (k + 1) + '</i>' +
                        '<span>' + stuInfo[k].studentName.substring(0, 1) + '</span>' +
                        '<span>' + stuInfo[k].studentName + '</span>' +
                        '<span class="callIcon" tel='+mobile+'/></span>' +
                        '<a class="learnIcon" href="../learningSituation/reportstu_t.html?studentNo=' + stuInfo[k].studentCode + '&tCode=1&studentName=' + stuInfo[k].studentName + '"></a></li>');


                }
            }

        }
        // else{
        //    $('.slist').append('<li class="listCon"><ul class="teClass"><li>'+sessionStorage.tm+'老师班('+sessionStorage.cc+')</li><li class="arrow"></li></ul><ul class="studentList"></ul></li>');
        //    for(var k = 0;k<stuname.length;k++){
        //        if(stuname[k]!=''){
        //            $('.studentList').eq(i-1).append('<li><i>'+(k+1)+'</i><span>'+stuname[k].substring(1,stuname[k].length)+'</span><span>'+stuname[k]+'</span></li>')
        //        }
        //    }
        // }
        // var stumore = stuname[i].split(',');
        // for(var k = 0;k<stumore.length;k++){
        // 	if(stumore[k]!=''){
        // 		$('.studentList').eq(i).append('<li><i>'+(k+1)+'</i><span>'+stumore[k].substring(0,1)+'</span><span>'+stumore[k]+'</span></li>')
        // 	}
        // }
        $('.slistTitle').html('课堂同学列表(' + (stuInfo.length - 1) + ')')
    }

    //打电话
    $('.studentList li').find('.callIcon').click(function () {
        var tel = $(this).attr("tel");
        alert("打电话"+tel);
        // call();
    });

    function call() {
        // var crypto = require('crypto');
        var appid="ssdf";
        var signKey= "shuangshidongfang2017APP0810-cs331-0801";
        var callerid= "83410012";
        var ip= "127.0.0.1";
        var uid = "TC23";
        var str = uid + ip + appid;
        var hash = CryptoJS.HmacSHA1(str, signKey);
        alert(hash);
        var md5 = CryptoJS.MD5(hash);
        // var base64 = hash.toString(CryptoJS.enc.Base64);
        var base64 = CryptoJS.enc.Base64.stringify(md5);
        alert(base64);
        // var hash = crypto.createHmac('sha1', signKey).update(str).digest().toString('base64');
        var reqData = {
            "uid":uid,
            "extension":"15101001841",
            "sid":"SS5336",
            "sign":encodeURI(base64),
            "schoolId":"73",
            "callerid":callerid,
            "toExtension":"dsd"};
        var url_o = 'http://dt.staff.xdf.cn/xdfdtmanager/';
        $.ajax({
            type: 'POST',
            url: url_o+'teacherData/teacherCallPhone.do',//老师拨打电话
            data: JSON.stringify(reqData),
            success: function (e) {
                if(e.result){
                    alert(e.msg);
                }
            },
            error: function (err) {
                // failureCallback(msg);
                console.log("err:"+err);
            }
        });
    }

})















