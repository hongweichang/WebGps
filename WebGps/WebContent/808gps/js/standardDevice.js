/**
 * 设备类
 */
function standardDevice(devIdno){
	this.idno = devIdno;	//设备id
	this.name = null;			//设备名称
	this.parentId = null;	//
	this.chnCount = null;	//通道数目
	this.chnName = null;		//通道名称，名称间用,分隔
	this.ioInCount = null;	//IO的数目
	this.ioInName = null;	//IO名称，名称间用,分隔
	this.tempCount = null;	//温度传感器数目
	this.tempName = null;	//温度传感器名称，名称间用,分隔
	this.simCard = null;		//SIM卡
	this.module = null;   //外设参数
	this.status = new standardStatus(devIdno);  //设备状态
	this.vehiIdno = null;  //设备所属车辆编号
	this.vehicle = null;  //设备所属车辆
	this.index = null; //序号
//	this.devType = null;	//设备类型
//	this.devSubType = null;	//设备子类型
//	this.factory = null;	//厂商	
//	this.diskType = null;// 硬盘类型
	this.flowLimitType = null; //月流量超限：0超限后忽略，1表示超限后禁用媒体业务
}

standardDevice.prototype.setName = function(name){
	this.name = name;
};

standardDevice.prototype.setVehiIdno = function(vehiIdno){
	this.vehiIdno = vehiIdno;
};

standardDevice.prototype.setVehicle = function(vehicle){
	this.vehicle = vehicle;
};

standardDevice.prototype.setStatus = function(status){
	this.status.setStatus(status);
};

standardDevice.prototype.setDevice = function(dev){
	this.name = "";//dev.nm;			
	this.parentId = dev.pid;	
	this.chnCount = dev.cc;	
	this.chnName = dev.cn;		
	this.ioInCount = dev.ic;	
	this.ioInName = dev.io;	
	this.tempCount = dev.tc;	
	this.tempName = dev.tn;	
	this.simCard = dev.sim;		
	this.module = dev.md;
//	this.devType = dev.dt;	
//	this.devSubType = dev.dst;	
//	this.factory = dev.ft;		
//	this.diskType = dev.dt;
	this.flowLimitType = dev.nflt;
	if(dev.st) {
//		this.diskType = dev.st.dt;
		this.setStatus(dev.st);
		this.status.setOnline(dev.st.ol);
	}
};

standardDevice.prototype.getIdno = function() {
	return this.idno;
};

standardDevice.prototype.getName = function(){
	return this.name;
};

standardDevice.prototype.getParentId = function(){
	return this.parentId;
};

standardDevice.prototype.getFactory = function(){
	return this.status.factoryType;
};

standardDevice.prototype.getChnCount = function(){
	return this.chnCount;
};

standardDevice.prototype.getChnName = function(){
	return this.chnName;
};

standardDevice.prototype.setFlowLimitType = function(flowLimitType){
	this.flowLimitType = flowLimitType;
};

//是否流量超额限制
standardDevice.prototype.isflowLimit = function(){
	if(this.flowLimitType && this.flowLimitType == 1) {
		return true;
	}
	return false;
};

//获取通道名称 
standardDevice.prototype.getSingleChnName = function(chn) {
	var ret = "";
	if(this.chnName != null && this.chnName != '') {
		var chanNames = this.chnName.split(',');
		if (chanNames.length > chn); {
			ret = chanNames[chn];
		}
	}
	if (ret == "") {
		ret = "CH" + (chn + 1);
	}
	return ret;
};

standardDevice.prototype.getIoInCount = function(){
	return this.ioInCount;
};

standardDevice.prototype.getIoInName = function(){
	return this.ioInName;
};

standardDevice.prototype.getTempCount = function(){
	return this.tempCount;
};

standardDevice.prototype.getTempName = function(){
	return this.tempName;
};

standardDevice.prototype.getSimCard = function(){
	return this.simCard;
};

standardDevice.prototype.getModule = function(){
	return this.module;
};

standardDevice.prototype.getStatus = function(){
	return this.status;
};

standardDevice.prototype.getVehiIdno = function(){
	return this.vehiIdno;
};

