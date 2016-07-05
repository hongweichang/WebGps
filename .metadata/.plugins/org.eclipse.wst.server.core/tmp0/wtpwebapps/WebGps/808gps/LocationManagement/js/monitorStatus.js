/**
 * 车辆状态处理类，包括车辆的在线状态，和实时状态
 * 1、提供接口进行车辆勾选进行监控的相关操作，开启监控和取消监控
 * 2、根据配置的刷新间隔，每隔一段时间从服务器获取一次位置信息
 * 3、每5分钟从服务器刷新一次在线状态信息
 * 并开启
 */
function monitorVehicleStatus(){
	this.gpsMonitorTableObj = null;  //监控列表对象
	this.mapVehicleList = new Hashtable();	//监控的车辆列表，hashtable映射
	this.mapDeviceList = new Hashtable();	//监控的设备列表，1个车辆对应1到两个设备
	this.flashStatusInterval = 15000;		//默认间隔，需要启动时从cookie中读取
	this.flashStatusTimer = null;			//刷新车辆状态的定时器
	this.flashAllStatusTime = new Date();	//每5分钟刷新一个全部的车辆状态
	this.monitorDevIdnos = "";
	this.isClickPosition = false; //如果点击的是位置，则不执行刷新车辆信息的地理位置信息
	this.addVehiToMapList = new Array(); //勾选车辆树的车牌号集合，用于添加到地图
	this.mapVehiAddDel = new Hashtable();//车辆是否添加到地图上 1添加 否则去掉
	this.updateVehiList = new Array();//一个车辆可以对应多个设备，因此使用一个更新的车辆链表来处理更新
	this.mapVehicleStatusList = new Hashtable();	//监控的车辆状态列表，hashtable映射
	this.onlyAddVehiToMapList = new Array(); //保存车牌号集合，用于添加到地图
	this.mapOnlyVehiAddDel = new Hashtable();//车辆是否添加到地图上 1添加 否则去掉
	this.selectedVehiIdno = null; //选中居中的车牌号
	this.isClickEventTable = true; //是否是点击监控表格所选,点击表格的就不再选中表格
}
		
//赋值flashStatusInterval
monitorVehicleStatus.prototype.setFlashStatusInterval = function(flashStatusInterval){
	this.flashStatusInterval = flashStatusInterval; 
}

monitorVehicleStatus.prototype.initialize = function(){
	//初始化状态列表
	this.initMonitorTable();
	//启动定时器获取车辆状态
	//this.runStatusTimer();
	//初始化监控设备状态数目
//	this.initMonitorCount();
}

//初始化状态列表
monitorVehicleStatus.prototype.initMonitorTable = function(){
	this.gpsMonitorTableObj = $("#gpsMonitorTable").flexigrid({
		url: "",	//StandardTrackAction_query.action
		dataType: 'json',
		colModel : [
			{display: parent.lang.plate_number, name : 'idno', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.monitor_vehiStatusTime, name : 'gpsTime', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.monitor_vehiStatusPosition, name : 'position', width : 200, sortable : false, align: 'center'},
			{display: parent.lang.monitor_vehiStatusSpeed, name : 'speed', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.monitor_vehiStatusAlarm, name : 'alarm', width : 200, sortable : false, align: 'center'},
			{display: parent.lang.monitor_vehiStatusNormal, name : 'normal', width : 200, sortable : false, align: 'center'},
			{display: parent.lang.monitor_vehiStatusLiCheng, name : 'liCheng', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.other_information, name : 'other', width : 200, sortable : false, align: 'center'}
			],
		usepager: false,
		autoload: false,
		useRp: false,
		singleSelect: true,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: true,
		width: 'auto',
		height: 'auto',
		resizable: false
	});
	//本类对象
	var myMonitorStatus = this;
	this.gpsMonitorTableObj.flexSetFillCellFun(function(p, row, idx, index) {
		return myMonitorStatus.fillMonitorTable(p, row, idx, index);	
	});
	this.gpsMonitorTableObj.flexSelectRowPropFun(function(obj) {
		myMonitorStatus.selectMonitorRowProp(obj);
	});
};

//选中事件列表
monitorVehicleStatus.prototype.selectMonitorRowProp = function(obj) {
	this.selectVehicle($(obj).attr('data-id'), true, true, false);
}

