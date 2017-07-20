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
    // alert(curIndex+"---"+classIndex);
    // var reqData = {
    //     'stuNum': 'SS5702' //学生编号
    // };
    // ajaxRequest('POST', homework_s.s_hwfl, reqData, getHwFinishInfosSuccess);
    var hwfinishInfos = JSON.parse(localStorage.finishhwInfos).data;
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
        //语音,图片
        $.each(datas.teaHomeworkFiles, function (i, paths) {
            var pathUrls = ['1', paths.diskFilePath, paths.fileType];
            // 获取语音和图片的预览地址 TODO
            console.log(pathUrls);
            if(paths.fileType.indexOf("mp3") != -1){
                getAudioInfo(pathUrls);
            }else {
                getFileInfo(pathUrls);
            }
        });
        /*******作业答案*******/
        $('.hmAnswer .anDes').html(datas.description);
        // 优秀
        if (datas.tag == 1) {
            $('.hw_status').addClass('hw_status_s');
        } else {
            $('.hw_status').removeClass('hw_status_s');
        }
        //语音,图片
        $.each(datas.stuHomeworkFiles, function (i, paths) {
            var pathUrls = ['2', paths.diskFilePath, paths.fileType];
            // 获取语音和图片的预览地址
            console.log(i + "---" + pathUrls);
            if(paths.fileType.indexOf("mp3") != -1){
                getAudioInfo(pathUrls);
            }else {
                getFileInfo(pathUrls);
            }
        });
        /*******老师批注*******/
        var pizhuHtml = "";
        if (datas.replyStatus == "0") {
            pizhuHtml = "暂无批注"
        } else {
            pizhuHtml = datas.replyDesc;
        }
        $('.comment .anDes').html(pizhuHtml);
        //语音，图片
        //语音,图片
        $.each(datas.teaHomeworkReplyFiles, function (i, paths) {
            var pathUrls = ['3', paths.diskFilePath, paths.fileType];
            // 获取语音和图片的预览地址
            console.log(pathUrls);
            if(paths.fileType.indexOf("mp3") != -1){
                getAudioInfo(pathUrls);
            }else {
                getFileInfo(pathUrls);
            }
        });
        layer.close(loading);
    }

    /*--------------------根据diskFileUrl从服务器获取文件地址--Start----------------------------------*/

    var voiceCount = 0;

    /**
     * 获取文件信息
     */
    function getFileInfo(fileArray) {
        // fileArray = ["1", "homework/b479a873299649a48d9741582a735450.jpg", "jpg"];
        var flag = fileArray[0];
        var fileType = fileArray[2];
        var diskFileUrl = fileArray[1];
        var netConfig = "IN";//DEFAULT/IN
        var optionFile = {"fullPath": diskFileUrl, "net": netConfig, "getAttribute": false};
        $.ajax({
            url: url_o + "upload/viewFileDetail.do",
            type: 'post',
            dataType: 'json',
            data: optionFile,
            success: function (e) {
                // alert(JSON.stringify(e));
                if (e.success == false) {
                    console.log(e.message);
                } else {
                    //将文件显示到布局中
                    showImage(e.fileUrl, "imagBox_" + flag);
                }
            }
        });
    }

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
                    showAudio(url_o+e.data, "audio_" + flag, "audio" + flag + "" + voiceCount);

                }
            }
        });
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

    /*--------------------图片预览----------------------------------*/
    $(document).on('touchend', '.imgBox img', function () {
        // alert("预览图片" + $(this).attr('src'));
        var previewUrl = $(this).attr('src');
        // if ($(this).attr('src').indexOf('weixin://') == -1&&$(this).attr('src').indexOf('http:') == -1) {
        //     previewUrl = 'http://dt.staff.xdf.cn/xdfdthome/homework/' + $(this).attr('src');
        // } else {
        //     previewUrl = $(this).attr('src');
        // }
        wx.previewImage({
            current: previewUrl, // 当前显示图片的http链接
            urls: [previewUrl] // 需要预览的图片http链接列表
        });
    });

});
