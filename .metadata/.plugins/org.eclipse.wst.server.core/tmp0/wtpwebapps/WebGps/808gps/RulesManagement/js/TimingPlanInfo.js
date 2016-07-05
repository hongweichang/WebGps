var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var ruleType = getUrlParameter('ruleType');
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
    
	$('#toolbar-btn').flexPanel({
		ButtonsModel : getButtonArray(type) 
	});

	var tab_display = [parent.lang.rule_name,parent.lang.rule_timeRange+'1',parent.lang.rule_timeRange+'2'];
	var tab_name = ['ruleName','beginTime1','beginTime2'];
	var tab_type = ['input','input','input'];
	var tab_length = [40,10,10];
	
	if(ruleType == '8') {
		tab_display.push(parent.lang.rule_captureMode);
		tab_name.push('modeType');
		tab_type.push('');
		tab_length.push('');
		tab_display.push(parent.lang.rule_captureInterval);
		tab_name.push('interval');
		tab_type.push('input');
		tab_length.push(4);
	}else if(ruleType == '9') {
		tab_display.push(parent.lang.rule_streamType);
		tab_name.push('streamType');
		tab_type.push('');
		tab_length.push('');
	}else if(ruleType == '10') {
		tab_display.push(parent.lang.rule_downType);
		tab_name.push('downType');
		tab_type.push('');
		tab_length.push('');
		tab_display.push(parent.lang.rule_alarmType);
		tab_name.push('alarmType');
		tab_type.push('');
		tab_length.push('');
	}
	
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip: '',hide:false,tabshide:false},
				colgroup:{width:['120px','250px']},
				tabs:{
					display: tab_display,
					name : tab_name,
					type: tab_type,
					length: tab_length
				}
			}
		]
	});

	if(ruleType == '8') {//定时抓拍
		$('.td-modeType').flexPanel({
			ComBoboxModel :{
				input : {name : 'modeType',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'modeType', option : arrayToStr(getModeTypes())}
			}	
		});
		$('#combox-modeType').val(getArrayName(getModeTypes(),1));
		$('#hidden-modeType').val(1);
		$('.td-interval').append('<span class="span-tip red">*</span><span id="span-interval">'+parent.lang.rule_parkTimeTip+'</span>');
		//输入框限制
		enterDigital('#input-interval');
		$('#input-interval').val(300);
	}else if(ruleType == '9') {//定时录像
		$('.td-streamType').flexPanel({
			ComBoboxModel :{
				input : {name : 'streamType',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'streamType', option : arrayToStr(getDTypes())}
			}	
		});
		$('#combox-streamType').val(getArrayName(getDTypes(),1));
		$('#hidden-streamType').val(1);
	}else if(ruleType == '10') {//WiFi下载
		$('.td-downType').flexPanel({
			ComBoboxModel :{
				input : {name : 'downType',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'downType', option : arrayToStr(getDownTypes())}
			}	
		});
		$('#combox-downType').val(getArrayName(getDownTypes(),1));
		$('#hidden-downType').val(1);
		
		$('.td-alarmType').parent().hide();
		var alarmType = '';
			alarmType += '<div class="module alarmType">';
			alarmType += '	<input type="checkbox" class="ioType selectAlarmType" name="ioType" id="ioType" value="1" style="float: left;">';
			alarmType += '	<label id="ioAlarm" for="ioType">'+parent.lang.rule_alarm_io+'</label>';
			alarmType += '</div>';
			alarmType += '<div class="module alarmType">';
			alarmType += '	<input type="checkbox" class="speedType selectAlarmType" name="speedType" id="speedType" value="1" style="float: left;">';
			alarmType += '	<label id="speedAlarm" for="speedType">'+parent.lang.rule_alarm_overspeed+'</label>';
			alarmType += '</div>';
			alarmType += '<div class="module alarmType">';
			alarmType += '	<input type="checkbox" class="gSensorType selectAlarmType" name="gSensorType" id="gSensorType" value="1" style="float: left;">';
			alarmType += '	<label id="gSensorAlarm" for="gSensorType">'+parent.lang.rule_alarm_sensor+'</label>';
			alarmType += '</div>';
			alarmType += '<div class="module alarmType">';
			alarmType += '	<input type="checkbox" class="tempType selectAlarmType" name="tempType" id="tempType" value="1" style="float: left;">';
			alarmType += '	<label id="tempAlarm" for="tempType">'+parent.lang.rule_alarm_temperator+'</label>';
			alarmType += '</div>';
			alarmType += '<div class="module alarmType">';
			alarmType += '	<input type="checkbox" class="motionType selectAlarmType" name="motionType" id="motionType" value="1" style="float: left;">';
			alarmType += '	<label id="motionAlarm" for="motionType">'+parent.lang.rule_alarm_motion+'</label>';
			alarmType += '</div>';
			alarmType += '<div class="module alarmType">';
			alarmType += '	<input type="checkbox"	class="upsCutType selectAlarmType" name="upsCutType" id="upsCutType" value="1" style="float: left;">';
			alarmType += '	<label id="upsCutAlarm" for="upsCutType">'+parent.lang.rule_alarm_upsCut+'</label>';
			alarmType += '</div>';
		$('.td-alarmType').append(alarmType);
		
		var allAlarmType = '';
			allAlarmType += '<div class="module alarmTypeAll">';
			allAlarmType += '	<label for="checkbox-alarmTypeAll">'+parent.lang.selectAll+'</label>';
			allAlarmType += '	<input type="checkbox" style="float:right;" class="checkbox-alarmTypeAll" id="checkbox-alarmTypeAll" value="1" name="alarmTypeAll">';
			allAlarmType += '</div>';
		$('.td-alarmType').parent().find('th').append(allAlarmType);
		
		//全选和反选
		$('.alarmTypeAll').on('click',function() {
			var value = $("input[name='alarmTypeAll']:checked").val();
			if(value != null && value != '' && value == 1) {
				$('.td-alarmType .alarmType').find('input').each(function(i) {
					this.checked = true;
				});
			}else {
				$('.td-alarmType .alarmType').find('input').each(function(i) {
					this.checked = false;
				});
			}
		});
		$('.td-alarmType .alarmType').find('input').each(function() {
			$(this).on('click',function() {
				if(this.checked) {
					var flag = true;
					$('.td-alarmType .alarmType').find('input').each(function() {
						if(!this.checked) {
							flag = false;
						}
					});
					if(flag) {
						$('.checkbox-alarmTypeAll').get(0).checked = true;
					}else {
						$('.checkbox-alarmTypeAll').get(0).checked = false;
					}
				}else {
					$('.checkbox-alarmTypeAll').get(0).checked = false;
				}
			});
		});
		//报警类型的隐藏和显示
		$('#select-downType .ui-menu-item').each(function() {
			$(this).on('click',function() {
				if($(this).attr('data-index') == '4' || $(this).attr('data-index') == '5') {
					$('.td-alarmType').parent().show();
				}else {
					$('.td-alarmType').parent().hide();
				}
			});
		});
	}
	
	//加载页面属性
	$('.td-beginTime1').append('<span style="float:left;margin:2px 8px;">'+parent.lang.rule_to+'</span><input id="input-endTime1" class="form-input input-endTime1" name="endTime1" data-name="endTime1" maxlength="10"/>');
	$('.td-beginTime2').append('<span style="float:left;margin:2px 8px;">'+parent.lang.rule_to+'</span><input id="input-endTime2" class="form-input input-endTime2" name="endTime2" data-name="endTime2" maxlength="10"/>');
	$("#input-beginTime1").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'}) });
	$("#input-endTime1").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'}) });
	$("#input-beginTime2").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'}) });
	$("#input-endTime2").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'}) });
	$('#input-beginTime1').addClass('Wdate');
	$('#input-beginTime1').attr('readonly','readonly');
	$('#input-endTime1').addClass('Wdate');
	$('#input-endTime1').attr('readonly','readonly');
	$('#input-beginTime2').addClass('Wdate');
	$('#input-beginTime2').attr('readonly','readonly');
	$('#input-endTime2').addClass('Wdate');
	$('#input-endTime2').attr('readonly','readonly');
	
	$('.td-ruleName').append('<span class="span-tip red">*</span>');
	
	
	//加载用户信息
	ajaxLoadRuleInfo();
	
	$('.submit','#toolbar-btn').on('click',saveRule);
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'ruleinfo'}).close();
	});
	$('.reset','#toolbar-btn').on('click',function(){
		var url = 'RulesManagement/TimerRecordingInfo.html?id='+getUrlParameter('id')+'&type='+type+'&ruleType='+ruleType;
		if(type == 'edit') {
			url += '&id='+getUrlParameter('id');
		}
		$('.ui_dialog',parent.document).find('iframe').attr('src',url);
	});
}

