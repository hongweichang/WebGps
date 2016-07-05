var api = frameElement.api, W = api.opener;
var sid;
var companys = [];
var type = getUrlParameter('type');
var companyid = getUrlParameter('companyid');
var companyname = decodeURIComponent(getUrlParameter('companyname'));
var singleSelect = false;//是否单选
var vehicles = [];
var nopermit = [];
var isLoad = false;
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
	W.isNewPermit = 1;
	var rp = 50;
	$('#downTip').text(parent.lang.loadCountTip.replace(/{number}/, rp));
	var name = decodeURIComponent(getUrlParameter("name"));
	var model = [];
	var action = "";
	var params = [];
	var usepager = true;
	var checkbox = true;
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
			{display: parent.lang.search_vehicle, name : 'devIdno', pfloat : 'left'}
	});
	model = [
		{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
		{display: parent.lang.plate_number, name : 'name', width : 100, sortable : false, align: 'center', hide: false},
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
	params.push({
		name: 'type',
		value: type
	});
	companys = W.companys;
	sid = W.sid;
	addCompanyTree(companys,sid);
	$('#combox-company').get(0).disabled = true;
	
//	$.myajax.jsonGet('StandardVehicleAction_loadCompanyVehicles.action?companyid='+companyid, function(json,action,success){
//		if(success) {
//			vehicles = json.vehicles;
//			isLoad = true;
//			if()
//		};
//	}, null);
	$('#downTip').remove();	
		
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
	
	$('.save .label').text(parent.lang.authorize);
	
	$('#infoTable').flexigrid({
		url: 'StandardVehicleAction_loadCompanyVehicles.action?companyid='+companyid,
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
		onSuccess: setPermitCount,
		height: 350
	});
	
	$('#select-status .ui-menu-item').each(function() {
		$(this).on('click',function(){
			if($(this).attr('data-index') == 1) {
				$('.save .label').text(parent.lang.deauthorize);
			}else {
				$('.save .label').text(parent.lang.authorize);
			}
			loadQuery();
		});
	});
	
	
	$('#toolbar-search .y-btn').on('click',function(){
		loadQuery();
	});
	$('#toolbar-search .search-input').on('keydown',function(e){
		if(e.keyCode == 13) {
			//loadQuery();
		}
	});

	if(type == null) {
		$('.bDiv').scroll( function() {
			var e= $('.bDiv');
			if((e.height() + e.scrollTop()) == e[0].scrollHeight) {
				//loadInfos();
			}
		});
	}
	$('#combox-company').val(companyname);
	$('#hidden-company').val(companyid);

	$('.save').on('click',saveSubmit);
	
	$('.close').on('click',function() {
		W.doExit();
	});
}

function addFormData() {
	if(!isLoad) {
		setTimeout(addFormData,2000);
	}else {
		var param = $('#infoTable').flexGetParams();
		param.total = vehicles.length;
		if(!param.newp) {
			param.newp = 1;
		}
		var vehis = [];
		for(var i = (param.newp - 1) * param.rp ; i < param.newp * param.rp && i < param.total; i++) {
			vehis.push(vehicles[i]);
		}
		var pagination={currentPage:param.newp, pageRecords:param.rp, totalRecords: param.total};
		var json = {};
		json.infos = vehis;
		json.pagination = pagination;
		$('#infoTable').flexAddData(json);
	}
}

function loadQuery() {
	var params = [];
	params.push({
		name: 'name',
		value: $('#toolbar-search .search-input').val()
	});
	params.push({
		name: 'isPermit',
		value: $('#hidden-status').val()
	});
	params.push({
		name: 'type',
		value: 1
	});
	
	$('#infoTable').flexOptions(
		{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}


function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'company') {
		pos = getArrayName(companys,row['parentId']);
	}else if(name == 'operator'){
		if($('#hidden-status').val() == 1) {
			pos = '<a class="not-authorize" href="javascript:selectInfo(\''+row['id']+'\');" title="'+ parent.lang.deauthorize +'"></a>';
		}else {
			pos = '<a class="authorize" href="javascript:selectInfo(\''+row['id']+'\');" title="'+ parent.lang.authorize +'"></a>';
		}
	}else{
		pos = row[name];
	}
	return pos;
}

function selectInfo(idno) {
	var action = 'StandardVehicleAction_savePermitVehicles.action?isPermit='+$('#hidden-status').val();
	saveInfo(action, idno);
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
}

function saveSubmit() {
	var rows = $('#infoTable').selectedRows();
	var permits = [];
	var action = "";
	if(rows != null && rows.length > 0) {
		for(var i = 0; i < rows.length; i++) {
			permits.push(rows[i][0].name);
		}
	}
	if(permits.length == 0) {
		alert(parent.lang.errSelectedRequired);
		return;
	}
	action = 'StandardVehicleAction_savePermitVehicles.action?isPermit='+$('#hidden-status').val();
	
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
			if($('#hidden-status').val() == 1) {
				$.dialog.tips(parent.lang.deauthorizeok, 1);
			}else {
				$.dialog.tips(parent.lang.authorizeok, 1);
			}
			loadQuery();
		}
	});
}

function setPermitCount() {
	var data = $('#infoTable').flexGetData();
	W.setPermitCount(data.permitCount);
	W.permitVehi = data.permitVehi;
}