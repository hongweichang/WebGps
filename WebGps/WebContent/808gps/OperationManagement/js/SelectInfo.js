var api = frameElement.api, W = api.opener;
var sid;
var companys = [];
var type = getUrlParameter('type');
var id = decodeURIComponent(getUrlParameter('id')); 
var singleSelect = getUrlParameter('singleSelect') == "true" ? true : false;//是否单选
var direct = getUrlParameter('direct'); //站点上下行 0上行 1下行

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

var companyNew = [];
function loadPage(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	var rp = 50;
	$('#downTip').text(parent.lang.loadCountTip.replace(/{number}/, rp));
	var name = decodeURIComponent(getUrlParameter("name"));
	var model = [];
	var action = "";
	var params = [];
	var usepager = true;
	var checkbox = true;
	if(type == 'device') {//选择设备
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.device_number, name : 'device', pfloat : 'left'}
		});
		model = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.device_number, name : 'devIDNO', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.device_serial, name : 'serialID', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.device_type, name : 'devType', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'}
		];
		params.push({
			name: 'devIDNO',
			value: name
		});
		action = 'StandardDeviceAction_loadDevices.action?type=1&install=0&id='+id;
		companys = W.companys;
		sid = W.sid;
		addCompanyTree(companys,sid);
		$('#downTip').remove();
	}else if(type == 'simInfo') {//选择SIM卡
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.SIM_card_number, name : 'simInfo', pfloat : 'left'}
		});
		model = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.SIM_card_number, name : 'cardNum', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'}
		];
		params.push({
			name: 'num',
			value: name
		});
		action = 'StandardSIMCardInfoAction_loadSIMInfos.action?type=1&install=0&id='+id;
		companys = W.companys;
		sid = W.sid;
		addCompanyTree(companys,sid);
		$('#downTip').remove();
	}else if(type == 'driver') {//选择司机
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.driver_name, name : 'driver', pfloat : 'left'}
		});
		model = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.job_number, name : 'jobNum', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.person_name, name : 'name', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.sex, name : 'sex', width : 50, sortable : false, align: 'center'},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'}
		];
		params.push({
			name: 'name',
			value: name
		});	
		action = 'StandardDriverAction_loadDrivers.action?type=1';
		companys = W.companys;
		sid = W.sid;
		addCompanyTree(companys,sid);
		$('#downTip').remove();
	}else if(type == 'vehiclePermit') {//车辆授权
		$.myajax.jsonGet("StandardUserAction_findUserAccount.action?id=" + id, function(json,action,success){
			if (success) {
				var company_ = getArrayInfo(parent.companys, json.user.pid);
				sid = company_.parentId;
				getChildCompanys(parent.vehiGroupList, companys, company_.id);
				for(var i = 0;i < companys.length; i++) {
					getChildCompanys(parent.vehiGroupList,companys,companys[i].id);
				}
				companys.push(company_);
				$('#opera-top-toolbar').append('<div style="float:right;margin-right:5px;"><span style="font-weight:bold;">'+parent.lang.label_permit_labelUser+'</span><span style="margin:0px 0px 0px 5px;">'+json.user.nm+'</span></div>');
				addCompanyTree(companys, sid);
				$('#combox-company').attr('placeholder',parent.lang.btnSelectCompanyOrGroup);
				$('#combox-company').attr('data-placeholder',parent.lang.btnSelectCompanyOrGroup);
			}
		}, null);
		$('#toolbar-combo-status').flexPanel({
			ComBoboxModel :{
				button :
				[[{
						display: parent.lang.select_status, name : 'status', pid : 'status', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]],
					combox: {name : 'status', option : '1&'+parent.lang.authorized+'|0&'+parent.lang.unauthorized}
			}	
		});
		$('#label-status').text(parent.lang.unauthorized);
		$('#hidden-status').val(0);
		
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.monitor_searchVehicle, name : 'devIdno', pfloat : 'left'}
		});
		model = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.plate_number, name : 'vehiIDNO', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.motorcade, name : 'motorcade', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'}
		];
		params.push({
			name: 'name',
			value: name
		});
		params.push({
			name: 'isPermit',
			value: $('#hidden-status').val()
		});
		action = 'StandardUserAction_getPermitVehicles.action?id='+id;
		$('#downTip').remove();
	}else if(type == 'giveVehiclePermit'){//用户授权
		$.myajax.jsonGet("StandardUserAction_findVehicle.action?id=" + encodeURI(id), function(json,action,success){
			if (success) {
			//	sid = json.user.company.parentId;
				getChildCompanys(parent.vehiGroupList,companys,json.vehicle.company.id);
				for(var i = 0;i < companys.length; i++) {
					getChildCompanys(parent.vehiGroupList,companys,companys[i].id);
				}
				var parentCompanys = [];
				getPartCompanys(parent.vehiGroupList,parentCompanys,json.vehicle.company.id);
				for(var i = 0;i < parentCompanys.length; i++) {
					getPartCompanys(parent.vehiGroupList,parentCompanys,parentCompanys[i].parentId);
				}
				companys = companys.concat(parentCompanys);
				for(var i = 0; i < parentCompanys.length; i++) {
					if(parentCompanys[i].level == 1) {
						companyNew.push(parentCompanys[i]);
					}
				}
			//	companys = parent.vehiGroupList;
				for(var i = 0;i < companyNew.length; i++) {
					//getChildCompanys(parent.vehiGroupList,companys,companys[i].id);
					if(companyNew[i].id == parent.companyId) {
						sid = companyNew[i].parentId;
						break;
					}
				}
			//	companys.push(json.user.company);
				//$('#opera-top-toolbar').append('<div style="float:right;margin-right:5px;"><span style="font-weight:bold;">'+parent.lang.plate_number+'</span><span style="margin:0px 0px 0px 5px;">'+json.vehicle.vehiIDNO+'</span></div>');
				addCompanyTree(companyNew,sid);
			}
		}, null);
		$('#toolbar-combo-status').flexPanel({
			ComBoboxModel :{
				button :
				[[{
						display: parent.lang.select_status, name : 'status', pid : 'status', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]],
					combox: {name : 'status', option : '1&'+parent.lang.authorized+'|0&'+parent.lang.unauthorized}
			}	
		});
		$('#label-status').text(parent.lang.unauthorized);
		$('#hidden-status').val(0);
		
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.login_account, name : 'devIdno', pfloat : 'left'}
		});
		model = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.login_UserName, name : 'account', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'}
		];
		params.push({
			name: 'name',
			value: name
		});
		params.push({
			name: 'isPermit',
			value: $('#hidden-status').val()
		});
		action = 'StandardUserAction_getPermitUsers.action?id='+encodeURI(id);
		$('#downTip').remove();
	}else if(type == 'assignRule') {//车辆规则分配
		var ruleType = getUrlParameter('ruleType'); //规则类型
		if(ruleType == 'timerRecording') {
			$('#opera-top-toolbar').append('<div style="float:right;margin-right:5px;"><span id="spanTipStorage" style="float:left;">'+parent.lang.label_tipStorage+'</span><span style="font-weight:bold;margin-left:5px;">'+parent.lang.rule_selectedRule+'</span><span style="margin:0px 0px 0px 5px;">'+name+'</span></div>');
		}else  {
			$('#opera-top-toolbar').append('<div style="float:right;margin-right:5px;"><span style="font-weight:bold;">'+parent.lang.rule_selectedRule+'</span><span style="margin:0px 0px 0px 5px;">'+name+'</span></div>');
		}
		$('#toolbar-combo-status').flexPanel({
			ComBoboxModel :{
				button :
				[[{
						display: parent.lang.select_status, name : 'status', pid : 'status', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]],
					combox: {name : 'status', option : '1&'+parent.lang.assigned+'|0&'+parent.lang.unallocated}
			}	
		});
		$('#label-status').text(parent.lang.unallocated);
		$('#hidden-status').val(0);
		
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.monitor_searchVehicle, name : 'devIdno', pfloat : 'left'}
		});
		model = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.plate_number, name : 'vehiIDNO', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'}
		];
		params.push({
			name: 'isAssign',
			value: $('#hidden-status').val()
		});
		
		action = 'StandardVehicleRuleAction_getAssignVehicles.action?id='+id+'&ruleType='+ruleType;
		$('#downTip').remove();
	}else if(type == 'stoRelation') {//存储服务器关联终端
		$('#opera-top-toolbar').append('<div style="float:right;margin-right:5px;"><span style="font-weight:bold;">'+parent.lang.server_labelStoServer+'</span><span style="margin:0px 0px 0px 5px;">'+name+'</span>');
		
		$('#toolbar-combo-status').flexPanel({
			ComBoboxModel :{
				button :
				[[{
						display: parent.lang.select_status, name : 'status', pid : 'status', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]],
					combox: {name : 'status', option : '1&'+parent.lang.associated+'|0&'+parent.lang.unassociated}
			}	
		});
		$('#label-status').text(parent.lang.unassociated);
		$('#hidden-status').val(0);
		
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.monitor_searchVehicle, name : 'devIdno', pfloat : 'left'}
		});
		model = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.plate_number, name : 'vehiIDNO', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'}
		];
		params.push({
			name: 'isRelation',
			value: $('#hidden-status').val()
		});
		action = 'StandardServerAction_getStoreRelList.action?id='+id;
		companys = parent.vehiGroupList;
		sid = parent.companyId;
		addCompanyTree(companys, sid);
		$('#downTip').remove();
	}else if(type == 'assignLineVehicle') {//线路分配车辆
		$.myajax.jsonGet("StandardLineAction_findLineInfo.action?id=" + id, function(json,action,success){
			if (success) {
				var company_ = getArrayInfo(parent.vehiGroupList, json.line.pid);
				if(company_.level != 1) {
					company_ = getArrayInfo(parent.vehiGroupList, company_.companyId);
				}
				sid = company_.parentId;
				getChildCompanys(parent.vehiGroupList, companys, company_.id);
				for(var i = 0;i < companys.length; i++) {
					getChildCompanys(parent.vehiGroupList,companys,companys[i].id);
				}
				for (var i = companys.length - 1; i >= 0; i--) {
					if(companys[i].level == 3) {
						companys.splice(i, 1);
					}
				}
				companys.push(company_);
//				$('#opera-top-toolbar').append('<div style="float:right;margin-right:5px;"><span style="font-weight:bold;">'+parent.lang.label_permit_labelUser+'</span><span style="margin:0px 0px 0px 5px;">'+json.line.name+'</span></div>');
				addCompanyTree(companys, sid);
				$('#combox-company').attr('placeholder',parent.lang.btnSelectCompanyOrGroup);
				$('#combox-company').attr('data-placeholder',parent.lang.btnSelectCompanyOrGroup);
			}
		}, null);
		$('#toolbar-combo-status').flexPanel({
			ComBoboxModel :{
				button :
				[[{
						display: parent.lang.select_status, name : 'status', pid : 'status', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]],
					combox: {name : 'status', option : '1&'+parent.lang.assigned+'|0&'+parent.lang.unallocated}
			}	
		});
		$('#label-status').text(parent.lang.unallocated);
		$('#hidden-status').val(0);
		
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.monitor_searchVehicle, name : 'devIdno', pfloat : 'left'}
		});
		model = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.plate_number, name : 'id', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.motorcade, name : 'motorcade', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'}
		];
		params.push({
			name: 'name',
			value: name
		});
		params.push({
			name: 'isAssign',
			value: $('#hidden-status').val()
		});
		action = 'StandardLineAction_getPermitVehicles.action?id='+id;
		$('#downTip').remove();
	}else if(type == 'relationStation') {//线路关联已存在站点
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.line_station_name_enter, name : 'devIdno', pfloat : 'left'}
		});
		var mod_ = [];
		mod_.push([{
			display: parent.lang.add, name : '', pclass : 'btnAdd',bgcolor : 'gray', hide : false
		}]);
		$('#toolbar-btn-top').flexPanel({
			ButtonsModel : mod_
		});
		model = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.name, name : 'name', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.direction, name : 'direct', width : 60, sortable : false, align: 'center'},
			{display: parent.lang.abbreviation, name : 'abbr', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.remark, name : 'remark', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'}
		];
		params.push({
			name: 'name',
			value: name
		});
		action = 'StandardLineAction_searchStations.action';
		$('#downTip').remove();
		
		//添加
		$('.btnAdd').on('click', addStationInfo);
	}
		
		
	var buttonsModel = [];
	if(singleSelect) {
		checkbox = false;
	}else {
		buttonsModel.push([{
			display: parent.lang.save, name : '', pclass : 'save',bgcolor : 'gray', hide : false
		}]);
	}
	buttonsModel.push([{
			display: parent.lang.close, name : '', pclass : 'close',bgcolor : 'gray', hide : false
		}]);
	$('#toolbar-btn').flexPanel({
		ButtonsModel :  buttonsModel
	});
	
	if(type == 'vehiclePermit') {
		$('.save .label').text(parent.lang.authorize);
	}else if(type == 'giveVehiclePermit') {
		$('.save .label').text(parent.lang.authorize);
	}else if(type == 'assignRule') {
		$('.save .label').text(parent.lang.assign);
	}else if(type == 'stoRelation') {
		$('.save .label').text(parent.lang.associate);
	}else if(type == 'assignLineVehicle') {
		$('.save .label').text(parent.lang.assign);
	}

	if(type != 'assignRule' && type != 'stoRelation') {
		$('#toolbar-search .search-input').val(name);
	}
	
	$('#infoTable').flexigrid({
		url: action,
		dataType: 'json',
		colModel : model,
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
		checkbox: checkbox,
		rpOptions: [10, 20, 50, 100, 200, 500],
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		usepager: usepager,
		singleSelect: singleSelect,
		autoload: true,
		useRp: true,
		title: false,
		rp: rp,
		params: params,
		showTableToggleBtn: true,
		showToggleBtn: false,
		width: 'auto',//Math.round(6 * parent.screenWidth/7) - 5,
		onSubmit: false,//addFormData,
		height: 350
	});

	$('#select-status .ui-menu-item').each(function() {
		$(this).on('click',function(){
			if($(this).attr('data-index') == 1) {
				if(type == 'vehiclePermit') {
					$('.save .label').text(parent.lang.deauthorize);
				}else if(type == 'giveVehiclePermit') {
					$('.save .label').text(parent.lang.deauthorize);
				}else if(type == 'assignRule') {
					$('.save .label').text(parent.lang.unassign);
				}else if(type == 'stoRelation') {
					$('.save .label').text(parent.lang.disassociate);
				}else if(type == 'assignLineVehicle') {
					$('.save .label').text(parent.lang.unassign);
					$('.td-company').hide();
				}
			}else {
				if(type == 'vehiclePermit') {
					$('.save .label').text(parent.lang.authorize);
				}else if(type == 'giveVehiclePermit') {
					$('.save .label').text(parent.lang.authorize);
				}else if(type == 'assignRule') {
					$('.save .label').text(parent.lang.assign);
				}else if(type == 'stoRelation') {
					$('.save .label').text(parent.lang.associate);
				}else if(type == 'assignLineVehicle') {
					$('.save .label').text(parent.lang.assign);
					$('.td-company').show();
				}
			}
			loadQuery();
		});
	});
	
	
	$('#toolbar-search .y-btn').on('click',function(){
		loadQuery();
	});
	$('#toolbar-search .search-input').on('keydown',function(e){
		if(e.keyCode == 13) {
			loadQuery();
		}
	});

	if(type == null) {
		$('.bDiv').scroll( function() {
			var e= $('.bDiv');
			if((e.height() + e.scrollTop()) == e[0].scrollHeight) {
				loadInfos();
			}
		});
	}

	$('.save').on('click',saveSubmit);
	
	$('.close').on('click',function() {
		W.doExit();
	});
}

