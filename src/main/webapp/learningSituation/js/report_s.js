$(function () {
//禁止浏览器拖动
//     addEventListener("touchmove", function (event) {
//         event.preventDefault();
//     }, false);
//     sessionStorage.schoolId="73";
//     sessionStorage.stuNumber = 'SS5358';
//点击显示图标
    $(document).on('touchend', '.title_s', function () {
        if ($(this).siblings('.achievement_s').css('display') == 'none') {
            $(this).siblings().show()
            $(this).siblings('.tab_sreport').children('div').eq(0).show()
            $(this).find('img').css('transform', 'rotate(-90deg)')
            $(this).siblings('.tab_sreport').css('padding-bottom', '40px');
        } else {
            $(this).siblings().hide()
            $(this).find('img').css('transform', 'rotate(90deg)')
            $('.reportstu_S').hide()
            $('.tab_record span').eq(0).addClass('tab_recorac').siblings().removeClass('tab_recorac')
        }

    });
    $(document).on('touchend', '.grade', function () {
        sessionStorage.schoolId = $(this).attr('schoolid');
        sessionStorage.classCode = $(this).attr('classcode');
        location.href = 'common_ts.html'
    });
    var Stujson = {'studentNo': sessionStorage.stuNumber, 'tCode': '1', 'schoolId': sessionStorage.schoolId};
    Studata();  //调取
//切换显示方式
    $(document).on('touchend', '.tab_record span', function () {
        if (!$(this).hasClass('tab_recorac')) {
            $(this).addClass('tab_recorac').siblings().removeClass('tab_recorac');
            $(this).parent().prev().children('div').eq($(this).index()).show().siblings().hide()
        }
    });


// tab切换
    /** 获取成绩类型 */
    var reqData = {
        'tableName':"studycase_grade_type"
    };
    ajaxRequest('POST', url.t_dictionary,reqData, function(e){
        if(e.code==200){
            var tabTypes =  e.data;
            var tabStr = "";
            for (var i = 0; i < tabTypes.length; i++){
                if(i == 0){
                    //第一次进入页面  默认选中第一个tab
                    tabStr += "<li class='tab-active' tCode='"+tabTypes[i].tCode+"'>"+tabTypes[i].tName+"</li>";
                }else {
                    tabStr += "<li tCode='"+tabTypes[i].tCode+"'>"+tabTypes[i].tName+"</li>";
                }
            }
            $('.tab-title').html(tabStr);
        }
    });

    $(document).on('touchend','.tab-title li',function(){
        $('.no-data').hide()
        $(this).addClass('tab-active').siblings().removeClass('tab-active');
        $('.class_big').find('.classroom_s').remove();
        Stujson.tCode = $(this).attr("tCode");
        Studata();

        // switch ($(this).index()) {
        //     case 0:
        //         Stujson.tCode = '1';
        //         $('.class_big').find('.classroom_s').remove();
        //         Studata();
        //         break;
        //     case 1:
        //         Stujson.tCode = '2';
        //         $('.class_big').find('.classroom_s').remove();
        //         Studata();
        //         break;
        //     case 2:
        //         Stujson.tCode = '3';
        //         $('.class_big').find('.classroom_s').remove();
        //         Studata();
        //         break;
        //     case 3:
        //         Stujson.tCode = '4';
        //         $('.class_big').find('.classroom_s').remove();
        //         Studata();
        //         break;
        //     case 4:
        //         Stujson.tCode = '5';
        //         $('.class_big').find('.classroom_s').remove();
        //         Studata();
        //         break;
        // }
    });


    var Xindex = '';
    var Thistime = [];
    var Xtwindex = [];
    var pjIndex = [];
    var mfInedx = [];
    var timeIndex = [];
    var Cindex = [];
    var maxNumber = 0;

    function Studata() {
        ajaxRequest('POST', Study.s_study, Stujson, function (e) {
            if (e.data.studentResultsCase.length != 0) {
                var class_ = e.data.studentResultsCase;

                for (var i = 0; i < class_.length; i++) {
                    maxNumber = 0;
                    for (var s = 0; s < class_[i].length; s++) {
                        if (class_[i][s].fullMarks > maxNumber) {
                            maxNumber = class_[i][s].fullMarks
                        }
                    }
                    Xindex = '0';
                    Thistime = [];
                    Xtwindex = [];
                    pjIndex = [];
                    mfInedx = [];
                    timeIndex = [];
                    Cindex = [];
                    if (e.data.studentClassRoomAnswer[i].sdtInteractState != false) {
                        html_yh = '<h4 class="grade" classcode="' + e.data.studentClassRoomAnswer[i].classCode + '" schoolid="' + e.data.studentResultsCase[i][0].schoolId + '" style="margin-right:20px;">查看课堂数据</h4><h4 class="rank-btn" classcode="' + e.data.studentClassRoomAnswer[i].classCode + '" schoolid="' + e.data.studentResultsCase[i][0].schoolId + '" style="margin-right:20px;">查看成绩排行</h4>'
                    } else {
                        html_yh = '<h4 class="rank-btn" classcode="' + e.data.studentClassRoomAnswer[i].classCode + '" schoolid="' + e.data.studentResultsCase[i][0].schoolId + '" style="left: 72% ; margin-right:20px;">查看成绩排行</h4>';
                    }

                    $('.class_big').append('<div class="classroom_s"><div class="title_s"><h4>' + class_[i][0].className + '</h4> <img src="images/rightArrow.png" alt=""/> </div><div class="tab_sreport"><div id="chart_S' + i + '"></div><div class="reportstu_S"> <ul> <li>课次</li> </ul> <ul> <li>常效新</li> </ul> <ul> <li>平均分</li> </ul> </div></div><div class="tab_record"> <span class="tab_recorac">趋势图</span> <span>报表</span> </div><div class="achievement_s">' + html_yh + '</div>');
                    for (var y = 0; y < class_[i].length; y++) {

                        $('.reportstu_S').eq(i).find('ul').eq(0).append('<li>' + e.data.studentResultsCase[i][y].lessonNO + '</li>');
                        $('.reportstu_S').eq(i).find('ul').eq(1).append('<li>' + (e.data.studentResultsCase[i][y].realGrade) + '</li>');
                        $('.reportstu_S').eq(i).find('ul').eq(1).find('li').eq(0).html(e.data.studentResultsCase[i][0].studentName);
                        $('title').html(e.data.studentResultsCase[i][0].studentName + '同学');
                        $('.reportstu_S').eq(i).find('ul').eq(2).append('<li>' + (e.data.studentResultsCase[i][y].avgGradeView) + '</li>');
                        // $('.reportstu_S').eq(i).find('ul').css('width',118*e.data.studentResultsCase[i].length);
                        $('.tab_sreport').eq(0).find('div').eq(0).show();
                        $('.achievement_s').eq(0).show();
                        $('.tab_record').eq(0).show();
                        $('.title_s').eq(0).find('img').css('transform', 'rotate(-90deg)');

                        Xindex = e.data.studentResultsCase[i][e.data.studentResultsCase[i].length - 1].lessonNO;
                        /*
                         Xtwindex   //x轴
                         Cindex     //出门测
                         Rindex     //入门测
                         */
                    }
                    $('.reportstu_S').eq(i).find('ul').css('width', 118 * (class_[i].length + 1));
                    if (Xindex == e.data.studentResultsCase[i].length) {
                        for (var j = 0; j < Xindex; j++) {
                            Xtwindex.push(j + 1);
                            Cindex.push(e.data.studentResultsCase[i][j].avgGradeView);
                            pjIndex.push(e.data.studentResultsCase[i][j].realGrade);
                            mfInedx.push('满分:' + e.data.studentResultsCase[i][j].fullMarks);
                            timeIndex.push(e.data.studentResultsCase[i][j].lessonTime.split(' ')[0]);
                        }
                    } else {

                        for (var j = 0; j < Xindex; j++) {
                            Xtwindex.push(j + 1);
                            var buer = false;
                            for (var k = 0; k < e.data.studentResultsCase[i].length; k++) {
                                if ((j + 1) == e.data.studentResultsCase[i][k].lessonNO) {
                                    Cindex.push(e.data.studentResultsCase[i][k].avgGradeView);
                                    pjIndex.push(e.data.studentResultsCase[i][k].realGrade);
                                    mfInedx.push('满分:' + e.data.studentResultsCase[i][k].fullMarks);
                                    timeIndex.push(e.data.studentResultsCase[i][k].lessonTime.split(' ')[0]);
                                    buer = true;
                                    break;
                                }
                            }
                            if (buer != true) {
                                Cindex.push('0');
                                pjIndex.push('0');
                                mfInedx.push('0');
                                timeIndex.push('0');
                            }
                        }

                    }
                    console.log(Cindex);
                    Echart('chart_S' + i + '', Xtwindex, Cindex, pjIndex, timeIndex, mfInedx, maxNumber)
                }

                $('.tab_sreport').css('padding', '0');
                $('.tab_sreport').eq(0).css('padding-bottom', '40px');
                $('.title_s').eq(0).siblings().show();
                $('.title_s').eq(0).find('img').css('transform', 'rotate(-90deg)');
                $('.classroom_s').css('border-bottom', '1px solid #e1e1e1')
            } else {
                $('.no-data').show();
                $('.class_big').show();
                $('.classroom_s').css('border', 'none')
            }


        })
    };
//课堂互动跳转
    $(document).on('touchend', 'achievement_s', function () {
        sessionStorage.schoolId = $(this).attr('schoolid')
        sessionStorage.classCode = $(this).attr('classcode')
        location.href = 'common_ts.html'
    });
//家长查看成绩排行
    $(document).on("click",".rank-btn",function () {
        localStorage.CLASSCODE=$(this).attr("classcode");
        localStorage.SCHOOLID=$(this).attr("schoolid");
        var rankData={
            "classCode":$(this).attr("classcode"),
            "tCode":$(".tab-active").attr("tcode"),
            "schoolId":$(this).attr("schoolid")
        }
        console.log(rankData);
        ajaxRequest("POST",Study.t_getStudyDate,rankData,function (e) {
            if(e.code=="200"){
                if(e.data!=undefined&&e.data.length!=0){
                     for (var i = 0; i < e.data.length; i++) {
                         var str2 = "<li>" + e.data[i].date + "(<span class=lessonNo>" +  e.data[i].lessonNo + "</span>课次)</li>";
                         $(".classNumTime ul").append(str2);
                     }
                }
            }else{
                var str2 = "<li>暂无课次时间</li>";
                $(".classNumTime ul").append(str2);
            }
        });
    })

    $(".classNumTime ul").on("click", "li", function () {
        $(this).addClass("chooseClassActive").siblings("li").removeClass("chooseClassActive");
    })
    $(document).on("click",".rank-btn",function () {
        $(".mask").show();
        $("body,html").css({"width": "100%", "height": "100%", "overflow": "hidden"})
       /* $(".classNumTime").show();*/
        $(".classNumTime").css("animation", "move 0.3s linear");
        $(".classNumTime").css("bottom", "0px");
    })
    $(document).on("click",".classNumTime p span",function () {
        $(".mask").hide();
        $("body,html").css({"width": "", "height": "", "overflow": ""});
        /*$(".classNumTime").hide();*/
        $(".classNumTime").css("animation", "");
        $(".classNumTime").css("bottom", "-440px");
        $(".classNumTime ul").html(" ");
    })
    $(document).on("click",".mask",function () {
        $(".mask").hide();
        $("body,html").css({"width": "", "height": "", "overflow": ""});
        /*$(".classNumTime").hide();*/
        $(".classNumTime").css("animation", "");
        $(".classNumTime").css("bottom", "-440px");
        $(".classNumTime ul").html(" ");
    })
    $(document).on("click",".confirmBtn",function () {
         if($(".classNumTime ul li").hasClass("chooseClassActive")){
             sessionStorage.lessonNo="["+$(".chooseClassActive .lessonNo").html()+"]";
            location.href="sharedranking_t.html?testState="+$(".tab-active").attr("tcode")+"&checkedTypeName="+$(".tab-active").html()+"&type=student";
         }else{
            layer.msg("请输入课次");
         }
    })


    function Echart(id, x, y1, y2, y3, y4, max) {
        var myChart = echarts.init(document.getElementById(id));
        var option = {
            tooltip: {
                trigger: 'axis',
                triggerOn: 'click',
                formatter: '{c2}<br />得分：{c}<br />平均分:{c1}<br />{c3}',
            },
            legend: {
                data: ['个人得分', '平均分'],
                textStyle: {
                    fontSize: 24
                }
            },
            calculable: true,
            dataZoom: [{
                type: 'inside',
                throttle: 50
            }],
            xAxis: [
                {
                    name: '课次',
                    type: 'category',
                    boundaryGap: false,
                    data: x,
                    nameTextStyle: {
                        fontSize: 24
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontSize: 24
                        }
                    },
                    lable: {
                        normal: {
                            textStyle: {
                                fontSize: 24
                            }
                        }
                    }
                }
            ],
            yAxis: [
                {
                    name: '分数',
                    type: 'value',
                    max: max,
                    nameTextStyle: {
                        fontSize: 24
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontSize: 24
                        }
                    },
                    lable: {
                        normal: {
                            textStyle: {
                                fontSize: 24
                            }
                        }
                    }
                }
            ],
            series: [
                {
                    name: '个人得分',
                    type: 'line',
                    data: y2,
                    symbolSize: 14,
                    nameTextStyle: {
                        fontSize: 24
                    },
                    axisLabel: {
                        show: true,
                    },
                    lable: {
                        normal: {
                            textStyle: {
                                fontSize: 24
                            }
                        }
                    }
                },
                {
                    name: '平均分',
                    type: 'line',
                    data: y1,
                    symbolSize: 14,
                    nameTextStyle: {
                        fontSize: 24
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontSize: 24
                        }
                    }, lable: {
                    normal: {
                        textStyle: {
                            fontSize: 24
                        }
                    }
                }
                },
                {
                    name: '日期',
                    type: 'line',
                    data: y3,
                    lable: {
                        normal: {
                            textStyle: {
                                fontSize: 24
                            }
                        }
                    }

                },
                {
                    name: '总分',
                    type: 'line',
                    data: y4,
                    lable: {
                        normal: {
                            textStyle: {
                                fontSize: 24
                            }
                        }
                    }
                }
            ]
        };

        // 为echarts对象加载数据
        myChart.setOption(option);

    }
});