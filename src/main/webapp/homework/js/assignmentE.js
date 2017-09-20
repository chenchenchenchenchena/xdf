/**
 * Created by zyc on 2017/9/7.
 */
$(function () {

    var isModify = GetRequest("isModify");
    var isUpdata = GetRequest("isUpdata");
    var Tcid = GetRequest("id");
    var isRequesting = false;
    if (isUpdata == 1) {

    } else {
        if (isModify == 1) {
            ajaxRequest('post', homework_s.t_seac, {'Tcid': Tcid}, function (e) {
                if (e.code == 200) {
                    var data = e.data;
                    if (undefined != data && data != "") {

                        $(".class_s i").attr("classcode", data.classCode);
                        $(".class_s i").attr("classname", data.className);
                        sessionStorage.paperId = data.paperId;
                        sessionStorage.paperUrl = data.paperUrl;
                        sessionStorage.gradeName = data.paperName;
                        sessionStorage.stageName = data.paperStage;
                        sessionStorage.subjectName = data.paperSubject;

                        $(".class_s i").html(data.className);
                        $(".content_s").find("i").html(data.paperName);
                        $('.time_S i').html(data.homeworkTime);
                    }
                }
            });
        }

    }

    if (sessionStorage.paperUrl) {
        $('.sResolve a').attr("href", sessionStorage.paperUrl);
    }
    var trardata = {
        'teacherCode': localStorage.teacherId,
        'schoolId': localStorage.schoolId,
        'email': localStorage.terEmail
    };
    var layer1, layer2, loading;
    //作业内容
    if (sessionStorage.contentName) {
        $(".content_s").find("i").html(sessionStorage.contentName);
    }
    if (sessionStorage.time) {
        $('.time_S i').html(sessionStorage.time);
    } else {
        //设置当天默认值
        $('.time_S i').html(new Date().format("yyyy-MM-dd"));
    }
    if (sessionStorage.class) {
        $(".class_s i").html(sessionStorage.class);
    }
    if (sessionStorage.hxCode) {
        $(".class_s i").attr("classcode", sessionStorage.hxCode);
    }
    if (sessionStorage.hxName) {
        $(".class_s i").attr("className", sessionStorage.hxName);
    }
    //获取班级信息
    ajax_S(homework_s.t_clas, trardata, function (e) {
        var className = e.data;
        for (var a = 0; a < className.length; a++) {
            $('.class_name ul').append('<li style="white-space: nowrap;overflow-x:auto;"  classCode="' + className[a].ClassCode + '"><img src="images/C05_06.png" alt=""><span class="cn">' + className[a].ClassName + '</span><span style="font-size: 32px">(' + className[a].ClassCode + ')</span></li>')
        }
    });
    //选择班
    $('.class_s').on('touchend click', function () {
        if (isModify == 1) {
        } else {
            $('.class_name').show();
            $('.class_name').animate({'bottom': '0px'});
            $('.class_name').show();
            $('.big_back').show();
        }
    });

    $(document).on('tap', '.class_name li', function () {
        var html_ = $('.class_name i').html();
        if ($(this).find('img').attr('src') == 'images/C05_06.png') {
            $(this).find('img').attr('src', 'images/C0503.png');
            html_++;
            $('.class_name i').html(html_);
        } else {
            $(this).find('img').attr('src', 'images/C05_06.png');
            html_--;
            $('.class_name i').html(html_);
        }
    });

    var className = '';
    var classCode = '';
    //确认班级
    $('.class_sub').on('touchend', function () {
        className = '';
        classCode = '';
        $(this).parent().find('li').each(function () {
            if ($(this).find('img').attr('src') == 'images/C0503.png') {
                className += $(this).find('.cn').html() + '；';
                classCode += $(this).attr('ClassCode') + ',';
            }
        });
        classCode = classCode.substr(0, classCode.length - 1);
        className = className.substr(0, className.length - 1);
        if (className == '') {
            layer.open({
                type: 1,
                area: ['312px', '194px'],
                shade: 0,
                title: '',
                skin: '',
                time: 3000,
                content: $(".classEmpty")
            })
        }
        if ($('.class_name i').html() != '0') {
            $('.class_s i').html('已选择' + $('.class_name i').html() + '个班&nbsp;&nbsp;' + className + ' ');
            $('.class_s i').attr("classcode", classCode);
            var class_n = className.replace(/\；/g, ',');
            $('.class_s i').attr("classname", class_n);
            $('.class_name').animate({'bottom': '-438px'});
            $('.big_back').hide();
        } else {
            $('.class_s i').html('');
        }
    });
    //作业时间
    $('.Choice_s input').on('change', function () {
        if (isModify == 1) {
            //修改作业不可选
        } else {
            $('.time_S i').html($(this).val());
        }

    });
    //点击蒙层
    $('.big_back').on('touchstart', function () {
        if ($('.class_name').css('display') == 'block') {
            $('.class_name').animate({'bottom': '-438px'});
            setTimeout(function () {
                $('.big_back').hide();
            }, 300);
            if ($('.class_s i').html() == '') {
                $('.class_name i').html('0');
                $('.class_name img').attr('src', 'images/C05_06.png');
                if ($('.class_name i').html() == '0') {
                    $('.class_s i').html('')
                }
            }
        }
    });
    //点击选择作业内容跳转
    $(".content_s").click(function () {
        sessionStorage.time = $('.time_S i').html();
        sessionStorage.class = $(".class_s i").html();
        sessionStorage.hxCode = $('.class_s i').attr('classcode');
        sessionStorage.hxName = $('.class_s i').attr('classname');
        location.href = "homeworkEcon.html?paperId=" + sessionStorage.paperId + "&isModify=" + isModify + "&id=" + Tcid;

    });
    //点击提交
    $(".tSub").click(function () {
        if (isRequesting) {
            $('.tSub').css("background","#e1e1e1");

        } else {
            $('.tSub').css("background","#11bf9e");
            if ($(".class_s i").html() == "") {
                layer.open({
                    type: 1,
                    area: ['312px', '194px'],
                    shade: 0,
                    title: '',
                    skin: '',
                    time: 3000,
                    content: $(".classEmpty")
                })
            }
            if ($(".content_s i").html() == "") {
                layer.open({
                    type: 1,
                    area: ['312px', '194px'],
                    shade: 0,
                    title: '',
                    skin: '',
                    time: 3000,
                    content: $(".classTime")
                })
            }
            if ($(".content_s i").html() != "" && $(".class_s i").html() != "" && $(".time_S i").html() != "") {
                sessionStorage.removeItem("contentName");
                sessionStorage.removeItem("time");
                sessionStorage.removeItem("class");
                layer1 = layer.open({
                    type: 1,
                    area: ['312px', '194px'],
                    shade: [0.2, '#000'],
                    title: '',
                    skin: '',
                    content: $(".areyok")
                })
            }
        }
    });

    $(".areyok input").eq(0).click(function () {
        layer.close(layer1);
    });
    $(".areyok input").eq(1).click(function () {

        submit();
    });

    /**
     * 提交布置作业
     */
    function submit() {
        isRequesting = true;
        var hwName_ = $('.content_s i').html();
        // var paperName = hwName_.substring(0, hwName_.length - 1);
        var paperName = hwName_;
        var paperID = sessionStorage.paperId;
        var paperUrl = sessionStorage.paperUrl;


        if (isModify == 1) {
            var params1 = {
                'Tcid': Tcid,
                'paperId': paperID,
                'paperName': paperName,
                'paperUrl': paperUrl,
                'paperClass': sessionStorage.gradeName,
                'paperStage': sessionStorage.stageName,
                'paperSubject': sessionStorage.subjectName
            };

            ajaxRequest("POST", homework_s.t_erro, JSON.stringify(params1), function (e) {
                if (e.result) {
                    isRequesting = false;
                    layer.close(layer1);
                    layer.open({
                        type: 1,
                        area: ['312px', '194px'],
                        shade: [0.2, '#000'],
                        title: '',
                        skin: '',
                        time: 3000,
                        content: $(".succ")
                    });
                    location.href = "homeworklist_t.html";
                } else {
                    isRequesting = false;
                    layer.close(layer1);
                    layer.msg(e.message);
                }
            })
        } else {
            //URL字段待定
            var params = {
                'appid': Global.appid,
                'secret': Global.secret,
                'url': url_o2+"/xdfdthome/homework/pushhomeworkE.html",
                'templateId': "X9u2z5OF33JCPXDuTGnw06fUt0n-7CSjCe5otNgXO6M",
                'teacherEmail': localStorage.terEmail,
                'teacherName': localStorage.teacherName,
                'schoolId': localStorage.schoolId,
                'classCode': $(".class_s i").attr("classcode"),
                'className': $(".class_s i").attr("classname"),
                'homeworkTime': $('.time_S i').html(),
                'knowledgePoint': "",
                'description': "",
                'homeworkType': "2",
                'paperId': paperID,
                'paperName': paperName,
                'paperUrl': paperUrl,
                'paperClass': sessionStorage.gradeName,
                'paperStage': sessionStorage.stageName,
                'paperSubject': sessionStorage.subjectName,
                'fileInfo': ""
            };

            // homework_s.t_sbim
            // var url1 = "http://10.73.33.63:8080/xdfdtmanager/teacherData/addHomeWork.do";
            ajaxRequest("POST", homework_s.t_sbim, JSON.stringify(params), function (e) {
                if (e.result) {

                    isRequesting = false;
                    layer.close(layer1);
                    layer.open({
                        type: 1,
                        area: ['312px', '194px'],
                        shade: [0.2, '#000'],
                        title: '',
                        skin: '',
                        time: 3000,
                        content: $(".succ")
                    });
                    location.href = "homeworklist_t.html";
                } else {
                    isRequesting = false;
                    layer.close(layer1);
                    layer.msg(e.message);
                }
            });
        }

    }

});
