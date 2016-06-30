var plateTypes = [];
var vehiStatus = [];
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
	//初始化车牌类型
	initPlateTypes();
	
	$('#toolbar-search').flexPanel({
		SerachBarModel :
			{display: parent.lang.plate_number, name : 'devIdno', pfloat : 'left'}
	});
	
	var mod = [[{
		display: parent.lang.add, name : '', pclass : 'btnAddSafe',bgcolor : 'gray', hide : false
	}]];
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : mod
	});
	
	$('#safeInfoTable').flexigrid({
		url: 'StandardVehicleSafeAction_loadVehicleSafes.action',
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.plate_number, name : 'vehiIDNO', width : 80, sortable : false, align: 'center', hide: false},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.license_plate_type, name : 'plateType', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.safe_com, name : 'safeCom', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.agent, name : 'agent', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.contact_phone, name : 'telephone', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.safe_start_time, name : 'startTime', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.safe_end_time, name : 'endTime', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.safe_count, name : 'count', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.actualPrice, name : 'actualPrice', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 200, sortable : false, align: 'center'}
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
		autoload: true,
		//checkbox:checkbox,
		useRp: true,
		title: false,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: false,
		width: 'auto',
		onSubmit: false,
		height: 'auto'
	});
	loadReportTableWidth();
	$('#toolbar-search .y-btn').on('click',function(){
		loadQuery(1);
	});
	$('#toolbar-search .search-input').on('keydown',function(e){
		if(e.keyCode == 13) {
			loadQuery(2);
		}
	});
	$('.btnAddSafe','#toolbar-btn').on('click',function(){
		$.dialog({id:'safeinfo', title:parent.lang.create+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.vehiSafe_management,content: 'url:OperationManagement/VehicleSafeInfo.html?type=add',
				width:'975px',height:'350px', min:false, max:false, lock:true});
	});
}

function loadQuery(type) {
	var name = $.trim($('#toolbar-search .search-input').val());
	var params = [];
	params.push({
		name: 'name',
		value: name
	});
	$('#safeInfoTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'company') {
		var company = getArrayInfo(parent.vehiGroupList, row['companyId']);
		if(company.level == 2 || company.level == 3) {
			var company_ = getArrayInfo(parent.vehiGroupList, company.companyId);
			if(company_) {
				pos = company_.name;
			}
		}else {
			pos = company.name;
		}
	}else if(name == 'vehiIDNO') {
		pos = row['vehiIdno'];
	}else if(name == 'plateType') {
		pos = getArrayName(plateTypes, row['plateType']);
	}else if(name == 'startTime') {
		pos = dateTime2DateString(row[name]);
	}else if(name == 'endTime') {
		pos = dateTime2DateString(row[name]);
	}else if(name == 'operator'){
		pos = '<a class="detail" href="javascript:findSafeInfo('+row['id']+');" title="'+ parent.lang.detailed +'"></a>';
		pos += '<a class="edit" href="javascript:editSafeInfo('+row['id']+');" title="'+ parent.lang.edit +'"></a>';
		pos += '<a class="delete" href="javascript:delSafeInfo('+row['id']+');" title="'+ parent.lang.del +'"></a>';
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

//查询车辆信息
function findSafeInfo(id) {
	$.dialog({id:'safeinfo', title:parent.lang.view+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.vehiSafe_management,content: 'url:OperationManagement/VehicleSafeInfo.html?id='+id+'&type=',
	width:'975px',height:'350px', min:false, max:false, lock:true});
}
//修改车辆信息
function editSafeInfo(id) {
	$.dialog({id:'safeinfo', title:parent.lang.edit+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.vehiSafe_management,content: 'url:OperationManagement/VehicleSafeInfo.html?id='+id+'&type=edit',
		width:'975px',height:'350px', min:false, max:false, lock:true});
}

function delSafeInfo(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet('StandardVehicleSafeAction_deleteVehicelSafe.action?id=' + id, function(json,action,success){
		$.myajax.showLoading(false);
		if(success){
			$('#safeInfoTable').flexOptions().flexReload();
		}
	}, null);
}

function doSaveVehicleSafeSuc() {
	$('#safeInfoTable').flexOptions().flexReload();
	$.dialog({id:'safeinfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

//初始化车牌类型
function initPlateTypes() {
	plateTypes.push({id:1,name: parent.lang.blue_label});
	plateTypes.push({id:2,name: parent.lang.yellow_label});
	plateTypes.push({id:3,name: parent.lang.black_label});
	plateTypes.push({id:4,name: parent.lang.white_label});
	plateTypes.push({id:0,name: parent.lang.other});
}

function doExit() {
	$.dialog({id:'info'}).close();
}