/**
 * Created by use1 on 2017-07-10.
 */
$(function () {
    /**
     * 作业提交需要的参数
     */
    var fileParams = [];
    var voiceFileParams = [];
    var homeworkSinfoId = GetRequest('id');
    var fileName;
    var fileType;
    var fileSize;
    var diskFilePath;
    var uploadUser = sessionStorage.studentName;
    var layer1, layer2, loading;
    // //点击作业排行榜
    $(document).on('touchend', '.hwRankTitle', function () {
        window.location.href = "studentrank_s.html";
    });
    var hwInfos = JSON.parse(localStorage.homeworkInfos).data;
    gethwInfos();
    function gethwInfos() {
        loading = layer.load();
        var knowledgePoint, kpHtml;
        $.each(hwInfos, function (i, item) {
            if (item.id == GetRequest('id')) {
                localStorage.hwteacherId = item.homeworkTId;//老师主键id
                localStorage.hwstudentId = item.id;//学生主键id
                localStorage.classCode = item.classCode;//学生code

                //知识点
                if (item.knowledgePoint != "" && item.knowledgePoint != null && item.knowledgePoint != undefined) {
                    knowledgePoint = splitStrs(item.knowledgePoint);
                    for (var i = 0; i < knowledgePoint.length; i++) {
                        kpHtml = '<span>' + knowledgePoint[i] + '</span>';
                        $('.knowPoint').append(kpHtml);
                    }
                }
                //作业描述
                $('.hwCon').html(decodeURI(item.description));
                //语音，图片 TODO
                //语音，图片 TODO
                var allFilePath = {
                    "fileSfullPath": [],
                    "fileTfullPath": [],
                    "fileRfullPath": []
                };
                if(item.fileContents.length>0){
                    $.each(item.fileContents, function (i, paths) {
                        allFilePath.fileTfullPath.push({"fullPath":paths.diskFilePath});
                    });
                    console.log("获取文件排序"+JSON.stringify(allFilePath));
                    ajaxRequest('POST', homework_s.s_fileRank, JSON.stringify(allFilePath), getAllFileRankSuccess);
                }
                return false;
            }

        });
        layer.close(loading);
    }

    var audioCount = 0;

    function getAllFileRankSuccess(msg) {
        if (msg.code == 200) {
            //获取老师作业信息
            if (msg.data.fileT != "" && msg.data.fileT != null && msg.data.fileT != undefined) {
                $.each(msg.data.fileT, function (i, paths) {
                    var pathUrls = ['1', paths.diskFilePath, paths.fileType];
                    // 获取语音和图片的预览地址 TODO
                    console.log(pathUrls);
                    // paths.fileType = 'jpg';
                    console.log(paths.diskFilePath);
                    if (paths.fileType.indexOf("mp3") != -1) {
                        //将文件显示到布局中
                        showAudio(url_o + paths.relativePath, $('#audio_box'), audioCount, 2);
                        audioCount++;
                    } else {
                        //显示老师作业信息图片
                        showImage(paths.fileUrl);
                    }
                });
            }
        } else {
            alert("获取文件失败");
        }
    }


    /**
     * 显示获取到的作业信息图片
     */
    function showImage(previewUrl) {
        $('#imagBox_1').show();
        var str = "";
        str += "<div class = 'imgBox'>";
        str += "<div><img src='" + previewUrl + "'/></div>";
        str += "</div>";
        $('#imagBox_1').append(str);

    }
    /*------------------录制语音结束------------------------------------*/
})