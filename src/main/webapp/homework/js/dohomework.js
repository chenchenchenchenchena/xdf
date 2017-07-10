/**
 * Created by use1 on 2017-07-10.
 */
$(function () {
//点击作业排行榜
$(document).on('touchend','.hwRankTitle',function(){
    window.location.href="studentrank_s.html";
})
var Wxconfig =  {"url" :location.href,"appid" : "wx559791e14e9ce521","secret": "baa4373d5a8750c69b9d1655a2e31370"};
var Wxconfig_h;
$.ajax({
    url: url.w_xmor,
    type: 'post',
    dataType: 'json',
    asyns:false,
    data: JSON.stringify(Wxconfig),
    success:function(e){
        // console.log(e)
        Wxconfig_h = e;
        // console.log(Wxconfig_h.timestamp);
        //配置
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: Wxconfig.appid,   // 必填，公众号的唯一标识
            timestamp: Wxconfig_h.timestamp,   // 必填，生成签名的时间戳
            nonceStr: Wxconfig_h.nonceStr,   // 必填，生成签名的随机串
            signature: Wxconfig_h.signature, // 必填，签名
            jsApiList: ["startRecord","chooseImage","stopRecord","uploadVoice","playVoice","downloadVoice"]
        });
        //调用成功
        wx.ready(function(){
            wx.checkJsApi({
                jsApiList: ["startRecord","chooseImage","stopRecord","uploadVoice","playVoice","downloadVoice"],
                success:function(res){
                    alert(JSON.stringify(res));
                }
            })

        });
        //调用失败
        wx.error(function(res){
            alert("出错了"+res.errMsg)
        });

    }
});
//点击选择图片
$('#chooseImage').click(function () {
    console.log("8990---");
    wx.chooseImage({
        success: function (res) {
            $('.notsubmit').show();
//                    if ($('#audio').attr("src") == "" || $('#audio').attr("src") == null) {
//                        $('#audio').hide();
//                    }
            var str = "";
            if (res.localIds.length > 0) {

                for (var i = 0; i < res.localIds.length; i++) {

                    if (i % 3 == 0) {
                        str += " <div class = 'imgBox'>";
                    }
                    str += "<div><span class='stuImg'></span><img src='" + res.localIds[i] + "'/></div>";
                    if ((i + 1) % 3 == 0 || i == res.localIds.length - 1) {
                        str += "</div>";
                    }
                }
            }
            $(".notsubmit").html(str);
            alert('已选择 ' + res.localIds.length + ' 张图片');
        }
    });
});
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
