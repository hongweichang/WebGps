var Geocoder = null;

// JavaScript Document
function mapframe(){
	this.isInitSuc = false;
	this.addCtrlCount = 0;
	this.map = null;
	this.isFirstLoadMap = true;
	this.vehicleList = new Hashtable();	//车辆列表
	this.markerList = new Array();	//地图上的标记信息
	this.trackList = new Array();		//地图上的轨迹点信息
	this.trackZIndex = 0;
	this.trackColor = new Array("#00FF00", "#0000FF", "#800040", "#FF0080", "#00FFFF", "#FFFF00");
	this.openPopMarkerVehicle = null;	
	this.vehicleCenter = false;
	this.openPopMarkerShape = null;
	var date = new Date();
	this.parseAddressTime = date.getTime();	
	this.popAllVehicleName = false;
	this.firstResize = true;
	this.wndWidth = 400;
	this.wndHeight = 300;
	this.lastClickTime = date.getTime();	//记录最后一次点击时间，避免出现重复的信息提示
	this.mouseMoveTime = date.getTime();	//避免移动地图时，进行车辆居中显示
	//****************** marker 最大最小 经纬度 ***************************8
	this.MARKER_MAX_JING = -1000
	this.MARKER_MAX_WEI = -1000
	this.MARKER_MIN_JING = 1000
	this.MARKER_MIN_WEI = 1000
	this.zIndex = 2;
	this.MAINLY_ADDRESS = false;//是否为大概地址
	this.defaultZoom = true;//当地图上没有设备,就设置为默认级别
	this.imagePath = "../ttxmap/google/image/";
	//轨迹回放的缩放级别
	this.trackZoomLevel = 12;
	//添加地图标识类型
	this.addMarkerType = 0;		//1表示添加标注，2表示添加矩形，3表示添加多边形，4表示测距，5表示区域查车
	this.isDrawMarker = false;	//是否正在画地图标识信息
	this.showMarkerTip = false;
	//自定义点信息
	this.markerPoint = null;	//自定义点位置
	//画矩形时开始位置
	this.markerRectStart = null;
	this.markerRectangle = null;	//矩形区域地图对象
	this.markerRectBounds = null;	//矩形区域范围
	this.rectangleTool = null;
	//画多边形
	this.markerPolygon = null;	//地图上的多边形对象
	this.markerPolyPoint = new Array();	//多边形的点
	this.markerPolygonListenerAdd = null;	//添加事件
	this.markerPolygonListenerMove = null;	//移动事件
	this.markerPolygonListenerFinish = null;//结束事件
	this.polygonTool = null;
	//工具 画圆、多边形、矩形
	this.drawingManager = null;
	//拉框放大，拉框缩小
	this.rectangleZoom = null;
	//测距工具
	this.distanceTool = null;
	//是否使用点聚合
	this.useMarkerClusterer = false;
	//点聚合对象
	this.markerClusterer = null;
}

mapframe.prototype.createMap = function(resize){//装载地图并加载数据
	if (resize){
		this.restFrame();
	}
	setTimeout(this.loadMap,10);
};

mapframe.prototype.restFrame = function(){//重置页面
	this.resizeFrame();
};

mapframe.prototype.resizeFrame = function(){//重置页面
	var wndWidth = document.documentElement.clientWidth;
	var wndHeight = document.documentElement.clientHeight;
	
		
		
	if(wndWidth < 300) { 
		wndWidth=300;
	}
	if(wndHeight < 300){wndHeight=300;}
	
	$("#BMapLib_cityName").parent().attr("width","100px");
	$("#BMapLib_formPoi").parent().attr("width",(wndWidth - 240)+"px");
	$("#BMapLib_sc_b0").parent().attr("width","100px");
	$("#BMapLib_PoiSearch").css("width","95%");
	$("#BMapLib_cityNameSpan").css("font-size","12px");
	$("#BMapLib_PoiSearch").css("font-size","12px");
	$("#BMapLib_sc_b0").css("font-size","12px");
		
	var _mapcanvas= document.getElementById("mapcanvas");
	_mapcanvas.style.zIndex = "9";
	_mapcanvas.style.position = "absolute";		
	_mapcanvas.style.left = "0px";
	_mapcanvas.style.top = "58px";		
	_mapcanvas.style.width = wndWidth+"px";
	_mapcanvas.style.height = (wndHeight-58)+"px";
}

