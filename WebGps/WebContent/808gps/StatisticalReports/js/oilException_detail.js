var graph,contain,options,gdata;
var isGraph = false;
$(document).ready(function(){
	setTimeout(loadOilExceptionDetailPage, 50);
	(function basic_time(container) {
		contain = container;
		options = {
			HtmlText: false,
			title: parent.lang.fuelSpeedCurve,
	//		subtitle: 'You can save me as an image',
			legend: {
				position: 'nw'
			},
			xaxis: {
				title: parent.lang.report_date,
				labelsAngle: 45,
				noTicks:24,                                   //当使用自动增长时,x轴刻度的个数
				mode: 'time',
				color: '#000000',
				tickFormatter: function(n) {
					return dateFormat2TimeString(new Date(parseInt(n)));
				}
			},
			yaxis: {
				ticks: [ [-100,"-100"], [0,"0"], [100,"100"], [200,"200"], [300,"300"],[400,"400"]],
				mode: 'normal',
				color: '#00A8F0',
				noTicks:null,
				min: -100,             
				max: 400,
				title: parent.lang.fuelCurve,
				labelsAngle: 45,
				tickDecimals:2
			},
			y2axis: {
				ticks: [ [0,"0"], [50,"50"], [100,"100"], [150,"150"], [200,"200"],[250,"250"],[300,"300"] ],
				color: '#FF0000',
				noTicks:null,
				min: 0,            
				max: 300,
				title: parent.lang.speedCurve + gpsGetLabelSpeedUnit(),
				mode: 'normal',
				labelsAngle: 45,
				tickDecimals:2
			},
			selection: {
				mode: 'xy'
			},
			mouse:{
				  track: true,          // => 为true时,当鼠标移动到每个折点时,会显示折点的坐标
				  trackAll: true,       // => 为true时,当鼠标在线条上移动时,显示所在点的坐标
				  position: '',        // => 鼠标事件显示数据的位置 (default south-east)
				  relative: true,       // => 当为true时,鼠标移动时,即使不在线条上,也会显示相应点的数据
				//  trackFormatter: Flotr.defaultTrackFormatter, // => formats the values in the value box
				  trackFormatter: function(e) {
					  return"("+dateFormat2TimeString(new Date(parseInt(e.x)))+", "+e.y+")";
				  },
				  margin: 5,             // => margin in pixels of the valuebox
				  lineColor: '#FF3F19',  // => 鼠标移动到线条上时,点的颜色
				  trackDecimals: 0,      // => 数值小数点后的位数
				  sensibility: 2,        // => 值越小,鼠标事件越精确
				  trackY: true,          // => whether or not to track the mouse in the y axis
				  radius: 3,             // => radius of the track point
				  fillColor: null,       // => color to fill our select bar with only applies to bar and similar graphs (only bars for now)
				  fillOpacity: 0.4       // => o
			}
		};
		// Draw graph with default options, overwriting with passed options
		Flotr.EventAdapter.observe(container, 'flotr:select', function(area) {
			// Draw selected area
			graph = drawGraph({
				xaxis: {
					title: parent.lang.report_date,
					min: area.x1,
					max: area.x2,
					noTicks:24,
					mode: 'time',
					labelsAngle: 45,
					tickFormatter: function(n) {
						return dateFormat2TimeString(new Date(parseInt(n)));
					}
				},
				yaxis: {
					color: '#00A8F0',
					title: parent.lang.fuelCurve,
					min: area.y1,
					max: area.y2,
					noTicks: 10,
					mode: 'normal',
					labelsAngle: 45,
					tickDecimals:2
				},
				y2axis: {
					color: '#FF0000',
					title: parent.lang.speedCurve + gpsGetLabelSpeedUnit(),
					noTicks: 10,
					min: area.y3,
					max: area.y4,
					mode: 'normal',
					labelsAngle: 45,
					tickDecimals:2
				}
			});
		});

		// When graph is clicked, draw the graph with default area.
		Flotr.EventAdapter.observe(container, 'flotr:click', function() {
			graph = drawGraph();
		});
	})(document.getElementById("oilExceptionDetail-render"));
});

