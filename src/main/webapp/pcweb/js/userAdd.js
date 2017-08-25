$(function () {
    /** 判断是否编辑 **/
    if(GetRequest('oper')!='add'){//编辑
        $('#inputLoginId').attr('disabled','disabled');
        $('#inputLoginId').attr('placeholder','');
        var userIdIn = GetRequest('userId');
        $('#inputLoginId').val(userIdIn);
        $('#userName').val(GetRequest('userName'));
        $('#email').val(GetRequest('email'));
        $('#position').val(GetRequest('position'));
        $('#school').val(GetRequest('school'));
        var department = GetRequest('department');
        if(department==""||department==null||department==undefined||department=='undefined'){
            department = "";
        }
        $('#department').val(department);
        var param = {"userId": userIdIn};
        getFunctions(param);
    }else{
        var param = {"userId": ""};
        getFunctions(param);
    }
    //确定
    $(document).on('click','.sure',function(){
        if(GetRequest('oper')!='add'){//编辑
            updateUser();
        }else{//添加
            saveUser();
        }
    });
    /**
     * 获取权限列表（学校列表）
     */
    var data = [];
    var nSchoolId;
    var table = {
        "tableName": "dict_school_info"
    };
    ajaxRequest("POST", url.s_select, table, selectData);
    function selectData(json) {
        console.log(json);
        if (json.code == "200") {
            var sschoolList = json.data;
            for (var i = 0; i < sschoolList.length; i++) {
                if (sschoolList[i].tName != null && sschoolList[i].tName != "NULL") {
                    var scAdept = {
                        "id": sschoolList[i].tCode,
                        "text": sschoolList[i].tName,
                        "attributes": 1
                    };
                    if(GetRequest('auth')!=""&&GetRequest('auth')!=null){
                        if(GetRequest('auth').indexOf(sschoolList[i].tCode)!=-1){
                            var scAdept = {
                                "id": sschoolList[i].tCode,
                                "text": sschoolList[i].tName,
                                "attributes": 1,
                                "checked": true
                            };
                        }
                    }
                    data.push(scAdept);
                }
            }
            $("#treeConstant").tree({
                data: data,
                checkbox: true,
                cascadeCheck: true,
                onClick: function (node) {//单击事件
                    nSchoolId = node.id;
                },
                onCheck: function (node, checked) {
                    if (checked) {
                        var parentNode = $("#treeConstant").tree('getParent', node.target);
                        if (parentNode != null) {
                            $("#treeConstant").tree('check', parentNode.target);
                        }
                    } else {
                        var childNode = $("#treeConstant").tree('getChildren', node.target);
                        if (childNode.length > 0) {
                            for (var i = 0; i < childNode.length; i++) {
                                $("#treeConstant").tree('uncheck', childNode[i].target);
                            }
                        }

                    }
                }
            });
        } else {
            layer.msg("查询失败!", {icon: 5})
        }
    }

    /**
     * 获取功能列表
     */
    function getFunctions(param){
        jQuery.ajax({
            type: "POST",
            url: url_o + "/function/getAllFunction.do",
            async: false,//同步
            dataType: 'json',
            // data: getCookie("userId"),
            data: JSON.stringify(param),
            success: function (e) {
                if (e.result && e.dataList != undefined && e.dataList != null) {
                    var data = e.dataList;
                    reChecked(data);
                    $("#functionTree").tree({
                        data: e.dataList,
                        checkbox: true,
                        cascadeCheck: true
                    });
                }

            }
        });
    }
});
var baseUrl = "http://dt.staff.xdf.cn/xdfdtmanager/";//测试环境
var actionUrl = {
    'searchUser': 'user/searchUser.do',//通过邮箱前缀获取账号信息
    'addUser': 'user/addUser.do' ,//添加账号信息
    'addFunction':'function/addFunctionUser.do',//添加账号权限信息
    'updateUserFun':'user/updateUser.do'//编辑用户账号权限信息
};
/*
 * 清空联动信息
 * */
var userInfo_clearInput = function () {
    $("#userName").val("");
    $("#email").val("");
    $("#department").val("");
    $("#position").val("");
    $("#school").val("");
}
/*
 * 通过邮箱前缀获取账号信息
 * */
function getMoreUserInfo() {
    $("#inputLoginId").autocomplete({
        source: function (request, response) {
            var businessP = {"keyword": $("#inputLoginId").val(), "pageSize": "20", "currentPage": "1"};
            /*var d = constructionParams(rsaEncryptedString(businessP), "18b868e977054ebcbcb7accc001b2262");*/
            jQuery.ajax({
                type: "POST",
                url: baseUrl + actionUrl.searchUser,
                async: false,//同步
                dataType: 'json',
                data: JSON.stringify(businessP),
                success: function (json) {
                    if (json.result == true) {
                        // var data = $.parseJSON(json.data);
                        var data = json.data;
                        if (data.length <= 0) {
                            userInfo_clearInput();
                            layer.msg("未查询到账户，请重新输入", {icon: 5});
                        } else {
                            response($.map(data, function (item) {
                                return {
                                    label: item.emailAddr,
                                    value: item.emailAddr,
                                    username: item.name,
                                    email: item.emailAddr + "@xdf.cn",
                                    department: item.deptName,
                                    position: item.PositionName,
                                    school: item.companyName
                                }
                            }));
                        }
                    } else {
                        userInfo_clearInput();
                        layer.msg("查询失败!", {icon: 5})
                    }
                }
            });
        },
        select: function (event, ui) {
            $("#userName").val(ui.item.username);
            $("#email").val(ui.item.email);
            $("#department").val(ui.item.department);
            $("#position").val(ui.item.position);
            $("#school").val(ui.item.school);
            /*var loginId = $("#inputLoginId").val();
             verifyRepeat(loginId);*/
        }
    });
}

