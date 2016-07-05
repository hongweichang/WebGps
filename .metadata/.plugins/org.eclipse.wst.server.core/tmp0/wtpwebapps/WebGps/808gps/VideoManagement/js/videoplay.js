/**
 * 录像回放类
 */
function videoPlayback() {
	this.videoTimeTable = null; //录像时间显示类对象
	this.videoFileTable = null; //录像文件列表对象
	this.trackPlayer = null; //轨迹回放类对象
	this.loginServer = null; //登陆服务器信息
	this.queryVehicle = null; //查找的车辆对象
	this.queryVehicleChannels = new Array(); ////查找的车辆通道
	this.videoFileList = new Hashtable();  //视频文件列表
	this.isSearching = false;   //是否正在搜索文件
	this.ajaxVehicleServerObj = null; //终端设备服务器信息的ajax对象
	this.getVideoTimer = null; //获取视频播放时间的定时器
	this.taskInfo = null;  //分段下载窗口对象
	this.loadTimeLine = true; //是否加载时间轴，如果返回文件日期错误则不加载
}

//初始化录像回放
videoPlayback.prototype.initialize = function() {
	//初始化时间列表
	this.initVideoTimeTable();
	//初始化录像文件列表
	this.initVideoFileTable();
	//初始化轨迹回放类
	this.trackPlayer = new trackPlayback();
	//获取登录服务器信息
//	this.getLoginServer();
}

//获取登录服务器信息
videoPlayback.prototype.getLoginServer = function() {
	var videoPlay_ = this;
	//数据库取实时状态
	$.myajax.jsonPost('StandardLoginAction_getLoginServer.action', null, false, function(json, success) {
		if(success) {
			videoPlay_.loginServer = json.loginServer;
		} else {
			//提示获取服务器信息失败
			$.dialog.tips(parent.lang.errorGetServerInfo, 2);
		}
	});
}

//初始化时间列表
videoPlayback.prototype.initVideoTimeTable = function() {
	this.videoTimeTable = new timelineInfo();
	this.videoTimeTable.setRootId('videoTime');
	this.videoTimeTable.initialize();
}

//获取通道名
videoPlayback.prototype.getChnName = function(chn) {
	if(this.queryVehicleChannels && chn != null) {
		for (var i = 0; i < this.queryVehicleChannels.length; i++) {
			//视频通道
			if(chn == this.queryVehicleChannels[i].index && this.queryVehicleChannels[i].devType == 1) {
				return this.queryVehicleChannels[i].name;
			}
		}
	}
	return "";
}

//获取所有通道名，逗号分隔
videoPlayback.prototype.getAllChnName = function() {
	var chnNames = [];
	if(this.queryVehicleChannels) {
		for (var i = 0; i < this.queryVehicleChannels.length; i++) {
			if(this.queryVehicleChannels[i].devType == 1) {
				chnNames.push(this.queryVehicleChannels[i].name);
			}
		}
	}
	return chnNames.toString();
}

//获取通道名，逗号分隔
videoPlayback.prototype.getMaskChnArray = function(chnMask) {
	var chns = [];
	var chnNames = [];
	if(this.queryVehicleChannels) {
		for (var i = 0; i < this.queryVehicleChannels.length; i++) {
			if((chnMask>>this.queryVehicleChannels[i].index)&1 > 0  && this.queryVehicleChannels[i].devType == 1) {
				chns.push(this.queryVehicleChannels[i].index);
				chnNames.push(this.queryVehicleChannels[i].name);
			}
		}
	}
	var data = {};
	data.maskChns = chns.toString();
	data.maskChnNames = chnNames.toString();
	return data;
}

//获取文件时间
videoPlayback.prototype.getFileTime = function(year, mon, day) {
	var retTime = "";
	retTime += Number(year)+2000;
	retTime += "-";
	if(mon < 10) {
		retTime += "0"+mon;
	}else {
		retTime += mon;
	}
	retTime += "-";
	if(day < 10) {
		retTime += "0"+day;
	}else {
		retTime += day;
	}
	return retTime;
}

