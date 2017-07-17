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
            play();
        } else {
            oldId = undefined;
            stop();
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
    /*--------------------图片预览----------------------------------*/
    $(document).on('touchend', '.imgBox img', function () {
        // alert("预览图片" + $(this).attr('src'));
        var previewUrl = "";
        if ($(this).attr('src').indexOf('weixin://') != -1&&$(this).attr('src').indexOf('http:') != -1) {
            previewUrl = $(this).attr('src');
        } else {
            previewUrl = 'http://dt.staff.xdf.cn/xdfdthome/homework/' + $(this).attr('src');
        }
        wx.previewImage({
            current: previewUrl, // 当前显示图片的http链接
            urls: [previewUrl] // 需要预览的图片http链接列表
        });
    });
})