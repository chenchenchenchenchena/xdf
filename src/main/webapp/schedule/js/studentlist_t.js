$(function () {

    // var stuname = sessionStorage.s.split(',');
    var stuInfo = JSON.parse(sessionStorage.stuList).stuInfoKey;
    var teaname = sessionStorage.t.split(',');
    var studentNo = sessionStorage.studentCode;
    var studentName = sessionStorage.studentName;

    for (var i = 0; i < teaname.length; i++) {
        if (teaname[i] != '' && teaname[i] != undefined) {
            $('.slist').append('<li class="listCon"><ul class="teClass">' +
                '<li>' + teaname[i] + '老师班(' + sessionStorage.cc + ')' +
                '</li><li class="arrow"></li></ul><ul class="studentList"></ul></li>');
            if (stuInfo.length > 0) {
                for (var k = 0; k < stuInfo.length; k++) {
                    localStorage.setItem('CLASSCODE',stuInfo[k].classCode);
                    localStorage.setItem('SCHOOLID',stuInfo[k].schoolId);
                    $('.studentList').eq(i - 1).append('<li><i>' + (k + 1) + '</i>' +
                        '<span>' + stuInfo[k].studentName.substring(0, 1) + '</span><span>' + stuInfo[k].studentName + '</span>' +
                        '<span style="float: right;">电话</span>' +
                        '<a href="../learningSituation/reportstu_t.html?studentNo=' + stuInfo[k].studentCode + '&tCode=1&studentName=' + stuInfo[k].studentName + '">' +
                        '<span style="float: right;margin-right: 10px;">' +
                        '学情</span></a></li>')


                }
            }

        }
        // else{
        //    $('.slist').append('<li class="listCon"><ul class="teClass"><li>'+sessionStorage.tm+'老师班('+sessionStorage.cc+')</li><li class="arrow"></li></ul><ul class="studentList"></ul></li>');
        //    for(var k = 0;k<stuname.length;k++){
        //        if(stuname[k]!=''){
        //            $('.studentList').eq(i-1).append('<li><i>'+(k+1)+'</i><span>'+stuname[k].substring(1,stuname[k].length)+'</span><span>'+stuname[k]+'</span></li>')
        //        }
        //    }
        // }
        // var stumore = stuname[i].split(',');
        // for(var k = 0;k<stumore.length;k++){
        // 	if(stumore[k]!=''){
        // 		$('.studentList').eq(i).append('<li><i>'+(k+1)+'</i><span>'+stumore[k].substring(0,1)+'</span><span>'+stumore[k]+'</span></li>')
        // 	}
        // }
        $('.slistTitle').html('课堂同学列表(' + (stuname.length - 1) + ')')
    }

    //打电话
    $('.studentList').find('span').eq(2).click(function () {
        alert("打电话");
    });
    //查看学情
    $('.studentList').find('span').eq(3).click(function () {
        alert("查看学情");
    });

})















