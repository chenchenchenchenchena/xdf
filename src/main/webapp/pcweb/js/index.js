/* 概况 */

require(['jquery-1.11.0.min','requireConfig'], function () {
    require(['layer'], function () {
        $('.loading_pre').show();
        var index_data;

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
        else if (url_l.indexOf('learn') != -1) {
            number_l = 5
        }
        var $bure_true = $('.left_nav ul li').eq(number_l);
        $bure_true.addClass('activ_nav').siblings().removeClass('activ_nav');

     layer.load();
    /*css 兼容*/

    $('.sort_index').click(function(){
        console.log(index_data);
        var type_ = $(this).attr('type');
        $(this).parent().siblings().find('img').attr('src','images/sort_h.png');
        if($(this).attr('src').indexOf('sort_h')!=-1){
            var index_peo = index_data.sort(px_home(type_));
            $(this).attr('src','images/sort_t.png')
        }else{
            var index_peo = index_data.sort(px_home(type_)).reverse();
            $(this).attr('src','images/sort_h.png')
        }
        $('.index_first ').siblings().remove();
        for(var i = 0;i<index_peo.length;i++){
            $('.index_forms').append(' <li> <span>'+index_peo[i].schoolName+'</span> <span>'+index_peo[i].branchTotalUser+'</span> <span>'+index_peo[i].studentCount+'</span> <span>'+index_peo[i].teacherCount+'</span> <span><a href="javascript:;" class="export_s" schoolId="'+index_peo[i].schoolId+'"schoolName="'+index_peo[i].schoolName+'" index = '+i+' tea_num = "'+index_peo[i].branchTotalUser+'">导出教师列表</a></span> </li>')
        }
    });
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
                index_data = usernum.data;
                var index_peo = usernum.data.sort(px_home('branchTotalUser')).reverse();
                for(var i = 0;i<index_peo.length;i++){
                    $('.index_forms').append(' <li> <span>'+index_peo[i].schoolName+'</span> <span>'+index_peo[i].branchTotalUser+'</span> <span>'+index_peo[i].studentCount+'</span> <span>'+index_peo[i].teacherCount+'</span> <span><a href="javascript:;" class="export_s" schoolId="'+index_peo[i].schoolId+'"schoolName="'+index_peo[i].schoolName+'" index = '+i+' tea_num = "'+index_peo[i].branchTotalUser+'">导出教师列表</a></span> </li>')
                }
                $('.index_forms li:nth-child(even)').css('background', '#f5fbfa');
                $('.index_forms li:first-of-type').css({
                    'background': '#ccf1ea',
                    'color': '#bababa'
                });
                $('.loading_pre').hide();
            }
        }
    });

        //导出列表
        $(document).on('click', '.export_s', function () {
            layer.msg('导出列表较慢，请您耐心等待');
            if ($(this).attr('tea_num') == 0) {
                layer.msg('暂无列表');
                return false;
            }
            window.location.href = global.indexForm + "?schoolId=" + $(this).attr('schoolId') + '&schoolName=' + $(this).attr('schoolName');
        });
        //导出总表点击
        $(document).on('click', '.index_formtit a', function () {
            layer.msg('导出列表较慢，请您耐心等待');
            window.location.href = global.indexFormAll + "?schoolId=" + localStorage.schoolList
        })


    })
});








