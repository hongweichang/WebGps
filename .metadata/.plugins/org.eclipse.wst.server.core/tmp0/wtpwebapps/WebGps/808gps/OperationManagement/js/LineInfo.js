var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type'); //操作类型 add edit
var companys = W.lineCompanyTeams;
var sid = null;
var lineInfo = null;

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
			pclass : 'submit',
			bgcolor : 'gray',
			hide : false
		}]);
	}
	buttons.push([{
		display: parent.lang.close, 
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
					display: [parent.lang.line_name, parent.lang.abbreviation, parent.lang.line_type, parent.lang.belong_company, 
					          parent.lang.line_ticket_type,parent. lang.line_ticket_price,
//					          parent.lang.line_up_station+parent.lang.line_start_point, parent.lang.line_down_station+parent.lang.line_end_point,
					          parent.lang.line_up_length+parent.lang.labelLiChengKM, parent.lang.line_down_length+parent.lang.labelLiChengKM,  
					          parent.lang.line_up_average_time+parent.lang.param_second_tip,parent.lang.line_down_average_time+parent.lang.param_second_tip,
					          parent.lang.line_up_flat_headways+parent.lang.param_second_tip,parent.lang.line_down_flat_headways+parent.lang.param_second_tip,
					          parent.lang.line_up_peak_headways+parent.lang.param_second_tip,parent.lang.line_down_peak_headways+parent.lang.param_second_tip,
					          parent.lang.line_up_first_time, parent.lang.line_up_end_time, parent.lang.line_down_first_time, parent.lang.line_down_end_time],
					name : ['lineName', 'abbr', 'lineType', 'company', 'ticketType', 'price', /*'beginStation', 'endStation',*/
					        'upLength', 'downLength', 'upTotalTime', 'downTotalTime', 'upFlatWay', 'downFlatWay',
					        'upPeakWay', 'downPeakWay', 'upFirst', 'upEnd', 'downFirst', 'downEnd'],
					type:[ttype,ttype,,,,ttype,/*,,*/ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype,
					      ttype,ttype,ttype,ttype],
					length:[20,20,,,,8,8,8,8,8,8,8,8,8,8,8,8,8]
				}
			},{
				title :{display: parent.lang.other_information, pclass : 'clearfix',hide:false,tabshide:false},
				colgroup:{width:['150px','325px','150px','325px']},
				tabs:{
					display: [parent.lang.remark,''],
					name : ['remark',''],
					type:['textArea',''],
					length:[200]
				}
			}
		]
	});
	if(type == 'add' || type == 'edit') {
//		$('.td-beginStation').html('<input type="text" id="combox-beginStation" onclick="selectStation();" readonly style="width:224px;"/><input type="hidden" id="hidden-beginStation"/><span class="span-tip red">*</span><span class="add" onclick="addStation();" title="'+parent.lang.add+'"></span><span class="clear" onclick="clearStation();" title="'+parent.lang.clear+'"></span>');
//		$('.td-endStation').html('<input type="text" id="combox-endStation" onclick="selectStation();" readonly style="width:224px;"/><input type="hidden" id="hidden-endStation"/><span class="span-tip red">*</span><span class="add" onclick="addStation();" title="'+parent.lang.add+'"></span><span class="clear" onclick="clearStation();" title="'+parent.lang.clear+'"></span>');
		
		$('.td-abbr .span-tip').remove();
		
		$('.input-upFirst').addClass('Wdate').css('width','70%').attr('readonly', 'readonly');
		$('.input-upEnd').addClass('Wdate').css('width','70%').attr('readonly', 'readonly');
		$('.input-downFirst').addClass('Wdate').css('width','70%').attr('readonly', 'readonly');
		$('.input-downEnd').addClass('Wdate').css('width','70%').attr('readonly', 'readonly');
		
		$(".input-upFirst").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'});});
		$(".input-upEnd").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'});});
		$(".input-downFirst").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'});});
		$(".input-downEnd").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'});});
	}
	
	//特殊字符
	cleanSpelChar('.input-lineName');
	cleanSpelChar('.input-abbr');
	cleanSpelChar('.textArea-remark');
	//只能输入数字和点
	enterDigitalAndPoint('.input-upLength');
	enterDigitalAndPoint('.input-downLength');
	enterDigitalAndPoint('.input-price');
	//只能输入数字
	enterDigital('.input-upTotalTime');
	enterDigital('.input-downTotalTime');
	enterDigital('.input-upFlatWay');
	enterDigital('.input-downFlatWay');
	enterDigital('.input-upPeakWay');
	enterDigital('.input-downPeakWay');
	
	//加载线路信息
	ajaxLoadLineInfo();
	
	//线路保存
	$('.submit','#toolbar-btn').on('click', saveLineInfo);
	
	$('.close','#toolbar-btn').on('click',function(){
		W.doLineInfoExit();
	});
}

