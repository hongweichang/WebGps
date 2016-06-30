//通用函数定义

function gpsGetJingWeiDu(value) {
	return value / 1000000;
}

function gpsIsGpsValid(status1) {
	if (status1 !== null) {
		var valid = (status1&0x01);
		if (valid == 1) {
			return true;
		}
	}
	return false;
}

function gpsGetPosition(jingDu, weiDu, status1) {
	if (gpsIsGpsValid(status1)) {
		return weiDu / 1000000 + "," + jingDu / 1000000;
	} else {
		return " ";
	}
}

function gpsGetLiCheng(licheng) {	
	if (licheng !== null && licheng >= 0) {
		return licheng / 1000;
	} else {
		return "0";
	}
}

function gpsGetLiChengUnit() {
	return parent.lang.km;
	//parent.lang.mile;
}

function gpsGetSpeed(speed, status1) {
	if (gpsIsGpsValid(status1)) {
		return (speed / 10).toFixed(2);
	} else {
		return "";
	}
}

function gpsGetSpeedString(speed, status1) {
	return gpsGetSpeed(speed, status1) + " km/h";
}

function gpsGetSpeedHuangXiangString(speed, status1, huangXiang) {
	if (gpsIsGpsValid(status1)) {
		return  gpsGetSpeed(speed, status1) + ' (' + gpsGetHuangXiangString(huangXiang) + ')';
	} else {
		return "";
	}
}

function gpsGetYouLiang(youLiang) {
	return youLiang / 100;
}

function gpsGetDistanceUnit(isMeter) {
	if (isMeter) {
		return "M";
//			return "Foot";
	} else {
		return "KM";
//			return "Mile";
	}
}

function gpsGetLabelSecond() {
	return "(" + parent.lang.second + ")";
	//parent.lang.milePerHour;
}

function gpsGetSpeedUnit() {
	return parent.lang.KmPerHour;
	//parent.lang.milePerHour;
}

function gpsGetLabelSpeedUnit() {
	return parent.lang.labelKmPerHour;
	//parent.lang.milePerHour;
}

function gpsGetLabelLiChengUnit() {
	return parent.lang.labelLiChengKM;
	//parent.lang.milePerHour;
}

function gpsGetDistanceValue(val) {
	//1 metre(m)米 = 3.28 foot(ft)英尺 
	return val;
}

function gpsGetTemperature(temp) {
	if (temp !== null) {
		return temp / 100;
	} else {
		return 0;
	}
}

function gpsGetVehicleName(idno) {
	var name = "";
	for (var i = 0; i < parent.vehicleList.length; i += 1) {
		if(parent.vehicleList[i].idno == idno) {
			name = parent.vehicleList[i].userAccount.name;
			break;
		}
	}
	return name;
}

function gpsGetVehicleIdno(vehicleName) {
	var idno = "";
	for (var i = 0; i < parent.vehicleList.length; i += 1) {
		if(parent.vehicleList[i].userAccount.name == vehicleName) {
			idno = parent.vehicleList[i].idno;
			break;
		}
	}
	return idno;
}

function gpsGetVehicleObj(idno) {
	for (var i = 0; i < parent.vehicleList.length; i += 1) {
		if(parent.vehicleList[i].idno == idno) {
			return parent.vehicleList[i];
		}
	}
	return null;
}

function gpsGetVehicleIcon(idno) {
	var icon = 1;
	for (var i = 0; i < parent.vehicleList.length; i += 1) {
		if(parent.vehicleList[i].idno == idno) {
			if (parent.vehicleList[i].icon !== null) {
				icon = parent.vehicleList[i].icon;
			}
			break;
		}
	}
	return icon;
}


function gpsGetVehicleAllIoinName(idno) {
	var ioinName = "";
	for (var i = 0; i < parent.vehicleList.length; i += 1) {
		if(parent.vehicleList[i].idno == idno) {
			ioinName = parent.vehicleList[i].ioInName;
			break;
		}
	}
	return ioinName;
}

function gpsGetIoinName(ioinName, ioinIndex) {
	var ret = "";
	if (ioinName !== null) {
		var ioin = ioinName.split(',');
		if (ioinIndex < ioin.length) {
			ret = ioin[ioinIndex];
		}
	}
	if (ret === "") {
		ret = parent.lang.report_ioin + (ioinIndex + 1);
	}
	return ret;
}

