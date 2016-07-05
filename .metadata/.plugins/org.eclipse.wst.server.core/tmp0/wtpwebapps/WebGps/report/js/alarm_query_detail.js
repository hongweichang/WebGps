$(document).ready(function(){
	if(parent.lang_local == "en" || parent.lang_local == "" || parent.lang_local == null) {
		$(".devicetable").css("width","1700px");
	}
	setTimeout(loadAlarmDetailPage, 50);
});

var searchOpt = new searchOption(false, true);
var alarmSourceList = new Array();
var alarmTypeList = new Array();
var handleConditionList = new Array();

$(function() {
	$('.editable-select').editableSelect(
	{
		bg_iframe: true,
		onSelect: function(list_item) {
				
			},
		items_then_scroll: 10
		}
	);	
	searchOpt.initDeviceQuery();
	
	$('.alarmSourceList').editableSelect(
	{
		bg_iframe: true,
		onSelect: function(list_item) {
				
			},
		items_then_scroll: 10
		}
	);	
	
	$('.alarmTypeList').editableSelect(
	{
		bg_iframe: true,
		onSelect: function(list_item) {
				
			},
		items_then_scroll: 10
		}
	);
	
	$('.handleConditionList').editableSelect(
	{
		bg_iframe: true,
		onSelect: function(list_item) {
				
			},
		items_then_scroll: 10
		}
	);
	
	
	var m = new Map();
	m.put("id","0");
	m.put("name","所有");
	alarmSourceList[0] = m;
	
	m = new Map();
	m.put("id","1");
	m.put("name","平台");
	alarmSourceList[1] = m;
	
	m = new Map();
	m.put("id","2");
	m.put("name","终端");
	alarmSourceList[2] = m;
	
	initVehicleQuery(alarmSourceList,"alarmSourceList");
	
//	arr.splice(0, arr.length);
	
	m = new Map();
	m.put("id","0");
	m.put("name","所有");
	alarmTypeList[0] = m;
	initVehicleQuery(alarmTypeList,"alarmTypeList");
	
//	arr.splice(0, arr.length);
	
	m = new Map();
	m.put("id","0");
	m.put("name","所有");
	handleConditionList[0] = m;
	
	m = new Map();
	m.put("id","1");
	m.put("name","已处理");
	handleConditionList[1] = m;
	
	m = new Map();
	m.put("id","2");
	m.put("name","未处理");
	handleConditionList[2] = m;
	initVehicleQuery(handleConditionList,"handleConditionList");
}); 

function loadAlarmDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadAlarmDetailPage, 50);
	} else {
		//加载语言
		loadAlarmDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryAlarmDetail);
		$("#btnExport").click(exportAlarmDetail);
		$("#btnExportCsv").click(exportAlarmDetailPdf);
		$("#btnExportCsv").click(exportAlarmDetailPdf);
	}
}

function loadAlarmDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navAlarmQuery);
//	$("#report_company").append(parent.lang.report_company);
//	$("#report_car").append(parent.lang.report_car);
	$("#alarmSource").text(parent.lang.vehicle_alarmSource);
	$("#vehicleColor").text(parent.lang.vehicle_vehiColor);
	$("#alarmType").text(parent.lang.vehicle_alarmaction_alarmType);
	$("#handleCondition").text(parent.lang.vehicle_handleCondition);
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.vehiName);
//	$("#thDate").text(parent.lang.report_date);
	$("#thPosition").text(parent.lang.report_positionCurrent);
	$("#thType").text(parent.lang.report_ioinType);
	
	$("#thPlateColor").text(parent.lang.vehicle_plateColor);
	$("#thVehiColor").text(parent.lang.vehicle_vehiColor);
	$("#thAlarmSource").text(parent.lang.vehicle_alarmSource);
	$("#thBgDate").text(parent.lang.report_fence_parkBeginTime);
	$("#thEdDate").text(parent.lang.report_fence_parkEndTime);
	$("#thViolationLength").text(parent.lang.vehicle_violationlLength);
	$("#thMinSpeed").text(parent.lang.vehicle_mapfence_speedLow);
	$("#thAvgSpeed").text(parent.lang.vehicle_avgSpeed);
	$("#thMaxSpeed").text(parent.lang.vehicle_mapfence_speedHigh);
	$("#thLongitude").text(parent.lang.vehicle_longitude);
	$("#thLatitude").text(parent.lang.vehicle_latitude);
}


function vehicleSelect(id) {
	var select = $('.'+id+':first');
	var instances = select.editableSelectInstances();
	return instances[0];
};

function initVehicleQuery(arr,id) {
	if (parent.isLoadVehiList) {
		fillVehicleList(arr,id);
	} else {
		setTimeout(initVehicleQuery(arr,id), 100);
	}
};

