/**
 * Created by zyc on 2017/7/24.
 */
//sessionStorage.openid = 'ofZfFwgizCmzR5XXMQtC5Wx5wZrA'
// sessionStorage.stuNum= 'sy1';
$(function () {
    $(".t_email button").click(function () {
        var temail={
            "email":$(".t_email input").val()+"@xdf.cn",
            // 'wechatId': sessionStorage.openid
        }
        if($(".t_email input").val()==""){
            layer.msg("邮箱不能为空");
        }else{
            ajax_S(url.w_email,temail,terEmail);
        }

    })

    function terEmail(e){
        console.log(e.data);
        console.log(e.wechatData)
        if(e.result==true){
            if(e.data!=undefined){
                // var teaname = jQuery.parseJSON(e.data);
                localStorage.statusFlag="teacher";
                localStorage.terEmail = e.data.sEmail;
                localStorage.schoolId = e.data.nSchoolId;
                localStorage.teacherId=e.data.sCode;
                localStorage.teacherName=e.data.sName;
                // localStorage.Codearr= JSON.stringify(e.tCodeData);
                // if()
                // location.href="../wechat_list.html";
                if(!e.wechatData){
                    layer.msg("微信未授权");
                    var time,
                        number = 0,
                        randomstr = null;
                    time = setInterval(function(){
                        number++
                        var math_ = parseInt(Math.random()*10);
                        randomstr+=math_
                        if(number>=8){
                            clearInterval(time)
                            sessionStorage.openid = randomstr;
                            localStorage.statusFlag="teacher";
                            localStorage.terEmail = e.data.sEmail;
                            localStorage.schoolId = e.data.nSchoolId;
                            localStorage.teacherId=e.data.sCode;
                            localStorage.teacherName=e.data.sName;
                            location.href="../wechat_list.html";

                        }
                    },2)
                }else{
                    sessionStorage.nickname=e.wechatData[0].nickName;
                    sessionStorage.headimgurl=e.wechatData[0].headImg;
                    sessionStorage.openid=e.wechatData[0].wechatId;
                    location.href="../wechat_list.html";
                }
            }else{
                layer.msg("教师邮箱不存在");
            }

        }else{
            layer.msg("请输入正确的老师邮箱");
        }
    }
//清除缓存
    function clear(){
        localStorage.removeItem("teacherId");
        localStorage.removeItem("terEmail");
        localStorage.removeItem("schoolId");
        localStorage.removeItem("teacherName");
    }
})



