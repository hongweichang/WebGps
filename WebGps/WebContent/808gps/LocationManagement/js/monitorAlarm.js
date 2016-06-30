/*
 * 报警事件，有1个开始和1个结束，使用相同的GUID，不同的报警类型，从服务器接收时，只会收到一1个报警事件，需要将开始和结束事件组合成1个报警
 */

/**
 * 车辆报警处理类
 * 1、从服务器上获取报警信息，并显示到界面上
 * 并开启
 */
function monitorVehicleAlarm(){
	this.alarmTableObj = null; //报警信息表格对象
	this.mapAlarmList = new Hashtable();	//每个报警关联一个GUID和一个报警事件
	this.alarmList = [];					//按接收顺序存储，接收时会进行移除操作
	this.flashAlarmInterval = 20000;		//默认间隔，需要启动时从cookie中读取
	this.flashAlarmTimer = null;			//刷新车辆状态的定时器
	this.alarmDevIdnos = "";
	this.alarmShields = [];                    //用户的报警屏蔽设置
	this.alarmAcceptList = []; //从后台接收的报警数据
	this.alarmPackNumber = 0;   //报警的批次编号
	this.mapVehiOnlineList = new Hashtable();	//每个在线车辆关联一个车牌号和一个上线事件的guid
	//每个任务中的下发任务关联一个车牌号+任务类型id和一个任务中事件
	this.mapVehiIssInfoList = new Hashtable();
	this.isAlarmEnd = false;  //报警是否解析完
	this.addAlarmToEventList = new Array();  //向报警信息列表添加报警信息的集合
	this.mapAlarmAddToEventList = new Hashtable(); //向报警信息列表添加报警信息的Map集合(车牌号关联)
	this.mapAlarmUpdateToEventList = new Hashtable(); //向报警信息列表更新报警信息的Map集合(车牌号关联)
	this.alarmUpdateToEventList = new Array(); //向报警信息列表更新报警信息的集合
	this.updateOnlineVehicleList = new Array(); //车辆上下线更新集合
	this.onlineVehicleList = new Array(); //在线的车辆车牌号集合 200个
}

//赋值flashAlarmInterval
monitorVehicleAlarm.prototype.setFlashAlarmInterval = function(flashAlarmInterval){
	this.flashAlarmInterval = flashAlarmInterval; 
}

monitorVehicleAlarm.prototype.initialize = function(){
	//初始化报警屏蔽信息
	this.initAlarmShield();
	//初始化状态列表
	this.initAlarmTable();
	//在初始化设备树后，会启动报警信息订阅
	//this.runAlarmTimer();
};

//初始化报警事件列表
monitorVehicleAlarm.prototype.initAlarmTable = function(){
	//车辆，报警类型、开始时间，结束时间，报警描述，开始地点，结束地点
	//本类对象
	var myMonitorAlarm = this;
	var buttons = [
	    {separator: false, hidename: "", name: parent.lang.clear, bclass: "flexDelete",
	    	bimage: "", tooltip: parent.lang.clear, id: "alarmClear",
	    	onpress: function() {
	    		myMonitorAlarm.clearAlarmTableEvent();
	    	}
	    },{separator: true
	    },
	    {separator: false, hidename: "", name: parent.lang.view, bclass: "flexFind",
	    	bimage: "", tooltip: parent.lang.view, id: "alarmFind",
	    	onpress: function() {
	    		myMonitorAlarm.doAlarmFind();
	    	}
	    }
	];
	this.alarmTableObj = $("#alarmTable").flexigrid({
		url: "",	//StandardTrackAction_query.action
		dataType: 'json',
		colModel : [
		    {display: parent.lang.operator, name : 'operator', width : 60, sortable : false, align: 'center'},
			{display: parent.lang.plate_number, name : 'idno', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.alarm_alarm_sum, name : 'armSum', width : 60, sortable : false, align: 'center'},
			{display: parent.lang.alarm_latest_alarm, name : 'type', width : 160, sortable : false, align: 'center'},
			{display: parent.lang.report_beginTime, name : 'startTime', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.report_endTime, name : 'endTime', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.monitor_alarmInfo, name : 'desc', width : 300, sortable : false, align: 'center'},
			{display: parent.lang.report_normal_beginPosition, name : 'startPos', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.report_normal_endPosition, name : 'endPos', width : 150, sortable : false, align: 'center'}
			],
		usepager: false,
		autoload: false,
		useRp: false,
		singleSelect: true,
		buttons: buttons,
		checkbox: false,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: true,
		width: 'auto',
		height: 'auto',
		resizable: false
	});
	this.alarmTableObj.flexSetFillCellFun(function(p, row, idx, index) {
		return myMonitorAlarm.fillAlarmTable(p, row, idx, index);
	});
	this.alarmTableObj.flexSelectRowPropFun(function(obj, selRow) {
		myMonitorAlarm.selectAlarmRowProp(obj, selRow);
	});
	//报警列表右键删除全部报警信息
//	disableSysRight('#gpsAlarm',true,function() {
//		$('#alarmTable').flexClear();
//	});
};

