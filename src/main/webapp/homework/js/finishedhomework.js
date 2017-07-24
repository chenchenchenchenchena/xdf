/**
 * Created by use1 on 2017-07-10.
 */
$(function () {
    var layer1, loading;
    //点击作业排行榜
    $(document).on('touchend', '.hwRankTitle', function () {
        window.location.href = "studentrank_s.html";
    });
    // 显示作业信息
    var curIndex = GetRequest("curIndex");//课程index
    var classIndex = GetRequest("classIndex");//课次index
    var hwfinishInfos = JSON.parse(localStorage.finishhwInfos).data;
    var replyStatus="";//老师批复状态
    var recordCount = 0;
    // 显示作业信息
    getHwFinishInfos();
    function getHwFinishInfos() {
        loading = layer.load();
        var datas = hwfinishInfos[curIndex].lessNos[classIndex];
        localStorage.hwteacherId = datas.homeworkTinfoId;//老师主键id
        /*******作业信息*******/
        //知识点
        if (datas.teacherKnowledgePoint != "" && datas.teacherKnowledgePoint != null && datas.teacherKnowledgePoint != undefined) {
            knowledgePoint = splitStrs(datas.teacherKnowledgePoint);
            for (var i = 0; i < knowledgePoint.length; i++) {
                kpHtml = '<span>' + knowledgePoint[i] + '</span>';
                $('.knowPoint').append(kpHtml);
            }
        }
        //作业描述
        $('.des .hwCon').html(decodeURI(datas.teacherDes));
        // 判断是否批复，未批复可重新提交答案
        replyStatus = datas.replyStatus;
        var myAnswerDes = decodeURI(datas.description);
        if(replyStatus==1){//已批复
            $('.answer').hide();

            /*******作业答案*******/
            if(myAnswerDes!=""){
                $('.hmAnswer .anDes').html(myAnswerDes).show();
            }else{
                $('.hmAnswer .anDes').hide();
            }

            // 优秀
            if (datas.tag == 1) {
                $('.hw_status').addClass('hw_status_s');
            } else {
                $('.hw_status').removeClass('hw_status_s');
            }
            /*******老师批注*******/
            var pizhuHtml = "";
            if (datas.replyStatus == "0") {
                pizhuHtml = "暂无批注"
            } else {
                pizhuHtml = datas.replyDesc;
            }
            $('.comment .anDes').html(decodeURI(pizhuHtml));
            $('.hmAnswer,.comment').show();
        }else{
            $('.hmAnswer,.comment').hide();
            if(myAnswerDes!=""){
                $('.teBox').val(myAnswerDes);
            }
            console.log("888--"+$('.teBox').val());
            $('.answer').show();
        }


        //语音，图片
        var allFilePath = {
            "fileSfullPath": [],//学生作业文件云盘全路径
            "fileTfullPath": [],//老师作业文件云盘全路径
            "fileRfullPath": []//老师回复作业文件云盘全路径
        };
        if (datas.teaHomeworkFiles.length > 0 || datas.stuHomeworkFiles.length > 0 || datas.teaHomeworkReplyFiles.length > 0) {
            //老师作业信息---语音，图片
            $.each(datas.teaHomeworkFiles, function (i, paths) {
                allFilePath.fileTfullPath.push({"fullPath": paths.diskFilePath});
            });
            //学生答案信息--语音，图片
            $.each(datas.stuHomeworkFiles, function (i, paths) {
                allFilePath.fileSfullPath.push({"fullPath": paths.diskFilePath});
            });
            //老师批复作业信息---语音，图片
            $.each(datas.teaHomeworkReplyFiles, function (i, paths) {
                allFilePath.fileRfullPath.push({"fullPath": paths.diskFilePath});
            });
            console.log("获取文件排序" + JSON.stringify(allFilePath));
            ajaxRequest('POST', homework_s.s_fileRank, JSON.stringify(allFilePath), getAllFileRankSuccess);
        }
        layer.close(loading);
    }


    var voiceCount = 0;
    //获取文件信息
    function getAllFileRankSuccess(msg) {
        if (msg.code == 200) {
            //获取老师作业信息
            if (msg.data.fileT != "" && msg.data.fileT != null && msg.data.fileT != undefined) {
                $.each(msg.data.fileT, function (i, paths) {
                    // 获取语音和图片的预览地址
                    // paths.fileType = 'jpg';
                    var pathUrls = ['1', paths.diskFilePath, paths.fileType];
                    if(paths.fileType!= undefined){
                        if (paths.fileType.indexOf("mp3") != -1) {
                            //将文件显示到布局中
                            voiceCount++;
                            showAudio(url_o + paths.diskFilePath, "audio_" + 1, "audio" + 1 + "" + voiceCount);
                        } else {
                            //将文件显示到布局中
                            showImage(paths.fileUrl, "imagBox_" + 1);
                        }
                    }

                });
            }
            //获取学生作业答案
            if (msg.data.fileS != "" && msg.data.fileS != null && msg.data.fileS != undefined) {
                var str = "";//添加图片html
                $.each(msg.data.fileS, function (i, paths) {
                    var pathUrls = ['2', paths.diskFilePath, paths.fileType];
                    // 获取语音和图片的预览地址
                    console.log(i + "---" + pathUrls);
                    if (paths.fileType.indexOf("mp3") != -1) {
                        if(replyStatus==1){//已批复
                            voiceCount++;
                            showAudio(url_o + paths.diskFilePath, "audio_" + 2, "audio" + 2 + "" + voiceCount);
                        }else{
                            //显示语音布局
                            showAudio2(url_o + paths.diskFilePath, $('#record_audio_box'), recordCount, 1);
                            recordCount++;
                        }
                    } else {
                        //将图片文件显示到布局中
                        if(replyStatus==1) {//已批复
                            showImage(paths.fileUrl, "imagBox_" + 2);
                        }else{
                            str += "<li><span class='stuImg' img-index='" + i + "'></span><img src='" + paths.fileUrl + "'/></li>";
                            $(".notsubmit .imgBox").show();
                            $(".notsubmit .imgBox").html(str);
                            //界面样式控制
                            if (i >= 3) {
                                $('#chooseImage').hide();
                            }
                        }
                    }
                });
            }
            //获取老师批注
            if (msg.data.fileR != "" && msg.data.fileR != null && msg.data.fileR != undefined) {
                $.each(msg.data.fileR, function (i, paths) {
                    var pathUrls = ['3', paths.diskFilePath, paths.fileType];
                    // 获取语音和图片的预览地址
                    console.log(pathUrls);
                    if (paths.fileType.indexOf("mp3") != -1) {
                        voiceCount++;
                        showAudio(url_o + paths.diskFilePath, "audio_" + 3, "audio" + 3 + "" + voiceCount);
                    } else {
                        //将文件显示到布局中
                        showImage(paths.fileUrl, "imagBox_" + 3);
                    }
                });
            }
        } else {
            alert("获取文件失败");
        }
    }

    /**
     * 显示语音布局
     */
    function showAudio(url, idParent, idChildren) {

        $('#' + idParent).show();
        var length = "";
        var strVoice = "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto'><source src='" + url + "' type='audio/mpeg'></audio>" +
            "<i class='play-icon'></i></div><span class='voice_lenth'>" + length + "</span></li>";

        $('#' + idParent).append(strVoice);
        var audioElem = document.getElementById(idChildren);
        audioElem.onloadedmetadata = getVoiceLen;
        function getVoiceLen() {
            var len = audioElem.duration;
            len = parseInt(len);
            var hh = parseInt(len / 3600);
            var mm = parseInt((len % 3600) / 60);
            var ss = parseInt((len % 3600) % 60);
            var voiceLen = "";
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

    }


    /**
     * 显示获取到的图片
     */
    function showImage(previewUrl, imageId) {
        $('#' + imageId).show();
        var str = "";
        str += "<div class = 'imgBox'>";
        str += "<div><img src='" + previewUrl + "'/></div>";
        str += "</div>";
        $('#' + imageId).append(str);
    }
    /**
     * 显示语音布局
     */
    function showAudio2(url, parentId, id, flag) {

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

});
