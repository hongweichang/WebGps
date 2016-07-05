var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');  //操作类型  add edit
var id = getUrlParameter('id'); //关联关系id
var lineId = getUrlParameter('lineId'); //线路id
var lineDirect = getUrlParameter('lineDirect'); //线路方向 0上行 1下行
var maxSindex = getUrlParameter('maxSindex'); //最大编号

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
	
	var buttons = [];
	if(type == 'add' || type == 'edit') {
		buttons.push([{
			display: parent.lang.save, 
			name : '', 
			pclass : 'submit',
			bgcolor : 'gray',
			hide : false
		}]);
	}
	buttons.push([{
		display: parent.lang.close, 
		name : '', 
		pclass : 'close',
		bgcolor : 'gray', 
		hide : false
	}]);
	$('#toolbar-btn').flexPanel({
		ButtonsModel : buttons 
	});
	
	var ttype = '';
	var tips = '';
	if(type == 'add' || type == 'edit') {
		ttype = 'input';
		tips = '*';
	}

	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',hide:false,tabshide:false,tip: tips},
				colgroup:{width:['150px','325px','150px','325px']},
				tabs:{
					display: [parent.lang.line_station_index, parent.lang.line_station_name, parent.lang.line_station_direction, 
					          parent.lang.line_station_type, parent.lang.line_station_in_lng, parent.lang.line_station_out_lng, 
					          parent.lang.line_station_in_lat, parent.lang.line_station_out_lat, 
					          parent.lang.line_station_in_angle, parent.lang.line_station_out_angle,
					          parent.lang.line_station_limit_speed+parent.lang.labelKmPerHour,
					          parent.lang.line_station_distance+parent.lang.labelLiChengKM],
					name : ['stationIndex', 'stationName', 'direction', 'stationType', 'inLng', 'outLng',
					        'inLat', 'outLat', 'inAngle', 'outAngle', 'limitSpeed', 'distance'],
					type:[ttype,ttype,,,ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype],
					length:[2,20,,,11,11,11,11,3,3,10,10]
				}
			},{
				title :{display: parent.lang.other_information, pclass : 'clearfix',hide:false,tabshide:false},
				colgroup:{width:['150px','325px','150px','325px']},
				tabs:{
					display: [parent.lang.abbreviation,'',parent.lang.remark,''],
					name : ['abbr','','remark',''],
					type:[ttype,,'textArea',''],
					length:[4,,200]
				}
			}
		]
	});
	
	//特殊字符
	cleanSpelChar('.input-stationName');
	cleanSpelChar('.input-abbr');
	cleanSpelChar('.textArea-remark');
	//只能输入数字和点
	enterDigitalAndPoint('.input-inLng');
	enterDigitalAndPoint('.input-outLng');
	enterDigitalAndPoint('.input-inLat');
	enterDigitalAndPoint('.input-outLat');
	enterDigitalAndPoint('.input-limitSpeed');
	enterDigitalAndPoint('.input-distance');
	//只能输入数字
	enterDigital('.input-stationIndex');
	enterDigital('.input-inAngle');
	enterDigital('.input-outAngle');
	
	//加载站点信息
	ajaxLoadStationInfo();
	
	$('.submit','#toolbar-btn').on('click', saveStationInfo);
	
	$('.close','#toolbar-btn').on('click',function(){
		W.doExit();
	});
}

//加载后台站点信息
function ajaxLoadStationInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	if(type == 'add') {
		loadStationInfo();
	}else {
		var action = 'StandardLineAction_findStationRelationInfo.action?id='+id;
		$.myajax.jsonGetEx(action, function(json, action, success){
			if (success) {
				if (!$.isEmptyObject(json.relation)) {
					loadStationInfo(json.relation);
				}
			}
		});
	}
	$.myajax.showLoading(false);
	disableForm(false);
}

