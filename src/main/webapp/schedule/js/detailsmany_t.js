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
    sessionStorage.t = '';
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
                    sessionStorage.t = masterta[k];
                    masterta[k] = '';
                    teacindex = j;
                }
            }
        }
        if (BeginDate[timeindex].SectBegin != undefined && BeginDate[timeindex].SectBegin != null && BeginDate[timeindex].SectBegin != '') {
            var begintime = BeginDate[timeindex].SectBegin.split(' ')[1].substring(0, BeginDate[timeindex].SectBegin.split(' ')[1].length - 3);
        } else {
            var begintime = '';
        }

        if (BeginDate[timeindex].SectEnd != undefined && BeginDate[timeindex].SectEnd != null && BeginDate[timeindex].SectEnd != '') {
            var endtime = BeginDate[timeindex].SectEnd.split(' ')[1].substring(0, BeginDate[timeindex].SectEnd.split(' ')[1].length - 3)
        } else {
            var endtime = '';
        }


        if (BeginDate[timeindex].BeginDate != undefined && BeginDate[timeindex].BeginDate != null && BeginDate[timeindex].BeginDate != '') {
            var begindata = BeginDate[timeindex].BeginDate.split(' ')[0].replace(/\-/g, '/');

        } else {
            var begindata = '';
        }
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
            $('.schoolCampus h3').html('上课校区(' + (i + 1) + ')');

            for (var j = 0; j < masterta.length; j++) {
                if (masterta[j] != '') {
                    $('.teacherList ul').append('<li class="swiper-slide"><span style="font-size:.36rem;">班主任</span><p>' + masterta[j] + '</p></li>')

                } else {
                    $('.teacherList ul').append('<li class="swiper-slide"><span style="font-size:.36rem;">主讲</span><p>' + mastertae[teacindex].teacherName + '</p></li>')
                }
                $('.schoolCampus').append('<dl><dt>' + BeginDate[regionindex[i]].AreaName + '校区</dt><dd>' + BeginDate[regionindex[i]].RoomName + '</dd><dd class="name">(' + masterta[j] + ':' + BeginDate[regionindex[i]].ClassCode + ')</dd></dl>');
            }

            arr.push(BeginDate[regionindex[i]].Students);
            sessionStorage.t += masterta;
            sessionStorage.tm = mastertae[teacindex].teacherName;
            sessionStorage.cc = BeginDate[regionindex[i]].ClassCode;
            var stuall = BeginDate[regionindex[i]].Students;
            var stuListStorage = [];
            for (var k = 0; k < stuall.length; k++) {

                //打电话
                var mobile = stuall[k].Mobile;
                var stuInfo = {'studentName':stuall[k].StudentName,'studentCode':stuall[k].StudentCode,'mobile':mobile};
                stuListStorage.push(stuInfo);

                localStorage.setItem('CLASSCODE',stuall[k].ClassCode);
                localStorage.setItem('SCHOOLID',stuall[k].SchoolId);

                //存储学生的名字，在studentlist_t.html页面要用到
                // sessionStorage.s += stuall[k].StudentName + ',';
                //存储学生学号
                // sessionStorage.studentCode = stuall[k].StudentCode;
                //在studentlist_t.html页面新增添 打电话、进入学情的功能，需要的数据
                // teacherEmail:hanqifan@xdf.cn
                // classCode:HDXP3EB03  sessionStorage.cc/sessionStorage.classCode
                // tCode:2
                // studentNo:SS6077  sessionStorage.studentCode = stuall[k].StudentCode;
                // schoolId:73

                // {
                //     "uid":"TC23",
                //     "extension":"15101001841",
                //     "sid":"SS5336",
                //     "sign":"fyLOH9X6vnW0OZ0L23BWI2kcJO4=",
                //     "schoolId":"73",
                //     "callerid":"83410099",
                //     "toExtension":"dsd"}

                //电话号码
                if (stuall[k].StudentName.length > 3) {
                    $('.studentList ul').append('<li class="swiper-slide" style="font-size:.4' +
                        'rem;"><a href="studentInfo.html?remark=1&studentNo=' + stuall[k].StudentCode + '&schoolId='+BeginDate[timeindex].SchoolId+'><span class="name-icon">' + stuall[k].StudentName.substring(2, stuall[k].StudentName.length) + '</span></a><p style="font-size:.3rem;">' + stuall[k].StudentName + '</p><i class="to-tel" tel="' + mobile + '" stuCode="' + stuall[k].StudentCode + '" ></i><a class="to-learn" href="../learningSituation/reportstu_t.html?studentNo=' + stuall[k].StudentCode + '&tCode=1&studentName=' + stuall[k].StudentName + '">查看学情</a></li>')
                } else {
                    $('.studentList ul').append('<li class="swiper-slide"><a href="studentInfo.html?remark=1&studentNo=' + stuall[k].StudentCode + '&schoolId='+BeginDate[timeindex].SchoolId+'"><span class="name-icon" href="../learningSituation/reportstu_t.html?studentNo=' + stuall[k].StudentCode + '&tCode=1&studentName=' + stuall[k].StudentName + '">' + stuall[k].StudentName.substring(stuall[k].StudentName.length - 2, stuall[k].StudentName.length) + '</span></a><p >' + stuall[k].StudentName + '</p><i class="to-tel" tel="' + mobile + '" stuCode="' + stuall[k].StudentCode + '" ></i><a class="to-learn" href="../learningSituation/reportstu_t.html?studentNo=' + stuall[k].StudentCode + '&tCode=1&studentName=' + stuall[k].StudentName + '">查看学情</a></li>')
                }
            }

            //存储学生的名字和学号，在studentlist_t.html页面要用到
            var stuInfoKey = {'stuInfoKey':stuListStorage};
            sessionStorage.stuList = JSON.stringify(stuInfoKey);
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

    //打电话
    $(document).on('touchstart','.to-tel',function () {
        var stuTel = $(this).attr("tel");
        var stuCode = $(this).attr("stuCode");
        call(stuCode,stuTel);
    });

    function call(stuCode,stuTel) {
        var appid="ssdf";
        var signKey= "shuangshidongfang2017APP0810-cs331-0801";
        // var callerid= "83410012";
        var uid = localStorage.teacherId;
        var sid = stuCode;
        var extension = localStorage.teachertel;
        var str = extension + sid + appid;
        var hash = CryptoJS.HmacSHA1(str, signKey);
        var base64 = CryptoJS.enc.Base64.stringify(hash);
        var rt = encodeURIComponent(base64);
        // var hash = crypto.createHmac('sha1', signKey).update(str).digest().toString('base64');
        var reqData = {
            "uid":uid,
            "extension":extension,
            "sid":sid,
            "sign":rt,
            "schoolId":localStorage.schoolId,
            "toExtension":encodeURIComponent(stuTel)};
        // var url_o = 'http://dt.staff.xdf.cn/xdfdtmanager/';
        $.ajax({
            type: 'POST',
            url: url_o+'teacherData/teacherCallPhone.do',//老师拨打电话
            data: JSON.stringify(reqData),
            success: function (e) {
                alert(JSON.parse(e).msg);
            },
            error: function (err) {
                // failureCallback(msg);
                console.log("err:"+err);
            }
        });
    }


})