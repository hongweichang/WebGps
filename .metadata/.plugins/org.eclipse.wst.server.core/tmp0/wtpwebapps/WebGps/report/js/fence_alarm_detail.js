$(document).ready(function(){
	setTimeout(loadFenceDetailPage, 50);
});

var searchOpt = new searchOption(false, true);
var markerList = null;

$(function() {
	$('.editable-select').editableSelect(
	{
		bg_iframe: true,
		onSelect: function(list_item) {
				
			},
		items_then_scroll: 10
		}
	);	
	searchOpt.initDeviceQuery();
}); 

function loadFenceDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadFenceDetailPage, 50);
	} else {
		//加载语言
		loadFenceAlarmDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryFenceAlarmDetail);
		$("#btnExport").click(exportFenceAlarmDetail);
		$("#btnExportCsv").click(exportFenceAlarmDetailCsv);
		$("#btnExportPdf").click(exportFenceAlarmDetailPdf);
		//初始化区域报警类型选项
		$("#alarmType").append("<option value='0' selected>" + parent.lang.all + "</option>");
		$("#alarmType").append("<option value='27'>" + parent.lang.report_fence_in + "</option>");
		$("#alarmType").append("<option value='28'>" + parent.lang.report_fence_out + "</option>");
		$("#alarmType").append("<option value='29'>" + parent.lang.report_fence_inOverspeed + "</option>");
		$("#alarmType").append("<option value='30'>" + parent.lang.report_fence_outOverspeed + "</option>");
		$("#alarmType").append("<option value='31'>" + parent.lang.report_fence_inLowspeed + "</option>");
		$("#alarmType").append("<option value='32'>" + parent.lang.report_fence_outLowspeed + "</option>");
		$("#alarmType").append("<option value='33'>" + parent.lang.report_fence_inPark + "</option>");
		$("#alarmType").append("<option value='34'>" + parent.lang.report_fence_outPark + "</option>");
		//加载区域信息
		$("#markerList").append("<option value='0' selected>" + parent.lang.all + "</option>");
		ajaxLoadMarker();
		
		$("#fenceAlarmDetailTable").flexigrid({
			url: "ReportFenceAction_alarmDetail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'armTimeStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_fence_marker, name : 'param1', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_ioinType, name : 'armType', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_positionCurrent, name : 'position', width : 250, sortable : false, align: 'center'}
				],
//			sortname: "devIdno",
//			sortorder: "asc",
			pernumber: parent.lang.pernumber,
			pagestat: parent.lang.pagestatInfo,
			pagefrom: parent.lang.pagefrom,
			pagetext: parent.lang.page,
			pagetotal: parent.lang.pagetotal,
//					checkbox: true,
			findtext: parent.lang.find,
			procmsg: parent.lang.procmsg,
			nomsg : parent.lang.nomsg,
			usepager: true,
			autoload: false,
			title: parent.lang.report_navFenceAlarmDetail,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function ajaxLoadMarker() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("ReportFenceAction_markerLists.action", function(json,action,success){
		if (success) {
			markerList = json.markers;
			for (var i = 0; i < markerList.length; i += 1) {
				if (markerList[i].markerType != 1) {
					$("#markerList").append("<option value='" + markerList[i].id + "'>" + markerList[i].name + "</option>");
				}
			}
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function getFenceAlarmName(armType) {
	var ret = "";
	switch(armType) {
	case 27:
	case 77:
		ret = parent.lang.report_fence_in;
		break;
	case 28:
	case 78:
		ret = parent.lang.report_fence_out;
		break;
	case 31:
	case 81:
		ret = parent.lang.report_fence_inLowspeed;
		break;
	case 32:
	case 82:
		ret = parent.lang.report_fence_outLowspeed;
		break;
	case 29:
	case 79:
		ret = parent.lang.report_fence_inOverspeed;
		break;
	case 30:
	case 80:
		ret = parent.lang.report_fence_outOverspeed;
		break;
	case 33:
	case 83:
		ret = parent.lang.report_fence_inPark;
		break;
	case 34:
	case 84:
		ret = parent.lang.report_fence_outPark;
		break;
	}
	return ret;
}

function getMarkerName(id) {
	var ret = "";
	if (markerList !== null) {
		for(var i = 0; i < markerList.length; i += 1) {
			if (markerList[i].id == id) {
				ret = markerList[i].name;
				break;
			}
		}
	}
	return ret;
} 

function loadFenceAlarmDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navFenceAlarmDetail);
	$("#labelAlarmType").text(parent.lang.report_labelIoinType);
	$("#labelMarker").text(parent.lang.report_fence_labelMarker);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
	diableInput("#alarmType", disable, true);
	diableInput("#markerList", disable, true);
}

function queryFenceAlarmDetail() {
	var query = searchOpt.getQueryData(false);
	if (query === null) {
		return ;
	}
	
	searchOpt.requireParam.devIdnos = query.deviceList.toString();
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
		name: 'armType',
		value: $("#alarmType").val()
	});
	params.push({
		name: 'markerId',
		value: $("#markerList").val()
	});
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	$('#fenceAlarmDetailTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if(name == 'armTime'){
		pos = dateTime2TimeString(row[name]);
	}else if(name == 'param1') {
		pos = getMarkerName(row[name]);
	}else if (name == 'armType') {
		var armType = row[name];
		var temp = getFenceAlarmName(armType);
		if (armType >= 1 && armType <= 50) {
			pos =temp +"  "+ parent.lang.report_alarmBegin;
		} else {
			pos =temp +"  "+ parent.lang.report_alarmEnd;
		}	
	}else if (name == 'position') {
		if(parent.showLocation == "true"){
			pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + gpsGetVehicleName(row['devIdno']) + "', '" + row['jingDu'] + "', '" + row['weiDu'] + "');\">" + changeNull(row[name]) + "</a>";
		} else {
			if(row['jingDu'] == 0 || row['weiDu'] == 0){
				pos = "";
			}else{
				pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + gpsGetVehicleName(row['devIdno']) + "', '" + row['jingDu'] + "', '" + row['weiDu'] + "');\">" + gpsGetPosition(row['jingDu'], row['weiDu'], 1) + "</a>";
			}
		}
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function exportReport(exportType) {
	var query = searchOpt.getQueryData(false);
	if (query === null) {
		return ;
	}
	$("#devIdnos").val(query.deviceList.toString());
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	document.reportForm.action = "ReportFenceAction_detailExcel.action?type=alarm&toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportFenceAlarmDetail() {
	exportReport(1);
}

function exportFenceAlarmDetailCsv() {
	exportReport(2);
}

function exportFenceAlarmDetailPdf() {
	exportReport(3); 
}