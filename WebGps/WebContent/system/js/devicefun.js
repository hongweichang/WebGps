function initDeviceHead(){
	$("#thDeviceSelectAll").text(parent.lang.selectAll);
	$("#thDeviceIndex").text(parent.lang.index);
	$("#thDeviceIDNO").text(parent.lang.IDNO);
	$("#thDeviceName").text(parent.lang.device_name);
	$("#thDeviceDevType").text(parent.lang.device_type);
	$("#thDeviceChnCount").text(parent.lang.device_chnCount);
	$("#thDeviceSimCard").text(parent.lang.device_simCard);
	//$("#thDeviceDateProduct").text(parent.lang.device_dateProduct);
	$("#thDevicePayEnable").text(parent.lang.device_payEnable);
	$("#thDevicePayBegin").text(parent.lang.device_payBegin);
	//$("#thDevicePayPeriod").text(parent.lang.device_payPeriod);
	$("#thDevicePayMonth").text(parent.lang.device_payMonth);
	$("#thDevicePayStatus").text(parent.lang.device_payStatus);
	$("#thDevicePayOverDay").text(parent.lang.device_payOverDay);
	$("#thDeviceClient").text(parent.lang.device_client);
	$("#thDeviceOperator").text(parent.lang.operator);
}

function getQueryCondition(clientId, name, expireDay) {
	var action = "";
	var hasQuery = false;
	if (typeof clientId != "undefined" && clientId !== null && clientId !== "") {
		action += ("?clientId=" + clientId);
		deviceClientId = clientId;
		hasQuery = true;
	} else {
		deviceClientId = "";
	}
	if (typeof name != "undefined" && name !== null && name !== "") {
		if (hasQuery) {
			action += ("&name=" + encodeURIComponent(name));
		} else {
			action += ("?name=" + encodeURIComponent(name));
		}
		hasQuery = true;
	}
	if (typeof expireDay != "undefined" && expireDay !== null && expireDay !== "") {
		deviceExpireDay = expireDay;
		if (hasQuery) {
			action += ("&expireDay=" + expireDay);
		} else {
			action += ("?expireDay=" + expireDay);
		}
		hasQuery = true;
	} else {
		deviceExpireDay = "";
	}
	
	var order = $('#isSequence').attr('data-id');
	if (typeof order != "undefined" && order !== null && order !== "") {
		if (hasQuery) {
			action += ("&order=" + order);
		} else {
			action += ("?order=" + order);
		}
	}
	
	return action;
}

var deviceClientId;
var deviceExpireDay;
var deviceOrder;
function loadDeviceList(page, clientId, name, expireDay) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#deviceTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof page !== "undefined" && page !== "") {
		temp = parseIntDecimal(page);
	}
	var pagination={currentPage:temp, pageRecords:10};
	var action = "SysDeviceAction_list.action" + getQueryCondition(clientId, name, expireDay);
	$.myajax.jsonGet(action, doAjaxDeviceList, pagination);
}

//是否处在查看客户信息界面中
function isDeviceClientViewPage() {
	if (typeof deviceClientId != "undefined" && deviceClientId !== "" && deviceClientId !== 0) {
		return true;
	} else {
		return false;
	}
}

function doCheckDeviceQuery() {
	return true;
}

function fillRowPayment(row, device) {
	if (device.payEnable != null && device.payEnable == 1) {
		row.find("#tdPayEnable").text(parent.lang.yes);
	} else {
		row.find("#tdPayEnable").text(parent.lang.no);
	}
	if (device.payBegin != null) {
	//	row.find("#tdPayBegin").text(dateTime2DateString(device.payBegin));
		row.find("#tdPayBegin").text(device.payBeginStr);
	} else {
		row.find("#tdPayBegin").text("");
	}
	if (device.payMonth != null) {
		row.find("#tdPayMonth").text(device.payMonth);
	} else {
		row.find("#tdPayMonth").text("0");
	}
	if (device.payBegin != null ) {
		var day = getPayStatus(dateTime2DateString(device.payBegin), device.payMonth, device.payDelayDay);
		if (day > 0 && device.payEnable) {
			row.find("#tdPayStatus").text(parent.lang.device_payStatusAbnormal);
		} else {
			row.find("#tdPayStatus").text(parent.lang.device_payStatusNormal);
		}
	} else {
		row.find("#payStatus").text("");
	}
}

