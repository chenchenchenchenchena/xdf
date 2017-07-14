$(function(){






    ajaxRequest('post',homework_s.t_mmmm,{Tcid:getRequest('tid').tid},function(e){
            console.log(e);
            var data = e.data;
            $('.title_s i').html(data.className);
            $('.title_s p').eq(1).html(data.teacherName+'老师');
            $('.title_s p').eq(2).html('日期:'+data.homeworkTime);
            for(var i = 0;i<data.StudentHomeInfo.length;i++){
                $('.homework_big').append('<div class="homework_small"> <div class="homework_small_title"> <h4>'+data.StudentHomeInfo[i].studentName+'同学</h4> </div> <div class="answer_s"> <p>'+data.StudentHomeInfo[i].description+'</p></div><div class="music_s"> <span>10"</span> </div> <div class="imgBox imgBox_s"> <div><img src="images/B02-23_03.png" alt=""></div> <div><img src="images/B02-23_03.png" alt=""></div> <div><img src="images/B02-23_03.png" alt=""></div> </div> </div>')
            }
        });















})