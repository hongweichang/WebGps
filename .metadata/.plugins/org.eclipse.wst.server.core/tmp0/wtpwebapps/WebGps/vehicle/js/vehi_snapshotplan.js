$(document).ready(function(){
	setTimeout(loadDownPlanPage, 50);
});

var queryDevList = null;

function loadDownPlanPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadDownPlanPage, 50);
	} else {
		//加载语言
		loadVehiLang();
		setInputFocusBuleTip("#vehisearch", parent.lang.vehicle_searchTerminal);
		//加载车辆信息
		ajaxLoadSnapshotPlan();
		$('#vehisearch').on('keyup',function(e) {
			if(e.keyCode == 13) {
				querySnapshotPlan();
			}
		});
	}
}

function loadVehiLang(){
	$("#vehiTitle").text(parent.lang.vehicle_navSnapshotPlan);
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.vehiName);
	$("#thDay1").text(parent.lang.vehicle_downplan_day1);
	$("#thDay2").text(parent.lang.vehicle_downplan_day2);
	$("#thDay3").text(parent.lang.vehicle_downplan_day3);
	$("#thDay4").text(parent.lang.vehicle_downplan_day4);
	$("#thDay5").text(parent.lang.vehicle_downplan_day5);
	$("#thDay6").text(parent.lang.vehicle_downplan_day6);
	$("#thDay7").text(parent.lang.vehicle_downplan_day7);
	$("#thInterval").text(parent.lang.vehicle_snapshotplan_interval);
	$("#thOperator").text(parent.lang.operator);
	$("#btnSearchVehi").text(parent.lang.search);
	$("#btnSetupSnapshotPlan").text(parent.lang.vehicle_snapshotplan_setup);
	$("#spanTipStorage").text(parent.lang.vehicle_tipStorage);
	$("#btnDeleteSelectPlan").text(parent.lang.deleteSelect);
}

function ajaxLoadSnapshotPlan(curpage, name) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#vehiTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof curpage !== "undefined" && curpage !== "") {
		temp = parseIntDecimal(curpage);
	}
	var action = "SnapshotPlanAction_list.action";
	var pagination={currentPage:temp, pageRecords:10};
	var data = {};
	var devices = gpsGetVehicleQueryList(name);
	data.devIdnos = devices.toString();
	queryDevList = data;
	$.myajax.jsonGetEx(action, doAjaxSnapshotPlan, pagination, data);
}

function doCheckQuery() {
	return true;
}

function doAjaxSnapshotPlan(json,action,success) {
	var empty = true;
	if (success) {
		if (!$.isEmptyObject(json.plans)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.plans, function (i, fn) {
				var row = $("#vehiTableTemplate").clone();
				fillRowPlan(row, fn);
				row.find("#tdIndex").text(k);
				row.find("#tdName").html("<a href=\"javascript:editSnapshotPlan('" + fn.devIdno + "');\">" + gpsGetVehicleName(fn.devIdno)) + "</a>";
				var temp = "<a href=\"javascript:editSnapshotPlan('" + fn.devIdno + "');\">" + parent.lang.edit + "</a>" ;
				var delStr = "<a href=\"javascript:delSnapshotPlan('" + fn.devIdno + "');\">" + parent.lang.del + "</a>" ;
				row.find("#tdOperator").html(temp + delStr);
				row.find("#selectIdList").val(fn.devIdno);
				append2TableEx("#vehiTable", k, row, fn.devIdno);
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#vehiPagination");
		json.pagination.id = "#vehiPagination";
		json.pagination.tableId = "#vehiTable";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxSnapshotPlan, queryDevList);
	}
	$.myajax.showLoading(false);
}

function getDayInfo(day) {
	var temp = day.split(',');
	if (temp.length >= 2) {
//		return second2ShortHour(parseInt(temp[0])) + "-" + second2ShortHour(parseInt(temp[1]));
		return second2ShortHour(parseIntDecimal(temp[0])) + "-" + second2ShortHour(parseIntDecimal(temp[1])) + "," + second2ShortHour(parseIntDecimal(temp[2])) + "-" + second2ShortHour(parseIntDecimal(temp[3]));
	} else {
//		return "00:00-00:00";
		return "00:00-00:00,00:00-00:00";
	}
}

function fillRowPlan(row, plan) {
	row.find("#tdDay1").text(getDayInfo(plan.day1));
	row.find("#tdDay2").text(getDayInfo(plan.day2));
	row.find("#tdDay3").text(getDayInfo(plan.day3));		
	row.find("#tdDay4").text(getDayInfo(plan.day4));
	row.find("#tdDay5").text(getDayInfo(plan.day5));
	row.find("#tdDay6").text(getDayInfo(plan.day6));
	row.find("#tdDay7").text(getDayInfo(plan.day7));
}

function editSnapshotPlan(idno) {
	$.dialog({id:'editplan', title:parent.lang.vehicle_snapshotplan_edit + "  -  " + gpsGetVehicleName(idno), content:'url:vehicle/vehi_snapshotplan_setup.html?idno=' + idno
		, min:false, max:false, lock:true});
}

function doEditPlanSuc(idno, data) {
	$.dialog({id:'editplan'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//查找对应的行数据
	$("#vehiTable").find("tr").each(function(){
			if (this.id == ("tableTop_" + idno)) {
				fillRowPlan($(this), data);
			}
		}
	);	
}

function delSnapshotPlan(idno) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	
	//执行删除操作
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet("SnapshotPlanAction_delete.action?idno=" + idno, function(json,action,success){
		$.myajax.showLoading(false);
		var curpage = $("#vehiPagination").find("#hideCurrentPage").text();
		ajaxLoadSnapshotPlan(curpage);
	}, null);
}

function querySnapshotPlan() {
	var name = $.trim($("#vehisearch").val());
	if (name == parent.lang.vehicle_searchVehi) {
		name = "";
	}

	ajaxLoadSnapshotPlan(1, name);
}

function setupSnapshotPlan() {
	$.dialog({id:'setupplan', title:parent.lang.vehicle_snapshotplan_setup,content:'url:vehicle/vehi_snapshotplan_setup.html'
		, min:false, max:false, lock:true});
}

function doSetupPlanSuc() {
	$.dialog({id:'setupplan'}).close();
	ajaxLoadSnapshotPlan(1);
}

function deleteSelectPlan() {
	var plans = getSelectItem("selectIdList");
	if (plans.length <= 0) {
		alert(parent.lang.errSelectedRequired);
	} else {
		if(!confirm(parent.lang.delconfirm)) {
			return ;
		}
		
		//执行删除操作
		$.myajax.showLoading(true, parent.lang.deleting);
		$.myajax.jsonGet("SnapshotPlanAction_delete.action?idno=" + plans, function(json,action,success){
			$.myajax.showLoading(false);
			var curpage = $("#vehiPagination").find("#hideCurrentPage").text();
			ajaxLoadSnapshotPlan(curpage);
		}, null);
	}
}