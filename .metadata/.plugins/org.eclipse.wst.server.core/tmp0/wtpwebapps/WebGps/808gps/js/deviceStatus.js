var type = getUrlParameter("type");
var devIdno = getUrlParameter("DeviceUID");
var number = getUrlParameter("number");
$(document).ready(function(){
	loadAlarmDetailLang();
	getUserServer();
	
	$('#deviceTable').flexigrid({
		url: "deviceTable",
		dataType: 'json',
		colModel : [
			{display: '檢測項目', name : 'testItems', width : 150, sortable : false, align: 'center'},
			{display: '狀態', name : 'status', width : 40, sortable : false, align: 'center', hide: false},
			{display: '狀態說明', name : 'explanation', width : 350, sortable : false, align: 'center'}
		],
		usepager: false,
		autoload: false,
		singleSelect: true,
		checkbox: false,
		useRp: false,
		rp: 50,
		showTableToggleBtn: false,
		showToggleBtn: true,
		width: 'auto',
		onSubmit: addDeviceStatus,
		height: 'auto'
	});
	
	$('#alarmTable').flexigrid({
		url: "deviceTable",
		dataType: 'json',
		colModel : [
			{display: "編號", name : 'index', width : 60, sortable : false, align: 'center'},
			{display: "設備授權碼", name : 'devIdno', width : 120, sortable : false, align: 'center'},
			{display: "障礙種類", name : 'armTypeStr', width : 150, sortable : false, align: 'center'},
			{display: "障礙狀況", name : 'alarmStatus', width : 120, sortable : false, align: 'center'},
			{display: "發生時間", name : 'armTimeStart', width : 180, sortable : false, align: 'center'}
		],
		usepager: false,
		autoload: false,
		singleSelect: true,
		checkbox: false,
		useRp: false,
		rp: 50,
		showTableToggleBtn: false,
		showToggleBtn: true,
		width: 'auto',
		height: 'auto'
	});
	
	$('#gpsTable').flexigrid({
		url: "deviceTable",
		dataType: 'json',
		colModel : [
			{display: '檢測項目', name : 'testItems', width : 150, sortable : false, align: 'center'},
			{display: '狀態', name : 'status', width : 40, sortable : false, align: 'center'},
			{display: '狀態說明', name : 'explanation', width : 450, sortable : false, align: 'center'},
			{display: '緯度', name : 'weidu', width : 120, sortable : false, align: 'center'},
			{display: '經度', name : 'jingdu', width : 120, sortable : false, align: 'center'}
		],
		usepager: false,
		autoload: false,
		singleSelect: true,
		checkbox: false,
		useRp: false,
		idProperty : 'id',
		rp: 50,
		showTableToggleBtn: false,
		showToggleBtn: true,
		width: 'auto',
		onSubmit: addDeviceStatus,
		height: 'auto'
	});
	
	$('#statusTable').flexigrid({
		url: "deviceTable",
		dataType: 'json',
		colModel : [
			{display: '檢測項目', name : 'testItems', width : 150, sortable : false, align: 'center'},
			{display: '檢測結果', name : 'result', width : 350, sortable : false, align: 'center'}
		],
		usepager: false,
		autoload: false,
		singleSelect: true,
		checkbox: false,
		useRp: false,
		idProperty : 'testItems',
		rp: 50,
		showTableToggleBtn: false,
		showToggleBtn: true,
		width: 'auto',
		onSubmit: addDeviceStatus,
		height: 'auto'
	});
	
	$('#device').hide();
	$('#alarm').hide();
	$('#gps').hide();
	$('#status').hide();
	
	queryDeviceStatus();
	
});

function loadAlarmDetailLang(){
	$("#labelarmType").text('類型：');
	$("#labelhandled").text('參數：');
	$("#labeldevice").text('設備授權碼：');
}

function getArmTypes() {
	var armType = [];
	armType.push({id:'1',name:'車機服務狀態即時檢測'});
	armType.push({id:'2',name:'車機服務狀態歷史查詢'});
	armType.push({id:'3',name:'車機GPS訊號檢測'});
	armType.push({id:'4',name:'車機服務平台線上定位資訊'});
	return armType;
}

