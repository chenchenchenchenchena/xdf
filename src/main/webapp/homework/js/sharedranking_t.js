$(function () {
    var voiceCount = 0;
    var Index = 0;
    var arr_I = [];
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
            var hwsharedHtml = '<div class="homework_small"><div class="homework_small_title"><h4>' + data.StudentHomeInfo[i].studentName + '同学 <span style="float:right;font-size:40px;">'+data.StudentHomeInfo[i].score+'<i style="font-style:normal;font-size:25px;">分</i><img src="images/del_w.png" alt="" style="margin-left:20px;"></span></h4> </div><div class="answer_s"><p>' + decodeURI(data.StudentHomeInfo[i].description) + '</p></div><div class="imgBox_s"><ul id="audio_' + i + '"></ul><div class="imgBox" id="imagBox_' + i + '" style="display:block;"></div></div></div>';
            $('.homework_big').append(hwsharedHtml);
            var Media = data.StudentHomeInfo[i].RevampFile;
            if (Media.length != 0) {
                for (var k = 0; k < Media.length; k++) {
                    if (Media[k].fileType == 'mp3') {
                        voiceCount++;
                        showAudio(Media[k].playTime, url_o + Media[k].url, "audio_" + i, "audio" + i + "" + voiceCount);
                    } else {
                        // Img += '<div><img src="' + Media[k].url + '" alt=""></div>'
                        showImage(url_o + Media[k].url, "imagBox_" + i,Media[k].thumbnail);
                    }
                }
            }

        }
        if(GetRequest("LS")=='0'){
            $('.frend').hide();
            $('.homework_small_title img').hide();
            if(GetRequest("Num")){
                var Number = GetRequest("Num").split('');
                for(var i = 0;i<Number.length;i++){
                    $('.homework_small').eq(Number[i]).hide();
                }
            }
        }
    });

    /**
     * 显示获取到的图片
     */
    function showImage(previewUrl, imageId,url) {
        $('#' + imageId).show();
        var str = "";
        // str += "<div class = 'imgBox'>";
        str += "<div><img onerror=javascript:this.src='images/error-image.png' data-img='"+previewUrl+"' src='" + url + "'/></div>";
        // str += "</div>";
        $('#' + imageId).append(str);
    }

    /**
     * 显示语音布局
     * @param playTime 语音播放时长
     * @param url 语音播放地址
     * @param idParent 语音布局添加的父节点
     * @param idChildren 语音audio控件的ID
     */
    function showAudio(playTime, url, idParent, idChildren) {

        $('#' + idParent).show();
        var length = "";
        var strVoice = "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto' data-time='"+playTime+"'><source src='" + url + "' type='audio/mpeg'></audio>" +
            "<i class='play-icon'></i></div><span class='voice_lenth'>" + length + "</span></li>";

        $('#' + idParent).append(strVoice);
        var audioElem = document.getElementById(idChildren);
        audioElem.onloadedmetadata = function () {
            getVoiceLen(playTime, idChildren)
        };


    }

    function getVoiceLen(playTime, idChildren) {
        var len = parseInt(playTime);
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
            } else {
                voiceLen = ss + "''";
            }
        }

        $('#' + idChildren).parent('div').siblings('.voice_lenth').html(voiceLen);
    }

    /*--------------------图片预览----------------------------------*/
    $(document).on('tap', '.imgBox img', function () {
        var previewUrl = $(this).attr('data-img');
        wx.previewImage({
            current: previewUrl, // 当前显示图片的http链接
            urls: [previewUrl] // 需要预览的图片http链接列表
        });
    });
    $(document).on('touchend','.homework_small_title img',function(){
        $('.erro').show();
        Index =  $(this).parents('.homework_small').index();
        arr_I.push(Index);
    });
    $('.erro input:first-of-type').on('touchend',function(){
        $('.erro').hide();
        arr_I[Index] = '';
        Index = 0;
    });
    $('.erro input:last-of-type').on('touchend',function(){
        $('.homework_small').eq(Index).hide();
        $('.erro').hide();
    });
    $('.frend input').on('touchend',function(){
        $('.frend').hide();
        if(arr_I==''){
            location.href = location.href+'&LS=0'
        }else{
            location.href = location.href+'&Num='+arr_I+'&LS=0'
        }
    })

});