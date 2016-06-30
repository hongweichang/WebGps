var api = frameElement.api, W = api.opener;
$(document).ready(function () {
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
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
var markType = getUrlParameter('markType');
var oldMark = getUrlParameter('markType');
var arealist = new Hashtable();
var oldId = "";

function loadScript(src, callback) {
	var otherJScipt = document.createElement("script"); 
	otherJScipt.setAttribute("type", "text/javascript"); 
	otherJScipt.setAttribute("src", src); 
	document.getElementsByTagName("head")[0].appendChild(otherJScipt);//追加到head标签内 
	//判断服务器 
	if(typeof otherJScipt.onreadystatechange != 'undefined') {
		otherJScipt.onreadystatechange = function () { 
			//IE下的判断，判断是否加载完成 
			if (otherJScipt && (otherJScipt.readyState == "loaded" || otherJScipt.readyState == "complete")) { 
				otherJScipt.onreadystatechange = null; 
				if (callback != null) {
					callback(); 
				}
			} 
		}; 
	}else if(typeof otherJScipt.onload != 'undefined') {
		otherJScipt.onload = function () { 
			otherJScipt.onload = null;
			if (callback != null) {
				callback(); 
			}
		};
	}else {
		if (callback != null) {
			callback(); 
		}
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
	$("#flllscreen_box").hide();
	$("#changemap_box").css('margin-right',10);
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
	//画图工具
	//$("#draw_box").hide();
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
	
	var mod = [];
	
	$('#toolbar-search').flexPanel({
		SerachBarModel :
		{display: parent.lang.rule_areaName, name : 'device', pfloat : 'left'}
	});
	$('#toolbar-btn').flexPanel({
		ButtonsModel : mod
	});
	
	$('#roleInfoTable').flexigrid({
		url: 'StandardVehicleRuleAction_listMark.action?markType='+markType,
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 30, sortable : false, align: 'center'},
			{display: parent.lang.name, name : 'name', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'}
			],
		singleSelect:true, //是否单选
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
		useRp: true,
		title: false,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: false,
		onSuccess: getData,
		onSubmit: false,
	});
	
	$('#toolbar-search .y-btn').on('click',function(){
		getMapMark(markType);
		loadQuery(markType,1);
	});
	$('#markPoint').text(parent.lang.mark_point);
	$('#markLine').text(parent.lang.mark_line);
	$('#markArea').text(parent.lang.mark_area);
	$('#point').on('click',function(){
		markType = 1;
		getMapMark(markType);
		loadQuery(markType,1);
	});
	$('#line').on('click',function(){
		markType = 2;
		getMapMark(markType);
		loadQuery(markType,1);
	});
	$('#area').on('click',function(){
		markType = 3;
		getMapMark(markType);
		loadQuery(markType,1);
	});
	$('#roleInfoTable').flexSelectRowPropFun(function(marker){
		if(oldId != null && oldId != ""){
			var oldInfo = arealist.get(Number(oldId));
			if(oldInfo && oldInfo.markerType == 4) {//删除线路
				deleteMarker(oldId);
//				trackDeleteTrack(oldId);
			}else {
				deleteMarker(oldId);
			}
		}
		var id = $(marker).attr('data-id');
		var info = arealist.get(Number(id));
		var gps = getConvertBaiduGoogle(info.jingDu, info.weiDu, info.mapType);
		if(!info.color) {
			info.color = "FF0000";
		}
		var statusStr = getMarkerStatus(info);
		if(info && info.markerType == 4) {//添加线路
//			$("#overVehicleAddress").hide();
//			selectInsertLine(id, gps.lng, gps.lat);
			insertMarker(id);
			updateMarker(id, 9, info.name, gps.lng, gps.lat
					, 0, info.color, statusStr, info.radius);
			selectMarker(id);
		}else {
			insertMarker(id);
			updateMarker(id, info.markerType, info.name, gps.lng, gps.lat
					, 0, info.color, statusStr, info.radius);
			selectMarker(id);
		}
		oldId = id;
	});
}

/**
 * 获取标记状态
 * @param info
 * @returns
 */
function getMarkerStatus(info) {
	var html = [];
	//描述
	if(info.remark) {
		html.push('<span class="b">' + parent.lang.rule_desc_tip + '</span>&nbsp;<span>' + info.remark + '</span><br/>');
	}
	//图片
	if(info.image) {
		html.push('<span><img src="../../'+ info.image +'" style="width:220px;height:120px;border:1px solid #0071c6;margin-top:5px;"></img></span><br/>');
	}
	return html.join("");
}

//经纬度转换，mapType_标记的地图类型
function getConvertBaiduGoogle(jingDu, weiDu, mapType_) {
	var ret = {};
	ret.lng = '';
	ret.lat = '';
	var jingDus = jingDu.split(',');
	var weiDus = weiDu.split(',');
	if(mapType_ == 3 && !isBaiduMap()) {//百度转谷歌
		for (var i = 0; i < jingDus.length; i++) {
			var gps = convertBaiduGoogle(weiDus[i], jingDus[i], 1);
			if(i != 0) {
				ret.lng += ',';
				ret.lat += ',';
			}
			ret.lng += gps.lng;
			ret.lat += gps.lat;
		}
	}else if(mapType_ != 3 && isBaiduMap()){//谷歌经纬度转为百度经纬度
		for (var i = 0; i < jingDus.length; i++) {
			var gps = convertBaiduGoogle(weiDus[i], jingDus[i], 2);
			if(i != 0) {
				ret.lng += ',';
				ret.lat += ',';
			}
			ret.lng += gps.lng;
			ret.lat += gps.lat;
		}
	}else {
		ret.lng = jingDu;
		ret.lat = weiDu;
	}
	return ret;	
}

//选择添加线路
function selectInsertLine(lineId, jingDu, weiDu) {
	trackInsertTrack(lineId);
	if(jingDu && weiDu) {
		var track = findTracker(lineId);
		var jingDus = jingDu.split(',');
		var weiDus = weiDu.split(',');
		//画线
		for (var i = 0; i < jingDus.length; i++) {
			if(weiDus.length > i) {
				trackPushPoint(lineId, jingDus[i], weiDus[i]);
				trackDrawPoint(lineId);
				//判断是否可以找到轨迹点信息
				var trackPoint = trackFindVehicle(track, i+1);
				//如果地图上不存在点，则添加
				if (trackPoint == null) {
					trackInsertVehicle(lineId, i+1, 0);
				}
			}
		}
		geocoderAddress(jingDus[0]+'-'+weiDus[0], jingDus[0], weiDus[0], function(key, jingDu, weiDu, address, city) {
			trackUpdateVehicle(lineId, 1, address, jingDu, weiDu
			, 0, 5, parent.lang.track_qiDian, '', true);
			
			geocoderAddress(jingDus[weiDus.length-1]+'-'+weiDus[weiDus.length-1], jingDus[weiDus.length-1], weiDus[weiDus.length-1], function(key, jingDu, weiDu, address, city) {
				trackUpdateVehicle(lineId, weiDus.length, address, jingDu, weiDu
				, 0, 6, parent.lang.track_zhongDian, '', true);
				selectLineSuc(lineId, weiDus.length);
			});
		});
	}
}

function getMapMark(markType){
	if(markType == 1){
		$('#point').addClass('addMark');
		$('#line').removeClass('addMark');
		$('#area').removeClass('addMark');
		$("#drawPoint").show();
		$("#drawCircle").hide();
		$("#drawRectangle").hide();
		$("#drawPolygon").hide();
		$("#drawLine").hide();
	}else if(markType == 2){
		$('#point').removeClass('addMark');
		$('#line').addClass('addMark');
		$('#area').removeClass('addMark');
		$("#drawPoint").hide();
		$("#drawCircle").hide();
		$("#drawRectangle").hide();
		$("#drawPolygon").hide();
		$("#drawLine").show();
	}else{
		$('#point').removeClass('addMark');
		$('#line').removeClass('addMark');
		$('#area').addClass('addMark');
		$("#drawPoint").hide();
		$("#drawCircle").show();
		$("#drawRectangle").show();
		$("#drawPolygon").show();
		$("#drawLine").hide();
	}	
}

function loadQuery(markType,type) {
	var name = '';
	if(type == '1' || type == '2') {
		name = $('#toolbar-search .search-input').val();
	}
	
	var params = [];
	params.push({
		name: 'name',
		value: name
	});
	$('#roleInfoTable').flexOptions(
			{url: 'StandardVehicleRuleAction_listMark.action?markType='+markType,newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function selectMarkArea(markerId){
	var marker = findMarker(markerId);
	if (marker != null) {
		if (GFRAME.map.getZoom() < 10) {
			GFRAME.map.centerAndZoom(marker.position, 10);
		} else {
			GFRAME.map.panTo(marker.position);
		}
		//取消车辆居中
		GFRAME.vehicleCenter = false;
	}
};

function getData(){
	var areaList = $('#roleInfoTable').flexGetData();
	if(areaList != null && areaList.infos != null) {
		var infos = areaList.infos;
		for (var i = 0,j = infos.length; i < j; i++) {
			arealist.put(Number(infos[i].id),infos[i]);
		}
	}
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'operator'){
		pos += '<a class="select" href="javascript:selectAreaInfo('+row['id']+');" title="'+parent.lang.select+'"></a>';
		if((row['userID'] == parent.companyId && row['creator'] == parent.userId) || W.W.lstCompanyId.in_array(row['userID']) || parent.myUserRole.isAdmin()){
			pos += '<a class="delete" href="javascript:delAreaInfo('+row['id']+');" title="'+parent.lang.del+'"></a>';
		}
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function setTooltip(id, tltle) {
	$( id ).attr("title", tltle);
	$( id ).tooltip();
}

function selectAreaInfo(id){
	var mark = arealist.get(Number(id));
	if(oldMark == 1){
		if(oldMark != markType){
			alert(parent.lang.mark_select_point);
		}else{
			W.doSelectArea(mark,1);
		}
	}else if(oldMark == 2){
		if(oldMark != markType){
			alert(parent.lang.mark_select_line);
		}else{
			W.doSelectArea(mark,1);
		}
	}else if(oldMark == 3){
		if(oldMark != markType){
			alert(parent.lang.mark_select_area);
		}else{
			W.doSelectArea(mark,1);
		}
	}
}

function delAreaInfo(id){
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet('StandardVehicleRuleAction_deleteArea.action?id=' + id, function(json,action,success){
		$.myajax.showLoading(false);
		if(success){
			$('#roleInfoTable').flexOptions().flexReload();
		}
	}, null);
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
	$("#drawPoint").click(function() {
		if(oldId != null && oldId != ""){
			deleteMarker(oldId);
		}
		addMarkerPoint();
	});
	$("#drawCircle").click(function() {
		if(oldId != null && oldId != ""){
			deleteMarker(oldId);
		}
		addMarkerCircle();
	});
	$("#drawRectangle").click(function() {
		if(oldId != null && oldId != ""){
			deleteMarker(oldId);
		}
		addMarkerRectangle();
	});
	$("#drawPolygon").click(function() {
		if(oldId != null && oldId != ""){
			deleteMarker(oldId);
		}
		addMarkerPolygon();
	});
	$("#drawLine").click(function() {
		if(oldId != null && oldId != ""){
			deleteMarker(oldId);
		}
		addMarkerLine();
	});
	setTooltip("#drawMove", lang.mapMove);
	setTooltip("#drawPoint", lang.addPoint);
	setTooltip("#drawCircle", lang.tipAddCircle);
	setTooltip("#drawRectangle", lang.addRectangle);
	setTooltip("#drawPolygon", lang.addPolygon);
	setTooltip("#drawLine", lang.addLine);
	$("#drawMove").hide();
	getMapMark(markType);
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
	$("#addAreaOrLine").css("height", wndHeight);
	$("#arealist").css("height", wndHeight-145);
	$(".flexigrid").css("height", wndHeight-75);
	$('.pDiv .pGroup').eq(0).css('display','none');
	$('.pDiv .pGroup').eq(5).css('display','none');
	$(".bDiv").css("height", wndHeight-135);
	$(".dm_map").css("width", wndWidth - 332);
	$(".dm_map").css("height", wndHeight);
	$("#mapcanvas").css("width", wndWidth - 320);
	$("#mapcanvas").css("height", wndHeight - 39);
}

/*
 * 设置语言信息
*/
function loadLanguage() {
	$("#maptoolname").html("<i class=\"icon icon_tool\"></i>" + lang.mapTool + "<i class=\"icon icon_xia\"></i>");
	$("#fullScreen").html("<i class=\"icon icon_bigMap\"></i>" + lang.fullScreen);
	$("#rect_searchname").html("<i class=\"icon icon_lak\"></i>" + lang.mapRectSearch + "<i class=\"icon icon_xia\"></i>");
	$("#rect_search_mycar").text(lang.mapRectMyCar);
	$("#rect_search_hiscar").text(lang.mapRectHisCar);
	$("#tool_move").text(lang.mapTipMove);
	$("#tool_distance").text(lang.tipDistance);
	$("#tool_zoom_in").text(lang.tipZoomIn);
	$("#tool_zoom_out").text(lang.tipZoomOut);
}

/*
 * 切换地图 
*/
function switchMap(type) {
	rootParent.saveMapType(type);
	W.reloadArea();
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
	for (var i = 0; i < lstBox.length; ++ i) {
		if (hide) {
			$(lstBox[i]).hide();
		} else {
			$(lstBox[i]).show();
		}
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
 * 地图上进行画线等操作
 */
function doMapDrawMarker(type, jingdu, weidu, param) {
	/*#define MAP_MARKER_TYPE_POINT			1		//自定义点
	#define MAP_MARKER_TYPE_RECTANGLE		2		//矩形
	#define MAP_MARKER_TYPE_POLYGON			3		//多边形
	#define MAP_MARKER_TYPE_SEARCH			4		//搜索车辆(矩形，param=1表示查找当前车辆，param=2表示查找历史车辆)
	#define MAP_MARKER_TYPE_FULLSCREEN		5		//全屏显示
	#define MAP_MARKER_TYPE_EXPAND			6		//扩展、收缩
	#define MAP_MARKER_TYPE_CENTER			7		//配置中心点，经度 +　纬度　＋　级别
	#define MAP_MARKER_TYPE_SWITCH_MAP		8		//切换地图，地图类型MAP_TYPE_GOOGLE, MAP_TYPE_MAPINFO, MAP_TYPE_BAIDU
	#define MAP_MARKER_TYPE_LINE			9		//画线路
	#define MAP_MARKER_TYPE_CIRCLE			10		//圆形
	#define	MAP_MARKER_TYPE_DISTANCE		11		//测距
	#define MAP_MARKER_TYPE_ZOOMIN			12		//拉框放大
	#define	MAP_MARKER_TYPE_ZOOMOUT		13		//拉框缩小
	#define MAP_MARKER_TYPE_CRUISE			14		//漫游
	#define	MAP_MARKER_TYPE_COUNTRY		15		//全国
	#define MAP_MARKER_TYPE_AREA			16		//测量面积
	#define	MAP_MARKER_TYPE_PRINT		17		//打印
	#define MAP_MARKER_TYPE_CAPTURE		18		//截图 */
	
	//alert(type + " - " + jingdu + " - " + weidu + " - " + param);
	if(type == 1 || type == 2 || type == 3 || type == 10 || type == 9) {
		var data = {};
		data.jingdu = jingdu;
		data.weidu = weidu;
		data.param = param;
		data.markType = type;
		if(type == 1){
			$.dialog({id:'areaInfo', title:parent.lang.addPoint,content: 'url:RulesManagement/AreaInfo.html',
				width:'350px',height:'390px', min:false, max:false, lock:true, parent:api, data:data});
		}else if(type == 2 || type == 3 || type == 10){
			if(type == 2){
				$.dialog({id:'areaInfo', title:parent.lang.addRectangle,content: 'url:RulesManagement/AreaInfo.html',
					width:'350px',height:'410px', min:false, max:false, lock:true, parent:api, data:data});
			}else if(type == 3){
				$.dialog({id:'areaInfo', title:parent.lang.addPolygon,content: 'url:RulesManagement/AreaInfo.html',
					width:'350px',height:'410px', min:false, max:false, lock:true, parent:api, data:data});
			}else if(type == 10){
				$.dialog({id:'areaInfo', title:parent.lang.tipAddCircle,content: 'url:RulesManagement/AreaInfo.html',
					width:'350px',height:'410px', min:false, max:false, lock:true, parent:api, data:data});
			}
		}else if(type == 9){
			$.dialog({id:'areaInfo', title:parent.lang.addLine,content: 'url:RulesManagement/AreaInfo.html',
				width:'350px',height:'390px', min:false, max:false, lock:true, parent:api, data:data});
		}
	}
}

function doSaveMarkSuc(data) {
	$.dialog({id:'areaInfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	$('#roleInfoTable').flexOptions().flexReload();
	if(oldMark == markType){
		W.doSelectArea(data,2);
	}
}