var api = frameElement.api, W = api.opener;
$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载关联数目
	loadRelationCount();
	//加载语言
	loadLang();
	if (isAddRelation()) {
		setInputFocusBuleTip("#devicesearch", parent.lang.home_searchDevice);
		ajaxRelFreeList();
	} else {
		setInputFocusBuleTip("#devicesearch", parent.lang.home_searchDevIdno);
		ajaxRelationList();
	}
	
	
}); 

function loadLang(){
	$("#labelStorageServer").text(parent.lang.server_labelStoServer);
	$("#labelRelationCount").text(parent.lang.server_labelStoRelationCount);
}

//function disableForm(disable) {
//	diableInput("#hrefRemove", disable, true);
//}

function isAddRelation() {
	var type = getUrlParameter("type");
	if (type !== null && type == "add") {
		return true;
	} else {
		return false;
	}
}

function queryRelationInfo() {
	var devName = $.trim($("#devicesearch").val());	
	if (isAddRelation()) {
		if (devName == parent.lang.home_searchDevice) {
			devName = "";
		}
		ajaxRelFreeList(1, devName);
	} else {
		if (devName == parent.lang.home_searchDevIdno) {
			devName = "";
		}
		ajaxRelationList(1, devName);
	}
}

function ajaxRelationList(page, devName) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#tableTop");
	var idno = getUrlParameter("idno");
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof page !== "undefined" && page !== "") {
		temp = parseIntDecimal(page);
	}
	var action = "StandardServerAction_storeRelList.action?idno=" + idno;
	if (typeof devName !== "undefined" && devName !== "") {
		action += ("&devName=" + encodeURIComponent(devName));
	}
	var pagination={currentPage:temp, pageRecords:10};
	$.myajax.jsonGet(action, doAjaxRelationList, pagination);
}

function doCheckQuery() {
	return true;
}

function fillRowRelation(row, relation) {
	row.find("#selectDeviceIdList").val(relation.devIdno);
	row.find("#tdName").text(relation.devInfo.userAccount.name);
	row.find("#tdIDNO").text(relation.devInfo.idno);
	if (relation.devInfo.devType == 1) {	//车载DVR
		row.find("#tdDevType").text(parent.lang.terminalVehicle);
	} else if (relation.devInfo.devType == 2) {					//手机终端
		row.find("#tdDevType").text(parent.lang.terminalMobile);
	} else {					//手机终端
		row.find("#tdDevType").text(parent.lang.terminalDvr);
	}
	if (typeof relation.devInfo.userInfo != "undefined" && relation.devInfo.userInfo !== null) {
//		row.find("#tdClient").html("<a href=\"javascript:viewClientInfo(" + fn.userInfo.id + ");\">" + fn.userInfo.userAccount.name + "</a>");
		row.find("#tdClient").text(relation.devInfo.userInfo.userAccount.name);
	} else {
		row.find("#tdClient").text("");
	}
}

function doAjaxRelationList(json,action,success) {
	disableForm(false);
	var empty = true;
	$.myajax.showLoading(false);
	if (success) {
		$("#spanStorageServer").text(json.svrName);
		$("#spanRelationCount").text(json.relCount);
		if (!$.isEmptyObject(json.relList)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.relList, function (i, fn) {
				var row = $("#tableTemplate").clone();
				
				fillRowRelation(row, fn);
				row.find("#tdIndex").text(k);

				var temp = "";
				if (isAddRelation()) {
					temp = temp + "<a href=\"javascript:addRelation('" + fn.devIdno + "');\">" + parent.lang.add + "</a>";
				} else {
					temp = temp + "<a href=\"javascript:delRelation('" + fn.devIdno + "');\">" + parent.lang.del + "</a>";
				}				
				row.find("#tdOperator").html(temp);
				
				append2TableEx("#tableTop", k, row, fn.devIdno);
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#pagination");
		json.pagination.id = "#pagination";
		json.pagination.tableId = "#tableTop";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxRelationList);
	} else {
		W.doStoRelationExit();
	}
}

function delRelation(idno) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet("StandardServerAction_storeRelDel.action?svrIdno=" + getUrlParameter("idno") + "&devIdno=" + idno, function(json,action,success){
		$.myajax.showLoading(false);
		var curpage = $("#pagination").find("#hideCurrentPage").text();
		ajaxRelationList(curpage);
	}, null);
}

function delSelRelation() {
	var devices = getSelectItem("selectDeviceIdList");
	if (devices.length <= 0) {
		alert(parent.lang.errSelectedRequired);
	} else {
		if (isAddRelation()) {
			$.myajax.showLoading(true, parent.lang.adding);
			$.myajax.jsonGet("StandardServerAction_storeRelAdd.action?svrIdno=" + getUrlParameter("idno") + "&devIdno=" + devices
			, function(json,action,success){
				$.myajax.showLoading(false);
				alert(parent.lang.addSuc);
				var curpage = $("#pagination").find("#hideCurrentPage").text();
				ajaxRelFreeList(curpage);
			}, null);
		} else {
			if(!confirm(parent.lang.delconfirm)) {
				return ;
			}
			//执行删除操作
			$.myajax.showLoading(true, parent.lang.deleting);
			$.myajax.jsonGet("StandardServerAction_storeRelDel.action?svrIdno=" + getUrlParameter("idno") + "&devIdno=" + devices
			, function(json,action,success){
				$.myajax.showLoading(false);
				var curpage = $("#pagination").find("#hideCurrentPage").text();
				ajaxRelationList(curpage);
			}, null);
		}
	}
}

function ajaxRelFreeList(page, devName) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#tableTop");
	var idno = getUrlParameter("idno");
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof page !== "undefined" && page !== "") {
		temp = parseIntDecimal(page);
	}
	var action = "StandardServerAction_storeRelFree.action?idno=" + idno;
	if (typeof devName !== "undefined" && devName !== "") {
		action += ("&devName=" + encodeURIComponent(devName));
	}
	var pagination={currentPage:temp, pageRecords:10};
	$.myajax.jsonGet(action, doAjaxRelationList, pagination);
}

function addRelation(idno) {	
	//显示的消息
	$.myajax.showLoading(true, parent.lang.adding);
	$.myajax.jsonGet("StandardServerAction_storeRelAdd.action?svrIdno=" + getUrlParameter("idno") + "&devIdno=" + idno, function(json,action,success){
		$.myajax.showLoading(false);
		if (success) {
			alert(parent.lang.addSuc);
			var curpage = $("#pagination").find("#hideCurrentPage").text();
			ajaxRelFreeList(curpage);
		}
	}, null);
}

//获取已关联的终端数目
function loadRelationCount() {
	$.myajax.jsonGet("StandardServerAction_standardGetRelationCount.action?idno=" + getUrlParameter("idno"), function(json,action,success){
		if (success) {
			$("#spanStorageServer").text(json.svrName);
			$("#spanRelationCount").text(json.relCount);
		}
	}, null);
}

