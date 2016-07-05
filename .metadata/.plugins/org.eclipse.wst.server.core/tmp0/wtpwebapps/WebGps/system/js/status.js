$(document).ready(function(){
	setTimeout(loadStatusPage, 50);
}); 

var statusPage = "device";
var firstLoad = true;

function loadStatusPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadStatusPage, 50);
	} else {
		loadLang();
		var page = getUrlParameter('type');
		if (page == null || page == "") {
			page = "device";
		}
		switchStatusPage(page);
		firstLoad = false;
	}
}

function isLoadDeviceStatus() {
	if (statusPage == "device") {
		return true;
	} else {
		return false;
	}
}

function isLoadUnregStatus() {
	if (statusPage == "unreg") {
		return true;
	} else {
		return false;
	}
}

function isLoadClientStatus() {
	if (statusPage == "client") {
		return true;
	} else {
		return false;
	}
}

function loadLang(){
	$("#statusTitle").text(parent.lang.status_title);		
	$("#liDeviceStatus").text(parent.lang.status_device);
	$("#liUnregStatus").text(parent.lang.status_unreg);
	$("#liClientStatus").text(parent.lang.status_client);
	$("#lableDeviceCount").text(parent.lang.status_labelDeviceCount);
	
	
	$("#thDeviceIndex").text(parent.lang.index);
	$("#thDeviceName").text(parent.lang.device_name);
	$("#thDeviceIDNO").text(parent.lang.IDNO);
	$("#thDeviceClient").text(parent.lang.device_client);
	$("#thDeviceJingWei").text(parent.lang.status_deviceJingWei);
	$("#thDeviceGpsTime").text(parent.lang.status_deviceGpsTime);
	$("#thDeviceAddress").text(parent.lang.status_address);
	$("#thDeviceNetwork").text(parent.lang.status_network);
	$("#thDeviceGWSvr").text(parent.lang.status_deviceGWaySvr);
	$("#thProtocol").text(parent.lang.status_deviceProtocol);
	$("#thAudioCodec").text(parent.lang.status_deviceAudioCodec);
	$("#thDiskType").text(parent.lang.status_deviceDiskType);

	$("#lableUnregCount").text(parent.lang.status_labelUnregCount);
	$("#thOperator").text(parent.lang.operator);
	$("#thUnregIndex").text(parent.lang.index);
	//$("#thUnregName").text(parent.lang.device_name);
	$("#thUnregIDNO").text(parent.lang.IDNO);
	$("#thUnregJingWei").text(parent.lang.status_deviceJingWei);
	$("#thUnregGpsTime").text(parent.lang.status_deviceGpsTime);
	$("#thUnregAddress").text(parent.lang.status_address);
	$("#thUnregNetwork").text(parent.lang.status_network);
	$("#thUnregGWSvr").text(parent.lang.status_deviceGWaySvr);
	
	$("#labelClientCount").text(parent.lang.status_labelClientCount);
	$("#thClientIndex").text(parent.lang.index);
	$("#thClientName").text(parent.lang.client_name);
	$("#thClientAccount").text(parent.lang.client_account);
	$("#thClientAddress").text(parent.lang.status_address);
	$("#thClientLoginTime").text(parent.lang.status_clientLoginTime);
	$("#thClientType").text(parent.lang.status_clientType);
	$("#thClientOwner").text(parent.lang.status_clientOwner);
	$("#tdClientUserSvr").text(parent.lang.status_clientUserSvr);
}

function switchStatusPage(page) {
	var allpages = ["device","unreg","client"];
	var allnodes = document.getElementsByName('statusMenuItem');
	for(var i=0; i<allpages.length; i += 1){
		if(page == allpages[i]){
			allnodes[i].className = "befor";
			statusPage = page;
			$("#" + allpages[i] +  "Table").show();
			$("#" + allpages[i] +  "Pagination").show();
			$("#" + allpages[i] +  "Status").show();
		}else{
			allnodes[i].className = "";
			$("#" + allpages[i] +  "Table").hide();
			$("#" + allpages[i] +  "Pagination").hide();
			$("#" + allpages[i] +  "Status").hide();
		}
	}
	$("#statusView").text(getStatusName());
	loadStatusList();
}

function getStatusName() {
	if (statusPage == "device") {
		return parent.lang.status_device;
	} else if (statusPage == "unreg") {
		return parent.lang.status_unreg;
	} else {
		return parent.lang.status_client;
	}
}

function loadStatusList() {
	if (isLoadDeviceStatus()) {
		loadDeviceStatus();
	} else if (isLoadUnregStatus()) {
		loadUnregStatus();
	} else {
		loadClientStatus();
	}
}

