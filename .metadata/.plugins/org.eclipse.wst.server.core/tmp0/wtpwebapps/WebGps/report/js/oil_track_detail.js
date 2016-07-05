var graph,contain,options,gdata;
$(document).ready(function(){
	setTimeout(loadOilTrackDetailPage, 50);
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
				color: '#00A8F0',
				mode: 'normal',
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
	})(document.getElementById("oilTrack-render"));
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
			x = dateStrLongTime2Date(fn.gpsTime).getTime();
			y1 = gpsGetYouLiang(fn.youLiang);
		//	y2 = gpsGetLiCheng(fn.liCheng);
			y2 = gpsGetSpeed(fn.speed, fn.status1);
		//	y2 = fn.speed;
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

var searchOpt = new searchOption(true, true);

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

function loadOilTrackDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadOilTrackDetailPage, 50);
	} else {
		//加载语言
		loadOilTrackDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryOilTrackDetail);
		$("#btnExport").click(exportOilTrackDetail);
		$("#btnExportCsv").click(exportOilTrackDetailCsv);
		$("#btnExportPdf").click(exportOilTrackDetailPdf);
		$("#btnGraph").click(queryGraph);
		initDistance();
		
		$("#oilTrackDetailTable").flexigrid({
			url: "ReportOilAction_trackDetail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.vehiName, name : 'devIdno', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'gpsTime', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.report_lichengCurrent + gpsGetLabelLiChengUnit(), name : 'liCheng', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.report_positionCurrent, name : 'position', width : 250, sortable : false, align: 'center'},
				{display: parent.lang.report_youLiangCurrent, name : 'youLiang', width : 120, sortable : false, align: 'center'}
				],
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
			title: parent.lang.report_navOliTrackDetail,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 1200,
			onSubmit: false,//addFormData,
			height: 400
		});
	}
}

function initDistance() {
	$("#distance").append("<option value='0'>0" + gpsGetDistanceUnit(true) + "</option>");
	$("#distance").append("<option value='0.01'>10" + gpsGetDistanceUnit(true) + "</option>");
	$("#distance").append("<option value='0.1'>100" + gpsGetDistanceUnit(true) + "</option>");
	$("#distance").append("<option value='0.5' selected>500" + gpsGetDistanceUnit(true) + "</option>");
	$("#distance").append("<option value='1'>1" + gpsGetDistanceUnit(false) + "</option>");
	$("#distance").append("<option value='3'>3" + gpsGetDistanceUnit(false) + "</option>");
	$("#distance").append("<option value='5'>5" + gpsGetDistanceUnit(false) + "</option>");
	$("#distance").append("<option value='10'>10" + gpsGetDistanceUnit(false) + "</option>");
	$("#distance").append("<option value='30'>30" + gpsGetDistanceUnit(false) + "</option>");
}

function loadOilTrackDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_navOliTrackDetail);
	$("#labelDistance").text(parent.lang.report_labelDistance);
	$('#mouseTip-one').text(parent.lang.report_oil_operate_tip_one);
	$('#mouseTip-two').text(parent.lang.report_oil_operate_tip_two);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
}

function queryOilTrackDetail() {
	var query = searchOpt.getQueryData(true);
	if (query === null) {
		return ;
	}
	$("#oilTrackDetailGraph").hide();
	$(".flexigrid").show();
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
		value: gpsGetDistanceValue($("#distance").val())
	});
	params.push({
		name: 'devIdno',
		value: query.device
	});
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	$('#oilTrackDetailTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'devIdno') {
		pos = gpsGetVehicleName(row[name]);
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
	}else if((name == 'liCheng')){
		pos = gpsGetLiCheng(row[name]);
	}else if(name == 'youLiang') {
		pos = gpsGetYouLiang(row[name]);
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function exportReport(exportType) {
	var query = searchOpt.getQueryData(true);
	if (query === null) {
		return ;
	}
	$("#devIdnos").val(query.device.toString());
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	document.reportForm.action = "ReportOilAction_gpstrackExcel.action?toMap="+toMap+"&exportType="+exportType;
	document.reportForm.submit();
}

function exportOilTrackDetail() {
	exportReport(1);
}

function exportOilTrackDetailCsv() {
	exportReport(2);
}

function exportOilTrackDetailPdf() {
	exportReport(3);
}

function queryGraph() {
	var query = searchOpt.getQueryData(true);
	if (query === null) {
		return ;
	}
	$("#oilTrackDetailGraph").show();
	$(".flexigrid").hide();
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
		value: gpsGetDistanceValue($("#distance").val())
	});
	params.push({
		name: 'devIdno',
		value: query.device
	});
	params.push({
		name: 'pagin',
		value : ''
	});
	params.push({
		name: 'type',
		value : 'graph'
	});
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.ajax({
		type: 'GET',
		url: 'ReportOilAction_trackDetail.action',
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