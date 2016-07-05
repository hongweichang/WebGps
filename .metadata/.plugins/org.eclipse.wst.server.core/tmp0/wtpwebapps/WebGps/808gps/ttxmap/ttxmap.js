$(document).ready(function () {
	loadReadPage();
});

var readyScriptUrl = 0;
var isMapReady = false;
var scriptUrl = [];
var mapExtendUrl = "";
var rootParent = parent.parent;
var lang = rootParent.lang;
var isBeginLoadMap = false;
var GFRAME = null;
var initZoom = null;
var initJingDu = null;
var initWeiDu = null;
var initParseAddress = true;
var isChrome = false;
var mapAddress = new Hashtable();
var rectSearchType = 1;	//1表示查找当前车辆，2表示查找历史车辆 
var myMap = null;  //我的地图类对象 

function loadScript(src, callback) {
	var otherJScipt = document.createElement("script"); 
	otherJScipt.setAttribute("type", "text/javascript"); 
	otherJScipt.setAttribute("src", src); 
	document.getElementsByTagName("head")[0].appendChild(otherJScipt);//追加到head标签内 
	//判断服务器 
	if (navigator.userAgent.indexOf("IE") >= 0) { 
		//IE下的事件 
		otherJScipt.onreadystatechange = function () { 
			//IE下的判断，判断是否加载完成 
			if (otherJScipt && (otherJScipt.readyState == "loaded" || otherJScipt.readyState == "complete")) { 
				otherJScipt.onreadystatechange = null; 
				if (callback != null) {
					callback(); 
				}
			} 
		}; 
	} else { 
		otherJScipt.onload = function () { 
			otherJScipt.onload = null; 
			if (callback != null) {
				callback(); 
			}
		}; 
	} 
}

function isBaiduMap() {
	var mapType = rootParent.getMapType();	
	if (mapType == 3) {
		return true;
	} else {
		return false;
	}
}

function loadReadPage() {
	var mapType = rootParent.getMapType();
	/*
	#define MAP_TYPE_GOOGLE				0
	#define MAP_TYPE_MAPINFO			1
	#define MAP_TYPE_GOOGLE_HTTPS		2
	#define MAP_TYPE_BAIDU				3	
	*/
	var mapSelect = [];
	
	var currentMap = "";
	if (isBaiduMap()) {
		mapScriptUrl = "http://api.map.baidu.com/api?v=2.0&services=false&ak=BCa2d508d2c567acd009eb09765f5797&callback=map_init";
		
		scriptUrl.push("../ttxmap/baidu/js/mapframe.js");
		scriptUrl.push("../ttxmap/baidu/js/GeoUtils.js");
		scriptUrl.push("../ttxmap/baidu/js/DistanceTool.js");
		scriptUrl.push("../ttxmap/baidu/js/DrawingManager.js");
		scriptUrl.push("../ttxmap/baidu/js/function.js");
		scriptUrl.push("../ttxmap/baidu/js/mapmarker.js");
		scriptUrl.push("../ttxmap/baidu/js/popupmarker.js");
		scriptUrl.push("../ttxmap/baidu/js/namemarker.js");
		scriptUrl.push("../ttxmap/baidu/js/RectangleZoom.js");
		scriptUrl.push("../ttxmap/baidu/js/TextIconOverlay.js");
		scriptUrl.push("../ttxmap/baidu/js/MarkerClusterer.js");
		
		currentMap = lang.mapBaidu;
		var map = {};
		map.type = 0;
		map.name = lang.mapGoogle;
		mapSelect.push(map);
	} else {
		if (rootParent.langIsChinese()) {
			mapScriptUrl = "http://ditu.google.cn/maps/api/js?sensor=false&libraries=drawing&callback=map_init";
		} else {
			mapScriptUrl = "http://maps.googleapis.com/maps/api/js?sensor=false&libraries=drawing&callback=map_init";
		}
		
		scriptUrl.push("../ttxmap/google/js/mapframe.js");
		scriptUrl.push("../ttxmap/google/js/function.js");
		scriptUrl.push("../ttxmap/google/js/popupmarker.js");
		scriptUrl.push("../ttxmap/google/js/namemarker.js");
		scriptUrl.push("../ttxmap/google/js/mapmarker.js");
		scriptUrl.push("../ttxmap/google/js/TextIconOverlay.js");
		scriptUrl.push("../ttxmap/google/js/MarkerClusterer.js");
		
		currentMap = lang.mapGoogle;
		var map = {};
		map.type = 3;
		map.name = lang.mapBaidu;
		mapSelect.push(map);
		
		$("#liDistance").hide();
		$("#liZoomIn").hide();
		$("#liZoomOut").hide();
	}
	$("#currentMap").html(currentMap + "<i class=\"icon icon_xia\"></i>");
	
	isBeginLoadMap = false;
	readyScriptUrl = 0;
	loadScript( mapScriptUrl, null );
	
	//增加地图选择
	for (var i = 0; i < mapSelect.length; ++ i) {
		var map = mapSelect[i];
		$('#mapSelect ul').append('<li data-id= "'+map.type+'">'+ '<i class="icon icon_celiang"></i>' + map.name+'</li>');
	}
	$('#mapSelect li').each(function() {
		$(this).on('click',function() {
			switchMap($(this).attr('data-id'));
		});	
	});
	//地图弹出框
	$(".map_select").hover(
		function(){
			$(this).find("ul").show();
			},
		function(){
			$(this).find("ul").hide();
	});
	//
	$("#search_box").hide();
	//全屏
	//地图全屏
	$(".big_box").click(function(){
		if($(this).find("i").hasClass("icon_bigMap")){
			$(this).find("i").removeClass("icon_bigMap").addClass("icon_s_re");
			doMapFullScreen(true);
		}else{
			$(this).find("i").removeClass("icon_s_re").addClass("icon_bigMap");
			doMapFullScreen(false);
		};
	});
	//加载语言
	loadLanguage();
	//点击事件，为了上层拖动窗体
	$(document).bind("click mouseup",function(e){
		doMapDocumentMouseClick();
	});
	$(document).mousemove(function(e){
		doMapDocumentMouseMove(e);
	});
	//
	loadToolbar();
	
	//给保存按钮添加事件
	$('#mapMoreBtn #btnSave').on('click', doMapBtnSaveClick);
}

