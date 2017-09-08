/**
 * Created by xupingwei on 2017/9/7.
 */
$(function () {
    var stuCode = GetRequest("studentNo");
    var remark = GetRequest("remark");
    var schoolId = GetRequest("schoolId");
    var emailm = {
        'studentCode':stuCode,
        'beginDate':sessionStorage.timetoday.split(' ')[0],
        'endDate':sessionStorage.timetoday.split(' ')[0],
        'schoolId':schoolId
    };
    //获取该学生所报班级信息
    ajax_S(url.s_stud, emailm, stusea);
    function stusea(e) {
        if (e.result) {

            var dataList = e.data.Data;
            //判断是否有班级信息
            if (undefined != dataList && dataList.length > 0) {
                //显示title布局
                $('.content-title').show();
                var classListStr = "";
                for (var i = 0; i < dataList.length; i++) {
                    var className = dataList[i].ClassName;
                    var Teachers = dataList[i].Teachers;
                    var classCode = dataList[i].ClassCode;
                    var schoolId = dataList[i].SchoolId;

                    classListStr += '<div class="item">' +
                        '<div class="item-top">' +
                        '<p class="content-text-font">' + className + '</p>' +
                        '<p class="content-text-small">授课老师：' + Teachers + '</p>' +
                        '</div>' +
                        '<div class="item-blow">' +
                        '<ul class="fr content-lable">' +
                        '<a href="../learningSituation/reportstu_t.html?studentNo="' + stuCode + '><li class="lable">学情</li></a>';
                    if (remark == 1) {
                        //表示：学生自己查看
                        classListStr += '<a href="../homework/homeworklist_s.html"><li class="lable">作业详情</li></a>';
                    } else {
                        //表示：老师查看学生
                    }
                    classListStr += '<a href="homework_report.html"?classCode="' + classCode + '"&schoolId="' + schoolId + '"&studentNo="' + stuCode + '"><li class="lable">作业报告</li></a>' +
                        '</ul>' +
                        '</div>' +
                        '<div class="line-light space-30"></div>' +
                        '</div>';

                }
                $('.content').html(classListStr);

            } else {
                // 隐藏title布局
                $('.content-title').hide();
            }
        } else {
            // 隐藏title布局
            $('.content-title').hide();
        }


    }

});