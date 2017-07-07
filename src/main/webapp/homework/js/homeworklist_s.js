$(function(){
	//点击待交作业
	$(".secul").hide();
	// $(".hwContent").show();
	$(".hwFinish,.hwContent,.hwEmpty").hide();
	var reqData = 'stuNum=ss58';
	ajaxRequest('GET', url.s_hwlt, reqData, getHwContentSuccess);
	$(".hwHeader ul li").click(function(){
		$(this).addClass("hwShow").siblings("li").removeClass("hwShow");
		if($(this).index()==0){
			$(".hwFinish,.hwEmpty").hide();
			ajaxRequest('GET', url.s_hwlt, 'stuNum=ss58', getHwContentSuccess);
		}else{
			$(".hwContent,.hwEmpty").hide();
			var reqData = {
				'stuNum':'SS1872' //学生编号
			};
			ajaxRequest('POST', url.s_hwfl, reqData, getHwFinishSuccess);

		}
	})
	//点击已交作业列表
	var flag=true;
	$(document).on('touchend','.firstList',function(){
		if(flag){
			$(this).css("background","url(images/jiao11.png) no-repeat right 55px");
			flag=false;
		}else{
			$(this).css("background","url(images/jiao22222.png) no-repeat right 55px");
			flag=true;
		}
		$(this).find(".secul").toggle();
	});
	// 跳转到做作业页面
	$(document).on('touchend','.hwContent .hwList',function(){
		window.location.href = 'dohomework_s.html';
	});
	// 跳转到已完成作业页面
	$(document).on('touchend','.hwContent .hwList',function(){
		window.location.href = 'finishedhomework_s.html';
	});
})

