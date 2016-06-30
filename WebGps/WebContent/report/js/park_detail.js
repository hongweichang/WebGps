$(document).ready(function(){
	setTimeout(loadParkDetailPage, 50);
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

function loadParkDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadParkDetailPage, 50);
	} else {
		//加载语言
		loadParkDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryParkDetail);
		$("#btnExport").click(exportParkDetail);
		$("#btnExportCsv").click(exportParkDetailCsv);
		$("#btnExportPdf").click(exportParkDetailPdf);
		
		var type = getUrlParameter("type");
		var title = parent.lang.report_navParkDetail;
		if (type !== "") {
			title = parent.lang.report_navParkAcconDetail;
		}
		$("#parkDetailTable").flexigrid({
			url: "ReportParkAction_detail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.begintime, name : 'armTimeStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.endtime, name : 'gpsTimeStr', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_park_time, name : 'parkTime', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_park_position, name : 'position', width : 250, sortable : false, align: 'center'},
				{display: parent.lang.report_lichengCurrent + gpsGetLabelLiChengUnit(), name : 'liCheng', width : 100, sortable : false, align: 'center'}
			//	{display: parent.lang.report_oil_change, name : 'youLiang', width : 100, sortable : false, align: 'center'}
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

function loadParkDetailLang(){
	searchOpt.loadLang();
	var type = getUrlParameter("type");
	if (type !== "") {
		$("#reportTitle").text(parent.lang.report_navParkAcconDetail);
	} else {
		$("#reportTitle").text(parent.lang.report_navParkDetail);
	}
	$("#labelParkTime").text(parent.lang.report_labelParkTime);
	$("#labelSecond").text(parent.lang.report_park_second);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryParkDetail() {
	//判断时间
	var query = searchOpt.getQueryData(false);
	if (query === null) {
		return ;
	}
	var parkTime = parseIntDecimal($.trim($("#parkTime").val()));
	/*
	if (parkTime < 0) {
		alert(parent.lang.report_park_timeLess180);
		$("#parkTime").focus();
		return ;
	}*/
	if (parkTime > 9999) {
		alert(parent.lang.report_park_timeMax9999);
		$("#parkTime").focus();
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
		name: 'parkTime',
		value: parkTime
	});
	var type = getUrlParameter("type");
	if (type !== "") {
		params.push({
			name: 'type',
			value: type
		});
	}
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	$('#parkDetailTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if(name == 'endTime'){
		pos = dateTime2TimeString(row['armTime']);
	}else if(name == 'beginTime') {
		pos = dateTime2TimeString(row['armTime'] - row['param2']*1000);
	}else if(name == 'parkTime') {
		pos = gpsFormatSecond2Time(row['param2']);
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
	}else if((name == 'liCheng')){
		pos = gpsGetLiCheng(row[name]);
	}
/*	else if(name == 'youLiang') {
		if (row['armType'] == 104) {
			pos = gpsGetYouLiang(row['armInfo']);
		} else {
			pos = "-" + gpsGetYouLiang(row['armInfo']);
		}
	} */else {
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
	var action = "ReportParkAction_detailExcel.action?toMap="+toMap+"&exportType="+exportType;
	var type = getUrlParameter("type");
	if (type !== "") {
		action = action + "&type=" + type;
	} 
	
	document.reportForm.action = action;
	document.reportForm.submit();
}

function exportParkDetail() {
	exportReport(1);
}

function exportParkDetailCsv() {
	exportReport(2);
}

function exportParkDetailPdf() {
	exportReport(3);
}