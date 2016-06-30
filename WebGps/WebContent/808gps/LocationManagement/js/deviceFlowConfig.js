var api = frameElement.api, W = api.opener;
var vehiIdno = decodeURIComponent(getUrlParameter('vehiIdno'));//车牌号
var device = null;
var overFlowLimitOpen = 0;

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
	
	//使用状态设置不能使用
//	$('#info-mid-table input').each(function() {
//		if(this.name != 'monitorOpen') {
//			disableButton(this, true);
//		}
//	});
	
	$('.td-monitorOpen input').on('click', clickMonitorOpen);
	$('.td-dayRemindOpen input').on('click', clickDayRemindOpen);
	$('.td-monthRemindOpen input').on('click', clickMonthRemindOpen);
	
	//限制输入数字
	enterDigital("#input-settlementDay");
	enterDigital("#input-monthLimit");
	enterDigital("#input-dayLimit");
	enterDigital("#input-dayRemind");
	enterDigital("#input-monthRemind");
	
	//保存
	$('.btnSave').on('click', ajaxSetupFlowConfig);
	//刷新
	$('.btnRefresh').on('click', ajaxRefreshFlowConfig);
	//保存到其他设备
	$('.btnSaveOther').on('click', ajaxSaveFlowConfigToOther);
	//退出
	$('.btnExit').on('click', function() {
		W.monitorMenu.flowConfigObj = null;
		W.$.dialog({id:'flowConfig'}).close();
	});
	
	//加载流量信息
	ajaxLoadFlowInfo();
}

//加载页面控件
function loadPageTable() {
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.flowUseStatus,pid : 'flowUseStatus',tip: '',hide:false,tabshide: false, headhide: false},
				colgroup:{width:['130px','270px','130px','270px']},
				tabs:{
					display: [parent.lang.flowDayUse, parent.lang.flowDayUseVideo, parent.lang.flowMonthUse,
					          parent.lang.flowMonthUseVideo, parent.lang.flowMonthSurplus, parent.lang.flowSettlementDayFrom],
					name : ['dayUse', 'dayUseVideo', 'monthUse', 'monthUseVideo', 'monthSurplus', 'settlementDayFrom'],
					type:['input','input','input','input','input','input'],
					length:[]
				}
			},
			{
				title :{display: parent.lang.traffic_of_3G_parameter_configuration,pid : 'flowConfig',tip: '',hide:false,tabshide: false, headhide: false},
				colgroup:{width:['130px','270px','130px','270px']},
				tabs:{
					display: [parent.lang.flowMonitorOpen, parent.lang.flowSettlementDay, parent.lang.flowMonthLimit,
					          parent.lang.flowDayLimit, parent.lang.flowDayRemindOpen, parent.lang.flowDayRemind,
					          parent.lang.flowMonthRemindOpen, parent.lang.flowMonthRemind, parent.lang.flowOverLimitOpen],
					name : ['monitorOpen', 'settlementDay', 'monthLimit', 'dayLimit', 'dayRemindOpen', 'dayRemind', 'monthRemindOpen', 'monthRemind', 'overLimitOpen'],
					type:[,'input','input','input',,'input',,'input',],
					length:[,2,7,7,,2,,2]
				}
			}
		]
	});
	
	$('.td-dayUse').append('<span id="spanTipDayUse">'+ parent.lang.alarm_disk_unit_mb +'</span>');
	$('.td-dayUseVideo').append('<span id="spanTipDayUseVideo">'+ parent.lang.alarm_disk_unit_mb +'</span>');
	$('.td-monthUse').append('<span id="spanTipMonthUse">'+ parent.lang.alarm_disk_unit_mb +'</span>');
	$('.td-monthUseVideo').append('<span id="spanTipMonthUseVideo">'+ parent.lang.alarm_disk_unit_mb +'</span>');
	$('.td-monthSurplus').append('<span id="spanTipMonthSurplus">'+ parent.lang.alarm_disk_unit_mb +'</span>');
	$('.td-settlementDayFrom').append('<span id="spanTipSettlementDayFrom">'+ parent.lang.day +'</span>');
	
	$('.td-settlementDay').append('<span id="spanTipSettlementDay" class="red">'+ parent.lang.flowSettlementDayPerMonth +'</span>');
	$('.td-monthLimit').append('<span id="spanTipMonthLimit">'+ parent.lang.alarm_disk_unit_mb +'</span><span class="red">'+ parent.lang.flowNotLimit +'</span>');
	$('.td-dayLimit').append('<span id="spanTipDayLimit">'+ parent.lang.alarm_disk_unit_mb +'</span><span class="red">'+ parent.lang.flowNotLimit +'</span>');
	$('.td-dayRemind').append('<span id="spanTipDayLimit">'+ parent.lang.flowPercentage +'</span><span class="red">'+ parent.lang.flowNotLimit +'</span>');
	$('.td-monthRemind').append('<span id="spanTipDayLimit">'+ parent.lang.flowPercentage +'</span><span class="red">'+ parent.lang.flowNotLimit +'</span>');
	
	$('.td-overLimitOpen').append('<span class="red">'+ parent.lang.flowOverLimitTip +'</span>');
	
	$('.td-monitorOpen').prepend(addRadio('monitorOpen', false));
	$('.td-dayRemindOpen').prepend(addRadio('dayRemindOpen', true));
	$('.td-monthRemindOpen').prepend(addRadio('monthRemindOpen', true));
	$('.td-overLimitOpen').prepend(addRadio('overLimitOpen', true));
	
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
}

