//新建  编辑 用户

var page = 1;
var pageSize = 15;
var totalCounts = 0;

require(['jquery-1.11.0.min'], function () {
    require(['layer', 'jqPaginator.min'],function() {

        //初始化分页控件
        initPage(totalCounts, page);

        //获取校区列表
        SelectLearnData();

        //返回上一页
        $('#back_learn').click(function(){
            history.go(-1);
        });
        $('.learn_all_data').on('click','.learn_exit',function(){
            window.location.href = global.indexForm + "?schoolId=" + $(this).attr('schoolId') + '&schoolName=' + $(this).attr('schoolName');
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
            $.ajax({
                url:global.learn_self,
                type: 'post',
                asyns:false,
                dataType: 'json',
                data:need_,
                success:function(e){
                    $learn_self_data.append('')

                }
            });



        });
    })
});

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
        'classCode':learnData.classCode
    };
    $.ajax({
        url:global.learn_detail,
        type: 'post',
        asyns:false,
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data:JSON.stringify(params),
        success:function(e){

            $('.loading_pre').hide();
            if(e.result){
                var masterTeacherName = e.masterTeacherName,
                    $learm_detail_data = $('.learm_detail_data'),
                    $learn_all_data_ul  = $('.learn_all_data ul'),
                    $learn_self = $('.learn_self'),
                    list = e.Data.studentData.list;
                if(e.beginDat!=undefined&&e.endDate!=undefined){
                    var tiem_ = e.beginDate.replace(/-/g, '/')+'~'+e.endDate.replace(/-/g, '/');
                }else{
                    var tiem_ = '暂无';
                }
                if(masterTeacherName==undefined){
                    masterTeacherName = '暂无'
                }
                $learm_detail_data.find('li').remove();
                $learm_detail_data.append('<li>班级编号：'+e.classCode+'</li>');
                $learm_detail_data.append('<li>班级名称：'+e.className+'</li>');
                $learm_detail_data.append('<li>班 主 任：'+e.teacherName+'</li>');
                $learm_detail_data.append('<li>主&nbsp;&nbsp;&nbsp;  讲：'+masterTeacherName+'</li>');
                $learm_detail_data.append('<li>课程时间：'+tiem_+'</li>');
                $learm_detail_data.append('<li>课&nbsp;&nbsp;&nbsp;  次：'+e.lessonNo+'</li>');
                $learn_self.find('li').remove();
                $learn_self.append('<li>班级编号：'+e.classCode+'</li>');
                $learn_self.append('<li>班级名称：'+e.className+'</li>');
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
                        $learn_all_data_ul.append('<li class="clearfix"><span>'+list[i].studentName+'</span><span>'+list[i].studentNo+'</span><span class="learn_more" studentNo="'+list[i].studentNo+'" studentName="'+list[i].studentName+'">查看</span><span class="learn_exit">导出</span></li>')
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

        }
    });
}