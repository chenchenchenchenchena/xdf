//获取环境路径
function getRootPath() {
    //获取当前网址，如： http://localhost:8088/test/test.jsp
    var curPath = window.document.location.href;
    //获取主机地址之后的目录，如： test/test.jsp
    var pathName = window.document.location.pathname;
    var pos = curPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8088
    var localhostPaht = curPath.substring(0, pos);
    //获取带"/"的项目名，如：/test
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
}
//获取工程名
function getProjectName() {
    //获取当前网址，如： http://localhost:8088/test/test.jsp
    var curPath = window.document.location.href;
    //获取主机地址之后的目录，如： test/test.jsp
    var pathName = window.document.location.pathname;
    var pos = curPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8088
    var localhostPaht = curPath.substring(0, pos);
    //获取带"/"的项目名，如：/test
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return projectName;
}

function iFrameHeight(id) {
    var ifm = document.getElementById(id);
    var subWeb = document.frames ? document.frames[id].document : ifm.contentDocument;
    if (ifm != null && subWeb != null) {
        ifm.height = subWeb.body.scrollHeight;
    }
}
function getCurrentDate(_this, fmt) {
    var o = {
        "M+": _this.getMonth() + 1,                 //月份
        "d+": _this.getDate(),                    //日
        "h+": _this.getHours(),                   //小时
        "m+": _this.getMinutes(),                 //分
        "s+": _this.getSeconds(),                 //秒
        "q+": Math.floor((_this.getMonth() + 3) / 3), //季度
        "S": _this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (_this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function closeLayer() {
    layer.closeAll();
}
function setCookie(name, value, days) {
    var exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()+"; path=/";
}

//读取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}

//删除cookies
function delCookie(name) {
    //var exp = new Date();
    //exp.setTime(-1000);
    //var cval = getCookie(name);
    //if (cval != null)
    //    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    setCookie(name, 1, -1);
}

function clearCookie(){
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            setCookie(keys[i], 1, -1);
    }
}
function changeMenu(_this) {
    //var userId = getCookie("loginId");
    //if (userId != "zsxdf" && url.indexOf('./user/userList.html') != -1 ) {
    //    layer.msg('您无权操作!', {icon: 5});
    //    return;
    //}
    var url = $(_this)[0].dataset.url;
    //window.top.location.href=getRootPath()+'/html'+url.substr(1);
    window.top.location.href=url;
    //initFrameContent();
    //$(".p176-expand-ul").find("a").removeClass("on");
    //$(_this).addClass("on");
    //$("#centerIframeId").attr("src", url);
}

function changeCenter(url) {
    //window.top.location.href=getRootPath()+'/html'+url.substr(1);
    window.top.location.href=url;
    //$("#centerIframeId", parent.document).attr("src", url);
    //$("#centerIframeId", parent.document).height = "1000px";
}

function openPage(url){
    window.open(getRootPath()+'/html'+url.substr(1))
}

function timeValidate(timeStr){
    var reg = /\d{2}:\d{2}/;
    if(timeStr.match(reg)){
        return true;
    }
    return false;
}