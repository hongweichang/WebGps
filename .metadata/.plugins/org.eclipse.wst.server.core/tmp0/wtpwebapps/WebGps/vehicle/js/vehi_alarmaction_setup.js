var api = frameElement.api, W = api.opener;
var vehiTree;
var searchTimer = null;
var alarmTree = null;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//初始化报警类型树
	initAlarmTree();
	//添加所有车辆  跟结点
	if (isEditAlarmAction()) {
		$("#devList").hide();
		$("#alarmSelect").hide();
		$("#actionContent").css("margin-left","0px"); 
		$("#content").width(480);
		ajaxLoadAlarmAction();
	} else {
		//加载车辆树
		//生成权限树
		vehiTree = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
		vehiTree.enableCheckBoxes(1);
		vehiTree.enableThreeStateCheckboxes(true);
		vehiTree.setImagePath("../js/dxtree/imgs/");
		vehiTree.fillGroup(parent.vehiGroupList);
		vehiTree.fillVehicle(parent.vehicleList);
		vehiTree.setOnClickHandler(vehiTreeClickEvent);				//设置click点击事件
		//生成报警类型
		$("#beginTime").val("00:00:00");
		$("#endTime").val("23:59:59");
		clickSmsSend();
		clickEmailSend();
	}	
	restrictionsDigital("#recordingTime");
	//时间参数
	$("#beginTime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'}) });
	$("#endTime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'}) });
}); 

function isEditAlarmAction() {
	return getUrlParameter("id") != "" ? true : false;
}

function loadLang(){
	$("#labelSearch").text(parent.lang.vehicle_group_labelSearchVehi);
	$("#labelAlarmSelect").text(parent.lang.vehicle_alarmaction_selectAlarm);
	$("#spanSmsSend").text(parent.lang.vehicle_alarmaction_smsSend);
	$("#labelSmsAddress").text(parent.lang.vehicle_alarmaction_labelSmsAddress);
	$("#spanTipSmsAddress").text(parent.lang.vehicle_alarmaction_spanTipSmsAddress);
	$("#labelSmsContent").text(parent.lang.vehicle_alarmaction_labelSmsContent);
	$("#spanTipSmsContent").text(parent.lang.vehicle_alarmaction_spanTipSmsContent);
	$("#spanEmailSend").text(parent.lang.vehicle_alarmaction_emailSend);
	$("#labelEmailAddress").text(parent.lang.vehicle_alarmaction_labelEmailAddress);
	$("#spanTipEmailAddress").text(parent.lang.vehicle_alarmaction_spanTipEmailAddress);
	$("#spanTipTime").text(parent.lang.vehicle_alarmaction_spanTipTime);
	$("#labelCaptureChannel").text(parent.lang.vehicle_alarmaction_captureChannelTitle);
	$("#spanCaptureChannel").text(parent.lang.vehicle_alarmaction_isNotCapture);
	$("#labelRecordingTime").text(parent.lang.vehicle_alarmaction_recordingTimeTitle);
	$("#spanTipRecordingTime").text(parent.lang.vehicle_alarmaction_recordingTime_time);
	$("#labelAlarmSubType").text(parent.lang.vehicle_alarmaction_labelAlarmSubType);
	$("#spanTipAlarmSubType").text(parent.lang.vehicle_alarmaction_alarmSubTypeTip);
	
	$("#labelEmailContent").text(parent.lang.vehicle_alarmaction_labelEmailContent);
	$("#spanTipEmailContent").text(parent.lang.vehicle_alarmaction_spanTipEmailContent);
	
	$("#labelTime").text(parent.lang.vehicle_mapfence_labelTime);
	$("#spanTimeTo").text(parent.lang.vehicle_mapfence_timeTo);
	$("#spanTimeTip").text(parent.lang.vehicle_mapfence_timeTip);
	$("#save").text(parent.lang.save);
}

