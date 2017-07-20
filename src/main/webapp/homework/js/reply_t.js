$(function() {
    var need = {
        "Tcid": sessionStorage.Tid
    };
    var Homework = {
        'appid': 'wxab29a3e2000b8d2a',
        'secret': '7739991fcce774c2281147eae3986ad9',
        'url': 'http://dt.staff.xdf.cn/xdfdthome/homework/homeworklist_s.html',
        'templateId': 'X9u2z5OF33JCPXDuTGnw06fUt0n-7CSjCe5otNgXO6M'
    };
    $('.frend').hide();
    var arr;
    ajax_S(homework_s.t_more, need, function (e) {
        console.log(e);
        var data = e.data;
        arr = e.data.notCommit;
        if (data.notCommit.length == 0) {
            $('.emptyThree').show()
        } else {
            for (var b = 0; b < data.notCommit.length; b++) {
                if(data.notCommit[b].studentName.length==2){
                    var name = data.notCommit[b].studentName;
                }else{
                    var name = data.notCommit[b].studentName.substr(1, 2);
                }
                $('.Pending').eq(2).append('<li><span class="yeCircle">' + name + '</span><span>' + data.notCommit[b].studentName + '</span></li>')
            }
        }
        if (data.notCorrect.length == 0) {
            $('.emptyOne').show()
        } else {
            for (var c = 0; c < data.notCorrect.length; c++) {
                var timet = data.notCorrect[c].updateTime;
                var montht = timet.substring(5,timet.indexOf(' ')).replace('-','.');
                var dayt = timet.split(' ')[1].substring(0,5);
                if(data.notCorrect[c].studentName.length==2){
                    var name_ = data.notCorrect[c].studentName
                }else{
                    var name_ = data.notCorrect[c].studentName.substr(1, 2);
                }
                $('.Pending').eq(0).append('<li Id="' + data.notCorrect[c].id + '" text="' + data.notCorrect[c].replydescription + '" knowledgePoint="' + data.notCorrect[c].knowledgePoint + '"  description = "' + decodeURI(data.notCorrect[c].description) + '"><span class="yeCircle">' + name_ + '</span><span>' +  data.notCorrect[c].studentName + '</span><span>' + montht+'    '+dayt + '</span></li>')
            }
        }
        if (data.yesCorrect.length == 0) {
            $('.emptyTwo').show()
        } else {
            for (var d = 0; d < data.yesCorrect.length; d++) {
                var time = data.yesCorrect[d].replyTime;
                var month = time.substring(5,time.indexOf(' ')).replace('-','.');
                var day = time.split(' ')[1].substring(0,5);
                if(data.yesCorrect[d].studentName.length==2){
                    var name_t = data.yesCorrect[d].studentName
                }else{
                    var name_t = data.yesCorrect[d].studentName.substr(1, 2)
                }
                if (data.yesCorrect[d].tag == '1') {
                    $('.Pending').eq(1).append('<li Id="'+data.yesCorrect[d].id+'" text_t="'+data.yesCorrect[d].replyDesc+'" text="' + data.yesCorrect[d].replydescription + '" knowledgePoint="' + data.yesCorrect[d].knowledgePoint + '"  description = "' + decodeURI(data.yesCorrect[d].description) + '"><span class="yeCircle">' + name_t+ '</span><span>' + data.yesCorrect[d].studentName + '</span><span>' + month+'    '+day + '</span><i>优秀</i></li>');
                    $('.frend').show();
                    $('.noreply').css('padding-bottom','120px')
                } else {
                    $('.Pending').eq(1).append('<li Id="'+data.yesCorrect[d].id+'"  text_t="'+data.yesCorrect[d].replyDesc+'" text="' + data.yesCorrect[d].replydescription + '" knowledgePoint="' + data.yesCorrect[d].knowledgePoint + '"  description = "' + decodeURI(data.yesCorrect[d].description) + '"><span class="yeCircle">' + name_t + '</span><span>' + data.yesCorrect[d].studentName + '</span><span>' + month+'    '+day + '</span></li>')
                }

            }
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
    });

    $(document).on('touchend','.home_tw li',function(){
        sessionStorage.Teatwo = 1;
        sessionStorage.stuid = $(this).attr('Id');
        sessionStorage.T_text = $(this).attr('text_t');
        sessionStorage.stutext = $(this).attr('text');
        sessionStorage.knowledgePoint = $(this).attr('knowledgePoint');
        sessionStorage.description = $(this).attr('description');
        location.href = 'replydetail_t.html';
    })
});