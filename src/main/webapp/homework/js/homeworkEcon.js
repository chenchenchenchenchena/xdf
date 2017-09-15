/**
 * Created by xupingwei on 2017/9/12.
 */
$(function () {
    var stageType = "dict_tps_stage_info"; //学段
    var gradeType = "dict_tps_class_info"; //年级
    var subjectType = "dict_tps_subject_info"; //科目
    var stageList = [];
    var gradeList = [];
    var subjectList = [];
    var currentStage;
    var currentGrade;
    var currentSubject;


    $(document).on("touchstart", "#stage", function () {
        if (stageList == undefined || stageList.length == 0) {

            getDictionary(stageType);
        } else {
            dealClassData(stageList, stageType);
        }

    });
    $(document).on("touchstart", "#grade", function () {
        if (undefined == currentStage || currentStage == '') {
            layer.msg("请先选择学段");
        } else {
            currentStage.stageCode = currentStage.stageCode.substring(0, 2);
            if (gradeList == undefined || gradeList.length == 0) {

                getDictionary(gradeType);
            } else {
                dealClassData(gradeList, gradeType);
            }

        }

    });
    $(document).on("touchstart", "#subject", function () {

        if (subjectList == undefined || subjectList.length == 0) {

            getDictionary(subjectType);
        } else {
            dealClassData(subjectList, subjectType);
        }
    });
    function getDictionary(type) {
        var type = type;
        var reqData = {
            'tableName': type//年级
        };
        ajaxRequest('POST', url.t_dictionary, reqData, function (e) {
            if (e.code == 200) {
                stageList = [];
                subjectList = [];
                gradeList = [];
                var tabTypes = e.data;
                if (undefined == tabTypes || tabTypes.length <= 0) {
                    layer.msg("暂无数据");
                    return;
                }
                if (type == stageType) {
                    stageList = tabTypes;
                } else if (type == gradeType) {
                    gradeList = tabTypes;
                }
                if (type == subjectType) {
                    subjectList = tabTypes;
                }
                dealClassData(tabTypes,type);

            } else {
                $('.listOne').hide();
                $('.listTwo').hide();
                $('.listThree').hide();
            }
        });
    }

    function dealClassData(tabTypes, type) {

        var tabStr = "";
        for (var i = 0; i < tabTypes.length; i++) {
            //将获取的tCode保存
            if (type == stageType) {
                tabStr += "<li tCode='" + tabTypes[i].tCode + "' tName='" + tabTypes[i].tName + "'>" + tabTypes[i].tName + "</li>";
            } else if (type == gradeType) {
                if (tabTypes[i].tCode.indexOf(currentStage.stageCode) >= 0) {
                    tabStr += "<li tCode='" + tabTypes[i].tCode + "' tName='" + tabTypes[i].tName + "'>" + tabTypes[i].tName + "</li>";
                }
            } else if (type == subjectType) {
                tabStr += "<li tCode='" + tabTypes[i].tCode + "' tName='" + tabTypes[i].tName + "'>" + tabTypes[i].tName + "</li>";
            }
        }

        if (type == stageType) {
            $('.listOne').html(tabStr);
            $('.listOne').show();
            $('.listTwo').hide();
            $('.listThree').hide();
        } else if (type == gradeType) {
            $('.listTwo').html(tabStr);
            if ($('.listTwo').find('li').length == 0) {
                layer.msg("暂无数据");
                $('.listOne').hide();
                $('.listTwo').hide();
                $('.listThree').hide();
            } else {
                $('.listOne').hide();
                $('.listTwo').show();
                $('.listThree').hide();
            }
        } else if (type == subjectType) {
            $('.listThree').html(tabStr);
            $('.listOne').hide();
            $('.listTwo').hide();
            $('.listThree').show();
        }
    }

    $(document).on("touchstart", ".listOne li", function () {
        $('.listOne').hide();
        $('.listTwo').hide();
        $('.listThree').hide();
        $(this).addClass("active").siblings().removeClass("active");
        currentStage = {'stageCode': $(this).attr("tCode"), 'stageName': $(this).attr("tName")};
        $(".searchE span").eq(0).html($(this).html());
        $(".searchE span").eq(0).css("color", "#000");
        $('#grade').html("年级");
        $('#grade').css("color", "#a9a9a9");
        currentGrade = "";
    });
    $(document).on("touchstart", ".listTwo li", function () {
        $('.listOne').hide();
        $('.listTwo').hide();
        $('.listThree').hide();
        $(this).addClass("active").siblings().removeClass("active");
        $(".searchE span").eq(1).html($(this).html());
        $(".searchE span").eq(1).css("color", "#000");
        currentGrade = {'gradeCode': $(this).attr("tCode"), 'gradeName': $(this).attr("tName")};
    });
    $(document).on("touchstart", ".listThree li", function () {
        $('.listOne').hide();
        $('.listTwo').hide();
        $('.listThree').hide();
        $(this).addClass("active").siblings().removeClass("active");
        $(".searchE span").eq(2).html($(this).html());
        $(".searchE span").eq(2).css("color", "#000");
        currentSubject = {'subjectCode': $(this).attr("tCode"), 'subjectName': $(this).attr("tName")};
    });
    //点击搜素
    $('.sou').click(function () {
        $('.listOne').hide();
        $('.listTwo').hide();
        $('.listThree').hide();
        // if ($('.searchE input').val() == "") {
        //     layer.msg("请先填写试卷内容");
        //     return;
        // }
        if (undefined == currentStage || currentStage == "") {
            layer.msg("请先选择学段");
            return;
        }
        if (undefined == currentGrade || currentGrade == "") {
            layer.msg("请先选择年级");
            return;
        }
        if (undefined == currentSubject || currentSubject == "") {
            layer.msg("请先选择科目");
            return;
        }
        var params = {
            'schNum': "4688",
            'paperClass': currentGrade.gradeCode,
            'paperSubject': currentSubject.subjectCode,
            'paperName': $('.searchE input').val()
        };

        // var url = "http://10.200.80.120:8080/xdfdtmanager/teacherData/queryExcellentHomeWorkContent.do";
        // var url = "http://dt.staff.xdf.cn/xdfdtmanager/teacherData/queryExcellentHomeWorkContent.do";
        var url = homework_s.t_getExcellent;
        ajaxRequest("POST", url, JSON.stringify(params), function (e) {
            if (e.result) {
                var dataList = e.data;
                if (dataList != undefined && dataList.length > 0) {
                    hideEmptyHtml();

                    var strHtml_ = "";
                    for (var i = 0; i < dataList.length; i++) {
                        strHtml_ += "<li><h3 paperId='" + dataList[i].paperID + "'>" + dataList[i].paperName + "</h3>" +
                            "<div class='sInfo'>" +
                            "<div><span>学段：</span><span class='stage-'>" + currentStage.stageName + "</span></div>" +
                            "<div><span>年级：</span><span class='grade-'>" + currentGrade.gradeName + "</span></div>" +
                            "<div><span>学科：</span><span class='subject-'>" + currentSubject.subjectName + "</span></div>" +
                            "<div><span>发布人：</span><span>" + localStorage.teacherName + "</span></div></div>" +
                            "<img src='images/yu.png'/></li>";
                    }
                    $('.searchCon ul').html(strHtml_);
                } else {
                    showEmptyHtml();
                    layer.msg(e.message);
                }
            } else {
                showEmptyHtml();
                layer.msg(e.message);
            }
        });
    });
    function showEmptyHtml() {
        $('.searchCon').hide();
        $('.searchEmpty').show();
        $('.eBtn').hide();
    }

    function hideEmptyHtml() {
        $('.searchCon').show();
        $('.searchEmpty').hide();
        $('.eBtn').show();
    }

    var paperUrl = "";
    var stageName = "";
    var gradeName = "";
    var subjectName = "";
    //选择作业列表点击事件
    $(document).on("touchstart", ".searchCon ul li", function () {
        if ($(this).find('img').attr('src') == "images/yu2.png") {
            $(this).find('img').attr('src', "images/yu.png");
        } else {
            $('.searchCon ul li').find('img').attr('src', "images/yu.png");
            $(this).find('img').attr('src', "images/yu2.png");
            ;
            paperUrl = $(this).find('h3').attr("paperId");
            stageName = $(this).find('.stage-').html();
            gradeName = $(this).find('.grade-').html();
            subjectName = $(this).find('.subject-').html();
        }
    });

    //点击筛选作业内容按钮
    $(".eBtn").click(function () {
        var checkNum = 0;
        var contentName = "";
        for (var i = 0; i < $(".searchCon li").length; i++) {
            if ($(".searchCon li").eq(i).find("img").attr('src') == "images/yu2.png") {
                contentName += $(".searchCon li").eq(i).find("h3").html() + ";";
                checkNum++;
            }
        }
        contentName = contentName.substring(0, contentName.length - 1);
        console.log(contentName);
        console.log(checkNum);
        if (checkNum == 0) {
            layer.msg("请选择作业内容");
        } else {
            sessionStorage.contentName = contentName;
            console.log(sessionStorage.contentName);
            location.href = "AssignmentE.html";
            sessionStorage.paperId = "32273901-279E-450F-AAFD-BB96E292AF26";
            sessionStorage.paperUrl = "http://tps.staff.xdf.cn/gwots/testprocess/weixin/static/testing/index?paperId=" + sessionStorage.paperId;
            sessionStorage.stageName = stageName;
            sessionStorage.gradeName = stageName;
            sessionStorage.subjectName = stageName;
        }
    })

});