function initAlarmTree() {
	alarmTree = new dhtmlXTreeObject("alarmtype_tree", "100%", "100%", 0);
	alarmTree.enableCheckBoxes(1);
	alarmTree.enableThreeStateCheckboxes(true);
	alarmTree.setImagePath("../js/dxtree/imgs/");
	alarmTree.setOnCheckHandler(doCheckTreeAlarm); //选中事件
	alarmTree.insertNewItem("0", "alarm", parent.lang.alarm_type_all, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT'); 
	alarmTree.insertNewItem("alarm", "2", parent.lang.alarm_type_ungency_button, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "3", parent.lang.alarm_type_shake, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "4", parent.lang.alarm_type_video_lost, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "6", parent.lang.alarm_type_door_open_lawless, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "9", parent.lang.alarm_type_temperator, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "10", parent.lang.alarm_type_disk_error, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "11", parent.lang.alarm_type_overspeed, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "14", parent.lang.alarm_type_park_too_long, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "15", parent.lang.alarm_type_motion, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "18", parent.lang.alarm_type_gps_signal_loss, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "67", parent.lang.alarm_type_offline, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	
	alarmTree.insertNewItem("alarm", "27", parent.lang.alarm_type_fence_in, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "28", parent.lang.alarm_type_fence_out, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "29", parent.lang.alarm_type_fence_in_overspeed, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "30", parent.lang.alarm_type_fence_out_overspeed, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "31", parent.lang.alarm_type_fence_in_lowspeed, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "32", parent.lang.alarm_type_fence_out_lowspeed, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "33", parent.lang.alarm_type_fence_in_stop, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "34", parent.lang.alarm_type_fence_out_stop, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');

	alarmTree.insertNewItem("alarm", "19", parent.lang.alarm_type_io1, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "20", parent.lang.alarm_type_io2, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "21", parent.lang.alarm_type_io3, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "22", parent.lang.alarm_type_io4, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "23", parent.lang.alarm_type_io5, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "24", parent.lang.alarm_type_io6, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "25", parent.lang.alarm_type_io7, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "26", parent.lang.alarm_type_io8, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "41", parent.lang.alarm_type_io9, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "42", parent.lang.alarm_type_io10, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "43", parent.lang.alarm_type_io11, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "44", parent.lang.alarm_type_io12, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	alarmTree.insertNewItem("alarm", "113", parent.lang.alarm_type_custom, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	
}

function doCheckTreeAlarm(itemId,check) {
	//check为选中状态  1 选中
	//选中 自定义报警
	if(itemId != null && itemId == '113') {
		if(check) {
			$('#labelAlarmSubType').parent().removeClass('hide').addClass('show');
			$('#spanTipAlarmSubType').parent().removeClass('hide').addClass('show');
		}else {
			$('#labelAlarmSubType').parent().removeClass('show').addClass('hide');
			$('#spanTipAlarmSubType').parent().removeClass('show').addClass('hide');
		}
	}
}

function vehiTreeClickEvent(id) {
	if (!vehiTree.isGroupItem(id)) {
		var i = 0;
		for (i = 0; i < 8; ++ i) {
			alarmTree.setItemText( 19 + i, gpsGetVehicleIoinName(id, i));
		}
		for (i = 0; i < 4; ++ i) {
			alarmTree.setItemText( 41 + i, gpsGetVehicleIoinName(id, i + 8));
		}
	}
}

function searchVehicle() {
	if (searchTimer == null) {
		searchTimer = setTimeout(function() {
			var name = $.trim($("#name").val());
			if (name !== "") {
				vehiTree.searchVehicle(name);
			}
			searchTimer = null;
		}, 200);
	}
}

function disableForm(disable) {
	if (!disable) {
		clickSmsSend();
		clickEmailSend();
	} else {
		diableInput("#emailAddress", disable, true);
		diableInput("#smsAddress", disable, true);
		diableInput("#smsContent", disable, true);
		diableInput("#emailContent", disable, true);
	}	
	
	diableInput("#beginTime", disable, true);
	diableInput("#endTime", disable, true);
	diableInput("#save", disable, true);
}

function ajaxLoadAlarmAction() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("VehiAlarmActionAction_get.action?id=" + getUrlParameter("id"), function(json,action,success){
		if (success) {
			if (json.action.smsSend != null && json.action.smsSend == 1) {
				$("input[name='smsSend']").get(0).checked = true;
				$("#smsAddress").val(json.action.smsAddress);
				$("#smsContent").val(json.action.smsContent);
			}
			
			if (json.action.emailSend != null && json.action.emailSend == 1) {
				$("input[name='emailSend']").get(0).checked = true;
				$("#emailAddress").val(json.action.emailAddress);
				$("#emailContent").val(json.action.emailContent);
			}
			
			if(json.action.captureChannel != null) {
				if(json.action.captureChannel.split("|")[0] != "") {
					$("input[name='captureChannel']").get(0).checked = true;
				}
			}
			if(json.action.recordingTime != null) {
				var recordingTime = json.action.recordingTime.split("|");
				if(recordingTime[0] != "") {
					$("#recordingTime").val(recordingTime[0]);
				}
			}
			clickSmsSend();
			clickEmailSend();
			$("#beginTime").val(second2ShortHourEx(json.action.beginTime));
			$("#endTime").val(second2ShortHourEx(json.action.endTime));
			if(json.action.armType == 113) {
				$('#labelAlarmSubType').parent().removeClass('hide').addClass('show');
				$('#spanTipAlarmSubType').parent().removeClass('hide').addClass('show');
				if(json.action.armSubType != null) {
					$('#alarmSubType').val(json.action.armSubType);
				}
			}
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function checkParam() {	
	var temp = $("input[name='smsSend']:checked").val();
	//判断短信
	if (temp == "1") {
		var smsAddress = $.trim($("#smsAddress").val());
		var smsNo = smsAddress.split(";");
		if (smsAddress == "" || smsNo.length == 0) {
			alert(parent.lang.vehicle_alarmaction_smsAddressEmpty);
			return false;
		}
		for (var i = 0; i < smsNo.length; ++ i) {
			if ( isNaN(smsNo[i]) ) {
				alert(parent.lang.vehicle_alarmaction_smsAddressUnvalid);
				return false;
			}
		}
	}
	//判断邮件内容
	temp = $("input[name='emailSend']:checked").val();
	if (temp == "1") {
		var emailAddress = $.trim($("#emailAddress").val());
		var emailNo = emailAddress.split(";");
		if (emailAddress == "" || emailNo.length == 0) {
			alert(parent.lang.vehicle_alarmaction_emailAddressEmpty);
			return false;
		}
		for (var i = 0; i < emailNo.length; ++ i) {
			var sReg = /[_a-zA-Z\d\-\.]+@[_a-zA-Z\d\-]+(\.[_a-zA-Z\d\-]+)+$/;
			if (!sReg.test(emailNo[i])) {
				alert(parent.lang.vehicle_alarmaction_emailAddressUnvalid);
				return false;
			}
		}
	}
	
	//判断时间
	var begin = shortHour2Second($.trim($("#beginTime").val()));
	var end = shortHour2Second($.trim($("#endTime").val()));
	if (begin > end) {
		alert(parent.lang.vehicle_downplan_timeunvalid);
		$("#beginTime").focus();
		return false;
	}
	
	//判断录像时间
	var recordingTime = $.trim($("#recordingTime").val());
	if(recordingTime != "" && (parseInt(recordingTime) > 1800 || parseInt(recordingTime) < 30)) {
		alert(parent.lang.vehicle_alarmaction_recordingTimeError);
		$("#recordingTime").focus();
		return false;
	}

	//判断自定义报警子类型  输入框显示则表示选择了自定义报警
	if($('#spanTipAlarmSubType').parent().hasClass('show')) {
		var armSubType = $.trim($("#alarmSubType").val());
		var armNo = armSubType.split(",");
		if (armSubType == "" || armNo.length == 0) {
			alert(parent.lang.vehicle_alarmaction_alarmSubTypeEmpty);
			return false;
		}
		for (var i = 0; i < armNo.length; ++ i) {
			if ( isNaN(armNo[i]) ) {
				alert(parent.lang.vehicle_alarmaction_alarmSubTypeUnvalid);
				return false;
			}
		}
	}
	return true;
}

function clickSmsSend() {
	var temp = $("input[name='smsSend']:checked").val();
	if (temp != "1") {
		diableInput("#smsAddress", true, true);
		diableInput("#smsContent", true, true);
	} else {
		diableInput("#smsAddress", false, true);
		diableInput("#smsContent", false, true);
	}
}

function clickEmailSend() {
	var temp = $("input[name='emailSend']:checked").val();
	if (temp != "1") {
		diableInput("#emailAddress", true, true);
		diableInput("#emailContent", true, true);
	} else {
		diableInput("#emailAddress", false, true);
		diableInput("#emailContent", false, true);
	}
}

function ajaxSetupAlarmAction() {
	//判断车辆信息
	var data={};
	var vehicles = null;
	if (!isEditAlarmAction()) {
		//判断是否选择车辆信息
		vehicles = vehiTree.getCheckedVehi();
		if (vehicles.length <= 0) {
			alert(parent.lang.report_selectVehiNullErr);
			return ;
		}
		data.devIdno = vehicles.toString();
	}
	
	if (!isEditAlarmAction()) {
		//获取报警类型
		var armtypes = alarmTree.getAllChecked().split(",");
		var selArmType = [];
		for (var i = 0; i < armtypes.length; i = i + 1) {
			if (armtypes[i] != "" && armtypes[i] != "alarm") {
				selArmType.push(armtypes[i]);
			}
		}
		if (selArmType.length <= 0) {
			alert(parent.lang.alarm_type_tip_select);
			return ;
		}
		data.selArmTypes = selArmType.toString();
	} 
	
	//判断参数是否正确
	if (!checkParam()) {
		return ;
	}
	
	data.smsSend = $("input[name='smsSend']:checked").val();
	data.smsContent = $.trim($("#smsContent").val());
	data.smsAddress = $.trim($("#smsAddress").val());
	data.emailSend = $("input[name='emailSend']:checked").val();
	data.emailAddress = $.trim($("#emailAddress").val());
	data.emailContent = $.trim($("#emailContent").val());
	data.beginTime = shortHour2Second($.trim($("#beginTime").val()));
	data.endTime = shortHour2Second($.trim($("#endTime").val()));
	data.captureChannel = $("input[name='captureChannel']:checked").val();
	data.recordingTime = $.trim($("#recordingTime").val());
	data.armSubType = $.trim($('#alarmSubType').val());
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action = 'VehiAlarmActionAction_save.action';
	if(isEditAlarmAction()) {
		action = 'VehiAlarmActionAction_edit.action?id=' + getUrlParameter("id");
	}
	
	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			if (!isEditAlarmAction()) {
				W.doSetupAlarmActionSuc();
			} else {
				W.doEditAlarmActionSuc(getUrlParameter("id"), data);
			}
		}
	});
}

//限制输入数字
function restrictionsDigital(mid) {
	$(mid).on('input propertychange',function() {
		var isNum = /^[0-9]*$/;
		var value = $.trim($(this).val());
		if(!isNum.test(value)) {
			$(this).val(value.substring(0,value.length-1));
		}
	});
}