function fillPositionEx(row, name, jingDu, weiDu, status1, td) {
	var position = gpsGetPosition(jingDu, weiDu, status1);
	if (position.length > 2) {
		//地图位置信息有效
		var temp = "<a class=\"blue\" href=\"javascript:showMapPosition('" + name + "', '" + jingDu + "', '" + weiDu + "');\">" + position + "</a>";
		row.find(td).html(temp);
	} else {
		row.find(td).text(position);
	}
}

function showMapPosition(name, jingDu, weiDu) {
	var url = "";
	if (parent.langIsChinese()) {
		url = 'url:'+getRootPath()+'/map/map_position_baidu.html?toMap=2&isSystem=true&name=';
//		url = 'url:report/map_position_cn.html?name=';
	} else {
		url = 'url:'+getRootPath()+'/map/map_position.html?toMap=1&isSystem=true&name=';
//		url = 'url:../map/map_position_cn.html?toMap=1&isSystem=true&name=';
	}
//	if (parent.langIsChinese()) {
//		url = 'url:map_position_baidu.html?toMap=2&name=';
////		url = 'url:report/map_position_cn.html?name=';
//	} else {
//		url = 'url:map_position.html?toMap=1&name=';
//	}
	$.dialog({id:'mapposition', title:parent.lang.status_show_position,content:url + encodeURI(name) + '&jingDu=' + jingDu + '&weiDu=' + weiDu
		, min:false, max:false, lock:true});
}

function getProtocolName(protocol) {
	//#define MDVR_PROTOCOL_TYPE_WKP			1	//WKP协议
	//#define MDVR_PROTOCOL_TYPE_TTX			2	//通天星协议
	//#define MDVR_PROTOCOL_TYPE_TQ			3	//天琴协议
	//#define MDVR_PROTOCOL_TYPE_HANV			4	//HANV部标协议
	//#define MDVR_PROTOCOL_TYPE_GOOME		5	//谷米协议（兼容泰比特）
	//#define MDVR_PROTOCOL_TYPE_808			6	//808部标协议
	//#define MDVR_PROTOCOL_TYPE_RM			7	//RM部标协议
	//#define MDVR_PROTOCOL_TYPE_YD			8	//YD协议
	var proName = "";
	if (protocol == 1) {
		proName = "$$dc";
	} else if (protocol == 2) {
		proName = "$$dc-EX";
	} else if (protocol == 3) {
		proName = "TianQing";
	} else if (protocol == 4) {
		proName = "HV";
	} else if (protocol == 5) {
		proName = "GOOME";
	} else if (protocol == 6) {
		proName = "808";
	} else if (protocol == 7) {
		proName = "RM";
	} else if (protocol == 8) {
		proName = "YD";
	}
	return proName;
}

function getAudioCodecName(codec) {
//	#define PLAY_A_TYPE_UNKOWN					0
//	#define PLAY_A_TYPE_G726_40KBPS				1
//	#define PLAY_A_TYPE_ADPCM					2
//	#define PLAY_A_TYPE_G726_MEDIA_40KBPS		3
//	#define PLAY_A_TYPE_G726_MEDIA_32KBPS		4
//	#define PLAY_A_TYPE_G726_MEDIA_24KBPS		5
//	#define PLAY_A_TYPE_G726_MEDIA_16KBPS		6
//	#define PLAY_A_TYPE_G726_32KBPS				7
//	#define PLAY_A_TYPE_G726_24KBPS				8
//	#define PLAY_A_TYPE_G726_16KBPS				9
//	#define PLAY_A_TYPE_G711A					10
//	#define PLAY_A_TYPE_G711U					11
	var proName = "";
	if (codec == 1) {
		proName = "G726_40KBPS";
	} else if (codec == 2) {
		proName = "ADPCM";
	} else if (codec == 3) {
		proName = "G726_MEDIA_40KBPS";
	} else if (codec == 4) {
		proName = "G726_MEDIA_32KBPS";
	} else if (codec == 5) {
		proName = "G726_MEDIA_24KBPS";
	} else if (codec == 6) {
		proName = "G726_MEDIA_16KBPS";
	} else if (codec == 7) {
		proName = "G726_32KBPS";
	} else if (codec == 8) {
		proName = "G726_24KBPS";
	} else if (codec == 9) {
		proName = "G726_16KBPS";
	} else if (codec == 10) {
		proName = "G711A";
	} else if (codec == 11) {
		proName = "G711U";
	}
	return proName;
}

function getDiskTypeName(diskType) {
	var typeName = "";
	if (diskType == 1) {
		typeName = "SD";
	} else if (diskType == 2) {
		typeName = "HDD";
	} else if (diskType == 3) {
		typeName = "SSD";
	}
	return typeName;
}

