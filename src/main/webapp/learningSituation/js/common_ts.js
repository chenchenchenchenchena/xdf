$(function(){
    var arr;

    ajax_S(url.stumo,{'schoolId':sessionStorage.schoolId,'studentNo':sessionStorage.stuNumber,'classCode':sessionStorage.classCode},function(e){

        arr = e;

        if(arr.result==true){
            $('.header_yh').append('<h4>'+arr.className+'<span>共'+arr.LessonCount+'课次</span></h4><p>班号('+sessionStorage.classcode+') <span>'+arr.BeginDate+'-'+arr.EndDate+'</span></p>');
            var more_ = arr.StudentClassRoomAnswer;
            for(var i = 0;i<more_.length;i++){

                $('.common_yh').append('<div class="less_yh"><div class="less_yh_tit"><h4>第'+more_[i].lessonNo+'课次<span>'+more_[i].lessonStart+' <i>'+more_[i].lessonEnd+'</i></span></h4></div><ul class="less_number"><li><h4>'+more_[i].perAnswerCount+' <span>/'+more_[i].allCount+'</span></h4><p>答题量/提问量</p></li><li><h4>'+more_[i].perCorrectCount+' <span>/'+more_[i].classCorrectCount+'</span></h4><p>正确率/班均正确率</p></li><li><h4>'+more_[i].perAverageTime+' <span>/'+more_[i].classAverageTime+'</span></h4><p>均用时/班级均用时</p></li></ul></div>')

            }
        }else{
            $('header,section').hide();
            $('.no-data').show();
        }
    });














});