/**
 * 每个报警有一个开始事件和1个结束事件
 */
function standardArmInfo(){
	this.devIdno = null;	//设备编号
	this.guid = null;		//String 	GUID是唯一的	
	this.armTime = null;		//Date String  "2015-06-03 11:00:00"
	this.armType = null;		//int		alarmType
	this.armIinfo = null;		//int		alarmInfo  公交管理为线路id
	this.param1 = null;			//int		param1  公交管理为司机id   
	this.param2 = null;			//int		param2  公交管理为前一个报站站点
	this.param3 = null;			//int		param3  公交管理为前一个报站时间  utc时间
	this.param4 = null;			//int		param4
	this.desc = null;		//string	szDesc
	this.imgFile = null;		//string	szImgFile
	this.startType = null;	//int		startAlarmType
	this.handle = null;			//int		handle
	this.reserve = null;    //int (录像时长)
	this.srcAlarmType = null; //int (1是图片，2是录像)
	this.srcTime = null;     //Date String  "2015-06-03 11:00:00"s (录像开始时间)
	this.status = new standardStatus();
}

standardArmInfo.prototype.setAlarm = function(alarm){
	this.devIdno = alarm.DevIDNO;	//设备编号
	//guid去汉字和特殊字符
	var isNum = /[^\w\.\/]/ig;
	if(isNum.test(alarm.guid)){
		alarm.guid = alarm.guid.replace(isNum,'');
	}
	this.guid = alarm.guid;		//String 	GUID是唯一的	
	this.armTime = alarm.time;		//Date String  "2015-06-03 11:00:00"
	this.armType = alarm.type;		//int		alarmType
	this.armIinfo = alarm.info;		//int		alarmInfo
	this.param1 = alarm.p1;			//int		param1
	this.param2 = alarm.p2;			//int		param2
	this.param3 = alarm.p3;			//int		param3
	this.param4 = alarm.p4;			//int		param4
	this.desc = alarm.desc;		//string	szDesc
	this.imgFile = alarm.img;		//string	szImgFile
	this.startType = alarm.stType;	//int		startAlarmType
	this.handle = alarm.hd;			//int		handle
	this.reserve = alarm.rve;    //int (录像时长)
	this.srcAlarmType = alarm.srcAt; //int (1是图片，2是录像)
	this.srcTime = alarm.srcTm;     //Date String  "2015-06-03 11:00:00"s (录像开始时间)
	this.status.setStatus(alarm.Gps);
};

standardArmInfo.prototype.getDevIdno = function() {
	return this.devIdno;
};

standardArmInfo.prototype.getArmType = function() {
	return this.armType;
};

standardArmInfo.prototype.getArmTime = function() {
	return this.armTime;
};

standardArmInfo.prototype.getLngLatStr = function() {
	return this.status.getLngLatStr();
};

standardArmInfo.prototype.getMapLngLat = function() {
	return this.status.getMapLngLat();
};

standardArmInfo.prototype.getMapLngLatStr = function() {
	return this.status.getMapLngLatStr();
};

/*
 * 报警类型和开始类型不一样的时候，就是为结束报警
 */
standardArmInfo.prototype.isStart = function(){
	if (this.startType == this.armType) {
		return true;
	} else{
		return false;
	}
};

/**
 * 每个报警有自己的guid
 */
function standardAlarm(guid, type){
	this.guid = guid;	//报警guid
	this.type = type;	//报警类型，此类型为开始类型
	this.startAlarm = null;	//开始报警事件
	this.endAlarm = null;	//结束报警事件
}

/**
 * 更新报警信息
 */
standardAlarm.prototype.setAlarm = function(alarm){
	if (alarm.isStart()) {
		this.startAlarm = alarm;
	} else {
		this.endAlarm = alarm;
	}
};

/**
 * 返回  报警类型，报警描述，开始时间，开始位置，结束时间，结束位置
 * isAnalStart 是否解析开始或者结束状态
 */
standardAlarm.prototype.parseAlarmInfo = function(isAnalStart){
	var ret = {};	
	//开始报警
	if (this.startAlarm != null) {
		ret.idno = this.startAlarm.getDevIdno();
		ret.startTime = this.startAlarm.getArmTime();
		var point = this.startAlarm.getMapLngLatStr();
		var pos = this.startAlarm.getLngLatStr();
		if(point == null || pos == '0,0') {
			pos = parent.lang.monitor_gpsUnvalid;
		}
		ret.startPos = pos;
		ret.startMapLngLat = point;
		ret.armType = this.startAlarm.getArmType();
	} else {
		ret.startTime = "";
		ret.startPos = '';
		ret.startMapLngLat = "";
	}
	//结束报警
	if (this.endAlarm != null) {
		ret.idno = this.endAlarm.getDevIdno();
		ret.endTime = this.endAlarm.getArmTime();
		var point = this.endAlarm.getMapLngLatStr();
		var pos = this.endAlarm.getLngLatStr();
		if(point == null || pos == '0,0') {
			pos = parent.lang.monitor_gpsUnvalid;
		}
		ret.endPos = pos;
		ret.endMapLngLat = point;
		ret.armType = this.endAlarm.getArmType();
	} else {
		ret.endTime = "";
		ret.endPos = "";
		ret.endMapLngLat = "";
	}
	
	//报警描述，具体问下邓工，让邓工把客户端解析代码给过来
	
	if(ret.armType) {
		var data = this.getFormatMDVRAlarmString(ret.armType);
		if(ret.armType == 130) {
			//如果是录像下载完成事件
			ret.time = ret.endTime;  //下载完成时间
			ret.recType = data.param3; //表示报警，还是常规
			ret.size = data.param2; //文件大小
			ret.chn = data.param1;  //通道
			ret.loc = data.param4;//存储位置 2存储服务器 4下载服务器
			ret.src = data.imgFile;  //路径
			ret.res = data.reserve;  //录像时长
			ret.srcType =  data.srcAlarmType; //1是图片，2是录像
			ret.bgTime = data.srcTime;  //录像开始时间
			ret.svr = data.armIinfo;  //服务器ID
		}else if(ret.armType == 113 && data.armIinfo == 19) {
			//离线任务通知
			//param1 == 1 {//下发图片文件
			//2	//升级文件 设备升级
			//3	//下发设备参数配置文件
			//4  /wifi围栏开关
			if(data.param2 == 1) {//0:未执行 1.任务中 2.成功3.失败
				ret.startTime = data.time;
				ret.startPos = data.pos;
				ret.startMapLngLat = data.point;
			}else {
				ret.endTime = data.time;
				ret.endPos = data.pos;
				ret.endMapLngLat = data.point;
			}
			ret.time = data.time;
			ret.armIinfo = data.armIinfo;
			ret.type = data.strType;
			ret.status = data.strDesc;
		}else {
			ret.type = data.strType;
			if(isAnalStart && data.strMark) {
				ret.type += ' ' + data.strMark;
			}
			ret.desc = data.strDesc;
		}
	}else {
		//报警类型
		ret.type = this.type.toString();
		ret.desc = '';
	}
	
	ret.color = "#FF0000";
	return ret;
};

/**
 * 获取油量字符串
 */
standardAlarm.prototype.getOilString = function(oil) {
	return oil/100.0 + ' ' + parent.lang.alarm_oil_unit;
}

/**
 * 获取温度字符串
 */
standardAlarm.prototype.getTempString = function(temp) {
	return temp/100.0 + ' ' + parent.lang.alarm_temperator_unit;
}

/**
 * 获取速度字符串
 */
standardAlarm.prototype.getSpeedString = function(speed) {
	return speed/10.0 + ' ' + parent.lang.KmPerHour;
}

/**
 *  获取通道字符串(包含多个通道)
 *  @param chnInfo  通道
 *  @param single  单通道或者多通道
 */
standardAlarm.prototype.getChnString = function(devIdno, chnInfo, single) {
	var device = parent.vehicleManager.getDevice(devIdno);
	var chnCount = device.getChnCount();
	var chnName = device.getChnName().split(',');
	chnInfo = Number(chnInfo);
	if(single) {
		if(chnInfo < chnName.length) {
			return chnName[chnInfo];
		}else {
			return 'CH'+(chnInfo+1);
		}
	}else {
		var strName = [];
		for (var i = 0; i < chnCount; i++) {
			if ((chnInfo>>i)&1 > 0) {
				strName.push(chnName[i]);
			}
		}
		return strName.toString();
	}
}

/**
 * 获取开始或者结束报警字符串
 */
standardAlarm.prototype.getAlarmStartEnd =function(type) {
	if(type == 1) {
		return parent.lang.alarm_alarmBegin;
	}else {
		return parent.lang.alarm_alarmEnd;
	}
} 

/**
 * 获取GPS讯号丢失报警
 */
