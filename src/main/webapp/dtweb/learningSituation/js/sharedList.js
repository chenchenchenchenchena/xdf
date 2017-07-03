/**
 * Created by zsj on 2017-06-28.
 */
$(function(){
    var loading,loading2;//loading效果
    //链接到分享页
    var testState = GetRequest('testState');
    var stateContent;
    if(testState=="1"){
        stateContent = "入门测";
    }else{
        stateContent = "出门测";
    }
    $('title').html(stateContent+"排行榜");//动态获取页面标题
    $('.rankTitle>span').html(stateContent);
    getRankList(testState,"shared");//

    weChatData();
    //微信分享数据
    function weChatData() {
        var urlVal = window.location.href;
        var businessP = {
            "appid": appId,
            "secret": secreT,
            "url": urlVal
        }
//			var d = constructionParams(rsaEncryptedString(businessP), "6bd249db7c52440ab7462b6d298077d9");
        jQuery.ajax({
            type: "POST",
            url: url.w_xmor,
            async: true,
            dataType: 'json',
            data: JSON.stringify(businessP),
            success: function (json) {
                console.log("注册11"+JSON.stringify(json));
                if (json.result == true) {//获取成功
//						var appId = json.appid;
                    var timestamp = json.timestamp;
                    var nonceStr = json.nonceStr;
                    var signature = json.signature;
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: 'wx559791e14e9ce521', // 必填，公众号的唯一标识
                        timestamp: timestamp, // 必填，生成签名的时间戳
                        nonceStr: nonceStr, // 必填，生成签名的随机串
                        signature: signature,// 必填，签名，见附录1
                        jsApiList: ['showMenuItems','hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                    wx.ready(function () {
                        wx.checkJsApi({
                            jsApiList:["checkJsApi",'showMenuItems','hideAllNonBaseMenuItem'],
                            success:function(res){
                                console.log("权限配置验证成功");
                            },
                            error:function(err){
                                console.log("err::"+JSON.stringify(err));
                            }
                        })
                        wx.hideAllNonBaseMenuItem();//隐藏所有非基础按钮接口
                        wx.showMenuItems({
                            menuList: ['menuItem:share:appMessage','menuItem:share:timeline','menuItem:copyUrl','menuItem:refresh'] // 要显示的菜单项，所有menu项见附录3
                        });
							// 分享到朋友圈
                        // wx.onMenuShareTimeline({
                        //     title: "", // 分享标题
                        //     link: "http://dt.staff.xdf.cn", // 分享链接
                        //     imgUrl:"", // 分享图标
                        //     success: function () {
                        //         // 用户确认分享后执行的回调函数
                        //         //$('.tan-box,.tan3,.mask,.popup,.mask-fq').hide();
                        //         // shareCmsFn();
                        //     },
                        //     cancel: function () {
                        //         // 用户取消分享后执行的回调函数
                        //         //$('.tan-box,.tan3,.mask,.popup,.mask-fq').hide();
                        //     }
                        // });
//							分享给朋友
//                         wx.onMenuShareAppMessage({
//                             title: "", // 分享标题
//                             desc: "", // 分享描述
//                             link: "http://dt.staff.xdf.cn/xdfdthome/learningSituation/sharedranking_t.html", // 分享链接
//                             imgUrl:"", // 分享图标
//                             type: '', // 分享类型,music、video或link，不填默认为link
//                             dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
//                             success: function (msg) {
//                                 console.log("success::"+JSON.stringify(msg));
//                                 // 用户确认分享后执行的回调函数
//                                 //$('.tan-box,.tan3,.mask,.popup,.mask-fq').hide();
//                                 console.log("success！！！");
// //									shareCmsFn();
//                             },
//                             cancel: function () {
//                                 // 用户取消分享后执行的回调函数
//                                 //$('.tan-box,.tan3,.mask,.popup,.mask-fq').hide();
//                             },
//                             fail:function (msg) {
//                                 console.log("fail::"+JSON.stringify(msg));
//                             }
//                         });
                        wx.error(function(res){
                            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                            console.log("errorMSG:"+res);
                        });

                        //禁用部分分享按钮
//							wx.hideMenuItems({
//								menuList: ['menuItem:share:qq',         //分享到QQ
//									'menuItem:share:weiboApp',   //分享到微博
//									'menuItem:share:facebook',   //分享到Facebook
//									'menuItem:share:QZone',      //分享到QQ空间
//									'menuItem:openWithQQBrowser',//在QQ浏览器中打开
//									'menuItem:openWithSafari',   //在Safari中打开
//									'menuItem:share:email',
////									'menuItem:copyUrl',          //复制链接
//									'menuItem:readMode'          //阅读模式
//								],
//								success: function () {
//									//alert("testing:ok");
//								},
//								error: function () {
//									//alert("testing:error");
//								}
//							});
                    });
                }
            }
        });

    }

    // 获取入门测,出门测排行列表
    function getRankList(testState,pageState) {
        var reqData = {
            // 'teaEmail':'caoxuefeng@xdf.cn',
            // 'classCode':'CZSPP008',
            // 'schoolId':'73',
            // 'gradeType':testState
            'teaEmail':localStorage.terEmail,//教师邮箱  localStorage.terEmail
            'classCode':sessionStorage.classcode, //班级编号
            'schoolId':sessionStorage.schoolId, //校区id
            'gradeType':testState // 成绩类型 1 入门测 2 出门测
        };
        $('.main-content,.no-data').hide();
        // if(pageState=="shared"){
            ajaxRequest('POST', url.t_rankl,reqData, getSharedListSuccess);
        // }else{
        //     loading = layer.load();
        //     ajaxRequest('POST', url.t_rankl,reqData, getRankListSuccess);
        // }

    }
})

