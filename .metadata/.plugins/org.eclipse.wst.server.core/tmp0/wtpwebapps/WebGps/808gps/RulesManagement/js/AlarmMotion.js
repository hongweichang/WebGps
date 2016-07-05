var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var ruleType = getUrlParameter('ruleType');
var alarmTree = null; //报警树
$(document).ready(function(){
	setTimeout(loadReadyPage, 50);
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}
function loadPage(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;

	$('#toolbar-btn').flexPanel({
		ButtonsModel : getButtonArray(type) 
	});

	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip: '',hide:false,tabshide:false},
				colgroup:{width:['120px','250px']},
				tabs:{
					display: [parent.lang.rule_name,parent.lang.vehicle_alarmaction_labelAlarmSubType,parent.lang.rule_timeRange,parent.lang.rule_voiceAlarm],
					name : ['ruleName','alarmSubType','beginTime','voice'],
					type:['input','input','input','textArea'],
					length:[40,,10]
				}
			},{
				title :{display: parent.lang.rule_cameraAndVideo,pid : 'required-camera',tip:'',hide:false,tabshide:false},
				colgroup:{width:['120px','250px']},
				tabs:{
					display: [parent.lang.rule_isCamera,parent.lang.rule_cameraWebcam,parent.lang.rule_videoTime,parent.lang.rule_videoWebcam],
					name : ['camera','cameraWebcam','video','videoWebcam'],
					type:['','','input',''],
					length:[,,4]
				}
			},{
				title :{display: parent.lang.rule_messageAndMail,pid : 'required-phone',tip: '*',hide:false,tabshide:true},
				colgroup:{width:['120px','250px']},
				tabs:{
					display: [parent.lang.rule_phone,parent.lang.rule_mail],
					name : ['phone','mail'],
					type:['textArea','textArea'],
					length:[]
				}
			}
		]
	});
	//加载页面属性
	loadRuleParam();
	$('.td-alarmSubType').parent().addClass('hide');
	if(type == 'add') {
		//初始化报警类型树
		initAlarmTree();
		$("#labelAlarmSelect").text(parent.lang.vehicle_alarmaction_selectAlarm);
	}else {
		$('#alarmSelect').hide();
	}
	
	//加载用户信息
	ajaxLoadRuleInfo();
	
	$('body').click(function() {
		checkVideoTime();
	});
	$('.submit','#toolbar-btn').on('click',saveRule);
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'ruleinfo'}).close();
	});
	$('.reset','#toolbar-btn').on('click',function(){
		var url = 'RulesManagement/FatigueInfo.html?id='+getUrlParameter('id')+'&type='+type+'&ruleType='+ruleType;
		if(type == 'edit') {
			url += '&id='+getUrlParameter('id');
		}
		$('.ui_dialog',parent.document).find('iframe').attr('src',url);
	});
}

