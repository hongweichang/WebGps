var api = frameElement.api, W = api.opener;
var vehiTree;
var searchTimer = null;
var onlySelectOne = false;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadSelectVehicleLang();
	//初始化树
	vehiTree = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
	vehiTree.setImagePath("../js/dxtree/imgs/");
	var temp = getUrlParameter("onlySelectOne");
	if (temp != "" && temp == "true") {
		onlySelectOne = true;
	}
	if (!onlySelectOne) {
		vehiTree.enableCheckBoxes(true);
		vehiTree.enableThreeStateCheckboxes(true);
	} else {
		vehiTree.enableCheckBoxes(false);
		vehiTree.enableThreeStateCheckboxes(false);
	}
	//加载车辆
	vehiTree.fillGroup(parent.vehiGroupList);
	vehiTree.fillVehicle(parent.vehicleList);
	//初始化选中的车辆
	var vehicles = getUrlParameter("devices").split(",");
	if (!onlySelectOne) {
		for (var i = 0; i < vehicles.length; i = i + 1) {
			vehiTree.setCheck(vehicles[i], true);
		}
	} else {
		if (vehicles.length > 0 && vehicles[0] != "") {
			vehiTree.selectItem(vehicles[0]);
			vehiTree.focusItem(vehicles[0]);
		}
	}
}); 

function loadSelectVehicleLang(){
	$("#labelSearch").text(parent.lang.vehicle_group_labelSearchVehi);
	$("#labelSelectVehicle").text(parent.lang.vehicle_group_labelSelectedVehi);
	$("#save").text(parent.lang.save);
}

function saveSelectVehicle() {
	var selVehicles = [];
	if (!onlySelectOne) {
		var vehicles = vehiTree.getAllChecked().split(",");
		for (var i = 0; i < vehicles.length; i = i + 1) {
			if (!vehiTree.isGroupItem(vehicles[i])) {
				selVehicles.push(vehicles[i]);
			}
		}
	} else {
		var selId = vehiTree.getSelectedItemId();
		if (!vehiTree.isRootItem(selId) && !vehiTree.isGroupItem(selId)) {
			selVehicles.push(selId);
		} else {
			alert(parent.lang.report_selectVehiNullErr);
			return ;
		}
	}
	
	W.doSelectVehicle(selVehicles);
}

function searchVehicle() {
	if (searchTimer == null) {
		searchTimer = setTimeout(function() {
			var name = $.trim($("#name").val());
			if (name !== "") {
				vehiTree.searchVehicle(name);
			}
			searchTimer = null;
		}, 200);
	}
}