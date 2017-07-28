$(function () {
    var layer1, layer2, loading;
    var need = {
        'stuHomeworkId': sessionStorage.stuid,
        'homeworkTinfoId': sessionStorage.Tid
    };
    $('.anDes').eq(0).html(sessionStorage.stutext);
    $('.kon p:last-of-type').html(sessionStorage.knowledgePoint);
    $('.hwCon').eq(0).html(sessionStorage.description);

    $('.hwTeacherRankTitle').on('touchend', function () {
        if ($('.hwInfo').css('display') == 'none') {
            $('.hwInfo').show();
            $('.hwRankTitle').css('margin-bottom', '0');
            $('.hwRankTitle').css('border-bottom', '1px solid #ccc');
            $('.hwRankTitle').css('background-image', 'url(../homework/images/jiao11.png)');

        } else {
            $('.hwInfo').hide();
            $('.hwRankTitle').css('margin-bottom', '18px');
            $('.hwRankTitle').css('border-bottom', 'none');
            $('.hwRankTitle').css('background-image', 'url(../homework/images/jiao22222.png)');
        }

    })


    //输入验证
    $('.teBox').on('keyup', function () {
        $('.teacherword').html('' + $(this).val().length + '/200')
        if ($(this).val().length > 199) {
            $('.teacherword').css('color', 'red');
            $(this).val($(this).val().substring(0, 200));
        } else {
            $('.teacherword').css('color', '#808080');
        }
    });
    $('.teBox').on('blur', function () {
        $('.teacherword').html('' + $(this).val().length + '/200')
    });

    //优秀作业

    $('.infoTitle span').on('touchend', function () {
        if ($(this).css('color') == 'rgb(255, 106, 106)') {
            $(this).css({
                'color': '#fff',
                'background': '#ff6a6a'
            });
            $('.excellent').show();
            $('.excellent').append('<img src="images/excellent.gif" alt="">');
            setTimeout(function () {
                $('.excellent').html('  ');
                $('.excellent').hide();
            }, 1000)
        } else {
            $('.excellent').hide();
            $(this).css({
                'color': '#ff6a6a',
                'border': '1px solid #ff6a6a',
                'background': 'none'
            });
        }
    });

    if (sessionStorage.Teatwo) {//已批复
        sessionStorage.removeItem('Teatwo');
        $('title').html('已批复');
        var arr_text = sessionStorage.T_text.split('|>|');
        if(sessionStorage.bangbang){
            $('.hmAnswer .infoTitle span').css({
                'color': '#fff',
                'background': '#ff6a6a'
            });
        }
        for(var p = 0;p<arr_text.length;p++){
            if(arr_text[p]!=''){
                $('.tea_sp').append('<div class="hmAnswer"><div class="infoTitle">老师批复 </div><div class="anDes">'+arr_text[p]+'</div><div><ul class="voiceBox" id="audio_3"></ul><div class="imgBox"></div></div></div>');

            }
        }
        // $('.anDes').eq(1).html(sessionStorage.T_text);
        //获取文件信息
        ajaxRequest('post', homework_s.t_two, {Tcid: sessionStorage.Tid, Sdtid: sessionStorage.stuid},getHwFilesSucess);

    } else {//待批复
        $('.hmAnswer').eq(1).hide();
        //获取文件信息
        ajaxRequest('post', homework_s.t_modi, {Tcid: sessionStorage.Tid, Sdtid: sessionStorage.stuid}, function (e) {
            console.log(e);
            var stu = e.data.StudentHomeworkFile;
            var tea = e.data.TeacherHomeworkFile;

            for (var a = 0; a < stu.length; a++) {
                if (stu[a].fileType == 'mp3') {
                    getAudioInfo([2, stu[a].diskFilePath, "mp3"]);
                } else {
                    var onlineUrl = 'dt.xdf.cn';
                    if (window.location.host == onlineUrl) {//正式环境
                        $('.imgBox').eq(1).append('<div><img src="http://dt.xdf.cn/xdfdtmanager/' + stu[a].url + '" alt="" /></div>')
                    } else {//测试环境
                        $('.imgBox').eq(1).append('<div><img src="http://dt.staff.xdf.cn/xdfdtmanager/' + stu[a].url + '" alt="" /></div>')
                    }
                    // $('.imgBox').eq(1).append('<div><img src="' + stu[a].url + '" alt="" /></div>')
                    // $('.imgBox').eq(1).append('<div><img src="http://dt.staff.xdf.cn/xdfdtmanager/homework/koala.jpg" /></div>')
                    // $('.')
                }
            }
            for (var b = 0; b < tea.length; b++) {
                if (tea[b].fileType == 'mp3') {
                    getAudioInfo([1, tea[b].diskFilePath, "mp3"]);
                } else {
                    $('.imgBox').eq(0).append('<div><img src="' + tea[b].url + '" alt="" /></div>')

                }
            }
        });
    }
    var voiceCount = 0;

    /**
     * 获取语音信息
     * flag: 区分是 老师作业信息部分的语音，还是学生答案语音，还是老师批复语音 ，方式ID重复（播放语音需要ID）
     * diskFileUrl: 语音地址
     * hwFlag:hwFlag[0]作业标识，区分老师批复还是其他 replayT（老师批复）,hwFlag[1] 老师批复次数，0开始
     */
    function getAudioInfo(fileArray,hwFlag) {
        var flag = fileArray[0];
        var diskFileUrl = fileArray[1];
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
                    if(hwFlag[0]=='replayT'){//老师批复
                        //将文件显示到布局中
                        voiceCount++;
                        replayTShowAudio(e.data.playTime, url_o + e.data.fullPath, hwFlag[1] + "_" + voiceCount,hwFlag[1]);
                    }else{
                        //将文件显示到布局中
                        voiceCount++;
                        showAudio(e.data.playTime, url_o + e.data.fullPath, $("#audio_" + flag), "audio" + flag + "" + voiceCount, 2);
                    }
                }
            }
        });
    }

    /**
     * 显示语音布局
     * @param playTime  语音播放时长
     * @param url 语音播放地址
     * @param parentId  语音布局需要添加到的父节点
     * @param id  语音控件id，播放时需要
     * @param flag 1：表示语音布局可以删除；2：表示不可以删除
     */
    function showAudio(playTime,url, parentId, id, flag) {

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

            idChildren = "audio_" + id;
            strVoice += "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto'><source src='" + url + "' type='audio/mpeg'></audio>" +
                "<i class='play-icon'></i></div><span class='voice_lenth'>" + length + "</span></li>";
        }


        parentId.append(strVoice);

        var audioElem = document.getElementById(idChildren);
        audioElem.onloadedmetadata = getVoiceLen;
        getVoiceLen(playTime,idChildren);


        $('.song_s,.mask').hide();
        // 语音大于三张，隐藏添加语音按钮
        if ($('.notsubmit #record_audio_box li').length >= 3) {
            $('#record').hide();
        }
    }
    /**
     * 显示语音布局
     * @param playTime  语音播放时长
     * @param url 语音播放地址
     * @param id  语音控件id，播放时需要
     * @param domIndex 老师批复次数 显示布局用
     */
    function replayTShowAudio(playTime,url, id,domIndex) {
        console.log(id+"---"+domIndex);
        var strVoice = "";
        var idChildren;
        var length = "";
        idChildren = "audio_" + id;
        strVoice = "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto'><source src='" + url + "' type='audio/mpeg'></audio>" +
            "<i class='play-icon'></i></div><span class='voice_lenth'>" + length + "</span></li>";
        $('.tea_sp .hmAnswer:eq('+domIndex+')').find('.voiceBox').append(strVoice);
        var audioElem = document.getElementById(idChildren);
        audioElem.onloadedmetadata = getVoiceLen;
        getVoiceLen(playTime,idChildren);
        $('.song_s,.mask').hide();
    }

    function getVoiceLen(playTime,idChildren) {
        var len = parseInt(playTime);
        var voiceLen = "";
        var hh = parseInt(len / 3600);
        var mm = parseInt((len % 3600) / 60);
        var ss = parseInt((len % 3600) % 60);
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

        $('#' + idChildren).parent('div').siblings('.voice_lenth').html(voiceLen);
    }
    //提交确认
    $('.sub_p').on('touchend',function(){
        $('.areyok').show();
    });
    $('.areyok input:first-of-type').on('touchend',function(){
        $(".areyok").hide()
    });

    //批改作业提交
    $('.areyok input:last-of-type').on('touchend', function () {
        $(".areyok").hide();
        var arr_s = [];
        if ($(this).css('background') == 'rgb(204, 204, 204) none repeat scroll 0% 0% / auto padding-box border-box') {
            layer.msg('正在提交，请稍等');
            return false;
        }
        if ($('.teBox').val() == '' && $('.notsubmit li').length == 0 && $('#record_audio_box li').length == 0) {
            layer.msg('批复不能为空');
            return false;
        }
        if ($('.teBox').html() == '') {
            need.replyDesc = '';
        } else {
            need.replyDesc = $('.teBox').html();
        }
        if ($('.infoTitle span').css('color') == 'rgb(255, 106, 106)') {0
            need.tag = '0'
        } else {
            need.tag = '1'
        }
        arr_s = arr_voice.concat(arr_image);
        need.fileInfo = arr_s;



        for(var x = 0;x<$('.anDes').length;x++){
            if(x!=0&&$('.anDes').eq(x).html()!=''){
                need.replyDesc+=encodeURI($('.anDes').eq(x).html()+'|>|')
            }
        }


        need.replyDesc += encodeURI($('.answer textarea').val());
        ajax_S(homework_s.t_succ, need, function (e) {
            if (e.result == true) {
                $('.big_back').show();
                $('.succ').show();
                $('.Submit_s').css('background', '#00ba97');
            } else {
                $('.erro p').html(e.message);
                $('.big_back').show();
                $('.erro').show();
            }
        })


    });
    //状态点击
    $('.succ input').on('touchend', function () {
        $('.big_back').hide();
        $('.succ').hide();
        location.href = 'reply_t.html';
    });

    $('.erro input:first-of-type').on('touchend', function () {
        $('.big_back').hide();
        $('.erro').hide();
    });

    $('.erro input:last-of-type').on('touchend', function () {
        $('.big_back').hide();
        $('.erro').hide();
        ajax_S(homework_s.t_succ, need, function (e) {
            if (e.result == true) {
                $('.big_back').show();
                $('.succ').show();
                $('.Submit_s').css('background', '#00ba97');
            } else {
                $('.erro p').html(e.message);
                $('.big_back').show();
                $('.erro').show();
            }
        })
    });

    $('.big_whit').on('touchend', function () {
        setTimeout(function () {
            $('.big_whit').hide();
        }, 300);
        $('.song_s').hide();
    });

    $('.big_back').on('touchstart', function () {
        if ($('.class_name').css('display') == 'block') {
            $('.class_name').animate({'bottom': '-438px'});
            setTimeout(function () {
                $('.big_back').hide();
            }, 300);
            $('.class_name i').html('0');
            $('.class_name img').attr('src', 'images/C05_06.png');
            if ($('.class_name i').html() == '0') {
                $('.class_s i').html('')
            }
        }
        if ($('.succ').css('display') == 'block') {
            setTimeout(function () {
                $('.big_back').hide();
            }, 300);
            $('.succ').hide();
        }
        if ($('.erro').css('display') == 'block') {
            setTimeout(function () {
                $('.big_back').hide();
            }, 300);
            $('.erro').hide();
        }
    });

    //语音
    $('.Voice').on('touchend', function () {
        $('.big_whit').show();
        $('.song_s').show();
    });

    //按下开始录音
    var timeInedex = 0;
    var Index_s = -1;
    var timeds;
    $('#record').on('touchstart', function (event) {
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
    var song_s = '';
    //松手结束录音
    $('#record').on('touchend', function (event) {
        $(this).siblings('img').attr('src', 'images/C04-03.png');
        event.preventDefault();
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

    //上传微信服务器，获取保存的serverId
    function uploadVoiceWX(upId) {
        //调用微信的上传录音接口把本地录音先上传到微信的服务器
        //不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
        wx.uploadVoice({
            localId: upId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                serverId = res.serverId;
                uploadVoice(serverId);
            }
        });
    }

    var arr_s = [];
    var arr_voice = [];
    var arr_image = [];
    //将serverId上传到自己服务器
    function uploadVoice(serverId) {
        var cbconfig = {
            'appId': appId,
            'appSecret': secreT,
            'mediaId': serverId,
            'schoolId': localStorage.schoolId,
            'classId': sessionStorage.classCode_s
        };
        $.ajax({
            url: url_o + "upload/uploadAudio.do",
            type: 'post',
            dataType: 'json',
            data: cbconfig,
            success: function (e) {
                if (e.status == "failure") {
                    alert(e.message);
                } else {
                    arr_voice.push({
                        'fileName': e.data.fileName,
                        'fileType': e.data.fileType,
                        'fileSize': e.data.fileSize,
                        'diskFilePath': e.data.diskFilePath
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


            }
        });
    }

    var recordCount = 0;

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

    var imgCount = 0;
    //图片上传
    $('.image_s').click(function () {
        imgCount = $('.notsubmit .imgBox li').length;
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
            'schoolId': localStorage.schoolId,
            'classId': sessionStorage.classCode_s
        };
        $.ajax({
            url: url_o + "upload/uploadFileByWeiChat.do",
            type: 'post',
            dataType: 'json',
            data: cbconfig,
            success: function (e) {
                if (e.status == "failure") {
                    // alert(e.msg);
                    layer.msg('图片上传失败');

                } else if (e.status == "succeed") {
                    showUpdataImage(localID);
                    arr_image.push({
                        'fileName': e.data.fileName,
                        'fileType': e.data.fileType,
                        'fileSize': e.data.fileSize,
                        'diskFilePath': e.data.diskFilePath
                    });


                }


            }
        });

    }

    function showUpdataImage(url) {

        var str = "<li><span class='stuImg' img-index='" + imgCount + "'></span><img src='" + url + "'/></li>";

        $(".notsubmit .imgBox").show();
        $(".notsubmit .imgBox").append(str);
        //界面样式控制
        if ($('.notsubmit .imgBox li').length >= 3) {
            $('.image_s').hide();
        }

    }

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

        $('.imgBox li:eq(' + index + ')').remove();
        // 图片小于三张，显示添加图片按钮
        if ($('.notsubmit .imgBox').children('div').length < 3) {
            $('.image_s').show();
        }
        if (arr_image.length > 0) {
            arr_image.splice(index, 1);
        }
    });
    var Index_Last;

    $(document).on('touchend','.hwInfo img',function(){
        var previewUrl = $(this).attr('src');
        wx.previewImage({
            current: previewUrl, // 当前显示图片的http链接
            urls: [previewUrl] // 需要预览的图片http链接列表
        });
    });
    $(document).on('touchend','.tea_sp img',function(){
        var previewUrl = $(this).attr('src');
        wx.previewImage({
            current: previewUrl, // 当前显示图片的http链接
            urls: [previewUrl] // 需要预览的图片http链接列表
        });
    });
    /*--------------------图片预览----------------------------------*/
    $(document).on('touchend', '.hmAnswer .imgBox img', function () {
        Index_Last = $(this).parent().index();
        var previewUrl = $(this).attr('src');
        $('.big_back_s canvas').hide();
        $('.big_back_s').show();
        $('.big_back_s img').attr('src', previewUrl);
        setTimeout(function () {
            $('.big_back_s img').css({
                'margin-top': -parseInt($('.big_back_s img').css('height')) / 2,
                'margin-left': -parseInt($('.big_back_s img').css('width')) / 2
            });
            $('.big_back_s canvas').css({
                'margin-top': -parseInt($('.big_back_s img').css('height')) / 2,
                'margin-left': -parseInt($('.big_back_s img').css('width')) / 2
            });
        }, 300)

    });
    $('.big_back_s').on('touchend', function () {
        if($('.true_s').css('display')!='block'){
            $(this).find('canvas').hide();
            $(this).find('img').show();
            $(this).find('.esc_s').hide();
            $(this).find('.true_s').hide();
            $(this).find('span:last-of-type').show();
            $(this).hide();
            $('body').css('overflow', 'auto');
            $('body').css('overflow-x', 'hidden')
        }
    });
    $('.esc_s').on('touchend', function () {
        $('.big_back_s').hide();
        $('.big_back_s canvas').hide();
        $('.big_back_s img').show();
        $('.big_back_s .esc_s').hide();
        $('.big_back_s .true_s').hide();
        $('.big_back_s span:last-of-type').show();
        $('.big_back_s').hide();
        $('body').css('overflow-y', 'auto')
    });
    $('.big_back_s span:last-of-type').on('touchend', function () {
        $(this).hide();
        $('.true_s').show();
        $('body').css('overflow', 'hidden');
        $('.esc_s').show();
        var previewUrl = $('.big_back_s img').attr('src');
        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = previewUrl;
        var canvas = document.getElementById("myCanvas");
        var width_ = parseInt($('.big_back_s img').css('width'));
        var height = parseInt($('.big_back_s img').css('height'));
        canvas.width = width_;
        canvas.height = height;

        var ctx = canvas.getContext("2d");
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';

        img.onload = function () {
            ctx.drawImage(img, 0, 0, width_, height);
        };
        $('.big_back_s img').hide();
        $('.big_back_s canvas').show();

        // canvas事件
        $(document).on('touchstart', '#myCanvas', function () {
            ctx.beginPath();
            ctx.moveTo(event.touches[0].pageX - canvas.offsetLeft, event.touches[0].pageY - canvas.offsetTop);
            $(document).on('touchmove', '#myCanvas', function () {
                var ev = ev || event;
                ctx.lineTo(event.touches[0].pageX - canvas.offsetLeft, event.touches[0].pageY - canvas.offsetTop + 15);
                ctx.stroke();
            });
            $(document).on('touchend', '#myCanvas', function () {
                ctx.closePath();
                $('.big_back_s').show();
                $('#myCanvas').unbind('touchenstart');
                $('#myCanvas').unbind('touchmove');
                $('#myCanvas').unbind('touchend');
            });
            // upLoadWxImage(canvas.toDataURL("image/png"));

        });

        $('.true_s').on('touchend', function () {
            var b = new Base64();
            var str = b.encode(canvas.toDataURL("image/png"));
            //上传文件到服务器
            var reqData = {
                'base64Str': str,
                'schoolId': localStorage.schoolId,
                'classId': sessionStorage.classCode_s
            };
            // console.log(reqData);
            ajaxRequest('POST', homework_s.s_uploadFiles, JSON.stringify(reqData), uploadFilesSuccess);

            $('.notsubmit .imgBox').show();
            $('.notsubmit .imgBox').append("<li><span class='stuImg' img-index='" + Index_Last + "'></span><img src='" + canvas.toDataURL("image/png") + "'/></li>");
            $('.big_back_s canvas').hide();
            $('.big_back_s img').show();
            $('.big_back_s .esc_s').hide();
            $('.big_back_s .true_s').hide();
            $('.big_back_s span:last-of-type').show();
            $('.big_back_s').hide();
            $('body').css('overflow-y', 'auto');
            $('.true_s').unbind('touchend');
        });
        return false;
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
        if (arr_voice.length > 0) {
            arr_voice.splice(index, 1);
            recordCount--;
        }


    });

//    上传文件到服务器
    function uploadFilesSuccess(msg) {
        if (msg.data.success) {
            console.log("文件上传成功！");
            arr_image.push({
                'fileName': msg.data.fileName,
                'fileType': msg.data.fileType,
                'fileSize': msg.data.fileSize,
                'diskFilePath': msg.data.diskFilePath
            });
            // console.log("ok:"+JSON.stringify(arr_image));
        } else {
            console.log("文件上传失败！");
        }
    }

//    获取作业文件信息（图片/语音）
    function getHwFilesSucess (e) {
        var e = {
            "code": "200",
            "data": {
                "StudentHomeworkFile": [
                    {
                        "diskFilePath": "homework/73/HDXU1EB03/2017-07-26/818SCKuMTAVeq6h_QGAuqk3NeZ-UYiujl2s-yBatmG1llLECBVaG_gFMam--gT9h.jpg",
                        "fileName": "818SCKuMTAVeq6h_QGAuqk3NeZ-UYiujl2s-yBatmG1llLECBVaG_gFMam--gT9h.jpg",
                        "fileSize": "113831",
                        "fileType": "jpg",
                        "homeworkSinfoId": "1000e1cc32ca4b6b878fe3e9b04e411d",
                        "id": "f9fccfc7265e46fabea5eb6ac1cf4829",
                        "previewUrl": "http://yk3.gokuai.com/app/gk_gallery2?mount_id=1308158&fullpath=homework%2F73%2FHDXU1EB03%2F2017-07-26%2F818SCKuMTAVeq6h_QGAuqk3NeZ-UYiujl2s-yBatmG1llLECBVaG_gFMam--gT9h.jpg&member_id=0&filename=818SCKuMTAVeq6h_QGAuqk3NeZ-UYiujl2s-yBatmG1llLECBVaG_gFMam--gT9h.jpg&hash=a977d94db035f4f19851cf927c67fc86222820de&filehash=199c830ffacf6b73e4f9dca96400be8d2c55f45e&filesize=113831&file=http%3A%2F%2Fyk3.gokuai.com%2Findex%2Fthumb%3Fmount_id%3D1308158%26type%3Djpg%26hash%3Da977d94db035f4f19851cf927c67fc86222820de%26filehash%3D199c830ffacf6b73e4f9dca96400be8d2c55f45e%26big%3D1&expires=1501150475&signature=4peP%2FHt91x4niNQpCCKcWnhKq9Y%3D&app_id=0&storage_point=",
                        "thumbnail": "http://yk3.gokuai.com/index/thumb?mount_id=1308158&type=jpg&hash=a977d94db035f4f19851cf927c67fc86222820de&filehash=199c830ffacf6b73e4f9dca96400be8d2c55f45e",
                        "time": "2017-07-26 20:10:45",
                        "uploadTime": 1501071078000,
                        "uploadUser": "赵誉童",
                        "url": "homework/73/HDXU1EB03/2017-07-26/818SCKuMTAVeq6h_QGAuqk3NeZ-UYiujl2s-yBatmG1llLECBVaG_gFMam--gT9h.jpg"
                    },
                    {
                        "diskFilePath": "homework/73/HDXU1EB03/2017-07-26/5ffAGoQV4ypQ7qdpDO4cfLPinVQVHbKVX49Pa-gq0Gkzsa3XfltKGwZ5QUzvY7Uu.jpg",
                        "fileName": "5ffAGoQV4ypQ7qdpDO4cfLPinVQVHbKVX49Pa-gq0Gkzsa3XfltKGwZ5QUzvY7Uu.jpg",
                        "fileSize": "44392",
                        "fileType": "jpg",
                        "homeworkSinfoId": "1000e1cc32ca4b6b878fe3e9b04e411d",
                        "id": "48e5527433c04e5ea87b863cf0214cdf",
                        "previewUrl": "http://yk3.gokuai.com/app/gk_gallery2?mount_id=1308158&fullpath=homework%2F73%2FHDXU1EB03%2F2017-07-26%2F5ffAGoQV4ypQ7qdpDO4cfLPinVQVHbKVX49Pa-gq0Gkzsa3XfltKGwZ5QUzvY7Uu.jpg&member_id=0&filename=5ffAGoQV4ypQ7qdpDO4cfLPinVQVHbKVX49Pa-gq0Gkzsa3XfltKGwZ5QUzvY7Uu.jpg&hash=681532dbe2f9eaabbaddddbb97dc080b7900f979&filehash=66b38fe797b71d7a15227f85de309098fcae9650&filesize=44392&file=http%3A%2F%2Fyk3.gokuai.com%2Findex%2Fthumb%3Fmount_id%3D1308158%26type%3Djpg%26hash%3D681532dbe2f9eaabbaddddbb97dc080b7900f979%26filehash%3D66b38fe797b71d7a15227f85de309098fcae9650%26big%3D1&expires=1501150474&signature=zzb%2F%2F0KWE8NBnBsh5BMxOmec%2BBw%3D&app_id=0&storage_point=",
                        "thumbnail": "http://yk3.gokuai.com/index/thumb?mount_id=1308158&type=jpg&hash=681532dbe2f9eaabbaddddbb97dc080b7900f979&filehash=66b38fe797b71d7a15227f85de309098fcae9650",
                        "time": "2017-07-26 20:10:58",
                        "uploadTime": 1501071078000,
                        "uploadUser": "赵誉童",
                        "url": "homework/73/HDXU1EB03/2017-07-26/5ffAGoQV4ypQ7qdpDO4cfLPinVQVHbKVX49Pa-gq0Gkzsa3XfltKGwZ5QUzvY7Uu.jpg"
                    },
                    {
                        "diskFilePath": "homework/73/HDXU1EB03/2017-07-26/97a55dfbac0c486e895e45e25deab14c.mp3",
                        "fileName": "97a55dfbac0c486e895e45e25deab14c.mp3",
                        "fileSize": "9549",
                        "fileType": "mp3",
                        "homeworkSinfoId": "1000e1cc32ca4b6b878fe3e9b04e411d",
                        "id": "de03a6261ba8429da1c3b3899e746319",
                        "previewUrl": "http://yk3.gokuai.com/app/unpreview?err_msg=%E8%AF%A5%E6%96%87%E4%BB%B6%E4%B8%8D%E6%94%AF%E6%8C%81%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88&mount_id=1308158&fullpath=homework%2F73%2FHDXU1EB03%2F2017-07-26%2F97a55dfbac0c486e895e45e25deab14c.mp3&app_id=0",
                        "thumbnail": "http://yk3.gokuai.com/index/thumb?mount_id=1308158&type=mp3&hash=5ab88bc85989e4ace968da8db9b910da37f11020&filehash=69fe2348141c10539e52a0cc486979e103c1d558",
                        "time": "2017-07-26 20:11:13",
                        "uploadTime": 1501071078000,
                        "uploadUser": "赵誉童",
                        "url": "homework/73/HDXU1EB03/2017-07-26/97a55dfbac0c486e895e45e25deab14c.mp3"
                    },
                    {
                        "diskFilePath": "homework/73/HDXU1EB03/2017-07-26/6d8ebdbedba6470297de85a1d69312a5.mp3",
                        "fileName": "6d8ebdbedba6470297de85a1d69312a5.mp3",
                        "fileSize": "1053",
                        "fileType": "mp3",
                        "homeworkSinfoId": "1000e1cc32ca4b6b878fe3e9b04e411d",
                        "id": "cfcec7dee8154744a0c590bbe072d85c",
                        "previewUrl": "http://yk3.gokuai.com/app/unpreview?err_msg=%E8%AF%A5%E6%96%87%E4%BB%B6%E4%B8%8D%E6%94%AF%E6%8C%81%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88&mount_id=1308158&fullpath=homework%2F73%2FHDXU1EB03%2F2017-07-26%2F6d8ebdbedba6470297de85a1d69312a5.mp3&app_id=0",
                        "thumbnail": "http://yk3.gokuai.com/index/thumb?mount_id=1308158&type=mp3&hash=e0dc2c18ff99c502697896377d5e0eb002d61600&filehash=5c8f5f4e174933b4cbf2eb19079d1769b52f4447",
                        "time": "2017-07-26 20:11:48",
                        "uploadTime": 1501071117000,
                        "uploadUser": "赵誉童",
                        "url": "homework/73/HDXU1EB03/2017-07-26/6d8ebdbedba6470297de85a1d69312a5.mp3"
                    }
                ],
                "RevampFile": [
                    [
                        {
                            "diskFilePath": "homework/73/HDXU1EB03/2017-07-26/183546ed530949dc98a226816273269c.png",
                            "fileName": "183546ed530949dc98a226816273269c.png",
                            "fileSize": "590575",
                            "fileType": "png",
                            "homeworkSinfoId": "1000e1cc32ca4b6b878fe3e9b04e411d",
                            "id": "039ec87e807f4481a10982f4d066b55b",
                            "previewUrl": "http://yk3.gokuai.com/app/gk_gallery2?mount_id=1308158&fullpath=homework%2F73%2FHDXU1EB03%2F2017-07-26%2F183546ed530949dc98a226816273269c.png&member_id=0&filename=183546ed530949dc98a226816273269c.png&hash=23b146f8a368715c0b0c9c53477e90c19aa1d557&filehash=6f09a35776df3e70e4483ccd9f07d874e9112a7c&filesize=590575&file=http%3A%2F%2Fyk3.gokuai.com%2Findex%2Fthumb%3Fmount_id%3D1308158%26type%3Dpng%26hash%3D23b146f8a368715c0b0c9c53477e90c19aa1d557%26filehash%3D6f09a35776df3e70e4483ccd9f07d874e9112a7c%26big%3D1&expires=1501150476&signature=Zs%2B%2Fg3nQpZBVWQQGaDEmRXwj1bE%3D&app_id=0&storage_point=",
                            "thumbnail": "http://yk3.gokuai.com/index/thumb?mount_id=1308158&type=png&hash=23b146f8a368715c0b0c9c53477e90c19aa1d557&filehash=6f09a35776df3e70e4483ccd9f07d874e9112a7c",
                            "time": "2017-07-26 20:17:29",
                            "uploadTime": 1501071462000,
                            "url": "http://dn-storage-xdf.gokuai.com/6f/6f09a35776df3e70e4483ccd9f07d874e9112a7c.dat?response-content-disposition=attachment%3B%20filename%3D%22183546ed530949dc98a226816273269c.png%22%3B%20filename%2A%3Dutf-8%27%27183546ed530949dc98a226816273269c.png&response-content-type=application%2Foctet-stream&OSSAccessKeyId=xAme5tplBBYJXFYm&Expires=1501150476&Signature=d6dYY7r%2F0EuJNt1rmKllumMfxdQ%3D"
                        },
                        {
                            "diskFilePath": "homework/73/HDXU1EB03/2017-07-26/183546ed530949dc98a226816273269c.png",
                            "fileName": "183546ed530949dc98a226816273269c.png",
                            "fileSize": "590575",
                            "fileType": "png",
                            "homeworkSinfoId": "1000e1cc32ca4b6b878fe3e9b04e411d",
                            "id": "039ec87e807f4481a10982f4d066b55b",
                            "previewUrl": "http://yk3.gokuai.com/app/gk_gallery2?mount_id=1308158&fullpath=homework%2F73%2FHDXU1EB03%2F2017-07-26%2F183546ed530949dc98a226816273269c.png&member_id=0&filename=183546ed530949dc98a226816273269c.png&hash=23b146f8a368715c0b0c9c53477e90c19aa1d557&filehash=6f09a35776df3e70e4483ccd9f07d874e9112a7c&filesize=590575&file=http%3A%2F%2Fyk3.gokuai.com%2Findex%2Fthumb%3Fmount_id%3D1308158%26type%3Dpng%26hash%3D23b146f8a368715c0b0c9c53477e90c19aa1d557%26filehash%3D6f09a35776df3e70e4483ccd9f07d874e9112a7c%26big%3D1&expires=1501150476&signature=Zs%2B%2Fg3nQpZBVWQQGaDEmRXwj1bE%3D&app_id=0&storage_point=",
                            "thumbnail": "http://yk3.gokuai.com/index/thumb?mount_id=1308158&type=png&hash=23b146f8a368715c0b0c9c53477e90c19aa1d557&filehash=6f09a35776df3e70e4483ccd9f07d874e9112a7c",
                            "time": "2017-07-26 20:17:29",
                            "uploadTime": 1501071462000,
                            "url": "http://dn-storage-xdf.gokuai.com/6f/6f09a35776df3e70e4483ccd9f07d874e9112a7c.dat?response-content-disposition=attachment%3B%20filename%3D%22183546ed530949dc98a226816273269c.png%22%3B%20filename%2A%3Dutf-8%27%27183546ed530949dc98a226816273269c.png&response-content-type=application%2Foctet-stream&OSSAccessKeyId=xAme5tplBBYJXFYm&Expires=1501150476&Signature=d6dYY7r%2F0EuJNt1rmKllumMfxdQ%3D"
                        },
                        {
                            "diskFilePath": "homework/73/HDXU1EB03/2017-07-26/183546ed530949dc98a226816273269c.png",
                            "fileName": "183546ed530949dc98a226816273269c.png",
                            "fileSize": "590575",
                            "fileType": "mp3",
                            "homeworkSinfoId": "1000e1cc32ca4b6b878fe3e9b04e411d",
                            "id": "039ec87e807f4481a10982f4d066b55b",
                            "previewUrl": "http://yk3.gokuai.com/app/gk_gallery2?mount_id=1308158&fullpath=homework%2F73%2FHDXU1EB03%2F2017-07-26%2F183546ed530949dc98a226816273269c.png&member_id=0&filename=183546ed530949dc98a226816273269c.png&hash=23b146f8a368715c0b0c9c53477e90c19aa1d557&filehash=6f09a35776df3e70e4483ccd9f07d874e9112a7c&filesize=590575&file=http%3A%2F%2Fyk3.gokuai.com%2Findex%2Fthumb%3Fmount_id%3D1308158%26type%3Dpng%26hash%3D23b146f8a368715c0b0c9c53477e90c19aa1d557%26filehash%3D6f09a35776df3e70e4483ccd9f07d874e9112a7c%26big%3D1&expires=1501150476&signature=Zs%2B%2Fg3nQpZBVWQQGaDEmRXwj1bE%3D&app_id=0&storage_point=",
                            "thumbnail": "http://yk3.gokuai.com/index/thumb?mount_id=1308158&type=png&hash=23b146f8a368715c0b0c9c53477e90c19aa1d557&filehash=6f09a35776df3e70e4483ccd9f07d874e9112a7c",
                            "time": "2017-07-26 20:17:29",
                            "uploadTime": 1501071462000,
                            "url": "http://dn-storage-xdf.gokuai.com/6f/6f09a35776df3e70e4483ccd9f07d874e9112a7c.dat?response-content-disposition=attachment%3B%20filename%3D%22183546ed530949dc98a226816273269c.png%22%3B%20filename%2A%3Dutf-8%27%27183546ed530949dc98a226816273269c.png&response-content-type=application%2Foctet-stream&OSSAccessKeyId=xAme5tplBBYJXFYm&Expires=1501150476&Signature=d6dYY7r%2F0EuJNt1rmKllumMfxdQ%3D"
                        },
                        {
                            "diskFilePath": "homework/73/HDXU1EB03/2017-07-26/183546ed530949dc98a226816273269c.png",
                            "fileName": "183546ed530949dc98a226816273269c.png",
                            "fileSize": "590575",
                            "fileType": "mp3",
                            "homeworkSinfoId": "1000e1cc32ca4b6b878fe3e9b04e411d",
                            "id": "039ec87e807f4481a10982f4d066b55b",
                            "previewUrl": "http://yk3.gokuai.com/app/gk_gallery2?mount_id=1308158&fullpath=homework%2F73%2FHDXU1EB03%2F2017-07-26%2F183546ed530949dc98a226816273269c.png&member_id=0&filename=183546ed530949dc98a226816273269c.png&hash=23b146f8a368715c0b0c9c53477e90c19aa1d557&filehash=6f09a35776df3e70e4483ccd9f07d874e9112a7c&filesize=590575&file=http%3A%2F%2Fyk3.gokuai.com%2Findex%2Fthumb%3Fmount_id%3D1308158%26type%3Dpng%26hash%3D23b146f8a368715c0b0c9c53477e90c19aa1d557%26filehash%3D6f09a35776df3e70e4483ccd9f07d874e9112a7c%26big%3D1&expires=1501150476&signature=Zs%2B%2Fg3nQpZBVWQQGaDEmRXwj1bE%3D&app_id=0&storage_point=",
                            "thumbnail": "http://yk3.gokuai.com/index/thumb?mount_id=1308158&type=png&hash=23b146f8a368715c0b0c9c53477e90c19aa1d557&filehash=6f09a35776df3e70e4483ccd9f07d874e9112a7c",
                            "time": "2017-07-26 20:17:29",
                            "uploadTime": 1501071462000,
                            "url": "http://dn-storage-xdf.gokuai.com/6f/6f09a35776df3e70e4483ccd9f07d874e9112a7c.dat?response-content-disposition=attachment%3B%20filename%3D%22183546ed530949dc98a226816273269c.png%22%3B%20filename%2A%3Dutf-8%27%27183546ed530949dc98a226816273269c.png&response-content-type=application%2Foctet-stream&OSSAccessKeyId=xAme5tplBBYJXFYm&Expires=1501150476&Signature=d6dYY7r%2F0EuJNt1rmKllumMfxdQ%3D"
                        }
                    ],
                    [
                        {
                            "diskFilePath": "homework/73/HDXU1EB03/2017-07-26/5374c316e2704b419e70a91e4f084b1a.png",
                            "fileName": "5374c316e2704b419e70a91e4f084b1a.png",
                            "fileSize": "629345",
                            "fileType": "png",
                            "homeworkSinfoId": "1000e1cc32ca4b6b878fe3e9b04e411d",
                            "id": "9f566e61626147e588e5b400d1fbf7e2",
                            "previewUrl": "http://yk3.gokuai.com/app/gk_gallery2?mount_id=1308158&fullpath=homework%2F73%2FHDXU1EB03%2F2017-07-26%2F5374c316e2704b419e70a91e4f084b1a.png&member_id=0&filename=5374c316e2704b419e70a91e4f084b1a.png&hash=9a146d379afcd4d0207fa958034e0f0fa0965359&filehash=943f71f1a90c917bd3db3df4d991410e3312283a&filesize=629345&file=http%3A%2F%2Fyk3.gokuai.com%2Findex%2Fthumb%3Fmount_id%3D1308158%26type%3Dpng%26hash%3D9a146d379afcd4d0207fa958034e0f0fa0965359%26filehash%3D943f71f1a90c917bd3db3df4d991410e3312283a%26big%3D1&expires=1501150476&signature=Zs%2B%2Fg3nQpZBVWQQGaDEmRXwj1bE%3D&app_id=0&storage_point=",
                            "thumbnail": "http://yk3.gokuai.com/index/thumb?mount_id=1308158&type=png&hash=9a146d379afcd4d0207fa958034e0f0fa0965359&filehash=943f71f1a90c917bd3db3df4d991410e3312283a",
                            "time": "2017-07-26 20:12:05",
                            "uploadTime": 1501071140000,
                            "url": "http://dn-storage-xdf.gokuai.com/94/943f71f1a90c917bd3db3df4d991410e3312283a.dat?response-content-disposition=attachment%3B%20filename%3D%225374c316e2704b419e70a91e4f084b1a.png%22%3B%20filename%2A%3Dutf-8%27%275374c316e2704b419e70a91e4f084b1a.png&response-content-type=application%2Foctet-stream&OSSAccessKeyId=xAme5tplBBYJXFYm&Expires=1501150476&Signature=G0Eb%2Frwjo7GElfR4doY9BEoMAUU%3D"
                        },
                        {
                            "diskFilePath": "homework/73/HDXU1EB03/2017-07-26/183546ed530949dc98a226816273269c.png",
                            "fileName": "183546ed530949dc98a226816273269c.png",
                            "fileSize": "590575",
                            "fileType": "mp3",
                            "homeworkSinfoId": "1000e1cc32ca4b6b878fe3e9b04e411d",
                            "id": "039ec87e807f4481a10982f4d066b55b",
                            "previewUrl": "http://yk3.gokuai.com/app/gk_gallery2?mount_id=1308158&fullpath=homework%2F73%2FHDXU1EB03%2F2017-07-26%2F183546ed530949dc98a226816273269c.png&member_id=0&filename=183546ed530949dc98a226816273269c.png&hash=23b146f8a368715c0b0c9c53477e90c19aa1d557&filehash=6f09a35776df3e70e4483ccd9f07d874e9112a7c&filesize=590575&file=http%3A%2F%2Fyk3.gokuai.com%2Findex%2Fthumb%3Fmount_id%3D1308158%26type%3Dpng%26hash%3D23b146f8a368715c0b0c9c53477e90c19aa1d557%26filehash%3D6f09a35776df3e70e4483ccd9f07d874e9112a7c%26big%3D1&expires=1501150476&signature=Zs%2B%2Fg3nQpZBVWQQGaDEmRXwj1bE%3D&app_id=0&storage_point=",
                            "thumbnail": "http://yk3.gokuai.com/index/thumb?mount_id=1308158&type=png&hash=23b146f8a368715c0b0c9c53477e90c19aa1d557&filehash=6f09a35776df3e70e4483ccd9f07d874e9112a7c",
                            "time": "2017-07-26 20:17:29",
                            "uploadTime": 1501071462000,
                            "url": "http://dn-storage-xdf.gokuai.com/6f/6f09a35776df3e70e4483ccd9f07d874e9112a7c.dat?response-content-disposition=attachment%3B%20filename%3D%22183546ed530949dc98a226816273269c.png%22%3B%20filename%2A%3Dutf-8%27%27183546ed530949dc98a226816273269c.png&response-content-type=application%2Foctet-stream&OSSAccessKeyId=xAme5tplBBYJXFYm&Expires=1501150476&Signature=d6dYY7r%2F0EuJNt1rmKllumMfxdQ%3D"
                        }
                    ]
                ],
                "TeacherHomeworkFile": [
                    {
                        "diskFilePath": "homework/73/HDXU1EB03/2017-07-26/bb302ae0bf0840d2af5d99ff5da5db54.mp3",
                        "fileName": "bb302ae0bf0840d2af5d99ff5da5db54.mp3",
                        "fileSize": "5445",
                        "fileType": "mp3",
                        "homeworkTinfoId": "bdba9eefaa8b4866a3491a8793e3cd49",
                        "id": "901d9086c94341f5b5d21ef61a79ac81",
                        "previewUrl": "http://yk3.gokuai.com/app/unpreview?err_msg=%E8%AF%A5%E6%96%87%E4%BB%B6%E4%B8%8D%E6%94%AF%E6%8C%81%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88&mount_id=1308158&fullpath=homework%2F73%2FHDXU1EB03%2F2017-07-26%2Fbb302ae0bf0840d2af5d99ff5da5db54.mp3&app_id=0",
                        "thumbnail": "http://yk3.gokuai.com/index/thumb?mount_id=1308158&type=mp3&hash=3cadc074ab79391ee9fcf663bdc0b7d41ec98cc2&filehash=0a9e85a723bdc05857f9824a105a2c415e0a789d",
                        "time": "2017-07-26 20:07:13",
                        "uploadTime": 1501070852000,
                        "url": "homework/73/HDXU1EB03/2017-07-26/bb302ae0bf0840d2af5d99ff5da5db54.mp3"
                    },
                    {
                        "diskFilePath": "homework/73/HDXU1EB03/2017-07-26/J5DQXhvn6BPspO5-zucHhLQ8illkzEflwdKhQ7pq5pz4yvL48UmNRfhzLz61WCjO.jpg",
                        "fileName": "J5DQXhvn6BPspO5-zucHhLQ8illkzEflwdKhQ7pq5pz4yvL48UmNRfhzLz61WCjO.jpg",
                        "fileSize": "59154",
                        "fileType": "jpg",
                        "homeworkTinfoId": "bdba9eefaa8b4866a3491a8793e3cd49",
                        "id": "e862a5e5090747988b599c331891f76a",
                        "previewUrl": "http://yk3.gokuai.com/app/gk_gallery2?mount_id=1308158&fullpath=homework%2F73%2FHDXU1EB03%2F2017-07-26%2FJ5DQXhvn6BPspO5-zucHhLQ8illkzEflwdKhQ7pq5pz4yvL48UmNRfhzLz61WCjO.jpg&member_id=0&filename=J5DQXhvn6BPspO5-zucHhLQ8illkzEflwdKhQ7pq5pz4yvL48UmNRfhzLz61WCjO.jpg&hash=f5971b9de27defa52e3df36bcd0e59178f826b7d&filehash=eff20b73be80dc21aff4872175f11748dfe2f57c&filesize=59154&file=http%3A%2F%2Fyk3.gokuai.com%2Findex%2Fthumb%3Fmount_id%3D1308158%26type%3Djpg%26hash%3Df5971b9de27defa52e3df36bcd0e59178f826b7d%26filehash%3Deff20b73be80dc21aff4872175f11748dfe2f57c%26big%3D1&expires=1501150476&signature=Zs%2B%2Fg3nQpZBVWQQGaDEmRXwj1bE%3D&app_id=0&storage_point=",
                        "thumbnail": "http://yk3.gokuai.com/index/thumb?mount_id=1308158&type=jpg&hash=f5971b9de27defa52e3df36bcd0e59178f826b7d&filehash=eff20b73be80dc21aff4872175f11748dfe2f57c",
                        "time": "2017-07-26 20:07:29",
                        "uploadTime": 1501070852000,
                        "url": "http://dn-storage-xdf.gokuai.com/ef/eff20b73be80dc21aff4872175f11748dfe2f57c.dat?response-content-disposition=attachment%3B%20filename%3D%22J5DQXhvn6BPspO5-zucHhLQ8illkzEflwdKhQ7pq5pz4yvL48U.jpg%22%3B%20filename%2A%3Dutf-8%27%27J5DQXhvn6BPspO5-zucHhLQ8illkzEflwdKhQ7pq5pz4yvL48U.jpg&response-content-type=application%2Foctet-stream&OSSAccessKeyId=xAme5tplBBYJXFYm&Expires=1501150476&Signature=As%2Bf0zrPHCqo%2FkV7kU%2BJSVLUnHQ%3D"
                    },
                    {
                        "diskFilePath": "homework/73/HDXU1EB03/2017-07-26/qZ65BOG6KRaJpB9lzl0zmziBX53x-xtVzG-K4JhrRm2FDZgn-oSx76ZnqNz_K6Md.jpg",
                        "fileName": "qZ65BOG6KRaJpB9lzl0zmziBX53x-xtVzG-K4JhrRm2FDZgn-oSx76ZnqNz_K6Md.jpg",
                        "fileSize": "11032",
                        "fileType": "jpg",
                        "homeworkTinfoId": "bdba9eefaa8b4866a3491a8793e3cd49",
                        "id": "b4a821275ff143828060805d133ee2cd",
                        "previewUrl": "http://yk3.gokuai.com/app/gk_gallery2?mount_id=1308158&fullpath=homework%2F73%2FHDXU1EB03%2F2017-07-26%2FqZ65BOG6KRaJpB9lzl0zmziBX53x-xtVzG-K4JhrRm2FDZgn-oSx76ZnqNz_K6Md.jpg&member_id=0&filename=qZ65BOG6KRaJpB9lzl0zmziBX53x-xtVzG-K4JhrRm2FDZgn-oSx76ZnqNz_K6Md.jpg&hash=11662826dcb912f1142ae9ee6f54615cb08c1b78&filehash=42fd9778aa5d270957a974d70ae2fe8b6dcf74cc&filesize=11032&file=http%3A%2F%2Fyk3.gokuai.com%2Findex%2Fthumb%3Fmount_id%3D1308158%26type%3Djpg%26hash%3D11662826dcb912f1142ae9ee6f54615cb08c1b78%26filehash%3D42fd9778aa5d270957a974d70ae2fe8b6dcf74cc%26big%3D1&expires=1501150476&signature=Zs%2B%2Fg3nQpZBVWQQGaDEmRXwj1bE%3D&app_id=0&storage_point=",
                        "thumbnail": "http://yk3.gokuai.com/index/thumb?mount_id=1308158&type=jpg&hash=11662826dcb912f1142ae9ee6f54615cb08c1b78&filehash=42fd9778aa5d270957a974d70ae2fe8b6dcf74cc",
                        "time": "2017-07-26 20:07:30",
                        "uploadTime": 1501070852000,
                        "url": "http://dn-storage-xdf.gokuai.com/42/42fd9778aa5d270957a974d70ae2fe8b6dcf74cc.dat?response-content-disposition=attachment%3B%20filename%3D%22qZ65BOG6KRaJpB9lzl0zmziBX53x-xtVzG-K4JhrRm2FDZgn-o.jpg%22%3B%20filename%2A%3Dutf-8%27%27qZ65BOG6KRaJpB9lzl0zmziBX53x-xtVzG-K4JhrRm2FDZgn-o.jpg&response-content-type=application%2Foctet-stream&OSSAccessKeyId=xAme5tplBBYJXFYm&Expires=1501150476&Signature=jZNpWSGXh%2B6S2%2FkqpKwgj7G5OPE%3D"
                    },
                    {
                        "diskFilePath": "homework/73/HDXU1EB03/2017-07-26/TSbnsYJqK_bJ_vf5fkKf0VRRh2P6N5u4AZO79REq3wEQitFDLmXZUpWwhW1_EIGH.jpg",
                        "fileName": "TSbnsYJqK_bJ_vf5fkKf0VRRh2P6N5u4AZO79REq3wEQitFDLmXZUpWwhW1_EIGH.jpg",
                        "fileSize": "33703",
                        "fileType": "jpg",
                        "homeworkTinfoId": "bdba9eefaa8b4866a3491a8793e3cd49",
                        "id": "7e47625dc7114421ae813f0e84580520",
                        "previewUrl": "http://yk3.gokuai.com/app/gk_gallery2?mount_id=1308158&fullpath=homework%2F73%2FHDXU1EB03%2F2017-07-26%2FTSbnsYJqK_bJ_vf5fkKf0VRRh2P6N5u4AZO79REq3wEQitFDLmXZUpWwhW1_EIGH.jpg&member_id=0&filename=TSbnsYJqK_bJ_vf5fkKf0VRRh2P6N5u4AZO79REq3wEQitFDLmXZUpWwhW1_EIGH.jpg&hash=9eda94b023b3c679dd661c01112b3bae2f435778&filehash=f79b876743edabe51a0f50a575267cea988facbb&filesize=33703&file=http%3A%2F%2Fyk3.gokuai.com%2Findex%2Fthumb%3Fmount_id%3D1308158%26type%3Djpg%26hash%3D9eda94b023b3c679dd661c01112b3bae2f435778%26filehash%3Df79b876743edabe51a0f50a575267cea988facbb%26big%3D1&expires=1501150475&signature=4peP%2FHt91x4niNQpCCKcWnhKq9Y%3D&app_id=0&storage_point=",
                        "thumbnail": "http://yk3.gokuai.com/index/thumb?mount_id=1308158&type=jpg&hash=9eda94b023b3c679dd661c01112b3bae2f435778&filehash=f79b876743edabe51a0f50a575267cea988facbb",
                        "time": "2017-07-26 20:07:30",
                        "uploadTime": 1501070852000,
                        "url": "http://dn-storage-xdf.gokuai.com/f7/f79b876743edabe51a0f50a575267cea988facbb.dat?response-content-disposition=attachment%3B%20filename%3D%22TSbnsYJqK_bJ_vf5fkKf0VRRh2P6N5u4AZO79REq3wEQitFDLm.jpg%22%3B%20filename%2A%3Dutf-8%27%27TSbnsYJqK_bJ_vf5fkKf0VRRh2P6N5u4AZO79REq3wEQitFDLm.jpg&response-content-type=application%2Foctet-stream&OSSAccessKeyId=xAme5tplBBYJXFYm&Expires=1501150475&Signature=ayaqE%2B5lhvtjW9nFL09OHeb25Nk%3D"
                    }
                ]
            },
            "status": "success"
        };
        var tea = e.data.RevampFile;//老师批注
        var stu = e.data.StudentHomeworkFile;//学生答案
        var tea_t = e.data.TeacherHomeworkFile;//作业信息
        if (tea != undefined) {
            for (var b = 0; b < tea.length; b++) {
                $.each(tea[b],function (i,item) {
                    if (item.fileType == 'mp3') {
                        getAudioInfo([3, item.diskFilePath, "mp3"],['replayT',b]);
                    } else {
                        $('.tea_sp .hmAnswer:eq('+b+')').find('.imgBox').append('<div><img src="'+item.url + '" alt="" /></div>');
                        // $('.imgBox').eq(2).append('<div><img src="'+tea[b].url + '" alt="" /></div>')
                    }
                });

            }
        }
        if (stu != undefined) {
            for (var a = 0; a < stu.length; a++) {
                if (stu[a].fileType == 'mp3') {
                    getAudioInfo([2, stu[a].diskFilePath, "mp3"]);
                    // $('.big_ss').eq(1).append('<div class="music_s"><span>10"</span> <audio  src="http://dt.staff.xdf.cn/xdfdtmanager/mp3/you.mp3" id="bgMusic"></audio ></div>')
                } else {
                    $('.imgBox').eq(1).append('<div><img src="' + url_o + stu[a].url + '" alt="" /></div>')
                }
            }
        }
        if (tea_t != undefined) {
            for (var c = 0; c < tea_t.length; c++) {
                if (tea_t[c].fileType == 'mp3') {
                    getAudioInfo([1, tea_t[c].diskFilePath, "mp3"]);
                    // $('.big_ss').eq(0).append('<div class="music_s"><span>10"</span> <audio  src="http://dt.staff.xdf.cn/xdfdtmanager/mp3/you.mp3" id="bgMusic"></audio ></div>')
                } else {
                    $('.imgBox').eq(0).append('<div><img src="' + tea_t[c].url + '" alt="" /></div>')

                }
            }
        }
    }


});
