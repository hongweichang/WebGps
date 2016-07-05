/**
 * 车辆在地图的tip处理类
 */
function monitorVehicleMapTip(){
	this.roleCls = null;  //权限类对象
	this.drowingVehiIdno = null;  //正在画区域的车辆
	this.defaultLineId = 920000000;//线路id规定为920000000+线路id
	this.defaultStationId = 930000000;//站点id规定为930000000+站点id
}

//赋值权限类对象
monitorVehicleMapTip.prototype.setRoleCls = function(roleCls) {
	if(typeof roleCls != 'undefined' && roleCls != null) {
		this.roleCls = roleCls;
	}
}

//判断车辆是否在地图可视范围内
monitorVehicleMapTip.prototype.isVehiclePtInVisibleMap = function(jingDu, weiDu){
	if(jingDu != null && weiDu != null) {
		if(typeof ttxMap != 'undefined' && ttxMap != null) {
			return ttxMap.isPtInVisibleMap(jingDu, weiDu);
		}
	}
	return false;
}

//添加车辆到地图//判断是否在地图可视范围内
//isCheckVisible 是否判断在可视地图范围内
monitorVehicleMapTip.prototype.addVehicleToMap = function(vehicle, status, isCheckVisible){
	if(typeof ttxMap != 'undefined' && ttxMap != null) {
		//如果车辆在地图可视范围内，则添加进地图
		if(!isCheckVisible || this.isVehiclePtInVisibleMap(status.mapJingDu, status.mapWeiDu)) {
			//如果地图中有车辆，则更新状态，否则添加
			if(ttxMap.findVehicle(vehicle.getIdno()) == null) {
				//插入车辆结点
				ttxMap.insertVehicle(vehicle.getIdno());
				//配置车辆名称
				ttxMap.setVehiName(vehicle.getIdno(),vehicle.getName());
				//配置车辆图标
				ttxMap.setVehiIcon(vehicle.getIdno(),vehicle.getIcon());
				//初始化地图上车辆弹出菜单
				this.initVehiPopMenu(vehicle);
			}
			//更新地图上车辆信息
			this.updateStatusInMap(vehicle.getIdno(), status);
		}else {
			if(ttxMap.findVehicle(vehicle.getIdno()) != null) {
				ttxMap.deleteVehicle(vehicle.getIdno());
			}
		}
	}
};

/**
 * 将车辆信息更新到地图上
 * vehiIdno 车牌号
 * status 状态
 */
monitorVehicleMapTip.prototype.updateStatusInMap = function(vehiIdno, status) {
	//gps有效   
	if (status.isGpsValid) {
		var mapVehicle = ttxMap.findVehicle(vehiIdno);
		if(mapVehicle != null) {
			if(mapVehicle.getTime() == null || status.gpsTime != mapVehicle.getTime()) {
				ttxMap.updateVehicle(vehiIdno, status.mapJingDu, status.mapWeiDu, status.huangXiang, status.image, status.speed, status.gpsTime, status.statusString);
			}
		}
	}
};

//移除车辆到地图
monitorVehicleMapTip.prototype.removeVehicleInMap = function(vehiIdno){
	if (typeof ttxMap != 'undefined' && ttxMap != null) {
		if(ttxMap.findVehicle(vehiIdno) != null) {
			ttxMap.deleteVehicle(vehiIdno);
		}
	}
};

//移除地图所有车辆
monitorVehicleMapTip.prototype.removeAllVehicleInMap = function(){
	if (typeof ttxMap != 'undefined' && ttxMap != null) {
		ttxMap.deleteAllVehicle();
	}
};

//在地图列表中，也将车辆居中
monitorVehicleMapTip.prototype.selectVehicle = function(vehiIdno){
	if(typeof ttxMap != 'undefined' && ttxMap != null) {
		ttxMap.selectVehicle(vehiIdno);
	}
}

