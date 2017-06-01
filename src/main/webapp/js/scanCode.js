//配置
wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    // appId: '${appId}', // 必填，公众号的唯一标识
    // timestamp: '${timestamp}', // 必填，生成签名的时间戳
    // nonceStr: '${nonceStr}', // 必填，生成签名的随机串
    // signature: '${signature}',// 必填，签名，见附录1
    // jsApiList: ['checkJsApi','scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

    appId: 'wx559791e14e9ce521',
    timestamp: 1453234353,
    nonceStr: 'U5iQqjfV123NT5du',
    signature: '258d9add846405992e4b7ad6e6e6bf825a984ce4',
    jsApiList: [
                    "scanQRCode"
                ]
});
//调用成功
wx.ready(function(){
    wx.checkJsApi({
    	jsApiList:['scanQRCode'],
    	success:function(res){
    		
    	}
    })
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
});
//调用失败
wx.error(function(res){
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
	alert("出错了"+res.errMsg)
});
$("#scanQRCode").click(function(){
	wx.scanQRCode({
	    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
	    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
	    success: function (res) {
	    	var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
		}
	});
})

 
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

