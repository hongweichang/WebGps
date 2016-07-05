/**		
 * 轨迹回放类，轨迹回放流程
 * 1、先从服务器查找部分数据，查找到一部分就开始进行回放
 * 2、单独开个定时器进行轨迹播放
 * 		播放分成两个部分，1个是
 * 		先画轨迹线		轨迹线的位置
 * 		再更新地图结点	播放的位置
 */
function trackPlayback() {
	this.ajaxQueryTrackObj = null; //获取轨迹的对象
	this.playFinished = true;
}

trackPlayback.prototype.initPlay = function() {
	this.trackList = [];	//轨迹列表
	this.queryParam = null;	//从服务器上进行查询的参数
	this.vehiIdno = "";
	this.currentPage = 1;		//从第一页开始查
	this.queryFailed = false;			//是否查询失败
	this.queryFinished = false;			//是否查询结束
	this.playIndex = 0;			//播放位置
	//lineLastGpsIndex 表示画线时，最后一次有效的GPS的位置
	//lineIndex表示画线，对应轨迹的偏移
	//画线流程，见drawTrackLine的说明
	this.lineDrawIndex = -1;	//最后一个轨迹点
	this.lineIndex = 0;			//轨迹的位置
	this.lineFinished = false;	//是否画线结束
	this.playFinished = false;	//播放结束
	this.showQiandian = false;	//显示起点
	this.mapTrack = 1;		//地图上轨迹对象
	this.vehiName = null;
	this.vehiIcon = 0;
	this.trackTimeList = new Hashtable();  //轨迹列表(时间为主键)
	this.fileInfo = null;  //播放的文件信息
	this.begTime = 0; //开始时间
	this.isTimeline = null; //时间线播放
	this.fileStatusIndex = 0;
}

/*
 * 获取回放的参数
 */
trackPlayback.prototype.checkPlayParam = function(vehicle, data) {
	this.vehiIcon = vehicle.getIcon();
	this.vehiName = vehicle.getName();
	//填充参数
	var params = [];
	params.push({
		name: 'vehiIdno',
		value: vehicle.getIdno()
	});
	params.push({
		name: 'begintime',
		value: data.begindate
	});
	params.push({
		name: 'endtime',
		value: data.enddate
	});
	params.push({
		name: 'parkTime',
		value: 0
	});
	params.push({
		name: 'distance',
		value: 0
	});

	params.push({
		name: 'toMap',
		value: parent.toMap
	});

	this.queryParam = params;
	this.vehiIdno = vehicle.getIdno();
};

/*
 * 开始播放
 */
trackPlayback.prototype.startPlay = function(vehicle, data, fileInfo, begTime, isTimeline) {
	this.initPlay();
	this.checkPlayParam(vehicle, data);
	this.fileInfo = fileInfo;  //播放的文件信息
	this.begTime = begTime; //开始时间
	if(isTimeline) {
		this.isTimeline = isTimeline;
	}
	ttxMap.trackInsertTrack(this.mapTrack);
	this.queryTrack();
};

/**
 * 停止回放
 * @param stopAjax 停止请求
 */
trackPlayback.prototype.stopPlay = function(stopAjax) {
	this.playFinished = true;
	//删除地图上的轨迹
	ttxMap.trackDeleteTrack(this.mapTrack);
	//停止正在进行的请求
	if(stopAjax && this.ajaxQueryTrackObj != null) {
		this.ajaxQueryTrackObj.abort();
	}
}

/*
 * 查询轨迹列表
 */
trackPlayback.prototype.queryTrack = function() {
	//需要考虑分页
	var trackPlay_ = this;
	this.ajaxQueryTrackObj = $.myajax.jsonPostEx("StandardTrackAction_query.action?pageRecords=500&currentPage=" + this.currentPage, function(json,action,success) {
		trackPlay_.doAjaxTrack(json,action,success);
	}, null, this.queryParam);
};

/*
 * 查询回复
 */
trackPlayback.prototype.doAjaxTrack = function(json,action,success) {
	this.analyAjaxTrack(json, action, success);
};

