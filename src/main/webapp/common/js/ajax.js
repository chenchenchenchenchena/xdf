//判断正式环境
var onlineUrl = 'dt.xdf.cn';
var url_o = 'http://dt.xdf.cn/xdfdtmanager/';
var url_o2 = 'http://dt.xdf.cn';
var appId = '';
var secreT = '';

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-20005525-5', 'auto');
ga('send', 'pageview');



var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?55f7f2243b727e03faa4a3be905928f3";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

if (window.location.host == onlineUrl) {//正式环境
    url_o = 'http://dt.xdf.cn/xdfdtmanager/';
    url_o2 = 'http://dt.xdf.cn';
    appId =  'wxab29a3e2000b8d2a';
    secreT = '7739991fcce774c2281147eae3986ad9';
} else {//测试环境
    url_o = "http://dt.staff.xdf.cn/xdfdtmanager/";
    url_o2 = 'http://dt.staff.xdf.cn';
    appId =  'wx559791e14e9ce521';
    secreT = 'baa4373d5a8750c69b9d1655a2e31370';
}
    if(getRequest('state').state=='JT'||sessionStorage.signal){
        //新的appid
        sessionStorage.signal = 0;
        // appId =  'wx559791e14e9ce521';
        // secreT = 'baa4373d5a8750c69b9d1655a2e31370';
        appId =  'wx67e16b7247bde1a8';      //双师东方
        secreT = '85e12b7eb0627c8c0fd5ef45e084667c';
    }else{
        sessionStorage.removeItem('signal');
    }
