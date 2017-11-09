/* 作业统计 */


/*默认导航选中样式*/ 
$('.homework_Statistics div:nth-child(even)').css('float','right');
$('.homework_list li:nth-child(odd)').css('background','#f5fbfa');

require(['jquery-1.11.0.min'], function () {
    require(['jquery-ui.min'], function () {
        require(['layer'], function () {
            laydate.render({
                elem: '#date_input',
                range: true //指定元素
            });

            beginTime = "2017-01-01";
            endTime = new Date().Format("yyyy-MM-dd");
            $('#date_input').val(beginTime+" - "+endTime);
            //SelectHwData();
            //$('.select-btn').click(function(){
            //    //获取筛选条件
            //    SelecHwtData();
            //})
        });
    });
});

var stage = "全部";
var grade = "全部";
var subject = "全部";
var currentCity = "全部";
var stageId = "-1";
var gradeId = "-1";
var subjectId = "-1";
var currentCityId = "-1";

//获取校区/学段／年级／科目
function getSelectList(this_,type,flag) {
    if (sessionStorage.schoolList) {
        var json;
        switch (flag){
            case 0:
                json= JSON.parse(sessionStorage.schoolList);
                break;
            case 1:
                json= JSON.parse(sessionStorage.stageList);
                break;
            case 2:
                json= JSON.parse(sessionStorage.gradelList);
                break;
            case 3:
                json= JSON.parse(sessionStorage.subjectList);
                break;
        }

        showDrownList(json,this_);
    } else {
        var table = {
            "tableName": type
        };
        $.ajax({
            type: "POST",
            url: url_o + 'dict/getDictListByTableName.do',
            async: true,//同步
            dataType: 'json',
            data: table,
            success: function (e) {
                switch (flag){
                    case 0:
                        sessionStorage.schoolList = JSON.stringify(e);
                        break;
                    case 1:
                        sessionStorage.stageList = JSON.stringify(e);
                        break;
                    case 2:
                        sessionStorage.gradelList = JSON.stringify(e);
                        break;
                    case 3:
                        sessionStorage.subjectList = JSON.stringify(e);
                        break;
                }
                showDrownList(e,this_);
            }
        })
    }

}
//筛选校区/学段／年级／科目列表显示
function showDrownList(json,this_){
    if (json.code == "200") {
        $(this_).siblings().find('ul').html("");
        var list = json.data;
        var content = "<li onclick='filterByDrownId(this, \"" + "" + "\")' ><span>全部</span></li>";
        for (var i = 0; i < list.length; i++) {
            var tCode = list[i].tCode;
            content += "<li onclick='filterByDrownId(this, \"" + list[i].tName + "\")' data-tCode='"+tCode+"' ><span>" + list[i].tName + "</span></li>";

        }
        $(this_).parent().find('ul').html(content);
    } else {
        layer.msg("查询失败!")
    }

    $(this_).parent().find('ul').show();
}

//点击选择校区/学段／年级／科目
function filterByDrownId(_this, name) {
    var id = $(_this).attr('data-tCode');
    $(_this).parent().parent().find('h4').html(name);
    $(_this).parent().parent().find('h4').attr('tCode',id);
    $(_this).parent().hide();
}



