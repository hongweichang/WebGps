var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var ruleType = getUrlParameter('ruleType');
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
					display: [parent.lang.rule_name,parent.lang.rule_keypoint_span + parent.lang.type,parent.lang.rule_keypoint_span,parent.lang.rule_keypoint_span,parent.lang.rule_radius,parent.lang.rule_timeRange,parent.lang.type,parent.lang.rule_voiceAlarm],
					name : ['ruleName','keyType','areaName','keypoint','offsetWidth','beginTime','type','voice'],
					type:['input','','','input','input','input','','textArea'],
					length:[40,,3,3,3,,,]
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
	
	$('.td-keypoint').parent().hide();
	
	$('.td-keyType').flexPanel({
		ComBoboxModel :{
			input : {name : 'keyType',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			combox: 
				{name : 'keyType', option : '4&' + parent.lang.rule_line + '|1&' + parent.lang.rule_keypoint_span}
		}	
	});
	
	$('#select-keyType li').each(function() {
		$(this).on('click',function() {
			var index= $(this).attr('data-index');
			if(index == 4) {
				areaList = [];
				for(var i = 0; i < markers.length; i++) {
					if (markers[i].markerType == 4) {
						areaList.push(markers[i]);
					}
				}
				$('#select-areaName').remove();
				$('.td-areaName').parent().find('th').text(parent.lang.rule_line);
				$('.td-areaName .btn-group').remove();
				$('#select-areaName').remove();
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
						$('.td-keypoint').parent().show();
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
							$('.td-keypoint').empty();
							$('.td-keypoint .btn-group').remove();
							$('#select-keypoint').remove();
							$('.td-keypoint').flexPanel({
								ComBoboxModel :{
									input : {name : 'keypoint',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
									combox: 
										{name : 'keypoint', option : arrayToStr(pointList)}
								}	
							});
							
							$('#select-keypoint li').each(function(index) {
								$(this).prepend('<span>'+ (index + 1) +'</span>');
							});
						}
					});
				});
			}else if(index == 1) {
				areaList = [];
				for(var i = 0; i < markers.length; i++) {
					if (markers[i].markerType == 1) {
						areaList.push(markers[i]);
					}
				}
				$('.td-keypoint').parent().hide();
				$('.td-areaName').parent().find('th').text(parent.lang.rule_keypoint_span);
				$('.td-areaName .btn-group').remove();
				$('#select-areaName').remove();
				$('.td-areaName').flexPanel({
					ComBoboxModel :{
						input : {name : 'areaName',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
						combox: 
							{name : 'areaName', option : arrayToStr(areaList)}
					}	
				});
				
				$('#select-areaName li').each(function(index) {
					$(this).prepend('<span>'+ (index + 1) +'</span>');
				});
			}
		});
	});
	
	$('.td-type').prepend(addTypeRadio('type'));
	
	function addTypeRadio(name) {
		var content = '';
		content += '<input id="'+name+'-yes" name="'+name+'" type="radio" value="1"/>';
		content += '<label id="label-'+name+'-yes" for="'+name+'-yes"></label>';
		content += '<input id="'+name+'-no" name="'+name+'" type="radio" value="0" style="margin-left: 10px;"/>';
		content += '<label id="label-'+name+'-no" for="'+name+'-no"></label>';
		return content;
	}
	

	$('#label-type-no').text(parent.lang.rule_notReach);
	$('#label-type-yes').text(parent.lang.rule_noLeave);
	$('.td-keyType').append('<span class="span-tip red areaNameTip">*</span>');
	
	//加载页面属性
	loadRuleParam();
	$('.maxSpeedTip').hide();
	$('.minSpeedTip').hide();
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("StandardVehicleRuleAction_listMarker.action", function(json,action,success){
		if (success) {
			markers = json.markers;
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
		var url = 'RulesManagement/KeyPointInfo.html?id='+getUrlParameter('id')+'&type='+type+'&ruleType='+ruleType;
		if(type == 'edit') {
			url += '&id='+getUrlParameter('id');
		}
		$('.ui_dialog',parent.document).find('iframe').attr('src',url);
	});
}

function reloadArea() {
//	var my = $.dialog({id:'vehicleinfo'}).get('vehicleinfo');
//	$.dialog({id:'vehicleinfo'}).reload(my,'url:RulesManagement/addAreaOrLine.html?ruleType='+ruleType);
	$.dialog({id:'vehicleinfo'}).close();
	addArea();
}

