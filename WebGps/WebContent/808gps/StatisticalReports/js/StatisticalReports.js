$(document).ready(function(){
	$('body').flexShowLoading(true);
	setTimeout(loadReadyPage, 50);
});

var defaultVehi = null;
var defaultUser = null;
var markerList = null; //区域信息
var isLoadMarkerSuc = false;  //加载区域信息成功

var reportPageManage = null; //报表页面管理

function loadReadyPage() {
	if (typeof parent.lang == "undefined" || !parent.isLoadVehiList) {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}

function loadPage() {
	//新建报表页面管理
	reportPageManage = new pageManagement($('#mainPanel-tongji',parent.document).find('#rightPanel').get(0));
	
	$.myajax.jsonGet('StandardLoginAction_getReportPage.action', function(json,action,success){
		if(success) {
			var mod = [];
			$.each(json.pages,function(i, page){
				var subMod = [];
				$.each(page.listSubPrivi,function(j, subPage){
					var pclass = "";
					var title_ = getPageDisplay(subPage.privi);
					if(i == 0 && j == 0) {
						pclass = "current";
						var titles = subPage.name.split('-');
						//新增页面
						reportPageManage.addPage(subPage.name, title_, 'StatisticalReports/'+titles[0]+'_'+titles[1]+'.html?rtype='+singleSelect);
						//$('#mainPanel-tongji',parent.document).find('#rightPanel').find('iframe').attr('src','StatisticalReports/'+titles[0]+'_'+titles[1]+'.html?rtype='+singleSelect);
					}
					subMod.push({
						display: title_,
						name: subPage.name,
						preicon : true,
						bgicon : true,
						pclass: pclass,
						rtype: singleSelect
					});
				});
				var pclass = "report";
				if(i == 0) {
					pclass = "report active";
				}
				mod.push({
					title : {display: getPageDisplay(page.privi),name: page.name+'-title',pclass : pclass},
					tabs : subMod
				});
			});
			
			$('.nav').flexPanel({
				TabsGroupModelTre : mod
			});
			
			var lis=$(".menu li")
			var tit=$(".menu li .part .part-menu");
			var part_menu=$(".menu li .part .gdiv");

			tit.click(function(){
				toggleMyClass('.menu .part-menu', this, 'active');
				if($(this).next('.gdiv').css('display') == 'none') {
					$(".gdiv").slideUp();
					$(this).siblings("div").slideToggle();
				}else {
					$(this).siblings("div").slideToggle();
				}
			});

			$('.nav .menu p').each(function(i){
				$(this).on('click',function(){
					toggleMyClass('.menu p', this, 'current');
					var data_tab = $(this).attr('data-tab');
					var titles = data_tab.split('-');
					var rtype = $(this).attr('data-rtype');
					var pageTitle = $('.text', this).text();
//					$('#mainPanel-tongji',parent.document).find('#rightPanel').find('iframe').attr('src','StatisticalReports/'+titles[0]+'_'+titles[1]+'.html?rtype='+rtype);
					//新增页面
					reportPageManage.addPage(data_tab, pageTitle, 'StatisticalReports/'+titles[0]+'_'+titles[1]+'.html?rtype='+rtype);
				});
			});
			
		};
	}, null);
	//加载完成
	$('body').flexShowLoading(false);
	//查询区域信息
	ajaxLoadMarker();
}

var singleSelect = 2;
/**
 * 获取页面名称
 */
function getPageDisplay(key) {
	var name = '';
	switch (key) {
	case 1:
		name = parent.lang.report_normal;
		break;
	case 11:
		name = parent.lang.report_speed_title;
		singleSelect = 1;
		break;
	case 12:
		name = parent.lang.report_navNormalTrackDetail;
		singleSelect = 1;
		break;
	case 13:
		name = parent.lang.report_sms_detail;
		singleSelect = 2;
		break;
	case 2:
		name = parent.lang.report_login_title;
		break;
	case 21:
		name = parent.lang.report_vehicle_login_sumary;
		singleSelect = 2;
		break;
	case 22:
		name = parent.lang.report_vehicle_login_detail;
		singleSelect = 2;
		break;
	case 23:
		name = parent.lang.report_company_dailyonline_detail;
		singleSelect = 3;
		break;
	case 24:
		name = parent.lang.report_vehicle_monthlyonline_detail;
		singleSelect = 2;
		break;
	case 25:
		name = parent.lang.report_online_rate_detail;
		singleSelect = 2;
		break;
	case 3:
		name = parent.lang.alarm_report;
		break;
	case 31:
		name = parent.lang.report_alarm_summary;
		singleSelect = 2;
		break;
	case 32:
		name = parent.lang.report_alarm_detail;
		singleSelect = 2;
		break;
	case 4:
		name = parent.lang.report_navOil;
		break;
	case 41:
		name = parent.lang.report_navOilTrackDetail;
		singleSelect = 3;
		break;
	case 42:
		name = parent.lang.report_navOilExceptionDetail;
		singleSelect = 3;
		break;
	case 43:
		name = parent.lang.report_navOilSummary;
		singleSelect = 3;
		break;
	case 5:
		name = parent.lang.report_licheng_title;
		break;
	case 51:
		name = parent.lang.report_liCheng_summary;
		singleSelect = 2;
		break;
	case 52:
		name = parent.lang.report_liCheng_detail;
		singleSelect = 2;
		break;
	case 6:
		name = parent.lang.report_park_title;
		break;
	case 61:
		name = parent.lang.report_park_summary;
		singleSelect = 2;
		break;
	case 62:
		name = parent.lang.report_park_detail;
		singleSelect = 2;
		break;
	case 63:
		name = parent.lang.report_acc_summary;
		singleSelect = 2;
		break;
	case 64:
		name = parent.lang.report_acc_detail;
		singleSelect = 2;
		break;
	case 7:
		name = parent.lang.report_fence_title;
		break;
	case 71:
		name = parent.lang.report_fence_summary;
		singleSelect = 2;
		break;
	case 72:
		name = parent.lang.report_fence_detail;
		singleSelect = 2;
		break;
	case 8:
		name = parent.lang.log_query;
		break;
	case 81:
		name = parent.lang.user_log;
		singleSelect = 2;
		break;
	case 9:
		name = parent.lang.report_storage;
		break;
	case 91:
		name = parent.lang.report_storage_navAlarmDiskerror;
		singleSelect = 2;
		break;
	case 92:
		name = parent.lang.report_storage_navAlarmHighTemperature;
		singleSelect = 2;
		break;
	case 93:
		name = parent.lang.report_storage_harddiskStatusInformationDetail;
		singleSelect = 2;
		break;
	case 10:
		name = parent.lang.report_equipment;
		break;
	case 101:
		name = parent.lang.report_equipment_vehicleReleaseDetails;
		singleSelect = 2;
		break;
	case 102:
		name = parent.lang.report_equipment_offlineRecordingEquipmentUpgrade;
		singleSelect = 2;
		break;
	case 20:
		name = parent.lang.report_media;
		break;
	case 201:
		name = parent.lang.report_vehicle_photo;
		singleSelect = 1;
		break;
	case 202:
		name = parent.lang.report_vehicle_audio;
		singleSelect = 1;
		break;
	case 203:
		name = parent.lang.report_vehicle_video;
		singleSelect = 1;
		break;
	case 30:
		name = parent.lang.report_data;
		break;
	case 301:
		name = parent.lang.report_data_query;
		singleSelect = 2;
		break;
	case 40:
		name = parent.lang.malfunction_report;
		break;
	case 401:
		name = parent.lang.report_malfunction_summary;
		singleSelect = 2;
		break;
	case 402:
		name = parent.lang.report_malfunction_detail;
		singleSelect = 2;
		break;
	case 50:
		name = parent.lang.video_report;
		break;
	case 501:
		name = parent.lang.report_video_summary;
		singleSelect = 2;
		break;
	case 502:
		name = parent.lang.report_video_detail;
		singleSelect = 2;
		break;
	case 60:
		name = parent.lang.io_report;
		break;
	case 601:
		name = parent.lang.report_io_summary;
		singleSelect = 2;
		break;
	case 602:
		name = parent.lang.report_io_detail;
		singleSelect = 2;
		break;
	case 70:
		name = parent.lang.driving_report;
		break;
	case 701:
		name = parent.lang.report_driving_summary;
		singleSelect = 2;
		break;
	case 702:
		name = parent.lang.report_driving_detail;
		singleSelect = 2;
		break;
	case 703:
		name = parent.lang.report_overspeed_summary;
		singleSelect = 2;
		break;
	case 704:
		name = parent.lang.report_overspeed_detail;
		singleSelect = 2;
		break;
	case 705:
		name = parent.lang.report_sliptsation_summary;
		singleSelect = 2;
		break;
	case 706:
		name = parent.lang.report_sliptsation_detail;
		singleSelect = 2;
		break;
	case 80:
		name = parent.lang.userOnline_report;
		break;
	case 801:
		name = parent.lang.report_userOnline_summary;
		singleSelect = 2;
		break;
	case 802:
		name = parent.lang.report_userOnline_detail;
		singleSelect = 2;
		break;
	case 90:
		name = parent.lang.people_report;
		break;
	case 901:
		name = parent.lang.report_people_summary;
		singleSelect = 3;
		break;
	case 902:
		name = parent.lang.report_people_detail;
		singleSelect = 3;
		break;
	case 100:
		name = parent.lang.temp_report;
		break;
	case 1001:
		name = parent.lang.report_temp_summary;
		singleSelect = 3;
		break;
	case 1002:
		name = parent.lang.report_temp_detail;
		singleSelect = 3;
		break;
	case 1003:
		name = parent.lang.report_temp_detailException;
		singleSelect = 3;
		break;
	case 110:
		name = parent.lang.door_report;
		break;
	case 1101:
		name = parent.lang.report_door_summary;
		singleSelect = 2;
		break;
	case 1102:
		name = parent.lang.report_door_detail;
		singleSelect = 2;
	case 120:
		name = parent.lang.signin_report;
		break;
	case 1201:
		name = parent.lang.signin_report;
		singleSelect = 2;
		break;
	case 130:
		name = "派车单报表";
		break;
	case 1301:
		name = "派车单统计报表";
		singleSelect = 3;
		break;
	case 1302:
		name = "派车单明细报表";
		singleSelect = 3;
		break;
	case 140:
		name = parent.lang.trip_month_report;
		break;
	case 141:
		name = parent.lang.trip_daily_report;
		break;
	case 142:
		name = parent.lang.trip_detail_report;
		break;
	case 143:
		name = parent.lang.trip_station_report;
		break;
	case 1401:
		name = parent.lang.report_trip_line_month;
		singleSelect = 3;
		break;
	case 1402:
		name = parent.lang.report_trip_line_daily;
		singleSelect = 3;
		break;
	case 1403:
		name = parent.lang.report_trip_vehicle_month;
		singleSelect = 3;
		break;
	case 1404:
		name = parent.lang.report_trip_vehicle_daily;
		singleSelect = 3;
		break;
	case 1405:
		name = parent.lang.report_trip_driver_month;
		singleSelect = 3;
		break;
	case 1406:
		name = parent.lang.report_trip_driver_daily;
		singleSelect = 3;
		break;
	case 1407:
		name = parent.lang.report_trip_detail;
		singleSelect = 3;
		break;
	case 1408:
		name = parent.lang.report_station_detail;
		singleSelect = 3;
		break;
	case 150:
		name = parent.lang.tire_pressure_monitoring_report;
		break;
	case 1501:
		name = parent.lang.tire_pressure_monitoring_summary;
		singleSelect = 2;
		break;
	case 1502:
		name = parent.lang.tire_pressure_monitoring_detail;
		singleSelect = 2;
		break;
	case 1503:
		name = parent.lang.tire_pressure_monitoring_trackDetail;
		singleSelect = 1;
		break;	
	case 160:
		name = parent.lang.obd_report;
		break;
	case 1601:
		name = parent.lang.obd_detail;
		singleSelect = 3;
		break;
	}
	return name;
}

//查询区域信息
function ajaxLoadMarker() {
	//向服务器发送ajax请求
	$.myajax.jsonGet("StandardReportAlarmAction_markerLists.action", function(json,action,success){
		parent.isLoadMarkerSuc = true;
		if (success) {
			parent.markerList = json.markers;
		}
	}, null);
}