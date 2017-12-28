/**
 * Created by xupingwei on 2017/9/12.
 */
$(function () {
    var paperIdSub = GetRequest("paperId");//修改作业跳转过来的
    var stageType = "dict_tps_stage_info"; //学段
    var gradeType = "dict_tps_class_info"; //年级
    var subjectType = "dict_tps_subject_info"; //科目
    var stageList = [];
    var gradeList = [];
    var subjectList = [];
    var currentStage = "";
    var currentGrade = "";
    var currentSubject = "";


    var paperId = "";
    var paperTotalScore = "";
    var stageName = "";
    var gradeName = "";
    var subjectName = "";

    var pageNo = 1;
    var maxPage;
    var isLoading = false;
    var isEnd = false;


    var isModify = GetRequest("isModify");
    var Tcid = GetRequest("id");

    getDictionary(stageType);
    getDictionary(gradeType);
    getDictionary(subjectType);

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
                dealClassData(tabTypes, type);

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
        var paperContent = $('.searchE input').val();
        if (paperContent == "" && (undefined == currentStage || currentStage == "") && (undefined == currentGrade || currentGrade == "") && (undefined == currentSubject || currentSubject == "")) {
            layer.msg("至少输入一个条件");
            return false;
        }
        pageNo = 1;
        getHwList();
        isEnd = false;

    });

    /**
     * 加载作业列表
     */
    function getHwList() {
        if (isEnd || isLoading) {
            //表示已经加载完成
            return;
        }

        isLoading = true;
        var params = {
            'schNum': "4688",
            'paperClass': currentGrade.gradeCode,
            'paperSubject': currentSubject.subjectCode,
            'paperName': $('.searchE input').val(),
            'paperStage': currentStage.stageCode,
            'pageNo': pageNo
        };
        if(currentGrade.paperClass==undefined){
            params.paperClass = ''
        }
        if(currentGrade.paperSubject==undefined){
            params.paperSubject = ''
        }

        var url = homework_s.t_getExcellent;
        ajaxRequest("POST", url, JSON.stringify(params), function (e) {
            if (e.result) {
                var dataList = e.data;
                if (dataList != undefined && dataList.length > 0) {
                    hideEmptyHtml();
                    maxPage = e.maxPage;
                    // maxPage = 5;
                    var strHtml_ = "";
                    for (var i = 0; i < dataList.length; i++) {
                        var stageName_ ;
                        var gradeName_ ;
                        var subjectName_ ;
                        for (var i = 0; i < stageType.length; i++) {
                            if(stageType[i].tCode = dataList[i].paperStage){
                                stageName_ = stageType[i].tName;
                            }
                        }
                        for (var i = 0; i < gradeType.length; i++) {
                            if(gradeType[i].tCode = dataList[i].paperGrade){
                                gradeName_ = gradeType[i].tName;
                            }
                        }
                        for (var i = 0; i < subjectType.length; i++) {
                            if(subjectType[i].tCode = dataList[i].paperSubject){
                                subjectName_ = subjectType[i].tName;
                            }
                        }

                        if (undefined != paperIdSub && paperIdSub != "" && paperIdSub == dataList[i].paperID) {

                            strHtml_ += "<li><h3 paperTotalScore='" + dataList[i].paperTotalScore + "' paperId='" + dataList[i].paperID + "'>" + dataList[i].paperName + "</h3>" +
                                "<div class='sInfo'>" +
                                "<div><span>学段：</span><span class='stage-'>" + stageName_ + "</span></div>" +
                                "<div><span>年级：</span><span class='grade-'>" + gradeName_ + "</span></div>" +
                                "<div><span>学科：</span><span class='subject-'>" + subjectName_ + "</span></div>" +
                                "<div><span>发布人：</span><span>" + dataList[i].creator + "</span></div></div>" +
                                "<img src='images/yu2.png'/></li>";
                            paperId = dataList[i].paperID;
                            stageName = stageName_;
                            gradeName = gradeName_;
                            subjectName = subjectName_;


                        } else {
                            strHtml_ += "<li><h3 paperTotalScore='" + dataList[i].paperTotalScore + "' paperId='" + dataList[i].paperID + "'>" + dataList[i].paperName + "</h3>" +
                                "<div class='sInfo'>" +
                                "<div><span>学段：</span><span class='stage-'>" + stageName_ + "</span></div>" +
                                "<div><span>年级：</span><span class='grade-'>" + gradeName_ + "</span></div>" +
                                "<div><span>学科：</span><span class='subject-'>" + subjectName_ + "</span></div>" +
                                "<div><span>发布人：</span><span>" + dataList[i].creator + "</span></div></div>" +
                                "<img src='images/yu.png'/></li>";
                        }

                    }
                    if (pageNo == 1) {
                        $('.searchCon ul').find('li').remove();
                    }

                    $('.searchCon ul').append(strHtml_);
                    if (pageNo < maxPage) {
                        isEnd = false;
                        pageNo++;
                    } else {
                        isEnd = true;
                    }
                    isLoading = false;
                } else {
                    isEnd = true;
                    if (pageNo == 1) {
                        showEmptyHtml();
                        layer.msg(e.message);
                    } else {

                        layer.msg("暂无数据");
                    }

                    isLoading = false;
                }
            } else {
                isLoading = false;
                showEmptyHtml();
                layer.msg(e.message);
            }
        });
    }

    /**
     * 监听滚动
     */
    $('.searchCon').scroll(function () {
        //已经滚动到上面的页面高度
        var scrollTop = $(this).scrollTop();
        //页面高度
        var scrollHeight = $('.searchCon ul').height();
        //浏览器窗口高度
        var windowHeight = $('.searchCon').height();
        //此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
        if (scrollTop + windowHeight >= scrollHeight) {
            getHwList();
        }
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

    //选择作业列表点击事件
    $(document).on("touchstart", ".searchCon ul li", function () {
        if ($(this).find('img').attr('src') == "images/yu2.png") {
            $(this).find('img').attr('src', "images/yu.png");
        } else {
            $('.searchCon ul li').find('img').attr('src', "images/yu.png");
            $(this).find('img').attr('src', "images/yu2.png");
            paperId = $(this).find('h3').attr("paperId");
            paperTotalScore = $(this).find('h3').attr("paperTotalScore");
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
                contentName += $(".searchCon li").eq(i).find("h3").html();
                checkNum++;
            }
        }
        var onlineUrl = 'dt.xdf.cn';
        var url_ = "";
        if (window.location.host == onlineUrl) {//正式环境
            url_ = "http://tps.xdf.cn";
        } else {//测试环境
            url_ = "http://tps.staff.xdf.cn";
        }
        // contentName = contentName.substring(0, contentName.length - 1);
        console.log(contentName);
        console.log(checkNum);
        if (checkNum == 0) {
            layer.msg("请选择作业内容");
        } else {
            sessionStorage.contentName = contentName;
            console.log(sessionStorage.contentName);
            location.href = "AssignmentE.html?isModify=" + isModify + "&id=" + Tcid + "&isUpdata=" + 1;
            sessionStorage.paperId = paperId;
            sessionStorage.paperUrl = url_ + "/gwots/testprocess/control/index?clientType=mobile&paperId=" + sessionStorage.paperId;
            sessionStorage.stageName = stageName;
            sessionStorage.gradeName = gradeName;
            sessionStorage.subjectName = subjectName;
            sessionStorage.paperTotalScore = paperTotalScore;
        }
    })

});