//获取待交作业列表
function getHwContentSuccess(msg) {
	var msg = {
		"code":"200",
		"data":[
			{
				"id":"scscsc",
				"lessonNo":0,
				"lessonTime":"10:00-12:00",
				"className":"三年级英语综合培优寒假班",
				"courseName":"双师",
				"homeworkTId":"07dc6bc9a1f14c44a2fc67567a036c98",
				"description":"高数",
				"status":0,
				"readStatus":0,
				"fileContents":[
					{
						"fileName":"cxcc",
						"fileSize":"0.1MB",
						"fileType":"jpg",
						"homeworkTinfoId":"07dc6bc9a1f14c44a2fc67567a036c98",
						"id":"2"
					},
					{
						"fileName":"3b7b2d2e503740f3ba48c299e59e3fa7.png",
						"fileSize":"0.2MB",
						"fileType":"png",
						"homeworkTinfoId":"07dc6bc9a1f14c44a2fc67567a036c98",
						"id":"652338c684914a59b6a6181b32065858",
						"url":"http://192.168.23.1:8080\null\3b7b2d2e503740f3ba48c299e59e3fa7.png"
					}
				]
			},
			{
				"id":"scscsc",
				"lessonNo":0,
				"lessonTime":"10:00-12:00",
				"className":"三年级英语综合培优寒假班",
				"courseName":"双师",
				"homeworkTId":"07dc6bc9a1f14c44a2fc67567a036c98",
				"description":"高数",
				"status":0,
				"readStatus":0,
				"fileContents":[
					{
						"fileName":"cxcc",
						"fileSize":"0.1MB",
						"fileType":"jpg",
						"homeworkTinfoId":"07dc6bc9a1f14c44a2fc67567a036c98",
						"id":"2"
					},
					{
						"fileName":"3b7b2d2e503740f3ba48c299e59e3fa7.png",
						"fileSize":"0.2MB",
						"fileType":"png",
						"homeworkTinfoId":"07dc6bc9a1f14c44a2fc67567a036c98",
						"id":"652338c684914a59b6a6181b32065858",
						"url":"http://192.168.23.1:8080\null\3b7b2d2e503740f3ba48c299e59e3fa7.png"
					}
				]
			},
			{
				"id":"scscsc",
				"lessonNo":0,
				"lessonTime":"10:00-12:00",
				"className":"三年级英语综合培优寒假班",
				"courseName":"双师",
				"homeworkTId":"07dc6bc9a1f14c44a2fc67567a036c98",
				"description":"高数",
				"status":0,
				"readStatus":0,
				"fileContents":[
					{
						"fileName":"cxcc",
						"fileSize":"0.1MB",
						"fileType":"jpg",
						"homeworkTinfoId":"07dc6bc9a1f14c44a2fc67567a036c98",
						"id":"2"
					},
					{
						"fileName":"3b7b2d2e503740f3ba48c299e59e3fa7.png",
						"fileSize":"0.2MB",
						"fileType":"png",
						"homeworkTinfoId":"07dc6bc9a1f14c44a2fc67567a036c98",
						"id":"652338c684914a59b6a6181b32065858",
						"url":"http://192.168.23.1:8080\null\3b7b2d2e503740f3ba48c299e59e3fa7.png"
					}
				]
			},
			{
				"id":"scscsc",
				"lessonNo":0,
				"lessonTime":"10:00-12:00",
				"className":"三年级英语综合培优寒假班",
				"courseName":"双师",
				"homeworkTId":"07dc6bc9a1f14c44a2fc67567a036c98",
				"description":"高数",
				"status":0,
				"readStatus":0,
				"fileContents":[
					{
						"fileName":"cxcc",
						"fileSize":"0.1MB",
						"fileType":"jpg",
						"homeworkTinfoId":"07dc6bc9a1f14c44a2fc67567a036c98",
						"id":"2"
					},
					{
						"fileName":"3b7b2d2e503740f3ba48c299e59e3fa7.png",
						"fileSize":"0.2MB",
						"fileType":"png",
						"homeworkTinfoId":"07dc6bc9a1f14c44a2fc67567a036c98",
						"id":"652338c684914a59b6a6181b32065858",
						"url":"http://192.168.23.1:8080\null\3b7b2d2e503740f3ba48c299e59e3fa7.png"
					}
				]
			},
			{
				"id":"scscsc",
				"lessonNo":0,
				"lessonTime":"10:00-12:00",
				"className":"三年级英语综合培优寒假班",
				"courseName":"双师",
				"homeworkTId":"07dc6bc9a1f14c44a2fc67567a036c98",
				"description":"高数",
				"status":0,
				"readStatus":0,
				"fileContents":[
					{
						"fileName":"cxcc",
						"fileSize":"0.1MB",
						"fileType":"jpg",
						"homeworkTinfoId":"07dc6bc9a1f14c44a2fc67567a036c98",
						"id":"2"
					},
					{
						"fileName":"3b7b2d2e503740f3ba48c299e59e3fa7.png",
						"fileSize":"0.2MB",
						"fileType":"png",
						"homeworkTinfoId":"07dc6bc9a1f14c44a2fc67567a036c98",
						"id":"652338c684914a59b6a6181b32065858",
						"url":"http://192.168.23.1:8080\null\3b7b2d2e503740f3ba48c299e59e3fa7.png"
					}
				]
			}
		],
		"status":"success"
	};
	$(".hwContent").html(" ");
	if(msg.code==200){
		if(msg.data.length>0){
			var datas = msg.data;
			$.each(datas,function(i,item){
				var classTitle = "";
				//课程名称显示控制
				if (item.className.length==8){
					classTitle = item.className.substr(0,8)+'(第'+item.lessonNo+'课次)';
				}else if (item.className.length>=10){
					classTitle = item.className.substr(0,6)+'...(第'+item.lessonNo+'课次)';
				}else{
					classTitle = item.className+'(第'+item.lessonNo+'课次)';
				}
				var hwListHtml = '<div class="hwList">'
					+'<div class="hwLeft">'+item.courseName+'</div>'
					+'<div class="hwRight">'
					+'<div class="hwTime"><span>'+classTitle+'</span>'
					+'<span>'+item.lessonTime+'</span></div>'
					+'<div class="hwKon"><span>'+item.description+'</span>'
					+'<span>'+item.description+'</span></div></div></div>';
				$(".hwContent").append(hwListHtml);
				$(".hwContent").show();
			});
		}else{
			$('.hwEmpty p').html("您没有待交作业哦~");
			$('.hwEmpty').show();
		}
	}else{
		$('.hwEmpty p').html("您没有待交作业哦~");
		$('.hwEmpty').show();
	}

}
//获取已完成作业列表
function getHwFinishSuccess(msg){
	// var msg = {
	// 	"code": "200",
	// 	"data": [],
	// 	"status": "success"
	// };
	$(".hwFinish>ul").html(" ");
	if(msg.code==200){
		if(msg.data.length>0){
			var datas = msg.data;
			$.each(datas,function(i,items){
				var lessNos = items.lessNos;
				var hwLessNosHtml='',readStatus='';
				if (items.readStatus!=1){
					readStatus = "redCircle";
				}
				$.each(lessNos,function(i,item){
					var replyStatus = "";
					switch (item.replyStatus){
						case 0:
							replyStatus = '未批';
							break;
						case 1:
							replyStatus = '已批';
							break;
					}
					hwLessNosHtml +='<li><span>第'+item.lessonNo+'课次</span><span>'+item.lessonTime+'</span><span class="blue">'+replyStatus+'</span></li>';
				});
				console.log(hwLessNosHtml);
				var hwListFinishHtml = '<li class="firstList">'
					+'<p>'+items.className+'('+items.teacherName+')</p><span class="'+readStatus+'"></span>'
					+'<ul class="secul">'+hwLessNosHtml+'</ul>'
					+'</li>';
				$(".hwFinish>ul").append(hwListFinishHtml);
				$(".hwFinish").show();
				$(".hwFinish .secul").hide();

			});
		}else{
			$('.hwEmpty p').html("您没有已交作业哦~");
			$('.hwEmpty').show();
		}
	}
}