videoPlayback.prototype.getColumnTitle = function(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

/*
 * 填充录像文件列表
 */
videoPlayback.prototype.fillVideoFileTable = function(p, row, idx, index) {
	var name = p.colModel[idx].name;
	var ret = "";
	if(name == 'fileIndex') {
		ret = row.id + 1;
	} else if(name == 'fileTime') {
		ret = row.timeTitle;
	} else if(name == 'videoType') {
		if(row.type == 0) {
			ret = parent.lang.file_normal;
		}else if(row.type == 1) {
			var vehicle = parent.vehicleManager.getVehicle(row.vehiIdno);
			var device = vehicle.getVideoDevice();
			var ioNames;
			if(device && device.getIoInName()) {
				ioNames = device.getIoInName().split(",");
			}
			var str = "";
			if((row.arm>>0)&1 > 0){
				str += parent.lang.alarm_type_ungency_button;
			}
			if((row.arm>>1)&1 > 0){
				if(str != ""){
					str += ";"
				}
				str += parent.lang.alarm_type_overspeed;
			} 
			if((row.arm>>2)&1 > 0){
				if(str != ""){
					str += ";"
				}
				str += parent.lang.alarm_type_low_speed;
			}
			if((row.arm>>3)&1 > 0){
				if(str != ""){
					str += ";"
				}
				str += parent.lang.alarm_type_shake;
			}
			if((row.arm>>4)&1 > 0){
				if(str != ""){
					str += ";"
				}
				str += parent.lang.alarm_type_temperator;
			}
			if((row.arm>>5)&1 > 0){
				if(str != ""){
					str += ";"
				}
				str += parent.lang.alarm_type_motion;
			}
			if((row.arm>>6)&1 > 0){
				if(str != ""){
					str += ";"
				}
				str += parent.lang.alarm_type_upsCut;
			}
			if((row.arm>>7)&1 > 0){
				if(str != ""){
					str += ";"
				}
				str += parent.lang.alarm_type_rollover;
			}
			if((row.arm>>8)&1 > 0){
				if(str != ""){
					str += ";"
				}
				str += parent.lang.alarm_type_fatigue;
			}
			if((row.arm>>9)&1 > 0){
				if(str != ""){
					str += ";"
				}
				if(ioNames && ioNames.length >= 1){
					str += ioNames[0];
				}else{
					str += parent.lang.alarm_type_io1;
				}
			}
			if((row.arm>>10)&1 > 0){
				if(str != ""){
					str += ";"
				}
				if(ioNames && ioNames.length >= 2){
					str += ioNames[1];
				}else{
					str += parent.lang.alarm_type_io2;
				}
			}
			if((row.arm>>11)&1 > 0){
				if(str != ""){
					str += ";"
				}
				if(ioNames && ioNames.length >= 3){
					str += ioNames[2];
				}else{
					str += parent.lang.alarm_type_io3;
				}
			}
			if((row.arm>>12)&1 > 0){
				if(str != ""){
					str += ";"
				}
				if(ioNames && ioNames.length >= 4){
					str += ioNames[3];
				}else{
					str += parent.lang.alarm_type_io4;
				}
			}
			if((row.arm>>13)&1 > 0){
				if(str != ""){
					str += ";"
				}
				if(ioNames && ioNames.length >= 5){
					str += ioNames[4];
				}else{
					str += parent.lang.alarm_type_io5;
				}
			}
			if((row.arm>>14)&1 > 0){
				if(str != ""){
					str += ";"
				}
				if(ioNames && ioNames.length >= 6){
					str += ioNames[5];
				}else{
					str += parent.lang.alarm_type_io6;
				}
			}
			if((row.arm>>15)&1 > 0){
				if(str != ""){
					str += ";"
				}
				if(ioNames && ioNames.length >= 7){
					str += ioNames[6];
				}else{
					str += parent.lang.alarm_type_io7;
				}
			}
			if((row.arm>>16)&1 > 0){
				if(str != ""){
					str += ";"
				}
				if(ioNames && ioNames.length >= 8){
					str += ioNames[7];
				}else{
					str += parent.lang.alarm_type_io8;
				}
			}
			if(str != ""){
				ret = str;
			}else{
				ret = parent.lang.monitor_vehiStatusAlarm;
			}
		}
	} else if(name == 'vehiIdno') {
		ret = row.vehiIdno;
	} else if(name == 'vehiChn') {
		ret = row.chnName;
	} else if(name == 'location') {
		if(row.loc == 1) {
			ret = parent.lang.terminalDevice;
		}else if(row.loc == 2) {
			ret = parent.lang.server_storage;
		}else if(row.loc == 4) {
			ret = parent.lang.server_down;
		}
	} else if(name == 'fileSize') {
		ret = (row.len/1024/1024).toFixed(2) + 'MB';
	} else if(name == 'fileSrc') {
		ret = row.file;
	} else if(name == 'operator') {
		if(row.loc == 1) {
			//设备有直接下载的权限
			if(row.isDirect) {
				ret = '<a class="downLoad" onclick="downloadVideoFile('+row['id']+');" title="'+parent.lang.download+'"></a>';
			}
			ret += '<a class="segDownLoad" onclick="downloadVideoFileSec(this,'+row['id']+');" title="'+parent.lang.segmentDownload+'"></a>';
		}else {
			ret = '<a class="downLoad" onclick="downloadVideoFile('+row['id']+');" title="'+parent.lang.download+'"></a>';
		}
		ret += '<a class="playback" onclick="videoFileReplay(this,'+row['id']+');" title="'+parent.lang.video_playback+'"></a>';
		return ret;
	}
	return this.getColumnTitle(ret);
};

//初始化录像文件列表
videoPlayback.prototype.initVideoFileTable = function() {
	var videoPlayback_ = this; //本类对象
	//序号、时间、录像类型、终端设备（车牌号）、通道、文件位置、大小（MB）、文件
	this.videoFileTable = $("#videoFileTable").flexigrid({
		url: "",//"StandardTrackAction_query.action",
		dataType: 'json',
		colModel : [
		    {display: parent.lang.operator, name : 'operator', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.index, name : 'fileIndex', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.report_date, name : 'fileTime', width : 200, sortable : false, align: 'center'},
			{display: parent.lang.alarm_record_type, name : 'videoType', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.terminalDevice, name : 'vehiIdno', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.alarm_channel, name : 'vehiChn', width : 60, sortable : false, align: 'center'},
			{display: parent.lang.fileLocation, name : 'location', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.alarm_record_size+"(MB)", name : 'fileSize', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.file, name : 'fileSrc', width : 350, sortable : false, align: 'center'}
			],
		usepager: false,
		autoload: false,
		useRp: false,
		singleSelect: true,
		clickRowCenter: false,
		onDoubleClick: function(obj, event) {
			videoPlayback_.doubleClickVideoFileRowProp(obj, event);
		},
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: true,
		width: 'auto',
		height: 'auto',
		resizable: false
	});
	this.videoFileTable.flexSetFillCellFun(function(p, row, idx, index) {
		return videoPlayback_.fillVideoFileTable(p, row, idx, index);
	});
}

/**
 * 文件列表行双击事件
 */
videoPlayback.prototype.doubleClickVideoFileRowProp = function(obj, event) {
	var id = $.trim($(obj).attr('data-id'));
	var fileInfo = this.videoFileList.get(Number(id));
	if(fileInfo != null) {
		//chnMask>0时按位进行判断 多个通道 ； 98 全部通道
		if(fileInfo.chnMask > 0 || fileInfo.chn == 98) {
			this.addVideoFileChn(obj, fileInfo, 'videoFileReplayChn', event);
		}else {
			//获取视频文件播放的服务器信息,成功后回放视频文件信息
			var title = fileInfo.vehiIdno+' - '+ this.getChnName(fileInfo.chn)+' - '+ fileInfo.timeTitle;
			this.doReplayVehicleServer(fileInfo, 0, 0, title);
		}
	}
}

/**
 * 获取回放的参数
 */
videoPlayback.prototype.checkSearchParam = function() {
	//车牌号
	var vehiIdno = $.trim($('#hidden-vehiIdnos').val());
	if(vehiIdno == null || vehiIdno == '') {
		$.dialog.tips(parent.lang.report_selectVehiNullErr, 2);
		return false;
	}
	//时间
	var time = $("#datepicker").datepicker('getDate');
	//文件位置 1设备，2存储服务器，4下载服务器
	var location = $.trim($("input[name='wjwz']:checked").val());
	if(location == null || location == '') {
		$.dialog.tips(parent.lang.ErrorFileLocation, 2);
		return false;
	}
	//如果查询的是设备，则需要设备在线
	var devIdno = null;
	var vehicle = parent.vehicleManager.getVehicle(vehiIdno.toString());
	//获取视频设备
	var device = vehicle.getVideoDevice();
//	if(location == 1) {
//		if(!vehicle.isOnline()) {
//			alert(parent.lang.video_not_online);
//			return false;
//		}
//		if(device != null && !device.isOnline()) {
//			alert(parent.lang.video_not_online_device);
//			return false;
//		}
//	}
	if(device == null) {
		$.dialog.tips(parent.lang.NullVideoDevice, 2);
		return false;
	}
	devIdno = device.getIdno();
	
	//文件类型  2表示录像
	var fileType = $.trim($("input[name='wjlx']:checked").val());
	if(fileType == null || fileType == '') {
		$.dialog.tips(parent.lang.NullFileType, 2);
		return false;
	}
	//录像类型  0表示常规，1表示报警，-1或者2表示所有
	var videoType = $.trim($("input[name='lxlx']:checked").val());
	if(videoType == null) {
		$.dialog.tips(parent.lang.NullVideoType, 2);
		return false;
	}
	
	//填充参数
	var data = {};
	data.did = devIdno;
	data.loc = location;
	
	this.queryPreData = data;
	
	var param = {};
	if(location == 1) {
		param.did = devIdno;
	}else {
		param.did = vehiIdno;
	}
	param.loc = location;
	param.stm = time;
	param.ftp = fileType;
	param.vtp = videoType;
	param.chn = $.trim($('#vehiChn').val());

	this.queryParam = param;
	
	this.queryVehicle = parent.vehicleManager.getVehicle(vehiIdno.toString());
	this.queryVehicleChannels = this.queryVehicle.getVehicleChannel();
	return true;
};

//禁用搜索面板
videoPlayback.prototype.disableForm = function(disable) {
	this.isSearching = disable;
	diableInput("#combox-vehiIdnos", disable, true);
	disableButton("#combox-vehiIdnos", disable);
	diableInput("#wjwz-device", disable, true);
	disableButton("#wjwz-device", disable);
	diableInput("#wjwz-storage", disable, true);
	disableButton("#wjwz-storage", disable);
	diableInput("#wjwz-download", disable, true);
	disableButton("#wjwz-download", disable);
	diableInput("#wjlx-video", disable, true);
	disableButton("#wjlx-video", disable);
	diableInput("#lxlx-normal", disable, true);
	disableButton("#lxlx-normals", disable);
	diableInput("#lxlx-alarm", disable, true);
	disableButton("#lxlx-alarm", disable);
	diableInput("#lxlx-all", disable, true);
	disableButton("#lxlx-all", disable);
	if(disable) {
		$('#btn_serach').text(parent.lang.search_stop);
		$("#datepicker").datepicker('disable');
		$('.car_select .more_car').unbind('click');
	}else {
		$('#btn_serach').text(parent.lang.btnSearch);
		$("#datepicker").datepicker('enable');
		if((typeof queryMoreVehicle) == 'function') {
			$('.car_select .more_car').on('click', queryMoreVehicle);
		}
	}
}

/**
 * 提交ajax
 */
videoPlayback.prototype.doAjaxSubmit = function(action, params, disabled, callback) {
	var videoPlay_ = this;
	var object = $.post(action, {json : JSON.stringify(params)}, function(json, textStatus) {
		if(textStatus == 'timeout'){
			if((typeof showDialogErrorMessage) == 'function') {
				showDialogErrorMessage(3);
			}
			if(disabled) {
				videoPlay_.disableForm(false);
			}
		} else if(textStatus == 'error') {
			if((typeof showDialogErrorMessage) == 'function') {
				showDialogErrorMessage(1);
			}
			if(disabled) {
				videoPlay_.disableForm(false);
			}
		} else if (textStatus == "success") {
			if(json.result == 0){
				var server = json.server;
				var lstSvrIp = [];
				var lgServer = {};
				lstSvrIp.push(server.clientIp);
				lstSvrIp.push(server.lanip);
				lstSvrIp.push(server.clientIp2);
				lgServer.port = server.clientPort;
				lgServer.ip = getComServerIp(lstSvrIp);
				
				if((typeof callback) == 'function') {
					callback(lgServer);
				}
			} else{
				var mess = '';
				if((typeof showDialogErrorMessage) == 'function') {
					mess = showDialogErrorMessage(json.result, json.cmsserver);
				}
				if(mess != null && mess == '') {
					$.dialog.tips(parent.lang.errorGetServerInfo, 2);
				}
				if(disabled) {
					videoPlay_.disableForm(false);
				}
			}
		} else {
			if((typeof showDialogErrorMessage) == 'function') {
				showDialogErrorMessage(4);
			}
			if(disabled) {
				videoPlay_.disableForm(false);
			}
		}
		$.myajax.showLoading(false);
	}, 'json');
	return object;
}

//获取终端设备服务器信息
videoPlayback.prototype.doGetVehicleServer = function() {
	//数据库取实时服务器信息
	var videoPlay_ = this;
	this.ajaxVehicleServerObj = this.doAjaxSubmit('StandardVideoTrackAction_queryDeviceServer.action',this.queryPreData, true, function(server) {
		videoPlay_.getVideoFileInfo(server);
	});
}

//处理文件信息，跨天的情况
videoPlayback.prototype.processFileDay = function(data) {
//	data.year = 15;
//	data.beg = 43200;
//	data.end = 86000;
	//文件跨天的情况 去掉前一天的时间或者后一天的时间
	//判断跨前一天，如果日期是前一天
	data.yearMonthDay = dateFormat2DateString(this.queryParam.stm);
	var day = Number(data.yearMonthDay.substring(8, 10));
//	data.day = day - 1;
//	data.end = 86400 + 1500;
	var fileDay = Number(data.day);
	var fileRealDate = this.getFileTime(data.year, data.mon, data.day);
	if(!dateCompareStrDateRange(data.yearMonthDay, fileRealDate, 1) || !dateCompareStrDateRange(fileRealDate, data.yearMonthDay, 1)) {
		this.loadTimeLine = false;
		
		data.relBeg = data.beg;
		data.relEnd = data.end;
		data.beginDate = fileRealDate +' '+ this.videoTimeTable.second2ShortHourEx(data.beg);
		data.endDate = fileRealDate +' '+ this.videoTimeTable.second2ShortHourEx(data.end);
		data.timeTitle = data.beginDate + ' - ' + this.videoTimeTable.second2ShortHourEx(data.end);
	}else {
		this.loadTimeLine = true;
		//跨前一天
		if(fileDay < day || (day == 1 && fileDay <= 31 && fileDay >=28 )) {
			data.relBeg = 0;
			data.relEnd = Number(data.end) - 86400;
			data.beginDate = fileRealDate +' '+ this.videoTimeTable.second2ShortHourEx(data.beg);
			data.endDate = dateFormat2DateString(dateGetNextMulDay(dateStrLongTime2Date(data.beginDate), 1)) +' '+ this.videoTimeTable.second2ShortHourEx(data.relEnd);
			data.timeTitle = data.beginDate + ' - ' + data.endDate;
		}else if(fileDay == day && Number(data.end) > 86400)  {
			//跨后一天
			data.relBeg = data.beg;
			data.relEnd = 86399;
			data.beginDate = fileRealDate +' '+ this.videoTimeTable.second2ShortHourEx(data.beg);
			data.endDate = dateFormat2DateString(dateGetNextMulDay(dateStrLongTime2Date(data.beginDate), 1)) +' '+ this.videoTimeTable.second2ShortHourEx(Number(data.end) - 86400);
			data.timeTitle = data.beginDate + ' - ' + data.endDate;
		}else {
			data.relBeg = data.beg;
			data.relEnd = data.end;
			data.beginDate = fileRealDate +' '+ this.videoTimeTable.second2ShortHourEx(data.beg);
			data.endDate = fileRealDate +' '+ this.videoTimeTable.second2ShortHourEx(data.end);
			data.timeTitle = data.beginDate + ' - ' + this.videoTimeTable.second2ShortHourEx(data.end);
		}
	}
}

//添加视频文件信息
videoPlayback.prototype.addVideoFileInfo = function(json) {
	//正在搜索才加入列表
	if(this.isSearching) {
		var files = new Array();
		if(json.files != null && json.files.length > 0) {
			//文件列表排序，按开始时间从小到大进行
			json.files.sort(function(a,b){return a.beg > b.beg ? 1 : -1});//从小到大排序
			//添加到视频文件列表
			var index = 0;
			for (var i = 0; i < json.files.length; i++) {
				//车辆不包含此通道，则去掉此条信息
				var isAdd = true;
				//分段下载任务的时候是否可以全文件下载
				//多个通道的文件，只能分段下载
				//chnMask>0时按位进行判断 多个通道 chn也是多个通道
				if(json.files[i].chnMask > 0) {
					json.files[i].maskChns = this.getMaskChnArray(json.files[i].chnMask).maskChns;
					json.files[i].chnName = this.getMaskChnArray(json.files[i].chnMask).maskChnNames;
					json.files[i].isSegment = true;//是否只能分段下载
					if(json.files[i].maskChns == '') {
						isAdd = false;
					}
				}else {
					//chn == 98 所有通道
					if(json.files[i].chn == 98) {
						json.files[i].chnName = this.getAllChnName();
						json.files[i].isSegment = true;
						if(json.files[i].chnName == '') {
							isAdd = false;
						}
					}else {
						json.files[i].chnName = this.getChnName(json.files[i].chn);
						if(json.files[i].chnName == '') {
							isAdd = false;
						}
					}
				}
				if(isAdd) {
					json.files[i].id = index;
					if(json.files[i].type == 1) {
						json.files[i].color = "#FF0000";
					}
				//	json.files[i].serverId =json.files[i].devIdno +'-'+ json.files[i].loc+ '-' +index;
				//	json.files[i].chn = 98;
					//chnMask>0时按位进行判断 多个通道
					/*if(json.files[i].chnMask > 0) {
						json.files[i].maskChns = this.getMaskChnArray(json.files[i].chnMask).maskChns;
						json.files[i].chnName = this.getMaskChnArray(json.files[i].chnMask).maskChnNames;
					}else {
						//chn == 98 所有通道
						if(json.files[i].chn == 98) {
							json.files[i].chnName = this.getAllChnName();
						}else {
							json.files[i].chnName = this.getChnName(json.files[i].chn);
						}
					}*/
				//	json.files[i].svr = 6;
					json.files[i].vehiIdno = this.queryVehicle.getIdno();
					//处理文件跨天的情况
					this.processFileDay(json.files[i]);
					var videoDevice = this.queryVehicle.getVideoDevice();
					//设备录像下载分为直接下载文件的方式或者下载流文件的方式
					//服务器的录像下载则直接使用下载单个文件的方式即可
					//通立、国脉、宏电、锐哲  这4个厂家的录像文件只能按分段方式下载，不支持直接文件下载的方式
					//设备有直接下载的权限
					if(videoDevice.isDirectDownload()) {
						json.files[i].isDirect = true;
					}
					//
					this.videoFileList.put(index, json.files[i]);
					var videoType = $.trim($("input[name='lxlx']:checked").val());
					var alarmType = $.trim($("#hidden-alarmList").val());
					if(videoType != 1){
						files.push(json.files[i]);
					}else{
						 if(alarmType == 17){
							 files.push(json.files[i]);
						 }else{
							 if(((json.files[i].arm)>>parseInt(alarmType))&1 > 0){
								 files.push(json.files[i]);
							 }
						 }
					}
					index++;
				}
			}
			if(files.length > 0) {
				//添加到录像时间线
				if(this.loadTimeLine) {
					var videoPlay_ = this;
					this.videoTimeTable.addVideoChn(files, this.queryVehicleChannels, this.queryParam.chn, function(id, relChn, chn, begTime) {
						videoPlay_.doClickVideoChnTd(id, relChn, chn, begTime);
					});
				}
				//添加到视频文件列表
				this.videoFileTable.flexAppendRowJson(files, false);
				//弹出文件列表
				$('.map_tab li').each(function() {
					if($(this).hasClass('active')) {
						$(this).click();
					}
				});
				$.dialog.tips(parent.lang.searchCompleted, 1);
			}
		}
		if(json.result == 0) {
			if(files.length <= 0) {
				$.dialog.tips(parent.lang.NullVideoFileInfo, 2);
			}
		}else {
			var mess = '';
			if((typeof showDialogErrorMessage) == 'function') {
				mess = showDialogErrorMessage(json.result, json.cmsserver);
			}
			if(mess != null && mess == '') {
				$.dialog.tips(parent.lang.errorGetVideoFile, 2);
			}
		}
	}
	this.disableForm(false);
}

//获取视频文件信息
videoPlayback.prototype.getVideoFileInfo = function(lgServer) {
	//是否停止搜索，如果停止，则不搜索
	if(!this.isSearching) {
		return;
	}
	var strStm = dateFormat2TimeString(this.queryParam.stm);
	var year = strStm.substring(0, 4);
	var month = strStm.substring(5, 7);
	var day = strStm.substring(8, 10);
	var stmDaily = strStm.substring(11, 19);
	var etmDaily = "23:59:59";
	
	var stm = 0;
	var etm = 0;
	var temp = etmDaily.split(":");
	if (temp.length == 2) {
		etm = Number(temp[0]) * 3600 + Number(temp[1]) * 60;
	} else if (temp.length == 3) {
		etm = Number(temp[0]) * 3600 + Number(temp[1]) * 60 + Number(temp[2]);
	}
	var action = 'http://'+ lgServer.ip + ':' + lgServer.port +'/3/5/callback=getData';
	action += '?DownType=2&DevIDNO='+ this.queryParam.did +'&LOC='+  this.queryParam.loc +'&CHN='+ this.queryParam.chn;
	action += '&YEAR='+ year +'&MON='+  month +'&DAY='+ day;
	action += '&RECTYPE='+ this.queryParam.vtp +'&FILEATTR='+ this.queryParam.ftp;
	action += '&BEG='+ stm +'&END='+ etm;
	
	var videoPlay_ = this;
	this.ajaxVehicleServerObj = $.ajax({  
		type : "post",  
        url : action,
        timeout: 120000,
        data : null, 
        dataType: "jsonp",
        success : getData = function(json){
        	//添加视频文件信息
        	videoPlay_.addVideoFileInfo(json);
        },  
        error:function(XHR, textStatus, errorThrown){
        	if(errorThrown == 'timeout') {
        		//获取视频文件信息失败！
        		$.dialog.tips(parent.lang.errorGetVideoFile, 2);
        	}
        	videoPlay_.disableForm(false);
         }
	});
}

//搜索视频
videoPlayback.prototype.doQueryVideo = function() {
	//正在搜索，则停止搜索
	if(this.isSearching) {
		if(this.ajaxVehicleServerObj != null) {
			this.ajaxVehicleServerObj.abort();
		}
		this.disableForm(false);
		return;
	}
	this.disableForm(true);
	//判断条件
	if(!this.checkSearchParam()) {
		this.disableForm(false);
		return;
	}
	/*if((typeof ttxVideo) != 'undefined') {
		//清除正在播放的视频
		ttxVideo.clearVideoReplay();
		//清除播放窗口标题
		ttxVideo.setTvplayTitle(parent.lang.video_play);
	}
	//清除地图轨迹
	this.trackPlayer.stopPlay();*/
	
	//搜索之前先将视频时间列表清空
	this.videoTimeTable.clearVideoChn();
	//搜索之前先将视频文件列表清空
	this.videoFileTable.flexClear();
	this.videoFileList.clear();
	
	//获取服务器信息，成功后获取视频文件信息
	this.doGetVehicleServer();
}

//获取下载视频文件服务器信息
videoPlayback.prototype.doDownloadVehicleServer = function(fileInfo) {
	//获取之前先取消上次的请求
	if(this.ajaxDownloadVehicleServerObj != null) {
		this.ajaxDownloadVehicleServerObj.abort();
	}
	
	var param = {};
	if(fileInfo.loc == 1) {
		param.did = fileInfo.devIdno;
	}else {
		param.did = fileInfo.vehiIdno;
	}
	param.loc = fileInfo.loc;
	param.ftp = fileInfo.svr; //
	//数据库取实时服务器信息
	var videoPlay_ = this;
	$.myajax.showLoading(true, parent.lang.findDownloadAddress);
	this.ajaxDownloadVehicleServerObj = this.doAjaxSubmit('StandardVideoTrackAction_queryDownloadServer.action', param, false, function(server) {
		videoPlay_.doDownloadVideoFileInfo(fileInfo, server);
	});
}

//下载视频文件信息
videoPlayback.prototype.doDownloadVideoFileInfo = function(fileInfo, dwServer) {
	var devIdno = fileInfo.devIdno;
	if(fileInfo.loc != 1) {
		devIdno = fileInfo.vehiIdno;
	}
	
	var url = "http://" + dwServer.ip +':'+ dwServer.port + "/3/5?DownType=3";
	url += "&DevIDNO="+ devIdno;
	url += "&FLENGTH="+ fileInfo.len;
	url += "&FOFFSET=0";
	url += "&MTYPE=1";
	url += "&FPATH="+ fileInfo.file;
	var paths = fileInfo.file.split('/');
	if (paths.length == 1) {
		paths = fileInfo.file.split('\\');
	}
//	if(!isBrowseFirefox() && !isBrowseSafari()) {
//		var saveName = fileInfo.vehiIdno + "-" + paths[paths.length - 1];
//		url += "&SAVENAME="+ encodeURI(saveName);
//	}else {
		url += "&SAVENAME="+ encodeURI(paths[paths.length - 1]);
//	}
	window.open(url, "_blank");
//	window.location.href = url;
//	location.href = url;
}

//下载视频文件
videoPlayback.prototype.downloadVideoFile = function(id) {
	var fileInfo = this.videoFileList.get(Number(id));
	if(fileInfo != null) {
		//搜索下载视频文件服务器信息，成功后下载视频文件信息
		this.doDownloadVehicleServer(fileInfo);
	}
}

//断点下载视频文件
videoPlayback.prototype.downloadVideoFileSec = function(obj, id) {
	var fileInfo = this.videoFileList.get(Number(id));
	if(fileInfo != null) {
		//chnMask>0时按位进行判断 多个通道 ； 98 全部通道
		if(fileInfo.chnMask > 0 || fileInfo.chn == 98) {
			this.addVideoFileChn(obj, fileInfo, 'downloadVideoFileSecChn');
		}else {
			if(this.taskInfo == null) {
				var videoPlay_ = this;
				this.taskInfo = $.dialog({id:'taskInfo', title: parent.lang.add + parent.lang.videoDownloadTask +' - ' + fileInfo.vehiIdno +' - ' + fileInfo.chnName, content: 'url:VideoManagement/downloadTaskInfo.html?id='+id+'&chn='+fileInfo.chn,
					width: '450px', height: '250px', min:true, max:false, lock:false,fixed:false
						, resize:false, close: function() {
							videoPlay_.taskInfo = null;
							if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
								popTipsObject.remove('taskInfo');
							}
						}});
			}else {
				if(id != this.oldSelSecId) {
					var title = parent.lang.add + parent.lang.videoDownloadTask +' - ' + fileInfo.vehiIdno +' - ' + fileInfo.chnName;
					this.taskInfo.title(title);
//					$(this.taskInfo.iframe).attr('src', 'VideoManagement/downloadTaskInfo.html?id='+id);
					if(this.taskInfo.content && (typeof this.taskInfo.content.initFileInfo == 'function')) {
						this.taskInfo.content.initFileInfo(id, fileInfo.chn);
					}
				}
				this.taskInfo.show();
			}
			this.oldSelSecId = id;
			if(popTipsObject != null) {
				popTipsObject.put('taskInfo', this.taskInfo);
			}
			if(typeof hidePopTips == 'function'){
				hidePopTips('taskInfo');
			}
		}
	}
}

