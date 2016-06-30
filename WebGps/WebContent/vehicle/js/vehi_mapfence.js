$(document).ready(function(){
	setTimeout(loadMapFencePage, 50);
});

var queryDevList = null;
var markerList = null;

function loadMapFencePage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadMapFencePage, 50);
	} else {
		//加载语言
		loadVehiLang();
		setInputFocusBuleTip("#vehisearch", parent.lang.vehicle_searchTerminal);
		//加载车辆信息
		ajaxLoadMapFence();
		$('#vehisearch').on('keyup',function(e) {
			if(e.keyCode == 13) {
				queryMapFence();
			}
		});
	}
}

function loadVehiLang(){
	$("#vehiTitle").text(parent.lang.vehicle_navMapFence);
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.vehiName);
	$("#thMarker").text(parent.lang.vehicle_mapfence_marker);
	$("#thAccessAlarm").text(parent.lang.vehicle_mapfence_accessAlarm);
	$("#thSpeedAlarm").text(parent.lang.vehicle_mapfence_speedAlarm);
	$("#thSpeedHigh").text(parent.lang.vehicle_mapfence_speedHigh + gpsGetLabelSpeedUnit());
	$("#thSpeedLow").text(parent.lang.vehicle_mapfence_speedLow + gpsGetLabelSpeedUnit());
	$("#thParkAlarm").text(parent.lang.vehicle_mapfence_parkAlarm);
	$("#thParkTime").text(parent.lang.vehicle_mapfence_parkTime + gpsGetLabelSecond());
	$("#thTime").text(parent.lang.vehicle_mapfence_time);	
	$("#thOperator").text(parent.lang.operator);
	$("#btnSearchVehi").text(parent.lang.search);
	$("#btnSetupMapFence").text(parent.lang.vehicle_mapfence_setup);
	$("#btnDeleteSelectPlan").text(parent.lang.deleteSelect);
}

function ajaxLoadMapFence(curpage, name) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#vehiTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof curpage !== "undefined" && curpage !== "") {
		temp = parseIntDecimal(curpage);
	}
	var action = "VehiFenceAction_list.action";
	var pagination={currentPage:temp, pageRecords:10};
	var data = {};
	var devices = gpsGetVehicleQueryList(name);
	data.devIdnos = devices.toString();
	queryDevList = data;
	//.myajax.jsonPost(action, doAjaxMapFence, data, doAjaxMapFence);
	$.myajax.jsonGetEx(action, doAjaxMapFence, pagination, data);
}

function doCheckQuery() {
	return true;
}

