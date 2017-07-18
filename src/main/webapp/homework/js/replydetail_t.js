$(function(){

        var need = {
            'stuHomeworkId': sessionStorage.stuid,
            'homeworkTinfoId':sessionStorage.Tid

        };
        $('.anDes').html(sessionStorage.stutext);
        $('.kon p:last-of-type').html(sessionStorage.knowledgePoint);
        $('.hwCon').html(sessionStorage.description);
        $('.hwTeacherRankTitle').on('touchend',function(){
            if($('.hwInfo').css('display')=='none'){
                $('.hwInfo').show();
                $('.hwRankTitle').css('margin-bottom','0');
                $('.hwRankTitle').css('border-bottom','1px solid #ccc');

            }else{
                $('.hwInfo').hide();
                $('.hwRankTitle').css('margin-bottom','18px');
                $('.hwRankTitle').css('border-bottom','none');
            }
        })



        //输入验证
        $('.teBox').on('keyup',function(){
            $('.teacherword').html(''+$(this).val().length+'/200')
        });
        $('.teBox').on('blur',function(){
            $('.teacherword').html(''+$(this).val().length+'/200')
        });

        //优秀作业

        $('.infoTitle span').on('touchend',function(){
            if($(this).css('color')=='rgb(255, 106, 106)'){
                $(this).css({
                    'color':'#ccc',
                    'border':'1px solid #ccc'
                });
                $('.excellent').show();
                $('.excellent').append('<img src="images/excellent.gif" alt="">')
                setTimeout(function(){
                    $('.excellent').html('  ')
                },1000)
            }else{
                $(this).css({
                    'color':'#ff6a6a',
                    'border':'1px solid #ff6a6a'
                });
            }
        });


        //获取文件信息
        ajaxRequest('post',homework_s.t_modi,{Tcid:sessionStorage.Tid,Sdtid:sessionStorage.stuid},function(e){
            console.log(e);
            var stu = e.data.StudentHomeworkFile;
            var tea = e.data.TeacherHomeworkFile;

            for(var a  = 0;a<stu.length;a++){
                if(stu[a].fileType=='mp3'){
                    $('.big_ss').eq(1).append('<div class="music_s"><span>10"</span> <video  src="'+tea[b].previewUrl+'" id="bgMusic"></video ></div>')
                }else{
                    $('.imgBox').eq(1).append('<div><img src="'+tea[b].previewUrl+'" alt="" /></div>')
                }
            }
            for(var b  = 0;b<tea.length;b++){
                if(tea[b].fileType=='mp3'){
                    $('.big_ss').eq(0).append('<div class="music_s"><span>10"</span> <video  src="'+tea[b].previewUrl+'" id="bgMusic"></video ></div>')
                }else{
                    $('.imgBox').eq(0).append('<div><img src="'+tea[b].previewUrl+'" alt="" /></div>')
                }
            }
        });


        $(document).on('touchend','.music_s', function () {
                $(this).addClass('playing_s');
                var audio = document.getElementById("bgMusic");
                audio.play();
                console.log(audio.canPlayType("audio/mp3"));
                console.log(audio.readyState);
                if (audio.readyState==0) {
                    console.log("readyState");
                    audio.play();
                }
                setTimeout(function(){
                    $('.music_s').removeClass('playing_s');
                },$('.music_s span').html().substr(0,$('.music_s span').html().length-1)+'000');
            });


        //批改作业提交
        $('.sub_p').on('touchend',function(){
            if($(this).css('background')=='rgb(204, 204, 204) none repeat scroll 0% 0% / auto padding-box border-box'){
                layer.msg('正在提交，请稍等');
                return false;
            }
            if($('.teBox').val()==''){
                layer.msg('批复内容不能为空');
            }
            need.replyDesc = $('.teBox').html();
            if($('.infoTitle span').css('color')=='rgb(255, 106, 106)'){
                need.tag = '0'
            }else{
                need.tag = '1'
            }
            need.fileInfo = arr_s;
            need.replyDesc = $('.answer textarea').val();
            ajax_S(homework_s.t_succ,need,function(e){
                if (e.result == true) {
                    $('.big_back').show();
                    $('.succ').show();
                    $('.Submit_s').css('background','#00ba97');
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
            ajax_S(homework_s.t_succ,need,function(e){
                if (e.result == true) {
                    $('.big_back').show();
                    $('.succ').show();
                    $('.Submit_s').css('background','#00ba97');
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
            $(this).siblings('img').attr('src','images/speak.gif');
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
            $(this).siblings('img').attr('src','images/C04-03.png');
            event.preventDefault();
            wx.stopRecord({
                success: function (res) {
                    clearInterval(timeds);
                    if(timeds>1){
                        $('.big_s').append('<div class="music_s"><span></span> </div>');
                    }
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
        var arr_s = [];
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
                        arr_s.push({
                            'fileName':e.data.fileName,
                            'fileType':e.data.fileType,
                            'fileSize':e.data.fileSize,
                            'diskFilePath':e.data.diskFilePath
                        });
                        //显示语音布局
                        showAudio(e.data.fileUrl, e.data.fileSize);
                    }


                }
            });
        }

        //显示语音布局
        function showAudio(url, length) {
            $('.big_s .music_s').eq(Index_s).find('span').html(timeInedex + '"');
        }


        $(document).on('touchend','.music_s',function () {
            $(this).addClass('playing_s');
            playVoice(song_s);
            setTimeout(function(){
                $('.music_s').removeClass('playing_s');
            },$('.music_s').eq(Index_s).find('span').html().substr(0,$('.music_s').eq(Index_s).find('span').html().length-1)+'000');
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
                        arr_s.push({
                            'fileName':e.data.fileName,
                            'fileType':e.data.fileType,
                            'fileSize':e.data.fileSize,
                            'diskFilePath':e.data.diskFilePath
                        });

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