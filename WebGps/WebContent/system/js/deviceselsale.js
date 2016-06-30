var api = frameElement.api, W = api.opener;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//
	var devnames = decodeURI(getUrlParameter("devnames"));
	var arrDevs = devnames.split(',');
	for (var i = 0; i < arrDevs.length; i += 1) {
		$("#vehicles").append("<option >" + arrDevs[i] + "</option>");
	}
	//加载设备和客户信息
	ajaxLoadInfo();
	//配置选择客户事件
	$('#clientList').change(checkClient);
	initPayment();
	$("#payBegin").val(dateCurrentDateString());
	onChangePayPeriod();
}); 

function loadLang(){
	$("#lableSale").text(parent.lang.device_lableSale);
	$("#lableName").text(parent.lang.device_labelDevList);
	$("#save").text(parent.lang.save);
	initPayLang();
}

function disableForm(disable) {
	diableInput("#clientList", disable, true);
	disableButton("#save", disable);
	
	if (!disable) {
		onCheckPayment();
	} else {
		disablePayment(disable);
	}
}

function checkClient() {
	return true;
	if ($("#clientList").val() > 0) {
		$("#clientWrong").text("");
		return true;
	} else {
		$("#clientWrong").text(parent.lang.device_errSelectClient);
		return false;
	}
}

function checkParam() {
	var ret = true;
	if (!checkClient()) {
		ret = false;
	}
	
	if (!checkPayment()) {
		ret = false;
	}
	
	return ret;
}

function ajaxLoadInfo() {
	var idno = getUrlParameter("idno");
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("SysDeviceAction_getSale.action", function(json,action,success){
		if (success) {
			//填充client list
			$("#clientList").append("<option value='"+0+"'>"+parent.lang.device_selectclient+"</option>");
			if (json.clients != null) {
				$.each(json.clients, function (i, fn) {
					$("#clientList").append("<option value='"+fn.id+"'>"+fn.userAccount.name+"</option>");
				});
			}
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function ajaxSaleDevice() {
	if (!checkParam()) {
		return ;
	}

	var idno = getUrlParameter("idno");
	disableForm(true);
	
	var data={};
	data = savePayment(true, data);
	
	$.myajax.showLoading(true, parent.lang.saving);
	var clientId = $("#clientList").val();
	$.myajax.jsonPost('SysDeviceAction_sale.action?idno=' + idno + "&clientId=" + clientId, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		//关闭并退出对话框
		if (success) {
			data.payBegin = dateStrDate2Date(data.payBegin);
			W.doSaleSuccess(idno, clientId, json.client, data);
		}
	});
}