function setTooltip(id, tltle) {
	$( id ).attr("title", tltle);
	$( id ).tooltip();
}

function loadToolbar() {
	var showRect = getUrlParameter("rectSearch");
	if (showRect != "" && showRect == "1" ) {
	} else {
		$("#rect_searchbox").hide();
	}
	$("#rect_search_mycar").click(function () {
		rectSearchType = 1;
		if (4 != GFRAME.addMarkerType) {
			searchVehi();
		}
	});
	$("#rect_search_hiscar").click(function () {
		rectSearchType = 2;
		if (4 != GFRAME.addMarkerType) {
			searchVehi();
		}
	});
	$("#tool_move").click(function () {
		GFRAME.resetDrawMarker();
	});
	$("#tool_distance").click(function () {
		if (14 != GFRAME.addMarkerType) {
			onDistance();
		}
	});
	$("#tool_zoom_in").click(function () {
		if (12 != GFRAME.addMarkerType) {
			onZoomIn();
		}
	});
	$("#tool_zoom_out").click(function () {
		if (13 != GFRAME.addMarkerType) {
			onZoomOut();
		}
	});
	$("#drawMove").click(function() {
		resetDrawMarker();
	});
	$("#drawPoint, #myMap_drawPoint").click(function() {
		addMarkerPoint();
	});
	$("#drawCircle, #myMap_drawCircle").click(function() {
		addMarkerCircle();
	});
	$("#drawRectangle, #myMap_drawRectangle").click(function() {
		addMarkerRectangle();
	});
	$("#drawPolygon, #myMap_drawPolygon").click(function() {
		addMarkerPolygon();
	});
	$("#drawLine, #myMap_drawLine").click(function() {
		addMarkerLine();
	});
	setTooltip("#drawMove", lang.mapMove);
	setTooltip("#drawPoint", lang.addPoint);
	setTooltip("#drawCircle", lang.tipAddCircle);
	setTooltip("#drawRectangle", lang.addRectangle);
	setTooltip("#drawPolygon", lang.addPolygon);
	setTooltip("#drawLine", lang.addLine);
	setTooltip("#myMap_drawMove", lang.mapMove);
	setTooltip("#myMap_drawPoint", lang.addPoint);
	setTooltip("#myMap_drawCircle", lang.tipAddCircle);
	setTooltip("#myMap_drawRectangle", lang.addRectangle);
	setTooltip("#myMap_drawPolygon", lang.addPolygon);
	setTooltip("#myMap_drawLine", lang.addLine);
	var drawing = getUrlParameter("drawing");
	if (drawing != "" && drawing == "1" ) {
//		$("#draw_box").show();
		$("#drawMove").hide();
		$("#drawPoint").show();
		$("#drawCircle").show();
		$("#drawRectangle").show();
		$("#drawPolygon").show();
		$("#drawLine").show();
	} else {
//		$("#draw_box").hide();
		$("#drawMove").hide();
		$("#drawPoint").hide();
		$("#drawCircle").hide();
		$("#drawRectangle").hide();
		$("#drawPolygon").hide();
		$("#drawLine").hide();
	}
}