function addArea(){
	if($("#hidden-keyType").val() == 4){
		$.dialog({id:'vehicleinfo', title:parent.lang.manage_mark,content: 'url:RulesManagement/addAreaOrLine.html?markType='+2,
			width:'975px',height:'600px', min:false, max:true, lock:true,parent: api});
	}else if($("#hidden-keyType").val() == 1){
		$.dialog({id:'vehicleinfo', title:parent.lang.manage_mark,content: 'url:RulesManagement/addAreaOrLine.html?markType='+1,
			width:'975px',height:'600px', min:false, max:true, lock:true,parent: api});
	}
}

function doSelectArea(data,isclose){
	if(isclose == 1){
		$.dialog({id:'vehicleinfo'}).close();
	}
	$.myajax.jsonGet("StandardVehicleRuleAction_listMarker.action", function(json,action,success){
		if (success) {
			$('.td-areaName .btn-group').remove();
			$('#select-areaName').remove();
			markers = json.markers;
			if($("#hidden-keyType").val() == 4) {
				areaList = [];
				for(var i = 0; i < markers.length; i++) {
					if (markers[i].markerType == 4) {
						areaList.push(markers[i]);
					}
				}
				$('#select-areaName').remove();
				$('.td-areaName').parent().find('th').text(parent.lang.rule_line);
				$('.td-areaName .btn-group').remove();
				$('#select-areaName').remove();
				$('.td-areaName').flexPanel({
					ComBoboxModel :{
						input : {name : 'areaName',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
						combox: 
							{name : 'areaName', option : arrayToStr(areaList)}
					}	
				});
				$('#combox-areaName').val(data.name);
				$('#hidden-areaName').val(data.id);
				var keyJingDuList = [];
				var keyWeiDuList = [];
				keyJingDuList = data.jingDu.split(',');
				keyWeiDuList = data.weiDu.split(',');
				$('.td-keypoint').parent().show();
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
					$('.td-keypoint').empty();
					$('.td-keypoint .btn-group').remove();
					$('#select-keypoint').remove();
					$('.td-keypoint').flexPanel({
						ComBoboxModel :{
							input : {name : 'keypoint',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
							combox: 
								{name : 'keypoint', option : arrayToStr(pointList)}
						}	
					});
					
					$('#select-keypoint li').each(function(index) {
						$(this).prepend('<span>'+ (index + 1) +'</span>');
					});
				}
			}else if($("#hidden-keyType").val() == 1) {
				areaList = [];
				for(var i = 0; i < markers.length; i++) {
					if (markers[i].markerType == 1) {
						areaList.push(markers[i]);
					}
				}
				$('.td-keypoint').parent().hide();
				$('.td-areaName').parent().find('th').text(parent.lang.rule_keypoint_span);
				$('.td-areaName .btn-group').remove();
				$('#select-areaName').remove();
				$('.td-areaName').flexPanel({
					ComBoboxModel :{
						input : {name : 'areaName',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
						combox: 
							{name : 'areaName', option : arrayToStr(areaList)}
					}	
				});
				$('#combox-areaName').val(data.name);
				$('#hidden-areaName').val(data.id);
				
				$('#select-areaName li').each(function(index) {
					$(this).prepend('<span>'+ (index + 1) +'</span>');
				});
			}
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

var markers = [];
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
		$('#select-keyType li').each(function() {
			if($(this).attr('data-index') == 4) {
				$(this).click();
			}
		});
		if(ruleType == 12) {
			$('#input-offsetWidth').val(50);
		}
		$("#input-beginTime").val("00:00:00");
		$("#input-endTime").val("23:59:59");
		$('#type-no').get(0).checked = true;
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
				if(param[0] == 4){
					$('.td-keypoint').parent().show();
					$('#combox-keyType').val(parent.lang.rule_line);
					$('#select-keyType li').each(function() {
						if($(this).attr('data-index') == 4) {
							$(this).click();
						}
					});
					if(param[1] != null){
						$('#select-areaName li').each(function() {
							if($(this).attr('data-index') == param[1]) {
								$(this).click();
							}
						});
						if(param[2] != null && param[3] != null){
							$('#combox-keypoint').val(param[2] + ',' + param[3]);
						}
					}
					if(type != 'edit') {
						$('#combox-keyType').get(0).disabled = true;
						$('#combox-areaName').get(0).disabled = true;
						$('#combox-keypoint').get(0).disabled = true;
					}
				}else if(param[0] == 1){
					$('.td-keypoint').parent().hide();
					$('#combox-keyType').val(parent.lang.rule_keypoint_span);
					$('#select-keyType li').each(function() {
						if($(this).attr('data-index') == 1) {
							$(this).click();
						}
					});
					if(param[1] != null){
						$('#select-areaName li').each(function() {
							if($(this).attr('data-index') == param[1]) {
								$(this).click();
							}
						});
					}
					if(type != 'edit') {
						$('#combox-keyType').get(0).disabled = true;
						$('#combox-areaName').get(0).disabled = true;
					}
				}
			}
			if(param[4] != null){
				$('#input-offsetWidth').val(param[4]);
			}
			if(param[5] && param[5] == 1) {
				$('#type-yes').get(0).checked = true;
			}else {
				$('#type-no').get(0).checked = true;
			}
			if(param[6] && param[6] == 1) {
				$('#camera-yes').get(0).checked = true;
			}else {
				$('#camera-no').get(0).checked = true;
			}
			if(param[7] != null) {
				var index = 0;
				$('.td-cameraWebcam .camera').find('input').each(function(i) {
					if(param[7].substring(i, i+1) == 1) {
						$('#checkbox-camera'+parseInt(i+1)).get(0).checked = true;
						index ++;
					}
				});
				if(index == 8) {
					$('#checkbox-cameraAll').get(0).checked = true;
				}
			}
			if(param[8]) {
				$('#input-video').val(param[8]);
			}else {
				$('#input-video').val(0);
			}
			if(param[9] != null) {
				var index = 0;
				$('.td-videoWebcam .video').find('input').each(function(i) {
					if(param[9].substring(i, i+1) == 1) {
						$('#checkbox-video'+parseInt(i+1)).get(0).checked = true;
						index ++;
					}
				});
				if(index == 8) {
					$('#checkbox-videoAll').get(0).checked = true;
				}
			}
			if(param[10]) {
				$('#textArea-phone').val(param[10]);
			}
			if(param[11]) {
				$('#textArea-mail').val(param[11]);
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
	if(flag && ($('#hidden-keyType').val() == null || $('#hidden-keyType').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#combox-keyType').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_keyTypeNotNull, 2);
	}
	if(flag && ($('#hidden-areaName').val() == null || $('#hidden-areaName').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#combox-areaName').focus();
		flag = false;
		if($('#hidden-keyType').val() == 4){
			$.dialog.tips(parent.lang.rule_lineNotNull, 2);
		}else if($('#hidden-keyType').val() == 1){
			$.dialog.tips(parent.lang.rule_keyNotNull, 2);
		}
	}	
	if(flag && $('#hidden-keyType').val() == 4 && ($('#combox-keypoint').val() == null || $('#combox-keypoint').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#combox-areaName').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_keyNotNull, 2);
	}
	if(flag && (ruleType == 12) && ($('#input-offsetWidth').val() == null || $('#input-offsetWidth').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#input-offsetWidth').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_radiusNotNull, 2);
	}
	if(flag && (ruleType == 12) && (parseIntDecimal($('#input-offsetWidth').val()) < 50 || parseIntDecimal($('#input-offsetWidth').val()) > 999)) {
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
	var str = '';
	if($('#hidden-keyType').val() == 4){
		str = $.trim($('#hidden-keyType').val()) + ',' + $.trim($('#hidden-areaName').val()) + ',' + $.trim($('#combox-keypoint').val()) + ',' + $.trim($('#input-offsetWidth').val()) + ',' + $.trim($("input[name='type']:checked").val());
	}else if($('#hidden-keyType').val() == 1){
		str = $.trim($('#hidden-keyType').val()) + ',';
		for(var i = 0; i < markers.length; i++){
			if(markers[i].id == $.trim($('#hidden-areaName').val())){
				str += $.trim(markers[i].id) + ',' + $.trim(markers[i].jingDu) + ',' + $.trim(markers[i].weiDu);
			}
		}
		str += ',' + $.trim($('#input-offsetWidth').val()) + ',' +  + $.trim($("input[name='type']:checked").val());
	}
	data.param = str;
	//保存规则属性
	ajaxSaveRule(data);
}