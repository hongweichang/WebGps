//搜索条件
function searchOption(singleSelect, longTime, onlySelectOne, smallTime) {
	this.selMultiVehiIdnos = [];
	this.selMultiCompanyIdnos = [];
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
	this.isCompany = false;  //是否加载的公司
	this.isUserList = false; //是否加载的用户信息
}

//获取车辆选择对象
searchOption.prototype.vehicleSelect = function() {
	var select = $('.editable-select:first');
	var instances = select.editableSelectInstances();
	return instances[0];
};

//实始化搜索车辆列表
searchOption.prototype.initVehicleQuery = function() {
	if (parent.isLoadVehiList) {
		searchOpt.fillVehicleList();
	} else {
		setTimeout(searchOpt.initVehicleQuery, 100);
	}
};
searchOption.prototype.fillVehicleList = function() {
	var vehiSelect = this.vehicleSelect();
	//设备列表
	if (parent.vehicleList !== null && parent.vehicleList.length > 0) {
		var vehicle = parent.vehicleList[0];
		if (!this.singleSelect && !this.onlySelectOne) {
			vehiSelect.addOption("*all", parent.lang.all_vehicles, true);
			vehiSelect.addOption(vehicle.id, vehicle.name, false);
		} else {
			vehiSelect.addOption(vehicle.id, vehicle.name, true);
		}
		
		var j = 1;
		for (var i = 1; i < parent.vehicleList.length && j < 100; i += 1) {
			vehicle = parent.vehicleList[i];
			vehiSelect.addOption(vehicle.id, vehicle.name, false);
			++ j;
		}
	} else {
		vehiSelect.addOption("", parent.lang.selectVehicleTip, true);
	}
};

searchOption.prototype.loadLang = function(){
	$("#labelSelecttime").text(parent.lang.labelSelecttime);
	$("#labelBegintime").text(parent.lang.labelBegintime);
	$("#labelEndtime").text(parent.lang.labelEndtime);
	$("#labelSelectVehicle").text(parent.lang.labelVehicle);
	$("#labelSelectCompany").text(parent.lang.labelCompany);
	$("#labelSelectUser").text(parent.lang.labelUser);
	$(".btnQuery span").text(parent.lang.query);
	if (!this.singleSelect) {
		$(".btnSelVehicle span").text(parent.lang.btnSelectVehicle);
		$(".btnSelCompany span").text(parent.lang.btnSelectCompany);
	}
	$(".btnExport span").text(parent.lang.exportExcel);
	$(".btnExportCSV span").text(parent.lang.exportCSV);
	$(".btnExportPDF span").text(parent.lang.exportPDF);
	$(".btnGraph span").text(parent.lang.graph);
	$(".toImage span").text(parent.lang.toImage);
	$(".downloadImage span").text(parent.lang.downloadImage);
	$(".resetImage span").text(parent.lang.resetImage);
};

//初始化搜索选项
searchOption.prototype.initSearchOption = function() {
	this.initSearchTimeOption();
	if (!this.singleSelect) {
		//配置搜索事件
		$(".btnSelVehicle").click(selectMultiVehicle);
		$(".btnSelCompany").click(selectMultiCompany);
	}
	if(typeof setDefaultSelectVehi == 'function') {
		setDefaultSelectVehi();
	}
	if(typeof setDefaultSelectUser == 'function') {
		setDefaultSelectUser();
	}
};

