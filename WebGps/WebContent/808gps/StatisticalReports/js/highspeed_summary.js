$(document).ready(function(){
	setTimeout(loadFenceSummaryPage, 50);
});

var searchOpt = new searchOption(false, true);

function loadFenceSummaryPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadFenceSummaryPage, 50);
	} else {
		buttonQueryOrExport();
		$('#selectName').flexPanel({
			InputModel : {display: parent.lang.selectVehicleTip,value:'',name : 'vehiIdnos', pid : 'vehiIdnos', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
		});
		
		$('#selecttime').flexPanel({
			ComBoboxModel :{
				input : {name : 'selecttime',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'selecttime', option : arrayToStr(getSelectTime(4))}
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
		
		enterDigital($('#alarmTime'));
		enterDigital($('#speed'));
		enterDigital($('#rate'));
		$('#alarmTime').blur(function(){
			if($('#alarmTime').val() < 10){
				$('#alarmTime').val(10)
			}else if($('#alarmTime').val() > 600){
				$('#alarmTime').val(600)
			}
		});
		$('#speed').blur(function(){
			if($('#speed').val() < 10){
				$('#speed').val(10)
			}else if($('#speed').val() > 200){
				$('#speed').val(200)
			}
		});
		$('#rate').blur(function(){
			if($('#rate').val() < 0){
				$('#rate').val(10)
			}else if($('#rate').val() > 100){
				$('#rate').val(100)
			}
		});
		$('#alarmTime').val(10);
		$('#speed').val(30);
		$('#rate').val(0);
		//加载语言
		loadFenceSummaryLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(queryFenceSummary);
		$(".btnExport").click(exportFenceSummary);
		$(".btnExportCSV").click(exportFenceSummaryCSV);
		$(".btnExportPDF").click(exportFenceSummaryPDF);
		
		var width = 0;
		if(Math.round(6 * parent.screenWidth/7) - 25 >= 780) {
			width = 'auto';
		}else {
			width = 780;
			$('#sysuserLogDate').css('width','820px');
		}
		var flag = true;
		if(parent.myUserRole.hasLine()){
			flag = false;
		}
		$("#fenceSummaryTable").flexigrid({
			url: "StandardReportLineAlarmAction_summary.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.rule_line, name : 'line', width : 120, sortable : false, align: 'center', hide : flag},
				{display: parent.lang.report_vehiIdno, name : 'vehiIdno', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_plate_color, name : 'plateType', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.report_beginTime, name : 'beginTime', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_endTime, name : 'endTime', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_alarm_count_number, name : 'count', width : 200, sortable : false, align: 'center'}
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
	$('#fenceSummaryTable').flexFixHeight();
}

function loadFenceSummaryLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_overspeed_summary);
	$("#selectAlarmTime").text(parent.lang.speeding_length);
	$("#selectSpeed").text(parent.lang.speed_limit+parent.lang.labelKmPerHour);
	$("#selectRate").text(parent.lang.super_rate);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryFenceSummary() {
	var query = searchOpt.getQueryDataNew(false);
	if (query === null) {
		return ;
	}
	if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
		alert(parent.lang.report_selectVehiNullErr);
		return;
	}
	if($('#alarmTime').val() == null || $('#alarmTime').val() == ''){
		$.dialog.tips(parent.lang.speeding_length_tip, 2);
		return;
	}
	if($('#speed').val() == null || $('#speed').val() == ''){
		$.dialog.tips(parent.lang.speed_limit_tip, 2);
		return;
	}
	if($('#rate').val() == null || $('#rate').val() == ''){
		$.dialog.tips(parent.lang.super_rate_tip, 2);
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
		name: 'alarmTime',
		value: $('#alarmTime').val()
	});
	params.push({
		name: 'speed',
		value: $('#speed').val()
	});
	params.push({
		name: 'rate',
		value: $('#rate').val()
	});
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	$('#fenceSummaryTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'line'){
		pos = getArrayName(parent.vehiLineList, row['companyId']);
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
	}else if(name == 'beginTime'){
			pos = dateTime2TimeString(row[name]);
	}else if( name == 'endTime'){
		if(dateTime2TimeString(row[name]) == '1970-01-01 08:00:00'){
			pos = "";
		}else{
			pos = dateTime2TimeString(row[name]);
		}
	}else if(name == 'count'){
			pos = row[name];
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
	if($('#alarmTime').val() == null || $('#alarmTime').val() == ''){
		$.dialog.tips(parent.lang.speeding_length_tip, 2);
		return;
	}
	if($('#speed').val() == null || $('#speed').val() == ''){
		$.dialog.tips(parent.lang.speed_limit_tip, 2);
		return;
	}
	if($('#rate').val() == null || $('#rate').val() == ''){
		$.dialog.tips(parent.lang.super_rate_tip, 2);
		return;
	}
	document.reportForm.action = "StandardReportLineAlarmAction_summaryExcel.action?exportType="+exportType+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val();
	document.reportForm.submit();  
}
//导出至excel，导出至csv，导出至pdf
function exportFenceSummary() {
	exportReport(1);
}

function exportFenceSummaryCSV() {
	exportReport(2);
}

function exportFenceSummaryPDF() {
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