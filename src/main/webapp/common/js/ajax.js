//判断正式环境
var onlineUrl = 'dt.xdf.cn';
var url_online = 'http://dt.xdf.cn/xdfdtmanager/';
var url_test = 'http://dt.staff.xdf.cn/xdfdtmanager/';
var aaa="http://10.73.33.63:8080/xdfdtmanager/";
if (window.location.host == onlineUrl) {//正式环境
    // 接口路径
    var url = {
        'e_elog': url_online+'e2Login/login.do',//e2登录
        'w_xmor': url_online+'wechatSignature/getWeChatSignature.do', //获取微信授权信息
        'w_open': url_online+'wechatSignature/getUserInfo.do',//获取openid
        'w_teac': url_online+'e2Login/doLogin.do',//查询老师邮箱
        'w_stum': url_online+'studentDataController/getClassDatas.do',// 获取班级信息
        'w_stor': url_online+'studentDataController/syncStudentsData.do',//获取学生信息
        't_more': url_online+'e2Login/doLogin.do',   //老师登录页  查询老师信息
        't_wxmo': url_online+'teacherBind/queryTeacherInfo.do',   //学生登录页  通过微信查询是否登录过
        't_siot': url_online+'teacherBind/unbindTeacherInfo.do',   //解绑
        's_seac': url_online+'studentBind/queryStudentInfo.do',  //学员号查询
        's_bind': url_online+'studentBind/bindWechatandStudent.do',   //学员号绑定微信
        's_nobd': url_online+'studentBind/unbindStudentInfo.do',  //学员号解绑微信
        's_nafu': url_online+'studentBind/queryStuInfoByNameMobile.do',   //姓名手机号查询
        's_emai': url_online+'teacherData/queryTeacherData.do',   //邮箱按月获取课程
        's_stud': url_online+'studentData/queryStudentData.do',    //学生查询课程
        's_hwlt': url_online+'studentData/assingmentHomework.do',//待交作业学生列表查询
        'data_s': url_online+'teacherData/queryAllSpeakerTeachers.do', //主讲查询
        't_logi': url_online+'logout/doLogout.do',//退出登录
        't_back': 'http://dt.xdf.cn/xdfdthome/schedule/login_s.html', //回调地址
        't_data': url_online+'teacherData/queryCourseRemind.do',  //老师课表提醒
        's_data': url_online+'studentData/queryCourseRemindStudent.do',  //学生课表提醒
        't_rankl':url_online+'teacherAnalysis/studentFloatGrade.do',  //老师入门测，出门测排行列表
         't_record': url_online+'teacherData/queryTeacherLesson.do',//成绩录入
		't_save':url_online+'teacherData/addTeacherAnalysis.do',//成绩保存
		't_modify':url_online+'teacherAnalysis/teacherqueryLitimesdtGrade.do'//修改成绩
    };
    var Global = {
        "appid": 'wxab29a3e2000b8d2a',
        "secret": '7739991fcce774c2281147eae3986ad9',
        "actionURL": url.w_open
    }
    var Study = {
        's_study':url_online+'/studentAnalysis/scoreStdIdlReportStatus.do', //学生获取个人成绩
        't_studt':url_online+'/teacherAnalysis/scoreStdReport.do'   //老师查看学生成绩
    }
} else {//测试环境

    var url = {
        'e_elog': url_test+'e2Login/login.do',//e2登录
        'w_xmor': url_test+'wechatSignature/getWeChatSignature.do', //获取微信授权信息
        'w_open': url_test+'wechatSignature/getUserInfo.do',//获取openid
        'w_token':url_test+'wechatSignature/getWechatToken.do',//获取微信token
        'w_teac': url_test+'e2Login/doLogin.do',//查询老师邮箱
        'w_stum': url_test+'studentDataController/getClassDatas.do',// 获取班级信息
        'w_stor': url_test+'studentDataController/syncStudentsData.do',//获取学生信息
        't_more': url_test+'e2Login/doLogin.do',   //老师登录页  查询老师信息
        't_wxmo': url_test+'teacherBind/queryTeacherInfo.do',   //学生登录页  通过微信查询是否登录过
        't_siot': url_test+'teacherBind/unbindTeacherInfo.do',   //解绑
        's_seac': url_test+'studentBind/queryStudentInfo.do',  //学员号查询
        's_bind': url_test+'studentBind/bindWechatandStudent.do',   //学员号绑定微信
        's_nobd': url_test+'studentBind/unbindStudentInfo.do',  //学员号解绑微信
        's_nafu': url_test+'studentBind/queryStuInfoByNameMobile.do',   //姓名手机号查询
        's_emai': url_test+'teacherData/queryTeacherData.do',   //邮箱按月获取课程
        's_stud': url_test+'studentData/queryStudentData.do',    //学生查询课程
        's_hwlt': url_test+'studentData/assingmentHomework.do',//代交作业学生列表查询
        's_hwfl': url_test+'studentData/finishHomework.do',//已交作业学生列表查询
        'data_s': url_test+'teacherData/queryAllSpeakerTeachers.do', //主讲查询
        't_logi': url_test+'logout/doLogout.do' ,//退出登录
        't_back': url_test+'/schedule/login_s.html', //回调地址
        't_data': url_test+'teacherData/queryCourseRemind.do',   //老师课表提醒
        's_data': url_test+'studentData/queryCourseRemindStudent.do',  //学生课表提醒
        't_rankl':url_test+'teacherAnalysis/studentFloatGrade.do',  //老师入门测，出门测排行列表
        't_record': url_test+'teacherData/queryTeacherLesson.do',//成绩录入
		't_save':url_test+'teacherData/addTeacherAnalysis.do',//成绩保存
		't_modify':url_test+'teacherAnalysis/teacherqueryLitimesdtGrade.do'//修改成绩

    };
    var Global = {
        "appid": 'wx559791e14e9ce521',
        "secret": 'baa4373d5a8750c69b9d1655a2e31370',
        "actionURL": url.w_open
    }
    var Study = {
        's_study':url_test+'/studentAnalysis/scoreStdIdlReportStatus.do',  //学生获取个人成绩
        't_studt':url_test+'/teacherAnalysis/scoreStdReport.do',   //老师查看学生成绩
        't_self':url_test+'teacherAnalysis/queryScoreReportByTeacherEmail.do'   //老师查看班级成绩
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
//获取微信token





ajax_S(url.w_token,Global,function(e){
    sessionStorage.access_token  = e.token
})
// function getwechatInfo(code){
//     var businessP = {
//         "appid": Global.appid,
//         "secret": Global.secret,
//         "code": code
//     }
//     alert('businessP:' + JSON.stringifY(businessP));
//     // var d = constructionParams(rsaEncryptedString(businessP), "249161eae3a94042ba1f0331b510534d");
//     jQuery.ajax({
//         type: "POST",
//         url: Global.actionURL,
//         async: false,//同步
//         dataType: 'json',
//         data: JSON.stringify(businessP),
//         success: function (json) {
//             alert('json:'+JSON.stringifY(json));
//             if (json.result == true) {
//                 sessionStorage.openid = json.userInfo.openid;
//                 sessionStorage.nickname = json.userInfo.nickname;
//                 sessionStorage.headimgurl = json.userInfo.headimgurl;
//             } else {
//                 layer.msg('获取用户信息失败')
//             }
//         },
//         error: function (json) {
//             layer.msg('获取用户信息失败')
//         }
//     })
// }
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

/** @brief  封装ajax请求 create by zsj
 *  @param  targetUrl     请求接口
 *  @param  requestData        请求接口传参
 *  @param  successCallback     回调方法
 *  @param  failureCallback     失败方法
 */
function ajaxRequest(typeIn, targetUrl, requestData, successCallback) {
    $.ajax({
        type: typeIn,
        url: targetUrl,
        data: requestData,
        success: function (msg) {
            successCallback(msg);
        },
        error: function (err) {
            // failureCallback(msg);
            console.log("err:"+err);
        }
    });
};



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
/*获取参数*/
function GetRequest(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
};


// 本月多少天

function getCountDays() {
    var curDate = new Date();
    /* 获取当前月份 */
    var curMonth = curDate.getMonth();
    /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
    curDate.setMonth(curMonth + 1);
    /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
    curDate.setDate(0);
    /* 返回当月的天数 */
    return curDate.getDate();
}