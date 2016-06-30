/*
 * 地图接口操作类
 */

/**
 * 地图操作类
 */
function TtxMap(frameMap){
	this.frameMap = frameMap;	//地图是一个IFrame对象
	this.mapWindows = null;
	this.isInitSuc = false;
	this.checkTimer = null;
	this.loadSucCallback = null;
}

/*
 * 判断地图是否加载成功，加载成功，才可以调用相应的接口
 */
TtxMap.prototype.isLoadSuc = function(){
	return this.isInitSuc;
};

/*
 * 初始化
 */
TtxMap.prototype.initialize = function(callback){
	this.loadSucCallback = callback;
	this.doReload();
};

/*
 * 使用定时器判断地图是否加载成功
 */
TtxMap.prototype.runCheckTimer = function(){
	var map = this;
	this.checkTimer = setTimeout(function () {
		map.checkLoad();
	}, 100);
};

/*
 * 使用定时器判断地图是否加载成功
 */
TtxMap.prototype.checkLoad = function(){
	if (this.isInitSuc) {
		return ;
	}
	var obj = document.getElementById(this.frameMap);
	if (obj != null && typeof obj.contentWindow.isLoadMapSuc == "function") {
		this.isInitSuc = obj.contentWindow.isLoadMapSuc();
		this.mapWindows = obj.contentWindow;
	}
	if (this.isInitSuc) {
		if (this.loadSucCallback != null) {
			this.loadSucCallback();
		}
	} else {
		this.runCheckTimer();
	}
};

/*
 * 地图重新加载，则使用定时器判断状态是否正确
 */
TtxMap.prototype.doReload = function(){
	this.isInitSuc = false;
	this.mapWindows = null;
	this.runCheckTimer();
};

/*
 * 隐藏地图工具栏
 */
TtxMap.prototype.hideToolbar = function(hide){
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.hideToolbar(hide);
};

/*
 * 添加车辆结点
 */
TtxMap.prototype.insertVehicle = function(vehiIdno) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.insertVehicle(vehiIdno);
};

//查找车辆节点
TtxMap.prototype.findVehicle = function(vehiIdno) {
	if (!this.isInitSuc) {
		return null;
	} 
	
	return this.mapWindows.findVehicle(vehiIdno);
};

TtxMap.prototype.setVehiName = function(vehiIdno, name) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.setVehiName(vehiIdno, name);
};

TtxMap.prototype.setVehiMenu = function(vehiIdno, index, name, popMenu, cls) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.setVehiMenu(vehiIdno, index, name, popMenu, cls);
};

TtxMap.prototype.delVehiMenu = function(vehiIdno, index){ //删除弹出菜单信息
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.delVehiMenu(vehiIdno, index);
};

TtxMap.prototype.setVehiPopMenuName = function(vehiIdno, index, popindex, popname, cls) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.setVehiPopMenuName(vehiIdno, index, popindex, popname, cls);
};

TtxMap.prototype.delVehiPopMenu = function(vehiIdno, index, begIndex) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.delVehiPopMenu(vehiIdno, index, begIndex);
};

TtxMap.prototype.setVehiIcon = function(vehiIdno, icon) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.setVehiIcon(vehiIdno, icon);
};

TtxMap.prototype.updateVehicle = function(vehiIdno, jindu, weidu, huangXiangId, statusImage, speed, time, statusStr) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.updateVehicle(vehiIdno, jindu, weidu, huangXiangId, statusImage, speed, time, statusStr);
};

TtxMap.prototype.selectVehicle = function(vehiIdno) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.selectVehicleEx(vehiIdno);
};

TtxMap.prototype.centerVehicle = function(vehiIdno) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.centerVehicle(vehiIdno);
};

TtxMap.prototype.deleteVehicle = function(vehiIdno) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.deleteVehicle(vehiIdno);
};

//删除所有车辆信息
TtxMap.prototype.deleteAllVehicle = function() {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.deleteAllVehicle();
};

/*
 * 添加条轨迹
 */
TtxMap.prototype.trackInsertTrack = function(trackId) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.trackInsertTrack(trackId);
};

/*
 * 压入一个点，用于画轨迹线
 */
TtxMap.prototype.trackPushPoint = function(trackId, jindu, weidu) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.trackPushPoint(trackId, jindu, weidu);
};

