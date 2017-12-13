/* 概况 */

require(['jquery-1.11.0.min','requireConfig'], function () {
    require(['layer'], function () {
        $('.loading_pre').show();

        // 重置左导航
        var number_l = 0;
        var url_l =  location.href;

        if(url_l.indexOf('homework')!=-1||url_l.indexOf('homeworkdetail')!=-1){
            number_l = 1;
        }
        else if(url_l.indexOf('lesstime')!=-1||url_l.indexOf('lesstime_detail')!=-1){
            number_l = 2;
        }
        else if(url_l.indexOf('power')!=-1||url_l.indexOf('userAdd')!=-1||url_l.indexOf('useredit')!=-1){
            number_l = 3
        }
        else if(url_l.indexOf('master')!=-1){
            number_l = 4
        }
        var $bure_true = $('.left_nav ul li').eq(number_l);
        $bure_true.addClass('activ_nav').siblings().removeClass('activ_nav');

     layer.load();
    /*css 兼容*/


    layer.closeAll('loading');
    //请求列表
    $.ajax({
        url:global.indexAll,
        type: 'post',
        asyns:false,
        dataType: 'json',
        data:JSON.stringify({schoolId:localStorage.schoolList}),
        success:function(e){
            if(e.result){
                var usernum = e.Data;
                var formurl = [];
                $('.totalUser').html(usernum.totalUser+'<span>人</span>');
                $('.teacherTotal').html(usernum.teacherTotal+'<span>人</span>');
                $('.studentTotal').html(usernum.studentTotal+'<span>人</span>');
                $('.index_forms').find('li').eq(0).siblings().remove();
                for(var i = 0;i<usernum.data.length;i++){
                    $('.index_forms').append(' <li> <span>'+usernum.data[i].schoolName+'</span> <span>'+usernum.data[i].branchTotalUser+'</span> <span>'+usernum.data[i].studentCount+'</span> <span>'+usernum.data[i].teacherCount+'</span> <span><a href="javascript:;" class="export_s" schoolId="'+usernum.data[i].schoolId+'"schoolName="'+usernum.data[i].schoolName+'" index = '+i+' tea_num = "'+usernum.data[i].branchTotalUser+'">导出教师列表</a></span> </li>')
                }
                $('.index_forms li:nth-child(even)').css('background', '#f5fbfa');
                $('.index_forms li:first-of-type').css({
                    'background': '#fff',
                    'color': '#bababa'
                });
                $('.loading_pre').hide();
            }
        }
    });

    //导出列表
    $(document).on('click','.export_s',function(){
        layer.msg('导出列表较慢，请您耐心等待');
        if($(this).attr('tea_num')==0){
            layer.msg('暂无列表');
            return false;
        }
                                                                                                                                                                                                                                                                                                                   window.location.href = global.indexForm + "?schoolId=" + $(this).attr('schoolId')+'&schoolName='+$(this).attr('schoolName');
    });
        //导出总表点击
        $(document).on('click','.index_formtit a',function(){
            layer.msg('导出列表较慢，请您耐心等待');
            window.location.href = global.indexFormAll + "?schoolId=" + localStorage.schoolList
        })




    })
});








