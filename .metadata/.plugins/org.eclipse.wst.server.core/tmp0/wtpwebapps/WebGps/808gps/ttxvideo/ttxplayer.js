/*
 * 视频窗口对象
 */
function TtxWindow(index){
	this.isPreview = false;	//是否正在预览
	this.index = index;		//通道索引
	this.devIdno = "";	//设备编号
	this.channel = 0;	//通道号
	this.stream = 1;	//0主码流，1子码流
	this.viewTime = new Date();	//开始预览时间
	this.viewCloseTime = 0; //默认预览关闭时间
	this.title = '';
	this.isManuallyOpen = true; //是否手动打开
	this.isAlarm = false;  //是否是报警产生
	this.armType = null; //报警开始类型
	this.armTypeName = ''; //报警名称
	this.endArmType = null; //报警结束类型；如果关闭时间是报警结束关闭，报警结束，置空，则根据此参数判断是否关闭
	this.alarmPackNumber = null; // 报警信息批次号
}

/*
 * 取得预览的时间 
 */
TtxWindow.prototype.getViewTime = function(){
	return this.viewTime.getTime();
};

/**
 * 初始化开始预览时间
 */
TtxWindow.prototype.initViewTime = function(){
	this.viewTime = new Date();
};

/**
 * 设置预览关闭时间
 */
TtxWindow.prototype.setViewCloseTime = function(viewCloseTime){
	//初始化开始播放时间
	this.initViewTime();
	if(viewCloseTime != null && viewCloseTime != 0) {
		this.viewCloseTime = viewCloseTime * 1000; //默认关闭时间
	}
};

/*
 * 判断预览是否是指定设备指定通道的视频
 */
