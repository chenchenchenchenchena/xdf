$(function(){
	$.ajax({
	    url: 'http://dt.staff.xdf.cn/xdfdtmanager/login/login.do',
	    type: 'post',
	    dataType: 'json',
	    asyns:false,
	    data: JSON.stringify(o),
	    success:function(e){
	        console.log(e)
	        location.href = e.url
	    }
	})
})