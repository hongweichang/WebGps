function pushVehicle(vehiIdno, name, jindu, weidu){//加入一个车的信息
	insertVehicle(vehiIdno);
	setVehiName(vehiIdno, name);
	setVehiMenu(vehiIdno, 0, "视频", true);
	setVehiPopMenuName(vehiIdno, 0, 0, "通道1");
	setVehiPopMenuName(vehiIdno, 0, 1, "通道2");
	setVehiPopMenuName(vehiIdno, 0, 2, "通道3");
	setVehiPopMenuName(vehiIdno, 0, 3, "通道4");
	setVehiMenu(vehiIdno, 1, "对讲", false);
	setVehiMenu(vehiIdno, 2, "更多", true);
	setVehiPopMenuName(vehiIdno, 2, 0, "车辆状态");
	setVehiPopMenuName(vehiIdno, 2, 1, "参数配置");
	setVehiPopMenuName(vehiIdno, 2, 2, "远程升级");
	alert("pushVehicle 1");
	updateVehicle(vehiIdno, jindu, weidu, 0, 0, "100KM/H", "12342", "1234424");
	alert("pushVehicle 2");
};

function pushMarker(markerId, typeId, name, jindu, weidu) {
	insertMarker(markerId);
	alert("pushMarker 3");
	updateMarker(markerId, typeId, name, jindu, weidu
										, "FF00FF", "深圳测试工程", "深圳测试工程asdfasdfsf");
	alert("pushMarker 4");
};

function isLoadMapSuc() {
	return GFRAME.map != null ? true : false;
}

function insertVehicle(vehiIdno){	//添加一个车辆信息
	var vehi = new vehicle(vehiIdno); 
	GFRAME.vehicleList.push(vehi);
	GFRAME.updateDefaultZoom();
};