function ajaxLoadRuleInfo() {
	if(type == 'add') {
		loadRuleInfo();
	}else {
		var action = 'StandardVehicleRuleAction_findVehicleRule.action?id='+getUrlParameter('id');
		disableForm(true);
		$.myajax.showLoading(true, parent.lang.loading, this);
		$.myajax.jsonGetEx(action, function(json,action,success){
			if (success) {
				if (!$.isEmptyObject(json.rule)) {
					loadRuleInfo(json.rule);
				}
			}
			$.myajax.showLoading(false);
			disableForm(false);
		});
	}
}

function loadRuleInfo(params) {
	if(type == 'add') {
		$("#input-beginTime1").val("00:00:00");
		$("#input-endTime1").val("23:59:59");
		$("#input-beginTime2").val("00:00:00");
		$("#input-endTime2").val("00:00:00");
	}else {
		if(type != 'edit') {
			$('#info-mid-table input').each(function(){
				this.disabled = true;
			});
		}
		$('#input-ruleName').val(params.name);
		if(params.param) {
			var param = params.param.split(',');
			if(param.length > 0 && param[0] != null) {
				$("#input-beginTime1").val(second2ShortHourEx(param[0]));
			}else {
				$("#input-beginTime1").val("00:00:00");
			}
			if(param.length > 1 && param[1] != null) {
				$("#input-endTime1").val(second2ShortHourEx(param[1]));
			}else {
				$("#input-endTime1").val("23:59:59");
			}
			if(param.length > 2 && param[2] != null) {
				$("#input-beginTime2").val(second2ShortHourEx(param[2]));
			}else {
				$("#input-beginTime2").val("00:00:00");
			}
			if(param.length > 3 && param[3] != null) {
				$("#input-endTime2").val(second2ShortHourEx(param[3]));
			}else {
				$("#input-endTime2").val("00:00:00");
			}
			if(ruleType == '8') {//定时抓拍
				if(param.length > 4 && param[4] != null) {
					$('#combox-modeType').val(getArrayName(getModeTypes(),param[4]));
					$('#hidden-modeType').val(param[4]);
				}	
				if(param.length > 5 && param[5] != null) {
					$('#input-interval').val(param[5])
				}
			}else if(ruleType == '9') {
				if(param.length > 4 && param[4] != null) {
					var stream = param[4];
					if(stream != 1) {
						stream = 0;	
					}
					$('#combox-streamType').val(getArrayName(getDTypes(),stream));
					$('#hidden-streamType').val(stream)
				}
			}else if(ruleType == '10') {
				if(param.length > 4 && param[4] != null) {
					$('#combox-downType').val(getArrayName(getDownTypes(),param[4]));
					$('#hidden-downType').val(param[4]);
				}
				if(param.length > 5 && param[5] != null) {
					$('.td-alarmType').parent().show();
					var alarmType = parseInt(param[5]).toString(2);
					if(alarmType.length<2) {
						alarmType = '00000'+alarmType;
					}else if(alarmType.length<3) {
						alarmType = '0000'+alarmType;
					}else if(alarmType.length<4) {
						alarmType = '000'+alarmType;
					}else if(alarmType.length<5) {
						alarmType = '00'+alarmType;
					}else if(alarmType.length<6) {
						alarmType = '0'+alarmType;
					}
					var index = 0;
					$('.td-alarmType .alarmType').find('input').each(function(i) {
						if(alarmType.substring(i, i+1) == 1) {
							this.checked = true;
							index ++;
						}
					});
					if(index == 6) {
						$('#checkbox-alarmTypeAll').get(0).checked = true;
					}
				}
			}
		}
	}
}

