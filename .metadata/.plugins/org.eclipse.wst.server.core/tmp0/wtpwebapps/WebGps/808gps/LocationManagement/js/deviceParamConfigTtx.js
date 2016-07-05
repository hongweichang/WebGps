var api = frameElement.api, W = api.opener;
var vehiIdno = decodeURIComponent(getUrlParameter('vehiIdno'));//车牌号
var devIdno = decodeURIComponent(getUrlParameter('devIdno'));//设备号
var userServer = W.userServer; //用户服务器
var infoType = 0;  //点击类型  
var isLoadNetworkSuc = false;  //加载网络设置是否成功
var isLoadCodeSuc = false; //加载编码设置是否成功
var isLoadPTZSuc = false; //加载云台设置是否成功
var idLoadParkSuc = false; //加载停车超时是否成功
var channelList = null;//设备通道
var streamList = null; //码流类型
var switchList = null; //录像开关类型
var soundList = null;  //录像声音类型
var resolutionList = null; //分辨率类型
var framerateList = null; //帧率类型
var qualityList = null; //画质类型
var protocolList = null; //协议类型
var baudList = null; //波特率类型
var dataBitList = null; //数据位类型
var stopBitList = null; //停止位类型
var checksumList = null; //校验位类型
var speedUnitList = null; //速度单位

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
	
	$('#search-list .network a').text(parent.lang.param_network_set);
	$('#search-list .code a').text(parent.lang.param_code_set);
	$('#search-list .PTZ a').text(parent.lang.param_PTZ_set);
	$('#search-list .parking a').text(parent.lang.param_parking_set);
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
	
	//加载网络设置页面
	loadNetworkParamPage();
	
	//加载设置发送列表
	loadConfigListTable();
	
	//加载编码设置页面
	loadCodeParamPage();
	//加载云台设置页面
	loadPTZParamPage();
	//加载停车超时页面
	loadParkingParamPage();
	
	//初始化数据
	initPageInfo(vehiIdno, devIdno, true);
	
	//保存参数配置
	$('.btnSave').on('click', clickSetParamConfig);
	//刷新
	$('.btnRefresh').on('click', ajaxRefreshParamConfig);
	//保存到其他设备
	$('.btnSaveOther').on('click', ajaxSaveParamConfigToOther);
	//退出
	$('.btnExit').on('click', function() {
		W.monitorMenu.ttxParamConfigObj = null;
		W.$.dialog({id:'ttxParamConfig'}).close();
	});
	
	//切换事件列表
	$("#search-list li").click(function(){
		infoType = $(this).index();
		$(this).addClass("active").siblings().removeClass("active");
		$("#search-table li.list").eq(infoType).addClass("active").siblings().removeClass("active");
		//屏蔽所有下拉框
		$('.ui-menu').hide();
		//
		if(!isLoadNetworkSuc && infoType == 0) {
			ajaxRefreshParamConfig();
		}else if(!isLoadCodeSuc && infoType == 1) {
			ajaxRefreshParamConfig();
		}else if(!isLoadPTZSuc && infoType == 2) {
			ajaxRefreshParamConfig();
		}else if(!idLoadParkSuc && infoType == 3) {
			ajaxRefreshParamConfig();
		}
	});
}

//初始化网络设置页面参数
function initNetworkParamPageParam() {
	$('#network-config input').each(function() {
		$(this).val('');
	});
}

//加载网络设置页面
function loadNetworkParamPage() {
	$('#network-config').flexPanel({
		TableGroupModel :
		[	{
				title :{display: '',pid : '',hide:false,tabshide: false, headhide: true},
				colgroup:{width:['180px','400px']},
				tabs:{
					display: [parent.lang.device_number, parent.lang.rule_phone, parent.lang.plate_number, parent.lang.param_media_ip,
					          parent.lang.param_media_port, parent.lang.param_mainServer_ip, parent.lang.param_mainServer_port, 
					          parent.lang.param_subServer_ip, parent.lang.param_subServer_port],
					name : ['devIdno', 'phone', 'vehiIdno', 'mediaIp', 'mediaPort',
					        'mainSvrIp', 'mainSvrPort', 'subSvrIp', 'subSvrPort'],
					type:['input','input','input','input','input','input','input','input','input'],
					length:[40, 20, 40, 20, 10, 20, 10, 20, 10]
				}
			}
		]
	});
	//只有管理员才能修改
	if(!parent.myUserRole.isAdmin()) {
		$('#network-config input').get(0).disabled = true;
	}
	
	//输入框不能输入特殊字符
	$('#network-config input').each(function() {
		cleanSpelChar(this);
	});
}

//加载选择项
function loadComBoboxSelect(mid, name, param) {
	//加载之前先删除
	$(mid).empty();
	$('#select-'+ name).remove();
	$(mid).flexPanel({
		ComBoboxModel :{
			button :
			[
				[{
					display: '', name : name, pid : name, pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
				}]
			],
			combox: {name : name, option : param}
		}	
	});
}

