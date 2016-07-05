var api = frameElement.api, W = api.opener;
var infoType = 0;
$(document).ready(function(){
	loadReadyPage();
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
		setPanelWidth();
	}
}

function loadPage(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	
	$('#search-list .storage a').text(parent.lang.monitor_storage);
	$('#search-list .offline a').text(parent.lang.monitor_offline);
	$('#search-list .damage a').text(parent.lang.monitor_damage);
	$('.damageTip').text(parent.lang.monitor_damage_spanTime);
	$('.damageUnit').text(parent.lang.hour + parent.lang.monitor_damage_spanUnit);
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
		     [{display: parent.lang.refresh, name : '', pclass : 'refresh',
		    	 bgcolor : 'gray', hide : false}],
			[{display: parent.lang.exportExcel, name : '', pclass : 'export',
				bgcolor : 'gray', hide : false}]
		]
	});
	initStatisticData();
	loadStorageTable();
	loadOfflineTable();
	loadDamageTable();
	
	//限制只能输入数字
	enterDigital('.damageValue');
	$('.damageValue').val(W.damageTime);
	//定损时长输入后失去焦点触发
	$('.damageValue').on('blur',changeDamageValue);
	//页面车辆属性改变，刷新按钮刷新表格数据
	$('.refresh').on('click',refreshInfos);
	//导出
	$('.export').on('click',exportExcel);
	
	//切换事件列表
	$("#search-list li").click(function(){
		infoType = $(this).index();
		$(this).addClass("active").siblings().removeClass("active");
		$("#search-table li").eq(infoType).addClass("active").siblings().removeClass("active");
		if(infoType == 2) {
			$('.damageTimeConfig').show();
		}else {
			$('.damageTimeConfig').hide();
		}
	});
}


var rows_storage = [];
var rows_offline = [];
var rows_damage = [];
var isLoadData = false;
//初始化数据
function initStatisticData() {
	rows_storage = [];
	rows_offline = [];
	rows_damage = [];
	isLoadData = false;
	parent.vehicleManager.mapVehiList.each(function(key,vehicle){
		var row = {};
		row.idno = vehicle.getIdno();
		row.parentId = '';
		var company = parent.vehicleManager.getTeam(vehicle.getParentId());
		if(company != null) {
			row.parentId = company.name;
		}
		row.position = vehicle.getLngLatStr();
		
		if(vehicle.isOnline()) {
			//存储介质报警
			var point = vehicle.getMapLngLat();
			if (point != null) {
				if(row.position == '0,0') {
					row.isGpsValid = false;
				}else {
					row.isGpsValid = true;
				}
			} else {
				row.isGpsValid = false;
			}
			var storageAlarm = vehicle.getStorageAlarm();
			if(storageAlarm != null && storageAlarm != '') {
				row.status = storageAlarm;
				rows_storage.push(row);
			}
		}else {
			var data = vehicle.gpsParseTrackStatus();
			row.gpsTime = vehicle.getParseGpsTime();//最后在线时间
			row.position = vehicle.getLngLatStr();
			row.speed = data.speed;
			row.isGpsValid = data.isGpsValid;
			row.normal = data.gpsStatus;
			row.other = data.videoStatus;
			var str = '';
			if(data.gpsAlarm != null && data.gpsAlarm != '') {
				str = data.gpsAlarm;
			}
			if(data.videoAlarm != null && data.videoAlarm != '') {
				if(str != '') {
					str += ',';
				}
				str += data.videoAlarm;
			}
			row.alarm = str;
			//离线车辆信息
			rows_offline.push(row);
			
			//定损车辆信息
			if(row.gpsTime != null && row.gpsTime != '') {
				var dB = dateStrLongTime2Date(row.gpsTime);
				var dE = new Date();
				var span = dE.getTime() - dB.getTime();
				if ( span >= (1000*60*60*W.damageTime) ) {
					row.offlineTime = getTimeDifference(span/1000);
					rows_damage.push(row);
				}
			}
		}
	});
	isLoadData = true;
}

//添加存储介质报警信息
function addStorageInfo() {
	if(isLoadData) {
		if(rows_storage.length > 0) {
			var param = $('#storageTable').flexGetParams();
			var start = (param.newp - 1) * param.rp;
			if(start >= rows_storage.length) {
				param.newp = 1;
				start = 0;
			}
			var end = param.newp * param.rp;
			var infos = [];
			for (var i = start; i < rows_storage.length && i < end; i++) {
				infos.push(rows_storage[i]);
			}
			var pagination={currentPage: param.newp, pageRecords: param.rp, totalRecords: rows_storage.length};
			var json = {};
			json.infos = infos;
			json.pagination = pagination;
			
			$('#storageTable').flexAddData(json, false);
		}
	}else {
		setTimeout(addStorageInfo,50);
	}
}

