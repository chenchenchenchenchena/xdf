/**
 * Created by xupingwei on 2017/9/12.
 */
$(function () {
    var stageType = "dict_tps_stage_info"; //学段
    var gradeType = "dict_tps_class_info"; //年级
    var subjectType = "dict_tps_subject_info"; //科目
    var stageList = [];
    var subjectList = [];
    var currentCode;


    $(document).on("touchstart", "#stage", function () {

        getDictionary(stageType);
    });
    $(document).on("touchstart", "#grade", function () {
        currentCode = currentCode.substring(0, 2);
        if (undefined == currentCode || currentCode == '') {
            layer.msg("请先选择学段");
        } else {

            getDictionary(gradeType);
        }
    });
    $(document).on("touchstart", "#subject", function () {

        getDictionary(subjectType);
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
                $('.listOne').find('li').remove();
                $('.listTwo').find('li').remove();
                $('.listThree').find('li').remove();
                var tabTypes = e.data;
                var tabStr = "";
                for (var i = 0; i < tabTypes.length; i++) {
                    //将获取的tCode保存
                    if (type == gradeType) {
                        if (tabTypes[i].tCode.indexOf(currentCode) >= 0) {
                            tabStr += "<li tCode='" + tabTypes[i].tCode + "'>" + tabTypes[i].tName + "</li>";
                        }

                    } else if (type == stageType) {
                        stageList.push(tabTypes[i].tCode);
                        tabStr += "<li tCode='" + tabTypes[i].tCode + "'>" + tabTypes[i].tName + "</li>";
                    } else if (type == subjectType) {
                        subjectList.push(tabTypes[i].tCode);
                        tabStr += "<li tCode='" + tabTypes[i].tCode + "'>" + tabTypes[i].tName + "</li>";
                    }
                }

                if (type == stageType) {
                    $('.listOne').append(tabStr);
                } else if (type == gradeType) {
                    $('.listTwo').append(tabStr);
                } else if (type == subjectType) {
                    $('.listThree').append(tabStr);
                }

            }
        });
    }

    // //点击学段
    $("#stage").click(function () {
        $(".list").eq($(this).index() - 1).toggle().siblings().hide();
    });
    //点击年级
    $("#grade").click(function () {
        $(".list").eq($(this).index() - 1).toggle().siblings().hide();
    });
    //点击科目
    $("#subject").click(function () {
        $(".list").eq($(this).index() - 1).toggle().siblings().hide();
    });
    $(document).on("touchstart", ".listOne li", function () {
        $(this).addClass("active").siblings().removeClass("active");
        currentCode = $(this).attr("tCode");
        $(".searchE span").eq(0).html($(this).html());
        $(".searchE span").eq(0).css("color", "#000");
    });
    $(document).on("touchstart", ".listTwo li", function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".searchE span").eq(1).html($(this).html());
        $(".searchE span").eq(1).css("color", "#000");
    });
    $(document).on("touchstart", ".listThree li", function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".searchE span").eq(2).html($(this).html());
        $(".searchE span").eq(2).css("color", "#000");
    });
    //点击搜素
    $('.sou').click(function () {
        var params = {
            'schoolId':"4688",
            'paperClass':"",
            'paperSubject':"",
            'paperName':""
        };
        ajaxRequest("POST",homework_s.t_getExcellent,params,function(){

        });
    });
});