var userServer = null;
var isLoadUserServer = false;
function getUserServer() {
	$.myajax.jsonGet('Status_getUserServer.action', function(json,action,success){
		if(success) {
			var userList = json.userServer;
			var lstSvrIp = [];
			lstSvrIp.push(userList[0].clientIp);
			lstSvrIp.push(userList[0].lanip);
			lstSvrIp.push(userList[0].clientIp2);
			userServer = {};
			userServer.ip = getComServerIp(lstSvrIp);
			userServer.port = userList[0].clientPort;
			isLoadUserServer = true;
		};
	}, null);
}

var  intervalProcess = null;
function queryDeviceStatus(){
	if(isLoadUserServer){
		if(type == 4){
			if((devIdno == null || devIdno == '') && (number == null || number == '')){
				$('#error').show();
				$('#error').text('DeviceUID或number不能為空');
				return;
			}
		}else{
			if(devIdno == null || devIdno == ''){
				$('#error').show();
				$('#error').text('DeviceUID不能為空');
				return;
			}
		}
		disableForm(true);
		$.myajax.showLoading(true, '加載中', this);
		if(type == 1 || type == 3){
			var action = "http://"+ userServer.ip +":"+ userServer.port +"/2/11/callback=getData?DevIDNO="+ devIdno;
			ajaxObject = $.ajax({
				type : "post",  
		        url : action,
		        timeout: 120000,
		        data : null, 
		        dataType: "jsonp",
		        success : getData = function(json){
		    		if(json.result == 0){
		    			loadDeviceInfo(json.devstaus);
		    			if(type == 3 && intervalProcess == null){
		    				intervalProcess = setInterval( "queryGPSStatus()" , 1000 );
		    			}
		    			//$.dialog.tips(parent.lang.getDeviceInfoSuccess, 1);
		    		}else if(json.result == 1){
		    			$('#error').show();
						$('#error').text('DeviceUID='+ devIdno +'設備不在線');
		    		}else if(json.result == 21){
		    			$('#error').show();
						$('#error').text('DeviceUID='+ devIdno +'設備不存在');
		    		}else {
		    			if(type == 1){
		    				$('#error').show();
							$('#error').text('DeviceUID='+ devIdno +'獲取設備信息失敗！');
			    			$('#device').hide();
			    			$('#alarm').hide();
			    			$('#gps').hide();
			    			$('#status').hide();
		    			}else if(type == 3){
		    				$('#error').show();
							$('#error').text('DeviceUID='+ devIdno +'獲取GPS信息失敗！');
			    			$('#device').hide();
			    			$('#alarm').hide();
			    			$('#gps').hide();
			    			$('#status').hide();
		    			}
		    		}
		    		$.myajax.showLoading(false);
		    		disableForm(false);
		        },  
		        error:function(XHR, textStatus, errorThrown){
		        	if(errorThrown == 'timeout') {
		        		$('#error').show();
						$('#error').text("DeviceUID="+ devIdno +"获取设备信息失败！");
		        	}
		        	$.myajax.showLoading(false);
		        	disableForm(false);
		         } 
			});
		}else if(type == 2){
			/*$.myajax.jsonGet('Status_getAlarm.action?devIdno='+devIdno, function(json,action,success){
				if(success) {
					$('#alarmTable').flexAddData(json, false);
					$('#device').hide();
	    			$('#alarm').show();
	    			$('#gps').hide();
	    			$('#status').hide();
		        	$.myajax.showLoading(false);
		        	disableForm(false);
				};
			}, null);*/
			jQuery.post('Status_getAlarm.action?devIdno='+devIdno, {json : null}, function(json, textStatus) {
				if (textStatus == "success") {
					if(json.result==0){	//会话无效
						$('#alarmTable').flexAddData(json, false);
						$('#device').hide();
		    			$('#alarm').show();
		    			$('#gps').hide();
		    			$('#status').hide();
					} else if (json.result == 21) {
						$('#error').show();
						$('#error').text('DeviceUID='+ devIdno +'設備不存在');
					}
				} else {
					showDialogErrorMessage(4);
					callback.call(this, json, false);
				}
				$.myajax.showLoading(false);
	        	disableForm(false);
			}, 'json');
		}else if(type == 4){
			$.myajax.jsonGet('Status_getStatus.action?devIdno='+devIdno+'&number='+number, function(json,action,success){
				if(success) {
		        	$.myajax.showLoading(false);
		        	disableForm(false);
					if(json.device){
						loadDeviceStatus(json.device,json.vehicle,json.status);
						$('#device').hide();
		    			$('#alarm').hide();
		    			$('#gps').hide();
		    			$('#status').show();
					}else{
						$('#error').show();
						var str = "";
						if(devIdno){
							str += "DeviceUID=" + devIdno;
						}
						if(number){
							if(str){
								str += "&";
							}
							str += "number="+ number;
						}
						$('#error').text(str +'設備不存在');
					}
				};
			}, null);
		}
	}else{
		setTimeout(queryDeviceStatus, 50);
	}
}

