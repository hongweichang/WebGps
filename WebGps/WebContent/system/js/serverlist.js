function loadServerLang(){
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.server_name);
	$("#thIDNO").text(parent.lang.IDNO);
	$("#thStation").text(parent.lang.server_downStation);
	$("#thStatus").text(parent.lang.status);
	$("#thLanIp").text(parent.lang.server_lanip);
	$("#thDeviceIp").text(parent.lang.server_deviceIp);
	$("#thDeviceIp2").text(parent.lang.server_deviceIp2);
	$("#thDevicePort").text(parent.lang.server_devicePort);
	$("#thClientIp").text(parent.lang.server_clientIp);
	$("#thClientIp2").text(parent.lang.server_clientIp2);
	$("#thClientPort").text(parent.lang.server_clientPort);
	$("#thOperator").text(parent.lang.operator);
	$("#thRelation").text(parent.lang.server_relation);
	$("#btnAddServer").text(parent.lang.server_add);
}

function isStationValid() {
	if (getServerType() == "7") {
		return true;
	} else {
		return false;
	}
}

function isStorageValid() {
	if (getServerType() == "5") {
		return true;
	} else {
		return false;
	}
}

function ajaxLoadServerInfo(curpage) {
	if(getServerType() == 7){
		$("#thDeviceIp").text(parent.lang.server_wifiDevice);
	}else{
		$("#thDeviceIp").text(parent.lang.server_deviceIp);
	}
	//清除之前加载的数据
	$.myajax.cleanTableContent("#tableTop");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof curpage !== "undefined" && curpage !== "") {
		temp = parseIntDecimal(curpage);
	}
	var pagination={currentPage:temp, pageRecords:10};
	$.myajax.jsonGet("SysServerAction_serverList.action?svrtype=" + getServerType()
		, doAjaxServerList, pagination);
}

function doCheckQuery() {
	return true;
}

function getStationName(stations, area) {
	var name = "";
	for (var i = 0; i < stations.length; i += 1) {
		if (stations[i].id == area) {
			name = stations[i].name;
			break;
		}
	}
	return name;
}

function doAjaxServerList(json,action,success) {
	var empty = true;
	if (success) {
		if (!$.isEmptyObject(json.servers)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.servers, function (i, fn) {
				var row = $("#tableTemplate").clone();
				
				if (!isStationValid()) {
					row.find("#tdStation").hide();
				} else {
					row.find("#tdStation").text(getStationName(json.stations, fn.area));
				}
				if (!isStorageValid()) {
					row.find("#tdRelation").hide();
				} else {
					var temp = "";
					temp = temp + "<a href=\"javascript:addStoRelation('" + fn.idno + "');\">" + parent.lang.add + "</a> ";
					temp = temp + "<a href=\"javascript:editStoRelation('" + fn.idno + "');\">" + parent.lang.edit + "</a>";
					row.find("#tdRelation").html(temp);
				}
				
				fillRowServer(row, fn);
				row.find("#tdIndex").text(k);
				if (fn.svrSession != null) {
					row.find("#tdStatus").text(parent.lang.online);
				} else {
					row.find("#tdStatus").text(parent.lang.offline);
				}
				var temp = "";
				temp = temp + "<a href=\"javascript:editServerInfo('" + fn.idno + "');\">" + parent.lang.edit + "</a> ";
				temp = temp + "<a href=\"javascript:delServerInfo('" + fn.idno + "');\">" + parent.lang.del + "</a>";
				
				row.find("#tdOperator").html(temp);
				
				append2TableEx("#tableTop", k, row, fn.idno);
				
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#pagination");
		json.pagination.id = "#pagination";
		json.pagination.tableId = "#tableTop";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxServerList);
	}
	$.myajax.showLoading(false);
	parent.resizeFrame();
}

function addStoRelation(idno) {
	$.dialog({id:'storageRelation', title:parent.lang.server_addStorageRelation, content:'url:storagerelation.html?type=add&idno=' + idno
		, min:false, max:false, lock:true});
}

function editStoRelation(idno) {
	$.dialog({id:'storageRelation', title:parent.lang.server_editStorageRelation, content:'url:storagerelation.html?type=edit&idno=' + idno
		, min:false, max:false, lock:true});
}

function doStoRelationExit() {
	$.dialog({id:'storageRelation'}).close();
}

function delServerInfo(idno) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet("SysServerAction_delete.action?idno=" + idno, function(json,action,success){
		$.myajax.showLoading(false);
		var curpage = $("#hideCurrentPage").text();
		ajaxLoadServerInfo(curpage);
	}, null);
}

function fillRowServer(row, svr) {
	var temp = "<a href=\"javascript:editServerInfo('" + svr.idno + "');\">" + svr.name + "</a>";
	row.find("#tdName").html(temp);
	row.find("#tdIDNO").html("<a href=\"javascript:editServerInfo('" + svr.idno + "');\">" + svr.idno + "</a>");
	//row.find("#tdName").text(svr.name);
	//row.find("#tdIDNO").text(svr.idno);
	row.find("#tdLanIp").text(svr.lanip);
	row.find("#tdDeviceIp").text(svr.deviceIp);
	row.find("#tdDeviceIp2").text(svr.deviceIp2);
	row.find("#tdDevicePort").text(svr.devicePort);
	row.find("#tdClientIp").text(svr.clientIp);
	row.find("#tdClientIp2").text(svr.clientIp2);
	row.find("#tdClientPort").text(svr.clientPort);
}

function editServerInfo(idno) {
	$.dialog({id:'editserver', title:parent.lang.server_edit,content:'url:serverinfo.html?idno=' + idno + '&svrtype=' + getServerType()
		, min:false, max:false, lock:true});
}

function doEditSuc(idno, data) {
	$.dialog({id:'editserver'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//查找对应的行数据
	$("#tableTop").find("tr").each(function(){
			if (this.id == ("tableTop_" + idno)) {
				fillRowServer($(this), data);
				if (isStationValid()) {
					$(this).find("#tdStation").text(data.stationName);
				}
			}
		}
	);	
}

function addServerInfo() {
	$.dialog({id:'addserver', title:parent.lang.server_add,content:'url:serverinfo.html?svrtype=' + getServerType()
		, min:false, max:false, lock:true});
}

function doAddSuc() {
	$.dialog({id:'addserver'}).close();
	$.dialog.tips(parent.lang.addok, 1);
	ajaxLoadServerInfo(0);
}