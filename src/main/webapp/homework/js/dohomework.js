/**
 * Created by use1 on 2017-07-10.
 */
$(function () {
    /**
     * 作业提交需要的参数
     */
    var commitParams;
    var fileParams = [];
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
    // // 显示作业信息
    // alert(JSON.parse(localStorage.homeworkInfos).data[0].id);
    // localStorage.homeworkInfos = JSON.stringify({
    //     "data": [{
    //         "id": "022765ae376a4feab2ce64777050474f",
    //         "knowledgePoint": "知识点1,知识点2",
    //         "description": "这是测试数据",
    //         "fileContents": [{
    //             "diskFilePath": "homework/b479a873299649a48d9741582a735450.jpg",
    //             "fileName": "文件1",
    //             "fileSize": "12345",
    //             "fileType": "jpg",
    //             "id": "c572b982b22149a5ab2e5d98650a3e3c",
    //             "uploadTime": 1499773427000
    //         }, {
    //             "diskFilePath": "homework/b479a873299649a48d9741582a735450.jpg",
    //             "fileName": "文件1",
    //             "fileSize": "23564",
    //             "fileType": "MP3",
    //             "id": "c84c4da06da9470283588366812f7d01",
    //             "uploadTime": 1499773427000
    //         }]
    //     }, {
    //         "id": "022765ae376a4feab2ce64777050474f",
    //         "knowledgePoint": "知识点1,知识点2",
    //         "description": "如图，test点E为正方形ABCD的边CD上的一点，点F为CB的延长线上的一点，且EA垂直AF,求证：DE=BF.",
    //         "fileContents": [{
    //             "diskFilePath": "homework/b479a873299649a48d9741582a735450.jpg",
    //             "fileName": "文件1",
    //             "fileSize": "12345",
    //             "fileType": "jpg",
    //             "id": "c572b982b22149a5ab2e5d98650a3e3c",
    //             "uploadTime": 1499773427000
    //         }, {
    //             "diskFilePath": "homework/b479a873299649a48d9741582a735450.jpg",
    //             "fileName": "文件1",
    //             "fileSize": "23564",
    //             "fileType": "MP3",
    //             "id": "c84c4da06da9470283588366812f7d01",
    //             "uploadTime": 1499773427000
    //         }]
    //     }]
    // });
    var hwInfos = JSON.parse(localStorage.homeworkInfos).data;
    gethwInfos();
    function gethwInfos() {
        var knowledgePoint, kpHtml;
        $.each(hwInfos, function (i, item) {
            if (item.id == GetRequest('id')) {
                //知识点
                if (item.knowledgePoint != "" && item.knowledgePoint != null && item.knowledgePoint != undefined) {
                    knowledgePoint = item.knowledgePoint.split(',');
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
                    var localId = res.localId;
                    alert(localId);
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
                    fileName = e.data.fileName;
                    fileSize = e.data.fileSize;
                    fileType = e.data.fileType;
                    diskFilePath = e.data.diskFilePath;
                    fileParams[0] = {
                        "homeworkSinfoId": homeworkSinfoId,
                        "fileName": fileName,
                        "fileType": fileType,
                        "fileSize": fileSize,
                        "diskFilePath": diskFilePath,
                        "uploadUser": uploadUser
                    };
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
        // url = "http://www.w3school.com.cn/i/song.mp3";

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
                        str += "<div><span class='stuImg'></span><img src='" + res.localIds[i] + "'/></div>";

                        alert(res.localIds[i]);
                    }

                    $(".notsubmit .imgBox").show();
                    $(".notsubmit .imgBox").html(str);
                    //上传服务器
                    upLoadWxImage(res);
                    //界面样式控制
                    if (res.localIds.length >= 3) {
                        $('#chooseImage').hide();
                    }
                }


            }
        });
    });

    // var serverIds = [];
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
                    alert('已上传：' + i + '/' + length);
                    // serverIds.push(res.serverId);
                    $('.teBox').val(res.serverId + "$" + images.localIds[i - 1]);
                    uploadImage(res.serverId);
                    if (i < length) {
                        upload();
                    }
                },
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });
        }

        upload();
    }

    /**
     * 图片上传到自己服务器
     */
    function uploadImage() {
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
            success: function (data) {
                alert(JSON.stringify(data));
                if (e.status == "failure") {
                    alert(e.message);
                } else {
                    fileName = data.fileName;
                    fileSize = data.fileSize;
                    fileType = data.fileType;
                    diskFilePath = data.diskFilePath;
                    fileParams[fileParams.length + i] = {
                        "homeworkSinfoId": homeworkSinfoId,
                        "fileName": fileName,
                        "fileType": fileType,
                        "fileSize": fileSize,
                        "diskFilePath": diskFilePath,
                        "uploadUser": uploadUser
                    };
                }


            }
        });

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
        str += "<div><img src='" + previewUrl + "'/></div>";
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
    //作业描述验证
    $('.teBox').on('keyup',function(){
        if($(this).val().length>200){
            $('.word').css('color','red');
        }else{
            $('.word').css('color','#808080');
        }
        $('.word').html(''+$(this).val().length+'/200')
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
        var reqData = {
            "id": GetRequest('id'),
            "description": $('.teBox').val(),
            "fileStuhomeworks": fileParams
        };
        ajaxRequest('POST', homework_s.s_hwcommit, JSON.stringify(reqData), hwCommitSuccess);
    }

//提交作业--成功--确定,提交作业--失败--取消
    $(document).on('touchend', '.confirmBtn,.cancelBtn', function () {
        layer.close(layer2);
    });
//提交作业--失败--重试
    $(document).on('touchend', '.retryBtn', function () {
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

// 提交作业接口返回处理
    function hwCommitSuccess(msg) {
        console.log("提交成功：" + JSON.stringify(msg));
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
    }
})
;

