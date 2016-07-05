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
	this.insertNewItem("0", this.getTreeGroupId(0), parent.lang.allBrand, 0, "all_group.gif", "all_group.gif", "all_group.gif", 'SELECT');
};

dhtmlXTreeObject.prototype.fillVehicle = function(vehiBrandList) {
	this.myVehicleList = vehiBrandList;
	//添加车辆结点
	for (var i = 0; i < vehiBrandList.length; i = i + 1) {
		var vehiBrand = vehiBrandList[i];
		this.insertVehicleItem("0", vehiBrand.id, vehiBrand.name, "");
//		this.vehiTree.insertNewItem(getTreeGroupId(vehicle.devGroupId), vehicle.idno, vehicle.userAccount.name, 0, "vehicle.gif", "vehicle.gif", "vehicle.gif", '');
	}
}

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

