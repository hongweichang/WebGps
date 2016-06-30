var api = frameElement.api, W = api.opener;
var loadChn = getUrlParameter('loadChn');
var vehiTeamTree = null;  //车队车辆树类
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
	
	//
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.select, name : '', pclass : 'save',
				bgcolor : 'gray', hide : false}],
			[{display: parent.lang.close, name : '', pclass : 'close',
				bgcolor : 'gray', hide : false}]
		]
	});
	
	vehiTeamTree = new vehicleTeamTree();
	vehiTeamTree.setRootId(parent.companyId);
	vehiTeamTree.setTeamList(parent.vehicleManager.getAllVehiTeam());
	vehiTeamTree.setVehiList(W.videoVehicleList);
	vehiTeamTree.setIsSearch(true);
	vehiTeamTree.setIsMoreSelect(false);
	vehiTeamTree.setCountGroup(true);
	if(loadChn && loadChn == 'true') {
		loadChn = true;
	}else {
		loadChn = false;
	}
	vehiTeamTree.setIsLoadChn(loadChn);
	vehiTeamTree.initVehiTeamTree('vehiTeamTree', 'vehicleTree', '../../js/dxtree/imgs/');
	vehiTeamTree.setHeight(212, 312);
	vehiTeamTree.loadVehiTeamTree('searchTeam', 'searchVehi');
	//设置双击选择事件
	vehiTeamTree.setOnDblClickHandler(selectVehicleChn);
	
	//保存事件
	$('.save').on('click',saveVehicleChn);
	
	//关闭事件
	$('.close').on('click',function() {
		W.$.dialog({id:'vehiInfo'}).hide();
	});
}

/**
 * 双击选择车辆或者通道，并且关闭窗口
 * @param item
 */
function selectVehicleChn(item) {
	//选中通道节点
	if (vehiTeamTree.isChannelItem(item)) {
		var vehiIdno = vehiTeamTree.getChannelVehiIdno(item);
		var chn = vehiTeamTree.getChannelIndex(item);
		W.doSelectVehicleSuc(vehiIdno, chn);
	} else if (vehiTeamTree.isVehicleItem(item)) {////选中车辆节点
		W.doSelectVehicleSuc(item, -1);
	}else {
		W.$.dialog({id:'vehiInfo'}).hide();
	}
}

function saveVehicleChn() {
	var item = vehiTeamTree.selectVehicle();
	//选中通道节点
	if (vehiTeamTree.isChannelItem(item)) {
		var vehiIdno = vehiTeamTree.getChannelVehiIdno(item);
		var chn = vehiTeamTree.getChannelIndex(item);
		W.doSelectVehicleSuc(vehiIdno, chn);
	} else if (vehiTeamTree.isVehicleItem(item)) {////选中车辆节点
		W.doSelectVehicleSuc(item, -1);
	}else {
		W.$.dialog({id:'vehiInfo'}).hide();
	}
}