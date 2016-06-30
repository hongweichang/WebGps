var api = frameElement.api, W = api.opener;
var vehiTree;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//初始化树
	vehiTree = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
	vehiTree.setImagePath("../js/dxtree/imgs/");
	diableInput("#name", true, true);
	if (isMoveGroup()) {
		$("#labelName").text(parent.lang.vehicle_group_labelSelectedGroup);
	} else {
		$("#labelName").text(parent.lang.vehicle_group_labelSelectedVehi);
	}
	$("#name").val(decodeURI(getUrlParameter("name")));
	//从服务器查询数据
	ajaxLoadInfo();
}); 

function loadLang(){
	$("#labelSelectGroup").text(parent.lang.vehicle_group_labelSelectGroup);
	$("#save").text(parent.lang.save);
}

function isMoveGroup() {
	if (getUrlParameter("devIdno") !== "") {
		return false;
	} else {
		return true;
	}
}

function disableForm(disable) {
	disableButton("#save", disable);
}

function ajaxLoadInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("VehiGroupAction_groupList.action", function(json,action,success){
		if (success) {
			vehiTree.fillGroup(json.groups);
			if (isMoveGroup()) {
				vehiTree.deleteItem(vehiTree.getTreeGroupId(getUrlParameter("groupId")));
			}
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function ajaxSaveMove() {
	var selId = vehiTree.getSelectedItemId();

	var data={};
	data.parentId = vehiTree.getVehiGroupId(selId);
	var action;
	if (isMoveGroup()) {	
		action = 'VehiGroupAction_move.action?groupId=' + getUrlParameter("groupId");
	} else {
		if (vehiTree.isRootItem(selId)) {
			alert(parent.lang.vehicle_group_selectGroupNode);
			return ;
		}
		
		action = 'VehiGroupAction_move.action?devIdno=' + getUrlParameter("devIdno");
	}
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		//关闭并退出对话框
		if (success) {
			data.groupId = null;
			if (isMoveGroup()) {
				data.groupId = getUrlParameter("groupId");
			} else {
				data.devIdno = getUrlParameter("devIdno");
			}
			W.doMoveGroupSuc(data);
		}
	});
}