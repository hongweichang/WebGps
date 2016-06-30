$(document).ready(function(){
	setTimeout(loadNetflowDailyPage, 50);
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

function loadNetflowDailyPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadNetflowDailyPage, 50);
	} else {
		//加载语言
		loadNetflowDailyLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryNetFlowDaily);
		$("#btnExport").click(exportNetFlowDaily);
		$("#btnExportCsv").click(exportNetFlowDailyCsv);
		$("#btnExportPdf").click(exportNetFlowDailyPdf);
		
		$("#netflowDailyTable").flexigrid({
			url: "ReportNetFlowAction_daily.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'dtimeStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_netflow_dayUsed, name : 'curDayUsed', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_netflow_dayLimit, name : 'dayLimit', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_netflow_monthUsed, name : 'curMonthUsed', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_netflow_monthLimit, name : 'monthLimit', width : 120, sortable : false, align: 'center'}
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
			title: parent.lang.report_navNetFlowDetail,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function loadNetflowDailyLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navNetFlowDetail);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryNetFlowDaily() {
	//判断时间
	var begindate = $("#begintime").val();
	var enddate = $("#endtime").val();
	if (!searchOpt.checkQueryDate(begindate, enddate)) {
		return ;
	}
	var deviceList = searchOpt.getQueryDevList();
	//判断设备
	if (deviceList.length <= 0) {
		alert(parent.lang.report_selectVehiNullErr);
		return ;
	}
	searchOpt.requireParam.devIdnos = deviceList.toString();
	var params = [];
	params.push({
		name: 'json',
		value: encodeURIComponent(JSON.stringify(searchOpt.requireParam))
	});
	params.push({
		name: 'begindate',
		value: begindate
	});
	params.push({
		name: 'enddate',
		value: enddate
	});
	$('#netflowDailyTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if(name == 'dtime'){
		pos = dateTime2TimeString(row[name]);
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
	document.reportForm.action = "ReportNetFlowAction_detailExcel.action?toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportNetFlowDaily() {
	exportReport(1);
}

function exportNetFlowDailyCsv() {
	exportReport(2);
}

function exportNetFlowDailyPdf() {
	exportReport(3);
}