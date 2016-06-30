$(document).ready(function(){
	setTimeout(loadFenceSummaryPage, 50);
});
var infoType = 0;

var searchOpt = new searchOption(false, true);

function loadFenceSummaryPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadFenceSummaryPage, 50);
	} else {
		buttonQueryOrExport();
		$('#search-list .storage a').text(parent.lang.report_summary_graph);
		$('#search-list .offline a').text(parent.lang.report_rank_figure);
		//切换事件列表
		$("#search-list li").click(function(){
			infoType = $(this).index();
			$(this).addClass("active").siblings().removeClass("active");
			$("#search-table li").eq(infoType).addClass("active").siblings().removeClass("active");
			if(infoType == 0){
				$('#container').hide();
			}else{
				if(summaryRanks){
					$("#container").show();
					$("#container6").hide();
				}else{
					$("#container6").show();
					$("#container").hide();
				}
				if(summaryRanks){
					generateSummaryRank();
				}
//				$('#container .highcharts-container').css("width","96%");
			}
		});
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
		loadFenceSummaryLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(queryFenceSummary);
		$(".btnExport").click(exportFenceSummary);
		$(".btnExportCSV").click(exportFenceSummaryCSV);
		$(".btnExportPDF").click(exportFenceSummaryPDF);
		
		$('#container').width($(window).width() - getLeft($('#search-list').get(0)) - $('#search-list').width() - 20);
		
		var width = 0;
		if(Math.round(6 * parent.screenWidth/7) - 25 >= 2380) {
			width = 'auto';
		}else {
			width = 2380;
			$('#sysuserLogDate').css('width','2420px');
		}
		$("#fenceSummaryTable").flexigrid({
			url: "StandardReportAlarmAction_summary.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.report_vehiIdno, name : 'vehiIdno', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_plate_color, name : 'plateType', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.monitor_task_date, name : 'date', width : 120, sortable : false, align: 'center', hide: true},
				{display: parent.lang.report_beginTime, name : 'beginTime', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_endTime, name : 'endTime', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.alarm_type_overspeed + "/" + parent.lang.report_alarm_total_times, name : 'countStr0', width : 200, sortable : false, align: 'center'},
				{display: parent.lang.report_overSpeed_platform + "/" + parent.lang.report_alarm_total_times, name : 'countStr1', width : 200, sortable : false, align: 'center'},
				{display: parent.lang.report_lowSpeed_platform + "/" + parent.lang.report_alarm_total_times, name : 'countStr2', width : 200, sortable : false, align: 'center'},
				{display: parent.lang.report_parkTooLong_platform + "/" + parent.lang.report_alarm_total_times, name : 'countStr3', width : 200, sortable : false, align: 'center'},
				{display: parent.lang.report_fatigue_platform + "/" + parent.lang.report_alarm_total_times, name : 'countStr4', width : 200, sortable : false, align: 'center'},
				{display: parent.lang.alarm_type_nightdriving + "/" + parent.lang.report_alarm_total_times, name : 'countStr5', width : 200, sortable : false, align: 'center'},
				{display: parent.lang.report_cumulativeDayDrivingTimeout + "/" + parent.lang.report_alarm_total_times, name : 'countStr6', width : 200, sortable : false, align: 'center'},
				{display: parent.lang.report_roadLvlOverSpeed_platform + "/" + parent.lang.report_alarm_total_times, name : 'countStr7', width : 200, sortable : false, align: 'center'}
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
			singleSelect: true,
			idProperty: 'vehiIdno',
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: width,
			onSubmit: false,
			onSuccess: loadSuccess,
			height: 'auto'
		});
		loadReportTableWidth(fixHeight);
		
		$("#fenceSummaryTable").flexSelectRowPropFun(function(obj) {
			$('#container3').hide();
			$('#container4').hide();
			$('#container1').show();
			$('#container2').show();
			selectAlarmSumRowProp(obj);
		});
	}
}

function fixHeight() {
	$('#fenceSummaryTable').flexFixHeight();
	if(window.screen.height < 800) {
		$('.flexigrid .bDiv').height($('.flexigrid .bDiv').height()+50);
	}
}

