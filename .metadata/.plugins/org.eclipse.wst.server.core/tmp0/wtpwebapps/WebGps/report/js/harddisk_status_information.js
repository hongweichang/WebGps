$(document).ready(function(){
	setTimeout(loadHarddiskStatusInformationPage, 50);
});

var searchOpt = new searchOption();
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

function loadHarddiskStatusInformationPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadHarddiskStatusInformationPage, 50);
	} else {
		//加载语言
		loadHarddiskStatusInformationLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#begintime").val(dateCurrentDateString());
		$("#btnQuery").click(queryHarddiskStatusInformation);
		$("#btnExport").click(exportHarddiskStatusInformation);
		$("#btnExportCsv").click(exportHarddiskStatusCsv);
		$("#btnExportPdf").click(exportHarddiskStatusPdf);
		//
		$("#alarmType").append("<option value='2' selected>" + parent.lang.all + "</option>");
		$("#alarmType").append("<option value='0'>" + parent.lang.good + "</option>");
		$("#alarmType").append("<option value='1'>" + parent.lang.bad + "</option>");
		
		$("#harddiskStatusInformationTable").flexigrid({
			url: "ReportHardwareStatusAction_daily.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'dateStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_harddiskStatusInformation, name : 'param1', width : 800, sortable : false, align: 'center', hide: false}
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
			title: parent.lang.report_harddiskStatusInformationDetail,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function loadHarddiskStatusInformationLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_harddiskStatusInformationDetail);
	$("#labelAlarmType").text(parent.lang.report_dispatch_status);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
	diableInput("#alarmType", disable, true);
	diableInput("#markerList", disable, true);
}

function queryHarddiskStatusInformation() {
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
		name: 'diskStatus',
		value: $("#alarmType").val()
	});
	$('#harddiskStatusInformationTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if(name == 'param1') {
		pos = getHardwareStatus(row['diskStatus'],row['diskSerialNum'],row['diskAllVolume'],row['diskLeftVolume'],row['diskType']);
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function getHardwareStatus(diskStatus,diskSerialNum,diskAllVolume,diskLeftVolume,diskType) {
	var detail = '';
	if(diskStatus!=null && diskSerialNum != null && diskAllVolume !=null && diskLeftVolume!=null && diskType!=null){
		var strSerial = diskSerialNum.split(",");
		var strAllVolume = diskAllVolume.split(",");
		var strLeftVolume = diskLeftVolume.split(",");
		var strStatus = diskStatus.split(",");
		var strType = diskType.split(",");
		for(var i=0;i<strType.length;i++){
			var disk;
			if(strType[i] == "1"){
				disk = parent.lang.sdcard;
			}else if(strType[i] == "2"){
				disk = parent.lang.harddisk;
			}else if(strType[i] == "3"){
				disk = parent.lang.ssd;
			}else if(strType[i] == "4"){
				disk = parent.lang.mirror;
			}else{
				disk = parent.lang.harddisk;
			}
			disk += ((i+1) + "   ");
			
			var serial = "";
			if (strSerial.length > i) {
				serial = parent.lang.serialNumber + ":" + strSerial[i] + ",";
			}

			var space = parent.lang.totalCapacity + ":" + (parseInt(strAllVolume[i])/100).toFixed(2) + "," + parent.lang.remainingSpace + ":" + (parseInt(strLeftVolume[i])/100).toFixed(2) + ";   ";
			detail += (disk + serial + space);
		}
	}
	
	return detail;
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
	document.reportForm.action = "ReportHardwareStatusAction_detailExcel.action?type=hardwareStatus&toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportHarddiskStatusInformation() {
	exportReport(1);
}


function exportHarddiskStatusCsv() {
	exportReport(2);
}

function exportHarddiskStatusPdf() {
	exportReport(3);
}