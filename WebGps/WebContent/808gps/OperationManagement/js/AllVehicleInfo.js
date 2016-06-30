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
	////初始化车辆状态
	initVehiStatus();
	
	$('#toolbar-combo-status').flexPanel({
		ComBoboxModel :{
			button :
			[
				[{
					display: parent.lang.select_status, name : 'status', pid : 'status', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
				}]
			],
		//	input : {display: '选择状态',width:'60px',value:'',name : 'useType', pid : 'useType', pclass : 'buttom',bgicon : 'true', hide : false},
			combox: {name : 'status', option : arrayToStr(vehiStatus)}
		}	
	});
	$('#toolbar-search').flexPanel({
		SerachBarModel :
			{display: parent.lang.plate_number+'/'+parent.lang.device_number+'/'+parent.lang.company_name, name : 'devIdno', pfloat : 'left'}
	});
	var mod = [[{
		display: parent.lang.show_all_vehicles, name : '', pclass : 'btnAllCar',bgcolor : 'gray', hide : false
	}]];
	if(parent.myUserRole.isAdmin() || parent.myUserRole.isAllowManage()) {
		mod.push([{
			display: parent.lang.quick_new_vehicles, name : '', pclass : 'btnQuickAdd',bgcolor : 'gray', hide : false
		}]);
		
		mod.push([{
			display: parent.lang.add, name : '', pclass : 'btnAddCar',bgcolor : 'gray', hide : false
		}]);
		
		mod.push([{
			display: parent.lang.batch_edit_company, name : '', pclass : 'btnEditCars',bgcolor : 'gray', hide : false
		}]);
		
		mod.push([{
			display: parent.lang.batch_deletion, name : '', pclass : 'btnDeleteCars',bgcolor : 'gray', hide : false
		}]);
		
		mod.push([{
			display: parent.lang.exportExcel, name : '', pclass : 'btnExport',bgcolor : 'gray', hide : false
		}]);
		
		mod.push([{
			display: parent.lang.importExcel, name : '', pclass : 'btnImport',bgcolor : 'gray', hide : false
		}]);
	}else{
		mod.push([{
			display: parent.lang.batch_edit_company, name : '', pclass : 'btnEditCars',bgcolor : 'gray', hide : false
		}]);
		
		mod.push([{
			display: parent.lang.exportExcel, name : '', pclass : 'btnExport',bgcolor : 'gray', hide : false
		}]);
	}
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : mod
	});
	/*var checkbox = false;
	if(parent.myUserRole.isAdmin() || parent.myUserRole.isAllowManage()) {
		checkbox = true;
	}*/
	var width = 0;
	if(parent.screenWidth < 1280) {
		width = 980;
	}else {
		width = 'auto';
	}
	$('#vehicleInfoTable').flexigrid({
		url: 'StandardVehicleAction_loadVehicles.action?type=1',
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.plate_number, name : 'vehiIDNO', width : 100, sortable : false, align: 'center', hide: false},
		//	{display: parent.lang.SIM_card_number, name : 'simInfo', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.license_plate_type, name : 'plateType', width : 60, sortable : false, align: 'center'},
			{display: parent.lang.device_number, name : 'device', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.vehicle_color, name : 'vehiColor', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.status, name : 'vehiStatus', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.online_enstime, name : 'lastOnlineTime', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.device_installTime, name : 'install', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.vehi_service_end, name : 'server', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 200, sortable : false, align: 'center'}
	//		{display: '安装档案', name : 'armType', width : 40, sortable : false, align: 'center'},
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
		checkbox: true,
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
		width: width,
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
	$('.btnAllCar').on('click',function(){
		loadQuery(3);
	});
	$('.btnAddCar').on('click',function(){
		$.dialog({id:'vehicleinfo', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.vehicle_information,content: 'url:OperationManagement/VehicleInfoNew.html?type=add',
				width:'975px',height:'600px', min:false, max:false, lock:true});
	});
	$('.btnQuickAdd').on('click',function(){
		$.dialog({id:'vehicleinfo', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.vehicle_information,content: 'url:OperationManagement/VehicleInfoQuickNew.html?type=add',
				width:'500px',height:'510px', min:false, max:false, lock:true});
	});
	$('.btnEditCars').on('click',editCarsCompany);
	$('.btnDeleteCars').on('click',deleteCars);
	$('.btnExport').on('click',ExportToExcel);
	$('.btnImport').on('click',importExcel);
}

