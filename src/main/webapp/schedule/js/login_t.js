// sessionStorage.openid = 'ofZfFwgizCmzR5XXMQtC5Wx5wZrA'
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
    var bindingtea0 = {};
    bindingtea0['email'] = localStorage.terEmail;
    bindingtea0['wechatId'] = sessionStorage.openid;
    // alert(bindingtea0)
    ajax_S(url.s_seac,WXnum,function(e){
        if(e.data!=undefined){
            var stumore = {'StudentCode':e.studentNo,'wechatId':sessionStorage.openid,'nickName':sessionStorage.nickname,'headImg': sessionStorage.headimgurl}
            ajax_S(url.s_nobd,stumore,telbind)
        }
    });
    ajax_S(url.t_wxmo, bindingtea0,binding)//ajax请求
}else{

    ajax_S(url.t_more,calbac,teac);

    var bindingtea0 = {};
}
function Wxtea(e){
    if(e.data!=undefined){
        var teaname = jQuery.parseJSON(e.data);
        console.log(teaname)
        $('.name_s').html(teaname.teacherName);
        $('.name_ema').html(teaname.teacherEmail);
        localStorage.terEmail = teaname.teacherEmail;
    }else{
        // etlogin('teacherWX')
    }
}
function teac(e){
    console.log(e)
    if(e.result==false){
        ajax_S(url.t_wxmo,WXnum,Wxtea)//ajax请求
    }else{
        // var teaname = jQuery.parseJSON(e.data);
        $('.name_s').html(e.userName);
        $('.name_ema').html(e.userId);
        localStorage.terEmail = e.userId;
        localStorage.sid = e.sid;
        bindingtea0['email'] = localStorage.terEmail;
        bindingtea0['wechatId'] = sessionStorage.openid;
        bindingtea0['nickName'] = encodeURI(sessionStorage.nickname);
        bindingtea0['headImg'] = sessionStorage.headimgurl;
        ajax_S(url.t_wxmo, bindingtea0,binding)//ajax请求
    }
}
// s

// clearCookie('U2Token','/aaaaaaa','.xdf.cn')



//获取老师绑定信息
function binding(e){
    var a = encodeURI(encodeURI(sessionStorage.nickname))
    $('body').append('<h1>'+decodeURI(decodeURI(a))+'</h1>')
    $('body').append('<h1>'+sessionStorage.nickname+'</h1>')
	if(e.result==false){
        ajax_S(url.t_wxmo,WXnum,Wxtea)
	}else{
        var teacontent = JSON.parse(e.data);
        $('.name_s').html(teacontent.teacherName);
        $('.name_ema').html(teacontent.teacherEmail);
        sessionStorage.terEmail = teacontent.teacherEmail;
	}

}




function logout(){
	var bindingtea = {'email': $(".name_ema").html(), 'wechatId': sessionStorage.openid};
	ajax_S(url.t_siot, bindingtea, signOut)
}

// 退出登录
function signOut(e) {
        var unlog = {
            'sid': localStorage.sid,
            'returnUrl': url.t_back
        };
        //退出e2登录
        ajax_S(url.t_logi, unlog, function (a) {
            location.href = a.logoutUrl
        });
}
    // 配置微信启动项
    var Wxconfig =  {"url" : location.href,"appid" : "wx559791e14e9ce521","secret": "baa4373d5a8750c69b9d1655a2e31370"};
    var Wxconfig_h;
    $.ajax({
        url: url.w_xmor,
        type: 'post',
        dataType: 'json',
        asyns:false,
        data: JSON.stringify(Wxconfig),
        success:function(e){
            // console.log(e)
            Wxconfig_h = e;
            // console.log(Wxconfig_h.timestamp);
            //配置
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: Wxconfig.appid,   // 必填，公众号的唯一标识
                timestamp: Wxconfig_h.timestamp,   // 必填，生成签名的时间戳
                nonceStr: Wxconfig_h.nonceStr,   // 必填，生成签名的随机串
                signature: Wxconfig_h.signature, // 必填，签名
                jsApiList: ["checkJsApi","scanQRCode"]
            });
            //调用成功
            wx.ready(function(){
                wx.checkJsApi({
                    jsApiList:["checkJsApi",'scanQRCode'],
                    success:function(res){

                    }
                })
            });
            //调用失败
            wx.error(function(res){
                alert("出错了"+res.errMsg)
            });

        }
    });

// 绑定点击事件
    $(document).on('touchend',"#scanQRCode",function() {
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
                for(var k = 0;k<stumore.length;k++){
                    stumodata.push({
                        'studentName' :stumore[k].StudentName,
                        'studentId':stumore[k].Id,
                        'studentUserId':stumore[k].CardCode ,
                    });
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
