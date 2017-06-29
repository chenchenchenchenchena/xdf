/**
 * Created by xupingwei on 2017/6/26.
 */
$(function () {
    lengthValidate("ckName", "explainInformCnt1", 12);
    lengthValidate("className", "explainInformCnt03", 20);
    lengthValidate("usefulPerson", "explainInformCnt3", 15);
    lengthValidate("raiseMoney", "explainInformCnt5", 15);
    lengthValidate("service", "explainServiceCntMin", 15);
    lengthValidate("ckIntroduce", "explainInformCnt7", 200);
    lengthValidate("ruleIntroduce", "explainInformCnt9", 300);
    lengthValidate("address", "explainaddressMinCnt", 30);
    lengthValidate("courseName", "explainInformCnt6", 30);
    lengthValidate("courseReady", "explainInformCnt2", 20);
    lengthValidate("courseIntroduce", "explainInformCnt4", 100);
    lengthValidate("olderRule", "explainInformCnt29", 300);
    lengthValidate("newDefine", "explainInformCnt34", 20);
    lengthValidate("oldDefine", "explainInformCnt", 20);
    lengthValidate("contactNumber", "explainContactCnt", 15);
    lengthValidate("workTime", "explainWorkCnt", 20);
    lengthValidate("getcashAddress", "explainInformCnt1112", 30);
    lengthValidate("usefulPersons", "explainInformCnt3114", 8);
    lengthValidate("applyRange-0", "explainContactCnt400", 10)

});


function lengthValidate(inputId, spanId, validLength) {
    inputId = "#" + inputId;
    spanId = "#" + spanId;
    $(inputId).bind('input propertychange', function () {
        var currentLength = $(inputId).val().length;
        $(spanId).text(currentLength);
        if (currentLength > validLength) {
            $(spanId).css("color", "red");
            return false;
        } else {
            $(spanId).css("color", "#D7D7D7");
        }
    });
}

var baseUrl = "http://dt.staff.xdf.cn/xdfdtmanager/";
// var baseUrl = "http://10.73.81.106:8080/xdfdtmanager/";

$(function () {
    $("form[enctype]").attr("action", baseUrl + $("form[enctype]").attr("action"));
    $("input[type=file]").change(function () {
        $(this).parents(".uploader").find(".filename").val($(this).val());

    });

    $("input[type=file]").each(function () {
        if ($(this).val() == "") {
            $(this).parents(".uploader").find(".filename").val("请选择图片...");
        }
    });

    $('#up1').click(function () {
        if ($("#first1").val() != null & $("#first1").val() != "") {
            var file = $("#first1").val();
            if (!checkImgType(file)) {
                layer.msg("APP筹课配图类型必须是 gif,jpeg,jpg,png,bmp中的一种", {icon: 5});
                return false;
            }
            //thumbnail／previewUrl／fileUrl

            $("#submit-1").ajaxSubmit({
                data: {"width": 750, "height": 527},
                resetForm: "true",
                success: function (data) {
                    data = $.parseJSON(data);
                    if (data.success == true) {
                        $("#submit-1 .filename").val(file);
                        $("#hidden1").val(data.thumbnail);
                        $("#ckpt").attr("src", data.thumbnail);
                        $("#m1").html(data.message);
                    } else {
                        $("#m1").html(data.message);
                        setTimeout(function () {
                            $("#m1").html("");
                            $("#submit-1 .filename").val($("#hidden1").val());
                        }, 4000);
                    }
                },
                error: function (jqxhr, errorMsg, errorThrown) {
                }
            });

            return false;
        } else {
            layer.msg("请选择文件", {icon: 5});
        }
    })
    $('#up2').click(function () {
        if ($("#first2").val() != null & $("#first2").val() != "") {
            var file = $("#first2").val();
            if (!checkImgType($("#first2").val())) {
                layer.msg("微信转发配图类型必须是 gif,jpeg,jpg,png,bmp中的一种", {icon: 5});
                return false;
            }
            $("#submit-2").ajaxSubmit({
                data: {"width": 180, "height": 180},
                resetForm: "true",
                success: function (data) {
                    data = $.parseJSON(data);
                    if (data.success == true) {
                        $("#submit-2 .filename").val(file);
                        $("#hidden2").val(data.fileUrl);
                        $("#wechatpt").attr("src", data.previewUrl);
                        $("#m2").html(data.message);
                    } else {
                        $("#m2").html(data.message);
                        setTimeout(function () {
                            $("#m2").html("");
                            $("#submit-2 .filename").val($("#hidden2").val());
                        }, 4000);
                    }
                }
            });
            return false;
        } else {
            layer.msg("请选择文件", {icon: 5});
        }
    })

    $('#up3').click(function () {
        if ($("#first3").val() != null & $("#first3").val() != "") {
            var file = $("#first3").val();
            if (!checkImgType($("#first3").val())) {
                layer.msg("公众号二维码图片类型必须是 gif,jpeg,jpg,png,bmp中的一种", {icon: 5});
                return false;
            }
            $("#submit-3").ajaxSubmit({
                data: {"width": 160, "height": 160},
                resetForm: "true",
                success: function (data) {
                    // 对于表单提交成功后处理，message为提交页面saveReport.htm的返回内容
                    data = $.parseJSON(data);
                    if (data.success == true) {
                        $("#submit-3 .filename").val(file);
                        $("#hidden3").val(data.fileUrl);
                        $("#ercodept").attr("src", data.fileUrl);
                        $("#m3").html(data.message);
                    } else {
                        $("#m3").html(data.message);
                        setTimeout(function () {
                            $("#m3").html("");
                            $("#submit-3 .filename").val($("#hidden3").val());
                        }, 4000);
                    }
                }
            });
            return false;
        } else {
            layer.msg("请选择文件！", {icon: 5});
        }
    });

});


