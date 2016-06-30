// JavaScript Document
function mapframe(){
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
	//画多边形
	this.markerPolygon = null;	//地图上的多边形对象
	this.markerPolyPoint = new Array();	//多边形的点
	this.markerPolygonListenerAdd = null;	//添加事件
	this.markerPolygonListenerMove = null;	//移动事件
	this.markerPolygonListenerFinish = null;//结束事件
	this.markerPolygonListenerMapFinish = null; //结束事件
	//画线
	this.markerLine = null;
	this.markerLinePoint = new Array();	//多边形的点
	this.markerLineListenerAdd = null;	//添加事件
	this.markerLineListenerMove = null;	//移动事件
	this.markerLineListenerFinish = null;	//结束事件
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
	if(wndWidth < 300) { wndWidth=300;}
	if(wndHeight < 300){wndHeight=300;}
	
	var _mapcanvas= document.getElementById("mapcanvas");
	_mapcanvas.style.zIndex = "9";
	_mapcanvas.style.position = "absolute";		
	_mapcanvas.style.left = "0px";
	_mapcanvas.style.top = "26px";		
	_mapcanvas.style.width = wndWidth+"px";
	_mapcanvas.style.height = (wndHeight-26)+"px";
}

mapframe.prototype.loadMap = function(){//创建地图	
	var jindu = null;
	var weidu = null;
	var zoom = 8;
	var initZoom = "";
	var initJingDu = "";
	var initWeiDu = "";
	if (initZoom != "") {
		zoom = parseInt(initZoom);
	}

	if (initJingDu != "" && initWeiDu != "") {
		jindu = parseFloat(initJingDu);
		weidu = parseFloat(initWeiDu);
	} else {
		jindu = 0.0;
		weidu = 0.0;
		zoom = 1;
/*		try
		{
			jindu = geoip_longitude();
			weidu = geoip_latitude();
			if(jindu != null && jindu != ""
		 		&& weidu != null && weidu != "")
			{
				zoom = 8;
			}
			else
			{
				weidu = 22.573978188551297;
				jindu = 113.92078757286072; 
			}
		}
		catch(err) 
		{
			weidu = 22.573978188551297;
			jindu = 113.92078757286072; 
		}*/
	}
	
	//地图初始化
	GFRAME.map = google.maps.initMap("mapcanvas", jindu, weidu, zoom);
	document.onmousemove = mouseCoords;
	setTimeout(function(){
		google.maps.event.addListener(GFRAME.map,"click", GFRAME.mapMouseClick);
			google.maps.event.addListener(GFRAME.map, "mousemove", GFRAME.mapMouseMove);
			google.maps.event.addListener(GFRAME.map, "mousedown", GFRAME.mapMouseDown);
			google.maps.event.addListener(GFRAME.map, "mouseup", GFRAME.mapMouseUp);
		},1500);
	GFRAME.initDrawManage();
	//初始化点聚合对象
	if(typeof MarkerClusterer != "undefined" && GFRAME.useMarkerClusterer) {
		GFRAME.markerClusterer = new MarkerClusterer(GFRAME.map, {});
	}
};

mapframe.prototype.initDrawManage = function(){
	var styleOptions = {
			fillColor: '#ff0000',  
			fillOpacity: 0.4,  
			strokeColor: '#ff0000',
			strokeWeight: 2,  
			strokeOpacity: 0.8,
			clickable: false,  
			//zIndex: 1,  
			//editable: true  
	    };
	
	this.drawingManager = new google.maps.drawing.DrawingManager({  
		drawingMode: null,  
		drawingControl: false, 
		markerOptions: {  
			icon: new google.maps.MarkerImage(this.imagePath + "marker\1.gif")  
		},  
		circleOptions: styleOptions,
		polygonOptions: styleOptions,
		polylineOptions: styleOptions,
		rectangleOptions: styleOptions,
	});  
	this.drawingManager.setMap(this.map);   
	
	google.maps.event.addListener(this.drawingManager, "overlaycomplete", function (m) {
        var radius = 0; // only valid for circle
        switch (m.type) {
            case google.maps.drawing.OverlayType.POLYLINE: //100
            	drawLineEnd(m.overlay);
                break;
            case google.maps.drawing.OverlayType.RECTANGLE: //101
            	drawRectangleEnd(m.overlay);
                break;
            case google.maps.drawing.OverlayType.CIRCLE: //102
            	drawCircleEnd(m.overlay);
                break;
            case google.maps.drawing.OverlayType.MARKER: //103
                drawMarkerEnd(m.overlay);
                break;
            case google.maps.drawing.OverlayType.POLYGON: //104
            	drawPolygonEnd(m.overlay);
                break;
            default:
                return;
                break;
        }
        //callback(typeCode, radius, strPoints, length.toFixed(3), overlay);
    });
};