var TemplateId_home = '' ;
var TemplateId_grade = '';
if(getRequest('state').state=='JT'||sessionStorage.signal){
    TemplateId_home = '8Sjj8hUex_Gk-FtTJ7Ag91aWEDLTBYtGffYa69lIUqw';   //双师东方   作业通知
    TemplateId_grade = 'b8_SUx7vwt-CV1pxXJRljODJL15Z_A9G0dAnIU-Xl7g'; //双师东方   考试成绩
}else{
    TemplateId_home = 'X9u2z5OF33JCPXDuTGnw06fUt0n-7CSjCe5otNgXO6M';   //邯郸  作业通知
    TemplateId_grade = 'Sf2zd-_p0lb15hNE9H-DN4a-14rjGKX_u1Nvf1iMqLQ'; //邯郸   考试成绩
}
// 接口路径
var url = {
    'e_elog': url_o+'e2Login/login.do',//e2登录
    'e_elast':url_o+'u2Login/login.do', //u2Dengl
    'w_xmor': url_o+'wechatSignature/getWeChatSignature.do', //获取微信授权信息
    'w_open': url_o+'wechatSignature/getUserInfo.do',//获取openid
    'w_teac': url_o+'e2Login/doLogin.do',//查询老师邮箱
    'w_stum': url_o+'studentDataController/getClassDatas.do',// 获取班级信息
    'w_stor': url_o+'studentDataController/syncStudentsData.do',//获取学生信息
    't_more': url_o+'e2Login/doLogin.do',   //老师登录页  查询老师信息
    't_stulas':url_o+'u2Login/doLogin.do',// 查询u2
    't_wxmo': url_o+'teacherBind/queryTeacherInfo.do',   //学生登录页  通过微信查询是否登录过
    't_siot': url_o+'teacherBind/unbindTeacherInfo.do',   //解绑
    's_seac': url_o+'studentBind/queryStudentInfo.do',  //学员号查询
    's_bind': url_o+'studentBind/bindWechatandStudent.do',   //学员号绑定微信
    's_nobd': url_o+'studentBind/unbindStudentInfo.do',  //学员号解绑微信
    's_nafu': url_o+'studentBind/queryStuInfoByNameMobile.do',   //姓名手机号查询
    's_emai': url_o+'teacherData/queryTeacherData.do',   //邮箱按月获取课程
    's_stud': url_o+'studentData/queryStudentData.do',    //学生查询课程
    'data_s': url_o+'teacherData/queryAllSpeakerTeachers.do', //主讲查询
    't_logi': url_o+'logout/doLogout.do',//退出登录
    'u_loout':url_o+'u2Login/doLogout.do', //u2退出登录
    't_back':url_o2+'/xdfdthome/schedule/login_s.html', //回调地址
    't_bckt':url_o2+'/xdfdthome/schedule/login_stu.html', //回调地址
    't_data': url_o+'teacherData/queryCourseRemind.do',  //老师课表提醒
    's_data': url_o+'studentData/queryCourseRemindStudent.do',  //学生课表提醒
    't_rankl':url_o+'teacherAnalysis/studentFloatGrade.do',  //老师入门测，出门测排行列表
    't_record': url_o+'teacherData/queryTeacherLesson.do',//成绩录入
    't_save':url_o+'teacherData/addTeacherAnalysis.do',//成绩保存
    't_modify':url_o+'teacherAnalysis/teacherqueryLitimesdtGrade.do',//修改成绩
    't_addstu':url_o+'teacherData/addItionalStudent.do',//录成绩添加学生
    's_webseac': url_o+'studentBind/webQueryStudentInfo.do',  //web学员号查询
    's_webnafu': url_o+'studentBind/webQueryStuInfoByNameMobile.do', //web姓名手机号查询
    't_webback':url_o2+'/xdfdthome/dtweb/schedule/login_s.html', //回调地址
    't_webmore':url_o+'teacherBind/pcqueryTeacherInfo.do', //查询教师信息
    'w_token':url_o+'/wechatSignature/getWechatToken.do',
    'w_openId':url_o+'teacherAnalysis/queryStudentWechat.do',
    'w_push':url_o+'wechatSignature/sendTemplateMsg.do',//微信推送成绩信息
    'w_email':url_o+'e2Login/queryTeacherInfo.do',//查询老师信息
    's_select':url_o+'dict/getDictListByTableName.do',//查询校区
    'stumo':url_o+'studentClassRoomData/querySdtClassRoomAnswerData.do',//查看单个学生课堂互动
    't_leyh':url_o+'teacherClassData/queryClassData.do',//老师查看班级课堂互动数据
    't_redis':url_o+'redis/clearCacheByPrefixKey.do',//清redis缓存
    't_dictionary':url_o+'dict/getDictListByTableName.do',//获取字典信息
    't_hour':url_o+'teacherData/queryTeacherClassHour.do',//获取老师课时数据
    't_hourmonth':url_o+'teacherData/queryTeacherMonthClassHour.do',//获取历史月份课时数据
    't_houehome':url_o+'teacherData/querTcHomeWorkRate.do',//获取老师作业率
};

