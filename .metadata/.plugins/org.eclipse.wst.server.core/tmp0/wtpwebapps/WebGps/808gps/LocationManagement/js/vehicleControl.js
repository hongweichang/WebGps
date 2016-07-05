var api = frameElement.api, W = api.opener;
var vehiIdno = decodeURIComponent(getUrlParameter('vehiIdno'));//车牌号
var userServer = W.userServer; //用户服务器
var deviceNumber = 1;//设备数目
var chnNumber = 0;//通道数目

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

function loadPage() {
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	
	//加载页面控件
	loadPageTable();
	
	//加载控制类型和设备类型
	initPageInfo(vehiIdno);
	
	//限制用户名和密码不能输入特殊字符
	cleanChar('.input-userName');
	cleanChar('.password-password');
	
	//切换设备事件
	$('.td-deviceType input').on('click', switchDeviceEvent);
	//发送
	$('.btnSend').on('click', ajaxSendVehicleControl);
	//退出
	$('.btnExit').on('click', function() {
		W.monitorMenu.vehicleControlObj = null;
		W.$.dialog({id:'vehicleControl'}).close();
	});
}

//加载页面控件
function loadPageTable() {
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: '',pid : 'flowUseStatus',tip: '',hide:false,tabshide: false, headhide: true},
				colgroup:{width:['120px','320px']},
				tabs:{
					display: [parent.lang.device_type, parent.lang.monitor_vehicleControlType, parent.lang.other,
					          parent.lang.website_accountPlaceholder, parent.lang.login_Password],
					name : ['deviceType', 'controlType', 'otherParam', 'userName', 'password'],
					type:['','','','input','password'],
					length:[,,,40,40]
				}
			}
		]
	});
	$('.td-otherParam').parent().hide();
	$('.td-deviceType').prepend(addRadio('deviceType', false));
	
	$('#vehicleControlTip span').text(parent.lang.monitor_control_tip);
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.monitor_send, name : '', pclass : 'btnSend',
				bgcolor : 'gray', hide : false}],
			[{display: parent.lang.close, name : '', pclass : 'btnExit',
				bgcolor : 'gray', hide : false}]
		]
	});
}

function switchDeviceEvent() {
	var temp = $.trim($("input[name='deviceType']:checked").val());
	var videoType = $.trim($('#hidden-controlType-video').val());
	//选择视频设备
	if (temp != "1") {
		$('#label-controlType-gps').parent().parent().parent().hide();
		$('#label-controlType-video').parent().show();
		$('#label-controlType-video').parent().parent().parent().show();
		if(videoType != '9' && videoType != '10' && videoType != '14') {
			$('.td-otherParam').parent().hide();
		}else {
			$('.td-otherParam').parent().show();
		}
	} else {
		$('#label-controlType-video').parent().parent().parent().hide();
		$('#label-controlType-gps').parent().show();
		$('#label-controlType-gps').parent().parent().parent().show();
		$('.td-otherParam').parent().hide();
	}
}

//添加 radio选项
function addRadio(name, disabled) {
	var content = '';
	var disabledStr = '';
	if(disabled) {
		disabledStr = "disabled";
	}
	content += '<input id="'+name+'-gps" name="'+name+'" type="radio" value="1" checked '+disabledStr+'/>';
	content += '<label id="label-'+name+'-gps" for="'+name+'-gps">'+parent.lang.monitor_gpsDevice+'</label>';
	content += '<input id="'+name+'-video" name="'+name+'" type="radio" value="0" style="margin-left: 10px;" '+disabledStr+'/>';
	content += '<label id="label-'+name+'-video" for="'+name+'-video">'+parent.lang.monitor_videoDevice+'</label>';
	return content;
}

