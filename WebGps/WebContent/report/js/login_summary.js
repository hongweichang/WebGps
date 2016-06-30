$(document).ready(function(){
	setTimeout(loadLoginSummaryPage, 50);
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

function loadLoginSummaryPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadLoginSummaryPage, 50);
	} else {
		//加载语言
		loadLoginSummaryLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryLoginSummary);
		$("#btnExport").click(exportLoginSummary);
		$("#btnExportCsv").click(exportLoginSummaryCsv);
		$("#btnExportPdf").click(exportLoginSummaryPdf);
		
		$("#loginSummaryTable").flexigrid({
			url: "ReportLoginAction_summary.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.begintime, name : 'beginTimeStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.endtime, name : 'endTimeStr', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_onlineCount, name : 'count0', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_disonlineCount, name : 'count1', width : 100, sortable : false, align: 'center'}
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
			title: parent.lang.report_navLoginSummary,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function loadLoginSummaryLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navLoginSummary);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryLoginSummary() {
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
	$('#loginSummaryTable').flexOptions(
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
	document.reportForm.action = "ReportLoginAction_summaryExcel.action?toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportLoginSummary() {
	exportReport(1);
}

function exportLoginSummaryCsv() {
	exportReport(2);
}

function exportLoginSummaryPdf() {
	exportReport(3);
}