//bound => arcgis extent
mapframe.prototype.getLatLngBounds = function (latlng0, latlng2)
{
    var mp = new esri.geometry.Multipoint(new esri.SpatialReference({ wkid: 4326 }));
    mp.addPoint(latlng0);
    mp.addPoint(latlng2);
    return new mp.getExtent();
};


function getLatLngStringFromPolygon(polygon)
{
    var ring = polygon.rings[0];
    var len = ring.length;

    var lat = new Array();
    var lng = new Array();

    var pt = null;

    for (var i = 0; i < len; i++)
    {
        pt = polygon.getPoint(0, i);
        if (pt)
        {
            lat.push(pt.getLatitude().toFixed(6));
            lng.push(pt.getLongitude().toFixed(6)); 
        }
    }

    return { lat: lat.toString(), lng: lng.toString() };
}

function getLatLngStringFromPolyline(polyline)
{
    var path = polyline.paths[0];
    var len = path.length;

    var lat = new Array();
    var lng = new Array();

    var pt = null;

    for (var i = 0; i < len; i++)
    {
        pt = polyline.getPoint(0, i);
        if (pt)
        {
            lat.push(pt.getLatitude().toFixed(6));
            lng.push(pt.getLongitude().toFixed(6));
        }
    }

    return { lat: lat.toString(), lng: lng.toString() };
}


function getLatLngString(latlngList)
{
    var lat = new Array();
    var lng = new Array();
    for (var i = 0; i < latlngList.length; i += 1)
    {
        lat.push(latlngList[i].getLatitude().toFixed(6));
        lng.push(latlngList[i].getLongitude().toFixed(6));
    }
    return { lat: lat.toString(), lng: lng.toString() };
}


//移动时显示车辆信息
mapframe.prototype.mapMouseMove = function(event)
{
    if (!GFRAME.isMarkerEdit())
    {
        var date = new Date();
        GFRAME.mouseMoveTime = date.getTime();

        if (GFRAME.vehicleList.size() <= 100)
        {
            var latlng = event.point;
            var markpoint = GFRAME.map.toScreen(latlng); //overlay.getProjection().fromLatLngToDivPixel(latlng);
            var strHtml = "", num = 0; //个数
            GFRAME.vehicleList.each(function makeShow(vehiId, vehicle)
            {
                try
                {
                    if (num <= 10)
                    {
                        if (vehicle.show && vehicle.movetip)
                        {
                            var point = GFRAME.map.ToScreen(new mapobject.geometry.Point(vehicle.getJindu(), vehicle.getWeidu()));
                            if (point.x < (markpoint.x + 15) && point.x > (markpoint.x - 15) && point.y < (markpoint.y + 25) && point.y > (markpoint.y - 25))
                            {
                                if (vehicle.getName() != "")
                                {
                                    strHtml += vehicle.getName() + "<br />";
                                    num++;
                                }
                            }
                        }
                    }
                }
                catch(e)
                { 
                }
            });

            if (num > 0)
            {
                document.getElementById('tip').style.display = "";
                document.getElementById('tip').style.left = mousePos.x + "px";
                document.getElementById('tip').style.top = mousePos.y + "px";
                if (num > 10) 
                    str = strHtml + ".......";
                else 
                    str = strHtml;
                
                document.getElementById('tip').innerHTML = str;
            } 
            else
            {
                document.getElementById('tip').style.display = "none";
            }
        }
    } 
    else
    {
        
    }
};