var Study = {
    's_study':url_o+'studentAnalysis/scoreStdIdlReportStatus.do',  //学生获取个人成绩
    't_studt':url_o+'teacherAnalysis/scoreStdReport.do',   //老师查看学生成绩
    't_self':url_o+'teacherAnalysis/queryScoreReportByTeacherEmail.do',  //老师查看班级成绩
    't_getStudyDate':url_o+'teacherAnalysis/getStudyDate.do',   //学情成绩排名时间获取-学情
    's_getStudyDate':url_o+'studentData/getStudyDate.do',   //学情成绩排名时间获取-学情
    's_gradeByLessonNo':url_o+'teacherAnalysis/getStudentFloatGradeByLessonNo.do'//查看成绩排行榜
};
var Global = {
    "appid": appId,
    "secret": secreT,
    "actionURL": url.w_open
};
var homework_s = {
    't_list': url_o+'teacherData/queryHomeWorkListInfo.do',   //老师作业列表
    't_stat': url_o+'teacherData/updateSeveralStatus.do',//老师未读已读状态
    't_more': url_o+'teacherData/queryHomeWorkStateInfo.do',// 老师查看作业详情
    't_clas': url_o+'teacherData/queryTeacherClassList.do',//获取老师所带班级
    't_sbim': url_o+'teacherData/addHomeWork.do',    //提交老师作业
    't_modi': url_o+'teacherData/queryupdateHomeWorkFile.do',//老师批改作业获取文件
    't_succ': url_o+'teacherData/teacherReplyHomeWork.do', //批改提交
    't_file': 'http://10.200.80.235:8080/xdfdtmanager/upload/uploadFiles.do',   //文件上传云盘
    't_two' : url_o+'teacherData/queryMyResponsesHomrWorkFile.do' ,//老师查看批复作业
    't_dele': url_o+'teacherData/updateHomeWork.do',//老师删除作业
    't_erro': url_o+'teacherData/updateTeaHomework.do',//老师修改作业
    't_quck': url_o+'teacherData/pressStuHomework.do',  //老师催交作业
    't_mmmm': url_o+'teacherData/excellentHomeWorkshare.do',//优秀作业分享
    't_seac': url_o+'teacherData/gainHomeworkFileData.do', // 老师获取学生文件
    's_hwlt': url_o+'studentHWork/assingmentHomework.do',//待交作业学生列表查询
    's_hwltdetail': url_o+'studentHWork/assingmentHomeworkOne.do',//待交作业学生作业详情
    's_hwfl': url_o+'studentHWork/finishHomework.do',//已完成作业学生列表查询
    's_hwfldetail': url_o+'studentHWork/finishHomeworkSelectOne.do',//已完成作业学生作业详情
    's_hwrank': url_o+'studentHWork/studentHomeworRank.do',//学生作业排名
    's_hwcommit': url_o+'studentHWork/commitHomework.do',//学生作业排名
    's_readstatus': url_o+'studentHWork/updateStuReadstatus.do',//学生端完成作业的学生阅读状态
    's_fileRank': url_o+'upload/viewAllFileDetails.do',//集合方式获取云盘信息
    's_uploadFiles': url_o+'upload/uploadFileByBase64.do',//文件上传接口
    's_hw_report': url_o+'studentHWork/querySdtworkStatement.do',//学生作业报告
    's_hw_rank_e': url_o+'teacherData/queryShareExcellentHomrWork.do',//学生电子作业排行
    't_summary':url_o+'teacherData/queryWorksummary.do',//作业汇总
    't_getExcellent':url_o+'teacherData/queryExcellentHomeWorkContent.do',//获取试卷内容
    't_getFileDetails':url_o+'upload/viewAllFileDetails.do',//获取试卷内容
    't_getImgeUrl':url_o+'upload/previewUrl.do'//获取试卷内容

};
var pcweb = {
    't_add':url_o+'backEndMasterTeacherManager/addMasterTeacherCode.do',
    'old_data':url_o+'backEndMasterTeacherManager/getTeacherAllCode.do',
    't_dele':url_o+'backEndMasterTeacherManager/editMasterTeacherCode.do',
}
if(localStorage.mastTeater){
    homework_s.t_list = url_o+'masterTeacher/querMasterTeacherCurrentClassHmInfo.do';
    url.t_houehome = url_o+'masterTeacher/querMasterTeacherCurrentHmWorkRate.do';
    Study.t_self = url_o+'masterTeacher/queryMasterTeacherScoreReport.do'
       
}
//权限限制
if(localStorage.terEmail&&!localStorage.mastTeater&&!localStorage.Assistant){
    // 获取主讲
        ajax_S(url.data_s, '1', function (e) {
            for (var i = 0; i < e.data.length; i++) {
                if(localStorage.terEmail==e.data[i].accountId){
                    localStorage.mastTeater = 'true'

                }
            }
            if(!localStorage.mastTeater){
                localStorage.Assistant = 'true'
            }
        });  
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
            };
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
                        // layer.msg('获取用户信息失败')
                    }
                },
                error: function (json) {
                    // layer.msg('获取用户信息失败')
                }
            })
        }
    } else {
        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + Global.appid + '&redirect_uri=' + url + '&response_type=code&scope=snsapi_userinfo&state=' + getRequest()['userId'] + '#wechat_redirect';
        return false
    }
}