//清空报警列表
monitorVehicleAlarm.prototype.clearAlarmTableEvent = function(){
	if(this.alarmTableObj != null) {
		this.alarmTableObj.flexClear();
	}
	//清空报警声音
	if(typeof alarmMotion != 'undefined' && alarmMotion != null) {
		alarmMotion.alarmSoundList = [];
	}
};

/**
 * 提交ajax
 */
monitorVehicleAlarm.prototype.doAjaxSubmit = function(action, params, callback) {
	var object = $.post(action, {json : JSON.stringify(params)}, function(json, textStatus) {
		if(textStatus == 'timeout'){
			if((typeof showDialogErrorMessage) == 'function') {
				showDialogErrorMessage(3);
			}
			if((typeof callback) == 'function') {
				callback(json, false);
			}
		} else if(textStatus == 'error') {
			if((typeof showDialogErrorMessage) == 'function') {
				showDialogErrorMessage(1);
			}
			if((typeof callback) == 'function') {
				callback(json, false);
			}
		} else if (textStatus == "success") {
			if(json.result == 0){
				if((typeof callback) == 'function') {
					callback(json, true);
				}
			} else{
				if((typeof showDialogErrorMessage) == 'function') {
					showDialogErrorMessage(json.result, json.cmsserver);
				}
				if((typeof callback) == 'function') {
					callback(json, false);
				}
			}
		} else {
			if((typeof showDialogErrorMessage) == 'function') {
				showDialogErrorMessage(4);
			}
			if((typeof callback) == 'function') {
				callback(json, false);
			}
		}
		$.myajax.showLoading(false);
	}, 'json');
	return object;
}

//开启刷新车辆报警的定时器
monitorVehicleAlarm.prototype.runAlarmTimer = function(){
	//本类对象
	var myMonitorAlarm = this;
	this.flashStatusTimer = setTimeout(function () {
		myMonitorAlarm.flashVehicleAlarm();
	}, this.flashAlarmInterval);
};

//刷新报警状态
monitorVehicleAlarm.prototype.flashVehicleAlarm = function(){
	var data = {};
	data.devIdnos = parent.vehicleManager.getAllDevIdnos();
	if (data.devIdnos == "") {
		this.runAlarmTimer();
		return ;
	}
	//本类对象
	var myMonitorAlarm = this;
	//数据库取实时状态
	//$.myajax.jsonPost('StandardPositionAction_alarm.action?toMap='+parent.toMap, data, false, 
	this.doAjaxSubmit('StandardPositionAction_alarm.action?toMap='+parent.toMap, data, function(json, success) {
		var isMore = false;
		if(success) {
			if (typeof json.alarmlist != "undefined" && json.alarmlist != null) {
				for (var i = 0; i < json.alarmlist.length; ++ i) {
					//赋值批次编号
					json.alarmlist[i].alarmPackNumber = myMonitorAlarm.alarmPackNumber;
					myMonitorAlarm.alarmAcceptList.push(json.alarmlist[i]);
				//	myMonitorAlarm.doRecvAlarm(json.alarmlist[i]);
				}
			}
			//判断是否还有更多报警，如果有，则立即发送请求
			if (typeof json.more != "undefined" && json.more != null && json.more > 0) {
				isMore = true;
			}else {
				//如果没有更多报警，则是新的报警
				//报警批次编号+1
				myMonitorAlarm.alarmPackNumber++;
				if(this.flashAlarmCacheTimer == null) {
					myMonitorAlarm.runAlarmCacheTimer();
				}
			}
		} 
		if (isMore) {
			myMonitorAlarm.flashVehicleAlarm();
		} else {
			myMonitorAlarm.runAlarmTimer();
		}
	});
};

