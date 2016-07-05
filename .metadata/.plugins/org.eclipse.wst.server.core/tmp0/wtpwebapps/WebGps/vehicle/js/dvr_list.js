$(document).ready(function(){
	setTimeout(loadDvrPage, 50);
});

function loadDvrPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadDvrPage, 50);
	} else {
		//加载语言
		loadDvrLang();
		setInputFocusBuleTip("#dvrsearch", parent.lang.vehicle_searchTerminal);
		//加载车辆信息
		ajaxLoadDvrInfo();
		$("#btnExport").click(exportExcel);
		$('#dvrsearch').on('keyup',function(e) {
			if(e.keyCode == 13) {
				queryDvrInfo();
			}
		});
	}
}

function loadDvrLang(){
	$("#dvrTitle").text(parent.lang.vehicle_navDvr);
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.vehicle_dvr_name);
	$("#thIdno").text(parent.lang.IDNO);
	$("#thChannel").text(parent.lang.channel);
	$("#thSimCard").text(parent.lang.vehicle_simcard);
	$("#thLinkman").text(parent.lang.vehicle_dvr_linkman);
	$("#thTele").text(parent.lang.vehicle_dvr_telephone);
	$("#thAddress").text(parent.lang.vehicle_dvr_address);
	$("#thRemarks").text(parent.lang.vehicle_dvr_remarks);
	$("#thOperator").text(parent.lang.operator);
	$("#btnSearchDvr").text(parent.lang.search);
	$("#spanBtnExport").text(parent.lang.exportExcel);
}

function ajaxLoadDvrInfo(curpage, name) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#dvrTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof curpage !== "undefined" && curpage !== "") {
		temp = parseIntDecimal(curpage);
	}
	var action = "DvrAction_list.action";
	var query = false;
	if (typeof name !== "undefined" && name !== null && name !== "") {
		action = (action + "?name=" + name);
		query = true;
	}
	var pagination={currentPage:temp, pageRecords:10};
	$.myajax.jsonGet(action, doAjaxDvrList, pagination);
}

function doCheckQuery() {
	return true;
}

function doAjaxDvrList(json,action,success) {
	var empty = true;
	if (success) {
		if (!$.isEmptyObject(json.dvrs)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.dvrs, function (i, fn) {
				var row = $("#dvrTableTemplate").clone();
				fillRowDvr(row, fn);
				row.find("#tdIndex").text(k);
				row.find("#tdIdno").html("<a href=\"javascript:editDvrInfo('" + fn.idno + "');\">" + fn.idno + "</a>");
				var operatorHtml = "<a href=\"javascript:editDvrInfo('" + fn.idno + "');\">" + parent.lang.edit + "</a>";
				if (json.userMgr) {
					operatorHtml = operatorHtml + "&nbsp;&nbsp;<a href=\"javascript:showPermit('" + fn.idno + "', '" + fn.userAccount.name + "');\">" + parent.lang.vehicle_show_permit + "</a>";
				}
				row.find("#tdOperator").html(operatorHtml);
				row.attr("id", "tableTop_" + fn.idno);
				if ( (i % 2) == 1) {
					row.attr("class", "tabdata bluebg");
				}
				row.show();
				row.appendTo("#dvrTable");
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#dvrPagination");
		json.pagination.id = "#dvrPagination";
		json.pagination.tableId = "#dvrTable";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxDvrList);
	}
	$.myajax.showLoading(false);
}

function fillRowDvr(row, vehicle) {
	row.find("#tdName").html("<a href=\"javascript:editDvrInfo('" + vehicle.idno + "');\">" + vehicle.userAccount.name + "</a>");
	row.find("#tdChannel").text(vehicle.chnCount);
	row.find("#tdSimCard").text(vehicle.simCard);
	row.find("#tdLinkman").text(vehicle.driverName);		
	row.find("#tdTele").text(vehicle.driverTele);
	row.find("#tdAddress").text(vehicle.userAddress);
	row.find("#tdRemarks").text(vehicle.remarks);
}

function editDvrInfo(idno) {
	$.dialog({id:'editdvr', title:parent.lang.vehicle_dvr_edit,content:'url:vehicle/dvr_info.html?idno=' + idno
		, min:false, max:false, lock:true});
}

function doEditDvrSuc(idno, data) {
	$.dialog({id:'editdvr'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//查找对应的行数据
	$("#dvrTable").find("tr").each(function(){
			if (this.id == ("tableTop_" + idno)) {
				fillRowDvr($(this), data);
			}
		}
	);	
}


function getQueryDvrName() {
	var name = $.trim($("#dvrsearch").val());
	if (name == parent.lang.vehicle_searchVehi) {
		name = "";
	}
	return encodeURIComponent(name);
}

function queryDvrInfo() {
	ajaxLoadDvrInfo(1, getQueryDvrName());
}

function exportExcel() {
	document.reportForm.action = "DvrAction_excel.action?name=" + getQueryDvrName();
	document.reportForm.submit(); 
}

function showPermit(idno, name) {
	$.dialog({id:'showPermit', title:name + "  -  " + parent.lang.vehicle_show_permit_title,content:'url:vehicle/show_permit.html?idno=' + idno
		, min:false, max:false, lock:true});
}
