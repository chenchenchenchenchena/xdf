$(function () {






    var trardata = {
        'teacherCode': 'TC23',
        'schoolId': '73',
        'email': 'hanqifan@xdf.cn'
    };
    var homeworksubm = {
        'teacherEmail': 'hanqifan@xdf.cn',
        'teacherName': '韩启凡',
        'schoolId': '73',
        'appid': 'wxab29a3e2000b8d2a',
        'secret': '7739991fcce774c2281147eae3986ad9',
        'url': 'http://dt.staff.xdf.cn/xdfdthome/homework/homeworklist_s.html',
        'templateId': 'X9u2z5OF33JCPXDuTGnw06fUt0n-7CSjCe5otNgXO6M'
    };

    var layer1, layer2, loading;

    //获取班级信息
    ajax_S(homework_s.t_clas, trardata, function (e) {
        console.log(e);
        var className = e.data;
        for (var a = 0; a < className.length; a++) {
            $('.class_name ul').append('<li classCode="' + className[a].ClassCode + '"><img src="images/C05_06.png" alt="">' + className[a].ClassName + '</li>')
        }
        if (sessionStorage.Classname_x) {
            $('.class_s i').html('已选择1个班' + sessionStorage.Classname_x + ';');
            $('.time_S i').html(sessionStorage.ClassTime_x);
            $('.class_name i').html('1');
            $('.Knowledge input').val(sessionStorage.knowledgePoint_x);
            $('.home_text textarea').val(sessionStorage.description_x);
            $('.class_name li').each(function () {
                if ($(this).attr('classcode') == sessionStorage.classCode_in) {
                    $(this).find('img').attr('src', 'images/C0503.png')
                }
            });
            ajaxRequest('post', homework_s.t_seac, {'Tcid': sessionStorage.id_x}, function (e) {
                sessionStorage.removeItem('Classname_x');
                var tea = e.data;
                for (var b = 0; b < tea.length; b++) {
                    if (tea[b].fileType == 'mp3') {
                        $('.big_s').eq(0).append('<div class="music_s" onclick="PlaySound(bgMusic' + b + ')"  fileName="' + tea[b].fileName + '" fileType="' + tea[b].fileType + '" fileSize="' + tea[b].fileSize + '" diskFilePath="' + tea[b].diskFilePath + '"><span>10"</span> <audio  src="' + tea[b].previewUrl + '" id="bgMusic' + b + '"  controls="controls" preload="auto"></audio ></div>')
                    } else {
                        $('.imgBox').show();
                        $('.imgBox').eq(0).append('<img src="' + tea[b].thumbnail + '" alt="" fileName="' + tea[b].fileName + '" fileType="' + tea[b].fileType + '" fileSize="' + tea[b].fileSize + '" diskFilePath="' + tea[b].diskFilePath + '"/>')
                    }
                }
            });
        }
    });

    //选择班
    $('.class_s').on('touchend', function () {
        $('.class_name').show();
        $('.class_name').animate({'bottom': '0px'});
        $('.class_name').show();
        $('.big_back').show();
    });

    $(document).on('tap', '.class_name li', function () {
        var html_ = $('.class_name i').html();
        if ($(this).find('img').attr('src') == 'images/C05_06.png') {
            $(this).find('img').attr('src', 'images/C0503.png');
            html_++;
            $('.class_name i').html(html_);
        } else {
            $(this).find('img').attr('src', 'images/C05_06.png');
            html_--;
            $('.class_name i').html(html_);
        }
    });

    var className = '';
    var classCode = '';
    //确认班级
    $('.class_sub').on('touchend', function () {
        className = '';
        classCode = '';
        $(this).parent().find('li').each(function () {
            if ($(this).find('img').attr('src') == 'images/C0503.png') {
                className += $(this).text() + '；';
                classCode += $(this).attr('ClassCode') + ',';
            }
        });

        if (className == '') {
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classEmpty")
            })
        }

        if ($('.class_name i').html() != '0') {
            $('.class_s i').html('已选择' + $('.class_name i').html() + '个班&nbsp;&nbsp;' + className + ' ');
            $('.class_name').animate({'bottom': '-438px'});
            $('.big_back').hide();
        } else {
            $('.class_s i').html('');
        }
    });


    //作业描述验证
    $('.home_text textarea').on('keyup', function () {
        if ($(this).val().length > 200) {
            $('.home_text span').css('color', 'red');
        } else {
            $('.home_text span').css('color', '#808080');
        }
        $('.home_text span').html('' + $(this).val().length + '/200')
    });
    $('.home_text textarea').on('blur', function () {
        if ($(this).val().length > 200) {
            $('.home_text span').css('color', 'red');
        } else {
            $('.home_text span').css('color', '#808080');
        }
        $('.home_text span').html('' + $(this).val().length + '/200')
    });
    //知识点验证
    $('.Knowledge input').on('keyup', function () {
        var html_ = $(this).val();
        if (html_.indexOf(',') != html_.lastIndexOf(',') && html_.lastIndexOf(',') != -1) {
            $(this).val(html_.substr(0, html_.length - 1))

        }
        if (html_.indexOf(';') != html_.lastIndexOf(';') && html_.lastIndexOf(';') != -1) {
            $(this).val(html_.substr(0, html_.length - 1))
        }
        if (html_.indexOf('，') != html_.lastIndexOf('，') && html_.lastIndexOf('，') != -1) {
            $(this).val(html_.substr(0, html_.length - 1))
        }
        if (html_.indexOf('；') != html_.lastIndexOf('；') && html_.lastIndexOf('；') != -1) {
            $(this).val(html_.substr(0, html_.length - 1))
        }
        if (html_.indexOf(',') != -1) {
            if (html_.indexOf(';') != -1 || html_.indexOf('，') != -1 || html_.indexOf('；') != -1) {
                $(this).val(html_.substr(0, html_.length - 1))
            }
        }
        if (html_.indexOf(';') != -1) {
            if (html_.indexOf(',') != -1 || html_.indexOf('，') != -1 || html_.indexOf('；') != -1) {
                $(this).val(html_.substr(0, html_.length - 1))
            }
        }
        if (html_.indexOf('，') != -1) {
            if (html_.indexOf(';') != -1 || html_.indexOf(',') != -1 || html_.indexOf('；') != -1) {
                $(this).val(html_.substr(0, html_.length - 1))
            }
        }
        if (html_.indexOf('；') != -1) {
            if (html_.indexOf(';') != -1 || html_.indexOf('，') != -1 || html_.indexOf('，') != -1) {
                $(this).val(html_.substr(0, html_.length - 1))
            }
        }
    });


    $('.Choice_s input').on('change', function () {
        $('.time_S i').html($(this).val())
    });
    //提交作业
    $('.Submit_s').on('touchend', function () {
        if ($(this).css('background') == 'rgb(204, 204, 204) none repeat scroll 0% 0% / auto padding-box border-box') {
            layer.msg('正在提交，请稍等');
            return false;
        }
        if ($('.class_s i').html() == '') {
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classEmpty")
            });
            return false;
        }
        if ($('.time_S i').html() == '') {
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classTime")
            });
            return false;
        }
        if ($('.Knowledge input').val() == '') {
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classKnow")
            });
            return false;
        }
        if ($('.home_text textarea').val() == '') {
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classHome")
            });
            return false;
        }
        if ($('.home_text span').css('color') == 'rgb(255, 0, 0)') {
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classText")
            });
            return false;
        }
        if ($('.Knowledge input').val().indexOf(',') != -1) {
            var html_te = $('.Knowledge input').val().substring(0, $('.Knowledge input').val().indexOf(','));
            if (html_te.length > 10) {
                layer.msg('单条知识点对多输入10个字');
                return false;
            }
        } else if ($('.Knowledge input').val().indexOf(';') != -1) {
            var html_te = $('.Knowledge input').val().substring(0, $('.Knowledge input').val().indexOf(';'));
            if (html_te.length > 10) {
                layer.msg('单条知识点对多输入10个字');
                return false;
            }
        } else if ($('.Knowledge input').val().indexOf('，') != -1) {
            var html_te = $('.Knowledge input').val().substring(0, $('.Knowledge input').val().indexOf('，'));
            if (html_te.length > 10) {
                layer.msg('单条知识点对多输入10个字');
                return false;
            }
        } else if ($('.Knowledge input').val().indexOf('；') != -1) {
            var html_te = $('.Knowledge input').val().substring(0, $('.Knowledge input').val().indexOf('；'));
            if (html_te.length > 10) {
                layer.msg('单条知识点对多输入10个字');
                return false;
            }
        } else {
            var html_te = $('.Knowledge input').val();
            if (html_te.length > 10) {
                layer.msg('单条知识点对多输入10个字');
                return false;
            }
        }
        if (sessionStorage.Classname_x) {
            arr_s = arr_voice.concat(arr_image);
            var errohome = {};
            errohome.knowledgePoint = $('.Knowledge input').val();
            errohome.id = sessionStorage.id_x;
            errohome.description = encodeURI($('.home_text textarea').val());
            errohome.fileInfo = arr_s;
            // if ($('.music_s').eq(0).attr('filename')) {
            //     arr_s.push({
            //         'fileName': $('.music_s').eq(0).attr('filename'),
            //         'fileType': $('.music_s').eq(0).attr('filetype'),
            //         'fileSize': $('.music_s').eq(0).attr('filesize'),
            //         'diskFilePath': $('.music_s').eq(0).attr('diskfilepath')
            //     });
            // }
            // if ($('.imgBox img').eq(0).attr('filename')) {
            //     arr_s.push({
            //         'fileName': $('.imgBox img').eq(0).attr('filename'),
            //         'fileType': $('.imgBox img').eq(0).attr('filetype'),
            //         'fileSize': $('.imgBox img').eq(0).attr('filesize'),
            //         'diskFilePath': $('.imgBox img').eq(0).attr('diskfilepath')
            //     });
            // }
            ajax_S(homework_s.t_erro, errohome, function (e) {
                if (e.result == true) {
                    $('.big_back').show();
                    $('.succ').show();
                    $('.Submit_s').css('background', '#00ba97');
                    sessionStorage.removeItem('Classname_x');
                    sessionStorage.removeItem('ClassTime_x');
                    sessionStorage.removeItem('knowledgePoint_x');
                    sessionStorage.removeItem('description_x');
                    sessionStorage.removeItem('id_x');
                } else {
                    $('.erro p').html(e.message);
                    $('.big_back').show();
                    $('.erro').show();
                }
            })
        } else {
            var class_c = classCode.substr(0, classCode.length - 1);
            var class_n = className.replace(/\；/g, ',').substr(0, className.length - 1);
            arr_s = arr_voice.concat(arr_image);
            homeworksubm.classCode = class_c;
            homeworksubm.className = class_n;
            homeworksubm.homeworkTime = $('.time_S i').html();
            homeworksubm.knowledgePoint = $('.Knowledge input').val();
            homeworksubm.description = encodeURI($('.home_text textarea').val());
            homeworksubm.fileInfo = arr_s;
            ajax_S(homework_s.t_sbim, homeworksubm, function (e) {
                $('.Submit_s').css('background', '#ccc');
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
        }


    });
    //状态点击
    $('.succ input').on('touchend', function () {
        $('.big_back').hide();
        $('.succ').hide();
        location.href = 'homeworklist_t.html';
    });

    $('.erro input:first-of-type').on('touchend', function () {
        $('.big_back').hide();
        $('.erro').hide();
        $('.Submit_s').css('background', '#00ba97')
    });

    $('.erro input:last-of-type').on('touchend', function () {
        $('.big_back').hide();
        $('.erro').hide();
        ajax_S(homework_s.t_sbim, homeworksubm, function (e) {
            if (e.result == true) {
                $('.big_back').show();
                $('.succ').show();
            } else {
                $('.big_back').show();
                $('.erro').show();
            }
        })
    });

    $('.big_back').on('touchstart', function () {
        if ($('.class_name').css('display') == 'block') {
            $('.class_name').animate({'bottom': '-438px'});
            setTimeout(function () {
                $('.big_back').hide();
            }, 300);
            if($('.class_s i').html()==''){
                $('.class_name i').html('0');
                $('.class_name img').attr('src', 'images/C05_06.png');
                if ($('.class_name i').html() == '0') {
                    $('.class_s i').html('')
                }
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
    $('.big_whit').on('touchend', function () {
        setTimeout(function () {
            $('.big_whit').hide();
        }, 300);
        $('.song_s').hide();
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
                // if (timeds > 1) {
                //     $('.big_s').append('<div class="music_s"><span></span> </div>');
                // }
                localId = res.localId;
                song_s = localId;
                uploadVoiceWX(localId);
                showAudio();
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
                // alert(JSON.stringify(res));
                //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
                serverId = res.serverId;
                uploadVoice(serverId);
            }
        });
    }

    var arr_s = [];
    var arr_voice = [];
    var arr_image = [];
    var recordCount = 0;
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
                    $('.teBox').val(e.data.fileUrl);
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
                    showAudio(url_o + e.data, $('#record_audio_box'), recordCount);
                    recordCount++;

                }
            }
        });
    }

    /**
     * 显示录制语音布局
     */
    function showAudio(url, parentId, id) {

        parentId.show();
        var strVoice = "";
        var idChildren;
        var length = "";
        idChildren = "record_audio" + id;
        //录音布局，可以删除
        strVoice += "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto'><source src='" + url + "' type='audio/mpeg'></audio>" +
            "<i class='play-icon'></i><span class='stuVoice'></span></div><span class='voice_lenth'>" + length + "</span></li>";

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

    // //显示语音布局
    // function showAudio(url, length) {
    //     $('.music_s').eq(Index_s).find('span').html(timeInedex + '"');
    // }
    //
    // function PlaySound(soundobj) {
    //     alert(5);
    //     var thissound = document.getElementById(soundobj);
    //
    //     thissound.play();
    //
    // }
    // $(document).on('touchend','.music_s',function () {
    //     $(this).addClass('playing_s');
    //     playVoice(song_s);
    //     setTimeout(function(){
    //      $('.music_s').removeClass('playing_s');
    //     },$('.music_s').eq(Index_s).find('span').html().substr(0,$('.music_s').eq(Index_s).find('span').html().length-1)+'000');
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

    $('body').css('overflow-y', 'auto')
});