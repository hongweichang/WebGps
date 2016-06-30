//使用删除地图车辆的方式
var useDeleteVehicle = true;
/**
 * 计算两点之间的距离
 * @param latlng
 * @returns
 */
google.maps.LatLng.prototype.getDistance = function(latlng) {
    var lat = [this.lat(), latlng.lat()];
    var lng = [this.lng(), latlng.lng()];
    var R = 6378137;
    var dLat = (lat[1] - lat[0]) * Math.PI / 180;
    var dLng = (lng[1] - lng[0]) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat[0] * Math.PI / 180) * Math.cos(lat[1] * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return Math.round(d);
}

/**
 * 
 */
google.maps.LatLngBounds.prototype.containsBounds = function(bounds) {
	var sw = bounds.getSouthWest();
	var ne = bounds.getNorthEast();
	return this.contains(sw) && this.contains(ne);
}

/**
 * 获取一个扩展的视图范围，把上下左右都扩大一样的像素值。
 * @param {Map} map BMap.Map的实例化对象
 * @param {BMap.Bounds} bounds BMap.Bounds的实例化对象
 * @param {Number} gridSize 要扩大的像素值
 *
 * @return {BMap.Bounds} 返回扩大后的视图范围。
 */
function getExtendedBounds(map, bounds, gridSize){
	var projection = overlay.getProjection();bounds = cutBoundsInRange(bounds);
    var pixelNE = projection.fromLatLngToDivPixel(bounds.getNorthEast());
    var pixelSW = projection.fromLatLngToDivPixel(bounds.getSouthWest());
    pixelNE.x += gridSize;
    pixelNE.y -= gridSize;
    pixelSW.x -= gridSize;
    pixelSW.y += gridSize;
    var newNE = projection.fromDivPixelToLatLng(pixelNE);
    var newSW = projection.fromDivPixelToLatLng(pixelSW);
    return new google.maps.LatLngBounds(newSW, newNE);
};

/**
 * 按照百度地图支持的世界范围对bounds进行边界处理
 * @param {GMap.Bounds} bounds GMap.Bounds的实例化对象
 *
 * @return {GMap.Bounds} 返回不越界的视图范围
 */
function cutBoundsInRange(bounds) {
    var maxX = getRange(bounds.getNorthEast().lng(), -180, 180);
    var minX = getRange(bounds.getSouthWest().lng(), -180, 180);
    var maxY = getRange(bounds.getNorthEast().lat(), -74, 74);
    var minY = getRange(bounds.getSouthWest().lat(), -74, 74);
    return new google.maps.LatLngBounds(new google.maps.LatLng(minY, minX), new google.maps.LatLng(maxY, maxX));
}; 

/**
 * 对单个值进行边界处理。
 * @param {Number} i 要处理的数值
 * @param {Number} min 下边界值
 * @param {Number} max 上边界值
 * 
 * @return {Number} 返回不越界的数值
 */
function getRange(i, mix, max) {
    mix && (i = Math.max(i, mix));
    max && (i = Math.min(i, max));
    return i;
};

/**
 * 判断给定的对象是否为数组
 * @param {Object} source 要测试的对象
 *
 * @return {Boolean} 如果是数组返回true，否则返回false
 */
function isArray(source) {
    return '[object Array]' === Object.prototype.toString.call(source);
};

/**
 * 返回item在source中的索引位置
 * @param {Object} item 要测试的对象
 * @param {Array} source 数组
 *
 * @return {Number} 如果在数组内，返回索引，否则返回-1
 */
function indexOf(item, source){
    var index = -1;
    if(isArray(source)){
        if (source.indexOf) {
            index = source.indexOf(item);
        } else {
            for (var i = 0, m; m = source[i]; i++) {
                if (m === item) {
                    index = i;
                    break;
                }
            }
        }
    }        
    return index;
};

/**
 * 删除车辆标记信息
 * @param {Object} vehicle 要删除的车辆对象
 */