//添加通道
function addChnModule(name, count) {
	var content = '';
	if(name == 'disk') {
		content += '<div class="module '+name+'">';
		content += '<input id="'+name+'0" name="'+name+'" type="radio" value="0" checked />';
		content += '<label for="'+name+'0">'+parent.lang.monitor_disk1+'</label>';
		content += '</div>';
		content += '<div class="module '+name+'">';
		content += '<input id="'+name+'1" name="'+name+'" type="radio" value="1"/>';
		content += '<label for="'+name+'1">'+parent.lang.monitor_disk2+'</label>';
		content += '</div>';
	}else {
		for(var i = 0; i < count - 1; i++) {
			content += '<div class="module '+name+'">';
			if(i == 0) {
				content += '<input id="'+name+i+'" name="'+name+'" type="radio" value="'+i+'" checked/>';
			}else {
				content += '<input id="'+name+i+'" name="'+name+'" type="radio" value="'+i+'"/>';
			}
			content += '<label for="'+name+i+'">CH'+(i+1)+'</label>';
			content += '</div>';
		}
		content += '<div class="module '+name+'">';
		content += '<input id="'+name+i+'" name="'+name+'" type="radio" value="98"/>';
		content += '<label for="'+name+i+'">'+ parent.lang.all +'</label>';
		content += '</div>';
	}
	return content;
}

/**
 * 获取设备控制菜单选项
 * @param device 设备
 * @returns {Array}
 */
function getControlItems(device) {
	var controlItems = [];
	//支持油路控制
	if(device.isOilControlSupport()) {
		controlItems.push({id: 1, name: parent.lang.monitor_disconnectFuel});//断开油路
		controlItems.push({id: 2, name: parent.lang.monitor_connectFuel});//恢复油路
	}
	//支持电路控制
	if(device.isElecControlSupport()) {
		controlItems.push({id: 3, name: parent.lang.monitor_turnOffPower});//关闭电源
		controlItems.push({id: 4, name: parent.lang.monitor_turnOnPower});//打开电源
	}
	//厂家为忆志的设备不判断协议
	if(device.isESTFactoryType()) {
		controlItems.push({id: 5, name: parent.lang.monitor_restart});//重启设备
		controlItems.push({id: 7, name: parent.lang.monitor_sleep});//休眠
		controlItems.push({id: 8, name: parent.lang.monitor_wake});//唤醒
		//视频设备
		if(device.isVideoDevice()) {
			controlItems.push({id: 9, name: parent.lang.monitor_openRecording});//开启设备录像
			controlItems.push({id: 10, name: parent.lang.monitor_stopRecording});//关闭设备录像
		}
	}else {
		//如果不是808协议
		if(!device.isJT808Protocol()) {
			controlItems.push({id: 5, name: parent.lang.monitor_restart});//重启设备
			controlItems.push({id: 6, name: parent.lang.monitor_restoreFactorySettings});//恢复出厂设置
			controlItems.push({id: 15, name: parent.lang.monitor_mileageClear});//里程清零
			controlItems.push({id: 18, name: parent.lang.monitor_clearAlarm});//清除报警
			//视频设备是否有格式化硬盘的权限
			if(device.isVideoDevice() && device.isFormattingHardDisk()) {
				controlItems.push({id: 14, name: parent.lang.monitor_formatting_hardDisk});//格式化硬盘
			}
		}
	}
	return controlItems;
}

function addselItemEvent(selMenuId) {
	$(selMenuId).each(function() {
		$(this).on('click',function() {
			var type = $.trim($(this).attr('data-index'));
			if(type == '9' || type == '10') {//开启设备录像//关闭设备录像
				$('.td-otherParam').parent().show();
				$('.td-otherParam').parent().find('th').text(parent.lang.alarm_channel);
				$('.td-otherParam').empty();
				$('.td-otherParam').append(addChnModule('chn', chnNumber+1));
			}else if(type == '14') {//格式化硬盘
				$('.td-otherParam').parent().show();
				$('.td-otherParam').parent().find('th').text(parent.lang.harddisk);
				$('.td-otherParam').empty();
				$('.td-otherParam').append(addChnModule('disk',2));
			}else {
				$('.td-otherParam').parent().hide();
			}
		});
	});
}

