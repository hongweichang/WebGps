var userId = null;  //用户id
var account = null;  //用户名
var companyId = null;  //用户所在公司id
var myUserRole = null; //用户权限类
var screenWidth = null;
var screenHeight = null;
var mainHeight = null;
var longbtime = null;
var longetime = null;
var daybtime = null;
var dayetime = null;
var monthbtime = null;
var monthetime = null;

var pageclik = getUrlParameter("pageclik");
var toMap = 2;  		//	1 GOOGLE  2 BAIDU
var mapType = 0;		//0 GOOGLE	1 MAPINFO, 2 HTTPS GOOGLE, 3 BAIDU
var DEF_MAP_TYPE = "MapType";
var DEF_PAGE_MONITOR = "PageMonitor";//监控界面是地图或者视频或者线路监控
var weizhiPage = null; //位置页面
var guijiPage = null;  //轨迹页面
var luxiangPage = null; //录像回放页面
var otherPage = null;  //其他页面
var indexStyle = null; //样式

$(document).ready(function(){
	langInitByUrl();
	
	mapType = $.cookie(DEF_MAP_TYPE); 
	if (mapType == null) {
		if (langIsChinese()) {
			mapType = 3;
		} else {
			mapType = 0;
		}
	} else {
		mapType = parseInt(mapType);
	}
	if (mapType == 0) {
		toMap = 1;	//
	} else {
		toMap = 2;
	}
	
	loadReadyPage();
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		//初始化样式
		indexStyle = new pageStyle();
		indexStyle.initIndexItemStyle();
		loadIndexPage();
	}
}

function getMapType() {
	return mapType;
}

function saveMapType(type) {
	mapType = type;
	if(type == 0) {
		toMap = 1;
	}else if(type == 3){
		toMap = 2;
	}
	$.cookie(DEF_MAP_TYPE, mapType, { expires: 365 }); 
}

function loadIndexPage() {
	var session = getUrlParameter("userSession");
	if (session != "") {
//		ajaxLoadInformation();
		setTimeout(directLogin, 100);
	} else {
		loadPage();
	//	ajaxLoadInformation();
		if(getUrlParameter("clientLogin") == 1) {
			setTimeout(ajaxLoadInformation, 100000);
		}
	}
}

/**
 * 页面是否已加载
 * @param name
 * @returns {Boolean}
 */
function isLoaded(name){
	var cookiePageclik = GetCookie('pagecliks');
	if(cookiePageclik.indexOf(name) == -1){
		return false;
	}
	return true;
}

/**
 * 加载页面，并加入cookie
 * @param name
 */
function setWindowCookie(name) {
	var cookiePageclik = GetCookie('pagecliks');
	cookiePageclik += ','+name;
	SetCookie("pagecliks", cookiePageclik);
	$('body').attr('onunload',"closeWindow('"+name+"')");
}

/**
 * 关闭页面时更新cookie
 * @param name
 */
function closeWindow(name) {
	var cookiePageclik = GetCookie('pagecliks');
	cookiePageclik = cookiePageclik.replace(','+name,'');
	SetCookie("pagecliks", cookiePageclik);
}

function getPageWin(name) {
	var ret = null;
	if (name == 'weizhi' || name == 'shipin' || name == 'xianlu') {
		ret = weizhiPage;
	} else if (name == 'guiji') {
		ret = guijiPage;
	} else if (name == 'luxiang') {
		ret = luxiangPage;
	} else {
		ret = otherPage;
	}
	return ret;
}

function getPageName(name) {
	var ret = null;
	var lstName = name.split(',');
	for (var i = 0; i < lstName.length; ++ i) {
		if (lstName[i] == 'weizhi' || lstName[i] == 'shipin' || lstName[i] == 'xianlu') {
			ret = "weizhi";
			break;
		} else if (lstName[i] == 'guiji') {
			ret = "guiji";
			break;
		} else if (name == 'luxiang') {
			ret = "luxiang";
		} else {
			ret = "other";
			break;
		}
	}

	return ret;
}

/*
 * 打开界面
 * direct如果不存在，是否直接打开
 * 返回已经打开的窗口对象
 */
