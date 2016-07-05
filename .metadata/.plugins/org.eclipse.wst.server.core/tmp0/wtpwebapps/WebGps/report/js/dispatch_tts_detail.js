$(document).ready(function(){
	setTimeout(loadDispatchTtsPage, 50);
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

function loadDispatchTtsPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadDispatchTtsPage, 50);
	} else {
		//加载语言
		loadExtendTtsLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryDispatchTtsDetail);
		$("#btnExport").click(exportDispatchTtsDetail);
		$("#btnExportCsv").click(exportDispatchTtsDetailCsv);
		$("#btnExportPdf").click(exportDispatchTtsDetailPdf);
		
		$("#dispatchTtsDetailTable").flexigrid({
			url: "ReportTtsAction_detail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.report_dispatch_user, name : 'user', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.terminalName, name : 'devIdno', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_date, name : 'dtimeStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_dispatch_command, name : 'param1', width : 400, sortable : false, align: 'center'}
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
			title: parent.lang.report_navDispatchTtsDetail,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function loadExtendTtsLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navDispatchTtsDetail);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryDispatchTtsDetail() {
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
	$('#dispatchTtsDetailTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if(name == 'dtime'){
		pos = dateTime2TimeString(row[name]);
	}else if(name == 'user') {
		if(row['userInfo'] !=null ) {
			pos = row['userInfo'].userAccount.name;
		}
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
	document.reportForm.action = "ReportTtsAction_detailExcel.action?toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportDispatchTtsDetail() {
	exportReport(1);
}

function exportDispatchTtsDetailCsv() {
	exportReport(2);
}

function exportDispatchTtsDetailPdf() {
	exportReport(3);
}