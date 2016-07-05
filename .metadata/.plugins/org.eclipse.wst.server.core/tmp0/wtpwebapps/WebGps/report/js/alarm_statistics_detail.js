$(document).ready(function(){
	if(parent.lang_local == "en" || parent.lang_local == "" || parent.lang_local == null) {
		$(".devicetable").css("width","12000px");
	}
	setTimeout(loadAlarmSummaryPage, 50);
});

var searchOpt = new searchOption(false, true);

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
}); 

function loadAlarmSummaryPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadAlarmSummaryPage, 50);
	} else {
		//加载语言
		loadAlarmSummaryLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryAlarmSummary);
		$("#btnExport").click(exportAlarmSummary);
		$("#btnExportCsv").click(exportAlarmSummaryCsv);
		$("#btnExportPdf").click(exportAlarmSummaryPdf);
	}
}

function loadAlarmSummaryLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navAlarmSummary);
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.vehiName);
	$("#thPlateColor").text(parent.lang.vehicle_plateColor);
	$("#thVehiColor").text(parent.lang.vehicle_vehiColor);
	$("#thCustomAlert").text(parent.lang.report_custom_alert+"/"+parent.lang.report_handled);
	$("#thEmergencyAlarm").text(parent.lang.report_emergency_alarm+"/"+parent.lang.report_handled);
	$("#thFatigueDriving").text(parent.lang.report_alarm_fatigue+"/"+parent.lang.report_handled);
	$("#thMainPowerDisconnect").text(parent.lang.report_main_power_disconnect+"/"+parent.lang.report_handled);
	$("#thPulloutTimeout").text(parent.lang.report_main_power_disconnect+"/"+parent.lang.report_handled);
	$("#thTimeoutParking").text(parent.lang.report_timeout_parking+"/"+parent.lang.report_handled);
	
	$("#thSectionSpeeding").text(parent.lang.report_section_speeding+"/"+parent.lang.report_handled);
	$("#thAntennaShortCircuit").text(parent.lang.repor_antenna_short_circuit+"/"+parent.lang.report_handled);
	$("#thCollisionRollover").text(parent.lang.report_collision_rollover+"/"+parent.lang.report_handled);
	$("#thIllegalMove").text(parent.lang.report_Illegal_move+"/"+parent.lang.report_handled);
	$("#thTerminalStolen").text(parent.lang.report_terminal_stolen+"/"+parent.lang.report_handled);
	$("#thWarning").text(parent.lang.report_warning+"/"+parent.lang.report_handled);
	$("#thGNSSModuleFailure").text(parent.lang.report_GNSS_module_failure+"/"+parent.lang.report_handled);
	$("#thGNSSAntennaMissedOrcut").text(parent.lang.report_GNSS_antenna_missedOrcut+"/"+parent.lang.report_handled);
	$("#thGNSSAntennaShortCircuit").text(parent.lang.repor_GNSS_antenna_short_circuit+"/"+parent.lang.report_handled);
	$("#thLCDOrDisplayFailure").text(parent.lang.report_LCDOrdisplay_failure+"/"+parent.lang.report_handled);
	$("#thTTSModuleFailure").text(parent.lang.report_TTS_module_failure+"/"+parent.lang.report_handled);
	$("#thCameraMalfunction").text(parent.lang.report_Camera_malfunction+"/"+parent.lang.report_handled);
	$("#thAccumulatedDayDrivingTimeout").text(parent.lang.report_accumulatedDay_driving_timeout+"/"+parent.lang.report_handled);
	$("#thCumulativeDrivingTimeout").text(parent.lang.report_cumulative_driving_timeout+"/"+parent.lang.report_handled);
	$("#thTerminalRegion").text(parent.lang.report_terminal_region+"/"+parent.lang.report_handled);
	$("#thAccessRoutes").text(parent.lang.report_access_routes+"/"+parent.lang.report_handled);
	$("#thVSSVehicleMalfunction").text(parent.lang.report_VSS_vehicle_malfunction+"/"+parent.lang.report_handled);
	$("#thVehicleFuelAbnormal").text(parent.lang.report_vehicle_fuel_abnormal+"/"+parent.lang.report_handled);
	$("#thIllegalVehicleIgnition").text(parent.lang.report_Illegal_vehicle_ignition+"/"+parent.lang.report_handled);
	$("#thIllegalVehicleDisplacement").text(parent.lang.report_Illegal_vehicle_displacement+"/"+parent.lang.report_handled);
	$("#thTerminalOverspeed").text(parent.lang.report_terminal_overspeed+"/"+parent.lang.report_handled);
	$("#thTerminalOffRoute").text(parent.lang.report_terminal_Off_route+"/"+parent.lang.report_handled);
	$("#thTimeout").text(parent.lang.report_timeout+"/"+parent.lang.report_handled);
	$("#thNonWorkingTime").text(parent.lang.report_non_working_time+"/"+parent.lang.report_handled);
	$("#thPlatformIntoArea").text(parent.lang.report_platform_into_area+"/"+parent.lang.report_handled);
	$("#thPlatformOffRoute").text(parent.lang.report_platform_Off_route+"/"+parent.lang.report_handled);
	$("#thPlatformOverspeed").text(parent.lang.report_platform_overspeed+"/"+parent.lang.report_handled);
	$("#thPointsNotArrive").text(parent.lang.report_line_key_points_not_arrive+"/"+parent.lang.report_handled);
	$("#thMainPowerUndervoltage").text(parent.lang.report_main_power_undervoltage+"/"+parent.lang.report_handled);
	$("#thStopTimeout").text(parent.lang.report_stop_timeout+"/"+parent.lang.report_handled);
	$("#thRegionalSpeeding").text(parent.lang.report_regional_speeding+"/"+parent.lang.report_handled);
	$("#thOutOfArea").text(parent.lang.report_out_of_area+"/"+parent.lang.report_handled);
	$("#thPointsNotLeave").text(parent.lang.report_line_key_points_not_leave+"/"+parent.lang.report_handled);
	$("#thAntennaOpen").text(parent.lang.report_antenna_open+"/"+parent.lang.report_handled);
	$("#thAntiTheftDevice").text(parent.lang.report_anti_theft_device+"/"+parent.lang.report_handled);
	
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryAlarmSummary() {
	var query = searchOpt.getQueryData(false);
	if (query === null) {
		return ;
	}
	
	disableForm(true);
	//清除之前加载的数据
	$.myajax.cleanTableContent("#statDetailTable");
	//显示加载过程
	$.myajax.showLoading(true);
	searchOpt.requireParam.devIdnos = query.deviceList.toString();
	//向服务器发送ajax请求
	var action = "ReportAlarmAction_summary.action?begintime=" + query.begindate + "&endtime=" + query.enddate;
	var pagination={currentPage:1, pageRecords:10};
	$.myajax.jsonGetEx(action, doAjaxAlarmSummary, pagination, searchOpt.requireParam);
}

