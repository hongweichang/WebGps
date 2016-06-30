$(document).ready(function(){
	setTimeout(loadVersionDetailPage, 50);
});

var searchOpt = new searchOption();

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

function loadVersionDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadVersionDetailPage, 50);
	} else {
		//加载语言
		loadVersionDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#begintime").val(dateCurrentDateString());
		$("#btnQuery").click(queryVersionDetail);
		$("#btnExport").click(exportVersionDetail);
		$("#btnExportCsv").click(exportVersionDetailCsv);
		$("#btnExportPdf").click(exportVersionDetailPdf);
		var title = parent.lang.report_vehicleReleaseDetails;
		$("#versionDetailTable").flexigrid({
			url: "ReportDeviceOflTaskLogAction_distinctHardwareStatus.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'dateStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.versionNumber, name : 'version', width : 120, sortable : false, align: 'center'}
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

function loadVersionDetailLang(){
	searchOpt.loadLang();
	var type = getUrlParameter("type");
	$("#reportTitle").text(parent.lang.report_vehicleReleaseDetails);
	$("#labelVersionSearch").text(parent.lang.versionNumber);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryVersionDetail() {
	//判断时间
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
		name: 'version',
		value: $("#version").val()
	});
	$('#versionDetailTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if(name == 'version'){
		pos = row['devVerNum'];
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
	document.reportForm.action = "ReportDeviceOflTaskLogAction_detailExcel.action?type=version&toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportVersionDetail() {
	exportReport(1);
}

function exportVersionDetailCsv() {
	exportReport(2);
}

function exportVersionDetailPdf() {
	exportReport(3); 
}