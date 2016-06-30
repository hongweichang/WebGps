var api = frameElement.api, W = api.opener;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//配置失去焦点的事件
	$("#idno").blur(checkIdno);
	$("#chnCount").blur(checkChnCount);
	$("#batchCount").blur(checkBatchCount);
	$("#dateProduct").val(dateCurrentDateString());
	$("#dateProduct").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd'}) });
	initDeviceTypeEx();
	$("#payBegin").val(dateCurrentDateString());
	initPayment();
	onChangePayPeriod();
	ajaxLoadEnableTracker();
}); 

function loadLang(){
	$("#lableIDNO").text(parent.lang.device_labelIDNO);
	$("#lableDevType").text(parent.lang.device_labelDevType);
	$("#lableChnCount").text(parent.lang.device_labelChnCount);
	$("#labelDateProduct").text(parent.lang.device_labelDateProduct);
	$("#lableBatchCount").text(parent.lang.device_labelBatchCount);
	initPayLang();
	$("#tipBatch").text(parent.lang.device_batchTip);
	$("#defaultPwdtip").text(parent.lang.client_defaultPwdtip);
	$("#save").text(parent.lang.save);
}

function disableForm(disable) {
	//编辑设备的情况下，不允许修改设备编号
	diableInput("#idno", disable, true);
	diableInput("#devType", disable, true);
	diableInput("#chnCount", disable, true);
	diableInput("#dateProduct", disable, true);
	diableInput("#batchCount", disable, true);
	disableButton("#save", disable);
	
	if (!disable) {
		onCheckPayment();
	} else {
		disablePayment(disable);
	}
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
			setTimeout(function () {	
				$("#devType").val(devType);}, 10);
		} else {
			W.doAddExit();
		}
	}, null);
}

function checkIdno() {
	return checkDigitAlpha("#idno", "#idnoWrong", parent.lang.errStringRequire, parent.lang.errIDNORegex);
}

function checkChnCount() {
	return checkInputRange("#chnCount", "#chnCountWrong", 1, 16, parent.lang.device_errChnCount);
}

function checkBatchCount() {
	return checkInputRange("#batchCount", "#batchCountWrong", 2, 200, parent.lang.device_errBatchCount);
}

function checkParam() {
	var ret = true;
	if (!checkIdno()) {
		ret = false;
	}
	
	if (!checkChnCount()) {
		ret = false;
	}

	if (!checkBatchCount()) {
		ret = false;
	}
	
	if ($("#checkPayment").attr("checked")){
		if (!checkPayDelay()) {
			ret = false;
		}
		if (!checkPayMonth()) {
			ret = false;
		}
	}
	
	return ret;
}

function ajaxSaveDevice() {
	if (!checkParam()) {
		return ;
	}

	saveDeviceType();
	var data={};
	data.idno = $.trim($("#idno").val());
	data.devType = $.trim($("#devType").val());
	data.chnCount = $.trim($("#chnCount").val());
	data.dateProduct = $("#dateProduct").val();
	if ($("#checkPayment").attr("checked")){
		data.payEnable = 1;
	} else {
		data.payEnable = 0;
	}
	data.payBegin = $("#payBegin").val();
	data.payPeriod = $("#payPeriod").val();
	data.payDelayDay = $("#payDelay").val();
	data.payMonth = $("#payMonth").val();
	data.stoDay = $("#selStoDay").val();
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost('SysDeviceAction_batchAdd.action?count=' + $("#batchCount").val(), data, false, function(json, success) {
		var exit = false;
		if (success) {
			exit = true;
		}
		disableForm(false);
		$.myajax.showLoading(false);
		//关闭并退出对话框
		if (exit) {
			W.doBatchAddSuc();
		}
	});
}