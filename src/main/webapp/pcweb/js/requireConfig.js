/* 配置文件*/

/*Life without love crt 2017-11-1 G*/


var onlineUrl = 'dt.xdf.cn';
if(window.location.host == onlineUrl){   //正式环境
    var url_o = 'http://dt.xdf.cn/xdfdtmanager/';
}else{    //测试环境
    var url_o = 'http://dt.staff.xdf.cn/xdfdtmanager/';
}

var global = {
    'indexAll':url_o+'backEndHome/queryCountUser.do',   //概况列表
    'indexForm':url_o+'backEndHome/exportBranchUserListExcel.do',  //导出概况列表
    'indexFormAll':url_o+'backEndHome/exportCountUserAnalyseListExcel.do', //导出概况总表
    'left_nav':url_o+'/function/getAllFunction.do',  //左侧导航

};
require(['jquery-1.11.0.min'],function(){
/*数据交互请求地址*/

    
    /*用户下拉*/
    var timeout; 
    $('.user_name').hover(function(){
        $('.usermenu').stop().fadeIn();
        $('.user_name').css('background-image','url(../images/img_3.png)')
    },function(){
        timeout = setTimeout(function(){
            $('.usermenu').stop().fadeOut();
             $('.user_name').css('background-image','url(../images/img_1.png)')
        },500)
    })
    $('.usermenu').hover(function(){
        clearTimeout(timeout)
    },function(){
        $('.usermenu').stop().fadeOut();
        $('.user_name').css('background-image','url(../images/img_1.png)')
    });
    /* 导航侧边栏 */
    $(document).on('click','.left_nav li',function(){
        $(this).addClass('activ_nav').siblings().removeClass('activ_nav');
    });
    /**
     * 退出登录
     */
    $('#logout').click(toLogout);
    function toLogout() {
        var url = "";
        var returnUrl = window.location.host;
        var currentUser = sessionStorage.getItem("userId");
        if(currentUser == "ssdf"){
            //表示当前用户为超级管理员
            returnUrl = returnUrl + "/pcweb/login_web.html";
            url = url_o + "logout/doAdminLogout.do"
        }else {
            url = url_o + "logout/doLogout.do";
        }

        var businessP = {"returnUrl": returnUrl, "sid": sessionStorage.getItem("sid")};
        jQuery.ajax({
            type: "POST",
            url: url,
            async: false,//同步
            dataType: 'json',
            data: JSON.stringify(businessP),
            success: function (json) {
                if (json.result == true) {
                    //clearCookie();
                    sessionStorage.removeItem("sid")
                    sessionStorage.removeItem("userId")
                    sessionStorage.removeItem("userName")
                    window.top.location.href = returnUrl;
                }
            }
        });
    }
    //左侧菜单栏
    $.ajax({
        url:global.left_nav,
        type: 'post',
        asyns:false,
        dataType: 'json',
        data:JSON.stringify({'userId':'v_kouchen'}),
        success:function(e){
            console.log(e);
            if(e.result){
                var onelist = e.dataList;
                for(var i = 0;i<onelist.length;i++){
                    var onelistbure = onelist[i];
                    if(onelistbure.isValid ==1){
                        $('.left_nav').prepend('<h2>'+onelistbure.text+'</h2>');
                        for(var k = 0;k<onelistbure.children.length;k++){
                            var twolist = onelistbure.children[k];
                            if(twolist.isValid ==1){
                                $('.left_nav ul').append('<li><a href="'+twolist.url+'">'+twolist.text+'</a></li>')
                            }
                        }
                        var $bure_true = $('.left_nav ul li').eq(0);
                        $bure_true.addClass('activ_nav')
                        location.href+=$bure_true.attr('href')
                    }
                }
            }else{
            }
        }
    });

});
