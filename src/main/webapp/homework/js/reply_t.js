$(function() {
    sessionStorage.removeItem('Teatwo');
    var need = {
        "Tcid": sessionStorage.Tid
    };
    var urlPush;
    if(getRequest('state').state=='JT'||sessionStorage.signal){
        urlPush=url_o2+"/xdfdthome/homework/homeworklist_t.html?state=JT";
    }else{
        urlPush=url_o2+"/xdfdthome/homework/homeworklist_t.html";
    }
    var Homework = {
        'appid': Global.appid,
        'secret': Global.secret,
        'url': urlPush,
        'templateId':TemplateId_home
    };
    $('.frend').hide();
    var arr;
    getMore();
    function getMore(){
        ajax_S(homework_s.t_more, need, function (e) {
            if (e.result) {
                var data = e.data;
                arr = data.notCommit;
                if (data.notCommit.length == 0) {
                    $('.emptyThree').show()
                    $('.loading-back').hide();
                } else {
                    for (var b = 0; b < data.notCommit.length; b++) {
                        if (data.notCommit[b].studentName.length == 2) {
                            var name = data.notCommit[b].studentName;
                        } else {
                            var name = data.notCommit[b].studentName.substr(data.notCommit[b].studentName.length - 2, 2);
                        }
                        $('.Pending').eq(2).append('<li><span class="yeCircle">' + name + '</span><span>' + data.notCommit[b].studentName + '</span></li>')
                    }
                    $('.loading-back').hide();
                }
                if (data.notCorrect.length == 0) {
                    $('.emptyOne').show()
                    $('.loading-back').hide();
                } else {
                    for (var c = 0; c < data.notCorrect.length; c++) {
                        var sdthomFile = e.data.notCorrect[c].sdthomFile;

                        var stuFiles = sdthomFile.sdtCommitHomFile;
                        var teaFiles = e.data.notCorrect[c].tchomFile;
                        var knowledgePoint = encodeURI(e.data.notCorrect[c].knowledgePoint).replace(/'\+'/, '%20');
                        // var replyDesc  = encodeURI(e.data.notCorrect[c].replyDesc).replace(/'\+'/,'%20');
                        var updateTime = encodeURI(e.data.notCorrect[c].updateTime).replace(/'\+'/, '%20');

                        var details = {
                            'StudentAnswer': e.data.notCorrect[c].replydescription,
                            'classCode': e.data.notCorrect[c].classCode,
                            'description': e.data.notCorrect[c].description,
                            'knowledgePoint': knowledgePoint,
                            'replyDesc': e.data.notCorrect[c].replyDesc,
                            'score': e.data.notCorrect[c].score,
                            'studentName': e.data.notCorrect[c].studentName,
                            'tag': e.data.notCorrect[c].tag,
                            'updateTime': updateTime,
                            'homeworkTinfoId': e.data.notCorrect[c].homeworkTinfoId,
                            'className': e.data.notCorrect[c].className,
                            'File': {
                                'StudentHomeworkFile': stuFiles,
                                'TeacherHomeworkFile': teaFiles
                            }
                        };
                        var detailStr = JSON.stringify(details);

                        var timet = data.notCorrect[c].updateTime;
                        var montht = timet.substring(5, timet.indexOf(' ')).replace('-', '.');
                        var dayt = timet.split(' ')[1].substring(0, 5);
                        if (data.notCorrect[c].studentName.length == 2) {
                            var name_ = data.notCorrect[c].studentName
                        } else {
                            var name_ = data.notCorrect[c].studentName.substr(data.notCorrect[c].studentName.length - 2, 2);
                        }
                        $('.Pending').eq(0).append('<li detailStr=' + detailStr + ' Id="' + data.notCorrect[c].id + '" text="' + decodeURIComponent(data.notCorrect[c].replydescription) + '" knowledgePoint="' + data.notCorrect[c].knowledgePoint + '"  description = "' + decodeURIComponent(data.notCorrect[c].description) + '"><span class="yeCircle">' + name_ + '</span><span>' + data.notCorrect[c].studentName + '</span><span>' + montht + '    ' + dayt + '</span></li>')

                    }

                    $('.loading-back').hide();

                }
                if (data.yesCorrect.length == 0) {
                    $('.emptyTwo').show()
                    $('.loading-back').hide();
                } else {
                    for (var d = 0; d < data.yesCorrect.length; d++) {

                        var stuFiles = [];
                        var teaFiles = [];
                        var ReplyFiles = [];
                        var sdthomFile = e.data.yesCorrect[d].sdthomFile;

                        stuFiles = sdthomFile.sdtCommitHomFile;
                        ReplyFiles = sdthomFile.sdtcCommitReply;
                        teaFiles = e.data.yesCorrect[d].tchomFile;

                        var knowledgePoint = encodeURI(e.data.yesCorrect[d].knowledgePoint).replace(/'\+'/, '%20');
                        // var replyDesc  = encodeURI(e.data.yesCorrect[d].replyDesc).replace(/'\+'/,'%20');
                        var updateTime = encodeURI(e.data.yesCorrect[d].updateTime).replace(/'\+'/, '%20');

                        var details = {
                            'StudentAnswer': e.data.yesCorrect[d].replydescription,
                            'classCode': e.data.yesCorrect[d].classCode,
                            'description': e.data.yesCorrect[d].description,
                            'knowledgePoint': knowledgePoint,
                            'replyDesc': e.data.yesCorrect[d].replyDesc,
                            'score': e.data.yesCorrect[d].score,
                            'studentName': e.data.yesCorrect[d].studentName,
                            'tag': e.data.yesCorrect[d].tag,
                            'updateTime': updateTime,
                            'homeworkTinfoId': e.data.yesCorrect[d].homeworkTinfoId,
                            'className': e.data.yesCorrect[d].className,
                            'File': {
                                'RevampFile': ReplyFiles,
                                'StudentHomeworkFile': stuFiles,
                                'TeacherHomeworkFile': teaFiles
                            }
                        };
                        var detailStr = JSON.stringify(details);

                        var time = data.yesCorrect[d].replyTime;
                        var month = time.substring(5, time.indexOf(' ')).replace('-', '.');
                        var day = time.split(' ')[1].substring(0, 5);
                        if (data.yesCorrect[d].studentName.length == 2) {
                            var name_t = data.yesCorrect[d].studentName
                        } else {
                            var name_t = data.yesCorrect[d].studentName.substr(data.yesCorrect[d].studentName.length - 2, 2)
                        }
                        if (data.yesCorrect[d].tag == '1') {
                            $('.Pending').eq(1).append('<li detailStr=' + detailStr + ' Id="' + data.yesCorrect[d].id + '" text_t="' + decodeURIComponent(data.yesCorrect[d].replyDesc) + '" text="' + decodeURIComponent(data.yesCorrect[d].replydescription) + '" knowledgePoint="' + data.yesCorrect[d].knowledgePoint + '"  description = "' + decodeURIComponent(data.yesCorrect[d].description) + '"><span class="yeCircle">' + name_t + '</span><span>' + data.yesCorrect[d].studentName + '</span><span>' + month + '    ' + day + '</span><i>优秀</i></li>');
                            $('.frend').show();
                            $('.noreply').css('padding-bottom', '120px')
                        } else {
                            $('.Pending').eq(1).append('<li detailStr=' + detailStr + ' Id="' + data.yesCorrect[d].id + '"  text_t="' + decodeURIComponent(data.yesCorrect[d].replyDesc) + '" text="' + data.yesCorrect[d].replydescription + '" knowledgePoint="' + data.yesCorrect[d].knowledgePoint + '"  description = "' + decodeURIComponent(data.yesCorrect[d].description) + '"><span class="yeCircle">' + name_t + '</span><span>' + data.yesCorrect[d].studentName + '</span><span>' + month + '    ' + day + '</span></li>')
                        }

                    }
                    $('.loading-back').hide();
                }

            }
        },function(){
            $('.reload').show();
            $('.replyOne').hide();
            $('.noreply').hide();
        });
    }

    $('.reload img').click(function(){
        $('.reload').hide();
        $('.replyOne').show();
        $('.noreply').show();
        getMore();
    })

    $(document).on('tap', '.home_t li', function () {

        sessionStorage.stuid = $(this).attr('Id');
        sessionStorage.removeItem('detailsStrNot');
        sessionStorage.detailsStrNot = $(this).attr('detailStr');
        location.href = 'replydetail_t.html'
    });

    $('.noreplyTitle span:last-of-type').on('touchend', function () {
        if(localStorage.mastTeater){
            alert('您当前的账户为主讲老师，暂仅能查看哦。')
            return false;
        }
        if($(this).attr('one')){
            layer.msg('已催交成功，1分钟内仅能催交一次')
            return false;
        }
        $(this).attr('one','true')
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
        ajax_S(homework_s.t_quck, {'params':[Homework]}, function (e) {
            if (e.result == true) {
                setTimeout(function(){
                    $(this).attr('one','false')
                },60000)
                layer.open({
                    type: 1,
                    area: ['548px', '345px'],
                    shade: [0.2, '#000'],
                    title: '',
                    skin: '',
                    content: $(".homeworkSucc")
                })
            } else {
                $(this).attr('one','false')
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

    $('.frend input').on('tap',function(){
        if(localStorage.mastTeater){
            alert('您当前的账户为主讲老师，暂仅能查看哦。')
            return false;
        }
        location.href = 'sharedranking_t.html?tid='+sessionStorage.Tid
    });

    $(document).on('tap','.home_tw li',function(){
        if($(this).find('i').html()=='优秀'){
           sessionStorage.bangbang = 1;
        }else{
            if(sessionStorage.bangbang){
                sessionStorage.removeItem('bangbang');
            }
        }

        sessionStorage.removeItem('detailsStrYes');
        sessionStorage.detailsStrYes = $(this).attr('detailStr');
        sessionStorage.Teatwo = 1;
        sessionStorage.stuid = $(this).attr('Id');
        location.href = 'replydetail_t.html?Id='+$(this).attr('Id');
    })


});