//响应点击操作
mapframe.prototype.mapMouseClick = function (event)
{
    if (!GFRAME.isMarkerEdit())
    {
        var nowTime = isTimeout(GFRAME.lastClickTime, 200);
        if (nowTime == null)
        {
            return;
        }

        GFRAME.lastClickTime = nowTime;

        var minDistanceVehicle = null;
        var minDistance = null;
        var minTemp = null;
        var latlng = event.point;
        var point = GFRAME.map.toScreen(latlng);
        var vehicle = null;
        GFRAME.vehicleList.each(function findMinDistance(vehiId, vehicle)
        {
            try
            {
                var markpoint = GFRAME.map.toScreen(new mapobject.geometry.Point(vehicle.getJindu(), vehicle.getWeidu()));
                if (point.x < (markpoint.x + 25) && point.x > (markpoint.x - 25) && point.y < (markpoint.y + 15) && point.y > (markpoint.y - 15))
                {
                    minTemp = Math.abs(markpoint.x - point.x) + Math.abs(markpoint.y - point.y);
                    if (null == minDistanceVehicle)
                    {
                        minDistanceVehicle = vehicle;
                        minDistance = minTemp;
                    } 
                    else
                    {
                        if (minDistance > minTemp)
                        {
                            minDistanceVehicle = vehicle;
                            minDistance = minTemp;
                        }
                    }
                }
            }
            catch(e)
            { 
            }
        });

        if (minDistanceVehicle != null)
        {
            clickVehicle(minDistanceVehicle);
            return;
        }

        //如果不是点击相应的点信息，则将弹出提示关闭
        GFRAME.closeMaxPop();
    } 
    else
    {
        
    }
};

mapframe.prototype.markerMouseClick = function(event)
{
    var nowTime = isTimeout(GFRAME.lastClickTime, 200);
    if (nowTime == null)
    {
        return;
    }

    GFRAME.lastClickTime = nowTime;
    //判断点
    var mapmarker = null;
    for (var i = 0; i < GFRAME.markerList.length; i++)
    {
        mapmarker = GFRAME.markerList[i];
        if (mapmarker.shape == event.target)
        {
            popupMapmarker(mapmarker, event.point);
            return;
        }
    }
    //如果不是点击相应的点信息，则将弹出提示关闭
    GFRAME.closeMaxPop();
};


mapframe.prototype.isMarkerEdit = function ()
{
    return this.addMarkerType != 0 ? true : false;
};

mapframe.prototype.isMarkerPoint = function ()
{
    return this.addMarkerType == 1 ? true : false;
};

mapframe.prototype.isMarkerRectangle = function ()
{
    return (this.addMarkerType == 2 || this.addMarkerType == 4) ? true : false;
};

mapframe.prototype.isMarkerPolygon = function ()
{
    return this.addMarkerType == 3 ? true : false;
};

mapframe.prototype.getRectangleTip = function ()
{
    if (this.addMarkerType == 2)
    {
        return lang.tipAddRectangle;
    } else
    {
        return lang.tipSearch;
    }
};

mapframe.prototype.initMarkerPolygon = function ()
{
    if (this.markerPolygon == null)
    {
        var polyOptions = {
            fillColor: "#FF0000",    // 填充色
            fillOpacity: 0.3,     // 填充色透明度
            strokeColor: "#FF0000",  // 线条颜色 黑色
            strokeOpacity: 0.8,   // 透明度 70%
            strokeWeight: 3       // 宽度 5像素
        };

        var polygon = new mapobject.maps.Polygon(new mapobject.SpatialReference({ wkid: 4326 }));

        var c = new mapobject.Color("#" + color);
        c.a = 0.8;

        var ls = new mapobject.symbol.SimpleFillSymbol();
        ls.setColor(c);

        this.markerPolygon = new mapobject.Graphic(polygon, ls);
        GFRAME.polyLineLayer.add(this.markerPolygon);

        //画图的时候不允许双击放大
        this.map.disableDoubleClickZoom();
        //必须给polyline
        //arcgis no event for markerPolygon
        //this.markerPolygonListenerAdd = mapobject.maps.event.addListener(this.markerPolygon, 'click', this.mapAddPolygon);
        //this.markerPolygonListenerMove = mapobject.maps.event.addListener(this.markerPolygon, 'mousemove', this.mapAddPolyMove);
        //this.markerPolygonListenerFinish = mapobject.maps.event.addListener(this.markerPolygon, 'dblclick', this.mapAddPolyFinish);
    }
};

