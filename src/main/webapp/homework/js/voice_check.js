/**
 * Created by xupingwei on 2017/7/14.
 */
$(function () {
    var layer1,layer2,loading;
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

    /**
     * 显示语音布局
     */
    function showAudio(url, parentId, id, flag) {

        parentId.show();
        var strVoice = "";
        var idChildren;
        var length = "";
        if (flag == 1) {
            idChildren = "record_audio" + id;
            //录音布局，可以删除
            strVoice += "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto'><source src='" + url + "' type='audio/mpeg'></audio>" +
                "<i class='play-icon'></i><span class='stuVoice'></span></div><span class='voice_lenth'>" + length + "</span></li>";
        } else {

            idChildren = "audio" + id;
            strVoice += "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto'><source src='" + url + "' type='audio/mpeg'></audio>" +
                "<i class='play-icon'></i></div><span class='voice_lenth'>" + length + "</span></li>";
        }


        parentId.append(strVoice);

        var audioElem = document.getElementById(idChildren);
        audioElem.onloadedmetadata = getVoiceLen;
        function getVoiceLen() {
            var len = audioElem.duration;
            len = parseInt(len);
            var voiceLen = "";
            var hh = parseInt(len / 3600);
            var mm = parseInt((len % 3600) / 60);
            var ss = parseInt((len % 3600) % 60);
            if (hh > 0) {
                voiceLen = hh + "'" + mm + "'" + ss + "''";
            } else if (mm > 0) {
                voiceLen = mm + "'" + ss + "''";
            } else {
                voiceLen = ss + "''";
            }
            if (ss == 0) {

                voiceLen = "1''";
            }

            $('#' + idChildren).parent('div').siblings('.voice_lenth').html(voiceLen);
        }

        $('.song_s,.mask').hide();
        // 语音大于三张，隐藏添加语音按钮
        if ($('.notsubmit #record_audio_box li').length >= 3) {
            $('#record').hide();
        }
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
    /*------------------图片选择开始------------------------------------*/
    /**
     *点击选择图片
     */
    $('#chooseImage').click(function () {
        //重新选择图片，清除之前数据
        fileParams = [];
        wx.chooseImage({
            count: 3,
            success: function (res) {

                if (res.localIds.length > 0) {

                    var str = "";
                    for (var i = 0; i < res.localIds.length; i++) {
                        str += "<li><span class='stuImg' img-index='" + i + "'></span><img src='" + res.localIds[i] + "'/></li>";

                    }

                    $(".notsubmit .imgBox").show();
                    $(".notsubmit .imgBox").html(str);
                    //界面样式控制
                    if (res.localIds.length >= 3) {
                        $('#chooseImage').hide();
                    }

                    //上传服务器
                    upLoadWxImage(res);
                }


            }
        });
    });

    /**
     * 上传微信服务器
     * @param images
     */
    function upLoadWxImage(images) {

        if (images.localIds.length == 0) {
            return;
        }
        var i = 0, length = images.localIds.length;

        function upload() {
            wx.uploadImage({
                localId: images.localIds[i],
                success: function (res) {
                    uploadImage(res.serverId, i);
                    i++;
                    if (i < length) {
                        upload();
                    }
                },
                fail: function (res) {
                    // alert(JSON.stringify(res));
                }
            });
        }

        upload();
    }


    /**
     * 图片上传到自己服务器
     */
    function uploadImage(serverId, i) {
        var cbconfig = {
            'appId': "wx559791e14e9ce521",
            'appSecret': "baa4373d5a8750c69b9d1655a2e31370",
            'mediaId': serverId,
            'schoolId': sessionStorage.schoolId,
            'classId': localStorage.classCode
        };
        $.ajax({
            url: url_o + "upload/uploadFileByWeiChat.do",
            // url: "http://10.200.80.235:8080/xdfdtmanager/upload/uploadAudio.do",
            type: 'post',
            dataType: 'json',
            data: cbconfig,
            success: function (data) {
                // alert(JSON.stringify(data));
                if (data.status == "failure") {
                    alert(e.message);
                } else {
                    if (data.data.success == true) {
                        fileName = data.data.fileName;
                        fileSize = data.data.fileSize;
                        fileType = data.data.fileType;
                        diskFilePath = data.data.diskFilePath;
                        fileParams[i] = {
                            "homeworkSinfoId": homeworkSinfoId,
                            "fileName": fileName,
                            "fileType": fileType,
                            "fileSize": fileSize,
                            "diskFilePath": diskFilePath,
                            "uploadUser": uploadUser
                        };

                    } else {
                        //上传失败重新上传一次
                        uploadImage(serverId);
                    }

                }


            }
        });

    }

    /*----------------图片选择结束--------------------------------------*/
    /*--------------------图片预览----------------------------------*/
    $(document).on('touchend', '.imgBox img', function () {
        // alert("预览图片" + $(this).attr('src'));
        var previewUrl = $(this).attr('src');
        // if ($(this).attr('src').indexOf('weixin://') != -1&&$(this).attr('src').indexOf('http:') != -1) {
        //     previewUrl = $(this).attr('src');
        // } else {
        //     previewUrl = 'http://dt.staff.xdf.cn/xdfdthome/homework/' + $(this).attr('src');
        // }
        wx.previewImage({
            current: previewUrl, // 当前显示图片的http链接
            urls: [previewUrl] // 需要预览的图片http链接列表
        });
    });

    /*-------------------- 删除图片 --------------------*/
    $(document).on('touchend', '.stuImg', function () {
        // alert($(this).parent('li').index());
        $('.delete-img .confirmBtn').attr('img-index', $(this).parent('li').index());
        layer.close(layer1);
        layer.close(layer2);
        //删除图片
        layer2 = layer.open({
            type: 1,
            area: ['548px', '345px'],
            shade: [0.2, '#000'],
            title: '',
            skin: '',
            content: $(".delete-img")
        })
    });
    // 删除图片-取消
    $(document).on('touchend', '.delete-img .cancelBtn', function () {
        layer.close(layer1);
        layer.close(layer2);
    });
    // 删除图片-确定
    $(document).on('touchend', '.delete-img .confirmBtn', function () {

        var index = parseInt($(this).attr('img-index'));
        layer.close(layer1);
        layer.close(layer2);
        if ($('.imgBox').find('li').length <= 1) {
            $('.imgBox').hide();
        }
        // else {
        //     $('.imgBox div:eq('+parseInt($(this).attr('img-index'))+')').remove();
        // }
        $('.imgBox li:eq(' + index + ')').remove();
        // 图片小于三张，显示添加图片按钮
        if ($('.notsubmit .imgBox').children('div').length < 3) {
            $('#chooseImage').show();
        }
        if (fileParams.length > 0) {

            fileParams.splice(index, 1);
        }


    });

    /*-------------------- 删除语音 --------------------*/
    $(document).on('touchend', '.stuVoice', function () {
        //alert($(this).parents('.audio_box').index());
        $('.delete-voice .confirmBtn').attr('voice-index', $(this).parents('.audio_box').index());
        layer.close(layer1);
        layer.close(layer2);
        //删除语音
        layer2 = layer.open({
            type: 1,
            area: ['548px', '345px'],
            shade: [0.2, '#000'],
            title: '',
            skin: '',
            content: $(".delete-voice")
        })
    });
    // 删除语音-取消
    $(document).on('touchend', '.delete-voice .cancelBtn', function () {
        layer.close(layer1);
        layer.close(layer2);
    });
    // 删除语音-确定
    $(document).on('touchend', '.delete-voice .confirmBtn', function () {

        var index = parseInt($(this).attr('voice-index'));
        layer.close(layer1);
        layer.close(layer2);
        if ($('#record_audio_box').find('.audio_box').length <= 1) {
            $('#record_audio_box').hide();
        }

        $('#record_audio_box li:eq(' + index + ')').remove();
        // 语音小于三张，显示添加语音按钮
        if ($('.notsubmit #record_audio_box li').length < 3) {
            $('#record').show();
        }
        if (voiceFileParams.length > 0) {
            voiceFileParams.splice(index, 1);
            recordCount--;
        }


    });
    //作业描述验证
    $('.teBox').on('keyup', function () {
        if ($(this).val().length > 200) {
            $('.word').css('color', 'red');
            $('.teBox').val($(this).val().substr(0, 200));
            // $('.teBox').attr('readonly',true);
        } else {
            $('.word').css('color', '#808080');
        }
        $('.word').html('' + $(this).val().length + '/200')
    });
    //提交作业
    $(document).on('touchend', '#HWsubmit', function () {
        console.log($('.notsubmit .imgBox').children('div').length);
        // var answerVal = $('.teBox').val().trim();
        var answerVal = $('.teBox').val();
        // 答案不能为空
        if (answerVal == "" || answerVal == null) {
            layer.open({
                type: 1,
                area: ['310px', '195px'],
                shade: [0.1, '#fff'],
                title: false,
                skin: 'tips',
                time: 3000,
                content: '<div class="layer-tips">答案不能为空！</div>'
            });
            // closeLayer(layer1);
            return;
        }
        // 超出字数
        console.log(answerVal.length)
        if (answerVal.length > 200) {
            layer.open({
                type: 1,
                area: ['310px', '195px'],
                shade: [0.1, '#fff'],
                title: false,
                skin: 'tips',
                time: 3000,
                content: '<div class="layer-tips">超出字符上限！</div>'
            });
            // closeLayer(layer1);
            return;
        }
        // 语音最多可上传*个，图片最多可上传*个 TODO
        hwcommit();

    });
// 提交作业接口
    function hwcommit() {
        //将语音和图片一起传给服务器
        var fileStuhomeworks;

        fileStuhomeworks = fileParams.concat(voiceFileParams);

        var reqData = {
            "id": GetRequest('id'),
            "description": encodeURI($('.teBox').val()),
            "fileStuhomeworks": fileStuhomeworks
        };
        // alert(JSON.stringify(reqData));
        loading = layer.load();
        $('#HWsubmit').attr('disabled', "true");//禁用按钮
        $('#HWsubmit').addClass('btn-grey');
        ajaxRequest('POST', homework_s.s_hwcommit, JSON.stringify(reqData), hwCommitSuccess);
    }

    //提交作业--成功--确定
    $(document).on('touchend', '.submitBox .confirmBtn', function () {
        layer.close(layer2);
        window.location.href = 'homeworklist_s.html';
        // window.location.href = document.referrer;//返回上一页并刷新
    });
    //提交作业--失败--取消
    $(document).on('touchend', '.submitFail .cancelBtn', function () {
        layer.close(layer2);
    });
    //提交作业--失败--重试
    $(document).on('touchend', '.submitFail .retryBtn', function () {
        layer.close(layer2);
        layer.close(layer1);
        layer.close(layer);
        hwcommit();
    });
// 提交作业接口返回处理
    function hwCommitSuccess(msg) {
        $('#HWsubmit').attr('disabled', "true");//禁用按钮
        $('#HWsubmit').addClass('btn-grey');
        // alert(JSON.stringify(msg));
        // layer.close(layer);
        layer.close(layer1);
        layer.close(layer2);
        if (msg.code == 200) {
            //提交成功
            layer2 = layer.open({
                type: 1,
                area: ['548px', '345px'],
                shade: [0.2, '#000'],
                title: '',
                skin: '',
                content: $(".submitBox")
            });
        } else {
            //提交失败
            layer2 = layer.open({
                type: 1,
                area: ['548px', '345px'],
                shade: [0.2, '#000'],
                title: '',
                skin: '',
                content: $(".submitFail")
            })
        }
        $('#HWsubmit').removeAttr("disabled");
        $('#HWsubmit').removeClass('btn-grey');
        layer.close(loading);
    }
});