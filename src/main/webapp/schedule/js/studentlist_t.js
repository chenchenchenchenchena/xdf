
$(function(){







var stuname = sessionStorage.stuNa.split('0');
var teaname = sessionStorage.t.split(',')
for(var i = 0;i<stuname.length;i++){
	if(teaname[i]!=''){
		$('.slist').append('<li class="listCon"><ul class="teClass"><li>'+teaname[i]+'老师班(JCK20291)</li><li class="arrow"></li></ul><ul class="studentList"></ul></li>')

	}
	var stumore = stuname[i].split(',')
	for(var k = 0;k<stumore.length;k++){
		if(stumore[k]!=''){
			$('.studentList').eq(i).append('<li><i>'+(k+1)+'</i><span>'+stumore[k].substring(0,1)+'</span><span>'+stumore[k]+'</span></li>')
		}
	}
    $('.slistTitle').html('课堂学生列表('+stumore.length+')')
}
						





})