//加载后台线路信息
function ajaxLoadLineInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	if(type == 'add') {
		loadLineInfo();
	}else {
		var action = 'StandardLineAction_findLineInfo.action?id='+getUrlParameter('id');
		$.myajax.jsonGetEx(action, function(json,action,success){
			if (success) {
				if (!$.isEmptyObject(json.line)) {
					lineInfo = json.line;
					loadLineInfo(json.line);
				}
			}
		});
	}
	$.myajax.showLoading(false);
	disableForm(false);
}

//加载线路信息
function loadLineInfo(params) {
	var lineTypes = getLineTypes();  //线路类型
	var ticketTypes = getTicketTypes();  //售票类型
	
	if(type == 'add' || type == 'edit') {
		//线路类型
		$('.td-lineType').flexPanel({
			ComBoboxModel :{
				input : {name : 'lineType',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'lineType', option : arrayToStr(lineTypes)}
			}	
		});
		//售票类型
		$('.td-ticketType').flexPanel({
			ComBoboxModel :{
				input : {name : 'ticketType',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'ticketType', option : arrayToStr(ticketTypes)}
			}	
		});
		//添加公司树
		for(var i = 0; i < companys.length; i++) {
			if(companys[i].id == parent.companyId) {
				sid = companys[i].parentId;
			}
		}
		addCompanyTree(companys, sid);
		
		if(type == 'add') {
			$('#combox-lineType').val(getArrayName(lineTypes, 0));
			$('#hidden-lineType').val(0);
			$('#combox-ticketType').val(getArrayName(ticketTypes, 0));
			$('#hidden-ticketType').val(0);
			//赋值0
			$('.input-price').val(0);
			$('.input-upLength').val(0);
			$('.input-downLength').val(0);
			$('.input-upTotalTime').val(0);
			$('.input-downTotalTime').val(0);
			$('.input-upFlatWay').val(0);
			$('.input-downFlatWay').val(0);
			$('.input-upPeakWay').val(0);
			$('.input-downPeakWay').val(0);
			$('.input-upFirst').val('06:00:00');
			$('.input-upEnd').val('18:00:00');
			$('.input-downFirst').val('06:00:00');
			$('.input-downEnd').val('18:00:00');
		}else if(type == 'edit') {
			$('.input-lineName').val(params.name);
			$('.td-lineName').append('<input class="input-id" type="hidden" name="id" value="'+params.id+'"/>');
			$('#combox-lineType').val(getArrayName(lineTypes, params.type));
			$('#hidden-lineType').val(params.type);
			$('#combox-ticketType').val(getArrayName(ticketTypes, params.ticket));
			$('#hidden-ticketType').val(params.ticket);
			var company_ = getParentCompany(parent.vehiGroupList, params.pid);
			if(company_) {
				$('#combox-company').val(company_.name);
				$('#hidden-company').val(company_.id);
			}
			if(params.price) {
				$('.input-price').val(parseInt(params.price,10)/10);
			}else {
				$('.input-price').val(0);
			}
//			$('.input-beginStation').val(params.brand);
//			$('.input-endStation').val(params.brand);
			if(params.upLen) {
				$('.input-upLength').val(parseInt(params.upLen,10)/1000);
			}else {
				$('.input-upLength').val(0);
			}
			if(params.dnLen) {
				$('.input-downLength').val(parseInt(params.dnLen,10)/1000);
			}else {
				$('.input-downLength').val(0);
			}
			$('.input-upTotalTime').val(params.upTotalT);
			$('.input-downTotalTime').val(params.dnTotalT);
			$('.input-upFlatWay').val(params.upItlN);
			$('.input-downFlatWay').val(params.dnItlN);
			$('.input-upPeakWay').val(params.upItlP);
			$('.input-downPeakWay').val(params.dnItlP);
			$('.input-upFirst').val(second2ShortHourEx(params.upFirst));
			$('.input-upEnd').val(second2ShortHourEx(params.upLast));
			$('.input-downFirst').val(second2ShortHourEx(params.dnFirst));
			$('.input-downEnd').val(second2ShortHourEx(params.dnLast));
			$('.input-abbr').val(params.abbr);
			$('#textArea-remark').val(params.remark);
		}
	}else {
		if(params.name) {
			$('.td-lineName').text(params.name);
		}
		if(params.pid) {
			var company_ = getParentCompany(parent.vehiGroupList, params.pid);
			$('.td-company').text(company_.name);
		}
		$('.td-lineType').text(getArrayName(lineTypes, params.type));
		$('.td-ticketType').text(getArrayName(ticketTypes, params.ticket));
		if(params.price) {
			$('.td-price').text(parseInt(params.price,10)/10);
		}else {
			$('.td-price').text(0);
		}
		if(params.upLen) {
			$('.td-upLength').text(parseInt(params.upLen,10)/1000);
		}else {
			$('.td-upLength').text(0);
		}
		if(params.dnLen) {
			$('.td-downLength').text(parseInt(params.dnLen,10)/1000);
		}else {
			$('.td-downLength').text(0);
		}
		if(params.upTotalT) {
			$('.td-upTotalTime').text(params.upTotalT);
		}else {
			$('.td-upTotalTime').text(0);
		}
		if(params.dnTotalT) {
			$('.td-downTotalTime').text(params.dnTotalT);
		}else {
			$('.td-downTotalTime').text(0);
		}
		if(params.upItlN) {
			$('.td-upFlatWay').text(params.upItlN);
		}else {
			$('.td-upFlatWay').text(0);
		}
		if(params.dnItlN) {
			$('.td-downFlatWay').text(params.dnItlN);
		}else {
			$('.td-downFlatWay').text(0);
		}
		if(params.upItlP) {
			$('.td-upPeakWay').text(params.upItlP);
		}else {
			$('.td-upPeakWay').text(0);
		}
		if(params.dnItlP) {
			$('.td-downPeakWay').text(params.dnItlP);
		}else {
			$('.td-downPeakWay').text(0);
		}
		if(params.upFirst) {
			$('.td-upFirst').text(second2ShortHourEx(params.upFirst));
		}
		if(params.upLast) {
			$('.td-upEnd').text(second2ShortHourEx(params.upLast));
		}
		if(params.dnFirst) {
			$('.td-downFirst').text(second2ShortHourEx(params.dnFirst));
		}
		if(params.dnLast) {
			$('.td-downEnd').text(second2ShortHourEx(params.dnLast));
		}
		if(params.abbr) {
			$('.td-abbr').text(params.abbr);
		}
		if(params.remark) {
			$('#textArea-remark').val(params.remark);
		}
		$('#textArea-remark').attr('readonly','readonly');
		$('#info-mid').css('height', '460px');
	}
}

