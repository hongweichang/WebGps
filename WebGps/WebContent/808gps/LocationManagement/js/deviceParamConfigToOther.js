var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');//类型  808 或者 ttx
var vehiTeamTree;  //车辆树
$(document).ready(function(){
	loadReadyPage();
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}

function loadPage(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.save, name : '', pclass : 'save',
				bgcolor : 'gray', hide : false}],
			[{display: parent.lang.close, name : '', pclass : 'close',
				bgcolor : 'gray', hide : false}]
		]
	});
	
	//加载车辆树
	loadVehicleTree();
	
	//保存事件
	$('.save').on('click', saveConfigToOther);
	
	//关闭事件
	$('.close').on('click',function() {
		W.$.dialog({id:'configToOther'}).close();
	});
}

/*
 * 加载车辆树
 */
function loadVehicleTree() {
	vehiTeamTree = new vehicleTeamTree();
	vehiTeamTree.setRootId(parent.companyId);
	vehiTeamTree.setTeamList(parent.vehicleManager.getAllVehiTeam());
	
	var lstVehicle = [];
	var vehicles = null;
	if(type && type == '808') {
		vehicles = parent.vehicleManager.get808ParamConfigVehicle();
	}else if(type && type == 'ttx'){
		vehicles = parent.vehicleManager.getTtxParamConfigVehicle();
	}
	if(vehicles) {
		for (var i = 0; i < vehicles.length; i++) {
			if(vehicles[i].getIdno() != W.vehiIdno) {
				lstVehicle.push(vehicles[i]);
			}
		}
	}
	vehiTeamTree.setVehiList(lstVehicle);
	vehiTeamTree.setIsSearch(true);
	vehiTeamTree.setCountGroup(true);
	vehiTeamTree.initVehiTeamTree('vehiTeamTree', 'vehicleTree', '../../js/dxtree/imgs/');
	vehiTeamTree.loadVehiTeamTree('searchTeam', 'searchVehi');
	vehiTeamTree.setHeight(212, 312);
}

//保存  选择车辆到父级保存
function saveConfigToOther() {
	var selList = vehiTeamTree.selectCheckedVehicle();
	if(selList == null || selList == '' || selList.length == 0) {
		$.dialog.tips(parent.lang.selectVehicleTip, 1);
		return;
	}
	W.saveToOtherSuccess(selList);
}