//设置菜单属性
monitorVehicleMapTip.prototype.setItemParam = function(id, name, title, popId) {
	var item = {};
	item.id = id;
	item.name = name;
	item.title = title;
	item.popId = popId;
	return item;
}

//初始化地图上车辆弹出菜单
monitorVehicleMapTip.prototype.initVehiPopMenu = function(vehicle){
	//一级菜单个数
	var menuCount = 0;
	
	//配置弹出菜单
	//车辆在线
	if(vehicle.isOnline()) {
		//视频设备存在
		var videoDevice = vehicle.getVideoDevice();
		var gpsDevice = vehicle.getGpsDevice();
		if(videoDevice != null && videoDevice.isOnline()) {
			var mainMenu = [];
			//视频
			if(this.roleCls.isPermit(621)) {
				ttxMap.setVehiMenu(vehicle.getIdno(), 'video', parent.lang.video, 1, 'video');
				mainMenu.push('video');
				menuCount++;
			}
			//对讲
			if(videoDevice.isTalkbackSupport() && this.roleCls.isPermit(623)) {
				ttxMap.setVehiMenu(vehicle.getIdno(), 'talkback', parent.lang.talkback, 1, 'talkback');
				menuCount++;
			}
			//监听
			if(videoDevice.isMonitorSupport() && this.roleCls.isPermit(624)) {
				ttxMap.setVehiMenu(vehicle.getIdno(), 'listen', parent.lang.monitor, 1, 'listen');
				mainMenu.push('listen');
				menuCount++;
			}
			
			//视频通道
			var chnName = videoDevice.getChnName();
			if(chnName != null && chnName != '') {
				var chanNames = chnName.split(',');
				for (var i = 0; i < mainMenu.length; i++) {
					for(var j = 0; j < chanNames.length; j++) {
						ttxMap.setVehiPopMenuName(vehicle.getIdno(), mainMenu[i],  j, chanNames[j], 'CH'+(j+1));
					}
				}
			}else {
				for (var i = 0; i < mainMenu.length; i++) {
					ttxMap.setVehiPopMenuName(vehicle.getIdno(), mainMenu[i],  -1, 'CH1', 'CH1');
				}
			}
			
		}
		
		var chanNames = new Array();
		if(videoDevice != null && videoDevice.isOnline()) {
			//视频通道
			var chnName = videoDevice.getChnName();
			if(chnName != null && chnName != '') {
				chanNames = chnName.split(',');
			}else {
				if(vehicle.getDevList().length == 2 && gpsDevice != null && gpsDevice.isOnline()) {
					chnName = gpsDevice.getChnName();
					if(chnName != null && chnName != '') {
						chanNames = chnName.split(',');
					}
				}else {
					//抓拍
					if(this.roleCls.isPermit(625)) {
						ttxMap.setVehiMenu(vehicle.getIdno(), 'capture', parent.lang.capture, 1, 'capture');
						ttxMap.setVehiPopMenuName(vehicle.getIdno(), 'capture',  -1, "CH1", "CH1");
						menuCount++;
					}
				}
			}
		}else {
			if(gpsDevice != null && gpsDevice.isOnline()) {
				var chnName = gpsDevice.getChnName();
				if(chnName != null && chnName != '') {
					chanNames = chnName.split(',');
				}
			}
		}
		if(chanNames.length > 0) {
			//抓拍
			if(this.roleCls.isPermit(625)) {
				ttxMap.setVehiMenu(vehicle.getIdno(), 'capture', parent.lang.capture, 1, 'capture');
				for(var j = 0; j < chanNames.length; j++) {
					ttxMap.setVehiPopMenuName(vehicle.getIdno(), 'capture',  j, chanNames[j], 'CH'+(j+1));
				}
				menuCount++;
			}
		}
	}
	
	//单设备一级菜单为更多，两个设备则是一个gps设备，一个视频设备
	if(vehicle.getDevList().length == 1) {//单设备
		var mainMenu = [];
		//下发文字信息
		if(this.roleCls.isPermit(656) && vehicle.isOnline() && vehicle.devList[0].isTTSSupport()) {
			mainMenu.push(this.setItemParam(vehicle.getIdno(), 'sendMessage', parent.lang.monitor_send_TTS, 1, 'sendMessage'));
		}
		//设备信息查看 只有TTX(WKP)协议的设备才支持此功能
		if(this.roleCls.isPermit(652)  && vehicle.isOnline()  && vehicle.getDevList()[0].isCanFindInfo()) {
			mainMenu.push(this.setItemParam(vehicle.getIdno(), 'devInfo', parent.lang.monitor_deviceInfo, 1, 'devInfo'));
		}
		//参数配置
		if(this.roleCls.isPermit(651) && vehicle.isOnline() && (vehicle.getDevList()[0].isCan808ParamConfig() || vehicle.getDevList()[0].isCanTtxParamConfig())) {
			mainMenu.push(this.setItemParam(vehicle.getIdno(), 'paramConfig', parent.lang.monitor_paramConfig, 1, 'paramConfig'));
		}
		//离线升级
		if(this.roleCls.isPermit(653) && vehicle.devList[0].hasOfflineUpgrade()) {
			mainMenu.push(this.setItemParam(vehicle.getIdno(), 'upgrade', parent.lang.monitor_deviceUpgrade, 1, 'upgrade'));
			mainMenu.push(this.setItemParam(vehicle.getIdno(), 'issued', parent.lang.issuedFile, 1, 'issued'));
		}
		//胎压监测
		if(this.roleCls.isPermit(656) && vehicle.isOnline() && vehicle.devList[0].hasTpms()){
			mainMenu.push(this.setItemParam(vehicle.getIdno(), 'tpms', 'TPMS', 1, 'tpms'));
		}
		if(menuCount + mainMenu.length <= 6) {
			for (var i = 0; i < mainMenu.length; i++) {
				var item = mainMenu[i];
				ttxMap.setVehiMenu(item.id, item.name, item.title, item.popId, item.name);	
			}
		}else {
			while(menuCount < 5) {
				var item = mainMenu[0];
				mainMenu.splice(0, 1);
				ttxMap.setVehiMenu(item.id, item.name, item.title, item.popId, item.name);
				menuCount++;
			}
			ttxMap.setVehiMenu(vehicle.getIdno(), 'more', parent.lang.more, 1, 'more');
			for (var i = 0; i < mainMenu.length; i++) {
				var item = mainMenu[i];
				ttxMap.setVehiPopMenuName(item.id, 'more', item.name, item.title, item.name);
			}
		}
	}else {
		var videoDevice = vehicle.getVideoDevice(); //视频设备
		var gpsDevice = vehicle.getGpsDevice();//gps设备
		
		var isExistsGps = false;  //是否存在gps设备菜单
		var isExistsVideo = false;  //是否存在视频设备菜单
		ttxMap.setVehiMenu(vehicle.getIdno(), 'gpsDevice', parent.lang.monitor_gpsDevice, 1, 'gpsDevice');
		ttxMap.setVehiMenu(vehicle.getIdno(), 'videoDevice', parent.lang.monitor_videoDevice, 1, 'videoDevice');
		//下发文字信息
		if(this.roleCls.isPermit(656) && vehicle.isOnline()) {
			if(gpsDevice != null && gpsDevice.isOnline() && gpsDevice.isTTSSupport()) {
				ttxMap.setVehiPopMenuName(vehicle.getIdno(), 'gpsDevice', 'sendMessage', parent.lang.monitor_send_TTS, 'sendMessage');
				isExistsGps = true;
			}
			if(videoDevice != null && videoDevice.isOnline() && videoDevice.isTTSSupport()) {
				ttxMap.setVehiPopMenuName(vehicle.getIdno(), 'videoDevice', 'sendMessage', parent.lang.monitor_send_TTS, 'sendMessage');
				isExistsVideo = true;
			}
		}
		//设备信息查看
		if(this.roleCls.isPermit(652)) {
			//只有TTX(WKP)协议的设备才支持此功能
			if(gpsDevice != null && gpsDevice.isOnline() && gpsDevice.isCanFindInfo()) {
				ttxMap.setVehiPopMenuName(vehicle.getIdno(), 'gpsDevice',  'devInfo', parent.lang.monitor_deviceInfo,  'devInfo');
				isExistsGps = true;
			}
			if(videoDevice != null && videoDevice.isOnline() && videoDevice.isCanFindInfo()) {
				ttxMap.setVehiPopMenuName(vehicle.getIdno(), 'videoDevice',  'devInfo', parent.lang.monitor_deviceInfo,  'devInfo');
				isExistsVideo = true;
			}
		}
		//参数配置
		if(this.roleCls.isPermit(651)) {
			if(gpsDevice != null && gpsDevice.isOnline() && (gpsDevice.isCan808ParamConfig() || gpsDevice.isCanTtxParamConfig())) {
				ttxMap.setVehiPopMenuName(vehicle.getIdno(), 'gpsDevice',  'paramConfig', parent.lang.monitor_paramConfig,  'paramConfig');
				isExistsGps = true;
			}
			if(videoDevice != null && videoDevice.isOnline() && (videoDevice.isCan808ParamConfig() || videoDevice.isCanTtxParamConfig())) {
				ttxMap.setVehiPopMenuName(vehicle.getIdno(), 'videoDevice',  'paramConfig', parent.lang.monitor_paramConfig,  'paramConfig');
				isExistsVideo = true;
			}
		}
		//离线升级
		if(this.roleCls.isPermit(653)) {
			if(videoDevice != null && videoDevice.hasOfflineUpgrade()) {
				ttxMap.setVehiPopMenuName(vehicle.getIdno(), 'videoDevice',  'upgrade', parent.lang.monitor_deviceUpgrade,  'upgrade');
				ttxMap.setVehiPopMenuName(vehicle.getIdno(), 'videoDevice',  'issued', parent.lang.issuedFile,  'issued');
				isExistsVideo = true;
			}
			if(gpsDevice != null && gpsDevice.hasOfflineUpgrade()) {
				ttxMap.setVehiPopMenuName(vehicle.getIdno(), 'gpsDevice',  'upgrade', parent.lang.monitor_deviceUpgrade,  'upgrade');
				ttxMap.setVehiPopMenuName(vehicle.getIdno(), 'gpsDevice',  'issued', parent.lang.issuedFile,  'issued');
				isExistsGps = true;
			}
		}
		//胎压监测
		if(this.roleCls.isPermit(656) && vehicle.isOnline()) {
			if(videoDevice != null && videoDevice.isOnline() && videoDevice.hasTpms()){
				ttxMap.setVehiPopMenuName(vehicle.getIdno(), 'videoDevice',  'tpms', 'TPMS',  'tpms');
				isExistsVideo = true;
			}
			if(gpsDevice != null && gpsDevice.isOnline() && gpsDevice.hasTpms()){
				ttxMap.setVehiPopMenuName(vehicle.getIdno(), 'gpsDevice',  'tpms', 'TPMS',  'tpms');
				isExistsGps = true;
			}
		}
		if(!isExistsGps) {//存在gps设备菜单
			ttxMap.delVehiMenu(vehicle.getIdno(), 'gpsDevice');
		}
		if(!isExistsVideo) {//存在视频设备菜单
			ttxMap.delVehiMenu(vehicle.getIdno(), 'videoDevice');
		}
	}
	//划区域操作  点和圆
	ttxMap.setVehiMenu(vehicle.getIdno(), 'drawAreaManage', parent.lang.mapTool, 1, 'mapTool');
	ttxMap.setVehiPopMenuName(vehicle.getIdno(), 'drawAreaManage',  'drawPoint', parent.lang.addPoint,  'drawPoint');
	ttxMap.setVehiPopMenuName(vehicle.getIdno(), 'drawAreaManage',  'drawCircle', parent.lang.tipAddCircle,  'drawCircle');
}

