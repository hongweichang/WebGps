var api = frameElement.api, W = api.opener;

var lastValidaty = "";
$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//配置失去焦点的事件
	$("#name").blur(checkName);
	$("#email").blur(checkEmail);
	$("#effective").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd'}) });
	$("#expiration").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd'}) });
	
	if (isEditDriver()) {
		//从服务器查询数据
		ajaxLoadInfo();
	} else {
		$("#effective").val(dateCurrentDateString());
		$("#expiration").val(dateCurrentDateString());
	}
}); 

function loadLang(){
	$("#labelName").text(parent.lang.vehicle_driver_labelName);
	$("#labelTelephone").text(parent.lang.vehicle_driver_labelTelephone);
	$("#labelEmail").text(parent.lang.vehicle_driver_labelEmail);
	$("#labelCardNO").text(parent.lang.vehicle_driver_labelCardno);
	$("#labelLicence").text(parent.lang.vehicle_driver_labelLicence);
	$("#labelOrgName").text(parent.lang.vehicle_driver_labelOrgName);
	$("#labelEffective").text(parent.lang.vehicle_driver_labelEffective);
	$("#labelExpiration").text(parent.lang.vehicle_driver_labelExpiration);
	$("#save").text(parent.lang.save);
}

function disableForm(disable) {
	diableInput("#name", disable, true);
	diableInput("#telephone", disable, true);
	diableInput("#email", disable, true);
	diableInput("#cardNO", disable, true);
	diableInput("#orgName", disable, true);
	diableInput("#license", disable, true);
	diableInput("#effective", disable, true);
	diableInput("#expiration", disable, true);
	disableButton("#save", disable);
}

function isEditDriver() {
	var id = getUrlParameter("id");
	if (id !== null && id !== "") {
		return true;
	} else {
		return false;
	}
}

function ajaxLoadInfo() {
	var id = getUrlParameter("id");
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("DriverInfoAction_get.action?id=" + id, function(json,action,success){
		if (success) {
			$("#name").val(json.driver.name);
			$("#telephone").val(json.driver.telephone);
			$("#email").val(json.driver.email);
			$("#cardNO").val(json.driver.cardNO);
			$("#telephone").val(json.driver.telephone);
			$("#license").val(json.driver.licence);
			$("#orgName").val(json.driver.orgName);
			$("#effective").val(dateTime2DateString(json.driver.effective));
			$("#expiration").val(dateTime2DateString(json.driver.expiration));
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function checkName() {
	return checkInput("#name", "#nameWrong", 1, 32, parent.lang.errStringRequire, parent.lang.errNameRegex);
}

function checkEmail() {
	return checkEmailValid("#email", "#emailWrong", parent.lang.errEmailFormat);
}

function checkEffective() {
	if (dateCompareStrDate($("#effective").val(), $("#expiration").val()) > 0) {
		$("#effectiveWrong").text(parent.lang.vehicle_driver_effectiveError);
		$("#effectiveWrong").show();
		return false;
	} else {
		$("#effectiveWrong").text("");
		$("#effectiveWrong").hide();
		return true;
	}
}

function checkParam() {
	var ret = true;
	if (!checkName()) {
		ret = false;
	}
	
	if (!checkEmail()) {
		ret = false;
	}
	
	if (!checkEffective()) {
		ret = false;
	}
	
	return ret;
}

function ajaxSaveDriver() {
	if (!checkParam()) {
		return ;
	}
	
	

	var data={};
	data.name = $.trim($("#name").val());
	data.telephone = $.trim($("#telephone").val());
	data.email = $.trim($("#email").val());
	data.cardNO = $.trim($("#cardNO").val());
	data.licence = $.trim($("#license").val());
	data.orgName = $.trim($("#orgName").val());
	data.effective = $("#effective").val();
	data.expiration = $("#expiration").val();
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action;
	if (isEditDriver()) {
		data.id = getUrlParameter("id");
		action = 'DriverInfoAction_save.action?id=' + getUrlParameter("id");
	} else {
		action = 'DriverInfoAction_add.action';
	}
	
	$.myajax.jsonPost(action, data, false, function(json, success) {
		var exit = false;
		if (success) {
			exit = true;
		}
		disableForm(false);
		$.myajax.showLoading(false);
		//关闭并退出对话框
		if (exit) {
			if (isEditDriver()) {
				W.doEditDriverSuc(getUrlParameter("id"), data);
			} else {
				W.doAddDriverSuc( data);
			}
		}
	});
}