//初始化时间选择选项
searchOption.prototype.initSearchTimeOption = function() {
	if (this.longTime) {
		//搜索时间
		if(parent.longbtime){
			$("#begintime").val(parent.longbtime);
		}else{
			parent.longbtime = dateCurDateBeginString();
			$("#begintime").val(dateCurDateBeginString());
		}
		if(parent.longetime){
			$("#endtime").val(parent.longetime);
		}else{
			parent.longetime = dateCurDateEndString();
			$("#endtime").val(dateCurDateEndString());
		}
		$("#begintime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss',onpicked: function() {
			parent.longbtime = $("#begintime").val();
		}}) });
		$("#endtime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss',onpicked: function() {
			parent.longetime = $("#endtime").val();
		}}) });
	} else {
		//搜索时间
		if(this.smallTime){
			if(parent.monthbtime){
				$("#begintime").val(parent.monthbtime);
			}else{
				parent.monthbtime = dateFormat2MonthString(monthGetLastMonth());
				$("#begintime").val(dateFormat2MonthString(monthGetLastMonth()));
			}
			if(parent.monthetime){
				$("#endtime").val(parent.monthetime);
			}else{
				parent.monthetime = dateCurrentMonthString();
				$("#endtime").val(dateCurrentMonthString());
			}
			$("#begintime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM',maxDate:'%y-{%M}',onpicked: function() {
				parent.monthbtime = $("#begintime").val();
			}}); });
			$("#endtime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM',maxDate:'%y-{%M}',onpicked: function() {
				parent.monthetime = $("#endtime").val();
			}}); });
		}else{
			if(parent.daybtime){
				$("#begintime").val(parent.daybtime);
			}else{
				parent.daybtime = dateFormat2DateString(dateGetLastMonth());
				$("#begintime").val(dateFormat2DateString(dateGetLastMonth()));
			}
			if(parent.dayetime){
				$("#endtime").val(parent.dayetime);
			}else{
				parent.dayetime = dateCurrentDateString();
				$("#endtime").val(dateCurrentDateString());
			}
			$("#begintime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d',onpicked: function() {
				parent.daybtime = $("#begintime").val();
			}}) });
			$("#endtime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d',onpicked: function() {
				parent.dayetime = $("#endtime").val();
			}}) });
		}
	}
};