mapframe.prototype.mapAddPolygon = function (event)
{
    if (GFRAME.showMarkerTip)
    {
        GFRAME.isDrawMarker = true;
        if (GFRAME.markerPolyPoint.length >= 64)
        {
            //如果车辆数目超过64个，则强制结束
            GFRAME.mapAddPolyFinish(event);
        } 
        else
        {
            //添加多边形
            GFRAME.markerPolyPoint.push(event.latLng);
            //显示到地图上
            //GFRAME.markerPolygon.setPath(GFRAME.markerPolyPoint);
            GFRAME.markerPolygon.geometry.removeRing(0);
            GFRAME.markerPolygon.addRing(GFRAME.markerPolyPoint);
            GFRAME.polyLineLayer.redraw();
        }
    }
};

mapframe.prototype.mapAddPolyMove = function (event)
{
    if (GFRAME.showMarkerTip)
    {
        if (GFRAME.markerPolygon != null)
        {
            var point = new Array();
            for (var i = 0; i < GFRAME.markerPolyPoint.length; i += 1)
            {
                point.push(GFRAME.markerPolyPoint[i]);
            }
            point.push(event.latLng);
            //GFRAME.markerPolygon.setPath(point);
            GFRAME.markerPolygon.geometry.removeRing(0);
            GFRAME.markerPolygon.addRing(GFRAME.markerPolyPoint);
            GFRAME.polyLineLayer.redraw();
        }
    }
};

mapframe.prototype.onAddMarkerPointFinshed = function(marker_type)
{
    if (this.markerPoint != null)
    {
        GFRAME.hideDrawTip();
        var point = this.markerPoint.geometry;
        var lng = point.getLongitude().toFixed(6);
        var lat = point.getLatitude().toFixed(6);
        try
        {
            if (isChrome)
            {
                app.sendMessage('OnMapMarker', [marker_type, lng, lat, "FF0000"]);
            }
            else
            {
                window.external.OnMapMarker(marker_type, lng, lat, "FF0000");
            }
        }
        catch (err)
        {
        }
    }
    GFRAME.resetMarker();
}

mapframe.prototype.mapAddMarkerPolygonFinish = function (marker_type)
{
    var geometry = this.markerPolygon.geometry;
    
    if (geometry == null)
    {
        GFRAME.resetMarker();
        return;
    }

    var temp = getLatLngStringFromPolygon(geometry);

    try
    {
        if (isChrome)
        {
            app.sendMessage('OnMapMarker', [marker_type, temp.lng, temp.lat, "FF0000"]);
        }
        else
        {
            window.external.OnMapMarker(marker_type, temp.lng, temp.lat, "FF0000");
        }
    }
    catch (err)
    {
    }

    GFRAME.resetMarker();
}


mapframe.prototype.mapAddMarkerPolyLineFinish = function (marker_type)
{
    if (this.markerLine == null)
    {
        GFRAME.resetMarker();
        return;
    }

    var geometry = this.markerLine.geometry;

    if (geometry == null)
    {
        GFRAME.resetMarker();
        return;
    }

    var temp = getLatLngStringFromPolyline(geometry);

    try
    {
        if (isChrome)
        {
            app.sendMessage('OnMapMarker', [marker_type, temp.lng, temp.lat, "FF0000"]);
        }
        else
        {
            window.external.OnMapMarker(marker_type, temp.lng, temp.lat, "FF0000");
        }
    }
    catch (err)
    {
    }

    GFRAME.resetMarker();
}

mapframe.prototype.mapAddPolyFinish = function (event)
{
    if (GFRAME.markerPolyPoint.length > 2)
    {
        var temp = getLatLngString(GFRAME.markerPolyPoint);
        GFRAME.hideDrawTip();
        try
        {
            if (isChrome)
            {
                app.sendMessage('OnMapMarker', [3, temp.lng, temp.lat, "FF0000"]);
            } 
            else
            {
                window.external.OnMapMarker(3, temp.lng, temp.lat, "FF0000");
            }
        } 
        catch (err)
        {
        }
    }
    //双击结束编辑多边形
    GFRAME.resetMarker();
};

