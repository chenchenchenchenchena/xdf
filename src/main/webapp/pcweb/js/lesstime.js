/* 课时统计 */
require(['jquery-1.11.0.min'], function () {
    require(['layer'], function () {
        //layer.msg('1261645')

        $('.homewor_big_selecet .homework_begin').onblur = function(){
            beginTime = $('.homewor_big_selecet .homework_begin').val();
        }
        $('.homewor_big_selecet .homework_end').onblur = function(){
            endTime = $('.homewor_big_selecet .homework_end').val();
        }

        //$('.homewor_big_selecet .homework_begin').
    });
});


//获取校区
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
            async: true,//同步
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
function showSchoolList(json){
    if (json.code == "200") {
        $(".homework_samll_one ul").html("");
        var schoolList = json.data;
        var cityContent = "<li onclick='filterByCityId(this, \"" + "" + "\")' ><span>全部</span></li>";
        for (var i = 0; i < schoolList.length; i++) {
            var schoolId = schoolList[i].tCode;
            cityContent += "<li onclick='filterByCityId(this, \"" + schoolList[i].tName + "\")' data-schoolId='"+schoolId+"' ><span>" + schoolList[i].tName + "</span></li>";

        }
        $(".homework_samll_one ul").html(cityContent);
    } else {
        layer.msg("查询失败!")
    }

    $('.homework_samll_one ul').show();
}

var currentCity;
var currentCityId;
//点击选择校区
function filterByCityId(_this, cityId) {
    currentCity = cityId;
    currentCityId = _this.attr('data-schoolId');
    if(currentCity == ""){
        currentCity = "全部";
    }
    $(".homework_samll_one h4").html(currentCity);
    $('.homework_samll_one ul').hide();
}


var beginTime = '';
var endTime = '';

//选择日期
function selectDate(){
    $('.homewor_big_selecet span').hide();
    $('.homewor_big_selecet .homework_begin').show();
    $('.homewor_big_selecet .homework_end').show();
}
function getDate(){
    if(beginTime != "" && endTime != ""){
        var time = beginTime+"~"+endTime;
        $('.homewor_big_selecet span').html(time)
    }

}
function SelectData(){
    if(beginTime == "" && endTime == ""){
        //layer.msg("请先选择日期");
        return false;
    }
    var table = {
        "schoolId": currentCityId,
        'beginDate':beginTime,
        'endDate':endTime
    };
    $.ajax({
        type: "POST",
        url: url_o + 'backEndClassHourCount/queryClassHourCount.do',
        async: true,//同步
        dataType: 'json',
        data: table,
        success: function (e) {
            sessionStorage.schoolList = JSON.stringify(e);
            showSchoolList(e)
        }
    })
}


