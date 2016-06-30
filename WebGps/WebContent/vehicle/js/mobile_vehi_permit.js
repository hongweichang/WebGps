var api = frameElement.api, W = api.opener;
var vehiTree;
var vehiList;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//车辆树
	initVehiTree();
	diableInput("#user", true, true);
	//从服务器查询数据
	ajaxLoadInfo();
}); 

function loadLang(){
	$("#labelUser").text(parent.lang.mobile_labelSelectTerminal);
	$("#labelSearch").text(parent.lang.vehicle_group_labelSearchVehi);
	$("#labelVehi").text(parent.lang.usermgr_permit_labelVehi);
	$("#save").text(parent.lang.save);
}

function initVehiTree() {
	//生成权限树
	vehiTree = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
	vehiTree.enableCheckBoxes(1);
	vehiTree.enableThreeStateCheckboxes(true);
	vehiTree.setImagePath("../js/dxtree/imgs/");
}

function disableForm(disable) {
	disableButton("#save", disable);
}

function ajaxLoadInfo() {
	var idno = getUrlParameter("idno");
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("TerminalMobileAction_getPermit.action?idno=" + idno, function(json,action,success){
		if (success) {
			$("#user").val(json.username);
			//更新设备树
			vehiTree.fillGroup(json.groups);
			vehiTree.fillVehicle(json.vehicles);
			vehiTree.deleteItem(idno);
			vehiList = json.vehicles;
			//更新授权列表
			for (var i = 0; i < json.permits.length; i = i + 1) {
				vehiTree.setCheck(json.permits[i].devIdno, true);
			}
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function ajaxSavePermit() {
	var vehicles = vehiTree.getAllChecked().split(",");
	var permits = [];
	for (var i = 0; i < vehicles.length; i = i + 1) {
		if (!vehiTree.isGroupItem(vehicles[i])) {
			permits.push(vehicles[i]);
		}
	}
	var data = {};
	data.permits = permits.toString();
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action = 'TerminalMobileAction_savePermit.action?idno=' + getUrlParameter("idno");
	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		//关闭并退出对话框
		if (success) {
			W.doVehiclePermitSuc();
		}
	});
}

function searchVehicle() {
	setTimeout(function() {
		var name = $.trim($("#name").val());
		if (name !== "" && vehiList !== null) {
			vehiTree.searchVehicle(name);
		}
	}, 200);
}