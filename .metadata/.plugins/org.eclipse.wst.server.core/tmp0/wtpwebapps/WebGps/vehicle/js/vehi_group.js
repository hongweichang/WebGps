var vehiTreeGroup;		//已分组车辆
var vehiTreeFree;		//未分组车辆
var vehiGroupList = null;	//车辆列表
var vehiFreeList = null;	//车辆列表
var vehiAllList = null;	//车辆列表
var lastSelectId = null;

$(document).ready(function(){
	//加载语言
	loadLang();
	//加载车辆树
	vehiTreeGroup = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
	vehiTreeGroup.setImagePath("../js/dxtree/imgs/");
	vehiTreeGroup.enableDragAndDrop(true);
	vehiTreeGroup.setDragHandler(doDragItem);
	vehiTreeGroup.enableCheckBoxes(1);
	vehiTreeGroup.enableThreeStateCheckboxes(true);
	
	vehiTreeFree = new dhtmlXTreeObject("vehicle_ungroup", "100%", "100%", 0);
	vehiTreeFree.setImagePath("../js/dxtree/imgs/");
	vehiTreeFree.enableDragAndDrop(false);
	vehiTreeFree.enableCheckBoxes(1);
	vehiTreeFree.enableThreeStateCheckboxes(true);

	//加载车辆列表
	ajaxLoadInfo();
}); 

function loadLang(){
	$("#groupTitle").text(parent.lang.vehicle_navGroup);
	$("#searchVehicle").text(parent.lang.vehicle_group_labelSearchVehi);
	$("#addGroup").text(parent.lang.vehicle_group_add);
	$("#editGroup").text(parent.lang.vehicle_group_edit);
	$("#delGroup").text(parent.lang.vehicle_group_del);
	$("#moveGroup").text(parent.lang.vehicle_group_move);
	$("#tipDrag").text(parent.lang.vehicle_group_drag_tip);
	
	$("#spanHasGroup").text(parent.lang.vehicle_group_hasGroup);
	$("#spanGroupFree").text(parent.lang.vehicle_group_freeGroup);
	$("#spanMoveDevice").html(parent.lang.vehicle_group_moveDevice);
	$("#spanRemoveDevice").html(parent.lang.vehicle_group_removeDevice);
	$("#searchFreeVehicle").text(parent.lang.vehicle_group_labelSearchVehi);
}

function disableForm(disable) {
	diableInput("#name", disable, true);
	diableInput("#freeName", disable, true);
	diableInput("#spanMoveDevice", disable, true);
	diableInput("#spanRemoveDevice", disable, true);
	disableButton("#save", disable);
}


function ajaxLoadInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("VehiGroupAction_list.action", function(json,action,success){
		if (success) {
			
			vehiGroupList = [];
			vehiFreeList = [];
			vehiAllList = json.vehicles;
			if (vehiAllList != null && vehiAllList.length > 0) {
				for (var i = 0; i < vehiAllList.length; ++ i) {
					if (vehiAllList[i].devGroupId != 0) {
						vehiGroupList.push(vehiAllList[i]);
					} else {
						vehiFreeList.push(vehiAllList[i]);
					}
				}
			}
			
			vehiTreeGroup.deleteItem(vehiTreeGroup.getTreeGroupId(0), false);
			vehiTreeGroup.fillGroup(json.groups);
			vehiTreeGroup.fillVehicle(vehiGroupList);
			
			if (vehiGroupList.length >= 15) {
				if (json.groups != null && json.groups.length > 0) {
					for (var i = 0; i < json.groups.length; ++ i) {
						var groupItem = vehiTreeGroup.getTreeGroupId(json.groups[i].id);
						var subItems = vehiTreeGroup.getAllSubItems(groupItem).split(',');
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
			
			if (lastSelectId != null) {
				vehiTreeGroup.selectItem(lastSelectId);
				vehiTreeGroup.focusItem(lastSelectId);
			}
			
			vehiTreeFree.deleteItem(vehiTreeGroup.getTreeGroupId(0), false);
			vehiTreeFree.fillGroup([]);
			vehiTreeFree.fillVehicle(vehiFreeList);
			vehiTreeFree.setItemText(vehiTreeFree.getTreeGroupId(0), parent.lang.vehicle_group_freeGroup, "");
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function addGroup() {
	var treeGroupId = vehiTreeGroup.getSelectOrParentGroupId();
	if (treeGroupId != null) {
		var vehiGroupId = vehiTreeGroup.getVehiGroupId(treeGroupId);
		$.dialog({id:'addgroup', title:parent.lang.vehicle_group_add
			, content:'url:vehicle/vehi_group_info.html?parentId=' + vehiGroupId + "&parent=" + encodeURI(vehiTreeGroup.getItemText(treeGroupId))
			, min:false, max:false, lock:true});
	} else {
		alert(parent.lang.vehicle_group_selectGroupNode);
	}
}

function doAddGroupSuc(data) {
	$.dialog({id:'addgroup'}).close();
	$.dialog.tips(parent.lang.addok, 1);
	vehiTreeGroup.insertNewGroup(data.parentId, data.id, data.name);
}

function editGroup() {
	var treeGroupId = vehiTreeGroup.getSelectGroupId();
	if (treeGroupId != null) {
		var parentGroupText = vehiTreeGroup.getParentText(treeGroupId);
		$.dialog({id:'editgroup', title:parent.lang.vehicle_group_edit
			, content:'url:vehicle/vehi_group_info.html?id=' + vehiTreeGroup.getVehiGroupId(treeGroupId) + "&parent=" + encodeURI(parentGroupText)
			, min:false, max:false, lock:true});
	} else {
		alert(parent.lang.vehicle_group_selectGroupNode);
	}
}

function doEditGroupSuc(id, data) {
	$.dialog({id:'editgroup'}).close();
	vehiTreeGroup.setItemText(vehiTreeGroup.getTreeGroupId(data.id), data.name);
}

function delGroup(id) {
	var treeGroupId = vehiTreeGroup.getSelectGroupId();
	if (treeGroupId != null) {
		//判断是否还存在子结点信息
		if (vehiTreeGroup.hasChildren(treeGroupId)) {
			alert(parent.lang.vehicle_group_groupHasChild);
			return ;
		}
		
		if(!confirm(parent.lang.delconfirm)) {
			return ;
		}
		
		//显示的消息
		$.myajax.showLoading(true, parent.lang.deleting);
		$.myajax.jsonGet("VehiGroupAction_delete.action?id=" + vehiTreeGroup.getVehiGroupId(treeGroupId), function(json,action,success){
			$.myajax.showLoading(false);
			if (success) {
				var parent = vehiTreeGroup.getParentId(treeGroupId);
				vehiTreeGroup.deleteItem(treeGroupId);
				if (parent != null && parent != "") {
					var subs = vehiTreeGroup.getSubItems(parent);
					if (subs != "") {
						var subsItem = subs.split(",");
						vehiTreeGroup.selectItem(subsItem[0]);
					} else {
						vehiTreeGroup.selectItem(parent);
					}
				}
			}
		}, null);
	} else {
		alert(parent.lang.vehicle_group_selectGroupNode);
	}
}

function doDragItem(idSrc, idDest) {
	//如果处于相同层次结构
	if (vehiTreeGroup.getParentId(idSrc) == idDest) {
		return false;
	}
	
	//判断目标结点是否为车辆结点
	if (!vehiTreeGroup.isGroupItem(idDest)) {
		return false;
	}
	
	var action;
	//判断源结点是否为分组结点
	if (vehiTreeGroup.isGroupItem(idSrc)) {
		//移动分组
		action = "VehiGroupAction_move.action?groupId=" + vehiTreeGroup.getVehiGroupId(idSrc);
	} else {
		//如果是车辆不允许拖动到根结点
		if (vehiTreeGroup.isRootItem(idDest)) {
			return false;
		}
		
		//移动车辆
		action = "VehiGroupAction_move.action?devIdno=" + idSrc;
	}
	
	//向服务器发送请求
	//显示的消息
	var data = {};
	data.parentId = vehiTreeGroup.getVehiGroupId(idDest);
	$.myajax.showTopLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, data, false, function(json, success) {
		$.myajax.showTopLoading(false);
		if (!success) {
			//如果更新失败，则直接刷新整个列表
			ajaxLoadInfo();
		}
	}, null);
	return true;
}

function moveGroup() {
	//是否选择跟结点信息
	if (!vehiTreeGroup.isSelectNull() && !vehiTreeGroup.isSelectRootItem()) {
		var selId = vehiTreeGroup.getSelectedItemId();
		var url;
		if (vehiTreeGroup.isGroupItem(selId)) {
			var groupId = vehiTreeGroup.getVehiGroupId(selId);
			url = 'url:vehicle/vehi_group_move.html?groupId=' + groupId + "&name=" + encodeURI(vehiTreeGroup.getItemText(selId));
		} else {
			url = 'url:vehicle/vehi_group_move.html?devIdno=' + selId + "&name=" + encodeURI(vehiTreeGroup.getItemText(selId));;
		}	
		
		$.dialog({id:'movegroup', title:parent.lang.vehicle_group_move, content:url
			, min:false, max:false, lock:true});
	}
}

function getVehiImg(idno) {
	var vehicle = null;
	for (var i = 0; i < vehiAllList.length; ++ i) {
		if (vehiAllList[i].idno == idno) {
			vehicle = vehiAllList[i];
			break;
		}
	}
	var data = gpsParseDeviceStatus(vehicle, vehicle.status);
	return data.vehiImg;
}

function doMoveGroupSuc(data) {
	$.dialog({id:'movegroup'}).close();
	//目标分组
	var targetId = vehiTreeGroup.getTreeGroupId(data.parentId);
	if (data.groupId) {
		//移动整个结点
		var subItems = vehiTreeGroup.getSubItems(targetId).split(",");
		var lastGroupItem = "";
		var vehiIndex = 0;
		for (var i = 0; i < subItems.length; i += 1) {
			if (!vehiTreeGroup.isGroupItem(subItems[i])) {
				break;
			} else {
				lastGroupItem = subItems[i];
			}
			vehiIndex = i;
		}
		
		var groupId = vehiTreeGroup.getTreeGroupId(data.groupId);
		if (lastGroupItem === "") {
			//先移动到末尾
			vehiTreeGroup.moveItem(groupId, "item_child", targetId);
			//先删除车辆结点，然后插入分组结点，再从末尾插入结点
			for (var i = vehiIndex; i < subItems.length; i += 1) {
				if (subItems[i] !== "" && !vehiTreeGroup.isGroupItem(subItems[i])) {
					var vehiName = vehiTreeGroup.getItemText(subItems[i]);
					vehiTreeGroup.deleteItem(subItems[i]);
					vehiTreeGroup.insertVehicleItem(vehiTreeGroup.getVehiGroupId(targetId), subItems[i], vehiName, getVehiImg(subItems[i]));
				} 
			}
		} else {
			vehiTreeGroup.moveItem(groupId, "item_sibling", lastGroupItem);
		}
		vehiTreeGroup.selectItem(groupId);
	} else {
		var vehiName = vehiTreeGroup.getItemText(data.devIdno);
		//先删除一个结点
		vehiTreeGroup.deleteItem(data.devIdno);
		//再插入车辆结点
		vehiTreeGroup.insertVehicleItem(vehiTreeGroup.getVehiGroupId(targetId), data.devIdno, vehiName, getVehiImg(data.devIdno));	
		vehiTreeGroup.selectItem(data.devIdno);
	}
}

function searchVehicle() {
	setTimeout(function() {
		var name = $.trim($("#name").val());
		if (name != "" && vehiGroupList != null) {
			vehiTreeGroup.searchVehicle(name);
		} 
	}, 200);
}

function searchFreeVehicle() {
	setTimeout(function() {
		var name = $.trim($("#freeName").val());
		if (name != "" && vehiFreeList != null) {
			vehiTreeFree.searchVehicle(name);
		} 
	}, 200);
}

function moveSelectDevice() {
	var selVehi = vehiTreeFree.getCheckedVehi();
	if (selVehi.length <= 0) {
		alert(parent.lang.vehicle_group_selectFreeVehi);
		return ;
	}
	
	var selId = vehiTreeGroup.getSelectedItemId();
	if (!vehiTreeGroup.isGroupItem(selId)) {
		alert(parent.lang.vehicle_group_selectGroupNode);
		return ;
	}
	
	if (vehiTreeGroup.isRootItem(selId)) {
		alert(parent.lang.vehicle_group_selectGroupNode);
		return ;
	}
	
	lastSelectId = vehiTreeGroup.getSelectedItemId();
	var action = "VehiGroupAction_moveSelect.action?groupId=" + vehiTreeGroup.getVehiGroupId(selId);
	var data = {};
	data.devIdnos = selVehi.toString();
	$.myajax.showTopLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, data, false, function(json, success) {
		$.myajax.showTopLoading(false);
		ajaxLoadInfo();
	}, null);
}

function removeSelectDevice() {
	var selVehi = vehiTreeGroup.getCheckedVehi();
	if (selVehi.length <= 0) {
		alert(parent.lang.vehicle_group_selectGroupVehi);
		return ;
	}
	
	lastSelectId = vehiTreeGroup.getSelectedItemId();
	var action = "VehiGroupAction_removeSelect.action";
	var data = {};
	data.devIdnos = selVehi.toString();
	$.myajax.showTopLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, data, false, function(json, success) {
		$.myajax.showTopLoading(false);
		ajaxLoadInfo();
	}, null);
}

