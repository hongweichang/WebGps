function isLoadMapSuc()
{
    return GFRAME.isInitSuc;
    //return GFRAME.map != null ? true : false;
}

function insertVehicle(vehiIdno)
{
    //添加一个车辆信息
    var vehi = new vehicle(vehiIdno);
    GFRAME.vehicleList.put(vehiIdno, vehi);
    GFRAME.updateDefaultZoom();
};

function findVehicle(vehiIdno)
{
    //查找车辆信息
    return GFRAME.vehicleList.get(vehiIdno);
};

function setVehiName(vehiIdno, name)
{
    //配置车辆名称
    var vehicle = findVehicle(vehiIdno);
    if (vehicle != null)
    {
        vehicle.setName(name);
        vehicle.setLabel(name);
    }
};

function setVehiMenu(vehiIdno, index, name, popMenu)
{
    var vehicle = findVehicle(vehiIdno);
    if (vehicle != null)
    {
        var item = new menuitem(index, name, popMenu);
        vehicle.setMenuitem(index, item);
    }
};

function setVehiPopMenuName(vehiIdno, index, popindex, popname)
{
    //配置弹出菜单信息
    var vehicle = findVehicle(vehiIdno);
    if (vehicle != null)
    {
        var item = vehicle.getMenuitem(index);
        item.setMenuName(popindex, popname);
    }
};

function delVehiPopMenu(vehiIdno, index, begIndex)
{
    //删除弹出菜单信息
    var vehicle = findVehicle(vehiIdno);
    if (vehicle != null)
    {
        var item = vehicle.getMenuitem(index);
        item.delMenu(begIndex);
    }
};

function setVehiIcon(vehiIdno, icon)
{
    var vehicle = findVehicle(vehiIdno);
    if (vehicle != null)
    {
        vehicle.icon = icon;
    }
};

function isTimeout(last, interval)
{
    var date = new Date();
    var nowTime = date.getTime();
    var timeout = false;

    if (last <= nowTime)
    {
        if ((nowTime - last) >= interval)
        {
            timeout = true;
        }
    }
    else
    {
        timeout = true;
    }
    if (timeout)
    {
        return nowTime;
    }
    else
    {
        return null;
    }
};

function updateVehicle(vehiIdno, jindu, weidu, huangXiangId, statusImage, speed, time, statusStr)
{
    //更新车辆信息
    var vehicle = findVehicle(vehiIdno);
    if (vehicle != null)
    {
        updateVehicleEx(vehicle, jindu, weidu, huangXiangId, statusImage, speed, time, statusStr);
    }
};


//只要执行这个函数 ,地图变慢
function updateVehicleEx(vehicle, jindu, weidu, huangXiangId, statusImage, speed, time, statusStr)
{
    vehicle.setStatus(jindu, weidu, speed, time, statusStr);
    var vehiIdno = vehicle.getIdno();
    var autoCenter = false;
    var point = new mapobject.maps.Point(vehicle.getJindu(), vehicle.getWeidu());
    var image = GFRAME.getVehicleImage(huangXiangId, statusImage, vehicle.icon);

    if (vehicle.nameMarker == null)
    {
        var vehiText = null;
        var showPop = false;

        //		if (null == GFRAME.openPopMarkerVehicle && null == GFRAME.openPopMarkerShape){
        //				GFRAME.openPopMarkerVehicle = vehicle.getIdno();
        //				GFRAME.vehicleCenter = true;
        //				vehiText = getTxtByVehicle(vehicle);
        //				autoCenter = true;
        //		}else{
        vehiText = vehicle.getName();
        if (false == GFRAME.popAllVehicleName)
        {
            showPop = false;
        }
        //		}

        //by chenfayi, 不在infowindow的onshow 取, 在这里直接取
        vehiText = getTxtByVehicle(vehicle);
        
        var namemarker = new NameMarker({ position: point, map: GFRAME.map, icon: image, text: vehicle.getLabel(), marker_type: "device", idno: vehiIdno });
        vehicle.nameMarker = namemarker;

        var popmarker = new PopupMarker({ position: point, map: GFRAME.map, icon: image, title: vehicle.getName(), content: vehiText, id: vehiIdno, showpop: showPop, marker: namemarker, marker_type: "device", idno: vehiIdno });

        vehicle.popMarker = popmarker;
    }
    else
    {
        var vehiText = vehicle.getName();
        if (vehiIdno == GFRAME.openPopMarkerVehicle)
        {
            vehiText = getTxtByVehicle(vehicle);
        }

        if (vehicle.popMarker != null)
        {
            vehicle.popMarker.update({ position: point, icon: image, title: vehicle.getName(), content: vehiText });
            vehicle.nameMarker.update({ position: point, icon: image, text: vehiText });

            if (vehiIdno == GFRAME.openPopMarkerVehicle)
            {
                if (GFRAME.IsCustomInfoWin)
                {
                    var sp = GFRAME.map.toScreen(point);
                    GFRAME.map.infoWindow.move(sp);
                }

                
                GFRAME.map.infoWindow.show(point);
            }
        }
    }
    
    
    GFRAME.updateRegion(jindu, weidu);

    if (vehiIdno == GFRAME.openPopMarkerVehicle)
    {
        var nowTime = isTimeout(GFRAME.parseAddressTime, 3000);
        if (nowTime)
        {
            parseAddress(weidu, jindu, "overVehicleAddress", vehicle.getName());
            GFRAME.parseAddressTime = nowTime;
        }

        if (GFRAME.vehicleCenter && !GFRAME.isMarkingDrawing() && !GFRAME.isMouseMoving())
        {
            move2vehicle(vehicle);
        }
    }

    GFRAME.RemoveFocusRect();
};

function clickVehicle(vehicle)
{
    //单击车辆信息，则弹出窗口
    if (null != GFRAME.openPopMarkerVehicle)
    {
        if (GFRAME.openPopMarkerVehicle == vehicle.getIdno())
        {
            return;
        }
        hideVehiclePop();
    }
    else
    {
        hideMapmarkerPop();
    }
    showVehiclePop(vehicle);
};

