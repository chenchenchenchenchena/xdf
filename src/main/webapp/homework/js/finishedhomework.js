/**
 * Created by use1 on 2017-07-10.
 */
$(function () {
    /**
     * 作业提交需要的参数
     */
    var fileParams = [];
    var voiceFileParams = [];
    var homeworkSinfoId = GetRequest('id');
    var fileName;
    var fileType;
    var fileSize;
    var diskFilePath;
    var uploadUser = sessionStorage.studentName;
    var layer1, layer2, loading;

    //点击作业排行榜
    $(document).on('touchend', '.hwRankTitle', function () {
        window.location.href = "studentrank_s.html";
    });
    // 显示作业信息
    var curIndex = GetRequest("curIndex");//课程index
    var classIndex = GetRequest("classIndex");//课次index
    var hwfinishInfos = JSON.parse(localStorage.finishhwInfos).data;
    var replyStatus = "";//老师批复状态
    var recordCount = 0;
    // 显示作业信息
    getHwFinishInfos();
    function getHwFinishInfos() {
        loading = layer.load();
        var datas = hwfinishInfos[curIndex].lessNos[classIndex];
        localStorage.hwteacherId = datas.homeworkTinfoId;//老师主键id
        /*******作业信息*******/
        //知识点
        if (datas.teacherKnowledgePoint != "" && datas.teacherKnowledgePoint != null && datas.teacherKnowledgePoint != undefined) {
            knowledgePoint = splitStrs(datas.teacherKnowledgePoint);
            for (var i = 0; i < knowledgePoint.length; i++) {
                kpHtml = '<span>' + knowledgePoint[i] + '</span>';
                $('.knowPoint').append(kpHtml);
            }
        }
        //作业描述
        $('.des .hwCon').html(decodeURI(datas.teacherDes));
        // 判断是否批复，未批复可重新提交答案
        replyStatus = datas.replyStatus;
        var myAnswerDes = decodeURI(datas.description);
        if (replyStatus == 1) {//已批复
            $('.answer').hide();

            /*******作业答案*******/
            if (myAnswerDes != "") {
                $('.hmAnswer .anDes').html(myAnswerDes).show();
            } else {
                $('.hmAnswer .anDes').hide();
            }

            // 优秀
            if (datas.tag == 1) {
                $('.hw_status').addClass('hw_status_s');
            } else {
                $('.hw_status').removeClass('hw_status_s');
            }
            /*******老师批注*******/
            var pizhuHtml = "";
            if (datas.replyStatus == "0") {
                pizhuHtml = "暂无批注"
            } else {
                var pizhu = decodeURI(datas.replyDesc).split('|>|');
                for(var i=0;i<pizhu.length;i++){
                    if(pizhu[i]=='+'||pizhu[i]==undefined||pizhu[i]=='undefined'){
                        if(pizhu.length>1){
                            pizhuHtml += '';
                        }else{
                            $('.comment .anDes').hide();
                        }
                    }else{
                        pizhuHtml += pizhu[i]+'<br/>';
                    }

                }
            }
            $('.comment .anDes').html(pizhuHtml).show();
            $('.hmAnswer,.comment').show();
        } else {
            $('.hmAnswer,.comment').hide();
            if (myAnswerDes != "") {
                $('.teBox').val(myAnswerDes);
            }
            console.log("888--" + $('.teBox').val());
            $('.answer').show();
        }


        //语音，图片
        var allFilePath = {
            "fileSfullPath": [],//学生作业文件云盘全路径
            "fileTfullPath": [],//老师作业文件云盘全路径
            "fileRfullPath": []//老师回复作业文件云盘全路径
        };
        if (datas.teaHomeworkFiles.length > 0 || datas.stuHomeworkFiles.length > 0 || datas.teaHomeworkReplyFiles.length > 0) {
            //老师作业信息---语音，图片
            $.each(datas.teaHomeworkFiles, function (i, paths) {
                allFilePath.fileTfullPath.push({"fullPath": paths.diskFilePath});
            });
            //学生答案信息--语音，图片
            $.each(datas.stuHomeworkFiles, function (i, paths) {
                allFilePath.fileSfullPath.push({"fullPath": paths.diskFilePath});
            });
            //老师批复作业信息---语音，图片
            $.each(datas.teaHomeworkReplyFiles, function (i, paths) {
                allFilePath.fileRfullPath.push({"fullPath": paths.diskFilePath});
            });
            console.log("获取文件排序" + JSON.stringify(allFilePath));
            ajaxRequest('POST', homework_s.s_fileRank, JSON.stringify(allFilePath), getAllFileRankSuccess);
        }
        layer.close(loading);
    }


    var voiceCount = 0;
    //获取文件信息
    function getAllFileRankSuccess(msg) {
        if (msg.code == 200) {
            //获取老师作业信息
            if (msg.data.fileT != "" && msg.data.fileT != null && msg.data.fileT != undefined) {
                $.each(msg.data.fileT, function (i, paths) {
                    // 获取语音和图片的预览地址
                    // paths.fileType = 'jpg';
                    var pathUrls = ['1', paths.diskFilePath, paths.fileType];
                    if (paths.fileType != undefined) {
                        if (paths.fileType.indexOf("mp3") != -1) {
                            //将文件显示到布局中
                            voiceCount++;
                            showAudio(paths.playTime,url_o + paths.diskFilePath, "audio_" + 1, "audio" + 1 + "" + voiceCount);
                        } else {
                            //将文件显示到布局中
                            showImage(paths.fileUrl, "imagBox_" + 1);
                        }
                    }

                });
            }
            //获取学生作业答案
            if (msg.data.fileS != "" && msg.data.fileS != null && msg.data.fileS != undefined) {
                var str = "";//添加图片html
                $.each(msg.data.fileS, function (i, paths) {
                    var pathUrls = ['2', paths.diskFilePath, paths.fileType];
                    // 获取语音和图片的预览地址
                    console.log(i + "---" + pathUrls);
                    if (paths.fileType.indexOf("mp3") != -1) {
                        if (replyStatus == 1) {//已批复
                            voiceCount++;
                            showAudio(paths.playTime,url_o + paths.diskFilePath, "audio_" + 2, "audio" + 2 + "" + voiceCount);
                        } else {
                            //显示可修改语音布局
                            showRecordAudio(paths.playTime,url_o + paths.diskFilePath, $('#record_audio_box'), recordCount, 1);
                            recordCount++;
                            var voiceFile = {
                                "homeworkSinfoId": homeworkSinfoId,
                                "fileName": paths.fileName,
                                "fileType": paths.fileType,
                                "fileSize": paths.fileSize,
                                "diskFilePath": paths.diskFilePath,
                                "uploadUser": uploadUser
                            };
                            voiceFileParams.push(voiceFile);
                        }
                    } else {
                        //将图片文件显示到布局中
                        if (replyStatus == 1) {//已批复
                            showImage(paths.fileUrl, "imagBox_" + 2);
                        } else {
                            str += "<li><span class='stuImg' img-index='" + i + "'></span><img src='" + paths.fileUrl + "'/></li>";
                            // $(".notsubmit .imgBox").show();
                            $(".notsubmit .imgBox").html(str).show();
                            //界面样式控制
                            if (i >= 2) {
                                $('#chooseImage').hide();
                            }
                            fileParams.push({
                                "homeworkSinfoId": homeworkSinfoId,
                                "fileName": paths.fileName,
                                "fileType": paths.fileType,
                                "fileSize": paths.fileSize,
                                "diskFilePath": paths.diskFilePath,
                                "uploadUser": uploadUser
                            });
                        }
                    }
                });
            }
            //获取老师批注
            if (msg.data.fileR != "" && msg.data.fileR != null && msg.data.fileR != undefined) {
                $.each(msg.data.fileR, function (i, paths) {
                    var pathUrls = ['3', paths.diskFilePath, paths.fileType];
                    // 获取语音和图片的预览地址
                    console.log(pathUrls);
                    if (paths.fileType.indexOf("mp3") != -1) {
                        voiceCount++;
                        showAudio(paths.playTime,url_o + paths.diskFilePath, "audio_" + 3, "audio" + 3 + "" + voiceCount);
                    } else {
                        //将文件显示到布局中
                        showImage(paths.fileUrl, "imagBox_" + 3);
                    }
                });
            }
        } else {
            alert("获取文件失败");
        }
    }

    /**
     *
     * 显示语音布局
     *
     * @param playTime 语音播放长度
     * @param url 语音播放地址
     * @param parentId 要显示布局的位置
     * @param idChildren 给要显示的布局定义一个id
     */
    function showAudio(playTime,url, idParent, idChildren) {

        $('#' + idParent).show();
        var len = parseInt(playTime)
        var hh = parseInt(len / 3600);
        var mm = parseInt((len % 3600) / 60);
        var ss = parseInt((len % 3600) % 60);
        var voiceLen = "";
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
        var strVoice = "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto' data-time='"+playTime+"'><source src='" + url + "' type='audio/mpeg'></audio>" +
            "<i class='play-icon'></i></div><span class='voice_lenth'>" + voiceLen + "</span></li>";

        $('#' + idParent).append(strVoice);


    }


    /**
     * 显示获取到的图片
     */
    function showImage(previewUrl, imageId) {
        $('#' + imageId).show();
        var str = "";
        // str += "<div class = 'imgBox'>";
        str += "<div><img src='" + previewUrl + "'/></div>";
        // str += "</div>";
        $('#' + imageId).append(str);
    }

    /**
     *
     * 显示语音布局
     *
     * @param playTime 语音播放长度
     * @param url 语音播放地址
     * @param parentId 要显示布局的位置
     * @param id 给要显示的布局定义一个id
     * @param flag 判断是否可以删除语音，不需要删除语音的布局不同
     */
    function showRecordAudio(playTime,url, parentId, id, flag) {

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
        if (flag == 1) {
            idChildren = "record_audio" + id;
            //录音布局，可以删除
            strVoice += "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto' data-time='"+playTime+"'><source src='" + url + "' type='audio/mpeg'></audio>" +
                "<i class='play-icon'></i><span class='stuVoice'></span></div><span class='voice_lenth'>" + voiceLen + "</span></li>";
        } else {

            idChildren = "audio" + id;
            strVoice += "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto' data-time='"+playTime+"'><source src='" + url + "' type='audio/mpeg'></audio>" +
                "<i class='play-icon'></i></div><span class='voice_lenth'>" + voiceLen + "</span></li>";
        }


        parentId.append(strVoice);

        $('.song_s,.mask').hide();
        // 语音大于三张，隐藏添加语音按钮
        if ($('.notsubmit #record_audio_box li').length >= 3) {
            $('#record').hide();
        }
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
    /**
     * 按下开始录音
     */
    var timeInedex = 0;
    var Index_s = -1;
    var timeds;
    var START;
    var END;
    var recordTimer;
    $('#record_bg').on('touchstart', function (event) {
        /*timeInedex = 0;
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
         }, 300);*/
        START = new Date().getTime();
        Index_s++;
        timeInedex = 0;
        $(this).siblings('img').attr('src', 'images/speak.gif');
        event.preventDefault();
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
    });

    /**
     * 松手结束录音
     */
    $('#record_bg').on('touchend', function (event) {
        /*$(this).attr('src', 'images/C04-03.png');
         event.preventDefault();
         END = new Date().getTime();
         if ((END - START) < 1000) {
         END = 0;
         START = 0;
         //小于1000ms，不录音
         clearTimeout(recordTimer);
         alert("录制时间太短");
         return;
         }
         wx.stopRecord({
         success: function (res) {
         clearInterval(timeds);
         localId = res.localId;
         $('.song_s').hide();
         uploadVoiceWX(localId);

         }, complete: function () {
         //接口调用完成（失败成功）

         },
         fail: function (res) {
         }
         });*/


        $(this).siblings('img').attr('src', 'images/C04-03.png');
        event.preventDefault();
        END = new Date().getTime();
        if ((END - START) < 1000) {
            END = 0;
            START = 0;
            //小于1000ms，不录音
            clearTimeout(recordTimer);
            alert("录制时间太短");
            return;
        }
        wx.stopRecord({
            success: function (res) {
                clearInterval(timeds);
                // var localId = res.localId;
                // song_s = localId;
                uploadVoiceWX(res.localId);
                // showAudio();
                $('.song_s').hide();
                $('.big_whit').hide();
            }
        });

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
            },
            complete: function () {
                //接口调用完成（失败成功）

            },
            fail: function (res) {
            }
        });
    }

    /**
     *将serverId上传到自己服务器
     */
    function uploadVoice(serverId, localId) {
        var cbconfig = {
            'appId': appId,
            'appSecret': secreT,
            'mediaId': serverId,
            'schoolId': sessionStorage.schoolId,
            'classId': localStorage.classCode
        };
        $.ajax({
            url: url_o + "upload/uploadAudio.do",
            type: 'post',
            dataType: 'json',
            data: cbconfig,
            success: function (e) {
                if (e.status == "failure") {
                    layer.msg(e.msg);
                } else {
                    if (e.data.success) {
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
                    }else {
                        layer.msg("语音上传失败");
                    }
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

                if (e.status == "success") {
                    //显示语音布局
                    showRecordAudio(e.data.playTime, url_o + e.data.fullPath, $('#record_audio_box'), recordCount, 1);
                    recordCount++;

                } else {
                    layer.msg("语音获取失败");
                }
            }
        });
    }

    /*------------------录制语音结束------------------------------------*/

    /*------------------图片选择开始------------------------------------*/
    /**
     *点击选择图片
     */
    fileParams = [];
    var imageCount = 0
    $('#chooseImage').click(function () {
        imageCount = $('.notsubmit .imgBox li').length;
        //重新选择图片，清除之前数据
        var count = 3 - imageCount;
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
     * 显示未提交图片布局
     */
    function showNotImg(localId) {
        var str = "<li><span class='stuImg' img-index='" + imageCount + "'></span><img src='" + localId + "'/></li>";
        $(".notsubmit .imgBox").append(str);
        $(".notsubmit .imgBox").show();

        imageCount++;

        //界面样式控制
        if (imageCount >= 3) {
            $('#chooseImage').hide();
        }
    }

    /**
     * 上传微信服务器
     * @param images
     */
    function upLoadWxImage(images) {

        if (images.localIds.length == 0) {
            alert('请先使用 chooseImage 接口选择图片');
            return;
        }
        var i = 0, length = images.localIds.length;

        function upload() {
            wx.uploadImage({
                localId: images.localIds[i],
                success: function (res) {
                    i++;
                    // serverIds.push(res.serverId);
                    // $('.teBox').val(res.serverId + "$" + images.localIds[i - 1]);
                    uploadImage(res.serverId, images.localIds[i - 1]);
                    if (i < length) {
                        upload();
                    }
                },
                fail: function (res) {
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
            'schoolId': sessionStorage.schoolId,
            'classId': localStorage.classCode
        };
        $.ajax({
                url: url_o + "upload/uploadFileByWeiChat.do",
                type: 'post',
                dataType: 'json',
                data: cbconfig,
                success: function (e) {
                    // alert(JSON.stringify(data));
                    if (e.status == "failure") {
                        layer.msg('图片上传失败');
                    } else if (e.status == "succeed") {

                        showNotImg(localID);
                        fileName = e.data.fileName;
                        fileSize = e.data.fileSize;
                        fileType = e.data.fileType;
                        diskFilePath = e.data.diskFilePath;
                        fileParams.push({
                            "homeworkSinfoId": homeworkSinfoId,
                            "fileName": fileName,
                            "fileType": fileType,
                            "fileSize": fileSize,
                            "diskFilePath": diskFilePath,
                            "uploadUser": uploadUser
                        });


                    }


                }
            }
        );

    }

    /*----------------图片选择结束--------------------------------------*/
    /*--------------------图片预览----------------------------------*/
    $(document).on('tap', '.imgBox img', function () {
        var previewUrl = $(this).attr('src');
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
            imageCount--;
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
        if ($('#record_audio_box li').length==0&&$('.notsubmit .imgBox li').length==0&&(answerVal == "" || answerVal == null)) {
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
        // 语音最多可上传*个，图片最多可上传3个
        if ($('#record_audio_box li').length > 3) {
            layer.open({
                type: 1,
                area: ['310px', '195px'],
                shade: [0.1, '#fff'],
                title: false,
                skin: 'tips',
                time: 3000,
                content: '<div class="layer-tips">最多可传3段语音！</div>'
            });
            return;
        }
        if ($('.notsubmit .imgBox li').length > 3) {
            layer.open({
                type: 1,
                area: ['310px', '195px'],
                shade: [0.1, '#fff'],
                title: false,
                skin: 'tips',
                time: 3000,
                content: '<div class="layer-tips">最多可传3张图片！</div>'
            });
            return;
        }
        // hwcommit();
        //确认提交？
        layer2 = layer.open({
            type: 1,
            area: ['548px', '345px'],
            shade: [0.2, '#000'],
            title: '',
            skin: '',
            content: $(".confirm-sub")
        })

    });
    //    提交二次确认---确认
    $(document).on('touchend', '.confirm-sub .confirmBtn', function () {
        hwcommit();
    });
//    提交二次确认---取消
    $(document).on('touchend', '.confirm-sub .cancelBtn', function () {
        layer.close(layer2);
    });
// 提交作业接口
    function hwcommit() {

        //将语音和图片一起传给服务器
        var fileStuhomeworks;

        fileStuhomeworks = fileParams.concat(voiceFileParams);

        var reqData = {
            "id": GetRequest('id'),
            "description": encodeURI($('.teBox').val()),
            "fileStuhomeworks": fileStuhomeworks,
            "modify": true
        };
        // console.log(JSON.stringify(reqData));
        loading = layer.load();
        $('#HWsubmit,.confirm-sub .confirmBtn').attr('disabled', "true");//禁用按钮
        $('#HWsubmit,.confirm-sub .confirmBtn').addClass('btn-grey');
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
        $('#HWsubmit,.confirm-sub .confirmBtn').attr('disabled', "true");//禁用按钮
        $('#HWsubmit,.confirm-sub .confirmBtn').addClass('btn-grey');
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
        $('#HWsubmit,.confirm-sub .confirmBtn').removeAttr("disabled");
        $('#HWsubmit,.confirm-sub .confirmBtn').removeClass('btn-grey');
        layer.close(loading);
    }

})
;