mapframe.prototype.loadMap = function(){//创建地图
	//显示提示信息窗口	
	
	var jindu = null;
	var weidu = null;
	var zoom = 4;
	
	var initZoom = "";
	var initJingDu = "";
	var initWeiDu = "";

	if (initZoom != "") {
		zoom = parseInt(initZoom);
		if (zoom == 0) {
			zoom = 4;
		}
	}

	if (initJingDu != "" && initWeiDu != "") {
		jindu = parseFloat(initJingDu);
		weidu = parseFloat(initWeiDu);
	} else {
		try
		{
			jindu = "";//geoip_longitude();
			weidu = "";//geoip_latitude();
			if(jindu != null && jindu != ""
		 		&& weidu != null && weidu != "")
			{
			}
			else
			{
				weidu = 29.523489;
				jindu = 106.486654; 
			}
		}
		catch(err) 
		{
			weidu = 29.523489;
			jindu = 106.486654; 
		}
	}
	
	Geocoder = new BMap.Geocoder();
		
	GFRAME.map = new BMap.Map("mapcanvas");
	//,{zoomLevelMin:5,zoomLevelMax:17}
	var point = new BMap.Point(jindu, weidu);
	GFRAME.map.centerAndZoom(point, parseInt(zoom));
	GFRAME.map.enableScrollWheelZoom();
	GFRAME.map.enableKeyboard();
	GFRAME.map.addEventListener("addcontrol",GFRAME.mapLoaded);
	GFRAME.map.addControl(new BMap.NavigationControl());
 	GFRAME.map.addControl(new BMap.ScaleControl());
	GFRAME.map.addControl(new BMap.OverviewMapControl());
	GFRAME.map.addControl(new BMap.MapTypeControl({type:BMAP_MAPTYPE_CONTROL_HORIZONTAL,
	    	mapTypes:[BMAP_NORMAL_MAP,BMAP_SATELLITE_MAP,BMAP_HYBRID_MAP]   // remove perspective map
	    }));  	
	GFRAME.map.addEventListener("tilesloaded",GFRAME.mapLoaded);
	/*GFRAME.map.addEventListener('resize', function(){//地图可视区域大小发生变化时会触发此事件。
		 alert('resize');
	});
	GFRAME.map.addEventListener('zoomend', function(){//地图更改缩放级别结束时触发触发此事件。。
	   alert('zoomend');
	});
	GFRAME.map.addEventListener('dragend', function(){//停止拖拽地图时触发。
		 alert('dragend');
	});*/
	//地图初始化
	document.onmousemove = mouseCoords;
	setTimeout(function(){
			GFRAME.map.addEventListener("click", GFRAME.mapMouseClick);
			GFRAME.map.addEventListener("mousemove", GFRAME.mapMouseMove);
	},100);
	GFRAME.initDrawManage();
	//初始化点聚合对象
	if(typeof MarkerClusterer != "undefined" && GFRAME.useMarkerClusterer) {
		GFRAME.markerClusterer = new MarkerClusterer(GFRAME.map, {});
	}
};

mapframe.prototype.initDrawManage = function(){
	var styleOptions = {
        strokeColor:"red",    //边线颜色。
        fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 2,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.2,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.4,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
    var markerOptions = {
    	  icon:"red",    //标注所用的图标对象
        enableMassClear:false,      //是否在调用map.clearOverlays清除此覆盖物，默认为true
        offset: 3,       //标注的位置偏移值。
        strokeOpacity: 0.2,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.4,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
    //实例化鼠标绘制工具
    this.drawingManager = new BMapLib.DrawingManager(GFRAME.map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            scale: 0.8 //工具栏缩放比例
        },
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式
    });  
	 //添加鼠标绘制工具监听事件，用于获取绘制结果
    this.drawingManager.addEventListener('markercomplete', drawMarkerEnd);
    this.drawingManager.addEventListener('rectanglecomplete', drawRectangleEnd);
    this.drawingManager.addEventListener('polygoncomplete', drawPolygonEnd);
    this.drawingManager.addEventListener('polylinecomplete', drawLineEnd);
    this.drawingManager.addEventListener('circlecomplete', drawCircleEnd);
};

mapframe.prototype.mapLoaded = function(){
	GFRAME.addCtrlCount += 1;
	if(GFRAME.addCtrlCount >= 6) {
		GFRAME.isInitSuc = true;
	}
};

mapframe.prototype.hiddenRightMenu= function(){//隐藏右键的所有菜单
};

mapframe.prototype.updateDefaultZoom = function(){
	if(this.vehicleList.size() > 0){
		this.defaultZoom = false;	
	}else{
		this.defaultZoom = true;		
	}
};

mapframe.prototype.initRegion = function() {
	this.MARKER_MAX_JING = -1000
	this.MARKER_MAX_WEI = -1000
	this.MARKER_MIN_JING = 1000
	this.MARKER_MIN_WEI = 1000
};

mapframe.prototype.updateRegion = function(jindu, weidu){
	if(jindu *1>  GFRAME.MARKER_MAX_JING ){GFRAME.MARKER_MAX_JING = jindu*1;}
	if(weidu  *1>  GFRAME.MARKER_MAX_WEI  ){GFRAME.MARKER_MAX_WEI  = weidu*1;}
	if(jindu *1<= GFRAME.MARKER_MIN_JING ){GFRAME.MARKER_MIN_JING = jindu*1;}
	if(weidu  *1<= GFRAME.MARKER_MIN_WEI  ){GFRAME.MARKER_MIN_WEI  = weidu*1;}
};