//function popVehicleMarkerTimer() {
//	if (GFRAME.openPopMarkerVehicle != null && GFRAME.vehicleCenter) {
//		var vehicle = findVehicle(GFRAME.openPopMarkerVehicle);
//		if (vehicle != null) {
//			showVehiclePop(vehicle);
//		}
//	}
//};

function showVehiclePop(vehicle)
{
    if (vehicle.popMarker != null)
    {
        parseAddress(vehicle.getWeidu(), vehicle.getJindu(), "overVehicleAddress", vehicle.getName());
        //vehicle.popMarker.setZIndex(GFRAME.zIndex);
        //GFRAME.zIndex++;
        GFRAME.openPopMarkerVehicle = vehicle.getIdno();
        //GFRAME.vehicleCenter = true;
        vehicle.popMarker.showpop = true;
        vehicle.popMarker.update({ text: getTxtByVehicle(vehicle) });
        vehicle.popMarker.show();

        


        //} else {
        //	setTimeout('popVehicleMarkerTimer()', 100);
        //}
    }
};

function hideVehiclePop()
{
    if (GFRAME.openPopMarkerVehicle != null)
    {
        var vehicle = findVehicle(GFRAME.openPopMarkerVehicle);
        if (vehicle != null)
        {
            if (GFRAME.popAllVehicleName == true)
            {
                vehicle.popMarker.update({ text: vehicle.getName() });
            } else
            {
                setTimeout(function ()
                {
                    vehicle.popMarker.hide();
                }, 0);
            }
        }
        GFRAME.openPopMarkerVehicle = null;
        GFRAME.vehicleCenter = false;
    }
};

function selectVehicleEx(vehiIdno)
{	//车辆居中
    var vehicle = findVehicle(vehiIdno);
    if (vehicle != null)
    {
        //不用改版地图放大级别
        //selectVehicle(vehicle, 16);
        var level = GFRAME.map.getZoom();
        //selectVehicle(vehicle, level);
        selectVehicle(vehicle, 13);
    }
};

function selectVehicleZoom(vehicle, zoom, zoomLevel)
{	//车辆居中，但不进行地图缩放
    if (vehicle.popMarker != null)
    {
        //将之前显示的车辆隐藏
        
        if (null != GFRAME.openPopMarkerVehicle)
        {
            if (GFRAME.openPopMarkerVehicle == vehicle.getIdno())
            {
                moveVehiCenter(vehicle, zoom, zoomLevel);
                return;
            }
            hideVehiclePop();
        } 
        else
        {
            hideMapmarkerPop();
        }
        
        showVehiclePop(vehicle);
        moveVehiCenter(vehicle, zoom, zoomLevel);
    }
};

function selectVehicle(vehicle, zoomLevel)
{	//车辆居中
    selectVehicleZoom(vehicle, true, zoomLevel);
};

function centerVehicle(vehiIdno)
{	//车辆居中
    var vehicle = findVehicle(vehiIdno);
    if (vehicle != null)
    {
        //原来会放到16级别
        //moveVehiCenter(vehicle);
        //现在不用改版地图放大级别 , chenfayi 2014-12-25
        var level = GFRAME.map.getZoom();
        moveVehiCenter(vehicle, false, level);
        GFRAME.openPopMarkerVehicle = vehicle.vehiIdno();
    }
};

function move2vehicle(vehicle)
{
    move2LatLng(vehicle.getJindu(), vehicle.getWeidu());
};

function moveVehiCenter(vehicle, zoom, zoomLevel)
{
    var point = new mapobject.maps.Point(vehicle.getJindu(), vehicle.getWeidu());
    if (typeof zoom == "undefined" || zoom)
    {
        //var level = 16;
        var level = 13;
        if (typeof zoomLevel != "undefined")
        {
            level = zoomLevel;
        }

        if (GFRAME.map.getZoom() < level)
        {
            GFRAME.map.setZoom(level);
        }
    }

    //arcgis map has no panto
    GFRAME.map.centerAt(point);
    //GFRAME.map.panTo(point);
};

function move2LatLng(jindu, weidu)
{
    var p = new mapobject.maps.Point(jindu, weidu);
    var sp = GFRAME.map.toScreen(p);

    if (sp.x < 20 || sp.x > GFRAME.map.width-20 || sp.y < 20 || sp.y > GFRAME.map.height-20)
    {
        GFRAME.map.centerAt(p);
    }

    /*
    var p = new mapobject.maps.Point(jindu, weidu);
    ext = GFRAME.map.extent;

    //if (!GFRAME.map.extent.contains(p))
    if (!ext.contains(p))
    {
        //arcgis map has no panto
        GFRAME.map.centerAt(p);
    }*/
};

function pushTrackPoint(vehiIdno, jindu, weidu)
{	//加入轨迹点
    var vehicle = findVehicle(vehiIdno);
    if (vehicle != null)
    {
        var point = new mapobject.maps.Point(jindu, weidu);
        vehicle.trackPolyPoint.push(point);
    }
};

