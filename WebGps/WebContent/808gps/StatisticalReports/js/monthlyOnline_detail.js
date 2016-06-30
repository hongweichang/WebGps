$(document).ready(function(){
	setTimeout(loadMonthlyOnlineDetailPage, 50);
});

var searchOpt = new searchOption(false,false,false,true);

function loadMonthlyOnlineDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadMonthlyOnlineDetailPage, 50);
	} else {
		buttonQueryOrExport();
		$('#selectName').flexPanel({
			InputModel : {display: parent.lang.selectVehicleTip,value:'',name : 'vehiIdnos', pid : 'vehiIdnos', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
		});
		//加载语言
		loadMonthlyOnlineDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(queryMonthlyOnlineDetail);
		$(".btnExport").click(exportMonthlyOnlineDetail);
		$(".btnExportCSV").click(exportMonthlyOnlineDetailCSV);
		$(".btnExportPDF").click(exportMonthlyOnlineDetailPDF);
		var width = 0;
		if(parent.screenWidth > 1024) {
			width = 'auto';
		}else {
			width = 800;
			$('#sysuserLogDate').css('width','840px');
		}
		$("#monthlyOnlineDetailTable").flexigrid({
			url: "StandardReportOnlineAction_monthlyOnline.action",
			dataType: 'json',
			colModel : [
					{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
					{display: parent.lang.plate_number, name : 'vehiIdno', width : 150, sortable : false, align: 'center'},
					{display: parent.lang.report_plate_color, name : 'plateType', width : 60, sortable : false, align: 'center'},
					{display: parent.lang.report_date, name : 'param1SumStr', width : 120, sortable : false, align: 'center', hide: false},
					{display: parent.lang.report_login_rate, name : 'loginRate', width : 100, sortable : false, align: 'center'}
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
	$('#monthlyOnlineDetailTable').flexFixHeight();
}

function loadMonthlyOnlineDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_vehicle_monthlyonline_detail);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryMonthlyOnlineDetail() {
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
		name: 'type',
		value: 'monthlyOnline'
	});
	$('#monthlyOnlineDetailTable').flexOptions(
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
	}else if((name == 'loginRate')){
		var rate = (row[name] * 100 ) ;
		pos = rate.toFixed(2) + "%";
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
	document.reportForm.action = "StandardReportOnlineAction_summaryExcel.action?type=monthlyOnline&exportType="+exportType;
	document.reportForm.submit(); 
}
//导出至excel，导出至csv，导出至pdf
function exportMonthlyOnlineDetail() {
	exportReport(1);
}

function exportMonthlyOnlineDetailCSV() {
	exportReport(2);
}

function exportMonthlyOnlineDetailPDF() {
	exportReport(3);
}

var selIds;
//选择车辆
function selVehicle() {
	$.dialog({id:'info', title:parent.lang.selectVehicleTitle,content: 'url:StatisticalReports/selectInfo.html?type=selVehicle&singleSelect=false&selectAll=true&isOil=false',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}

function doSelectVehicle(ids,vehicleList) {
	if(ids != null && ids == '0') {
		$('#combox-vehiIdnos').val(parent.lang.all_vehicles);
		$('#hidden-vehiIdnos').val(getNewArrayByArray(parent.vehicleList,'name').toString());
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