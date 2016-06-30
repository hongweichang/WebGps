var api = frameElement.api, W = api.opener;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//配置失去焦点的事件
	$("#oldPwd").blur(checkOldPwd);
	$("#newPwd").blur(checkNewPwd);
	$("#confirmPwd").blur(checkConfirmPwd);
}); 

function loadLang(){
	$("#lablePwd").text(parent.lang.home_lablePwd);
	$("#lableNewPwd").text(parent.lang.home_lableNew);
	$("#lableConfirmPwd").text(parent.lang.home_lableConfirmPwd);
	$("#save").text(parent.lang.save);
}

function disableForm(disable) {
	diableInput("#oldPwd", disable, true);
	diableInput("#newPwd", disable, true);
	diableInput("#confirmPwd", disable, true);
}

function checkOldPwd() {
	return checkPasswordInput("#oldPwd", "#oldPwdWrong", parent.lang.errStringRequire);
}

function checkNewPwd() {
	if(checkPasswordInput("#newPwd", "#newPwdWrong", parent.lang.errStringRequire)) {
		if ($("#confirmPwd").val() != "") {
			return checkConfirmPassword("#newPwd", "#confirmPwd", "#confirmPwdWrong", parent.lang.home_errConfirmPwd);
		} else {
			return true;
		}
	} else {
		return false;
	}
}

function checkConfirmPwd() {
	return checkConfirmPassword("#newPwd", "#confirmPwd", "#confirmPwdWrong", parent.lang.home_errConfirmPwd);
}

function checkParam() {
	var ret = true;
	if (!checkOldPwd()) {
		ret = false;
	}
	
	if (!checkNewPwd()) {
		ret = false;
	}
	
	if (!checkConfirmPwd()) {
		ret = false;
	}
	
	return ret;
}

function ajaxSavePassword() {
	if (!checkParam()) {
		return ;
	}

	var data={};
	data.oldPwd = $("#oldPwd").val();
	data.newPwd = $("#newPwd").val();
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost("SysLoginAction_password.action", data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		//关闭并退出对话框
		if (success) {
			W.doPasswordSuc();
		}
	});
}