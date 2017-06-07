$(function(){
// 配置微信启动项
var Wxconfig =  {"url" : location.href,"appid" : "wx559791e14e9ce521","secret": "baa4373d5a8750c69b9d1655a2e31370"};
var Wxconfig_h;
$.ajax({
    url: 'http://dt.staff.xdf.cn/xdfdtmanager/wechatSignature/getWeChatSignature.do',
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
$("#scanQRCode").click(function() {
    wx.scanQRCode({
        needResult : 1,  // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
        desc : 'scanQRCode desc',
        success : function(res) {
            $('body').append('<h1>'+res.resultStr+'</h1>')
        }
    });
});

// 请求用户登录信息
console.log( {'code':location.search.substring(location.search.indexOf('code')+5,location.search.indexOf('&')),'state':location.search.substring(location.search.indexOf('state')+6,location.search.length),'e2State':sessionStorage.e2state})
var tname_config  = {'code':location.search.substring(location.search.indexOf('code')+5,location.search.indexOf('&')),'state':location.search.substring(location.search.indexOf('state')+6,location.search.length),'e2State':sessionStorage.e2state}
$.ajax({
        url: 'http://dt.staff.xdf.cn/xdfdtmanager/e2Login/doLogin.do',
        type: 'post',
        asyns:false,
        dataType: 'json',
        data:JSON.stringify(tname_config),
        success:function(e){
            if(e.message=='登录失败,请重新登录!'){
                $('.sucs').hide();
                $('.erro').show();
            }else{
                alert('成功')
            }
        }
});



//查询用户详细信息
var  teacherid = 'caoxuefeng@xdf.cn'
var  studata   = [],stumodata = [];
var teachmore = {};
$.ajax({
    url: 'http://10.200.80.235:8080/xdfdtmanager/studentDataController/getClassDatas.do',
    type: 'POST',
    dataType: 'JSON',
    asyns:false,
    data:{'email':teacherid},
    success:function(e){    
        var more = JSON.parse(e);
        console.log(more.data.class)
        var class_s = more.data.class;
        for(var i = 0;i<class_s.length;i++){
            var stumore = class_s[i].students;
            var teamore = class_s[i].teachers
            for(var k = 0;k<stumore.length;k++){
                stumodata.push({
                    'studentName' :stumore[k].Name,
                    'studentId':stumore[k].Code,
                    'studentUserId':stumore[k].IdCard ,
                });
            }
            if(teamore.length==1){
                teachmore = {
                    'masterTeacherId':teamore[0].Id,
                    'masterTeacherName':teamore[0].sName,
                    'teacherId':teamore[0].Id,
                    'teacherName':teamore[0].sName
                }
            }else{
                for(var j = 0;j<teamore.length;j++){
                    if(teamore[j].sEmail ==teacherid){
                    if(j==1){
                            teachmore = {
                            'masterTeacherId':teamore[j].Id,
                            'masterTeacherName':teamore[j].sName,
                            'teacherId':teamore[j-1].Id,
                            'teacherName':teamore[j-1]. sName
                        }
                    }else{
                        teachmore = {
                            'masterTeacherId':teamore[j].Id,
                            'masterTeacherName':teamore[j].sName,
                            'teacherId':teamore[j+1].Id,
                            'teacherName':teamore[j+1].sName
                        }
                    }
                        
                    }
                }
            }
            // console.log(teachmore)
            teachjson = {
                'acceptorId':'0035005A000C514D413535111',
                'startDate':class_s[i].BeginDate,
                'endDate':class_s[i].EndDate,
                'saveType':'new',
                'schoolId':class_s[i].SchoolId,
                'schoolName':'北京校区',   
                'classId':class_s[i].Id,  
                'className':class_s[i].ClassName,
                'teacherId':teachmore.teacherId, 
                'teacherName':teachmore.teacherName,
                'masterTeacherId':teachmore.masterTeacherId,
                'masterTeacherName':teachmore.masterTeacherName,
                'lessonNo':'1',
                'devInfos':stumodata,
             }
             studata.push(teachjson);
        }
        var  teachjsonT = { "Method": "syncStudentsData",'studentsData':studata}
        console.log(teachjsonT)
        $.ajax({
                url: 'http://10.200.80.235:8080/xdfdtmanager/studentDataController/syncStudentsData.do',
                type: 'POST',
                dataType: 'JSON',
                asyns:false,
                data:{'studentsData':JSON.stringify(teachjsonT)},
                success:function(e){    
                    console.log(e+'1111')
                    var r = JSON.parse(e);
                    if(r.code=='200'){
                        alert('成功')
                    }
                }
            })
    }
})




// 获取信息
// var jsona ={"Method":"syncStudentsData","studentsData":{"acceptorId":"0035005A000C514D413535121","startDate":"2017-03-28 17:39:30","endDate":"2017-03-28 17:39:30","saveType":"new","schoolId":"002","schoolName":"机构校区002","classId":"001","className":"演示版本教室一","teacherId":"002","teacherName":"演示版本辅导老师","masterTeacherId":"aode@xdf.cn","masterTeacherName":" 阿城市市场","lessonNo": "1","devInfos": [{"studentName":"student A21","studentId":"A21","studentUserId":"UserId"}]}}
// var jsonb = JSON.stringify(jsona)
// var  teachjson = { "Method": "syncStudentsData",'studentsData':studata}
// $.ajax({
//     url: 'http://10.200.80.235:8080/xdfdtmanager/studentDataController/syncStudentsData.do',
//     type: 'POST',
//     dataType: 'JSON',
//     asyns:false,
//     data:{'studentsData':JSON.stringify(teachjson)},
//     success:function(e){    
//         console.log(e+'1111')
//         var r = JSON.parse(e)
//         if(r.code=='200'){
//             alert('成功')
//         }
//     }
// })
//     console.log(teachjson)
})