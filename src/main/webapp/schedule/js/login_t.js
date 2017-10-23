//sessionStorage.openid = 'ofZfFwgizCmzR5XXMQtC5Wx5wZrA'
// sessionStorage.stuNum= 'sy1';
var WXnum  = {
    'wechatId':sessionStorage.openid
};

var code_s = location.search.substring(location.search.indexOf('code')+5,location.search.indexOf('&'));
var state_s = location.search.substring(location.search.indexOf('state')+6,location.search.length);
var calbac = {
    'code':code_s,
    'e2State':state_s,
    'state':state_s
};
if(localStorage.terEmail){
    $('.name_s').html(localStorage.teacherName);
    $('.name_ema').html(localStorage.terEmail);
    var bindingtea0 = {};
    bindingtea0['email'] = localStorage.terEmail;
    bindingtea0['wechatId'] = sessionStorage.openid;
    // alert(bindingtea0)
    ajax_S(url.s_seac,WXnum,function(e){
        if(e.data!=undefined){
            var stumore = {'StudentCode':e.studentNo,'wechatId':sessionStorage.openid,'nickName':encodeURIComponent(encodeURIComponent(sessionStorage.nickname)),'headImg': sessionStorage.headimgurl};
            ajax_S(url.s_nobd,stumore,telbind)
        }
    });
    ajax_S(url.t_wxmo, bindingtea0,binding)//ajax请求
}else{
    var bindingtea0 = {};
    ajax_S(url.t_more,calbac,teac);

}
function Wxtea(e){
    if(e.data!=undefined){
        var teaname = jQuery.parseJSON(e.data);
        $('.name_s').html(teaname.teacherName);
        $('.name_ema').html(teaname.teacherEmail);
        localStorage.terEmail = teaname.teacherEmail;
        localStorage.teacherId = teaname.teacherNo;
        localStorage.schoolId = teaname.schoolId;
        localStorage.teacherName = teaname.teacherName;
        localStorage.teachertel = teaname.mobile;
    }else{
        // etlogin('teacherWX')
    }
}
function teac(e){
    if(e.result==false){
        ajax_S(url.t_wxmo,WXnum,Wxtea)//ajax请求
    }else{
        var Email_val = '';
        // var teaname = jQuery.parseJSON(e.data);
        if(e.email!=''){
            Email_val = e.email
        }
        else if(e.userId.indexOf('@')!=-1){
            Email_val = e.userid;
        }
        $('.name_s').html(e.userName);
        $('.name_ema').html(Email_val);
        localStorage.terEmail = Email_val;
        localStorage.sid = e.sid;
        bindingtea0['email'] = Email_val;
        bindingtea0['wechatId'] = sessionStorage.openid;
        bindingtea0['nickName'] = encodeURIComponent(encodeURIComponent(sessionStorage.nickname));
        bindingtea0['headImg'] = sessionStorage.headimgurl;
        ajax_S(url.t_wxmo, bindingtea0,binding)//ajax请求
    }
}
// s

// clearCookie('U2Token','/aaaaaaa','.xdf.cn')



//获取老师绑定信息
function binding(e){
    if(e.result==false){
        ajax_S(url.t_wxmo,WXnum,Wxtea)
    }else{
        var teacontent = JSON.parse(e.data);
        $('.name_s').html(teacontent.teacherName);
        $('.name_ema').html(teacontent.teacherEmail);
        localStorage.terEmail = teacontent.teacherEmail;
        localStorage.teacherId = teacontent.teacherNo;
        localStorage.schoolId = teacontent.schoolId;
        localStorage.teacherName = teacontent.teacherName;
        localStorage.teachertel = teacontent.mobile;
        if(sessionStorage.callbackconfig=='schedule'){
            location.href = 'schedule_s.html'
            sessionStorage.removeItem('callbackconfig')
        }
        if(sessionStorage.studayCanfig=='studay'){
            location.href = '../learningSituation/report_t.html';
            sessionStorage.removeItem('studayCanfig')
        }
        if(sessionStorage.homeCanfig=='home'){
            location.href = '../homework/homeworklist_t.html';
            sessionStorage.removeItem('homeCanfig');
        }
    }

}





