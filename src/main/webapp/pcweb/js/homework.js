/* 作业统计 */


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

            beginTime = "2017-01-01";
            endTime = new Date().Format("yyyy-MM-dd");
            $('#date_input').val(beginTime + " - " + endTime);
            selectHwData();
        });
    });
});

var stage = "全部";
var grade = "全部";
var subject = "全部";
var currentCity = "全部";
var stageId = "-1";
var gradeId = "-1";
var subjectId = "-1";
var currentCityId = "-1";

//获取校区/学段／年级／科目
function getSelectList(this_, type, flag) {
    if (sessionStorage.schoolList) {
        var json;
        switch (flag) {
            case 0:
                json = JSON.parse(sessionStorage.schoolList);
                break;
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
                    case 0:
                        sessionStorage.schoolList = JSON.stringify(e);
                        break;
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
//筛选校区/学段／年级／科目列表显示
function showDrownList(json, this_) {
    if (json.code == "200") {
        $(this_).siblings().find('ul').html("");
        var list = json.data;
        var content = "<li onclick='filterByDrownId(this, \"" + "" + "\")' ><span>全部</span></li>";
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

//点击选择校区/学段／年级／科目
function filterByDrownId(_this, name) {
    var id = $(_this).attr('data-tCode');
    $(_this).parent().parent().find('h4').html(name);
    $(_this).parent().parent().find('h4').attr('tCode', id);
    $(_this).parent().hide();
}

function selectHwData() {
    var params = {
        'dateMonth': "6"
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
                    var publishAll = resultPublish.resultPublish;//总用户量
                    var publishEAll = resultPublish.publishEAll;//电子作业数量
                    var publishEAllRate = resultPublish.publishEAllRate;//电子作业率
                    var reachAll = resultPublish.reachAll;//总送达人次
                    var normalRate = 1- publishEAllRate;//手动作业率

                    /*批复量数据处理*/
                    var replyAll = resultReply.replyAll;//
                    var replyAllRate = resultReply.replyAllRate;
                    var replyEAll = resultReply.replyEAll;
                    var replyEAllRate = resultReply.replyEAllRate;


                    /*提交率数据处理*/
                    var commitAll = resultCommit.commitAll;
                    var commitAllRate = resultCommit.commitAllRate;
                    var commitEAll = resultCommit.commitEAll;
                    var commitEAllRate = resultCommit.commitEAllRate;

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



