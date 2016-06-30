var vehiIdno = null;//车牌号
var lang_local = null; //语言
var lang = null;  //语言类
var jsession = null; //会话号
var toMap = 2;  //百度地图
$(document).ready(function(){
	lang_local = getUrlParameter("lang");
	
	if (lang_local == "en") {
		lang = new langEn();
	}else {
		lang = new langZhCn();
	}
	
	loadLang();
	
	$(".startTime").val(dateCurDateBeginString());
	$(".startTime").click(function(){WdatePicker({lang: langWdatePickerCurLoacl(),dateFmt: 'yyyy-MM-dd HH:mm:ss'});});
	$(".endTime").val(dateCurDateEndString());
	$(".endTime").click(function(){WdatePicker({lang: langWdatePickerCurLoacl(),dateFmt: 'yyyy-MM-dd HH:mm:ss'});});
	
	loadTrackTable();
	
	if(!langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	
	jsession = getUrlParameter("jsession");
	
	//如果传入的会话号为空，则用户登录获取会话号
	if(!jsession) {
		userLogin();
	}
});
      	
function loadLang() {
	document.title = lang.trackList;
	$('#queryTitle').text(lang.trackQuery);
	$('#vehicleTitle').text(lang.vehiIdnoTip);
	$('#startTimeTitle').text(lang.startTimeTip);
	$('#endTimeTitle').text(lang.endTimeTip);
	$('#queryBtn').text(lang.query);
}

/**
*  初始化轨迹列表
**/
function loadTrackTable() {
	$('#trackTable').flexigrid({
		url: 'http://'+ window.location.host+'/StandardApiAction_queryTrackDetail.action',
		dataType: 'json',
		colModel : [
			{display: lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: lang.vehiIdno, name : 'vehiIdno', width : 200, sortable : false, align: 'center'},
			{display: lang.gpsTime, name : 'gpsTime', width : 140, sortable : false, align: 'center', hide: false},
			{display: lang.speed, name : 'speed', width : 140, sortable : false, align: 'center', hide: false},
			{display: lang.licheng, name : 'licheng', width : 140, sortable : false, align: 'center'},
			{display: lang.position, name : 'position', width : 250, sortable : false, align: 'center'}
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		usepager: true,
		autoload: false,
		useRp: true,
		title: false,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: true,
		width: 'auto',
		onSubmit: queryTrack,
		height: 'auto'
	});
	
	loadTableWidth(fixHeight);
	$("#trackTable").flexSetFillCellFun(fillTrackTable);
}

function fixHeight() {
	$('#trackTable').flexFixHeight();
}

/**
* 用户登录
**/
function userLogin() {
	var account = getUrlParameter("account");
	var password = getUrlParameter("password");
 	var param = [];
 	param.push({name: 'account', value: account});
 	param.push({name: 'password', value: password});
 	
 	this.doAjaxSubmit('http://'+ window.location.host+'/StandardApiAction_loginEx.action', param, function(json, action, success) {
 		if(success) {
 			jsession = json.jsession;
 		}else {
 			alert(lang.loginError);
 		}
 	});
}

/**
* 查询轨迹
* type 如果为空，则为按钮查询
**/
function queryTrack(type) {
 	this.vehiIdno = $.trim($('.vehiIdno').val());
 	if(this.vehiIdno == '') {
 		$('.vehiIdno').focus();
 		return;
 	}
 	var begintime = $.trim($('.startTime').val());
 	if(begintime == '') {
 		$('.startTime').focus();
 		return;
 	}
 	var endtime = $.trim($('.endTime').val());
 	if(endtime == '') {
 		$('.endTime').focus();
 		return;
 	}
 	if (!dateIsValidDateTime(begintime)) {
		alert(parent.lang.errQueryTimeFormat);
		return false;
	}
 	if (!dateIsValidDateTime(endtime)) {
		alert(parent.lang.errQueryTimeFormat);
		return false;
	}
 	if (dateCompareStrLongTime(begintime, endtime) > 0) {
		alert(parent.lang.errQueryTimeRange);
		return false;
	}
 	if (!dateCompareStrLongTimeRange(begintime, endtime, 7)) {
		alert(parent.lang.report_timeRangOver7Day);
		return null;
	}
 	
 	var param = [];
 	param.push({name: 'jsession', value: jsession});
 	param.push({name: 'vehiIdno', value: this.vehiIdno});
 	param.push({name: 'begintime', value: begintime});
 	param.push({name: 'endtime', value: endtime});
 	param.push({name: 'toMap', value: toMap});
 	
 	var param_ = $('#trackTable').flexGetParams();
 	param.push({name: 'pageRecords', value: param_.rp});
 	if(type) {
 		param.push({name: 'currentPage', value: param_.newp});
 	}else {
 		param.push({name: 'currentPage', value: 1});
 	}
	$('.pReload', '.flexigrid').addClass('loading');
	doAjaxSubmit('http://'+ window.location.host+'/StandardApiAction_queryTrackDetail.action', param, function(json, action, success) {
 		if(success) {
 			json.infos = json.tracks;
 			$('#trackTable').flexAddData(json, false);
 		}else {
 			$('.pReload', '.flexigrid').removeClass('loading');
 			if(json.result == 5) {
				alert(lang.jsessionError);
			}else if(json.result == 7) {
				alert(lang.errRequireParam);
			}else if(json.result == 8) {
				alert(lang.vehicleNotOperate);
			}else if(json.result == 9) {
				alert(lang.errQueryTimeRange);
			}else if(json.result == 10) {
				alert(lang.errQueryTimeThanRange);
			}else {
				alert(lang.errQueryFailed);
			}
 		}
 	});
}

function fillTrackTable(p, row, idx, index) {
	var name = p.colModel[idx].name;
	var ret = "";
	if(name == 'vehiIdno') { 
		ret = vehiIdno;
	} else if(name == 'gpsTime') {
		if(isGpsValid(row['s1'])) {
			ret = row.gt;
		}else {
			ret = lang.invalid;
		}
	} else if(name == 'speed') {
		if(isGpsValid(row['s1'])) {
			ret = getSpeedString(row.sp, row['s1']);
		}else {
			ret = lang.invalid;
		}
	} else if(name == 'licheng') { 
		ret = getLiChengString(row.lc);
	} else if(name == 'position') { 
		if(isGpsValid(row['s1'])) {
			ret = row.po;
		}else {
			ret = lang.gpsUnvalid;
		}
	} 
	return ret;
}

//获取速度
function getSpeed(speed, status1){
	if (isGpsValid(status1)) {
		if (speed != null) {
			if(isNaN(speed / 10)) {
				return (speed / 10).toFixed(2);
			}
			return speed / 10;
		} else {
			return "0";
		}
	} else {
		return "0";
	}
}

//获取设备速度字符串
function getSpeedString(speed, status1){
	return getSpeed(speed, status1) + " " + lang.KmPerHour;
}

//获取设备里程
function getLiCheng(liCheng) {	
	if (liCheng !== null && liCheng >= 0) {
		return liCheng / 1000;
	} else {
		return "0";
	}
}

//获取设备里程字符串
function getLiChengString(liCheng) {	
	return getLiCheng(liCheng) + ' ' + lang.km;
}

//是否定位状态
function isGpsValid(status1){
	if (status1 != null) {
		var valid = (status1&0x01);
		if (valid == 1) {
			return true;
		}
	}
	return false;
};



//提交ajax
function doAjaxSubmit(action, params, callback) {
	$.ajax({
		type: 'POST',
		url: action,
		data: params,
		cache:false,/*禁用浏览器缓存*/
		dataType: 'json',
		success: function (json) {
			if(json.result == 0){
				callback.call(this, json, action, true);
			} else {
				callback.call(this, json, action, false);
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			try {
				if (p.onError) p.onError(XMLHttpRequest, textStatus, errorThrown);
			} catch (e) {}
			callback.call(this, null, action, false);
		}
	});
}

/**
 * 设置界面宽度
 */
function loadTableWidth(callBackFun) {
	var width = $(window).width();
	var height = $(window).height();
	//不能少于1024
	if(width < 1024) {
		width = 1024;
	}
	if(getTop($('.queryGraph-render').get(0)) == 0 || getTop($("#container").get(0)) != 0) {
		height = height - getTop($('.flexigrid .bDiv').get(0)) - $('.flexigrid .pDiv').height() - 10;
	}
	if(getTop($('.queryGraph-render').get(0)) != 0) {
		height = height - getTop($('.flexigrid .bDiv').get(0)) - $('.flexigrid .pDiv').height() - 10;
	}
	height = height < 0 ? 0 : height;
	$('.flexigrid .bDiv').height(height);
	if (typeof callBackFun == "function") {
		callBackFun();
	}
}

//获取距离body的上边距
function getTop(e){
	var offset = 0;
	var obj = e;
	while(obj != null && obj != document.body) {
		offset += obj.offsetTop;
		obj = obj.offsetParent;
	}
	while(obj != null && e != document.body) {
		offset -= e.scrollTop;
		e = e.parentElement;
	}
	return offset;
} 
//获取距离body的左边距
function getLeft(e){ 
	var offset = 0;
	var obj = e;
	while(obj != null && obj != document.body) {
		offset += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	while(e != null && e != document.body) {
		offset -= e.scrollLeft;
		e = e.parentElement;
	}
	return offset;
}

//获取URL参数信息
function getUrlParameter(name){
	if(location.search==''){
		return '';
	}
	
	var o={};
	var search=location.search.replace(/\?/,'');//只替换第一个问号,如果参数中带有问号,当作普通文本
	var s=search.split('&');
	for(var i=0;i<s.length;i++){
		o[s[i].split('=')[0]]=s[i].split('=')[1];
	}
	return o[name]==undefined?'':o[name];
}

function langIsChinese() {
	if (lang_local == "en") {
		return false;
	}
	return true;
}

function langWdatePickerCurLoacl() {
	if (lang_local == "en") {
		return "en";
	} else if (lang_local == "tw") {
		return "zh-tw";
	} else {
		return "zh-cn";
	}
}

function langZhCn() {
	this.trackList = "轨迹列表";
	this.trackQuery = "轨迹查询";
	this.vehiIdnoTip  = "车牌号：";
	this.startTimeTip = "开始时间：";
	this.endTimeTip = "结束时间：";
	this.query = "查询";
	
	this.index = "序号";
	this.vehiIdno  = "车牌号";
	this.gpsTime = "时间";
	this.speed = "速度";
	this.licheng = "里程";
	this.lichengRun = "行驶里程";
	this.position = "位置";
	this.KmPerHour = "公里/时";
	this.km = "公里";
	this.gpsUnvalid = "GPS无效";
	this.invalid = "无效";
	
	this.pernumber = "每页数目";
	this.pagefrom = "第";
	this.pagetotal = "共";
	this.page = "页";
	this.of = "到";
	this.errorConnection = "连接错误";
	this.pagestatInfo = "显示由  {from}  到  {to}  共  {total}  条记录";
	this.find = "查找";
	this.nomsg = "没有记录";
	this.procmsg ="处理中，请稍候...";
	
	this.loginError = "登陆失败";
	this.jsessionError = "会话号不存在";
	this.vehicleNotOperate = "没有车辆或者设备操作权限";
	this.errRequireParam = "请求参数不正确";  //7
	this.errQueryTimeRange = "开始时间不得大于结束时间";  //9
	this.errQueryTimeThanRange = "查询时间超过范围";  //10
	this.errQueryTimeFormat = "查询时间格式不正确！";
	this.report_timeRangOver7Day = "搜索时间范围不得超过7天！";
	this.errQueryFailed = "查询失败";
}
function langEn() {
	this.trackList = "Track List";
	this.trackQuery = "Track Query";
	this.vehiIdnoTip  = "Vehicle Plate:";
	this.startTimeTip = "Start Time:";
	this.endTimeTip = "End Time:";
	this.query = "Query";
	
	this.index = "Index";
	this.vehiIdno  = "Vehicle Plate";
	this.gpsTime = "Time";
	this.speed = "Speed";
	this.licheng = "Mileage";
	this.lichengRun = "Driving Mileage";
	this.position = "Position";
	this.KmPerHour = "KM / H";
	this.km = "KM";
	this.gpsUnvalid = "GPS Invalid";
	this.invalid = "Invalid";
	
	this.pernumber = "Per Data";
	this.pagefrom = "The";
	this.pagetotal = "Total";
	this.page = "Page";
	this.of = "to";
	this.errorConnection = "Connection error";
	this.pagestatInfo = "Displaying by {from} to {to} Total of {total} Records";
	this.find = "Find";
	this.nomsg = "No record";
	this.procmsg ="Processing, please wait ...";
	
	this.loginError = "Login failed";
	this.jsessionError = "Jsession error";
	this.vehicleNotOperate = "No vehicle or device operating authority";
	this.errRequireParam = "Request parameter is incorrect";  //7
	this.errQueryTimeRange = "Start time is not greater than the end time";  //9
	this.errQueryTimeThanRange = "The time Longer than the range";  //10
	this.errQueryTimeFormat = "Query time format is not correct!";
	this.report_timeRangOver7Day = "Search time not more than 7 days!";
	this.errQueryFailed = "The query fails";
}