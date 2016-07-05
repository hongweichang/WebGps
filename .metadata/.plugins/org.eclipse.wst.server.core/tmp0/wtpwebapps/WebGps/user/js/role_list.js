$(document).ready(function(){
	setTimeout(loadRolePage, 50);
});

function loadRolePage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadRolePage, 50);
	} else {
		//加载语言
		loadRoleLang();
		setInputFocusBuleTip("#rolesearch", parent.lang.usermgr_searchRole);
		//加载用色信息
		ajaxLoadRoleInfo();
	}
}

function loadRoleLang(){
	$("#roleTitle").text(parent.lang.usermgr_navRole);
	$("#addRole").text(parent.lang.add);
	$("#delSelRole").text(parent.lang.del);
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.usermgr_role);
	$("#thRemarks").text(parent.lang.remarks);
	$("#thOperator").text(parent.lang.operator);
	$("#btnSearchRole").text(parent.lang.search);
}

function ajaxLoadRoleInfo(curpage, name) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#roleTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof curpage !== "undefined" && curpage !== "") {
		temp = parseIntDecimal(curpage);
	}
	var action = "RoleAction_list.action";
	if (typeof name !== "undefined" && name !== null && name !== "") {
		action = (action + "?name=" + name);
	}
	var pagination={currentPage:temp, pageRecords:10};
	$.myajax.jsonGet(action, doAjaxRoleList, pagination);
}

function doCheckQuery() {
	return true;
}

function doAjaxRoleList(json,action,success) {
	var empty = true;
	if (success) {
		if (!$.isEmptyObject(json.roles)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.roles, function (i, fn) {
				var row = $("#roleTableTemplate").clone();
				fillRowRole(row, fn);
				row.find("#tdIndex").text(k);
				row.find("#selectRoleIdList").val(fn.id);
				var temp = "<a href=\"javascript:editRoleInfo('" + fn.id + "');\">" + parent.lang.edit + "</a> "
					 + "<a href=\"javascript:delRoleInfo('" + fn.id + "');\">" + parent.lang.del + "</a>";
				row.find("#tdOperator").html(temp);
				row.attr("id", "tableTop_" + fn.id);
				if ( (i % 2) == 1) {
					row.attr("class", "tabdata bluebg");
				}
				row.show();
				row.appendTo("#roleTable");
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#rolePagination");
		json.pagination.id = "#rolePagination";
		json.pagination.tableId = "#roleTable";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxRoleList);
	}
	$.myajax.showLoading(false);
}

function delRoleInfo(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet("RoleAction_delete.action?id=" + id, function(json,action,success){
		$.myajax.showLoading(false);
		var curpage = $("#hideCurrentPage").text();
		ajaxLoadRoleInfo(curpage);
	}, null);
}

function fillRowRole(row, role) {
	row.find("#tdName").html("<a href=\"javascript:editRoleInfo('" + role.id + "');\">" + role.name + "</a>");
	row.find("#tdRemarks").text(role.remarks);
}

function editRoleInfo(id) {
	$.dialog({id:'editrole', title:parent.lang.usermgr_role_edit,content:'url:user/role_info.html?id=' + id
		, min:false, max:false, lock:true});
}

function doEditRoleExit() {
	$.dialog({id:'editrole'}).close();
}

function doEditRoleSuc(id, data) {
	$.dialog({id:'editrole'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//查找对应的行数据
	$("#roleTable").find("tr").each(function(){
			if (this.id == ("tableTop_" + id)) {
				fillRowRole($(this), data);
			}
		}
	);	
}

function doAddRoleExit() {
	$.dialog({id:'addrole'}).close();
}

function addRoleInfo() {
	$.dialog({id:'addrole', title:parent.lang.usermgr_role_add,content:'url:user/role_info.html'
		, min:false, max:false, lock:true});
}

function doAddRoleSuc() {
	$.dialog({id:'addrole'}).close();
	$.dialog.tips(parent.lang.addok, 1);
	ajaxLoadRoleInfo(0);
}

function delSelRoleInfo() {
	var roles = getSelectItem("selectRoleIdList");
	if (roles.length <= 0) {
		alert(parent.lang.errSelectedRequired);
	} else {
		if(!confirm(parent.lang.delconfirm)) {
			return ;
		}
		
		//执行删除操作
		$.myajax.showLoading(true, parent.lang.deleting);
		$.myajax.jsonGet("RoleAction_delete.action?id=" + roles, function(json,action,success){
			$.myajax.showLoading(false);
			var curpage = $("#rolePagination").find("#hideCurrentPage").text();
			ajaxLoadRoleInfo(curpage);
		}, null);
	}
}

function queryRoleInfo() {
	var name = $.trim($("#rolesearch").val());
	if (name == parent.lang.usermgr_searchRole) {
		name = "";
	}
	ajaxLoadRoleInfo(1, encodeURIComponent(name));
}