function drawTrackPoint(vehiIdno)
{	//画轨迹点
    //	var point = new google.maps.LatLng(39.907001, 116.391001);
    //	poly.push(point);
    //	point = new google.maps.LatLng(39.807001, 116.391001);
    //	poly.push(point);
    var vehicle = findVehicle(vehiIdno);
    if (vehicle != null)
    {
        var length = vehicle.trackPolyPoint.length;
        if (length > 0)
        {
            var poly = [];
            //if (vehicle.trackLastPoint != null){
            //	poly.push(vehicle.trackLastPoint);
            //}

            //var point = vehicle.trackPolyPoint.pop();
            //vehicle.trackLastPoint = point;
            //poly.push(point);

            //length = length - 1;
            for (var i = 0; i < length; ++i)
            {
                point = vehicle.trackPolyPoint.pop();
                poly.push(point);
            }

            //2014-12-23
            //var polyLine = new google.maps.Polyline({ path: poly, strokeColor: "#00FF00", strokeOpacity: 0.9, strokeWeight: 5 });    
            //polyLine.setMap(GFRAME.map);
            //vehicle.trackPolyLine.push(polyLine);
            //2014-12-23

            var polylineOptions = { "paths": [],
                "spatialReference": { "wkid": 4326 }
            };
            var polyLine = new mapobject.maps.Polyline(polylineOptions);
            //don't know why , remove at first  , then add new path
            polyLine.removePath(0);
            polyLine.addPath(poly);

            var ls = new mapobject.symbol.SimpleLineSymbol();

            var graphic = new mapobject.Graphic(polyLine, ls);

            ls.setWidth(5);
            ls.setColor(new mapobject.Color([0, 255, 0, 0.8]));

            GFRAME.polyLineLayer.add(graphic);

            //vehicle.trackPolyLine.push(polyLine);
            //by chenfayi 2014-12-23
            //还是push graphic , 可以根据 graphics.geometry 取回ployline对象(但通过 ployline 取不到graphic)
            //因为删除时需要从 graphiclayer 移除 graphics , 

            vehicle.trackPolyLine.push(graphic);

            GFRAME.polyLineLayer.redraw();
        }
    }
};

function deleteTrackPoint(vehiIdno)
{
    var vehicle = findVehicle(vehiIdno);
    if (vehicle != null)
    {
        deleteVehiTrack(vehicle);
    }
};

//和drawTrackPoint对应
function deleteVehiTrack(vehicle)
{
    var length = vehicle.trackPolyLine.length;
    var polyLine = null;
    for (var i = 0; i < length; i++)
    {
        //polyLine = vehicle.trackPolyLine.pop();
        //polyLine.setMap(null);
        var graphics = vehicle.trackPolyLine.pop();
        GFRAME.polyLineLayer.remove(graphics);
        graphics.geometry = null;
        graphics.symbol = null;
        graphics = null;
    }
    vehicle.trackLastPoint = null;

    GFRAME.polyLineLayer.redraw();
};

//for arcgis , marker is graphics object , by chenfayi 2014-12-24
function deleteVehicle(vehiIdno)
{
    //删除车辆信息
    var findVehi = null;
    var findVehi = GFRAME.vehicleList.remove(vehiIdno);
    if (findVehi != null)
    {
        if (findVehi.nameMarker != null)
        {
            //findVehi.nameMarker.setMap(null);
            //GFRAME.markerLayer.remove(findVehi.nameMarker);
            //findVehi.nameMarker.geometry = null;
            //findVehi.nameMarker.symbol = null;
            findVehi.nameMarker.FreeRes();
            findVehi.nameMarker = null;
        }
        if (findVehi.popMarker != null)
        {
            //findVehi.popMarker.setMap(null);
            //GFRAME.markerLayer.remove(findVehi.popMarker);
            //findVehi.popMarker.geometry = null;
            //findVehi.popMarker.symbol = null;
            findVehi.popMarker.FreeRes();
            findVehi.popMarker = null;
        }

        if (GFRAME.openPopMarkerVehicle == vehiIdno)
        {
            GFRAME.map.infoWindow.hide();
            GFRAME.openPopMarkerVehicle = null;
            GFRAME.vehicleCenter = false;
        }

        deleteVehiTrack(findVehi);
        findVehi = null;
    }

    //2015-03-06
    //GFRAME.markerLayer.redraw();
};

function insertMarker(markerId)
{
    //加入一个标记
    var marker = new mapmarker(markerId);
    GFRAME.markerList.push(marker);
};

function findMarker(markerId)
{
    //查找标记信息
    var findId = Number(markerId);
    for (var i = 0; i < GFRAME.markerList.length; ++i)
    {
        if (GFRAME.markerList[i].getId() == findId)
        {
            return GFRAME.markerList[i];
        }
    }
    return null;
};

function findMarkerByShape(shape)
{	//查找标记信息
    for (var i = 0; i < GFRAME.markerList.length; ++i)
    {
        if (GFRAME.markerList[i].shape == shape)
        {
            return GFRAME.markerList[i];
        }
    }
    return null;
};

function getMiddleValue(minVal, maxVal)
{
    return Number(minVal) + Number((Number(maxVal) - Number(minVal)) / 2)
};

function getMarkerTabImage(tabType)
{
    //return GFRAME.imagePath + "marker/" + tabType + ".gif";
    return GFRAME.imagePath + "marker/1.gif";
};

function parseMarkerPoint(typeId, jindu, weidu)
{		//解析标记点信息
    if (typeId == 1)
    {	//点
        var point = new mapobject.maps.Point(jindu, weidu);
        return { center: point, bottom: point };
    } else
    {
        var latList = new Array();
        var lngList = new Array();
        latList = weidu.split(",");
        lngList = jindu.split(",");
        var planCoordinates = new Array();
        var maxLat = latList[0];
        var minLat = latList[0];
        var maxLng = lngList[0];
        var minLng = lngList[0];

        //计算最上面和最下方的点，最左边和最右边的点
        for (var i = 0; i < latList.length; i++)
        {
            planCoordinates.push(new mapobject.maps.Point(lngList[i], latList[i]));
            if (Number(latList[i]) > maxLat)
            {
                maxLat = Number(latList[i]);
            }
            if (Number(latList[i]) < minLat)
            {
                minLat = Number(latList[i]);
            }
            if (Number(lngList[i]) > maxLng)
            {
                maxLng = Number(lngList[i]);
            }
            if (Number(lngList[i]) < minLng)
            {
                minLng = Number(lngList[i]);
            }
        }

        var bottomPoint;
        var centerPoint;
        var bounds = null;
        if (typeId == 2)
        {

            var mp = new mapobject.maps.Multipoint(new esri.SpatialReference({ wkid: 4326 }));
            //mp.addPoint(new mapobject.maps.Point(lngList[0], latList[0]));
            //mp.addPoint(new mapobject.maps.Point(lngList[1], latList[1]));

            mp.addPoint(new mapobject.maps.Point(minLng, minLat));
            mp.addPoint(new mapobject.maps.Point(maxLng, maxLat));

            bounds = mp.getExtent();
            bottomPoint = new mapobject.maps.Point(bounds.xmin, bounds.ymin); //bounds.getSouthWest();
            centerPoint = bounds.getCenter();
        }
        else if (typeId == 3)
        {
            bottomPoint = new mapobject.maps.Point(maxLng, maxLat);
            centerPoint = new mapobject.maps.Point(getMiddleValue(minLng, maxLng), getMiddleValue(minLat, maxLat));
        }
        else if (typeId == 9)
        {
            bottomPoint = new mapobject.maps.Point(lngList[0], latList[0]);
            centerPoint = new mapobject.maps.Point(lngList[0], latList[0]);
        }

        //注意bounds 是 esri.geometry.Extent 对象
        return { center: centerPoint, bottom: bottomPoint, coordinates: planCoordinates, bound: bounds };
    }
};

