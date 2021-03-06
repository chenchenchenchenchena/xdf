/**
 * Created by xupingwei on 2017/7/14.
 */
$(function () {
    /*----------------语音播放开始--------------------------------------*/

    var isPlaying = false;

    /**
     * 播放作业描述语音
     */
    $(document).on('touchend', '.audio_box>div', function () {
        // if(!$(this).attr('P_time')){
        //
        // }

        voiceCheck($(this).find('audio')[0]);//先播放当前语音
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
            second = $(audioCur).attr("data-time");//获取音频秒数
            //     //如果是录制语音，则调用微信接口，本地播放。避免调用获取mp3Url接口
            //     playVoice($(audioCur).find('source').attr("src"));

            // } else {
            //如果是从服务端获取的播放地址则用audio播放
            // second = audioCur.duration;//获取音频秒数
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
        isPlaying = false;
    }

    /**
     *开始播放方法
     */
    function play() {
        if(isPlaying){
            return false;
        }
        //wx.config({
        //    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        //    appId: Wxconfig.appid,   // 必填，公众号的唯一标识
        //    timestamp: Wxconfig_h.timestamp,   // 必填，生成签名的时间戳
        //    nonceStr: Wxconfig_h.nonceStr,   // 必填，生成签名的随机串
        //    signature: Wxconfig_h.signature, // 必填，签名
        //    jsApiList: ["startRecord","uploadImage", "chooseImage", "previewImage","stopRecord", "uploadVoice", "playVoice", "downloadVoice"]
        //});
        // wx.ready(function() {
            audioCur.play();
        // });

        // document.addEventListener("WeixinJSBridgeReady", function () {
        //     audioCur.play();
        // }, false);
        //audioCur.play();
        playAnimation();
        isPlaying = true;
        //监听播放完毕
        audioCur.onended = function () {
            isPlaying = false;
            var nextAudio = $(audioCur).parent().parent().next().find('div').find('audio')[0];
            if(nextAudio != null && nextAudio != undefined){
                voiceCheck(nextAudio);
            }
        };

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