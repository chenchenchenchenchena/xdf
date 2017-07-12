$(function(){
        var trardata = {
            'teacherCode':'TC41',
            'schoolId':'73'
        };
        var homeworksubm = {
            'teacherEmail':'caoxuefeng@xdf.cn',
            'teacherName':'曹雪峰',
            'schoolId':'73'
        };




        //获取班级信息
        ajax_S(homework_s.t_clas,trardata,function(e){
            console.log(e)
            var className = e.data.Data;
            for(var a = 0;a<className.length;a++){
                $('.class_name ul').append('<li classCode="'+className[a].ClassCode+'"><img src="images/C05_06.png" alt="">'+className[a].ClassName+'</li>')
            }
        });

        //选择班
        $('.class_s').on('touchend',function(){
            $('.class_name').show();
            $('.class_name').animate({'bottom':'0px'});
            $('.class_name').show();
            $('.big_back').show();
        });

        $(document).on('touchend','.class_name li',function(){
            var html_ = $('.class_name i').html();
           if($(this).find('img').attr('src')=='images/C05_06.png'){
               $(this).find('img').attr('src','images/C0503.png');
               html_++;
               $('.class_name i').html(html_);
           }else{
               $(this).find('img').attr('src','images/C05_06.png');
               html_--;
               $('.class_name i').html(html_);
           }
        });

        var className = '';
        var classCode = '';
        //确认班级
        $('.class_sub').on('touchend',function(){
        className = '';
        classCode = '';
        $(this).parent().find('li').each(function(){
            if($(this).find('img').attr('src')=='images/C0503.png'){
                className+= $(this).text()+'；';
                classCode+= $(this).attr('ClassCode')+',';
            }
        });

        if(className==''){
                layer.open({
                    type: 1,
                    area: ['312px', '194px'],
                    shade:0,
                    title:'',
                    skin: '',
                    time:3000,
                    content:$(".classEmpty")
                })
        }

        if($('.class_name i').html()!='0'){
            $('.class_s i').html('已选择'+$('.class_name i').html()+'个班&nbsp;&nbsp;'+className+' ');
            $('.class_name').animate({'bottom':'-438px'});
            $('.big_back').hide();
        }else{
            $('.class_s i').html('');
        }
    });


        //作业描述验证
        $('.home_text textarea').on('keyup',function(){
            if($(this).val().length>200){
                $('.home_text span').css('color','red');
            }else{
                $('.home_text span').css('color','#808080');
            }
            $('.home_text span').html(''+$(this).val().length+'/200')
        });

        //知识点验证
        $('.Knowledge input').on('keyup',function(){
            var html_ = $(this).val();
            if(html_.indexOf(',')!=html_.lastIndexOf(',')&&html_.lastIndexOf(',')!=-1){
                    $(this).val(html_.substr(0,html_.length-1))

            }
            if(html_.indexOf(';')!=html_.lastIndexOf(';')&&html_.lastIndexOf(';')!=-1){
                $(this).val(html_.substr(0,html_.length-1))
            }
            if(html_.indexOf('，')!=html_.lastIndexOf('，')&&html_.lastIndexOf('，')!=-1){
                $(this).val(html_.substr(0,html_.length-1))
            }
            if(html_.indexOf('；')!=html_.lastIndexOf('；')&&html_.lastIndexOf('；')!=-1){
                $(this).val(html_.substr(0,html_.length-1))
            }
            if(html_.indexOf(',')!=-1){
                if(html_.indexOf(';')!=-1||html_.indexOf('，')!=-1||html_.indexOf('；')!=-1){
                    $(this).val(html_.substr(0,html_.length-1))
                }
            }
            if(html_.indexOf(';')!=-1){
                if(html_.indexOf(',')!=-1||html_.indexOf('，')!=-1||html_.indexOf('；')!=-1){
                    $(this).val(html_.substr(0,html_.length-1))
                }
            }
            if(html_.indexOf('，')!=-1){
                if(html_.indexOf(';')!=-1||html_.indexOf(',')!=-1||html_.indexOf('；')!=-1){
                    $(this).val(html_.substr(0,html_.length-1))
                }
            }
            if(html_.indexOf('；')!=-1){
                if(html_.indexOf(';')!=-1||html_.indexOf('，')!=-1||html_.indexOf('，')!=-1){
                    $(this).val(html_.substr(0,html_.length-1))
                }
            }
            });



        $('.Choice_s input').on('change',function(){
            $('.time_S i').html($(this).val())
        });
        //提交作业
        $('.Submit_s').on('touchend',function(){
            if($('.class_s i').html()==''){
                layer.open({
                    type: 1,
                    area: ['312px', '194px'],
                    shade:0,
                    title:'',
                    skin: '',
                    time:3000,
                    content:$(".classEmpty")
                })
                 return false;
            }
            if($('.time_S i').html()==''){
                layer.open({
                    type: 1,
                    area: ['312px', '194px'],
                    shade:0,
                    title:'',
                    skin: '',
                    time:3000,
                    content:$(".classTime")
                })
                return false;
            }
            if($('.Knowledge input').val()==''){
                layer.open({
                    type: 1,
                    area: ['312px', '194px'],
                    shade:0,
                    title:'',
                    skin: '',
                    time:3000,
                    content:$(".classKnow")
                })
                return false;
            }
            if($('.home_text textarea').val()==''){
                layer.open({
                    type: 1,
                    area: ['312px', '194px'],
                    shade:0,
                    title:'',
                    skin: '',
                    time:3000,
                    content:$(".classHome")
                })
                return false;
            }
            console.log($('.home_text span').css('color'))
            if($('.home_text span').css('color')=='rgb(255, 0, 0)'){
                layer.open({
                    type: 1,
                    area: ['312px', '194px'],
                    shade:0,
                    title:'',
                    skin: '',
                    time:3000,
                    content:$(".classText")
                })
                return false;
            }

            var class_c = classCode.substr(0,classCode.length-1);
            var class_n = className.replace(/\；/g,',').substr(0,className.length-1);
            homeworksubm.classCode = class_c;
            homeworksubm.className = class_n;
            homeworksubm.homeworkTime = $('.time_S i').html();
            homeworksubm.knowledgePoint = $('.Knowledge input').val();
            homeworksubm.description = $('.home_text textarea').val();
            homeworksubm.fileInfo = [];

            ajax_S(homework_s.t_sbim,homeworksubm,function(e){
                if(e.result==true){
                    $('.big_back').show();
                    $('.succ').show();
                }else{
                    $('.big_back').show();
                    $('.erro').show();
                }
            })


        });
        //状态点击
        $('.succ input').on('touchend',function(){
            $('.big_back').hide();
            $('.succ').hide();
        });

        $('.erro input:first-of-type').on('touchend',function(){
            $('.big_back').hide();
            $('.erro').hide();
        });

        $('.erro input:last-of-type').on('touchend',function(){
            $('.big_back').hide();
            $('.erro').hide();
            ajax_S(homework_s.t_sbim,homeworksubm,function(e){
                if(e.result==true){
                    $('.big_back').show();
                    $('.succ').show();
                }else{
                    $('.big_back').show();
                    $('.erro').show();
                }
            })
        });

        $('.big_back').on('touchend',function(){
        if($('.class_name').css('display')=='block'){
            $('.class_name').animate({'bottom':'-438px'});
            $(this).hide();
            $('.class_name i').html('0');
            $('.class_name img').attr('src','images/C05_06.png');
            if($('.class_name i').html()=='0'){
                $('.class_s i').html('')
            }
        }
        if($('.succ').css('display')=='block'){
            $(this).hide();
            $('.succ').hide();
        }
        if($('.erro').css('display')=='block'){
            $(this).hide();
            $('.erro').hide();
        }
    });























});