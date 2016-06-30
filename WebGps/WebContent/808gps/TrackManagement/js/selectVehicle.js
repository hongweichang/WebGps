var api = frameElement.api, W = api.opener;
var vehiTeamTree = null;  //车队车辆树类
var single = getUrlParameter('single');//是否单选

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
	
	//加载报警树
	vehiTeamTree = new vehicleTeamTree();
	vehiTeamTree.setRootId(parent.companyId);
	vehiTeamTree.setTeamList(parent.vehicleManager.getAllVehiTeam());
	vehiTeamTree.setVehiList(parent.vehicleManager.getAllVehicle());
	vehiTeamTree.setIsSearch(true);
	if(single != null && single == 'true') {
		vehiTeamTree.setIsMoreSelect(false);
	}else {
		vehiTeamTree.setIsMoreSelect(true);
	}
	vehiTeamTree.setCountGroup(true);
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
////选中车辆节点
	if (vehiTeamTree.isVehicleItem(item)) {
		W.doSelectVehicleSuc(item);
	}else {
		W.$.dialog({id:'vehiInfo'}).hide();
	}
}

//选择的车辆
function saveVehicleChn() {
	if(vehiTeamTree.getIsMoreSelect()) {//多选
		var item = vehiTeamTree.selectCheckedVehicle().toString();
		if(item) {
			W.doSelectVehicleSuc(item);
		}else {
			W.$.dialog({id:'vehiInfo'}).hide();
		}
	}else {//单选
		var item = vehiTeamTree.selectVehicle();
		if (vehiTeamTree.isVehicleItem(item)) {
			W.doSelectVehicleSuc(item);
		}else {
			W.$.dialog({id:'vehiInfo'}).hide();
		}
	}
}