//断点下载视频文件
videoPlayback.prototype.downloadVideoFileSecChn = function(id, chn) {
	var fileInfo = this.videoFileList.get(Number(id));
	if(fileInfo != null) {
		if(this.taskInfo == null) {
			var videoPlay_ = this;
			this.taskInfo = $.dialog({id:'taskInfo', title: parent.lang.add +'  '+ parent.lang.videoDownloadTask +' - ' + fileInfo.vehiIdno +' - ' + this.getChnName(chn), content: 'url:VideoManagement/downloadTaskInfo.html?id='+id+'&chn='+chn,
				width: '450px', height: '250px', min:true, max:false, lock:false,fixed:false
					, resize:false, close: function() {
						videoPlay_.taskInfo = null;
						if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
							popTipsObject.remove('taskInfo');
						}
					}});
		}else {
			if(id != this.oldSelSecId || chn != this.oldSelSecChn) {
				var title = parent.lang.add +'  '+ parent.lang.videoDownloadTask +' - ' + fileInfo.vehiIdno +' - ' + this.getChnName(chn);
				this.taskInfo.title(title);
			//	$(this.taskInfo.iframe).attr('src', 'VideoManagement/downloadTaskInfo.html?id='+id+'&chn='+chn);
				if(this.taskInfo.content && (typeof this.taskInfo.content.initFileInfo == 'function')) {
					this.taskInfo.content.initFileInfo(id, chn);
				}
			}
			this.taskInfo.show();
		}
		this.oldSelSecId = id;
		this.oldSelSecChn = chn;
	}
	$('#vehicleChnTip').hide();
	if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
		popTipsObject.put('taskInfo', this.taskInfo);
	}
	if(typeof hidePopTips == 'function'){
		hidePopTips('taskInfo');
	}
}