standardDevice.prototype.getVehicle = function(){
	return this.vehicle;
};

standardDevice.prototype.getDiskType = function(){
	return this.status.diskType == null ? 1 : this.diskType;
};

//硬盘类型
standardDevice.prototype.getDiskTypeStr = function(){
	switch (this.getDiskType()) {
	case 0:
	case 1:	
		return parent.lang.alarm_gps_sd;
	case 2:	
		return parent.lang.alarm_gps_disk;
	case 3:	
		return parent.lang.alarm_gps_ssd;
	}
};

//判断是否JT808协议
standardDevice.prototype.isJT808Protocol = function(){
	return this.status.isJT808Protocol();
}

//判断是否WKP协议
standardDevice.prototype.isWKPProtocol = function(){
	return this.status.isWKPProtocol();
}

//判断是否易甲文的协议
standardDevice.prototype.isRMProtocol = function(){
	return this.status.isRMProtocol();
}

//判断设备是否有直接下载的权限
standardDevice.prototype.isDirectDownload = function(){
//	通立、国脉、宏电、锐哲  这4个厂家的录像文件只能按分段方式下载，不支持直接文件下载的方式
	if(this.status.isTLFactoryType() || this.status.isGMFactoryType() ||
			this.status.isHDFactoryType() || this.status.isRZFactoryType()) {
		return false;
	}
	return true;
}

//判断设备信息是否有被查看的权限
standardDevice.prototype.isCanFindInfo = function(){
	return this.status.isWKPProtocol() || this.status.isTTXProtocol();
}

//判断厂家是否忆志
standardDevice.prototype.isESTFactoryType = function(){
	return this.status.isESTFactoryType();
}

//判断是否有格式化硬盘的权限
standardDevice.prototype.isFormattingHardDisk = function(){
	//通立（厂家类型为16）的设备
	return this.status.isTLFactoryType();
}

//判断是否有设置WIFI下载任务的权限
standardDevice.prototype.isCanWifiConfig = function(){
	//非808协议
	return !this.status.isJT808Protocol();
}

//判断是否有GPS上报间隔的权限
standardDevice.prototype.isCanGPSReportInterval = function(){
	//协议类型为 1和7的存在
	//设备厂家为4的忆志的设备存在
	if(this.status.isWKPProtocol() || this.status.isRMProtocol() || this.status.isESTFactoryType()) {
		return true;
	}
	return false;
}

//判断是否有808参数配置的权限
standardDevice.prototype.isCan808ParamConfig = function(){
	return this.status.isJT808Protocol();
}

//判断是否有ttx协议(协议类型为1)参数配置的权限,厂家类型不包括1,2,3,5,6,7,14
standardDevice.prototype.isCanTtxParamConfig = function(){
	if(this.status.isWKPProtocolEx()) {
		if(!this.status.isWKPFactoryType() && !this.status.isAUDSFactoryType() && 
				!this.status.isKXFactoryType() && !this.status.isYXHDFactoryType() && 
				!this.status.isCOOINTFactoryType() && !this.status.isYJWFactoryType()&& 
				!this.status.isRCMFactoryType()) {
			return true;
		}
	}
	return false;
}

//获取设备定位的gps时间
standardDevice.prototype.getGpsTime = function(){
	return this.status.getGpsTime();
};

//获取设备定位的gps时间字符串
standardDevice.prototype.getGpsTimeString = function(){
	return this.status.getGpsTimeString();
};

//获取速度
standardDevice.prototype.getSpeedString = function(){
	return this.status.getSpeedString();
};

//获取设备速度+方向字符串
standardDevice.prototype.getSpeedFangXiangString = function(){
	return this.status.getSpeedFangXiangString();
}
//获取高度
standardDevice.prototype.getgaoDuString = function(){
	return this.status.getgaoDuString();
}
//获取里程
standardDevice.prototype.getLiChengString = function(){
	return this.status.getLiChengString();
};

//取得航向
standardDevice.prototype.getDirection = function(){
	return this.status.getDirection();
};

//取得航向
standardDevice.prototype.getHuangXiangString = function(){
	return this.status.getHuangXiangString();
};

