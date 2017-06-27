$(function(){

	/*
	 * 排课全选框 2015-9-18 15:31:31 yxl
	 */

	//全选
	$(".J-selectAllTrigger").click(function(e){
		e.preventDefault();
		//var obj = $(e.target);
		//var ipt = $(this).children("input");
		/*if(obj.is(ipt)){
		 var _this = $(ipt).prop("checked");
		 if(_this){
		 $(".J-allTypeCheck").find("a").addClass("p131-checkBox-icon-checked");
		 $(".J-allTypeCheck").find("input").prop({"checked":true});
		 }else{
		 $(".J-allTypeCheck").find("a").removeClass("p131-checkBox-icon-checked");
		 $(".J-allTypeCheck").find("input").prop({"checked":false});
		 }
		 }*/


		var otherA = $(".J-allTypeCheck a");
		var obj = $(this).find("a");
		if(obj.hasClass("p131-checkBox-icon-checked")){

			obj.removeClass("p131-checkBox-icon-checked");
			otherA.removeClass("p131-checkBox-icon-checked");
			obj.siblings("input").prop({"checked":false});
		}else{
			obj.addClass("p131-checkBox-icon-checked");
			otherA.addClass("p131-checkBox-icon-checked");
			obj.siblings("input").prop({"checked":true});
		}


	})
//单项选择
	$(".J-allTypeCheck").click(function(e){
		e.preventDefault();
		var obj = $(this).find("a");

		if($(obj).hasClass("p131-checkBox-icon-checked")){
			$(obj).removeClass("p131-checkBox-icon-checked");
			$(obj).siblings("input").prop({"checked":false});
			$(".J-checkAll").prop({"checked":false});

			$(".J-selectAllTrigger a").removeClass("p131-checkBox-icon-checked");
			$(".J-selectAllTrigger a").siblings("input").prop({"checked":false});
		}else{
			$(obj).addClass("p131-checkBox-icon-checked");
			$(obj).siblings("input").prop({"checked":true});
		}

	})


	/*
	 * 时间下拉框 2015-9-2 14:48:15 yxl
	 */

	var ModuleTimeMenu = {
		//点击框
		_event : null,
		//显示框
		_menuBox: $(".J-inputAutoMenu"),

		init:function(e){
			this._event = $(e);
			this.settingWd();
			$(this._menuBox).show();
			this.run();
		},
		settingWd : function(){
			var timeArr = this._event.val().split(":");
			var _hour = parseInt(timeArr[0]);
			var _minute = parseInt(timeArr[1]);
			var hourBox = $(".J-Hour-Box a");
			var minuteBox = $(".J-Minute-Box a");
			for(var i = 0; i<hourBox.length; i++){
				if(hourBox[i].text == _hour){
					$(hourBox).removeClass("on");
					$(hourBox[i]).addClass("on");
					break;
				}
			}
			for(var i = 0; i<minuteBox.length; i++){
				if(minuteBox[i].text == _minute){
					$(minuteBox).removeClass("on");
					$(minuteBox[i]).addClass("on");
					break;
				}
			}
			var search_ipt_wd = this._event.outerWidth();
			var search_ipt_ht = this._event.outerHeight();
			var s_offset = this._event.offset();
			$(this._menuBox).css({"top":s_offset.top+search_ipt_ht,"left":s_offset.left});
		},
		run:function(){
			//点击页面其他区域时关闭
			var that = this;
			$(document).click(function(e){
				var _con = that._menuBox;   	//设置目标区域
				var _ipt = that._event; //触发区域
				var obj = $(e.target);
				if(!_con.is(obj) && _con.has(obj).length == 0 && !_ipt.is(obj)){ // Mark 1
					$(that._menuBox).hide();
				}
			});
			$(".J-Minute-Box a").click(function(){
				$(".J-Minute-Box a").removeClass('on');
				$(this).addClass('on');
			});
			$(".J-Hour-Box a").click(function(){
				$(".J-Hour-Box a").removeClass('on');
				$(this).addClass('on');
			});

			//点击关闭按钮
			$(".J-Btn-close").click(function(){
				closeBox();
			});
			$(".J-Btn-yes").click(function(){
				okBox();
			});

			var okBox = function(){
				var h = $(".J-Hour-Box .on").text();
				var m = $(".J-Minute-Box .on").text();
				if(h.length==1){
					h='0'+h;
				}
				if(h == '24'){
					h = '00';
				}
				if(m.length==1){
					m='0'+m;
				}
				that._event.val(h+':'+m);
				closeBox();
			}
			var closeBox = function(){
				$(that._menuBox).hide();
			}
		}
	}
	window.ModuleTimeMenu = ModuleTimeMenu;
})


