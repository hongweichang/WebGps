var graph,contain,options,gdata;
var isGraph = false;
$(document).ready(function(){
	setTimeout(loadOilSummaryPage, 50);
});

var searchOpt = new searchOption(false, false);

function loadOilSummaryPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadOilSummaryPage, 50);
	} else {
		buttonQueryOrExport();
		$('#toolbar-graph').flexPanel({
			ButtonsModel : [
				[{display: '', name : 'to-image', pclass : 'toImage',
					bgcolor : 'gray', hide : false}],
				/*[{display: '', name : 'download-image', pclass : 'downloadImage',
					bgcolor : 'gray', hide : false}],*/
				[{display: '', name : 'reset-image', pclass : 'resetImage',
					bgcolor : 'gray', hide : false}]
			]
		});
		$('#toolbar-graph .y-btn').each(function() {
			$(this).attr('onclick',"CurrentExample('"+$(this).attr('data-cn')+"')");
		});
		$('#selectName').flexPanel({
			InputModel : {display: parent.lang.selectVehicleTip,value:'',name : 'vehiIdnos', pid : 'vehiIdnos', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
		});
		
		$('#selecttime').flexPanel({
			ComBoboxModel :{
				input : {name : 'selecttime',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'selecttime', option : arrayToStr(getSelectTime(3))}
			}	
		});
		
		$('#select-selecttime li').each(function() {
			var index= $(this).attr('data-index');
			$(this).on('click',function() {
				selectTime(index, 3);
			});
			if(index == 0) {
				$(this).click();
			}
		});
		
		//加载语言
		loadOilExceptionDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(queryOilExceptionDetail);
		$(".btnExport").click(exportOilExceptionDetail);
		$(".btnExportCSV").click(exportOilExceptionDetailCSV);
		$(".btnExportPDF").click(exportOilExceptionDetailPDF);
		var width = 0;
		if(parent.screenWidth >= 1480) {
			width = 'auto';
		}else {
			width = 1480;
			$('#sysuserLogDate').css('width','1490px');
		}
		$("#oilExceptionDetailTable").flexigrid({
			url: "StandardReportOilAction_summary.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.driver_name, name : 'driver', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.plate_number, name : 'vehiIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_plate_color, name : 'plateType', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.begintime, name : 'startTime', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.endtime, name : 'endTime', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_start_oil, name : 'startYouLiang', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_end_oil, name : 'endYouLiang', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_licheng_all, name : 'liCheng', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_oil_all, name : 'youLiang', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_oil_add, name : 'addYouLiang', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_oil_fuel, name : 'fuelYou', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_time, name : 'workTime', width : 120, sortable : false, align: 'center'}
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
	$('#oilExceptionDetailTable').flexFixHeight();
}

function loadOilExceptionDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navOilSummary);
	$("#labeOilType").text(parent.lang.report_labelLoginType);
	$("#download-instructions").text(parent.lang.download_instructions);
}

function queryOilExceptionDetail() {
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
		name: 'oilType',
		value: $("#hidden-oilType").val()
	});
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	if(isGraph) {
		queryGraph(params);
	}else {
		$('#oilExceptionDetailTable').flexOptions(
				{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
	}
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
	}else if(name == 'startTime'){
		pos = dateTime2TimeString(row[name]);
	}else if( name == 'endTime'){
		if(dateTime2TimeString(row[name]) == '1970-01-01 08:00:00'){
			pos = "";
		}else{
			pos = dateTime2TimeString(row[name]);
		}
	}else if(name == 'liCheng'){
		pos = gpsGetLiCheng(row[name]);
	}else if((name == 'startYouLiang') || (name == 'endYouLiang') || (name == 'youLiang') || (name == 'addYouLiang')){
		pos = gpsGetYouLiang(row[name]);
	}else if(name == 'fuelYou'){
		if(row['liCheng'] != 0){
			pos = (gpsGetYouLiang(row['youLiang'])*100/gpsGetLiCheng(row['liCheng'])).toFixed(2);
		}else{
			pos = "0.00";
		}
	}else if(name == 'workTime'){
		pos = gpsFormatSecond2Time(row[name]);
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
	document.reportForm.action = "StandardReportOilAction_summaryExcel.action?toMap="+toMap+"&exportType="+exportType+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val();
	document.reportForm.submit(); 
}
//导出至excel，导出至csv，导出至pdf
function exportOilExceptionDetail() {
	exportReport(1);
}

function exportOilExceptionDetailCSV() {
	exportReport(2);
}

function exportOilExceptionDetailPDF() {
	exportReport(3);
}

var selIds;
//选择车辆
function selVehicle() {
	$.dialog({id:'info', title:parent.lang.selectVehicleTitle,content: 'url:StatisticalReports/selectInfo.html?type=selVehicle&singleSelect=false&selectAll=true&isOil=true',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}

function doSelectVehicle(ids,vehicleList) {
	if(ids != null && ids == '0') {
		$('#combox-vehiIdnos').val(parent.lang.all_vehicles);
		$('#hidden-vehiIdnos').val(getNewArrayByArray(parent.vehiOilList,'name').toString());
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