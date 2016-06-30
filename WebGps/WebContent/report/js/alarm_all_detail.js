$(document).ready(function(){
	setTimeout(loadAllDetailPage, 50);
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

function loadAllDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadAllDetailPage, 50);
	} else {
		//加载语言
		loadAllDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryAllDetail);
		$("#btnExport").click(exportAllDetail);
		$("#btnExportCsv").click(exportAllDetailCsv);
		$("#btnExportPdf").click(exportAllDetailPdf);
		
		$("#allDetailTable").flexigrid({
			url: "ReportAlarmAction_allDetail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'armTimeStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_ioinType, name : 'armType', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_positionCurrent, name : 'position', width : 250, sortable : false, align: 'center'},
				{display: parent.lang.content, name : 'content', width : 250, sortable : false, align: 'center', hide: false}
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
			title: parent.lang.report_navAlarmAll,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function loadAllDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navAlarmAll);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryAllDetail() {
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
	$('#allDetailTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if(name == 'armTime'){
		pos = dateTime2TimeString(row[name]);
	}else if (name == 'armType') {
		if (row[name] == 11) {
			pos = parent.lang.report_speedOver + "  " + parent.lang.report_alarmBegin;;
		} else if (row[name] == 61){
			pos = parent.lang.report_speedOver + "  " + parent.lang.report_alarmEnd;
		} else if (row[name] == 16){
			pos = parent.lang.report_alarm_accon;
		}else if (row[name] == 66){
			pos = parent.lang.report_alarm_accoff;
		}else if (row[name] == 18){
			pos =parent.lang.report_alarm_gpssinnal +"  "+ parent.lang.report_alarmBegin;
		}else if (row[name] == 68){
			pos =parent.lang.report_alarm_gpssinnal +"  "+ parent.lang.report_alarmEnd;
		}else if (row[name] == 2){
			pos =parent.lang.report_alarm_urgencyButton +"   "+ parent.lang.report_alarmBegin;
		}else if (row[name] == 52){
			pos =parent.lang.report_alarm_urgencyButton +"   "+ parent.lang.report_alarmEnd;
		}else if (row[name] == 6){
			pos =parent.lang.report_alarm_opendoor +"   "+ parent.lang.report_alarmBegin;
		}else if (row[name] == 56){
			pos =parent.lang.report_alarm_opendoor +"   "+ parent.lang.report_alarmEnd;
		}else if (row[name] == 15){
			pos =parent.lang.report_alarm_motion +"   "+ parent.lang.report_alarmBegin;
		}else if (row[name] == 65){
			pos =parent.lang.report_alarm_motion +"   "+ parent.lang.report_alarmEnd;
		}else if (row[name] == 4){
			pos =parent.lang.report_alarm_videoLost +"   "+ parent.lang.report_alarmBegin;
		}else if (row[name] == 54){
			pos =parent.lang.report_alarm_videoLost +"   "+ parent.lang.report_alarmEnd;
		}else if (row[name] == 3){
			pos =parent.lang.report_alarm_shake +"   "+ parent.lang.report_alarmBegin;
		}else if (row[name] == 53){
			pos =parent.lang.report_alarm_shake +"   "+ parent.lang.report_alarmEnd;
		}else if (row[name] == 155){
			pos =parent.lang.report_alarm_upsCut +"   "+ parent.lang.report_alarmBegin;
		}else if (row[name] == 156){
			pos =parent.lang.report_alarm_upsCut +"   "+ parent.lang.report_alarmEnd;
		}else if (row[name] == 159){
			pos =parent.lang.report_alarm_boardOpened +"   "+ parent.lang.report_alarmBegin;
		}else if (row[name] == 160){
			pos =parent.lang.report_alarm_boardOpened +"   "+ parent.lang.report_alarmEnd;
		}else if (row[name] == 161){
			pos = parent.lang.report_alarm_turnOff;
		}else if (row[name] == 10){
			pos =parent.lang.report_alarm_diskError +"   "+ parent.lang.report_alarmBegin;
		}else if (row[name] == 60){
			pos =parent.lang.report_alarm_diskError +"   "+ parent.lang.report_alarmEnd;
		}else if (row[name] == 157){
			pos =parent.lang.report_alarm_highTemperature +"   "+ parent.lang.report_alarmBegin;
		}else if (row[name] == 158){
			pos =parent.lang.report_alarm_highTemperature +"   "+ parent.lang.report_alarmEnd;
		}else if (row[name] == 166){
			pos =parent.lang.report_alarm_simlost +"   "+ parent.lang.report_alarmBegin;
		}else if (row[name] == 167){
			pos =parent.lang.report_alarm_simlost +"   "+ parent.lang.report_alarmEnd;
		}else {
			var ioinName = gpsGetVehicleAllIoinName(row['devIdno']);
			pos = setIoinType(ioinName,row[name]);
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
	}else if (name == 'content') {
		if(row['armType'] == 11 || row['armType'] == 61){
			if(row['param1'] != 0) {
				pos = gpsGetSpeed(row['param1']/10, 1);
			}
		}else if(row['armType'] == 16 || row['armType'] == 66){
			if(row['armType'] == 16){
				pos = parent.lang.report_alarm_accon;
			}else{
				pos = parent.lang.report_alarm_accoff;
			}
		}else if(row['armType'] == 18 || row['armType'] == 68){
			pos = parent.lang.report_alarm_gpssinnal;
		}else if(row['armType'] == 2 || row['armType'] == 52){
			pos = parent.lang.report_alarm_urgencyButton;
		}else if(row['armType'] == 6 || row['armType'] == 56){
			pos = parent.lang.report_alarm_opendoor;
		}else if(row['armType'] == 15 || row['armType'] == 65 || row['armType'] == 4 || row['armType'] == 54){
			pos = gpsGetVehicleChannelName(row['devIdno'], getAlarmChannel(row['armInfo']));
		}else if(row['armType'] == 3 || row['armType'] == 53){
			pos = getAlarmContent(row['armType']);
		}else if(row['armType'] == 155 || row['armType'] == 156){
			pos = parent.lang.report_alarm_upsCut;
		}else if(row['armType'] == 159 || row['armType'] == 160){
			pos = parent.lang.report_alarm_boardOpened;
		}else if(row['armType'] == 161){
			pos = parent.lang.report_alarm_turnOff;
		}else if(row['armType'] == 10 || row['armType'] == 60){
			pos = parent.lang.report_alarm_diskError;
		}else if(row['armType'] == 157 || row['armType'] == 158){
			if (row['armInfo'] != null) {
				pos += parent.lang.dardnumbers+ ":" + (parseInt(row['armInfo']) + 1) + ", ";
			}
			
			if(row['param1']!=null){
				switch (parseInt(row['param1'])) {
				case 1:
					pos += parent.lang.report_labelSpeedAlarmType + parent.lang.sdcard + ", ";
					break;
				case 2:
					pos += parent.lang.report_labelSpeedAlarmType + parent.lang.harddisk+ ", ";
					break;
				case 3:
					pos += parent.lang.report_labelSpeedAlarmType + parent.lang.ssd+ ", ";
					break;
				}
			}
			if(row['param2'] != null) {
				pos += parent.lang.monitor_vehiStatusTemperature + ":" + row['param2'] +" ";
				pos += parent.lang.degree;
			}
		}else{
			var ioinName = gpsGetVehicleAllIoinName(row['devIdno']);
			pos = setIoinType(ioinName,row['armType']);
		}
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function getAlarmChannel(armInfo) {
	var channel = "";
	for (var i = 0; i < 16; i += 1) {
		if ( ((armInfo>>i) & 0x01) > 0) {
			if(channel != ""){
				channel += ",";
			}
			channel += i ;
		}
	}
	return  channel;
}

function getAlarmContent(armInfo) {
	var content = "";
	if (armInfo != null) {
		var dirInfo = [];
		if ( armInfo&0x1 ){
			dirInfo.push("X");
		} 
		if ( (armInfo>>1)&0x1 ){
			dirInfo.push("Y");
		} 
		if ( (armInfo>>2)&0x1 ){
			dirInfo.push("Z");
		} 
		content = parent.lang.direction + parent.lang.colon + dirInfo.join(", ");
	}
	return content;
}

function setIoinType(ioinName,armType) {
	//var ioinName = gpsGetVehicleAllIoinName(row['devIdno']);
	var alarm;
	var ioin = 0;
	if (armType >= 19 && armType <= 26) {
		ioin = armType - 19;
		alarm = parent.lang.report_alarmBegin;
	} else if (armType >= 41 && armType <= 44) {
		ioin = armType - 41 + 8;
		alarm = parent.lang.report_alarmBegin;
	} else if (armType >= 69 && armType <= 76) {
		ioin = armType - 69;
		alarm = parent.lang.report_alarmEnd;
	} else if(armType >= 91 && armType <= 94){
		ioin = armType - 91;
		alarm = parent.lang.report_alarmEnd;
	}
	var temp = gpsGetIoinName(ioinName, ioin);
	return temp + "  " + alarm;
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
	document.reportForm.action = "ReportAlarmAction_detailExcel.action?type=all&toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportAllDetail() {
	exportReport(1);
}

function exportAllDetailCsv() {
	exportReport(2);
}

function exportAllDetailPdf() {
	exportReport(3); 
}