var api = frameElement.api, W = api.opener;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//配置失去焦点的事件
	$("#name").blur(checkName);
	$("#email").blur(checkEmail);
	//从服务器查询数据
	ajaxLoadInfo();
	//配置账号编号信息不允许被修改
	diableInput("#name", true, true);
}); 

function loadLang(){
	$("#lableUserName").text(parent.lang.client_labelAccount);
	$("#lableTelephone").text(parent.lang.client_labelTelephone);
	$("#lableEmail").text(parent.lang.client_labelEmail);
	$("#save").text(parent.lang.save);
}

function disableForm(disable) {
	diableInput("#telephone", disable, true);
	diableInput("#email", disable, true);
	disableButton("#save", disable);
}

function ajaxLoadInfo() {
	var id = getUrlParameter("id");
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("SysLoginAction_getAccount.action", function(json,action,success){
		if (success) {
			$("#name").val(json.name);
			$("#email").val(json.email);
			$("#telephone").val(json.telephone);
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

function checkParam() {
	var ret = true;
	if (!checkName()) {
		ret = false;
	}

	if (!checkEmail()) {
		ret = false;
	}
	
	return ret;
}

function ajaxSaveAccount() {
	if (!checkParam()) {
		return ;
	}

	var data={};
	data.telephone = $.trim($("#telephone").val());
	data.email = $.trim($("#email").val());
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost("SysLoginAction_saveAccount.action", data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		//关闭并退出对话框
		if (success) {
			W.doAccountSuc();
		}
	});
}