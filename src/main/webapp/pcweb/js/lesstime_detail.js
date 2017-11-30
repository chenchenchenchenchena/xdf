/*全局参数*/

var currentCity = '全部';
var currentCityId = '';
var beginTime = '';
var endTime = '';

var seacherKey = "";
var masterTeacherFlag = 0;
var page = 1;
var pageSize = 15;
var totalCounts = 0;

require(['jquery-1.11.0.min'], function () {
    require(['jquery-ui.min'], function () {
        require(['jqPaginator.min'], function () {
            require(['layer'], function () {
                // 重置左导航
                var number_l = 0;
                var url_l =  location.href;

                if(url_l.indexOf('homework')!=-1||url_l.indexOf('detail')!=-1){
                    number_l = 1;
                }
                if(url_l.indexOf('lesstime')!=-1||url_l.indexOf('lesstime_detail')!=-1){
                    number_l = 2;
                }
                else if(url_l.indexOf('power')!=-1||url_l.indexOf('userAdd')!=-1||url_l.indexOf('useredit')!=-1){
                    number_l = 3
                }
                else if(url_l.indexOf('master')!=-1){
                    number_l = 4
                }
                var $bure_true = $('.left_nav ul li').eq(number_l);
                $bure_true.addClass('activ_nav').siblings().removeClass('activ_nav');

                laydate.render({
                    elem: '#date_input',
                    range: true //指定元素
                });
                //返回上一页
                $('#back_lesstime').click(function(){
                    history.go(-1);
                })

                //从上个页面获取筛选数据
                var params = JSON.parse(sessionStorage.lesstimeDetailParams);
                currentCity = params.currentCity;
                currentCityId = params.currentCityId;
                beginTime = params.beginTime;
                endTime = params.endTime;
                masterTeacherFlag = params.flag;
                $('#select-school h4').html(params.currentCity);
                if (beginTime != undefined && endTime != undefined && beginTime != "" && endTime != "") {
                    $('#date_input').val(params.beginTime + " - " + params.endTime);
                }
                $('.homework_sea input').off("keyup").on('keyup',function(even){
                    if(even.keyCode==13){
                        SelectData();
                    }
                })
                //初始化分页控件
                initPage(totalCounts, page);

                //查询数据
                SelectData();

                //导出教师列表
                $('#expor_hour').click(function () {
                    exporHourList();
                })

            });
        });
    });
});
function initPage(totalCounts, currentPage) {
    if (totalCounts != null && totalCounts != 0) {
        $.jqPaginator("#publicPage", {
            totalCounts: totalCounts,
            pageSize: pageSize,
            visiblePages: pageSize,
            currentPage: currentPage,
            prev: '<a class="pPrev" href="javascript:;">上一页</a>',
            next: '<a class="pNext" href="javascript:;">下一页</a>',
            page: '<a href="javascript:;">{{page}}</a>',
            activeClass: 'pCurrent',
            onPageChange: function (num, type) {
                if (type != "init") {
                    page = num;
                    SelectData();
                }
            }
        });
    } else {
        $("#publicPage").html("");
    }
}

// 输入教师名称筛选数据
function seacherByName() {
    SelectData();
}

//获取校区
function getSchool() {
    if($('#select-school ul').css('display') != 'none'){
        $('#select-school ul').hide();
    }else {
        if (sessionStorage.schoolList) {
            var json = JSON.parse(sessionStorage.schoolList);
            showSchoolList(json);
        } else {
            var table = {
                "tableName": "dict_school_info"
            };
            $.ajax({
                type: "POST",
                url: global.hw_dictList,
                dataType: 'json',
                data: table,
                success: function (e) {
                    sessionStorage.schoolList = JSON.stringify(e);
                    showSchoolList(e)
                }
            })
        }
    }

}

//筛选校区列表显示
function showSchoolList(e) {
    var schoolStr = localStorage.schoolList;// 全部的校区ID
    var schoolIdList = schoolStr.split(',');

    var schoolList = e.data;
    if (schoolList != undefined && schoolList.length > 0) {
        $("#select-school ul").html("");
        var cityContent = "<li onclick='filterByCityId(this, \"" + "全部" + "\")' data-schoolId='" + schoolStr + "'><span>全部</span></li>";
        for (var i = 0; i < schoolIdList.length; i++) {
            for (var j = 0; j < schoolList.length; j++) {
                var schoolId = schoolList[j].tCode;
                if (schoolIdList[i] == schoolId) {
                    cityContent += "<li onclick='filterByCityId(this, \"" + schoolList[j].tName + "\")' data-schoolId='" + schoolId + "' ><span>" + schoolList[j].tName + "</span></li>";
                }
            }

        }
        $("#select-school ul").html(cityContent);
    } else {
        layer.msg("查询失败!")
    }

    $('#select-school ul').show();
}

//点击选择校区
function filterByCityId(_this, cityName) {
    currentCity = cityName;
    currentCityId = $(_this).attr('data-schoolId');
    $("#select-school h4").html(currentCity);
    $('#select-school ul').hide();
}

//筛选数据接口实现
function SelectData() {

    var time = $('#date_input').val();
    if (time != undefined && time != "") {
        beginTime = time.substring(0, 10);
        endTime = time.substring(13, time.length);
    }
    seacherKey = $('.homework_sea input').val();
    if (seacherKey == undefined) {
        seacherKey = "";
    }
    var params = {
        "schoolId": currentCityId,
        'beginDate': beginTime,
        'endDate': endTime,
        'masterTeacherFlag': masterTeacherFlag,
        'pageNum': page,
        'pageSize': pageSize,
        'teacherName': seacherKey
    };
    $.ajax({
        type: "POST",
        url: global.lesstime_detail,
        dataType: 'json',
        data: JSON.stringify(params),
        success: function (e) {
            var data = e.Data;
            if (data != undefined) {
                var list = data.list;
                if (list != undefined && list.length > 0) {
                    $('.homework_list li').remove();
                    totalCounts = data.total;//总条数
                    $('.lesstime_Result').show();
                    $('.lesstime_Result').html("共" + data.total + "条数据");
                    var currentPage = data.pageNum;
                    initPage(totalCounts, currentPage);

                    var str_th = '<li class="homework_list_title"><span>教师姓名</span><span>课时（h）</span><span>当月课时（h）</span></li>';
                    $('.homework_list').append(str_th);

                    for (var i = 0; i < list.length; i++) {
                        if(list[i].teacherName != undefined && list[i].teacherName != ""){

                            var html_ = '<li><span>' + list[i].teacherName + '</span><span>' + list[i].lessonHours + '</span><span>' + list[i].monthHours + '</span></li>';
                            $('.homework_list').append(html_);
                        }
                    }
                }
            } else {
                layer.msg("暂无数据");
                $('.homework_list li').remove();
                $('.lesstime_Result').hide();
                initPage(0, 1);
            }

        }
    })
}

//导出
function exporHourList() {
    if ($('.homework_list li') == undefined || $('.homework_list li').length == 0) {
        layer.msg("暂无列表");
        return false;
    }
    window.location.href = global.expor_hour + "?schoolName=" + currentCity + "&schoolId=" + currentCityId + "&masterTeacherFlag=" + masterTeacherFlag + "&teacherName=" + seacherKey + "&beginTime=" + beginTime + "&endTime=" + endTime + "&nextPage=" + page + "&pageSize=" + pageSize;

}