/*
 * 查询轨迹列表
 */
trackPlayback.prototype.analyAjaxTrack = function(json,action,success) {
	if (success) {
		if (json.infos != null && json.infos.length > 0) {
			//保证取得是同一页的数据
			if (this.currentPage == json.pagination.currentPage) {
				//车辆状态解析
				for (var i = 0; i < json.infos.length; ++ i) {
					var deviceStatus = new standardStatus(json.infos[i].id);
					deviceStatus.vehiIdno = this.vehiIdno;
					deviceStatus.index = this.fileStatusIndex;
					deviceStatus.setStatus(json.infos[i]);
					this.trackList.push(deviceStatus);
					this.trackTimeList.put(deviceStatus.gpsTime, deviceStatus);
					this.fileStatusIndex++;
				}
			}
			//判断是否取完了，如果没取完，则重新发送请求到服务器上
			if (this.currentPage >= json.pagination.totalPages) {
				this.queryFinished = true;
			} else {
				//重新发送请求，请求下一页的数据
				this.currentPage += 1;
				this.queryTrack();
			}
		} else {
			this.queryFinished = true;
		}
		//找不到轨迹
		//不是报警结束  查询结束  轨迹列表长度大于0
		if (this.queryFinished && this.trackTimeList.size() == 0) {
			if(!this.playFinished) {
				$.dialog.tips(parent.lang.track_info_null, 2);
			}
			this.stopPlay();
		}
	} else {
		this.queryFailed = true;
		this.queryFinished = true;
		//不是报警结束  轨迹列表长度大于0
		if (this.trackTimeList.size() == 0) {
			if(!this.playFinished) {
				$.dialog.tips(parent.lang.track_info_null, 2);
			}
			this.stopPlay();
		}
	}
};

/*
 * 播放轨迹
 */
trackPlayback.prototype.playGpsTrack = function(status){
	//判断是否搜索到轨迹信息
	this.playIndex = status.index;
	//先画线
	if (this.playIndex >= this.lineIndex) {
		this.drawTrackLine();
	}
	
	//更新到地图上
	this.showTrackInMap(status.index, status);
	
//	this.playIndex++;
};

/*
 * 判断索引是否到了末尾
 */
trackPlayback.prototype.checkIndexEnd = function(index){
	var ret = false;
	//如果播放结束，或者查询失败
	if (this.queryFinished || this.queryFailed) {
		//查询失败也是会继续播放的，直接播放到结束的轨迹点
		if ( index >= this.trackTimeList.size()) {
			ret = true;
		}
	}
	return ret;
};

/*
 * 画轨迹线
 */
trackPlayback.prototype.drawTrackLine = function(){
	if (this.lineIndex >= this.trackList.length) {
		return ;
	}
	var drawLine = [];
	//分段画线，从最后的点开始画起
	if (this.lineDrawIndex != -1) {
		drawLine.push({mapJingDu:this.trackList[this.lineDrawIndex].mapJingDu,mapWeiDu:this.trackList[this.lineDrawIndex].mapWeiDu});
	}
	var index = this.lineIndex;
	var lastValid = this.lineDrawIndex;
	//每次都从画线结束点开始画起，
	//可能一组轨迹列表中，搜索出0个、1个、2个以上  有效的轨迹点
	//如果是两个有效的点，则直接画轨迹并记录最后一个轨迹点
	//如果是1个有效的轨迹点，则把线路开始点配置为此点，这样下次画线的时候，就从这点开始画
	//如果没有有效的轨迹点，
	while (true) {
		if (index < this.trackList.length) {
			var offset = index;
			++ index;
			if (this.trackList[offset].isGpsValid()) {
				drawLine.push({mapJingDu:this.trackList[offset].mapJingDu,mapWeiDu:this.trackList[offset].mapWeiDu});
				//记录第一个有效的轨迹点
				lastValid = offset;
				//在地图上画轨迹，每次最多画200个点
				if (drawLine.length >= 200) {
					break;
				}
			}
			
		} else {
			break;
		}
	}
	this.lineIndex = index;
	//如果有两个以上的轨迹点，则执行画线操作
	if (drawLine.length >= 2) {
		//当画的点设置为最后一个有效的位置点
		this.lineDrawIndex = lastValid;
		//进行画线操作
		for (var i = 0; i < drawLine.length; ++ i) {
			ttxMap.trackPushPoint(this.mapTrack, drawLine[i].mapJingDu, drawLine[i].mapWeiDu);
		}
		ttxMap.trackDrawPoint(this.mapTrack);
	} else if (drawLine.length == 1) {
		this.lineDrawIndex = lastValid;
		//只有1个点，不需要进行画线
	} else {
		//没有轨迹点，不需要进行画线
	}
	this.checkLineFinish();
}

