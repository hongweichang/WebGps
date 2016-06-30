function isLoadMapSuc() {
	return GFRAME.isInitSuc;
	//return GFRAME.map != null ? true : false;
};

function insertVehicle(vehiIdno){	//添加一个车辆信息
	var vehi = new vehicle(vehiIdno); 
	GFRAME.vehicleList.put(vehiIdno, vehi);
	GFRAME.updateDefaultZoom();
};

function findVehicle(vehiIdno){	//查找车辆信息
	return GFRAME.vehicleList.get(vehiIdno);
};

function setVehiName(vehiIdno, name){	//配置车辆名称
	var vehicle = findVehicle(vehiIdno);
	if (vehicle != null){
		vehicle.setName(name);
		vehicle.setLabel(name);
	}
};

function setVehiMenu(vehiIdno, index, name, popMenu){
	var vehicle = findVehicle(vehiIdno);
	if (vehicle != null){
		var item = new menuitem(index, name, popMenu);
		vehicle.setMenuitem(index, item);
	}
};

function setVehiPopMenuName(vehiIdno, index, popindex, popname){	//配置弹出菜单信息
	var vehicle = findVehicle(vehiIdno);
	if (vehicle != null){
		var item = vehicle.getMenuitem(index);
		item.setMenuName(popindex, popname);
	}
};

function delVehiPopMenu(vehiIdno, index, begIndex){	//删除弹出菜单信息
	var vehicle = findVehicle(vehiIdno);
	if (vehicle != null){
		var item = vehicle.getMenuitem(index);
		item.delMenu(begIndex);
	}
};

function setVehiIcon(vehiIdno, icon) {
	var vehicle = findVehicle(vehiIdno);
	if (vehicle != null){
		vehicle.icon = icon;
	}
};

function isTimeout(last, interval) {
	var date = new Date();
	var nowTime = date.getTime();
	var timeout = false;
	
	if (last <= nowTime){
		if ((nowTime - last) >= interval){
			timeout = true;
			
		}
	} else {
		timeout = true;
	}
	if (timeout) {
		return nowTime;
	} else {
		return null;
	}
};

function updateVehicle(vehiIdno, jindu, weidu, huangXiangId, statusImage, speed, time, statusStr){	//更新车辆信息
	var vehicle = findVehicle(vehiIdno);
	if (vehicle != null){
		updateVehicleEx(vehicle, jindu, weidu, huangXiangId, statusImage, speed, time, statusStr);
	}
};

function updateVehicleEx(vehicle, jindu, weidu, huangXiangId, statusImage, speed, time, statusStr) {
	vehicle.setStatus(jindu, weidu, speed, time, statusStr); 
	var vehiIdno = vehicle.getIdno();
	var autoCenter = false;
	var point = new BMap.Point(vehicle.getJindu(), vehicle.getWeidu());
	var image = GFRAME.getVehicleImage(huangXiangId, statusImage, vehicle.icon);
	if (null == vehicle.popMarker){
		var vehiText = null;
		var showPop = false;
//		if (null == GFRAME.openPopMarkerVehicle && null == GFRAME.openPopMarkerShape){
//				GFRAME.openPopMarkerVehicle = vehicle.getIdno();
//				GFRAME.vehicleCenter = true;
//				vehiText = getTxtByVehicle(vehicle);
//				autoCenter = true;
//		}else{
			vehiText = vehicle.getName();
			if (false == GFRAME.popAllVehicleName){
				showPop = false;
			}
//		}
		
		var popmarker = new PopupMarker({position:point,map:GFRAME.map,icon:image,text:vehiText,id:vehiIdno,showpop:showPop});
		vehicle.popMarker = popmarker;
		var namemarker = new NameMarker({position:point,map:GFRAME.map,text:vehicle.getLabel()});
		vehicle.nameMarker = namemarker;
	}else{
		var vehiText = vehicle.getName();
		if (vehiIdno == GFRAME.openPopMarkerVehicle){
			vehiText = getTxtByVehicle(vehicle);
		}
		vehicle.popMarker.update({position:point,icon:image,text:vehiText});
		vehicle.nameMarker.update({position:point});
	}
	GFRAME.updateRegion(jindu, weidu);
	if (vehiIdno == GFRAME.openPopMarkerVehicle){
		var nowTime = isTimeout(GFRAME.parseAddressTime, 1000);
		if (nowTime) {
			parseAddress(weidu, jindu, "overVehicleAddress", vehicle.getName());
			GFRAME.parseAddressTime = nowTime;
		}
		if (GFRAME.vehicleCenter && !GFRAME.isMarkingDrawing() && !GFRAME.isMouseMoving()) {
			move2vehicle(vehicle);
		}
	}
};