//开启读取保存的报警数据的定时器
monitorVehicleAlarm.prototype.runAlarmCacheTimer = function(){
	//本类对象
	var myMonitorAlarm = this;
	this.flashAlarmCacheTimer = setTimeout(function () {
		//报警是否解析完
		myMonitorAlarm.isAlarmEnd = false;
		myMonitorAlarm.startFlashTime = (new Date()).getTime();
		myMonitorAlarm.flashVehicleAlarmCache();
	}, 50);
};

//读取保存的报警数据，解析的同时删除，直到解析完报警数据
monitorVehicleAlarm.prototype.flashVehicleAlarmCache = function(){
	if(this.alarmAcceptList != null && this.alarmAcceptList.length > 0) {
		//取数组第一个值，然后再删除
		var alarmInfo = this.alarmAcceptList[0];
		this.alarmAcceptList.splice(0,1);
		if(typeof alarmMotion != 'undefined' && alarmMotion != null) {
			//如果上一个报警为空，则为新报警
			if(typeof this.lastAlarmInfo == 'undefined' || this.lastAlarmInfo == null) {
				//新一轮报警，设置报警联动 isNewAlarm 为true
				alarmMotion.isNewAlarm = true;
				//初始化联动警音提示
				alarmMotion.initAlarmSoundRun();
			}else {
				//如果不是新报警,并且//如果批次号与上一个批次号不同，则设置报警联动 isNewAlarm 为true
				if(!alarmMotion.isNewAlarm && alarmInfo.alarmPackNumber != this.lastAlarmInfo.alarmPackNumber) {
					//新一轮报警，设置报警联动 isNewAlarm 为true
					alarmMotion.isNewAlarm = true;
					//初始化联动警音提示
					alarmMotion.initAlarmSoundRun();
				}else {
					//如果是新报警，并且如果批次号与上一个批次号相同，则设置报警联动 isNewAlarm 为false
					if(alarmMotion.isNewAlarm && alarmInfo.alarmPackNumber == this.lastAlarmInfo.alarmPackNumber) {
						alarmMotion.isNewAlarm = false;
					}
				}
			}
		}
		//报警是否解析完
		if(this.alarmAcceptList.length == 0) {
			this.isAlarmEnd = true;
		}
		this.doRecvAlarm(alarmInfo);
		this.lastAlarmInfo = alarmInfo;
		if((new Date()).getTime() - this.startFlashTime < 500) {
			this.flashVehicleAlarmCache();
		}else {
			this.runAlarmCacheTimer();
		}
	}else {
		this.flashAlarmCacheTimer = null;
		//读取完报警，设置报警联动 isNewAlarm 为false
		if(typeof alarmMotion != 'undefined' && alarmMotion != null) {
			alarmMotion.isNewAlarm = false;
		}
	}
};

