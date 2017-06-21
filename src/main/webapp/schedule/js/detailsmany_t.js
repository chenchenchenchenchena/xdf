$(function(){
	var emailm = {
		'teacherEmail':'caoxuefeng@xdf.cn',
    	'beginDate':'2017-02-04',
    	'endDate':'2017-02-04'
	}
	ajax_S(url.s_emai,emailm,stusea)

	function stusea(e){
		console.log(e)

		var BeginDate =  e.data.Data
		var timeindex = 0;
		var regionindex = [];
		for(var i = 0;i<BeginDate.length;i++){
			if(BeginDate[i].BeginDate=='2017-02-03 13:30:00'){
					timeindex =i
					regionindex.push(i)
			}
		}
		var begintime = BeginDate[timeindex].BeginDate.split(' ')[1].substring(0,BeginDate[timeindex].BeginDate.split(' ')[1].length-3)
		var begindata = BeginDate[timeindex].BeginDate.split(' ')[0].replace('-','/')
		var endtime = BeginDate[timeindex].EndDate.split(' ')[1].substring(0,BeginDate[timeindex].EndDate.split(' ')[1].length-3)
		var enddata = BeginDate[timeindex].EndDate.split(' ')[0].replace('-','/')
		var LessonCount = BeginDate[timeindex].LessonCount
		var LessonNo = BeginDate[timeindex].LessonNo
		// var Teachers = BeginDate[timeindex].Teachers.split(',')
		// var Students = BeginDate[timeindex].Students
		// console.log(BeginDate[timeindex].BeginDate.split(' ')[1].substring(0,BeginDate[timeindex].BeginDate.split(' ')[1].length-3))
		// BeginDate[timeindex]
		$('.scheduleTitle').html(BeginDate[timeindex].ClassName)
		$('.time span').html(begintime+'-'+endtime)
		$('.date span').html(begindata+'-'+enddata)
		$('.classHour i').eq(0).html(LessonNo)
		$('.classHour i').eq(1).html(LessonCount)
		$('.progressBar p').css('width',LessonNo/LessonCount*100+'%')
		// for(var i = 0;i<Students.length;i++){
		// 	$('.studentList ul').append('<li class="swiper-slide">'+Students[i].StudentName.substring(0,1)+'</li>')
		// }
		var arr = []
		for(var i = 0;i<regionindex.length;i++){
			if(BeginDate[regionindex[i]].AreaName==undefined){
				BeginDate[regionindex[i]].AreaName='暂无数据'
			}
			$('.schoolCampus').append('<dl><dt>'+BeginDate[regionindex[i]].AreaName+'</dt><dd>'+BeginDate[regionindex[i]].SchoolName+'</dd><dd class="name">(李晓明:'+BeginDate[regionindex[i]].ClassCode+')</dd></dl>')
			$('.teacherList ul').append('<li class="swiper-slide">'+BeginDate[regionindex[i]].Teachers.split(',')[1].substring(0,1)+'</li>')
			sessionStorage.s+=BeginDate[regionindex[i]].Students.join('')
			arr.push(BeginDate[regionindex[i]].Students)
			sessionStorage.t+=BeginDate[regionindex[i]].Teachers.split(',')[1]+','
			var stuall = BeginDate[regionindex[i]].Students
			for(var k = 0;k<stuall.length;k++){
				$('.studentList ul').append('<li class="swiper-slide">'+stuall[k].StudentName.substring(0,1)+'</li>')
			}
		}
		$('.teacherList p span').html('('+$('.teacherList li').length+')')
		$('.studentList p span').html('('+$('.studentList li').length+')')
		// console.log(Teachers)

		sessionStorage.s = arr
		sessionStorage.n = BeginDate[regionindex[0]].ClassCode
		// console.log(arr.length)s
		for(var i = 0;i<arr.length;i++){

			for(var k = 0;k<arr[i].length;k++){
				sessionStorage.stuNa+= arr[i][k].StudentName+','
			}
			sessionStorage.stuNa+='0'
		}
		// console.log(sessionStorage.stuNa)

		$('.load_t').hide()


	}



















})