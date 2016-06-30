var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var ruleType = getUrlParameter('ruleType');
var markerList = [];
var areaList = [];
var pointList = [];
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
					display: [parent.lang.rule_name,parent.lang.rule_line,parent.lang.report_normal_beginPosition,parent.lang.report_normal_endPosition,parent.lang.rule_maxSpeed,parent.lang.rule_minSpeed,parent.lang.rule_radius,parent.lang.rule_timeRange,parent.lang.rule_voiceAlarm],
					name : ['ruleName','areaName','start','end','maxSpeed','minSpeed','offsetWidth','beginTime','voice'],
					type:['input','','','','input','input','input','input','textArea'],
					length:[40,,,,3,3,3,10]
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
	
	$('.td-offsetWidth').append('<span class="span-tip red offsetWidthTip">*</span><span id="offsetWidthUnit">'+parent.lang.rule_offsetWidthTip+'</span>');
	
	//加载页面属性
	loadRuleParam();
	$('.maxSpeedTip').hide();
	$('.minSpeedTip').hide();
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("StandardVehicleRuleAction_listMarker.action", function(json,action,success){
		if (success) {
			markerList = json.markers;
			//加载用户信息
			ajaxLoadRuleInfo();
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
	
	$('body').click(function() {
		checkVideoTime();
	});
	$('.td-areaName').append('<span id="createArea" class="manage" style="margin: 4px 0px -4px 10px;" title="'+parent.lang.mark_manage+'"></span>');
	$('#createArea').on('click',addArea);

	$('.submit','#toolbar-btn').on('click',saveRule);
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'ruleinfo'}).close();
	});
	$('.reset','#toolbar-btn').on('click',function(){
		var url = 'RulesManagement/LineRangeLimitInfo.html?id='+getUrlParameter('id')+'&type='+type+'&ruleType='+ruleType;
		if(type == 'edit') {
			url += '&id='+getUrlParameter('id');
		}
		$('.ui_dialog',parent.document).find('iframe').attr('src',url);
	});
}