//解析报警数据
//耗时 15-20ms  0ms 500辆车 9画面视频
monitorVehicleAlarm.prototype.doRecvAlarm = function(alarm){
//	loadConsoleTime(true, 'doRecvAlarm');
	//报警列表最多存储 512条记录，如果超出了此数据，则将报警列表清空
	//判断是否存在对应的车辆
	var vehicle = parent.vehicleManager.getVehiByDevIdno(alarm.DevIDNO);
	if (vehicle == null) {
		return ;
	}
	//如果车辆在线，则不允许再次提示上线
	//如果车辆不在线，则不允许再次提示下线
	var isShowAlarmInfo = true;
	if(alarm.type == 17) {//车辆上线
		if(vehicle.isOnline()) {//车辆在线
			isShowAlarmInfo = false;
		}else {
			//车辆不在线，则把车辆上线时的guid保存
			this.mapVehiOnlineList.put(vehicle.getIdno(), alarm.guid);
		}
	}else if (alarm.type == 67) {//车辆下线
		if(!vehicle.isOnline()) {//车辆离线
			isShowAlarmInfo = false;
		}else {
			//查询保存的车辆上线时候的guid
			var olGuid = this.mapVehiOnlineList.get(vehicle.getIdno());
			if(olGuid != null && olGuid != '') {
				alarm.guid = olGuid;
				this.mapVehiOnlineList.remove(vehicle.getIdno());
			}
		}
	}
	//判断是否报警屏蔽
	if(!this.isAlarmShield(alarm.type) && isShowAlarmInfo) {
		
		//创建事件信息
		var armInfo = new standardArmInfo();
		armInfo.setAlarm(alarm);
		//车辆居中显示
		//改为报警联动电子地图锁定
//		if(this.monitorStatus != null) {
//			this.monitorStatus.selectVehicle(vehicle.getIdno(), true, true, false);
//		}
		
		////离线任务通知 任务中和任务结束归结一条
		if(armInfo.armType != null && armInfo.armType == 113 && armInfo.armIinfo != null && armInfo.armIinfo == 19) {
			//如果不是任务中，则赋值报警结束
			if(armInfo.param2 != 1) {
				armInfo.startType = 0;
			}
			var issInfo = this.mapVehiIssInfoList.get(vehicle.getIdno()+armInfo.param1);
			if(issInfo != null) {
				//如果任务结束比开始早传递到页面，则将状态改为结束状态
				if(armInfo.param2 == 1) {
					armInfo.param2 = issInfo.param2;
				}
				alarm.guid = issInfo.guid;
				this.mapVehiIssInfoList.remove(vehicle.getIdno()+armInfo.param1);
			}else {
				this.mapVehiIssInfoList.put(vehicle.getIdno()+armInfo.param1, armInfo);
			}
		}
		
		//查找是否已经存在些报警事件
		var vehiAlarm = this.mapAlarmList.get(alarm.guid);
		if (vehiAlarm == null) {
			vehiAlarm = new standardAlarm(alarm.guid, alarm.stType);
			this.mapAlarmList.put(alarm.guid, vehiAlarm);
			this.alarmList.push(vehiAlarm);
			
			//报警缓存最多放10240条记录，如果多出了些记录，则按时间顺序移除一部分老的数据
			if (this.alarmList.length > 10240) {
				for (var i = 0; i < 1024; ++ i) {
					var tempAlarm = this.alarmList.pop();
					this.mapAlarmList.remove(tempAlarm.guid);
				}
			}
		}
		//更新报警信息
		vehiAlarm.setAlarm(armInfo);
		
		//解析出报警事件
		var data = vehiAlarm.parseAlarmInfo(true);
		data.vehiIdno = vehicle.getIdno();
		if(data.armType != null) { 
			if(typeof monitorMedia != 'undefined' && monitorMedia != null) {
				//如果是录像下载完成事件
				if(data.armType == 130) {
					monitorMedia.doAddMediaFile(data);
					return;
				}else if(data.armType == 113 && data.armIinfo == 19) {//如果是离线任务通知
					monitorMedia.serverEventTableObject.flexRemoveRow(alarm.guid);
					data.id = alarm.guid;
					monitorMedia.addServerInfoToEvent(data);
					return;
				}
			}
		}
		//将报警事件放到报警事件栏的第一行，因此不管事件是否存在，都先从事件列表上移除
		//	var rowid = $('#alarmTable').flexGetRowid(alarm.guid);
//		this.alarmTableObj.flexRemoveRow(alarm.guid);
		
		//如果返回类型解析为未知，则不显示
		if(data.type != null && data.type != '' && data.type != parent.lang.unknown) {
//			data.id = alarm.guid;
			data.id = vehicle.getIdno();
			data.guid = alarm.guid;
			
			this.addAlarmToEventList.push(data);
			
			//启动添加报警数据到报警信息列表的定时器
			if(this.flashAddAlarmToEventTimer == null) {
				this.runAddAlarmToEventTimer();
			}
			
			//引发报警联动
			if(typeof alarmMotion != 'undefined' && alarmMotion != null 
					&& typeof parent.myUserRole != 'undefined' && parent.myUserRole != null 
					&& parent.myUserRole.isPermit(661)) {
				//是否报警结束
				var isEnd = false;
				if(data.endTime != null && data.endTime != '') {
					isEnd = true;
				}
				alarmMotion.doAlarmMotion(vehicle.getIdno(), armInfo.armType, isEnd, alarm.alarmPackNumber);
			}
		}
	}
	//处理上下线事件
	//#define GPS_ALARM_TYPE_DEV_ONLINE				17		//设备在线
	//#define GPS_ALARM_TYPE_DEV_DISONLINE			67		//设备断线
	if (alarm.type == 17) {
		this.updateOnline(vehicle, alarm.DevIDNO, true);
	} else if (alarm.type == 67) {
		this.updateOnline(vehicle, alarm.DevIDNO, false);
	}
//	loadConsoleTime(false, 'doRecvAlarm');
};

