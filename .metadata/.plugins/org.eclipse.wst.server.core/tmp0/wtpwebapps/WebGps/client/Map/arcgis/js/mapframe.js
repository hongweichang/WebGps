// JavaScript Document
function mapframe(){
    this.isInitSuc = false;
    this.map = null;
    this.Geocoder = null;
    this.MarkerID = 1000;
    this.IsCustomInfoWin = false;  //2015-02-26 用自定义的litewin ,可以取得图标的焦点框 ,用默认的infowin ,点了
    //图标,有个焦点框
    this.InfoWinSourceGraphic = null;
    this.DrawLayerSource="";

    //arcgis only by chenfayi 2014-12-23
    this.markerLayer = null;    //车辆图标层
    this.polyLineLayer = null;  //轨迹层  , 增加图层变量是因为连续画轨迹后,需要图层刷新才能刷新出来
    this.drawLayer = null;      //点线面层
    this.drawToolBar = null;    //Arcgis的点线面工具
    //arcgis
	this.isFirstLoadMap = true;
	this.vehicleList = new Hashtable();	//车辆列表
	this.markerList = new Array();	    //地图上的标记信息
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

mapframe.prototype.NewMarkerID = function()
{
    this.MarkerID++;
    return this.MarkerID;   
}

mapframe.prototype.RemoveFocusRect = function ()
{
    /*var rect = document.getElementById("mapcanvas_graphics_layer");
    if (rect != null)
    {
        //rect.style.display = "none";
        this.DrawLayerSource = rect.outerText;
        this.DrawLayerSource = rect.outerHTML;
        //rect.parentNode.removeChild(rect);
        var paths = $("path");
        if (paths != null)
        {
            var path = paths[0];
            path.parentNode.removeChild(path);
        }
    }*/

    if(this.map != null)
        this.map.graphics.clear();
}


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

    mapframe.prototype.loadMap = function ()
    {//创建地图	
        var jindu = null;
        var weidu = null;
        var zoom = 8;
        if (initZoom != "")
        {
            zoom = parseInt(initZoom);
        }

        if (initJingDu != "" && initWeiDu != "")
        {
            jindu = parseFloat(initJingDu);
            weidu = parseFloat(initWeiDu);
        }
        else
        {
            jindu = 0.0;
            weidu = 0.0;
            zoom = 3;
        }

        this.MAP_CENTER_LAT = weidu;
        this.MAP_CENTER_LNG = jindu;

        this.MAX_ZOOM = zoom;
        this.container = "mapcanvas";

        //creating arcgis map with all requirs api
        require([
                "esri/map",
                "dojo/dom-construct",
                "esri/toolbars/draw",
                "esri/SpatialReference",
                "esri/tasks/locator", //search addr from point
                "esri/InfoTemplate",
                "esri/dijit/InfoWindowLite",
                "esri/geometry/Point",
                "esri/geometry/Multipoint",
                "esri/geometry/ScreenPoint",
                "esri/geometry/Polyline",
                "esri/geometry/Polygon",
                "esri/geometry/screenUtils",
                "esri/symbols/SimpleMarkerSymbol",
                "esri/symbols/PictureMarkerSymbol",
                "esri/symbols/SimpleLineSymbol",
                "esri/symbols/SimpleFillSymbol",
                "esri/graphic",
                "esri/Color",
                "esri/symbols/TextSymbol",
                "esri/symbols/Font",
                "esri/layers/GraphicsLayer",
                "dojo/domReady!"
        ], function (Map, domConstruct, SpatialReference, Locator, InfoTemplate, InfoWindowLite, Point, Multipoint, ScreenPoint,Polyline, Polygon, screenUtils, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Graphic, Color, TextSymbol, Font, GraphicsLayer)
        {
            window.mapobject = window.esri || {}; //设置全局的命名空间
            mapobject.maps = esri.geometry || {}; //overlayers of map (arcgis.geometry=baidu.overlayer)

            GFRAME.map = new mapobject.Map("mapcanvas", {
                basemap: "streets",
                center: [jindu, weidu], // longitude, latitude
                zoom: zoom
            });

                    
            GFRAME.map.infoWindow.on("show", function ()
            {
                var gr = GFRAME.map.infoWindow.getSelectedFeature();
                if ((typeof gr.attributes) != "undefined")
                {
                    if (gr.attributes.marker_type == "device")
                    {
                        GFRAME.openPopMarkerVehicle = gr.attributes.idno;
                    }
                    else if (gr.attributes.marker_type == "marker" || gr.attributes.marker_type == "draw")
                    {
                        GFRAME.openPopMarkerShape = gr.attributes.idno;
                    }
                }

                GFRAME.RemoveFocusRect();
                            

            });


            GFRAME.map.infoWindow.on("hide", function ()
            {
                GFRAME.openPopMarkerVehicle = null;
            });
                        

            //define in arcgis
            GFRAME.Geocoder = new mapobject.tasks.Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

            GFRAME.map.on("zoom-end", function ()
            {
                setTimeout(function ()
                {
                    GFRAME.RemoveFocusRect();
                }, 50);

                GFRAME.RemoveFocusRect();
            });

            GFRAME.map.on("load", function ()
            {
                GFRAME.map.infoWindow.resize(350, 400);
                //不会移动
                /*
                var xinfoWindow = new esri.dijit.InfoWindowLite(null, domConstruct.create("div", null, null, GFRAME.map.root));

                dojo.connect(xinfoWindow, "show", function (evt)
                {
                    var gr = GFRAME.map.infoWindow.getSelectedFeature();
                    if ((typeof gr.attributes) != "undefined")
                    {
                        if (gr.attributes.marker_type == "device")
                        {
                            GFRAME.openPopMarkerVehicle = gr.attributes.idno;
                        }
                        else if (gr.attributes.marker_type == "marker" || gr.attributes.marker_type == "draw")
                        {
                            GFRAME.openPopMarkerShape = gr.attributes.idno;
                        }
                    }
                });

                dojo.connect(xinfoWindow, "hide", function (evt)
                {
                    GFRAME.openPopMarkerVehicle = null;
                });
                
                xinfoWindow.startup();
                GFRAME.map.setInfoWindow(xinfoWindow);
                GFRAME.IsCustomInfoWin = true;
                */


                //var infoWindowTitle = query('.title', GFRAME.map.infoWindow.domNode)[0];
                //infoWindowTitle.style.float = 'none';
                //infoWindowTitle.style.styleFloat = 'none';  // IE

                GFRAME.polyLineLayer = new mapobject.layers.GraphicsLayer();
                GFRAME.map.addLayer(GFRAME.polyLineLayer);

                GFRAME.markerLayer = new mapobject.layers.GraphicsLayer();
                GFRAME.map.addLayer(GFRAME.markerLayer);

                GFRAME.drawLayer = new mapobject.layers.GraphicsLayer();
                GFRAME.map.addLayer(GFRAME.drawLayer);

                GFRAME.isInitSuc = true;



                /*
                GFRAME.markerLayer.on("click", function (evt)
                {
                var gr = evt.graphic;
                if (gr)
                {
                if ((typeof gr.attributes) != "undefined")
                {
                if (gr.attributes.marker_type == "device" || gr.attributes.marker_type == "marker"
                || gr.attributes.marker_type == "draw")
                {
                //GFRAME.     
                var deviceid = gr.attributes.idno;
                //alert(deviceid);
                GFRAME.map.infoWindow.setFeatures([gr]);
                }
                }
                }
                });
                */

                /*
                GFRAME.drawLayer.on("click", function (evt)
                {
                var gr = evt.graphic;
                if (gr)
                {
                if ((typeof gr.attributes) != "undefined")
                {
                if (gr.attributes.marker_type == "device" || gr.attributes.marker_type == "marker"
                || gr.attributes.marker_type == "draw")
                {
                //GFRAME.     
                var deviceid = gr.attributes.idno;
                //alert(deviceid);
                GFRAME.map.infoWindow.setFeatures([gr]);
                }
                }
                }
                });
                */

                GFRAME.CreateDxmDrawToolBar();

                //alert(navigator.userAgent);
                //setTimeout(on_playtrace,4000);
                        
            });

            document.onmousemove = mouseCoords;

            //2014-12-22 chenfayi remark
            //GFRAME.map.on("click", GFRAME.mapMouseClick);
            //GFRAME.map.on("mousemove", GFRAME.mapMouseMove);
            //GFRAME.map.on("mousedown", GFRAME.mapMouseDown);
            //GFRAME.map.on("mouseup", GFRAME.mapMouseUp);
            //2014-12-22
        });
    };

    mapframe.prototype.hiddenRightMenu = function ()
    {//隐藏右键的所有菜单
    };


    mapframe.prototype.isMouseMoving = function ()
    {
        var nowTime = isTimeout(GFRAME.mouseMoveTime, 2000);
        if (nowTime == null)
        {
            return true;
        }
        else
        {
            return false;
        }
    };


    mapframe.prototype.CreateDxmDrawToolBar = function ()
    {
        this.drawToolBar = new esri.toolbars.Draw(this.map);
        this.drawToolBar.on("draw-end", function (evt)
        {
            GFRAME.OnDxmDrawEnd(evt);
        });
    }

    mapframe.prototype.ActiveDxmDrawTool = function (tool)
    {
        if (this.drawToolBar != null)
        {
            this.drawToolBar.activate(mapobject.toolbars.Draw[tool]);
            this.map.hideZoomSlider(); 
        }
    }

    //点线面画结束时触发
    mapframe.prototype.OnDxmDrawEnd = function (evt)
    {
        var symbol;
        this.drawToolBar.deactivate();
        this.map.showZoomSlider();
        var marker = null;
        var point_icon = "";
        switch (evt.geometry.type)
        {
            case "point":
                point_icon = getMarkerTabImage(1);
                symbol = new mapobject.symbol.PictureMarkerSymbol({
                    "url": point_icon,
                    "height": 24,
                    "width": 24,
                    "angle": 0
                });
                {
                    var point = evt.geometry;
                    //alert(point.getLongitude().toString());
                }
                marker = new mapobject.Graphic(evt.geometry, symbol, { "marker_type": "draw", "subtype": 1, "idno": GFRAME.NewMarkerID() });
                GFRAME.drawLayer.add(marker);
                this.markerPoint = marker;
                this.onAddMarkerPointFinshed(GFRAME.addMarkerType);
                break;
            case "polygon":
                symbol = new mapobject.symbol.SimpleFillSymbol();

                //搜查和测距就不用改颜色了
                if (GFRAME.addMarkerType != 4 && GFRAME.addMarkerType != 5)
                {
                    var c = new mapobject.Color("#ff0000");
                    c.a = 0.6;
                    symbol.setColor(c);
                }

                marker = new mapobject.Graphic(evt.geometry, symbol, { "marker_type": "draw", "subtype": GFRAME.addMarkerType, "idno": GFRAME.NewMarkerID() });
                this.markerPolygon = marker;

                GFRAME.drawLayer.add(marker);
                this.mapAddMarkerPolygonFinish(GFRAME.addMarkerType);
                break;
            case "polyline":
                symbol = new mapobject.symbol.SimpleLineSymbol();
                var c = new mapobject.Color("#ff0000");
                c.a = 0.8;
                symbol.setColor(c);
                marker = new mapobject.Graphic(evt.geometry, symbol, { "marker_type": "draw", "subtype": GFRAME.addMarkerType, "idno": GFRAME.NewMarkerID() });
                this.markerLine = marker;
                GFRAME.drawLayer.add(marker);
                this.mapAddMarkerPolyLineFinish(GFRAME.addMarkerType);
                break;
        }
    }

    mapframe.prototype.updateDefaultZoom = function(){
        if (this.vehicleList.size() > 0)
        {
            this.defaultZoom = false;	
        }
        else
        {
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
                GFRAME.map.setCenter(new mapobject.maps.Point(_m[0], _m[1]));//设置中心位置和缩放级别
                GFRAME.map.setZoom(getRoom(_m[2]));//通过距离获取缩放级别并设置级别
            }else{
                GFRAME.map.setCenter(new mapobject.maps.Point(geoip_longitude(), geoip_latitude())); //设置中心位置和缩放级别
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
            _obj.innerHTML = _htmStr;
        }
	
        var date = new Date();
        GFRAME.lastClickTime = date.getTime();
    };

    function getTxtByVehicle(vehicle){
        var html=[];
        //html.push('<a style="position:absolute;top:1px;right:1px" href="javascript:;" onclick="GFRAME.closeMaxPop();"><img height="10" src="' + GFRAME.imagePath + 'iw_close.gif"/></a>');
        html.push('<font>');
        //不用show title了
        //if (vehicle.getName() != "") {
        //	html.push('<span class="b">'+vehicle.getName()+'&nbsp;&nbsp;</span><br/>');
        //}
        html.push(vehicle.getStatusStr());
        html.push('<br/>');
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
        //html.push('<a style="position:absolute;top:1px;right:0px" href="javascript:;" onclick="GFRAME.closeMaxPop();"><img height="10" src="' + GFRAME.imagePath + 'iw_close.gif"/></a>');
        html.push('<font>');
        //html.push('<span class="b">'+ marker.getName() +'</span><br/>');
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