function openMyPage(name, direct, target) {
	//直接打开，暂时不处理
	return window.open(target);
	
	var winName = getPageName(name);
	//firefox 不支持focus，因此直接打开链接
//	if ($.browser.mozilla && direct) {
//		return window.open(target);
//	}
	
//	var lstName = name.split(',');
//	var hasLoad = false;
//	var pageName = '';
//	for (var i = 0; i < lstName.length; ++ i) {
//		if (lstName[i] != "" && isLoaded(lstName[i])) {
//			hasLoad = true;
//			pageName = lstName[i];
//			break;
//		}
//	}
	
	var ret = null;
	var reOpen = true;
	if (true) {
		var page = getPageWin(winName);
		
		if (page != null && !page.closed) {
			try {
				window.blur();
				setTimeout(function() {
					page.focus();
				}, 10);
				reOpen = false;
				ret = page;
			} catch(e1){
			}
		}
		//可能父窗口打开过，父窗口会再调用次窗口的接口
		if (reOpen) {
			if (window.opener != null) {
				if (typeof window.opener.pageclik != "undefined") {
					if (getPageName(window.opener.pageclik) == winName) {
						ret = window.opener;
						window.blur();
						setTimeout(function() {	
							ret.focus();
						}, 10);
						reOpen = false;
					}
				}
				if (reOpen && typeof window.opener.openMyPage == "function") {
					try {
						ret = window.opener.openMyPage(name, false, target);
						if (ret != null) {
							reOpen = false;
						}
					} catch(e1){
					}
				} 
			}
		}
	}
	
	if (reOpen && direct) {
		ret = window.open(target, winName);
	}
	//返回是否打开已经存在的窗口
	return ret;
}

