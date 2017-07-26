$(function(){






    ajaxRequest('post',homework_s.t_mmmm,{Tcid:getRequest('tid').tid},function(e){
            var Month = e.data.homeworkTime.substr(5,2);
            var Day = e.data.homeworkTime.substr(7,2);
            var teaName = e.data.teacherNam;
            var json = {
                'title':''+Month+'月'+Day+'日的优秀作业',
                'text':''+teaName+'老师公布了今日的优秀作业，快看看你被选中了吗？',
                'url':'https://mp.weixin.qq.com/misc/getheadimg?token=547158264&fakeid=3241894319&r=715597',
            };
            console.log(Month+','+Day)
        weChatData(json);
        var data = e.data;
            $('.title_s i').html(data.className);
            $('.title_s p').eq(1).html(data.teacherName+'老师');
            $('.title_s p').eq(2).html('日期:'+data.homeworkTime);
            for(var i = 0;i<data.StudentHomeInfo.length;i++){
                var music = '';
                var Img = '';
                var Media = data.StudentHomeInfo[i].RevampFile;
                if(Media.length!=0){
                    for(var k = 0;k<Media.length;k++){
                        if(Media.fileType=='mp3'){
                            music += '<div class="music_s"> <span>10"</span> </div> '
                        }else{
                            Img += '<div><img src="'+Media[k].url+'" alt=""></div>'
                        }
                    }
                }
                $('.homework_big').append('<div class="homework_small"> <div class="homework_small_title"> <h4>'+data.StudentHomeInfo[i].studentName+'同学</h4> </div> <div class="answer_s"> <p>'+ decodeURI(data.StudentHomeInfo[i].description)+'</p></div>'+music+'<div class="imgBox imgBox_s"> '+Img+'</div> </div>')
            }
    });















})