/*---------全局参数定义--------start*/
var currentDelId;//当前要删除的ID
var delTempLayer;

var loading;
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
                var description = decodeURIComponent(decodeURIComponent(list[i].description));//文本信息
                var templateFileList = list[i].homeworkReplyTemplateFileList;//文件列表
                var tempId = list[i].id;//模版id
                var status = list[i].status;
                var str = '<li data-index="'+i+'" data-tempId="' + tempId + '" class="item_temp"><p>' + description + '</p><ul style="display: none;" class="voiceBox"></ul> ' +
                    '<div class="imgBox" style="display: none;"></div><img style="display: block;" class="loading-back" src="../common/images/loading.gif">' +
                    '<div class="load_fail"><img src="images/reload.png" > <span>重新加载</span></div> ' +
                    '<div class="remove_temp"><span class="edit_temp">编辑</span><span class="delete_temp">删除</span></div></li>';
                $('.temp_list').append(str);
                sessionStorage.setItem(tempId, JSON.stringify(list[i]));
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
function getFileInfo(tempId,k) {
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
        ajaxRequest("POST", homework_s.t_getFileDetails, JSON.stringify(params), function(e){
            if(e.code == 200){
                $(".temp_list .item_temp").eq(k).find('.loading-back').hide();
                var fileR = e.data.fileR;
                for(var i = 0;i<fileR.length;i++){
                    var fileType = fileR[i].fileType;
                    var playTime = fileR[i].playTime;
                    if(fileType == "mp3"){
                        $(".temp_list .item_temp").eq(k).find('.voiceBox').show();
                        var voiceStr = '<li class="audio_box padding-no"><div> ' +
                            '<audio id="audio_'+k+i+'" preload="auto" data-time='+playTime+'> ' +
                            '<source src="'+fileR[i].relativePath+'" type="audio/mpeg"> ' +
                            '</audio>' +
                            '<i class="play-icon"></i></div> ' +
                            '<span class="voice_lenth">'+playTime+'"</span></li>';
                        $(".temp_list .item_temp").eq(k).find('.voiceBox').append(voiceStr);
                    }else {
                        $(".temp_list .item_temp").eq(k).find('.imgBox').show();
                        var imagStr = '<div><img data-id="'+fileR[i].diskFilePath+'"  onerror=javascript:this.src="images/error-image.png" data-ramke="1" data-thumbnail="' + fileR[i].thumbnail + '"  data-img="' + fileR[i].fileUrl + '" src="'+fileR[i].thumbnail+'" alt="" /></div>';
                        $(".temp_list .item_temp").eq(k).find('.imgBox').append(imagStr);
                    }
                }

            }
            $('.loading-back').hide();
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
    $(this).parent().find('.load_fail').hide();
    getFileInfo(tempId,index);
});

/**
 * item点击事件
 */
$(document).on('touchend', '.temp_list .item_temp', function () {
    var tempId = $(this).attr('data-tempId');
    sessionStorage.template = sessionStorage.getItem(tempId);
    history.go(-1);
});

/**
 * 编辑
 */
$(document).on('touchend', '.edit_temp', function () {

    var tempId = $(this).parent().parent().attr('data-tempId');
    sessionStorage.template = sessionStorage.getItem(tempId);
    location.href = "add_template.html";
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
        'id':currentDelId
    }
    ajaxRequest("POST",homework_s.del_temp,params,function(e){
        //接口访问成功
        if(e.code == 200){
            layer.close(loading);
            layer.msg("删除成功");
            window.location.reload();
        }else {
            layer.close(loading);
            layer.msg("删除失败")
        }
    },function(){
        //接口访问失败
        layer.close(loading);
        layer.msg("删除失败")
    })
});
//删除模版-取消
$(document).on('touchend', '.delete .cancelBtn', function () {
    layer.close(delTempLayer);
});

/**
 * 点击添加模版
 */
$('.eBtn').click(function () {
    location.href = 'add_template.html';
});