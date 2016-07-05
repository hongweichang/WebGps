$(document).ready(function(){
	setTimeout(loadFenceAccessDetailPage, 50);
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

function loadFenceAccessDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadFenceAccessDetailPage, 50);
	} else {
		//加载语言
		loadFenceAccessDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryFenceAccessDetail);
		$("#btnExport").click(exportFenceAccessDetail);
		$("#btnExportCsv").click(exportFenceAccessDetailCsv);
		$("#btnExportPdf").click(exportFenceAccessDetailPdf);
		//加载区域信息
		$("#markerList").append("<option value='0' selected>" + parent.lang.all + "</option>");
		ajaxLoadMarker();
		
		$("#fenceAccessDetailTable").flexigrid({
			url: "ReportFenceAction_accessDetail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_fence_marker, name : 'param1', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_fence_inTime, name : 'armTimeStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_fence_inPosition, name : 'position', width : 250, sortable : false, align: 'center'},
				{display: parent.lang.report_fence_outTime, name : 'outTime', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_fence_outPosition, name : 'position2', width : 250, sortable : false, align: 'center'},
				{display: parent.lang.report_fence_remainTime, name : 'param4', width : 120, sortable : false, align: 'center'}
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
			title: parent.lang.report_navFenceAccessDetail,
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

function loadFenceAccessDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navFenceAccessDetail);
	$("#labelTime").text(parent.lang.report_fence_labelTime);
	$("#labelMarker").text(parent.lang.report_fence_labelMarker);
	$("#spanTimeTip").text(parent.lang.report_fence_timeTip);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
	diableInput("#parkTime", disable, true);
	diableInput("#markerList", disable, true);
}

function queryFenceAccessDetail() {
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
		name: 'parkTime',
		value: $("#parkTime").val()
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
	$('#fenceAccessDetailTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if(name == 'armTime'){
		pos = dateTime2TimeString(row[name]);
	}else if(name == 'outTime') {
		pos = dateTime2TimeString(row['armTime'] + row['param4'] * 1000);
	}else if(name == 'param4'){
		pos = gpsFormatSecond2Time(row[name]);
	}else if(name == 'param1') {
		pos = getMarkerName(row[name]);
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
	}else if(name == 'position2') {
		if(parent.showLocation == "true"){
			pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + gpsGetVehicleName(row['devIdno']) + "', '" + row['param2'] + "', '" + row['param3'] + "');\">" + changeNull(row[name]) + "</a>";
		} else {
			if(row['param2'] == 0 || row['param3'] == 0){
				pos = "";
			}else{
				pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + gpsGetVehicleName(row['devIdno']) + "', '" + row['param2'] + "', '" + row['param3'] + "');\">" + gpsGetPosition(row['param2'], row['param3'], 1) + "</a>";
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
	document.reportForm.action = "ReportFenceAction_detailExcel.action?type=access&toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportFenceAccessDetail() {
	exportReport(1);
}

function exportFenceAccessDetailCsv() {
	exportReport(2);
}

function exportFenceAccessDetailPdf() {
	exportReport(3);
}