var GFRAME = null;
var searchOpt = null;
var isShowTrackList = false;
var isPlaying = false;	//是否正在播放状态
var isPause = false;	//是否在在暂停状态
var playPos = -1;		//播放位置信息
var qiDianPos = 0;		//起始点位置
var zhongDianPos = 0;	//终点位置
var trackPos = 0;		//地图上轨迹点的位移，每次先播放100点，再显示100个点
var trackList = null;	//轨迹列表
var mapTrack = null;	//地图上播放对象
var playTimer = null;		//播放定时器
var playInterval = 1000;	//播放间隔
var ajaxQuery = null;	//查询请求对象
var vehiObj = null;		//播放的车辆对象
var vehiName = null;	//查询的车辆名称
var vehiIcon = 1;		//车辆图标
var playIndex = 0;		//播放序号，通过此参数来判断是否还继续解析起点和终点的位置信息
var positionTimer = null;	//解析起点位置和终点位置的定时器

$(document).ready(function () {
	GFRAME = new mapframe();
	GFRAME.createMap();
	GFRAME.imagePath = "../js/map/image/";
	searchOpt = new searchOption(true, true);
	searchOpt.initSearchOption();
	loadLang();
	gpsInitDistance("#distance");
});

$(function() {
	$('.editable-select').editableSelect(
	{
		bg_iframe: true,
		onSelect: function(list_item) {
				
			},
		items_then_scroll: 10
		}
	);	
	searchOpt.initDeviceQuery();
	searchOpt.deviceSelect().setZIndex(2000);
});

function loadLang() {
	searchOpt.loadLang();
	$("#spanClosePanel").text(parent.lang.track_spanClosePanel);
	$("#spanDistance").text(parent.lang.report_labelDistance);
	$("#spanParkTime").text(parent.lang.report_labelParkTime);
	$("#spanParkMinute").text(parent.lang.second);
	$("#spanPlayNormal").text(parent.lang.track_playNormal);
	$("#spanPlayFast").text(parent.lang.track_playFast);
	$("#spanPlayProcess").text(parent.lang.track_labelPlayProgress);
	$("#spanStartPosition").text(parent.lang.track_labelStartPosition);
	$("#spanEndPosition").text(parent.lang.track_labelEndPosition);
	$("#spanLiCheng").text(parent.lang.track_labelLiCheng);
	$("#btnPause").attr("title", parent.lang.track_pause);
	$("#btnPlay").attr("title", parent.lang.track_play);
	$("#btnStop").attr("title", parent.lang.track_stop);
	$("#btnExcel").attr("title", parent.lang.track_excel);
	$("#thIndex").text(parent.lang.index);
	$("#thDirection").text(parent.lang.direction);
	$("#thTime").text(parent.lang.time);
	$("#thSpeed").text(parent.lang.report_speed + gpsGetLabelSpeedUnit());
	$("#thPosition").text(parent.lang.report_positionCurrent);
	$("#thLiCheng").text(parent.lang.report_normal_lichengTotal + gpsGetLabelLiChengUnit());
	$("#thAlarm").text(parent.lang.monitor_vehiStatusAlarm);
	$("#thStatus").text(parent.lang.monitor_vehiStatusNormal);
	$("#thTemperature").text(parent.lang.monitor_vehiStatusTemperature);
	$("#spanLabelStartPosition").text(parent.lang.track_labelStartPosition);
	$("#spanLabelEndPosition").text(parent.lang.track_labelEndPosition);
	$("#spanLabelLiCheng").text(parent.lang.track_labelLiCheng);
}

