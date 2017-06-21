$(function(){
	// console.log(sessionStorage.timetoday)
var emailm = {
    'studentCode':'SS2303',
    'beginDate':'2017-02-04',
    'endDate':'2017-02-04'
}
	sessionStorage.studen_s =''
	ajax_S(url.s_stud,emailm,stusea)


	function stusea(e){
		console.log(e)
		var BeginDate =  e.data.Data
		var timeindex = 0;
		var regionindex = [];
		for(var i = 0;i<BeginDate.length;i++){
			if(BeginDate[i].BeginDate=='2017-02-03 08:00:00'){
					timeindex =i
					regionindex.push(i)
			}
		}
		var begintime = BeginDate[timeindex].BeginDate.split(' ')[1].substring(0,BeginDate[timeindex].BeginDate.split(' ')[1].length-3);
		var begindata = BeginDate[timeindex].BeginDate.split(' ')[0].replace(new RegExp('-', 'g'),'/');
		var endtime = BeginDate[timeindex].EndDate.split(' ')[1].substring(0,BeginDate[timeindex].EndDate.split(' ')[1].length-3);
		var enddata = BeginDate[timeindex].EndDate.split(' ')[0].replace(new RegExp('-', 'g'),'/');
		var LessonCount = BeginDate[timeindex].LessonCount;
		var LessonNo = BeginDate[timeindex].LessonNo
		var teaname = BeginDate[timeindex].Teachers.split(',');
		var jteaname;
		for(var j = 0;j<BeginDate[timeindex].Students.length;j++){
			sessionStorage.studen_s+=BeginDate[timeindex].Students[j].StudentName+','
		}
		console.log(begintime)
		$('.scheduleTitle').html(BeginDate[timeindex].ClassName+'('+BeginDate[timeindex].CourseName+')')
		$('.stuNum').html(BeginDate[timeindex].ClassCode)
		$('.time span').html(begintime+'-'+endtime)
		$('.date span').html(begindata+'-'+enddata)
        console.log(begindata)
        console.log(enddata)
		$('#position').html(BeginDate[timeindex].RoomName)
		$('.classHour i').eq(0).html(LessonNo)
		$('.classHour i').eq(1).html(LessonCount)
		$('.progressBar p').css('width',LessonNo/LessonCount*100+'%')
		var arr = []
		for(var i = 0;i<regionindex.length;i++){
			if(BeginDate[regionindex[i]].AreaName==undefined){
				BeginDate[regionindex[i]].AreaName='暂无数据'
			}
			


			for(var k = 0;k<teaname.length;k++){
            if(teaname[k]!='曹雪峰'){
                jteaname = teaname[k]
            }
        	}


			// $('.schoolCampus').append('<dl><dt>'+BeginDate[regionindex[i]].AreaName+'</dt><dd>'+BeginDate[regionindex[i]].SchoolName+'</dd><dd class="name">(李晓明:'+BeginDate[regionindex[i]].ClassCode+')</dd></dl>')
			$('.teacherList ul').append('<li class="swiper-slide">'+jteaname.substring(0,1)+'</li>')
			$('.nocade_s ul').append('<li><span>'+jteaname.substring(0,1)+'</span><p>主讲：'+jteaname+'老师</p></li><li><span>曹</span><p>班主任：曹雪峰老师</p></li>')

			var stuall = BeginDate[regionindex[i]].Students
			for(var k = 0;k<stuall.length;k++){
				$('.studentList ul').append('<li class="swiper-slide">'+stuall[k].StudentName.substring(0,1)+'</li>')
			}
		}
		$('.teacherList p span').html('('+$('.teacherList li').length+')')
		$('.studentList p span').html('('+$('.studentList li').length+')')
		// console.log(Teachers)

		// sessionStorage.n = BeginDate[regionindex[0]].ClassCode

		console.log(sessionStorage.studen_s)

		$('.load_t').hide()
        var swiper = new Swiper('.studentList .swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 5,
            paginationClickable: true,
            spaceBetween: 30
        });

	}



















})