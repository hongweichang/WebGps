$(document).ready(function(){
	setTimeout(loadAlarmDetailPage, 50);
});

var searchOpt = new searchOption(false, true);

function loadAlarmDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadAlarmDetailPage, 50);
	} else {
		buttonQueryOrExport();
		$('#select-armType').flexPanel({
			ComBoboxModel :{
				button :
				[
					[{
						display: parent.lang.all, name : 'type', pid : 'type', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]
				],
				combox: {name : 'type', option : arrayToStr(getArmTypes())}
			}	
		});
		$('#hidden-type').val("allReporting");
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
		loadAlarmDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(queryAlarmDetail);
		$(".btnExport").click(exportAlarmDetail);
		$(".btnExportCSV").click(exportAlarmDetailCSV);
		$(".btnExportPDF").click(exportAlarmDetailPDF);
		var width = 0;
		if(parent.screenWidth >= 1360) {
			width = 'auto';
		}else {
			width = 1060;
			$('#sysuserLogDate').css('width','1100px');
		}
		$("#alarmDetailTable").flexigrid({
			url: "StandardReportAlarmAction_detail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.plate_number, name : 'vehiIdno', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_plate_color, name : 'plateType', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'armTimeStart', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.type, name : 'armTypeStr', width : 200, sortable : false, align: 'center'},
				{display: parent.lang.content, name : 'content', width : 250, sortable : false, align: 'center', hide: false}
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
	$('#alarmDetailTable').flexFixHeight();
}

function getSelectTime() {
	var distances = [];
	distances.push({id:0,name:parent.lang.customTime});
	distances.push({id:1,name:parent.lang.today});
	distances.push({id:2,name:parent.lang.yesterday});
	distances.push({id:3,name:parent.lang.last2Days});
	distances.push({id:4,name:parent.lang.last7Days});
	distances.push({id:5,name:parent.lang.month});
	return distances;
}

function loadAlarmDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_data_query);
	$("#labelarmType").text(parent.lang.reportedType);
}

function queryAlarmDetail() {
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
		name: 'type',
		value: $('#hidden-type').val()
	});
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	$('#alarmDetailTable').flexOptions(
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
	}else if(name == 'armTimeStart'){
		pos = dateTime2TimeString(row[name]);
	}else if( name == 'armTimeEnd'){
		if(dateTime2TimeString(row[name]) == '1970-01-01 08:00:00'){
			pos = "";
		}else{
			pos = dateTime2TimeString(row[name]);
		}
	}else if(name == 'content') {
		if(row['armType'] == 113){
			if(row['armInfo'] == 15){
				pos = "ID:" + row['param1'];
			}else if(row['armInfo'] == 16){
				pos = parent.lang.informationType + row['param1'];
				if(row['param2'] == 0){
					pos += parent.lang.cancel;
				}else if(row['param2'] == 1){
					pos += parent.lang.demand;
				}
			}else if(row['armInfo'] == 17){
				pos = row['armDesc'] + row['imgInfo'];
			}else if(row['armInfo'] == 18){
				pos = row['imgInfo'];
			}else if(row['armInfo'] == 20){
				pos = "ID:" + row['param1'];
				if(row['param2'] != null){
					var type = row['param2'] & 0xff;
					var format = (row['param2'] >> 8) & 0xff;
					var event = (row['param2'] >> 16) & 0xff;
					var aisle = (row['param2'] >> 24) & 0xff;
					pos += ";" + parent.lang.mediaTypes;
					if(type == 1){
						pos += parent.lang.audio;
					}else if(type == 2){
						pos += parent.lang.video;
					}else{
						pos += parent.lang.photo;
					}
					pos += ";" + parent.lang.codingFormat;
					if(format == 0){
						pos += "JPEG";
					}else if(format == 1){
						pos += "TIF";
					}else if(format == 2){
						pos += "MP3";
					}else if(format == 3){
						pos += "WAV";
					}else if(format == 4){
						pos += "WMV";
					}else{
						pos += parent.lang.other;
					}
					pos += ";" + parent.lang.eventEntry;
					if(event == 0){
						pos += parent.lang.issuedInstructionsPlatform;
					}else if(event == 1){
						pos += parent.lang.timingAction;
					}else if(event == 2){
						pos += parent.lang.robberyAlarmTriggered;
					}else if(event == 3){
						pos += parent.lang.rolloverCollisionAlarmTriggered;
					}else{
						pos += parent.lang.other;
					}
					pos += ";" + parent.lang.channel + aisle;
				}
			}
		}else if(row['armType'] == 116){
			if(row['armDesc'] != null){
				var str = row['armDesc'].split(";");
				pos = parent.lang.driverName + str[0] + ";" + parent.lang.issuingOrganization + str[1] + ";" + parent.lang.IDCode + str[2] + ";" + parent.lang.qualificationCertificateCoding + str[3];
			}else{
				pos = null;
			}
		}
	}else {
		pos = row[name];
	}
	return pos;
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
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	document.reportForm.action = "StandardReportAlarmAction_detailExcel.action?exportType="+exportType+"&toMap="+toMap+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val()+"&maintype=data";
	document.reportForm.submit();
}
//导出至excel，导出至csv，导出至pdf
function exportAlarmDetail() {
	exportReport(1);
}

function exportAlarmDetailCSV() {
	exportReport(2);
}

function exportAlarmDetailPDF() {
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

function getArmTypes() {
	var armType = [];
	armType.push({id:'allReporting',name:parent.lang.all});
	armType.push({id:'practice',name:parent.lang.practice});
	armType.push({id:'informationServices',name:parent.lang.informationServices});
	armType.push({id:'electronicWaybill',name:parent.lang.electronicWaybill});
	armType.push({id:'compressedDataReporting',name:parent.lang.compressedDataReporting});
	armType.push({id:'multimediaEventInformation',name:parent.lang.multimediaEventInformation});
	armType.push({id:'driverStatusCollection',name:parent.lang.driverStatusCollection});
	return armType;
}