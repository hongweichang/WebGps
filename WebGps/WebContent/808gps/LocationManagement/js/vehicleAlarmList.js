var api = frameElement.api, W = api.opener;
var vehiIdno = decodeURIComponent(getUrlParameter('vehiIdno'));//选择的车辆id
var armTypes = [];
var allArmTypes = '';//所有报警类型
var allVehiIdnos = '';//所有车辆id
var selectedVehicle = '';

$(document).ready(function(){
	setTimeout(loadReadyPage, 50);
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}

function loadPage(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//获取报警类型
	getAlarmTypes();
	//获取所有车辆id
	allVehiIdnos = parent.vehicleManager.getAllVehiIdnos();
	
	$('#labelBeginTime').text(parent.lang.labelBegintime);
	$('#labelEndTime').text(parent.lang.labelEndtime);
	$("#labelhandled").text(parent.lang.label_handleCondition);
	$('#labelVehicle').text(parent.lang.monitor_labelVehicleIdno);
	$('#labelarmType').text(parent.lang.label_alarmType);
	
	//搜索时间
	var begintime = dateCurDateBeginString();
	var endtime = dateCurDateEndString();
	$("#begintime").val(begintime);
	$("#endtime").val(endtime);
	$("#begintime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}) });
	$("#endtime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}) });
	
	$('#select-handled').flexPanel({
		ComBoboxModel :{
			button :
			[
				[{
					display: parent.lang.all, name : 'handleStatus', pid : 'handleStatus', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
				}]
			],
			combox: {name : 'handleStatus', option : '2&'+parent.lang.all+'|0&'+parent.lang.report_unhandled+'|1&'+parent.lang.report_handled}
		}	
	});
	
	$('#selectDevice').flexPanel({
		 ComBoboxModel :{
			 input : {display: parent.lang.selectVehicleTip,name : 'vehiIdnos',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: false},
			 combox: 
					{name : 'vehiIdnos', option : arrayToStr(W.monitorAlarm.onlineVehicleList)}
		 }	
	});
	
	$('#select-armType').flexPanel({
		ComBoboxModel :{
			button :
			[
				[{
					display: parent.lang.all, name : 'armType', pid : 'armType', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
				}]
			],
			combox: {name : 'armType', option : arrayToStr(armTypes)}
		}	
	});
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.query, name : '', pclass : 'btnQuery',
				bgcolor : 'gray', hide : false}]
		]
	});
	//所有报警类型
	allArmTypes = getNewArrayByArray(armTypes, 'id').toString();
	
	var buttons = [
	       	{separator: false, hidename: "", name: parent.lang.monitor_batch_handle, bclass: "flexEdit",
	       	    	bimage: "", tooltip: parent.lang.monitor_batch_handle, id: "batchHandle",
	       	    	onpress: function() {
	       	    		doAlarmBatchHandle();
	       	    	}
	       	}
	];
	$('#vehicleAlarmTable').flexigrid({
		url: 'StandardPositionAction_queryAlarmDetail',
		dataType: 'json',
		colModel : [
		    {display: parent.lang.operator, name : 'operator', width : 60, sortable : false, align: 'center'},
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.report_vehiIdno, name : 'vehiIdno', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.vehicle_alarmaction_alarmType, name : 'type', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.report_beginTime, name : 'startTime', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.report_endTime, name : 'endTime', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.monitor_alarmInfo, name : 'desc', width : 300, sortable : false, align: 'center'},
			{display: parent.lang.report_normal_beginPosition, name : 'startPos', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.report_normal_endPosition, name : 'endPos', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.vehicle_handleCondition, name : 'handleStatus', width : 60, sortable : false, align: 'center'},
			{display: parent.lang.report_handling_user, name : 'handleuser', width : 70, sortable : false, align: 'center'},
			{display: parent.lang.report_handle_content, name : 'handleContent', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.report_handle_time, name : 'handleTime', width : 120, sortable : false, align: 'center'}
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
		checkbox: true,
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		buttons: buttons,
		usepager: true,
		autoload: false,
		useRp: true,
		title: false,
		params: false,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: true,
		width: 'auto',
		onSubmit: addAlarmTableList,
		onSuccess: false,
		height: 'auto'
	});
	loadReportTableWidth(fixHeight);
	
	$('.btnQuery','#toolbar-btn').on('click',function(){
		$('#vehicleAlarmTable').flexOptions({newp: 1}).flexReload();
	});
	
	//点击更多弹出车辆选择
	$('.more_car').on('click', queryMoreVehicle);
	
	initPageInfo(vehiIdno);
}

