$(function () {
    var arr_s = [];
    var arr_voice = [];
    var arr_image = [];
    var recordCount = 0;//判断录制语音的条数
    var imgCount = 0;
    $('.load_t').show();

    if (imgCount >= 3) {
        $('#image_s').hide();
    } else {
        $('#image_s').show();
    }

    var urlPush = '';
    if(getRequest('state').state=='JT'||sessionStorage.signal){
        urlPush=url_o2+"/xdfdthome/homework/homeworklist_t.html?state=JT";
    }else{
        urlPush=url_o2+"/xdfdthome/homework/homeworklist_t.html";
    }
    var trardata = {
        'teacherCode': localStorage.teacherId,
        'schoolId': localStorage.schoolId,
        'email': localStorage.terEmail
    };
    var homeworksubm = {
        'teacherEmail': localStorage.terEmail,
        'teacherName': localStorage.teacherName,
        'schoolId': localStorage.schoolId,
        'appid': Global.appid,
        'secret': Global.secret,
        'url': urlPush,
        'templateId': TemplateId_home
    };
    var layer1, layer2, loading;


    //设置当天默认值
    $('.time_S i').html(new Date().format("yyyy-MM-dd"));
    //获取班级信息
    ajax_S(homework_s.t_clas, trardata, function (e) {
        var className = e.data;
        for (var a = 0; a < className.length; a++) {
            $('.class_name ul').append('<li classCode="' + className[a].ClassCode + '" style="white-space:nowrap;overflow-x:auto;"><img src="images/C05_06.png" alt=""><b style="font-weight:normal;"><span>'+ className[a].ClassName + '</span>（'+className[a].ClassCode+'）</b></li>')
        }
        if (sessionStorage.Classname_x) {


            ajaxRequest('post', homework_s.t_seac, {'Tcid': sessionStorage.id_x}, function (e) {
                $('.class_s i').html('已选择1个班' + e.data.className + ';');
                $('.time_S i').html(e.data.homeworkTime);
                $('.class_name i').html('1');
                $('.Knowledge input').val(decodeURIComponent(e.data.knowledgePoint));
                $('.home_text textarea').val(decodeURIComponent(e.data.description));
                classCode = e.data.classCode;

                $('.class_s').unbind();
                $('.class_name li').each(function () {
                    if ($(this).attr('classcode') == classCode) {
                        $(this).find('img').attr('src', 'images/C0503.png')
                    }
                });
                console.log(e)
                var tea = e.data.TeahFile;
                for (var b = 0; b < tea.length; b++) {
                    if (tea[b].fileType == 'mp3') {
                        arr_voice.push({
                            'fileName': tea[b].fileName,
                            'fileType': tea[b].fileType,
                            'fileSize': tea[b].fileSize,
                            'diskFilePath': tea[b].diskFilePath,
                            'id': tea[b].id
                        });
                        showAudio(tea[b].playTime, url_o + tea[b].diskFilePath, $('#record_audio_box'), recordCount);
                        recordCount++;
                        // $('.big_s').eq(0).append('<div class="music_s" onclick="PlaySound(bgMusic' + b + ')"  fileName="' + tea[b].fileName + '" fileType="' + tea[b].fileType + '" fileSize="' + tea[b].fileSize + '" diskFilePath="' + tea[b].diskFilePath + '"><span>10"</span> <audio  src="' + tea[b].previewUrl + '" id="bgMusic' + b + '"  controls="controls" preload="auto"></audio ></div>')
                    } else {
                        arr_image.push({
                            'fileName': tea[b].fileName,
                            'fileType': tea[b].fileType,
                            'fileSize': tea[b].fileSize,
                            'diskFilePath': tea[b].diskFilePath,
                            'id': tea[b].id
                        });
                        showUpdataImage(tea[b].url);
                        // $('.imgBox').show();
                        // $('.imgBox').eq(0).append('<img src="' + tea[b].thumbnail + '" alt="" fileName="' + tea[b].fileName + '" fileType="' + tea[b].fileType + '" fileSize="' + tea[b].fileSize + '" diskFilePath="' + tea[b].diskFilePath + '"/>')
                    }
                }
            });
        }
    $('.load_t').hide();

    });

    function showUpdataImage(url) {

        var str = "<li><span class='stuImg' img-index='" + imgCount + "'></span><img src='" + url + "'/></li>";

        $(".notsubmit .imgBox").show();
        $(".notsubmit .imgBox").append(str);

        imgCount++;
        //界面样式控制
        if (imgCount >= 3) {
            $('.image_s').hide();
        }

    }
    //选择班
    $('.class_s').on('touchend click', function () {
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
                className += $(this).find('span').text() + '；';
                classCode += $(this).attr('ClassCode') + ',';
            }
        });
        classCode = classCode.substr(0, classCode.length - 1);
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
            $('.class_name').hide();
        } else {
            $('.class_s i').html('');
        }
    });


    //作业描述验证
    $('.home_text textarea').on('keyup', function () {
        if($(this).val().indexOf('"')!=-1){
            $(this).val($(this).val().substr(0,$(this).val().length-1)+'“”')
        }
        if ($(this).val().length > 200) {
            $('.home_text span').css('color', 'red');
            $(this).val($(this).val().substring(0, 200));
        } else {
            $('.home_text span').css('color', '#808080');
        }
        $('.home_text span').html('' + $(this).val().length + '/200')
    });
    $('.home_text textarea').on('blur', function () {
        if ($(this).val().length > 200) {
            $('.home_text span').css('color', 'red');
            $(this).val($(this).val().substring(0, 200));
        } else {
            $('.home_text span').css('color', '#808080');
        }
        $('.home_text span').html('' + $(this).val().length + '/200')
    });
    //知识点验证
    $('.Knowledge input').on('keyup', function () {
        if($(this).val().indexOf('"')!=-1){
            layer.msg('请输入中文双引号')
            $(this).val($(this).val().substr(0,$(this).val().length-1))
        }
        var html_ = $(this).val();
        var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
        if (regStr.test(html_)) {
            $(this).val(html_.replace(regStr, ""));
        }
        if(html_.length>10){
            if(html_.indexOf(',')!=-1||html_.indexOf(';')!=-1||html_.indexOf('，')!=-1||html_.indexOf('；')!=-1){
                if(html_.length>21){
                    $(this).val($(this).val().substring(0,21))
                }
                return false;
            }
            $(this).val($(this).val().substring(0,10))
        }

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
    //提交确认
    $('.Submit_s').on('touchend', function () {
        $('.big_back').show();
        $('.areyok').show();
    });
    $('.areyok input:first-of-type').on('touchend', function () {
        $(".areyok").hide()
    });
    //提交作业
    $('.areyok input:last-of-type').on('touchend', function () {
        if ($(this).css('background') == 'rgb(204, 204, 204) none repeat scroll 0% 0% / auto padding-box border-box') {
            layer.msg('正在提交，请稍等');
            return false;
        }
        $(this).css('background','rgb(204, 204, 204) none repeat scroll 0% 0% / auto padding-box border-box');
        if ($('.class_s i').html() == '') {
            $('.areyok').hide();
            $('.areyok input:last-of-type').css('background', '#00ba97');
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classEmpty")
            });
            setTimeout(function(){
                $('.big_back').hide();
            },2000)
            return false;
        }
        if ($('.time_S i').html() == '') {
            $('.areyok').hide();
            $('.areyok input:last-of-type').css('background', '#00ba97');
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classTime")
            });
            setTimeout(function(){
                $('.big_back').hide();
            },2000)
            return false;
        }
        if ($('.Knowledge input').val() == '') {
            $('.areyok').hide();
            $('.areyok input:last-of-type').css('background', '#00ba97');
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classKnow")
            });
            setTimeout(function(){
                $('.big_back').hide();
            },2000)
            return false;
        }
        if ($('.home_text textarea').val() == '') {
            $('.areyok').hide();
            $('.areyok input:last-of-type').css('background', '#00ba97');
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classHome")
            });
            setTimeout(function(){
                $('.big_back').hide();
            },2000)
            return false;
        }
        if ($('.home_text span').css('color') == 'rgb(255, 0, 0)') {
            $('.areyok').hide();
            $('.areyok input:last-of-type').css('background', '#00ba97');
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classText")
            });
            setTimeout(function(){
                $('.big_back').hide();
            },2000)
            return false;
        }
        if ($('.Knowledge input').val().indexOf(',') != -1) {
            $('.areyok').hide();
            $('.areyok input:last-of-type').css('background', '#00ba97');
            var html_te = $('.Knowledge input').val().substring(0, $('.Knowledge input').val().indexOf(','));
            if (html_te.length > 10) {
                layer.msg('单条知识点最多输入10个字');
                return false;
            }
        } else if ($('.Knowledge input').val().indexOf(';') != -1) {
            $('.areyok').hide();
            $('.areyok input:last-of-type').css('background', '#00ba97');
            var html_te = $('.Knowledge input').val().substring(0, $('.Knowledge input').val().indexOf(';'));
            if (html_te.length > 10) {
                layer.msg('单条知识点最多输入10个字');
                return false;
            }
        } else if ($('.Knowledge input').val().indexOf('，') != -1) {
            $('.areyok').hide();
            $('.areyok input:last-of-type').css('background', '#00ba97');
            var html_te = $('.Knowledge input').val().substring(0, $('.Knowledge input').val().indexOf('，'));
            if (html_te.length > 10) {
                layer.msg('单条知识点最多输入10个字');
                return false;
            }
        } else if ($('.Knowledge input').val().indexOf('；') != -1) {
            $('.areyok').hide();
            $('.areyok input:last-of-type').css('background', '#00ba97');
            var html_te = $('.Knowledge input').val().substring(0, $('.Knowledge input').val().indexOf('；'));
            if (html_te.length > 10) {
                layer.msg('单条知识点最多输入10个字');
                return false;
            }
        } else {
            var html_te = $('.Knowledge input').val();
            if (html_te.length > 10) {
                $('.areyok').hide();
                $('.areyok input:last-of-type').css('background', '#00ba97');
                layer.msg('单条知识点最多输入10个字');
                return false;
            }
        }
        if (sessionStorage.Classname_x) {
            arr_s = arr_voice.concat(arr_image);
            var errohome = {};
            errohome.knowledgePoint = encodeURIComponent($('.Knowledge input').val()).replace(/'\+'/,'%20');
            errohome.id = sessionStorage.id_x;
            errohome.description = encodeURIComponent($('.home_text textarea').val()).replace(/'\+'/,'%20');
            errohome.fileInfo = arr_s;
            ajax_S(homework_s.t_erro, errohome, function (e) {
                // ajax_S("http://10.73.32.97:8080/xdfdtmanager/teacherData/updateTeaHomework.do", errohome, function (e) {
                if (e.result == true) {
                    $('.areyok input:last-of-type').css('background','#00ba97');
                    $('.big_back').show();
                    $('.succ').show();
                    $('.areyok').hide();
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
            var class_c = classCode;
            var class_n = className.replace(/\；/g, ',').substr(0, className.length - 1);
            arr_s = arr_voice.concat(arr_image);
            homeworksubm.classCode = class_c;
            homeworksubm.className = class_n;
            homeworksubm.homeworkTime = $('.time_S i').html();
            homeworksubm.knowledgePoint = encodeURIComponent($('.Knowledge input').val()).replace(/'\+'/,'%20');
            homeworksubm.description = encodeURIComponent($('.home_text textarea').val()).replace(/'\+'/,'%20');
            homeworksubm.fileInfo = arr_s;
            ajax_S(homework_s.t_sbim, homeworksubm, function (e) {
                $('.areyok input:last-of-type').css('background','#00ba97');
                $('.Submit_s').css('background', '#ccc');
                if (e.result == true) {
                    $('.areyok').hide();
                    $('.big_back').show();
                    $('.succ').show();
                    $('.Submit_s').css('background', '#00ba97');
                } else {
                    $('.areyok').hide();
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
                $('.class_name').hide();
            }, 300);
            if ($('.class_s i').html() == '') {
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
        $('.big_back').hide();
    });


    //按下开始录音
    var timeInedex = 0;
    var recordTimer;
    var isCanStopRecord = false;
    var isCanStartRecord = true;
    //语音
    $('.Voice').on('touchend', function () {
        if (recordCount >= 3) {
            layer.msg("最多录制三条语音");
        } else {
            if (classCode == "") {
                layer.open({
                    type: 1,
                    area: ['312px', '194px'],
                    shade: 0,
                    title: '',
                    skin: '',
                    time: 3000,
                    content: $(".classEmpty")
                })
            } else {
                $('.big_whit').show();
                $('.song_s').show();
                $('.big_back').show();
            }
        }
    });
    var START = "";
    var END = "";
    $('#record').on('touchstart', function (event) {
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
                        $('.big_back').hide();
                        this_.siblings('img').attr('src', 'images/C04-03.png');
                        isCanStartRecord = true;
                        isCanStopRecord = false;
                    },
                    fail: function(){
                        clearInterval(recordTimer);
                        $('.song_s').hide();
                        $('.big_whit').hide();
                        $('.big_back').hide();
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
                        $('.big_back').hide();
                        this_.siblings('img').attr('src', 'images/C04-03.png');
                        isCanStartRecord = true;
                        isCanStopRecord = false;
                    },
                    fail: function(){
                        clearInterval(recordTimer);
                        $('.song_s').hide();
                        $('.big_whit').hide();
                        $('.big_back').hide();
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
    var song_s = '';
    //松手结束录音
    $('#record').on('touchend', function (event) {

        var this_ = $(this);
        if (timeInedex == 0) {
            setTimeout(function () {

                END = new Date().getTime();
                if ((END - START) < 1500 ) {
                    END = 0;
                    START = 0;
                    //小于1000ms，不录音
                    clearTimeout(recordTimer);
                    wx.stopRecord({
                        success: function (res) {
                            clearInterval(recordTimer);
                            $('.song_s').hide();
                            $('.big_whit').hide();
                            $('.big_back').hide();
                            this_.siblings('img').attr('src', 'images/C04-03.png');
                            isCanStartRecord = true;
                            isCanStopRecord = false;
                            layer.msg("录制时间太短");
                        },
                        fail: function(){
                            layer.msg("录制时间太短");
                            clearInterval(recordTimer);
                            $('.song_s').hide();
                            $('.big_whit').hide();
                            $('.big_back').hide();
                            this_.siblings('img').attr('src', 'images/C04-03.png');
                            isCanStartRecord = true;
                            isCanStopRecord = false;
                        }
                    });
                    return;
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
            return false;
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
        //    return false;
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
                $('.big_back').hide();
                isCanStartRecord = true;
                isCanStopRecord = false;
            }
        });
    }

    //上传微信服务器，获取保存的serverId
    function uploadVoiceWX(upId) {
        $('.big_back').show();
        //调用微信的上传录音接口把本地录音先上传到微信的服务器
        //不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
        wx.uploadVoice({
            localId: upId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                // alert(JSON.stringify(res));
                //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
                var serverId = res.serverId;
                uploadVoice(serverId);
            },
            complete: function () {
                //接口调用完成（失败成功）
                $('.big_back').hide();

            },fail:function () {
                //接口调用完成（失败）
                $('.big_back').hide();
                layer.msg("微信上传失败，请重新录制");
            }
        });
    }

    //将serverId上传到自己服务器
    function uploadVoice(serverId) {
        var cbconfig = {
            'appId': appId,
            'appSecret': secreT,
            'mediaId': serverId,
            'schoolId': localStorage.schoolId,
            'classId': classCode.split(',')[0]
        };
        $.ajax({
            url: url_o + "upload/uploadAudio.do",
            type: 'post',
            dataType: 'json',
            data: cbconfig,
            success: function (e) {
                $('.big_back').hide();
                if (e.status == "failure") {
                    layer.msg(e.msg);
                } else {
                    if (e.data.success) {
                        $('.teBox').val(e.data.fileUrl);
                        arr_voice.push({
                            'fileName': e.data.fileName,
                            'fileType': e.data.fileType,
                            'fileSize': e.data.fileSize,
                            'diskFilePath': e.data.diskFilePath,
                            'id': ""
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
     * @param diskFileUrl "fullPath": "homeworktest/73/HDXP3EB03/2017-07-27/fb628707b69a421d945cab3e5e23ff71.mp3"
     */
    function getRecordInfo(diskFileUrl) {
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
                    showAudio(e.data.playTime, url_o + e.data.fullPath, $('#record_audio_box'), recordCount);
                    recordCount++;

                }
            }
        });
    }

    /**
     * 显示录制语音布局
     * @param playTime 语音播放时间
     * @param url 语音播放地址
     * @param parentId 语音布局文件需要添加的父节点
     * @param id 给要添加的audio标签添加id
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
        //录音布局，可以删除
        strVoice += "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto' data-time='"+playTime+"'><source src='" + url + "' type='audio/mpeg'></audio>" +
            "<i class='play-icon'></i><span class='stuVoice'></span></div><span class='voice_lenth'>" + voiceLen + "</span></li>";

        parentId.append(strVoice);

        $('.song_s,.mask').hide();
        $('.big_back').hide();
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

    //图片上传
    $('.image_s').click(function () {
        if (classCode == "") {
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classEmpty")
            })
        } else {
            //重新选择图片，清除之前数据
            var count = 3 - imgCount;
            wx.chooseImage({
                count: count,
                success: function (res) {

                    if (res.localIds.length > 0) {

                        // for (var i = 0; i < res.localIds.length; i++) {
                        //
                        //     showUpdataImage(res.localIds[i]);
                        //
                        // }
                        //上传服务器
                        upLoadWxImage(res);
                    }


                }
            });
        }
    });

    /**
     * 上传微信服务器
     * @param images
     */
    function upLoadWxImage(images) {

        if (images.localIds.length == 0) {
            layer1.msg('请先选择图片');
            return;
        }

        var i = 0, length = images.localIds.length;
        $('.big_back').show();
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
            'classId': classCode.split(',')[0]
        };
        $.ajax({
            url: url_o + "upload/uploadFileByWeiChat.do",
            type: 'post',
            dataType: 'json',
            data: cbconfig,
            success: function (e) {
                $('.big_back').hide();
                if (e.status == "failure") {
                    layer.msg('图片上传失败');
                } else if (e.status == "succeed") {

                    showUpdataImage(localID);
                    arr_image.push({
                        'fileName': e.data.fileName,
                        'fileType': e.data.fileType,
                        'fileSize': e.data.fileSize,
                        'diskFilePath': e.data.diskFilePath,
                        'id': ""
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
        if ($('.notsubmit .imgBox').find('li').length <= 1) {
            $('.notsubmit .imgBox').hide();
        }

        $('.imgBox li:eq(' + index + ')').remove();
        // 图片小于三张，显示添加图片按钮
        if ($('.notsubmit .imgBox').children('div').length < 3) {
            $('.image_s').show();
        }
        if (arr_image.length > 0) {
            arr_image.splice(index, 1);
            imgCount--;
        }
    });
    /*--------------------图片预览----------------------------------*/
    $(document).on('tap', '.imgBox img', function () {
        var previewUrl = $(this).attr('src');
        // if ($(this).attr('src').indexOf('weixin://') != -1&&$(this).attr('src').indexOf('http:') != -1) {
        //     previewUrl = $(this).attr('src');
        // } else {
        //     previewUrl = 'http://dt.staff.xdf.cn/xdfdthome/homework/' + $(this).attr('src');
        // }
        wx.previewImage({
            current: previewUrl, // 当前显示图片的http链接
            urls: [previewUrl] // 需要预览的图片http链接列表
        });
    });
    $('body').css('overflow-y', 'auto')
});


window.addEventListener("beforeunload", function (event) {
    sessionStorage.removeItem('Classname_x');
});