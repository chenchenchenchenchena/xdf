$(function(){
	// tab切换
	$(".studentTitle li").on('touchend',function(){
		if($(this).index()==1){
			$('.card').hide()
			$('.search').hide()
		}else{
			$('.card').show()
			$('.searchTwo').hide()
			// $('.search').hide()
		}
		$(this).addClass("show").siblings().removeClass("show");
		$(".inputBox p").eq($(this).index()).show().siblings("p").hide();
	})
	var wxnumber = {'email':'','wechatId':Wxid}
	
	//判断教师是否绑定
	function Wxtea(e){
		console.log(e)
		if(e.data!='goE2'){
			location.href = 'schedule_t.html'
		}
	}


	//查询学生信息  学员号查询
	function stusea(e){
		var num = /^\w+$/
		if($('.studentLogin input').val()==''){
			layer.msg('请先输入学员号');
			return false;
		}
		if(!num.test($('.studentLogin input').val())){
			layer.msg('请输入正确格式学员号');
			return false;
		}
		console.log(e)
		if(e.result==true){
			$('.card').hide()
			$('.search').show()
			$('.stuname').html(e.data.studentName)
			$('.stutel').html('')
			sessionStorage.stuNum = $('.studentLogin input').val()
			if(e.data.relatedState=='0'){
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
		}else{
			console.log(e)
			layer.msg(e.message)
		}
	}


	//学员号查询点击
	$('.numb_log').click(function(){
		var stumore  = {'StudentCode':$('.stunum').val(),'wechatId':Wxid}
		ajax_S(url.s_seac,stumore,stusea)
	})
	//关联点击
	$('.deterAss').click(function(){
		var stumore  = {'StudentCode':$('.stunum').val(),'wechatId':Wxid}
		// 关联点击
		// alert($(this).html())
		if($(this).html()=='立即关联'){
			ajax_S(url.s_bind,stumore,s_bind)
		}
		//解绑
		else{
			ajax_S(url.s_nobd,stumore,s_bind)
		}
	})
	ajax_S(url.t_wxmo,wxnumber,Wxtea)//ajax请求




	// 姓名手机号查询
	function name_se(e){
		$('.new_S').remove()
		console.log(e)
		var  studentNo =  e.data
		var name = /^[\u4e00-\u9fa5]{2,4}$/
		var tel  = /^1[34578]\d{9}$/
		if($('.phoneNumber').val()==''||$('.stname').val()==''){
			layer.msg('请先将信息填写完整');
			return false;
		}
		if(!name.test($('.stname').val())){
			layer.msg('请输入正确格式名字');
			return false;
		}
		if(!tel.test($('.phoneNumber').val())){
			layer.msg('请输入正确格式手机号');
			return false;
		}
		if(e.result==false){
			layer.msg('没有查到相关信息');
			return false;
		}
		$('.searchTwo').show()
		var  num = 0;
		var  bindz = ''
		for(var i = 0;i<studentNo.length;i++){
			if(studentNo[i].state=='0'){
				bindz = '确认关联'
			}else{
				bindz = '取消关联'
			}
			$('.stuNum').append('<li class="new_S"><span>学员号'+i+1+':</span><span class="stu_num">'+studentNo[i].stNo+'</span><button class="Relation">'+bindz+'</button></li>')
				sessionStorage.stuTel = $('.phoneNumber').val()
		}
	}





$('.tel_log').click(function(){
	//var stuname = {'name':$('.stname').val(),'mobile':$('.phoneNumber').val()}
	// var stuname = {};
	// var name = $('.stname').val();
	// var mobile  = $('.phoneNumber').val();
	// stuname['name'] = name;
	// stuname['mobile'] = mobile;
	var stuname = {'name':'常效新','mobile':'13739607950','wechatId':Wxid}	
	ajax_S(url.s_nafu,stuname,name_se)//ajax请求
})


function telbind(e){
	console.log(e)
	if(e.message!=''){
	   layer.msg(e.message)
	}
}


$(document).on('click','.Relation',function(){
	if($(this).html()=='确认关联'){
		var stunum  = $('.stu_num').eq($(this).parent().index()-1).text()
		var stumore = {'StudentCode':stunum,'wechatId':Wxid,'Mobile':sessionStorage.stuTel}	
		ajax_S(url.s_bind,stumore,telbind)
		$(this).html('取消关联')
	}else{
		var stunum  = $('.stu_num').eq($(this).parent().index()-1).text()
		var stumore = {'StudentCode':stunum,'wechatId':Wxid}	
		ajax_S(url.s_nobd,stumore,telbind)
		$(this).html('确认关联')

	}
	
})



// s_nobd





})