/**
 * 地图上车辆Tip进行操作
 * @param vehiIdno  车牌号
 * @param menuId  菜单Id
 * @param popId  子菜单Id
 */
monitorVehicleMapTip.prototype.ttxMapClickmenuitem = function(vehiIdno, menuId, popId) {
	if(vehiIdno != null) {
		if(menuId == 'video') {//视频
			//如果视频窗口没展现，则不响应
			if ((typeof previewVideo) == 'function') {
				//popId 车辆对应的通道 0开始
				previewVideo(vehiIdno.toString(), popId);
			}
		}else if(menuId == 'talkback') {//对讲
			if(typeof paneInfo != 'undefined' && paneInfo != null && (typeof paneInfo.doTalkback) == 'function') {
				paneInfo.doTalkback(vehiIdno.toString());
			}
		}else if(menuId == 'listen') {//监听
			//popId 车辆对应的通道 0开始
			if(typeof paneInfo != 'undefined' && paneInfo != null && (typeof paneInfo.doListen) == 'function') {
				paneInfo.doListen(vehiIdno.toString(), popId);
			}
		}else if(menuId == 'capture') {//抓拍
			//popId 车辆对应的通道 0开始
			if(typeof monitorMedia != 'undefined' && monitorMedia != null && (typeof monitorMedia.beforeImageCapture) == 'function') {
				monitorMedia.beforeImageCapture(popId, vehiIdno.toString());
			}
		}else if(menuId == 'devInfo' || popId == 'devInfo') {//设备信息
			var devIdno = "";
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno.toString());
			if (vehicle == null) {
				return;
			}
			if(menuId == 'more' || menuId == 'devInfo') {
				var device = vehicle.devList[0];
				devIdno = device.getIdno();
			}else if(menuId == 'gpsDevice') {
				var device = vehicle.getGpsDevice();
				devIdno = device.getIdno();
			}else if(menuId == 'videoDevice') {
				var device = vehicle.getVideoDevice();
				devIdno = device.getIdno();
			}
			if(typeof monitorMenu != 'undefined' && monitorMenu != null && (typeof monitorMenu.findDeviceInfo) == 'function') {
				monitorMenu.findDeviceInfo(vehiIdno.toString(), devIdno);
			}
		}else if(menuId == 'paramConfig' || popId == 'paramConfig') {//参数配置
//			alert(parent.lang.support_next_version);
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			if (vehicle == null) {
				return;
			}
			var device = null;
			if(menuId == 'gpsDevice') {
				device = vehicle.getGpsDevice();
			}else if(menuId == 'videoDevice') {
				device = vehicle.getVideoDevice();
			}else {
				device = vehicle.devList[0];
			}
			if(device.isCan808ParamConfig()) {//808参数配置
//				alert(parent.lang.support_next_version);
				if(typeof monitorMenu != 'undefined' && monitorMenu != null && (typeof monitorMenu.do808ParamConfig) == 'function') {
					monitorMenu.do808ParamConfig(vehiIdno, device.getIdno());
				}
			}else {//ttx参数配置
				if(typeof monitorMenu != 'undefined' && monitorMenu != null && (typeof monitorMenu.doTtxParamConfig) == 'function') {
					monitorMenu.doTtxParamConfig(vehiIdno, device.getIdno());
				}
			}
		}else if(menuId == 'upgrade' || popId == 'upgrade') {//设备升级（在线）
			//alert(parent.lang.support_next_version);
			var devIdno = "";
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			if (vehicle == null) {
				return;
			}
			var showDevIdno = false;
			if(menuId == 'gpsDevice') {
				var device = vehicle.getGpsDevice();
				devIdno = device.getIdno();
				showDevIdno = true;
			}else if(menuId == 'videoDevice') {
				var device = vehicle.getVideoDevice();
				devIdno = device.getIdno();
				showDevIdno = true;
			}else{
				devIdno = vehicle.devList[0].getIdno();
				showDevIdno = false;
			}
			if(typeof monitorMenu != 'undefined' && monitorMenu != null && (typeof monitorMenu.offlineUpgrade) == 'function') {
				monitorMenu.offlineUpgrade(vehiIdno,devIdno,showDevIdno,true);
			}
		}else if(menuId == 'issued' || popId == 'issued') {//设备升级（在线）
			//alert(parent.lang.support_next_version);
			var devIdno = "";
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			if (vehicle == null) {
				return;
			}
			var showDevIdno = false;
			if(menuId == 'gpsDevice') {
				var device = vehicle.getGpsDevice();
				devIdno = device.getIdno();
				showDevIdno = true;
			}else if(menuId == 'videoDevice') {
				var device = vehicle.getVideoDevice();
				devIdno = device.getIdno();
				showDevIdno = true;
			}else{
				devIdno = vehicle.devList[0].getIdno();
				showDevIdno = false;
			}
			if(typeof monitorMenu != 'undefined' && monitorMenu != null && (typeof monitorMenu.offlineUpgrade) == 'function') {
				monitorMenu.offlineUpgrade(vehiIdno,devIdno,showDevIdno,false);
			}
		}else if(menuId == 'tpms' || popId == 'tpms') {//TPMS
			var devIdno = "";
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			if (vehicle == null) {
				return;
			}
			var showDevIdno = false;
			if(menuId == 'gpsDevice') {
				var device = vehicle.getGpsDevice();
				devIdno = device.getIdno();
			}else if(menuId == 'videoDevice') {
				var device = vehicle.getVideoDevice();
				devIdno = device.getIdno();
			}else{
				devIdno = vehicle.devList[0].getIdno();
			}
			if(typeof monitorMenu != 'undefined' && monitorMenu != null && (typeof monitorMenu.offlineUpgrade) == 'function') {
				monitorMenu.findTpmsInfo(vehiIdno,devIdno);
			}
		}else if(menuId == 'sendMessage' || popId == 'sendMessage') {//下发文字信息
			var devIdno = "";
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno.toString());
			if (vehicle == null) {
				return;
			}
			if(menuId == 'gpsDevice') {
				var device = vehicle.getGpsDevice();
				devIdno = device.getIdno();
			}else if(menuId == 'videoDevice') {
				var device = vehicle.getVideoDevice();
				devIdno = device.getIdno();
			}
			if(typeof monitorMenu != 'undefined' && monitorMenu != null && (typeof monitorMenu.issuedInformation) == 'function') {
				monitorMenu.issuedInformation(vehicle.getParentId(), vehiIdno.toString(), devIdno);
			}
		}else if(menuId == 'drawAreaManage') { //画区域操作
			if(popId == 'drawPoint') {//画标记点
				this.drawAreaManage(vehiIdno.toString(), 1);
			}else if(popId == 'drawCircle') {//画圆
				this.drawAreaManage(vehiIdno.toString(), 10);
			}
		}else {//更多
			alert(menuId+','+popId);
		}
	}
}