function updateMarker(markerId, typeId, name, jindu, weidu, tabType, color, status)
{
    var mapmarker = findMarker(markerId);
    if (mapmarker != null)
    {
        var posOption = parseMarkerPoint(typeId, jindu, weidu);
        mapmarker.position = posOption.center;
        mapmarker.setName(name);
        mapmarker.jindu = jindu;
        mapmarker.weidu = weidu;
        mapmarker.tabType = tabType;
        mapmarker.color = color;
        mapmarker.status = status;
        mapmarker.typeId = typeId;

        if (mapmarker.nameMarker == null)
        {
            if (typeId == 2)
            {
                //Rectange
                var ext = posOption.bound;
                var pg = mapobject.maps.Polygon.fromExtent(ext);
                var ls = new mapobject.symbol.SimpleFillSymbol();
                var c = new mapobject.Color("#" + color);
                c.a = 0.8;
                ls.setColor(c);
                mapmarker.shape = new mapobject.Graphic(pg, ls, { "marker_type": "marker", "subtype": 1, "idno": markerId });
                GFRAME.polyLineLayer.add(mapmarker.shape);
                mapmarker.bound = posOption.bound;
            }
            else if (typeId == 3)
            {
                //Polygon
                var pg = new mapobject.maps.Polygon(new esri.SpatialReference({ wkid: 4326 }));
                pg.removeRing(0);
                pg.addRing(posOption.coordinates);

                var c = new mapobject.Color("#" + color);
                c.a = 0.8;

                var ls = new mapobject.symbol.SimpleFillSymbol();
                ls.setColor(c);

                mapmarker.shape = new mapobject.Graphic(pg, ls, { "marker_type": "marker", "subtype": 3, "idno": markerId });
                GFRAME.polyLineLayer.add(mapmarker.shape);
            }
            else if (typeId == 9)
            {
                //PloyLine
                var pl = new mapobject.maps.Polyline({ "paths": [],
                    "spatialReference": { "wkid": 4326 }
                });
                pl.removePath(0);
                pl.addPath(posOption.coordinates);
                var ls = new mapobject.symbol.SimpleLineSymbol();
                ls.setWidth(3);
                var c = new mapobject.Color("#" + color);
                c.a = 0.8;
                ls.setColor(c);
                mapmarker.shape = new mapobject.Graphic(pl, ls, { "marker_type": "marker", "subtype": 9, "idno": markerId });
                GFRAME.polyLineLayer.add(mapmarker.shape);
            }

            var nameMarker = null;
            var iconfile = null;
            if (typeId == 1)
            {
                //点
                iconfile = getMarkerTabImage(tabType);
                nameMarker = new NameMarker({ position: posOption.center, map: GFRAME.map, text: name, icon: iconfile, marker_type: "marker", idno: markerId, dxmobj: mapmarker.shape });
            }
            else
            {
                nameMarker = new NameMarker({ position: posOption.center, map: GFRAME.map, text: name, marker_type: "marker", idno: markerId, dxmobj: mapmarker.shape });

                //arcgis 没有事件 by chenfayi 2014-12-23
                //mapmarker.listenerClick = mapobject.maps.event.addListener(mapmarker.shape, "click", GFRAME.mapMouseClick);
                //mapmarker.listenerMousemove = mapobject.maps.event.addListener(mapmarker.shape, "mousemove", GFRAME.mapMouseMove);
                //mapmarker.listenerMousedown = mapobject.maps.event.addListener(mapmarker.shape, "mousedown", GFRAME.mapMouseDown);
                //mapmarker.listenerMouseup = mapobject.maps.event.addListener(mapmarker.shape, "mouseup", GFRAME.mapMouseUp);
                ////mapmarker.listener = mapobject.maps.event.addListener(mapmarker.shape, 'click', mapMouseClick);
            }

            mapmarker.nameMarker = nameMarker;

            var popmarker = new PopupMarker({ position: posOption.center, map: GFRAME.map, title: name, content: getTxtByMarker(mapmarker), name: name, icon: iconfile, id: markerId, showpop: false, marker: nameMarker, marker_type: "marker", idno: markerId });
            mapmarker.popMarker = popmarker;
            //if (typeId != 1) 
            //    mapmarker.shape.setInfoTemplate(popmarker.infoTemplate)
        }
        else
        {
            if (typeId == 1)
            {
                //点
                mapmarker.nameMarker.update({ position: mapmarker.position, icon: getMarkerTabImage(tabType), name: name, text: mapmarker.name });
            }
            else
            {
                if (typeId == 2)
                {
                    //retangle
                    //mapmarker.shape.setBounds(posOption.bound); //new mapobject.maps.LatLngBounds(posOption.coordinates[0],posOption.coordinates[1]));
                    mapmarker.shape.geometry = mapobject.maps.Polygon.fromExtent(posOption.bound);
                    //更新颜色
                    var c = new mapobject.Color("#" + color);
                    c.a = 0.8;
                    var ls = mapmarker.shape.symbol;
                    ls.setColor(c);

                    GFRAME.polyLineLayer.redraw();
                }
                else if (typeId == 3)
                {
                    //Polygon
                    //mapmarker.shape.setPath(posOption.coordinates);
                    mapmarker.shape.geometry.removeRing(0);
                    mapmarker.shape.geometry.addRing(posOption.coordinates);

                    //更新颜色
                    var c = new mapobject.Color("#" + color);
                    c.a = 0.8;
                    var ls = mapmarker.shape.symbol;
                    ls.setColor(c);

                    GFRAME.polyLineLayer.redraw();
                }
                else if (typeId == 9)
                {
                    //PloyLine
                    //mapmarker.shape.setPath(posOption.coordinates);
                    mapmarker.shape.geometry.removePath(0);
                    mapmarker.shape.geometry.addPath(posOption.coordinates);

                    //更新颜色
                    var c = new mapobject.Color("#" + color);
                    c.a = 0.8;
                    var ls = mapmarker.shape.symbol;
                    ls.setColor(c);

                    GFRAME.polyLineLayer.redraw();
                }

                mapmarker.nameMarker.update({ position: mapmarker.position, text: mapmarker.name });

            }

            var scontent = getTxtByMarker(mapmarker);
            mapmarker.popMarker.update({ position: mapmarker.position, title: name, content: scontent, name: name, text: scontent });
        }
    }
};

