/**
 * 监控线路处理类
 */
function monitorVehicleLine(){
	this.gpsLineTableObj = null;  //线路监控列表对象
	this.roleCls = null;  //权限类对象
	this.ttxLine = null; //线路插件对象
	this.isClickEventTable = true; //是否是点击监控表格所选,点击表格的就不再选中表格
	
	this.topLineContent = null;  //上行线
	this.bottomLineContent = null; //下行线
	this.topStations = [];  //上行站点集合
	this.bottomStations = [];  //下行站点集合
	
	this.topVehicleList = []; //上行车辆集合
	this.bottomVehicleList = []; //下行车辆集合
}

//赋值权限类对象
monitorVehicleLine.prototype.setRoleCls = function(roleCls) {
	if(typeof roleCls != 'undefined' && roleCls != null) {
		this.roleCls = roleCls;
	}
}

//初始化
monitorVehicleLine.prototype.initialize = function() {
	this.ttxLine = new TtxLine("frameLine");
	this.ttxLine.initialize();
	
	//初始化线路列表
	this.initLineTable();
}

//初始化线路列表
monitorVehicleLine.prototype.initLineTable = function() {
	this.gpsLineTableObj = $("#gpsLineTable").flexigrid({
		url: "",	//StandardTrackAction_query.action
		dataType: 'json',
		colModel : [
			{display: parent.lang.line_name, name : 'name', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.abbreviation, name : 'abbr', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.belong_company, name : 'company', width : 200, sortable : false, align: 'center'},
			{display: parent.lang.line_up_first_time, name : 'upFirst', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.line_up_end_time, name : 'upLast', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.line_down_first_time, name : 'dnFirst', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.line_down_end_time, name : 'dnLast', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 230, sortable : false, align: 'center'}
			],
		usepager: false,
		autoload: false,
		useRp: false,
		checkbox: true,
		singleSelect: false,
		clickRowDefault: false,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: true,
		width: 'auto',
		height: 'auto',
		resizable: false
	});
	//本类对象
	var that = this;
	this.gpsLineTableObj.flexSetFillCellFun(function(p, row, idx, index) {
		return that.fillLineTable(p, row, idx, index);	
	});
	this.gpsLineTableObj.flexSelectRowPropFun(function(obj, selRow) {
		that.selectMonitorRowProp(obj, selRow);
	});
	this.gpsLineTableObj.flexClickCheckBoxFun(function(obj) {
		that.clickLineRowCheckbox(obj);
	});
};

//将所有线路加入线路列表
monitorVehicleLine.prototype.loadLineToTable = function() {
	if(parent.vehicleManager) {
		var lineList = parent.vehicleManager.getAllLineInfo();
		if(lineList.length > 0) {
			this.gpsLineTableObj.flexAppendRowJson(lineList, true);
		}
	}
}

