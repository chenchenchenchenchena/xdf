$(function () {
    var layer1, layer2, loading;
    /*------------------------------------定义存储文件信息变量-----------start-----------------------------*/
    var hwFiles = [];
    var stuAnwersFiles = [];
    var teaReplyFiles = [];

    var replyTimes = [];
    var answerTimes = [];
    var answerT;
    var maxTimesR = 0;//老师最大批复次数
    if(localStorage.enlarge){
        localStorage.removeItem('enlarge')
    }
    
    /*------------------------------------定义存储文件信息变量-------------end---------------------------*/
    var urlPush;
    if (getRequest('state').state == 'JT' || sessionStorage.signal) {
        urlPush = url_o2 + "/xdfdthome/homework/homeworklist_t.html?state=JT";
    } else {
        urlPush = url_o2 + "/xdfdthome/homework/homeworklist_t.html";
    }
    var need = {
        'stuHomeworkId': sessionStorage.stuid,
        'homeworkTinfoId': sessionStorage.Tid,
        'appid': Global.appid,
        'secret': Global.secret,
        'url': urlPush,
        'templateId': TemplateId_home
    };
    var classYHname;
    $('.hwTeacherRankTitle').on('touchend', function () {
        if ($('.hwInfo').css('display') == 'none') {
            $('.hwInfo').show();
            $('.hwRankTitle').css('margin-bottom', '0');
            $('.hwRankTitle').css('border-bottom', '1px solid #ccc');
            $('.hwRankTitle').css('background-image', 'url(../homework/images/jiao11.png)');

        } else {
            $('.hwInfo').hide();
            $('.hwRankTitle').css('margin-bottom', '18px');
            $('.hwRankTitle').css('border-bottom', 'none');
            $('.hwRankTitle').css('background-image', 'url(../homework/images/jiao22222.png)');
        }

    });
    if (GetRequest('Id')) {
        sessionStorage.Teatwo = '0';
    }
    //权限判断
    if(localStorage.mastTeater){
        $('.answer:last').css('display','none');
        $('.hwInfo').show();
        $('.hwRankTitle').css('background-image', 'url(../homework/images/jiao11.png)');
        alert('您当前的账户为主讲老师，暂仅能查看哦。')
    }
    //输入验证
    $('.teBox').on('keyup change', function () {
        if($(this).val().indexOf('"')!=-1){
            $(this).val($(this).val().substr(0,$(this).val().length-1)+'“”')
        }
        $('.teacherword').html('' + $(this).val().length + '/200');
        if ($(this).val().length > 200) {
            console.log(0)
            $('.teacherword').css('color', 'red');
            $(this).val($(this).val().substring(0, 200));
        } else {
            $('.teacherword').css('color', '#808080');
        }
    });
    $('.teBox').on('blur', function () {
        $('.teacherword').html('' + $(this).val().length + '/200')
    });

    //优秀作业

    $(document).on('touchend', '.infoTitle span',function () {
        if(localStorage.mastTeater){
            alert('您当前的账户为主讲老师，暂仅能查看哦。')
            return false;
        }
        if ($(this).css('color') == 'rgb(255, 106, 106)') {
            $(this).css({
                'color': '#fff',
                'background': '#ff6a6a'
            });
            $('.excellent').show();
            $('.excellent').append('<img src="images/excellent.gif" alt="">');
            setTimeout(function () {
                $('.excellent').html('  ');
                $('.excellent').hide();
            }, 1000)
        } else {
            $('.excellent').hide();
            $(this).css({
                'color': '#ff6a6a',
                'border': '1px solid #ff6a6a',
                'background': 'none'
            });
        }
    });
    var e;
    if (sessionStorage.Teatwo) {//已批复
        var buer_last = true;
        if (sessionStorage.bangbang) {
            $('.hmAnswer .infoTitle span').css({
                'color': '#fff',
                'background': '#ff6a6a'
            });
        }
        $('title').html('已批复');
        //获取文件信息
        // ajaxRequest('post', homework_s.t_two, {Tcid: sessionStorage.Tid, Sdtid: sessionStorage.stuid}, function (e) {
        e = JSON.parse(sessionStorage.detailsStrYes);
        if (e.StudentAnswer == undefined || e.StudentAnswer == null || e.StudentAnswer == "undefined") {
            $('.anDes').eq(0).html("");
        } else {
            var homeworkText = decodeURI(e.StudentAnswer).split('|>|');
            answerT = homeworkText.length;
            for (var p = 0; p < homeworkText.length; p++) {
                $('.anSwer').append('<div class="hmAnswer"><div class="infoTitle">作业答案 </div><div class="anDes">' + homeworkText[p] + '</div><div><ul class="voiceBox" ></ul><div class="imgBox"></div><img class="loading-back" src="../common/images/loading.gif" /></div></div>')
            }
            if (sessionStorage.bangbang == '1') {
                $('.hmAnswer:last .infoTitle').append('<span style="color: rgb(255, 255, 255); background: rgb(255, 106, 106);">优秀</span>')
            } else {
                $('.hmAnswer:last .infoTitle').append('<span>优秀</span>')
            }

        }
        $('.kon p:last-of-type').html(decodeURIComponent(decodeURIComponent(e.knowledgePoint)));

        var arr = decodeURIComponent(e.replyDesc).split('|>|');
        if (e.score == undefined || e.score == null || e.score == 'undefined') {
            e.score = '';
        }
        for (var L = 0; L < arr.length; L++) {
            if (arr[L] != '' && arr[L] != " " && arr[L] != undefined && arr[L] != '+' && arr[L] != 'undefined') {
                if (L == arr.length - 1 && e.score != '') {
                    $('.tea_sp').append('<div class="hmAnswer"><div class="infoTitle">老师批复 <h4>得分:<i>' + e.score + '</i></h4></div><div class="anDes">' + arr[L] + '</div><div><ul class="voiceBox"></ul><div class="imgBox"></div><img class="loading-back" src="../common/images/loading.gif" /></div></div>');
                } else {
                    $('.tea_sp').append('<div class="hmAnswer"><div class="infoTitle">老师批复 </div><div class="anDes">' + arr[L] + '</div><div><ul class="voiceBox" ></ul><div class="imgBox"></div></div></div>');
                }
            } else {//描述信息为空

                if (arr.length == 1 && e.score != '') {
                    $('.tea_sp').append('<div class="hmAnswer"><div class="infoTitle">老师批复 <h4>得分:<i>' + e.score + '</i></h4></div><div class="anDes"></div><div><ul class="voiceBox" ></ul><div class="imgBox"></div><img class="loading-back" src="../common/images/loading.gif" /></div></div>');
                } else {
                    if (L == arr.length - 1 && e.score != '') {
                        $('.tea_sp .hmAnswer:last-of-type').find('.infoTitle').append('<h4>得分:<i>' + e.score + '</i></h4>')
                    }
                    if (arr[L] != 'undefined') {
                        $('.tea_sp').append('<div class="hmAnswer"><div class="infoTitle">老师批复 </div><div class="anDes"></div><div><ul class="voiceBox"></ul><div class="imgBox"></div><img class="loading-back" src="../common/images/loading.gif" /></div></div>');
                    }
                }
            }
        }
        if (arr.length > 0 && $('.tea_sp .hmAnswer').length == 0) {
            if (e.score != '') {
                $('.tea_sp').append('<div class="hmAnswer"><div class="infoTitle">老师批复 <h4>得分:<i>' + e.score + '</i></h4></div><div class="anDes"></div><div><ul class="voiceBox" ></ul><div class="imgBox"></div><img class="loading-back" src="../common/images/loading.gif" /></div></div>');
            } else {
                $('.tea_sp').append('<div class="hmAnswer"><div class="infoTitle">老师批复 </div><div class="anDes"></div><div><ul class="voiceBox"></ul><div class="imgBox"></div><img class="loading-back" src="../common/images/loading.gif" /></div></div>');
            }
        }

        $('.hwCon').eq(0).html(decodeURIComponent(e.description));
        getFileInfo(e);

        // });

    } else {//待批复
        $('.hmAnswer').eq(1).hide();
        //获取文件信息
        // ajaxRequest('post', homework_s.t_modi, {Tcid: sessionStorage.Tid, Sdtid: sessionStorage.stuid}, function (e) {
            e = JSON.parse(sessionStorage.detailsStrNot);
            console.log(e);
            classYHname = e.className;
            $('.anDes').eq(0).html();
            $('.kon p:last-of-type').html(decodeURIComponent(decodeURIComponent(e.knowledgePoint)));
            $('.hwCon').eq(0).html(decodeURIComponent(e.description));
            // var stu = e.File.StudentHomeworkFile;
            // var tea = e.File.TeacherHomeworkFile;
            // for (var a = 0; a < stu.length; a++) {
            //     stuAnwersFiles.push(stu[a].diskFilePath);
            // }
            // for (var b = 0; b < tea.length; b++) {
            //     hwFiles.push(tea[b].diskFilePath);
            // }
            $('.anSwer').append( '<div class="hmAnswer"><div class="infoTitle">作业答案 </div><div class="anDes">'+decodeURIComponent(e.StudentAnswer)+'</div><div><ul class="voiceBox"></ul><div class="imgBox" id="imagBox_3" style="display:block;"></div><img class="loading-back" src="../common/images/loading.gif" /></div></div>')
            $('.hmAnswer:last .infoTitle').append('<span>优秀</span>')
            getFileInfo(e);
        // });
    }

    /**
     * 调取接口获取文件展示信息
     * @param e
     */
    function getFileInfo(e) {
        $('.loading-back').show();
        var tea = e.File.RevampFile;//老师批注
        var stu = e.File.StudentHomeworkFile;//学生答案
        var tea_t = e.File.TeacherHomeworkFile;//作业信息
        if (stu != undefined) {
            for (var a = 0; a < stu.length; a++) {
                stuAnwersFiles.push({'fullPath': stu[a].diskFilePath,'fileTimes': stu[a].commitTimes});
            }
        }
        if (tea_t != undefined) {
            for (var c = 0; c < tea_t.length; c++) {
                hwFiles.push({'fullPath': tea_t[c].diskFilePath});

            }
        }
        if (tea != undefined) {

            for (var b = 0; b < tea.length; b++) {
                teaReplyFiles.push({'fullPath': tea[b].diskFilePath});
                replyTimes.push(parseInt(tea[b].replyTimes));
                if(parseInt(tea[b].replyTimes) > maxTimesR){
                    maxTimesR = parseInt(tea[b].replyTimes);
                }
            }
        }
        replyTimes.sort();
        if(!(stuAnwersFiles.length == 0 && hwFiles.length == 0 && teaReplyFiles.length == 0)){

            var params = {
                'fileSfullPath': stuAnwersFiles,
                'fileTfullPath': hwFiles,
                'fileRfullPath': teaReplyFiles
            };
            ajaxRequest("POST", homework_s.t_getFileDetails, JSON.stringify(params), getHwFilesSucess,errorFile);
        }

    }

    /**
     * 获取文件信息接口回调函数
     * @param e
     */
    function getHwFilesSucess(e) {
        if (e.code == 200) {
            var stu = e.data.fileS;//学生答案
            var tea_t = e.data.fileT;//作业信息
            if (stu != undefined) {
                for (var a = 0; a < stu.length; a++) {
                    if (stu[a].fileType == 'mp3') {
                        getAudioInfo([2, url_o + stu[a].relativePath, stu[a].playTime, "mp3"],['ansT',parseInt(stu[a].fileTimes-1)]);
                    } else {
                        //$('.imgBox').eq(stu[a].fileTimes).append('<div><img data-id="'+stu[a].diskFilePath+'" data-ramke="2"  onerror=javascript:this.src="images/error-image.png" data-thumbnail="' + stu[a].thumbnail + '" data-img="' + url_o + stu[a].relativePath + '" src="images/error-image.png" alt="" /></div>')
                        $('.anSwer .hmAnswer:eq(' + parseInt(stu[a].fileTimes-1) + ')').find('.imgBox').append('<div><img data-id="'+stu[a].diskFilePath+'" data-ramke="2"  onerror=javascript:this.src="images/error-image.png" data-thumbnail="' + stu[a].thumbnail + '" data-img="' + url_o + stu[a].relativePath + '" src="images/error-image.png" alt="" /></div>')
                    }
                }

                for (var k = 0; k < $('.anSwer .hmAnswer').length; k++) {
                    var l = $('.anSwer .hmAnswer').eq(k).find('img').length;
                    for (var g = 0; g < l; g++) {
                        $('.anSwer .hmAnswer').eq(k).find('img').eq(g).attr('src', $('.anSwer .hmAnswer').eq(k).find('img').eq(g).attr('data-thumbnail'));
                    }
                }
            }
            if (tea_t != undefined) {
                for (var c = 0; c < tea_t.length; c++) {
                    if (tea_t[c].fileType == 'mp3') {
                        getAudioInfo([1, url_o + tea_t[c].relativePath, tea_t[c].playTime, "mp3"]);
                    } else {
                        $('.imgBox').eq(0).append('<div><img data-id="'+tea_t[c].diskFilePath+'"  onerror=javascript:this.src="images/error-image.png" data-ramke="1" data-thumbnail="' + tea_t[c].thumbnail + '"  data-img="' + tea_t[c].fileUrl + '" src="images/error-image.png" alt="" /></div>')

                    }
                }
                for (var j = 0; j < $('.imgBox').eq(0).find('img').length; j++) {

                    $('.imgBox').eq(0).find('img').eq(j).attr('src', $('.imgBox').eq(0).find('img').eq(j).attr('data-thumbnail'));

                }
            }
            if (sessionStorage.Teatwo) {

                sessionStorage.removeItem('Teatwo');
                var tea = e.data.fileR;//老师批注
                if (tea != undefined) {
                    for (var b = 0; b < tea.length; b++) {
                        var lenR = $('.tea_sp .hmAnswer').length;
                        var delt = 1;
                        if (maxTimesR > lenR) {
                            delt = maxTimesR - lenR +1;
                        }
                        if (tea[b].fileType == 'mp3') {
                            getAudioInfo([3, url_o + tea[b].relativePath, tea[b].playTime, "mp3"], ['replayT', parseInt(replyTimes[b] - delt)]);
                        } else {
                            $('.tea_sp .hmAnswer:eq(' + parseInt(replyTimes[b] - delt) + ')').find('.imgBox').append('<div><img data-id="'+tea[b].diskFilePath+'"  onerror=javascript:this.src="images/error-image.png" data-thumbnail="' + tea[b].thumbnail + '" data-ramke="3" data-img="' + tea[b].fileUrl + '" src="images/error-image.png" alt="" /></div>');
                            // $('.imgBox').eq(2).append('<div><img src="'+tea[b].url + '" alt="" /></div>')
                        }
                    }
                }
                for (var i = 0; i < $('.tea_sp .hmAnswer').length; i++) {
                    if ($('.tea_sp .hmAnswer:eq(' + i + ')').find('.voiceBox').html() == "" && $('.tea_sp .hmAnswer:eq(' + i + ')').find('.imgBox').html() == "" && $('.tea_sp .hmAnswer:eq(' + i + ')').find('.anDes').length <= 0) {
                        // $('.tea_sp .hmAnswer:eq(' + i + ')').hide();
                    }
                }
                //将页面里的img默认图片换成图片的缩略地址
                //老师批复
                for (var k = 0; k < $('.tea_sp .hmAnswer').length; k++) {
                    var l = $('.tea_sp .hmAnswer').eq(k).find('img').length;
                    for (var g = 0; g < l; g++) {
                        $('.tea_sp .hmAnswer').eq(k).find('img').eq(g).attr('src', $('.tea_sp .hmAnswer').eq(k).find('img').eq(g).attr('data-thumbnail'));
                    }
                }
            }

            $('.loading-back').hide();
        }
    }
    var layerE;
    function errorFile(){
        //if(layerE == undefined){
            layerE = layer.open({
                type: 1,
                area: ['548px', '345px'],
                shade: [0.2, '#000'],
                title: '',
                skin: '',
                content: $(".file-fail")
            })
        //}


    }

    // 取消
    $(document).on('touchend', '.file-fail .cancelBtn', function () {
        layer.close(layerE);
        $('.loading-back').hide();
    });
    // 确定
    $(document).on('touchend', '.file-fail .confirmBtn', function () {
        layer.close(layerE);
        getFileInfo(e);

    });



    /*----------------------------------以上是接口处理方法--------------------------------------------*/

    var voiceCount = 0;

    /**
     * 获取语音信息
     * flag: 区分是 老师作业信息部分的语音，还是学生答案语音，还是老师批复语音 ，方式ID重复（播放语音需要ID）
     * diskFileUrl: 语音地址
     * hwFlag:hwFlag[0]作业标识，区分老师批复还是其他 replayT（老师批复）,hwFlag[1] 老师批复次数，0开始
     */
    function getAudioInfo(fileArray, hwFlag) {
        var flag = fileArray[0];
        var diskFileUrl = fileArray[1];
        var playTime = fileArray[2];
        if (hwFlag != undefined && hwFlag[0] == 'replayT') {//老师批复
            //将文件显示到布局中
            voiceCount++;
            replayTShowAudio(playTime, diskFileUrl, "audio" + flag + "" + hwFlag[1] + "_" + voiceCount, hwFlag[1]);
        } else if(hwFlag != undefined && hwFlag[0] == 'ansT'){
            voiceCount++;
            answerTShowAudio(playTime, diskFileUrl, "audio" + flag + "" + hwFlag[1] + "_" + voiceCount, hwFlag[1]);
        }else {
            //将文件显示到布局中
            voiceCount++;
            //var numa = flag;
            //if(flag==1){
            //     numa = 1;
            //}
            //console.log(flag)
            showAudio(playTime, diskFileUrl, $("#audio_" + flag), "audio" + flag + "" + voiceCount, 2);
        }


    }

    /**
     * 显示语音布局
     * @param playTime  语音播放时长
     * @param url 语音播放地址
     * @param parentId  语音布局需要添加到的父节点
     * @param id  语音控件id，播放时需要
     * @param flag 1：表示语音布局可以删除；2：表示不可以删除
     */
    function showAudio(playTime, url, parentId, id, flag) {

        parentId.show();
        var strVoice = "";
        var idChildren;
        var length = parseInt(playTime);
        var voiceLen = "";
        var hh = parseInt(length / 3600);
        var mm = parseInt((length % 3600) / 60);
        var ss = parseInt((length % 3600) % 60);
        if (hh > 0) {
            voiceLen = hh + "'" + mm + "'" + ss + "''";
        } else if (mm > 0) {
            voiceLen = mm + "'" + ss + "''";
        } else {
            if (ss == 0) {

                voiceLen = "1''";
            } else {
                voiceLen = ss + "''";
            }
        }
        if (flag == 1) {
            idChildren = "record_audio" + id;
            //录音布局，可以删除
            strVoice += "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto' data-time='" + playTime + "'><source src='" + url + "' type='audio/mpeg'></audio>" +
                "<i class='play-icon'></i><span class='stuVoice'></span></div><span class='voice_lenth'>" + voiceLen + "</span></li>";
        } else {

            idChildren = "audio_" + id;
            strVoice += "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto' data-time='" + playTime + "'><source src='" + url + "' type='audio/mpeg'></audio>" +
                "<i class='play-icon'></i></div><span class='voice_lenth'>" + voiceLen + "</span></li>";
        }

        parentId.append(strVoice);

        $('.song_s,.mask').hide();
        $('.big_back').hide();
        // 语音大于三张，隐藏添加语音按钮
        if ($('.notsubmit #record_audio_box li').length >= 3) {
            $('#record').hide();
        }
    }

    /**
     * 显示语音布局
     * @param playTime  语音播放时长
     * @param url 语音播放地址
     * @param id  语音控件id，播放时需要
     * @param domIndex 老师批复次数 显示布局用
     */
    function replayTShowAudio(playTime, url, id, domIndex) {
        console.log(id + "---" + domIndex);
        var strVoice = "";
        var idChildren;
        var length = parseInt(playTime);
        var voiceLen = "";
        var hh = parseInt(length / 3600);
        var mm = parseInt((length % 3600) / 60);
        var ss = parseInt((length % 3600) % 60);
        if (hh > 0) {
            voiceLen = hh + "'" + mm + "'" + ss + "''";
        } else if (mm > 0) {
            voiceLen = mm + "'" + ss + "''";
        } else {
            if (ss == 0) {

                voiceLen = "1''";
            } else {
                voiceLen = ss + "''";
            }
        }
        idChildren = "audio_" + id;
        strVoice = "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto' data-time='" + playTime + "'><source src='" + url + "' type='audio/mpeg'></audio>" +
            "<i class='play-icon'></i></div><span class='voice_lenth'>" + voiceLen + "</span></li>";

        $('.tea_sp .hmAnswer:eq(' + domIndex + ')').find('.voiceBox').append(strVoice);

        $('.song_s,.mask').hide();
    }

    /**
     * 显示语音布局
     * @param playTime  语音播放时长
     * @param url 语音播放地址
     * @param id  语音控件id，播放时需要
     * @param domIndex 学生回答次数 显示布局用
     */
    function answerTShowAudio(playTime, url, id, domIndex) {
        //console.log(id + "---" + domIndex);
        var strVoice = "";
        var idChildren;
        var length = parseInt(playTime);
        var voiceLen = "";
        var hh = parseInt(length / 3600);
        var mm = parseInt((length % 3600) / 60);
        var ss = parseInt((length % 3600) % 60);
        if (hh > 0) {
            voiceLen = hh + "'" + mm + "'" + ss + "''";
        } else if (mm > 0) {
            voiceLen = mm + "'" + ss + "''";
        } else {
            if (ss == 0) {

                voiceLen = "1''";
            } else {
                voiceLen = ss + "''";
            }
        }
        idChildren = "audio_" + id;
        strVoice = "<li class='audio_box'><div><audio id='" + idChildren + "'preload='auto' data-time='" + playTime + "'><source src='" + url + "' type='audio/mpeg'></audio>" +
            "<i class='play-icon'></i></div><span class='voice_lenth'>" + voiceLen + "</span></li>";

        $('.anSwer .hmAnswer:eq(' + domIndex + ')').find('.voiceBox').append(strVoice);

        $('.song_s,.mask').hide();
    }

    //提交确认
    $('.sub_p').on('touchend', function () {
        $('.areyok').show();
    });
    $('.areyok input:first-of-type').on('touchend', function () {
        $(".areyok").hide();
        $('.big_back').hide();
    });
    //批改作业提交
    $('.areyok input:last-of-type').on('touchend', function () {
        $(".areyok").hide();
        var arr_s = [];
        if ($(this).css('background') == 'rgb(204, 204, 204) none repeat scroll 0% 0% / auto padding-box border-box') {
            layer.msg('正在提交，请稍等');
            return false;
        }
        var buer = false;
        $(this).css('background', 'rgb(204, 204, 204) none repeat scroll 0% 0% / auto padding-box border-box');
        if (sessionStorage.bangbang) {
            if ($('.infoTitle span').css('color') == 'rgb(255, 106, 106)') {
                buer = true;
            }
        } else {
            if ($('.infoTitle span').css('color') == 'rgb(255, 106, 106)') {
                buer = false;
            } else {
                buer = true;
            }
        }
        if ($('.teBox').val() == '' && $('.notsubmit li').length == 0 && $('#record_audio_box li').length == 0 && buer == false && buer_last == false) {
            layer.msg('批复不能为空');
            $('.areyok').hide();
            $('.areyok input:last-of-type').css('background', '#00ba97');
            return false;
        }

        if(arr_voice.length > 3){
            layer.msg('语音最多只能录制三条');
            return false;
        }
        if(arr_voice.length > 3){
            layer.msg('图片最多上传三张');
            return false;
        }

        if ($('.infoTitle span').css('color') == 'rgb(255, 106, 106)') {
            need.tag = '0'
        } else {
            need.tag = '1'
        }
        need.replyDesc = '';
        arr_s = arr_voice.concat(arr_image);
        need.fileInfo = arr_s;
        var grade_h = '';
        if ($('.homeGrade').val() == '') {
            if ($('.hmAnswer:last-of-type').find('.infoTitle h4 i').html() == '' || $('.hmAnswer:last-of-type').find('.infoTitle h4 i').html() == undefined) {
                grade_h = '';
            } else {
                grade_h = $('.hmAnswer:last-of-type').find('.infoTitle h4 i').html()
            }
        } else {
            grade_h = $('.homeGrade').val()
        }
        need.score = grade_h;
        if ($('.tea_sp .hmAnswer').length != 0) {
            // alert("已批复长度"+$('.tea_sp .hmAnswer').length);
            for (var o = 0; o < $('.tea_sp .hmAnswer').length; o++) {
                if ($('.tea_sp .hmAnswer').eq(o).find('.anDes').html() != undefined && $('.tea_sp .hmAnswer').eq(o).find('.anDes').html() != "") {

                    need.replyDesc += encodeURIComponent($('.tea_sp .hmAnswer').eq(o).find('.anDes').html() + '|>|').replace(/'\+'/, '%20');
                } else {
                    if ($('.tea_sp .hmAnswer').eq(o).find('div .voiceBox').html() == "" && $('.tea_sp .hmAnswer').eq(o).find('.imgBox').html() == "") {

                        //if ($('.tea_sp .hmAnswer').length == 1) {
                        //    need.replyDesc += ' |>|';
                        //}else {
                            need.replyDesc += 'undefined|>|';
                        //}

                    } else {
                        need.replyDesc += ' |>|';
                    }

                }
                if (o == $('.tea_sp .hmAnswer').length - 1) {
                    var curDesc = $('.answer textarea').val();
                    if (curDesc == "" || curDesc == undefined) {
                        if (arr_s.length == 0) {
                            curDesc = "undefined"
                        } else {
                            curDesc = " ";
                        }

                    }
                    need.replyDesc += encodeURIComponent(curDesc).replace(/'\+'/, '%20');
                }

            }
            need.replyTimes = $('.tea_sp .hmAnswer').length + 1;
        } else {
            var curDesc = $('.answer textarea').val();
            if (curDesc == "" || curDesc == undefined) {
                if (arr_s.length == 0) {
                    need.replyDesc = 'undefined';
                } else {
                    need.replyDesc = ' ';
                }
            } else {
                need.replyDesc = encodeURIComponent(curDesc).replace(/'\+'/,'%20');
            }
            need.replyTimes = '1'
        }
        need.className = classYHname;
        ajax_S(homework_s.t_succ, need, function (e) {
            if (e.result == true) {
                $('.big_back').show();
                $('.succ').show();
                $('.areyok input:last-of-type').css('background', '#00ba97');
            } else {
                $('.erro p').html(e.message);
                $('.big_back').show();
                $('.erro').show();
            }
        })


    });
    //状态点击
    $('.succ input').on('touchend', function () {
        $('.big_back').hide();
        $('.succ').hide();
        location.href = 'reply_t.html';
    });

    $('.erro input:first-of-type').on('touchend', function () {
        $('.big_back').hide();
        $('.erro').hide();
    });

    $('.erro input:last-of-type').on('touchend', function () {
        $('.big_back').hide();
        $('.erro').hide();
        ajax_S(homework_s.t_succ, need, function (e) {
            if (e.result == true) {
                $('.big_back').show();
                $('.succ').show();
                $('.Submit_s').css('background', '#00ba97');
            } else {
                $('.erro p').html(e.message);
                $('.big_back').show();
                $('.erro').show();
            }
        })
    });

    $('.big_whit').on('touchend', function () {
        setTimeout(function () {
            $('.big_whit').hide();
        }, 300);
        $('.song_s').hide();
        $('.big_back').hide();
    });

    $('.big_back').on('touchstart', function () {
        if ($('.class_name').css('display') == 'block') {
            $('.class_name').animate({'bottom': '-438px'});
            setTimeout(function () {
                $('.big_back').hide();
            }, 300);
            $('.class_name i').html('0');
            $('.class_name img').attr('src', 'images/C05_06.png');
            if ($('.class_name i').html() == '0') {
                $('.class_s i').html('')
            }
        }
        if ($('.succ').css('display') == 'block') {
            setTimeout(function () {
                $('.big_back').hide();
            }, 300);
            $('.succ').hide();
        }
        if ($('.erro').css('display') == 'block') {
            setTimeout(function () {
                $('.big_back').hide();
            }, 300);
            $('.erro').hide();
        }
    });


    var recordCount = 0;//判断语音录制条数
    //语音
    $('.Voice').on('touchend', function () {
        if (recordCount >= 3) {
            alert("最多录制三条语音");
        } else {
            $('.big_whit').show();
            $('.song_s').show();
            $('.big_back').show();
        }
    });

    //按下开始录音
    var timeInedex = 0;
    var recordTimer;
    var isCanStopRecord = false;
    var isCanStartRecord = true;
    var START = "";
    var END = "";
    $('#record').on('touchstart', function (event) {
        if(!isCanStartRecord){
            return;
        }
        START = new Date().getTime();
        timeInedex = 0;
        var this_ = $(this);
        $(this).siblings('img').attr('src', 'images/speak.gif');
        event.preventDefault();
        wx.startRecord({
            success: function () {
                localStorage.rainAllowRecord = 'true';
                recordTimer = setInterval(function () {
                    timeInedex++;
                    if(timeInedex == 49){
                        //layer.msg("语音录制长度最大限度为60s");
                        djs(10, function () {
                            //$(".timeTip").hide();
                            isCanStopRecord = true;
                            stopRecordBack(this_,event);
                        });
                    }
                }, 1000);
            },
            cancel: function () {
                layer.msg('用户拒绝授权录音');
                wx.stopRecord({
                    success: function (res) {
                        clearInterval(recordTimer);
                        $('.song_s').hide();
                        $('.big_whit').hide();
                        $('.big_back').hide();
                        this_.siblings('img').attr('src', 'images/C04-03.png');
                        isCanStartRecord = true;
                        isCanStopRecord = false;
                    }
                });
            },
            fail: function () {
                wx.stopRecord({
                    success: function (res) {
                        clearInterval(recordTimer);
                        $('.song_s').hide();
                        $('.big_whit').hide();
                        $('.big_back').hide();
                        this_.siblings('img').attr('src', 'images/C04-03.png');
                        isCanStartRecord = true;
                        isCanStopRecord = false;
                    }
                });
            }
        });
    });
    var ts;
    function djs(t, callback) {
        ts = setInterval(function () {
            layer.msg(t);
            t -= 1;
            if (t == 0) {
                clearInterval(ts);
                callback(callback);
            }
        },1000)
    }
    var song_s = '';
    //松手结束录音
    $('#record').on('touchend', function (event) {
        var this_ = $(this);
        if(timeInedex == 0){
            setTimeout(function () {
                END = new Date().getTime();
                if ((END - START) < 1500) {
                    END = 0;
                    START = 0;
                    //小于1000ms，不录音
                    clearTimeout(recordTimer);
                    wx.stopRecord({
                        success: function (res) {
                            clearInterval(recordTimer);
                            $('.song_s').hide();
                            $('.big_whit').hide();
                            $('.big_back').hide();
                            this_.siblings('img').attr('src', 'images/C04-03.png');
                            isCanStartRecord = true;
                            isCanStopRecord = false;
                            layer.msg("录制时间太短");
                        },
                        fail: function () {
                            layer.msg("录制时间太短");
                            clearInterval(recordTimer);
                            $('.song_s').hide();
                            $('.big_whit').hide();
                            $('.big_back').hide();
                            this_.siblings('img').attr('src', 'images/C04-03.png');
                            isCanStartRecord = true;
                            isCanStopRecord = false;
                        }
                    });
                    return false;
                } else {

                    //表示录制刚结束
                    return false;
                }
            }, 300);
        } else {
            isCanStopRecord = true;
            stopRecordBack(this_, event);
        }

    });

    function stopRecordBack(this_,event){
        clearInterval(ts);
        if(!isCanStopRecord){
            return;
        }
        this_.siblings('img').attr('src', 'images/C04-03.png');
        event.preventDefault();

        //if (timeInedex < 1) {
        //    //小于1000ms，不录音
        //    clearInterval(recordTimer);
        //    timeInedex = 0;
        //    layer.msg("录制时间太短");
        //    wx.stopRecord({
        //        success: function (res) {
        //            isCanStartRecord = true;
        //            isCanStopRecord = false;
        //        }
        //    });
        //    return;
        //}
        clearInterval(recordTimer);
        timeInedex = 0;
        wx.stopRecord({
            success: function (res) {
                var localId = res.localId;
                song_s = localId;
                uploadVoiceWX(localId);
                $('.song_s').hide();
                $('.big_whit').hide();
                $('.big_back').hide();
                isCanStartRecord = true;
                isCanStopRecord = false;
            }
        });
    }

    //上传微信服务器，获取保存的serverId
    function uploadVoiceWX(upId) {
        $('.big_back').show();
        //调用微信的上传录音接口把本地录音先上传到微信的服务器
        //不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
        wx.uploadVoice({
            localId: upId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                uploadVoice(res.serverId);
            },
            complete: function () {
                //接口调用完成（失败成功）
                $('.big_back').hide();
            },
            fail: function (res) {
                $('.big_back').hide();
            }
        });
    }

    var arr_s = [];
    var arr_voice = [];
    var arr_image = [];
    //将serverId上传到自己服务器
    function uploadVoice(serverId) {
        var cbconfig = {
            'appId': appId,
            'appSecret': secreT,
            'mediaId': serverId,
            'schoolId': localStorage.schoolId,
            'classId': sessionStorage.classCode_s
        };
        ajaxRequest("Post",url_o + "upload/uploadAudio.do",cbconfig,function(e){
            $('.big_back').hide();
            if (e.status == "failure") {
                layer.msg(e.msg);
            } else {
                if (e.data.success) {
                    arr_voice.push({
                        'fileName': e.data.fileName,
                        'fileType': e.data.fileType,
                        'fileSize': e.data.fileSize,
                        'diskFilePath': e.data.diskFilePath
                    });
                    layer.open({
                        type: 1,
                        area: ['548px', '345px'],
                        shade: [0.2, '#000'],
                        title: '',
                        skin: '',
                        time: 3000,
                        content: $(".music_succ")
                    });
                    getRecordInfo(e.data.diskFilePath);
                }
                else {
                    layer.msg("语音上传失败");
                }
            }
        });
    }

    /**
     * 获取录制语音信息
     */
    function getRecordInfo(diskFileUrl) {
        var optionFile = {"fullPath": diskFileUrl};
        ajaxRequest("Post",url_o + "upload/getMp3Url.do",optionFile,function(e){
            if (e.status == "failed") {
                layer.msg("语音获取失败");
            } else {
                //显示语音布局
                showAudio(e.data.playTime, url_o + e.data.fullPath, $('#record_audio_box'), recordCount, 1);
                recordCount++;

            }
        });
    }

    var imgCount = 0;
    //图片上传
    $('.image_s').click(function () {
        imgCount = $('.notsubmit .imgBox li').length;
        //重新选择图片，追加图片，max = 3；
        var count = 3 - imgCount;
        wx.chooseImage({
            count: count,
            success: function (res) {

                if (res.localIds.length > 0) {

                    //上传服务器
                    upLoadWxImage(res);
                }


            }
        });
    });

    /**
     * 上传微信服务器
     * @param images
     */
    function upLoadWxImage(images) {

        if (images.localIds.length == 0) {
            alert('请先使用 chooseImage 接口选择图片');
            return;
        }
        $('.big_back').show();
        var i = 0, length = images.localIds.length;

        function upload() {
            wx.uploadImage({
                localId: images.localIds[i],
                success: function (res) {
                    i++;
                    // serverIds.push(res.serverId);
                    // $('.teBox').val(res.serverId + "$" + images.localIds[i - 1]);
                    uploadImage(res.serverId, images.localIds[i - 1]);
                    if (i < length) {
                        upload();
                    }
                },
                fail: function (res) {
                    $('.big_back').hide();
                }
            });
        }

        upload();
    }

    /**
     * 图片上传到自己服务器
     */
    function uploadImage(serverId, localID) {
        var cbconfig = {
            'appId': appId,
            'appSecret': secreT,
            'mediaId': serverId,
            'schoolId': localStorage.schoolId,
            'classId': sessionStorage.classCode_s
        };
        ajaxRequest("Post",url_o + "upload/uploadFileByWeiChat.do",cbconfig,function(e){
            $('.big_back').hide();
            if (e.status == "failure") {
                // alert(e.msg);
                layer.msg('图片上传失败');

            } else if (e.status == "succeed") {
                showUpdataImage(localID);
                arr_image.push({
                    'fileName': e.data.fileName,
                    'fileType': e.data.fileType,
                    'fileSize': e.data.fileSize,
                    'diskFilePath': e.data.diskFilePath
                });


            }

        });

    }

    function showUpdataImage(url) {

        var str = "<li><span class='stuImg' img-index='" + imgCount + "'></span><img isEdit='0' data-img='" + url + "' src='" + url + "'/></li>";

        $(".notsubmit .imgBox").show();
        $(".notsubmit .imgBox").append(str);
        //界面样式控制
        if ($('.notsubmit .imgBox li').length >= 3) {
            $('.image_s').hide();
        }

    }

    /*-------------------- 删除图片 --------------------*/
    $(document).on('touchend', '.stuImg', function () {
        // alert($(this).parent('li').index());
        $('.delete-img .confirmBtn').attr('img-index', $(this).parent('li').index());
        layer.close(layer1);
        layer.close(layer2);
        //删除图片
        layer2 = layer.open({
            type: 1,
            area: ['548px', '345px'],
            shade: [0.2, '#000'],
            title: '',
            skin: '',
            content: $(".delete-img")
        })
    });
    // 删除图片-取消
    $(document).on('touchend', '.delete-img .cancelBtn', function () {
        layer.close(layer1);
        layer.close(layer2);
    });
    // 删除图片-确定
    $(document).on('touchend', '.delete-img .confirmBtn', function () {

        var index = parseInt($(this).attr('img-index'));
        layer.close(layer1);
        layer.close(layer2);
        if ($('.imgBox').find('li').length < 1) {
            $('.imgBox').hide();
        }

        $('.notsubmit .imgBox li:eq(' + index + ')').remove();
        // 图片小于三张，显示添加图片按钮
        if ($('.notsubmit .imgBox').children('div').length < 3) {
            $('.image_s').show();
        }
        if (arr_image.length > 0) {
            arr_image.splice(index, 1);
        }
    });
    var Index_Last;
    $(document).on('tap', '.hwInfo img', function () {
        var previewUrl = $(this).attr('data-id');
        lookBigImage(previewUrl,false);

    });
    $(document).on('tap', '.tea_sp img', function () {
        var previewUrl = $(this).attr('data-id');
        lookBigImage(previewUrl,false);
    });
    $(document).on('touchend', '.anSwer img', function () {
        if(localStorage.mastTeater){
            return false;
        }
        var previewUrl = $(this).attr('data-id');
        var preview = $(this).attr('data-thumbnail');
        $('.load img').attr('src',preview);
        $('.load').show();
        cnv(0,'load_one',20)
        
        lookBigImage(previewUrl,true);
    });

    // $('.pinch-zoom').each(function () {
    //     new RTP.PinchZoom($(this), {enabled:true});
    // });
    /*--------------------图片预览----------------------------------*/
    $(document).on('touchend', '.hmAnswer #imagBox_2 img', function () {
        $('.pinch-zoom-container').eq(0).show();
        $('.esc_s').show()
        Index_Last = $(this).parent().index();

        var previewUrl = $(this).attr('data-id');
        lookBigImage(previewUrl,true);



    });
    $(document).on('tap', '.notsubmit .imgBox img', function () {
        var previewUrl = $(this).attr('data-img');
        var isEdit = $(this).attr('isEdit');

        //isEdit==1 表示老师编辑后的图片；
        if(isEdit == 1){
            lookBig(previewUrl);
        }else {
            // isEdit== 0或者undefind  表示从本地相册选的图片
            wx.previewImage({
                current: previewUrl, // 当前显示图片的http链接
                urls: [previewUrl] // 需要预览的图片http链接列表
            });
        }
    });

    function lookBigImage(diskPath,saveServer) {
        var params = {
            'fullPath':diskPath,
            'saveServer':saveServer
        }
        ajaxRequest("POST", homework_s.t_getImgeUrl, params, function (e) {
            var previewUrl = e;
            if (saveServer) {
                cnv(20,'load_one',60)
                //true:返回服务器所在的地址，false:返回云盘的预览地址
                previewUrl =   url_o+   previewUrl;
                lookBig(previewUrl);
                // setTimeout(function () {
                   

                // }, 300)
            } else {
                wx.previewImage({
                    current: previewUrl, // 当前显示图片的http链接
                    urls: [previewUrl] // 需要预览的图片http链接列表
                });
            }
        });


    }
    function lookBig(previewUrl){
        $('.big_back_s canvas').hide();
        $('.big_back_s').show();
        $('.big_back_s img').attr('src', previewUrl);

        $('.big_back_s img').load(function(){
            cnv(60,'load_one',100);
            $('.big_back_s img').css({
                'margin-top': -parseInt($('.big_back_s img').css('height')) / 2,
                'margin-left': -parseInt($('.big_back_s img').css('width')) / 2
            });
            $('.big_back_s canvas').css({
                'margin-top': -parseInt($('.big_back_s img').css('height')) / 2,
                'margin-left': -parseInt($('.big_back_s img').css('width')) / 2
            });
            setTimeout(function(){
                $('.load').hide();
            },500)
        })
        $('.big_back_s img').error(function(){
            alert('图片加载失败，正在重新加载');
            location.reload();
        })
    }

    // $('.big_back_s').on('touchend', function () {
    //     if($('.true_s').css('display')!='block'&&event.touches.length==0){
    //         $(this).find('canvas').hide();
    //         $(this).find('img').show();
    //         $(this).find('.esc_s').hide();
    //         $(this).find('.true_s').hide();
    //         $(this).find('span:last-of-type').show();
    //         $(this).hide();
    //         $('body').css('overflow', 'auto');
    //         $('body').css('overflow-x', 'hidden')
    //     }
    // });
    function stopDrop() {
        var lastY;//最后一次y坐标点
        $(document.body).on('touchstart', function (event) {
            lastY = event.originalEvent.changedTouches[0].clientY;//点击屏幕时记录最后一次Y度坐标。
        });
        $(document.body).on('touchmove', function (event) {
            var y = event.originalEvent.changedTouches[0].clientY;
            var st = $(this).scrollTop(); //滚动条高度
            if (y >= lastY && st <= 10) {//如果滚动条高度小于0，可以理解为到顶了，且是下拉情况下，阻止touchmove事件。
                lastY = y;
                event.preventDefault();
            }
            lastY = y;

        });
    }

    stopDrop();
    $('.esc_s').on('touchend', function () {
        clearInterval(time_s);
        $('.big_back_s').hide();
        $('.big_back_s canvas').hide();
        $('.big_back_s img').show();
        $('.pinch-zoom-container').show();
        $('.big_back_s .true_s').hide();
        $('.big_back_s span:last-of-type').show();
        $('.big_back_s').hide();
        $('body').css('overflow-y', 'auto');
        $('.true_s').unbind('touchend');
        $('.doHomework').show();
        localStorage.removeItem('enlarge')
        
    });
    $('.esc_s').show();
    var time_s;
    var b = new Base64();
    var str;
    var ber_L = true;
    $('.big_back_s span:last-of-type').on('touchend', function () {
        clearInterval(time_s);
        var width_ = parseInt($('.big_back_s img').css('width'));
        var height = parseInt($('.big_back_s img').css('height'));
        $(this).hide();
        $('.true_s').show();
        $('body').css('height', '100%');
        $('.doHomework').hide();
        $('.esc_s').show();
        $('.pinch-zoom-container').eq(0).hide();
        var previewUrl = $('.big_back_s img').attr('src');
        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = previewUrl;
        var canvas = document.getElementById("myCanvas");

        canvas.width = width_;
        canvas.height = height;

        var ctx = canvas.getContext("2d");
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';

        img.onload = function () {
            ctx.drawImage(img, 0, 0, width_, height);
        };
        $('.big_back_s img').hide();
        $('.big_back_s canvas').show();

        // canvas事件
        $('#myCanvas').on('touchstart', function () {
            if (event.touches.length == 1) {
                ctx.beginPath();
                ctx.moveTo(event.touches[0].pageX - +canvas.offsetLeft, event.touches[0].pageY -+canvas.offsetTop);
                $('#myCanvas').on('touchmove', function () {
                    var ev = ev || event;
                    ctx.lineTo(event.touches[0].pageX - +canvas.offsetLeft, event.touches[0].pageY - +canvas.offsetTop);
                    ctx.stroke();
                });
                $('#myCanvas').on('touchend', function () {
                    // ctx.closePath();
                    // cxt.clearRect(0,0,width_,height); 
                });
                // upLoadWxImage(canvas.toDataURL("image/png"));
            }

        });

        $('.true_s').on('touchend', function () {
            if (ber_L == false) {
                layer.msg('正在处理请求');
                return false;
            }
            ber_L = false;
            $('.big_back_s').hide();
            $('.doHomework').show();
            $('.notsubmit .imgBox').show();
            $('.big_back_s canvas').hide();
            $('.big_back_s img').show();
            $('.big_back_s .esc_s').show();
            $('.big_back_s .true_s').hide();
            $('.pinch-zoom-container').show();
            $('.big_back_s span:last-of-type').show();
            $('body').css('overflow-y', 'auto');
            $('.true_s').unbind('touchend');
            clearInterval(time_s);
            // var b = new Base64();
            str = canvas.toDataURL("image/jpeg", 0.5);
            if($('.notsubmit .imgBox li') != undefined && $('.notsubmit .imgBox li').length >= 3){
                layer.msg('最多只能批复三张');
                return false;
            }
            $('.notsubmit .imgBox').append("<li><span class='stuImg' img-index='" + Index_Last + "'></span><img isEdit='1' data-img='" + canvas.toDataURL("image/jpeg", 0.5) + "' src='" + canvas.toDataURL("image/jpeg", 0.5) + "'/></li>");

            //上传文件到服务器
            var reqData = {
                'base64Str': str,
                'schoolId': localStorage.schoolId,
                'classId': sessionStorage.classCode_s
            };
            layer.load();
            // console.log(reqData);
            ajaxRequest('POST', homework_s.s_uploadFiles, JSON.stringify(reqData), uploadFilesSuccess);


        });
        return false;
    });
    /*-------------------- 删除语音 --------------------*/
    $(document).on('touchend', '.stuVoice', function () {
        //alert($(this).parents('.audio_box').index());
        $('.delete-voice .confirmBtn').attr('voice-index', $(this).parents('.audio_box').index());
        layer.close(layer1);
        layer.close(layer2);
        //删除语音
        layer2 = layer.open({
            type: 1,
            area: ['548px', '345px'],
            shade: [0.2, '#000'],
            title: '',
            skin: '',
            content: $(".delete-voice")
        })
    });
    // 删除语音-取消
    $(document).on('touchend', '.delete-voice .cancelBtn', function () {
        layer.close(layer1);
        layer.close(layer2);
    });
    // 删除语音-确定
    $(document).on('touchend', '.delete-voice .confirmBtn', function () {

        var index = parseInt($(this).attr('voice-index'));
        layer.close(layer1);
        layer.close(layer2);
        if ($('#record_audio_box').find('.audio_box').length <= 1) {
            $('#record_audio_box').hide();
        }

        $('#record_audio_box li:eq(' + index + ')').remove();
        // 语音小于三张，显示添加语音按钮
        if ($('.notsubmit #record_audio_box li').length < 3) {
            $('#record').show();
        }
        if (arr_voice.length > 0) {
            arr_voice.splice(index, 1);
            recordCount--;
        }


    });

//    上传文件到服务器
    function uploadFilesSuccess(msg) {
        ber_L = true;

        if (msg.data.success) {
            layer.closeAll('loading');
            arr_image.push({
                'fileName': msg.data.fileName,
                'fileType': msg.data.fileType,
                'fileSize': msg.data.fileSize,
                'diskFilePath': msg.data.diskFilePath
            });
            // console.log("ok:"+JSON.stringify(arr_image));
        } else {
            alert("文件上传失败！");
        }
    }

    $('.homeGrade').on('keyup', function () {
        if (parseInt($(this).val()) > 100) {
            $(this).val('100')
        }
    })
    function cnv(index,id,num){
        clearInterval(times);
        var bian = index;    //这里改数值~
        var canvas = document.getElementById(id);
        var ctx = canvas.getContext("2d");
        var W = canvas.width;
        var H = canvas.height;
        var text,text_w;
        function init(){
            ctx.clearRect(0,0,W,H);
            ctx.beginPath();
            ctx.strokeStyle="#eee";
            ctx.lineWidth=4;
            ctx.arc(W/2,H/2,80,0,Math.PI*2,false);
            ctx.stroke();
            
            var r = bian*2*Math.PI/100;
            console.log(r);
            ctx.beginPath();
            var linear = ctx.createLinearGradient(100,100,200,100); 
            linear.addColorStop(0,'#00ba97'); 
            linear.addColorStop(1,'#00ba97'); 
            ctx.strokeStyle =linear;

            ctx.lineCap = 'round'
            ctx.lineWidth=10;
            ctx.arc(W/2,H/2,80,0-90*Math.PI/180,r-90*Math.PI/180,false);
            ctx.stroke();
        }
        init();
        var times = setInterval(function(){
            bian +=3;
            if(bian>=num){
                clearInterval(times)
            }
            init()
        },1)
    }
    function stopDrop() {
        var lastY;//最后一次y坐标点
        $(document.body).on('touchstart', function(event) {
            lastY = event.originalEvent.changedTouches[0].clientY;//点击屏幕时记录最后一次Y度坐标。
        });
        $(document.body).on('touchmove', function(event) {
            var y = event.originalEvent.changedTouches[0].clientY;
            var st = $(this).scrollTop(); //滚动条高度  
            if (y >= lastY && st <= 10) {//如果滚动条高度小于0，可以理解为到顶了，且是下拉情况下，阻止touchmove事件。
                lastY = y;
                event.preventDefault();
            }
            lastY = y;
     
        });
    }
    stopDrop();
});

