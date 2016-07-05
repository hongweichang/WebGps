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
		$('#hidden-type').val('io');
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(queryAlarmDetail);
		$(".btnExport").click(exportAlarmDetail);
		$(".btnExportCSV").click(exportAlarmDetailCSV);
		$(".btnExportPDF").click(exportAlarmDetailPDF);
		var width = 0;
		if(Math.round(6 * parent.screenWidth/7) - 25 >= 2020) {
			width = 'auto';
		}else {
			width = 2020;
			$('#sysuserLogDate').css('width','2060px');
		}
		$("#alarmDetailTable").flexigrid({
			url: "StandardReportInvoiceAction_detail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.plate_number, name : 'vehiIdno', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_plate_color, name : 'plateType', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.send_start_time, name : 'sendStartTime', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.send_end_time, name : 'sendEndTime', width : 120, sortable : false, align: 'center'},
				{display: "距离(公里)", name : 'licheng', width : 120, sortable : false, align: 'center'},
				{display: "货物名称", name : 'cargoName', width : 120, sortable : false, align: 'center'},
				{display: "货物重量(kg)", name : 'cargoWeight', width : 80, sortable : false, align: 'center'},
				{display: "单价(元)", name : 'unitPrice', width : 80, sortable : false, align: 'center'},
				{display: "核收费用(元)", name : 'nuclearFees', width : 80, sortable : false, align: 'center'},
				{display: "停车费(元)", name : 'parkingFee', width : 80, sortable : false, align: 'center'},
				{display: "路桥费(元)", name : 'roadToll', width : 80, sortable : false, align: 'center'},
				{display: "代收费用(元)", name : 'collectionCosts', width : 80, sortable : false, align: 'center'}
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
		loadVehicle();
	}
}

function fixHeight() {
	$('#alarmDetailTable').flexFixHeight();
}

function loadAlarmDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text("派车单明细报表");
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

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
		name: 'handleStatus',
		value: $('#hidden-handleStatus').val()
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
	if(name == 'vehiIdno') {
		pos = row['vehicle'].vehiIDNO;
	}else if(name == 'plateType') {
		switch (parseIntDecimal(row['vehicle'].plateType)) {
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
	}else if(name == 'sendStartTime'){
			pos = dateTime2TimeString(row[name]);
	}else if( name == 'sendEndTime'){
		if(dateTime2TimeString(row[name]) == '1970-01-01 08:00:00'){
			pos = "";
		}else{
			pos = dateTime2TimeString(row[name]);
		}
	}else if(name == 'licheng') {
		if(row['endLiCheng'] && row['startLiCheng']){
			var end = row['endLiCheng'];
			var start = row['startLiCheng'];
			var licheng = parseFloat(end) - parseFloat(start);
			pos = licheng.toString().fixed(2);
		}else{
			pos = "";
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
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	document.reportForm.action = "StandardReportInvoiceAction_detailExcel.action?exportType="+exportType+"&toMap="+toMap+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val()+"&maintype=io";
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

function getArmTypes() {
	var armType = [];
	armType.push({id:'io',name:parent.lang.all});
	armType.push({id:'io1',name:parent.lang.report_alarm_type_io1});
	armType.push({id:'io2',name:parent.lang.report_alarm_type_io2});
	armType.push({id:'io3',name:parent.lang.report_alarm_type_io3});
	armType.push({id:'io4',name:parent.lang.report_alarm_type_io4});
	armType.push({id:'io5',name:parent.lang.report_alarm_type_io5});
	armType.push({id:'io6',name:parent.lang.report_alarm_type_io6});
	armType.push({id:'io7',name:parent.lang.report_alarm_type_io7});
	armType.push({id:'io8',name:parent.lang.report_alarm_type_io8});
	armType.push({id:'io9',name:parent.lang.report_alarm_type_io9});
	armType.push({id:'io10',name:parent.lang.report_alarm_type_io10});
	armType.push({id:'io11',name:parent.lang.report_alarm_type_io11});
	armType.push({id:'io12',name:parent.lang.report_alarm_type_io12});
	return armType;
}