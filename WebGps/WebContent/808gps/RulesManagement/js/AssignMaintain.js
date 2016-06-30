var vehiTreeGroup;		//车辆树
var ruleTreeGroup;		//规则树
var vehiGroupList = null;	//公司列表
var vehiAllList = null;	//车辆列表
var ruleList = null;	//规则列表
var ruleGroup = [];   //规则分组
var mid = 0;
var oldSelectedVehiIdno = null; //最后选择的车牌号
var oldSelectedCompanyId = null; //最后选择的公司

$(document).ready(function(){
	var width = $(window).width();
	if(width < 1024) {
		width = 1024;
	}
	width = width - 100;
	$("#left").width(width/2);
	$("#right").width(width/2);
	//加载语言
	loadLang();
	//加载车辆树
	vehiTreeGroup = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
	vehiTreeGroup.setImagePath("../../js/dxtree/imgs/");
	vehiTreeGroup.enableDragAndDrop(false);
//	vehiTreeGroup.enableCheckBoxes(1);
	vehiTreeGroup.enableThreeStateCheckboxes(true);
	vehiTreeGroup.setOnDblClickHandler(doResetVehi);
	vehiGroupList = parent.vehiGroupList;
	for(var i = 0; i < vehiGroupList.length; i++) {
		if(vehiGroupList[i].id == parent.companyId) {
			mid = vehiGroupList[i].parentId;
		}
	}
	vehiTreeGroup.fillGroup(vehiGroupList, mid, parent.lang.all_vehicles);
	if (vehiGroupList.length >= 15) {
		if (vehiGroupList != null && vehiGroupList.length > 0) {
			for (var i = 0; i < vehiGroupList.length; ++ i) {
				var groupItem = vehiTreeGroup.getTreeGroupId(vehiGroupList[i].id);
				var subItems = vehiTreeGroup.getAllSubItems(groupItem).toString().split(',');
				if (subItems.length > 0) {
					var alldevice = true;
					for (var j = 0; j < subItems.length; ++ j) {
						if (subItems[j] != "") {
							if (vehiTreeGroup.isGroupItem(subItems[j])) {
								alldevice = false;
								break;
							}
						}
					}
					if (alldevice) {
						vehiTreeGroup.closeItem(groupItem);
					}
				}
			}
		}
	}
	
	
	ruleTreeGroup = new dhtmlXTreeObject("rule_tree", "100%", "100%", 0);
	ruleTreeGroup.setImagePath("../../js/dxtree/imgs/");
	ruleTreeGroup.enableDragAndDrop(false);
	ruleTreeGroup.enableCheckBoxes(1);
	ruleTreeGroup.enableThreeStateCheckboxes(true);
	//加载规则列表
	loadRuleGroup();
	loadRuleTree(parent.companyId);

	$('#toolbar-btn').flexPanel({
		ButtonsModel : [[{
			display: parent.lang.saveSettings, name : '', pclass : 'btnSave',bgcolor : 'gray', hide : false
		}]]
	});

	//加载车辆列表
	ajaxLoadInfo();

	$('.btnSave','#toolbar-btn').on('click',function(){
		if(!confirm(parent.lang.rule_saveconfirm)) {
			return ;
		}
		var selId = vehiTreeGroup.getSelectedItemId();
		var rules = (ruleTreeGroup.getAllChecked()+'').split(",");
		var permits = [];
		for (var i = 0; i < rules.length; i = i + 1) {
			if (!ruleTreeGroup.isGroupItem(rules[i])) {
				permits.push(rules[i]);
			}
		}
//		if(permits.length == 0 || (permits.length == 1 && permits[0] == '')) {
//			$.dialog.tips(parent.lang.rule_ruleNotSelected, 2);
//			return;
//		}
//		if(vehiTreeGroup.isGroupItem(selId)) {
//			$.dialog.tips(parent.lang.rule_vehicleNotSelected, 2);
//			return;
//		}
		var flag = false; 
		if(oldSelectedVehiIdno != null && oldSelectedVehiIdno == selId) {
			flag = true;
		}
		if(oldSelectedCompanyId != null) {
			for(var i = 0; i < vehiAllList.length; i++) {
				if(vehiAllList[i].name == selId && vehiAllList[i].parentId == oldSelectedCompanyId) {
					flag = true;
					break;
				}
			}
		}
		if(flag) {
			var data = {};
			data.permits = permits.toString();

			disableForm(true);
			$.myajax.showLoading(true, parent.lang.saving);
			var action = 'StandardVehicleRuleAction_saveVehicleRulePermit.action?vehiIdno=' + encodeURI(selId);
			$.myajax.jsonPost(action, data, false, function(json, success) {
				disableForm(false);
				$.myajax.showLoading(false);
				//关闭并退出对话框
				if (success) {
					$.dialog.tips(parent.lang.saveok, 1);
				}
			});
		}else {
			$.dialog.tips(parent.lang.rule_vehicleNotMatch, 2);
		}
	});
}); 

function loadLang(){
	$("#groupTitle").text(parent.lang.rule_assignMaintain_vehicle);
	$("#searchVehicle").text(parent.lang.vehicle_team_labelSearchVehi);
	$("#tipDrag").text(parent.lang.rule_assignRuleTip);
	
	$("#spanSelectVehicle").text(parent.lang.rule_selectVehicle);
	$("#spanSelectRule").text(parent.lang.rule_selectRule);
	$("#searchRule").text(parent.lang.rule_findRule);
}

