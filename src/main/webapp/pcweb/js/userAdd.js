$(function () {
    /** 判断是否编辑 **/
    if(GetRequest('oper')!='add'){//编辑
        $('#inputLoginId').attr('disabled','disabled');
        $('#inputLoginId').attr('placeholder','');
        $('#inputLoginId').val(GetRequest('userId'));
        $('#userName').val(GetRequest('userName'));
        $('#email').val(GetRequest('email'));
        $('#position').val(GetRequest('position'));
        $('#school').val(GetRequest('school'));
        $('#department').val(GetRequest('department'));
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
                    if(GetRequest('auth').indexOf(sschoolList[i].tCode)!=-1){
                        var scAdept = {
                            "id": sschoolList[i].tCode,
                            "text": sschoolList[i].tName,
                            "attributes": 1,
                            "checked": true
                        };
                    }else{
                        var scAdept = {
                            "id": sschoolList[i].tCode,
                            "text": sschoolList[i].tName,
                            "attributes": 1
                        };
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
    var param = {"userId": ""};
    // var param = {"userId": getCookie("userId")};
    jQuery.ajax({
        type: "POST",
        url: url_o + "/function/getAllFunction.do",
        async: false,//同步
        dataType: 'json',
        // data: getCookie("userId"),
        data: JSON.stringify(param),
        success: function (e) {
            if (e.result && e.dataList != undefined && e.dataList != null) {
                $("#functionTree").tree({
                    data: e.dataList,
                    checkbox: true,
                    cascadeCheck: true
                });
            }

        }
    });


    /**
     * 获取种类
     */
    // var categoryParam = constructionParams("", "5773169bc6324b9fa1fcbf173a775ec8");
    // jQuery.ajax({
    //     type: "POST",
    //     url: Global.actionURL,
    //     //url: "http://10.200.80.196:8080/market/category/getCategoryByUserId.do",
    //     async: false,//同步
    //     dataType: 'json',
    //     data: JSON.stringify(categoryParam),
    //     success: function (result) {
    //         if (result.result) {
    //             //$("#categoryTree").tree({
    //             //    data: result.dataList,
    //             //    checkbox: true,
    //             //    cascadeCheck: true
    //             //});
    //             var categoryList = result.dataList;
    //             var str = "";
    //             for(var i = 0; i < categoryList.length; i ++){
    //                 var category = categoryList[i];
    //                 str += '<option value="' + category.id + '">' + category.name + '</option>';
    //             }
    //             $("#category").append(str)
    //         }
    //
    //     }
    // });


});
var baseUrl = "http://dt.staff.xdf.cn/xdfdtmanager/";//测试环境
var actionUrl = {
    'searchUser': 'user/searchUser.do',//通过邮箱前缀获取账号信息
    'addUser': 'user/addUser.do' ,//添加账号信息
    'addFunction':'function/addFunctionUser.do'//添加账号权限信息
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
                // window.location.href = 'userList.html';
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
        "department": '',//
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
                    addFunIds(email,functionIds);
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





var isRepeatLoginId = false;
function getUserInfo() {
    var inputLoginId = $("#inputLoginId").val();
    if (inputLoginId == '') {
        userInfo_clearInput();
        return;
    }
    var businessP = {"keyword": $("#inputLoginId").val()};
    var d = constructionParams(rsaEncryptedString(businessP), "18b868e977054ebcbcb7accc001b2262");
    jQuery.ajax({
        type: "POST",
        url: Global.actionURL,
        async: false,//同步
        dataType: 'json',
        data: JSON.stringify(d),
        success: function (json) {
            if (json.result == true) {
                var data = $.parseJSON(json.data);
                $("#userName").val(data.Name);
                $("#email").val(data.AccountID + "@xdf.cn");
                $("#department").val(data.Department);
                $("#position").val(data.Title);
                $("#school").val(data.Company);
                /*var loginId = $("#inputLoginId").val();
                 //校验是否当前登录账号
                 verifyRepeat(loginId)*/
            } else {
                userInfo_clearInput();
                layer.msg("未查询到账户，请重新输入", {icon: 5});
            }
        }
    });
}


function verifyRepeat(loginId) {
    var businessP = {
        "loginId": loginId
    };
    var d = constructionParams(rsaEncryptedString(businessP), "c28fc69f67104ce7b3c1ca95b4b29ac3");
    jQuery.ajax({
        type: "POST",
        url: Global.actionURL,
        async: false,//同步
        dataType: 'json',
        data: JSON.stringify(d),
        success: function (json) {
            if (json.result == true && json.data != null) {
                isRepeatLoginId = true;
                layer.msg("用户" + loginId + "已经存在，请确认！", {icon: 5});
            } else {
                // TODO 暂时不操作
            }
        }
    });
}

//重新加载

function reload() {
    location.reload();
}
// function getAreaList(node) {
//     if (node.attributes == 1) {
//         if (!node.children) {
//             nSchoolId = node.id
//             var businessP = {"nSchoolId": node.id};
//             var data = [];
//             var d = constructionParams(rsaEncryptedString(businessP), "41d0a5cd3cb74d9eaf14abfe2e4f139d");
//             jQuery.ajax({
//                 type: "POST",
//                 url: Global.actionURL,
//                 async: false,//同步
//                 dataType: 'json',
//                 data: JSON.stringify(d),
//                 success: function (json) {
//                     if (json.result == true) {
//                         var bsAreaList = json.dataList;
//                         for (var i = 0; i < bsAreaList.length; i++) {
//                             if (bsAreaList[i]['sName'] != null && bsAreaList[i]['sName'] != "NULL") {
//                                 var scAdept = {
//                                     "id": bsAreaList[i]['sCode'],
//                                     "text": bsAreaList[i]['sName'],
//                                     "attributes": 2
//                                 }
//                                 data.push(scAdept);
//                             }
//                         }
//                         var dept = [];
//                         var param = constructionParams(rsaEncryptedString(businessP), "d6ed8c03c2674c72841472009bd35660");
//                         jQuery.ajax({
//                             type: "POST",
//                             url: Global.actionURL,
//                             async: false,//同步
//                             dataType: 'json',
//                             data: JSON.stringify(param),
//                             success: function (json) {
//                                 if (json.result == true) {
//                                     var sDeptList = json.dataList;
//                                     for (var i = 0; i < sDeptList.length; i++) {
//                                         if (sDeptList[i]['sName'] != null && sDeptList[i]['sName'] != "NULL") {
//                                             var scDept = {
//                                                 "id": sDeptList[i]['sCode'],
//                                                 "text": sDeptList[i]['sName'],
//                                                 "attributes": 3
//                                             }
//                                             dept.push(scDept);
//                                         }
//                                     }
//                                 } else {
//                                     layer.msg("查询失败!", {icon: 5})
//                                 }
//                             }
//                         });
//                         $("#treeConstant2").tree({
//                             data: dept,
//                             checkbox: true,
//                             cascadeCheck: false,
//                             onClick: function (node) {
//
//                             },
//                             onCheck: function (node) {
//                                 var pNode = $("#treeConstant2").tree('getParent', node.target);
//                                 if (pNode != null) {
//                                     $("#treeConstant2").tree('check', pNode.target);
//                                 }
//                             }
//                         });
//                     } else {
//                         layer.msg("查询失败!", {icon: 5})
//                     }
//                 }
//             });
//             $('#treeConstant').tree('append', {
//                 parent: node.target,
//                 data: data
//             });
//         }
//     }
//
// }


function addCategoryUser(loginId, functionArray) {
    var param = {
        userId: loginId,
        categoryId: $("#category").val()
    }
    var p = constructionParams(rsaEncryptedString(param), "ea5f45cf47f74a11ba3000351471f990");
    jQuery.ajax({
        type: "POST",
        url: Global.actionURL,
        //url: "http://10.200.80.196:8088/market/function/addFunctionUser.do",
        async: true,
        dataType: 'json',
        data: JSON.stringify(p),
        success: function (json) {
            if (json.result == true) {
                addFunctionUser(loginId, functionArray);
            } else {
                layer.msg("保存失败!", {icon: 5});
            }
        }
    });
}

function addFunctionUser(loginId, functionArray) {

    var param = {
        "userId": loginId,
        "functionIds": functionArray.join("-")
    };
    var p = constructionParams(rsaEncryptedString(param), "bf02b7af9c2a4c87a89921f86b61744b");
    jQuery.ajax({
        type: "POST",
        url: Global.actionURL,
        //url: "http://10.200.80.196:8088/market/function/addFunctionUser.do",
        async: true,
        dataType: 'json',
        data: JSON.stringify(p),
        success: function (json) {
            if (json.result == true) {
                layer.msg("保存成功!", {icon: 6});
                window.location.href = 'userList.html';
            } else {
                layer.msg("保存失败!", {icon: 5});
            }
        }
    });
}