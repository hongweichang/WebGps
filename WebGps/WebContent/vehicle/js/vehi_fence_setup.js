var api = frameElement.api, W = api.opener;
var vehiTree;
var searchTimer = null;
var markerList = null;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	if (isEditFence()) {
		$("#devList").hide();
		$("#fenceContent").css("margin-left","0px"); 
		$("#content").width(440); 
		diableInput("#markerList", true, true);
		ajaxLoadFence();
	} else {
		//加载车辆树
		//生成权限树
		vehiTree = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
		vehiTree.enableCheckBoxes(1);
		vehiTree.enableThreeStateCheckboxes(true);
		vehiTree.setImagePath("../js/dxtree/imgs/");
		vehiTree.fillGroup(parent.vehiGroupList);
		vehiTree.fillVehicle(parent.vehicleList);
		//加载区域信息
		ajaxLoadMarker();
		//初始化选择
		$("input[name='accessAlarm']").get(0).checked = true;
		$("input[name='speedAlarm']").get(0).checked = true;
		$("input[name='parkAlarm']").get(0).checked = true;
		//
		$("#speedHigh").val(0);
		$("#speedLow").val(0);
		$("#speedHighWarn").val(0);
		$("#speedLowWarn").val(0);
		$("#parkTime").val(60);
		$("#beginTime").val("00:00:00");
		$("#endTime").val("23:59:59");
		clickSpeedAlarm();
		clickParkAlarm();
	}
	//时间参数
	$("#beginTime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'}) });
	$("#endTime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'}) });
}); 

function isEditFence() {
	return getUrlParameter("id") != "" ? true : false;
}

function loadLang(){
	$("#labelSearch").text(parent.lang.vehicle_group_labelSearchVehi);
	$("#labelMarker").text(parent.lang.vehicle_mapfence_labelMarker);
	$("#labelAccessAlarm").text(parent.lang.vehicle_mapfence_labelAccess);
	$("#labelSpeedAlarm").text(parent.lang.vehicle_mapfence_labelSpeed);
	$("#labelSpeedHigh").text(parent.lang.vehicle_mapfence_labelSpeedHigh);
	$("#spanSpeedHighUnit").text(gpsGetSpeedUnit() + parent.lang.vehicle_mapfence_speedTip);
	$("#labelSpeedHighTts").text(parent.lang.vehicle_mapfence_labelSpeedHighTts);
	
	$("#labelSpeedHighWarn").text(parent.lang.vehicle_mapfence_labelSpeedHighWarn);
	$("#spanSpeedHighWarnUnit").text(gpsGetSpeedUnit() + parent.lang.vehicle_mapfence_speedTip);
	$("#labelSpeedHighWarnTts").text(parent.lang.vehicle_mapfence_labelSpeedHighWarnTts);
	
	$("#labelSpeedLow").text(parent.lang.vehicle_mapfence_labelSpeedLow);
	$("#spanSpeedLowUnit").text(gpsGetSpeedUnit() + parent.lang.vehicle_mapfence_speedTip);
	$("#labelSpeedLowTts").text(parent.lang.vehicle_mapfence_labelSpeedLowTts);
	
	$("#labelParkAlarm").text(parent.lang.vehicle_mapfence_labelParkAlarm);
	$("#labelParkTime").text(parent.lang.vehicle_mapfence_labelParkTime);
	$("#parkTimeUnit").text(parent.lang.vehicle_mapfence_parkTimeUnit);
	$("#labelTime").text(parent.lang.vehicle_mapfence_labelTime);
	$("#spanTimeTo").text(parent.lang.vehicle_mapfence_timeTo);
	$("#spanTimeTip").text(parent.lang.vehicle_mapfence_timeTip);
	$("#save").text(parent.lang.save);
	$("#spanAccessNone").text(parent.lang.vehicle_mapfence_none);
	$("#spanAccessIn").text(parent.lang.vehicle_mapfence_in);
	$("#spanAccessOut").text(parent.lang.vehicle_mapfence_out);
	$("#spanSpeedNone").text(parent.lang.vehicle_mapfence_none);
	$("#spanSpeedIn").text(parent.lang.vehicle_mapfence_in);
	$("#spanSpeedOut").text(parent.lang.vehicle_mapfence_out);
	$("#spanParkNone").text(parent.lang.vehicle_mapfence_none);
	$("#spanParkIn").text(parent.lang.vehicle_mapfence_in);
	$("#spanParkOut").text(parent.lang.vehicle_mapfence_out);
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
	if (!isEditFence()) {
		diableInput("#markList", disable, true);
	}
	diableInput("#accessAlarm_0", disable, true);
	diableInput("#accessAlarm_1", disable, true);
	diableInput("#accessAlarm_2", disable, true);
	diableInput("#speedAlarm_0", disable, true);
	diableInput("#speedAlarm_1", disable, true);
	diableInput("#speedAlarm_2", disable, true);
	diableInput("#parkAlarm_0", disable, true);
	diableInput("#parkAlarm_1", disable, true);
	diableInput("#parkAlarm_2", disable, true);
	if (!disable) {
		clickSpeedAlarm();
		clickParkAlarm();
	} else {
		diableInput("#speedHigh", disable, true);
		diableInput("#speedHighTts", disable, true);
		diableInput("#speedHighWarn", disable, true);
		diableInput("#speedHighWarnTts", disable, true);
		
		diableInput("#speedLow", disable, true);
		diableInput("#speedLowTts", disable, true);
		//diableInput("#speedLowWarn", disable, true);
		//diableInput("#speedLowWarnTts", disable, true);
		
		diableInput("#parkTime", disable, true);
	}	
	diableInput("#beginTime", disable, true);
	diableInput("#endTime", disable, true);
	diableInput("#save", disable, true);
}