//获取视频文件播放的服务器信息
videoPlayback.prototype.doReplayVehicleServer = function(fileInfo, chn, bgTime, title, isTimeline) {
	//获取之前先取消上次的请求
	if(this.ajaxReplayVehicleServerObj != null) {
		this.ajaxReplayVehicleServerObj.abort();
	}
	
	var param = {};
	if(fileInfo.loc == 1) {
		param.did = fileInfo.devIdno;
	}else {
		param.did = fileInfo.vehiIdno;
	}
	param.loc = fileInfo.loc;
	param.ftp = fileInfo.svr; //
	
	//数据库取实时状态
	$.myajax.showLoading(true, parent.lang.findReplayAddress);
	var videoPlay_ = this;
	this.ajaxReplayVehicleServerObj = this.doAjaxSubmit('StandardVideoTrackAction_queryReplayServer.action', param, false, function(server) {
		videoPlay_.doReplayVideoFileInfo(fileInfo, chn, bgTime, title, server, isTimeline);
	});
}

//录像回放视频文件信息
videoPlayback.prototype.doReplayVideoFileInfo = function(fileInfo, chn, begTime, title, rpServer, isTimeline) {
//	http://121.197.0.50:6611/3/5?DownType=5&
//  DevIDNO=8888888&FILELOC=2&FILESVR=6&FILECHN=0&FILEBEG=48614&FILEEND=52200&PLAYIFRM=0&PLAYCHN=2
//	&PLAYFILE=D:/gStorage/RECORD_FILE/8888888/2015-09-18/XXXXXXXX-150918-133014-133014-20010300.grec
//	&PLAYBEG=0&PLAYEND=0
	var url = "http://"+ rpServer.ip+':'+rpServer.port +"/3/5?DownType=5";
//		var url = "http://192.168.1.224:8091/3/5?DownType=5";
	if(fileInfo.loc == 1) {
		url += "&DevIDNO="+ fileInfo.devIdno;
	}else {
		url += "&DevIDNO="+ fileInfo.vehiIdno;
	}
	url += "&FILELOC="+ fileInfo.loc;
	url += "&FILESVR="+ fileInfo.svr;
	url += "&FILECHN="+ fileInfo.chn;
	url += "&FILEBEG="+ fileInfo.beg;
	url += "&FILEEND="+ fileInfo.end;
	url += "&PLAYIFRM=0";
	//表示播放那个通道的录像，文件存在多个通道(先chnMash>0,再chn=98)的录像时使用，如果不存在多个通道，则直接使用0就可以了
	url += "&PLAYCHN="+ chn;
	url += "&PLAYFILE="+ fileInfo.file;
	//播放起始的偏移，单位毫秒，相当于文件的开始时间算，0表示从文件开始位置进行播放
	url += "&PLAYBEG="+ (begTime * 1000);
	//播放结束的偏移，单位毫秒，相当文件开始时间算，不得大于文件的总时长  0表示播放到文件结束
	url += "&PLAYEND=0";//+ (fileInfo.relEnd - fileInfo.beg - begTime);
	
	//开始地图轨迹回放
	if((typeof ttxMap) != 'undefined' && ttxMap != null) {
		this.startPlayTrack(fileInfo, begTime, isTimeline);
	}
	//视频回放
	if((typeof ttxVideo) != 'undefined' && ttxVideo != null) {
		ttxVideo.setTvplayTitle(title);
		ttxVideo.startVideoReplay(title, url);
	}
}

