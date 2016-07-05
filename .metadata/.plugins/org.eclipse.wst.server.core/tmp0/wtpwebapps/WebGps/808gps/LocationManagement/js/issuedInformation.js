var api = frameElement.api, W = api.opener;
var vehiTeamId = getUrlParameter('vehiTeamId');//选择的公司车队节点
var vehiIdno = decodeURIComponent(getUrlParameter('vehiIdno'));//选择的车辆节点
var devIdno = getUrlParameter('devIdno');//设备号
var vehiTeamTree = null;  //车队车辆树类
var gatewayServer = W.gatewayServer; //网关服务器
var userServer = W.userServer; //用户服务器
var selVehiList = [];//new Hashtable(); //选中的待发送车辆
var isSend = true;

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
	
	$('#labelMessage').text(parent.lang.monitor_fillMessage);
	$('#btnMessage').text(parent.lang.monitor_fixedMessage);
	$('#btnAddTts a').text(parent.lang.monitor_addNewFixedMessage);
	$('#btnAddTts').attr('title',parent.lang.monitor_addNewFixedMessage);
	$('#newTtsText').attr('placeholder',parent.lang.monitor_enterMessage);
//	$('#btnConfirm').text(parent.lang.determine);
	$('#btnConfirm').attr('title', parent.lang.determine);
//	$('#btnCancel').text(parent.lang.cancel);
	$('#btnCancel').attr('title', parent.lang.cancel);
	$('#messageNotMore').text(parent.lang.monitor_messageMoreThan);
	$('.autoSaveMsgTip').text(parent.lang.monitor_send_saveFixedMsg);
	$('#ttsSendList').text(parent.lang.monitor_messageList);
	
	vehiTeamTree = new vehicleTeamTree();
	vehiTeamTree.setRootId(parent.companyId);
	vehiTeamTree.setTeamList(parent.vehicleManager.getAllVehiTeam());
	vehiTeamTree.setVehiList(parent.vehicleManager.getSupportTTSVehicle(true));
	vehiTeamTree.setIsSearch(true);
	vehiTeamTree.setCountGroup(true);
	vehiTeamTree.initVehiTeamTree('vehiTeamTree', 'vehicleTree', '../../js/dxtree/imgs/');
	vehiTeamTree.setHeight(212, 312);
	vehiTeamTree.loadVehiTeamTree('searchTeam', 'searchVehi');
	vehiTeamTree.loadSelectTeamTree(vehiTeamId, vehiIdno);
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.monitor_send, name : '', pclass : 'btnSendTts',
				bgcolor : 'gray', hide : false}]
		]
	});
	//初始化发送信息列表
	initTTSTable();
	////查询固定文字信息列表
	getFixedTtsList();
	
	cleanSpelChar('#newTtsText');
	cleanSpelChar('#ttsText');
	//发送tts
	$('.btnSendTts').on('click', preSendTtsInfo);
	//
	$('#btnMessage').on('click', function() {
		$('#btnMessage').toggleClass('active');
		$('#addTtsContent').toggleClass('active');
	});
	//添加新的文字信息
	$('#btnAddTts').on('click', function() {
		$(this).hide();
		$('#addTtsText').show();
	});
	//确定添加新的文字信息
	$('#btnConfirm').on('click', btnAddNewInfo);
	//取消添加新的文字信息
	$('#btnCancel').on('click', function() {
		$('#newTtsText').val('');
		$('#btnAddTts').show();
		$('#addTtsText').hide();
	});
}

//初始化发送信息列表
function initTTSTable() {
//	var buttons = [
//  	    {separator: false, hidename: "", name: parent.lang.del, bclass: "delete",
//  	    	bimage: "", tooltip: parent.lang.del, id: "delAlarm",
//  	    	onpress: function() {$("#ttsInfoTable").flexClear();}
//  	    }
//  	];
	$("#ttsInfoTable").flexigrid({
		url: "",	//StandardTrackAction_query.action
		dataType: 'json',
		colModel : [
			{display: parent.lang.plate_number, name : 'idno', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.time, name : 'time', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.status, name : 'status', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.content, name : 'content', width : 200, sortable : false, align: 'center'}
			],
		usepager: false,
		autoload: false,
		useRp: false,
		singleSelect: true,
//		buttons: buttons,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: true,
		width: 'auto',
		height: 222,//192,
		resizable: false
	});
	$("#ttsInfoTable").flexSetFillCellFun(fillTtsInfoTable);
//	$("#ttsInfoTable").flexSelectRowPropFun(selectTtsInfoRowProp(obj));
}