//初始化编码设置页面参数
function initCodeParamPageParam() {
	//加载通道
	initDeviceChannelList();//设备通道
	loadComBoboxSelect('.td-channel', 'code-chn', arrayToStr(channelList));
	//选择通道刷新
	$('#select-code-chn li').on('click', function() {
		ajaxRefreshParamConfig();
	});
	$('#label-code-chn').text(channelList[0].name);
	$('#hidden-code-chn').val(channelList[0].id);
	//码流
	$('#label-stream').text(streamList[0].name);
	$('#hidden-stream').val(streamList[0].id);
	//加载录像开关
	$('#label-switch').text('');
	$('#hidden-switch').val('');
	//加载录像录像声音
	$('#label-sound').text('');
	$('#hidden-sound').val('');
	//加载分辨率
	$('#label-resolution').text('');
	$('#hidden-resolution').val('');
	//加载帧率
	$('#label-framerate').text('');
	$('#hidden-framerate').val('');
	//加载画质
	$('#label-quality').text('');
	$('#hidden-quality').val('');
}

//加载编码设置页面
function loadCodeParamPage() {
	$('#code-config').flexPanel({
		TableGroupModel :
		[	{
				title :{display: '',pid : '',hide:false,tabshide: false, headhide: true},
				colgroup:{width:['180px','400px']},
				tabs:{
					display: [parent.lang.alarm_channel, parent.lang.rule_streamType, parent.lang.param_video_switch, parent.lang.param_video_sound,
					          parent.lang.param_video_resolution, parent.lang.param_video_framerate, parent.lang.param_video_quality],
					name : ['channel', 'stream', 'switch', 'sound', 'resolution', 'framerate', 'quality']
				}
			}
		]
	});
	//加载码流
	initStreamList();
	loadComBoboxSelect('.td-stream', 'stream', arrayToStr(streamList));
	//选择码流类型刷新
	$('#select-stream').on('click', function() {
		ajaxRefreshParamConfig();
	});
	//加载录像开关
	initSwitchList();
	loadComBoboxSelect('.td-switch', 'switch', arrayToStr(switchList));
	//加载录像录像声音
	initSoundList();
	loadComBoboxSelect('.td-sound', 'sound', arrayToStr(soundList));
	//加载分辨率
	initResolutionList();
	loadComBoboxSelect('.td-resolution', 'resolution', arrayToStr(resolutionList));
	//加载帧率
	initFramerateList();
	loadComBoboxSelect('.td-framerate', 'framerate', arrayToStr(framerateList));
	//加载画质
	initQualityList();
	loadComBoboxSelect('.td-quality', 'quality', arrayToStr(qualityList));
	$('.td-quality').append('<div class="span-tip">'+ parent.lang.param_video_quality_tip +'</div>');
}

//初始化云台设置页面参数
function initPTZParamPageParam() {
	//加载通道
	loadComBoboxSelect('.td-channel-PTZ', 'ptz-chn', arrayToStr(channelList));
	//选择通道刷新
	$('#select-ptz-chn').on('click', function() {
		ajaxRefreshParamConfig();
	});
	$('#label-ptz-chn').text(channelList[0].name);
	$('#hidden-ptz-chn').val(channelList[0].id);
	//加载协议
//	$('#label-protocol').text(protocolList[0].name);
//	$('#hidden-protocol').val(protocolList[0].id);
	//加载波特率
//	$('#label-baud').text(baudList[0].name);
//	$('#hidden-baud').val(baudList[0].id);
	//加载数据位
//	$('#label-dataBit').text(dataBitList[0].name);
//	$('#hidden-dataBit').val(dataBitList[0].id);
	//加载停止位
//	$('#label-stopBit').text(stopBitList[0].name);
//	$('#hidden-stopBit').val(stopBitList[0].id);
	//加载校验位
//	$('#label-checksum').text(checksumList[0].name);
//	$('#hidden-checksum').val(checksumList[0].id);
	
	$('#input-address').val(0);
}

//加载云台设置页面
function loadPTZParamPage() {
	$('#PTZ-config').flexPanel({
		TableGroupModel :
		[	{
				title :{display: '',pid : '',hide:false,tabshide: false, headhide: true},
				colgroup:{width:['180px','400px']},
				tabs:{
					display: [parent.lang.alarm_channel, parent.lang.param_PTZ_protocol, parent.lang.param_PTZ_baud, parent.lang.param_PTZ_dataBit,
					          parent.lang.param_PTZ_stopBit, parent.lang.param_PTZ_checksum, parent.lang.param_PTZ_address],
					name : ['channel-PTZ', 'protocol', 'baud', 'dataBit', 'stopBit', 'checksum', 'address'],
					type:[, , , , , ,'input'],
					length:[ , , , , , , 2],
					tips:[, , , , , , parent.lang.param_PTZ_address_tip]
				}
			}
		]
	});
	//限制输入数字
	enterDigital('#input-address');
	//加载协议
	initProtocolList();
	loadComBoboxSelect('.td-protocol', 'protocol', arrayToStr(protocolList));
	//加载波特率
	initBaudList();
	loadComBoboxSelect('.td-baud', 'baud', arrayToStr(baudList));
	//加载数据位
	initDataBitList();
	loadComBoboxSelect('.td-dataBit', 'dataBit', arrayToStr(dataBitList));
	//加载停止位
	initStopBitList();
	loadComBoboxSelect('.td-stopBit', 'stopBit', arrayToStr(stopBitList));
	//加载校验位
	initChecksumList();
	loadComBoboxSelect('.td-checksum', 'checksum', arrayToStr(checksumList));
}

