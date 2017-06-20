//判断正式环境
var onlineUrl = 'dt.xdf.cn';
if (window.location.host == onlineUrl) {//正式环境
    // 接口路径
    var url_ = {
        'e_elog': 'http://dt.xdf.cn/xdfdtmanager/e2Login/login.do',//e2登录
        'w_xmor': 'http://dt.xdf.cn/xdfdtmanager/wechatSignature/getWeChatSignature.do', //获取微信授权信息
        'w_open': 'http://dt.xdf.cn/xdfdtmanager/wechatSignature/getUserInfo.do',//获取openid
        'w_teac': 'http://dt.xdf.cn/xdfdtmanager/e2Login/doLogin.do',//查询老师邮箱
        'w_stum': 'http://dt.xdf.cn/xdfdtmanager/studentDataController/getClassDatas.do',// 获取班级信息
        'w_stor': 'http://dt.xdf.cn/xdfdtmanager/studentDataController/syncStudentsData.do',//获取学生信息
        't_more': 'http://dt.xdf.cn/xdfdtmanager/e2Login/doLogin.do',   //老师登录页  查询老师信息
        't_wxmo': 'http://dt.xdf.cn/xdfdtmanager/teacherBind/queryTeacherInfo.do',   //学生登录页  通过微信查询是否登录过
        't_siot': 'http://dt.xdf.cn/xdfdtmanager/teacherBind/unbindTeacherInfo.do',   //解绑
        's_seac': 'http://dt.xdf.cn/xdfdtmanager/studentBind/queryStudentInfo.do',  //学员号查询
        's_bind': 'http://dt.xdf.cn/xdfdtmanager/studentBind/bindWechatandStudent.do',   //学员号绑定微信
        's_nobd': 'http://dt.xdf.cn/xdfdtmanager/studentBind/unbindStudentInfo.do',  //学员号解绑微信
        's_nafu': 'http://dt.xdf.cn/xdfdtmanager/studentBind/queryStuInfoByNameMobile.do',   //姓名手机号查询
        's_emai': 'http://dt.xdf.cn/xdfdtmanager/teacherData/queryTeacherData.do',   //邮箱按月获取课程
        's_stud': 'http://dt.xdf.cn/xdfdtmanager/studentData/queryStudentData.do',    //学生查询课程
        'data_s': 'http://dt.xdf.cn/xdfdtmanager/teacherData/queryAllSpeakerTeachers.do', //主讲查询
        't_logi': 'http://dt.xdf.cn/xdfdtmanager/logout/doLogout.do',//退出登录
        't_back': 'http://dt.xdf.cn/xdfdthome/schedule/login_s.html' //回调地址
    }
    var Global = {
        "appid": 'wxab29a3e2000b8d2a',
        "secret": '60eb7eec2b7af5d74a704d3903e853dd',
        "actionURL": url.w_open
    }
} else {//测试环境

    var url = {
        'e_elog': 'http://dt.staff.xdf.cn/xdfdtmanager/e2Login/login.do',//e2登录
        'w_xmor': 'http://dt.staff.xdf.cn/xdfdtmanager/wechatSignature/getWeChatSignature.do', //获取微信授权信息
        'w_open': 'http://dt.staff.xdf.cn/xdfdtmanager/wechatSignature/getUserInfo.do',//获取openid
        'w_teac': 'http://dt.staff.xdf.cn/xdfdtmanager/e2Login/doLogin.do',//查询老师邮箱
        'w_stum': 'http://dt.staff.xdf.cn/xdfdtmanager/studentDataController/getClassDatas.do',// 获取班级信息
        'w_stor': 'http://dt.staff.xdf.cn/xdfdtmanager/studentDataController/syncStudentsData.do',//获取学生信息
        't_more': 'http://dt.staff.xdf.cn/xdfdtmanager/e2Login/doLogin.do',   //老师登录页  查询老师信息
        't_wxmo': 'http://dt.staff.xdf.cn/xdfdtmanager/teacherBind/queryTeacherInfo.do',   //学生登录页  通过微信查询是否登录过
        't_siot': 'http://dt.staff.xdf.cn/xdfdtmanager/teacherBind/unbindTeacherInfo.do',   //解绑
        's_seac': 'http://dt.staff.xdf.cn/xdfdtmanager/studentBind/queryStudentInfo.do',  //学员号查询
        's_bind': 'http://dt.staff.xdf.cn/xdfdtmanager/studentBind/bindWechatandStudent.do',   //学员号绑定微信
        's_nobd': 'http://dt.staff.xdf.cn/xdfdtmanager/studentBind/unbindStudentInfo.do',  //学员号解绑微信
        's_nafu': 'http://dt.staff.xdf.cn/xdfdtmanager/studentBind/queryStuInfoByNameMobile.do',   //姓名手机号查询
        's_emai': 'http://dt.staff.xdf.cn/xdfdtmanager/teacherData/queryTeacherData.do',   //邮箱按月获取课程
        's_stud': 'http://dt.staff.xdf.cn/xdfdtmanager/studentData/queryStudentData.do',    //学生查询课程
        'data_s': 'http://dt.staff.xdf.cn/xdfdtmanager/teacherData/queryAllSpeakerTeachers.do', //主讲查询
        't_logi': 'http://dt.staff.xdf.cn/xdfdtmanager/logout/doLogout.do' ,//退出登录
        't_back': 'http://dt.staff.xdf.cn/xdfdthome/schedule/login_s.html' //回调地址
    };
    var Global = {
        "appid": 'wx559791e14e9ce521',
        "secret": 'baa4373d5a8750c69b9d1655a2e31370',
        "actionURL": url.w_open
    }

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
                success: function (json) {
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

function getwechatInfo(code){
    var businessP = {
        "appid": Global.appid,
        "secret": Global.secret,
        "code": code
    }
    alert('businessP:' + JSON.stringifY(businessP));
    // var d = constructionParams(rsaEncryptedString(businessP), "249161eae3a94042ba1f0331b510534d");
    jQuery.ajax({
        type: "POST",
        url: Global.actionURL,
        async: false,//同步
        dataType: 'json',
        data: JSON.stringify(businessP),
        success: function (json) {
            alert('json:'+JSON.stringifY(json));
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
var Wxid = sessionStorage.openid
var calbac = {
    'code':location.search.substring(location.search.indexOf('code')+5,location.search.indexOf('&')),
    'state':location.search.substring(location.search.indexOf('state')+6,location.search.length),
    'e2State':sessionStorage.e2state,
}
//e2登陆回传的值


// ajax封装
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



//时间格式化
Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
}

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


