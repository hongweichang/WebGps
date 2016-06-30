$(document).ready(function(){
	setTimeout(loadIoinDetailPage, 50);
});

var searchOpt = new searchOption(false, true);

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

function loadIoinDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadIoinDetailPage, 50);
	} else {
		//加载语言
		loadIoinDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryIoinDetail);
		$("#btnExport").click(exportIoinDetail);
		$("#btnExportCsv").click(exportIoinDetailCsv);
		$("#btnExportPdf").click(exportIoinDetailPdf);
		//初始化登录类型选项
		$("#ioinType").append("<option value='0' selected>" + parent.lang.all + "</option>");
		for (var i = 1; i <= 12; i += 1) {
			$("#ioinType").append("<option value='" + i + "'>" + parent.lang.report_ioin + i + "</option>");
		}
		
		$("#ioinDetailTable").flexigrid({
			url: "ReportIoinAction_detail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'armTimeStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_positionCurrent, name : 'position', width : 250, sortable : false, align: 'center'},
				{display: parent.lang.report_ioinType, name : 'ioinType', width : 100, sortable : false, align: 'center'}
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
			title: parent.lang.report_navIoinDetail,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function loadIoinDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navIoinDetail);
	$("#labelIoinType").text(parent.lang.report_labelIoinType);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
	diableInput("#ioinType", disable, true);
}

function queryIoinDetail() {
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
		name: 'ioinType',
		value: $("#ioinType").val()
	});
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	$('#ioinDetailTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if(name == 'date') {
		pos = dateTime2TimeString(row[name]);
	}else if(name == 'ioinType') {
		pos = setIoinType(row);
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

function setIoinType(row) {
	var ioinName = gpsGetVehicleAllIoinName(row['devIdno']);
	var alarm;
	var ioin = 0;
	if (row['armType'] >= 19 && row['armType'] <= 26) {
		ioin = row['armType'] - 19;
		alarm = parent.lang.report_alarmBegin;
	} else if (row['armType'] >= 41 && row['armType'] <= 44) {
		ioin = row['armType'] - 41 + 8;
		alarm = parent.lang.report_alarmBegin;
	} else if (row['armType'] >= 69 && row['armType'] <= 76) {
		ioin = row['armType'] - 69;
		alarm = parent.lang.report_alarmEnd;
	} else {
		ioin = row['armType'] - 91;
		alarm = parent.lang.report_alarmEnd;
	}
	var temp = gpsGetIoinName(ioinName, ioin);
	return temp + "  " + alarm;
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
	document.reportForm.action = "ReportIoinAction_detailExcel.action?toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportIoinDetail() {
	exportReport(1);
}

function exportIoinDetailCsv() {
	exportReport(2);
}

function exportIoinDetailPdf() {
	exportReport(3);
}