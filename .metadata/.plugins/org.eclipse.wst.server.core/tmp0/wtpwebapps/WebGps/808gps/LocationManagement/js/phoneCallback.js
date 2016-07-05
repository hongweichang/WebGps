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
	
	$('#configListTitle').text(parent.lang.param_configList);
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.save, name : '', pclass : 'btnSave',
				bgcolor : 'gray', hide : false}],
//			[{display: parent.lang.save_to_other, name : '', pclass : 'btnSaveOther',
//				bgcolor : 'gray', hide : false}],
			[{display: parent.lang.close, name : '', pclass : 'btnExit',
				bgcolor : 'gray', hide : false}]
		]
	});
	
	//加载电话回拨设置页面
	loadPhoneCallBackPage();
	
	//加载电话回拨设置发送列表
	loadConfigListTable();
	
	initPageInfo(vehiIdno, devIdno, true);
	
	//保存电话回拨参数配置
	$('.btnSave').on('click', clickSetPhoneCallback);
	//保存到其他设备
//	$('.btnSaveOther').on('click', ajaxSaveConfigToOther);
	//退出
	$('.btnExit').on('click', function() {
		W.monitorMenu.phoneCallbackObj = null;
		W.$.dialog({id:'phoneCallback'}).close();
	});
}

//添加 radio选项
function addRadio(name, disabled) {
	var content = '';
	var disabledStr = '';
	if(disabled) {
		disabledStr = "disabled";
	}
	content += '<input id="'+name+'-call" name="'+name+'" type="radio" value="0" checked '+disabledStr+'/>';
	content += '<label id="label-'+name+'-call" for="'+name+'-call">'+parent.lang.monitor_phone_callback_call+'</label>';
	content += '<input id="'+name+'-monitor" name="'+name+'" type="radio" value="1" style="margin-left: 10px;" '+disabledStr+'/>';
	content += '<label id="label-'+name+'-monitor" for="'+name+'-monitor">'+parent.lang.monitor+'</label>';
	return content;
}

//加载电话回拨设置页面
function loadPhoneCallBackPage() {
	$('#phone-callback').flexPanel({
		TableGroupModel :
		[	{
				title :{display: '',pid : '',hide:false,tabshide: false, headhide: true},
				colgroup:{width:['150px','420px']},
				tabs:{
					display: [parent.lang.type , parent.lang.monitor_callback_phone],
					name : ['callType', 'phoneNum'],
					type:['','input'],
					length:[ , 20],
					tips:['', parent.lang.monitor_callback_phone_tip]
				}
			}
		]
	});
	
	$('.td-callType').prepend(addRadio('callType', false));
	
	//限制输入数字
	enterDigital('#input-phoneNum');
}

//加载设置发送列表
function loadConfigListTable() {
	$('#configListTable').flexigrid({
		url: "configListTable",
		dataType: 'json',
		colModel : [
			{display: parent.lang.plate_number, name : 'idno', width : 120, sortable : false, align: 'center', hide: false},
			{display: parent.lang.time, name : 'time', width : 130, sortable : false, align: 'center'},
			{display: parent.lang.status, name : 'status', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.content, name : 'content', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.type, name : 'type', width : 80, sortable : false, align: 'center'}
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
		height: 110
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
		if(row.type != 1) {
			ret = parent.lang.monitor_phone_callback_call;
		}else {
			ret = parent.lang.monitor;
		}
	}     
	return getColumnTitle(ret);
}

//点击保存电话回拨参数设置
function clickSetPhoneCallback() {
	//如果设备号为空
	if(!devIdno) {
		return;
	}
	//设置电话回拨参数配置前准备参数
	preSetConfigInfo([vehiIdno]);
}

var selVehiList = []; //选中的待设置车辆
var isSetting= true; //是否正在设置

//设置电话回拨参数配置前准备参数
function preSetConfigInfo(vehiIdnoList) {
	//休眠时汇报时间间隔
	var type = $("input[name='callType']:checked").val();
	var phoneNum = $.trim($('#input-phoneNum').val());
	if(!phoneNum || phoneNum.length > 20) {
		$.dialog.tips(parent.lang.errRequireParam, 1);
		$('#input-phoneNum').focus();
		return;
	}
	
	var index = $('#configListTable tr').length;
	var rows = [];
	for (var i = 0; i < vehiIdnoList.length; i++) {
		var info = {};
		info.id = index + i;
		info.idno = vehiIdnoList[i];
		info.time = dateFormat2TimeString(new Date());
		info.status = parent.lang.monitor_setting;
		info.content = phoneNum;
		info.type = type;
		rows.push(info);
		
		var data_ = {};
		data_.id = index + i;
		data_.vid =  vehiIdnoList[i];
		data_.Flag = type;
		data_.PHONE = phoneNum;
		selVehiList.push(data_);
	}
	$('#configListTable').flexAppendRowJson(rows, true);
	
	//发送TTS
	if(isSetting) {
		ajaxSetPhoneCallback();
	}
}

var ajaxSetObj = null;//发送设置请求AJAX对象
var startSetTime = null;//开始设置的时间
var setVehicle = null; //正在设置的车辆

//设置电话回拨参数配置
function ajaxSetPhoneCallback() {
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
				var action = "http://"+ userServer.ip +":"+ userServer.port +"/2/74/callback=getData?Command=33792&DevIDNO="+ setVehicle.did;
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
			ajaxSetPhoneCallback();
		}
	}else {
		setTimeout(ajaxSetPhoneCallback, 50);
	}
}

//保存到其他设备
function ajaxSaveConfigToOther() {
	$.dialog({id:'configToOther', title: parent.lang.save_to_other, content: 'url:LocationManagement/deviceParamConfigToOther.html?type=808',
		width: '400px', height: '630px', min:true, max:false, lock:true,fixed:false
			, resize:false, close: false });
}

//选择车辆成功
function saveToOtherSuccess(vehiIdnoList) {
	$.dialog({id:'configToOther'}).close();
	//设置电话回拨参数配置前准备参数
	preSetConfigInfo(vehiIdnoList);
}

//重新打开页面时调用
function initPageInfo(vehiIdno_, devIdno_, isPage) {
	if(isPage || devIdno != devIdno_) {
		vehiIdno = vehiIdno_;
		devIdno = devIdno_;
		//清空数据
		$('#input-phoneNum').val('');
	}
}