function deleteVehicleMarkerParam(vehicle) {
	if(vehicle.popMarker) {
		vehicle.popMarker.setMap(null);
		vehicle.popMarker = null;
	}
	if(vehicle.nameMarker) {
		vehicle.nameMarker.setMap(null);
		vehicle.nameMarker = null;
	}
	if(typeof deleteVehiTrack == 'function') {
		deleteVehiTrack(vehicle);
	}
	vehicle = null;
}

/**
 * 隐藏车辆标记信息
 * @param {Object} vehicle 要隐藏的车辆对象
 */
function hideVehicleMarkerParam(vehicle) {
	if(vehicle.popMarker) {
		vehicle.popMarker.hideMarker();
		vehicle.popMarker.isShowMarker = false;
	}
	if(vehicle.nameMarker) {
		vehicle.nameMarker.hideMarker();
		vehicle.nameMarker.isShowMarker = false;
	}
}

/**
 * MarkerClusterer
 * @class 用来解决加载大量点要素到地图上产生覆盖现象的问题，并提高性能
 * @constructor
 * @param {Map} map 地图的一个实例。
 * @param {Json Object} options 可选参数，可选项包括：<br />
 *    markers {Array<Marker>} 要聚合的标记数组<br />
 *    girdSize {Number} 聚合计算时网格的像素大小，默认60<br />
 *    maxZoom {Number} 最大的聚合级别，大于该级别就不进行相应的聚合<br />
 *    minClusterSize {Number} 最小的聚合数量，小于该数量的不能成为一个聚合，默认为2<br />
 *    isAverangeCenter {Boolean} 聚合点的落脚位置是否是所有聚合在内点的平均值，默认为否，落脚在聚合内的第一个点<br />
 *    styles {Array<IconStyle>} 自定义聚合后的图标风格，请参考TextIconOverlay类<br />
 */
function MarkerClusterer(map, options) {
	if (!map){
        return;
    }
    this._map = map;
	this._vehiIdnos = [];
    this._clusters = [];
    
    var opts = options || {};
    this._gridSize = Number(opts["gridSize"]) || 60;
    this._maxZoom =  Number(opts["maxZoom"]) || 17;
    this._minClusterSize =  Number(opts["minClusterSize"]) || 2;
    this._isAverageCenter = false;
    if (opts['isAverageCenter'] != undefined) {
        this._isAverageCenter = opts['isAverageCenter'];
    }    
    this._styles = opts["styles"] || [];
    //事件
    this.zoomendListener = null;
    this.moveendListener = null;
    //初始化点聚合事件
    this.initEventListener();
    
    var vids = opts["vehiIdnos"];
    isArray(vids) && this.addMarkers(vids);
}

/**
 * 初始化点聚合事件
 * @return 无返回值。
 */
MarkerClusterer.prototype.initEventListener = function(){
	var that = this;
	this.zoomendListener = google.maps.event.addListener(GFRAME.map, 'zoom_changed', function() {
    	that._redraw();
	});
    
	this.moveendListener = google.maps.event.addListener(GFRAME.map, "moveend",function(){
        that._moveendRedraw();
    });
};

/**
 * 去除点聚合事件
 * @return 无返回值。
 */
MarkerClusterer.prototype.removeEventListener = function(){
	if(this.zoomendListener != null) {
		google.maps.event.removeListener(this.zoomendListener);
	}
	if(this.moveendListener != null) {
		google.maps.event.removeListener(this.moveendListener);
	}
};

/**
 * 添加要聚合的标记数组。
 * @param {Array<vehiIdno>} vehiIdnos 要聚合的标记数组
 *
 * @return 无返回值。
 */
MarkerClusterer.prototype.addMarkers = function(vehiIdnos){
    for(var i = 0, len = vehiIdnos.length; i <len ; i++){
        this._pushMarkerTo(vehiIdnos[i]);
    }
    this._createClusters();   
};