/**
 * 加载地图点聚合参数
 * @param init 是否初始化
 */
monitorVehicleMapTip.prototype.loadMarkerClusterParam = function(init) {
	//初始化地图点聚合参数
	//是否启用点聚合
	var enableMarkerCluster_ = $.cookie(DEF_Enable_Marker_Cluster);
	//最大聚合级别
	var maxClusterZoom_ = $.cookie(DEF_Max_Cluster_Zoom);
	//最小聚合数量
	var minClusterSize_ = $.cookie(DEF_Min_Cluster_Size);
	if (typeof ttxMap != 'undefined' && ttxMap != null) {
		var myClass = this;
		if(enableMarkerCluster_ != null && enableMarkerCluster_ == '1') {
			ttxMap.setMarkerClusterParam(true, maxClusterZoom_, minClusterSize_, function() {
				//新增车辆到地图
				if (typeof monitorStatus != 'undefined' && monitorStatus != null) {
					monitorStatus.selectVehicleToMapEx();
				}
			},function() {
				//删除地图所有车辆
				myClass.removeAllVehicleInMap();
			});
		}else {
			if(!init) {
				ttxMap.setMarkerClusterParam(false, '', '', function() {
					//新增车辆到地图
					if (typeof monitorStatus != 'undefined' && monitorStatus != null) {
						monitorStatus.selectVehicleToMapEx();
					}
				},function() {
					//删除地图所有车辆
					myClass.removeAllVehicleInMap();
				});
			}
		}
	}
}

