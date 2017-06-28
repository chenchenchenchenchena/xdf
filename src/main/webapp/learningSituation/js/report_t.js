$(function(){




//点击查看成绩排行
$(document).on('touchend','.achievement_s>h4',function(){
    var title = $(this).parents('.achievement_s').siblings('.title_s').find('h4').html();
    console.log(title);
    window.location.href = 'rankinglist_t.html?title='+title;
});
//点击显示图标
$(document).on('touchend','.title_s',function(){
	console.log($('#chart_S'))
});

$('.class_big').append('<div class="classroom_s"> <div class="title_s"> <h4>高中英语拔高班</h4> <img src="images/rightArrow.png" alt=""/></div> <div id="chart_S"></div><div class="achievement_s"> <h4>查看成绩排行</h4> <img src="images/rightArrow.png" alt=""> </div> </div>')























var myChart = echarts.init(document.getElementById("chart_S"));
// ajaxRequest('post','http://dt.staff.xdf.cn/xdfdtmanager/teacherAnalysis/queryScoreReportByTeacherEmail.do',{'teaEmail':'caoxuefeng@xdf.cn'},		function(e){
//         console.log(e)
// })
var option = {
        tooltip : {
            trigger: 'item'
        },
        legend: {
            data:['出门测','入门测'],
            left:'20px'
        },
        calculable : true,
        xAxis : [
            {
                name:'课次',
                type : 'category',
                boundaryGap : false,
                data :[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
            }
        ],
        yAxis : [
            {
                name:'分数',
                type : 'value',
                max : '10',
            }
        ],
        series : [
            {
                name:'出门测',
                type:'line',
                data:[1, 2, 3, 4, 8, 6, 7],
            },
            {
                name:'入门测',
                type:'line',
                data:[7, 6, 3, 2, 1, 0, 7],
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);


});