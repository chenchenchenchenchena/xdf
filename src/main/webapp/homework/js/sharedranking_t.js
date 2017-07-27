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
        for (var i = 0; i < data.StudentHomeInfo.length; i++) {
            var music = '';
            var Img = '';
            var hwsharedHtml = '<div class="homework_small"><div class="homework_small_title"><h4>' + data.StudentHomeInfo[i].studentName + '同学</h4> </div><div class="answer_s"><p>' + decodeURI(data.StudentHomeInfo[i].description) + '</p></div><div class="imgBox_s"><ul id="audio_'+i+'"></ul><div class="imgBox" id="imagBox_'+i+'" style="display:block;"></div></div> </div>';
            $('.homework_big').append(hwsharedHtml);
            var Media = data.StudentHomeInfo[i].RevampFile;
            if (Media.length != 0) {
                for (var k = 0; k < Media.length; k++) {
                    if (Media[k].fileType == 'mp3') {
                        voiceCount++;
                        showAudio(url_o + Media[k].url, "audio_" + i , "audio" + i  + "" + voiceCount);
                    } else {
                        // Img += '<div><img src="' + Media[k].url + '" alt=""></div>'
                        showImage(url_o + Media[k].url, "imagBox_" + i );
                    }
                }
            }

        }
    });

    /**
     * 显示获取到的图片
     */
    function showImage(previewUrl, imageId) {
        $('#' + imageId).show();
        var str = "";
        // str += "<div class = 'imgBox'>";
        str += "<div><img src='" + previewUrl + "'/></div>";
        // str += "</div>";
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
    /*--------------------图片预览----------------------------------*/
    $(document).on('touchend', '.imgBox img', function () {
        var previewUrl = $(this).attr('src');
        wx.previewImage({
            current: previewUrl, // 当前显示图片的http链接
            urls: [previewUrl] // 需要预览的图片http链接列表
        });
    });
})