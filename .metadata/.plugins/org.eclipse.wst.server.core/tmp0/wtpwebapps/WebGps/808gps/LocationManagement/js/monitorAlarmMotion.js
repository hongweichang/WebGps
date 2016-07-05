/**
 * 报警联动处理类
 * 处理联动视频：
 * 1.当车辆的通道在播放时
 *  a.将当前窗口的标题变红，并且将报警类型加入标题。
 *  b.如果设置的自动关闭时间比设置的预览时间短，则观看到设置的预览时间结束时，关闭窗口；
 *  否则将当前窗口的标题变回正常颜色，并去掉报警类型。
 * 2.当车辆的通道未播放时
 *  a.当有空闲窗口时，直接在空闲窗口播放。
 *  b.当有用户自己打开的窗口时，则替换播放时间最长的非本车辆报警的窗口。
 * 3.添加用户可设置参数，设置报警来到时是否替换未关闭的报警视频。
 *  a.如果设置了参数，则同一批次报警，当所有窗口已经被替换成报警视频窗口，则后面的报警不处理。
 *  b.如果未设置参数，当所有窗口已经被替换成报警视频窗口，则后面的报警不处理。
 * 4.如果同一辆车有多个报警产生，则依次更改标题中的报警类型，而预览时间则以最近的联动信息的预览时间为准。
 * 5.如果是放大的画面，则按单窗口处理。
 * 6.如果用户手动停止报警视频，将窗口的标题变回正常颜色，并去掉报警类型。
 */
function vehicleAlarmMotion(){
	this.mapVehiAlarmMotion = new Hashtable();  //报警联动信息，键为报警类型,值为对应联动信息
	this.alarmSoundList = []; //报警联动的声音列表
	this.isAlarmSound = false; //是否正在播放报警声音
	this.isNewAlarm = false; //是否新一轮的报警
	this.audioObject = null; //声音对象，仅对支持html5的浏览器有效
	this.alarmTypeList = new Hashtable();  //报警类型列表，键为报警开始类型，值为类型字符串和对应报警结束类型
}

vehicleAlarmMotion.prototype.initialize = function(){
	//初始化用户的报警联动信息
	this.initAlarmMotion();
	//初始化声音控件
	this.initAlarmSound();
	////初始化报警类型
	this.initAlarmType();
};

//初始化用户的报警联动信息
vehicleAlarmMotion.prototype.initAlarmMotion = function() {
	//是否有权限
	if(typeof parent.myUserRole != 'undefined' && parent.myUserRole != null
			&& parent.myUserRole.isPermit(661)) {
		//本类对象
		var myAlarmMotion = this;
		$.myajax.jsonGet("StandardAlarmMotionAction_findAlarmMotion.action", function(json, action, success) {
			if(success) {
				if(json.motions != null) {
					for (var i = 0; i < json.motions.length; i++) {
						myAlarmMotion.mapVehiAlarmMotion.put(Number(json.motions[i].atp), json.motions[i]);
					}
				}
			}
		}, null);
	}
}

//初始化声音控件
vehicleAlarmMotion.prototype.initAlarmSound = function() {
	var audio_div = document.createElement('div');
	audio_div.id = 'alarmAudioDiv';
	$(audio_div).css({'width':'0px','height':'0px'});
	$(audio_div).css("marginLeft",'-1000px');
	this.audioObject = document.createElement("audio");
//	audio.id = "alarmAudio";
//	var content = '<embed id="emp3" src="" autostart=true hidden="no"/>';
//	content += '<embed id="eogg" src="" autostart=true hidden="no"/>';
	//html5支持audio
//	if((typeof this.audioObject.load) == 'function') {
//		$(audio_div).append(content);
//	}else {
//		$(audio_div).append(audio);
//	}
	$('body').append(audio_div);
}

