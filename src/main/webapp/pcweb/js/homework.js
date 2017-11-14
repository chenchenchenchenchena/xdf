/* 作业统计 */

/*默认筛选条件*/
var dateMonth = '6';// 默认半年
var stage = "";//默认全部
var grade = "";//默认全部
var subject = "";//默认全部
var currentSchoolId = "";//默认全部
var currentSchool = "全部";//默认全部
var beginTime = "";//默认全部
var endTime = "";//默认全部
var homeworkType = "0"//默认作业类型全部 0表示查询所以 1表示查询普通 2表示查询电子
var currentStageCode;


localStorage.schoolList = "73";

require(['jquery-1.11.0.min'], function () {
    require(['jquery-ui.min'], function () {
        require(['layer'], function () {

            /*默认导航选中样式*/
            $('.homework_Statistics div:nth-child(even)').css('float', 'right');
            $('.homework_Statistics div h1 i').css('margin-left', '0px');
            $('.homework_list li:nth-child(odd)').css('background', '#f5fbfa');
            laydate.render({
                elem: '#date_input',
                range: true //指定元素
            });
            //默认首次查询校区为全部
            currentSchoolId = localStorage.schoolList;
            currentSchool = "全部";
            selectHwData();


            //筛选"确定"按钮点击事件
            $('#hw_selectBtn').click(function () {
                selectHwData();
            });
            //名词解释
            $('.homework_explain img').click(function(){
                $('.back_big ').show();
                $('.operation_s ').show();
            });
            //名词解释关闭
            $('.operation_s  img').click(function(){
                $('.back_big ').hide();
                $('.operation_s ').hide();
            })
        });
    });
});


//校区展示
function getSchool() {
    if (sessionStorage.schoolList) {
        var json = JSON.parse(sessionStorage.schoolList);
        showSchoolList(json);
    } else {
        var table = {
            "tableName": "dict_school_info"
        };
        $.ajax({
            type: "POST",
            url: url_o + 'dict/getDictListByTableName.do',
            dataType: 'json',
            data: table,
            success: function (e) {
                sessionStorage.schoolList = JSON.stringify(e);
                showSchoolList(e)
            }
        })
    }

}

//筛选校区列表显示
function showSchoolList(e) {
    var schoolStr = localStorage.schoolList;// 全部的校区ID
    var schoolIdList = schoolStr.split(',');

    var schoolList = e.data;
    if (schoolList != undefined && schoolList.length > 0) {
        $("#school").parent().find("ul").html("");
        var cityContent = "<li onclick='filterByCityId(this, \"" + "全部" + "\")' data-schoolId='" + schoolStr + "'><span>全部</span></li>";
        for (var i = 0; i < schoolIdList.length; i++) {
            for (var j = 0; j < schoolList.length; j++) {
                var schoolId = schoolList[j].tCode;
                if (schoolIdList[i] == schoolId) {
                    cityContent += "<li onclick='filterByCityId(this, \"" + schoolList[j].tName + "\")' data-schoolId='" + schoolId + "' ><span>" + schoolList[j].tName + "</span></li>";
                }
            }

        }
        $("#school").parent().find("ul").html(cityContent);
    } else {
        layer.msg("查询失败!")
    }

    $("#school").parent().find("ul").show();
}

//点击选择校区
function filterByCityId(_this, schoolName) {
    currentSchool = schoolName;
    currentSchoolId = $(_this).attr('data-schoolId');
    $("#school").html(currentSchool);
    $("#school").parent().find("ul").hide();
}

//获取学段／年级／科目
function getSelectList(this_, type, flag) {

    var json;
    switch (flag) {
        case 0:
            json = sessionStorage.stageList;
            break;
        case 1:
            if(currentStageCode == undefined){
                layer.msg("请先选择学段");
                return false;
            }
            json = sessionStorage.gradelList;
            break;
        case 2:
            json = sessionStorage.subjectList;
            break;
    }
    if (json != undefined) {
        json = JSON.parse(json);
        showDrownList(json, this_,flag);
    } else {
        var table = {
            "tableName": type
        };
        $.ajax({
            type: "POST",
            url: url_o + 'dict/getDictListByTableName.do',
            dataType: 'json',
            data: table,
            success: function (e) {
                switch (flag) {
                    case 0:
                        sessionStorage.stageList = JSON.stringify(e);
                        break;
                    case 1:
                        sessionStorage.gradelList = JSON.stringify(e);
                        break;
                    case 2:
                        sessionStorage.subjectList = JSON.stringify(e);
                        break;
                }
                showDrownList(e, this_,flag);
            }
        })
    }

}

