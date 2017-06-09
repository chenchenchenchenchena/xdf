// 获取路径的参数
function getRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}







// 获取微信id

var Global = {
    "appid": 'wx559791e14e9ce521',
    "secret": 'baa4373d5a8750c69b9d1655a2e31370',
    "actionURL":'http://dt.staff.xdf.cn/xdfdtmanager/wechatSignature/getUserInfo.do'
}
function wechatCode(url) {
    var code = getRequest()['code'];
    var url = url;
    if (code) {//如果有code 已经授权过 进行下一步 获取openId 姓名 头像（获取access_token+info微信安全考虑都在后端进行）
        if (sessionStorage.openid) {//之前获取过 不再获取 结束操作

        } else {
            var businessP = {
                "appid": Global.appid,
                "secret": Global.secret,
                "code": code
            }
            // var d = constructionParams(rsaEncryptedString(businessP), "249161eae3a94042ba1f0331b510534d");
            jQuery.ajax({
                type: "POST",
                url: Global.actionURL,
                async: false,//同步
                dataType: 'json',
                data: JSON.stringify(businessP),
                success: function (json){
                    if (json.result == true) {
                        sessionStorage.openid = json.userInfo.openid;
                        sessionStorage.nickname = json.userInfo.nickname;
                        sessionStorage.headimgurl = json.userInfo.headimgurl;
                    } else {
                        layer.msg('获取用户信息失败')
                    }
                },
                error: function (json) {
                    layer.msg('获取用户信息失败')
                }
            })
        }
    } else {
        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + Global.appid + '&redirect_uri=' + url + '&response_type=code&scope=snsapi_userinfo&state=' + getRequest()['userId'] + '#wechat_redirect';
        return false
    }
}
// wechatCode(location.href)
















var url = {
    't_more':'http://dt.staff.xdf.cn/xdfdtmanager/e2Login/doLogin.do',   //老师登录页  查询老师信息
    't_wxmo':'http://dt.staff.xdf.cn/xdfdtmanager/teacherBind/queryTeacherInfo.do',   //学生登录页  通过微信查询是否登录过
    't_siot':'http://dt.staff.xdf.cn/xdfdtmanager/teacherBind/unbindTeacherInfo.do',   //解绑
    's_seac':'http://dt.staff.xdf.cn/xdfdtmanager/studentBind/queryStudentInfo.do',  //学员号查询
    's_bind':'http://dt.staff.xdf.cn/xdfdtmanager/studentBind/bindWechatandStudent.do',   //学员号绑定微信
    's_nobd':'http://dt.staff.xdf.cn/xdfdtmanager/studentBind/unbindStudentInfo.do',  //学员号解绑微信
    's_nafu':'http://dt.staff.xdf.cn/xdfdtmanager/studentBind/queryStuInfoByNameMobile.do'   //姓名手机号查询
}

// var Wxid = sessionStorage.openid

var Wxid = 'wx5555555'

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