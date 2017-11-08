require(['jquery-1.11.0.min'], function () {
    require(['jquery-ui.min'], function () {
        require(['layer'], function () {
            layer.msg("1452");
            //SelectData();
        });
    });
});


//筛选数据接口实现
function SelectData(){
    beginTime = "2017-11-01";
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
                $('#head_lesstime h1').html(classTeacherTotal);
                $('#master_lesstime h1').html(masterTeacherTotal);
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