/*
 * 判断图片类型
 *
 * @param ths
 *          type="file"的javascript对象
 * @return true-符合要求,false-不符合
 */
function checkImgType(file) {
    if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|JPEG|PNG|BMP)$/.test(file)) {
        return false;
    }
    return true;
}

// function checkImgSize(file, size) {
//     // var img = new Image();
//     // img.src = file;
//     //
//     // alert(img.offsetHeight+"*"+img.offsetWidth);
//
//     if (window.FileReader) {
//         var reader = new FileReader();
//         var blob = new Blob([file],{type:"text/plain"});
//         reader.readAsDataURL(blob);
//         //监听文件读取结束后事件  
//         reader.onloadend = function (e) {
//             showXY(e.target.result);
//         };
//     }
//
// }
// function showXY(source){
//     var img = document.getElementById("ckpt");
//     img.src = source;
//     alert("Width:"+img.width+", Height:"+img.height);
// }

var classValidateNumByChange = false;

var isClassNum = true;
//校验班级编号
function classValidateNum(type) {
    if (type == 1) {
        classValidateNumByChange = true;
    } else if (type == 2 && classValidateNumByChange) {
        classValidateNumByChange = false;
        return;
    }
    var classCode = $.trim($("#classNum").val());

    var schoolId = sessionStorage.getItem("currentCityId")//$("#schoolIdFinal").val();
    var access_token = getCookie("access_token");
    var time = getCurrentDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    var businessP = "access_token=" + access_token + "&timestamp=" + encodeURI(time) + "&schoolId=" + schoolId + "&classCode=" + classCode;
    // var param = constructionParams(rsaEncryptedString(businessP), "96d35fff0f7c46f8afa90430cb7d4fa9");
    jQuery.ajax({
        type: "POST",
        // url: Global.actionURL,
        url: "http://api1.xdf.cn/SoukeRest/Class/GetClassByCode",
        async: false,//同步
        dataType: 'json',
        data: JSON.stringify(businessP),
        success: function (json) {
            if (json.Status == 1) {
                var jsonData = json.ResponseData;
                if (!jsonData.Name) {
                    layer.msg('您查询的班号不存在，或与您所在地区不匹配，请重新查询！！', {icon: 5});
                    isClassNum = false;
                    return;
                }
                $("#classInfo-div").css("display", "block");
                $("#ckName").val(jsonData.Name);
                $("#className").val(jsonData.Name);
                updateSpan("ckName", "explainInformCnt1", 12);
                courseAmount = jsonData.Fees;
                $("#courseAmount-div").html("课程金额:¥" + courseAmount);//课程费用
                var learnTime = jsonData.LearnTime;
                var startDate = jsonData.StartDate;
                var endDate = jsonData.EndDate;
                startDate = startDate.substr(0, 10);
                endDate = endDate.substr(0, 10);
                $("#learnTime-div").html("上课时间:" + startDate + "~" + endDate + ", " + learnTime);
                $("#classDate").val(startDate + "~" + endDate);//上课开始时间+上课结束时间
                $("#classTime").val(learnTime);//上课时间
                $("#courseAmount").val(courseAmount);//课程金额
                isClassNum = true;
                // queryAreaInfo(jsonData.AreaCode, jsonData.CityId);
            } else {
                layer.msg("获取班级信息失败,请联系管理员,稍后再试!", {icon: 5});
            }
            classValidateNumByChange = false;
        }
    });
}


