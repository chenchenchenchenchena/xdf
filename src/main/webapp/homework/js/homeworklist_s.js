$(function(){

	//缓存数据 TODO
	sessionStorage.stuNumber = GetRequest('stuNumber');
	sessionStorage.studentName = GetRequest('studentName');
	// sessionStorage.stuNumber = 'SS5786';
	// sessionStorage.studentName = '郭紫楚';
	sessionStorage.schoolId = '73';
	// localStorage.classCode = 'hx001';
	var loading;
	//点击待交作业
	$(".secul").hide();
	// $(".hwContent").show();
	$(".hwFinish,.hwContent,.hwEmpty").hide();
	loading = layer.load();
	var reqData = 'stuNum='+sessionStorage.stuNumber;
	ajaxRequest('GET', homework_s.s_hwlt, reqData, getHwContentSuccess);
	$(".hwHeader ul li").click(function(){
		$(".hwFinish,.hwContent,.hwEmpty").hide();
		if($(this).index()==0){
			$(".hwFinish,.hwEmpty").hide();
			loading = layer.load();
			ajaxRequest('GET', homework_s.s_hwlt, 'stuNum='+sessionStorage.stuNumber, getHwContentSuccess);
		}else{
			$(".hwContent,.hwEmpty").hide();
			var reqData = {
				'stuNum':sessionStorage.stuNumber //学生编号
			};
			loading = layer.load();
			ajaxRequest('POST', homework_s.s_hwfl, reqData, getHwFinishSuccess);
		}
		// $(this).addClass("hwShow").siblings("li").removeClass("hwShow");
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
	$(document).on('tap','.hwList',function(){
		sessionStorage.removeItem('homeworkInfos');
		window.location.href = 'dohomework_s.html?id='+$(this).attr('data-id');
	});
	// 点击已交作业列表
	$(document).on('touchend','.secul>li',function(){
		// sessionStorage.removeItem('finishhwInfos');
		var curIndex = $(this).parents('.firstList').index();
		var classIndex = $(this).index();
		console.log($(this).parents('.firstList').index()+"---"+$(this).index());
		//点击已完成列表-阅读
		ajaxRequest('GET', homework_s.s_readstatus, 'classCode='+$(this).attr('data-classCode'), function(msg){
			if(msg.code==200){
				console.log("阅读成功！"+msg.msg);
			}else{
				console.log("阅读失败！"+msg.msg);
			}
			window.location.href = 'finishedhomework_s.html?curIndex='+curIndex+'&classIndex='+classIndex;
		});

	});

	//获取待交作业列表
	var homeworkInfosArray=[];
	function getHwContentSuccess(msg) {
		loading = layer.load();
		$(".hwContent").html(" ");
		if(msg.code==200){
			if(msg.data.length>0){
				var datas = msg.data;
				$.each(datas,function(i,item){
					var classTitle = item.className;
					//课程名称显示控制
					if (item.className.length>11){
						classTitle = item.className.substr(0,10)+'...';
					}
					var knowledgePoint, kpHtml = "";
					var homeworkInfos ={//作业信息：知识点，描述，图片，语音
						'id':item.id,//学生作业主键id
						'homeworkTId':item.homeworkTId,//老师作业主键id
						'classCode':item.classCode,
						'knowledgePoint':item.knowledgePoint,
						'description':item.description,
						'fileContents':item.fileContents
					};
					homeworkInfosArray.push(homeworkInfos);
					// localStorage.homeworkInfos = JSON.stringify(homeworkInfos);
					console.log(typeof homeworkInfosArray);
					if(item.knowledgePoint!="" && item.knowledgePoint!=null && item.knowledgePoint!=undefined){

						knowledgePoint =splitStrs(item.knowledgePoint);
						console.log(knowledgePoint+"----"+knowledgePoint.length);
						for(var i = 0;i<knowledgePoint.length;i++){
							kpHtml += '<span>'+knowledgePoint[i]+'</span>';
						}
					}
					var homeworkTime = item.homeworkTime.substr(0,4)+"年"+item.homeworkTime.substr(5,2)+"月"+item.homeworkTime.substr(8,2)+"日";
					console.log(kpHtml);
					var hwListHtml = '<div class="hwList" data-id="'+item.id+'">'
						+'<div class="hwLeft">'+item.courseName+'</div>'
						+'<div class="hwRight">'
						+'<div class="hwTime"><span>'+classTitle+'</span>'
						+'<span>'+homeworkTime+'</span></div>'
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
		}else{
			$('.hwEmpty p').html("您没有待交作业哦~");
			$('.hwEmpty').show();
		}
		$(".hwHeader ul li:eq(0)").addClass("hwShow").siblings("li").removeClass("hwShow");
		layer.close(loading);
	}
//获取已完成作业列表
	function getHwFinishSuccess(msg){
		$(".hwFinish>ul").html(" ");
		if(msg.code==200){
			if(msg.data.length>0){
				var datas = msg.data;
				// localStorage.finishhwInfos = JSON.stringify(datas);
				localStorage.finishhwInfos = JSON.stringify({
					'data':datas
				});
				$.each(datas,function(i,items){
					var lessNos = items.lessNos;
					var hwLessNosHtml='',readStatus='',replay=0;

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
								// replay=1;
								break;
						}
						hwLessNosHtml +='<li data-classCode="'+items.classCode+'"><span>'+item.homeworkTime.substr(5)+'日作业</span><span class="'+statusCss+'">'+replyStatus+'</span></li>';
					});
					//红点显示判断
					// if (replay==1&&items.readStatus==0){
					if (items.readStatus==0){
						readStatus = "redCircle";
					}
					console.log(hwLessNosHtml);
					var className = items.className;
					if (items.className.length>18){
						className = items.className.substr(0,15)+"...";
					}
					var hwListFinishHtml = '<li class="firstList">'
						+'<p>'+className+'('+items.teacherName+')<span class="'+readStatus+'"></span></p>'
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
		}else{
			$('.hwEmpty p').html("您没有已交作业哦~");
			$('.hwEmpty').show();
		}
		$(".hwHeader ul li:eq(1)").addClass("hwShow").siblings("li").removeClass("hwShow");
		layer.close(loading);
	}

})






