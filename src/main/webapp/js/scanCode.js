var o =  {"url" : location.href,"appid" : "wx559791e14e9ce521","secret": "baa4373d5a8750c69b9d1655a2e31370"}
var p;
            alert(sessionStorage.e2state)

$.ajax({
    url: 'http://dt.staff.xdf.cn/xdfdtmanager/wechatSignature/getWeChatSignature.do',
    type: 'post',
    dataType: 'json',
    asyns:false,
    data: JSON.stringify(o),
    success:function(e){
        console.log(e)
         p = e;
        console.log(p.timestamp)
        //配置
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: o.appid,   // 必填，公众号的唯一标识  
            timestamp: p.timestamp,   // 必填，生成签名的时间戳
            nonceStr: p.nonceStr,   // 必填，生成签名的随机串
            signature: p.signature, // 必填，签名
            jsApiList: ["scanQRCode"]
        });
        //调用成功
        wx.ready(function(){
            wx.checkJsApi({
                jsApiList:['scanQRCode'],
                success:function(res){
                    // alert('0123498646')
                }
            })
        });
        //调用失败
        wx.error(function(res){
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            alert("出错了"+res.errMsg)
        });

    }
})


$("#scanQRCode").click(function() {
    alert(0)
            wx.scanQRCode({
                // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
                needResult : 1,
                desc : 'scanQRCode desc',
                success : function(res) {
                    //扫码后获取结果参数赋值给Input
                    $('body').append(res)
                }
            });
        });
// $("#scanQRCode").click(function(){
//     // alert(0)
// 	wx.scanQRCode({
// 	    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
// 	    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
// 	    success: function (res) {
// 	    	var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
// 		}
// 	});
// })

 
var jsona ={"Method":"syncStudentsData","studentsData":{"acceptorId":"0035005A000C514D413535111","startDate":"2017-03-28 17:39:30","endDate":"2017-03-28 17:39:30","saveType":"new","schoolId":"002","schoolName":"机构校区002","classId":"001","className":"演示版本教室一","teacherId":"002","teacherName":"演示版本辅导老师","masterTeacherId":"aode@xdf.cn","masterTeacherName":" 阿城市市场","lessonNo": "1","devInfos": [{"studentName":"student A21","studentId":"A21","studentUserId":"UserId"}]}}
var jsonb = JSON.stringify(jsona)
// $.ajax({
//     url: 'http://10.73.81.189:8080/xdfdtmanager/studentDataController/syncStudentsData.do',
//     type: 'POST',
//     dataType: 'JSON',
//     data:{'studentsData':jsonb},
//     success:function(e){
//         var r = JSON.parse(e)
//         console.log(r)
//         if(r.code=='200'){
//             alert('成功')
//         }
//     },
//     error:function(e){
//         console.log(e)
//     }
// })

