$(function(){
	// window.location.reload();
	//缓存数据 TODO
	/*if(sessionStorage.stuNumber!=""||sessionStorage.stuNumber!=null||sessionStorage.stuNumber!=undefined){
		sessionStorage.stuNumber = GetRequest('stuNumber');
		sessionStorage.studentName = GetRequest('studentName');
	}*/

	sessionStorage.stuNumber = 'ss2856';
	//sessionStorage.studentName = '刘一硕';
	//sessionStorage.schoolId = '73';
	// localStorage.classCode = 'hx001';
	$('.load_t').show();        
	
	var loading;
	//点击待交作业
	$(".secul").hide();
	// $(".hwContent").show();
	$(".hwFinish,.hwContent,.hwEmpty").hide();
	// loading = layer.load();
	/*var reqData = 'stuNum='+sessionStorage.stuNumber;*/

	sessionStorage.removeItem("unfinishHw");
	sessionStorage.removeItem("finishHw");
    var WXnum  = {
        'wechatId':sessionStorage.openid
    };
    ajax_S(url.s_seac,WXnum,function(e){
        if(e.result==true){
		if(!localStorage.userId_stu){
		    location.href = '../schedule/login_s.html';
		    return false;
		}
                sessionStorage.stuNumber = e.data.studentNo;
                sessionStorage.schoolId = e.data.schoolId;
                sessionStorage.studentName = e.data.studentName;
            var reqData={"stuNum":sessionStorage.stuNumber,"userId":localStorage.userId_stu};
            ajaxRequest('GET', homework_s.s_hwlt, reqData, getHwContentSuccess,error);
        }
    });
	var currentTab = 0;
	$(".hwHeader ul li").click(function(){
		$(".hwFinish,.hwContent,.hwEmpty").hide();
		currentTab = $(this).index();
		tabChange();
		// $(this).addClass("hwShow").siblings("li").removeClass("hwShow");
	})

	function tabChange(){
		$('.reload').hide();
		if(currentTab==0){
			$('title').html('学生待交作业列表')
			$(".hwFinish,.hwEmpty").hide();
			if(loading == undefined){
				loading = layer.load();
			}
			if(sessionStorage.getItem("unfinishHw") == undefined){

				ajaxRequest('GET', homework_s.s_hwlt, {"stuNum":sessionStorage.stuNumber,"userId":localStorage.userId_stu}, getHwContentSuccess,error);
			}else {
				getHwContentSuccess(JSON.parse(sessionStorage.getItem("unfinishHw")));
			}

		}else{
			$(".hwContent,.hwEmpty").hide();
			var reqData = {
				'stuNum':sessionStorage.stuNumber//学生编号
			};
			$('title').html('学生已交作业列表')
			if(loading == undefined){
				loading = layer.load();
			}

			if(sessionStorage.getItem("finishHw") == undefined){

				ajaxRequest('POST', homework_s.s_hw_getFinishList, reqData, getHwFinishSuccess,error);
			}else {
				getHwFinishSuccess(JSON.parse(sessionStorage.getItem("finishHw")));
			}
		}
	}

	//点击已交作业列表
	var flag=true;
	$(document).on('tap','.firstList',function(){
		var this_ = $(this);
		if(flag){
			$(this).css("background","url(images/jiao11.png) no-repeat right 55px");
			flag=false;
			$(this).find(".secul").show();
			getClassDetails(this_);
		}else{
			$(this).css("background","url(images/jiao22222.png) no-repeat right 55px");
			flag=true;
			$(this).find(".secul").hide();
		}
	});
	/**
	 * //班级详情
	 * @param this_ 点击已交作业列表
     */
	function getClassDetails(this_){
		var Tid = this_.attr('data-Tid');
		var classCode = this_.attr('data-classCode');
		var params = {
			'stuNum':sessionStorage.stuNumber,
			'classCode':classCode,
			'userId':localStorage.userId_stu
		};
		ajaxRequest("POST",homework_s.s_hw_getClassDetails,params,function(e){
			//班级详情
			if(e.code == 200){
				if(e.data != undefined && e.data.length > 0){

					var list = e.data;
					for (var i = 0; i < list.length; i++) {
						var item = list[i];
						var hwLessNosHtml = '', readStatus = '', replay = 0;
						var replayStatus = "",statusCss="",readCss="";
						readStatus = parseInt(item.readStatus);
						replayStatus = parseInt(item.replayStatus);
						//红点显示判断
						if (readStatus == 0) {//未读
							readCss = "redCircle";
						}
						switch (replayStatus) {
							case 0:
								replayStatus = '未批';
								statusCss = 'grey';
								break;
							case 1:
								replayStatus = '已批';
								statusCss = 'blue';
								break;
						}
						var score;
						if (item.score == "" || item.score == null || item.score == undefined) {
							score = "";
						} else {
							score = item.score + "分";
						}
						if (item.homeworkType == "1") {
							hwLessNosHtml += '<li data-homeworkTinfoId="' + item.homeworkTid + '"  data-id="' + item.id + '" data-classCode="' + classCode + '"><span class="hwDate">' + item.homeworkTime.substr(5) + '日作业</span><span class="' + statusCss + '">' + replayStatus + '</span><span class="' + readCss + '"></span><span class="stuScore">' + score + '</span></li>';
						} else {
							hwLessNosHtml += '<li data-homeworkTinfoId="' + item.homeworkTid + '"  data-id="' + item.id + '" data-classCode="' + classCode + '" data-testId="' + item.testId + '"><i class="dian">电子</i><span class="hwDate">' + item.homeworkTime.substr(5) + '日作业</span><span class="' + statusCss + '">' + replayStatus + '</span><span class="' + statusCss + ' beging_s" style="float:right;margin-top: 35px;margin-left:10px;width:110px;" url_="' + item.paperUrl + '">再做一次</span><span class="' + readCss + '"></span><span class="stuScore" style="right:134px;">' + score + '</span></li>';
						}
						this_.find('.secul').append(hwLessNosHtml);

					}

				}
				this_.find('.secul li .loading-back').hide();
				this_.find('.secul .load_html').hide();
			}
		},function(){
			this_.find('.secul .load_html .loading-back').hide();
			this_.find('.secul .load_html .load_fail').show();

		});

	}


	$(document).on('tap','.secul .load_html .load_fail',function(){
		getClassDetails($(this).parent().parent());
	});


	//点击作业排行榜
	$(".hwRankTitle").click(function(){
		location.href="studentrank_s.html";
	});
	// 点击待交作业列表
	$(document).on('tap','.hwList',function(){
		var that = $(this);
		sessionStorage.removeItem('homeworkInfos');
		// 缓存信息
		localStorage.homeworkTinfoId = $(this).attr('data-homeworkTinfoId') ;//老师作业id
		localStorage.homeworkSinfoId = $(this).attr('data-id') ;//学生作业id
		localStorage.classcode = $(this).attr('data-classcode') ;//班级code
		var id = $(this).attr('data-id');
		if($(this).find(".hwLeft span").html()=="电子"){
			ajaxRequest('GET', homework_s.s_readstatus, 'id='+id, function(msg){
				if(msg.code==200){
					console.log("阅读成功！"+msg.msg);
				}else{
					console.log("阅读失败！"+msg.msg);
				}
				window.location.href = that.attr('data-url');
				sessionStorage.removeItem("unfinishHw");
				sessionStorage.removeItem("finishHw");
			});

		}else{
			ajaxRequest('GET', homework_s.s_readstatus, 'id='+id, function(msg){
				if(msg.code==200){
					console.log("阅读成功！"+msg.msg);
				}else{
					console.log("阅读失败！"+msg.msg);
				}
				window.location.href = 'dohomework_s.html?id='+localStorage.homeworkSinfoId ;
				sessionStorage.removeItem("unfinishHw");
				sessionStorage.removeItem("finishHw");
			});

		}

	});
	// 点击已交作业列表
	$(document).on('tap','.secul>li',function(){
		var that=$(this);
		// 缓存信息
		localStorage.homeworkTinfoId = $(this).attr('data-homeworkTinfoId') ;//老师作业id
		localStorage.homeworkSinfoId = $(this).attr('data-id') ;//学生作业id
		localStorage.classcode = $(this).attr('data-classcode') ;//班级code

		var curIndex = $(this).parents('.firstList').index();
		var classIndex = $(this).index();
		var id = $(this).attr('data-id');
		if($(this).find(".dian").html()=="电子"){
			ajaxRequest('GET', homework_s.s_readstatus, 'id='+id, function(msg){
				if(msg.code==200){
					console.log("阅读成功！"+msg.msg);
				}else{
					console.log("阅读失败！"+msg.msg);
				}
			});
			var url = url_o+"/teacherData/getStudentReportUrl.do";
			var params = {
				"testId":$(this).attr("data-testId"),
				"roleType":""
			};
			ajaxRequest("POST", url, JSON.stringify(params), function (e) {
				if (e.result) {
					if(e.url!=undefined && e.url != ""){
						console.log(e.url);
						window.location.href = e.url;
						sessionStorage.removeItem("finishHw");
						sessionStorage.removeItem("unfinishHw");
					}
				}
			});
			return false;

		}else{
			ajaxRequest('GET', homework_s.s_readstatus, 'id='+id, function(msg){
				if(msg.code==200){
					console.log("阅读成功！"+msg.msg);
				}else{
					console.log("阅读失败！"+msg.msg);
				}

				window.location.href = 'finishedhomework_s.html?curIndex='+curIndex+'&classIndex='+classIndex+'&id='+id;

				sessionStorage.removeItem("finishHw");
				sessionStorage.removeItem("unfinishHw");

			});
			return false;
		}
		console.log($(this).parents('.firstList').index()+"---"+$(this).index());

	});

	//获取待交作业列表
	var homeworkInfosArray=[];
	function getHwContentSuccess(msg) {
		sessionStorage.setItem("unfinishHw",JSON.stringify(msg));
		// loading = layer.load();
		$(".hwContent").html(" ");
		if(msg.code==200){
			if(msg.data.length>0){
				var datas = msg.data;
				$.each(datas,function(i,item){
					var classTitle = item.className;
					//作业类型
					var homeworkType=item.homeworkType;
					//paperurl
					var paperurl=item.paperUrl;
					//课程名称显示控制
					if (item.className.length>11){
						classTitle = item.className.substr(0,10)+'...';
					}
					if (item.readStatus==0){//未读
						readCss = "state_st";
					}else{
						readCss = ''
					}
					var knowledgePoint, kpHtml = "";
					var homeworkInfos ={//作业信息：知识点，描述，图片，语音
						'id':item.id,//学生作业主键id
						'homeworkTId':item.homeworkTId,//老师作业主键id
						'classCode':item.classCode,
						'knowledgePoint':decodeURIComponent(item.knowledgePoint),
						'description':item.description,
						'fileContents':item.fileContents
					};
					homeworkInfosArray.push(homeworkInfos);
					// localStorage.homeworkInfos = JSON.stringify(homeworkInfos);
					console.log(typeof homeworkInfosArray);
					var homeworkTime = item.homeworkTime.substr(0,4)+"年"+item.homeworkTime.substr(5,2)+"月"+item.homeworkTime.substr(8,2)+"日";
					if(homeworkType=="1"){
						if(decodeURIComponent(item.knowledgePoint)!="" && decodeURIComponent(item.knowledgePoint)!=null && decodeURIComponent(item.knowledgePoint)!=undefined){

							knowledgePoint =splitStrs(decodeURIComponent(item.knowledgePoint));
							console.log(knowledgePoint+"----"+knowledgePoint.length);
							for(var i = 0;i<knowledgePoint.length;i++){
								kpHtml += '<span>'+knowledgePoint[i]+'</span>';
							}
						}
						/*var homeworkTime = item.homeworkTime.substr(0,4)+"年"+item.homeworkTime.substr(5,2)+"月"+item.homeworkTime.substr(8,2)+"日";*/
						console.log(kpHtml);
						var hwListHtml = '<div class="hwList " data-homeworkTinfoId="'+item.homeworkTId+'"  data-id="'+item.id+'" data-classCode="'+item.classCode+'">'
							+'<div class="hwLeft">'+item.courseName+'</div>'
							+'<div class="hwRight">'
							+'<div class="hwTime"><span>'+classTitle+'</span>'
							+'<span>'+homeworkTime+'</span></div>'
							+'<div class="hwKon">'+kpHtml+'</div></div><span class='+readCss+' style="margin-top: 12px"></span></div>';
						$(".hwContent").append(hwListHtml);
						$(".hwContent").show();
					}else{
						var hwListHtml = '<div class="hwList data-homeworkTinfoId="'+item.homeworkTId+'"  data-id="'+item.id+'" data-classCode="'+item.classCode+'" data-url="'+paperurl+'">'
							+'<div class="hwLeft">'+item.courseName+'<span>电子</span></div>'
							+'<div class="hwRight">'
							+'<div class="hwTime"><span>'+classTitle+'</span>'
							+'<span>'+homeworkTime+'</span></div>'
							+'<div class="hwS"><span><i>学段:</i><i>'+item.paperStage+'</i></span> <span><i>年级:</i><i>'+item.paperClass+'</i></span> <span><i>学科:</i><i>'+item.paperSubject+'</i></span></div></div><span class='+readCss+' style="margin-top: 12px"></span></div>';
						$(".hwContent").append(hwListHtml);
						$(".hwContent").show();
					}

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
		$('.load_t').hide();
		layer.close(loading);
		
	}

	//获取已完成作业列表
	function getHwFinishSuccess(msg){
		sessionStorage.setItem("finishHw",JSON.stringify(msg));
		$(".hwFinish>ul").html(" ");
		if(msg.code==200){
			if(msg.data.length>0){
				var datas = msg.data;
				for (var i = 0; i < datas.length; i++) {
					var classCode = datas[i].classCode;
					var className = datas[i].className;
					var teacherName = datas[i].teacherName;
					var readStatus = datas[i].readStatus;
					var Tid = datas[i].homeworkTid;
					if (className.length > 18) {
						className = className.substr(0, 15) + "...";
					}
					if (className.length > 15) {
						className = className.substr(0, 14) + '...'
					}
					var hwListFinishHtml = '<li data-classCode="'+classCode+'" data-Tid="'+Tid+'" class="firstList">'
						+'<p>'+className+'('+teacherName+')<span class="'+readStatus+'"></span></p>'
						+'<ul class="secul"><div class="load_html"><img class="loading-back" src="../common/images/loading.gif" /><div class="load_fail"><img src="images/reload.png" > <span>重新加载</span></div></div></ul>'
						+'</li>';
				}

				$(".hwFinish>ul").append(hwListFinishHtml);
				$(".hwFinish").show();
				$(".hwFinish .secul").hide();
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

	function error(){
		layer.close(loading);
		$('.reload').show();
		$('.load_t').hide();
	}

	//重新加载页面
	$('.reload img').click(function(){
		tabChange();
	})

	$(document).on('touchend','.beging_s',function(){
		location.href = $(this).attr('url_')
		return false;
	});










})