function doAjaxMapFence(json,action,success) {
	if (success) {
		markerList = json.markers;
		if (!$.isEmptyObject(json.fences)) {
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.fences, function (i, fn) {
				var row = $("#vehiTableTemplate").clone();
				fillRowMapFence(row, fn);
				row.find("#tdIndex").text(k);
				row.find("#tdName").html("<a href=\"javascript:editMapFence('" + fn.id + "','" + fn.devIdno + "');\">" + gpsGetVehicleName(fn.devIdno)) + "</a>";
				var temp = "<a href=\"javascript:editMapFence('" + fn.id + "','" + fn.devIdno + "');\">" + parent.lang.edit + "</a>" ;
				var delStr = "<a href=\"javascript:delMapFence('" + fn.id + "','" + fn.devIdno + "');\">" + parent.lang.del + "</a>" ;
				row.find("#tdOperator").html(temp + delStr);
				row.find("#selectIdList").val(fn.id + "," + fn.devIdno);
				append2TableEx("#vehiTable", k, row, fn.id);
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#vehiPagination");
		json.pagination.id = "#vehiPagination";
		json.pagination.tableId = "#vehiTable";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxMapFence, queryDevList);
	}
	$.myajax.showLoading(false);
}

function getFenceAlarm(alarm) {
	var ret = "";
	if (alarm == 0) {
		ret = parent.lang.vehicle_mapfence_none;
	} else if (alarm == 1) {
		ret = parent.lang.vehicle_mapfence_in;
	} else {
		ret = parent.lang.vehicle_mapfence_out;
	}
	return ret;
}

function getMarkerName(markerId) {
	var ret = "";
	if (markerList != null) {
		for (var i = 0; i < markerList.length; i += 1) {
			if (markerId == markerList[i].id) {
				ret = markerList[i].name;
				break;
			}
		}
	}
	return ret;
}

function fillRowMapFence(row, fence) {
	row.find("#tdMarker").text(getMarkerName(fence.markerID));
	row.find("#tdAccessAlarm").text(getFenceAlarm(fence.accessAlarm));
	row.find("#tdSpeedAlarm").text(getFenceAlarm(fence.speedAlarm));
	if (fence.speedAlarm != 0) {
		if (fence.speedHigh == 0) {		
			row.find("#tdSpeedHigh").text(parent.lang.vehicle_mapfence_speedNoLimit);
		} else {
			row.find("#tdSpeedHigh").text(fence.speedHigh/10);
		}
		if (fence.speedLow == 0) {		
			row.find("#tdSpeedLow").text(parent.lang.vehicle_mapfence_speedNoLimit);
		} else {
			row.find("#tdSpeedLow").text(fence.speedLow/10);
		}
	} else {
		row.find("#tdSpeedHigh").text("");
		row.find("#tdSpeedLow").text("");
	}
	row.find("#tdParkAlarm").text(getFenceAlarm(fence.parkAlarm));
	if (fence.parkAlarm != 0) {
		row.find("#tdParkTime").text(fence.parkTime);
	} else {
		row.find("#tdParkTime").text("");
	}
	row.find("#tdTime").text(second2ShortHourEx(fence.beginTime) + " - " + second2ShortHourEx(fence.endTime));
}

function editMapFence(id, idno) {
	$.dialog({id:'editfence', title:parent.lang.vehicle_mapfence_edit + "  -  " + gpsGetVehicleName(idno), content:'url:vehicle/vehi_fence_setup.html?id=' + id
		, min:false, max:false, lock:true});
}

function doEditFenceSuc(id, data) {
	$.dialog({id:'editfence'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//查找对应的行数据
	$("#vehiTable").find("tr").each(function(){
			if (this.id == ("tableTop_" + id)) {
				fillRowMapFence($(this), data);
			}
		}
	);	
}

function delMapFence(id, devIdno) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	
	//执行删除操作
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet("VehiFenceAction_delete.action?id=" + id + "&devIdno=" + devIdno, function(json,action,success){
		$.myajax.showLoading(false);
		var curpage = $("#vehiPagination").find("#hideCurrentPage").text();
		ajaxLoadMapFence(curpage);
	}, null);
}

function queryMapFence() {
	var name = $.trim($("#vehisearch").val());
	if (name == parent.lang.vehicle_searchVehi) {
		name = "";
	}

	ajaxLoadMapFence(1, name);
}

function setupMapFence() {
	$.dialog({id:'setupfence', title:parent.lang.vehicle_mapfence_setup,content:'url:vehicle/vehi_fence_setup.html'
		, min:false, max:false, lock:true});
}

function doSetupFenceSuc() {
	$.dialog({id:'setupfence'}).close();
	ajaxLoadMapFence(1);
}

function deleteSelectPlan() {
	var plans = getSelectItem("selectIdList");
	if (plans.length <= 0) {
		alert(parent.lang.errSelectedRequired);
	} else {
		if(!confirm(parent.lang.delconfirm)) {
			return ;
		}
		
		var ids = [];
		var idnos = [];
		for (var i = 0; i < plans.length; ++ i) {
			var value = plans[i].split(',');
			ids.push(value[0]);
			idnos.push(value[1]);
		}
		//执行删除操作
		$.myajax.showLoading(true, parent.lang.deleting);
		$.myajax.jsonGet("VehiFenceAction_delete.action?id=" + ids + "&devIdno=" + idnos, function(json,action,success){
			$.myajax.showLoading(false);
			var curpage = $("#vehiPagination").find("#hideCurrentPage").text();
			ajaxLoadMapFence(curpage);
		}, null);
	}
}