$(document).ready(function(){
	loadReportNav();
});

var lastNavUrl = "";
var lastNavMenu = "";

function loadReportNav() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReportNav, 50);
	} else {
		lastNavUrl = "";
		loadLang();
		loadNavMenu();
		//设置导航图标
		$("#nav_image").attr("src", "images/system/nav_" + getUrlParameter("page") + ".jpg");
	}
}

//加载主菜单信息
function loadNavMenu() {
	$.myajax.showLoading(true, parent.lang.loading);
	$.myajax.jsonGet("PriviAction_page.action?page=" + getUrlParameter("page"), function(json,action,success){
		$.myajax.showLoading(false);
		if (success) {
			var liHtml = "";
			for (var i = 0; i < json.privis.length; i += 1) {
				var privi = json.privis[i];
				var menuName = getMenuName(privi.privi);
				if (privi.listSubPrivi != null) {
					var subFirstPrivi = privi.listSubPrivi[0].privi;
					var html = "<dl class=\"submenu\" name=\"dlPrivi\" id=\"dl_" + privi.privi + "\"></dl>" +
	          			"<dt id=\"dt_" + privi.privi + "\"><a href=\"javascript:switchNavMenu('" + privi.privi + "', '" + subFirstPrivi + "','" + privi.url + "');\">" + menuName + "</a></dt>" +
	          			"<dd name=\"ddPrivi\" id=\"dd_" + privi.privi + "\" style=\"display:none;\"><ul>";
	          		var subHtml = "";
					//插入字菜单
					for (var j = 0; j < privi.listSubPrivi.length; j += 1) {
						var subPrivi = privi.listSubPrivi[j];
						menuName = getMenuName(subPrivi.privi);
						var str = "<li id=\"" + subPrivi.privi + "\" name=\"navMenuItem\" ><a href=\"javascript:switchNavPage('" + subPrivi.privi + "', '" + subPrivi.url + "');\">";
						str += (menuName + "</a></li>");
						subHtml += str;
					}
					html = html + subHtml + "</ul></dd>";
					$("#navigate").append(html);
				} else {
					liHtml += "<li id=\"" + privi.privi + "\" name=\"navMenuItem\" ><a href=\"javascript:switchNavPage('" + privi.privi + "', '" + privi.url + "');\" class=\"normal\">" + menuName + "</a></li>"
				}
			}
			if (liHtml !== "") {
				var temp = "<ul class=\"subnormal\">" + liHtml + "</ul>";
				$("#navigate").append(temp);
			}
			//加载第一个页面的url信息
			if (json.privis.length > 0) {
				if (json.privis[0].listSubPrivi != null) {
					switchNavMenu(json.privis[0].privi, json.privis[0].listSubPrivi[0].privi, json.privis[0].url);
				} else {
					switchNavMenu(json.privis[0].privi, json.privis[0].privi, json.privis[0].url);
				}
			}
		}
	}, null);
}

