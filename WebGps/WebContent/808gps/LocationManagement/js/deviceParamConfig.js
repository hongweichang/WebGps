var api = frameElement.api, W = api.opener;
var vehiIdno = decodeURIComponent(getUrlParameter('vehiIdno'));//车牌号
var devIdno = decodeURIComponent(getUrlParameter('devIdno'));//设备号
var userServer = W.userServer; //用户服务器
var isLoadVehiSuc = false;

$(document).ready(function(){
	loadReadyPage();
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
//	userServer.ip = '192.168.1.222';
	//如果设备号为空，根据车牌号查出设备号
	if(!devIdno) {
		var vehicle = parent.vehicleManager.getVehicle(vehiIdno.toString());
		if(vehicle) {
			var device = vehicle.getDevList()[0];
			if(device) {
				devIdno = device.getIdno();
			}
		}
	}
	
	/*$('#search-list .device a').text('设备设置');
	$('#search-list .monitor a').text('通话/监听设置');*/
	$('#search-list .vehicle a').text(parent.lang.param_vehicleSettings);
	$('#configListTitle').text(parent.lang.param_configList);
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.save, name : '', pclass : 'btnSave',
				bgcolor : 'gray', hide : false}],
			[{display: parent.lang.refresh, name : '', pclass : 'btnRefresh',
				bgcolor : 'gray', hide : false}],
			[{display: parent.lang.save_to_other, name : '', pclass : 'btnSaveOther',
				bgcolor : 'gray', hide : false}],
			[{display: parent.lang.close, name : '', pclass : 'btnExit',
				bgcolor : 'gray', hide : false}]
		]
	});
	
	//加载车辆设置页面
	loadVehicleConfigPage();
	
	//加载设置发送列表
	loadConfigListTable();
	
	initPageInfo(vehiIdno, devIdno, true);
	
	//保存参数配置
	$('.btnSave').on('click', clickSetParamConfig);
	//刷新
	$('.btnRefresh').on('click', ajaxRefreshParamConfig);
	//保存到其他设备
	$('.btnSaveOther').on('click', ajaxSaveParamConfigToOther);
	//退出
	$('.btnExit').on('click', function() {
		W.monitorMenu.paramConfigObj = null;
		W.$.dialog({id:'paramConfig'}).close();
	});
	
	//切换事件列表
	$("#search-list li").click(function(){
		var infoType = $(this).index();
		$(this).addClass("active").siblings().removeClass("active");
		$("#search-table li.list").eq(infoType).addClass("active").siblings().removeClass("active");
		//如果点击后未刷新成功，则每次点击都刷新
		if(!isLoadVehiSuc && infoType == 0) {
			//刷新参数配置信息
			ajaxRefreshParamConfig();
		}
	});
}

//加载车辆设置页面
function loadVehicleConfigPage() {
	$('#vehicle-config').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.param_drivingTime,pid : 'driveTimeSettings',hide:false,tabshide: false, headhide: false},
				colgroup:{width:['180px','220px','180px','220px']},
				tabs:{
					display: [parent.lang.alarm_maxSpeed , parent.lang.param_speedDuration, parent.lang.param_odometerReading, parent.lang.param_totalDriveTime,
					          parent.lang.param_continuousDrivingTime, parent.lang.param_maxParkTime, parent.lang.param_minRestPeriod],
					name : ['maxSpeed', 'overSpeedTime', 'liChengNum', 'totalDriveTime',
					        'continueDriveTime', 'maxParkTime', 'minRestTime'],
					type:['input','input','input','input','input','input','input'],
					length:[3, 3, 9, 9, 9, 9, 9],
					tips:[parent.lang.param_maxSpeed_tip, parent.lang.param_maxSecond_tip, parent.lang.param_odometer_tip, parent.lang.param_second_tip,
					      parent.lang.param_second_tip, parent.lang.param_second_tip, parent.lang.param_second_tip]
				}
			},
			{
				title :{display: parent.lang.param_intervalSettings,pid : 'intervalSettings',hide:false,tabshide: false, headhide: false},
				colgroup:{width:['180px','220px','180px','220px']},
				tabs:{
					display: [parent.lang.param_sleepInterval, parent.lang.param_urgentAlarmInterval, parent.lang.param_defaultInterval, parent.lang.param_notLoggedInterval],
					name : ['sleepInterval', 'urgentAlarmInterval', 'defaultInterval', 'notLoggedInterval'],
					type:['input','input','input','input'],
					length:[9, 9, 9, 9],
					tips:[parent.lang.param_second_tip, parent.lang.param_second_tip, parent.lang.param_second_tip, parent.lang.param_second_tip]
				}
			},
			{
				title :{display: parent.lang.param_distanceSettings,pid : 'distanceSettings',hide:false,tabshide: false, headhide: false},
				colgroup:{width:['180px','220px','180px','220px']},
				tabs:{
					display: [parent.lang.param_sleepDistance, parent.lang.param_urgentAlarmDistance, parent.lang.param_defaultDistance, parent.lang.param_notLoggedDistance,
					          parent.lang.param_inflectionAngle],
					name : ['sleepDistance', 'urgentAlarmDistance', 'defaultDistance', 'notLoggedDistance', 'inflectionAngle'],
					type:['input','input','input','input','input'],
					length:[9, 9, 9, 9, 3],
					tips:[parent.lang.param_meter_tip, parent.lang.param_meter_tip, parent.lang.param_meter_tip, parent.lang.param_meter_tip, parent.lang.param_angle_tip]
				}
			}
		]
	});
	
	//限制输入数字
	$('#vehicle-config input').each(function() {
		enterDigital(this);
	});
}