function loadQuery(type) {
	var name = '';
	var status = '';
	if(type == '1' || type == '2') {
		name = $('#toolbar-search .search-input').val();
		status = $('#toolbar-combo-status #hidden-status').val();
	}
	
	var params = [];
	params.push({
		name: 'name',
		value: name
	});
	params.push({
		name: 'status',
		value: status
	});
	$('#vehicleInfoTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'company') {
		if(row['com'].level == 2 || row['com'].level == 3) {
			var company_ = getParentCompany(parent.vehiGroupList, row['com'].companyId);
			if(company_) {
				pos = company_.name;
			}
		}else {
			pos = row['com'].name;
		}
	}else if(name == 'vehiIDNO') {
		pos = row['vid'];
	}else if(name == 'device') {
		var devList = row['devList'];
		if(devList != null) {
			for (var i = 0; i < devList.length; i++) {
				var device = devList[i];
				pos += '<a class="blue device" href="javascript:findDevice('+device.id+');" title="'+device.name+'">'+device.name+'</a>';
				if(devList.length > 1 && i == 0) {
					pos += ",";
				}
			}
		}
	}else if(name == 'plateType') {
		pos = getArrayName(plateTypes, row['ptp']);
	}else if(name == 'operator'){
		pos = '<a class="detail" href="javascript:findVehicleInfo('+row['id']+');" title="'+ parent.lang.detailed +'"></a>';
		pos += '<a class="edit" href="javascript:editVehicleInfo('+row['id']+');" title="'+ parent.lang.edit +'"></a>';
		if(parent.myUserRole.isAdmin() || parent.myUserRole.isMaster() || parent.myUserRole.isAllowManage() || parent.myUserRole.isPermit(33)) {
			pos += '<a class="authorize" href="javascript:giveVihiclePermit(\''+row['vid']+'\');" title="'+ parent.lang.user_authorize +'"></a>';
		}
		if(parent.myUserRole.isAdmin() || parent.myUserRole.isAllowManage()) {
			pos += '<a class="delete" href="javascript:delVehicleInfo('+row['id']+');" title="'+ parent.lang.del +'"></a>';
		}
	}else if(name == 'vehiColor') {
		if(row['cor']){
			pos = row['cor'];
		}
	}else if(name == 'vehiStatus') {
		var stu = getArrayName(vehiStatus, row['stu']);
		if(stu != null && stu != '') {
			stu += ',';
		}
		if(row['ol'] != null && row['ol'] == 1) {
			stu += parent.lang.online;
			pos += '<span class="blue" title="'+stu+'">'+ stu +'</a>';
		}else {
			stu += parent.lang.offline;
			pos += '<span title="'+stu+'">'+ stu +'</a>';
		}
	}else if(name == 'lastOnlineTime') {
		if(row['tm']){
			pos = row['tm'].substring(0,19);
		}
	}else if(name == 'install') {
		if(row['itm']){
			pos = row['itm'];
		}
	}else if(name == 'server') {
		if(row['stm']){
			pos = row['stm'];
		}
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

//查询设备信息
function findDevice(id) {
	$.dialog({id:'deviceinfo', title:parent.lang.view+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.device_information,content: 'url:OperationManagement/DeviceInfoNew.html?id='+id+'&type=',
		width:'975px',height:'450px', min:false, max:false, lock:true});
}

//查询车辆信息
function findVehicleInfo(id) {
	$.dialog({id:'vehicleinfo', title:parent.lang.view+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.vehicle_information,content: 'url:OperationManagement/VehicleInfoNew.html?id='+id+'&type=',
	width:'975px',height:'600px', min:false, max:false, lock:true});
}
//修改车辆信息
function editVehicleInfo(id) {
	$.dialog({id:'vehicleinfo', title:parent.lang.edit+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.vehicle_information,content: 'url:OperationManagement/VehicleInfoNew.html?id='+id+'&type=edit',
		width:'975px',height:'600px', min:false, max:false, lock:true});
}
//车辆授权
function giveVihiclePermit(id){
	$.dialog({id:'info', title:id + '&nbsp-&nbsp' + parent.lang.user_authorize,content: 'url:OperationManagement/SelectInfo.html?type=giveVehiclePermit&id='+id+'&singleSelect=false',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}

function editCarsCompany(){
	var rows = $('#vehicleInfoTable').selectedRows();
	var ids = [];
	var names = [];
	if(rows != null && rows.length > 0) {
		for(var i = 0; i < rows.length; i++) {
			ids.push(rows[i][0].RowIdentifier);
		}
	}
	if(ids.length == 0) {
		alert(parent.lang.errSelectedRequired);
		return;
	}
	$.dialog({id:'editcompanyinfo', title: parent.lang.batch_edit_company,content: 'url:OperationManagement/EditVehicleCompany.html?vehiIds='+ids.toString(),
		width:'300px',height:'500px', min:false, max:false, lock:true});
}

function deleteCars(){
	var rows = $('#vehicleInfoTable').selectedRows();
	var ids = [];
	var names = [];
	if(rows != null && rows.length > 0) {
		for(var i = 0; i < rows.length; i++) {
			ids.push(rows[i][0].RowIdentifier);
		}
	}
	if(ids.length == 0) {
		alert(parent.lang.errSelectedRequired);
		return;
	}
	$.dialog({id:'vehicleinfo', content:parent.lang.delvehicles, title:parent.lang.del+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.vehicle_information,
		button:[{name: parent.lang.yes, callback: function () {
			$.myajax.showLoading(true, parent.lang.deleting);
			$.myajax.jsonGet('StandardVehicleAction_deleteVehicles.action?ids=' + ids +'&deldev=1', function(json,action,success){
				$.myajax.showLoading(false);
				if(success){
					//刷新授权车辆信息
					parent.isChangedVehicle = true;
					$('#vehicleInfoTable').flexOptions().flexReload();
				}
			}, null);
		}},{name: parent.lang.no, focus: true, callback: function () {
			$.myajax.showLoading(true, parent.lang.deleting);
			$.myajax.jsonGet('StandardVehicleAction_deleteVehicles.action?ids=' + ids + '&deldev=2', function(json,action,success){
				$.myajax.showLoading(false);
				if(success){
					//刷新授权车辆信息
					parent.isChangedVehicle = true;
					$('#vehicleInfoTable').flexOptions().flexReload();
				}
			}, null);
		}}, {name: parent.lang.cancel}],min:false, max:false, lock:true});
}

function ExportToExcel(){
	document.reportForm.action = "StandardVehicleAction_excel.action";
	document.reportForm.submit(); 
}

function importExcel() {
	$.dialog({id:'importvehicle', title:parent.lang.importExcel,content:'url:OperationManagement/VehicleImport.html'
		, width:'490px', height:'100px', min:false, max:false, lock:true});
}

function doImportSuccess(){
	$.dialog({id:'importvehicle'}).close();
	$.dialog.tips(parent.lang.importok, 1);
	$('#vehicleInfoTable').flexReload();
}

function delVehicleInfo(id) {
//	if(!confirm(parent.lang.delconfirm)) {
//		return ;
//	}
	$.dialog({id:'vehicleinfo', content:parent.lang.delvehicle, title:parent.lang.del+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.vehicle_information,
	button:[{name: parent.lang.yes, callback: function () {
		$.myajax.showLoading(true, parent.lang.deleting);
		$.myajax.jsonGet('StandardVehicleAction_deleteVehicle.action?id=' + id + '&deldev=1', function(json,action,success){
			$.myajax.showLoading(false);
			if(success){
				//刷新授权车辆信息
				parent.isChangedVehicle = true;
				$('#vehicleInfoTable').flexOptions().flexReload();
			}
		}, null);
	}},{name: parent.lang.no, focus: true, callback: function () {
		$.myajax.showLoading(true, parent.lang.deleting);
		$.myajax.jsonGet('StandardVehicleAction_deleteVehicle.action?id=' + id + '&deldev=2', function(json,action,success){
			$.myajax.showLoading(false);
			if(success){
				//刷新授权车辆信息
				parent.isChangedVehicle = true;
				$('#vehicleInfoTable').flexOptions().flexReload();
			}
		}, null);
	}}, {name: parent.lang.cancel}],min:false, max:false, lock:true});
	//显示的消息
	/*$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet('StandardVehicleAction_deleteVehicle.action?id=' + id, function(json,action,success){
		$.myajax.showLoading(false);
		if(success){
			//parent.getCompanyVehicles();
			$('#vehicleInfoTable').flexOptions().flexReload();
		}
	}, null);*/
}

function doSaveVehicleSuc() {
	//刷新授权车辆信息
	parent.isChangedVehicle = true;
	$('#vehicleInfoTable').flexOptions().flexReload();
	$.dialog({id:'vehicleinfo'}).close();
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

//初始化车辆状态
function initVehiStatus() {
	vehiStatus.push({id:4,name: parent.lang.all});
	vehiStatus.push({id:0,name: parent.lang.normal});
	vehiStatus.push({id:5,name: parent.lang.online});
	vehiStatus.push({id:1,name: parent.lang.repair});
	vehiStatus.push({id:2,name: parent.lang.deactivation});
	vehiStatus.push({id:3,name: parent.lang.arrears});
}

function doExit() {
	$.dialog({id:'info'}).close();
}

function doEditVehiCompanySuccess(){
	//刷新授权车辆信息
	parent.isChangedVehicle = true;
	$('#vehicleInfoTable').flexOptions().flexReload();
	$.dialog({id:'editcompanyinfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}