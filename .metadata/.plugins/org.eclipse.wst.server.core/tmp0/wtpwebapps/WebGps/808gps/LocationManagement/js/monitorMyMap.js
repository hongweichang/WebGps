/**
 * 我的地图处理类
 */
function monitorMyMap(){
	this.roleCls = null;  //权限类对象
	this.isLoadSuc = false; //初次加载标记信息是否加载完成
	this.lstCompanyId = []; //可操作公司id列表
	this.lstAreaType = []; // 区域类型列表
	this.lastSelectId = null; //最后选择的区域id
	this.mapPointInfo = new Hashtable();  //标记点信息列表
	this.mapAreaInfo = new Hashtable(); //标记区域信息列表
	this.mapLineInfo = new Hashtable(); //标记线路信息列表
}

//赋值权限类对象
monitorMyMap.prototype.setRoleCls = function(roleCls) {
	if(typeof roleCls != 'undefined' && roleCls != null) {
		this.roleCls = roleCls;
	}
}

//初始化区域信息
monitorMyMap.prototype.initMapAreaInfo = function() {
	//取index的区域信息
	if(parent.markers) {
		for (var i = 0; i < parent.markers.length; i++) {
			if(parent.markers[i].markerType == 2 || parent.markers[i].markerType == 3 ||
					parent.markers[i].markerType == 10) {
				this.mapAreaInfo.put(Number(parent.markers[i].id), parent.markers[i]);
			}else if(parent.markers[i].markerType == 1) {
				this.mapPointInfo.put(Number(parent.markers[i].id), parent.markers[i]);
			}else if(parent.markers[i].markerType == 4) {
				this.mapLineInfo.put(Number(parent.markers[i].id), parent.markers[i]);
			}
		}
	}else {
		var that = this;
		setTimeout(function() {
			that.initMapAreaInfo();
		}, 50);
	}
}

//初始化
monitorMyMap.prototype.initialize = function() {
	//初始化表格
	this.initMapTable();
	//初始化可操作公司id列表
	this.initCompanyIdList();
	//初始化区域类型
	this.initAreaTypeList();
	//初始化区域信息
	this.initMapAreaInfo();
	
	var myMap_ = this;
	//点击我的地图，显示或者隐藏标记信息
	$('#myMap_ .spantitle').on('click', function() {
		if($('#myMap_ .myMap-pane').hasClass('active')) {
			$('#myMap_ .myMap-pane').removeClass('active');
		}else {
			//点击才加载地图信息
			if(!myMap_.isLoadSuc) {
				myMap_.isLoadSuc = true;
				myMap_.loadMyMapParam();
			}
			$('#myMap_ .myMap-pane').addClass('active');
		}
	});
	$('#myMap_ .myMap-tab li').on('click', function() {
		var _index = $(this).index();
		$(this).addClass("active").siblings().removeClass("active");
		$("#myMap_ .myMap-box li").eq(_index).addClass("active").siblings().removeClass("active");
	});
}

//初始化可操作公司id列表
monitorMyMap.prototype.initCompanyIdList = function() {
	if(parent.companys && parent.companys.length > 0) {
		for (var i = 0; i < parent.companys.length; i++) {
			this.lstCompanyId.push(parent.companys[i].id);
		}
	}
}

//初始化区域类型
monitorMyMap.prototype.initAreaTypeList = function() {
	this.lstAreaType.push({id: 1, name: parent.lang.mark_point});
	this.lstAreaType.push({id: 2, name: parent.lang.alarm_rect_area});
	this.lstAreaType.push({id: 3, name: parent.lang.alarm_poligon_area});
	this.lstAreaType.push({id: 4, name: parent.lang.alarm_line});
	this.lstAreaType.push({id: 10, name: parent.lang.alarm_circle_area});
}

//初始化表格
monitorMyMap.prototype.initMapTable = function() {
	//初始化地图上点的列表
	this.initPointTable();
	//初始化地图上区域的列表
	this.initAreaTable();
	//初始化地图上线路的列表
	this.initLineTable();
}

