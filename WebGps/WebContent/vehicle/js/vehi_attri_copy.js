var api = frameElement.api, W = api.opener;
var vehiTree;
var searchTimer = null;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//初始化树
	setInputFocusBuleTip("#vehisearch", parent.lang.vehicle_searchTerminal);
	//生成权限树
	vehiTree = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
	vehiTree.enableCheckBoxes(1);
	vehiTree.enableThreeStateCheckboxes(true);
	vehiTree.setImagePath("../js/dxtree/imgs/");
	vehiTree.fillGroup(parent.vehiGroupList);
	vehiTree.fillVehicle(parent.vehicleList);
	vehiTree.deleteItem(getUrlParameter("idno"));
	
	ajaxLoadDevInfo();
}); 

function loadLang(){
	$("#spanSelectTerminalTip").text(parent.lang.vehicle_selectVehiTip);
	$("#labelSearch").text(parent.lang.vehicle_group_labelSearchVehi);
	$("#spanCopySelect").text(parent.lang.vehicle_selectAttriTip);
	
	$("#spanIcon").text(parent.lang.vehicle_icon);
	$("#spanChannel").text(parent.lang.vehicle_channelParam);
	$("#spanIo").text(parent.lang.vehicle_ioinParam);
	$("#spanTemperature").text(parent.lang.vehicle_tempSensorParam);
	$("#spanModule").text(parent.lang.vehicle_moduleParam);

	$("#spanCompany").text(parent.lang.vehicle_company);
	$("#spanBrand").text(parent.lang.vehicle_vehiBand);
	$("#spanVehiType").text(parent.lang.vehicle_vehiType);
	$("#spanPlateColor").text(parent.lang.vehicle_plateColor);
	$("#spanFactoryCode").text(parent.lang.vehicle_factoryCode);
	$("#spanTerminalMode").text(parent.lang.vehicle_terminalType);
	
	$("#save").text(parent.lang.save);
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

function getPlateColor(color) {
	if (color != null) {
		if (color == 1) {
			return parent.lang.vehicle_colorBlue;
		} else if (color == 2){
			return parent.lang.vehicle_colorYellow;
		} else if (color == 3){
			return parent.lang.vehicle_colorBlack;
		} else if (color == 4){
			return parent.lang.vehicle_colorWhite;
		} else if (color == 9){
			return parent.lang.vehicle_colorOther;
		} else {
			return parent.lang.vehicle_colorYellow;
		}
	} else {
		return parent.lang.vehicle_colorYellow;
	}
}

function getAttriInfo(name, value) {
	if (value != null && value != "") {
		return name + " (" + value + ")";
	} else {
		return name + " ()";
	}
}

function ajaxLoadDevInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("VehicleAction_get.action?idno=" + getUrlParameter("idno"), function(json,action,success){
		if (success) {
			//基本参数
			//<img src="../images/vehicle/6.gif"/>
			var imgSrc = "../images/vehicle/" + json.vehicle.icon;
			if (json.vehicle.icon < 3) {
				imgSrc += ".png";
			} else {
				imgSrc += ".gif";
			}
			$("#imgIcon").attr("src", imgSrc);
			var chnName = json.vehicle.chnName;
			if (json.vehicle.chnCount == 0) {
				chnName = "";
			}
			$("#spanChannel").text(getAttriInfo(parent.lang.vehicle_channelParam, chnName));
			var ioName = json.vehicle.ioInName;
			if (json.vehicle.ioInCount == 0) {
				ioName = "";
			}
			$("#spanIo").text(getAttriInfo(parent.lang.vehicle_ioinParam, ioName));
			var tempName = json.vehicle.tempName;
			if (json.vehicle.tempCount == 0) {
				tempName = "";
			}
			$("#spanTemperature").text(getAttriInfo(parent.lang.vehicle_tempSensorParam, tempName));
			//模块信息
			var module = json.vehicle.module;
			if (module === null) {
				module = 0;
			}
			
			var moduleName = [];
			if ((module>>0)&0x1) {
				moduleName.push(parent.lang.vehicle_moduleOilSensor);
			}
			if ((module>>1)&0x1) {
				moduleName.push(parent.lang.vehicle_moduleOilControl);
			}
			if ((module>>2)&0x1) {
				moduleName.push(parent.lang.vehicle_moduleElecControl);
			}
			if ((module>>3)&0x1) {
				moduleName.push(parent.lang.vehicle_moduleTTS);
			}
			if ((module>>4)&0x1) {
				moduleName.push(parent.lang.vehicle_moduleDigitIntercom);
			}
			if ((module>>9)&0x1) {
				moduleName.push("OBD");
			}
			$("#spanModule").text(getAttriInfo(parent.lang.vehicle_moduleParam, moduleName.toString()));

			$("#spanCompany").text(getAttriInfo(parent.lang.vehicle_company, json.vehicle.vehiCompany));
			$("#spanBrand").text(getAttriInfo(parent.lang.vehicle_vehiBand, json.vehicle.vehiBand));
			$("#spanVehiType").text(getAttriInfo(parent.lang.vehicle_vehiType, json.vehicle.vehiType));
			$("#spanPlateColor").text(getAttriInfo(parent.lang.vehicle_plateColor, getPlateColor(json.vehicle.plateColor)));
			$("#spanFactoryCode").text(getAttriInfo(parent.lang.vehicle_factoryCode, json.vehicle.productId));
			$("#spanTerminalMode").text(getAttriInfo(parent.lang.vehicle_terminalType, json.vehicle.terminalModel));
		}
		$.myajax.showLoading(false);
		disableForm(false);	
	}, null);
}

function disableForm(disable) {
	diableInput("#attrIcon", disable, true);
	diableInput("#attrChannel", disable, true);
	diableInput("#attrIo", disable, true);
	diableInput("#attrTemperature", disable, true);
	diableInput("#attrModule", disable, true);
	diableInput("#attrCompany", disable, true);
	diableInput("#attrBrand", disable, true);
	diableInput("#attrVehiType", disable, true);
	diableInput("#attrPlateColor", disable, true);
	diableInput("#attrFactoryCode", disable, true);
	diableInput("#attrTerminalType", disable, true);
	disableButton("#save", disable);
}

function isChecked(id) {
	if($(id).attr('checked')==undefined) {
		return false;
	} else {
		return true;
	}
}

function ajaxSaveCopy() {
	//判断是否选择车辆信息
	var vehicles = vehiTree.getCheckedVehi();
	if (vehicles.length <= 0) {
		alert(parent.lang.report_selectVehiNullErr);
		return ;
	}
	
	var data = {};
	data.devIdnos = vehicles.toString();
	data.icon = isChecked("#attrIcon");
	data.channel = isChecked("#attrChannel");
	data.io = isChecked("#attrIo");
	data.temperature = isChecked("#attrTemperature");
	data.module = isChecked("#attrModule");
	data.company = isChecked("#attrCompany");
	data.brand = isChecked("#attrBrand");
	data.vehiType = isChecked("#attrVehiType");
	data.plateColor = isChecked("#attrPlateColor");
	data.factoryCode = isChecked("#attrFactoryCode");
	data.terminalType = isChecked("#attrTerminalType");
	
	//判断参数是否正确
	if (!data.icon && !data.channel && !data.io && !data.temperature && !data.module 
			&& !data.company && !data.brand && !data.vehiType && !data.plateColor 
			&& !data.factoryCode && !data.terminalType) {
		alert(parent.lang.vehicle_selectAttriErr);
		return ;
	}
			
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action = 'VehicleAction_copy.action?idno=' + getUrlParameter("idno");

	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.doCopyVehiSuc();
		}
	});
}