//修改具体报警信息
//object 要修改的对象
//position 是否是坐标
monitorVehicleAlarm.prototype.modifyColumnTitle = function(object, value, position) {
	if(object) {
		if(position) {
			if(value && value != parent.lang.monitor_gpsUnvalid) {
				var point = value.split(',');
				if(!object.hasClass('maplngLat')) {
					object.addClass('maplngLat');
				}
				var onclick = 'changeMapAddress(this,'+point[1]+','+point[0]+');';
				object.attr('onclick', onclick);
			}else {
				if(object.hasClass('maplngLat')) {
					object.removeClass('maplngLat');
				}
				if(object.attr('onclick')) {
					object.removeAttr('onclick');
				}
			}
		}
		if(value) {
			object.attr('title', value);
			object.text(value);
		}else {
			object.attr('title', '');
			object.text('');
		}
	}
}

/**
 * 更新报警信息列表
 */
monitorVehicleAlarm.prototype.updateAlarmEvent = function(armInfo) {
	var rowObj = this.alarmTableObj.find(this.alarmTableObj.flexGetRowid(armInfo.id));
	if(rowObj && rowObj.length > 0) {//列表存在
		this.modifyColumnTitle(rowObj.find('.type div span'), armInfo.type);
		var armSum = Number(rowObj.find('.armSum div span').html()) + Number(armInfo.armSum);
		this.modifyColumnTitle(rowObj.find('.armSum div span'),  armSum);
		this.modifyColumnTitle(rowObj.find('.startTime div span'), armInfo.startTime);
		this.modifyColumnTitle(rowObj.find('.endTime div span'), armInfo.endTime);
		this.modifyColumnTitle(rowObj.find('.desc div span'), armInfo.desc);
		this.modifyColumnTitle(rowObj.find('.startPos div span'), armInfo.startPos, true);
		this.modifyColumnTitle(rowObj.find('.endPos div span'), armInfo.endPos, true);
	}
}

//开启向报警列表更新数据的定时器
monitorVehicleAlarm.prototype.runUpdateAlarmToEventTimer = function(){
	//本类对象
	var myMonitorAlarm = this;
	this.flashUpdateAlarmToEventTimer = setTimeout(function () {
		myMonitorAlarm.startUpdateAlarmToEventTime = (new Date()).getTime();
		myMonitorAlarm.flashUpdateAlarmToEvent();
	}, 50);
};

//向报警列表更新数据
monitorVehicleAlarm.prototype.flashUpdateAlarmToEvent = function(){
	if(this.alarmUpdateToEventList != null && this.alarmUpdateToEventList.length > 0) {
		var armInfo = this.alarmUpdateToEventList[0];
		this.alarmUpdateToEventList.splice(0, 1);
		
		this.updateAlarmEvent(armInfo);

		if((new Date()).getTime() - this.startUpdateAlarmToEventTime < 500) {
			this.flashUpdateAlarmToEvent();
		}else {
			this.runUpdateAlarmToEventTimer();
		}
	}else {
		this.flashUpdateAlarmToEventTimer = null;
	}
}

//开启向报警列表添加数据的定时器
monitorVehicleAlarm.prototype.runAddAlarmToEventTimer = function(){
	//本类对象
	var myMonitorAlarm = this;
	this.flashAddAlarmToEventTimer = setTimeout(function () {
		myMonitorAlarm.startAddAlarmToEventTime = (new Date()).getTime();
		myMonitorAlarm.flashAddAlarmToEvent();
	}, 50);
};