function fixHeight() {
	$('#vehicleAlarmTable').flexFixHeight();
}

function initPageInfo(vehiIdno_) {
	if(vehiIdno_) {
		$('#combox-vehiIdnos').val(vehiIdno_);
		$('#hidden-vehiIdnos').val(vehiIdno_);
		addAlarmTableList();
	}/*else {
		$('#combox-vehiIdnos').val(parent.lang.all_vehicles);
		$('#hidden-vehiIdnos').val('*all');
	}*/
}

//添加报警信息
function addAlarmTableList() {
	var begintime = $("#begintime").val();
	var endtime = $("#endtime").val();
	if (!dateIsValidDateTime(begintime)) {
		$.dialog.tips(parent.lang.errQueryTimeFormat, 2);
		return false;
	}
	if (!dateIsValidDateTime(endtime)) {
		$.dialog.tips(parent.lang.errQueryTimeFormat, 2);
		return false;
	}
	
	if (dateCompareStrLongTime(begintime, endtime) > 0) {
		$.dialog.tips(parent.lang.errQueryTimeRange, 2);
		return false;
	}
	if (!dateCompareStrLongTimeRange(begintime, endtime, 90)) {
		$.dialog.tips(parent.lang.report_timeRangOver90Day, 2);
		return false;
	}
	
	var vehiIdno = $.trim($('#hidden-vehiIdnos').val());
	if(!vehiIdno) {
		alert(parent.lang.report_selectVehiNullErr);
		return;
	}
	
	if(vehiIdno == '*all') {
		vehiIdno = allVehiIdnos;
	}else if(vehiIdno == (parent.lang.isSelected + selectedVehicle.split(',').length)) {
		vehiIdno = selectedVehicle;
	}
	
	var params = [];
	params.push({
		name: 'begintime',
		value: begintime
	});
	params.push({
		name: 'endtime',
		value: endtime
	});
	var data = {};
	data.vehiIdnos = vehiIdno;
	var armType =  $.trim($('#hidden-armType').val());
	if(armType == '') {
		data.typeIdno = allArmTypes;
	}else {
		data.typeIdno = armType;	
	}
	data.condiIdno = $.trim($('#hidden-handleStatus').val());//全部
	params.push({
		name: 'json',
		value: encodeURIComponent(JSON.stringify(data))
	});
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	var param = $('#vehicleAlarmTable').flexGetParams();
	var pagination = {currentPage: param.newp, pageRecords: param.rp};
	params.push({
		name: 'pagin',
		value: encodeURIComponent(JSON.stringify(pagination))
	});
	$('body').flexShowLoading(true);
	$.myajax.jsonPostEx('StandardPositionAction_queryAlarmDetail.action', function(json, success) {
		if (success) {
			loadAlarmInfo(json);
		}
	}, null, params);
}

//初始化报警信息
//isBegin  true开始报警
function initAlarmInfo(info, isBegin) {
	var alarm = {};
	alarm.guid = info.guid;
	alarm.DevIDNO = info.did;
	alarm.type = info.atp;
	alarm.info = info.info;
	alarm.p1 = info.p1;
	alarm.p2 = info.p2;
	alarm.p3 = info.p3;
	alarm.p4 = info.p4;
	alarm.desc = info.desc;
	alarm.img = info.img;
	alarm.stType = info.atp;
	alarm.hd = info.hd;
	var gps = {};
	if(isBegin) {
		alarm.time = dateTime2TimeString(info.stm);
		gps.sp = info.ssp;
		gps.lc = info.slc;
		gps.s1 = info.ss1;
		gps.s2 = info.ss2;
		gps.lng = info.slng;
		gps.lat = info.slat;
		gps.mlng = info.smlng;
		gps.mlat = info.smlat;
	}else {
		alarm.time = dateTime2TimeString(info.etm);
		gps.sp = info.esp;
		gps.lc = info.elc;
		gps.s1 = info.es1;
		gps.s2 = info.es2;
		gps.lng = info.elng;
		gps.lat = info.elat;
		gps.mlng = info.emlng;
		gps.mlat = info.emlat;
	}
	alarm.Gps = gps;
	return alarm;
}

