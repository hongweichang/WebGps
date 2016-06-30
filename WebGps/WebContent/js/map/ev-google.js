function getLatLngBounds(latlng0, latlng2) {
	var e,w,n,s;
	latlng0.lng()>latlng2.lng() ? (e=latlng0.lng(),w=latlng2.lng()) : (e=latlng2.lng(),w=latlng0.lng());
	latlng0.lat()>latlng2.lat() ? (n=latlng0.lat(),s=latlng2.lat()) : ( n=latlng2.lat(),s=latlng0.lat());
	return new google.maps.LatLngBounds(new google.maps.LatLng(s,w),new google.maps.LatLng(n,e));    
}

function getLatLngString(latlngList) {
	var lat = new Array();
	var lng = new Array();
	for (var i = 0; i < latlngList.length; i += 1) {
		lat.push(latlngList[i].lat().toFixed(6));
		lng.push(latlngList[i].lng().toFixed(6));
	}
	return {lat:lat.toString(),lng:lng.toString()};					
}

//移动时显示车辆信息
mapframe.prototype.mapMouseMove = function(event){
	if (!GFRAME.isMarkerEdit()) {
		var latlng = event.latLng;
		var markpoint = overlay.getProjection().fromLatLngToDivPixel(latlng);
		var strHtml = "",num = 0;//个数
		for(var i=0;i<GFRAME.vehicleList.length;i++){	
			var vehicle = GFRAME.vehicleList[i];
			if (vehicle.show && vehicle.movetip) {
				var point = overlay.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(vehicle.getWeidu(),vehicle.getJindu()));
				if(point.x<(markpoint.x+15)&&point.x>(markpoint.x-15)&&point.y<(markpoint.y+25)&&point.y>(markpoint.y-25)){			
					if( num < 10 ){
						strHtml += vehicle.getName() + "<br />";
					}
					num++;
				}  
			}
		}
		
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
	} else {
		if (GFRAME.addMarkerType == 1) {
			document.getElementById('tip').innerHTML = "单击添加自定义点";
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
				GFRAME.markerRectBounds = getLatLngBounds(GFRAME.markerRectStart, event.latLng);
				//更新矩形区域的位置
				GFRAME.markerRectangle.setBounds(GFRAME.markerRectBounds);
			}
			document.getElementById('tip').innerHTML = "拉框绘制矩形";
		} else if (GFRAME.isMarkerPolygon()) {
			if (GFRAME.isMarkerPolygon()) {
				GFRAME.mapAddPolyMove(event);
			}
			document.getElementById('tip').innerHTML = "双击结束";
		}
		
		document.getElementById('tip').style.display = "";
		document.getElementById('tip').style.left = mousePos.x+"px";
		document.getElementById('tip').style.top = mousePos.y+"px";
		//
	}
};

//响应点击操作
mapframe.prototype.mapMouseClick = function(event){	
	if (!GFRAME.isMarkerEdit()) {
		var nowTime = isTimeout(GFRAME.lastClickTime, 200);
		if (nowTime == null) {
			return ;
		}
		
		var minDistanceVehicle = null;
		var minDistance = null;
		var minTemp = null;
		var latlng = event.latLng;
		var point = overlay.getProjection().fromLatLngToDivPixel(latlng);
		var vehicle = null;
		for(var i = 0;i<GFRAME.vehicleList.length;i++){
			vehicle = GFRAME.vehicleList[i];
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
		}
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
			}
		}
		
		GFRAME.lastClickTime = nowTime;
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
				try {
					window.external.OnMapMarker(1, latlng.lng().toFixed(6).toString(), latlng.lat().toFixed(6).toString(), "");
				} catch(err) {
				}
				GFRAME.resetMarker();
			} else if (GFRAME.isMarkerPolygon()) {
				GFRAME.initMarkerPolygon();
				GFRAME.mapAddPolygon(event);
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
						latlngList.push(GFRAME.markerRectBounds.getNorthEast());
						latlngList.push(GFRAME.markerRectBounds.getSouthWest());
						var temp = getLatLngString(latlngList);
						window.external.OnMapMarker(2, temp.lng, temp.lat, "FF0000");
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
	return this.addMarkerType == 2 ? true : false;
};

mapframe.prototype.isMarkerPolygon = function() {
	return this.addMarkerType == 3 ? true : false;
};

