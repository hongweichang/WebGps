var api = frameElement.api, W = api.opener;
var vehiTree;
var vehiList;

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
	//车辆树
	initVehiTree();
	diableInput("#rule", true, true);
	//从服务器查询数据
	ajaxLoadInfo();
	$(".btnSave").click(ajaxSavePermit);
}); 

function loadLang(){
	$("#labelRule").text(parent.lang.rule_selectedRule);
	$("#labelSearch").text(parent.lang.label_search_vehicle);
	$("#labelVehi").text(parent.lang.label_selected_vehicle);
}

function initVehiTree() {
	//生成权限树
	vehiTree = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
	vehiTree.enableCheckBoxes(1);
	vehiTree.enableThreeStateCheckboxes(true);
	vehiTree.setImagePath("../../js/dxtree/imgs/");
}

//function disableForm(disable) {
//	disableButton(".btnSave", disable);
//}

function ajaxLoadInfo() {
	var id = getUrlParameter("id");
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("StandardVehicleRuleAction_loadVehicleRulePermit.action?id=" + id, function(json,action,success){
		if (success) {
			vehiList = json.vehicles;
			var myVehicles = json.myVehicles;
			$("#rule").val(decodeURIComponent(getUrlParameter("name")));
			
			//更新设备树
			vehiTree.fillGroup(json.companys,json.companys[0].parentId, parent.lang.all_vehicles);
			vehiTree.fillVehicle(vehiList);
			
			//更新授权列表
			for (var i = 0; i < myVehicles.length; i = i + 1) {
				vehiTree.setCheck(myVehicles[i].id, true);
			}
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function ajaxSavePermit() {
	var vehicles = (vehiTree.getAllChecked()+'').split(",");
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
	var action = 'StandardVehicleRuleAction_saveRulePermit.action?id=' + getUrlParameter("id");
	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		//关闭并退出对话框
		if (success) {
			W.doRulePermitSuc();
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