var api = frameElement.api, W = api.opener;
var vehiTree;
var searchTimer = null;
var onlySelectOne = false;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.save, name : '', pclass : 'btnSave',
				bgcolor : 'gray', hide : false}]
		]
	});
	//加载语言
	loadSelectVehicleLang();
	//初始化树
	vehiTree = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
	vehiTree.setImagePath("../../js/dxtree/imgs/");
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
	var parentId = 0;
	for(var i = 0; i < parent.vehiGroupList.length; i++) {
		if(parent.vehiGroupList[i].id == parent.companyId) {
			parentId = parent.vehiGroupList[i].parentId;
		}
	}
	
	vehiTree.fillGroup(parent.vehiGroupList,parentId, parent.lang.all_vehicles);
	vehiTree.fillVehicle(parent.vehicleList);
	//初始化选中的车辆
	var vehicles = decodeURIComponent(getUrlParameter("vehicles")).split(",");
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
	$(".btnSave").click(saveSelectVehicle);
}); 

function loadSelectVehicleLang(){
	$("#labelSearch").text(parent.lang.label_search_vehicle);
	$("#labelSelectVehicle").text(parent.lang.label_selected_vehicle);
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