//录像回放（选择通道）
videoPlayback.prototype.videoFileReplayChn = function(id, chn) {
	var fileInfo = this.videoFileList.get(Number(id));
	if(fileInfo != null) {
		//获取视频文件播放的服务器信息,成功后回放视频文件信息
		var title = fileInfo.vehiIdno+' - '+ this.getChnName(chn)+' - '+ fileInfo.timeTitle;
		this.doReplayVehicleServer(fileInfo, chn, 0, title);
	}
	$('#vehicleChnTip').hide();
}

/**
 * 文件列表添加多通道参数
 * @param fileInfo
 * @param functionName
 */
videoPlayback.prototype.addVideoFileChn = function(obj, fileInfo, functionName, event) {
	$('#vehicleChnTip ul').empty();
	var chnContent = "";
	if(fileInfo.chnMask > 0) {
		var maskChns = fileInfo.maskChns.split(',');
		var chnNames = fileInfo.chnName.split(',');
		for (var i = 0; i < maskChns.length; i++) {
			chnContent += '<li onclick="'+functionName+'('+fileInfo.id+','+maskChns[i]+');"><span>'+chnNames[i]+'</span></li>';
		}
	}else {
		var chnNames = fileInfo.chnName.split(',');
		for (var i = 0; i < chnNames.length; i++) {
			chnContent += '<li onclick="'+functionName+'('+fileInfo.id+','+i+');"><span>'+chnNames[i]+'</span></li>';
		}
	}
	$('#vehicleChnTip ul').append(chnContent);
	
	$('#vehicleChnTip').on('mouseleave',function() {
		$(this).hide();
	});
	
	var left = this.videoTimeTable.getLeft(obj);
	var top = this.videoTimeTable.getTop(obj) - $('#vehicleChnTip').height() + $(obj).height();
	
	$('#vehicleChnTip').css('width', '44px'/*$(obj).width()*/);
	$('#vehicleChnTip').css('top', top);
	
	if(event != null) {
		left = event.clientX - 5;
	}
	$('#vehicleChnTip').css('left', left);
	
	$('#vehicleChnTip').show();
}