function fillVehicleList(arr,id) {
	var sel = vehicleSelect(id);
	if (arr !== null && arr.length > 0) {
		var j = 1;
		for (var i = 0; i < arr.length && j < 100; i += 1) {
			vehicle = arr[i];
			if(i==0) {
				sel.addOption(vehicle.get("id"), vehicle.get("name"), true);
			} else {
				sel.addOption(vehicle.get("id"), vehicle.get("name"), false);
			}
			++ j;
		}
	} else {
		sel.addOption("", parent.lang.alarm_tip_select, true);
	}
};



function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryAlarmDetail() {
	var query = searchOpt.getQueryData(false);
	if (query === null) {
		return ;
	}
	
	disableForm(true);
	//清除之前加载的数据
	$.myajax.cleanTableContent("#alarmDetailTable");
	//显示加载过程
	$.myajax.showLoading(true);
	searchOpt.requireParam.devIdnos = query.deviceList.toString();     
	searchOpt.requireParam.sourceIdno = getAlarmQueryData(alarmSourceList,"alarmSourceList").toString();
	searchOpt.requireParam.typeIdno = getAlarmQueryData(alarmTypeList,"alarmTypeList").toString();
	searchOpt.requireParam.condiIdno = getAlarmQueryData(handleConditionList,"handleConditionList").toString();
	searchOpt.requireParam.vehiColor = $.trim($("#vehicleColorName").val());		
	//向服务器发送ajax请求
	var action = "ReportAlarmAction_accDetail.action?begintime=" + query.begindate + "&endtime=" + query.enddate;
	var pagination={currentPage:1, pageRecords:10};
	$.myajax.jsonGetEx(action, doAjaxAlarmDetail, pagination, searchOpt.requireParam);
}

function doCheckQuery() {
	return true;
}

function doAjaxAlarmDetail(json,action,success) {
	var empty = true;
	var arr = [];
	if (success) {
		if (!$.isEmptyObject(json.alarms)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.alarms, function (i, fn) {
				var map ={};
				var row = $("#alarmDetailTableTemplate").clone();
				row.find("#tdIndex").text(k);
				var vehiName = gpsGetVehicleName(fn.devIdno);
				row.find("#tdName").text(vehiName);
				row.find("#tdDate").text(dateTime2TimeString(fn.armTime));
				var alarm;
				if (fn.armType == 16) {
					alarm = parent.lang.report_alarm_accon;
				} else {
					alarm = parent.lang.report_alarm_accoff;
				}
				row.find("#tdType").text(alarm);
//				fillPosition(row, vehiName, fn.jingDu, fn.weiDu, fn.status1);
				fillPositionExDx(row, vehiName, fn.jingDu, fn.weiDu, fn.status1, "#tdPosition","beginPos"+i);
				map.startJingDu = gpsGetJingWeiDu(fn.jingDu);
				map.startWeiDu = gpsGetJingWeiDu(fn.weiDu);
				arr[i] = map;
//				row.find("#tdPosition").text(gpsGetJingWeiDu(fn.jingDu) + "," + gpsGetJingWeiDu(fn.weiDu));
				append2Table("#alarmDetailTable", k, row);
				k = k + 1;
			});
			fillPositionAddress(0,arr,"#alarmDetailTable","start");
		} 
		$.myajax.showPagination("#alarmDetailPagination");
		json.pagination.id = "#alarmDetailPagination";
		json.pagination.tableId = "#alarmDetailTable";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxAlarmDetail, searchOpt.requireParam);
	}
	disableForm(false);
	$.myajax.showLoading(false);
}

function exportAlarmDetail() {
	var query = searchOpt.getQueryData(false);
	if (query === null) {
		return ;
	}
	
	$("#devIdnos").val(query.deviceList.toString());
	document.reportForm.action = "ReportAlarmAction_detailExcel.action?type=acc&exportType=1";
	document.reportForm.submit(); 
}

function exportAlarmDetailCsv() {
	var query = searchOpt.getQueryData(false);
	if (query === null) {
		return ;
	}
	
	$("#devIdnos").val(query.deviceList.toString());
	document.reportForm.action = "ReportAlarmAction_detailExcel.action?type=acc&exportType=2";
	document.reportForm.submit(); 
}

function exportAlarmDetailPdf() {
	var query = searchOpt.getQueryData(false);
	if (query === null) {
		return ;
	}
	
	$("#devIdnos").val(query.deviceList.toString());
	document.reportForm.action = "ReportAlarmAction_detailExcel.action?type=acc&exportType=3";
	document.reportForm.submit(); 
}

function getAlarmQueryData(arr,id){
	var select = this.vehicleSelect(id);
	var name = $.trim(select.text.val());
	var data = null;
	for (var i = 0; i < arr.length; i += 1) {
		if(arr[i].get("name") == name) {
			data = arr[i].get("id")==null?"":arr[i].get("id");
			break;
		}
	}
	return data;
}