var ttxMap = null;		//地图对象
var mapWidth = 300;		//地图宽度
var ttxVideo = null;    //视频对象
var is_mouse_down = false;
var src_posi_Y = 0, dest_posi_Y = 0, move_Y = 0, destHeight = 30,mapHeight;
var videoPlayer = null; //录像回放类对象
var popTipsObject = new Hashtable();  //页面弹出框对象集合

$(document).ready(function () {
	$('body').flexShowLoading(true);
	loadReadPage();
});

function loadReadPage() {
	loadLang();
	loadPageInfo();
	loadVehicleList();
	videoPlayer = new videoPlayback();
	videoPlayer.initialize();
	setPanelWidth(fixHeight);
	initTtxMap();
	initTtxVideo();
}

function fixHeight() {
	if(videoPlayer != null) {
		videoPlayer.videoFileTable.flexFixHeight();
	}
}

//加载语言
function loadLang() {
	$('#spanSelVehicle').text(parent.lang.btnSelectVehicle);
	$('#fileLocation H3').text(parent.lang.fileLocation);
	$('#spanDevice').text(parent.lang.terminalDevice);
	$('#spanStorageServer').text(parent.lang.server_storage);
	$('#spanDownloadServer').text(parent.lang.server_down);
	$('#fileType H3').text(parent.lang.fileType);
	$('#spanVideoType').text(parent.lang.rule_video);
	$('#videoType H3').text(parent.lang.alarm_record_type);
	$('#alarmType H3').text(parent.lang.vehicle_alarmaction_alarmType);
	$('#spanVideoNormal').text(parent.lang.file_normal);
	$('#spanVideoAlarm').text(parent.lang.monitor_vehiStatusAlarm);
	$('#spanVideoAll').text(parent.lang.file_all);
	$('#btn_serach').text(parent.lang.btnSearch);
	$('#video_time_title').text(parent.lang.time);
	$('#video_file_title').text(parent.lang.file);
	$('#video_download_title').text(parent.lang.download);
}

function loadPageInfo() {
	$('#select-alarmList').flexPanel({
			ComBoboxModel :{
				button :
				[
					[{
						display: parent.lang.alarm_type_all, name : 'alarmList', pid : 'alarmList', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]
				],
				combox: {name : 'alarmList', option : arrayToStr(getSelectAlarm())}
			}	
		});
		$('#hidden-alarmList').val('17');
		$('#alarmType').hide();
		$('#videoType input').on('click',function(){
			if($(this).val() == 1){
				$('#alarmType').show();
			}else{
				$('#alarmType').hide();
			}
		});
	//加载日期控件
	$("#datepicker").datepicker({
		changeMonth: true,
		changeYear: true,
		gotoCurrent: true,
		onChangeMonthYear: function(year, month, inst) {
			//改变年月后更改天
			var day = Number(dateFormat2DateString($("#datepicker").datepicker('getDate')).substring(8, 10));
			$("#datepicker").datepicker('setDate', dateStrDate2Date(year+'-'+month+'-'+day));
		}
	});
	$("#datepicker").datepicker('option', $.datepicker.regional[parent.langWdatePickerCurLoacl()]);
	
	//位置定位拖动高度
   $(".map_drag_box").mousedown(function(e){
       src_posi_Y = e.pageY;
       is_mouse_down = true;
       $('#mapMoveDiv').show();
   });
   $(document).bind("click mouseup",function(e){
   		ttxMapDocumentMouseClick();
   }).mousemove(function(e){
   		ttxMapDocumentMouseMove(e);
   });
	//列表缩小，放大
	$(".min_s").click(function(){
		if($(this).hasClass("icon_s")){
			$(".map_action").css("height",$(window).height() - 38 < 39 ? $(window).height() - 38 : 39);
			$(".dm_video").height($(window).height() - $('.map_action').height());
			$(".dm_map").height($(window).height() - $('.map_action').height());
			$('.gps_box .flexigrid').each(function() {
				$(this).height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height());
				$(this).find(".bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .tDiv').height());
			});
			$(this).removeClass("icon_s").addClass("icon_s_re");
			$(".min_big").removeClass("icon_s_re").addClass("icon_big");
			videoPlayer.videoTimeTable.hideVideoTimeline(true);
			setTooltip('.icon_s_re', parent.lang.window_windowing);
			setTooltip('.icon_big', parent.lang.window_maximize);
		}else{
			$(".map_action").css("height",$(window).height() - 38 > 260 ? 260 : $(window).height() - 38);
			$(".dm_video").height($(window).height() - $('.map_action').height());
			$(".dm_map").height($(window).height() - $('.map_action').height());
			$('.gps_box .flexigrid').each(function() {
				$(this).height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height());
				$(this).find(".bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .tDiv').height());
			});
			$(this).removeClass("icon_s_re").addClass("icon_s");
			videoPlayer.videoTimeTable.hideVideoTimeline(false);
			setTooltip('.icon_s', parent.lang.window_minimum);
		}
		$('#mapMoveDiv').css("height",$(".map_action").height());
		$('#mapMoveDiv').css("top",$(window).height() - $(".map_action").height());
		videoPlayer.videoTimeTable.dynamicChnTrHeight();
		fixHeight();
	});
	setTooltip('.icon_s', parent.lang.window_minimum);
	setTooltip('.icon_s_re', parent.lang.window_windowing);
	setTooltip('.icon_download', parent.lang.downloadTask);
	
	//切换事件列表
	$(".map_action .map_tab li").click(function(){
		var _index2 = $(this).index();
		if($(this).attr('id') != 'video-export') {
			$(this).addClass("active").siblings().removeClass("active");
			$(".gps_box li").eq(_index2).addClass("active").siblings().removeClass("active");
			$(".gps_box li").eq(_index2).height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height());
			$(".gps_box li").eq(_index2).find('.bDiv').height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .tDiv').height());
			if($(".min_s").hasClass("icon_s_re")) {
				$('.min_s').click();
			}
		}
	});
	
	//禁止系统右键
	disableSysRight('body',true);
	
	//点击更多弹出车辆选择
	$('.car_select .more_car').on('click', queryMoreVehicle);
	
	//点击搜索按钮事件
	$('#btn_serach').on('click',doQueryVideo);
	
	//查询下载任务
	$('.icon_download').on('click', doQueryDownloadTask);
}
//有视频设备的车辆列表
var videoVehicleList = new Array();
var limVehicleList = new Array();

