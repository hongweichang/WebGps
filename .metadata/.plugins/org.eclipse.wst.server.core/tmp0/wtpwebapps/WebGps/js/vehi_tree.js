//扩展 dhtmlXTreeObject 类的方法

//var myVehicleList;
//var myGroupList;

//取得选择结点的父结点编号
//如果选择的是设备结点，设备的父结点信息
//如果选择的是组结点，则返回此组结点信息
dhtmlXTreeObject.prototype.getSelectOrParentGroupId = function() {
	if (!this.isSelectNull()) {
		var selId = this.getSelectedItemId();
		if (selId != "") {
			if (!this.isGroupItem(selId)) {
				return this.getParentId(selId);
			} else {
				return selId;
			}
		}
	}
	
	return null;
};

//取得当前选择分组结点的编号
dhtmlXTreeObject.prototype.getSelectGroupId = function() {
	if (!this.isSelectNull() && !this.isSelectRootItem()) {
		var selId = this.getSelectedItemId();
		if (this.isGroupItem(selId)) {
			return selId;
		} else {
			return null;
		}
	} else {
		return null;
	}
};

dhtmlXTreeObject.prototype.isSelectGroupItem = function() {
	var selId = this.getSelectedItemId();
	return this.isGroupItem(selId);
};

dhtmlXTreeObject.prototype.isSelectRootItem = function() {
	var selId = this.getSelectedItemId();
	return (selId == this.getTreeGroupId(0)) ? true : false;
};

dhtmlXTreeObject.prototype.getVehiGroupId = function(treeGroupId) {
	var group = treeGroupId.split("_");
	return parseIntDecimal(group[1]);
};

dhtmlXTreeObject.prototype.getTreeGroupId = function(vehiGroupId) {
	return "*_" + vehiGroupId;
};

dhtmlXTreeObject.prototype.isRootItem = function(itemId) {
	return (itemId == this.getTreeGroupId(0)) ? true : false;
};

dhtmlXTreeObject.prototype.isGroupItem = function(itemId) {
	if (itemId.length >= 2 && itemId.charAt(0) == "*" && itemId.charAt(1) == "_") {
		return true;
	} else {
		return false;
	}
};

dhtmlXTreeObject.prototype.insertGroupItem = function(parentTreeGroupId, group) {
	this.insertNewItem(parentTreeGroupId, this.getTreeGroupId(group.id), group.name, 0
		, "group.gif", "group.gif", "group.gif", '');
};

dhtmlXTreeObject.prototype.insertVehicleItem = function(devGroupId, idno, name, image) {
	this.insertNewItem(this.getTreeGroupId(devGroupId), idno, name, 0, image, image, image, '');
};

