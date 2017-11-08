/* 概况 */

require(['jquery-1.11.0.min'], function () {
    require(['layer'],function() {
     layer.load();
    /*css 兼容*/
    $('.index_forms li:nth-child(odd)').css('background', '#f5fbfa')
    $('.index_forms li:first-of-type').css({
        'background': '#fff',
        'color': '#bababa'
    });
    layer.closeAll('loading');
    $.ajax({
        url:global.indexAll,
        type: 'post',
        asyns:false,
        dataType: 'json',
        data:JSON.stringify({'userId':'123'}),
        success:function(e){
            var usernum = e.Data;
            var formurl = [];
            $('.totalUser').html(usernum.totalUser+'<span>人</span>');
            $('.teacherTotal').html(usernum.teacherTotal+'<span>人</span>');
            $('.studentTotal').html(usernum.studentTotal+'<span>人</span>');
            for(var i = 0;i<usernum.data.length;i++){
                $('.index_forms').append(' <li> <span>'+usernum.data[i].schoolName+'</span> <span>'+usernum.data[i].branchTotalUser+'</span> <span>'+usernum.data[i].studentCount+'</span> <span>'+usernum.data[i].teacherCount+'</span> <span><a href="javascript:;" class="export_s" schoolId="'+usernum.data[i].schoolId+'"schoolName="'+usernum.data[i].schoolName+'" index = '+i+' >导出教师列表</a></span> </li>')
            }
        }
    });

    //导出列表
    $(document).on('click','.export_s',function(){
        var newTab=window.open();
        $.ajax({
            url:global.indexForm,
            type: 'post',
            asyns:false,
            dataType: 'json',
            data:JSON.stringify({'schoolId':$(this).attr('schoolId'),'schoolName':$(this).attr('schoolName')}),
            success:function(e){
                if(e.result){
                    newTab.location.href=e.downloadUrl;
                }else{
                    layer.msg('暂无列表');
                }
            }
        });
    });
     //导出总表
        $.ajax({
            url:global.indexFormAll,
            type: 'post',
            asyns:false,
            dataType: 'json',
            data:JSON.stringify({'schoolId':$(this).attr('schoolId'),'schoolName':$(this).attr('schoolName')}),
            success:function(e){
                if(e.result){
                    $('.index_formtit a').attr('href',e.downloadUrl)
                }else{
                    $('.index_formtit a').attr('href','javascript:;')
                }
            }
        });
        //导出总表点击
        $(document).on('click','.index_formtit a',function(){
            if($(this).attr('href')==''){
                layer.msg('正在请求总表链接')
            }else if($(this).attr('href')=='javascript:;'){
                layer.msg('暂无总表链接')
            }
        })




    })
});








