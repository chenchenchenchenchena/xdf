/**
 * Created by use1 on 2017-07-10.
 */
$(function () {
    var layer1;
    // //点击作业排行榜
    // $(document).on('touchend', '.hwRankTitle', function () {
    //     window.location.href = "studentrank_s.html";
    // });
    // // 显示作业信息
    // var hwInfos = JSON.parse(localStorage.homeworkInfos);
    // gethwInfos();
    // function gethwInfos() {
    //     var knowledgePoint, kpHtml;
    //     //知识点
    //     if (hwInfos.knowledgePoint != "" && hwInfos.knowledgePoint != null && hwInfos.knowledgePoint != undefined) {
    //         knowledgePoint = hwInfos.knowledgePoint.split(',');
    //         for (var i = 0; i < knowledgePoint.length; i++) {
    //             kpHtml = '<span>' + knowledgePoint[i] + '</span>';
    //             $('.knowPoint').append(kpHtml);
    //         }
    //     }
    //     //作业描述
    //     $('.hwCon').html(hwInfos.description);
    //     //语音，图片 TODO
    //
    // }

    /*------------------录制语音开始------------------------------------*/
    /**
     * 按下开始录音
     */
    $('#record').on('touchstart', function (event) {

        event.preventDefault();
        START = new Date().getTime();
        recordTimer = setTimeout(function () {
            wx.startRecord({
                success: function () {
                    localStorage.rainAllowRecord = 'true';
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
                    alert(localId);
                    localId = res.localId;
                    uploadVoiceWX(localId);

                },
                fail: function (res) {
                }
            });
        }
    });

    /**
     * 播放微信录制后的本地语音文件
     */
    function playVoice(plId) {
        alert("开始播放");
        //播放录音
        wx.playVoice({
            localId: plId // 需要播放的音频的本地ID，由stopRecord接口获得
        });
    }

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
                alert(JSON.stringify(res));
                //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
                serverId = res.serverId;
                uploadVoice(serverId);
            }
        });
    }

    /**
     *将serverId上传到自己服务器
     */
    function uploadVoice(serverId) {
        var cbconfig = {
            'appId': "wx559791e14e9ce521",
            'appSecret': "baa4373d5a8750c69b9d1655a2e31370",
            'mediaId': serverId,
            'schoolId': "73",
            'classId': "hx001"
        };
        $.ajax({
            // url: url_o + "upload/uploadAudio.do",
            url: "http://10.200.80.235:8080/xdfdtmanager/upload/uploadAudio.do",
            type: 'post',
            dataType: 'json',
            data: cbconfig,
            success: function (e) {
                alert(JSON.stringify(e));
                if (e.status == "failure") {
                    alert(e.message);
                } else {
                    $('.teBox').val(e.data.fileUrl);
                    //显示语音布局
                    showAudio(e.data.fileUrl, e.data.fileSize, $('#record_audio_box'), "record_audio");
                }


            }
        });
    }

    /**
     * 显示语音布局
     */
    function showAudio(url, length, idParent, idChildren) {

        idParent.show();
        length = 9;
        // url = "http://yunku.gokuai.com/file/ybvupnym#";

        var strVoice = "<div><audio id='" + idChildren + "'preload='auto'><source src='" + url + "' type='audio/mpeg'></audio>" +
            "<i class='play-icon'></i>" +
            "</div><span>" + length + "''</span>";
        idParent.html(strVoice);
        alert($('.audio_box #audio_record source').attr("src"));
    }

    /*------------------录制语音结束------------------------------------*/

    /*------------------图片选择开始------------------------------------*/
    /**
     *点击选择图片
     */
    $('#chooseImage').click(function () {
        wx.chooseImage({
            count: 3,
            success: function (res) {

                if (res.localIds.length > 0) {

                    var str = "";
                    for (var i = 0; i < res.localIds.length; i++) {

                        if (i % 3 == 0) {
                            str += " <div class = 'imgBox'>";
                        }
                        str += "<div><span class='stuImg'></span><img src='" + res.localIds[i] + "'/></div>";
                        if ((i + 1) % 3 == 0 || i == res.localIds.length - 1) {
                            str += "</div>";
                        }
                    }

                    $(".imgBox").show();
                    $(".notsubmit .imgBox").html(str);
                    //上传服务器
                    uploadImage(res.localIds);
                    //界面样式控制
                    if (res.localIds.length >= 3) {
                        $('#chooseImage').hide();
                    }
                }


            }
        });
    });

    /**
     * 图片上传到自己服务器
     */
    function uploadImage(images) {

        alert("9999999" + images.length + "---");
        for (var i = 0; i < images.length; i++) {
            alert(images[i]);
            var strImag = "<form class='submit_image' id='submit_image' name='submit_image' action='" + url_o + "upload/uploadFiles.do' method='post' enctype='multipart/form-data'>" +
                "<input class='schoolId_image' type='text' name='schoolId' value='73' /><input class='classId_image' type='text' name='classId' value='hx001'/>" +
                "<input type='file' class='image_file' name='file' value='" + images[i] + "'/></form>";
            alert(strImag);
            $('#image_form').html(strImag);
            // $('#submitBtn').on('touchend',function () {
            //     alert("提交表单");
            //     $("#submit_image").ajaxSubmit({
            //         resetForm: "true",
            //         type: 'post', // 提交方式 get/post
            //         url: url_o+'upload/uploadFiles.do', // 需要提交的 url
            //         data: {
            //             'schoolId': '73',
            //             'classId': 'hx001',
            //             'file':images[i]
            //         },
            //         success: function(data) { // data 保存提交后返回的数据，一般为 json 数据
            //             // 此处可对 data 作相关处理
            //             alert('提交成功！'+data);
            //         },
            //         error: function (jqxhr, errorMsg, errorThrown) {
            //             alert("提交失败")
            //         }
            //     });
            // })
            // $('.schoolId_image').val("73");
            // $('.classId_image').val("hx001");
            // $('.image_file').val(images[i]);
            //
            // $("form[enctype]").attr("action", url_o + $("form[enctype]").attr("action"));
            $("#submit_image").ajaxSubmit(function (data) {
                alert("ok:" + data);
                data = $.parseJSON(data);
                if (data.success == true) {
                } else {
                    alert(data.message);
                }

                // error: function (jqxhr, errorMsg, errorThrown) {
                //     alert(errorMsg);
                //     alert(jqxhr);
                //     alert(errorThrown);
                // }
            });

        }

    }

    /*----------------图片选择结束--------------------------------------*/

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
        var second = 20;//parseInt($(audio).siblings('span').html());//获取音频秒数
        audioCur.currentTime = 0;
        audioCur.play();
        //播放动画
        $(audioCur).siblings('.play-icon').addClass('playing');
        playTimer = setTimeout(function () {
            $(audioCur).siblings('.play-icon').removeClass('playing');
        }, second * 1000);
    }

    /*--------------------语音播放结束----------------------------------*/

    /*--------------------根据diskFileUrl从服务器获取文件地址--Start----------------------------------*/
    getFileInfo();
    /**
     * 获取文件信息
     */
    function getFileInfo(diskFileUrl) {
        diskFileUrl = "homework/b479a873299649a48d9741582a735450.jpg";
        var netConfig = "IN";//DEFAULT/IN
        var optionFile = {"fullPath": diskFileUrl, "net": netConfig, "getAttribute": false};
        $.ajax({
            url: url_o + "upload/viewFileDetail.do",
            type: 'post',
            dataType: 'json',
            data: optionFile,
            success: function (e) {
                alert(JSON.stringify(e));
                if (e.success == false) {
                    alert(e.message);
                } else {
                    //将文件显示到布局中
                    var fileType = e.fileType;
                    if (fileType == "mp3") {
                        showAudio(e.fileUrl, e.fileSize, $('#audio_1'), "audio1");
                    } else {
                        showImage(e.thumbnail);
                    }
                }
            }
        });
    }


    /**
     * 显示获取到的图片
     */
    function showImage(previewUrl) {
        $('#imagBox_1').show();
        var str = "";
        str += "<div class = 'imgBox'>";
        str += "<div><span class='stuImg'></span><img src='" + previewUrl + "'/></div>";
        str += "</div>";
        $('#imagBox_1').html(str);

    }

    /*--------------------根据diskFileUrl从服务器获取文件地址--End----------------------------------*/

    // 删除图片
    $(document).on('touchend', '.stuImg', function () {
        if ($(this).parents('.imgBox').find('div').length <= 1) {
            $(this).parents('.imgBox').remove();
        } else {
            $(this).parent('div').remove();
        }
        // 图片小于三张，显示添加图片按钮
        if ($('.notsubmit .imgBox').children('div').length < 3) {
            $('#chooseImage').show();
        }
    });
    //提交作业
    $(document).on('touchend', '#HWsubmit', function () {
        console.log($('.notsubmit .imgBox').children('div').length);
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

    // 图片预览
    $(document).on('touchend', '.imgBox>div>img', function () {
        alert("预览图片" + $(this).attr('src'));
        var previewUrl = "";
        if ($(this).attr('src').indexOf('weixin://') != -1) {
            previewUrl = $(this).attr('src');
        } else {
            previewUrl = 'http://dt.staff.xdf.cn/xdfdthome/homework/' + $(this).attr('src');
        }
        wx.previewImage({
            current: previewUrl, // 当前显示图片的http链接
            urls: [previewUrl] // 需要预览的图片http链接列表
        });
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