function logout(){
    var bindingtea = {'email': $(".name_ema").html(), 'wechatId': sessionStorage.openid};
    ajax_S(url.t_siot, bindingtea, signOut)
}
function clear(){
    localStorage.clear();
}
// 退出登录
function signOut(e) {
    var unlog = {
        'sid': localStorage.sid
    };
    unlog.returnUrl = url.t_back;
    clear();
    //退出e2登录
    ajax_S(url.t_logi, unlog, function (a) {
        location.href = a.logoutUrl
    });
}

// 配置微信启动项
var Wxconfig =  {"url" : location.href,"appid" : appId,"secret": secreT};
var Wxconfig_h;
$.ajax({
    url: url.w_xmor,
    type: 'post',
    dataType: 'json',
    asyns:false,
    data: JSON.stringify(Wxconfig),
    success:function(e){
        Wxconfig_h = e;
        //配置
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: Wxconfig.appid,   // 必填，公众号的唯一标识
            timestamp: Wxconfig_h.timestamp,   // 必填，生成签名的时间戳
            nonceStr: Wxconfig_h.nonceStr,   // 必填，生成签名的随机串
            signature: Wxconfig_h.signature, // 必填，签名
            jsApiList: ["checkJsApi","scanQRCode","onMenuShareAppMessage"]
        });
        //调用成功
        wx.ready(function(){
            wx.checkJsApi({
                jsApiList:["checkJsApi",'scanQRCode','onMenuShareAppMessage'],
                success:function(res){
                    console.log("权限配置验证成功");
                }
            })
        });
        //调用失败
        wx.error(function(res){
            // alert("出错了"+res.errMsg)
        });

    }
});

// 绑定点击事件
$(document).on('touchend',"#scanQRCode",function() {
    if(localStorage.mastTeater){
        alert('您当前的账户为主讲老师，暂仅能查看哦。')
        return false;
    }
    // alert(0)
    wx.scanQRCode({
        needResult : 1,  // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
        desc : 'scanQRCode desc',
        success : function(res) {
            $('.Wxid').val(res.resultStr)
            more_s()
        }
    });
});
// 绑定微信分享点击事件
$(document).on('touchend',"#onMenuShareAppMessage",function() {
    alert("微信分享事件触发")
    wx.onMenuShareAppMessage({
        title: "onMenuShareAppMessagetest", // 分享标题
        desc: "onMenuShareAppMessage", // 分享描述
        link: window.location.href, // 分享链接
        imgUrl:"", // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
            //$('.tan-box,.tan3,.mask,.popup,.mask-fq').hide();
            // shareCmsFn();
            alert("success！！！");
            shareCmsFn();
        },
        cancel: function () {
            alert("cancel");
            // 用户取消分享后执行的回调函数
            //$('.tan-box,.tan3,.mask,.popup,.mask-fq').hide();
        }

    });
});
// alert(sessionStorage.e2state)
// 请求用户登录信息
if (!localStorage.terEmail) {
    var code_s = location.search.substring(location.search.indexOf('code')+5,location.search.indexOf('&'));
    var state_s = location.search.substring(location.search.indexOf('state')+6,location.search.length);
    var tname_config  = {
        'code':code_s,
        'e2State':state_s,
        'state':state_s
    }

    $.ajax({
        url: url.w_teac,
        type: 'post',
        asyns: false,
        dataType: 'json',
        data: JSON.stringify(tname_config),
        success: function (e) {
            if (e.result == false) {
                $('.sucs').hide();
                $('.erro').show();
                $('.erro i').html(e.message);
            } else {
                $('.erro').hide();
                $('.sucs').show();
                $('.sucs i').html(e.message);
                //sessionStorage.terEmail = e.email
                localStorage.terEmail = e.email;
            }
        }
    });
}else{
    $('.erro').hide();
    $('.sucs').show();
    $('.sucs i').html('查询成功');
}


//more_s()

