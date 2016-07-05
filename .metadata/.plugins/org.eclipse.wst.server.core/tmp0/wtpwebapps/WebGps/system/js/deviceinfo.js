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
	$("#dateProduct").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd'}) });
	initDeviceTypeEx();	
	initPayment();

	if (isEditDevice()) {
		//从服务器查询数据
		ajaxLoadInfo();
		//配置设备编号信息不允许被修改
		diableInput("#idno", true, true);
//		$("#dtDefaultPwd").hide();
//		$("#ddDefaultPwd").hide();
//		$("#dtDateProduct").hide();
//		$("#ddDateProduct").hide();
	} else {
		$("#dateProduct").val(dateCurrentDateString());
		$("#payBegin").val(dateCurrentDateString());
		$("#dtPayMonth").hide();
		$("#ddPayMonth").hide();
		$("#dtPayStatus").hide();
		$("#ddPayStatus").hide();
		$("#dtPayOverDay").hide();
		$("#ddPayOverDay").hide();
		//$("#dtStoDay").hide();
		//$("#ddStoDay").hide();
		
		onChangePayPeriod();
		ajaxLoadEnableTracker();
	}
}); 

function loadLang(){
	$("#lableName").text(parent.lang.device_labelName);
	$("#lableIDNO").text(parent.lang.device_labelIDNO);
	$("#lableDevType").text(parent.lang.device_labelDevType);
	$("#lableChnCount").text(parent.lang.device_labelChnCount);
	$("#lableSimCard").text(parent.lang.device_labelSimCard);
	$("#labelDateProduct").text(parent.lang.device_labelDateProduct);
	$("#selectAddress2").text(parent.lang.device_selectAddress2);
	initPayLang();
	//$("#defaultPwdtip").text(parent.lang.device_labelPayMonth);
	$("#save").text(parent.lang.save);
}

function disableForm(disable) {
	diableInput("#name", disable, true);
	//编辑设备的情况下，不允许修改设备编号
	if (!isEditDevice()) {
		diableInput("#idno", disable, true);
	}
	diableInput("#devType", disable, true);
	diableInput("#chnCount", disable, true);
	diableInput("#simCard", disable, true);
	diableInput("#dateProduct", disable, true);
	disableButton("#save", disable);
	if (!disable) {
		onCheckPayment();
	} else {
		disablePayment(disable);
	}
}

function isEditDevice() {
	var idno = getUrlParameter("idno");
	if (idno !== null && idno !== "") {
		return true;
	} else {
		return false;
	}
}

function ajaxLoadInfo() {
	var idno = getUrlParameter("idno");
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("SysDeviceAction_get.action?idno=" + idno, function(json,action,success){
		$.myajax.showLoading(false);
		if (success) {
			if (json.enableMdvr) {
				$("#devType").append("<option value='1'>" + parent.lang.terminalVehicle + "</option>");
			}
			if (json.enableTracker) {
				$("#devType").append("<option value='2'>" + parent.lang.terminalMobile + "</option>");
			}
			if (json.enableDvr) {
				$("#devType").append("<option value='3'>" + parent.lang.terminalDvr + "</option>");
			}
			if (json.enablePad) {
				$("#devType").append("<option value='4'>" + parent.lang.terminalPad + "</option>");
			}
			$("#name").val(json.name);
			$("#idno").val(json.idno);
			
//			$("#devType").val(json.devType);
			$("#chnCount").val(json.chnCount);
			$("#simCard").val(json.simCard);
			$("#dateProduct").val(dateTime2DateString(json.dateProduct));
			if (json.netAddrType == 1) {
				$("#netAddrType2").attr("checked", true);
			}
			setTimeout(function () { 
				$("#devType").val(json.devType);
				}, 10);
			fillPayment(json);
		} else {	
			W.doEditExit();
		}
		disableForm(false);
	}, null);
}

function ajaxLoadEnableTracker() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("SysDeviceAction_serverConfig.action", function(json,action,success){
		$.myajax.showLoading(false);
		disableForm(false);
		if (success) {
			var devType = getCookieDevType();
			if (json.enableMdvr) {
				$("#devType").append("<option value='1'>" + parent.lang.terminalVehicle + "</option>");
			}
			if (json.enableTracker) {
				$("#devType").append("<option value='2'>" + parent.lang.terminalMobile + "</option>");
			}
			if (json.enableDvr) {
				$("#devType").append("<option value='3'>" + parent.lang.terminalDvr + "</option>");
			}
			if (json.enablePad) {
				$("#devType").append("<option value='4'>" + parent.lang.terminalPad + "</option>");
			}
			setTimeout(function () { $("#devType").val(devType);}, 10);
		} else {
			W.doAddExit();
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
	return checkInputRange("#chnCount", "#chnCountWrong", 0, 12, parent.lang.device_errChnCount);
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
	
	if (!checkPayment()) {
		ret = false;
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
	if ($("#netAddrType2").attr("checked")){
		data.netAddrType = 1;
	} else {
		data.netAddrType = 0;
	}
	
	data = savePayment(isEditDevice(), data);
	
	/*
	if ($("#checkPayment").attr("checked")){
		data.payEnable = 1;
	} else {
		data.payEnable = 0;
	}
	data.payBegin = $("#payBegin").val();
	data.payPeriod = $("#payPeriod").val();
	data.payDelayDay = $("#payDelay").val();
	if (isEditDevice()) {
		var payMonth = parseIntDecimal($("#payMonth").val());
		if (payMonth < 0 || payMonth > 24) {
			payMonth = 0;
		} 
		data.payMonth = payMonth;
		var payDelayDay = parseIntDecimal($("#payDelay").val());
		if (payDelayDay < 0 || payDelayDay > 24) {
			payDelayDay = 0;
		} 
		data.payDelayDay = payDelayDay;
	} else {
		data.payMonth = 0;
	}*/
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action;
	if (isEditDevice()) {
		action = 'SysDeviceAction_save.action?idno=' + getUrlParameter("idno");
	} else {
		action = 'SysDeviceAction_add.action';
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
			data.payBegin = dateStrDate2Date(data.payBegin);
			if (isEditDevice()) {
				W.doEditSuc(getUrlParameter("idno"), data);
			} else {
				W.doAddSuc(data);
			}
		}
	});
	saveDeviceType();
}