function fillRowDevice(row, device) {
	row.find("#selectDeviceIdList").val(device.idno);
//	row.find("#tdName").html("<a href=\"javascript:void(0);\" onclick=\"editDeviceInfo(" + device.idno + ");return false;\">" + device.userAccount.name + "</a>");
	row.find("#tdName").html("<a href=\"javascript:editDeviceInfo('" + device.idno + "');\">" + device.userAccount.name + "</a>");
	row.find("#tdIDNO").html("<a href=\"javascript:editDeviceInfo('" + device.idno + "');\">" + device.idno + "</a>");
	//row.find("#tdName").text(device.userAccount.name);
	//row.find("#tdIDNO").text(device.idno);
	if (device.devType == 1) {	//车载DVR
		row.find("#tdDevType").text(parent.lang.terminalVehicle);
	} else if (device.devType == 2) {					//手机终端
		row.find("#tdDevType").text(parent.lang.terminalMobile);
	} else if (device.devType == 3){					//手机终端
		row.find("#tdDevType").text(parent.lang.terminalDvr);
	}else { //平板Pad终端
		row.find("#tdDevType").text(parent.lang.terminalPad);
	}
	row.find("#tdChnCount").text(device.chnCount);
	row.find("#tdSimCard").text(device.simCard);
	fillRowPayment(row, device);
	/*
	if (device.payPeriod != null) {
		if (device.payPeriod == 6) {
			row.find("#tdPayPeriod").text(parent.lang.device_pay6month);
		} else if (device.payPeriod == 12) {
			row.find("#tdPayPeriod").text(parent.lang.device_pay12month);
		} else if (device.payPeriod == 18) {
			row.find("#tdPayPeriod").text(parent.lang.device_pay18month);
		} else if (device.payPeriod == 24) {
			row.find("#tdPayPeriod").text(parent.lang.device_pay24month);
		}
	} else {
		row.find("#tdPayPeriod").text("");
	}*/
}

