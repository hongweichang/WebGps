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
	this.MARKER_MAX_JING = -1000;
	this.MARKER_MAX_WEI = -1000;
	this.MARKER_MIN_JING = 1000;
	this.MARKER_MIN_WEI = 1000;
	this.zIndex = 2;
	this.MAINLY_ADDRESS = false;//是否为大概地址
	this.defaultZoom = true;//当地图上没有设备,就设置为默认级别
	this.imagePath = "../image/";
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
		wndWidth=500;
		wndHeight=400;
	if(wndWidth < 300) { wndWidth=300;}
	if(wndHeight < 300){wndHeight=300;}
	
	var _mapcanvas= document.getElementById("mapcanvas");
	_mapcanvas.style.zIndex = "9";
	_mapcanvas.style.position = "absolute";		
	_mapcanvas.style.left = "0px";
	_mapcanvas.style.top = "21px";		
	_mapcanvas.style.width = wndWidth+"px";
	_mapcanvas.style.height = (wndHeight-26)+"px";
}

mapframe.prototype.loadMap = function(){//创建地图
	//显示提示信息窗口	
	
	var jindu = null;
	var weidu = null;
	var zoom = 4;
//	if (initZoom != "") {
//		zoom = parseInt(initZoom);
//		if (zoom == 0) {
//			zoom = 4;
//		}
//	}

	if (initJingDu != null && initWeiDu != null && initJingDu != "" && initWeiDu != "") {
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
	//GFRAME.map.addEventListener("tilesloaded",GFRAME.mapLoaded);
	//地图初始化
	document.onmousemove = mouseCoords;
	setTimeout(function(){
			GFRAME.map.addEventListener("click", GFRAME.mapMouseClick);
			GFRAME.map.addEventListener("mousemove", GFRAME.mapMouseMove);
			
	},100);
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
	} else {
		return "/alarm/";
	}
};

mapframe.prototype.getVehicleImage = function(huangxiang, status, icon){//获取车辆图标信息
	
	var imgIndex = (Number(huangxiang) & 0x7);
	var statustype = Number(status);
	var image = null;
	if (statustype < 4) {
		image = GFRAME.imagePath + icon + this.getStatusName(status) + (imgIndex + 1) + ".gif";
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
	if (isChrome) {
		app.sendMessage('OnClickMenu', [vehiIdno, menuId, popId]);
	} else {
		window.external.OnClickMenu( vehiIdno, menuId, popId);
	}
//	var msg = "clickmenuitem!";
//	msg += "vehiId=" + vehiId;
//	msg += ",menuId=" + menuId;
//	msg += ",popId=" + popId;
//	alert(msg);
	var date = new Date();
	GFRAME.lastClickTime = date.getTime();
};

function showmore(id, vehiIdno, menuId){//rec
	if(_s!="-1")clearInterval(_s);
	var vehicle = findVehicle(vehiIdno);
	if (vehicle != null)
	{
		var menuitem = vehicle.getMenuitem(Number(menuId));
		
		var _htmStr = "";
		_htmStr += "<ul>";
		
		for (var i = 0; i < menuitem.submenu.length; ++ i)
		{
			var submenuitem = menuitem.submenu[i];
			_htmStr += "<li><a href='javascript:void(0);' onclick='";
			_htmStr += "clickmenuitem(";
			_htmStr += vehiIdno;
			_htmStr += ",";
			_htmStr += menuId;
			_htmStr += ",";
			_htmStr += submenuitem.getIndex();
			_htmStr += ")'>";
			_htmStr += submenuitem.getName();
			_htmStr += "</a></li>";
		}
		_htmStr += "</ul>";
		
		var _obj = document.getElementById(id);
		_obj.style.left = (mousePos.x-25)+"px";
		_obj.style.top = (mousePos.y-10)+"px";
		_obj.style.display = "block";
		_obj.innerHTML = _htmStr;
	}
	
	var date = new Date();
	GFRAME.lastClickTime = date.getTime();
};

function getTxtByVehicle(vehicle){
	var html=[];
	html.push('<a style="position:absolute;top:1px;right:1px" href="javascript:;" onclick="GFRAME.closeMaxPop();"><img height="10" src="' + GFRAME.imagePath + 'iw_close.gif"/></a>');
	html.push('<font>');
	if (vehicle.getName() != "") {
		html.push('<span class="b">'+vehicle.getName()+'&nbsp;&nbsp;&nbsp;&nbsp;</span><br/>');
	}
	html.push(vehicle.getStatusStr());
	var menuNum = vehicle.menuitem.length;
	if (menuNum > 0){
		for (var i = 0; i < menuNum; ++ i){
			var menuitem = vehicle.menuitem[i];
			if (menuitem.getPopMenu()){
				html.push('<a href="javascript:void(0)" onclick="showmore(\'menu_more\',\''+vehicle.getIdno()+'\',\''+menuitem.getIndex()+'\')" onMouseOut="hidemore(\'menu_more\',500)" style="width:50px;">'+ menuitem.getName() +'</a>');
				html.push('&nbsp;&nbsp;');
			}else{
				html.push('<a href="javascript:void(0)" onclick="clickmenuitem(' + vehicle.getIdno() + ',' + menuitem.getIndex() + ',0)">' + menuitem.getName() + '</a>&nbsp;&nbsp;');
			}
		}
		//html.push('<a href="javascript:void(0);" onclick="GFRAME.closeMaxPop();">' + lang.close + '</a>&nbsp;&nbsp;');
	} else {
		//html.push('<br/><a href="javascript:void(0);" onclick="GFRAME.closeMaxPop();">' + lang.close + '</a>&nbsp;&nbsp;');
	}
	
	html.push('</font>');
	return html.join("");
};

function getTxtByMarker(marker){
	var html=[];
	html.push('<a style="position:absolute;top:1px;right:0px" href="javascript:;" onclick="GFRAME.closeMaxPop();"><img height="10" src="' + GFRAME.imagePath + 'iw_close.gif"/></a>');
	html.push('<font>');
	html.push('<span class="b">'+ marker.getName() +'&nbsp;&nbsp;&nbsp;&nbsp;</span><br/>');
	html.push(marker.status);
	html.push('</font>');
	return html.join("");
};

function getTrackPlayText(name, speed, huangxiang, time){
	var html=[];
	html.push('<font>');
	html.push('<span class="b">'+name+'&nbsp;&nbsp;&nbsp;&nbsp;</span><br/>');
	html.push('<span class="b">'+lang.speed + ':</span>'+speed+'('+huangxiang+')<br/>');
	html.push('<span class="b">'+lang.time + ':</span>'+time+'<br/>');
	html.push('</font>');
	return html.join("");
};