var api = frameElement.api, W = api.opener;
var alarmTree;  //报警树
$(document).ready(function(){
	loadReadyPage();
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
		setPanelWidth();
	}
}

function loadPage(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.save, name : '', pclass : 'save',
				bgcolor : 'gray', hide : false}],
			[{display: parent.lang.close, name : '', pclass : 'close',
				bgcolor : 'gray', hide : false}]
		]
	});
	
	//加载报警树
	loadAlarmTree();
	
	//保存事件
	$('.save').on('click',saveAlarmShield);
	
	//关闭事件
	$('.close').on('click',function() {
		W.$.dialog({id:'alarmShield'}).close();
		W.closeMapPop();
	});
}

/*
 * 加载报警树
 */
function loadAlarmTree() {
	//加载车辆树
	alarmTree = new dhtmlXTreeObject("alarm_tree", "100%", "100%", 0);
	alarmTree.setImagePath("../../js/dxtree/imgs/");
//		vehiTree.enableDragAndDrop(true);
//		vehiTree.setDragHandler(doDragItem);
	alarmTree.enableCheckBoxes(1);
	alarmTree.enableThreeStateCheckboxes(true);
//		vehiTree.setOnDblClickHandler(doDbClickTreeVehi); //双击事件
//		vehiTree.setOnCheckHandler(doCheckTreeVehi); //选中事件
//		vehiTree.setOnClickHandler(doClickTreeVehi); //单击事件
//		vehiTree.setOnOpenEndHandler(doOpenOrCloseTree); //节点展开/合拢结束事件
	
	//速度报警
	alarmTree.insertNewItem("0", "speendAlarm", parent.lang.monitor_alarm_speed, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("speendAlarm", "11,61", parent.lang.monitor_alarm_speed, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("speendAlarm", "14,64", parent.lang.alarm_type_overtimeParking, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//视频报警
	alarmTree.insertNewItem("0", "videoAlarm", parent.lang.monitor_alarm_video, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("videoAlarm", "15,65", parent.lang.alarm_type_motion, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("videoAlarm", "4,54", parent.lang.alarm_type_video_lost, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("videoAlarm", "5,55", parent.lang.alarm_type_video_mask, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//硬盘报警
	alarmTree.insertNewItem("0", "diskAlarm", parent.lang.monitor_alarm_disk, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("diskAlarm", "39", parent.lang.monitor_alarm_disk1NoExist, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("diskAlarm", "40", parent.lang.monitor_alarm_disk2NoExist, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("diskAlarm", "10,60", parent.lang.alarm_type_disk_error, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("diskAlarm", "157,158", parent.lang.alarm_type_highTemperature, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("diskAlarm", "162,163", parent.lang.alarm_type_defect_disk, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//故障报警
	alarmTree.insertNewItem("0", "faultAlarm", parent.lang.monitor_alarm_fault, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("faultAlarm", "45,85", parent.lang.monitor_alarm_GpsInvalid, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("faultAlarm", "18,68", parent.lang.alarm_type_gps_signal_loss, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("faultAlarm", "202,252", parent.lang.alarm_type_GNSSModuleFailure, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("faultAlarm", "203,253", parent.lang.alarm_type_GNSSAntennaMissedOrCut, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("faultAlarm", "204,254", parent.lang.alarm_type_GNSSAntennaShort, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("faultAlarm", "207,257", parent.lang.alarm_type_LCDorDisplayFailure, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("faultAlarm", "208,258", parent.lang.alarm_type_TTSModuleFailure, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("faultAlarm", "209,259", parent.lang.alarm_type_cameraMalfunction, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("faultAlarm", "215,265", parent.lang.alarm_type_VSSFailure, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//操作报警
	alarmTree.insertNewItem("0", "operateAlarm", parent.lang.monitor_alarm_operate, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("operateAlarm", "2,52", parent.lang.alarm_type_ungency_button, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("operateAlarm", "6,56", parent.lang.alarm_type_door_open_lawless, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//油量报警
	alarmTree.insertNewItem("0", "fuelAlarm", parent.lang.monitor_alarm_fuel, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("fuelAlarm", "46,86", parent.lang.alarm_type_add_oil, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fuelAlarm", "47,87", parent.lang.alarm_type_dec_oil, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fuelAlarm", "216,266", parent.lang.alarm_type_abnormalFuel, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//其它报警
	alarmTree.insertNewItem("0", "otherAlarm", parent.lang.monitor_alarm_otherAlarm, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("otherAlarm", "9,59", parent.lang.alarm_type_temperator, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "151,152", parent.lang.alarm_type_nightdriving, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "49,99", parent.lang.alarm_type_fatigue, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "153,154", parent.lang.alarm_type_gathering, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "155,156", parent.lang.alarm_type_upsCut, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "159,160", parent.lang.alarm_type_before_board_opened, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "166,167", parent.lang.alarm_type_sim_lost, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "7,57", parent.lang.alarm_type_erong_pwd, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "13,63", parent.lang.alarm_type_door_abnormal, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "3,53", parent.lang.alarm_type_shake, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "8,58", parent.lang.alarm_type_illegalIgnition, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "16", parent.lang.alarm_type_Acc_on, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "66", parent.lang.alarm_type_Acc_off, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "201,251", parent.lang.alarm_type_earlyWarning, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "205,255", parent.lang.alarm_type_mainSupplyUndervoltage, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "206,256", parent.lang.alarm_type_mainPowerFailure, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "210,260", parent.lang.alarm_type_cumulativeDayDrivingTimeout, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "217,267", parent.lang.alarm_type_antitheftDevice, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "218,268", parent.lang.alarm_type_illegalDisplacement, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "219,269", parent.lang.alarm_type_rollover, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//IO报警
	alarmTree.insertNewItem("0", "IOAlarm", parent.lang.alarm_type_io, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("IOAlarm", "19,69", parent.lang.alarm_type_io1, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "20,70", parent.lang.alarm_type_io2, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "21,71", parent.lang.alarm_type_io3, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "22,72", parent.lang.alarm_type_io4, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "23,73", parent.lang.alarm_type_io5, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "24,74", parent.lang.alarm_type_io6, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "25,75", parent.lang.alarm_type_io7, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "26,76", parent.lang.alarm_type_io8, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "41,91", parent.lang.alarm_type_io9, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "42,92", parent.lang.alarm_type_io10, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "43,93", parent.lang.alarm_type_io11, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "44,94", parent.lang.alarm_type_io12, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//围栏报警
	alarmTree.insertNewItem("0", "fenceAlarm", parent.lang.monitor_alarm_fence, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("fenceAlarm", "27,77", parent.lang.alarm_type_fence_in, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "28,78", parent.lang.alarm_type_fence_out, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "29,79", parent.lang.alarm_type_fence_in_overspeed, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "30,80", parent.lang.alarm_type_fence_out_overspeed, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "31,81", parent.lang.alarm_type_fence_in_lowspeed, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "32,82", parent.lang.alarm_type_fence_out_lowspeed, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "33,83", parent.lang.alarm_type_fence_in_stop, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "34,84", parent.lang.alarm_type_fence_out_stop, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "12,62", parent.lang.alarm_type_beyond_bounds, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "200,250", parent.lang.alarm_type_regionalSpeedingAlarm, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "211,261", parent.lang.alarm_type_outOfRegional, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "212,262", parent.lang.alarm_type_outOfLine, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "213,263", parent.lang.alarm_type_InadequateOrTooLongRoadTravelTime, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "214,264", parent.lang.alarm_type_routeDeviation, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//平台报警
	alarmTree.insertNewItem("0", "platformAlarm", parent.lang.monitor_alarm_platform, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("platformAlarm", "300,350", parent.lang.alarm_type_areaOverSpeed_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "301,351", parent.lang.alarm_type_areaLowSpeed_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "302,352", parent.lang.alarm_type_areaInOut_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "303,353", parent.lang.alarm_type_lineInOut_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "304,354", parent.lang.alarm_type_overSpeed_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "305,355", parent.lang.alarm_type_lowSpeed_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "306,356", parent.lang.alarm_type_fatigue_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "307,357", parent.lang.alarm_type_parkTooLong_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "308,358", parent.lang.alarm_type_areaPoint_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "309,359", parent.lang.alarm_type_lineOverSpeed_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "310,360", parent.lang.alarm_type_lineLowSpeed_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "311,361", parent.lang.report_roadLvlOverSpeed_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//上下线报警
	alarmTree.insertNewItem("0", "loginAlarm", parent.lang.monitor_alarm_login, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("loginAlarm", "17", parent.lang.alarm_type_device_online, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("loginAlarm", "67", parent.lang.alarm_type_device_disOnline, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//关闭所有的节点
	alarmTree.closeAllItems();
	
	//更新授权列表
	if(W.monitorAlarm.alarmShields != null) {
		var alarmShields = W.monitorAlarm.alarmShields;
		for (var i = 0; i < alarmShields.length; i = i + 1) {
			alarmTree.setCheck(alarmShields[i], true);
			alarmTree.setCheck(alarmShields[i]+','+(Number(alarmShields[i])+1), true);
			alarmTree.setCheck(alarmShields[i]+','+(Number(alarmShields[i])+40), true);
			alarmTree.setCheck(alarmShields[i]+','+(Number(alarmShields[i])+50), true);
		}
	}
}

function saveAlarmShield() {
	var alarmShields = alarmTree.getAllChecked().split(",");
	var selectShield = [];
	for (var i = 0; i < alarmShields.length; i = i + 1) {
		if ( !isNaN(alarmShields[i]) ) {
			selectShield.push(alarmShields[i]);
		}
	}
	var data = {};
	data.armString = selectShield.toString();
	
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost("StandardPositionAction_saveAlarmShield.action", data, false, function(json, success) {
		$.myajax.showLoading(false);
		if (success) {
			W.monitorAlarm.initAlarmShield();
			W.$.dialog({id:'alarmShield'}).close();
		}
	});
}

//改变窗口大小时加载页面
function setPanelWidth() {
	$('#alarm_tree').height($(window).height() - $('#toolbar-btn').height() - 25);
}