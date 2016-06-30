/**
 * 设备状态类，每个设备里面有对应一个状态，每个报警里对应一个开始状态和1个结束状态
 */
function standardStatus(devIdno) {
	this.devIdno = devIdno; // 设备编号
	this.online = null; // 在线状态
	this.youLiang = null; // 油量
	this.speed = null; // 速度
	this.liCheng = null; // 里程
	this.huangXiang = null; // 航向
	this.status1 = null; // 车辆状态1
	this.status2 = null; // 车辆状态2
	this.status3 = null; // 车辆状态3
	this.status4 = null; // 车辆状态4
	this.tempSensor1 = null; // 设备温度
	this.tempSensor2 = null; // 车厢温度
	this.tempSensor3 = null; // 车厢温度
	this.tempSensor4 = null; // 车厢温度
	this.jingDu = null; // 经度
	this.weiDu = null; // 纬度
	this.gaoDu = null; // 高度
	this.parkTime = null; // 停车时长

	this.mapJingDu = null; // 地图上显示的经度
	this.mapWeiDu = null; // 地图上显示的纬度

	this.gpsTime = null; // GPS时间
	this.gpsTimeStr = null; //

	this.protocol = null; // 通信协议

	this.isDrowing = false; // 是否正在被画区域操作，画区域时不更新位置点

	this.position = null; // 地理位置
	this.diskType = null; // //硬盘类型
	this.index = null; // 车辆的序号
	this.vehiIdno = null; // 车牌号

	// 公交线路
	this.lineId = null; // 线路id
	this.driverId = null; // 司机id
	this.lineDirect = null; // 线路方向 0上行 1下行
	this.stationFlag = null; // 站点标识 0站点 1站场
	this.stationIndex = null; // 站点索引
	this.stationStatus = null; // 站点状态 1本站 0下站
	// obd
	this.obdRpm = null;// OBD采集发动机转速
	this.obdSpeed = null;// OBD采集发动机速度
	this.obdVotage = null;// OBD采集电池电压
	this.obdJQTemp = null;// OBD采集燃油进气温度
	this.obdStatus = null;// OBD采集状态
	this.obdJQMPos = null;// OBD采集节气门位置
}

function getStatusGpsTime(status) {
	var gpstime = "";
	if (status.gt != null && status.gt != "") {
		if (status.gt.length > 19) {
			gpstime = status.gt.substring(0, 19);
		} else {
			gpstime = status.gt;
		}
	}
	return gpstime;
}

function getStatusGpsTimeEx(status) {
	var gpstime = "";
	if (status.gpsTimeStr != null && status.gpsTimeStr != "") {
		if (status.gpsTimeStr.length > 19) {
			gpstime = status.gpsTimeStr.substring(0, 19);
		} else {
			gpstime = status.gpsTimeStr;
		}
	}
	return gpstime;
}

standardStatus.prototype.setStatus = function(status) {
	// this.online = status.online; //报警事件里面的状态，是没有在线标识
	this.youLiang = status.yl;// status.youLiang; //油量
	this.speed = status.sp; // 速度
	this.liCheng = status.lc; // 里程
	this.huangXiang = status.hx; // 航向
	this.status1 = status.s1; // 车辆状态1
	this.status2 = status.s2; // 车辆状态2
	this.status3 = status.s3; // 车辆状态3
	this.status4 = status.s4; // 车辆状态4
	this.tempSensor1 = status.t1; // 设备温度
	this.tempSensor2 = status.t2; // 车厢温度
	this.tempSensor3 = status.t3; // 车厢温度
	this.tempSensor4 = status.t4; // 车厢温度
	this.gaoDu = status.gd; // 高度
	// status.gaoDu;
	this.parkTime = status.pk; // 停车时长

	this.isDrowing = status.isDrowing;
	if (!this.isDrowing) {
		this.jingDu = status.lng; // 经度
		this.weiDu = status.lat; // 纬度
		this.mapJingDu = status.mlng; // 地图上显示的经度
		this.mapWeiDu = status.mlat; // 地图上显示的纬度
	}

	var gpstime = getStatusGpsTime(status);
	this.gpsTime = gpstime; // GPS时间
	this.gpsTimeStr = gpstime; //

	if (typeof status.pt != "undefined") {
		this.protocol = status.pt; // 协议类型
		this.diskType = status.dt; // 硬盘类型
		this.factoryType = status.ft; // 厂家类型
		this.factoryDevType = status.fdt; // 厂家设备类型
	}

	this.position = "";// status.position;
	if (typeof status.index != "undefined") {
		this.index = status.index;
		this.vehiIdno = status.vehiIdno;
	}

	// 公交线路
	this.lineId = status.lid; // 线路id
	this.driverId = status.drid; // 司机id
	this.lineDirect = status.dct; // 线路方向 0上行 1下行
	this.stationFlag = status.sfg; // 站点标识 0站点 1站场
	this.stationIndex = status.snm; // 站点索引
	this.stationStatus = status.sst; // 站点状态 1本站 0下站
	// obd
	this.obdRpm = status.or;// OBD采集发动机转速
	this.obdSpeed = status.os;// OBD采集发动机速度
	this.obdVotage = status.ov;// OBD采集电池电压
	this.obdJQTemp = status.ojt;// OBD采集燃油进气温度
	this.obdStatus = status.ost;// OBD采集状态
	this.obdJQMPos = status.ojm;// OBD采集节气门位置
};

standardStatus.prototype.setStatusEx = function(status) {
	// this.online = status.online; //报警事件里面的状态，是没有在线标识
	this.youLiang = status.youLiang;// status.youLiang; //油量
	this.speed = status.speed; // 速度
	this.liCheng = status.liCheng; // 里程
	this.huangXiang = status.huangXiang; // 航向
	this.status1 = status.status1; // 车辆状态1
	this.status2 = status.status2; // 车辆状态2
	this.status3 = status.status3; // 车辆状态3
	this.status4 = status.status4; // 车辆状态4
	this.tempSensor1 = status.tempSensor1; // 设备温度
	this.tempSensor2 = status.tempSensor2; // 车厢温度
	this.tempSensor3 = status.tempSensor3; // 车厢温度
	this.tempSensor4 = status.tempSensor4; // 车厢温度
	this.gaoDu = status.gaoDu; // 高度
	// status.gaoDu;
	this.parkTime = status.parkTime; // 停车时长

	this.isDrowing = status.isDrowing;
	if (!this.isDrowing) {
		this.jingDu = status.jingDu; // 经度
		this.weiDu = status.weiDu; // 纬度
		this.mapJingDu = status.mapJingDu; // 地图上显示的经度
		this.mapWeiDu = status.mapWeiDu; // 地图上显示的纬度
	}

	var gpstime = getStatusGpsTimeEx(status);
	this.gpsTime = gpstime; // GPS时间
	this.gpsTimeStr = gpstime; //

	this.protocol = status.protocol; // 协议类型
	this.diskType = status.diskType; // 硬盘类型
	this.factoryType = status.factoryType; // 厂家类型
	this.factoryDevType = status.factoryDevType; // 厂家设备类型

	this.position = "";// status.position;
	if (typeof status.index != "undefined") {
		this.index = status.index;
		this.vehiIdno = status.vehiIdno;
	}

	// 公交线路
	this.lineId = status.lineId; // 线路id
	this.driverId = status.driverId; // 司机id
	this.lineDirect = status.lineDirect; // 线路方向 0上行 1下行
	this.stationFlag = status.stationFlag; // 站点标识 0站点 1站场
	this.stationIndex = status.stationIndex; // 站点索引
	this.stationStatus = status.stationStatus; // 站点状态 1本站 0下站
	// obd
	this.obdRpm = status.obdRpm;// OBD采集发动机转速
	this.obdSpeed = status.obdSpeed;// OBD采集发动机速度
	this.obdVotage = status.obdVotage;// OBD采集电池电压
	this.obdJQTemp = status.obdJQTemp;// OBD采集燃油进气温度
	this.obdStatus = status.obdStatus;// OBD采集状态
	this.obdJQMPos = status.obdJQMPos;// OBD采集节气门位置
};

// 判断是否报警屏蔽
standardStatus.prototype.isAlarmShield = function(armType) {
	// 判断报警类是否存在
	if (typeof alarmClass != "undefined" && alarmClass != null) {
		return alarmClass.isAlarmShield(armType);
	}
	return false;
};

// 判断是否WKP协议
standardStatus.prototype.isWKPProtocol = function() {
	if (this.protocol == null || Number(this.protocol) == 1) {
		return true;
	}
	return false;
}

// 判断是否WKP协议
standardStatus.prototype.isWKPProtocolEx = function() {
	if (this.protocol != null && Number(this.protocol) == 1) {
		return true;
	}
	return false;
}