function doAjaxDeviceList(json,action,success) {
	var empty = true;
	if (success) {
		if (json.devices != null && !$.isEmptyObject(json.devices)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.devices, function (i, fn) {
				var row = $("#deviceTableTemplate").clone();
				fillRowDevice(row, fn);
				row.find("#tdIndex").text(k);
				//row.find("#tdDateProduct").text(dateTime2DateString(fn.dateProduct));
				if (typeof fn.userInfo != "undefined" && fn.userInfo !== null) {
					row.find("#tdClient").html("<a href=\"javascript:viewClientInfo(" + fn.userInfo.id + ");\">" + fn.userInfo.userAccount.name + "</a>");
			//		row.find("#tdClient").text(device.userInfo.userAccount.name);
				} else {
					row.find("#tdClient").text("");
				}
				var temp = "<a href=\"javascript:saleDeviceInfo('" + fn.idno + "');\"><span id=\"linkSale\">" + parent.lang.device_sale + "</span></a> "
					+ "<a href=\"javascript:editDeviceInfo('" + fn.idno + "');\">" + parent.lang.edit + "</a> "
					+ "<a href=\"javascript:delDeviceInfo('" + fn.idno + "');\">" + parent.lang.del + "</a>";
				row.find("#tdOperator").html(temp);
				row.attr("id", "deviceTable_" + fn.idno);
				if ( (i % 2) == 1) {
					row.attr("class", "tabdata bluebg");
				}
				row.show();
				row.appendTo("#deviceTable");
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#devicePagination");
		json.pagination.id = "#devicePagination";
		json.pagination.tableId = "#deviceTable";
		$.myajax.initPagination(action, json.pagination, doCheckDeviceQuery, doAjaxDeviceList);
		//更新统计信息
		if (!isDeviceClientViewPage()) {
			//设备管理界面
			$("#manageCount").text(json.manageCount);
			$("#deviceTotal").text(json.deviceTotal);
			$("#storeCount").text(json.storeCount);
/*			if (json.enableTracker) {
				$("#hrefExportMobile").show();
			} else {
				$("#hrefExportMobile").hide();
			}*/
		} else {
			$("#deviceCount").text(json.deviceCount);
			$("#clientCount").text(json.clientCount);
		}
	}
	$.myajax.showLoading(false);
	parent.resizeFrame();
}

function addDevice() {
	$.dialog({id:'adddevice', title:parent.lang.device_add,content:'url:deviceinfo.html'
		, min:false, max:false, lock:true});
}

function doAddSuc() {
	$.dialog({id:'adddevice'}).close();
	$.dialog.tips(parent.lang.addok, 1);
	//切换到所有终端列表
	if (devicePage != "all" || devicePage != "store") {
		switchDevPage("all");
	}
	deviceExpireDay = "";
	deviceClientId = "";
	loadDeviceList(0, deviceClientId, null, deviceExpireDay);
}

function editDeviceInfo(idno) {
	$.dialog({id:'editdevice', title:parent.lang.device_edit,content:'url:deviceinfo.html?idno=' + idno
		, min:false, max:false, lock:true});
}

function doAddExit() {
	$.dialog({id:'adddevice'}).close();
}

function doEditExit() {
	$.dialog({id:'editdevice'}).close();
}

function doEditSuc(idno, data) {
	$.dialog({id:'editdevice'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//查找对应的行数据
	$("#deviceTable").find("tr").each(function(){
			if (this.id == ("deviceTable_" + idno)) {
				$(this).find("#tdDateProduct").text(data.dateProduct);
				fillRowDevice($(this), data);
			}
		}
	);	
}

function delDeviceInfo(idno) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet("SysDeviceAction_delete.action?idno=" + idno, function(json,action,success){
		$.myajax.showLoading(false);
		var curpage = $("#devicePagination").find("#hideCurrentPage").text();
		loadDeviceList(curpage, deviceClientId, decodeURIComponent(getUrlParameter("name")), deviceExpireDay);
	}, null);
}

function batchAddDevice() {
	$.dialog({id:'adddevice', title:parent.lang.device_batchaddTitle,content:'url:devicebatch.html'
		, min:false, max:false, lock:true});
}

function doBatchAddSuc() {
	doAddSuc();
}

function delSelDevice() {
	var devices = getSelectItem("selectDeviceIdList");
	if (devices.length <= 0) {
		alert(parent.lang.errSelectedRequired);
	} else {
		if(!confirm(parent.lang.delconfirm)) {
			return ;
		}
		
		//执行删除操作
		$.myajax.showLoading(true, parent.lang.deleting);
		$.myajax.jsonGet("SysDeviceAction_delete.action?idno=" + devices, function(json,action,success){
			$.myajax.showLoading(false);
			var curpage = $("#devicePagination").find("#hideCurrentPage").text();
			loadDeviceList(curpage, deviceClientId, decodeURIComponent(getUrlParameter("name")), deviceExpireDay);
		}, null);
	}
}

function saleDeviceInfo(idno) {
	$.dialog({id:'saledevice', title:parent.lang.device_saleTitle,content:'url:devicesale.html?idno=' + idno
		, min:false, max:false, lock:true});
}

function doSaleSuccess(idno, clientid, clientname, data) {
	$.dialog.tips(parent.lang.device_saleok, 1);
	if (!isDeviceClientViewPage()) {
		var arrIdno = idno.split(',');
		//查找对应的行数据
		$("#deviceTable").find("tr").each(function(){
				for (var i = 0; i < arrIdno.length; i+=1) {
					if (this.id == ("deviceTable_" + arrIdno[i])) {
						$(this).find("#tdClient").html("<a href=\"javascript:viewClientInfo(" + clientid + ");\">" + clientname + "</a>");
						fillRowPayment($(this), data);
						//$(this).find("#tdClient").text(clientname);
						break;
					}
				}
			}
		);	
	} else {
		//在查看客户信息界面中如果重新销售设备，则刷新车辆列表
		var curpage = $("#devicePagination").find("#hideCurrentPage").text();
		loadDeviceList(curpage, deviceClientId, null, deviceExpireDay);
	}
	$.dialog({id:'saledevice'}).close();
}

function saleSelDevice() {
	var devices = getSelectItem("selectDeviceIdList");
	if (devices.length <= 0) {
		alert(parent.lang.errSelectedRequired);
	} else {
		if (devices.length == 1) {
			saleDeviceInfo(devices[0]);
		} else {
			var devnames = [];
			//获取车辆名称
			$("#deviceTable").find("tr").each(function(){
				for (var i = 0; i < devices.length; ++ i) {
					if (this.id == ("deviceTable_" + devices[i])) {
						devnames.push($(this).find("#tdName").text() + "(" + devices[i] + ")");
						break;
					}
				}
			});
			
			$.dialog({id:'saledevice', title:parent.lang.device_saleTitle,content:'url:deviceselsale.html?idno=' + devices + "&devnames=" + encodeURI(devnames)
				, min:false, max:false, lock:true});
		}
	}
}

function viewClientInfo(id) {
	parent.switchPage("client", "clientview.html?id=" + id);
//	parent.localUrl("clientview.html?id=" + id);
}

function initDeviceType() {
	$("#devType").append("<option value='1'>" + parent.lang.terminalVehicle + "</option>");
	//$("#devType").append("<option value='2'>" + parent.lang.terminalMobile + "</option>");
	//从Cookie取设备类型
	var devType = GetCookie("system_deviceType");
	if (devType != null && devType != "") {
	} else	{
		devType = "1";	
		//$("#devType").val("1");
	}
	setTimeout(function () {	
		$("#devType").val(devType);}, 10);
	$("#devType").change(deviceTypeChange);
	deviceTypeChange();
}

function initDeviceTypeEx() {
	//$("#devType").append("<option value='1'>" + parent.lang.terminalVehicle + "</option>");
}

function getCookieDevType() {
	var devType = GetCookie("system_deviceType");
	if (devType != null && devType != "") {
	} else	{
		devType = "1";	
		//$("#devType").val("1");
	}
	return devType;
}

function deviceTypeChange() {
	var devType = $("#devType").val();
	if (devType == "1") {
//		$("#chnCount").val("4");
	} else {
//		$("#chnCount").val("0");
	}
}

function saveDeviceType() {
	SetCookie("system_deviceType", $.trim($("#devType").val()));
}

function exportAllExcel() {
	exportExcel("all");
}

function exportVehicleExcel() {
	exportExcel("mdvr");
}

function exportMobileExcel() {
	exportExcel("mobile");
}

function exportExcel(type) {
	var action = "";
	var hasQuery = false;
	if (typeof deviceClientId != "undefined" && deviceClientId !== null && deviceClientId !== "") {
		action += ("?clientId=" + deviceClientId);
		hasQuery = true;
	} 
	var name = decodeURIComponent(getUrlParameter("name"));
	if (typeof name != "undefined" && name !== null && name !== "") {
		if (hasQuery) {
			action += ("&name=" + encodeURIComponent(name));
		} else {
			action += ("?name=" + encodeURIComponent(name));
		}
		hasQuery = true;
	}
	if (typeof deviceExpireDay != "undefined" && deviceExpireDay !== null && deviceExpireDay !== "") {
		if (hasQuery) {
			action += ("&expireDay=" + deviceExpireDay);
		} else {
			action += ("?expireDay=" + deviceExpireDay);
		}
		hasQuery = true;
	}
	
	var order = $('#isSequence').attr('data-id');
	if (typeof order != "undefined" && order !== null && order !== "") {
		if (hasQuery) {
			action += ("&order=" + order);
		} else {
			action += ("?order=" + order);
		}
	}
	
	if (action != "") {
		action += ("&type=" + type);
	} else {
		action = "?type=" + type;
	}
	
	document.reportForm.action = "SysDeviceAction_excel.action" + action;
	document.reportForm.submit(); 
}
	
function importExcel() {
	$.dialog({id:'importdevice', title:parent.lang.device_importExcel,content:'url:deviceimport.html'
		, min:false, max:false, lock:true});
}

function doImportSuccess() {
	$.dialog({id:'importdevice'}).close();
	$.dialog.tips(parent.lang.importok, 1);
	loadDeviceList(0, deviceClientId, null, deviceExpireDay);
}

function sequenceDevice(obj) {
	var curpage = $("#devicePagination").find("#hideCurrentPage").text();
	if($(obj).attr('data-id') == '1') {
		$(obj).attr('data-id', 2);
		$('#isSequence').text(parent.lang.system_seq_date_asc);
		loadDeviceList(curpage, deviceClientId, decodeURIComponent(getUrlParameter("name")), deviceExpireDay);
	}else {
		$(obj).attr('data-id', 1);
		$('#isSequence').text(parent.lang.system_seq_date_desc);
		loadDeviceList(curpage, deviceClientId, decodeURIComponent(getUrlParameter("name")), deviceExpireDay);
	}
}