//初始化地图上点的列表
monitorMyMap.prototype.initPointTable = function() {
	//本类对象
	var myMap_ = this;
	this.pointTable = $("#pointTable").flexigrid({
		url: "StandardVehicleRuleAction_listMark",//.action?markType=1",
		dataType: 'json',
		colModel : [
	            {display: parent.lang.operator, name : 'operator', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.index, name : 'index', width : 30, sortable : false, align: 'center'},
				{display: parent.lang.monitor_myMapName, name : 'name', width : 130, sortable : false, align: 'center'},
				{display: parent.lang.monitor_myMapType, name : 'markerType', width : 80, sortable : false, align: 'center'},
				{display: parent.lang.mark_share, name : 'share', width : 50, sortable : false, align: 'center'}
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		usepager: true,
		autoload: false,
		useRp: true,
		singleSelect: true,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: true,
		width: 'auto',
		height: 210,
		onSubmit: function() {
			myMap_.addPointTableList();
		},
		resizable: false
	});
	
	this.pointTable.flexSetFillCellFun(function(p, row, idx, index) {
		return myMap_.fillUserMapTable(p, row, idx, index);	
	});
	this.pointTable.flexSelectRowPropFun(function(obj) {
		myMap_.selectPointRowProp(obj);
	});
}

/**
 * 调用自定义加载数据加载点信息
 */
monitorMyMap.prototype.addPointTableList = function() {
	if(this.mapPointInfo) {
		//加入列表
		var param = this.pointTable.flexGetParams();
		var start = (param.newp - 1) * param.rp;
		if(start >= this.mapPointInfo.size()) {
			param.newp = 1;
			start = 0;
		}
		var end = param.newp * param.rp;
		var infos = [];
		var index = 0;
		this.mapPointInfo.each(function(id, value) {
			if(index >= start && index < end) {
				infos.push(value);
			}
			index++;
		});
		var pagination={currentPage: param.newp, pageRecords: param.rp, totalRecords: this.mapPointInfo.size()};
		var json = {};
		json.infos = infos;
		json.pagination = pagination;
		
		this.pointTable.flexAddData(json, false);
		
		//修改数目
		$('#myMap_ #pointSum').text("("+ this.mapPointInfo.size() +")");
	}else {
		//修改数目
		$('#myMap_ #pointSum').text("(0)");
	}
}

//初始化地图上区域的列表
monitorMyMap.prototype.initAreaTable = function() {
	//本类对象
	var myMap_ = this;
	this.areaTable = $("#areaTable").flexigrid({
		url: "StandardVehicleRuleAction_listMark",//.action?markType=3",
		dataType: 'json',
		colModel : [
		    {display: parent.lang.operator, name : 'operator', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.index, name : 'index', width : 30, sortable : false, align: 'center'},
			{display: parent.lang.monitor_myMapName, name : 'name', width : 130, sortable : false, align: 'center'},
			{display: parent.lang.monitor_myMapType, name : 'markerType', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.mark_share, name : 'share', width : 50, sortable : false, align: 'center'}
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		usepager: true,
		autoload: false,
		useRp: true,
		singleSelect: true,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: true,
		width: 'auto',
		height: 210,
		onSubmit: function() {
			myMap_.addAreaTableList();
		},
		resizable: false
	});
	this.areaTable.flexSetFillCellFun(function(p, row, idx, index) {
		return myMap_.fillUserMapTable(p, row, idx, index);	
	});
	this.areaTable.flexSelectRowPropFun(function(obj) {
		myMap_.selectAreaRowProp(obj);
	});
}

/**
 * 调用自定义加载数据加载区域的信息
 */
monitorMyMap.prototype.addAreaTableList = function() {
	if(this.mapAreaInfo) {
		var param = this.areaTable.flexGetParams();
		var start = (param.newp - 1) * param.rp;
		if(start >= this.mapAreaInfo.size()) {
			param.newp = 1;
			start = 0;
		}
		var end = param.newp * param.rp;
		var infos = [];
		var index = 0;
		this.mapAreaInfo.each(function(id, value) {
			if(index >= start && index < end) {
				infos.push(value);
			}
			index++;
		});
		var pagination={currentPage: param.newp, pageRecords: param.rp, totalRecords: this.mapAreaInfo.size()};
		var json = {};
		json.infos = infos;
		json.pagination = pagination;
		
		this.areaTable.flexAddData(json, false);
		//修改数目
		$('#myMap_ #areaSum').text("("+ this.mapAreaInfo.size() +")");
	}else {
		//修改数目
		$('#myMap_ #areaSum').text("(0)");
	}
}

//初始化地图上线路的列表
monitorMyMap.prototype.initLineTable = function() {
	//本类对象
	var myMap_ = this;
	this.lineTable = $("#lineTable").flexigrid({
		url: "StandardVehicleRuleAction_listMark",//.action?markType=2",
		dataType: 'json',
		colModel : [
		    {display: parent.lang.operator, name : 'operator', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.index, name : 'index', width : 30, sortable : false, align: 'center'},
			{display: parent.lang.monitor_myMapName, name : 'name', width : 130, sortable : false, align: 'center'},
			{display: parent.lang.monitor_myMapType, name : 'markerType', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.mark_share, name : 'share', width : 50, sortable : false, align: 'center'}
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		usepager: true,
		autoload: false,
		useRp: true,
		singleSelect: true,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: true,
		width: 'auto',
		height: 210,
		onSubmit: function() {
			myMap_.addAreaTableList();
		},
		resizable: false
	});
	this.lineTable.flexSetFillCellFun(function(p, row, idx, index) {
		return myMap_.fillUserMapTable(p, row, idx, index);	
	});
	this.lineTable.flexSelectRowPropFun(function(obj) {
		myMap_.selectLineRowProp(obj);
	});
}

/**
 * 调用自定义加载数据加载线路信息
 */
monitorMyMap.prototype.addLineTableList = function() {
	if(this.mapLineInfo) {
		var param = this.lineTable.flexGetParams();
		var start = (param.newp - 1) * param.rp;
		if(start >= this.mapLineInfo.size()) {
			param.newp = 1;
			start = 0;
		}
		var end = param.newp * param.rp;
		var infos = [];
		var index = 0;
		this.mapLineInfo.each(function(id, value) {
			if(index >= start && index < end) {
				infos.push(value);
			}
			index++;
		});
		var pagination={currentPage: param.newp, pageRecords: param.rp, totalRecords: this.mapLineInfo.size()};
		var json = {};
		json.infos = infos;
		json.pagination = pagination;
		
		this.lineTable.flexAddData(json, false);
		//修改数目
		$('#myMap_ #lineSum').text("("+ this.mapLineInfo.size() +")");
	}else {
		//修改数目
		$('#myMap_ #lineSum').text("(0)");
	}
}

monitorMyMap.prototype.getColumnTitle = function(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

//填充地图信息列表
monitorMyMap.prototype.fillUserMapTable = function(p, row, idx, index){
	var name = p.colModel[idx].name;
	var pos = "";
	if(name == 'operator'){
		if((row['userID'] == parent.companyId && row['creator'] == parent.userId) || this.lstCompanyId.in_array(row['userID']) || this.roleCls.isAdmin()){
			pos += '<a class="delete" href="javascript:delMarkerAreaInfo('+row['id']+');" title="'+parent.lang.del+'"></a>';
		}
		return pos;
	}else if(name == 'markerType') {
		pos = getArrayName(this.lstAreaType, row[name]); 
	}else if(name == 'share') {
		if(row[name] == 1) {
			pos = parent.lang.mark_part_share;
		}else if(row[name] == 2) {
			pos = parent.lang.mark_all_share;
		}else {
			pos = parent.lang.mark_not_share;
		}
	}else {
		pos = row[name];
	}
	return this.getColumnTitle(pos);
};

//选中点信息
monitorMyMap.prototype.selectPointRowProp = function(obj) {
	if(this.lastSelectId != null && this.lastSelectId != ""){
		this.delMarkOnMap(this.lastSelectId);
	}
	var info = this.mapPointInfo.get(Number($(obj).attr('data-id')));
	if(info) {
		this.addMarkOnMap(info);
	}
}

//选中区域信息
monitorMyMap.prototype.selectAreaRowProp = function(obj) {
	if(this.lastSelectId != null && this.lastSelectId != ""){
		this.delMarkOnMap(this.lastSelectId);
	}
	var info = this.mapAreaInfo.get(Number($(obj).attr('data-id')));
	if(info) {
		this.addMarkOnMap(info);
	}
}

//选中线路信息
monitorMyMap.prototype.selectLineRowProp = function(obj) {
	if(this.lastSelectId != null && this.lastSelectId != ""){
		this.delMarkOnMap(this.lastSelectId);
	}
	var info = this.mapLineInfo.get(Number($(obj).attr('data-id')));
	if(info) {
		this.addMarkOnMap(info);
	}
}

//删除地图上标记信息
//type 1点 2区域 3线路
monitorMyMap.prototype.delMarkOnMap = function(id) {
	if(typeof ttxMap != 'undefined' && ttxMap != null) {
		ttxMap.deleteMarker(id);
	}
}

//向地图添加标记
monitorMyMap.prototype.addMarkOnMap = function(info) {
	var gps = this.getConvertBaiduGoogle(info.jingDu, info.weiDu, info.mapType);
	if(!info.color) {
		info.color = "FF0000";
	}
	if(typeof ttxMap != 'undefined' && ttxMap != null) {
		ttxMap.insertMarker(info.id);
		if(info && info.markerType == 4) {//添加线路
			ttxMap.updateMarker(info.id, 9, info.name, gps.lng, gps.lat
					, 0, info.color, null, info.radius);
		}else {
			ttxMap.updateMarker(info.id, info.markerType, info.name, gps.lng, gps.lat
					, 0, info.color, null, info.radius);
		}
		ttxMap.selectMarker(info.id);
	}
	this.lastSelectId = Number(info.id);
}

//经纬度转换，mapType_标记的地图类型
monitorMyMap.prototype.getConvertBaiduGoogle = function(jingDu, weiDu, mapType_) {
	var ret = {};
	ret.lng = '';
	ret.lat = '';
	var jingDus = jingDu.split(',');
	var weiDus = weiDu.split(',');
	if(typeof convertBaiduGoogle == 'function') {
		if(mapType_ == 3 && !this.isBaiduMap()) {//百度转谷歌
			for (var i = 0; i < jingDus.length; i++) {
				var gps = convertBaiduGoogle(weiDus[i], jingDus[i], 1);
				if(i != 0) {
					ret.lng += ',';
					ret.lat += ',';
				}
				ret.lng += gps.lng;
				ret.lat += gps.lat;
			}
		}else if(mapType_ != 3 && this.isBaiduMap()){//谷歌经纬度转为百度经纬度
			for (var i = 0; i < jingDus.length; i++) {
				var gps = convertBaiduGoogle(weiDus[i], jingDus[i], 2);
				if(i != 0) {
					ret.lng += ',';
					ret.lat += ',';
				}
				ret.lng += gps.lng;
				ret.lat += gps.lat;
			}
		}else {
			ret.lng = jingDu;
			ret.lat = weiDu;
		}
	}else {
		ret.lng = jingDu;
		ret.lat = weiDu;
	}
	return ret;	
}

//是否百度地图
monitorMyMap.prototype.isBaiduMap = function() {
	var mapType = parent.getMapType();
	if (mapType == 3) {
		return true;
	} else {
		return false;
	}
}

//加载我的地图信息
monitorMyMap.prototype.loadMyMapParam = function() {
	this.addPointTableList();
	this.addAreaTableList();
	this.addLineTableList();
}

//删除地图标记（数据库）
monitorMyMap.prototype.delMarkerAreaInfo = function(markerId) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	var myMap_ = this;
	$.myajax.jsonGet('StandardLoginAction_deleteArea.action?id=' + markerId, function(json,action,success){
		$.myajax.showLoading(false);
		if(success){
			myMap_.delMarkerAreaInfoSuc(markerId);
		}
	}, null);
}

//删除标记成功后执行
monitorMyMap.prototype.delMarkerAreaInfoSuc = function(markerId) {
	//删除parent 里面的标记信息
	if(parent.markers) {
		for (var i = 0; i < parent.markers.length; i++) {
			if(parent.markers[i].id == markerId) {
				parent.markers.splice(i, 1);
				break;
			}
		}
	}
	//删除缓存中的信息
	var oldInfo = this.mapPointInfo.get(Number(markerId));
	if(!oldInfo) {
		oldInfo = this.mapAreaInfo.get(Number(markerId));
		if(!oldInfo) {
			oldInfo = this.mapLineInfo.get(Number(markerId));
			this.mapLineInfo.remove(Number(markerId));
			this.addLineTableList();
		}else {
			this.mapAreaInfo.remove(Number(markerId));
			this.addAreaTableList();
		}
	}else {
		this.mapPointInfo.remove(Number(markerId));
		this.addPointTableList();
	}
	//删除地图上的标记
	this.delMarkOnMap(markerId);
}

//地图上画图操作，加入数据库
monitorMyMap.prototype.addMarkerAreaInfo = function(type, jingdu, weidu, param) {
	if(type == 1){//加标记点
		$.dialog({id:'ruleinfo', title:parent.lang.addPoint,content: 'url:RulesManagement/AreaInfo.html?type='+type+'&jingdu='+jingdu+'&weidu='+weidu,
			width:'350px',height:'390px', min:false, max:false, lock:true});
	}else if(type == 2 || type == 3 || type == 10){
		if(type == 2){//加矩形
			$.dialog({id:'ruleinfo', title:parent.lang.addRectangle,content: 'url:RulesManagement/AreaInfo.html?type='+type+'&jingdu='+jingdu+'&weidu='+weidu,
				width:'350px',height:'410px', min:false, max:false, lock:true});
		}else if(type == 3){//加多边形
			$.dialog({id:'ruleinfo', title:parent.lang.addPolygon,content: 'url:RulesManagement/AreaInfo.html?type='+type+'&jingdu='+jingdu+'&weidu='+weidu,
				width:'350px',height:'410px', min:false, max:false, lock:true});
		}else if(type == 10){//加圆
			$.dialog({id:'ruleinfo', title:parent.lang.tipAddCircle,content: 'url:RulesManagement/AreaInfo.html?type='+type+'&jingdu='+jingdu+'&weidu='+weidu+'&param='+param,
				width:'350px',height:'410px', min:false, max:false, lock:true});
		}
	}else if(type == 9){//加线路
		$.dialog({id:'ruleinfo', title:parent.lang.addLine,content: 'url:RulesManagement/AreaInfo.html?type='+type+'&jingdu='+jingdu+'&weidu='+weidu,
			width:'350px',height:'390px', min:false, max:false, lock:true});
	}
}

//添加标记成功后执行
monitorMyMap.prototype.doSaveMarkerSuc = function(marker) {
	$.dialog({id:'ruleinfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//添加parent 里面的标记信息
	if(parent.markers) {
		parent.markers.push(marker);
	}
	//添加标记信息到缓存中
	if(marker.markerType == 2 || marker.markerType == 3 ||
			marker.markerType == 10) {
		this.mapAreaInfo.put(Number(marker.id), marker);
		this.addAreaTableList();
	}else if(marker.markerType == 1) {
		this.mapPointInfo.put(Number(marker.id), marker);
		this.addPointTableList();
	}else if(marker.markerType == 4) {
		this.mapLineInfo.put(Number(marker.id), marker);
		this.addLineTableList();
	}
	if(this.lastSelectId != null && this.lastSelectId != ""){
		this.delMarkOnMap(this.lastSelectId);
	}
	//添加标记到地图
	this.lastSelectId = Number(marker.id);
	this.addMarkOnMap(marker);
}