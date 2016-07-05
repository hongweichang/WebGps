$(document).ready(function(){
	setTimeout(loadServerPage, 50);
}); 

function loadServerPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadServerPage, 50);
	} else {
		//加载语言
		loadLang();
		//切换到所有服务器界面
		switchServerPage("all");
		//加载服务器页面
		$("#hrefDownStation").hide();
		$("#hrefDownServer").hide();
		$("#hrefStorageServer").hide();
		ajaxLoadServerConfig();
	}
}

function ajaxLoadServerConfig() {
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("SysServerAction_serverConfig.action", function(json,action,success){
		$.myajax.showLoading(false);
		if (success) {
			if (json.enableAutoDown) {
				$("#hrefDownStation").show();
				$("#hrefDownServer").show();
			}
			if (json.enableStorage) {
				$("#hrefStorageServer").show();
			}
		}
	}, null);
}

var serverType = "all";

function loadLang(){
	$("#serverTitle").text(parent.lang.server);
	$("#serverAll").text(parent.lang.all);
	$("#serverLogin").text(parent.lang.server_login);
	$("#serverGateway").text(parent.lang.server_gateway);
	$("#serverMedia").text(parent.lang.server_media);
	$("#serverUser").text(parent.lang.server_user);
	$("#serverStorage").text(parent.lang.server_storage);
	$("#serverDownStation").text(parent.lang.server_downStation);
	$("#serverDown").text(parent.lang.server_down);
	loadServerAllLang();
	loadLoginLang();
	loadServerLang();
	loadStationLang();
}

function switchServerPage(page) {
	var allpages = ["all","login","gateway","user","media","storage","downStation","down"];
	var allnodes = document.getElementsByName('svrMenuItem');
	for(var i=0; i<allpages.length; i++){
		if(page == allpages[i]){
			allnodes[i].className = "befor";
			serverType = page;
		}else{
			allnodes[i].className = "";		
		}
	}
	
	updateServerType();
	if (serverType == "all") {
		$("#page_all").show();
		$("#page_login").hide();
		$("#page_server").hide();
		$("#page_downStation").hide();
	} else if (serverType == "login") {
		$("#page_all").hide();
		$("#page_login").show();
		$("#page_server").hide();
		$("#page_downStation").hide();
	} else if (serverType == "downStation") {
		$("#page_all").hide();
		$("#page_login").hide();
		$("#page_server").hide();
		$("#page_downStation").show();
	} else {
		$("#page_all").hide();
		$("#page_login").hide();
		$("#page_server").show();
		$("#page_downStation").hide();
	}
	
	if (serverType == "all") {
		ajaxLoadStatics();
	} else if (serverType == "login") {
		ajaxLoadLoginInfo();
	} else if (serverType == "downStation") {
		ajaxLoadStation();
	} else {
		if (serverType == "down") {
			$("#thStation").show();
		} else {
			$("#thStation").hide();
		}
		if (serverType == "storage") {
			$("#thRelation").show();
		} else {
			$("#thRelation").hide();
		}
		ajaxLoadServerInfo();
	}
	
	parent.resizeFrame();
}

function getServerName() {
	var name = parent.lang.unkown;
	if (serverType == "all") {
		name = parent.lang.all;
	} else if(serverType == "login") {
		name = parent.lang.server_login;
	} else if(serverType == "gateway") {
		name = parent.lang.server_gateway;
	} else if(serverType == "media") {
		name = parent.lang.server_media;
	} else if(serverType == "user") {
		name = parent.lang.server_user;
	} else if(serverType == "storage") {
		name = parent.lang.server_storage;
	} else if(serverType == "down") {
		name = parent.lang.server_down;
	} 
	return name;
}

function getServerType() {
	var type = 1;
	if(serverType == "login") {
		type = 1;
	} else if(serverType == "gateway") {
		type = 2;
	} else if(serverType == "media") {
		type = 3;
	} else if(serverType == "user") {
		type = 4;
	} else if(serverType == "storage") {
		type = 5;
	} else if(serverType == "down") {
		type = 7;
	} 
	return type;
}

function updateServerType() {
	$("#serverListName").text(getServerName());
	$("#serverType").text(getServerName());
}