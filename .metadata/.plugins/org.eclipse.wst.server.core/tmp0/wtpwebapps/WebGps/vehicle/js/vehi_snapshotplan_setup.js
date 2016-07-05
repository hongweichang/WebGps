var api = frameElement.api, W = api.opener;
var vehiTree;
var searchTimer = null;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//默认参数
	for (var i = 1; i <= 7; i += 1) {
		$("#day" + i +"Begin1").val(second2ShortHour(0));
		$("#day" + i +"Begin1").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm'}) });
		$("#day" + i +"End1").val(second2ShortHour(86399));	
		$("#day" + i +"End1").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm'}) });
		$("#day" + i +"Begin2").val(second2ShortHour(0));
		$("#day" + i +"Begin2").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm'}) });
		$("#day" + i +"End2").val(second2ShortHour(0));		
		$("#day" + i +"End2").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm'}) });
	}
	//加载下载类型
	$("#modeType").append("<option value='1' selected>" + parent.lang.vehicle_snapshotplan_modeCycle + "</option>");
	$("#modeType").append("<option value='2'>" + parent.lang.vehicle_snapshotplan_modeAlone + "</option>");
	
	if (isEditSnapshotPlan()) {
		$("#devList").hide();
		$("#downPlanContent").css("margin-left","0px"); 
		$("#content").width(480); 
		ajaxLoadSnapshotPlan();
	} else {
		$("#span").val(300);
		//加载车辆树
		//生成权限树
		vehiTree = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
		vehiTree.enableCheckBoxes(1);
		vehiTree.enableThreeStateCheckboxes(true);
		vehiTree.setImagePath("../js/dxtree/imgs/");
		
		ajaxLoadStoList();
//		vehiTree.fillGroup(parent.vehiGroupList);
//		vehiTree.fillVehicle(parent.vehicleList);
	}
}); 

function isEditSnapshotPlan() {
	return getUrlParameter("idno") != "" ? true : false;
}

function loadLang(){
	$("#labelSearch").text(parent.lang.vehicle_group_labelSearchVehi);
	$("#labelBeginTime1").text(parent.lang.vehicle_downplan_beginTime1);
	$("#labelEndTime1").text(parent.lang.vehicle_downplan_endTime1);
	$("#labelBeginTime2").text(parent.lang.vehicle_downplan_beginTime2);
	$("#labelEndTime2").text(parent.lang.vehicle_downplan_endTime2);
	$("#labelDay1").text(parent.lang.vehicle_downplan_labelDay1);
	$("#labelDay2").text(parent.lang.vehicle_downplan_labelDay2);
	$("#labelDay3").text(parent.lang.vehicle_downplan_labelDay3);
	$("#labelDay4").text(parent.lang.vehicle_downplan_labelDay4);
	$("#labelDay5").text(parent.lang.vehicle_downplan_labelDay5);
	$("#labelDay6").text(parent.lang.vehicle_downplan_labelDay6);
	$("#labelDay7").text(parent.lang.vehicle_downplan_labelDay7);
	$("#labelInterval").text(parent.lang.vehicle_snapshotplan_labelInterval);
	$("#intervalUnit").text(parent.lang.vehicle_mapfence_parkTimeUnit);
	$("#labelMode").text(parent.lang.vehicle_snapshotplan_labelMode);
	$("#save").text(parent.lang.save);
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
	for (var i = 1; i <= 7; i = i + 1) {
		diableInput("#day" + i +"Begin1", disable, true);
		diableInput("#day" + i +"End1", disable, true);
		diableInput("#day" + i +"Begin2", disable, true);
		diableInput("#day" + i +"End2", disable, true);
	}
	diableInput("#name", disable, true);
	diableInput("#span", disable, true);
	diableInput("#modeType", disable, true);
	diableInput("#vehicle_tree", disable, true);
	diableInput("#save", disable, true);
}