function moveTrackList() {
	var rightHeight = $("#FrameCanvas").height();
	var mapToolbarHeight = $("#mapToolbar").height();
	var mapTableHeight = 2;
	if (isShowTrackList) {
		mapTableHeight = parseIntDecimal(rightHeight * 0.2);
	}
	var statusToolbarHeight = $("#statusToolbar").height();
	$("#mapcanvas").height(rightHeight - mapToolbarHeight - mapTableHeight - statusToolbarHeight);
	if (isShowTrackList) {
		$("#trackTable").height(mapTableHeight - 1);
		$("#trackTable").show();
		$("#closeTrackBar").show();
		$("#openTrackBar").hide();
	} else {
		$("#trackTable").hide();
		$("#closeTrackBar").hide();
		$("#openTrackBar").show();
	}
}

var resizeCount = 0;
function resizeFrame() {
	resizeCount += 1;
	var totalHeight = $("#FrameCanvas").height();
	if (totalHeight <= 100 && resizeCount <= 3) {
		setTimeout(resizeFrame, 1000);
	} else {
		moveTrackList();
		parent.isInitTrackFrame = true;
	}
	return ;
}

function switchTrackList() {
	isShowTrackList = !isShowTrackList;
	moveTrackList();
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
	diableInput("#distance", disable, true);
	diableInput("#parktime", disable, true);
	diableInput("#playModeNormal", disable, true);
	diableInput("#playModeFast", disable, true);
	diableInput("#btnQuery", disable, true);
}

function changePlay(playing) {
	if (playing) {
		$("#btnPlay").hide();
		$("#btnPause").show();
	} else {
		$("#btnPlay").show();
		$("#btnPause").hide();
	}
}

function isGpsPosValid(track) {
	if (track.mapJingDu != null && track.mapJingDu != "") {
		return true;
	} else {
		return false;
	}
}

function insertQidianMarker(insertTable) {	//加入起点
	for (var i = 0; i < trackList.length; i += 1) {
		playPos = i;
		qiDianPos = i;
		//不管GPS数据是否有效，都插入到列表中
		if (insertTable) {
			insertTrackTable(i, null);
		}
		//快速回放时，不插入到列表中
		if (isGpsPosValid(trackList[i])) {
			insertTrackMarker(i, 5, 1);
			break;
		}
	}
}

function findZhongdianMarker() {
	//从后往前找第一个有效位置的GPS坐标点
	var zhongdianIndex = trackList.length - 1;
	for (var i = zhongdianIndex; i > 0; i -= 1) {
		if (isGpsPosValid(trackList[i])) {
			zhongDianPos = i;
			break;
		}
	}
}

function insertZhongdianMarker(insertTable) {	//加入终点
	if (zhongDianPos > 0) {
		insertTrackMarker(zhongDianPos, 6, 1);
		if (insertTable) {
			for (var i = zhongDianPos; i < trackList.length; i += 1) {
				insertTrackTable(i, null);
			}
		}
	}
}

function insertTrackMarker(index, status, show) {
	var gpsTrack = trackList[index];
	trackInsertVehicle(mapTrack, index, vehiIcon);
	var data = gpsParseTrackStatus(vehiObj, gpsTrack);
	var label = "";
	//解析车辆图标状态
	var mapStatus = 0;
	if (status != null) {
		//起点或者终点，则直接定义车辆图标
		mapStatus = status;
		if (status == 5) {
			label = parent.lang.track_qiDian;
		} else if(status == 6) {
			label = parent.lang.track_zhongDian;
		}
	} else {
		//跟据车辆状态定义车辆图标
		mapStatus = data.image;
	}

	//判断车辆是否处于停止状态
	if (gpsIsParkEvent(gpsTrack.status1, gpsTrack.parkTime)) {
		show = true;
		label = parent.lang.track_parkEvent + gpsFormatSecond2Time(gpsTrack.parkTime);
		if (status == null) {
			mapStatus = 4;
		}
	}
	trackUpdateVehicle(mapTrack, index, vehiName, gpsTrack.mapJingDu, gpsTrack.mapWeiDu, gpsGetDirection(gpsTrack.huangXiang), mapStatus, label, data.statusString, show);
	return data;
}

