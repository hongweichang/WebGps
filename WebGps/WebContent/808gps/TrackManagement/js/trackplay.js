
/**
 * 
 * 	1、点击搜索按钮后，将面板隐藏后
		按钮显示为    搜索中...			ok
		搜索到第一页数据后，则按按钮变为  停止回放，显示播放工具栏		ok
		如果查找不到轨迹，则弹框提醒查找不到轨迹		ok
		如果查找到，进行回放			ok
		如果下一次查找失败了，则提示用户查找失败了	no
		
	2、播放工具栏
		播放，暂停	设置暂停的标志位
		拖动位置，调整播放的偏移（暂缓）
		调整速度，调整定时器间隔
		停止播放，会将地图上的轨迹点都清空，并将播放位置放到最前面，并停止播放
			停止播放后，必须要重新开始搜索后，才能进行播放
			如果搜索面板隐藏了，则将面板显示出来
		播放结束后，还可以拖动进度条进行播放
	3、快速回放和正常回放
		快速回放只是画一条起点和1个终点，外加1条线路
			
 * 轨迹回放类，轨迹回放流程
 * 1、先从服务器查找部分数据，查找到一部分就开始进行回放
 * 2、单独开个定时器进行轨迹播放
 * 		播放分成两个部分，1个是
 * 		先画轨迹线		轨迹线的位置
 * 		再更新地图结点	播放的位置
 */
function trackPlayback() {
	//this.initPlay();
	this.ajaxQueryTrackObj = null; //获取轨迹的对象
	this.isPlaying = false;
	this.addStartPointExpId = 920000000; //选择起点的点
	this.addEndPointExpId = 930000000; //选择终点的点
}

trackPlayback.prototype.initPlay = function() {
	this.isPlaying = false;
	this.isPause = false;	//是否处于暂停状态
	this.trackList = [];	//轨迹列表(所有轨迹，包括停车列表)
	this.trackPointList = [];   //轨迹列表
	this.parkPointList = [];	//停车列表
	this.queryParam = null;	//从服务器上进行查询的参数
	this.vehiIdno = "";
	this.currentPage = 1;		//从第一页开始查
	this.queryFailed = false;			//是否查询失败
	this.queryFinished = false;			//是否查询结束
	this.playInterval = 650;		//播放间隔
	this.playTimer = null;		//刷新车辆状态的定时器
	this.drawLineTimer = null;		//地图画线的定时器
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
	this.fastMode = false;	//快速回放模式
	//重置播放按钮的状态
	if ($("#btnPlay").hasClass("play")) {
		$("#btnPlay").removeClass("play").addClass("pause");
	}
	//重置播放进度栏的状态
	this.initProgress(0, 1);
	this.setProgress(0);
	//地图不能切换
	if(ttxMap != null) {
		ttxMap.setSwitchMap(false);
	}
	
	this.selectLinePoint = null; //选择画线起点或者终点
	this.startLinePoint = null;  //画线的起点
	this.endLinePoint = null; //画线的终点
	this.clickLinePoint = null; //点击列表的点
}

trackPlayback.prototype.initProgress = function(min, max) {
	$( "#playProgress" ).slider( "option", "min", min );
 	$( "#playProgress" ).slider( "option", "max", max );
};

trackPlayback.prototype.setProgress = function(value) {
	$( "#playProgress" ).slider( 'option', "value", value );
};

function gpsGetDistanceValue(val) {
	//1 metre(m)米 = 3.28 foot(ft)英尺 
	return val;
}

/*
 * 获取回放的参数
 */
