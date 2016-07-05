var api = frameElement.api, W = api.opener;
var audioFile = null;
var alarmTree = null;

$(document).ready(function(){
	loadReadyPage();
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}

function loadPage() {
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//初始化页面信息
	loadPageInfo();
	
	//添加所有车辆  跟结点
	if (isEditAlarmMotion()) {
		$("#alarmSelect").hide();
		$('body').css('width','430px');
		$('body').css('height','400px');
		ajaxLoadAlarmMotion();
	} else {
		//初始化报警类型树
		initAlarmTree();
		//生成报警类型
		$("#beginTime").val("00:00:00");
		$("#endTime").val("23:59:59");
		
		clickPreview();
		
		$('#isLocked-yes').get(0).checked = true;
		$('#isEnable-yes').get(0).checked = true;
	}	
}

//添加通道
function addChnModule(name, count) {
	var content = '';
	if(name == 'cameraAll' || name == 'previewAll') {
		content += '<div class="module '+name+'">';
		content += '	<label for="checkbox-'+name+'">'+parent.lang.selectAll+'</label>';
		content += '	<input type="checkbox" name="'+name+'" value="1" id="checkbox-'+name+'" class="checkbox-'+name+'" style="float:right;" disabled/>';
		content += '</div>';
	}else {
		for(var i = 1; i <= count; i++) {
			content += '<div class="module '+name+'">';
			content += '	<input type="checkbox" name="'+name+i+'" value="1" id="checkbox-'+name+i+'" class="checkbox-'+name+i+'" disabled/>';
			content += '	<label for="checkbox-'+name+i+'">'+ i + parent.lang.rule_number+'</label>';
			content += '</div>';
		}
	}
	return content;
}

//添加 radio选项
function addRadio(name) {
	var content = '';
	content += '<input id="'+name+'-yes" name="'+name+'" type="radio" value="1"/>';
	content += '<label id="label-'+name+'-yes" for="'+name+'-yes">'+parent.lang.yes+'</label>';
	content += '<input id="'+name+'-no" name="'+name+'" type="radio" value="0" style="margin-left: 10px;" checked/>';
	content += '<label id="label-'+name+'-no" for="'+name+'-no">'+parent.lang.no+'</label>';
	return content;
}

function isEditAlarmMotion() {
	return getUrlParameter("id") != "" ? true : false;
}

function initAlarmTree() {
	alarmTree = new dhtmlXTreeObject("alarmtype_tree", "100%", "100%", 0);
	alarmTree.enableCheckBoxes(1);
	alarmTree.enableThreeStateCheckboxes(true);
	alarmTree.setImagePath("../../js/dxtree/imgs/");
	
	//速度报警
	alarmTree.insertNewItem("0", "speendAlarm", parent.lang.monitor_alarm_speed, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("speendAlarm", "11", parent.lang.alarm_type_overspeed, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("speendAlarm", "14", parent.lang.alarm_type_overtimeParking, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//视频报警
	alarmTree.insertNewItem("0", "videoAlarm", parent.lang.monitor_alarm_video, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("videoAlarm", "15", parent.lang.alarm_type_motion, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("videoAlarm", "4", parent.lang.alarm_type_video_lost, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("videoAlarm", "5", parent.lang.alarm_type_video_mask, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//硬盘报警
	alarmTree.insertNewItem("0", "diskAlarm", parent.lang.monitor_alarm_disk, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
//	alarmTree.insertNewItem("diskAlarm", "39", parent.lang.monitor_alarm_disk1NoExist, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
//	alarmTree.insertNewItem("diskAlarm", "40", parent.lang.monitor_alarm_disk2NoExist, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("diskAlarm", "10", parent.lang.alarm_type_disk_error, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("diskAlarm", "157", parent.lang.alarm_type_highTemperature, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("diskAlarm", "162", parent.lang.alarm_type_defect_disk, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//故障报警
	alarmTree.insertNewItem("0", "faultAlarm", parent.lang.monitor_alarm_fault, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("faultAlarm", "45", parent.lang.monitor_alarm_GpsInvalid, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("faultAlarm", "18", parent.lang.alarm_type_gps_signal_loss, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("faultAlarm", "202", parent.lang.alarm_type_GNSSModuleFailure, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("faultAlarm", "203", parent.lang.alarm_type_GNSSAntennaMissedOrCut, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("faultAlarm", "204", parent.lang.alarm_type_GNSSAntennaShort, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("faultAlarm", "207", parent.lang.alarm_type_LCDorDisplayFailure, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("faultAlarm", "208", parent.lang.alarm_type_TTSModuleFailure, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("faultAlarm", "209", parent.lang.alarm_type_cameraMalfunction, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("faultAlarm", "215", parent.lang.alarm_type_VSSFailure, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//操作报警
	alarmTree.insertNewItem("0", "operateAlarm", parent.lang.monitor_alarm_operate, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("operateAlarm", "2", parent.lang.alarm_type_ungency_button, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("operateAlarm", "6", parent.lang.alarm_type_door_open_lawless, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//油量报警
	alarmTree.insertNewItem("0", "fuelAlarm", parent.lang.monitor_alarm_fuel, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("fuelAlarm", "46", parent.lang.alarm_type_add_oil, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fuelAlarm", "47", parent.lang.alarm_type_dec_oil, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fuelAlarm", "216", parent.lang.alarm_type_abnormalFuel, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//其它报警
	alarmTree.insertNewItem("0", "otherAlarm", parent.lang.monitor_alarm_otherAlarm, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
//	alarmTree.insertNewItem("otherAlarm", "113", parent.lang.alarm_type_custom_alarm, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "9", parent.lang.alarm_type_temperator, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "151", parent.lang.alarm_type_nightdriving, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "49", parent.lang.alarm_type_fatigue, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "153", parent.lang.alarm_type_gathering, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "155", parent.lang.alarm_type_upsCut, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "159", parent.lang.alarm_type_before_board_opened, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "166", parent.lang.alarm_type_sim_lost, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "7", parent.lang.alarm_type_erong_pwd, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "13", parent.lang.alarm_type_door_abnormal, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "3", parent.lang.alarm_type_shake, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "8", parent.lang.alarm_type_illegalIgnition, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "16", parent.lang.alarm_type_Acc_on, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "66", parent.lang.alarm_type_Acc_off, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "201", parent.lang.alarm_type_earlyWarning, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "205", parent.lang.alarm_type_mainSupplyUndervoltage, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "206", parent.lang.alarm_type_mainPowerFailure, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "210", parent.lang.alarm_type_cumulativeDayDrivingTimeout, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "217", parent.lang.alarm_type_antitheftDevice, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "218", parent.lang.alarm_type_illegalDisplacement, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("otherAlarm", "219", parent.lang.alarm_type_rollover, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//IO报警
	alarmTree.insertNewItem("0", "IOAlarm", parent.lang.alarm_type_io, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("IOAlarm", "19", parent.lang.alarm_type_io1, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "20", parent.lang.alarm_type_io2, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "21", parent.lang.alarm_type_io3, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "22", parent.lang.alarm_type_io4, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "23", parent.lang.alarm_type_io5, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "24", parent.lang.alarm_type_io6, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "25", parent.lang.alarm_type_io7, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "26", parent.lang.alarm_type_io8, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "41", parent.lang.alarm_type_io9, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "42", parent.lang.alarm_type_io10, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "43", parent.lang.alarm_type_io11, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("IOAlarm", "44", parent.lang.alarm_type_io12, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//围栏报警
	alarmTree.insertNewItem("0", "fenceAlarm", parent.lang.monitor_alarm_fence, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("fenceAlarm", "27", parent.lang.alarm_type_fence_in, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "28", parent.lang.alarm_type_fence_out, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "29", parent.lang.alarm_type_fence_in_overspeed, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "30", parent.lang.alarm_type_fence_out_overspeed, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "31", parent.lang.alarm_type_fence_in_lowspeed, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "32", parent.lang.alarm_type_fence_out_lowspeed, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "33", parent.lang.alarm_type_fence_in_stop, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "34", parent.lang.alarm_type_fence_out_stop, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "12", parent.lang.alarm_type_beyond_bounds, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "200", parent.lang.alarm_type_regionalSpeedingAlarm, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "211", parent.lang.alarm_type_outOfRegional, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "212", parent.lang.alarm_type_outOfLine, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "213", parent.lang.alarm_type_InadequateOrTooLongRoadTravelTime, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("fenceAlarm", "214", parent.lang.alarm_type_routeDeviation, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//平台报警
	alarmTree.insertNewItem("0", "platformAlarm", parent.lang.monitor_alarm_platform, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("platformAlarm", "300", parent.lang.alarm_type_areaOverSpeed_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "301", parent.lang.alarm_type_areaLowSpeed_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "302", parent.lang.alarm_type_areaInOut_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "303", parent.lang.alarm_type_lineInOut_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "304", parent.lang.alarm_type_overSpeed_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "305", parent.lang.alarm_type_lowSpeed_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "306", parent.lang.alarm_type_fatigue_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "307", parent.lang.alarm_type_parkTooLong_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "308", parent.lang.alarm_type_areaPoint_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "309", parent.lang.alarm_type_lineOverSpeed_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "310", parent.lang.alarm_type_lineLowSpeed_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("platformAlarm", "311", parent.lang.report_roadLvlOverSpeed_platform, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//上下线报警
//	alarmTree.insertNewItem("0", "loginAlarm", parent.lang.monitor_alarm_login, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
//	alarmTree.insertNewItem("loginAlarm", "17", parent.lang.alarm_type_device_online, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
//	alarmTree.insertNewItem("loginAlarm", "67", parent.lang.alarm_type_device_disOnline, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//关闭所有的节点
	alarmTree.closeAllItems();
}

//点击视频预览
function clickPreview() {
	var temp = $("input[name='preview']:checked").val();
	if (temp != "1") {
		$('#checkbox-previewAll').get(0).disabled = true;
		$('.td-previewChannel input').each(function() {
			this.disabled = true;
		});
		diableInput("#input-previewTime", true, true);
	} else {
		$("#checkbox-previewAll").get(0).disabled = false;
		$('.td-previewChannel input').each(function() {
			this.disabled = false;
		});
		diableInput("#input-previewTime", false, true);
	}
}

//点击警音提醒
function clickAlarmSound() {
	var temp = $("input[name='alarmSound']:checked").val();
	if (temp != "1") {
		$('#label-soundFile').get(0).disabled = true;
		$('.td-alarmSoundFile .y-btn').removeClass('y-btn-gray');
	} else {
		$("#label-soundFile").get(0).disabled = false;
		$('.td-alarmSoundFile .y-btn').addClass('y-btn-gray');
	}
}

//初始化音频选择
function initSelSoundFile() {
	//查询用户所有音频文件
	$.myajax.jsonPost("StandardAlarmMotionAction_getAudioList.action", null, false, function(json, success) {
		var files = [];
		if (success) {
			var audios = json.audios;
			for (var i = 0; i < audios.length; i++) {
				var audio = {};
				audio.id = audios[i].sds + '.mp3';
				audio.name = audios[i].sds + '.mp3';
				files.push(audio);
			}
		}
		$('.td-alarmSoundFile').flexPanel({
			ComBoboxModel :{
				button :
				[
					[{
						display: parent.lang.vehicle_alarmaction_selAudioFile, name : 'soundFile', pid : 'soundFile', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]
				],
				combox: {name : 'soundFile', option : arrayToStr(files)}
			}	
		});
		if(audioFile != null) {
			addAudioFile(audioFile, audioFile);
		}
		clickAlarmSound();
	});
}

function loadLang(){
	$("#labelAlarmSelect").text(parent.lang.vehicle_alarmaction_selectAlarm);
}

//加载页面信息
function loadPageInfo() {
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip: '',hide:false,tabshide: false, headhide: true},
				colgroup:{width:['120px','250px']},
				tabs:{
					display: [parent.lang.vehicle_alarmaction_labelVideoPreview, parent.lang.vehicle_alarmaction_previewChannelTitle, parent.lang.vehicle_alarmaction_previewTimeTitle,
					          parent.lang.vehicle_alarmaction_alarmSoundTitle, parent.lang.vehicle_alarmaction_labelAudioFile, parent.lang.vehicle_alarmaction_labelMapLocked,
					          parent.lang.vehicle_mapfence_labelTime, parent.lang.vehicle_alarmaction_isEnableTitle],
					name : ['preview', 'previewChannel', 'previewTime', 'alarmSound', 'alarmSoundFile', 'mapLocked', 'deployTime', 'isEnable'],
					type:['','','input'],
					length:[,,4]
				}
			}
		]
	});
	
	$('.td-previewTime').append('<span id="spanTipPreviewTime" class="red">'+ parent.lang.vehicle_alarmaction_recordingTime_time +'</span>');
	$('.td-previewTime').append('<span id="spanTipPreviewTime2" class="red" style="float:left;padding-top: 5px;">'+ parent.lang.vehicle_alarmaction_previewTimeTip +'</span>');
	$('.td-alarmSoundFile').append('<div id="manageAudio" style="float:left;margin: 5px 5px 0px 10px;"><span class="manage" title="'+parent.lang.manage+'"></span></div>');
	$('.td-mapLocked').append('<span id="spanTipMapLocked" class="red" style="margin-left:15px;">'+ parent.lang.vehicle_alarmaction_alarmCenterTip +'</span>');
	$('.td-isEnable').append('<span id="spanTipEnable" class="red" style="margin-left:15px;">'+ parent.lang.vehicle_alarmaction_enableTip +'</span>');
	$('.td-deployTime').append('<input id="beginTime" class="text Wdate" type="text" style="width:80px;" maxlength="32" value="" name="beginTime" readonly>');
	$('.td-deployTime').append('<span id="spanTimeTo">&nbsp;&nbsp;'+ parent.lang.vehicle_mapfence_timeTo +'&nbsp;&nbsp;</span>');
	$('.td-deployTime').append('<input id="endTime" class="text Wdate" type="text" style="width:80px;" maxlength="32" value="" name="endTime" readonly>');		
	$('.td-deployTime').append('<span id="spanTipTime" class="red" style="float:left;padding-top: 5px;">'+ parent.lang.vehicle_alarmaction_spanTipTime +'</span>');
	//初始化音频选择
	initSelSoundFile();
	//
	$('.td-preview').prepend(addRadio('preview'));
	$('.td-alarmSound').prepend(addRadio('alarmSound'));
	$('.td-mapLocked').prepend(addRadio('isLocked'));
	$('.td-isEnable').prepend(addRadio('isEnable'));
	$('.td-previewChannel').parent().find('th').append(addChnModule('previewAll',1));
	$('.td-previewChannel').append(addChnModule('preview',12));
	
	$('.td-preview input').on('click', clickPreview);
	$('.td-alarmSound input').on('click', clickAlarmSound);
	
	enterDigital("#input-previewTime");
	
	//时间参数
	$("#beginTime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'}) });
	$("#endTime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'}) });
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.save, name : '', pclass : 'btnSave',
				bgcolor : 'gray', hide : false}]
		]
	});
	
	$('.btnSave').on('click', ajaxSetupAlarmAction);

	//全选和反选
	$('.previewAll').on('click',function() {
		var value = $("input[name='previewAll']:checked").val();
		if(value != null && value != '' && value == 1) {
			$('.td-previewChannel .preview').find('input').each(function(i) {
				$('#checkbox-preview'+parseIntDecimal(i+1)).get(0).checked = true;
			});
		}else {
			$('.td-previewChannel .preview').find('input').each(function(i) {
				$('#checkbox-preview'+parseIntDecimal(i+1)).get(0).checked = false;
			});
		}
	});

	$('.td-previewChannel .preview').find('input').each(function() {
		$(this).on('click',function() {
			if(this.checked) {
				var flag = true;
				$('.td-previewChannel .preview').find('input').each(function() {
					if(!this.checked) {
						flag = false;
					}
				});
				if(flag) {
					$('.checkbox-previewAll').get(0).checked = true;
				}else {
					$('.checkbox-previewAll').get(0).checked = false;
				}
			}else {
				$('.checkbox-previewAll').get(0).checked = false;
			}
		});
	});
	
	//管理音频文件
	$('#manageAudio').on('click', manageAudio);
}

//打开管理音频文件页面
function manageAudio() {
	//将警音提醒置为有效
	$('#alarmSound-yes').get(0).checked = true;
	$("#label-soundFile").get(0).checked = false;
	$('.td-alarmSoundFile .y-btn').addClass('y-btn-gray');
	//打开管理界面
	$.dialog({id:'audio', title:parent.lang.manage +'&nbsp&nbsp&nbsp&nbsp'+parent.lang.vehicle_alarmaction_audioFile ,content: 'url:LocationManagement/alarmAudio.html',
		width:'800px',height:'530px', min:false, max:false, lock:true, parent: api});
}

function doSelSuccess(id, name) {
	audioFile = name;
	addAudioFile(audioFile, audioFile);
	$.dialog({id:'audio'}).close();
}


//赋值音频文件列表
function addAudioFile(id, audioFile) {
	$('#label-soundFile').text(audioFile);
	$('#label-soundFile').attr('title', audioFile);
	$('#hidden-soundFile').val(id);
}

function ajaxLoadAlarmMotion() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("StandardAlarmMotionAction_get.action?id=" + getUrlParameter("id"), function(json,action,success){
		if (success) {
			//录像
			if (json.motion.ird != null && json.motion.ird == 1) {
				$("input[name='preview']").get(0).checked = true;
				var rch = Number(json.motion.rch);
				if(rch == -1) {
					$('#checkbox-previewAll').get(0).checked = true;
					for (var i = 0; i < 12; i++) {
						$('#checkbox-preview'+(i+1)).get(0).checked = true;
					}
				}else {
					for (var i = 0; i < 12; i++) {
						if((rch>>i)&1 > 0) {
							$('#checkbox-preview'+(i+1)).get(0).checked = true;
						}
					}
				}
				$("#input-previewTime").val(json.motion.rtm);
			}
			clickPreview();
			//声音
			if (json.motion.sd != null && json.motion.sd == 1) {
				$("input[name='alarmSound']").get(0).checked = true;
				
				audioFile = json.motion.sds + '.mp3';
				addAudioFile(audioFile, audioFile);
			}
			clickAlarmSound();
			//布防时间
			if(json.motion.btm != null && json.motion.etm != null) {
				var btms = json.motion.btm.toString().split(',');
				var etms = json.motion.etm.toString().split(',');
				$("#beginTime").val(second2ShortHourEx(btms[0]));
				$("#endTime").val(second2ShortHourEx(etms[0]));
			}
			//电子地图锁定
			if(json.motion.sam != null && json.motion.sam == 1) {
				$("input[name='isLocked']").get(0).checked = true;
			}
			//启用
			if(json.motion.enb != null && json.motion.enb == 1) {
				$("input[name='isEnable']").get(0).checked = true;
			}
			
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function checkParam() {
	//判断预览时间
	var temp = $("input[name='preview']:checked").val();
	if (temp == "1") {
		var previewTime = $.trim($("#input-previewTime").val());
		if(parseIntDecimal(previewTime) != 0 && (previewTime == "" || parseIntDecimal(previewTime) > 1800 || parseIntDecimal(previewTime) < 30)) {
			$.dialog.tips(parent.lang.vehicle_alarmaction_previewTimeError, 1);
			$("#input-previewTime").focus();
			return false;
		}
	}
	
	//判断时间
	var begin = shortHour2Second($.trim($("#beginTime").val()));
	var end = shortHour2Second($.trim($("#endTime").val()));
	if (begin > end) {
		$.dialog.tips(parent.lang.vehicle_alarmaction_timeunvalid, 1);
		$("#beginTime1").focus();
		return false;
	}
	return true;
}

function ajaxSetupAlarmAction() {
	var data={};
	if (!isEditAlarmMotion()) {
		//获取报警类型
		var armtypes = alarmTree.getAllChecked().split(",");
		var selArmType = [];
		for (var i = 0; i < armtypes.length; i = i + 1) {
			if (armtypes[i] != '' && !isNaN(armtypes[i]) ) {
				selArmType.push(armtypes[i]);
			}
		}
		if (selArmType.length <= 0) {
			$.dialog.tips(parent.lang.alarm_type_tip_select, 1);
			return ;
		}
		data.slatp = selArmType.toString();
	} 
	
	//判断参数是否正确
	if (!checkParam()) {
		return ;
	}
	//视频预览
	data.ird = $("input[name='preview']:checked").val();
	if(data.ird == "1") {
		var previewChn = "";
		$('.td-previewChannel .preview').find('input').each(function(i) {
			var name = $.trim($(this).attr('name'));
			var value = $.trim($("input[name='"+name+"']:checked").val());
			if(value != null && value != '') {
				previewChn = value + previewChn;
			}else {
				previewChn = '0' + previewChn;
			}
		});
		if(previewChn == '111111111111') {
			previewChn = -1;
		}else {
			previewChn = parseInt(previewChn,2);
		}
		if(previewChn == 0) {
			$.dialog.tips(parent.lang.vehicle_alarmaction_previewChnunvalid, 1);
			return ;
		}
		data.rch = previewChn;//通道
		data.rtm = $.trim($("#input-previewTime").val());
	}
	//警音提醒
	data.sd = $("input[name='alarmSound']:checked").val();
	if(data.sd == 1) {
		var sds = $.trim($('#hidden-soundFile').val());
		if(sds == '') {
			$.dialog.tips(parent.lang.vehicle_alarmaction_audioFileNotNull, 1);
			return;
		}
		data.sds = sds.toString().split('.')[0];
	}
	data.btm = shortHour2Second($.trim($("#beginTime").val()));
	data.etm = shortHour2Second($.trim($("#endTime").val()));
	//电子地图锁定
	data.sam = $("input[name='isLocked']:checked").val();
	//是否启用
	data.enb = $("input[name='isEnable']:checked").val();
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action = 'StandardAlarmMotionAction_save.action';
	if(isEditAlarmMotion()) {
		action = 'StandardAlarmMotionAction_edit.action?id=' + getUrlParameter("id");
		data.id = getUrlParameter("id");
		data.vid = getUrlParameter("vehiIdno");
		data.atp = getUrlParameter("armType");
	}
	
	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			if (!isEditAlarmMotion()) {
				W.doSaveAlarmMotionSuc();
			} else {
				W.doEditAlarmMotionSuc(data);
			}
		}
	});
}

//新增音频文件刷新音频文件列表
function refreshAddAudioFile(name) {
	var li = document.createElement('li');
	li.className = 'ui-menu-item';
	$(li).attr('data-index', name);
	$(li).append('<span title="'+name+'" class="text">'+name+'</span>');
	$(li).on('click',function() {
		addAudioFile(name, name);
		$('#select-soundFile').hide();
	});
	$('#select-soundFile ul').append(li);
}

//删除音频文件刷新联动列表
function refreshAlarmMotion(name) {
	//更新选择音频文件列表
	$('#select-soundFile li').each(function() {
		if($.trim($(this).attr('data-index')) == name) {
			$(this).remove();
			if($.trim($('#hidden-soundFile').val()) == name) {
				addAudioFile('', parent.lang.vehicle_alarmaction_selAudioFile);
			}
		}
	});
	//刷新报警联动信息
	W.refreshAlarmMotion();
}