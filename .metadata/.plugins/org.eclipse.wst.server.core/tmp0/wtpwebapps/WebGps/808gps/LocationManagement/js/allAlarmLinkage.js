var api = frameElement.api, W = api.opener;
var armTypes = [];
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
	
//	$('#labelScope').text(parent.lang.label_linked_scope);
	$('#labelarmType').text(parent.lang.label_alarmType);
//	$('#labelVehicle').text(parent.lang.monitor_labelVehicleIdno);
	
	/*$('#select-scope').flexPanel({
		ComBoboxModel :{
			button :
			[
				[{
					display: parent.lang.all, name : 'scope', pid : 'scope', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
				}]
			],
			combox: {name : 'scope', option : '&'+parent.lang.all+'|0&'+parent.lang.global_setting+'|1&'+parent.lang.singleVehicle_setting}
		}	
	});*/
	//获取报警类型
	getAlarmTypes();
	
	$('#select-armType').flexPanel({
		ComBoboxModel :{
			button :
			[
				[{
					display: parent.lang.all, name : 'type', pid : 'type', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
				}]
			],
			combox: {name : 'type', option : arrayToStr(armTypes)}
		}	
	});
	
	/*$('#selectVehicle').flexPanel({
		InputModel : {display: parent.lang.monitor_searchVehicle,value:'',name : 'vehiIdnos', pid : 'vehiIdnos', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
	});
	$('#combox-vehiIdnos').attr('autocomplete','off');*/
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.query, name : '', pclass : 'btnQuery',
				bgcolor : 'gray', hide : false}]
		]
	});
	
	var buttons = [];
	var btn = {};
	btn.separator = false; //分隔器
	btn.hidename = "";
	btn.name = parent.lang.add;
	btn.bclass = "flexAdd";
	btn.bimage = "";
	btn.tooltip = parent.lang.add;
	btn.onpress = addAlarmLinkage;
	btn.id = "add";
	buttons.push(btn);
	
	btn = {};
	btn.separator = true; //分隔器
	buttons.push(btn);
	
	btn = {};
	btn.separator = false; //分隔器
	btn.hidename = "";
	btn.name = parent.lang.batch_deletion;
	btn.bclass = "flexDelete";
	btn.bimage = "";
	btn.tooltip = parent.lang.batch_deletion;
	btn.onpress = batchDelAlarmMotion;
	btn.id = "delete";
	buttons.push(btn);
	
	$('#alarmLinkageTable').flexigrid({
		url: 'StandardAlarmMotionAction_list.action',
		dataType: 'json',
		colModel : [
		    {display: parent.lang.operator, name : 'operator', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
		//	{display: parent.lang.linked_scope, name : 'scope', width : 80, sortable : false, align: 'center'},
		//	{display: parent.lang.plate_number, name : 'vehiIdno', width : 150, sortable : false, align: 'center', hide: false},
			{display: parent.lang.vehicle_alarmaction_alarmType, name : 'armType', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.vehicle_alarmaction_videoPreview, name : 'isPreview', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.vehicle_alarmaction_previewTime, name : 'previewTime', width : 80, sortable : false, align: 'center', hide: false},
			{display: parent.lang.vehicle_alarmaction_mapLocked, name : 'mapLocked', width : 60, sortable : false, align: 'center', hide: false},
			{display: parent.lang.vehicle_alarmaction_alarmSound, name : 'alarmSound', width : 80, sortable : false, align: 'center', hide: false},
			{display: parent.lang.isEnable, name : 'isEnable', width : 60, sortable : false, align: 'center'}
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
		autoload: true,
		useRp: true,
		title: false,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: true,
		width: 'auto',
		onSubmit: false,
		height: 'auto'
	});
	
	loadReportTableWidth(fixHeight);
	
	$('.btnQuery','#toolbar-btn').on('click',function(){
		loadQuery();
	});
	
	/*$('#combox-vehiIdnos').on('keydown',function(e){
		if(e.keyCode == 13) {
			loadQuery();
		}
	});*/
}

function fixHeight() {
	$('#alarmLinkageTable').flexFixHeight();
}

function loadQuery() {
//	var scope = $('#hidden-scope').val();
	var armType = $('#hidden-type').val();
//	var vehiIdno = $('#combox-vehiIdnos').val();
	
	var params = [];
//	params.push({
//		name: 'scope',
//		value: scope
//	});
	params.push({
		name: 'armType',
		value: armType
	});
//	params.push({
//		name: 'vehiIdno',
//		value: vehiIdno
//	});
	$('#alarmLinkageTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'scope') {
		if(row['scp'] == 1) {
			pos = parent.lang.singleVehicle;
		}else {
			pos = parent.lang.global;
		}
	}else if(name == 'vehiIdno') {
		if(row['vid'] == '-1') {
			pos = parent.lang.global;
		}else {
			pos = row['vid'];
		}
	}else if(name == 'armType') {
		pos = '<span data-id="'+row['atp']+'" title="'+getArrayName(armTypes,row['atp'])+'">'+getArrayName(armTypes,row['atp'])+'</span>';
	}else if(name == 'isPreview') {
		if(row['ird'] == 1) {
			var previewChn = row['rch'];
			if(row['rch'] == -1) {//所有通道
				previewChn = parseInt('111111111111',2);
			}
			var chnArr = [];
			for (var i = 0; i < 12; i++) {
				if((previewChn>>i)&1 > 0) {
					chnArr.push('CH'+(i+1));
				}
			}
			pos = '<span title="'+chnArr.toString()+'">'+chnArr.toString()+'</span>';
		}else {
			pos = '<span title="'+parent.lang.no+'">'+parent.lang.no+'</span>';
		}
	}else if(name == 'previewTime') {
		if(row['ird'] == 1) {
			if(row['rtm'] == 0) {
				pos = parent.lang.vehicle_alarmaction_armEndClose;
			}else {
				pos = row['rtm'] + parent.lang.min_second;
			}
		}else {
			pos = parent.lang.nothing;
		}
	}else if(name == 'mapLocked') {
		if(row['sam'] == 1) {
			pos = parent.lang.yes;
		}else {
			pos = parent.lang.no;
		}
	}else if(name == 'isEnable') {
		if(row['enb'] == 1) {
			pos = parent.lang.yes;
		}else {
			pos = parent.lang.no;
		}
	}else if(name == 'alarmSound') {
		if(row['sd'] == 1) {
			pos = '<span title="'+row['sds']+'.mp3'+'">'+row['sds']+'.mp3'+'</span>';
		}else {
			pos = '<span title="'+parent.lang.no+'">'+parent.lang.no+'</span>';
		}
	}else if(name == 'operator'){
		pos += '<a class="edit" href="javascript:editAlarmLinkage('+row['id']+',\''+row['vid']+'\','+row['atp']+');" title="'+parent.lang.edit+'"></a>';
		pos += '<a class="delete" href="javascript:delAlarmMotion('+row['id']+',\''+row['vid']+'\','+row['atp']+');" title="'+parent.lang.del+'"></a>';
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

//新增报警联动信息
function addAlarmLinkage() {
	$.dialog({id:'alarmLinkage', title:parent.lang.add +'&nbsp&nbsp&nbsp&nbsp'+parent.lang.alarm_linkage ,content: 'url:LocationManagement/alarmLinkage.html',
		width:'640px',height:'600px', min:false, max:false, lock:true, parent: api});
}
//修改报警联动信息
function editAlarmLinkage(id, vehiIdno, armType) {
	var armTypeStr = getArrayName(armTypes, armType);
	$.dialog({id:'alarmLinkage', title:parent.lang.edit+'&nbsp&nbsp&nbsp&nbsp'+armTypeStr+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.alarm_linkage,content: 'url:LocationManagement/alarmLinkage.html?id='+id +'&vehiIdno='+vehiIdno+'&armType='+armType,
		width:'430px',height:'400px', min:false, max:false, lock:true, parent: api});
}
//删除报警联动信息
function commentDelAlarmMotion(id, vehiIdno, armType) {
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet('StandardAlarmMotionAction_delete.action?id=' + id, function(json,action,success){
		$.myajax.showLoading(false);
		if(success){
			$('#alarmLinkageTable').flexOptions().flexReload();
			//删除监控报警联动列表
			if((typeof W.alarmMotion) != 'undefined' && (typeof W.alarmMotion.deleteAlarmMotion) == 'function') {
				W.alarmMotion.deleteAlarmMotion(vehiIdno, armType);
			}
		}
	}, null);
}
//删除报警联动信息
function delAlarmMotion(id, vehiIdno, armType) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	commentDelAlarmMotion(id, vehiIdno, armType);
}
//批量删除报警联动信息
function batchDelAlarmMotion() {
	var ids = $('#alarmLinkageTable').selectedCheckedRows();
	if(ids.length == 0) {
		$.dialog.tips(parent.lang.errSelectedRequired, 1);
		return;
	}
	var idnos = [];
	var armTypes = [];
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		var armType = $.trim($('#row'+id).find('.armType span').attr('data-id'));
		idnos.push('-1');
		armTypes.push(armType);
	}
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	commentDelAlarmMotion(ids.toString(), idnos.toString(), armTypes.toString());
}

//新增成功后执行
function doSaveAlarmMotionSuc() {
	$.dialog.tips(parent.lang.saveok, 1);
	$.dialog({id:'alarmLinkage'}).close();
	$('#alarmLinkageTable').flexOptions().flexReload();
	//刷新监控报警联动列表
	if((typeof W.alarmMotion) != 'undefined' && (typeof W.alarmMotion.initAlarmMotion) == 'function') {
		W.alarmMotion.initAlarmMotion();
	}
}

//修改成功后执行
function doEditAlarmMotionSuc(data) {
	$.dialog.tips(parent.lang.saveok, 1);
	if(data != null) {
		var viewChn = parent.lang.no;
		var previewTime = parent.lang.nothing;
		if(data.ird == 1) {
			var previewChn = data.rch;
			if(data.rch == -1) {//所有通道
				previewChn = parseInt('111111111111',2);
			}
			var chnArr = [];
			for (var i = 0; i < 12; i++) {
				if((previewChn>>i)&1 > 0) {
					chnArr.push('CH'+(i+1));
				}
			}
			viewChn = chnArr.toString();
			if(data.rtm == 0) {
				previewTime = parent.lang.vehicle_alarmaction_armEndClose;
			}else {
				previewTime = data.rtm + parent.lang.min_second;
			}
		}
		$('#row'+data.id).find('.isPreview div span').attr('title',viewChn);
		$('#row'+data.id).find('.isPreview div span').text(viewChn);
		$('#row'+data.id).find('.previewTime div').text(previewTime);
		
		if(data.sam == 1) {
			$('#row'+data.id).find('.mapLocked div').text(parent.lang.yes);
		}else {
			$('#row'+data.id).find('.mapLocked div').text(parent.lang.no);	
		}
		
		var alarmSound = parent.lang.no;
		if(data.sd == 1) {
			alarmSound = data.sds + '.mp3';
		}
		$('#row'+data.id).find('.alarmSound div span').attr('title',alarmSound);
		$('#row'+data.id).find('.alarmSound div span').text(alarmSound);
		
		if(data.enb == 1) {
			$('#row'+data.id).find('.isEnable div').text(parent.lang.yes);
		}else {
			$('#row'+data.id).find('.isEnable div').text(parent.lang.no);
		}
	}
	//更新监控报警联动列表
	if((typeof W.alarmMotion) != 'undefined' && (typeof W.alarmMotion.updateAlarmMotion) == 'function') {
		data.uid = parent.userId;
		W.alarmMotion.updateAlarmMotion(data);
	}
	$.dialog({id:'alarmLinkage'}).close();
}

//删除音频文件刷新联动列表
function refreshAlarmMotion() {
	$('#alarmLinkageTable').flexOptions().flexReload();
	//刷新监控报警联动列表
	if((typeof W.alarmMotion) != 'undefined' && (typeof W.alarmMotion.initAlarmMotion) == 'function') {
		W.alarmMotion.initAlarmMotion();
	}
}

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