function drawGraph(opts) {
	// Clone the options, so the 'options' variable always keeps intact.
	var o = Flotr._.extend(Flotr._.clone(options), opts || {});

	 this.CurrentExample = function(operation) {
		var format = $('#image-download input:radio[name=format]:checked').val();
		if (Flotr.isIE && Flotr.isIE < 9) {
			alert(parent.lang.errInfo);
		}
		if (operation == 'to-image') {
			graph.download.saveImage(format, null, null, true);
		} else if (operation == 'download-image') {
			graph.download.saveImage(format);
		} else if (operation == 'reset-image') {
			graph.download.restoreCanvas();
		}
	};
	// Return a new graph.
	return Flotr.draw(contain, gdata, o);
}

function doAjaxList(json) {
	var
	d1 = [], d2 = [], x, y1, y2;
	if(json != null){
		$.each(json, function (i, fn) {
			x = dateStrLongTime2Date(dateTime2TimeString(fn.armTimeStart)).getTime();
			if (fn.armType == 46) {
				y1 = gpsGetYouLiang(fn.armInfo);
			} else {
				y1 = "-" + gpsGetYouLiang(fn.armInfo);
			}
			y2 = gpsGetSpeed(fn.startSpeed, fn.startStatus1);
			d1.push([x,y1]);
			d2.push([x,y2]);
		});
	}
	gdata = [
		{
			data: d1,
			label: parent.lang.fuelCurve,
			yaxis: 1,
			color: '#00A8F0',
			lines: {
				fill: false,
				lineWidth: 2
			}
		},{
			data: d2,
			label: parent.lang.speedCurve + gpsGetLabelSpeedUnit(),
			yaxis: 2,
			color: '#EEEEEE',
			lines: {
				show: true,
				lineWidth: 1
			}
		}
	];	
	graph = drawGraph();
}

var searchOpt = new searchOption(false, true);

function loadOilExceptionDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadOilExceptionDetailPage, 50);
	} else {
		$('#graph').flexPanel({
			ButtonsModel : [
				[{display: '', name : '', pclass : 'btnGraph',
					bgcolor : 'blue', hide : false}]
			]
		});
		buttonQueryOrExport();
		$('#select-oilType').flexPanel({
			ComBoboxModel :{
				button :
				[
					[{
						display: parent.lang.all, name : 'oilType', pid : 'oilType', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]
				],
				combox: {name : 'oilType', option : arrayToStr(getOilTypes())}
			}	
		});
		$('#toolbar-graph').flexPanel({
			ButtonsModel : [
				[{display: '', name : 'to-image', pclass : 'toImage',
					bgcolor : 'gray', hide : false}],
				/*[{display: '', name : 'download-image', pclass : 'downloadImage',
					bgcolor : 'gray', hide : false}],*/
				[{display: '', name : 'reset-image', pclass : 'resetImage',
					bgcolor : 'gray', hide : false}]
			]
		});
		$('#graph').hide();
		$('#toolbar-graph .y-btn').each(function() {
			$(this).attr('onclick',"CurrentExample('"+$(this).attr('data-cn')+"')");
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
		loadOilExceptionDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(queryOilExceptionDetail);
		$(".btnExport").click(exportOilExceptionDetail);
		$(".btnExportCSV").click(exportOilExceptionDetailCSV);
		$(".btnExportPDF").click(exportOilExceptionDetailPDF);
		var width = 0;
		if(parent.screenWidth >= 1360) {
			width = 'auto';
		}else {
			width = 1060;
			$('#sysuserLogDate').css('width','1100px');
		}
		$("#oilExceptionDetailTable").flexigrid({
			url: "StandardReportOilAction_exceptionDetail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.plate_number, name : 'vehiIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_plate_color, name : 'plateType', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'armTimeStart', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_positionCurrent, name : 'position', width : 250, sortable : false, align: 'center'},
				{display: parent.lang.report_lichengCurrent + gpsGetLabelLiChengUnit(), name : 'liCheng', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_oil_change, name : 'youLiang', width : 120, sortable : false, align: 'center'}
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
		
		$('.btnGraph').on('click',function(){
			loadReportTableWidth(fixHeight);
			var text = $(this).find('.label').text();
			if(text == parent.lang.graph) {
				$(this).find('span').text(parent.lang.report);
				isGraph = true;
				$("#oilExceptionDetailGraph").show();
				$(".flexigrid").hide();
				doAjaxList(null);
			}else {
				$(this).find('span').text(parent.lang.graph);
				isGraph = false;
				$("#oilExceptionDetailGraph").hide();
				$(".flexigrid").show();
			}
		});
	}
}


function fixHeight() {
	$('#oilExceptionDetailTable').flexFixHeight();
}

function loadOilExceptionDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navOilExceptionDetail);
	$("#labeOilType").text(parent.lang.report_labelLoginType);
	$("#download-instructions").text(parent.lang.download_instructions);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryOilExceptionDetail() {
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
		name: 'oilType',
		value: $("#hidden-oilType").val()
	});
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	if(isGraph) {
		queryGraph(params);
	}else {
		$('#oilExceptionDetailTable').flexOptions(
				{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
	}
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
	}else if(name == 'armTimeStart'){
		pos = dateTime2TimeString(row[name]);
	}else if (name == 'position') {
		pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + row['vehiIdno'] + "', '" + row['startJingDu'] + "', '" + row['startWeiDu'] + "');\">" + changeNull(row['startPosition']) + "</a>";
	}else if((name == 'liCheng')){
		pos = gpsGetLiCheng(row['startLiCheng']);
	}else if(name == 'youLiang') {
		if (row['armType'] == 46) {
			pos = gpsGetYouLiang(row['armInfo']);
		} else {
			pos = "-" + gpsGetYouLiang(row['armInfo']);
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
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	document.reportForm.action = "StandardReportOilAction_detailExcel.action?toMap="+toMap+"&exportType="+exportType+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val();
	document.reportForm.submit(); 
}
//导出至excel，导出至csv，导出至pdf
function exportOilExceptionDetail() {
	exportReport(1);
}

function exportOilExceptionDetailCSV() {
	exportReport(2);
}

function exportOilExceptionDetailPDF() {
	exportReport(3);
}

var selIds;
//选择车辆
function selVehicle() {
	$.dialog({id:'info', title:parent.lang.selectVehicleTitle,content: 'url:StatisticalReports/selectInfo.html?type=selVehicle&singleSelect=false&selectAll=true&isOil=true',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}

function doSelectVehicle(ids,vehicleList) {
	if(ids != null && ids == '0') {
		$('#combox-vehiIdnos').val(parent.lang.all_vehicles);
		$('#hidden-vehiIdnos').val(getNewArrayByArray(parent.vehiOilList,'name').toString());
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

function queryGraph(params) {
	params.push({
		name: 'pagin',
		value : ''
	});
	params.push({
		name: 'type',
		value : 'graph'
	});
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.ajax({
		type: 'POST',
		url: 'StandardReportOilAction_exceptionDetail.action',
		data: params,
		dataType: 'json',
		success: function (data) {
			if(data.result == 0){
				doAjaxList(data.infos);
				$.myajax.showLoading(false);
				disableForm(false);
			}else if (data.result == 2) {
				//直接跳转到登录界面
				top.window.location = "login.html";
			} else {
				doAjaxList(data.infos);
				disableForm(false);
				$.myajax.showLoading(false);
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			try {
				if (p.onError) p.onError(XMLHttpRequest, textStatus, errorThrown);
			} catch (e) {}
			disableForm(false);
			$.myajax.showLoading(false);
		}
	});
	
}

//初始化油量类型选项
function getOilTypes() {
	var types = [];
	types.push({id:0,name:parent.lang.all});
	types.push({id:1,name:parent.lang.report_oil_add});
	types.push({id:2,name:parent.lang.report_oil_reduce});
	return types;
}