//向报警列表添加数据
//耗时 200ms -  500ms  600ms+ 500辆车 9画面视频
monitorVehicleAlarm.prototype.flashAddAlarmToEvent = function(){
	if(this.addAlarmToEventList != null && this.addAlarmToEventList.length > 0) {
//		loadConsoleTime(true, 'flashAddAlarmToEvent');
		////提示报警有新的报警信息
		this.showAlarmMessage();
		
		//处理报警，同一车辆的报警，向上叠加，只显示最新的报警信息
		//如果报警列表中不存在车辆的报警信息，则添加，否则更新
		var armInfo = this.addAlarmToEventList[0];
		this.addAlarmToEventList.splice(0, 1);
		
		var rowObj = this.alarmTableObj.find(this.alarmTableObj.flexGetRowid(armInfo.id));
		if(rowObj && rowObj.length > 0) {//列表存在
			var oldArmInfo = this.mapAlarmUpdateToEventList.get(armInfo.id);
			if(oldArmInfo != null) {
				armInfo.armSum =  Number(oldArmInfo.armSum);
			}else {
				armInfo.armSum = 0;
			}
			//如果有开始时间和结束时间，表示报警结束，则报警数目不增加
			if(!armInfo.startTime || !armInfo.endTime) {
				armInfo.armSum += 1;
			}
			this.mapAlarmUpdateToEventList.put(armInfo.id, armInfo);
			
			if(this.addAlarmToEventList.length == 0 || (new Date()).getTime() - this.startAddAlarmToEventTime >= 500) {
				var that = this;
				this.mapAlarmUpdateToEventList.each(function(vehiIdno, armInfo_) {
					that.alarmUpdateToEventList.push(armInfo_);
				});
				this.mapAlarmUpdateToEventList.clear();
				if(this.flashUpdateAlarmToEventTimer == null) {
					this.runUpdateAlarmToEventTimer();
				}
			}
		}else {//列表不存在
			//表示已加入，但未放入列表，修改报警数目
			var oldArmInfo = this.mapAlarmAddToEventList.get(armInfo.id);
			if(oldArmInfo != null) {
				armInfo.armSum =  Number(oldArmInfo.armSum);
				if(!armInfo.startTime || !armInfo.endTime) {
					armInfo.armSum += 1;
				}
			}else {
				armInfo.armSum = 1;
			}
			this.mapAlarmAddToEventList.put(armInfo.id, armInfo);
			
			if(this.mapAlarmAddToEventList.size() >= 50 || this.addAlarmToEventList.length == 0) {
				var rows = [];
				this.mapAlarmAddToEventList.each(function(vehiIdno, armInfo_) {
					rows.push(armInfo_);
				});
				this.mapAlarmAddToEventList.clear();
				//耗时比较多(添加500条需要3-4s)
//				loadConsoleTime(true, 'flexAppendRowJson');
				this.alarmTableObj.flexAppendRowJson(rows, true);
//				loadConsoleTime(false, 'flexAppendRowJson');
			}
		}
//		loadConsoleTime(false, 'flashAddAlarmToEvent');
		if((new Date()).getTime() - this.startAddAlarmToEventTime < 500) {
			this.flashAddAlarmToEvent();
		}else {
			this.runAddAlarmToEventTimer();
		}
	}else {
		this.flashAddAlarmToEventTimer = null;
	}
};

//选中事件列表
monitorVehicleAlarm.prototype.selectAlarmRowProp = function(obj, selRow) {
	//如果不执行，则跳过
	if(selRow && selRow == 'selAll') {
		return;
	}
	var vehiIdno = $.trim($(obj).find('.idno').find('div span').text());
	var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
	if (vehicle != null) {
		if(typeof monitorStatus != 'undefined' && monitorStatus != null) {
			if(!monitorStatus.findMonitorVehicle(vehiIdno)) {//如果没有监控
				if(typeof vehiTree != 'undefined' && vehiTree != null) {
					if(typeof loadTeamTree == 'function') {
						//如果没有添加到树列表则添加
						loadTeamTree(vehicle.getParentId(), function() {
							vehiTree.setCheck(vehiIdno, true);
							monitorStatus.addMonitorVehicle(vehiIdno);
						});
					}else {
						vehiTree.setCheck(vehiIdno, true);
						monitorStatus.addMonitorVehicle(vehiIdno);
					}
				}else {
					monitorStatus.addMonitorVehicle(vehiIdno);
				}
			}else {
				monitorStatus.selectVehicle(vehiIdno, true, true, true);
			}
		}
	}
}