var alarmSumList = new Array();
var summaryRanks = null;
var a1=[],a2=[],a3=[];
function loadSuccess() {
	var data = $("#fenceSummaryTable").flexGetData();
	if(data && data.rows) {
		alarmSumList = data.rows;
	}
	summaryRanks = null;
	a1=[];a2=[];a3=[];
	summaryRanks = data.summaryRanks;
	if(summaryRanks){
		for (var i = 0; i < summaryRanks.length; i++) {
			if(summaryRanks[i].vehiIdno){
				a3.push(summaryRanks[i].vehiIdno);
			}else{
				a3.push(getArrayName(parent.vehiGroupList, summaryRanks[i].companyId));
			}
			a2.push(summaryRanks[i].count);
			a1.push(summaryRanks[i].rank);
		}
		generateSummaryRank();
	}else{
		$("#container6").show().css("width","96%");
		$("#container").hide();
	}
}

var chart;

function generateSummaryRank(){
	var title_='',title_2='',title_3='';
	if($('#hidden-handleStatus').val() == '1'){
		title_2=parent.lang.organization_analysis_chart
		title_=parent.lang.before + summaryRanks.length + parent.lang.organization_violation
	}else{
		title_2=parent.lang.vehicle_analysis_chart
		title_=parent.lang.before + summaryRanks.length + parent.lang.vehicle_violation
	}
	$("#container").show().css("width","96%");
	$("#container6").hide().css("width","96%");
	chart = new Highcharts.Chart( {
			chart: {
				renderTo: 'container',
	            //zoomType: 'xy'
	        },
	        title: {
	            text: title_2
	        },
	        subtitle: {
	            text: title_
	        },
	        xAxis: [{
	            categories:a3,
	            labels: {
	                rotation: -10,
	                align: 'right',
	                style: {
	                	color: '#DC143C',
	                    fontSize: '12px',
	                    fontWeight: 'bold'
	                }
	            }
	        }],
	        yAxis: [{ // Primary yAxis
	            labels: {
	                format: '{value}',
	                style: {
	                    color: '#89A54E'
	                }
	            },
	            title: {
	                text: parent.lang.places,
	                style: {
	                    color: '#89A54E'
	                }
	            }
	        }, { 
	            title: {
	                text: parent.lang.alarm_violations,
	                style: {
	                    color: '#4572A7'
	                }
	            },
	            opposite: true
	        }],
	        tooltip: {
	            shared: true
	        },
	        legend: {
	            layout: 'vertical',
	            align: 'right',
                verticalAlign: 'top',
	            x: -120,
	            floating: true,
	            backgroundColor: '#FFFFFF'
	        },
	        series: [{
	            name: parent.lang.total_violations,
	            color: '#4572A7',
	            type: 'column',
	            yAxis: 1,
	            data: a2,
	            dataLabels: {
	                enabled: true,
	                color: '#FF0000',
	                style: {
	                    fontSize: '13px'
	                }
	            },
	            tooltip: {
	                valueSuffix: parent.lang.count_violations
	            }

	        }, {
	            name: parent.lang.ranking_violation,
	            color: '#89A54E',
	            type: 'spline',
	            data: a1,
	            dataLabels: {
	                enabled: true,
	                color: '#191970',
	                style: {
	                    fontSize: '13px'
	                }
	            },
	            tooltip: {
	                valueSuffix: parent.lang.places_violations
	            }
	        }]

	});
}

