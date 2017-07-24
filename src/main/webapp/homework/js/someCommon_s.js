/**
 * Created by use1 on 2017-07-24.
 */
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
var layer1,layer2,loading;
/*------------------图片选择开始------------------------------------*/
/**
 *点击选择图片
 */
$('#chooseImage').click(function () {
    //重新选择图片，清除之前数据
    fileParams = [];
    wx.chooseImage({
        count: 3,
        success: function (res) {

            if (res.localIds.length > 0) {

                var str = "";
                for (var i = 0; i < res.localIds.length; i++) {
                    str += "<li><span class='stuImg' img-index='" + i + "'></span><img src='" + res.localIds[i] + "'/></li>";

                }

                $(".notsubmit .imgBox").show();
                $(".notsubmit .imgBox").html(str);
                //界面样式控制
                if (res.localIds.length >= 3) {
                    $('#chooseImage').hide();
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
        return;
    }
    var i = 0, length = images.localIds.length;

    function upload() {
        wx.uploadImage({
            localId: images.localIds[i],
            success: function (res) {
                uploadImage(res.serverId, i);
                i++;
                if (i < length) {
                    upload();
                }
            },
            fail: function (res) {
                // alert(JSON.stringify(res));
            }
        });
    }

    upload();
}


/**
 * 图片上传到自己服务器
 */
function uploadImage(serverId, i) {
    var cbconfig = {
        'appId': "wx559791e14e9ce521",
        'appSecret': "baa4373d5a8750c69b9d1655a2e31370",
        'mediaId': serverId,
        'schoolId': sessionStorage.schoolId,
        'classId': localStorage.classCode
    };
    $.ajax({
        url: url_o + "upload/uploadFileByWeiChat.do",
        // url: "http://10.200.80.235:8080/xdfdtmanager/upload/uploadAudio.do",
        type: 'post',
        dataType: 'json',
        data: cbconfig,
        success: function (data) {
            // alert(JSON.stringify(data));
            if (data.status == "failure") {
                alert(e.message);
            } else {
                if (data.data.success == true) {
                    fileName = data.data.fileName;
                    fileSize = data.data.fileSize;
                    fileType = data.data.fileType;
                    diskFilePath = data.data.diskFilePath;
                    fileParams[i] = {
                        "homeworkSinfoId": homeworkSinfoId,
                        "fileName": fileName,
                        "fileType": fileType,
                        "fileSize": fileSize,
                        "diskFilePath": diskFilePath,
                        "uploadUser": uploadUser
                    };

                } else {
                    //上传失败重新上传一次
                    uploadImage(serverId);
                }

            }


        }
    });

}

/*----------------图片选择结束--------------------------------------*/
/*--------------------图片预览----------------------------------*/
$(document).on('touchend', '.imgBox img', function () {
    var previewUrl = $(this).attr('src');
    wx.previewImage({
        current: previewUrl, // 当前显示图片的http链接
        urls: [previewUrl] // 需要预览的图片http链接列表
    });
});

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
    // else {
    //     $('.imgBox div:eq('+parseInt($(this).attr('img-index'))+')').remove();
    // }
    $('.imgBox li:eq(' + index + ')').remove();
    // 图片小于三张，显示添加图片按钮
    if ($('.notsubmit .imgBox').children('div').length < 3) {
        $('#chooseImage').show();
    }
    if (fileParams.length > 0) {

        fileParams.splice(index, 1);
    }


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
    if (voiceFileParams.length > 0) {
        voiceFileParams.splice(index, 1);
        recordCount--;
    }


});
//作业描述验证
$('.teBox').on('keyup', function () {
    if ($(this).val().length > 200) {
        $('.word').css('color', 'red');
        $('.teBox').val($(this).val().substr(0, 200));
        // $('.teBox').attr('readonly',true);
    } else {
        $('.word').css('color', '#808080');
    }
    $('.word').html('' + $(this).val().length + '/200')
});
//提交作业
$(document).on('touchend', '#HWsubmit', function () {
    console.log($('.notsubmit .imgBox').children('div').length);
    // var answerVal = $('.teBox').val().trim();
    var answerVal = $('.teBox').val();
    // 答案不能为空
    if (answerVal == "" || answerVal == null) {
        layer.open({
            type: 1,
            area: ['310px', '195px'],
            shade: [0.1, '#fff'],
            title: false,
            skin: 'tips',
            time: 3000,
            content: '<div class="layer-tips">答案不能为空！</div>'
        });
        // closeLayer(layer1);
        return;
    }
    // 超出字数
    console.log(answerVal.length)
    if (answerVal.length > 200) {
        layer.open({
            type: 1,
            area: ['310px', '195px'],
            shade: [0.1, '#fff'],
            title: false,
            skin: 'tips',
            time: 3000,
            content: '<div class="layer-tips">超出字符上限！</div>'
        });
        // closeLayer(layer1);
        return;
    }
    // 语音最多可上传*个，图片最多可上传*个 TODO
    hwcommit();

});
// 提交作业接口
function hwcommit() {
    //将语音和图片一起传给服务器
    var fileStuhomeworks;

    fileStuhomeworks = fileParams.concat(voiceFileParams);

    var reqData = {
        "id": GetRequest('id'),
        "description": encodeURI($('.teBox').val()),
        "fileStuhomeworks": fileStuhomeworks
    };
    // alert(JSON.stringify(reqData));
    loading = layer.load();
    $('#HWsubmit').attr('disabled', "true");//禁用按钮
    $('#HWsubmit').addClass('btn-grey');
    ajaxRequest('POST', homework_s.s_hwcommit, JSON.stringify(reqData), hwCommitSuccess);
}

//提交作业--成功--确定
$(document).on('touchend', '.submitBox .confirmBtn', function () {
    layer.close(layer2);
    window.location.href = 'homeworklist_s.html';
    // window.location.href = document.referrer;//返回上一页并刷新
});
//提交作业--失败--取消
$(document).on('touchend', '.submitFail .cancelBtn', function () {
    layer.close(layer2);
});
//提交作业--失败--重试
$(document).on('touchend', '.submitFail .retryBtn', function () {
    layer.close(layer2);
    layer.close(layer1);
    layer.close(layer);
    hwcommit();
});
// 提交作业接口返回处理
function hwCommitSuccess(msg) {
    $('#HWsubmit').attr('disabled', "true");//禁用按钮
    $('#HWsubmit').addClass('btn-grey');
    // alert(JSON.stringify(msg));
    // layer.close(layer);
    layer.close(layer1);
    layer.close(layer2);
    if (msg.code == 200) {
        //提交成功
        layer2 = layer.open({
            type: 1,
            area: ['548px', '345px'],
            shade: [0.2, '#000'],
            title: '',
            skin: '',
            content: $(".submitBox")
        });
    } else {
        //提交失败
        layer2 = layer.open({
            type: 1,
            area: ['548px', '345px'],
            shade: [0.2, '#000'],
            title: '',
            skin: '',
            content: $(".submitFail")
        })
    }
    $('#HWsubmit').removeAttr("disabled");
    $('#HWsubmit').removeClass('btn-grey');
    layer.close(loading);
}