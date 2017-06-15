function etlogin(callback){
	var  cbconfig = {'callbackFlag':callback};
	$.ajax({
	    url: url.e_elog,
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
}