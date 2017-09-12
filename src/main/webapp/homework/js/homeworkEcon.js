/**
 * Created by xupingwei on 2017/9/12.
 */
$(function () {
    var gradeType = "dict_tps_class_info"; //年级
    var stageType = "dict_tps_stage_info"; //学段
    var subject = "dict_tps_subject_info"; //科目
    $(document).on("touchstart", "#grade", function () {

        getDictionary("dict_tps_class_info");
    });
    $(document).on("touchstart", "#stage", function () {

        getDictionary("dict_tps_stage_info");
    });
    $(document).on("touchstart", "#subject", function () {

        getDictionary("dict_tps_subject_info");
    });
    function getDictionary(type) {
        var type = type;
        var reqData = {
            'tableName': type//年级
        };
        ajaxRequest('POST', url.t_dictionary, reqData, function (e) {
            if (e.code == 200) {
                var tabTypes = e.data;
                var tabStr = "";
                for (var i = 0; i < tabTypes.length; i++) {
                    if (tabTypes[i].tCode == currentType) {
                        tabStr += "<li class='tab-active' tCode='" + tabTypes[i].tCode + "'>" + tabTypes[i].tName + "</li>";
                        checkedTypeName = tabTypes[i].tName;
                    } else {
                        tabStr += "<li tCode='" + tabTypes[i].tCode + "'>" + tabTypes[i].tName + "</li>";
                    }

                }

                $('.tab-title').html(tabStr);
            }
        });
    }

});