function doMapFullScreen(isFullscreen) {
	if (typeof parent.ttxMapFullScreen == "function") {
		parent.ttxMapFullScreen(isFullscreen);
	}
}

function doMapDocumentMouseClick() {
	if (typeof parent.ttxMapDocumentMouseClick == "function") {
		parent.ttxMapDocumentMouseClick();
	}
}

function doMapDocumentMouseMove(e) {
	if (typeof parent.ttxMapDocumentMouseMove == "function") {
		parent.ttxMapDocumentMouseMove(e);
	}
}

//给保存按钮添加事件
function doMapBtnSaveClick() {
	if (typeof parent.ttxMapBtnSave == "function") {
		parent.ttxMapBtnSave();
	}
}

function map_init() {
	for (var i = 0; i < scriptUrl.length; ++ i) {
		//$.getScript( scriptUrl[i] ).complete(function(){
		loadScript( scriptUrl[i], function(){
			++ readyScriptUrl;
			doLoadMapScriptSuc();
		});
	}
}

function doLoadMapScriptSuc() {
	if (readyScriptUrl == scriptUrl.length) {
		if (!isBeginLoadMap) {
			isBeginLoadMap = true;
			setPanelWidth();
			GFRAME = new mapframe();
			GFRAME.createMap(false);
		}
	}
}

/**
 *设置页面大小
 */
function setPanelWidth() {
	var wndWidth = document.documentElement.clientWidth;
	var wndHeight = document.documentElement.clientHeight;
	$(".dm_map").css("width", wndWidth);
	$(".dm_map").css("height", wndHeight);
	$("#mapcanvas").css("width", wndWidth);
	$("#mapcanvas").css("height", wndHeight - 39);
}

/*
 * 设置语言信息
*/
function loadLanguage() {
	$("#maptoolname").html("<i class=\"icon icon_tool\"></i>" + lang.mapTool + "<i class=\"icon icon_xia\"></i>");
	$("#fullScreen").html("<i class=\"icon icon_bigMap\"></i><label>"+ lang.fullScreen +"</label>");
	$("#rect_searchname").html("<i class=\"icon icon_lak\"></i>" + lang.mapRectSearch + "<i class=\"icon icon_xia\"></i>");
	$("#rect_search_mycar").text(lang.mapRectMyCar);
	$("#rect_search_hiscar").text(lang.mapRectHisCar);
	$("#tool_move").text(lang.mapTipMove);
	$("#tool_distance").text(lang.tipDistance);
	$("#tool_zoom_in").text(lang.tipZoomIn);
	$("#tool_zoom_out").text(lang.tipZoomOut);
	//地图导航栏添加按钮
	$("#mapMoreBtn #btnSave").text(lang.save);
	
	//我的地图
	$('#myMap_ .spantitle').text(lang.monitor_myMap);
	$('#myMap_ #pointTitle').text(lang.mark_point);
	$('#myMap_ #areaTitle').text(lang.mark_area);
	$('#myMap_ #lineTitle').text(lang.mark_line);
}

/**
 * 设置启用地图点聚合参数
 */
function setMarkerClusterParam(enable, maxZoom_, minSize_, addVehicleFunc, delVehicleFunc){
	if(enable) {//启用点聚合
		GFRAME.useMarkerClusterer = true;
		//先删除地图所有车辆
		if(typeof addVehicleFunc == 'function') {
			delVehicleFunc();
		}
		//初始化点聚合对象
		if(GFRAME.markerClusterer == null) {
			if(typeof MarkerClusterer != "undefined") {
				GFRAME.markerClusterer = new MarkerClusterer(GFRAME.map, {maxZoom: maxZoom_, minClusterSize: minSize_});
			}
		}else {
			//处理点聚合事件
			GFRAME.markerClusterer.removeEventListener();
			GFRAME.markerClusterer.initEventListener();
			//设置点聚合参数
			GFRAME.markerClusterer.setClusterZoomAndSize(maxZoom_, minSize_);
		}
		//再添加车辆到地图
		if(typeof addVehicleFunc == 'function') {
			addVehicleFunc();
		}
	}else {//取消启用
		if(GFRAME.markerClusterer != null) {
			//先删除地图所有车辆
			if(typeof addVehicleFunc == 'function') {
				delVehicleFunc();
			}
			//删除点聚合事件
			GFRAME.markerClusterer.removeEventListener();
			//清除点聚合
			GFRAME.markerClusterer.clearMarkers();
			GFRAME.useMarkerClusterer = false;
			GFRAME.markerClusterer = null;
			//再添加车辆到地图
			if(typeof addVehicleFunc == 'function') {
				addVehicleFunc();
			}
		}
	}
};

