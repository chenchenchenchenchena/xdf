/* 课时统计 */
require(['jquery-1.11.0.min'], function () {
    require(['jquery-ui.min'], function () {
        require(['layer'], function () {
            laydate.render({
                elem: '#date_input',
                range: true //指定元素
            });
            SelectData();
        });
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
    currentCityId = $(_this).attr('data-schoolId');
    if(currentCity == ""){
        currentCity = "全部";
    }
    $(".homework_samll_one h4").html(currentCity);
    $('.homework_samll_one ul').hide();
}


var beginTime = '';
var endTime = '';

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
        'endDate':endTime
    };
    $.ajax({
        type: "POST",
        url: url_o + 'backEndClassHourCount/queryClassHourCount.do',
        async: true,//同步
        dataType: 'json',
        data: JSON.stringify(params),
        success: function (e) {
            var data = e.Data;
            if (data != undefined) {
                var masterTeacherTotal = data.masterTeacherTotal;
                var classTeacherTotal = data.classTeacherTotal;
                var total = parseInt(masterTeacherTotal)+parseInt(classTeacherTotal);
                $('#head_lesstime h1').html(classTeacherTotal);
                $('#master_lesstime h1').html(masterTeacherTotal);
                $('#teacher_lesstime h1').html(total);
                var list = data.data;
                if(list != undefined && list.length > 0 ){
                    $('.homework_list li').remove();

                    var str_th = '<li class="homework_list_title"><span>校区</span><span>班主任数量（人）</span><span>班课量（个）</span><span>课时量（h）</span></li>';
                    $('.homework_list').append(str_th);

                    for (var i = 0; i < list.length; i++){
                        var html_ = "<li><span>"+list[i].schoolName+"</span><span>"+list[i].headTeacherTotal+"</span><span>"+list[i].totalLessonNos+"</span><span>"+list[i].totalLessonHour+"</span></li>";
                        $('.homework_list').append(html_);
                    }
                }
            }
        }
    })
}