function selectAlarmSumRowProp(obj) {
	var idno = $(obj).attr("data-id");
	for (var i = 0; i < alarmSumList.length; i++) {
		if(alarmSumList[i].vehiIdno == idno) {
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
				  for (var j = 0; j < 8; j++) {
					  a.push(parseInt(alarmSumList[i].countStrs[j].split("/")[0]));
					  _totle = _totle + parseInt(alarmSumList[i].countStrs[j].split("/")[0]);
				  }
			  }else {
				  if(alarmSumList[i].counts) {
					  for (var j = 0; j < 8; j++) {
						  a.push(parseInt(alarmSumList[i].counts[j]));
						  _totle = _totle + parseInt(alarmSumList[i].counts[j]);
					  }
				  }
			  }
			 
			  var b1_ratio,b2_ratio,b3_ratio,b4_ratio,b5_ratio,b6_ratio,b7_ratio,b8_ratio; 
			  if(_totle == 0){
				  b1_ratio = 0;
				  b2_ratio = 0;
				  b3_ratio = 0;
				  b4_ratio = 0;
				  b5_ratio = 0;
				  b6_ratio = 0;
				  b7_ratio = 0;
				  b8_ratio = 0;
			  }else{
				  b1_ratio = a[0]/_totle;
				  b2_ratio = a[1]/_totle;
				  b3_ratio = a[2]/_totle;
				  b4_ratio = a[3]/_totle;
				  b5_ratio = a[4]/_totle;
				  b6_ratio = a[5]/_totle;
				  b7_ratio = a[6]/_totle;
				  b8_ratio = a[7]/_totle;
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
			  chart1 = new Highcharts.Chart({
		           chart: {
		               renderTo: 'container1',
		               plotBackgroundColor: null,
		               plotBorderWidth: null,
		               plotShadow: false
		           },
		           title: {
		               text: title + ' ' +parent.lang.report_statistics_total_scale
		           },
		           tooltip: {
		        	   pointFormat: '{series.name}: <b>{point.percentage}%</b>',
		        	   percentageDecimals: 1
		           },
		           plotOptions: {
		               pie: {
		                   allowPointSelect: true,
		                   cursor: 'pointer',
		                   dataLabels: {
		                       enabled: false
		                   },
		                   showInLegend: true
		               }
		            },
		            series: [{
		                type: 'pie',
		                name: parent.lang.report_proportion,
		                data: [
		                    [parent.lang.alarm_type_overspeed,   b1_ratio],
		                    [parent.lang.report_overSpeed_platform,   b2_ratio],
		                    [parent.lang.report_lowSpeed_platform,   b3_ratio],
		                    [parent.lang.report_parkTooLong_platform,   b4_ratio],
		                    [parent.lang.report_fatigue_platform,   b5_ratio],
		                    [parent.lang.alarm_type_nightdriving,   b6_ratio],
		                    [parent.lang.report_cumulativeDayDrivingTimeout,   b7_ratio],
		                    [parent.lang.report_roadLvlOverSpeed_platform,   b8_ratio]
		                ]
		            }]
		        });
			  chart2 = new Highcharts.Chart({
		            chart: {
		                renderTo: 'container2',
		                type: 'column'
		            },
		            title: {
		                text: title + ' ' +parent.lang.report_statistics_total
		            },
		            xAxis: {
		                categories: [parent.lang.alarm_type_overspeed,parent.lang.report_overSpeed_platform,parent.lang.report_lowSpeed_platform,
		                             parent.lang.report_parkTooLong_platform,parent.lang.report_fatigue_platform,parent.lang.alarm_type_nightdriving,
		                             parent.lang.report_cumulativeDayDrivingTimeout,parent.lang.report_roadLvlOverSpeed_platform],
                     labels: {
    		             rotation: -20,
    		             align: 'right',
    		             style: {
    		                 fontSize: '10px',
    		                 fontFamily: 'Verdana, sans-serif',
    		             }
    		         	}
		            },
		            yAxis: {
			            min: 0,
			            title: {
			                text: parent.lang.report_alarm_count_number
			            },
			            style: {
			                fontFamily: 'Verdana, sans-serif',
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
		                enabled: false
		            },
		            series: [{
		            	name: parent.lang.report_alarm_count_number,
		                data: a,
		                dataLabels: {
		                       enabled: true,
		                       align: 'center',
		                       align: 'center',
		                       rotation: 0,
		                       y: 0,
		                       style: {
		                           fontSize: '13px',
		                           fontFamily: 'Verdana, sans-serif',
		                       }
		                }
		            }]
		       });
		}
	}
}

function loadFenceSummaryLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_driving_summary);
	$("#labelType").text(parent.lang.report_labelLoginType);
	$("#labelhandled").text(parent.lang.report_alarm_structure);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryFenceSummary() {
	$('#container1').hide();
	$('#container2').hide();
	$('#container3').show();
	$('#container4').show();
	if(infoType == 0){
		$('#container').hide();
	}else{
		if(summaryRanks){
			$("#container").show();
			$("#container6").hide();
		}else{
			$("#container6").show();
			$("#container").hide();
		}
//		$('#container .highcharts-container').css("width","96%");
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
		name: 'type',
		value: 'driving'
	});
	params.push({
		name: 'handleStatus',
		value: $('#hidden-handleStatus').val()
	});
	params.push({
		name: 'status',
		value: $.trim($('#hidden-status').val())
	});
	$('#fenceSummaryTable').flexOptions(
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

	if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
		alert(parent.lang.report_selectVehiNullErr);
		return;
	}
	document.reportForm.action = "StandardReportAlarmAction_summaryExcel.action?exportType="+exportType+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val()+"&type=driving";
	document.reportForm.submit();  
}
//导出至excel，导出至csv，导出至pdf
function exportFenceSummary() {
	exportReport(1);
}