mapframe.prototype.mapAutoCenterZoom = function(){//自动调整缩放界级别
	var center = function(){
		var _m = null;
		if(!GFRAME.defaultZoom){
			_m = getCenterPoint(GFRAME.MARKER_MAX_JING,GFRAME.MARKER_MIN_JING,GFRAME.MARKER_MAX_WEI,GFRAME.MARKER_MIN_WEI);//获取地图中心和经纬度距离
			GFRAME.map.setCenter(new mapobject.maps.LatLng(_m[1], _m[0]));//设置中心位置和缩放级别
			GFRAME.map.setZoom(getRoom(_m[2]));//通过距离获取缩放级别并设置级别
		}else{
			GFRAME.map.setCenter(new mapobject.maps.LatLng(geoip_latitude(), geoip_longitude()));//设置中心位置和缩放级别
			GFRAME.map.setZoom(5);//通过距离获取缩放级别并设置级别
		}
		GFRAME.selectVehicle(GFRAME.openPopMarkerVehicle);
	}
	setTimeout(center,50);
};

mapframe.prototype.closeMaxPop = function(){//关闭marker的弹出层
	hideMapmarkerPop();
	hideVehiclePop();
	var date = new Date();
	GFRAME.lastClickTime = date.getTime();	//记录最后一次点击时间，避免出现重复的信息提示
};

mapframe.prototype.popVehicleName = function(flag){//显示全部POP
	GFRAME.popAllVehicleName = flag;
	var marker = null;
	var vehicle = null;
	GFRAME.vehicleList.each(function showPop(vehiId, vehicle) {
		try	{
			if (GFRAME.openPopMarkerVehicle != vehicle.getID()) {
				if(GFRAME.popAllVehicleName){
					vehicle.popMarker.update({text:vehicle.getName()});
					vehicle.popMarker.show();	
				} else {
					vehicle.popMarker.hide();	
				}
			}
		}catch(e){}
	});
};

mapframe.prototype.getStatusName = function(status) {
	if (0 == status) {
		return "/online/";
	} else if (1 == status) {
		return "/offline/";
	} else if (2 == status) {
		return "/parkaccon/";
	} else if (9 == status) {
		return "/stopaccon/";
	} else if (10 == status) {
		return "/stopaccoff/";
	} else if (11 == status) {
		return "/io/";
	} else {
		return "/alarm/";
	}
};

mapframe.prototype.getVehicleImage = function(huangxiang, status, icon){//获取车辆图标信息
	
	var imgIndex = (Number(huangxiang) & 0x7);
	var statustype = Number(status);
	var image = null;
	if (statustype < 4 || statustype == 9 || statustype == 10 || statustype == 11) {
		image = GFRAME.imagePath + icon + this.getStatusName(status) + (imgIndex + 1) + ".png";
	} else {
		if (4 == statustype) {	//停车
			image = GFRAME.imagePath + "parking.gif";
		} else if (5 == statustype) {	//起点
			image = GFRAME.imagePath + "qidian.gif";
		} else if (6 == statustype) {	//终点
			image = GFRAME.imagePath + "zhongdian.gif";
		} else if (7 == statustype) {
			image = GFRAME.imagePath + "position.gif";
		} else if (8 == statustype) {
			image = GFRAME.imagePath + "alarmmarker.gif";
		}
	}

	return image;
};

var _s="-1";
function hidemore(id,time){
	var divotherChannel=document.getElementById(id);
	if(_s!="-1")clearInterval(_s);
	_s = setInterval(function() {
		if(divotherChannel.style.display!="none")divotherChannel.style.display="none";
		clearInterval(_s);
	},time)
};

function clickmenuitem(vehiIdno, menuId, popId){
//	if (isChrome) {
//		app.sendMessage('OnClickMenu', [vehiIdno, menuId, popId]);
//	} else {
//		window.external.OnClickMenu( vehiIdno, menuId, popId);
//	}
//	var msg = "clickmenuitem!";
//	msg += "vehiId=" + vehiId;
//	msg += ",menuId=" + menuId;
//	msg += ",popId=" + popId;
//	alert(msg);
	doClickmenuitem(vehiIdno, menuId, popId);
	
	var date = new Date();
	GFRAME.lastClickTime = date.getTime();
};

