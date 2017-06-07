$(function(){
	var  cbconfig = {'callbackFlag':'scanCode'};
	$.ajax({
	    url: 'http://dt.staff.xdf.cn/xdfdtmanager/e2Login/login.do',
	    type: 'post',
	    dataType: 'json',
	    data:JSON.stringify(cbconfig),
	    success:function(e){
	        console.log(e)
	        location.href = e.url
	        sessionStorage.e2state = e.e2state
	        // alert(sessionStorage.e2state)
	    }
	})
})