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
		if (GFRAME.addMarkerType == 1) {
			document.getElementById('tip').innerHTML = lang.tipAddPoint;
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
					GFRAME.markerRectangle = new mapobject.maps.Rectangle(rectOptions);
				}
				GFRAME.markerRectBounds = GFRAME.getLatLngBounds(GFRAME.markerRectStart, event.latLng);
				//更新矩形区域的位置
				GFRAME.markerRectangle.setBounds(GFRAME.markerRectBounds);
			}
			document.getElementById('tip').innerHTML = GFRAME.getRectangleTip();
		} else if (GFRAME.isMarkerPolygon()) {
			if (GFRAME.isMarkerPolygon()) {
				GFRAME.mapAddPolyMove(event);
			}
			document.getElementById('tip').innerHTML = lang.tipAddPolygon;
		} else if (GFRAME.isMarkerLine()) {
			if (GFRAME.isMarkerLine()) {
				GFRAME.mapAddLineMove(event);
			}
			document.getElementById('tip').innerHTML = lang.tipAddLine;
		}
		if (GFRAME.showMarkerTip) {
			document.getElementById('tip').style.display = "";
			document.getElementById('tip').style.left = (mousePos.x + 20)+"px";
			document.getElementById('tip').style.top = (mousePos.y - 40)+"px";
		}
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
			if (mapmarker.typeId == 1) {
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
					if (isChrome) {
						app.sendMessage('OnMapMarker', [1, latlng.lng().toFixed(6).toString(), latlng.lat().toFixed(6).toString(), ""]);
					} else {
						window.external.OnMapMarker(1, latlng.lng().toFixed(6).toString(), latlng.lat().toFixed(6).toString(), "");
					}
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
						
						if (isChrome) {
							app.sendMessage('OnMapMarker', [GFRAME.addMarkerType, temp.lng, temp.lat, "FF0000"]);
						} else {
							window.external.OnMapMarker(GFRAME.addMarkerType, temp.lng, temp.lat, "FF0000");
						}
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
		this.markerPolygon = new mapobject.maps.Polygon(polyOptions);
		this.markerPolygon.setMap(GFRAME.map);
		this.map.setOptions({
			disableDoubleClickZoom:true //双击放大
		}); 
		//必须给polyline
		this.markerPolygonListenerAdd = mapobject.maps.event.addListener(this.markerPolygon, 'click', this.mapAddPolygon);
		this.markerPolygonListenerMove = mapobject.maps.event.addListener(this.markerPolygon, 'mousemove', this.mapAddPolyMove); 
		this.markerPolygonListenerFinish = mapobject.maps.event.addListener(this.markerPolygon, 'dblclick', this.mapAddPolyFinish); 
		this.markerPolygonListenerMapFinish = mapobject.maps.event.addListener(GFRAME.map, 'dblclick', this.mapAddPolyFinish); 
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

mapframe.prototype.initMarkerLine = function() {
	if (this.markerLine == null) {
		this.markerLine = new google.maps.Polyline({strokeColor:"#FF0000",strokeOpacity:0.8,strokeWeight:1});
		this.markerLine.setMap(GFRAME.map);
		this.map.setOptions({
			disableDoubleClickZoom:true //双击放大
		}); 
		//必须给polyline
		this.markerLineListenerAdd = mapobject.maps.event.addListener(this.markerLine, 'click', this.mapAddLine);
		this.markerLineListenerMove = mapobject.maps.event.addListener(this.markerLine, 'mousemove', this.mapAddLineMove); 
		this.markerLineListenerFinish = mapobject.maps.event.addListener(GFRAME.map, 'dblclick', this.mapAddLineFinish); 
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
			if (isChrome) {
				app.sendMessage('OnMapMarker', [9, temp.lng, temp.lat, "FF0000"]);
			} else {
				window.external.OnMapMarker(9, temp.lng, temp.lat, "FF0000");
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
			mapobject.maps.event.removeListener(GFRAME.markerPolygonListenerAdd);
			GFRAME.markerPolygonListenerAdd = null;
		}
		if (GFRAME.markerPolygonListenerMove != null) {
			mapobject.maps.event.removeListener(GFRAME.markerPolygonListenerMove);
			GFRAME.markerPolygonListenerMove = null;
		}
		if (GFRAME.markerPolygonListenerFinish != null) {
			mapobject.maps.event.removeListener(GFRAME.markerPolygonListenerFinish);
			GFRAME.markerPolygonListenerFinish = null;
		}
		if (GFRAME.markerPolygonListenerMapFinish != null) {
			mapobject.maps.event.removeListener(GFRAME.markerPolygonListenerMapFinish);
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
			mapobject.maps.event.removeListener(GFRAME.markerLineListenerAdd);
			GFRAME.markerLineListenerAdd = null;
		}
		if (GFRAME.markerLineListenerMove != null) {
			mapobject.maps.event.removeListener(GFRAME.markerLineListenerMove);
			GFRAME.markerLineListenerMove = null;
		}
		if (GFRAME.markerLineListenerFinish != null) {
			mapobject.maps.event.removeListener(GFRAME.markerLineListenerFinish);
			GFRAME.markerLineListenerFinish = null;
		}
		
		document.getElementById("addPoint").src = "./image/addpoint.gif";
		document.getElementById("addRectangle").src = "./image/addrectangle.gif";
		document.getElementById("addPolygon").src = "./image/addpolygon.gif";
		document.getElementById("addLine").src = "./image/addline.gif";
		document.getElementById("btnSearch").src = "./image/search.gif";
		document.getElementById('tip').style.display = "none";
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