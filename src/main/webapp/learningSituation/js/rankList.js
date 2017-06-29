/**
 * Created by zsj on 2017-06-28.
 */
$(function(){
    function tabCss(tabObj, tabClass) {
        $(document).on('touchend',tabObj, function () {
            $(this).addClass(tabClass).siblings().removeClass(tabClass);
        });
    }
    // tabCss('.tab-title li','tab-active');
    console.log("title:"+GetRequest('title'));
    console.log("title:"+decodeURI(encodeURI(GetRequest('title'))));
    $('title').html(GetRequest('title'));//动态获取页面标题
    $('.shared-content').hide();//隐藏分享页
    getRankList("1");//默认显示出门测排行榜
    // 切换tab
    $(document).on('touchend','.tab-title li', function () {
        $(this).addClass('tab-active').siblings().removeClass('tab-active');
        $('.main-content,.no-data,.shared-content').hide();
        // alert($(".tab-title li").index(this));
        // $('.main-content table').eq($(".tab-title li").index(this)).show();
        getRankList($(".tab-title li").index(this)+1);
        $('.main-content').attr('testState',$(".tab-title li").index(this)+1);
    });
    //链接到分享页
    $(document).on('touchstart','.to-shared',function () {
        // window.location.href = "sharedranking_t.html";
        $('.tab-title,.main-content,.no-data').hide();
        $('.shared-content').show();
        var testState = $('.main-content').attr('testState');
        var stateContent;
        if(testState=="1"){
            stateContent = "出门测";
        }else{
            stateContent = "入门测";
        }
        $('title').html(stateContent+"排行榜");//动态获取页面标题
        $('.rankTitle>span').html(stateContent);
        getRankList(testState,"shared");//
    });
    weChatData();
    //微信分享数据
    function weChatData() {
        var urlVal = window.location.href;
        var businessP = {
            "appid": 'wx559791e14e9ce521',
            "secret": 'baa4373d5a8750c69b9d1655a2e31370',
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
                        jsApiList: [ 'onMenuShareAppMessage','onMenuShareTimeline','showMenuItems','hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                    wx.ready(function () {
                        wx.checkJsApi({
                            jsApiList:["checkJsApi",'onMenuShareAppMessage','onMenuShareTimeline','showMenuItems','hideAllNonBaseMenuItem'],
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
//							分享到朋友圈
                        wx.onMenuShareTimeline({
                            title: "高中英语拔高班3334", // 分享标题
                            link: "http://dt.staff.xdf.cn/xdfdthome/learningSituation/sharedranking_t.html", // 分享链接
                            imgUrl:"http://dt.staff.xdf.cn/xdfdthome/schedule/images/search.png", // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                //$('.tan-box,.tan3,.mask,.popup,.mask-fq').hide();
                                shareCmsFn();
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                                //$('.tan-box,.tan3,.mask,.popup,.mask-fq').hide();
                            }
                        });
//							分享给朋友
                        wx.onMenuShareAppMessage({
                            title: "高中英语拔高班", // 分享标题
                            desc: "test share", // 分享描述
                            link: "http://dt.staff.xdf.cn/xdfdthome/learningSituation/sharedranking_t.html", // 分享链接
                            imgUrl:"http://dt.staff.xdf.cn/xdfdthome/schedule/images/search.png", // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function (msg) {
                                console.log("success::"+JSON.stringify(msg));
                                // 用户确认分享后执行的回调函数
                                //$('.tan-box,.tan3,.mask,.popup,.mask-fq').hide();
                                console.log("success！！！");
//									shareCmsFn();
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                                //$('.tan-box,.tan3,.mask,.popup,.mask-fq').hide();
                            },
                            fail:function (msg) {
                                console.log("fail::"+JSON.stringify(msg));
                            }
                        });
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
    // 微信分享
    $(document).on('touchstart',"#wecharShare",function() {
        alert("微信分享事件触发111");
    // weChatData();
    });
    
    // 获取入门测,出门测排行列表
    function getRankList(testState,pageState) {
        var reqData = {
            'teaEmail':'test@xdf.cn', //教师邮箱
            'classCode':'001', //班级编号
            'schoolId':'73', //校区id
            'gradeType':testState // 成绩类型 1 入门测 2 出门测
        };
        if(pageState=="shared"){
            ajaxRequest('POST', url.t_rankl,reqData, getSharedListSuccess);
        }else{
            ajaxRequest('POST', url.t_rankl,reqData, getRankListSuccess);
        }

    }

    function getRankListSuccess(msg){
        $(".main-content>table>tbody").html(" ");
        if(msg.code==200){
            if(msg.data!='undefined' && msg.data.length>0){
                var datas = msg.data;
                var rankTitleHtml = '<tr><th>排名</th><th>姓名</th><th>本次分数</th><th>分数浮动</th>'
                    +'<th>名次浮动</th><th><img class="to-shared" src="images/shareIcon.png" alt="分享"/></th></tr>';
                $(".intro-test>tbody").html(rankTitleHtml);
                $.each(datas,function(i,items){
                    var rankCss,floatGradeCss,floatRankCss;
                    //名次样式
                    if(items.ranking==1){
                        rankCss = "first-num";
                    }else{
                        rankCss = "";
                    }
                    var gradeFloat = items.grade -  items.lastGrade;// 分数浮动
                    var rankFloat = items.ranking -  items.lastRanking;// 名次浮动
                    if (gradeFloat>=0){
                        floatGradeCss = "state-up";
                    }else{
                        floatGradeCss = "state-down";
                    }
                    if (rankFloat<=0){
                        floatRankCss = "state-up";
                    }else{
                        floatRankCss = "state-down";
                    }
                    var rankListHtml='<tr><td><span class="'+rankCss+'">'+items.ranking+'</span></td>'
                        +'<td>'+items.studentName+'</td><td>'+items.grade+'</td>'
                        +'<td><i class="change-state '+floatGradeCss+'"></i>'+parseInt(Math.abs(gradeFloat))+'分</td>'
                        +'<td><i class="change-state '+floatRankCss+'"></i>'+parseInt(Math.abs(rankFloat))+'名</td>'
                        +'<td><a class="link-to" href="../homework/dohomework_t.html"></a></td>'
                        +'</tr>';
                    $(".intro-test>tbody").append(rankListHtml);
                    $(".no-data").hide();
                    $(".main-content").show();
                });
            }else{
                // $('.hwEmpty p').html("您没有已交作业哦~");
                $('.main-content').hide();
                $('.no-data').show();
            }
        }else{
            console.log("err:"+JSON.stringify(msg));
        }
    }


})

/* 分享后排行榜 */
function getSharedListSuccess(msg){
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
                if(items.ranking==1){
                    rankCss = "rankfirst";
                    ranking = "";
                }else{
                    rankCss = "nofirst";
                    ranking = items.ranking;
                }
                if(items.studentNo.length>8){
                    studentNo = items.studentNo.substr(0,2)+'****'+items.studentNo.substr(-2,2);
                }else{
                    studentNo = items.studentNo;
                }
                var gradeFloat = items.grade -  items.lastGrade;// 分数浮动
                var rankFloat = items.ranking -  items.lastRanking;// 名次浮动
                var sharedListHtml='<li><span class="rankleft"><i class="rankfirst">'+ranking
                    +'</i><i>'+items.studentName+'</i><i>'
                    +items.studentName+'</i></span><span class="rankright"><i>'+studentNo+'</i><i>'+items.lastGrade+'分</i></span></li>';
                $(".ranklist").append(sharedListHtml);
                $(".ranklist").show();

            });
            console.log("页面加载完毕，开始截图！！");
            takeScreenshot();
        }else{
            // $('.hwEmpty p').html("您没有已交作业哦~");
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
            $('.shared-content').hide();
//				convertCanvasToImage();
        },
//			 width: '100%',
//			 height: '100%'
    });
}
//	canvas to images
function convertCanvasToImage(){
    console.log("canvas to images");
//		var image = new Image();
//		image.src = canvas.toDataURL("image/png");
    var myCanvas = document.getElementsByTagName("canvas");
//		var dataURL = myCanvas[0].toDataURL();

    var image = myCanvas[0].toDataURL("image/png").replace("image/png", "image/octet-stream");
    console.log(image);
//		window.location.href=image;

    console.log(canvas.toDataURL("image/png"));
    return image;
}
