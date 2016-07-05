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
		if(Math.round(6 * parent.screenWidth/7) - 25 >= 1030) {
			width = 'auto';
		}else {
			width = 1030;
			$('#sysuserLogDate').css('width','990px');
		}
		$("#alarmSummaryTable").flexigrid({
			url: "StandardReportTempAction_summary.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.report_vehiIdno, name : 'vehiIdno', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_plate_color, name : 'plateType', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.report_beginTime, name : 'beginTime', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_endTime, name : 'endTime', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_probe_no, name : 'vehiColor', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_ultrahigh_temperature, name : 'count', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_UHT_long_time, name : 'countStr', width : 110, sortable : false, align: 'center'},
				{display: parent.lang.report_ultralow_temperature, name : 'count1', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.report_Ultralow_temperature, name : 'armTypeStr', width : 120, sortable : false, align: 'center'}
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
			singleSelect: true,
			idProperty: 'vehiIdno',
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			showToggleBtn: true,
			width: width,
			onSubmit: false,
			onSuccess: loadSuccess,
			height: 'auto'
		});
		loadReportTableWidth(fixHeight);
	}
}

function fixHeight() {
	$('#alarmSummaryTable').flexFixHeight();
}

var alarmSumList = new Array();
function loadSuccess() {
	var data = $("#alarmSummaryTable").flexGetData();
	if(data && data.rows) {
		alarmSumList = data.rows;
	}
}

function loadAlarmSummaryLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_temp_summary);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryAlarmSummary() {
	var query = searchOpt.getQueryDataNew(false);
	if (query === null) {
		return ;
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
	$('#alarmSummaryTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'vehiIdno') {
		var vehiIdno = row['vehiIdno'];
		if(vehiIdno){
			pos = vehiIdno.split(',')[0];
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
	}else if(name == 'beginTime'){
		pos = dateTime2TimeString(row[name]);
	}else if( name == 'endTime'){
		if(dateTime2TimeString(row[name]) == '1970-01-01 08:00:00'){
			pos = "";
		}else{
			pos = dateTime2TimeString(row[name]);
		}
	}else if(name == 'armInfo'){
		pos = Number(row[name] + 1);
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
	
	document.reportForm.action = "StandardReportTempAction_summaryExcel.action?exportType="+exportType+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val();
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
	$.dialog({id:'info', title:parent.lang.selectVehicleTitle,content: 'url:StatisticalReports/selectInfo.html?type=selVehicle&singleSelect=false&selectAll=true&isOil=false&isTemp=true',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}

function doSelectVehicle(ids,vehiTempList) {
	if(ids != null && ids == '0') {
		$('#combox-vehiIdnos').val(parent.lang.all_vehicles);
		$('#hidden-vehiIdnos').val(getNewArrayByArray(parent.vehiTempList,'name').toString());
	}else {
		selIds = ids;
		if(ids != null && ids.split(',').length > 0) {
			if(ids.split(',').length > 1) {
				$('#combox-vehiIdnos').val(parent.lang.isSelected + ids.split(',').length);
			}else {
				$('#combox-vehiIdnos').val(vehiTempList);
			}
		}
		$('#hidden-vehiIdnos').val(vehiTempList);
	}
	$.dialog({id:'info'}).close();
}

function doExit() {
	$.dialog({id:'info'}).close();
}