function loadQuery() {
	var params = [];
	params.push({
		name: 'companyId',
		value: $('#hidden-company').val()
	});
	if(type == 'device') {
		params.push({
			name: 'devIDNO',
			value: $('#toolbar-search .search-input').val()
		});
	}else if(type == 'simInfo') {
		params.push({
			name: 'num',
			value: $('#toolbar-search .search-input').val()
		});
	}else if(type == 'driver') {
		params.push({
			name: 'name',
			value: $('#toolbar-search .search-input').val()
		});	
	}else if(type == 'vehiclePermit') {
		params.push({
			name: 'name',
			value: $('#toolbar-search .search-input').val()
		});
		params.push({
			name: 'isPermit',
			value: $('#hidden-status').val()
		});
	}else if(type == 'giveVehiclePermit') {
		params.push({
			name: 'name',
			value: $('#toolbar-search .search-input').val()
		});
		params.push({
			name: 'isPermit',
			value: $('#hidden-status').val()
		});
	}else if(type == 'assignRule') {
		params.push({
			name: 'name',
			value: $('#toolbar-search .search-input').val()
		});
		params.push({
			name: 'isAssign',
			value: $('#hidden-status').val()
		});
	}else if(type == 'stoRelation') {
		params.push({
			name: 'name',
			value: $('#toolbar-search .search-input').val()
		});
		params.push({
			name: 'isRelation',
			value: $('#hidden-status').val()
		});
	}else if(type == 'assignLineVehicle') {
		params.push({
			name: 'name',
			value: $('#toolbar-search .search-input').val()
		});
		params.push({
			name: 'isAssign',
			value: $('#hidden-status').val()
		});
	}else if(type == 'relationStation') {
		params.push({
			name: 'name',
			value: $('#toolbar-search .search-input').val()
		});
	} 
	
	$('#infoTable').flexOptions(
		{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function loadInfos() {
	var param = $('#infoTable').flexGetParams();
	var companyId = $('#hidden-company').val();
	var devIDNO = $('#toolbar-search .search-input').val();
	var action = '';
	if(type == 'device') {
		action = 'StandardDeviceAction_loadDevices.action?type=1&install=0&companyId='+companyId+'&devIDNO='+devIDNO;
	}else if(type == 'simInfo') {
		action = 'StandardSIMCardInfoAction_loadSIMInfos.action?type=1&install=0&companyId='+companyId+'&num='+devIDNO;
	}else if(type == 'driver') {
		action = 'StandardDriverAction_loadDrivers.action?type=1&install=0&companyId='+companyId+'&name='+devIDNO;
	}else if(type == 'vehiclePermit') {
		var isPermit = $('#hidden-status').val();
		action = 'StandardUserAction_getPermitVehicles.action?id='+id+'&companyId='+companyId+'&name='+devIDNO+'&isPermit='+isPermit;
	}else if(type == 'giveVehiclePermit') {
		var isPermit = $('#hidden-status').val();
		action = 'StandardUserAction_getPermitUsers.action?id='+encodeURI(id)+'&companyId='+companyId+'&name='+devIDNO+'&isPermit='+isPermit;
	}else if(type == 'relationStation') {
		action = 'StandardLineAction_searchStations.action?name='+devIDNO;
	}
	if(param.page * param.rp < param.total) {
		var pagination={currentPage:param.page+1, pageRecords:param.rp};
		$.myajax.showLoading(true, parent.lang.loading);
		$.myajax.jsonGetEx(action, function(json,action,success){
			if(success) {
				$.myajax.showLoading(false);
				if(json.infos != null && json.infos.length >0) {
			//		deviceList.concat(json.infos);
					$('#infoTable').flexAddData(json,true);
				}
			};
		}, pagination);
	}
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'account') {
		if(type == 'giveVehiclePermit') {
			pos = row['act'];
		}else {
			pos = row[name];
		}
	}else if(name == 'vehiIDNO') {
		if(type == 'assignRule') {
			pos = row['name'];
		}else {
			pos = changeNull(row[name]);
		}
	}else if(name == 'company') {
		if(type == 'device') {
			var company_ = getParentCompany(parent.vehiGroupList, row['companyId']);
			if(company_.level == 2) {
				company_ = getParentCompany(parent.vehiGroupList, company_.companyId);
			}
			pos = company_.name;
		}else if(type == 'simInfo' || type == 'driver') {
			if(row[name].level == 2) {
				pos = getParentCompany(parent.vehiGroupList,row[name].companyId).name;
			}else {
				pos = row[name].name;
			}
		}else if(type == 'giveVehiclePermit') {
			pos = getArrayName(parent.companys, row['pid']);
		}else if(type == 'vehiclePermit'){
			var company = row[name];
			if(company.level == 1){
				pos = company.name;
			}else{
				pos = getParentCompany(parent.vehiGroupList,company.companyId).name;
			}
		}else if(type == 'assignRule' || type == 'assignLineVehicle'){
			var company = getArrayInfo(parent.vehiGroupList, row['parentId']);
			if(company) {
				if(company.level == 1){
					pos = company.name;
				}else{
					pos = getArrayInfo(parent.vehiGroupList, company.companyId).name;
				}
			}else {
				pos = '';
			}
		}else {
			pos = row[name].name;
		}
	}else if(name == 'motorcade') {
		var company = null;
		if(type == 'assignLineVehicle') {
			company = getArrayInfo(parent.vehiGroupList, row['parentId']);
		}else {
			company = row['company'];
		}
		if(company && company.level == 3) {
			company = getArrayInfo(parent.vehiGroupList, company.parentId);
		}
		if(company && company.level == 2){
			pos = company.name;
		}else{
			pos = "";
		}
	}else if(name == 'sex') {
		if(row[name] == 1) {
			pos = parent.lang.man;
		}else if(row[name] == 2) {
			pos = parent.lang.woman;
		}
	}else if(name == 'devType') {
		pos = getArrayName(getTerminalTypes(),row[name]);
	}else if(name == 'direct') {
		pos = getArrayName(getStationDirect(), row[name]);
	}else if(name == 'operator'){
		if(type == 'device') {
			if(row['simInfo']) {
				pos = '<a class="blue select" href="javascript:selectInfo('+row['id']+',\''+row['devIDNO']+'\','+row['simInfo'].id+',\''+row['simInfo'].cardNum+'\');" title="'+parent.lang.select+'"></a>';
			}else {
				pos = '<a class="blue select" href="javascript:selectInfo('+row['id']+',\''+row['devIDNO']+'\',\'\',\'\');" title="'+parent.lang.select+'"></a>';
			}
		}else if(type == 'simInfo') {
			pos = '<a class="blue select" href="javascript:selectInfo('+row['id']+',\''+row['cardNum']+'\');" title="'+parent.lang.select+'"></a>';
		}else if(type == 'driver') {
			pos = '<a class="blue select" href="javascript:selectInfo('+row['id']+',\''+row['jobNum']+'\');" title="'+parent.lang.select+'"></a>';
		}else if(type == 'vehiclePermit') {
			if($('#hidden-status').val() == 1) {
				pos = '<a class="blue not-authorize" href="javascript:selectInfo('+row['id']+');" title="'+parent.lang.deauthorize+'"></a>';
			}else {
				pos = '<a class="blue authorize" href="javascript:selectInfo('+row['id']+');" title="'+parent.lang.authorize+'"></a>';
			}
		}else if(type == 'giveVehiclePermit') {
			if($('#hidden-status').val() == 1) {
				pos = '<a class="blue not-authorize" href="javascript:selectInfo('+row['id']+');" title="'+parent.lang.deauthorize+'"></a>';
			}else {
				pos = '<a class="blue authorize" href="javascript:selectInfo('+row['id']+');" title="'+parent.lang.authorize+'"></a>';
			}
		}else if(type == 'assignRule') {
			if($('#hidden-status').val() == 1) {
				pos = '<a class="blue not-assign" href="javascript:selectInfo('+row['id']+');" title="'+parent.lang.unassign+'"></a>';
			}else {
				pos = '<a class="blue assign" href="javascript:selectInfo('+row['id']+');" title="'+parent.lang.assign+'"></a>';
			}
		}else if(type == 'stoRelation') {
			if($('#hidden-status').val() == 1) {
				pos = '<a class="blue not-associate" href="javascript:selectInfo('+row['id']+');" title="'+parent.lang.disassociate+'"></a>';
			}else {
				pos = '<a class="blue associate" href="javascript:selectInfo('+row['id']+');" title="'+parent.lang.associate+'"></a>';
			}
		}else if(type == 'assignLineVehicle') {
			if($('#hidden-status').val() == 1) {
				pos = '<a class="blue not-assign" href="javascript:selectInfo(\''+row['id']+'\');" title="'+parent.lang.unassign+'"></a>';
			}else {
				pos = '<a class="blue assign" href="javascript:selectInfo(\''+row['id']+'\');" title="'+parent.lang.assign+'"></a>';
			}
		}else if(type == 'relationStation') {
			pos = '<a class="blue assign" href="javascript:selectInfo(\''+row['id']+'\');" title="'+parent.lang.assign+'"></a>';
		}
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function selectInfo(idno,name,simIdno,simNum) {
	var index = getUrlParameter('index');
	if(type == 'device') {
		W.doSelectDevice(index, idno, name,simIdno,simNum);
	}else if(type == 'simInfo') {
		W.doSelectSimInfo(index, idno, name);
	}else if(type == 'driver') {
		W.doSelectDriver(index, idno, name);	
	}else if(type == 'vehiclePermit') {
		action = 'StandardUserAction_savePermitNew.action?id=' + id +'&isPermit='+$('#hidden-status').val();
		saveInfo(action, idno);
	}else if(type == 'giveVehiclePermit') {
		action = 'StandardUserAction_saveUserPermit.action?id=' + encodeURI(id) +'&isPermit='+$('#hidden-status').val();
		saveInfo(action, idno);
	}else if(type == 'assignRule') {
		action = 'StandardVehicleRuleAction_saveRulePermitNew.action?id=' + id +'&isAssign='+$('#hidden-status').val();
		saveInfo(action, idno);
	}else if(type == 'stoRelation') {
		var action = 'StandardServerAction_saveStoreRel.action?id=' + id +'&isRelation='+$('#hidden-status').val();
		saveInfo(action, idno);
	}else if(type == 'assignLineVehicle') {
		var action = 'StandardLineAction_saveLineVehicle.action?id=' + id +'&isAssign='+$('#hidden-status').val();
		saveInfo(action, idno);
	}else if(type == 'relationStation') {
		var action = 'StandardLineAction_saveLineStationRelation.action?lid=' + id +'&sid='+ idno +'&direct='+ direct;
		saveInfo(action, idno);
	}
}

//获取设备类型
function getTerminalTypes() {
	var terminalTypes = [];
	terminalTypes.push({id:5,name: parent.lang.device_standard});
	terminalTypes.push({id:6,name: parent.lang.device_Beidou});
	terminalTypes.push({id:7,name: parent.lang.device_video});
	terminalTypes.push({id:0,name: parent.lang.other});
	return terminalTypes;
}

//获取站点方向
function getStationDirect() {
	var directs = [];
	directs.push({id:0,name: parent.lang.east});
	directs.push({id:1,name: parent.lang.south});
	directs.push({id:2,name: parent.lang.west});
	directs.push({id:3,name: parent.lang.north});
	return directs;
}

/**
 * 公司树双击事件
 */
function companyDblClickEvent() {
	var selId = companyTree.getSelectedItemId();
	if(selId != '*_0' && selId != '*_'+sid) {
		var id =selId.split('_')[1];
		$('#company_tree').hide();
		$('.td-company #combox-company').val(getArrayName(companys,id));
		$('.td-company #hidden-company').val(id);
		$('.td-company .span-tip').text('*');
	}else {
		$('.td-company #combox-company').val(parent.lang.all_companies);
		$('.td-company #hidden-company').val('');
		$('#company_tree').hide();
	}
	loadQuery();
}

function saveSubmit() {
	var rows = $('#infoTable').selectedRows();
	var permits = [];
	var action = "";
	if(rows != null && rows.length > 0) {
		for(var i = 0; i < rows.length; i++) {
			permits.push(rows[i][0].RowIdentifier);
		}
	}
	if(permits.length == 0) {
		alert(parent.lang.errSelectedRequired);
		return;
	}
	if(type == 'vehiclePermit') {
		action = 'StandardUserAction_savePermitNew.action?id=' + id +'&isPermit='+$('#hidden-status').val();
	}else if(type == 'giveVehiclePermit') {
		action = 'StandardUserAction_saveUserPermit.action?id=' + encodeURI(id) +'&isPermit='+$('#hidden-status').val();
	}else if(type == 'assignRule') {
		action = 'StandardVehicleRuleAction_saveRulePermitNew.action?id=' + id +'&isAssign='+$('#hidden-status').val();
	}else if(type == 'stoRelation') {
		action = 'StandardServerAction_saveStoreRel.action?id=' + id +'&isRelation='+$('#hidden-status').val();
	}else if(type == 'assignLineVehicle') {
		action = 'StandardLineAction_saveLineVehicle.action?id=' + id +'&isAssign='+$('#hidden-status').val();
	}
	
	saveInfo(action, permits.toString());
}

function saveInfo(action, idnos) {
	var data = {};
	data.permits = idnos;
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		//关闭并退出对话框
		if (success) {
			if(type == 'vehiclePermit') {
				//刷新授权车辆信息
				if(!parent.myUserRole.isAdmin()) {
					parent.isChangedVehicle = true;
				}
				if($('#hidden-status').val() == 1) {
					$.dialog.tips(parent.lang.deauthorizeok, 1);
				}else {
					$.dialog.tips(parent.lang.authorizeok, 1);
				}
				loadQuery();
			}else if(type == 'giveVehiclePermit') {
				//刷新授权车辆信息
				if(!parent.myUserRole.isAdmin()) {
					parent.isChangedVehicle = true;
				}
				if($('#hidden-status').val() == 1) {
					$.dialog.tips(parent.lang.deauthorizeok, 1);
				}else {
					$.dialog.tips(parent.lang.authorizeok, 1);
				}
				loadQuery();
			}else if(type == 'assignRule') {
				if($('#hidden-status').val() == 1) {
					$.dialog.tips(parent.lang.unassignok, 1);
				}else {
					$.dialog.tips(parent.lang.assignok, 1);
				}
				loadQuery();
			}else if(type == 'stoRelation') {
				if($('#hidden-status').val() == 1) {
					$.dialog.tips(parent.lang.disassociateok, 1);
				}else {
					$.dialog.tips(parent.lang.associateok, 1);
				}
				loadQuery();
			}else if(type == 'assignLineVehicle') {
				if($('#hidden-status').val() == 1) {
					$.dialog.tips(parent.lang.unassignok, 1);
				}else {
					$.dialog.tips(parent.lang.assignok, 1);
				}
				loadQuery();
			}else if(type == 'relationStation') {
				$.dialog.tips(parent.lang.associateok, 1);
				W.relationSuc();
			}
		}
	});
}

//添加站点信息
function addStationInfo() {
	var maxSindex = getUrlParameter('maxSindex'); //站点最大索引
	var title = parent.lang.add+'&nbsp&nbsp&nbsp&nbsp';
	if(direct == 1){
		title += parent.lang.line_station_down;
	}else {
		title += pos = parent.lang.line_station_up;
	}
	$.dialog({id:'stationinfox', title: title, content: 'url:OperationManagement/StationInfo.html?type=add&lineDirect='+direct+'&lineId='+id+'&maxSindex='+maxSindex,
		width:'975px',height:'450px', min:false, max:false, lock:true, parent: api});
}

//添加站点成功退出
function doSaveStationSuc(data) {
	$.dialog({id:'stationinfox'}).close();
	W.doAddStationSuc();
}

//添加站点退出
function doExit() {
	$.dialog({id:'stationinfox'}).close();
}
//function disableForm(flag){}