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
	
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip: '',hide:false,tabshide:false},
				colgroup:{width:['120px','250px']},
				tabs:{
					display: [parent.lang.rule_name,parent.lang.rule_parkTime,parent.lang.rule_timeRange,parent.lang.rule_voiceAlarm],
					name : ['ruleName','parkTime','beginTime','voice'],
					type:['input','input','input','textArea'],
					length:[40,4,10]
				}
			},{
				title :{display: parent.lang.rule_cameraAndVideo,pid : 'required-camera',tip:'',hide:false,tabshide:false},
				colgroup:{width:['120px','250px']},
				tabs:{
					display: [parent.lang.rule_isCamera,parent.lang.rule_cameraWebcam,parent.lang.rule_videoTime,parent.lang.rule_videoWebcam],
					name : ['camera','cameraWebcam','video','videoWebcam'],
					type:['','','input',''],
					length:[,,4]
				}
			},{
				title :{display: parent.lang.rule_messageAndMail,pid : 'required-phone',tip: '*',hide:false,tabshide:true},
				colgroup:{width:['120px','250px']},
				tabs:{
					display: [parent.lang.rule_phone,parent.lang.rule_mail],
					name : ['phone','mail'],
					type:['textArea','textArea'],
					length:[]
				}
			}
		]
	});
	
	//加载页面属性
	loadRuleParam();
	$('.td-parkTime').append('<span class="span-tip red parkTimeTip">*</span><span id="parkTimeUnit">'+parent.lang.rule_parkTimeTip+'</span>');
	//输入框限制
	enterDigital('#input-parkTime');
	
	//加载用户信息
	ajaxLoadRuleInfo();
	
	$('body').click(function() {
		checkVideoTime();
	});
	$('.submit','#toolbar-btn').on('click',saveRule);
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'ruleinfo'}).close();
	});
	$('.reset','#toolbar-btn').on('click',function(){
		var url = 'RulesManagement/ParkingTooLongInfo.html?id='+getUrlParameter('id')+'&type='+type+'&ruleType='+ruleType;
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
		$('#input-parkTime').val(60);
		$("#input-beginTime").val("00:00:00");
		$("#input-endTime").val("23:59:59");
		$('#camera-no').get(0).checked = true;
		$('#input-video').val(0);
	}else {
		if(type != 'edit') {
			$('#info-mid-table input,#info-mid-table textarea').each(function(){
				this.disabled = true;
			});
		}
		$('#input-ruleName').val(params.name);
		if(params.beginTime != null) {
			$("#input-beginTime").val(second2ShortHourEx(params.beginTime));
		}else {
			$("#input-beginTime").val("00:00:00");
		}
		if(params.endTime != null) {
			$("#input-endTime").val(second2ShortHourEx(params.endTime));
		}else {
			$("#input-endTime").val("23:59:59");
		}
		if(params.param) {
			var param = params.param.split(',');
			$('#input-parkTime').val(param[0]);
			if(param[1] && param[1] == 1) {
				$('#camera-yes').get(0).checked = true;
			}else {
				$('#camera-no').get(0).checked = true;
			}
			if(param[2] != null) {
				var index = 0;
				$('.td-cameraWebcam .camera').find('input').each(function(i) {
					if(param[2].substring(i, i+1) == 1) {
						$('#checkbox-camera'+parseInt(i+1)).get(0).checked = true;
						index ++;
					}
				});
				if(index == 8) {
					$('#checkbox-cameraAll').get(0).checked = true;
				}
			}
			if(param[3]) {
				$('#input-video').val(param[3]);
			}else {
				$('#input-video').val(0);
			}
			if(param[4] != null) {
				var index = 0;
				$('.td-videoWebcam .video').find('input').each(function(i) {
					if(param[4].substring(i, i+1) == 1) {
						$('#checkbox-video'+parseInt(i+1)).get(0).checked = true;
						index ++;
					}
				});
				if(index == 8) {
					$('#checkbox-videoAll').get(0).checked = true;
				}
			}
			if(param[5]) {
				$('#textArea-phone').val(param[5]);
			}
			if(param[6]) {
				$('#textArea-mail').val(param[6]);
			}
		}
		$('#textArea-voice').val(params.text);
	}
}

function checkRuleParam() {
	var flag = true;
	checkVideoTime();
	if($('#input-ruleName').val() == null || $('#input-ruleName').val() == '') {
		$('#required-area .panel-body').addClass('show');
		$('#input-ruleName').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_nameNotNull, 2);
	}
	if(flag && ($('#input-parkTime').val() == null || $('#input-parkTime').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#input-parkTime').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_parkTimeNotNull, 2);
	}
	if(flag && (parseIntDecimal($('#input-parkTime').val()) < 60 || parseIntDecimal($('#input-parkTime').val() > 9999))) {
		$('#required-area .panel-body').addClass('show');
		$('#input-parkTime').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_parkTimeNotInScope, 2);
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
	data.param = parseIntDecimal($('#input-parkTime').val());
	//保存规则属性
	ajaxSaveRule(data);
}