/**
 * 把一个标记添加到要聚合的标记数组中
 * @param {vehiIdno} vehiIdno 要添加的标记
 *
 * @return 无返回值。
 */
MarkerClusterer.prototype._pushMarkerTo = function(vehiIdno){
	 var index = indexOf(vehiIdno, this._vehiIdnos);
     if(index === -1){
    	 var vehicle = GFRAME.vehicleList.get(vehiIdno);
    	 if(vehicle != null) {
    		 vehicle.isInCluster = false;
    	 }
    	 this._vehiIdnos.push(vehiIdno);//Marker拖放后enableDragging不做变化，忽略
     }else {
    	 this._updateRedraw(vehiIdno);
     }
};

/**
 * 添加一个聚合的标记。
 * @param {vehiIdno} vehiIdno 要聚合的单个标记。
 * @return 无返回值。
 */
MarkerClusterer.prototype.addMarker = function(vehiIdno) {
    this._pushMarkerTo(vehiIdno);
    this._createClusters();
};

/**
 * 根据所给定的标记，创建聚合点
 * @return 无返回值
 */
MarkerClusterer.prototype._createClusters = function(){
    var mapBounds = this._map.getBounds();
    var extendedBounds = getExtendedBounds(this._map, mapBounds, this._gridSize);
    for(var i = 0, vehiIdno; vehiIdno = this._vehiIdnos[i]; i++){
    	var vehicle = GFRAME.vehicleList.get(vehiIdno);
    	if(vehicle != null && !vehicle.isInCluster) {
    		var point = vehicle.getPosition();
        	var isContains = mapBounds.contains(point) || extendedBounds.contains(point);
        	if(!isContains) {
        		this.isNewCluster = true;
        	}else {
        		this.isNewCluster = false;
        	}
    		this._addToClosestCluster(vehiIdno);
    	}
    }
    for(var i = 0, cluster; cluster = this._clusters[i]; i++){
        cluster.flashAddMarkerTimer();
    }
};

/**
 * 根据标记的位置，把它添加到最近的聚合中
 * @param {vehiIdno} vehiIdno 要进行聚合的单个标记
 *
 * @return 无返回值。
 */
MarkerClusterer.prototype._addToClosestCluster = function (vehiIdno){
    var distance = 4000000;
    var clusterToAddTo = null;
    var vehicle = GFRAME.vehicleList.get(vehiIdno);
    if(this.isNewCluster) {
    	 var cluster = new Cluster(this);
         cluster.addMarker(vehiIdno);
         this._clusters.push(cluster);
         return true;
    }
    for(var i = 0, cluster; cluster = this._clusters[i]; i++){
        var center = cluster.getCenter();
        if(center){
            var d = center.getDistance(vehicle.getPosition());
            if(d < distance){
                distance = d;
                clusterToAddTo = cluster;
            }
        }
    }
    if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(vehicle)){
        clusterToAddTo.addMarker(vehiIdno);
    } else {
        var cluster = new Cluster(this);
        cluster.addMarker(vehiIdno);
        this._clusters.push(cluster);
    }    
};

/**
 * 清除上一次的聚合的结果
 * @return 无返回值。
 */
MarkerClusterer.prototype._clearLastClusters = function(){
    for(var i = 0, cluster; cluster = this._clusters[i]; i++){
        cluster.remove();
    }
    
    this._clusters = [];//置空Cluster数组
    this._removeMarkersFromCluster();//把Marker的cluster标记设为false
    if(GFRAME.useMarkerClusterer) {//如果使用点聚合
	    //清除地图上所有车辆
	    GFRAME.vehicleList.each(function(vehiIdno, findVehi) {
			if (findVehi != null){
				if(useDeleteVehicle) {
					deleteVehicleMarkerParam(findVehi);
				}else {
					hideVehicleMarkerParam(findVehi);
				}
			}
		});
	    if(useDeleteVehicle) {
	    	GFRAME.vehicleList.clear();
	    }
    }
};

