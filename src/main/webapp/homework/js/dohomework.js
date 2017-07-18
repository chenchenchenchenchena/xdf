/**
 * Created by use1 on 2017-07-10.
 */
$(function () {
    /**
     * 作业提交需要的参数
     */
    var fileParams = [];
    var voiceFileParams;
    var homeworkSinfoId = GetRequest('id');
    var fileName;
    var fileType;
    var fileSize;
    var diskFilePath;
    var uploadUser = sessionStorage.studentName;

    var layer1, layer2;
    // //点击作业排行榜
    $(document).on('touchend', '.hwRankTitle', function () {
        window.location.href = "studentrank_s.html";
    });
    var hwInfos = JSON.parse(localStorage.homeworkInfos).data;
    gethwInfos();
    function gethwInfos() {
        var knowledgePoint, kpHtml;
        $.each(hwInfos, function (i, item) {
            if (item.id == GetRequest('id')) {
                localStorage.hwteacherId = item.homeworkTId;//老师主键id
                localStorage.hwstudentId = item.id;//学生主键id
                localStorage.classCode = item.classCode;//学生code

                //知识点
                if (item.knowledgePoint != "" && item.knowledgePoint != null && item.knowledgePoint != undefined) {
                    knowledgePoint = splitStrs(item.knowledgePoint);
                    for (var i = 0; i < knowledgePoint.length; i++) {
                        kpHtml = '<span>' + knowledgePoint[i] + '</span>';
                        $('.knowPoint').append(kpHtml);
                    }
                }
                //作业描述
                $('.hwCon').html(item.description);
                //语音，图片 TODO
                $.each(item.fileContents, function (i, paths) {
                    var pathUrls = ['1', paths.diskFilePath, paths.fileType];
                    // 获取语音和图片的预览地址 TODO
                    console.log(pathUrls);
                    console.log(paths.diskFilePath);
                    getFileInfo(paths.diskFilePath);

                });

                return false;
            }

        });


    }

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
        //初始化语音参数
        voiceFileParams = null;
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
                    alert("语音提交成功");
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
                    //显示语音布局
                    showAudio(e.data.fileUrl, $('#record_audio_box'), recordCount, 1);

                    recordCount++;
                }


            }
        });
    }

    /**
     * 显示录制语音布局
     */
    function showAudio(url, parentId, id, flag) {


        parentId.show();
        var strVoice = "";
        var idChildren;
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
            if (len > 60) {

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
            } else {
                voiceLen = "1''";
            }

            $('#' + idChildren).parent('div').siblings('.voice_lenth').html(voiceLen);
        }

    }

    /*------------------录制语音结束------------------------------------*/

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

    /*--------------------根据diskFileUrl从服务器获取文件地址--Start----------------------------------*/
    var audioCount = 0;

    /**
     * 获取文件信息
     */
    function getFileInfo(diskFileUrl) {
        // diskFileUrl = "homework/b479a873299649a48d9741582a735450.jpg";
        var netConfig = "IN";//DEFAULT/IN
        var optionFile = {"fullPath": diskFileUrl, "net": netConfig, "getAttribute": false};
        $.ajax({
            url: url_o + "upload/viewFileDetail.do",
            type: 'post',
            dataType: 'json',
            data: optionFile,
            success: function (e) {
                if (e.success == false) {
                    console.log(e.message);
                } else {
                    //将文件显示到布局中
                    var fileType = e.fileType;
                    if (fileType.indexOf("mp3") != -1) {
                        showAudio(e.fileUrl, $('#audio_box'), audioCount, 2);
                        audioCount++;
                    } else {
                        showImage(e.thumbnail);
                    }

                }
            }
        });
    }

    /**
     * 显示获取到的图片布局
     */
    function showImage(previewUrl) {
        $('#imagBox_1').show();
        var str = "";
        str += "<div class = 'imgBox'>";
        str += "<div><img src='" + previewUrl + "'/></div>";
        str += "</div>";
        $('#imagBox_1').html(str);

    }

    /*--------------------根据diskFileUrl从服务器获取文件地址--End----------------------------------*/

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
        if (fileParams.length > 0) {
            fileParams.splice(index, 1);
            recordCount--;
        }


    });
    //作业描述验证
    $('.teBox').on('keyup', function () {
        if ($(this).val().length > 200) {
            $('.word').css('color', 'red');
        } else {
            $('.word').css('color', '#808080');
        }
        $('.word').html('' + $(this).val().length + '/200')
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
        hwcommit();

    });
// 提交作业接口
    function hwcommit() {

        //将语音和图片一起传给服务器
        if (voiceFileParams != undefined) {
            fileParams.push(voiceFileParams);
        }

        var reqData = {
            "id": GetRequest('id'),
            "description": $('.teBox').val(),
            "fileStuhomeworks": fileParams
        };
        // alert(JSON.stringify(reqData));
        ajaxRequest('POST', homework_s.s_hwcommit, JSON.stringify(reqData), hwCommitSuccess);
    }

    //提交作业--成功--确定
    $(document).on('touchend', '.submitBox .confirmBtn', function () {
        layer.close(layer2);
        window.location.href = 'homeworklist_s.html';
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

// 关闭消息提示
    function closeLayer(layerName) {
        setTimeout(function () {
            layer.close(layerName);
        }, 3000);
    }


// 提交作业接口返回处理
    function hwCommitSuccess(msg) {
        $('#HWsubmit').attr('disabled', "true");//禁用按钮
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
    }
})