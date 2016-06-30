$(document).ready(function(){
	setTimeout(loadTrackDetailPage, 50);
});

var searchOpt = new searchOption(false, true, true);

function loadTrackDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadTrackDetailPage, 50);
	} else {
		buttonQueryOrExport();
		$('#selectName').flexPanel({
			InputModel : {display: parent.lang.selectVehicleTip,value:'',name : 'vehiIdnos', pid : 'vehiIdnos', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
		});
		
		$('#selecttime').flexPanel({
			ComBoboxModel :{
				input : {name : 'selecttime',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'selecttime', option : arrayToStr(getSelectTime(2))}
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
		loadTrackDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(queryTrackDetail);
		$(".btnExport").click(exportTrackDetail);
		$(".btnExportCSV").click(exportTrackDetailCSV);
		$(".btnExportPDF").click(exportTrackDetailPDF);
		var width = 0;
		if(parent.screenWidth >= 970) {
			width = 'auto';
		}else {
			width = 970;
			$('#sysuserLogDate').css('width','1010px');
		}
		
		$("#trackDetailTable").flexigrid({
			url: "StandardReportTpmsAlarmAction_track.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.plate_number, name : 'vehiIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_plate_color, name : 'plateType', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'gpsTime', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.tire_pressure_monitoring_information, name : 'tireInfoDesc', width : 600, sortable : false, align: 'center', hide: false},
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
	$('#trackDetailTable').flexFixHeight();
}

function loadTrackDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.tire_pressure_monitoring_trackDetail);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryTrackDetail() {
	var query = searchOpt.getQueryDataNew(true);
	if (query === null) {
		return ;
	}
	if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
		alert(parent.lang.report_selectVehiNullErr);
		return;
	}
	var params = [];
	params.push({
		name: 'begintime',
		value: query.begindate
	});
	params.push({
		name: 'endtime',
		value: query.enddate
	});	
	params.push({
		name: 'distance',
		value: gpsGetDistanceValue($("#hidden-distance").val())
	});	
	params.push({
		name: 'vehiIdno',
		value: $('#hidden-vehiIdnos').val()
	});	
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	params.push({
		name: 'time',
		value: $("#hidden-time").val()
	});
	//查询列表
	$('#trackDetailTable').flexOptions(
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
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function exportReport(exportType) {
	var query = searchOpt.getQueryDataNew(true);
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
	document.reportForm.action = "StandardReportTpmsAlarmAction_gpstrackExcel.action?toMap="+toMap+"&type=trackDetail&exportType="+exportType+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val();
	document.reportForm.submit();
}
//导出至excel，导出至csv，导出至pdf
function exportTrackDetail() {
	exportReport(1);
}

function exportTrackDetailCSV() {
	exportReport(2);
}

function exportTrackDetailPDF() {
	exportReport(3);
}

var selIds;
//选择车辆
function selVehicle() {
	$.dialog({id:'info', title:parent.lang.selectVehicleTitle,content: 'url:StatisticalReports/selectInfo.html?type=selVehicle&singleSelect=true&isTpms=true',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}

function doSelectVehicle(ids,vehicleList) {
	selIds = ids;
	$('#combox-vehiIdnos').val(vehicleList);
	$('#hidden-vehiIdnos').val(vehicleList);
	$.dialog({id:'info'}).close();
}

function doExit() {
	$.dialog({id:'info'}).close();
}


function getDistances() {
	var distances = [];
	distances.push({id:0,name:0+ gpsGetDistanceUnit(true)});
	distances.push({id:0.01,name:10+ gpsGetDistanceUnit(true)});
	distances.push({id:0.1,name:100+ gpsGetDistanceUnit(true)});
	distances.push({id:0.5,name:500+ gpsGetDistanceUnit(true)});
	distances.push({id:1,name:1+ gpsGetDistanceUnit(false)});
	distances.push({id:3,name:3+ gpsGetDistanceUnit(false)});
	distances.push({id:5,name:5+ gpsGetDistanceUnit(false)});
	distances.push({id:10,name:10+ gpsGetDistanceUnit(false)});
	distances.push({id:30,name:30+ gpsGetDistanceUnit(false)});
	return distances;
}

function getTimes() {
	var times = [];
	times.push({id:0,name:0+parent.lang.report_park_second});
	times.push({id:10,name:10+ parent.lang.report_park_second});
	times.push({id:30,name:30+ parent.lang.report_park_second});
	times.push({id:60,name:60+ parent.lang.report_park_second});
	times.push({id:120,name:120+ parent.lang.report_park_second});
	times.push({id:300,name:300+ parent.lang.report_park_second});
	return times;
}