function gpsGetVehicleIoinName(idno, ioinIndex) {
	return gpsGetIoinName(gpsGetVehicleAllIoinName(idno), ioinIndex);
}

function gpsGetVehicleAllChannelName(idno) {
	var chnName = "";
	for (var i = 0; i < parent.vehicleList.length; i += 1) {
		if(parent.vehicleList[i].idno == idno) {
			chnName = parent.vehicleList[i].chnName;
			break;
		}
	}
	return chnName;
}

function gpsGetChannelName(chnName, chnIndex) {
	var ret = "";
	if (chnName !== null) {
		var chn = chnName.split(',');
		if (chnIndex < chn.length) {
			ret = chn[chnIndex];
		}
	}
	if (ret === "") {
		ret = parent.lang.channel + (chnIndex + 1);
	}
	return ret;
}

function gpsGetChannelName_new(chnName, chnIndex) {
	var ret = "";
	if (chnName !== null) {
		var chn = chnName.split(',');
		var index = chnIndex.split(',');
		for(var i = 0; i < index.length; i++){
			if(ret != ""){
				ret += ",";
			}
			if(index[i] != ""){
				ret += chn[index[i]];
			}
		}
	}
	if (ret === "") {
		ret = parent.lang.channel + (chnIndex + 1);
	}
	return ret;
}

function gpsGetVehicleChannelName(idno, channel) {
	return gpsGetChannelName_new(gpsGetVehicleAllChannelName(idno), channel);
}

function gpsGetVehicleQueryList(name) {
	var devices = new Array();
	//为选择所有车辆信息
	if (parent.vehicleList !== null && parent.vehicleList.length > 0) {
		if (typeof name !== "undefined" && name !== null && name !== "") {
			for (var i = 0; i < parent.vehicleList.length; i += 1) {
				var vehicle = parent.vehicleList[i];
				if (vehicle.userAccount.name.indexOf(name) >= 0 
					|| vehicle.idno.indexOf(name) >= 0) {
					devices.push(vehicle.idno);
					continue;
				} 
			}
		} else {
			for (var i = 0; i < parent.vehicleList.length; i += 1) {
				devices.push(parent.vehicleList[i].idno);
			}
		}
	}
	return devices;
}

function gpsGetCurrentLiCheng() {
	return parent.lang.report_lichengCurrent + "(" + gpsGetDistanceUnit() + ")";
}

function gpsFormatSecond2Time(second) {
	var ret = [];
	if (second >= 3600) {
		ret.push(parseIntDecimal(second/3600));
	} else {
		ret.push(0);
	}
	second = second%3600;
	if (parseIntDecimal(second/60) > 0) {
		ret.push(parseIntDecimal(second/60));
	} else {
		ret.push(0);
	}
	second = second%60;
	if (second > 0) {
		ret.push(second);
	} else {
		ret.push(0);
	}
	return ret.join(":");
}

/**
 * 时间秒数转换为时分秒
 */
function getTimeDifference(second) {
	var difValue = "";
	var days = parseInt(second/(60*60*24));
	var hours =  parseInt(second/(60*60) - days*24);
	var minutes =  parseInt(second/(60) - days*24*60 - hours*60);
	var seconds =  parseInt(second - days*24*60*60 - hours*60*60 - minutes*60); 
	if(days != 0) {
		difValue += days + ' ' + parent.lang.min_day;
	} 
	if(hours != 0) {
		difValue += " " + hours + ' ' + parent.lang.min_hour;
	}
	if(minutes != 0) {
		difValue += " " + minutes + ' ' + parent.lang.min_minute;
	}
	if(seconds != 0) {
		difValue += " " + seconds + ' ' + parent.lang.min_second;
	}
	return difValue;
}

function gpsInitDistance(id) {
	$(id).append("<option value='0' selected>0" + gpsGetDistanceUnit(true) + "</option>");
	$(id).append("<option value='0.01'>10" + gpsGetDistanceUnit(true) + "</option>");
	$(id).append("<option value='0.1'>100" + gpsGetDistanceUnit(true) + "</option>");
	$(id).append("<option value='0.5'>500" + gpsGetDistanceUnit(true) + "</option>");
	$(id).append("<option value='1'>1" + gpsGetDistanceUnit(false) + "</option>");
	$(id).append("<option value='3'>3" + gpsGetDistanceUnit(false) + "</option>");
	$(id).append("<option value='5'>5" + gpsGetDistanceUnit(false) + "</option>");
	$(id).append("<option value='10'>10" + gpsGetDistanceUnit(false) + "</option>");
	$(id).append("<option value='30'>30" + gpsGetDistanceUnit(false) + "</option>");
}

