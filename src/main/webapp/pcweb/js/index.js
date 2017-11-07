/* 概况 */

require(['jquery-1.11.0.min'], function () {
    require(['layer','requireConfig'],function() {
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
            console.log(e);
            var usernum = e.Data;
            var formurl = [];
            $('.totalUser').html(usernum.totalUser+'<span>人</span>');
            $('.teacherTotal').html(usernum.teacherTotal+'<span>人</span>');
            $('.studentTotal').html(usernum.studentTotal+'<span>人</span>');
            for(var i = 0;i<usernum.data.length;i++){
                $.ajax({
                    url:global.indexForm,
                    type: 'post',
                    asyns:false,
                    dataType: 'json',
                    data:JSON.stringify({'schoolId':usernum.data[i].schoolId,'schoolName':usernum.data[i].schoolName}),
                    success:function(e){
                        formurl.push(e.downloadUrl)
                    }
                });
                console.log(formurl)
                $('.index_forms').append(' <li> <span>'+usernum.data[i].schoolName+'</span> <span>'+usernum.data[i].branchTotalUser+'</span> <span>'+usernum.data[i].studentCount+'</span> <span>'+usernum.data[i].teacherCount+'</span> <span><a href="'+formurl[i]+'">导出教师列表</a></span> </li>')
            }

        }

    })


    })
})








