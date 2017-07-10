/**
 * Created by use1 on 2017-07-10.
 */
$(function () {
    //点击作业排行榜
    $(document).on('touchend', '.hwRankTitle', function () {
        window.location.href = "studentrank_s.html";
    })
    //点击录制语音
    //按下开始录音
    $('#record').on('touchstart', function (event) {
        /*alert(1);*/
        event.preventDefault();
        START = new Date().getTime();
        /*alert(START);*/
        recordTimer = setTimeout(function () {
            wx.startRecord({
                success: function () {
                    localStorage.rainAllowRecord = 'true';
                    /* alert("开始录音");*/
                },
                cancel: function () {
                    alert('用户拒绝授权录音');
                }
            });
        }, 300);
    });
    //松手结束录音
    $('#record').on('touchend', function (event) {
        event.preventDefault();
        END = new Date().getTime();
        /*alert(END);*/
        alert(1)
        if ((END - START) < 300) {
            END = 0;
            START = 0;
            //小于300ms，不录音
            clearTimeout(recordTimer);
        } else {
            alert(2);
            wx.stopRecord({
                success: function (res) {

                    //var data=JSON.stringify(res);
                    localId = res.localId;
                    alert(localId);
                    //显示语音布局
                    $('#audio_record').show();
                    /*alert(voice.localId+"111111");*/
                    uploadVoice(localId);

                    /* alert("结束录音");*/
                },
                fail: function (res) {
                    /* alert(JSON.stringify(res));
                     alert("录音结束失败");*/
                }
            });
        }
    });
    //上传云盘
    function uploadVoice(localId) {
        var cbconfig = {
            'appId': "wx559791e14e9ce521",
            'appSecret': "baa4373d5a8750c69b9d1655a2e31370",
            'mediaId': localId
        };
        $.ajax({
            url: url_o + "upload/uploadAudio.do",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify(cbconfig),
            success: function (e) {
                console.log(e);
                alert(JSON.stringify(e));

            }
        });
    }

    //点击选择图片
    $('#chooseImage').click(function () {
        wx.chooseImage({
            success: function (res) {
                $('.notsubmit').show();
                if ($('#audio_record').attr("src") == "" || $('#audio_record').attr("src") == null) {
                    $('#audio_record').hide();
                }
                var str = "";
                if (res.localIds.length > 0) {

                    for (var i = 0; i < res.localIds.length; i++) {

                        if (i % 3 == 0) {
                            str += " <div class = 'imgBox'>";
                        }
                        str += "<div><span class='stuImg'></span><img src='" + res.localIds[i] + "'/></div>";
                        if ((i + 1) % 3 == 0 || i == res.localIds.length - 1) {
                            str += "</div>";
                        }
                    }
                }
                $(".notsubmit").html(str);
                alert('已选择 ' + res.localIds.length + ' 张图片');
            }
        });
    });
    // 播放语音
    voiceCheck('audio');
    function voiceCheck(voiceId) {
        var audio = document.getElementById(voiceId);
        if (audio !== null) {
            //检测播放是否已暂停.audio.paused 在播放器播放时返回false.
            alert(audio.paused);
            if (audio.paused) {
                audio.play();//audio.play();// 这个就是播放
            } else {
                audio.pause();// 这个就是暂停
            }
        }
    }

});
/* //超出字数
 layer.open({
 type: 1,
 area: ['310px', '195px'],
 shade: [0.1, '#fff'],
 title: false,
 skin: 'tips',
 content:$("#alert")
 });*/

/* //提交成功
 layer.open({
 type: 1,
 area: ['548px', '345px'],
 shade:[0.2,'#000'],
 title:'',
 skin: '',
 content:$(".submitBox")
 });*/

/* //提交失败
 layer.open({
 type: 1,
 area: ['548px', '345px'],
 shade:[0.2,'#000'],
 title:'',
 skin: '',
 content:$(".submitFail")
 })*/
