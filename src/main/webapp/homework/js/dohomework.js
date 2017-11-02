/**
 * Created by use1 on 2017-07-10.
 */
$(function () {
    if(!sessionStorage.openid){
        wechatCode(location.href);
    };
    var WXnum  = {
        'wechatId':sessionStorage.openid
    };
    ajax_S(url.s_seac,WXnum,function(e){
        if(e.result==true){
            sessionStorage.stuNumber = e.data.studentNo;
            sessionStorage.schoolId = e.data.schoolId;
            sessionStorage.studentName = e.data.studentName;
        }else{
            sessionStorage.homeCanfig=='home'
            location.href = '../schedule/login_s.html'
        }
    });
    /**
     * 作业提交需要的参数
     */
    var fileParams = [];
    var voiceFileParams = [];
    // var homeworkSinfoId = GetRequest('id');
    var homeworkSinfoId = localStorage.homeworkSinfoId;//学生作业id
    var homeworkTinfoId = "";//老师作业id
    var classCode="";//班号
    if (GetRequest("teaHomeworkId")){//消息推送链接
        homeworkTinfoId = GetRequest("teaHomeworkId");
    }else{
        homeworkTinfoId = localStorage.homeworkTinfoId;
    }
    if (GetRequest("classCode")){//消息推送链接
        classCode = GetRequest("classCode");
    }else{
        classCode = localStorage.classcode;
    }
    var fileName;
    var fileType;
    var fileSize;
    var diskFilePath;
    var uploadUser = sessionStorage.studentName;
    var layer1, layer2, loading;
    // //点击作业排行榜
    $(document).on('touchend', '.hwRankTitle', function () {
        window.location.href = "studentrank_s.html";
    });
    //loading = layer.load();
    ajaxRequest('GET', homework_s.s_hwltdetail, 'stuNum='+sessionStorage.stuNumber+'&homeworkTinfoId='+homeworkTinfoId+'&classId='+classCode+'&userId='+localStorage.userId_stu, gethwDetailsSuccess);

    // var hwInfos = JSON.parse(localStorage.homeworkInfos).data;
    // gethwInfos();
    function gethwDetailsSuccess(msg) {
        if (msg.code == 200) {
            var knowledgePoint, kpHtml;
            var item = msg.data;
            if(item != undefined){
                localStorage.hwteacherId = item.homeworkTId;//老师主键id
                localStorage.hwstudentId = item.id;//学生主键id
                localStorage.classCode = item.classCode;//学生code

                //知识点
                if (item.knowledgePoint != "" && item.knowledgePoint != null && item.knowledgePoint != undefined) {
                    knowledgePoint = splitStrs(decodeURIComponent(item.knowledgePoint));
                    for (var i = 0; i < knowledgePoint.length; i++) {
                        kpHtml = '<span>' + knowledgePoint[i] + '</span>';
                        $('.knowPoint').append(kpHtml);
                    }
                }
                if(item.description != undefined && item.description != ""){
                    //作业描述
                    $('.hwCon').html(decodeURIComponent(item.description));
                }
                //语音，图片 TODO
                //语音，图片 TODO
                var allFilePath = {
                    "fileSfullPath": [],
                    "fileTfullPath": [],
                    "fileRfullPath": []
                };
                if (item.fileContents.length > 0) {
                    $.each(item.fileContents, function (i, paths) {
                        allFilePath.fileTfullPath.push({"fullPath": paths.diskFilePath});
                        // console.log("获取文件排序222"+JSON.stringify(allFilePath.fileTfullPath));

                    });
                    console.log("获取文件排序" + JSON.stringify(allFilePath));
                    ajaxRequest('POST', homework_s.s_fileRank, JSON.stringify(allFilePath), getAllFileRankSuccess);
                }
            }

        }else{
                console.log("获取作业详情失败");
            }
        //layer.close(loading);
        $('.waiting').hide();
    }

    var audioCount = 0;

    function getAllFileRankSuccess(msg) {
        if (msg.code == 200) {
            //获取老师作业信息
            if (msg.data.fileT != "" && msg.data.fileT != null && msg.data.fileT != undefined) {
                $.each(msg.data.fileT, function (i, paths) {
                    var pathUrls = ['1', paths.diskFilePath, paths.fileType];
                    // 获取语音和图片的预览地址 TODO
                    console.log(pathUrls);
                    // paths.fileType = 'jpg';
                    console.log(paths.diskFilePath);
                    if (paths.fileType.indexOf("mp3") != -1) {
                        //将文件显示到布局中
                        showAudio(paths.playTime, url_o + paths.relativePath, $('#audio_box'), audioCount, 2);
                        audioCount++;
                    } else {
                        //显示老师作业信息图片
                        showImage(paths.fileUrl,paths.thumbnail);
                    }
                });
            }
        } else {
            alert("获取文件失败");
        }
    }


    /**
     * 显示获取到的作业信息图片
     */
    function showImage(url,previewUrl) {
        $('#imagBox_1').show();
        var str = "";
        str += "<div><img onerror=javascript:this.src='images/error-image.png' data-img='"+url+"' src='" + previewUrl + "' /></div>";
        $('#imagBox_1').append(str);


    }

    /*------------------录制语音开始------------------------------------*/
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
    var timeInedex = 0;
    var recordTimer;
    var isCanStopRecord = false;
    var isCanStartRecord = true;
    var START = "";
    var END = "";
    $('#record_bg').on('touchstart', function (event) {
        if(!isCanStartRecord){
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
                    if(timeInedex == 49){
                        //layer.msg("语音录制长度最大限度为60s");
                        djs(10, function () {
                            //$(".timeTip").hide();
                            isCanStopRecord = true;
                            stopRecordBack(this_,event);
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
        },1000)
    }
    /**
     * 松手结束录音
     */
    $('#record_bg').on('touchend', function (event) {

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

    function stopRecordBack(this_,event){
        clearInterval(ts);
        if(!isCanStopRecord){
            return;
        }
        this_.siblings('img').attr('src', 'images/C04-03.png');
        event.preventDefault();

        //if (timeInedex < 1) {
        //    //小于1000ms，不录音
        //    clearInterval(recordTimer);
        //    timeInedex = 0;
        //    layer.msg("录制时间太短");
        //    wx.stopRecord({
        //        success: function (res) {
        //            isCanStartRecord = true;
        //            isCanStopRecord = false;
        //        }
        //    });
        //    return;
        //}
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
     * 上传微信服务器，获取保存的serverId
     */
    function uploadVoiceWX(upId) {
        $('.big_back').show();
        //调用微信的上传录音接口把本地录音先上传到微信的服务器
        //不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
        wx.uploadVoice({
            localId: upId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
                var serverId = res.serverId;
                uploadVoice(serverId);
            },
            complete: function () {
                //接口调用完成（失败成功）
                $('.big_back').hide();
            },
            fail: function () {
                $('.big_back').hide();
                //接口调用完成（失败）
                layer.msg("微信上传失败，请重新录制");
            }
        });
    }

    /**
     *将serverId上传到自己服务器
     */
    function uploadVoice(serverId) {
        var cbconfig = {
            'appId': appId,
            'appSecret': secreT,
            'mediaId': serverId,
            'schoolId': sessionStorage.schoolId,
            'classId': localStorage.classCode
        };
        ajaxRequest("Post",url_o + "upload/uploadAudio.do",cbconfig,function(e){
            $('.big_back').hide();
            if (e.status == "failure") {
                layer.msg(e.msg);
            } else {
                if (e.data.success) {
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
                } else {
                    layer.msg("语音上传失败");
                }

            }

        });
    }


    /**
     * 获取录制语音信息
     * @param diskFileUrl "fullPath": "homeworktest/73/HDXP3EB03/2017-07-27/fb628707b69a421d945cab3e5e23ff71.mp3"
     */
    function getRecordInfo(diskFileUrl) {
        var optionFile = {"fullPath": diskFileUrl};
        ajaxRequest("Post",url_o + "upload/getMp3Url.do",optionFile,function(e){
            /**
             *{
                 *  "code": "200",
                 *  "data": {
                 *     "playTime": 5,
                 *     "fullPath": "homeworktest/73/HDXP3EB03/2017-07-27/fb628707b69a421d945cab3e5e23ff71.mp3"
                 *  },
                 *  "status": "success"
                 *  }
             */
            if (e.status == "success") {
                //显示语音布局
                showAudio(e.data.playTime, url_o + e.data.fullPath, $('#record_audio_box'), recordCount, 1);
                recordCount++;

            } else {
                layer.msg("语音获取失败");
            }
        });
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
    function showAudio(playTime, url, parentId, id, flag) {

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

    }

    $('.song_s,.mask').hide();
    // 语音大于三张，隐藏添加语音按钮
    if ($('.notsubmit #record_audio_box li').length >= 3) {
        $('#record').hide();
    }


    /*------------------录制语音结束------------------------------------*/

    /*------------------图片选择开始------------------------------------*/

//重新选择图片，清除之前数据
    fileParams = [];
    var imageCount = 0;//控制提交图片个数
    /**
     *点击选择图片
     */
    $('#chooseImage').click(function () {
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
        var str = "<li><span class='stuImg' img-index='" + imageCount + "'></span><img data-img='"+localId+"' src='" + localId + "'/></li>";
        $(".notsubmit .imgBox").show();
        $(".notsubmit .imgBox").append(str);
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
        $('.big_back').show();
        var i = 0, length = images.localIds.length;

        function upload() {

            wx.uploadImage({
                localId: images.localIds[i],
                sizeType: ['compressed'],
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
            'schoolId': sessionStorage.schoolId,
            'classId': localStorage.classCode
        };
        ajaxRequest("Post",url_o + "upload/uploadFileByWeiChat.do",cbconfig,function(e){

            $('.big_back').hide();
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

        });

    }

    /*----------------图片选择结束--------------------------------------*/
    /*--------------------图片预览----------------------------------*/
    $(document).on('tap', '.imgBox img', function () {
        var previewUrl = $(this).attr('data-img');
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
        if($(this).val().indexOf('"')!=-1){
            $(this).val($(this).val().substr(0,$(this).val().length-1)+'“”')
        }
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
        if ($('#record_audio_box li').length > 3 || voiceFileParams.length > 3) {
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
        if ($('.notsubmit .imgBox li').length > 3 || fileParams.length > 3) {
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
            "description": encodeURIComponent($('.teBox').val()).replace(/'\+'/,'%20'),
            "fileStuhomeworks": fileStuhomeworks,
            "modify": false
        };
        // alert(JSON.stringify(reqData));
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

// 关闭消息提示
    function closeLayer(layerName) {
        setTimeout(function () {
            layer.close(layerName);
        }, 3000);
    }


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