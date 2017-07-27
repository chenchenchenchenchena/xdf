/**
 * Created by xupingwei on 2017/7/10.
 */
$(function () {
    //判断正式环境
    var onlineUrl = 'dt.xdf.cn';
    var url_o = 'http://dt.xdf.cn/xdfdtmanager/';
    var url_o2 = 'http://dt.xdf.cn';
    var appId = '';
    var secreT = '';
    if (window.location.host == onlineUrl) {//正式环境
        url_o = 'http://dt.xdf.cn/xdfdtmanager/';
        url_o2 = 'http://dt.xdf.cn';
        appId =  'wxab29a3e2000b8d2a';
        secreT = '7739991fcce774c2281147eae3986ad9';

    } else {//测试环境
        url_o = "http://dt.staff.xdf.cn/xdfdtmanager/";
        url_o2 = 'http://dt.staff.xdf.cn';
        appId =  'wx559791e14e9ce521';
        secreT = 'baa4373d5a8750c69b9d1655a2e31370';
    }
    var Wxconfig = {"url": location.href, "appid": appId, "secret": secreT};
    var Wxconfig_h;
    $.ajax({
        url: url.w_xmor,
        type: 'post',
        dataType: 'json',
        asyns: false,
        data: JSON.stringify(Wxconfig),
        success: function (e) {
            // console.log(e)
            Wxconfig_h = e;
            // console.log(Wxconfig_h.timestamp);
            //配置
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: Wxconfig.appid,   // 必填，公众号的唯一标识
                timestamp: Wxconfig_h.timestamp,   // 必填，生成签名的时间戳
                nonceStr: Wxconfig_h.nonceStr,   // 必填，生成签名的随机串
                signature: Wxconfig_h.signature, // 必填，签名
                jsApiList: ["startRecord","uploadImage", "chooseImage", "previewImage","stopRecord", "uploadVoice", "playVoice", "downloadVoice"]
            });
            //调用成功
            wx.ready(function () {
                wx.checkJsApi({
                    jsApiList: ["startRecord","uploadImage", "chooseImage", "previewImage", "stopRecord", "uploadVoice", "playVoice", "downloadVoice"],
                    success: function (res) {
                        // alert(JSON.stringify(res));
                    }
                })

            });
            //调用失败
            wx.error(function (res) {
                alert("出错了" + res.errMsg)
            });

        }
    });
})