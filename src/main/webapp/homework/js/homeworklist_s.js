$(function(){
	//点击待交作业
	$(".secul").hide();
	// $(".hwContent").show();
	$(".hwFinish,.hwContent,.hwEmpty").hide();
	var reqData = 'stuNum=SS5702';
	ajaxRequest('GET', homework_s.s_hwlt, reqData, getHwContentSuccess);
	$(".hwHeader ul li").click(function(){
		$(this).addClass("hwShow").siblings("li").removeClass("hwShow");
		if($(this).index()==0){
			$(".hwFinish,.hwEmpty").hide();
			ajaxRequest('GET', homework_s.s_hwlt, 'stuNum=SS893', getHwContentSuccess);
		}else{
			$(".hwContent,.hwEmpty").hide();
			var reqData = {
				'stuNum':'SS5702' //学生编号
			};
			ajaxRequest('POST', homework_s.s_hwfl, reqData, getHwFinishSuccess);

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
	})
	//点击作业排行榜
	$(".hwRankTitle").click(function(){
		location.href="studentrank_s.html";
	});
	// 点击待交作业列表
	$(document).on('touchend','.hwList',function(){
		sessionStorage.removeItem('homeworkInfos');
		window.location.href = 'dohomework_s.html?id='+$(this).attr('data-id');
	});
	// 点击已交作业列表
	$(document).on('touchend','.secul>li',function(){
		// sessionStorage.removeItem('finishhwInfos');
		console.log($(this).parents('.firstList').index()+"---"+$(this).index());
		window.location.href = 'finishedhomework_s.html?curIndex='+$(this).parents('.firstList').index()+'&classIndex='+$(this).index();
	});
})

//获取待交作业列表
var homeworkInfosArray=[];
function getHwContentSuccess(msg) {
	var msg = {
		"code": "200",
		"data": [
			{
				"id": "022765ae376a4feab2ce64777050474f",
				"lessonNo": 0,
				"teacherName": "高伟",
				"homeworkTime": "2017-07-11",
				"knowledgePoint": "知识点1,知识点2",
				"className": "中考提高物理暑假班",
				"courseName": "双师",
				"homeworkTId": "9076ac7323144324a53ae24d594abced",
				"description": "这是测试数据",
				"status": 0,
				"readStatus": 0,
				"fileContents": [
					{
						"diskFilePath": "homework/73/HDXP5MB01/0711",
						"fileName": "文件1",
						"fileSize": "12345",
						"fileType": "jpg",
						"id": "c572b982b22149a5ab2e5d98650a3e3c",
						"uploadTime": 1499773427000
					},
					{
						"diskFilePath": "homework/73/HDXU3PB01/0711",
						"fileName": "文件1",
						"fileSize": "23564",
						"fileType": "MP3",
						"id": "c84c4da06da9470283588366812f7d01",
						"uploadTime": 1499773427000
					}
				]
			},
			{
				"id": "022765ae376a4feab2ce64777050474f",
				"lessonNo": 0,
				"teacherName": "高伟",
				"homeworkTime": "2017-07-11",
				"knowledgePoint": "知识点1,知识点2",
				"className": "中考提高物理暑假班",
				"courseName": "双师",
				"homeworkTId": "9076ac7323144324a53ae24d594abced",
				"description": "如图，test点E为正方形ABCD的边CD上的一点，点F为CB的延长线上的一点，且EA垂直AF,求证：DE=BF.",
				"status": 0,
				"readStatus": 0,
				"fileContents": [
					{
						"diskFilePath": "homework/73/HDXP5MB01/0711",
						"fileName": "文件1",
						"fileSize": "12345",
						"fileType": "jpg",
						"id": "c572b982b22149a5ab2e5d98650a3e3c",
						"uploadTime": 1499773427000
					},
					{
						"diskFilePath": "homework/73/HDXU3PB01/0711",
						"fileName": "文件1",
						"fileSize": "23564",
						"fileType": "MP3",
						"id": "c84c4da06da9470283588366812f7d01",
						"uploadTime": 1499773427000
					}
				]
			}
		],
		"status": "success"
	};
	$(".hwContent").html(" ");
	if(msg.code==200){
		if(msg.data.length>0){
			var datas = msg.data;
			$.each(datas,function(i,item){
				var classTitle = item.className;
				//课程名称显示控制
				// if (item.className.length==8){
				// 	classTitle = item.className.substr(0,8)+'(第'+item.lessonNo+'课次)';
				// }else if (item.className.length>=10){
				// 	classTitle = item.className.substr(0,6)+'...(第'+item.lessonNo+'课次)';
				// }else{
				// 	classTitle = item.className+'(第'+item.lessonNo+'课次)';
				// }
				var knowledgePoint, kpHtml = "";
				var homeworkInfos ={//作业信息：知识点，描述，图片，语音
					'id':item.id,
					'knowledgePoint':item.knowledgePoint,
					'description':item.description,
					'fileContents':item.fileContents
				};
				homeworkInfosArray.push(homeworkInfos);
				// localStorage.homeworkInfos = JSON.stringify(homeworkInfos);
				console.log(typeof homeworkInfosArray);
				if(item.knowledgePoint!="" && item.knowledgePoint!=null && item.knowledgePoint!=undefined){
					knowledgePoint = item.knowledgePoint.split(',');
					for(var i = 0;i<knowledgePoint.length;i++){
						kpHtml += '<span>'+knowledgePoint[i]+'</span>';
					}
				}

				console.log(kpHtml);
				var hwListHtml = '<div class="hwList" data-id="'+item.id+'">'
					+'<div class="hwLeft">'+item.courseName+'</div>'
					+'<div class="hwRight">'
					+'<div class="hwTime"><span>'+classTitle+'</span>'
					+'<span>'+item.homeworkTime+'</span></div>'
					+'<div class="hwKon">'+kpHtml+'</div></div></div>';
				$(".hwContent").append(hwListHtml);
				$(".hwContent").show();
			});
			localStorage.homeworkInfos = JSON.stringify({
				'data':homeworkInfosArray
			});
		}else{
			$('.hwEmpty p').html("您没有待交作业哦~");
			$('.hwEmpty').show();
		}
	}

}
//获取已完成作业列表
function getHwFinishSuccess(msg){
	var msg = {
		"code": "200",
		"data": [
			{
				"readStatus": 0,
				"lessNos": [
					{
						"id": "022765ae376a4feab2ce64777050474f",
						"teaHomeworkReplyFiles": [
							{
								"diskFilePath": "homework/73/HDXP5MB01/0711",
								"fileName": "文件1",
								"fileSize": "12345",
								"fileType": "jpg",
								"id": "c572b982b22149a5ab2e5d98650a3e3c",
								"uploadTime": 1499773427000
							},
							{
								"diskFilePath": "homework/73/HDXU3PB01/0711",
								"fileName": "文件1",
								"fileSize": "23564",
								"fileType": "MP3",
								"id": "c84c4da06da9470283588366812f7d01",
								"uploadTime": 1499773427000
							}
						],
						"teacherDes": "这是测试数据",
						"stuHomeworkFiles": [
							{
								"diskFilePath": "aaa/bbb/ccc",
								"fileName": "学生作业",
								"fileSize": "3356",
								"fileType": "jpg",
								"homeworkSinfoId": "022765ae376a4feab2ce64777050474f",
								"id": "sxsxsxsx"
							}
						],
						"status": 1,
						"description": "这是我的作业答复",
						"replyStatus": 0,
						"teaHomeworkFiles": [
							{
								"diskFilePath": "homework/73/HDXP5MB01/0711",
								"fileName": "文件1",
								"fileSize": "12345",
								"fileType": "jpg",
								"id": "c572b982b22149a5ab2e5d98650a3e3c",
								"uploadTime": 1499773427000
							},
							{
								"diskFilePath": "homework/73/HDXU3PB01/0711",
								"fileName": "文件1",
								"fileSize": "23564",
								"fileType": "MP3",
								"id": "c84c4da06da9470283588366812f7d01",
								"uploadTime": 1499773427000
							}
						],
						"teacherKnowledgePoint": "知识点1,知识点2",
						"homeworkTime": "2017-07-11",
						"lessonNo": 0
					}
				],
				"classCode": "HDXU3PB01",
				"className": "中考提高物理暑假班",
				"teacherName": "高伟"
			},
			{
				"readStatus": 0,
				"lessNos": [
					{
						"id": "022765ae376a4feab2ce64777050474f",
						"teaHomeworkReplyFiles": [
							{
								"diskFilePath": "homework/73/HDXP5MB01/0711",
								"fileName": "文件1",
								"fileSize": "12345",
								"fileType": "jpg",
								"id": "c572b982b22149a5ab2e5d98650a3e3c",
								"uploadTime": 1499773427000
							},
							{
								"diskFilePath": "homework/73/HDXU3PB01/0711",
								"fileName": "文件1",
								"fileSize": "23564",
								"fileType": "MP3",
								"id": "c84c4da06da9470283588366812f7d01",
								"uploadTime": 1499773427000
							}
						],
						"teacherDes": "这是测试数据",
						"stuHomeworkFiles": [
							{
								"diskFilePath": "aaa/bbb/ccc",
								"fileName": "学生作业",
								"fileSize": "3356",
								"fileType": "jpg",
								"homeworkSinfoId": "022765ae376a4feab2ce64777050474f",
								"id": "sxsxsxsx"
							}
						],
						"status": 1,
						"description": "作业描述2222",
						"replyStatus": 0,
						"teaHomeworkFiles": [
							{
								"diskFilePath": "homework/73/HDXP5MB01/0711",
								"fileName": "文件1",
								"fileSize": "12345",
								"fileType": "jpg",
								"id": "c572b982b22149a5ab2e5d98650a3e3c",
								"uploadTime": 1499773427000
							},
							{
								"diskFilePath": "homework/73/HDXU3PB01/0711",
								"fileName": "文件1",
								"fileSize": "23564",
								"fileType": "MP3",
								"id": "c84c4da06da9470283588366812f7d01",
								"uploadTime": 1499773427000
							}
						],
						"teacherKnowledgePoint": "知识点11,知识点21",
						"homeworkTime": "2017-07-11",
						"lessonNo": 0
					},
					{
						"id": "022765ae376a4feab2ce64777050474f",
						"teaHomeworkReplyFiles": [
							{
								"diskFilePath": "homework/73/HDXP5MB01/0711",
								"fileName": "文件1",
								"fileSize": "12345",
								"fileType": "jpg",
								"id": "c572b982b22149a5ab2e5d98650a3e3c",
								"uploadTime": 1499773427000
							},
							{
								"diskFilePath": "homework/73/HDXU3PB01/0711",
								"fileName": "文件1",
								"fileSize": "23564",
								"fileType": "MP3",
								"id": "c84c4da06da9470283588366812f7d01",
								"uploadTime": 1499773427000
							}
						],
						"teacherDes": "这是测试数据8888888",
						"stuHomeworkFiles": [
							{
								"diskFilePath": "aaa/bbb/ccc",
								"fileName": "学生作业",
								"fileSize": "3356",
								"fileType": "jpg",
								"homeworkSinfoId": "022765ae376a4feab2ce64777050474f",
								"id": "sxsxsxsx"
							}
						],
						"status": 1,
						"description": "作业描述8888888888",
						"replyStatus": 0,
						"teaHomeworkFiles": [
							{
								"diskFilePath": "homework/73/HDXP5MB01/0711",
								"fileName": "文件1",
								"fileSize": "12345",
								"fileType": "jpg",
								"id": "c572b982b22149a5ab2e5d98650a3e3c",
								"uploadTime": 1499773427000
							},
							{
								"diskFilePath": "homework/73/HDXU3PB01/0711",
								"fileName": "文件1",
								"fileSize": "23564",
								"fileType": "MP3",
								"id": "c84c4da06da9470283588366812f7d01",
								"uploadTime": 1499773427000
							}
						],
						"teacherKnowledgePoint": "知识点11,知识点21",
						"homeworkTime": "2017-07-11",
						"lessonNo": 0
					}
				],
				"classCode": "HDXU3PB01",
				"className": "中考提高物理暑假班",
				"teacherName": "高伟"
			}
		],
		"status": "success"
	};
	// var msg = {
	// 	"code": "200",
	// 	"data": [],
	// 	"status": "success"
	// };
	$(".hwFinish>ul").html(" ");
	if(msg.code==200){
		if(msg.data.length>0){
			var datas = msg.data;
			// localStorage.finishhwInfos = JSON.stringify(datas);
			$.each(datas,function(i,items){
				var lessNos = items.lessNos;
				var hwLessNosHtml='',readStatus='';
				if (items.readStatus!=1){
					readStatus = "redCircle";
				}
				$.each(lessNos,function(i,item){
					var replyStatus = "",statusCss="";
					switch (item.replyStatus){
						case 0:
							replyStatus = '未批';
							statusCss = 'grey';
							break;
						case 1:
							replyStatus = '已批';
							statusCss = 'blue';
							break;
					}
					hwLessNosHtml +='<li><span>第'+item.lessonNo+'课次</span><span>'+item.homeworkTime+'</span><span class="'+statusCss+'">'+replyStatus+'</span></li>';
				});
				console.log(hwLessNosHtml);
				var hwListFinishHtml = '<li class="firstList">'
					+'<p>'+items.className+'('+items.teacherName+')<span class="'+readStatus+'"></span></p>'
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