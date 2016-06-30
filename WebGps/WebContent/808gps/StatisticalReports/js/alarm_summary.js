$(document).ready(function(){
	setTimeout(loadAlarmSummaryPage, 50);
});

var searchOpt = new searchOption(false, true);

function loadAlarmSummaryPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadAlarmSummaryPage, 50);
	} else {
		buttonQueryOrExport();
		$('#select-handled').flexPanel({
			ComBoboxModel :{
				button :
				[
					[{
						display: parent.lang.report_alarm_vehicle, name : 'handleStatus', pid : 'handleStatus', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]
				],
				combox: {name : 'handleStatus', option : '0&'+parent.lang.report_alarm_vehicle+'|1&'+parent.lang.report_alarm_company}
			}	
		});
		$('#hidden-handleStatus').val('0');
		
		$('#select-handleStatus .ui-menu-item').each(function(){
			$(this).attr('onclick','changeStructure()');
		});
		if(isBrowseIE7()) {
			$('#hidden-handleStatus').on('input propertychange',function(){
				changeStructure();
			});
		}
		
		$('#select-status').flexPanel({
			ComBoboxModel :{
				button :
				[
					[{
						display: parent.lang.report_summary, name : 'status', pid : 'status', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]
				],
				combox: {name : 'status', option : '0&'+parent.lang.report_summary+'|daily&'+parent.lang.report_licheng_daily+'|monthly&'+parent.lang.report_licheng_monthly}
			}	
		});
		$('#hidden-status').val('0');
		
		$('#select-status .ui-menu-item').each(function(){
			$(this).attr('onclick','changeType()');
		});
		if(isBrowseIE7()) {
			$('#hidden-status').on('input propertychange',function(){
				changeType();
			});
		}
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
		loadAlarmSummaryLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(queryAlarmSummary);
		$(".btnExport").click(exportAlarmSummary);
		$(".btnExportCSV").click(exportAlarmSummaryCSV);
		$(".btnExportPDF").click(exportAlarmSummaryPDF);
		var width = 0;
		if(Math.round(6 * parent.screenWidth/7) - 25 >= 5750) {
			width = 'auto';
		}else {
			width = 5750;
			$('#sysuserLogDate').css('width','5760px');
		}
		$("#alarmSummaryTable").flexigrid({
			url: "StandardReportAlarmAction_summary.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.report_vehiIdno, name : 'vehiIdno', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_plate_color, name : 'plateType', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.monitor_task_date, name : 'date', width : 120, sortable : false, align: 'center', hide: true},
				{display: parent.lang.report_beginTime, name : 'beginTime', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_endTime, name : 'endTime', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_custom_alarm + "/" + parent.lang.report_handled, name : 'countStr0', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_emergency_alarm + "/" + parent.lang.report_handled, name : 'countStr1', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_regionalSpeedingAlarm + "/" + parent.lang.report_handled, name : 'countStr2', width : 110, sortable : false, align: 'center'},
				{display: parent.lang.report_earlyWarning + "/" + parent.lang.report_handled, name : 'countStr3', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.report_GNSSModuleFailure + "/" + parent.lang.report_handled, name : 'countStr4', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_GNSSAntennaMissedOrCut + "/" + parent.lang.report_handled, name : 'countStr5', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_GNSSAntennaShort + "/" + parent.lang.report_handled, name : 'countStr6', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_mainSupplyUndervoltage + "/" + parent.lang.report_handled, name : 'countStr7', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_mainPowerFailure + "/" + parent.lang.report_handled, name : 'countStr8', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_LCDorDisplayFailure + "/" + parent.lang.report_handled, name : 'countStr9', width : 130, sortable : false, align: 'center'},
				{display: parent.lang.report_TTSModuleFailure + "/" + parent.lang.report_handled, name : 'countStr10', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_cameraMalfunction + "/" + parent.lang.report_handled, name : 'countStr11', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_cumulativeDayDrivingTimeout + "/" + parent.lang.report_handled, name : 'countStr12', width : 140, sortable : false, align: 'center'},
				{display: parent.lang.report_overtimeParking + "/" + parent.lang.report_handled, name : 'countStr13', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_outOfRegional + "/" + parent.lang.report_handled, name : 'countStr14', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_outOfLine + "/" + parent.lang.report_handled, name : 'countStr15', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_InadequateOrTooLongRoadTravelTime + "/" + parent.lang.report_handled, name : 'countStr16', width : 170, sortable : false, align: 'center'},
				{display: parent.lang.report_routeDeviation + "/" + parent.lang.report_handled, name : 'countStr17', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_VSSFailure + "/" + parent.lang.report_handled, name : 'countStr18', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_abnormalFuel + "/" + parent.lang.report_handled, name : 'countStr19', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_antitheftDevice + "/" + parent.lang.report_handled, name : 'countStr20', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_illegalIgnition + "/" + parent.lang.report_handled, name : 'countStr21', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_illegalDisplacement + "/" + parent.lang.report_handled, name : 'countStr22', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_rollover + "/" + parent.lang.report_handled, name : 'countStr23', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.report_nightdriving + "/" + parent.lang.report_handled, name : 'countStr24', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.rule_alarm_overspeed + "/" + parent.lang.report_handled, name : 'countStr25', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_alarm_type_acc + "/" + parent.lang.report_handled, name : 'countStr26', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.alarm_type_fatigue + "/" + parent.lang.report_handled, name : 'countStr27', width : 100, sortable : false, align: 'center'},
				
				{display: parent.lang.report_areaOverSpeed_platform + "/" + parent.lang.report_handled, name : 'countStr28', width : 140, sortable : false, align: 'center'},
				{display: parent.lang.report_areaLowSpeed_platform + "/" + parent.lang.report_handled, name : 'countStr29', width : 140, sortable : false, align: 'center'},
				{display: parent.lang.report_areaInOut_platform + "/" + parent.lang.report_handled, name : 'countStr30', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_lineInOut_platform + "/" + parent.lang.report_handled, name : 'countStr31', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_overSpeed_platform + "/" + parent.lang.report_handled, name : 'countStr32', width : 160, sortable : false, align: 'center'},
				{display: parent.lang.report_lowSpeed_platform + "/" + parent.lang.report_handled, name : 'countStr33', width : 160, sortable : false, align: 'center'},
				{display: parent.lang.report_fatigue_platform + "/" + parent.lang.report_handled, name : 'countStr34', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_parkTooLong_platform + "/" + parent.lang.report_handled, name : 'countStr35', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_areaPoint_platform + "/" + parent.lang.report_handled, name : 'countStr36', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_lineOverSpeed_platform + "/" + parent.lang.report_handled, name : 'countStr37', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_lineLowSpeed_platform + "/" + parent.lang.report_handled, name : 'countStr38', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_roadLvlOverSpeed_platform + "/" + parent.lang.report_handled, name : 'countStr39', width : 120, sortable : false, align: 'center'}
				],
			pernumber: parent.lang.pernumber,
			pagestat: parent.lang.pagestatInfo,
			pagefrom: parent.lang.pagefrom,
			pagetext: parent.lang.page,
			pagetotal: parent.lang.pagetotal,
			findtext: parent.lang.find,
			procmsg: parent.lang.procmsg,
			nomsg : parent.lang.nomsg,
			resizable: false,
			usepager: true,
			autoload: false,
			singleSelect: true,
			idProperty: 'vehiIdno',
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			showToggleBtn: true,
			width: width,
			onSubmit: false,
			onSuccess: loadSuccess,
			height: 'auto'
		});
		loadReportTableWidth(fixHeight);
		
		$("#alarmSummaryTable").flexSelectRowPropFun(function(obj) {
			selectAlarmSumRowProp(obj);
		});
		
	}
}

