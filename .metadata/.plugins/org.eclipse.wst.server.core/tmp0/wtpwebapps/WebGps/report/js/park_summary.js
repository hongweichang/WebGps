$(document).ready(function(){
	setTimeout(loadParkSummaryPage, 50);
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

function loadParkSummaryPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadParkSummaryPage, 50);
	} else {
		//加载语言
		loadParkSummaryLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryParkSummary);
		$("#btnExport").click(exportParkSummary);
		$("#btnExportCsv").click(exportParkSummaryCsv);
		$("#btnExportPdf").click(exportParkSummaryPdf);
		var type = getUrlParameter("type");
		var title = parent.lang.report_navParkSummary;
		if (type !== "") {
			title = parent.lang.report_navParkAcconSummary;
		}
		$("#parkSummaryTable").flexigrid({
			url: "ReportParkAction_summary.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_beginTime, name : 'beginTimeStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_endTime, name : 'endTimeStr', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_park_count, name : 'count0', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_park_totalTime, name : 'param1Sum', width : 120, sortable : false, align: 'center'}
				],
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
			title: title,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function loadParkSummaryLang(){
	searchOpt.loadLang();
	var type = getUrlParameter("type");
	if (type !== "") {
		$("#reportTitle").text(parent.lang.report_navParkAcconSummary);
	} else {
		$("#reportTitle").text(parent.lang.report_navParkSummary);
	}
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryParkSummary() {
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
	var type = getUrlParameter("type");
	if (type !== "") {
		params.push({
			name: 'type',
			value: type
		});
	}
	$('#parkSummaryTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if((name == 'beginTime') || (name == 'endTime')){
		pos = dateTime2TimeString(row[name]);
	}else if(name == 'count'+index) {
		var counts = row['counts'];
		pos = counts[index];
	}else if(name == 'time') {
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
	var action = "ReportParkAction_summaryExcel.action?toMap="+toMap+"&exportType="+exportType;
	var type = getUrlParameter("type");
	if (type !== "") {
		action = action + "&type=" + type;
	}
	
	document.reportForm.action = action;
	document.reportForm.submit();
}

function exportParkSummary() {
	exportReport(1);
}

function exportParkSummaryCsv() {
	exportReport(2);
}

function exportParkSummaryPdf() {
	exportReport(3);
}