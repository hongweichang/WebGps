$(document).ready(function(){
	setTimeout(loadExtendDispatchPage, 50);
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

function loadExtendDispatchPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadExtendDispatchPage, 50);
	} else {
		//加载语言
		loadExtendDispatchLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		//初始化区域报警类型选项
		$("#alarmType").append("<option value='0' selected>" + parent.lang.all + "</option>");
		$("#alarmType").append("<option value='35'>" + parent.lang.report_extend_fire + "</option>");
		$("#alarmType").append("<option value='36'>" + parent.lang.report_extend_panic + "</option>");
		$("#btnQuery").click(queryExtendDispatchDetail);
		$("#btnExport").click(exportExtendDispatchDetail);
		$("#btnExportCsv").click(exportExtendDispatchDetailCsv);
		$("#btnExportPdf").click(exportExtendDispatchDetailPdf);
		
		$("#extendDispatchDetailTable").flexigrid({
			url: "ReportDispatchAction_detail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.terminalName, name : 'user', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'dtimeStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_dispatch_command, name : 'command', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_positionCurrent, name : 'position', width : 250, sortable : false, align: 'center'},
				{display: parent.lang.report_dispatch_status, name : 'status', width : 100, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_dispatch_completeTime, name : 'completeTime', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_dispatch_completeDesc, name : 'completeDesc', width : 200, sortable : false, align: 'center'}
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
			title: parent.lang.report_navExtendDispatchDetail,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function loadExtendDispatchLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navExtendDispatchDetail);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryExtendDispatchDetail() {
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
	$('#extendDispatchDetailTable').flexOptions(
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
		pos = row[name].name;
	}else if(name == 'status'){
		if(row[name] == 2) {
			pos = parent.lang.report_dispatch_finished;
		}
	}else if(name == 'completeDesc'){
		if(row['status'] == 2) {
			pos = changeNull(row[name]);
		}
	}else if(name == 'completeTime'){
		if(row['status'] == 2) {
			pos = dateTime2TimeString(row[name]);
		}
	}else if (name == 'position') {
		if(parent.showLocation == "true"){
			pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + gpsGetVehicleName(row['devIdno']) + "', '" + row['jingDu'] + "', '" + row['weiDu'] + "');\">" + changeNull(row[name]) + "</a>";
		} else {
			if(row['jingDu'] == 0 || row['weiDu'] == 0){
				pos = "";
			}else{
				pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + gpsGetVehicleName(row['devIdno']) + "', '" + row['jingDu'] + "', '" + row['weiDu'] + "');\">" + gpsGetPosition(row['jingDu'], row['weiDu'], 1) + "</a>";
			}
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
	document.reportForm.action = "ReportDispatchAction_detailExcel.action?toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportExtendDispatchDetail() {
	exportReport(1);
}

function exportExtendDispatchDetailCsv() {
	exportReport(2); 
}

function exportExtendDispatchDetailPdf() {
	exportReport(3);
}