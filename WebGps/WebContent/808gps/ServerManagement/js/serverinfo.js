var api = frameElement.api, W = api.opener;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [[{
			display: parent.lang.save, name : '', pclass : 'btnSave',bgcolor : 'gray', hide : false
		}]]
	});
	//加载语言
	loadLang();
	//配置失去焦点的事件
	$("#name").blur(checkName);
	$("#idno").blur(checkIdno);
	$("#lanAddress").blur(checkLanAddress);
	$("#deviceIp").blur(checkDeviceIp);
	$("#deviceIp2").blur(checkDeviceIp2);
	$("#devicePort").blur(checkDevicePort);
	$("#clientIp").blur(checkClientIp);
	$("#clientIp2").blur(checkClientIp2);
	$("#clientPort").blur(checkClientPort);
	$("#offlineTimeout").blur(checkOfflineTimeout);
	$('.btnSave').on('click',ajaxSaveServer);
	var svrtype = getUrlParameter("svrtype");
	if (svrtype != "3") {
		$("#dtPortClientOther").hide();
		$("#ddPortClientOther").hide();
	}
	if (isEditServer()) {
		//从服务器查询数据
		ajaxLoadInfo();
		//编号信息不可编辑
		diableInput("#idno", true, true);
	} else {
		if (svrtype == "2") {
			$("#devicePort").val("6608");
			$("#clientPort").val("6607");
			$("#idno").val("G1");
			$("#name").val("Gateway Server");
			$("#offlineTimeoutWrong").val(180);
		} else if (svrtype == "3") {
			$("#devicePort").val("6602");
			$("#clientPort").val("6604");
			$("#idno").val("M1");
			$("#name").val("Media Server");
			$("#clientPortOther").val("6617;6618;6619;6620;6621;6622");
		} else if (svrtype == "4") {
			$("#devicePort").val("6601");
			$("#clientPort").val("6603");
			$("#idno").val("U1");
			$("#name").val("User Server");
		} else if (svrtype == "5") {
			$("#devicePort").val("6612");
			$("#clientPort").val("6611");
			$("#idno").val("S1");
			$("#name").val("Storage Server");
		} else if (svrtype == "7") {
			$("#devicePort").val("6610");
			$("#clientPort").val("6609");
			$("#idno").val("D1");
			$("#name").val("Download Server");
		}
		if (isDownStation()) {
			ajaxLoadDownStation();
		}
	}
	if (!isDownStation()) {
		$("#dtStation").hide();
		$("#ddStation").hide();
	}
	if (isGwaySvr()) {
		$("#dtOfflineTimeout").show();
		$("#ddOfflineTimeout").show();
	}
}); 

function isDownStation() {
	var svrtype = getUrlParameter("svrtype");
	if (svrtype == "7") {
		return true;
	} else {
		return false;
	}
}

function isGwaySvr() {
	var svrtype = getUrlParameter("svrtype");
	if (svrtype == "2") {
		return true;
	} else {
		return false;
	}
}

function fillSelectStation(stations, area) {
	if (stations != null) {
		$.each(stations, function (i, fn) {
			if (area != null && fn.id == area) {
				$("#stationList").append("<option value='"+fn.id+"' selected>"+fn.name+"</option>");
			} else {
				$("#stationList").append("<option value='"+fn.id+"'>"+fn.name+"</option>");
			}
		});
	}
}

function loadLang(){
	$("#lableName").text(parent.lang.server_labelName);
	$("#lableIDNO").text(parent.lang.server_labelIDNO);
	$("#lableStation").text(parent.lang.server_labelDownStation);
	$("#lableLANAddr").text(parent.lang.server_labelLANAddr);
	if (!isDownStation()) {
		$("#lableWLANDevice").text(parent.lang.server_labelWLANDevice);
	} else {
		$("#lableWLANDevice").text(parent.lang.server_labelWifiDevice);
	}
	$("#lablePortDevice").text(parent.lang.server_labelPortDevice);
	$("#lableWLANClient").text(parent.lang.server_labelWLANClient);
	$("#lablePortClient").text(parent.lang.server_labelPortClient);
	$("#lablePortClientOther").text(parent.lang.server_labelPortClientOther);
	$("#lableWLANClient2").text(parent.lang.server_labelWLANClient2);
	$("#lableWLANDevice2").text(parent.lang.server_labelWLANDevice2);
	$("#lableOfflineTimeout").text(parent.lang.server_labelOfflineTimeout);
	$("#tipServerAddress2").text(parent.lang.server_tipServerAddress2);
	$("#save").text(parent.lang.save);
}

//function disableForm(disable) {
//	diableInput("#name", disable, true);
//	if (!isEditServer()) {
//		diableInput("#idno", disable, true);
//	}
//	diableInput("#lanAddress", disable, true);
//	diableInput("#deviceIp", disable, true);
//	diableInput("#deviceIp2", disable, true);
//	diableInput("#devicePort", disable, true);
//	diableInput("#clientIp", disable, true);
//	diableInput("#clientIp2", disable, true);
//	diableInput("#clientPort", disable, true);
//diableInput("#offlineTimeout", disable, true);
//	disableButton("#save", disable);
//}

function isEditServer() {
	var idno = getUrlParameter("idno");
	if (idno !== null && idno !== "") {
		return true;
	} else {
		return false;
	}
}

function ajaxLoadDownStation() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("StandardServerAction_allStation.action", function(json,action,success){
		if (success) {
			fillSelectStation(json.stations, null);	
		}
		$.myajax.showLoading(false);
		$.dialog({id: 'loading'}).close();
		disableForm(false);
	}, null);
}

