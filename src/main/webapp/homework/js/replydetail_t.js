$(function () {
    var layer1, layer2, loading;
    var need = {
        'stuHomeworkId': sessionStorage.stuid,
        'homeworkTinfoId': sessionStorage.Tid
    };

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
    $('.teBox').on('keyup change', function () {
        $('.teacherword').html('' + $(this).val().length + '/200');
        if ($(this).val().length > 200) {
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
        if(sessionStorage.bangbang){
            $('.hmAnswer .infoTitle span').css({
                'color': '#fff',
                'background': '#ff6a6a'
            });
        }
        $('title').html('已批复');
        //获取文件信息
        ajaxRequest('post', homework_s.t_two, {Tcid: sessionStorage.Tid, Sdtid: sessionStorage.stuid},function(e){

            $('.anDes').eq(0).html(decodeURI(e.data.StudentAnswer));
            $('.kon p:last-of-type').html(decodeURI(e.data.knowledgePoint));
            console.log(decodeURI(e.data.replyDesc))

            var arr = decodeURI(e.data.replyDesc).split('|>|');
            for (var L = 0; L < arr.length; L++) {
                if (arr[L] != '' && arr[L] != undefined) {
                    $('.tea_sp').append('<div class="hmAnswer"><div class="infoTitle">老师批复 </div><div class="anDes">' + arr[L] + '</div><div><ul class="voiceBox" id="audio_3"></ul><div class="imgBox"></div></div></div>');
                } else {
                    $('.tea_sp').append('<div class="hmAnswer"><div class="infoTitle">老师批复 </div><div><ul class="voiceBox" id="audio_3"></ul><div class="imgBox"></div></div></div>');
                }
            }
            $('.hwCon').eq(0).html(decodeURI(e.data.description));
            getHwFilesSucess(e);
        });

    } else {//待批复
        $('.hmAnswer').eq(1).hide();
        //获取文件信息
        ajaxRequest('post', homework_s.t_modi, {Tcid: sessionStorage.Tid, Sdtid: sessionStorage.stuid}, function (e) {
            console.log(e)
            $('.anDes').eq(0).html(decodeURI(e.data.StudentAnswer));
            $('.kon p:last-of-type').html(decodeURI(e.data.knowledgePoint));
            $('.hwCon').eq(0).html(decodeURI(e.data.description));
            var stu = e.data.File.StudentHomeworkFile;
            var tea = e.data.File.TeacherHomeworkFile;
            for (var a = 0; a < stu.length; a++) {
                if (stu[a].fileType == 'mp3') {
                    getAudioInfo([2, stu[a].diskFilePath, stu[a].playTime, "mp3"]);
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
                    getAudioInfo([1, tea[b].diskFilePath, tea[b].playTime, "mp3"]);
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
        var playTime = fileArray[2];
        if (hwFlag!=undefined&&hwFlag[0] == 'replayT') {//老师批复
            //将文件显示到布局中
            voiceCount++;
            replayTShowAudio(playTime, url_o + diskFileUrl, hwFlag[1] + "_" + voiceCount, hwFlag[1]);
        } else {
            //将文件显示到布局中
            voiceCount++;
            showAudio(playTime, url_o + diskFileUrl, $("#audio_" + flag), "audio" + flag + "" + voiceCount, 2);
        }

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

            idChildren = "audio_" + id;
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
        idChildren = "audio_" + id;
        strVoice = "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto' data-time='"+playTime+"'><source src='" + url + "' type='audio/mpeg'></audio>" +
            "<i class='play-icon'></i></div><span class='voice_lenth'>" + voiceLen + "</span></li>";

        $('.tea_sp .hmAnswer:eq('+domIndex+')').find('.voiceBox').append(strVoice);

        $('.song_s,.mask').hide();
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
        $(this).css('background','rgb(204, 204, 204) none repeat scroll 0% 0% / auto padding-box border-box');
        if ($('.teBox').val() == '' && $('.notsubmit li').length == 0 && $('#record_audio_box li').length == 0) {
            layer.msg('批复不能为空');
            $('.areyok').hide();
            $('.areyok input:last-of-type').css('background', '#00ba97');
            return false;
        }

        if ($('.infoTitle span').css('color') == 'rgb(255, 106, 106)') {
            need.tag = '0'
        } else {
            need.tag = '1'
        }
        need.replyDesc = '';
        arr_s = arr_voice.concat(arr_image);
        need.fileInfo = arr_s;

        if($('.tea_sp .hmAnswer').length!=0){
            // alert("已批复长度"+$('.tea_sp .hmAnswer').length);
            for(var o = 0;o<$('.tea_sp .hmAnswer').length;o++){
                if ($('.tea_sp .hmAnswer').eq(o).find('.anDes').html() != undefined) {
                    if (o == $('.tea_sp .hmAnswer').length - 1) {
                        var curDesc = $('.answer textarea').val();
                        if (curDesc==""){
                            curDesc = " ";
                        }
                        need.replyDesc += encodeURI($('.tea_sp .hmAnswer').eq(o).find('.anDes').html()+'|>|'+curDesc);
                        alert($('.tea_sp .hmAnswer').eq(o).find('.anDes').html()+'|>|'+curDesc)
                    } else {
                        if($('.anDes').eq(o)){
                            need.replyDesc+= encodeURI($('.tea_sp .hmAnswer').eq(o).find('.anDes').html()+'|>|');
                        }else{
                            need.replyDesc+=' |>|'
                        }
                    }
                } else {
                    need.replyDesc += ' |>|';
                }

            }
            need.replyTimes = $('.tea_sp .hmAnswer').length + 1;
        }else{
            var curDesc = $('.answer textarea').val();
            if (curDesc==""){
                need.replyDesc = ' ';
            }else{
                need.replyDesc = encodeURI(curDesc);
            }
            need.replyTimes = '1'
        }

        ajax_S(homework_s.t_succ, need, function (e) {
            if (e.result == true) {
                $('.big_back').show();
                $('.succ').show();
                $('.areyok input:last-of-type').css('background', '#00ba97');
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


    var recordCount = 0;//判断语音录制条数
    //语音
    $('.Voice').on('touchend', function () {
        if (recordCount >= 3) {
            alert("最多录制三条语音");
        } else {
            $('.big_whit').show();
            $('.song_s').show();
        }
    });

    //按下开始录音
    var timeInedex = 0;
    var Index_s = -1;
    var timeds;
    var START;
    var END;
    var recordTimer;
    $('#record').on('touchstart', function (event) {
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
    var song_s = '';
    //松手结束录音
    $('#record').on('touchend', function (event) {
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
            },
            complete: function () {
                //接口调用完成（失败成功）

            },
            fail: function (res) {
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
                    layer.msg(e.msg);
                } else {
                    if (e.data.success) {
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
                    else {
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
                if (e.status == "failed") {
                    layer.msg("语音获取失败");
                } else {
                    //显示语音布局
                    showAudio(e.data.playTime, url_o + e.data.fullPath, $('#record_audio_box'), recordCount, 1);
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
    $(document).on('tap','.hwInfo img',function(){
        var previewUrl = $(this).attr('src');
        wx.previewImage({
            current: previewUrl, // 当前显示图片的http链接
            urls: [previewUrl] // 需要预览的图片http链接列表
        });
    });
    $(document).on('tap','.tea_sp img',function(){
        var previewUrl = $(this).attr('src');
        wx.previewImage({
            current: previewUrl, // 当前显示图片的http链接
            urls: [previewUrl] // 需要预览的图片http链接列表
        });
    });

    $('.pinch-zoom').each(function () {
        new RTP.PinchZoom($(this), {});
    });
    /*--------------------图片预览----------------------------------*/
    $(document).on('touchend', '.hmAnswer #imagBox_2 img', function () {
        $('.pinch-zoom-container').eq(0).show();
        $('.esc_s').show()
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
    // $('.big_back_s').on('touchend', function () {
    //     if($('.true_s').css('display')!='block'&&event.touches.length==0){
    //         $(this).find('canvas').hide();
    //         $(this).find('img').show();
    //         $(this).find('.esc_s').hide();
    //         $(this).find('.true_s').hide();
    //         $(this).find('span:last-of-type').show();
    //         $(this).hide();
    //         $('body').css('overflow', 'auto');
    //         $('body').css('overflow-x', 'hidden')
    //     }
    // });
    function stopDrop() {
        var lastY;//最后一次y坐标点
        $(document.body).on('touchstart', function(event) {
            lastY = event.originalEvent.changedTouches[0].clientY;//点击屏幕时记录最后一次Y度坐标。
        });
        $(document.body).on('touchmove', function(event) {
            var y = event.originalEvent.changedTouches[0].clientY;
            var st = $(this).scrollTop(); //滚动条高度
            if (y >= lastY && st <= 10) {//如果滚动条高度小于0，可以理解为到顶了，且是下拉情况下，阻止touchmove事件。
                lastY = y;
                event.preventDefault();
            }
            lastY = y;

        });
    }
    stopDrop();
    $('.esc_s').on('touchend', function () {
        clearInterval(time_s);

        $('.big_back_s').hide();
        $('.big_back_s canvas').hide();
        $('.big_back_s img').show();
        $('.big_back_s .true_s').hide();
        $('.big_back_s span:last-of-type').show();
        $('.big_back_s').hide();
        $('body').css('overflow-y', 'auto');
        $('.true_s').unbind('touchend');
    });
    $('.esc_s').show();
    var  time_s;
    $('.big_back_s span:last-of-type').on('touchend', function () {
        clearInterval(time_s);

        var width_ = parseInt($('.big_back_s img').css('width'));
        var height = parseInt($('.big_back_s img').css('height'));
        $(this).hide();
        $('.true_s').show();
        $('body').css('height', '100%');

        $('body').css('overflow', 'hidden');
        $('.esc_s').show();
        $('.pinch-zoom-container').eq(0).hide();
        var previewUrl = $('.big_back_s img').attr('src');
        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = previewUrl;
        var canvas = document.getElementById("myCanvas");

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
        $('#myCanvas').on('touchstart', function () {
            if(event.touches.length==1){
                clearInterval(time_s);
                time_s = setInterval(function(){
                $(window).scrollTop(0);
            },100);
            ctx.beginPath();
            ctx.moveTo(event.touches[0].pageX - canvas.offsetLeft, event.touches[0].pageY - canvas.offsetTop);
            $('#myCanvas').on('touchmove', function () {
                var ev = ev || event;
                ctx.lineTo(event.touches[0].pageX - canvas.offsetLeft, event.touches[0].pageY - canvas.offsetTop);
                ctx.stroke();
            });
            $('#myCanvas').on('touchend', function () {
                clearInterval(time_s);
                ctx.closePath();
                $('.big_back_s').show();
            });
            // upLoadWxImage(canvas.toDataURL("image/png"));
            }

        });

        $('.true_s').on('touchend', function () {
            $('.notsubmit .imgBox').show();
            $('.big_back_s canvas').hide();
            $('.big_back_s img').show();
            $('.big_back_s .esc_s').hide();
            $('.big_back_s .true_s').hide();
            $('.big_back_s span:last-of-type').show();
            $('.big_back_s').hide();
            $('body').css('overflow-y', 'auto');
            $('.true_s').unbind('touchend');
            clearInterval(time_s);
            $('.notsubmit .imgBox').append("<li><span class='stuImg' img-index='" + Index_Last + "'></span><img src='" + canvas.toDataURL("image/png") + "'/></li>");
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
        var tea = e.data.File.RevampFile;//老师批注
        var stu = e.data.File.StudentHomeworkFile;//学生答案
        var tea_t = e.data.File.TeacherHomeworkFile;//作业信息
        if (stu != undefined) {
            for (var a = 0; a < stu.length; a++) {
                if (stu[a].fileType == 'mp3') {
                    getAudioInfo([2, stu[a].diskFilePath, stu[a].playTime, "mp3"]);
                    // $('.big_ss').eq(1).append('<div class="music_s"><span>10"</span> <audio  src="http://dt.staff.xdf.cn/xdfdtmanager/mp3/you.mp3" id="bgMusic"></audio ></div>')
                } else {
                    $('.imgBox').eq(1).append('<div><img src="' + url_o + stu[a].url + '"alt="" /></div>')
                }
            }
        }
        if (tea_t != undefined) {
            for (var c = 0; c < tea_t.length; c++) {
                if (tea_t[c].fileType == 'mp3') {
                    getAudioInfo([1, tea_t[c].diskFilePath, tea_t[c].playTime, "mp3"]);
                    // $('.big_ss').eq(0).append('<div class="music_s"><span>10"</span> <audio  src="http://dt.staff.xdf.cn/xdfdtmanager/mp3/you.mp3" id="bgMusic"></audio ></div>')
                } else {
                    $('.imgBox').eq(0).append('<div><img src="' + tea_t[c].url + '" alt="" /></div>')

                }
            }
        }
        if (tea != undefined) {
            for (var b = 0; b < tea.length; b++) {
                $.each(tea[b],function (i,item) {
                    if (item.fileType == 'mp3') {
                        getAudioInfo([3, item.diskFilePath, item.playTime, "mp3"], ['replayT', parseInt(item.replyTimes - 1)]);
                    } else {
                        $('.tea_sp .hmAnswer:eq('+parseInt(item.replyTimes - 1)+')').find('.imgBox').append('<div><img src="'+item.url + '" alt="" /></div>');
                        // $('.imgBox').eq(2).append('<div><img src="'+tea[b].url + '" alt="" /></div>')
                    }
                });

            }
        }

    }


});
