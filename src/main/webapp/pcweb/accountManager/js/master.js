/**
 * Created by xupingwei on 2017/10/25.
 */
$(function () {
    var mastertae = [];
    var firstIn = true;
    findList();
    function findList() {

        ajax_S(url.data_s, '', function (json) {

            if (json.data.length > 0) {
                var userList = json.data;
                var str = "";
                for (var i = 0; i < userList.length; i++) {
                    var pid = userList[i].teacherId;
                    var userName = userList[i].loginName;
                    var email = userList[i].accountId;
                    var gradeCourse = userList[i].gradeCourse;
                    var isEnabled = userList[i].invalid;

                    if (i % 2 == 1) {
                        str += "<tr class='table-tr-odd'>"
                    } else {
                        str += "<tr class='table-tr-even'>"
                    }
                    str += "<td id='" + pid + "' style='display: none'></td>";
                    str += "<td style='display: none'>" + pid + "</td>";
                    str += "<td>" + userName + "</td>";
                    str += "<td style='word-wrap:break-word'>" + email + "</td>";
                    str += "<td>" + gradeCourse + "</td>";

                    str += "<td>";
                    str += "<div class='p176-table-btnGroup'>";
                        str += "<a href='javascript:;' class='p176-btn-edit'><i></i>编辑</a>";
                        if (isEnabled == 1) {
                            str += "<a href='javascript:;' class='p176-btn-able' onclick='enabledUser(this,\"" + pid + "\")'><i></i>禁用</a>";
                        } else {
                            str += "<a href='javascript:;' class='p176-btn-disable' onclick='enabledUser(this,\"" + pid + "\")'><i></i>启用</a>";
                        }
                    str += "</div>";
                    str += "</td>";
                    str += "</tr>";

                }
                $("#userTbody").html(str);
            } else {
                layer.msg("查询失败!", {icon: 5});
            }
        });
    }

    /**
     * 启用／禁用
     * @param pid
     */
    function enabledUser(pid) {

    }

    /**
     * 新建账号
     */
    function addMaster() {

    }

})
