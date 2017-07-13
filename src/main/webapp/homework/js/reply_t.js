$(function(){
var a = { "classCode":sessionStorage.classCode_s,"homeworkTime":sessionStorage.homeworkTime_s ,"courseCode":sessionStorage.courseCode_s ,"teacherEmail":"caoxuefeng@xdf.cn","schoolId":"73"};
    ajax_S(homework_s.t_more,a,function(e){
             console.log(e);
            var data = e.data
            if(data.notCommit.length==0){
                $('.emptyThree').show()
            }else{
                for(var b = 0;b<data.notCommit.length;b++){
                    $('.Pending').eq(2).append('<li><span class="yeCircle">'+data.notCommit[b].studentName.substr(1,2)+'</span><span>'+data.notCommit[b].studentName+'</span></li>')
                }
            }
            if(data.notCorrect.length==0){
                $('.emptyOne').show()
            }else{
                for(var c = 0;c<data.notCorrect.length;c++){
                    $('.Pending').eq(0).append('<li><span class="yeCircle">'+data.notCorrect[c].studentName.substr(1,2)+'</span><span>'+data.notCorrect[c].studentName+'</span><span>05.25 13:20</span></li>')
                }
            }
            if(data.yesCorrect.length==0){
                $('.emptyTwo').show()
            }else{
                for(var d = 0;d<data.yesCorrect.length;d++){
                    $('.Pending').eq(1).append('<li><span class="yeCircle">'+data.yesCorrect[d].studentName.substr(1,2)+'</span><span>'+data.yesCorrect[d].studentName+'</span><span>05.25 13:20</span></li>')
                }
            }















    })









});