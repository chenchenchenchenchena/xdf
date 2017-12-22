//新建  编辑 用户

var page = 1;
var pageSize = 15;
var totalCounts = 0;
var studentNoOrder = "studentNo desc";
var img_order = "";
var order = "";

require(['jquery-1.11.0.min'], function () {
    require(['layer', 'jqPaginator.min'],function() {
        require(['echarts.min'], function (echarts) {
            ECharts = echarts;//保存图标实例化对象
        //初始化分页控件
        initPage(totalCounts, page);

        //获取校区列表
        SelectLearnData();

        //返回上一页
        $('#back_learn').click(function(){
            history.go(-1);
        });
        $('.learn_all_data').on('click','.learn_exit',function(){
            layer.msg('导出列表较慢，请您耐心等待');
            var self_stu = JSON.parse(sessionStorage.need_learn);

            window.location.href = global.learn_exsel_self + "?studentNo=" + $(this).attr('studentno') + '&schoolId=' +self_stu.schoolId+'&classCode='+ self_stu.classCode;
        });
        $('.lear_all_excel').on('click',function(){
            layer.msg('导出列表较慢，请您耐心等待');
            // window.location.href = global.indexForm + "?schoolId=" + $(this).attr('schoolId') + '&schoolName=' + $(this).attr('schoolName');
        });

        $('.learn_self_title').on('click','img',function(){
            $('.back_big_all').hide();
        });

        $('.learn_all_data').on('click','.learn_more',function(){

            var self_stu = JSON.parse(sessionStorage.need_learn),
             stu_name = $(this).attr('studentname'),
             need_ = {
                 'studentNo': $(this).attr('studentno'),
                 'schoolId': self_stu.schoolId,
                 'classCode': self_stu.classCode
             },
                $learn_self = $('.learn_self'),
                $learn_self_title = $('.learn_self_title'),
                $last_self = $('.last_self'),
                $learn_self_data = $('.learn_self_data ul');
                $last_self.remove();
                $learn_self.find('li').eq(0).before('<li class="last_self">学生编号：'+need_.studentNo+'</li>');
                $learn_self.find('li').eq(0).before('<li class="last_self">学生姓名：'+stu_name+'</li>');
                $learn_self_title.html(''+stu_name+'学情分析表 <i>—未显示某日期则表明当天无数据</i><img src="images/close_.png" alt="">')
            $('.back_big_all').show();

            var $homeworke_all_center = $('.homeworke_all_center');
            $homeworke_all_center.css({
                'margin-top': -$homeworke_all_center.height() / 2,
                'margin-left': -$homeworke_all_center.width() / 2
            });
            ajax_S2(global.learn_self,need_,function(e){
                if(e.timeData.length>0){
                    $(".learn_all_echart div").remove();
                    $learn_self_data.find('li').remove();
                    var time = e.timeData,
                        title_=e.studentResultsCase,
                        html_ = '';
                    for(i in title_){
                        var charType = "";
                        switch(title_[i].type){
                            case '1':
                                html_+= '<span>入门测</span><span>平均分</span>';
                                charType = "入门测";
                                break;
                            case '2':
                                html_+= '<span>出门测</span><span>平均分</span>';
                                charType = "出门测";
                                break;
                            case '3':
                                html_+= '<span>期中测</span><span>平均分</span>';
                                charType = "期中测";
                                break;
                            case '4':
                                html_+= '<span>期末测</span><span>平均分</span>';
                                charType = "期末测";
                                break;
                            case '5':
                                html_+= '<span>入学测</span><span>平均分</span>';
                                charType = "入学测";
                                break;
                        };

                        var charHtml = "<div id='chart_"+i+"' class='learn_all_echart_left'></div>";
                        $(".learn_all_echart").append(charHtml);
                        var char_x = [];
                        var char_y = {
                            'avg':[],
                            'real':[]
                        };
                        for(var j = 0;j<e.studentResultsCase[i].data.length;j++){
                            var item = e.studentResultsCase[i].data[j];
                            var time_char = item.lessonTime.split(' ')[0];
                            char_x.push(time_char);
                            char_y.avg.push(item.avgGrade);
                            char_y.real.push(item.realGrade);
                        }
                        line_echar('chart_'+i,char_x,char_y,'bar', "分数", "日期",charType);

                    }
                    $learn_self_data.append('<li><span>日期</span>'+html_+'</li>');
                    for(i in time){
                        $learn_self_data.append('<li><span style="background:#ccf1ea">' + time[i] + '</span></li>');
                        for(h in title_) {
                            var boolean = false;
                            for (o in title_[h].data) {
                                var Data = title_[h].data[o];
                                var time_one = Data.lessonTime.split(' ')[0];
                                if (time[i] == time_one) {
                                    $learn_self_data.find('li').eq(parseFloat(i)+1).append('<span>'+Data.realGrade+'</span><span style="background:#efefef;">'+Data.avgGrade+'</span>')
                                    boolean = true;
                                }
                            }
                            if(boolean==false){
                                $learn_self_data.find('li').eq(parseFloat(i)+1).append('<span></span><span style="background:#efefef;"></span>')
                            }
                        }
                    }
                    $learn_self_data.find('li').eq(0).css('background','#ccf1ea')

                }

            },function(error){

            });

        });
        });
    })
});

/**
 * 曲线图/柱状图
 * @param id:捆绑的布局ID
 * @param campus:x轴
 * @param value:对应的值
 * @param type :line-曲线图,bar-柱状图
 * @param yName :y轴显示的名字
 * @param xName :x轴显示的名字
 * @param legendName :x轴显示的名字
 */