/**
 * 地图上画区域管理，主要是点和圆
 * 画区域时，要求车辆静止（不更新实时位置），画区域结束后更新
 * vehiIdno 车牌号
 * type 1表示点 10表示圆
 */
monitorVehicleMapTip.prototype.drawAreaManage = function(vehiIdno, type) {
	var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
	if(vehicle != null) {
		//设置正在画区域
		vehicle.setDrowing(true);
		//获取车辆的地图经纬度信息
		var point = vehicle.getMapLngLat();
		//调用下层画区域操作
		if(typeof ttxMap != 'undefined' && ttxMap != null) {
			ttxMap.doMapDrawMarker(type, point.lng, point.lat, 100);
			this.drowingVehiIdno = vehiIdno;
		}
	}
}

/**
 * //设置车辆画区域标志
 * @param flag
 */
monitorVehicleMapTip.prototype.setVehicleDrowing = function(flag) {
	if(!flag) {
		if(this.drowingVehiIdno != null) {
			var vehicle = parent.vehicleManager.getVehicle(this.drowingVehiIdno);
			if(vehicle != null) {
				//设置画区域结束
				vehicle.setDrowing(false);
				this.drowingVehiIdno = null;
			}
		}
	}
}

/**
 * 添加标记到地图
 */
monitorVehicleMapTip.prototype.insertMarker = function(markerId) {
	if(typeof ttxMap != 'undefined' && ttxMap != null) {
		ttxMap.insertMarker(markerId);
	}
}

