var api = frameElement.api, W = api.opener;

var lastValidaty = "";
$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//配置失去焦点的事件
	$("#name").blur(checkName);
	$("#account").blur(checkAccount);
	$("#pwd1").blur(checkNewPwd);
	$("#pwd2").blur(checkConfirmPwd);
	$("#email").blur(checkEmail);
	$("#url").blur(checkUrl);
	$('#roleList').change(checkRole);
	$("#validaty").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd'}) });
	$("#roleList").append("<option value='"+0+"'>" + parent.lang.usermgr_selectRole + "</option>");
	var user_validaty = GetCookie("user_validaty");
	if (user_validaty != null && user_validaty != "undefined") {
		$("#validaty").val(user_validaty);
	} else {
		$("#validaty").val(dateFormat2DateString(dateGetNextYear()));
	}
	lastValidaty = $("#validaty").val();
	if (isEditUser()) {
		//从服务器查询数据
		ajaxLoadInfo();
		//配置账号编号信息不允许被修改
		diableInput("#account", true, true);
		$("#accountWrong").text("");
		$("#dtPwd1").hide();
		$("#dtPwd2").hide();
		$("#ddPwd1").hide();
		$("#ddPwd2").hide();
		$("#dtDefaultPwd").hide();
		$("#ddDefaultPwd").hide();
	} else {
		//加载角色信息
		ajaxLoadRole();
	}
}); 

function loadLang(){
	$("#labelName").text(parent.lang.usermgr_user_labelName);
	$("#labelAccount").text(parent.lang.usermgr_user_labelAccount);
	$("#labelPwd1").text(parent.lang.usermgr_user_labelPwd1);
	$("#labelPwd2").text(parent.lang.usermgr_user_labelPwd2);
	$("#labelDefaultPwd").text(parent.lang.usermgr_user_labelDefaultPwd);
	$("#defaultPwdtip").text(parent.lang.usermgr_user_defaultPwdtip);
	$("#labelRole").text(parent.lang.usermgr_user_labelRole);
	$("#labelValidaty").text(parent.lang.usermgr_user_labelValidaty);
	$("#labelLinkMan").text(parent.lang.usermgr_user_labelLinkman);
	$("#labelTelephone").text(parent.lang.usermgr_user_labelTelephone);
	$("#labelEmail").text(parent.lang.usermgr_user_labelEmail);
	$("#labelAddress").text(parent.lang.usermgr_user_labelAddress);
	$("#labelUrl").text(parent.lang.usermgr_user_labelUrl);
	$("#defaultPwdtip").text(parent.lang.usermgr_user_defaultPwdtip);
	$("#resetPwd").text(parent.lang.usermgr_user_resetDefaultPwd);
	$("#save").text(parent.lang.save);
	$("#labelDemo").text(parent.lang.usermgr_user_labelDemo);
	$("#spanIsDemo").text(parent.lang.usermgr_user_demo);
}

function disableForm(disable) {
	diableInput("#name", disable, true);
	//编辑设备的情况下，不允许修改设备编号
	if (!isEditUser()) {
		diableInput("#account", disable, true);
		diableInput("#pwd1", disable, true);
		diableInput("#pwd2", disable, true);
	}
	diableInput("#linkMan", disable, true);
	diableInput("#telephone", disable, true);
	diableInput("#email", disable, true);
	diableInput("#roleList", disable, true);
	diableInput("#validaty", disable, true);
	diableInput("#address", disable, true);
	diableInput("#url", disable, true);
	disableButton("#save", disable);
}

function isEditUser() {
	var id = getUrlParameter("id");
	if (id !== null && id !== "") {
		return true;
	} else {
		return false;
	}
}

function fillSelectRole(roles, roleId) {
	if (roles != null) {
		$.each(roles, function (i, fn) {
			if (roleId != null && fn.id == roleId) {
				$("#roleList").append("<option value='"+fn.id+"' selected>"+fn.name+"</option>");
			} else {
				$("#roleList").append("<option value='"+fn.id+"'>"+fn.name+"</option>");
			}
		});
	}
}

