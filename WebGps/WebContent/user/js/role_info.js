var api = frameElement.api, W = api.opener;
var priviTree;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//初始化权限树
	//生成权限树
	priviTree = new dhtmlXTreeObject("privi_tree", "100%", "100%", 0);
	priviTree.enableCheckBoxes(1);
	priviTree.enableThreeStateCheckboxes(true);
	priviTree.setImagePath("../js/dxtree/imgs/");
	//insertNewItem(parentId,itemId,itemText,itemActionHandler,image1,image2,image3,optionStr,childs)
	//所有权限
	priviTree.insertNewItem("0", "all", parent.lang.usermgr_privi_all, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	//配置失去焦点的事件
	$("#name").blur(checkName);
	if (isEditRole()) {
		//从服务器查询数据
		ajaxLoadInfo();
	} else {
		ajaxLoadServerConfig();
	}
}); 

function loadLang(){
	$("#labelName").text(parent.lang.usermgr_user_labelName);
	$("#labelRemarks").text(parent.lang.labelRemarks);
	$("#labelPrivi").text(parent.lang.usermgr_user_labelPrivi);
	$("#save").text(parent.lang.save);
}

function initPriviTree(json) {
	//音视频监控
	priviTree.insertNewItem("all", "avmonitor", parent.lang.usermgr_privi_avmonitor, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT'); 
	priviTree.insertNewItem("avmonitor", "621", parent.lang.usermgr_privi_avmonitor_video, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.insertNewItem("avmonitor", "622", parent.lang.usermgr_privi_avmonitor_sound, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.insertNewItem("avmonitor", "623", parent.lang.usermgr_privi_avmonitor_talkback, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.insertNewItem("avmonitor", "624", parent.lang.usermgr_privi_avmonitor_audio, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.insertNewItem("avmonitor", "625", parent.lang.usermgr_privi_avmonitor_capture, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.insertNewItem("avmonitor", "626", parent.lang.usermgr_privi_avmonitor_ptz, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.insertNewItem("avmonitor", "628", parent.lang.usermgr_privi_avmonitor_ptz_light, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.insertNewItem("avmonitor", "627", parent.lang.usermgr_privi_avmonitor_record, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.closeItem("avmonitor");
	//电子围栏权限
	if (json.enableFence) {
		//我的地图
		priviTree.insertNewItem("all", "mymap", parent.lang.usermgr_privi_mymap, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT'); 
		priviTree.insertNewItem("mymap", "611", parent.lang.usermgr_privi_mymap_mgr, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
		priviTree.insertNewItem("mymap", "612", parent.lang.usermgr_privi_mymap_share, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
		priviTree.insertNewItem("mymap", "613", parent.lang.usermgr_privi_mymap_monitor, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
		priviTree.closeItem("mymap");
	}
	if (json.enableTrackPlay) {
		//轨迹回放
		priviTree.insertNewItem("all", "631", parent.lang.usermgr_privi_track, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	//录像回放
	priviTree.insertNewItem("all", "641", parent.lang.usermgr_privi_record, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	//日志查询
	if (json.enableClientRePort) {
		priviTree.insertNewItem("all", "logquery", parent.lang.usermgr_privi_logquery, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT'); 
		priviTree.insertNewItem("logquery", "671", parent.lang.usermgr_privi_logquery_alarm, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
		priviTree.insertNewItem("logquery", "672", parent.lang.usermgr_privi_logquery_user, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
		priviTree.closeItem("logquery");
	}
	//终端控制
	priviTree.insertNewItem("all", "teminal", parent.lang.usermgr_privi_teminal, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT'); 
	priviTree.insertNewItem("teminal", "651", parent.lang.usermgr_privi_teminal_parameter, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.insertNewItem("teminal", "652", parent.lang.usermgr_privi_teminal_info, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.insertNewItem("teminal", "653", parent.lang.usermgr_privi_teminal_upgrade, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	//3G流量统计
	if (json.enable3GFlow) {
		priviTree.insertNewItem("teminal", "654", parent.lang.usermgr_privi_teminal_3gflow, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	priviTree.insertNewItem("teminal", "655", parent.lang.usermgr_privi_teminal_motion, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.insertNewItem("teminal", "656", parent.lang.usermgr_privi_teminal_other, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.closeItem("teminal");
	//系统设置
	priviTree.insertNewItem("all", "system", parent.lang.usermgr_privi_system, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT'); 
	priviTree.insertNewItem("system", "661", parent.lang.usermgr_privi_system_alarm_link, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.insertNewItem("system", "662", parent.lang.usermgr_privi_system_alarm_shield, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.insertNewItem("system", "663", parent.lang.usermgr_privi_system_set, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.insertNewItem("system", "664", parent.lang.usermgr_privi_system_record_set, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.closeItem("system");
	//地图监控
	//priviTree.insertNewItem("all", "51", parent.lang.usermgr_privi_monitor, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	//轨迹回放
	//priviTree.insertNewItem("all", "41", parent.lang.usermgr_privi_track, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	//报表查询
	priviTree.insertNewItem("all", "report", parent.lang.usermgr_privi_report, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT'); 
	var hasReport = false;
	if (json.enableReportNormal) {
		hasReport = true;
		priviTree.insertNewItem("report", "31", parent.lang.usermgr_privi_report_normal, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	if (json.enableReportSpeed) {
		hasReport = true;
		priviTree.insertNewItem("report", "33", parent.lang.usermgr_privi_report_speed, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	if (json.enableReportLogin) {
		hasReport = true;
		priviTree.insertNewItem("report", "34", parent.lang.usermgr_privi_report_login, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	if (json.enableReportIoin) {
		hasReport = true;
		priviTree.insertNewItem("report", "35", parent.lang.usermgr_privi_report_ioin, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	if (json.enableReportAlarm) {
		hasReport = true;
		priviTree.insertNewItem("report", "32", parent.lang.usermgr_privi_report_alarm, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	//存储介质报表
	if (json.enableReportStorage) {
		hasReport = true;
		priviTree.insertNewItem("report", "43", parent.lang.usermgr_privi_report_storage, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	//设备升级报表
	if (json.enableReportStorage) {
		hasReport = true;
		priviTree.insertNewItem("report", "44", parent.lang.usermgr_privi_report_equipment, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	if (json.enableReportOil) {
		hasReport = true;
		priviTree.insertNewItem("report", "36", parent.lang.usermgr_privi_report_oil, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	if (json.enableReportPark) {
		hasReport = true;
		priviTree.insertNewItem("report", "37", parent.lang.usermgr_privi_report_park, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	//电子围栏
	if (json.enableReportFence) {
		hasReport = true;
		priviTree.insertNewItem("report", "38", parent.lang.usermgr_privi_report_fence, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	//3G流量统计
	if (json.enableReport3GFlow) {
		hasReport = true;
		priviTree.insertNewItem("report", "40", parent.lang.usermgr_privi_report_netflow, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	//人员定位
	if (json.enableReportExtern) {
		hasReport = true;
		priviTree.insertNewItem("report", "39", parent.lang.usermgr_privi_report_extend, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	//调度报表
	if (json.enableReportDispatch) {
		hasReport = true;
		priviTree.insertNewItem("report", "41", parent.lang.usermgr_privi_report_dispatch, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	if (hasReport) {
		priviTree.closeItem("report");
	} else {
		priviTree.deleteItem("report", false);
	}
	
	//车辆参数
	var hasTerminal = false;
	priviTree.insertNewItem("all", "vehicle", parent.lang.usermgr_privi_vehimgr, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	if (json.enableMdvr) {
		hasTerminal = true;
		priviTree.insertNewItem("vehicle", "21", parent.lang.usermgr_privi_vehimgr_vehicle, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	if (json.enableDvr) {
		hasTerminal = true;
		priviTree.insertNewItem("vehicle", "29", parent.lang.usermgr_privi_vehimgr_dvr, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	if (json.enableTracker) {
		hasTerminal = true;
		priviTree.insertNewItem("vehicle", "25", parent.lang.usermgr_privi_vehimgr_mobile, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	if (json.enableTerminalGroup) {
		hasTerminal = true;
		priviTree.insertNewItem("vehicle", "22", parent.lang.usermgr_privi_vehimgr_group, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	//电子围栏
	if (json.enableTerminalFence) {
		hasTerminal = true;
		priviTree.insertNewItem("vehicle", "24", parent.lang.usermgr_privi_vehimgr_mapfence, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	//自动下载
	if (json.enableAutoDown) {
		hasTerminal = true;
		priviTree.insertNewItem("vehicle", "23", parent.lang.usermgr_privi_vehimgr_downplan, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	//中心存储
	if (json.enableTerminalSnapshot) {
		priviTree.insertNewItem("vehicle", "26", parent.lang.usermgr_privi_vehimgr_snapshotplan, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	if (json.enableTerminalRecord) {
		hasTerminal = true;
		priviTree.insertNewItem("vehicle", "27", parent.lang.usermgr_privi_vehimgr_recordplan, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	if (json.enableTerminalAlarmAction) {
		hasTerminal = true;
		priviTree.insertNewItem("vehicle", "28", parent.lang.usermgr_privi_vehimgr_alarmaction, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	//司机信息
	if (json.enableTerminalDriver) {
		hasTerminal = true;
		priviTree.insertNewItem("vehicle", "20", parent.lang.usermgr_privi_vehimgr_driver, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	if (hasTerminal) {
		priviTree.closeItem("vehicle");
	} else {
		priviTree.deleteItem("vehicle", false);
	}
	
	//用户管理
	priviTree.insertNewItem("all", "usermgr", parent.lang.usermgr_privi_usermgr, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT'); 
	priviTree.insertNewItem("usermgr", "11", parent.lang.usermgr_privi_usermgr_user, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.insertNewItem("usermgr", "12", parent.lang.usermgr_privi_usermgr_role, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	priviTree.insertNewItem("usermgr", "13", parent.lang.usermgr_privi_usermgr_userlog, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	
	if (json.enableLargeAudit) {
		priviTree.insertNewItem("usermgr", "673", parent.lang.usermgr_privi_usermgr_auditvehicle, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
		priviTree.insertNewItem("usermgr", "674", parent.lang.usermgr_privi_usermgr_auditline, 0, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 'SELECT');
	}
	priviTree.closeItem("usermgr");
}

function disableForm(disable) {
	diableInput("#name", disable, true);
	diableInput("#remarks", disable, true);
	disableButton("#save", disable);
}

function isEditRole() {
	var id = getUrlParameter("id");
	if (id !== null && id !== "") {
		return true;
	} else {
		return false;
	}
}

function ajaxLoadServerConfig() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("RoleAction_serverConfig.action", function(json,action,success){
		$.myajax.showLoading(false);
		disableForm(false);
		if (success) {
			initPriviTree(json);
		} else {
			W.doAddRoleExit();
		}
	}, null);
}

function ajaxLoadInfo() {
	var id = getUrlParameter("id");
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("RoleAction_get.action?id=" + id, function(json,action,success){
		$.myajax.showLoading(false);
		disableForm(false);
		if (success) {
			initPriviTree(json);
			
			$("#name").val(json.name);
			$("#remarks").val(json.remarks);
			//更新权限信息
			if (json.privilege != null) {
				var privilege = json.privilege.split(",");
				for (var i = 0; i < privilege.length; i = i + 1) {
					priviTree.setCheck(privilege[i], true);
				}
			}
		} else {
			W.doEditRoleExit();
		}
	}, null);
}

function checkName() {
	return checkInput("#name", "#nameWrong", 1, 32, parent.lang.errStringRequire, parent.lang.errNameRegex);
}

function checkParam() {
	var ret = true;
	if (!checkName()) {
		ret = false;
	}
	
	return ret;
}

function ajaxSaveRole() {
	if (!checkParam()) {
		return ;
	}

	var data={};
	data.name = $.trim($("#name").val());
	data.remarks = $.trim($("#remarks").val());
	var privilege = priviTree.getAllChecked().split(",");
	var selectPrivi = [];
	for (var i = 0; i < privilege.length; i = i + 1) {
		if ( !isNaN(privilege[i]) ) {
			selectPrivi.push(privilege[i]);
		}
	}
	data.privilege = selectPrivi.toString();
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action;
	if (isEditRole()) {
		action = 'RoleAction_save.action?id=' + getUrlParameter("id");
	} else {
		action = 'RoleAction_add.action';
	}
	$.myajax.jsonPost(action, data, false, function(json, success) {
		var exit = false;
		if (success) {
			exit = true;
		}
		disableForm(false);
		$.myajax.showLoading(false);
		//关闭并退出对话框
		if (exit) {
			if (isEditRole()) {
				data.id = getUrlParameter("id");
				W.doEditRoleSuc(getUrlParameter("id"), data);
			} else {
				W.doAddRoleSuc( data);
			}
		}
	});
}