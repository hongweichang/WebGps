var graph,contain,options,gdata;
$(document).ready(function(){
	setTimeout(loadTrackDetailPage, 50);
	(function basic_time(container) {
		contain = container;
		options = {
			HtmlText: false,
			title: parent.lang.report_speed_curve,
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
				ticks: [ [0,"0"], [30,"30"], [60,"60"], [90,"90"], [120,"120"],[150,"150"],[180,"180"] ],
				color: '#00A8F0',
				noTicks:null,
				min: 0,            
				max: 180,
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
				  trackDecimals: 2,      // => 数值小数点后的位数
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
					title: parent.lang.speedCurve + gpsGetLabelSpeedUnit(),
					min: area.y1,
					max: area.y2,
					noTicks: 10,
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
	})(document.getElementById("speedDetail-render"));
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
	d = [], x, y;
	if(json != null){
		$.each(json, function (i, fn) {
			x = dateStrLongTime2Date(fn.gpsTime).getTime();
			y = gpsGetSpeed(fn.speed, fn.status1);
			if(y != null && y != '') {
				d.push([x,y]);
			}
		});
	}
	gdata = [
		{
			data: d,
			label: parent.lang.speedCurve + gpsGetLabelSpeedUnit(),
			yaxis: 1,
			color: '#00A8F0',
			lines: {
				show: true,
				lineWidth: 2
			}
		//	,points: {
		//		show: true
		//	}
		}
	];	
	graph = drawGraph();
}

var searchOpt = new searchOption(false, true, true);

function loadTrackDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadTrackDetailPage, 50);
	} else {
		buttonQueryOrExport();
		
		$('#toolbar-graph').flexPanel({
			ButtonsModel : [
				[{display: '', name : 'to-image', pclass : 'toImage',
					bgcolor : 'gray', hide : false}],
				[{display: '', name : 'reset-image', pclass : 'resetImage',
					bgcolor : 'gray', hide : false}]
			]
		});
		
		$('#select-distance').flexPanel({
			ComBoboxModel :{
				button :
				[
					[{
						display: 0+ gpsGetDistanceUnit(true), name : 'distance', pid : 'distance', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]
				],
				combox: {name : 'distance', option : arrayToStr(getDistances())}
			}	
		});
		$('#select-time').flexPanel({
			ComBoboxModel :{
				button :
				[
					[{
						display: 0+ parent.lang.report_park_second, name : 'time', pid : 'time', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]
				],
				combox: {name : 'time', option : arrayToStr(getTimes())}
			}	
		});
		$('#select-speed').flexPanel({
			ComBoboxModel :{
				button :
				[
					[{
						display: 0+ gpsGetSpeedUnit(), name : 'speed', pid : 'speed', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]
				],
				combox: {name : 'speed', option : arrayToStr(getSpeeds())}
			}	
		});
		$('#selectName').flexPanel({
			InputModel : {display: parent.lang.selectVehicleTip,value:'',name : 'vehiIdnos', pid : 'vehiIdnos', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
		});
		
		$('#selecttime').flexPanel({
			ComBoboxModel :{
				input : {name : 'selecttime',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'selecttime', option : arrayToStr(getSelectTime(2))}
			}	
		});

		$('#toolbar-graph .y-btn').each(function() {
			$(this).attr('onclick',"CurrentExample('"+$(this).attr('data-cn')+"')");
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
		loadTrackDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(queryTrackDetail);
		$(".btnExport").click(exportTrackDetail);
		$(".btnExportCSV").click(exportTrackDetailCSV);
		$(".btnExportPDF").click(exportTrackDetailPDF);
		var width = 0;
		if(parent.screenWidth >= 1360) {
			width = 'auto';
		}else {
			width = 1060;
			$('#sysuserLogDate').css('width','1100px');
		}
		
		$("#trackDetailTable").flexigrid({
			url: "StandardReportLiChengAction_track.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.plate_number, name : 'vehiIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_plate_color, name : 'plateType', width : 60, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'gpsTime', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_licheng_lichengTotal + gpsGetLabelLiChengUnit(), name : 'liCheng', width : 100, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_positionCurrent, name : 'position', width : 250, sortable : false, align: 'center'},
				{display: parent.lang.report_speed + gpsGetLabelSpeedUnit(), name : 'speed', width : 200, sortable : false, align: 'center'}
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
		
		var width_ = $(window).width();
		$('.queryGraph-render').width(width_ - 80);
		$('.queryGraph-render .flotr-canvas').width(width_ - 80);
		$('.queryGraph-render .flotr-overlay').width(width_ - 80);
		$('.flexigrid').width(width_ - 80);
		doAjaxList(null);
		
		loadReportTableWidth(fixHeight);
	}
}

function fixHeight() {
	$('#trackDetailTable').flexFixHeight();
	if(window.screen.height < 800) {
		$('.flexigrid .bDiv').height($('.flexigrid .bDiv').height()+50);
	}
}

function loadTrackDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navNormalTrackDetail);
	$("#labelDistance").text(parent.lang.report_labelDistance);
	$("#labelTime").text(parent.lang.interval);
	$("#labelSpeed").text(parent.lang.moreThan);
	$("#download-instructions").text(parent.lang.download_instructions);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryTrackDetail() {
	var query = searchOpt.getQueryDataNew(true);
	if (query === null) {
		return ;
	}
	if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
		alert(parent.lang.report_selectVehiNullErr);
		return;
	}
	var params = [];
	params.push({
		name: 'begintime',
		value: query.begindate
	});
	params.push({
		name: 'endtime',
		value: query.enddate
	});	
	params.push({
		name: 'distance',
		value: gpsGetDistanceValue($("#hidden-distance").val())
	});	
	params.push({
		name: 'vehiIdno',
		value: $('#hidden-vehiIdnos').val()
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
		name: 'time',
		value: $("#hidden-time").val()
	});
	params.push({
		name: 'speed',
		value: $("#hidden-speed").val()
	});
	//查询曲线图
	queryGraph(params);
	for (var i = 0; i < params.length; i++) {
		if(params[i].name == 'type') {
			params[i].value = '';
		}
		
	}
	//查询列表
	$('#trackDetailTable').flexOptions(
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
	}else if (name == 'position') {
		pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + row['vehiIdno'] + "', '" + row['jingDu'] + "', '" + row['weiDu'] + "');\">" + changeNull(row[name]) + "</a>";
	}else if((name == 'liCheng')){
		pos = gpsGetLiCheng(row[name]);
	}else if(name == 'speed') {
		pos = gpsGetSpeed(row[name], row['status1']);
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function queryGraph(params) {
	params.push({
		name: 'distance',
		value: gpsGetDistanceValue($("#hidden-distance").val())
	});	
	params.push({
		name: 'pagin',
		value : ''
	});
	params.push({
		name: 'type',
		value : 'graphSpeed'
	});
//	disableForm(true);
//	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.ajax({
		type: 'POST',
		url: 'StandardReportLiChengAction_track.action',
		data: params,
		dataType: 'json',
		success: function (data) {
			if(data.result == 0){
				doAjaxList(data.infos);
//				$.myajax.showLoading(false);
//				disableForm(false);
			}else if (data.result == 2) {
				//直接跳转到登录界面
				top.window.location = "login.html";
			} else {
				doAjaxList(data.infos);
//				disableForm(false);
//				$.myajax.showLoading(false);
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			try {
				if (p.onError) p.onError(XMLHttpRequest, textStatus, errorThrown);
			} catch (e) {}
//			disableForm(false);
//			$.myajax.showLoading(false);
		}
	});
	
}

function exportReport(exportType) {
	var query = searchOpt.getQueryDataNew(true);
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
	document.reportForm.action = "StandardReportLiChengAction_gpstrackExcel.action?toMap="+toMap+"&type=trackDetail&exportType="+exportType+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val();
	document.reportForm.submit();
}
//导出至excel，导出至csv，导出至pdf
function exportTrackDetail() {
	exportReport(1);
}

function exportTrackDetailCSV() {
	exportReport(2);
}

function exportTrackDetailPDF() {
	exportReport(3);
}

var selIds;
//选择车辆
function selVehicle() {
	$.dialog({id:'info', title:parent.lang.selectVehicleTitle,content: 'url:StatisticalReports/selectInfo.html?type=selVehicle&singleSelect=true&isOil=false',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}

function doSelectVehicle(ids,vehicleList) {
	selIds = ids;
	$('#combox-vehiIdnos').val(vehicleList);
	$('#hidden-vehiIdnos').val(vehicleList);
	$.dialog({id:'info'}).close();
}

function doExit() {
	$.dialog({id:'info'}).close();
}


function getDistances() {
	var distances = [];
	distances.push({id:0,name:0+ gpsGetDistanceUnit(true)});
	distances.push({id:0.01,name:10+ gpsGetDistanceUnit(true)});
	distances.push({id:0.1,name:100+ gpsGetDistanceUnit(true)});
	distances.push({id:0.5,name:500+ gpsGetDistanceUnit(true)});
	distances.push({id:1,name:1+ gpsGetDistanceUnit(false)});
	distances.push({id:3,name:3+ gpsGetDistanceUnit(false)});
	distances.push({id:5,name:5+ gpsGetDistanceUnit(false)});
	distances.push({id:10,name:10+ gpsGetDistanceUnit(false)});
	distances.push({id:30,name:30+ gpsGetDistanceUnit(false)});
	return distances;
}

function getTimes() {
	var times = [];
	times.push({id:0,name:0+parent.lang.report_park_second});
	times.push({id:10,name:10+ parent.lang.report_park_second});
	times.push({id:30,name:30+ parent.lang.report_park_second});
	times.push({id:60,name:60+ parent.lang.report_park_second});
	times.push({id:120,name:120+ parent.lang.report_park_second});
	times.push({id:300,name:300+ parent.lang.report_park_second});
	return times;
}

function getSpeeds() {
	var speeds = [];
	speeds.push({id:0,name:0+gpsGetSpeedUnit()});
	speeds.push({id:10,name:10+ gpsGetSpeedUnit()});
	speeds.push({id:20,name:20+ gpsGetSpeedUnit()});
	speeds.push({id:30,name:30+ gpsGetSpeedUnit()});
	speeds.push({id:40,name:40+ gpsGetSpeedUnit()});
	speeds.push({id:50,name:50+ gpsGetSpeedUnit()});
	speeds.push({id:60,name:60+ gpsGetSpeedUnit()});
	speeds.push({id:70,name:70+ gpsGetSpeedUnit()});
	speeds.push({id:80,name:80+ gpsGetSpeedUnit()});
	speeds.push({id:90,name:90+ gpsGetSpeedUnit()});
	speeds.push({id:100,name:100+ gpsGetSpeedUnit()});
	speeds.push({id:110,name:110+ gpsGetSpeedUnit()});
	speeds.push({id:120,name:120+ gpsGetSpeedUnit()});
	speeds.push({id:130,name:130+ gpsGetSpeedUnit()});
	return speeds;
}