//加载控制类型
function initPageInfo(vehiIdno_) {
	//清除控制菜单
	clearMenu();
	vehiIdno = vehiIdno_;
	var vehicle = parent.vehicleManager.getVehicle(vehiIdno.toString());
	if(vehicle == null) {
		return;
	}
	//设备数目
	deviceNumber = vehicle.getDevList().length;
	$('.td-otherParam').parent().hide();
	//判断设备协议和厂家
	if(deviceNumber == 1) {//车辆只有一个设备
		$('.td-deviceType').parent().hide();
		var device = vehicle.getDevList()[0];
		var controlItems = getControlItems(device);
		buildMenu(controlItems, 'controlType');
		if(device.isVideoDevice()) {
			chnNumber = device.getChnCount();
			if(chnNumber == 0) {
				chnNumber = 1;
			}
			addselItemEvent('#select-controlType li');
		}
	}else {//车辆有两个设备
		$('.td-deviceType').parent().show();
		var videoDevice = vehicle.getVideoDevice();
		var controlItems_video = getControlItems(videoDevice);//视频设备
		var controlItems_gps = getControlItems(vehicle.getGpsDevice());//gps设备
		buildMenu(controlItems_gps, 'controlType-gps');
		buildMenu(controlItems_video, 'controlType-video');
		chnNumber = videoDevice.getChnCount();
		if(chnNumber == 0) {
			chnNumber = 1;
		}
		addselItemEvent('#select-controlType-video li');
	}
	if(parent.account) {
		diableInput('.input-userName', true, true);
		$('.input-userName').val(parent.account);
		$('.password-password').focus();
	}
}

/**
 * 生成控制菜单
 * @param controlItems 菜单集合
 * @param menuId 
 */
function buildMenu(controlItems, menuId) {
	var hide = false;
	if(menuId == 'controlType-video') {
		hide = true;
	}
	$('.td-controlType').flexPanel({
		ComBoboxModel :{
			button :
			[
				[{
					display: parent.lang.monitor_selVehicleControlType, name : menuId, pid : menuId, pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : hide,hidden: true
				}]
			],
			combox: {name : menuId, option : arrayToStr(controlItems)}
		}	
	});
}

//清除控制菜单
function clearMenu() {
	$('.td-controlType').empty();
	$('#select-controlType').remove();
	$('#select-controlType-gps').remove();
	$('#select-controlType-video').remove();
}

//获取发送类型代码
function getCtrlType() {
	var type = {};
	if(deviceNumber == 1) {
		type.id = $.trim($('#hidden-controlType').val());
		type.name = $.trim($('#label-controlType').text());
	}else {
		var temp = $("input[name='deviceType']:checked").val();
		if (temp != "1") {//视频设备
			type.id = $.trim($('#hidden-controlType-video').val());
			type.name = $.trim($('#label-controlType-video').text());
		}else {//gps设备
			type.id = $.trim($('#hidden-controlType-gps').val());
			type.name = $.trim($('#label-controlType-gps').text());
		}
	}
	return type;
}