function clickVehicle(vehicle) {	//单击车辆信息，则弹出窗口
	if (null != GFRAME.openPopMarkerVehicle){	
		if (GFRAME.openPopMarkerVehicle == vehicle.getIdno()){
			return ;
		}	
		hideVehiclePop();
	} else {
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

function showVehiclePop(vehicle) {
	if (vehicle.popMarker != null){
		parseAddress(vehicle.getWeidu(), vehicle.getJindu(), "overVehicleAddress", vehicle.getName());
		vehicle.popMarker.setZIndex(GFRAME.zIndex);
		GFRAME.zIndex ++;
		GFRAME.openPopMarkerVehicle = vehicle.getIdno();
		GFRAME.vehicleCenter = true;

		vehicle.popMarker.showpop = true;
		vehicle.popMarker.show();
		vehicle.popMarker.update({text:getTxtByVehicle(vehicle)});
		//} else {
		//	setTimeout('popVehicleMarkerTimer()', 100);
		//}
	}
};

function hideVehiclePop() {
	if (GFRAME.openPopMarkerVehicle != null) {
		var vehicle = findVehicle(GFRAME.openPopMarkerVehicle);
		if (vehicle != null){
			if (GFRAME.popAllVehicleName == true){
				vehicle.popMarker.update({text:vehicle.getName()});
			}else{
				setTimeout(function () {
					vehicle.popMarker.hide();
				}, 0);
			}
		}
		GFRAME.openPopMarkerVehicle = null;
		GFRAME.vehicleCenter = false;
	}
};

function selectVehicleEx(vehiIdno){	//车辆居中
	var vehicle = findVehicle(vehiIdno);
	if (vehicle != null){
		selectVehicle(vehicle, 16);
	}
};

function selectVehicleZoom(vehicle, zoom, zoomLevel){	//车辆居中，但不进行地图缩放
	if (vehicle.popMarker != null) {
		//将之前显示的车辆隐藏
		if (null != GFRAME.openPopMarkerVehicle){	
			if (GFRAME.openPopMarkerVehicle == vehicle.getIdno()){
				moveVehiCenter(vehicle, zoom, zoomLevel);
				return ;
			}
			hideVehiclePop();
		} else {
			hideMapmarkerPop();
		}
		showVehiclePop(vehicle);
		moveVehiCenter(vehicle, zoom, zoomLevel);
	}
};

function selectVehicle(vehicle, zoomLevel){	//车辆居中
	selectVehicleZoom(vehicle, true, zoomLevel);
};

function centerVehicle(vehiIdno){	//车辆居中
	var vehicle = findVehicle(vehiIdno);
	if (vehicle != null){
		moveVehiCenter(vehicle);
		GFRAME.openPopMarkerVehicle = vehicle.vehiIdno();
	} 
};

function move2vehicle(vehicle){
	move2LatLng(vehicle.getJindu(), vehicle.getWeidu());
};

function moveVehiCenter(vehicle, zoom, zoomLevel){
//	var point = new google.maps.LatLng(vehicle.getWeidu(), vehicle.getJindu());
	var point = new BMap.Point(vehicle.getJindu(), vehicle.getWeidu());
	if (typeof zoom == "undefined" || zoom) {
		var level = GFRAME.map.getZoom();
		if (typeof zoomLevel != "undefined") {
			if (parseInt(zoomLevel) > level) {
				level = parseInt(zoomLevel);
			}
		}
		GFRAME.map.centerAndZoom(point, level);
	} else {
		GFRAME.map.panTo(point);
	}
	GFRAME.map.panTo(point);
};

function move2LatLng(jindu, weidu){
	var bounds = GFRAME.map.getBounds();
	//var point = new google.maps.LatLng(weidu, jindu);
	var point = new BMap.Point(jindu, weidu);
	//if(!bounds.contains(point)){
	if(!bounds.containsPoint(point)){
		GFRAME.map.panTo(point);
	}
};

function pushTrackPoint(vehiIdno, jindu, weidu){	//加入轨迹点
	var vehicle = findVehicle(vehiIdno);
	if (vehicle != null){
		//var point = new google.maps.LatLng(weidu, jindu);
		var point = new BMap.Point(jindu, weidu);
		vehicle.trackPolyPoint.push(point);
	}
};

function drawTrackPoint(vehiIdno){	//画轨迹点
//	var point = new google.maps.LatLng(39.907001, 116.391001);
//	poly.push(point);
//	point = new google.maps.LatLng(39.807001, 116.391001);
//	poly.push(point);
	var vehicle = findVehicle(vehiIdno);
	if (vehicle != null){
		var length = vehicle.trackPolyPoint.length;
		if (length > 0){
			var poly = [];
			//length = length - 1;
			for (var i = 0; i < length; ++ i){
				point = vehicle.trackPolyPoint.pop();
				poly.push(point);
			}
			
			//var polyLine = new google.maps.Polyline({path:poly,strokeColor:"#00FF00",strokeOpacity:0.9,strokeWeight:5});    
			//polyLine.setMap(GFRAME.map);
			var polyLine = new BMap.Polyline(poly, {strokeColor:"#00FF00",strokeOpacity:0.9,strokeWeight:5});    	
			GFRAME.map.addOverlay(polyLine);
			vehicle.trackPolyLine.push(polyLine);
		}
	}
};

function deleteTrackPoint(vehiIdno){
	var vehicle = findVehicle(vehiIdno);
	if (vehicle != null){
		deleteVehiTrack(vehicle);
	}
};

function deleteVehiTrack(vehicle){
	var length = vehicle.trackPolyLine.length;
	var polyLine = null;
	for(var i=0;i<length;i++){
		polyLine = vehicle.trackPolyLine.pop();
		GFRAME.map.removeOverlay();
//	polyLine.setMap(null);
		polyLine = null;
	}
	vehicle.trackLastPoint = null;
};

function deleteVehicle(vehiIdno){	//删除车辆信息
	var findVehi = GFRAME.vehicleList.remove(vehiIdno);
	if (findVehi != null){
		if (findVehi.nameMarker != null){
			findVehi.nameMarker.setMap(null);
			findVehi.nameMarker = null;
		}
		if (findVehi.popMarker != null){
			findVehi.popMarker.setMap(null);
			findVehi.popMarker = null;
		}
		if (GFRAME.openPopMarkerVehicle == vehiIdno){
			GFRAME.openPopMarkerVehicle = null;
			GFRAME.vehicleCenter = false;
		}
		deleteVehiTrack(findVehi);
		findVehi = null;
	}
};

function insertMarker(markerId){	//加入一个标记
	var marker = new mapmarker(markerId); 
	GFRAME.markerList.push(marker);
};

function findMarker(markerId){	//查找标记信息
	var findId = Number(markerId);
	for (var i = 0; i < GFRAME.markerList.length; ++ i){
		if ( GFRAME.markerList[i].getId() == findId ){
			return GFRAME.markerList[i];
		}
	}
	return null;
};

function findMarkerByShape(shape){	//查找标记信息
	for (var i = 0; i < GFRAME.markerList.length; ++ i){
		if ( GFRAME.markerList[i].shape == shape ){
			return GFRAME.markerList[i];
		}
	}
	return null;
};

function getMiddleValue(minVal, maxVal) {
	return Number(minVal) + Number((Number(maxVal) - Number(minVal))/2)
};

function getMarkerTabImage(tabType) {
	//return GFRAME.imagePath + "marker/" + tabType + ".gif";
	return GFRAME.imagePath + "marker/1.gif";
};

function parseMarkerPoint(typeId, jindu, weidu) {		//解析标记点信息
	if (typeId == 1) {	//点
//		var point = new mapobject.maps.LatLng(weidu, jindu); 
		var point = new BMap.Point(jindu, weidu); 
		return {center:point,bottom:point};
	} else {
		var latList = new Array();
		var lngList = new Array();
		latList=weidu.split(",");
		lngList=jindu.split(",");
		var planCoordinates=new Array();
		var maxLat = latList[0];
		var minLat = latList[0];
		var maxLng = lngList[0];
		var minLng = lngList[0];
		
		//计算最上面和最下方的点，最左边和最右边的点
		for(var i=0;i<latList.length;i++){
			//planCoordinates.push(new mapobject.maps.LatLng(latList[i],lngList[i]));
			planCoordinates.push(new BMap.Point(lngList[i], latList[i]));
			if (Number(latList[i]) > maxLat) {
				maxLat = Number(latList[i]);
			}
			if (Number(latList[i]) < minLat) {
				minLat = Number(latList[i]);
			}
			if (Number(lngList[i]) > maxLng) {
				maxLng = Number(lngList[i]);
			}
			if (Number(lngList[i]) < minLng) {
				minLng = Number(lngList[i]);
			}
		}

		var bottomPoint;
		var centerPoint;
		var bounds = null;
		if (typeId == 2) {
//		bounds = new mapobject.maps.LatLngBounds(new mapobject.maps.LatLng(latList[0], lngList[0]), new mapobject.maps.LatLng(latList[1], lngList[1]));
			bounds = new BMap.Bounds(new BMap.Point(lngList[0], latList[0]), new BMap.Point(lngList[1], latList[1]));
			bottomPoint = bounds.getSouthWest();
			centerPoint = bounds.getCenter();
		} else if (typeId == 3) {
//			bottomPoint = new mapobject.maps.LatLng(maxLat, maxLng);
//			centerPoint = new mapobject.maps.LatLng(getMiddleValue(minLat, maxLat), getMiddleValue(minLng, maxLng));
			bottomPoint = new BMap.Point(maxLng, maxLat);
			centerPoint = new BMap.Point(getMiddleValue(minLng, maxLng), getMiddleValue(minLat, maxLat));
		} else if (typeId == 9) {
			bottomPoint = new BMap.Point(lngList[0], latList[0]);
			centerPoint = new BMap.Point(lngList[0], latList[0]);
		}
			
		return {center:centerPoint,bottom:bottomPoint,coordinates:planCoordinates,bound:bounds};
	}
};

function updateMarker(markerId, typeId, name, jindu, weidu
										, tabType, color, status) {
	var mapmarker = findMarker(markerId);
	if (mapmarker != null) {
		var posOption = parseMarkerPoint(typeId, jindu, weidu);
		mapmarker.position = posOption.center;
		mapmarker.setName(name);
		mapmarker.jindu = jindu;
		mapmarker.weidu = weidu;
		mapmarker.tabType = tabType;
		mapmarker.color = color;
		mapmarker.status = status;
		mapmarker.typeId = typeId;
		
		if (mapmarker.nameMarker == null) {
			if (typeId == 1) {
				var pt = new BMap.Point(jindu, weidu);
				var icon = new BMap.Icon(GFRAME.imagePath + "marker/1.gif", new BMap.Size(25, 25), {anchor: new BMap.Size(6, 21), imageOffset: new BMap.Size(0, 0)});
				mapmarker.shape = new BMap.Marker(pt,{icon:icon});  // 创建标注
			}else if (typeId == 2){	//Rectange
				var pStart = posOption.bound.getSouthWest();
				var pEnd = posOption.bound.getNorthEast();
				mapmarker.shape = new BMap.Polygon([
					new BMap.Point(pStart.lng, pStart.lat),
  				new BMap.Point(pEnd.lng, pStart.lat),
  				new BMap.Point(pEnd.lng, pEnd.lat),
  				new BMap.Point(pStart.lng, pEnd.lat)
					], {strokeColor:"#" + color, strokeWeight:1, strokeOpacity:1, fillColor:"#" + color, fillOpacity:0.4});
				mapmarker.bound = posOption.bound;
			} else if (typeId == 3) { //Polygon
				mapmarker.shape = new BMap.Polygon(posOption.coordinates, {
		      			strokeColor: "#" + color,   
	        			strokeOpacity: "0.8",   
	        			strokeWeight: 1,   
	        			fillColor: "#" + color,   
	        			fillOpacity: "0.35" 
			  	});
			} else if (typeId == 9) { //Polygon
				mapmarker.shape = new BMap.Polyline(posOption.coordinates, {
		      		strokeColor: "#" + color,   
	        		strokeOpacity: "0.8",   
	        		strokeWeight: 3,   
	        		fillColor: "#" + color,   
	        		fillOpacity: "0.35" 
			  });
			}
			GFRAME.map.addOverlay(mapmarker.shape);              // 将标注添加到地图中
			var nameMarker = null;
//			if (typeId == 1) {
//			nameMarker = new NameMarker({position:posOption.center,map:GFRAME.map,text:name,icon:getMarkerTabImage(tabType)});
//				nameMarker = new NameMarker({position:posOption.center,map:GFRAME.map,text:name});
//			} else {
				nameMarker = new NameMarker({position:posOption.center,map:GFRAME.map,text:name});
				mapmarker.shape.addEventListener("click", GFRAME.markerMouseClick);
//				mapmarker.listenerClick = mapobject.maps.event.addListener(mapmarker.shape,"click", GFRAME.mapMouseClick);
//				mapmarker.listenerMousemove = mapobject.maps.event.addListener(mapmarker.shape, "mousemove", GFRAME.mapMouseMove);
//				mapmarker.listenerMousedown = mapobject.maps.event.addListener(mapmarker.shape, "mousedown", GFRAME.mapMouseDown);
//				mapmarker.listenerMouseup = mapobject.maps.event.addListener(mapmarker.shape, "mouseup", GFRAME.mapMouseUp);
//			}
			mapmarker.nameMarker = nameMarker;

			var popmarker = new PopupMarker({position:posOption.center,map:GFRAME.map,text:getTxtByMarker(mapmarker),id:markerId,showpop:false});
			mapmarker.popMarker = popmarker;
		} else {
			if (typeId == 1) {
				mapmarker.nameMarker.update({position:mapmarker.position,text:mapmarker.name});
				mapmarker.shape.setPosition(mapmarker.position);
			} else {
				if (typeId == 2) {
					var pStart = posOption.bound.getSouthWest();
					var pEnd = posOption.bound.getNorthEast();
					var path = [];
					path.push(new BMap.Point(pStart.lng, pStart.lat));
  					path.push(new BMap.Point(pEnd.lng, pStart.lat));
  					path.push(new BMap.Point(pEnd.lng, pEnd.lat));
  					path.push(new BMap.Point(pStart.lng, pEnd.lat));
					mapmarker.shape.setPath(path);//new mapobject.maps.LatLngBounds(posOption.coordinates[0],posOption.coordinates[1]));
				} else if (typeId == 3) {
					mapmarker.shape.setPath(posOption.coordinates);
				} else if (typeId == 9) {
					mapmarker.shape.setPath(posOption.coordinates);
				}
				mapmarker.nameMarker.update({position:mapmarker.position,text:mapmarker.name});
				mapmarker.popMarker.update({position:mapmarker.position,text:getTxtByMarker(mapmarker)});
			}
		}
	}
};

function showMapmarkerPop(mapmarker) {
	if (mapmarker.popMarker != null){
		mapmarker.popMarker.update({position:mapmarker.position,text:getTxtByMarker(mapmarker)});
		mapmarker.popMarker.setZIndex(GFRAME.zIndex);
		GFRAME.zIndex ++;
		mapmarker.popMarker.show();
		GFRAME.openPopMarkerShape = mapmarker.getId();
	}
};

function hideMapmarkerPop() {
	if (null != GFRAME.openPopMarkerShape){	
		var mapmarker = findMarker(GFRAME.openPopMarkerShape);
		if (mapmarker != null){
			mapmarker.popMarker.hide();
		}
		GFRAME.openPopMarkerShape = null;
	}
};

function popupMapmarker(mapmarker, position) {
	if (null != GFRAME.openPopMarkerShape){	
		if (GFRAME.openPopMarkerShape == mapmarker.getId()){
			mapmarker.popMarker.update({position:position});
			return ;
		}
		
		hideMapmarkerPop();
	} else {
		hideVehiclePop();
	}
	
	mapmarker.position = position;
	showMapmarkerPop(mapmarker);
};

function clickMarker(event) {
	var nowTime = isTimeout(GFRAME.lastClickTime, 200);
	if (nowTime == null) {
		return ;
	}
	
	var mapmarker = findMarkerByShape(this);
	if (mapmarker != null) {
		popupMapmarker(mapmarker, event.latLng);
	}
	GFRAME.lastClickTime = nowTime;
};

function selectMarker(markerId){
	var marker = findMarker(markerId);
	if (marker != null) {
		if (GFRAME.map.getZoom() < 16) {
			GFRAME.map.centerAndZoom(marker.position, 16);
		} else {
			GFRAME.map.panTo(marker.position);
		}
		//取消车辆居中
		GFRAME.vehicleCenter = false;
	}
};

function deleteMarker(markerId){
	var findId = Number(markerId);
	var findMarker = null;
	var marker = null;
	var markerNum = GFRAME.markerList.length;
	for (var i = 0; i < markerNum; ++ i){
		marker = GFRAME.markerList.pop();
		if ( marker.getId() == findId ){
			findMarker = marker;
			continue;
		}
		GFRAME.markerList.unshift(marker);
	}
	if (findMarker != null){
/*		if (mapmarker.listenerClick != null) {
			mapobject.maps.event.removeListener(findMarker.listenerClick);
			findMarker.listenerClick = null;
		}
		if (mapmarker.listenerMousemove != null) {
			mapobject.maps.event.removeListener(findMarker.listenerMousemove);
			findMarker.listenerMousemove = null;
		}
		if (mapmarker.listenerMousedown != null) {
			mapobject.maps.event.removeListener(findMarker.listenerMousedown);
			findMarker.listenerMousedown = null;
		}
		if (mapmarker.listenerMouseup != null) {
			mapobject.maps.event.removeListener(findMarker.listenerMouseup);
			findMarker.listenerMouseup = null;
		}*/
		
		if (findMarker.shape != null){
			findMarker.shape.removeEventListener("click", GFRAME.markerMouseClick);
			GFRAME.map.removeOverlay(findMarker.shape);
			//findMarker.shape.setMap(null);
			findMarker.shape = null;
		}
		
		if (findMarker.nameMarker != null){
			findMarker.nameMarker.setMap(null);
			findMarker.nameMarker = null;
		}
		
		if (findMarker.popMarker != null){
			findMarker.popMarker.setMap(null);
			findMarker.popMarker = null;
		}
		
		if (GFRAME.openPopMarkerShape == markerId){
			GFRAME.openPopMarkerShape = null;
		}
		
		findMarker = null;
	}
};

function findTracker(trackId){	//查找轨迹点对象
	for (var i = 0; i < GFRAME.trackList.length; ++ i){
		if ( GFRAME.trackList[i].getId() == trackId ){
			return GFRAME.trackList[i];
		}
	}
	
	return null;
};

function trackInsertTrack(trackId) {
	var color = null;
	for (var i = 0; i < GFRAME.trackColor.length; ++ i) {
		color = GFRAME.trackColor[i];
		var find = false;
		for (var j = 0; j < GFRAME.trackList.length; ++ j) {
			if (GFRAME.trackList[j].color == color) {
				find = true;
				break;
			}
		}
		if (!find) {
			break;
		}
	}
	
	var track = new maptrack(trackId); 
	track.color = color;
	++ GFRAME.trackZIndex;
	track.zIndex = GFRAME.trackZIndex;
	GFRAME.trackList.push(track);
};

function trackSetColor(trackId, color) {
	var track = findTracker(trackId);
	if (track != null){
		track.color = "#" + color;
	}
};

function trackPushPoint(trackId, jindu, weidu) {
	var track = findTracker(trackId);
	if (track != null){
//	var point = new google.maps.LatLng(weidu, jindu);
		var point = new BMap.Point(jindu, weidu);
		track.trackPolyPoint.push(point);
	}
};

function trackDrawPoint(trackId) {
	var track = findTracker(trackId);
	if (track != null){
		var length = track.trackPolyPoint.length;
		if (length > 1){
			var poly = [];
			var point = null;
			var lastPoint = track.trackPolyPoint[length - 1];
			for (var i = 0; i < length; ++ i){
				point = track.trackPolyPoint.pop();
				poly.push(point);
			}
			//保存最后一个点的信息
			track.trackPolyPoint.push(lastPoint);
			
			var polyLine = new BMap.Polyline(poly, {strokeColor:"#00FF00",strokeOpacity:0.9,strokeWeight:5,enableClicking:false});    	
			GFRAME.map.addOverlay(polyLine);
//		var polyLine = new google.maps.Polyline({path:poly,strokeColor:track.color,strokeOpacity:0.9,strokeWeight:5,clickable:false,zIndex:track.zIndex});    
//		polyLine.setMap(GFRAME.map);
			track.trackPolyLine.push(polyLine);
		}
	}
};

function trackVehicleId(trackId, vehiId) {
	return trackId + "-" + vehiId;
};

function trackInsertVehicle(trackId, vehiId, vehiIcon) {
	var track = findTracker(trackId);
	if (track != null){
		var trackVehiId = trackVehicleId(trackId, vehiId);
		insertVehicle(trackVehiId);
		if (typeof vehiIcon == "undefined") {
			setVehiIcon(trackVehiId, 1);	
		} else {
			setVehiIcon(trackVehiId, vehiIcon);	
		}
		track.vehicleList.push(vehiId);
	}
};

function trackDelPlayVehicle(track) {
	if (track.playVehicle != null) {
		deleteVehicle(trackVehicleId(track.getId(), track.playVehicle));
		track.playVehicle = null;
		track.playReplace = null;
	}
};

function trackUpdatePlayVehicle(track, jindu, weidu, huangXiangId, statusImage, label, statusStr, icon) {
	if (track.playVehicle == null) {
		track.playVehicle = -1;
		insertVehicle(trackVehicleId(track.getId(), track.playVehicle));
	}
	
	var vehicle = findVehicle(trackVehicleId(track.getId(), track.playVehicle));
	if (vehicle != null){
		vehicle.movetip = false;
		vehicle.name = label;
		vehicle.icon = icon;
		var vehiId = trackVehicleId(track.getId(), track.playVehicle);	
//		if (GFRAME.openPopMarkerVehicle != vehiId) {
//			hideVehiclePop();
//		}
		updateVehicleEx(vehicle
				, jindu, weidu, huangXiangId, statusImage
				, "", "", statusStr);
		//轨迹回放时，将弹出窗口放到当前播放对象中
		if (vehiId != GFRAME.openPopMarkerVehicle) {
			selectVehicleZoom(vehicle, false, GFRAME.trackZoomLevel);
		}
	}
};

function trackDelSelectVehicle(track) {
	if (track.selectVehicle != null) {
		deleteVehicle(trackVehicleId(track.getId(), track.selectVehicle));
		track.selectVehicle = null;
	}
};

function trackUpdateSelectVehicle(track, name, jindu, weidu, huangXiangId, statusImage, label, statusStr, icon) {
	if (track.selectVehicle == null) {
		track.selectVehicle = -2;
		insertVehicle(trackVehicleId(track.getId(), track.selectVehicle));
	}
	
	var vehicle = findVehicle(trackVehicleId(track.getId(), track.selectVehicle));
	if (vehicle != null){
		vehicle.movetip = false;
		vehicle.name = name;
		vehicle.lable = label;
		vehicle.icon = icon;
		updateVehicleEx(vehicle, jindu, weidu, huangXiangId, statusImage, "", "", statusStr);
		selectVehicle(vehicle, GFRAME.trackZoomLevel);
	}
};

function trackFindVehicle(track, vehiId) {
	for (var i = 0; i < track.vehicleList.length; ++ i){
		if ( track.vehicleList[i] == vehiId ){
			return track.vehicleList[i];
		}
	}
	
	return null;
};

function trackUpdateVehicle(trackId, vehiId, name, jindu, weidu, huangXiangId, statusImage, label, statusStr, show) {
	var track = findTracker(trackId);
	if (track != null){
		var trackVehicle = trackFindVehicle(track, vehiId);
		if (trackVehicle != null) {
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
			if (Number(show)) {
				vehicle.show = true;
				//播放的车辆进行删除
				trackDelPlayVehicle(track);
				//更新播放车辆
				updateVehicle(trackVehiId, jindu, weidu, huangXiangId, statusImage, "", "", statusStr);
				//轨迹回放时，将弹出窗口放到当前播放对象中
				if (trackVehiId != GFRAME.openPopMarkerVehicle) {
					selectVehicleZoom(vehicle, false);
				}
			} else {
				vehicle.show = false;
				//删除之前选中的车辆
				trackDelSelectVehicle(track);
				//更新播放位置的车辆对象
				track.playReplace = vehiId;
				var labelName = "";
				if (label != null && label != "") {
					labelName = label;
				} else {
					labelName = name;
				}
				trackUpdatePlayVehicle(track, jindu, weidu, huangXiangId, statusImage, labelName, statusStr, vehicle.icon);
			}
			//判断地图是否在区域内，如果没有，则进行居中
			//move2LatLng(jindu, weidu);
		}
	}
};

function trackSelectVehicle(trackId, vehiId) {
	var track = findTracker(trackId);
	if (track != null){
		//判断是否可以找到轨迹点信息
		var trackVehicle = trackFindVehicle(track, vehiId);
		if (trackVehicle != null) {
			var trackVehiId = trackVehicleId(trackId, vehiId);
			var vehicle = findVehicle(trackVehiId);
			//需要判断轨迹点是否显示
			if (vehicle.show) {
				//选择选中的车辆
				selectVehicle(vehicle, GFRAME.trackZoomLevel);
				//删除选择的播放点
				trackDelSelectVehicle(track);
			} else {
				//判断选择的轨迹点和播放的轨迹点是否为同一个
				if (track.playReplace == vehiId)	{
					//如果是，直接选择播放的轨迹点
					var vehicle = findVehicle(trackVehicleId(trackId, track.playVehicle));
					if (vehicle != null){
						selectVehicle(vehicle, GFRAME.trackZoomLevel);
					}
					//删除选择的播放点
					trackDelSelectVehicle(track);
				} else {
					//不是，直接更新选择的轨迹点
					trackUpdateSelectVehicle(track, vehicle.name, vehicle.jindu, vehicle.weidu, vehicle.huangXiang
						, vehicle.statusImage, vehicle.label, vehicle.statusStr, vehicle.icon);
				}
			}
		}
	}
};

function trackDeleteVehicle(trackId, vehiId) {
	var track = findTracker(trackId);
	if (track != null){
		//先删除车辆图标
		var trackVehiId = trackMarkerId(trackId, vehiId);
		deleteVehicle(trackVehiId);
		
		//删除车辆结点
		var vehicle = null;
		var num = track.vehicleList.length;
		for (var i = 0; i < num; ++ i){
			vehicle = track.vehicleList.pop();
			if ( vehicle == vehiId ){
				continue;
			}
			track.vehicleList.unshift(vehicle);
		}
	}
};

function trackDeleteTrack(trackId) {
	var findId = trackId;
	var findTrack = null;
	var track = null;
	var trackNum = GFRAME.trackList.length;
	for (var i = 0; i < trackNum; ++ i){
		track = GFRAME.trackList.pop();
		if ( track.getId() == findId ){
			findTrack = track;
			continue;
		}
		GFRAME.trackList.unshift(track);
	}
	
	if (findTrack != null){
		//删除轨迹
		var length = findTrack.trackPolyLine.length;
		var polyLine = null;
		for(var i=0;i<length;i++){
			polyLine = findTrack.trackPolyLine.pop();
			GFRAME.map.removeOverlay(polyLine);
//		polyLine.setMap(null);
			polyLine = null;
		}
		
		//删除车辆标记信息
		length = findTrack.vehicleList.length;
		var vehicle = null;
		for(var j=0; j<length; j++){
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

function addMarkerPoint(){
	if (1 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 1;	
//	GFRAME.showMarkerTip = true;
		if (GFRAME.markerTool == null) {
			GFRAME.markerTool = new BMapLib.MarkerTool(GFRAME.map, {followText: lang.tipAddPoint, autoClose: true});
			//var icon = BMapLib.MarkerTool.SYS_ICONS[1];
			//var icon = new BMap.Icon("./image/marker/1.gif", new BMap.Size(32, 32), {anchor: new BMap.Size(6, 21), imageOffset: new BMap.Size(0, 0)});
			var icon = new BMap.Icon(GFRAME.imagePath + "marker/1.gif", new BMap.Size(25, 25), {anchor: new BMap.Size(6, 21), imageOffset: new BMap.Size(0, 0)});
			GFRAME.markerTool.setIcon(icon);
			GFRAME.markerTool.addEventListener("markend", drawMarkerEnd);
		}
		GFRAME.markerTool.open();
		document.getElementById("addPoint").src = GFRAME.imagePath + "addpoint_on.gif";
	}
};

function drawMarkerEnd(event){ 
	var latlng = event.marker.getPosition();
	try {
		if (isChrome) {
			app.sendMessage('OnMapMarker', [1, latlng.lng.toFixed(6).toString(), latlng.lat.toFixed(6).toString(), ""]);
		} else {
			window.external.OnMapMarker(1, latlng.lng.toFixed(6).toString(), latlng.lat.toFixed(6).toString(), "");
		}
	} catch(err) {
	}
	GFRAME.map.removeOverlay(event.marker);
	GFRAME.resetMarker();
};

function openRectangleTool() {
	if (GFRAME.rectangleTool == null) {
		GFRAME.rectangleTool = new BMapLib.RectangleZoom(GFRAME.map, {
  		followText: lang.tipAddRectangle,
  		autoClose: true
		}, drawRectangleEnd);
		GFRAME.rectangleTool.setStrokeColor("#FF0000");
		GFRAME.rectangleTool.setLineStroke(2);
		GFRAME.rectangleTool.setFillColor("#FF0000");
		GFRAME.rectangleTool.setOpacity(0.4);
	}
	GFRAME.rectangleTool.open();
};

function addMarkerRectangle(){
	if (2 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 2;	
		GFRAME.showMarkerTip = true;
		openRectangleTool();
		document.getElementById("addRectangle").src = GFRAME.imagePath + "addrectangle_on.gif";
	}
};

function drawRectangleEnd(ptStart, ptEnd){
	try {
		if (ptStart.lng != ptEnd.lng || ptStart.lat != ptEnd.lat) {
			var arrPoint = [];
			arrPoint.push(ptStart);
			arrPoint.push(ptEnd);
			var temp = getLatLngString(arrPoint);
			if (isChrome) {
				app.sendMessage('OnMapMarker', [GFRAME.addMarkerType, temp.lng, temp.lat, "FF0000"]);
			} else {
				window.external.OnMapMarker(GFRAME.addMarkerType, temp.lng, temp.lat, "FF0000");
			}
		}
	} catch(err) {
	}
	GFRAME.resetMarker();
};

function addMarkerPolygon() {
	if (3 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 3;	
//	GFRAME.showMarkerTip = true;
		if (null == GFRAME.polygonTool) {
			GFRAME.polygonTool = new BMapLib.DistanceTool(GFRAME.map, {"followText":lang.tipAddPolygon});
			GFRAME.polygonTool.addEventListener("drawend", drawPolygonEnd);
			GFRAME.polygonTool.addEventListener("addpoint", addPolygonPoint);
		}
		GFRAME.polygonTool.open();
		document.getElementById("addPolygon").src = GFRAME.imagePath + "addpolygon_on.gif";
	}
};

function addPolygonPoint(event) {
	GFRAME.markerPolyPoint.push(event.point);
};

function drawPolygonEnd(event) {
	try {
		if (event.points.length > 2) {
			var temp = getLatLngString(event.points);
			if (isChrome) {
				app.sendMessage('OnMapMarker', [GFRAME.addMarkerType, temp.lng, temp.lat, "FF0000"]);
			} else {
				window.external.OnMapMarker(GFRAME.addMarkerType, temp.lng, temp.lat, "FF0000");
			}
		}
	} catch(err) {
	}

	GFRAME.polygonTool._clearCurData();
	GFRAME.resetMarker();
};

function addMarkerLine() {
	if (9 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 9;	
	//	GFRAME.showMarkerTip = true;
		if (null == GFRAME.polygonTool) {
			GFRAME.polygonTool = new BMapLib.DistanceTool(GFRAME.map, {"followText":lang.tipAddLine});
			GFRAME.polygonTool.addEventListener("drawend", drawPolygonEnd);
			GFRAME.polygonTool.addEventListener("addpoint", addPolygonPoint);
		}
		GFRAME.polygonTool.open();
		document.getElementById("addLine").src = GFRAME.imagePath + "addline_on.gif";
	}
};

function searchVehi() {
	if (4 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 4;	
		openRectangleTool();
//		GFRAME.showMarkerTip = true;
		document.getElementById("btnSearch").src = GFRAME.imagePath + "search_on.gif";
	}
};

function fullScreen() {
	try {
		if (isChrome) {
			app.sendMessage('OnMapMarker', [5, "", "", ""]);
		} else {
			window.external.OnMapMarker(5, "", "", "");
		}
	} catch(err) {
	}
};

function expand() {
	try {
		if (isChrome) {
			app.sendMessage('OnMapMarker', [6, "", "", ""]);
		} else {
			window.external.OnMapMarker(6, "", "", "");
		}
	} catch(err) {
	}
};

function getToolElement(id) {
	var btn = parseInt(id);	
	var img = "";
	if (1 == btn) {
		img = "addPoint";
	} else if (2 == btn) {
		img = "addRectangle";
	} else if (3 == btn) {
		img = "addPolygon";
	} else if (4 == btn) {
		img = "btnSearch";
	} else if (5 == btn) {
		img = "btnFullScreen";
	} else if (6 == btn) {
		img = "btnExpand";
	} else if (7 == btn) {
		img = "btnCenter";
	} else if (8 == btn) {
		img = "selectMap";
	} else if (9 == btn) {
		img = "addLine";
	}
	return img;
}

function showTool(id, show) {
	var img = getToolElement(id);
	if (parseInt(show)) {
		document.getElementById(img).style.display = "";
	} else {
		document.getElementById(img).style.display = "none";
	}
}

function changeTool(id, normal) {
	var btn = parseInt(id);
	var status = parseInt(normal);
	if (btn == 5) {
		if (status) {
			document.getElementById("btnFullScreen").src = GFRAME.imagePath + "fullscreen.gif";
			document.getElementById("btnFullScreen").title = lang.fullScreen;
		} else {
			document.getElementById("btnFullScreen").src = GFRAME.imagePath + "fullscreen_exit.gif";
			document.getElementById("btnFullScreen").title = lang.fullScreenExit;
		}
	} else if (btn == 6) {
		if (status) {
			document.getElementById("btnExpand").src = GFRAME.imagePath + "expand.jpg";
			document.getElementById("btnExpand").title = lang.expand;
		} else {
			document.getElementById("btnExpand").src = GFRAME.imagePath + "expand_exit.jpg";
			document.getElementById("btnExpand").title = lang.expandExit;
		}
	}
};

function getCenter() {
	try {
		var point = GFRAME.map.getCenter();
		if (isChrome) {
			app.sendMessage('OnMapMarker', [7, point.lng().toFixed(6).toString(), point.lat().toFixed(6).toString(), GFRAME.map.getZoom().toString()]);
		} else {
			window.external.OnMapMarker(7, point.lng().toFixed(6).toString(), point.lat().toFixed(6).toString(), GFRAME.map.getZoom().toString());
		}
	} catch(err) {
	}
}

function setCenter(jingDu, weiDu, zoom, force) {
	//设置中心点
	var point = new BMap.Point(parseFloat(jingDu), parseFloat(weiDu));
	//设置缩放级别
	var level = parseInt(zoom);
	if (parseInt(force)) {
			GFRAME.map.centerAndZoom(point, level);
	} else {
		if (GFRAME.map.getZoom() < level) {
				GFRAME.map.centerAndZoom(point, level);
		} else {
				GFRAME.map.setCenter(point);
		}
	}
}

function switchMapTo(type) {
	try {
		if (isChrome) {
			app.sendMessage('OnMapMarker', [8, type.toString(), "", ""]);
		} else {
			window.external.OnMapMarker(8, type.toString(), "", "");
		}
	} catch(err) {
	}
}