//function disableForm(disable) {
//	diableInput("#name", disable, true);
//	diableInput("#ruleName", disable, true);
//	disableButton("#save", disable);
//}

var currentPage = 1;
var pageRecords = 2000;
var loadAllRecords = 0;
var delPageRecords = 0;
function ajaxLoadInfo() {
	if(currentPage == 1) {
		pageRecords = 500;
		loadAllRecords = 0;
		vehiAllList = [];
	}
	var pagination={currentPage:currentPage, pageRecords:pageRecords};
	var action = "StandardVehicleAction_loadPaginVehicleList.action";
	$.myajax.showTopLoading(true, parent.lang.loading);
	$.myajax.jsonGetEx(action, function(json, success) {
		if(vehiAllList.length == 0) {
			vehiAllList = json.vehicles;
		}else {
			vehiAllList.concat(json.vehicles);
		}
		vehiTreeGroup.fillVehicle(json.vehicles);
		$.myajax.showTopLoading(false);
		if(json.pagination.totalPages >= currentPage+1) {
			loadAllRecords = loadAllRecords + json.vehicles.length;
			if(!confirm(parent.lang.isProceedLoad.replace(/{number}/, loadAllRecords))) {
				currentPage = 1;
				return ;
			}
			currentPage++;
			if(pageRecords > delPageRecords) {
				pageRecords = pageRecords - delPageRecords;
			}
			ajaxLoadInfo();
		}else {
			currentPage = 1;
			$.dialog.tips(parent.lang.loadingComplete, 2);
		}
	}, pagination, null);	

}

function doResetVehi() {
	if (!vehiTreeGroup.isSelectNull() && !vehiTreeGroup.isSelectRootItem()) {
		var selId = vehiTreeGroup.getSelectedItemId();
		oldSelectedVehiIdno = null;
		oldSelectedCompanyId = null;
		if(vehiTreeGroup.isGroupItem(selId)) {
			var vehiGroupId = vehiTreeGroup.getVehiGroupId(selId);
			if(vehiGroupId != mid) {
				ruleTreeGroup.deleteItem(ruleTreeGroup.getTreeGroupId(0), false);
				loadRuleTree(vehiGroupId);
			}
		}else {
			ruleTreeGroup.deleteItem(ruleTreeGroup.getTreeGroupId(0), false);
			loadRuleTreeByVehicle(selId);
		}
	}
}

function searchVehicle() {
	setTimeout(function() {
		var name = $.trim($("#name").val());
		if (name != "" && parent.vehiGroupList != null) {
			vehiTreeGroup.searchVehicle(name);
		} 
	}, 200);
}

function searchRule() {
	setTimeout(function() {
		var name = $.trim($("#ruleName").val());
		if (name != "" && ruleList != null) {
			ruleTreeGroup.searchVehicle(name);
		} 
	}, 200);
}

//加载规则树  id 公司id
function loadRuleTree(id) {
	ruleTreeGroup.fillRuleGroup(ruleGroup,0,parent.lang.rule_allRule);
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	$.myajax.jsonGet('StandardVehicleRuleAction_loadCompanyRules.action?id='+id, function(json,action,success){
		if (success) {
			ruleList = json.ruleList;
			ruleTreeGroup.fillOther(ruleList);
			oldSelectedCompanyId = id;
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

//加载规则树  vehiIdno车牌号
function loadRuleTreeByVehicle(vehiIdno) {
	ruleTreeGroup.fillRuleGroup(ruleGroup,0,parent.lang.rule_allRule);
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	$.myajax.jsonGet('StandardVehicleRuleAction_loadRulesByVehicle.action?vehiIdno='+encodeURI(vehiIdno), function(json,action,success){
		if (success) {
			ruleList = json.ruleList;
			ruleTreeGroup.fillOther(ruleList);
			//更新授权列表
			for (var i = 0; i < json.myRuleList.length; i = i + 1) {
				ruleTreeGroup.setCheck(json.myRuleList[i].id, true);
			}
			oldSelectedVehiIdno = vehiIdno;
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function loadRuleGroup() {
	ruleGroup.push({id:1,name:parent.lang.rule_fatigue,parentId:0});
	ruleGroup.push({id:2,name:parent.lang.rule_forbidInto,parentId:0});
	ruleGroup.push({id:3,name:parent.lang.rule_forbidOut,parentId:0});
	ruleGroup.push({id:4,name:parent.lang.rule_areaPeriodSpeed,parentId:0});
	ruleGroup.push({id:7,name:parent.lang.rule_lineOffset,parentId:0});
	ruleGroup.push({id:5,name:parent.lang.rule_periodSpeed,parentId:0});
	ruleGroup.push({id:6,name:parent.lang.rule_parkingTooLong,parentId:0});
	ruleGroup.push({id:8,name:parent.lang.rule_timingPicture,parentId:0});
	ruleGroup.push({id:9,name:parent.lang.rule_timerRecording,parentId:0});
	ruleGroup.push({id:10,name:parent.lang.rule_wifiDownload,parentId:0});
	ruleGroup.push({id:11,name:parent.lang.rule_roadGrade,parentId:0});
}