//添加离线车辆信息
function addOfflineInfo() {
	if(isLoadData) {
		if(rows_offline.length > 0) {
			var param = $('#offlineTable').flexGetParams();
			var start = (param.newp - 1) * param.rp;
			if(start >= rows_offline.length) {
				param.newp = 1;
				start = 0;
			}
			var end = param.newp * param.rp;
			var infos = [];
			for (var i = start; i < rows_offline.length && i < end; i++) {
				infos.push(rows_offline[i]);
			}
			var pagination={currentPage: param.newp, pageRecords: param.rp, totalRecords: rows_offline.length};
			var json = {};
			json.infos = infos;
			json.pagination = pagination;
			
			$('#offlineTable').flexAddData(json, false);
		}
	}else {
		setTimeout(addOfflineInfo,50);
	}
}

//添加定损车辆信息
function addDamageInfo() {
	if(isLoadData) {
		if(rows_damage.length > 0) {
			var param = $('#damageTable').flexGetParams();
			var start = (param.newp - 1) * param.rp;
			if(start >= rows_damage.length) {
				param.newp = 1;
				start = 0;
			}
			var end = param.newp * param.rp;
			var infos = [];
			for (var i = start; i < rows_damage.length && i < end; i++) {
				infos.push(rows_damage[i]);
			}
			var pagination={currentPage: param.newp, pageRecords: param.rp, totalRecords: rows_damage.length};
			var json = {};
			json.infos = infos;
			json.pagination = pagination;
			
			$('#damageTable').flexAddData(json, false);
		}
	}else {
		setTimeout(addDamageInfo,50);
	}
}

function loadStorageTable() {
	$('#storageTable').flexigrid({
		url: "storageTable",
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.plate_number, name : 'idno', width : 150, sortable : false, align: 'center', hide: false},
			{display: parent.lang.belong_company, name : 'parentId', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.status, name : 'status', width : 150, sortable : false, align: 'center'}
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
		autoload: true,
		singleSelect: true,
		checkbox: false,
//		title: parent.lang.report_custom_alarm_detail,
		useRp: true,
		rp: 50,
		rpOptions: [20, 50, 100, 150, 200],
		idProperty: 'idno',
		showTableToggleBtn: false,
		showToggleBtn: true,
		onSubmit: addStorageInfo,
		width: 'auto',//Math.round(6 * parent.screenWidth/7) - 5,
		height: 'auto'
	});
	$("#storageTable").flexSelectRowPropFun(function(obj) {
		W.addVehicleByTree($(obj).attr('data-id'));
	});
}

function loadOfflineTable() {
	$('#offlineTable').flexigrid({
		url: "offlineTable",
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.plate_number, name : 'idno', width : 150, sortable : false, align: 'center', hide: false},
			{display: parent.lang.belong_company, name : 'parentId', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.report_date, name : 'gpsTime', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.monitor_vehiStatusPosition, name : 'position', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.monitor_vehiStatusSpeed, name : 'speed', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.monitor_vehiStatusAlarm, name : 'alarm', width : 200, sortable : false, align: 'center'},
			{display: parent.lang.monitor_vehiStatusNormal, name : 'normal', width : 200, sortable : false, align: 'center'},
			{display: parent.lang.other_information, name : 'other', width : 200, sortable : false, align: 'center'}
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
		autoload: true,
		singleSelect: true,
		checkbox: false,
//		title: parent.lang.report_custom_alarm_detail,
		useRp: true,
		rp: 50,
		rpOptions: [20, 50, 100, 150, 200],
		idProperty: 'idno',
		showTableToggleBtn: false,
		showToggleBtn: true,
		onSubmit: addOfflineInfo,
		width: 'auto',//Math.round(6 * parent.screenWidth/7) - 5,
		height: 'auto'
	});
	$("#offlineTable").flexSelectRowPropFun(function(obj) {
		W.addVehicleByTree($(obj).attr('data-id'));
	});
}

