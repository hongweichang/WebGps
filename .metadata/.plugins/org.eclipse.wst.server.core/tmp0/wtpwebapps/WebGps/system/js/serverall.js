function loadServerAllLang(){
	$("#view").text(parent.lang.view);
	$("#loginServer").text(parent.lang.server_login);
	$("#allGateway").text(parent.lang.all);
	$("#gatewayServer").text(parent.lang.server_gateway);
	$("#allMedia").text(parent.lang.all);
	$("#mediaServer").text(parent.lang.server_media);
	$("#allUser").text(parent.lang.all);
	$("#userServer").text(parent.lang.server_user);
	$("#totalGateway").text(parent.lang.server_total);
	$("#gatewayOnline").text(parent.lang.online);
	$("#totalUser").text(parent.lang.server_total);
	$("#userOnline").text(parent.lang.online);
	$("#totalMedia").text(parent.lang.server_total);
	$("#mediaOnline").text(parent.lang.online);
	$("#allStorage").text(parent.lang.all);
	$("#storageServer").text(parent.lang.server_storage);
	$("#totalStorage").text(parent.lang.server_total);
	$("#storageOnline").text(parent.lang.online);
	$("#allDownload").text(parent.lang.all);
	$("#downloadServer").text(parent.lang.server_down);
	$("#totalDownload").text(parent.lang.server_total);
	$("#downloadOnline").text(parent.lang.online);
}

function ajaxLoadStatics() {
	$("#hServerDownload").hide();
	$("#pServerDownload").hide();
	$("#hServerStorage").hide();
	$("#pServerStorage").hide();
	showAjaxLoading("#loginStatus", true);
	showAjaxLoading("#totalGatewayCount", true);
	showAjaxLoading("#totalGatewayOnline", true);
	showAjaxLoading("#totalUserCount", true);
	showAjaxLoading("#totalUserOnline", true);
	showAjaxLoading("#totalMediaCount", true);
	showAjaxLoading("#totalMediaOnline", true);
	showAjaxLoading("#totalDownloadCount", true);
	showAjaxLoading("#totalDownloadOnline", true);
	//向服务器发送ajax请求
	$.myajax.jsonGet("SysServerAction_allserver.action",function(json,action,success){
		if (success) {
			if (json.loginServerStatus) {
				$("#loginStatus").text(parent.lang.online);
			} else {
				$("#loginStatus").text(parent.lang.offline);
			}
			$("#totalGatewayCount").text(json.serverGatewayCount);
			$("#totalGatewayOnline").text(json.serverGatewayOnline);
			$("#totalUserCount").text(json.serverUserCount);
			$("#totalUserOnline").text(json.serverUserOnline);
			$("#totalMediaCount").text(json.serverMediaCount);
			$("#totalMediaOnline").text(json.serverMediaOnline);
			$("#totalStorageCount").text(json.serverStorageCount);
			$("#totalStorageOnline").text(json.serverStorageOnline);
			$("#totalDownloadCount").text(json.serverDownloadCount);
			$("#totalDownloadOnline").text(json.serverDownloadOnline);
			if (json.enableStorage) {
				$("#hServerStorage").show();
				$("#pServerStorage").show();
			} 
			if (json.enableAutoDown) {
				$("#hServerDownload").show();
				$("#pServerDownload").show();
			}
		}
	}, null);
}