function getColumnTitle(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

//填充tts信息列表
function fillTtsInfoTable(p, row, idx, index){
	var name = p.colModel[idx].name;
	var ret = "";
	if(name == 'idno') {
		ret = row.idno;
	}else if(name == 'content') {
		ret = row.content;
	}else if(name == 'time') {
		ret = row.time;
	}else if(name == 'status') {
		if(row.status == 1) {
			ret = parent.lang.monitor_sending;
		}else {
			ret = row.status;
		}
	}     
	return getColumnTitle(ret);
}

//发送TTS前准备
function preSendTtsInfo() {
	var selList = vehiTeamTree.selectCheckedVehicle();
	if(selList == null || selList == '' || selList.length == 0) {
		$.dialog.tips(parent.lang.selectVehicleTip, 1);
		return;
	}
	
	var sendText = $.trim($('#ttsText').val());
	if(sendText == null || sendText == '') {
		$.dialog.tips(parent.lang.monitor_message_null, 1);
		return;
	}
	if(sendText.realLength() > 240) {
		$.dialog.tips(parent.lang.monitor_errorMessage, 1);
		return;
	}
	
	var index = $('#ttsInfoTable tr').length;
	var rows = [];
	for (var i = 0; i < selList.length; i++) {
		var info = {};
		info.id = index + i;
		info.idno = selList[i];
		info.time = dateFormat2TimeString(new Date());
		info.status = 1;
		info.content = sendText;
		selVehiList.push(info);
		rows.push(info);
	}
	$('#ttsInfoTable').flexAppendRowJson(rows, true);
	//保存文字信息为固定文字信息
	var autoSaveMsg= $.trim($("input[name='autoSaveMsg']:checked").val());
	if(autoSaveMsg != null && autoSaveMsg == 1) {
		var data = {};
		data.content = sendText;
		$.myajax.jsonPost("StandardTTSAction_addFixedTtsInfo.action", data, false, function(json, success) {
			if(success) {
				getFixedTtsList();
			}
		});
	}
	
	//发送TTS
	if(isSend) {
		sendTtsInfo();
	}
}

var ajaxSendTtsObj = null;//发送请求AJAX对象
var startSendTime = null;//开始发送的时间
var sendVehicle = null; //发送的信息id

//发送TTS
function sendTtsInfo() {
	//如果发送时间超过70秒，则判断失败
	if(startSendTime != null && (new Date()).getTime() - startSendTime > 70000) {
		//取消上次请求
		if(ajaxSendTtsObj != null) {
			ajaxSendTtsObj.abort();
		}
		var obj = $('#ttsInfoTable').find($('#ttsInfoTable').flexGetRowid(sendVehicle.id));
		obj.find('.time div').html(getColumnTitle(dateFormat2TimeString(new Date())));
		obj.find('.status div').html(getColumnTitle(parent.lang.monitor_sendFail));
		isSend = true;
	}
	if(isSend) {
		if(selVehiList != null && selVehiList.length > 0) {
			startSendTime = (new Date()).getTime();
			isSend = false;
			sendVehicle = selVehiList[0];
			selVehiList.splice(0,1);
			var vehicle = parent.vehicleManager.getVehicle(sendVehicle.idno);
			//判断车辆是否在线，支持TTS的设备是否在线
			var device = null;
			if(vehicle.getIdno() == vehiIdno && devIdno != null && devIdno != '') {
				device = parent.vehicleManager.getDevice(devIdno);
			}else {
				for (var i = 0; i < vehicle.getDevList().length; i++) {
					if(vehicle.getDevList()[i].isOnline() && vehicle.getDevList()[i].isTTSSupport()){
						device = vehicle.getDevList()[i];
						break;
					}
				}
			}
			
			//车辆在线才能发送
			if(device != null && device.isOnline()) {
				var obj = $('#ttsInfoTable').find($('#ttsInfoTable').flexGetRowid(sendVehicle.id));
				var data = {};
				data.devIdnos = device.getIdno();
				data.typeIdno = sendVehicle.content;
				data.sourceIdno = sendVehicle.idno;
//				gatewayServer.ip = '192.168.1.222';
//				data.condiIdno = gatewayServer.ip +':'+ gatewayServer.port;
				data.condiIdno = userServer.ip +':'+ userServer.port;
				
				ajaxSendTtsObj = $.post("StandardTTSAction_sendTtsInformation.action", {json : JSON.stringify(data)}, function(json, textStatus) {
					obj.find('.time div').html(getColumnTitle(dateFormat2TimeString(new Date())));
					if(textStatus == "success") {
						if(json.result==0){	//成功
							obj.find('.status div').html(getColumnTitle(parent.lang.monitor_sendSuccess));
						}else {
							obj.find('.status div').html(getColumnTitle(parent.lang.monitor_sendFail));
						}
					}else {
						obj.find('.status div').html(getColumnTitle(parent.lang.monitor_sendFail));
					}
		    		isSend = true;
		    		startSendTime = null;
				}, 'json');
			}else {
				var obj = $('#ttsInfoTable').find($('#ttsInfoTable').flexGetRowid(sendVehicle.id));
	    		obj.find('.time div').html(getColumnTitle(dateFormat2TimeString(new Date())));
	    		obj.find('.status div').html(getColumnTitle(parent.lang.monitor_sendFail));
				isSend = true;
				startSendTime = null;
			}
			sendTtsInfo();
		}
	}else {
		setTimeout(sendTtsInfo, 50);
	}
}

//确定添加新的固定文字信息
function btnAddNewInfo() {
	var content = $.trim($('#newTtsText').val());
	if(content == null || content == '') {
		$.dialog.tips(parent.lang.not_be_empty, 1);
		return;
	}
	if(content.realLength() > 240) {
		$.dialog.tips(parent.lang.monitor_errorMessage, 1);
		return;
	}
	
	var data = {};
	data.content = content;
	$.myajax.jsonPost("StandardTTSAction_addFixedTtsInfo.action", data, false, function(json, success) {
		if(success) {
			getFixedTtsList();
			$('#newTtsText').val('');
			$('#btnAddTts').show();
			$('#addTtsText').hide();
			$.dialog.tips(parent.lang.addok, 1);
		}else {
			$.dialog.tips(parent.lang.addFailure, 1);
		}
	});
}

//查询固定文字信息列表
function getFixedTtsList() {
	$.myajax.jsonPost("StandardTTSAction_getFixedTtsInfoList.action", null, false, function(json, success) {
		if(success) {
			if(json.infos != null && json.infos.length > 0) {
				$('#addTtsList ul').empty();
				var content = "";
				for (var i = 0; i < json.infos.length; i++) {
					var value = json.infos[i].content;
					if(value.realLength() > 50) {
						value = value.getRealSubStr(0,50) + '...';
					}
					content += '<li id="tts_'+json.infos[i].id+'" onclick="showTts(this,\''+json.infos[i].content+'\')"><a onMouseOver="addTtsClass(this)" onMouseOut="removeTtsClass(this)" title="'+parent.lang.del+'" onclick="delTts('+json.infos[i].id+')" href="javascript:void(0);">'+parent.lang.del+'</a><span title="'+json.infos[i].content+'">'+ value +'</span></li>';
				}
				$('#addTtsList ul').append(content);
			}
		}
	});
}

function addTtsClass(obj) {
	$(obj).addClass('showA');
}

function removeTtsClass(obj) {
	$(obj).removeClass('showA');
}

//将固定内容添加到tts内容
function showTts(obj, content) {
	if(!$(obj).find('a').hasClass('showA')) {
		$('#ttsText').val(content);
	}
}

//删除固定内容
function delTts(ttsId) {
	$.myajax.jsonPost("StandardTTSAction_delFixedTtsInfo.action?ttsId="+ttsId, null, false, function(json, success) {
		if(success) {
			$.dialog.tips(parent.lang.deleteok, 1);
			$('#tts_'+ttsId).remove();
		}else {
			$.dialog.tips(parent.lang.deleteFailure, 1);
		}
	});
}

//父页面调用初始化
function initPageInfo(teamId, vehiId, devId) {
	vehiTeamId = teamId;
	vehiIdno = vehiId;
	devIdno = devId;
	vehiTeamTree.setSubChecked(parent.companyId, 0);
	vehiTeamTree.selectTeamTree(vehiTeamId, vehiIdno);
}
