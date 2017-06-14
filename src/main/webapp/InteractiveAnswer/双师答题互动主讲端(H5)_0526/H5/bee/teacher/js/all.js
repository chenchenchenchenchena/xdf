// 2017-3-22 13:13:37
var _isDebugCef = false;
var _isDebugMock = false;

function helperPercent(number, total) {
    if (total == 0) {
        return 0;
    } else {
        return Math.floor(number / total * 100 * 100) / 100;
    }
}

var jsBridgeAnswerHtml = {};
jsBridgeAnswerHtml.numberAnswer = function(result) {
    debugData(result, "中间选择答案统计");
    var json = {
        totalNumber: result.totalNumber,
        answerType: result.answerType,
        fAnswerType: {
            "A": helperPercent(result.answerType.A, result.totalNumber),
            "B": helperPercent(result.answerType.B, result.totalNumber),
            "C": helperPercent(result.answerType.C, result.totalNumber),
            "D": helperPercent(result.answerType.D, result.totalNumber)
        }
    }
    $v.vNumberAnswer = json;
}

jsBridgeAnswerHtml.numberClasses = function(result) {
    debugData(result, "右侧答题人数统计");
    var json = {
        "totalNumber": result.totalNumber,
        "answerNumber": result.answerNumber,
        "list": result.list,
        "listDemo": {
            "schoolName": "北京",
            "teacherName": "新东方老师",
            "classTotalNumber": 0,
            "classAnswerNumber": 0
        },
        "fList": [],
        "fListDemo": {
            "schoolName": "北京",
            "teacherName": "新东方老师",
            "classTotalNumber": 0,
            "classAnswerNumber": 0,
            "percent": 0
        }
    }

    var jsonList = json.list;
    var jsonListLength = jsonList.length;
    for (var i = 0; i < jsonListLength; i++) {
        json.fList.push({
            "schoolName": jsonList[i].schoolName,
            "teacherName": jsonList[i].teacherName,
            "classTotalNumber": jsonList[i].classTotalNumber,
            "classAnswerNumber": jsonList[i].classAnswerNumber,
            "percent": helperPercent(jsonList[i].classAnswerNumber, jsonList[i].classTotalNumber)
        });
    }
    $v.vNumberClasses = json;
    $('#myCicle').html('').circliful({
        foregroundColor: "#1bcb69",
        backgroundColor: "#182024",
        fontColor: '#333',
        percentageTextSize: 24,
        animation: 0,
        animationStep: 0,
        foregroundBorderWidth: 12,
        backgroundBorderWidth: 12,
        percent: helperPercent(result.answerNumber, result.totalNumber),
        replacePercentageByText: $v.vNumberClasses.answerNumber + '/' + $v.vNumberClasses.totalNumber
    });
}
jsBridgeAnswerHtml.changePageElement = function(result) {
    debugData(result, "jsBridgeAnswerHtml.changePageElement:");
    $v.vTitle = result.title;
    $v.vLink = result.link;
}
jsBridgeAnswerHtml.classesCorrectRate = function(result) {
        debugData(result, "右侧答对人数统计");
        var json = {
            "list": result.list,
            "listDemo": {
                "schoolName": "北京",
                "teacherName": "新东方老师",
                "classTotalNumber": 0,
                "classAnswerNumber": 0,
                "classRightNumber": 0
            },
            "fList": [],
            "fListDemo": {
                "schoolName": "北京",
                "teacherName": "新东方老师",
                "classTotalNumber": 0,
                "classAnswerNumber": 0,
                "classRightNumber": 0,
                "percent": 0
            }
        }

        var jsonList = json.list;
        var jsonListLength = jsonList.length;
        for (var i = 0; i < jsonListLength; i++) {
            json.fList.push({
                "schoolName": jsonList[i].schoolName,
                "teacherName": jsonList[i].teacherName,
                "classTotalNumber": jsonList[i].classTotalNumber,
                "classAnswerNumber": jsonList[i].classAnswerNumber,
                "classRightNumber": jsonList[i].classRightNumber,
                "percent": helperPercent(jsonList[i].classRightNumber, jsonList[i].classTotalNumber)
            });
        }
        $v.vClassesCorrectRate = json;
    }
    //选择ABCD按钮
jsBridgeAnswerHtml.keySelect = function(result) {
    debugData(result, "jsBridgeAnswerHtml.keySelect");
    answerVueObj.selectABCD(result.type);
}

jsBridgeAnswerHtml.keyRight = function() {
    debugData({}, "jsBridgeAnswerHtml.keyRight");
    if ($v.vButton == "start") {
        answerVueObj.buttonStart();
    }
    if ($v.vButton == "answer" && $v.vShowDialog == true) {
        answerVueObj.buttonAnswerYes();
    }
}
jsBridgeAnswerHtml.keyWrong = function() {
    debugData({}, "jsBridgeAnswerHtml.keyWrong");
    if ($v.vButton == "answer") {
        if ($v.vShowDialog) {
            answerVueObj.buttonAnswerNo();
        } else {
            answerVueObj.buttonAnswer();
        }
    }
    if ($v.vButton == "stop") {
        answerVueObj.buttonStop();
    }

}

