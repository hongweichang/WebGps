/**
 * 司机类
 */
function standardDriver(id, name) {
	this.id = id;
	this.name = name; //名称
	this.jobNum = null; //工号
	this.sex = null; //性别 1男 2女
	this.contact = null; //联系方式
	this.cardNumber = null; //身份证号
	this.licenseNum = null; //驾驶证号
	this.parentId = null; //所属公司
	this.rushDate = null; //驾驶证办证日期
	this.validity = null; //驾驶证有效期
}

standardDriver.prototype.setStandardDriver = function(driver){
	this.jobNum = driver.jn; //工号
	this.sex = driver.sx; //性别 1男 2女
	this.contact = driver.dt; //联系方式
	this.cardNumber = driver.cn; //身份证号
	this.licenseNum = driver.ln; //驾驶证号
	this.parentId = driver.pid; //所属公司
	this.rushDate = driver.rd; //驾驶证办证日期
	this.validity = driver.vd; //驾驶证有效期
};

//获取司机id
standardDriver.prototype.getId = function() {
	return this.id;
}

//获取司机名称
standardDriver.prototype.getName = function() {
	return this.name;
}

//获取司机工号
standardDriver.prototype.getJobNum = function() {
	return this.jobNum;
}

//获取司机性别 1男 2女
standardDriver.prototype.getSex = function() {
	return this.sex;
}

//获取司机性别 1男 2女
standardDriver.prototype.getSexEx = function() {
	if(this.sex && this.sex == 2) {
		return parent.lang.woman;
	}
	return parent.lang.man;
}

//获取司机联系方式
standardDriver.prototype.getContact = function() {
	return this.contact;
}

//获取司机身份证号
standardDriver.prototype.getCardNumber = function() {
	return this.cardNumber;
}

//获取司机驾驶证号
standardDriver.prototype.getLicenseNum = function() {
	return this.licenseNum;
}

//获取司机所属公司
standardDriver.prototype.getParentId = function() {
	return this.parentId;
}

//获取司机驾驶证办证日期
standardDriver.prototype.getRushDate = function() {
	return this.rushDate;
}

//获取司机驾驶证有效期
standardDriver.prototype.getValidity = function() {
	return this.validity;
}

/**
 * 车辆分组类
 */

function vehicleTeam(id, name){
	this.id = id;
	this.name = name;
	this.parentId = null;
	this.level = null;
	this.componyId = null;
	this.vehiIdnos = null;  //车辆列表（车牌号） Array
	this.isLoadSuc = false;  //树列表是否加载
	this.childTeams = null;  //子公司列表 id Array
	this.parentTeams = null; //父公司列表 id Array
	this.onlineVehiIdnos = null;  //在线车辆列表（车牌号） Array
	this.offlineVehiIdnos = null;  //离线车辆列表（车牌号） Array
	this.onShowUpMap = false; //上行线路是否显示在地图
	this.onShowDownMap = false; //下行线路是否显示在地图
	this.onMonitor = false; //是否在监控
}

vehicleTeam.prototype.setVehicleTeam = function(team){
	this.parentId = team.parentId;
	this.level = team.level;
	this.companyId = team.companyId;
};

vehicleTeam.prototype.getName = function(){
	return this.name;
};

vehicleTeam.prototype.getId = function(){
	return this.id;
};

vehicleTeam.prototype.getLevel = function(){
	return this.level;
};

vehicleTeam.prototype.isOnShowUpMap= function(){
	return this.onShowUpMap;
};

vehicleTeam.prototype.setOnShowUpMap = function(onShowUpMap){
	this.onShowUpMap = onShowUpMap;
};

vehicleTeam.prototype.isOnShowDownMap= function(){
	return this.onShowDownMap;
};

vehicleTeam.prototype.setOnShowDownMap = function(onShowDownMap){
	this.onShowDownMap = onShowDownMap;
};

vehicleTeam.prototype.isOnMonitor= function(){
	return this.onMonitor;
};

vehicleTeam.prototype.setOnMonitor = function(onMonitor){
	this.onMonitor = onMonitor;
};

vehicleTeam.prototype.addChildTeam = function(team){
	if(this.childTeams == null) {
		this.childTeams = [];
	}
	this.childTeams.push(team);
};

vehicleTeam.prototype.getChildTeams = function(){
	return this.childTeams;
};

vehicleTeam.prototype.addParentTeam = function(team){
	if(this.parentTeams == null) {
		this.parentTeams = [];
	}
	this.parentTeams.push(team);
};