monitorVehicleLine.prototype.getColumnTitle = function(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

monitorVehicleLine.prototype.fillLineTable = function(p, row, idx, index){
	var name = p.colModel[idx].name;
	var ret = "";
	if(name == 'name') {
		if(row.getName()) {
			ret = row.getName();
		}
	} else if(name == 'abbr') {
		if(row.getAbbreviation()) {
			ret = row.getAbbreviation();
		}
	} else if(name == 'company') {
		if(row.getParentId()) {
			var company = parent.vehicleManager.getTeam(row.getParentId());
			if(company) {
				ret = company.getName();
			}
		}
	} else if(name == 'upFirst') { 
		if(row.getUpLine() && row.getUpLine().getFirstTimeStr()) {
			ret = row.getUpLine().getFirstTimeStr();
		}
	} else if(name == 'upLast') { 
		if(row.getUpLine() && row.getUpLine().getLastTimeStr()) {
			ret = row.getUpLine().getLastTimeStr();
		}
	}else if(name == 'dnFirst') { 
		if(row.getDownLine() && row.getDownLine().getFirstTimeStr()) {
			ret = row.getDownLine().getFirstTimeStr();
		}
	}else if(name == 'dnLast') { 
		if(row.getDownLine() && row.getDownLine().getLastTimeStr()) {
			ret = row.getDownLine().getLastTimeStr();
		}
	}else if(name == 'operator') { 
		ret += '<a class="blue upLine" href="javascript:displayLineOnMap('+ row.getId() +',0,true);" title="'+ parent.lang.monitor_show_line_up +'">'+parent.lang.monitor_show_line_up+'</a>';
		ret += '<a class="blue downLine" href="javascript:displayLineOnMap('+ row.getId() +',1,true);" title="'+ parent.lang.monitor_show_line_down +'">'+parent.lang.monitor_show_line_down+'</a>';
		return ret;
	}
	return this.getColumnTitle(ret);
};

//选中事件列表
monitorVehicleLine.prototype.selectMonitorRowProp = function(obj, selRow) {
	var lineId = $(obj).attr('data-id');
	var team = parent.vehicleManager.getTeam(lineId);
	if(selRow && selRow == 'delAll') {
		if(team && team.isOnMonitor()) {//如果线路已经监控
			this.selectLine(lineId, false, false);
		}
	}else {
		$(obj).addClass('trSelected');
		$(obj).find("td .selectItem")[0].checked = true;
		var checkAll = true;
		$('tbody tr .selectItem', this.gpsLineTableObj.parent().parent()).each(function(){
			if($(this).val() != "" && !this.checked)	{
				checkAll = false;
			}
		});
		if (checkAll) {
			$('table tr .selectAllItem', this.gpsLineTableObj.parent().parent())[0].checked = true;
		}
		this.selectLine(lineId, true, false);
	}
}

//点击选择线路信息
monitorVehicleLine.prototype.clickLineRowCheckbox = function(obj) {
	var lineId = $(obj).val();
	var team = parent.vehicleManager.getTeam(lineId);
	if(team) {
		this.selectLine(lineId, obj.checked, false);
	}
}


/**
 * 选中线路节点
 * @param isOnMonitor 显示监控
 * @param isShowTable 显示到列表
 */
monitorVehicleLine.prototype.selectLine = function(lineId, isOnMonitor, isShowTable){
	if (this.isClickEventTable) {
		var team = parent.vehicleManager.getTeam(lineId);
		if(team) {
			if(isOnMonitor) {
				if(!team.isOnMonitor()) {//如果线路没有监控
					parent.switchTopMenuPage('xianlu');
					this.initLine(lineId, isOnMonitor);
				}else {
					if ((typeof monitorMapTip) != 'undefined' && monitorMapTip != null) {
						monitorMapTip.selectLineOnMap(lineId, 0);
					}
				}
			}else {
				this.initLine(lineId, isOnMonitor);
			}
		}
	}
	
	if (isShowTable) {
		//在监控列表中，也将车辆置为选中状态，并使车辆结点处理可见状态
		this.isClickEventTable = false;
		this.gpsLineTableObj.find(this.gpsLineTableObj.flexGetRowid(lineId)).find('.selectItem').click();
	}else {
		this.isClickEventTable = true;
	}
};

/**
 * 显示线路信息到地图
 * isOnShowMap true 显示 false 删除
 */
monitorVehicleLine.prototype.displayLineOnMap = function(lineId, lineDirect, isOnShowMap) {
	//显示到地图
	var className = "";
	var title = "";
	if(lineDirect == 1) {
		className = '.operator .downLine';
		if(isOnShowMap) {
			title = parent.lang.monitor_hide_line_down;
		}else {
			title = parent.lang.monitor_show_line_down;
		}
	}else {
		className = '.operator .upLine';
		if(isOnShowMap) {
			title = parent.lang.monitor_hide_line_up;
		}else {
			title = parent.lang.monitor_show_line_up;
		}
	}
	this.gpsLineTableObj.find(this.gpsLineTableObj.flexGetRowid(lineId)).find(className).
	attr('href', 'javascript:displayLineOnMap('+ lineId +','+ lineDirect +','+ !isOnShowMap +');')
	.attr('title', title).text(title);
	if ((typeof monitorMapTip) != 'undefined' && monitorMapTip != null) {
		monitorMapTip.displayLineOnMap(lineId, lineDirect, isOnShowMap);
	}
}

//初始化线路图
//isOnMonitor 是否监控  true是 flase删除监控
monitorVehicleLine.prototype.initLine = function(vehiTeamId, isOnMonitor) {
	var team = parent.vehicleManager.getTeam(vehiTeamId);
	if(team != null) {
		if(isOnMonitor) {
			team.setOnMonitor(true);
			this.ttxLine.initLine(vehiTeamId, 0); //初始化线路
		}else {
			team.setOnMonitor(false);
			this.ttxLine.deleteLine(vehiTeamId); //删除线路
		}
	}
}

monitorVehicleLine.prototype.updateLineStatus = function() {
	this.ttxLine.updateLineStatus();
}