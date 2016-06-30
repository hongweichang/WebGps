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
	this.zIndex = 1000;
	this.MAINLY_ADDRESS = false;//是否为大概地址
	this.defaultZoom = true;//当地图上没有设备,就设置为默认级别
	this.imagePath = "../google/image/";
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
	
		
		
	if(wndWidth < 300) { 
		wndWidth=300;
	}
	if(wndHeight < 300){
		wndHeight=300;
	}
		
	var _mapcanvas= document.getElementById("mapcanvas");
	_mapcanvas.style.zIndex = "9";
	_mapcanvas.style.position = "absolute";		
	_mapcanvas.style.left = "0px";
	_mapcanvas.style.top = "26px";		
	_mapcanvas.style.width = wndWidth+"px";
	_mapcanvas.style.height = (wndHeight-26)+"px";
}

mapframe.prototype.loadMap = function(){//创建地图
	//显示提示信息窗口	
	
	var jindu = null;
	var weidu = null;
	var zoom = 4;
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
		
	GFRAME.map = new EV.Map("mapcanvas");
	//增加比例尺控件
	GFRAME.map.addControl(new EV.ScaleControl());
	//增加鹰眼控件
 	GFRAME.map.addControl( new EV.OverviewMapControl());
	//增加一个图层切换的控件
	GFRAME.map.addControl(new EV.MapTypeControl());
	//增加一个骨头棒控件
	GFRAME.map.addControl(new EV.MapControl());
	
	var point = new EV.LngLat(jindu, weidu);
	GFRAME.map.setCenter(point, parseInt(zoom));

	//地图初始化
	document.onmousemove = mouseCoords;
	setTimeout(function(){
			GFRAME.map.addEventListener("click", GFRAME.mapMouseClick);
			GFRAME.map.addEventListener("mousemove", GFRAME.mapMouseMove);
	},100);
	GFRAME.initDrawManage();
	
	//testVehicle();
	//testMarker();
};

mapframe.prototype.initToolStyle = function(tool) {
	var color = "#FF0000";
	tool.style.strokeColor = color;
	tool.style.strokeWidth = 1;
	tool.style.fillColor = color;
	tool.style.fillOpacity = 0.5;
};

mapframe.prototype.initDrawManage = function(){
	//画点
	//"nav","global","zoomin","zoomout","addpoint","addline","addpoly","addcircle","addrect","addellipse","mlength","marea","select", "edit"
	var addpoint = GFRAME.map.toolbar.getToolsByName("addpoint")[0];
	addpoint.addEventListener("done", drawMarkerEnd);
	var addcircle = GFRAME.map.toolbar.getToolsByName("addcircle")[0];
	addcircle.addEventListener("done", drawCircleEnd);
	GFRAME.initToolStyle(addcircle);
	var addrect = GFRAME.map.toolbar.getToolsByName("addrect")[0];
	addrect.addEventListener("done", drawRectangleEnd);
	GFRAME.initToolStyle(addrect);
	var addpoly = GFRAME.map.toolbar.getToolsByName("addpoly")[0];
	addpoly.addEventListener("done", drawPolygonEnd);
	GFRAME.initToolStyle(addpoly);
	var addline = GFRAME.map.toolbar.getToolsByName("addline")[0];
	addline.addEventListener("done", drawLineEnd);
	var screenshot = GFRAME.map.toolbar.getToolsByName("screenshot")[0];
	screenshot.addEventListener("done", screenShotEnd);
	GFRAME.initToolStyle(addline);
	/*
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
    this.drawingManager.addEventListener('polylinecomplete', drawPolygonEnd);
    this.drawingManager.addEventListener('circlecomplete', drawCircleEnd); */
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
	} else {
		return "/alarm/";
	}
};

mapframe.prototype.getVehicleImage = function(huangxiang, status, icon){//获取车辆图标信息
	
	var imgIndex = (Number(huangxiang) & 0x7);
	var statustype = Number(status);
	var image = null;
	if (statustype < 4 || statustype == 9 || statustype == 10) {
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
		_obj.style.zIndex = GFRAME.zIndex;
		GFRAME.zIndex ++;
		_obj.innerHTML = _htmStr;
	}
	
	var date = new Date();
	GFRAME.lastClickTime = date.getTime();
};

function getTxtByVehicle(vehicle){
	var html=[];
	html.push('<font>');
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
	html.push('<font>');
	html.push(marker.status);
	html.push('</font>');
	return html.join("");
};

function getTrackPlayText(name, speed, huangxiang, time){
	var html=[];
	html.push('<font>');
	html.push('<span class="b">'+lang.speed + ':</span>'+speed+'('+huangxiang+')<br/>');
	html.push('<span class="b">'+lang.time + ':</span>'+time+'<br/>');
	html.push('</font>');
	return html.join("");
};