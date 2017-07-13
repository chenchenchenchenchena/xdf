$(function(){

        var need = {
            'stuHomeworkId':'2df7851f933b41948a3c5c93270aeaf5',
            'homeworkTinfoId':'1452851f933b41948a3c5c9327897',

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

        // ajax_S(homework_s.t_modi,)































});