mapframe.prototype.initMarkerPolygon = function() {
	if (this.markerPolygon == null) {
		var polyOptions = {
			fillColor: "#f60",    // 填充色
		     fillOpacity: 0.3,     // 填充色透明度
		     strokeColor: "#f00",  // 线条颜色 黑色
		     strokeOpacity: 0.7,   // 透明度 70%
		     strokeWeight: 1       // 宽度 5像素
		};
		this.markerPolygon = new mapobject.maps.Polygon(polyOptions);
		this.markerPolygon.setMap(GFRAME.map);
		this.map.setOptions({
			disableDoubleClickZoom:true //双击放大
		}); 
		//必须给polyline(线)添加点击事件，否则无法画第二个点(原因：线在地图的上一层，在线上的事件无法传到地图)
		this.markerPolygonListenerAdd = mapobject.maps.event.addListener(this.markerPolygon, 'click', this.mapAddPolygon);
		this.markerPolygonListenerMove = mapobject.maps.event.addListener(this.markerPolygon, 'mousemove', this.mapAddPolyMove); 
		this.markerPolygonListenerFinish = mapobject.maps.event.addListener(this.markerPolygon, 'dblclick', this.mapAddPolyFinish); 
	}
};

mapframe.prototype.mapAddPolygon = function(event) {
	GFRAME.isDrawMarker = true;
	if (GFRAME.markerPolyPoint.length >= 9) {
		//如果车辆数目超过10个，则强制结束
		GFRAME.mapAddPolyFinish(event);
	} else {
		//添加多边形
		GFRAME.markerPolyPoint.push(event.latLng);
		//显示到地图上
		GFRAME.markerPolygon.setPath(GFRAME.markerPolyPoint);
	}
};

mapframe.prototype.mapAddPolyMove = function(event) {
	if (GFRAME.markerPolygon != null) {
		var point = new Array();
		for (var i = 0; i < GFRAME.markerPolyPoint.length; i += 1) {
			point.push(GFRAME.markerPolyPoint[i]);
		}
		point.push(event.latLng);
		GFRAME.markerPolygon.setPath(point);
	}
};

mapframe.prototype.mapAddPolyFinish = function(event) {
	if (GFRAME.markerPolyPoint.length > 2) {
		var temp = getLatLngString(GFRAME.markerPolyPoint);
		try {
			window.external.OnMapMarker(3, temp.lng, temp.lat, "FF0000");
		} catch(err) {
		}
	}
	//双击结束编辑多边形
	GFRAME.resetMarker();
};

mapframe.prototype.resetMarker = function() {
	this.addMarkerType = 0;
	this.isDrawMarker = false;
	this.map.setOptions({
		draggable:true //允许拖动地图
	});
	this.map.setOptions({
		disableDoubleClickZoom:false //双击放大
	}); 
	//自定义点
	if (this.markerPoint != null) {
		this.markerPoint.setMap(null);
		this.markerPoint = null;
	}
	//矩形
	if (this.markerRectangle != null) {
		this.markerRectangle.setMap(null);
		this.markerRectangle = null;
	}
	this.markerRectStart = null;
	this.markerRectBounds = null;	//矩形区域范围
	//多边形
	if (this.markerPolygon != null) {
		this.markerPolygon.setMap(null);
		this.markerPolygon = null;
	}
	var polyLength = this.markerPolyPoint.length;
	for (var i = 0; i < polyLength; i += 1){
		if (this.markerPolyPoint.length > 0) {
			this.markerPolyPoint.pop();
		} else {
			break;
		}
	}
	if (this.markerPolygonListenerAdd != null) {
		mapobject.maps.event.removeListener(this.markerPolygonListenerAdd);
		this.markerPolygonListenerAdd = null;
	}
	if (this.markerPolygonListenerMove != null) {
		mapobject.maps.event.removeListener(this.markerPolygonListenerMove);
		this.markerPolygonListenerMove = null;
	}
	if (this.markerPolygonListenerFinish != null) {
		mapobject.maps.event.removeListener(this.markerPolygonListenerFinish);
		this.markerPolygonListenerFinish = null;
	}
	document.getElementById('tip').style.display = "none";
};

//是否正在画地图标记信息
mapframe.prototype.isMarkingDrawing = function() {
	return this.isMarkerEdit() && this.isDrawMarker ? true : false;
};