function ajaxLoadInfo() {
	var idno = getUrlParameter("idno");
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("StandardServerAction_get.action?idno=" + idno, function(json,action,success){
		if (success) {
			$("#name").val(json.name);
			$("#idno").val(json.idno);
			$("#lanAddress").val(json.lanAddress);
			$("#deviceIp").val(json.deviceIp);
			$("#devicePort").val(json.devicePort);
			$("#clientIp").val(json.clientIp);
			$("#clientPort").val(json.clientPort);
			$("#deviceIp2").val(json.deviceIp2);
			$("#clientIp2").val(json.clientIp2);
			$("#clientPortOther").val(json.clientPortOther);
			if (json.offlineTimeout == null || json.offlineTimeout == 0) {
				json.offlineTimeout = 180;
			}
			$("#offlineTimeout").val(json.offlineTimeout);
			//加载下载站点
			if (isDownStation()) {
				fillSelectStation(json.stations, json.area);
			}
		}
		$.myajax.showLoading(false);
		$.dialog({id: 'loading'}).close();
		disableForm(false);
	}, null);
}

function checkName() {
	return checkInput("#name", "#nameWrong", 1, 32, parent.lang.errStringRequire, parent.lang.errNameRegex);
}

function checkIdno() {
	return checkDigitAlpha("#idno", "#idnoWrong", parent.lang.errStringRequire, parent.lang.errIDNORegex);
}

function checkLanAddress() {
	return checkIPAddress("#lanAddress", "#lanAddressWrong", parent.lang.server_errIPAddress);
}

function checkDeviceIp() {
	return checkIPAddress("#deviceIp", "#deviceIpWrong", parent.lang.server_errIPAddress);
}

function checkDeviceIp2() {
	return checkIPAddress("#deviceIp2", "#deviceIp2Wrong", parent.lang.server_errIPAddress);
}

function checkDevicePort() {
	return checkPortValid("#devicePort", "#devicePortWrong", parent.lang.server_errPort);
}

function checkClientIp() {
	return checkIPAddress("#clientIp", "#clientIpWrong", parent.lang.server_errIPAddress);
}

function checkClientIp2() {
	return checkIPAddress("#clientIp2", "#clientIp2Wrong", parent.lang.server_errIPAddress);
}

function checkClientPort() {
	return checkPortValid("#clientPort", "#clientPortWrong", parent.lang.server_errPort);
}

function checkOfflineTimeout() {
	if (isGwaySvr()) {
		var offlineTimeout = $.trim($("#offlineTimeout").val());
		if (offlineTimeout === "" || offlineTimeout < 30 || offlineTimeout > 1800) {
			$("#offlineTimeoutWrong").text(parent.lang.server_offlineTimeoutError);
			return false;
		} else {
			$("#offlineTimeoutWrong").text("");
			return true;
		}
	} else {
		return true;
	}
}

function checkDownStation() {
	if ($("#stationList").val() == 0) {
		//添加用户时，有角色的情况下，则必须选择相应的角色
		if ($("#stationList option").length > 1) {
			$("#stationWrong").text(parent.lang.server_selectStationTip);
			return false;
		} else {
			alert(parent.lang.server_downStationNullTip);
			return false;
		}
	} else {
		$("#stationWrong").text("*");
	}
	return true;
}

function checkParam() {
	var ret = true;
	if (!checkName()) {
		ret = false;
	}
	
	if (!checkIdno()) {
		ret = false;
	}
	
	if (isDownStation()) {
		if (!checkDownStation()) {
			ret = false;
		}
	}
	
	if (!checkLanAddress()) {
		ret = false;
	}

	if (!checkDeviceIp()) {
		ret = false;
	}
	
	if (!checkDeviceIp2()) {
		ret = false;
	}
	
	var devicePortValid = true;
	if (!checkDevicePort()) {
		ret = false;
		devicePortValid = false;
	}
	
	if (!checkClientIp()) {
		ret = false;
	}
	
	if (!checkClientIp2()) {
		ret = false;
	}
	
	var clientPortValid = true;
	if (!checkClientPort()) {
		ret = false;
		clientPortValid = false;
	}
	
	if (clientPortValid && devicePortValid) {
		if (!checkInputNotEqual("#devicePort", "#clientPort", "#clientPortWrong", parent.lang.server_errPortEqual)) {
			ret = false;
		}
	}
	
	if (!checkOfflineTimeout()) {
		ret = false;
	}
	
	return ret;
}

function getStationName() {
}

function ajaxSaveServer() {
	if (!checkParam()) {
		return ;
	}

	var data={};
	data.name = $.trim($("#name").val());
	data.idno = $.trim($("#idno").val());
	data.lanip = $.trim($("#lanAddress").val());
	if (isDownStation()) {
		data.area = $.trim($("#stationList").val());
	}
	data.deviceIp = $.trim($("#deviceIp").val());
	data.deviceIp2 = $.trim($("#deviceIp2").val());
	data.devicePort = $.trim($("#devicePort").val());
	data.clientIp = $.trim($("#clientIp").val());
	data.clientPort = $.trim($("#clientPort").val());
	data.clientPortOther = $.trim($("#clientPortOther").val());
	data.clientIp2 = $.trim($("#clientIp2").val());
	data.offlineTimeout = $.trim($("#offlineTimeout").val());
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action;
	if (isEditServer()) {
		action = 'StandardServerAction_save.action?idno=' + getUrlParameter("idno");
	} else {
		action = 'StandardServerAction_add.action?svrtype=' + getUrlParameter("svrtype");
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
			if (isDownStation()) {
				data.stationName = $('#stationList option:selected').text()
			}
			
			if (isEditServer()) {
				W.doEditSuc(getUrlParameter("idno"), data);
			} else {
				W.doAddSuc();
			}
		}
	});
}