$(function(){
	/*
	 * 右键下拉框 2015-9-18 18:18:00  yxl
	 */

	var ModuleRightClickMenu = {
		//点击框
		_event : null,
		//显示框
		_menuBox: $(".J-rightClickMenu"),

		init:function(_this,e){
			this._event = $(_this);
			this._e = e;
			this.settingWd();
			$(this._menuBox).show();
			this.run();
		},
		settingWd : function(){
			var search_ipt_wd = this._event.outerWidth();
			var search_ipt_ht = this._event.outerHeight();

			var s_offset = this._event.offset();
			$(this._menuBox).css({"top":this._e.clientY,"left":this._e.clientX});


		},
		run:function(){
			//点击页面其他区域时关闭
			var that = this;
			$(document).click(function(e){
				e.preventDefault();
				var _con = that._menuBox;   	//设置目标区域
				var _ipt = that._event; //触发区域
				var obj = $(e.target);

				if(!_con.is(obj) && _con.has(obj).length == 0 && _ipt.has(obj).length == 0 && !_ipt.is(obj)){ // Mark 1
					$(that._menuBox).hide();
				}
			});
		}
	}
	window.ModuleRightClickMenu = ModuleRightClickMenu;
});



$(function(){

	/*
	 * 周历下拉框 2015-9-6 10:05:37  yxl
	 */

	var ModuleWeekTips = {
		//点击框
		_event : null,
		//显示框
		_menuBox: $(".J-weekTips"),

		init:function(e){
			this._event = $(e);
			this.settingWd();
			$(this._menuBox).show();
			this.run();
		},
		settingWd : function(){
			$(".J-selectWeek a").removeClass("on");
			var timeArr = this._event.val().split(",");
			if(timeArr.length >0){
				var _selectObj = $(".J-selectWeek a");
				for(var i = 0; i<timeArr.length; i++){
					for(var j =0; j<_selectObj.length; j++){
						if(timeArr[i] == $(_selectObj[j]).html()){
							$(_selectObj[j]).addClass("on");
						}
					}
				}
			}

			var search_ipt_wd = this._event.outerWidth();
			var search_ipt_ht = this._event.outerHeight();
			var s_offset = this._event.offset();
			$(this._menuBox).css({"top":s_offset.top+search_ipt_ht,"left":s_offset.left});
		},
		run:function(){
			//点击页面其他区域时关闭
			var that = this;
			$(document).click(function(e){
				var _con = that._menuBox;//设置目标区域
				var _ipt = that._event; //触发区域
				var obj = $(e.target);
				if(!_con.is(obj) && _con.has(obj).length == 0 && !_ipt.is(obj)){ // Mark 1
					$(that._menuBox).hide();
				}
			});

			$(".J-selectWeek a").off("click");
			$(".J-selectWeek a").click(function(e){
				e.preventDefault();
				if($(this).hasClass("on")){
					$(this).removeClass("on");
				}else{
					$(this).addClass("on");
				}
			});

			//点击关闭按钮
			$(".J-Btn-close").off("click");
			$(".J-Btn-close").click(function(){
				closeBox();
			});
			$(".J-Btn-yes").off("click");
			$(".J-Btn-yes").click(function(){
				okBox();
			});

			var okBox = function(){
				var _week = $(that._menuBox).find("table tr .on");
				var _html = "";

				for(var i = 0; i<_week.length; i++){
					if(i == 0){
						_html = $(_week[i]).html();
					}else{
						_html += ","+$(_week[i]).html();
					}
				}
				that._event.val(_html);
				closeBox();
			}
			var closeBox = function(){
				$(that._menuBox).hide();
			}
		}
	}
	window.ModuleWeekTips = ModuleWeekTips;
});