function initAlarmTree() {
	alarmTree = new dhtmlXTreeObject("alarmtype_tree", "100%", "100%", 0);
	alarmTree.enableCheckBoxes(1);
	alarmTree.enableThreeStateCheckboxes(true);
	alarmTree.setImagePath("../../js/dxtree/imgs/");
//	alarmTree.setOnCheckHandler(doCheckTreeAlarm); //选中事件
	
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
	alarmTree.insertNewItem("diskAlarm", "39", parent.lang.monitor_alarm_disk1NoExist, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("diskAlarm", "40", parent.lang.monitor_alarm_disk2NoExist, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
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
	alarmTree.insertNewItem("otherAlarm", "113", parent.lang.alarm_type_custom_alarm, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
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
	//上下线报警
	alarmTree.insertNewItem("0", "loginAlarm", parent.lang.monitor_alarm_login, 0, "group.gif", "group.gif", "group.gif", 'SELECT'); 
	alarmTree.insertNewItem("loginAlarm", "17", parent.lang.alarm_type_device_online, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	alarmTree.insertNewItem("loginAlarm", "67", parent.lang.alarm_type_device_disOnline, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//关闭所有的节点
	alarmTree.closeAllItems();
}

function doCheckTreeAlarm(itemId,check) {
	//check为选中状态  1 选中
	//选中 自定义报警
	if(itemId != null && itemId == '113') {
		if(check) {
			$('.td-alarmSubType').parent().removeClass('hide').addClass('show');
		}else {
			$('.td-alarmSubType').parent().removeClass('show').addClass('hide');
		}
	}
}

function ajaxLoadRuleInfo() {
	if(type == 'add') {
		loadRuleInfo();
	}else {
		var action = 'StandardVehicleRuleAction_findVehicleRule.action?id='+getUrlParameter('id');
		disableForm(true);
		$.myajax.showLoading(true, parent.lang.loading, this);
		$.myajax.jsonGetEx(action, function(json,action,success){
			if (success) {
				if (!$.isEmptyObject(json.rule)) {
					loadRuleInfo(json.rule);
				}
			}
			$.myajax.showLoading(false);
			disableForm(false);
		});
	}
}

function loadRuleInfo(params) {
	if(type == 'add') {
		$("#input-beginTime").val("00:00:00");
		$("#input-endTime").val("23:59:59");
		$('#camera-no').get(0).checked = true;
		$('#input-video').val(0);
	}else {
		if(type != 'edit') {
			$('#info-mid-table input,#info-mid-table textarea').each(function(){
				this.disabled = true;
			});
		}
		$('#input-ruleName').val(params.name);
		if(params.beginTime != null) {
			$("#input-beginTime").val(second2ShortHourEx(params.beginTime));
		}else {
			$("#input-beginTime").val("00:00:00");
		}
		if(params.endTime != null) {
			$("#input-endTime").val(second2ShortHourEx(params.endTime));
		}else {
			$("#input-endTime").val("23:59:59");
		}
		
		if(params.param) {
			var param = params.param.split(',');
			if(param[0] && param[0] == 1) {
				$('#camera-yes').get(0).checked = true;
			}else {
				$('#camera-no').get(0).checked = true;
			}
			if(param[1] != null) {
				var index = 0;
				$('.td-cameraWebcam .camera').find('input').each(function(i) {
					if(param[1].substring(i, i+1) == 1) {
						$('#checkbox-camera'+Number(i+1)).get(0).checked = true;
						index ++;
					}
				});
				if(index == 8) {
					$('#checkbox-cameraAll').get(0).checked = true;
				}
			}
			if(param[2]) {
				$('#input-video').val(param[2]);
			}else {
				$('#input-video').val(0);
			}
			if(param[3] != null) {
				var index = 0;
				$('.td-videoWebcam .video').find('input').each(function(i) {
					if(param[3].substring(i, i+1) == 1) {
						$('#checkbox-video'+Number(i+1)).get(0).checked = true;
						index ++;
					}
				});
				if(index == 8) {
					$('#checkbox-videoAll').get(0).checked = true;
				}
			}
			if(param[4]) {
				$('#textArea-phone').val(param[4]);
			}
			if(param[5]) {
				$('#textArea-mail').val(param[5]);
			}
		}
		$('#textArea-voice').val(params.text);
	}
}

function checkRuleParam() {
	var flag = true;
	checkVideoTime();
	if($('#input-ruleName').val() == null || $('#input-ruleName').val() == '') {
		$('#required-area .panel-body').addClass('show');
		$('#input-ruleName').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_nameNotNull, 2);
	}
	return flag;
}

function saveRule() {
    if(!checkRuleParam()) {
		return;
	}
	var data = {};
	if(type == 'edit') {
		data.id = $.trim(getUrlParameter('id'));
	}else if(type == 'add'){
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
			return;
		}
		data.selatp = selArmType.toString();
	}
	data.name = $.trim($('#input-ruleName').val());
	data.type = $.trim(ruleType);
	data.param = '';
	//保存规则属性
	ajaxSaveRule(data);
}

