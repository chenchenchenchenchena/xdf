/* 作业统计 */

/*默认筛选条件*/
var dateMonth = '6';// 默认半年
var stage = "";//默认全部
var grade = "";//默认全部
var subject = "";//默认全部
var currentSchoolId = "";//默认全部
var beginTime = "";//默认全部
var endTime = "";//默认全部


/*默认导航选中样式*/
$('.homework_Statistics div:nth-child(even)').css('float', 'right');
$('.homework_list li:nth-child(odd)').css('background', '#f5fbfa');

require(['jquery-1.11.0.min'], function () {
    require(['jquery-ui.min'], function () {
        require(['layer'], function () {
            laydate.render({
                elem: '#date_input',
                range: true //指定元素
            });

            ////查询时间，默认初始值
            //beginTime = "2017-01-01";
            //endTime = new Date().Format("yyyy-MM-dd");
            //$('#date_input').val(beginTime + " - " + endTime);

            selectHwData();
            //筛选"确定"按钮点击事件
            $('#select-btn').click(function(){
                stage = $("#stage").html();
                grade = $("#grade").html();
                subject = $("#subject").html();
                currentSchoolId = $("#school").attr('school-id');
                var time = $('#date_input').val();
                if(time != "" || time != undefined){
                    beginTime = time.substring(0,10);
                    endTime = time.substring(13,time.length);
                }
                selectHwData();
            });

        });
    });
});

//校区展示
function getSchoolList(){
    var schoolList = localStorage.schoolList;
}

//获取学段／年级／科目
function getSelectList(this_, type, flag) {
    if (sessionStorage.schoolList) {
        var json;
        switch (flag) {
            case 1:
                json = JSON.parse(sessionStorage.stageList);
                break;
            case 2:
                json = JSON.parse(sessionStorage.gradelList);
                break;
            case 3:
                json = JSON.parse(sessionStorage.subjectList);
                break;
        }

        showDrownList(json, this_);
    } else {
        var table = {
            "tableName": type
        };
        $.ajax({
            type: "POST",
            url: url_o + 'dict/getDictListByTableName.do',
            async: true,//同步
            dataType: 'json',
            data: table,
            success: function (e) {
                switch (flag) {
                    case 1:
                        sessionStorage.stageList = JSON.stringify(e);
                        break;
                    case 2:
                        sessionStorage.gradelList = JSON.stringify(e);
                        break;
                    case 3:
                        sessionStorage.subjectList = JSON.stringify(e);
                        break;
                }
                showDrownList(e, this_);
            }
        })
    }

}

//筛选学段／年级／科目列表显示
function showDrownList(json, this_) {
    if (json.code == "200") {
        $(this_).siblings().find('ul').html("");
        var list = json.data;
        var content = "<li onclick='filterByDrownId(this, \"" + "全部" + "\")' data-tCode=''><span>全部</span></li>";
        for (var i = 0; i < list.length; i++) {
            var tCode = list[i].tCode;
            content += "<li onclick='filterByDrownId(this, \"" + list[i].tName + "\")' data-tCode='" + tCode + "' ><span>" + list[i].tName + "</span></li>";

        }
        $(this_).parent().find('ul').html(content);
    } else {
        layer.msg("查询失败!")
    }

    $(this_).parent().find('ul').show();
}

//点击选择学段／年级／科目
function filterByDrownId(_this, name) {
    var id = $(_this).attr('data-tCode');
    $(_this).parent().parent().find('h4').html(name);
    $(_this).parent().parent().find('h4').attr('tCode', id);
    $(_this).parent().hide();
}

//查看方式切换
function lookType(this_,flag){
    if($(this_).hasClass("homework_active")){
        //如果已选中，则不做处理
    }else {
        $(this_).addClass("homework_active")
        $(this_).siblings().removeClass("homework_active")
        if(flag == 1){
            dateMonth = '6';
        }else {
            dateMonth = '12';
        }
        selectHwData();
    }
}

