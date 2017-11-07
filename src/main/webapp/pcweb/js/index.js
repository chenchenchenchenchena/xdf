/* 概况 */

require(['jquery-1.11.0.min',], function () {
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
            console.log(e)
        },

    })






    })
})