//添加 radio选项
function addRadio(name) {
	var content = '';
	content += '<input id="'+name+'-yes" name="'+name+'" type="radio" value="1"/>';
	content += '<label id="label-'+name+'-yes" for="'+name+'-yes">'+parent.lang.yes+'</label>';
	content += '<input id="'+name+'-no" name="'+name+'" type="radio" value="0" style="margin-left: 10px;" checked/>';
	content += '<label id="label-'+name+'-no" for="'+name+'-no">'+parent.lang.no+'</label>';
	return content;
}

//初始化停车超时页面参数
function initParkingParamPageParam() {
	//加载是否启用
	$("input[name='lowEnable']").get(1).checked = true;
	$("input[name='overEnable']").get(1).checked = true;
	$("input[name='timeEnable']").get(1).checked = true;
	//加载低速单位
	$('#label-lowUnit').text('');
	$('#hidden-lowUnit').val('');
	//加载超速单位
	$('#label-overUnit').text('');
	$('#hidden-overUnit').val('');
	
	$('#input-lowSpeed').val('');
	$('#input-overSpeed').val('');
	$('#input-timeSecond').val('');
}

//加载停车超时页面
function loadParkingParamPage() {
	$('#parking-config').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.alarm_type_low_speed,pid : 'lowSpeedTitle',hide:false,tabshide: false, headhide: false},
				colgroup:{width:['180px','400px']},
				tabs:{
					display: [parent.lang.isEnable , parent.lang.param_park_unit, parent.lang.param_park_lowSpeed],
					name : ['lowEnable', 'lowUnit', 'lowSpeed'],
					type:[ , , 'input'],
					length:[ ,  , 3],
					tips:[ , , parent.lang.param_park_speed_tip]
				}
			},
			{
				title :{display: parent.lang.alarm_type_overspeed,pid : 'overSpeedTitle',hide:false,tabshide: false, headhide: false},
				colgroup:{width:['180px','400px']},
				tabs:{
					display: [parent.lang.isEnable , parent.lang.param_park_unit, parent.lang.param_park_overSpeed],
					name : ['overEnable', 'overUnit', 'overSpeed'],
					type:[ , , 'input'],
					length:[ ,  , 3],
					tips:[ , , parent.lang.param_park_speed_tip]
				}
			},
			{
				title :{display: parent.lang.param_park_timeoutAlarm,pid : 'timeoutTitle',hide:false,tabshide: false, headhide: false},
				colgroup:{width:['180px','400px']},
				tabs:{
					display: [parent.lang.isEnable , parent.lang.param_park_unit, parent.lang.param_park_time],
					name : ['timeEnable', 'timeUnit', 'timeSecond'],
					type:[ , , 'input'],
					length:[ ,  , 2],
					tips:[ , , parent.lang.param_park_time_tip]
				}
			}
		]
	});
	
	//限制输入数字
	enterDigital('#input-lowSpeed');
	enterDigital('#input-overSpeed');
	enterDigital('#input-timeSecond');
	//加载是否启用
	$('.td-lowEnable').prepend(addRadio('lowEnable'));
	$('.td-overEnable').prepend(addRadio('overEnable'));
	$('.td-timeEnable').prepend(addRadio('timeEnable'));
	initSpeedUnitList();
	//加载低速单位
	loadComBoboxSelect('.td-lowUnit', 'lowUnit', arrayToStr(speedUnitList));
	//加载超速单位
	loadComBoboxSelect('.td-overUnit', 'overUnit', arrayToStr(speedUnitList));
	//加载超时单位
	loadComBoboxSelect('.td-timeUnit', 'timeUnit', '0&'+parent.lang.second);
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
		height: 125
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
		if(row.type == 1) {
			ret = parent.lang.param_code_set;
		}else if(row.type == 2) {
			ret = parent.lang.param_PTZ_set;
		}else if(row.type == 3) {
			ret = parent.lang.param_parking_set;
		}else {
			ret = parent.lang.param_network_set;
		}
	}    
	return getColumnTitle(ret);
}