var ajaxObject = null;//发送请求对象
//发送控制指令
function ajaxSendVehicleControl() {
	var vehicle = parent.vehicleManager.getVehicle(vehiIdno.toString());
	if(vehicle == null) {
		return;
	}
	var device = null;
	if(deviceNumber == 1) {
		device = vehicle.getDevList()[0];
	}else {
		var temp = $("input[name='deviceType']:checked").val();
		if (temp != "1") {//视频设备
			device = vehicle.getVideoDevice();
		}else {//gps设备
			device = vehicle.getGpsDevice();
		}
	}
	if(device == null) {
		return;
	}
	var typeObj = getCtrlType();
	if(typeObj.id == '') {
		$.dialog.tips(parent.lang.monitor_controlTypeNotNull, 1);
		return;
	}
	var ctrlType = Number(typeObj.id);
	var other = "";
	if(typeObj.id == '9' || typeObj.id == '10') {//开启设备录像//关闭设备录像
		var chn = $.trim($("input[name='chn']:checked").val());
		if(chn == '98') {
			other = 'CH1';
			if(chnNumber > 1) {
				for (var i = 1; i < chnNumber; i++) {
					other += ',CH'+(Number(i)+1);
				}
			}
		}else {
			other = 'CH'+(Number(chn)+1);
		}
		ctrlType = Number(chn<<16) + Number(typeObj.id);
	}else if(typeObj.id == '14') {//格式化硬盘
		var disk = $.trim($("input[name='disk']:checked").val());
		if(disk == '0') {
			other = parent.lang.monitor_disk1;
		}else {
			other = parent.lang.monitor_disk2;
		}
		ctrlType = Number(disk<<16) + Number(typeObj.id);
	}
	var account = $.trim($('#input-userName').val());
	if(parent.account) {
		account = parent.account;
	}else {
		if(account == "") {
			$.dialog.tips(parent.lang.login_UserNameEmpty, 1);
			$('#input-userName').focus();
			return;
		}
	}
	var password = $('#password-password').val();
	if(!password) {
		$.dialog.tips(parent.lang.monitor_passwordNotEmpty, 1);
		$('#password-password').focus();
		return;
	}
	//再次发送前取消上一次发送
	if(ajaxObject != null) {
		ajaxObject.abort();
	}
	
	var data = {};
	var nowDate = new Date();
	data.id = vehiIdno + nowDate.getTime();
	data.vehiIdno = vehiIdno;
	data.status = parent.lang.monitor_sending; //发送中
	data.type = typeObj.name;
	data.other = other;
	data.time = dateFormat2TimeString(nowDate);
	//将数据加入发送列表
	if(typeof W.monitorMedia != 'undefined' && W.monitorMedia != null) {
		W.monitorMedia.addServerInfoToEvent(data);
	}
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.monitor_sending, this);
	//密码进行md5加密
	var action = "http://"+ userServer.ip +":"+ userServer.port +"/2/7/callback=getData?DevIDNO="+ device.getIdno();
	action += '&CtrlType='+ ctrlType +'&Usr='+ account +'&Pwd='+hex_md5(password);
	action += '&jsession='+$.cookie("JSESSIONID");
	
	ajaxObject = $.ajax({
		type : "get",  
        url : action,
        timeout: 60000,
        data : null,
        dataType: "jsonp",
        success : getData = function(json){
        	if(!parent.account) {
        		$('#input-userName').val('');
        	}else {
        		$('.password-password').focus();
        	}
    		$('#password-password').val('');
    		$.myajax.showLoading(false);
    		disableForm(false);
        	data.time = dateFormat2TimeString(new Date());
    		if(json.result == 0){
    			$.dialog.tips(parent.lang.monitor_sendSuccess, 2);
    			data.status = parent.lang.monitor_sendSuccess;
    		}else if(json.result == 1){
    			$.dialog.tips(parent.lang.video_not_online, 2);
    			data.status = parent.lang.monitor_sendFail;
    		}else {
    			var mess = '';
				if((typeof showDialogErrorMessage) == 'function') {
					mess = showDialogErrorMessage(json.result, json.cmsserver);
				}
				if(mess != null && mess == '') {
					$.dialog.tips(parent.lang.monitor_sendFail, 2);
				}
    			data.status = parent.lang.monitor_sendFail;
    		}
    		//将数据加入发送列表
    		if(typeof W.monitorMedia != 'undefined' && W.monitorMedia != null) {
    			W.monitorMedia.addServerInfoToEvent(data);
    		}
        },  
        error:function(XHR, textStatus, errorThrown){
        	if(!parent.account) {
        		$('#input-userName').val('');
        	}else {
        		$('.password-password').focus();
        	}
    		$('#password-password').val('');
        	$.myajax.showLoading(false);
        	disableForm(false);
        	if(errorThrown == 'timeout') {
        		$.dialog.tips(parent.lang.monitor_sendFail, 2);
        		data.time = dateFormat2TimeString(new Date());
        		data.status = parent.lang.monitor_sendFail;
        		//将数据加入发送列表
        		if(typeof W.monitorMedia != 'undefined' && W.monitorMedia != null) {
        			W.monitorMedia.addServerInfoToEvent(data);
        		}
        	}
         } 
	});
}