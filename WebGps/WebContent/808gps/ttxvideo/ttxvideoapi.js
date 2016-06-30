/*
 * 视频相应的接口
 */
function TtxVideo(frameVideo){
	this.frameVideo = frameVideo;	//视频是一个frame对象
	this.videoWindows = null;
	this.isInitSuc = false;
	this.checkTimer = null;
	this.loadSucCallback = null;
	this.STREAM_MAIN = 0;  //主码流
	this.STREAM_SUB = 1;  //子码流
}

/*
 * 判断是否加载成功，加载成功，才可以调用相应的接口
 */
TtxVideo.prototype.isLoadSuc = function(){
	return this.isInitSuc;
};

/*
 * 初始化
 */
TtxVideo.prototype.initialize = function(callback){
	this.loadSucCallback = callback;
	this.doReload();
};

/*
 * 使用定时器判断视频是否加载
 */
TtxVideo.prototype.runCheckTimer = function(){
	var video = this;
	this.checkTimer = setTimeout(function () {
		video.checkLoad();
	}, 100);
};

/*
 * 使用定时器判断视频是否加载成功
 */
TtxVideo.prototype.checkLoad = function(){
	if (this.isInitSuc) {
		return ;
	}
	var obj = document.getElementById(this.frameVideo);
	if (obj != null && typeof obj.contentWindow.isLoadVideoSuc == "function") {
		this.isInitSuc = obj.contentWindow.isLoadVideoSuc();
		this.videoWindows = obj.contentWindow;
	}
	if (this.isInitSuc) {
		if (this.loadSucCallback != null) {
			this.loadSucCallback();
		}
	} else {
		this.runCheckTimer();
	}
};

/*
 * 重新加载，则使用定时器判断状态是否正确
 */
TtxVideo.prototype.doReload = function(){
	this.isInitSuc = false;
	this.videoWindows = null;
	this.runCheckTimer();
};

/*
 * 判断视频插件是否成功加载了
 */
TtxVideo.prototype.checkLoadSuc = function() {
	if (!this.isInitSuc) {
	//	alert(lang.video_unload);
		return false;
	} else {
		return true;
	}
};

/**
* 视频设备通道播放(多个通道)
* @param vehiIdno 车牌号
* @param arrChn	通道列表
* @param stream	码流
* @param arrTitle	标题
* @param viewCloseTime	自动关闭时间
* @param armType 报警信息
*/
TtxVideo.prototype.previewVideo = function(devIdno, arrChn, stream, arrTitle, viewCloseTime, armType) {
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return;
	}
	
	this.videoWindows.startVideo(devIdno, arrChn, stream, arrTitle, viewCloseTime, armType);
};

/**
 * 是否禁止系统右键  true 禁止
 */
TtxVideo.prototype.disableSysRight = function(id,disable,func) {
	if (!this.isInitSuc) {
		return false;
	}
	this.videoWindows.disableSysRight(id,disable,func);
};

/**
* 对讲
* @param devIdno 设备编号
*/
TtxVideo.prototype.startTalkback = function(devIdno) {
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return -1;
	}
	
	return this.videoWindows.startTalkback(devIdno);
};

/**
* 停止对讲
*/
TtxVideo.prototype.stopTalkback = function() {
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return;
	}
	
	this.videoWindows.stopTalkback();
};

/**
* 视频监听
* @param devIdno 设备编号
* @param chn	通道号
*/
TtxVideo.prototype.startListen = function(devIdno, chn) {
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return -1;
	}
	
	return this.videoWindows.startListen(devIdno, chn);
};

/**
* 停止监听
*/
TtxVideo.prototype.stopListen = function() {
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return;
	}
	
	this.videoWindows.stopListen();
};

/**
 * 判断通道是否在播放
 */
TtxVideo.prototype.isPlaying = function(devIdno, channel, stream) {
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return false;
	}
	return this.videoWindows.isPlaying(devIdno, channel, stream);
}

/**
 * 停止此通道的预览
 */
TtxVideo.prototype.stopChannelPreview = function(devIdno, channel, stream) {
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return;
	}
	
	this.videoWindows.stopChannelPreview(devIdno, channel, stream);
};

/*
 * 取得焦点窗口
 */
TtxVideo.prototype.getCurFocusWindow = function(){
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return null;
	}
	return this.videoWindows.getCurFocusWindow();
}

//设置视频窗口标题
TtxVideo.prototype.setTvplayTitle = function(title) {
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return null;
	}
	this.videoWindows.setTvplayTitle(title);
}

/**
 * 在报警情况下，当前批次的报警是否已经预览整个窗口
 */
TtxVideo.prototype.isAlarmPackAll = function(alarmPackNumber){
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return true;
	}
	return this.videoWindows.isAlarmPackAll(alarmPackNumber);
};

/**
 * 在报警情况下，当报警结束时，让报警结束类型置空
 */
TtxVideo.prototype.setWindowEndArmType = function(devIdno, endArmType){
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return;
	}
	this.videoWindows.setWindowEndArmType(devIdno, endArmType);
};

/**
 * 返回视频播放时间
 */
TtxVideo.prototype.getVideoWindowTime = function(){
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return null;
	}
	return this.videoWindows.getVideoWindowTime();
}

/**
 * 根据链接地址播放回放视频
 * @param url
 */
TtxVideo.prototype.startVideoReplay = function(title, url) {
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return null;
	}
	this.videoWindows.startVideoReplay(title, url);
}

/**
 * 清除此回放视频窗口的预览
 */
TtxVideo.prototype.clearVideoReplay = function() {
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return null;
	}
	this.videoWindows.clearVideoReplay();
};

/**
 * 获取回放视频的播放时长
 */
TtxVideo.prototype.getVideoPlayTime = function() {
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return null;
	}
	return this.videoWindows.getVideoPlayTime();
};

/**
 * 停止窗口所在通道视频
 */
TtxVideo.prototype.stopIndexWindowPreview = function(index) {
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return null;
	}
	this.videoWindows.stopIndexWindowPreview(index);
};

/**
 * 添加菜单
 * @param 窗口下标
 * @param menuId
 * @param menuName
 * @param part  是否分隔符 1,0
 */
TtxVideo.prototype.addVideoMenu = function(index, menuId, menuName, part) {
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return null;
	}
	this.videoWindows.addVideoMenu(index, menuId, menuName, part);
};

/**
 *  删除菜单
 *  @param 窗口下标
 *  @param menuId
 */
TtxVideo.prototype.delVideoMenu = function(index, menuId) {
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return null;
	}
	this.videoWindows.delVideoMenu(index, menuId);
};

/**
 *  清空窗口菜单
 *  @param 窗口下标
 */
TtxVideo.prototype.clearVideoMenu = function(index) {
	//判断视频插件是否加载成功
	if (!this.checkLoadSuc()) {
		return null;
	}
	this.videoWindows.clearVideoMenu(index);
};