function exportFenceSummaryCSV() {
	exportReport(2);
}

function exportFenceSummaryPDF() {
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
	$('#container1').hide();
	$('#container2').hide();
	$('#container').hide();
	$('#container3').show();
	$('#container4').show();
	$('#container6').show();
	$('#fenceSummaryTable').flexClear();
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
		$("#search-list").hide();
		$("#search-table").css('margin-left', '20px');
		$("#container1").css('width','48%');
		$("#container2").css('width','48%');
		$("#container3").css('width','48%');
		$("#container4").css('width','48%');
		$("#container").css('width','98%');
		$("#container6").css('width','98%');
		$("#search-table li").eq(0).addClass("active").siblings().removeClass("active");
		$('.hDivBox .countStr0 div').text(parent.lang.alarm_type_overspeed);
		$('.hDivBox .countStr1 div').text(parent.lang.report_overSpeed_platform);
		$('.hDivBox .countStr2 div').text(parent.lang.report_lowSpeed_platform);
		$('.hDivBox .countStr3 div').text(parent.lang.report_parkTooLong_platform);
		$('.hDivBox .countStr4 div').text(parent.lang.report_fatigue_platform);
		$('.hDivBox .countStr5 div').text(parent.lang.alarm_type_nightdriving);
		$('.hDivBox .countStr6 div').text(parent.lang.report_cumulativeDayDrivingTimeout);
		$('.hDivBox .countStr7 div').text(parent.lang.report_roadLvlOverSpeed_platform);
	}else{
		$("#search-list").show();
		$("#search-table").css('margin-left', '152px');
		$("#container1").css('width','48%');
		$("#container2").css('width','48%');
		$("#container3").css('width','48%');
		$("#container4").css('width','48%');
		$("#container").css('width','96%');
		$("#container6").css('width','96%');
		$("#search-table li").eq(infoType).addClass("active").siblings().removeClass("active");
		$('.hDivBox .countStr0 div').text(parent.lang.alarm_type_overspeed + "/" + parent.lang.report_handled + "/" + parent.lang.report_alarm_total_times);
		$('.hDivBox .countStr1 div').text(parent.lang.report_overSpeed_platform + "/" + parent.lang.report_handled + "/" + parent.lang.report_alarm_total_times);
		$('.hDivBox .countStr2 div').text(parent.lang.report_lowSpeed_platform + "/" + parent.lang.report_handled + "/" + parent.lang.report_alarm_total_times);
		$('.hDivBox .countStr3 div').text(parent.lang.report_parkTooLong_platform + "/" + parent.lang.report_handled + "/" + parent.lang.report_alarm_total_times);
		$('.hDivBox .countStr4 div').text(parent.lang.report_fatigue_platform + "/" + parent.lang.report_handled + "/" + parent.lang.report_alarm_total_times);
		$('.hDivBox .countStr5 div').text(parent.lang.alarm_type_nightdriving + "/" + parent.lang.report_handled + "/" + parent.lang.report_alarm_total_times);
		$('.hDivBox .countStr6 div').text(parent.lang.report_cumulativeDayDrivingTimeout + "/" + parent.lang.report_handled + "/" + parent.lang.report_alarm_total_times);
		$('.hDivBox .countStr7 div').text(parent.lang.report_roadLvlOverSpeed_platform + "/" + parent.lang.report_handled + "/" + parent.lang.report_alarm_total_times);
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
	$('#fenceSummaryTable').flexClear();
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
	$('#container1').hide();
	$('#container2').hide();
	$('#container').hide();
	$('#container3').show();
	$('#container4').show();
	$('#container6').show();
	$('#fenceSummaryTable').flexClear();
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