function fixHeight() {
	$('#alarmSummaryTable').flexFixHeight();
}

var alarmSumList = new Array();
function loadSuccess() {
	var data = $("#alarmSummaryTable").flexGetData();
	if(data && data.rows) {
		alarmSumList = data.rows;
	}
}

function selectAlarmSumRowProp(obj) {
	var idno = $(obj).attr("data-id");
	for (var i = 0; i < alarmSumList.length; i++) {
		if(alarmSumList[i].vehiIdno == idno) {
			if($("#container").css('display') == "none") {
				$("#container").show().css("width","98%");
				$('.flexigrid .bDiv').height($('.flexigrid .bDiv').height() - 256 < 0 ? 0 : $('.flexigrid .bDiv').height() - 256);
			}
			  var _totle = 0;
			  var a = [];
			  var lcolor=null,license=null,f_year=null,g_time=null;
			  switch (parseIntDecimal(alarmSumList[i].plateType)) {
					case 1:
						lcolor = parent.lang.blue_label;
						break;
					case 2:
						lcolor = parent.lang.yellow_label;
						break;
					case 3:
						lcolor = parent.lang.black_label;
						break;
					case 4:
						lcolor = parent.lang.white_label;
						break;
					case 0:
						lcolor = parent.lang.other;
						break;
					default:
						break;
			  }
			  if(alarmSumList[i].countStrs) {
				  for (var j = 0; j < 39; j++) {
					  a.push(parseInt(alarmSumList[i].countStrs[j].split("/")[0]));
					  _totle = _totle + parseInt(alarmSumList[i].countStrs[j].split("/")[0]);
				  }
			  }else {
				  if(alarmSumList[i].counts) {
					  for (var j = 0; j < 39; j++) {
						  a.push(parseInt(alarmSumList[i].counts[j]));
						  _totle = _totle + parseInt(alarmSumList[i].counts[j]);
					  }
				  }
			  }
			  var title="";
			  if($('#hidden-status').val() == '0'){
				  if(alarmSumList[i].companyId){
					  title = getArrayName(parent.vehiGroupList, alarmSumList[i].companyId);
				  }else{
					  title=idno.split(',')[0];
				  }
			  }
			  if($('#hidden-status').val() == 'daily'){
				  if(alarmSumList[i].companyId){
					  title = getArrayName(parent.vehiGroupList, alarmSumList[i].companyId)+' '+dateTime2DateString(alarmSumList[i].beginTime);
				  }else{
					  title=idno.split(',')[0]+' '+dateTime2DateString(alarmSumList[i].beginTime);
				  }
			  }
			  if($('#hidden-status').val() == 'monthly'){
				  if(alarmSumList[i].companyId){
					  title = getArrayName(parent.vehiGroupList, alarmSumList[i].companyId)+' '+ dateTime2MonthString(alarmSumList[i].beginTime);
				  }else{
					  title=idno.split(',')[0]+' '+ dateTime2MonthString(alarmSumList[i].beginTime);
				  }
			  }
			  chart2 = new Highcharts.Chart({
				colors: ["red"],
		        chart: {
		            renderTo: 'container',
		            type: 'column',
		            backgroundColor: { 
		          	  linearGradient: 
		          	  { x1: 0, y1: 0, x2: 1, y2: 1 },
		          	  stops: [ 
		          	           [0, 'rgb(48, 48, 96)'], 
		          	           [1, 'rgb(0, 0, 0)'] ] }, 
		          	  borderColor: '#000000', 
		          	  borderWidth: 2, 
		          	  className: 'dark-container', 
		          	  plotBackgroundColor: null,
		          	  plotBorderColor: '#CCCCCC', 
		          	  plotBorderWidth: 1
		        },
		        title: {
		            text: title+' '+parent.lang.report_alarm_summary,
		            style: {
		                fontFamily: 'Verdana, sans-serif',
		                color:'yellow',
		            }
		        },
		        xAxis: {
		        	categories: [parent.lang.report_custom_alarm, parent.lang.report_emergency_alarm, parent.lang.report_regionalSpeedingAlarm, parent.lang.report_earlyWarning,
		        				parent.lang.report_GNSSModuleFailure, parent.lang.report_GNSSAntennaMissedOrCut, parent.lang.report_GNSSAntennaShort, parent.lang.report_mainSupplyUndervoltage,
		        				parent.lang.report_mainPowerFailure, parent.lang.report_LCDorDisplayFailure, parent.lang.report_TTSModuleFailure, parent.lang.report_cameraMalfunction,
		        				parent.lang.report_cumulativeDayDrivingTimeout, parent.lang.report_overtimeParking, parent.lang.report_outOfRegional, parent.lang.report_outOfLine,
		        				parent.lang.report_InadequateOrTooLongRoadTravelTime, parent.lang.report_routeDeviation, parent.lang.report_VSSFailure, parent.lang.report_abnormalFuel,
		        				parent.lang.report_antitheftDevice, parent.lang.report_illegalIgnition, parent.lang.report_illegalDisplacement, parent.lang.report_rollover,
		        				parent.lang.report_nightdriving, parent.lang.rule_alarm_overspeed, parent.lang.report_alarm_type_acc, parent.lang.alarm_type_fatigue, parent.lang.report_areaOverSpeed_platform,
		        				parent.lang.report_areaLowSpeed_platform, parent.lang.report_areaInOut_platform, parent.lang.report_lineInOut_platform, parent.lang.report_overSpeed_platform,
		        				parent.lang.report_lowSpeed_platform, parent.lang.report_fatigue_platform, parent.lang.report_parkTooLong_platform,parent.lang.report_areaPoint_platform, 
		        				parent.lang.report_lineOverSpeed_platform, parent.lang.report_lineLowSpeed_platform, parent.lang.report_roadLvlOverSpeed_platform],
		         labels: {
		             rotation: -20,
		             align: 'right',
		             style: {
		                 fontSize: '10px',
		                 fontFamily: 'Verdana, sans-serif',
		                 color:'yellow',
		             }
		         	}
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: parent.lang.report_alarm_frequency
		            },
		            style: {
		                fontFamily: 'Verdana, sans-serif',
		                color:'yellow',
		            },
		            labels: {
			            	formatter:function(){
			            	return this.value+parent.lang.report_alarm_count;
			            	}
		            	},
		            tickPixelInterval:15
		        },
		        tooltip: {
		            formatter: function() {
		                return '<b>'+ this.point.category+'</b><br/>'+
		                    this.series.name +': '+ this.y +parent.lang.report_alarm_count;
		            }
		        },
		        credits: {
		            enabled: false,
		            style: { color: '#666' }
		        },
		        legend: {
		            enabled: false
		        },
		        series: [{
		        	name: parent.lang.report_alarm_count_number,
		        	data: a,
	        	       dataLabels: {
                       enabled: true,
                       color: '#FFFFFF',
                       align: 'center',
                       align: 'center',
                       rotation: 0,
                       y: 0,
                       style: {
                           fontSize: '13px',
                           fontFamily: 'Verdana, sans-serif',
                           textShadow: '0 0 3px black'
                       }
                   }
		        }]
		        
		    });
		}
	}
}

function loadAlarmSummaryLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_alarm_summary);
	$("#labelType").text(parent.lang.report_labelLoginType);
	$("#labelhandled").text(parent.lang.report_alarm_structure);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryAlarmSummary() {
	if($("#container").css('display') != "none"){
		$("#container").hide();
		$('.flexigrid .bDiv').height($('.flexigrid .bDiv').height() + 256 < 0 ? 0 : $('.flexigrid .bDiv').height() + 256);
	}
	if($("#container").css('display') != "none"){
		$("#container").hide();
		$('.flexigrid .bDiv').height($('.flexigrid .bDiv').height() + 256 < 0 ? 0 : $('.flexigrid .bDiv').height() + 256);
	}
	var query = searchOpt.getQueryDataNew(false);
	if (query === null) {
		return ;
	}
	
	if($('#hidden-handleStatus').val() == '0'){
		if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
			alert(parent.lang.report_selectVehiNullErr);
			return;
		}
	}
	if($('#hidden-handleStatus').val() == '1'){
		if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
			alert(parent.lang.report_selectCompanyNullErr);
			return;
		}
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
		name: 'handleStatus',
		value: $('#hidden-handleStatus').val()
	});
	params.push({
		name: 'status',
		value: $.trim($('#hidden-status').val())
	});
	$('#alarmSummaryTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'vehiIdno') {
		var companyId = row['companyId'];
		if(companyId){
			pos = getArrayName(parent.vehiGroupList, companyId);
		}else{
			var vehiIdno = row['vehiIdno'];
			if(vehiIdno){
				pos = vehiIdno.split(',')[0];
			}
		}
	}else if(name == 'plateType') {
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
		if($('#hidden-status').val() == 'daily'){
			pos = dateTime2DateString(row['beginTime']);
		}else if($('#hidden-status').val() == 'monthly'){
			pos = dateTime2MonthString(row['beginTime']);
		}
	}else if(name == 'beginTime'){
		pos = dateTime2TimeString(row[name]);
	}else if( name == 'endTime'){
		if(dateTime2TimeString(row[name]) == '1970-01-01 08:00:00'){
			pos = "";
		}else{
			pos = dateTime2TimeString(row[name]);
		}
	}else if(name == 'count'+index) {
		var countStrs = row['countStrs'];
		if(countStrs) {
			pos = countStrs[index.replace('Str','')];
		}else {
			var counts = row['counts'];
			if(counts) {
				pos = counts[index.replace('Str','')];
			}
		}
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
	
	if($('#hidden-handleStatus').val() == '0'){
		if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
			alert(parent.lang.report_selectVehiNullErr);
			return;
		}
	}
	if($('#hidden-handleStatus').val() == '1'){
		if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
			alert(parent.lang.report_selectCompanyNullErr);
			return;
		}
	}
	document.reportForm.action = "StandardReportAlarmAction_summaryExcel.action?exportType="+exportType+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val();
	document.reportForm.submit();
}
//导出至excel，导出至csv，导出至pdf
function exportAlarmSummary() {
	exportReport(1);
}

