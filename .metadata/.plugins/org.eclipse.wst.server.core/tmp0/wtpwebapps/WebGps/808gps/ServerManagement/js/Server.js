var serverType = getUrlParameter('type');
var stations = [];
var titleName = '';
$(document).ready(function(){
	ajaxLoadDownStation();
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
	//
	getServerType();
	$('#serverListName').text(titleName);
	//
	var mod = [];
	if(serverType == 'DownStation') {
		mod.push([{
			display: parent.lang.add,name : '',pclass : 'btnAdd',bgcolor : 'gray',hide : false
		}]);
	}else {
		mod.push([{
			display: parent.lang.add,name : '',pclass : 'btnAdd',bgcolor : 'gray',hide : false
		}]);
	}
	$('#toolbar-btn').flexPanel({
		ButtonsModel : mod
	});
	
	var gridMod = [];
	var url = '';
	if(serverType == 'DownStation') {
		gridMod = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.server_name, name : 'name', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.server_stationSsid, name : 'ssid', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.operator, name : 'operator', width : 120, sortable : false, align: 'center'}
		];
		url = 'StandardServerAction_standardStationList.action';
	}else {
		url = 'StandardServerAction_standardServerList.action?svrtype=' + getServerType();
		gridMod = [{display: parent.lang.operator, name : 'operator', width : 120, sortable : false, align: 'center'}];
		if(serverType == 'StorageServer') {
			gridMod.push({display: parent.lang.server_relation, name : 'relation', width : 80, sortable : false, align: 'center'});
		}
		gridMod.push({display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'});
		gridMod.push({display: parent.lang.server_name, name : 'name', width : 100, sortable : false, align: 'center'});
		gridMod.push({display: parent.lang.number, name : 'idno', width : 60, sortable : false, align: 'center'});
		if(serverType == 'DownServer') {
			gridMod.push({display: parent.lang.server_downStation, name : 'station', width : 60, sortable : false, align: 'center'});
		}
		gridMod.push({display: parent.lang.status, name : 'status', width : 40, sortable : false, align: 'center'});
		gridMod.push({display: parent.lang.server_lanip, name : 'lanip', width : 100, sortable : false, align: 'center'});
		if(getServerType() == 7){
			gridMod.push({display: parent.lang.server_wifiDevice, name : 'deviceIp', width : 100, sortable : false, align: 'center'});
		}else{
			gridMod.push({display: parent.lang.server_deviceIp, name : 'deviceIp', width : 100, sortable : false, align: 'center'});
		}
		//gridMod.push({display: parent.lang.server_deviceIp, name : 'deviceIp', width : 100, sortable : false, align: 'center'});
		gridMod.push({display: parent.lang.server_deviceIp2, name : 'deviceIp2', width : 100, sortable : false, align: 'center'});
		gridMod.push({display: parent.lang.server_devicePort, name : 'devicePort', width : 60, sortable : false, align: 'center'});
		gridMod.push({display: parent.lang.server_clientIp, name : 'clientIp', width : 100, sortable : false, align: 'center'});
		gridMod.push({display: parent.lang.server_clientIp2, name : 'clientIp2', width : 100, sortable : false, align: 'center'});
		gridMod.push({display: parent.lang.server_clientPort, name : 'clientPort', width : 60, sortable : false, align: 'center'});
	}
	
	$('#serverInfoTable').flexigrid({
		url: url,
		dataType: 'json',
		colModel : gridMod,
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
		showTableToggleBtn: false,
		showToggleBtn: true,
		width: 'auto',
		onSubmit: false,
		height: 'auto'
	});
	loadReportTableWidth(fixHeight);
	$('.btnAdd','#toolbar-btn').on('click',function(){
		if(serverType == 'DownStation') {
			addDownStation();
		}else {
			addServerInfo();
		}
	});
	
}

function fixHeight() {
	$('#serverInfoTable').flexFixHeight();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'name' || name == 'idno') {
		if(serverType == 'DownStation') {
			pos += '<a class="blue" href="javascript:editDownStation('+row['id']+');">'+row[name]+'</a>';
		}else {
			pos += '<a class="blue" href="javascript:editServerInfo(\''+row['idno']+'\');">'+row[name]+'</a>';
		}
	}else if(name == 'operator'){
		if(serverType == 'DownStation') {
			pos += '<a class="edit" href="javascript:editDownStation('+row['id']+');" title="'+parent.lang.edit+'"></a>';
			pos += '<a class="delete" href="javascript:delDownStation('+row['id']+');" title="'+parent.lang.del+'"></a>';
		}else {
			pos += '<a class="edit" href="javascript:editServerInfo(\''+row['idno']+'\');" title="'+parent.lang.edit+'"></a>';
			pos += '<a class="delete" href="javascript:delServerInfo(\''+row['idno']+'\');" title="'+parent.lang.del+'"></a>';
		}
	}else if(name == 'station') {
		pos = getArrayName(stations, row['area']);
	}else if(name == 'relation') {
		pos += '<a class="associate" href="javascript:editStoRelation(\''+row['idno']+'\',\''+row['name']+'\');" title="'+parent.lang.associate+'"></a>';
	}else if(name == 'status') {
		if (row['svrSession'] != null) {
			pos = parent.lang.online;
		} else {
			pos = parent.lang.offline;
		}
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

//添加下载站点
function addDownStation() {
	$.dialog({id:'addstation', title:parent.lang.server_addStation,content:'url:ServerManagement/serverdownstation.html'
		, width: '490px', height: '200px', min:false, max:false, lock:true});
}
function doAddStationSuc() {
	$.dialog({id:'addstation'}).close();
	$.dialog.tips(parent.lang.addok, 1);
	$('#serverInfoTable').flexOptions().flexReload();
}
//修改下载站点
function editDownStation(id) {
	$.dialog({id:'editstation', title:parent.lang.server_stationEdit,content:'url:ServerManagement/serverdownstation.html?id=' + id
		, width: '490px', height: '200px', min:false, max:false, lock:true});
}
function doEditStationSuc(id, data) {
	$.dialog({id:'editstation'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	$('#serverInfoTable').flexOptions().flexReload();
}
//删除下载站点
function delDownStation(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet("StandardServerAction_deleteStation.action?id=" + id, function(json,action,success){
		$.myajax.showLoading(false);
		$('#serverInfoTable').flexOptions().flexReload();
	}, null);
}

//添加服务器
function addServerInfo() {
	$.dialog({id:'addserver', title:parent.lang.server_add,content:'url:ServerManagement/serverinfo.html?svrtype=' + getServerType()
		, min:false, max:false, lock:true});
}
function doAddSuc() {
	$.dialog({id:'addserver'}).close();
	$.dialog.tips(parent.lang.addok, 1);
	$('#serverInfoTable').flexOptions().flexReload();
}
//修改服务器
function editServerInfo(idno) {
	$.dialog({id:'editserver', title:parent.lang.server_edit,content:'url:ServerManagement/serverinfo.html?idno=' + idno + '&svrtype=' + getServerType()
		, min:false, max:false, lock:true});
}
function doEditSuc(idno, data) {
	$.dialog({id:'editserver'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	$('#serverInfoTable').flexOptions().flexReload();
}
//删除服务器
function delServerInfo(idno) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet("StandardServerAction_delete.action?idno=" + idno, function(json,action,success){
		$.myajax.showLoading(false);
		$('#serverInfoTable').flexOptions().flexReload();
	}, null);
}
//终端关联
function editStoRelation(idno,name) {
	$.dialog({id:'info', title:parent.lang.server_editStorageRelation,content: 'url:OperationManagement/SelectInfo.html?type=stoRelation&id='+idno+'&name='+idno+'&singleSelect=false',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}
function doExit() {
	$.dialog({id:'info'}).close();
}

function getServerType() {
	var type = 1;
	titleName = parent.lang.server_login;
	if(serverType == "LoginServer") {
		type = 1;
		titleName = parent.lang.server_login;
	} else if(serverType == "GatewayServer") {
		type = 2;
		titleName = parent.lang.server_gateway;
	} else if(serverType == "MediaServer") {
		type = 3;
		titleName = parent.lang.server_media;
	} else if(serverType == "UserServer") {
		type = 4;
		titleName = parent.lang.server_user;
	} else if(serverType == "StorageServer") {
		type = 5;
		titleName = parent.lang.server_storage;
	} else if(serverType == "DownServer") {
		type = 7;
		titleName = parent.lang.server_down;
	} else if(serverType == "DownStation") {
		titleName = parent.lang.server_downStation;
	}
	return type;
}

//获取下载站点
function ajaxLoadDownStation() {
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("StandardServerAction_allStation.action", function(json,action,success){
		if (success) {
			stations = json.stations;	
		}
		$.myajax.showLoading(false);
	}, null);
}