var api = frameElement.api, W = api.opener;
var vehiTeamTree;  //车辆树
var changeOil = getUrlParameter('changeOil');
var resistance = getUrlParameter('resistance');
var oil = getUrlParameter('oil');
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
		W.$.dialog({id:'oilToOther'}).close();
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
	vehiTeamTree.setVehiList(parent.vehicleManager.getOilVehicle());
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
	for (var i = 0; i < selList.length; i++) {
		var vehicle = parent.vehicleManager.mapVehiList.get(selList[i]);
		if(vehicle.getOilDevice() != null){
			devIdnos += vehicle.getOilDevice().idno;
			if(i != selList.length - 1){
				devIdnos += ",";
			}
		}
	}
	var action = 'StandardDeviceAction_saveOtherOilConfig.action?devIdnos='+devIdnos;
	var data = {};
	data.nt = 0;
	data.nc = changeOil;
	data.re = resistance;
	data.oil = oil;
	
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, data, false, function(json, success) {
		$.myajax.showLoading(false);
		if (success) {
			W.$.dialog({id:'oilToOther'}).close();
			$.dialog.tips(parent.lang.saveok, 1);
		}
	});
}

//改变窗口大小时加载页面
function setPanelWidth() {
	$('#vehicle_top').height(500);
	$('#vihicle_tree').height($(window).height() - $('#toolbar-btn').height() - 25);
}