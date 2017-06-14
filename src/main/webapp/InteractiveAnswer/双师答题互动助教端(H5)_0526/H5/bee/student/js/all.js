// 2017-4-7 11:52:36
function helperPercent(number, total) {
    if (total == 0) {
        return 0;
    } else {
        return Math.floor(number / total * 100 * 100) / 100;
    }
}

var jsBridgeAnswerHtml = {};

jsBridgeAnswerHtml.changePageElement = function(result) {
    debugData(result, "题号");
    $("#js-questionNum").show();
    $("#js-questionNum").html(result.title);
}

jsBridgeAnswerHtml.realtimeAnswer = function(result) {
    debugData(result, "实时答题状态");
    if (!this.realtimeAnswerFirst) {
        this.realtimeAnswerFirst = true;     
        carrotInit();
        rabbitInit();
    }
    rabbitPush(result);
    carrotPush(result);
   
}

jsBridgeAnswerHtml.rankingAnswer = function(result) {
    debugData(result, "答题排名");
    if (!this.rankingAnswerFirst) {
        this.rankingAnswerFirst = true;
        carrotHide();
        rebbitReset();
        $("#js-medal").show();
        $("#js-balloon").show();
    }
    balloonCreate(result);
    Medal.show(result);
    setTimeout(function() {
        //Medal.hide(result);
        Rank.show(result)
    }, 1000);
}
//时间
/*function time(){
	return (new Date()).toLocaleTimeString();
}*/

// 萝卜
function carrotInit() {
    $("#js-carrot").show();
}

function carrotPush(result) {
    $(".f-carrot-number").text(result.classAnswerNumber);
    $(".f-carrot-total").text(result.classTotalNumber);
    var percent = 100 - helperPercent(result.classAnswerNumber, result.classTotalNumber);
    $(".f-carrot-grey").css({
        "height": percent + "%"
    });
}

function carrotHide() {
    $("#js-carrot").animate({
        "right": "-300px"
    }, 500, function() {

    });
}

function carrotReset() {
    $("#js-carrot").animate({
        "right": "30px"
    }, 500, function() {

    });
}

// 兔子
// 画布尺寸 1366 * 768
// 素材尺寸 159 * 189
// 字体 40
var rabbitItems = [];
var timer = [];
var rabbitPosition = ["45%", "30%", "60%", "15%", "75%"];
var rabbitIndex = 0;
var Rabbit = function(item) {
    if (rabbitIndex > 4) {
        rabbitIndex = 0;
    }
    this.obj = $('<div class="f-rabbit-item bee'+rabbitIndex+'"><h1>' + item.studentName + '</h1><div class="bg"></div><i class="fly-L"></i><i class="fly-R"></i></div>').css({
        "left": rabbitPosition[rabbitIndex]
    });
    $("#js-rabbit").append(this.obj);
    rabbitIndex++;
	
}

// Rabbit.prototype.move = function() {
//     var _obj = this.obj;
//     var _height = this.height;
//     _obj.css({
//         "left": this.x,
//         "bottom": -_height,
//         "margin-left": this.marginLeft
//     });
//     _obj
//         .animate({
//             "bottom": 0
//         }, 800, function() {
//             _obj.animate({
//                 "bottom": -_height
//             }, 500, function() {

//             });
//         });
// }

function rabbitPush(data) {
    for (var i = 0; i < data.list.length; i++) {
        rabbitItems.push(data.list[i]);
        timer.push((new Date()).toLocaleTimeString())
    }
}

function rabbitRun() {
    if (window.rabbitAuto == undefined) {
        window.rabbitAuto = setInterval(function() {
            if (rabbitItems.length > 0) {
                new Rabbit(rabbitItems.shift());
            }
        }, 200);
    }
}

function rebbitReset() {
    clearInterval(window.rabbitAuto);
    window.rabbitAuto = undefined;
    rabbitItems = [];
    rabbitRun();
}

function rabbitInit() {
    $("#js-rabbit").show();
    rabbitRun();
}

// 泡泡飞
var Balloon = function(position, item) {
    this.obj = $('<div class="f-balloon-item">' + item.studentName + '</div>');
    this.x = position;
    this.y = Math.random() * 100;
    this.strength = {
        x: 0.04 + Math.random() / 1000,
        y: 0.6 + Math.random() / 2
    }
    this.amplifier = Math.random() * 20;
    this.angle = 0;
    var that = this;
    this.loop = setInterval(function() {
        that.move();
    }, 10);
    $("#js-balloon").append(this.obj);
    return this.obj;
}

