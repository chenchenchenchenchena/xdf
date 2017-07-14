$(function () {
    var trardata = {
        'teacherCode': 'TC41',
        'schoolId': '73'
    };
    var homeworksubm = {
        'teacherEmail': 'caoxuefeng@xdf.cn',
        'teacherName': '曹雪峰',
        'schoolId': '73'
    };


    //获取班级信息
    ajax_S(homework_s.t_clas, trardata, function (e) {
        console.log(e);
        var className = e.data.Data;
        for (var a = 0; a < className.length; a++) {
            $('.class_name ul').append('<li classCode="' + className[a].ClassCode + '"><img src="images/C05_06.png" alt="">' + className[a].ClassName + '</li>')
        }
    });

    //选择班
    $('.class_s').on('touchend', function () {
        $('.class_name').show();
        $('.class_name').animate({'bottom': '0px'});
        $('.class_name').show();
        $('.big_back').show();
    });

    $(document).on('touchend', '.class_name li', function () {
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
        if ($('.class_s i').html() == '') {
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classEmpty")
            })
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
            })
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
            })
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
            })
            return false;
        }
        console.log($('.home_text span').css('color'))
        if ($('.home_text span').css('color') == 'rgb(255, 0, 0)') {
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classText")
            })
            return false;
        }

        var class_c = classCode.substr(0, classCode.length - 1);
        var class_n = className.replace(/\；/g, ',').substr(0, className.length - 1);
        homeworksubm.classCode = class_c;
        homeworksubm.className = class_n;
        homeworksubm.homeworkTime = $('.time_S i').html();
        homeworksubm.knowledgePoint = $('.Knowledge input').val();
        homeworksubm.description = $('.home_text textarea').val();
        homeworksubm.fileInfo = [];

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
    //状态点击
    $('.succ input').on('touchend', function () {
        $('.big_back').hide();
        $('.succ').hide();
    });

    $('.erro input:first-of-type').on('touchend', function () {
        $('.big_back').hide();
        $('.erro').hide();
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
    var timeds;
    $('#record').on('touchstart', function (event) {
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
        event.preventDefault();
        wx.stopRecord({
            success: function (res) {
                clearInterval(timeds);
                localId = res.localId;
                song_s = localId;
                uploadVoiceWX(localId);
                showAudio();
                $('.song_s').hide();
                $('.big_whit').hide();
            }
        });
    });

    //播放微信录制后的本地语音文件
    function playVoice(plId) {
        //播放录音
        wx.playVoice({
            localId: plId // 需要播放的音频的本地ID，由stopRecord接口获得
        });
    }

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
                alert(JSON.stringify(e));
                if (e.status == "failure") {
                    alert(e.message);
                } else {
                    $('.teBox').val(e.data.fileUrl);
                    //显示语音布局
                    showAudio(e.data.fileUrl, e.data.fileSize);
                }


            }
        });
    }

    //显示语音布局
    function showAudio(url, length) {
        // $('.music_s').css('width',timeInedex/0.6+'%');
        $('.music_s span').html(timeInedex + '"');
    }


    $('.music_s ').on('touchend', function () {
        $(this).addClass('playing_s');
        playVoice(song_s);
        alert($('.teBox').val());
        alert($('.music_s span').html().substr(0,$('.music_s span').html().length-1));
        setTimeout(function(){
         $('.music_s').removeClass('playing_s');
        },$('.music_s span').html().substr(0,$('.music_s span').html().length-1)+'000');
    });

    //图片上传
    $('.image_s').click(function () {
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
                        $('#image_s').hide();
                    }
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
                if (data.status == "failure") {
                    alert(e.message);
                } else {

                }


            }
        });

    }

    // 删除图片
    $(document).on('touchend', '.stuImg', function () {
        if ($(this).parents('.imgBox').find('div').length <= 1) {
            $(this).parents('.imgBox').remove();
        } else {
            $(this).parent('div').remove();
        }
        // 图片小于三张，显示添加图片按钮
        if ($('.notsubmit .imgBox').children('div').length < 3) {
            $('#image_s').show();
        }
    });


});