$(document).ready(function(){
//	if ($.browser.msie) {
//		document.body.onresize = resizeFrame;
//		document.body.onload = resizeFrame;
//	} else {
//		$(window).resize(resizeFrame);
//		$(window).load(resizeFrame);
//	}
	$("#frameMonitor").attr("src", "");
	$("#frameTrack").attr("src", "");
	$("#frameReportNav").attr("src", "");
	$("#frameReportCont").attr("src", "");
	//初始化语言
	langInitByUrl();
	loadReadyPage();
});

function loadReadyPage() {
	if (typeof lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadIndexPage();
	}
}

function loadIndexPage() {
	var session = getUrlParameter("userSession");
	if (session != "") {
		setTimeout(directLogin, 100);
	} else {
		loadPage();
	}
}

function loadPage(){
	//加载语言 
	loadLang();
	//加载用户和角色信息
	loadUserAndRole();
	//初始化菜单栏
	loadMainMenu();
	//加载用户车辆列表信息
	loadUserVehicle();
	//加载标题
	ajaxLoadInformation();
}

var isLoadVehiList = false;	//是否已经加载车辆列表
var vehicleList = null;	//车辆链表
var vehiGroupList = null;	//车辆分组链表
var currentPage = "";	//当前界面
var isLoadTrackFrame = false;	//是否已经加载完成轨迹回放的界面
var isLoadMonitorFrame = false;	//是否已经加载完成实时监控的界面
var isInitMonitorFrame = false;	//是否已经初始化成功实时监控界面
var resizeCount = 0;	//重新配置窗体大小的次数
var englishMainTitle = null;	//中文标题
var chineseMainTitle = null;	//英文标题
var twMainTitle = null;
var showLocation = null;
var editMileage = null;

function loadLang(){
//	document.title = lang.title;
//	$("#mainTitle").text(lang.index_title);
	$("#welcome").text(lang.index_welcome);
	$("#config").text(lang.index_changePassword);
	$("#exit").text(lang.index_exit);
//	$("#spanLoadTrack").text(lang.loading);
//	$("#spanLoadMonitor").text(lang.loading);
	showTitle();
}

function showTitle() {
	if (langIsChinese()) {
		if (chineseMainTitle != null)  {
			document.title = chineseMainTitle;
			$("#mainTitle").text(chineseMainTitle);
		}
	} else if (langIsTW()) {
		if (twMainTitle != null)  {
			document.title = twMainTitle;
			$("#mainTitle").text(twMainTitle);
		}
	} else {
		if (englishMainTitle != null)  {
			document.title = englishMainTitle;
			$("#mainTitle").text(englishMainTitle);
		}
	}
}

//加载用户账号和角色信息
function loadUserAndRole()  {
	$("#username").text(GetCookie("Name"));
	var isAdmin = GetCookie("IsAdmin");
	showLocation = GetCookie("ShowLocation");
	editMileage = GetCookie("EditMileage");
	if (parseInt(isAdmin) == 1) {
		$("#role").text(lang.index_roleAdmin);	
	} else {
		$("#role").text(lang.index_roleUser);
	}
}

function ajaxLoadInformation() {
	//向服务器发送ajax请求
	$.myajax.jsonGet("LoginAction_information.action", function(json,action,success){
		if (success) {
			chineseMainTitle = json.ChineseMainTitle;
			englishMainTitle = json.EnglishMainTitle;
			twMainTitle = json.TwMainTitle;
			showTitle();
		}
	}, null);
}

//加载主菜单信息
function loadMainMenu() {
	$.myajax.showLoading(true, parent.lang.loading);
	$.myajax.jsonGet("PriviAction_query.action", function(json,action,success){
		$.myajax.showLoading(false);
		if (success) {
			for (var i = 0; i < json.privis.length; i += 1) {
				var page = json.privis[i];
				//page, pageNav, pageUrl
				var str = "<li><a id=\"" + page + "\" href=\"javascript:switchPage('" + page + "');\" class=\"befor\" name=\"topMenuItem\" >";
				str += (getMenuName(page) + "</a></li>");
				$("#mainMenu").append(str);
			}
			//加载第一个页面的url信息
			if (json.privis.length > 0) {
				switchPage(json.privis[0]);
			}
		}
	}, null);
}

