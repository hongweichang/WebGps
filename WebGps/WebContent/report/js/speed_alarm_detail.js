$(document).ready(function(){
	setTimeout(loadSpeedAlarmPage, 50);
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

function loadSpeedAlarmPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadSpeedAlarmPage, 50);
	} else {
		//加载语言
		loadSpeedAlarmLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(querySpeedAlarm);
		$("#btnExport").click(exportSpeedAlarmDetail);
		$("#btnExportCsv").click(exportSpeedAlarmDetailCsv);
		$("#btnExportPdf").click(exportSpeedAlarmDetailPdf);
		//初始化报警类型选项
		$("#speedAlarmType").append("<option value='0' selected>" + parent.lang.all + "</option>");
		$("#speedAlarmType").append("<option value='1'>" + parent.lang.report_speedOver + "</option>");
		$("#speedAlarmType").append("<option value='2'>" + parent.lang.report_speedLow + "</option>");
		
		$("#speedAlarmTable").flexigrid({
			url: "ReportSpeedAction_alarm.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'armTimeStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_speedCurrent + gpsGetLabelSpeedUnit(), name : 'speed', width : 200, sortable : false, align: 'center'},
				{display: parent.lang.report_speedAlarmType, name : 'armType', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_positionCurrent, name : 'position', width : 250, sortable : false, align: 'center'}
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
			title: parent.lang.report_navSpeedAlarmDetail,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
		
	}
}

function loadSpeedAlarmLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navSpeedAlarmDetail);
	$("#labelSpeedAlarmType").text(parent.lang.report_labelSpeedAlarmType);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function querySpeedAlarm() {
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
		name: 'speedAlarmType',
		value: $("#speedAlarmType").val()
	});
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	$('#speedAlarmTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if(name == 'armTime'){
		pos = dateTime2TimeString(row[name]);
	}else if(name == 'speed') {
		if(row['param1'] != 0) {
			pos = gpsGetSpeed(row['param1']/10, 1);
		}else {
			pos = gpsGetSpeed(row['speed']/10, 1);
		}
	}else if(name == 'armType') {
		pos = setArmType(row,name);
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

function setArmType(row,name) {
	var armType = "";
	if (row['armInfo'] == 0) {
		if (row[name] == 11) {
			armType = parent.lang.report_speedOver + "  " + parent.lang.report_alarmBegin;
		} else {
			armType = parent.lang.report_speedOver + "  " + parent.lang.report_alarmEnd;
		}
	} else {
		if (row[name] == 11) {
			armType = parent.lang.report_speedLow + "  " + parent.lang.report_alarmBegin;
		} else {
			armType = parent.lang.report_speedLow + "  " + parent.lang.report_alarmEnd;
		}
	}
	return armType;
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
		document.forms[0].action = "ReportSpeedAction_detailExcel.action?toMap="+toMap+"&exportType="+exportType;
		document.forms[0].submit();
	}, 0); 
}

function exportSpeedAlarmDetail() {
	exportReport(1);
}

function exportSpeedAlarmDetailCsv() {
	exportReport(2);
}

function exportSpeedAlarmDetailPdf() {
	exportReport(3);
}