function insertTrackTable(index, data) {
	var gpsTrack = trackList[index];
	var info = data;
	if (info === null) {
		info = gpsParseTrackStatus(vehiObj, gpsTrack);
	}
	var row = $("#trackTemplate").clone();
	row.find("#tdIndex").text(index + 1);
	row.find("#tdTime").text(gpsTrack.gpsTime);
	row.find("#tdPosition").text(gpsGetPosition(gpsTrack.jingDu, gpsTrack.weiDu, gpsTrack.status1));
	row.find("#tdSpeed").text(gpsGetSpeedHuangXiangString(gpsTrack.speed, gpsTrack.status1, gpsTrack.huangXiang));
	row.find("#tdLiCheng").text(gpsGetLiCheng(gpsTrack.liCheng));
	row.find("#tdAlarm").text(info.alarm);
	row.find("#tdStatus").text(info.normal);
	row.find("#tdTempature").text(gpsGetVehicleTemperature(vehiObj, gpsTrack));
	
	row.find("#tdIndex").css("color", info.color);
	row.find("#tdTime").css("color", info.color);
	row.find("#tdPosition").css("color", info.color);
	row.find("#tdSpeed").css("color", info.color);
	row.find("#tdLiCheng").css("color", info.color);
	row.find("#tdLiCheng").css("color", info.color);
	row.find("#tdAlarm").css("color", info.color);
	row.find("#tdStatus").css("color", info.color);
	row.find("#tdTempature").css("color", info.color);
	
	row.attr("id", index);
	if ( (index % 2) == 1) {
		row.attr("class", "tabdata bluebg");
	} else {
		row.removeClass().addClass("tabdata");
	}
	row.attr("id", "tableTop_" + index);
	row.mouseover(function(){
		$(this).addClass("focusbg");
	})
	row.mouseout(function(){
		$(this).removeClass("focusbg");
	})
	row.show();
	$("#trackPlayTable").prepend(row);
//	row.prependTo("#trackPlayTable");
	//更新车辆列表字体颜色
//	$("#tableTop_" + index + " td").each(function(){
//	   	$(this).css("color", info.color);
//	});
}

//配置播放进度		10表示10%
function setPlayProgress(progress) {
	document.getElementById("processBar").style.backgroundPosition = parseIntDecimal(progress) + "%";
	$("#processBar").attr("title", (100 - parseIntDecimal(progress)) + "%");
}

function playOneTrack() {
	playPos = playPos + 1;
	$("#trackPointNow").text(playPos + 1);
	setPlayProgress( ((trackList.length - playPos) / trackList.length) * 100 );
	if (playPos >= zhongDianPos) {
		//插入终点图标
		insertZhongdianMarker(true);
		//播放结束		
		finishPlay(true);
	} else {
		if (playPos > trackPos) {
			drawTrack();
		}
		
		//GPS有效的情况下，才画一个轨迹点
		var track = trackList[playPos];
		var data = null;
		if (isGpsPosValid(track)) {
//			trackPushPoint(mapTrack, track.mapJingDu, track.mapWeiDu);
//			trackDrawPoint(mapTrack, track);
			data = insertTrackMarker(playPos, null, false);
		}
		
		//插入图标结点
		//insertTrackMarker(playPos, null, false);
		//插入表格中
		insertTrackTable(playPos, data);
		if (!isPause) {
			playTimer = setTimeout(playOneTrack, playInterval);	//设置定时器，显示轨迹点信息
		}
	}
}

//每次画100个轨迹点信息
function drawTrack() {
	var endPos = trackPos + 100;
	if (endPos >= trackList.length) {
		endPos = trackList.length - 1;
	}
	for (var i = trackPos; i <= endPos; i += 1) {
		if (isGpsPosValid(trackList[i])) {
			trackPushPoint(mapTrack, trackList[i].mapJingDu, trackList[i].mapWeiDu);
		}
	}
	trackDrawPoint(mapTrack);
	trackPos = endPos;
}

