/*
 * 视频相应的接口
 */
function TtxLine(frameLine){
	this.frameLine = frameLine;	//线路是一个frame对象
	this.lineWindows = null;
	this.isInitSuc = false;
	this.checkTimer = null;
	this.loadSucCallback = null;
}

/*
 * 判断是否加载成功，加载成功，才可以调用相应的接口
 */
TtxLine.prototype.isLoadSuc = function(){
	return this.isInitSuc;
};

/*
 * 初始化
 */
TtxLine.prototype.initialize = function(callback){
	this.loadSucCallback = callback;
	this.doReload();
};

/*
 * 使用定时器判断视频是否加载
 */
TtxLine.prototype.runCheckTimer = function(){
	var video = this;
	this.checkTimer = setTimeout(function () {
		video.checkLoad();
	}, 100);
};

/*
 * 使用定时器判断视频是否加载成功
 */
TtxLine.prototype.checkLoad = function(){
	if (this.isInitSuc) {
		return ;
	}
	var obj = document.getElementById(this.frameLine);
	if (obj != null && typeof obj.contentWindow.isLoadLineSuc == "function") {
		this.isInitSuc = obj.contentWindow.isLoadLineSuc();
		this.lineWindows = obj.contentWindow;
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
TtxLine.prototype.doReload = function(){
	this.isInitSuc = false;
	this.lineWindows = null;
	this.runCheckTimer();
};

/**
 * 初始化线路
 */
TtxLine.prototype.initLine = function(lineId) {
	//判断线路插件是否加载成功
	if (!this.isLoadSuc()) {
		return;
	}
	this.lineWindows.initLine(lineId);
};

/**
 * 更新线路
 */
TtxLine.prototype.updateLineStatus = function() {
	//判断线路插件是否加载成功
	if (!this.isLoadSuc()) {
		return;
	}
	this.lineWindows.updateLineStatus();
};

/**
 * 删除线路
 */
TtxLine.prototype.deleteLine = function(lineId) {
	//判断线路插件是否加载成功
	if (!this.isLoadSuc()) {
		return;
	}
	this.lineWindows.deleteLine(lineId);
};