

var url = {
    't_more':'http://dt.staff.xdf.cn/xdfdtmanager/e2Login/doLogin.do',   //老师登录页  查询老师信息
    't_wxmo':'http://dt.staff.xdf.cn/xdfdtmanager/teacherBind/queryTeacherInfo.do'   //学生登录页  通过微信查询是否登录过
}

var Wxid = 'wechatid123456'



var calbac = {
    'code':location.search.substring(location.search.indexOf('code')+5,location.search.indexOf('&')),
    'state':location.search.substring(location.search.indexOf('state')+6,location.search.length),
    'e2State':sessionStorage.e2state,
}  //e2登陆回传的值
function ajax_S(link,more,func){
    $.ajax({
                url:link,
                type: 'post',
                asyns:false,
                dataType: 'json',
                data:JSON.stringify(more),
                success:function(e){
                    func(e)
                }
        });
}