//查询用户详细信息
function more_s(){
    var  teacherid = localStorage.terEmail;//sessionStorage.terEmail
// var  teacherid = 'jinyongcun@xdf.cn'
    var  studata   = [],stumodata = [];
    var teachmore = {};
    $.ajax({
        url:url.w_stum,
        type: 'POST',
        dataType: 'JSON',
        asyns:false,
        data:{'email':teacherid},
        success:function(e){
            // alert(0)
            var more = e;
            console.log(more)
            var class_s = more.data;
            if(class_s == ''){
                layer.msg(more.msg);
                return;
            }
            // for(var i = 0;i<class_s.length;i++){
            var stumore = more.data.Students;
            var teamore = more.data.teachers;
            if(stumore!=''||stumore.length!=0){
                for(var k = 0;k<stumore.length;k++){
                    stumodata.push({
                        'studentName' :stumore[k].StudentName,
                        'studentId':stumore[k].StudentCode,
                        'studentUserId':stumore[k].CardCode ,
                    });
                }
            }else{
                layer.msg('暂无学生')
                return false;
            }

            if(teamore.length==1){
                teachmore = {
                    'masterTeacherId':teamore[0].Id,
                    'masterTeacherName':teamore[0].sName,
                    'teacherId':teacherid,
                    'teacherName':teamore[0].sName
                }
            }else{
                for(var j = 0;j<teamore.length;j++){
                    if(teamore[j].sEmail ==teacherid){
                        if(j==1){
                            teachmore = {
                                'masterTeacherId':teamore[j-1].sEmail,
                                'masterTeacherName':teamore[j-1].sName,
                                'teacherId':teacherid,
                                'teacherName':teamore[j]. sName
                            }
                        }else{
                            teachmore = {
                                'masterTeacherId':teamore[j+1].sEmail,
                                'masterTeacherName':teamore[j+1].sName,
                                'teacherId':teacherid,
                                'teacherName':teamore[j].sName
                            }
                        }

                    }
                }
            }
            // console.log(teachmore)
            teachjson = {
                'acceptorId':$('.Wxid').val(),
                'startDate':class_s.SectBegin,
                'endDate':class_s.SectEnd,
                'saveType':'flush',
                'schoolId':class_s.SchoolId,
                'schoolName':class_s.SchoolName,
                'classId':class_s.ClassCode,
                'className':class_s.ClassName,
                'teacherId':teachmore.teacherId,
                'teacherName':teachmore.teacherName,
                'masterTeacherId':teachmore.masterTeacherId,
                'masterTeacherName':teachmore.masterTeacherName,
                'lessonNo':class_s.LessonNo,
                'devInfos':stumodata,
            }
            // studata.push(teachjson);
            // }
            var  teachjsonT = { "Method": "syncStudentsData",'studentsData':teachjson}
            console.log(teachjsonT)
            $.ajax({
                url:url.w_stor,
                type: 'POST',
                dataType: 'JSON',
                asyns:false,
                data:{'studentsData':JSON.stringify(teachjsonT)},
                success:function(e){
                    console.log(e+'1111')
                    console.log(teachjsonT)
                    var r =e;
                    if(r.code=='200'){
                        if(e.msg=='当天没有课程信息'){
                            layer.msg('当天没有课程信息')
                        }else{
                            layer.msg('扫描完成')
                        }
                    }
                }
            })
        }
    })


}

function shareCmsFn() {//分享统计
    var activityId = Global.activityId;
    var title = $('title').html();
    var url = location.href;
    var businessP = {
        "activityId": activityId,
        "type": 1,//分享
        "url": url,
        "title": title,
        "userId": sessionStorage.openid
    };
    var d = constructionParams(rsaEncryptedString(businessP), "58b2b8ce80b44b10be8c67573073bd2d");//68
    jQuery.ajax({
        type: "POST",
        url: Global.actionURL,
        async: true,
        dataType: 'json',
        data: JSON.stringify(d),
        success: function (json) {
            alert(JSON.stringify(json));
            if (json.result == true) {
            }
        }
    })
}