vehicleTeam.prototype.getParentTeams = function(){
	return this.parentTeams;
};

vehicleTeam.prototype.addOnlineVehiIdno = function(vehiIdno){
	if(this.onlineVehiIdnos == null) {
		this.onlineVehiIdnos = [];
	}
	var isExists = false;
	for (var i = 0; i < this.onlineVehiIdnos.length; i++) {
		if(this.onlineVehiIdnos[i] == vehiIdno) {
			isExists = true;
		}
	}
	if(!isExists) {
		this.onlineVehiIdnos.push(vehiIdno);
	}
};

vehicleTeam.prototype.delOnlineVehiIdno = function(vehiIdno){
	if(this.onlineVehiIdnos == null) {
		return;
	}
	for (var i = 0; i < this.onlineVehiIdnos.length; i++) {
		if(this.onlineVehiIdnos[i] == vehiIdno) {
			this.onlineVehiIdnos.splice(i,1);
			break;
		}
	}
};

vehicleTeam.prototype.getOnlineVehiIdnos = function(){
	return this.onlineVehiIdnos;
};

vehicleTeam.prototype.addOfflineVehiIdno = function(vehiIdno){
	if(this.offlineVehiIdnos == null) {
		this.offlineVehiIdnos = [];
	}
	var isExists = false;
	for (var i = 0; i < this.offlineVehiIdnos.length; i++) {
		if(this.offlineVehiIdnos[i] == vehiIdno) {
			isExists = true;
		}
	}
	if(!isExists) {
		this.offlineVehiIdnos.push(vehiIdno);
	}
};

vehicleTeam.prototype.delOfflineVehiIdno = function(vehiIdno){
	if(this.offlineVehiIdnos == null) {
		return;
	}
	for (var i = 0; i < this.offlineVehiIdnos.length; i++) {
		if(this.offlineVehiIdnos[i] == vehiIdno) {
			this.offlineVehiIdnos.splice(i,1);
			break;
		}
	}
};

vehicleTeam.prototype.getOfflineVehiIdnos = function(){
	return this.offlineVehiIdnos;
};

vehicleTeam.prototype.setLoadSuccess = function(isLoadSuc_){
	this.isLoadSuc = isLoadSuc_;
};

vehicleTeam.prototype.isLoadSuccess = function(){
	return this.isLoadSuc;
};

/**
 * 车辆管理类
 */
function VehicleManager(){
	//车辆map集合(vehiIdno,vehicle)
	this.mapVehiList = new Hashtable();
	//设备map集合(devIdno,vehiIdno)
	this.mapDevList = new Hashtable();
	//分组结点
	this.mapVehiTeam = new Hashtable();
	//所有的设备编号
	this.allDevIdnos = "";		//中间使用，分隔
	this.allVehiIdnos = "";   //所有的车牌号，中间使用，分隔
	this.flashStatusTimer = null; //刷新车辆状态的定时器
	this.flashStatusInterval = 120000; //默认刷新车辆状态的间隔
	
	//司机map集合(司机id, 司机)
	this.mapDriverList = new Hashtable();
	//线路map集合(线路id, 线路)
	this.mapLineList = new Hashtable();
	//站点map集合(站点id, 站点)
	this.mapStationList = new Hashtable();
	//线路站点关联map集合(线路id-线路方向-站点id, 线路站点关联)
	this.mapStationRelationList = new Hashtable();
	//线路站点关联map集合(线路id-线路方向-站点索引, 线路站点关联)
	this.mapStationRelationListEx = new Hashtable();
}

VehicleManager.prototype.addVehicle = function(vehiIndo, vehicle){
	this.mapVehiList.put(vehiIndo, vehicle);
};

VehicleManager.prototype.addDevice = function(devIdno, device){
	this.mapDevList.put(devIdno, device);
};

VehicleManager.prototype.addTeam = function(id, team){
	this.mapVehiTeam.put(id.toString(), team);
};

VehicleManager.prototype.updateAllVehiIdnos = function() {
	var vehiIdnos = [];
	this.mapVehiList.each(function(key, value) {
		vehiIdnos.push(key);
	});
	this.allVehiIdnos = vehiIdnos.toString();
};

VehicleManager.prototype.updateAllDevIdnos = function() {
	var devIdnos = [];
	this.mapDevList.each(function(key, value) {
		devIdnos.push(key);
	});
	this.allDevIdnos = devIdnos.toString();
};