//解析报警数据
function loadAlarmInfo(json) {
	var rows = [];
	if(json && json.infos) {
		for (var i = 0; i < json.infos.length; i++) {
			var info = json.infos[i];
			var vehiAlarm = new standardAlarm(info.guid, info.atp);
			if(info.stm) {
				//开始报警
				var alarm = initAlarmInfo(info, true);
				//创建事件信息
				var armInfo = new standardArmInfo();
				armInfo.setAlarm(alarm);
				//更新报警信息
				vehiAlarm.startAlarm = armInfo;
			}
			if(info.etm) {
				//结束报警
				var alarm = initAlarmInfo(info, false);
				//创建事件信息
				var armInfo = new standardArmInfo();
				armInfo.setAlarm(alarm);
				//更新报警信息
				vehiAlarm.endAlarm = armInfo;
			}
			//解析出报警事件
			var data = vehiAlarm.parseAlarmInfo(false);
			data.vehiIdno = info.vid;
			data.id = info.guid;
			data.handleStatus = info.hd;
			data.handleuser = info.hdu;
			data.handleContent = info.hdc;
			data.handleTime = info.hdt;
			
			rows.push(data);
		}
	}
	json.infos = rows;
	$('#vehicleAlarmTable').flexAddData(json, false);
	for (var i = 0; i < rows.length; i++) {
		if(rows[i].handleStatus == 1) {
			disabledAlarmInfo(rows[i].id, true);
		}
	}
	$('body').flexShowLoading(false);
	$.dialog.tips(parent.lang.loadok, 1);
}

function getColumnTitle(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if( name == 'endTime'){
		if(row[name] == '1970-01-01 08:00:00'){
			pos = "";
		}else{
			pos = row[name];
		}
	}else if(name == 'handleStatus') {
		switch (Number(row[name])) {
		case 0:
			pos = parent.lang.report_unhandled;
			break;
		case 1:
			pos = parent.lang.report_handled;
			break;
		default:
			break;
		}
	}else if(name == 'startPos') {
		if(row[name]) {
			if(row[name] != parent.lang.monitor_gpsUnvalid && row[name] != '') {
				var point = row['startMapLngLat'].split(',');
				pos = '<span class="maplngLat" onclick="changeMapAddress(this,'+point[1]+','+point[0]+');" title="'+ row[name] +'">'+ row[name] +'</span>';
			}else {
				pos = '<span title="'+ row[name] +'">'+ row[name] +'</span>';
			}
			return pos;
		}
	}else if (name == 'endPos') {
		if(row[name]) {
			if(row[name] != parent.lang.monitor_gpsUnvalid && row[name] != '') {
				var point = row['endMapLngLat'].split(',');
				pos = '<span class="maplngLat" onclick="changeMapAddress(this,'+point[1]+','+point[0]+');" title="'+ row[name] +'">'+ row[name] +'</span>';
			}else {
				pos = '<span title="'+ row[name] +'">'+ row[name] +'</span>';
			}
			return pos;
		}
	}else if(name == 'operator') {//报警处理    report_handled
		if(row['handleStatus'] == 1) {
			return '<a class="not-edit" title="'+parent.lang.report_handled+'"></a>';
		}else {
			return '<a class="edit" onclick="doAlarmHandle(\''+row['id']+'\');" title="'+parent.lang.monitor_alarm_handle+'"></a>';
		}
	} else {
		pos = changeNull(row[name]);
	}
	return getColumnTitle(pos);
}

