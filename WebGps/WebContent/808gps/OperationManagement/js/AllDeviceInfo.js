$(document).ready(function(){
	setTimeout(loadReadyPage, 50);
});

var sid;
var companys = [];

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}
function loadPage(){
	if(parent.myUserRole.isAdmin() && !parent.myUserRole.isAllowManage()) {
		getDeviceCount();
		$('#sysAllDevice').text(parent.lang.device_sysManage);
		$('#allDevice').text(parent.lang.device_nowAllDevice);
		$('#allowAddDevice').text(parent.lang.device_allowAddDevice);
		$('#onlineDevice').text(parent.lang.deviceOnlineCount);
		$('#unRegDevice').text(parent.lang.unregDeviceCount);
	}else {
		getOnlineDeviceCount();
		$('#onlineDevice').text(parent.lang.deviceOnlineCount);
		if(parent.myUserRole.isAdmin() || parent.myUserRole.isAllowManage()) {
			getUnRegDeviceCount();
			$('#unRegDevice').text(parent.lang.unregDeviceCount);
		}
		$('.sysDevice').hide();
	}
	
	if(parent.myUserRole.isAdmin() || parent.myUserRole.isMaster() || parent.myUserRole.isAllowManage()){
		$('#toolbar-combo-install').flexPanel({
			ComBoboxModel :{
				button :[ [{display: parent.lang.SIM_install,width:'80px',value:'',name : 'install', pid : 'install', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden:true}] ],
				combox: 
					{name : 'install', option : '2&'+parent.lang.all+'|1&'+parent.lang.installed+'|0&'+parent.lang.unInstall+''}
			}	
		});
	}
	$('#toolbar-search').flexPanel({
		SerachBarModel :
			{display: parent.lang.device_number, name : 'device', pfloat : 'left'}
	});
	var mod = [];
	mod.push([{
		display: parent.lang.show_all_devices, name : '', pclass : 'btnAllDevice',bgcolor : 'gray', hide : false
	}]);
	mod.push([{
		display: parent.lang.showDeviceOnline, name : '', pclass : 'btnOnlineDevice',bgcolor : 'gray', hide : false
	}]);
	if(parent.myUserRole.isAdmin() || parent.myUserRole.isAllowManage()) {
		mod.push([{
			display: parent.lang.showUnregDevice, name : '', pclass : 'btnUnRegDevice',bgcolor : 'gray', hide : false
		}]);
		mod.push([{
			display: parent.lang.add, name : '', pclass : 'btnAddDevice',bgcolor : 'gray', hide : false
		}]);
		
		$('#opera-top-toolbar').css('height', '60px');
	}
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : mod
	});
	
	companys = parent.companys
	sid = 0;
	for(var i = 0; i < companys.length; i++) {
		if(companys[i].id == parent.companyId) {
			sid = companys[i].parentId;
		}
	}
	addCompanyTree(companys, sid);
	
	var width = 0;
	if(parent.screenWidth < 1280) {
		width = 900;
	}else {
		width = 'auto';
	}
	$('#deviceInfoTable').flexigrid({
		url: 'StandardDeviceAction_loadDevices.action?type=1',
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.device_number, name : 'devIDNO', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.device_serial, name : 'serialID', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.device_type, name : 'devType', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.product_brand, name : 'brand', width : 80, sortable : false, align: 'center', hide: false},
			{display: parent.lang.product_model, name : 'model', width : 100, sortable : false, align: 'center'},
		//	{display: parent.lang.software_version, name : 'softwareVer', width : 100, sortable : false, align: 'center'},
		//	{display: parent.lang.hardware_version, name : 'hardwareVer', width : 100, sortable : false, align: 'center'},
		//	{display: parent.lang.products_businesses, name : 'factory', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.belong_company, name : 'company', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.device_install, name : 'install', width : 60, sortable : false, align: 'center'},
			{display: parent.lang.device_installTime, name : 'installTime', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.device_belongVehicle, name : 'vehiIdno', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 150, sortable : false, align: 'center'}
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
//			checkbox: true,
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		usepager: true,
		autoload: true,
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
	$('.btnAllDevice','#toolbar-btn').on('click',function(){
		loadQuery(3);
	});
	$('.btnOnlineDevice','#toolbar-btn').on('click',function(){
		$.dialog({id:'online', title: parent.lang.showDeviceOnline ,content: 'url:OperationManagement/Status.html?type=device',
				width:'975px',height:'500px', min:false, max:false, lock:true});
	});
	$('.btnUnRegDevice','#toolbar-btn').on('click',function(){
		$.dialog({id:'online', title: parent.lang.showUnregDevice ,content: 'url:OperationManagement/Status.html?type=unRegDevice',
				width:'975px',height:'500px', min:false, max:false, lock:true});
	});
	$('.btnAddDevice','#toolbar-btn').on('click', function() {
		$.dialog({id:'deviceinfo', title: parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.device_information,content: 'url:OperationManagement/DeviceInfoNew.html?type=add',
				width:'975px',height:'500px', min:false, max:false, lock:true});
	});
}

function addDevice(devIdno) {
	$.dialog({id:'online'}).close();
	setTimeout(function() {
		$.dialog({id:'deviceinfo', title: parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.device_information,content: 'url:OperationManagement/VehicleInfoQuickNew.html?type=add&devIdno='+devIdno,
				width:'500px',height:'510px', min:false, max:false, lock:true});
	},50);
}

