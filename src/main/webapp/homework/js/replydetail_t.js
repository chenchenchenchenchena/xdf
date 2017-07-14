$(function(){

        var need = {
            'stuHomeworkId': sessionStorage.stuid,
            'homeworkTinfoId':sessionStorage.Tid

        };
        $('.anDes').html(sessionStorage.stutext);
        $('.kon p:last-of-type').html(sessionStorage.knowledgePoint);
        $('.hwCon').html(sessionStorage.description);
        $('.hwTeacherRankTitle').on('touchend',function(){
            if($('.hwInfo').css('display')=='none'){
                $('.hwInfo').show();
                $('.hwRankTitle').css('margin-bottom','0');
                $('.hwRankTitle').css('border-bottom','1px solid #ccc');

            }else{
                $('.hwInfo').hide();
                $('.hwRankTitle').css('margin-bottom','18px');
                $('.hwRankTitle').css('border-bottom','none');
            }
        })



        //输入验证
        $('.teBox').on('keyup',function(){
            $('.teacherword').html(''+$(this).val().length+'/200')
        });

        //优秀作业

        $('.infoTitle span').on('touchend',function(){
            if($(this).css('color')=='rgb(255, 106, 106)'){
                $(this).css({
                    'color':'#ccc',
                    'border':'1px solid #ccc'
                });
                $('.excellent').show();
                $('.excellent').append('<img src="images/excellent.gif" alt="">')
                setTimeout(function(){
                    $('.excellent').html('  ')
                },1000)
            }else{
                $(this).css({
                    'color':'#ff6a6a',
                    'border':'1px solid #ff6a6a'
                });
            }
        });



        ajaxRequest('post',homework_s.t_modi,{Tcid:sessionStorage.Tid,Sdtid:sessionStorage.stuid},function(e){
            console.log(e);
            var stu = e.data.StudentHomeworkFile;
            var tea = e.data.TeacherHomeworkFile
            for(var a  = 0;a<stu.length;a++){
                if(stu[a].fileType=='.mp3'||stu[a].fileType=='mp3'){
                    $('#bgMusic').attr('src',stu[a].url)
                }
            }
            for(var b  = 0;b<tea.length;b++){

            }
        });


        $('.music_s ').on('touchend', function () {
                $(this).addClass('playing_s');
                var audio = document.getElementById("bgMusic");
                audio.play();

                console.log(audio.canPlayType("audio/mp3"));
                console.log(audio.readyState);
                if (audio.readyState==0) {
                    console.log("readyState");
                    audio.play();
                }
                setTimeout(function(){
                    $('.music_s').removeClass('playing_s');
                },$('.music_s span').html().substr(0,$('.music_s span').html().length-1)+'000');
            });


        //批改作业提交
        $('.sub_p').on('touchend',function(){
            if($('.teBox').val()==''){
                layer.msg('批复内容不能为空');
            }
            need.replyDesc = $('.teBox').html();
            if($('.infoTitle span').css('color')=='rgb(255, 106, 106)'){
                need.tag = '0'
            }else{
                need.tag = '1'
            }
            need.fileInfo = [];
            ajax_S(homework_s.t_succ,need,function(e){
                console.log(e)
            })
        })




















});