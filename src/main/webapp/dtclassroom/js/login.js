$(function(){
	var  cbconfig = {'callbackFlag':'scanCode'};
	$.ajax({
	    url: 'http://dt.xdf.cn/xdfdtmanager/e2Login/login.do',
	    type: 'post',
	    dataType: 'json',
	    data:JSON.stringify(cbconfig),
	    success:function(e){
	        console.log(e);
			if(e.url){
				location.href = e.url;
				localStorage.removeItem('terEmail');
			}else{
				location.href = 'scanCode.html';
			}
	        // window.open('self')
	        //localStorage.e2state = e.e2state
	    }
	})
})
