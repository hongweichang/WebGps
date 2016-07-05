var api = frameElement.api, W = api.opener;
var curPage = null;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//禁用车辆编号
	diableInput("#idno", true, true);
	//配置失去焦点的事件
	$("#name").blur(checkName);
	//通道数目参数
	for (var i = 0; i <= 8; ++ i) {
		$("#channelList").append("<option value='"+i+"' selected>"+i+"</option>");
	}
	$("#channelList").change(channelChange);
	//IO数目参数
	for (var i = 0; i <= 12; ++ i) {
		$("#ioInList").append("<option value='"+i+"' selected>"+i+"</option>");
	}
	$("#ioInList").change(ioInChange);
	//温度传感器
	for (var i = 0; i <= 4; ++ i) {
		$("#tempSensorList").append("<option value='"+i+"' selected>"+i+"</option>");
	}
	$("#tempSensorList").change(tempSensorChange);  
	//从服务器查询数据
	ajaxLoadInfo();
}); 

function loadLang(){
	$("#liBasicParam").text(parent.lang.vehicle_basicParam);
	$("#liChannelParam").text(parent.lang.vehicle_channelParam);
	$("#liIOInParam").text(parent.lang.vehicle_ioinParam);
	$("#liTempSensorParam").text(parent.lang.vehicle_tempSensorParam);
	$("#liModuleParam").text(parent.lang.vehicle_moduleParam);
	loadBasicParamLang();
	loadIoInParamLang();
	loadChannelParamLang();
	loadTempSensorLang();
	loadModuleLang();
	$("#save").text(parent.lang.save);
}

function loadBasicParamLang() {
	$("#labelName").text(parent.lang.vehicle_dvr_labelName);
	$("#labelIdno").text(parent.lang.labelIDNO);
	$("#labelSimCard").text(parent.lang.vehicle_labelSimcard);
	$("#labelDriverName").text(parent.lang.vehicle_dvr_labelLinkman);
	$("#labelDriverTele").text(parent.lang.vehicle_dvr_labelTelephone);
	$("#labelAddress").text(parent.lang.vehicle_dvr_labelAddress);
	$("#labelRemarks").text(parent.lang.vehicle_dvr_labelRemarks);
}

function loadIoInParamLang() {
	$("#labelSelIOIn").text(parent.lang.vehicle_labelSelIOIn);
	for (var i = 1; i <= 12; ++ i) {
		$("#labelIoIn" + i).text("IO_" + i + parent.lang.colon);
		$("#ioIn" + i).val("IO_" + i);
	}
}

function loadChannelParamLang() {
	$("#labelSelChannel").text(parent.lang.vehicle_labelSelChannel);
	for (var i = 1; i <= 8; ++ i) {
		$("#labelChannel" + i).text(parent.lang.channel + i + parent.lang.colon);
		$("#channel" + i).val("CH" + i);
	}
}

function loadTempSensorLang() {
	$("#labelSelTempSensor").text(parent.lang.vehicle_labelSelTempSensor);
	for (var i = 1; i <= 4; ++ i) {
		$("#labelTempSensor" + i).text(parent.lang.vehicle_tempSensor + i + parent.lang.colon);
		$("#tempSensor" + i).val(parent.lang.temperature + i);
	}
}

function loadModuleLang() {
	$("#spanModuleOilSensor").text(parent.lang.vehicle_moduleOilSensor);
	$("#spanModuleOilControl").text(parent.lang.vehicle_moduleOilControl);
	$("#spanModuleElecControl").text(parent.lang.vehicle_moduleElecControl);
	$("#spanModuleTTSControl").text(parent.lang.vehicle_moduleTTS);
}

function switchPage(page) {
	//如果界面上校验不通过，则不允许进行切换
	if (curPage == "basicParam") {
		if (!checkBasicParam()) {
			return ;
		}
	}
	if (curPage == "channelParam") {
		if (!checkChannelParam()) {
			return ;
		}
	}
	if (curPage == "ioInParam") {
		if (!checkIoInParam()) {
			return ;
		}
	}
	if (curPage == "tempSensorParam") {
		if (!checkTempSensorParam()) {
			return ;
		}
	}
	
	var allPage = ["basicParam", "ioInParam", "channelParam", "tempSensorParam", "moduleParam"];
	for (var i = 0; i < allPage.length; i = i + 1) {
		if ( page == allPage[i] ) {
			$("#" + allPage[i]).show();
			$("#" + allPage[i]).addClass("now_focus");
			$("#li_" + allPage[i]).addClass("now_focus");
			curPage = page;
		} else {
			$("#" + allPage[i]).hide();
			$("#" + allPage[i]).removeClass();
			$("#li_" + allPage[i]).removeClass();
		}
	}
}