var $v = {
    vButton: 'start',
    vABCD: '',
    vNumberAnswer: {
        totalNumber: 0,
        answerType: {
            "A": 0,
            "B": 0,
            "C": 0,
            "D": 0
        },
        fAnswerType: {
            "A": 0,
            "B": 0,
            "C": 0,
            "D": 0
        }
    },
    vNumberClasses: {
        "totalNumber": 0,
        "answerNumber": 0,
        "list": [],
        "listDemo": {
            "schoolName": "北京",
            "teacherName": "新东方老师",
            "classTotalNumber": 0,
            "classAnswerNumber": 0
        },
        "fList": [],
        "fListDemo": {
            "schoolName": "北京",
            "teacherName": "新东方老师",
            "classTotalNumber": 0,
            "classAnswerNumber": 0,
            "percent": 0
        }
    },
    vClassesCorrectRate: {
        "list": [],
        "listDemo": {
            "schoolName": "北京",
            "teacherName": "新东方老师",
            "classTotalNumber": 0,
            "classAnswerNumber": 0,
            "classRightNumber": 0
        },
        "fList": [],
        "fListDemo": {
            "schoolName": "北京",
            "teacherName": "新东方老师",
            "classTotalNumber": 0,
            "classAnswerNumber": 0,
            "classRightNumber": 0,
            "percent": 0
        }
    },
    vTitle: '',
    vLink: '',
    vShowDialog: false,
    vShowRightList: true,
    vCountDown: 9,
    vArrowButton:true
}
var answerVueObj = new Vue({
    el: '#app',
    data: function() {
        return $v;
    },
    created: function() {

    },
    methods: {
        selectABCD: function(data) {
            if ($v.vButton == 'answer') {
                if($v.vShowDialog){
                    this.vABCD = "";
                }else{
                    this.vABCD = (this.vABCD == data) ? '' : data;
                }              
            }
        },
        buttonStart: function() {
            try {
                $v.vABCD = '';
                $v.vShowRightList = true;
                jsBridgeAnswerCef.start(JSON.stringify({
                    "callbackFunction": "callbackFunctionBegin"
                }));
            } catch (e) {
                toastr.error("jsBridgeAnswerCef.start调用失败");
            }
        },
        buttonAnswer: function() {
            if ($v.vABCD != "") {
                var postJson = {
                    "callbackFunction": "callbackFunctionAnswer"
                }
                $v.vShowRightList = false;
                postJson.data = {
                    "answer": this.vABCD
                }
                try {
                    jsBridgeAnswerCef.answer(JSON.stringify(postJson));
                } catch (e) {
                    toastr.error("jsBridgeAnswerCef.answer调用失败");
                }
            } else {
                $v.vShowDialog = true;
            }
        },
        buttonStop: function() {
            try {
                $v.vButton = "stopEnd";
                jsBridgeAnswerCef.stop(JSON.stringify({
                    "callbackFunction": "callbackFunctionStop"
                }));
            } catch (e) {
                toastr.error("jsBridgeAnswerCef.stop调用失败");
            }
        },
        buttonAnswerYes: function() {
            $v.vShowDialog = false;
        },
        buttonAnswerNo: function() {
            $v.vShowDialog = false;
            var postJson = {
                "callbackFunction": "callbackFunctionAnswer",
                "data": {
                    "answer": ""
                }
            }
            try {
                jsBridgeAnswerCef.answer(JSON.stringify(postJson));
            } catch (e) {
                toastr.error("jsBridgeAnswerCef.answer调用失败");
            }
        },
        countDown: function() {
            var that = this;
            if ($v.vCountDown == 0) {
                this.buttonStop();
            } else {
                window.startTimer = setTimeout(function() {
                    $v.vCountDown--;
                    that.countDown();
                }, 1000);
            }
        },
        switchButton:function(){
            this.vArrowButton = !this.vArrowButton;
        }
    }
});

function callbackFunctionBegin(json) {
    if (json.isSuccess) {
        $v.vButton = 'answer';
        if (_isDebugMock) {
            tNumberAnswer();
            tNumberClasses();
            tChangePageElement();
        }
    } else {
        toastr.error(json.message);
    }
}

function callbackFunctionAnswer(json) {
    if (json.isSuccess) {
        $v.vButton = 'stop';
        answerVueObj.countDown();
        if (_isDebugMock) {
            tClassesCorrectRate()
        }
    } else {
        toastr.error("callbackFunctionAnswer失败");
    }
}

function callbackFunctionStop(json) {
    if (json.isSuccess) {
        $v.vButton = 'start';
        $v.vCountDown = 9;
        clearTimeout(window.startTimer);
    } else {
        toastr.error("callbackFunctionStop失败");
    }
}

// all
window.teacherPage = {
    init: function() {
        //this.scrollBar();
    },
    scrollBar: function() {
        $(window).load(function() {
            $(".js-scrollContent").mCustomScrollbar({
                theme: "light"
            });
            $(".js-scrollContent").animate({
                height: $(".rightbar").height() - 150
            }, 'slow', function() {
                $(this).mCustomScrollbar("update");
            });
        });
    },
}

window.teacherPage.init();

// debugData
function debugData(data, type) {
    var strDebugData = JSON.stringify(data);
    $('<div class="f-debugData-item">' + '<span>' + type + ':</span>' + strDebugData + '</div>').appendTo($(".f-debugData-main"));
}

$(document).on("click", ".js-debugData-open", function() {
    $(".js-debugData").show();
});

$(document).on("click", ".js-debugData-close", function() {
    $(".js-debugData").hide();
});

function boxHeight(){
    var boxHeight = $(".main").height()-110;
    $(".js-scrollContent").height(boxHeight);
}

window.onresize = function(){boxHeight();}