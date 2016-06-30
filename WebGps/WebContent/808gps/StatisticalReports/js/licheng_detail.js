$(document).ready(function(){
	setTimeout(loadLichengDetailPage, 50);
});

var searchOpt = new searchOption();

function loadLichengDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadLichengDetailPage, 50);
	} else {
		buttonQueryOrExport();
		$('#select-type').flexPanel({
			ComBoboxModel :{
				button :
				[
					[{
						display: parent.lang.report_licheng_daily, name : 'type', pid : 'type', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]
				],
				combox: {name : 'type', option : 'daily&'+parent.lang.report_licheng_daily+'|monthly&'+parent.lang.report_licheng_monthly}
			}	
		});
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
		loadLichengDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#begintime").val(dateCurrentDateString());
		$("#endtime").val(dateCurrentDateString());
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(queryLichengDetail);
		$(".btnExport").click(exportLichengDetail);
		$(".btnExportCSV").click(exportLichengDetailCSV);
		$(".btnExportPDF").click(exportLichengDetailPDF);
		
		var width = 0;
		if(Math.round(6 * parent.screenWidth/7) - 25 >= 1330) {
			width = 'auto';
		}else {
			width = 1330;
			$('#sysuserLogDate').css('width','1370px');
		}
		$("#lichengDetailTable").flexigrid({
			url: "StandardReportLiChengAction_detail.action",
			dataType: 'json',
			colModel : [
					{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
					{display: parent.lang.plate_number, name : 'vehiIdno', width : 150, sortable : false, align: 'center'},
					{display: parent.lang.report_plate_color, name : 'plateType', width : 60, sortable : false, align: 'center'},
					{display: parent.lang.monitor_task_date, name : 'date', width : 120, sortable : false, align: 'center', hide: false},
					{display: parent.lang.report_licheng_lichengTotal + gpsGetLabelLiChengUnit(), name : 'liCheng', width : 100, sortable : false, align: 'center'},
					{display: parent.lang.begintime, name : 'startTime', width : 120, sortable : false, align: 'center', hide: false},
					{display: parent.lang.report_licheng_beginLicheng + gpsGetLabelLiChengUnit(), name : 'startLiCheng', width : 100, sortable : false, align: 'center'},
					{display: parent.lang.report_normal_beginPosition, name : 'startPosition', width : 250, sortable : false, align: 'center'},
					{display: parent.lang.endtime, name : 'endTime', width : 120, sortable : false, align: 'center'},
					{display: parent.lang.report_licheng_endLicheng + gpsGetLabelLiChengUnit(), name : 'endLiCheng', width : 100, sortable : false, align: 'center'},
					{display: parent.lang.report_normal_endPosition, name : 'endPosition', width : 250, sortable : false, align: 'center'}
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
		
		$('#select-type .ui-menu-item').each(function(){
			$(this).attr('onclick','changeDaily()');
		});
		if(isBrowseIE7()) {
			$('#hidden-type').on('input propertychange',function(){
				changeDaily();
			});
		}
	}
}

function fixHeight() {
	$('#lichengDetailTable').flexFixHeight();
}

function loadLichengDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_liCheng_detail);
	$("#labelType").text(parent.lang.report_labelLoginType);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryLichengDetail() {
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
	params.push({
		name: 'type',
		value: $.trim($('#hidden-type').val())
	});
	$('#lichengDetailTable').flexOptions(
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
	}else if(name == 'date'){
		var type = $('#hidden-type').val();
		if(type == 'monthly') {
			pos = dateTime2MonthString(row['startTime']);
		}else {
			pos = dateTime2DateString(row['startTime']);
		//	pos = row[name];
		}
	}else if(name == 'startTime'){
		//var type = $('#hidden-type').val();
		/*if(type == 'monthly') {
			pos = dateTime2DateString(row[name]);
		}else {*/
			pos = dateTime2TimeString(row[name]);
		//	pos = row[name];
		//}
	}else if( name == 'endTime'){
		if(dateTime2TimeString(row[name]) == '1970-01-01 08:00:00'){
			pos = "";
		}else{
			//var type = $('#hidden-type').val();
			/*if(type == 'monthly') {
				pos = dateTime2DateString(row[name]);
			}else {*/
				pos = dateTime2TimeString(row[name]);
			//	pos = row[name];
			//}
		}
	}else if(name == 'startPosition') {
		pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + row['vehiIdno'] + "', '" + row['startJingDu'] + "', '" + row['startWeiDu'] + "');\">" + changeNull(row[name]) + "</a>";
	}else if (name == 'endPosition') {
		pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + row['vehiIdno'] + "', '" + row['endJingDu'] + "', '" + row['endWeiDu'] + "');\">" + changeNull(row[name]) + "</a>";
	}else if((name == 'liCheng') || (name == 'startLiCheng') || (name == 'endLiCheng')){
		pos = gpsGetLiCheng(row[name]);
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
	document.reportForm.action = "StandardReportLiChengAction_detailExcel.action?toMap="+toMap+"&exportType="+exportType+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val();
	document.reportForm.submit(); 
}
//导出至excel，导出至csv，导出至pdf
function exportLichengDetail() {
	exportReport(1);
}

function exportLichengDetailCSV() {
	exportReport(2);
}

function exportLichengDetailPDF() {
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

function changeDaily() {
	var type = $('#hidden-type').val();
	$('#inputtime').empty();
	var content = '';
	if(type == 'daily') {
		content += '    <span id="labelSelecttime" class="setdatetext"></span>';
		content += '    	<div id="selecttime" style="float:left;display: inline-block;"></div>';
	}
	content += '	<span class="setdatetext" id="labelBegintime"></span>';
	content += '		<input type="text" style="width:165px;" class="Wdate" readonly="" size="15" name="begintime" id="begintime">';
	content += '	<span class="setdatetext" id="labelEndtime"></span>';
	content += '		<input type="text" style="width:165px;" class="Wdate  " readonly="" size="15" name="endtime" id="endtime">';
	$('#inputtime').append(content);
	if(type == 'daily') {
		searchOpt = new searchOption();
	}else {
		searchOpt = new searchOption(false,false,false,true);
	}

	$('#selecttime').flexPanel({
		ComBoboxModel :{
			input : {name : 'selecttime',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			combox: 
				{name : 'selecttime', option : arrayToStr(getSelectTime(1))}
		}	
	});
	

	$("#labelSelecttime").text(parent.lang.labelSelecttime);
	$("#labelBegintime").text(parent.lang.labelBegintime);
	$("#labelEndtime").text(parent.lang.labelEndtime);
	searchOpt.initSearchOption();

	if(type == 'daily') {
		$('#select-selecttime li').each(function() {
			var index= $(this).attr('data-index');
			$(this).on('click',function() {
				selectTime(index, 1);
			});
			if(index == 0) {
				$(this).click();
			}
		});
	}
	$('#lichengDetailTable').flexClear();
}