function exportAlarmSummaryCSV() {
	exportReport(2);
}

function exportAlarmSummaryPDF() {
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

function changeType() {
	var type = $('#hidden-status').val();
	$('#alarmSummaryTable').flexClear();
	if($("#container").css('display') != "none"){
		$("#container").hide();
		$('.flexigrid .bDiv').height($('.flexigrid .bDiv').height() + 256 < 0 ? 0 : $('.flexigrid .bDiv').height() + 256);
	}
	var date_ = false;
	if(type != '0'){
		date_ = true;
	}
	showDate(date_);
	$('#inputtime').empty();
	var content = '';
	if(type != 'monthly') {
		content += '    <span id="labelSelecttime" class="setdatetext"></span>';
		content += '    	<div id="selecttime" style="float:left;display: inline-block;"></div>';
	}
	content += '	<span class="setdatetext" id="labelBegintime"></span>';
	content += '		<input type="text" style="width:165px;" class="Wdate" readonly="" size="15" name="begintime" id="begintime">';
	content += '	<span class="setdatetext" id="labelEndtime"></span>';
	content += '		<input type="text" style="width:165px;" class="Wdate  " readonly="" size="15" name="endtime" id="endtime">';
	$('#inputtime').append(content);
	if(type != 'monthly') {
		if(type == 'daily'){
			searchOpt = new searchOption();
		}else{
			searchOpt = new searchOption(false, true);
		}
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
	searchOpt.initSearchTimeOption();
	if(type != '0'){
		$('.hDivBox .countStr0 div').text(parent.lang.report_custom_alarm);
		$('.hDivBox .countStr1 div').text(parent.lang.report_emergency_alarm);
		$('.hDivBox .countStr2 div').text(parent.lang.report_regionalSpeedingAlarm);
		$('.hDivBox .countStr3 div').text(parent.lang.report_earlyWarning);
		$('.hDivBox .countStr4 div').text(parent.lang.report_GNSSModuleFailure);
		$('.hDivBox .countStr5 div').text(parent.lang.report_GNSSAntennaMissedOrCut);
		$('.hDivBox .countStr6 div').text(parent.lang.report_GNSSAntennaShort);
		$('.hDivBox .countStr7 div').text(parent.lang.report_mainSupplyUndervoltage);
		$('.hDivBox .countStr8 div').text(parent.lang.report_mainPowerFailure);
		$('.hDivBox .countStr9 div').text(parent.lang.report_LCDorDisplayFailure);
		$('.hDivBox .countStr10 div').text(parent.lang.report_TTSModuleFailure);
		$('.hDivBox .countStr11 div').text(parent.lang.report_cameraMalfunction);
		$('.hDivBox .countStr12 div').text(parent.lang.report_cumulativeDayDrivingTimeout);
		$('.hDivBox .countStr13 div').text(parent.lang.report_overtimeParking);
		$('.hDivBox .countStr14 div').text(parent.lang.report_outOfRegional);
		$('.hDivBox .countStr15 div').text(parent.lang.report_outOfLine);
		$('.hDivBox .countStr16 div').text(parent.lang.report_InadequateOrTooLongRoadTravelTime);
		$('.hDivBox .countStr17 div').text(parent.lang.report_routeDeviation);
		$('.hDivBox .countStr18 div').text(parent.lang.report_VSSFailure);
		$('.hDivBox .countStr19 div').text(parent.lang.report_abnormalFuel);
		$('.hDivBox .countStr20 div').text(parent.lang.report_antitheftDevice);
		$('.hDivBox .countStr21 div').text(parent.lang.report_illegalIgnition);
		$('.hDivBox .countStr22 div').text(parent.lang.report_illegalDisplacement);
		$('.hDivBox .countStr23 div').text(parent.lang.report_rollover);
		$('.hDivBox .countStr24 div').text(parent.lang.report_nightdriving);
		$('.hDivBox .countStr25 div').text(parent.lang.rule_alarm_overspeed);
		$('.hDivBox .countStr26 div').text(parent.lang.report_alarm_type_acc);
		$('.hDivBox .countStr27 div').text(parent.lang.alarm_type_fatigue);
		$('.hDivBox .countStr28 div').text(parent.lang.report_areaOverSpeed_platform);
		$('.hDivBox .countStr29 div').text(parent.lang.report_areaLowSpeed_platform);
		$('.hDivBox .countStr30 div').text(parent.lang.report_areaInOut_platform);
		$('.hDivBox .countStr31 div').text(parent.lang.report_lineInOut_platform);
		$('.hDivBox .countStr32 div').text(parent.lang.report_overSpeed_platform);
		$('.hDivBox .countStr33 div').text(parent.lang.report_lowSpeed_platform);
		$('.hDivBox .countStr34 div').text(parent.lang.report_fatigue_platform);
		$('.hDivBox .countStr35 div').text(parent.lang.report_parkTooLong_platform);
		$('.hDivBox .countStr36 div').text(parent.lang.report_areaPoint_platform);
		$('.hDivBox .countStr37 div').text(parent.lang.report_lineOverSpeed_platform);
		$('.hDivBox .countStr38 div').text(parent.lang.report_lineLowSpeed_platform);
		$('.hDivBox .countStr39 div').text(parent.lang.report_roadLvlOverSpeed_platform);
	}else{
		$('.hDivBox .countStr0 div').text(parent.lang.report_custom_alarm + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr1 div').text(parent.lang.report_emergency_alarm + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr2 div').text(parent.lang.report_regionalSpeedingAlarm + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr3 div').text(parent.lang.report_earlyWarning + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr4 div').text(parent.lang.report_GNSSModuleFailure + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr5 div').text(parent.lang.report_GNSSAntennaMissedOrCut + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr6 div').text(parent.lang.report_GNSSAntennaShort + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr7 div').text(parent.lang.report_mainSupplyUndervoltage + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr8 div').text(parent.lang.report_mainPowerFailure + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr9 div').text(parent.lang.report_LCDorDisplayFailure + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr10 div').text(parent.lang.report_TTSModuleFailure + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr11 div').text(parent.lang.report_cameraMalfunction + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr12 div').text(parent.lang.report_cumulativeDayDrivingTimeout + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr13 div').text(parent.lang.report_overtimeParking + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr14 div').text(parent.lang.report_outOfRegional + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr15 div').text(parent.lang.report_outOfLine + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr16 div').text(parent.lang.report_InadequateOrTooLongRoadTravelTime + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr17 div').text(parent.lang.report_routeDeviation + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr18 div').text(parent.lang.report_VSSFailure + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr19 div').text(parent.lang.report_abnormalFuel + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr20 div').text(parent.lang.report_antitheftDevice + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr21 div').text(parent.lang.report_illegalIgnition + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr22 div').text(parent.lang.report_illegalDisplacement + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr23 div').text(parent.lang.report_rollover + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr24 div').text(parent.lang.report_nightdriving + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr25 div').text(parent.lang.rule_alarm_overspeed + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr26 div').text(parent.lang.report_alarm_type_acc + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr27 div').text(parent.lang.alarm_type_fatigue + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr28 div').text(parent.lang.report_areaOverSpeed_platform + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr29 div').text(parent.lang.report_areaLowSpeed_platform + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr30 div').text(parent.lang.report_areaInOut_platform + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr31 div').text(parent.lang.report_lineInOut_platform + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr32 div').text(parent.lang.report_overSpeed_platform + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr33 div').text(parent.lang.report_lowSpeed_platform + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr34 div').text(parent.lang.report_fatigue_platform + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr35 div').text(parent.lang.report_parkTooLong_platform + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr36 div').text(parent.lang.report_areaPoint_platform + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr37 div').text(parent.lang.report_lineOverSpeed_platform + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr38 div').text(parent.lang.report_lineLowSpeed_platform + "/" + parent.lang.report_handled);
		$('.hDivBox .countStr39 div').text(parent.lang.report_roadLvlOverSpeed_platform + "/" + parent.lang.report_handled);
	}
	if(type != 'monthly') {
		$('#select-selecttime li').each(function() {
			var index= $(this).attr('data-index');
			$(this).on('click',function() {
				var ttype = 1;
				if(type == 'daily'){
					ttype = 2;
				}
				selectTime(index, ttype);
			});
			if(index == 0) {
				$(this).click();
			}
		});
	}
	$('#alarmSummaryTable').flexClear();
}

function showDate(show) {
	if(show) {
		$('#toolbar-date').show();
		$('.hDiv .date').show();
		$('.hDiv .date').removeAttr('hidden');
	}else {
		$('#toolbar-date').hide();
		$('.hDiv .date').hide();
		$('.hDiv .date').attr('hidden', 'hidden');
	}
}

function changeStructure(){
	var handled = $('#hidden-handleStatus').val();
	$('#alarmSummaryTable').flexClear();
	if($("#container").css('display') != "none"){
		$("#container").hide();
		$('.flexigrid .bDiv').height($('.flexigrid .bDiv').height() + 256 < 0 ? 0 : $('.flexigrid .bDiv').height() + 256);
	}
	if(handled == '0'){
		$("#labelSelectVehicle").text(parent.lang.labelVehicle);
		$('.hDivBox .vehiIdno div').text(parent.lang.report_vehiIdno);
		$('#selectName').empty();
		$('#selectName').flexPanel({
			InputModel : {display: parent.lang.selectVehicleTip,value:'',name : 'vehiIdnos', pid : 'vehiIdnos', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
		});
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$('#hidden-vehiIdnos').val('');
		$('#toolbar-plateType').show();
		$('.hDiv .plateType').show();
		$('.hDiv .plateType').removeAttr('hidden');
	}else if(handled == '1'){
		$("#labelSelectVehicle").text(parent.lang.labelCompany);
		$('#selectName').empty();
		$('#selectName').flexPanel({
			InputModel : {display: parent.lang.selectCompanyTip,value:'',name : 'vehiIdnos', pid : 'vehiIdnos', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
		});
		$('#combox-vehiIdnos').on('click keyup',selCompany);
		$('.hDivBox .vehiIdno div').text(parent.lang.company_name);
		$('#toolbar-plateType').hide();
		$('.hDiv .plateType').hide();
		$('.hDiv .plateType').attr('hidden', 'hidden');
	}
}

var selIds;
//选择公司
function selCompany() {
	$.dialog({id:'info', title:parent.lang.selectCompanyTitle,content: 'url:StatisticalReports/selectInfo.html?type=selCompany&singleSelect=false&selectAll=true&level=0',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}


function doSelectCompany(ids,companyList) {
	if(ids != null && ids == '0') {
		$('#combox-vehiIdnos').val(parent.lang.all_companies);
		$('#hidden-vehiIdnos').val(getNewArrayByArray(parent.vehiGroupList,'id').toString());
	}else {
		selIds = ids;
		if(ids != null && ids.split(',').length > 0) {
			if(ids.split(',').length > 1) {
				$('#combox-vehiIdnos').val(parent.lang.isSelected + ids.split(',').length);
			}else {
				$('#combox-vehiIdnos').val(companyList);
			}
		}
		$('#hidden-vehiIdnos').val(ids);
	}
	$.dialog({id:'info'}).close();
}