//判断是否为空，为空返回true
function isNull(mid) {
	if($.trim($(mid).val())) {
		return false;
	}
	return true;
}

//判断网络设置参数是否合法
function checkNetworkConfigParam() {
	//只有管理员才能修改
	if(!parent.myUserRole.isAdmin()) {
		$.dialog.tips(parent.lang.errNoPrivilige, 1);
		return false;
	}
	if(isNull('#input-devIdno')) {
		$('#input-devIdno').focus();
		$.dialog.tips(parent.lang.not_be_empty, 1);
		return false;
	}
	if(isNull('#input-phone')) {
		$('#input-phone').focus();
		$.dialog.tips(parent.lang.not_be_empty, 1);
		return false;
	}
	if(isNull('#input-vehiIdno')) {
		$('#input-vehiIdno').focus();
		$.dialog.tips(parent.lang.not_be_empty, 1);
		return false;
	}
	if(isNull('#input-mediaIp')) {
		$('#input-mediaIp').focus();
		$.dialog.tips(parent.lang.not_be_empty, 1);
		return false;
	}
	if(isNull('#input-mediaPort')) {
		$('#input-mediaPort').focus();
		$.dialog.tips(parent.lang.not_be_empty, 1);
		return false;
	}
	return true;
}

//判断编码设置参数是否合法
function checkCodeConfigParam() {
	if(isNull('#hidden-switch')) {
		$('#label-switch').click();
		$.dialog.tips(parent.lang.not_be_empty, 1);
		return false;
	}
	if(isNull('#hidden-sound')) {
		$('#label-sound').click();
		$.dialog.tips(parent.lang.not_be_empty, 1);
		return false;
	}
	if(isNull('#hidden-resolution')) {
		$('#label-resolution').click();
		$.dialog.tips(parent.lang.not_be_empty, 1);
		return false;
	}
	if(isNull('#hidden-framerate')) {
		$('#label-framerate').click();
		$.dialog.tips(parent.lang.not_be_empty, 1);
		return false;
	}
	if(isNull('#hidden-quality')) {
		$('#label-quality').click();
		$.dialog.tips(parent.lang.not_be_empty, 1);
		return false;
	}
	return true;
}

//判断云台设置参数是否合法
function checkPTZConfigParam() {
	if(isNull('#input-address')) {
		$('#input-address').focus();
		$.dialog.tips(parent.lang.not_be_empty, 1);
		return false;
	}
	if($.trim($('#input-address').val()) > 99) {
		$('#input-address').focus();
		$.dialog.tips(parent.lang.monitor_damage_errorValue, 1);
		return false;
	}
	return true;
}

//判断停车超时参数是否合法
function checkParkConfigParam() {
	var value = $("input[name='lowEnable']:checked").val();
	if(value != null && value != '' && value == 1) {
		if(isNull('#hidden-lowUnit')) {
			$('#label-lowUnit').click();
			$.dialog.tips(parent.lang.not_be_empty, 1);
			return false;
		}
		if(isNull('#input-lowSpeed')) {
			$('#input-lowSpeed').focus();
			$.dialog.tips(parent.lang.not_be_empty, 1);
			return false;
		}
		if($.trim($('#input-lowSpeed').val()) > 200) {
			$('#input-lowSpeed').focus();
			$.dialog.tips(parent.lang.monitor_damage_errorValue, 1);
			return false;
		}
	}
	value = $("input[name='overEnable']:checked").val();
	if(value != null && value != '' && value == 1) {
		if(isNull('#hidden-overUnit')) {
			$('#label-overUnit').click();
			$.dialog.tips(parent.lang.not_be_empty, 1);
			return false;
		}
		if(isNull('#input-overSpeed')) {
			$('#input-overSpeed').focus();
			$.dialog.tips(parent.lang.not_be_empty, 1);
			return false;
		}
		if($.trim($('#input-overSpeed').val()) > 200) {
			$('#input-overSpeed').focus();
			$.dialog.tips(parent.lang.monitor_damage_errorValue, 1);
			return false;
		}
	}
	value = $("input[name='timeEnable']:checked").val();
	if(value != null && value != '' && value == 1) {
		if(isNull('#hidden-timeUnit')) {
			$('#label-timeUnit').click();
			$.dialog.tips(parent.lang.not_be_empty, 1);
			return false;
		}
		if(isNull('#input-timeSecond')) {
			$('#input-timeSecond').focus();
			$.dialog.tips(parent.lang.not_be_empty, 1);
			return false;
		}
		if($.trim($('#input-timeSecond').val()) > 200) {
			$('#input-timeSecond').focus();
			$.dialog.tips(parent.lang.monitor_damage_errorValue, 1);
			return false;
		}
	}
	return true;
}

//判断参数是否合法
function checkConfigParam() {
	if(infoType == 0) {//网络设置
		return checkNetworkConfigParam();
	}else if(infoType == 1) {//编码设置
		return checkCodeConfigParam();
	}else if(infoType == 2) {//云台设置
		return checkPTZConfigParam();
	}else if(infoType == 3) {//停车超时
		return checkParkConfigParam();
	}
	return false;
}