function findVehicle(vehiIdno){	//查找车辆信息
	for (var i = 0; i < GFRAME.vehicleList.length; ++ i){
		if ( GFRAME.vehicleList[i].getIdno() == vehiIdno ){
			return GFRAME.vehicleList[i];
		}
	}
	return null;
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
	var point = new mapobject.maps.LatLng(weidu, jindu);
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
		var nowTime = isTimeout(GFRAME.parseAddressTime, 3000);
		if (nowTime) {
			parseAddress(weidu, jindu, "overVehicleAddress", vehicle.getName());
			GFRAME.parseAddressTime = nowTime;
		}
		
		if (GFRAME.vehicleCenter && !GFRAME.isMarkingDrawing()) {
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
	var point = new google.maps.LatLng(vehicle.getWeidu(), vehicle.getJindu());
	if (typeof zoom == "undefined" || zoom) {
		var level = 16;
		if (typeof zoomLevel != "undefined") {
			level = zoomLevel;
		}
		if (GFRAME.map.getZoom() < level) {
		 	GFRAME.map.setZoom(level);
		}
	}
	GFRAME.map.panTo(point);
};

function move2LatLng(jindu, weidu){
	var bounds = GFRAME.map.getBounds();
	var point = new google.maps.LatLng(weidu, jindu);
	if(!bounds.contains(point)){
		GFRAME.map.panTo(point);
	}
};

function pushTrackPoint(vehiIdno, jindu, weidu){	//加入轨迹点
	var vehicle = findVehicle(vehiIdno);
	if (vehicle != null){
		var point = new google.maps.LatLng(weidu, jindu);
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
			//if (vehicle.trackLastPoint != null){
			//	poly.push(vehicle.trackLastPoint);
			//}
			
			//var point = vehicle.trackPolyPoint.pop();
			//vehicle.trackLastPoint = point;
			//poly.push(point);
			
			//length = length - 1;
			for (var i = 0; i < length; ++ i){
				point = vehicle.trackPolyPoint.pop();
				poly.push(point);
			}
			
			var polyLine = new google.maps.Polyline({path:poly,strokeColor:"#00FF00",strokeOpacity:0.9,strokeWeight:5});    
			polyLine.setMap(GFRAME.map);
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
		polyLine.setMap(null);
		polyLine = null;
	}
	vehicle.trackLastPoint = null;
};

function deleteVehicle(vehiIdno){	//删除车辆信息
	//删除车辆时，更新区域信息
	GFRAME.initRegion();
	var findVehi = null;
	var vehicle = null;
	var vehiNum = GFRAME.vehicleList.length;
	for (var i = 0; i < vehiNum; ++ i){
		vehicle = GFRAME.vehicleList.pop();
		if ( vehicle.getIdno() == vehiIdno ){
			findVehi = vehicle;
			continue;
		}
		//删除车辆时更新区域信息
		GFRAME.updateRegion(vehicle.getJindu(), vehicle.getWeidu());
		GFRAME.vehicleList.unshift(vehicle);
	}
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
	GFRAME.updateDefaultZoom();
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
		var point = new mapobject.maps.LatLng(weidu, jindu); 
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
			planCoordinates.push(new mapobject.maps.LatLng(latList[i],lngList[i]));
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
			bounds = getLatLngBounds(planCoordinates[0], planCoordinates[1]);//new mapobject.maps.LatLngBounds(new mapobject.maps.LatLng(latList[0], lngList[0]), new mapobject.maps.LatLng(latList[1], lngList[1]));
			bottomPoint = bounds.getSouthWest();
			centerPoint = bounds.getCenter();
		} else if (typeId == 3) {
			bottomPoint = new mapobject.maps.LatLng(maxLat, maxLng);
			centerPoint = new mapobject.maps.LatLng(getMiddleValue(minLat, maxLat), getMiddleValue(minLng, maxLng));
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
			if (typeId == 2){	//Rectange
				mapmarker.shape = new mapobject.maps.Rectangle({
			strokeColor: "#"+color,
		    strokeOpacity: "0.8",
		    strokeWeight: 1,
		      fillColor: "#"+color,
		      fillOpacity: "0.35",
		      map: GFRAME.map,
		      bounds: posOption.bound
				});
			} else if (typeId == 3) { //Polygon
				mapmarker.shape = new mapobject.maps.Polygon({
		    	path: posOption.coordinates,   
		      strokeColor: "#"+color,   
	        strokeOpacity: "0.8",   
	        strokeWeight: 1,   
	        fillColor: "#"+color,   
	        fillOpacity: "0.35",
	        map: GFRAME.map   
			  });
			}
			var nameMarker = null;
			if (typeId == 1) {
				nameMarker = new NameMarker({position:posOption.center,map:GFRAME.map,text:name,icon:getMarkerTabImage(tabType)});
			} else {
				nameMarker = new NameMarker({position:posOption.center,map:GFRAME.map,text:name});
				mapmarker.listener = mapobject.maps.event.addListener(mapmarker.shape, 'click', clickMarker);
			}
			mapmarker.nameMarker = nameMarker;

			var popmarker = new PopupMarker({position:posOption.center,map:GFRAME.map,text:getTxtByMarker(mapmarker),id:markerId,showpop:false});
			mapmarker.popMarker = popmarker;
		} else {
			if (typeId == 1) {
				mapmarker.nameMarker.update({position:mapmarker.position,icon:getMarkerTabImage(tabType),text:mapmarker.name});
			} else {
				if (typeId == 2) {
					mapmarker.shape.setBounds(posOption.bound);//new mapobject.maps.LatLngBounds(posOption.coordinates[0],posOption.coordinates[1]));
				} else if (typeId == 3) {
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
	 		GFRAME.map.setZoom(16);
		}
		GFRAME.map.panTo(marker.position);
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
		if (mapmarker.listener != null) {
			mapobject.maps.event.removeListener(findMarker.listener);
			findMarker.listener = null;
		}
		
		if (findMarker.shape != null){
			findMarker.shape.setMap(null);
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

function trackPushPoint(trackId, jindu, weidu) {
	var track = findTracker(trackId);
	if (track != null){
		var point = new google.maps.LatLng(weidu, jindu);
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
			
			var polyLine = new google.maps.Polyline({path:poly,strokeColor:track.color,strokeOpacity:0.9,strokeWeight:5,clickable:false,zIndex:track.zIndex});    
			polyLine.setMap(GFRAME.map);
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
			polyLine.setMap(null);
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
	insertMarker(1);
	updateMarker(1, 2, "test", "113.86,114.44", "22.65,23.133", 1, "FF0000", "测试");
	GFRAME.addMarkerType = 1;	
};

function addMarkerRectangle(){
	GFRAME.addMarkerType = 2;	
};

function addMarkerPolygon() {
	GFRAME.addMarkerType = 3;	
};