VehicleManager.prototype.getTeam = function(id){
	return this.mapVehiTeam.get(id.toString());
};

VehicleManager.prototype.getVehicle = function(vehiIndo){
	return this.mapVehiList.get(vehiIndo);
};

VehicleManager.prototype.getVehiByDevIdno = function(devIdno){
	var device = this.mapDevList.get(devIdno);
	if (device != null) {
		return this.getVehicle(device.getVehiIdno());
	} else {
		return null;
	}
};

VehicleManager.prototype.getDevice = function(devIndo){
	return this.mapDevList.get(devIndo);
};


VehicleManager.prototype.getAllDevIdnos = function () {
	return this.allDevIdnos;
}

VehicleManager.prototype.getAllVehiIdnos = function () {
	return this.allVehiIdnos;
}

//添加司机
VehicleManager.prototype.addDriverInfo = function(driverId, driver){
	this.mapDriverList.put(driverId.toString(), driver);
};

//添加线路
VehicleManager.prototype.addLineInfo = function(lineId, line){
	this.mapLineList.put(lineId.toString(), line);
};

//添加站点
VehicleManager.prototype.addStationInfo = function(stationId, station){
	this.mapStationList.put(stationId.toString(), station);
};

//添加线路id-线路方向-站点id, 线路站点关联
VehicleManager.prototype.addStationRelation = function(relationId, relation){
	this.mapStationRelationList.put(relationId.toString(), relation);
};

//添加线路id-线路方向-站点索引, 线路站点关联
VehicleManager.prototype.addStationRelationEx = function(relationId, relation){
	this.mapStationRelationListEx.put(relationId.toString(), relation);
};

//获取司机
VehicleManager.prototype.getDriverInfo = function(driverId){
	return this.mapDriverList.get(driverId.toString());
};

//获取线路
VehicleManager.prototype.getLineInfo = function(lineId){
	return this.mapLineList.get(lineId.toString());
};

//获取站点
VehicleManager.prototype.getStationInfo = function(stationId){
	return this.mapStationList.get(stationId.toString());
};

//获取线路id-线路方向-站点id, 线路站点关联
VehicleManager.prototype.getStationRelation = function(relationId){
	return this.mapStationRelationList.get(relationId.toString());
};

//获取线路id-线路方向-站点索引, 线路站点关联
VehicleManager.prototype.getStationRelationEx = function(relationId){
	return this.mapStationRelationListEx.get(relationId.toString());
};

//获取所有线路
VehicleManager.prototype.getAllLineInfo = function(){
	var lines = [];
	this.mapLineList.each(function(key, value) {
		lines.push(value);
	});
	return lines;
};

/**
 * 获取所有的车辆
 * @returns {Array}
 */
VehicleManager.prototype.getAllVehicle = function(){
	var vehicles = [];
	this.mapVehiList.each(function(key, value) {
		vehicles.push(value);
	});
	return vehicles;
};

/**
 * 获取设备支持TTS属性的车辆
 * @param isOnline   是否取在线车辆
 * @returns {Array}
 */
VehicleManager.prototype.getSupportTTSVehicle = function(isOnline){
	var vehicles = [];
	this.mapVehiList.each(function(key, value) {
		if(isOnline) {
			if(value.isOnline()) {
				var devList = value.getDevList();
				if(devList != null && devList.length > 0) {
					for (var i = 0; i < devList.length; i++) {
						if(devList[i].isOnline() && devList[i].isTTSSupport()) {
							vehicles.push(value);
							break;
						}
					}
				}
			}
		}else {
			var devList = value.getDevList();
			if(devList != null && devList.length > 0) {
				for (var i = 0; i < devList.length; i++) {
					if(devList[i].isTTSSupport()) {
						vehicles.push(value);
						break;
					}
				}
			}
		}
	});
	return vehicles;
};

/**
 * 获取有视频模块的车辆
 * @param isOnline   是否取在线车辆
 * @returns {Array}
 */
VehicleManager.prototype.getSupportVideoVehicle = function(isOnline){
	var vehicles = [];
	this.mapVehiList.each(function(key, value) {
		if(isOnline) {
			if(value.isOnline()) {
				var devList = value.getDevList();
				if(devList != null && devList.length > 0) {
					for (var i = 0; i < devList.length; i++) {
						if(devList[i].isOnline() && devList[i].isVideoDevice()) {
							vehicles.push(value);
							break;
						}
					}
				}
			}
		}else {
			var devList = value.getDevList();
			if(devList != null && devList.length > 0) {
				for (var i = 0; i < devList.length; i++) {
					if(devList[i].isVideoDevice()) {
						vehicles.push(value);
						break;
					}
				}
			}
		}
	});
	return vehicles;
};