//修改报警联动信息
vehicleAlarmMotion.prototype.updateAlarmMotion = function(data){
	if(data != null && data.atp != null) {
		this.mapVehiAlarmMotion.put(Number(data.atp), data);
	}
};

//删除报警联动信息
vehicleAlarmMotion.prototype.deleteAlarmMotion = function(vehiIdno, armType){
	if(armType != null) {
		var armTypes = armType.toString().split(',');
		for (var i = 0; i < armTypes.length; i++) {
			this.mapVehiAlarmMotion.remove(Number(armTypes[i]));
		}
	}
};

/**
 * 报警联动运行
 * @param vehiIdno 车牌号
 * @param armType  报警类型
 * @param isEnd  是否报警结束
 * @param alarmPackNumber 报警批次号
 */
vehicleAlarmMotion.prototype.doAlarmMotion = function(vehiIdno, armType, isEnd, alarmPackNumber){
	//如果是报警开始，则按正常流程处理
	if(!isEnd) {
		var motion = this.mapVehiAlarmMotion.get(Number(armType));
		//判断该车辆是否进行了联动
		if(motion != null) {
			motion.alarmPackNumber = alarmPackNumber;
			//有联动信息则解析
			this.doAlarmMotionRun(vehiIdno, motion);
		}
	}else {
		//如果是报警结束，那么就去判断是否有窗口设置的在报警结束时关闭视频预览,如果有则将报警结束类型置空
		if(typeof ttxVideo != 'undefined' && ttxVideo != null) {
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			if (vehicle != null) {
				var device = vehicle.getVideoDevice();
				if (device != null) {
					var devIdno = device.getIdno();
					ttxVideo.setWindowEndArmType(devIdno, armType);
				} 
			}
		}
	}
}

//获取当前时间所在时分秒 有多少秒
vehicleAlarmMotion.prototype.getNowHourSecond = function() {
	var date = new Date();
	return parseIntDecimal(date.getHours()) * 3600 + parseIntDecimal(date.getMinutes()) * 60 + parseIntDecimal(date.getSeconds());
}

