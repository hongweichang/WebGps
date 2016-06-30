//搜索条件
function searchOption(singleSelect, longTime, onlySelectOne, smallTime) {
	this.selMultiDevIdnos = [];
	this.requireParam = {};
	this.singleSelect = singleSelect;	//true允许选择单个车辆，false表示可以选择多个车辆
	this.longTime = longTime;
	this.onlySelectOne = false;
	if (typeof onlySelectOne != "undefined") {
		this.onlySelectOne = onlySelectOne;
	}
	this.smallTime = false;
	if (typeof smallTime != "undefined") {
		this.smallTime = smallTime;
	}
}

//获取设备选择对象
searchOption.prototype.deviceSelect = function() {
	var select = $('.editable-select:first');
	var instances = select.editableSelectInstances();
	return instances[0];
};

//实始化搜索设备列表
searchOption.prototype.initDeviceQuery = function() {
	if (parent.isLoadVehiList) {
		searchOpt.fillDeviceList();
	} else {
		setTimeout(searchOpt.initDeviceQuery, 100);
	}
};

searchOption.prototype.fillDeviceList = function() {
	var devSelect = this.deviceSelect();
	//设备列表
	if (parent.vehicleList !== null && parent.vehicleList.length > 0) {
		var vehicle = parent.vehicleList[0];
		if (!this.singleSelect && !this.onlySelectOne) {
			devSelect.addOption("*all", parent.lang.allVehicle, true);
			devSelect.addOption(vehicle.idno, vehicle.userAccount.name, false);
		} else {
			devSelect.addOption(vehicle.idno, vehicle.userAccount.name, true);
		}
		
		var j = 1;
		for (var i = 1; i < parent.vehicleList.length && j < 100; i += 1) {
			vehicle = parent.vehicleList[i];
			devSelect.addOption(vehicle.idno, vehicle.userAccount.name, false);
			++ j;
		}
	} else {
		devSelect.addOption("", parent.lang.selectVehicleTip, true);
	}
};

searchOption.prototype.loadLang = function(){
	$("#labelBegintime").text(parent.lang.labelBegintime);
	$("#labelEndtime").text(parent.lang.labelEndtime);
	$("#labelSelectVehicle").text(parent.lang.labelVehicle);
	$("#spanBtnQuery").text(parent.lang.query);
	if (!this.singleSelect) {
		$("#spanBtnSelVehicle").text(parent.lang.btnSelectVehicle);
	}
	$("#spanBtnExport").text(parent.lang.exportExcel);
	$("#spanBtnExportCsv").text(parent.lang.exportCsv);
	$("#spanBtnExportPdf").text(parent.lang.exportPdf);
	$("#spanGraph").text(parent.lang.graph);
	$(".toImage").text(parent.lang.toImage);
	$(".downloadImage").text(parent.lang.downloadImage);
	$(".resetImage").text(parent.lang.resetImage);
};

//初始化搜索选项
searchOption.prototype.initSearchOption = function() {
	this.initSearchTimeOption();
	if (!this.singleSelect) {
		//配置搜索事件
		$("#btnSelVehicle").click(selectMultiVehicle);
	}
};

