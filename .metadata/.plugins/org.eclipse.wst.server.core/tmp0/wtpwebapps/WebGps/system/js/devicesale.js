var api = frameElement.api, W = api.opener;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//配置编辑框不可编辑
	diableInput("#devname", true, true);
	diableInput("#idno", true, true);
	diableInput("#dateProduct", true, true);
	diableInput("#owner", true, true);
	//加载设备和客户信息
	ajaxLoadInfo();
	//配置选择客户事件
	$('#clientList').change(checkClient);
	//
	initPayment();
	diableInput("#payStatus", true, true);
	diableInput("#payOverDay", true, true);
}); 

function loadLang(){
	$("#lableSale").text(parent.lang.device_lableSale);
	$("#lableName").text(parent.lang.device_labelName);
	$("#lableIDNO").text(parent.lang.device_labelIDNO);
	$("#labelDateProduct").text(parent.lang.device_labelDateProduct);
	$("#labelOwner").text(parent.lang.device_labelOwner);
	initPayLang();
	$("#save").text(parent.lang.save);
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

function ajaxLoadInfo() {
	var idno = getUrlParameter("idno");
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("SysDeviceAction_getSale.action?idno=" + idno, function(json,action,success){
		if (success) {
			$("#devname").val(json.name);
			$("#idno").val(json.idno);
			$("#dateProduct").val(dateTime2DateString(json.dateProduct));
			
			$("#owner").val(json.owner);
			//填充client list
			$("#clientList").append("<option value='"+0+"'>"+parent.lang.device_selectclient+"</option>");
			if (json.clients != null) {
				$.each(json.clients, function (i, fn) {
					if (fn.id != json.clientId) {
						$("#clientList").append("<option value='"+fn.id+"'>"+fn.userAccount.name+"</option>");
					}
				});
			}
			
			fillPayment(json);
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
	$.myajax.showLoading(true, parent.lang.saving);
	var clientId = $("#clientList").val();
	
	var data={};
	data = savePayment(true, data);
	
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