$(document).ready(function(){
	setTimeout(loadVehiPage, 50);
});

function loadVehiPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadVehiPage, 50);
	} else {
		//加载语言
		loadVehiLang();
		setInputFocusBuleTip("#vehisearch", parent.lang.vehicle_searchVehi);
		//加载车辆信息
		ajaxLoadVehiInfo();
		$("#btnExport").click(exportExcel);
		$('#vehisearch').on('keyup',function(e) {
			if(e.keyCode == 13) {
				queryVehiInfo();
			}
		});
	}
}

function loadVehiLang(){
	$("#vehiTitle").text(parent.lang.vehicle_navVehicle);
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.vehiName);
	$("#thIdno").text(parent.lang.IDNO);
	$("#thChannel").text(parent.lang.channel);
	$("#thSimCard").text(parent.lang.vehicle_simcard);
	$("#thVehiCompany").text(parent.lang.vehicle_company);
	$("#thDriverName").text(parent.lang.vehicle_driverName);
	$("#thDriverTele").text(parent.lang.vehicle_driverTele);
	$("#thVehiBand").text(parent.lang.vehicle_vehiBand);
	$("#thVehiType").text(parent.lang.vehicle_vehiType);
	$("#thOperator").text(parent.lang.operator);
	$("#btnSearchVehi").text(parent.lang.search);
	$("#spanBtnExport").text(parent.lang.exportExcel);
}

function ajaxLoadVehiInfo(curpage, name) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#vehiTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof curpage !== "undefined" && curpage !== "") {
		temp = parseIntDecimal(curpage);
	}
	var action = "VehicleAction_list.action";
	var query = false;
	if (typeof name !== "undefined" && name !== null && name !== "") {
		action = (action + "?name=" + name);
		query = true;
	}
	var pagination={currentPage:temp, pageRecords:10};
	$.myajax.jsonGet(action, doAjaxVehiList, pagination);
}

function doCheckQuery() {
	return true;
}

function doAjaxVehiList(json,action,success) {
	var empty = true;
	if (success) {
		if (!$.isEmptyObject(json.vehicles)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.vehicles, function (i, fn) {
				var row = $("#vehiTableTemplate").clone();
				fillRowVehi(row, fn);
				row.find("#tdIndex").text(k);
				row.find("#tdIdno").html("<a href=\"javascript:editVehiInfo('" + fn.idno + "');\">" + fn.idno + "</a>");
				var htmlOperator = "<a href=\"javascript:editVehiInfo('" + fn.idno + "');\">" + parent.lang.edit + "</a>";
				htmlOperator += "&nbsp;&nbsp;<a href=\"javascript:copyVehiInfo('" + fn.idno + "', '" + fn.userAccount.name + "');\">" + parent.lang.vehicle_copy + "</a>";
				if (json.userMgr) {
					htmlOperator = htmlOperator + "&nbsp;&nbsp;<a href=\"javascript:showPermit('" + fn.idno + "', '" + fn.userAccount.name + "');\">" + parent.lang.vehicle_show_permit + "</a>";
				}
				row.find("#tdOperator").html(htmlOperator);
				row.attr("id", "tableTop_" + fn.idno);
				if ( (i % 2) == 1) {
					row.attr("class", "tabdata bluebg");
				}
				row.show();
				row.appendTo("#vehiTable");
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#vehiPagination");
		json.pagination.id = "#vehiPagination";
		json.pagination.tableId = "#vehiTable";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxVehiList);
	}
	$.myajax.showLoading(false);
}

function fillRowVehi(row, vehicle) {
	row.find("#tdName").html("<a href=\"javascript:editVehiInfo('" + vehicle.idno + "');\">" + vehicle.userAccount.name + "</a>");
	row.find("#tdChannel").text(vehicle.chnCount);
	row.find("#tdSimCard").text(vehicle.simCard);
	row.find("#tdVehiCompany").text(vehicle.vehiCompany);
	row.find("#tdDriverName").text(vehicle.driverName);		
	row.find("#tdDriverTele").text(vehicle.driverTele);
	row.find("#tdVehiBand").text(vehicle.vehiBand);
	row.find("#tdVehiType").text(vehicle.vehiType);
}

function editVehiInfo(idno) {
	$.dialog({id:'editvehi', title:parent.lang.vehicle_vehi_edit,content:'url:vehicle/vehi_info.html?idno=' + idno
		, min:false, max:false, lock:true});
}

function doEditVehiSuc(idno, data) {
	$.dialog({id:'editvehi'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//查找对应的行数据
	$("#vehiTable").find("tr").each(function(){
			if (this.id == ("tableTop_" + idno)) {
				fillRowVehi($(this), data);
			}
		}
	);
}

function copyVehiInfo(idno, name) {
	var title = parent.lang.vehicle_copy + "  " + name + "  " + parent.lang.vehicle_copy_title;
	$.dialog({id:'copyvehi', title:title,content:'url:vehicle/vehi_attri_copy.html?idno=' + idno
		, min:false, max:false, lock:true});
}

function doCopyVehiSuc() {
	$.dialog({id:'copyvehi'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	ajaxLoadVehiInfo();
}

function showPermit(idno, name) {
	$.dialog({id:'showPermit', title:name + "  -  " + parent.lang.vehicle_show_permit_title,content:'url:vehicle/show_permit.html?idno=' + idno
		, min:false, max:false, lock:true});
}

function getQueryVehiName() {
	var name = $.trim($("#vehisearch").val());
	if (name == parent.lang.vehicle_searchVehi) {
		name = "";
	}
	return encodeURIComponent(name);
}

function queryVehiInfo() {
	ajaxLoadVehiInfo(1, getQueryVehiName());
}

function exportExcel() {
	document.reportForm.action = "VehicleAction_excel.action?name=" + getQueryVehiName();
	document.reportForm.submit(); 
}

function restVehiBand(idno,name){
	if(idno != null) {
		ajaxLoadVehiInfo();
	}
}
function restVehiType(idno,name){
	if(idno != null) {
		ajaxLoadVehiInfo();
	}
}