monitorVehicleAlarm.prototype.getColumnTitle = function(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

//填充报警信息列表
monitorVehicleAlarm.prototype.fillAlarmTable = function(p, row, idx, index){
	var name = p.colModel[idx].name;
	var ret = "";
	if(name == 'idno') {
		if(row.vehiIdno) {
			ret = row.vehiIdno;
		}
//		var vehicle = parent.vehicleManager.getVehiByDevIdno(row.idno);
//		if(vehicle != null) {
//			ret = vehicle.getIdno();
//		}
	} else if(name == 'type') { 
		if(row.type) {
			ret = row.type;
		}
	} else if(name == 'armSum') { 
		if(row.armSum) {
			ret = row.armSum;
		}
	}else if(name == 'startTime') {
		if(row.startTime) {
			ret = row.startTime;
		}
	} else if(name == 'endTime') { 
		if(row.endTime) {
			ret = row.endTime;
		}
	} else if(name == 'startPos') { 
		if(row.startPos) {
			if(row.startPos != parent.lang.monitor_gpsUnvalid && row.startPos != '') {
				var point = row.startMapLngLat.split(',');
				ret = '<span class="maplngLat" onclick="changeMapAddress(this,'+point[1]+','+point[0]+');" title="'+ row.startPos +'">'+ row.startPos +'</span>';
			}else {
				ret = '<span title="'+ row.startPos +'">'+ row.startPos +'</span>';
			}
		//	ret = row.startPos;
			return ret;
		}
	} else if(name == 'endPos') { 
		if(row.endPos) {
			if(row.endPos != parent.lang.monitor_gpsUnvalid && row.endPos != '') {
				var point = row.endMapLngLat.split(',');
				ret = '<span class="maplngLat" onclick="changeMapAddress(this,'+point[1]+','+point[0]+');" title="'+ row.endPos +'">'+ row.endPos +'</span>';
			}else {
				ret = '<span title="'+ row.endPos +'">'+ row.endPos +'</span>';
			}
			//ret = row.endPos;
			return ret;
		}
	} else if(name == 'desc') { 
		if(row.desc) {
			ret = row.desc;
		}
	} else if(name == 'operator') {//报警查看
		return '<a class="view" onclick="doAlarmFind(\''+row.id+'\');" title="'+parent.lang.view+'"></a>';
	} else if(name == 'other') {
		//ret = row.id;
	}
	return this.getColumnTitle(ret);
};

//填充车辆列表
monitorVehicleAlarm.prototype.updateOnline = function(vehicle, devIdno, isOnline){
	if (vehicle.setOnline(devIdno, isOnline)) {
		//收到上下级事件时，需要及时更新  树列表  监控列表及地图上的状态
		//monitorVehicleStatus.prototype.updateVehicleStatus 和这里面更新接口可以同样使用
		this.updateOnlineVehicleList.push(vehicle);
		
		if(this.flashUpdateOnlineTimer == null) {
			this.runUpdateOnlineTimer();
		}
	}
};

//开启上下线刷新车辆状态信息的定时器
monitorVehicleAlarm.prototype.runUpdateOnlineTimer = function(){
	//本类对象
	var myMonitorAlarm = this;
	this.flashUpdateOnlineTimer = setTimeout(function () {
		myMonitorAlarm.startUpdateOnlineTime = (new Date()).getTime();
		myMonitorAlarm.flashUpdateOnline();
	}, 50);
};

//上下线刷新车辆状态信息
monitorVehicleAlarm.prototype.flashUpdateOnline = function(){
	if(this.updateOnlineVehicleList != null && this.updateOnlineVehicleList.length > 0) {
		if(typeof monitorStatus != 'undefined' && monitorStatus != null) {
			monitorStatus.updateVehicleStatus(this.updateOnlineVehicleList[0]);
			
			//修改公司车队中的在线离线车辆信息
			var team_ = parent.vehicleManager.getTeam(this.updateOnlineVehicleList[0].getParentId());
			if(team_) {
				//如果上线
				var idno_ = this.updateOnlineVehicleList[0].getIdno();
				if(this.updateOnlineVehicleList[0].isOnline()) {
					team_.addOnlineVehiIdno(idno_);
					team_.delOfflineVehiIdno(idno_);
				}else {
					team_.delOnlineVehiIdno(idno_);
					team_.addOfflineVehiIdno(idno_);
				}
			}
		}
		this.updateOnlineVehicleList.splice(0, 1);
		
		if((new Date()).getTime() - this.startUpdateOnlineTime < 500) {
			this.flashUpdateOnline();
		}else {
			this.runUpdateOnlineTimer();
		}
	}else {
		this.flashUpdateOnlineTimer = null;
		if(typeof monitorStatus != 'undefined' && monitorStatus != null) {
			monitorStatus.initVehicleStatusCount();
		}
		if(typeof countGroupVehiOnlineEx == 'function') {
			countGroupVehiOnlineEx();
		}
	}
}

//提示报警有新的报警信息
monitorVehicleAlarm.prototype.showAlarmMessage = function() {
	//如果当前选择的是  GPS监控  或者 系统事件列表，当接收到报警时，需要将  报警信息字体变红，
	//展现已经接收到了报警，及时提示用户
	if(!$('#gps-alarm').hasClass('active')) {
		$('#gps_alarm_title').css('background-color','#FF0000');
	}
}

//初始化用户的报警屏蔽信息
monitorVehicleAlarm.prototype.initAlarmShield = function() {
//	if(typeof parent.myUserRole != 'undefined' && parent.myUserRole != null && parent.myUserRole.isPermit(662)) {
		//本类对象
		var myMonitorAlarm = this;
		$.myajax.jsonGet("StandardPositionAction_findAlarmShield.action", function(json, action, success) {
			if(success) {
				if(json.alarmShield != null) {
					myMonitorAlarm.alarmShields = json.alarmShield.split(',');
				}
			}
		}, null);
//	}
}

//判断是否报警屏蔽
monitorVehicleAlarm.prototype.isAlarmShield = function(armType) {
	//判断是否报警屏蔽
	if(this.alarmShields != null && armType != null){
		var types = armType.toString().split(',');
		for (var i = 0; i < types.length; i++) {
			var s = String.fromCharCode(2);
			var reg = new RegExp(s+types[i]+s);
			if(reg.test(s+this.alarmShields.join(s)+s)) {
				return true;
			}
		}
	}
	return false;
}

//报警查看
//vehiIdno 报警guid
monitorVehicleAlarm.prototype.doAlarmFind = function(vehiIdno) {
	if(this.alarmListObj == null) {
		var vehicleList = parent.vehicleManager.getAllVehicle();
		this.onlineVehicleList = [];
		this.onlineVehicleList.push({id: '*all', name: parent.lang.all_vehicles});
		for (var i = 0, j = vehicleList.length; i < 200 && i < j; i++) {
			this.onlineVehicleList.push(vehicleList[i]);
		}
		var myClass = this;
		var url = 'url:LocationManagement/vehicleAlarmList.html';
		if(vehiIdno) {
			url += '?vehiIdno='+ vehiIdno
		}
		this.alarmListObj = $.dialog({id:'alarmList', title: parent.lang.alarm_alarm_list, content: url,
			width: '900px', height: '500px', min:true, max:false, lock: false,fixed:false
				, resize:false, close: function() {
					myClass.alarmListObj = null;
					if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
						popTipsObject.remove('alarmList');
					}
				} });
	}else {
		if(this.alarmListObj.content && (typeof this.alarmListObj.content.initPageInfo == 'function')) {
			this.alarmListObj.content.initPageInfo(vehiIdno);
		}
		this.alarmListObj.show();
	}
	
	if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
		popTipsObject.put('alarmList', this.alarmListObj);
	}
	if(typeof hidePopTips == 'function'){
		hidePopTips('alarmList');
	}
}