/**
 * Created by use1 on 2017-07-10.
 */
$(function () {
    var layer1;
    //点击作业排行榜
    $(document).on('touchend', '.hwRankTitle', function () {
        window.location.href = "studentrank_s.html";
    });

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
                    uploadVoiceWX(localId);
                    // playVoice(localId);

                },
                fail: function (res) {
                }
            });
        }
    });

    //播放微信录制后的本地语音文件
    function playVoice(plId) {
        alert("开始播放");
        //播放录音
        wx.playVoice({
            localId: plId // 需要播放的音频的本地ID，由stopRecord接口获得
        });
    }

    //测试数据
    // $('#record').click(function () {
    //     // uploadVoice("hMC05XthkxWBjgHNbbh1X3mheuBeua0JWPcEbdStrOw1Gxqks2k5n7BHgt5VYpJ");
    //     // uploadVoice("vvCBGtvWnpWChiXZnOcyVuljzy5CgHASAcgKehDWWOqj5ITOezW7KziODYOQ4cwW");
    //     // uploadVoice("Lcc4kpav4pq15Epsjgp46Lk52tPTDTKaWMTnsSCKcto2RfHbKs7Ct3yvmIe93Rmm");
    //     showAudio();
    // });

    //上传微信服务器，获取保存的serverId
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

    //将serverId上传到自己服务器
    function uploadVoice(serverId) {
        var cbconfig = {
            'appId': "wx559791e14e9ce521",
            'appSecret': "baa4373d5a8750c69b9d1655a2e31370",
            'mediaId': serverId,
            'schoolId': "73",
            'classId': "hx001"
        };
        $.ajax({
            url: url_o + "upload/uploadAudio.do",
            // url: "http://10.200.80.235:8080/xdfdtmanager/upload/uploadAudio.do",
            type: 'post',
            dataType: 'json',
            data: cbconfig,
            success: function (e) {
                alert(JSON.stringify(e));
                if (e.status == "failure") {
                    alert(e.message);
                } else {
                    $('.teBox').val(e.data);

                    //显示语音布局
                    showAudio(e.data.fileUrl,e.data.fileSize);
                }


            }
        });
    }

    //显示语音布局
    function showAudio(url,length) {

        $('.notsubmit').show();
        $('.audio_box').show();

        var strVoice = "<div><audio id='audio_record'preload='auto'><source src='" + url + "' type='audio/mpeg'></audio>" +
            "<i class='play-icon'></i>" +
            "</div><span>"+length+"''</span>";
        $(".audio_box").html(strVoice);
    }

    //点击选择图片
    $('#chooseImage').click(function () {
        wx.chooseImage({
            count: 3,
            success: function (res) {
                $('.notsubmit').show();
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
    var playTimer = "", playFlag = false;
    var audioCur = null;

    //语音播放方法
    function voiceCheck(voiceId) {

        var newID = $(voiceId).attr('id');
        var oldId = $(audioCur).attr('id');
        if (audioCur != null) {
            stop();
            audioCur = null;
        }
        audioCur = voiceId;
        if (newID != oldId) {
            play();
        } else {
            stop();
        }
        // if(audioCur != null){
        //     if(newID!=oldId){
        //         audioCur = voiceId;
        //         play();
        //     }else{
        //         alert(audioCur.paused);
        //         if(audioCur.paused){
        //             play();
        //         }else{
        //             stop();
        //         }
        //     }
        //     audioCur = null;
        // }else{
        //     audioCur = voiceId;
        //     play();
        // }

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

    //停止播放方法
    function stop() {
        audioCur.pause();
        // $(audioCur)[0].currentTime = 0;
        audioCur.currentTime = 0;
        clearTimeout(playTimer);
        $(audioCur).siblings('.play-icon').removeClass('playing');
    }

    //开始播放方法
    function play() {
        var second = 20;//parseInt($(audio).siblings('span').html());//获取音频秒数
        audioCur.currentTime = 0;
        audioCur.play();//audio.play();// 这个就是播放
        //播放动画
        $(audioCur).siblings('.play-icon').addClass('playing');
        playTimer = setTimeout(function () {
            $(audioCur).siblings('.play-icon').removeClass('playing');
        }, second * 1000);
    }

    // 播放作业描述语音
    $(document).on('touchend', '.audio_box>div', function () {
        console.log('oooo' + $(this).find('audio')[0]);
        voiceCheck($(this).find('audio')[0]);
    });

    // 删除图片
    $(document).on('touchend', '.stuImg', function () {
        if ($(this).parents('.imgBox').find('div').length <= 1) {
            $(this).parents('.imgBox').remove();
        } else {
            $(this).parent('div').remove();
        }
    });
    //提交作业
    $(document).on('touchend', '#HWsubmit', function () {
        var answerVal = $('.teBox').val().trim();
        // 答案不能为空
        if (answerVal == "" || answerVal == null) {
            layer1 = layer.open({
                type: 1,
                area: ['310px', '195px'],
                shade: [0.1, '#fff'],
                title: false,
                skin: 'tips',
                content: '<div class="layer-tips">答案不能为空！</div>'
            });
            closeLayer(layer1);
            return;
        }
        // 超出字数
        console.log(answerVal.length)
        if (answerVal.length > 200) {
            layer1 = layer.open({
                type: 1,
                area: ['310px', '195px'],
                shade: [0.1, '#fff'],
                title: false,
                skin: 'tips',
                content: '<div class="layer-tips">超出字符上限！</div>'
            });
            closeLayer(layer1);
            return;
        }
        // 语音最多可上传*个，图片最多可上传*个 TODO
    });
    // 关闭消息提示
    function closeLayer(layerName) {
        setTimeout(function () {
            layer.close(layerName);
        }, 3000);
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