/**
 * 更新标记
 */
monitorVehicleMapTip.prototype.updateMarker = function(markerId, typeId, name, jindu, weidu
		, tabType, color, status, param, iconImage) {
	if(typeof ttxMap != 'undefined' && ttxMap != null) {
		ttxMap.updateMarker(markerId, typeId, name, jindu, weidu
				, tabType, color, status, param, iconImage);
	}
}

/**
 * 选中标记
 */
monitorVehicleMapTip.prototype.selectMarker = function(markerId) {
	if(typeof ttxMap != 'undefined' && ttxMap != null) {
		ttxMap.selectMarker(markerId);
	}
}

/**
 * 从地图删除标记
 */
monitorVehicleMapTip.prototype.deleteMarker = function(markerId) {
	if(typeof ttxMap != 'undefined' && ttxMap != null) {
		ttxMap.deleteMarker(markerId);
	}
}

/**
 * 显示线路到地图   //删除线路到地图
 * @param vehiTeamId 线路id
 * @param type 类型 0上行  1下行
 * @param isOnShowMap 是否显示
 */
monitorVehicleMapTip.prototype.displayLineOnMap = function(vehiTeamId, type, isOnShowMap) {
	var team = parent.vehicleManager.getTeam(vehiTeamId);
	if(team != null) {
		var lineInfo = parent.vehicleManager.getLineInfo(vehiTeamId);//线路信息
		var stationIds = null; //站点id集合
		var lineMapId_ = this.defaultLineId + parseInt(vehiTeamId.toString() + type.toString(), 10); //线路在地图的标识
		if(type == 1) {//下行
			if(lineInfo != null) {
				stationIds = lineInfo.getDownLine().getStationList();
			}
		}else {
			if(lineInfo != null) {
				stationIds = lineInfo.getUpLine().getStationList();
			}
		}
		//线路是否显示在地图
		if(!isOnShowMap) {//如果线路已经显示在地图上
			if(type == 1) {//下行
				team.setOnShowDownMap(false);
			}else {
				team.setOnShowUpMap(false);
			}
			//删除线路和站点
			this.deleteMarker(lineMapId_);
			if(stationIds != null && stationIds.length > 0) {
				for (var i = 0; i < stationIds.length; i++) {
					//线路id-线路方向-站点id
					var relationId_ = vehiTeamId.toString()+'-'+type.toString()+'-'+stationIds[i];
					var relation_ = parent.vehicleManager.getStationRelation(relationId_);
					if(relation_ != null) {
						this.deleteMarker(this.defaultStationId + parseInt(relation_.getId(), 10));
					}
				}
			}
		}else {
			var data = lineInfo.getLineRealStatus(type);
			//位置有效
			if(data.mapJingDu && data.mapWeiDu) {
				if(type == 1) {//下行
					team.setOnShowDownMap(true);
				}else {
					team.setOnShowUpMap(true);
				}
				//添加线路到地图上
				this.insertMarker(lineMapId_);
				//更新线路信息
				this.updateMarker(lineMapId_, 9, data.name + ' - ' + data.direct,
						data.mapJingDu, data.mapWeiDu, 0, data.color, data.statusString, 0);
				//选中线路
				this.selectMarker(lineMapId_);
				
				if(stationIds != null && stationIds.length > 0) {
					var startStationId = 0;
					var endStationId = 0;
					if(type == 1) {//下行
						startStationId = lineInfo.getDownLine().getStartStationId();
						endStationId = lineInfo.getDownLine().getEndStationId();
					}else {
						startStationId = lineInfo.getUpLine().getStartStationId();
						endStationId = lineInfo.getUpLine().getEndStationId();
					}
					for (var i = 0; i < stationIds.length; i++) {
						var iconImage = "";
						if(stationIds[i] == startStationId) {//起点站
							iconImage = "begin.gif";
						}else if(stationIds[i] == endStationId) { //终点站
							iconImage = "end.gif";
						}else {//普通站台
							iconImage = "station.gif";
						}
						
						//线路id-线路方向-站点id
						var relationId_ = vehiTeamId.toString()+'-'+type.toString()+'-'+stationIds[i];
						var relation_ = parent.vehicleManager.getStationRelation(relationId_);
						if(relation_ != null) {
							var station_ = parent.vehicleManager.getStationInfo(stationIds[i]);
							var stationMapId_ = this.defaultStationId + parseInt(relation_.getId(), 10);
							//添加站点到地图上
							this.insertMarker(stationMapId_);
							var stationData = relation_.getStationRealStatus(lineInfo, station_);
							//更新站点信息
							this.updateMarker(stationMapId_, 1, stationData.name + ' - ' + stationData.direct,
									stationData.mapJingDu, stationData.mapWeiDu, 0, 'FF0000',
									stationData.statusString, 0, iconImage);
						}
					}
				}
			}
		}
	}
}

/**
 * 选择线路
 * @param vehiTeamId 线路id
 * @param type 类型 0上行  1下行
 */
monitorVehicleMapTip.prototype.selectLineOnMap = function(vehiTeamId, type) {
	var lineMapId_ = this.defaultLineId + parseInt(vehiTeamId.toString() + type.toString(), 10); //线路在地图的标识
	//选中线路
	this.selectMarker(lineMapId_);
}