function showMapmarkerPop(mapmarker)
{
    if (mapmarker.popMarker != null)
    {
        mapmarker.popMarker.update({ position: mapmarker.position, title: mapmarker.name, content: getTxtByMarker(mapmarker), text: getTxtByMarker(mapmarker) });
        //by chenfayi 2014-12-25
        //mapmarker.popMarker.setZIndex(GFRAME.zIndex);
        //GFRAME.zIndex++;
        mapmarker.popMarker.show();
        GFRAME.openPopMarkerShape = mapmarker.getId();
    }
};

function hideMapmarkerPop()
{
    if (null != GFRAME.openPopMarkerShape)
    {
        var mapmarker = findMarker(GFRAME.openPopMarkerShape);
        if (mapmarker != null)
        {
            mapmarker.popMarker.hide();
        }
        GFRAME.openPopMarkerShape = null;
    }
};

function popupMapmarker(mapmarker, position)
{
    if (null != GFRAME.openPopMarkerShape)
    {
        if (GFRAME.openPopMarkerShape == mapmarker.getId())
        {
            mapmarker.popMarker.update({ position: position });
            return;
        }
        hideMapmarkerPop();
    }
    else
    {
        hideVehiclePop();
    }

    mapmarker.position = position;
    showMapmarkerPop(mapmarker);
};

function clickMarker(event)
{
    var nowTime = isTimeout(GFRAME.lastClickTime, 200);
    if (nowTime == null)
    {
        return;
    }

    var mapmarker = findMarkerByShape(this);
    if (mapmarker != null)
    {
        popupMapmarker(mapmarker, event.latLng);
    }
    GFRAME.lastClickTime = nowTime;
};

function selectMarker(markerId)
{
    var marker = findMarker(markerId);
    if (marker != null)
    {
        //不改变 , by chenfayi 2014-12-23
        //if (GFRAME.map.getZoom() < 16)
        if (GFRAME.map.getZoom() < 13)
        {
            GFRAME.map.setZoom(13);
        }

        //GFRAME.map.panTo(marker.position);
        GFRAME.map.centerAt(marker.position);
        //取消车辆居中
        GFRAME.vehicleCenter = false;
    }
};

function deleteMarker(markerId)
{
    var findId = Number(markerId);
    var findMarker = null;
    var marker = null;
    var markerNum = GFRAME.markerList.length;
    for (var i = 0; i < markerNum; ++i)
    {
        marker = GFRAME.markerList.pop();
        if (marker.getId() == findId)
        {
            findMarker = marker;
            break;
        }
        GFRAME.markerList.unshift(marker);
    }


    if (findMarker != null)
    {
        //arcgis 没有事件 by chenfayi 2014-12-23
        if (mapmarker.listenerClick != null)
        {
            //mapobject.maps.event.removeListener(findMarker.listenerClick);
            findMarker.listenerClick = null;
        }
        if (mapmarker.listenerMousemove != null)
        {
            //mapobject.maps.event.removeListener(findMarker.listenerMousemove);
            findMarker.listenerMousemove = null;
        }
        if (mapmarker.listenerMousedown != null)
        {
            //mapobject.maps.event.removeListener(findMarker.listenerMousedown);
            findMarker.listenerMousedown = null;
        }
        if (mapmarker.listenerMouseup != null)
        {
            //mapobject.maps.event.removeListener(findMarker.listenerMouseup);
            findMarker.listenerMouseup = null;
        }

        if (findMarker.shape != null)
        {
            //findMarker.shape.setMap(null);
            findMarker.shape.geometry = null;
            findMarker.shape.symbol = null;
            GFRAME.polyLineLayer.remove(findMarker.shape);
            findMarker.shape = null;
        }

        if (findMarker.nameMarker != null)
        {
            findMarker.nameMarker.FreeRes();
            findMarker.nameMarker = null;
        }

        if (findMarker.popMarker != null)
        {
            //findMarker.popMarker.setMap(null);
            findMarker.popMarker.FreeRes();
            findMarker.popMarker = null;
        }

        if (GFRAME.openPopMarkerShape == markerId)
        {
            GFRAME.map.infoWindow.hide();
            GFRAME.openPopMarkerShape = null;
        }

        findMarker = null;
    }
};

function findTracker(trackId)
{
    //查找轨迹点对象
    for (var i = 0; i < GFRAME.trackList.length; ++i)
    {
        if (GFRAME.trackList[i].getId() == trackId)
        {
            return GFRAME.trackList[i];
        }
    }

    return null;
};