function queryGPSStatus(){
	$.myajax.jsonGet('Status_getGPSStatus.action?devIdno='+devIdno, function(json,action,success){
		if(success) {
        	$.myajax.showLoading(false);
        	disableForm(false);
        	if(json.status){
	        	$('#row16 .weidu').text(json.status.lat/1000000);
				$('#row16 .weidu').css('text-align', 'center');
				$('#row16 .weidu').css('line-height', '25px');
				$('#row16 .jingdu').text(json.status.lng/1000000);
				$('#row16 .jingdu').css('text-align', 'center');
				$('#row16 .jingdu').css('line-height', '25px');
        	}
		};
	}, null);
}

var deviceStatus = [];

function loadDeviceInfo(devstaus){
	deviceStatus = [];
	var data = {};
	data.id = 1;
	data.testItems = "設備GPS時間";
	if(devstaus.gpsTime){
		data.status = "images/image001.png";
		data.explanation = devstaus.gpsTime;
	}else{
		data.status = "images/image003.png";
		data.explanation = "";
	}
	if(type == 3){
		data.jingdu = '';
		data.weidu = '';
	}
	deviceStatus.push(data);
	var data2 = {};
	data2.id = 2;
	data2.testItems = "設備經緯度";
	if(devstaus.jingDu && devstaus.weiDu){
		data2.status = "images/image001.png";
		data2.explanation = Number(devstaus.weiDu/1000000) + "," + Number(devstaus.jingDu/1000000);
	}else{
		data2.status = "images/image003.png";
		data2.explanation = "";
	}
	if(type == 3){
		data2.jingdu = '';
		data2.weidu = '';
	}
	deviceStatus.push(data2);
	var data3 = {};
	data3.id = 3;
	data3.testItems = "設備授權碼";
	data3.status = "images/image001.png";
	data3.explanation = devIdno;
	if(type == 3){
		data3.jingdu = '';
		data3.weidu = '';
	}
	deviceStatus.push(data3);
	var data4 = {};
	data4.id = 4;
	data4.testItems = "GPS模組";
	if(devstaus.gpsState){
		data4.status = "images/image001.png";
		data4.explanation = "有效";
	}else{
		data4.status = "images/image003.png";
		data4.explanation = "無效";
	}
	if(type == 3){
		data4.jingdu = '';
		data4.weidu = '';
	}
	deviceStatus.push(data4);
	var data5 = {};
	data5.id = 5;
	data5.testItems = "接收衛星數量";
	if(devstaus.gpsStarNum){
		data5.status = "images/image001.png";
		data5.explanation = devstaus.gpsStarNum;
	}else{
		data5.status = "images/image003.png";
		data5.explanation = 0;
	}
	if(type == 3){
		data5.jingdu = '';
		data5.weidu = '';
	}
	deviceStatus.push(data5);
	var data6 = {};
	data6.id = 6;
	data6.testItems = "3G/4G通訊模組";
	if(devstaus.wirelessState){
		data6.status = "images/image001.png";
		data6.explanation = "正常";
	}else{
		data6.status = "images/image003.png";
		data6.explanation = "不正常";
	}
	if(type == 3){
		data6.jingdu = '';
		data6.weidu = '';
	}
	deviceStatus.push(data6);
	var data7 = {};
	data7.id = 7;
	data7.testItems = "3G/4G接收訊號強弱";
	if(devstaus.wirelessSignalLevel){
		if(devstaus.wirelessSignalLevel == 1){
			data7.status = "images/image001.png";
			if(devstaus.wirelessSignalValue){
				data7.explanation = "信號弱（訊號：" + devstaus.wirelessSignalValue + "）";
			}else{
				data7.explanation = "信號弱（訊號：0）";
			}
		}else if(devstaus.wirelessSignalLevel == 2){
			data7.status = "images/image001.png";
			if(devstaus.wirelessSignalValue){
				data7.explanation = "信號差（訊號：" + devstaus.wirelessSignalValue + "）";
			}else{
				data7.explanation = "信號差（訊號：0）";
			}
		}else if(devstaus.wirelessSignalLevel == 3){
			data7.status = "images/image001.png";
			if(devstaus.wirelessSignalValue){
				data7.explanation = "信號一般（訊號：" + devstaus.wirelessSignalValue + "）";
			}else{
				data7.explanation = "信號一般（訊號：0）";
			}
		}else if(devstaus.wirelessSignalLevel == 4){
			data7.status = "images/image001.png";
			if(devstaus.wirelessSignalValue){
				data7.explanation = "信號好（訊號：" + devstaus.wirelessSignalValue + "）";
			}else{
				data7.explanation = "信號好（訊號：0）";
			}
		}else if(devstaus.wirelessSignalLevel == 5){
			data7.status = "images/image001.png";
			if(devstaus.wirelessSignalValue){
				data7.explanation = "信號優（訊號：" + devstaus.wirelessSignalValue + "）";
			}else{
				data7.explanation = "信號優（訊號：0）";
			}
		}else if(devstaus.wirelessSignalLevel == 6){
			data7.status = "images/image003.png";
			if(devstaus.wirelessSignalValue){
				data7.explanation = "3G模塊不存在（訊號：" + devstaus.wirelessSignalValue + "）";
			}else{
				data7.explanation = "3G模塊不存在（訊號：0）";
			}
		}else if(devstaus.wirelessSignalLevel == 7){
			data7.status = "images/image003.png";
			if(devstaus.wirelessSignalValue){
				data7.explanation = "3G功能關閉（訊號：" + devstaus.wirelessSignalValue + "）";
			}else{
				data7.explanation = "3G功能關閉（訊號：0）";
			}
		}else{
			data7.status = "images/image003.png";
			data7.explanation = "SIM卡不存在";
		}
	}else{
		data7.status = "images/image003.png";
		data7.explanation = "SIM卡不存在";
	}
	if(type == 3){
		data7.jingdu = '';
		data7.weidu = '';
	}
	deviceStatus.push(data7);
	var data8 = {};
	data8.id = 8;
	data8.testItems = "連線類型";
	if(devstaus.networkType){
		data8.status = "images/image001.png";
		if(devstaus.networkType == 1){
			data8.explanation = "WIFI網絡登錄";
		}else if(devstaus.networkType == 2){
			data8.explanation = "有線網絡登錄";
		}else if(devstaus.networkType == 3){
			data8.explanation = "4G網絡登錄";
		}else{
			data8.explanation = "3G網絡登錄";
		}
	}else{
		data8.status = "images/image001.png";
		data8.explanation = "3G網絡登錄";
	}
	if(type == 3){
		data8.jingdu = '';
		data8.weidu = '';
	}
	deviceStatus.push(data8);
	var data9 = {};
	data9.id = 9;
	data9.testItems = "Wi-Fi連線中的SSID";
	if(devstaus.wirelessState){
		data9.status = "images/image001.png";
		data9.explanation = "連線";
	}else{
		data9.status = "images/image003.png";
		data9.explanation = "未連線";
	}
	if(type == 3){
		data9.jingdu = '';
		data9.weidu = '';
	}
	deviceStatus.push(data9);
	var data10 = {};
	data10.id = 10;
	data10.testItems = "SSD模組狀態";
	var explanat = "";
	if(devstaus.DiskNum && devstaus.DiskNum > 0){
		for (var i = 0; i < devstaus.DiskNum; i++) {
			if(devstaus.DiskInfo.length > i) {
				explanat += " 序號：" + Number(i+1) + ",";
				explanat += "所有容量：" + (devstaus.DiskInfo[i].AllVolume/100).toFixed(2) + "(GB),";
				explanat += "剩餘容量：" + (devstaus.DiskInfo[i].LeftVolume/100).toFixed(2) + "(GB);";
			}
		}
		data10.status = "images/image001.png";
		data10.explanation = explanat;
	}else{
		data10.status = "images/image003.png";
		data10.explanation = explanat;
	}
	if(type == 3){
		data10.jingdu = '';
		data10.weidu = '';
	}
	deviceStatus.push(data10);
	var data11 = {};
	data11.id = 11;
	data11.testItems = "G-Sensor運作狀態";
	if(devstaus.gsensorState){
		data11.status = "images/image001.png";
		data11.explanation = "安裝";
	}else{
		data11.status = "images/image003.png";
		data11.explanation = "未安裝";
	}
	if(type == 3){
		data11.jingdu = '';
		data11.weidu = '';
	}
	deviceStatus.push(data11);
	var chnCount = devstaus.ChanNum;
	var data12 = {};
	data12.id = 12;
	data12.testItems = "鏡頭狀態";
	if(chnCount && chnCount > 0) {
		var videoLost = devstaus.VideoLost;  //视频丢失状态
		var explanat = "";
		for (var i = 0; i < chnCount; i++) {
			explanat += 'CH'+Number(i+1);
			if((videoLost>>i)&1 > 0) {
				explanat += '：' + '視頻丟失；';
			}else {
				explanat += '：' + '正常；';
			}
		}
		if(videoLost){
			data12.status = "images/image006.gif";
		}else{
			data12.status = "images/image001.png";
		}
		if(type == 3 && chnCount < 8){
			for (var i = chnCount; i < 8; i++) {
				explanat += 'CH'+Number(i+1)+'：' + '未安裝；';
			}
			ata12.status = "images/image006.gif";
		}
		data12.explanation = explanat;
	}
	if(type == 3){
		data12.jingdu = '';
		data12.weidu = '';
	}
	deviceStatus.push(data12);
	var data13 = {};
	data13.id = 13;
	data13.testItems = "胎壓偵測器狀態";
	if(devstaus.tirePressureState){
		data13.status = "images/image001.png";
		data13.explanation = "安裝";
	}else{
		data13.status = "images/image003.png";
		data13.explanation = "未安裝";
	}
	if(type == 3){
		data13.jingdu = '';
		data13.weidu = '';
	}
	deviceStatus.push(data13);
	var data14 = {};
	data14.id = 14;
	data14.testItems = "OBDII狀態";
	if(devstaus.ObdStatus){
		data14.status = "images/image001.png";
		data14.explanation = "安裝";
	}else{
		data14.status = "images/image003.png";
		data14.explanation = "未安裝";
	}
	if(type == 3){
		data14.jingdu = '';
		data14.weidu = '';
	}
	deviceStatus.push(data14);
	var data15 = {};
	data15.id = 15;
	data15.testItems = "溫度計控制盒";
	if(devstaus.tempStatus){
		data15.status = "images/image001.png";
		data15.explanation = "安裝";
	}else{
		data15.status = "images/image003.png";
		data15.explanation = "未安裝";
	}
	if(type == 3){
		data15.jingdu = '';
		data15.weidu = '';
	}
	deviceStatus.push(data15);
	if(type == 3){
		var data16 = {};
		data16.id = 16;
		data16.testItems = "GPS模組(即時動態)";
		data16.status = "";
		data16.explanation = "";
		if(devstaus.jingDu && devstaus.weiDu){
			data16.jingdu = Number(devstaus.jingDu/1000000);
			data16.weidu = Number(devstaus.weiDu/1000000);
		}else{
			data16.jingdu = '';
			data16.weidu = '';
		}
		deviceStatus.push(data16);
	}
	isLoadDeviceStatus = true;
	addDeviceStatus();
}