//加载车辆列表
function loadVehicleList() {
	if(parent.isLoadVehiList) {
		//车辆加载完全，刷新车辆状态
		parent.vehicleManager.runStatusTimer();
		
		videoVehicleList = parent.vehicleManager.getSupportVideoVehicle(false);
		if(videoVehicleList.length < 200) {
			limVehicleList = videoVehicleList;
		}else {
			for (var i = 0, j = videoVehicleList.length; i < 200 && i < j; i++) {
				limVehicleList.push(videoVehicleList[i]);
			}
		}
		
		$('#search-vehicle').flexPanel({
			 ComBoboxModel :{
				 input : {display: parent.lang.selectVehicleTip,name : 'vehiIdnos',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: false},
				 combox: 
						{name : 'vehiIdnos', option : arrayToStr(limVehicleList)}
			 }	
		});
		//附加事件
		$('#select-vehiIdnos li').each(function() {
			$(this).on('click',function() {
				$('#vehiChn').val(-1);
			});
		});
		
		//加载完成
		$('body').flexShowLoading(false);
	}else {
		setTimeout(loadVehicleList,50);
	}
}

function getSelectAlarm(){
	var alarmType = [];
	alarmType.push({id:17,name:parent.lang.alarm_type_all});
	alarmType.push({id:0,name:parent.lang.alarm_type_ungency_button});
	alarmType.push({id:1,name:parent.lang.alarm_type_overspeed});
	alarmType.push({id:2,name:parent.lang.alarm_type_low_speed});
	alarmType.push({id:3,name:parent.lang.alarm_type_shake});
	alarmType.push({id:4,name:parent.lang.alarm_type_temperator});
	alarmType.push({id:5,name:parent.lang.alarm_type_motion});
	alarmType.push({id:6,name:parent.lang.alarm_type_upsCut});
	alarmType.push({id:7,name:parent.lang.alarm_type_rollover});
	alarmType.push({id:8,name:parent.lang.alarm_type_fatigue});
	alarmType.push({id:9,name:parent.lang.alarm_type_io1});
	alarmType.push({id:10,name:parent.lang.alarm_type_io2});
	alarmType.push({id:11,name:parent.lang.alarm_type_io3});
	alarmType.push({id:12,name:parent.lang.alarm_type_io4});
	alarmType.push({id:13,name:parent.lang.alarm_type_io5});
	alarmType.push({id:14,name:parent.lang.alarm_type_io6});
	alarmType.push({id:15,name:parent.lang.alarm_type_io7});
	alarmType.push({id:16,name:parent.lang.alarm_type_io8});
	return alarmType;
}

