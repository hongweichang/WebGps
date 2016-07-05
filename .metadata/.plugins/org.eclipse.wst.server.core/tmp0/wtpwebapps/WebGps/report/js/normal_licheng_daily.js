$(document).ready(function(){
	setTimeout(loadLiChengDailyPage, 50);
});


var searchOpt = new searchOption(false, false);
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

function loadLiChengDailyPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadLiChengDailyPage, 50);
	} else {
		//加载语言
		loadLiChengDailyLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryLiChengDaily);
		$("#btnExport").click(exportLiChengDaily);
		$("#btnExportCsv").click(exportLiChengDailyCsv);
		$("#btnExportPdf").click(exportLiChengDailyPdf);
		
		$("#lichengDailyTable").flexigrid({
			url: "ReportNormalAction_daily.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'dateStr', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_normal_lichengTotal + gpsGetLabelLiChengUnit(), name : 'liCheng', width : 100, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_beginTime, name : 'startTimeStr', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_normal_beginPosition, name : 'startPosition', width : 250, sortable : false, align: 'center'},
				{display: parent.lang.report_endTime, name : 'endTimeStr', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_normal_endPosition, name : 'endPosition', width : 250, sortable : false, align: 'center'}
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
			title: parent.lang.report_navNormalLiChengDetail,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function loadLiChengDailyLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navNormalLiChengDetail);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryLiChengDaily() {
	//判断时间
	var begindate = $("#begintime").val();
	var enddate = $("#endtime").val();
	if (!searchOpt.checkQueryDate(begindate, enddate)) {
		return ;
	}
	var deviceList = searchOpt.getQueryDevList();
	//判断设备
	if (deviceList.length <= 0) {
		alert(parent.lang.report_selectVehiNullErr);
		return ;
	}
	searchOpt.requireParam.devIdnos = deviceList.toString();;
	var params = [];
	params.push({
		name: 'json',
		value: encodeURIComponent(JSON.stringify(searchOpt.requireParam))
	});
	params.push({
		name: 'begintime',
		value: begindate
	});
	params.push({
		name: 'endtime',
		value: enddate
	});
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	$('#lichengDailyTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if((name == 'date') || (name == 'startTime') || (name == 'endTime')){
		pos = dateTime2TimeString(row[name]);
	}else if((name == 'liCheng')){
		if(parent.editMileage == "true"){
			pos = "<a class=\"blue\" href=\"javascript:editDailyLiCheng('" + row['devIdno'] + "', '" + dateTime2TimeString(row['date']) + "', '" + gpsGetLiCheng(row['liCheng']) + "');\">" + gpsGetLiCheng(row['liCheng']) + "</a>";
		}else{
			pos = gpsGetLiCheng(row['liCheng']);
		}
	}else if(name == 'startPosition') {
		if(parent.showLocation == "true"){
			pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + gpsGetVehicleName(row['devIdno']) + "', '" + row['startJingDu'] + "', '" + row['startWeiDu'] + "');\">" + changeNull(row[name]) + "</a>";
			} else {
				if(row['startJingDu'] == 0 || row['startWeiDu'] == 0){
					pos = "";
				}else{
				pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + gpsGetVehicleName(row['devIdno']) + "', '" + row['startJingDu'] + "', '" + row['startWeiDu'] + "');\">" + gpsGetPosition(row['startJingDu'], row['startWeiDu'], 1) + "</a>";
			}
		}
	}else if (name == 'endPosition') {
		if(parent.showLocation == "true"){
			pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + gpsGetVehicleName(row['devIdno']) + "', '" + row['endJingDu'] + "', '" + row['endWeiDu'] + "');\">" + changeNull(row[name]) + "</a>";
		} else {
			if(row['endJingDu'] == 0 || row['endWeiDu'] == 0){
				pos = "";
			}else{
				pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + gpsGetVehicleName(row['devIdno']) + "', '" + row['endJingDu'] + "', '" + row['endWeiDu'] + "');\">" + gpsGetPosition(row['endJingDu'], row['endWeiDu'], 1) + "</a>";
			}
		}
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function editDailyLiCheng(devIdno,date,liCheng){
	$.dialog({id:'editlicheng', title:parent.lang.vehicle_vehi_edit,content:'url:report/edit_licheng.html?devIdno=' + devIdno +'&date=' + date + '&liCheng=' + liCheng
		, min:false, max:false, lock:true});
}

function doLiChengSuc(){
	$.dialog({id:'editlicheng'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	queryLiChengDaily();
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
	document.reportForm.action = "ReportNormalAction_detailExcel.action?toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportLiChengDaily() {
	exportReport(1);
}

function exportLiChengDailyCsv() {
	exportReport(2);
}

function exportLiChengDailyPdf() {
	exportReport(3);
}