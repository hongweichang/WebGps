var ttxMap = null;		//地图对象
var searchOpt = null;
var lang = parent.lang;
var rootParent = parent;
var trackPlayer = null;
var playTimerMax = 7;
var playTimerMin = 1;
var playTimerStep = 1;
var src_posi_Y = 0, dest_posi_Y = 0, move_Y = 0, is_mouse_down = false, destHeight = 30,mapHeight;

$(document).ready(function () {
	$('body').flexShowLoading(true);
	//初始化样式
	loadReadPage();
});

function loadReadPage() {
	initTtxMap();
	trackPlayer = new trackPlayback();
	searchOpt = new searchOption(true, true, true);
	searchOpt.initSearchOption();
	loadLang();
	loadPageInfo();
	loadTrackPointTable();
	setPanelWidth(fixHeight);
}

function loadPageInfo() {
	//位置定位拖动高度
	$(".map_drag_box").mousedown(function(e){
       src_posi_Y = e.pageY;
       is_mouse_down = true;
       $('#mapMoveDiv').show();
	});
   $(document).bind("click mouseup",function(e){
	   ttxMapDocumentMouseClick();
   }).mousemove(function(e){
	   ttxMapDocumentMouseMove(e);
   });
  
   initPlayPanel();
   initPlayCtrl();
   initTablePanel();
   //选择起点或者终点
   loadLinePointManage();
}

/*
 * 初始化播放面板
 */
function initPlayPanel() {
	//立即搜索
	$(".sear_btn").click(function(){
	   	trackPlayer.startPlay();
   	});
	//正常播放，快速按钮
	$(".track_slide .radio-check span").click(function(){
	   $(this).addClass("active").siblings().removeClass("active");
	});
	//右侧搜索展开与关闭
	$(".track_slide .shrink").click(function(){
		if($(this).hasClass("active")){
			showPlayPanel();
		}else{
			hidePlayPanel();
		}
   	});
}

/*
 * 展开面板
 */
function showPlayPanel() {
	if($(".track_slide .shrink").hasClass("active")){
		 $(".track_slide .shrink").removeClass("active");
         $(".track_slide_rows").show();
         $(".track_slide_txt").hide();
		$(".play_part").css("right",365);
	}
}

/*
 * 收缩面板
 */
function hidePlayPanel() {
	if(!$(".track_slide .shrink").hasClass("active")){
		$(".track_slide .shrink").addClass("active");
		$(".track_slide_rows").hide();
		$(".track_slide_txt").show();
		$('.track_slide_txt').text($('#combox-vehiIdnos').val());
		$('.track_slide_txt').attr('title',$('#combox-vehiIdnos').val());
		$(".play_part").css("right",125);
	}
}

/*
 * 播放控制面板
 */
function initPlayCtrl() {
	$("#moveDIV").hide();
	//停止播放
	$(".stop").click(function(){
		trackPlayer.stopPlay(true);
	});
	//开始/暂停播放
	$("#btnPlay").click(function(){
		trackPlayer.isPause = !trackPlayer.isPause;
		//css
		if ($(this).hasClass("pause")) {
			$(this).removeClass("pause").addClass("play");
		} else {
			$(this).removeClass("play").addClass("pause");
			if(!trackPlayer.isPlaying) {
				trackPlayer.isPlaying = true;
				trackPlayer.isPause = false;
				trackPlayer.resetPlayTimer();
			}
		}
	});
	//轨迹时间速度条
	$( ".line" ).slider({
 		orientation: "vertical",
 		range: "min",
 		animate: true,
 		min: playTimerMin,
 		max: playTimerMax,
 		step: playTimerStep,
 		value: trackPlayer.playInterval
	});
	$('.line').slider('option','value', 4);
	doSpeedChange();
	//拖动轨迹时间速度条事件
	$( ".line" ).slider({
	  change: function( event, ui ) {
		doSpeedChange();
	  }
	});
	//轨迹时间速度条提高
	$('.speed-inc').on('click',function() {
		var value = $('.line').slider('option','value');
		if (value < playTimerMax) {
			value = value + playTimerStep;
			if (value > playTimerMax) {
				value = playTimerMax;
			}
			$('.line').slider('option','value', value);
			doSpeedChange();
		}
	});
	//轨迹时间速度条减少
	$('.speed-dec').on('click',function() {
		var value = $('.line').slider('option','value');
		if (value > playTimerMin) {
			value = value - playTimerStep;
			if (value < playTimerMin) {
				value = playTimerMin;
			}
			$('.line').slider('option','value', value);
			doSpeedChange();
		}
	});
	//轨迹时间速度条点击显示隐藏
	$(".time").click(function(){
		$(".add_reduce").slideToggle();
	});
	//进度条
	$("#playProgress" ).slider({
		orientation: "horizontal",
		range: "min",
		min: 0,
		max: 1,
		step: 1,
		animate: true
	});
	//暂时不处理拖动
	//拖动状态条事件
	$('#playProgress').bind('slide', function(event, ui) {
		doTrackLineChange();
	});
//	$( "#playProgress" ).slider({
//	  change: function( event, ui ) {
//		  doTrackLineChange();
//	  }
//	});
	//点击更多弹出车辆选择
	$('.track_slide .more_car').on('click', queryMoreVehicle);
}

