$(function(){















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
        //确认班级
        $('.class_sub').on('touchend',function(){
        className = '';
        $(this).parent().find('li').each(function(){
            if($(this).find('img').attr('src')=='images/C0503.png'){
                className+= $(this).text()+'；';
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
            })




























});