function setDayInfo(day, value) {
	var time = value.split(",");
	if (time.length >= 4) {
		$("#day" + day +"Begin1").val(second2ShortHour(time[0]));
		$("#day" + day +"End1").val(second2ShortHour(time[1]));	
		$("#day" + day +"Begin2").val(second2ShortHour(time[2]));
		$("#day" + day +"End2").val(second2ShortHour(time[3]));
	}
}

function ajaxLoadStoList() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	var devices = gpsGetVehicleQueryList(null);
	var data = {};
	data.devIdnos = devices.toString();
	$.myajax.jsonGetEx("SnapshotPlanAction_devStoList.action", function(json,action,success){
		if (success) {
			if (json.stoList != null) {
				var devIdnos = [];
				for (var i = 0; i < json.stoList.length; ++ i) {
					devIdnos.push(json.stoList[i].devIdno);
				}
				vehiTree.fillGroup(parent.vehiGroupList);
				vehiTree.fillVehicleByDevIdnos(parent.vehicleList, devIdnos);
			}
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null, data);
}

function ajaxLoadSnapshotPlan() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("SnapshotPlanAction_get.action?idno=" + getUrlParameter("idno"), function(json,action,success){
		if (success) {
			setDayInfo(1, json.plan.day1);
			setDayInfo(2, json.plan.day2);
			setDayInfo(3, json.plan.day3);
			setDayInfo(4, json.plan.day4);
			setDayInfo(5, json.plan.day5);
			setDayInfo(6, json.plan.day6);
			setDayInfo(7, json.plan.day7);
			$("#modeType").val(json.plan.mode);
			$("#span").val(json.plan.span);
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function checkDay() {
	var ret = true;
	for (var i = 1; i <= 7; i = i + 1) {
		for (var j = 1; j <= 2; j += 1) {
			if ( shortHour2Second($("#day" + i +"Begin" + j).val()) > shortHour2Second($("#day" + i +"End" + j).val()) ) {
				ret = false;
				$("#day" + i +"Begin" + j).focus();
				alert(parent.lang.vehicle_downplan_timeunvalid);
				break;
			}
		}
	}
	return ret;
}

function getDayValue(day) {
	var value = [];
	for (var j = 1; j <= 2; j += 1) {
		var begin = shortHour2Second($("#day" + day + "Begin" + j).val());
		var end = shortHour2Second($("#day" + day + "End" + j).val());
		value.push(begin);
		value.push(end);
	}
	return value.toString();
}

function ajaxSetupSnapshotPlan() {
	var vehicles = null;
	if (!isEditSnapshotPlan()) {
		//判断是否选择车辆信息
		vehicles = vehiTree.getCheckedVehi();
		if (vehicles.length <= 0) {
			alert(parent.lang.report_selectVehiNullErr);
			return ;
		}
	}
	
	var time = parseIntDecimal($.trim($("#span").val()));
	if (time < 60 || time > 3600) {
		alert(parent.lang.vehicle_snapshotpaln_intervalError);
		$("#span").focus();
		return ;
	}	
		
	//判断时间参数是否正确
	if (!checkDay()) {
		return ;
	}

	var data={};
	if (!isEditSnapshotPlan()) {
		data.devIdno = vehicles.toString();
	} else {
		data.devIdno = getUrlParameter("idno");
	}
	//时间参数
	data.day1 = getDayValue(1);
	data.day2 = getDayValue(2);
	data.day3 = getDayValue(3);
	data.day4 = getDayValue(4);
	data.day5 = getDayValue(5);
	data.day6 = getDayValue(6);
	data.day7 = getDayValue(7);
	data.mode = $("#modeType").val();
	data.span = $("#span").val(); 
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost('SnapshotPlanAction_save.action', data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			if (!isEditSnapshotPlan()) {
				W.doSetupPlanSuc();
			} else {
				W.doEditPlanSuc(getUrlParameter("idno"), data);
			}
		}
	});
}