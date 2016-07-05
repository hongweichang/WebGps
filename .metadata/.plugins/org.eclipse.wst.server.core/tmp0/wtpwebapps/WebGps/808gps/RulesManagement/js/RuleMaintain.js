var ruleType = 'fatigue';
var ruleName = '';
var url = '';
var width = '400px';
var height = '600px';
var lstCompanyId = [];
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
	//
	if(parent.companys && parent.companys.length > 0) {
		for (var i = 0; i < parent.companys.length; i++) {
			lstCompanyId.push(parent.companys[i].id);
		}
	}
	
	$('#labelarmType').text(parent.lang.label_alarmType);
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
	
	$('#toolbar-search').flexPanel({
		SerachBarModel :
			{display: parent.lang.rule_name, name : 'rule', pfloat : 'left'}
	});
	var mod = [[{
		display: parent.lang.rule_showAllRule, name : '', pclass : 'btnAllRule',bgcolor : 'gray', hide : false
	}],[{
		display: parent.lang.add, name : '', pclass : 'btnAddRule',bgcolor : 'gray', hide : false
	}]];
	$('#toolbar-btn').flexPanel({
		ButtonsModel : mod
	});
	var tableWidth = 0;
	if(parent.screenWidth <= 1280) {
		tableWidth = 1066;
	}else {
		tableWidth = 'auto';
	}
	$('#ruleTable').flexigrid({
		url: 'StandardVehicleRuleAction_loadVehicleRules.action?type=1&ruleType='+ruleType,
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.rule_name, name : 'name', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.vehicle_alarmaction_alarmType, name : 'armType', width : 150, sortable : false, align: 'center', hide: true},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center', hide: false},
			{display: parent.lang.operator, name : 'operator', width : 200, sortable : false, align: 'center'}
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
//				checkbox: true,
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		usepager: true,
		autoload: true,
		useRp: true,
		title: false,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: false,
		width: tableWidth,
		onSubmit: false,
		height: 'auto'
	});
	getRuleUrl();
	loadReportTableWidth();
	$('#toolbar-search .y-btn').on('click',function(){
		var name = $('#toolbar-search .search-input').val();
		var params = [];
		params.push({
			name: 'name',
			value: name
		});
		var armType = "";
		if(ruleType == 'alarmMotion') {
			armType = $('#hidden-type').val();
		}
		params.push({
			name: 'armType',
			value: armType
		});
		$('#ruleTable').flexOptions(
				{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
	});
	
	$('#toolbar-search .search-input').on('keydown',function(e){
		if(e.keyCode == 13) {
			var name = $('#toolbar-search .search-input').val();
			var params = [];
			params.push({
				name: 'name',
				value: name
			});
			var armType = "";
			if(ruleType == 'alarmMotion') {
				armType = $('#hidden-type').val();
			}
			params.push({
				name: 'armType',
				value: armType
			});
			$('#ruleTable').flexOptions(
					{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
		}
	});
	$('.btnAllRule','#toolbar-btn').on('click',function(){
		var params = [];
		params.push({
			name: 'name',
			value: ''
		});
		params.push({
			name: 'armType',
			value: ''
		});
		$('#ruleTable').flexOptions(
				{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
	});
	$('.btnAddRule','#toolbar-btn').on('click',function(){
		if(ruleType == 'alarmMotion') {
			width = '610px';
		}
		$.dialog({id:'ruleinfo', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+ruleName,content: 'url:'+url+'&id=&type=add',
			width:width,height:height, min:false, max:false, lock:true});
	});
	
	//运营管理808后台
	var l=$(".tips .tit li").length;
	var w=l*82;
	if(w>738){
		
	}
	var prev = $('.tit .prev'),
    next  = $('.tit .next'),
    ul = $('.list ul'),
    lis = ul.children('li'),
    liNum = lis.length,
    liWidth = 82,
    max = liNum-9,
    count = 0;
	if(parent.langIsChinese()){
		$('.content .tips .tit .list').css('width','1148px');
	}else{
		$('.ico12').parent().hide();
	}

	next.click(function(){
		if(count<=max){
			count++;
			ul.animate({left: (-count*liWidth)+'px'}, "slow");
	        lis.eq(count).addClass("active").siblings().removeClass("active");
			if(count==max){
				next.hide()
			}
			if(count!=0){
				prev.show()
			}
		}
	});
	
	prev.click(function(){
		if(count>0){
			count--;
			ul.animate({left: (-count*liWidth)+'px'}, "slow");
	        lis.eq(count).addClass("active").siblings().removeClass("active");
			if(count==0){
				prev.hide()
			}
			if(count != max){
				next.show()
			}
		}
	});            
	$('.list li').each(function() {
		var data_tab = $(this).attr('data-tab');
		var title = '';
		var armType_ = false;
		if(data_tab == 'fatigue') {
			title = parent.lang.rule_fatigue_span;
		}else if(data_tab == 'forbidInto') {
			title = parent.lang.rule_forbidInto_span;
		}else if(data_tab == 'forbidOut') {
			title = parent.lang.rule_forbidOut_span;
		}
//		else if(data_tab == 'areaSpeed') {
//			title = parent.lang.rule_areaPeriodSpeed_span;
//		}
		else if(data_tab == 'periodSpeed') {
			title = parent.lang.rule_periodSpeed_span;
			title = parent.lang.report_nightdriving;
		}else if(data_tab == 'parkingTooLong') {
			title = parent.lang.rule_parkingTooLong_span;
		}else if(data_tab == 'lineOffset') {
			title = parent.lang.rule_lineOffset_span;
		}else if(data_tab == 'timingPicture') {
			title = parent.lang.rule_timingPicture_span;
		}else if(data_tab == 'timerRecording') {
			title = parent.lang.rule_timerRecording_span;
		}else if(data_tab == 'wifiDownload') {
			title = parent.lang.rule_wifiDownload_span;
		}else if(data_tab == 'roadGrade') {
			title = parent.lang.rule_roadGrade_span;
		}else if(data_tab == 'linerangelimit') {
			title = parent.lang.rule_linerangelimit_span;
		}else if(data_tab == 'keypoint') {
			title = parent.lang.rule_keypoint_span;
		}/*else if(data_tab == 'nightDriving') {
			title = parent.lang.report_nightdriving;
		}*/else if(data_tab == 'alarmMotion') {
			title = parent.lang.rule_alarmMotion_span;
			armType_ = true;
		}
		$(this).find('span').text(title);

		$(this).click(function() {
			ruleType = $(this).attr('data-tab');
			$('#opera-top .search-input').val('');
			showArmType(armType_);
			var params = [];
			params.push({
				name: 'name',
				value: ''
			});
			var armType = "";
			if(ruleType == 'alarmMotion') {
				armType = $('#hidden-type').val();
			}
			params.push({
				name: 'armType',
				value: armType
			});
			$('#ruleTable').flexOptions(
					{url:'StandardVehicleRuleAction_loadVehicleRules.action?type=1&ruleType='+ruleType,newp: 1,sortname: '', 
				sortorder: '', query: '', qtype: '', params:params}).flexReload();
			$(this).addClass('active').siblings().removeClass("active");
			getRuleUrl();
		});
	});
}

function showArmType(show) {
	if(show) {
		$('#toolbar-armType').show();
		$('.hDiv .armType').show();
		$('.hDiv .armType').removeAttr('hidden');
	}else {
		$('#toolbar-armType').hide();
		$('.hDiv .armType').hide();
		$('.hDiv .armType').attr('hidden', 'hidden');
	}
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'company') {
		if(row[name].level == 2) {
			pos = getParentCompany(parent.vehiGroupList,row[name].parentId).name;
		}else {
			pos = row[name].name;
		}
	}else if(name == 'armType') {
		if(row[name] == 0) {
			pos = parent.lang.nothing;
		}else {
			pos = '<span data-id="'+row[name]+'" title="'+getArrayName(armTypes,row[name])+'">'+getArrayName(armTypes,row[name])+'</span>';
		}
	}else if(name == 'operator'){
		pos = '<a class="assign" href="javascript:assignVehicleRule('+row['id']+',\''+row['name']+'\');" title="'+parent.lang.rule_assignRule+'"></a>';
		pos += '<a class="detail" href="javascript:findRuleInfo('+row['id']+');" title="'+parent.lang.detailed+'"></a>';
		pos += '<a class="edit" href="javascript:editRuleInfo('+row['id']+');" title="'+parent.lang.edit+'"></a>';
		pos += '<a class="delete" href="javascript:delRuleInfo('+row['id']+');" title="'+parent.lang.del+'"></a>';
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

//分配规则
function assignVehicleRule(id,name) {
//	$.dialog({id:'ruleinfo', title:parent.lang.rule_assignRule,content: 'url:RulesManagement/AssignVehicleRule.html?id='+id+'&name='+name,
//	width:'400px',height:'450px', min:false, max:false, lock:true});
	
	$.dialog({id:'info', title:parent.lang.rule_assignRule,content: 'url:OperationManagement/SelectInfo.html?type=assignRule&ruleType='+ruleType+'&id='+id+'&name='+name+'&singleSelect=false',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}

function findRuleInfo(id) {
	if(ruleType == 'alarmMotion') {
		width = '400px';
	}
	$.dialog({id:'ruleinfo', title:parent.lang.view+'&nbsp&nbsp&nbsp&nbsp'+ruleName,content: 'url:'+url+'&id='+id+'&type=',
			width:width,height:height, min:false, max:false, lock:true});
}
function editRuleInfo(id) {
	if(ruleType == 'alarmMotion') {
		width = '400px';
	}
	$.dialog({id:'ruleinfo', title:parent.lang.edit+'&nbsp&nbsp&nbsp&nbsp'+ruleName,content: 'url:'+url+'&id='+id+'&type=edit',
			width:width,height:height, min:false, max:false, lock:true});
}
function delRuleInfo(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet('StandardVehicleRuleAction_delVehicleRule.action?id=' + id, function(json,action,success){
		$.myajax.showLoading(false);
		if(success){
			$('#ruleTable').flexOptions().flexReload();
		}
	}, null);
}

function getRuleUrl() {
	width = '400px';
	height = '600px';
	if(ruleType == 'fatigue') {
		url = 'RulesManagement/FatigueInfo.html?ruleType=1';
		ruleName = parent.lang.rule_fatigue;
	}else if(ruleType == 'forbidInto') {
		url = 'RulesManagement/AreaRuleInfo.html?ruleType=2';
		ruleName = parent.lang.rule_forbidInto;
	}else if(ruleType == 'forbidOut') {
		url = 'RulesManagement/AreaRuleInfo.html?ruleType=3';
		ruleName = parent.lang.rule_forbidOut;
	}
	else if(ruleType == 'areaSpeed') {
		url = 'RulesManagement/AreaRuleInfo.html?ruleType=4';
		ruleName = parent.lang.rule_areaPeriodSpeed;
	}
	else if(ruleType == 'periodSpeed') {
		url = 'RulesManagement/PeriodSpeedInfo.html?ruleType=5';
		//ruleName = parent.lang.rule_periodSpeed;
		ruleName = parent.lang.rule_nightDriving;
	}else if(ruleType == 'parkingTooLong') {
		url = 'RulesManagement/ParkingTooLongInfo.html?ruleType=6';
		ruleName = parent.lang.rule_parkingTooLong;
	}else if(ruleType == 'lineOffset') {
		url = 'RulesManagement/AreaRuleInfo.html?ruleType=7';
		ruleName = parent.lang.rule_lineOffset;
	}else if(ruleType == 'timingPicture') {
		height = '230px';
		url = 'RulesManagement/TimingPlanInfo.html?ruleType=8';
		ruleName = parent.lang.rule_timingPicture;
	}else if(ruleType == 'timerRecording') {
		height = '200px';
		url = 'RulesManagement/TimingPlanInfo.html?ruleType=9';
		ruleName = parent.lang.rule_timerRecording;
	}else if(ruleType == 'wifiDownload') {
		height = '275px';
		url = 'RulesManagement/TimingPlanInfo.html?ruleType=10';
		ruleName = parent.lang.rule_wifiDownload;
	}else if(ruleType == 'linerangelimit') {
		url = 'RulesManagement/LineRangeLimitInfo.html?ruleType=11';
		ruleName = parent.lang.rule_linerangelimit;
	}else if(ruleType == 'keypoint') {
		url = 'RulesManagement/KeyPointInfo.html?ruleType=12';
		ruleName = parent.lang.rule_keypoint;
	}else if(ruleType == 'alarmMotion') {
		url = 'RulesManagement/AlarmMotion.html?ruleType=13';
		ruleName = parent.lang.rule_alarmMotion;
	}/*else if(ruleType == 'nightDriving') {
		url = 'RulesManagement/RoadGradeInfo.html?ruleType=14';
		ruleName = parent.lang.rule_nightDriving;
	}*/else if(ruleType == 'roadGrade') {
		height = '710px';
		url = 'RulesManagement/RoadGradeInfo.html?ruleType=14';
		ruleName = parent.lang.rule_roadGrade;
	}
	return url;
}

function doExit() {
	$.dialog({id:'info'}).close();
}
//分配规则成功
function doRulePermitSuc() {
	$.dialog({id:'ruleinfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

function doSaveRuleSuc() {
	$('#ruleTable').flexOptions().flexReload();
	$.dialog({id:'ruleinfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

var armTypes = [];
armTypes.push({id: '',name:parent.lang.all});
armTypes.push({id: '11',name:parent.lang.monitor_alarm_speed});
armTypes.push({id: '14',name:parent.lang.alarm_type_overtimeParking});
armTypes.push({id: '15',name:parent.lang.alarm_type_motion});
armTypes.push({id: '4',name:parent.lang.alarm_type_video_lost});
armTypes.push({id: '5',name:parent.lang.alarm_type_video_mask});
armTypes.push({id: '39',name:parent.lang.monitor_alarm_disk1NoExist});
armTypes.push({id: '40',name:parent.lang.monitor_alarm_disk2NoExist});
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
armTypes.push({id: '113',name:parent.lang.alarm_type_custom_alarm});
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
armTypes.push({id: '17',name:parent.lang.alarm_type_device_online});
armTypes.push({id: '67',name:parent.lang.alarm_type_device_disOnline});
