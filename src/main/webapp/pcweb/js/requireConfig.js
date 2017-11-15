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
    'lesstime_total':url_o + 'backEndClassHourCount/queryTeacherViewMode.do',//课时统计
    'expor_hour':url_o+'backEndClassHourCount/exportTeacherDetailExcel.do',//课时统计明细导出
    'lesstime_detail':url_o+'backEndClassHourCount/queryClassTeacherList.do',//课时统计查看明细
    'hw_total':url_o+'/backEndHomework/queryHomeWorkTotal.do',//作业统计
    'user_power_':url_o+'user/enableUser.do', //用户禁用
    'hw_details':url_o+'backEndHomework/queryHomeWorkTeacherDetail.do',//作业统计
    'hw_expor':url_o+'backEndHomework/exportHomeWorkTeacherDetail.do',//作业统计导出
};
require(['jquery-1.11.0.min'],function(){
/*数据交互请求地址*/
        if(sessionStorage.superstar){
            $('.user_name').html(sessionStorage.getItem('userName'));
            left_navlist(JSON.parse(sessionStorage.superstar));
        }else{
            e2Login();
        }


    /*用户下拉*/
    var timeout; 
    $('.user_name').hover(function(){
        $('.usermenu').stop().fadeIn();
        $('.user_name').css('background-image','url(images/img_3.png)')
    },function(){
        timeout = setTimeout(function(){
            $('.usermenu').stop().fadeOut();
             $('.user_name').css('background-image','url(images/img_1.png)')
        },500)
    });
    $('.usermenu').hover(function(){
        clearTimeout(timeout)
    },function(){
        $('.usermenu').stop().fadeOut();
        $('.user_name').css('background-image','url(images/img_1.png)')
    });
    /* 导航侧边栏 */
    $('.left_nav').on('click','li',function(){
        $(this).addClass('activ_nav').siblings().removeClass('activ_nav');
        // location.reload();
    });
    /**
     * 退出登录
     */
    $('#logout').click(toLogout);
    //左侧菜单栏
    function left_navlist(onelist){
                    for(var i = 0;i<onelist.length;i++){
                        var onelistbure = onelist[i];
                        var childlist = onelistbure.children;
                        if(onelistbure.isValid ==1&&childlist.length!=0){
                            $('.left_nav').prepend('<h2>'+onelistbure.text+'</h2>');
                        };
                        for(var k = 0;k<childlist.length;k++){
                            if(childlist[k].isValid ==1&&childlist[k].checked ==true){
                             $('.left_nav ul').append('<li href="'+childlist[k].url+'" class="active_me"><a href="'+childlist[k].url+'">'+childlist[k].text+'</a></li>')
                            }else{
                                $('.left_nav ul').append('<li></li>')
                            }
                        }
                    }
                    if( $('.left_nav ul li').length=='0'){
                        $('.content ').hide();
                        layer.msg('您暂无权限,请联系管理员');
                    }
                    var number_l = 0;
                    var url_l =  location.href;

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
                    var $url_ = $('.left_nav ul .active_me').eq(number_l).attr('href');
                    // location.href =url_l.substr(0,url_l.indexOf('#'))+$url_;
                    if($bure_true.hasClass('active_me')){
                        $bure_true.addClass('activ_nav')
                    }else{
                        $('.left_nav ul .active_me').eq(0).addClass('activ_nav');
                    }
                    if(url_l.indexOf($bure_true.attr('href'))<0){
                        location.href =url_l.substr(0,url_l.indexOf('#'))+$url_;
                    }

                }
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



    function setCookie(name, value, days) {
        var exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()+"; path=/";
    }

    function toLogout() {
        var url = "";
        var returnUrl = window.location.host;
        var currentUser = sessionStorage.getItem("userId");
        if(sessionStorage.superstar){
            //表示当前用户为超级管理员
            sessionStorage.clear();
            location.href = 'login_web.html';
            return false;
        }else {
            returnUrl = 'http://'+onlineUrl+'/xdfdthome/pcweb/pclogin.html';
            url = url_o + "logout/doLogout.do";
        };
        var businessP = {"returnUrl": returnUrl, "sid": sessionStorage.getItem("sid")};
        jQuery.ajax({
            type: "post",
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
                    sessionStorage.removeItem("sid");
                    sessionStorage.removeItem("userId");
                    sessionStorage.removeItem("userName");
                    window.top.location.href = json.logoutUrl;
                }
            }
        });
    }
//e2登陆回调
    function e2Login() {
        var code_s = location.search.substring(location.search.indexOf('code') + 5, location.search.indexOf('&'));
        var state_s = location.search.substring(location.search.indexOf('state') + 6, location.search.length);
        var calbac = {
            'code': code_s,
            'e2State': state_s,
            'state': state_s
        };
        $.ajax({
            url: url_o + "e2Login/doLogin.do",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify(calbac),
            success: function (e) {
                console.log(e);
                if (e.result == false) {
                    if(!sessionStorage.getItem('sid')){
                        layer.msg(e.message);
                        toLogout();
                    };
                } else {
                    sessionStorage.setItem("userName", e.userName);
                    var userId = e.userId;
                    userId = userId.split('@')[0];
                    sessionStorage.setItem("userId", userId);
                    sessionStorage.setItem("sid",e.sid);
                    $('.user_name').html(sessionStorage.getItem('userName'));
                    if(e.userList){

                        console.log($.parseJSON(e.userList))
                        localStorage.schoolList = e.userList.split('')[0].schoolId;
                    }
                    left_navlist(e.functionList)
                }
            }
        });
    }
});

