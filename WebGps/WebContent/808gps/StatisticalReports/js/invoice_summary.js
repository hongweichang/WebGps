$(document).ready(function(){
	setTimeout(loadAlarmSummaryPage, 50);
});

var searchOpt = new searchOption(false, true);

function loadAlarmSummaryPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadAlarmSummaryPage, 50);
	} else {
		buttonQueryOrExport();
		$('#select-handled').flexPanel({
			ComBoboxModel :{
				button :
				[
					[{
						display: parent.lang.report_alarm_vehicle, name : 'handleStatus', pid : 'handleStatus', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]
				],
				combox: {name : 'handleStatus', option : '0&'+parent.lang.report_alarm_vehicle+'|1&'+parent.lang.report_alarm_company}
			}	
		});
		$('#hidden-handleStatus').val('0');
		
		$('#select-handleStatus .ui-menu-item').each(function(){
			$(this).attr('onclick','changeStructure()');
		});
		if(isBrowseIE7()) {
			$('#hidden-handleStatus').on('input propertychange',function(){
				changeStructure();
			});
		}
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
		loadAlarmSummaryLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(queryAlarmSummary);
		$(".btnExport").click(exportAlarmSummary);
		$(".btnExportCSV").click(exportAlarmSummaryCSV);
		$(".btnExportPDF").click(exportAlarmSummaryPDF);
		var width = 0;
		if(Math.round(6 * parent.screenWidth/7) - 25 >= 820) {
			width = 'auto';
		}else {
			width = 820;
			$('#sysuserLogDate').css('width','860px');
		}
		$("#alarmSummaryTable").flexigrid({
			url: "StandardReportInvoiceAction_summary.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.report_vehiIdno, name : 'vehiIdno', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_plate_color, name : 'plateType', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.report_beginTime, name : 'startTime', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_endTime, name : 'endTime', width : 120, sortable : false, align: 'center'},
				{display: "派车次数", name : 'count', width : 120, sortable : false, align: 'center'},
				{display: "运货重量(kg)", name : 'weight', width : 120, sortable : false, align: 'center'},
				{display: "距离(公里)", name : 'liCheng', width : 120, sortable : false, align: 'center'}
				],
			pernumber: parent.lang.pernumber,
			pagestat: parent.lang.pagestatInfo,
			pagefrom: parent.lang.pagefrom,
			pagetext: parent.lang.page,
			pagetotal: parent.lang.pagetotal,
			findtext: parent.lang.find,
			procmsg: parent.lang.procmsg,
			nomsg : parent.lang.nomsg,
			resizable: false,
			usepager: true,
			autoload: false,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			showToggleBtn: true,
			width: width,
			onSubmit: false,
			height: 'auto'
		});
		loadReportTableWidth(fixHeight);
		loadVehicle();
	}
}

function fixHeight() {
	$('#alarmSummaryTable').flexFixHeight();
}

function loadAlarmSummaryLang(){
	searchOpt.loadLang();
	$("#reportTitle").text("派车单统计报表");
	$("#labelhandled").text(parent.lang.report_alarm_structure);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryAlarmSummary() {
	var query = searchOpt.getQueryDataNew(false);
	if (query === null) {
		return ;
	}
	
	if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
		alert(parent.lang.report_selectVehiNullErr);
		return;
	}
	
	if($('#hidden-handleStatus').val() == '0'){
		if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
			alert(parent.lang.report_selectVehiNullErr);
			return;
		}
	}
	if($('#hidden-handleStatus').val() == '1'){
		if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
			alert(parent.lang.report_selectCompanyNullErr);
			return;
		}
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
		name: 'handleStatus',
		value: $('#hidden-handleStatus').val()
	});
	$('#alarmSummaryTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'vehiIdno') {
		if($('#hidden-handleStatus').val() && $('#hidden-handleStatus').val() == '1'){
			var compnay_ = getParentCompany(parent.vehiGroupList, row[name]);
			if(compnay_.level == 2 || compnay_.level == 3) {
				compnay_ = getParentCompany(parent.vehiGroupList, compnay_.companyId);
			}
			if(compnay_) {
				pos = compnay_.name;
			}else{
				pos = "";
			}
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
	}else if(name == 'startTime'){
			pos = dateTime2TimeString(row[name]);
	}else if( name == 'endTime'){
		if(dateTime2TimeString(row[name]) == '1970-01-01 08:00:00'){
			pos = "";
		}else{
			pos = dateTime2TimeString(row[name]);
		}
	}else if(name == 'liCheng') {
		pos = row[name].toString().fixed(2);
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
	
	if($('#hidden-handleStatus').val() == '0'){
		if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
			alert(parent.lang.report_selectVehiNullErr);
			return;
		}
	}
	if($('#hidden-handleStatus').val() == '1'){
		if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
			alert(parent.lang.report_selectCompanyNullErr);
			return;
		}
	}
	
	document.reportForm.action = "StandardReportAlarmAction_summaryExcel.action?exportType="+exportType+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val()+"&type=io";
	document.reportForm.submit();
}
//导出至excel，导出至csv，导出至pdf
function exportAlarmSummary() {
	exportReport(1);
}

