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
				document.getElementById('tip').style.display = "";
				document.getElementById('tip').style.left = mousePos.x+"px";
				document.getElementById('tip').style.top = mousePos.y+"px";
				if(num>10) str = strHtml+".......";
				else str = strHtml;
				document.getElementById('tip').innerHTML = str;
			} else  {
				document.getElementById('tip').style.display = "none";
			}
		}
	} else {
		/*if (GFRAME.addMarkerType == 1) {
			document.getElementById('tip').innerHTML = lang.tipAddPoint;
		} else if (GFRAME.isMarkerRectangle()) {
		} else if (GFRAME.isMarkerPolygon()) {
			if (GFRAME.isMarkerPolygon()) {
				GFRAME.mapAddPolyMove(event);
			}
			document.getElementById('tip').innerHTML = lang.tipAddPolygon;
		}
		if (GFRAME.showMarkerTip) {
			document.getElementById('tip').style.display = "";
			document.getElementById('tip').style.left = (mousePos.x + 20)+"px";
			document.getElementById('tip').style.top = (mousePos.y - 40)+"px";
		}*/
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
		
		GFRAME.isLastClickMap = false;
		if (minDistanceVehicle != null) {
			clickVehicle(minDistanceVehicle);
			return ;
		}
		GFRAME.isLastClickMap = true;
		//如果不是点击相应的点信息，则将弹出提示关闭
		GFRAME.closeMaxPop();
	} else {
		/*
		if (GFRAME.isMarkerEdit()) {
			if (GFRAME.isMarkerPoint()) {
				//添加自定义点
				var latlng = event.point;//event.latLng;
				GFRAME.markerPoint = new NameMarker({position:latlng, map:GFRAME.map, text:name, icon:getMarkerTabImage(1)});
//				GFRAME.markerPoint = new google.maps.Marker({  
//				    position: latlng,   
//				    icon: GFRAME.imagePath + "marker/1.gif",
//				    map: GFRAME.map  
//				});
				GFRAME.hideDrawTip();
				try {
					if (isChrome) {
						app.sendMessage('OnMapMarker', [1, latlng.lng.toFixed(6).toString(), latlng.lat.toFixed(6).toString(), ""]);
					} else {
						window.external.OnMapMarker(1, latlng.lng.toFixed(6).toString(), latlng.lat.toFixed(6).toString(), "");
					}
				} catch(err) {
				}
				GFRAME.resetMarker();
			} else if (GFRAME.isMarkerPolygon()) {
				GFRAME.initMarkerPolygon();
				GFRAME.mapAddPolygon(event);
			}
		}*/
	}
};
mapframe.prototype.mapmousedown = function(event){	
	if (!GFRAME.isMarkerEdit()) {
		var nowTime = isTimeout(GFRAME.lastClickTime, 200);
		if (nowTime == null) {
			return ;
		}
		
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
		
		ClickMap(minDistanceVehicle);
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
		document.getElementById("zoomIn").src = GFRAME.imagePath + "zoomin.gif";
		document.getElementById("zoomOut").src = GFRAME.imagePath + "zoomout.gif";
		document.getElementById("distance").src = GFRAME.imagePath + "distance.gif";
		document.getElementById("addCircle").src = GFRAME.imagePath + "addcircle.gif";
		document.getElementById("addPoint").src = GFRAME.imagePath + "addpoint.gif";
		document.getElementById("addRectangle").src = GFRAME.imagePath + "addrectangle.gif";
		document.getElementById("addPolygon").src = GFRAME.imagePath + "addpolygon.gif";
		document.getElementById("addLine").src = GFRAME.imagePath + "addline.gif";
		document.getElementById("btnSearch").src = GFRAME.imagePath + "search.gif";
		document.getElementById('tip').style.display = "none";
		
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
		return true;
	} else {
		return false;
	}
};