/**
 * 获取支持油路配置的车辆
 * @returns {Array}
 */
VehicleManager.prototype.getOilVehicle = function(){
	var vehicles = [];
	var devList = [];
	this.mapVehiList.each(function(key, value) {
		devList = value.devList;
		for (var i = 0; i < devList.length; i++) {
			if(devList[i].isOilSensorSupport()){
				vehicles.push(value);
			}
		}
	});
	return vehicles;
};

/**
 * 获取支持设备升级的车辆
 * @param protocol
 * @param factoryType
 * @returns {Array}
 */
VehicleManager.prototype.getUpgradeVehicle = function(protocol, factoryType){
	var vehicles = [];
	var devList = [];
	this.mapVehiList.each(function(key, value) {
		devList = value.devList;
		for (var i = 0; i < devList.length; i++) {
			if(protocol == 1){
				if(devList[i].status.protocol == protocol){
					vehicles.push(value);
					break;
				}
			}else{
				if(devList[i].status.protocol == protocol && devList[i].status.factoryType == factoryType){
					vehicles.push(value);
					break;
				}
			}
		}
	});
	return vehicles;
};

/**
 * 获取支持808参数设置的车辆
 * @returns {Array}
 */
VehicleManager.prototype.get808ParamConfigVehicle = function(){
	var vehicles = [];
	this.mapVehiList.each(function(key, value) {
		if(value.isOnline()) {
			var devList = value.getDevList();
			if(devList != null && devList.length > 0) {
				for (var i = 0; i < devList.length; i++) {
					//在线 支持808参数配置
					if(devList[i].isOnline() && devList[i].isCan808ParamConfig()) {
						vehicles.push(value);
						break;
					}
				}
			}
		}
	});
	return vehicles;
};

/**
 * 获取支持Ttx参数设置的车辆
 * @returns {Array}
 */
VehicleManager.prototype.getTtxParamConfigVehicle = function(){
	var vehicles = [];
	this.mapVehiList.each(function(key, value) {
		if(value.isOnline()) {
			var devList = value.getDevList();
			if(devList != null && devList.length > 0) {
				for (var i = 0; i < devList.length; i++) {
					//在线 支持808参数配置
					if(devList[i].isOnline() && devList[i].isCanTtxParamConfig()) {
						vehicles.push(value);
						break;
					}
				}
			}
		}
	});
	return vehicles;
};

VehicleManager.prototype.getAllVehiTeam = function(){
	var vehiTeam = [];
	this.mapVehiTeam.each(function(key, value) {
		vehiTeam.push(value);
	});
	return vehiTeam;
};

//开启刷新车辆状态的定时器
VehicleManager.prototype.runStatusTimer = function(){
	var flashStatus_ = this;
	this.flashStatusTimer = setTimeout(function () {
		flashStatus_.flashVehicleStatus();
	}, this.flashStatusInterval);
};

//刷新车辆状态
VehicleManager.prototype.flashVehicleStatus = function(){
	var data = {};
	//2分钟刷新一次局部状态
	data.devIdnos = this.getAllDevIdnos();
	if (data.devIdnos == "") {
		this.runStatusTimer();
		return ;
	}
	//本类对象
	var flashStatus_ = this;
	//数据库取实时状态
	$.myajax.jsonPost('StandardPositionAction_statusEx.action?toMap='+ toMap, data, false, function(json, success) {
		if(success) {
			//一个车辆可以对应多个设备，因此使用一个更新的车辆链表来处理更新
			for (var i = 0; i < json.status.length; i++) {
				var device = flashStatus_.getDevice(json.status[i].id);
				if (device != null) {
					if (!device.isEqualStatus(json.status[i]) || (json.status[i] != null && !device.isEqualOnline(json.status[i].ol))) {
						if(device.status && json.status[i]) {
							device.setStatus(json.status[i]);
							device.setOnline(json.status[i].ol);
						}
					}
				} else {
					//$.dialog.tips(lang.monitor_flashVehicleStatusGetVehicleError, 2);
				}
			}
		} else {
			//提示刷新车辆失败
			//$.dialog.tips(lang.monitor_flashVehicleError, 2);
		}
		flashStatus_.runStatusTimer();
	});
};