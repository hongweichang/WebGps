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
		lat.push(latlngList[i].getLat().toFixed(6));
		lng.push(latlngList[i].getLon().toFixed(6));
	}
	return {lat:lat.toString(),lng:lng.toString()};					
}

//移动时显示车辆信息
mapframe.prototype.mapMouseMove = function(event){
	mouseCoords(event);
	var markpoint = GFRAME.map.getEventPos(event);
	if (!GFRAME.isMarkerEdit()) {
		var date = new Date();
		GFRAME.mouseMoveTime = date.getTime();
		
		if (GFRAME.vehicleList.size() <= 100) {
			
			var strHtml = "",num = 0;//个数
			GFRAME.vehicleList.each(function makeShow(vehiId, vehicle) {
				try	{
					if( num <= 10 ) {
						if (vehicle.show && vehicle.movetip) {
							var point = GFRAME.map.fromLngLatToContainerPixel(new EV.LngLat(vehicle.getJindu(), vehicle.getWeidu()));
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
				document.getElementById('tip').style.display = "";
				document.getElementById('tip').style.left = (markpoint.x + 20)+"px";
				document.getElementById('tip').style.top = (markpoint.y + 40)+"px";
				if(num>10) str = strHtml+".......";
				else str = strHtml;
				document.getElementById('tip').innerHTML = str;
			} else  {
				document.getElementById('tip').style.display = "none";
			}
		}
	} else {
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
		var point = GFRAME.map.getEventPos(event);
		var vehicle = null;
		GFRAME.vehicleList.each(function findMinDistance(vehiId, vehicle) {
			try	{
				var markpoint = GFRAME.map.fromLngLatToContainerPixel(new EV.LngLat(vehicle.getJindu(), vehicle.getWeidu()));
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
		if (mapmarker.shape == this) {
			popupMapmarker(mapmarker, event.point);
			return;
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
			if (isChrome) {
				app.sendMessage('OnMapMarker', [3, temp.lng, temp.lat, "FF0000"]);
			} else {
				window.external.OnMapMarker(3, temp.lng, temp.lat, "FF0000");
			}
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
		$("#zoomIn").attr("src", GFRAME.imagePath + "zoomin.gif");
		$("#zoomOut").attr("src", GFRAME.imagePath + "zoomout.gif");
		$("#distance").attr("src", GFRAME.imagePath + "distance.gif");
		$("#addCircle").attr("src", GFRAME.imagePath + "addcircle.gif");
		$("#addPoint").attr("src", GFRAME.imagePath + "addpoint.gif");
		$("#addRectangle").attr("src", GFRAME.imagePath + "addrectangle.gif");
		$("#addPolygon").attr("src", GFRAME.imagePath + "addpolygon.gif");
		$("#addLine").attr("src", GFRAME.imagePath + "addline.gif");
		$("#btnSearch").attr("src", GFRAME.imagePath + "search.gif");
		
		$("#btnCruise").attr("src", GFRAME.imagePath + "cruise.gif");
		$("#btnArea").attr("src", GFRAME.imagePath + "area.gif");
		$("#btnCapture").attr("src", GFRAME.imagePath + "capture.gif");

		$('#tip').hide();
		
		GFRAME.map.t_nav();
	}
};

mapframe.prototype.resetMarker = function() {
	setTimeout(function () {
		GFRAME.resetDrawMarker();
	}, 100);
};

mapframe.prototype.hideDrawTip = function() {
	document.getElementById('tip').style.display = "none";
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
		return false;
	} else {
		return true;
	}
};