function checkRuleParam() {
	var flag = true;
	if($('#input-ruleName').val() == null || $('#input-ruleName').val() == '') {
		$('#input-ruleName').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_nameNotNull, 2);
	}
	if(flag && ruleType == '8' && ($('#input-interval').val() == null || $('#input-interval').val() == '')) {
		$('#input-interval').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_captureTimeNotNull, 2);
	}
	if(flag && ruleType == '8' && (parseIntDecimal($('#input-interval').val()) < 60 || parseIntDecimal($('#input-interval').val() > 9999))) {
		$('#input-interval').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_captureTimeNotInScope, 2);
	}
	if(flag && ruleType == '10' && ( $('#hidden-downType').val() == '4' || $('#hidden-downType').val() == '5')) {
		flag = false;
		$('.td-alarmType .alarmType').find('input').each(function(i) {
			if(this.checked) {
				flag = true;
			}
		});
		if(!flag) {
			$.dialog.tips(parent.lang.alarm_type_tip_select, 2);
		}
	}
	return flag;
}

function saveRule() {
    if(!checkRuleParam()) {
		return;
	}
	var data = {};
	if(type == 'edit') {
		data.id = $.trim(getUrlParameter('id'));
	}
	data.name = $.trim($('#input-ruleName').val());
	data.type = $.trim(ruleType);
	var beginTime1 = shortHour2Second($.trim($("#input-beginTime1").val()));
	var endTime1 = shortHour2Second($.trim($("#input-endTime1").val()));

	var beginTime2 = shortHour2Second($.trim($("#input-beginTime2").val()));
	var endTime2 = shortHour2Second($.trim($("#input-endTime2").val()));

	if(beginTime1 > endTime1) {
		$('#input-beginTime1').focus();
		$.dialog.tips(parent.lang.rule_startTimeNotThanEnd, 2);
		return;
	}
	if(endTime1 == 0) {
		$('#input-endTime').focus();
		$.dialog.tips(parent.lang.rule_endTimeNotZero, 2);
		return;
	}

	if(beginTime2 > endTime2) {
		$('#input-beginTime2').focus();
		$.dialog.tips(parent.lang.rule_startTimeNotThanEnd, 2);
		return;
	}
	data.param = beginTime1 + ',' + endTime1 + ',' + beginTime2 + ',' + endTime2;

	if(ruleType == '8') {//定时抓拍
		var mode = $.trim($('#hidden-modeType').val());
		var interval = parseIntDecimal($('#input-interval').val());
		data.param = data.param + ',' + mode + ',' + interval;
	}else if(ruleType == '9') {
		var streamType = $.trim($('#hidden-streamType').val());
		data.param = data.param + ',' + streamType;
	}else if(ruleType == '10') {
		var downType = $.trim($('#hidden-downType').val());
		data.param = data.param + ',' + downType;
		if(downType == '4' || downType == '5') {
			var alarmType = '';
			$('.td-alarmType .alarmType').find('input').each(function(i) {
				var name = $.trim($(this).attr('name'));
				var value = $.trim($("input[name='"+name+"']:checked").val());
				if(value != null && value != '') {
					alarmType = alarmType + value;
				}else {
					alarmType = alarmType + '0';
				}
			});
			data.param = data.param + ',' + parseInt(alarmType,2);
		}
	}
	var action = 'StandardVehicleRuleAction_mergeVehicleRule.action';
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.doSaveRuleSuc();
		}
	});
}

function getDTypes() {
	var types = [];
	types.push({id:0,name: parent.lang.rule_streamMain});//主码流
	types.push({id:1,name: parent.lang.rule_streamSub});//子码流
	return types;
}

function getModeTypes() {
	var types = [];
	types.push({id:1,name: parent.lang.rule_modeCycle});//循环抓拍
	types.push({id:2,name: parent.lang.rule_modeAlone});//独立抓拍
	return types;
}

function getDownTypes() {
	var types = [];
	types.push({id:1,name: parent.lang.all});//所有
	types.push({id:2,name: parent.lang.rule_video});//录像
	types.push({id:3,name: parent.lang.rule_picture});//图片
	types.push({id:4,name: parent.lang.rule_alarmVideo});//报警录像
	types.push({id:5,name: parent.lang.rule_alarmPicture});//报警图片
	return types;
}