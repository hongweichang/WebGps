$(document).ready(function(){
	setTimeout(loadRecordPlanPage, 50);
});

var queryDevList = null;

function loadRecordPlanPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadRecordPlanPage, 50);
	} else {
		//加载语言
		loadVehiLang();
		setInputFocusBuleTip("#vehisearch", parent.lang.vehicle_searchTerminal);
		//加载车辆信息
		ajaxLoadRecordPlan();
		$('#vehisearch').on('keyup',function(e) {
			if(e.keyCode == 13) {
				queryRecordPlan();
			}
		});
	}
}

function loadVehiLang(){
	$("#vehiTitle").text(parent.lang.vehicle_navRecordPlan);
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.vehiName);
	$("#thDay1").text(parent.lang.vehicle_downplan_day1);
	$("#thDay2").text(parent.lang.vehicle_downplan_day2);
	$("#thDay3").text(parent.lang.vehicle_downplan_day3);
	$("#thDay4").text(parent.lang.vehicle_downplan_day4);
	$("#thDay5").text(parent.lang.vehicle_downplan_day5);
	$("#thDay6").text(parent.lang.vehicle_downplan_day6);
	$("#thDay7").text(parent.lang.vehicle_downplan_day7);
//	$("#thMode").text(parent.lang.vehicle_recordplan_mode);
	$("#thOperator").text(parent.lang.operator);
	$("#btnSearchVehi").text(parent.lang.search);
	$("#btnSetupRecordPlan").text(parent.lang.vehicle_recordplan_setup);
	$("#btnDeleteSelectPlan").text(parent.lang.deleteSelect);
	$("#spanTipStorage").text(parent.lang.vehicle_tipStorage);
}

function ajaxLoadRecordPlan(curpage, name) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#vehiTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof curpage !== "undefined" && curpage !== "") {
		temp = parseIntDecimal(curpage);
	}
	var action = "RecordPlanAction_list.action";
	var pagination={currentPage:temp, pageRecords:10};
	var data = {};
	var devices = gpsGetVehicleQueryList(name);
	data.devIdnos = devices.toString();
	queryDevList = data;
	$.myajax.jsonGetEx(action, doAjaxRecordPlan, pagination, data);
}

function doCheckQuery() {
	return true;
}

function doAjaxRecordPlan(json,action,success) {
	if (success) {
		if (!$.isEmptyObject(json.plans)) {
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.plans, function (i, fn) {
				var row = $("#vehiTableTemplate").clone();
				fillRowPlan(row, fn);
				row.find("#tdIndex").text(k);
				row.find("#tdName").html("<a href=\"javascript:editRecordPlan('" + fn.devIdno + "');\">" + gpsGetVehicleName(fn.devIdno)) + "</a>";
				var temp = "<a href=\"javascript:editRecordPlan('" + fn.devIdno + "');\">" + parent.lang.edit + "</a>" ;
				var delStr = "<a href=\"javascript:delRecordPlan('" + fn.devIdno + "');\">" + parent.lang.del + "</a>" ;
				row.find("#tdOperator").html(temp + delStr);
				row.find("#selectIdList").val(fn.devIdno);
				append2TableEx("#vehiTable", k, row, fn.devIdno);
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#vehiPagination");
		json.pagination.id = "#vehiPagination";
		json.pagination.tableId = "#vehiTable";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxRecordPlan, queryDevList);
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
//	if (plan.mode == 1) {
//		row.find("#tdMode").text(parent.lang.vehicle_recordplan_modeNormal);
//	} else {
//		row.find("#tdMode").text(parent.lang.vehicle_recordplan_modeAlarm);
//	}
}

function editRecordPlan(idno) {
	$.dialog({id:'editplan', title:parent.lang.vehicle_recordplan_edit + "  -  " + gpsGetVehicleName(idno), content:'url:vehicle/vehi_recordplan_setup.html?idno=' + idno
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

function delRecordPlan(idno) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	
	//执行删除操作
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet("RecordPlanAction_delete.action?idno=" + idno, function(json,action,success){
		$.myajax.showLoading(false);
		var curpage = $("#vehiPagination").find("#hideCurrentPage").text();
		ajaxLoadRecordPlan(curpage);
	}, null);
}

function queryRecordPlan() {
	var name = $.trim($("#vehisearch").val());
	if (name == parent.lang.vehicle_searchVehi) {
		name = "";
	}

	ajaxLoadRecordPlan(1, name);
}

function setupRecordPlan() {
	$.dialog({id:'setupplan', title:parent.lang.vehicle_recordplan_setup,content:'url:vehicle/vehi_recordplan_setup.html'
		, min:false, max:false, lock:true});
}

function doSetupPlanSuc() {
	$.dialog({id:'setupplan'}).close();
	ajaxLoadRecordPlan(1);
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
		$.myajax.jsonGet("RecordPlanAction_delete.action?idno=" + plans, function(json,action,success){
			$.myajax.showLoading(false);
			var curpage = $("#vehiPagination").find("#hideCurrentPage").text();
			ajaxLoadRecordPlan(curpage);
		}, null);
	}
}