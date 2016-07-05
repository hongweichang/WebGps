var api = frameElement.api, W = api.opener;
var vehiTeamTree;  //车辆树
var protocol = getUrlParameter('protocol');
var factoryType = getUrlParameter('factoryType');
var fileId = getUrlParameter('fileId');
var fileType = getUrlParameter('fileType');
$(document).ready(function(){
	loadReadyPage();
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
		setPanelWidth();
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
	$('.save').on('click',saveOilToOther);
	
	//关闭事件
	$('.close').on('click',function() {
		W.$.dialog({id:'upgradeToOther'}).close();
		W.closeMapPop();
	});
}

/*
 * 加载车辆树
 */
function loadVehicleTree() {
	vehiTeamTree = new vehicleTeamTree();
	vehiTeamTree.setRootId(parent.companyId);
	vehiTeamTree.setTeamList(parent.vehicleManager.getAllVehiTeam());
	vehiTeamTree.setVehiList(parent.vehicleManager.getUpgradeVehicle(protocol, factoryType));
	vehiTeamTree.setIsSearch(true);
	vehiTeamTree.setCountGroup(true);
	vehiTeamTree.initVehiTeamTree('vehiTeamTree', 'vehicleTree', '../../js/dxtree/imgs/');
	vehiTeamTree.loadVehiTeamTree('searchTeam', 'searchVehi');
}

/*
 * 获取公司父结点id
 */
function getCompanySid() {
	var sid = parent.companyId;
	return sid;
}

function saveOilToOther() {
	var selList = vehiTeamTree.selectCheckedVehicle();
	if(selList == null || selList == '' || selList.length == 0) {
		$.dialog.tips(parent.lang.selectVehicleTip, 1);
		return;
	}
	var devIdnos = "";
	var listDev = [];
	var devList = [];
	for (var j = 0; j < selList.length; j++) {
		var vehicle = parent.vehicleManager.mapVehiList.get(selList[j]);
		devList = vehicle.devList;
		for (var i = 0; i < devList.length; i++) {
			if(devList[i].status.protocol == protocol && devList[i].status.factoryType == factoryType){
				listDev.push(devList[i]);
			}
		}
	}
	for (var i = 0; i < listDev.length; i++) {
		devIdnos += listDev[i].idno;
		if(i != listDev.length-1){
			devIdnos += ",";
		}
	}
	var action = 'StandardDeviceAction_saveOtherUpgrade.action?devIdnos='+devIdnos;
	var data = {};
	data.ft = fileType;
	data.fid = fileId;
	data.ct = new Date();
	data.ts = 0;
	
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, data, false, function(json, success) {
		$.myajax.showLoading(false);
		if (success) {
			W.$.dialog({id:'upgradeToOther'}).close();
			$.dialog.tips(parent.lang.saveok, 1);
		}
	});
}

//改变窗口大小时加载页面
function setPanelWidth() {
	$('#vehicle_top').height(500);
	$('#vihicle_tree').height($(window).height() - $('#toolbar-btn').height() - 25);
}