Balloon.prototype.move = function() {
    this.y += this.strength.y;
    this.angle += this.strength.x;
    this.obj[0].style.bottom = this.y + "px";
    this.obj[0].style.left = this.x + this.amplifier * Math.sin(this.angle) + "px";
    if (this.y > 400) {
        this.remove();
    }
}

Balloon.prototype.remove = function() {
    var that = this;
    that.obj.addClass("f-balloon-item-s3");
    setTimeout(function() {
        that.obj.css('transform', 'scale(0)')
        that.obj.html('')
        that.obj.removeClass('f-balloon-item-s3').addClass("f-balloon-item-s4");
    }, 400);

    setTimeout(function() {
        clearInterval(that.loop);
        that.obj.remove();
    }, 600);
}


//指定数组中随机取出N个不重复的数据
function getArrayItems(arr, num) {
    var temp_array = new Array();
    for (var index in arr) {
        temp_array.push(arr[index]);
    }
    var return_array = new Array();
    for (var i = 0; i < num; i++) {
        if (temp_array.length > 0) {
            var arrIndex = Math.floor(Math.random() * temp_array.length);
            return_array[i] = temp_array[arrIndex];
            temp_array.splice(arrIndex, 1);
        } else {
            break;
        }
    }
    return return_array;
}

function balloonCreate(data) {
    var distance = $(document).width() / 10;
    var position = [];
    for (var i = 0; i < 10; i++) {
        position.push(distance * i);
    }
    position[0] = 30;
    position[9] = position[9] - 30;

    var list = data.list;
    var total = data.list.length;
    var jArrayIndex = 0;
    var jArray = [];
    var jTemp = 1;

    for (var i = 0; i < list.length; i++) {
        if (!jArray[jArrayIndex]) {
            jArray[jArrayIndex] = [];
        }
        jArray[jArrayIndex].push(list[i]);
        jTemp++;
        if (jTemp == 6) {
            jTemp = 1;
            jArrayIndex++;
        }
    }

    for (var j = 0; j < jArray.length; j++) {
        (function(j) {
            setTimeout(function() {
                for (var k = 0; k < jArray[j].length; k++) {
                    var _position = getArrayItems(position, 5);
                    new Balloon(_position[k], jArray[j][k]);
                }
            }, 1500 * j);
        })(j);
    }
}

// 奖牌
var Medal = {
    show: function(data) {
        $(".f-medal-wrap")
            .show()
            .addClass("f-medal-show");
        setTimeout(function() {
            $(".f-medal-text").html(data.answer.toUpperCase());
        }, 200);
    },
    hide: function() {
        var that = this;
        $(".f-medal-wrap")
            .removeClass("f-medal-show")
            .addClass("f-medal-hide");
        setTimeout(function() {
            $(".f-medal-text").html("");
        }, 350);
        setTimeout(function() {
            $(".f-medal-wrap").hide();
            that.reset();
        }, 400);
    },
    reset: function() {
        $(".f-medal-wrap")
            .removeClass("f-medal-show")
            .removeClass("f-medal-hide");
    }
}

// 排行榜
var Rank = {
    show: function(data) {
        $(".f-rank-wrap-scale").show()
        $(".f-rank-wrap").addClass("f-rank-wrap-animation");
        /*setTimeout(function() {
            $(".f-rank-glow").fadeIn().addClass("f-rank-glow-animation");
            $('.f-rank-colours').addClass('f-rank-colours-animation').removeClass("f-rank-colours-ext");
            $(".f-rank-cup").fadeIn().addClass("f-rank-cup-animation");
            setTimeout(function() {
                $(".js-rank-main p").each(function(index) {
                    if (data.list[index] && data.list[index].studentName) {
                        $(this).html(data.list[index].studentName)
                        $(this).animate({
                            "width": 220
                        });
                    }
                })
            }, 100)
        }, 600);*/
        
        $(".js-rank-main p").each(function(index) {
            if (data.list[index] && data.list[index].studentName) {
                $(this).html('<i>'+(index+1)+'</i><span>'+data.list[index].studentName+'<br/>'+'时间:'+timer[index]+'</span>')
            }
        })
        
        var ulHtml='';
        $.each(data.list,function(index,item){
            if(index>2){
                ulHtml+='<li><i>'+(index+1)+'</i><span>'+item.studentName+'</span></li>';
            }
        })
        if(data.list.length>3){
            $('.f-rank-board-list').show();
            $('.f-rank-board-list ul').html(ulHtml);
        }
    }
}

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