function channelChange() {
	var sensor = parseIntDecimal($("#channelList").val());
	for (var i = 1; i <= sensor; i += 1) {
		$("#dtChannel" + i).show();
		$("#ddChannel" + i).show();
		if ($.trim($("#channel" + i).val()) === "") {
			$("#channel" + i).val(parent.lang.channel + i);
		}
	}
	for (var i = sensor + 1; i <= 8; i += 1) {
		$("#dtChannel" + i).hide();
		$("#ddChannel" + i).hide();
	}
}

function ioInChange() {
	var ioCount = parseIntDecimal($("#ioInList").val());
	for (var i = 1; i <= ioCount; i += 1) {
		$("#dtIoIn" + i).show();
		$("#ddIoIn" + i).show();
		if ($.trim($("#ioIn" + i).val()) === "") {
			$("#ioIn" + i).val(parent.lang.vehicle_ioInName + i);
		}
	}
	for (var i = ioCount + 1; i <= 12; i += 1) {
		$("#dtIoIn" + i).hide();
		$("#ddIoIn" + i).hide();
	}
}

function tempSensorChange() {
	var sensor = parseIntDecimal($("#tempSensorList").val());
	for (var i = 1; i <= sensor; i += 1) {
		$("#dtTempSensor" + i).show();
		$("#ddTempSensor" + i).show();
		if ($.trim($("#tempSensor" + i).val()) === "") {
			$("#tempSensor" + i).val(parent.lang.temperature + i);
		}
	}
	for (var i = sensor + 1; i <= 8; i += 1) {
		$("#dtTempSensor" + i).hide();
		$("#ddTempSensor" + i).hide();
	}
}

function disableForm(disable) {
	disableButton("#save", disable);
	//车辆基本参数
	diableInput("#name", disable, true);
	diableInput("#driverName", disable, true);
	diableInput("#driverTele", disable, true);
	diableInput("#simCard", disable, true);
	diableInput("#vehiBand", disable, true);
	diableInput("#vehiType", disable, true);
	//通道参数
	diableInput("#channelList", disable, true);
	for (var i = 1; i <= 8; i = i + 1) {
		diableInput("#channel" + i, disable, true);
	}
	//IO名称
	diableInput("#ioInList", disable, true);
	for (var i = 1; i <= 12; i = i + 1) {
		diableInput("#ioIn" + i, disable, true);
	}
	//温度传感器
	diableInput("#tempSensorList", disable, true);
	for (var i = 1; i <= 4; i = i + 1) {
		diableInput("#tempSensor" + i, disable, true);
	}
}

function ajaxLoadInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("DvrAction_get.action?idno=" + getUrlParameter("idno"), function(json,action,success){
		if (success) {
			//基本参数
			$("#name").val(json.dvr.userAccount.name);
			$("#idno").val(json.dvr.idno);
			$("#driverName").val(json.dvr.driverName);
			$("#driverTele").val(json.dvr.driverTele);
			$("#simCard").val(json.dvr.simCard);
			$("#address").val(json.dvr.userAddress);
			$("#remarks").val(json.dvr.remarks);
			//通道参数
			$("#channelList").val(json.dvr.chnCount);
			if (json.dvr.chnCount > 0) {
				var chnName = json.dvr.chnName.split(",");
				for (var i = 0; i < json.dvr.chnCount; i = i + 1) {
					$("#channel" + (i + 1)).val(chnName[i]);
				}
			}
			channelChange();
			//IO名称参数
			$("#ioInList").val(json.dvr.ioInCount);
			if (json.dvr.ioInCount > 0) {
				var ioInName = json.dvr.ioInName.split(",");
				for (var i = 0; i < json.dvr.ioInCount; i = i + 1) {
					$("#ioIn" + (i + 1)).val(ioInName[i]);
				}
			}
			ioInChange();
			//温度传感器名称
			$("#tempSensorList").val(json.dvr.tempCount);
			if (json.dvr.tempCount > 0) {
				var tempName = json.dvr.tempName.split(",");
				for (var i = 0; i < json.dvr.tempCount; i = i + 1) {
					$("#tempSensor" + (i + 1)).val(tempName[i]);
				}
			}
			tempSensorChange();
			//模块信息
/*			var module = json.vehicle.module;
			if (module === null) {
				module = 0;
			}
			for (var i = 0; i < 4; i += 1) {
				var temp = (module>>i)&0x1;
				if (temp > 0) {
					$("#module" + i).attr("checked", true);
				}
			}*/
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function checkName() {
	return true;//checkInput("#name", "#nameWrong", 1, 32, parent.lang.errStringRequire, parent.lang.errNameRegex);
}

function checkBasicParam() {
	var ret = true;
	if ($.trim($("#name").val()) === "") {
		alert(parent.lang.vehicle_nameEmpty);
		ret = false;	
	}
	
	return ret;
}

function checkChannelParam() {
	var ret = true;
	var sensor = parseIntDecimal($("#channelList").val());
	for (var i = 1; i <= sensor; i += 1) {
		var name = $.trim($("#channel" + i).val());
		if (name === "") {
			alert(parent.lang.channel + i + parent.lang.vehicle_nameParamEmpty);
			$("#channel" + i).focus();
			ret = false;
			break;
		}
		//判断是否存在特殊字符
		if (checkSpecialCharacters(name)) {
			alert(parent.lang.channel + i + parent.lang.vehicle_nameParamRegx);
			$("#channel" + i).focus();
			ret = false;
			break;
		}
	}
	
	return ret;
}

function checkIoInParam() {
	var ret = true;
	var sensor = parseIntDecimal($("#ioInList").val());
	for (var i = 1; i <= sensor; i += 1) {
		var name = $.trim($("#ioIn" + i).val());
		if (name === "") {
			alert(parent.lang.vehicle_ioInName + i + parent.lang.vehicle_nameParamEmpty);
			$("#ioIn" + i).focus();
			ret = false;
			break;
		}
		//判断是否存在特殊字符
		if (checkSpecialCharacters(name)) {
			alert(parent.lang.vehicle_ioInName + i + parent.lang.vehicle_nameParamRegx);
			$("#ioIn" + i).focus();
			ret = false;
			break;
		}
	}
	
	return ret;
}

function checkTempSensorParam() {
	var ret = true;
	var sensor = parseIntDecimal($("#tempSensorList").val());
	for (var i = 1; i <= sensor; i += 1) {
		var name = $.trim($("#tempSensor" + i).val());
		if (name === "") {
			alert(parent.lang.vehicle_tempSensor + i + parent.lang.vehicle_nameParamEmpty);
			$("#tempSensor" + i).focus();
			ret = false;
			break;
		}
		//判断是否存在特殊字符
		if (checkSpecialCharacters(name)) {
			alert(parent.lang.vehicle_tempSensor + i + parent.lang.vehicle_nameParamRegx);
			$("#tempSensor" + i).focus();
			ret = false;
			break;
		}
	}
	
	return ret;
}

function checkParam() {
	return checkBasicParam() && checkChannelParam() && checkIoInParam() && checkTempSensorParam();
}

function ajaxSaveDvr() {
	if (!checkParam()) {
		return ;
	}

	var data={};
	data.userAccount = {};
	data.idno = getUrlParameter("idno");
	//基本信息
	data.userAccount.name = $.trim($("#name").val());
	data.simCard = $("#simCard").val();
	data.driverName = $.trim($("#driverName").val());
	data.driverTele = $.trim($("#driverTele").val());
	data.userAddress = $.trim($("#address").val());
	data.remarks = $.trim($("#remarks").val());
	//通道参数
	data.chnCount = parseIntDecimal($("#channelList").val());
	data.icon = $("input[name='iconType']:checked").val();
	var chnName = [];
	for (var i = 0; i < data.chnCount; i = i + 1) {
		chnName.push($.trim($("#channel" + (i + 1)).val()));
	}
	data.chnName = chnName.toString();
	//IO参数
	data.ioInCount = parseIntDecimal($("#ioInList").val());
	var ioInName = [];
	for (var i = 0; i < data.ioInCount; i = i + 1) {
		ioInName.push($.trim($("#ioIn" + (i + 1)).val()));
	}
	data.ioInName = ioInName.toString();
	//温度参数
	data.tempCount = parseIntDecimal($("#tempSensorList").val());
	var tempName = [];
	for (var i = 0; i < data.tempCount; i = i + 1) {
		tempName.push($.trim($("#tempSensor" + (i + 1)).val()));
	}
	data.tempName = tempName.toString();
	//模块信息
/*	var module = 0;
	for (var i = 0; i < 4; i += 1) {
		if ($("#module" + i).attr("checked")) {
			module |= (1<<i);
		}
	}
	data.module = module;*/
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost('DvrAction_save.action?idno=' + getUrlParameter("idno"), data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.doEditDvrSuc(getUrlParameter("idno"), data);
		}
	});
}