//加载区域信息
function ajaxLoadMarker() {
	areaList = [];
	for(var i = 0; i < markerList.length; i++) {
		if(ruleType == 11) {
			if (markerList[i].markerType == 4) {
				areaList.push(markerList[i]);
			}
		}
	}
	$('.td-areaName').flexPanel({
		ComBoboxModel :{
			input : {name : 'areaName',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			combox: 
				{name : 'areaName', option : arrayToStr(areaList)}
		}	
	});
	
	$('#select-areaName li').each(function() {
		$(this).on('click',function() {
			var index= $(this).attr('data-index');
			var keyJingDuList = [];
			var keyWeiDuList = [];
			for(var j = 0;j < areaList.length; j++){
				if(areaList[j].id == index){
					keyJingDuList = areaList[j].jingDu.split(',');
					keyWeiDuList = areaList[j].weiDu.split(',');
				}
			}
			if(keyJingDuList != null && keyWeiDuList != null){
				pointList = [];
				for(var i = 0; i < keyJingDuList.length; i++){
					if(keyJingDuList[i] != null && keyWeiDuList[i] != null){
						var content = {};
						content.id = i;
						content.name = keyJingDuList[i] + ',' + keyWeiDuList[i];
						pointList.push(content);
					}
				}
			}
			$('.td-start').empty();
			$('#select-start').remove();
			$('.td-start').flexPanel({
				ComBoboxModel :{
					input : {name : 'start',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
					combox: 
						{name : 'start', option : arrayToStr(pointList)}
				}	
			});
			
			$('#select-start li').each(function(index) {
				$(this).prepend('<span>'+ (index + 1) +'</span>');
			});
			
			$('.td-end').empty();
			$('#select-end').remove();
			$('.td-end').flexPanel({
				ComBoboxModel :{
					input : {name : 'end',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
					combox: 
						{name : 'end', option : arrayToStr(pointList)}
				}	
			});
			$('#select-end li').each(function(index) {
				$(this).prepend('<span>'+ (index + 1) +'</span>');
			});
			$('.td-start').append('<span class="span-tip red areaNameTip">*</span>');
			$('.td-end').append('<span class="span-tip red areaNameTip">*</span>');
		});
	});
	
	$('.td-start').flexPanel({
		ComBoboxModel :{
			input : {name : 'start',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			combox: 
				{name : 'start', option : arrayToStr(pointList)}
		}	
	});
	$('.td-end').flexPanel({
		ComBoboxModel :{
			input : {name : 'end',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			combox: 
				{name : 'end', option : arrayToStr(pointList)}
		}	
	});
	$('.td-start').append('<span class="span-tip red areaNameTip">*</span>');
	$('.td-end').append('<span class="span-tip red areaNameTip">*</span>');
}

function reloadArea() {
//	var my = $.dialog({id:'vehicleinfo'}).get('vehicleinfo');
//	$.dialog({id:'vehicleinfo'}).reload(my,'url:RulesManagement/addAreaOrLine.html?ruleType='+ruleType);
	$.dialog({id:'vehicleinfo'}).close();
	addArea();
}

function addArea(){
	$.dialog({id:'vehicleinfo', title:parent.lang.manage_mark,content: 'url:RulesManagement/addAreaOrLine.html?markType='+2,
		width:'975px',height:'600px', min:false, max:true, lock:true,parent: api});
}

function doSelectArea(data,isclose){
	if(isclose == 1){
		$.dialog({id:'vehicleinfo'}).close();
	}
	$.myajax.jsonGet("StandardVehicleRuleAction_listMarker.action", function(json,action,success){
		if (success) {
			$('.td-areaName .btn-group').remove();
			$('.td-start .btn-group').remove();
			$('.td-end .btn-group').remove();
			$('.td-start .span-tip').remove();
			$('.td-end .span-tip').remove();
			$('#select-areaName').remove();
			markerList = json.markers;
			ajaxLoadMarker();
			$('#combox-areaName').val(data.name);
			$('#hidden-areaName').val(data.id);
			var keyJingDuList = [];
			var keyWeiDuList = [];
			keyJingDuList = data.jingDu.split(',');
			keyWeiDuList = data.weiDu.split(',');
			if(keyJingDuList != null && keyWeiDuList != null){
				pointList = [];
				for(var i = 0; i < keyJingDuList.length; i++){
					if(keyJingDuList[i] != null && keyWeiDuList[i] != null){
						var content = {};
						content.id = i;
						content.name = keyJingDuList[i] + ',' + keyWeiDuList[i];
						pointList.push(content);
					}
				}
			}
			$('.td-start').empty();
			$('#select-start').remove();
			$('.td-start').flexPanel({
				ComBoboxModel :{
					input : {name : 'start',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
					combox: 
						{name : 'start', option : arrayToStr(pointList)}
				}	
			});
			
			$('#select-start li').each(function(index) {
				$(this).prepend('<span>'+ (index) +'</span>');
			});
			
			$('.td-end').empty();
			$('#select-end').remove();
			$('.td-end').flexPanel({
				ComBoboxModel :{
					input : {name : 'end',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
					combox: 
						{name : 'end', option : arrayToStr(pointList)}
				}	
			});
			$('#select-end li').each(function(index) {
				$(this).prepend('<span>'+ (index) +'</span>');
			});
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function ajaxLoadRuleInfo() {
	if(type == 'add') {
		ajaxLoadMarker();
		loadRuleInfo();
	}else {
		var action = 'StandardVehicleRuleAction_findVehicleRule.action?id='+getUrlParameter('id');
		disableForm(true);
		$.myajax.showLoading(true, parent.lang.loading, this);
		$.myajax.jsonGetEx(action, function(json,action,success){
			if (success) {
				if (!$.isEmptyObject(json.rule)) {
					ajaxLoadMarker();
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
		$('#input-maxSpeed').val(0);
		$('#input-minSpeed').val(0);
		if(ruleType == 11) {
			$('#input-offsetWidth').val(50);
		}
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
			if(param[0] != null){
				$('#combox-areaName').val(getArrayName(areaList,param[0]));
				$('#hidden-areaName').val(param[0]);
			}
			if(param[1] != null && param[2] != null){
				$('#combox-start').val(param[1] + ',' + param[2]);
				$('#hidden-start').val(0);
			}
			if(param[3] != null && param[4] != null){
				$('#combox-end').val(param[3] + ',' + param[4]);
				$('#hidden-end').val(1);
			}
			if(param[5] != null) {
				$('#input-maxSpeed').val(param[5]);
			}else {
				$('#input-maxSpeed').val(0);
			}
			if(param[6] != null) {
				$('#input-minSpeed').val(param[6]);
			}else {
				$('#input-minSpeed').val(0);
			}
			if(param[7] != null){
				$('#input-offsetWidth').val(param[7]);
			}
			if(param[8] && param[8] == 1) {
				$('#camera-yes').get(0).checked = true;
			}else {
				$('#camera-no').get(0).checked = true;
			}
			if(param[9] != null) {
				var index = 0;
				$('.td-cameraWebcam .camera').find('input').each(function(i) {
					if(param[9].substring(i, i+1) == 1) {
						$('#checkbox-camera'+parseInt(i+1)).get(0).checked = true;
						index ++;
					}
				});
				if(index == 8) {
					$('#checkbox-cameraAll').get(0).checked = true;
				}
			}
			if(param[10]) {
				$('#input-video').val(param[10]);
			}else {
				$('#input-video').val(0);
			}
			if(param[11] != null) {
				var index = 0;
				$('.td-videoWebcam .video').find('input').each(function(i) {
					if(param[11].substring(i, i+1) == 1) {
						$('#checkbox-video'+parseInt(i+1)).get(0).checked = true;
						index ++;
					}
				});
				if(index == 8) {
					$('#checkbox-videoAll').get(0).checked = true;
				}
			}
			if(param[12]) {
				$('#textArea-phone').val(param[12]);
			}
			if(param[13]) {
				$('#textArea-mail').val(param[13]);
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
	if(flag && ($('#hidden-areaName').val() == null || $('#hidden-areaName').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#combox-areaName').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_lineNotNull, 2);
	}
	if(flag && ($('#combox-start').val() == null || $('#combox-start').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#combox-start').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_startNotNull, 2);
	}

	if(flag && ($('#combox-end').val() == null || $('#combox-end').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#combox-areaName').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_endNotNull, 2);
	}
	if(parseIntDecimal($('#hidden-start').val()) > parseIntDecimal($('#hidden-end').val())) {
		$('#required-area .panel-body').addClass('show');
		$('#input-minSpeed').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_startNotThanEnd, 2);
	}
	if(flag && ruleType == 11) {
		var i = 0;
		if($('#input-maxSpeed').val() == null || $('#input-maxSpeed').val() == '' || parseIntDecimal($('#input-maxSpeed').val()) == 0) {
			i++;
		}
		if($('#input-minSpeed').val() == null || $('#input-minSpeed').val() == '' || parseIntDecimal($('#input-minSpeed').val()) == 0) {
			i++;
		}
		if(i == 2) {
			$('#required-area .panel-body').addClass('show');
			$('#input-maxSpeed').focus();
			flag = false;
			$.dialog.tips(parent.lang.rule_fillASpeed, 2);
		}
		if(i == 0 && parseIntDecimal($('#input-minSpeed').val()) > parseIntDecimal($('#input-maxSpeed').val())) {
			$('#required-area .panel-body').addClass('show');
			$('#input-minSpeed').focus();
			flag = false;
			$.dialog.tips(parent.lang.rule_minSpeedNotThanMax, 2);
		}
	}
	if(flag && (ruleType == 11) && ($('#input-offsetWidth').val() == null || $('#input-offsetWidth').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#input-offsetWidth').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_radiusNotNull, 2);
	}
	if(flag && (ruleType == 11) && (parseIntDecimal($('#input-offsetWidth').val()) < 50 || parseIntDecimal($('#input-offsetWidth').val()) > 999)) {
		$('#required-area .panel-body').addClass('show');
		$('#input-offsetWidth').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_radiusNotInScope, 2);
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
	data.markId = $('#hidden-areaName').val();
	data.type = $.trim(ruleType);
	var maxSpeed = $.trim($('#input-maxSpeed').val());
	if(maxSpeed != '') {
		maxSpeed = parseIntDecimal(maxSpeed);
	}
	var minSpeed = $.trim($('#input-minSpeed').val());
	if(minSpeed != '') {
		minSpeed = parseIntDecimal(minSpeed);
	}
	data.param = $.trim($('#hidden-areaName').val())+','+$.trim($('#combox-start').val())+','+$.trim($('#combox-end').val())+','+maxSpeed+','+minSpeed+',' + $.trim($('#input-offsetWidth').val());
	
	//保存规则属性
	ajaxSaveRule(data);
}