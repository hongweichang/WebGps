$(document).ready(function(){
	setTimeout(loadDevicePage, 50);
}); 

var devicePage = "all";	//当前页面，所有设备或者库存设备
function loadDevicePage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadDevicePage, 50);
	} else {
		$("#hrefExportMobile").hide();
		loadLang();
		var page = getUrlParameter("type");
		if (typeof page == "undefined" || page === null ||  page === "") {
			page = "all";
		} 
		switchDevicePage(page, decodeURIComponent(getUrlParameter("name")), "");
	}
}

function loadLang(){
	$("#deviceTitle").text(parent.lang.device_title);
	$("#deviceType").text(parent.lang.all);
	$("#deviceAll").text(parent.lang.device_all);
	$("#deviceStore").text(parent.lang.device_store);
	$("#7dayExpire").text(parent.lang.device_7dayexpire);
	$("#30dayExpire").text(parent.lang.device_30dayexpire);
	$("#expire").text(parent.lang.device_expire);
	$("#labelManageCount").text(parent.lang.home_deviceManageCount);
	$("#labelDeviceTotal").text(parent.lang.home_deviceTotalCount);
	$("#labelStoreCount").text(parent.lang.home_deviceStoreCount);
	$("#addDevice").text(parent.lang.add);
	$("#batchAdd").text(parent.lang.device_batchadd);
	$("#delSelDevice").text(parent.lang.device_delSelDevice);
	$("#saleSelDevice").text(parent.lang.device_saleSelDevice);
	$("#exportVehicleExcel").text(parent.lang.device_exportVehicleExcel);
	$("#exportMobileExcel").text(parent.lang.device_exportMobileExcel);
	$("#exportAllExcel").text(parent.lang.device_exportExcel);
	$("#importExcel").text(parent.lang.device_importExcel);
	$('#isSequenceTip').text(parent.lang.system_show_rule);
	$('#isSequence').text(parent.lang.system_seq_date_desc);
	
	updatePageName();
	initDeviceHead();
}

function getQueryString() {
	if (devicePage == 'store') {
		return 0;		//查询库存的设备，客户编号为0
	} else if(devicePage == "7dayexpire") {
		name = parent.lang.device_7dayexpire;
	} else if(devicePage == "30dayexpire") {
		name = parent.lang.device_30dayexpire;
	} else if(devicePage == "expire") {
		name = parent.lang.device_expire;
	} else {
		return null;
	}
}

function switchDevicePage(page, name, expireDay) {
//	var allpages = ["all","store"];
//	var allpages = ["all","store","7dayexpire","expire"];
	switchDevPage(page);
	updatePageName();
	loadDeviceList(1, getQueryString(), name, expireDay);
}

function switchDevPage(page) {
//	var allpages = ["all","store"];
//	var allpages = ["all","store","7dayexpire","expire"];
	var allpages = ["all","store","7dayexpire","30dayexpire","expire"];
	var allnodes = document.getElementsByName('devMenuItem');
	for(var i=0; i<allpages.length; i+=1){
		if(page == allpages[i]){
			allnodes[i].className = "befor";
			devicePage = page;
		}else{
			allnodes[i].className = "";
		}
	}
	updatePageName();
}

function getPageName() {
	var name = parent.lang.unkown;
	if (devicePage == "all") {
		name = parent.lang.device_all;
	} else if(devicePage == "store") {
		name = parent.lang.device_store;
	} else if(devicePage == "7dayexpire") {
		name = parent.lang.device_7dayexpire;
	} else if(devicePage == "30dayexpire") {
		name = parent.lang.device_30dayexpire;
	} else if(devicePage == "expire") {
		name = parent.lang.device_expire;
	} 
	return name;
}

function updatePageName() {
	$("#deviceType").text(getPageName());
}