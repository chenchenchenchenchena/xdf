/**
 * Created by xupingwei on 2017/7/14.
 */
$(function () {
    /*------------------录制语音开始------------------------------------*/

    var timeInedex = 0;
    var timeds;
    var localId;
    var START;
    var END;
    var recordTimer;
    var recordCount = 0;

    $('#record').click(function () {
        if (recordCount >= 3) {
            alert("最多录制三条语音");
        } else {
            $('.song_s').animate({'bottom': '0px'});
            $('.song_s,.mask').show();
        }

    });

    /* 隐藏语音弹窗 */
    $('.mask').click(function () {
        $('.song_s').animate({'bottom': '-300px'});
        $('.song_s,.mask').hide();
    });

    /**
     * 按下开始录音
     */
    $('#record_btn').on('touchstart', function (event) {
        timeInedex = 0;
        START = new Date().getTime();
        $(this).attr('src', 'images/speak.gif');
        event.preventDefault();
        recordTimer = setTimeout(function () {
            wx.startRecord({
                success: function () {
                    localStorage.rainAllowRecord = 'true';
                    timeds = setInterval(function () {
                        timeInedex++
                    }, 1000);
                },
                cancel: function () {
                    alert('用户拒绝授权录音');
                }
            });
        }, 300);
    });

    /**
     * 松手结束录音
     */
    $('#record_btn').on('touchend', function (event) {
        $(this).attr('src', 'images/C04-03.png');
        event.preventDefault();
        END = new Date().getTime();
        if ((END - START) < 300) {
            END = 0;
            START = 0;
            //小于300ms，不录音
            clearTimeout(recordTimer);
            alert("录制时间太短");
        } else {
            wx.stopRecord({
                success: function (res) {
                    clearInterval(timeds);
                    localId = res.localId;
                    $('.song_s').hide();
                    uploadVoiceWX(localId);

                },
                fail: function (res) {
                }
            });
        }
    });

    /**
     * 上传微信服务器，获取保存的serverId
     */
    function uploadVoiceWX(upId) {
        //调用微信的上传录音接口把本地录音先上传到微信的服务器
        //不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
        wx.uploadVoice({
            localId: upId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
                var serverId = res.serverId;
                uploadVoice(serverId, upId);
            }
        });
    }

    /**
     *将serverId上传到自己服务器
     */
    function uploadVoice(serverId, localId) {
        var cbconfig = {
            'appId': "wx559791e14e9ce521",
            'appSecret': "baa4373d5a8750c69b9d1655a2e31370",
            'mediaId': serverId,
            'schoolId': sessionStorage.schoolId,
            'classId': localStorage.classCode
        };
        $.ajax({
            url: url_o + "upload/uploadAudio.do",
            // url: "http://10.200.80.235:8080/xdfdtmanager/upload/uploadAudio.do",
            type: 'post',
            dataType: 'json',
            data: cbconfig,
            success: function (e) {
                if (e.status == "failure") {
                    alert(e.message);
                } else {
                    // alert("语音上传成功");
                    fileName = e.data.fileName;
                    fileSize = e.data.fileSize;
                    fileType = e.data.fileType;
                    diskFilePath = e.data.diskFilePath;
                    var voiceFile = {
                        "homeworkSinfoId": homeworkSinfoId,
                        "fileName": fileName,
                        "fileType": fileType,
                        "fileSize": fileSize,
                        "diskFilePath": diskFilePath,
                        "uploadUser": uploadUser
                    };
                    voiceFileParams.push(voiceFile);
                    layer.open({
                        type: 1,
                        area: ['548px', '345px'],
                        shade: [0.2, '#000'],
                        title: '',
                        skin: '',
                        time: 3000,
                        content: $(".music_succ")
                    });
                    getRecordInfo(diskFilePath);
                }


            }
        });
    }


    /**
     * 获取录制语音信息
     */
    function getRecordInfo(diskFileUrl) {
        var optionFile = {"fullPath": diskFileUrl};
        $.ajax({
            url: url_o + "upload/getMp3Url.do",
            type: 'post',
            dataType: 'json',
            data: optionFile,
            success: function (e) {
                if (e.status == "failed") {
                    console.log(e.message);
                } else {
                    //显示语音布局
                    showAudio(url_o + e.data, $('#record_audio_box'), recordCount, 1);
                    recordCount++;

                }
            }
        });
    }

    

    /*----------------语音播放开始--------------------------------------*/
    /**
     * 播放作业描述语音
     */
    $(document).on('touchend', '.audio_box>div', function () {
        console.log('oooo' + $(this).find('audio')[0]);
        voiceCheck($(this).find('audio')[0]);
    });

    /**
     *播放语音
     */
    var playTimer = "", playFlag = false;
    var audioCur = null;
    var oldId = undefined;
    var second = 0;

    /**
     *语音播放方法
     */
    function voiceCheck(voiceId) {

        var newID = $(voiceId).attr('id');
        if (newID != oldId) {
            if (audioCur != null) {
                stop();
                audioCur = null;
            }
            audioCur = voiceId;
            oldId = $(audioCur).attr('id');

            // if (oldId.indexOf("record") != -1) {
            //     second = $(audioCur).parent().siblings("span").html();//获取音频秒数
            //     //如果是录制语音，则调用微信接口，本地播放。避免调用获取mp3Url接口
            //     playVoice($(audioCur).find('source').attr("src"));

            // } else {
                //如果是从服务端获取的播放地址则用audio播放
                second = audioCur.duration;//获取音频秒数
                play();
            // }
        } else {
            oldId = undefined;
            // if ($(audioCur).attr('id').indexOf("record") != -1) {
            //     stopVoice($(audioCur).find('source').attr("src"));
            // } else {
                stop();
            // }
        }
    }



    /**
     * 播放微信录制后的本地语音文件
     */
    function playVoice(plId) {
        //播放录音
        wx.playVoice({
            localId: plId // 需要播放的音频的本地ID，由stopRecord接口获得
        });
        playAnimation();

    }

    /**
     * 停止播放微信录制后的本地语音文件
     */
    function stopVoice(plId) {
        //播放录音
        wx.pauseVoice({
            localId: plId // 需要停止播放的音频的本地ID，由stopRecord接口获得
        });
        stopAnimation();
    }

    /**
     *停止播放方法
     */
    function stop() {
        audioCur.pause();
        stopAnimation();
    }

    /**
     *开始播放方法
     */
    function play() {

        audioCur.play();
        playAnimation();

    }

    /**
     * 播放动画
     */
    function playAnimation() {
        audioCur.currentTime = 0;
        //播放动画
        $(audioCur).siblings('.play-icon').addClass('playing');
        playTimer = setTimeout(function () {
            $(audioCur).siblings('.play-icon').removeClass('playing');
        }, second * 1000);
    }

    function stopAnimation() {
        audioCur.currentTime = 0;
        clearTimeout(playTimer);
        $(audioCur).siblings('.play-icon').removeClass('playing');
    }

    /*--------------------语音播放结束----------------------------------*/
   
});