//获取设备定位的地址
standardDevice.prototype.getPosition = function(){
	return this.status.getPosition();
};

//取得地图经纬度信息
standardDevice.prototype.getMapLngLat = function(){
	return this.status.getMapLngLat();
};

//取得经纬度信息
standardDevice.prototype.getLngLat = function(){
	return this.status.getLngLat();
};

//获取经纬度信息字符串
standardDevice.prototype.getLngLatStr = function(){
	return this.status.getLngLatStr();
};

//获取设备油量
standardDevice.prototype.getYouLiang = function(){
	return this.status.getYouLiang();
};

//获取设备油量字符串
standardDevice.prototype.getYouLiangStr = function(){
	return this.status.getYouLiangStr();
};

//是否为静止事件
standardDevice.prototype.isStillEvent = function() {
	return this.status.isStillEvent();
};

//判断设备是否在线
standardDevice.prototype.isOnline = function(){
	return this.status.isOnline();
};

//设置设备在线状态，并判断设备是否在线
standardDevice.prototype.setOnline = function(online){
	return this.status.setOnline(online);
};

standardDevice.prototype.isEqualStatus = function (status) {
	return this.status.isEqualStatus(status);
};

standardDevice.prototype.isEqualOnline = function (online) {
	return this.status.isEqualOnline(online);
};

//判断设备是否是视频设备
standardDevice.prototype.isVideoDevice = function(){
	if(this.module) {
		//是否应该按位来判断  afu 150603  
		var mod = Number(this.module);//.toString(2);
		if((mod>>0)&1 > 0) {
			return true;
		}else {
			return false;
		}
	}else {
		return false;
	}
};

//判断设备是否是GPS设备
standardDevice.prototype.isGpsDevice = function(){
	if(this.isVideoDevice()) {
		return false;
	}else {
		return true;
	}
};

//状态是否有效
standardDevice.prototype.isValid = function(){
	return this.status.isValid();
};

//设备是否定位状态
standardDevice.prototype.isGpsValid = function(){
	return this.status.isGpsValid();
};

//为最后一个有效的GPS信息，状态显示成定位无效，但GPS可以在地图上定位
standardDevice.prototype.isDeviceStop = function(){
	return this.status.isDeviceStop();
};

//取得GPS状态+报警
standardDevice.prototype.getGpsStatus = function(){
	return this.status.getGpsStatus();
};

//取得视频状态+报警
standardDevice.prototype.getVideoStatus = function(){
	return this.status.getVideoStatus(this);
};

//解析油量异常报警
standardDevice.prototype.getFuelAlarmStatus = function(){
	if(this.isOilSensorSupport()) {
		return this.status.getFuelAlarmStatus();
	}
	return null;
}

//取得油路控制器状态
standardDevice.prototype.getOilStatus = function(){
	if(this.isOilControlSupport()) {
		return this.status.getOilStatus();
	}
	return '';
};

//取得OBD状态
standardDevice.prototype.getObdStatus = function(){
	if(this.isObdSupport()) {
		return this.status.getObdStatus();
	}
	return '';
};

//取得电路控制器状态
standardDevice.prototype.getElectricStatus = function(){
	if(this.isElecControlSupport()) {
		return this.status.getElectricStatus();
	}
	return '';
};

//获取IO的状态
standardDevice.prototype.getIOStatus = function(){
	return this.status.getIOStatus(this);
};

//获取报警的IO名称
standardDevice.prototype.getIOAlarmName = function(){
	return this.status.getIOAlarmName(this);
};

//获取存储介质报警
standardDevice.prototype.getStorageAlarm = function(){
	if(this.status != null) {
		var disk = this.status.getDiskStatus();
		return disk.alarm;
	}
	return '';
};

//获取视频丢失状态 0-7
standardDevice.prototype.getVideoLostStatus = function(){
	if(this.status != null) {
		var videoLost = this.status.getVideoLostStatus(this);
		return videoLost.normal;
	}
	return "";
}

//获取通道录像状态 8-15
standardDevice.prototype.getRecordStatus = function(){
	if(this.status != null) {
		var record = this.status.getRecordStatus(this);
		return record.normal;
	}
	return "";
}

