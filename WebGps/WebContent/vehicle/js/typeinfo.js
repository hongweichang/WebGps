var api = frameElement.api, W = api.opener;

$(document).ready(function(){
	//加载语言
	loadLang();
	//配置失去焦点的事件
	$("#name").blur(checkName);
	if (isEditType()) {
		//从服务器查询数据
		ajaxLoadInfo();
	}
}); 

function loadLang(){
	$("#labelName").text(parent.lang.monitor_myMapType);
	$("#save").text(parent.lang.save);
}

function disableForm(disable) {
	diableInput("#name", disable, true);
	disableButton("#save", disable,true);
}

function isEditType() {
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
	$.myajax.jsonGet("VehicleAction_getType.action?id=" + id, function(json,action,success){
		if (success) {
			$("#name").val(json.vehiType.name);
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function checkName() {
	return checkInput("#name", "#nameWrong", 1, 32, parent.lang.errStringRequire, parent.lang.errNameRegex);
}

function ajaxSaveType() {
	if (!checkName()) {
		return ;
	}

	var data={};
	data.name = $("#name").val();
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action;
	if (isEditType()) {
		action = 'VehicleAction_saveType.action?id=' + getUrlParameter("id");
	}else{
		data.brandId = getUrlParameter("brandId")
		action = 'VehicleAction_addType.action';
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
			if (isEditType()) {
				W.doEditTypeSuc(getUrlParameter("id"), data.name);
			} else {
				W.doAddTypeSuc(json.deviceType);
			}
		}
	});
}