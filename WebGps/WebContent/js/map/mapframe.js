// JavaScript Document
function mapframe(){
	this.map = null;
	this.isFirstLoadMap = true;
	this.vehicleList = new Array();	//车辆列表
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
	//****************** marker 最大最小 经纬度 ***************************8
	this.MARKER_MAX_JING = -1000
	this.MARKER_MAX_WEI = -1000
	this.MARKER_MIN_JING = 1000
	this.MARKER_MIN_WEI = 1000
	this.zIndex = 2;
	this.MAINLY_ADDRESS = false;//是否为大概地址
	this.defaultZoom = true;//当地图上没有设备,就设置为默认级别
	this.imagePath = "./image/";
	//轨迹回放的缩放级别
	this.trackZoomLevel = 12;
	//添加地图标识类型
	this.addMarkerType = 0;		//1表示添加标注，2表示添加矩形，3表示添加多边形，4表示测距，5表示区域查车
	this.isDrawMarker = false;	//是否正在画地图标识信息
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
	_mapcanvas.style.top = "27px";		
	_mapcanvas.style.width = wndWidth+"px";
	_mapcanvas.style.height = (wndHeight-27)+"px";
}

mapframe.prototype.loadMap = function(){//创建地图
	//显示提示信息窗口	
	var tipDIV = document.createElement('span');
	tipDIV.id = "tip";
	tipDIV.style.position = "absolute";
	tipDIV.style.background = "#FBFFD7";
	tipDIV.style.zIndex = 10;
	tipDIV.style.border = "solid 1px #999999";
	tipDIV.style.padding = "3px";
	tipDIV.style.display = "none";
	tipDIV.style.fontWeight = "bold";
	document.body.appendChild(tipDIV);
	
	/*
	var jindu = null;
	var weidu = null;
	var zoom = 8;
	try
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
	
	jindu = 0.0;
	weidu = 0.0;
	zoom = 1;
				
	//地图初始化
	GFRAME.map = mapobject.maps.initMap("mapcanvas", jindu, weidu, zoom);
	document.onmousemove = mouseCoords;
	mapobject.maps.event.addListener(GFRAME.map,"click", GFRAME.mapMouseClick);
	setTimeout(function(){
			mapobject.maps.event.addListener(GFRAME.map, "mousemove", GFRAME.mapMouseMove);
			mapobject.maps.event.addListener(GFRAME.map, "mousedown", GFRAME.mapMouseDown);
			mapobject.maps.event.addListener(GFRAME.map, "mouseup", GFRAME.mapMouseUp);
		},1500);
};

mapframe.prototype.hiddenRightMenu= function(){//隐藏右键的所有菜单
};

mapframe.prototype.updateDefaultZoom = function(){
	if(this.vehicleList.length>0){
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
	for(var i = 0; i < GFRAME.vehicleList.length; i ++)
	{		
		vehicle = GFRAME.vehicleList[i];
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
	}
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
	window.external.OnClickMenu( vehiIdno, menuId, popId);
//	var msg = "clickmenuitem!";
//	msg += "vehiId=" + vehiId;
//	msg += ",menuId=" + menuId;
//	msg += ",popId=" + popId;
//	alert(msg);
};

function showmore(id, vehiIdno, menuId){//rec
	if(_s!="-1")clearInterval(_s);
	
	var vehicle = findVehicle(Number(vehiIdno));
	if (vehicle != null)
	{
		var menuitem = vehicle.getMenuitem(Number(menuId));
		
		var _htmStr = "";
		_htmStr += "<ul>";
		
		for (var i = 0; i < menuitem.menuName.length; ++ i)
		{
			_htmStr += "<li><a href='javascript:void(0);' onclick='";
			_htmStr += "clickmenuitem(";
			_htmStr += vehiIdno;
			_htmStr += ",";
			_htmStr += menuId;
			_htmStr += ",";
			_htmStr += i;
			_htmStr += ")'>";
			_htmStr += menuitem.menuName[i];
			_htmStr += "</a></li>";
		}
		_htmStr += "</ul>";
		
		var _obj = document.getElementById(id);
		_obj.style.left = (mousePos.x-25)+"px";
		_obj.style.top = (mousePos.y-10)+"px";
		_obj.style.display = "block";
		_obj.innerHTML = _htmStr;
	}
};

function getTxtByVehicle(vehicle){
	var html=[];
	html.push('<a style="position:absolute;top:1px;right:1px" href="javascript:;" onclick="GFRAME.closeMaxPop();"><img height="10" src="' + GFRAME.imagePath + 'iw_close.gif"/></a>');
	html.push('<font>');
	if (vehicle.getName() != "") {
		html.push('<span class="b">'+vehicle.getName()+'&nbsp;&nbsp;</span><br/>');
	}
	html.push(vehicle.getStatusStr());
	var menuNum = vehicle.menuitem.length;
	if (menuNum > 0){
		for (var i = 0; i < menuNum; ++ i){
			var menuitem = vehicle.getMenuitem(i);
			if (menuitem.getPopMenu()){
				html.push('<a href="javascript:void(0)" onclick="showmore(\'menu_more\',\''+vehicle.getIdno()+'\',\''+i+'\')" onMouseOut="hidemore(\'menu_more\',500)" style="width:50px;">'+ menuitem.getName() +'</a>');
				html.push('&nbsp;&nbsp;');
			}else{
				html.push('<a href="javascript:void(0)" onclick="clickmenuitem(' + vehicle.getIdno() + ',' + i + ',0)">' + menuitem.getName() + '</a>&nbsp;&nbsp;');
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
	html.push('<a style="position:absolute;top:1px;right:0px" href="javascript:;" onclick="GFRAME.closeMaxPop();"><img height="10" src="../js/map/image/iw_close.gif"/></a>');
	html.push('<font>');
	html.push('<span class="b">'+ marker.getName() +'</span><br/>');
	html.push(marker.status);
	html.push('</font>');
	return html.join("");
};

function getTrackPlayText(name, speed, huangxiang, time){
	var html=[];
	html.push('<font>');
	html.push('<span class="b">'+name+'</span><br/>');
	html.push('<span class="b">'+lang.speed + ':</span>'+speed+'('+huangxiang+')<br/>');
	html.push('<span class="b">'+lang.time + ':</span>'+time+'<br/>');
	html.push('</font>');
	return html.join("");
};