$(function () {


    var s = {
        "code": "200",
        "data": {
            "homeworkTime": "7月13日",
            "teacherName": "高伟",
            "StudentHomeInfo": [{
                "RevampFile": [{
                    "diskFilePath": "homework/73/www/111.png",
                    "fileName": "111",
                    "fileSize": "1236",
                    "fileType": "png",
                    "homeworkSinfoId": "47f8bfad04124e9cb3587238a87325f9",
                    "id": "7a6dba74aa1d43669be326154ab58d5a",
                    "uploadTime": 1499831173000, "url": "", "previewUrl": "", "thumbnail": ""
                },
                    {
                        "diskFilePath": "homework/73/www/222.mp3",
                        "fileName": "222",
                        "fileSize": "6555",
                        "fileType": "mp3",
                        "homeworkSinfoId": "47f8bfad04124e9cb3587238a87325f9",
                        "id": "f9618f1047cf477d9b96bbace9ff153b",
                        "uploadTime": 1499831173000, "url": "", "previewUrl": "", "thumbnail": ""
                    }],
                "studentName": "武铮铮",
                "description": "这是测试数据"
            },
                {
                    "RevampFile": [],
                    "studentName": "杨佳琳",
                    "description": "这是测试数据"
                },
                {
                    "RevampFile": [],
                    "studentName": "汲思含",
                    "description": "这是测试数据"
                }],
            "className": "五年级数学综合培优暑假班"
        },
        "status": "success"
    }


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
        for (var i = 0; i < data.StudentHomeInfo.length; i++) {
            var music = '';
            var Img = '';
            var Media = data.StudentHomeInfo[i].RevampFile;
            if (Media.length != 0) {
                for (var k = 0; k < Media.length; k++) {
                    if (Media.fileType == 'mp3') {
                        // music += '<div class="music_s"> <span>10"</span> </div> '
                        voiceCount++;
                        showAudio(url_o + paths.diskFilePath, "audio_" + 2, "audio" + 2 + "" + voiceCount);
                    } else {
                        // Img += '<div><img src="' + Media[k].url + '" alt=""></div>'
                        showImage(paths.fileUrl, "imagBox_" + 2);
                    }
                }
            }
            $('.homework_big').append('<div class="homework_small"> <div class="homework_small_title"> <h4>' + data.StudentHomeInfo[i].studentName + '同学</h4> </div> <div class="answer_s"> <p>' + decodeURI(data.StudentHomeInfo[i].description) + '</p></div>' + music + '<div class="imgBox imgBox_s"> ' + Img + '</div> </div>')
        }
    });

    /**
     * 显示获取到的图片
     */
    function showImage(previewUrl, imageId) {
        $('#' + imageId).show();
        var str = "";
        str += "<div class = 'imgBox'>";
        str += "<div><img src='" + previewUrl + "'/></div>";
        str += "</div>";
        $('#' + imageId).append(str);
    }

    /**
     * 显示语音布局
     */
    function showAudio(url, idParent, idChildren) {

        $('#' + idParent).show();
        var length = "";
        var strVoice = "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto'><source src='" + url + "' type='audio/mpeg'></audio>" +
            "<i class='play-icon'></i></div><span class='voice_lenth'>" + length + "</span></li>";

        $('#' + idParent).append(strVoice);
        var audioElem = document.getElementById(idChildren);
        audioElem.onloadedmetadata = function () {
            getVoiceLen(audioElem,idChildren)
        };


    }

    function getVoiceLen(audioElem,idChildren) {
        var len = audioElem.duration;
        len = parseInt(len);
        var hh = parseInt(len / 3600);
        var mm = parseInt((len % 3600) / 60);
        var ss = parseInt((len % 3600) % 60);
        var voiceLen = "";
        if (hh > 0) {
            voiceLen = hh + "'" + mm + "'" + ss + "''";
        } else if (mm > 0) {
            voiceLen = mm + "'" + ss + "''";
        } else {
            if (ss == 0) {

                voiceLen = "1''";
            }else {
                voiceLen = ss + "''";
            }
        }

        $('#' + idChildren).parent('div').siblings('.voice_lenth').html(voiceLen);
    }

})