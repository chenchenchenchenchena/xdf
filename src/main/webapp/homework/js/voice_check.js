/**
 * Created by xupingwei on 2017/7/14.
 */
$(function () {

    /*----------------语音播放开始--------------------------------------*/
    /**
     * 播放作业描述语音
     */
    $(document).on('touchend', '.audio_box>div', function () {
        console.log('oooo' + $(this).find('audio')[0]);
        voiceCheck($(this).find('audio')[0]);
    });

    /**
     * 播放微信录制后的本地语音文件
     */
    function playVoice(plId) {
        //播放录音
        wx.playVoice({
            localId: plId // 需要播放的音频的本地ID，由stopRecord接口获得
        });
    }
    /**
     * 停止播放微信录制后的本地语音文件
     */
    function stopVoice(plId) {
        //播放录音
        wx.stopVoice({
            localId: plId // 需要停止播放的音频的本地ID，由stopRecord接口获得
        });
    }

    /**
     * 播放微信录制后的本地语音文件
     */
    function playVoice(plId) {
        //播放录音
        wx.playVoice({
            localId: plId // 需要播放的音频的本地ID，由stopRecord接口获得
        });
    }
    /**
     *播放语音
     */
    var playTimer = "", playFlag = false;
    var audioCur = null;
    var oldId = undefined;

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
            if(oldId.indexOf("record") != -1){
                //如果是录制语音，则调用微信接口，本地播放。避免调用获取mp3Url接口
                playVoice($(audioCur).find('source').attr("src"));
            }else {
                //如果是从服务端获取的播放地址则用audio播放
                play();
            }
        } else {
            oldId = undefined;
            if($(audioCur).attr('id').indexOf("record") != -1){
                stopVoice($(audioCur).find('source').attr("src"));
            }else {
                stop();
            }
        }
    }

    /**
     *停止播放方法
     */
    function stop() {
        audioCur.pause();
        audioCur.currentTime = 0;
        clearTimeout(playTimer);
        $(audioCur).siblings('.play-icon').removeClass('playing');
    }

    /**
     *开始播放方法
     */
    function play() {
        var second = audioCur.duration;//获取音频秒数
        audioCur.currentTime = 0;
        audioCur.play();
        //播放动画
        $(audioCur).siblings('.play-icon').addClass('playing');
        playTimer = setTimeout(function () {
            $(audioCur).siblings('.play-icon').removeClass('playing');
        }, second * 1000);
    }

    /*--------------------语音播放结束----------------------------------*/
})