/**
 * 清除聚合中的所有标记
 * @return 无返回值
 */
MarkerClusterer.prototype._removeMarkersFromCluster = function(){
    for(var i = 0, vehiIdno; vehiIdno = this._vehiIdnos[i]; i++){
    	var vehicle = GFRAME.vehicleList.get(vehiIdno);
    	if(vehicle != null) {
    		vehicle.isInCluster = false;
    	}
    }
};

/**
 * 删除单个标记
 * @param {vehiIdno} vehiIdno 需要被删除的vehiIdno
 *
 * @return {Boolean} 删除成功返回true，否则返回false
 */
MarkerClusterer.prototype._removeMarker = function(vehiIdno) {
    var index = indexOf(vehiIdno, this._vehiIdnos);
    if (index === -1) {
        return false;
    }

    this._vehiIdnos.splice(index, 1);
    //删除聚合中的标记
    var cluster = this.getMarkerCluster(vehiIdno);
    if(cluster != null) {
    	cluster._removeMarker(vehiIdno);
    	//如果聚合中的没有标记点，则删除聚合
    	if(cluster._vehiIdnos.length <= 0) {
    		cluster.remove();
    		var index_ = indexOf(cluster, this._clusters);
    		if (index != -1) {
    			this._clusters.splice(index_, 1);
    	    }
    	}else {
    		//更新聚合点
			cluster.updateClusterMarker();
    	}
    }
    return true;
};

/**
 * 返回标记所在的点聚合对象
 * @param {vehiIdno} vehiIdno 标记
 * @return {Cluster} 返回点聚合 Cluster
 */
MarkerClusterer.prototype.getMarkerCluster = function(vehiIdno) {
	for(var i = 0, cluster; cluster = this._clusters[i]; i++){
	    if(cluster.isMarkerInCluster(vehiIdno)) {
	    	return cluster;
	    }
	}
	return null;
}

/**
 * 删除单个标记
 * @param {vehiIdno} vehiIdno 需要被删除的vehiIdno
 *
 * @return {Boolean} 删除成功返回true，否则返回false
 */
MarkerClusterer.prototype.removeMarker = function(vehiIdno) {
    var success = this._removeMarker(vehiIdno);
    return success;
};
    
/**
 * 删除一组标记
 * @param {Array<vehiIdno>} vehiIdnos 需要被删除的vehiIdno数组
 *
 * @return {Boolean} 删除成功返回true，否则返回false
 */
MarkerClusterer.prototype.removeMarkers = function(vehiIdnos) {
    var success = false;
    for (var i = 0; i < vehiIdnos.length; i++) {
        var r = this._removeMarker(vehiIdnos[i]);
        success = success || r; 
    }
    
    return success;
};

/**
 * 从地图上彻底清除所有的标记
 * @return 无返回值
 */
MarkerClusterer.prototype.clearMarkers = function() {
    this._clearLastClusters();
    this._vehiIdnos = [];
};

/**
 * 重新生成，比如改变了属性等
 * @return 无返回值
 */
MarkerClusterer.prototype._redraw = function () {
	if(this._map.getZoom() > this.getMaxZoom()) {
		useDeleteVehicle = false;
	}else {
		useDeleteVehicle = true;
	}
    this._clearLastClusters();
    this._createClusters();
};

/**
 * 移动地图时，更新聚合点信息
 * @return 无返回值
 */
MarkerClusterer.prototype._moveendRedraw = function () {
	var changeCluster = [];
	var mapBounds = this._map.getBounds();
	for(var i = 0, cluster; cluster = this._clusters[i]; i++){
		//点聚合是否还在地图可视范围内
		if(!mapBounds.containsBounds(cluster._gridBounds)) {
			changeCluster.push(cluster);
		}
    }
	//如果所有点聚合都发生改变，则重新生成
    if(changeCluster.length == this._clusters.length) {
    	this._clearLastClusters();
        this._createClusters();
    }else {
    	for (var i = 0, cluster; cluster = changeCluster[i]; i++) {
    		cluster.updateClusterMarker();
		}
    }
};

