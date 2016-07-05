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
					display: [parent.lang.rule_name,parent.lang.rule_timeRange,parent.lang.rule_voiceAlarm,parent.lang.alarm_road_highway,parent.lang.alarm_road_city_highway,
					          parent.lang.alarm_road_state,parent.lang.alarm_road_provincial,parent.lang.alarm_road_county,parent.lang.alarm_road_township,
					          parent.lang.alarm_road_other,parent.lang.alarm_road_nine],
					name : ['ruleName','beginTime','voice','highway','cityhighway','state','provincial','county','township','other','nine'],
					type:['input','input','textArea','input','input','input','input','input','input','input','input'],
					length:[40,10,,3,3,3,3,3,3,3,3]
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
	
	//加载用户信息
	ajaxLoadRuleInfo();
	
	appendTip();
	
	$('body').click(function() {
		checkVideoTime();
	});
	enterDigital($('#input-highway'));
	enterDigital($('#input-cityhighway'));
	enterDigital($('#input-state'));
	enterDigital($('#input-provincial'));
	enterDigital($('#input-county'));
	enterDigital($('#input-township'));
	enterDigital($('#input-other'));
	enterDigital($('#input-nine'));
	$('#input-highway').val(0);
	$('#input-cityhighway').val(0);
	$('#input-state').val(0);
	$('#input-provincial').val(0);
	$('#input-county').val(0);
	$('#input-township').val(0);
	$('#input-other').val(0);
	$('#input-nine').val(0);
	$('.submit','#toolbar-btn').on('click',saveRule);
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'ruleinfo'}).close();
	});
	$('.reset','#toolbar-btn').on('click',function(){
		var url = 'RulesManagement/RoadGradeInfo.html?id='+getUrlParameter('id')+'&type='+type+'&ruleType='+ruleType;
		if(type == 'edit') {
			url += '&id='+getUrlParameter('id');
		}
		$('.ui_dialog',parent.document).find('iframe').attr('src',url);
	});
}

function appendTip(){
	$('.td-highway').append('<span class="red">'+parent.lang.speedhighTip+'</span>');
	$('.td-cityhighway').append('<span class="red">'+parent.lang.speedhighTip+'</span>');
	$('.td-state').append('<span class="red">'+parent.lang.speedhighTip+'</span>');
	$('.td-provincial').append('<span class="red">'+parent.lang.speedhighTip+'</span>');
	$('.td-county').append('<span class="red">'+parent.lang.speedhighTip+'</span>');
	$('.td-township').append('<span class="red">'+parent.lang.speedhighTip+'</span>');
	$('.td-other').append('<span class="red">'+parent.lang.speedhighTip+'</span>');
	$('.td-nine').append('<span class="red">'+parent.lang.speedhighTip+'</span>');
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
		if(ruleType && ruleType == 15){
			$("#input-beginTime").val("02:00:00");
			$("#input-endTime").val("05:00:00");
		}else{
			$("#input-beginTime").val("00:00:00");
			$("#input-endTime").val("23:59:59");
		}
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
			if(ruleType && ruleType == 15){
				$("#input-beginTime").val("02:00:00");
			}else{
				$("#input-beginTime").val("00:00:00");
			}
		}
		if(params.endTime != null) {
			$("#input-endTime").val(second2ShortHourEx(params.endTime));
		}else {
			if(ruleType && ruleType == 15){
				$("#input-endTime").val("05:00:00");
			}else{
				$("#input-beginTime").val("00:00:00");
			}
		}
		if(params.param) {
			var sss = params.param.split('|');
			var param1 = null;
			var param2 = null;
			if(sss.length > 1) {
				param1 = sss[0]; 
			}
			param2 = sss[sss.length - 1];
			if(param1) {
				var speed = param1.split(',');
				$('#input-highway').val(speed[0]);
				$('#input-cityhighway').val(speed[1]);
				$('#input-state').val(speed[2]);
				$('#input-provincial').val(speed[3]);
				$('#input-county').val(speed[4]);
				$('#input-township').val(speed[5]);
				$('#input-other').val(speed[6]); 
				$('#input-nine').val(speed[7]);
			}else{
				$('#input-highway').val(0);
				$('#input-cityhighway').val(0);
				$('#input-state').val(0);
				$('#input-provincial').val(0);
				$('#input-county').val(0);
				$('#input-township').val(0);
				$('#input-other').val(0); 
				$('#input-nine').val(0);
			}
			
			var param = param2.split(',');
			if(param[0] && param[0] == 1) {
				$('#camera-yes').get(0).checked = true;
			}else {
				$('#camera-no').get(0).checked = true;
			}
			if(param[1] != null) {
				var index = 0;
				$('.td-cameraWebcam .camera').find('input').each(function(i) {
					if(param[1].substring(i, i+1) == 1) {
						$('#checkbox-camera'+parseInt(i+1)).get(0).checked = true;
						index ++;
					}
				});
				if(index == 8) {
					$('#checkbox-cameraAll').get(0).checked = true;
				}
			}
			if(param[2]) {
				$('#input-video').val(param[2]);
			}else {
				$('#input-video').val(0);
			}
			if(param[3] != null) {
				var index = 0;
				$('.td-videoWebcam .video').find('input').each(function(i) {
					if(param[3].substring(i, i+1) == 1) {
						$('#checkbox-video'+parseInt(i+1)).get(0).checked = true;
						index ++;
					}
				});
				if(index == 8) {
					$('#checkbox-videoAll').get(0).checked = true;
				}
			}
			if(param[4]) {
				$('#textArea-phone').val(param[4]);
			}
			if(param[5]) {
				$('#textArea-mail').val(param[5]);
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
	if(flag && ($('#input-highway').val() == null || $('#input-highway').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#input-ruleName').focus();
		flag = false;
		$.dialog.tips(parent.lang.highwayNotNull, 2);
	}
	if(flag && ($('#input-cityhighway').val() == null || $('#input-cityhighway').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#input-ruleName').focus();
		flag = false;
		$.dialog.tips(parent.lang.cityhighwayNotNull, 2);
	}
	if(flag && ($('#input-state').val() == null || $('#input-state').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#input-ruleName').focus();
		flag = false;
		$.dialog.tips(parent.lang.stateNotNull, 2);
	}
	if(flag && ($('#input-provincial').val() == null || $('#input-provincial').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#input-ruleName').focus();
		flag = false;
		$.dialog.tips(parent.lang.provincialNotNull, 2);
	}
	if(flag && ($('#input-county').val() == null || $('#input-county').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#input-ruleName').focus();
		flag = false;
		$.dialog.tips(parent.lang.countyNotNull, 2);
	}
	if(flag && ($('#input-township').val() == null || $('#input-township').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#input-ruleName').focus();
		flag = false;
		$.dialog.tips(parent.lang.townshipNotNull, 2);
	}
	if(flag && ($('#input-other').val() == null || $('#input-other').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#input-ruleName').focus();
		flag = false;
		$.dialog.tips(parent.lang.otherNotNull, 2);
	}
	if(flag && ($('#input-nine').val() == null || $('#input-nine').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#input-ruleName').focus();
		flag = false;
		$.dialog.tips(parent.lang.nineNotNull, 2);
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
	data.param = $('#input-highway').val() +"," + $('#input-cityhighway').val() + "," + $('#input-state').val() + "," + $('#input-provincial').val() + "," + $('#input-county').val() + "," + $('#input-township').val() + "," + $('#input-other').val() + "," + $('#input-nine').val() + "|";
	//保存规则属性
	ajaxSaveRule(data);
}