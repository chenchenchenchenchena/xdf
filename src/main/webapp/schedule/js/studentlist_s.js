
$(function(){






var stuname = sessionStorage.studen_s.split(',');
for(var i = 0;i<stuname.length;i++){
	if(stuname[i]!=''){
		$('.studentList').append('<li><i>'+(i+1)+'</i><span>'+stuname[i].substring(0,1)+'</span><span>'+stuname[i]+'</span></li>')
	}
	
}	
						






})















