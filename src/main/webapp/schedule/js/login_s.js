$(function(){
	// tab切换
	$(".studentTitle li").on('touchend',function(){
		if($(this).index()==1){
			$('.card').hide()
		}else{
			$('.card').show()
		}
		$(this).addClass("show").siblings().removeClass("show");
		$(".inputBox p").eq($(this).index()).show().siblings("p").hide();
	})

	var wxnumber = {'email':'','wechatId':Wxid}
	
	//判断教师是否绑定
	function Wxtea(e){
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
		// 关联点击
		if($(this).html()=='立即关联'){
			ajax_S(url.s_bind,stumore,s_bind)
		}
		//解绑
		else{
			ajax_S(url.s_nobd,stunummore,s_bind)
		}
	})
	ajax_S(url.t_wxmo,wxnumber,Wxtea)//ajax请求




	// 姓名手机号查询
	function name_se(e){
		console.log(e.data.studentNo=="[]")
		var tel = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
		var name = /^[\u4e00-\u9fa5]{2,4}$/
		if($('.phoneNumber').val()==''||$('.stname').val()==''){
			layer.msg('请先将信息填写完整');
			return false;
		}
		if(!tel.test($('.phoneNumber').val())){
			layer.msg('请输入正确手机号');
			return false;
		}
		if(!name.test($('.stname').val())){
			layer.msg('请输入正确格式名字');
			return false;
		}
		if(e.data.studentNo=="[]"){
			layer.msg('没有查到相关信息');
			return false;
		}
		var  studentNo =  e.data.studentNo
		var  studentNt = studentNo.substring(1,studentNo.length-1)
		var  arr = studentNo.split('"')
		var  num = 0;
		for(var i = 0;i<arr.length;i++){
				$('.searchTwo').show()
			if(arr[i]=="["||arr[i]=="]"){
				// arr.splice(i,1)
			}else{
				num++
				$('.stuNum').append('<li><span>学员号'+num+':</span><span>'+arr[i]+'</span><button>确认关联</button></li>')
			}
		}
	}





$('.tel_log').click(function(){
	var stuname = {'name':$('.stname').val(),'mobile':$('.phoneNumber').val()}	
	ajax_S(url.s_nafu,stuname,name_se)//ajax请求
})











})