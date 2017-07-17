$(function() {
    var need = {
        "Tcid": sessionStorage.Tid
    };
    var Homework = {
        'appid': 'wxab29a3e2000b8d2a',
        'secret': '7739991fcce774c2281147eae3986ad9',
        'url': 'http://dt.staff.xdf.cn/xdfdthome/homework/homeworklist_s.html',
        'templateId': 'X9u2z5OF33JCPXDuTGnw06fUt0n-7CSjCe5otNgXO6M',
    };
    var arr;
    ajax_S(homework_s.t_more, need, function (e) {
        console.log(e);
        var data = e.data
        arr = e.data.notCommit
        if (data.notCommit.length == 0) {
            $('.emptyThree').show()
        } else {
            for (var b = 0; b < data.notCommit.length; b++) {
                $('.Pending').eq(2).append('<li><span class="yeCircle">' + data.notCommit[b].studentName.substr(1, 2) + '</span><span>' + data.notCommit[b].studentName + '</span></li>')
            }
        }
        if (data.notCorrect.length == 0) {
            $('.emptyOne').show()
        } else {
            for (var c = 0; c < data.notCorrect.length; c++) {
                $('.Pending').eq(0).append('<li Id="' + data.notCorrect[c].id + '" text="' + data.notCorrect[c].replydescription + '" knowledgePoint="' + data.notCorrect[c].knowledgePoint + '"  description = "' + data.notCorrect[c].description + '"><span class="yeCircle">' + data.notCorrect[c].studentName.substr(1, 2) + '</span><span>' + data.notCorrect[c].studentName + '</span><span>' + data.notCorrect[c].homeworkTime + '</span></li>')
            }
        }
        if (data.yesCorrect.length == 0) {
            $('.emptyTwo').show()
        } else {
            for (var d = 0; d < data.yesCorrect.length; d++) {
                if (data.yesCorrect[d].tag == '1') {
                    $('.Pending').eq(1).append('<li><span class="yeCircle">' + data.yesCorrect[d].studentName.substr(1, 2) + '</span><span>' + data.yesCorrect[d].studentName + '</span><span>' + data.yesCorrect[d].homeworkTime + '</span><i>优秀</i></li>')
                } else {
                    $('.Pending').eq(1).append('<li><span class="yeCircle">' + data.yesCorrect[d].studentName.substr(1, 2) + '</span><span>' + data.yesCorrect[d].studentName + '</span><span>' + data.yesCorrect[d].homeworkTime + '</span></li>')
                }

            }
        }

        if($('.Pending').eq(1).find('i')){
            $('.frend').show()
        }else{
            $('.frend').hide()
        }
    });


    $(document).on('touchend', '.home_t li', function () {
        sessionStorage.stuid = $(this).attr('Id');
        sessionStorage.stutext = $(this).attr('text');
        sessionStorage.knowledgePoint = $(this).attr('knowledgePoint');
        sessionStorage.description = $(this).attr('description');
        location.href = 'replydetail_t.html';
    });

    $('.noreplyTitle span:last-of-type').on('touchend', function () {
        var Arr = [];
        Homework.schoolId = arr[0].schoolId;
        Homework.classCode = arr[0].classCode;
        Homework.className = arr[0].className;
        Homework.description = arr[0].replydescription;
        Homework.stuQuery = Arr;
        for (var i = 0; i < arr.length; i++) {
            Arr.push({
                studentName: arr[i].studentName,
                studentNo: arr[i].studentNo,
                flag: 1
            })
        }
        ajax_S(homework_s.t_quck, {'params': Homework}, function (e) {
            console.log(e)
            if (e.result == true) {
                layer.open({
                    type: 1,
                    area: ['548px', '345px'],
                    shade: [0.2, '#000'],
                    title: '',
                    skin: '',
                    content: $(".homeworkSucc")
                })

            } else {
                layer.open({
                    type: 1,
                    area: ['548px', '345px'],
                    shade: [0.2, '#000'],
                    title: '',
                    skin: '',
                    content: $(".submitHwFail")
                })
            }
        })


    });

    $('.frend input').on('touchend',function(){
        location.href = 'sharedranking_t.html?tid='+sessionStorage.Tid
    })


});