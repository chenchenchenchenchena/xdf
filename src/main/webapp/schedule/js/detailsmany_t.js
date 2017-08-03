$(function () {
    var emailm = {
        'teacherEmail': localStorage.terEmail,
        'beginDate': sessionStorage.timetoday.split(' ')[0],
        'endDate': sessionStorage.timetoday.split(' ')[0]
    }
    sessionStorage.s = ''
    var mastertae = [];
    ajax_S(url.s_emai, emailm, stusea);
    ajax_S(url.data_s, '', function (e) {
        for (var i = 0; i < e.data.length; i++) {
            mastertae.push(e.data[i]);
        }
    });
    //所属类别（显示到title）
    var subject_s = '';

    function stusea(e) {
        var teacindex = 0;
        var BeginDate = e.data.Data
        var timeindex = 0;
        var regionindex = [];
        for (var i = 0; i < BeginDate.length; i++) {
            if (BeginDate[i].SectBegin == sessionStorage.timetoday && BeginDate[i].ClassCode == sessionStorage.classCode) {
                timeindex = i
                regionindex.push(i)
            }
        }
        //搭班老师
        var masterta = e.data.Data[timeindex].Teachers.split(',');
        //当前的课程编号
        var subject = e.data.Data[timeindex].ClassCode;
        for (var v = 0; v < e.subject.length; v++) {
            if (e.subject[v].classCode == subject) {
                subject_s = e.subject[v].subject
            }
        }
        var masteaname = '';
        for (var j = 0; j < mastertae.length; j++) {
            for (var k = 0; k < masterta.length; k++) {
                if (mastertae[j].teacherName == masterta[k]) {
                    masterta[k] = ''
                    teacindex = j;
                }
            }
        }
        var begintime = BeginDate[timeindex].SectBegin.split(' ')[1].substring(0, BeginDate[timeindex].SectBegin.split(' ')[1].length - 3);
        if (BeginDate[timeindex].BeginDate != undefined && BeginDate[timeindex].BeginDate != null && BeginDate[timeindex].BeginDate != '') {
            var begindata = BeginDate[timeindex].BeginDate.split(' ')[0].replace(/\-/g, '/');

        } else {
            var begindata = '';
        }
        var endtime = BeginDate[timeindex].SectEnd.split(' ')[1].substring(0, BeginDate[timeindex].SectEnd.split(' ')[1].length - 3)
        if (BeginDate[timeindex].EndDate != undefined && BeginDate[timeindex].EndDate != null && BeginDate[timeindex].EndDat != '') {
            var enddata = BeginDate[timeindex].EndDate.split(' ')[0].replace(/\-/g, '/');
        } else {
            var enddata = '';
        }
        //课时总长度
        var LessonCount = BeginDate[timeindex].LessonCount;
        //当前课时
        var LessonNo = BeginDate[timeindex].LessonNo;
        $('.scheduleTitle').html(BeginDate[timeindex].ClassName + '(' + subject_s + ')');
        $('.time span').html(begintime + '-' + endtime);
        $('.date span').html(begindata + '-' + enddata);
        $('.classHour i').eq(0).html(LessonNo);
        $('.classHour i').eq(1).html(LessonCount);
        $('.progressBar p').css('width', LessonNo / LessonCount * 100 + '%');
        var arr = [];
        for (var i = 0; i < regionindex.length; i++) {
            if (BeginDate[regionindex[i]].RoomName == undefined) {
                BeginDate[regionindex[i]].RoomName = '暂无数据'
            } else {
                BeginDate[regionindex[i]].RoomName = BeginDate[regionindex[i]].RoomName + '教室'
            }
            if (BeginDate[regionindex[i]].AreaName == undefined) {
                BeginDate[regionindex[i]].AreaName = ''
            }
            $('.schoolCampus h3').html('上课校区(' + (i + 1) + ')')
            for (var j = 0; j < masterta.length; j++) {
                if (masterta[j] != '') {
                    $('.teacherList ul').append('<li class="swiper-slide"><span style="font-size:.36rem;">班主任</span><p>' + masterta[j] + '</p></li>')
                    $('.schoolCampus').append('<dl><dt>' + BeginDate[regionindex[i]].AreaName + '校区</dt><dd>' + BeginDate[regionindex[i]].RoomName + '</dd><dd class="name">(' + masterta[j] + ':' + BeginDate[regionindex[i]].ClassCode + ')</dd></dl>');
                } else {
                    $('.teacherList ul').append('<li class="swiper-slide"><span style="font-size:.36rem;">主讲</span><p>' + mastertae[teacindex].teacherName + '</p></li>')
                }
            }
            arr.push(BeginDate[regionindex[i]].Students);
            sessionStorage.t = masterta;
            sessionStorage.tm = mastertae[teacindex].teacherName;
            sessionStorage.cc = BeginDate[regionindex[i]].ClassCode
            var stuall = BeginDate[regionindex[i]].Students
            for (var k = 0; k < stuall.length; k++) {
                sessionStorage.s += stuall[k].StudentName + ',';
                if (stuall[k].StudentName.length > 3) {
                    $('.studentList ul').append('<li class="swiper-slide" style="font-size:.4' +
                        'rem;">' + stuall[k].StudentName.substring(2, stuall[k].StudentName.length) + '<p style="font-size:.3rem;">' + stuall[k].StudentName + '</p></li>')
                } else {
                    $('.studentList ul').append('<li class="swiper-slide">' + stuall[k].StudentName.substring(1, stuall[k].StudentName.length) + '<p >' + stuall[k].StudentName + '</p></li>')
                }
            }
        }
        $('.teacherList p span').html('(' + $('.teacherList li').length + ')')
        $('.studentList p span').html('(' + $('.studentList li').length + ')')
        $('.load_t').hide()
        var swiper = new Swiper('.studentList .swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 5,
            paginationClickable: true,
            spaceBetween: 30
        });
    }


})