/*
 * 画轨迹点
 */
TtxMap.prototype.trackDrawPoint = function(trackId) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.trackDrawPoint(trackId);
};

/*
 * 插入1个轨迹点
 */
TtxMap.prototype.trackInsertVehicle = function(trackId, vehiId, vehiIcon) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.trackInsertVehicle(trackId, vehiId, vehiIcon);
};

/*
 * 更新轨迹点的信息
 */
TtxMap.prototype.trackUpdateVehicle = function(trackId, vehiId, name, jindu, weidu, huangXiangId, statusImage, label, statusStr, show) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.trackUpdateVehicle(trackId, vehiId, name, jindu, weidu, huangXiangId, statusImage, label, statusStr, show);
};

/*
 * 查找所有轨迹点
 */
TtxMap.prototype.findTracker = function(trackId) {
	if (!this.isInitSuc) {
		return null;
	} 
	
	return this.mapWindows.findTracker(trackId);
};

/*
 * 查找轨迹点
 */
TtxMap.prototype.trackFindVehicle = function(track, vehiId) {
	if (!this.isInitSuc) {
		return null;
	} 
	
	return this.mapWindows.trackFindVehicle(track, vehiId);
};

/*
 * 选择轨迹点
 */
TtxMap.prototype.trackSelectVehicle = function(trackId, vehiId) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.trackSelectVehicle(trackId, vehiId);
};

/*
 * 轨迹点居中
 */
TtxMap.prototype.trackCenterVehicle = function(trackId, vehiId, hideMarkerPop) {
	if (!this.isInitSuc) {
		return ;
	}
	this.mapWindows.trackCenterVehicle(trackId, vehiId, hideMarkerPop);
};

/*
 * 删除轨迹点
 */
TtxMap.prototype.trackDeleteVehicle = function(trackId, vehiId) {
	if (!this.isInitSuc) {
		return ;
	} 
	
	this.mapWindows.trackDeleteVehicle(trackId, vehiId);
};

/*
 * 删除轨迹
 */
TtxMap.prototype.trackDeleteTrack = function(trackId) {
	if (!this.isInitSuc) {
		return ;
	} 
	this.mapWindows.deletePositionTip();
	this.mapWindows.trackDeleteTrack(trackId);
};

//加入一个标记
TtxMap.prototype.insertMarker = function(markerId) {
	if (!this.isInitSuc) {
		return ;
	}
	this.mapWindows.insertMarker(markerId);
}

//查找标记
TtxMap.prototype.findMarker = function(markerId) {
	if (!this.isInitSuc) {
		return ;
	}
	return this.mapWindows.findMarker(markerId);
}

//更新标记点
TtxMap.prototype.updateMarker = function(markerId, typeId, name, jindu, weidu
		, tabType, color, status, param, iconImage) {
	if (!this.isInitSuc) {
		return ;
	}
	this.mapWindows.updateMarker(markerId, typeId, name, jindu, weidu
			, tabType, color, status, param, iconImage) ;
}

//选择标记
TtxMap.prototype.selectMarker = function(markerId) {
	if (!this.isInitSuc) {
		return ;
	}
	this.mapWindows.selectMarker(markerId);
}

//删除标记
TtxMap.prototype.deleteMarker = function(markerId) {
	if (!this.isInitSuc) {
		return ;
	}
	this.mapWindows.deleteMarker(markerId);
}

/*
 * 是否可切换地图
 * @param show
 */
TtxMap.prototype.setSwitchMap = function(show) {
	if (!this.isInitSuc) {
		return ;
	}
	this.mapWindows.setSwitchMap(show);
}

/*
 * 是否启用拉框查找
 * @param show
 */
TtxMap.prototype.enableSearchbox = function(show) {
	if (!this.isInitSuc) {
		return ;
	}
	this.mapWindows.enableSearchbox(show);
}

/*
 * 是否启用切换地图
 * @param show
 */
TtxMap.prototype.enableChangeMap = function(show) {
	if (!this.isInitSuc) {
		return ;
	}
	this.mapWindows.enableChangeMap(show);
}

/*
 * 是否启用我的地图
 * @param show
 */
TtxMap.prototype.enableMyMap = function(show) {
	if (!this.isInitSuc) {
		return ;
	}
	this.mapWindows.enableMyMap(show);
}


