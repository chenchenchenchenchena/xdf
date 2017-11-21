/*---------全局参数定义--------start*/

var delTempLayer;

/*---------全局参数定义--------end*/

$(function () {
    //滑动事件
    $(document).on('touchstart mouusedown', '.temp_list', function () {
        // e.stopPropagation();
        if ($(this).children('.remove_temp')) {
            var begin_s = parseInt(event.targetTouches[0].pageX);
            $(document).on('touchmove mousemove', '.temp_list li', function () {
                var listHeight = $(this)[0].offsetHeight;
                if (event.targetTouches != undefined && event.targetTouches[0] != undefined) {
                    var move_s = parseInt(event.targetTouches[0].pageX);
                    $(this).find('.remove_temp').css('height', listHeight + "px");
                    $(this).find('.remove_temp span').css('height', listHeight + "px");
                    $(this).find('.remove_temp span').css('line-height', listHeight + "px");
                    if (begin_s - move_s >= 20) {
                        $(this).siblings().css('margin-left', '0px');
                        $(this).siblings().find('.remove_temp').css('right', '-270px');
                        $(this).css('margin-left', '-181px');
                        $(this).find('.remove_temp').css('right', '-0px');
                        $(this).parent().css('overflow', 'inherit');
                        $(this).css('margin-left', '-50px');
                    } else if (begin_s - move_s <= -20) {
                        $(this).css('margin-left', '0px');
                        $(this).find('.remove_temp').css('right', '-270px');
                        $(this).parent().css('overflow', 'hidden');
                        $(this).css('margin-left', '0');
                    }
                }

            });
        }
    });
    //获取模版列表
    var listParams = {
        'teacherEmail': localStorage.terEmail
    };
    ajaxRequest("POST", homework_s.get_tempList, listParams, dealTempListData);

});
/**
 * 处理模版列表返回数据
 * @param e
 */
function dealTempListData(e) {
    if (e.code == 200) {
        var list = e.data;
        if (list != undefined && list.length != 0) {
            $('.temp_list li').remove();
            for (var i = 0; i < list.length; i++) {
                var fileFullPath = [];
                var description = decodeURIComponent(decodeURIComponent(list[i].description));//文本信息
                var templateFileList = list[i].homeworkReplyTemplateFileList;//文件列表
                var tempId = list[i].id;//模版id
                var status = list[i].status;
                var str = '<li data-index="'+i+'" data-tempId="' + tempId + '" class="item_temp"><p>' + description + '</p><ul style="display: none;" class="voiceBox"><li class="audio_box padding-no"></ul> ' +
                    '<div class="imgBox" style="display: none;"></div><img class="loading-back" src="../common/images/loading.gif">' +
                    '<div class="load_fail"><img src="images/reload.png" > <span>重新加载</span></div> ' +
                    '<div class="remove_temp"><span class="edit_temp">编辑</span><span class="delete_temp">删除</span></div></li>';
                $('.temp_list').append(str);
                for (var j = 0; j < templateFileList.length; j++) {
                    fileFullPath.push({"fullPath": templateFileList[j].diskFilePath});
                }
                sessionStorage.setItem(tempId, JSON.stringify(fileFullPath));
                getFileInfo(tempId,i);
            }
        } else {
            layer.msg("暂无模版");
        }

    }
}

/**
 * 调取接口获取文件展示信息
 * @param e
 */
function getFileInfo(tempId,i) {
    var templateFileList = JSON.parse(sessionStorage.getItem(tempId));
    if (templateFileList.length != 0) {

        var params = {
            'fileSfullPath': [],
            'fileTfullPath': [],
            'fileRfullPath': templateFileList
        };
        ajaxRequest("POST", homework_s.t_getFileDetails, JSON.stringify(params), function(e){
            if(e.code == 200){
                $(".temp_list li").eq(i).find('.loading-back').hide();
                $(".temp_list li").eq(i).find('.voiceBox').show();
                $(".temp_list li").eq(i).find('.imgBox').show();

            }
        }, errorFile);

    } else {
        $('.loading-back').hide();
    }
}

/**
 * 文件获取失败处理
 */
function errorFile() {
    $('.load_fail').show();
}

$(document).on('tap', '.item_temp .load_fail', function () {
    $(this).parent().find('.loading-back').show();
    $(this).hide();
    var tempId = $(this).parent().attr('data-tempId');
    var index = $(this).parent().attr('data-index');
    getFileInfo(tempId,index);
});

/**
 * 编辑
 */
$(document).on('touchend', '.edit_temp', function () {

    var tempId = $(this).parent().parent().attr('data-tempId');
    location.href = "add_template.html?tempId=" + tempId;
});

/**
 * 删除
 */
$(document).on('touchend', '.delete_temp', function () {
    $('.erro').show();
});
// 删除模版-取消
$('.erro input:first-of-type').on('touchend', function () {
    $(".erro").hide();
});
// 删除模版-确定
$('.erro input:last-of-type').on('touchend', function () {
    $(".erro").hide();

    var tempId = $(this).parent().parent().attr('data-tempId');
});

/**
 * 点击添加模版
 */
$('.eBtn').click(function () {
    location.href = 'add_template.html';
});