//获取网络设置参数
function getNetworkConfigParam() {
	var data = {};
//	data.devIdno = $.trim($('#input-devIdno').val());
	data.Type = 'NETWORK_SET';
	data.Action = 'set';
	data.DevPhone = $.trim($('#input-phone').val());
	data.DevPlate = $.trim($('#input-vehiIdno').val());
	data.CenterIP_0 = $.trim($('#input-mediaIp').val());
	data.ContrlPort_0 = $.trim($('#input-mediaPort').val());
	data.CenterIP_1 = $.trim($('#input-mainSvrIp').val());
	data.ContrlPort_1 = $.trim($('#input-mainSvrPort').val());
	data.CenterIP_2 = $.trim($('#input-subSvrIp').val());
	data.ContrlPort_2 = $.trim($('#input-subSvrPort').val());
	return data;
}

//获取编码设置参数
function getCodeConfigParam() {
	var data = {};
	data.Type = 'CHANNEL_SET';
	data.Action = 'set';
	data.ChannelId = $.trim($('#hidden-code-chn').val());
	data.StreamType = $.trim($('#hidden-stream').val());
	data.IsRec = $.trim($('#hidden-switch').val());
	data.HaveAudio = $.trim($('#hidden-sound').val());
	data.Resolution = $.trim($('#hidden-resolution').val());
	data.FrameRate = $.trim($('#hidden-framerate').val());
	data.Quality = $.trim($('#hidden-quality').val());
	return data;
}

//获取云台设置参数
function getPTZConfigParam() {
	var data = {};
	data.Type = 'PTZ_SET';
	data.Action = 'set';
	data.Channel = $.trim($('#hidden-ptz-chn').val());
	data.Protocol = $.trim($('#hidden-protocol').val());
	data.Baudrate = $.trim($('#hidden-baud').val());
	data.Databit = $.trim($('#hidden-dataBit').val());
	data.Stopbit = $.trim($('#hidden-stopBit').val());
	data.Check = $.trim($('#hidden-checksum').val());
	data.EtNum = $.trim($('#input-address').val());
	return data;
}

//获取停车超时参数
function getParkConfigParam() {
	var data = {};
	data.Type = 'SPEEDALARM_SET';
	data.Action = 'set';
	data.LowSpeedIsEnable = $("input[name='lowEnable']:checked").val();
//	if(data.LowSpeedIsEnable != null && data.LowSpeedIsEnable != '' && data.LowSpeedIsEnable == 1) {
		data.LowSpeedUnit = $.trim($('#hidden-lowUnit').val());
		data.LowSpeed = $.trim($('#input-lowSpeed').val());
//	}
	data.OverSpeedIsEnable = $("input[name='overEnable']:checked").val();
//	if(data.OverSpeedIsEnable != null && data.OverSpeedIsEnable != '' && data.OverSpeedIsEnable == 1) {
		data.OverSpeedUnit = $.trim($('#hidden-overUnit').val());
		data.OverSpeed = $.trim($('#input-overSpeed').val());
//	}
	data.PeakingIsEnable = $("input[name='timeEnable']:checked").val();
//	if(data.PeakingIsEnable != null && data.PeakingIsEnable != '' && data.PeakingIsEnable == 1) {
		data.TimeUnit = $.trim($('#hidden-timeUnit').val());
		data.OverTime = $.trim($('#input-timeSecond').val());
//	}
	return data;
}