dhtmlXTreeObject.prototype.fillGroup = function(groupList) {
	this.myGroupList = groupList;
	//添加所有车辆  跟结点
	this.insertNewItem("0", this.getTreeGroupId(0), parent.lang.allVehicle, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
	//先添加分组结点
	this.insertChildGroup(this.getTreeGroupId(0), groupList);
};

dhtmlXTreeObject.prototype.fillVehicle = function(vehicleList) {
	this.myVehicleList = vehicleList;
	//添加车辆结点
	for (var i = 0; i < vehicleList.length; i = i + 1) {
		var vehicle = vehicleList[i];
		var data = gpsParseDeviceStatus(vehicle, vehicle.status);
		this.insertVehicleItem(vehicle.devGroupId, vehicle.idno, vehicle.userAccount.name, data.vehiImg);
//		this.vehiTree.insertNewItem(getTreeGroupId(vehicle.devGroupId), vehicle.idno, vehicle.userAccount.name, 0, "vehicle.gif", "vehicle.gif", "vehicle.gif", '');
	}
}

dhtmlXTreeObject.prototype.fillVehicleByDevIdnos = function(vehicleList, devIdnos) {
	this.myVehicleList = [];
	//添加车辆结点
	for (var i = 0; i < vehicleList.length; i = i + 1) {
		var vehicle = vehicleList[i];
		var isAdd = false;
		for (var j = 0; j < devIdnos.length; j = j + 1) {
			if (devIdnos[j] == vehicle.idno) {
				isAdd = true;
				break;
			}
		}
		if (isAdd) {
			var data = gpsParseDeviceStatus(vehicle, vehicle.status);
			this.insertVehicleItem(vehicle.devGroupId, vehicle.idno, vehicle.userAccount.name, data.vehiImg);
			this.myVehicleList.push(vehicle);
	//		this.vehiTree.insertNewItem(getTreeGroupId(vehicle.devGroupId), vehicle.idno, vehicle.userAccount.name, 0, "vehicle.gif", "vehicle.gif", "vehicle.gif", '');
		}
	}
}

dhtmlXTreeObject.prototype.insertChildGroup = function(treeGroupId, groupList) {
	var groupCount = groupList.length;
	for (var i = 0; i < groupCount; i += 1){
		var group = groupList[i];
		var gId = this.getTreeGroupId(group.parentId);
		if (gId  == treeGroupId ){
			this.insertGroupItem(treeGroupId, group);
//			this.vehiTree.insertNewItem(groupId, this.getTreeGroupId(group.id), group.name, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", '');
			this.insertChildGroup(this.getTreeGroupId(group.id), groupList);
		}
	}
};

dhtmlXTreeObject.prototype.getParentText = function(itemId) {
	return this.getItemText(this.getParentId(itemId));
};

dhtmlXTreeObject.prototype.insertNewGroup = function(parentId, groupId, name) {
	var subItems = this.getSubItems(this.getTreeGroupId(parentId)).split(",");
	var lastGroupItem = "";
	for (var i = 0; i < subItems.length; i += 1) {
		if (!this.isGroupItem(subItems[i])) {
			break;
		} else {
			lastGroupItem = subItems[i];
		}
	}
	if (lastGroupItem === "") {
		this.insertNewItem(this.getTreeGroupId(parentId), this.getTreeGroupId(groupId), name, 0, "group.gif", "group.gif", "group.gif", 'SELECT,TOP');
	} else {
		this.insertNewNext(lastGroupItem, this.getTreeGroupId(groupId), name, 0, "group.gif", "group.gif", "group.gif", 'SELECT');
	}
};

dhtmlXTreeObject.prototype.isSelectNull = function() {
	if (this.getSelectedItemId() == "0") {
		return true;
	} else {
		return false;
	}
};

dhtmlXTreeObject.prototype.searchVehicle = function(name) {
	var search = null;
	for (var i = 0; i < this.myVehicleList.length; i += 1) {
		var vehicle = this.myVehicleList[i];
		if (vehicle.userAccount.name == name 
			|| vehicle.idno == name) {
			search = vehicle.idno;
			break;	
		}
		if (vehicle.userAccount.name.indexOfNotCase(name) >= 0 
			|| vehicle.idno.indexOfNotCase(name) >= 0) {
			if (search === null) {
				search = vehicle.idno;
			}
		} 
	}
	if (search == null) {
		for (var i = 0; i < this.myGroupList.length; i += 1) {
			var group = this.myGroupList[i];
			if (group.name == name) {
				search = this.getTreeGroupId(group.id);
				break;
			}
			if (group.name.indexOfNotCase(name) >= 0) {
				if (search === null) {
					search = this.getTreeGroupId(group.id);
				}
			}
		}
	}
	if (search != null) {
		this.selectItem(search);
		this.focusItem(search);
		return search;
	} else {
		return null;
	}
};

dhtmlXTreeObject.prototype.getCheckedVehi = function() {
	var vehicles = this.getAllChecked().split(",");
	var selVehis = [];
	for (var i = 0; i < vehicles.length; i = i + 1) {
		if (vehicles[i] != "" && !this.isGroupItem(vehicles[i])) {
			selVehis.push(vehicles[i]);
		}
	}
	return selVehis;
};

