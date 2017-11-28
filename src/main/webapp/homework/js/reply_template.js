/*---------全局参数定义--------start*/
var currentDelId;//当前要删除的ID
var delTempLayer;
var loading;

var homeworkTime = sessionStorage.homeworkTime_s;
var classCode = sessionStorage.classCode_s;
var flag = 0;//判断啊滑动和点击的标记
/*---------全局参数定义--------end*/

$(function () {
    $('.temp_list').show();
    $('.searchEmpty').hide();
    $('.reload').hide();
    //滑动事件
    $(document).on('touchstart mousedown', '.temp_list', function () {
        // e.stopPropagation();
        if ($(this).children('.remove_temp')) {
            if (event.targetTouches != undefined && event.targetTouches[0] != undefined) {
                var begin_s = parseInt(event.targetTouches[0].pageX);
                $(document).on('touchmove mousemove', '.temp_list .item_temp', function () {

                    var listHeight = $(this)[0].offsetHeight;
                    if (event.targetTouches != undefined && event.targetTouches[0] != undefined) {
                        var move_s = parseInt(event.targetTouches[0].pageX);
                        $(this).find('.remove_temp').css('height', listHeight + "px");
                        $(this).find('.remove_temp span').css('height', listHeight + "px");
                        $(this).find('.remove_temp span').css('line-height', listHeight + "px");
                        if (begin_s - move_s >= 45) {
                            flag = 1;
                            $(this).siblings().css('margin-left', '0px');
                            $(this).siblings().find('.remove_temp').css('right', '-270px');
                            $(this).css('margin-left', '-181px');
                            $(this).find('.remove_temp').css('right', '-0px');
                            $(this).parent().css('overflow', 'inherit');
                        } else if (begin_s - move_s <= -20) {

                            $(this).css('margin-left', '0px');
                            $(this).find('.remove_temp').css('right', '-270px');
                            $(this).parent().css('overflow', 'hidden');
                        }
                    }
                });
                $(document).on('touchend mouseup', '.temp_list .item_temp', function () {
                    if (event.targetTouches != undefined && event.targetTouches[0] != undefined) {
                        var end_s = parseInt(event.targetTouches[0].pageX);
                        var angle = end_s - begin_s;
                        if (angle <= 2 && angle >= -2) {

                            flag = 0;
                            var d = $(this).find('.remove_temp').css('right');
                            if (d == "0px") {
                                //如何编辑和删除按钮显示，则拦截整条item的点击事件，否则删除和编辑点击事件会被忽略
                            } else {
                                //整条item的点击事件
                                var tempId = $(this).attr('data-tempId');
                                goBack(tempId);
                            }
                        }
                    }
                });

            }


        }
    });

    loading = layer.load();
    //获取模版列表
    var listParams = {
        'teacherEmail': localStorage.terEmail,
        'homeworkTime': homeworkTime,
        'classCode': classCode
    };
    ajaxRequest("POST", homework_s.get_tempList, listParams, dealTempListData, function (e) {
        layer.msg("模版信息加载失败");
        layer.close(loading);
        $('.reload').show();
        $('.temp_list').hide();
        $('.searchEmpty').hide();
    });

    /**
     * 文件获取失败，点击重新获取
     */
    $(document).on('tap', '.item_temp .load_fail', function () {
        $(this).parent().find('.loading-back').show();
        $(this).hide();
        var tempId = $(this).parent().attr('data-tempId');
        var index = $(this).parent().attr('data-index');
        $(this).parent().find('.load_fail').hide();
        getFileInfo(tempId, index);
    });

    /**
     * 播放语音
     */
    $(document).on('touchend mouseup', '.audio_box>div', function () {
        return false;
    });

    /**
     * 查看大图
     */
    $(document).on('touchend mouseup', '.imgBox img', function () {
        if (flag == 0) {
            var previewUrl = $(this).attr('data-id');
            lookBigImage(previewUrl, true);
            return false;
        }
    });

    function lookBigImage(diskPath, saveServer) {
        var params = {
            'fullPath': diskPath,
            'saveServer': saveServer
        }
        ajaxRequest("POST", homework_s.t_getImgeUrl, params, function (e) {
            var previewUrl = e;
            //true:返回服务器所在的地址，false:返回云盘的预览地址
            previewUrl = url_o + previewUrl;
            lookBig(previewUrl);
        });


    }

    function lookBig(previewUrl) {
        $('.big_back_s').show();
        $('.big_back_s img').attr('src', previewUrl);

        $('.big_back_s img').load(function () {
            $('.big_back_s img').css({
                'margin-top': -parseInt($('.big_back_s img').css('height')) / 2,
                'margin-left': -parseInt($('.big_back_s img').css('width')) / 2
            });
        })
        $('.big_back_s img').error(function () {
            alert('图片加载失败，正在重新加载');
            location.reload();
        })
    }

    $(document).on('touchend', '.pinch-zoom', function () {

        $('.big_back_s').hide();
        return false;
    });


    /**
     * 编辑
     */
    $(document).on('touchend', '.edit_temp', function () {

        var tempId = $(this).parent().parent().attr('data-tempId');
        sessionStorage.templateEdit = sessionStorage.getItem(tempId);
        location.href = "add_template.html";
        return false;
    });

    /**
     * 删除
     */
    $(document).on('touchend', '.delete_temp', function () {
        currentDelId = $(this).parent().parent().attr('data-tempId');
        delTempLayer = layer.open({
            type: 1,
            area: ['548px', '345px'],
            shade: [0.2, '#000'],
            title: '',
            skin: '',
            content: $(".delete")
        });
    });

    //删除模版-确定
    $(document).on('touchend', '.delete .confirmBtn', function () {
        layer.close(delTempLayer);
        loading = layer.load();
        var params = {
            'id': currentDelId
        }
        ajaxRequest("POST", homework_s.del_temp, params, function (e) {
            //接口访问成功
            if (e.code == 200) {
                layer.close(loading);
                layer.msg("删除成功");
                window.location.reload();
            } else {
                layer.close(loading);
                layer.msg("删除失败")
            }
        }, function () {
            //接口访问失败
            layer.close(loading);
            layer.msg("删除失败")
        })
        return false;
    });
    //删除模版-取消
    $(document).on('touchend', '.delete .cancelBtn', function () {
        layer.close(delTempLayer);
        return false;
    });

    /**
     * 点击添加模版
     */
    $('.eBtn').click(function () {
        location.href = 'add_template.html';
    });

    /**
     * 重新加载页面
     */
    $('.reload img').click(function () {
        $('.temp_list').hide();
        window.location.reload();
    })

});

