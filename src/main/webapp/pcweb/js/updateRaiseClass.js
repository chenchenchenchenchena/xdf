var baseUrl = "http://dt.staff.xdf.cn/xdfdtmanager/";
// var baseUrl = "http://10.73.81.106:8080/xdfdtmanager/";
function init() {
    var request = getRequest();
    activityId = request["ckId"];
    showInfo(activityId);
};

function showInfo(id) {
    var loginId = getCookie("loginId");
    var businessP = {"ckId": id,"loginId":loginId};
    jQuery.ajax({
        type: "POST",
        url: Global.actionURL,
        async: false,
        dataType: 'json',
        data: JSON.stringify(businessP),
        success: function (json) {
            if (json.result == true) {
                //如果没有设置状态的权限，隐藏第四步的保存和发布按钮
                /*
                var haspublish = json.haspublish;
                if(haspublish == undefined || !haspublish){
                    var $a = $(".p176-tit-btnWrap a");
                    var len = $a.length;
                    //隐藏发布按钮
                    $a.eq(len - 1).css("display","none");
                }*/
                var activity = json.activity;
                //第一阶段
                $("#ckId").val(activity.id)
                $("#statusId").val(activity.status)
                $("#classNum").val(activity.classCode);//班级编号
                $("#usefulPerson").val(activity.fitPerson);//适用人群
                $("#courseAmount").val(activity.classMoney);//课程金额
                $("#ckIntroduce").val(activity.content);//筹课说明
                // $("#schoolId").val(activity.schoolId);
                // $("#areaCode").val(activity.areaCode);
                $("#deptCode").val(activity.deptCode);
                $("#classDate").val(activity.classDate);
                $("#classTime").val(activity.classTime);
                $("#classArea").val(activity.classArea);
                $("#service").val(activity.serviceCall);//官方客服

                $("#hidden1").val(activity.imgUrl);//筹课配图
                if (activity.imgUrl) {
                    $("#ckpt").attr("src", activity.imgUrl);
                }
                $("#hidden1").parents(".uploader").find(".filename").val(activity.imgUrl);
                $("#hidden2").val(activity.wechatImgUrl);//微信转发小图尺寸
                if (activity.wechatImgUrl) {
                    $("#wechatpt").attr("src", activity.wechatImgUrl);
                }
                $("#hidden2").parents(".uploader").find(".filename").val(activity.wechatImgUrl);
                $("#hidden3").val(activity.erWeiCode);//公众号二维码
                if (activity.erWeiCode) {
                    $("#ercodept").attr("src", activity.erWeiCode);
                }
                $("#hidden3").parents(".uploader").find(".filename").val(activity.erWeiCode);
                $("#gzhname").val(activity.wechatName);//公众号名称
                //校验班级信息
                classValidateNum();
                $("#ckName").val(activity.name);//筹课名称
                $("#className").val(activity.className);//班级名称
                $("#raiseMoney").val(activity.raiseMoney);//需筹金额

                //第二阶段
                $("#startDate").val(activity.beginDate.split(" ")[0]);//开始时间
                $("#startTime").val(activity.beginDate.split(" ")[1].substr(0, activity.beginDate.split(" ")[1].lastIndexOf(":")));//开始时间
                $("#endDate").val(activity.endDate.split(" ")[0]);//结束时间
                $("#endTime").val(activity.endDate.split(" ")[1].substr(0, activity.endDate.split(" ")[1].lastIndexOf(":")));//开始时间
                $("#ruleIntroduce").val(activity.rule);//规则说明
                $("#address").val(activity.honourClassAddress);//兑课地址
                $("#phoneNum").val(activity.honourClassContact);//兑课电话
                $("#effect").val(activity.honourClassExpires.split(" ")[0]);//兑课有效期

                //批次处理
                var batch = json.ruleHelperList;
                if (batch.length > 0) {
                    for (var i = 0; i < batch.length; i++) {
                        var html = '<div class="p176-setInfoCon clearfix">' +
                            '<div class="p176-count-wrap clearfix">' +
                            '<div class="p176-countBox">' +
                            '<div class="p176-label-b" style="margin-left:0;">第' + (i + 1) + '批名额</div>' +
                            '<div class="p176-filed-b">' +
                            '<input name="count" type="text" class="p176-Cinput" value="' + batch[i].personNum + '">' +
                            '</div>' +
                            '<div class="p176-label-b">帮筹人数</div>' +
                            '<div class="p176-filed-b">' +
                            '<input name="perNum" type="text" class="p176-Cinput" value="' + batch[i].helperNum + '">' +
                            '</div>' +
                            '</div>' +
                            '<i class="p176-close" onclick="delBacth(this)"></i>' +
                            '</div>' +
                            '</div>';
                        $("#batchNum").val((i + 1));
                        $("#batchId").append(html);
                    }
                } else {
                    $("#batchNum").val(0);
                }
                setTextSize_cknew();
            } else {
                layer.msg(json.message, {icon: 5});
            }
        }
    });
}


function setTextSize_cknew() {
    //编辑页面使用
    $('#explainInformCnt1').text($('#ckName').val().length);
    $('#explainInformCnt03').text($('#className').val().length);
    $('#explainInformCnt3').text($('#usefulPerson').val().length);
    $('#explainInformCnt5').text($('#raiseMoney').val().length);
    $('#explainServiceCntMin').text($('#service').val().length);
    $('#explainInformCnt7').text($('#ckIntroduce').val().length);
}
function getRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}