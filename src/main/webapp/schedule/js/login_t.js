// sessionStorage.openid = 'ofZfFwgizCmzR5XXMQtC5Wx5wZrA'
// sessionStorage.stuNum= 'sy1';
var WXnum  = {
    'wechatId':sessionStorage.openid
};
var code_s = location.search.substring(location.search.indexOf('code')+5,location.search.indexOf('&'));
var state_s = location.search.substring(location.search.indexOf('state')+6,location.search.length);
var calbac = {
    'code':code_s,
    'e2State':state_s,
    'state':state_s
};

if(!localStorage.terEmail){
    ajax_S(url.t_more,calbac,teac);

}else{
    etlogin('teacherWX')
}
function teac(e){
	console.log(e);
	// var i = jQuery.parseJSON(e.data);
    $('.name_s').html(e.data.userName);
    $('.name_ema').html(e.data.userId);
    localStorage.terEmail = e.data.userId
    var bindingtea0 = {};
    bindingtea0['email'] = localStorage.terEmail;
    bindingtea0['wechatId'] = sessionStorage.openid;

    ajax_S(url.t_wxmo, bindingtea0,binding)//ajax请求
}
// s





//获取老师绑定信息
function binding(e){
	console.log(e)
	var teacontent = JSON.parse(e.data)
	sessionStorage.terEmail = teacontent.teacherEmail
}




function logout(){
	var bindingtea = {'email': $(".name_ema").html(), 'wechatId': sessionStorage.openid};
	ajax_S(url.t_siot, bindingtea, signOut)
}

// 退出登录
function signOut(e){
	console.log(e)
	if(e.result==true){
		sessionStorage.teacherName = ''
		sessionStorage.teacherNo = ''
		sessionStorage.teacherEmail = ''
		sessionStorage.mobile = ''
		sessionStorage.schoolId = ''
		location.href = 'login_s.html'
	}else{
		alert('解绑失败')
	}
	
}