function goBack(tempId) {
    sessionStorage.template = sessionStorage.getItem(tempId);
    setTimeout(function () {
        //history.go(-1);
        location.href = 'replydetail_t.html';
    }, 500)
}


/**
 * 处理模版列表返回数据
 * @param e
 */
function dealTempListData(e) {

    layer.close(loading);
    if (e.code == 200) {
        var list = e.data;
        if (list != undefined && list.length != 0) {
            $('.temp_list li').remove();
            for (var i = 0; i < list.length; i++) {
                var description = decodeURIComponent(decodeURIComponent(list[i].description));//文本信息
                var templateFileList = list[i].homeworkReplyTemplateFileList;//文件列表
                var tempId = list[i].id;//模版id
                var status = list[i].status;
                var str = '<li data-index="' + i + '" data-tempId="' + tempId + '" class="item_temp"><p>' + description + '</p><ul style="display: none;" class="voiceBox"></ul> ' +
                    '<div class="imgBox" style="display: none;"></div><img style="display: block;" class="loading-back" src="../common/images/loading.gif">' +
                    '<div class="load_fail"><img src="images/reload.png" > <span>重新加载</span></div> ' +
                    '<div class="remove_temp"><span class="edit_temp">编辑</span><span class="delete_temp">删除</span></div></li>';
                $('.temp_list').append(str);
                sessionStorage.setItem(tempId, JSON.stringify(list[i]));
                getFileInfo(tempId, i);
            }
        } else {
            $('.searchEmpty').show();
            $('.temp_list').hide();
        }

    } else {

    }

}

/**
 * 调取接口获取文件展示信息
 * @param e
 */
function getFileInfo(tempId, k) {
    var item = JSON.parse(sessionStorage.getItem(tempId));
    var templateFileList = item.homeworkReplyTemplateFileList;//文件列表
    var fileFullPath = [];
    for (var j = 0; j < templateFileList.length; j++) {
        fileFullPath.push({"fullPath": templateFileList[j].diskFilePath});
    }
    if (fileFullPath.length != 0) {

        var params = {
            'fileSfullPath': [],
            'fileTfullPath': [],
            'fileRfullPath': fileFullPath
        };
        ajaxRequest("POST", homework_s.t_getFileDetails, JSON.stringify(params), function (e) {
            if (e.code == 200) {
                $(".temp_list .item_temp").eq(k).find('.loading-back').hide();
                var fileR = e.data.fileR;
                for (var i = 0; i < fileR.length; i++) {
                    var fileType = fileR[i].fileType;
                    var playTime = fileR[i].playTime;
                    if (fileType == "mp3") {
                        $(".temp_list .item_temp").eq(k).find('.voiceBox').show();
                        var voiceStr = '<li class="audio_box padding-no"><div> ' +
                            '<audio id="audio_' + k + i + '" preload="auto" data-time=' + playTime + '> ' +
                            '<source src="' + url_o + fileR[i].relativePath + '" type="audio/mpeg"> ' +
                            '</audio>' +
                            '<i class="play-icon"></i></div> ' +
                            '<span class="voice_lenth">' + playTime + '"</span></li>';
                        $(".temp_list .item_temp").eq(k).find('.voiceBox').append(voiceStr);
                    } else {
                        $(".temp_list .item_temp").eq(k).find('.imgBox').show();
                        var imagStr = '<div><img data-id="' + fileR[i].diskFilePath + '"  onerror=javascript:this.src="images/error-image.png" data-ramke="1" data-thumbnail="' + fileR[i].thumbnail + '"  data-img="' + fileR[i].fileUrl + '" src="' + fileR[i].thumbnail + '" alt="" /></div>';
                        $(".temp_list .item_temp").eq(k).find('.imgBox').append(imagStr);
                    }
                }

            }
        }, function (e) {

            $(".temp_list .item_temp").eq(k).find('.loading-back').hide();
            $(".temp_list .item_temp").eq(k).find('.load_fail').show();
        });

    } else {
        $(".temp_list .item_temp").eq(k).find('.loading-back').hide();
    }
}