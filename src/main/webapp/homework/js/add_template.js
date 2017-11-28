$(function () {
    /*---------全局参数定义--------start*/

    var recordCount = 0;//判断语音录制条数
    var timeInedex = 0;
    var recordTimer;
    var isCanStopRecord = false;
    var isCanStartRecord = true;
    var START = "";
    var END = "";

    var imgCount = 0;

    var arr_s = [];
    var arr_voice = [];
    var arr_image = [];

    var delVoiceLayer;
    var delImageLayer;
    var confirmSubLayer;

    var tempId = "";//为空则表示当前是新建模版，不为空则表示修改模版
    var loading;

    var homeworkTime =  sessionStorage.homeworkTime_s;
    var classCode = sessionStorage.classCode_s;

    /*---------全局参数定义--------end*/

    /**
     * 判断是否是编辑模版
     */
    if(sessionStorage.templateEdit){
        var templateData = JSON.parse(sessionStorage.templateEdit);//获取模版信息
        //首先获取未提交区域的内容信息
        tempId = templateData.id;
        var tempContent = decodeURIComponent(decodeURIComponent(templateData.description));
        var templateFileList = templateData.homeworkReplyTemplateFileList;//文件列表
        $('.answer .teBox').val(tempContent);
        getTempFileInfo(JSON.stringify(templateFileList));
    }

    /**
     * 调取接口获取文件展示信息
     * @param e
     */
    function getTempFileInfo(templateFile) {
        var templateFileList = JSON.parse(templateFile);
        var fileFullPath = [];
        for (var j = 0; j < templateFileList.length; j++) {
            fileFullPath.push({"fullPath": templateFileList[j].diskFilePath});
        }
        if (fileFullPath.length != 0) {

            var params = {
                'fileSfullPath': [],
                'fileTfullPath': [],
                'fileRfullPath': fileFullPath
            };
            ajaxRequest("POST", homework_s.t_getFileDetails, JSON.stringify(params), function(e){
                if(e.code == 200){
                    var fileR = e.data.fileR;
                    recordCount = 0;
                    for(var i = 0;i<fileR.length;i++){
                        var fileType = fileR[i].fileType;
                        var playTime = fileR[i].playTime;
                        if(fileType == "mp3"){
                            arr_voice.push({
                                'fileName': fileR[i].fileName,
                                'fileType': fileR[i].fileType,
                                'fileSize': fileR[i].fileSize,
                                'diskFilePath': fileR[i].diskFilePath,
                                'uploadUser':localStorage.teacherName
                            });
                            showAudio(playTime, url_o + fileR[i].diskFilePath, $('#notsubmit_voice'), recordCount);
                            recordCount++;
                        }else {
                            arr_image.push({
                                'fileName': fileR[i].fileName,
                                'fileType': fileR[i].fileType,
                                'fileSize': fileR[i].fileSize,
                                'diskFilePath': fileR[i].diskFilePath,
                                'uploadUser':localStorage.teacherName
                            });
                            showUpdataImage(fileR[i].fileUrl);
                        }
                    }

                }
            }, function(e){
                layer.msg('模版信息获取失败');
            });

        }
    }

    /**
     * 添加文本描述
     */
    $('.teBox').on('keyup change', function () {
        if ($(this).val().indexOf('"') != -1) {
            $(this).val($(this).val().substr(0, $(this).val().length - 1) + '“”')
        }
        $('.teacherword').html('' + $(this).val().length + '/200');
        if ($(this).val().length > 200) {
            console.log(0)
            $('.teacherword').css('color', 'red');
            $(this).val($(this).val().substring(0, 200));
        } else {
            $('.teacherword').css('color', '#808080');
        }
    });

    /**
     * 添加语音操作
     */
    $('#add_voice').click(function () {
        if (recordCount >= 3) {
            alert("最多录制三条语音");
        } else {
            $('.big_whit').show();
            $('.song_s').show();
        }
    });

    $('#record').on('touchstart', function (event) {
        if (!isCanStartRecord) {
            return;
        }
        START = new Date().getTime();
        timeInedex = 0;
        var this_ = $(this);
        $(this).siblings('img').attr('src', 'images/speak.gif');
        event.preventDefault();
        wx.startRecord({
            success: function () {
                localStorage.rainAllowRecord = 'true';
                recordTimer = setInterval(function () {
                    timeInedex++;
                    if (timeInedex == 49) {
                        //layer.msg("语音录制长度最大限度为60s");
                        djs(10, function () {
                            //$(".timeTip").hide();
                            isCanStopRecord = true;
                            stopRecordBack(this_, event);
                        });
                    }
                }, 1000);
            },
            cancel: function () {
                layer.msg('用户拒绝授权录音');
                wx.stopRecord({
                    success: function (res) {
                        clearInterval(recordTimer);
                        $('.song_s').hide();
                        $('.big_whit').hide();
                        this_.siblings('img').attr('src', 'images/C04-03.png');
                        isCanStartRecord = true;
                        isCanStopRecord = false;
                    }
                });
            },
            fail: function () {
                wx.stopRecord({
                    success: function (res) {
                        clearInterval(recordTimer);
                        $('.song_s').hide();
                        $('.big_whit').hide();
                        this_.siblings('img').attr('src', 'images/C04-03.png');
                        isCanStartRecord = true;
                        isCanStopRecord = false;
                    }
                });
            }
        });
    });

    var ts;

    function djs(t, callback) {
        ts = setInterval(function () {
            layer.msg(t);
            t -= 1;
            if (t == 0) {
                clearInterval(ts);
                callback(callback);
            }
        }, 1000)
    }

    var song_s = '';
    //松手结束录音
    $('#record').on('touchend', function (event) {
        var this_ = $(this);
        if (timeInedex == 0) {
            setTimeout(function () {
                END = new Date().getTime();
                if ((END - START) < 1500) {
                    END = 0;
                    START = 0;
                    //小于1000ms，不录音
                    clearTimeout(recordTimer);
                    wx.stopRecord({
                        success: function (res) {
                            clearInterval(recordTimer);
                            $('.song_s').hide();
                            $('.big_whit').hide();
                            this_.siblings('img').attr('src', 'images/C04-03.png');
                            isCanStartRecord = true;
                            isCanStopRecord = false;
                            layer.msg("录制时间太短");
                        },
                        fail: function () {
                            layer.msg("录制时间太短");
                            clearInterval(recordTimer);
                            $('.song_s').hide();
                            $('.big_whit').hide();
                            this_.siblings('img').attr('src', 'images/C04-03.png');
                            isCanStartRecord = true;
                            isCanStopRecord = false;
                        }
                    });
                    return false;
                } else {
                    //表示录制刚结束
                    return false;
                }
            }, 300);
        } else {
            isCanStopRecord = true;
            stopRecordBack(this_, event);
        }

    });

    function stopRecordBack(this_, event) {
        clearInterval(ts);
        if (!isCanStopRecord) {
            return;
        }
        this_.siblings('img').attr('src', 'images/C04-03.png');
        event.preventDefault();

        clearInterval(recordTimer);
        timeInedex = 0;
        wx.stopRecord({
            success: function (res) {
                var localId = res.localId;
                song_s = localId;
                uploadVoiceWX(localId);
                $('.song_s').hide();
                $('.big_whit').hide();
                isCanStartRecord = true;
                isCanStopRecord = false;
            }
        });
    }

    /**
     *上传微信服务器，获取保存的serverId
     */
    function uploadVoiceWX(upId) {
        $('.big_back').show();
        wx.uploadVoice({
            localId: upId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                uploadVoice(res.serverId);
            },
            complete: function () {
                //接口调用完成（失败成功）
                $('.big_back').hide();
            },
            fail: function (res) {
                $('.big_back').hide();
            }
        });
    }

    /**
     *将语音serverId上传到自己服务器
     */
    function uploadVoice(serverId) {
        var cbconfig = {
            'appId': appId,
            'appSecret': secreT,
            'mediaId': serverId,
            'schoolId': localStorage.schoolId,
            'classId': sessionStorage.classCode_s,
            'templateFlag':"1"
        };
        ajaxRequest("Post", homework_s.uploadAudio, cbconfig, function (e) {
            $('.big_back').hide();
            if (e.status == "failure") {
                layer.msg(e.msg);
            } else {
                if (e.data.success) {
                    arr_voice.push({
                        'fileName': e.data.fileName,
                        'fileType': e.data.fileType,
                        'fileSize': e.data.fileSize,
                        'diskFilePath': e.data.diskFilePath,
                        'uploadUser':localStorage.teacherName
                    });
                    layer.open({
                        type: 1,
                        area: ['548px', '345px'],
                        shade: [0.2, '#000'],
                        title: '',
                        skin: '',
                        time: 3000,
                        content: $(".music_succ")
                    });
                    getRecordInfo(e.data.diskFilePath);
                }
                else {
                    layer.msg("语音上传失败");
                }
            }
        });
    }

    /**
     * 获取录制语音信息
     */
    function getRecordInfo(diskFileUrl) {
        var optionFile = {"fullPath": diskFileUrl};
        ajaxRequest("Post", homework_s.getMp3Url, optionFile, function (e) {
            if (e.status == "failed") {
                layer.msg("语音获取失败");
            } else {
                //显示语音布局
                showAudio(e.data.playTime, url_o + e.data.fullPath, $('#notsubmit_voice'), recordCount);
                recordCount++;
            }
        });
    }

    /**
     * 显示语音布局
     * @param playTime  语音播放时长
     * @param url 语音播放地址
     * @param parentId  语音布局需要添加到的父节点
     * @param id  语音控件id，播放时需要
     */
    function showAudio(playTime, url, parentId, id) {

        parentId.show();
        var strVoice = "";
        var idChildren;
        var length = parseInt(playTime);
        var voiceLen = "";
        var hh = parseInt(length / 3600);
        var mm = parseInt((length % 3600) / 60);
        var ss = parseInt((length % 3600) % 60);
        if (hh > 0) {
            voiceLen = hh + "'" + mm + "'" + ss + "''";
        } else if (mm > 0) {
            voiceLen = mm + "'" + ss + "''";
        } else {
            if (ss == 0) {

                voiceLen = "1''";
            } else {
                voiceLen = ss + "''";
            }
        }
        idChildren = "record_audio" + id;
        strVoice += "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto' data-time='" + playTime + "'><source src='" + url + "' type='audio/mpeg'></audio>" +
            "<i class='play-icon'></i><span class='stuVoice'></span></div><span class='voice_lenth'>" + voiceLen + "</span></li>";

        parentId.append(strVoice);

        $('.song_s,.mask').hide();
        $('.big_back').hide();
        // 语音大于三张，隐藏添加语音按钮
        if (parentId.find('li').length >= 3) {
            $('#record').hide();
        }
    }

    //点击旁边区域取消录音
    $('.big_whit').on('touchend', function () {
        setTimeout(function () {
            $('.big_whit').hide();
            $('.song_s').hide();
            $('.big_back').hide();
        },300);
    });

    /**
     * 添加图片操作
     */
    $('#add_image').click(function () {
        imgCount = $('.notsubmit .imgBox li').length;
        alert(imgCount);
        //重新选择图片，追加图片，max = 3；
        var count = 3 - imgCount;
        wx.chooseImage({
            count: count,
            success: function (res) {
                if (res.localIds.length > 0) {
                    //上传服务器
                    upLoadWxImage(res);
                }
            }
        });
    });

    /**
     * 图片上传微信服务器
     * @param images
     */
    function upLoadWxImage(images) {

        if (images.localIds.length == 0) {
            alert('请先使用 chooseImage 接口选择图片');
            return;
        }
        $('.big_back').show();
        var i = 0, length = images.localIds.length;

        function upload() {
            wx.uploadImage({
                localId: images.localIds[i],
                success: function (res) {
                    i++;
                    uploadImage(res.serverId, images.localIds[i - 1]);
                    if (i < length) {
                        upload();
                    }
                },
                fail: function (res) {
                    $('.big_back').hide();
                }
            });
        }

        upload();
    }

    /**
     * 图片上传到自己服务器
     */
    function uploadImage(serverId, localID) {
        var cbconfig = {
            'appId': appId,
            'appSecret': secreT,
            'mediaId': serverId,
            'schoolId': localStorage.schoolId,
            'classId': sessionStorage.classCode_s,
            'templateFlag':"1"
        };
        ajaxRequest("Post", homework_s.uploadImage, cbconfig, function (e) {
            $('.big_back').hide();
            if (e.status == "failure") {
                // alert(e.msg);
                layer.msg('图片上传失败');

            } else if (e.status == "succeed") {
                showUpdataImage(localID);
                arr_image.push({
                    'fileName': e.data.fileName,
                    'fileType': e.data.fileType,
                    'fileSize': e.data.fileSize,
                    'diskFilePath': e.data.diskFilePath,
                    'uploadUser':localStorage.teacherName
                });
            }

        });

    }

    /**
     * 显示图片布局
     * @param url 图片地址
     */
    function showUpdataImage(url) {
        var str = "<li><span class='stuImg' img-index='" + imgCount + "'></span><img data-img='" + url + "' src='" + url + "'/></li>";
        $(".notsubmit .imgBox").show();
        $(".notsubmit .imgBox").append(str);
        //界面样式控制
        if ($('.notsubmit .imgBox li').length >= 3) {
            $('#add_image').hide();
        }
    }

    /**
     * 图片预览
     */
    $(document).on('tap', '.notsubmit .imgBox img', function () {
        var previewUrl = $(this).attr('data-img');
        wx.previewImage({
            current: previewUrl, // 当前显示图片的http链接
            urls: [previewUrl] // 需要预览的图片http链接列表
        });

    });

    /*-------------------- 删除语音 --------------------*/
    $(document).on('touchend', '.stuVoice', function () {
        $('.delete-voice .confirmBtn').attr('voice-index', $(this).parents('.audio_box').index());
        layer.close(delVoiceLayer);
        layer.close(delImageLayer);
        //删除语音
        delVoiceLayer = layer.open({
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
        layer.close(delVoiceLayer);
        layer.close(delImageLayer);
    });
    // 删除语音-确定
    $(document).on('touchend', '.delete-voice .confirmBtn', function () {

        var index = parseInt($(this).attr('voice-index'));
        layer.close(delVoiceLayer);
        layer.close(delImageLayer);
        if ($('#record_audio_box').find('.audio_box').length <= 1) {
            $('#record_audio_box').hide();
        }

        $('#notsubmit_voice li:eq(' + index + ')').remove();
        // 语音小于三张，显示添加语音按钮
        if ($('#notsubmit_voice li').length < 3) {
            $('#add_voice').show();
        }
        if (arr_voice.length > 0) {
            arr_voice.splice(index, 1);
            recordCount--;
        }


    });
    /*-------------------- 删除图片 --------------------*/
    $(document).on('touchend', '.stuImg', function () {
        // alert($(this).parent('li').index());
        $('.delete-img .confirmBtn').attr('img-index', $(this).parent('li').index());
        layer.close(delVoiceLayer);
        layer.close(delImageLayer);
        //删除图片
        delImageLayer = layer.open({
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
        layer.close(delVoiceLayer);
        layer.close(delImageLayer);
    });
    // 删除图片-确定
    $(document).on('touchend', '.delete-img .confirmBtn', function () {

        var index = parseInt($(this).attr('img-index'));
        layer.close(delVoiceLayer);
        layer.close(delImageLayer);
        if ($('.imgBox').find('li').length < 1) {
            $('.imgBox').hide();
        }

        $('.notsubmit .imgBox li:eq(' + index + ')').remove();
        // 图片小于三张，显示添加图片按钮
        if ($('.notsubmit .imgBox').children('div').length < 3) {
            $('#add_image').show();
        }
        if (arr_image.length > 0) {
            arr_image.splice(index, 1);
        }
    });

    /**
     * 提交操作
     */
    $('#sumbit_temp').click(function () {
        var text_content = $('.teBox').val();//获取文本描述信息
        if(text_content == "" && arr_voice.length == 0 && arr_image.length == 0){
            //如果三者都为空，则不能提交
            layer.msg('请输入内容');
        }
        //提交二次确认
        confirmSubLayer = layer.open({
            type: 1,
            area: ['548px', '345px'],
            shade: [0.2, '#000'],
            title: '',
            skin: '',
            content: $(".confirm-sub")
        });
    });
    //提交二次确认---确认
    $(document).on('touchend', '.confirm-sub .confirmBtn', function () {
        tempCommit();
    });
    //提交二次确认---取消
    $(document).on('touchend', '.confirm-sub .cancelBtn', function () {
        layer.close(confirmSubLayer);
    });

    /**
     * 提交接口实现
     */
    function tempCommit(){
        var text_content = $('.teBox').val();
        arr_s = arr_voice.concat(arr_image);
        var params;
        if(sessionStorage.templateEdit){
            params = {
                'id':tempId,
                'schoolId':localStorage.schoolId,
                'teacherEmail':localStorage.terEmail,
                'teacherName':localStorage.teacherName,
                'description':encodeURIComponent(text_content).replace(/'\+'/,'%20'),
                'homeworkReplyTemplateFiles':arr_s
            };
        }else {
            params = {
                'id':tempId,
                'schoolId':localStorage.schoolId,
                'teacherEmail':localStorage.terEmail,
                'teacherName':localStorage.teacherName,
                'description':encodeURIComponent(text_content).replace(/'\+'/,'%20'),
                'homeworkReplyTemplateFiles':arr_s,
                'homeworkTime':homeworkTime,
                'classCode':classCode
            };
        }

        sessionStorage.removeItem('templateEdit');//移除编辑状态标志
        loading = layer.load();
        ajaxRequest("POST",homework_s.temp_commit,JSON.stringify(params),function(e){
            layer.close(loading);
            if(e.code == 200){
                layer.msg(e.msg);
                //history.go(-1);
                location.href = 'reply_template.html';
            }else {
                layer.msg(e.msg);
            }
        },function(e){
            layer.msg("提交失败");
            layer.close(loading);
        });
    }
})