function ajaxLoadRole() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("UserAction_allRoles.action", function(json,action,success){
		if (success) {
			fillSelectRole(json.roles, null);
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function ajaxLoadInfo() {
	var id = getUrlParameter("id");
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("UserAction_get.action?id=" + id, function(json,action,success){
		if (success) {
			$("#name").val(json.name);
			$("#account").val(json.account);
			$("#linkMan").val(json.linkMan);
			$("#email").val(json.email);
			$("#telephone").val(json.telephone);
			$("#address").val(json.address);
			$("#url").val(json.url);
			$("#validaty").val(dateTime2DateString(json.validity));
			var temp = $("#validaty").val();
			lastValidaty = dateTime2DateString(json.validity);
			fillSelectRole(json.roles, json.roleId);
			//判断是否为演示账号
			if (json.isAdmin == 2) {
				$("input[name='isDemo']").get(0).checked = true;
			}
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

function checkEmail() {
	return checkEmailValid("#email", "#emailWrong", parent.lang.errEmailFormat);
}

function checkUrl() {
	return checkUrlValid("#url", "#urlWrong", parent.lang.errUrlFormat);
}

function checkRole() {
	if ($("#roleList").val() == 0) {
		//添加用户时，有角色的情况下，则必须选择相应的角色
		if ($("#roleList option").length > 1) {
			$("#roleWrong").text(parent.lang.usermgr_user_selectRoleTip);
			return false;
		} else {
			return confirm(parent.lang.usermgr_user_roleNullTip);
		}
	} else {
		$("#roleWrong").text("*");
	}
	return true;
}

function checkParam() {
	var ret = true;
	if (!checkName()) {
		ret = false;
	}
	
	if (!checkAccount()) {
		ret = false;
	}
	
	if (!isEditUser()) {
		if (!checkNewPwd()) {
			ret = false;
		}
		
		if (!checkConfirmPwd()) {
			ret = false;
		}
	}
	
	if (!checkEmail()) {
		ret = false;
	}
	
	if (!checkRole()) {
		ret = false;
	}
	
	if (!checkUrl()) {
		ret = false;
	}
	
	return ret;
}

function ajaxSaveUser() {
	if (!checkParam()) {
		return ;
	}

	var data={};
	data.userAccount = {};
	data.userAccount.name = $.trim($("#name").val());
	data.userAccount.account = $.trim($("#account").val());
	data.userAccount.validity = $("#validaty").val();
	data.roleId = $("#roleList").val();
	data.linkMan = $.trim($("#linkMan").val());
	data.telephone = $.trim($("#telephone").val());
	data.email = $.trim($("#email").val());
	data.address = $.trim($("#address").val());
	data.url = $.trim($("#url").val());
	
	if ($("input[name='isDemo']:checked").val() != "1") {
		data.isAdmin = 0;
	} else {
		//设置为演示账号
		data.isAdmin = 2;
	}
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action;
	if (isEditUser()) {
		data.id = getUrlParameter("id");
		action = 'UserAction_save.action?id=' + getUrlParameter("id");
	} else {
		data.userAccount.password = $("#pwd1").val();
		action = 'UserAction_add.action';
	}
	
	if (lastValidaty != $("#validaty").val()) {
//		SetCookie("user_validaty", data.userAccount.validity);
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
			if (isEditUser()) {
				W.doEditUserSuc(getUrlParameter("id"), data, json.rolename);
			} else {
				W.doAddUserSuc( data);
			}
		}
	});
}

function ajaxResetPwd() {
	disableForm(true);
	$.myajax.showTopLoading(true, parent.lang.usermgr_user_resetPwdNow);
	$.myajax.jsonPost('UserAction_resetPwd.action?id=' + getUrlParameter("id"), null, false, function(json, success) {	
		disableForm(false);
		$.myajax.showTopLoading(false);
		//关闭并退出对话框
		if (success) {
			$.dialog.tips(parent.lang.usermgr_user_tipResetPwdSuc, 1);
		}
	});
}