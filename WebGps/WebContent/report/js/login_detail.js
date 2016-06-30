$(document).ready(function(){
	setTimeout(loadLoginDetailPage, 50);
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

function loadLoginDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadLoginDetailPage, 50);
	} else {
		//加载语言
		loadLoginDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryLoginDetail);
		$("#btnExport").click(exportLoginDetail);
		$("#btnExportCsv").click(exportLoginDetailCsv);
		$("#btnExportPdf").click(exportLoginDetailPdf);
		//初始化登录类型选项
		$("#loginType").append("<option value='0' selected>" + parent.lang.all + "</option>");
		$("#loginType").append("<option value='1'>" + parent.lang.report_loginTypeOnline + "</option>");
		$("#loginType").append("<option value='2'>" + parent.lang.report_loginTypeDisonline + "</option>");
	
		$("#loginDetailTable").flexigrid({
			url: "ReportLoginAction_detail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'armTimeStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_positionCurrent, name : 'position', width : 250, sortable : false, align: 'center'},
				{display: parent.lang.report_loginType, name : 'loginType', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_loginAddr, name : 'loginAddr', width : 200, sortable : false, align: 'center'}
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
			title: parent.lang.report_navLoginDetail,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function loadLoginDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navLoginDetail);
	$("#labelLoginType").text(parent.lang.report_labelLoginType);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryLoginDetail() {
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
		name: 'loginType',
		value: $("#loginType").val()
	});
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	$('#loginDetailTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
	}else if((name == 'armTime')){
		pos = dateTime2TimeString(row[name]);
	}else if(name == 'loginType') {
		if (row['armType'] == 17) {
			pos = parent.lang.report_loginTypeOnline;
		}else {
			pos = parent.lang.report_loginTypeDisonline;
		}
	}else if(name == 'loginAddr') {
		pos = setLoginAddr(row);
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

function setLoginAddr(row) {
	var loginAddr = "";
	if (row['armType'] == 17) {
		var ip1 = (row['param1']>>24)&0xFF;
		var ip2 = (row['param1']>>16)&0xFF;
		var ip3 = (row['param1']>>8)&0xFF;
		var ip4 = (row['param1']>>0)&0xFF;
		var addr = ip4 + "." + ip3 + "." + ip2 + "." + ip1;
		loginAddr = addr + "  " + row['param2'];
	}
	return loginAddr;
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
	document.reportForm.action = "ReportLoginAction_detailExcel.action?toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportLoginDetail() {
	exportReport(1);
}

function exportLoginDetailCsv() {
	exportReport(2);
}

function exportLoginDetailPdf() {
	exportReport(3); 
}