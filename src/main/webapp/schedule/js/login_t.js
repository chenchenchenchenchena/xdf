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
if(localStorage.terEmail){
    var bindingtea0 = {};
    bindingtea0['email'] = localStorage.terEmail;
    bindingtea0['wechatId'] = sessionStorage.openid;
    ajax_S(url.t_wxmo, bindingtea0,binding)//ajax请求
}else{
    ajax_S(url.t_more,calbac,teac);
    var bindingtea0 = {};
    bindingtea0['email'] = localStorage.terEmail;
    bindingtea0['wechatId'] = sessionStorage.openid;
    ajax_S(url.t_wxmo, bindingtea0,binding)//ajax请求
}
function teac(e){
	// var i = jQuery.parseJSON(e.data);
    $('.name_s').html(e.userName);
    $('.name_ema').html(e.userId);
    localStorage.terEmail = e.userId
}
// s

// clearCookie('U2Token','/aaaaaaa','.xdf.cn')



//获取老师绑定信息
function binding(e){
	if(e.result==false){
		layer.msg(e.message)
	}else{
        var teacontent = JSON.parse(e.data);
        $('.name_s').html(teacontent.teacherName);
        $('.name_ema').html(teacontent.teacherEmail);
        sessionStorage.terEmail = teacontent.teacherEmail;
	}

}




function logout(){
	var bindingtea = {'email': $(".name_ema").html(), 'wechatId': sessionStorage.openid};
    setCookie('E2Email',' ',30);
    setCookie('E2Token',' ',30);
    setCookie('U2Email',' ',30);
    setCookie('U2NickName',' ',30);
    setCookie('U2Token',' ',30);
	ajax_S(url.t_siot, bindingtea, signOut)
}

// 退出登录
function signOut(e){
	console.log(e);
	if(e.result==true){
		location.href = 'login_s.html'
	}else{
		alert('解绑失败')
	}
	
}
