var api = frameElement.api, W = api.opener;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//配置失去焦点的事件
	$("#pwd1").blur(checkNewPwd);
	$("#pwd2").blur(checkConfirmPwd);
}); 

function loadLang(){
	$("#labelPwd1").text(parent.lang.usermgr_user_labelPwd1);
	$("#labelPwd2").text(parent.lang.usermgr_user_labelPwd2);
	$("#save").text(parent.lang.save);
}

function disableForm(disable) {
	diableInput("#pwd1", disable, true);
	diableInput("#pwd2", disable, true);
}

function checkNewPwd() {
	if(checkPasswordInput("#pwd1", "#pwd1Wrong", parent.lang.errStringRequire)) {
		if ($("#pwd2").val() != "") {
			return checkConfirmPassword("#pwd1", "#pwd2", "#pwd2Wrong", parent.lang.usermgr_user_errConfirmPwd);
		} else {
			return true;
		}
	} else {
		return false;
	}
}

function checkConfirmPwd() {
	return checkConfirmPassword("#pwd1", "#pwd2", "#pwd2Wrong", parent.lang.usermgr_user_errConfirmPwd);
}

function checkParam() {
	var ret = true;
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

	var action = 'UserAction_editPwd.action?id=' + getUrlParameter("id") + "&pwd=" + $("#pwd1").val();
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, null, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		//关闭并退出对话框
		if (success) {
			W.doPasswordSuc();
		}
	});
}