function showmore(id, vehiIdno, menuId){//rec
	if(_s!="-1")clearInterval(_s);
	var vehicle = findVehicle(vehiIdno);
	if (vehicle != null)
	{
		var menuitem = vehicle.getMenuitem(menuId);
		if(menuitem.submenu.length > 0) {
			var _htmStr = "";
			_htmStr += "<ul>";
			
			for (var i = 0; i < menuitem.submenu.length; ++ i)
			{
				var submenuitem = menuitem.submenu[i];
				_htmStr += "<li><a href='javascript:void(0);' onclick='";
				_htmStr += "clickmenuitem(\"";
				_htmStr += vehiIdno;
				_htmStr += "\",\"";
				_htmStr += menuId;
				_htmStr += "\",\"";
				_htmStr += submenuitem.getIndex();
				_htmStr += "\")' ";
				_htmStr += "class=\"";
				_htmStr += submenuitem.getCls();
				_htmStr += "\" ";
				_htmStr += "title=\"";
				_htmStr += submenuitem.getName();
				_htmStr += "\">";
//				_htmStr += submenuitem.getName();
				_htmStr += "</a></li>";
			}
			_htmStr += "</ul>";
			
			var _obj = document.getElementById(id);
			_obj.style.left = (mousePos.x-25)+"px";
			_obj.style.top = (mousePos.y-10)+"px";
			_obj.style.position = "absolute";	
			_obj.style.display = "block";
			_obj.innerHTML = _htmStr;
		}else {
			doClickmenuitem(vehiIdno, menuId);
		}
	}
	
	var date = new Date();
	GFRAME.lastClickTime = date.getTime();
};

function getTxtByVehicle(vehicle){
	var html=[];
	html.push('<a style="position:absolute;top:1px;right:1px" href="javascript:;" onclick="GFRAME.closeMaxPop();"><img height="10" src="' + GFRAME.imagePath + 'iw_close.gif"/></a>');
	html.push('<div class="mapTip">');
	if (vehicle.getName() != "") {
		html.push('<span class="b">'+vehicle.getName()+'&nbsp;&nbsp;&nbsp;&nbsp;</span><br/>');
	}
	html.push(vehicle.getStatusStr());
	var menuNum = vehicle.menuitem.length;
	if (menuNum > 0){
		for (var i = 0; i < menuNum; ++ i){
			var menuitem = vehicle.menuitem[i];
			if (menuitem.getPopMenu()){
				html.push('<a class="'+menuitem.getCls()+'" title="'+ menuitem.getName() +'" href="javascript:void(0)" onclick="showmore(\'menu_more\',\''+vehicle.getIdno()+'\',\''+menuitem.getIndex()+'\')" onMouseOut="hidemore(\'menu_more\',500)" style="margin: 5px 5px 0px 10px;"></a>');
				html.push('&nbsp;&nbsp;');
			}else{
				html.push('<a class="'+menuitem.getCls()+'" title="' + menuitem.getName() + '" href="javascript:void(0)" onclick="clickmenuitem(\'' + vehicle.getIdno() + '\',\'' + menuitem.getIndex() + '\',0)" style="margin: 5px 5px 0px 10px;"></a>&nbsp;&nbsp;');
			}
		}
		//html.push('<a href="javascript:void(0);" onclick="GFRAME.closeMaxPop();">' + lang.close + '</a>&nbsp;&nbsp;');
	} else {
		//html.push('<br/><a href="javascript:void(0);" onclick="GFRAME.closeMaxPop();">' + lang.close + '</a>&nbsp;&nbsp;');
	}
	
	html.push('</div>');
	return html.join("");
};

function getTxtByMarker(marker){
	var html=[];
	html.push('<a style="position:absolute;top:1px;right:0px" href="javascript:;" onclick="GFRAME.closeMaxPop();"><img height="10" src="' + GFRAME.imagePath + 'iw_close.gif"/></a>');
	html.push('<div class="mapTip">');
	html.push('<span class="b">'+ marker.getName() +'&nbsp;&nbsp;&nbsp;&nbsp;</span><br/>');
	html.push(marker.status);
	html.push('</div>');
	return html.join("");
};

function getTrackPlayText(name, speed, huangxiang, time){
	var html=[];
	html.push('<div class="mapTip">');
	html.push('<span class="b">'+name+'&nbsp;&nbsp;&nbsp;&nbsp;</span><br/>');
	html.push('<span class="b">'+lang.speed + ':</span>'+speed+'('+huangxiang+')<br/>');
	html.push('<span class="b">'+lang.time + ':</span>'+time+'<br/>');
	html.push('</div>');
	return html.join("");
};

