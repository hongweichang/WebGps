$(document).ready(function(){
	//通过Cookie里面的账号来判断会话是否失效，如果会话无效，则直接重定位到登录界面
	var account = GetCookie("SysAccount");
	if (account == null) {
		window.location = "../login.html";
	}
	$('body').css('width',window.screen.availWidth-30);
	//初始化语言
	langInitByUrl();
	//加载语言 
	loadLang();
	//加载用户和角色信息
	loadSysUserAndRole();
	//加载home页面
	var iframe = document.getElementById("mainFrame");
	iframe.setAttribute("src", "home.html?lang=" + langCurLocal());
	//加载标题
	ajaxLoadInformation();
});

var englishSystemTitle = null;	//中文标题
var chineseSystemTitle = null;	//英文标题
var twSystemTitle = null;	//繁体标题
var indexPage = "";
var isAds = "";

function loadLang(){
//	document.title = lang.home_title;
//	$("#mainTitle").text(lang.home_title);
	$("#welcome").text(lang.home_welcome);
	$("#config").text(lang.home_changePassword);
	$("#exit").text(lang.home_exit);
	
	$("#nav_home").text(lang.home_navHome);
	$("#nav_device").text(lang.home_navDevice);
	$("#nav_client").text(lang.home_navClient);
	$("#nav_status").text(lang.home_navStatus);
	$("#nav_server").text(lang.home_navServer);
	$("#nav_log").text(lang.home_navLog);
	///$("#nav_adAndNews").text(lang.home_navAdAndNews);
	$("#btnSearchDevice").text(lang.searchDevice);
	$("#btnSearchClient").text(lang.searchClient);
	
	setInputFocusBuleTip("#devicesearch", lang.home_searchDevice);
	setInputFocusBuleTip("#clientsearch", lang.home_searchClient);
	
	showTitle();
}

function showTitle() {
	if (langIsChinese()) {
		if (chineseSystemTitle != null)  {
			document.title = chineseSystemTitle;
			$("#mainTitle").text(chineseSystemTitle);
		}
	} else if (langIsTW()) {
		if (twSystemTitle != null)  {
			document.title = twSystemTitle;
			$("#mainTitle").text(twSystemTitle);
		}
	} else {
		if (englishSystemTitle != null)  {
			document.title = englishSystemTitle;
			$("#mainTitle").text(englishSystemTitle);
		}
	}
}

function ajaxLoadInformation() {
	//向服务器发送ajax请求
	$.myajax.jsonGet("LoginAction_information.action", function(json,action,success){
		if (success) {
			chineseSystemTitle = json.ChineseSystemTitle;
			englishSystemTitle = json.EnglishSystemTitle;
			twSystemTitle = json.TwSystemTitle;
			isAds = json.enableAdvertising;
			if (langIsChinese()) {
				$("#spanCopyright").html(json.ChineseCopyright);
			} else if (langIsTW()) {
				$("#spanCopyright").html(json.TwCopyright);
			} else {
				$("#spanCopyright").html(json.EnglishCopyright);
			}
			
			showTitle();
			
			if(isAds != null && isAds == 1) {
				$('.buttonbg').append('<li><a href="javascript:" name="topMenuItem" onclick="javascript:switchPage(\'adAndNews\', \'adAndNews.html\')"><span id="nav_adAndNews">'+lang.home_navAdAndNews+'</span></a></li>');
			}
		}
	}, null);
}

function switchPage(page, url){
	indexPage = page;
	var allpages = ["home","client","device","online","server","log","adAndNews"];
	var allnodes = document.getElementsByName('topMenuItem');
	for(var i=0; i<allpages.length; i++){
		if(page == allpages[i]){
			allnodes[i].className = "befor";
			setTimeout(function () {
				var iframe = document.getElementById("mainFrame");
				iframe.setAttribute("src", url);
             }, 1);
		}else{
			allnodes[i].className = "";
		}
	}
}

function localUrl(url) {
	setTimeout(function () {
		var iframe = document.getElementById("mainFrame");
		iframe.setAttribute("src", url);
	}, 1);
}

//移动窗体位置
//重置页面，IE 6-7隐藏头部会导致clientHeight的值变小，所以需要补上
function resizeFrame(){
	var mainframe = document.getElementById("mainFrame");
	setTimeout(function () {
		dynIframeHeight(mainframe);
	}, 100);
} 

//加载用户账号和角色信息
function loadSysUserAndRole()  {
	$("#username").text(GetCookie("SysAccount"));
	var role = GetCookie("SysRole");
	if (role == "1") {
		$("#role").text(lang.home_roleAdmin);	
	} else {
		$("#role").text(lang.home_roleUser);
	}
}

//退出
function exitSystem(){
	//发送退出登录的请求
	$.myajax.showLoading(true, parent.lang.home_exitTip);
	$.myajax.jsonGet("SysLoginAction_logout.action", function(json,action,success){
		$.myajax.showLoading(false);
		//将用户账号配置为过期
		SetCookieExpire("SysAccount");
		//重定向到登录界面
		window.location = "../login.html";
	}, null);	
}

function changePassword() {
	$.dialog({id:'password', title:parent.lang.home_changePassword,content:'url:password.html'
		, min:false, max:false, lock:true});
}

function doPasswordSuc() {
	$.dialog({id:'password'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

function changeAccount() {
	$.dialog({id:'account', title:parent.lang.home_changeAccount,content:'url:account.html'
		, min:false, max:false, lock:true});
}

function doAccountSuc() {
	$.dialog({id:'account'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

function queryDeviceInfo() {
	var name = $.trim($("#devicesearch").val());
	if (name == lang.home_searchDevice) {
		name = "";
	}
	if (indexPage == "online") {
		switchPage("online", "status.html?name=" + encodeURIComponent(name));
	} else {
		switchPage("device", "device.html?name=" + encodeURIComponent(name));
	}
	
}

function queryClientInfo() {
	var name = $.trim($("#clientsearch").val());
	if (name == lang.home_searchClient) {
		name = "";
	}
	switchPage("client", "client.html?name=" + encodeURIComponent(name));
}
