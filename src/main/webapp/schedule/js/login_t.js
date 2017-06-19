// sessionStorage.openid = '11'
// sessionStorage.stuNum= 'sy1';

var code_s = location.search.substring(location.search.indexOf('code')+5,location.search.indexOf('&'));
var state_s = location.search.substring(location.search.indexOf('state')+6,location.search.length);
var calbac = {
    'code':code_s,
    'e2State':state_s,
    'state':state_s
};



if(localStorage.terEmail){
    etlogin('teacherWX')
}else{
    ajax_S(url.t_more,calbac,teamore)   //ajax请求
}
function teamore(e){
	console.log(e);
	if(e.result==true){
        $('.name_s').html(e.userName);
        $('.name_ema').html(e.email);
        localStorage.terEmail = e.email
        //var openid = sessionStorage.openid;
        //if (openid == undefined || openid == '' || openid == 'undefined') {
        //alert(location.href.substring(0, location.href.indexOf('?code')))
        //wechatCode(location.href.substring(0,location.href.indexOf('?code')));
        //}

        var bindingtea0 = {};
        bindingtea0['email'] = e.email;
        bindingtea0['wechatId'] = sessionStorage.openid;
        ajax_S(url.t_wxmo, bindingtea0,binding)//ajax请求
	}else{
        // etlogin('teacherWX')
    }
}





//获取老师绑定信息
function binding(e){
	console.log(e)
	var teacontent = JSON.parse(e.data)
	sessionStorage.teacherName = teacontent.teacherName
	sessionStorage.teacherNo = teacontent.teacherNo
	sessionStorage.teacherEmail = teacontent.teacherEmail
	sessionStorage.mobile = teacontent.mobile
	sessionStorage.schoolId = teacontent.schoolId
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
