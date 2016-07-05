var api = frameElement.api, W = api.opener;
var vehiTeamTree;  //车辆树
var vehiIdno = decodeURIComponent(getUrlParameter('vehiIdno'));//不包含的车辆
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
	$('.save').on('click', saveFlowToOther);
	
	//关闭事件
	$('.close').on('click',function() {
		W.$.dialog({id:'flowToOther'}).close();
	});
}

/*
 * 加载车辆树
 */
function loadVehicleTree() {
	vehiTeamTree = new vehicleTeamTree();
	vehiTeamTree.setRootId(parent.companyId);
	vehiTeamTree.setTeamList(parent.vehicleManager.getAllVehiTeam());
	
	var lstVehicle = new Array();
	var videoVehicles = parent.vehicleManager.getAllVehicle();
	for (var i = 0; i < videoVehicles.length; i++) {
		if(videoVehicles[i].getIdno() != W.vehiIdno) {
			lstVehicle.push(videoVehicles[i]);
		}
	}
	vehiTeamTree.setVehiList(lstVehicle);
	vehiTeamTree.setIsSearch(true);
	vehiTeamTree.setCountGroup(true);
	vehiTeamTree.initVehiTeamTree('vehiTeamTree', 'vehicleTree', '../../js/dxtree/imgs/');
	vehiTeamTree.loadVehiTeamTree('searchTeam', 'searchVehi');
	vehiTeamTree.setHeight(212, 312);
}

//保存
function saveFlowToOther() {
	var selList = vehiTeamTree.selectCheckedVehicle();
	if(selList == null || selList == '' || selList.length == 0) {
		$.dialog.tips(parent.lang.selectVehicleTip, 1);
		return;
	}
	var lstDevice = new Array();
	var lstIdno = new Array();
	for (var i = 0; i < selList.length; i++) {
		var vehicle = parent.vehicleManager.getVehicle(selList[i].toString());
		if(vehicle != null){
			var valiDevice = null;
			if(vehicle.getDevList().length == 1) {
				valiDevice = vehicle.getGpsDevice();
			}else {
				valiDevice = vehicle.getVideoDevice();
			}
			if(valiDevice != null) {
				lstDevice.push(valiDevice);
				lstIdno.push(valiDevice.getIdno());	
			}
		}
	}
	var action = 'StandardFlowAction_saveFlowToOther.action?devIdno='+ W.device.getIdno();
	var data = {};
	data.devIdnos = lstIdno.toString();
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			for (var i = 0; i < lstDevice.length; i++) {
				lstDevice[i].setFlowLimitType(W.overFlowLimitOpen);
			}
			W.saveToOtherSuccess();
		}
	});
}