function loadPage(){
	$.myajax.jsonGet('StandardLoginAction_getNavPage.action?clientLogin='+getUrlParameter("clientLogin"), function(json,action,success){
		if(success) {
			userId = GetCookie('userId');
			account = GetCookie('account');
			companyId = GetCookie('companyId');
			loadLang();
			//初始化权限处理类
			myUserRole = new userRole();
			myUserRole.setPrivileges(GetCookie('privilege'));
			myUserRole.setIsAdmin(GetCookie('isAdmin'));
			myUserRole.setIsMaster(GetCookie('isMaster'));
			myUserRole.setIsFirstCompany(GetCookie('isFirstCompany'));
			myUserRole.setIsSecondCompany(GetCookie('isSecondCompany'));
			myUserRole.setIsThreeCompany(GetCookie('isThreeCompany'));
			myUserRole.setHasAddArea(GetCookie('hasAddArea'));
			myUserRole.setHasLine(GetCookie('hasLine'));
			myUserRole.setHasRoadRule(GetCookie('hasRoadRule'));
			myUserRole.setIsAllowManage(GetCookie('isAllowManage'));
			myUserRole.setIsManageLine(GetCookie('isManageLine'));
			var content = "";
			var mod = [];
			$.each(json.pages,function(i, page){
				if(i == 0 && pageclik == '') {
//					controlMonitorPage('xianlu');
					//pageclik = '' 表示从首页登录进来
					if (json.pages.length >= 2) {
						//如果即有地图又有视频界面，则看最后一个保存的界面
						if (json.pages[1].name == 'shipin') {
							var temppage = $.cookie(DEF_PAGE_MONITOR);
							if (temppage != null) {
								if(!myUserRole.isManageLine() && temppage == 'xianlu') {
									pageclik = "weizhi";
								}else {
									pageclik = temppage;
								}
							}
						}
					}
					if (pageclik == '') {
						pageclik = page.name;
					}
				}
				var title = getPageDisplay(page.privi);
				var pclass = "";
				if(page.name == pageclik) {
					pclass = "current";
					document.title = title;
					if(GetCookie('maintitle')) {
						document.title += '-' + GetCookie('maintitle');
					}
					if(page.name == 'weizhi' || page.name == 'shipin' || page.name == 'xianlu') {
						if(pageclik == 'weizhi' || pageclik == 'shipin' || pageclik == 'xianlu') {
							controlMonitorPage(page.name);
						}
					}
					setWindowCookie(page.name);
				}
				var display = title;
				if(title.length > 10) {
					display = title.substring(0,10)+'...';
				}
				mod.push({
					display: display,
					title: title,
					name: page.name,
					pclass: pclass,
					preicon : true
				});
				
				if( (pageclik == 'guiji' && page.name == 'guiji') 
						|| (pageclik == 'weizhi' && page.name == 'weizhi') 
						|| (pageclik == 'shipin' && page.name == 'shipin')
						|| (pageclik == 'xianlu' && page.name == 'xianlu')
						|| (pageclik == 'luxiang' && page.name == 'luxiang')) {
					content += getMainPane(page.name,page.url,pclass);
				}else if(pageclik != 'guiji' && page.name != 'guiji' 
					&& pageclik != 'weizhi' && page.name != 'weizhi'
						&& pageclik != 'shipin' && page.name != 'shipin'
							&& pageclik != 'xianlu' && page.name != 'xianlu'
								&& pageclik != 'luxiang' && page.name != 'luxiang') {
					content += getMainPane(page.name,page.url,pclass);
				}
			});
			$('#rightTabs').flexPanel({
				TabsModel : mod
			});
			//添加页面
			$('#mainPanel-all').append(content);
			//设置页面大小
			setPanelWidth();
			
			$('#rightTabs li').each(function(i){
				var name = $(this).attr('data-tab');
				var target = "index.html?lang="+langCurLocal() + "&pageclik="+name;
				$(this).on('click',function(){
					if(name == 'guiji' || name == 'weizhi' || name == 'shipin' || name == 'xianlu' || name == 'luxiang') {
						if(name == 'weizhi' || name == 'shipin' || name == 'xianlu') {
							if(pageclik == 'weizhi' || pageclik == 'shipin' || pageclik == 'xianlu') {
								var flag = $(this).hasClass('current');
								if(!flag) {
									$(this).addClass('current').siblings().removeClass("current");
									$('#mainPanel-all .mainPanel').show();
									document.title = $(this).find('.text').html();
									if(GetCookie('maintitle')) {
										document.title += '-' + GetCookie('maintitle');
									}
									controlMonitorPage(name);
								}
							}else {
								weizhiPage = openMyPage('weizhi,shipin,xianlu', true, target);
							}
						}else if(name == 'guiji') {
							if(pageclik != 'guiji') {
								guijiPage = openMyPage('guiji', true, target);
							}else {
								$(this).addClass('current').siblings().removeClass("current");
								$('#mainPanel-all #mainPanel-'+name).addClass('current').siblings().removeClass("current");
								document.title = $(this).find('.text').html();
								if(GetCookie('maintitle')) {
									document.title += '-' + GetCookie('maintitle');
								}
							}
						}else if(name == 'luxiang') {
							if(pageclik != 'luxiang') {
								luxiangPage = openMyPage('luxiang', true, target);
							}else {
								$(this).addClass('current').siblings().removeClass("current");
								$('#mainPanel-all #mainPanel-'+name).addClass('current').siblings().removeClass("current");
								document.title = $(this).find('.text').html();
								if(GetCookie('maintitle')) {
									document.title += '-' + GetCookie('maintitle');
								}
							}
						}
					}else if(name == 'denglu'){
						window.open("http://yaozw.gicp.net:8001/index_jqsd.asp");//location.href = "http://yaozw.gicp.net:8001/index_jqsd.asp";
					}else {
						if(pageclik == 'guiji' || pageclik == 'weizhi' || pageclik == 'shipin' || pageclik == 'xianlu' || pageclik == 'luxiang') {
							otherPage = openMyPage('tongji,yunying,guize,server', true, target);
						}else {
							$(this).addClass('current').siblings().removeClass("current");
							$('#mainPanel-all #mainPanel-'+name).addClass('current').siblings().removeClass("current");
							document.title = $(this).find('.text').html();
							if(GetCookie('maintitle')) {
								document.title += '-' + GetCookie('maintitle');
							}
						}
					}
				});
				/*if(name == pageclik) {
					$('#tab-'+name+'').click();
					setWindowCookie(name);
				}*/
			});
			if(pageclik == 'guiji' || pageclik == 'weizhi' || pageclik == 'shipin' || pageclik == 'xianlu' || pageclik == 'luxiang') {
				//获取授权车辆等信息
				getUserVehicles();
				//获取区域信息
				getListMarker();
			}else {
				//获取公司信息
				getParentCompanyTeams();
				getMapmarkers();
				//获取授权车辆信息
				getParentVehiList();
				//每隔5分钟刷新公司信息和授权车辆信息，如果有改变
				flashCompanyTeamsAndVehicleTimer();
				//获取司机信息
				getParentDrivers();
			}
		};
	}, null);
	
	var ctype = getUrlParameter("ctype");
	if(ctype != 1) {
		$('.login-mess').show();
	}
	
	var buttons = [];
	var but = [];
	but.push({
		display: parent.lang.close, 
		name : '', 
		pclass : 'close',
		bgcolor : 'gray', 
		hide : false
	});
	buttons.push(but);
	$('#toolbar-btn').flexPanel({
		ButtonsModel : buttons 
	});
	$('#browserTip').text(parent.lang.browser_tip);
	/*$('#browser').width(window.screen.availWidth);
	$('#browserTip').width(window.screen.availWidth-200);*/
	$('#toolbar-btn').width(100);
	$(".login-mess .down").click(function(){
		$(".quick-menu").slideDown(300);
		$(".quick-menu").mouseleave(function(){
			$(this).hide();
		});
	});
	$('.close','#toolbar-btn').on('click',function(){
		$('#browser').hide();
	});
	//修改密码
	$('.login-mess .password').on('click',function() {
		$.dialog({id:'setPwd', title:parent.lang.modify_password,content: 'url:OperationManagement/user_password.html?id='+userId,
			min:false, max:false, lock:true});
		$('.quick-menu').hide();
	});
	
	//退出操作
	$('#login-out').on('click',function(){
		if(!confirm(lang.isExit)) {
			return;
		}
		//发送退出登录的请求
		$.myajax.showLoading(true, lang.home_exitTip);
		$.myajax.jsonGet("StandardLoginAction_logout.action", function(json,action,success){
			$.myajax.showLoading(false);
			//重定向到登录界面
			window.location = "login.html";
			SetCookie("pagecliks", '');
		}, null);
		//避免发送请求时间过长
		setTimeout(function () {
			//重定向到登录界面
			window.location = "login.html";
		}, 2000);
	});
	
	//禁止系统右键
	disableSysRight('body',true);
};

