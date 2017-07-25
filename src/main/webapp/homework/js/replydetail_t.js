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
            $(this).val($(this).val().substring(0,200));
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
        $('.anDes').eq(1).html(sessionStorage.T_text);
        ajaxRequest('post', homework_s.t_two, {Tcid: sessionStorage.Tid, Sdtid: sessionStorage.stuid}, function (e) {
            var tea = e.data.RevampFile;//老师批注
            var stu = e.data.StudentHomeworkFile;//学生答案
            var tea_t = e.data.TeacherHomeworkFile;//作业信息
            if(tea != undefined){
                for (var b = 0; b < tea.length; b++) {
                    if (tea[b].fileType == 'mp3') {
                        getAudioInfo([3,tea[b].diskFilePath,"mp3"]);
                        // $('.big_ss').eq(2).append('<div class="music_s"><span>10"</span> <audio  src="http://dt.staff.xdf.cn/xdfdtmanager/mp3/you.mp3" id="bgMusic"></audio ></div>')
                    } else {
                        $('.imgBox').eq(2).append('<div><img src="' + tea[b].url + '" alt="" /></div>')
                    }
                }
            }

            for (var a = 0; a < stu.length; a++) {
                if (stu[a].fileType == 'mp3') {
                    getAudioInfo([2,stu[a].diskFilePath,"mp3"]);
                    // $('.big_ss').eq(1).append('<div class="music_s"><span>10"</span> <audio  src="http://dt.staff.xdf.cn/xdfdtmanager/mp3/you.mp3" id="bgMusic"></audio ></div>')
                } else {
                    $('.imgBox').eq(1).append('<div><img src="' + stu[a].url + '" alt="" /></div>')
                }
            }
            for (var c = 0; c < tea_t.length; c++) {
                if (tea_t[c].fileType == 'mp3') {
                    getAudioInfo([1,tea_t[c].diskFilePath,"mp3"]);
                    // $('.big_ss').eq(0).append('<div class="music_s"><span>10"</span> <audio  src="http://dt.staff.xdf.cn/xdfdtmanager/mp3/you.mp3" id="bgMusic"></audio ></div>')
                } else {
                    $('.imgBox').eq(0).append('<div><img src="' + tea_t[c].url + '" alt="" /></div>')

                }
            }
        });
    } else {//待批复
        $('.hmAnswer').eq(1).hide();
        //获取文件信息
        ajaxRequest('post', homework_s.t_modi, {Tcid: sessionStorage.Tid, Sdtid: sessionStorage.stuid}, function (e) {
            console.log(e);
            var stu = e.data.StudentHomeworkFile;
            var tea = e.data.TeacherHomeworkFile;

            for (var a = 0; a < stu.length; a++) {
                if (stu[a].fileType == 'mp3') {
                    getAudioInfo([2,stu[a].diskFilePath,"mp3"]);
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
                    getAudioInfo([1,tea[b].diskFilePath,"mp3"]);
                } else {
                    $('.imgBox').eq(0).append('<div><img src="' + tea[b].url + '" alt="" /></div>')

                }
            }
        });
    }
    var voiceCount = 0;

    /**
     * 获取语音信息
     */
    function getAudioInfo(fileArray) {
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
                    //将文件显示到布局中
                    voiceCount++;
                    showAudio(url_o+e.data, $("#audio_" + flag), "audio" + flag + "" + voiceCount,2);

                }
            }
        });
    }

    /**
     * 显示语音布局
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

            idChildren = "audio_" + id;
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
        var arr_s  = [];
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
        if($('.notsubmit').find('li').length!=0){
            for(var k = 0;k<$('.notsubmit').find('img').length;k++){
                arr_s.push($('.notsubmit').find('img').attr('src'))
            }
        };
        need.fileInfo = arr_s;
        need.replyDesc = encodeURI($('.answer textarea').val());

            $.ajax({
                processData : false,
                contentType : false,
                url:homework_s.t_file,
                type: 'post',
                asyns:false,
                dataType: 'json',
                data:JSON.stringify({file:arr_s,schoolId:localStorage.schoolId,classId:'hx001'}),
                success:function(e){
                    console.log(e)
                }
            });
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
        //重新选择图片，追加图片，max = 3；
        var count = 3 - imgCount;
        wx.chooseImage({
            count: count,
            success: function (res) {

                if (res.localIds.length > 0) {

                    for (var i = 0; i < res.localIds.length; i++) {

                        showUpdataImage(res.localIds[i]);

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
    var Index_Last;
    /*--------------------图片预览----------------------------------*/
    $(document).on('touchend', '.imgBox img', function () {
        Index_Last = $(this).parent().index();
        var previewUrl = $(this).attr('src');
        $('.big_back_s canvas').hide();
        $('.big_back_s').show();
        $('.big_back_s img').attr('src',previewUrl);
        setTimeout(function(){
            $('.big_back_s img').css({
                'margin-top': -parseInt($('.big_back_s img').css('height'))/2,
                'margin-left': -parseInt($('.big_back_s img').css('width'))/2
            });
            $('.big_back_s canvas').css({
                'margin-top': -parseInt($('.big_back_s img').css('height'))/2,
                'margin-left': -parseInt($('.big_back_s img').css('width'))/2
            });
        },300)

    });
    // $('.big_back_s').on('touchend',function(){
    //     $(this).find('canvas').hide();
    //     $(this).find('img').show();
    //     $(this).find('.esc_s').hide();
    //     $(this).find('.true_s').hide();
    //     $(this).find('span:last-of-type').show();
    //     $(this).hide();
    //     $('body').css('overflow','auto')
    //     $('body').css('overflow-x','hidden')
    // });
    $('.esc_s').on('touchend',function(){
        $('.big_back_s').hide();
        $('.big_back_s canvas').hide();
        $('.big_back_s img').show();
        $('.big_back_s .esc_s').hide();
        $('.big_back_s .true_s').hide();
        $('.big_back_s span:last-of-type').show();
        $('.big_back_s').hide();
        $('body').css('overflow-y','auto')
    });
    $('.big_back_s span:last-of-type').on('touchend',function(){
        $(this).hide();
        $('.true_s').show();
        $('body').css('overflow','hidden');
        $('.esc_s').show();
        var previewUrl = $('.big_back_s img').attr('src');
        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.src=previewUrl;
        var canvas =document.getElementById("myCanvas");
        var width_ = parseInt($('.big_back_s img').css('width'));
        var height = parseInt($('.big_back_s img').css('height'));
        canvas.width=width_;
        canvas.height=height;

        var ctx=canvas .getContext("2d");
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';

        img.onload = function(){
            ctx.drawImage(img,0,0,width_,height);
        };
        $('.big_back_s img').hide();
        $('.big_back_s canvas').show();

        // canvas事件
        $(document).on('touchstart','#myCanvas',function(){
            ctx.beginPath();
            ctx.moveTo(event.touches[ 0 ].pageX - canvas.offsetLeft, event.touches[ 0 ].pageY - canvas.offsetTop);
            $(document).on('touchmove','#myCanvas',function(){
                var ev = ev || event;
                ctx.lineTo(event.touches[ 0 ].pageX - canvas.offsetLeft, event.touches[ 0 ].pageY- canvas.offsetTop+15);
                ctx.stroke();
            });
            $(document).on('touchend','#myCanvas',function(){
                ctx.closePath();
                $('.big_back_s').show();
                $('#myCanvas').unbind('touchenstart');
                $('#myCanvas').unbind('touchmove');
                $('#myCanvas').unbind('touchend');
            });
            // upLoadWxImage(canvas.toDataURL("image/png"));

        });

        $('.true_s').on('touchend',function(){
            $('.notsubmit .imgBox').show();
            $('.notsubmit .imgBox').append("<li><span class='stuImg' img-index='" + Index_Last + "'></span><img src='" +canvas.toDataURL("image/png") + "'/></li>");
            $('.big_back_s canvas').hide();
            $('.big_back_s img').show();
            $('.big_back_s .esc_s').hide();
            $('.big_back_s .true_s').hide();
            $('.big_back_s span:last-of-type').show();
            $('.big_back_s').hide();
            $('body').css('overflow-y','auto');
            $('.true_s').unbind('touchend')
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


});