/*
 * 切换地图 
*/
function switchMap(type) {
	if (typeof parent.ttxMapReload == "function") {
		rootParent.saveMapType(type);
		parent.ttxMapReload();
	}
}

/*
 * 显示或者隐藏工具栏
 */
function hideToolbar(hide) {
	var lstBox = [];
	lstBox.push("#flllscreen_box");
	lstBox.push("#changemap_box");
	lstBox.push("#rect_searchbox");
	lstBox.push("#map_toolbox");
	lstBox.push("#draw_box");
	//隐藏我的地图
	lstBox.push("#myMap_");
	for (var i = 0; i < lstBox.length; ++ i) {
		if (hide) {
			$(lstBox[i]).hide();
		} else {
			$(lstBox[i]).show();
		}
	}
}

/*
 * 启用我的地图
 */
function enableMyMap(enable) {
	if(enable) {
		//我的地图
		$('#myMap_').show();
		$("#myMap_drawPoint").show();
		myMap = new monitorMyMap();
		myMap.setRoleCls(rootParent.myUserRole);
		myMap.initialize();
	}else {
		$('#myMap_').hide();
	}
}

//是否启用切换地图
function enableChangeMap(show) {
	if(show) {
		$('#changemap_box').show();
	}else {
		$('#changemap_box').hide();
	}
}

//是否启用地图工具
function enableMapTool(show) {
	if(show) {
		$('#map_toolbox').show();
	}else {
		$('#map_toolbox').hide();
	}
}

//是否启用画点操作
function enableDrawPoint(show) {
	if(show) {
		$('#drawPoint').show();
	}else {
		$("#drawPoint").hide();
	}
}

/*
 * 删除地理位置
 */
function deletePositionTip() {
	$("#overVehicleAddress").html("");
}

/*
 * 是否可切换地图
 * @param hide
 */
function setSwitchMap(show) {
	if(show) {
		$('#mapSelect').show();
	}else {
		$('#mapSelect').hide();
	}
}

/*
 * 是否启用拉框查找
 * @param hide
 */
function enableSearchbox(show) {
	if(show) {
		$('#selectSearchbox').show();
	}else {
		$('#selectSearchbox').hide();
	}
}

/**
 * 圆，面和线 改变事件
 */
function markerLineupdate() {
	if(typeof parent.markerLineupdate == 'function') {
		parent.markerLineupdate();
	}
}

//设置地图全屏按钮样式
function doSetMapFullIcon(isFull) {
	if(isFull) {
		$('#fullScreen .icon').removeClass('icon_bigMap').addClass('icon_s_re');
	}else {
		$('#fullScreen .icon').removeClass('icon_s_re').addClass('icon_bigMap');
	}
}

//设置地图全屏按钮文字
function doSetMapFullTitle(title) {
	$('#fullScreen label').text(title);
}

//显示地图导航栏保存按钮
function enableMapMoreBtnAdd(enable){
	if(enable) {
		$("#mapMoreBtn #btnSave").show();
	}else {
		$("#mapMoreBtn #btnSave").hide();
	}
}

function formatGeoKey(jingdu, weidu) {
	return jingdu + "-" + weidu;
}

/*
 * 需要使用地图的经纬度来进行解析
 * 成功返回非空值，{address,city}
 */
function getGeoAddress(jingDu, weiDu) {
	var geokey = formatGeoKey(jingDu, weiDu);
	return mapAddress.get(geokey);
}

/*
 * 需要使用地图的经纬度来进行解析
 * callback 参数：key, jing, weidu, address, city
 * key用于传参使用，回调时返回些参数，便于上层使用
 */
function geocoderAddress(key, jingDu, weiDu, callback) {	
	var find = getGeoAddress(jingDu, weiDu);
	if (find != null) {
		try {
			callback(key, jingDu, weiDu, find.address, find.city);
		}catch(e) {}
	} else {
		myParseAddressEx(key, jingDu, weiDu, callback);	
	}
};

/*
 * 保存获取的地理位置
 */
function saveGeoAddress(jingdu, weidu, address, city) {
	var ret = {};
	ret.address = address;
	ret.city = city;
	mapAddress.put(formatGeoKey(jingdu, weidu), ret);
}