//添加 radio选项
function addRadio(name, disabled) {
	var content = '';
	var disabledStr = '';
	if(disabled) {
		disabledStr = "disabled";
	}
	content += '<input id="'+name+'-yes" name="'+name+'" type="radio" value="1" '+disabledStr+'/>';
	content += '<label id="label-'+name+'-yes" for="'+name+'-yes">'+parent.lang.yes+'</label>';
	content += '<input id="'+name+'-no" name="'+name+'" type="radio" value="0" style="margin-left: 10px;" checked '+disabledStr+'/>';
	content += '<label id="label-'+name+'-no" for="'+name+'-no">'+parent.lang.no+'</label>';
	return content;
}


//点击开启流量监控
function clickMonitorOpen() {
	var temp = $("input[name='monitorOpen']:checked").val();
	if (temp != "1") {
		$('#flowConfig input').each(function() {
			if(this.name != 'monitorOpen') {
				disableButton(this, true);
			}
		});
	} else {
		$('#flowConfig input').each(function() {
			if(this.name != 'monitorOpen' && this.name != 'dayRemind' && this.name != 'monthRemind') {
				disableButton(this, false);
				if(this.name == 'dayRemindOpen') {
					clickDayRemindOpen();
				}else if(this.name == 'monthRemindOpen') {
					clickMonthRemindOpen();
				}
			}
		});
	}
}

//点击开启每日提醒
function clickDayRemindOpen() {
	var temp = $("input[name='dayRemindOpen']:checked").val();
	if (temp != "1") {
		disableButton('#input-dayRemind', true);
	} else {
		disableButton('#input-dayRemind', false);
	}
}

//点击开启每月提醒
function clickMonthRemindOpen() {
	var temp = $("input[name='monthRemindOpen']:checked").val();
	if (temp != "1") {
		disableButton('#input-monthRemind', true);
	} else {
		disableButton('#input-monthRemind', false);
	}
}