//切换主菜单界面
function switchTopMenuPage(name) {
	if(name != null && name != '') {
		$('#tab-'+name).click();
	}
}

var monitorName = "";
function controlMonitorPage(name) {
	$.cookie(DEF_PAGE_MONITOR, name, { expires: 365 });
	monitorName = name;
	switchMonitorPage();
}

function switchMonitorPage() {
	var obj = document.getElementById('all-weizhi');
	if (obj == null) {
		obj = document.getElementById('all-shipin');
		if (obj == null) {
			obj = document.getElementById('all-xianlu');
		}
	}
	
	if (obj == null	|| typeof obj.contentWindow.showMonitorPage != "function") {
		setTimeout(switchMonitorPage, 50);
	} else {
		obj.contentWindow.showMonitorPage(monitorName);
	}
}

function loadLang() {
	$('#main .mainTitle').attr('title',lang.title);
	$('#main .mainTitle img').attr('alt',lang.title);
//	$('#main .mainTitle').append(lang.title);
	document.title = lang.operations_management;
	if(GetCookie('maintitle')) {
		document.title += '-' + GetCookie('maintitle');
	}
	if(account.length > 6) {
		$('.login-mess .account').text(account.substring(0,6)+'...');
	}else {
		$('.login-mess .account').text(account);
	}
	$('.login-mess .account').attr('title',account);
	$('.login-mess .login-out').attr('title',lang.logout);
	
	if(indexStyle.styleId == 2 || indexStyle.styleId == 3) {
		$('.login-mess .login-out span').text(lang.logout);
	}
	if(lang.modify_password.length > 6) {
		$('.login-mess .password').text(lang.modify_password.substring(0,6)+'...');
	}else {
		$('.login-mess .password').text(lang.modify_password);
	}
	$('.login-mess .password').attr('title',lang.modify_password);
	if(GetCookie('maintitle')) {
		$('#spanTitle').text(GetCookie('maintitle'));
		$('#spanTitle').attr('title',GetCookie('maintitle'));
	}
}

