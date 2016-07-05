var api = frameElement.api, W = api.opener;
var searchOpt = new searchOption(false, true, true);
var jingdu = getUrlParameter('jingdu');
var weidu = getUrlParameter('weidu');
var type = getUrlParameter('type');  // 1查当前车  2查历史车
var vehiTeamTree = null;  //车队车辆树类

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
	if(type == 1) {
		initVehicles();
		$('#infoTable').flexigrid({
			url: "myjson",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.plate_number, name : 'idno', width : 100, sortable : false, align: 'center', hide: false},
				{display: parent.lang.belong_company, name : 'companyName', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.report_date, name : 'gpsTime', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.monitor_vehiStatusPosition, name : 'location', width : 150, sortable : false, align: 'center'}
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
			idProperty: 'idno',
			rp: 50,
			rpOptions: [20, 50, 100, 150, 200],
			showTableToggleBtn: true,
			showToggleBtn: false,
			onSubmit: addVehicle,
			width: 'auto',//Math.round(6 * parent.screenWidth/7) - 5,
			height: 'auto'
		});
		$("#infoTable").flexSelectRowPropFun(function(obj) {
			W.addVehicleByTree($(obj).attr('data-id'));
		});
	}else {
		$("#infoTable").flexigrid({
			url: "StandardPositionAction_queryVehicle.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.plate_number, name : 'vehiIdno', width : 100, sortable : false, align: 'center', hide: false},
				{display: parent.lang.belong_company, name : 'parentId', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.monitor_fence_enterTime, name : 'startTimeStr', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.monitor_fence_enterPosition, name : 'startPosition', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.monitor_fence_leaveTime, name : 'endTimeStr', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.monitor_fence_leavePosition, name : 'endPosition', width : 150, sortable : false, align: 'center'},
				{display: parent.lang.monitor_fence_residenceTime, name : 'parkTime', width : 150, sortable : false, align: 'center'}
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
			singleSelect: true,
			checkbox: false,
	//		title: parent.lang.report_custom_alarm_detail,
			useRp: true,
			idProperty: 'vehiIdno',
			rp: 50,
			rpOptions: [20, 50, 100, 150, 200],
			showTableToggleBtn: true,
			width: 'auto',
			onSuccess: historyLoadSuccess,
			height: 'auto' 
		});
		$("#infoTable").flexSelectRowPropFun(function(obj) {
			W.addVehicleByTree($(obj).attr('data-id'));
		});
		
		$('#search-top').show();
		$('#toolbar-btn').flexPanel({
			ButtonsModel : [
				[{display: '', name : '', pclass : 'btnQuery',
					bgcolor : 'gray', hide : false}]
			]
		});
		
		//加载语言
		loadLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		//加载车辆树
		loadVehiTree();
		
		$('.btnQuery').on('click',findHistoryVehicle);
	}
}

/**
 * 加载历史车辆数据成功后执行
 */
function historyLoadSuccess() {}

//改变窗口大小时加载页面
function setPanelWidth() {
	if(type == 1) {
		$(".flexigrid .bDiv").height($(window).height() - $('.flexigrid .hDiv').height() - $('.flexigrid .pDiv').height() - 25);
	}else {
		$('#search-top').height($(window).height() - 23);
		$('#vehicle_tree').height($('#search-top').height() - $('#search-condition').height());
		$(".flexigrid .bDiv").height($(window).height() - $('.flexigrid .hDiv').height() - $('.flexigrid .pDiv').height() - 25);
	}
}

function loadLang() {
	searchOpt.loadLang();
}

var nowVehicles = [];
var isLoadVehicles = false;

//获取区域范围内所有符合条件的车辆
function initVehicles() {
	var index = 0;
	parent.vehicleManager.mapVehiList.each(function(key,vehicle){
		var point = vehicle.getMapLngLat();
		if(point != null && point.lng != null && point.lat != null && W.ttxMap != null && W.ttxMap.isPointInRect(point.lng,point.lat,jingdu,weidu)) {
			index++
			var data = {};
			data.index = index;
			data.idno = vehicle.getIdno();
			data.parentId = '';
			var company = parent.vehicleManager.getTeam(vehicle.getParentId());
			if(company != null) {
				data.companyName = company.name;
			}
			data.gpsTime = vehicle.getParseGpsTime();
			data.location = vehicle.getLngLatStr();
			var point = vehicle.getMapLngLat();
			if (point == null || data.location == '0,0') {
				data.location = parent.lang.monitor_gpsUnvalid;
			}
			nowVehicles.push(data);
		}
	});
	isLoadVehicles = true;
}