function addDeviceStatus() {
	if(isLoadDeviceStatus) {
		if(deviceStatus.length <= 0) {
			return;
		}
		var infos = [];
		for (var i = 0; i < deviceStatus.length; i++) {
			infos.push(deviceStatus[i]);
		}
		var pagination={};
		var json = {};
		json.infos = infos;
		json.pagination = pagination;
		if(type == 3){
			$('#gpsTable').flexAddData(json, false);
			$('#gps').show();
			$('#device').hide();
			$('#status').hide();
			$('#alarm').hide();
		}else if(type == 4){
			$('#statusTable').flexAddData(json, false);;
		}else{
			$('#deviceTable').flexAddData(json, false);
			$('#device').show();
			$('#gps').hide();
			$('#status').hide();
			$('#alarm').hide();
		}
	}else {
		setTimeout(addVehicle,50);
	}
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == "status"){
		if(row[name]){
			pos = "<img src="+ row[name] +">";
		}else{
			pos = "";
		}
	}else if(name == 'alarmStatus'){
		if(row['armType'] == 17){
			pos = "";
		}else{
			pos = "異常";
		}
	}else if(name == 'armTimeStart'){
		pos = dateTime2TimeString(row['armTimeStart']);
	}else{
		pos = row[name];
	}
	return pos;
}

