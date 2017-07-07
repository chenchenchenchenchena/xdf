$(function(){
    var emailm = {
        'studentCode':sessionStorage.stuNum,
        'beginDate':sessionStorage.timetoday.split(' ')[0],
        'endDate':sessionStorage.timetoday.split(' ')[0]
    };
    var mastertae = [];
	sessionStorage.s ='';
	ajax_S(url.s_stud,emailm,stusea);
    ajax_S(url.data_s,'',function(e){
        for(var i = 0;i<e.data.length;i++){
            mastertae.push(e.data[i]);
        }
    });
    var subject_s = '';
    function stusea(e){
        var teacindex = 0;
        var BeginDate =  e.data.Data
        var timeindex = 0;
        var regionindex = [];
        for(var i = 0;i<BeginDate.length;i++){
            if(BeginDate[i].SectBegin==sessionStorage.timetoday){
                timeindex =i
                regionindex.push(i)
            }
        }
        // e.data.Data[0].mastertae
        var masterta = e.data.Data[0].Teachers.split(',');
        var subject = e.data.Data[timeindex].ClassCode;
        for(var v = 0;v<e.subject.length;v++){
            if(e.subject[v].classCode==subject){
                subject_s = e.subject[v].subject
            }
        }
        var masteaname = '';
        for(var j = 0;j<mastertae.length;j++){
            for(var k = 0;k<masterta.length;k++){
                if(mastertae[j].teacherName==masterta[k]){
                    masterta[k] = ''
                    teacindex = j;
                }
            }
        }
        var begintime = BeginDate[timeindex].SectBegin.split(' ')[1].substring(0,BeginDate[timeindex].SectBegin.split(' ')[1].length-3)
        var begindata = BeginDate[timeindex].BeginDate.split(' ')[0].replace(/\-/g,'/')
        var endtime = BeginDate[timeindex].SectEnd.split(' ')[1].substring(0,BeginDate[timeindex].SectEnd.split(' ')[1].length-3)
        var enddata = BeginDate[timeindex].EndDate.split(' ')[0].replace(/\-/g,'/')

        var LessonCount = BeginDate[timeindex].LessonCount
        var LessonNo = BeginDate[timeindex].LessonNo
        $('.scheduleTitle').html(BeginDate[timeindex].ClassName+'('+subject_s+')')
        $('.time span').html(begintime+'-'+endtime)
        $('.date span').html(begindata+'-'+enddata)
        $('.classHour i').eq(0).html(LessonNo)
        $('.classHour i').eq(1).html(LessonCount)
        $('.progressBar p').css('width',LessonNo/LessonCount*100+'%');
        var arr = [];
        for(var i = 0;i<regionindex.length;i++){
            var room_html = '';
            if(BeginDate[regionindex[i]].RoomName!=undefined&&BeginDate[regionindex[i]].AreaName!=undefined){
                room_html = BeginDate[regionindex[i]].AreaName+''+BeginDate[regionindex[i]].RoomName+'教室'
            }else if(BeginDate[regionindex[i]].AreaName==undefined&&BeginDate[regionindex[i]].RoomName!=undefined){
                room_html  = BeginDate[regionindex[i]].RoomName+'教室'
            }else{
                room_html = '暂无数据'
            }
            $('#position').html(room_html);
            for(var j = 0;j<masterta.length;j++){
                if(masterta[j]!=''){
                    $('.teacherList ul').append('<li class="swiper-slide"><span style="font-size:.36rem;">班主任</span><p>'+masterta[j]+'</p></li>')
                }else{
                    $('.teacherList ul').append('<li class="swiper-slide"><span style="font-size:.36rem;">主讲</span><p>'+mastertae[teacindex].teacherName+'</p></li>');
                    masteaname = mastertae[teacindex]
                }
            }

            arr.push(BeginDate[regionindex[i]].Students);
            var stuall = BeginDate[regionindex[i]].Students;
            for(var k = 0;k<stuall.length;k++){
                sessionStorage.s += stuall[k].StudentName+',';
                if(stuall[k].StudentName.length>3){
                    $('.studentList ul').append('<li class="swiper-slide" style="font-size:.4rem;">'+stuall[k].StudentName.substring(2,stuall[k].StudentName.length)+'<p style="font-size:.3rem;">'+stuall[k].StudentName+'</p></li>');
                    $('.schoolCampus').append('<dl><dt>'+BeginDate[regionindex[i]].AreaName+'校区</dt><dd>'+BeginDate[regionindex[i]].RoomName+'教室</dd><dd class="name">('+masteaname+':'+BeginDate[regionindex[i]].ClassCode+')</dd></dl>');
                }else{
                    $('.studentList ul').append('<li class="swiper-slide">'+stuall[k].StudentName.substring(1,stuall[k].StudentName.length)+'<p>'+stuall[k].StudentName+'</p></li>')
                }

            }
        }
        $('.teacherList p span').html('('+$('.teacherList li').length+')');
        $('.studentList p span').html('('+$('.studentList li').length+')');
        $('.load_t').hide();

        var swiper = new Swiper('.studentList .swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 5,
            paginationClickable: true,
            spaceBetween: 30
        });
    }





















})