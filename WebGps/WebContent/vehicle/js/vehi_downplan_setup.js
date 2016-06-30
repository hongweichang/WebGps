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
	$("#downType").append("<option value='1' selected>" + parent.lang.vehicle_downplan_downall + "</option>");
	$("#downType").append("<option value='2'>" + parent.lang.vehicle_downplan_downrecord + "</option>");
	$("#downType").append("<option value='3'>" + parent.lang.vehicle_downplan_downjpg + "</option>");
	$("#downType").append("<option value='4'>" + parent.lang.vehicle_downplan_downrecord_alarm + "</option>");
	$("#downType").append("<option value='5'>" + parent.lang.vehicle_downplan_downjpeg_alarm + "</option>");
	
	if (isEditDownPlan()) {
		$("#devList").hide();
		$("#downPlanContent").css("margin-left","0px"); 
		$("#content").width(480); 
		ajaxLoadDownPlan();
	} else {
		//加载车辆树
		//生成权限树
		vehiTree = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
		vehiTree.enableCheckBoxes(1);
		vehiTree.enableThreeStateCheckboxes(true);
		vehiTree.setImagePath("../js/dxtree/imgs/");
		vehiTree.fillGroup(parent.vehiGroupList);
		vehiTree.fillVehicle(parent.vehicleList);
	}
}); 

function isEditDownPlan() {
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
	$("#labelDownType").text(parent.lang.vehicle_downplan_labelDownType);
	$("#allAlarm").text(parent.lang.alarm_type_all);
	$("#ioAlarm").text(parent.lang.ioAlarm);
	$("#speedAlarm").text(parent.lang.alarm_type_overspeed);
	$("#gSensorAlarm").text(parent.lang.report_alarm_shake);
	$("#tempAlarm").text(parent.lang.alarm_type_temperator);
	$("#motionAlarm").text(parent.lang.alarm_type_motion);
	$("#upsCutAlarm").text(parent.lang.report_alarm_upsCut);
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

function ajaxLoadDownPlan() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("VehiDownPlanAction_get.action?idno=" + getUrlParameter("idno"), function(json,action,success){
		if (success) {
			setDayInfo(1, json.plan.day1);
			setDayInfo(2, json.plan.day2);
			setDayInfo(3, json.plan.day3);
			setDayInfo(4, json.plan.day4);
			setDayInfo(5, json.plan.day5);
			setDayInfo(6, json.plan.day6);
			setDayInfo(7, json.plan.day7);
			$("#downType").val(json.plan.downType);
			if(json.plan.downType == 4 || json.plan.downType == 5){
				$('.checkType').show();
				var downAlarmType = json.plan.downAlarmType.toString(2);
				if(downAlarmType == "111111"){
					$("#allType").attr("checked","checked");
				}
				$('#downPlanContent .selectAlarmType').each(function(i) {
					if(downAlarmType.substr(i, 1) == '1'){
						$(this).attr("checked","checked");
					}
				});
			}
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

function ajaxSetupDownPlan() {
	var vehicles = null;
	if (!isEditDownPlan()) {
		//判断是否选择车辆信息
		vehicles = vehiTree.getCheckedVehi();
		if (vehicles.length <= 0) {
			alert(parent.lang.report_selectVehiNullErr);
			return ;
		}
	}
	
	//判断时间参数是否正确
	if (!checkDay()) {
		return ;
	}

	var data={};
	if (!isEditDownPlan()) {
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
	if($("#downType").val() == 4 || $("#downType").val() == 5){
		var str = "";
		 if($("#allType").attr("checked")=="checked"){
			 str = '111111';
		 }else{
			 $('#downPlanContent .selectAlarmType').each(function() {
				 if($(this).attr("checked")=="checked"){
					 str += '1';
				 }else{
					 str += '0';
				 }
			 });
		 }	
		 
		data.downType = $("#downType").val();
		data.downAlarmType = parseInt(str,2);
	}else{
		data.downType = $("#downType").val();
	}
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost('VehiDownPlanAction_save.action', data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			if (!isEditDownPlan()) {
				W.doSetupDownPlanSuc();
			} else {
				W.doEditPlanSuc(getUrlParameter("idno"), data);
			}
		}
	});
}

function check(v)
{
	if(v == 4 || v == 5){
		$('.checkType').show();
	}else {
		$('.checkType').hide();
	}
}

//复选框事件  
//全选、取消全选的事件
function selectAll(){  
    if ($("#allType").attr("checked")) {  
        $(":checkbox").attr("checked", true);  
    } else {  
        $(":checkbox").attr("checked", false);  
    }  
} 

//子复选框的事件  
function setSelectAll() {
     var $subBox = $("input[name='subBox']");
     $subBox.click(function(){
         $("#allType").attr("checked",$subBox.length == $("input[name='subBox']:checked").length ? true : false);
     });
 }