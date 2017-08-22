/**
 * Created by xupingwei on 2017/8/22.
 */


    //查询校区
var table = {
        "tableName": "dict_school_info"
    };
ajaxRequest("POST", url.s_select, table, selectData);
function selectData(e) {
    console.log(e);
    $(".select ul").html("");
    if (e.code == "200") {
        // for (var i = 0; i < e.data.length; i++) {
        //     var str = '<li data-value=' + e.data[i].tName + ' data-code=' + e.data[i].tCode + '>' + e.data[i].tName + '</li>';
        //     $(".select ul").append(str);
        // }
    }
}