//加载站点信息
function loadStationInfo(params) {
	var directions = getDirections();  //站点方向
	var stationTypes = getStationTypes();  //站点类型
	
	if(type == 'add' || type == 'edit') {
		//站点方向
		$('.td-direction').flexPanel({
			ComBoboxModel :{
				input : {name : 'direction',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'direction', option : arrayToStr(directions)}
			}	
		});
		//站点类型
		$('.td-stationType').flexPanel({
			ComBoboxModel :{
				input : {name : 'stationType',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'stationType', option : arrayToStr(stationTypes)}
			}	
		});
		
		if(type == 'add') {
			if(maxSindex) {
				$('.input-stationIndex').val(parseInt(maxSindex, 10) + 1);
			}else {
				$('.input-stationIndex').val(1);
			}
			$('#combox-direction').val(getArrayName(directions, 0));
			$('#hidden-direction').val(0);
			$('#combox-stationType').val(getArrayName(stationTypes, 0));
			$('#hidden-stationType').val(0);
			$('.input-inLng').val(0);
			$('.input-outLng').val(0);
			$('.input-inLat').val(0);
			$('.input-outLat').val(0);
			$('.input-inAngle').val(0);
			$('.input-outAngle').val(0);
			$('.input-limitSpeed').val(0);
			$('.input-distance').val(0);
		}else if(type == 'edit') {
			lineId = params.lid;
			$('.input-stationIndex').val(params.sindex+1);
			if(params.station) {
				$('.input-stationName').val(params.station.name);
				$('#combox-direction').val(getArrayName(directions, params.station.direct));
				$('#hidden-direction').val(params.station.direct);
				$('.input-inLng').val(parseInt(params.station.lngIn,10) / 1000000);
				$('.input-outLng').val(parseInt(params.station.lngOut,10) / 1000000);
				$('.input-inLat').val(parseInt(params.station.latIn,10) / 1000000);
				$('.input-outLat').val(parseInt(params.station.latOut,10) / 1000000);
				$('.input-inAngle').val(params.station.angleIn);
				$('.input-outAngle').val(params.station.angleOut);
				$('.input-abbr').val(params.station.abbr);
				$('#textArea-remark').val(params.station.remark);
			}
			$('#combox-stationType').val(getArrayName(stationTypes, params.stype));
			$('#hidden-stationType').val(params.stype);
			$('.input-limitSpeed').val(parseInt(params.speed,10) / 10);
			$('.input-distance').val(parseInt(params.len,10) / 1000);
		}
	}else {
		if(params.sindex) {
			$('.td-stationIndex').text(params.sindex);
		}else {
			$('.td-stationIndex').text(0);
		}
		if(params.station) {
			if(params.station.name) {
				$('.td-stationName').text(params.station.name);
			}
			$('.td-direction').text(getArrayName(directions, params.station.direct));
			if(params.station.lngIn) {
				$('.td-inLng').text(parseInt(params.station.lngIn,10) / 1000000);
			}else {
				$('.td-inLng').text(0);
			}
			if(params.station.lngOut) {
				$('.td-outLng').text(parseInt(params.station.lngOut,10) / 1000000);
			}else {
				$('.td-outLng').text(0);
			}
			if(params.station.latIn) {
				$('.td-inLat').text(parseInt(params.station.latIn,10) / 1000000);
			}else {
				$('.td-inLat').text(0);
			}
			if(params.station.latOut) {
				$('.td-outLat').text(parseInt(params.station.latOut,10) / 1000000);
			}else {
				$('.td-outLat').text(0);
			}
			if(params.station.angleIn) {
				$('.td-inAngle').text(params.station.angleIn);
			}else {
				$('.td-inAngle').text(0);
			}
			if(params.station.angleOut) {
				$('.td-outAngle').text(params.station.angleOut);
			}else {
				$('.td-outAngle').text(0);
			}
			if(params.station.abbr) {
				$('.td-abbr').text(params.station.abbr);
			}
			if(params.station.remark) {
				$('#textArea-remark').val(params.station.remark);
			}
		}
		$('.td-stationType').text(getArrayName(stationTypes, params.stype));
		if(params.speed) {
			$('.td-limitSpeed').text(parseInt(params.speed,10) / 10);
		}else {
			$('.td-limitSpeed').text(0);
		}
		if(params.len) {
			$('.td-distance').text(parseInt(params.len,10) / 1000);
		}else {
			$('.td-distance').text(0);
		}
		$('#textArea-remark').attr('readonly','readonly');
		$('#info-mid').css('height', '390px');
	}
}