$(function(){
	var ModuleClassDropdownMenu = {
		//点击框	
		_event : null,
		//显示框
		_menuBox: "",

		init:function(e){
			this._event = $(e);
			this._menuBox = this._event.next();
			this.settingWd();
			$(this._menuBox).show();
			this.run();
		},
		settingWd : function(){
			var search_ipt_wd = this._event.outerWidth();
			var search_ipt_ht = this._event.outerHeight();
			var s_offset = this._event.offset();
			$(this._menuBox).css({"top":s_offset.top+search_ipt_ht,"left":s_offset.left});
		},
		run:function(){
			//点击页面其他区域时关闭
			var that = this;
			$(document).click(function(e){
				var _con = that._menuBox;//设置目标区域
				var _ipt = that._event; //触发区域
				var obj = $(e.target);
				if(!_con.is(obj) && _con.has(obj).length == 0 && !_ipt.is(obj)){ // Mark 1
					$(that._menuBox).hide();
				}
			});
			var closeBox = function(){
				$(that._menuBox).hide();
			}
		}
	}
	window.ModuleClassDropdownMenu = ModuleClassDropdownMenu;

})





$(function(){

	/*
	 * 设置上课时间  2015-9-2 14:51:19  yxl
	 */

	//tab切换
	$(document).on("click",".J-listNav li",function(){
		var index =$(this).index();
		$(".J-listContent").hide().eq(index).show();
		$(".J-listNav li").removeClass("on");
		$(this).addClass("on");
		$(".J-addClassTime").data({"flag":index});
	});
	//添加时间
	$(document).on("click",".J-addClassTime",function(){
		var flag = $(this).data("flag");
		var ckbox = $(".J-setting-week").find(".checkbox");
		var _html = "";
		for(var i = 0; i<ckbox.length; i++){
			$(ckbox[i]).prop("checked")
			if($(ckbox[i]).prop("checked")){
				_html += $(ckbox[i]).data("value");
			}
		}
		if(flag == 1){
			var sTime = $(".startTime").val();
			var eTime = $(".endTime").val();
			_html += sTime+"-"+eTime;
		}else{
			var timePart = $(".J-timePart");
			for(var i = 0; i<timePart.length; i++){
				if($(timePart[i]).prop("checked")){
					_html += $(timePart[i]).data("value");
					break;
				}
			}
		}
		_html = "<p>"+_html+"</p>";
		$(".J-rightSettingTime").append(_html);
	});
	//全部清除
	$(document).on("click",".J-clearClassTime",function(){
		$(".J-rightSettingTime").html("");
	})
	//选中
	$(document).on("click",".J-rightSettingTime p",function(){
		if($(this).hasClass("on")){
			$(this).removeClass("on")
		}else{
			$(this).addClass("on");
		}
	})
	//删除选中
	$(document).on("click",".J-deleteSelect",function(){
		var thisP = $(".J-rightSettingTime p");
		for(var i = 0; i< thisP.length; i++){
			if($(thisP[i]).hasClass("on")){
				$(thisP[i]).remove();
			}
		}
	})

	//点击label或input
	$(document).on("click",".J-setting-week label",function(e){
		var obj = $(e.target);
		var ipt = $(this).children("input");
		var _all = $(".J-setting-week label").children("input");
		if(obj.is(ipt)){
			if($(obj).data("value") == "每天"){
				if($(obj).prop("checked")){
					$(_all).prop({"checked":false});
					$(obj).prop({"checked":true});
				}
			}else{
				$(".J-setting-week label").children("input").eq(0).prop({"checked":false});
			}
		}
	})


});
