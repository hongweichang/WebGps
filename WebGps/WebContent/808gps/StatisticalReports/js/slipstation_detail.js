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
		$('#select-handled').flexPanel({
			ComBoboxModel :{
				button :
				[
					[{
						display: parent.lang.all, name : 'handleStatus', pid : 'handleStatus', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]
				],
			//	input : {display: '选择状态',width:'60px',value:'',name : 'useType', pid : 'useType', pclass : 'buttom',bgicon : 'true', hide : false},
				combox: {name : 'handleStatus', option : '2&'+parent.lang.all+'|0&'+parent.lang.report_unhandled+'|1&'+parent.lang.report_handled}
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
		loadAlarmDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$('#hidden-type').val('driving');
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(queryAlarmDetail);
		$(".btnExport").click(exportAlarmDetail);
		$(".btnExportCSV").click(exportAlarmDetailCSV);
		$(".btnExportPDF").click(exportAlarmDetailPDF);
		var width = 0;
		if(Math.round(6 * parent.screenWidth/7) - 25 >= 1500) {
			width = 'auto';
		}else {
			width = 1500;
			$('#sysuserLogDate').css('width','1540px');
		}
		var flag = true;
		if(parent.myUserRole.hasLine()){
			flag = false;
		}
		$("#alarmDetailTable").flexigrid({
			url: "StandardReportSlipStationAction_detail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.rule_line, name : 'lineName', width : 120, sortable : false, align: 'center', hide : flag},
				{display: parent.lang.direction, name : 'direction', width : 60, sortable : false, align: 'center', hide : flag},
				{display: parent.lang.plate_number, name : 'vehiIdno', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_plate_color, name : 'plateType', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.driver_name, name : 'driverName', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.line_station_name, name : 'station', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_sliptsation_time, name : 'armTime', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_speed, name : 'speed', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.report_lichengCurrent, name : 'liCheng', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_youLiangCurrent, name : 'youLiang', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_last_station, name : 'lastStation', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_last_station_time, name : 'lastTime', width : 120, sortable : false, align: 'center'}
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

function loadAlarmDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_sliptsation_detail);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryAlarmDetail() {
	var query = searchOpt.getQueryDataNew(true);
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
	if(name == 'direction'){
		if(row[name] == 0){
			pos = parent.lang.line_up;
		}else{
			pos = parent.lang.line_down;
		}
	}else if(name == 'plateType') {
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
	}else if(name == 'armTime'){
			pos = dateTime2TimeString(row[name]);
	}else if( name == 'lastTime'){
		if(dateTime2TimeString(row[name]) == '1970-01-01 08:00:00'){
			pos = "";
		}else{
			pos = dateTime2TimeString(row[name]);
		}
	}else if(name == 'speed') {
		pos = gpsGetSpeed(row[name], 1);
	}else if(name == 'liCheng'){
		pos = gpsGetLiCheng(row[name]);
	}else if(name == 'youLiang'){
		pos = gpsGetYouLiang(row[name]);
	}else {
		pos = changeNull(row[name]);
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
	document.reportForm.action = "StandardReportSlipStationAction_detailExcel.action?exportType="+exportType+"&toMap="+toMap+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val();
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
	armType.push({id:'driving',name:parent.lang.all});
	armType.push({id:'overSpeed',name:parent.lang.alarm_type_overspeed});
	armType.push({id:'cmsOverSpeed',name:parent.lang.alarm_type_overSpeed_platform});
	armType.push({id:'cmsLowSpeed',name:parent.lang.alarm_type_lowSpeed_platform});
	armType.push({id:'cmsParkTooLong',name:parent.lang.alarm_type_parkTooLong_platform});
	armType.push({id:'cmsFatigue',name:parent.lang.alarm_type_fatigue_platform});
	armType.push({id:'nightDriving',name:parent.lang.alarm_type_nightdriving});
	armType.push({id:'drivingTimeou',name:parent.lang.alarm_type_cumulativeDayDrivingTimeout});
	return armType;
}