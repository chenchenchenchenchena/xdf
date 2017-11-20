$(function(){
    //初始化班级列表
    var classCode  = ['AYU4EB02','AYP6EB02','AYU1EA02'];
    var classCode_  = 'AYU4EB02,AYP6EB02,AYU1EA02';
    var Class_stu;
    for(var i = 0;i<classCode.length;i++){
        $('.stu_list ul').append('<li><a href="javascript:;">'+classCode[i]+'</a></li>')
    }
    $('.stu_list ul').find('li').eq(0).addClass('hwShow');
    //请求学生列表
    ajaxRequest('post',url.h_list,{'classCode':classCode_,'schoolId':'73'},function(e){
        console.log(e);
        var Data = e.data;
        Class_stu = e.data;
        for(var k = 0;k<Data.length;k++){
        $('.bi_stulist').append('<div class="stulist_"><div class="checked" classCode="'+Data[k].classCode+'"><h4>已选 <span><img src="images/stu_check.png" alt="">全选</span></h4><ul></ul></div><div class="check"><h4>待选 (点击添加到已选)</h4> <ul></ul> </div> </div>');
                var Stu = Data[k].students;
                for(var i = 0;i<Stu.length;i++){
                    $('.stulist_').eq(k).find('.check ul').append('<li Name="'+Stu[i].Name+'" SchoolId="'+Stu[i].SchoolId+'" Code="'+Stu[i].Code+'"><span>'+Stu[i].Name+'</span><p>'+Stu[i].Name+'</p></li>')
                }
        }
        $('.stulist_').eq(0).show();
    },function(){
        layer.msg('加载失败，请刷新重试')
    });
    //全选
    $('.bi_stulist').on('touchend','.checked h4 span',function(){
        var img_src = $(this).find('img').attr('src');
        var checked_ = $(this).parents('.checked').find('ul');
        var check_ = $(this).parents('.checked').siblings('.check').find('ul');
        if(img_src.indexOf('checked')!=-1){ //选中
            $(this).find('img').attr('src','images/stu_check.png');
            check_.append(checked_.html());
            checked_.html(null)
        }else{
            $(this).find('img').attr('src','images/stu_checked.png');
            checked_.append(check_.html())
            check_.html(null)
        }
    });
    //选中
    $('.bi_stulist').on('tap','.check ul li',function(){
        var checked_ = $(this).parents('.check').siblings('.checked').find('ul');
        var check_ = $(this).parents('.check').find('ul');
        checked_.append($(this));
        if(check_.find('li').length==0){
            $(this).parents('.checked').find('img').attr('src','images/stu_checked.png');
        }
    });
    //取消选中
    $('.bi_stulist').on('tap','.checked ul li',function(){
        var checked_ = $(this).parents('.checked').find('ul');
        var check_ = $(this).parents('.checked').siblings('.check').find('ul');
        check_.append($(this));
        $(this).parents('.check').siblings('.checked').find('img').attr('src','images/stu_check.png');
    });

    //切换班级
    $('.stu_list').on('tap','li',function(){
        $(this).addClass('hwShow').siblings().removeClass('hwShow');
       $('.stulist_').eq($(this).index()).show().siblings().hide();
    })

    //提交数据
    $('.Submit_s').on('touchend',function(){
        $('.tips-box').show();
    });
    $('.cancelBtn').on('touchend',function(){
        $('.tips-box').hide();
    });
    $('.confirmBtn').on('touchend',success);
    function success(){
        $('.tips-box').hide();
        var arr = [];
        var all = $('.checked');
        for(var i = 0;i<all.length;i++){
            var allLi =  all.eq(i).find('li');
            var stulist = [];
            for(var k = 0;k<allLi.length;k++){
                var Json = {
                    'Code': allLi.eq(k).attr('Code'),
                    'Name':allLi.eq(k).attr('Name'),
                    'SchoolId':allLi.eq(k).attr('SchoolId')
                };
                stulist.push(Json)
            }
            arr.push({
                'classCode':all.eq(i).attr('classCode'),
                'students':stulist
            });
        }
        console.log(arr)
    }



});