//作业统计接口实现
function selectHwData() {
    var params = {
        'dateMonth': dateMonth
    };
    $.ajax({
        type: "POST",
        url: url_o + '/backEndHomework/queryHomeWorkTotal.do',
        async: true,//同步
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(params),
        success: function (e) {
            if(e.code = 200){
                var data = e.data;
                if(data != undefined){
                    var resultCommit = data.resultCommit; //总提交率
                    var resultPublish = data.resultPublish;//总用户量
                    var resultReply = data.resultReply;//总批复量
                    var schoolComparsion = data.schoolComparsion;//校区对比数据

                    /*用户量数据处理*/
                    var publishAll = resultPublish.publishAll;//总用户量
                    var publishEAll = resultPublish.publishEAll;//电子作业数量
                    var publishEAllRate = resultPublish.publishEAllRate;//电子作业率
                    var reachAll = resultPublish.reachAll;//总送达人次
                    var normalRate = (1- publishEAllRate)*100;//手动作业率
                    var normalAll = publishAll - publishEAll;//手动作业用户量

                    $('#publish h1').html(publishAll);
                    $('#publish span').html("(总送达"+reachAll+"人次)");
                    $('#publish p span').eq(0).html(normalRate+"%（"+normalAll+"条)");
                    $('#publish p span').eq(1).html((publishEAllRate*100) + "%（"+publishEAll+"条)");

                    /*批复量数据处理*/
                    var replyAll = resultReply.replyAll;//总批复量
                    var replyAllRate = resultReply.replyAllRate;//总批复率
                    var replyEAll = resultReply.replyEAll;//电子作业批复量
                    var replyEAllRate = resultReply.replyEAllRate;//电子普通作业批复率
                    var replyNomal = replyAll - replyEAll;//普通作业批复量
                    var replyNomalRate = (1 - replyEAllRate) * 100;// 普通作业批复率

                    $('#reply h1').html(replyAllRate*100+"%");
                    $('#reply span').html(replyAll+"条");
                    $('#reply p span').eq(0).html(replyNomalRate+"%（"+replyEAll+"条)");
                    $('#reply p span').eq(1).html((replyEAllRate*100) + "%（"+replyNomal+"条)");

                    /*提交率数据处理*/
                    var commitAll = resultCommit.commitAll;//总提交量
                    var commitAllRate = resultCommit.commitAllRate;//总提交率
                    var commitEAll = resultCommit.commitEAll;// 电子作业提交量
                    var commitEAllRate = resultCommit.commitEAllRate;// 电子作业提交率
                    var commitNormal = commitAll - commitEAll;//普通作业提交量
                    var commitNormalRate = (1 - commitEAllRate) * 100;//普通作业提交率

                    $('#commit h1').html(commitAllRate*100+"%");
                    $('#commit span').html(commitAll+"条");
                    $('#commit p span').eq(0).html(commitNormalRate+"%（"+commitNormal+"条)");
                    $('#commit p span').eq(1).html((commitEAllRate*100) + "%（"+commitEAll+"条)");

                    /*总正确率数据处理*/


                    /*校区对比数据展示*/
                    $('#schoolComparsion li').remove();
                    var str = '<li class="homework_list_title"><span>校区</span><span>布置次数</span><span>送达人数</span><span>提交率</span><span>批复率</span><span>正确率</span><span>操作</span></li>';
                    $('#schoolComparsion').append(str);
                    for(var i = 0;i<schoolComparsion.length;i++){

                        var schoolName = schoolComparsion[i].schoolName;//校区
                        var replyRate = schoolComparsion[i].replyRate;//批复率
                        var commitCount = schoolComparsion[i].commitCount;//提交人数
                        var commitRate = schoolComparsion[i].commitRate;//提交率
                        var publishCount = schoolComparsion[i].publishCount;//布置次数
                        var correctRate = schoolComparsion[i].correctRate;//正确率
                        var reachCount = schoolComparsion[i].reachCount;//送达人数
                        var html_ = '<li><span>'+schoolName+'</span><span>'+publishCount+'</span><span>'+reachCount+'</span><span>'+commitRate+'</span><span>'+replyRate+'</span><span>'+correctRate+'</span><span >' +
                            '<a href="#/detail" class="homework_operation">查看明细</a></span></li>';
                        $('#schoolComparsion').append(html_);

                    }
                }

            }
        }
    })
}



