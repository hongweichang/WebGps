$(document).ready(function(){
	setTimeout(loadAlarmActionPage, 50);
});

var queryDevList = null;

function loadAlarmActionPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadAlarmActionPage, 50);
	} else {
		//加载语言
		loadActionLang();
		setInputFocusBuleTip("#vehisearch", parent.lang.vehicle_searchTerminal);
		//加载车辆信息
		ajaxLoadAlarmAction();
		$('#vehisearch').on('keyup',function(e) {
			if(e.keyCode == 13) {
				queryAlarmAction();
			}
		});
	}
}

function loadActionLang(){
	$("#vehiTitle").text(parent.lang.vehicle_navAlarmAction);
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.vehiName);
	$("#thType").text(parent.lang.vehicle_alarmaction_alarmType);
	$("#thSmsSend").text(parent.lang.vehicle_alarmaction_smsSend);
	$("#thSmsAddress").text(parent.lang.vehicle_alarmaction_smsAddress);
	$("#thSmsContent").text(parent.lang.vehicle_alarmaction_smsContent);
	$("#thEmailSend").text(parent.lang.vehicle_alarmaction_emailSend);
	$("#thEmailAddress").text(parent.lang.vehicle_alarmaction_emailAddress);
	$("#thEmailContent").text(parent.lang.vehicle_alarmaction_emailContent);
	$("#thTime").text(parent.lang.vehicle_mapfence_time);
	$("#thOperator").text(parent.lang.operator);
	$("#btnSearchVehi").text(parent.lang.search);
	$("#btnSetupAlarmAction").text(parent.lang.vehicle_alarmaction_setup);
	$("#btnDeleteSelectAction").text(parent.lang.deleteSelect);
}

function ajaxLoadAlarmAction(curpage, name) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#vehiTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof curpage !== "undefined" && curpage !== "") {
		temp = parseIntDecimal(curpage);
	}
	var action = "VehiAlarmActionAction_list.action";
	var pagination={currentPage:temp, pageRecords:10};
	var data = {};
	var devices = gpsGetVehicleQueryList(name);
	data.devIdnos = devices.toString();
	queryDevList = data;
	$.myajax.jsonGetEx(action, doAjaxAlarmAction, pagination, data);
}

function doCheckQuery() {
	return true;
}

function getDeviceAlarmTypeString(devIdno, armType) {
	if (armType >= 19 && armType <= 26) {
		return gpsGetVehicleIoinName(devIdno, armType - 19);
	} else if (armType >= 41 && armType <= 44) {
		return gpsGetVehicleIoinName(devIdno, armType - 41 + 8);
	}
	else {
		return getAlarmTypeString(armType);
	}
}

function doAjaxAlarmAction(json,action,success) {
	if (success) {
		if (!$.isEmptyObject(json.actions)) {
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.actions, function (i, fn) {
				var row = $("#vehiTableTemplate").clone();
				fillRowAction(row, fn);
				row.find("#tdIndex").text(k);
				row.find("#tdName").html("<a href=\"javascript:editAlarmAction('" + fn.id + "', '" + fn.devIdno + "', '" + fn.armType + "');\">" + gpsGetVehicleName(fn.devIdno)) + "</a>";
				var temp = "<a href=\"javascript:editAlarmAction('" + fn.id + "', '" + fn.devIdno + "', '" + fn.armType + "');\">" + parent.lang.edit + "</a>" ;
				var delStr = "<a href=\"javascript:delAlarmAction('" + fn.id + "', '" + fn.devIdno + "');\">" + parent.lang.del + "</a>" ;
				row.find("#tdType").text(getDeviceAlarmTypeString(fn.devIdno, fn.armType));
				row.find("#tdOperator").html(temp + delStr);
				row.find("#selectIdList").val(fn.id + "," + fn.devIdno);
				append2TableEx("#vehiTable", k, row, fn.id);
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#vehiPagination");
		json.pagination.id = "#vehiPagination";
		json.pagination.tableId = "#vehiTable";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxAlarmAction, queryDevList);
	}
	$.myajax.showLoading(false);
}

function fillRowAction(row, action) {
	if (action.smsSend != null && action.smsSend == 1) {
		row.find("#tdSmsSend").text(parent.lang.yes);
		row.find("#tdSmsAddress").text(action.smsAddress);		
		row.find("#tdSmsContent").text(action.smsContent);
	} else {
		row.find("#tdSmsSend").text(parent.lang.no);
	}
	
	if (action.emailSend != null && action.emailSend == 1) {
		row.find("#tdEmailSend").text(parent.lang.yes);
		row.find("#tdEmailAddress").text(action.emailAddress);
	} else {
		row.find("#tdEmailSend").text(parent.lang.no);
	}
	row.find("#tdTime").text(second2ShortHourEx(action.beginTime) + " - " + second2ShortHourEx(action.endTime));
}

function editAlarmAction(id, idno, armType) {
	$.dialog({id:'editaction', title:parent.lang.vehicle_alarmaction_edit + "  -  " + gpsGetVehicleName(idno) + "  -  " + getDeviceAlarmTypeString(idno, armType), content:'url:vehicle/vehi_alarmaction_setup.html?id=' + id
		, min:false, max:false, lock:true});
}

function doEditAlarmActionSuc(id, data) {
	$.dialog({id:'editaction'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//查找对应的行数据
	$("#vehiTable").find("tr").each(function(){
			if (this.id == ("tableTop_" + id)) {
				fillRowAction($(this), data);
			}
		}
	);	
}

function delAlarmAction(id, devIdno) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	
	//执行删除操作
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet("VehiAlarmActionAction_delete.action?id=" + id + "&devIdno=" + devIdno, function(json,action,success){
		$.myajax.showLoading(false);
		var curpage = $("#vehiPagination").find("#hideCurrentPage").text();
		ajaxLoadAlarmAction(curpage);
	}, null);
}

function queryAlarmAction() {
	var name = $.trim($("#vehisearch").val());
	if (name == parent.lang.vehicle_searchVehi) {
		name = "";
	}

	ajaxLoadAlarmAction(1, name);
}

function setupAlarmAction() {
	$.dialog({id:'setupaction', title:parent.lang.vehicle_alarmaction_setup,content:'url:vehicle/vehi_alarmaction_setup.html'
		, min:false, max:false, lock:true});
}

function doSetupAlarmActionSuc() {
	$.dialog({id:'setupaction'}).close();
	ajaxLoadAlarmAction(1);
}

function deleteSelectAction() {
	var actions = getSelectItem("selectIdList");
	if (actions.length <= 0) {
		alert(parent.lang.errSelectedRequired);
	} else {
		if(!confirm(parent.lang.delconfirm)) {
			return ;
		}
		
		var ids = [];
		var idnos = [];
		for (var i = 0; i < actions.length; ++ i) {
			var value = actions[i].split(',');
			ids.push(value[0]);
			idnos.push(value[1]);
		}
		
		//执行删除操作
		$.myajax.showLoading(true, parent.lang.deleting);
		$.myajax.jsonGet("VehiAlarmActionAction_delete.action?id=" + ids + "&devIdno=" + idnos, function(json,action,success){
			$.myajax.showLoading(false);
			var curpage = $("#vehiPagination").find("#hideCurrentPage").text();
			ajaxLoadAlarmAction(curpage);
		}, null);
	}
}