function gpsGetDirection(huangXiang) {
	return ((huangXiang + 22) / 45 ) & 0x7;
}

function gpsGetHuangXiangString(huangXiang) {
	var direction = gpsGetDirection(huangXiang);
	var str = "";
	switch( direction )
	{
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
}

function gpsGetVehicleDriver(vehicle) {
	var driver = "";
	if (vehicle.driverName !== null) {
		driver = vehicle.driverName;
	}
	if (vehicle.driverTele !== null) {
		if (driver !== "") {
			driver = driver + "(" + vehicle.driverTele + ")";
		} else {
			driver = vehicle.driverTele;
		}
	}
	if (driver === "") {
		driver = " ";
	}
	return driver;
}

function gpsGetVehicleTemperature(vehicle, status) {
	if (vehicle.tempCount > 0) {
		var tempName = vehicle.tempName.split(",");
		var tempSensor = [];
		tempSensor.push(status.tempSensor1);
		tempSensor.push(status.tempSensor2);
		tempSensor.push(status.tempSensor3);
		tempSensor.push(status.tempSensor4);
		
		var tempInfo = [];
		for (var i = 0; i < vehicle.tempCount && i < tempSensor.length; i += 1) {
			tempInfo.push(tempName[i] + parent.lang.colon + gpsGetTemperature(tempSensor[i]));
		}
		return tempInfo.join(",");
	} else {
		return " ";
	}
}

function gpsGetDiskStatus(status, disk, isAlarm) {
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

function gpsIsParkOverTime(parkTime) {
	if(parkTime >= 180) {
		return true;
	} else {
		return false;
	}
}

function gpsIsParkEvent(status1, parkTime) {
	//13表示车辆是否处于静止状态
	var temp = (status1>>13)&1;
	if(temp > 0 && gpsIsParkOverTime(parkTime)) {
		return true;
	} else {
		return false;
	}
}

function gpsParseStatusInfo(vehicle, status1, parkTime) {
	//车辆状态共有
	//0位表示GPS定位状态		0无效1有效
	//1位表示ACC状态		0表示ACC关闭1表示ACC开启
	//2位表示左转状态		0无效1左转
	//3位表示右转状态		0无效1右转
	//4位表示刹车状态		0无效1刹车
	//5位表示正转状态		0无效1正转
	//6位表示反转状态		0无效1反转
	//7位表示GPS天线状态		0异常1正常
	//8,9位为表示硬盘状态		0不存在，1存在，2断电
	//10,11,12位表示3G模块状态  0模块不存在，1无信号，2信号差，3信号一般，4信号好，5信号优
	//13位表示静止状态
	//14位表示超速状态
	//15位表示补传状态		1表示GPS补传
	//16位表示区域报警		1表示报警（处于越界或者越线报警状态（电子围栏）
	//17位表示本日流量已经受限		1表示受限
	//18位表示本月流量已经超过90%警界	1表示报警
	//19位表示本月流量已经用完		1表示用完
	//关于停车未熄火，如果处理静止状态，并且处于ACC开启状态，则表示停车未熄火
	//20位表示IO1状态	1表示报警
	//21位表示IO2状态	1表示报警
	//22位表示IO3状态	1表示报警
	//23位表示IO4状态	1表示报警
	//24位表示IO5状态	1表示报警
	//25位表示IO6状态	1表示报警
	//26位表示IO7状态	1表示报警
	//27位表示IO8状态	1表示报警
	//28位表示盘符2状态	1表示有效
	//29、30位表示，硬盘2的状态		0不存在，1存在，2断电
	//报警：
	//状态：
	var data = {};
	data.accon = false;
	data.still = false;
	data.isAlarm = false;
	
	var alarm = [];
	var normal = [];
	var sStatus = status1;
	//GPS定位状态
	var temp = (sStatus>>0)&1;
	if (temp <= 0){
		alarm.push(parent.lang.monitor_gpsUnvalid);
	}
	//ACC状态
	temp = (sStatus>>1)&1;
	if (temp > 0){
		normal.push(parent.lang.monitor_accOpen);
		data.accon = true;
	} else {
		alarm.push(parent.lang.monitor_accClose);
	}
	//左转状态
	temp = (sStatus>>2)&1;
	if (temp > 0){
		normal.push(parent.lang.monitor_turnLeft);
	}
	//表示右转状态
	temp = (sStatus>>3)&1;
	if (temp > 0){
		normal.push(parent.lang.monitor_turnRight);
	}
	//4位表示刹车状态，1刹车0无效
	temp = (sStatus>>4)&1;
	if (temp > 0){
		normal.push(parent.lang.monitor_brake);
	}
	//5位表示正转	
	temp = (sStatus>>5)&1;
	if (temp > 0){
		normal.push(parent.lang.monitor_turnPositive);
	}
	//6位表示反转状态，1反转0无效
	temp = (sStatus>>6)&1;
	if (temp > 0){
		normal.push(parent.lang.monitor_turnReserve);
	}
	//7位GPS天线状态:正常
	temp = (sStatus>>7)&1;
	if (temp < 0) {
		alarm.push(parent.lang.monitor_gpsAntennaUnvalid);
	} else {
		normal.push(parent.lang.monitor_gpsAntennaNormal);
	}
	//8、9位表示硬盘状态
	var disk1Status = (sStatus>>8)&3;
	//28位表示盘符2状态	1表示有效
	//29、30位表示，硬盘2的状态		0不存在，1存在，2断电
	var disk2Valid = (sStatus>>28)&1;
	if (disk2Valid > 0) {
		var disk2Status = (sStatus>>29)&3;
		var diskAlarm = false;
		if (disk1Status != 1 && disk2Status != 1) {
			//如果硬盘状态有效，两个硬盘的卡，只要一个卡有效，则表示为正常状态
			diskAlarm = true;
		}
		var diskInfo = gpsGetDiskStatus(disk1Status, parent.lang.monitor_disk1, diskAlarm);
		if (diskInfo.isAlarm) {
			alarm.push(diskInfo.info);
		} else {
			normal.push(diskInfo.info);
		}
		diskInfo = gpsGetDiskStatus(disk2Status, parent.lang.monitor_disk2, diskAlarm);
		if (diskInfo.isAlarm) {
			alarm.push(diskInfo.info);
		} else {
			normal.push(diskInfo.info);
		}
	} else {
		var diskInfo = gpsGetDiskStatus(disk1Status, parent.lang.monitor_disk, true);
		if (diskInfo.isAlarm) {
			alarm.push(diskInfo.info);
		} else {
			normal.push(diskInfo.info);
		}
	}
	
	//10、11、12位表示3G模块状态
	temp = (sStatus>>10)&7;
	if (temp === 0) {
		normal.push(parent.lang.monitor_3gSimNoExist);	//SIM卡不存在
	} else if (temp == 1) {
		normal.push(parent.lang.monitor_3gPoor);		//3G信号差
	} else if (temp == 2) {
		normal.push(parent.lang.monitor_3gPoor);		//3G信号差
	} else if (temp == 3) {
		normal.push(parent.lang.monitor_3gNormal);	//3G信号一般
	} else if (temp == 4) {
		normal.push(parent.lang.monitor_3gGood);		//3G信号好
	} else if (temp == 5) {
		normal.push(parent.lang.monitor_3gExcellent);	//3G信号优
	} else if (temp == 6) {
		alarm.push(parent.lang.monitor_3gNoExist);	//3g模块不存在
	} else if (temp == 7) {
		normal.push(parent.lang.monitor_3gClose);	//3G模块关闭
	}
	//13表示车辆是否处于静止状态
	temp = (sStatus>>13)&1;
	if(temp > 0) {
		data.still = true;
		if (data.accon && parkTime >= 180) {
			normal.push(parent.lang.monitor_parkAccon + "(" + gpsFormatSecond2Time(parkTime) + ")");
		} else {
			normal.push(parent.lang.monitor_still + "(" + gpsFormatSecond2Time(parkTime) + ")");
		}
	}
	//14位表示超速
	temp = (sStatus>>14)&1;
	if(temp > 0) {
		alarm.push(parent.lang.monitor_overSpeed);
	}
	if (alarm.length > 0) {
		data.isAlarm = true;
		data.alarmString = alarm.join(",");
	} else {
		data.alarmString = " ";
	}
	if (normal.length > 0) {
		data.normalString = normal.join(",");
	} else {
		data.normalString = " ";
	}
	return data;
}

function gpsParseStatusSpeed(vehicle, speed, huangXiang, status1) {
	return '<span class="b">' + parent.lang.labelSpeed + '</span>' + gpsGetSpeedString(speed, status1) + '(' + gpsGetHuangXiangString(huangXiang) + ')<br/>';
}

function gpsParseStatusDriver(vehicle) {
	return '<span class="b">' + parent.lang.monitor_labelDriver + '</span>' + gpsGetVehicleDriver(vehicle) + '<br/>';
}

function gpsParseStatusTime(vehicle, timeStr) {
	//时间：2012-06-17 13:00:50
	return '<span class="b">' + parent.lang.labelTime + '</span>' + timeStr + '<br/>';
}

function gpsParseStatusTemperature(vehicle, status) {
	if (vehicle.tempCount > 0) {
		return '<span class="b">' + parent.lang.monitor_labelTemperature + '</span>' + gpsGetVehicleTemperature(vehicle, status) + '<br/>';
	} else {
		return "";
	}
}
//解析实时车辆状态
function gpsParseRealStatus(vehicle, status, timeStr) {
	var html=[];
	html.push('<font>');
	//时间
	html.push(gpsParseStatusTime(vehicle, timeStr));
	//速度
	html.push(gpsParseStatusSpeed(vehicle, status.speed, status.huangXiang, status.status1));
	//司机
	html.push(gpsParseStatusDriver(vehicle));	
	//解析车辆状态
	var info = gpsParseStatusInfo(vehicle, status.status1, status.parkTime);
	//报警
	html.push('<span class="b">' + parent.lang.monitor_labelAlarm + '</span>' + info.alarmString + '<br/>');
	//正常状态
	html.push('<span class="b">' + parent.lang.monitor_labelNormal + '</span>' + info.normalString + '<br/>');
	//温度传感器
	html.push(gpsParseStatusTemperature(vehicle, status));
	html.push('</font>');
	
	var ret = {};
	ret.isAlarm = info.isAlarm;
	ret.still = info.still;
	ret.accon = info.accon;
	ret.alarmString = info.alarmString;
	ret.normalString = info.normalString;
	ret.statusString = html.join("");
	return ret;
}

function gpsParseDeviceStatus(vehicle, status) {
	var data = {};
	var devType = "vehicle";
	if (vehicle.devType == 2) {
		devType = "person";
	} else if (vehicle.devType == 3) {
		devType = "dvr";
	}
	
	if (status === null || status.status1 === null) {
		data.image = 2;	//离线
		data.color = "#000000";
		data.statusString = " ";
		data.alarm = " ";
		data.normal = " ";
		data.vehiImg = devType + "_offline.gif";
		return data;
	}
	
	var info = gpsParseRealStatus(vehicle, status, dateTime2TimeString(status.gpsTime));
	data.statusString = info.statusString;
	data.alarm = info.alarmString;
	data.normal = info.normalString;

	if (status.online) {
		if (info.isAlarm > 0) {
			data.image = 3;	//报警状态
			data.vehiImg = devType + "_alarm.gif";
			data.color = "#FF0000";
			status.isAlarm = true;
		} else {
			//判断是否为静止，并且ACC开启
			if (info.still && info.accon && gpsIsParkOverTime(status.parkTime)) {
				data.image = 2;	//停车未熄火
				data.vehiImg = devType + "_parkaccon.gif";
				data.color = "#ED23EB";
				status.isParkAccon = true;
			} else {
				data.image = 0;	//正常状态
				data.vehiImg = devType + "_online.gif";
				data.color = "#009900";
			}
		}
	} else {
		data.image = 1;	//离线
		data.vehiImg = devType + "_offline.gif";
		data.color = "#000000";
	}
	return data;
}

function gpsParseTrackStatus(vehicle, track) {
	var data = {};
	if (track.status1 === null) {
		data.image = 2;	//离线
		data.color = "#000000";
		data.statusString = " ";
		data.alarm = " ";
		data.normal = " ";
		return data;
	}
	
	var info = gpsParseRealStatus(vehicle, track, track.gpsTime);
	data.statusString = info.statusString;
	data.alarm = info.alarmString;
	data.normal = info.normalString;
	if (info.isAlarm > 0) {
		data.image = 3;	//报警状态
		data.color = "#FF0000";
	} else {
		//判断是否为静止，并且ACC开启
		if (info.still && info.accon && gpsIsParkOverTime(track.parkTime)) {
			data.image = 2;	//停车未熄火
			data.color = "#ED23EB";
		} else {
			data.image = 0;	//正常状态
			data.color = "#009900";
		}
	}
	return data;
}
