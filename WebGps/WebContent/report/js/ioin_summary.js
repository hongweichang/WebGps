$(document).ready(function(){
	setTimeout(loadIoinSummaryPage, 50);
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

function loadIoinSummaryPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadIoinSummaryPage, 50);
	} else {
		//加载语言
		loadIoinSummaryLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryIoinSummary);
		$("#btnExport").click(exportIoinSummary);
		$("#btnExportCsv").click(exportIoinSummaryCsv);
		$("#btnExportPdf").click(exportIoinSummaryPdf);
		
		$("#ioinSummaryTable").flexigrid({
			url: "ReportIoinAction_summary.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_beginTime, name : 'beginTimeStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_endTime, name : 'endTimeStr', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_ioin+1+parent.lang.labelCount, name : 'count0', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.report_ioin+2+parent.lang.labelCount, name : 'count1', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.report_ioin+3+parent.lang.labelCount, name : 'count2', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.report_ioin+4+parent.lang.labelCount, name : 'count3', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.report_ioin+5+parent.lang.labelCount, name : 'count4', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.report_ioin+6+parent.lang.labelCount, name : 'count5', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.report_ioin+7+parent.lang.labelCount, name : 'count6', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.report_ioin+8+parent.lang.labelCount, name : 'count7', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.report_ioin+9+parent.lang.labelCount, name : 'count8', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.report_ioin+10+parent.lang.labelCount, name : 'count9', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.report_ioin+11+parent.lang.labelCount, name : 'count10', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.report_ioin+12+parent.lang.labelCount, name : 'count11', width : 80, sortable : false, align: 'center'}
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
			title: parent.lang.report_navIoinSummary,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function loadIoinSummaryLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navIoinSummary);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryIoinSummary() {
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
	
	$('#ioinSummaryTable').flexOptions(
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
	document.reportForm.action = "ReportIoinAction_summaryExcel.action?toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportIoinSummary() {
	exportReport(1);
}

function exportIoinSummaryCsv() {
	exportReport(2);
}

function exportIoinSummaryPdf() {
	exportReport(3);
}