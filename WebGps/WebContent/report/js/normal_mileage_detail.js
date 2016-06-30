$(document).ready(function(){
	if(parent.lang_local == "en" || parent.lang_local == "" || parent.lang_local == null) {
		$(".devicetable").css("width","1500px");
	}
	setTimeout(loadAlarmSummaryPage, 50);
});

var searchOpt = new searchOption(false, false);

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
	$("#reportTitle").text(parent.lang.report_oil_mileage_daily);
	$("#labelDaily").text(parent.lang.report_daily_report);
	$("#labelMonthly").text(parent.lang.report_monthly_report);
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.vehiName);
	$("#thPlateColor").text(parent.lang.vehicle_plateColor);
	$("#thVehiColor").text(parent.lang.vehicle_vehiColor);
	$("#thStatisticalDate").text(parent.lang.report_statistical_date);
	$("#thStatisticalMileage").text(parent.lang.report_statistical_mileage);
	$("#thGPSMileage").text(parent.lang.report_GPS_mileage);
	$("#thStandardOil").text(parent.lang.report_standard_oil_consumption);
	$("#thTotalOil").text(parent.lang.report_total_oil_consumption);
	$("#thOilCost").text(parent.lang.report_oil_cost);
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
	$.myajax.cleanTableContent("#milDetailTable");
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
				var row = $("#milDetailTableTemplate").clone();
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
				append2Table("#milDetailTable", k, row);
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#milDetailPagination");
		json.pagination.id = "#milDetailPagination";
		json.pagination.tableId = "#milDetailTable";
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

function checkType(type){
	if("daily" == type) {
		$("#reportTitle").text(parent.lang.report_oil_mileage_daily);
		searchOpt = new searchOption(false, false,false,false);
		searchOpt.initSearchTimeOption();
		$dp.dateFmt = "yyyy-MM-dd";
		$dp.maxDate = "%y-{%M}-%d";
		
	}else if("monthly" == type) {
		$("#reportTitle").text(parent.lang.report_oil_mileage_monthly);
		searchOpt = new searchOption(false, false,false,true);
		searchOpt.initSearchTimeOption();
		$dp.dateFmt = "yyyy-MM";
		$dp.maxDate = "%y-{%M}";
	}
	$("#reportType").val(type);
	
}