function loadQuery(type) {
	var devIDNO = '';
	var install = '';
	if(type == '1' || type == '2') {
		devIDNO = $('#toolbar-search .search-input').val();
		install = $('#toolbar-combo-install #hidden-install').val();
	}
	
	var params = [];
	params.push({
		name: 'devIDNO',
		value: devIDNO
	});
	params.push({
		name: 'install',
		value: install
	});
	
	params.push({
		name: 'companyId',
		value: $('.td-company #hidden-company').val()
	});
	$('#deviceInfoTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'company') {
		var company_ = getArrayInfo(parent.vehiGroupList, row['companyId']);
		if(company_.level == 2 || company_.level == 3) {
			company_ = getParentCompany(parent.vehiGroupList, company_.companyId);
			if(company_) {
				pos = company_.name;
			}
		}else {
			pos = company_.name;
		}
	}else if(name == 'devType') {
		pos = getArrayName(getTerminalTypes(),row[name]);
	}else if(name == 'installTime') {
		if(row['stlTm'] != null) {
			pos = dateFormat2TimeString(new Date(row['stlTm']));
		}else {
			if(row['install'] == 1) {
				pos = dateFormat2TimeString(new Date());
			}else {
				pos = parent.lang.unInstall;
			}
		}
	}else if(name == 'operator'){
		pos = '<a class="detail" href="javascript:findDeviceInfo('+row['id']+');" title="'+ parent.lang.detailed +'"></a>';
		pos += '<a class="edit" href="javascript:editDeviceInfo('+row['id']+');" title="'+ parent.lang.edit +'"></a>';
		if(parent.myUserRole.isAdmin() || parent.myUserRole.isAllowManage()) {
			if(row['install'] == 1) {
				pos += '<a class="not-delete" href="javascript:;" title="'+parent.lang.installed+'"></a>';
			}else {
				pos += '<a class="delete" href="javascript:delDeviceInfo('+row['id']+');" title="'+ parent.lang.del +'"></a>';
			}
		}
	}else if(name == 'install') {
		if(row[name] == 1) {
			pos = parent.lang.installed;
		}else {
			pos = parent.lang.unInstall;
		}
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function findDeviceInfo(id) {
	$.dialog({id:'deviceinfo', title:parent.lang.view+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.device_information,content: 'url:OperationManagement/DeviceInfoNew.html?id='+id+'&type=',
	width:'975px',height:'450px', min:false, max:false, lock:true});
}
function editDeviceInfo(id) {
	$.dialog({id:'deviceinfo', title: parent.lang.edit+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.device_information,content: 'url:OperationManagement/DeviceInfoNew.html?id='+id+'&type=edit',
		width:'975px',height:'500px', min:false, max:false, lock:true});
}
function delDeviceInfo(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet('StandardDeviceAction_deleteDevice.action?id=' + id, function(json,action,success){
		$.myajax.showLoading(false);
		if(success){
			$('#deviceInfoTable').flexOptions().flexReload();
			if(parent.myUserRole.isAdmin() && !parent.myUserRole.isAllowManage()) {
				getDeviceCount();
			}
		}
	}, null);
}

var manageCount = null;
var deviceTotal = null;
var storeCount = null;
//获取设备数目
function getDeviceCount() {
	$.myajax.jsonGet('StandardDeviceAction_getDeviceCountInfo.action', function(json,action,success){
		if(success) {
			manageCount = json.manageCount;
			deviceTotal = json.deviceTotal;
			storeCount = manageCount - deviceTotal;
			$('#sysAllDeviceCount').text(manageCount);
			$('#allDeviceCount').text(deviceTotal);
			$('#allowAddDeviceCount').text(storeCount);
			$('#onlineDeviceCount').text(json.onlineCount);
			$('#unRegDeviceCount').text(json.unregCount);
		};
	}, null);
}
//获取在线设备
function getOnlineDeviceCount() {
	$.myajax.jsonGet('StandardDeviceAction_getOnlineDeviceCount.action', function(json,action,success){
		if(success) {
			$('#onlineDeviceCount').text(json.onlineCount);
		};
	}, null);
}
//获取未注册设备数目
function getUnRegDeviceCount() {
	$.myajax.jsonGet('StandardDeviceAction_getUnregDeviceCount.action', function(json,action,success){
		if(success) {
			$('#unRegDeviceCount').text(json.unregCount);
		};
	}, null);
}

function getTerminalTypes() {
	var terminalTypes = [];
	terminalTypes.push({id:5,name: parent.lang.device_standard});
	terminalTypes.push({id:6,name: parent.lang.device_Beidou});
	terminalTypes.push({id:7,name: parent.lang.device_video});
	terminalTypes.push({id:0,name: parent.lang.other});
	return terminalTypes;
}
function doSaveDeviceSuc() {
	$('#deviceInfoTable').flexOptions().flexReload();
	$.dialog({id:'deviceinfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	if(parent.myUserRole.isAdmin() && !parent.myUserRole.isAllowManage()) {
		getDeviceCount();
	}
}
function doSaveVehicleSuc() {
	$('#deviceInfoTable').flexOptions().flexReload();
	$.dialog({id:'deviceinfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	if(parent.myUserRole.isAdmin() && !parent.myUserRole.isAllowManage()) {
		getDeviceCount();
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