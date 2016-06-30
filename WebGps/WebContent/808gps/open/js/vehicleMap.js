var toMap = 2;  		//	1 GOOGLE  2 BAIDU
var mapType = 0;		//0 GOOGLE	1 MAPINFO, 2 HTTPS GOOGLE, 3 BAIDU
var DEF_MAP_TYPE = "MapType";
var vehiIdno = '';
var devIdno= '';
var jsession = '';
var flashStatusInterval = 5000; //刷新车辆状态的间隔
var flashStatusTimer = null;  //刷新车辆状态的定时器
var ttxMap = null;		//地图对象

$(document).ready(function () {
	//初始化语言
	langInitByUrl();
	//加载页面
	loadReadyPage();
});

//加载页面
function loadReadyPage(){
	//如果语言未加载完成，等待
	if (typeof lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		//获取车牌号
		vehiIdno = getUrlParameter("vehiIdno");
		//获取设备号
		devIdno = getUrlParameter("devIdno");
		//获取会话号
		jsession = getUrlParameter("jsession");
		//缓存获取地图参数
		mapType = GetCookie(DEF_MAP_TYPE); 
		if (mapType == null) {
			if (langIsChinese()) {
				mapType = 3;
			} else {
				mapType = 0;
			}
		} else {
			mapType = parseInt(mapType);
		}
		if (mapType == 0) {
			toMap = 1;	//
		} else {
			toMap = 2;
		}
		
		//加载页面
		loadPage();
	}
}

//获取地图参数
function getMapType() {
	return mapType;
}

//保存地图参数
function saveMapType(type) {
	mapType = type;
	if(type == 0) {
		toMap = 1;
	}else if(type == 3){
		toMap = 2;
	}
	SetCookie(DEF_MAP_TYPE, mapType);
}

//加载页面
function loadPage() {
	//设置标题
	if(devIdno) {
		document.title = devIdno;
	}else if(vehiIdno){
		document.title = decodeURIComponent(vehiIdno);
	}
	
	//设置页面大小
	setPanelWidth();
	//加载车辆信息
	if(jsession) {
		loadMapVehicle();
	}else {
		//登陆
		doLogin();
	}
	//初始化地图
	initTtxMap();
}

function initTtxMap() {
	ttxMap = new TtxMap('frameMap');
	if(ttxMap != null) {
		ttxMap.initialize(ttxMapLoadSuc);
	}
}

/*
 * 地图加载成功后的回调
 */
function ttxMapLoadSuc() {
	if(ttxMap == null) {
		return;
	}
	//隐藏工具栏
	ttxMap.hideToolbar(true);
	//启用地图切换
	ttxMap.enableChangeMap(true);
	//右键禁止
	ttxMap.disableSysRight('body',true);
	
	//加载信息完成，添加车辆到地图
	loadVehiToMapPre();
}

/*
 * 重新加载地图
 */
function ttxMapReload() {
	$('#frameMap').attr('src', $('#frameMap').attr('src'));
	if(ttxMap != null) {
		ttxMap.initialize(ttxMapLoadSuc);
	}
}

//登陆获取会话号
function doLogin() {
	var account = getUrlParameter("account");
	var password = getUrlParameter("password");
	var param = [];
 	param.push({name: 'account', value: account});
 	param.push({name: 'password', value: password});
	this.doAjaxSubmit('StandardApiAction_loginEx.action', param, function(json, action, success) {
		if(success) {
			jsession = json.jsession;
			//加载车辆信息
			loadMapVehicle();
		}else {
			$.dialog.tips(lang.loginError, 2);
		}
	});
}

//加载地图车辆
function loadMapVehicle() {
	var param = [];
	param.push({name:'toMap', value: toMap});
	param.push({name:'vehiIdno', value: vehiIdno});
	param.push({name:'devIdno', value: devIdno});
	param.push({name:'jsession', value: jsession});
	this.doAjaxSubmit('StandardApiAction_getVehicleDevice.action', param, function(json, action, success) {
		if(success) {
			loadVehiToManage(json.vehicle);
		}else {
			//没有操作权限
			if(json) {
				if(json.result == 5) {
					$.dialog.tips(lang.jsessionError, 2);
				}else if(json.result == 8) {
					$.dialog.tips(lang.vehicleNotOperate, 2);
				}else {
					$.dialog.tips(lang.deviceNoExist, 2);
				}
			}else {
				$.dialog.tips(lang.deviceNoExist, 2);
			}
		}
	});
}