/*
 * 保存数据
 * */
function saveUser() {
    layer.load(2, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });//遮罩加载
    /** 权限编号 **/
    var checkeds = $('#treeConstant').tree('getChecked', 'checked');
    var authCodeArr = [];
    for (var i = 0; i < checkeds.length; i++) {
        var id = checkeds[i].id;
        authCodeArr.push(id);
    }

    var userId = $('#inputLoginId').val();
    var userName = $('#userName').val();
    var email = $('#email').val();
    var authCodeStr = authCodeArr.join(',');//权限标号 string
    if (userId == "") {
        layer.msg("账号不能为空！", {icon: 5});
        layer.closeAll('loading');
        return false;
    }
    if (userName == "") {
        layer.msg("用户名不能为空！", {icon: 5});
        layer.closeAll('loading');
        return false;
    }
    if (authCodeStr == "") {
        layer.msg("权限不能为空！", {icon: 5});
        layer.closeAll('loading');
        return false;
    }
    var resParams = {
        "userId": userId,//邮箱前缀
        "loginId": userId,//账号
        "passWord": '',//密码
        "userName": userName,//用户名
        "email":email ,//邮箱
        "department": $('#department').val(),//部门
        "position": $('#position').val(),//职位
        "school": $('#school').val(),//学校
        "auth":authCodeStr//权限编号
    };
    /* var d = constructionParams(rsaEncryptedString(businessP), "3bb45d62a96e494c8033c3fc9d79409b");*/
    jQuery.ajax({
        type: "POST",
        url: baseUrl + actionUrl.addUser,
        async: true,
        dataType: 'json',
        data: JSON.stringify(resParams),
        success: function (json) {
            if (json.result == true) {
                //添加功能管理权限
                var functionCheckedList = $("#functionTree").tree('getChecked', ['checked', 'indeterminate']);
                var functionArray = [];
                if(functionCheckedList.length>0){
                    console.log(functionCheckedList);
                    for (var i = 0; i < functionCheckedList.length; i++) {
                        var functionId = functionCheckedList[i].id;
                        functionArray.push(functionId);
                    }
                    var functionIds = functionArray.join(',');
                    addFunIds(userId,functionIds);
                }else{
                    layer.msg("功能管理不能为空!", {icon: 5});
                }
                //window.location.href = 'userList.html';
                // addCategoryUser(loginId, functionArray);
            } else {
                layer.msg("保存失败!", {icon: 5});
            }
            layer.closeAll('loading');
        }
    });


}
/*添加功能管理权限*/
function addFunIds(userId,functionIds) {
    var resParams = {
        "userId":userId,//邮箱
        "functionIds":functionIds//权限编号
    };
    jQuery.ajax({
        type: "POST",
        url: baseUrl + actionUrl.addFunction,
        async: true,
        dataType: 'json',
        data: JSON.stringify(resParams),
        success: function (json) {
            if (json.result == true) {
                layer.msg("保存成功!", {icon: 6});
                window.location.href = 'userList.html';
            } else {
                layer.msg("保存失败!", {icon: 5});
            }
            layer.closeAll('loading');
        }
    });
}
/*
 * 编辑数据
 * */
function updateUser() {
    layer.load(2, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });//遮罩加载
    /** 权限编号 **/
    var checkeds = $('#treeConstant').tree('getChecked', 'checked');
    var authCodeArr = [];
    for (var i = 0; i < checkeds.length; i++) {
        var id = checkeds[i].id;
        authCodeArr.push(id);
    }
    var authCodeStr = authCodeArr.join(',');//权限标号 string
    if (authCodeStr == "") {
        layer.msg("权限不能为空！", {icon: 5});
        layer.closeAll('loading');
        return false;
    }
    //添加功能管理权限
    var functionCheckedList = $("#functionTree").tree('getChecked', ['checked', 'indeterminate']);
    var functionArray = [];
    var functionIds = "";
    if(functionCheckedList.length>0){
        console.log(functionCheckedList);
        for (var i = 0; i < functionCheckedList.length; i++) {
            var functionId = functionCheckedList[i].id;
            functionArray.push(functionId);
        }
        functionIds = functionArray.join(',');
    }else{
        layer.msg("功能管理不能为空!", {icon: 5});
        layer.closeAll('loading');
        return false;
    }
    var resParams = {
        "auth":authCodeStr,//权限编号
        "userid":GetRequest('userId'),//邮箱前缀
        "functionIds":functionIds//权限编号
    };
    jQuery.ajax({
        type: "POST",
        url: baseUrl + actionUrl.updateUserFun,
        async: true,
        dataType: 'json',
        data: JSON.stringify(resParams),
        success: function (json) {
            if (json.result == true) {
                layer.msg("修改成功!", {icon: 6});
                window.location.href = 'userList.html';
            } else {
                layer.msg("修改失败!", {icon: 5});
            }
            layer.closeAll('loading');
        }
    });


}

//重新加载
function reload() {
    location.reload();
    window.location.href = 'userList.html';
}
function reChecked(data) {
    if (data == null || data.length == 0) {
        return;
    }
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var checked = item.checked;
        var children = item.children;
        if (checked && children != null && children.length > 0) {
            item.checked = false;
            reChecked(children);
        }
    }
}