//获取菜单名称
function getMenuName(menu) {
//	$("#nav_monitor").text(lang.index_navMonitor);
//	$("#nav_track").text(lang.index_navTrack);
//	$("#nav_report").text(lang.index_navReport);
//	$("#nav_vehicle").text(lang.index_navVehicle);
//	$("#nav_user").text(lang.index_navUser);
	var str;
	if (menu == "monitor") {
		str = lang.index_navMonitor;
	} else if (menu == "track") {
		str = lang.index_navTrack;
	} else if (menu == "report") {
		str = lang.index_navReport;
	} else if (menu == "vehicle") {
		str = lang.index_navVehicle;
	} else if (menu == "user") {
		str = lang.index_navUser;
	}
	return str;
}

function localReportUrl(url) {
	setTimeout(function () {
		var iframe = document.getElementById("frameReportCont");
		iframe.setAttribute("src", url);
	}, 1);
}

function resizeFrame() {
//	setTimeout(function () {
		if (isBrowseIE()) {
			window.onresize = null;
		}
		var topBtn = document.getElementById("topbutton");
		var topNav = document.getElementById("nav");
		var pagesize = getPageSize();
		var h = pagesize.WinH;
		if (isBrowseIE6() || isBrowseIE7()) {
			h = window.document.body.clientHeight;
			var Height_Page_Using = document.documentElement.clientHeight; 
			if (h > Height_Page_Using) {
				h = Height_Page_Using;
			}
		}
		 
		h = h - topBtn.clientHeight - topNav.clientHeight - 20;
		if (h < 500) {
			h = 500;
		}
		
		var clientWidth = $("#main").width();
		$("#monitorPage").height(h);
		$("#frameMonitor").width(clientWidth);
		$("#trackPage").height(h);
		if (isBrowseIE6() || isBrowseIE7()) {
			if ($("#trackPage").width() >  window.document.body.clientWidth) {
				$("#trackPage").width(window.document.body.clientWidth);
			}
		}
		$("#frameTrack").width(clientWidth);
		$("#reportPage").height(h);
		$("#reportNav").height(h);
		$("#reportCont").height(h);
		resizeCount += 1;
		if (isBrowseIE()) {
			setTimeout(function () {
				window.onresize = resizeFrame;
			}, 0);
		}
//	}, 200);
}

function switchPage(page) {
	var allnodes = document.getElementsByName('topMenuItem');
	for(var i=0; i<allnodes.length; i++){
		if(page == allnodes[i].id){
			allnodes[i].className = "befor";
		}else{
			allnodes[i].className = "";
		}
	}
	currentPage = page;
	if (page == "monitor") {
		setTimeout(function() {
			if (!isLoadMonitorFrame) {
				isLoadMonitorFrame = true;
				$("#frameMonitor").attr("src", "monitor/monitor.html");
				var frameMonitor = document.getElementById("frameMonitor");
				if (frameMonitor !== null) {
					if (frameMonitor.attachEvent){
				    	frameMonitor.attachEvent("onload", showFrameMonitor);
					} else {
					    frameMonitor.onload = showFrameMonitor;
					}
				}
			}
		}, 100);
		$("#monitorPage").show();
		$("#trackPage").hide();
		$("#reportPage").hide();
	} else if (page == "track") {
		setTimeout(function() {
			if (!isLoadTrackFrame) {
				isLoadTrackFrame = true;
				$("#frameTrack").attr("src", "track/track.html");
				var frameTrack = document.getElementById("frameTrack");
				if (frameTrack !== null) {
					if (frameTrack.attachEvent){
				    	frameTrack.attachEvent("onload", showFrameTrack);
					} else {
					    frameTrack.onload = showFrameTrack;
					}
				}
			}
		}, 100);
		$("#trackPage").show();
		$("#monitorPage").hide();
		$("#reportPage").hide();
	} else {
		$("#monitorPage").hide();
		$("#trackPage").hide();
		$("#reportPage").show();
		var navUrl = "report_nav.html?page=" + page;
		$("#frameReportNav").attr("src", navUrl);
		$("#frameReportCont").attr("src", "");
	}
}