monitorVehicleStatus.prototype.getColumnTitle = function(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

monitorVehicleStatus.prototype.fillMonitorTable = function(p, row, idx, index){
	var name = p.colModel[idx].name;
	var ret = "";
	if(name == 'idno') { 
		ret = row.id;
	} else if(name == 'gpsTime') { 
		ret = row.gpsTime;
	} else if(name == 'position') {
		if(row.isGpsValid) {
			return '<span changeMapAddress(this,'+row.mapJingDu+','+row.mapWeiDu+',\''+row.id+'\');" title="'+ row.position +'">'+ row.position +'</span>';
			
		}else {
			ret = parent.lang.monitor_gpsUnvalid;
		}
	} else if(name == 'speed') { 
		if(row.isGpsValid) {
			ret = row.speed;
		}else {
			ret = parent.lang.monitor_invalid;
		}
	} else if(name == 'alarm') {
		ret = this.getTableAlarm(row.gpsAlarm,row.videoAlarm);
	} else if(name == 'normal') { 
		ret = row.gpsStatus;
	} else if(name == 'liCheng') { 
		ret = row.liCheng;
	} else if(name == 'other') { 
		ret = row.videoStatus;
		//ret = row.id;
	}
	return this.getColumnTitle(ret);
};

//当设备树点击选中结点时
monitorVehicleStatus.prototype.doCheckVehi = function(itemId,check){
	if(typeof vehiTree != 'undefined' && vehiTree != null) {
		//1为选择  0为未选中
		if (check) {
			//选中，则添加到监控列表中，并在地图上进行显示
			if (vehiTree.isVehicleItem(itemId)) {
				//如果选中的是车辆结点
				this.addMonitorVehicle(itemId);
			} else if (vehiTree.isGroupItem(itemId)){
				//选中分组结点
				var items = vehiTree.getAllSubItems(itemId).split(',');
				if(items != '') {
					for (var i = 0; i < items.length; ++ i) {
						if (vehiTree.isVehicleItem(items[i])) {
							//这边车辆可以已经进行监控了，进行监控的车辆，则不需要考虑
							this.addMonitorVehicle(items[i]);
						}
					}
				}
			} else {
				//不用考虑选中通道结点的情况
			}
		} else {
			//取消选中，则从监控列表上移除，并在地图上进行移除
			if (vehiTree.isVehicleItem(itemId)) {
				//如果选中的是车辆结点
				this.delMonitorVehicle(itemId);
				this.updateMonitorDevIdnos();	//最好是全部更新
			} else if (vehiTree.isGroupItem(itemId)){
				//如果选中所有车辆,根节点
				if(itemId == vehiTree.getTreeGroupId(parent.companyId)) {
					this.delAllMonitorVehicle();
				}else {
					//选中分组结点
					var items = vehiTree.getAllSubItems(itemId).split(',');
					var isDelete = false;
					if(items != '') {
						for (var i = 0; i < items.length; ++ i) {
							if (vehiTree.isVehicleItem(items[i])) {
								//这边车辆可以已经进行监控了，进行监控的车辆，则不需要考虑
								this.delMonitorVehicle(items[i]);
								isDelete = true;
							}
						}
					}
					if (isDelete) {
						this.updateMonitorDevIdnos();	//最好是全部更新
					}
				}
			} else {
				//不用考虑选中通道结点的情况
			}
		}
	}
//	this.initMonitorCount();
	this.initVehicleStatusCount();
};

/*
 * 选中车辆结点
 */
monitorVehicleStatus.prototype.selectVehicle  = function(vehiIdno, isShowTree, isShowMap, isShowTable){
	this.selectedVehiIdno = vehiIdno;
	//当搜索监控列表车辆时，需要将树列表，地图，监控列表都选中
	//当点击树列表时，需要将地图和监控列表选中
	//当点击监控列表时，需要将地图和树列表选中
	if (isShowTree && this.isClickEventTable && typeof vehiTree != 'undefined' && vehiTree != null) {
		var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
		if(vehicle) {
			if(typeof loadTeamTree == 'function') {
				loadTeamTree(vehicle.getParentId(), function() {
					//在车辆列表中，将车辆置为选中状态，并使车辆结点处理可见状态
					vehiTree.selectItem(vehiIdno);
					vehiTree.focusItem(vehiIdno);
					//vehiTree.closeAllItems();
					//vehiTree.openItem(vehiIdno);
				});
			}else {
				//在车辆列表中，将车辆置为选中状态，并使车辆结点处理可见状态
				vehiTree.selectItem(vehiIdno);
				vehiTree.focusItem(vehiIdno);
				//vehiTree.closeAllItems();
				//vehiTree.openItem(vehiIdno);
			}
		}
	}
	
	//以下两个需要判断是否存在监控的车辆，通过mapVehicleList这里面的对象可以来判断
	if (isShowMap  && this.isClickEventTable && (typeof monitorMapTip) != 'undefined' && monitorMapTip != null) {
		var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
		if(vehicle != null) {
			var status = this.mapVehicleStatusList.get(vehiIdno);
			if(status != null && status.isGpsValid) {
				status.id = vehiIdno;
				monitorMapTip.addVehicleToMap(vehicle, status, false);
				//在地图列表中，也将车辆居中
				monitorMapTip.selectVehicle(vehiIdno);
			}
		}
		
		//监控列表里面的车辆，判断是否在地图可视范围内，如果在，则添加到地图中，否则，从地图删除
		this.selectVehicleToMapEx(false);
	}
	if (isShowTable) {
		//在监控列表中，也将车辆置为选中状态，并使车辆结点处理可见状态
		this.isClickEventTable = false;
		this.gpsMonitorTableObj.find(this.gpsMonitorTableObj.flexGetRowid(vehiIdno)).click();
	}else {
		this.isClickEventTable = true;
	}
	////初始化车辆信息
	if((isShowTree || isShowMap || isShowTable)  && this.isClickEventTable) {
		if((typeof updatePaneVehicleInfo) == 'function') {
			updatePaneVehicleInfo(vehiIdno);
		}
	}
};

//车辆是否已加载到地图上  //车辆加载到地图上，也会加载到列表中
monitorVehicleStatus.prototype.findMonitorVehicle = function(vehiIdno){
	if (this.mapVehicleList.get(vehiIdno) != null) {
		return true;
	} else {
		return false;
	}
};

//添加1车辆进行监控
//selVehi 是否车辆居中
monitorVehicleStatus.prototype.addMonitorVehicle = function(vehiIdno){
	//这边车辆可以已经进行监控了，进行监控的车辆，则不需要考虑
	if (this.findMonitorVehicle(vehiIdno)) {
		return ;
	}
	//添加到地图上的车辆列表
	this.addVehiToMapList.push(vehiIdno);
	this.mapVehiAddDel.put(vehiIdno, 1);
	
	var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
	var idnos = vehicle.getDevIdnos();
	for (var i = 0; i < idnos.length; ++ i) {
		//加入监控设备列表
		this.mapDeviceList.put(idnos[i], idnos[i]);
	}
	//追加设备到监控设备列表
	this.addMonitorDevIdnos(idnos.toString());
	
	//加入监控车辆列表
	this.mapVehicleList.put(vehiIdno, vehiIdno);
	
	//启动添加车辆到地图的定时器
	if(this.flashAddVehiToMapTimer == null) {
		this.runAddVehiToMapTimer();
	}
};

//添加车辆到地图的定时器
monitorVehicleStatus.prototype.runAddVehiToMapTimer = function(){
	var myMonitorStatus = this;
	//当删除操作执行完全后才执行,否则等待删除
	this.flashAddVehiToMapTimer = setTimeout(function () {
		myMonitorStatus.startFlashAddVehiTime = (new Date()).getTime();
		myMonitorStatus.flashAddVehiToMap();
	}, 20);
};

//添加车辆到地图
monitorVehicleStatus.prototype.flashAddVehiToMap = function(){
	if(this.addVehiToMapList != null && this.addVehiToMapList.length > 0) {
		var rows = [];
		while(rows.length <= 10 && this.addVehiToMapList.length > 0) {
			//取数组第一个值，然后再删除
			var vehiIdno = this.addVehiToMapList[0];
			this.addVehiToMapList.splice(0,1);

			//是否添加到地图，否则就是删除
			var isAdd = this.mapVehiAddDel.get(vehiIdno);
			if(isAdd != null && isAdd == 1) {//添加
				//获取状态
				var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
				var data = vehicle.gpsParseTrackStatus();
				data.id = vehiIdno;
				
				//添加到车辆状态列表
				this.mapVehicleStatusList.put(vehiIdno, data);
				
				//将状态更新到地图上及监控列表上
				if(typeof monitorMapTip != 'undefined' && monitorMapTip != null) {
					monitorMapTip.addVehicleToMap(vehicle, data, true);
				}
				
				////更新设备树上的颜色
				this.updateVehiTreeStatus(vehicle.getStatueImg(data.image), vehiIdno);
				//如果监控列表存在，则不添加
				//添加进车辆状态列表，批量添加
				if(this.gpsMonitorTableObj.find(this.gpsMonitorTableObj.flexGetRowid(vehiIdno)).length <= 0) {
					rows.push(data);
				}
				
				this.mapVehiAddDel.put(vehiIdno, 2);//已处理
				
				//最后添加的位置有效的车辆，居中显示
			//	if(vehicle.isLocationInvalid()) {
					this.lastAddVehiIdno = vehiIdno;
			//	}
			}else if(isAdd != null && isAdd == 0) {//删除
				//从车辆状态列表删除
				this.mapVehicleStatusList.remove(vehiIdno);
				
				if(typeof monitorMapTip != 'undefined' && monitorMapTip != null) {
					monitorMapTip.removeVehicleInMap(vehiIdno);
				}
				this.removeVehicleInEvent(vehiIdno);
				this.mapVehiAddDel.put(vehiIdno, 2);
				this.lastAddVehiIdno = '';
			}
		}
		if(rows.length > 0) {
			this.gpsMonitorTableObj.flexAppendRowJson(rows, true);
		}
		
		if((new Date()).getTime() - this.startFlashAddVehiTime < 500) {
			this.flashAddVehiToMap();
		}else {
			this.runAddVehiToMapTimer();
		}
	}else {
		//居中选中状态
		if(this.lastAddVehiIdno != null && this.lastAddVehiIdno != '') {
			this.selectVehicle(this.lastAddVehiIdno, true, true, true);
		}
		this.flashAddVehiToMapTimer = null;
		//地图上添加事件
		this.visibleMapResize();
	}
};

//添加事件列表上
monitorVehicleStatus.prototype.addVehicleToEvent = function(vehiObj, data){
	var rows = [];
	rows.push(data);
	this.gpsMonitorTableObj.flexAppendRowJson(rows, true);
	this.updateVehiTreeStatus(vehiObj.getStatueImg(data.image), vehiObj.getIdno());
//	this.updateVehiTableStatus(data.color, $('#gpsMonitorTable').find($('#gpsMonitorTable').flexGetRowid(vehiObj.getIdno())));
};

//取消车辆的监控
monitorVehicleStatus.prototype.delMonitorVehicle = function(vehiIdno){
	//这边车辆可以已经进行监控了，进行监控的车辆，则不需要考虑
	if (!this.findMonitorVehicle(vehiIdno)) {
		return ;
	}
	//需要从地图删除的车辆
	this.addVehiToMapList.push(vehiIdno);
	this.mapVehiAddDel.put(vehiIdno, 0);
	
	this.mapVehicleList.remove(vehiIdno);
	
	var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
	var idnos = vehicle.getDevIdnos();
	for (var i = 0; i < idnos.length; ++ i) {
		this.mapDeviceList.remove(idnos[i]);
	}
	
	//启动删除地图上车辆的定时器
	if(this.flashAddVehiToMapTimer == null) {
		this.runAddVehiToMapTimer();
	}
};

//取消所有的车辆的监控
monitorVehicleStatus.prototype.delAllMonitorVehicle = function(){
	//清空监控车辆
	this.mapVehicleList.clear();
	//停止添加车辆到地图
	if(this.flashOnlyAddVehiToMapTimer != null && this.onlyAddVehiToMapList.length > 0) {
		clearTimeout(this.flashOnlyAddVehiToMapTimer);
		this.flashOnlyAddVehiToMapTimer = null;
	}
	this.onlyAddVehiToMapList = [];
	this.mapOnlyVehiAddDel.clear();
	//如果添加车辆计时器在运行，则停止
	if(this.flashAddVehiToMapTimer != null && this.addVehiToMapList.length > 0) {
		clearTimeout(this.flashAddVehiToMapTimer);
		this.flashAddVehiToMapTimer = null;
	}
	//清空数据
	this.addVehiToMapList = [];
	this.mapVehiAddDel.clear();
	this.mapDeviceList.clear();
	this.monitorDevIdnos = '';
	this.mapVehicleStatusList.clear();
	//清空监控列表
	this.removeAllVehicleInEvent();
	//移除地图所有车辆
	if(typeof monitorMapTip != 'undefined' && monitorMapTip != null) {
		monitorMapTip.removeAllVehicleInMap();
	}
	this.flashAddVehiToMap();
};

//移除事件列表上
monitorVehicleStatus.prototype.removeVehicleInEvent = function(vehiIdno){
	this.gpsMonitorTableObj.flexRemoveRow(vehiIdno);
};

//移除事件列表上所有数据
monitorVehicleStatus.prototype.removeAllVehicleInEvent = function(vehiIdno){
	this.gpsMonitorTableObj.flexClear();
};

//追加监控设备号
monitorVehicleStatus.prototype.addMonitorDevIdnos = function(devIdnos){
	if(this.monitorDevIdnos != '') {
		this.monitorDevIdnos += ',';
	}
	this.monitorDevIdnos += devIdnos;
};

//更新监控设备号
monitorVehicleStatus.prototype.updateMonitorDevIdnos = function(){
	var devIdnos = [];
	this.mapDeviceList.each(function(key, value) {
		devIdnos.push(key);
	});
	this.monitorDevIdnos = devIdnos.toString();
};

//启动定时器获取车辆状态
monitorVehicleStatus.prototype.runStatusTimer = function(){
	var myMonitorStatus = this;
	this.flashStatusTimer = setTimeout(function () {
		myMonitorStatus.flashVehicleStatus();
	}, this.flashStatusInterval);
};

//刷新车辆状态
//刷新时间大概 200-300ms  卡的时候1000+ 2000+ 3000+  500辆车 9画面视频
monitorVehicleStatus.prototype.flashVehicleStatus = function(){
	//5分钟刷新一次所有的状态
	var isFlashAllStatus = false;
	if (dateIsTimeout(this.flashAllStatusTime, 300000)) {
		isFlashAllStatus = true;
	}
	
	var data = {};
	//2分钟刷新一次局部状态
	if (!isFlashAllStatus) {
		if (this.mapDeviceList.size() <= 0) {
			this.runStatusTimer();
			return ;
		}
		data.devIdnos = this.monitorDevIdnos;
	} else {
		data.devIdnos = parent.vehicleManager.getAllDevIdnos();
		if (data.devIdnos == "") {
			this.runStatusTimer();
			return ;
		}
	}
//	loadConsoleTime(true, 'flashVehicleStatus');
	//本类对象
	var myMonitorStatus = this;
	//数据库取实时状态
	$.myajax.jsonPost('StandardPositionAction_statusEx.action?toMap='+parent.toMap, data, false, function(json, success) {
		if(success) {
			if(json.status != null && json.status.length > 0) {
				myMonitorStatus.updateVehiList = [];
				for (var i = 0; i < json.status.length; i++) {
					var device = parent.vehicleManager.getDevice(json.status[i].id);
					if (device != null) {
						if (!device.isEqualStatus(json.status[i])) {
							var vehiIdno = device.getVehiIdno();
							var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
							if(device.status && json.status[i]) {
								if(vehicle != null) {
									json.status[i].isDrowing = vehicle.isDrowing;
								}
								device.setStatus(json.status[i]);
	//							device.setOnline(json.status[i].ol);
							}
							if (vehicle != null) {
								if(myMonitorStatus.selectedVehiIdno != null && myMonitorStatus.selectedVehiIdno != '' 
									 && myMonitorStatus.selectedVehiIdno == vehiIdno) {
									myMonitorStatus.updateVehicleStatus(vehicle);
								}else {
									myMonitorStatus.updateVehiList.push(vehicle);
								}
							}
						}
					}
				}
			}
			//开启读取//本地读取车辆状态信息的定时器
			if(this.flashLocalStatusTimer == null) {
				myMonitorStatus.runLocalStatusTimer();
			}
//			loadConsoleTime(false, 'flashVehicleStatus');
			//有更新的设备，则刷新监控数量
//			if(updateVehiList.size() > 0) {
//				myMonitorStatus.initMonitorCount();
//			}
//			myMonitorStatus.initVehicleStatusCount();
		} else {
			//提示刷新车辆失败
			$.dialog.tips(parent.lang.monitor_flashVehicleError, 2);
			
			myMonitorStatus.runStatusTimer();
		}
	});
};


//定时刷新车辆本地状态的定时器
monitorVehicleStatus.prototype.runLocalStatusTimer = function(){
	var myMonitorStatus = this;
	this.flashLocalStatusTimer = setTimeout(function () {
		myMonitorStatus.startFlashStatusTime = (new Date()).getTime();
		myMonitorStatus.flashLocalStatus();
	}, 20);
};

//刷新车辆本地状态
monitorVehicleStatus.prototype.flashLocalStatus = function(){
	if(this.updateVehiList != null && this.updateVehiList.length > 0) {
		this.updateVehicleStatus(this.updateVehiList[0]);
		this.updateVehiList.splice(0, 1);
		if((new Date()).getTime() - this.startFlashStatusTime < 500) {
			this.flashLocalStatus();
		}else {
			this.runLocalStatusTimer();
		}
	}else {
		this.flashLocalStatusTimer = null;
		//监控列表里面的车辆，判断是否在地图可视范围内，如果在，则添加到地图中，否则，从地图删除
		var myMonitorStatus = this;
		setTimeout(function () {
			myMonitorStatus.selectVehicleToMapEx(false);
		}, 500);
		//刷新一次车辆设备数目
		this.initVehicleStatusCount();
		//如果超过5分钟
		if (dateIsTimeout(this.flashAllStatusTime, 300000)) {
			//全局刷新的时候刷新车辆树在线数
//			if(typeof countGroupVehiOnline == 'function' 
//				&& typeof vehiTree != 'undefined' && vehiTree != null
//				&& typeof getCompanySid == 'function') {
//				countGroupVehiOnline(vehiTree.getTreeGroupId(getCompanySid()));
//			}
			
			if(typeof countGroupVehiOnlineEx == 'function') {
				countGroupVehiOnlineEx();
			}
			
			this.flashAllStatusTime = new Date();
		}
		
		this.runStatusTimer();
	}
};


//更新设备树上的颜色
monitorVehicleStatus.prototype.updateVehiTreeStatus = function(image,vehiIdno) {
	if(typeof vehiTree != 'undefined' && vehiTree != null) {
		vehiTree.setItemImage2(vehiIdno,image,image,image);
	}
}

//更新监控列表上的颜色
monitorVehicleStatus.prototype.updateVehiTableStatus = function(color,tableRow) {
	tableRow.css('color', color);
}

//刷新车辆状态
//刷新时间在 15-20ms 0ms  500辆车 9画面视频
monitorVehicleStatus.prototype.updateVehicleStatus = function(vehicle){
//	loadConsoleTime(true, 'updateVehicleStatus');
	var vehiIdno = vehicle.getIdno();
	//解析车辆状态
	var data = vehicle.gpsParseTrackStatus();
	//添加到车辆状态列表
	this.mapVehicleStatusList.put(vehiIdno, data);
	//更新到状态列表上
	var obj = this.gpsMonitorTableObj.find(this.gpsMonitorTableObj.flexGetRowid(vehiIdno));
	if(obj.length > 0) {
		obj.find('.gpsTime div').html(this.getColumnTitle(data.gpsTime));
		if(data.isGpsValid) {
			var position = '<span class="maplngLat" data-type="1" onclick="changeMapAddress(this,'+data.mapJingDu+','+data.mapWeiDu+',\''+vehiIdno+'\');" title="'+ data.position +'">'+ data.position +'</span>';
			obj.find('.position div').html(position);
			obj.find('.speed div').html(this.getColumnTitle(data.speed));
		}else {
			obj.find('.position div').html(this.getColumnTitle(parent.lang.monitor_gpsUnvalid));
			obj.find('.speed div').html(this.getColumnTitle(parent.lang.monitor_invalid));
		}
		obj.find('.liCheng div').html(this.getColumnTitle(data.liCheng));
		obj.find('.alarm div').html(this.getColumnTitle(this.getTableAlarm(data.gpsAlarm,data.videoAlarm)));
		obj.find('.normal div').html(this.getColumnTitle(data.gpsStatus));
		obj.find('.other div').html(this.getColumnTitle(data.videoStatus));
		//更新监控列表上的颜色
		this.updateVehiTableStatus(data.color, obj);
	}
	//更新设备树上的颜色
	this.updateVehiTreeStatus(vehicle.getStatueImg(data.image), vehiIdno);

	//更新到地图上，更新到地图时，需要考虑车辆gps状态是否有效，暂缓
	if(typeof monitorMapTip != 'undefined' && monitorMapTip != null) {
//		if(this.selectedVehiIdno != null && this.selectedVehiIdno != '' 
//			 && this.selectedVehiIdno == vehiIdno) {
			monitorMapTip.updateStatusInMap(vehiIdno, data);
//			monitorMapTip.addVehicleToMap(vehicle, data, false);
//			monitorMapTip.selectVehicle(this.selectedVehiIdno);
//		}
	}
	//如果面板上显示的是vehiIdno,则更新面板上车辆信息
	if(typeof paneInfo != 'undefined' && paneInfo != null && paneInfo.showVehiIdno == vehiIdno) {
		paneInfo.refreshVehiStatus(vehiIdno,vehicle);
	}
//	loadConsoleTime(false, 'updateVehicleStatus');
};

monitorVehicleStatus.prototype.getTableAlarm = function(gpsAlarm,videoAlarm) {
	var str = '';
	if(gpsAlarm != null && gpsAlarm != '') {
		str = gpsAlarm;
	}
	if(videoAlarm != null && videoAlarm != '') {
		if(str != '') {
			str += ',';
		}
		str += videoAlarm;
	}
	return str;
}

/*
 * 初始化监控设备数量
 */
monitorVehicleStatus.prototype.initMonitorCount = function() {
	var isMonitorCount = 0; //监控总数
	var isOnlineCount = 0; //在线总数
	var isAlarmCount = 0; //报警总数
	var isOfflineCount = 0; //离线总数
	var isParkingCount = 0; //停车未熄火总数
	var isParkedCount = 0; //停车熄火总数
	var isInvalidCount = 0; //定位无效总数
	
	isMonitorCount = this.mapVehicleList.size();
	this.mapVehicleList.each(function(key,value){
		var vehiObj = parent.vehicleManager.getVehicle(value);
		if(vehiObj != null) {
			//在线
			if(vehiObj.isOnline()) {
				isOnlineCount++;
				if(vehiObj.isAlarm()) {//报警
					isAlarmCount++;
				}
				if(vehiObj.isLocationInvalid()) {//定位有效
					if(vehiObj.isParked()) {//停车熄火总数
						isParkedCount++;
					}
					if(vehiObj.isParking()) {//停车未熄火总数
						isParkingCount++;
					}
				}else {//定位无效
					isInvalidCount++;
				}
			}else {//离线
				isOfflineCount++;
			}
			
		}
	});
	
	$('#gps-status .status-monitor .status-val').text(isMonitorCount);
	$('#gps-status .status-online .status-val').text(isOnlineCount);
	$('#gps-status .status-alarm .status-val').text(isAlarmCount);
	$('#gps-status .status-offline .status-val').text(isOfflineCount);
	$('#gps-status .status-parking .status-val').text(isParkingCount);
	$('#gps-status .status-parked .status-val').text(isParkedCount);
	$('#gps-status .status-invalid .status-val').text(isInvalidCount);
}

/**
 * 初始化车辆设备数目
 */
monitorVehicleStatus.prototype.initVehicleStatusCount = function() {
	var isAlarmCount = 0; //存储介质报警总数
	var isOnlineCount = 0; //在线总数
	var isDamageCount = 0; //定损总数
	var isAllVehicleCount = 0; //车辆总数
	var isOnlineRates = 0; //在线率
	var isDamageRates = 0; //定损率
	
	isAllVehicleCount = parent.vehicleManager.mapVehiList.size();
	parent.vehicleManager.mapVehiList.each(function(key,vehiObj){
		if(vehiObj != null) {
			//在线
			if(vehiObj.isOnline()) {
				isOnlineCount++;
				//存储介质报警
				var storageAlarm = vehiObj.getStorageAlarm();
				if(storageAlarm != null && storageAlarm != '') {
					isAlarmCount++;
				}
			}else {
				//定损  车辆超过72小时未上线，则认为是定损状态，定损时长可以配置
				var gpsTime = vehiObj.getParseGpsTime();  //最后在线时间
				if(gpsTime != null && gpsTime != '') {
					var dB = dateStrLongTime2Date(gpsTime);
					var dE = new Date();
					var span = dE.getTime() - dB.getTime();
					if ( span >= (1000*60*60*damageTime) ) {
						isDamageCount++;
					}
				}
			}
		}
	});
	
	if(isAllVehicleCount != 0) {
		//在线率
		isOnlineRates = (isOnlineCount/isAllVehicleCount * 100).toFixed(2) + "%";
		//定损率
		isDamageRates = (isDamageCount/isAllVehicleCount * 100).toFixed(2) + "%";
	}
	
	$('#gps-storage .storage-alarm .status-val').text(isAlarmCount);
	$('#gps-storage .storage-online .status-val').text(isOnlineCount);
	$('#gps-storage .storage-damage .status-val').text(isDamageCount);
	$('#gps-storage .storage-all .status-val').text(isAllVehicleCount);
	$('#gps-storage .storage-onlinerates .status-val').text(isOnlineRates);
	$('#gps-storage .storage-damagerates .status-val').text(isDamageRates);
}

/*
 * 添加在地图之前刷新地图gps数据
 */
monitorVehicleStatus.prototype.preFillVehi2Map = function(doReloadTtxMap) {
	var data = {};
	data.devIdnos = parent.vehicleManager.getAllDevIdnos();
	if (data.devIdnos == "") {
		return ;	
	}
	//本类对象
	var myMonitorStatus = this;
	//数据库取实时状态
	$.myajax.jsonPost('StandardPositionAction_statusEx.action?toMap='+parent.toMap+'&loadAll=1', data, false, function(json, success) {
		if(success) {
			myMonitorStatus.updateVehiList = [];
			//一个车辆可以对应多个设备，因此使用一个更新的车辆链表来处理更新
			for (var i = 0; i < json.status.length; i++) {
				var device = parent.vehicleManager.getDevice(json.status[i].id);
				if (device != null) {
					if(device.status && json.status[i]) {
						device.setStatus(json.status[i]);
					}
					var vehiIdno = device.getVehiIdno();
					var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
					if(vehicle != null) {
						myMonitorStatus.updateVehiList.push(vehicle);
					}
				} 
			}
			//刷新监控数量
//			myMonitorStatus.initMonitorCount();
			myMonitorStatus.initVehicleStatusCount();
			
			if(typeof doReloadTtxMap == 'function') {
				doReloadTtxMap();
			}
		}
	});
}

/*
 * 将添加到地图上
 */
monitorVehicleStatus.prototype.fillVehi2Map = function() {
	if(this.flashLocalStatusTimer == null) {
		this.runLocalStatusTimer();
	}
};

//刷新地理位置
monitorVehicleStatus.prototype.switchPosition = function(pos1, pos2, vehiIdno){
	var obj = this.gpsMonitorTableObj.find(this.gpsMonitorTableObj.flexGetRowid(vehiIdno));
	if(obj.length > 0) {
		obj.find('.position div .maplngLat').attr('data-position', pos2);
		obj.find('.position div .maplngLat').html(pos1);
		obj.find('.position div .maplngLat').attr('title',pos1);
	}
}

//监控列表里面的车辆，判断是否在地图可视范围内，如果在，则添加到地图中，否则，从地图删除
//isMove 是否是地图改变事件
//耗时大概15-20ms  500辆车 9画面视频
monitorVehicleStatus.prototype.selectVehicleToMapEx = function(isMove){
	this.onlyAddVehiToMapList = [];
	var myMonitorStatus = this;
	var delCount = 0;
//	loadConsoleTime(true, 'selectVehicleToMapEx');
	this.mapVehicleList.each(function(key, vehiIdno) {
		if(typeof monitorMapTip != 'undefined' && monitorMapTip != null) {
			var isAdd = false; //是否添加到地图
			var isDel = false; //是否从地图删除
			var status = myMonitorStatus.mapVehicleStatusList.get(vehiIdno);
			if(status != null) {
				if(status.isGpsValid) {//gps有效
					if(!isMove && myMonitorStatus.selectedVehiIdno == vehiIdno) {
						myMonitorStatus.mapOnlyVehiAddDel.put(vehiIdno, 1);
					}else {
						//如果地图在可视范围内
						if(monitorMapTip.isVehiclePtInVisibleMap(status.mapJingDu, status.mapWeiDu)) {
							//车辆不在地图上,添加到地图
							myMonitorStatus.mapOnlyVehiAddDel.put(vehiIdno, 1);
						}else {//车辆不在范围内
							//车辆在地图上,从地图删除
							myMonitorStatus.mapOnlyVehiAddDel.put(vehiIdno, 0);
							delCount++;
						}
					}
				}else {
					myMonitorStatus.mapOnlyVehiAddDel.put(vehiIdno, 0);
					delCount++
				}
				myMonitorStatus.onlyAddVehiToMapList.push(vehiIdno);
			}
			//alert('vehiIdno='+ vehiIdno + ',isAdd='+ isAdd + ',isDel='+ isDel);
		}
	});
//	loadConsoleTime(false, 'selectVehicleToMapEx');
	if(delCount == this.mapVehicleList.size()) {
		this.onlyAddVehiToMapList = [];
		this.mapOnlyVehiAddDel.clear();
		//移除地图所有车辆
		if(typeof monitorMapTip != 'undefined' && monitorMapTip != null) {
			monitorMapTip.removeAllVehicleInMap();
		}
	}else {
		if(this.flashOnlyAddVehiToMapTimer == null) {
			myMonitorStatus.runOnlyAddVehiToMapTimer();
		}
	}
}

//添加车辆到地图的定时器
monitorVehicleStatus.prototype.runOnlyAddVehiToMapTimer = function(){
	var myMonitorStatus = this;
	//当删除操作执行完全后才执行,否则等待删除
	this.flashOnlyAddVehiToMapTimer = setTimeout(function () {
		myMonitorStatus.startFlashOnlyAddVehiTime = (new Date()).getTime();
		myMonitorStatus.flashOnlyAddVehiToMap();
		myMonitorStatus.flashOnlyAddVehiToMap2();
	}, 20);
};

//添加车辆到地图
//从列表第一个开始添加
monitorVehicleStatus.prototype.flashOnlyAddVehiToMap = function(){
	if(this.onlyAddVehiToMapList != null && this.onlyAddVehiToMapList.length > 0) {
		var vehiIdno = this.onlyAddVehiToMapList[0];
		this.onlyAddVehiToMapList.splice(0, 1);
		if(vehiIdno) {
			this.doAddVehiToMap(vehiIdno);
		}
		if((new Date()).getTime() - this.startFlashAddVehiTime < 500) {
			this.flashOnlyAddVehiToMap();
		}else {
			this.runOnlyAddVehiToMapTimer();
		}
	}else {
		this.flashOnlyAddVehiToMapTimer = null;
	}
};

//添加车辆到地图
//从列表最后一个开始添加
monitorVehicleStatus.prototype.flashOnlyAddVehiToMap2 = function(){
	if(this.onlyAddVehiToMapList != null && this.onlyAddVehiToMapList.length > 0 && this.onlyAddVehiToMapList.length >= 100) {
		var vehiIdno = this.onlyAddVehiToMapList.pop();
		if(vehiIdno) {
			this.doAddVehiToMap(vehiIdno);
		}
		if((new Date()).getTime() - this.startFlashAddVehiTime < 500) {
			this.flashOnlyAddVehiToMap2();
		}
	}
};

//添加车辆到地图
//添加一辆车时间大概15 - 20ms  0ms  500辆车 9画面视频
monitorVehicleStatus.prototype.doAddVehiToMap = function(vehiIdno) {
//	loadConsoleTime(true, 'doAddVehiToMap');
	var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
	if(vehicle != null) {
		var status = this.mapVehicleStatusList.get(vehiIdno);
		if(status != null) {
			status.id = vehiIdno;
			if(typeof monitorMapTip != 'undefined' && monitorMapTip != null) {
				var isAdd = this.mapOnlyVehiAddDel.get(vehiIdno);
				if(isAdd != null) {
					if(isAdd == 1) {
						monitorMapTip.addVehicleToMap(vehicle, status, false);
					}else if(isAdd == 0) {
						monitorMapTip.removeVehicleInMap(vehiIdno);
					}
					this.mapOnlyVehiAddDel.put(vehiIdno, 2);
				}
			}
		}
	}
//	loadConsoleTime(false, 'doAddVehiToMap');
}

/**
* 地图可视区域发生变化时调用(包含更改缩放级别、拖拽地图)
*/
monitorVehicleStatus.prototype.visibleMapResize = function(){
	if(typeof ttxMap != 'undefined' && ttxMap != null) {
		var myMonitorStatus = this;
		ttxMap.visibleMapResize(function() {
			myMonitorStatus.selectVehicleToMapEx(true);
		});
	}
}