//是否支持对讲
standardDevice.prototype.isTalkbackSupport = function(){
	if(this.module) {
		var mod = Number(this.module);
		if((mod>>8)&1 > 0) {
			return true;
		}else {
			return false;
		}
	}else {
		return false;
	}
}

//是否支持监听
standardDevice.prototype.isMonitorSupport = function(){
	if(this.module) {
		var mod = Number(this.module);
		if((mod>>6)&1 > 0) {
			return true;
		}else {
			return false;
		}
	}else {
		return false;
	}
}

//是否支持数字对讲
standardDevice.prototype.isDigiIntercomSupport = function(){
	if(this.module) {
		var mod = Number(this.module);
		if((mod>>4)&1 > 0) {
			return true;
		}else {
			return false;
		}
	}else {
		return false;
	}
}

//是否支持油路控制器
standardDevice.prototype.isOilControlSupport = function(){
	if(this.module) {
		var mod = Number(this.module);
		if((mod>>1)&1 > 0) {
			return true;
		}else {
			return false;
		}
	}else {
		return false;
	}
}

//是否支持OBD
standardDevice.prototype.isObdSupport = function(){
	if(this.module) {
		var mod = Number(this.module);
		if((mod>>9)&1 > 0) {
			return true;
		}else {
			return false;
		}
	}else {
		return false;
	}
}

//是否支持电路控制器
standardDevice.prototype.isElecControlSupport = function(){
	if(this.module) {
		var mod = Number(this.module);
		if((mod>>2)&1 > 0) {
			return true;
		}else {
			return false;
		}
	}else {
		return false;
	}
}

//是否支持油量传感器
standardDevice.prototype.isOilSensorSupport = function(){
	if(this.module) {
		var mod = Number(this.module);
		if((mod>>7)&1 > 0) {
			return true;
		}else {
			return false;
		}
	}else {
		return false;
	}
}

//是否支持离线升级
standardDevice.prototype.hasOfflineUpgrade = function(){
	if(this.status.protocol == 1){
		return true;
	}else if(this.status.isJT808Protocol()){
		if(this.status.isCOOINTFactoryType() || this.status.isFZEFactoryType() || this.status.isHBFactoryType()){
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}
}

//是否支持TTS
standardDevice.prototype.isTTSSupport = function(){
	if(this.module) {
		var mod = Number(this.module);
		if((mod>>3)&1 > 0) {
			return true;
		}else {
			return false;
		}
	}else {
		return false;
	}
}

//是否支持胎压监测
standardDevice.prototype.hasTpms = function(){
	if(this.module) {
		var mod = Number(this.module);
		if((mod>>11)&1 > 0) {
			return true;
		}else {
			return false;
		}
	}else {
		return false;
	}
}

//设备本日流量是否受限  1
standardDevice.prototype.isFlowDayLimit = function(){
	return this.status.isFlowDayLimit();
};

//设备本月流量已经超过90%警界  1
standardDevice.prototype.isFlowMonthAlarm = function(){
	return this.status.isFlowMonthAlarm();
};

//设备本月流量已经用完  1
standardDevice.prototype.isFlowMonthLimit = function(){
	return this.status.isFlowMonthLimit();
};

//获取线路id
standardDevice.prototype.getLineId = function(){
	return this.status.getLineId();
}

//获取司机id
standardDevice.prototype.getDriverId = function(){
	return this.status.getDriverId();
}

//获取线路方向 0上行 1下行
standardDevice.prototype.getLineDirect = function(){
	return this.status.getLineDirect();
}

//获取线路方向 0上行 1下行
standardDevice.prototype.getLineDirectStr = function(){
	return this.status.getLineDirectStr();
}

//获取站点标识 0站点 1站场
standardDevice.prototype.getStationFlag = function(){
	return this.status.getStationFlag();
}

//获取站点索引
standardDevice.prototype.getStationIndex = function(){
	return this.status.getStationIndex();
}

//获取站点状态 1本站 0下站
standardDevice.prototype.getStationStatus = function(){
	return this.status.getStationStatus();
}