//切换地理位置坐标
function changeMapAddress(obj, jingDu, weiDu) {
	var position1 = $.trim($(obj).attr('data-position'));
	var position2 = $.trim($(obj).html());
	$(obj).attr('data-position',position2);
	if(position1 != null && position1 != '') {
		$(obj).html(position1);
		$(obj).attr('title',position1);
	}else {
		if(W.ttxMap != null) {
			W.ttxMap.geocoderAddress(weiDu+','+jingDu, jingDu, weiDu, function(key, jingDu, weiDu, address, city) {
				$(obj).html(address);
				$(obj).attr('title',address);
			});
		}
	}
}

//弹出车辆选择菜单类对象
var selVehiInfo = null;

//点击更多弹出车辆选择
function queryMoreVehicle() {
	if(selVehiInfo == null) {
		selVehiInfo = $.dialog({id:'vehiInfo', title: parent.lang.btnSelectVehicle, content: 'url:TrackManagement/selectVehicle.html?single=false',
			width: '400px', height: '630px', min:true, max:false, lock: true,fixed:false, parent: api
				, resize:false, close: function() {
					selVehiInfo = null;
				} });
	}else {
		selVehiInfo.lock().show().zindex();
	}
}

//选择车辆成功
function doSelectVehicleSuc(vehiIdno) {
	if(vehiIdno.split(',').length > 1) {//多选
		$('#combox-vehiIdnos').val(parent.lang.isSelected + vehiIdno.split(',').length);
		$('#hidden-vehiIdnos').val(parent.lang.isSelected + vehiIdno.split(',').length);
		selectedVehicle = vehiIdno;
	}else {//单选
		$('#combox-vehiIdnos').val(vehiIdno);
		$('#hidden-vehiIdnos').val(vehiIdno);
	}
	selVehiInfo.hide();
}

//报警信息列表报警批量处理
function  doAlarmBatchHandle() {
	var guids = $('#vehicleAlarmTable').selectedCheckedRows();
	if(guids.length == 0) {
		$.dialog.tips(parent.lang.errSelectedRequired, 1);
		return;
	}
	this.doAlarmHandle(guids.toString());
}

//报警信息列表报警处理
//alarmId 报警guid
//batch 是否批量
var alarmHandleObj = null;
function doAlarmHandle(guids) {
	var url = 'url:LocationManagement/vehicleAlarmHandle.html?guids='+ guids;
	alarmHandleObj = $.dialog({id:'alarmHandle', title: parent.lang.monitor_alarm_handle, content: url,
		width: '450px', height: '220px', min:false, max:false, lock:true, parent: api});
}

//报警处理成功后调用
//将报警处理状态置为已处理，并设置为不能再次点击
function alarmHandleSuccess(alarmId, handleContent) {
	$.dialog.tips(parent.lang.saveok, 1);
	$.dialog({id:'alarmHandle'}).close();
	var guidList = alarmId.split(',');
	var handleUser = parent.account;
	var handleTime = dateFormat2TimeString(new Date());
	for (var i = 0; i < guidList.length; i++) {
		this.disabledAlarmInfo(guidList[i], false, handleUser, handleContent, handleTime);
	}
//	$('#vehicleAlarmTable').flexReload();
}

//将报警信息列表复选框勾选，并置为不可选状态
//isLoad 是否是加载后台数据
function disabledAlarmInfo(guid, isLoad, handleUser, handleContent, handleTime) {
	var rowObject = $('#vehicleAlarmTable').find($('#vehicleAlarmTable').flexGetRowid(guid));
	if(rowObject.find('.selectItem')) {
		if(rowObject.find('.selectItem')[0]) {
			rowObject.find('.selectItem')[0].checked = true;
		}
		rowObject.find('.selectItem')[0].disabled = true;
	}
	if(!isLoad) {
		if(rowObject.find('.operator div a')) {
			rowObject.find('.operator div a').removeClass('edit').addClass('not-edit').removeAttr('onclick').attr('title', parent.lang.report_handled);
		}
		if(rowObject.find('.handleStatus div span')) {
			rowObject.find('.handleStatus div span').attr('title', parent.lang.report_handled).text(parent.lang.report_handled);
		}
		if(rowObject.find('.handleuser div span') && handleUser) {
			rowObject.find('.handleuser div span').attr('title', handleUser).text(handleUser);
		}
		if(rowObject.find('.handleContent div span') && handleContent) {
			rowObject.find('.handleContent div span').attr('title', handleContent).text(handleContent);
		}
		if(rowObject.find('.handleTime div span') && handleTime) {
			rowObject.find('.handleTime div span').attr('title', handleTime).text(handleTime);
		}
	}
	rowObject = null;
}