function getLatLngStringEx(latlngList) {
	var lat = new Array();
	var lng = new Array();
	for (var i = 0; i < latlngList.length; i += 1) {
		lat.push(latlngList.getAt(i).lat().toFixed(6));
		lng.push(latlngList.getAt(i).lng().toFixed(6));
	}
	return {lat:lat.toString(),lng:lng.toString()};					
}

mapframe.prototype.hiddenRightMenu= function(){//隐藏右键的所有菜单
};

mapframe.prototype.updateDefaultZoom = function(){
	if(this.vehicleList.size()>0){
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
			GFRAME.map.setCenter(new google.maps.LatLng(_m[1], _m[0]));//设置中心位置和缩放级别
			GFRAME.map.setZoom(getRoom(_m[2]));//通过距离获取缩放级别并设置级别
		}else{
			GFRAME.map.setCenter(new google.maps.LatLng(geoip_latitude(), geoip_longitude()));//设置中心位置和缩放级别
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
				}
				else
				{
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
		html.push('<span class="b">'+vehicle.getName()+'&nbsp;&nbsp;</span><br/>');
	}
	html.push(vehicle.getStatusStr());
	var menuNum = vehicle.menuitem.length;
	if (menuNum > 0){
		for (var i = 0; i < menuNum; ++ i){
			var menuitem = vehicle.menuitem[i];
			if (menuitem.getPopMenu()){
				html.push('<a class="'+menuitem.getCls()+'" title="'+ menuitem.getName() +'"  href="javascript:void(0)" onclick="showmore(\'menu_more\',\''+vehicle.getIdno()+'\',\''+menuitem.getIndex()+'\')" onMouseOut="hidemore(\'menu_more\',500)" style="margin: 5px 5px 0px 10px;"></a>');
				html.push('&nbsp;&nbsp;');
			}else{
				html.push('<a class="'+menuitem.getCls()+'" title="'+ menuitem.getName() +'"  href="javascript:void(0)" onclick="clickmenuitem(\'' + vehicle.getIdno() + '\',\'' + menuitem.getIndex() + '\',0)" style="margin: 5px 5px 0px 10px;"></a>&nbsp;&nbsp;');
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
	html.push('<span class="b">'+ marker.getName() +'</span><br/>');
	html.push(marker.status);
	html.push('</div>');
	return html.join("");
};

function getTrackPlayText(name, speed, huangxiang, time){
	var html=[];
	html.push('<div class="mapTip">');
	html.push('<span class="b">'+name+'</span><br/>');
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
		lat.push(latlngList[i].lat().toFixed(6));
		lng.push(latlngList[i].lng().toFixed(6));
	}
	return {lat:lat.toString(),lng:lng.toString()};					
}

// Poygon getBounds extension - google-maps-extensions
// http://code.google.com/p/google-maps-extensions/source/browse/google.maps.Polygon.getBounds.js
if (!google.maps.Polygon.prototype.getBounds) {
  google.maps.Polygon.prototype.getBounds = function(latLng) {
    var bounds = new google.maps.LatLngBounds();
    var paths = this.getPaths();
    var path;
    
    for (var p = 0; p < paths.getLength(); p++) {
      path = paths.getAt(p);
      for (var i = 0; i < path.getLength(); i++) {
        bounds.extend(path.getAt(i));
      }
    }

    return bounds;
  }
}

// Polygon containsLatLng - method to determine if a latLng is within a polygon
google.maps.Polygon.prototype.containsLatLng = function(latLng) {
  // Exclude points outside of bounds as there is no way they are in the poly
  var bounds = this.getBounds();

  if(bounds != null && !bounds.contains(latLng)) {
    return false;
  }

  // Raycast point in polygon method
  var inPoly = false;

  var numPaths = this.getPaths().getLength();
  for(var p = 0; p < numPaths; p++) {
    var path = this.getPaths().getAt(p);
    var numPoints = path.getLength();
    var j = numPoints-1;

    for(var i=0; i < numPoints; i++) { 
      var vertex1 = path.getAt(i);
      var vertex2 = path.getAt(j);

      if (vertex1.lng() < latLng.lng() && vertex2.lng() >= latLng.lng() || vertex2.lng() < latLng.lng() && vertex1.lng() >= latLng.lng())  {
        if (vertex1.lat() + (latLng.lng() - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < latLng.lat()) {
          inPoly = !inPoly;
        }
      }

      j = i;
    }
  }

  return inPoly;
}

//移动时显示车辆信息
mapframe.prototype.mapMouseMove = function(event){
	if (!GFRAME.isMarkerEdit()) {
		var date = new Date();
		GFRAME.mouseMoveTime = date.getTime();
		var latlng = event.latLng;
		var markpoint = overlay.getProjection().fromLatLngToDivPixel(latlng);
		var strHtml = "",num = 0;//个数
		if (GFRAME.vehicleList.size() <= 100) {
			GFRAME.vehicleList.each(function makeShow(vehiId, vehicle) {
				try	{
					if( num <= 10 ) {
						if (vehicle.show && vehicle.movetip) {
							var point = overlay.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(vehicle.getWeidu(),vehicle.getJindu()));
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
		if (GFRAME.addMarkerType == 1) {
			$("#tip").text(lang.tipAddPoint);
		} else if (GFRAME.isMarkerRectangle()) {
			if (GFRAME.isDrawMarker) {
				if (GFRAME.markerRectangle == null) {
					var rectOptions = {
					strokeColor: "#FF0000",
					strokeOpacity: "0.8",
					strokeWeight: 1,
					fillColor: "#FF0000",
					fillOpacity: "0.35",
					map: GFRAME.map,
					clickable:false
					};
					GFRAME.markerRectangle = new google.maps.Rectangle(rectOptions);
				}
				GFRAME.markerRectBounds = GFRAME.getLatLngBounds(GFRAME.markerRectStart, event.latLng);
				//更新矩形区域的位置
				GFRAME.markerRectangle.setBounds(GFRAME.markerRectBounds);
			}
			$('#tip').html(GFRAME.getRectangleTip());
		} else if (GFRAME.isMarkerPolygon()) {
			if (GFRAME.isMarkerPolygon()) {
				GFRAME.mapAddPolyMove(event);
			}
			$('#tip').html(lang.tipAddPolygon);
		} else if (GFRAME.isMarkerLine()) {
			if (GFRAME.isMarkerLine()) {
				GFRAME.mapAddLineMove(event);
			}
			$('#tip').html(lang.tipAddLine);
		}
		if (GFRAME.showMarkerTip) {
			$("#tip").show();
			$("#tip").attr("left", (mousePos.x + 20)+"px");
			$("#tip").attr("top", (mousePos.y - 40)+"px");
		}
	}
	
	var ret = {};
	ret.pageY = mousePos.y;
	if (typeof doMapDocumentMouseMove != "undefined") {
		doMapDocumentMouseMove(ret);
	}
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
		var latlng = event.latLng;
		var point = overlay.getProjection().fromLatLngToDivPixel(latlng);
		var vehicle = null;
		GFRAME.vehicleList.each(function findMinDistance(vehiId, vehicle) {
			try	{
				var markpoint = overlay.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(vehicle.getWeidu(), vehicle.getJindu()));
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
	
		//判断点
		var mapmarker = null;
		for(var i = 0;i<GFRAME.markerList.length;i++){
			mapmarker = GFRAME.markerList[i];
			if (mapmarker.typeId == 1 || mapmarker.typeId == 10) {
				var markpoint = overlay.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(mapmarker.getWeidu(), mapmarker.getJindu()));
				if(point.x<(markpoint.x+25)&&point.x>(markpoint.x-25)&&point.y<(markpoint.y + 15)&&point.y>(markpoint.y-15)){			
					popupMapmarker(mapmarker, mapmarker.position);					
					return;//如果有多个目标经纬度是一样的，只显示第一个匹配的点
				}
			} else if (mapmarker.typeId == 2) {
				if (mapmarker.bound.contains(event.latLng)) {
					popupMapmarker(mapmarker, event.latLng);
					return ;
				}
			} else if (mapmarker.typeId == 3) {
				if (mapmarker.shape.containsLatLng(event.latLng)) {
					popupMapmarker(mapmarker, event.latLng);
					return;
				}
			}
		}
		
		//如果不是点击相应的点信息，则将弹出提示关闭
		GFRAME.closeMaxPop();
	} else {
		if (GFRAME.isMarkerEdit()) {
			if (GFRAME.isMarkerPoint()) {
				//添加自定义点
				var latlng = event.latLng;
				GFRAME.markerPoint = new NameMarker({position:latlng, map:GFRAME.map, text:name, icon:getMarkerTabImage(1)});
//				GFRAME.markerPoint = new google.maps.Marker({  
//				    position: latlng,   
//				    icon: GFRAME.imagePath + "marker/1.gif",
//				    map: GFRAME.map  
//				});
				GFRAME.hideDrawTip();
				try {
					doMapDrawMarker(1, latlng.lng().toFixed(6).toString(), latlng.lat().toFixed(6).toString(), "");
				} catch(err) {
				}
				GFRAME.resetMarker();
			} else if (GFRAME.isMarkerPolygon()) {
				GFRAME.initMarkerPolygon();
				GFRAME.mapAddPolygon(event);
			} else if (GFRAME.isMarkerLine()) {
				GFRAME.initMarkerLine();
				GFRAME.mapAddLine(event);
			}
		}
	}
};

//左键响应点击按下操作
mapframe.prototype.mapMouseDown = function(event){
	if (GFRAME.isMarkerEdit()) {
		if (GFRAME.isMarkerRectangle()) {
			//画矩形
			GFRAME.markerRectStart = event.latLng;
			GFRAME.isDrawMarker = true;
			GFRAME.map.setOptions({
				draggable:false //禁止拖动地图
			}); 
		}
	}
};

//左键响应点击松开操作
mapframe.prototype.mapMouseUp = function(event){
	if (GFRAME.isMarkerEdit()) {
		if (GFRAME.isMarkerRectangle()) {
			//添加矩形，鼠标按下开始，弹起结束
			if (GFRAME.isDrawMarker) {
				if (GFRAME.markerRectBounds != null) {
					try {
						var latlngList = new Array();
						latlngList.push(GFRAME.markerRectBounds.getSouthWest());
						latlngList.push(GFRAME.markerRectBounds.getNorthEast());
						var temp = getLatLngString(latlngList);
						GFRAME.hideDrawTip();
						
						doMapDrawMarker(GFRAME.addMarkerType, temp.lng, temp.lat, "FF0000");
					} catch(err) {
					}
				}
				GFRAME.resetMarker();
			}
		} 
	}
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

mapframe.prototype.isMarkerLine = function() {
	return this.addMarkerType == 9 ? true : false;
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
		     strokeWeight: 1       // 宽度 5像素
		};
		this.markerPolygon = new google.maps.Polygon(polyOptions);
		this.markerPolygon.setMap(GFRAME.map);
		this.map.setOptions({
			disableDoubleClickZoom:true //双击放大
		}); 
		//必须给polyline
		this.markerPolygonListenerAdd = google.maps.event.addListener(this.markerPolygon, 'click', this.mapAddPolygon);
		this.markerPolygonListenerMove = google.maps.event.addListener(this.markerPolygon, 'mousemove', this.mapAddPolyMove); 
		this.markerPolygonListenerFinish = google.maps.event.addListener(this.markerPolygon, 'dblclick', this.mapAddPolyFinish); 
		this.markerPolygonListenerMapFinish = google.maps.event.addListener(GFRAME.map, 'dblclick', this.mapAddPolyFinish); 
	}
};

mapframe.prototype.mapAddPolygon = function(event) {
	if (GFRAME.showMarkerTip) {
		GFRAME.isDrawMarker = true;
		if (GFRAME.markerPolyPoint.length >= 64) {
			//如果车辆数目超过10个，则强制结束
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

mapframe.prototype.initMarkerLine = function() {
	if (this.markerLine == null) {
		this.markerLine = new google.maps.Polyline({strokeColor:"#FF0000",strokeOpacity:0.8,strokeWeight:1});
		this.markerLine.setMap(GFRAME.map);
		this.map.setOptions({
			disableDoubleClickZoom:true //双击放大
		}); 
		//必须给polyline
		this.markerLineListenerAdd = google.maps.event.addListener(this.markerLine, 'click', this.mapAddLine);
		this.markerLineListenerMove = google.maps.event.addListener(this.markerLine, 'mousemove', this.mapAddLineMove); 
		this.markerLineListenerFinish = google.maps.event.addListener(GFRAME.map, 'dblclick', this.mapAddLineFinish); 
	}
};

mapframe.prototype.mapAddLine = function(event) {
	if (GFRAME.showMarkerTip) {
		GFRAME.isDrawMarker = true;
		if (GFRAME.markerLinePoint.length >= 64) {
			//如果车辆数目超过10个，则强制结束
			GFRAME.mapAddLineFinish(event);
		} else {
			//添加多边形
			GFRAME.markerLinePoint.push(event.latLng);
			//显示到地图上
			GFRAME.markerLine.setPath(GFRAME.markerLinePoint);
		}
	}
};

mapframe.prototype.mapAddLineMove = function(event) {
	if (GFRAME.showMarkerTip) {
		if (GFRAME.markerLine != null) {
			var point = new Array();
			for (var i = 0; i < GFRAME.markerLinePoint.length; i += 1) {
				point.push(GFRAME.markerLinePoint[i]);
			}
			point.push(event.latLng);
			GFRAME.markerLine.setPath(point);
		}
	}
};

mapframe.prototype.mapAddLineFinish = function(event) {
	if (GFRAME.markerLinePoint.length > 2) {
		var temp = getLatLngString(GFRAME.markerLinePoint);
		GFRAME.hideDrawTip();
		try {
			doMapDrawMarker(9, temp.lng, temp.lat, "FF0000");
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
		GFRAME.map.setOptions({
			draggable:true //允许拖动地图
		});
		GFRAME.map.setOptions({
			disableDoubleClickZoom:false //双击放大
		}); 
		//自定义点
		if (GFRAME.markerPoint != null) {
			GFRAME.markerPoint.setMap(null);
			GFRAME.markerPoint = null;
		}
		//矩形
		if (GFRAME.markerRectangle != null) {
			GFRAME.markerRectangle.setMap(null);
			GFRAME.markerRectangle = null;
		}
		GFRAME.markerRectStart = null;
		GFRAME.markerRectBounds = null;	//矩形区域范围
		//多边形
		if (GFRAME.markerPolygon != null) {
			GFRAME.markerPolygon.setMap(null);
			GFRAME.markerPolygon = null;
		}
		var polyLength = GFRAME.markerPolyPoint.length;
		for (var i = 0; i < polyLength; i += 1){
			if (GFRAME.markerPolyPoint.length > 0) {
				GFRAME.markerPolyPoint.pop();
			} else {
				break;
			}
		}
		if (GFRAME.markerPolygonListenerAdd != null) {
			google.maps.event.removeListener(GFRAME.markerPolygonListenerAdd);
			GFRAME.markerPolygonListenerAdd = null;
		}
		if (GFRAME.markerPolygonListenerMove != null) {
			google.maps.event.removeListener(GFRAME.markerPolygonListenerMove);
			GFRAME.markerPolygonListenerMove = null;
		}
		if (GFRAME.markerPolygonListenerFinish != null) {
			google.maps.event.removeListener(GFRAME.markerPolygonListenerFinish);
			GFRAME.markerPolygonListenerFinish = null;
		}
		if (GFRAME.markerPolygonListenerMapFinish != null) {
			google.maps.event.removeListener(GFRAME.markerPolygonListenerMapFinish);
			GFRAME.markerPolygonListenerMapFinish = null;
		}
		//线
		if (GFRAME.markerLine != null) {
			GFRAME.markerLine.setMap(null);
			GFRAME.markerLine = null;
		}
		var lineLength = GFRAME.markerLinePoint.length;
		for (var i = 0; i < lineLength; i += 1){
			if (GFRAME.markerLinePoint.length > 0) {
				GFRAME.markerLinePoint.pop();
			} else {
				break;
			}
		}
		if (GFRAME.markerLineListenerAdd != null) {
			google.maps.event.removeListener(GFRAME.markerLineListenerAdd);
			GFRAME.markerLineListenerAdd = null;
		}
		if (GFRAME.markerLineListenerMove != null) {
			google.maps.event.removeListener(GFRAME.markerLineListenerMove);
			GFRAME.markerLineListenerMove = null;
		}
		if (GFRAME.markerLineListenerFinish != null) {
			google.maps.event.removeListener(GFRAME.markerLineListenerFinish);
			GFRAME.markerLineListenerFinish = null;
		}
		if (GFRAME.drawingManager != null) {
			GFRAME.drawingManager.setDrawingMode(null);
		}
		$("#drawPoint").removeClass("icon_diy_focus");
		$("#drawCircle").removeClass("icon_circle_focus");
		$("#drawRectangle").removeClass("icon_squer_focus");
		$("#drawPolygon").removeClass("icon_polygon_focus");
		$("#drawLine").removeClass("icon_curve_focus");
		
		//$("#addPoint").attr("src",GFRAME.imagePath + "./image/addpoint.gif");
		//$("#addRectangle").attr("src",GFRAME.imagePath + "./image/addrectangle.gif");
		//$("#addPolygon").attr("src",GFRAME.imagePath + "./image/addpolygon.gif");
		//$("#addLine").attr("src",GFRAME.imagePath + "./image/addline.gif");
		//$("#btnSearch").attr("src",GFRAME.imagePath + "/image/search.gif");
		$("#tip").hide();
	}
};

mapframe.prototype.resetMarker = function() {
	setTimeout(function () {
		GFRAME.resetDrawMarker();
	}, 100);
};

mapframe.prototype.hideDrawTip = function() {
	$("#tip").hide();
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


//JavaScript Document
google.maps.initMap = function(id, jindu, weidu, zoom){
	
	this.MAP_CENTER_LAT = weidu;
	this.MAP_CENTER_LNG = jindu;
	
	this.MAX_ZOOM = zoom;
	this.container = id;
	var myLatlng = new google.maps.LatLng(this.MAP_CENTER_LAT,this.MAP_CENTER_LNG);
	var myOptions = {zoom:this.MAX_ZOOM,scaleControl:true,panControl: true,center:myLatlng,mapTypeId:google.maps.MapTypeId.ROADMAP,mapTypeControlOptions:{mapTypeIds:[google.maps.MapTypeId.ROADMAP,google.maps.MapTypeId.SATELLITE,'OSM']}};
	var map = new google.maps.Map(document.getElementById(this.container),myOptions);
	map.mapTypes.set("OSM", new google.maps.ImageMapType({
     getTileUrl: function(coord, zoom) {
         return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
     },
     tileSize: new google.maps.Size(256, 256),
     name: "OSM",
     maxZoom: 18
 }));
	
	overlay = new google.maps.OverlayView();
	overlay.draw = function() {};
	overlay.setMap(map);
	return map;
};

//单击设置marker在地图中心，缩放级别放
function dblclickSetRoomCenter(weidu,jingdu,map){
	var _zoom = map.getZoom();
	if(_zoom<11){
		map.setCenter(new google.maps.LatLng(Number(weidu), Number(jingdu)));
		map.setZoom(11);
	}else if(_zoom>=11&&_zoom<=18){
		map.setCenter(new google.maps.LatLng(Number(weidu), Number(jingdu)));
		map.setZoom(_zoom+2);
	}
};

function getAddressCity(address_components) {
	var city = "";
	for (var i = 0; i < address_components.length; ++ i) {
		if (address_components[i].types[0] == "locality" && address_components[i].types[1] == "political") {
			city = address_components[i].long_name;
			break;
		}
	}
	return city;
}

var geocoder = new google.maps.Geocoder();
//调用googleAPI进行地址解析
function parseAddress (weidu,jingdu,arr,name){
	if (!initParseAddress) {
		return ;
	}
	if(document.getElementById(arr)!=null){
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
		
		geocoder.geocode({"address":weidu+","+jingdu}, function(results,status) {
			if (name != "") {
				_str = "&nbsp;<span class='b'>" + name + ":</span>&nbsp;";
			} else {
				_str = "&nbsp;";
			}
			if (status == google.maps.GeocoderStatus.OK) {
				_str += results[0].formatted_address;
				var city = getAddressCity(results[0].address_components);
				saveGeoAddress(jingdu, weidu, results[0].formatted_address, city);
			}else{
				//_str += "Geocode was not successful for the following reason: " + status;
			}
			document.getElementById(arr).innerHTML=_str;
		});
	}
}

function myParseAddressEx(key, jingdu, weidu, callback){
	if(typeof geocoder != "undefined"){
		geocoder.geocode({"address":weidu+","+jingdu}, function(results,status) {
			var address = "";
			var city = "";
			var ret = false;
			var error = 0;
			if (status == google.maps.GeocoderStatus.OK) {
				address = results[0].formatted_address;
				ret = true;
				city = getAddressCity(results[0].address_components);
				saveGeoAddress(jingdu, weidu, address, city);
			}else{	
			}
			try {
				callback(key, jingdu, weidu, address, city);
			}catch(e) {}
		});
	}
}

//调用googleAPI进行地址解析
function parseAddressEx (weidu,jingdu,callback){
	geocoder.geocode({"address":weidu+","+jingdu}, callback);
}

//调用googleAPI进行地址解析
function myParseAddress(jingdu,weidu,userdata){
	geocoder.geocode({"address":weidu+","+jingdu}, function(results,status) {
		var address = "";
		var ret = false;
		var error = 0;
		if (status == google.maps.GeocoderStatus.OK) {
			address = results[0].formatted_address;
			ret = true;
		}else{
			if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
				error = 1;
			} else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
				error = 2;
			} else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
				error = 3;
			} else {
				error = 4;
			}
			//ZERO_RESULTS		用于表示地理编码成功，但未返回任何结果。如果地理编码过程中传递的偏远位置 address 或 latlng 并不存在，就会出现这种情况
			//OVER_QUERY_LIMIT	用于表示您超出了自己的配额
			//REQUEST_DENIED	用于表示您的请求遭拒，这通常是由于缺少 sensor 参数
			//INVALID_REQUEST	通常用于表示缺少查询内容（address 或 latlng）
			//_str += "Geocode was not successful for the following reason: " + status;
		}
		if (isChrome) {
			app.sendMessage('OnParseAddress', [ret, address, userdata.toString(), error]);
		} else {
			window.external.OnParseAddress(ret, address, userdata.toString(), error);
		}
	});
}