function validate(step, isEmpty) {
    var classNum = $("#classNum").val();
    var ckName = $("#ckName").val();//筹课名称
    var className = $("#className").val();//班级名称
    var usefulPerson = $("#usefulPerson").val();//适用人群
    var raiseMoney = $("#raiseMoney").val();//筹课金额
    //var courseAmount = $("#courseAmount").val();//课程金额
    var ckIntroduce = $("#ckIntroduce").val();//筹课说明
    var service = $("#service").val();//官方客服
    //var careType = $("#careType").combotree('getValue');//类别
    var first1 = $("#hidden1").val();//app筹课配图
    var first2 = $("#hidden2").val();//微信转发配图
    var first3 = $("#hidden3").val();//公众号二维码图片
    var gzhname = $("#gzhname").val();//公众号名称

    if (step == 1) {//第一步, 判断字数长度
        var ckNameLength = ckName.length;
        if (ckNameLength > 12) {
            if ($("#className") != undefined) {
                layer.msg('活动标题不能超过12个汉字!', {icon: 5});
            } else {
                layer.msg('筹课名称不能超过12个汉字!', {icon: 5});
            }

            $("#ckName").focus();
            return false;
        }
        if (service.length > 15) {
            layer.msg('官方客服不能超过15个字符! ', {icon: 5});
            $("#service").focus();
            return false;
        }
        /*else{
         //校验输入为qq或者座机或者手机号
         var qq = "/^[1-9]*[1-9][0-9]*$/";//QQ号码
         var phone = "/^(13|15|18|17|14)[0-9]{9}$/";//手机
         var tel = "/^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$/";//电话号码的函数(包括验证国内区号,国际区号,分机号)
         if(!eval(qq).test(service) || !eval(phone).test(service) || !eval(tel).test(service)){
         layer.msg("官方客服为qq或者座机或者手机",{icon: 5 });
         return false;
         }
         }*/
        if (className != undefined && className.length > 20) {
            layer.msg('班级名称不能超过20个汉字!', {icon: 5});
            $("#className").focus();
            return false;
        }
        if (usefulPerson.length > 15) {
            //alert('适用人群不能超过15个汉字!');
            layer.msg('适用人群不能超过15个汉字!', {icon: 5});
            $("#usefulPerson").focus();
            return false;
        }
        if (raiseMoney != undefined && raiseMoney != '') {
            var reg = new RegExp("^[0-9]*$");
            if (!reg.test(raiseMoney)) {
                layer.msg('筹课请输入正整数', {icon: 5});
                $("#raiseMoney").focus();
                return false;
            }
        }
        if (ckIntroduce.length > 200) {
            //alert('筹课说明不能超过200个汉字！');
            layer.msg('筹课说明不能超过200个汉字！', {icon: 5});
            $("#ckIntroduce").focus();
            return false;
        }
    }

    if (step == 1 && isEmpty) {//第一步,判断是否为空

        if (classNum.length <= 0) {
            layer.msg('班级编号不能为空', {icon: 5});
            $("#classNum").focus();
            return false;
        }
        if (!isClassNum) {
            layer.msg('您查询的班号不存在，或与您所在地区不匹配，请重新查询！！', {icon: 5});
            $("#classNum").focus();
            return false;
        }
        if (ckName.length <= 0) {
            if ($("#className") != undefined) {
                layer.msg('活动标题不能为空', {icon: 5});
            } else {
                layer.msg('筹课名称不能为空', {icon: 5});
            }
            $("#ckName").focus();
            return false;
        }
        if (usefulPerson.length <= 0) {
            layer.msg('适用人群不能为空', {icon: 5});
            $("#usefulPerson").focus();
            return false;
        }
        // if (courseAmount.length <= 0) {
        //     layer.msg('请先校验班级编号', {icon: 5});
        //     $("#classNum").focus();
        //     return false;
        // }
        if (ckIntroduce.length <= 0) {
            layer.msg('筹课说明不能为空！', {icon: 5});
            $("#ckIntroduce").focus();
            return false;
        }
        if ($("#currentType").val() == 2) { //新筹课
            if (className.length <= 0) {
                layer.msg('班级名称不能为空！', {icon: 5});
                $("#className").focus();
                return false;
            }
            if (raiseMoney.length <= 0) {
                layer.msg('筹课金额不能为空！', {icon: 5});
                $("#raiseMoney").focus();
                return false;
            }
        }
        if (service.length <= 0) {
            layer.msg('官方客服不能为空', {icon: 5});
            $("#service").focus();
            return false;
        }

        //if (careType.length <= 0) {
        //    layer.msg('请选择类别', {icon: 5});
        //    $("#careType").focus();
        //    return false;
        //}

        // if (first1.length <= 0) {
        //     layer.msg('请上传APP筹课配图!', {icon: 5});
        //     return false;
        // }
        //
        // if (first2.length <= 0) {
        //     layer.msg('请上传微信转发配图', {icon: 5});
        //     return false;
        // }
        //
        // if (first3.length <= 0) {
        //     layer.msg('请上传公众号二维码图片', {icon: 5});
        //     return false;
        // }

        if (gzhname.length <= 0) {
            layer.msg('公众号名称不能为空', {icon: 5});
            $("#gzhname").focus();
            return false;
        }
    }

    var startDate = $("#startDate").val();//开始日期
    var startTime = $("#startTime").val();//开始时间
    var endDate = $("#endDate").val();//结束日期
    var endTime = $("#endTime").val();//结束时间
    var ruleIntroduce = $("#ruleIntroduce").val();//规则说明
    var address = $("#address").val();//兑课地址
    var phoneNum = $("#phoneNum").val();//兑课电话
    var effect = $("#effect").val();//兑换有效期
    var countList = $('input[name="count"]').map(function () {
        return this.value
    }).get();
    var perNumList = $('input[name="perNum"]').map(function () {
        return this.value
    }).get();

    if (step == 2) {
        if (ruleIntroduce.length > 300) {
            //alert('规则说明不能超过300个汉字!');
            layer.msg('规则说明不能超过300个汉字!', {icon: 5});
            $("#ruleIntroduce").focus();
            return false;
        }
        if (address.length > 30) {
            //alert('兑课地址不能超过30个汉字!');
            layer.msg('兑课地址不能超过30个汉字!', {icon: 5});
            $("#address").focus();
            return false;
        }
        if (startTime.length > 0 && !timeValidate(startTime)) {
            layer.msg('开始时间格式不正确', {icon: 5});
            return false;
        }
        if (endTime.length > 0 && !timeValidate(endTime)) {
            layer.msg('结束时间格式不正确', {icon: 5});
            return false;
        }
    }

    if (step == 2 && isEmpty) {

        if (startDate.length <= 0) {
            layer.msg('开始日期不能为空', {icon: 5});
            $("#startDate").focus();
            return false;
        }
        if (startTime.length <= 0) {
            layer.msg('开始时间不能为空', {icon: 5});
            $("#startTime").focus();
            return false;
        }
        var startdate1 = new Date((startDate + " " + startTime).replace(/-/g, "/"));
        var date = new Date();
        if (startdate1 < date) {
            layer.msg('开始时间不能小于当前时间', {icon: 5});
            return false;
        }
        if (endDate.length <= 0) {
            layer.msg('结束日期不能为空', {icon: 5});
            $("#endDate").focus();
            return false;
        }
        if (endTime.length <= 0) {
            layer.msg('结束时间不能为空', {icon: 5});
            $("#endTime").focus();
            return false;
        }
        var enddate1 = new Date((endDate + " " + endTime).replace(/-/g, "/"));
        if (enddate1 < date) {
            layer.msg('结束时间不能小于当前时间', {icon: 5});
            return false;
        }
        if (enddate1 < startdate1) {
            layer.msg('结束时间不能小于开始时间', {icon: 5});
            return false;
        }
        if (ruleIntroduce.length <= 0) {
            layer.msg('规则说明不能为空', {icon: 5});
            $("#ruleIntroduce").focus();
            return false;
        }
        if (address.length <= 0) {
            layer.msg('兑课地址不能为空', {icon: 5});
            $("#address").focus();
            return false;
        }
        if (phoneNum.length <= 0) {
            layer.msg('兑课电话不能为空', {icon: 5});
            $("#phoneNum").focus();
            return false;
        }
        if (effect.length <= 0) {
            layer.msg('兑课有效期不能为空', {icon: 5});
            $("#effect").focus();
            return false;
        }
        var effect1 = new Date((effect).replace(/-/g, "/"));
        if (effect1 < date) {
            layer.msg('兑课有效期不能小于当前时间', {icon: 5});
            return false;
        }
        if (countList.length <= 0 || perNumList.length <= 0) {
            layer.msg('帮筹名额不能为空', {icon: 5});
            return false;
        }

        for (var i = 0; i < countList.length; i++) {

            var count = countList[i];
            var perNum = perNumList[i];

            if (count.length <= 0) {
                layer.msg('第' + (i + 1) + '批名额不能为空!', {icon: 5});
                return false;
            }

            if (perNum.length <= 0) {
                layer.msg('第' + (i + 1) + '批帮筹人数不能为空!', {icon: 5});
                return false;
            }

            if (isNaN(count)) {
                layer.msg('第' + (i + 1) + '批名额请输入数字!', {icon: 5});
                return false;
            }

            if (isNaN(perNum)) {
                layer.msg('第' + (i + 1) + '批帮筹人数请输入数字!', {icon: 5});
                return false;
            }

        }
    }

    var courseName = $("#courseName").val();//课程名称
    var courseReady = $("#courseReady").val();//课程备注
    var courseIntroduce = $("#courseIntroduce").val();//课程说明

    if (step == 3) {
        if (courseName.length > 30) {
            //alert('课程名称不能超过30个汉字!');
            layer.msg('课程名称不能超过30个汉字!', {icon: 5});
            $("#courseName").focus();
            return false;
        }

        if (courseReady.length > 20) {
            //alert('课程备注不能超过20个汉字!');
            layer.msg('课程备注不能超过20个汉字!', {icon: 5});
            $("#courseReady").focus();
            return false;
        }

        if (courseIntroduce.length > 100) {
            //alert('课程说明不能超过100个汉字!');
            layer.msg('课程说明不能超过100个汉字!', {icon: 5});
            $("#courseIntroduce").focus();
            return false;
        }
    }

    if (step == 3 && isEmpty) {
        if (courseName <= 0) {
            layer.msg('课程名称不能为空', {icon: 5});
            $("#courseName").focus();
            return false;
        }

        if (courseReady.length <= 0) {
            layer.msg('课程备注不能为空', {icon: 5});
            $("#courseReady").focus();
            return false;
        }

        if (courseIntroduce.length <= 0) {
            layer.msg('课程说明不能为空', {icon: 5});
            $("#courseIntroduce").focus();
            return false;
        }
    }


    var olderRule = $("#olderRule").val();//老生抽奖规则
    var newDefine = $("#newDefine").val();//新生定义
    var oldDefine = $("#oldDefine").val();//老生定义
    var contactNumber = $("#contactNumber").val();//兑奖联系方式
    var workTime = $("#workTime").val();//工作时间
    var getcashAddress = $("#getcashAddress").val();//兑奖地址
    var usefulPersons = $("#usefulPersons").val();//适用人群
    var overTime = $("#overTime").val();//兑奖截止日期
    var helpCount = $("#helpCount").val();//帮忙人数

    if (step == 4) {

        if (olderRule.length > 300) {
            layer.msg('老生抽奖规则不能超过300个汉字!', {icon: 5});
            $("#olderRule").focus();
            return false;
        }

        if (newDefine.length > 20) {
            layer.msg('新生定义不能超过30个汉字!', {icon: 5});
            $("#newDefine").focus();
            return false;
        }

        if (oldDefine.length > 20) {
            layer.msg('老生定义不能超过20个汉字!', {icon: 5});
            $("#oldDefine").focus();
            return false;
        }

        if (contactNumber.length > 15) {
            layer.msg('兑奖联系方式不能超过20个汉字!', {icon: 5});
            $("#contactNumber").focus();
            return false;
        }

        if (workTime.length > 20) {
            layer.msg('工作时间不能超过20个汉字!', {icon: 5});
            $("#workTime").focus();
            return false;
        }

        if (getcashAddress.length > 30) {
            layer.msg('兑奖地址不能超过30个汉字!', {icon: 5});
            $("#getcashAddress").focus();
            return false;
        }

        if (usefulPersons.length > 8) {
            layer.msg('适用人群不能超过8个汉字!', {icon: 5});
            $("#usefulPersons").focus();
            return false;
        }

        if (isNaN(helpCount)) {
            layer.msg('帮忙人数请输入数字!', {icon: 5});
            $("#helpCount").focus();
            return false;
        }

        var eachFlag = true;
        $('input[name="userfulRange"]').each(function () { //批次名额
            if ($(this).val().length > 10) {
                layer.msg('适用范围不能超过10个汉字!', {icon: 5});
                eachFlag = false;
                return false;
            }
        });

        if (!eachFlag) {
            return eachFlag;
        }
    }

    var wardNameList = $('input[name="wardName"]').map(function () {
        return this.value
    }).get();
    var quantityList = $('input[name="quantity"]').map(function () {
        return this.value
    }).get();
    var weightList = $('input[name="weight"]').map(function () {
        return this.value
    }).get();
    var userfulRangeList = $('input[name="userfulRange"]').map(function () {
        return this.value
    }).get();
    var hidden4List = $('input[name="hidden4"]').map(function () {
        return this.value
    }).get();
    var wardSelect = $('select[name="select_id"]').map(function () {
        return this.value
    }).get();

    if (step == 4 && isEmpty) {

        if (olderRule <= 0) {
            layer.msg('老生抽奖规则不能为空', {icon: 5});
            $("#olderRule").focus();
            return false;
        }

        if (newDefine.length <= 0) {
            layer.msg('新生定义不能为空', {icon: 5});
            $("#newDefine").focus();
            return false;
        }

        if (oldDefine.length <= 0) {
            layer.msg('老生定义不能为空', {icon: 5});
            $("#oldDefine").focus();
            return false;
        }

        if (contactNumber.length <= 0) {
            layer.msg('兑奖联系方式不能为空', {icon: 5});
            $("#contactNumber").focus();
            return false;
        }

        if (workTime.length <= 0) {
            layer.msg('工作时间不能为空', {icon: 5});
            $("#workTime").focus();
            return false;
        }

        if (getcashAddress.length <= 0) {
            layer.msg('兑奖地址不能为空', {icon: 5});
            $("#getcashAddress").focus();
            return false;
        }

        if (usefulPersons.length <= 0) {
            layer.msg('适用人群不能为空', {icon: 5});
            $("#usefulPersons").focus();
            return false;
        }

        if (overTime.length <= 0) {
            layer.msg('兑奖截止日期不能为空', {icon: 5});
            $("#overTime").focus();
            return false;
        }

        var overTime1 = new Date((overTime).replace(/-/g, "/"));
        if (overTime1 < date) {
            layer.msg('兑奖截止日期不能小于当前时间', {icon: 5});
            return false;
        }

        if (helpCount.length <= 0) {
            layer.msg('帮忙人数不能为空', {icon: 5});
            $("#helpCount").focus();
            return false;
        }

        if (isNaN(helpCount)) {
            layer.msg('帮忙人数请输入数字', {icon: 5});
            $("#helpCount").focus();
            return false;
        }

        if (wardNameList.length <= 0) {
            layer.msg('奖品不能为空', {icon: 5});
            return false;
        }

        var wardSelectName = wardSelect.join(",") + ",";
        for (var i = 0; i < wardSelect.length; i++) {
            if (wardSelectName.replace(wardSelect[i] + ",", "").indexOf(wardSelect[i] + ",") > -1) {
                layer.msg("奖品等级重复,请重新选择");
                return false;
            }
            var wardName = wardNameList[i];
            var quantity = quantityList[i];
            var weight = weightList[i];
            var userfulRange = userfulRangeList[i];
            var hidden4 = hidden4List[i];

            if (wardName.length <= 0) {
                layer.msg('奖品名称不能为空', {icon: 5});
                return false;
            }

            if (quantity == 0) {
                layer.msg('奖品数量不能为0!');
                return false;
            }

            if (isNaN(quantity)) {
                layer.msg('奖品数量请输入数字', {icon: 5});
                return false;
            }

            if (weight.length <= 0) {
                layer.msg('中奖权重不能为空', {icon: 5});
                return false;
            }

            if (isNaN(weight)) {
                layer.msg('中奖权重请输入数字', {icon: 5});
                return false;
            }

            if (userfulRange.length <= 0) {
                layer.msg('适用范围不能为空', {icon: 5});
                return false;
            }

            if (hidden4.length <= 0) {
                layer.msg('请上传奖品图片', {icon: 5});
                return false;
            }

        }
    }

    return true;
}

