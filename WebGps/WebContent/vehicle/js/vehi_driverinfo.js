$(document).ready(function(){
	setTimeout(loadDriverInfoPage, 50);
});

function loadDriverInfoPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadDriverInfoPage, 50);
	} else {
		//加载语言
		loadVehiLang();
		setInputFocusBuleTip("#vehisearch", parent.lang.vehicle_driver_search);
		//加载司机信息
		ajaxLoadDriverInfo();
		$('#vehisearch').on('keyup',function(e) {
			if(e.keyCode == 13) {
				queryDriverInfo();
			}
		});
	}
}

function loadVehiLang(){
	$("#vehiTitle").text(parent.lang.vehicle_navDriver);
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.vehicle_driver_name);
	$("#thTelephone").text(parent.lang.vehicle_driver_telephone);
	$("#thCardNO").text(parent.lang.vehicle_driver_cardno);
	$("#thLicence").text(parent.lang.vehicle_driver_licence);
	$("#thOrgName").text(parent.lang.vehicle_driver_orgName);
	$("#thEffective").text(parent.lang.vehicle_driver_effective);
	$("#thExpiration").text(parent.lang.vehicle_driver_expiration);
	$("#thOperator").text(parent.lang.operator);
	$("#btnSearchDriver").text(parent.lang.search);
	$("#btnAddDriverInfo").text(parent.lang.add);
	$("#btnDeleteDriverInfo").text(parent.lang.deleteSelect);
}

function ajaxLoadDriverInfo(curpage, name) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#vehiTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof curpage !== "undefined" && curpage !== "") {
		temp = parseIntDecimal(curpage);
	}
	var action = "DriverInfoAction_list.action";
	if (typeof name !== "undefined" && name !== "") {
		action = action + "?name=" + name;
	}
	
	var pagination={currentPage:temp, pageRecords:10};
	$.myajax.jsonGetEx(action, doAjaxDriverInfo, pagination, null);
}

function doCheckQuery() {
	return true;
}

function doAjaxDriverInfo(json,action,success) {
	if (success) {
		if (!$.isEmptyObject(json.drivers)) {
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.drivers, function (i, fn) {
				var row = $("#vehiTableTemplate").clone();
				fillRowDriverInfo(row, fn);
				row.find("#tdIndex").text(k);
				row.find("#tdName").html("<a href=\"javascript:editDriverInfo('" + fn.id + "');\">" + fn.name + "</a>");
				var temp = "<a href=\"javascript:editDriverInfo('" + fn.id + "');\">" + parent.lang.edit + "</a>" ;
				var delStr = "<a href=\"javascript:delDriverInfo('" + fn.id + "');\">" + parent.lang.del + "</a>" ;
				row.find("#tdOperator").html(temp + delStr);
				row.find("#selectIdList").val(fn.id);
				append2TableEx("#vehiTable", k, row, fn.id);
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#vehiPagination");
		json.pagination.id = "#vehiPagination";
		json.pagination.tableId = "#vehiTable";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxDriverInfo, null);
	}
	$.myajax.showLoading(false);
}

function fillRowDriverInfo(row, driver) {
	row.find("#tdTelephone").text(driver.telephone);
	row.find("#tdCardNO").text(driver.cardNO);
	row.find("#tdLicence").text(driver.licence);
	row.find("#tdOrgName").text(driver.orgName);
	row.find("#tdEffective").text(dateTime2DateString(driver.effective));
	row.find("#tdExpiration").text(dateTime2DateString(driver.expiration));
}

function editDriverInfo(id) {
	$.dialog({id:'editdriver', title:parent.lang.vehicle_driver_edit, content:'url:vehicle/vehi_driver_edit.html?id=' + id
		, min:false, max:false, lock:true});
}

function doEditDriverSuc(id, data) {
	$.dialog({id:'editdriver'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//查找对应的行数据
	$("#vehiTable").find("tr").each(function(){
			if (this.id == ("tableTop_" + id)) {
				fillRowDriverInfo($(this), data);
			}
		}
	);	
}

function delDriverInfo(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	
	//执行删除操作
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet("DriverInfoAction_delete.action?id=" + id, function(json,action,success){
		$.myajax.showLoading(false);
		var curpage = $("#vehiPagination").find("#hideCurrentPage").text();
		ajaxLoadDriverInfo(curpage);
	}, null);
}

function queryDriverInfo() {
	var name = $.trim($("#vehisearch").val());
	if (name == parent.lang.vehicle_driver_search) {
		name = "";
	}

	ajaxLoadDriverInfo(1, name);
}

function addDriverInfo() {
	$.dialog({id:'adddriver', title: parent.lang.vehicle_driver_add, content:'url:vehicle/vehi_driver_edit.html'
		, min:false, max:false, lock:true});
}

function doAddDriverSuc() {
	$.dialog({id:'adddriver'}).close();
	ajaxLoadDriverInfo(1);
}

function deleteDriverInfo() {
	var plans = getSelectItem("selectIdList");
	if (plans.length <= 0) {
		alert(parent.lang.errSelectedRequired);
	} else {
		if(!confirm(parent.lang.delconfirm)) {
			return ;
		}
		
		//执行删除操作
		$.myajax.showLoading(true, parent.lang.deleting);
		$.myajax.jsonGet("DriverInfoAction_delete.action?id=" + plans, function(json,action,success){
			$.myajax.showLoading(false);
			var curpage = $("#vehiPagination").find("#hideCurrentPage").text();
			ajaxLoadDriverInfo(curpage);
		}, null);
	}
}