/**
 * 公司树双击事件
 */
function companyDblClickEvent() {
	var selId = companyTree.getSelectedItemId();
	if(selId != '*_0' && selId != '*_'+sid) {
		var id = selId.split('_')[1];
		$('#company_tree').hide();
		$('.td-company #combox-company').val(getArrayName(companys, id));
		$('.td-company #hidden-company').val(id);
		$('.td-company .span-tip').text('*');
	}else {
		$('.td-company #combox-company').val('');
		$('.td-company #hidden-company').val('');
		$('#company_tree').hide();
	}
}

//获取线路类型
function getLineTypes() {
	var types_ = [];
	types_.push({id:0,name: parent.lang.line_type_twoWay});
	types_.push({id:1,name: parent.lang.line_type_ring});
	types_.push({id:2,name: parent.lang.line_type_nine});
	return types_;
}

//获取售票类型
function getTicketTypes() {
	var types_ = [];
	types_.push({id:0,name: parent.lang.line_no_ticket});
	types_.push({id:1,name: parent.lang.line_artificial_ticket});
	types_.push({id:2,name: parent.lang.line_mix_ticket});
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
function checkLineInfo() {
	var data = {};
	//线路名称
	data.name = $.trim($('.input-lineName').val());
	if(data.name) {
		isCheckInputNull('lineName', true);
	}else {
		isCheckInputNull('lineName', false);
		return null;
	}
	//公司
	data.pid = $.trim($('#hidden-company').val());
	if($('#combox-company').val() == null || $('#combox-company').val() == '' 
		&& $('#hidden-company').val() == null || $('#hidden-company').val() == ''){
		isCheckComboxNull('company', false);
		return null;
	}else {
		isCheckComboxNull('company', true);
	}
	//线路类型
	data.type = $.trim($('#hidden-lineType').val());
	if($('#combox-lineType').val() == null || $('#combox-lineType').val() == '' 
		&& $('#hidden-lineType').val() == null || $('#hidden-lineType').val() == ''){
		isCheckComboxNull('lineType', false);
		return null;
	}else {
		isCheckComboxNull('lineType', true);
	}
	//售票类型
	data.ticket = $.trim($('#hidden-ticketType').val());
	if($('#combox-ticketType').val() == null || $('#combox-ticketType').val() == '' 
		&& $('#hidden-ticketType').val() == null || $('#hidden-ticketType').val() == ''){
		isCheckComboxNull('ticketType', false);
		return null;
	}else {
		isCheckComboxNull('ticketType', true);
	}
	//上行线路长度
	data.upLen = $.trim($('.input-upLength').val());
	if(data.upLen) {
		if(parseFloat(data.upLen) > 999999) {
			isCheckInputNull('upLength', false, true);
			return null;
		}
		isCheckInputNull('upLength', true);
	}else {
		isCheckInputNull('upLength', false);
		return null;
	}
	data.upLen = checkNumPoint(parseFloat(data.upLen) * 1000);
	//下行线路长度
	data.dnLen = $.trim($('.input-downLength').val());
	if(data.dnLen) {
		if(parseFloat(data.dnLen) > 999999) {
			isCheckInputNull('downLength', false, true);
			return null;
		}
		isCheckInputNull('downLength', true);
	}else {
		isCheckInputNull('downLength', false);
		return null;
	}
	data.dnLen = checkNumPoint(parseFloat(data.dnLen) * 1000);
	//上行平均总耗时
	data.upTotalT = $.trim($('.input-upTotalTime').val());
	if(data.upTotalT) {
		isCheckInputNull('upTotalTime', true);
	}else {
		isCheckInputNull('upTotalTime', false);
		return null;
	}
	//下行平均总耗时
	data.dnTotalT = $.trim($('.input-downTotalTime').val());
	if(data.dnTotalT) {
		isCheckInputNull('downTotalTime', true);
	}else {
		isCheckInputNull('downTotalTime', false);
		return null;
	}
	//上行平峰发车间隔
	data.upItlN = $.trim($('.input-upFlatWay').val());
	if(data.upItlN) {
		isCheckInputNull('upFlatWay', true);
	}else {
		isCheckInputNull('upFlatWay', false);
		return null;
	}
	//下行平峰发车间隔
	data.dnItlN = $.trim($('.input-downFlatWay').val());
	if(data.dnItlN) {
		isCheckInputNull('downFlatWay', true);
	}else {
		isCheckInputNull('downFlatWay', false);
		return null;
	}
	//上行高峰发车间隔
	data.upItlP = $.trim($('.input-upPeakWay').val());
	if(data.upItlP) {
		isCheckInputNull('upPeakWay', true);
	}else {
		isCheckInputNull('upPeakWay', false);
		return null;
	}
	//下行高峰发车间隔
	data.dnItlP = $.trim($('.input-downPeakWay').val());
	if(data.dnItlP) {
		isCheckInputNull('downPeakWay', true);
	}else {
		isCheckInputNull('downPeakWay', false);
		return null;
	}
	//上行首班时间
	data.upFirst = $.trim($('.input-upFirst').val());
	if(data.upFirst) {
		isCheckInputNull('upFirst', true);
	}else {
		isCheckInputNull('upFirst', false);
		return null;
	}
	data.upFirst = shortHour2Second(data.upFirst);
	//上行末班时间
	data.upLast = $.trim($('.input-upEnd').val());
	if(data.upLast) {
		isCheckInputNull('upEnd', true);
	}else {
		isCheckInputNull('upEnd', false);
		return null;
	}
	data.upLast = shortHour2Second(data.upLast);
	//下行首班时间
	data.dnFirst = $.trim($('.input-downFirst').val());
	if(data.dnFirst) {
		isCheckInputNull('downFirst', true);
	}else {
		isCheckInputNull('downFirst', false);
		return null;
	}
	data.dnFirst = shortHour2Second(data.dnFirst);
	//下行末班时间
	data.dnLast = $.trim($('.input-downEnd').val());
	if(data.dnLast) {
		isCheckInputNull('downEnd', true);
	}else {
		isCheckInputNull('downEnd', false);
		return null;
	}
	data.dnLast = shortHour2Second(data.dnLast);
	//售票价格
	data.price = $.trim($('.input-price').val());
	if(data.price) {
		if(parseFloat(data.price) > 99999999) {
			isCheckInputNull('price', false, true);
			return null;
		}
		isCheckInputNull('price', true);
	}else {
		isCheckInputNull('price', false);
		return null;
	}
	data.price = checkNumPoint(parseFloat(data.price) * 10);
	return data;
}

//保存线路信息
function saveLineInfo() {
	var data = checkLineInfo();
	if(!data) {
		return;
	}
	if(type == 'edit') {
		data.id = $.trim($('.input-id').val());
	}
	data.abbr = $.trim($('.input-abbr').val());
	data.remark = $.trim($('#textArea-remark').val());
	
	var action = 'StandardLineAction_mergeLineInfo.action';
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost( action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			if(type == 'add') {
				data.id = json.lineId;
			}
			W.doSaveLineSuc(data, type);
		}
	});
}