//获取菜单名称
function getMenuName(privi) {
	var ret;
	switch(parseInt(privi)) {
	//用户管理
	case 11:	
		ret = parent.lang.usermgr_navUser;
		break;
	case 12:
		ret = parent.lang.usermgr_navRole;
		break;
	case 13:
		ret = parent.lang.usermgr_navUserLog;
		break;
	//车辆管理
	case 21:
		ret = parent.lang.vehicle_navVehicle;
		break;
	case 22:
		ret = parent.lang.vehicle_navGroup;
		break;
	case 23:
		ret = parent.lang.vehicle_navDownPlan;
		break;
	case 24:
		ret = parent.lang.vehicle_navMapFence;
		break;
	case 25:
		ret = parent.lang.vehicle_navMobile;
		break;
	case 26:
		ret = parent.lang.vehicle_navSnapshotPlan;
		break;
	case 27:
		ret = parent.lang.vehicle_navRecordPlan;
		break;
	case 28:
		ret = parent.lang.vehicle_navAlarmAction;
		break;
	case 29:
		ret = parent.lang.vehicle_navDvr;
		break;
	case 20:
		ret = parent.lang.vehicle_navDriver;
		break;
	//报表	常用报表
	case 31:
		ret = parent.lang.report_navNormal;
		break;
	case 311:
		ret = parent.lang.report_navNormalLiChengSummary;
		break;
	case 312:
		ret = parent.lang.report_navNormalLiChengDetail;
		break;
	case 313:
		ret = parent.lang.report_navNormalTrackDetail;
		break;
	case 314:
		ret = parent.lang.report_navNormalOnlineRateDetail;
		break;
	case 315:
		ret = parent.lang.report_navNormalStatisticalMileage;
		break;
	//乘客票据报表
	case 42:
		ret = parent.lang.report_navPassengerTicket;
		break;
	case 421:
		ret = parent.lang.report_navPassengerTicketSummary;
		break;
	case 422:
		ret = parent.lang.report_navPassengerTicketDetail;
		break;
		//速度报表
	case 33:
		ret = parent.lang.report_navSpeed;
		break;
	case 331:
		ret = parent.lang.report_navSpeedAlarmSummary;
		break;
	case 332:
		ret = parent.lang.report_navSpeedAlarmDetail;
		break;
	case 333:
		ret = parent.lang.report_navSpeedDetail;
		break;
		//上下线报表
	case 34:
		ret = parent.lang.report_navLogin;
		break;
	case 341:
		ret = parent.lang.report_navLoginSummary;
		break;
	case 342:
		ret = parent.lang.report_navLoginDetail;
		break;
	case 343:
		ret = parent.lang.report_navLoginRate;
		break;
		//IO输入报警
	case 35:
		ret = parent.lang.report_navIoin;
		break;
	case 351:
		ret = parent.lang.report_navIoinSummary;
		break;
	case 352:
		ret = parent.lang.report_navIoinDetail;
		break;
//		//报警报表
//	case 32:
//		ret = parent.lang.report_navAlarm;
//		break;
//	case 321:
//		ret = parent.lang.report_navAlarmSummary;
//		break;
//	case 322:
//		ret = parent.lang.report_navAlarmGpsSinnalDetail;
//		break;
//	case 323:
//		ret = parent.lang.report_navAlarmButtonDetail;
//		break;
//	case 324:
//		ret = parent.lang.report_navAlarmDooropen;
//		break;
//	case 325:
//		ret = parent.lang.report_navAlarmAll;
//		break;
//	case 326:
//		ret = parent.lang.report_navAlarmMotion;
//		break;
//	case 327:
//		ret = parent.lang.report_navAlarmShake;
//		break;
//	case 328:
//		ret = parent.lang.report_navAlarmVideoLost;
//		break;
//	case 329:
//		ret = parent.lang.report_navAlarmFatigue;
//		break;
//	case 320:
//		ret = parent.lang.report_navAlarmAcc;
//		break;
//	case 3211:
//		ret = parent.lang.report_navAlarmNightDriving;
//		break;
//	case 3212:
//		ret = parent.lang.report_navAlarmQuery;
//		break;
//	case 3213:
//		ret = parent.lang.report_navAlarmStatisticsQuery;
//		break;
//	case 3214:
//		ret = parent.lang.report_navAlarmViolation;
//		break;
//	case 3215:
//		ret = parent.lang.report_navAlarmUpsCut;
//		break;
//	case 3216:
//		ret = parent.lang.report_navAlarmTurnOff;
//		break;
//	case 3217:
//		ret = parent.lang.report_navAlarmBoardOpened;
//		break;
//	case 3218:
//		ret = parent.lang.report_navSimLost;
//		break;
		//油量报表
	case 36:
		ret = parent.lang.report_navOil;
		break;
	case 361:
		ret = parent.lang.report_navOliTrackDetail;
		break;
	case 362:
		ret = parent.lang.report_navOliExceptionDetail;
		break;
	case 363:
		ret = parent.lang.report_oil_summary;
		break;
		//停车报表
	case 37:
		ret = parent.lang.report_navPark;
		break;
	case 371:
		ret = parent.lang.report_navParkSummary;
		break;
	case 372:
		ret = parent.lang.report_navParkDetail;
		break;
	case 373:
		ret = parent.lang.report_navParkAcconSummary;
		break;
	case 374:
		ret = parent.lang.report_navParkAcconDetail;
		break;
		//围栏报表
	case 38:
		ret = parent.lang.report_navFence;
		break;
	case 381:
		ret = parent.lang.report_navFenceAlarmDetail;
		break;
	case 382:
		ret = parent.lang.report_navFenceAccessDetail;
		break;
	case 383:
		ret = parent.lang.report_navFenceParkDetail;
		break;
		//扩展功能报表
	case 39:
		ret = parent.lang.report_navExtend;
		break;
	case 391:
		ret = parent.lang.report_navExtendAlarmDetail;
		break;
	case 392:
		ret = parent.lang.report_navExtendDispatchDetail;
		break;
		//3G流量报表
	case 40:
		ret = parent.lang.report_navNetFlow;
		break;
	case 401:
		ret = parent.lang.report_navNetFlowSummary;
		break;
	case 402:
		ret = parent.lang.report_navNetFlowDetail;
		break;
		//调度指令报表
	case 41:
		ret = parent.lang.report_navDispatch;
		break;
	case 411:
		ret = parent.lang.report_navDispatchTtsDetail;
		break;
	//存储介质报表
	case 43:
		ret = parent.lang.report_navStorage;
		break;
	case 431:
		ret = parent.lang.report_navAlarmDiskerror;
		break;
	case 432:
		ret = parent.lang.report_navAlarmHighTemperature;
		break;
	case 433:
		ret = parent.lang.report_harddiskStatusInformationDetail;
		break;
//	//设备升级报表
//	case 44:
//		ret = parent.lang.report_navEquipment;
//		break;
//	case 441:
//		ret = parent.lang.report_vehicleReleaseDetails;
//		break;
//	case 442:
//		ret = parent.lang.report_offlineRecordingEquipmentUpgrade;
//		break;
//	case 443:
//		ret = parent.lang.report_parameterConfigurationReport;
//		break;
	}
	return ret;
}

function getTitleName() {
	var title = "";
	var page = getUrlParameter("page");
	if (page == "report") {
		title = parent.lang.index_navReport;
	} else if (page == "vehicle") {
		title = parent.lang.index_navVehicle;
	} else if (page == "user") {
		title = parent.lang.index_navUser;
	}
	return title;
}

function loadLang(){
	$("#spanNavTitle").text(getTitleName());
}

function switchNavMenu(page, subPrivi, url){
	if (lastNavMenu == page) {
		return ;
	}
	
	if (lastNavMenu !== "") {
		$("#dd_" + lastNavMenu).hide();
		$("#dt_" + lastNavMenu).removeClass();
	}
	$("#dd_" + page).show();
	$("#dt_" + page).addClass("viewed");
	switchNavPage(subPrivi, url);
	lastNavMenu = page;
}

function switchNavPage(page, url) {
	//切换导航焦点
	var allnodes = GetElementsByName('li', 'navMenuItem');
	//var allnodes = document.getElementsByName('navMenuItem');
	for(var i=0; i<allnodes.length; i += 1){
		if (page == allnodes[i].id) {
			allnodes[i].className = "viewed";
		}else{
			allnodes[i].className = "";
		}
	}
	
	if (lastNavUrl != url) {
		//进行页面重定向
		parent.localReportUrl(url);
		lastNavUrl = url;
	}
}
