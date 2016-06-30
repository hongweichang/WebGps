$(document).ready(function(){
	setTimeout(loadHome, 100);
}); 

function loadHome() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadHome, 100);
	} else {
		//加载语言
		loadLang();
		//从服务器加载相关信息
		ajaxLoadStatic();
	}
}

function loadLang(){
	$("#statDevice").text(parent.lang.home_statDevice);
	$("#deviceMore").text(parent.lang.more);
	$("#deviceManage").text(parent.lang.home_deviceManageCount);
	$("#deviceTotal").text(parent.lang.home_deviceTotalCount);
	$("#deviceStore").text(parent.lang.home_deviceStoreCount);
	$("#deviceOnline").text(parent.lang.home_deviceOnlineCount);
	$("#unregOnline").text(parent.lang.status_labelUnregCount);
	
	$("#statClient").text(top.lang.home_statClient);
	$("#clientMore").text(top.lang.more);
	$("#clientTotal").text(top.lang.home_clientTotalCount);
	$("#clientUser").text(top.lang.home_clientUserCount);
	$("#clientOnline").text(top.lang.home_clientOnlineCount);
	
	$("#statServer").text(top.lang.home_statServer);
	$("#serverMore").text(top.lang.more);
	$("#serverLogin").text(top.lang.home_serverLogin);
	$("#serverTotal").text(top.lang.home_serverCount);
	$("#serverOnline").text(top.lang.home_serverOnlineCount);
}

function ajaxLoadStatic() {
	//显示加载动画
	showAjaxLoading("#deviceManageCount", true);
	showAjaxLoading("#deviceTotalCount", true);
	showAjaxLoading("#deviceStoreCount", true);
	showAjaxLoading("#deviceOnlineCount", true);
	showAjaxLoading("#unregOnlineCount", true);
	
	showAjaxLoading("#clientTotalCount", true);
	showAjaxLoading("#clientUserCount", true);
	showAjaxLoading("#clientOnlineCount", true);
	
	showAjaxLoading("#serverLoginStatus", true);
	showAjaxLoading("#serverTotalCount", true);
	showAjaxLoading("#serverOnlineCount", true);
	
	//向服务器发送ajax请求
	$.myajax.jsonGet("SysStaticsAction_query.action",function(json){
		//设备状态
		$("#deviceManageCount").html("<a href=\"javascript:\" onclick=\"relocalPage('device', 'device.html')\">" + json.deviceManageCount + "</a>");
		//$("#deviceManageCount").text(json.deviceManageCount);
		$("#deviceTotalCount").html("<a href=\"javascript:\" onclick=\"relocalPage('device', 'device.html')\">" + json.deviceTotalCount + "</a>");
		//$("#deviceTotalCount").text(json.deviceTotalCount);
		$("#deviceStoreCount").html("<a href=\"javascript:\" onclick=\"relocalPage('device', 'device.html?type=store')\">" + json.deviceStoreCount + "</a>");
		//$("#deviceStoreCount").text(json.deviceStoreCount);
		$("#deviceOnlineCount").html("<a href=\"javascript:\" onclick=\"relocalPage('online', 'status.html?type=device')\">" + json.deviceOnlineCount + "</a>");
		//$("#deviceOnlineCount").text(json.deviceOnlineCount);
		$("#unregOnlineCount").html("<a href=\"javascript:\" onclick=\"relocalPage('online', 'status.html?type=unreg')\">" + json.deviceUnregCount + "</a>");
		//客户状态
		$("#clientTotalCount").html("<a href=\"javascript:\" onclick=\"relocalPage('client', 'client.html')\">" + json.clientTotalCount + "</a>");
		//$("#clientTotalCount").text(json.clientTotalCount);
		$("#clientUserCount").html("<a href=\"javascript:\" onclick=\"relocalPage('client', 'client.html')\">" + json.clientUserCount + "</a>");
		//$("#clientUserCount").text(json.clientUserCount);
		$("#clientOnlineCount").html("<a href=\"javascript:\" onclick=\"relocalPage('online', 'status.html?type=client')\">" + json.clientOnlineCount + "</a>");
		//$("#clientOnlineCount").text(json.clientOnlineCount);
		//服务器状态
		var loginStatus;
		if (json.LoginServerStatus) {
			loginStatus = parent.lang.online;
		} else {
			loginStatus = parent.lang.offline;
		}
		$("#serverLoginStatus").html("<a href=\"javascript:\" onclick=\"relocalPage('server', 'server.html?type=login')\">" + loginStatus + "</a>");
		$("#serverTotalCount").html("<a href=\"javascript:\" onclick=\"relocalPage('server', 'server.html')\">" + json.ServerTotalCount + "</a>");
		//$("#serverTotalCount").text(json.ServerTotalCount);
		$("#serverOnlineCount").html("<a href=\"javascript:\" onclick=\"relocalPage('server', 'server.html')\">" + json.ServerOnlineCount + "</a>");
		//$("#serverOnlineCount").text(json.ServerOnlineCount);
	}, null);
}

function relocalPage(page, url) {
	parent.switchPage(page, url);
}