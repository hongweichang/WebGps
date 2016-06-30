$(document).ready(function(){
	setTimeout(loadPermit, 50);
});

function loadPermit() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadPermit, 50);
	} else {
		//加载语言
		loadPermitLang();
		//加载车辆信息
		ajaxLoadPermitInfo();
	}
}

function loadPermitLang(){
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.usermgr_name);
	$("#thAccount").text(parent.lang.usermgr_account);
	$("#thIdno").text(parent.lang.IDNO);
	$("#thOperator").text(parent.lang.operator);
	$("#spanRemove").text(parent.lang.deleteSelect);
}

function ajaxLoadPermitInfo(curpage) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#tableTop");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof curpage !== "undefined" && curpage !== "") {
		temp = parseIntDecimal(curpage);
	}
	var action = "VehicleAction_permit.action?idno=" + getUrlParameter("idno");
	var pagination={currentPage:temp, pageRecords:10};
	$.myajax.jsonGet(action, doAjaxPermitList, pagination);
}

function doCheckQuery() {
	return true;
}

function doAjaxPermitList(json,action,success) {
	var empty = true;
	if (success) {
		if (!$.isEmptyObject(json.permits)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.permits, function (i, fn) {
				var row = $("#userTableTemplate").clone();
				row.find("#tdIndex").text(k);
				row.find("#tdOperator").html("<a href=\"javascript:delPermit('" + fn.id + "');\">" + parent.lang.del + "</a>");				
				row.find("#tdName").text(fn.userAccount.name);
				row.find("#tdAccount").html(fn.userAccount.account);
				row.find("#selectDeviceIdList").val(fn.id);
				
				row.attr("id", "tableTop_" + fn.id);
				if ( (i % 2) == 1) {
					row.attr("class", "tabdata bluebg");
				}
				row.show();
				row.appendTo("#tableTop");
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#pagination");
		json.pagination.id = "#pagination";
		json.pagination.tableId = "#tableTop";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxPermitList);
	}
	$.myajax.showLoading(false);
}

function delPermit(id) {
	//执行删除操作
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet("VehicleAction_delPermit.action?id=" + id, function(json,action,success){
		$.myajax.showLoading(false);
		var curpage = $("#pagination").find("#hideCurrentPage").text();
		ajaxLoadPermitInfo(curpage);
	}, null);
}

function delSelPermit() {
	var ids = getSelectItem("selectDeviceIdList");
	if (ids.length <= 0) {
		alert(parent.lang.errSelectedRequired);
	} else {
		$.myajax.showLoading(true, parent.lang.adding);
		$.myajax.jsonGet("VehicleAction_delPermit.action?id=" + ids
		, function(json,action,success){
			$.myajax.showLoading(false);
			var curpage = $("#pagination").find("#hideCurrentPage").text();
			ajaxLoadPermitInfo(curpage);
		}, null);
	}
}