//进行报警联动
vehicleAlarmMotion.prototype.doAlarmMotionRun = function(vehiIdno, motion){
	//是否启用
	if(motion.enb == 1) {
		//motion.btm;		//开始时间，以秒计算，逗号分割
		//motion.etm;		//结束时间，以秒计算，逗号分割
		//是否在联动时间范围内
		var bgTimes = motion.btm.toString().split(',');
		var edTimes = motion.etm.toString().split(',');
		var flag = false;
		if(Number(this.getNowHourSecond()) >= Number(bgTimes[0]) && Number(this.getNowHourSecond()) <= Number(edTimes[0])) {
			flag = true;
		}
		//在联动时间内
		if(flag) {
			//是否报警联动视频预览
			if(motion.ird == 1) {
				//录像时间  motion.rtm
				//录像通道  motion.rch
				
				//判断是否新的报警，如果是新的报警，那么可以替换所有窗口；
				//如果不是新的报警，并且没有非报警窗口，则不处理
				//在报警情况下，当前批次的报警是否已经预览整个窗口
				var isAlarmPackAll = false;
				if(typeof ttxVideo != 'undefined' && ttxVideo != null) {
					isAlarmPackAll = ttxVideo.isAlarmPackAll(motion.alarmPackNumber);
				}
				//如果本批次报警已经预览满了,则不进行操作
				if(!isAlarmPackAll) {
					this.doVideoPreview(vehiIdno, motion);
				}
			}
			//是否抓拍
		//	if(motion.cp == 1) {
			//	this.doCaptureRun(vehiIdno, motion);
		//	}
			//是否启用警音提醒
			if(motion.sd == 1) {
				//将当前音频加入列表
				//如果音频文件名为以下名称，则为默认文件夹文件
				if(motion.sds == 'Alarm1' || motion.sds == 'ErrorPassword' || motion.sds == 'FindDevice' ||
						motion.sds == 'FindVideo' || motion.sds == 'LostDevice' || motion.sds == 'LostVideo' ||
						motion.sds == 'Msg' || motion.sds == 'Photo') {
					motion.uid = 0;
				}
				this.alarmSoundList.push(motion);
				//超过100条就删除第一条
				if(this.alarmSoundList.length > 100) {
					this.alarmSoundList.splice(0, 1);
				}
				
				//没有播放
				if(!this.isAlarmSound) {
					this.doAlarmSoundRun();
				}
			}
			//是否电子地图锁定、、跟踪车辆
			if(motion.sam == 1) {
				if(typeof monitorStatus != 'undefined' && monitorStatus != null) {
					//如果是新的报警才选中
					var isShowMap = false;
					if(this.isNewAlarm) {
						isShowMap = true;
					}else {
						//最后一个解析的报警，车辆居中
						if(typeof monitorAlarm != 'undefined' && monitorAlarm != null 
								&& monitorAlarm.isAlarmEnd) {
							isShowMap = true;
						}
					}
					
					//如果没有选中车辆节点，则选中车辆节点
					if(!monitorStatus.findMonitorVehicle(vehiIdno)) {
						if(typeof vehiTree != 'undefined' && vehiTree != null) {
							//如果没有添加到树列表则添加
							var vehicle_ = parent.vehicleManager.getVehicle(vehiIdno);
							if(vehicle_) {
								if(typeof loadTeamTree == 'function') {
									loadTeamTree(vehicle_.getParentId(), function() {
										vehiTree.setCheck(vehiIdno, true);
										monitorStatus.addMonitorVehicle(vehiIdno);
									});
								}else {
									vehiTree.setCheck(vehiIdno, true);
									monitorStatus.addMonitorVehicle(vehiIdno);
								}
							}
						}else {
							monitorStatus.addMonitorVehicle(vehiIdno);
						}
					}else {
						monitorStatus.selectVehicle(vehiIdno, isShowMap, isShowMap, isShowMap);
					}
				}
			}
		}
	}
}

//初始化报警联动警音提示
vehicleAlarmMotion.prototype.initAlarmSoundRun = function(){
	//当新一轮报警来到，则清空上一轮报警的声音，即使未播放完
	this.isAlarmSound = false; //未播放状态
	//清空播放列表
	this.alarmSoundList = [];
//	var audio = document.getElementById("alarmAudio");
//	var audio = document.createElement("audio");
	if(this.audioObject != null && (typeof this.audioObject.load) == 'function') {
		this.audioObject.pause();//停止当前声音
	}else {
		$('#alarmAudioDiv #emp3').remove();
		$('#alarmAudioDiv #eogg').remove();
	}
}

//报警联动警音提示
vehicleAlarmMotion.prototype.doAlarmSoundRun = function(){
	//警音文件  motion.sds
//	motion.sds = 'http://www.w3school.com.cn/i/song';
	//如果正在播放,跳过
	if(!this.isAlarmSound && this.alarmSoundList.length > 0) {//没有播放并且播放列表有数据
//		var audio = document.getElementById("alarmAudio");
//		var audio = document.createElement("audio");
		if(this.audioObject != null && (typeof this.audioObject.load) == 'function') {
			if(this.audioObject.canPlayType("audio/mpeg")) {
				this.audioObject.src = 'sounds/'+ this.alarmSoundList[0].uid + '/' +  audioFileEncodeURI(audioFileEncodeURI(this.alarmSoundList[0].sds)) +".mp3";
			}else if(this.audioObject.canPlayType("audio/ogg")) {
				this.audioObject.src = 'sounds/'+ this.alarmSoundList[0].uid + '/' +  audioFileEncodeURI(audioFileEncodeURI(this.alarmSoundList[0].sds)) +".ogg";
			}
			//音频加载完成后自动播放
			this.audioObject.autoplay = true;
		}else {
			//不支持html5  ie8
			$('#alarmAudioDiv #emp3').remove();
			$('#alarmAudioDiv #eogg').remove();
			
			var content = '<embed id="emp3" src="sounds/'+ this.alarmSoundList[0].uid + '/' +  audioFileEncodeURI(audioFileEncodeURI(this.alarmSoundList[0].sds)) +'.mp3" hidden="no" autostart=true style="width:0px;height:0px;"/>';
			content += '<embed id="eogg" src="sounds/'+ this.alarmSoundList[0].uid + '/' +  audioFileEncodeURI(audioFileEncodeURI(this.alarmSoundList[0].sds)) +'.ogg" hidden="no" autostart=true style="width:0px;height:0px;"/>';
			 
			$('#alarmAudioDiv').append(content);
		}
		//正在播放音频
		this.isAlarmSound = true;
		this.doAlarmSoundRun_();
	}
}

