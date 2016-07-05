$(document).ready(function(){
	setTimeout(loadDiskStatusInformationPage, 50);
});

var searchOpt = new searchOption();
var markerList = null;

function loadDiskStatusInformationPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadDiskStatusInformationPage, 50);
	} else {
		buttonQueryOrExport();
		$('#select-status').flexPanel({
			ComBoboxModel :{
				button :
				[
					[{
						display: parent.lang.all, name : 'status', pid : 'status', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]
				],
				combox: {name : 'status', option : arrayToStr(getStatus())}
			}	
		});
		$('#selectName').flexPanel({
			InputModel : {display: parent.lang.selectVehicleTip,value:'',name : 'vehiIdnos', pid : 'vehiIdnos', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
		});
		
		$('#selecttime').flexPanel({
			ComBoboxModel :{
				input : {name : 'selecttime',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'selecttime', option : arrayToStr(getSelectTime(1))}
			}	
		});
		
		$('#select-selecttime li').each(function() {
			var index= $(this).attr('data-index');
			$(this).on('click',function() {
				selectTime(index, 1);
			});
			if(index == 0) {
				$(this).click();
			}
		});
		
		//加载语言
		loadDiskStatusInformationLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#begintime").val(dateCurrentDateString());
		$("#endtime").val(dateCurrentDateString());
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$("#begintime").val(dateCurrentDateString());
		$(".btnQuery").click(queryDiskStatusInformation);
		$(".btnExport").click(exportDiskStatusInformation);
		$(".btnExportCSV").click(exportDiskStatusInformationCSV);
		$(".btnExportPDF").click(exportDiskStatusInformationPDF);
		var width = 0;
		if(parent.screenWidth >= 1360) {
			width = 'auto';
		}else {
			width = 1060;
			$('#sysuserLogDate').css('width','1100px');
		}
		$("#diskStatusDetailTable").flexigrid({
			url: "StandardReportHardwareStatusAction_daily.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.plate_number, name : 'vehiIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_plate_color, name : 'plateType', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.device_number, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'date', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_harddiskStatusInformation, name : 'param1', width : 800, sortable : false, align: 'center', hide: false}
				],
			pernumber: parent.lang.pernumber,
			pagestat: parent.lang.pagestatInfo,
			pagefrom: parent.lang.pagefrom,
			pagetext: parent.lang.page,
			pagetotal: parent.lang.pagetotal,
			findtext: parent.lang.find,
			procmsg: parent.lang.procmsg,
			nomsg : parent.lang.nomsg,
			usepager: true,
			autoload: false,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: width,
			onSubmit: false,
			height: 'auto'
		});
		loadReportTableWidth(fixHeight);
	}
}

function fixHeight() {
	$('#diskStatusDetailTable').flexFixHeight();
}

function loadDiskStatusInformationLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_storage_harddiskStatusInformationDetail);
	$("#labelStatus").text(parent.lang.report_labelStatus);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryDiskStatusInformation() {
	var query = searchOpt.getQueryDataNew(false);
	if (query === null) {
		return ;
	}
	if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
		alert(parent.lang.report_selectVehiNullErr);
		return;
	}
	searchOpt.requireParam.vehiIdnos = $('#hidden-vehiIdnos').val();
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
		name: 'status',
		value: $("#hidden-status").val()
	});
	$('#diskStatusDetailTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'plateType') {
		switch (parseIntDecimal(row[name])) {
		case 1:
			pos = parent.lang.blue_label;
			break;
		case 2:
			pos = parent.lang.yellow_label;
			break;
		case 3:
			pos = parent.lang.black_label;
			break;
		case 4:
			pos = parent.lang.white_label;
			break;
		case 0:
			pos = parent.lang.other;
			break;
		default:
			break;
		}
	}else if(name == 'date') {
		if(dateTime2TimeString(row[name]) == '1970-01-01 08:00:00'){
			pos = "";
		}else{
			pos = dateTime2TimeString(row[name]);
		}
	}else if(name == 'param1') {
		pos = getDiskwareStatus(row['diskStatus'],row['diskSerialNum'],row['diskAllVolume'],row['diskLeftVolume'],row['diskType']);
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function getDiskwareStatus(diskStatus,diskSerialNum,diskAllVolume,diskLeftVolume,diskType) {
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
			if (strSerial.length > i && strSerial[i] != null && strSerial[i] != "") {
				serial = parent.lang.serialNumber + ":" + strSerial[i] + ",";
			}

			var space = parent.lang.totalCapacity + ":" + (parseInt(strAllVolume[i])/1024).toFixed(2) + "," + parent.lang.remainingSpace + ":" + (parseInt(strLeftVolume[i])/1024).toFixed(2) + ";   ";
			detail += (disk + serial + space);
			
			//if(strAllVolume[i] != "0"){
			//}else{
			//	detail += (disk + parent.lang.harddiskerror + ";");
			//}
		}
	}
	return detail;
}

function exportReport(exportType) {
	var query = searchOpt.getQueryDataNew(false);
	if (query === null) {
		return ;
	}
	
	if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
		alert(parent.lang.report_selectVehiNullErr);
		return;
	}
	document.reportForm.action = "StandardReportHardwareStatusAction_detailExcel.action?type=hardwareStatus&exportType="+exportType+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val();
	document.reportForm.submit();
}
//导出至excel，导出至csv，导出至pdf
function exportDiskStatusInformation() {
	exportReport(1);
}

function exportDiskStatusInformationCSV() {
	exportReport(2);
}

function exportDiskStatusInformationPDF() {
	exportReport(3);
}

var selIds;
//选择车辆
function selVehicle() {
	$.dialog({id:'info', title:parent.lang.selectVehicleTitle,content: 'url:StatisticalReports/selectInfo.html?type=selVehicle&singleSelect=false&selectAll=true&isOil=false',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}

function doSelectVehicle(ids,vehicleList) {
	if(ids != null && ids == '0') {
		$('#combox-vehiIdnos').val(parent.lang.all_vehicles);
		$('#hidden-vehiIdnos').val(getNewArrayByArray(parent.vehicleList,'name').toString());
	}else {
		selIds = ids;
		if(ids != null && ids.split(',').length > 0) {
			if(ids.split(',').length > 1) {
				$('#combox-vehiIdnos').val(parent.lang.isSelected + ids.split(',').length);
			}else {
				$('#combox-vehiIdnos').val(vehicleList);
			}
		}
		$('#hidden-vehiIdnos').val(vehicleList);
	}
	$.dialog({id:'info'}).close();
}

function doExit() {
	$.dialog({id:'info'}).close();
}

function getStatus() {
	var status = [];
	status.push({id:'2',name:parent.lang.all});
	status.push({id:'0',name:parent.lang.good});
	status.push({id:'1',name:parent.lang.bad});
	return status;
}