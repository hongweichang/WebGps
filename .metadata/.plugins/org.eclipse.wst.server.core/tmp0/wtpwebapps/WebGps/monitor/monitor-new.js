var GFRAME = null;
var vehiTree = null;
var showVehiStatus = false;
var allVehiList = [];		//所有车辆列表信息
var checkedVehiList = [];	//选中的车辆列表，获取车辆状态
var vehiMonitorInterval = 20000;	//车辆监控间隔
var lastAllVehiStatusTime = new Date();	//最后一次获取所有车辆状态的时间
var isQueryAllVehiStatus = false;

$(document).ready(function () {
	//加载地图信息
	GFRAME = new mapframe();
	GFRAME.createMap();
	GFRAME.imagePath = "../js/map/image/";
	//加载语言
	loadLang();
	//初始化设备树
	vehiTree = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
	vehiTree.setImagePath("../js/dxtree/imgs/");
	vehiTree.enableCheckBoxes(1);
	vehiTree.enableThreeStateCheckboxes(true);
	vehiTree.setOnCheckHandler(vehiTreeCheckboxClick); 	//设置checkbox点击事件
	vehiTree.setOnClickHandler(vehiTreeClickEvent);				//设置click点击事件
	initDeviceTree();
	//初始化导航标签
	initTabNav();
	//启动定时器获取车辆状态信息
	queryVehicleStatus();
});

function loadLang() {
	$("#spanVehiList").text(parent.lang.monitor_vehiList);
	$("#spanLabelSearch").text(parent.lang.monitor_labelSearch);
	$("#spanMyMap").text(parent.lang.monitor_myMap);
	$("#spanMyMapIndex").text(parent.lang.index);
	$("#spanMyMapName").text(parent.lang.monitor_myMapName);
	$("#spanMyMapType").text(parent.lang.monitor_myMapType);
	$("#spanMyMapOperator").text(parent.lang.operator);
	$("#spanVehiStatus").text(parent.lang.monitor_vehiMonitorList);
	$("#spanVehiStatusIndex").text(parent.lang.index);
	$("#spanVehiStatusName").text(parent.lang.vehiName);
	$("#spanVehiStatusTime").text(parent.lang.monitor_vehiStatusTime);
	$("#spanVehiStatusSpeed").text(parent.lang.monitor_vehiStatusSpeed + gpsGetLabelSpeedUnit());
	$("#spanVehiStatusPosition").text(parent.lang.monitor_vehiStatusPosition);
	$("#spanVehiStatusDriver").text(parent.lang.monitor_vehiStatusDriver);
	$("#spanVehiStatusAlarm").text(parent.lang.monitor_vehiStatusAlarm);
	$("#spanVehiStatusNormal").text(parent.lang.monitor_vehiStatusNormal);
	$("#spanVehiStatusLiCheng").text(parent.lang.monitor_vehiStatusLiCheng + gpsGetLabelLiChengUnit());
	$("#spanVehiStatusTemperature").text(parent.lang.monitor_vehiStatusTemperature);
	
	$("#spanVehiTotal").text(parent.lang.monitor_lableVehiTotal);
	$("#imgVehicleOnline").attr("title", parent.lang.monitor_vehicleOnline);
	$("#imgVehicleAlarm").attr("title", parent.lang.monitor_vehicleAlarm);
	$("#imgVehicleParkAccon").attr("title", parent.lang.monitor_vehicleParkAccon);
	$("#imgVehicleOffline").attr("title", parent.lang.monitor_vehicleOffline);
}

function initDeviceTree() {
	if (parent.isLoadVehiList) {
		vehiTree.fillGroup(parent.vehiGroupList);
		vehiTree.fillVehicle(parent.vehicleList);
		//初始化设备搜索
		var allDevice = new Array();
		for (var i = 0; i < parent.vehicleList.length; i += 1) {
			allDevice.push(parent.vehicleList[i].userAccount.name);
			allVehiList.push(parent.vehicleList[i].idno);
		}
		//更新车辆统计
		updateVehiStatusCount();
		//车辆总数
		$("#spanVehiCount").text(parent.vehicleList.length);
		$( "#vehiSearch" ).autocomplete({
			source: allDevice,
			autoFocus: true,
			select: searchVehiChange
		});
	} else {
		setTimeout(initDeviceTree, 1000);
	}
}

