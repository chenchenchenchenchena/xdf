/**
 * Created by xupingwei on 2017/9/7.
 */
$(function () {
    var stuCode = GetRequest("studentNo");
    var remark = GetRequest("remark");
    var schoolId = GetRequest("schoolId");
    var tCode = GetRequest("tCode");
    var studentName = GetRequest("studentName");
    var emailm = {
        'stuNo': stuCode,
        'schoolId': schoolId
    };
    if (studentName.length > 2) {
        $('.avatar-icon').html(studentName.substring(studentName.length - 2, studentName.length));
    } else {

        $('.avatar-icon').html(studentName);
    }
    $('#name').html("姓名：" + studentName);
    var studentNum = stuCode;

    $('#studentNumber').html("学员号：" + studentNum);
    //获取该学生所报班级信息
    ajax_S(url.s_classList, emailm, stusea,function(){
        $('body').append('<img src="images/reload.png" class="reload" style="width:150px;height:100px;margin:50% auto;display:block;">')
    });
    $(document).on('touchend','.reload',function(){
        location.reload();
    });

    function stusea(e) {
        if (e.result) {

            var dataList = e.classData;
            var classCodeList = "";
            //判断是否有班级信息
            if (undefined != dataList && dataList.length > 0) {
                //显示title布局
                $('.content-title').show();
                var classListStr = "";
                for (var i = 0; i < dataList.length; i++) {
                    var className = dataList[i].ClassName;
                    var Teachers = dataList[i].Teachers;
                    var classCode = dataList[i].ClassCode;
                    classCodeList += classCode + ",";

                    classListStr += '<div class="item">' +
                        '<div class="item-top">' +
                        '<p class="content-text-font">' + className + '</p>' +
                        '<p class="content-text-small">授课老师：' + Teachers + '</p>' +
                        '</div>';
                    if (remark == 2) {
                        //表示：学生自己查看
                        classListStr += '<div class="item-blow">' +
                        '<ul class="fr content-lable"><a href="../learningSituation/report_s.html?studentNo=' + stuCode + '&tCode=' + tCode + '&studentName=' + studentName + '">' +
                            '<li class="lable">学情</li></a>' +
                            '<a href="../homework/homeworklist_s.html">' +
                            '<li class="lable">作业详情</li></a>';
                        classListStr += "<a href= 'homework_report.html?classCode=" + classCode + "&schoolId=" + schoolId + "&studentNo=" + stuCode + "&className=" + className + "&remark=" + remark + "'>" +
                            "<li class='lable'>作业报告</li></a>";

                        classListStr += "</ul></div><div class='line-light space-30'></div></div>";
                    } else {
                        //表示：老师查看学生
                        if (Teachers.indexOf(localStorage.teacherName) >= 0) {
                            classListStr += '<div class="item-blow">' +
                                '<ul class="fr content-lable"><a href="../learningSituation/reportstu_t.html?studentNo=' + stuCode + '&tCode=' + tCode + '&studentName=' + studentName + '">' +
                                '<li class="lable">学情</li></a>';
                            classListStr += "<a href= 'homework_report.html?classCode=" + classCode + "&schoolId=" + schoolId + "&studentNo=" + stuCode + "&className=" + className + "&remark=" + remark + "'>" +
                                "<li class='lable'>作业报告</li></a>";

                            classListStr += "</ul></div><div class='line-light space-30'></div></div>";
                        }else {
                            classListStr += "</ul><div class='line-light space-30'></div></div>";
                        }

                    }


                }
                sessionStorage.classCodeList = classCodeList;
                $('.content').append(classListStr);

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