function initTtxVideo() {
	ttxVideo = new TtxVideo("framePreview");
	if(ttxVideo != null) {
		ttxVideo.initialize(ttxVideoLoadSuc);
	}
}

//视频加载成功后的回调
function ttxVideoLoadSuc() {
	if(ttxVideo != null) {
		ttxVideo.disableSysRight('.map_btn',true);
	}
}

function initTtxMap() {
	ttxMap = new TtxMap('frameMap');
	if(ttxMap != null) {
		ttxMap.initialize(ttxMapLoadSuc);
	}
}

/*
 * 地图加载成功后的回调
 */
function ttxMapLoadSuc() {
	if(ttxMap != null) {
		ttxMap.hideToolbar(true);
		ttxMap.disableSysRight('body',true);
	}
}

function ttxMapDocumentMouseClick() {
	if(is_mouse_down){
        is_mouse_down = false;
        $(".dm_video").css("height", mapHeight);
		$(".dm_map").css("height", mapHeight);
		
		$(".map_action").css("height", $('#mapMoveDiv').height());
		videoPlayer.videoTimeTable.hideVideoTimeline(false);
		if(mapHeight <= 38) {
			$(".min_s").removeClass("icon_s_re").addClass("icon_s");
			setTooltip('.icon_s', parent.lang.window_minimum);
			setTooltip('.icon_s_re', parent.lang.window_windowing);
			$(".dm_video").css("height", 0);
			$(".dm_map").css("height", 0);
			$(".map_action").css("height",$(window).height());
		}
		
		if(destHeight <= 39) {
			$(".min_s").removeClass("icon_s").addClass("icon_s_re");
			videoPlayer.videoTimeTable.hideVideoTimeline(true);
			setTooltip('.icon_s_re', parent.lang.window_windowing);
			setTooltip('.icon_big', parent.lang.window_maximize);
		}
		
		if(destHeight > 260) {
			$(".min_s").removeClass("icon_s_re").addClass("icon_s");
		}
		$('.gps_box .flexigrid').each(function() {
			$(this).height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height());
			$(this).find(".bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .tDiv').height());
		});
		$("#mapMoveDiv").css("height", $('.map_action').height());
		$('#mapMoveDiv').css("top",$(window).height() - $('#mapMoveDiv').height());
		$('#mapMoveDiv').hide();
		videoPlayer.videoTimeTable.dynamicChnTrHeight();
		fixHeight();
	}
}

function ttxMapDocumentMouseMove(e) {
	if(is_mouse_down){
		dest_posi_Y = e.pageY;
		move_Y = src_posi_Y - dest_posi_Y;
		src_posi_Y = dest_posi_Y;

		destHeight = $("#mapMoveDiv").height() + move_Y;
    	mapHeight = $(window).height() - destHeight;
		
		if (mapHeight < 2 || destHeight < 39) {
		} else {
			if(destHeight <= 260) {
				$('#mapMoveDiv').css("height",destHeight > $(window).height() - 38 ? $(window).height() - 38 : destHeight);
				$('#mapMoveDiv').css("top",$(window).height() - $('#mapMoveDiv').height());
			}
		}
		fixHeight();
	}
}

/*
 * 重新加载地图
 */
function ttxMapReload() {
	monitorStatus.preFillVehi2Map(function() {
		$('#frameMap').attr('src', $('#frameMap').attr('src'));
		if(ttxMap != null) {
			ttxMap.doReload();
		}
	});
}

function ttxPlayerDocumentMouseClick() {
	ttxMapDocumentMouseClick();
}

function ttxPlayerDocumentMouseMove(e) {
	ttxMapDocumentMouseMove(e);
}

//隐藏或者显示地图
function doClickHideMap(hide) {
	if(hide) {
		$(".dm_video").css('margin-right', '0px');
		//$(".dm_video").width("100%");
		$('.dm_map').hide();
	}else {
		//$(".dm_video").width("100%");
		$(".dm_video").css('margin-right', '300px');
		$('.dm_map').show();
	}
}

//搜索视频
function doQueryVideo() {
	videoPlayer.doQueryVideo();
}

//下载视频文件
function downloadVideoFile(id) {
	videoPlayer.downloadVideoFile(id);
}

//断点下载视频文件
function downloadVideoFileSec(obj, id) {
	videoPlayer.downloadVideoFileSec(obj, id);
}

