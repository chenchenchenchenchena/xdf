//新建  编辑 用户

require(['jquery-1.11.0.min'], function () {
    require(['layer'],function() {

        //获取校区列表
        $.ajax({
            url:global.learn_detail,
            type: 'post',
            asyns:false,
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            data:sessionStorage.need_learn,
            success:function(e){
                $('.loading_pre').hide();
                var masterTeacherName = e.masterTeacherName,
                    $learm_detail_data = $('.learm_detail_data'),
                    $learn_all_data_ul  = $('.learn_all_data ul'),
                    list = e.Data.studentData.list;
                if(e.beginDat!=undefined&&e.endDate!=undefined){
                    var tiem_ = e.beginDate.replace(/-/g, '/')+'~'+e.endDate.replace(/-/g, '/');
                }else{
                    var tiem_ = '暂无';
                }
                if(masterTeacherName==undefined){
                    masterTeacherName = '暂无'
                }
                $learm_detail_data.append('<li>班级编号：'+e.classCode+'</li>');
                $learm_detail_data.append('<li>班级名称：'+e.className+'</li>');
                $learm_detail_data.append('<li>班 主 任：'+e.teacherName+'</li>');
                $learm_detail_data.append('<li>主&nbsp;&nbsp;&nbsp;  讲：'+masterTeacherName+'</li>');
                $learm_detail_data.append('<li>课程时间：'+tiem_+'</li>');
                $learm_detail_data.append('<li>课&nbsp;&nbsp;&nbsp;  次：'+e.lessonNo+'</li>');
                for(i in list){
                    $learn_all_data_ul.append('<li class="clearfix"><span>'+list[i].studentName+'</span><span>'+list[i].studentNo+'</span><span class="learn_more">查看</span><span class="learn_exit">导出</span></li>')


                }
            }
        });




    })
});