function doPasswordSuc() {
	$.dialog({id:'setPwd'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

/**
 * 获取页面名称
 */
function getPageDisplay(key) {
	var name = '';
	switch (key) {
	case 1:
		name = lang.location_positioning;
		break;
	case 2:
		name = lang.statistical_reports;
		break;
	case 3:
		name = lang.operations_management;
		break;
	case 4:
		name = lang.Internal_management;
		break;
	case 5:
		name = lang.rules_management;
		break;
	case 6:
		name = lang.Server_management;
		break;
	case 7:
		name = lang.track_management;
		break;
	case 8:
		name = lang.real_time_video;
		break;
	case 9:
		name = lang.video_query;
		break;
	case 10:
		name = '基础信息管理';
		break;
	case 11:
		name = parent.lang.monitor_lineMonitor;
		break;
	/*case 10:
		name = lang.real_time_video;
		break;*/
	}
	return name;
}

/**
 *	获取对应页面
 */
function getMainPane(name,url,pclass) {
	var content = '';
	content += '<div id="mainPanel-'+name+'" class="mainPanel '+ pclass +'">';
	/*if(name == 'guiji' || name == 'weizhi' || name == 'shipin' || name == 'shouye') {
		if(name == 'shipin' || name == 'weizhi') {
			url += ".html";
		} else if (name == 'shouye'){
			url = url;
		} else {
			url += ".html";
		}*/
	if(name == 'guiji' || name == 'weizhi' || name == 'shipin' || name == 'xianlu' || name == 'luxiang') {
		url += ".html";
		content += 	'<iframe id="all-'+name+'" width="100%" height="100%" frameborder="0" src="'+url+'"></iframe>';
	}else {
		content += 	'<div id="leftPanel">';
		content += 	'<iframe id="left-'+name+'" width="100%" height="100%" frameborder="0" src="'+url+'"></iframe>';
		content += 	'</div>';
		content += 	'<div id="rightPanel">';
		if(name == 'guize') {
			content += 	'<iframe id="right-'+name+'" width="100%" height="100%" frameborder="0" src="RulesManagement/RuleMaintain.html"></iframe>';
		}else if(name == 'server') {
			content += 	'<iframe id="right-'+name+'" width="100%" height="100%" frameborder="0" src="ServerManagement/AllServer.html?"></iframe>';
		}else if(name == 'tongji' || name == 'yunying') {
//			content += 	'<div id="'+ name +'Top" class="paneTop">标签页</div>';
//			content += 	'<iframe id="right-'+name+'" width="100%" height="100%" frameborder="0" src=""></iframe>';
		}else {
			content += 	'<iframe id="right-'+name+'" width="100%" height="100%" frameborder="0" src=""></iframe>';
		}
		content += 	'</div>';
	}
	content +=  '</div>';
	return content;
}

/**
 *设置页面大小
 */
 function setPanelWidth() {
	screenWidth =  window.screen.availWidth; //$(window).width();//
	screenHeight =  $(window).height();// window.screen.availHeight;
	//不能少于1024
	if(screenWidth < 1024) {
		screenWidth = 1024;
	}
	var indexHeight = screenHeight;
//	if($('#main-topPanel').is(":visible") == true) {
	if($('#main-topPanel').hasClass('show')) {
		indexHeight = indexHeight - $('#main-topPanel').height();
	}
	var indexWidth = screenWidth;
	mainHeight = screenWidth - 100;
	
	$('#main-topPanel').css('min-width',screenWidth - 20 +'px');
	$('#mainPanel-all').css('width',screenWidth +'px');
	$('#mainPanel-all .mainPanel').each(function(){
		$(this).css('height',indexHeight - 5 +'px');
		$(this).find('#leftPanel').css('width','250px');
		$(this).find('#rightPanel').css('width', screenWidth - 255 +'px');
	});
	//修改样式
	if(indexStyle) {
		indexStyle.setIndexItemWidth();
	}
 }

var vehicleManager = new VehicleManager(); //车辆管理类
var vehicleList = null;	//车辆链表
var vehiGroupList = null;	//车辆车队链表
var vehiLineList = null;	//所有线路
var vehiOilList = new Array();
var vehiOBDList = new Array();
var vehiPeopleList = new Array();
var vehiTpmsList = new Array();
var vehiTempList = new Array();
var companys = null; //公司链表
var driverList = new Array();
var mapMarker = new Array();
var isLoadVehiGroupList = false; // 是否已经加载车队链表
var isLoadCompanyList = false; //是否已经加载公司链表
var isLoadDriverList = false; //是否已经加载司机链表
var isLoadVehiList = false;	//是否已经加载车辆列表
var alarmClass = null;	//车辆报警监听类,子页面传递过来
var isChangedVehiGroup = false; //是否改变了公司车队信息
var isChangedVehicle = false; //是否改变了授权车辆信息
var isLoadMapMarkerList = false; //是否加载区域信息
var flashCompanyTeamsAndVehicleTime = 10000; //刷新信息时间间隔

//每隔10分钟刷新公司信息和授权车辆信息，如果有改变
function flashCompanyTeamsAndVehicleTimer() {
	setTimeout(flashCompanyTeamsAndVehicle, flashCompanyTeamsAndVehicleTime);
}

function flashCompanyTeamsAndVehicle() {
	//如果公司信息有改变
	if(isChangedVehiGroup) {
		getParentCompanyTeams();
		isChangedVehiGroup = false;
	}
	//如果授权车辆信息有改变
	if(isChangedVehicle) {
		getParentVehiList();
		isChangedVehicle = false;
	}
	flashCompanyTeamsAndVehicleTimer();
}

/**
 * 获得账号下可选公司和车队  报表等页面
 */
function getParentCompanyTeams() {
	$.myajax.jsonGet('StandardLoginAction_loadCompanyList.action', function(json,action,success){
		if(success) {
			vehiGroupList = json.companys;
			companys = [];
			vehiLineList = [];
			for(var i = 0; i < vehiGroupList.length; i++) {
				if(vehiGroupList[i].level == 1) {
					companys.push(vehiGroupList[i]);
				}else if(vehiGroupList[i].level == 3){
					vehiLineList.push(vehiGroupList[i]);
				}
			}
			isLoadVehiGroupList = true;
		};
	}, null);
}

function getMapmarkers() {
	$.myajax.jsonGet('StandardLoginAction_markerLists.action', function(json,action,success){
		if(success) {
			mapMarker = json.markers;
			isLoadMapMarkerList = true;
		};
	}, null);
}

/**
 * 获取公司下司机信息
 */
function getParentDrivers(){
	$.myajax.jsonGet('StandardLoginAction_loadDriverList.action?type=0', function(json,action,success){
		if(success) {
			driverList = json.infos;
			isLoadDriverList = true;
		};
	}, null);
}

/**
 * 获取已授权车辆，报表等页面
 */
function getParentVehiList() {
	$.myajax.jsonGet('StandardLoginAction_loadUserVehicleList.action', function(json,action,success){
		if(success) {
			vehicleList = json.vehicles;
			for (var i = 0; i < vehicleList.length; i++) {
				if(vehicleList[i].count != null && vehicleList[i].count == 1){
					vehiOilList.push(vehicleList[i]);
				}
				if(vehicleList[i].obd != null && vehicleList[i].obd == 1){
					vehiOBDList.push(vehicleList[i]);
				}
				if(vehicleList[i].level != null && vehicleList[i].level == 1){
					vehiPeopleList.push(vehicleList[i]);
				}
				if(vehicleList[i].tpms != null && vehicleList[i].tpms == 1){
					vehiTpmsList.push(vehicleList[i]);
				}
				if(vehicleList[i].temp != null && vehicleList[i].temp == 1){
					vehiTempList.push(vehicleList[i]);
				}
			}
			isLoadVehiList = true;
		};
	}, null);
}

//加载线路和站点信息
function loadLineStationManage(lineInfos_, stationInfos_, lineRelations_) {
	//分解线路信息
	if(lineInfos_ != null && lineInfos_.length > 0) {
		for (var i = 0; i < lineInfos_.length; i++) {
			var line_ = new standardLine(lineInfos_[i].id, lineInfos_[i].name);
			line_.setStandardLine(lineInfos_[i]);
			vehicleManager.addLineInfo(lineInfos_[i].id, line_);
		}
	}
	//站点信息
	if(stationInfos_ != null && stationInfos_.length > 0) {
		for (var i = 0; i < stationInfos_.length; i++) {
			var station_ = new standardStation(stationInfos_[i].id, stationInfos_[i].name);
			station_.setStandardStation(stationInfos_[i]);
			vehicleManager.addStationInfo(stationInfos_[i].id, station_);
		}
	}
	//站点关联信息
	if(lineRelations_ != null && lineRelations_.length > 0) {
		for (var i = 0; i < lineRelations_.length; i++) {
			var relation_ = new lineStationRelation(lineRelations_[i].id);
			relation_.setLineStationRelation(lineRelations_[i]);
			//线路id-线路方向-站点id
			var relationId_ = relation_.getLineId()+'-'+relation_.getLineDirect()+'-'+relation_.getStationId();
			vehicleManager.addStationRelation(relationId_, relation_);
			//线路id-线路方向-站点索引
			var relationIdEx_ = relation_.getLineId()+'-'+relation_.getLineDirect()+'-'+relation_.getStationIndex();
			vehicleManager.addStationRelationEx(relationIdEx_, relationIdEx_);
			//添加站点id到线路信息
			var line_ = vehicleManager.getLineInfo(relation_.getLineId());
			if(line_ != null) {
				var station = vehicleManager.getStationInfo(relation_.getStationId());
				line_.addStation(station, relation_.getLineDirect(), relation_.getStationIndex());
			}
		}
	}
}

//加载司机信息
function loadDriverManage(drivers) {
	if(drivers != null && drivers.length > 0) {
		for (var i = 0; i < drivers.length; i++) {
			var driver = new standardDriver(drivers[i].id, drivers[i].dn);
			driver.setStandardDriver(drivers[i]);
			vehicleManager.addDriverInfo(drivers[i].id, driver);
		}
	}
}

function loadVehiToMap() {
	if(vehicleList != null && vehicleList.length > 0) {
		var tempArray = [];
		for (var i = 0; i < vehicleList.length; i++) {
			var vehi_old = vehicleList[i];
			var vehi = new standardVehicle(vehi_old.nm);
			vehi.setVehicle(vehi_old);
			
			if(vehi.getParentId()) {
				//将线路下的车辆加入线路
				var line = vehicleManager.getLineInfo(vehi.getParentId());
				if(line) {
					line.addvehiIdno(vehi.getIdno());
				}
			}
			
			if(vehi_old.dl != null) {
				var devices = vehi_old.dl;
				for (var j = 0; j < devices.length; j++) {
					var dev_old = devices[j];
					var dev = new standardDevice(dev_old.id);
					dev.setDevice(dev_old);
					dev.setVehiIdno(vehi_old.nm);
					vehi.addDevList(dev);
					//将车辆加入到map集合
					vehicleManager.addDevice(dev_old.id, dev);
				}
			}
			
			//将车辆加入到map集合
			if(vehi.isOnline()) {
				vehicleManager.addVehicle(vehi.getIdno(), vehi);
				//将车牌号加入公司车队
				if(vehi.getParentId()) {
					var team_ = vehicleManager.getTeam(vehi.getParentId().toString());
					if(team_) {
						team_.addOnlineVehiIdno(vehi.getIdno());
					}
				}
			}else {
				tempArray.push(vehi);
			}
		}
		for (var i = 0; i < tempArray.length; i++) {
			vehicleManager.addVehicle(tempArray[i].getIdno(),tempArray[i]);
			//将车牌号加入公司车队
			if(tempArray[i].getParentId()) {
				var team_ = vehicleManager.getTeam(tempArray[i].getParentId().toString());
				if(team_) {
					team_.addOfflineVehiIdno(tempArray[i].getIdno());
				}
			}
		}
	}
	vehicleManager.updateAllVehiIdnos();
	vehicleManager.updateAllDevIdnos();
}
//
var isLoadPermitVehiGroupList = false; //公司信息是否加载完成

/**
 * 获取授权车辆(监控、回放等界面)
 */
function getUserVehicles() {
	$.myajax.jsonGet('StandardLoginAction_getUserVehicleEx.action?toMap='+toMap, function(json,action,success){
		if(success) {
			if(myUserRole.isManageLine()) {
				//加载线路和站点信息
				loadLineStationManage(json.lineInfos, json.stationInfos, json.lineRelations);
				//加载司机信息
				loadDriverManage(json.drivers);
			}
			
			var permitVehiGroupList = json.infos;
			for(var i = 0; i < permitVehiGroupList.length; i++) {
				var team = new vehicleTeam(permitVehiGroupList[i].id, permitVehiGroupList[i].name);
				team.setVehicleTeam(permitVehiGroupList[i]);
				vehicleManager.addTeam(permitVehiGroupList[i].id, team);
			}
			for(var i = 0; i < permitVehiGroupList.length; i++) {
				//如果存在父公司，则添加父公司或者子公司
				if(permitVehiGroupList[i].parentId) {
					var parentTeam = vehicleManager.getTeam(permitVehiGroupList[i].parentId.toString());
					if(parentTeam) {
						parentTeam.addChildTeam(permitVehiGroupList[i].id);
						var team_ = vehicleManager.getTeam(permitVehiGroupList[i].id);
						if(team_) {
							team_.addParentTeam(parentTeam.id);
						}
					}
				}
			}
			
			vehicleList = json.vehicles;
			loadVehiToMap(json.vehicles);
			isLoadVehiList = true;
			isLoadPermitVehiGroupList = true;
		}
	}, null);
}

var markers = null;
/**
 * 获取区域信息(监控、回放等界面)
 */
function getListMarker() {
	//向服务器发送ajax请求
	$.myajax.jsonGet("StandardLoginAction_listMarker.action", function(json,action,success){
		if (success) {
			markers = json.markers;
		}
	}, null);
}

function directLogin() {
	var session = getUrlParameter("userSession");
	var ctype = getUrlParameter("ctype");
	if (session != "") {
		var action = "StandardLoginAction_sessionLogin.action?userSession=" + session;
		if(ctype != null && ctype != '') {
			action += "&ctype="+ ctype;
		}
		doLogin(action, false, "", "", "", ctype);
	}
}

function doLogin(action, sysLogin, userAccount, password, verificationCode, ctype) {
	var logintipdlg = $.dialog({id:'logintip',title:false,content:lang.login_logining});
	$.ajax({
		url:action,
		data:{account:decodeURI(userAccount),password:password,language:langCurLocal(),verificationCode:verificationCode},
		cache:false,/*禁用浏览器缓存*/
		dataType:"json",
		success:function(json){
			if(json){
				var flag = json.result;
				if(flag!=null){
					if(flag == 0){
						SetCookie("userId", json.accountId);
						SetCookie("account", json.account);
						SetCookie("isAdmin", json.isAdmin);
						SetCookie("isMaster", json.isMaster);
						SetCookie("isFirstCompany", json.isFirstCompany);
						SetCookie("isSecondCompany", json.isSecondCompany);
						SetCookie("isThreeCompany", json.isThreeCompany);
						SetCookie("hasAddArea", json.hasAddArea);
						SetCookie("hasLine", json.hasLine);
						SetCookie("hasRoadRule", json.hasRoadRule);
						SetCookie("privilege", json.privilege);
						SetCookie("companyId", json.companyId);
						SetCookie("isAllowManage", json.isAllowManage);
						SetCookie("isManageLine", json.isManageLine);
						SetCookie("pagecliks", '');
						window.location = "index.html?clientLogin=1&ctype="+ctype+"&lang="+langCurLocal();
					} else if(flag == 7){
						alert(lang.errLogin_Session);
						window.location = "login.html?lang="+langCurLocal();
					}else {
						alert(lang.errUnkown);
						window.location = "login.html?lang="+langCurLocal();
					}
				}else{
					alert(lang.errUnkown);
					window.location = "login.html?lang="+langCurLocal();
				}				
			}
			logintipdlg.close();
		},error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(lang.errSendRequired);
			logintipdlg.close();
			window.location = "login.html?lang="+langCurLocal();
		}
	});
}

var chineseMainTitle = null;
var englishMainTitle = null;
var twMainTitle = null;
var chineseCopyright = null;
var englishCopyright = null;
var twCopyright = null;
function ajaxLoadInformation() {
	//向服务器发送ajax请求
	$.myajax.jsonGet("StandardLoginAction_information.action", function(json,action,success){
		if (success) {
			chineseMainTitle = json.ChineseMainTitle;
			englishMainTitle = json.EnglishMainTitle;
			twMainTitle = json.TwMainTitle;
			chineseCopyright = json.ChineseCopyright;
			englishCopyright = json.EnglishCopyright;
			twCopyright = json.TwCopyright;
			showTitleAndCopyRight();
			
			setTimeout(ajaxLoadInformation, 100000);
		}
	}, null);
}

function showTitleAndCopyRight() {
	if (langIsChinese()) {
		if (chineseMainTitle != null)  {
			//document.title = chineseMainTitle;
			$('#spanTitle').text(chineseMainTitle);
			$('#spanTitle').attr('title',chineseMainTitle);
			SetCookie("maintitle", chineseMainTitle);
		}
		if (chineseCopyright != null) {
			$("#spanCopyright").html(chineseCopyright);
		}
	} else if (langIsTW()){
		if (twMainTitle != null)  {
			//document.title = twMainTitle;
			$('#spanTitle').text(twMainTitle);
			$('#spanTitle').attr('title',twMainTitle);
			SetCookie("maintitle", twMainTitle);
		}
		if (twCopyright != null) {
			$("#spanCopyright").html(twCopyright);
		}
	} else {
		if (englishMainTitle != null)  {
			//document.title = englishMainTitle;
			$('#spanTitle').text(englishMainTitle);
			$('#spanTitle').attr('title',englishMainTitle);
			SetCookie("maintitle", englishMainTitle);
		}
		if (englishCopyright != null) {
			$("#spanCopyright").html(englishCopyright);
		}
	}
}

function disableForm() {}