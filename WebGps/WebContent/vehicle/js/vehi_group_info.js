var api = frameElement.api, W = api.opener;
var priviTree;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	diableInput("#parent", true, true);
	$("#parent").val(decodeURI(getUrlParameter("parent")));
	//配置失去焦点的事件
	$("#name").blur(checkName);
	if (isEditGroup()) {
		//从服务器查询数据
		ajaxLoadInfo();
	} 
}); 

function loadLang(){
	$("#labelName").text(parent.lang.vehicle_group_labelName);
	$("#labelParent").text(parent.lang.vehicle_group_labelParent);
	$("#save").text(parent.lang.save);
}

function disableForm(disable) {
	diableInput("#name", disable, true);
	disableButton("#save", disable);
}

function isEditGroup() {
	var id = getUrlParameter("id");
	if (id !== null && id !== "") {
		return true;
	} else {
		return false;
	}
}

function ajaxLoadInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("VehiGroupAction_get.action?id=" + getUrlParameter("id"), function(json,action,success){
		if (success) {
			$("#name").val(json.group.name);
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function checkName() {
	return checkInput("#name", "#nameWrong", 1, 64, parent.lang.errStringRequire, parent.lang.errNameRegex);
}

function checkParam() {
	var ret = true;
	if (!checkName()) {
		ret = false;
	}
	
	return ret;
}

function ajaxSaveGroup() {
	if (!checkParam()) {
		return ;
	}

	var data={};
	data.name = $.trim($("#name").val());	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action;
	if (isEditGroup()) {
		action = 'VehiGroupAction_save.action?id=' + getUrlParameter("id");
	} else {
		data.parentId = getUrlParameter("parentId");
		action = 'VehiGroupAction_add.action';
	}
	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		//关闭并退出对话框
		if (success) {
			if (isEditGroup()) {
				data.id = getUrlParameter("id");
				W.doEditGroupSuc(getUrlParameter("id"), data);
			} else {
				data.id = json.id;
				W.doAddGroupSuc( data);
			}
		}
	});
}