TtxWindow.prototype.isChannelPreview = function(devIdno, channel, stream) {
	if (this.isPreview) {
		if (this.devIdno == devIdno && this.channel == channel && this.stream == stream) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};

/*
 * 设置预览的信息
 */
TtxWindow.prototype.setPreview = function(devIdno, channel, stream, port, viewCloseTime, title, armType) {
	this.devIdno = devIdno;	//设备编号
	this.channel = channel;	//通道号
	this.stream = stream;	//码流类型
	this.isPreview = true;
	this.viewTime = new Date();	//预览时间
	this.port = port;
	if(viewCloseTime != null && viewCloseTime != 0) {
		this.viewCloseTime = viewCloseTime * 1000; //默认关闭时间
	}
	this.title = title;
	//报警参数  
	if(armType != null) {
		this.isManuallyOpen = false; //是否手动打开
		this.isAlarm = true;  //是否是报警产生
		this.armType = armType.type; //报警开始类型
		this.armTypeName = armType.name; //报警开始类型名称
		if(viewCloseTime != null && viewCloseTime == 0) {
			this.endArmType = armType.endType; //报警结束类型；如果关闭时间是报警结束关闭，则根据此参数判断是否关闭
		}
		this.alarmPackNumber = armType.alarmPackNumber; // 报警信息批次号
		this.setVideoTbarBgColor('FF0000');
	}
};

/*
 * 设置预览的信息
 */
TtxWindow.prototype.reset = function() {
	this.devIdno = "";	//设备编号
	this.channel = 0;	//通道号
	this.stream = 0;	//码流类型
	this.isPreview = false;
	this.port = 0;
	this.viewCloseTime = 0;
	this.title = '';
	this.isManuallyOpen = true; //是否手动打开
	this.isAlarm = false;  //是否是报警产生
	this.armType = null; //报警开始类型
	this.armTypeName = ''; //报警开始类型
	this.endArmType = null; //报警结束类型；如果关闭时间是报警结束关闭，则根据此参数判断是否关闭
	this.alarmPackNumber = null; // 报警信息批次号
//	this.clearVideoMenu(); //清空窗口菜单
};

/*
 * 是否有效
 */
TtxWindow.prototype.isValid = function() {
	return this.devIdno != "" ? true : false;
};

/**
 * 初始化报警参数
 * @param window
 * @param title
 */
TtxWindow.prototype.initAlarmParam = function() {
	this.isManuallyOpen = true; //是否手动打开
	this.isAlarm = false;  //是否是报警产生
	this.armType = null; //报警开始类型
	this.armTypeName = ''; //报警开始类型名称
	this.endArmType = null; //报警结束类型；如果关闭时间是报警结束关闭，则根据此参数判断是否关闭
	this.alarmPackNumber = null; // 报警信息批次号
	this.viewCloseTime = 0;
//	
}

/**
 * 设置报警参数
 * @param window
 * @param title
 */
TtxWindow.prototype.setAlarmParam = function(viewCloseTime, armType) {
	//报警参数  
	if(armType != null) {
		this.initViewTime();
		if(viewCloseTime != null && viewCloseTime != 0) {
			this.viewCloseTime = viewCloseTime * 1000; //默认关闭时间
		}
		this.isAlarm = true;  //是否是报警产生
		this.armType = armType.type; //报警开始类型
		this.armTypeName = armType.name; //报警开始类型
		if(viewCloseTime != null && viewCloseTime == 0) {
			this.endArmType = armType.endType; //报警结束类型；如果关闭时间是报警结束关闭，则根据此参数判断是否关闭
		}
		this.alarmPackNumber = armType.alarmPackNumber; // 报警信息批次号
		swfobject.getObjectById('cmsv6flash').setVideoInfo(this.index, this.title + " - " + armType.name);
		this.setVideoTbarBgColor('FF0000');
	}else {
		this.initAlarmParam();
		swfobject.getObjectById('cmsv6flash').setVideoInfo(this.index, this.title);
		this.regainVideoTbarBgColor();
	}
}

/**
 * 设置窗口下标颜色
 */
TtxWindow.prototype.setVideoTbarBgColor = function(color) {
	swfobject.getObjectById('cmsv6flash').setVideoTbarBgColor(this.index, color);
};

/**
 * 恢复窗口下标颜色
 */
TtxWindow.prototype.regainVideoTbarBgColor = function() {
	swfobject.getObjectById('cmsv6flash').setVideoTbarBgColor(this.index, '000000');
};

/**
 * 获取视频的播放时长
 */
TtxWindow.prototype.getVideoPlayTime = function() {
	return swfobject.getObjectById('cmsv6flash').getVideoPlayTime(this.index);
};

/**
 * 添加菜单
 * @param menuId
 * @param menuName
 * @param part  是否分隔符 1,0
 */
TtxWindow.prototype.addVideoMenu = function(menuId, menuName, part) {
	swfobject.getObjectById('cmsv6flash').addVideoMenu(this.index, menuId, menuName, part);
};

/**
 *  删除菜单
 */
TtxWindow.prototype.delVideoMenu = function(menuId) {
	swfobject.getObjectById('cmsv6flash').delVideoMenu(this.index, menuId);
};

/**
 *  清空窗口菜单
 */
TtxWindow.prototype.clearVideoMenu = function() {
	swfobject.getObjectById('cmsv6flash').clearVideoMenu(this.index);
};

/*
 * 视频相应的接口
 */
function TtxPlayer(){
	this.lstWindows = [];	//新建list
	this.activeIndex = 0;		//焦点窗口
	this.oneMaxMode = false;	//单画面放大
	this.talkbackWindow = null;		//对讲窗口（虚拟用的，其实是没有窗口的概念）
	this.listenWindow = null;	//监听窗口（虚拟用的，其实是没有窗口的概念）
	this.closeVideoTime = 0; 	//自动关闭视频时间
	this.closeSpeakTime = 0; 	//自动监听对讲时间
	this.closeVideoTimer = null;   //视频预览定时器
	this.closetalkListenTimer = null; //对讲和监听的定时器
}

//设置自动关闭视频时间
TtxPlayer.prototype.setAutoCloseVideoTime = function(closeVideoTime){
	this.closeVideoTime = closeVideoTime == null ? 0 : closeVideoTime;
};

//设置自动关闭对讲和监听时间
TtxPlayer.prototype.setAutoCloseSpeakTime = function(closeSpeakTime){
	this.closeSpeakTime = closeSpeakTime == null ? 0 : closeSpeakTime;
};

/*
 * 初始化
 */
TtxPlayer.prototype.initialize = function(){
	this.initWindows();
};

/*
 * 根据设定时间停止视频
 */
TtxPlayer.prototype.closeVideoWindowTimer = function(){
	if(this.closeVideoTimer != null){
		clearInterval(this.closeVideoTimer);
	}
	var ttxclosewindow = this;
	this.closeVideoTimer = setInterval(function(){
		var isPreview = false;
		var date = new Date();
		var nowTime = date.getTime();
		for (var i = 0; i < windowMaxNum; ++ i) {
			var windows = ttxclosewindow.lstWindows[i];
			//是否预览
			if (windows.isPreview) {
				isPreview = true;
				//已播放时间
				var temp = (nowTime - windows.getViewTime());
				//播放时间如果大于设置的关闭时间，则停止预览
				//播放的时间大于默认的预览时间，停止预览
				//默认的预览时间优先判断,为0则不判断  this.viewCloseTime
				if(windows.viewCloseTime != 0) {
					if(temp >= windows.viewCloseTime) {
						//如果是手动打开的,并且是报警产生，则不关闭窗口，初始化报警参数
						if(windows.isManuallyOpen && windows.isAlarm) {
							windows.setAlarmParam();
						}else {
							ttxclosewindow.stopVideo(windows);
							windows.viewCloseTime = 0;
						}
					}
				}else {
					if (ttxclosewindow.closeVideoTime != 0) {
						if(temp >= ttxclosewindow.closeVideoTime) {
							//如果设置的是报警结束后关闭，则endArmType != null
							if(windows.endArmType == null) {
								if(windows.isManuallyOpen && windows.isAlarm) {
									windows.setAlarmParam();
								}else {
									ttxclosewindow.stopVideo(windows);
								}
							}
						}else {
							//如果设置的是报警结束后关闭，则endArmType != null
							if(windows.endArmType == null) {
								if(windows.isAlarm) {
									if(windows.isManuallyOpen) {
										windows.setAlarmParam();
									}else {
										ttxclosewindow.stopVideo(windows);
									}
								}
							}
						}
					}else {
						//如果设置的是报警结束后关闭，则endArmType != null
						if(windows.endArmType == null) {
							if(windows.isAlarm) {
								if(windows.isManuallyOpen) {
									windows.setAlarmParam();
								}else {
									ttxclosewindow.stopVideo(windows);
								}
							}
						}
					}
				}
			}else {
				//如果没有预览，则将预览界面预览时间初始化
				windows.initViewTime();
			}
		}
		// 是否有窗口在预览，没有则清除定时器
		if(!isPreview) {
			if(this.closeVideoTimer != null){
				clearInterval(this.closeVideoTimer);
				this.closeVideoTimer = null;
			}
		}
	},1000);	
}

/*
 * 自动关闭对讲和监听时间
 */
TtxPlayer.prototype.closeTalkListenWidowTimer = function(){
	if(this.closetalkListenTimer != null){
		clearInterval(this.closetalkListenTimer);
	}
	var ttxPlayer_ = this;
	this.closetalkListenTimer = setInterval(function(){
		var isRuning = false;
		var date = new Date();
		var nowTime = date.getTime();
		//如果正在监听
		if(ttxPlayer_.listenWindow != null && ttxPlayer_.listenWindow.isPreview) {
			var temp = (nowTime - ttxPlayer_.listenWindow.getViewTime());
			if (ttxPlayer_.closeSpeakTime != 0 && temp >= ttxPlayer_.closeSpeakTime) {
				ttxPlayer_.stopListen();
			}else {
				isRuning = true;
			}
		}else if(ttxPlayer_.talkbackWindow != null && ttxPlayer_.talkbackWindow.isPreview) {
			//如果正在对讲
			var temp = (nowTime - ttxPlayer_.talkbackWindow.getViewTime());
			if (ttxPlayer_.closeSpeakTime != 0 && temp >= ttxPlayer_.closeSpeakTime) {
				ttxPlayer_.stopTalkback();
			}else {
				isRuning = true;
			}
		}
		if(!isRuning) {
			//关闭对讲监听计时器
			if(this.closetalkListenTimer != null) {
				clearInterval(this.closetalkListenTimer);
				this.closetalkListenTimer = null;
			}
		}
	},1000);	
}

/*
 * 初始化地
 */
TtxPlayer.prototype.initWindows = function(){
	this.lstWindows = [];
	for (var i = 0; i < windowMaxNum; ++ i) {
		var window = new TtxWindow(i);
		this.lstWindows.push(window);
	}
	this.talkbackWindow = new TtxWindow(1000);
	this.listenWindow = new TtxWindow(1001);
};

/*
 * 取得通道播放的窗口
 */
TtxPlayer.prototype.getChannelWindow = function(devIdno, channel, stream){
	var window = null;
	for (var i = 0; i < windowMaxNum; ++ i) {
		if (this.lstWindows[i].isChannelPreview(devIdno, channel, stream)) {
			window = this.lstWindows[i];
			break;
		}
	}
	return window;
};

/*
 * 判断通道是否在当前的窗口模式下进行播放
 */
TtxPlayer.prototype.getCurrentChnWindow = function(devIdno, channel, stream){
	var window = null;
	for (var i = 0; i < windowCurNum; ++ i) {
		if (this.lstWindows[i].isChannelPreview(devIdno, channel, stream)) {
			window = this.lstWindows[i];
			break;
		}
	}
	return window;
};

/*
 * 取得空闲的窗口
 */
TtxPlayer.prototype.getIdleWindow = function(){
	var findIndex = -1;
	var date = new Date();
	var nowTime = date.getTime();
	var maxTime = 0;
	var oldestIndex = 0;
	for (var i = 0; i < windowCurNum; ++ i) {
		var windows = this.lstWindows[i];
		if (!windows.isPreview) {
			findIndex = i;
			break;
		} else {
			var temp = (nowTime - windows.getViewTime());
			if (temp > maxTime) {
				oldestIndex = i;
				maxTime = temp;
			}
		}
	}
	//如果找不到空闲的，则取代时间最大的那个窗口
	if (findIndex == -1) {
		return this.lstWindows[oldestIndex];
	} else {
		return this.lstWindows[findIndex];
	}
};

/*
 * 取得不是本设备的播放时间最大的那个窗口
 */
TtxPlayer.prototype.getOtherLastWindow = function(devIdno){
	var findIndex = -1;
	var date = new Date();
	var nowTime = date.getTime();
	var maxTime = 0;
	var oldestIndex = -1;
	for (var i = 0; i < windowCurNum; ++ i) {
		var windows = this.lstWindows[i];
		if (!windows.isPreview) {
			findIndex = i;
			break;
		} else {
			if(windows.devIdno != devIdno) {
				var temp = (nowTime - windows.getViewTime());
				if (temp > maxTime) {
					oldestIndex = i;
					maxTime = temp;
				}
			}
		}
	}
	//如果找不到空闲的，则取代时间最大的那个窗口
	if (findIndex == -1) {
		return this.lstWindows[oldestIndex];
	} else {
		return this.lstWindows[findIndex];
	}
};

/*
 * 取得播放时间最长的非本车辆报警的窗口(非本批次报警优先)
 */
TtxPlayer.prototype.getOtherLastAlarmWindow = function(devIdno, armType){
	var findIndex = -1;
	var date = new Date();
	var nowTime = date.getTime();
	var maxTime = 0;
	var oldestIndex = -1;
	var maxTime2 = 0;
	var oldestIndex2 = -1;
	for (var i = 0; i < windowCurNum; ++ i) {
		var windows = this.lstWindows[i];
		if (!windows.isPreview) {
			findIndex = i;
			break;
		} else {
			//非本批次报警
			if(windows.devIdno != devIdno && windows.alarmPackNumber != armType.alarmPackNumber) {
				//再判断报警类型
				if(windows.armType != armType.type) {
					var temp = (nowTime - windows.getViewTime());
					if (temp > maxTime) {
						oldestIndex = i;
						maxTime = temp;
					}
				}
				//不判断报警类型
				var temp2 = (nowTime - windows.getViewTime());
				if (temp2 > maxTime2) {
					oldestIndex2 = i;
					maxTime2 = temp2;
				}
			}
		}
	}
	if(oldestIndex == -1) {
		oldestIndex = oldestIndex2;
	}
	//如果找不到空闲的，则取代时间最大的那个窗口
	if (findIndex == -1) {
		return this.lstWindows[oldestIndex];
	} else {
		return this.lstWindows[findIndex];
	}
};

/**
* 启动所有视频
*/
TtxPlayer.prototype.playAll = function() {
	var jsession = $.cookie("JSESSIONID");
	for (var i = 0; i < windowCurNum; ++ i) {
		var window = this.lstWindows[i];
		if (window.isValid() && !window.isPreview) {
			//重新开启预览
			swfobject.getObjectById('cmsv6flash').startVideo(i, jsession, window.devIdno, window.channel, window.stream, true);
		//	swfobject.getObjectById('cmsv6flash').setVideoInfo(window.index, window.title);
			//预览
			window.isPreview = true;
			//初始化开始播放时间
			window.initViewTime();
		}
	}
	//开启视频关闭计时器
	if(this.closeVideoTimer == null) {
		this.closeVideoWindowTimer();
	}
};

/**
* 停止所有视频
*/
TtxPlayer.prototype.stopAll = function() {
	for (var i = 0; i < windowMaxNum; ++ i) {
		var window = this.lstWindows[i];
		if (window.isPreview) {
			swfobject.getObjectById('cmsv6flash').stopVideo(i);
			window.isPreview = false;
		}
	}
};

/**
* 清除所有视频
*/
TtxPlayer.prototype.clearAll = function() {
	for (var i = 0; i < windowMaxNum; ++ i) {
		var window = this.lstWindows[i];
		if (window.isValid()) {
			this.resetWindow(window);
		}
	}
};

/*
 * 控件回调事件	onTtxPlayerMsg
 * index 视频下标
 * type 消息类型 select:选择视频，full:全屏,norm：退出全屏 start:开始播放 paus:暂停，stop:停止 play：暂停或停止后重新播放
 * sound:开启声音,silent:静音 neterror:网络异常 videoerror：视频错误 
 */
function onTtxVideoMsg(index,type) {
	if (index != null && index != "") {
		index = parseInt(index, 10);
	}
	ttxPlayer.doPlayMsg(index, type);
}

/*
* 处理消息
*/
TtxPlayer.prototype.doPlayMsg = function(index, type) {
	if (type == "select") {
		this.activeIndex = index;
		var window = this.lstWindows[index];
		if (window.isValid()) {
			if (typeof parent.ttxPlayerViewSelect == "function") {
	    		parent.ttxPlayerViewSelect(window.devIdno, window.channel);
	    	}
		}
		if (typeof parent.ttxPlayerReplayMsg == "function") {
			parent.ttxPlayerReplayMsg(type);
		}
	} else if (type == "stop") {
		this.lstWindows[index].isPreview = false;
		this.lstWindows[index].initAlarmParam();
		if (typeof parent.ttxPlayerReplayMsg == "function") {
			parent.ttxPlayerReplayMsg(type);
		}
	} else if (type == "start") {
		this.lstWindows[index].isPreview = true;
		if(!this.lstWindows[index].isAlarm) {
			swfobject.getObjectById('cmsv6flash').setVideoInfo(index, this.lstWindows[index].title);
			this.lstWindows[index].regainVideoTbarBgColor();
		}
		if (typeof parent.ttxPlayerReplayMsg == "function") {
			parent.ttxPlayerReplayMsg(type);
		}
	} else if (type == "full") {
		this.oneMaxMode = true;
	} else if (type == "norm") {
		this.oneMaxMode = false;
	} else if (type == "sound") {
	} else if (type == "silent") {
	} else if (type == "play") {
	} else if (type == "PicSave") {
	} else if (type == "WindowNorm") {
	} else if (type == "startListen" || type == "stopListen" || type == "playListen" || type == "loadListen" || type == "listenNetError"
		|| type == "listenStreamNotFound" || type == "listenStreamStop") {
		if (typeof parent.ttxPlayerListenMsg == "function") {
			parent.ttxPlayerListenMsg(type);
		}
	} else if (type == "startRecive" || type == "uploadRecive" || type == "playRecive" 
		|| type == "loadRecive" || type == "reciveStreamStop" || type == "reciveNetError" || type == "reciveStreamNotFound"
		|| type == "upload" || type == "uploadfull" || type == "uploadNetError" || type == "uploadNetClosed"
		|| type == "stopTalk") {
		if (typeof parent.ttxPlayerTalkbackMsg == "function") {
			parent.ttxPlayerTalkbackMsg(type);
		}
	} else {
		//alert(type);
	}
};

/**
 * 视频右键点击前事件	onTtxVideoBeforePopMenu
 * index 视频下标
 */
function onTtxVideoBeforePopMenu(index) {
	if (index != null && index != "") {
		index = parseInt(index, 10);
	}
	ttxPlayer.doVideoRightBeforeMsg(index);
}

/**
 * 处理视频右键点击前事件（主要是生成菜单）
 * @param index
 */
TtxPlayer.prototype.doVideoRightBeforeMsg = function(index) {
	var window = this.lstWindows[index];
	if (window.isValid()) {
		if (typeof parent.ttxVideoRightBeforeMsg == "function") {
    		parent.ttxVideoRightBeforeMsg(index, window.devIdno, window.channel, window.isPreview);
    	}
	}
}

/**
 * 响应右键菜单事件回调（当用户点击窗口菜单时，调用此接口通知上层） onTtxVideoRightMenu
 * index 视频下标
 * menuid 菜单id
 */
function onTtxVideoRightMenu(index, menuId) {
	if (index != null && index != "") {
		index = parseInt(index, 10);
	}
	ttxPlayer.doRightMenuMsg(index, menuId);
}

/**
 * 处理右键菜单点击事件
 * @param index
 * @param menuid
 */
TtxPlayer.prototype.doRightMenuMsg = function(index, menuId) {
	var window = this.lstWindows[index];
	if (window.isValid()) {
		if (typeof parent.ttxVideoRightMenuClickMsg == "function") {
    		parent.ttxVideoRightMenuClickMsg(index, menuId, window.devIdno, window.channel);
    	}
	}
}

/*
 * 清除此窗口的预览
 */
TtxPlayer.prototype.resetWindow = function(window) {
//	loadConsoleTime(true, 'ttxplayer-stopVideo');//耗时 100ms+
	swfobject.getObjectById('cmsv6flash').stopVideo(window.index);
//	loadConsoleTime(false, 'ttxplayer-stopVideo');
//	loadConsoleTime(true, 'ttxplayer-reSetVideo');//耗时 15ms+ 50+ 90+
	swfobject.getObjectById('cmsv6flash').reSetVideo(window.index);
//	loadConsoleTime(false, 'ttxplayer-reSetVideo');
//	loadConsoleTime(true, 'ttxplayer-setVideoInfo');//耗时 15ms+ 50+
	swfobject.getObjectById('cmsv6flash').setVideoInfo(window.index, "");
//	loadConsoleTime(false, 'ttxplayer-setVideoInfo');
//	loadConsoleTime(true, 'ttxplayer-clearVideoMenu');//耗时 15ms+ 30+
	swfobject.getObjectById('cmsv6flash').clearVideoMenu(window.index);
//	loadConsoleTime(false, 'ttxplayer-clearVideoMenu');
//	loadConsoleTime(true, 'ttxplayer-setVideoTbarBgColor');//耗时 15ms+ 30+
	swfobject.getObjectById('cmsv6flash').setVideoTbarBgColor(window.index, '000000');
//	loadConsoleTime(false, 'ttxplayer-setVideoTbarBgColor');
	window.reset();
};

/*
 * 清除此通道的预览
 */
TtxPlayer.prototype.clearChannelPreview = function(devIdno, channel, stream) {
	var window = this.getChannelWindow(devIdno, channel, stream);
	if (window != null) {
		this.resetWindow(window);
	}
};


TtxPlayer.prototype.analyWindowPort = function(window, mapPort) {
	var tempWin = window;
	if (tempWin.isValid()) {
		var portCount = mapPort.get(tempWin.port);
		if (portCount != null) {
			portCount ++;
		} else {
			portCount = 1;
		}
		mapPort.put(tempWin.port, portCount);
	}
}

TtxPlayer.prototype.getVideoServer = function() {
	var server = loginServer;
	var svrIp = server.ip;
	//总共有多少个Port
	var portList = [];
	portList.push(server.port);
	//计算每个Port占用的数目
	var mapPort = new Hashtable();
	for (var k = 0; k < portList.length; ++ k) {
		mapPort.put(portList[k], 0);
	}
	for (var i = 0; i < windowMaxNum; ++ i) {
		var tempWin = this.lstWindows[i];
		this.analyWindowPort(tempWin, mapPort);
/*		if (tempWin.isValid()) {
			var portCount = mapPort.get(tempWin.port);
			if (portCount != null) {
				portCount ++;
			} else {
				portCount = 1;
			}
			mapPort.put(tempWin.port, portCount);
		}*/
	}
	//计算对讲和监听
	this.analyWindowPort(this.talkbackWindow, mapPort);
	this.analyWindowPort(this.listenWindow, mapPort);	
	
	//取最小数目的那个Port
	var minCount = 999;
	var minPort = 0;
	mapPort.each(function(key,value) {
		if (value < minCount) {
			minPort = key;
			minCount = value;
		}
	});
	
	var ret = {};
	ret.svrIp = svrIp;
	ret.port = minPort;
	return ret;
};

/*
 * 在指定窗口上预览视频
 */
TtxPlayer.prototype.previewVideo = function(window, devIdno, channel, stream, title, viewCloseTime, armType) {
//	loadConsoleTime(true, 'ttxplayer-previewVideo');
	//耗时 100ms+  400+ 500+
//	loadConsoleTime(true, 'ttxplayer-stopVideo');
	swfobject.getObjectById('cmsv6flash').stopVideo(window.index);
//	loadConsoleTime(false, 'ttxplayer-stopVideo');
	//耗时平均30-50ms  36画面 150ms内
//	loadConsoleTime(true, 'ttxplayer-setVideoInfo');
	if(armType != null) {
		swfobject.getObjectById('cmsv6flash').setVideoInfo(window.index, title + " - " + armType.name);
	}else {
		swfobject.getObjectById('cmsv6flash').setVideoInfo(window.index, title);
	}
//	loadConsoleTime(false, 'ttxplayer-setVideoInfo');
	var server = this.getVideoServer();
	//耗时平均30-50ms  36画面 150ms内
//	loadConsoleTime(true, 'ttxplayer-setVideoServer');
	swfobject.getObjectById('cmsv6flash').setVideoServer(window.index, server.svrIp, server.port);
//	loadConsoleTime(false, 'ttxplayer-setVideoServer');
	//启动预览
	window.setPreview(devIdno, channel, stream, server.port, viewCloseTime, title, armType);
	var jsession = $.cookie("JSESSIONID");
	//耗时平均15-50ms  36画面 150ms内
//	loadConsoleTime(true, 'ttxplayer-startVideo');
	swfobject.getObjectById('cmsv6flash').startVideo(window.index, jsession, devIdno, channel, stream, true);
//	loadConsoleTime(false, 'ttxplayer-startVideo');
	//开启视频关闭计时器
	if(this.closeVideoTimer == null) {
		this.closeVideoWindowTimer();
	}
//	loadConsoleTime(false, 'ttxplayer-previewVideo');
};

/*
 * 停止预览视频
 */
TtxPlayer.prototype.stopVideo = function(window) {
	swfobject.getObjectById('cmsv6flash').stopVideo(window.index);
	window.isPreview = false;
};

/*
 * 是否为单画面模式 
 */
TtxPlayer.prototype.isSingleViewMode = function() {
	if (this.oneMaxMode || windowCurNum == 1) {
		return true;
	} else {
		return false;
	}
}

/*
 * 设置焦点窗口
 */
TtxPlayer.prototype.setWindowFocus = function(index) {
//	loadConsoleTime(true, 'ttxplayer-setWindowFocus');//耗时 同previewVideo差不多
	swfobject.getObjectById('cmsv6flash').setVideoFocus(index);
	this.activeIndex = index;
//	loadConsoleTime(true, 'ttxplayer-setWindowFocus');//耗时 同previewVideo差不多
}

/**
* 预览视频
* @param vehiIdno 车牌号
* @param arrChn	通道列表
* @param stream	码流
* @param arrTitle	标题
* @param viewCloseTime	自动关闭时间
* @param armType 报警信息
*/
TtxPlayer.prototype.startVideo = function(devIdno, arrChn, stream, arrTitle, viewCloseTime, armType) {
	//预览单通道
	if (arrChn.length == 1) {
		if (this.isSingleViewMode()) {
			//如果是单画面模式（1画面或者单画面放大）
			var window = this.lstWindows[this.activeIndex];
			//如果当前播放的通道不一样，则直接替换
			if (!window.isChannelPreview(devIdno, arrChn[0], stream)) {
				//播放前，如果之前存在播放窗口，则先停止了
				this.clearChannelPreview(devIdno, arrChn[0], stream);
				//预览视频
				this.previewVideo(window, devIdno, arrChn[0], stream, arrTitle[0], viewCloseTime, armType);
			}else {
				//如果播放的通道一样
				//如果是报警,则初始化报警参数
				window.setViewCloseTime(viewCloseTime);
				window.setAlarmParam(viewCloseTime, armType);
			}
		} else {
			//如果是多画面模式
			//当前通道是否正在进行播放
			var window = this.getCurrentChnWindow(devIdno, arrChn[0], stream);
			if (window != null) {
				//如果没有在播放，则直接进行播放
				//设置自动关闭时间
				window.setViewCloseTime(viewCloseTime);
				if (!window.isPreview) {
					swfobject.getObjectById('cmsv6flash').startVideo(window.index, window.devIdno, window.channel, window.stream, false);
				}
				//如果是报警,则初始化报警参数
				window.setAlarmParam(viewCloseTime, armType);
				this.setWindowFocus(window.index);
			} else {
//				loadConsoleTime(true, 'ttxplayer-lstWindows');//耗时 1ms
				window = this.lstWindows[this.activeIndex];
//				loadConsoleTime(false, 'ttxplayer-lstWindows');
				//如果焦点画面空闲，则直接使用焦点画面进行播放
				if (!window.isPreview) {
					this.previewVideo(window, devIdno, arrChn[0], stream, arrTitle[0], viewCloseTime, armType);
				} else {
					//如果焦点画面正在播放，则选用空闲画面进行播放
					//如果此时没有空闲画面，则取播放时间最长的那个画面替换进行播放
					if(armType != null) {
//						loadConsoleTime(true, 'ttxplayer-getOtherLastAlarmWindow');//耗时 1ms
						//取播放时间最长的非本车辆本批次报警的窗口。
						window = this.getOtherLastAlarmWindow(devIdno, armType);
//						loadConsoleTime(false, 'ttxplayer-getOtherLastAlarmWindow');
					}else {
//						loadConsoleTime(true, 'ttxplayer-getIdleWindow');//耗时 1ms
						window = this.getIdleWindow();
//						loadConsoleTime(false, 'ttxplayer-getIdleWindow');
					}
					if (window != null) {
						//播放前，如果之前存在播放窗口，则先停止了
//						loadConsoleTime(true, 'ttxplayer-clearChannelPreview');//耗时 1ms- 2ms-
						this.clearChannelPreview(devIdno, arrChn[0], stream);
//						loadConsoleTime(false, 'ttxplayer-clearChannelPreview');
						//预览视频
						this.previewVideo(window, devIdno, arrChn[0], stream, arrTitle[0], viewCloseTime, armType);
						//将窗口设置为焦点窗口
						this.setWindowFocus(window.index);
					}
				}
			}
		}
	} else {
	//	if (this.isSingleViewMode()) {
	//		alert(lang.video_view_unenougth);
	//		return ;
	//	}
		
		/*预览单通道 预览多通道(如果已经在后面的窗口进行播放了，怎么办，暂时不考虑这个问题）
		如果空闲画面不够，则直接提示用户不进行播放操作
		如果空闲画面足够，则选择空闲画面进行播放*/
		
		//取闲置的窗口
		var arrIdleWin = [];
		for (var i = 0; i < windowCurNum; ++ i) {
			var windows = this.lstWindows[i];
			if (!windows.isPreview) {
				arrIdleWin.push(i);
			}
		}
		//取设备未播放的通道
		var arrChnFree = [];
		var arrTitleFree = [];
		for (var i = 0; i < arrChn.length; ++ i) {
			//当前通道是否正在进行播放
			var window = this.getChannelWindow(devIdno, arrChn[i], stream);
			//如果正在播放的窗口在隐藏窗口中，那么停掉这个通道的播放
			if(window != null) {
				if(window.index >= windowCurNum) {
					this.clearChannelPreview(devIdno, arrChn[i], stream);
					arrChnFree.push(arrChn[i]);
					arrTitleFree.push(arrTitle[i]);
				}else {
					//如果是报警,则初始化报警参数
					window.setViewCloseTime(viewCloseTime);
					window.setAlarmParam(viewCloseTime, armType);
				}
			}else {
				arrChnFree.push(arrChn[i]);
				arrTitleFree.push(arrTitle[i]);
			}
		}
		//如果有窗口未播放，则进行播放
		if(arrChnFree.length > 0) {
			//如果空闲窗口不足，则取播放时间最长的那个画面替换进行播放
			if (arrIdleWin.length < arrChnFree.length) {
				//等待播放的通道
				//先让空闲窗口进行播放
				for (var i = 0; i < arrIdleWin.length; i++) {
					//预览视频
					this.previewVideo(this.lstWindows[arrIdleWin[i]], devIdno, arrChnFree[0], stream, arrTitleFree[0], viewCloseTime, armType);
					arrChnFree.splice(0, 1);
					arrTitleFree.splice(0, 1);
				}
				//再取播放时间最长的那个画面替换进行播放
				for (var i = 0; i < arrChnFree.length; i++) {
					//如果是该设备在播放，则此通道不进行预览
					var window = null;
					if(armType != null) {
						//取播放时间最长的非本车辆本批次报警的窗口。
						window = this.getOtherLastAlarmWindow(devIdno, armType);
					}else {
						window = this.getOtherLastWindow(devIdno);
					}
					if (window != null) {
						//预览视频
						this.previewVideo(window, devIdno, arrChnFree[i], stream, arrTitleFree[i], viewCloseTime, armType);
					}
				}
			} else {
				for (var j = 0; j < arrChnFree.length; ++ j) {
					//预览视频
					this.previewVideo(this.lstWindows[arrIdleWin[j]], devIdno, arrChnFree[j], stream, arrTitleFree[j], viewCloseTime, armType);
				}
			}
			//将第1个窗口设置为焦点窗口
			this.setWindowFocus(arrChn[0]);
		}
	}
};

/*
 * 启动对讲
 */
TtxPlayer.prototype.startTalkback = function(devIdno) {
	var jsession = $.cookie("JSESSIONID");
	var server = this.getVideoServer();
	swfobject.getObjectById('cmsv6flash').setTalkParam(1);
	//swfobject.getObjectById('cmsv6flash').setTalkMaxParam(0);
	var ret = swfobject.getObjectById('cmsv6flash').startTalkback(jsession, devIdno, 0, server.svrIp, server.port);
	//0成功，1表示正在对讲，2表示没有mic，3表示禁用了mic
	if (ret == 0) {
		this.talkbackWindow.setPreview(devIdno, 0, 0, server.port);
	}
	//开启对讲监听计时器
	if(this.closetalkListenTimer == null) {
		this.closeTalkListenWidowTimer();
	}
	return ret;
}

/*
 * 停止对讲
 */
TtxPlayer.prototype.stopTalkback = function() {
	swfobject.getObjectById('cmsv6flash').stopTalkback();
	this.talkbackWindow.reset();
}

/*
 * 启动监听
 */
TtxPlayer.prototype.startListen = function(devIdno, chn) {
	var jsession = $.cookie("JSESSIONID");
	var server = this.getVideoServer();
	swfobject.getObjectById('cmsv6flash').setListenParam(1);
	swfobject.getObjectById('cmsv6flash').startListen(jsession, devIdno, chn, server.svrIp, server.port);
	this.listenWindow.setPreview(devIdno, chn, 0, server.port);
	//开启对讲监听计时器
	if(this.closetalkListenTimer == null) {
		this.closeTalkListenWidowTimer();
	}
	return 0;
}

/*
 * 停止监听
 */
TtxPlayer.prototype.stopListen = function() {
	swfobject.getObjectById('cmsv6flash').stopListen();
	this.listenWindow.reset();
}

/**
 * 判断通道是否在播放
 */
TtxPlayer.prototype.isPlaying = function(devIdno, channel, stream) {
	return this.getChannelWindow(devIdno, channel, stream) == null ? false : true;
} 

/**
 * 停止此通道的预览
 */
TtxPlayer.prototype.stopChannelPreview = function(devIdno, channel, stream) {
	var window = this.getChannelWindow(devIdno, channel, stream);
	if (window != null) {
		this.stopVideo(window);
	}
};

/*
 * 取得当前焦点的窗口
 */
TtxPlayer.prototype.getCurFocusWindow = function(){
	var window = null;
	for (var i = 0; i < windowMaxNum; ++ i) {
		if (this.lstWindows[i].index == this.activeIndex) {
			window = this.lstWindows[i];
			break;
		}
	}
	return window;
};

/**
 * 在报警情况下，当前批次的报警是否已经预览整个窗口
 */
TtxPlayer.prototype.isAlarmPackAll = function(alarmPackNumber){
	for (var i = 0; i < windowCurNum; ++ i) {
		if (this.lstWindows[i].alarmPackNumber == null || this.lstWindows[i].alarmPackNumber != alarmPackNumber) {
			return false;
		}
	}
	return true;
};

/**
 * 在报警情况下，当报警结束时，让报警结束类型置空
 */
TtxPlayer.prototype.setWindowEndArmType = function(devIdno, endArmType){
	for (var i = 0; i < windowMaxNum; ++ i) {
		var window = this.lstWindows[i];
		if(window.devIdno == devIdno && window.endArmType == endArmType) {
			window.endArmType = null;
		}
	}
};

/**
 * 返回视频播放时间
 */
TtxPlayer.prototype.getVideoWindowTime = function(){
	//返回播放时间
	var window = this.lstWindows[this.activeIndex];
	var date = new Date();
	var time = date.getTime() - window.getViewTime();
	
	return time;
}

/**
 * 根据链接地址回放视频
 * @param url
 */
TtxPlayer.prototype.startVideoReplay = function(title, url) {
	var window = this.lstWindows[this.activeIndex];
	swfobject.getObjectById('cmsv6flash').stopVideo(window.index);
//	swfobject.getObjectById('cmsv6flash').setVideoInfo(window.index, title);
	swfobject.getObjectById('cmsv6flash').startVod(window.index ,url);
	//初始化开始播放时间
	window.initViewTime();
}

/**
 * 清除此回放视频窗口的预览
 */
TtxPlayer.prototype.clearVideoReplay = function() {
	var window = this.lstWindows[this.activeIndex];
	this.resetWindow(window);
};

/**
 * 获取回放视频的播放时长
 */
TtxPlayer.prototype.getVideoPlayTime = function() {
	var window = this.lstWindows[this.activeIndex];
	var playTime = window.getVideoPlayTime();
	return playTime < 0 ? 0 : playTime;
};

/**
 * 停止窗口所在通道视频
 */
TtxPlayer.prototype.stopIndexWindowPreview = function(index) {
	var window = this.lstWindows[index];
	if (window != null) {
		this.stopVideo(window);
	}
};

/**
 * 添加菜单
 * @param 窗口下标
 * @param menuId
 * @param menuName
 * @param part  是否分隔符 1,0
 */
TtxPlayer.prototype.addVideoMenu = function(index, menuId, menuName, part) {
	var window = this.lstWindows[index];
	if (window != null) {
		window.addVideoMenu(menuId, menuName, part);
	}
};

/**
 *  删除菜单
 *  @param 窗口下标
 *  @param menuId
 */
TtxPlayer.prototype.delVideoMenu = function(index, menuId) {
	var window = this.lstWindows[index];
	if (window != null) {
		window.delVideoMenu(menuId);
	}
};

/**
 *  清空窗口菜单
 *  @param 窗口下标
 */
TtxPlayer.prototype.clearVideoMenu = function(index) {
	var window = this.lstWindows[index];
	if (window != null) {
		window.clearVideoMenu();
	}
};