/*
 * 判断画线是否结束
 */
trackPlayback.prototype.checkLineFinish = function(){
	this.lineFinished = this.checkIndexEnd(this.lineIndex);
};

/*
 * 获取起点或者终点坐标
 */
trackPlayback.prototype.parseImage = function(index) {
	var ret = {};
	ret.label = "";
	ret.show = false;
	var image = -1;
	//判断是否为起点
	if (!this.showQiandian) {
		this.showQiandian = true;
		image = 5;
		ret.lable = parent.lang.track_qiDian;
		ret.show = true;
	} else {
		//可能会出现不画终点的情况，因为是边请求GPS数据点，边下载GPS轨迹点，如果最后返回一段的数据GPS都无效，则可以出现判断不出终点的情况
		var zhongdian = false;
		if (this.lineFinished) {
			//通过画线来判断，因为是先画线，再更新点的
			if (this.lineDrawIndex == index) {
				zhongdian = true;
			}
		} else {
			//用index + 1是因为判断播放结束是使用下一个点与当前点进行比较
			if ( this.checkIndexEnd( (index + 1) ) ) {
				zhongdian = true;
			}
		}
		if (zhongdian) {
			image = 6;
			ret.lable = parent.lang.track_zhongDian;
			ret.show = true;
		}
	}
	ret.image = image;
	return ret;
};

/*
 * 将轨迹点更新到地图上
 */
trackPlayback.prototype.showTrackInMap = function(index, status){
	//如果点存在了，就不添加
	var track = ttxMap.findTracker(this.mapTrack);
	if(track != null && ttxMap.trackFindVehicle(track, index) != null) {
		return true;
	}
	//终端都更新结点到地图上，只是这个结点GPS信息可以是无效的
	ttxMap.trackInsertVehicle(this.mapTrack, index, this.vehiIcon);
	if (status.isGpsValid()) {
		//解析是否为起点或者终点的图标
		var ret = this.parseImage(index);
		//判断为起点还是终点
		var data = status.parseStatusInfo();
		if (ret.image != -1) {
			data.image = ret.image;
		}
		
		//正常回放轨迹点都展现
		ttxMap.trackUpdateVehicle(this.mapTrack, index, this.vehiName, status.mapJingDu, status.mapWeiDu
			, status.getDirection(), data.image, ret.label, data.statusString, ret.show);
		
		//第一次时直接切换到起点
		if (ret.image == 5) {
			ttxMap.trackCenterVehicle(this.mapTrack, index);
		}
		//终点
		if(ret.image == 6) {
			this.playFinished = true;
		}
		return true;
	} else {
		return false;
	}
};

//将轨迹点更新到地图上
trackPlayback.prototype.showTrackInMapByTime= function(playtime, videoPlayer){
	var gpsTime = '';
	//时间线播放
	if(this.isTimeline) {
		gpsTime = this.fileInfo.yearMonthDay +' '+ videoPlayer.videoTimeTable.second2ShortHourEx(this.begTime + this.fileInfo.relBeg + playtime);
	}else {
		var seconds = dateStrLongTime2Date(this.fileInfo.beginDate).getTime() + playtime * 1000;
		gpsTime = dateTime2TimeString(seconds);
	}
	var status = this.trackTimeList.get(gpsTime);
	if(status != null) {
		this.playGpsTrack(status);
	}
}