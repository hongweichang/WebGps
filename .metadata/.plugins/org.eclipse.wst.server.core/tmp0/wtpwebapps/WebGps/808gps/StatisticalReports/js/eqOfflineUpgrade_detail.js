$(document).ready(function(){
	setTimeout(loadOfflineUpgradeDetailPage, 50);
});

var searchOpt = new searchOption(false, true);
var markerList = null; 

function loadOfflineUpgradeDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadOfflineUpgradeDetailPage, 50);
	} else {
		buttonQueryOrExport();
		$('#select-completion').flexPanel({
			ComBoboxModel :{
				button :
				[
					[{
						display: parent.lang.all, name : 'completion', pid : 'completion', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]
				],
				combox: {name : 'completion', option : arrayToStr(getCompletions())}
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
		loadOfflineUpgradeDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(queryOfflineUpgradeDetail);
		$(".btnExport").click(exportOfflineUpgradeDetail);
		$(".btnExportCSV").click(exportOfflineUpgradeDetailCSV);
		$(".btnExportPDF").click(exportOfflineUpgradeDetailPDF);
		var width = 0;
		if(parent.screenWidth >= 1360) {
			width = 'auto';
		}else {
			width = 1060;
			$('#sysuserLogDate').css('width','1100px');
		}
		$("#eqOfflineUpgradeDetailTable").flexigrid({
			url: "StandardReportDeviceOflTaskLogAction_daily.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.plate_number, name : 'vehiIdno', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_plate_color, name : 'plateType', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.device_number, name : 'devIdno', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.versionName, name : 'dtVerName', width : 150, sortable : false, align: 'center'},	//版本名称
				{display: parent.lang.versionNumber, name : 'dtVersion', width : 200, sortable : false, align: 'center'},	//版本号
				{display: parent.lang.taskTime, name : 'dtCreateTask', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.executionTime, name : 'dtEndTask', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.completion, name : 'nTaskStatus', width : 120, sortable : false, align: 'center'}
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
	$('#eqOfflineUpgradeDetailTable').flexFixHeight();
}

function loadOfflineUpgradeDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_equipment_offlineRecordingEquipmentUpgrade);
	$("#labelCompletion").text(parent.lang.completion);
	$("#labelDevVerNum").text(parent.lang.report_labelVersionNumber);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryOfflineUpgradeDetail() {
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
		name: 'nTaskStatus',
		value: $("#hidden-completion").val()
	});
	params.push({
		name: 'nFileType',
		value: 2
	});
	params.push({
		name: 'devVerNum',
		value: $("#devVerNum").val()
	});
	$('#eqOfflineUpgradeDetailTable').flexOptions(
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
	}else if(name == 'dtCreateTask'){
		pos = dateTime2TimeString(row[name]);
	}else if(name == 'dtEndTask') {
		if (row["nTaskStatus"] != 0){
			pos = dateTime2TimeString(row[name]);
		}
	}else if(name == 'dtVersion') {
		if(row["strParam"].split(',').length > 0) {
			pos = row["strParam"].split(',')[0];
		}
	}else if(name == 'dtVerName') {
		if(row["strParam"].split(',').length > 1) {
			pos = row["strParam"].split(',')[1];
		}
	}else if(name == 'nTaskStatus'){
		var status = row[name];
		if(status == 0){
			pos = parent.lang.notPerformed;
		}else if(status == 1){
			pos = parent.lang.taskExecution;
		}else if(status == 2){
			pos = parent.lang.taskCompletion;
		}else if(status == 3){
			pos = parent.lang.taskFails;
		}
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
	$("#nFileType").val(2);
	document.reportForm.action = "StandardReportDeviceOflTaskLogAction_detailExcel.action?type=oflTaskLog&exportType="+exportType+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val();
	document.reportForm.submit(); 
}
//导出至excel，导出至csv，导出至pdf
function exportOfflineUpgradeDetail() {
	exportReport(1);
}

function exportOfflineUpgradeDetailCSV() {
	exportReport(2);
}

function exportOfflineUpgradeDetailPDF() {
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

function getCompletions() {
	var completions = [];
	completions.push({id:'5',name:parent.lang.all});
	completions.push({id:'0',name:parent.lang.notPerformed});
	completions.push({id:'2',name:parent.lang.taskCompletion});
	return completions;
}