function trackInsertTrack(trackId)
{
    var color = null;
    for (var i = 0; i < GFRAME.trackColor.length; ++i)
    {
        color = GFRAME.trackColor[i];
        var find = false;
        for (var j = 0; j < GFRAME.trackList.length; ++j)
        {
            if (GFRAME.trackList[j].color == color)
            {
                find = true;
                break;
            }
        }
        if (!find)
        {
            break;
        }
    }

    var track = new maptrack(trackId);
    track.color = color;
    ++GFRAME.trackZIndex;
    track.mapTrack = null;
    track.zIndex = GFRAME.trackZIndex;
    GFRAME.trackList.push(track);
};

function trackSetColor(trackId, color)
{
    var track = findTracker(trackId);
    if (track != null)
    {
        track.color = "#" + color;
    }
};

function trackPushPoint(trackId, jindu, weidu)
{
    var track = findTracker(trackId);
    if (track != null)
    {
        var point = new mapobject.maps.Point(jindu, weidu);
        track.trackPolyPoint.push(point);
    }
};

function trackDrawPoint(trackId)
{
    var track = findTracker(trackId);
    if (track != null)
    {
        var length = track.trackPolyPoint.length;
        if (length > 1)
        {
            var poly = [];
            var point = null;
            var lastPoint = track.trackPolyPoint[length - 1];
            for (var i = 0; i < length; ++i)
            {
                point = track.trackPolyPoint.pop();
                poly.push(point);
            }
            //保存最后一个点的信息
            track.trackPolyPoint.push(lastPoint);

            //var polyLine = new google.maps.Polyline({ path: poly, strokeColor: track.color, strokeOpacity: 0.9, strokeWeight: 5, clickable: false, zIndex: track.zIndex });
            //polyLine.setMap(GFRAME.map);
            var pl = track.mapTrack;
           
            var newadded = false;
            //if (track.mapTrack == null)
            {
                pl = new mapobject.maps.Polyline({
                    "paths": [],
                    "spatialReference": { "wkid": 4326 }
                });

                track.mapTrack = pl;
                newadded = true;
            }
            
            pl.removePath(0);
            pl.addPath(poly);

            var ls = new mapobject.symbol.SimpleLineSymbol();
            ls.setWidth(5);
            var c = new mapobject.Color(track.color);
            c.a = 0.8;
            ls.setColor(c);
            var g = new mapobject.Graphic(pl, ls);

            track.mapTraceGraphic = g;

            GFRAME.polyLineLayer.add(g);

            //GFRAME.polyLineLayer.redraw();
            
            if (newadded)
                track.trackPolyLine.push(g);  
        }
    }
};

function trackVehicleId(trackId, vehiId)
{
    return trackId + "-" + vehiId;
};

function trackInsertVehicle(trackId, vehiId, vehiIcon)
{
    var track = findTracker(trackId);
    if (track != null)
    {
        var trackVehiId = trackVehicleId(trackId, vehiId);
        insertVehicle(trackVehiId);
        if (typeof vehiIcon == "undefined")
        {
            setVehiIcon(trackVehiId, 1);
        } else
        {
            setVehiIcon(trackVehiId, vehiIcon);
        }
        track.vehicleList.push(vehiId);
    }
};

function trackDelPlayVehicle(track)
{
    if (track.playVehicle != null)
    {
        deleteVehicle(trackVehicleId(track.getId(), track.playVehicle));
        track.playVehicle = null;
        track.playReplace = null;
    }
};

function trackUpdatePlayVehicle(track, jindu, weidu, huangXiangId, statusImage, label, statusStr, icon)
{
    //return;

    if (track.playVehicle == null)
    {
        track.playVehicle = -1;
        insertVehicle(trackVehicleId(track.getId(), track.playVehicle));
    }

    var vehicle = findVehicle(trackVehicleId(track.getId(), track.playVehicle));
    if (vehicle != null)
    {
        vehicle.movetip = false;
        vehicle.name = label;
        vehicle.icon = icon;
        var vehiId = trackVehicleId(track.getId(), track.playVehicle);
        //		if (GFRAME.openPopMarkerVehicle != vehiId) {
        //			hideVehiclePop();
        //		}

        updateVehicleEx(vehicle, jindu, weidu, huangXiangId, statusImage, "", "", statusStr);

        //轨迹回放时，将弹出窗口放到当前播放对象中
        if (vehiId != GFRAME.openPopMarkerVehicle)
        {
            //20150128
            selectVehicleZoom(vehicle, false, GFRAME.trackZoomLevel);
        }

        move2LatLng(jindu, weidu);
        //CenterMarker(jindu, weidu);
    }

    //隐藏图标的焦点框
    GFRAME.RemoveFocusRect();
};


function CenterMarker(jindu, weidu)
{
    var p = new mapobject.maps.Point(jindu, weidu);
    var sp = GFRAME.map.toScreen(p);

    if (sp.x < 0 || sp.x > GFRAME.map.width || sp.y < 0 || sp.y > GFRAME.map.height)
    {
        GFRAME.map.centerAt(p);
    }
    
    //ext = GFRAME.map.extent;
    //if (!GFRAME.map.extent.contains(p))
    //if (!ext.contains(p))
    //{
        //arcgis map has no panto
     //   GFRAME.map.centerAt(p);
    //}
}

function trackDelSelectVehicle(track)
{
    if (track.selectVehicle != null)
    {
        deleteVehicle(trackVehicleId(track.getId(), track.selectVehicle));
        track.selectVehicle = null;
    }
};

function trackUpdateSelectVehicle(track, name, jindu, weidu, huangXiangId, statusImage, label, statusStr, icon)
{
    if (track.selectVehicle == null)
    {
        track.selectVehicle = -2;
        insertVehicle(trackVehicleId(track.getId(), track.selectVehicle));
    }

    var vehicle = findVehicle(trackVehicleId(track.getId(), track.selectVehicle));
    if (vehicle != null)
    {
        vehicle.movetip = false;
        vehicle.name = name;
        vehicle.lable = label;
        vehicle.icon = icon;
        updateVehicleEx(vehicle, jindu, weidu, huangXiangId, statusImage, "", "", statusStr);
        selectVehicle(vehicle, GFRAME.trackZoomLevel);
    }
};