standardAlarm.prototype.getSignalLossAlarm = function(armType) {
	var strMark = '';
	if(armType == 18) {
		strMark = this.getAlarmStartEnd(1);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_gps_signal_loss;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取自定义报警
 */
standardAlarm.prototype.getUserDefineAlarm = function(armType) {
	var strMark = '';
	if(armType == 1) {
		strMark = this.getAlarmStartEnd(1);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_userDefine;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取IO报警
 */
standardAlarm.prototype.getIOAlarm = function(io,armType) {
	var alarm = null;
	var strMark = '';
	if(armType == 19 || armType == 20 || armType == 21 || armType == 22 || armType == 23 ||
			armType == 24 || armType == 25 || armType == 26 || armType == 41 || armType == 42 ||
			armType == 43 || armType == 44 ) {
		strMark =  this.getAlarmStartEnd(1);
		alarm = this.startAlarm;
	}else {
		strMark =  this.getAlarmStartEnd(0);
		alarm = this.endAlarm;
	}
	var ioName = '';
	var device = parent.vehicleManager.getDevice(alarm.devIdno);
	var ioInName = device.getIoInName();
	if(ioInName != null && ioInName != '') {
		var ioInNames = ioInName.split(',');
		if(ioInNames.length >= (Number(io) + 1)) {
			ioName = ioInNames[io];
		}
	}
	if(ioName == '') {
		ioName = "IO_" + (Number(io) + 1);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_io;
	ret.strMark = strMark;
	ret.strDesc = ioName;
	return ret;
}

/**
 * 获取紧急按钮报警
 */
standardAlarm.prototype.getUrgencyButtonAlarm = function(armType) {
	var strMark = '';
	var strDesc = '';
	if(armType == 2) {
		if(this.startAlarm.param1 == 1) {
			strDesc = ' 1 '+ parent.lang.second;
		}else if(this.startAlarm.param1 == 5) {
			strDesc = ' 5 '+ parent.lang.second;
		}
		strMark = this.getAlarmStartEnd(1);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_ungency_button;
	ret.strMark = strMark;
	ret.strDesc = strDesc;
	return ret;
}

/**
 * 获取振动报警
 */
standardAlarm.prototype.getShakeAlarm = function(armType) {
	var strMark = '';
	if(armType == 3) {
		strMark = this.getAlarmStartEnd(1);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_shake;
	ret.strMark = strMark;
	return ret;
}

/**
 * 时间秒数转换为时分秒
 */
standardAlarm.prototype.getTimeDifference = function(second) {
	var difValue = "";
	var days = parseInt(second/(60*60*24), 10);
	var hours =  parseInt(second/(60*60) - days*24, 10);
	var minutes =  parseInt(second/(60) - days*24*60 - hours*60, 10);
	var seconds =  parseInt(second - days*24*60*60 - hours*60*60 - minutes*60, 10); 
	if(days != 0) {
		difValue += days + ' ' + parent.lang.min_day;
	} 
	if(hours != 0) {
		difValue += ' ' + hours + ' ' + parent.lang.min_hour;
	}
	if(minutes != 0) {
		difValue += ' ' + minutes + ' ' + parent.lang.min_minute;
	}
	if(seconds != 0) {
		difValue += ' ' + seconds + ' ' + parent.lang.min_second;
	}
	return difValue;
}

/**
 * 获取超时停车报警
 */
standardAlarm.prototype.getOvertimeParkAlarm = function(armType) {
	var alarm = null;
	var strKeepTime = '';
	var strSetTime = '';
	var strMark = '';
	if(armType == 14) {
		alarm = this.startAlarm;
		strMark = this.getAlarmStartEnd(1);
	}else {
		alarm = this.endAlarm;
		strMark = this.getAlarmStartEnd(0);
	}
	if(alarm.param2 != 0) {
		strKeepTime = parent.lang.alarm_park_labelParkTime + this.getTimeDifference(alarm.param2);
	}else {
		strKeepTime = parent.lang.alarm_park_labelParkTime + this.getTimeDifference(alarm.armIinfo);
	}
	if(alarm.param1) {
		strSetTime = ', ' + parent.lang.alarm_park_labelSetTime + this.getTimeDifference(alarm.param1);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_overtimeParking;
	ret.strMark = strMark;
	ret.strDesc = strKeepTime + strSetTime;
	return ret;
}

/**
 * 获取视频丢失报警
 */
standardAlarm.prototype.getVideoLostAlarm = function(armType) {
	var alarm = null;
	var strMark = '';
	if(armType == 4) {
		alarm = this.startAlarm;
		strMark = this.getAlarmStartEnd(1);
	}else {
		alarm = this.endAlarm;
		strMark = this.getAlarmStartEnd(0);
	}
	
	var ret = {};
	ret.strType = parent.lang.alarm_type_video_lost;
	ret.strMark = strMark;
	ret.strDesc = this.getChnString(alarm.getDevIdno(), alarm.armIinfo);
	return ret;
}

/**
 * 获取摄像头遮挡报警
 */
standardAlarm.prototype.getVideoMaskAlarm = function(armType) {
	var strMark = '';
	if(armType == 5) {
		strMark = this.getAlarmStartEnd(1);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_video_mask;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取非法开门报警
 */
standardAlarm.prototype.getDoorOpenLawlessAlarm = function(armType) {
	var strMark = '';
	if(armType == 6) {
		strMark = this.getAlarmStartEnd(1);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_door_open_lawless;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取密码错误三次报警
 */
standardAlarm.prototype.getWrongPwdAlarm = function(armType) {
	var strMark = '';
	if(armType == 7) {
		strMark = this.getAlarmStartEnd(1);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_erong_pwd;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取非法点火报警
 */
standardAlarm.prototype.getFireLowlessAlarm = function(armType) {
	var strMark = '';
	if(armType == 8) {
		strMark = this.getAlarmStartEnd(1);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_illegalIgnition;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取温度报警
 */
standardAlarm.prototype.getTemperatorAlarm = function(armType) {
	var strType = '';
	var strMark = '';
	var strDesc = '';
	if(armType == 9) {
		if(this.startAlarm.param1){
			strType = parent.lang.report_low_temperature_alarm;
		}else{
			strType = parent.lang.report_high_temperature_alarm;
		}
		var device = parent.vehicleManager.getDevice(this.startAlarm.devIdno);
		var tempName = device.getTempName();
		var names = tempName.split(",");
		var name = '';
		if(names.length > this.startAlarm.armIinfo + 1){
			name = names[this.startAlarm.armIinfo];
		}else{
			name = "TEMP_" + Number(this.startAlarm.armIinfo + 1);
		}
		strMark =  this.getAlarmStartEnd(1);
		strDesc= parent.lang.report_probe_no + ': ' + name + ";" + parent.lang.report_temp_current + ': ' + Number(this.startAlarm.param2/100.0);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	if(strType){
		ret.strType = strType;
	}else{
		ret.strType = parent.lang.alarm_type_temperator;
	}
	ret.strMark = strMark;
	ret.strDesc = strDesc;
	return ret;
}

/**
 * 根据硬盘类型获取硬盘
 */
standardAlarm.prototype.getDiskType = function(type) {
	var strdisk = '';
	switch (type) {
	case 0:
	case 1:	
		strdisk =  parent.lang.alarm_hard_type + '(' + parent.lang.alarm_gps_sd + ')';
		break;
	case 2:	
		strdisk =  parent.lang.alarm_hard_type + '(' + parent.lang.alarm_gps_disk + ')';
		break;
	case 3:	
		strdisk =  parent.lang.alarm_hard_type + '(' + parent.lang.alarm_gps_ssd + ')';
		break;
	}
	return strdisk;
}

/**
 * 获取硬盘错误报警
 */
standardAlarm.prototype.getDiskErrAlarm = function(armType) {
	var alarm = null;
	var strMark = '';
	if(armType == 10) {
		alarm = this.startAlarm;
		strMark =  this.getAlarmStartEnd(1);
	}else {
		alarm = this.endAlarm;
		strMark =  this.getAlarmStartEnd(0);
	}
	//硬盘
	var ret = {};
	ret.strType = parent.lang.alarm_type_disk_error;
	ret.strMark = strMark;
	ret.strDesc = this.getDiskType(alarm.armIinfo);
	return ret;
}

/**
 * 获取超速报警
 */
standardAlarm.prototype.getOverSpeedAlarm = function(armType) {
	var alarm = null;
	var strMark = '';
	var strType = '';
	var strDesc = '';
	if(armType == 11) {
		alarm = this.startAlarm;
		strMark =  this.getAlarmStartEnd(1);
	}else {
		alarm = this.endAlarm;
		strMark =  this.getAlarmStartEnd(0);
	}
	/*if(alarm.param3/10.0 > 0) {
		strDesc += parent.lang.alarm_speed + ': ' + this.getSpeedString(alarm.status.speed);
		strDesc += ', ' + parent.lang.alarm_minSpeed + ': ' + this.getSpeedString(alarm.param2);
		strDesc += ', ' + parent.lang.alarm_maxSpeed + ': ' + this.getSpeedString(alarm.param3);
	}else {*/
		strDesc += parent.lang.alarm_speed + ': ' + this.getSpeedString(alarm.status.speed);
//	}
	if(alarm.armIinfo == 0) {
		strType = parent.lang.alarm_type_overspeed;
	}else if(alarm.armIinfo == 1) {
		strType = parent.lang.alarm_type_low_speed;
	}
	var ret = {};
	ret.strType = strType;
	ret.strMark = strMark;
	ret.strDesc = strDesc;
	return ret;
}

/**
 * 获取夜间行驶报警
 */
standardAlarm.prototype.getNightDrivingAlarm = function(armType) {
	var strMark = '';
	if(armType == 151) {
		strMark = this.getAlarmStartEnd(1);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_nightdriving;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取聚众报警
 */
standardAlarm.prototype.getGatheringAlarm = function(armType) {
	var strMark = '';
	var strDesc = '';
	if(armType == 153) {
		strMark = this.getAlarmStartEnd(1);
		if(this.startAlarm.param1) {
			strDesc += parent.lang.alarm_speed_time + '(' + this.startAlarm.param1 + parent.lang.second + ')';
			strDesc += ', ' + parent.lang.alarm_vehicle_number + '(' + this.startAlarm.param2 + ')';
		}
	}else {
		strMark = this.getAlarmStartEnd(0);
		if(this.endAlarm.param1) {
			strDesc += parent.lang.alarm_speed_time + '(' + this.startAlarm.param1 + parent.lang.second + ')';
		}
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_gathering;
	ret.strMark = strMark;
	ret.strDesc = strDesc;
	return ret;
}

/**
 * 获取UPS 剪线报警
 */
standardAlarm.prototype.getUSPCutAlarm = function(armType) {
	var strMark = '';
	if(armType == 155) {
		strMark = this.getAlarmStartEnd(1);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_upsCut;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取硬盘超温报警
 */
standardAlarm.prototype.getHddHighTempAlarm = function(armType) {
	var alarm = null;
	var strMark = '';
	var strDesc = '';
	if(armType == 157) {
		alarm = this.startAlarm;
		strMark = this.getAlarmStartEnd(1);
	}else {
		alarm = this.endAlarm;
		strMark = this.getAlarmStartEnd(0);
	}
	//硬盘号
	strDesc += parent.lang.alarm_gps_disk + (Number(alarm.armIinfo) + 1);
	//硬盘类型
	strDesc += ', ' + this.getDiskType(alarm.param1);
	//温度
	strDesc += ', ' + parent.lang.alarm_temperator + '(' + alarm.param2 + parent.lang.alarm_temperator_unit + ')';
	var ret = {};
	ret.strType = parent.lang.alarm_type_highTemperature;
	ret.strMark = strMark;
	ret.strDesc = strDesc;
	return ret;
}

/**
 * 获取前面板被撬开报警
 */
standardAlarm.prototype.getBeBoOpenedAlarm = function(armType) {
	var strMark = '';
	if(armType == 159) {
		strMark = this.getAlarmStartEnd(1);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_before_board_opened;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取关机上报报警
 */
standardAlarm.prototype.getTurnOffAlarm = function(armType) {
	var strMark = '';
	if(armType == 161) {
		strMark = this.getAlarmStartEnd(1);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_turn_off;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取硬盘空间不足报警
 */
standardAlarm.prototype.getDiskSpaceAlarm = function(armType) {
	var strMark = '';
	var strDesc = '';
	var alarm = null;
	if(armType == 162) {
		strMark = this.getAlarmStartEnd(1);
		alarm = this.startAlarm;
	}else {
		strMark = this.getAlarmStartEnd(0);
		alarm = this.endAlarm;
	}
	//硬盘号
	strDesc += parent.lang.alarm_gps_disk + (Number(alarm.armIinfo) + 1);
	//硬盘类型
	strDesc += ', ' + this.getDiskType(alarm.param1);
	//总空间
	strDesc += ', ' + parent.lang.alarm_disk_all_capacity  + '(' + alarm.param2 + parent.lang.alarm_disk_unit_mb + ')';
	//剩余容量
	strDesc += ', ' + parent.lang.alarm_disk_sur_capacity  + '(' + alarm.param3 + parent.lang.alarm_disk_unit_mb + ')';
	
	var ret = {};
	ret.strType = parent.lang.alarm_type_defect_disk;
	ret.strMark = strMark;
	ret.strDesc = strDesc;
	return ret;
}

/**
 * 获取SIM卡丢失报警
 */
standardAlarm.prototype.getSimLostAlarm = function(armType) {
	var strMark = '';
	if(armType == 166) {
		strMark = this.getAlarmStartEnd(1);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_sim_lost;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取越界报警
 */
standardAlarm.prototype.getBeyondBoundsAlarm = function(armType) {
	var strMark = '';
	var strDesc = '';
	if(armType == 12) {
		strMark = this.getAlarmStartEnd(1);
		if(this.startAlarm.armIinfo == 0) {
			strDesc = parent.lang.alarm_beyond_bounds_into;
		}else {
			strDesc = parent.lang.alarm_beyond_bounds_out;
		}
		strDesc += ', ' + parent.lang.alarm_beyond_bounds_no + ': ' + this.startAlarm.param1;
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_beyond_bounds;
	ret.strMark = strMark;
	ret.strDesc = strDesc;
	return ret;
}

/**
 * 获取异常开关车门报警
 */
standardAlarm.prototype.getDoorAbnormalAlarm = function(armType) {
	var strMark = '';
	var strDesc = '';
	if(armType == 13) {
		strMark = this.getAlarmStartEnd(1);
		if(this.startAlarm.armIinfo == 0) {
			strDesc = parent.lang.alarm_door_abnormal_1;
		}else if(this.startAlarm.armIinfo == 1) {
			strDesc = parent.lang.alarm_door_abnormal_2;
		}else if(this.startAlarm.armIinfo == 2) {
			strDesc = parent.lang.alarm_door_abnormal_3;
		}
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_door_abnormal;
	ret.strMark = strMark;
	ret.strDesc = strDesc;
	return ret;
}

/**
 * 获取上下线报警
 */
standardAlarm.prototype.getOnlineAlarm = function(armType) {
	var strType = '';
	if(armType == 17) {
		strType = parent.lang.alarm_type_device_online;
	}else {
		strType = parent.lang.alarm_type_device_disOnline;
	}
	var ret = {};
	ret.strType = strType;
	return ret;
}

/**
 * 获取ACC报警
 */
standardAlarm.prototype.getACCAlarm = function(armType) {
	var strType = '';
	if(armType == 16) {
		strType = parent.lang.alarm_type_Acc_on;
	}else {
		strType = parent.lang.alarm_type_Acc_off;
	}
	var ret = {};
	ret.strType = strType;
	return ret;
}

/**
 * 获取移动侦测报警
 */
standardAlarm.prototype.getMotionAlarm = function(armType) {
	var strMark = '';
	var alarm = null;
	if(armType == 15) {
		strMark = this.getAlarmStartEnd(1);
		alarm = this.startAlarm;
	}else {
		strMark = this.getAlarmStartEnd(0);
		alarm = this.endAlarm;
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_motion;
	ret.strMark = strMark;
	ret.strDesc = this.getChnString(alarm.getDevIdno(), alarm.armIinfo);
	return ret;
}

/**
 * 获取油量报警
 */
standardAlarm.prototype.getOilAlarm = function(armType) {
	var strMark = '';
	var strType = '';
	var strDesc = '';
	var alarm = null;
	if(armType == 46 || armType == 86) {
		strType = parent.lang.alarm_type_add_oil;
		strDesc = parent.lang.alarm_oil_add;
		if(armType == 46) {
			strMark = this.getAlarmStartEnd(1);
			alarm = this.startAlarm;
		}else {
			strMark = this.getAlarmStartEnd(0);
			alarm = this.endAlarm;
		}
	}else {
		strType = parent.lang.alarm_type_dec_oil;
		strDesc = parent.lang.alarm_oil_dec;
		if(armType == 47) {
			strMark = this.getAlarmStartEnd(1);
			alarm = this.startAlarm;
		}else {
			strMark = this.getAlarmStartEnd(0);
			alarm = this.endAlarm;
		}
		
	}
	strDesc = parent.lang.alarm_type_oil_begin + ': ' + this.getOilString(alarm.param1) + ', ' + strDesc + ': ' + this.getOilString(alarm.armIinfo);
	
	var ret = {};
	ret.strType = strType;
	ret.strMark = strMark;
	ret.strDesc = strDesc;
	return ret;
}

//获取疲劳驾驶报警
standardAlarm.prototype.getFatigueAlarmString = function(armInfo) {
	var str = '';
	switch (armInfo) {
	case 0:
		break;
	case 1:
		str = parent.lang.alarm_fatigue_type1; 
		break;
	case 2:
		str = parent.lang.alarm_fatigue_type2; 
		break;
	case 3:
		str = parent.lang.alarm_fatigue_type3; 
		break;
	case 4:
		str = parent.lang.alarm_fatigue_type4; 
		break;
	}
	return str; 
}

/**
 * 获取疲劳驾驶报警
 */
standardAlarm.prototype.getFatigueAlarm = function(armType) {
	var strMark = '';
	var alarm = null;
	if(armType == 49) {
		strMark = this.getAlarmStartEnd(1);
		alarm = this.startAlarm;
	}else {
		strMark = this.getAlarmStartEnd(0);
		alarm = this.endAlarm;
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_fatigue;
	ret.strMark = strMark;
	ret.strDesc = this.getFatigueAlarmString(alarm.armIinfo);
	return ret;
}

//获取区域或者线路名称
standardAlarm.prototype.getAreaName = function(id) {
	if(parent.markers && parent.markers.length > 0) {
		for (var i = 0; i < parent.markers.length; i++) {
			if(parent.markers[i].id == id) {
				return parent.markers[i].name;
			}
		}
	}
	return id;
}

 // 解析区域
standardAlarm.prototype.getAreaType = function(alarm) {
	var str = '';
	switch (alarm.param1) {
	case 0:
		str = parent.lang.alarm_post_type + '(' + parent.lang.alarm_undefine_pos + ')';
		break;
	case 1:
		str = parent.lang.rule_areaName + '(' + this.getAreaName(alarm.param2) + '), ' + parent.lang.alarm_post_type + '(' + parent.lang.alarm_circle_area + ')';
		break;
	case 2:
		str = parent.lang.rule_areaName + '(' + this.getAreaName(alarm.param2) + '), ' + parent.lang.alarm_post_type + '(' + parent.lang.alarm_rect_area + ')';
		break;
	case 3:
		str = parent.lang.rule_areaName + '(' + this.getAreaName(alarm.param2) + '), ' + parent.lang.alarm_post_type + '(' + parent.lang.alarm_poligon_area + ')';
		break;
	case 4:
		str = parent.lang.alarm_route_name + '(' + this.getAreaName(alarm.param2) + '), ' + parent.lang.alarm_post_type + '(' + parent.lang.alarm_line + ')';
		break;
	}
	return str;
}

/**
 * 获取区域/线路超速、低速报警(平台产生)
 */
standardAlarm.prototype.getCMSAreaOverSpeedAlarm = function(armType) {
	var alarm = null;
	var strMark = '';
	var strType = '';
	if(armType == 300 || armType == 350) {
		strType = parent.lang.alarm_type_areaOverSpeed_platform;
	}else if(armType == 301 || armType == 351) {
		strType = parent.lang.alarm_type_areaLowSpeed_platform;
	}else if(armType == 309 || armType == 359) {
		strType = parent.lang.alarm_type_lineOverSpeed_platform;
	}else if(armType == 310 || armType == 360) {
		strType = parent.lang.alarm_type_lineLowSpeed_platform;
	}
	var strDesc = '';
	if(armType == 300 || armType == 301 || armType == 309 || armType == 310) {
		alarm = this.startAlarm;
		strMark =  this.getAlarmStartEnd(1);
	}else {
		alarm = this.endAlarm;
		strMark =  this.getAlarmStartEnd(0);
	}
	var strArea = this.getAreaType(alarm);
	strDesc = strArea + ', ' + parent.lang.alarm_speed_threshold + '(' + this.getSpeedString(alarm.param3 * 10)
			+ '), ' + parent.lang.alarm_current_speed + '(' + this.getSpeedString(alarm.status.speed) + ')';
	var ret = {};
	ret.strType = strType;
	ret.strMark = strMark;
	ret.strDesc = strDesc;
	return ret;
}

/**
 * 获取进出入区域、线路报警(平台产生)
 */
standardAlarm.prototype.getCMSAreaInOutAlarm = function(armType) {
	var alarm = null;
	var strMark = '';
	var strType = '';
	if(armType == 302 || armType == 352) {
		strType = parent.lang.alarm_type_areaInOut_platform;
	}else if(armType == 303 || armType == 353){
		strType = parent.lang.alarm_type_lineInOut_platform;
	}else if(armType == 211 || armType == 261){
		strType = parent.lang.alarm_type_outOfRegional;
	}else if(armType == 212 || armType == 262){
		strType = parent.lang.alarm_type_outOfLine;
	}
	
	var strDesc = '';
	if(armType == 302 || armType == 303 || armType == 211 || armType == 212) {
		alarm = this.startAlarm;
		strMark =  this.getAlarmStartEnd(1);
	}else {
		alarm = this.endAlarm;
		strMark =  this.getAlarmStartEnd(0);
	}
	var strArea = this.getAreaType(alarm);
	if(alarm.param3 == 0) {
		strDesc = strArea + ', ' + parent.lang.direction + '(' + parent.lang.into + ')';
	}else if(alarm.param3 == 1) {
		strDesc = strArea + ', ' + parent.lang.direction + '(' + parent.lang.out + ')';
	}
	
	var ret = {};
	ret.strType = strType;
	ret.strMark = strMark;
	ret.strDesc = strDesc;
	return ret;
}

/**
 * 获取时间段超速报警(平台产生)
 */
standardAlarm.prototype.getCMSTimeOverSpeedAlarm = function(armType) {
	var strMark = '';
	if(armType == 304) {
		strMark = this.getAlarmStartEnd(1);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_overSpeed_platform;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取时间段低速报警(平台产生)
 */
standardAlarm.prototype.getCMSTimeLowSpeedAlarm = function(armType) {
	var strMark = '';
	if(armType == 305) {
		strMark = this.getAlarmStartEnd(1);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_lowSpeed_platform;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取疲劳驾驶报警(平台产生)
 */
standardAlarm.prototype.getCMSFatigueAlarm = function(armType) {
	var strMark = '';
	if(armType == 306) {
		strMark = this.getAlarmStartEnd(1);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_fatigue_platform;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取超时停车报警(平台产生)
 */
standardAlarm.prototype.getCMSParkTooLongAlarm = function(armType) {
	var strMark = '';
	if(armType == 307) {
		strMark = this.getAlarmStartEnd(1);
	}else {
		strMark = this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_parkTooLong_platform;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取关键点监控报警(平台产生)
 */
standardAlarm.prototype.getCMSAreaPointAlarm = function(armType) {
	var alarm = null;
	var strMark = '';
	var strDesc = '';
	if(armType == 308) {
		alarm = this.startAlarm;
		strMark =  this.getAlarmStartEnd(1);
	}else {
		alarm = this.endAlarm;
		strMark =  this.getAlarmStartEnd(0);
	}
	var strArea = this.getAreaType(alarm);
	if(alarm.param3 == 0) {
		strDesc = strArea + ', ' + parent.lang.alarm_not_arrive;
	}else if(alarm.param3 == 1) {
		strDesc = strArea + ', ' + parent.lang.alarm_not_leave;
	}
	
	var ret = {};
	ret.strType = parent.lang.alarm_type_areaPoint_platform;
	ret.strMark = strMark;
	ret.strDesc = strDesc;
	return ret;
}

/**
 * 解析道路等級
 */
standardAlarm.prototype.getRoadLevel = function(type){
	var ret = parent.lang.alarm_road_level_lab;
	switch (type) {
	case 1:
		ret += parent.lang.alarm_road_highway;
		break;
	case 2:
		ret += parent.lang.alarm_road_city_highway;
		break;
	case 3:
		ret += parent.lang.alarm_road_state;
		break;
	case 4:
		ret += parent.lang.alarm_road_provincial;
		break;
	case 5:
		ret += parent.lang.alarm_road_county;
		break;
	case 6:
		ret += parent.lang.alarm_road_township;
		break;
	case 7:
		ret += parent.lang.alarm_road_other;
		break;
	case 8:
		ret += parent.lang.alarm_road_nine;
		break;
	case 9:
		ret += parent.lang.alarm_road_ferry;
		break;
	case 10:
		ret += parent.lang.alarm_road_pedestrian;
		break;
	}
	return ret;
}

/**
 * 获取道路等級超速报警(平台产生)
 */
standardAlarm.prototype.getCMSRoadLevelOverSpeedAlarm = function(armType) {
	var alarm = null;
	var strMark = '';
	var strDesc = '';
	if(armType == 311) {
		alarm = this.startAlarm;
		strMark =  this.getAlarmStartEnd(1);
	}else {
		alarm = this.endAlarm;
		strMark =  this.getAlarmStartEnd(0);
	}
	var strDesc = this.getRoadLevel(alarm.param1);
	strDesc += ','+ parent.lang.alarm_speed_threshold + '(' + this.getSpeedString(alarm.param3 * 10);
	strDesc += '), ' + parent.lang.alarm_current_speed + '(' + this.getSpeedString(alarm.status.speed) + ')';
	var ret = {};
	ret.strType = parent.lang.report_roadLvlOverSpeed_platform;
	ret.strMark = strMark;
	ret.strDesc = strDesc;
	return ret;
}

//获取录像类型
standardAlarm.prototype.getRecordTypeStr = function(type) {
	if(type == 1) {
		return parent.lang.alarm_rectype_alarm;
	}else {
		return parent.lang.alarm_rectype_normal;
	}
}

//获取文件大小
standardAlarm.prototype.getFileSize = function(size) {
	return (size * 1.0 / 1024 / 1024).toFixed(2) + parent.lang.alarm_disk_unit_mb;
}

/**
 * 获取图片文件或者录像文件下载完成事件
 */
standardAlarm.prototype.getEventFileDownload = function(armType) {
	var alarm = null;
	if(this.startAlarm != null) {
		alarm = this.startAlarm;
	}
	if(this.endAlarm != null) {
		alarm = this.endAlarm;
	}
	var ret = {};
	ret.param3 = alarm.param3; //表示报警，还是常规
	ret.param2 = alarm.param2; //文件大小
	ret.param1 = alarm.param1;  //通道
	ret.param4 = alarm.param4;//存储位置 2存储服务器 4下载服务器
	ret.imgFile = alarm.imgFile;  //路径
	ret.reserve = alarm.reserve;  //录像时长
	ret.srcAlarmType =  alarm.srcAlarmType; //1是图片，2是录像
	ret.srcTime = alarm.srcTime;  //录像开始时间
	ret.armIinfo = alarm.armIinfo;  //服务器ID
	
	return ret;
}


/**
 * 获取图片文件或者录像文件上传
 */
standardAlarm.prototype.getEventFileUpload = function(armType) {
	var alarm = null;
	var strType = '';//parent.lang.unknown;
	var strDesc = '';
	if(this.startAlarm != null) {
		alarm = this.startAlarm;
	}
	if(this.endAlarm != null) {
		alarm = this.endAlarm;
	}
	if(alarm.armIinfo == 2) {//图片上传成
		strType = parent.lang.alarm_type_record_upload;
	}else if(alarm.armIinfo == 1) {
		strType = parent.lang.alarm_type_image_upload;
	}
	var recType = 0;
	var size = 0;
	var chn = 0;
	var desc = '';
	if(armType == 109) { // 普通
		recType = alarm.param2;
		size = alarm.param1;
		chn = alarm.param4;
		desc = alarm.desc;
	}else if(armType == 130) { //报警
		recType = alarm.param3;
		size = alarm.param2;
		chn = alarm.param1;
		desc = alarm.imgFile;
	}
	
	strDesc = parent.lang.alarm_record_type + ': ' + this.getRecordTypeStr(recType) + ', ';
	strDesc += parent.lang.alarm_record_size + ': ' + this.getFileSize(size) + ', ';
	strDesc += parent.lang.alarm_channel + ': ' + this.getChnString(alarm.getDevIdno(), chn) + ', ';
	strDesc += parent.lang.alarm_file_name + ': ' +  desc;

	var ret = {};
	ret.strType = strType;
	ret.strDesc = strDesc;
	return ret;
}

/**
 * 驾驶员信息采集上报
 */
standardAlarm.prototype.getDriverInfo = function(armType) {
	var strType = parent.lang.alarm_driver_info;
	var strName = parent.lang.alarm_driver_name + ' : ';
	var strRegGet = parent.lang.alarm_driver_require_get + ' : ';
	var strID = parent.lang.alarm_driver_id + ' : ';
	var strReq = parent.lang.alarm_driver_require + ' : ';
	var ret = {};
	ret.strType = strType;
	ret.strDesc = strName + ', ' + strRegGet + ', ' + strID + ', ' + strReq;
	return ret;
}

//获取
standardAlarm.prototype.getRunDir = function(type) {
	if(type == 0) {
		return parent.lang.alarm_go;
	}else {
		return parent.lang.alarm_return;
	}
}

//获取
standardAlarm.prototype.getAutoStation = function(type) {
	if(type == 0) {
		return parent.lang.alarm_auto;
	}else {
		return parent.lang.alarm_manually;
	}
}

/**
 * 报站信息
 */
standardAlarm.prototype.getEventStationInfo = function(armType) {
	var alarm = null;
	var strType = '';
	var strDesc = '';
	if(this.startAlarm != null) {
		alarm = this.startAlarm;
	}
	if(this.endAlarm != null) {
		alarm = this.endAlarm;
	}
	switch (alarm.param1) {
	case 1:
		strType = parent.lang.alarm_event_in_station;
		break;
	case 2:
		strType = parent.lang.alarm_event_out_station;
		break;
	case 3:
		strType = parent.lang.alarm_event_over_speed_start;
		break;
	case 4:
		strType = parent.lang.alarm_event_over_speed_end;
		break;
	case 5:
		strType = parent.lang.alarm_event_delay_start;
		break;
	case 6:
		strType = parent.lang.alarm_event_delay_end;
		break;
	}
	strDesc = parent.lang.alarm_station_name + '(' + alarm.imgFile + '), ';
	strDesc += parent.lang.alarm_route_name + '(' + alarm.desc + '), ';
	strDesc += 'BSM(' + alarm.param2 + '), ';
	strDesc += this.getRunDir(alarm.param3) + ', ';
	strDesc += parent.lang.alarm_auto_station + '(' + this.getAutoStation(alarm.param4) + '), ';
	strDesc += parent.lang.alarm_run_number + '(' + alarm.armIinfo + ')';

	var ret = {};
	ret.strType = strType;
	ret.strDesc = strDesc;
	return ret;
}

/**
 * 获取围栏报警
 */
standardAlarm.prototype.getFenceAlarm = function(armType) {
	var alarm = null;
	var strMark = '';
	var strType = '';
	var strDesc = '';
	switch (armType) {
	case 27:
	case 77:
		strType = parent.lang.alarm_type_fence_in;
		break;
	case 28:
	case 78:
		strType = parent.lang.alarm_type_fence_out;
		break;
	case 29:
	case 79:
		strType = parent.lang.alarm_type_fence_in_overspeed;
		break;
	case 30:
	case 80:
		strType = parent.lang.alarm_type_fence_out_overspeed;
		break;
	case 31:
	case 81:
		strType = parent.lang.alarm_type_fence_in_lowspeed;
		break;
	case 32:
	case 82:
		strType = parent.lang.alarm_type_fence_out_lowspeed;
		break;
	case 33:
	case 83:
		strType = parent.lang.alarm_type_fence_in_stop;
		break;
	case 34:
	case 84:
		strType = parent.lang.alarm_type_fence_out_stop;
		break;
	}
	
	switch (armType) {
	case 77:
	case 78:
	case 79:
	case 80:
	case 81:
	case 82:
	case 83:
	case 84:
		alarm = this.endAlarm;
		strMark = this.getAlarmStartEnd(0);
		break;
	case 27:
	case 28:
	case 29:
	case 30:
	case 31:
	case 32:
	case 33:
	case 34:
		alarm = this.startAlarm;
		strMark = this.getAlarmStartEnd(1);
		break;
	}
	var strArea = this.getAreaType(alarm);
	switch (armType) {
	case 29:  //区域内高速报警
	case 30:  //区域外高速报警
	case 31:  //区域内低速报警
	case 32:  //区域外低速报警
	case 79:  //区域内高速报警
	case 80:  //区域外高速报警
	case 81:  //区域内低速报警
	case 82:  //区域外低速报警
		strDesc = ', ' + parent.lang.alarm_speed + ': ' + this.getSpeedString(alarm.status.speed);
		strDesc += ', ' + parent.lang.alarm_minSpeed + ': ' + this.getSpeedString(alarm.param2);
		strDesc += ', ' + parent.lang.alarm_maxSpeed + ': ' + this.getSpeedString(alarm.param3);	
		break;
	}
	
	var ret = {};
	ret.strType = strType;
	ret.strMark = strMark;
	ret.strDesc = strArea + strDesc;
	return ret;
}

/**
 * 获取区域超速报警
 */
standardAlarm.prototype.getAreaOverSpeedAlarm = function(armType) {
	var strMark = '';
	var alarm = null;
	if(armType == 200) {
		strMark =  this.getAlarmStartEnd(1);
		alarm = this.startAlarm;
	}else {
		strMark =  this.getAlarmStartEnd(0);
		alarm = this.endAlarm;
	}
	var strArea = this.getAreaType(alarm);
	var ret = {};
	ret.strType = parent.lang.alarm_type_regionalSpeedingAlarm;
	ret.strMark = strMark;
	ret.strDesc = strArea;
	return ret;
}

/**
 * 获取预警
 */
standardAlarm.prototype.getWarningAlarm = function(armType) {
	var strMark = '';
	if(armType == 201) {
		strMark =  this.getAlarmStartEnd(1);
	}else {
		strMark =  this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_earlyWarning;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取GNSS模块故障
 */
standardAlarm.prototype.getGNSSModuleFailureAlarm = function(armType) {
	var strMark = '';
	if(armType == 202) {
		strMark =  this.getAlarmStartEnd(1);
	}else {
		strMark =  this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_GNSSModuleFailure;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取GNSS天线未接或剪断
 */
standardAlarm.prototype.getGNSSAntennaMissedOrCutAlarm = function(armType) {
	var strMark = '';
	if(armType == 203) {
		strMark =  this.getAlarmStartEnd(1);
	}else {
		strMark =  this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_GNSSAntennaMissedOrCut;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取GNSS天线短路
 */
standardAlarm.prototype.getGNSSAntennaShortAlarm = function(armType) {
	var strMark = '';
	if(armType == 204) {
		strMark =  this.getAlarmStartEnd(1);
	}else {
		strMark =  this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_GNSSAntennaShort;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取主电源欠压
 */
standardAlarm.prototype.getSupplyUndervoltageAlarm = function(armType) {
	var strMark = '';
	if(armType == 205) {
		strMark =  this.getAlarmStartEnd(1);
	}else {
		strMark =  this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_mainSupplyUndervoltage;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取主电源掉电
 */
standardAlarm.prototype.getPowerFailureAlarm = function(armType) {
	var strMark = '';
	if(armType == 206) {
		strMark =  this.getAlarmStartEnd(1);
	}else {
		strMark =  this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_mainPowerFailure;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取LCD或显示器故障
 */
standardAlarm.prototype.getLCDFailureAlarm = function(armType) {
	var strMark = '';
	if(armType == 207) {
		strMark =  this.getAlarmStartEnd(1);
	}else {
		strMark =  this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_LCDorDisplayFailure;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取TTS模块故障
 */
standardAlarm.prototype.getTTSModuleFailureAlarm = function(armType) {
	var strMark = '';
	if(armType == 208) {
		strMark =  this.getAlarmStartEnd(1);
	}else {
		strMark =  this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_TTSModuleFailure;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取摄像头故障
 */
standardAlarm.prototype.getCameraFailureAlarm = function(armType) {
	var strMark = '';
	if(armType == 209) {
		strMark =  this.getAlarmStartEnd(1);
	}else {
		strMark =  this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_cameraMalfunction;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取当天累计驾驶超时
 */
standardAlarm.prototype.getDrivingTimeoutAlarm = function(armType) {
	var strMark = '';
	if(armType == 210) {
		strMark =  this.getAlarmStartEnd(1);
	}else {
		strMark =  this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_cumulativeDayDrivingTimeout;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取路段行驶时间不足或过长
 */
standardAlarm.prototype.getRoadTravelTimeAlarm = function(armType) {
	var strMark = '';
	var strType = '';
	var alarm = null;
	var strDesc = '';
	if(armType == 213) {
		strMark = this.getAlarmStartEnd(1);
		alarm = this.startAlarm;
	}else {
		strMark = this.getAlarmStartEnd(0);
		alarm = this.endAlarm;
	}
	switch (alarm.param3) {
	case 0:
		strType = parent.lang.alarm_type_drive_time_over;
		break;
	case 1:
		strType = parent.lang.alarm_type_drive_time_less;
		break;
	}
	strDesc = parent.lang.alarm_route_name + '(' + this.getAreaName(alarm.param1) + '), ';
	strDesc += parent.lang.time + '(' + alarm.param2 + parent.lang.min_second +')';
	
	var ret = {};
	ret.strType = strType;
	ret.strMark = strMark;
	ret.strDesc = strDesc;
	return ret;
}

/**
 * 获取路线偏离
 */
standardAlarm.prototype.getRouteDeviationAlarm = function(armType) {
	var strMark = '';
	if(armType == 214) {
		strMark =  this.getAlarmStartEnd(1);
	}else {
		strMark =  this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_routeDeviation;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取VSS故障
 */
standardAlarm.prototype.getVSSFailureAlarm = function(armType) {
	var strMark = '';
	if(armType == 215) {
		strMark =  this.getAlarmStartEnd(1);
	}else {
		strMark =  this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_VSSFailure;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取油量异常
 */
standardAlarm.prototype.getAbnormalFuelAlarm = function(armType) {
	var strMark = '';
	if(armType == 216) {
		strMark =  this.getAlarmStartEnd(1);
	}else {
		strMark =  this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_abnormalFuel;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取防盗器  车辆被盗
 */
standardAlarm.prototype.getAntitheftDeviceAlarm = function(armType) {
	var strMark = '';
	if(armType == 217) {
		strMark =  this.getAlarmStartEnd(1);
	}else {
		strMark =  this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_antitheftDevice;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取非法位移
 */
standardAlarm.prototype.getIllegalDisplacementAlarm = function(armType) {
	var strMark = '';
	if(armType == 218) {
		strMark =  this.getAlarmStartEnd(1);
	}else {
		strMark =  this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_illegalDisplacement;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取侧翻报警
 */
standardAlarm.prototype.getRolloverAlarm = function(armType) {
	var strMark = '';
	if(armType == 219) {
		strMark =  this.getAlarmStartEnd(1);
	}else {
		strMark =  this.getAlarmStartEnd(0);
	}
	var ret = {};
	ret.strType = parent.lang.alarm_type_rollover;
	ret.strMark = strMark;
	return ret;
}

/**
 * 获取离线任务通知
 * @param param1
 * @param param2
 * @returns {String}
 */
standardAlarm.prototype.getOflTaskInfo = function(param1, param2) {
	var ret = '';
	switch (Number(param2)) {
	case 0://未执行
		ret = parent.lang.notPerformed;
		break;
	case 1://任务中
		if(param1 == 1) {
			ret = parent.lang.alarm_dev_img_ing;
		}else if(param1 == 2) {
			ret = parent.lang.alarm_file_task_ing;
		}else if(param1 == 3) {
			ret = parent.lang.alarm_dev_conf_ing;
		}else if(param1 == 4) {
			ret = parent.lang.alarm_wifi_conf_ing;
		}
		break;
	case 2://成功
		if(param1 == 1) {
			ret = parent.lang.alarm_dev_img_success;
		}else if(param1 == 2) {
			ret = parent.lang.alarm_file_task_success;
		}else if(param1 == 3) {
			ret = parent.lang.alarm_dev_conf_success;
		}else if(param1 == 4) {
			ret = parent.lang.alarm_wifi_conf_success;
		}
		break;
	case 3://失败
		if(param1 == 1) {
			ret = parent.lang.alarm_dev_img_fail;
		}else if(param1 == 2) {
			ret = parent.lang.alarm_file_task_fail;
		}else if(param1 == 3) {
			ret = parent.lang.alarm_dev_conf_fail;
		}else if(param1 == 4) {
			ret = parent.lang.alarm_wifi_conf_fail;
		}
		break;
	default:
		ret = parent.lang.notPerformed;
		break;
	}
	return ret;
}

/**
 * 自定义报警
 * 离线任务通知
 */
standardAlarm.prototype.getCustomAlarmInfo = function(armType) {
	var strType = '';
	var strDesc = '';
	var alarm = null;
	if(this.startAlarm != null) {
		alarm = this.startAlarm;
	}
	if(this.endAlarm != null) {
		alarm = this.endAlarm;
	}
	if(armType == 113) {
		//离线任务通知
		if(alarm.armIinfo == 19) {
			//this.startAlarm.param1 == 1 {//下发图片文件
			//2	//升级文件 设备升级
			//3	//下发设备参数配置文件
			//4  /wifi围栏开关
			//strDesc = this.getOflTaskInfo(alarm.param1, alarm.param2);
			//任务类型
			switch (Number(alarm.param1)) {
			case 1:
				strType = pareng.lang.alarm_dev_iamge;
				break;
			case 2:
				strType = pareng.lang.alarm_dev_iamge;
				break;
			case 3:
				strType = pareng.lang.deviceUpgrade;
				break;
			case 4:
				strType = pareng.lang.alarm_wifi_config;
				break;
			}
			//任务状态
			switch (Number(alarm.param2)) {
			case 0:
				strDesc = parent.lang.notPerformed;
				break;
			case 1:
				strDesc = pareng.lang.taskExecution;
				break;
			case 2:
				strDesc = pareng.lang.taskCompletion;
				break;
			case 3:
				strDesc = pareng.lang.taskFails;
				break;
			default:
				strDesc = parent.lang.notPerformed;
				break;
			}
		}
	}
	var ret = {};
	ret.strType = strType;
	ret.strDesc = strDesc;
	ret.armIinfo = alarm.armIinfo;
	ret.param1 = alarm.param1;
	ret.param2 = alarm.param2;
	ret.time = alarm.getArmTime();
	var point = alarm.getMapLngLatStr();
	var pos = alarm.getLngLatStr();
	if(point == null || pos == '0,0') {
		pos = parent.lang.monitor_gpsUnvalid;
	}
	ret.pos = pos;
	ret.point = point;
	return ret;
}

//获取司机信息
standardAlarm.prototype.getDriverInfo = function(driverId) {
	if(parent.vehicleManager) {
		return parent.vehicleManager.getDriverInfo(driverId);
	}
	return null;
}

//获取线路信息
standardAlarm.prototype.getLineInfo = function(lineId) {
	if(parent.vehicleManager) {
		return parent.vehicleManager.getLineInfo(lineId);
	}
	return null;
}

//获取站点信息
standardAlarm.prototype.getStationInfo = function(lineId, lineDirect, stationIndex) {
	if(parent.vehicleManager) {
		var relationId_ = lineId+'-'+lineDirect+'-'+ stationIndex;
		var relation_ = parent.vehicleManager.getStationRelationEx(relationId_);
		if(relation_) {
			return parent.vehicleManager.getStationInfo(relation_.getStationId());
		}
	}
	return null;
}


/**
 * 报站信息
 */
standardAlarm.prototype.getBusArrivalStationInfo = function(armType) {
	var alarm = null;
	if(this.startAlarm != null) {
		alarm = this.startAlarm;
	}
	if(this.endAlarm != null) {
		alarm = this.endAlarm;
	}
	var strDesc = [];
	if(armType == 117) {
		var lineId = alarm.status.lineId; //线路id
		var lineDirect = alarm.status.lineDirect; //线路上下行 0 上行 1下行
		var stationId = alarm.status.stationFlag; //站点标识 0站点 1站场
		var stationIndex = alarm.status.stationIndex; //站点索引
		var stationStatus = alarm.status.stationStatus; //站点状态 1本站 0下站
		var driverId = alarm.param1;
		var lineInfo = this.getLineInfo(lineId);
		var stationIfo = this.getStationInfo(lineId, lineDirect, stationIndex);
		var nextStationInfo = this.getStationInfo(lineId, lineDirect, stationIndex+1);
		var driverInfo = this.getDriverInfo(driverId);
		
		var stationName = '';
		if(stationIfo) {
			stationName = stationIfo.getName();
		}
		var nextStationName = '';
		if(nextStationInfo) {
			nextStationName = nextStationInfo.getName();
		}
		var lineName = '';
		if(lineInfo) {
			lineName = lineInfo.getName()+'('+ lineInfo.getLineDirectStr() +')';
		}
		var driverName = '';
		if(driverInfo) {
			driverName = driverInfo.getName()+'('+ driverInfo.getJobNum() +')';
		}
		if(stationName) {
			strDesc.push(parent.lang.monitor_cur_station_label + stationName);
		}
		if(nextStationName) {
			strDesc.push(parent.lang.monitor_next_station_label + nextStationName);
		}
		if(lineName) {
			strDesc.push(parent.lang.monitor_belong_line_label + lineName);
		}
		if(driverName) {
			strDesc.push(parent.lang.monitor_labelDriver + driverName);
		}
	}
	var ret = {};
	ret.strType = parent.lang.monitor_vehicle_arrival_station;
	ret.strDesc = strDesc.toString();
	return ret;
}

/**
 * 溜站报警
 */
standardAlarm.prototype.getBusSlipStationAlarm = function(armType) {
	var alarm = null;
	if(this.startAlarm != null) {
		alarm = this.startAlarm;
	}
	if(this.endAlarm != null) {
		alarm = this.endAlarm;
	}
	var strDesc = [];
	if(armType == 118) {
		var lineId = alarm.status.lineId; //线路id
		var lineDirect = alarm.status.lineDirect; //线路上下行 0 上行 1下行
		var stationId = alarm.status.stationFlag; //站点标识 0站点 1站场
		var stationIndex = alarm.status.stationIndex; //站点索引
		var stationStatus = alarm.status.stationStatus; //站点状态 1本站 0下站
		var driverId = alarm.param1;
		var lineInfo = this.getLineInfo(lineId);
		var stationIfo = this.getStationInfo(lineId, lineDirect, stationIndex);
		var nextStationInfo = this.getStationInfo(lineId, lineDirect, stationIndex+1);
		var driverInfo = this.getDriverInfo(driverId);
		
		var stationName = '';
		if(stationIfo) {
			stationName = stationIfo.getName();
		}
		var nextStationName = '';
		if(nextStationInfo) {
			nextStationName = nextStationInfo.getName();
		}
		var lineName = '';
		if(lineInfo) {
			lineName = lineInfo.getName()+'('+ lineInfo.getLineDirectStr() +')';
		}
		var driverName = '';
		if(driverInfo) {
			driverName = driverInfo.getName()+'('+ driverInfo.getJobNum() +')';
		}
		strDesc.push(parent.lang.monitor_cur_station_label + stationName);
		strDesc.push(','+parent.lang.monitor_next_station_label + nextStationName);
		strDesc.push(','+parent.lang.monitor_belong_line_label + lineName);
		strDesc.push(','+parent.lang.monitor_labelDriver + driverName);
	}
	var ret = {};
	ret.strType = parent.lang.monitor_vehicle_arrival_station;
	ret.strDesc = strDesc.join("");
	return ret;
}

/**
 * 胎压报警
 */
standardAlarm.prototype.getTpmsAlarm = function(armType) {
	var ret = {};
	if(alarm.armIinfo == 1) {
		ret.strType = parent.lang.battery_voltage_warning;
	}else if(alarm.armIinfo == 2) {
		ret.strType = parent.lang.tire_pressure_abnormal_alarm;
	}else if(alarm.armIinfo == 3) {
		ret.strType = parent.lang.temperature_anomalies;
	}
	var strDesc = parent.lang.current_temperature + ":";
	if(alarm.param1){
		strDesc += alarm.param1/10.0 + parent.lang.alarm_temperator_unit + ";";
	}else{
		strDesc += 0 + parent.lang.alarm_temperator_unit + ";";
	}
	strDesc += parent.lang.the_current_tire_pressure + ":";
	if(alarm.param2){
		strDesc += alarm.param2/10.0 + "P;";
	}else{
		strDesc += 0 + "P;";
	}
	strDesc += parent.lang.current_voltage + ":";
	if(alarm.param3){
		strDesc += alarm.param3/10.0 + "V;";
	}else{
		strDesc += 0 + "V;";
	}
	if(alarm.param4 > 0){
		strDesc += parent.lang.sensor_number + ":";
		if(alarm.param4 < 11){
			strDesc += "TPMS" + parent.lang.left + alarm.param4 + ";";
		}else if(alarm.param4 >= 11 && alarm.param4 < 20){
			strDesc += "TPMS" + parent.lang.right + alarm.param4%10 + ";";
		}else if(alarm.param4 == 110){
			strDesc += "TPMS" + parent.lang.right + "10;";
		}
	}
	ret.strDesc = strDesc;
	return ret;
}
		
/**
 * 解析报警类型
 */
standardAlarm.prototype.getFormatMDVRAlarmString = function(armType) {
	switch (armType) {
	case 18:  //GPS讯号丢失开始
	case 68:  //GPS讯号丢失结束
		return this.getSignalLossAlarm(armType);
	case 1:  //自定义报警开始
	case 51:  //自定义报警结束
		return this.getUserDefineAlarm(armType);
	case 19:  //IO_1报警 开始
	case 69:  //  结束
		return this.getIOAlarm(0, armType);
	case 20:  //IO_2报警 开始
	case 70:  //结束
		return this.getIOAlarm(1, armType);
	case 21:  //IO_3报警 开始
	case 71:  //结束
		return this.getIOAlarm(2, armType);
	case 22:  //IO_4报警 开始
	case 72:  //结束
		return this.getIOAlarm(3, armType);
	case 23:  //IO_5报警 开始
	case 73:  //结束
		return this.getIOAlarm(4, armType);
	case 24:  //IO_6报警 开始
	case 74:  //结束
		return this.getIOAlarm(5, armType);
	case 25:  //IO_7报警 开始
	case 75:  //结束
		return this.getIOAlarm(6, armType);
	case 26:  //IO_8报警 开始
	case 76:  //结束
		return this.getIOAlarm(7, armType);
	case 41:  //IO_9报警 开始
	case 91:  //结束
		return this.getIOAlarm(8, armType);
	case 42:  //IO_10报警 开始
	case 92:  //结束
		return this.getIOAlarm(9, armType);
	case 43:  //IO_11报警 开始
	case 93:  //结束
		return this.getIOAlarm(10, armType);
	case 44:  //IO_12报警 开始
	case 94:  //结束
		return this.getIOAlarm(11, armType);
	case 2:  //紧急按钮报警 开始
	case 52:  //结束
		return this.getUrgencyButtonAlarm(armType);
	case 3:  //振动报警 开始
	case 53:  //结束
		return this.getShakeAlarm(armType);
	case 14:  //超时停车 开始
	case 64:  // 结束
		return this.getOvertimeParkAlarm(armType);
	case 4:  //视频丢失报警 开始
	case 54:  //结束
		return this.getVideoLostAlarm(armType);
	case 5:  //摄像头遮挡报警 开始
	case 55:  //结束
		return this.getVideoMaskAlarm(armType);
	case 6:  //非法开门报警 开始
	case 56:  //结束
		return this.getDoorOpenLawlessAlarm(armType);
	case 7:  //三次密码错误报警 开始
	case 57:  //结束
		return this.getWrongPwdAlarm(armType);
	case 8:  //非法点火报警 开始
	case 58:  //结束
		return this.getFireLowlessAlarm(armType);
	case 9:  //温度报警 开始
	case 59:  //结束
		return this.getTemperatorAlarm(armType);
	case 10:  //硬盘错误报警 开始
	case 60:  //结束
		return this.getDiskErrAlarm(armType);
	case 11:  //超速报警 开始
	case 61:  //结束
		return this.getOverSpeedAlarm(armType);
	case 151:  //夜间行驶报警 开始
	case 152:  //结束
		return this.getNightDrivingAlarm(armType);
	case 153:  //聚众报警 开始
	case 154:  //结束
		return this.getGatheringAlarm(armType);
	case 155:  //UPS 剪线报警警 开始
	case 156:  //结束
		return this.getUSPCutAlarm(armType);
	case 157:  //硬盘超温报警 开始
	case 158:  //结束
		return this.getHddHighTempAlarm(armType);
	case 159:  //前面板被撬开报警 开始
	case 160:  //结束
		return this.getBeBoOpenedAlarm(armType);
	case 161:  //关机上报报警
		return this.getTurnOffAlarm(armType);
	case 162:  //硬盘空间不足报警 开始
	case 163:  //结束
		return this.getDiskSpaceAlarm(armType);
	case 166:  //SIM卡丢失报警 开始
	case 167:  //结束
		return this.getSimLostAlarm(armType);
	case 12:  //越界报警 开始
	case 62:  //结束
		return this.getBeyondBoundsAlarm(armType);
	case 13:  //异常开关车门报警 开始
	case 63:  //结束
		return this.getDoorAbnormalAlarm(armType);
	case 17:  //设备在线
	case 67:  //设备断线
		return this.getOnlineAlarm(armType);
	case 16:  //ACC开启报警
	case 66:  //ACC关闭报警
		return this.getACCAlarm(armType);
	case 15:  //移动侦测报警 开始
	case 65:  //结束
		return this.getMotionAlarm(armType);
	case 46:  //油量报警  加油 开始
	case 86:  //结束
	case 47:  //油量报警 减油 开始
	case 87:  //结束
		return this.getOilAlarm(armType);
	case 49:  //疲劳驾驶  开始
	case 99:  //结束
		return this.getFatigueAlarm(armType);
	////平台报警
	case 300:  //区域超速报警  开始
	case 350:  //结束
	case 301:  //区域低速报警  开始
	case 351:  //结束
		return this.getCMSAreaOverSpeedAlarm(armType);
	case 302:  //进出入区域报警  开始
	case 352:  //结束
	case 303:  //线路偏移报警  开始
	case 353:  //结束
		return this.getCMSAreaInOutAlarm(armType);
	case 304:  //时间段超速报警  开始
	case 354:  //结束
		return this.getCMSTimeOverSpeedAlarm(armType);
	case 305:  //时间段低速报警  开始
	case 355:  //结束
		return this.getCMSTimeLowSpeedAlarm(armType);
	case 306:  //疲劳驾驶报警  开始
	case 356:  //结束
		return this.getCMSFatigueAlarm(armType);
	case 307:  //超时停车报警  开始
	case 357:  //结束
		return this.getCMSParkTooLongAlarm(armType);
	case 308:  //关键点监控报警  开始
	case 358:  //结束
		return this.getCMSAreaPointAlarm(armType);
	case 309:  //线路超速报警  开始
	case 359:  //结束
	case 310:  //线路低速报警  开始
	case 360:  //结束
		return this.getCMSAreaOverSpeedAlarm(armType);
	case 311:  //道路等級限速  开始
	case 361:  //结束
		return this.getCMSRoadLevelOverSpeedAlarm(armType);
		//事件
	case 101:  //停车事件
		return '';
	case 102:  //停车未熄火事件
		return '';
	case 103:  //流量
		return '';
	case 104:  //加油
		return '';
	case 105:  //偷油
		return '';
	case 106:  //超速事件
		return '';
	case 107:  //进出区域事件
		return '';
	case 108:  //区域停车事件
		return '';
	case 109:  //图片文件或者录像文件上传   有问题
		return this.getEventFileUpload(armType);
	case 111:  //海船状态报警
		return '';
	case 114:  //超速预警
		return '';
	case 115:  //低速预警
		return '';
	case 116:  //驾驶员信息采集上报   有问题
		return this.getDriverInfo(armType);
	case 130:  //报警图片文件或者录像文件下载
		return this.getEventFileDownload(armType);
	case 110:  //报站信息
		return this.getEventStationInfo(armType);
	case 113:  //自定义报警()
		return this.getCustomAlarmInfo(armType);
	case 132:  //透传数据
		return '';
	case 27:  //进入区域报警
	case 28:  //出区域报警
	case 33:  //区域内停车报警
	case 34:  //区域外停车报警
	case 77:  //进入区域报警
	case 78:  //出区域报警
	case 83:  //区域内停车报警
	case 84:  //区域外停车报警
	case 29:  //区域内高速报警
	case 30:  //区域外高速报警
	case 31:  //区域内低速报警
	case 32:  //区域外低速报警
	case 79:  //区域内高速报警
	case 80:  //区域外高速报警
	case 81:  //区域内低速报警
	case 82:  //区域外低速报警
		return this.getFenceAlarm(armType);
		//808部分报警
	case 200:  //区域超速报警 开始
	case 250:  //结束
		return this.getAreaOverSpeedAlarm(armType);
	case 201:  //预警  开始
	case 251:  //结束
		return this.getWarningAlarm(armType);
	case 202:  //GNSS模块故障  开始
	case 252:  //结束
		return this.getGNSSModuleFailureAlarm(armType);
	case 203:  //GNSS天线未接或剪断  开始
	case 253:  //结束
		return this.getGNSSAntennaMissedOrCutAlarm(armType);
	case 204:  //GNSS天线短路  开始
	case 254:  //结束
		return this.getGNSSAntennaShortAlarm(armType);
	case 205:  //主电源欠压  开始
	case 255:  //结束
		return this.getSupplyUndervoltageAlarm(armType);
		
	case 206:  //主电源掉电  开始
	case 256:  //结束
		return this.getPowerFailureAlarm(armType);
	case 207:  //LCD或显示器故障  开始
	case 257:  //结束
		return this.getLCDFailureAlarm(armType);
	case 208:  //TTS模块故障  开始
	case 258:  //结束
		return this.getTTSModuleFailureAlarm(armType);
	case 209:  //摄像头故障  开始
	case 259:  //结束
		return this.getCameraFailureAlarm(armType);
	case 210:  //当天累计驾驶超时  开始
	case 260:  //结束
		return this.getDrivingTimeoutAlarm(armType);
	case 211:  //进出区域  开始
	case 261:  //结束
	case 212:  //进出线路  开始
	case 262:  //结束
		return this.getCMSAreaInOutAlarm(armType);
	case 213:  //路段行驶时间不足或过长  开始
	case 263:  //结束
		return this.getRoadTravelTimeAlarm(armType);
		
	case 214:  //路线偏离  开始
	case 264:  //结束
		return this.getRouteDeviationAlarm(armType);
	case 215:  //VSS故障  开始
	case 265:  //结束
		return this.getVSSFailureAlarm(armType);
	case 216:  //油量异常  开始
	case 266:  //结束
		return this.getAbnormalFuelAlarm(armType);
	case 217:  //防盗器  车辆被盗  开始
	case 267:  //结束
		return this.getAntitheftDeviceAlarm(armType);
	case 218:  //非法位移  开始
	case 268:  //结束
		return this.getIllegalDisplacementAlarm(armType);
	case 219:  //侧翻报警  开始
	case 269:  //结束
		return this.getRolloverAlarm(armType);
	case 117: //报站信息开始
		return this.getBusArrivalStationInfo(armType);
	case 118: //溜站报警开始
		return this.getBusSlipStationAlarm(armType);
	case 168: //胎压报警
		return this.getTpmsAlarm(armType);
	default:
		var ret = {};
		ret.strType = parent.lang.unknown;
		return ret;
	}
}