/* 分享后排行榜 */
function getSharedListSuccess(msg){
    loading = layer.load();
    $(".main-content").hide();
    $(".ranklist").html("");
    if(msg.code==200){
        if(msg.data!='undefined' && msg.data.length>0){
            var datas = msg.data;
            $.each(datas,function(i,items){
                console.log(i);
                if(i<1){
                    $('.rankInfo>p:nth-of-type(1)').html(items.className);
                    $('.rankInfo>p:nth-of-type(2)').html('<span>'+items.teacherName+'老师</span><span class="mg-l">满分:'+items.fullMarks+'</span>');
                    $('.rankInfo>p:nth-of-type(3)').html('日期:'+items.lessonTime);
                }
                var rankCss,ranking,studentNo;
                //名次样式
                console.log(items.ranking==1);
                if(items.ranking==1){
                    rankCss = "rankfirst";
                    ranking = "";
                }else{
                    rankCss = "nofirst";
                    ranking = items.ranking;
                }
                // if(items.studentNo.length>8){
                    studentNo = items.studentNo.substr(0,items.studentNo.length-3)+'****';
                // }else{
                //     studentNo = items.studentNo;
                // }
                var gradeFloat = items.grade -  items.lastGrade;// 分数浮动
                var rankFloat = items.ranking -  items.lastRanking;// 名次浮动
                var sharedListHtml='<li><span class="rankleft"><i class="'+rankCss+'">'+ranking
                    +'</i><i>'+items.studentName.substr(-2,2)+'</i><i>'
                    +items.studentName+'</i></span><span class="rankright"><i>'+studentNo+'</i><i>'+items.grade+'分</i></span></li>';
                $(".ranklist").append(sharedListHtml);
                $(".ranklist,.shared-content").show();
                layer.close(loading);
            });
            console.log("页面加载完毕，开始截图！！");
            takeScreenshot();
        }else{
            layer.close(loading);
            $('.shared-content').hide();
            $('.no-data').show();
        }
    }else{
        console.log("err:"+JSON.stringify(msg));
    }
}
// 转化html页面为canvas图像
function takeScreenshot() {
    console.log('test');
    html2canvas($('body'), {
        onrendered: function(canvas) {
            document.body.appendChild(canvas);
            $('canvas').hide();
            // $('.shared-content').hide();
            // layer.msg('加载中...');
                convertCanvasToImage();
        },
//			 width: '100%',
//			 height: '100%'
    });
}
//	canvas to images
function convertCanvasToImage(){
    // loading = layer.load();
    // setTimeout(function(){
        console.log("canvas to images");
        var myCanvas = document.getElementsByTagName("canvas");
        var image = myCanvas[0].toDataURL("image/png").replace("image/png", "image/octet-stream");
        // var oImgPNG = Canvas2Image.saveAsPNG(myCanvas[0], true);
        //     $('canvas,.shared-content').hide();
            layer.close(loading);
            $('#imgs>img').attr('src',image);
    // },1000);
}
