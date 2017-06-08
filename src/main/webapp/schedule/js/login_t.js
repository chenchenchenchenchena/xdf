// var bindingtea = {'email':$('.name_ema').html(),'wechatId':Wxid}
var bindingtea = {'email':'caoxuefeng@xdf.cn','wechatId':Wxid}

//e2登陆完成 stat查询老师信息
function teamore(e){
			if(e.result==true){
				$('.name_s').html(e.userName);
				$('.name_ema').html(e.email);
				ajax_S(url.t_wxmo,bindingtea,binding)//ajax请求
			}else{
				etlogin('teacherWX')
			}
}


//获取老师绑定信息
function binding(e){
	var teacontent = JSON.parse(e.data)
	sessionStorage.teacherName = teacontent.teacherName
	sessionStorage.teacherNo = teacontent.teacherNo
	sessionStorage.teacherEmail = teacontent.teacherEmail
	sessionStorage.mobile = teacontent.mobile
	sessionStorage.schoolId = teacontent.schoolId
}


// 退出登录
function signOut(){
	sessionStorage.teacherName = ''
	sessionStorage.teacherNo = ''
	sessionStorage.teacherEmail = ''
	sessionStorage.mobile = ''
	sessionStorage.schoolId = ''
	location.href = 'login_s.html'
}
	
ajax_S(url.t_more,calbac,teamore)   //ajax请求