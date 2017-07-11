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
        event.preventDefault();
        START = new Date().getTime();
        recordTimer = setTimeout(function () {
            wx.startRecord({
                success: function () {
                    localStorage.rainAllowRecord = 'true';
                    // alert("开始录音");
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
                    alert(res);
                    localId = res.localId;

                    //显示语音布局
                    $('.notsubmit').show();
                    $('.audio_box').show();

                    uploadVoiceWX(localId);
                    playVoice(localId);

                },
                fail: function (res) {
                }
            });
        }
    });
    function playVoice(plId) {
        alert("开始播放");
        //播放录音
        wx.playVoice({
            localId: plId // 需要播放的音频的本地ID，由stopRecord接口获得
        });
    }
    // $('#record').click(function () {
    //     // uploadVoice("hMC05XthkxWBjgHNbbh1X3mheuBeua0JWPcEbdStrOw1Gxqks2k5n7BHgt5VYpJ");
    //     // uploadVoice("vvCBGtvWnpWChiXZnOcyVuljzy5CgHASAcgKehDWWOqj5ITOezW7KziODYOQ4cwW");
    //     uploadVoice("Lcc4kpav4pq15Epsjgp46Lk52tPTDTKaWMTnsSCKcto2RfHbKs7Ct3yvmIe93Rmm");
    // });
    function uploadVoiceWX(upId) {
        //调用微信的上传录音接口把本地录音先上传到微信的服务器
        //不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
        wx.uploadVoice({
            localId: upId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                // alert(JSON.stringify(res));
                //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
                serverId = res.serverId;
                alert("2222" + serverId);
                uploadVoice(serverId);
            }
        });
    }
    //上传云盘
    function uploadVoice(serverId) {
        var cbconfig = {
            'appId': "wx559791e14e9ce521",
            'appSecret': "baa4373d5a8750c69b9d1655a2e31370",
            'mediaId': serverId
        };
        $.ajax({
            // url: url_o + "upload/uploadAudio.do",
            url: "http://10.200.80.235:8080/xdfdtmanager/upload/uploadAudio.do",
            type: 'post',
            dataType: 'json',
            data: cbconfig,
            success: function (e) {
                alert(JSON.stringify(e));
                if(e.status == "failure"){
                    alert(e.message);
                }else {
                    alert(e.data.previewUrl);
                    $('#audio_record source').attr('src',e.data.previewUrl);
                    // $('#audio_record source').attr('src',e.data.diskFilePatn);
                    alert($('#audio_record source').attr('src'));
                    $('.teBox').val($('#audio_record source').attr('src'));
                }


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
    var playTimer = "",playId="";
    var audio = null;
    function voiceCheck(voiceId) {

        var newID = $(voiceId).attr('id');
        var oldId = $(audio).attr('id');
        if(audio != null){
            stop();
            audio = null;
        }
        audio = voiceId;
        if(newID!=oldId){

            play();
        }else{
            stop();
            // $('audio')[0].pause();
        }

        // alert($(audio).attr('id'));
        // // var audio = document.getElementById(voiceId);
        // clearTimeout(playTimer);
        // if(playId!=$(audio).attr('id')){
        //     $('audio')[0].pause();
        //     $('audio')[0].currentTime = 0;
        // }
        // $('.play-icon').removeClass('playing');
        // if(audio!==null){
        //     //检测播放是否已暂停.audio.paused 在播放器播放时返回false.
        //     alert(audio.paused);
        //     if(audio.paused){
        //         var second = 10;//parseInt($(audio).siblings('span').html());//获取音频秒数
        //         $(audio).siblings('.play-icon').addClass('playing');
        //         audio.currentTime = 0;
        //         audio.play();//audio.play();// 这个就是播放
        //         playTimer = setTimeout(function(){
        //             $(audio).siblings('.play-icon').removeClass('playing');
        //         },second*1000);
        //     }else{
        //         audio.pause();// 这个就是暂停
        //         audio.currentTime = 0;
        //         $(audio).siblings('.play-icon').removeClass('playing');
        //     }
        //     // audio = null;
        //     playId = $(audio).attr('id');
        // }
    }

    function stop() {
        $('audio')[0].pause();
        $('audio')[0].currentTime = 0;
        clearTimeout(playTimer);
        audio.currentTime = 0;
        $(audio).siblings('.play-icon').removeClass('playing');
    }
    function play() {
        var second = 10;//parseInt($(audio).siblings('span').html());//获取音频秒数
        audio.currentTime = 0;
        audio.play();//audio.play();// 这个就是播放
        //播放动画
        $(audio).siblings('.play-icon').addClass('playing');
        playTimer = setTimeout(function(){
            $(audio).siblings('.play-icon').removeClass('playing');
        },second*1000);
    }


    // 播放作业描述语音
    $(document).on('touchend', '.audio_box>div', function () {
        console.log('oooo'+$(this).find('audio')[0]);
        voiceCheck($(this).find('audio')[0]);
    });

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
