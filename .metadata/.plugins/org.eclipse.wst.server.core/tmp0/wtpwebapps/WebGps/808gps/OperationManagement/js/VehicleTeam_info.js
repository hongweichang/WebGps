var api = frameElement.api, W = api.opener;
var priviTree;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.save, name : '', pclass : 'btnSave',
				bgcolor : 'gray', hide : false}]
		]
	});
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
	$(".btnSave").click(ajaxSaveGroup);
}); 

function loadLang(){
	$("#labelName").text(parent.lang.vehicle_team_labelName);
	$("#labelParent").text(parent.lang.vehicle_team_labelParent);
	$("#save").text(parent.lang.save);
}

//function disableForm(disable) {
//	diableInput("#name", disable, true);
//	disableButton("#save", disable);
//}

function isEditGroup() {
	var id = getUrlParameter("id");
	if (id !== null && id !== "") {
		return true;
	} else {
		return false;
	}
}

function ajaxLoadInfo() {
	$("#name").val(getArrayName(parent.vehiGroupList,getUrlParameter("id")));
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
	data.name = $.trim($.trim($("#name").val()));	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action;
	if (isEditGroup()) {
		action = 'StandardVehicleTeamAction_save.action?id=' + getUrlParameter("id");
	} else {
		data.parentId = $.trim(getUrlParameter("parentId"));
		action = 'StandardVehicleTeamAction_add.action';
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