require(['jquery-1.11.0.min'], function () {
    require(['jquery-ui.min'], function () {
        require(['layer'], function () {
            require(['laydate'], function () {
                //layer.msg("1452");
                laydate.render({
                    elem: '#test1',
                    range: true //指定元素
                });
                SelectData();
            });
        });
    });
});

//时间筛选
function selectTime(){
    $('#select-time ul').show();
}
function timeClick(this_){

    $('#select-time h4').html(this_);
    $('#select-time ul').hide();
    SelectData();
}

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
        $("#select-school ul").html("");
        var schoolList = json.data;
        var cityContent = "<li onclick='filterByCityId(this, \"" + "" + "\")' ><span>全部</span></li>";
        for (var i = 0; i < schoolList.length; i++) {
            var schoolId = schoolList[i].tCode;
            cityContent += "<li onclick='filterByCityId(this, \"" + schoolList[i].tName + "\")' data-schoolId='"+schoolId+"' ><span>" + schoolList[i].tName + "</span></li>";

        }
        $("#select-school ul").html(cityContent);
    } else {
        layer.msg("查询失败!")
    }

    $('#select-school ul').show();
}

var currentCity;
var currentCityId;
//点击选择校区
function filterByCityId(_this, cityId) {
    currentCity = cityId;
    currentCityId = $(_this).attr('data-schoolId');
    if(currentCity == ""){
        currentCity = "全部";
    }
    $("#select-school h4").html(currentCity);
    $('#select-school ul').hide();
}


var seacherKey = "";
var masterTeacherFlag = 0;
var page = 1;
var pageSize = "15";

//筛选数据接口实现
function SelectData(){
    beginTime = "2017-10-01";
    endTime = "2017-11-01";
    currentCityId = "73"
    if(beginTime == "" && endTime == ""){
        //layer.msg("请先选择日期");
        return false;
    }
    var params = {
        "schoolId": currentCityId,
        'beginDate':beginTime,
        'endDate':endTime,
        'masterTeacherFlag':masterTeacherFlag,
        'teacherName':seacherKey,
        'nextPage':page,
        'pageSize':pageSize
    };
    $.ajax({
        type: "POST",
        url: url_o + 'backEndClassHourCount/queryClassTeacherList.do',
        async: true,//同步
        dataType: 'json',
        data: JSON.stringify(params),
        success: function (e) {
            var data = e.Data;
            if (data != undefined) {
                var list = data.data;
                if(list != undefined && list.length > 0 ){
                    $('.homework_list li').remove();

                    var str_th = '<li class="homework_list_title"><span>教师姓名</span><span>课时（h）</span><span>当月课时（h）</span></li>';
                    $('.homework_list').append(str_th);

                    for (var i = 0; i < list.length; i++){
                        var html_ = '<li><span>'+list[i].teacherName+'</span><span>'+list[i].lessonHours+'</span><span>'+list[i].monthHours+'</span></li>';
                        $('.homework_list').append(html_);
                    }
                }
            }
        }
    })
}