/*
 * 是否启用地图工具
 * @param show
 */
TtxMap.prototype.enableMapTool = function(show) {
	if (!this.isInitSuc) {
		return ;
	}
	this.mapWindows.enableMapTool(show);
}

/*
 * 是否启用画点操作
 * @param show
 */
TtxMap.prototype.enableDrawPoint = function(show) {
	if (!this.isInitSuc) {
		return ;
	}
	this.mapWindows.enableDrawPoint(show);
}

/**
 * 是否开启圆，面和线 的编辑
 * @param enable
 */
TtxMap.prototype.enableMarkerEditing = function(markerId, enable) {
	if (!this.isInitSuc) {
		return ;
	}
	this.mapWindows.enableMarkerEditing(markerId, enable);
}


/*
 * 需要使用地图的经纬度来进行解析
 * 成功返回非空值，{address,city}
 */
TtxMap.prototype.getGeoAddress = function(jingDu, weiDu) {
	if (!this.isInitSuc) {
		return null;
	} 
	return this.mapWindows.getGeoAddress(jingDu, weiDu);
};

/*
 * 需要使用地图的经纬度来进行解析
 * callback 参数：key, jing, weidu, address, city
 * key用于传参使用，回调时返回些参数，便于上层使用
 */
TtxMap.prototype.geocoderAddress = function(key, jingDu, weiDu, callback) {
	if (!this.isInitSuc) {
		return false;
	} 
	this.mapWindows.geocoderAddress(key, jingDu, weiDu, callback);
	return true;
};

/*
 * 判断点是否在矩形内
 */
TtxMap.prototype.isPointInRect = function(jingDu, weiDu, rectJing, rectWei) {
	if (!this.isInitSuc) {
		return false;
	} 
	return this.mapWindows.isPointInRect(jingDu, weiDu, rectJing, rectWei);
};

/**
 * 是否禁止系统右键  true 禁止
 */
TtxMap.prototype.disableSysRight = function(id,disable,func) {
	if (!this.isInitSuc) {
		return;
	} 
	this.mapWindows.disableSysRight(id,disable,func);
};

/**
 * 判断点是否在可视地图范围内
 */
TtxMap.prototype.isPtInVisibleMap = function(jingDu, weiDu) {
	if (!this.isInitSuc) {
		return false;
	} 
	return this.mapWindows.isPtInVisibleMap(jingDu, weiDu);
};

/**
 * 地图可视区域发生变化时调用(包含更改缩放级别、拖拽地图)
 * 谷歌地图无地图大小改变事件
 */
TtxMap.prototype.visibleMapResize = function(callback) {
	if (!this.isInitSuc) {
		return;
	} 
	this.mapWindows.visibleMapResize(callback);
};

/**
 * 设置启用地图点聚合参数
 */
TtxMap.prototype.setMarkerClusterParam = function(enable, maxZoom, minSize, addVehicleFunc, delVehicleFunc){
	if (!this.isInitSuc) {
		return;
	}
	
	this.mapWindows.setMarkerClusterParam(enable, maxZoom, minSize, addVehicleFunc, delVehicleFunc);
};

/**
 * 画区域操作  1点 2矩形 3多边形 10区域 9线
 */
TtxMap.prototype.doMapDrawMarker = function(type, jingdu, weidu, param){
	if (!this.isInitSuc) {
		return;
	}
	
	this.mapWindows.doMapDrawMarker(type, jingdu, weidu, param);
};

/**
 * 设置地图全屏按钮文字
 */
TtxMap.prototype.doSetMapFullTitle = function(title){
	if (!this.isInitSuc) {
		return;
	}
	
	this.mapWindows.doSetMapFullTitle(title);
};

/**
 * 设置地图全屏按钮样式
 * @param isFull 全屏
 */
TtxMap.prototype.doSetMapFullIcon = function(isFull){
	if (!this.isInitSuc) {
		return;
	}
	
	this.mapWindows.doSetMapFullIcon(isFull);
};

/**
 * 显示地图导航栏保存按钮
 */
TtxMap.prototype.enableMapMoreBtnAdd = function(enable){
	if (!this.isInitSuc) {
		return;
	}
	
	this.mapWindows.enableMapMoreBtnAdd(enable);
};