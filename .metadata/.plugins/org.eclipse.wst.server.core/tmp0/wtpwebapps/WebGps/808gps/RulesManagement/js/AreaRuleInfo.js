var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var ruleType = getUrlParameter('ruleType');
var markers = [];
var areaList = [];
var cityList = [];
var zoneList = [];
var rule;
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
					display: [parent.lang.rule_name,parent.lang.type,parent.lang.rule_areaName,parent.lang.mark_zone,parent.lang.rule_maxSpeed,parent.lang.rule_minSpeed,parent.lang.rule_offsetWidth,parent.lang.rule_timeRange,parent.lang.rule_voiceAlarm],
					name : ['ruleName','areaType','areaName','zone','maxSpeed','minSpeed','offsetWidth','beginTime','voice'],
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

	if(ruleType != 4 && ruleType != 7) {
		$('.td-minSpeed').parent().hide();
		$('.td-maxSpeed').parent().hide();
	}
	if(ruleType != 7) {
		$('.td-offsetWidth').parent().hide();
		var content = '<div class="area-group">';
		content += '		<div class="area-addType">';
		content += '			<input id="radio-custom" class="radioArea" name="radioArea" type="radio" value="1" checked>';
		content += '			<label for="radio-custom">'+parent.lang.mark_custom+'</label>';
		content += '			<input id="radio-administrative" class="radioArea" name="radioArea" type="radio" value="2">';
		content += '			<label for="radio-administrative">'+parent.lang.mark_administrative+'</label>';
		content += '		</div>';
		content += '    </div>';
		$('.td-areaType').empty();
		$('.td-areaType').append(content);
		$('.administrative').hide();
		$('.radioArea').on('change',function(){
			var value = $("input[name='radioArea']:checked").val();
			if(value == 1) {
				$('.td-zone').parent().hide();
				$('.td-areaName').empty();
				$('.td-zone').empty();
				$('.td-areaName').parent().find('th').text(parent.lang.rule_areaName);
				$('.td-areaName').flexPanel({
					ComBoboxModel :{
						input : {name : 'areaName',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
						combox: 
							{name : 'areaName', option : arrayToStr(areaList)}
					}	
				});
				$('.td-areaName').append('<span class="span-tip red areaNameTip">*</span><span id="createArea" class="manage" style="margin: 4px 0px -4px 10px;" title="'+parent.lang.mark_manage+'"></span>');
				$('#createArea').on('click',addArea);
			}else {
				$('.td-areaName').empty();
				$('#select-areaName').remove();
				$('#required-area .td-areaName').flexPanel({
					ComBoboxModel :{
						input : {name : 'areaName',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
						combox: 
							{name : 'areaName', option : arrayToStr(getCitys())}
					}	
				});
				$('.td-areaName').append('<span class="span-tip red areaNameTip">*</span><span id="addArea" class="manage" style="margin: 4px 0px -4px 10px;" title="'+parent.lang.mark_manage+'"></span>');
				$('.td-areaName').parent().find('th').text(parent.lang.mark_city);
				if(parent.myUserRole.hasAddArea()){
					$('#addArea').show();
					$('#addArea').on('click',addCityArea);
				}else{
					$('#addArea').hide();
				}
				$('.td-zone').parent().find('th').text(parent.lang.mark_zone);
				loadCityInfo();
				$('.td-zone').parent().show();
				$('.td-zone').empty();
				$('.td-zone').flexPanel({
					ComBoboxModel :{
						input : {name : 'zone',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
						combox: 
							{name : 'zone', option : arrayToStr(getZones())}
					}	
				});
			}
		});
	}
	if($("input[name='radioArea']:checked").val() == 1){
		$('.td-zone').parent().hide();
	}
	if(ruleType == 7) {
		$('.td-zone').parent().hide();
		$('.td-areaType').parent().hide();
		$('.td-offsetWidth').append('<span class="span-tip red offsetWidthTip">*</span><span id="offsetWidthUnit">'+parent.lang.rule_offsetWidthTip+'</span>');
	}
	
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
		var url = 'RulesManagement/AreaRuleInfo.html?id='+getUrlParameter('id')+'&type='+type+'&ruleType='+ruleType;
		if(type == 'edit') {
			url += '&id='+getUrlParameter('id');
		}
		$('.ui_dialog',parent.document).find('iframe').attr('src',url);
	});
}

function addCityArea(){
	$.dialog({id:'areainfo', title:parent.lang.mark_add,content: 'url:RulesManagement/addArea.html',
		width:'500px',height:'200px', min:false, max:false, lock:true,parent: api});
}