function exportAlarmSummaryCSV() {
	exportReport(2);
}

function exportAlarmSummaryPDF() {
	exportReport(3);
}

var selIds;
//选择车辆
function selVehicle() {
	$.dialog({id:'info', title:parent.lang.selectVehicleTitle,content: 'url:StatisticalReports/selectInfo.html?type=selVehicle&singleSelect=false&selectAll=true&isOil=false&isInvoice=true',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}

function doSelectVehicle(ids,vehicleList) {
	if(ids != null && ids == '0') {
		$('#combox-vehiIdnos').val(parent.lang.all_vehicles);
		$('#hidden-vehiIdnos').val(getNewArrayByArray(invoiceVehicle,'name').toString());
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


function changeStructure(){
	var handled = $('#hidden-handleStatus').val();
	$('#alarmSummaryTable').flexClear();
	if($("#container").css('display') != "none"){
		$("#container").hide();
		$('.flexigrid .bDiv').height($('.flexigrid .bDiv').height() + 256 < 0 ? 0 : $('.flexigrid .bDiv').height() + 256);
	}
	if(handled == '0'){
		$("#labelSelectVehicle").text(parent.lang.labelVehicle);
		$('.hDivBox .vehiIdno div').text(parent.lang.report_vehiIdno);
		$('#selectName').empty();
		$('#selectName').flexPanel({
			InputModel : {display: parent.lang.selectVehicleTip,value:'',name : 'vehiIdnos', pid : 'vehiIdnos', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
		});
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$('#hidden-vehiIdnos').val('');
		$('#toolbar-plateType').show();
		$('.hDiv .plateType').show();
		$('.hDiv .plateType').removeAttr('hidden');
	}else if(handled == '1'){
		$("#labelSelectVehicle").text(parent.lang.labelCompany);
		$('#selectName').empty();
		$('#selectName').flexPanel({
			InputModel : {display: parent.lang.selectCompanyTip,value:'',name : 'vehiIdnos', pid : 'vehiIdnos', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
		});
		$('#combox-vehiIdnos').on('click keyup',selCompany);
		$('.hDivBox .vehiIdno div').text(parent.lang.company_name);
		$('#toolbar-plateType').hide();
		$('.hDiv .plateType').hide();
		$('.hDiv .plateType').attr('hidden', 'hidden');
	}
}

var selIds;
//选择公司
function selCompany() {
	$.dialog({id:'info', title:parent.lang.selectCompanyTitle,content: 'url:StatisticalReports/selectInfo.html?type=selCompany&singleSelect=false&selectAll=true&level=0',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}

var invoiceVehicle = new Array();;

function loadVehicle(){
	$.myajax.jsonGet('StandardVehicleAction_loadSendInvoiceVehicles.action', function(json,action,success){
		if(success) {
			vehicleList = json.vehicles;
			for (var i = 0; i < vehicleList.length; i++) {
				invoiceVehicle.push(vehicleList[i]);
			}
		};
	}, null);
}

function doSelectCompany(ids,companyList) {
	if(ids != null && ids == '0') {
		$('#combox-vehiIdnos').val(parent.lang.all_companies);
		$('#hidden-vehiIdnos').val(getNewArrayByArray(parent.vehiGroupList,'id').toString());
	}else {
		selIds = ids;
		if(ids != null && ids.split(',').length > 0) {
			if(ids.split(',').length > 1) {
				$('#combox-vehiIdnos').val(parent.lang.isSelected + ids.split(',').length);
			}else {
				$('#combox-vehiIdnos').val(companyList);
			}
		}
		$('#hidden-vehiIdnos').val(ids);
	}
	$.dialog({id:'info'}).close();
}