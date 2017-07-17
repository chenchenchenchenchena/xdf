/**
 * Created by use1 on 2017-07-10.
 */
$(function () {
    var layer1;
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
        var datas = hwfinishInfos[curIndex].lessNos[classIndex];
        localStorage.hwteacherId = datas.homeworkTinfoId;//老师主键id
        /*******作业信息*******/
        //知识点
        if (datas.teacherKnowledgePoint != "" && datas.teacherKnowledgePoint != null && datas.teacherKnowledgePoint != undefined) {
            knowledgePoint =splitStrs(datas.teacherKnowledgePoint);
            for (var i = 0; i < knowledgePoint.length; i++) {
                kpHtml = '<span>' + knowledgePoint[i] + '</span>';
                $('.knowPoint').append(kpHtml);
            }
        }
        //作业描述
        $('.des .hwCon').html(datas.teacherDes);
        //语音,图片
        $.each(datas.teaHomeworkFiles,function(i,paths){
            var pathUrls = ['1',paths.diskFilePath,paths.fileType];
            // 获取语音和图片的预览地址 TODO
            console.log(pathUrls);
            getFileInfo(pathUrls);
        });
        /*******作业答案*******/
        $('.hmAnswer .anDes').html(datas.description);
        //语音,图片
        $.each(datas.stuHomeworkFiles,function(i,paths){
            var pathUrls = ['2',paths.diskFilePath,paths.fileType];
            // 获取语音和图片的预览地址
            console.log(pathUrls);
            getFileInfo(pathUrls);
        });
        /*******老师批注*******/
        var pizhuHtml = "";
        if (datas.replyStatus=="0"){
            pizhuHtml = "暂无批注"
        }else{
            pizhuHtml = datas.replyDesc;
        }
        $('.comment .anDes').html(pizhuHtml);
        //语音，图片
        //语音,图片
        $.each(datas.teaHomeworkReplyFiles,function(i,paths){
            var pathUrls = ['3',paths.diskFilePath,paths.fileType];
            // 获取语音和图片的预览地址
            console.log(pathUrls);
            getFileInfo(pathUrls);
        });
    }
    // 图片预览
    $(document).on('touchend', '.imgBox>div>img', function () {
        alert("预览图片" + $(this).attr('src'));
        var previewUrl = "";
        if ($(this).attr('src').indexOf('weixin://') != -1) {
            previewUrl = $(this).attr('src');
        } else {
            previewUrl = 'http://dt.staff.xdf.cn/xdfdthome/homework/' + $(this).attr('src');
        }
        wx.previewImage({
            current: previewUrl, // 当前显示图片的http链接
            urls: [previewUrl] // 需要预览的图片http链接列表
        });
    });

    /*--------------------根据diskFileUrl从服务器获取文件地址--Start----------------------------------*/

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
                    alert(e.message);
                } else {
                    //将文件显示到布局中
                    if (fileType.indexOf("mp3") != -1) {
                        showAudio(e.fileUrl, e.fileSize, "audio_" + flag, "audio" + flag);
                    } else {
                        showImage(e.thumbnail, "imagBox_" + flag);
                    }
                }
            }
        });
    }

    /**
     * 显示语音布局
     */
    function showAudio(url, length, idParent, idChildren) {

        $('#'+idParent).show();
        length = "";
        var strVoice = "<div><audio id='" + idChildren + "'preload='auto'><source src='" + url + "' type='audio/mpeg'></audio>" +
            "<i class='play-icon'></i></div><span class='voice_lenth'>" + length + "</span>";

        $('#'+idParent).html(strVoice);
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
            $('#' + idChildren).parent('div').siblings('.voice_lenth').html(voiceLen);
        }

    }


    /**
     * 显示获取到的图片
     */
    function showImage(previewUrl, imageId) {
        $('#'+imageId).show();
        var str = "";
        str += "<div class = 'imgBox'>";
        str += "<div><img src='" + previewUrl + "'/></div>";
        str += "</div>";
        $('#'+imageId).html(str);
    }

});
/* //超出字数
 layer.open({
 type: 1,
 area: ['310px', '195px'],
 shade: [0.1, '#fff'],
 title: false,
 skin: 'tips',
 content:$("#alert")
 });*/

/* //提交成功
 layer.open({
 type: 1,
 area: ['548px', '345px'],
 shade:[0.2,'#000'],
 title:'',
 skin: '',
 content:$(".submitBox")
 });*/

/* //提交失败
 layer.open({
 type: 1,
 area: ['548px', '345px'],
 shade:[0.2,'#000'],
 title:'',
 skin: '',
 content:$(".submitFail")
 })*/