//获取所有报警类型
function getAlarmTypes() {
	armTypes.push({id: '',name:parent.lang.all});
	armTypes.push({id: '11',name:parent.lang.monitor_alarm_speed});
	armTypes.push({id: '14',name:parent.lang.alarm_type_overtimeParking});
	armTypes.push({id: '15',name:parent.lang.alarm_type_motion});
	armTypes.push({id: '4',name:parent.lang.alarm_type_video_lost});
	armTypes.push({id: '5',name:parent.lang.alarm_type_video_mask});
	//armTypes.push({id: '39',name:parent.lang.monitor_alarm_disk1NoExist});
	//armTypes.push({id: '40',name:parent.lang.monitor_alarm_disk2NoExist});
	armTypes.push({id: '10',name:parent.lang.alarm_type_disk_error});
	armTypes.push({id: '157',name:parent.lang.alarm_type_highTemperature});
	armTypes.push({id: '162',name:parent.lang.alarm_type_defect_disk});
	armTypes.push({id: '45',name:parent.lang.monitor_alarm_GpsInvalid});
	armTypes.push({id: '18',name:parent.lang.alarm_type_gps_signal_loss});
	armTypes.push({id: '202',name:parent.lang.alarm_type_GNSSModuleFailure});
	armTypes.push({id: '203',name:parent.lang.alarm_type_GNSSAntennaMissedOrCut});
	armTypes.push({id: '204',name:parent.lang.alarm_type_GNSSAntennaShort});
	armTypes.push({id: '207',name:parent.lang.alarm_type_LCDorDisplayFailure});
	armTypes.push({id: '208',name:parent.lang.alarm_type_TTSModuleFailure});
	armTypes.push({id: '209',name:parent.lang.alarm_type_cameraMalfunction});
	armTypes.push({id: '215',name:parent.lang.alarm_type_VSSFailure});
	armTypes.push({id: '2',name:parent.lang.alarm_type_ungency_button});
	armTypes.push({id: '6',name:parent.lang.alarm_type_door_open_lawless});
	armTypes.push({id: '46',name:parent.lang.alarm_type_add_oil});
	armTypes.push({id: '47',name:parent.lang.alarm_type_dec_oil});
	armTypes.push({id: '216',name:parent.lang.alarm_type_abnormalFuel});
	//armTypes.push({id: '113',name:parent.lang.alarm_type_custom_alarm});
	armTypes.push({id: '9',name:parent.lang.alarm_type_temperator});
	armTypes.push({id: '151',name:parent.lang.alarm_type_nightdriving});
	armTypes.push({id: '49',name:parent.lang.alarm_type_fatigue});
	armTypes.push({id: '153',name:parent.lang.alarm_type_gathering});
	armTypes.push({id: '155',name:parent.lang.alarm_type_upsCut});
	armTypes.push({id: '159',name:parent.lang.alarm_type_before_board_opened});
	armTypes.push({id: '166',name:parent.lang.alarm_type_sim_lost});
	armTypes.push({id: '7',name:parent.lang.alarm_type_erong_pwd});
	armTypes.push({id: '13',name:parent.lang.alarm_type_door_abnormal});
	armTypes.push({id: '3',name:parent.lang.alarm_type_shake});
	armTypes.push({id: '8',name:parent.lang.alarm_type_illegalIgnition});
	armTypes.push({id: '16',name:parent.lang.alarm_type_Acc_on});
	armTypes.push({id: '66',name:parent.lang.alarm_type_Acc_off});
	armTypes.push({id: '201',name:parent.lang.alarm_type_earlyWarning});
	armTypes.push({id: '205',name:parent.lang.alarm_type_mainSupplyUndervoltage});
	armTypes.push({id: '206',name:parent.lang.alarm_type_mainPowerFailure});
	armTypes.push({id: '210',name:parent.lang.alarm_type_cumulativeDayDrivingTimeout});
	armTypes.push({id: '217',name:parent.lang.alarm_type_antitheftDevice});
	armTypes.push({id: '218',name:parent.lang.alarm_type_illegalDisplacement});
	armTypes.push({id: '219',name:parent.lang.alarm_type_rollover});
	armTypes.push({id: '19',name:parent.lang.alarm_type_io1});
	armTypes.push({id: '20',name:parent.lang.alarm_type_io2});
	armTypes.push({id: '21',name:parent.lang.alarm_type_io3});
	armTypes.push({id: '22',name:parent.lang.alarm_type_io4});
	armTypes.push({id: '23',name:parent.lang.alarm_type_io5});
	armTypes.push({id: '24',name:parent.lang.alarm_type_io6});
	armTypes.push({id: '25',name:parent.lang.alarm_type_io7});
	armTypes.push({id: '26',name:parent.lang.alarm_type_io8});
	armTypes.push({id: '41',name:parent.lang.alarm_type_io9});
	armTypes.push({id: '42',name:parent.lang.alarm_type_io10});
	armTypes.push({id: '43',name:parent.lang.alarm_type_io11});
	armTypes.push({id: '44',name:parent.lang.alarm_type_io12});
	armTypes.push({id: '27',name:parent.lang.alarm_type_fence_in});
	armTypes.push({id: '28',name:parent.lang.alarm_type_fence_out});
	armTypes.push({id: '29',name:parent.lang.alarm_type_fence_in_overspeed});
	armTypes.push({id: '30',name:parent.lang.alarm_type_fence_out_overspeed});
	armTypes.push({id: '31',name:parent.lang.alarm_type_fence_in_lowspeed});
	armTypes.push({id: '32',name:parent.lang.alarm_type_fence_out_lowspeed});
	armTypes.push({id: '33',name:parent.lang.alarm_type_fence_in_stop});
	armTypes.push({id: '34',name:parent.lang.alarm_type_fence_out_stop});
	armTypes.push({id: '12',name:parent.lang.alarm_type_beyond_bounds});
	armTypes.push({id: '200',name:parent.lang.alarm_type_regionalSpeedingAlarm});
	armTypes.push({id: '211',name:parent.lang.alarm_type_outOfRegional});
	armTypes.push({id: '212',name:parent.lang.alarm_type_outOfLine});
	armTypes.push({id: '213',name:parent.lang.alarm_type_InadequateOrTooLongRoadTravelTime});
	armTypes.push({id: '214',name:parent.lang.alarm_type_routeDeviation});
	armTypes.push({id: '300',name:parent.lang.alarm_type_areaOverSpeed_platform});
	armTypes.push({id: '301',name:parent.lang.alarm_type_areaLowSpeed_platform});
	armTypes.push({id: '302',name:parent.lang.alarm_type_areaInOut_platform});
	armTypes.push({id: '303',name:parent.lang.alarm_type_lineInOut_platform});
	armTypes.push({id: '304',name:parent.lang.alarm_type_overSpeed_platform});
	armTypes.push({id: '305',name:parent.lang.alarm_type_lowSpeed_platform});
	armTypes.push({id: '306',name:parent.lang.alarm_type_fatigue_platform});
	armTypes.push({id: '307',name:parent.lang.alarm_type_parkTooLong_platform});
	armTypes.push({id: '308',name:parent.lang.alarm_type_areaPoint_platform});
	armTypes.push({id: '309',name:parent.lang.alarm_type_lineOverSpeed_platform});
	armTypes.push({id: '310',name:parent.lang.alarm_type_lineLowSpeed_platform});
	armTypes.push({id: '311',name:parent.lang.report_roadLvlOverSpeed_platform});
	//armTypes.push({id: '17',name:parent.lang.alarm_type_device_online});
	//armTypes.push({id: '67',name:parent.lang.alarm_type_device_disOnline});
}