function showLiCheng() {
	var totalLiCheng = trackList[zhongDianPos].liCheng - trackList[qiDianPos].liCheng;
	$("#spanLiCheng").text(gpsGetLiCheng(totalLiCheng) + gpsGetLiChengUnit());
	
}

//末使用
function qiDianAddress(results,status) {
	if (status == google.maps.GeocoderStatus.OK) {
		$("#spanStartPosotion").text(results[0].formatted_address);
	} else {
		//如果没有停止播放，则继续获取位置信息
		positionTimer = setTimeout(getStartPosition, 10000);
	}
}
//末使用
function getStartPosition() {
	if (isGpsPosValid(trackList[qiDianPos])) {
		parseAddressEx(trackList[qiDianPos].mapJingDu, trackList[qiDianPos].mapWeidu, qiDianAddress);
	}
}
//末使用
function zhongDianAddress(results,status) {
	if (status == google.maps.GeocoderStatus.OK) {
		$("#spanEndPosotion").text(results[0].formatted_address);
	} else {
		//如果没有停止播放，则继续获取位置信息
		positionTimer = setTimeout(getStartPosition, 10000);
	}
}
//末使用
function getEndPosition() {
	if (isGpsPosValid(trackList[zhongDianPos])) {
		parseAddressEx(trackList[zhongDianPos].mapJingDu, trackList[zhongDianPos].mapWeidu, zhongDianAddress);
	}
}

function normalPlay() {
	//插入一条轨迹信息
	trackInsertTrack(mapTrack);
	//显示起点图标
	insertQidianMarker(true);
	setPlayProgress(((trackList.length - qiDianPos) / trackList.length) * 100);
	$("#trackPointNow").text(qiDianPos + 1);
	//显示轨迹列表
	if (!isShowTrackList) {
		isShowTrackList = true;
		moveTrackList();
	}
	//查找终点图标
	findZhongdianMarker();
	//先画面100个轨迹点
	drawTrack();
	//显示里程
	showLiCheng();
	//轨迹播放
	playTimer = setTimeout(playOneTrack, playInterval);	//设置定时器，显示轨迹点信息
}

function fastPlay() {
	trackInsertTrack(mapTrack);
	//显示起点图标
	insertQidianMarker(false);
	//查找终点图标
	findZhongdianMarker();
	//画所有轨迹
	var i = 0;
	var trackLength = trackList.length;
	for (i = qiDianPos; i < trackLength; i += 1){
		if (isGpsPosValid(trackList[i])) {
			//加入一个轨迹点
			trackPushPoint(mapTrack, trackList[i].mapJingDu, trackList[i].mapWeiDu);
			//更新地图上车辆信息，gps有效时，才进行更新
			if (i > qiDianPos && i < zhongDianPos) {
				insertTrackMarker(i, null, false);
			}
		}
	}
	trackDrawPoint(mapTrack);
	//显示终点图标
	insertZhongdianMarker(false);
	//显示里程
	showLiCheng();
	//结束快速回放
	finishPlay(true);
}

//轨迹回放收到数据
function doAjaxTrack(json,action,success) {
	if (!isPlaying) {
		return ;
	}
	if (success) {
		trackList = json.tracks;
		if (trackList == null || trackList.length == 0) {
			alert(parent.lang.track_null);
			finishPlay(false);
		} else {
			$("#trackPointTotal").text(trackList.length);
			$("#position").show();
			mapTrack = 1;
			//进行轨迹回放
			var playMode = $("input[name='playMode']:checked").val();
			if (playMode == "1") {
				normalPlay(); 
			} else {
				fastPlay();
			}
		}
	} else {
		//改变播放状态
		changePlay(false);
		//允许进行搜索选择
		disableForm(false);
	}
}

