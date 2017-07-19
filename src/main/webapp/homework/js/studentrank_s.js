/**
 * Created by use1 on 2017-07-11.
 */
$(function(){
    var loading;
    $(".ranklist,.stuempty").hide();
    var reqData = 'homeworkTinfoId='+localStorage.hwteacherId;
    loading = layer.load();
    ajaxRequest('GET', homework_s.s_hwrank, reqData, getHwRankSuccess);
    //获取学生排行
    function getHwRankSuccess(msg) {
        $(".ranklist").html(" ");
        if(msg.code==200){
            if(msg.data!='undefined' && msg.data.length>0){
                var datas = msg.data;
                $.each(datas,function(i,items){
                    console.log(i);
                    var rankCss,ranking,studentNo;
                    //名次样式
                    switch(i){
                        case 0:
                            rankCss = "rankfirst";
                            break;
                        case 1:
                            rankCss = "ranksecond";
                            break;
                        case 2:
                            rankCss = "rankthird";
                            break;
                        default :
                            rankCss = "rankcom";
                            break;
                    }
                    var rankListHtml='<li><span class="rankleft"><i class="'+rankCss+'">'+parseInt(i+1)+'</i><i>'
                        +items.stuName.substr(-2,2)+'</i><i>'+items.stuName
                        +'</i></span><span class="rankright"><i>'+items.updateTime.substr(0,16)+'</i></span></li>';
                    $(".ranklist").append(rankListHtml);
                    $(".ranklist").show();
                    // layer.close(loading);
                });
            }else{
                // layer.close(loading);
                $('.stuempty').show();
            }
        }else{
            console.log("err:"+JSON.stringify(msg));
            $('.stuempty').show();
        }
        layer.close(loading);
    }
})