//点击下一步
function next(step, isEmpty) {
    if (validate(step, isEmpty)) {
        cPage = step + 1;
        $("#first").hide();
        //$("#centerIframeId", parent.document).css("height", "900px");
        $("#second").show();
        $("#third").hide();
        $("#fourth").hide();
    }
}
//上一步
function previous(step) {
    if (step == 2) {
        $("#first").show();
        $("#second").hide();
        //$("#centerIframeId", parent.document).css("height", "800px");
        $("#third").hide();
        $("#fourth").hide();
    } else if (step == 3) {
        $("#first").hide();
        //$("#centerIframeId", parent.document).css("height", "900px");
        $("#second").show();
        $("#third").hide();
        $("#fourth").hide();
    } else if (step == 4) {
        $("#first").hide();
        $("#second").hide();
        //$("#centerIframeId", parent.document).css("height", "700px");
        $("#third").show();
        $("#fourth").hide();
    }
    cPage = step - 1;
}

//保存一个新的课程
function saveNewCk(step, isEmpty) {
    layer.load(2, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    /*if ($('#ckId').val()) {
     layer.msg("已经保存,不能重复保存", {icon: 5});
     $('.disableCss').removeAttr('onclick');
     layer.closeAll('loading');
     return;
     }*/
    if (!validate(step, isEmpty)) {
        layer.closeAll('loading');
        return;
    }
    saveOrUpdate(0);
}

//保存新筹课
function saveOrUpdate(status) {
    //第一阶段
    var userId = $("#userId", window.parent.document).val();
    var classNum = $("#classNum").val();//班级编号
    var ckName = $("#ckName").val();//筹课名称
    var className = $("#className").val();//班级名称
    var usefulPerson = $("#usefulPerson").val();//适用人群
    var courseAmount = $("#courseAmount").val();//课程金额
    var raiseMoney = $("#raiseMoney").val();//需筹金额
    var ckIntroduce = $("#ckIntroduce").val();//筹课说明
    var latitude = $("#latitude").val();//纬度
    var longitude = $("#longitude").val();//经度
    var schoolId = $("#schoolId").val();
    var areaCode = $("#areaCode").val();
    var deptCode = $("#deptCode").val();
    var classDate = $("#classDate").val();
    var classTime = $("#classTime").val();
    var classArea = $("#classArea").val();
    var service = $("#service").val();//官方客服
    var file1 = $("#hidden1").val();//筹课配图
    var file2 = $("#hidden2").val();//微信转发小图尺寸
    var file3 = $("#hidden3").val();//公众号二维码
    var gzhname = $("#gzhname").val();//公众号名称

    //第二阶段
    var startTime = $("#startDate").val() + ' ' + $("#startTime").val();//开始时间
    var endTime = $("#endDate").val() + ' ' + $("#endTime").val();//结束时间
    var ruleIntroduce = $("#ruleIntroduce").val();//规则说明
    var address = $("#address").val();//兑课地址
    var phoneNum = $("#phoneNum").val();//兑课电话
    var effect = $("#effect").val();//兑课有效期

    var ckId = $("#ckId").val();//筹课id

    var count = [];//批次名额
    var perNum = [];//帮筹人数
    $('input[name="count"]').each(function () { //批次名额
        count.push($(this).val())
    });
    $('input[name="perNum"]').each(function () { //批次名额
        perNum.push($(this).val())
    });

    var businessP = {
        "ckId": ckId,
        "status": status,
        "areaCode": areaCode,
        "latitude": latitude,
        "longitude": longitude,
        "schoolId": schoolId,
        "deptCode": deptCode,
        "className": className,
        "classDate": classDate,
        "classTime": classTime,
        "classArea": classArea,
        "userId": userId,
        "classNum": classNum,
        "ckName": ckName,
        "usefulPerson": usefulPerson,
        "courseAmount": courseAmount,
        "raiseMoney": raiseMoney,
        "ckIntroduce": ckIntroduce,
        "service": service,
        "file1": file1,
        "file2": file2,
        "file3": file3,
        "gzhname": gzhname,
        "startTime": startTime,
        "endTime": endTime,
        "ruleIntroduce": ruleIntroduce,
        "address": address,
        "phoneNum": phoneNum,
        "effect": effect,
        "count": count.join('=='),
        "perNum": perNum.join('==')
    };
    $('.disableCss').removeAttr('onclick');
    // var d = constructionParams(rsaEncryptedString(businessP), serviceId);
    jQuery.ajax({
        type: "POST",
        // url: Global.actionURL,
        async: true,
        dataType: 'json',
        data: JSON.stringify(businessP),
        success: function (json) {
            if (json.result == true) {
                if (status == 0) {
                    layer.msg(json.message, {icon: 6});
                } else if (status == 1) {
                    layer.msg(json.message, {icon: 6});
                }
                //window.location.href = 'updateCourse.html?ckId=' + json.ckId + '&flag=1';
                layer.closeAll('loading');
                changeCenter("./ckMain.html?type=2");
            } else {
                if (status == 0) {
                    layer.msg(json.message, {icon: 5});
                } else if (status == 1) {
                    layer.msg(json.message, {icon: 5});
                }
                layer.closeAll('loading');
            }
        }
    });

}

//预览
function viewPage(type) {
    if ($('#ckId').val()) {
        var previewURL = '';
        if (type == 1) {//老筹课
            previewURL = Global.previewURL;
        } else if (type == 2) {//新筹课
            previewURL = Global.previewURL_new
        }
        layer.open({
            type: 2,
            title: '预览',
            fix: false,
            shadeClose: true,
            offset: '50px',
            maxmin: true,
            area: ['414px', '736px'],
            content: previewURL + $('#ckId').val()
        });
    } else {
        layer.msg("请先保存信息,再预览!", {icon: 5})
    }
}