//断点下载视频文件（选择通道）
function downloadVideoFileSecChn(id, chn) {
	videoPlayer.downloadVideoFileSecChn(id, chn);
}

//录像回放
function videoFileReplay(obj, id) {
	videoPlayer.videoFileReplay(obj, id);
}

////录像回放（选择通道）
function videoFileReplayChn(id, chn) {
	videoPlayer.videoFileReplayChn(id, chn);
}

//暂停或者启动视频
function ttxPlayerReplayMsg(type) {
	videoPlayer.onReplayMsg(type);
}

//添加分段下载任务成功
function doSaveTaskInfoSuc() {
	$.dialog({id:'taskInfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

//弹出车辆选择菜单类
var selVehiInfo = null;

//点击更多弹出车辆选择
function queryMoreVehicle() {
	if(selVehiInfo == null) {
		selVehiInfo = $.dialog({id:'vehiInfo', title: parent.lang.btnSelectVehicle, content: 'url:VideoManagement/selectVehicle.html?loadChn=true',
			width: '400px', height: '630px', min:true, max:false, lock:false,fixed:false
				, resize:false, close: function() {
					selVehiInfo = null;
					popTipsObject.remove('vehiInfo');
				} });
	}else {
		selVehiInfo.show();
	}
	popTipsObject.put('vehiInfo', selVehiInfo);
	hidePopTips('vehiInfo');
}

//选择车辆成功
function doSelectVehicleSuc(vehiIdno, chn) {
	if(chn == -1) {
		$('#combox-vehiIdnos').val(vehiIdno);
		$('#hidden-vehiIdnos').val(vehiIdno);
	}else {
		var vehicle = parent.vehicleManager.getVehicle(vehiIdno.toString());
		var vehicleChannels = vehicle.getVehicleChannel();
		var chnName = "CH1";
		if(vehicleChannels && chn != null) {
			for (var i = 0; i < vehicleChannels.length; i++) {
				if(chn == vehicleChannels[i].index) {
					chnName = vehicleChannels[i].name;
					break;
				}
			}
		}
		$('#combox-vehiIdnos').val(vehiIdno + '('+ chnName +')');
		$('#hidden-vehiIdnos').val(vehiIdno);
	}
	$('#vehiChn').val(chn);
	selVehiInfo.hide();
//	$.dialog({id:'vehiInfo'}).close();
}

//弹出下载任务列表对象
var downloadTaskObj = null;

//查询下载任务
function doQueryDownloadTask() {
	if(downloadTaskObj == null) {
		downloadTaskObj = $.dialog({id:'downloadTask', title: parent.lang.videoDownloadTask, content: 'url:VideoManagement/downloadTask.html',
			width: '900px', height: '500px', min:true, max:false, lock:false,fixed:false
				, resize:false, close: function() {
					downloadTaskObj = null;
					popTipsObject.remove('downloadTask');
				}});
	}else {
		downloadTaskObj.show();
	}
	popTipsObject.put('downloadTask', downloadTaskObj);
	hidePopTips('downloadTask');
}

//隐藏弹出框
function hidePopTips(name) {
	if(popTipsObject != null && popTipsObject.size() > 0) {
		popTipsObject.each(function(id, value) {
			if(id != name && value != null) {
				value.hide();
			}
		});
	}
}

/*
 *设置页面大小
 */
function setPanelWidth(callBackFun) {
	//地图高度不能超出
	var _height = $(window).height();
	$(".pro_list").height(_height);			//左边面板
	$(".d_main").height(_height);		//主界面
	//事件栏
	if($(".min_s").hasClass("icon_s")){
		$(".map_action").css("height",_height - 38 > 260 ? 260 : _height - 38);
	}else {
		$(".map_action").css("height", $(".map_action").height() > _height - 39 ?   _height - 39 : $(".map_action").height());
		$(".map_action").css("height", $(".map_action").height() < 39 ? 39 : $(".map_action").height());
	}
	$('#mapMoveDiv').css("height",$(".map_action").height());
	$('#mapMoveDiv').css("top",$(window).height() - $(".map_action").height());
	$(".dm_video").height(_height - $('.map_action').height());	//视频界面
	$(".dm_map").height(_height - $('.map_action').height());	//地图界面
	$('.gps_box .flexigrid').each(function() {
		$(this).height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height());
		$(this).find(".bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .tDiv').height());
	});
	//
	videoPlayer.videoTimeTable.dynamicChnTrHeight();
	if (typeof callBackFun == "function") {
		callBackFun();
	}
}