function initClientHead() {
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.client_name);
	$("#thAccount").text(parent.lang.client_account);
	$("#thLinkMan").text(parent.lang.client_linkman);
	$("#thTelephone").text(parent.lang.client_telephone);
	$("#thEmail").text(parent.lang.client_email);
	$("#thUrl").text(parent.lang.client_url);
	$("#thOperator").text(parent.lang.operator);
}

function doCheckClientQuery() {
	return true;
}

var clientParentId;
function isClientViewPage() {
	if (typeof clientParentId != "undefined" && clientParentId !== "") {
		return true;
	} else {
		return false;
	}
}

function loadClientList(page, parentId, name) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#clientTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof page !== "undefined" && page !== "") {
		temp = parseIntDecimal(page);
	}
	var action = "SysClientAction_list.action";
	var hasQuery = false;
	if (typeof parentId !== "undefined" && parentId !== null && parentId !== "") {
		clientParentId = parentId;
		action += ("?parentId=" + parentId);
		hasQuery = true;
	}
	if (typeof name != "undefined" && name !== null && name !== "") {
		if (hasQuery) {
			action += ("&name=" + encodeURIComponent(name));
		} else {
			action += ("?name=" + encodeURIComponent(name));
		}
	}
	var pagination={currentPage:temp, pageRecords:10};
	$.myajax.jsonGet(action, doAjaxClientList, pagination);
}


function fillRowClient(row, client) {
	row.find("#selectIdList").val(client.id);
	if (isClientViewPage()) {
		row.find("#tdName").text(client.userAccount.name);
		row.find("#tdAccount").text(client.userAccount.account);	
	} else {
		row.find("#tdName").html("<a href=\"javascript:viewClientInfo(" + client.id + ");\">" + client.userAccount.name + "</a>");
		row.find("#tdAccount").html("<a href=\"javascript:viewClientInfo(" + client.id + ");\">" + client.userAccount.account + "</a>");
	}
//	row.find("#tdName").text(client.userAccount.name);
//	row.find("#tdAccount").text(client.userAccount.account);
	row.find("#tdLinkMan").text(client.linkMan);
	row.find("#tdTelephone").text(client.telephone);
	row.find("#tdEMail").text(client.email);
	row.find("#tdUrl").text(client.url);
}

function doAjaxClientList(json,action,success) {
	var empty = true;
	if (success) {
		if (json.clients != null && !$.isEmptyObject(json.clients)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.clients, function (i, fn) {
				var row = $("#clientTableTemplate").clone();
				fillRowClient(row, fn);
				row.find("#tdIndex").text(k);
				var temp = "";
				if (!isClientViewPage()) {
					temp = "<a href=\"javascript:viewClientInfo('" + fn.id + "');\">" + parent.lang.view + "</a>"
						+ "<a href=\"javascript:editClientInfo('" + fn.id + "');\">" + parent.lang.edit + "</a> ";
				}
				temp = temp + "<a href=\"javascript:delClientInfo('" + fn.id + "');\">" + parent.lang.del + "</a>";
				row.find("#tdOperator").html(temp);
				row.attr("id", "clientTable_" + fn.id);
				if ( (i % 2) == 1) {
					row.attr("class", "tabdata bluebg");
				}
				row.show();
				row.appendTo("#clientTable");
				k = k + 1;
			});
		} 
		//显示分页信息
		$.myajax.showPagination("#clientPagination");
		json.pagination.id = "#clientPagination";
		json.pagination.tableId = "#clientTable";
		$.myajax.initPagination(action, json.pagination, doCheckClientQuery, doAjaxClientList);
		//更新统计信息
		$("#clientCount").text(json.clientCount);
		$("#userCount").text(json.userCount);
	}
	$.myajax.showLoading(false);
	parent.resizeFrame();
}

function addClient() {
	$.dialog({id:'addclient', title:parent.lang.client_add,content:'url:clientinfo.html'
		, min:false, max:false, lock:true});
}

function doAddClientSuc() {
	$.dialog({id:'addclient'}).close();
	$.dialog.tips(parent.lang.addok, 1);
	loadClientList(0);
}

function editClientInfo(id) {
	$.dialog({id:'editclient', title:parent.lang.client_edit,content:'url:clientinfo.html?id=' + id
		, min:false, max:false, lock:true});
}

function delClientInfo(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet("SysClientAction_delete.action?id=" + id, function(json,action,success){
		$.myajax.showLoading(false);
		var curpage = $("#clientPagination").find("#hideCurrentPage").text();
		loadClientList(curpage, getUrlParameter("id"));
	}, null);
}

function viewClientInfo(id) {
	parent.localUrl("clientview.html?id=" + id);
}