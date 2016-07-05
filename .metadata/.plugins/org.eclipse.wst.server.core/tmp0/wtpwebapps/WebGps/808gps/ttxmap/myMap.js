/**
 * 我的地图处理类
 */
function monitorMyMap(){
	this.roleCls = null;  //权限类对象
	this.isLoadSuc = false; //初次加载标记信息是否加载完成
	this.lstCompanyId = []; //可操作公司id列表
	this.lstAreaType = []; // 区域类型列表
	this.mapPointInfo = new Hashtable();  //标记点信息列表
	this.mapAreaInfo = new Hashtable(); //标记区域信息列表
	this.mapLineInfo = new Hashtable(); //标记线路信息列表
	this.addMarkerExpId = 910000000; //画区域时的区域Id，画区域结束后删除
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
	if(rootParent.markers) {
		for (var i = 0; i < rootParent.markers.length; i++) {
			if(rootParent.markers[i].markerType == 2 || rootParent.markers[i].markerType == 3 ||
					rootParent.markers[i].markerType == 10) {
				this.mapAreaInfo.put(Number(rootParent.markers[i].id), rootParent.markers[i]);
			}else if(rootParent.markers[i].markerType == 1) {
				this.mapPointInfo.put(Number(rootParent.markers[i].id), rootParent.markers[i]);
			}else if(rootParent.markers[i].markerType == 4) {
				this.mapLineInfo.put(Number(rootParent.markers[i].id), rootParent.markers[i]);
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
		if(_index <= 2) {
			$(this).addClass("active").siblings().removeClass("active");
			$("#myMap_ .myMap-box li").eq(_index).addClass("active").siblings().removeClass("active");
			if(_index == 0) {
				$("#myMap_drawPoint").show();
				$("#myMap_drawCircle").hide();
				$("#myMap_drawRectangle").hide();
				$("#myMap_drawPolygon").hide();
				$("#myMap_drawLine").hide();
			}else if(_index == 1) {
				$("#myMap_drawPoint").hide();
				$("#myMap_drawCircle").show();
				$("#myMap_drawRectangle").show();
				$("#myMap_drawPolygon").show();
				$("#myMap_drawLine").hide();
			}else if(_index == 2) {
				$("#myMap_drawPoint").hide();
				$("#myMap_drawCircle").hide();
				$("#myMap_drawRectangle").hide();
				$("#myMap_drawPolygon").hide();
				$("#myMap_drawLine").show();
			}
		}
	});
}

//初始化可操作公司id列表
monitorMyMap.prototype.initCompanyIdList = function() {
	var companys = rootParent.vehicleManager.getAllVehiTeam();
	if(companys && companys.length > 0) {
		for (var i = 0; i < companys.length; i++) {
			this.lstCompanyId.push(companys[i].id);
		}
	}
}

//初始化区域类型
monitorMyMap.prototype.initAreaTypeList = function() {
	this.lstAreaType.push({id: 1, name: lang.mark_point});
	this.lstAreaType.push({id: 2, name: lang.alarm_rect_area});
	this.lstAreaType.push({id: 3, name: lang.alarm_poligon_area});
	this.lstAreaType.push({id: 4, name: lang.alarm_line});
	this.lstAreaType.push({id: 10, name: lang.alarm_circle_area});
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
	            {display: lang.operator, name : 'operator', width : 80, sortable : false, align: 'center'},
				{display: lang.index, name : 'index', width : 30, sortable : false, align: 'center'},
				{display: lang.monitor_myMapName, name : 'name', width : 130, sortable : false, align: 'center'},
				{display: lang.monitor_myMapType, name : 'markerType', width : 80, sortable : false, align: 'center'},
				{display: lang.mark_share, name : 'share', width : 50, sortable : false, align: 'center'}
			],
		pernumber: lang.pernumber,
		pagestat: lang.pagestatInfo,
		pagefrom: lang.pagefrom,
		pagetext: lang.page,
		pagetotal: lang.pagetotal,
		findtext: lang.find,
		procmsg: lang.procmsg,
		nomsg : lang.nomsg,
		usepager: true,
		autoload: false,
		useRp: true,
		checkbox: true,
		clickRowDefault: false,
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
	this.pointTable.flexSelectRowPropFun(function(obj, selRow) {
		myMap_.selectPointRowProp(obj, selRow);
	});
	this.pointTable.flexClickCheckBoxFun(function(obj) {
		myMap_.clickPointRowCheckbox(obj);
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
		//如果已在地图显示，则勾选
		for(var i = 0; i < infos.length; i++) {
			if(infos[i].isExistMark) {
				$('#row'+infos[i].id, this.pointTable).click();
			}
		}
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
		    {display: lang.operator, name : 'operator', width : 80, sortable : false, align: 'center'},
			{display: lang.index, name : 'index', width : 30, sortable : false, align: 'center'},
			{display: lang.monitor_myMapName, name : 'name', width : 130, sortable : false, align: 'center'},
			{display: lang.monitor_myMapType, name : 'markerType', width : 80, sortable : false, align: 'center'},
			{display: lang.mark_share, name : 'share', width : 50, sortable : false, align: 'center'}
			],
		pernumber: lang.pernumber,
		pagestat: lang.pagestatInfo,
		pagefrom: lang.pagefrom,
		pagetext: lang.page,
		pagetotal: lang.pagetotal,
		findtext: lang.find,
		procmsg: lang.procmsg,
		nomsg : lang.nomsg,
		usepager: true,
		autoload: false,
		useRp: true,
		checkbox: true,
		clickRowDefault: false,
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
	this.areaTable.flexSelectRowPropFun(function(obj, selRow) {
		myMap_.selectAreaRowProp(obj, selRow);
	});
	this.areaTable.flexClickCheckBoxFun(function(obj) {
		myMap_.clickAreaRowCheckbox(obj);
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
		//如果已在地图显示，则勾选
		for(var i = 0; i < infos.length; i++) {
			if(infos[i].isExistMark) {
				$('#row'+infos[i].id, this.areaTable).click();
			}
		}
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
		    {display: lang.operator, name : 'operator', width : 80, sortable : false, align: 'center'},
			{display: lang.index, name : 'index', width : 30, sortable : false, align: 'center'},
			{display: lang.monitor_myMapName, name : 'name', width : 130, sortable : false, align: 'center'},
			{display: lang.monitor_myMapType, name : 'markerType', width : 80, sortable : false, align: 'center'},
			{display: lang.mark_share, name : 'share', width : 50, sortable : false, align: 'center'}
			],
		pernumber: lang.pernumber,
		pagestat: lang.pagestatInfo,
		pagefrom: lang.pagefrom,
		pagetext: lang.page,
		pagetotal: lang.pagetotal,
		findtext: lang.find,
		procmsg: lang.procmsg,
		nomsg : lang.nomsg,
		usepager: true,
		autoload: false,
		useRp: true,
		checkbox: true,
		clickRowDefault: false,
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
	this.lineTable.flexSelectRowPropFun(function(obj, selRow) {
		myMap_.selectLineRowProp(obj, selRow);
	});
	this.lineTable.flexClickCheckBoxFun(function(obj) {
		myMap_.clickLineRowCheckbox(obj);
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
		//如果已在地图显示，则勾选
		for(var i = 0; i < infos.length; i++) {
			if(infos[i].isExistMark) {
				$('#row'+infos[i].id, this.lineTable).click();
			}
		}
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
		if((row['userID'] == rootParent.companyId && row['creator'] == rootParent.userId) || this.lstCompanyId.in_array(row['userID']) || this.roleCls.isAdmin()){
			pos += '<a class="edit" href="javascript:editMarkerAreaInfo('+row['id']+','+ row['markerType'] +');" title="'+lang.edit+'"></a>';
			pos += '<a class="delete" href="javascript:delMarkerAreaInfo('+row['id']+','+ row['markerType'] +');" title="'+lang.del+'"></a>';
		}
		return pos;
	}else if(name == 'markerType') {
		pos = getArrayName(this.lstAreaType, row[name]); 
	}else if(name == 'share') {
		if(row[name] == 1) {
			pos = lang.mark_part_share;
		}else if(row[name] == 2) {
			pos = lang.mark_all_share;
		}else {
			pos = lang.mark_not_share;
		}
	}else {
		pos = row[name];
	}
	return this.getColumnTitle(pos);
};

//选中点信息
monitorMyMap.prototype.selectPointRowProp = function(obj, selRow) {
	var info = this.mapPointInfo.get(Number($(obj).attr('data-id')));
	if(selRow && selRow == 'delAll') {
		if(info) {
			info.isExistMark = false;
			this.delMarkOnMap(info.id);
		}
	}else {
		$(obj).addClass('trSelected');
		$(obj).find("td .selectItem")[0].checked = true;
		var checkAll = true;
		$('tbody tr .selectItem', this.pointTable.parent().parent()).each(function(){
			if($(this).val() != "" && !this.checked)	{
				checkAll = false;
			}
		});
		if (checkAll) {
			$('table tr .selectAllItem', this.pointTable.parent().parent())[0].checked = true;
		}
		if(info) {
			info.isExistMark = true;
			this.addMarkOnMap(info);
		}
	}
}

//点击选择点信息
monitorMyMap.prototype.clickPointRowCheckbox = function(obj) {
	var info = this.mapPointInfo.get(Number($(obj).val()));
	if(info) {
		info.isExistMark = obj.checked;
		if(obj.checked) {
			this.addMarkOnMap(info);
		}else {
			this.delMarkOnMap(info.id);
		}
	}
}

//选中区域信息
monitorMyMap.prototype.selectAreaRowProp = function(obj, selRow) {
	var info = this.mapAreaInfo.get(Number($(obj).attr('data-id')));
	if(selRow && selRow == 'delAll') {
		if(info) {
			info.isExistMark = false;
			this.delMarkOnMap(info.id);
		}
	}else {
		$(obj).addClass('trSelected');
		$(obj).find("td .selectItem")[0].checked = true;
		var checkAll = true;
		$('tbody tr .selectItem', this.areaTable.parent().parent()).each(function(){
			if($(this).val() != "" && !this.checked)	{
				checkAll = false;
			}
		});
		if (checkAll) {
			$('table tr .selectAllItem', this.areaTable.parent().parent())[0].checked = true;
		}
		if(info) {
			info.isExistMark = true;
			this.addMarkOnMap(info);
		}
	}
}

//点击选择区域信息
monitorMyMap.prototype.clickAreaRowCheckbox = function(obj) {
	var info = this.mapAreaInfo.get(Number($(obj).val()));
	if(info) {
		info.isExistMark = obj.checked;
		if(obj.checked) {
			this.addMarkOnMap(info);
		}else {
			this.delMarkOnMap(info.id);
		}
	}
}

//选中线路信息
monitorMyMap.prototype.selectLineRowProp = function(obj, selRow) {
	var info = this.mapLineInfo.get(Number($(obj).attr('data-id')));
	if(selRow && selRow == 'delAll') {
		if(info) {
			info.isExistMark = false;
			this.delMarkOnMap(info.id);
		}
	}else {
		$(obj).addClass('trSelected');
		$(obj).find("td .selectItem")[0].checked = true;
		var checkAll = true;
		$('tbody tr .selectItem', this.lineTable.parent().parent()).each(function(){
			if($(this).val() != "" && !this.checked)	{
				checkAll = false;
			}
		});
		if (checkAll) {
			$('table tr .selectAllItem', this.lineTable.parent().parent())[0].checked = true;
		}
		if(info) {
			info.isExistMark = true;
			this.addMarkOnMap(info);
		}
	}
}

//点击选择线路信息
monitorMyMap.prototype.clickLineRowCheckbox = function(obj) {
	var info = this.mapLineInfo.get(Number($(obj).val()));
	if(info) {
		info.isExistMark = obj.checked;
		if(obj.checked) {
			this.addMarkOnMap(info);
		}else {
			this.delMarkOnMap(info.id);
		}
	}
}

//删除地图上标记信息
monitorMyMap.prototype.delMarkOnMap = function(markerId) {
	if(typeof deleteMarker == 'function') {
		deleteMarker(markerId);
	}
}

//向地图添加标记
monitorMyMap.prototype.addMarkOnMap = function(info) {
	var gps = this.getConvertBaiduGoogle(info.jingDu, info.weiDu, info.mapType);
	if(!info.color) {
		info.color = "FF0000";
	}
	var isExistMark = false;
	if(typeof findMarker == 'function') {
		if(findMarker(info.id) != null) {
			isExistMark = true;
		}
	}
	if(typeof insertMarker == 'function' && !isExistMark) {
		insertMarker(info.id);
	}
	if(typeof updateMarker == 'function' && !isExistMark) {
		var statusStr = this.getMarkerStatus(info);
		if(info && info.markerType == 4) {//添加线路
			updateMarker(info.id, 9, info.name, gps.lng, gps.lat
					, 0, info.color, statusStr, info.radius);
		}else {
			updateMarker(info.id, info.markerType, info.name, gps.lng, gps.lat
					, 0, info.color, statusStr, info.radius);
		}
	}
	if(typeof selectMarker == 'function') {
		selectMarker(info.id);
	}
}

/**
 * 获取标记状态
 * @param info
 * @returns
 */
monitorMyMap.prototype.getMarkerStatus = function(info) {
	var html = [];
	//描述
	if(info.remark) {
		html.push('<span class="b">' + parent.lang.rule_desc_tip + '</span>&nbsp;<span>' + info.remark + '</span><br/>');
	}
	//图片
	if(info.image) {
		html.push('<span><img src="../../'+ info.image +'?'+new Date().getTime()+'" style="width:220px;height:120px;border:1px solid #0071c6;margin-top:5px;"></img></span><br/>');
	}
	return html.join("");
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
	var mapType = rootParent.getMapType();
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

//修改地图标记（数据库）
monitorMyMap.prototype.editMarkerAreaInfo = function(markerId, type) {
	var title = "";
	var height = "360px";
	var marker = null;
	if(type == 1){//修改标记点
		title = lang.addPoint;
		marker = this.mapPointInfo.get(Number(markerId));
	}else if(type == 2 || type == 3 || type == 10){
		marker = this.mapAreaInfo.get(Number(markerId));
		if(type == 2){//修改矩形
			title = lang.addRectangle;
		}else if(type == 3){//修改多边形
			title = lang.addPolygon;
		}else if(type == 10){//修改圆
			title = lang.tipAddCircle;
			height = "390px";
		}
	}else if(type == 4){//修改线路  数据库为4 地图为9
		title = lang.addLine;
		marker = this.mapLineInfo.get(Number(markerId));
	}
	if(title) {
		//先隐藏其他弹出框
		if(typeof parent.hidePopTips == 'function'){
			parent.hidePopTips('areaInfo');
		}
		//如果打开了同类型的窗口，则先关闭
		if(this.areaInfoObj != null) {
			this.areaInfoObj.close();
		}
		var data = {};
		data.markerId = markerId;
		data.markType = type;
		var myMap_ = this;
		this.areaInfoObj = $.dialog({id:'areaInfo', title: title,content: 'url:RulesManagement/AreaInfo.html',
			width:'350px',height: height, min:false, max:false, lock:false,data:data, close: function() {
				myMap_.areaInfoObj = null;
				if(typeof parent.popTipsObject != 'undefined' && parent.popTipsObject != null) {
					parent.popTipsObject.remove('areaInfo');
				}
				if(marker.isExistMark) {
					//删除原有标记
					myMap_.delMarkOnMap(marker.id);
					//添加标记到地图
					myMap_.addMarkOnMap(marker);
				}
			}});
		if(typeof parent.popTipsObject != 'undefined' && parent.popTipsObject != null) {
			parent.popTipsObject.put('areaInfo', this.areaInfoObj);
		}
	}
}

//删除地图标记（数据库）
monitorMyMap.prototype.delMarkerAreaInfo = function(markerId, type) {
	if(!confirm(lang.delconfirm)) {
		return ;
	}
	//显示的消息
	$.myajax.showLoading(true, lang.deleting);
	var myMap_ = this;
	$.myajax.jsonGet('StandardLoginAction_deleteArea.action?id=' + markerId, function(json,action,success){
		$.myajax.showLoading(false);
		if(success){
			myMap_.delMarkerAreaInfoSuc(markerId, type);
		}
	}, null);
}

//删除标记成功后执行
monitorMyMap.prototype.delMarkerAreaInfoSuc = function(markerId, type) {
	//删除rootParent 里面的标记信息
	if(rootParent.markers) {
		for (var i = 0; i < rootParent.markers.length; i++) {
			if(rootParent.markers[i].id == markerId) {
				rootParent.markers.splice(i, 1);
				break;
			}
		}
	}
	//删除缓存中的信息
	if(type == 1){//标记点
		this.mapPointInfo.remove(Number(markerId));
		this.addPointTableList();
	}else if(type == 2 || type == 3 || type == 10){ //区域
		this.mapAreaInfo.remove(Number(markerId));
		this.addAreaTableList();
	}else if(type == 4){//线路
		this.mapLineInfo.remove(Number(markerId));
		this.addLineTableList();
	}
	//删除地图上的标记
	this.delMarkOnMap(markerId);
}

//地图上画图操作，加入数据库
monitorMyMap.prototype.addMarkerAreaInfo = function(type, jingdu, weidu, param) {
	var title = "";
	var height = "380px";
	if(type == 1){//加标记点
		title = lang.addPoint;
	}else if(type == 2 || type == 3 || type == 10){
		if(type == 2){//加矩形
			title = lang.addRectangle;
		}else if(type == 3){//加多边形
			title = lang.addPolygon;
		}else if(type == 10){//加圆
			title = lang.tipAddCircle;
			height = "410px";
		}
	}else if(type == 9){//加线路 //修改线路  数据库为4 地图为9
		title = lang.addLine;
	}
	//画区域结束时删除区域
	this.delExampleMarker();
	if(title) {
		//先隐藏其他弹出框
		if(typeof parent.hidePopTips == 'function'){
			parent.hidePopTips('areaInfo');
		}
		//如果打开了同类型的窗口，则先关闭
		if(this.areaInfoObj != null) {
			this.areaInfoObj.close();
		}
		//画区域时添加区域
		this.addExampleMarker(type, jingdu, weidu, param, 'FF0000');
		var myMap_ = this;
		var data = {};
		data.jingdu = jingdu;
		data.weidu = weidu;
		data.param = param;
		data.markType = type;
		this.areaInfoObj = $.dialog({id:'areaInfo', title: title,content: 'url:RulesManagement/AreaInfo.html',
			width:'350px',height: height, min:false, max:false, lock:false, data:data, close: function() {
				myMap_.areaInfoObj = null;
				if(typeof parent.popTipsObject != 'undefined' && parent.popTipsObject != null) {
					parent.popTipsObject.remove('areaInfo');
				}
				//设置车辆画区域标志 为false
				if(typeof parent.setVehicleDrowing == 'function') {
					parent.setVehicleDrowing(false);
				}
				myMap_.delExampleMarker();
			}});
		if(typeof parent.popTipsObject != 'undefined' && parent.popTipsObject != null) {
			parent.popTipsObject.put('areaInfo', this.areaInfoObj);
		}
	}
}

//添加标记成功后执行
monitorMyMap.prototype.doSaveMarkerSuc = function(marker) {
	$.dialog({id:'areaInfo'}).close();
	$.dialog.tips(lang.saveok, 1);
	this.delExampleMarker();
	//添加标记到地图
	marker.isExistMark = true;
	this.addMarkOnMap(marker);
	//添加rootParent 里面的标记信息
	if(rootParent.markers) {
		rootParent.markers.push(marker);
	}
	//添加标记信息到缓存中
	if(marker.markerType == 2 || marker.markerType == 3 ||
			marker.markerType == 10) {
		this.mapAreaInfo.put(Number(marker.id), marker);
		this.addAreaTableList();
	}else if(marker.markerType == 1) {
		this.mapPointInfo.put(Number(marker.id), marker);
		this.addPointTableList();
	}else if(marker.markerType == 4) { //修改线路  数据库为4 地图为9
		this.mapLineInfo.put(Number(marker.id), marker);
		this.addLineTableList();
	}
}

//修改我的地图标记成功后执行（database）
monitorMyMap.prototype.doEditMarkSuc = function(marker) {
	$.dialog({id:'areaInfo'}).close();
	$.dialog.tips(lang.saveok, 1);
	if(typeof parent.popTipsObject != 'undefined' && parent.popTipsObject != null) {
		parent.popTipsObject.remove('areaInfo');
	}
	//修改rootParent 里面的标记信息
	if(rootParent.markers) {
		for(var i = 0; i< rootParent.markers.length; i++) {
			if(rootParent.markers[i].id == marker.id) {
				rootParent.markers[i] = marker;
				break;
			}
		}
	}
	//删除原有标记
	this.delMarkOnMap(marker.id);
	//添加标记到地图
	marker.isExistMark = true;
	this.addMarkOnMap(marker);
	
	//添加标记信息到缓存中
	if(marker.markerType == 2 || marker.markerType == 3 ||
			marker.markerType == 10) {
		this.mapAreaInfo.put(Number(marker.id), marker);
		this.addAreaTableList();
	}else if(marker.markerType == 1) {
		this.mapPointInfo.put(Number(marker.id), marker);
		this.addPointTableList();
	}else if(marker.markerType == 4) { //修改线路  数据库为4 地图为9
		this.mapLineInfo.put(Number(marker.id), marker);
		this.addLineTableList();
	}
}

//画区域时添加区域
monitorMyMap.prototype.addExampleMarker = function(type, jingdu, weidu, param, color) {
	if(typeof insertMarker == 'function') {
		insertMarker(this.addMarkerExpId);
	}
	if(typeof updateMarker == 'function') {
		updateMarker(this.addMarkerExpId, type, '', jingdu, weidu
					, 0, color, null, param);
	}
	if(typeof selectMarker == 'function') {
		selectMarker(this.addMarkerExpId);
	}
}

//画区域结束时删除区域
monitorMyMap.prototype.delExampleMarker = function() {
	this.delMarkOnMap(this.addMarkerExpId);
}

//修改标记信息改变地图上标记的大小，颜色
monitorMyMap.prototype.doEditMarkChangeParam = function(marker, type) {
	if(type == 'add') {//新增
		this.delExampleMarker();
		this.addExampleMarker(marker.markerType, marker.jingDu, marker.weiDu, marker.radius, marker.color);
	}else {
		var info = null;
		if(marker.markerType == 1) {
			info = this.mapPointInfo.get(Number(marker.id));
		}else if(marker.markerType == 9 || marker.markerType == 4) {
			info = this.mapLineInfo.get(Number(marker.id));
		}else {
			info = this.mapAreaInfo.get(Number(marker.id));
		}
		marker.mapType = info.mapType;
		marker.name = info.name;
		this.delMarkOnMap(marker.id);
		this.addMarkOnMap(marker);
	}
}