/**
 * 当车辆信息发生变化时，更新聚合点信息
 * @param {vehiIdno} vehiIdno 更新的点
 * @return 无返回值
 */
MarkerClusterer.prototype._updateRedraw = function (vehiIdno) {
	//获取点所在的聚合点
	var cluster = this.getMarkerCluster(vehiIdno);
	if(cluster != null) {
		//如果地图缩放级别小于等于设置的缩放级别才跟新标记点位置
		if(!cluster.isExistIconOverlay()) {
			this._removeMarker(vehiIdno);
			if(useDeleteVehicle) {
				if(typeof parent.addVehicleToMap == 'function') {
					parent.addVehicleToMap(vehiIdno);
				}
			}else {
				this.addMarker(vehiIdno);
			}
		}else {
			var vehicle = GFRAME.vehicleList.get(vehiIdno);
			//如果不在聚合中，则删除该点
			if(vehicle != null && !cluster.isMarkerInClusterBounds(vehicle)) {
				this._removeMarker(vehiIdno);
				if(useDeleteVehicle) {
					if(typeof parent.addVehicleToMap == 'function') {
						parent.addVehicleToMap(vehiIdno);
					}
				}else {
					this.addMarker(vehiIdno);
				}
			}
		}
	}
};

/**
 * 获取网格大小
 * @return {Number} 网格大小
 */
MarkerClusterer.prototype.getGridSize = function() {
    return this._gridSize;
};

/**
 * 设置网格大小
 * @param {Number} size 网格大小
 * @return 无返回值
 */
MarkerClusterer.prototype.setGridSize = function(size) {
    this._gridSize = Number(size);
    this._redraw();
};

/**
 * 获取聚合的最大缩放级别。
 * @return {Number} 聚合的最大缩放级别。
 */
MarkerClusterer.prototype.getMaxZoom = function() {
    return this._maxZoom;       
};

/**
 * 设置聚合的最大缩放级别
 * @param {Number} maxZoom 聚合的最大缩放级别
 * @return 无返回值
 */
MarkerClusterer.prototype.setMaxZoom = function(maxZoom) {
    this._maxZoom = Number(maxZoom);
    this._redraw();
};

/**
 * 获取聚合的样式风格集合
 * @return {Array<IconStyle>} 聚合的样式风格集合
 */
MarkerClusterer.prototype.getStyles = function() {
    return this._styles;
};

/**
 * 设置聚合的样式风格集合
 * @param {Array<IconStyle>} styles 样式风格数组
 * @return 无返回值
 */
MarkerClusterer.prototype.setStyles = function(styles) {
    this._styles = styles;
    this._redraw();
};

/**
 * 获取单个聚合的最小数量。
 * @return {Number} 单个聚合的最小数量。
 */
MarkerClusterer.prototype.getMinClusterSize = function() {
    return this._minClusterSize;
};

/**
 * 设置单个聚合的最小数量。
 * @param {Number} size 单个聚合的最小数量。
 * @return 无返回值。
 */
MarkerClusterer.prototype.setMinClusterSize = function(size) {
    this._minClusterSize = Number(size);
    this._redraw();
};

/**
 * 设置聚合的最大缩放级别和单个聚合的最小数量
 * @param {Number} maxZoom 聚合的最大缩放级别
 * @param {Number} size 单个聚合的最小数量
 * @return 返回是否改变了
 */
MarkerClusterer.prototype.setClusterZoomAndSize = function(maxZoom, size) {
	if(this._maxZoom != maxZoom || this._minClusterSize != size) {
		this._maxZoom = Number(maxZoom);
		this._minClusterSize = Number(size);
	    this._redraw();
	}
};

/**
 * 获取单个聚合的落脚点是否是聚合内所有标记的平均中心。
 * @return {Boolean} true或false。
 */
