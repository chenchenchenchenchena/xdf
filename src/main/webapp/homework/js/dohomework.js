/**
 * Created by use1 on 2017-07-10.
 */
$(function () {
    //点击作业排行榜
    $(document).on('touchend', '.hwRankTitle', function () {
        window.location.href = "studentrank_s.html";
    })
    //点击选择图片
    $('#chooseImage').click(function () {
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