mapframe.prototype.getLatLngBounds = function(latlng0, latlng2) {
	var startPt_ = overlay.getProjection().fromLatLngToDivPixel(latlng0);
	var endPt_ = overlay.getProjection().fromLatLngToDivPixel(latlng2);
	var left = Math.min(startPt_.x, endPt_.x);
	var top = Math.min(startPt_.y, endPt_.y);
	var width = Math.abs(startPt_.x - endPt_.x);
	var height = Math.abs(startPt_.y - endPt_.y);
	var sw = overlay.getProjection().fromDivPixelToLatLng(new google.maps.Point(left, top + height));
	var ne = overlay.getProjection().fromDivPixelToLatLng(new google.maps.Point(left + width, top));
	return new google.maps.LatLngBounds(sw, ne);
//	var e,w,n,s;
//	latlng0.lng()>latlng2.lng() ? (e=latlng0.lng(),w=latlng2.lng()) : (e=latlng2.lng(),w=latlng0.lng());
//	latlng0.lat()>latlng2.lat() ? (n=latlng0.lat(),s=latlng2.lat()) : ( n=latlng2.lat(),s=latlng0.lat());
//	return new google.maps.LatLngBounds(new google.maps.LatLng(s,w),new google.maps.LatLng(n,e));    
};

function getLatLngString(latlngList) {
	var lat = new Array();
	var lng = new Array();
	for (var i = 0; i < latlngList.length; i += 1) {
		lat.push(latlngList[i].lat.toFixed(6));
		lng.push(latlngList[i].lng.toFixed(6));
	}
	return {lat:lat.toString(),lng:lng.toString()};					
}

//移动时显示车辆信息
mapframe.prototype.mapMouseMove = function(event){
	if (!GFRAME.isMarkerEdit()) {
		var date = new Date();
		GFRAME.mouseMoveTime = date.getTime();
		
		if (GFRAME.vehicleList.size() <= 100) {
			var latlng = event.point;
			var markpoint = GFRAME.map.pointToOverlayPixel(latlng);//overlay.getProjection().fromLatLngToDivPixel(latlng);
			var strHtml = "",num = 0;//个数
			GFRAME.vehicleList.each(function makeShow(vehiId, vehicle) {
				try	{
					if( num <= 10 ) {
						if (vehicle.show && vehicle.movetip) {
							var point = GFRAME.map.pointToOverlayPixel(new BMap.Point(vehicle.getJindu(), vehicle.getWeidu()));
							if(point.x<(markpoint.x+15)&&point.x>(markpoint.x-15)&&point.y<(markpoint.y+25)&&point.y>(markpoint.y-25)){			
								if (vehicle.getName() != "") {
									strHtml += vehicle.getName() + "<br />";
									num++;
								}
							}  
						}
					}
				}catch(e){}
			});
			
			if( num > 0){
				$("#tip").show();
				$("#tip").css("left", mousePos.x+"px");
				$("#tip").css("top", mousePos.y+"px");
				if(num>10) str = strHtml+".......";
				else str = strHtml;
				$("#tip").html(str);
			} else  {
				$("#tip").hide();
			}
		}
	} else {
	}
	
	//var latlng = event.point;
	//var markpoint = GFRAME.map.pointToOverlayPixel(latlng);
	var ret = {};
	ret.pageY = mousePos.y;
	doMapDocumentMouseMove(ret);
};

//响应点击操作
mapframe.prototype.mapMouseClick = function(event){	
	if (!GFRAME.isMarkerEdit()) {
		var nowTime = isTimeout(GFRAME.lastClickTime, 200);
		if (nowTime == null) {
			return ;
		}
		
		GFRAME.lastClickTime = nowTime;
		
		var minDistanceVehicle = null;
		var minDistance = null;
		var minTemp = null;
		var latlng = event.point;
		var point = GFRAME.map.pointToOverlayPixel(latlng);
		var vehicle = null;
		GFRAME.vehicleList.each(function findMinDistance(vehiId, vehicle) {
			try	{
				var markpoint = GFRAME.map.pointToOverlayPixel(new BMap.Point(vehicle.getJindu(), vehicle.getWeidu()));
				if(point.x<(markpoint.x+25)&&point.x>(markpoint.x-25)&&point.y<(markpoint.y + 15)&&point.y>(markpoint.y-15)){				
					minTemp = Math.abs(markpoint.x - point.x) + Math.abs(markpoint.y - point.y);
					if (null == minDistanceVehicle) {
						minDistanceVehicle = vehicle;
						minDistance = minTemp;
					} else {
						if (minDistance > minTemp) {
							minDistanceVehicle = vehicle;
							minDistance = minTemp;
						}
					}
				}
			}catch(e){}
		});
		
		if (minDistanceVehicle != null) {
			clickVehicle(minDistanceVehicle);
			return ;
		}
		
		//如果不是点击相应的点信息，则将弹出提示关闭
		GFRAME.closeMaxPop();
	} else {
	}
};

mapframe.prototype.markerMouseClick = function(event){	
	var nowTime = isTimeout(GFRAME.lastClickTime, 200);
	if (nowTime == null) {
		return ;
	}
	
	GFRAME.lastClickTime = nowTime;
	//判断点
	var mapmarker = null;
	for(var i = 0;i<GFRAME.markerList.length;i++){
		mapmarker = GFRAME.markerList[i];
		if (mapmarker.shape == event.target) {
			popupMapmarker(mapmarker, event.point);
			return;
		}
	}
	//如果不是点击相应的点信息，则将弹出提示关闭
	GFRAME.closeMaxPop();
};