function getNetworkName(status) {
	var netName = "";
	var network = parseIntDecimal(status.devStatus.network);
	if (network == 1) {
		netName = "WIFI(" + status.devStatus.netName + ")";
	} else if (network == 0) {
		netName = "3G";
	} else if (network == 3) {
		netName = "4G";
	}  else {
		netName = "LAN";
	}
	return netName;
}

function fillRowDevice(row, status) {
	var vehiName = "";
	if (status.devInfo != null) {
		row.find("#tdDeviceName").text(status.devInfo.userAccount.name);
		if (status.devInfo.userInfo != null) {
			row.find("#tdDeviceClient").html("<a href=\"javascript:viewClientInfo(" + status.devInfo.userInfo.id + ");\">" + status.devInfo.userInfo.userAccount.name + "</a>");
		} else {
			row.find("#tdDeviceClient").text("");
		}
		vehiName = status.devInfo.userAccount.name;
		
		if (status.devInfo.protocol != null) {
			row.find("#tdProtocol").text(getProtocolName(status.devInfo.protocol) + "-" + (status.devInfo.devSubType>>16));
		}
		if (status.devInfo.audioCodec != null) {
			row.find("#tdAudioCodec").text(getAudioCodecName(status.devInfo.audioCodec));
		}
		if (status.devInfo.diskType != null) {
			row.find("#tdDiskType").text(getDiskTypeName(status.devInfo.diskType));
		}		
	} else {
		row.find("#tdDeviceName").text("");
		row.find("#tdDeviceClient").text("");
		vehiName = status.devStatus.devIdno;
	}
	row.find("#tdDeviceIDNO").text(status.devStatus.devIdno);
	fillPositionEx(row, vehiName, status.devStatus.jingDu, status.devStatus.weiDu, status.devStatus.status1, "#tdDeviceJingWei");
	//row.find("#tdDeviceJingWei").text(status.devStatus.jingDu/1000000 + "/" + status.devStatus.weiDu/1000000, "#tdDeviceJingWei");
//	row.find("#tdDeviceGpsTime").text(dateTime2TimeString(status.devStatus.gpsTime));
	row.find("#tdDeviceGpsTime").text(status.devStatus.gpsTimeStr);
	row.find("#tdDeviceAddress").text(status.devStatus.ip + "," + status.devStatus.port);
	row.find("#tdDeviceNetwork").text(getNetworkName(status));
	if (status.svrInfo != null) {
		row.find("#tdDeviceGWSvr").text(status.svrInfo.name);
	} else {
		row.find("#tdDeviceGWSvr").text("");
	}
}

function doCheckDeviceQuery() {
	return true;
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
				row.find("#tdDeviceIndex").text(k);
				if ( (i % 2) == 1) {
					row.attr("class", "tabdata bluebg");
				}
				row.show();
				row.attr("id", "deviceTable_" + fn.devStatus.devIdno);
				row.appendTo("#deviceTable");
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#devicePagination");
		json.pagination.id = "#devicePagination";
		json.pagination.tableId = "#deviceTable";
		$.myajax.initPagination(action, json.pagination, doCheckDeviceQuery, doAjaxDeviceList);
		$("#deviceCount").text(json.pagination.totalRecords);
	}
	$.myajax.showLoading(false);
	parent.resizeFrame();
}

function loadDeviceStatus(name) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#deviceTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var pagination={currentPage:1, pageRecords:10};
	var action = "SysStatusAction_deviceStatus.action";
	if (firstLoad) {
		var name = decodeURIComponent(getUrlParameter("name"));
		if (name != null && typeof name != "undefined" && name != "") {
			action += ("?name=" + encodeURIComponent(name));
		}
	}

	$.myajax.jsonGet(action, doAjaxDeviceList, pagination);
}

function fillRowUnreg(row, status) {
	var vehiName = status.devStatus.devIdno;
//	if (status.devInfo != null) {
//		row.find("#tdUnregName").text(status.devInfo.userAccount.name);
//		vehiName = status.devInfo.userAccount.name;
//	} else {
//		row.find("#tdUnregName").text("");
//	}
	row.find("#tdUnregIDNO").text(status.devStatus.devIdno);
	fillPositionEx(row, vehiName, status.devStatus.jingDu, status.devStatus.weiDu, status.devStatus.status1, "#tdUnregJingWei");
	//row.find("#tdUnregJingWei").text(status.devStatus.jingDu/1000000 + "/" + status.devStatus.weiDu/1000000);
	row.find("#tdUnregGpsTime").text(dateTime2TimeString(status.devStatus.gpsTime));
	row.find("#tdUnregAddress").text(status.devStatus.ip + "," + status.devStatus.port);
	row.find("#tdUnregNetwork").text(getNetworkName(status));
	if (status.svrInfo != null) {
		row.find("#tdUnregGWSvr").text(status.svrInfo.name);
	} else {
		row.find("#tdUnregGWSvr").text("");
	}
}

