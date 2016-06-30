function loadStationLang(){
	$("#thStationIndex").text(parent.lang.index);
	$("#thStationName").text(parent.lang.server_name);
	$("#thStationPosition").text(parent.lang.server_stationPosition);
	$("#thStationSsid").text(parent.lang.server_stationSsid);
	$("#thStationType").text(parent.lang.server_stationType);
	$("#thStationOperator").text(parent.lang.operator);
	$("#downStationName").text(parent.lang.server_downStation);
	$("#btnAddDownStation").text(parent.lang.server_addStation);
}

function ajaxLoadStation(curpage) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#stationTableTop");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof curpage !== "undefined" && curpage !== "") {
		temp = parseIntDecimal(curpage);
	}
	var pagination={currentPage:temp, pageRecords:10};
	$.myajax.jsonGet("SysServerAction_stationList.action", doAjaxStationList, pagination);
}

function doCheckQuery() {
	return true;
}

function doAjaxStationList(json,action,success) {
	var empty = true;
	if (success) {
		if (!$.isEmptyObject(json.stations)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.stations, function (i, fn) {
				var row = $("#stationTableTemplate").clone();
				fillRowStation(row, fn);
				row.find("#tdStationIndex").text(k);
				
				var temp = "<a href=\"javascript:editDownStation('" + fn.id + "');\">" + parent.lang.edit + "</a> "
					 + "<a href=\"javascript:delDownStation('" + fn.id + "');\">" + parent.lang.del + "</a>";
				row.find("#tdStationOperator").html(temp);
				
				append2Table("#stationTableTop", k, row);
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#stationPagination");
		json.pagination.id = "#stationPagination";
		json.pagination.tableId = "#stationTableTop";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxStationList);
	}
	$.myajax.showLoading(false);
	parent.resizeFrame();
}

function delDownStation(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet("SysServerAction_deleteStation.action?id=" + id, function(json,action,success){
		$.myajax.showLoading(false);
		var curpage = $("#hideCurrentPage").text();
		ajaxLoadStation(curpage);
	}, null);
}

function fillRowStation(row, fn) {
	var temp = "<a href=\"javascript:editDownStation('" + fn.id + "');\">" + fn.name + "</a>";
	row.find("#tdStationName").html(temp);
	row.find("#tdStationPosition").html(fn.position);
	row.find("#tdStationSsid").html(fn.ssid);
	if (fn.type == 1) {
		row.find("#tdStationType").html(parent.lang.server_stationByPosition);
	} else {
		row.find("#tdStationType").html(parent.lang.server_stationBySsid);
	}
}

function editDownStation(id) {
	$.dialog({id:'editstation', title:parent.lang.server_stationEdit,content:'url:serverdownstation.html?id=' + id
		, min:false, max:false, lock:true});
}

function doEditStationSuc(id, data) {
	$.dialog({id:'editstation'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//查找对应的行数据
	$("#stationTableTop").find("tr").each(function(){
			if (this.id == ("tableTop_" + id)) {
				fillRowStation($(this), data);
			}
		}
	);	
}

function addDownStation() {
	$.dialog({id:'addstation', title:parent.lang.server_addStation,content:'url:serverdownstation.html'
		, min:false, max:false, lock:true});
}

function doAddStationSuc() {
	$.dialog({id:'addstation'}).close();
	$.dialog.tips(parent.lang.addok, 1);
	ajaxLoadStation(0);
}