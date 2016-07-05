
//获取节点Id
dhtmlXTreeObject.prototype.getTreeGroupId = function(vehiGroupId) {
	return "*_" + vehiGroupId;
};

//获取通道节点的Id
dhtmlXTreeObject.prototype.getTreeChannelId = function(vehiIdno, chnIndex) {
	return "#_" + chnIndex + "_" + vehiIdno;
};

//获取节点的外部id
dhtmlXTreeObject.prototype.getVehiGroupId = function(treeGroupId) {
	var group = treeGroupId.split("_");
	return parseIntDecimal(group[1]);
};

//获取通道节点的外部Id
dhtmlXTreeObject.prototype.getVehiChannelIndex = function(treeChnId) {
	var chn = treeChnId.split("_");
	return parseIntDecimal(chn[2]);
};

//取通道索引
dhtmlXTreeObject.prototype.getChannelIndex = function(chnItem) {
	var chn = chnItem.split("_");
	return parseIntDecimal(chn[1]);
};

//获取通道节点的车辆Id
dhtmlXTreeObject.prototype.getChannelVehiIdno = function(treeChnId) {
	return this.getParentId(treeChnId);
};

//是否选中分组节点
dhtmlXTreeObject.prototype.isGroupItem = function(itemId) {
	if (itemId.length >= 2 && itemId.charAt(0) == "*" && itemId.charAt(1) == "_") {
		return true;
	} else {
		return false;
	}
};

//是否选中通道节点
dhtmlXTreeObject.prototype.isChannelItem = function(itemId) {
	if (itemId.length >= 2 && itemId.charAt(0) == "#" && itemId.charAt(1) == "_") {
		return true;
	} else {
		return false;
	}
};

//是否选中车辆节点
dhtmlXTreeObject.prototype.isVehicleItem = function(itemId) {
	if (!this.isGroupItem(itemId) && !this.isChannelItem(itemId)) {
		return true;
	} else {
		return false;
	}
};

//是否选中分组节点
dhtmlXTreeObject.prototype.getMyRootItemId = function(itemId) {
	return this.getTreeGroupId(this.myRootId);
};

//添加一组公司节点
dhtmlXTreeObject.prototype.fillCompany = function(groupList,mid) {
	this.myGroupList = groupList;
	//添加所有公司  跟结点
	if(mid != null) {
		this.insertNewItem("0", this.getTreeGroupId(mid), parent.lang.all_companies, 0, "all_group.png", "all_group.png", "all_group.png", 'SELECT');
	}else {
		this.insertNewItem("0", this.getTreeGroupId(0), parent.lang.all_companies, 0, "all_group.png", "all_group.png", "all_group.png", 'SELECT');
		mid = 0;
	}
	this.myRootId = mid;
	//先添加分组结点
	this.insertChildGroup(this.getTreeGroupId(mid), groupList);
};

//添加一组公司节点
dhtmlXTreeObject.prototype.fillGroup = function(groupList,mid,titleName,isLocation) {
	this.myGroupList = groupList;
	//添加所有公司  跟结点
	if(mid != null) {
		this.insertNewItem("0", this.getTreeGroupId(mid), titleName, 0, "all_group.png", "all_group.png", "all_group.png", 'SELECT');
	}else {
		this.insertNewItem("0", this.getTreeGroupId(0), titleName, 0, "all_group.png", "all_group.png", "all_group.png", 'SELECT');
		mid = 0;
	}
	this.myRootId = mid;
	
	if(isLocation && groupList.length <= 1) {
		if(groupList.length == 1 && !groupList[0].getChildTeams()) {
			this.insertNewItem(this.getTreeGroupId(groupList[0].id), this.getTreeGroupId(parseInt(groupList[0].id,10)+10000), groupList[0].name, 0
					, "group.png", "group.png", "group.png", '');
		}
	}else {
		//先添加分组结点
		this.insertChildGroup(this.getTreeGroupId(mid), groupList, isLocation);
	}
};

//添加一组公司节点（规则）
dhtmlXTreeObject.prototype.fillRuleGroup = function(groupList,mid,titleName) {
	this.myGroupList = groupList;
	//添加所有规则  跟结点
	if(mid != null) {
		this.insertNewItem("0", this.getTreeGroupId(mid), titleName, 0, "folderClosed.gif", "folderClosed.gif", "folderClosed.gif", 'SELECT');
	}else {
		this.insertNewItem("0", this.getTreeGroupId(0), titleName, 0, "folderClosed.gif", "folderClosed.gif", "folderClosed.gif", 'SELECT');
		mid = 0;
	}
	
	//先添加分组结点
	this.insertChildRuleGroup(this.getTreeGroupId(mid), groupList);
};

