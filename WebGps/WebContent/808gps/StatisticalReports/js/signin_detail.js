$(document).ready(function(){
	setTimeout(loadPeopleDetailPage, 50);
});

var searchOpt = new searchOption(false, true);

function loadPeopleDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadPeopleDetailPage, 50);
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
		loadPeopleDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$('#hidden-type').val('fence');
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(queryPeopleDetail);
		$(".btnExport").click(exportPeopleDetail);
		$(".btnExportCSV").click(exportPeopleDetailCSV);
		$(".btnExportPDF").click(exportPeopleDetailPDF);
		var width = 0;
		if(parent.screenWidth >= 1390) {
			width = 'auto';
		}else {
			width = 1390;
			$('#sysuserLogDate').css('width','1350px');
		}
		$("#peopleDetailTable").flexigrid({
			url: "StandardReportSigninAction_detail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.plate_number, name : 'vid', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_plate_color, name : 'pt', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.device_number, name : 'did', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.alarm_driver_name, name : 'dn', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.alarm_driver_require, name : 'jn', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_beginTime, name : 'st', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_endTime, name : 'et', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_normal_beginPosition, name : 'sp', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_normal_endPosition, name : 'ep', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.driver_times, name : 'tl', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.monitor_vehiStatusNormal, name : 'ss', width : 150, sortable : false, align: 'center'}
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
	$('#peopleDetailTable').flexFixHeight();
}

function loadPeopleDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.signin_report);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryPeopleDetail() {
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
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	$('#peopleDetailTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'pt') {
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
	}else if( name == 'st' || name == 'et'){
		if(dateTime2TimeString(row[name]) == '1970-01-01 08:00:00'){
			pos = "";
		}else{
			pos = dateTime2TimeString(row[name]);
		}
	}else if(name == 'sp' || name == 'ep'){
		if(name == 'sp'){
			pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + row['vid'] + "', '" + row['sjd'] + "', '" + row['swd'] + "');\">" + changeNull(row[name]) + "</a>";
		}else{
			pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + row['vid'] + "', '" + row['ejd'] + "', '" + row['ewd'] + "');\">" + changeNull(row[name]) + "</a>";
		}
	}else if(name == 'ss') {
		switch (parseIntDecimal(row[name])) {
		case 0:
			pos = parent.lang.driver_signin_abnormal;
			break;
		case 1:
			pos = parent.lang.driver_signin_normal;
			break;
		}
	}else{
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
	document.reportForm.action = "StandardReportSigninAction_detailExcel.action?exportType="+exportType+"&toMap="+toMap+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val();
	document.reportForm.submit();
}
//导出至excel，导出至csv，导出至pdf
function exportPeopleDetail() {
	exportReport(1);
}

function exportPeopleDetailCSV() {
	exportReport(2);
}

function exportPeopleDetailPDF() {
	exportReport(3);
}

var selIds;
//选择车辆
function selVehicle() {
	$.dialog({id:'info', title:parent.lang.selectVehicleTitle,content: 'url:StatisticalReports/selectInfo.html?type=selVehicle&singleSelect=false&selectAll=true&isOil=false&isPeople=false',
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