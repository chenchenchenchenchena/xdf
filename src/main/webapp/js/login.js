$(function(){
	$.ajax({
	    url: 'http://dt.staff.xdf.cn/xdfdtmanager/login/login.do',
	    type: 'post',
	    dataType: 'json',
	    success:function(e){
	        console.log(e)
	        location.href = e.url
	    }
	})
})