function doAjaxUnregList(json,action,success) {
	var empty = true;
	if (success) {
		if (json.devices != null && !$.isEmptyObject(json.devices)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.devices, function (i, fn) {
				var row = $("#unregTableTemplate").clone();
				fillRowUnreg(row, fn);
				row.find("#tdUnregIndex").text(k);
				
				var temp = "<a href=\"javascript:addUnregDevice('" + fn.devStatus.devIdno + "');\"><span id=\"linkSale\">" + parent.lang.add + "</span></a>";
				row.find("#tdOperator").html(temp);
				
				if ( (i % 2) == 1) {
					row.attr("class", "tabdata bluebg");
				}
				row.show();
				row.attr("id", "unregTable_" + fn.devStatus.devIdno);
				row.appendTo("#unregTable");
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#unregPagination");
		json.pagination.id = "#unregPagination";
		json.pagination.tableId = "#unregTable";
		$.myajax.initPagination(action, json.pagination, doCheckDeviceQuery, doAjaxUnregList);
		$("#unregCount").text(json.pagination.totalRecords);
	}
	$.myajax.showLoading(false);
	parent.resizeFrame();
}

function loadUnregStatus() {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#unregTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var pagination={currentPage:1, pageRecords:10};
	var action = "SysStatusAction_deviceUnreg.action";
	$.myajax.jsonGet(action, doAjaxUnregList, pagination);
}

function fillRowClient(row, client) {
	if (client.userInfo != null) {
		row.find("#tdName").text(client.userInfo.userAccount.name);
		row.find("#tdAccount").text(client.userInfo.userAccount.account);
	} else {
		row.find("#tdName").text("");
		row.find("#tdAccount").text("");
	}
	row.find("#tdAddress").text(client.clientIP + "," + client.port);
	row.find("#tdLoginTime").text(dateTime2TimeString(client.updateTime));
	if (client.type == 1) {
		row.find("#tdType").text(parent.lang.status_clientWindow);
	} else if (client.type == 2) {
		row.find("#tdType").text(parent.lang.status_clientWeb);
	} else if (client.type == 3) {
		row.find("#tdType").text(parent.lang.status_clientIphone);
	} else {
		row.find("#tdType").text("");
	}
//	if (client.userInfo. != null) {
//		row.find("#tdOwner").text(client.userInfo.userAccount.name);
//	} else {
//		row.find("#tdOwner").text("");
//	}
	if (client.svrInfo != null) {
		row.find("#tdUserSvr").text(client.svrInfo.name);
	} else {
		row.find("#tdUserSvr").text("");
	}
}

function doCheckClientQuery() {
	return true;
}

function doAjaxClientList(json,action,success) {
	var empty = true;
	if (success) {
		if (json.clients != null && !$.isEmptyObject(json.clients)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.clients, function (i, fn) {
				var row = $("#clientTableTemplate").clone();
				fillRowClient(row, fn);
				row.find("#tdIndex").text(k);
				row.attr("id", "clientTable_" + fn.id);
				if ( (i % 2) == 1) {
					row.attr("class", "tabdata bluebg");
				}
				row.show();
				row.appendTo("#clientTable");
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#clientPagination");
		json.pagination.id = "#clientPagination";
		json.pagination.tableId = "#clientTable";
		$.myajax.initPagination(action, json.pagination, doCheckClientQuery, doAjaxClientList);
		$("#clientCount").text(json.pagination.totalRecords);
	}
	$.myajax.showLoading(false);
	parent.resizeFrame();
}

function loadClientStatus() {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#clientTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var pagination={currentPage:1, pageRecords:10};
	var action = "SysStatusAction_clientStatus.action";
	$.myajax.jsonGet(action, doAjaxClientList, pagination);
}

function viewClientInfo(id) {
	parent.switchPage("client", "clientview.html?id=" + id);
}

function addUnregDevice(idno) {
	$.dialog({id:'addunreg', title:parent.lang.device_unregAddTitle,content:'url:deviceunreg.html?idno=' + idno
		, min:false, max:false, lock:true});
}

//添加失败
function doAddFailed() {
	$.dialog({id:'addunreg'}).close();
	loadUnregStatus();
}

//添加设备成功
function doAddSuc(idno) {
	$.dialog({id:'addunreg'}).close();
	$.dialog.tips(parent.lang.addok, 1);
	loadUnregStatus();
}