function line_echar(id, campus, value, type, yName, xName, legendName) {

    var dataSeries = [];
    var legend = [];
    if(value.avg.length != 0){
        var data = {
            name: "平均分",
            type: type,
            data: value.avg
        }
        dataSeries.push(data);
        legend.push("平均分");
    }
    if(value.real.length != 0){
        var data = {
            name: legendName,
            type: type,
            data: value.real
        }
        dataSeries.push(data);
        legend.push(legendName);
    }

    var dataZoom_ = [{
        start: 100,
        end: 20,
        handleSize: 8,
    }, {
        type: 'inside',
        start: 20,
        end: 100,
    }];
    var interval = {};
    var maxNum;
    interval = {};
    if (campus.length <= 4) {
        dataZoom_ = [];
        maxNum = campus.length;

    } else {
        maxNum = 4;
    }

    var myChart = ECharts.init(document.getElementById(id));
    myChart.clear();
    var option = {
        //color: ['#eb7d3c','#5e9cd3'],
        color: ['#39c7c8','#b6a3dc'],
        //color: ['#be3636','#3398db'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
            }
        },
        legend: {
            data:legend
        },
        calculable : true,
        xAxis: [
            {
                type: 'category',
                data: campus,
                axisTick: {
                    alignWithLabel: true

                },
                splitNumber:maxNum,//分割段数，默认为5
                name: xName,
                nameGap: '-5',
                axisLabel: interval
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: yName,

            }
        ],
        dataZoom: dataZoom_,
        series: dataSeries,
    };
    myChart.setOption(option, true);
}

/**
 * 分页
 * @param totalCounts
 * @param currentPage
 */
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
                    SelectLearnData();
                }
            }
        });
    } else {
        $("#publicPage").html("");
    }
}

/**
 * 获取校区列表
 * @constructor
 */
function SelectLearnData(){
    var learnData = JSON.parse(sessionStorage.need_learn);
    var params = {
        'pageNum':page,
        'pageSize':pageSize,
        'schoolId':learnData.schoolId,
        'classCode':learnData.classCode,
        'studentNoOrder':studentNoOrder
    }
    ajax_S(global.learn_detail,JSON.stringify(params),function(e){
        $('.loading_pre').hide();
        if(e.result){
            var masterTeacherName = e.masterTeachereName,
                $learm_detail_data = $('.learm_detail_data'),
                $learn_all_data_ul  = $('.learn_all_data ul'),
                $learn_self = $('.learn_self'),
                list = e.Data.studentData.list;
            if(e.beginDate!=undefined&&e.endDate!=undefined){
                var tiem_ = e.beginDate.replace(/-/g, '/')+'   ~    '+e.endDate.replace(/-/g, '/');
            }else{
                var tiem_ = '暂无';
            }
            if(masterTeacherName==undefined){
                masterTeacherName = '暂无'
            }
            $learm_detail_data.find('li').remove();
            $learm_detail_data.append('<li>班级编号：'+e.classCode+'</li>');
            $learm_detail_data.append('<li title="'+e.className+'">班级名称：'+e.className+'</li>');
            $learm_detail_data.append('<li>班 主 任：'+e.teacherName+'</li>');
            $learm_detail_data.append('<li>主&nbsp;&nbsp;&nbsp;  讲：'+masterTeacherName+'</li>');
            $learm_detail_data.append('<li>课程时间：'+tiem_+'</li>');
            $learm_detail_data.append('<li>课&nbsp;&nbsp;&nbsp;  次：'+e.lessonNo+'</li>');
            $learn_self.find('li').remove();
            $learn_self.append('<li>班级编号：'+e.classCode+'</li>');
            $learn_self.append('<li title="'+e.className+'">班级名称：'+e.className+'</li>');
            $learn_self.append('<li>班 主 任：'+e.teacherName+'</li>');
            $learn_self.append('<li>主&nbsp;&nbsp;&nbsp;  讲：'+masterTeacherName+'</li>');
            if(list != undefined && list.length > 0){

                var strTitle = $('.title_learn');
                $('.learn_all_data ul li').remove();
                $('.learn_all_data ul').append(strTitle);

                totalCounts = e.Data.studentData.total;//总条数
                $('#learn_result').show();
                $('#learn_result').html("共" + e.Data.studentData.total + "条数据");
                var currentPage = e.Data.studentData.pageNum;
                initPage(totalCounts, currentPage);

                for(i in list){
                    $learn_all_data_ul.append('<li class="clearfix"><span>'+list[i].studentName+'</span><span>'+list[i].studentNo+'</span><span class="learn_more" studentNo="'+list[i].studentNo+'" studentName="'+list[i].studentName+'" style="width: 14%;margin: 0 5%;">查看</span><span class="learn_exit"  studentNo="'+list[i].studentNo+'"  style="width: 14%;margin: 0 5%;">导出</span></li>')
                }
            }else {
                layer.msg("暂无数据");
                $('.learn_all_data ul li').remove();
                $('#learn_result').hide();
                initPage(0, 1);
                $('.loading_pre').hide();
            }
        }else {
            layer.msg(e.msg);
        }
    },function(error){
        $('.loading_pre').hide();
    });
}

/**
 * 排序
 */
function  get_order(this_){
    order = $(this_).attr('data-order');
    if (order == 'desc') {
        studentNoOrder = "studentNo asc";
        order = "asc";
        img_order = "images/sort_c.png";
    } else {
        studentNoOrder = "studentNo desc";
        order = "desc";
        img_order = "images/sort_t.png";
    }
    $(this_).attr('data-order', order);
    $(this_).attr('src', img_order);
    page = 1;
    SelectLearnData();
}