$(document).ready(function(){
	setTimeout(loadTicketDetailPage, 50);
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

function loadTicketDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadTicketDetailPage, 50);
	} else {
		//加载语言
		loadTicketDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryTicketDetail);
		$("#btnExport").click(exportTicketDetail);
		$("#btnExportCsv").click(exportTicketDetailCsv);
		$("#btnExportPdf").click(exportTicketDetailPdf);
		
		$("#ticketDetailTable").flexigrid({
			url: "ReportNormalAction_ticketDetail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'armTime', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_peopleNumber, name : 'param1', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_ticketed, name : 'param2', width : 120, sortable : false, align: 'center', hide: false}
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
			title: parent.lang.report_navPassengerTicketDetail,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function loadTicketDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navPassengerTicketDetail);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryTicketDetail() {
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
	$('#ticketDetailTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if(name == 'armTime'){
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
	setTimeout(function () {
		document.forms[0].action = "ReportNormalAction_detailExcel.action?type=ticket&toMap="+toMap+"&exportType="+exportType;
		document.forms[0].submit();
	}, 0); 
}

function exportTicketDetail() {
	exportReport(1);
}

function exportTicketDetailCsv() {
	exportReport(2);
}

function exportTicketDetailPdf() {
	exportReport(3);
}