//获取站点方向
function getDirections() {
	var types_ = [];
	types_.push({id:0,name: parent.lang.east});
	types_.push({id:1,name: parent.lang.south});
	types_.push({id:2,name: parent.lang.west});
	types_.push({id:3,name: parent.lang.north});
	return types_;
}

//获取站点类型
function getStationTypes() {
	var types_ = [];
	types_.push({id:0,name: parent.lang.line_station_qiDian});
	types_.push({id:1,name: parent.lang.line_station_zhongDian});
	types_.push({id:2,name: parent.lang.line_station_big});
	types_.push({id:3,name: parent.lang.line_station_small});
	types_.push({id:4,name: parent.lang.line_station_place});
	types_.push({id:5,name: parent.lang.line_station_place_other});
	return types_;
}

//判断输入框为空或者不为空后的操作
function isCheckInputNull(name, flag, isError) {
	if(flag) {//不为空
		$('.td-'+name+'').find('.span-tip').text('*');
	}else {//为空
		$('#required-area .panel-body').addClass('show');
		if(isError) {
			$('.td-'+name+'').find('.span-tip').text(parent.lang.line_error_param);
		}else {
			$('.td-'+name+'').find('.span-tip').text(parent.lang.not_be_empty);
		}
		$('.input-'+name+'').focus();
	}
}

//判断选择框为空或者不为空后的操作
function isCheckComboxNull(name, flag) {
	if(flag) {//不为空
		$('.td-'+name+'').find('.span-tip').text('*');
	}else {//为空
		$('#required-area .panel-body').addClass('show');
		$('.td-'+name+'').find('.span-tip').text(parent.lang.not_be_empty);
		$('#combox-'+name+'').focus();
	}
}

//如果出现小数点，则取小数点前面的数字
function checkNumPoint(value) {
	if(value) {
		try {
			value = parseInt(value.toString().split('.')[0], 10);
		} catch (e) {
			
		}
	}
	return value;
}