dhtmlXTreeObject.prototype.insertChildRuleGroup = function(treeGroupId, groupList) {
	var groupCount = groupList.length;
	for (var i = 0; i < groupCount; i += 1){
		var group = groupList[i];
		var gId = this.getTreeGroupId(group.parentId);
		if (gId  == treeGroupId ){
			this.insertNewItem(treeGroupId, this.getTreeGroupId(group.id), group.name, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", '');
			this.insertChildRuleGroup(this.getTreeGroupId(group.id), groupList);
		}
	}
};

dhtmlXTreeObject.prototype.insertChildGroup = function(treeGroupId, groupList, isLocation) {
	var groupCount = groupList.length;
	for (var i = 0; i < groupCount; i += 1){
		var group = groupList[i];
		var gId = this.getTreeGroupId(group.parentId);
		if (gId  == treeGroupId ){
			this.insertGroupItem(treeGroupId, group, isLocation);
//			this.vehiTree.insertNewItem(groupId, this.getTreeGroupId(group.id), group.name, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", '');
			this.insertChildGroup(this.getTreeGroupId(group.id), groupList, isLocation);
		}
	}
};

dhtmlXTreeObject.prototype.insertGroupItem = function(parentTreeGroupId, group, isLocation) {
	if(group.level == 2) {
		this.insertNewItem(parentTreeGroupId, this.getTreeGroupId(group.id), group.name, 0
				, "team.gif", "team.gif", "team.gif", '');
	}else if(group.level == 3) {
		this.insertNewItem(parentTreeGroupId, this.getTreeGroupId(group.id), group.name, 0
				, "folderClosed.gif", "folderClosed.gif", "folderClosed.gif", '');
	}else {
		this.insertNewItem(parentTreeGroupId, this.getTreeGroupId(group.id), group.name, 0
				, "group.png", "group.png", "group.png", '');
	}
	if(isLocation) {
		if(!group.getChildTeams()) {
			this.insertNewItem(this.getTreeGroupId(group.id), this.getTreeGroupId(parseInt(group.id,10)+10000), group.name, 0
					, "group.png", "group.png", "group.png", '');
		}
	}
};

//添加一组车辆节点
dhtmlXTreeObject.prototype.fillVehicle = function(vehicleList) {
	this.myVehicleList = vehicleList;
	//添加车辆结点
	for (var i = 0; i < vehicleList.length; i = i + 1) {
		var status = null;
		var vehicle = vehicleList[i];
		if(vehicle.devList) {
			var devices = vehicle.devList;
			if(devices.length == 1) {
				status = devices[0].status;
			}else {
				var flag = false;
				for(var j = 0; j < devices.length; j++) {
					if(devices[j].status && devices[j].status.online) {
						status = devices[j].status;
						flag = true;
					}
				}
				if(!flag) {
					status = devices[0].status;
				}
			}
		}
		var data = gpsParseDeviceStatus(vehicle, status);
		image = data.vehiImg;
		
		this.insertVehicleItem(vehicle.parentId, vehicle.id, vehicle.name, image/*data.vehiImg*/);
//		this.vehiTree.insertNewItem(getTreeGroupId(vehicle.devGroupId), vehicle.idno, vehicle.userAccount.name, 0, "vehicle.gif", "vehicle.gif", "vehicle.gif", '');
	}
}

//添加一组其他节点
dhtmlXTreeObject.prototype.fillOther = function(vehicleList) {
	this.myVehicleList = vehicleList;
	//添加车辆结点
	for (var i = 0; i < vehicleList.length; i = i + 1) {
		var vehicle = vehicleList[i];
		this.insertVehicleItem(vehicle.parentId, vehicle.id, vehicle.name, "");
//		this.vehiTree.insertNewItem(getTreeGroupId(vehicle.devGroupId), vehicle.idno, vehicle.userAccount.name, 0, "vehicle.gif", "vehicle.gif", "vehicle.gif", '');
	}
}

//添加一组通道节点
dhtmlXTreeObject.prototype.fillVehicleChannel = function(channels) {
	//添加车辆结点
	for (var i = 0; i < channels.length; i = i + 1) {
		var  channel = channels[i];
//		this.insertVehicleItem(channel.parentId, channel.id, channel.name, "");
//		this.vehiTree.insertNewItem(getTreeGroupId(vehicle.devGroupId), vehicle.idno, vehicle.userAccount.name, 0, "vehicle.gif", "vehicle.gif", "vehicle.gif", '');
		this.insertNewItem(channel.parentId, channel.id, channel.name, 0
				, "video_01.png", "video_01.png", "video_01.png", '');
		this.showItemCheckbox(channel.id,false);
		this.closeItem(channel.parentId);
	}
}

//动态加载的方式
dhtmlXTreeObject.prototype.setVehicleList = function(vehicleList, isLoadChn) {
	this.myVehicleList = vehicleList;
	this.loadVehiIdnos = [];
	this.loadVehicleIndex = 0;
	this.channelIndex = [];
	if((typeof isLoadChn) != 'undefined') {
		this.isLoadChn = isLoadChn;
	} 
}

//动态加载的方式
dhtmlXTreeObject.prototype.dynamicLoadVehicle = function() {
	var i = this.loadVehicleIndex;
	var date = new Date();
	for (; i < this.myVehicleList.length; i = i + 1) {
		if (dateIsTimeout(date, 400)) {
			break;
		}
		
		var vehicle = this.myVehicleList[i];
		//vehicle里面id,idno,name都是车牌号
		var standVehicle = parent.vehicleManager.getVehicle(vehicle.id);
		if (standVehicle != null) {
			var status = standVehicle.gpsParseTrackStatus();
			var image = standVehicle.getStatueImg(status.image);
			this.insertVehicleItem(standVehicle.getParentId(), standVehicle.getIdno(), standVehicle.getName(), image);
			this.loadVehiIdnos.push(standVehicle.getIdno());
			if((typeof this.isLoadChn) != 'undefined' && this.isLoadChn) {
				var arrChn = standVehicle.getVehicleChannel();
				for (var j = 0; j < arrChn.length; ++ j) {
					var channel = arrChn[j];
					var chnId = this.getTreeChannelId(standVehicle.getIdno(), j);
					this.insertNewItem(channel.parentId, chnId, channel.name, 0
							, "video_01.png", "video_01.png", "video_01.png", '');
					this.showItemCheckbox(chnId, false);
					this.channelIndex.push(chnId);
				}
				this.closeItem(standVehicle.getIdno());
			} 
		} else {
			alert("fillVehicleEx getVehicle failed");
		}
	}
	this.loadVehicleIndex = i;
	if ((this.loadVehicleIndex + 1) >= this.myVehicleList.length) {
		return true;
	} else {
		return false;
	}
}

//播放车辆结点时，同时播放通道结点信息
dhtmlXTreeObject.prototype.fillVehicleEx = function(vehicleList, showChan) {
	//vehicleList是原始的对象，从json获取回来的
	//parent.vehicleManager 里面是重新生成的   standardVehicle对象，此对象有接口可以直接进行相应的操作
	this.myVehicleList = vehicleList;
	//添加车辆结点
	for (var i = 0; i < vehicleList.length; i = i + 1) {
		var vehicle = vehicleList[i];
		//vehicle里面id,idno,name都是车牌号
		var standVehicle = parent.vehicleManager.getVehicle(vehicle.id);
		if (standVehicle != null) {
			var status = standVehicle.gpsParseTrackStatus();
			var image = standVehicle.getStatueImg(status.image);
			this.insertVehicleItem(standVehicle.getParentId(), standVehicle.getIdno(), standVehicle.getName(), image);
			var arrChn = standVehicle.getVehicleChannel();
			for (var j = 0; j < arrChn.length; ++ j) {
				var channel = arrChn[j];
				var chnId = this.getTreeChannelId(standVehicle.getIdno(), j);
				this.insertNewItem(channel.parentId, chnId, channel.name, 0
						, "video_01.png", "video_01.png", "video_01.png", '');
				this.showItemCheckbox(chnId, false);
			}
			this.closeItem(standVehicle.getIdno());
		} else {
			alert("fillVehicleEx getVehicle failed");
		}
	}
}

//添加车辆节点
dhtmlXTreeObject.prototype.insertVehicleItem = function(parentId, id, name, image) {
	this.insertNewItem(this.getTreeGroupId(parentId), id, name, 0, image, image, image, '');
};

//搜索公司
dhtmlXTreeObject.prototype.searchCompany = function(name) {
	var search = null;
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

//搜索车辆和公司
dhtmlXTreeObject.prototype.searchVehicle = function(name) {
	var search = null;
	for (var i = 0; i < this.myVehicleList.length; i += 1) {
		var vehicle = this.myVehicleList[i];
		if (vehicle.name == name 
			|| vehicle.id == name) {
			search = vehicle.id;
			break;	
		}
		if (vehicle.name.indexOfNotCase(name) >= 0 
			|| (vehicle.id+'').indexOfNotCase(name) >= 0) {
			if (search === null) {
				search = vehicle.id;
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

//获取选中的节点
dhtmlXTreeObject.prototype.getCheckedVehi = function() {
	//获取所有被选中节点id，不包括第三中状态的节点（部分选中的节点）
	var vehicleStr = this.getAllChecked()+'';
	var selVehis = [];
	if(vehicleStr.indexOf(',') < 0) {
		selVehis.push(vehicleStr);
	}else {
		var vehicles = vehicleStr.split(",");
		for (var i = 0; i < vehicles.length; i = i + 1) {
			if (vehicles[i] != "" && !this.isGroupItem(vehicles[i])) {
				selVehis.push(vehicles[i]);
			}
		}
	}
	return selVehis;
};

//是否选中根节点
dhtmlXTreeObject.prototype.isRootItem = function(itemId) {
	return (itemId == this.getTreeGroupId(0)) ? true : false;
};

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

//是否选中为空
dhtmlXTreeObject.prototype.isSelectNull = function() {
	if (this.getSelectedItemId() == "0") {
		return true;
	} else {
		return false;
	}
};

//取得当前选择分组结点的编号
dhtmlXTreeObject.prototype.getSelectGroupId = function() {
	if (!this.isSelectNull() && !this.isSelectRootItem()) {
		//获取选中的节点Id 
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

//是否选中根节点
dhtmlXTreeObject.prototype.isSelectRootItem = function() {
	//获取选中的节点Id 
	var selId = this.getSelectedItemId();
	return (selId == this.getTreeGroupId(0)) ? true : false;
};

//获取父节点的名称
dhtmlXTreeObject.prototype.getParentText = function(itemId) {
	return this.getItemText(this.getParentId(itemId));
};

//添加新的分组
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
		this.insertNewItem(this.getTreeGroupId(parentId), this.getTreeGroupId(groupId), name, 0, "group.png", "group.png", "group.png", 'SELECT,TOP');
	} else {
		this.insertNewNext(lastGroupItem, this.getTreeGroupId(groupId), name, 0, "group.png", "group.png", "group.png", 'SELECT');
	}
};

//添加新的车队
dhtmlXTreeObject.prototype.insertNewTeam = function(parentId, groupId, name) {
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
		this.insertNewItem(this.getTreeGroupId(parentId), this.getTreeGroupId(groupId), name, 0, "team.gif", "team.gif", "team.gif", 'SELECT,TOP');
	} else {
		this.insertNewNext(lastGroupItem, this.getTreeGroupId(groupId), name, 0, "team.gif", "team.gif", "team.gif", 'SELECT');
	}
};

//动态加载的方式
dhtmlXTreeObject.prototype.dynamicLoadVehicleEx = function() {
	var i = this.loadVehicleIndex;
	var date = new Date();
	for (; i < this.myVehicleList.length; i = i + 1) {
		if (dateIsTimeout(date, 400)) {
			break;
		}
		var standVehicle = parent.vehicleManager.getVehicle(this.myVehicleList[i]);
		if (standVehicle != null) {
			var status = standVehicle.gpsParseTrackStatus();
			var image = standVehicle.getStatueImg(status.image);
			this.insertVehicleItem(standVehicle.getParentId(), standVehicle.getIdno(), standVehicle.getName(), image);
			this.loadVehiIdnos.push(standVehicle.getIdno());
			if((typeof this.isLoadChn) != 'undefined' && this.isLoadChn) {
				var arrChn = standVehicle.getVehicleChannel();
				for (var j = 0; j < arrChn.length; ++ j) {
					var channel = arrChn[j];
					var chnId = this.getTreeChannelId(standVehicle.getIdno(), j);
					this.insertNewItem(channel.parentId, chnId, channel.name, 0
							, "video_01.png", "video_01.png", "video_01.png", '');
					this.showItemCheckbox(chnId, false);
					this.channelIndex.push(chnId);
				}
				this.closeItem(standVehicle.getIdno());
			} 
		}
	}
	this.loadVehicleIndex = i;
	if ((this.loadVehicleIndex + 1) >= this.myVehicleList.length) {
		return true;
	} else {
		return false;
	}
}