function trackFindVehicle(track, vehiId)
{
    for (var i = 0; i < track.vehicleList.length; ++i)
    {
        if (track.vehicleList[i] == vehiId)
        {
            return track.vehicleList[i];
        }
    }

    return null;
};

function trackUpdateVehicle(trackId, vehiId, name, jindu, weidu, huangXiangId, statusImage, label, statusStr, show)
{
    var track = findTracker(trackId);
    
    if (track != null)
    {
        var trackVehicle = trackFindVehicle(track, vehiId);
        if (trackVehicle != null)
        {
            var trackVehiId = trackVehicleId(trackId, vehiId);
            var vehicle = findVehicle(trackVehiId);
            //将数据更新到车辆对象上
            vehicle.setName(name);
            vehicle.setLabel(label);
            vehicle.jindu = jindu;
            vehicle.weidu = weidu;
            vehicle.statusStr = statusStr;
            vehicle.huangXiang = huangXiangId;
            vehicle.statusImage = statusImage;
            vehicle.movetip = false;
            if (Number(show)==1)  //如果打开这段,停车点轨迹回放info窗口会一闪一闪
            {
                vehicle.show = true;
                //播放的车辆进行删除
                trackDelPlayVehicle(track);
                //更新播放车辆
                updateVehicle(trackVehiId, jindu, weidu, huangXiangId, statusImage, "", "", statusStr);
                //轨迹回放时，将弹出窗口放到当前播放对象中
                if (trackVehiId != GFRAME.openPopMarkerVehicle) //这段导致停车点轨迹回放info窗口一闪一闪
                {
                    //selectVehicleZoom(vehicle, false);
                    //GFRAME.openPopMarkerVehicle = trackVehiId;

                    showVehiclePop(vehicle);
                    move2LatLng(jindu, weidu);
                }
            }
            else
            {
                vehicle.show = false;
                //删除之前选中的车辆
                trackDelSelectVehicle(track);
                //更新播放位置的车辆对象
                track.playReplace = vehiId;
                var labelName = "";
                if (label != null && label != "")
                {
                    labelName = label;
                } else
                {
                    labelName = name;
                }
                trackUpdatePlayVehicle(track, jindu, weidu, huangXiangId, statusImage, labelName, statusStr, vehicle.icon);
            }

            //判断地图是否在区域内，如果没有，则进行居中
            //move2LatLng(jindu, weidu);
        }
    }
};

function trackSelectVehicle(trackId, vehiId)
{
    var track = findTracker(trackId);
    if (track != null)
    {
        //判断是否可以找到轨迹点信息
        var trackVehicle = trackFindVehicle(track, vehiId);
        if (trackVehicle != null)
        {
            var trackVehiId = trackVehicleId(trackId, vehiId);
            var vehicle = findVehicle(trackVehiId);
            //需要判断轨迹点是否显示
            if (vehicle.show)
            {
                //选择选中的车辆
                selectVehicle(vehicle, GFRAME.trackZoomLevel);
                //删除选择的播放点
                trackDelSelectVehicle(track);
            } else
            {
                //判断选择的轨迹点和播放的轨迹点是否为同一个
                if (track.playReplace == vehiId)
                {
                    //如果是，直接选择播放的轨迹点
                    var vehicle = findVehicle(trackVehicleId(trackId, track.playVehicle));
                    if (vehicle != null)
                    {
                        selectVehicle(vehicle, GFRAME.trackZoomLevel);
                    }
                    //删除选择的播放点
                    trackDelSelectVehicle(track);
                } else
                {
                    //不是，直接更新选择的轨迹点
                    trackUpdateSelectVehicle(track, vehicle.name, vehicle.jindu, vehicle.weidu, vehicle.huangXiang
						, vehicle.statusImage, vehicle.label, vehicle.statusStr, vehicle.icon);
                }
            }
        }
    }
};

function trackDeleteVehicle(trackId, vehiId)
{
    var track = findTracker(trackId);
    if (track != null)
    {
        //先删除车辆图标
        var trackVehiId = trackMarkerId(trackId, vehiId);
        deleteVehicle(trackVehiId);

        //删除车辆结点
        var vehicle = null;
        var num = track.vehicleList.length;
        for (var i = 0; i < num; ++i)
        {
            vehicle = track.vehicleList.pop();
            if (vehicle == vehiId)
            {
                continue;
            }
            track.vehicleList.unshift(vehicle);
        }
    }
};

function trackDeleteTrack(trackId)
{
    var findId = trackId;
    var findTrack = null;
    var track = null;
    var trackNum = GFRAME.trackList.length;
    for (var i = 0; i < trackNum; ++i)
    {
        track = GFRAME.trackList.pop();
        if (track.getId() == findId)
        {
            findTrack = track;
            continue;
        }
        GFRAME.trackList.unshift(track);
    }

    if (findTrack != null)
    {
        //删除轨迹
        var length = findTrack.trackPolyLine.length;
        var polyLine = null;
        for (var i = 0; i < length; i++)
        {
            polyLine = findTrack.trackPolyLine.pop();
            //polyline is graphic object

            //polyLine.setMap(null);
            polyLine.geometry = null;
            polyLine.symbol = null;
            GFRAME.polyLineLayer.remove(polyLine);
            //GFRAME.polyLineLayer.redraw();
            polyLine = null;
        }

        GFRAME.polyLineLayer.redraw();

        //删除车辆标记信息
        length = findTrack.vehicleList.length;
        var vehicle = null;
        for (var j = 0; j < length; j++)
        {
            vehicle = findTrack.vehicleList.pop();
            deleteVehicle(trackVehicleId(findTrack.getId(), vehicle));
        }
        //删除播放的位置的标记点信息
        trackDelPlayVehicle(findTrack);
        //删除选择的位置标记点信息
        trackDelSelectVehicle(findTrack);
        //删除对象
        findTrack = null;
    }
};