//车辆管理类
var vehicleManager = new VehicleManager();
var isLoadVehicleSuc = false;
//加载车辆信息
function loadVehiToManage(vehicle) {
	if(vehicle != null ) {
		vehiIdno = vehicle.nm;
		var vehi = new standardVehicle(vehicle.nm);
		vehi.setVehicle(vehicle);
		if(vehicle.dl != null) {
			var devices = vehicle.dl;
			for (var j = 0; j < devices.length; j++) {
				var dev_old = devices[j];
				var dev = new standardDevice(dev_old.id);
				dev.setDevice(dev_old);
				dev.setVehiIdno(vehicle.nm);
				vehi.addDevList(dev);
				//将车辆加入到map集合
				vehicleManager.addDevice(dev_old.id, dev);
			}
		}
		vehicleManager.addVehicle(vehi.getIdno(), vehi);
	}
	vehicleManager.updateAllVehiIdnos();
	vehicleManager.updateAllDevIdnos();
	
	isLoadVehicleSuc = true;
}

//添加车辆到地图
function loadVehiToMapPre() {
	if(!isLoadVehicleSuc) {
		setTimeout(loadVehiToMapPre, 50);
	}else {
		loadVehiToMap();
	}
}

//添加车辆到地图
function loadVehiToMap() {
	var vehicle = vehicleManager.getVehicle(vehiIdno);
	if(vehicle != null) {
		var data = vehicle.gpsParseTrackStatus(1);
		data.id = vehiIdno;
		addVehicleToMap(vehicle, data);
	}
	//开启定时刷新车辆的定时器
	runStatusTimer();
}

//添加车辆到地图//判断是否在地图可视范围内
//isCheckVisible 是否判断在可视地图范围内
function addVehicleToMap(vehicle, status){
	if(typeof ttxMap != 'undefined' && ttxMap != null) {
		//地图上的车辆信息
		var mapVehicle = ttxMap.findVehicle(vehiIdno);
		//如果地图中有车辆，则更新状态，否则添加
		if(mapVehicle == null) {
			//插入车辆结点
			ttxMap.insertVehicle(vehicle.getIdno());
			//配置车辆名称
			ttxMap.setVehiName(vehicle.getIdno(),vehicle.getName());
			//配置车辆图标
			ttxMap.setVehiIcon(vehicle.getIdno(),vehicle.getIcon());
		}
		//更新地图上车辆信息
		if (status.isGpsValid) {
			if(mapVehicle == null) {
				mapVehicle = ttxMap.findVehicle(vehiIdno);
			}
			//如果时间有更新
			if(mapVehicle.getTime() == null || status.gpsTime != mapVehicle.getTime()) {
				ttxMap.updateVehicle(vehicle.getIdno(), status.mapJingDu, status.mapWeiDu, status.huangXiang, status.image, status.speed, status.gpsTime, status.statusString);
			}
			ttxMap.selectVehicle(vehicle.getIdno());
		}
	}
};

//启动定时器获取车辆状态
function runStatusTimer(){
	flashStatusTimer = setTimeout(function () {
		flashVehicleStatus();
	}, flashStatusInterval);
};

//刷新车辆状态
function flashVehicleStatus() {
	var param = [];
	param.push({name:'toMap', value: toMap});
	param.push({name:'vehiIdno', value: vehiIdno});
	param.push({name:'devIdno', value: devIdno});
	param.push({name:'jsession', value: jsession});
	this.doAjaxSubmit('StandardApiAction_getDeviceStatus.action', param, function(json, action, success) {
		if(success) {
			if(json.status != null && json.status.length > 0) {
				for (var i = 0; i < json.status.length; i++) {
					var device = vehicleManager.getDevice(json.status[i].id);
					if (device != null) {
						if (!device.isEqualStatus(json.status[i])) {
							if(device.status && json.status[i]) {
								device.setStatus(json.status[i]);
								device.setOnline(json.status[i].ol);
							}
						}
					}
				}
			}
			//刷新车辆信息
			loadVehiToMap();
		}else {
			//没有操作权限
			if(json) {
				if(json.result == 5) {
					$.dialog.tips(lang.jsessionError, 2);
				}else if(json.result == 8) {
					$.dialog.tips(lang.vehicleNotOperate, 2);
				}else {
					//提示刷新车辆失败
					$.dialog.tips(lang.monitor_flashVehicleError, 2);
				}
			}else {
				$.dialog.tips(lang.deviceNoExist, 2);
			}
			//
			runStatusTimer();
		}
	});
}

/**
 *设置页面大小
 */
function setPanelWidth() {
	var wndWidth = document.documentElement.clientWidth;
	var wndHeight = document.documentElement.clientHeight;
	$("#mapInfo").css("width", wndWidth).css("height", wndHeight);
}

//提交ajax
function doAjaxSubmit(action, params, callback) {
	$.ajax({
		type: 'POST',
		url: action,
		data: params,
		cache:false,/*禁用浏览器缓存*/
		dataType: 'json',
		success: function (json) {
			if(json.result == 0){
				callback.call(this, json, action, true);
			} else {
				callback.call(this, json, action, false);
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			try {
				if (p.onError) p.onError(XMLHttpRequest, textStatus, errorThrown);
			} catch (e) {}
			callback.call(this, null, action, false);
		}
	});
}