//加载流量信息
function ajaxLoadFlowInfo() {
	var vehicle = parent.vehicleManager.getVehicle(vehiIdno.toString());
	if(vehicle == null) {
		return;
	}
	if(vehicle.getDevList().length == 1) {
		device = vehicle.getGpsDevice();
	}else {
		device = vehicle.getVideoDevice();
	}
	if(device == null) {
		return;
	}
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("StandardFlowAction_getFlowInfo.action?devIdno=" + device.getIdno(), function(json,action,success){
		if (success) {
			var fuse = json.fuse; //使用情况
			var fconfig = json.fconfig; //配置情况
			//分解流量使用情况
			if(fuse != null) {
				if(fuse.cdu) {
					$('#input-dayUse').val(fuse.cdu.toFixed(2));
				}else {
					$('#input-dayUse').val('0.00');
				}
				if(fuse.cdvu) {
					$('#input-dayUseVideo').val(fuse.cdvu.toFixed(2));
				}else {
					$('#input-dayUseVideo').val('0.00');
				}
				if(fuse.cmu) {
					$('#input-monthUse').val(fuse.cmu.toFixed(2));
				}else {
					$('#input-monthUse').val('0.00');
				}
				if(fuse.cmvu) {
					$('#input-monthUseVideo').val(fuse.cmvu.toFixed(2));
				}else {
					$('#input-monthUseVideo').val('0.00');
				}
			}else {
				$('#input-dayUse').val('0.00');
				$('#input-dayUseVideo').val('0.00');
				$('#input-monthUse').val('0.00');
				$('#input-monthUseVideo').val('0.00');
			}
			//本月剩余
			var flowml = 0;
			if(fconfig != null && fconfig.fml) {
				flowml = fconfig.fml;
			}
			var flowmu = 0;
			if(fuse != null && fuse.cmu) {
				flowmu = fuse.cmu;
			}
			$('#input-monthSurplus').val((flowml - flowmu).toFixed(2));
			//距离结算日期
			var disDays = 0;
			var nmtd = 1;//结算日期
			if(fconfig != null && fconfig.nmtd != null && fconfig.nmtd != 0) {
				nmtd = Number(fconfig.nmtd);
			}
			var curDate = new Date();  //现在的时间
			var day = Number(dateFormat2DateString(curDate).substring(8, 10));
			if(day < nmtd) {
				var nowMaxDay = getCountDays(curDate); //本月最大天数
				if(nmtd >= nowMaxDay) {
					nmtd = nowMaxDay;
				}
				disDays = nmtd - day;
			}else if(day > nmtd) {
				var nowMaxDay = getCountDays(curDate); //本月最大天数
				var nextDate = dateGetNextMonthEx();
				var nextMaxDay = getCountDays(nextDate); //本月最大天数
				if(nmtd >= nextMaxDay) {
					nmtd = nextMaxDay;
				}
				disDays = nowMaxDay - day + nmtd;
			}
			$('#input-settlementDayFrom').val(disDays);
			//分解流量配置情况fconfig
			if(fconfig != null && fconfig.nofc != null  && fconfig.nofc == 1) {
				//开启流量监控
				$("#monitorOpen-yes").get(0).checked = true;
				clickMonitorOpen();
				if(fconfig.nmtd) {
					$('#input-settlementDay').val(fconfig.nmtd);
				}else {
					$('#input-settlementDay').val(0);
				}
				if(fconfig.fml) {
					$('#input-monthLimit').val(fconfig.fml);
				}else {
					$('#input-monthLimit').val(0);
				}
				if(fconfig.fdl) {
					$('#input-dayLimit').val(fconfig.fdl);
				}else {
					$('#input-dayLimit').val(0);
				}
				if(fconfig.nodfr != null  && fconfig.nodfr == 1) {
					$("#dayRemindOpen-yes").get(0).checked = true;
					clickDayRemindOpen();
					if(fconfig.ndr) {
						$('#input-dayRemind').val(fconfig.ndr);
					}else {
						$('#input-dayRemind').val(0);
					}
				}else {
					$("#dayRemindOpen-no").get(0).checked = true;
					clickDayRemindOpen();
					$('#input-dayRemind').val(0);
				}
				if(fconfig.nomfr != null  && fconfig.nomfr == 1) {
					$("#monthRemindOpen-yes").get(0).checked = true;
					clickMonthRemindOpen();
					if(fconfig.nmr) {
						$('#input-monthRemind').val(fconfig.nmr);
					}else {
						$('#input-monthRemind').val(0);
					}
				}else {
					$("#monthRemindOpen-no").get(0).checked = true;
					clickMonthRemindOpen();
					$('#input-monthRemind').val(0);
				}
				if(fconfig.nflt != null  && fconfig.nflt == 1) {
					$('#overLimitOpen-yes').get(0).checked = true;
					overFlowLimitOpen = 1;
				}else {
					$('#overLimitOpen-no').get(0).checked = true;
					overFlowLimitOpen = 0;
				}
			}else {
				$("#monitorOpen-no").get(0).checked = true;
				clickMonitorOpen();
				$('#input-settlementDay').val(0);
				$('#input-monthLimit').val(0);
				$('#input-dayLimit').val(0);
				$("#dayRemindOpen-no").get(0).checked = true;
				$('#input-dayRemind').val(0);
				$("#monthRemindOpen-no").get(0).checked = true;
				$('#input-monthRemind').val(0);
				$('#overLimitOpen-no').get(0).checked = true;
				overFlowLimitOpen = 0;
			}
		}
		$.myajax.showLoading(false);
		disableForm(false);
		$.dialog.tips(parent.lang.loadok, 1);
	}, null);
}