var resizeCount = 0;
function resizeFrame() {
	resizeCount += 1;
	var totalHeight = $("#homesub").height();
	if (totalHeight <= 100 && resizeCount <= 3) {
		setTimeout(resizeFrame, 1000);
	} else {
		var navHeight = $("#hometabnav").height() + 10;
		var queryHeight = $("#device_query").height() + 20;
		var vehicleHeight = totalHeight - navHeight - queryHeight - 8;
		$("#vehicle_tree").height(vehicleHeight);
		$("#my_map").height(totalHeight - navHeight);
		
		moveMapAndVehiStatus();
		parent.isInitMonitorFrame = true;
	}
}

function moveMapAndVehiStatus() {
	var rightHeight = $("#homesub").height();
	var mapToolbarHeight = $("#mapToolbar").height();
	var mapTableHeight = 2;
	if (showVehiStatus) {
		mapTableHeight = rightHeight * 0.2 + 3;
	}
	var statusToolbarHeight = $("#statusToolbar").height();
	$("#mapcanvas").height(rightHeight - mapToolbarHeight - mapTableHeight - statusToolbarHeight);
	if (showVehiStatus) {
		$("#maptable").height(mapTableHeight);
		$("#maptable").show();
		$("#closeVehiStatus").show();
		$("#openVehiStatus").hide();
	} else {
		$("#maptable").hide();
		$("#closeVehiStatus").hide();
		$("#openVehiStatus").show();
	}
}

function switchVehiStatusBar() {
	showVehiStatus = !showVehiStatus;
	moveMapAndVehiStatus();
}

//初始化导航标签
function initTabNav() {
	$("#hometabnav li").click(function() {
		$(this).addClass("now_focus"); //为被点击的选项卡添加“now_focus”类
		$(this).siblings().removeClass("now_focus"); //去掉其它选项卡的“now_focus”类
		var $dangqian = $("#hometabcontent > .tabcont").eq($("#hometabnav li").index(this)); //获取到和被点击选项卡顺序相同的内容容器
		$dangqian.css("display","block"); //为这个内容容器添加“now_focus”类
		$dangqian.siblings().css("display","none"); //去掉其它内容容器的“now_focus”类
	});
}

//车辆搜索变化
function searchVehiChange(event, ui) {
	var search = vehiTree.searchVehicle(ui.item.value);
	if (search != null) {
		if ($("#vehiStatus_" + search).length <= 0) {
			vehiTree.setCheck(search, true);
			//启动车辆状态更新
			addMonitorVehicle(search, true);
			//显示
			showVehicleStatus();
			//更新车辆数目
			updateVehiStatusCount();
		} else {
			//选中车辆
			selectVehicleEx(search);
		}
	}
}

function updateVehicleImage(vehicle, vehiImg) {
	//车辆状态图标
	if (vehicle.vehiImg != vehiImg) {
		vehiTree.setItemImage2(vehicle.idno, vehiImg, vehiImg, vehiImg);
		vehicle.vehiImg = vehiImg;
	}
}

function updateMonitorVehicle(vehicle) {
	if (vehicle.status != null) {
		var vehiStatus = $("#vehiStatus_" + vehicle.idno);
		if (vehiStatus.length > 0) {	//如果处于监控列表中
			var data = gpsParseDeviceStatus(vehicle, vehicle.status);
			if (gpsIsGpsValid(vehicle.status.status1)) {
				updateVehicle(vehicle.idno, vehicle.status.mapJingDu, vehicle.status.mapWeiDu, gpsGetDirection(vehicle.status.huangXiang)
					, data.image, "", "", data.statusString);
			}
			
			if (vehicle.status.gpsTime != null) {
				vehiStatus.find("#tdVehiStatusTime").text(dateTime2TimeString(vehicle.status.gpsTime));
			}
			vehiStatus.find("#tdVehiStatusSpeed").text(gpsGetSpeed(vehicle.status.speed, vehicle.status.status1));
			vehiStatus.find("#tdVehiStatusPosition").text(gpsGetPosition(vehicle.status.jingDu, vehicle.status.weiDu, vehicle.status.status1));
			vehiStatus.find("#tdVehiStatusAlarm").text(data.alarm);
			vehiStatus.find("#tdVehiStatusNormal").text(data.normal);
			vehiStatus.find("#tdVehiStatusLiCheng").text(gpsGetLiCheng(vehicle.status.liCheng));
			if (vehicle.tempCount > 0) {
				vehiStatus.find("#tdVehiStatusTemperator").text(gpsGetVehicleTemperature(vehicle, vehicle.status));
			} else {
				vehiStatus.find("#tdVehiStatusTemperator").text("  ");
			}
			//车辆状态图标
			updateVehicleImage(vehicle, data.vehiImg);
			
			//更新车辆列表字体颜色
			$("#vehiStatus_" + vehicle.idno + " td").each(function(){
				if ($(this).css("color") != data.color) {
			    	$(this).css("color", data.color);
			    }
			});
		}
	}
}

