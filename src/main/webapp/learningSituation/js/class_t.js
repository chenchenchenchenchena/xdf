$(function(){
    $('header,section').hide();

    //点击学生
    $(document).on('tap','.stu_yh li',function(){
        sessionStorage.schoolId = $(this).attr('schoolId');
        sessionStorage.stuNumber = $(this).attr('StudentCode');
        sessionStorage.classCode = $(this).attr('classcode');
        location.href = 'common_ts.html';
    });

    ajax_S(url.t_leyh,{'schoolId':sessionStorage.schoolid,'classCode':sessionStorage.classcode,'email':localStorage.terEmail},function(e){
        if(e.result==true){
            $('header,section').show();
            $('title').html(localStorage.teacherName);
            var classtime = e.dataList;
            var lessdata = e.lessonData;
            var student = lessdata.studentData;
            $('.header_yh').append('<h4>'+lessdata.className+'<span>共'+lessdata.lessonCount+'课次</span></h4><p>班号('+sessionStorage.classcode+') <span>'+lessdata.beginDate.split(' ')[0].replace(/\-/g,'/')+'-'+lessdata.endDate.split(' ')[0].replace(/\-/g,'/')+'</span></p>');

            for(var i = 0;i<classtime.length;i++){
            var Correct = parseFloat(classtime[i].correctRate);
            $('.reportstu_S').append('<ul><li>'+classtime[i].lessonNo+'</li><li>'+classtime[i].answerCount+'</li><li>'+classtime[i].stuNum+'</li><li>'+classtime[i].allCount+'</li><li>'+parseInt(Correct*100)+'%</li><li>'+classtime[i].averageTime+'"</li></ul>');
            }
            if(!lessdata.studentData){
              $('.stu_yh ul').append('<p style="font-size:25px;padding-bottom:20px;line-height:50px;text-align:center;">学生列表数据非正常扫码数据</p>')
                return false;
            }
            for(var k = 0;k<student.length;k++){
                var studentname = '';
                if(student[k].studentName.length>2){
                    studentname = student[k].studentName.substr(student[k].studentName.length-2,2)
                }else{
                    studentname = student[k].studentName
                }

                $('.stu_yh ul').append('<li classCode="'+lessdata.classCode+'" schoolId="'+student[k].schoolId+'" studentcode="'+student[k].studentNo+'"><span>'+studentname+'</span><p>'+student[k].studentName+'</p></li>')
            }
        }else{
            $('header,section').hide();
            $('.no-data').show();
        }
    })






});