//初始化时间选择选项
searchOption.prototype.initSearchTimeOption = function() {
	if (this.longTime) {
		//搜索时间
		$("#begintime").val(dateCurDateBeginString());
		$("#endtime").val(dateCurrentTimeString());
		$("#begintime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}) });
		$("#endtime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}) });
	} else {
		//搜索时间
			if(this.smallTime){
			$("#begintime").val(dateFormat2MonthString(monthGetLastMonth()));
			$("#endtime").val(dateCurrentMonthString());
			$("#begintime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM',maxDate:'%y-{%M}'}); });
			$("#endtime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM',maxDate:'%y-{%M}'}); });
		}else{
			$("#begintime").val(dateFormat2DateString(dateGetLastMonth()));
			$("#endtime").val(dateCurrentDateString());
			$("#begintime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'}) });
			$("#endtime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'}) });
		}
	}
};

searchOption.prototype.checkQueryDate = function(begindate, enddate) {
	if (this.longTime) {
		if (!dateIsValidDateTime(begindate)) {
			alert(parent.lang.errQueryTimeFormat);
			return false;
		}
		
		if (!dateIsValidDateTime(enddate)) {
			alert(parent.lang.errQueryTimeFormat);
			return false;
		}
		
		if (dateCompareStrLongTime(begindate, enddate) > 0) {
			alert(parent.lang.errQueryTimeRange);
			return false;
		}
	} else {
		if (!dateIsValidDate(begindate)) {
			alert(parent.lang.errQueryTimeFormat);
			return false;
		}
		
		if (!dateIsValidDate(enddate)) {
			alert(parent.lang.errQueryTimeFormat);
			return false;
		}
		
		if (dateCompareStrDate(begindate, enddate) > 0) {
			alert(parent.lang.errQueryTimeRange);
			return false;
		}
	}
	
	return true;	
}

//获取查询的分组
searchOption.prototype.getQueryDevList = function() {
	var devSelect = this.deviceSelect();
	
	var devName = $.trim(devSelect.text.val());
	var devices = new Array();
	if (devName == parent.lang.allVehicle) {
		//为选择所有车辆信息
		if (parent.vehicleList != null && parent.vehicleList.length > 0) {
			for (var i = 0; i < parent.vehicleList.length; i += 1) {
				devices.push(parent.vehicleList[i].idno);
			}
		}
	} else if (devName == parent.lang.report_multiVehicle) {
		//为弹框选择多个车辆信息
		devices = this.selMultiDevIdnos;
	} else {
		//跟据车辆号判断是否为选中单个车辆信息
		if (parent.vehicleList != null && parent.vehicleList.length > 0) {
			for (var i = 0; i < parent.vehicleList.length; i += 1) {
				if(parent.vehicleList[i].userAccount.name == devName) {
					devices.push(parent.vehicleList[i].idno);
					break;
				}
			}
		}
	}
	return devices;
};

//获取单个设备
searchOption.prototype.getQueryDevice = function() {
	var devSelect = this.deviceSelect();
	var devName = $.trim(devSelect.text.val());
	var device = null
	//跟据车辆号判断是否为选中单个车辆信息
	if (parent.vehicleList != null && parent.vehicleList.length > 0) {
		for (var i = 0; i < parent.vehicleList.length; i += 1) {
			if(parent.vehicleList[i].userAccount.name == devName) {
				device = parent.vehicleList[i].idno;
				break;
			}
		}
	}
	return device;
};

searchOption.prototype.disableForm = function(disable) {
	diableInput("#btnQuery", disable, true);
	diableInput("#deviceList", disable, true);
	diableInput("#begintime", disable, true);
	diableInput("#endtime", disable, true);
	if (!this.singleSelect) {
		diableInput("#btnSelVehicle", disable, true);
	}
};

//获取查询数据
searchOption.prototype.getQueryTime = function(isWeekRange) {
	var data = {};
	//判断时间
	data.begindate = $("#begintime").val();
	data.enddate = $("#endtime").val();
	if (!this.checkQueryDate(data.begindate, data.enddate)) {
		return null;
	}
	
	if (isWeekRange) {
		if (this.longTime) {
			if (!dateCompareStrLongTimeRange(data.begindate, data.enddate, 7)) {
				alert(parent.lang.report_timeRangOver7Day);
				return null;
			}
		} else {
			if (!dateCompareStrDateRange(data.begindate, data.enddate, 7)) {
				alert(parent.lang.report_timeRangOver7Day);
				return null;
			}
		}
	} else {
		if (this.longTime) {
			if (!dateCompareStrLongTimeRange(data.begindate, data.enddate, 90)) {
				alert(parent.lang.report_timeRangOver90Day);
				return null;
			} 
		} else {
			if (!dateCompareStrDateRange(data.begindate, data.enddate, 90)) {
				alert(parent.lang.report_timeRangOver90Day);
				return null;
			}
		}
	}
	
	return data;
};

//获取查询数据
searchOption.prototype.getQueryData = function(isWeekRange) {
	var data = {};
	//判断时间
	data.begindate = $("#begintime").val();
	data.enddate = $("#endtime").val();
	if (!this.checkQueryDate(data.begindate, data.enddate)) {
		return null;
	}
	
	if (isWeekRange) {
		if (this.longTime) {
			if (!dateCompareStrLongTimeRange(data.begindate, data.enddate, 7)) {
				alert(parent.lang.report_timeRangOver7Day);
				return null;
			}
		} else {
			if (!dateCompareStrDateRange(data.begindate, data.enddate, 7)) {
				alert(parent.lang.report_timeRangOver7Day);
				return null;
			}
		}
	} else {
		if (this.longTime) {
			if (!dateCompareStrLongTimeRange(data.begindate, data.enddate, 90)) {
				alert(parent.lang.report_timeRangOver90Day);
				return null;
			} 
		} else {
			if (!dateCompareStrDateRange(data.begindate, data.enddate, 90)) {
				alert(parent.lang.report_timeRangOver90Day);
				return null;
			}
		}
	}
	
	if (this.singleSelect || this.onlySelectOne) {
		//判断设备
		data.device = this.getQueryDevice();
		if (data.device == null) {
			alert(parent.lang.report_selectVehiNullErr);
			return ;
		}
	} else {
		//判断设备
		data.deviceList = this.getQueryDevList();
		if (data.deviceList.length <= 0) {
			alert(parent.lang.report_selectVehiNullErr);
			return null;
		}
	}
	
	return data;
};

searchOption.prototype.checkParkTime = function(id) {
	var parkTime = parseIntDecimal($.trim($(id).val()));
	if (parkTime < 180) {
		alert(parent.lang.report_park_timeLess180);
		$(id).focus();
		return false;
	}
	if (parkTime > 9999) {
		alert(parent.lang.report_park_timeMax9999);
		$(id).focus();
		return false;
	}
	return true;
};

function selectMultiVehicle() {
	$.dialog({id:'selectvehi', title:parent.lang.selectVehicleTitle
		, content:'url:report/select_vehicle.html?devices=' + searchOpt.selMultiDevIdnos.toString() + "&onlySelectOne=" + searchOpt.onlySelectOne
		, min:false, max:false, lock:true});
}

function doSelectVehicle(vehicles) {
	searchOpt.selMultiDevIdnos = [];
	if(vehicles != null) {
		for(var i = 0; i < vehicles.length; i++) {
			searchOpt.selMultiDevIdnos.push(vehicles[i]);
		}
	}
	//searchOpt.selMultiDevIdnos = vehicles;
	var devSelect = searchOpt.deviceSelect();
	if (vehicles.length > 0) {
		if (vehicles.length > 1) {
			devSelect.text.val(parent.lang.report_multiVehicle);
		} else {
			devSelect.text.val(gpsGetVehicleName(vehicles[0]));
		}
	} else {
		devSelect.text.val(parent.lang.selectVehicleTip);
	}
	$.dialog({id:'selectvehi'}).close();
}

function fillPosition(row, name, jingDu, weiDu, status1, td) {
	fillPositionEx(row, name, jingDu, weiDu, status1, "#tdPosition");
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

function fillPositionExDx(row, name, jingDu, weiDu, status1, td, id) {
	var position = gpsGetPosition(jingDu, weiDu, status1);
	if(jingDu==0 || weiDu==0){
		position = "";
	}
	if (position.length > 2) {
		var temp = "<a id="+id+" class=\"blue\" href=\"javascript:showMapPosition('" + name + "', '" + jingDu + "', '" + weiDu + "');\">" + position + "</a>";
		row.find(td).html(temp);
	} else {
		row.find(td).text(position);
	}
}

function showMapPosition(name, jingDu, weiDu) {
	var url = "";
	if (parent.langIsChinese()) {
		url = 'url:'+getRootPath()+'/map/map_position_baidu.html?toMap=2&isSystem=false&name=';
//		url = 'url:report/map_position_cn.html?name=';
	} else {
		url = 'url:'+getRootPath()+'/map/map_position.html?toMap=1&isSystem=false&name=';
	}
	
	$.dialog({id:'mapposition', title:parent.lang.report_show_position,content:url + encodeURI(name) + '&jingDu=' + jingDu + '&weiDu=' + weiDu
		, min:false, max:false, lock:true});
}

/**
 * GPS获取的经纬度转化为百度经纬度（coords=10,23;12,21;23,..）
 * @param jingDu
 * @param weiDu
 */
function GpsToBaiduGps(jingDu,weiDu) { 
	var xyUrl = "http://api.map.baidu.com/geoconv/v1/?coords="+gpsGetJingWeiDu(jingDu)+","+gpsGetJingWeiDu(weiDu)+"&from=1&to=5&ak=A5XwmfizKyOvbYyvmxDLTZYi";
	$.ajax({ type: "GET",
		url: xyUrl,
		dataType: "jsonp", 
		success: function(data) {
			if (data.status == 0) {
				var px = data.result;
				jingDu = px[0].x;
				weiDu = px[0].y;
			}
		},error:function(data) {
		}	
	});
}

/**
 * 经纬度转为地址  coordtype=bd09ll（百度经纬度坐标）、gcj02ll（国测局经纬度坐标）、wgs84ll（ GPS经纬度） 
 * @param jingDu
 * @param weiDu
 * @returns {String}
 */
function GpsToAddress(jingDu,weiDu){
	var ajaxUrl = "http://api.map.baidu.com/geocoder/v2/?ak=A5XwmfizKyOvbYyvmxDLTZYi&output=json&pois=0&location=" + gpsGetJingWeiDu(weiDu) + "," + gpsGetJingWeiDu(jingDu) + "&coordtype=wgs84ll&callback=?";
	var address = "";
	$.ajax({ type: "post",
		url: ajaxUrl,
		dataType: "jsonp",
		async: false,
		success: function (data) {
			if (data.status == 0) {
				address = data.result.formatted_address;
			}
		},error: function(){
		}
	});
	return address;
}

function fillPositionAddress(i,arr,table,type){
	if(i<arr.length){
		if(arr[i]!=null){
			if(arr[i].startJingDu=="0" || arr[i].startWeiDu=="0" || arr[i].endJingDu=="0" || arr[i].endWeiDu=="0"){
				
			}else{
				if(type == "begin" || type == null){
					fillPositionExDxAjax(arr[i].startJingDu,arr[i].startWeiDu,table,"#beginPos"+i+"");
				}
				if(type == "end" || type == null){
					fillPositionExDxAjax(arr[i].endJingDu,arr[i].endWeiDu,table,"#endPos"+i+"");
				}
			}
		}
		fillPositionAddress(i+1,arr,table,type);
	}
}

function fillPositionExDxAjax(jingDu,weiDu,parentId,id){
	var address = "";
	ajaxUrl = "http://api.map.baidu.com/geocoder/v2/?ak=A5XwmfizKyOvbYyvmxDLTZYi&output=json&pois=0&location=" + weiDu + "," + jingDu + "&coordtype=wgs84ll&callback=?";
	$.ajax({ type: "post",
		url: ajaxUrl,
		dataType: "jsonp",
		async: true,
		success: function (data) {
			if (data.status == 0) {
				address = data.result.formatted_address;
				$(parentId).find(id).text(address);
			}else{
			}
		},error: function(){
		}
	});
}