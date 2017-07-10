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
	})
	//点击作业排行榜
	$(".hwRankTitle").click(function(){
		location.href="studentrank_s.html";
	})
	//点击选择图片
	$('#chooseImage').click(function () {
		wx.chooseImage({
			success: function (res) {
				$('.notsubmit').show();
				if ($('#audio').attr("src") == undefined) {
					$('#audio').hide();
				}
				var str = "";
				if (res.localIds.length > 0) {

					for (var i = 0; i < res.localIds.length; i++) {

						if (i % 3 == 0) {
							str += " <div class = 'imgBox'>";
						}
						str += "<div><span class='stuImg'>" + "</span><img src=" + res.localIds[i] + "/></div>";
						if ((i + 1) % 3 == 0 || i == res.localIds.length - 1) {
							str += "</div>";
						}
					}
				}
				alert('已选择 ' + res.localIds.length + ' 张图片');
			}
		});
	});
})

//获取待交作业列表
function getHwContentSuccess(msg) {
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