searchOption.prototype.checkQueryDate = function(begindate, enddate) {
	if(this.smallTime) {
		if (!dateIsValidMonthDate(begindate)) {
			alert(parent.lang.errQueryTimeFormat);
			return false;
		}
		
		if (!dateIsValidMonthDate(enddate)) {
			alert(parent.lang.errQueryTimeFormat);
			return false;
		}
		if (dateCompareStrMonthDate(begindate, enddate) > 0) {
			alert(parent.lang.errQueryTimeRange);
			return false;
		}
	}else if (this.longTime) {
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
searchOption.prototype.getQueryVehiList = function() {
	var vehiSelect = this.vehicleSelect();
	
	var vehiName = $.trim(vehiSelect.text.val());
	var vehicles = new Array();
	if (vehiName == parent.lang.all_vehicles) {
		//为选择所有车辆信息
		if (parent.vehicleList != null && parent.vehicleList.length > 0) {
			for (var i = 0; i < parent.vehicleList.length; i += 1) {
				vehicles.push(parent.vehicleList[i].id);
			}
		}
	} else if (vehiName == parent.lang.report_multiVehicle) {
		//为弹框选择多个车辆信息
		vehicles = this.selMultiVehiIdnos;
	} else {
		//跟据车辆号判断是否为选中单个车辆信息
		if (parent.vehicleList != null && parent.vehicleList.length > 0) {
			for (var i = 0; i < parent.vehicleList.length; i += 1) {
				if(parent.vehicleList[i].name == vehiName) {
					vehicles.push(parent.vehicleList[i].id);
					break;
				}
			}
		}
	}
	return vehicles;
};

//获取单个设备
searchOption.prototype.getQueryVehicle = function() {
	var vehiSelect = this.vehicleSelect();
	var vehiName = $.trim(vehiSelect.text.val());
	var vehicle = null;
	//跟据车辆号判断是否为选中单个车辆信息
	if (parent.vehicleList != null && parent.vehicleList.length > 0) {
		for (var i = 0; i < parent.vehicleList.length; i += 1) {
			if(parent.vehicleList[i].name == vehiName) {
				vehicle = parent.vehicleList[i].id;
				break;
			}
		}
	}
	return vehicle;
};

searchOption.prototype.disableForm = function(disable) {
	diableInput("#btnQuery", disable, true);
	diableInput("#vehicleList", disable, true);
	diableInput("#begintime", disable, true);
	diableInput("#endtime", disable, true);
	if (!this.singleSelect) {
		diableInput("#btnSelVehicle", disable, true);
		diableInput("#btnSelCompany", disable, true);
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
		if(this.smallTime) {
			if (!dateCompareStrMonthRange(data.begindate, data.enddate, 3)) {
				alert(parent.lang.report_timeRangOver3Month);
				return null;
			}
		}else if (this.longTime) {
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
		if(this.smallTime) {
			if (!dateCompareStrMonthRange(data.begindate, data.enddate, 3)) {
				alert(parent.lang.report_timeRangOver3Month);
				return null;
			}
		}else if (this.longTime) {
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
		if(this.isCompany) {
			data.company = this.getQueryCompany();
			if (data.company == null) {
				alert(parent.lang.report_selectCompanyNullErr);
				return ;
			}
		}else {
			data.vehicle = this.getQueryVehicle();
			if (data.vehicle == null) {
				alert(parent.lang.report_selectVehiNullErr);
				return ;
			}
		}
		
	} else {
		//判断设备
		if(this.isCompany) {
			data.companyList = this.getQueryCompanyList();
			if (data.companyList.length <= 0) {
				alert(parent.lang.report_selectCompanyNullErr);
				return null;
			}
		}else if(this.isUserList) {
			data.userList = this.getQueryUserList();
			if (data.userList == null) {
				alert(parent.lang.report_selectUserNullErr);
				return ;
			}
		}else {
			data.vehicleList = this.getQueryVehiList();
			if (data.vehicleList.length <= 0) {
				alert(parent.lang.report_selectVehiNullErr);
				return null;
			}
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

searchOption.prototype.checkParkTimeEx = function(id) {
	var parkTime = parseIntDecimal($.trim($(id).val()));
	if (parkTime > 9999) {
		alert(parent.lang.report_park_timeMax9999);
		$(id).focus();
		return false;
	}
	return true;
};

function selectMultiVehicle() {
	$.dialog({id:'selectvehi', title:parent.lang.selectVehicleTitle
		, content:'url:StatisticalReports/select_vehicle.html?vehicles=' + searchOpt.selMultiVehiIdnos.toString() + "&onlySelectOne=" + searchOpt.onlySelectOne
		, min:false, max:false, lock:true});
}

function doSelectVehicle(vehicles) {
	$.dialog({id:'selectvehi'}).close();
	searchOpt.selMultiVehiIdnos = decodeURIComponent(vehicles);
	var vehiSelect = searchOpt.vehicleSelect();
	if (vehicles.length > 0) {
		if (vehicles.length > 1) {
			vehiSelect.text.val(parent.lang.report_multiVehicle);
		} else {
			vehiSelect.text.val(vehicles[0]);
		}
	} else {
		vehiSelect.text.val(parent.lang.selectVehicleTip);
	}
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
		url = 'url:'+getRootPath()+'/map/map_position_baidu.html?toMap=2&isSystem=808gps&name=';
//		url = 'url:report/map_position_cn.html?name=';
	} else {
		url = 'url:'+getRootPath()+'/map/map_position.html?toMap=1&isSystem=808gps&name=';
	}
	
	$.dialog({id:'mapposition', title:parent.lang.report_show_position,content:url + encodeURI(name) + '&jingDu=' + jingDu + '&weiDu=' + weiDu
		, min:false, max:false, lock:true});
}

//加载公司
searchOption.prototype.initCompanyQuery = function() {
	if (parent.isLoadVehiGroupList) {
		this.isCompany = true;
		searchOpt.fillCompanyList();
	} else {
		setTimeout(searchOpt.initCompanyQuery, 100);
	}
};
searchOption.prototype.fillCompanyList = function() {
	var vehiSelect = this.vehicleSelect();
	//公司列表
	if (parent.companys !== null && parent.companys.length > 0) {
		var company = parent.companys[0];
		if (!this.singleSelect && !this.onlySelectOne) {
			vehiSelect.addOption("*all", parent.lang.all_companies, true);
			vehiSelect.addOption(company.id, company.name, false);
		} else {
			vehiSelect.addOption(company.id, company.name, true);
		}
		
		var j = 1;
		for (var i = 1; i < parent.companys.length && j < 100; i += 1) {
			company = parent.companys[i];
			vehiSelect.addOption(company.id, company.name, false);
			++ j;
		}
	} else {
		vehiSelect.addOption("", parent.lang.selectCompanyTip, true);
	}
};
//获取查询的公司分组
searchOption.prototype.getQueryCompanyList = function() {
	var companySelect = this.vehicleSelect();
	
	var companyName = $.trim(companySelect.text.val());
	var companies = new Array();
	if (companyName == parent.lang.all_companies) {
		//为选择所有公司信息
		if (parent.companys != null && parent.companys.length > 0) {
			for (var i = 0; i < parent.companys.length; i += 1) {
				companies.push(parent.companys[i].id);
			}
		}
	} else if (companyName == parent.lang.report_multiCompany) {
		//为弹框选择多个公司信息
		companies = this.selMultiCompanyIdnos;
	} else {
		//跟据车辆号判断是否为选中单个公司信息
		if (parent.companys != null && parent.companys.length > 0) {
			for (var i = 0; i < parent.companys.length; i += 1) {
				if(parent.companys[i].name == companyName) {
					companies.push(parent.companys[i].id);
					break;
				}
			}
		}
	}
	return companies;
};
//获取单个公司
searchOption.prototype.getQueryCompany = function() {
	var companySelect = this.vehicleSelect();
	var companyName = $.trim(companySelect.text.val());
	var company = null;
	//跟据车辆号判断是否为选中单个公司信息
	if (parent.companys != null && parent.companys.length > 0) {
		for (var i = 0; i < parent.companys.length; i += 1) {
			if(parent.companys[i].name == companyName) {
				company = parent.companys[i].id;
				break;
			}
		}
	}
	return company;
};
function selectMultiCompany() {
	$.dialog({id:'selectcompany', title:parent.lang.selectCompanyTitle
		, content:'url:StatisticalReports/select_company.html?companys=' + searchOpt.selMultiCompanyIdnos.toString() + "&onlySelectOne=" + searchOpt.onlySelectOne
		, min:false, max:false, lock:true});
}
function doSelectCompany(companyIds) {
	$.dialog({id:'selectcompany'}).close();
	searchOpt.selMultiCompanyIdnos = companyIds;
	var companySelect = searchOpt.vehicleSelect();
	if (companyIds.length > 0) {
		if (companyIds.length > 1) {
			companySelect.text.val(parent.lang.report_multiCompany);
		} else {
			for(var i = 0 ; i < parent.companys.length; i++) {
				if(parent.companys[i].id == companyIds[0]) {
					companySelect.text.val(parent.companys[i].name);
				}
			}
		}
	} else {
		companySelect.text.val(parent.lang.selectCompanyTip);
	}
}

//加载用户
searchOption.prototype.initUserQuery = function() {
	if (parent.isLoadUserList) {
		this.isUserList = true;
		searchOpt.fillUserList();
	} else {
		setTimeout(searchOpt.initUserQuery, 100);
	}
};
searchOption.prototype.fillUserList = function() {
	var vehiSelect = this.vehicleSelect();
	//公司列表
	if (parent.users !== null && parent.users.length > 0) {
		var user = parent.users[0];
		if (!this.singleSelect && !this.onlySelectOne) {
			vehiSelect.addOption("*all", parent.lang.all_users, true);
			vehiSelect.addOption(user.id, user.name, false);
		} else {
			vehiSelect.addOption(user.id, user.name, true);
		}
		
		var j = 1;
		for (var i = 1; i < parent.users.length && j < 100; i += 1) {
			user = parent.users[i];
			vehiSelect.addOption(user.id, user.name, false);
			++ j;
		}
	} else {
		vehiSelect.addOption("", parent.lang.selectUserTip, true);
	}
};
//获取查询的公司分组
searchOption.prototype.getQueryUserList = function() {
	var userSelect = this.vehicleSelect();
	
	var userName = $.trim(userSelect.text.val());
	var userList = new Array();
	if (userName == parent.lang.all_users) {
		//为选择所有公司信息
		userList.push(0);
	} else {
		//跟据车辆号判断是否为选中单个公司信息
		if (parent.users != null && parent.users.length > 0) {
			for (var i = 0; i < parent.users.length; i += 1) {
				if(parent.users[i].name == userName) {
					userList.push(parent.users[i].id);
					break;
				}
			}
		}
	}
	return userList;
};

//获取查询数据
searchOption.prototype.getQueryDataNew = function(isWeekRange) {
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
		if(this.smallTime) {
			if (!dateCompareStrMonthRange(data.begindate, data.enddate, 3)) {
				alert(parent.lang.report_timeRangOver3Month);
				return null;
			}
		}else if (this.longTime) {
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
}


function buttonQueryOrExport() {
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: '', name : '', pclass : 'btnQuery',
				bgcolor : 'gray', hide : false}]
		]
	});
	
	$('.language').flexPanel({
		TabsModel : [
		     {display: '',title: '',name: '',pclass: 'btnExport'},
		     {display: '',title: '',name: '',pclass: 'btnExportCSV'},
		     {display: '',title: '',name: '',pclass: 'btnExportPDF'}
		  ]
	});
	$('.switch-span').text(parent.lang.exportReport);
	$('.switch ul').width($('.switch-div').width());
	$('.switch-div').on('click',function() {
		if($('.switch ul').width() == 0) {
			$('.switch ul').width($('.switch-div').width());
		}
		$('.switch ul').addClass('show');
		$(".switch ul").mouseleave(function(){
			$(this).removeClass('show');
		});
	});
	
	$('.language li').each(function(i){
		$(this).on('click',function(){
			toggleMyClass('.language li', this, 'current');
			$('.switch ul').removeClass('show');
		});
	});
	
	$('body').click(function(event) {
		var obj = event.srcElement ? event.srcElement : event.target;
		if(obj != $('.switch-div')[0] && obj != $('.switch-span')[0] && obj != $('.switch-icon')[0]) {
			$('.switch ul').removeClass('show');	
		}
	});
}

function setDefaultSelectVehi() {
	var rtype = getUrlParameter('rtype');
	if(parent.defaultVehi != null && (rtype == 1 || rtype == 2)){
		if(parent.defaultVehi == '0') {
			if(rtype != 1) {
				$('#combox-vehiIdnos').val(parent.lang.all_vehicles);
				$('#hidden-vehiIdnos').val(getNewArrayByArray(parent.vehicleList,'name').toString());
			}
		}else {
			selIds = parent.defaultVehi;
			if(parent.defaultVehi != null && parent.defaultVehi.split(',').length > 0) {
				if(parent.defaultVehi.split(',').length > 1) {
					if(rtype != 1) {
						$('#combox-vehiIdnos').val(parent.lang.isSelected + parent.defaultVehi.split(',').length);
						$('#hidden-vehiIdnos').val(parent.defaultVehi);
					}
				}else {
					$('#combox-vehiIdnos').val(parent.defaultVehi);
					$('#hidden-vehiIdnos').val(parent.defaultVehi);
				}
			}
		}
	}
}

function setDefaultSelectUser() {
	if(parent.defaultUser != null){
		if(parent.defaultUser.id == '0') {
			$('#combox-userId').val(parent.lang.all_users);
			$('#hidden-userId').val(parent.defaultUser.id);
		}else {
			selIds = parent.defaultUser.id;
			$('#combox-userId').val(parent.defaultUser.name);
			$('#hidden-userId').val(parent.defaultUser.id);
		}
	}
}

function selectTime(index, type){
	if(index == 0){
		if(type == 2){
			$("#begintime").val(dateCurrentDateString());
			$("#endtime").val(dateCurrentDateString());
		}else{
			$('#begintime').val(dateCurDateBeginString());
			$('#endtime').val(dateCurDateEndString());
		}
		$('#begintime').get(0).disabled = false;
		$('#endtime').get(0).disabled = false;
	}else if(index == 1){
		if(type == 2){
			$('#begintime').val(dateCurrentDateString());
			$('#endtime').val(dateCurrentDateString());
		}else{
			$('#begintime').val(dateCurDateBeginString());
			$('#endtime').val(dateCurDateEndString());
		}
		$('#begintime').get(0).disabled = true;
		$('#endtime').get(0).disabled = true;
	}else if(index == 2){
		if(type == 2){
			$('#begintime').val(dateYarDateString());
			$('#endtime').val(dateYarDateString());
		}else{
			$('#begintime').val(dateYarDateBeginString());
			$('#endtime').val(dateYarDateEndString());
		}
		$('#begintime').get(0).disabled = true;
		$('#endtime').get(0).disabled = true;
	}else if(index == 3){
		if(type == 2){
			$('#begintime').val(dateYarDateString());
			$('#endtime').val(dateCurrentDateString());
		}else if(type == 3){
			$('#begintime').val(dateYarStaDateBeginString());
			$('#endtime').val(dateYarDateEndString());
		}else{
			$('#begintime').val(dateYarDateBeginString());
			$('#endtime').val(dateCurDateEndString());
		}
		$('#begintime').get(0).disabled = true;
		$('#endtime').get(0).disabled = true;
	}else if(index == 4){
		if(type == 2){
			$('#begintime').val(dateWeekDateString());
			$('#endtime').val(dateCurrentDateString());
		}else if(type == 3){
			$('#begintime').val(dateYarWeekDateBeginString());
			$('#endtime').val(dateYarDateEndString());
		}else{
			$('#begintime').val(dateWeekDateBeginString());
			$('#endtime').val(dateCurDateEndString());
		}
		$('#begintime').get(0).disabled = true;
		$('#endtime').get(0).disabled = true;
	}else if(index == 5){
		if(type == 2){
			$('#begintime').val(dateMonthDateString());
			$('#endtime').val(dateCurrentDateString());
		}else if(type == 3){
			$('#begintime').val(dateYarMonthDateBeginString2());
			$('#endtime').val(dateYarDateEndString());
		}else{
			$('#begintime').val(dateMonthDateBeginString2());
			$('#endtime').val(dateCurDateEndString());
		}
		$('#begintime').get(0).disabled = true;
		$('#endtime').get(0).disabled = true;
	}else if(index == 6){
		$('#begintime').val(dateThreeBeginString());
		$('#endtime').val(dateCurDateEndString());
		$('#begintime').get(0).disabled = true;
		$('#endtime').get(0).disabled = true;
	}
}



function getSelectTime(type) {
	var distances = [];
	if(type == 1){
		distances.push({id:0,name:parent.lang.customTime});
		distances.push({id:1,name:parent.lang.today});
		distances.push({id:2,name:parent.lang.yesterday});
		distances.push({id:3,name:parent.lang.last2Days});
		distances.push({id:4,name:parent.lang.last7Days});
		distances.push({id:5,name:parent.lang.month});
	}else if(type == 2){
		distances.push({id:0,name:parent.lang.customTime});
		distances.push({id:1,name:parent.lang.today});
		distances.push({id:2,name:parent.lang.yesterday});
		distances.push({id:3,name:parent.lang.last2Days});
		distances.push({id:4,name:parent.lang.last7Days});
	}else if(type == 3){
		distances.push({id:0,name:parent.lang.customTime});
		distances.push({id:2,name:parent.lang.yesterday});
		distances.push({id:3,name:parent.lang.last2Days});
		distances.push({id:4,name:parent.lang.last7Days});
		distances.push({id:5,name:parent.lang.month});
	}else if(type == 4){
		distances.push({id:0,name:parent.lang.customTime});
		distances.push({id:1,name:parent.lang.today});
		distances.push({id:2,name:parent.lang.yesterday});
		distances.push({id:3,name:parent.lang.last2Days});
		distances.push({id:4,name:parent.lang.last7Days});
		distances.push({id:5,name:parent.lang.month});
		distances.push({id:6,name:parent.lang.three_month});
	}
	return distances;
}