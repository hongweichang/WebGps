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
	$("#ssid").blur(checkSsid);
	$('.btnSave').on('click',ajaxSaveStation);
	if (isEditStation()) {
		//从服务器查询数据
		ajaxLoadInfo();
	} else {		
	}
}); 

function loadLang(){
	$("#lableName").text(parent.lang.server_labelName);
	$("#lableSsid").text(parent.lang.server_labelSsid);
	$("#typeTip").text(parent.lang.server_stationTip);
	$("#save").text(parent.lang.save);
}

//function disableForm(disable) {
//	diableInput("#name", disable, true);
//	diableInput("#ssid", disable, true);
//	disableButton("#save", disable);
//}

function isEditStation() {
	var id = getUrlParameter("id");
	if (id !== null && id !== "") {
		return true;
	} else {
		return false;
	}
}

function ajaxLoadInfo() {
	var id = getUrlParameter("id");
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("StandardServerAction_getStation.action?id=" + id, function(json,action,success){
		if (success) {
			$("#name").val(json.station.name);
			$("#ssid").val(json.station.ssid);
		}
		$.myajax.showLoading(false);
		$.dialog({id: 'loading'}).close();
		disableForm(false);
	}, null);
}

function checkName() {
	return checkInput("#name", "#nameWrong", 1, 32, parent.lang.errStringRequire, parent.lang.errNameRegex);
}

function checkSsid() {
	return checkInput("#ssid", "#ssidWrong", 1, 32, parent.lang.errStringRequire, parent.lang.errNameRegex);
}

function checkParam() {
	var ret = true;
	if (!checkName()) {
		ret = false;
	}
	
	if (!checkSsid()) {
		ret = false;
	}
	
	return ret;
}

function ajaxSaveStation() {
	if (!checkParam()) {
		return ;
	}

	var data={};
	data.name = $.trim($("#name").val());
	data.ssid = $.trim($("#ssid").val());
	data.type = 2;
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action;
	if (isEditStation()) {
		action = 'StandardServerAction_saveStation.action?id=' + getUrlParameter("id");
	} else {
		action = 'StandardServerAction_addStation.action';
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
			if (isEditStation()) {
				W.doEditStationSuc(getUrlParameter("id"), data);
			} else {
				W.doAddStationSuc();
			}
		}
	});
}