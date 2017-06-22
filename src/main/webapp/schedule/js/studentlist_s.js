
$(function(){






var stuname = sessionStorage.s.split(',');
for(var i = 0;i<stuname.length;i++){
	if(stuname[i]!=''){
		if(stuname[i].indexOf('undefined')!=-1){
            stuname[i] =  stuname[i].substring(9,stuname[i].length)
		}
		$('.studentList').append('<li><i>'+(i+1)+'</i><span>'+stuname[i].substring(0,1)+'</span><span>'+stuname[i]+'</span></li>')
	}
	$('.slistTitle').html('课堂学生列表('+(stuname.length-1)+')')

}







})















