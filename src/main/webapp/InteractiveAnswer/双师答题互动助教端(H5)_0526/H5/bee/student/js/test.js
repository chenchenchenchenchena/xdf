
$(".js-debug").show();

var tOne1Index = 0;
var timer = [];
function tOne1() {  
    tOne1Index++;
    jsBridgeAnswerHtml.realtimeAnswer({
        'classTotalNumber': 43,
        'classAnswerNumber': tOne1Index,
        'list': [{
            'studentName': '李晓'
            
        }]
    })
    /*timer=(new Date()).toLocaleTimeString();*/
    timer.push((new Date()).toLocaleTimeString())
    /*console.log(timer);*/
}

var tOne2Index = 0;

function tOne2() {
    var list = [];
    for (var i = 0; i < 5; i++) {
        tOne2Index++;
        list.push({
            "studentName": "李晓" + i
        });
    }
    jsBridgeAnswerHtml.realtimeAnswer({
        'classTotalNumber': 80,
        'classAnswerNumber': tOne2Index,
        'list': list
    });
}

function tTwo() {
    var list = [];
    for (var i = 0; i < 40; i++) {
        list.push({
            "studentName": "李晓" + i,
            "timer":timer[i]
        });
    }
    jsBridgeAnswerHtml.rankingAnswer({
        'answer': 'C',
        'list': list
    });
   
}

function t() {
    for (var i = 0, l = 30; i < l; i++) {
        (function(i) {
            setTimeout(function() {
                jsBridgeAnswerHtml.realtimeAnswer({
                    "classTotalNumber": l + 5,
                    "classAnswerNumber": i,
                    "list": [{
                        "studentName": "李晓"
                    }]
                });
            }, 50 * i)
        })(i);
    }

    setTimeout(function() {
        tTwo();
    }, 5000);
}

function tChangePageElement() {
    var json = {
        "title": "第3题",
        "link": 17
    }
    jsBridgeAnswerHtml.changePageElement(json);
}