/*
 * 通知上层地图上进行的操作
 */
function doMapDrawMarker(type, jingdu, weidu, param) {
	if(type == 1 || type == 2 || type == 3 || type == 9 || type == 10){
		//地图上画图操作
		if(myMap) {
			myMap.addMarkerAreaInfo(type, jingdu, weidu, param);
		}
	}else {
		if (typeof parent.ttxMapDrawMarker == "function") {
			if (type == 4) {
				param = rectSearchType;
			}
			parent.ttxMapDrawMarker(type, jingdu, weidu, param);
		}
	}
}

/*
 * 通知上层地图上车辆弹窗进行的操作
 */
function doClickmenuitem(vehiIdno, menuId, popId) {
	if (typeof parent.ttxMapClickmenuitem == "function") {
		parent.ttxMapClickmenuitem(vehiIdno, menuId, popId);
	}
}

/**
 * 判断点是否在区域内
 */
function isPointInRect(ptJingdu, ptWeidu, lstJingdu, lstWeidu) {
	ptJingdu = parseFloat(ptJingdu, 10);
	ptWeidu = parseFloat(ptWeidu, 10);
	var arrJing = lstJingdu.split(',');
	var jingDu1 = parseFloat(arrJing[0], 10);
	var jingDu2 = parseFloat(arrJing[1], 10);
	var arrWei = lstWeidu.split(',');
	var weiDu1 = parseFloat(arrWei[0], 10);
	var weiDu2 = parseFloat(arrWei[1], 10);
	if(jingDu1 >= jingDu2) {
		if(ptJingdu > jingDu1 || ptJingdu < jingDu2) {
			return false;
		}
	}else {
		if(ptJingdu < jingDu1 || ptJingdu > jingDu2) {
			return false;
		}
	}
	if(weiDu1 >= weiDu2) {
		if(ptWeidu > weiDu1 || ptWeidu < weiDu2) {
			return false;
		}
	}else {
		if(ptWeidu < weiDu1 || ptWeidu > weiDu2) {
			return false;
		}
	}
	return true;
}

/**
 * 是否禁止系统右键  true 禁止
 */
function disableSysRight(id,disable,func) {
	if(disable) {
		if(typeof func != 'undefined' && func != null) {
			$(id).on('contextmenu',func);
		}else {
			$(id).on('contextmenu',function(){return false;});
		}
	}else {
		$(id).unbind('contextmenu');
	}
}

/**
 * 轨迹点居中
 */
function trackCenterVehicle(trackId, vehiId, hideMarkerPop) {
	var track = findTracker(trackId);
	if (track != null){
		var trackVehiId = trackVehicleId(trackId, vehiId);
		var vehicle = findVehicle(trackVehiId);
		if(vehicle != null) {
			if (vehicle.popMarker != null) {
				//将之前显示的车辆隐藏
				if(hideMarkerPop) {
					if (null != GFRAME.openPopMarkerVehicle){	
						if (GFRAME.openPopMarkerVehicle == vehicle.getIdno()){
							moveVehiCenter(vehicle, true, GFRAME.trackZoomLevel);
							return ;
						}
						hideVehiclePop();
					} else {
						hideMapmarkerPop();
					}
					showVehiclePop(vehicle);
				}
				moveVehiCenter(vehicle, true, GFRAME.trackZoomLevel);
			}
		}
	}
}

//修改我的地图标记（database）
function editMarkerAreaInfo(markerId, type) {
	if(myMap) {
		myMap.editMarkerAreaInfo(markerId, type);
	}
}

//删除我的地图标记（database）
function delMarkerAreaInfo(markerId, type) {
	if(myMap) {
		myMap.delMarkerAreaInfo(markerId, type);
	}
}

//添加我的地图标记成功（database）
function doSaveMarkSuc(marker) {
	if(myMap) {
		myMap.doSaveMarkerSuc(marker);
		//轨迹回放添加线路成功，删除起点和终点标记
		if(typeof parent.delTrackLinePointMarker == 'function') {
			parent.delTrackLinePointMarker();
		}
		//设置车辆画区域标志 为false
		if(typeof parent.setVehicleDrowing == 'function') {
			parent.setVehicleDrowing(false);
		}
	}
}

//修改我的地图标记成功（database）
function doEditMarkSuc(marker) {
	if(myMap) {
		myMap.doEditMarkSuc(marker);
	}
}

//修改标记信息改变地图上标记的大小
function doEditMarkChangeParam(marker, type) {
	if(myMap) {
		myMap.doEditMarkChangeParam(marker, type);
	}
}