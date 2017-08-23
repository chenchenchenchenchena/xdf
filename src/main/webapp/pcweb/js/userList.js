/**
 * Created by xupingwei on 2017/8/22.
 */


    //查询校区
var table = {
        "tableName": "dict_school_info"
    };
ajaxRequest("POST", url.s_select, table, selectData);
function selectData(json) {
    console.log(json);
    if (json.code == "200") {
        var schoolList = json.data;
        var cityContent = "<a href='#' onclick='filterByCityId(this, \"\")' >全部</a>";
        //var cityContent = "";
        for (var i = 0; i < schoolList.length; i++) {
            var schoolId = schoolList[i].tCode;
            if (schoolId == "1") {
                cityContent += "<a href='# 'class='cur' " +
                    " >" + schoolList[i].tName + "</a>";
            } else {
                cityContent += "<a href='#' " +
                    " >" + schoolList[i].tName + "</a>";
            }
        }
        $(".xian-wid").html(cityContent);
        // initOpenAndShou1();
    } else {
        layer.msg("查询失败!", {icon: 5})
    }
}
