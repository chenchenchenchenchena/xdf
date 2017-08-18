$(function () {

    // var stuname = sessionStorage.s.split(',');
    var stuInfo = JSON.parse(sessionStorage.stuList).stuInfoKey;
    var teaname = sessionStorage.t.split(',');

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
                        '<span class="callIcon" tel=' + mobile + ' stuCode=' + stuInfo[k].studentCode + ' /></span>' +
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
        $('.slistTitle').html('课堂同学列表(' + (stuInfo.length) + ')')
    }

    //打电话
    // $('.studentList li').find('.callIcon').click(function () {
    //     var stuTel = $(this).attr("tel");
    //     var stuCode = $(this).attr("stuCode");
    //     // alert("打电话"+tel);
    //     call(stuCode, stuTel);
    // });

    function call(stuCode, stuTel) {
        var appid = "ssdf";
        var signKey = "shuangshidongfang2017APP0810-cs331-0801";
        // var callerid= "83410012";
        var uid = localStorage.teacherId;
        var sid = stuCode;
        var extension = localStorage.teachertel;
        var str = extension + sid + appid;
        var hash = CryptoJS.HmacSHA1(str, signKey);
        var base64 = CryptoJS.enc.Base64.stringify(hash);
        var rt = encodeURIComponent(base64);
        // var hash = crypto.createHmac('sha1', signKey).update(str).digest().toString('base64');
        var reqData = {
            "uid": uid,
            "extension": extension,
            "sid": sid,
            "sign": rt,
            "schoolId": localStorage.schoolId,
            "toExtension": encodeURIComponent(stuTel)
        };

        var onlineUrl = 'dt.xdf.cn';
        var url_o;
        if (window.location.host == onlineUrl) {//正式环境
            url_o = 'http://dt.xdf.cn/xdfdtmanager/';
        } else {//测试环境
            url_o = "http://dt.staff.xdf.cn/xdfdtmanager/";
        }
        // url_o = "http://10.73.84.101:8080/xdfdtmanager/";
        $.ajax({
            type: 'POST',
            url: url_o + 'teacherData/teacherCallPhone.do',//老师拨打电话
            data: JSON.stringify(reqData),
            success: function (e) {
                alert(JSON.parse(e).msg);
            },
            error: function (err) {
                // failureCallback(msg);
                console.log("err:" + err);
            }
        });
    }

})