mapframe.prototype.isMarkerEdit = function() {
	return this.addMarkerType != 0 ? true : false;
};

mapframe.prototype.isMarkerPoint = function() {
	return this.addMarkerType == 1 ? true : false;
};

mapframe.prototype.isMarkerRectangle = function() {
	return (this.addMarkerType == 2 || this.addMarkerType == 4) ? true : false;
};

mapframe.prototype.isMarkerPolygon = function() {
	return this.addMarkerType == 3 ? true : false;
};

mapframe.prototype.getRectangleTip = function() {
		if (this.addMarkerType == 2) {
				return lang.tipAddRectangle;
		} else {
				return lang.tipSearch;
		}
};

mapframe.prototype.initMarkerPolygon = function() {
	if (this.markerPolygon == null) {
		var polyOptions = {
				 fillColor: "#FF0000",    // 填充色
		     fillOpacity: 0.3,     // 填充色透明度
		     strokeColor: "#FF0000",  // 线条颜色 黑色
		     strokeOpacity: 0.8,   // 透明度 70%
		     strokeWeight: 3       // 宽度 5像素
		};
		this.markerPolygon = new mapobject.maps.Polygon(polyOptions);
		this.markerPolygon.setMap(GFRAME.map);
		this.map.setOptions({
			disableDoubleClickZoom:true //双击放大
		}); 
		//必须给polyline
		this.markerPolygonListenerAdd = mapobject.maps.event.addListener(this.markerPolygon, 'click', this.mapAddPolygon);
		this.markerPolygonListenerMove = mapobject.maps.event.addListener(this.markerPolygon, 'mousemove', this.mapAddPolyMove); 
		this.markerPolygonListenerFinish = mapobject.maps.event.addListener(this.markerPolygon, 'dblclick', this.mapAddPolyFinish); 
	}
};

mapframe.prototype.mapAddPolygon = function(event) {
	if (GFRAME.showMarkerTip) {
		GFRAME.isDrawMarker = true;
		if (GFRAME.markerPolyPoint.length >= 64) {
			//如果车辆数目超过64个，则强制结束
			GFRAME.mapAddPolyFinish(event);
		} else {
			//添加多边形
			GFRAME.markerPolyPoint.push(event.latLng);
			//显示到地图上
			GFRAME.markerPolygon.setPath(GFRAME.markerPolyPoint);
		}
	}
};

mapframe.prototype.mapAddPolyMove = function(event) {
	if (GFRAME.showMarkerTip) {
		if (GFRAME.markerPolygon != null) {
			var point = new Array();
			for (var i = 0; i < GFRAME.markerPolyPoint.length; i += 1) {
				point.push(GFRAME.markerPolyPoint[i]);
			}
			point.push(event.latLng);
			GFRAME.markerPolygon.setPath(point);
		}
	}
};

mapframe.prototype.mapAddPolyFinish = function(event) {
	if (GFRAME.markerPolyPoint.length > 2) {
		var temp = getLatLngString(GFRAME.markerPolyPoint);
		GFRAME.hideDrawTip();
		try {
			doMapDrawMarker(3, temp.lng, temp.lat, "FF0000");
		} catch(err) {
		}
	}
	//双击结束编辑多边形
	GFRAME.resetMarker();
};

