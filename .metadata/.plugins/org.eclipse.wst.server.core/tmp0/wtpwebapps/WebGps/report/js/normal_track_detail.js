$(document).ready(function(){
	setTimeout(loadTrackDetailPage, 50);
});

var searchOpt = new searchOption(false, true, true);

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

function loadTrackDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadTrackDetailPage, 50);
	} else {
		//加载语言
		loadTrackDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryTrackDetail);
		$("#btnExport").click(exportTrackDetail);
		$("#btnExportCsv").click(exportTrackDetailCsv);
		$("#btnExportPdf").click(exportTrackDetailPdf);
		gpsInitDistance("#distance");
		
		$("#trackDetailTable").flexigrid({
			url: "ReportNormalAction_track.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'gpsTime', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_normal_lichengTotal + gpsGetLabelLiChengUnit(), name : 'liCheng', width : 100, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_positionCurrent, name : 'position', width : 250, sortable : false, align: 'center'},
				{display: parent.lang.report_speed + gpsGetLabelSpeedUnit(), name : 'speed', width : 200, sortable : false, align: 'center'}
				],
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
			title: parent.lang.report_navNormalTrackDetail,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function loadTrackDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navNormalTrackDetail);
	$("#labelDistance").text(parent.lang.report_labelDistance);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryTrackDetail() {
	var query = searchOpt.getQueryData(true);
	if (query === null) {
		return ;
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
		value: gpsGetDistanceValue($("#distance").val())
	});	
	params.push({
		name: 'devIdno',
		value: query.device
	});	
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	$('#trackDetailTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
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
	}else if((name == 'liCheng')){
		pos = gpsGetLiCheng(row[name]);
	}else if(name == 'speed') {
		pos = gpsGetSpeed(row[name], row['status1']);
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function exportReport(exportType) {
	var query = searchOpt.getQueryData(true);
	if (query === null) {
		return ;
	}
	$("#devIdnos").val(query.device.toString());
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	document.reportForm.action = "ReportNormalAction_gpstrackExcel.action?toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportTrackDetail() {
	exportReport(1);
}

function exportTrackDetailCsv() {
	exportReport(2);
}

function exportTrackDetailPdf() {
	exportReport(3);
}
