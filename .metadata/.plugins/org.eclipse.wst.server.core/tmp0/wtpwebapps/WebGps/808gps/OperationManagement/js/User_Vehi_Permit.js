var api = frameElement.api, W = api.opener;
var vehiTree;
var vehiList;
var companys = [];

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
	diableInput("#user", true, true);
	//从服务器查询数据
	ajaxLoadInfo();
	$(".btnSave").click(ajaxSavePermit);
}); 

function loadLang(){
	$("#labelUser").text(parent.lang.label_permit_labelUser);
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
	$.myajax.jsonGet("StandardUserAction_findUserAccount.action?id=" + id, function(json,action,success){
		if (success) {
			var company_ = json.company;
			var myVehicles = json.myVehicles;
			$("#user").val(json.user.name);
			if(json.company) {
				$.myajax.jsonGet('StandardUserAction_loadCompanyVehicleList.action?type=0', function(json,action,success){
					if(success) {
						var allCompanys = json.companys;
						vehiList = json.partVehis;
						for(var i = 0;i < allCompanys.length; i++) {
							if(allCompanys[i].id == company_.id){
								companys.push(allCompanys[i]);
							};
						}
						for(var i = 0;i < companys.length; i++) {
							getChildCompanys(allCompanys,companys,companys[i].id);
						};
						//更新设备树
						vehiTree.fillGroup(companys,company_.parentId, parent.lang.all_vehicles);
						vehiTree.fillVehicle(vehiList);
						
						//更新授权列表
						for (var i = 0; i < myVehicles.length; i = i + 1) {
							vehiTree.setCheck(myVehicles[i].parentId, true);
						}
					};
				}, null);
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
	var action = 'StandardUserAction_savePermit.action?id=' + getUrlParameter("id");
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