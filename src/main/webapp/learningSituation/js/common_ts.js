$(function(){
    var arr;
    if(!sessionStorage.schoolId){
        sessionStorage.schoolId = localStorage.getItem('SCHOOLID')
    }
    ajax_S(url.stumo,{'schoolId':sessionStorage.schoolId,'studentNo':sessionStorage.stuNumber,'classCode':sessionStorage.classCode},function(e){

        arr = e;

        if(arr.result==true){
            $('title').html(e.studentName);
            $('.header_yh').append('<h4>'+arr.ClassName+'<span>共'+arr.LessonCount+'课次</span></h4><p>班号('+sessionStorage.classCode+') <span>'+arr.BeginDate.split(' ')[0].replace(/\-/g,'/')+'-'+arr.EndDate.split(' ')[0].replace(/\-/g,'/')+'</span></p>');
            var more_ = arr.StudentClassRoomAnswer;
            for(var i = 0;i<more_.length;i++){
                more_[i].classCorrectRate = parseInt(parseFloat(more_[i].classCorrectRate)*100);
                more_[i].perCorrectRate = parseInt(parseFloat(more_[i].perCorrectRate)*100);
                $('.common_yh').append('<div class="less_yh"><div class="less_yh_tit"><h4>第'+more_[i].lessonNo+'课次<span>'+more_[i].lessonStart+'   - <i style="margin-left:3px;">'+more_[i].lessonEnd.substr(more_[i].lessonEnd.length-5,more_[i].lessonEnd.length)+'</i><span class="answer_more" stuNum="'+ more_[i].studentNo+'"  classCode="'+ more_[i].classCode+'"  lessonNo="'+ more_[i].lessonNo+'">答题详情</span></span></h4></div><ul class="less_number"><li><h4>'+more_[i].perAnswerCount+' <span> / '+more_[i].allCount+'</span></h4><p>答题量/提问量</p></li><li><h4>'+more_[i].perCorrectRate+'% <span> / '+more_[i].classCorrectRate+' %</span></h4><p>正确率/班均正确率</p></li><li><h4>'+more_[i].perAverageTime+'"    <span> / '+more_[i].classAverageTime+'"</span></h4><p>均用时/班级均用时</p></li></ul></div>')

            }
        }else{
            $('header,section').hide();
            $('.no-data').show();
        }
    });
    $('.common_yh').on('touchend','.answer_more',function(){
        var need_ = {
            stuNum:$(this).attr('stunum'),
            classCode:$(this).attr('classcode'),
            lessonNo:$(this).attr('lessonno')
        };
        ajaxRequest('post',url.anwser_t,need_,function(e){
            if(e.data.length==0){
                layer.msg('暂无数据')
            }else{

                for(i in e.data){
                    var detailItemId = e.data[i].detailItemId,
                     correctAnswer = e.data[i].correctAnswer,
                     answer = e.data[i].answer,
                     userTime = e.data[i].userTime,
                     answer_;
                    if(answer==correctAnswer){
                        answer_ = '<span>'+answer+'</span>'
                    }else{
                        answer_ ='<span style="color:red;">'+answer+'</span>'
                    }
                    $('.big_back_center ul').append('<li><span>'+detailItemId+'</span>'+answer_+'<span>'+correctAnswer+'</span><span>'+userTime+'</span></li>')
                }

                $('.big_back').show();
            }
        })
    });

    $('.big_back_center img').on('touchend',function(){
        $('.big_back').hide();
        $('.big_back_center li').eq(0).siblings().remove();
    });











});