// 判断是否TTX协议
standardStatus.prototype.isTTXProtocol = function() {
	if (this.protocol != null && Number(this.protocol) == 2) {
		return true;
	}
	return false;
}

// 判断是否JT808协议
standardStatus.prototype.isJT808Protocol = function() {
	if (this.protocol != null && Number(this.protocol) == 6) {
		return true;
	}
	return false;
}

// 判断协议是否易甲文
standardStatus.prototype.isRMProtocol = function() {
	if (this.protocol != null && Number(this.protocol) == 7) {
		return true;
	}
	return false;
}

// 判断厂家是否WKP类型
standardStatus.prototype.isWKPFactoryType = function() {
	if (this.factoryType != null && Number(this.factoryType) == 1) {
		return true;
	}
	return false;
}

// 判断厂家是否奥多视
standardStatus.prototype.isAUDSFactoryType = function() {
	if (this.factoryType != null && Number(this.factoryType) == 2) {
		return true;
	}
	return false;
}

// 判断厂家是否被使用
standardStatus.prototype.isKXFactoryType = function() {
	if (this.factoryType != null && Number(this.factoryType) == 3) {
		return true;
	}
	return false;
}

// 判断厂家是否忆志
standardStatus.prototype.isESTFactoryType = function() {
	if (this.factoryType != null && Number(this.factoryType) == 4) {
		return true;
	}
	return false;
}

// 判断厂家是否银星华电
standardStatus.prototype.isYXHDFactoryType = function() {
	if (this.factoryType != null && Number(this.factoryType) == 5) {
		return true;
	}
	return false;
}

// 判断厂家是否合众智慧
standardStatus.prototype.isCOOINTFactoryType = function() {
	if (this.factoryType != null && Number(this.factoryType) == 6) {
		return true;
	}
	return false;
}

// 判断厂家是否易甲文
standardStatus.prototype.isYJWFactoryType = function() {
	if (this.factoryType != null && Number(this.factoryType) == 7) {
		return true;
	}
	return false;
}

// 判断厂家是否锐驰曼
standardStatus.prototype.isRCMFactoryType = function() {
	if (this.factoryType != null && Number(this.factoryType) == 14) {
		return true;
	}
	return false;
}

// 判断是否通立厂家
standardStatus.prototype.isTLFactoryType = function() {
	if (this.factoryType != null && Number(this.factoryType) == 16) {
		return true;
	}
	return false;
}

// 判断是否国脉厂家
standardStatus.prototype.isGMFactoryType = function() {
	if (this.factoryType != null && Number(this.factoryType) == 17) {
		return true;
	}
	return false;
}

// 判断是否宏电厂家
standardStatus.prototype.isHDFactoryType = function() {
	if (this.factoryType != null && Number(this.factoryType) == 20) {
		return true;
	}
	return false;
}

// 判断厂家是否福泽尔
standardStatus.prototype.isFZEFactoryType = function() {
	if (this.factoryType != null && Number(this.factoryType) == 21) {
		return true;
	}
	return false;
}

// 判断是否锐哲（武汉）厂家
standardStatus.prototype.isRZFactoryType = function() {
	if (this.factoryType != null && Number(this.factoryType) == 22) {
		return true;
	}
	return false;
}

// 判断厂家是否华宝
standardStatus.prototype.isHBFactoryType = function() {
	if (this.factoryType != null && Number(this.factoryType) == 23) {
		return true;
	}
	return false;
}

// 设置设备在线状态
standardStatus.prototype.setOnline = function(online) {
	this.online = online;
};

// 设置序号
standardStatus.prototype.setIndex = function(index) {
	this.index = index;
};

// 设置车牌号
standardStatus.prototype.setVehiIdno = function(vehiIdno) {
	this.vehiIdno = vehiIdno;
};

// 设备状态是否有效
standardStatus.prototype.isValid = function() {
	return this.status1 != null ? true : false;
};

// 获取设备定位的gps时间
standardStatus.prototype.getGpsTime = function() {
	if (this.isValid()) {
		return this.gpsTime;
	}
	return '';
};

// 获取设备定位的gps时间字符串
standardStatus.prototype.getGpsTimeString = function() {
	if (this.getGpsTime() != null && this.getGpsTime() != '') {
		return this.gpsTimeStr;
	}
	return '';
};

// 获取设备定位的停车时长
standardStatus.prototype.getParkTime = function() {
	return this.parkTime;
};


// 获取设备定位的停车时间字符串
standardStatus.prototype.getParkTimeString = function() {
	if (this.parkTime != null) {
		return this.getTimeDifference(this.parkTime);
	}
	return '';
};

// 获取设备定位的地址
standardStatus.prototype.getPosition = function() {
	if (this.isValid() && this.position != null) {
		return this.position;
	}
	return "";
};

// 判断设备是否在线
standardStatus.prototype.isOnline = function() {
	if (this.isValid() && this.online != null && this.online > 0) {
		return true;
	} else {
		return false;
	}
};

// 判断状态更新时间是否相同
standardStatus.prototype.isEqualStatus = function(status) {
	var oldGpsTimeStr = this.getGpsTimeString();
	var newGpsTimeStr = "";
	if (status != null) {
		newGpsTimeStr = getStatusGpsTime(status);
	}
	if (oldGpsTimeStr != null && newGpsTimeStr != null) {
		if (oldGpsTimeStr == newGpsTimeStr) {
			return true;
		} else {
			return false;
		}
	} else if (oldGpsTimeStr == null && newGpsTimeStr == null) {
		return true;
	} else {
		return false;
	}
};

// 判断在线状态是否相同
standardStatus.prototype.isEqualOnline = function(online) {
	var oldOnline = this.online;
	if (oldOnline == null && online != null) {
		return false;
	} else if (oldOnline != null && online != null) {
		if (oldOnline == online) {
			return true;
		}
		return false;
	}
	return true;
}

// 设备是否定位状态
standardStatus.prototype.isGpsValid = function() {
	if (this.status1 != null) {
		var valid = (this.status1 & 0x01);
		if (valid == 1) {
			return true;
		}
	}
	return false;
};

// 为最后一个有效的GPS信息，状态显示成定位无效，但GPS可以在地图上定位
standardStatus.prototype.isDeviceStop = function() {
	if (this.status2 !== null) {
		var valid = ((this.status2 >> 18) & 0x01);
		if (valid == 1) {
			return true;
		}
	}
	return false;
};