//录像回放
videoPlayback.prototype.videoFileReplay = function(obj, id) {
	var fileInfo = this.videoFileList.get(Number(id));
	if(fileInfo != null) {
		//chnMask>0时按位进行判断 多个通道 ； 98 全部通道
		if(fileInfo.chnMask > 0 || fileInfo.chn == 98) {
			this.addVideoFileChn(obj, fileInfo, 'videoFileReplayChn');
		}else {
			//获取视频文件播放的服务器信息,成功后回放视频文件信息
			var title = fileInfo.vehiIdno+' - '+ this.getChnName(fileInfo.chn)+' - '+ fileInfo.timeTitle;
			this.doReplayVehicleServer(fileInfo, 0, 0, title);
		}
	}
}

//时间列表通道属性添加点击事件回调函数
videoPlayback.prototype.doClickVideoChnTd = function(id, relChn, chn, begTime) {
	var fileInfo = this.videoFileList.get(Number(id));
	if(fileInfo != null) {
		//录像回放视频文件信息
		if(begTime <= fileInfo.relBeg) {
			begTime = fileInfo.relBeg;
		}
		if(begTime >= fileInfo.relEnd) {
			begTime = fileInfo.relEnd;
		}
		var title = fileInfo.vehiIdno+' - '+ this.getChnName(relChn)+' - '+ fileInfo.yearMonthDay +' '+ this.videoTimeTable.second2ShortHourEx(begTime) +' - '+ this.videoTimeTable.second2ShortHourEx(fileInfo.relEnd);
		//获取视频文件播放的服务器信息,成功后回放视频文件信息
		this.doReplayVehicleServer(fileInfo, chn, begTime - fileInfo.relBeg, title, true);
	}
}