//报表面板
function initTablePanel() {
	//报表切换
   $(".map_action .map_tab li").click(function(){
		var _index2 = $(this).index();
		if($(this).attr('id') != 'gps-export') {
			$(this).addClass("active").siblings().removeClass("active");
			$(".gps_box li").eq(_index2).addClass("active").siblings().removeClass("active");
			if($(".min_big").hasClass("icon_big") && $(".min_s").hasClass("icon_s_re")) {
				$('.min_s').click();
			}
		}
	});
   
   //面板上的展开和伸缩按钮
	$(".min_s").click(function(){
		if($(this).hasClass("icon_s")){
			$(".map_action").css("height",$(window).height() - 38 < 39 ? $(window).height() - 38 : 39);
			$(".map").height($(window).height()-$('.map_action').height());
			$("#mapcanvas").css({width:'100%',height:'100%'})
			$('.gps_box .flexigrid').each(function() {
				$(this).find(".bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .pDiv').height());
			});
			$(this).removeClass("icon_s").addClass("icon_s_re");
			$(".min_big").removeClass("icon_s_re").addClass("icon_big");
			setTooltip('.icon_s_re', parent.lang.window_windowing);
			setTooltip('.icon_big', parent.lang.window_maximize);
		}else{
			$(".map_action").css("height",$(window).height() - 38 > 260 ? 260 : $(window).height() - 38);
			$(".map").height($(window).height()-$('.map_action').height());
			$("#mapcanvas").css({width:'100%',height:'100%'})
			$('.gps_box .flexigrid').each(function() {
				$(this).find(".bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .pDiv').height());
			});
			$(this).removeClass("icon_s_re").addClass("icon_s");
			setTooltip('.icon_s', parent.lang.window_minimum);
		}
		$('#mapMoveDiv').css("height",$(".map_action").height());
		$('#mapMoveDiv').css("top",$(window).height() - $(".map_action").height());
		fixHeight();
	});
	$(".min_big").click(function(){
		if($(this).hasClass("icon_s_re")){
			$(".map_action").css("height",$(window).height() - 38 > 260 ? 260 : $(window).height() - 38);
			$(".map").height($(window).height()-$('.map_action').height());
			$("#mapcanvas").css({width:'100%',height:'100%'})
			$('.gps_box .flexigrid').each(function() {
				$(this).find(".bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .pDiv').height());
			});
			$(this).removeClass("icon_s_re").addClass("icon_big");
			$(".min_s").removeClass("icon_s_re").addClass("icon_s");
			setTooltip('.icon_big', parent.lang.window_maximize);
		}else {
			$(".map_action").css("height",$(window).height());
			$(".map").height($(window).height()-$('.map_action').height());
			$("#mapcanvas").css({width:'100%',height:'100%'})
			$('.gps_box .flexigrid').each(function() {
				$(this).find(".bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .pDiv').height());
			});
			$(".min_s").removeClass("icon_s_re").addClass("icon_s");
			$(this).removeClass("icon_big").addClass("icon_s_re");
			setTooltip('.icon_s_re', parent.lang.window_windowing);
		}
		setTooltip('.icon_s', parent.lang.window_minimum);
		$('#mapMoveDiv').css("height",$(".map_action").height());
		$('#mapMoveDiv').css("top",$(window).height() - $(".map_action").height());
		fixHeight();
	});
	setTooltip('.icon_s', parent.lang.window_minimum);
	setTooltip('.icon_s_re', parent.lang.window_windowing);
	setTooltip('.icon_big', parent.lang.window_maximize);
	setTooltip('.icon_excel', parent.lang.exportExcel);
	setTooltip('.icon_pdf', parent.lang.exportPDF);
	
	$("#gps-export .icon_excel").click(exportTrackDetailExcel);
	$("#gps-export .icon_pdf").click(exportTrackDetailPDF);
	
	//禁止系统右键
	disableSysRight('body',true);
}

function loadLang() {
	$("#lbVehicle").text(lang.track_search_vehicle);
	$("#lbBegTime").text(lang.begintime);
	$("#lbEndTime").text(lang.endtime);
	$("#lbDistance").text(lang.track_distance);
	$("#lbParkTime").text(lang.track_park);
	$("#lbLicheng").text(lang.track_licheng);
	$("#lbNormarlPlay").text(lang.track_normalPlay);
	$("#lbFastPlay").text(lang.track_fastPlay);
	$("#lbShowTrack").text(lang.track_showTrack);
	$("#lbSearchTrack").text(lang.track_startSearch);
	$("#lbSearchVehicle").text(lang.search_vehicle);
	$("#lbTrackPoint").text(lang.track_trackPoint);
	$("#lbTrackPark").text(lang.track_parkPoint);
	$('#lineManage .startPoint label').text(lang.track_setQiDian);
	$('#lineManage .endPoint label').text(lang.track_setZhongDian);
	$('#lineManage .save').text(lang.save);
	$('#lineManage .cancel').text(lang.cancel);
}

//拖动进度条事件
function doTrackLineChange() {
	if(/*trackPlayer.isPlaying && */!trackPlayer.fastMode) {
		//将播放的点设置为拖动的点的值
		trackPlayer.playIndex = $('#playProgress').slider('option','value');
		if (trackPlayer.playIndex > trackPlayer.lineIndex) {
			trackPlayer.isPause = true;
			//css
			if ($('#btnPlay').hasClass("pause")) {
				$('#btnPlay').removeClass("pause").addClass("play");
			}
			$.myajax.showLoading(true, parent.lang.loading);
			//等待画线
			trackPlayer.loadDrawTrackLine();
		}
	}
}

function doSpeedChange(){
	var mul = 1;
	var value = $('.line').slider('option','value');
	for (var i = 1; i < value; ++ i) {
		mul *= 2;
	}
	trackPlayer.playInterval = 3200 / mul;
	trackPlayer.resetPlayTimer();
}

function gpsGetDistanceUnit(isMeter) {
	if (isMeter) {
		return "M";
//			return "Foot";
	} else {
		return "KM";
//			return "Mile";
	}
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

function disableForm(disable) {
	searchOpt.disableForm(disable);
	diableInput("#combox-vehiIdnos", disable, true);
	disableButton("#combox-vehiIdnos", disable);
	diableInput("#combox-distance", disable, true);
	disableButton("#combox-distance", disable);
	disableButton("#begintime", disable);
	disableButton("#endtime", disable);
	diableInput("#parktime", disable, true);
	diableInput("#playModeNormal", disable, true);
	diableInput("#playModeFast", disable, true);
//	diableInput("#showTrackPoints", disable, true);
	if(disable) {
		$('.track_slide .more_car').unbind('click');
	}else {
		$('.track_slide .more_car').on('click', queryMoreVehicle);
	}
}

function fixHeight() {
	$('#trackPointTable').flexFixHeight();
	$('#parkPointTable').flexFixHeight();
}

/**
 *设置页面大小
 */
function setPanelWidth(callBackFun) {
	//地图高度不能超出
	var _height = $(window).height();
	$(".map_area").height(_height);
	if($(".min_s").hasClass("icon_s")){
		$(".map_action").css("height",_height - 38 > 260 ? 260 : _height - 38);
	}else {
		$(".map_action").css("height", $(".map_action").height() > _height - 39 ?   _height - 39 : $(".map_action").height());
		$(".map_action").css("height", $(".map_action").height() < 39 ? 39 : $(".map_action").height());
	}
	if($(".min_big").hasClass("icon_s_re")){
		$(".map_action").css("height",_height);
	}else {
		$(".map_action").css("height", $(".map_action").height() > _height - 39 ?   _height - 39 : $(".map_action").height());
		$(".map_action").css("height", $(".map_action").height() < 39 ? 39 : $(".map_action").height());
	}
	$('#mapMoveDiv').css("height",$(".map_action").height());
	$('#mapMoveDiv').css("top",$(window).height() - $(".map_action").height());
	$(".map").height(_height - $('.map_action').height());
	$("#mapcanvas").height($(".map").height());
	$('.gps_box .flexigrid').each(function() {
		$(this).find(".bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .pDiv').height());
	});
	if (typeof callBackFun == "function") {
		callBackFun();
	}
}

function loadVehicleList() {
	if(parent.isLoadVehiList) {
		//车辆加载完全，刷新车辆状态
		parent.vehicleManager.runStatusTimer();
		
		var myVehicleList = [];
		if(parent.vehicleList.length < 200) {
			myVehicleList = parent.vehicleList;
		}else {
			for (var i = 0, j = parent.vehicleList.length; i < 200 && i < j; i++) {
				myVehicleList.push(parent.vehicleList[i]);
			}
		}
		
		$('#search-vehicle').flexPanel({
			 ComBoboxModel :{
				 input : {display: parent.lang.selectVehicleTip,name : 'vehiIdnos',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: false},
				 combox: 
						{name : 'vehiIdnos', option : vehicleList2Arr(myVehicleList)}
			 }	
		});
		//加载完成
		$('body').flexShowLoading(false);
		/*$('#combox-vehiIdnos').val('50000000001');
		$('#hidden-vehiIdnos').val('50000000001');
		$('#begintime').val('2016-01-27 00:00:00');
		$('#endtime').val('2016-01-27 23:59:59');*/
	}else {
		setTimeout(loadVehicleList,50);
	}
}

function loadTrackPointTable() {
	loadVehicleList();
	$('#search-distance').flexPanel({
		 ComBoboxModel :{
			 input : {display:'',name : 'distance',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			 combox: 
					{name : 'distance', option : arrayToStr(getDistances())}
		 }	
	});

	$('#combox-distance').val(0+ gpsGetDistanceUnit(true));
	$('#hidden-distance').val(0);
	$('#parktime').val(0);
	
	//序号、时间、速度、里程、行驶里程、位置、状态，报警
	$("#trackPointTable").flexigrid({
		url: "StandardTrackAction_query",
		dataType: 'json',
		colModel : [
		    {display: lang.operator, name : 'operator', width : 50, sortable : false, align: 'center'},
			{display: lang.index, name : 'trackindex', width : 40, sortable : false, align: 'center'},
			{display: lang.report_date, name : 'gpsTime', width : 150, sortable : false, align: 'center'},
			{display: lang.monitor_vehiStatusSpeed, name : 'speed', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.report_lichengCurrent, name : 'licheng', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.track_lichengRun, name : 'lichengRun', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.monitor_vehiStatusPosition, name : 'position', width : 200, sortable : false, align: 'center'},
			{display: parent.lang.monitor_vehiStatusNormal, name : 'status', width : 450, sortable : false, align: 'center'},
			{display: parent.lang.monitor_vehiStatusAlarm, name : 'alarm', width : 400, sortable : false, align: 'center'}
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
		autoload: true,
		singleSelect: true,
		checkbox: false,
		useRp: true,
		rp: 20,
		rpOptions: [10, 20, 50, 100, 150],
		showTableToggleBtn: true,
		showToggleBtn: true,
		onSubmit: addTrackTableList,
		width: 'auto',
		height: 'auto'
	});
	$("#trackPointTable").flexSetFillCellFun(trackPlayer.fillTrackTable);
	$("#trackPointTable").flexSelectRowPropFun(trackPlayer.selectTrackRowProp);
	
	//序号，停车开始时间，停车结束时间，里程，位置
	$("#parkPointTable").flexigrid({
		url: "StandardTrackAction_query",
		dataType: 'json',
		colModel : [
		    {display: lang.operator, name : 'operator', width : 50, sortable : false, align: 'center'},
			{display: parent.lang.index, name : 'trackindex', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.track_parkBeginTime, name : 'beginTime', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.track_parkEndTime, name : 'endTime', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.report_lichengCurrent, name : 'licheng', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.track_parkTime, name : 'parkTime', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.monitor_vehiStatusPosition, name : 'position', width : 400, sortable : false, align: 'center'}
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
		autoload: true,
		singleSelect: true,
		checkbox: false,
		useRp: true,
		rp: 20,
		rpOptions: [10, 20, 50, 100, 150],
		showTableToggleBtn: true,
		showToggleBtn: true,
		onSubmit: addParkTableList,
		width: 'auto',
		height: 'auto'
	});
	$("#parkPointTable").flexSetFillCellFun(trackPlayer.fillTrackTable);
	$("#parkPointTable").flexSelectRowPropFun(trackPlayer.selectTrackRowProp);
}

/**
 * 调用自定义加载数据加载轨迹信息
 */
function addTrackTableList() {
	trackPlayer.addTrackTableList();
}

/**
 * 调用自定义加载数据加载停车点信息
 */
function addParkTableList() {
	trackPlayer.addParkTableList();
}

//初始化地图
function initTtxMap() {
	ttxMap = new TtxMap('frameMap');
	if(ttxMap != null) {
		ttxMap.initialize(ttxMapLoadSuc);
	}
}

/*
 * 地图加载成功后的回调
 */
function ttxMapLoadSuc() {
	if(ttxMap != null) {
		//禁止工具栏
		ttxMap.enableMapTool(true);
		//启用地图全屏
		ttxMap.enableMapFull(true);
		ttxMap.enableMyMap(true);
		ttxMap.disableSysRight('body',true);
	}
}

/*
 * 处理地图全屏
*/
function ttxMapFullScreen(isFull) {
	fullMapScreen();
}

function ttxMapDocumentMouseClick() {
	if(is_mouse_down){
        is_mouse_down = false;
        $(".map").css("height", mapHeight);
    	$("#mapcanvas").css("height", mapHeight);
    	
    	$(".map_action").css("height", $('#mapMoveDiv').height());
    	if(mapHeight <= 38) {
    		$(".min_s").removeClass("icon_s_re").addClass("icon_s");
    		$(".min_big").removeClass("icon_big").addClass("icon_s_re");
    		setTooltip('.icon_s', parent.lang.window_minimum);
    		setTooltip('.icon_s_re', parent.lang.window_windowing);
    		$(".map").css("height", 0);
    		$("#mapcanvas").css("height", 0);
    		$(".map_action").css("height",$(window).height());
    	}
    	
    	if(destHeight <= 39) {
    		$(".min_s").removeClass("icon_s").addClass("icon_s_re");
    		$(".min_big").removeClass("icon_s_re").addClass("icon_big");
    		setTooltip('.icon_s_re', parent.lang.window_windowing);
    		setTooltip('.icon_big', parent.lang.window_maximize);
    	}
    	
    	$('.gps_box .flexigrid').each(function() {
			$(this).find(".bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .pDiv').height());
		});
    	$("#mapMoveDiv").css("height", $('.map_action').height());
    	$('#mapMoveDiv').css("top",$(window).height() - $('#mapMoveDiv').height());
    	$('#mapMoveDiv').hide();
    	fixHeight();
	}
}

function ttxMapDocumentMouseMove(e) {
    if(is_mouse_down){
    	dest_posi_Y = e.pageY;
        move_Y = src_posi_Y - dest_posi_Y;
        src_posi_Y = dest_posi_Y;
        destHeight = $("#mapMoveDiv").height() + move_Y;
    	mapHeight = $(window).height() - destHeight;
    	
		if (mapHeight < 0 || destHeight < 39) {
		} else {
			if($(".min_big").hasClass("icon_s_re")){
				$('#mapMoveDiv').css("height", destHeight > $(window).height() ? $(window).height() : destHeight);
			}else {
				$('#mapMoveDiv').css("height",destHeight > $(window).height() - 38 ? $(window).height() - 38 : destHeight);
			}
			
			$('#mapMoveDiv').css("top",$(window).height() - $('#mapMoveDiv').height());
		}
		fixHeight();
    }
}

/*
 * 重新加载地图
 */
function ttxMapReload() {
	$('#frameMap').attr('src', $('#frameMap').attr('src'));
	if(ttxMap != null) {
		ttxMap.doReload();
	}
}

//切换地理位置坐标
function changeMapAddress(obj, jingDu, weiDu) {
	var position1 = $.trim($(obj).attr('data-position'));
	var position2 = $.trim($(obj).html());
	$(obj).attr('data-position',position2);
	if(position1 != null && position1 != '') {
		$(obj).html(position1);
		$(obj).attr('title',position1);
	}else {
		if(ttxMap != null) {
			ttxMap.geocoderAddress(weiDu+','+jingDu, jingDu, weiDu, function(key, jingDu, weiDu, address, city) {
				$(obj).html(address);
				$(obj).attr('title',address);
			});
		}
	}
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
	var content = '?begintime=' + $('#begintime').val() + '&endtime='+ $('#endtime').val() + '&parktime='+$('#parktime').val();
	content += '&toMap='+parent.toMap+'&exportType='+exportType;
	document.reportForm.action = "StandardTrackAction_gpstrackExcel.action"+content;
	document.reportForm.submit();
}
//导出至excel，导出至csv，导出至pdf
function exportTrackDetailExcel() {
	exportReport(1);
}

function exportTrackDetailPDF() {
	exportReport(3);
}

//弹出车辆选择菜单类
var selVehiInfo = null;

//点击更多弹出车辆选择
function queryMoreVehicle() {
	if(selVehiInfo == null) {
		selVehiInfo = $.dialog({id:'vehiInfo', title: parent.lang.btnSelectVehicle, content: 'url:TrackManagement/selectVehicle.html?single=true',
			width: '400px', height: '630px', min:true, max:false, lock:false,fixed:false
				, resize:false, close: function() {
					selVehiInfo = null;
					popTipsObject.remove('vehiInfo');
				} });
	}else {
		selVehiInfo.show();
	}
	popTipsObject.put('vehiInfo', selVehiInfo);
	hidePopTips('vehiInfo');
}

//选择车辆成功
function doSelectVehicleSuc(vehiIdno) {
	$('#combox-vehiIdnos').val(vehiIdno);
	$('#hidden-vehiIdnos').val(vehiIdno);
	selVehiInfo.hide();
}

/**
 * 地图上车辆Tip进行操作
 * @param vehiIdno  车牌号
 * @param menuId  菜单Id
 * @param popId  子菜单Id
 */
function ttxMapClickmenuitem(vehiIdno, menuId, popId) {
	trackPlayer.ttxMapClickmenuitem(vehiIdno, menuId, popId);
}

//选择起点或者终点
function loadLinePointManage() {
	//设置起点或者终点
	$('#lineManage .save').on('click', function() {
		trackPlayer.saveLinePoint();
	});
	$('#lineManage .cancel').on('click', function() {
		$('#lineManage').hide();
	});
}

//地图上画线，选择起点和终点
function drawPreLine(index) {
	trackPlayer.drawPreLine(index);
}

//删除起点和终点标记
function delTrackLinePointMarker() {
	trackPlayer.delTrackLinePointMarker();
}

var popTipsObject = new Hashtable();//页面弹出框对象集合
//隐藏弹出框
function hidePopTips(name) {
	if(popTipsObject != null && popTipsObject.size() > 0) {
		popTipsObject.each(function(id, value) {
			if(id != name && value != null) {
				if(id != 'areaInfo') {
					value.hide();
				}else {
					value.close();
				}
			}
		});
	}
}