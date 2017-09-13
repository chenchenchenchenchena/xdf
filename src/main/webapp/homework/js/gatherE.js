/**
 * Created by zyc on 2017/9/13.
 */
//作业汇总
var loading;
var arr;
var summaryData={"Tcid":"0fa99b19470c414abb65239c477f2ff9"};
/*ajax_S(homework_s.t_summary,summaryData,summaryAjax);*/
ajaxRequest("POST", homework_s.t_summary,summaryData,summaryAjax)
function summaryAjax(e) {
    loading=layer.load();
    console.log(e);
    if(e.code=="200"){
        var recordNum='<dl><dt><span>'+e.data.commitNum+'</span>/<span>'+e.data.StudentNum+'</span>人</dt><dd>完成量</dd></dl><dl><dt>'+e.data.avgTimes+'</dt><dd>平均用时</dd></dl>';
        $(".gHeader").append(recordNum);
        $(".gHeader").show();
        if(e.data.data.commitArr!=undefined&&e.data.data.commitArr.length>0){
            for(var i=0;i<e.data.data.commitArr.length;i++){
                var table='<tr><th>'+e.data.data.commitArr[i].studentName+'</th><th>'+e.data.data.commitArr[i].score+'</th><th>'+e.data.data.commitArr[i].replyTime+'</th><th>'+e.data.data.commitArr[i].times+'</th><td class="report" data-testId='+e.data.data.commitArr[i].testId+'><img src="images/clipboard.png" /></td></tr>';
                $("tbody").append(table);
            }
            $("table").show();
            $(".gray").show();
            $(".gBth").show();
        }else{
            var table='<tr>没有已交作业的学生</tr>';
            $("tbody").append(table);
            $("table").show();
            $(".gray").show();
            $(".gBth").show();
        }

        if(e.data.data.nocommitArr!=undefined&&e.data.data.nocommitArr.length>0){
            arr=e.data.data.nocommitArr;
            for(var i=0;i<e.data.data.nocommitArr.length;i++){
                var nocommit='<li><span>'+e.data.data.nocommitArr[i].studentName+'</span><span studentNo='+e.data.data.nocommitArr[i].studentNo+'>'+e.data.data.nocommitArr[i].studentName+'</span></li>';
                $(".noHw ul").append(nocommit);
                for(var i=0;i<$(".noHw li").length;i++){
                    var nameHtml=$(".noHw li").eq(i).find("span").eq(0).html();
                    if (nameHtml.length > 2) {
                        var avater = nameHtml.substring(nameHtml.length - 2, nameHtml.length);
                        $(".noHw li").eq(i).find("span").eq(0).html(avater)
                    } else {
                        var avater = nameHtml;
                        $(".noHw li").eq(i).find("span").eq(0).html(avater);
                    }
                }
            }
            $(".noHw").show();
            $(".gray").show();
            $(".gBth").show();
        }else{
            var nocommit='<li>没有未交作业的学生</li>';
            $(".noHw ul").append(nocommit);
            $(".noHw").show();
            $(".gray").show();
            $(".gBth").show();
        }
        layer.close(loading);
    }else{
        layer.close(loading);
        $(".no-data").show();
        $(".summary").hide();
    }
}
$(document).on("touchstart",".ss",function () {
    location.href='rankinglistE_t.html?tid='+sessionStorage.Tid;
})
//催交作业
var Homework = {
    'appid': Global.appid,
    'secret': Global.secret,
    'url': 'http://dt.staff.xdf.cn/xdfdthome/homework/homeworklist_s.html',
    'templateId': 'X9u2z5OF33JCPXDuTGnw06fUt0n-7CSjCe5otNgXO6M'
};
$('.noHwTitle span:last-of-type').on('touchend', function () {
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
    console.log(Homework)
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
$(document).on("touchstart",".report",function () {
    var url = "http://10.200.80.120:8080/xdfdtmanager/teacherData/getStudentReportUrl.do";
    var params = {"testId":"A072187E-0B7C-4370-8305-BAD6FDD0B697"};
    ajaxRequest("POST", url, JSON.stringify(params), function (e) {
        if (e.result) {
            if(e.url!=undefined && e.url != ""){
                window.location.href = e.url;
            }
        }
    });
})

