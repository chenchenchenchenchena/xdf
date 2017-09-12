/**
 * Created by zyc on 2017/9/10.
 */
$(function () {
    // var voiceCount = 0;
    // ajaxRequest('post', homework_s.t_mmmm, {Tcid: getRequest('tid').tid}, function (e) {
    //     var Month = e.data.homeworkTime.substr(5, 2);
    //     var Day = e.data.homeworkTime.substr(8, 2);
    //     var teaName = e.data.teacherName;
    //     var json = {
    //         'title': '' + Month + '月' + Day + '日的优秀作业',
    //         'text': '' + teaName + '老师公布了今日的优秀作业，快看看你被选中了吗？',
    //         'url': 'https://mp.weixin.qq.com/misc/getheadimg?token=547158264&fakeid=3241894319&r=715597',
    //     };
    //     weChatData(json);
    //     var data = e.data;
    //     $('.title_s i').html(data.className);
    //     $('.title_s p').eq(1).html(data.teacherName + '老师');
    //     $('.title_s p').eq(2).html('日期:' + data.homeworkTime);
    // });
   /* takeScreenshot();*/
    //获取电子作业排行数据
    getRankingData();

    function getRankingData() {

        var params = {'Tcid': "be0a11d4dde94b2a98c3b4d066baf9f1"};
        ajaxRequest("POST", homework_s.s_hw_rank_e, JSON.stringify(params), function (e) {
            if (e.result) {
                var homeworkTime = e.homeworkTime;
                var excellenHomrWork = e.excellenHomrWork;
                if (undefined != excellenHomrWork) {
                    var strHtml = "";
                    for (var i = 0; i < excellenHomrWork.length; i++) {
                        // {
                        //     "score": "100",
                        //     "times": "27:05",
                        //     "studentName": "程巾哲",
                        //     "ranking": 1
                        // }
                        var ranking = excellenHomrWork[i].ranking;
                        var studentName = excellenHomrWork[i].studentName;
                        var times = excellenHomrWork[i].times;
                        var score = excellenHomrWork[i].score;
                        var avater = "";
                        if (studentName.length > 2) {

                            avater = studentName.substring(studentName.length - 2, studentName.length);
                        } else {

                            avater = studentName;
                        }
                        if(ranking=="1"){
                            strHtml='<li>'+
                                '<span class="rankleft"><i class="rankfirst"></i><i>'+avater+'</i><i>'+studentName+'</i></span>'+
                                '<span class="rankright"><i>'+times+'</i><i>'+score+'</i></span>'+
                                '</li>';
                        }else{
                            strHtml='<li>'+
                                '<span class="rankleft"><i>'+ranking+'</i><i>'+avater+'</i><i>'+studentName+'</i></span>'+
                                '<span class="rankright"><i>'+times+'</i><i>'+score+'</i></span>'+
                                '</li>';
                        }

                        $('.rankli').append(strHtml);
                    }

                }
            }
        });

    }

// 转化html页面为canvas图像
    function takeScreenshot() {
        var height = $('.rankli').outerHeight()+$('.title_s').outerHeight();
        if($('.rankli').outerHeight()+$('.title_s').outerHeight()<=1244){
            height = 1244;
        }
        console.log($('.rankli').outerHeight()+$('.title_s').outerHeight());
        html2canvas($('body'), {
            onrendered: function(canvas) {
                document.body.appendChild(canvas);
                // $('canvas').hide();
                // $('.shared-content').hide();
                // layer.msg('加载中...');
                convertCanvasToImage();
            },
            width: $('body').width(),
            height: height
        });
    }
//	canvas to images
    function convertCanvasToImage(){
        // loading = layer.load();
        console.log("canvas to images");
        var myCanvas = document.getElementsByTagName("canvas");
        var image = myCanvas[0].toDataURL("image/png").replace("image/png", "image/octet-stream");
        // var oImgPNG = Canvas2Image.saveAsPNG(myCanvas[0], true);
        //     $('canvas,.shared-content').hide();
        // layer.close(loading);
        $('#imgs>img').attr('src',image);
        setTimeout(function(){
            $('canvas,.shared-content').hide();
        },200);


    }
})