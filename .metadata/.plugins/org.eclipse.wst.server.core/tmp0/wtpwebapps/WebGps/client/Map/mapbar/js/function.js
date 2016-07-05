function isLoadMapSuc() {
	return GFRAME.map != null ? true : false;
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
	var point = new EV.LngLat(vehicle.getJindu(), vehicle.getWeidu());
	var image = GFRAME.getVehicleImage(huangXiangId, statusImage, vehicle.icon);
	if (null == vehicle.popMarker){
		var vehiText = null;
		var showPop = false;
		
		vehiText = vehicle.getName();
		if (false == GFRAME.popAllVehicleName){
			showPop = false;
		}
		var popmarker = new PopupMarker({position:point,map:GFRAME.map,icon:image,text:vehiText,id:vehiIdno,showpop:showPop,label:vehicle.getLabel()});
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

function showVehiclePop(vehicle) {
	if (vehicle.popMarker != null){
		parseAddress(vehicle.getWeidu(), vehicle.getJindu(), "overVehicleAddress", vehicle.getName());
		vehicle.popMarker.setZIndex(GFRAME.zIndex);
		GFRAME.zIndex ++;
		GFRAME.openPopMarkerVehicle = vehicle.getIdno();
		GFRAME.vehicleCenter = true;

		vehicle.popMarker.showpop = true;
		vehicle.popMarker.update({text:getTxtByVehicle(vehicle)});
		vehicle.popMarker.show();
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
		//        GFRAME.openPopMarkerVehicle = vehicle.getIdno();
	} 
};

function move2vehicle(vehicle){
	move2LatLng(vehicle.getJindu(), vehicle.getWeidu());
};

function moveVehiCenter(vehicle, zoom, zoomLevel){
	var point = new EV.LngLat(vehicle.getJindu(), vehicle.getWeidu());
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
	var bounds = GFRAME.map.getLngLatBounds();
	var lnglat = new EV.LngLat(jindu, weidu);
	if(!bounds.containsLonLat(lnglat)){
		GFRAME.map.panTo(lnglat);
	}
};

function pushTrackPoint(vehiIdno, jindu, weidu){	//加入轨迹点
	var vehicle = findVehicle(vehiIdno);
	if (vehicle != null){
		var point = new EV.LngLat(jindu, weidu);
		vehicle.trackPolyPoint.push(point);
	}
};

function drawTrackPoint(vehiIdno){	//画轨迹点
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
			
			var polyLine = new EV.PolyLine(poly, {strokeColor:"#00FF00",strokeOpacity:0.9,strokeWeight:3});    	
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
		polyLine.remove();
		polyLine = null;
	}
	vehicle.trackLastPoint = null;
};

function deleteVehicle(vehiIdno){	//删除车辆信息
	var findVehi = GFRAME.vehicleList.remove(vehiIdno);
	if (findVehi != null){
		if (findVehi.nameMarker != null){
			findVehi.nameMarker.destory();
			findVehi.nameMarker = null;
		}
		if (findVehi.popMarker != null){
			findVehi.popMarker.destory();
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
		var point = new EV.LngLat(jindu, weidu); 
		return {center:point,bottom:point};
	} else {
		var latList = weidu.split(",");
		var lngList = jindu.split(",");
		var planCoordinates = new Array();
		
		//计算最上面和最下方的点，最左边和最右边的点
		for(var i=0;i<latList.length;i++){
			planCoordinates.push(new EV.LngLat(lngList[i], latList[i]));
		}
		var bounds = new EV.LngLatBounds(planCoordinates);
		var topPoint = bounds.getWN();	//返回此范围西北角点
		var bottomPoint = bounds.getES();	//返回此范围东南角点
		var centerPoint = new EV.LngLat(getMiddleValue(topPoint.getLon(), bottomPoint.getLon()), getMiddleValue(topPoint.getLat(), bottomPoint.getLat()));
		if (typeId == 2) {	//矩形
		} else if (typeId == 3) {	//多边形
		} else if (typeId == 9 || typeId == 10) {	//线路或者圆
			bottomPoint = new EV.LngLat(lngList[0], latList[0]);
			centerPoint = new EV.LngLat(lngList[0], latList[0]);
		} 
		
		return {center:centerPoint,bottom:bottomPoint,coordinates:planCoordinates,bound:bounds};
	}
};

function updateMarker(markerId, typeId, name, jindu, weidu
										, tabType, color, status, param) {
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

		if (mapmarker.shape != null) 
		{
			mapmarker.shape.removeEventListener("click", GFRAME.markerMouseClick);
			mapmarker.shape.remove();	
			mapmarker.shape = null;
		}
		if (typeId == 1) {
			var lnglat = new EV.LngLat(jindu, weidu);
			var shape = new EV.Marker(lnglat, {
				externalGraphic: GFRAME.imagePath + "marker/1.gif",	 
				graphicWidth: 25,
				graphicHeight: 25,
				//graphicYOffset: -19,
				//   pointRadius: 20,
		    graphicName: "star",
				// rotation : 45,  //ie7下不支持
				label : this.label_,
				fontColor : "#0000ff",
				fontSize : "12px",
				fontFamily : "Courier New, monospace",
				fontWeight : "bold",
				labelXOffset : 20,
				labelYOffset : 6,
				labelOutlineColor : "white",
				labelOutlineWidth :2
			 });
			//this.marker_.addEventListener("click",function(e){
			//   this.showPopup();
		  // });
			mapmarker.shape = shape;  // 创建标注
		}else if (typeId == 2){	//Rectange
			mapmarker.shape = new EV.Rect(posOption.bound, {
				strokeWidth:1,
				strokeColor: "#" + color,
				fillColor: "#" + color,
				fillOpacity:0.5
				});
			mapmarker.bound = posOption.bound;
		} else if (typeId == 3) { //Polygon
			mapmarker.shape = new EV.Polygon(posOption.coordinates, {
				strokeWidth:1,
				strokeColor: "#" + color,
				fillColor: "#" + color,
				fillOpacity:0.5
				});
		} else if (typeId == 9) { //Line
			mapmarker.shape = new EV.PolyLine(posOption.coordinates, {
				strokeWidth:3,
				strokeColor: "#" + color
				});
		} else if (typeId == 10) { //Circel
			mapmarker.shape = new EV.Circle(new EV.LngLat(jindu, weidu), parseInt(param, 10), {
				strokeColor: "#" + color,
				fillColor: "#" + color,
				fillOpacity:0.5
				});
		}
		GFRAME.map.addOverlay(mapmarker.shape);              // 将标注添加到地图中
		mapmarker.shape.name = name;
		mapmarker.shape.setLabel(name);
		mapmarker.shape.setPopupContent(getTxtByMarker(mapmarker));
		mapmarker.shape.addEventListener("click", GFRAME.markerMouseClick);
	}
};

function showMapmarkerPop(mapmarker) {
	if (mapmarker.shape != null){
		mapmarker.shape.setPopupContent(getTxtByMarker(mapmarker));
		//mapmarker.popMarker.setZIndex(GFRAME.zIndex);
		GFRAME.zIndex ++;
		mapmarker.shape.showPopup();
		mapmarker.shape.popup.closecallback = doClosePopupMarker;
		GFRAME.openPopMarkerShape = mapmarker.getId();
	}
};

function hideMapmarkerPop() {
	if (null != GFRAME.openPopMarkerShape){	
		var mapmarker = findMarker(GFRAME.openPopMarkerShape);
		if (mapmarker != null){
			mapmarker.shape.closeInfoWindow();
		}
		GFRAME.openPopMarkerShape = null;
	}
};

function popupMapmarker(mapmarker, position) {
	if (null != GFRAME.openPopMarkerShape){	
		if (GFRAME.openPopMarkerShape == mapmarker.getId()){
			return ;
		}
		
		hideMapmarkerPop();
	} else {
		hideVehiclePop();
	}
	
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
		if (findMarker.shape != null){
			findMarker.shape.removeEventListener("click", GFRAME.markerMouseClick);
			findMarker.shape.remove();
			findMarker.shape = null;
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
		var point = new EV.LngLat(jindu, weidu);
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
			var polyLine = new EV.PolyLine(poly, {strokeColor:track.color,strokeOpacity:0.9,strokeWeight:3}); 
			GFRAME.map.addOverlay(polyLine);
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

function onCruise() {
	if (14 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 14;
		GFRAME.map.t_nav();
		$("#btnCruise").attr("src", GFRAME.imagePath + "cruise_on.gif");
	}
}

function onCountry() {
	GFRAME.resetMarker();
	GFRAME.map.t_global();
}

function onZoomIn() {
	if (12 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 12;
		GFRAME.map.t_zoomin();
		$("#zoomIn").attr("src", GFRAME.imagePath + "zoomin_on.gif");
	}
};

function onZoomOut() {
	if (13 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 13;
		GFRAME.map.t_zoomout();
		$("#zoomOut").attr("src", GFRAME.imagePath + "zoomout_on.gif");
	}
}

function onDistance() {
	if (11 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 11;
		GFRAME.map.t_mlength();
		$("#distance").attr("src", GFRAME.imagePath + "distance_on.gif");
	}
};

function onArea() {
	if (16 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 16;
		GFRAME.map.t_marea();
		$("#btnArea").attr("src", GFRAME.imagePath + "area_on.gif");
	}
}

function addMarkerPoint(){
	if (1 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 1;
		GFRAME.map.t_addpoint();
		$("#addPoint").attr("src", GFRAME.imagePath + "addpoint_on.gif");
	}
};

function drawMarkerEnd(event){ 
	var lnglat = event.overlay.lonlat;
	try {
		if (isChrome) {
			app.sendMessage('OnMapMarker', [1, lnglat.getLon().toFixed(6).toString(), lnglat.getLat().toFixed(6).toString(), ""]);
		} else {
			window.external.OnMapMarker(1, lnglat.getLon().toFixed(6).toString(), lnglat.getLat().toFixed(6).toString(), "");
		}
	} catch(err) {
	}
	GFRAME.resetMarker();
	return false;
};

function addMarkerCircle() {
	if (10 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 10;
		GFRAME.map.t_addcircle();
		$("#addCircle").attr("src", GFRAME.imagePath + "addcircle_on.gif");
	}
}

function drawCircleEnd(event) {
	var lnglat = event.overlay.center;
	try {
		if (isChrome) {
			app.sendMessage('OnMapMarker', [GFRAME.addMarkerType, lnglat.getLon().toFixed(6).toString(), lnglat.getLat().toFixed(6).toString(), event.overlay.radius.toString()]);
		} else {
			window.external.OnMapMarker(GFRAME.addMarkerType, lnglat.getLon().toFixed(6).toString(), lnglat.getLat().toFixed(6).toString(), event.overlay.radius.toString());
		}
	} catch(err) {
	}
	GFRAME.resetMarker();
	return false;
}

function addMarkerRectangle(){
	if (2 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 2;	
		GFRAME.map.t_addrect();
		$("#addRectangle").attr("src", GFRAME.imagePath + "addrectangle_on.gif");
	}
};

function drawRectangleEnd(event){
	try {
		var ptStart = event.overlay.bounds.getWN();
		var ptEnd = event.overlay.bounds.getES();
		if (ptStart.getLon() != ptEnd.getLon() || ptStart.getLat() != ptEnd.getLat()) {
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
	return false;
};

function addMarkerPolygon() {
	if (3 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 3;	
		GFRAME.map.t_addpoly();
		$("#addPolygon").attr("src", GFRAME.imagePath + "addpolygon_on.gif");
	}
};

function drawPolygonEnd(event) {
	try {
		var points = event.overlay.lnglats;
		if (points.length > 2) {
			var temp = getLatLngString(points);
			if (isChrome) {
				app.sendMessage('OnMapMarker', [GFRAME.addMarkerType, temp.lng, temp.lat, "FF0000"]);
			} else {
				window.external.OnMapMarker(GFRAME.addMarkerType, temp.lng, temp.lat, "FF0000");
			}
		}
	} catch(err) {
	}

	GFRAME.resetMarker();
	return false;
};

function addMarkerLine() {
	if (9 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 9;	
		GFRAME.map.t_addline();
		$("#addLine").attr("src", GFRAME.imagePath + "addline_on.gif");
	}
};

function drawLineEnd(event) {
	try {
		var points = event.overlay.lnglats;
		if (points.length > 2) {
			var temp = getLatLngString(points);
			if (isChrome) {
				app.sendMessage('OnMapMarker', [GFRAME.addMarkerType, temp.lng, temp.lat, "FF0000"]);
			} else {
				window.external.OnMapMarker(GFRAME.addMarkerType, temp.lng, temp.lat, "FF0000");
			}
		}
	} catch(err) {
	}

	GFRAME.resetMarker();
	return false;
};

function searchVehi() {
	if (4 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 4;	
		GFRAME.map.t_addrect();
		$("#btnSearch").attr("src", GFRAME.imagePath + "search_on.gif");
	}
};

function getCenter() {
	try {
		var point = GFRAME.map.getCenterPoint();
		if (isChrome) {
			app.sendMessage('OnMapMarker', [7, point.getLon().toFixed(6).toString(), point.getLat().toFixed(6).toString(), GFRAME.map.getZoom().toString()]);
		} else {
			window.external.OnMapMarker(7, point.getLon().toFixed(6).toString(), point.getLat().toFixed(6).toString(), GFRAME.map.getZoom().toString());
		}
		
	} catch(err) {
	}
}

function setCenter(jingDu, weiDu, zoom, force) {
	//设置中心点
	var point = new EV.LngLat(parseFloat(jingDu), parseFloat(weiDu));
	//设置缩放级别
	var level = parseInt(zoom);
	if (parseInt(force)) {
			GFRAME.map.setCenter(point, level);
	} else {
		if (GFRAME.map.getZoom() < level) {
				GFRAME.map.setCenter(point, level);
		} else {
				GFRAME.map.setCenter(point, GFRAME.map.getZoom());
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

function onMapPrint() {
	GFRAME.resetMarker();
	GFRAME.map.t_print();
}

function onMapCapture() {
	if (18 == GFRAME.addMarkerType) {
		GFRAME.resetMarker();
	} else {
		GFRAME.resetDrawMarker();
		GFRAME.addMarkerType = 18;	
		GFRAME.map.t_screenshot();
		//$("#btnCapture").attr("src", GFRAME.imagePath + "capture_on.gif");
	}
}

function screenShotEnd(event) {
}
