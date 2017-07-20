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
                $('.excellent').html('  ')
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

    if (sessionStorage.Teatwo) {
        sessionStorage.removeItem('Teatwo');
        $('.anDes').eq(1).html(sessionStorage.T_text);
        ajaxRequest('post', homework_s.t_two, {Tcid: sessionStorage.Tid, Sdtid: sessionStorage.Stuid_t}, function (e) {
            var tea = e.data.RevampFile;
            var stu = e.data.StudentHomeworkFile;
            var tea_t = e.data.TeacherHomeworkFile;
            for (var b = 0; b < tea.length; b++) {
                if (tea[b].fileType == 'mp3') {
                    getAudioInfo(stu[a].diskFilePath);
                    // $('.big_ss').eq(2).append('<div class="music_s"><span>10"</span> <audio  src="http://dt.staff.xdf.cn/xdfdtmanager/mp3/you.mp3" id="bgMusic"></audio ></div>')
                } else {
                    $('.imgBox').eq(2).append('<div><img src="' + tea[b].url + '" alt="" /></div>')
                }
            }
            for (var a = 0; a < stu.length; a++) {
                if (stu[a].fileType == 'mp3') {
                    getAudioInfo(stu[a].diskFilePath);
                    // $('.big_ss').eq(1).append('<div class="music_s"><span>10"</span> <audio  src="http://dt.staff.xdf.cn/xdfdtmanager/mp3/you.mp3" id="bgMusic"></audio ></div>')
                } else {
                    $('.imgBox').eq(1).append('<div><img src="' + stu[a].url + '" alt="" /></div>')
                }
            }
            for (var c = 0; c < tea_t.length; c++) {
                if (tea_t[c].fileType == 'mp3') {
                    getAudioInfo(stu[a].diskFilePath);
                    // $('.big_ss').eq(0).append('<div class="music_s"><span>10"</span> <audio  src="http://dt.staff.xdf.cn/xdfdtmanager/mp3/you.mp3" id="bgMusic"></audio ></div>')
                } else {
                    $('.imgBox').eq(0).append('<div><img src="' + tea_t[c].url + '" alt="" /></div>')

                }
            }
        });
    } else {
        $('.hmAnswer').eq(1).hide();
        //获取文件信息
        ajaxRequest('post', homework_s.t_modi, {Tcid: sessionStorage.Tid, Sdtid: sessionStorage.stuid}, function (e) {
            console.log(e);
            var stu = e.data.StudentHomeworkFile;
            var tea = e.data.TeacherHomeworkFile;

            for (var a = 0; a < stu.length; a++) {
                if (stu[a].fileType == 'mp3') {
                    getAudioInfo(stu[a].diskFilePath);
                } else {
                    $('.imgBox').eq(1).append('<div><img src="' + stu[a].url + '" alt="" /></div>')
                }
            }
            for (var b = 0; b < tea.length; b++) {
                if (tea[b].fileType == 'mp3') {
                    getAudioInfo(tea[b].diskFilePath);
                } else {
                    $('.imgBox').eq(0).append('<div><img src="' + tea[b].url + '" alt="" /></div>')

                }
            }
        });
    }

    var audioCount = 0;

    /**
     * 获取语音信息
     */
    function getAudioInfo(diskFileUrl) {
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
                    //将文件显示到布局中
                    showAudio(url_o + e.data, $('#audio_box'), audioCount, 2);
                    audioCount++;

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

    //批改作业提交
    $('.sub_p').on('touchend', function () {
        if ($(this).css('background') == 'rgb(204, 204, 204) none repeat scroll 0% 0% / auto padding-box border-box') {
            layer.msg('正在提交，请稍等');
            return false;
        }
        if ($('.teBox').val() == '') {
            layer.msg('批复内容不能为空');
            return false;
        }
        need.replyDesc = $('.teBox').html();
        if ($('.infoTitle span').css('color') == 'rgb(255, 106, 106)') {
            need.tag = '0'
        } else {
            need.tag = '1'
        }
        arr_s = arr_voice.concat(arr_image);
        need.fileInfo = arr_s;
        need.replyDesc = encodeURI($('.answer textarea').val());
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
    })


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
            'appId': "wx559791e14e9ce521",
            'appSecret': "baa4373d5a8750c69b9d1655a2e31370",
            'mediaId': serverId,
            'schoolId': "73",
            'classId': "hx001"

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

    // //显示语音布局
    // function showAudio(url, length) {
    //     $('.big_s .music_s').eq(Index_s).find('span').html(timeInedex + '"');
    // }
    //
    //
    // $(document).on('touchend', '.music_s', function () {
    //     $(this).addClass('playing_s');
    //     playVoice(song_s);
    //     setTimeout(function () {
    //         $('.music_s').removeClass('playing_s');
    //     }, $('.music_s').eq(Index_s).find('span').html().substr(0, $('.music_s').eq(Index_s).find('span').html().length - 1) + '000');
    // });

    //图片上传
    $('.image_s').click(function () {
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
                    // $('.teBox').val(res.serverId + "$" + images.localIds[i - 1]);
                    uploadImage(res.serverId);
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
    function uploadImage(serverId) {
        var cbconfig = {
            'appId': "wx559791e14e9ce521",
            'appSecret': "baa4373d5a8750c69b9d1655a2e31370",
            'mediaId': serverId,
            'schoolId': "73",
            'classId': "hx001"
        };
        $.ajax({
            url: url_o + "upload/uploadFileByWeiChat.do",
            // url: "http://10.200.80.235:8080/xdfdtmanager/upload/uploadAudio.do",
            type: 'post',
            dataType: 'json',
            data: cbconfig,
            success: function (e) {
                if (e.status == "failure") {
                    alert(e.message);
                } else {
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

});