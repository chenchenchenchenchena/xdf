$(function(){
	if(!sessionStorage.openid){
		wechatCode(location.href)
	}
    // sessionStorage.openid = '111';
var WXnum  = {
    'wechatId':sessionStorage.openid
}
var teacherlogin=true;
ajax_S(url.s_seac,WXnum,stuc);

function stuc(e){
	console.log(e)
	if(e.result==false){
		$('.card').show();
		$('.enter').show();
	}
	if(e.data.relatedState=='1'&&e.data.mobile==''){
		$('.search').show();
		$('.stuname').html(e.data.studentName);
		$('.stutel').html('');
		$('.deterAss').html('解除关联');
		$('.deterAss').css('background','#fc1010');
		sessionStorage.stuNumber = 	e.data.studentNo;
		$('.enter').hide();
        //
        // //判断是否绑定
        // if($('.stuname').html()==''){
        //     $('.studentTitle').show();
        //     $('.inputBox').show()
        // }else{
            $('.studentTitle').hide();
            $('.inputBox').hide()
		$('.search').css('margin-top','.2rem')
        // }
	}else{
		$('.card').show();
		$('.searchTwo').show();
		$('.studentLogin').eq(0).hide();
		$('.studentLogin').eq(1).show();
		$('.studentTitle li').removeClass('show');
		$('.studentTitle li').eq(1).addClass('show');
		$('.card').hide();
		$('.stuNum').append('<li class="new_S"><span>学员号01:</span><span class="stu_num">'+e.data.studentNo+'</span><button class="Relation"></button></li>');
		if(e.data.relatedState=='1'){
			$('.Relation').html('取消关联')
		}else{
			$('.Relation').html('确认关联')
		}
		// $('.')
	}
}
ajax_S(url.t_wxmo,WXnum,teac);
function teac(e){
    console.log(e)
    if(e.data!="goE2"){
		location.href='login_t.html'
    }
}




	// tab切换
	$(".studentTitle li").on('touchend',function(){
		if($(this).index()==1){
			$('.card').hide();
			$('.search').hide();
            $('.noSearch').hide();

        }else{
			$('.card').show();
			$('.searchTwo').hide();
			$('.noSearch').hide();
		}
		$(this).addClass("show").siblings().removeClass("show");
		$(".inputBox p").eq($(this).index()).show().siblings("p").hide();
		$('input').val('')
	})
	var wxnumber = {'email':'','wechatId':sessionStorage.openid}
	
	//判断教师是否绑定
	function Wxtea(e){
		// alert()
		console.log(e);
		if(e.data!='goE2'&&e.result!=false){
			location.href = 'login_t.html'
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
			$('.noSearch').hide()
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
			$('.card').hide()
			$('.noSearch').show()
			layer.msg('没有查到相关信息');
		}
	}
	function s_bind(e){
		console.log(e);
		if(e.data==undefined){
			layer.msg(e.message);
			$('.deterAss').html('立即关联');
			$('.deterAss').css('background','#00ba97')
            location.href = 'login_s.html'
            // location.reload()
		}else{
            sessionStorage.stuNum = $('.stunum').val();
			layer.msg('绑定成功');
			location.href = 'schedule_s.html';
			$('.deterAss').html('解除关联');
			$('.deterAss').css('background','#fc1010');
		}
	}


	//学员号查询点击
	$('.numb_log').click(function(){
		var stumore  = {'StudentCode':$('.stunum').val(),'wechatId':sessionStorage.openid}
		ajax_S(url.s_seac,stumore,stusea)
	})
	//关联点击
	$('.deterAss').click(function(){
		var stumore  = {'StudentCode':$('.stunum').val(),'wechatId':sessionStorage.openid}
		if($('.stunum').val()==''){
			stumore.StudentCode = sessionStorage.stuNumber
		}
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
		$('.noSearch').hide();
		$('.searchTwo').hide();
		$('.new_S').remove();
		console.log(e);
		var  studentNo =  e.data
		var tel  = /^1[34578]\d{9}$/
		if($('.phoneNumber').val()==''||$('.stname').val()==''){
			layer.msg('请先将信息填写完整');
			return false;
		}
		if(!tel.test($('.phoneNumber').val())){
			layer.msg('请输入正确格式手机号');
			return false;
		}	
		if(e.result==false){
			$('.noSearch').show()
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
	var stuname = {'name':$('.stname').val(),'mobile':$('.phoneNumber').val(),'wechatId':sessionStorage.openid}
	// var stuname = {};
	// var name = $('.stname').val();
	// var mobile  = $('.phoneNumber').val();
	// stuname['name'] = name;
	// stuname['mobile'] = mobile;
	// var stuname = {'name':'常效新','mobile':'13739607950','wechatId':sessionStorage.openid}
	ajax_S(url.s_nafu,stuname,name_se)//ajax请求
})


function telbind(e){
	console.log(e);
	// alert(e.message.length!=0)
	if(e.result==true&&e.data==undefined){
	   layer.msg(e.message)
	}else if(e.result==false){
	   layer.msg(e.message)
			// layer.msg('关联成功')
			$('.deterAss').html('解除关联')
			$('.deterAss').css('background','#fc1010')
	}else{
	   layer.msg('绑定成功')
	} 
}


$(document).on('click','.Relation',function(){
	if($(this).html()=='确认关联'){
		var stunum  = $('.stu_num').eq($(this).parent().index()-1).text()
		var stumore = {'StudentCode':stunum,'wechatId':sessionStorage.openid,'Mobile':sessionStorage.stuTel}	
		ajax_S(url.s_bind,stumore,telbind)
		// $(this).html('解除关联')
	}else{
		var stunum  = $('.stu_num').eq($(this).parent().index()-1).text()
		var stumore = {'StudentCode':stunum,'wechatId':sessionStorage.openid}	
		ajax_S(url.s_nobd,stumore,telbind)
		$(this).html('确认关联')

	}
	
})








})