var Wxid = sessionStorage.openid;
var calbac = {
    'code':location.search.substring(location.search.indexOf('code')+5,location.search.indexOf('&')),
    'state':location.search.substring(location.search.indexOf('state')+6,location.search.length),
    'e2State':sessionStorage.e2state,
};
//e2登陆回传的值
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
};


// ajax封装
function ajax_S(link,more,func){
    var time_ ;
    $.ajax({
        url:link,
        type: 'post',
        timeout:5000,
        asyns:false,
        dataType: 'json',
        data:JSON.stringify(more),
        beforeSend:function(e){
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
            };
            var a = new Date();
            var b = a.getTime()+1000*5;
            
            sessionStorage.oldtime_D =  new Date(b).format("yyyy-MM-dd hh:mm:ss");
            time_ = setInterval(function(){
                if(sessionStorage.oldtime_D<new Date().format("yyyy-MM-dd hh:mm:ss")){
                   $('body').append('<div style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:20;background:#f1f1f1;"><img src="../common/images/erro_w.png" alt="" style="display:block;margin:335px auto 0;"><p style="display:block;width:213px;height:88px;background:#00ba97;color:#fff;border-radius:8px;text-align:center;font-size:32px;line-height:88px;margin:50px auto 0;" onclick="location.reload();">重新加载</p></div>')
                    clearInterval(time_);
                }
            },1000)
            
        },
        success:function(e){
            func(e);
            clearInterval(time_);
        },
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
                $('body').append('<div style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:20;background:#f1f1f1;"><img src="../common/images/erro_w.png" alt="" style="display:block;margin:335px auto 0;"><p style="display:block;width:213px;height:88px;background:#00ba97;color:#fff;border-radius:8px;text-align:center;font-size:32px;line-height:88px;margin:50px auto 0;" onclick="location.reload();">重新加载</p></div>')
                clearInterval(time_);
            }
        }
        
    });
}

/** @brief  封装ajax请求 create by Gws
 *  @param  targetUrl     请求接口
 *  @param  requestData        请求接口传参
 *  @param  successCallback     回调方法
 *  @param  failureCallback     失败方法
 */
function ajaxRequest(typeIn, targetUrl, requestData, successCallback) {
    var time_;
    $.ajax({
        type: typeIn,
        url: targetUrl,
        timeout:5000,
        data: requestData,
        beforeSend:function(e){
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
            };
            var a = new Date();
            var b = a.getTime()+1000*5;
            sessionStorage.oldtime_T =  new Date(b).format("yyyy-MM-dd hh:mm:ss");
            time_ = setInterval(function(){
                if(sessionStorage.oldtime_T<new Date().format("yyyy-MM-dd hh:mm:ss")&&targetUrl.indexOf('updateSeveralStatus.do')<0){
                   $('body').append('<div style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:20;background:#f1f1f1;"><img src="../common/images/erro_w.png" alt="" style="display:block;margin:335px auto 0;"><p style="display:block;width:213px;height:88px;background:#00ba97;color:#fff;border-radius:8px;text-align:center;font-size:32px;line-height:88px;margin:50px auto 0;" onclick="location.reload();">重新加载</p></div>')
                 clearInterval(time_);
                }
            },1000)
        },

        success: function (msg) {
            successCallback(msg);
            clearInterval(time_);
        },
        
        error: function (err) {
            // failureCallback(msg);
            console.log("err:"+err);
        },
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
                $('body').append('<div style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:20;background:#f1f1f1;"><img src="../common/images/erro_w.png" alt="" style="display:block;margin:335px auto 0;"><p style="display:block;width:213px;height:88px;background:#00ba97;color:#fff;border-radius:8px;text-align:center;font-size:32px;line-height:88px;margin:50px auto 0;" onclick="location.reload();">重新加载</p></div>')
                clearInterval(time_);
            }
        }
    });
};





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

