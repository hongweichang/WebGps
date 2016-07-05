$(document).ready(function(){
	setTimeout(loadFenceSummaryPage, 50);
});
var infoType = 0;

var searchOpt = new searchOption(false,false,false,true);

function loadFenceSummaryPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadFenceSummaryPage, 50);
	} else {
		buttonQueryOrExport();
		
		$('#selectName').flexPanel({
			InputModel : {display: parent.lang.selectVehicleTip,value:'',name : 'vehiIdnos', pid : 'vehiIdnos', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
		});
		$('#combox-vehiIdnos').val(parent.lang.all_vehicles);
		$('#hidden-vehiIdnos').val(getNewArrayByArray(parent.vehicleList,'id').toString());
		//加载语言
		loadFenceSummaryLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(queryFenceSummary);
		$(".btnExport").click(exportFenceSummary);
		$(".btnExportCSV").click(exportFenceSummaryCSV);
		$(".btnExportPDF").click(exportFenceSummaryPDF);
		
		$('#container').width($(window).width() - 20 - 10);
		
		var width = 0;
		if(Math.round(6 * parent.screenWidth/7) - 25 >= 1360) {
			width = 'auto';
		}else {
			width = 1060;
			$('#sysuserLogDate').css('width','1100px');
		}
		$("#fenceSummaryTable").flexigrid({
			url: "StandardReportLineAction_summary.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.plate_number, name : 'vn', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_plate_color, name : 'pt', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.monitor_task_date, name : 'dt', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.rule_line, name : 'ln', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.total_trip, name : 'tc', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_alarm_total_times, name : 'wt', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_licheng_all, name : 'lc', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_oil_all, name : 'yh', width : 120, sortable : false, align: 'center'}
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
			idProperty: 'lid',
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: width,
			onSubmit: false,
			onSuccess: loadSuccess,
			height: 'auto'
		});
		loadReportTableWidth(fixHeight);
	}
}

function fixHeight() {
	$('#fenceSummaryTable').flexFixHeight();
	if(window.screen.height < 800) {
		$('.flexigrid .bDiv').height($('.flexigrid .bDiv').height()+50);
	}
}

var summaryRanks = null;
var a1=[],a2=[],a3=[];
function loadSuccess() {
	var data = $("#fenceSummaryTable").flexGetData();
	summaryRanks = null;
	a1=[];a2=[];a3=[];
	summaryRanks = data.summaryRanks;
	if(summaryRanks){
		for (var i = 0; i < summaryRanks.length; i++) {
			a3.push(getArrayName(parent.vehicleList, summaryRanks[i].vn) + " " + summaryRanks[i].dt.substring(0,7));
			a2.push(summaryRanks[i].tc);
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
	title_2=parent.lang.vehicle_analysis_chart
	title_=parent.lang.before + summaryRanks.length + parent.lang.vehicle_violation
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
	                text: parent.lang.trip_line,
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
	            name: parent.lang.trip_violations,
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
	            name: parent.lang.ranking_vehicle,
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

function loadFenceSummaryLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_trip_vehicle_month);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryFenceSummary() {
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
		value: 'vehi'
	});
	params.push({
		name: 'status',
		value: 'monthly'
	});
	$('#fenceSummaryTable').flexOptions(
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
	}else if(name == 'dt'){
		pos = row[name].substring(0,7);
	}else if(name == 'lc'){
		pos = gpsGetLiCheng(row[name]);
	}else if(name == 'yh'){
		pos = gpsGetYouLiang(row[name]);
	}else if(name == 'wt'){
		pos = gpsFormatSecond2Time(row[name]);
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
	document.reportForm.action = "StandardReportLineAction_summaryExcel.action?exportType="+exportType+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val()+"&type=vehi&status=monthly";
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

function doExit() {
	$.dialog({id:'info'}).close();
}

var selIds;

function selVehicle() {
	$.dialog({id:'info', title:parent.lang.selectVehicleTitle,content: 'url:StatisticalReports/selectInfo.html?type=selVehicle&singleSelect=false&selectAll=true&isOil=false',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}

function doSelectVehicle(ids,vehicleList) {
	if(ids == null || ids == '0') {
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