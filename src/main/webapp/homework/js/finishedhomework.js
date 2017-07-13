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
    var reqData = {
        'stuNum': 'SS5702' //学生编号
    };
    ajaxRequest('POST', homework_s.s_hwfl, reqData, getHwFinishInfosSuccess);

    function getHwFinishInfosSuccess(msg) {
        var msg = {
            "code": "200",
            "data": [
                {
                    "readStatus": 0,
                    "lessNos": [
                        {
                            "id": "022765ae376a4feab2ce64777050474f",
                            "teaHomeworkReplyFiles": [
                                {
                                    "diskFilePath": "homework/73/HDXP5MB01/0711",
                                    "fileName": "文件1",
                                    "fileSize": "12345",
                                    "fileType": "jpg",
                                    "id": "c572b982b22149a5ab2e5d98650a3e3c",
                                    "uploadTime": 1499773427000
                                },
                                {
                                    "diskFilePath": "homework/73/HDXU3PB01/0711",
                                    "fileName": "文件1",
                                    "fileSize": "23564",
                                    "fileType": "MP3",
                                    "id": "c84c4da06da9470283588366812f7d01",
                                    "uploadTime": 1499773427000
                                }
                            ],
                            "teacherDes": "这是测试数据",
                            "stuHomeworkFiles": [
                                {
                                    "diskFilePath": "aaa/bbb/ccc",
                                    "fileName": "学生作业",
                                    "fileSize": "3356",
                                    "fileType": "jpg",
                                    "homeworkSinfoId": "022765ae376a4feab2ce64777050474f",
                                    "id": "sxsxsxsx"
                                }
                            ],
                            "status": 1,
                            "description": "这是我的作业答复",
                            "replyStatus": 0,
                            "teaHomeworkFiles": [
                                {
                                    "diskFilePath": "homework/73/HDXP5MB01/0711",
                                    "fileName": "文件1",
                                    "fileSize": "12345",
                                    "fileType": "jpg",
                                    "id": "c572b982b22149a5ab2e5d98650a3e3c",
                                    "uploadTime": 1499773427000
                                },
                                {
                                    "diskFilePath": "homework/73/HDXU3PB01/0711",
                                    "fileName": "文件1",
                                    "fileSize": "23564",
                                    "fileType": "MP3",
                                    "id": "c84c4da06da9470283588366812f7d01",
                                    "uploadTime": 1499773427000
                                }
                            ],
                            "teacherKnowledgePoint": "知识点1,知识点2",
                            "homeworkTime": "2017-07-11",
                            "lessonNo": 0
                        }
                    ],
                    "classCode": "HDXU3PB01",
                    "className": "中考提高物理暑假班",
                    "teacherName": "高伟"
                },
                {
                    "readStatus": 0,
                    "lessNos": [
                        {
                            "id": "022765ae376a4feab2ce64777050474f",
                            "teaHomeworkReplyFiles": [
                                {
                                    "diskFilePath": "homework/73/HDXP5MB01/0711",
                                    "fileName": "文件1",
                                    "fileSize": "12345",
                                    "fileType": "jpg",
                                    "id": "c572b982b22149a5ab2e5d98650a3e3c",
                                    "uploadTime": 1499773427000
                                },
                                {
                                    "diskFilePath": "homework/73/HDXU3PB01/0711",
                                    "fileName": "文件1",
                                    "fileSize": "23564",
                                    "fileType": "MP3",
                                    "id": "c84c4da06da9470283588366812f7d01",
                                    "uploadTime": 1499773427000
                                }
                            ],
                            "teacherDes": "这是测试数据",
                            "stuHomeworkFiles": [
                                {
                                    "diskFilePath": "aaa/bbb/ccc",
                                    "fileName": "学生作业",
                                    "fileSize": "3356",
                                    "fileType": "jpg",
                                    "homeworkSinfoId": "022765ae376a4feab2ce64777050474f",
                                    "id": "sxsxsxsx"
                                }
                            ],
                            "status": 1,
                            "description": "作业描述2222",
                            "replyStatus": 0,
                            "teaHomeworkFiles": [
                                {
                                    "diskFilePath": "homework/73/HDXP5MB01/0711",
                                    "fileName": "文件1",
                                    "fileSize": "12345",
                                    "fileType": "jpg",
                                    "id": "c572b982b22149a5ab2e5d98650a3e3c",
                                    "uploadTime": 1499773427000
                                },
                                {
                                    "diskFilePath": "homework/73/HDXU3PB01/0711",
                                    "fileName": "文件1",
                                    "fileSize": "23564",
                                    "fileType": "MP3",
                                    "id": "c84c4da06da9470283588366812f7d01",
                                    "uploadTime": 1499773427000
                                }
                            ],
                            "teacherKnowledgePoint": "知识点11,知识点21",
                            "homeworkTime": "2017-07-11",
                            "lessonNo": 0
                        },
                        {
                            "id": "022765ae376a4feab2ce64777050474f",
                            "teaHomeworkReplyFiles": [
                                {
                                    "diskFilePath": "homework/73/HDXP5MB01/0711",
                                    "fileName": "文件1",
                                    "fileSize": "12345",
                                    "fileType": "jpg",
                                    "id": "c572b982b22149a5ab2e5d98650a3e3c",
                                    "uploadTime": 1499773427000
                                },
                                {
                                    "diskFilePath": "homework/73/HDXU3PB01/0711",
                                    "fileName": "文件1",
                                    "fileSize": "23564",
                                    "fileType": "MP3",
                                    "id": "c84c4da06da9470283588366812f7d01",
                                    "uploadTime": 1499773427000
                                }
                            ],
                            "teacherDes": "这是测试数据8888888",
                            "stuHomeworkFiles": [
                                {
                                    "diskFilePath": "aaa/bbb/ccc",
                                    "fileName": "学生作业",
                                    "fileSize": "3356",
                                    "fileType": "jpg",
                                    "homeworkSinfoId": "022765ae376a4feab2ce64777050474f",
                                    "id": "sxsxsxsx"
                                }
                            ],
                            "status": 1,
                            "description": "作业描述8888888888",
                            "replyStatus": 0,
                            "teaHomeworkFiles": [
                                {
                                    "diskFilePath": "homework/73/HDXP5MB01/0711",
                                    "fileName": "文件1",
                                    "fileSize": "12345",
                                    "fileType": "jpg",
                                    "id": "c572b982b22149a5ab2e5d98650a3e3c",
                                    "uploadTime": 1499773427000
                                },
                                {
                                    "diskFilePath": "homework/73/HDXU3PB01/0711",
                                    "fileName": "文件1",
                                    "fileSize": "23564",
                                    "fileType": "MP3",
                                    "id": "c84c4da06da9470283588366812f7d01",
                                    "uploadTime": 1499773427000
                                }
                            ],
                            "teacherKnowledgePoint": "知识点11,知识点21",
                            "homeworkTime": "2017-07-11",
                            "lessonNo": 0
                        }
                    ],
                    "classCode": "HDXU3PB01",
                    "className": "中考提高物理暑假班",
                    "teacherName": "高伟"
                }
            ],
            "status": "success"
        };
        if (msg.code == 200) {
            if (msg.data.length > 0) {
                var datas = msg.data[curIndex].lessNos[classIndex];
                /*作业信息*/
                //知识点
                if (datas.teacherKnowledgePoint != "" && datas.teacherKnowledgePoint != null && datas.teacherKnowledgePoint != undefined) {
                    knowledgePoint = datas.teacherKnowledgePoint.split(',');
                    for (var i = 0; i < knowledgePoint.length; i++) {
                        kpHtml = '<span>' + knowledgePoint[i] + '</span>';
                        $('.knowPoint').append(kpHtml);
                    }
                }
                //作业描述
                $('.des').html(datas.description);
                //语音，图片 TODO
                /*作业答案*/
                $('.hmAnswer .anDes').html(datas.stuHomeworkFiles.description);

                /*老师批注*/
                $('.comment .anDes').html(datas.teaHomeworkFiles.description);


            } else {
                $('.hwEmpty p').html("您没有已交作业哦~");
                $('.hwEmpty').show();
            }
        }
    }

    // 显示作业信息

    // getfinishhwInfos();
    function getfinishhwInfos() {
        console.log(localStorage.finishhwInfos);
        var hwfinishInfos = JSON.parse(localStorage.finishhwInfos)[idIndex];
        console.log(hwfinishInfos);
        var knowledgePoint, kpHtml;
        $.each(hwfinishInfos, function (i, items) {
            console.log(items.description)
            //知识点
            if (items.teacherKnowledgePoint != "" && items.teacherKnowledgePoint != null && items.teacherKnowledgePoint != undefined) {
                knowledgePoint = items.teacherKnowledgePoint.split(',');
                for (var i = 0; i < knowledgePoint.length; i++) {
                    kpHtml = '<span>' + knowledgePoint[i] + '</span>';
                    $('.knowPoint').append(kpHtml);
                }
            }
            //作业描述
            $('.des').html(items.description);
            //语音，图片 TODO
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
    getFileInfo();
    /**
     * 获取文件信息
     */
    function getFileInfo(fileArray) {
        fileArray = ["1", "homework/b479a873299649a48d9741582a735450.jpg", "jpg"];
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
                alert(JSON.stringify(e));
                if (e.success == false) {
                    alert(e.message);
                } else {
                    //将文件显示到布局中
                    if (fileType == "mp3") {
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

        // document.getElementById(idParent).show();
        $('#'+idParent).show();
        length = 9;
        var strVoice = "<div><audio id='" + idChildren + "'preload='auto'><source src='" + url + "' type='audio/mpeg'></audio>" +
            "<i class='play-icon'></i>" +
            "</div><span>" + length + "''</span>";
        $('#'+idParent).html(strVoice);
    }


    /**
     * 显示获取到的图片
     */
    function showImage(previewUrl, imageId) {
        $('#'+imageId).show();
        var str = "";
        str += "<div class = 'imgBox'>";
        str += "<div><span class='stuImg'></span><img src='" + previewUrl + "'/></div>";
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