//报警提示声音
vehicleAlarmMotion.prototype.doAlarmSoundRun_ = function(){
	var alarmMotion_ = this;
//	var audio = document.getElementById("alarmAudio");
//	var audio = document.createElement("audio");
	if(this.audioObject != null && (typeof this.audioObject.load) == 'function') {
		//音频播放完毕
		if(!this.audioObject.ended) {//未完
			setTimeout(function() {
				alarmMotion_.doAlarmSoundRun_();
			},50);
		}else {
			this.isAlarmSound = false; //播放完毕
			this.alarmSoundList.splice(0,1);
			this.doAlarmSoundRun();
		}
	}else {
		//播放一秒换下一个
		setTimeout(function() {
			alarmMotion_.isAlarmSound = false; //播放完毕
			alarmMotion_.alarmSoundList.splice(0,1);
			alarmMotion_.doAlarmSoundRun();
		},2000);
	}
}

//报警联动抓拍
vehicleAlarmMotion.prototype.doCaptureRun = function(vehiIdno, motion){
	if(typeof monitorMenu != 'undefined' && monitorMenu != null) {
		var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
		if (vehicle != null) {
			var chnCount = vehicle.channels.length;
			//解析通道
			if(motion.cpch == -1) {//所有通道
				for (var i = 0; i < chnCount; i++) {
					monitorMenu.beforeImageCapture(i, vehiIdno);
				}
			}else {
				for (var i = 0; i < chnCount; i++) {
					if((motion.cpch>>i)&1 > 0) {
						monitorMenu.beforeImageCapture(i, vehiIdno);
					}
				}
			}
		}
	}
}

//报警联动视频预览
vehicleAlarmMotion.prototype.doVideoPreview = function(vehiIdno, motion) {
	var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
	if (vehicle != null) {
		//判断视频设备
		var device = vehicle.getVideoDevice();
		if (device != null && device.isOnline()) {//不是视频设备不支持预览	
			//录像时间  motion.rtm
			//录像通道  motion.rch
			//解析通道
			//如果录像时间为0，则是报警结束时关闭预览窗口
			var armType = {};
			var armTypeValue = this.alarmTypeList.get(Number(motion.atp));
			armType.type = armTypeValue.stp;
			armType.name = armTypeValue.name;
			if(motion.rtm == 0) {
				armType.endType = armTypeValue.etp;
			}
			armType.alarmPackNumber = motion.alarmPackNumber;
				
			if((typeof previewVideo) == 'function') {
				if(motion.rch == -1) {//所有通道
					previewVideo(vehiIdno, -1, null, motion.rtm, armType);
				}else {
					var chnCount = device.getChnCount();
					if (chnCount <= 0) {
						previewVideo(vehiIdno, -1, null, motion.rtm, armType);
					}else {
						for (var i = 0; i < chnCount; i++) {
							if((motion.rch>>i)&1 > 0) {
								previewVideo(vehiIdno, i, null, motion.rtm, armType);
							}
						}
					}
				}
			}
		}
	}
}

