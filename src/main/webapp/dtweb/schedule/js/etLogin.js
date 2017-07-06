/**
 * Created by xupingwei on 2017/7/4.
 */
/**
 * Created by xupingwei on 2017/7/3.
 */
function etlogin(callback){
    var  cbconfig = {'callbackFlag':callback};
    $.ajax({
        url: url.e_elog,
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(cbconfig),
        success:function(e){
            if (e.result == true) {
                localStorage.setItem("statusFlag","teacher");
                //清除学生信息
                sessionStorage.clear();
                location.href = e.url;

            } else {
                layer.msg("登陆失败,请稍候再试!", {icon: 5});
            }
        }
    })
}
