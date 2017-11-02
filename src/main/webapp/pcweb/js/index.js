/* 概况 */

require(['jquery-1.11.0.min'],function(){
var url_o = 'http://dt.xdf.cn/xdfdtmanager/';

/*css 兼容*/
$('.index_forms li:nth-child(odd)').css('background','#f5fbfa')
$('.index_forms li:first-of-type').css({
    'background':'#fff',
    'color':'#bababa'
})
})



var functionList = localStorage.functionCheckedList;//获取左侧兰功能列表
function loadMenu() {
    if (functionList != undefined && functionList.length > 0) {

        for (var i = 0; i < functionList.length; i++) {
            $('#'+functionList[i].id).html(functionList[i].text);
        }
    }
}



function toLogout() {
    var url = "";
    var returnUrl = getRootPath();
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
                clearCookie();
                window.top.location.href = returnUrl;
            }
        }
    });
}