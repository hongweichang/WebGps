var api = frameElement.api, W = api.opener;
var plateTypes = [];
var applyStatus = [];
var vehiIdno = decodeURIComponent(getUrlParameter('vehiIdno'));//选择的车辆节点
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
	
	initApplyStatus();
	
	$('#toolbar-combo-status').flexPanel({
		ComBoboxModel :{
			button :
			[
				[{
					display: parent.lang.select_status, name : 'status', pid : 'status', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
				}]
			],
			combox: {name : 'status', option : arrayToStr(applyStatus)}
		}	
	});
	$('#toolbar-combo-status #hidden-status').val(0);
	
	if(!parent.myUserRole.isSecondCompany() && !parent.myUserRole.isThreeCompany()){
		var mod = [[{
			display: parent.lang.add, name : '', pclass : 'addApply',bgcolor : 'gray', hide : false
		}]];
		
		$('#toolbar-btn').flexPanel({
			ButtonsModel : mod
		});
	}
	
	$('#vehicleInfoTable').flexigrid({
		url: 'StandardVehicleAction_loadVehicleApplys.action',
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.client_name, name : 'clientName', width : 80, sortable : false, align: 'center', hide: false},
			{display: parent.lang.cargo_name, name : 'cargoName', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.cargo_weight, name : 'cargoWeight', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.servers_style, name : 'servers', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.status, name : 'status', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 300, sortable : false, align: 'center'}
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
		checkbox: false,
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		usepager: true,
		autoload: false,
		//checkbox:checkbox,
		useRp: true,
		title: false,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: false,
		width: 955,
		onSubmit: false,
		height: 'auto'
	});
	$('#select-status .ui-menu-item').each(function() {
		$(this).on('click',function(){
			loadQuery();
		});
	});
	loadReportTableWidth();
	loadQuery();
	$('.addApply').on('click',function(){
		$.dialog({id:'applyinfo', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.demand_apply,content: 'url:OperationManagement/DocumentInfoNew.html?type=add&vehiIdno='+encodeURI(vehiIdno),
				width:'975px',height:'450px', min:false, max:false, lock:true,parent:api});
	});
}

//
function initApplyStatus() {
	applyStatus.push({id:0,name: parent.lang.all});
	applyStatus.push({id:1,name: parent.lang.status_pending});
	applyStatus.push({id:2,name: parent.lang.status_pass});
	applyStatus.push({id:3,name: parent.lang.status_not_pass});
}

function loadQuery() {
	var params = [];
	params.push({
		name: 'status',
		value: $('#toolbar-combo-status #hidden-status').val()
	});
	$('#vehicleInfoTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'company') {
		if(row['vehicle'].company.level == 2 || row['vehicle'].company.level == 3) {
			var company_ = getParentCompany(parent.vehiGroupList,row['vehicle'].company.companyId);
			if(company_) {
				pos = company_.name;
			}
		}else {
			pos = row['vehicle'].company.name;
		}
	}else if(name == 'vehiIDNO') {
		pos = row['vehicle'].vehiIDNO;
	}else if(name == 'plateType') {
		pos = getArrayName(plateTypes, row['vehicle'].company.plateType);
	}else if(name == 'sendStartTime') {
		pos = dateTime2TimeString(row[name]);
	}else if(name == 'servers'){
		if(row[name] == 0){
			pos = parent.lang.arrival_gate;
		}else{
			pos = parent.lang.station_to_door;
		}
	}else if(name == 'status') {
		if(row[name] == 1){
			pos = parent.lang.status_pending;
		}else if(row[name] == 2){
			pos = parent.lang.status_pass;
		}else{
			pos = parent.lang.status_not_pass;
		}
	}else if(name == 'operator'){
		if(parent.myUserRole.isSecondCompany() || parent.myUserRole.isThreeCompany()){
			pos = '<a class="detail" href="javascript:findDocumentInfo('+row['id']+');" title="'+ parent.lang.detailed +'"></a>';
			if(row['status'] != 2){
				pos += '<a class="select" href="javascript:checkDocumentInfo('+row['id']+');" title="'+ parent.lang.check +'"></a>';
			}
			if(row['sendStatus'] == 0){
				pos += '<a class="add" href="javascript:addInvoice('+row['id']+');" title="'+ parent.lang.send_car +'"></a>';
			}
		}else{
			pos = '<a class="detail" href="javascript:findDocumentInfo('+row['id']+');" title="'+ parent.lang.detailed +'"></a>';
			if(row['status'] != 2){
				pos += '<a class="edit" href="javascript:editDocumentInfo('+row['id']+');" title="'+ parent.lang.edit +'"></a>';
				pos += '<a class="delete" href="javascript:delDocumentInfo('+row['id']+');" title="'+ parent.lang.del +'"></a>';
			}
		}
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function findDocumentInfo(id) {
	$.dialog({id:'applyinfo', title:parent.lang.view+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.demand_apply,content: 'url:OperationManagement/DocumentInfoNew.html?id='+id+'&type=',
	width:'975px',height:'450px', min:false, max:false, lock:true,parent:api});
}

function editDocumentInfo(id) {
	$.dialog({id:'applyinfo', title:parent.lang.edit+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.demand_apply,content: 'url:OperationManagement/DocumentInfoNew.html?id='+id+'&type=edit',
		width:'975px',height:'450px', min:false, max:false, lock:true,parent:api});
}

function checkDocumentInfo(id) {
	$.dialog({id:'applyinfo', title:parent.lang.check+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.demand_apply,content: 'url:OperationManagement/DocumentInfoNew.html?id='+id+'&type=check',
		width:'975px',height:'450px', min:false, max:false, lock:true,parent:api});
}

function addInvoice(id){
	$.dialog({id:'applyinfo', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.send_car_receipt,content: 'url:OperationManagement/ReceiptInfoNew.html?type=add&applyId='+id,
		width:'975px',height:'720px', min:false, max:false, lock:true,parent:api});
}

function delDocumentInfo(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet('StandardVehicleAction_delApply.action?id=' + id, function(json,action,success){
		$.myajax.showLoading(false);
		if(success){
			//parent.getCompanyVehicles();
			$('#vehicleInfoTable').flexOptions().flexReload();
		}
	}, null);
}

function doSaveDocumentSuc() {
//	parent.getUserVehicles();
	$('#vehicleInfoTable').flexOptions().flexReload();
	$.dialog({id:'applyinfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

function doExit() {
	$.dialog({id:'applyinfo'}).close();
}