function showFrameTrack(){
	if (resizeCount >= 1) {
		$("#trackLoad").hide();
		$("#frameTrack").show();
	} else {
		setTimeout(showFrameTrack, 1000);
	}
} 

function showFrameMonitor(){
	var initSuc = false;
	if (isBrowseIE()) {
		if (resizeCount >= 1) {
			initSuc = true;
		}
	} else {
		initSuc = isInitMonitorFrame;
	}
	if (initSuc) {
		$("#monitorLoad").hide();
		$("#frameMonitor").show();
	} else {
		setTimeout(showFrameMonitor, 1000);
	}
} 

//退出
function exitSystem(){
	//发送退出登录的请求
	$.myajax.showLoading(true, parent.lang.home_exitTip);
	$.myajax.jsonGet("LoginAction_logout.action", function(json,action,success){
		$.myajax.showLoading(false);
		//重定向到登录界面
		window.location = "login.html";
	}, null);
	//避免发送请求时间过长
	setTimeout(function () {
		//重定向到登录界面
		window.location = "login.html";
	}, 2000);
}

function loadUserVehicle() {
	$.myajax.jsonGet("PriviAction_vehicleEx.action", function(json,action,success){
		if (success) {
			vehicleList = json.vehicles;
			vehiGroupList = json.groups;
		}
		isLoadVehiList = true;
	}, null);
}

function directLogin() {
	var session = getUrlParameter("userSession");
	if (session != "") {
		var action = "LoginAction_sessionLogin.action?userSession=" + session;
		var ctype = getUrlParameter("ctype");
		if(ctype != null && ctype != '') {
			action += "&ctype="+ ctype;
		}
		doLogin(action, false, "", "", "");
	}
}

function doLogin(action, sysLogin, userAccount, password, verificationCode) {
	isLogining = true;
	var logintipdlg = $.dialog({id:'logintip',title:false,content:lang.login_logining});
	$.ajax({
		url:action,
		data:{userAccount:decodeURI(userAccount),password:password,language:langCurLocal(),verificationCode:verificationCode},
		cache:false,/*禁用浏览器缓存*/
		dataType:"json",
		success:function(json){
			isLogining = false;
			if(json){
				var flag = json.result;
				if(flag!=null){
					if(flag == 0){
						if (sysLogin) {
							SetCookie("SysAccount", json.Account);
							SetCookie("SysRole", json.Role);
							window.location = "system/index.html?lang="+langCurLocal();
						} else {
							SetCookie("Account", json.account);
							SetCookie("Name", json.name);
							SetCookie("IsAdmin", json.isAdmin);
							SetCookie("ShowLocation", json.showLocation);
							SetCookie("EditMileage", json.editMileage);
							if(json.pwdStatus){
								window.location = "index.html?lang="+langCurLocal();
							}else{
								$.dialog({id:'addtype', title:parent.lang.usermgr_user_editPwd,content:'url:password.html?id='+json.useid
									, min:false, max:false, lock:true});
							}
						}
					} else if (flag == 1) {
						alert(lang.errLogin_UserNoExist);
						$("#userAccount").focus();	
					} else if(flag == 2){
						alert(lang.errLogin_PasswordError);	
						$("#password").focus();	
					} else if(flag == 3){
						alert(lang.errLogin_Expired);
						$("#userAccount").focus();
					} else if(flag == 4){
						alert(lang.errLogin_Verify);
						$("#verificationCode").focus();
					} else if(flag == 5){
						alert(lang.errException);
					} else if(flag == 7){
						alert(lang.errLogin_Session);
						$("#userAccount").focus();
					} else {
						alert(lang.errUnkown);
					}
					if(flag != 0){
						changeValidateCode();
					}
				}else{
					alert(lang.errUnkown);
				}				
			}	
			logintipdlg.close();
		},error:function(XMLHttpRequest, textStatus, errorThrown){
			isLogining = false;
			alert(lang.errSendRequired);
			logintipdlg.close();
			disableForm(false);
		}
	});
}