//获取设置参数
function getConfigParam() {
	if(infoType == 0) {//网络设置
		return getNetworkConfigParam();
	}else if(infoType == 1) {//编码设置
		return getCodeConfigParam();
	}else if(infoType == 2) {//云台设置
		return getPTZConfigParam();
	}else if(infoType == 3) {//停车超时
		return getParkConfigParam();
	}
	return null;
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
	//判断参数是否合法
	if(!checkConfigParam()) {
		return;
	}
	var param = getConfigParam();
	var index = $('#configListTable tr').length;
	var rows = [];
	for (var i = 0; i < vehiIdnoList.length; i++) {
		var info = {};
		info.id = index + i;
		info.idno = vehiIdnoList[i];
		info.time = dateFormat2TimeString(new Date());
		info.status = parent.lang.monitor_setting;
		info.type = infoType;
		rows.push(info);
		
		var data = {};
		data.id = index + i;
		data.vid =  vehiIdnoList[i];
		loadVehicleInfo(data, param);
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
	retData.Type = data.Type;
	retData.Action = data.Action;
	if(infoType == 0) {//网络设置
		retData.DevPhone = data.DevPhone;
		retData.DevPlate = data.DevPlate;
		retData.CenterIP_0 = data.CenterIP_0;
		retData.ContrlPort_0 = data.ContrlPort_0;
		retData.CenterIP_1 = data.CenterIP_1;
		retData.ContrlPort_1 = data.ContrlPort_1;
		retData.CenterIP_2 = data.CenterIP_2;
		retData.ContrlPort_2 = data.ContrlPort_2;
	}else if(infoType == 1) {//编码设置
		retData.ChannelId = data.ChannelId;
		retData.StreamType = data.StreamType;
		retData.IsRec = data.IsRec;
		retData.HaveAudio = data.HaveAudio;
		retData.Resolution = data.Resolution;
		retData.FrameRate = data.FrameRate;
		retData.Quality = data.Quality;
	}else if(infoType == 2) {//云台设置
		retData.Channel = data.Channel;
		retData.Protocol = data.Protocol;
		retData.Baudrate = data.Baudrate;
		retData.Databit = data.Databit;
		retData.Stopbit = data.Stopbit;
		retData.Check = data.Check;
		retData.EtNum = data.EtNum;
	}else if(infoType == 3) {//停车超时
		retData.LowSpeedIsEnable = data.LowSpeedIsEnable;
		retData.LowSpeedUnit = data.LowSpeedUnit;
		retData.LowSpeed = data.LowSpeed;
		retData.OverSpeedIsEnable = data.OverSpeedIsEnable;
		retData.OverSpeedUnit = data.OverSpeedUnit;
		retData.OverSpeed = data.OverSpeed;
		retData.PeakingIsEnable = data.PeakingIsEnable;
		retData.TimeUnit = data.TimeUnit;
		retData.OverTime = data.OverTime;
	}
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
					if(vehicle.getDevList()[i].isOnline() && vehicle.getDevList()[i].isCanTtxParamConfig()){
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
				var action = "http://"+ userServer.ip +":"+ userServer.port +"/2/74/callback=getData?Command=517&DevIDNO="+ setVehicle.did;
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

//获取刷新网络设置参数
function getRefreshNetworkConfigParam() {
	var data = {};
//	data.devIdno = $.trim($('#input-devIdno').val());
	data.Type = 'NETWORK_SET';
	data.Action = 'get';
	data.DevPhone = '?';
	data.DevPlate = '?';
	data.CenterIP_0 = '?';
	data.ContrlPort_0 = '?';
	data.CenterIP_1 = '?';
	data.ContrlPort_1 = '?';
	data.CenterIP_2 = '?';
	data.ContrlPort_2 = '?';
	return data;
}

//获取刷新编码设置参数
function getRefreshCodeConfigParam() {
	var data = {};
	data.Type = 'CHANNEL_SET';
	data.Action = 'get';
	data.ChannelId = $.trim($('#hidden-code-chn').val());
	data.StreamType = $.trim($('#hidden-stream').val());
	data.IsRec = '?';
	data.HaveAudio = '?';
	data.Resolution = '?';
	data.FrameRate = '?';
	data.Quality = '?';
	return data;
}

//获取刷新云台设置参数
function getRefreshPTZConfigParam() {
	var data = {};
	data.Type = 'PTZ_SET';
	data.Action = 'get';
	data.Channel = $.trim($('#hidden-ptz-chn').val());
	data.Protocol = '?';
	data.Baudrate = '?';
	data.Databit = '?';
	data.Stopbit = '?';
	data.Check = '?';
	data.EtNum = '?';
	return data;
}

//获取刷新停车超时参数
function getRefreshParkConfigParam() {
	var data = {};
	data.Type = 'SPEEDALARM_SET';
	data.Action = 'get';
	data.LowSpeedIsEnable = '?';
	data.LowSpeedUnit = '?';
	data.LowSpeed = '?';
	data.OverSpeedIsEnable = '?';
	data.OverSpeedUnit = '?';
	data.OverSpeed = '?';
	data.PeakingIsEnable = '?';
	data.TimeUnit = '?';
	data.OverTime = '?';
	return data;
}

//获取刷新参数
function getRefreshConfigParam() {
	if(infoType == 0) {//网络设置
		return getRefreshNetworkConfigParam();
	}else if(infoType == 1) {//编码设置
		return getRefreshCodeConfigParam();
	}else if(infoType == 2) {//云台设置
		return getRefreshPTZConfigParam();
	}else if(infoType == 3) {//停车超时
		return getRefreshParkConfigParam();
	}
	return null;
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
	var action = "http://"+ userServer.ip +":"+ userServer.port +"/2/74/callback=getData?Command=517&DevIDNO="+ devIdno;
	action += '&jsession='+GetCookie("JSESSIONID");
	var data = getRefreshConfigParam();
	ajaxRefreshObject = $.ajax({
		type : "get",  
		url : action,
		timeout: 60000,
		data : data,
      	dataType: "jsonp",
      	success : getData = function(json){
      		$.myajax.showLoading(false);
      		disableForm(false);
      		if(json.result == 0){
      			if(infoType == 0) {
      				isLoadNetworkSuc = true;
      			}else if(infoType == 1) {
      				isLoadCodeSuc = true;
      			}else if(infoType == 2) {
      				isLoadPTZSuc = true;
      			}else if(infoType == 3) {
      				idLoadParkSuc = true;
      			}
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
		if(infoType == 0) {//网络设置
//			if(data.DevIDNO) {
				$('#input-devIdno').val(devIdno);
//			}
			if(data.DevPhone) {
				$('#input-phone').val(data.DevPhone);
			}
			if(data.DevPlate) {
				$('#input-vehiIdno').val(data.DevPlate);
			}
			if(data.CenterIP_0) {
				$('#input-mediaIp').val(data.CenterIP_0);
			}
			if(data.ContrlPort_0) {
				$('#input-mediaPort').val(data.ContrlPort_0);
			}
			if(data.CenterIP_1) {
				$('#input-mainSvrIp').val(data.CenterIP_1);
			}
			if(data.ContrlPort_1) {
				$('#input-mainSvrPort').val(data.ContrlPort_1);
			}
			if(data.CenterIP_2) {
				$('#input-subSvrIp').val(data.CenterIP_2);
			}
			if(data.ContrlPort_2) {
				$('#input-subSvrPort').val(data.ContrlPort_2);
			}
		}else if(infoType == 1) {//编码设置
			if(typeof data.ChannelId != 'undefined') {//通道
				$('#label-code-chn').text(getArrayName(channelList, data.ChannelId));
				$('#hidden-code-chn').val(data.ChannelId);
			}
			if(typeof data.StreamType != 'undefined') {//码流
				$('#label-stream').text(getArrayName(streamList, data.StreamType));
				$('#hidden-stream').val(data.StreamType);
			}
			if(typeof data.IsRec != 'undefined') {//录像开关
				$('#label-switch').text(getArrayName(switchList, data.IsRec));
				$('#hidden-switch').val(data.IsRec);
			}
			if(typeof data.HaveAudio != 'undefined') {//录像声音
				$('#label-sound').text(getArrayName(soundList, data.HaveAudio));
				$('#hidden-sound').val(data.HaveAudio);
			}
			if(typeof data.Resolution != 'undefined') {//分辨率
				$('#label-resolution').text(getArrayName(resolutionList, data.Resolution));
				$('#hidden-resolution').val(data.Resolution);
			}
			if(typeof data.FrameRate != 'undefined') {//帧率
				$('#label-framerate').text(getArrayName(framerateList, data.FrameRate));
				$('#hidden-framerate').val(data.FrameRate);
			}
			if(typeof data.Quality != 'undefined') {//帧率
				$('#label-quality').text(getArrayName(qualityList, data.Quality));
				$('#hidden-quality').val(data.Quality);
			}
		}else if(infoType == 2) {//云台设置
			if(typeof data.Channel != 'undefined') {//通道
				$('#label-ptz-chn').text(getArrayName(channelList, data.Channel));
				$('#hidden-ptz-chn').val(data.Channel);
			}
			if(typeof data.Protocol != 'undefined') {//协议
				$('#label-protocol').text(getArrayName(protocolList, data.Protocol));
				$('#hidden-protocol').val(data.Protocol);
			}
			if(typeof data.Baudrate != 'undefined') {//波特率
				$('#label-baud').text(getArrayName(baudList, data.Baudrate));
				$('#hidden-baud').val(data.Baudrate);
			}
			if(typeof data.Databit != 'undefined') {//数据位
				$('#label-dataBit').text(getArrayName(dataBitList, data.Databit));
				$('#hidden-dataBit').val(data.Databit);
			}
			if(typeof data.Stopbit != 'undefined') {//停止位
				$('#label-stopBit').text(getArrayName(stopBitList, data.Stopbit));
				$('#hidden-stopBit').val(data.Stopbit);
			}
			if(typeof data.Check != 'undefined') {//校验位
				$('#label-checksum').text(getArrayName(checksumList, data.Check));
				$('#hidden-checksum').val(data.Check);
			}
			if(data.EtNum) {
				$('#input-address').val(data.EtNum);
			}
		}else if(infoType == 3) {//停车超时
			if(data.LowSpeedIsEnable && data.LowSpeedIsEnable == 1) {//启用
				$("input[name='lowEnable']").get(0).checked = true;
			}
			if(typeof data.LowSpeedUnit != 'undefined') {//低速单位
				$('#label-lowUnit').text(getArrayName(speedUnitList, data.LowSpeedUnit));
				$('#hidden-lowUnit').val(data.LowSpeedUnit);
			}
			if(data.LowSpeed) {
				$('#input-lowSpeed').val(data.LowSpeed);
			}
			if(data.OverSpeedIsEnable && data.OverSpeedIsEnable == 1) {//启用
				$("input[name='overEnable']").get(0).checked = true;
			}
			if(typeof data.OverSpeedUnit != 'undefined') {//超速单位
				$('#label-overUnit').text(getArrayName(speedUnitList, data.OverSpeedUnit));
				$('#hidden-overUnit').val(data.OverSpeedUnit);
			}
			if(data.OverSpeed) {
				$('#input-overSpeed').val(data.OverSpeed);
			}
			if(data.PeakingIsEnable && data.PeakingIsEnable == 1) {//启用
				$("input[name='timeEnable']").get(0).checked = true;
			}
			if(typeof data.TimeUnit != 'undefined') {//时间单位
				$('#label-timeUnit').text(parent.lang.second);
				$('#hidden-timeUnit').val(data.TimeUnit);
			}
			if(data.OverTime) {
				$('#input-timeSecond').val(data.OverTime);
			}
		}
	}
}

//保存到其他设备
function ajaxSaveParamConfigToOther() {
	$.dialog({id:'configToOther', title: parent.lang.save_to_other, content: 'url:LocationManagement/deviceParamConfigToOther.html?type=ttx',
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
		//屏蔽所有下拉框
		$('.ui-menu').hide();
		initNetworkParamPageParam(); //网络设置参数
		initCodeParamPageParam(); //编码设置参数
		initPTZParamPageParam(); //云台设置参数
		initParkingParamPageParam(); //停车超时参数
		//刷新参数配置信息
		ajaxRefreshParamConfig();
	}
}

//加载设备通道列表
function initDeviceChannelList() {
	channelList = [];
	var device = parent.vehicleManager.getDevice(devIdno.toString());
	if(device) {
		var chnNames = [];
		if(device.getChnName()) {
			chnNames = device.getChnName().split(',');
		}
		var chnCount = device.getChnCount();
		if(chnCount == 0) {
			chnCount = 1;
		}
		for (var i = 0; i < chnCount; i++) {
			if(chnNames.length > i) {
				channelList.push({id: i, name: chnNames[i]});
			}else {
				channelList.push({id: i, name: 'CH'+ (i + 1)});
			}
		}
	}else {
		channelList.push({id: 0, name: 'CH1'});
	}
}

//初始化码流类型列表
function initStreamList() {
	streamList = [];
	streamList.push({id: 0,name: parent.lang.rule_streamMain});
	streamList.push({id: 1,name: parent.lang.rule_streamSub});
}

//初始化录像开关类型
function initSwitchList() {
	switchList = [];
	switchList.push({id: 0,name: parent.lang.param_video_close});
	switchList.push({id: 1,name: parent.lang.param_video_open});
}

//初始化录像声音类型
function initSoundList() {
	soundList = [];
	soundList.push({id: 0,name: parent.lang.param_video_notContain});
	soundList.push({id: 1,name: parent.lang.param_video_contain});
}

//初始化分辨率类型
function initResolutionList() {
	resolutionList = [];
	resolutionList.push({id: 0,name: 'D1'});
	resolutionList.push({id: 1,name: 'HD1'});
	resolutionList.push({id: 2,name: 'CIF'});
}

//初始化帧率类型
function initFramerateList() {
	framerateList = [];
	for (var i = 1; i < 26; i++) {
		framerateList.push({id: i,name: i});
	}
}

//初始化画质类型
function initQualityList() {
	qualityList = [];
	for (var i = 1; i < 9; i++) {
		qualityList.push({id: i-1,name: i});
	}
}

//初始化协议类型
function initProtocolList() {
	protocolList = [];
	protocolList.push({id: 0,name: 'PELCO-D'});
	protocolList.push({id: 1,name: 'PELCO-P'});
}

//初始化波特率类型
function initBaudList() {
	baudList = [];
	baudList.push({id: 0,name: '1200'});
	baudList.push({id: 1,name: '2400'});
	baudList.push({id: 2,name: '4800'});
	baudList.push({id: 3,name: '9600'});
}

//初始化数据位类型
function initDataBitList() {
	dataBitList = [];
	for (var i = 5; i < 9; i++) {
		dataBitList.push({id: i,name: i});
	}
}

//初始化停止位类型
function initStopBitList() {
	stopBitList = [];
	stopBitList.push({id: 1,name: 1});
	stopBitList.push({id: 2,name: 2});
}

//初始化校验位类型
function initChecksumList() {
	checksumList = [];
	checksumList.push({id: 0,name: 'None'});
	checksumList.push({id: 1,name: 'Odd'});
	checksumList.push({id: 2,name: 'Even'});
	checksumList.push({id: 3,name: 'Mark'});
	checksumList.push({id: 4,name: 'Space'});
}

//初始化速度单位
function initSpeedUnitList() {
	speedUnitList = [];
	speedUnitList.push({id: 0,name: parent.lang.KmPerHour});
	speedUnitList.push({id: 1,name: parent.lang.MilePerHour});
	speedUnitList.push({id: 2,name: parent.lang.NauticalPerHour});
}