function ajaxLoadFence() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("VehiFenceAction_get.action?id=" + getUrlParameter("id"), function(json,action,success){
		if (success) {
			$("input[name='accessAlarm']").get(json.fence.accessAlarm).checked = true;
			$("input[name='speedAlarm']").get(json.fence.speedAlarm).checked = true;
			$("#speedHigh").val(parseIntDecimal(json.fence.speedHigh / 10));
			if (json.fence.speedHighTts == null) {
				$("#speedHighTts").val("");
			} else {
				$("#speedHighTts").val(json.fence.speedHighTts);
			}
			if (json.fence.speedHighWarn == null) {
				$("#speedHighWarn").val(0);
			} else {
				$("#speedHighWarn").val(parseIntDecimal(json.fence.speedHighWarn / 10));
			}
			$("#speedHighWarnTts").val(json.fence.speedHighWarnTts);
			if (json.fence.speedHighWarnTts == null) {
				$("#speedHighWarnTts").val("");
			} else {
				$("#speedHighWarnTts").val(json.fence.speedHighWarnTts);
			}
			$("#speedLow").val(parseIntDecimal(json.fence.speedLow / 10));
			if (json.fence.speedLowTts == null) {
				$("#speedLowTts").val("");
			} else {
				$("#speedLowTts").val(json.fence.speedLowTts);
			}
			/*
			if (json.fence.speedLowWarn == null) {
				$("#speedLowWarn").val(0);
			} else {
				$("#speedLowWarn").val(parseIntDecimal(json.fence.speedLowWarn / 10));
			}
			if (json.fence.speedLowWarnTts == null) {
				$("#speedLowWarnTts").val("");
			} else {
				$("#speedLowWarnTts").val(json.fence.speedLowWarnTts);
			}*/
			$("input[name='parkAlarm']").get(json.fence.parkAlarm).checked = true;
			$("#parkTime").val(json.fence.parkTime);
			clickParkAlarm();
			clickSpeedAlarm();
			$("#beginTime").val(second2ShortHourEx(json.fence.beginTime));
			$("#endTime").val(second2ShortHourEx(json.fence.endTime));
			markerList = json.markers;
			fillMarker(json.fence.markerID);
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function fillMarker(markerId) {
	if (markerList != null) {
		for (var i = 0; i < markerList.length; i += 1) {
			if (markerList[i].markerType == 2 || markerList[i].markerType == 3 || markerList[i].markerType == 4
					|| markerList[i].markerType == 9 || markerList[i].markerType == 10 ) {
				if (markerId != null && markerList[i].id == markerId) {
					$("#markerList").append("<option value='" + markerList[i].id + "' selected>" + markerList[i].name + "</option>");
				} else {
					$("#markerList").append("<option value='" + markerList[i].id + "'>" + markerList[i].name + "</option>");
				}
			}
		}
	}
}

function ajaxLoadMarker() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("VehiFenceAction_listMarker.action", function(json,action,success){
		if (success) {
			markerList = json.markers;
			fillMarker(null);
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function checkParam() {
	var marker = $("#markerList").val();
	if (marker == null || marker == "") {
		alert(parent.lang.vehicle_mapfence_selectMarkerNull);
		$("#markerList").focus();
		return false;
	}
	
	var temp = $("input[name='speedAlarm']:checked").val();
	if (temp != "0") {
		var high = parseIntDecimal($.trim($("#speedHigh").val()));
		var highWarn = parseIntDecimal($.trim($("#speedHighWarn").val()));
		if (high != 0 && highWarn > high) {
			alert(parent.lang.vehicle_mapfence_speedHighWarnHighError);
			$("#speedHighWarn").focus();
			return false;
		}
		
		var low = parseIntDecimal($.trim($("#speedLow").val()));
		/*
		var lowWarn = parseIntDecimal($.trim($("#speedLowWarn").val()));	
		if (low != 0 && lowWarn > low) {
			alert(parent.lang.vehicle_mapfence_speedLowWarnHighError);
			$("#speedLowWarn").focus();
			return false;
		}*/
		
		if (high != 0 && low > high) {
			alert(parent.lang.vehicle_mapfence_speedHighLowError);
			$("#speedLow").focus();
			return false;
		}
	}
	
	temp = $("input[name='parkAlarm']:checked").val();
	if (temp != "0") {
		var time = parseIntDecimal($.trim($("#parkTime").val()));
		if (time < 60 || time > 9999) {
			alert(parent.lang.vehicle_mapfence_parkTimeError);
			$("#parkTime").focus();
			return false;
		}	
	}
	
	var begin = shortHour2Second($.trim($("#beginTime").val()));
	var end = shortHour2Second($.trim($("#endTime").val()));
	if (begin > end) {
		alert(parent.lang.vehicle_downplan_timeunvalid);
		$("#beginTime").focus();
		return false;
	}
	
	return true;
}

function clickSpeedAlarm() {
	var temp = $("input[name='speedAlarm']:checked").val();
	if (temp == "0") {
		diableInput("#speedHigh", true, true);
		diableInput("#speedHighTts", true, true);
		diableInput("#speedHighWarn", true, true);
		diableInput("#speedHighWarnTts", true, true);
		diableInput("#speedLow", true, true);
		diableInput("#speedLowTts", true, true);
	} else {
		diableInput("#speedHigh", false, true);
		diableInput("#speedHighTts", false, true);
		diableInput("#speedHighWarn", false, true);
		diableInput("#speedHighWarnTts", false, true);
		diableInput("#speedLow", false, true);
		diableInput("#speedLowTts", false, true);
	}
}

function clickParkAlarm() {
	var temp = $("input[name='parkAlarm']:checked").val();
	if (temp == "0") {
		diableInput("#parkTime", true, true);
	} else {
		diableInput("#parkTime", false, true);
	}
}

function ajaxSetupFence() {
	var vehicles = null;
	if (!isEditFence()) {
		//判断是否选择车辆信息
		vehicles = vehiTree.getCheckedVehi();
		if (vehicles.length <= 0) {
			alert(parent.lang.report_selectVehiNullErr);
			return ;
		}
	}
	
	//判断参数是否正确
	if (!checkParam()) {
		return ;
	}

	var data={};
	if (!isEditFence()) {
		data.devIdno = vehicles.toString();
	} 
	
	data.markerID = $("#markerList").val();
	data.accessAlarm = $("input[name='accessAlarm']:checked").val();
	data.speedAlarm = $("input[name='speedAlarm']:checked").val();
	data.speedHigh = parseIntDecimal($.trim($("#speedHigh").val())) * 10;
	data.speedHighTts = $("#speedHighTts").val();
	data.speedHighWarn = parseIntDecimal($.trim($("#speedHighWarn").val())) * 10;
	data.speedHighWarnTts = $("#speedHighWarnTts").val();
	
	data.speedLow = parseIntDecimal($.trim($("#speedLow").val())) * 10;
	data.speedLowTts = $("#speedLowTts").val();
	data.speedLowWarn = parseIntDecimal($.trim($("#speedLowWarn").val())) * 10;
	data.speedLowWarnTts = $("#speedLowWarnTts").val();
	
	data.parkAlarm = $("input[name='parkAlarm']:checked").val();
	data.parkTime = $.trim($("#parkTime").val());
	data.beginTime = shortHour2Second($.trim($("#beginTime").val()));
	data.endTime = shortHour2Second($.trim($("#endTime").val()));
			
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action = 'VehiFenceAction_save.action';
	if(isEditFence()) {
		action = 'VehiFenceAction_edit.action?id=' + getUrlParameter("id");
	}
	
	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			if (!isEditFence()) {
				W.doSetupFenceSuc();
			} else {
				W.doEditFenceSuc(getUrlParameter("id"), data);
			}
		}
	});
}