mapframe.prototype.resetDrawMarker = function() {
	if (GFRAME.addMarkerType != 0) {
		GFRAME.addMarkerType = 0;
		GFRAME.isDrawMarker = false;
		//GFRAME.map.setOptions({
		//	draggable:true //允许拖动地图
		//});
		//GFRAME.map.setOptions({
		//	disableDoubleClickZoom:false //双击放大
		//}); 
		//自定义点
		if (GFRAME.markerPoint != null) {
			GFRAME.markerPoint.setMap(null);
			GFRAME.markerPoint = null;
		}
		if (GFRAME.markerTool != null) {
			GFRAME.markerTool.close();
		}
		//矩形
		if (GFRAME.markerRectangle != null) {
			GFRAME.markerRectangle.setMap(null);
			GFRAME.markerRectangle = null;
		}
		GFRAME.markerRectStart = null;
		GFRAME.markerRectBounds = null;	//矩形区域范围
		if (GFRAME.rectangleTool != null) {
			GFRAME.rectangleTool.close();
		}
		//多边形
		if (GFRAME.polygonTool != null) {
			GFRAME.polygonTool.close();
		}
		var polyLength = GFRAME.markerPolyPoint.length;
		for (var i = 0; i < polyLength; i += 1){
			if (GFRAME.markerPolyPoint.length > 0) {
				GFRAME.markerPolyPoint.pop();
			} else {
				break;
			}
		}
		
		$("#drawPoint").removeClass("icon_diy_focus");
		$("#drawCircle").removeClass("icon_circle_focus");
		$("#drawRectangle").removeClass("icon_squer_focus");
		$("#drawPolygon").removeClass("icon_polygon_focus");
		$("#drawLine").removeClass("icon_curve_focus");
		
		/*
		$("#zoomIn").attr("src",GFRAME.imagePath + "zoomin.gif");
		$("#zoomOut").attr("src",GFRAME.imagePath + "zoomout.gif");
		$("#distance").attr("src",GFRAME.imagePath + "distance.gif");
		$("#addCircle").attr("src",GFRAME.imagePath + "addcircle.gif");
		$("#addPoint").attr("src",GFRAME.imagePath + "addpoint.gif");
		$("#addRectangle").attr("src",GFRAME.imagePath + "addrectangle.gif");
		$("#addPolygon").attr("src",GFRAME.imagePath + "addpolygon.gif");
		$("#addLine").attr("src",GFRAME.imagePath + "addline.gif");
		$("#btnSearch").attr("src",GFRAME.imagePath + "search.gif"); */
		
		$("#tip").hide();
		
		GFRAME.drawingManager.close();
		
		if(GFRAME.rectangleZoom != null) {
			GFRAME.rectangleZoom.close();
			GFRAME.rectangleZoom = null;
		}
		if(GFRAME.distanceTool != null) {
			GFRAME.distanceTool.close();
		}
	}
};

mapframe.prototype.resetMarker = function() {
	setTimeout(function () {
		GFRAME.resetDrawMarker();
	}, 100);
};

mapframe.prototype.hideDrawTip = function() {
	$('#tip').hide();
	GFRAME.showMarkerTip = false;
};

//是否正在画地图标记信息
mapframe.prototype.isMarkingDrawing = function() {
	return this.isMarkerEdit() && this.isDrawMarker ? true : false;
};

//是否正在画地图标记信息
mapframe.prototype.isMouseMoving = function() {
	var nowTime = isTimeout(GFRAME.mouseMoveTime, 2000);
	if (nowTime == null) {
		return true;
	} else {
		return false;
	}
};

//单击设置marker在地图中心，缩放级别放
function dblclickSetRoomCenter(weidu,jingdu,map){
	var _zoom = map.getZoom();
	if(_zoom<11){
		map.setCenter(new mapobject.maps.LatLng(Number(weidu), Number(jingdu)));
		map.setZoom(11);
	}else if(_zoom>=11&&_zoom<=18){
		map.setCenter(new mapobject.maps.LatLng(Number(weidu), Number(jingdu)));
		map.setZoom(_zoom+2);
	}else{
		alert(lg.zoomMax);
	}
};

//var geocoder = new BMap.Geocoder();
//var geocoder = new google.maps.Geocoder();
//调用googleAPI进行地址解析
function parseAddress (weidu,jingdu,arr,name){
	if (!initParseAddress) {
		return ;
	}
	if(typeof Geocoder != "undefined" && document.getElementById(arr)!=null){
		var find = getGeoAddress(jingdu, weidu);
		if (find != null) {
			if (name != "") {
				_str = "&nbsp;<span class='b'>" + name + ":</span>&nbsp;";
			} else {
				_str = "&nbsp;";
			}
			_str += find.address;
			document.getElementById(arr).innerHTML=_str;
			return;
		}
		
		var point = new BMap.Point(jingdu, weidu);
		Geocoder.getLocation(point, function(results){
//		geocoder.geocode({"address":weidu+","+jingdu}, function(results,status) {
			if (name != "") {
				_str = "&nbsp;<span class='b'>" + name + ":</span>&nbsp;";
			} else {
				_str = "&nbsp;";
			}
			
			//if (status == google.maps.GeocoderStatus.OK) {
			if (results != null) {
				_str += results.address;
				var city = "";
				if (results.addressComponents != null) {
					city = results.addressComponents.city;
				}
				saveGeoAddress(jingdu, weidu, results.address, city);
				//_str += results[0].formatted_address;
			}else{
				//_str += "Geocode was not successful for the following reason: " + status;
			}
			document.getElementById(arr).innerHTML=_str;
		});
	}
}

function myParseAddressEx(key, jingdu, weidu, callback){
	if(typeof Geocoder != "undefined"){
		var point = new BMap.Point(jingdu, weidu);
		Geocoder.getLocation(point, function(results){
			var address = "";
			var city = "";
			if (results != null) {
				address = results.address;
				var city = "";
				if (results.addressComponents != null) {
					city = results.addressComponents.city;
				}
				saveGeoAddress(jingdu, weidu, address, city);
			}
			try{
				callback(key, jingdu, weidu, address, city);
			}catch(e) {}
		});
	}
}