//筛选学段／年级／科目列表显示
function showDrownList(json, this_,flag) {
    $(this_).parent().find('ul').show();
    $(this_).parent().parent().siblings().find('ul').hide();
    if (json.code == "200") {
        $(this_).siblings().find('ul').html("");
        var list = json.data;
        var content = "<li onclick='filterByDrownId(this, \"" + "全部" + "\","+flag+")' data-tCode=''><span>全部</span></li>";
        for (var i = 0; i < list.length; i++) {
            var tCode = list[i].tCode;
            if(flag == 1){
                if (tCode.indexOf(currentStageCode) >= 0) {
                    content += "<li onclick='filterByDrownId(this, \"" + list[i].tName + "\","+flag+")' data-tCode='" + tCode + "' ><span>" + list[i].tName + "</span></li>";
                }
            }else {
                content += "<li onclick='filterByDrownId(this, \"" + list[i].tName + "\","+flag+")' data-tCode='" + tCode + "' ><span>" + list[i].tName + "</span></li>";
            }
        }

        $(this_).parent().find('ul').html(content);
    } else {
        layer.msg("查询失败!")
    }

    $(this_).parent().find('ul').show();
}

//点击选择学段／年级／科目
function filterByDrownId(_this, name,flag) {
    var id = $(_this).attr('data-tCode');
    $(_this).parent().parent().find('h4').html(name);
    $(_this).parent().parent().find('h4').attr('tCode', id);
    $(_this).parent().hide();
    if(flag == 0){
        if(id == ""){
            //如果学段选择全部，则将年级科目也置成全部
            currentStageCode = "";
            $('#grade').html("全部");
            $('#grade').attr('tCode', "");
            $('#subject').html("全部");
            $('#subject').attr('tCode', "");
            $(_this).parent().parent().parent().siblings().find('ul h4').attr('data-tCode',"");
        }else {
            currentStageCode = id.substring(0, 2);
        }

    }
}

//查看方式切换
function lookType(this_, flag) {
    if ($(this_).hasClass("homework_active")) {
        //如果已选中，则不做处理
    } else {
        $(this_).addClass("homework_active")
        $(this_).siblings().removeClass("homework_active")
        if (flag == 1) {
            dateMonth = '6';
        } else {
            dateMonth = '12';
        }
        selectHwData();
    }
}

//切换作业类型
function changeHomeworkType(this_, flag) {
    homeworkType = flag;
    $(this_).find('img').attr('src', "images/checked.png");
    $(this_).siblings().find('img').attr('src', "images/check.png");
    if(flag == 1){
        $('.homewor_small_selecet ul li').eq(1).hide();
        $('.homewor_small_selecet ul li').eq(2).hide();
        $('.homewor_small_selecet ul li').eq(3).hide();
    }else {

        $('.homewor_small_selecet ul li').eq(1).show();
        $('.homewor_small_selecet ul li').eq(2).show();
        $('.homewor_small_selecet ul li').eq(3).show();
    }


    selectHwData();
}

