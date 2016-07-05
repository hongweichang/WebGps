var api = frameElement.api, W = api.opener;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//配置失去焦点的事件
	$("#name").blur(checkName);
	$("#account").blur(checkAccount);
	$("#email").blur(checkEmail);
	$("#url").blur(checkUrl);
	if (isEditClient()) {
		//从服务器查询数据
		ajaxLoadInfo();
		//配置账号编号信息不允许被修改
		diableInput("#account", true, true);
		$("#dtDefaultPwd").hide();
		$("#ddDefaultPwd").hide();
	}
}); 

function loadLang(){
	$("#labelName").text(parent.lang.client_labelName);
	$("#labelAccount").text(parent.lang.client_labelAccount);
	$("#labelLinkMan").text(parent.lang.client_labelLinkman);
	$("#labelTelephone").text(parent.lang.client_labelTelephone);
	$("#labelEmail").text(parent.lang.client_labelEmail);
	$("#labelUrl").text(parent.lang.client_labelUrl);
	$("#defaultPwdtip").text(parent.lang.client_defaultPwdtip);
	$("#save").text(parent.lang.save);
}

function disableForm(disable) {
	diableInput("#name", disable, true);
	//编辑设备的情况下，不允许修改设备编号
	if (!isEditClient()) {
		diableInput("#account", disable, true);
	}
	diableInput("#linkMan", disable, true);
	diableInput("#telephone", disable, true);
	diableInput("#email", disable, true);
	diableInput("#address", disable, true);
	diableInput("#url", disable, true);
	disableButton("#save", disable);
}

function isEditClient() {
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
	$.myajax.jsonGet("SysClientAction_get.action?id=" + id, function(json,action,success){
		if (success) {
			$("#name").val(json.name);
			$("#account").val(json.account);
			$("#linkMan").val(json.linkMan);
			$("#email").val(json.email);
			$("#telephone").val(json.telephone);
			$("#url").val(json.url);
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function checkName() {
	return checkInput("#name", "#nameWrong", 1, 32, parent.lang.errStringRequire, parent.lang.errNameRegex);
}

function checkAccount() {
	return checkDigitAlpha("#account", "#accountWrong", parent.lang.errStringRequire, parent.lang.errAccountRegex, 4);
}

function checkEmail() {
	return checkEmailValid("#email", "#emailWrong", parent.lang.errEmailFormat);
}

function checkUrl() {
	return checkUrlValid("#url", "#urlWrong", parent.lang.errUrlFormat);
}

function checkParam() {
	var ret = true;
	if (!checkName()) {
		ret = false;
	}
	
	if (!checkAccount()) {
		ret = false;
	}
	
	if (!checkEmail()) {
		ret = false;
	}
	
	if (!checkUrl()){
		ret = false;
	}
	
	return ret;
}

function ajaxSaveClient() {
	if (!checkParam()) {
		return ;
	}

	var data={};
	data.userAccount = {};
	data.userAccount.name = $.trim($("#name").val());
	data.userAccount.account = $.trim($("#account").val());
	data.linkMan = $.trim($("#linkMan").val());
	data.telephone = $.trim($("#telephone").val());
	data.email = $.trim($("#email").val());
	data.url = $.trim($("#url").val());
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action;
	if (isEditClient()) {
		action = 'SysClientAction_save.action?id=' + getUrlParameter("id");
	} else {
		action = 'SysClientAction_add.action';
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
			if (isEditClient()) {
				data.id = getUrlParameter("id");
				W.doEditClientSuc(getUrlParameter("id"), data);
			} else {
				W.doAddClientSuc( data);
			}
		}
	});
}