//加载设置发送列表
function loadConfigListTable() {
	$('#configListTable').flexigrid({
		url: "configListTable",
		dataType: 'json',
		colModel : [
			{display: parent.lang.plate_number, name : 'idno', width : 150, sortable : false, align: 'center', hide: false},
			{display: parent.lang.time, name : 'time', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.status, name : 'status', width : 150, sortable : false, align: 'center'},
//			{display: parent.lang.content, name : 'content', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.type, name : 'type', width : 150, sortable : false, align: 'center'}
		],
		usepager: false,
		useRp: false,
		autoload: false,
		singleSelect: true,
		checkbox: false,
		rp: 50,
		rpOptions: [20, 50, 100, 150, 200],
		idProperty: 'id',
		showTableToggleBtn: true,
		showToggleBtn: true,
		onSubmit: false,
		resizable: false,
		width: 'auto',//Math.round(6 * parent.screenWidth/7) - 5,
		height: 130
	});
}

function getColumnTitle(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

function fillCellInfo(p, row, idx, index) {
	var name = p.colModel[idx].name;
	var ret = "";
	if(name == 'idno') {
		ret = row.idno;
	}else if(name == 'content') {
		ret = row.content;
	}else if(name == 'time') {
		ret = row.time;
	}else if(name == 'status') {
		ret = row.status;
	}else if(name == 'type') {
		ret = parent.lang.param_vehicleSettings;
	}     
	return getColumnTitle(ret);
}

//点击保存参数设置
function clickSetParamConfig() {
	//如果设备号为空
	if(!devIdno) {
		return;
	}
	//设置参数配置前准备参数
	preSetParamConfigInfo([vehiIdno]);
}

var selVehiList = []; //选中的待设置车辆
var isSetting= true; //是否正在设置

//设置参数配置前准备参数
function preSetParamConfigInfo(vehiIdnoList) {
	var vehi_data = {};
	//休眠时汇报时间间隔
	vehi_data['39'] = $.trim($('#input-sleepInterval').val());
	if(!vehi_data['39'] || vehi_data['39'] == 0) {
		$.dialog.tips(parent.lang.param_sleepInterval_error, 1);
		$('#input-sleepInterval').focus();
		return;
	}
	//紧急报警时汇报时间间隔
	vehi_data['40'] = $.trim($('#input-urgentAlarmInterval').val());
	if(!vehi_data['40'] || vehi_data['40'] == 0) {
		$.dialog.tips(parent.lang.param_urgentAlarmInterval_error, 1);
		$('#input-urgentAlarmInterval').focus();
		return;
	}
	//缺省时间间隔
	vehi_data['41'] = $.trim($('#input-defaultInterval').val());
	if(!vehi_data['41'] || vehi_data['41'] == 0) {
		$.dialog.tips(parent.lang.param_defaultInterval_error, 1);
		$('#input-defaultInterval').focus();
		return;
	}
	//驾驶员未登录汇报时间间隔
	vehi_data['34'] = $.trim($('#input-notLoggedInterval').val());
	if(!vehi_data['34'] || vehi_data['34'] == 0) {
		$.dialog.tips(parent.lang.param_notLoggedInterval_error, 1);
		$('#input-notLoggedInterval').focus();
		return;
	}
	//休眠时汇报距离间隔
	vehi_data['46'] = $.trim($('#input-sleepDistance').val());
	if(!vehi_data['46'] || vehi_data['46'] == 0) {
		$.dialog.tips(parent.lang.param_sleepDistance_error, 1);
		$('#input-sleepDistance').focus();
		return;
	}
	//紧急报警时汇报距离间隔
	vehi_data['47'] = $.trim($('#input-urgentAlarmDistance').val());
	if(!vehi_data['47'] || vehi_data['47'] == 0) {
		$.dialog.tips(parent.lang.param_urgentAlarmDistance_error, 1);
		$('#input-urgentAlarmDistance').focus();
		return;
	}
	//缺省距离间隔
	vehi_data['44'] = $.trim($('#input-defaultDistance').val());
	if(!vehi_data['44'] || vehi_data['44'] == 0) {
		$.dialog.tips(parent.lang.param_defaultDistance_error, 1);
		$('#input-defaultDistance').focus();
		return;
	}
	//驾驶员未登录汇报距离间隔
	vehi_data['45'] = $.trim($('#input-notLoggedDistance').val());
	if(!vehi_data['45'] || vehi_data['45'] == 0) {
		$.dialog.tips(parent.lang.param_notLoggedDistance_error, 1);
		$('#input-notLoggedDistance').focus();
		return;
	}
	//拐点补传角度
	vehi_data['11'] = $.trim($('#input-inflectionAngle').val());
	//最高速度
	vehi_data['85'] = $.trim($('#input-maxSpeed').val());
	if(vehi_data['85'] > 255) {
		$.dialog.tips(parent.lang.errRequireParam, 1);
		$('#input-maxSpeed').focus();
		return;
	}
	//超速持续时间
	vehi_data['86'] = $.trim($('#input-overSpeedTime').val());
	if(vehi_data['86'] > 255) {
		$.dialog.tips(parent.lang.errRequireParam, 1);
		$('#input-overSpeedTime').focus();
		return;
	}
	//车辆里程表读数
	vehi_data['128'] = $.trim($('#input-liChengNum').val());
	//当前累计驾驶时间
	vehi_data['88'] = $.trim($('#input-totalDriveTime').val());
	//连续驾驶时间
	vehi_data['87'] = $.trim($('#input-continueDriveTime').val());
	//最长停车时间
	vehi_data['90'] = $.trim($('#input-maxParkTime').val());
	//最小休息时间
	vehi_data['89'] = $.trim($('#input-minRestTime').val());
	
	var index = $('#configListTable tr').length;
	var rows = [];
	for (var i = 0; i < vehiIdnoList.length; i++) {
		var info = {};
		info.id = index + i;
		info.idno = vehiIdnoList[i];
		info.time = dateFormat2TimeString(new Date());
		info.status = parent.lang.monitor_setting;
		info.type = 1;
		rows.push(info);
		
		var data = {};
		data.id = index + i;
		data.vid =  vehiIdnoList[i];
		loadVehicleInfo(data, vehi_data);
		selVehiList.push(data);
	}
	$('#configListTable').flexAppendRowJson(rows, true);
	
	//发送TTS
	if(isSetting) {
		ajaxSetParamConfig();
	}
}

//将参数配置加入车辆信息
function loadVehicleInfo(retData, data) {
	retData['39'] = data['39'];
	retData['40'] = data['40'];
	retData['41'] = data['41'];
	retData['34'] = data['34'];
	retData['46'] = data['46'];
	retData['47'] = data['47'];
	retData['44'] = data['44'];
	retData['45'] = data['45'];
	retData['11'] = data['11'];
	retData['85'] = data['85'];
	retData['86'] = data['86'];
	retData['128'] = data['128'];
	retData['88'] = data['88'];
	retData['87'] = data['87'];
	retData['90'] = data['90'];
	retData['89'] = data['89'];
}

var ajaxSetObj = null;//发送设置请求AJAX对象
var startSetTime = null;//开始设置的时间
var setVehicle = null; //正在设置的车辆

//设置参数配置
function ajaxSetParamConfig() {
	//如果发送时间超过70秒，则判断失败
	if(startSetTime != null && (new Date()).getTime() - startSetTime > 70000) {
		//取消上次请求
		if(ajaxSetObj != null) {
			ajaxSetObj.abort();
		}
		var obj = $('#configListTable').find($('#configListTable').flexGetRowid(setVehicle.id));
		obj.find('.time div').html(getColumnTitle(dateFormat2TimeString(new Date())));
		obj.find('.status div').html(getColumnTitle(parent.lang.monitor_setFail));
		isSetting = true;
	}
	if(isSetting) {
		if(selVehiList != null && selVehiList.length > 0) {
			startSetTime = (new Date()).getTime();
			isSetting = false;
			setVehicle = selVehiList[0];
			selVehiList.splice(0,1);
			var vehicle = parent.vehicleManager.getVehicle(setVehicle.vid);
			//判断车辆是否在线，支持参数配置的设备是否在线
			var device = null;
			if(vehicle.getIdno() == vehiIdno && devIdno != null && devIdno != '') {
				device = parent.vehicleManager.getDevice(devIdno);
			}else {
				for (var i = 0; i < vehicle.getDevList().length; i++) {
					if(vehicle.getDevList()[i].isOnline() && vehicle.getDevList()[i].isCan808ParamConfig()){
						device = vehicle.getDevList()[i];
						break;
					}
				}
			}
			
			//车辆在线才能发送
			if(device != null && device.isOnline()) {
				setVehicle.did = device.getIdno();
				var obj = $('#configListTable').find($('#configListTable').flexGetRowid(setVehicle.id));
				
				disableForm(true);
				$.myajax.showLoading(true, parent.lang.loading, this);
				var action = "http://"+ userServer.ip +":"+ userServer.port +"/2/74/callback=getData?Command=33027&DevIDNO="+ setVehicle.did;
				action += '&jsession='+GetCookie("JSESSIONID");
				ajaxSetObj = $.ajax({
					type : "get",  
					url : action,
					timeout: 60000,
					data : setVehicle,
			      	dataType: "jsonp",
			      	success :getData = function(json){
			      		$.myajax.showLoading(false);
			      		disableForm(false);
			      		obj.find('.time div').html(getColumnTitle(dateFormat2TimeString(new Date())));
			      		if(json.result == 0){
			      			obj.find('.status div').html(getColumnTitle(parent.lang.monitor_setSuccess));
			      		}else if(json.result == 45) {
			      			obj.find('.status div').html(getColumnTitle(parent.lang.device_nosupport));
			      		}else {
			      			obj.find('.status div').html(getColumnTitle(parent.lang.monitor_setFail));
			      		}
			      		isSetting = true;
			      		startSetTime = null;
			      },error:function(XHR, textStatus, errorThrown){
			    	  $.myajax.showLoading(false);
			    	  disableForm(false);
			    	  if(errorThrown == 'timeout') {
			    		  obj.find('.time div').html(getColumnTitle(dateFormat2TimeString(new Date())));
			    		  obj.find('.status div').html(getColumnTitle(parent.lang.monitor_setFail));
			    	  }
			    	  isSetting = true;
			    	  startSetTime = null;
			      } 
			   });
			}else {
				var obj = $('#configListTable').find($('#configListTable').flexGetRowid(setVehicle.id));
	    		obj.find('.time div').html(getColumnTitle(dateFormat2TimeString(new Date())));
	    		obj.find('.status div').html(getColumnTitle(parent.lang.monitor_setFail));
	    		isSetting = true;
	    		startSetTime = null;
			}
			ajaxSetParamConfig();
		}
	}else {
		setTimeout(ajaxSetParamConfig, 50);
	}
}

//刷新
var ajaxRefreshObject = null;//发送请求对象
function ajaxRefreshParamConfig() {
	//如果设备号为空
	if(!devIdno) {
		return;
	}
	
	//再次发送前取消上一次发送
	if(ajaxRefreshObject != null) {
		ajaxRefreshObject.abort();
	}
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	var action = "http://"+ userServer.ip +":"+ userServer.port +"/2/74/callback=getData?Command=33028&DevIDNO="+ devIdno;
	action += '&jsession='+GetCookie("JSESSIONID");
	ajaxRefreshObject = $.ajax({
		type : "get",  
		url : action,
		timeout: 60000,
		data : null,
      	dataType: "jsonp",
      	success :getData = function(json){
      		$.myajax.showLoading(false);
      		disableForm(false);
      		if(json.result == 0){
      			isLoadVehiSuc = true;
      			fillPageParam(json);
      			$.dialog.tips(parent.lang.param_getInfo_suc, 2);
      		}else {
      			var mess = '';
  				if((typeof showDialogErrorMessage) == 'function') {
  					mess = showDialogErrorMessage(json.result, json.cmsserver);
  				}
  				if(mess != null && mess == '') {
  					$.dialog.tips(parent.lang.param_getInfo_fail, 2);
  				}
      		}
      },error:function(XHR, textStatus, errorThrown){
    	  $.myajax.showLoading(false);
    	  disableForm(false);
    	  if(errorThrown == 'timeout') {
    		  $.dialog.tips(parent.lang.param_getInfo_fail, 2);
    	  }
      } 
   });
}

//将查询到的参数填写到页面
function fillPageParam(data) {
	if(data) {
		//休眠时汇报时间间隔
		if(data['39']) {
			$('#input-sleepInterval').val(data['39']);
		}
		//紧急报警时汇报时间间隔
		if(data['40']) {
			$('#input-urgentAlarmInterval').val(data['40']);
		}
		//缺省时间间隔
		if(data['41']) {
			$('#input-defaultInterval').val(data['41']);
		}
		//驾驶员未登录汇报时间间隔
		if(data['34']) {
			$('#input-notLoggedInterval').val(data['34']);
		}
		//休眠时汇报距离间隔
		if(data['46']) {
			$('#input-sleepDistance').val(data['46']);
		}
		//紧急报警时汇报距离间隔
		if(data['47']) {
			$('#input-urgentAlarmDistance').val(data['47']);
		}
		//缺省距离间隔
		if(data['44']) {
			$('#input-defaultDistance').val(data['44']);
		}
		//驾驶员未登录汇报距离间隔
		if(data['45']) {
			$('#input-notLoggedDistance').val(data['45']);
		}
		//拐点补传角度
		$('#input-inflectionAngle').val(data['11']);
		//最高速度
		$('#input-maxSpeed').val(data['85']);
		//超速持续时间
		if(data['86']) {
			$('#input-overSpeedTime').val(data['86']);
		}
		//车辆里程表读数
		if(data['128']) {
			$('#input-liChengNum').val(data['128']);
		}
		//当前累计驾驶时间
		if(data['88']) {
			$('#input-totalDriveTime').val(data['88']);
		}
		//连续驾驶时间
		if(data['87']) {
			$('#input-continueDriveTime').val(data['87']);
		}
		//最长停车时间
		if(data['90']) {
			$('#input-maxParkTime').val(data['90']);
		}
		//最小休息时间
		if(data['89']) {
			$('#input-minRestTime').val(data['89']);
		}
	}
}

//保存到其他设备
function ajaxSaveParamConfigToOther() {
	$.dialog({id:'configToOther', title: parent.lang.save_to_other, content: 'url:LocationManagement/deviceParamConfigToOther.html?type=808',
		width: '400px', height: '630px', min:true, max:false, lock:true,fixed:false
			, resize:false, close: false });
}

//选择车辆成功
function saveToOtherSuccess(vehiIdnoList) {
	$.dialog({id:'configToOther'}).close();
	//设置参数配置前准备参数
	preSetParamConfigInfo(vehiIdnoList);
}

//重新打开页面时调用
function initPageInfo(vehiIdno_, devIdno_, isPage) {
	if(isPage || devIdno != devIdno_) {
		vehiIdno = vehiIdno_;
		devIdno = devIdno_;
		//清空数据
		$('#search-table input').each(function() {
			$(this).val('');
		});
		//刷新参数配置信息
		ajaxRefreshParamConfig();
	}
}