var api = frameElement.api, W = api.opener;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//配置失去焦点的事件
	$("#name").blur(checkName);
	$("#idno").blur(checkIdno);
	$("#chnCount").blur(checkChnCount);
//	$("#simCard").blur(checkSimCard);
	initDeviceType();
	//从服务器查询数据
	ajaxLoadInfo();
	//配置设备编号信息不允许被修改
	diableInput("#idno", true, true);
	$("#dtDefaultPwd").hide();
	$("#ddDefaultPwd").hide();
	$("#dateProduct").val(dateCurrentDateString());
	$("#dateProduct").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd'}) });
}); 

function loadLang(){
	$("#lableName").text(parent.lang.device_labelName);
	$("#lableIDNO").text(parent.lang.device_labelIDNO);
	$("#lableDevType").text(parent.lang.device_labelDevType);
	$("#lableChnCount").text(parent.lang.device_labelChnCount);
	$("#lableSimCard").text(parent.lang.device_labelSimCard);
	$("#labelDateProduct").text(parent.lang.device_labelDateProduct);
	$("#lableSale").text(parent.lang.device_lableSale);
	$("#defaultPwdtip").text(parent.lang.client_defaultPwdtip);
	$("#save").text(parent.lang.save);
}

function disableForm(disable) {
	diableInput("#name", disable, true);
	diableInput("#devType", disable, true);
//	diableInput("#chnCount", disable, true);
	diableInput("#simCard", disable, true);
	diableInput("#dateProduct", disable, true);
	diableInput("#clientList", disable, true);
	disableButton("#save", disable);
}

function ajaxLoadInfo() {
	var idno = getUrlParameter("idno");
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("SysDeviceAction_getUnreg.action?idno=" + idno, function(json,action,success){
		$.myajax.showLoading(false);
		disableForm(false);
		if (success) {
			$("#name").val(json.name);
			$("#idno").val(json.idno);
			$("#devType").val(json.devType);
			$("#clientList").append("<option value='"+0+"'>"+parent.lang.device_selectclient+"</option>");
			if (json.clients != null) {
				$.each(json.clients, function (i, fn) {
					if (fn.id != json.clientId) {
						$("#clientList").append("<option value='"+fn.id+"'>"+fn.userAccount.name+"</option>");
					}
				});
			}
		} else {
			W.doAddFailed();
		}
	}, null);
}

function checkName() {
	return checkInput("#name", "#nameWrong", 1, 32, parent.lang.errStringRequire, parent.lang.errNameRegex);
}

function checkIdno() {
	return checkDigitAlpha("#idno", "#idnoWrong", parent.lang.errStringRequire, parent.lang.errIDNORegex);
}

function checkChnCount() {
	return checkInputRange("#chnCount", "#chnCountWrong", 0, 8, parent.lang.device_errChnCount);
}

function checkSimCard() {
	return checkInput("#simCard", "#simCardWrong", 1, 32, parent.lang.errStringRequire, parent.lang.device_errSimCardRegx);
}

function checkParam() {
	var ret = true;
	if (!checkName()) {
		ret = false;
	}
	
	if (!checkIdno()) {
		ret = false;
	}

	if (!checkChnCount()) {
		ret = false;
	}
	
	if ( $.trim($("#simCard").val()) != "") {
		if (!checkSimCard()) {
			ret = false;
		}
	}
	
	return ret;
}

function ajaxSaveDevice() {
	if (!checkParam()) {
		return ;
	}

	var data={};
	data.userAccount = {};
	data.userAccount.name = $.trim($("#name").val());
	data.idno = $.trim($("#idno").val());
	data.devType = $.trim($("#devType").val());
	data.chnCount = $.trim($("#chnCount").val());
	data.simCard = $.trim($("#simCard").val());
	data.dateProduct = $("#dateProduct").val();
	var clientId = $("#clientList").val();
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action = 'SysDeviceAction_saveUnreg.action?idno=' + getUrlParameter("idno") + "&clientId=" + clientId;
	$.myajax.jsonPost(action, data, false, function(json, success) {
		var exit = false;
		if (success) {
			exit = true;
		}
		disableForm(false);
		$.myajax.showLoading(false);
		//关闭并退出对话框
		if (exit) {
			W.doAddSuc(getUrlParameter("idno"), data);
		}
	});
}