//调用googleAPI进行地址解析
function myParseAddress(jingdu,weidu,userdata){
	//var ajaxUrl = "http://api.map.baidu.com/geocoder/v2/?ak=A5XwmfizKyOvbYyvmxDLTZYi&callback=renderReverse&location=39.983424,116.322987&output=json&pois=0";
	var ajaxUrl = "http://api.map.baidu.com/geocoder/v2/?ak=A5XwmfizKyOvbYyvmxDLTZYi&output=json&pois=0&location=" + weidu + "," + jingdu + "&callback=?";
	$.jsonp({
    		url: ajaxUrl,
    		success: function (data) {
    			var address = "";
			var ret = false;
			var error = 0;
			if (data.status == 0) {
				address = data.result.formatted_address;
				ret = true;
			}
			try {
				if (isChrome) {
					app.sendMessage('OnParseAddress', [ret, address, userdata.toString(), error]);
				} else {
					window.external.OnParseAddress(ret, address, userdata.toString(), error);
				}
			} catch(err) { }
    		},
	    	error: function (xOptions, textStatus) {
        		try {
        			if (isChrome) {
					app.sendMessage('OnParseAddress', [false, "", userdata.toString(), 0]);
				} else {
					window.external.OnParseAddress(false, "", userdata.toString(), 0);
				}
			} catch(err) { }
    		}
	});
	/*
	$.ajax({ type: "GET",
		url: ajaxUrl,
		dataType: "jsonp", 
		success: function(data){
			return;
			var address = "";
			var ret = false;
			var error = 0;
			if (data.status == 0) {
				address = data.result.formatted_address;
			}
			try {
				//window.external.OnParseAddress(ret, address, userdata.toString(), error);
			} catch(err) { }
   		},
   		error: function (XMLHttpRequest, textStatus, errorThrown) { 
   			return;
   			try {
				//window.external.OnParseAddress(false, "", userdata.toString(), 0);
			} catch(err) { }
		},
		complete: function (xhr, textStatus) { 
			if (typeof(xhr) !== 'undefined') {
				if (typeof(xhr.onreadystatechange) !== 'unknown' ) {
					xhr.onreadystatechange = null;
				} 
				if (typeof(xhr.abort) !== 'unknown' ) {
					xhr.abort = null;
				}
				xhr = null;
			}
		}
   	});*/
   	
   	/*
	var geocoder = new BMap.Geocoder();
	var point = new BMap.Point(jingdu, weidu);
	geocoder.getLocation(point, function(results){
		var address = "";
		var ret = false;
		var error = 0;
		if (results != null) {
			address = results.address;
			ret = true;
		}
		
		try {
			window.external.OnParseAddress(ret, address, userdata.toString(), error);
		} catch(err) { }

		jingdu = null;
		weidu = null;
		userdata = null;
		point = null;
	});*/
}

//JavaScript Document
var mousePos = {x:0,y:0};

//根据经纬度的距离获取地图的缩放级
function getRoom(diff){
	var room =    new Array(0,  1,  2, 3, 4, 5, 6,7,8,  9,   10,  11,  12,  13, 14);
	var diffArr = new Array(360,180,90,45,22,11,5,2.5,1.25,0.6,0.3,0.15,0.07,0.03,0);
	for(var i = 0; i < diffArr.length; i ++){
		if((diff - diffArr[i]) >= 0){
			return room[i];
		}
	}	
	return 14;
}
//更新鼠标位置
function mouseCoords(ev){ 
	ev= ev || window.event; 
	if(ev.pageX || ev.pageY){ 
		mousePos = {x:ev.pageX+10, y:ev.pageY+10}; 
	} 
	mousePos = { 
		x:ev.clientX + document.documentElement.scrollLeft - document.body.clientLeft+10,
		y:ev.clientY + document.documentElement.scrollTop   - document.body.clientTop+10
	}; 
	//document.title = mousePos.x+","+mousePos.y;
}

function getCenterPoint(maxJ,minJ,maxW,minW){//通过经纬度获取中心位置和缩放级别
	if(maxJ==minJ&&maxW==minW)return [maxJ,maxW,0];
	var diff = maxJ - minJ;
	if(diff < (maxW - minW))diff = maxW - minW;
	diff = parseInt(10000 * diff)/10000;	
	var centerJ = minJ*1000000+1000000*(maxJ - minJ)/2;
	var centerW = minW*1000000+1000000*(maxW - minW)/2;
	return [centerJ/1000000,centerW/1000000,diff];
}

function distance(lat1,lon1,lat2,lon2,len) {//获取地图上俩个点之间的距离
	var R = 6371; // km (change this constant to get miles)
	var dLat = (lat2-lat1) * Math.PI / 180;
	var dLon = (lon2-lon1) * Math.PI / 180; 
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) * 
		Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	return d+len;
}