mapframe.prototype.resetDrawMarker = function ()
{
    if (GFRAME.addMarkerType != 0)
    {
        GFRAME.addMarkerType = 0;
        GFRAME.isDrawMarker = false;
        //GFRAME.map.setOptions({
        //	draggable:true //允许拖动地图
        //});
        //GFRAME.map.setOptions({
        //	disableDoubleClickZoom:false //双击放大
        //}); 
        //自定义点

        if (GFRAME.markerPoint != null)
        {
            //GFRAME.markerPoint.setMap(null);
            GFRAME.drawLayer.remove(GFRAME.markerPoint);
            GFRAME.markerPoint.geomerty = null;
            GFRAME.markerPoint.symbol = null;
            GFRAME.markerPoint = null;
        }
        if (GFRAME.markerTool != null)
        {
            GFRAME.markerTool.close();
        }
        //矩形
        if (GFRAME.markerRectangle != null)
        {
            //GFRAME.markerRectangle.setMap(null);
            GFRAME.drawLayer.remove(GFRAME.markerPoint);
            GFRAME.markerRectangle.geomerty = null;
            GFRAME.markerRectangle.symbol = null;
            GFRAME.markerRectangle = null;
        }
        GFRAME.markerRectStart = null;
        GFRAME.markerRectBounds = null; //矩形区域范围
        if (GFRAME.rectangleTool != null)
        {
            GFRAME.rectangleTool.close();
        }
        
        //多边形
        if (GFRAME.markerPolygon != null)
        {
            //GFRAME.markerRectangle.setMap(null);
            GFRAME.drawLayer.remove(GFRAME.markerPolygon);
            GFRAME.markerPolygon.geomerty = null;
            GFRAME.markerPolygon.symbol = null;
            GFRAME.markerPolygon = null;
        }

        if (GFRAME.polygonTool != null)
        {
            GFRAME.polygonTool.close();
        }
        var polyLength = GFRAME.markerPolyPoint.length;
        for (var i = 0; i < polyLength; i += 1)
        {
            if (GFRAME.markerPolyPoint.length > 0)
            {
                GFRAME.markerPolyPoint.pop();
            }
            else
            {
                break;
            }
        }

        //线
        if (GFRAME.markerLine != null)
        {
            //GFRAME.markerRectangle.setMap(null);
            GFRAME.drawLayer.remove(GFRAME.markerLine);
            GFRAME.markerLine.geomerty = null;
            GFRAME.markerLine.symbol = null;
            GFRAME.markerLine = null;
        }

        document.getElementById("addPoint").src = GFRAME.imagePath + "addpoint.gif";
        document.getElementById("addRectangle").src = GFRAME.imagePath + "addrectangle.gif";
        document.getElementById("addPolygon").src = GFRAME.imagePath + "addpolygon.gif";
        document.getElementById("addLine").src = GFRAME.imagePath + "addline.gif";
        document.getElementById("btnSearch").src = GFRAME.imagePath + "search.gif";
        document.getElementById('tip').style.display = "none";

        
    }

    //保证连续点击两次工具栏按钮不再处于画图状态.
    GFRAME.drawToolBar.deactivate();
    GFRAME.map.showZoomSlider();
};

mapframe.prototype.resetMarker = function ()
{
    setTimeout(function ()
    {
        GFRAME.resetDrawMarker();
    }, 100);
};

mapframe.prototype.hideDrawTip = function ()
{
    document.getElementById('tip').style.display = "none";
    GFRAME.showMarkerTip = false;
};

//是否正在画地图标记信息
mapframe.prototype.isMarkingDrawing = function ()
{
    return this.isMarkerEdit() && this.isDrawMarker ? true : false;
};

//是否正在画地图标记信息
mapframe.prototype.isMouseMoving = function ()
{
    var nowTime = isTimeout(GFRAME.mouseMoveTime, 2000);
    if (nowTime == null)
    {
        return false;
    } 
    else
    {
        return true;
    }
};