var isGraph = false;
var graph,contain,options,gdata;
$(document).ready(function(){
	setTimeout(loadSpeedDetailPage, 50);
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

function loadSpeedDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadSpeedDetailPage, 50);
	} else {
		buttonQueryOrExport();
		
		$('#graph').flexPanel({
			ButtonsModel : [
				[{display: '', name : '', pclass : 'btnGraph',
					bgcolor : 'blue', hide : false}]
			]
		});
		
		$('#toolbar-graph').flexPanel({
			ButtonsModel : [
				[{display: '', name : 'to-image', pclass : 'toImage',
					bgcolor : 'gray', hide : false}],
				[{display: '', name : 'reset-image', pclass : 'resetImage',
					bgcolor : 'gray', hide : false}]
			]
		});
		$('#selectName').flexPanel({
			InputModel : {display: parent.lang.selectVehicleTip,value:'',name : 'vehiIdnos', pid : 'vehiIdnos', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
		});
		$('#toolbar-graph .y-btn').each(function() {
			$(this).attr('onclick',"CurrentExample('"+$(this).attr('data-cn')+"')");
		});
		
		$('#selecttime').flexPanel({
			ComBoboxModel :{
				input : {name : 'selecttime',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'selecttime', option : arrayToStr(getSelectTime(2))}
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
		loadSpeedDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$(".btnQuery").click(querySpeedDetail);
		$(".btnExport").click(exportSpeedDetail);
		$(".btnExportCSV").click(exportSpeedDetailCSV);
		$(".btnExportPDF").click(exportSpeedDetailPDF);
		var width = 0;
		if(parent.screenWidth >= 1360) {
			width = 'auto';
		}else {
			width = 1060;
			$('#sysuserLogDate').css('width','1100px');
		}
		$("#speedDetailTable").flexigrid({
			url: "StandardReportLiChengAction_speedDetail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.plate_number, name : 'vehiIdno', width : 150, sortable : false, align: 'center'},
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
		
		$('.btnGraph').on('click',function(){
			loadReportTableWidth(fixHeight);
			var text = $(this).find('.label').text();
			if(text == parent.lang.graph) {
				$(this).find('span').text(parent.lang.report);
				isGraph = true;
				$("#speedDetailGraph").show();
				$(".flexigrid").hide();
				doAjaxList(null);
			}else {
				$(this).find('span').text(parent.lang.graph);
				isGraph = false;
				$("#speedDetailGraph").hide();
				$(".flexigrid").show();
			}
			if($('#hidden-vehiIdnos').val() != null && $('#hidden-vehiIdnos').val() != ''){
				querySpeedDetail();
			}
		});
		loadReportTableWidth(fixHeight);
	}
}

function fixHeight() {
	$('#speedDetailTable').flexFixHeight();
}

function loadSpeedDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_speed_title);
	$("#download-instructions").text(parent.lang.download_instructions);
//	$('#selName').attr('placeholder',parent.lang.selectVehicleTip);
//	$('#selName').attr('data-placeholder',parent.lang.selectVehicleTip);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function querySpeedDetail() {
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
	if(isGraph) {
		queryGraph(params);
	}else {
		$('#speedDetailTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
	}
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if (name == 'position') {
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
		name: 'pagin',
		value : ''
	});
	/*params.push({
		name: 'type',
		value : 'graph'
	});*/
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.ajax({
		type: 'POST',
		url: 'StandardReportLiChengAction_speedDetail.action',
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
	}else{
		if(dateStrLongTime2Date($('#endtime').val()) - dateStrLongTime2Date($('#begintime').val()) > 10800000){
			$.dialog.tips(parent.lang.excel_tip,1);
		}
	}
	document.reportForm.action = "StandardReportLiChengAction_gpstrackExcel.action?toMap="+toMap+"&type=speedDetail&exportType="+exportType+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val();
	document.reportForm.submit();
}
//导出至excel，导出至csv，导出至pdf
function exportSpeedDetail() {
	exportReport(1);
}

function exportSpeedDetailCSV() {
	exportReport(2);
}

function exportSpeedDetailPDF() {
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