function loadDamageTable() {
	$('#damageTable').flexigrid({
		url: "damageTable",
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.plate_number, name : 'idno', width : 150, sortable : false, align: 'center', hide: false},
			{display: parent.lang.belong_company, name : 'parentId', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.report_date, name : 'gpsTime', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.monitor_offlineTime, name : 'offlineTime', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.monitor_offlinePosition, name : 'position', width : 150, sortable : false, align: 'center'}
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
		autoload: true,
		singleSelect: true,
		checkbox: false,
//		title: parent.lang.report_custom_alarm_detail,
		useRp: true,
		rp: 50,
		rpOptions: [20, 50, 100, 150, 200],
		idProperty: 'idno',
		showTableToggleBtn: false,
		showToggleBtn: true,
		onSubmit: addDamageInfo,
		width: 'auto',//Math.round(6 * parent.screenWidth/7) - 5,
		height: 'auto'
	});
	$("#damageTable").flexSelectRowPropFun(function(obj) {
		W.addVehicleByTree($(obj).attr('data-id'));
	});
}

//改变窗口大小时加载页面
function setPanelWidth() {
	$('#search-list').height($(window).height() - 23);
	$('#search-table').height($(window).height() - 25);
	$('#search-table .flexigrid').each(function() {
		$(this).find(".bDiv").height($('#search-table').height() - $("#search-btn").height() - $('#search-table .active .flexigrid .hDiv').height() - $('#search-table .active .flexigrid .pDiv').height());
	});
//	var top = $('#search-list').height() - $('#search-list ul').height() - $('#toolbar-btn').height() - 10;
//	if(top <= 0) {
//		top = 0;
//	}
//	$('#toolbar-btn').css('margin-top',top);
}

function getColumnTitle(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

function fillCellInfo(p, row, idx, index) {
	var name = p.colModel[idx].name;
	var ret = "";
	if(name == 'speed') {
		if(row.isGpsValid) {
			ret = row.speed;
		}else {
			ret = parent.lang.monitor_invalid;
		}
	}else if(name == 'position') { 
		if(row.isGpsValid) {
			ret = row.position;
		}else {
			ret = parent.lang.monitor_gpsUnvalid;
		}
	}else {
		ret = changeNull(row[name]);
	}
	return getColumnTitle(ret);
}

//定损时长输入后失去焦点触发
function changeDamageValue() {
	var value = Number($('.damageValue').val());
	if(isNaN(value) || value < 24 || value > 240) {
		$.dialog.tips(parent.lang.monitor_damage_errorValue, 2);
		value = 72;
		$('.damageValue').val(value);
	}
	W.damageTime = value;
	//保存到cookie
	W.setDamageTime(value);
	initStatisticData();
	$('#damageTable').flexReload();
	W.monitorStatus.initVehicleStatusCount();
}

//刷新
function refreshInfos() {
	initStatisticData();
	$('#storageTable').flexReload();
	$('#offlineTable').flexReload();
	$('#damageTable').flexReload();
}

//导出报表
function exportExcel() {
	if(infoType == 0) {
		exportStorageTable();
	}else if(infoType == 1) {
		exportOfflineTable();
	}else if(infoType == 2) {
		exportDamageTable();
	}
}

function exportTable(action) {
	document.reportForm.action = action;
	document.reportForm.submit();
}

//导出存储介质报表
function exportStorageTable() {
	if(rows_storage.length > 0) {
		var vehiIdnos = [];
		for (var i = 0; i < rows_storage.length; i++) {
			vehiIdnos.push(rows_storage[i].idno);
		}
		$('#vehiIdnos').val(vehiIdnos.toString());
		var action = "StandardPositionAction_detailStorageExcel.action?exportType=1&infoType="+infoType;
		exportTable(action);
	}else {
		$.dialog.tips(parent.lang.monitor_noDataTOExport, 2);
	}
}

//导出离线车辆报表
function exportOfflineTable() {
	if(rows_offline.length > 0) {
		var vehiIdnos = [];
		for (var i = 0; i < rows_offline.length; i++) {
			vehiIdnos.push(rows_offline[i].idno);
		}
		$('#vehiIdnos').val(vehiIdnos.toString());
		var action = "StandardPositionAction_detailStorageExcel.action?exportType=1&infoType="+infoType;
		exportTable(action);
	}else {
		$.dialog.tips(parent.lang.monitor_noDataTOExport, 2);
	}
}

//导出定损车辆报表
function exportDamageTable() {
	if(rows_damage.length > 0) {
		var vehiIdnos = [];
		for (var i = 0; i < rows_damage.length; i++) {
			vehiIdnos.push(rows_damage[i].idno);
		}
		$('#vehiIdnos').val(vehiIdnos.toString());
		var action = "StandardPositionAction_detailStorageExcel.action?exportType=1&infoType="+infoType+"&damageTime="+W.damageTime;
		exportTable(action);
	}else {
		$.dialog.tips(parent.lang.monitor_noDataTOExport, 2);
	}
}