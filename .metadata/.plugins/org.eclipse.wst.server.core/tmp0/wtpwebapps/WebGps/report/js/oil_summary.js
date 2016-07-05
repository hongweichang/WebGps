$(document).ready(function(){
	setTimeout(loadLiChengSummaryPage, 50);
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

function loadLiChengSummaryPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadLiChengSummaryPage, 50);
	} else {
		//加载语言
		loadLiChengSummaryLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryLiChengSummary);
		$("#btnExport").click(exportLichengSummary);
		$("#btnExportCsv").click(exportLichengSummaryCsv);
		$("#btnExportPdf").click(exportLichengSummaryPdf);
		
		$("#lichengSummaryTable").flexigrid({
			url: "ReportOilAction_summary.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehicle_driverName, name : 'driverName', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.begintime, name : 'startTimeStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.endtime, name : 'endTimeStr', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_start_oil, name : 'startYouLiang', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_end_oil, name : 'endYouLiang', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_licheng_all, name : 'liCheng', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_oil_all, name : 'youLiang', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_time, name : 'workTime', width : 120, sortable : false, align: 'center'}
				],
//			sortname: "devIdno",
//			sortorder: "asc",
			pernumber: parent.lang.pernumber,
			pagestat: parent.lang.pagestatInfo,
			pagefrom: parent.lang.pagefrom,
			pagetext: parent.lang.page,
			pagetotal: parent.lang.pagetotal,
//					checkbox: true,
			findtext: parent.lang.find,
			procmsg: parent.lang.procmsg,
			nomsg : parent.lang.nomsg,
			usepager: true,
			autoload: false,
			title: parent.lang.report_oil_summary,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function loadLiChengSummaryLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_oil_summary);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryLiChengSummary() {
	var query = searchOpt.getQueryData(false);
	if (query === null) {
		return ;
	}
	searchOpt.requireParam.devIdnos = query.deviceList.toString();
	var params = [];
	params.push({
		name: 'json',
		value: encodeURIComponent(JSON.stringify(searchOpt.requireParam))
	});
	params.push({
		name: 'begintime',
		value: query.begindate
	});
	params.push({
		name: 'endtime',
		value: query.enddate
	});
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	$('#lichengSummaryTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if((name == 'startTime') || (name == 'endTime')){
		pos = dateTime2TimeString(row[name]);
	}else if(name == 'liCheng'){
		pos = gpsGetLiCheng(row[name]);
	}else if((name == 'startYouLiang') || (name == 'endYouLiang') || (name == 'youLiang')){
		pos = gpsGetYouLiang(row[name]);
	}else if(name == 'workTime'){
		pos = gpsFormatSecond2Time(row[name]);
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function exportReport(exportType) {
	var query = searchOpt.getQueryData(false);
	if (query === null) {
		return ;
	}
	$("#devIdnos").val(query.deviceList.toString());
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	setTimeout(function () {
		document.forms[0].action = "ReportOilAction_summaryExcel.action?toMap="+toMap+"&exportType="+exportType;
		document.forms[0].submit();
	}, 0);
}

function exportLichengSummary() {
	exportReport(1);
}

function exportLichengSummaryCsv() {
	exportReport(2);
}

function exportLichengSummaryPdf() {
	exportReport(3);
}