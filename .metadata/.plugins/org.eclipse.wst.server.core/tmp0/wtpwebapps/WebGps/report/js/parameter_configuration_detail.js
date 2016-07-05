$(document).ready(function(){
	setTimeout(loadOflTaskLogDetailPage, 50);
});

var searchOpt = new searchOption(false, true);
var markerList = null;

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

function loadOflTaskLogDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadOflTaskLogDetailPage, 50);
	} else {
		//加载语言
		loadOflTaskLogDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryOflTaskLogDetail);
		$("#btnExport").click(exportOflTaskLogDetail);
		$("#btnExportCsv").click(exportOflTaskLogDetailCsv);
		$("#btnExportPdf").click(exportOflTaskLogDetailPdf);
		
		//
		$("#nTaskStatus").append("<option value='5' selected>" + parent.lang.all + "</option>");
		$("#nTaskStatus").append("<option value='0' >" + parent.lang.notPerformed + "</option>");
		$("#nTaskStatus").append("<option value='2' >" + parent.lang.taskCompletion + "</option>");
		//
		$("#nType").append("<option value='0' selected>" + parent.lang.all + "</option>");
		$("#nType").append("<option value='3' >" + parent.lang.parameterConfiguration + "</option>");
		$("#nType").append("<option value='4' >" + parent.lang.wifiSiteConfiguration + "</option>");
		
		$("#parameterConfigurationDetailTable").flexigrid({
			url: "ReportDeviceOflTaskLogAction_parameterConfiguration.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.versionName, name : 'dtVerName', width : 150, sortable : false, align: 'center'},	//版本名称
				{display: parent.lang.monitor_myMapType, name : 'dtType', width : 200, sortable : false, align: 'center'},	//版本号
				{display: parent.lang.taskTime, name : 'dtCreateTask', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.executionTime, name : 'dtEndTask', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.completion, name : 'nTaskStatus', width : 150, sortable : false, align: 'center'}
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
			title: parent.lang.report_parameterConfigurationReport,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
} 

function loadOflTaskLogDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_parameterConfigurationReport);
	$("#labelMarker").text(parent.lang.completion);
	$("#labelType").text(parent.lang.monitor_myMapType);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
	diableInput("#devVerNum", disable, true);
	diableInput("#nType", disable, true);
}

function queryOflTaskLogDetail() {
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
	params.push({
		name: 'nTaskStatus',
		value: $("#nTaskStatus").val()
	});
	params.push({
		name: 'nType',
		value: $("#nType").val()
	});
	$('#parameterConfigurationDetailTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if(name == 'dtCreateTask'){
		pos = dateTime2TimeString(row[name]);
	}else if(name == 'dtEndTask') {
		if (row["nTaskStatus"] != 0){
			pos = dateTime2TimeString(row[name]);
		}
	}else if(name == 'dtType') {
		if(row["nFileType"] == 3){
			pos = parent.lang.parameterConfiguration;
		}else{
			pos = parent.lang.wifiSiteConfiguration;
		}
	}else if(name == 'dtVerName') {
		pos = row["strParam"].split(',')[1];
	}else if(name == 'nTaskStatus'){
		var status = row[name];
		if(status == 0){
			pos = parent.lang.notPerformed;
		}else if(status == 1){
			pos = parent.lang.taskExecution;
		}else if(status == 2){
			pos = parent.lang.taskCompletion;
		}else if(status == 3){
			pos = parent.lang.taskFails;
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
	document.reportForm.action = "ReportDeviceOflTaskLogAction_detailExcel.action?type=parameterConfiguration&toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportOflTaskLogDetail() {
	exportReport(1);
}

function exportOflTaskLogDetailCsv() {
	exportReport(2); 
}

function exportOflTaskLogDetailPdf() {
	exportReport(3); 
}