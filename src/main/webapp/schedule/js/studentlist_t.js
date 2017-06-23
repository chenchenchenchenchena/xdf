
$(function(){







var stuname = sessionStorage.s.split(',');
var teaname = sessionStorage.t.split(',');
for(var i = 1;i<teaname.length+1;i++){
	if(teaname[i]!=''&&teaname[i]!=undefined){
		$('.slist').append('<li class="listCon"><ul class="teClass"><li>'+teaname[i]+'老师班('+sessionStorage.cc+')</li><li class="arrow"></li></ul><ul class="studentList"></ul></li>')
        for(var k = 0;k<stuname.length;k++){
        	if(stuname[k]!=''){
        		$('.studentList').eq(i-1).append('<li><i>'+(k+1)+'</i><span>'+stuname[k].substring(0,1)+'</span><span>'+stuname[k]+'</span></li>')
        	}
        }
	}else{
        $('.slist').append('<li class="listCon"><ul class="teClass"><li>'+sessionStorage.tm+'老师班('+sessionStorage.cc+')</li><li class="arrow"></li></ul><ul class="studentList"></ul></li>')
        for(var k = 0;k<stuname.length;k++){
            if(stuname[k]!=''){
                $('.studentList').eq(i-1).append('<li><i>'+(k+1)+'</i><span>'+stuname[k].substring(0,1)+'</span><span>'+stuname[k]+'</span></li>')
            }
        }
	}



	// var stumore = stuname[i].split(',');
	// for(var k = 0;k<stumore.length;k++){
	// 	if(stumore[k]!=''){
	// 		$('.studentList').eq(i).append('<li><i>'+(k+1)+'</i><span>'+stumore[k].substring(0,1)+'</span><span>'+stumore[k]+'</span></li>')
	// 	}
	// }
    $('.slistTitle').html('课堂学生列表('+(stuname.length-1)*teaname.length+')')
}
						





})















