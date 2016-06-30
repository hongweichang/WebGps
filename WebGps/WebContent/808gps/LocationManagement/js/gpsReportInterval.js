var api = frameElement.api, W = api.opener;
var vehiIdno = decodeURIComponent(getUrlParameter('vehiIdno'));//车牌号
var userServer = W.userServer; //用户服务器

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
	
	//加载控制秒数
	initPageInfo(vehiIdno);
	
	//限制只能输入数字
	enterDigital('#input-reportInterval');
	//保存
	$('.btnSave').on('click', ajaxSetGpsReportInterval);
	//退出
	$('.btnExit').on('click', function() {
		W.monitorMenu.reportIntervalObj = null;
		W.$.dialog({id:'reportInterval'}).close();
	});
}

//加载页面控件
function loadPageTable() {
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: '',pid : 'gps-report-interval',tip: parent.lang.monitor_reporting_interval_time_tip ,hide:false,tabshide: false, headhide: true},
				colgroup:{width:['110px','330px']},
				tabs:{
					display: [parent.lang.monitor_reporting_interval],
					name : ['reportInterval'],
					type:['input'],
					length:[4]
				}
			}
		]
	});
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.save, name : '', pclass : 'btnSave',
				bgcolor : 'gray', hide : false}],
			[{display: parent.lang.close, name : '', pclass : 'btnExit',
				bgcolor : 'gray', hide : false}]
		]
	});
}

//加载控制类型
function initPageInfo(vehiIdno_) {
	vehiIdno = vehiIdno_;
	$('#input-reportInterval').val('');
	$('#input-reportInterval').focus();
}

var ajaxObject = null;//发送请求对象
//发送GPS上报间隔
function ajaxSetGpsReportInterval() {
	var vehicle = parent.vehicleManager.getVehicle(vehiIdno.toString());
	if(vehicle == null) {
		return;
	}
	var device = vehicle.getGpsDevice();//gps设备
	if(device == null) {
		return;
	}
	var time = $.trim($('#input-reportInterval').val());
	if(time == '' || Number(time) < 0 || Number(time) > 3600) {
		$.dialog.tips(parent.lang.monitor_reporting_interval_timeError, 1);
		$('#input-reportInterval').focus();
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
	data.status = parent.lang.monitor_setting; //设置中
	data.type = parent.lang.monitor_GPS_reporting_interval_settings;
	data.other = parent.lang.monitor_reporting_interval_tip.replace(/{repSecond}/, time);
	data.time = dateFormat2TimeString(nowDate);
	//将数据加入系统列表
	if(typeof W.monitorMedia != 'undefined' && W.monitorMedia != null) {
		W.monitorMedia.addServerInfoToEvent(data);
	}
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.monitor_setting, this);
	var action = "http://"+ userServer.ip +":"+ userServer.port +"/2/15/callback=getData?DevIDNO="+ device.getIdno();
	action += '&Start=1&Type=1&Distance=0&Time='+ time;
	ajaxObject = $.ajax({
		type : "get",  
        url : action,
        timeout: 60000,
        data : null,
        dataType: "jsonp",
        success : getData = function(json){
    		$.myajax.showLoading(false);
    		disableForm(false);
    		//将数据加入系统列表
    		if(typeof W.monitorMedia != 'undefined' && W.monitorMedia != null) {
    			W.monitorMedia.setGpsReportIntervalSuccess(json, data);
    		}
        },  
        error:function(XHR, textStatus, errorThrown){
        	$.myajax.showLoading(false);
        	disableForm(false);
        	if(errorThrown == 'timeout') {
        		//将数据加入系统列表
        		if(typeof W.monitorMedia != 'undefined' && W.monitorMedia != null) {
        			W.monitorMedia.setGpsReportIntervalSuccess(null, data);
        		}
        	}
         } 
	});
}