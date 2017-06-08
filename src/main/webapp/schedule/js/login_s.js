$(function(){
	// tab切换
	// $(".studentTitle li").tap(function(){
	// 	$(this).addClass("show").siblings().removeClass("show");
	// 	$(".inputBox p").eq($(this).index()).show().siblings("p").hide();
	// })
	var wxnumber = {'email':'','wechatId':Wxid}
	
	//判断教师是否绑定
	function Wxtea(e){
		if(e.data!='goE2'){
			location.href = 'schedule_t.html'
		}
	}

	//查询学生信息
	function stusea(e){
		if($('.studentLogin input').val()==''){
			layer.msg('请先输入学员号');
			return false;
		}
		console.log(e)
		if(e.result==true){
			$('.card').hide()
			$('.search').show()
			$('.stuname').html(e.studentName)
			$('.stutel').html('')
			sessionStorage.stuNum = $('.studentLogin input').val()
			if(e.relatedState==0){
				$('.deterAss').html('立即关联')
				$('.deterAss').css('background','#00ba97')
			}else{
				$('.deterAss').html('解除关联')
				$('.deterAss').css('background','#fc1010')
			}
		}else{
			layer.msg('没有查到相关信息');
		}
	}
	function s_bind(e){
		if(e.result==true){
			layer.msg('操作成功');
			location.reload()
		}
	}


	//学生查询点击
	$('.numb_log').click(function(){
		var stumore  = {'StudentCode':$('.stunum').val(),'wechatId':Wxid}
		ajax_S(url.s_seac,stumore,stusea)
	})
	//关联点击
	$('.deterAss').click(function(){
		var stumore  = {'StudentCode':$('.stunum').val(),'wechatId':Wxid}
		// 关联
		if($(this).html()=='立即关联'){
			ajax_S(url.s_bind,stumore,s_bind)
		}
		//解绑
		else{
			ajax_S(url.s_nobd,stumore,s_bind)
		}
	})
	ajax_S(url.t_wxmo,wxnumber,Wxtea)//ajax请求
	// ajax_S(url.s_seac,stumore,stusea)//ajax请求

	


















})