var api = frameElement.api, W = api.opener;
var vehiTree;

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
	//初始化树
	vehiTree = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
	vehiTree.setImagePath("../../js/dxtree/imgs/");
	diableInput("#name", true, true);
	if (isMoveGroup()) {
		$("#labelName").text(parent.lang.vehicle_team_labelSelectedGroup);
		$("#labelSelectGroup").text(parent.lang.vehicle_team_labelSelectCompany);
	} else {
		$("#labelName").text(parent.lang.vehicle_team_labelSelectedVehi);
		$("#labelSelectGroup").text(parent.lang.vehicle_team_labelSelectGroup);
	}
	$("#name").val(decodeURI(getUrlParameter("name")));
	//从服务器查询数据
	ajaxLoadInfo();
	$(".btnSave").click(ajaxSaveMove);
}); 

function loadLang(){
	$("#save").text(parent.lang.save);
}

function isMoveGroup() {
	if (getUrlParameter("vehiIdno") !== "") {
		return false;
	} else {
		return true;
	}
}

//function disableForm(disable) {
//	disableButton("#save", disable);
//}

function ajaxLoadInfo() {
	var teams = [];
	if(isMoveGroup()) {
		for(var i = 0; i < parent.vehiGroupList.length; i++) {
			if(getUrlParameter("groupId") != null && parent.vehiGroupList[i].id == Number(getUrlParameter("groupId"))){
				
			}else {
				if(parent.vehiGroupList[i].level != 3) {
					teams.push(parent.vehiGroupList[i]);
				}
			}
		//	if(parent.vehiGroupList[i].level == 1) {
				
		//	}
		}
	}else {
		teams = parent.vehiGroupList;
	}

	vehiTree.fillGroup(teams, 0, parent.lang.all_companies);
//	vehiTree.deleteItem(vehiTree.getTreeGroupId(getUrlParameter("groupId")));
}

function ajaxSaveMove() {
	var selId = vehiTree.getSelectedItemId();
	var data={};
	data.parentId = vehiTree.getVehiGroupId(selId);
	var action;
	if (isMoveGroup()) {	
		action = 'StandardVehicleTeamAction_move.action?groupId=' + getUrlParameter("groupId");
	} else {
		if (vehiTree.isRootItem(selId)) {
			alert(parent.lang.vehicle_team_selectGroupNode);
			return ;
		}
		action = 'StandardVehicleTeamAction_move.action?vehiIdno=' + getUrlParameter("vehiIdno");
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
				data.vehiIdno = decodeURIComponent(getUrlParameter("vehiIdno"));
			}
			W.doMoveGroupSuc(data);
		}
	});
}