function startPlay() {	//开始轨迹回放
	if (isPlaying) {
		pausePlay();
	} else {
		var data = searchOpt.getQueryData(true);
		if (data == null) {
			return;
		}
		//判断停车时长
		if (!searchOpt.checkParkTime("#parktime")) {
			return ;
		}
		//禁用控制面板内的控件
		disableForm(true);
		//改变播放按钮
		changePlay(true);		//切换到播放状态
		//清除地图上的轨迹
		if (mapTrack != null) {
			trackDeleteTrack(mapTrack);
			mapTrack = null;
		}
		//清除播放列表
		$.myajax.cleanTableContent("#trackPlayTable");
		//设置播放的状态	
		isPlaying = true;		//设置正在播放的状态
		isPause = false;		
		playPos = -1;	
		qiDianPos = 0;
		zhongDianPos = 0;
		trackPos = 0;
		$("#trackPointNow").text("0");
		$("#trackPointTotal").text("0");
		$("#spanStartPosition").text("");
		$("#spanEndPosition").text("");
		setPlayProgress(100);
		vehiObj = gpsGetVehicleObj(data.device);
		vehiName = gpsGetVehicleName(data.device);
		vehiIcon = gpsGetVehicleIcon(data.device);
		//取消获取地图位置
//		if (positionTimer != null) {
//			killTimer(positionTimer);	positionTimer = null;
//		}
		//进行查询
		var action = "TrackAction_query.action?begintime=" + data.begindate + "&endtime=" + data.enddate + "&devIdno=" + data.device 
				+ "&parkTime=" + $("#parktime").val() + "&distance=" + $("#distance").val();
		$.myajax.jsonGetEx(action, doAjaxTrack, null, null);
	}
}

function pausePlay() {	//暂停轨迹回放
	if (isPlaying) {
		if (!isPause) {
			if (playTimer != null) {
				clearTimeout(playTimer);
			}
		} else {
			playTimer = setTimeout(playOneTrack, playInterval);
		}
		isPause = !isPause;
		changePlay(!isPause);
	}
}

function restorePlay() {
	isPlaying = false;
	isPause = false;
	disableForm(false);
	changePlay(false);
}

//播放结束
function finishPlay(showFinished) {
	restorePlay();
	//更新当前播放位置
	if (trackList != null) {
		$("#trackPointNow").text(trackList.length);
		setPlayProgress(0);
	}
	if (showFinished) {
		setTimeout(function () {
			alert(parent.lang.track_finished);
			}, 0);
	}
}

function stopPlay() {	//停止轨迹回放
	if (isPlaying) {
		//关闭播放定时器
		if (!isPause) {
			if (playTimer != null) {
				clearTimeout(playTimer);
			}
		}
		//停止查询请求
		if (ajaxQuery != null) {
			ajaxQuery.abort();	//中止轨迹查询请求
			ajaxQuery = null;
		}
		//
		restorePlay();
		//停止播放
		trackList = null;
	}
}

var status = 0;
function OpenControlPanel() {
	var width = document.getElementById("playPane").offsetLeft;
	var playPane = document.getElementById("playPane");
	if (status == 0) {
		status = 1;
//		$("#controlImg").attr("src", "../images/track/openPanel.jpg");
		$("#showControlPanel").show();
		$("#trackControl").hide();
		playPane.style.left = (width + 220) + "px";
	} else {
		status = 0;
//		$("#controlImg").attr("src", "../images/track/closePanel.jpg");
		$("#showControlPanel").hide();
		$("#trackControl").show();
		playPane.style.left = (width - 220) + "px";
	}
}

function exportTrack() {
	var query = searchOpt.getQueryData(false);
	if (query === null) {
		return ;
	}
	
	$("#devIdnos").val(query.device.toString());
	document.reportForm.action = "TrackAction_gpstrackExcel.action";
	document.reportForm.submit(); 
}

function clickTrack(track) {
	var temp = track.id.split('_');
	if (temp.length == 2) {
		trackSelectVehicle(mapTrack, parseIntDecimal(temp[1]));
	}
}
