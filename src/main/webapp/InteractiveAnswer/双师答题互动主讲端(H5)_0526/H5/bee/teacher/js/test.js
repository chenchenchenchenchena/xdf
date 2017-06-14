$(".js-debug-loadJsTest").hide();
$(".js-debug").show();

function testDebugCef() {
    window.jsBridgeAnswerCef = {}
    jsBridgeAnswerCef.start = function(result) {
        var result = JSON.parse(result);
        eval(result.callbackFunction + '({"isSuccess": true,"message": "成功"})');
    }
    jsBridgeAnswerCef.answer = function(result) {
        var result = JSON.parse(result);
        eval(result.callbackFunction + '({"isSuccess": true,"message": "成功"})');
    }
    jsBridgeAnswerCef.stop = function(result) {
        var result = JSON.parse(result);
        eval(result.callbackFunction + '({"isSuccess": true,"message": "成功"})');
    }
}

var _isDebugCef = true;
var _isDebugMock = true;
testDebugCef();

// 按答案
function tNumberAnswer() {
    for (var i = 0; i <= 30; i++) {
        (function(i) {
            setTimeout(function() {
                jsBridgeAnswerHtml.numberAnswer({
                    "totalNumber": 120,
                    "answerType": {
                        "A": i,
                        "B": i + 30,
                        "C": i + 20,
                        "D": i + 90
                    }
                });
            }, 100 * i)
        })(i);
    }
}

// 按班级
function tNumberClasses() {
    for (var i = 0; i < 30; i++) {
        (function(i) {
            setTimeout(function() {
                var json = {
                    "totalNumber": 150,
                    "answerNumber": 50 + i,
                    "list": [{
                        "schoolName": "北京",
                        "teacherName": "吴建伟",
                        "classTotalNumber": 100,
                        "classAnswerNumber": i + 60
                    }, {
                        "schoolName": "上海",
                        "teacherName": "李昕",
                        "classTotalNumber": 100,
                        "classAnswerNumber": i + 40
                    }, {
                        "schoolName": "城市名称",
                        "teacherName": "老师姓名",
                        "classTotalNumber": 100,
                        "classAnswerNumber": i
                    }]
                }
                if (i > 5) {
                    json.list.push({
                        "schoolName": "深圳",
                        "teacherName": "老师",
                        "classTotalNumber": 80,
                        "classAnswerNumber": i + 5
                    });
                }
                if (i > 10) {
                    json.list.push({
                        "schoolName": "S",
                        "teacherName": "T",
                        "classTotalNumber": 80,
                        "classAnswerNumber": i + 10
                    });
                }
                if (i > 15) {
                    for (var j = 0; j < 20; j++) {
                        json.list.push({
                            "schoolName": "学校名称",
                            "teacherName": "老师姓名",
                            "classTotalNumber": 80 + j,
                            "classAnswerNumber": j + j * 2 + i
                        });
                    }
                }
                jsBridgeAnswerHtml.numberClasses(json);
            }, 100 * i)
        })(i);
    }
}

// 正确率
function tClassesCorrectRate() {
    for (var i = 0; i < 30; i++) {
        (function(i) {
            setTimeout(function() {
                var json = {
                    "totalNumber": 150,
                    "answerNumber": 50 + i,
                    "list": [{
                        "schoolName": "上海",
                        "teacherName": "范思卡",
                        "classTotalNumber": 100,
                        "classAnswerNumber": i + 60,
                        "classRightNumber": i + 60 - 30
                    }, {
                        "schoolName": "北京",
                        "teacherName": "李昕",
                        "classTotalNumber": 100,
                        "classAnswerNumber": i + 40,
                        "classRightNumber": i + 40 - 20
                    }, {
                        "schoolName": "城市名称",
                        "teacherName": "老师姓名",
                        "classTotalNumber": 100,
                        "classAnswerNumber": i,
                        "classRightNumber": i
                    }]
                }
                if (i > 5) {
                    json.list.push({
                        "schoolName": "深圳",
                        "teacherName": "老师",
                        "classTotalNumber": 80,
                        "classAnswerNumber": i + 5,
                        "classRightNumber": i + 5 - 3
                    });
                }
                if (i > 10) {
                    json.list.push({
                        "schoolName": "S",
                        "teacherName": "T",
                        "classTotalNumber": 80,
                        "classAnswerNumber": i + 10,
                        "classRightNumber": i + 10 - 5
                    });
                }
                if (i > 15) {
                    for (var j = 0; j < 20; j++) {
                        json.list.push({
                            "schoolName": "学校名称",
                            "teacherName": "老师姓名",
                            "classTotalNumber": 80 + j,
                            "classAnswerNumber": j + j * 2 + i,
                            "classRightNumber": j + j * 1 + i
                        });
                    }
                }
                jsBridgeAnswerHtml.classesCorrectRate(json);
            }, 100 * i)
        })(i);
    }
}

function tChangePageElement() {
    var json = {
        "title": "第3题",
        "link": 17
    }
    jsBridgeAnswerHtml.changePageElement(json);
}

function t() {
    tNumberAnswer();
    tNumberClasses();
    tChangePageElement();
    setTimeout(function() {
        tClassesCorrectRate();
    }, 5000);
}


function tt() {
    $('#myCicle').html('').circliful({
        foregroundColor: "#1bcb69",
        backgroundColor: "#182024",
        animation: 0,
        animationStep: 0,
        foregroundBorderWidth: 18,
        backgroundBorderWidth: 18,
        replacePercentageByText: $v.vNumberClasses.answerNumber + '/' + $v.vNumberClasses.totalNumber,
        percent: 50
    });
}