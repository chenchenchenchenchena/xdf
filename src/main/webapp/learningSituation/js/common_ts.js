$(function(){
    var arr;

    ajax_S(url.stumo,{'schoolId':sessionStorage.schoolId,'studentNo':sessionStorage.stuNumber,'classCode':sessionStorage.classCode},function(e){

        arr = e;

        if(arr.result==true){
            $('title').html(e.studentName)
            $('.header_yh').append('<h4>'+arr.ClassName+'<span>共'+arr.LessonCount+'课次</span></h4><p>班号('+sessionStorage.classCode+') <span>'+arr.BeginDate.split(' ')[0].replace(/\-/g,'/')+'-'+arr.EndDate.split(' ')[0].replace(/\-/g,'/')+'</span></p>');
            var more_ = arr.StudentClassRoomAnswer;
            for(var i = 0;i<more_.length;i++){
                more_[i].classCorrectRate = parseFloat(more_[i].classCorrectCount)*100;
                more_[i].perCorrectRate = parseFloat(more_[i].perCorrectCount)*100;
                $('.common_yh').append('<div class="less_yh"><div class="less_yh_tit"><h4>第'+more_[i].lessonNo+'课次<span>'+more_[i].lessonStart+'-<i>'+more_[i].lessonEnd.substr(more_[i].lessonEnd.length-5,more_[i].lessonEnd.length)+'</i></span></h4></div><ul class="less_number"><li><h4>'+more_[i].perAnswerCount+' <span> / '+more_[i].allCount+'</span></h4><p>答题量/提问量</p></li><li><h4>'+more_[i].classCorrectRate+'% <span> / '+more_[i].perCorrectRate+' %</span></h4><p>正确率/班均正确率</p></li><li><h4>'+more_[i].perAverageTime+'"    <span> / '+more_[i].classAverageTime+'"</span></h4><p>均用时/班级均用时</p></li></ul></div>')

            }
        }else{
            $('header,section').hide();
            $('.no-data').show();
        }
    });














});