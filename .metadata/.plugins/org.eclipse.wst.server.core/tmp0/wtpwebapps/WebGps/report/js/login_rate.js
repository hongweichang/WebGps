$(document).ready(function(){
	setTimeout(loadLoginRatePage, 50);
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

function loadLoginRatePage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadLoginRatePage, 50);
	} else {
		//加载语言
		loadLoginRateLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryLoginRate);
		$("#btnExport").click(exportLoginRate);
		$("#btnExportCsv").click(exportLoginRateCsv);
		$("#btnExportPdf").click(exportLoginRatePdf);
		
		$("#loginRateTable").flexigrid({
			url: "ReportLoginAction_daily.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'dtimeStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_login_rate, name : 'count', width : 100, sortable : false, align: 'center'}
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
			title: parent.lang.report_navLoginRate,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function loadLoginRateLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navLoginRate);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryLoginRate() {
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
	$('#loginRateTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if((name == 'dtime')){
		pos = dateTime2TimeString(row[name]);
	}else if(name == 'count') {
		var length = searchOpt.requireParam.devIdnos.split(",").length;
		var rate = (row[name] * 100 / length) ;
		pos = rate.toFixed(2) + "%";
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
	document.reportForm.action = "ReportLoginAction_summaryExcel.action?type=rate&toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportLoginRate() {
	exportReport(1);
}

function exportLoginRateCsv() {
	exportReport(2); 
}

function exportLoginRatePdf() {
	exportReport(3);
}