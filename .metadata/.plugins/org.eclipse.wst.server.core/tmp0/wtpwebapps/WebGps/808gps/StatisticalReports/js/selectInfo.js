var api = frameElement.api, W = api.opener;
var sid;
var companys = [];
var type = getUrlParameter('type');
var id = decodeURIComponent(getUrlParameter('id')); 
var singleSelect = getUrlParameter('singleSelect') == "true" ? true : false;//是否单选
var selectAll = getUrlParameter('selectAll');//是否可以选择所有
var isOil = getUrlParameter('isOil') == "true" ? true : false;//是否有油量传感器
var isOBD = getUrlParameter('isOBD') == "true" ? true : false;//是否有OBD
var isPeople = getUrlParameter('isPeople') == "true" ? true : false;
var isTpms = getUrlParameter('isTpms') == "true" ? true : false;
var isTemp = getUrlParameter('isTemp') == "true" ? true : false;
var isInvoice = getUrlParameter('isInvoice') == "true" ? true : false;
var level = getUrlParameter('level');
var selIds = W.selIds; //已选择的记录
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
	var rp = 50;
	$('#downTip').text(parent.lang.loadCountTip.replace(/{number}/, rp));
	var model = [];
	var action = "";
	var params = [];
	var usepager = true;
	var checkbox = true;
	if(type == 'selVehicle') {//选择车辆
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.monitor_searchVehicle, name : 'vehiIDNO', pfloat : 'left'}
		});
		model = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.plate_number, name : 'vehiIDNO', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.motorcade, name : 'motorcade', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'}
		];
		if(!isInvoice){
			action = 'StandardLoginAction_getUserVehicleListEx.action';
			if(isOil){
				action += '?isOil=true';
			}else{
				action += '?isOil=false';
			}
			if(isOBD){
				action += '&isOBD=true';
			}else{
				action += '&isOBD=false';
			}
			if(isPeople){
				action += '&isPeople=true';
			}else{
				action += '&isPeople=false';
			}
			if(isTpms){
				action += '&isTpms=true';
			}else{
				action += '&isTpms=false';
			}
			if(isTemp){
				action += '&isTemp=true';
			}else{
				action += '&isTemp=false';
			}
		}else{
			action = 'StandardVehicleAction_loadSendInvoVehis.action';
		}
		companys = parent.vehiGroupList;
		sid = 0;
		for(var i = 0; i < companys.length; i++) {
			if(companys[i].id == parent.companyId) {
				sid = companys[i].parentId;
			}
		}
		addCompanyTree(companys, sid);
		$('#combox-company').attr('placeholder',parent.lang.btnSelectCompanyOrGroup);
		$('#combox-company').attr('data-placeholder',parent.lang.btnSelectCompanyOrGroup);
		if(singleSelect) {
			$('#downTip').remove();
		}else {
			usepager = false;
		}
	}else if(type == 'selCompany') {//选择公司
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.monitor_searchCompanyTeam, name : 'name', pfloat : 'left'}
		});
		model = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.company_name, name : 'name', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.parent_company, name : 'parentName', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'}
		];
		action = 'StandardLoginAction_loadUserCompanys.action?type=1&level='+level;
		if(level == '0'){
			companys = parent.vehiGroupList
		}else{
			companys = parent.companys;
		}
		sid = 0;
		for(var i = 0; i < companys.length; i++) {
			if(companys[i].id == parent.companyId) {
				sid = companys[i].parentId;
			}
		}
		addCompanyTree(companys, sid);
		usepager = false;
	}else if(type == 'selLine') {//选择线路
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.monitor_searchLine, name : 'name', pfloat : 'left'}
		});
		model = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.rule_line, name : 'name', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.belong_company, name : 'parentName', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'}
		];
		action = 'StandardLoginAction_loadUserCompanys.action?type=1&level='+2;
		if(level == '0'){
			companys = parent.vehiGroupList
		}else{
			companys = parent.companys;
		}
		sid = 0;
		for(var i = 0; i < companys.length; i++) {
			if(companys[i].id == parent.companyId) {
				sid = companys[i].parentId;
			}
		}
		addCompanyTree(companys, sid);
		usepager = false;
	}else if(type == 'selDriver') {//选择司机
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.monitor_searchDriver, name : 'name', pfloat : 'left'}
		});
		model = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.driver_name, name : 'name', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'}
		];
		action = 'StandardLoginAction_loadDriverList.action?type=1';
		if(level == '0'){
			companys = parent.vehiGroupList
		}else{
			companys = parent.companys;
		}
		sid = 0;
		for(var i = 0; i < companys.length; i++) {
			if(companys[i].id == parent.companyId) {
				sid = companys[i].parentId;
			}
		}
		addCompanyTree(companys, sid);
		usepager = false;
	}else if(type == 'selUser') {
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.login_account+'/'+parent.lang.user_name, name : 'name', pfloat : 'left'}
		});
		model = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.login_account, name : 'account', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.person_name, name : 'name', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'}
		];
		action = 'StandardUserAction_loadUserList.action';
		companys = parent.companys;
		sid = 0;
		for(var i = 0; i < companys.length; i++) {
			if(companys[i].id == parent.companyId) {
				sid = companys[i].parentId;
			}
		}
		addCompanyTree(companys, sid);
	}
		
		
	var buttonsModel = [];
	if(singleSelect) {
		checkbox = false;
	}else {
		buttonsModel.push([{
			display: parent.lang.save, name : '', pclass : 'save',bgcolor : 'gray', hide : false
		}]);
	}
	if(selectAll == 'true') {
		buttonsModel.push([{
			display: parent.lang.selectAllSave, name : '', pclass : 'selAll',bgcolor : 'gray', hide : false
		}]);
	}
	buttonsModel.push([{
			display: parent.lang.close, name : '', pclass : 'close',bgcolor : 'gray', hide : false
		}]);
	$('#toolbar-btn').flexPanel({
		ButtonsModel :  buttonsModel
	});
	
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
				}else if(type == 'assignRule') {
					$('.save .label').text(parent.lang.unassign);
				}else if(type == 'stoRelation') {
					$('.save .label').text(parent.lang.disassociate);
				} 
			}else {
				if(type == 'vehiclePermit') {
					$('.save .label').text(parent.lang.authorize);
				}else if(type == 'assignRule') {
					$('.save .label').text(parent.lang.assign);
				}else if(type == 'stoRelation') {
					$('.save .label').text(parent.lang.associate);
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

	if(type == 'selDriver' || type == 'selLine' || type == 'selCompany' || (type == 'selVehicle' && !singleSelect)) {
		$('.bDiv').scroll( function() {
			var e= $('.bDiv');
			if((e.height() + e.scrollTop()) == e[0].scrollHeight) {
				loadInfos();
			}
		});
	}
	
	$('.selAll').on('click', selectAllInfo);
	
	$('.save').on('click',saveSubmit);
	
	$('.close').on('click',function() {
		W.doExit();
	});

	setTimeout(selectedColumn,1000);
}

function loadQuery() {
	var params = [];
	params.push({
		name: 'companyId',
		value: $('#hidden-company').val()
	});
	if(type == 'selVehicle') {
		params.push({
			name: 'vehiIDNO',
			value: $('#toolbar-search .search-input').val()
		});
	}else if(type == 'selDriver' || type == 'selLine' || type == 'selCompany' || type == 'selUser') {
		params.push({
			name: 'name',
			value: $('#toolbar-search .search-input').val()
		});
	}
	
	$('#infoTable').flexOptions(
		{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
	setTimeout(selectedColumn,1000);
}

function  loadInfos() {
	var param = $('#infoTable').flexGetParams();
	var companyId = $('#hidden-company').val();
	var name = $('#toolbar-search .search-input').val();
	var action = '';
	if(type == 'selVehicle') {
		action = 'StandardLoginAction_getUserVehicleListEx.action?companyId='+companyId+'&vehiIDNO='+name;
		if(isOil){
			action += '&isOil=true';
		}else{
			action += '&isOil=false';
		}
		if(isOBD){
			action += '&isOBD=true';
		}else{
			action += '&isOBD=false';
		}
		if(isPeople){
			action += '&isPeople=true';
		}else{
			action += '&isPeople=false';
		}
		if(isTpms){
			action += '&isTpms=true';
		}else{
			action += '&isTpms=false';
		}
		if(isTemp){
			action += '&isTemp=true';
		}else{
			action += '&isTemp=false';
		}
	}else if(type == 'selCompany') {
		action = 'StandardLoginAction_loadUserCompanys.action?type=1&companyId='+companyId+'&name='+name+'&level='+level;
	}else if(type == 'selLine') {
		action = 'StandardLoginAction_loadUserCompanys.action?type=1&companyId='+companyId+'&name='+name+'&level='+2;
	}else if(type == 'selDriver') {
		action = 'StandardLoginAction_loadDriverList.action?type=1&companyId='+companyId+'&name='+name;
	}
	if(param.page * param.rp < param.total) {
		var pagination={currentPage:param.page+1, pageRecords:param.rp};
		$.myajax.showLoading(true, parent.lang.loading);
		disableForm(true);
		$.myajax.jsonGetEx(action, function(json,action,success){
			if(success) {
				$.myajax.showLoading(false);
				disableForm(false);
				if(json.infos != null && json.infos.length >0) {
					$('#infoTable').flexAddData(json,true);
					setTimeout(selectedColumn,1000);
				}
			};
		}, pagination);
	}
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'account') {
		if(type == 'selUser') {
			pos = row['act'];
		}else {
			pos = row[name]
		}
	}else if(name == 'name') {
		if(type == 'selUser') {
			pos = row['nm'];
		}else {
			pos = row[name]
		}
	}else if(name == 'company') {
		if(type != 'selVehicle' && type != 'selDriver') {
			if(type == 'selUser') {
				pos = getArrayName(parent.companys, row['pid']);
			}else {
				if(row[name].level == 2) {
					pos = getParentCompany(parent.vehiGroupList,row[name].companyId).name;
				}else {
					pos = row[name].name;
				}
			}
		}else {
			var company = getParentCompany(parent.vehiGroupList,row['parentId']);
			if(company.level == 1){
				pos = company.name;
			}else{
				pos = getParentCompany(parent.vehiGroupList,company.companyId).name;
			}
		}
	}else if(name == 'motorcade') {
		var company = getParentCompany(parent.vehiGroupList,row['parentId']);
		if(company.level == 2){
			pos = company.name;
		}else{
			pos = "";
		}
	}else if(name == 'vehiIDNO') {
		pos = row['name'];
	}else if(name == 'operator'){
		if(type == 'selVehicle') {
			pos = '<a class="select" href="javascript:selectInfo(\''+row['id']+'\',\''+row['name']+'\');" title="'+parent.lang.select+'"></a>';
		}else if(type == 'selCompany') {
			pos = '<a class="select" href="javascript:selectInfo('+row['id']+',\''+row['name']+'\');" title="'+parent.lang.select+'"></a>';
		}else if(type == 'selLine') {
			pos = '<a class="select" href="javascript:selectInfo('+row['id']+',\''+row['name']+'\');" title="'+parent.lang.select+'"></a>';
		}else if(type == 'selDriver') {
			pos = '<a class="select" href="javascript:selectInfo('+row['id']+',\''+row['name']+'\');" title="'+parent.lang.select+'"></a>';
		}else if(type == 'selUser') {
			pos = '<a class="select" href="javascript:selectInfo('+row['id']+',\''+row['act']+'\');" title="'+parent.lang.select+'"></a>';
		}
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function selectInfo(idno,name) {
	if(type == 'selVehicle') {
		parent.defaultVehi = idno.toString();
		W.doSelectVehicle(idno.toString(),name);
	}else if(type == 'selCompany') {
		W.doSelectCompany(idno.toString(),name);
	}else if(type == 'selLine') {
		W.doSelectCompany(idno.toString(),name);
	}else if(type == 'selDriver') {
		W.doSelectCompany(idno.toString(),name);
	}if(type == 'selUser') {
		var user = {};
		user.id = idno.toString();
		user.name = name;
		parent.defaultUser = user;
		W.doSelectUser(idno.toString(),name);
	}
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
	var ids = [];
	var names = [];
	if(rows != null && rows.length > 0) {
		for(var i = 0; i < rows.length; i++) {
			ids.push(rows[i][0].RowIdentifier);
			names.push(rows[i][2].Value);
		}
	}
	if(ids.length == 0) {
		alert(parent.lang.errSelectedRequired);
		return;
	}
	if(type == 'selVehicle' && !singleSelect) {
		parent.defaultVehi = names.toString();
		W.doSelectVehicle(names.toString(),names.toString());
	}else if(type == 'selCompany') {
		W.doSelectCompany(ids.toString(),names.toString());
	}else if(type == 'selLine') {
		W.doSelectCompany(ids.toString(),names.toString());
	}
}

function selectedColumn() {
	if(selIds != null && selIds != '') {
		var ids = selIds.split(',');
		if(ids.length > 0) {
			$('#infoTable tr').each(function() {
				for(var i = 0; i < ids.length; i++) {
					if($(this).attr('data-id') == ids[i].toString()) {
						if(singleSelect) {
							$(this).addClass('trSelected');
						}else {
							if($(this).find('.selectItem') && $(this).find('.selectItem')[0] && !$(this).find('.selectItem')[0].checked) {
								$(this).click();
							}
						}
						break;
					}
				}
			});
		}
	}
}

function selectAllInfo() {
	if(type == 'selVehicle') {
		if(typeof W.selIds != 'undefined') {
			W.selIds = '0';
		}
		parent.defaultVehi = '0';
		W.doSelectVehicle('0','');
	}else if(type == 'selCompany') {
		W.doSelectCompany('0','');
	}else if(type == 'selLine') {
		W.doSelectCompany('0','');
	}else if(type == 'selDriver') {
		W.doSelectCompany('0','');
	}if(type == 'selUser') {
		var user = {};
		user.id = '0';
		user.name = '';
		parent.defaultUser = user;
		W.doSelectUser('0', '');
	}
}

//function disableForm(flag){}