//调用自定义加载数据加载车辆信息
function addVehicle() {
	if(isLoadVehicles) {
		if(nowVehicles.length <= 0) {
			return;
		}
		var param = $('#infoTable').flexGetParams();
		var start = (param.newp - 1) * param.rp;
		var end = param.newp * param.rp;
		var infos = [];
		for (var i = start; i < nowVehicles.length && i < end; i++) {
			infos.push(nowVehicles[i]);
		}
		var pagination={currentPage: param.newp, pageRecords: param.rp, totalRecords: nowVehicles.length};
		var json = {};
		json.infos = infos;
		json.pagination = pagination;
		
		$('#infoTable').flexAddData(json, false);
	}else {
		setTimeout(addVehicle,50);
	}
}

/*
 * 加载车辆树
 */
function loadVehiTree() {
	vehiTeamTree = new vehicleTeamTree();
	vehiTeamTree.setRootId(parent.companyId);
	vehiTeamTree.setTeamList(parent.vehicleManager.getAllVehiTeam());
	vehiTeamTree.setVehiList(parent.vehicleManager.getAllVehicle());
	vehiTeamTree.setIsSearch(true);
	vehiTeamTree.setCountGroup(true);
	vehiTeamTree.initVehiTeamTree('vehiTeamTree', 'vehicleTree', '../../js/dxtree/imgs/');
	vehiTeamTree.setHeight(190, 230);
	vehiTeamTree.loadVehiTeamTree('searchTeam', 'searchVehi');
}

function getColumnTitle(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

function fillCellInfo(p, row, idx, index) {
	var ret = "";
	var name = p.colModel[idx].name;
	if(name == 'parentId') { 
		var vehi = parent.vehicleManager.getVehicle(row.vehiIdno);
		var company = parent.vehicleManager.getTeam(vehi.getParentId());
		if(company != null) {
			ret = company.name;
		}
	}else if(name == 'startPosition') {
		if(row.startGaoDu == 1) {
			ret = parent.lang.monitor_fence_alreadyIn;
		}else {
			ret = gpsGetPosition(row.startJingDu, row.startWeiDu, 1);
		}
	} else if(name == 'endPosition') { 
		if(row.endGaoDu == 1) {
			ret = parent.lang.monitor_fence_noLeave;
		}else {
			ret = gpsGetPosition(row.endJingDu, row.endWeiDu, 1);
		}
	} else if(name == 'parkTime') {
		var parkTime = 0;
		if(row.endGaoDu == 1) {
			parkTime = dateStrLongTime2Date(notLeaveAreaTime).getTime() - dateStrLongTime2Date(row.startTimeStr).getTime();
		}else {
			parkTime = dateStrLongTime2Date(row.endTimeStr).getTime() - dateStrLongTime2Date(row.startTimeStr).getTime();
		}
		ret = getTimeDifference(parkTime/1000);
	} else {
		ret = changeNull(row[name]);
	}
	return getColumnTitle(ret);
}

//查询的最后时间，作为未离开区域时使用
var notLeaveAreaTime; 

//查找所选车辆历史轨迹
function findHistoryVehicle() {
	var vehiIdnos = vehiTeamTree.selectCheckedVehicle();
	if(vehiIdnos == null || vehiIdnos == '' || vehiIdnos.length == 0) {
		$.dialog.tips(parent.lang.selectVehicleTip, 1);
		return;
	}
	var data = searchOpt.getQueryDataNew(true);
	if (data == null) {
		return false;
	}
	if(jingdu !=null && jingdu != '' && weidu !=null && weidu != '') {
		//填充参数
		var params = [];
		params.push({
			name: 'vehiIdno',
			value: vehiIdnos
		});
		params.push({
			name: 'begintime',
			value: data.begindate
		});
		params.push({
			name: 'endtime',
			value: data.enddate
		});
		notLeaveAreaTime = data.enddate;
		params.push({
			name: 'jingdu',
			value: jingdu
		});
		params.push({
			name: 'weidu',
			value: weidu
		});
		params.push({
			name: 'toMap',
			value: parent.toMap
		});
		
		$('#infoTable').flexOptions(
				{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
	}
}