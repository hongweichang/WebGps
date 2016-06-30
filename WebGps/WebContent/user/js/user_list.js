$(document).ready(function(){
	setTimeout(loadUserPage, 50);
});

function loadUserPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadUserPage, 50);
	} else {
		//加载语言
		loadUserLang();
		setInputFocusBuleTip("#usersearch", parent.lang.usermgr_searchUser);
		//加载用户信息
		ajaxLoadUserInfo();
	}
}

function loadUserLang(){
	$("#userTitle").text(parent.lang.usermgr_navUser);
	$("#addUser").text(parent.lang.add);
	$("#delSelUser").text(parent.lang.del);
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.usermgr_name);
	$("#thAccount").text(parent.lang.usermgr_account);
	$("#thRole").text(parent.lang.usermgr_role);
	$("#thValidaty").text(parent.lang.usermgr_validaty);
	$("#thLinkman").text(parent.lang.usermgr_linkman);
	$("#thTelephone").text(parent.lang.usermgr_telephone);
	$("#thEmail").text(parent.lang.usermgr_email);
	$("#thUrl").text(parent.lang.usermgr_url);
	$("#thAddress").text(parent.lang.usermgr_address);
	$("#thOperator").text(parent.lang.operator);
	$("#btnSearchUser").text(parent.lang.search);
}

function ajaxLoadUserInfo(curpage, name, roleId) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#userTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof curpage !== "undefined" && curpage !== "") {
		temp = parseIntDecimal(curpage);
	}
	var action = "UserAction_list.action";
	var query = false;
	if (typeof name !== "undefined" && name !== null && name !== "") {
		action = (action + "?name=" + name);
		query = true;
	}
	if (typeof roleId !== "undefined" && roleId !== null && roleId !== "") {
		if (!query) {
			action = (action + "?roleId=" + roleId);
		} else {
			action = (action + "&roleId=" + roleId);
		}
	}
	var pagination={currentPage:temp, pageRecords:10};
	$.myajax.jsonGet(action, doAjaxUserList, pagination);
}

function doCheckQuery() {
	return true;
}

function doAjaxUserList(json,action,success) {
	var empty = true;
	if (success) {
		if (!$.isEmptyObject(json.users)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.users, function (i, fn) {
				var row = $("#userTableTemplate").clone();
				fillRowUser(row, fn);
				row.find("#tdIndex").text(k);
				row.find("#selectUserIdList").val(fn.id);
				if (fn.userRole !== null) {
					row.find("#tdRole").html("<a href=\"javascript:viewRoleUser('" + fn.userRole.id + "');\">" + fn.userRole.name + "</a>");
					//row.find("#tdRole").text(fn.userRole.name);
				} else {
					row.find("#tdRole").text("");
				}
				row.find("#tdValidaty").text(dateTime2DateString(fn.userAccount.validity));
				var temp = "<a href=\"javascript:vehiclePermit('" + fn.id + "');\">" + parent.lang.usermgr_devPermit + "</a> "
					+ "<a href=\"javascript:editUserInfo('" + fn.id + "');\">" + parent.lang.edit + "</a> "
					+ "<a href=\"javascript:delUserInfo('" + fn.id + "');\">" + parent.lang.del + "</a>"
					+ "<a href=\"javascript:setUserPwd('" + fn.id + "');\">" + parent.lang.usermgr_user_editPwd + "</a>";
				row.find("#tdOperator").html(temp);
				row.attr("id", "tableTop_" + fn.id);
				if ( (i % 2) == 1) {
					row.attr("class", "tabdata bluebg");
				}
				row.show();
				row.appendTo("#userTable");
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#userPagination");
		json.pagination.id = "#userPagination";
		json.pagination.tableId = "#userTable";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxUserList);
	}
	$.myajax.showLoading(false);
}

function delUserInfo(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet("UserAction_delete.action?id=" + id, function(json,action,success){
		$.myajax.showLoading(false);
		var curpage = $("#hideCurrentPage").text();
		ajaxLoadUserInfo(curpage);
	}, null);
}

function fillRowUser(row, user) {
	row.find("#tdName").html("<a href=\"javascript:editUserInfo('" + user.id + "');\">" + user.userAccount.name + "</a>");
	row.find("#tdAccount").html("<a href=\"javascript:editUserInfo('" + user.id + "');\">" + user.userAccount.account + "</a>");
	row.find("#tdLinkman").text(user.linkMan);
	row.find("#tdTelephone").text(user.telephone);
	row.find("#tdEmail").text(user.email);
	row.find("#tdAddress").text(user.address);
	row.find("#tdUrl").text(user.url);
}

function editUserInfo(id) {
	$.dialog({id:'edituser', title:parent.lang.usermgr_user_edit,content:'url:user/user_info.html?id=' + id
		, min:false, max:false, lock:true});
}

function doEditUserSuc(idno, data, rolename) {
	$.dialog({id:'edituser'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//查找对应的行数据
	$("#userTable").find("tr").each(function(){
			if (this.id == ("tableTop_" + idno)) {
				$(this).find("#tdValidaty").text(data.userAccount.validity);
				$(this).find("#tdRole").html("<a href=\"javascript:viewRoleUser('" + data.roleId + "');\">" + rolename + "</a>");
				fillRowUser($(this), data);
			}
		}
	);	
}

function addUserInfo() {
	$.dialog({id:'adduser', title:parent.lang.usermgr_user_add,content:'url:user/user_info.html'
		, min:false, max:false, lock:true});
}

function doAddUserSuc() {
	$.dialog({id:'adduser'}).close();
	$.dialog.tips(parent.lang.addok, 1);
	ajaxLoadUserInfo(0);
}

function delSelUserInfo() {
	var users = getSelectItem("selectUserIdList");
	if (users.length <= 0) {
		alert(parent.lang.errSelectedRequired);
	} else {
		if(!confirm(parent.lang.delconfirm)) {
			return ;
		}
		
		//执行删除操作
		$.myajax.showLoading(true, parent.lang.deleting);
		$.myajax.jsonGet("UserAction_delete.action?id=" + users, function(json,action,success){
			$.myajax.showLoading(false);
			var curpage = $("#userPagination").find("#hideCurrentPage").text();
			ajaxLoadUserInfo(curpage);
		}, null);
	}
}

function queryUserInfo() {
	var name = $.trim($("#usersearch").val());
	if (name == parent.lang.usermgr_searchUser) {
		name = "";
	}
	ajaxLoadUserInfo(1, encodeURIComponent(name));
}

//查询某种类型的角色
function viewRoleUser(id) {
	ajaxLoadUserInfo(1, null, id);
}

//用户车辆许可信息
function vehiclePermit(id) {
	$.dialog({id:'vehiPermit', title:parent.lang.usermgr_devPermit,content:'url:user/user_vehi_permit.html?id=' + id
		, min:false, max:false, lock:true});
}

function doVehiclePermitSuc() {
	$.dialog({id:'vehiPermit'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

function setUserPwd(id) {
	$.dialog({id:'setPwd', title:parent.lang.usermgr_user_editPwd,content:'url:user/user_password.html?id=' + id
		, min:false, max:false, lock:true});
}

function doPasswordSuc() {
	$.dialog({id:'setPwd'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}