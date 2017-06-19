function etlogin(callback){
	var  cbconfig = {'callbackFlag':callback};
	$.ajax({
	    url: url.e_elog,
	    type: 'post',
	    dataType: 'json',
	    data:JSON.stringify(cbconfig),
	    success:function(e){
	    	if(e.url==undefined&&cbconfig.callbackFlag=='teacherWX'){
	    		location.href = 'login_t.html'
            }else if(e.url==undefined&&cbconfig.callbackFlag=='scanCode'){
	    		location.href = 'scanCode.html'
			}else if(e.result==false){
            	layer.msg(e.message);
            }else{
                location.href = e.url;
                localStorage.removeItem('terEmail');
            }
	    }
	})
}