trackPlayback.prototype.checkPlayParam = function() {
	var vehiIdno = $('#hidden-vehiIdnos').val();
	if(vehiIdno == null || vehiIdno == '') {
		alert(lang.report_selectVehiNullErr);
		return false;
	}
	
	var vehicle = rootParent.vehicleManager.getVehicle(vehiIdno);
	if (vehicle == null) {
		alert(lang.report_selectVehiNullErr);
		return false;
	}
	
	this.vehiIcon = vehicle.getIcon();
	this.vehiName = vehicle.getName();
	//判断停车时长
	if (!searchOpt.checkParkTimeEx("#parktime")) {
		return false;
	}
	
	var data = searchOpt.getQueryDataNew(true);
	if (data == null) {
		return false;
	}
	
	var playMode = $("input[name='playMode']:checked").val();
	if (playMode != "1") {
		this.fastMode = true;
	} else {
		this.fastMode = false;
	}
	
	//填充参数
	var params = [];
	params.push({
		name: 'vehiIdno',
		value: vehiIdno
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
		value: $("#parktime").val()
	});
	params.push({
		name: 'distance',
		value: gpsGetDistanceValue($("#hidden-distance").val())
	});

	params.push({
		name: 'toMap',
		value: rootParent.toMap
	});

	this.queryParam = params;
	this.vehiIdno = vehiIdno;
	return true;
};

/*
 * 开始播放
 */
trackPlayback.prototype.startPlay = function() {
	if (this.isPlaying) {
		this.stopPlay(true);
	} else {
		this.initPlay();
		if (!this.checkPlayParam()) {
			return ;
		}
		
		//禁用控制面板内的控件
		disableForm(true);
		if(ttxMap != null) {
			ttxMap.trackInsertTrack(this.mapTrack);
		}
		this.queryTrack();
		this.runPlayTimer();
		//更新按钮状态
		$("#lbSearchTrack").text(lang.track_searching);
		this.isPlaying = true;		
	}
};

/*
 * 停止回放
 */
trackPlayback.prototype.stopPlay = function(stopAjax) {
	this.isPlaying = false;
	//禁用控制面板内的控件
	disableForm(false);
	$("#lbSearchTrack").text(lang.track_startSearch);
	$("#moveDIV").hide();
	$('#totalLiCheng').val('');
	//地图可切换
	if(ttxMap != null) {
		ttxMap.setSwitchMap(true);
	}
	//停止播放定时器
	this.stopPlayTimer();
	//停止地图画线定时器
	this.stopDrawLineTimer();
	//删除地图上的轨迹
	if(ttxMap != null) {
		ttxMap.trackDeleteTrack(this.mapTrack);
	}
	//删除事件列表
	$('#trackPointTable').flexClear();
	$('#parkPointTable').flexClear();
	//显示面板
	showPlayPanel();
	//停止正在进行的请求
	if(stopAjax && this.ajaxQueryTrackObj != null) {
		this.ajaxQueryTrackObj.abort();
	}
	//隐藏选择起点终点
	this.showLinePoint(false);
	//删除起点和终点标记
	this.delTrackLinePointMarker();
	if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
		//删除区域信息框
		var areaInfo_ = popTipsObject.get('areaInfo');
		if(areaInfo_) {
			areaInfo_.close();
		}
		popTipsObject.remove('areaInfo');
		//隐藏车辆选择
		var vehiInfo_ = popTipsObject.get('vehiInfo');
		if(vehiInfo_) {
			vehiInfo_.hide();
		}
	}
	$.myajax.showLoading(false);
}

/*
 * 查询轨迹列表
 */
trackPlayback.prototype.queryTrack = function() {
	//需要考虑分页
	this.ajaxQueryTrackObj = $.myajax.jsonPostEx("StandardTrackAction_query.action?pageRecords=500&currentPage=" + this.currentPage, this.doAjaxTrack, null, this.queryParam);
};

/*
 * 查询回复
 */
trackPlayback.prototype.doAjaxTrack = function(json,action,success) {
	trackPlayer.analyAjaxTrack(json, action, success);
};

/*
 * 查询轨迹列表
 */