// 去除字符串中所有空格
function removeAllSpace(str) {
    return str.replace(/\s+/g, "");
}
// 分隔成数组
function splitStrs(strs) {
    strs = removeAllSpace(strs);
    if(strs.indexOf(',')!=-1){
        strs = strs.split(',');
    }else if(strs.indexOf('，')!=-1){
        strs = strs.split('，');
    }else if(strs.indexOf(';')!=-1){
        strs = strs.split(';');
    }else if(strs.indexOf('；')!=-1){
        strs = strs.split('；');
    }else{
        strs = strs.split(',');
    }
    return strs;
};


//Tap事件封装
$(document).on("touchstart", function (e) {
    if (!$(e.target).hasClass("disable")) $(e.target).data("isMoved", 0);
});
$(document).on("touchmove", function (e) {
    if (!$(e.target).hasClass("disable")) $(e.target).data("isMoved", 1);
});
$(document).on("touchend", function (e) {
    if (!$(e.target).hasClass("disable") && $(e.target).data("isMoved") == 0) $(e.target).trigger("tap");
});





// 微信分享

function weChatData(Json) {
    var urlVal = window.location.href;
    var businessP = {
        "appid" :  appId,
        "secret": secreT,
        "url": urlVal
    };
    jQuery.ajax({
        type: "POST",
        url: url.w_xmor,
        async: true,
        dataType: 'json',
        data: JSON.stringify(businessP),
        success: function (json) {
            if (json.result == true) {//获取成功
                var appId = Global.appid;
                var timestamp = json.timestamp;
                var nonceStr = json.nonceStr;
                var signature = json.signature;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: appId, // 必填，公众号的唯一标识
                    timestamp: timestamp, // 必填，生成签名的时间戳
                    nonceStr: nonceStr, // 必填，生成签名的随机串
                    signature: signature,// 必填，签名，见附录1
                    jsApiList: ["startRecord", "uploadImage", "chooseImage", "previewImage", "stopRecord", "uploadVoice", "playVoice", "downloadVoice", "onMenuShareTimeline", "onMenuShareAppMessage", "hideMenuItems"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function () {

                    wx.checkJsApi({
                        jsApiList: ["startRecord", "uploadImage", "chooseImage", "previewImage", "stopRecord", "uploadVoice", "playVoice", "downloadVoice"],
                        success: function (res) {
                            // alert(JSON.stringify(res));
                        }
                    });

                    wx.onMenuShareTimeline({
                        title: Json.title, // 分享标题
                        link: urlVal, // 分享链接
                        imgUrl:Json.url, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            //$('.tan-box,.tan3,.mask,.popup,.mask-fq').hide();
                            // shareCmsFn();
                            //禁用部分分享按钮
                            wx.hideMenuItems({
                                menuList: ['menuItem:share:qq',         //分享到QQ
                                    'menuItem:share:weiboApp',   //分享到微博
                                    'menuItem:share:facebook',   //分享到Facebook
                                    'menuItem:share:QZone',      //分享到QQ空间
                                    'menuItem:openWithQQBrowser',//在QQ浏览器中打开
                                    'menuItem:openWithSafari',   //在Safari中打开
                                    'menuItem:share:email',
                                    'menuItem:copyUrl',          //复制链接
                                    'menuItem:readMode'          //阅读模式
                                ],
                                success: function () {
                                    //alert("testing:ok");
                                },
                                error: function () {
                                    //alert("testing:error");
                                }
                            });
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            //$('.tan-box,.tan3,.mask,.popup,.mask-fq').hide();
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: Json.title, // 分享标题
                        desc: Json.text, // 分享描述
                        link:urlVal , // 分享链接
                        imgUrl:Json.url, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            //$('.tan-box,.tan3,.mask,.popup,.mask-fq').hide();
                            // shareCmsFn();
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            //$('.tan-box,.tan3,.mask,.popup,.mask-fq').hide();
                        }

                    });

                });
            }
        }
    });

}



$(function(){
        $('body').append('<div class="load_t" style="display:none;"><div class="loading_s"><span></span><span></span><span></span><span></span><span></span></div></div>')
    })

