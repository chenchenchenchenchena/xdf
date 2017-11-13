/* 课时统计 */

/*全局参数*/
var currentCity = '';
var currentCityId = '';
var beginTime = '';
var endTime = '';


localStorage.schoolList = "73,505";

require(['jquery-1.11.0.min'], function () {
    require(['jquery-ui.min','layer'], function () {
        require(['echarts.min'], function (echarts) {
            laydate.render({
                elem: '#date_input',
                range: true //指定元素
            });
            //默认是全部校区
            currentCityId = localStorage.schoolList;
            currentCity = "全部";
            SelectData();
            $('.select-btn').click(function(){
                //获取筛选条件
                var time = $('#date_input').val();
                if(time != undefined && time != ""){
                    beginTime = time.substring(0,10);
                    endTime = time.substring(13,time.length);
                }
                SelectData();
            });
            line_echar('teacher_echart',['11.01','11.02','11.03'],[8,9,15],'line');
            line_echar('head_echart',['11.01','11.02','11.03'],[8,9,15],'line');
            line_echar('master_echart',['11.01','11.02','11.03'],[8,9,15],'line');
            line_echar('class_echart',['11.01','11.02','11.03'],[8,9,15],'bar');
            line_echar('lesstime_echart',['11.01','11.02','11.03'],[8,9,15],'bar');

            function line_echar(id,campus,value,type){
                var myChart = echarts.init(document.getElementById(id));
                option = {
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {

                            //type : 'shadow'

                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : campus,
                            axisTick: {
                                alignWithLabel: true

                            },
                            name:'校区',
                            nameGap:'-5',
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name:'班课量',

                        }
                    ],
                    series : [
                        {
                            name:'班课量',
                            type:type,
                            barWidth: '60%',
                            data:value
                        }
                    ]
                };
                myChart.setOption(option);
            }


            /**
             * 曲线图
             * @param id :布局ID
             * @param x :x轴的数据list
             * @param dataItem :要绘制的数据点(x,y)
             * @param max :y轴最大值
             * @constructor
             */
            function graph(id, x, dataItem, max) {
                var myChart = echarts.init(document.getElementById(id));
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        triggerOn: 'click'
                    },
                    xAxis: [
                        {
                            name: '日期',
                            type: 'category',
                            boundaryGap: false,
                            data: x,
                        }
                    ],
                    yAxis: [
                        {
                            name: '课时',
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: "课时",
                            type: 'line',
                            data: dataItem,
                            symbolSize: 14,
                            smooth: true,
                            nameTextStyle: {
                                fontSize: 2
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    fontSize: 12
                                }
                            }
                        }

                    ]
                };
                myChart.setOption(option);
            }
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
function showSchoolList(e){
    var schoolStr = localStorage.schoolList;// 全部的校区ID
    var schoolIdList = schoolStr.split(',');

    var schoolList = e.data;
    if (schoolList != undefined && schoolList.length > 0 ) {
        $(".homework_samll_one ul").html("");
        var cityContent = "<li onclick='filterByCityId(this, \"" + "全部" + "\")' data-schoolId='"+schoolStr+"'><span>全部</span></li>";
        for (var i = 0; i < schoolIdList.length; i++) {
            for(var j = 0;j < schoolList.length;j++){
                var schoolId = schoolList[j].tCode;
                if(schoolIdList[i] == schoolId){
                    cityContent += "<li onclick='filterByCityId(this, \"" + schoolList[j].tName + "\")' data-schoolId='"+schoolId+"' ><span>" + schoolList[j].tName + "</span></li>";
                }
            }

        }
        $(".homework_samll_one ul").html(cityContent);
    } else {
        layer.msg("查询失败!")
    }

    $('.homework_samll_one ul').show();
}

//点击选择校区
function filterByCityId(_this, cityName) {
    currentCity = cityName;
    currentCityId = $(_this).attr('data-schoolId');
    $(".homework_samll_one h4").html(currentCity);
    $('.homework_samll_one ul').hide();
}

//筛选数据接口实现
function SelectData(){

    var params = {
        "schoolId": currentCityId,
        'beginDate':beginTime,
        'endDate':endTime
    };
    $.ajax({
        type: "POST",
        url: url_o + 'backEndClassHourCount/queryClassHourCount.do',
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
                }else {
                    $('.homework_list li').remove();
                    layer.msg("暂无数据");
                }

            }
        }
    })
}

//查看明细
function lookDetails(this_,flag){
    //flag:0表示班主任；1表示主讲
    $(this_).attr('href',"#/lesstime_detail");
    var params = {
        'currentCityId':currentCityId,
        'currentCity':currentCity,
        'beginTime':beginTime,
        'endTime':endTime,
        'flag':flag
    }
    sessionStorage.lesstimeDetailParams = JSON.stringify(params);
}