trackPlayback.prototype.analyAjaxTrack = function(json,action,success) {
	if (!this.isPlaying) {
		return ;
	}
	
	if (success) {
		if (json.infos != null && json.infos.length > 0) {
			if (this.currentPage == 1) {
				//搜索到第一页数据后，则按按钮变为  停止回放，显示播放工具栏
				$("#lbSearchTrack").text(lang.track_stop);
				$("#moveDIV").fadeIn(200);
				hidePlayPanel();
			}
			//保证取得是同一页的数据
			if (this.currentPage == json.pagination.currentPage) {
				var listSize = this.trackList.length;
				//车辆状态解析
				for (var i = 0; i < json.infos.length; ++ i) {
					var deviceStatus = new standardStatus(json.infos[i].id);
					deviceStatus.vehiIdno = this.vehiIdno;
					deviceStatus.setStatus(json.infos[i]);
					var data = deviceStatus.parseStatusInfo();
					data.id = (listSize + i)+'';
					//取车辆的行驶里程
					if(listSize > 0 || i > 0) {
						//里程增加数 + 前一个记录的里程数
						//如果里程清零了（即里程增加数为负数），则从取当前的里程+前一个记录的里程数开始重新计算
						var liChengInc = data.nliCheng - this.trackList[listSize + i - 1].nliCheng;
						if(liChengInc >= 0) {
							data.lichengRun = this.trackList[listSize + i - 1].lichengRun + liChengInc;
						}else {
							data.lichengRun = this.trackList[listSize + i - 1].lichengRun + 0;
						}
//						data.lichengRun = (data.nliCheng - this.trackList[0].nliCheng).toFixed(2) + ' ' + parent.lang.km;
					}else {
						data.lichengRun = 0;
					}
					if(data.image == 4) {//停车
						this.parkPointList.push(listSize + i);
					}else {
						this.trackPointList.push(listSize + i);
					}
					this.trackList.push(data);
					
					if(this.drawLineTimer == null) {
						this.runDrawLineTimer();
					}
				}
			}
			//将轨迹点更新到列表上
			this.addTrackTableList();
			this.addParkTableList();
			
			//更新进度范围
			this.initProgress(0, json.pagination.totalRecords);
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
		if (this.queryFinished && this.trackList.length == 0) {
			alert(lang.track_null);
			this.stopPlay();
		}
	} else {
		$("#lbSearchTrack").text(lang.track_stop);
		this.queryFailed = true;
		this.queryFinished = true;
		if (this.trackList.length == 0) {
			alert(lang.track_null);
			this.stopPlay();
		}
	}
};

/*
 * 播放定时器
 */
trackPlayback.prototype.runPlayTimer = function(){
	this.playTimer = setTimeout(function () {
		trackPlayer.playGpsTrack();
	}, this.playInterval);
};

/*
 * 停止播放定时器
 */
trackPlayback.prototype.stopPlayTimer = function(){
	if (this.playTimer != null) {
		clearTimeout(this.playTimer);
		this.playTimer = null;
	}
};

/*
 * 重启播放定时器
 */
trackPlayback.prototype.resetPlayTimer = function() {
	if (this.isPlaying) {
		this.stopPlayTimer();
		this.runPlayTimer();
	}
};

//等待画线
trackPlayback.prototype.loadDrawTrackLine = function(){
	if (this.playIndex > this.lineIndex) {
		setTimeout(function () {
			trackPlayer.loadDrawTrackLine();
		}, trackPlayer.playInterval);
	}else {
		//恢复播放
		trackPlayer.isPause = false;
		//css
		if ($('#btnPlay').hasClass("play")) {
			$('#btnPlay').removeClass("play").addClass("pause");
		}
		$.myajax.showLoading(false);
		this.resetPlayTimer();
	}
}

/*
 * 播放轨迹
 */
trackPlayback.prototype.playGpsTrack = function(){
	if (!this.isPlaying) {
		return ;
	}
	
	//暂停播放
	if (this.isPause) {
		this.runPlayTimer();
		return ;
	}
	
	//判断是否搜索到轨迹信息
	if (this.playIndex < this.trackList.length) {
		var maxCircle = 10;
		if (this.fastMode) {
			maxCircle = this.trackList.length - this.playIndex;
		}
		var count = 0;
		//快速回放，每次遍历的数目不一样，并且碰到有效的点不退出
		//普通回放，每次播放一个有效的GPS点
		while (this.playIndex < this.trackList.length && count < maxCircle) {
			//先画线
			if (this.playIndex >= this.lineIndex) {
				trackPlayer.isPause = true;
				//css
				if ($('#btnPlay').hasClass("pause")) {
					$('#btnPlay').removeClass("pause").addClass("play");
				}
				$.myajax.showLoading(true, parent.lang.loading);
				//等待画线
				this.loadDrawTrackLine();
				return;
			}
			//先画轨迹点
			var index = this.playIndex;
			this.playIndex ++;
			//重新跳转了，则赋值为空
			this.clickLinePoint = null;
			//如果轨迹点的位置信息无效，则一次连续播放10个，或者直接到有效的轨迹点为止
			var deviceStatus = this.trackList[index];
			if (!this.fastMode) {
				//更新到地图上，当GPS有效时showTrackInMap返回成功
				if (this.showTrackInMap(index, deviceStatus)) {
					break;					
				}
			} else {
				//更新地图，只显示起点和终点
				this.showTrackInMap(index, deviceStatus);
			}
			
			++ count;
		}
		this.setProgress(this.playIndex);
	}
	
	this.checkPlayFinish();
};

/*
 * 判断索引是否到了末尾
 */
trackPlayback.prototype.checkIndexEnd = function(index){
	var ret = false;
	//如果播放结束，或者查询失败
	if (this.queryFinished || this.queryFailed) {
		//查询失败也是会继续播放的，直接播放到结束的轨迹点
		if ( index >= this.trackList.length) {
			ret = true;
		}
	}
	return ret;
};

/*
 * 判断是否播放结束
 */
trackPlayback.prototype.checkPlayFinish = function(){
	//如果播放结束，或者查询失败
	this.playFinished = this.checkIndexEnd(this.playIndex);
	if (!this.playFinished) {
		//结束播放
		this.runPlayTimer();
	}else {
		$("#btnPlay").removeClass("pause").addClass("play");
		this.isPlaying = false;
	}
};

/*
 * 地图画线定时器
 */
trackPlayback.prototype.runDrawLineTimer = function(){
	this.drawLineTimer = setTimeout(function () {
		trackPlayer.drawTrackLine();
	}, this.playInterval);
};

/*
 * 停止地图画线定时器
 */
trackPlayback.prototype.stopDrawLineTimer = function(){
	if (this.drawLineTimer != null) {
		clearTimeout(this.drawLineTimer);
		this.drawLineTimer = null;
	}
};

/*
 * 画轨迹线
 */
trackPlayback.prototype.drawTrackLine = function(){
	if(ttxMap == null) {
		return;
	}
	if (this.lineIndex >= this.trackList.length) {
		this.checkLineFinish();
		if(!this.lineFinished) {
			this.runDrawLineTimer();
		}
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
			if (this.trackList[offset].isGpsValid) {
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
	if(!this.lineFinished) {
		this.runDrawLineTimer();
	}
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
		ret.lable = lang.track_qiDian;
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
			ret.lable = lang.track_zhongDian;
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
	if(ttxMap == null) {
		return true;
	}
	//终端都更新结点到地图上，只是这个结点GPS信息可以是无效的
	var track = ttxMap.findTracker(this.mapTrack);
	if (track != null){
		//判断是否可以找到轨迹点信息
		var trackVehicle = ttxMap.trackFindVehicle(track, index);
		//如果地图上不存在车辆点，则添加
		if (trackVehicle == null) {
			ttxMap.trackInsertVehicle(this.mapTrack, index, this.vehiIcon);
			ttxMap.setVehiMenu(this.mapTrack+'-'+index, 'drawLine', parent.lang.addLine, 1, 'drawLine');
		}
	}
	if (status.isGpsValid) {
		//解析是否为起点或者终点的图标
		var ret = this.parseImage(index);
		if (this.fastMode) {
			if (ret.show) {
				//添加到搜索栏的行驶里程
				$('#totalLiCheng').val(status.lichengRun.toFixed(3) + ' ' + parent.lang.km);
				//快速回放模式只显示起点和终点
				ttxMap.trackUpdateVehicle(this.mapTrack, index, this.vehiName, status.mapJingDu, status.mapWeiDu
					, status.direction, ret.image, ret.label, status.statusString, ret.show);
			}
		} else {
			//添加到搜索栏的行驶里程
			$('#totalLiCheng').val(status.lichengRun.toFixed(3) + ' ' + parent.lang.km);
			//判断为起点还是终点
			if (ret.image != -1) {
				status.image = ret.image;
			}
			
			//判断是否选择了显示轨迹点
			var point = $("input[name='showTrackPoints']:checked").val();
			if(point == 1) {
				ret.show = true;
			}
			//正常回放轨迹点都展现
			ttxMap.trackUpdateVehicle(this.mapTrack, index, this.vehiName, status.mapJingDu, status.mapWeiDu
				, status.direction, status.image, ret.label, status.statusString, ret.show);
		}
		
		//第一次时直接切换到起点
		if (ret.image == 5) {
			ttxMap.trackSelectVehicle(this.mapTrack, index);
		}
		return true;
	} else {
		return false;
	}
};

/**
 * 调用自定义加载数据加载轨迹信息
 */
trackPlayback.prototype.addTrackTableList = function() {
	if(this.trackPointList) {
		var param = $('#trackPointTable').flexGetParams();
		var start = (param.newp - 1) * param.rp;
		if(start >= this.trackPointList.length) {
			param.newp = 1;
			start = 0;
		}
		var end = param.newp * param.rp;
		var infos = [];
		for (var i = start; i < this.trackPointList.length && i < end; i++) {
			infos.push(this.trackList[Number(this.trackPointList[i])]);
		}
		var pagination={currentPage: param.newp, pageRecords: param.rp, totalRecords: this.trackPointList.length};
		var json = {};
		json.infos = infos;
		json.pagination = pagination;
		
		$('#trackPointTable').flexAddData(json, false);
	}
}

/**
 * 调用自定义加载数据加载停车点信息
 */
trackPlayback.prototype.addParkTableList = function() {
	if(this.parkPointList) {
		var param = $('#parkPointTable').flexGetParams();
		var start = (param.newp - 1) * param.rp;
		if(start >= this.parkPointList.length) {
			param.newp = 1;
			start = 0;
		}
		var end = param.newp * param.rp;
		var infos = [];
		for (var i = start; i < this.parkPointList.length && i < end; i++) {
			infos.push(this.trackList[Number(this.parkPointList[i])]);
		}
		var pagination={currentPage: param.newp, pageRecords: param.rp, totalRecords: this.parkPointList.length};
		var json = {};
		json.infos = infos;
		json.pagination = pagination;
		
		$('#parkPointTable').flexAddData(json, false);
	}
}

//选中事件列表
trackPlayback.prototype.selectTrackRowProp = function(obj) {
	if(ttxMap != null) {
		var index = $(obj).attr('data-id');
//		var track = ttxMap.findTracker(trackPlayer.mapTrack);
//		if (track != null){
//			//判断是否可以找到轨迹点信息
//			var trackVehicle = ttxMap.trackFindVehicle(track, index);
//			if (trackVehicle == null) {
				var deviceStatus = trackPlayer.trackList[Number(index)];
				if(deviceStatus != null) {
					trackPlayer.showTrackInMap(Number(index), deviceStatus);
				}
//			}
//		}
		ttxMap.trackSelectVehicle(trackPlayer.mapTrack, index);
		trackPlayer.clickLinePoint = Number(index);
	}
}

/*
 * 填充轨迹点列表
 */
trackPlayback.prototype.fillTrackTable = function(p, row, idx, index) {
	var name = p.colModel[idx].name;
	var ret = "";
	if(name == 'trackindex') { 
		ret = Number(row.id) + 1;
	} else if(name == 'gpsTime') { 
		ret = row.gpsTime;
	} else if(name == 'speed') {
		if(row.isGpsValid) {
			ret = row.speed;
		}else {
			ret = parent.lang.monitor_invalid;
		}
	} else if(name == 'licheng') { 
		ret = row.liCheng;
	} else if(name == 'lichengRun') {
		ret = row.lichengRun.toFixed(3) + ' ' + parent.lang.km;
	} else if(name == 'position') { 
		if(row.isGpsValid) {
			ret = '<span class="maplngLat" onclick="changeMapAddress(this,'+row.mapJingDu+','+row.mapWeiDu+');" title="'+ row.position +'">'+ row.position +'</span>';
		//	ret = row.position;
		}else {
			ret = parent.lang.monitor_gpsUnvalid;
		}
	} else if(name == 'status') { 
		ret = row.normal;
	} else if(name == 'alarm') { 
		ret = row.alarm;
		//ret = row.id;
	}else if(name == 'beginTime') {
		ret = row.gpsTime;
	}else if(name == 'endTime') {
		ret = row.endTime;
	}else if(name == 'parkTime') {
		ret = row.parkTime;
	}else if(name == 'operator') {
		if(row.isGpsValid) {
			ret = '<a class="drawLine" href="javascript:drawPreLine('+row.id+');" title="'+ lang.addLine +'"></a>';
		}
	}
	return ret;
};

//显示或者隐藏选择起点终点框
trackPlayback.prototype.showLinePoint = function(lineManage, startPoint, endPoint) {
	if(lineManage) {
		var width = $(window).width();
		var height = $(window).height();
		$('#lineManage').show().css('left', width/2 - 50).css('top', height/5);
		if(startPoint) {
			$('#lineManage .startPoint').show();
			$('#lineManage .startPoint input').get(0).checked = startPoint;
		}
		if(endPoint) {
			$('#lineManage .endPoint').show();
			if(!startPoint || (this.startLinePoint != null && !this.endLinePoint)) {
				$('#lineManage .endPoint input').get(0).checked = endPoint;
			}
		}
	}else {
		$('#lineManage').hide();
		$('#lineManage .startPoint').hide();
		$('#lineManage .endPoint').hide();
	}
}

/**
 * 地图上车辆Tip进行操作
 * @param vehiIdno  车牌号
 * @param menuId  菜单Id
 * @param popId  子菜单Id
 */
trackPlayback.prototype.ttxMapClickmenuitem = function(vehiIdno, menuId, popId) {
	if(vehiIdno != null) {
		if(menuId == 'drawLine') { //画线路操作
			if(vehiIdno.toString().indexOf('--1') >= 0 || vehiIdno.toString().indexOf('--2') >= 0) {
				if(this.clickLinePoint != null) {
					vehiIdno = this.mapTrack + '-'+ this.clickLinePoint;
				}else {
					vehiIdno = this.mapTrack + '-'+ parseInt(this.playIndex-1, 10);
				}
			}
			this.drawPreLine(vehiIdno);
		}
	}
}

/**
 * 地图上画线，选择起点和终点
 * @param vehiIdno 轨迹id-序号 或者序号
 */
trackPlayback.prototype.drawPreLine = function(vehiIdno) {
	var trackId_vehiIdno = vehiIdno.toString().split('-');
	if(trackId_vehiIdno.length > 1) {
		this.selectLinePoint = parseInt(trackId_vehiIdno[1], 10);
	}else {
		this.selectLinePoint = parseInt(trackId_vehiIdno[0], 10);
	}
	if(this.selectLinePoint == 0) {//如果选择的点为第一个点
		//隐藏终点选项
		this.showLinePoint(true, true, false);
	}else if(this.selectLinePoint == this.trackList.length - 1) {//如果选择最后一个点
		//隐藏起点选项
		this.showLinePoint(true, false, true);
	}else {
		if(this.startLinePoint != null) {//如果已选择起点
			if(this.endLinePoint != null) {//如果已选择终点
				if(this.selectLinePoint < this.startLinePoint) {//如果选择的点在起点之前
					//隐藏终点选项
					this.showLinePoint(true, true, false);
				}else if(this.selectLinePoint > this.endLinePoint){//如果选择的点在终点之后
					//隐藏起点选项
					this.showLinePoint(true, false, true);
				}else {
					this.showLinePoint(true, true, true);
				}
			}else {//如果没有选择终点
				if(this.selectLinePoint < this.startLinePoint) {//如果选择的点在起点之前
					//隐藏终点选项
					this.showLinePoint(true, true, false);
				}else {
					this.showLinePoint(true, true, true);
				}
			}
		}else {//如果没有选择起点
			if(this.endLinePoint != null) {//如果已选择终点
				if(this.selectLinePoint > this.endLinePoint){//如果选择的点在终点之后
					//隐藏起点选项
					this.showLinePoint(true, false, true);
				}else {
					this.showLinePoint(true, true, true);
				}
			}else {
				this.showLinePoint(true, true, true);
			}
		}
	}
}

/**
 * 选择起点或者终点后，点击确认按钮
 */
trackPlayback.prototype.saveLinePoint = function() {
	this.showLinePoint(false);
	var type = $("input[name='linePoint']:checked").val();
	var trackStatus_ = this.trackList[this.selectLinePoint];
	if(type == 1) {//选择起点
		//如果选择的起点和终点相同，则终点置为空
		if(this.endLinePoint != null && this.endLinePoint == this.selectLinePoint) {
			this.endLinePoint = null;
			//删除终点标记
			this.delLinePointMarker(this.addEndPointExpId);
		}
		this.startLinePoint = this.selectLinePoint;
		//删除起点标记
		this.delLinePointMarker(this.addStartPointExpId);
		//添加起点标记
		this.addLinePointMarker(1, this.addStartPointExpId, trackStatus_.mapJingDu, trackStatus_.mapWeiDu,
				null, lang.track_qiDian, lang.index+':'+(this.startLinePoint+1));
	}else {//选择终点
		//如果选择的起点和终点相同，则起点置为空
		if(this.startLinePoint != null && this.startLinePoint == this.selectLinePoint) {
			this.startLinePoint = null;
			//删除起点标记
			this.delLinePointMarker(this.addStartPointExpId);
		}
		this.endLinePoint = this.selectLinePoint;
		//删除终点标记
		this.delLinePointMarker(this.addEndPointExpId);
		//添加终点标记
		this.addLinePointMarker(1, this.addEndPointExpId, trackStatus_.mapJingDu, trackStatus_.mapWeiDu,
				null, lang.track_zhongDian, lang.index+':'+(this.endLinePoint+1));
	}
	//如果起点和终点都选择了，就进行画线操作
	if(this.startLinePoint != null && this.endLinePoint != null) {
		//如果起点大于终点，则提示
		if(this.startLinePoint >= this.endLinePoint) {
			$.dialog.tips(lang.track_errorQiZhongDian, 1);
		}else {
			//统计所有范围内的点的经纬度
			var jingDus = [];
			var weiDus = [];
			for(var i = this.startLinePoint; i <= this.endLinePoint; i++) {
				if(this.trackList[i].isGpsValid) {
					jingDus.push(this.trackList[i].mapJingDu);
					weiDus.push(this.trackList[i].mapWeiDu);
				}
			}
			//调用下层画区域操作
			if(typeof ttxMap != 'undefined' && ttxMap != null
					&& jingDus.length > 0 && weiDus.length > 0) {
				//9 为画线操作
				ttxMap.doMapDrawMarker(9, jingDus.toString(), weiDus.toString(), null);
			}
		}
	}
}

/**
 * 选择起点或者终点后再地图画一个标记点
 */
trackPlayback.prototype.addLinePointMarker = function(type, markerId, jingdu, weidu, param, title, index) {
	if(typeof ttxMap != 'undefined' && ttxMap != null && markerId) {
		ttxMap.insertMarker(markerId);
		ttxMap.updateMarker(markerId, type, title, jingdu, weidu
				, 0, "FF0000", index, param);
		ttxMap.selectMarker(markerId);
	}
}

/**
 * 删除起点或者终点标记点
 */
trackPlayback.prototype.delLinePointMarker = function(markerId) {
	if(typeof ttxMap != 'undefined' && ttxMap != null && markerId) {
		ttxMap.deleteMarker(markerId);
	}
}

//添加线路成功后，删除起点和终点标记
trackPlayback.prototype.delTrackLinePointMarker = function() {
	//删除起点标记
	this.delLinePointMarker(this.addStartPointExpId);
	//删除终点标记
	this.delLinePointMarker(this.addEndPointExpId);
}