// 设备ACC是否开启
standardStatus.prototype.isAccOpen = function() {
	if (this.status1 != null) {
		// 0表示ACC关闭1表示ACC开启
		var temp = (this.status1 >> 1) & 1;
		if (temp > 0) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};

// 获取设备ACC状态信息
standardStatus.prototype.getAccStatus = function() {
	if (this.isAccOpen()) {
		if (this.isStillEvent() && this.isParkOverTime()) {
			return parent.lang.monitor_parkAccon;
		} else {
			return parent.lang.monitor_accOpen;
		}
	} else {
		return parent.lang.monitor_accClose;
	}
}

// 获取设备转动状态
standardStatus.prototype.getDevTurnStatus = function() {
	var normal = [];
	if (this.status1 != null) {
		// 左转状态
		var temp = (this.status1 >> 2) & 1;
		if (temp > 0) {
			normal.push(parent.lang.monitor_turnLeft);
		}
		// 表示右转状态
		temp = (this.status1 >> 3) & 1;
		if (temp > 0) {
			normal.push(parent.lang.monitor_turnRight);
		}
		// 4位表示刹车状态，1刹车0无效
		temp = (this.status1 >> 4) & 1;
		if (temp > 0) {
			normal.push(parent.lang.monitor_brake);
		}
		// 5位表示正转
		temp = (this.status1 >> 5) & 1;
		if (temp > 0) {
			normal.push(parent.lang.monitor_turnPositive);
		}
		// 6位表示反转状态，1反转0无效
		temp = (this.status1 >> 6) & 1;
		if (temp > 0) {
			normal.push(parent.lang.monitor_turnReserve);
		}
	}
	return normal.toString();
}

// 设备gps天线状态是否正常
standardStatus.prototype.isAntennaNormal = function() {
	if (this.status1 != null) {
		// 7位GPS天线状态:存在 不存在
		var temp = (this.status1 >> 7) & 1;
		if (temp > 0) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

// 设备是否处于静止状态
standardStatus.prototype.isStillEvent = function() {
	if (this.status1 != null) {
		// 13处于静止状态
		var temp = (this.status1 >> 13) & 1;
		if (temp > 0) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};

// 设备是否停车超时 大于180s
standardStatus.prototype.isParkOverTime = function() {
	if (this.parkTime != null && this.parkTime >= 180) {
		return true;
	} else {
		return false;
	}
}

// 设备是否处于静止状态
standardStatus.prototype.isParkEvent = function() {
	// 13处于静止状态
	var temp = (this.status1 >> 13) & 1;
	if (temp > 0 && this.isParkOverTime()) {
		return true;
	} else {
		return false;
	}
};

// 判断设备是否停车未熄火
standardStatus.prototype.isParking = function() {
	if (this.isStillEvent() && this.isAccOpen()) {// } &&
													// !this.isParkOverTime()) {
		return true;
	}
	return false;
}

// 判断车辆是否停车熄火
standardStatus.prototype.isParked = function() {
	if (this.isStillEvent() && !this.isAccOpen()) {// } ||
													// this.isParkOverTime())) {
		return true;
	}
	return false;
}

// 时间秒数转换为时分秒
standardStatus.prototype.getTimeDifference = function(second) {
	var difValue = "";
	var days = parseInt(second / (60 * 60 * 24));
	var hours = parseInt(second % (60 * 60 * 24) / (60 * 60));
	var minutes = parseInt(second % (60 * 60) / 60);
	var seconds = parseInt(second % 60);
	if (days != 0) {
		difValue += days + ' ' + parent.lang.min_day;
	}
	if (hours != 0) {
		difValue += " " + hours + ' ' + parent.lang.min_hour;
	}
	if (minutes != 0) {
		difValue += " " + minutes + ' ' + parent.lang.min_minute;
	}
	if (seconds != 0) {
		difValue += " " + seconds + ' ' + parent.lang.min_second;
	}
	return difValue;
}

// 获取设备静止状态信息
standardStatus.prototype.getParkStatus = function() {
	var normal = [];
	var strPark = "";
	if (this.isParking()) {
		strPark = parent.lang.monitor_parkAccon;
		if (this.parkTime != 0) {
			strPark += "(" + this.getTimeDifference(this.parkTime) + ")";
		}
		normal.push(strPark);
	} else if (this.isParked()) {
		strPark = parent.lang.monitor_still;
		if (this.parkTime != 0) {
			strPark += "(" + this.getTimeDifference(this.parkTime) + ")";
		}
		normal.push(strPark);
	}
	return normal.toString();
};

standardStatus.prototype.getDiskType = function() {
	return this.diskType == null ? 1 : this.diskType;
};

standardStatus.prototype.getDiskTypeStr = function() {
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

// 判断硬盘状态
standardStatus.prototype.gpsGetDiskStatus = function(status, disk, isAlarm) {
	var data = {};
	data.isAlarm = false;
	if (status === 0) {
		if (isAlarm) {
			data.info = disk + parent.lang.monitor_diskNoExist;
			data.isAlarm = true;
		} else {
			data.info = disk + parent.lang.monitor_diskNoExist;
		}
	} else if (status == 2) {
		if (isAlarm) {
			data.info = disk + parent.lang.monitor_diskNoElec;
			data.isAlarm = true;
		} else {
			data.info = disk + parent.lang.monitor_diskNoElec;
		}
	} else {
		data.info = disk + parent.lang.monitor_diskNormal;
	}
	return data;
}

// 判断GPS设备硬盘状态
standardStatus.prototype.isDiskStatus = function() {
	// 31位硬盘状态（GPS设备时使用）1、无效 0、有效，要再判断1，2的状态
	var temp = (this.status1 >> 31) & 1;
	if (temp > 0) {
		return false;
	} else {
		return true;
	}
}

// 获取硬盘状态
standardStatus.prototype.getDiskStatus = function() {
	var ret = {};
	var alarm = [];
	var normal = [];
	if (this.status1 != null) {
		var diskName = this.getDiskTypeStr();
		// 8、9位表示硬盘状态
		var disk1Status = (this.status1 >> 8) & 3;
		// 28位表示盘符2状态 1表示有效
		// 29、30位表示，硬盘2的状态 0不存在，1存在，2断电
		var diskAlarm = false;
		var disk2Valid = (this.status1 >> 28) & 1;
		if (disk2Valid > 0) {
			var disk2Status = (this.status1 >> 29) & 3;
			// 如果是硬盘机，只要硬盘不存在就报警
			if (this.getDiskType() == 2) {
				if (disk1Status != 1) {
					if (this.isAlarmShield('39') && this.isAlarmShield('40')) {
						diskAlarm = false;
					} else {
						diskAlarm = true;
					}
				}
			}
			// 如果是卡机，两个sd卡
			// if(dev.getDiskType() == 1) {
			// if (disk1Status != 1 || disk2Status != 1) {
			// //如果硬盘状态有效，两个硬盘的卡，只要一个卡不存在就报警
			// diskAlarm = true;
			// }
			// }
			if (!diskAlarm) {
				if (disk1Status != 1 && disk2Status != 1) {
					// 如果硬盘状态有效，两个硬盘的卡，只要一个卡有效，则表示为正常状态
					if (this.isAlarmShield('39') && this.isAlarmShield('40')) {
						diskAlarm = false;
					} else {
						diskAlarm = true;
					}
				}
			}
			var disk1Name = parent.lang.monitor_disk1;
			if (this.getDiskType() == 2) {
				disk1Name = parent.lang.alarm_gps_disk;
			}
			if (this.getDiskType() != 2) {
				disk1Name = diskName + '1';
			}
			var diskInfo = this.gpsGetDiskStatus(disk1Status, disk1Name,
					diskAlarm);
			if (diskInfo.isAlarm && !this.isAlarmShield('39')) {
				alarm.push(diskInfo.info);
			} else {
				normal.push(diskInfo.info);
			}

			var disk2Name = parent.lang.monitor_disk2;
			// 硬盘机的硬盘2状态为SD卡状态
			if (this.getDiskType() == 2) {
				disk2Name = parent.lang.alarm_gps_sd;
			}
			if (this.getDiskType() != 2) {
				disk2Name = diskName + '2';
			}
			diskInfo = this.gpsGetDiskStatus(disk2Status, disk2Name, diskAlarm);
			if (diskInfo.isAlarm && !this.isAlarmShield('40')) {
				alarm.push(diskInfo.info);
			} else {
				normal.push(diskInfo.info);
			}
		} else {
			if (this.isAlarmShield('39')) {
				diskAlarm = false;
			} else {
				diskAlarm = true;
			}
			var diskInfo = this.gpsGetDiskStatus(disk1Status, diskName,
					diskAlarm);
			if (diskInfo.isAlarm) {
				alarm.push(diskInfo.info);
			} else {
				normal.push(diskInfo.info);
			}
		}
	}
	ret.alarm = alarm.toString();
	ret.normal = normal.toString();
	return ret;
}

// 获取3G模块状态
standardStatus.prototype.get3GStatus = function() {
	var ret = {};
	ret.alarm = '';
	ret.normal = '';
	if (this.status1 != null) {
		// 10、11、12位表示3G模块状态
		var temp = (this.status1 >> 10) & 7;
		if (temp === 0) {
			// if(this.isAlarmShield('166,167')) {
			// ret.normal = parent.lang.monitor_3gSimNoExist; //SIM卡不存在
			// }else {
			// ret.alarm = parent.lang.monitor_3gSimNoExist; //SIM卡不存在
			// }
		} else if (temp == 1) {
			ret.normal = parent.lang.monitor_3gPoor; // 3G信号差
		} else if (temp == 2) {
			ret.normal = parent.lang.monitor_3gPoor; // 3G信号差
		} else if (temp == 3) {
			ret.normal = parent.lang.monitor_3gNormal; // 3G信号一般
		} else if (temp == 4) {
			ret.normal = parent.lang.monitor_3gGood; // 3G信号好
		} else if (temp == 5) {
			ret.normal = parent.lang.monitor_3gExcellent; // 3G信号优
		} else if (temp == 6) {
			ret.normal = parent.lang.monitor_3gNoExist; // 3g模块不存在
		} else if (temp == 7) {
			ret.normal = parent.lang.monitor_3gClose; // 3G模块关闭
		}
	}
	return ret;
};

// 设备是否超速
standardStatus.prototype.isOverSpeed = function() {
	// 14处于超速状态
	var temp = (this.status1 >> 14) & 1;
	if (temp > 0) {
		return true;
	} else {
		return false;
	}
};

// 设备是否低速
standardStatus.prototype.isLowSpeed = function() {
	// 16处于低速状态
	var temp = (this.status1 >> 16) & 1;
	if (temp > 0) {
		return true;
	} else {
		return false;
	}
};

// 设备本日流量是否受限 1
standardStatus.prototype.isFlowDayLimit = function() {
	// 17位表示本日流量已经受限 1表示受限
	// var temp = (this.status1>>17)&1;
	// status2 9 位表示日流量超过
	var temp = (this.status2 >> 9) & 1;
	if (temp > 0) {
		return true;
	} else {
		return false;
	}
};

// 设备本月流量已经超过90%警界 1
standardStatus.prototype.isFlowMonthAlarm = function() {
	// 18位表示本月流量已经超过90%警界 1表示报警
	var temp = (this.status1 >> 18) & 1;
	if (temp > 0) {
		return true;
	} else {
		return false;
	}
};

// 设备本月流量已经用完 1
standardStatus.prototype.isFlowMonthLimit = function() {
	// 19位表示本月流量已经用完 1表示用完
	// var temp = (this.status1>>19)&1;
	// status2 11 位表示月流量超过
	var temp = (this.status2 >> 11) & 1;
	if (temp > 0) {
		return true;
	} else {
		return false;
	}
};

// 获取设备区域报警(电子围栏)
standardStatus.prototype.getMapFenceStatus = function() {
	var ret = {};
	var normal = [];
	var alarm = [];
	if (this.status2 != null) {
		// 进区域报警
		if (this.status2 & 0x01 > 0) {
			if (this.isAlarmShield('27,77')) {
				normal.push(parent.lang.alarm_type_fence_in);
			} else {
				alarm.push(parent.lang.alarm_type_fence_in);
			}
		}
		;
		// 出区域报警
		if ((this.status2 >> 1) & 1 > 0) {
			if (this.isAlarmShield('28,78')) {
				normal.push(parent.lang.alarm_type_fence_out);
			} else {
				alarm.push(parent.lang.alarm_type_fence_out);
			}
		}
		;
		// 区域内高速报警
		if ((this.status2 >> 2) & 1 > 0) {
			if (this.isAlarmShield('29,79')) {
				normal.push(parent.lang.alarm_type_fence_in_overspeed);
			} else {
				alarm.push(parent.lang.alarm_type_fence_in_overspeed);
			}
		}
		;
		// 区域内低速报警
		if ((this.status2 >> 3) & 1 > 0) {
			if (this.isAlarmShield('31,81')) {
				normal.push(parent.lang.alarm_type_fence_in_lowspeed);
			} else {
				alarm.push(parent.lang.alarm_type_fence_in_lowspeed);
			}
		}
		;
		// 区域外高速报警
		if ((this.status2 >> 4) & 1 > 0) {
			if (this.isAlarmShield('30,80')) {
				normal.push(parent.lang.alarm_type_fence_out_overspeed);
			} else {
				alarm.push(parent.lang.alarm_type_fence_out_overspeed);
			}
		}
		;
		// 区域外低速报警
		if ((this.status2 >> 5) & 1 > 0) {
			if (this.isAlarmShield('32,82')) {
				normal.push(parent.lang.alarm_type_fence_out_lowspeed);
			} else {
				alarm.push(parent.lang.alarm_type_fence_out_lowspeed);
			}
		}
		;
		// 区域内停车报警
		if ((this.status2 >> 6) & 1 > 0) {
			if (this.isAlarmShield('33,83')) {
				normal.push(parent.lang.alarm_type_fence_in_stop);
			} else {
				alarm.push(parent.lang.alarm_type_fence_in_stop);
			}
		}
		;
		// 区域外停车报警
		if ((this.status2 >> 7) & 1 > 0) {
			if (this.isAlarmShield('34,84')) {
				normal.push(parent.lang.alarm_type_fence_out_stop);
			} else {
				alarm.push(parent.lang.alarm_type_fence_out_stop);
			}
		}
		;
	}
	ret.alarm = alarm.toString();
	ret.normal = normal.toString();
	return ret;
}

// 获取设备使用流量状态
standardStatus.prototype.getFormatFlowStatus = function() {
	var alarm = [];
	if (this.status2 != null) {
		// 日流量预警
		if ((this.status2 >> 8) & 1 > 0) {
			alarm.push(parent.lang.alarm_type_flowDay_remind);
		}
		;
		// 日流量超过
		if ((this.status2 >> 9) & 1 > 0) {
			alarm.push(parent.lang.alarm_type_flowDay_over);
		}
		;
		// 月流量预警
		if ((this.status2 >> 10) & 1 > 0) {
			alarm.push(parent.lang.alarm_type_flowMonth_remind);
		}
		;
		// 月流量超过
		if ((this.status2 >> 11) & 1 > 0) {
			alarm.push(parent.lang.alarm_type_flowMonth_over);
		}
		;
	}
	return $.trim(alarm.toString());
};

// 主机掉电由后备电池供电
standardStatus.prototype.getPowerDownStatus = function() {
	if (this.status2 != null) {
		// 电池供电
		if ((this.status2 >> 12) & 1 > 0) {
			return parent.lang.alarm_type_powerDown;
		}
		;
	}
	return '';
};

// 车门开
standardStatus.prototype.getCarDoorStatus = function() {
	if (this.status2 != null) {
		if ((this.status2 >> 13) & 1 > 0) {
			return parent.lang.alarm_type_doorOpen;
		}
		;
	}
	return '';
};

// 车辆设防
standardStatus.prototype.getCarZoneStatus = function() {
	if (this.status2 != null) {
		if ((this.status2 >> 14) & 1 > 0) {
			return parent.lang.alarm_type_carZone;
		}
		;
	}
	return '';
};

// 电池状态
standardStatus.prototype.getCarBatteryStatus = function() {
	// 15 电池电压过低 16电池坏
	if (this.status2 != null) {
		if ((this.status2 >> 15) & 1 > 0) {
			return parent.lang.alarm_type_low_battery_voltage;
		} else if ((this.status2 >> 16) & 1 > 0) {
			return parent.lang.alarm_type_battery_bad;
		}
		;
	}
	return '';
};

// 获取发动机状态
standardStatus.prototype.getCarEngineStatus = function() {
	if (this.status2 != null) {
		if ((this.status2 >> 17) & 1 > 0) {
			return parent.lang.alarm_type_engine_bad; // 坏了
		}
	}
	return '';
};

// 运营状态（808）
standardStatus.prototype.getRunStatus = function() {
	if (this.status2 != null) {
		if (((this.status2 >> 20) & 1 > 0) && this.isJT808Protocol()) {
			return parent.lang.alarm_type_stop_status;// 停运
		}/*
			 * else { return parent.lang.alarm_type_run_status;//运营 }
			 */
	}
	return '';
}

// 经纬度未加密；1：已加密(808)
standardStatus.prototype.getEncipherStatus = function() {
	if (this.status2 != null) {
		if (((this.status2 >> 21) & 1 > 0) && this.isJT808Protocol()) {
			return parent.lang.alarm_type_encipher;
		}/*
			 * else { return parent.lang.alarm_type_not_encipher; }
			 */
	}
	return '';
}

// 22：油路正常，1：油路断开(808)
standardStatus.prototype.getOilStatus = function() {
	if (this.status2 != null) {
		if (((this.status2 >> 22) & 1 > 0) && this.isJT808Protocol()) {
			return parent.lang.alarm_type_oil_off;
		}/*
			 * else { return parent.lang.alarm_type_oil_normal; }
			 */
	}
	return '';
}

standardStatus.prototype.getObdStatus = function() {
	var str = '';
	if (this.obdSpeed != null) {
		str += parent.lang.report_speed + parent.lang.labelKmPerHour + ":"
				+ this.obdSpeed;
	} else {
		str += parent.lang.report_speed + parent.lang.labelKmPerHour + ":0";
	}
	if (this.obdRpm != null) {
		str += ";" + parent.lang.rotating_speed + ":" + this.obdRpm;
	} else {
		str += ";" + parent.lang.rotating_speed + ":0";
	}
	if (this.obdVotage != null) {
		str += ";" + parent.lang.battery_voltage + ":" + this.obdVotage / 10.0;
	} else {
		str += ";" + parent.lang.battery_voltage + ":0";
	}
	if (this.obdJQTemp != null) {
		str += ";" + parent.lang.intake_air_temperature + ":" + this.obdJQTemp;
	} else {
		str += ";" + parent.lang.intake_air_temperature + ":0";
	}
	if (this.obdJQMPos != null) {
		str += ";" + parent.lang.valve_position + ":" + this.obdJQMPos / 10.0;
	} else {
		str += ";" + parent.lang.valve_position + ":0";
	}
	if (this.obdStatus & 1 > 0) {
		str += ";ACC:" + parent.lang.open;
	} else {
		str += ";ACC:" + parent.lang.report_close;
	}
	if ((this.obdStatus >> 1) & 1 > 0) {
		str += ";" + parent.lang.clutch + ":" + parent.lang.open;
	} else {
		str += ";" + parent.lang.clutch + ":" + parent.lang.report_close;
	}
	if ((this.obdStatus >> 2) & 1 > 0) {
		str += ";" + parent.lang.brake + ":" + parent.lang.open;
	} else {
		str += ";" + parent.lang.brake + ":" + parent.lang.report_close;
	}
	if ((this.obdStatus >> 3) & 1 > 0) {
		str += ";PTO:" + parent.lang.open;
	} else {
		str += ";PTO:" + parent.lang.report_close;
	}
	if ((this.obdStatus >> 4) & 1 > 0) {
		str += ";" + parent.lang.emergency_brake + ":" + parent.lang.yes;
	}
	return str;
}

// 23：电路正常，1：电路断开(808)
standardStatus.prototype.getElectricStatus = function() {
	if (this.status2 != null) {
		if (((this.status2 >> 23) & 1 > 0) && this.isJT808Protocol()) {
			return parent.lang.alarm_type_electric_off;
		}/*
			 * else { return parent.lang.alarm_type_electric_normal; }
			 */
	}
	return '';
}

// 24：车门解锁，1：车门加锁(808)
standardStatus.prototype.getDoorStatus = function() {
	if (this.status2 != null) {
		if (((this.status2 >> 24) & 1 > 0) && this.isJT808Protocol()) {
			return parent.lang.alarm_type_lock;
		}/*
			 * else { return parent.lang.alarm_type_unlock; }
			 */
	}
	return '';
}

// 获取报警的IO名称
// uiStatus[0]
// 20-27表示IO输入1-8 状态
// uiStatus[2]
// 16-23表示IO输入9-16 状态
// 24-27表示IO输出1-4 状态
standardStatus.prototype.getIOAlarmName = function(device) {
	var ioInCount = device.getIoInCount();
	var ioInName = device.getIoInName();
	var ret = {};
	var normal = [];
	var alarm = [];
	for (var i = 0; i < ioInCount; i++) {
		if (i < 8) {
			var sk = 19 + i, ek = 69 + i;
			if ((this.status1 >> (20 + i)) & 1 > 0) {
				if (this.isAlarmShield('' + sk + ',' + ek + '')) {
					normal.push(ioInName[i]);
				} else {
					alarm.push(ioInName[i]);
				}
			}
		} else if (i < 16) {
			var sk = 33 + i, ek = 83 + i;
			if ((this.status3 >> (20 + i - 8)) & 1 > 0) {
				if (this.isAlarmShield('' + sk + ',' + ek + '')) {
					normal.push(ioInName[i]);
				} else {
					alarm.push(ioInName[i]);
				}
			}
		}
	}
	ret.normal = normal.toString();
	ret.alarm = alarm.toString();
	return ret;
}

// 获取IO的状态
standardStatus.prototype.getIOStatus = function(device) {
	var ret = {};
	var normal = '', alarm = '';
	var ioStatus = this.getIOAlarmName(device);
	if (ioStatus.normal != '') {
		normal = /* parent.lang.alarm_type_io_high + '：' + */ioStatus.normal;
	}
	if (ioStatus.alarm != '') {
		alarm = parent.lang.alarm_type_io_high + '：' + ioStatus.alarm;
	}
	// 4个输出 24-27保留
	ret.normal = normal;
	ret.alarm = alarm;
	return ret;
};

// 获取视频丢失状态 0-7
standardStatus.prototype.getVideoLostStatus = function(device) {
	var chnCount = device.getChnCount() > 8 ? 8 : device.getChnCount();
	var chnName = device.getChnName();
	var ret = {};
	ret.normal = '';
	ret.alarm = '';
	var alarm = [];
	for (var i = 0; i < chnCount; i++) {
		if ((this.status3 >> i) & 1 > 0) {
			alarm.push(device.getSingleChnName(i));
		}
	}
	var str = '';
	if (alarm.length > 0) {
		str = /*
				 * '<span class="b">' +
				 * parent.lang.alarm_type_video_lost_status + '：</span>' +
				 */alarm
				.toString();
	}
	// if(this.isAlarmShield('4,54')) {
	ret.normal = str;
	// }else {
	// ret.alarm = str;
	// }
	return ret;
}

// 获取通道录像状态 8-15
standardStatus.prototype.getRecordStatus = function(device) {
	var chnCount = device.getChnCount() > 8 ? 8 : device.getChnCount();
	var chnName = device.getChnName();
	var ret = {};
	ret.normal = '';
	ret.alarm = '';
	var alarm = [];
	for (var i = 0; i < chnCount; i++) {
		if ((this.status3 >> (8 + i)) & 1 > 0) {
			alarm.push(device.getSingleChnName(i));
		}
	}
	var str = '';
	if (alarm.length > 0) {
		str = /* '<span class="b">' + parent.lang.alarm_type_record_state + '：</span>' + */alarm
				.toString();
	}
	// if(this.isAlarmShield('4,54')) {
	ret.normal = str;
	// }else {
	// ret.alarm = str;
	// }
	return ret;
}

// 28-29 0表示GPS定位，1表示基站定位，2表示Wifi定位， 手机定位要显示这个定位信息
standardStatus.prototype.getPositionStatus = function() {
	if (this.status3 != null) {
		var state = (this.status3 >> 28) & 1 + 2 * ((this.status3 >> 29) & 1);
		switch (state) {
		case 0:
			return parent.lang.alarm_type_position_GPS;
		case 1:
			return parent.lang.alarm_type_position_GPRS;
		case 2:
			return parent.lang.alarm_type_position_WIFI;
		default:
			return parent.lang.alarm_type_position_GPS;
		}
	}
	return parent.lang.alarm_type_position_GPS;
}

// 解析报警状态
standardStatus.prototype.getAlarmStatus = function() {
	var ret = {};
	var normal = [];
	var alarm = [];
	if (this.status2 != null) {
		if ((this.status2 >> 15) & 1 > 0) {
			if (this.isAlarmShield('205,255')) {
				normal.push(parent.lang.alarm_type_mainSupplyUndervoltage);
			} else {
				alarm.push(parent.lang.alarm_type_mainSupplyUndervoltage);
			}
		}
		if ((this.status2 >> 16) & 1 > 0) {
			if (this.isAlarmShield('206,256')) {
				normal.push(parent.lang.alarm_type_mainPowerFailure);
			} else {
				alarm.push(parent.lang.alarm_type_mainPowerFailure);
			}
		}
		if ((this.status2 >> 25) & 1 > 0) {
			if (this.isAlarmShield('300,350')) {
				normal.push(parent.lang.alarm_type_areaOverSpeed_platform);
			} else {
				alarm.push(parent.lang.alarm_type_areaOverSpeed_platform);
			}
		}
		if ((this.status2 >> 26) & 1 > 0) {
			if (this.isAlarmShield('301,351')) {
				normal.push(parent.lang.alarm_type_areaLowSpeed_platform);
			} else {
				alarm.push(parent.lang.alarm_type_areaLowSpeed_platform);
			}
		}
		if ((this.status2 >> 27) & 1 > 0) {
			if (this.isAlarmShield('302,352')) {
				normal.push(parent.lang.alarm_type_areaInOut_platform);
			} else {
				alarm.push(parent.lang.alarm_type_areaInOut_platform);
			}
		}
		if ((this.status2 >> 28) & 1 > 0) {
			if (this.isAlarmShield('303,353')) {
				normal.push(parent.lang.alarm_type_lineInOut_platform);
			} else {
				alarm.push(parent.lang.alarm_type_lineInOut_platform);
			}
		}
		if ((this.status2 >> 29) & 1 > 0) {
			if (this.isAlarmShield('304,354')) {
				normal.push(parent.lang.alarm_type_overSpeed_platform);
			} else {
				alarm.push(parent.lang.alarm_type_overSpeed_platform);
			}
		}
		if ((this.status2 >> 30) & 1 > 0) {
			if (this.isAlarmShield('305,355')) {
				normal.push(parent.lang.alarm_type_lowSpeed_platform);
			} else {
				alarm.push(parent.lang.alarm_type_lowSpeed_platform);
			}
		}
		if ((this.status2 >> 31) & 1 > 0) {
			if (this.isAlarmShield('306,356')) {
				normal.push(parent.lang.alarm_type_fatigue_platform);
			} else {
				alarm.push(parent.lang.alarm_type_fatigue_platform);
			}
		}
	}
	if (this.status4 != null) {
		if ((this.status4 >> 3) & 1 > 0) {
			if (this.isAlarmShield('2,52')) {
				normal.push(parent.lang.alarm_type_emergency_alarm);
			} else {
				alarm.push(parent.lang.alarm_type_emergency_alarm);
			}
		}
		if ((this.status4 >> 4) & 1 > 0) {
			if (this.isAlarmShield('200,250')) {
				normal.push(parent.lang.alarm_type_regionalSpeedingAlarm);
			} else {
				alarm.push(parent.lang.alarm_type_regionalSpeedingAlarm);
			}
		}
		if ((this.status4 >> 5) & 1 > 0) {
			if (this.isAlarmShield('49,99')) {
				normal.push(parent.lang.alarm_type_fatigue);
			} else {
				alarm.push(parent.lang.alarm_type_fatigue);
			}
		}
		if ((this.status4 >> 6) & 1 > 0) {
			if (this.isAlarmShield('201,251')) {
				normal.push(parent.lang.alarm_type_earlyWarning);
			} else {
				alarm.push(parent.lang.alarm_type_earlyWarning);
			}
		}
		if ((this.status4 >> 13) & 1 > 0) {
			if (this.isAlarmShield('210,260')) {
				normal.push(parent.lang.alarm_type_cumulativeDayDrivingTimeout);
			} else {
				alarm.push(parent.lang.alarm_type_cumulativeDayDrivingTimeout);
			}
		}
		if ((this.status4 >> 14) & 1 > 0) {
			if (this.isAlarmShield('14,64')) {
				normal.push(parent.lang.alarm_type_overtimeParking);
			} else {
				alarm.push(parent.lang.alarm_type_overtimeParking);
			}
		}
		if ((this.status4 >> 15) & 1 > 0) {
			if (this.isAlarmShield('211,261')) {
				normal.push(parent.lang.alarm_type_outOfRegional);
			} else {
				alarm.push(parent.lang.alarm_type_outOfRegional);
			}
		}
		if ((this.status4 >> 16) & 1 > 0) {
			if (this.isAlarmShield('212,262')) {
				normal.push(parent.lang.alarm_type_outOfLine);
			} else {
				alarm.push(parent.lang.alarm_type_outOfLine);
			}
		}
		if ((this.status4 >> 17) & 1 > 0) {
			if (this.isAlarmShield('213,263')) {
				normal
						.push(parent.lang.alarm_type_InadequateOrTooLongRoadTravelTime);
			} else {
				alarm
						.push(parent.lang.alarm_type_InadequateOrTooLongRoadTravelTime);
			}
		}
		if ((this.status4 >> 18) & 1 > 0) {
			if (this.isAlarmShield('214,264')) {
				normal.push(parent.lang.alarm_type_routeDeviation);
			} else {
				alarm.push(parent.lang.alarm_type_routeDeviation);
			}
		}
		if ((this.status4 >> 19) & 1 > 0) {
			if (this.isAlarmShield('215,265')) {
				normal.push(parent.lang.alarm_type_VSSFailure);
			} else {
				alarm.push(parent.lang.alarm_type_VSSFailure);
			}
		}
		if ((this.status4 >> 21) & 1 > 0) {
			if (this.isAlarmShield('217,267')) {
				normal.push(parent.lang.alarm_type_antitheftDevice);
			} else {
				alarm.push(parent.lang.alarm_type_antitheftDevice);
			}
		}
		if ((this.status4 >> 22) & 1 > 0) {
			if (this.isAlarmShield('8,58')) {
				normal.push(parent.lang.alarm_type_illegalIgnition);
			} else {
				alarm.push(parent.lang.alarm_type_illegalIgnition);
			}
		}
		if ((this.status4 >> 23) & 1 > 0) {
			if (this.isAlarmShield('218,268')) {
				normal.push(parent.lang.alarm_type_illegalDisplacement);
			} else {
				alarm.push(parent.lang.alarm_type_illegalDisplacement);
			}
		}
		if ((this.status4 >> 24) & 1 > 0) {
			if (this.isAlarmShield('219,269')) {
				normal.push(parent.lang.alarm_type_rollover);
			} else {
				alarm.push(parent.lang.alarm_type_rollover);
			}
		}
		if ((this.status4 >> 25) & 1 > 0) {
			if (this.isAlarmShield('307,357')) {
				normal.push(parent.lang.alarm_type_parkTooLong_platform);
			} else {
				alarm.push(parent.lang.alarm_type_parkTooLong_platform);
			}
		}
		if ((this.status4 >> 26) & 1 > 0) {
			if (this.isAlarmShield('308,358')) {
				normal.push(parent.lang.alarm_type_areaPoint_platform);
			} else {
				alarm.push(parent.lang.alarm_type_areaPoint_platform);
			}
		}
		if ((this.status4 >> 27) & 1 > 0) {
			if (this.isAlarmShield('309,359')) {
				normal.push(parent.lang.alarm_type_lineOverSpeed_platform);
			} else {
				alarm.push(parent.lang.alarm_type_lineOverSpeed_platform);
			}
		}
		if ((this.status4 >> 28) & 1 > 0) {
			if (this.isAlarmShield('310,360')) {
				normal.push(parent.lang.alarm_type_lineLowSpeed_platform);
			} else {
				alarm.push(parent.lang.alarm_type_lineLowSpeed_platform);
			}
		}
	}
	ret.normal = normal.toString();
	ret.alarm = alarm.toString();
	return ret;
}

// 解析视频报警状态
standardStatus.prototype.getVideoAlarmStatus = function() {
	var ret = {};
	var normal = [];
	var alarm = [];
	if (this.status4 != null) {
		if ((this.status4 >> 7) & 1 > 0) {
			if (this.isAlarmShield('202,252')) {
				normal.push(parent.lang.alarm_type_GNSSModuleFailure);
			} else {
				alarm.push(parent.lang.alarm_type_GNSSModuleFailure);
			}
		}
		if ((this.status4 >> 8) & 1 > 0) {
			if (this.isAlarmShield('203,253')) {
				normal.push(parent.lang.alarm_type_GNSSAntennaMissedOrCut);
			} else {
				alarm.push(parent.lang.alarm_type_GNSSAntennaMissedOrCut);
			}
		}
		if ((this.status4 >> 9) & 1 > 0) {
			if (this.isAlarmShield('204,254')) {
				normal.push(parent.lang.alarm_type_GNSSAntennaShort);
			} else {
				alarm.push(parent.lang.alarm_type_GNSSAntennaShort);
			}
		}
		if ((this.status4 >> 10) & 1 > 0) {
			if (this.isAlarmShield('207,257')) {
				normal.push(parent.lang.alarm_type_LCDorDisplayFailure);
			} else {
				alarm.push(parent.lang.alarm_type_LCDorDisplayFailure);
			}
		}
		if ((this.status4 >> 11) & 1 > 0) {
			if (this.isAlarmShield('208,258')) {
				normal.push(parent.lang.alarm_type_TTSModuleFailure);
			} else {
				alarm.push(parent.lang.alarm_type_TTSModuleFailure);
			}
		}
		if ((this.status4 >> 12) & 1 > 0) {
			if (this.isAlarmShield('209,259')) {
				normal.push(parent.lang.alarm_type_cameraMalfunction);
			} else {
				alarm.push(parent.lang.alarm_type_cameraMalfunction);
			}
		}
	}
	ret.normal = normal.toString();
	ret.alarm = alarm.toString();
	return ret;
}

// 解析油量异常报警状态
standardStatus.prototype.getFuelAlarmStatus = function() {
	var ret = {};
	ret.normal = '';
	ret.alarm = '';
	if (this.status4 != null) {
		if ((this.status4 >> 20) & 1 > 0) {
			if (this.isAlarmShield('216,266')) {
				ret.normal = parent.lang.alarm_type_abnormalFuel;
			} else {
				ret.alarm = parent.lang.alarm_type_abnormalFuel;
			}
		}
	}
	return ret;
}

// 获取温度传感器信息
standardStatus.prototype.getTemperature = function(tempCount, tempName) {
	if (tempCount != null && tempCount > 0 && tempName != null) {
		var tempName = tempName.split(",");
		var tempSensor = [];
		tempSensor.push(this.tempSensor1);
		tempSensor.push(this.tempSensor2);
		tempSensor.push(this.tempSensor3);
		tempSensor.push(this.tempSensor4);

		var tempInfo = [];
		for (var i = 0; i < vehicle.tempCount && i < tempSensor.length; i += 1) {
			tempInfo.push(tempName[i] + parent.lang.colon
					+ gpsGetTemperature(tempSensor[i]));
		}
		return tempInfo.join(",");
	} else {
		return "";
	}
}

// 获取设备GPS状态+报警
standardStatus.prototype.getGpsStatus = function() {
	var ret = {};
	var normal = []; // list;
	var alarm = []; // list
	if (this.status1 != null) {
		if (!this.isGpsValid()) {
			if (this.isAlarmShield('45,85')) {
				normal.push(parent.lang.monitor_gpsUnvalid);
			} else {
				alarm.push(parent.lang.monitor_gpsUnvalid);
			}
		}

		if (this.isAccOpen()) {
			normal.push(parent.lang.monitor_accOpen);
		} else {
			if (this.isAlarmShield('66')) {
				normal.push(parent.lang.monitor_accClose);
			} else {
				// 只有当速度大于0，才当做报警
				normal.push(parent.lang.monitor_accClose);
			}
		}

		if (!this.isAlarmShield('11,61') && this.isOverSpeed()) {
			alarm.push(parent.lang.monitor_overSpeed);
		}

		if (!this.isAlarmShield('11,61') && this.isLowSpeed()) {
			alarm.push(parent.lang.monitor_lowSpeed);
		}

		var trun = this.getDevTurnStatus();
		if (trun != '') {
			normal.push(trun);
		}

		var park = this.getParkStatus();
		if (park != '') {
			normal.push(park);
		}

		var runStatus = this.getRunStatus();
		if (runStatus != '') {
			normal.push(runStatus);
		}

		var encipher = this.getEncipherStatus();
		if (encipher != '') {
			normal.push(encipher);
		}

		var powerDown = this.getPowerDownStatus();
		if (powerDown != '') {
			normal.push(powerDown);
		}

		var carDoor = this.getCarDoorStatus();
		if (carDoor != '') {
			normal.push(carDoor);
		}

		var carZone = this.getCarZoneStatus();
		if (carZone != '') {
			normal.push(carZone);
		}

		var carBattery = this.getCarBatteryStatus();
		if (carBattery != '') {
			normal.push(carBattery);
		}

		var carEngine = this.getCarEngineStatus();
		if (carEngine != '') {
			normal.push(carEngine);
		}

		var doorStatus = this.getDoorStatus();
		if (doorStatus != '') {
			normal.push(doorStatus);
		}

		// 定位类型 不显示
		/*
		 * var positionStatus = this.getPositionStatus(); if(positionStatus !=
		 * '') { normal.push(positionStatus); }
		 */

		var mapFence = this.getMapFenceStatus();
		if (mapFence.normal != '') {
			normal.push(mapFence.normal);
		}
		if (mapFence.alarm != '') {
			alarm.push(mapFence.alarm);
		}

		var alarmInfo = this.getAlarmStatus();
		if (alarmInfo.normal != '') {
			normal.push(alarmInfo.normal);
		}
		if (alarmInfo.alarm != '') {
			alarm.push(alarmInfo.alarm);
		}
	}
	ret.normal = normal.toString();
	ret.alarm = alarm.toString();
	return ret;
}

// 获取设备视频状态+报警
standardStatus.prototype.getVideoStatus = function(device) {
	var ret = {};
	var normal = []; // list;
	var alarm = []; // list
	if (this.status1 != null) {
		var disk = this.getDiskStatus();
		if (disk.normal != '') {
			normal.push(disk.normal);
		}
		if (disk.alarm != '') {
			alarm.push(disk.alarm);
		}

		var gps3G = this.get3GStatus();
		if (gps3G.normal != '') {
			normal.push(gps3G.normal);
		}
		if (gps3G.alarm != '') {
			alarm.push(gps3G.alarm);
		}

		// 正常不显示
		if (!this.isAntennaNormal()) {
			// normal.push(parent.lang.monitor_gpsAntennaNormal);
			// }else {
			normal.push(parent.lang.monitor_gpsAntennaUnvalid);
		}

		var formatFlow = this.getFormatFlowStatus();
		if (formatFlow != '') {
			alarm.push(formatFlow);
		}

		// if(device != null) {
		// var videoLost = this.getVideoLostStatus(device);
		// if(videoLost.normal != '') {
		// normal.push(videoLost.normal);
		// }
		// if(videoLost.alarm != '') {
		// alarm.push(videoLost.alarm);
		// }
		//			
		// var record = this.getRecordStatus(device);
		// if(record.normal != '') {
		// normal.push(record.normal);
		// }
		// if(record.alarm != '') {
		// alarm.push(record.alarm);
		// }
		// }

		var alarmInfo = this.getVideoAlarmStatus();
		if (alarmInfo.normal != '') {
			normal.push(alarmInfo.normal);
		}
		if (alarmInfo.alarm != '') {
			alarm.push(alarmInfo.alarm);
		}

	}
	ret.normal = normal.toString();
	ret.alarm = alarm.toString();
	return ret;
}

// 获取设备经度
standardStatus.prototype.getJingDu = function() {
	if (this.jingDu != null) {
		return this.jingDu / 1000000;
	} else {
		return 0;
	}
}

// 获取设备纬度
standardStatus.prototype.getWeiDu = function() {
	if (this.weiDu != null) {
		return this.weiDu / 1000000;
	} else {
		return 0;
	}
}

// 获取设备高度
standardStatus.prototype.getgaoDu = function(){
	if(this.gaoDu !== null && this.gaoDu >=0){
		return this.gaoDu;
	}else{
		return "0";
	}
}

// 获取高度字符串
standardStatus.prototype.getgaoDuString = function(){
	return this.getgaoDu() + ' ' + parent.lang.m;
}

// 获取设备里程
standardStatus.prototype.getLiCheng = function() {
	if (this.liCheng !== null && this.liCheng >= 0) {
		return this.liCheng / 1000;
	} else {
		return "0";
	}
}
// 获取设备里程字符串
standardStatus.prototype.getLiChengString = function() {
	return this.getLiCheng() + ' ' + parent.lang.km;
}

// 获取设备油量
standardStatus.prototype.getYouLiang = function() {
	if (this.youLiang != null) {
		return this.youLiang / 100;
	} else {
		return 0;
	}
}

// 获取设备油量字符串
standardStatus.prototype.getYouLiangStr = function() {
	return this.getYouLiang() + " " + parent.lang.alarm_oil_unit;
};

// 设备温度传感转换
standardStatus.prototype.gpsGetTemperature = function(temp) {
	if (temp !== null) {
		return temp / 100;
	} else {
		return 0;
	}
}

// 获取设备速度
standardStatus.prototype.getSpeed = function() {
	if (this.isGpsValid()) {
		if (this.speed != null) {
			if (isNaN(this.speed / 10)) {
				return (this.speed / 10).toFixed(2);
			}
			return this.speed / 10;
		} else {
			return "0";
		}
	} else {
		return "0";
	}
}

// 获取设备速度字符串
standardStatus.prototype.getSpeedString = function() {
	return this.getSpeed() + " " + parent.lang.KmPerHour;
}

// 设备获取方向
standardStatus.prototype.getDirection = function() {
	if (this.huangXiang != null) {
		return ((this.huangXiang + 22) / 45) & 0x7;
	} else {
		return 0;
	}
}

// 获取设备方向字符串
standardStatus.prototype.getHuangXiangString = function() {
	var direction = this.getDirection();
	var str = "";
	switch (direction) {
	case 0:
		str = parent.lang.north;
		break;
	case 1:
		str = parent.lang.northEast;
		break;
	case 2:
		str = parent.lang.east;
		break;
	case 3:
		str = parent.lang.southEast;
		break;
	case 4:
		str = parent.lang.south;
		break;
	case 5:
		str = parent.lang.southWest;
		break;
	case 6:
		str = parent.lang.west;
		break;
	case 7:
		str = parent.lang.northWest;
		break;
	default:
		break;
	}
	return str;
};

// 获取设备速度+方向字符串
standardStatus.prototype.getSpeedFangXiangString = function() {
	var ret = [];
	ret.push(this.getSpeedString() + '(' + this.getHuangXiangString() + ')');
	if (this.status1 != null) {
		if (this.isAlarmShield('11,61') && this.isOverSpeed()) {
			ret.push(parent.lang.monitor_overSpeed);
		}
		if (this.isAlarmShield('11,61') && this.isLowSpeed()) {
			ret.push(parent.lang.monitor_lowSpeed);
		}
	}
	return ret.toString();
}

// 获取车辆地图经纬度信息
standardStatus.prototype.getMapLngLat = function() {
	var point = null;
	if (this.isGpsValid()) {
		point = {};
		point.lng = this.mapJingDu;
		point.lat = this.mapWeiDu;
	}
	return point;
};

// 获取车辆地图经纬度信息
standardStatus.prototype.getMapLngLatStr = function() {
	if (this.isGpsValid()) {
		return this.mapWeiDu + "," + this.mapJingDu;
	} else {
		return "";
	}
};

// 获取车辆经纬度信息
standardStatus.prototype.getLngLat = function() {
	var point = null;
	if (this.isGpsValid()) {
		point = {};
		point.lng = this.jingDu / 1000000;
		point.lat = this.weiDu / 1000000;
	}
	return point;
};

// 获取车辆经纬度信息
standardStatus.prototype.getLngLatStr = function() {
	if (this.isGpsValid()) {
		return this.weiDu / 1000000 + "," + this.jingDu / 1000000;
	} else {
		return "";
	}
};

// 获取线路id
standardStatus.prototype.getLineId = function() {
	return this.lineId;
}

// 获取司机id
standardStatus.prototype.getDriverId = function() {
	return this.driverId;
}

// 获取线路方向 0上行 1下行
standardStatus.prototype.getLineDirect = function() {
	return this.lineDirect;
}

// 获取线路方向 0上行 1下行
standardStatus.prototype.getLineDirectStr = function() {
	if (this.lineDirect == 1) {
		return parent.lang.line_down;
	} else {
		return parent.lang.line_up;
	}
}

// 获取站点标识 0站点 1站场
standardStatus.prototype.getStationFlag = function() {
	return this.stationFlag;
}

// 获取站点索引
standardStatus.prototype.getStationIndex = function() {
	return this.stationIndex;
}

// 获取站点状态 1本站 0下站
standardStatus.prototype.getStationStatus = function() {
	return this.stationStatus;
}

// 解析实时车辆状态
standardStatus.prototype.parseStatusInfo = function() {
	var ret = {};
	// 取定位设备的速度
	ret.speed = this.getSpeedString() + '(' + this.getHuangXiangString() + ')';
	ret.gpsTime = this.getGpsTimeString();
	ret.parkTime = this.getParkTimeString();
	ret.endTime = dateTime2TimeString(dateStrLongTime2Date(this.getGpsTime())
			.getTime()
			+ this.parkTime * 1000);
	ret.direction = this.getDirection();
	// 取定位设备的里程
	ret.gaoDu = this.getgaoDuString();
	ret.ngaoDu = this.getgaoDu();
	ret.liCheng = this.getLiChengString();
	ret.nliCheng = this.getLiCheng();
	ret.position = this.getLngLatStr();
	var point = this.getMapLngLat();
	var deviceStop = this.isDeviceStop();
	if (point != null && !deviceStop) {
		ret.mapJingDu = point.lng;
		ret.mapWeiDu = point.lat;
		if (ret.position == '0,0') {
			ret.isGpsValid = false;
		} else {
			ret.isGpsValid = true;
		}
	} else {
		ret.mapJingDu = "";
		ret.mapWeiDu = "";
		ret.isGpsValid = false;
	}
	var html = [];
	html.push('<font>');
	// 位置
	html.push('<span class="b">' + parent.lang.monitor_labelPosition
			+ '</span>' + ret.position + '<br/>');
	// 时间
	html.push('<span class="b">' + parent.lang.labelTime + '</span>'
			+ ret.gpsTime + '<br/>');
	// 里程
	html.push('<span class="b">' + parent.lang.monitor_labelLiCheng + '</span>'
			+ ret.liCheng + '<br/>');
	// 高度
//	html.push('span class="b">' + parent.lang.monitor_labelGaoDu + '</span>')
//			+ret.gaoDu + '<br/>'
	// 速度
	html.push('<span class="b">' + parent.lang.labelSpeed + '</span>'
			+ ret.speed + '<br/>');
	// 解析车辆状态
	var vehicle = parent.vehicleManager.getVehicle(this.vehiIdno);
	var device = parent.vehicleManager.getDevice(this.devIdno);
	var alarm = [];
	var normal = [];
	var videoLostStatus = [];
	var recordStatus = [];
	var IOStatus = [];

	var gpsStatus_ = this.getGpsStatus();
	if (gpsStatus_.normal != '') {
		normal.push(gpsStatus_.normal);
	}
	if (gpsStatus_.alarm != '') {
		alarm.push(gpsStatus_.alarm);
	}

	// 油路
	if (device.isOilControlSupport()) {
		var oilStatus_ = this.getOilStatus();
		if (oilStatus_ != '') {
			normal.push(oilStatus_);
		}
	}

	// 电路
	if (device.isElecControlSupport()) {
		var electricStatus_ = this.getElectricStatus();
		if (electricStatus_ != '') {
			normal.push(electricStatus_);
		}
	}

	if (device.isOilSensorSupport()) {
		// 油量异常
		var fuelAlarmStatus_ = this.getFuelAlarmStatus();
		if (fuelAlarmStatus_ != null) {
			if (fuelAlarmStatus_.normal != '') {
				normal.push(fuelAlarmStatus_.normal);
			}
			if (fuelAlarmStatus_.alarm != '') {
				alarm.push(fuelAlarmStatus_.alarm);
			}
		}
		// 油量信息
		html.push('<span class="b">' + parent.lang.labelFuel + '</span>&nbsp;'
				+ this.getYouLiangStr() + '<br/>');
	}

	if (vehicle.getDevList().length == 1 && device.isVideoDevice()) {
		var videoStatus_ = this.getVideoStatus(device);
		if (videoStatus_.normal != '') {
			normal.push(videoStatus_.normal);
		}
		if (videoStatus_.alarm != '') {
			alarm.push(videoStatus_.alarm);
		}
		var videoLost = this.getVideoLostStatus(device);
		var record = this.getRecordStatus(device);
		if (videoLost.normal != '') {
			videoLostStatus.push(videoLost.normal);
		}
		if (record.normal != '') {
			recordStatus.push(record.normal);
		}
	}

	var IOStatus_ = this.getIOStatus(device);
	if (IOStatus_.normal != '') {
		IOStatus.push(IOStatus_.normal);
	}
	if (IOStatus_.alarm != '') {
		alarm.push(IOStatus_.alarm);
	}

	var alarmString = alarm.toString();
	var normalString = normal.toString();

	// 正常状态
	html.push('<span class="b">' + parent.lang.monitor_labelNormal + '</span>'
			+ normalString + '<br/>');
	// 有报警才显示
	if (alarmString != '') {
		// 报警
		html.push('<span class="b red">' + parent.lang.monitor_labelAlarm
				+ '</span>&nbsp;<span class="red">' + alarmString
				+ '</span><br/>');
	}
	// 录像状态
	var videoStatus = "";
	if (recordStatus.length > 0) {
		videoStatus += '<span class="b">' + parent.lang.monitor_video_status
				+ '</span>&nbsp;' + recordStatus.toString();
	}
	if (videoLostStatus.length > 0) {
		if (videoStatus != '') {
			videoStatus += ',' + parent.lang.alarm_type_video_lost_status + '：';
		} else {
			videoStatus += '<span class="b">'
					+ parent.lang.alarm_type_video_lost_status
					+ '：</span>&nbsp;';
		}
		videoStatus += videoLostStatus.toString();
	}
	if (IOStatus.length > 0) {
		if (videoStatus != '') {
			videoStatus += ',' + parent.lang.alarm_type_io_high + '：';
		} else {
			videoStatus += '<span class="b">' + parent.lang.alarm_type_io_high
					+ '：</span>&nbsp;';
		}
		videoStatus += IOStatus.toString();
	}
	if (videoStatus != '') {
		videoStatus += '<br/>';
		html.push(videoStatus);
	}
	// 温度传感器，这个暂缓
	// html.push('<span class="b">' + parent.lang.monitor_labelTemperature +
	// '</span>' + dev.getTemperature(vehicle, status) + '<br/>');
	html.push('</font>');

	// 判断报警状态，这边写死
	ret.normal = normalString;
	if (recordStatus.length > 0) {
		if (ret.normal != '') {
			ret.normal += ",";
		}
		ret.normal += parent.lang.monitor_video_status
				+ recordStatus.toString();
	}
	if (videoLostStatus.length > 0) {
		if (ret.normal != '') {
			ret.normal += ",";
		}
		ret.normal += parent.lang.alarm_type_video_lost_status + '：'
				+ videoLostStatus.toString();
	}
	if (IOStatus.length > 0) {
		if (ret.normal != '') {
			ret.normal += ",";
		}
		ret.normal += parent.lang.alarm_type_io_high + '：'
				+ IOStatus.toString();
	}

	ret.alarm = alarmString;

	// if(status.isOnline()) {
	ret.image = 0; // 正常状态
	ret.color = "#009900";

	if ($.trim(alarmString) != '') {
		ret.image = 3; // 报警状态
		ret.color = "#FF0000";
	}
	// 定位有效
	if (this.isValid() && this.isGpsValid()) {
		// 是否停车
		if (this.isParked()) {
			ret.image = 4; // 停车
			ret.color = "#FFD700";
		} else {// 判断是否为静止，并且ACC开启
			if (this.isParking()) {
				ret.image = 9; // 停车未熄火
				ret.color = "#000080";
			}
		}
	} else {// 定位无效
		ret.image = 2; // 无效
		ret.color = "#ED23EB";
	}
	// }else {
	// ret.image = 1; //离线
	// ret.color = "#808080";
	// }
	ret.statusString = html.join("");
	return ret;
}