vehicleAlarmMotion.prototype.setAlarmTypeValue =function(startType, Typename, endType) {
	var value = {};
	value.stp = startType;
	value.name = Typename;
	value.etp = endType;
	return value;
}

//初始化报警类型
vehicleAlarmMotion.prototype.initAlarmType = function() {
	this.alarmTypeList.put(11, this.setAlarmTypeValue(11, parent.lang.monitor_alarm_speed, 61));
	this.alarmTypeList.put(14, this.setAlarmTypeValue(14, parent.lang.alarm_type_overtimeParking, 64));
	this.alarmTypeList.put(15, this.setAlarmTypeValue(15, parent.lang.alarm_type_motion, 65));
	this.alarmTypeList.put(4, this.setAlarmTypeValue(4, parent.lang.alarm_type_video_lost, 54));
	this.alarmTypeList.put(5, this.setAlarmTypeValue(5, parent.lang.alarm_type_video_mask, 55));
//	this.alarmTypeList.put(39, this.setAlarmTypeValue(39, parent.lang.monitor_alarm_disk1NoExist, 39));
//	this.alarmTypeList.put(40, this.setAlarmTypeValue(40, parent.lang.monitor_alarm_disk2NoExist, 40));
	this.alarmTypeList.put(10, this.setAlarmTypeValue(10, parent.lang.alarm_type_disk_error, 60));
	this.alarmTypeList.put(157, this.setAlarmTypeValue(157, parent.lang.alarm_type_highTemperature, 158));
	this.alarmTypeList.put(162, this.setAlarmTypeValue(162, parent.lang.alarm_type_defect_disk, 163));
	this.alarmTypeList.put(45, this.setAlarmTypeValue(45, parent.lang.monitor_alarm_GpsInvalid, 85));
	this.alarmTypeList.put(18, this.setAlarmTypeValue(18, parent.lang.alarm_type_gps_signal_loss, 68));
	this.alarmTypeList.put(202, this.setAlarmTypeValue(202, parent.lang.alarm_type_GNSSModuleFailure, 252));
	this.alarmTypeList.put(203, this.setAlarmTypeValue(203, parent.lang.alarm_type_GNSSAntennaMissedOrCut, 253));
	this.alarmTypeList.put(204, this.setAlarmTypeValue(204, parent.lang.alarm_type_GNSSAntennaShort, 254));
	this.alarmTypeList.put(207, this.setAlarmTypeValue(207, parent.lang.alarm_type_LCDorDisplayFailure, 257));
	this.alarmTypeList.put(208, this.setAlarmTypeValue(208, parent.lang.alarm_type_TTSModuleFailure, 258));
	this.alarmTypeList.put(209, this.setAlarmTypeValue(209, parent.lang.alarm_type_cameraMalfunction, 259));
	this.alarmTypeList.put(215, this.setAlarmTypeValue(215, parent.lang.alarm_type_VSSFailure, 265));
	this.alarmTypeList.put(2, this.setAlarmTypeValue(2, parent.lang.alarm_type_ungency_button, 52));
	this.alarmTypeList.put(6, this.setAlarmTypeValue(6, parent.lang.alarm_type_door_open_lawless, 56));
	this.alarmTypeList.put(46, this.setAlarmTypeValue(46, parent.lang.alarm_type_add_oil, 86));
	this.alarmTypeList.put(47, this.setAlarmTypeValue(47, parent.lang.alarm_type_dec_oil, 87));
	this.alarmTypeList.put(216, this.setAlarmTypeValue(216, parent.lang.alarm_type_abnormalFuel, 266));
//	this.alarmTypeList.put(113, this.setAlarmTypeValue(113, parent.lang.alarm_type_custom_alarm, 113));
	this.alarmTypeList.put(9, this.setAlarmTypeValue(9, parent.lang.alarm_type_temperator, 59));
	this.alarmTypeList.put(151, this.setAlarmTypeValue(151, parent.lang.alarm_type_nightdriving, 152));
	this.alarmTypeList.put(49, this.setAlarmTypeValue(49, parent.lang.alarm_type_fatigue, 99));
	this.alarmTypeList.put(153, this.setAlarmTypeValue(153, parent.lang.alarm_type_gathering, 154));
	this.alarmTypeList.put(155, this.setAlarmTypeValue(155, parent.lang.alarm_type_upsCut, 156));
	this.alarmTypeList.put(159, this.setAlarmTypeValue(159, parent.lang.alarm_type_before_board_opened, 160));
	this.alarmTypeList.put(166, this.setAlarmTypeValue(166, parent.lang.alarm_type_sim_lost, 167));
	this.alarmTypeList.put(7, this.setAlarmTypeValue(7, parent.lang.alarm_type_erong_pwd, 57));
	this.alarmTypeList.put(13, this.setAlarmTypeValue(13, parent.lang.alarm_type_door_abnormal, 63));
	this.alarmTypeList.put(3, this.setAlarmTypeValue(3, parent.lang.alarm_type_shake, 53));
	this.alarmTypeList.put(8, this.setAlarmTypeValue(8, parent.lang.alarm_type_illegalIgnition, 58));
	this.alarmTypeList.put(16, this.setAlarmTypeValue(16, parent.lang.alarm_type_Acc_on, 16));
	this.alarmTypeList.put(66, this.setAlarmTypeValue(66, parent.lang.alarm_type_Acc_off, 66));
	this.alarmTypeList.put(201, this.setAlarmTypeValue(201, parent.lang.alarm_type_earlyWarning, 251));
	this.alarmTypeList.put(205, this.setAlarmTypeValue(205, parent.lang.alarm_type_mainSupplyUndervoltage, 255));
	this.alarmTypeList.put(206, this.setAlarmTypeValue(206, parent.lang.alarm_type_mainPowerFailure, 256));
	this.alarmTypeList.put(210, this.setAlarmTypeValue(210, parent.lang.alarm_type_cumulativeDayDrivingTimeout, 260));
	this.alarmTypeList.put(217, this.setAlarmTypeValue(217, parent.lang.alarm_type_antitheftDevice, 267));
	this.alarmTypeList.put(218, this.setAlarmTypeValue(218, parent.lang.alarm_type_illegalDisplacement, 268));
	this.alarmTypeList.put(219, this.setAlarmTypeValue(219, parent.lang.alarm_type_rollover, 269));
	this.alarmTypeList.put(19, this.setAlarmTypeValue(19, parent.lang.alarm_type_io1, 69));
	this.alarmTypeList.put(20, this.setAlarmTypeValue(20, parent.lang.alarm_type_io2, 70));
	this.alarmTypeList.put(21, this.setAlarmTypeValue(21, parent.lang.alarm_type_io3, 71));
	this.alarmTypeList.put(22, this.setAlarmTypeValue(22, parent.lang.alarm_type_io4, 72));
	this.alarmTypeList.put(23, this.setAlarmTypeValue(23, parent.lang.alarm_type_io5, 73));
	this.alarmTypeList.put(24, this.setAlarmTypeValue(24, parent.lang.alarm_type_io6, 74));
	this.alarmTypeList.put(25, this.setAlarmTypeValue(25, parent.lang.alarm_type_io7, 75));
	this.alarmTypeList.put(26, this.setAlarmTypeValue(26, parent.lang.alarm_type_io8, 76));
	this.alarmTypeList.put(41, this.setAlarmTypeValue(41, parent.lang.alarm_type_io9, 91));
	this.alarmTypeList.put(42, this.setAlarmTypeValue(42, parent.lang.alarm_type_io10, 92));
	this.alarmTypeList.put(43, this.setAlarmTypeValue(43, parent.lang.alarm_type_io11, 93));
	this.alarmTypeList.put(44, this.setAlarmTypeValue(44, parent.lang.alarm_type_io12, 94));
	this.alarmTypeList.put(27, this.setAlarmTypeValue(27, parent.lang.alarm_type_fence_in, 77));
	this.alarmTypeList.put(28, this.setAlarmTypeValue(28, parent.lang.alarm_type_fence_out, 78));
	this.alarmTypeList.put(29, this.setAlarmTypeValue(29, parent.lang.alarm_type_fence_in_overspeed, 79));
	this.alarmTypeList.put(30, this.setAlarmTypeValue(30, parent.lang.alarm_type_fence_out_overspeed, 80));
	this.alarmTypeList.put(31, this.setAlarmTypeValue(31, parent.lang.alarm_type_fence_in_lowspeed, 81));
	this.alarmTypeList.put(32, this.setAlarmTypeValue(32, parent.lang.alarm_type_fence_out_lowspeed, 82));
	this.alarmTypeList.put(33, this.setAlarmTypeValue(33, parent.lang.alarm_type_fence_in_stop, 83));
	this.alarmTypeList.put(34, this.setAlarmTypeValue(34, parent.lang.alarm_type_fence_out_stop, 84));
	this.alarmTypeList.put(12, this.setAlarmTypeValue(12, parent.lang.alarm_type_beyond_bounds, 62));
	this.alarmTypeList.put(200, this.setAlarmTypeValue(200, parent.lang.alarm_type_regionalSpeedingAlarm, 250));
	this.alarmTypeList.put(211, this.setAlarmTypeValue(211, parent.lang.alarm_type_outOfRegional, 261));
	this.alarmTypeList.put(212, this.setAlarmTypeValue(212, parent.lang.alarm_type_outOfLine, 262));
	this.alarmTypeList.put(213, this.setAlarmTypeValue(213, parent.lang.alarm_type_InadequateOrTooLongRoadTravelTime, 263));
	this.alarmTypeList.put(214, this.setAlarmTypeValue(214, parent.lang.alarm_type_routeDeviation, 264));
	this.alarmTypeList.put(300, this.setAlarmTypeValue(300, parent.lang.alarm_type_areaOverSpeed_platform, 350));
	this.alarmTypeList.put(301, this.setAlarmTypeValue(301, parent.lang.alarm_type_areaLowSpeed_platform, 351));
	this.alarmTypeList.put(302, this.setAlarmTypeValue(302, parent.lang.alarm_type_areaInOut_platform, 352));
	this.alarmTypeList.put(303, this.setAlarmTypeValue(303, parent.lang.alarm_type_lineInOut_platform, 353));
	this.alarmTypeList.put(304, this.setAlarmTypeValue(304, parent.lang.alarm_type_overSpeed_platform, 354));
	this.alarmTypeList.put(305, this.setAlarmTypeValue(305, parent.lang.alarm_type_lowSpeed_platform, 355));
	this.alarmTypeList.put(306, this.setAlarmTypeValue(306, parent.lang.alarm_type_fatigue_platform, 356));
	this.alarmTypeList.put(307, this.setAlarmTypeValue(307, parent.lang.alarm_type_parkTooLong_platform, 357));
	this.alarmTypeList.put(308, this.setAlarmTypeValue(308, parent.lang.alarm_type_areaPoint_platform, 358));
	this.alarmTypeList.put(309, this.setAlarmTypeValue(309, parent.lang.alarm_type_lineOverSpeed_platform, 359));
	this.alarmTypeList.put(310, this.setAlarmTypeValue(310, parent.lang.alarm_type_lineLowSpeed_platform, 360));
	this.alarmTypeList.put(311, this.setAlarmTypeValue(311, parent.lang.report_roadLvlOverSpeed_platform, 361));
//	this.alarmTypeList.put(17, this.setAlarmTypeValue(17, parent.lang.alarm_type_device_online, 67));
}