//开始地图轨迹回放
videoPlayback.prototype.startPlayTrack = function(fileInfo, begTime, isTimeline) {
	//清除地图轨迹
	if(this.trackPlayer.mapTrack != null) {
		this.trackPlayer.stopPlay(true);
	}
	var vehicle = parent.vehicleManager.getVehicle(fileInfo.vehiIdno.toString());
	var data = {};
//	data.begindate = this.getFileTime(fileInfo.year + 5, fileInfo.mon, fileInfo.day) +' '+ this.videoTimeTable.second2ShortHourEx(begTime + fileInfo.beg + 3600*9);
//	data.enddate = this.getFileTime(fileInfo.year + 5, fileInfo.mon, fileInfo.day) +' '+ this.videoTimeTable.second2ShortHourEx(fileInfo.relEnd + 3600*12);
	if(isTimeline) {
		data.begindate = fileInfo.yearMonthDay +' '+ this.videoTimeTable.second2ShortHourEx(begTime + fileInfo.relBeg);
		data.enddate = fileInfo.yearMonthDay +' '+ this.videoTimeTable.second2ShortHourEx(fileInfo.relEnd);
	}else {
		data.begindate = fileInfo.beginDate;
		data.enddate = fileInfo.endDate;
	}
	this.trackPlayer.startPlay(vehicle, data, fileInfo, begTime, isTimeline);
}

//定时获取视频播放时间
videoPlayback.prototype.runVideoWindowTimer = function() {
	//如果播放结束，则不开启定时器
	if(this.trackPlayer.playFinished) {
		return;
	}
	var videoPlay_ = this;
	this.getVideoTimer = setTimeout(function () {
		if((typeof ttxVideo) != 'undefined' && ttxVideo != null) {
			var playtime = ttxVideo.getVideoPlayTime();
			//定时器加载车辆到地图与播放时间对应
			videoPlay_.trackPlayer.showTrackInMapByTime(playtime, videoPlay_);
			videoPlay_.runVideoWindowTimer();
		}
	}, 200);
}

//开始视频时进行轨迹回放，暂停视频时停止轨迹回放
videoPlayback.prototype.onReplayMsg = function(type) {
	if(type == 'start') {
		this.runVideoWindowTimer();
	}else if(type == 'stop') {
		if(this.getVideoTimer != null) {
			clearTimeout(this.getVideoTimer);
		}
	}
}