//作业统计接口实现
function selectHwData() {
    //获取筛选条件
    stage = $("#stage").html();
    grade = $("#grade").html();
    subject = $("#subject").html();

    var time = $('#date_input').val();
    if (time != "" && time != undefined) {
        beginTime = time.substring(0, 10);
        endTime = time.substring(13, time.length);
    }

    currentSchoolId = $("#school").attr('school-id');
    if (currentSchoolId == "") {
        currentSchoolId = localStorage.schoolList
        currentSchool = "全部";
    }

    if (currentSchoolId == "-1") {
        currentSchoolId = "";
    }

    var params = {
        'homeworkType': homeworkType,
        'schoolId': currentSchoolId,
        'dateMonth': dateMonth,
        'beginTime': beginTime,
        'endTime': endTime,
        'paperSubject': subject,
        'paperClass': grade,
        'paperStage': stage
    };
    $.ajax({
        type: "POST",
        url: global.hw_total,
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(params),
        success: function (e) {
            if (e.code = 200) {
                var data = e.data;
                if (data != undefined) {

                    var schoolComparsion = data.schoolComparsion;//校区对比数据

                    var commitAll;//总提交量
                    var publishAll;//总用户量(总布置次数)
                    var reachAll;//总送达人次
                    var replyAll;//总批复量

                    if (homeworkType == "0") {//全部
                        $('#reply').show();
                        $('.normal').hide();
                        $('.all').show();
                        $('#correctRateAll').show();
                        $('#correctRateAll').css('float', 'right');

                        var resultCommit = data.resultCommit; //提交率
                        var resultPublish = data.resultPublish;//用户量
                        var resultReply = data.resultReply;//批复量

                        /*用户量数据处理*/
                        publishAll = resultPublish.publishAll;//总用户量
                        var publishEAll = resultPublish.publishEAll;//电子作业数量
                        var publishEAllRate = resultPublish.publishEAllRate;//电子作业率
                        reachAll = resultPublish.reachAll;//总送达人次
                        var normalRate = (1 - publishEAllRate) * 100;//手动作业率
                        var normalAll = publishAll - publishEAll;//手动作业用户量

                        $('#publish h1 i').html(publishAll + "次");
                        $('#publish h1 span').html("(总送达" + reachAll + "人次)");
                        $('#publish .all span').eq(0).html(normalRate + "%(" + normalAll + "条)");
                        $('#publish .all span').eq(1).html((publishEAllRate * 100) + "%(" + publishEAll + "条)");

                        /*批复量数据处理*/
                        replyAll = resultReply.replyAll;//总批复量
                        var replyAllRate = resultReply.replyAllRate;//总批复率
                        var replyEAll = resultReply.replyEAll;//电子作业批复量
                        var replyEAllRate = resultReply.replyEAllRate;//电子普通作业批复率
                        var replyNomal = replyAll - replyEAll;//普通作业批复量
                        var replyNomalRate = (1 - replyEAllRate) * 100;// 普通作业批复率

                        $('#reply h1 i').html(replyAllRate * 100 + "%");
                        $('#reply h1 span').html("("+replyAll + "条)");
                        $('#reply .all span').eq(0).html(replyNomalRate + "%(" + replyEAll + "条)");
                        $('#reply .all span').eq(1).html((replyEAllRate * 100) + "%(" + replyNomal + "条)");

                        /*提交率数据处理*/
                        commitAll = resultCommit.commitAll;//总提交量
                        var commitAllRate = resultCommit.commitAllRate;//总提交率
                        var commitEAll = resultCommit.commitEAll;// 电子作业提交量
                        var commitEAllRate = resultCommit.commitEAllRate;// 电子作业提交率
                        var commitNormal = commitAll - commitEAll;//普通作业提交量
                        var commitNormalRate = (1 - commitEAllRate) * 100;//普通作业提交率

                        $('#commit h1 i').html(commitAllRate * 100 + "%");
                        $('#commit h1 span').html("("+commitAll + "条)");
                        $('#commit .all span').eq(0).html(commitNormalRate + "%(" + commitNormal + "条)");
                        $('#commit .all span').eq(1).html((commitEAllRate * 100) + "%(" + commitEAll + "条)");
                    } else if (homeworkType == "1") {//手动
                        $('#reply').show();
                        $('.normal').show();
                        $('.all').hide();
                        $('#correctRateAll').css('float', 'right');
                        $('#correctRateAll').hide();

                        var totalAll = data.totalAll;//总布置数
                        var publishAudio = data.publishAudio;//总布置语音数
                        var publishAudioRate = parseInt(parseFloat((publishAudio/totalAll))*100);//总布置语音率
                        var publishPicture = data.publishPicture;//总布置图片数
                        var publishPictureRate = parseInt(parseFloat((publishPicture/totalAll))*100);//总布置图片率

                        $('#publish h1 i').html(totalAll + "次");
                        $('#publish h1 span').html("(总送达" + reachAll + "人次)");
                        $('#publish .normal span').eq(0).html(publishAudioRate + "%(" + publishAudio + "条)");
                        $('#publish .normal span').eq(1).html((publishPictureRate) + "%(" + publishPicture + "条)");


                        replyAll = data.replyAll;//总批复数
                        var replyAllRate = parseInt(parseFloat((replyAll/totalAll))*100);//总批复率
                        var replyAudio = data.replyAudio;//总批复语音数
                        var replyAudioRate = parseInt(parseFloat((replyAudio/replyAll))*100);//总批复语音率
                        var replyPicture = data.replyPicture;//总批复图片数
                        var replyPictureRate = parseInt(parseFloat((replyPicture/replyAll))*100);//总批复图片率

                        $('#reply h1 i').html(replyAllRate + "%");
                        $('#reply h1 span').html("("+replyAll + "条)");
                        $('#reply .normal span').eq(0).html(replyAudioRate + "%(" + replyAudio + "条)");
                        $('#reply .normal span').eq(1).html(replyPictureRate + "%(" + replyPicture + "条)");


                        commitAll = data.commitAll;//总提交数
                        var commitAllRate = parseInt(parseFloat((commitAll/totalAll))*100);//总提交率
                        var commitAudio = data.commitAudio;//总提交语音数
                        var commitAudioRate = parseInt(parseFloat((commitAudio/commitAll))*100);//总提交语音率
                        var commitPicture = data.commitPicture;//总提交图片数
                        var commitPictureRate = parseInt(parseFloat((commitPicture/commitAll))*100);//总提交图片率

                        $('#commit h1 i').html(commitAllRate + "%");
                        $('#commit h1 span').html("("+commitAll + "条)");
                        $('#commit .normal span').eq(0).html(commitAudioRate + "%(" + commitAudio + "条)");
                        $('#commit .normal span').eq(1).html(commitPictureRate + "%(" + commitPicture + "条)");

                    } else if (homeworkType == "2") {//电子
                        $('#reply').hide();
                        $('.all').hide();
                        $('.normal').hide();
                        $('#correctRateAll').show();
                        $('#correctRateAll').css('float', 'left');
                        commitAll = data.commitAll;//总提交数
                        publishAll = data.publishAll;//总布置次数
                        reachAll = data.reachAll;//总送达人次
                        var commitAllRate = parseInt(parseFloat((commitAll/reachAll)) * 100);
                        $('#publish h1 i').html(publishAll+"次");
                        $('#publish span').html("(总送达" + reachAll + "人次)");

                        $('#commit h1 i').html(commitAllRate + "%");
                        $('#commit span').html("("+commitAll + "条)");
                    }


                    /*总正确率数据处理*/


                    /*校区对比数据展示*/
                    $('#schoolComparsion li').remove();
                    var str = '<li class="homework_list_title "><span>校区</span><span>布置次数</span><span>送达人数</span><span>提交率</span><span>批复率</span><span>正确率</span><span>操作</span></li>';
                    $('#schoolComparsion').append(str);
                    for (var i = 0; i < schoolComparsion.length; i++) {

                        var schoolName = schoolComparsion[i].schoolName;//校区
                        var schoolId = schoolComparsion[i].schoolId;//校区id
                        var replyRate = schoolComparsion[i].replyRate;//批复率
                        var commitCount = schoolComparsion[i].commitCount;//提交人数
                        var commitRate = schoolComparsion[i].commitRate;//提交率
                        var publishCount = schoolComparsion[i].publishCount;//布置次数
                        var correctRate = schoolComparsion[i].correctRate;//正确率
                        var reachCount = schoolComparsion[i].reachCount;//送达人数
                        var html_ = '<li><span title="'+schoolName+'">' + schoolName + '</span><span>' + publishCount + '</span><span>' + reachCount + '</span><span>' + commitRate + '</span><span>' + replyRate + '</span><span>' + correctRate + '</span><span >' +
                            '<a href="#/detail" onclick="lookHwDetails(this,'+schoolId+')" class="homework_operation">查看明细</a></span></li>';
                        $('#schoolComparsion').append(html_);

                    }
                }

            }
        }
    })
}

//查看明细
function lookHwDetails(this_,schoolId) {
    var params = {
        'homeworkType': homeworkType,
        'schoolId': schoolId,
        'dateMonth': dateMonth,
        'beginTime': beginTime,
        'endTime': endTime,
        'paperSubject': subject,
        'paperClass': grade,
        'paperStage': stage
    };
    sessionStorage.homeworkDetailParams = JSON.stringify(params);
}