function addMonitorVehicle(devIdno, isSelect) {
	var vehicle = gpsGetVehicleObj(devIdno);
	var k = checkedVehiList.length + 1;
	//加入到列表中
	var row = $("#statusTableTemplate").clone();
	row.find("#tdVehiStatusIndex").text(k);
	
	row.find("#tdVehiStatusName").text(vehicle.userAccount.name);
	
	var driver = "";
	if (vehicle.driverName != null) {
		driver = vehicle.driverName;
	}
	row.find("#tdVehiStatusTime").text("  ");
	row.find("#tdVehiStatusSpeed").text("  ");
	row.find("#tdVehiStatusPosition").text("  ");
	row.find("#tdVehiStatusDriver").text(gpsGetVehicleDriver(vehicle));
	row.find("#tdVehiStatusAlarm").text("  ");
	row.find("#tdVehiStatusNormal").text("  ");
	row.attr("id", "vehiStatus_" + devIdno);
	if ( (k % 2) == 1) {
		row.attr("class", "tabdata bluebg");
	}
	row.show();
	
	row.mouseover(function(){
		$(this).addClass("focusbg");
	})
	row.mouseout(function(){
		$(this).removeClass("focusbg");
	})
	//加入到列表中
	$("#vehicleStatus").prepend(row);
	checkedVehiList.push(devIdno);
	//加入到地图上
	insertVehicle(devIdno);
	setVehiName(devIdno, vehicle.userAccount.name);
	var icon = vehicle.icon;
	if (icon === null) {
		icon = 1;
	}
	setVehiIcon(devIdno, icon);
	updateMonitorVehicle(vehicle);
	if (isSelect) {
		selectVehicleEx(devIdno);
	}
	if (vehicle.status !== null && gpsIsGpsValid(vehicle.status.status1)) {
		return true;
	} else {
		return false;
	}
}

function removeMonitorVehicle(devIdno) {
	$("#vehiStatus_" + devIdno).remove();
	for (var i = 0; i < checkedVehiList.length; i += 1) {
		var vehiId = checkedVehiList.pop();
		if ( vehiId == devIdno ){
			break;
		}
		checkedVehiList.unshift(vehiId);
	}
	//从地图上删除车辆信息
	deleteVehicle(devIdno);
}

function addMonitorGroup(group) {
	var vehicles = vehiTree.getAllSubItems(group).split(",");
	var first = false;
	for (var i = 0; i < vehicles.length; i = i + 1) {
		if (!vehiTree.isGroupItem(vehicles[i])) {
			if ($("#vehiStatus_" + vehicles[i]).length == 0) {
				if (!first) {
					first = addMonitorVehicle(vehicles[i], true);
				} else {
					addMonitorVehicle(vehicles[i], false);
				}
			}
		}
	}
}

function updateVehiStatus() {
	var k = checkedVehiList.length;
	$("#vehicleStatus tr").each(function(){
		if (/^(\w+)\_(\w+)/.test(this.id)) {
		 	$(this).find("#tdVehiStatusIndex").text(k);
		 	if ((k % 2) == 1) {
		 		$(this).attr("class", "tabdata bluebg");
		 	} else {
		 		$(this).attr("class", "tabdata");
		 	}
		 	k -= 1;
		}
	});
}

