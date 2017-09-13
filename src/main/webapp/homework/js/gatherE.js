/**
 * Created by zyc on 2017/9/13.
 */
//作业汇总
var summaryData={"Tcid":/*sessionStorage.Tid*/"0fa99b19470c414abb65239c477f2ff9"}
ajax_S(homework_s.t_summary,summaryData,summaryAjax);
function summaryAjax(e) {
    console.log(e);
    if(e.code=="200"){
        var recordNum='<dl><dt><span>'+e.data.commitNum+'</span>/<span>'+e.data.StudentNum+'</span>人</dt><dd>完成量</dd></dl><dl><dt>'+e.data.avgTimes+'</dt><dd>平均用时</dd></dl>';
        $(".gHeader").append(recordNum);
        if(e.data.data.commitArr!=undefined&&e.data.data.commitArr.length>0){
            for(var i=0;i<e.data.data.commitArr.length;i++){
                var table='<tr><th>'+e.data.data.commitArr[i].studentName+'</th><th>'+e.data.data.commitArr[i].score+'</th><th>'+e.data.data.commitArr[i].replyTime+'</th><th>'+e.data.data.commitArr[i].times+'</th></tr>';
                $("tbody").append(table);
            }
        }else{
            var table='<tr>没有已交作业的学生</tr>';
            $("tbody").append(table);
        }

        if(e.data.data.nocommitArr!=undefined&&e.data.data.nocommitArr.length>0){
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
        }else{
            var nocommit='<li>没有未交作业的学生</li>';
            $(".noHw ul").append(nocommit);
        }
    }
}
$(".gBth").click(function () {
    location.href='rankinglistE_t.html?tid='+sessionStorage.Tid;
})