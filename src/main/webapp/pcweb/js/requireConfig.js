/* 配置文件*/

/*Life without love crt 2017-11-1 G*/


var onlineUrl = 'dt.xdf.cn';
if(window.location.host == onlineUrl){   //正式环境
    var url_o = 'http://dt.xdf.cn/xdfdtmanager/';
}else{    //测试环境
    var url_o = 'http://dt.staff.xdf.cn/xdfdtmanager/';
    onlineUrl = 'dt.staff.xdf.cn'
}

var global = {
    'indexAll':url_o+'backEndHome/queryCountUser.do',   //概况列表
    'indexForm':url_o+'backEndHome/exportBranchUserListExcel.do',  //导出概况列表
    'indexFormAll':url_o+'backEndHome/exportCountUserAnalyseListExcel.do', //导出概况总表
    'left_nav':url_o+'function/getAllFunction.do',  //左侧导航
    'master_All':url_o+'teacherData/queryAllSpeakerTeachers.do', //获取所有主讲列表
    'school_All':url_o+'dict/getDictListByTableName.do',//获取校区
    'master_data':url_o+'backEndMasterTeacherManager/getTeacherAllCode.do', //获取主讲校区信息
    'master_add':url_o+'backEndMasterTeacherManager/addMasterTeacherCode.do',//新增老师编号
    'master_reduce':url_o+'backEndMasterTeacherManager/editMasterTeacherCode.do',//删除老师编号
    'master_new':url_o+'backEndMasterTeacherManager/addMasterTeacher.do',//新建主讲
    'user_list':url_o+'user/getMarketPrivilegeList.do', //获取用户列表
    'user_seac':url_o+'user/searchUser.do',  //搜索集团用户
    'user_addnew':url_o+'user/addUser.do',//新建用户
    'user_power':url_o+'function/addFunctionUser.do',//增加权限
    'user_edit':url_o+'user/updateUser.do',//编辑用户
};
require(['jquery-1.11.0.min'],function(){
/*数据交互请求地址*/

    toLogin();

    /*用户下拉*/
    var timeout; 
    $('.user_name').hover(function(){
        $('.usermenu').stop().fadeIn();
        $('.user_name').css('background-image','url(../images/img_3.png)')
    },function(){
        timeout = setTimeout(function(){
            $('.usermenu').stop().fadeOut();
             $('.user_name').css('background-image','url(../images/img_1.png)')
        },500)
    })
    $('.usermenu').hover(function(){
        clearTimeout(timeout)
    },function(){
        $('.usermenu').stop().fadeOut();
        $('.user_name').css('background-image','url(../images/img_1.png)')
    });
    /* 导航侧边栏 */
    $(document).on('click','.left_nav li',function(){
        $(this).addClass('activ_nav').siblings().removeClass('activ_nav');
    });
    /**
     * 退出登录
     */
    $('#logout').click(toLogout);
    function toLogout() {
        var url = "";
        var returnUrl = window.location.host;
        var currentUser = sessionStorage.getItem("userId");
        if(currentUser == "ssdf"){
            //表示当前用户为超级管理员
            returnUrl = returnUrl + "/pcweb/login_web.html";
            url = url_o + "logout/doAdminLogout.do"
        }else {
            returnUrl = 'http://'+onlineUrl+'/xdfdthome'

            url = url_o + "logout/doLogout.do";
        }

        var businessP = {"returnUrl": returnUrl, "sid": sessionStorage.getItem("sid")};
        jQuery.ajax({
            type: "POST",
            url: url,
            async: false,//同步
            dataType: 'json',
            data: JSON.stringify(businessP),
            success: function (json) {
                if (json.result == true) {
                    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
                    if (keys) {

                        for (var i = keys.length; i--;)
                            setCookie(keys[i], 1, -1);
                    }
                    sessionStorage.removeItem("sid")
                    sessionStorage.removeItem("userId")
                    sessionStorage.removeItem("userName")
                    window.top.location.href = returnUrl;
                }
            }
        });
    }
    //左侧菜单栏

    $.ajax({
        url:global.left_nav,
        type: 'post',
        asyns:false,
        dataType: 'json',
        data:JSON.stringify({'userId':sessionStorage.userId}),
        success:function(e){
            if(e.result){
                var onelist = e.dataList;
                for(var i = 0;i<onelist.length;i++){
                    var onelistbure = onelist[i];
                    if(onelistbure.isValid ==1){
                        $('.left_nav').prepend('<h2>'+onelistbure.text+'</h2>');
                        for(var k = 0;k<onelistbure.children.length;k++){
                            var twolist = onelistbure.children[k];
                            if(twolist.isValid ==1){
                                $('.left_nav ul').append('<li><a href="'+twolist.url+'">'+twolist.text+'</a></li>')
                            }
                        }
                        var url_l =  location.href;
                        var number_l = 0;
                        if(url_l.indexOf('homework')!=-1||url_l.indexOf('detail')!=-1){
                            number_l = 1;
                        }
                        else if(url_l.indexOf('lesstime')!=-1||url_l.indexOf('lesstime_detail')!=-1){
                            number_l = 2;
                        }
                        else if(url_l.indexOf('power')!=-1||url_l.indexOf('userAdd')!=-1||url_l.indexOf('useredit')!=-1){
                            number_l = 3
                        }
                        else if(url_l.indexOf('master')!=-1){
                            number_l = 4
                        }
                        var $bure_true = $('.left_nav ul li').eq(number_l);
                        $bure_true.addClass('activ_nav')
                    }
                }
            }
        }
    });

    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    //登陆
    function toLogin() {
        var code_s = location.search.substring(location.search.indexOf('code') + 5, location.search.indexOf('&'));
        var state_s = location.search.substring(location.search.indexOf('state') + 6, location.search.length);
        var calbac = {
            'code': code_s,
            'e2State': state_s,
            'state': state_s
        };
        $.ajax({
            url: url_o + "/e2Login/doLogin.do",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify(calbac),
            success: function (e) {
                console.log(e);
                if (e.result == false) {

                    alert(e.message);
                    toLogout();
                } else {

                    sessionStorage.setItem("userName", e.userName);
                    var userId = e.userId;
                    userId = userId.split('@')[0];

                    sessionStorage.setItem("userId", userId);


                    sessionStorage.setItem("sid",e.sid)
                    // showFunctionList(userId);
                }
            }
        });
    }
});