//加载区域信息
function ajaxLoadMarker() {
	areaList = [];
	for(var i = 0; i < markers.length; i++) {
		if(ruleType == 7) {
			if (markers[i].markerType == 4) {
				areaList.push(markers[i]);
			}
		}else{
			if (parent.mapMarker[i].markerType == 2 || parent.mapMarker[i].markerType == 3 || parent.mapMarker[i].markerType == 10 ) {
				areaList.push(markers[i]);
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
	if(type != 'add'){
		if(rule.areaType == 0 || rule.areaType == null){
			$('#combox-areaName').val(getArrayName(areaList,rule.markId));
			$('#hidden-areaName').val(rule.markId);
		}
	}
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
					rule = json.rule;
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
		if(ruleType == 4 || ruleType == 7) {
			$('#input-maxSpeed').val(0);
			$('#input-minSpeed').val(0);
		}
		if(ruleType == 7) {
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
			$('#select-areaName').remove();
			if(params.areaType == 1){
				$('#select-zone').remove();
			}
		}
		$('#input-ruleName').val(params.name);
		if(params.areaType == 1){
			$('#radio-administrative').click();
			loadCityInfo();
		}
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
			
			if(param[1] != null) {
				$('#input-maxSpeed').val(param[1]);
			}else {
				$('#input-maxSpeed').val(0);
			}
			if(param[2] != null) {
				$('#input-minSpeed').val(param[2]);
			}else {
				$('#input-minSpeed').val(0);
			}
			if(param[3] != null) {
				$('#input-offsetWidth').val(param[3]);
			}else {
				$('#input-offsetWidth').val(50);
			}
			if(param[4] && param[4] == 1) {
				$('#camera-yes').get(0).checked = true;
			}else {
				$('#camera-no').get(0).checked = true;
			}
			if(param[5] != null) {
				var index = 0;
				$('.td-cameraWebcam .camera').find('input').each(function(i) {
					if(param[5].substring(i, i+1) == 1) {
						$('#checkbox-camera'+Number(i+1)).get(0).checked = true;
						index ++;
					}
				});
				if(index == 8) {
					$('#checkbox-cameraAll').get(0).checked = true;
				}
			}
			if(param[6]) {
				$('#input-video').val(param[6]);
			}else {
				$('#input-video').val(0);
			}
			if(param[7] != null) {
				var index = 0;
				$('.td-videoWebcam .video').find('input').each(function(i) {
					if(param[7].substring(i, i+1) == 1) {
						$('#checkbox-video'+Number(i+1)).get(0).checked = true;
						index ++;
					}
				});
				if(index == 8) {
					$('#checkbox-videoAll').get(0).checked = true;
				}
			}
			if(param[8]) {
				$('#textArea-phone').val(param[8]);
			}
			if(param[9]) {
				$('#textArea-mail').val(param[9]);
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
		if(ruleType == 7 || $("input[name='radioArea']:checked").val() == 1){
			$.dialog.tips(parent.lang.rule_areaNameNotNull, 2);
		}else{
			$.dialog.tips(parent.lang.mark_select_city, 2);
		}
	}
	if(flag && ruleType == 4) {
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
	if(flag && ruleType == 7) {
		if($('#input-maxSpeed').val() == null || $('#input-maxSpeed').val() == '') {
			$('#required-area .panel-body').addClass('show');
			$('#input-maxSpeed').focus();
			flag = false;
			$.dialog.tips(parent.lang.rule_maxSpeedNotNull, 2);
		}
		if(flag && ($('#input-minSpeed').val() == null || $('#input-minSpeed').val() == '')) {
			$('#required-area .panel-body').addClass('show');
			$('#input-minSpeed').focus();
			flag = false;
			$.dialog.tips(parent.lang.rule_minSpeedNotNull, 2);
		}
	}
	if(flag && (ruleType == 7) && ($('#input-offsetWidth').val() == null || $('#input-offsetWidth').val() == '')) {
		$('#required-area .panel-body').addClass('show');
		$('#input-offsetWidth').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_offsetWidthNotNull, 2);
	}
	if(flag && (ruleType == 7) && (parseIntDecimal($('#input-offsetWidth').val()) < 50 || parseIntDecimal($('#input-offsetWidth').val()) > 999)) {
		$('#required-area .panel-body').addClass('show');
		$('#input-offsetWidth').focus();
		flag = false;
		$.dialog.tips(parent.lang.rule_offsetWidthNotInScope, 2);
	}
	return flag;
}

function addArea(){
	if(ruleType == 7){
		$.dialog({id:'vehicleinfo', title:parent.lang.manage_mark,content: 'url:RulesManagement/addAreaOrLine.html?markType='+2,
			width:'975px',height:'600px', min:false, max:true, lock:true,parent: api});
	}else{
		$.dialog({id:'vehicleinfo', title:parent.lang.manage_mark,content: 'url:RulesManagement/addAreaOrLine.html?markType='+3,
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
			ajaxLoadMarker();
			$('#combox-areaName').val(data.name);
			$('#hidden-areaName').val(data.id);
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function reloadArea() {
//	var my = $.dialog({id:'vehicleinfo'}).get('vehicleinfo');
//	$.dialog({id:'vehicleinfo'}).reload(my,'url:RulesManagement/addAreaOrLine.html?ruleType='+ruleType);
	$.dialog({id:'vehicleinfo'}).close();
	addArea();
}

function saveRule() {
    if(!checkRuleParam()) {
		return;
	}
	var data = {};
	if(type == 'edit') {
		data.id = getUrlParameter('id');
	}
	data.name = $('#input-ruleName').val();
	var selid;
	if(ruleType == 7 || $("input[name='radioArea']:checked").val() == 1){
		data.markId = $('#hidden-areaName').val();
		selid = $('#hidden-areaName').val();
	}else{
		data.areaType = 1;
		if($('#hidden-zone').val() == null || $('#hidden-zone').val() == ''){
			for (var i = 0; i < cityList.length; i++) {
				if(cityList[i].id == $('#hidden-areaName').val()){
					data.markId = cityList[i].id;
					selid = cityList[i].id;
					data.parentId = 0;
				}
			}
		}else{
			for (var i = 0; i < zoneList.length; i++) {
				if(zoneList[i].id == $('#hidden-zone').val()){
					data.markId = zoneList[i].id;
					selid = zoneList[i].id;
					data.parentId = zoneList[i].parentId;
				}
			}
		}
	}
	data.type = ruleType;
	var maxSpeed = $('#input-maxSpeed').val();
	if(maxSpeed != '') {
		maxSpeed = parseIntDecimal(maxSpeed);
	}
	var minSpeed = $('#input-minSpeed').val();
	if(minSpeed != '') {
		minSpeed = parseIntDecimal(minSpeed);
	}
	var offsetWidth = $('#input-offsetWidth').val();
	if(offsetWidth != '') {
		offsetWidth = parseIntDecimal(offsetWidth);
	}
	data.param = selid+','+maxSpeed+','+minSpeed+','+offsetWidth;
	
	//保存规则属性
	ajaxSaveRule(data);
}

function loadCityInfo(){
	for(var i = 0; i < parent.mapMarker.length; i++){
		if(parent.mapMarker[i].parentId == 0 && parent.mapMarker[i].areaType == 1){
			cityList.push(parent.mapMarker[i]);
		}
	}
	$('.td-areaName').empty();
	$('#select-areaName').remove();
	$('#required-area .td-areaName').flexPanel({
		ComBoboxModel :{
			input : {name : 'areaName',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			combox: 
				{name : 'areaName', option : arrayToStr(getCitys())}
		}	
	});
	$('.td-areaName').append('<span class="span-tip red areaNameTip">*</span><span id="addArea" class="manage" style="margin: 4px 0px -4px 10px;" title="'+parent.lang.mark_manage+'"></span>');
	if(parent.myUserRole.hasAddArea()){
		$('#addArea').show();
		$('#addArea').on('click',addCityArea);
	}else{
		$('#addArea').hide();
	}
	$('#select-areaName li').each(function() {
		$(this).on('click',function() {
			loadZoneInfo($(this).attr('data-index'));
		});
	});
	if(type != 'add'){
		if(rule.areaType == 1){
			if(rule.parentId == null || rule.parentId == 0){
				for (var i = 0; i < cityList.length; i++) {
					if(cityList[i].id == rule.markId){
						$('#combox-areaName').val(cityList[i].areaName);
						$('#hidden-areaName').val(rule.markId);
						loadZoneInfo(cityList[i].id);
					}
				}
			}else{
				for (var i = 0; i < cityList.length; i++) {
					if(cityList[i].id == rule.parentId){
						$('#combox-areaName').val(cityList[i].areaName);
						$('#hidden-areaName').val(rule.parentId);
					}
				}
				loadZoneInfo(rule.parentId);
			}
		}
	}
}

function getCitys(){
	var towns = [];
	if(cityList != null){
		for(var i = 0; i < cityList.length; i++){
			towns.push({id:cityList[i].id,name: cityList[i].areaName});
		}
	}
	return towns;
}

function loadZoneInfo(pid){
	for(var i = 0; i < parent.mapMarker.length; i++){
		if(parent.mapMarker[i].parentId == pid && parent.mapMarker[i].areaType == 1){
			zoneList.push(parent.mapMarker[i]);
		}
	}
	$('.td-zone').empty();
	$('#select-zone').remove();
	$('#required-area .td-zone').flexPanel({
		ComBoboxModel :{
			input : {name : 'zone',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			combox: 
				{name : 'zone', option : arrayToStr(getZones())}
		}	
	});
	if(type != 'add'){
		if(rule.areaType == 1 && rule.parentId != null && rule.parentId != 0){
			for (var i = 0; i < zoneList.length; i++) {
				if(zoneList[i].id == rule.markId){
					$('#combox-zone').val(zoneList[i].areaName);
					$('#hidden-zone').val(zoneList[i].areaId);
				}
			}
		}
	}
}

function getZones(){
	var towns = [];
	if(zoneList != null){
		for(var i = 0; i < zoneList.length; i++){
			towns.push({id:zoneList[i].id,name: zoneList[i].areaName});
		}
	}
	return towns;
}