//保存参数配置
function ajaxSetupFlowConfig() {
	var data={};
	//设备号
	data.did = device.getIdno();
	//流量监控
	var monitorOpen = $("input[name='monitorOpen']:checked").val();
	data.nofc = monitorOpen;
	//如果开启流量监控
	if(monitorOpen == '1') {
		//结算日
		var settlementDay = Number($.trim($('#input-settlementDay').val()));
		if(settlementDay < 1 || settlementDay > 31) {
			$.dialog.tips(parent.lang.flowErrorSettlementDay, 1);
			$('#input-settlementDay').focus();
			return;
		}
		data.nmtd = settlementDay;
		//每月套餐限额
		var monthLimit = Number($.trim($('#input-monthLimit').val()));
		if(monthLimit < 0 || monthLimit > 1024000) {
			$.dialog.tips(parent.lang.flowErrorMonthLimit, 1);
			$('#input-monthLimit').focus();
			return;
		}
		data.fml = monthLimit;
		//每日限额
		var dayLimit = Number($.trim($('#input-dayLimit').val()));
		if(dayLimit < 0 || dayLimit > 1024000) {
			$.dialog.tips(parent.lang.flowErrorDayLimit, 1);
			$('#input-dayLimit').focus();
			return;
		}
		data.fdl = dayLimit;
		//日流量提醒
		var dayRemindOpen = $("input[name='dayRemindOpen']:checked").val();
		data.nodfr = dayRemindOpen;
		//如果开启日流量提醒
		if(dayRemindOpen == '1') {
			var dayRemind = $.trim($('#input-dayRemind').val());
			data.ndr = dayRemind;
		}
		//月流量提醒
		var monthRemindOpen = $("input[name='monthRemindOpen']:checked").val();
		data.nomfr = monthRemindOpen;
		//如果开启月流量提醒
		if(monthRemindOpen == '1') {
			var monthRemind = $.trim($('#input-monthRemind').val());
			data.nmr = monthRemind;
		}
		//流量限制
		var overLimitOpen = $("input[name='overLimitOpen']:checked").val();
		data.nflt = overLimitOpen;
		overFlowLimitOpen = overLimitOpen;
	}
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action = 'StandardFlowAction_saveConfig.action';
	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			device.setFlowLimitType(overFlowLimitOpen);
			$.dialog.tips(parent.lang.saveok, 1);
		}
	});
}

//刷新信息
function ajaxRefreshFlowConfig() {
	ajaxLoadFlowInfo();
}

//保存到其他设备
function ajaxSaveFlowConfigToOther() {
	$.dialog({id:'flowToOther', title: parent.lang.save_to_other, content: 'url:LocationManagement/flowToOther.html',
		width: '400px', height: '630px', min:true, max:false, lock:true,fixed:false
			, resize:false, close: false });
}

//加载页面信息
function initPageInfo(vehiIdno_) {
	vehiIdno = vehiIdno_;
	overFlowLimitOpen = 0;
	device = null;
	ajaxLoadFlowInfo();
}

function saveToOtherSuccess() {
	$.dialog({id:'flowToOther'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}