MarkerClusterer.prototype.isAverageCenter = function() {
    return this._isAverageCenter;
};

/**
 * 获取聚合的Map实例。
 * @return {Map} Map的示例。
 */
MarkerClusterer.prototype.getMap = function() {
  return this._map;
};

/**
 * 获取所有的标记数组。
 * @return {Array<Marker>} 标记数组。
 */
MarkerClusterer.prototype.getMarkers = function() {
    return this._vehiIdnos;
};

/**
 * 获取聚合的总数量。
 * @return {Number} 聚合的总数量。
 */
MarkerClusterer.prototype.getClustersCount = function() {
    var count = 0;
	for(var i = 0, cluster; cluster = this._clusters[i]; i++){
        cluster.isReal() && count++;     
    }
	return count;
};

/**
 * @ignore
 * Cluster
 * @class 表示一个聚合对象，该聚合，包含有N个标记，这N个标记组成的范围，并有予以显示在Map上的TextIconOverlay等。
 * @constructor
 * @param {MarkerClusterer} markerClusterer 一个标记聚合器示例。
 */
function Cluster(markerClusterer){
    this._markerClusterer = markerClusterer;
    this._map = markerClusterer.getMap();
    this._minClusterSize = markerClusterer.getMinClusterSize();
    this._isAverageCenter = markerClusterer.isAverageCenter();
    this._center = null;//落脚位置
    this._vehiIdnos = [];//这个Cluster中所包含的markers
    this._gridBounds = null;//以中心点为准，向四边扩大gridSize个像素的范围，也即网格范围
	this._isReal = false; //真的是个聚合
	
	this.addVehiToMapList = new Array(); //需要添加到地图的标记
	this.mapVehiAddDel = new Hashtable();//车辆是否添加到地图上 1添加 否则去掉
	
    this._clusterMarker = new BMapLib.TextIconOverlay(this._map, this._center, this._vehiIdnos.length, {"styles":this._markerClusterer.getStyles()});
    //this._map.addOverlay(this._clusterMarker);
    }
   
    /**
 * 向该聚合添加一个标记。
 * @param {vehiIdno} vehiIdno 要添加的标记。
 * @return 无返回值。
 */
Cluster.prototype.addMarker = function(vehiIdno){
    if(this.isMarkerInCluster(vehiIdno)){
        return false;
    }//也可用marker.isInCluster判断,外面判断OK，这里基本不会命中
    var vehicle = GFRAME.vehicleList.get(vehiIdno);
    if (!this._center){
        this._center = vehicle.getPosition();
        this.updateGridBounds();//
    } else {
        if(this._isAverageCenter){
            var l = this._vehiIdnos.length + 1;
            var lat = (this._center.lat() * (l - 1) + vehicle.getPosition().lat()) / l;
            var lng = (this._center.lng() * (l - 1) + vehicle.getPosition().lng()) / l;
            this._center = new google.maps.LatLng(lat, lng);
            this.updateGridBounds();
        }//计算新的Center
    }

    vehicle.isInCluster = true;
    this._vehiIdnos.push(vehiIdno);
    
    var len = this._vehiIdnos.length;
    if(!this.isExistIconOverlay()){
    	this.addVehiToMapList.push(vehiIdno);
    	this.mapVehiAddDel.put(vehiIdno, 1);
//    	this.addMarkerToMap(vehicle);
//    	this.showVehiclePop();
        return true;
    } else if (len === this._minClusterSize) {
    	if(this.addMarkerTimer != null) {
        	this.addVehiToMapList = [];
        	clearTimeout(this.addMarkerTimer);
        }
        for (var i = 0; i < len; i++) {
        	this.addVehiToMapList.push(this._vehiIdnos[i]);
        	this.mapVehiAddDel.put(this._vehiIdnos[i], 0);
        }
    }
 //   this.flashAddMarkerTimer();
    this._clusterMarker.setMap(this._map);
	this._isReal = true;
    this.updateClusterMarker();
    return true;
};