function loadDeviceStatus(device,vehicle,status){
	deviceStatus = [];
	var data = {};
	data.testItems = "設備授權碼";
	if(device.devIDNO){
		data.result = device.devIDNO;
	}else{
		data.result = "";
	}
	deviceStatus.push(data);
	var data2 = {};
	data2.testItems = "車號";
	if(vehicle.vehiIDNO){
		data2.result = vehicle.vehiIDNO;
	}else{
		data2.result = "";
	}
	deviceStatus.push(data2);
	var data3 = {};
	data3.testItems = "車機類型";
	data3.result = "ITSV-384-Z14";
	deviceStatus.push(data3);
	var data4 = {};
	data4.testItems = "門號";
	if(device.simInfo){
		if(device.simInfo.cardNum){
			data4.result = device.simInfo.cardNum;
		}else{
			data4.result = "";
		}
	}else{
		data4.result = "";
	}
	deviceStatus.push(data4);
	var data5 = {};
	data5.testItems = "硬體版本";
	if(status.hv){
		data5.result = status.hv;
	}else{
		data5.result = "";
	}
	deviceStatus.push(data5);
	var data6 = {};
	data6.testItems = "軟體版本";
	if(status.sv){
		data6.result = status.sv;
	}else{
		data6.result = "";
	}
	deviceStatus.push(data6);
	var data7 = {};
	data7.testItems = "IMEI";
	if(status.imei){
		data7.result = status.imei;
	}else{
		data7.result = "";
	}
	deviceStatus.push(data7);
	var data8 = {};
	data8.testItems = "IMSI";
	if(status.imsi){
		data8.result = status.imsi;
	}else{
		data8.result = "";
	}
	deviceStatus.push(data8);
	var data9 = {};
	data9.testItems = "狀態";
	if(status.ol){
		data9.result = "在線";
	}else{
		data9.result = "離線";
	}
	deviceStatus.push(data9);
	var data10 = {};
	data10.testItems = "定位狀態";
	data10.result = "衛星定位";
	deviceStatus.push(data10);
	var data11 = {};
	data11.testItems = "車速";
	if(status.sp){
		data11.result = (status.sp / 10).toFixed(2);
		data11.result += "(公里/時)";
	}else{
		data11.result = 0;
	}
	deviceStatus.push(data11);
	var data12 = {};
	data12.testItems = "位置";
	if(status.lng && status.lat) {
		data12.result = myParseAddressEx(null, status.lng/1000000, status.lat/1000000,null);
	}else{
		data12.result = "";
	}
	deviceStatus.push(data12);
	var data13 = {};
	data13.testItems = "回報時間";
	if(status.gt){
		data13.result = status.gt.substring(0, 19);
	}else{
		data13.result = "";
	}
	deviceStatus.push(data13);
	var data14 = {};
	data14.testItems = "方向";
	if(status.hx){
		var hx = ((status.hx + 22) / 45 ) & 0x7;
		if( hx == 0 ) {
			data14.result = "北";
		}else if(hx == 1){
			data14.result = "東北";
		}else if(hx == 2){
			data14.result = "東";
		}else if(hx == 3){
			data14.result = "東南";
		}else if(hx == 4){
			data14.result = "南";
		}else if(hx == 5){
			data14.result = "西南";
		}else if(hx == 6){
			data14.result = "南";
		}else if(hx == 7){
			data14.result = "西北";
		}else{
			data14.result = "";
		}
	}else{
		data14.result = "";
	}
	deviceStatus.push(data14);
	var data15 = {};
	data15.testItems = "緯度";
	if(status.lat){
		data15.result = status.lat/1000000;
	}else{
		data15.result = "";
	}
	deviceStatus.push(data15);
	var data16 = {};
	data16.testItems = "經度";
	if(status.lng){
		data16.result = status.lng/1000000;
	}else{
		data16.result = "";
	}
	deviceStatus.push(data16);
	isLoadDeviceStatus = true;
	addDeviceStatus();
}

var geocoder = new google.maps.Geocoder();
function myParseAddressEx(key, jingdu, weidu, callback){
	if(typeof geocoder != "undefined"){
		geocoder.geocode({"address":weidu+","+jingdu}, function(results,status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if(results[0].formatted_address){
					$('#row位置 .result').text(results[0].formatted_address);
					$('#row位置 .result').css('text-align', 'center');
					$('#row位置 .result').css('line-height', '25px');
				}else{
					$('#row位置 .result').text("");
				}
			}
		});
	}
}
