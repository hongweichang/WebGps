$(document).ready(function(){
	setTimeout(loadClientViewPage, 50);
}); 

function loadClientViewPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadClientViewPage, 50);
	} else {
		loadLang();
		switchClientPage('device');
		loadClientInfo();
	}
}

var clientPage = "device";

function isLoadDeviceList() {
	if (clientPage == "device") {
		return true;
	} else {
		return false;
	}
}

function loadLang(){
	$("#clientTitle").text(parent.lang.client_title);
	$("#clientView").text(parent.lang.client_viewTitle);		
	$("#clientEdit").text(parent.lang.edit);
	$("#clientResetPwd").text(parent.lang.client_resetPwd);
	$("#defaultPwdtip").text(parent.lang.client_defaultPwdtip);
	$("#labelDeviceCount").text(parent.lang.client_deviceCount);
	$("#labelUserCount").text(parent.lang.home_clientUserCount);
	$("#labelClientLinkman").text(parent.lang.client_labelLinkman);
	$("#labelClientTelephone").text(parent.lang.client_labelTelephone);
	$("#labelClientEmail").text(parent.lang.client_labelEmail);
	$("#labelClientAccount").text(parent.lang.client_labelAccount);
	$("#liDeviceList").text(parent.lang.client_deviceList);
	$("#liClientList").text(parent.lang.client_clientList);
	$("#saleSelectedDevice").text(parent.lang.device_saleSelDevice);
	$("#deleteSelectedDevice").text(parent.lang.device_delSelDevice);
	$("#exportVehicleExcel").text(parent.lang.device_exportVehicleExcel);
	$("#exportMobileExcel").text(parent.lang.device_exportMobileExcel);
	$("#exportAllExcel").text(parent.lang.device_exportExcel);
	$("#spanClientOperatorTip").text(parent.lang.client_operatorTip);
	initDeviceHead();
	initClientHead();
}

function switchClientPage(page) {
	var allpages = ["device","client"];
	var allnodes = document.getElementsByName('cliMenuItem');
	for(var i=0; i<allpages.length; i += 1){
		if(page == allpages[i]){
			allnodes[i].className = "befor";
			clientPage = page;
			$("#" + allpages[i] +  "Table").show();
			$("#" + allpages[i] +  "Pagination").show();
			$("#" + allpages[i] +  "Operator").show();
		}else{
			allnodes[i].className = "";
			$("#" + allpages[i] +  "Table").hide();
			$("#" + allpages[i] +  "Pagination").hide();
			$("#" + allpages[i] +  "Operator").hide();
		}
	}
	loadClientViewList();
}

function loadClientViewList() {
	if (isLoadDeviceList()) {
		loadDeviceList(1, getUrlParameter("id"));
	} else {
		loadClientList(1, getUrlParameter("id"));
	}
}

function showClientInfo(data) {
	$("#clientLinkMan").text(data.linkMan);
	$("#clientEmail").text(data.email);
	$("#clientTelephone").text(data.telephone);
}

function loadClientInfo() {
	var id = getUrlParameter("id");
	//向服务器发送ajax请求
	$.myajax.jsonGet("SysClientAction_get.action?id=" + id + "&statics=1", function(json,action,success){
		if (success) {
			$("#clientName").text(json.name);
			$("#clientAccount").text(json.account);
			showClientInfo(json);
			$("#deviceCount").text(json.deviceCount);
			$("#userCount").text(json.userCount);
		}
	}, null);
}

function editClient() {
	editClientInfo(getUrlParameter("id"));
}

function doEditClientSuc(id, data) {
	$.dialog({id:'editclient'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//更新界面显示
	$("#clientName").text(data.userAccount.name);
	$("#clientAccount").text(data.userAccount.account);
	showClientInfo(data);
}

function resetPwd() {
	//显示的消息
	$.myajax.showLoading(true, parent.lang.client_resetPwdIng);
	$.myajax.jsonGet("SysClientAction_resetPwd.action?id=" + getUrlParameter("id"), function(json,action,success){
		$.myajax.showLoading(false);
		if (success) {
			$.dialog.tips(parent.lang.saveok, 1);
		}
	}, null);
}