function addMarkerPoint()
{
    if (1 == GFRAME.addMarkerType)
    {
        GFRAME.resetMarker();
    } else
    {
        GFRAME.resetDrawMarker();
        GFRAME.addMarkerType = 1;
        GFRAME.showMarkerTip = true;
        document.getElementById("addPoint").src = "../google/image/addpoint_on.gif";
        GFRAME.ActiveDxmDrawTool("POINT");
    }
};

function addMarkerRectangle()
{
    if (2 == GFRAME.addMarkerType)
    {
        GFRAME.resetMarker();
    }
    else
    {
        GFRAME.resetDrawMarker();
        GFRAME.addMarkerType = 2;
        GFRAME.showMarkerTip = true;
        document.getElementById("addRectangle").src = "../google/image/addrectangle_on.gif";
        GFRAME.ActiveDxmDrawTool("RECTANGLE");
    }
};

function addMarkerPolygon()
{
    if (3 == GFRAME.addMarkerType)
    {
        GFRAME.resetMarker();
    } else
    {
        GFRAME.resetDrawMarker();
        GFRAME.addMarkerType = 3;
        GFRAME.showMarkerTip = true;
        document.getElementById("addPolygon").src = "../google/image/addpolygon_on.gif";
        GFRAME.ActiveDxmDrawTool("POLYGON");
    }
};

function addMarkerLine()
{
    if (9 == GFRAME.addMarkerType)
    {
        GFRAME.resetMarker();
    } else
    {
        GFRAME.resetDrawMarker();
        GFRAME.addMarkerType = 9;
        GFRAME.showMarkerTip = true;
        document.getElementById("addLine").src = "../google/image/addline_on.gif";
        GFRAME.ActiveDxmDrawTool("POLYLINE");
    }
}

function searchVehi()
{
    if (4 == GFRAME.addMarkerType)
    {
        GFRAME.resetMarker();
    } else
    {
        GFRAME.resetDrawMarker();
        GFRAME.addMarkerType = 4;
        GFRAME.showMarkerTip = true;
        document.getElementById("btnSearch").src = "../google/image/search_on.gif";
        GFRAME.ActiveDxmDrawTool("RECTANGLE");
    }
};

function fullScreen()
{
    try
    {
        if (isChrome)
        {
            app.sendMessage('OnMapMarker', [5, "", "", ""]);
        } else
        {
            window.external.OnMapMarker(5, "", "", "");
        }
    } catch (err)
    {
    }
};

function expand()
{
    try
    {
        if (isChrome)
        {
            app.sendMessage('OnMapMarker', [6, "", "", ""]);
        } else
        {
            window.external.OnMapMarker(6, "", "", "");
        }
    } catch (err)
    {
    }
};

function getToolElement(id)
{
    var btn = parseInt(id);
    var img = "";
    if (1 == btn)
    {
        img = "addPoint";
    } else if (2 == btn)
    {
        img = "addRectangle";
    } else if (3 == btn)
    {
        img = "addPolygon";
    } else if (4 == btn)
    {
        img = "btnSearch";
    } else if (5 == btn)
    {
        img = "btnFullScreen";
    } else if (6 == btn)
    {
        img = "btnExpand";
    } else if (7 == btn)
    {
        img = "btnCenter";
    } else if (8 == btn)
    {
        img = "selectMap";
    } else if (9 == btn)
    {
        img = "addLine";
    }
    return img;
}

function showTool(id, show)
{
    var img = getToolElement(id);
    if (parseInt(show))
    {
        document.getElementById(img).style.display = "";
    } else
    {
        document.getElementById(img).style.display = "none";
    }
}

function changeTool(id, normal)
{
    //	alert("changeTool" + id + " " +normal);
    var btn = parseInt(id);
    var status = parseInt(normal);
    if (btn == 5)
    {
        if (status)
        {
            document.getElementById("btnFullScreen").src = "../google/image/fullscreen.gif";
            document.getElementById("btnFullScreen").title = lang.fullScreen;
        } else
        {
            document.getElementById("btnFullScreen").src = "../google/image/fullscreen_exit.gif";
            document.getElementById("btnFullScreen").title = lang.fullScreenExit;
        }
    } else if (btn == 6)
    {
        if (status)
        {
            document.getElementById("btnExpand").src = "../google/image/expand.jpg";
            document.getElementById("btnExpand").title = lang.expand;
        } else
        {
            document.getElementById("btnExpand").src = "../google/image/expand_exit.jpg";
            document.getElementById("btnExpand").title = lang.expandExit;
        }
    }
};

function getCenter()
{
    try
    {
        var sp = new mapobject.maps.ScreenPoint(GFRAME.map.width / 2, GFRAME.map.height / 2);
        
        var point = GFRAME.map.toMap(sp);


        var lat = point.getLatitude();
        var lng = point.getLongitude();

        if (isChrome)
        {
            app.sendMessage('OnMapMarker', [7, lng.toFixed(6).toString(), lat.toFixed(6).toString(), GFRAME.map.getZoom().toString()]);
        }
        else
        {
            window.external.OnMapMarker(7, lng.toFixed(6).toString(), lat.toFixed(6).toString(), GFRAME.map.getZoom().toString());
        }
    }
    catch (err)
    {
    }
}

function setCenter(jingDu, weiDu, zoom, force)
{
    //设置中心点
    //GFRAME.map.setCenter(new mapobject.maps.LatLng(parseFloat(weiDu), parseFloat(jingDu)));
    GFRAME.map.setCenter(new mapobject.maps.Point(parseFloat(jingDu), parseFloat(weiDu)));
    //设置缩放级别
    var level = parseInt(zoom);
    if (parseInt(force))
    {
        GFRAME.map.setZoom(level);
    } else
    {
        if (GFRAME.map.getZoom() < level)
        {
            GFRAME.map.setZoom(level);
        }
    }
}

function switchMapTo(type)
{
    try
    {
        if (isChrome)
        {
            app.sendMessage('OnMapMarker', [8, type.toString(), "", ""]);
        }
        else
        {
            window.external.OnMapMarker(8, type.toString(), "", "");
        }
    } catch (err)
    {
    }
}
