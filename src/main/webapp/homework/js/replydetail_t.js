$(function(){

        var need = {
            'stuHomeworkId':'2df7851f933b41948a3c5c93270aeaf5',
            'homeworkTinfoId':'1452851f933b41948a3c5c9327897'

        };



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

            $('.anDes').html(sessionStorage.stutext);
            ajaxRequest('post',homework_s.t_seac,{Tcid:sessionStorage.TeacherId},function(e){
                        console.log(e)
            })


        //输入验证
        $('.teBox').on('keyup',function(){
            $('.teacherword').html(''+$(this).val().length+'/200')
        });































});