//判断页面参数为空
function checkStationInfo() {
	var data = {};
	data.station = {};
	//站点编号
	data.sindex = $.trim($('.input-stationIndex').val());
	if(data.sindex) {
		isCheckInputNull('stationIndex', true);
	}else {
		isCheckInputNull('stationIndex', false);
		return null;
	}
	//站点名称
	data.station.name = $.trim($('.input-stationName').val());
	if(data.station.name) {
		isCheckInputNull('stationName', true);
	}else {
		isCheckInputNull('stationName', false);
		return null;
	}
	//站点方向
	data.station.direct = $.trim($('#hidden-direction').val());
	if($('#combox-direction').val() == null || $('#combox-direction').val() == '' 
		&& $('#hidden-direction').val() == null || $('#hidden-direction').val() == ''){
		isCheckComboxNull('direction', false);
		return null;
	}else {
		isCheckComboxNull('direction', true);
	}
	//站点类型
	data.stype = $.trim($('#hidden-stationType').val());
	if($('#combox-stationType').val() == null || $('#combox-stationType').val() == '' 
		&& $('#hidden-stationType').val() == null || $('#hidden-stationType').val() == ''){
		isCheckComboxNull('stationType', false);
		return null;
	}else {
		isCheckComboxNull('stationType', true);
	}
	//进站经度
	data.station.lngIn = $.trim($('.input-inLng').val());
	if(data.station.lngIn) {
		if(parseFloat(data.station.lngIn) > 180 || parseFloat(data.station.lngIn) < -180) {
			isCheckInputNull('inLng', false, true);
			return null;
		}
		isCheckInputNull('inLng', true);
	}else {
		isCheckInputNull('inLng', false);
		return null;
	}
	data.station.lngIn = checkNumPoint(parseFloat(data.station.lngIn) * 1000000);
	//出站经度
	data.station.lngOut = $.trim($('.input-outLng').val());
	if(data.station.lngOut) {
		if(parseFloat(data.station.lngOut) > 180 || parseFloat(data.station.lngOut) < -180) {
			isCheckInputNull('outLng', false, true);
			return null;
		}
		isCheckInputNull('outLng', true);
	}else {
		isCheckInputNull('outLng', false);
		return null;
	}
	data.station.lngOut = checkNumPoint(parseFloat(data.station.lngOut) * 1000000);
	//进站纬度
	data.station.latIn = $.trim($('.input-inLat').val());
	if(data.station.latIn) {
		if(parseFloat(data.station.latIn) > 90 || parseFloat(data.station.latIn) < -90) {
			isCheckInputNull('inLat', false, true);
			return null;
		}
		isCheckInputNull('inLat', true);
	}else {
		isCheckInputNull('inLat', false);
		return null;
	}
	data.station.latIn = checkNumPoint(parseFloat(data.station.latIn) * 1000000);
	//出站纬度
	data.station.latOut = $.trim($('.input-outLat').val());
	if(data.station.latOut) {
		if(parseFloat(data.station.latOut) > 90 || parseFloat(data.station.latOut) < -90) {
			isCheckInputNull('outLat', false, true);
			return null;
		}
		isCheckInputNull('outLat', true);
	}else {
		isCheckInputNull('outLat', false);
		return null;
	}
	data.station.latOut = checkNumPoint(parseFloat(data.station.latOut) * 1000000);
	//进站角度
	data.station.angleIn = $.trim($('.input-inAngle').val());
	if(data.station.angleIn) {
		isCheckInputNull('inAngle', true);
	}else {
		isCheckInputNull('inAngle', false);
		return null;
	}
	//出站角度
	data.station.angleOut = $.trim($('.input-outAngle').val());
	if(data.station.angleOut) {
		isCheckInputNull('outAngle', true);
	}else {
		isCheckInputNull('outAngle', false);
		return null;
	}
	//限制速度
	data.speed = $.trim($('.input-limitSpeed').val());
	if(data.speed) {
		if(parseFloat(data.speed) > 99999) {
			isCheckInputNull('limitSpeed', false, true);
			return null;
		}
		isCheckInputNull('limitSpeed', true);
	}else {
		isCheckInputNull('limitSpeed', false);
		return null;
	}
	data.speed = checkNumPoint(parseFloat(data.speed) * 10);
	//距起始站
	data.len = $.trim($('.input-distance').val());
	if(data.len) {
		if(parseFloat(data.len) > 999999) {
			isCheckInputNull('distance', false, true);
			return null;
		}
		isCheckInputNull('distance', true);
	}else {
		isCheckInputNull('distance', false);
		return null;
	}
	data.len = checkNumPoint(parseFloat(data.len) * 1000);
	return data;
}

//保存线路信息
function saveStationInfo() {
	var data = checkStationInfo();
	if(!data) {
		return;
	}
	data.lid = lineId;
	data.direct = lineDirect;
	if(type == 'edit') {
		data.id = id;
	}
	data.station.abbr = $.trim($('.input-abbr').val());
	data.station.remark = $.trim($('#textArea-remark').val());
	
	var action = 'StandardLineAction_mergeStationInfo.action';
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost( action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.doSaveStationSuc(data);
		}
	});
}