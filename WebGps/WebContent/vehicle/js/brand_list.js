var api = frameElement.api, W = api.opener;

var vehiBrand;		//品牌
var vehiType;		//类型
var vehiBrandList = null;	//品牌列表
var vehiTypeList = null;	//类型列表
var vehiBrandId = null;
var vehiTypeId = null;

$(document).ready(function(){
	//加载语言
	loadLang();
	//加载车辆树
	vehiBrand = new dhtmlXTreeObject("vehiBrand_tree", "100%", "100%", 0);
	vehiBrand.setImagePath("../js/dxtree/imgs/");
	vehiBrand.enableDragAndDrop(true);
	vehiBrand.enableTreeImages(0);
	vehiBrand.setOnClickHandler(showType);  
	
	vehiType = new dhtmlXTreeObject("vehiType", "100%", "100%", 0);
	vehiType.setImagePath("../js/dxtree/imgs/");
	vehiType.enableDragAndDrop(false);
	vehiType.enableTreeImages(0);
	vehiType.setOnClickHandler(selectType);

	//加载车辆列表
	ajaxLoadInfo();
}); 

function loadLang(){
	$("#groupTitle").text(parent.lang.vehicle_navGroup);
	$("#searchVehicle").text(parent.lang.vehicle_brand_labelSearchVehi);
	$("#addBrand").text(parent.lang.vehicle_brand_add);
	$("#editBrand").text(parent.lang.vehicle_brand_edit);
	$("#delBrand").text(parent.lang.vehicle_brand_del);
	$("#selectBrand").text(parent.lang.vehicle_brand_select);
	$("#addType").text(parent.lang.addtype);
	$("#editType").text(parent.lang.edittype);
	$("#delType").text(parent.lang.deltype);
	
	$("#spanBrand").text(parent.lang.vehicle_labelBand);
	$("#spanType").text(parent.lang.vehicle_vehiType);
	$("#searchFreeVehicle").text(parent.lang.vehicle_brand_labelSearchVehi);
}

function disableForm(disable) {
	diableInput("#name", disable, true);
	diableInput("#freeName", disable, true);
	disableButton("#save", disable);
}


function ajaxLoadInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("VehicleAction_listBrand.action", function(json,action,success){
		if (success) {		
			vehiBrandList = [];
			vehiTypeList = [];
			vehiBrandList = json.vehiBrands;			
			vehiBrand.fillGroup([]);
			vehiBrand.fillVehicle(vehiBrandList);
			vehiTypeList= json.vehiTypes;
			vehiType.fillGroup([]);
			vehiType.fillVehicle(vehiTypeList);
			vehiType.setItemText(vehiType.getTreeGroupId(0), parent.lang.vehicle_vehiType, "");
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function showType(){
	var id = this.getSelectedItemId();
	if(id != null && !(id.length >= 2 && id.charAt(0) == "*" && id.charAt(1) == "_")){
		vehiBrandId = id;
		var typeList = [];
		if (vehiTypeList != null && vehiTypeList.length > 0) {
			for (var i = 0; i < vehiTypeList.length; ++ i) {
				if (vehiTypeList[i].brandId == id) {
					typeList.push(vehiTypeList[i]);
				}
			}
		}
		vehiType.deleteChildItems("0"); 
		vehiType.fillGroup([]);
		vehiType.fillVehicle(typeList);
		vehiType.setItemText(vehiType.getTreeGroupId(0), parent.lang.vehicle_vehiType, "");
	}else{
		vehiBrandId = id;
		vehiType.deleteChildItems("0"); 
		vehiType.fillGroup([]);
		vehiType.fillVehicle(vehiTypeList);
		vehiType.setItemText(vehiType.getTreeGroupId(0), parent.lang.vehicle_vehiType, "");
	}
}

function selectType(){
	var id = this.getSelectedItemId();
	vehiTypeId = id;
}

function addBrand() {
	parentId = vehiBrandId;
	$.dialog({id:'addbrand', title:parent.lang.vehicle_brand_add
		, content:'url:vehicle/brandinfo.html'
		, min:false, max:false, lock:true, zIndex:3999, parent: api});
}

function doAddBrandSuc(data) {
	$.dialog({id:'addbrand'}).close();
	$.dialog.tips(parent.lang.addok, 1);
	vehiBrandList.push(data);
	vehiBrand.deleteChildItems("0"); 
	vehiBrand.fillGroup([]);
	vehiBrand.fillVehicle(vehiBrandList);
	W.restVehiBand(data.id, data.name);
}

function editBrand() {
	var id = vehiBrandId;
	if (id != null && !(id.length >= 2 && id.charAt(0) == "*" && id.charAt(1) == "_")) {
		$.dialog({id:'editbrand', title:parent.lang.vehicle_group_edit
			, content:'url:vehicle/brandinfo.html?id=' + id
			, min:false, max:false, lock:true, zIndex:3999, parent: api});
	}else{
		alert(parent.lang.vehicle_group_selectBrandNode);
	}
}

function doEditBrandSuc(id, data) {
	$.dialog({id:'editbrand'}).close();
	for (var i = 0; i < vehiBrandList.length; ++ i) {
		if(vehiBrandList[i].id == id){
			vehiBrandList[i].name = data;
		}
	}
	vehiBrand.deleteChildItems("0"); 
	vehiBrand.fillGroup([]);
	vehiBrand.fillVehicle(vehiBrandList);
	W.restVehiBand(id, data);
}

function delBrand() {
	var id = vehiBrandId;
	if (id != null && !(id.length >= 2 && id.charAt(0) == "*" && id.charAt(1) == "_")) {
		for (var i = 0; i < vehiTypeList.length; ++ i) {
			if(vehiTypeList[i].brandId == id){
				alert(parent.lang.vehicle_brand_groupHasChild);
				return ;
			}
		}
		
		if(!confirm(parent.lang.delconfirm)) {
			return ;
		}
		
		$.myajax.showLoading(true, parent.lang.deleting);
		$.myajax.jsonGet("VehicleAction_deleteBrand.action?id=" + id, function(json,action,success){
			$.myajax.showLoading(false);
			if (success) {
				for(var i = 0; i < vehiBrandList.length; ++ i){
					if(vehiBrandList[i].id == id){
						vehiBrandList.splice(i,1)
					}
				}
				vehiBrand.deleteChildItems("0"); 
				vehiBrand.fillGroup([]);
				vehiBrand.fillVehicle(vehiBrandList);
			}
		}, null);
		W.restVehiBand(id, null);
	} else {
		alert(parent.lang.vehicle_group_selectBrandNode);
	}
}

function selectBrand(){
	var id = vehiBrandId;
	if (id != null && !(id.length >= 2 && id.charAt(0) == "*" && id.charAt(1) == "_")) {
		var typeList = [];
		if (vehiTypeList != null && vehiTypeList.length > 0) {
			for (var i = 0; i < vehiTypeList.length; ++ i) {
				if (vehiTypeList[i].brandId == vehiBrandId) {
					typeList.push(vehiTypeList[i]);
				}
			}
		}
		W.doSelectBrandSuc(id);
	} else {
		alert(parent.lang.vehicle_group_selectBrandNode);
	}
}

function addType(){
	var id = vehiBrandId;
	if (id != null && !(id.length >= 2 && id.charAt(0) == "*" && id.charAt(1) == "_")) {
		$.dialog({id:'addtype', title:parent.lang.vehicle_group_edit
			, content:'url:vehicle/typeinfo.html?brandId=' + id
			, min:false, max:false, lock:true, zIndex:3999, parent: api});
	}else {
		alert(parent.lang.vehicle_group_selectBrandNode);
	}
}

function doAddTypeSuc(data) {
	$.dialog({id:'addtype'}).close();
	$.dialog.tips(parent.lang.addok, 1);
	vehiTypeList.push(data);
	var typeList = [];
	if (vehiTypeList != null && vehiTypeList.length > 0) {
		for (var i = 0; i < vehiTypeList.length; ++ i) {
			if (vehiTypeList[i].brandId == vehiBrandId) {
				typeList.push(vehiTypeList[i]);
			}
		}
	}
	vehiType.deleteChildItems("0"); 
	vehiType.fillGroup([]);
	vehiType.fillVehicle(typeList);
	vehiType.setItemText(vehiType.getTreeGroupId(0), parent.lang.vehicle_vehiType, "");
	W.restVehiType(data.id, data);	
}

function editType(){
	var id = vehiTypeId;
	if (id != null && !(id.length >= 2 && id.charAt(0) == "*" && id.charAt(1) == "_")) {
		$.dialog({id:'edittype', title:parent.lang.vehicle_group_edit
			, content:'url:vehicle/typeinfo.html?id=' + id
			, min:false, max:false, lock:true, zIndex:3999, parent: api});
	}else {
		alert(parent.lang.vehicle_group_selectTypeNode);
	}
}

function doEditTypeSuc(id, data) {
	$.dialog({id:'edittype'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//查找对应的行数据
	for (var i = 0; i < vehiTypeList.length; ++ i) {
		if(vehiTypeList[i].id == id){
			vehiTypeList[i].name = data
		}
	}
	var typeList = [];
	if (vehiTypeList != null && vehiTypeList.length > 0) {
		if(vehiBrandId == null || (vehiBrandId.length >= 2 && vehiBrandId.charAt(0) == "*" && vehiBrandId.charAt(1) == "_")){
			typeList = vehiTypeList;
		}else{
			for (var i = 0; i < vehiTypeList.length; ++ i) {
				if (vehiTypeList[i].brandId == vehiBrandId) {
					typeList.push(vehiTypeList[i]);
				}
			}
		}
	}
	vehiType.deleteChildItems("0"); 
	vehiType.fillGroup([]);
	vehiType.fillVehicle(typeList);
	vehiType.setItemText(vehiType.getTreeGroupId(0), parent.lang.vehicle_vehiType, "");
	vehiTypeId = null;
	W.restVehiType(id, data);	
}

function delType() {
	var id = vehiTypeId;
	if (id != null && !(id.length >= 2 && id.charAt(0) == "*" && id.charAt(1) == "_")) {
		if(!confirm(parent.lang.delconfirm)) {
			return ;
		}
		$.myajax.showLoading(true, parent.lang.deleting);
		$.myajax.jsonGet("VehicleAction_deleteType.action?id=" + id, function(json,action,success){
			$.myajax.showLoading(false);
			if (success) {
				for(var i = 0; i < vehiTypeList.length; ++ i){
					if(vehiTypeList[i].id == id){
						vehiTypeList.splice(i,1)
					}
				}
				vehiType.deleteChildItems("0"); 
				vehiType.fillGroup([]);
				vehiType.fillVehicle(vehiTypeList);
				vehiType.setItemText(vehiType.getTreeGroupId(0), parent.lang.vehicle_vehiType, "");
			}
		}, null);
		vehiTypeId = null;
		W.restVehiType(id,null);
	}else {
		alert(parent.lang.vehicle_group_selectTypeNode);
	}
}