function doCheckQuery() {
	return true;
}

function doAjaxAlarmSummary(json,action,success) {
	var empty = true;
	if (success) {
		if (!$.isEmptyObject(json.summarys)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.summarys, function (i, fn) {
				var row = $("#statDetailTableTemplate").clone();
				row.find("#tdIndex").text(k);
				row.find("#tdName").text(gpsGetVehicleName(fn.devIdno));
				if (fn.beginTime !== null) {
					row.find("#tdBeginTime").text(dateTime2TimeString(fn.beginTime));
					row.find("#tdEndTime").text(dateTime2TimeString(fn.endTime));
					row.find("#tdGpsSinnalCount").text(fn.counts[0]);
					row.find("#tdUrgencyButtonCount").text(fn.counts[1]);
					row.find("#tdDoorOpenCount").text(fn.counts[2]);
					row.find("#tdDiskErrorCount").text(fn.counts[3]);
					row.find("#tdMotionCount").text(fn.counts[4]);
					row.find("#tdShakeCount").text(fn.counts[5]);
				}
				append2Table("#alarmSummaryTable", k, row);
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#statDetailPagination");
		json.pagination.id = "#statDetailPagination";
		json.pagination.tableId = "#statDetailTable";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxAlarmSummary, searchOpt.requireParam);
	}
	disableForm(false);
	$.myajax.showLoading(false);
}

function exportAlarmSummary() {
	var query = searchOpt.getQueryData(false);
	if (query === null) {
		return ;
	}
	
	$("#devIdnos").val(query.deviceList.toString());
	document.reportForm.action = "ReportAlarmAction_summaryExcel.action?exportType=1";
	document.reportForm.submit(); 
}

function exportAlarmSummaryCsv() {
	var query = searchOpt.getQueryData(false);
	if (query === null) {
		return ;
	}
	
	$("#devIdnos").val(query.deviceList.toString());
	document.reportForm.action = "ReportAlarmAction_summaryExcel.action?exportType=2";
	document.reportForm.submit(); 
}

function exportAlarmSummaryPdf() {
	var query = searchOpt.getQueryData(false);
	if (query === null) {
		return ;
	}
	
	$("#devIdnos").val(query.deviceList.toString());
	document.reportForm.action = "ReportAlarmAction_summaryExcel.action?exportType=3";
	document.reportForm.submit(); 
}