/**
 * 判断一个标记是否在该聚合中。
 * @param {vehiIdno} vehiIdno 要判断的标记。
 * @return {Boolean} true或false。
 */
Cluster.prototype.isMarkerInCluster= function(vehiIdno){
    if (this._vehiIdnos.indexOf) {
        return this._vehiIdnos.indexOf(vehiIdno) != -1;
    } else {
        for (var i = 0, m; m = this._vehiIdnos[i]; i++) {
            if (m === vehiIdno) {
                return true;
            }
        }
    }
    return false;
};

/**
 * 删除单个标记
 * @param {vehiIdno} vehiIdno 需要被删除的vehiIdno
 *
 * @return {Boolean} 删除成功返回true，否则返回false
 */
Cluster.prototype._removeMarker = function(vehiIdno) {
    var index = indexOf(vehiIdno, this._vehiIdnos);
    if (index === -1) {
        return false;
    }
    this._vehiIdnos.splice(index, 1);
    if(GFRAME.useMarkerClusterer) {//如果使用点聚合
	    var vehicle = GFRAME.vehicleList.get(vehiIdno);
	    if(vehicle != null) {
	    	this.removeMarkerOnMap(vehicle);
	    }
    }
    return true;
};

/**
 * 判断一个标记是否在该聚合网格范围中。
 * @param {vehicle} vehicle 要判断的标记。
 * @return {Boolean} true或false。
 */
Cluster.prototype.isMarkerInClusterBounds = function(vehicle) {
    return this._gridBounds.contains(vehicle.getPosition());
};

Cluster.prototype.isReal = function(vehicle) {
    return this._isReal;
};

/**
 * 更新该聚合的网格范围。
 * @return 无返回值。
 */
Cluster.prototype.updateGridBounds = function() {
    var bounds = new google.maps.LatLngBounds(this._center, this._center);
    this._gridBounds = getExtendedBounds(this._map, bounds, this._markerClusterer.getGridSize());
};

/**
 * 是否存在集合点图标
 * @returns {Boolean}
 */
Cluster.prototype.isExistIconOverlay = function() {
	//如果地图缩放大于默认的缩放或者标记点少于设置的最大标记点，则不存在集合点
	if (this._map.getZoom() > this._markerClusterer.getMaxZoom() || (this._vehiIdnos && this._vehiIdnos.length < this._minClusterSize)) {
		return false;
	}
	return true;
}

/**
 * 更新该聚合的显示样式，也即TextIconOverlay。
 * @return 无返回值。
 */
Cluster.prototype.updateClusterMarker = function () {
	if (!this.isExistIconOverlay()) {
    	if(this.addMarkerTimer != null) {
        	this.addVehiToMapList = [];
        	clearTimeout(this.addMarkerTimer);
        }
    	for (var i = 0, vehiIdno; vehiIdno = this._vehiIdnos[i]; i++) {
    		this.addVehiToMapList.push(vehiIdno);
    		this.mapVehiAddDel.put(vehiIdno, 1);
        }
    	this._clusterMarker  && this._clusterMarker.setMap(null)
        this.flashAddMarkerTimer();
        return;
    }
	
    this._clusterMarker.setPosition(this._center);
    
    this._clusterMarker.setText(this._vehiIdnos.length);

    var thatMap = this._map;
    var thatBounds = this.getBounds();
    this._clusterMarker.addEventListener("click", function(event){
        thatMap.fitBounds(thatBounds);
    });
};

/**
 * 删除该聚合。
 * @return 无返回值。
 */
Cluster.prototype.remove = function(){
    //清除散的标记点
	if(this._clusterMarker) {
		this._clusterMarker.setMap(null);
	}
    this._vehiIdnos.length = 0;
    delete this._vehiIdnos;
}

/**
 * 获取该聚合所包含的所有标记的最小外接矩形的范围。
 * @return {BMap.Bounds} 计算出的范围。
 */