function vehiTreeCheckboxClick(id, state) {
	//选中车辆结点
	if (!vehiTree.isGroupItem(id)) {
		if (state) {
			addMonitorVehicle(id, true);
		} else {
			removeMonitorVehicle(id);
 			//更新列表的状态	上一行下一行的状态
			updateVehiStatus();
		}
	} else {
		//如果是父结点，把没有加到列表中的数据添加到列表中
		if (vehiTree.isRootItem(id)) {
			if (state) {
				addMonitorGroup(id);
			} else {
				//将列表中的车辆全部移除
				var length = checkedVehiList.length;
				for (var i = 0; i < length; i += 1) {
					var vehiId = checkedVehiList.pop();
					$("#vehiStatus_" + vehiId).remove();
					deleteVehicle(vehiId);
				}
			}
		} else {
			//如果是分组结点
			if (state) {
				//添加，则将属于此分组的车辆信息执行添加
				addMonitorGroup(id);
			} else {
				//移除，则将属于此分组的车辆信息移除
				var vehicles = vehiTree.getAllSubItems(id).split(",");
				for (var i = 0; i < vehicles.length; i = i + 1) {
					if (!vehiTree.isGroupItem(vehicles[i])) {
						if ($("#vehiStatus_" + vehicles[i]).length > 0) {
							removeMonitorVehicle(vehicles[i]);
						}
					}
				}
				updateVehiStatus();
			}
		}
	}
	showVehicleStatus();
	updateVehiStatusCount();
	return true;
}

function showVehicleStatus() {
	if (checkedVehiList.length > 0) {
		showVehiStatus = true;
		moveMapAndVehiStatus();
	} else {
		showVehiStatus = false;
		moveMapAndVehiStatus();
	}
}

function vehiTreeClickEvent(id) {
	if (!vehiTree.isGroupItem(id)) {
		selectVehicleEx(id);
	}
}

function clickVehiStatus(obj) {
	var temp = obj.id.split('_');
	if (temp.length == 2) {
		selectVehicleEx(temp[1]);
	}
}

function queryVehicleStatus() {
	if (dateIsTimeout(lastAllVehiStatusTime, 120000)) {
		isQueryAllVehiStatus = true;
	}
	
	if (checkedVehiList.length > 0 || isQueryAllVehiStatus) {
		var data = {};
		if (isQueryAllVehiStatus) {
			data.devIdnos = allVehiList.toString();
		} else {
			data.devIdnos = checkedVehiList.toString();
		}
		$.myajax.jsonGetEx("PositionAction_status.action", doAjaxVehicleStatus, null, data);
	} else {
		setTimeout(queryVehicleStatus, vehiMonitorInterval);
	}
}

function doAjaxVehicleStatus(json,action,success) {
	var empty = true;
	if (success) {
		if (json.status != null) {
			for (var i = 0; i < json.status.length; i += 1) {
				var status = json.status[i];
				//更新到车辆对象中
				var vehicle = gpsGetVehicleObj(status.devIdno);
				if (vehicle != null) {
					vehicle.status = status;
					//更新到地图和车辆列表
					updateMonitorVehicle(vehicle);
				}
			}
			updateVehiStatusCount();
		}
		if (isQueryAllVehiStatus) {
			isQueryAllVehiStatus = false;
			lastAllVehiStatusTime = new Date();
		}	
	}
	
	setTimeout(queryVehicleStatus, vehiMonitorInterval);
}

function updateVehiStatusCount() {
	var onlineCount = 0;
	var offlineCount = 0;
	var alarmCount = 0;
	var parkAcconCount = 0;
	
	for (var i = 0; i < parent.vehicleList.length; i += 1) {
		var vehicle = parent.vehicleList[i];
		if (vehicle.status !== null && vehicle.status.online) {
			onlineCount += 1;
			//处于监控状态，才进行判断
			if ($("#vehiStatus_" + vehicle.idno).length > 0) {
				//判断车辆是否处于报警的状态
				if (vehicle.status.isAlarm) {
					alarmCount += 1;
				} else if (vehicle.status.isParkAccon) {
					parkAcconCount += 1;
				}
			} else {
				//判断车辆状态，并更新图标
				var data = gpsParseDeviceStatus(vehicle, vehicle.status);
				//判断车辆是否处于报警的状态
				if (vehicle.status.isAlarm) {
					alarmCount += 1;
				} else if (vehicle.status.isParkAccon) {
					parkAcconCount += 1;
				}
				updateVehicleImage(vehicle, data.vehiImg);
			}
		} else {
			offlineCount += 1;
			//判断车辆状态，并更新图标
			updateVehicleImage("vehicle_offline.gif");
		}
	}
	$("#spanOnlineCount").text(onlineCount);
	$("#spanOfflineCount").text(offlineCount);
	$("#spanAlarmCount").text(alarmCount);
	$("#spanParkAcconCount").text(parkAcconCount);
}