Cluster.prototype.getBounds = function() {
    var bounds = new google.maps.LatLngBounds(this._center,this._center);
    for (var i = 0, vehiIdno; vehiIdno = this._vehiIdnos[i]; i++) {
    	var vehicle = GFRAME.vehicleList.get(vehiIdno);
    	if(vehicle != null) {
    		bounds.extend(vehicle.getPosition());
    	}
    }
    return bounds;
};

/**
 * 获取该聚合的落脚点。
 * @return {BMap.Point} 该聚合的落脚点。
 */
Cluster.prototype.getCenter = function() {
    return this._center;
};

/**
 * 添加标记到地图的定时器
 */
Cluster.prototype.flashAddMarkerTimer = function(){
	var that = this;
    this.addMarkerTimer = setTimeout(function() {
    	that.startAddMarkerTime = new Date().getTime();
    	that.flashAddMarker();
    }, 20);
}

//添加标记到地图
Cluster.prototype.flashAddMarker= function(){
	if(this.addVehiToMapList != null && this.addVehiToMapList.length > 0) {
		var vehiIdno = this.addVehiToMapList[0];
		var vehicle = GFRAME.vehicleList.get(vehiIdno);
		var isAdd = this.mapVehiAddDel.get(vehiIdno);
		this.addVehiToMapList.splice(0, 1);
		if(isAdd == 1) {
			if(!this.isExistIconOverlay()) {
				this.addMarkerToMap(vehicle);
			}
		}else if(isAdd == 0) {
			this.removeMarkerOnMap(vehicle);
		}
		this.mapVehiAddDel.put(vehiIdno, 2);
		
		if(new Date().getTime() - this.startAddMarkerTime < 500) {
			this.flashAddMarker();
		}else {
			this.flashAddMarkerTimer();
		}
	}else {
		this.addMarkerTimer = null;
		this.showVehiclePop();
	}
}

//弹出车辆信息
Cluster.prototype.showVehiclePop = function(){
	if(!this.isExistIconOverlay()) {
		if (GFRAME.openPopMarkerVehicle != null){
			var vehicle = GFRAME.vehicleList.get(GFRAME.openPopMarkerVehicle);
			if(typeof showVehiclePop == 'function' && vehicle) {
				showVehiclePop(vehicle);
			}
		}
	}
}

/**
 * 添加一个标记到地图。
 * @param {Marker} marker 要添加的标记。
 */
Cluster.prototype.addMarkerToMap= function(vehicle){
	if(vehicle != null) {
		if(vehicle.popMarker) {
			if(useDeleteVehicle) {
				vehicle.popMarker.setMap(this._map);
			}else {
				//未初始化
				if(!vehicle.popMarker.initialize) {
					vehicle.popMarker.setMap(this._map);
				}else {
					if(!vehicle.popMarker.isShowMarker) {
						vehicle.popMarker.showIconMarker();
						vehicle.popMarker.hide();
						vehicle.popMarker.isShowMarker = true;
					}
				}
			}
		}
		if(vehicle.nameMarker) {
			if(useDeleteVehicle) {
				vehicle.nameMarker.setMap(this._map);
			}else {
				//未初始化
				if(!vehicle.nameMarker.initialize) {
					vehicle.nameMarker.setMap(this._map);
				}else {
					if(!vehicle.nameMarker.isShowMarker) {
						vehicle.nameMarker.showMarker();
						vehicle.nameMarker.isShowMarker = true;
					}
				}
			}
		}
	}
}
/**
 * 从地图删除一个标记。
 * @param {vehicle} vehicle 要删除的标记。
 */
Cluster.prototype.removeMarkerOnMap= function(vehicle){
	if(vehicle != null) {
		if(useDeleteVehicle) {
			GFRAME.vehicleList.remove(vehicle.idno);
			deleteVehicleMarkerParam(vehicle);
		}else {
			hideVehicleMarkerParam(vehicle);
		}
	}
}