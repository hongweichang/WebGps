var api = frameElement.api, W = api.opener;
var curPage = null;
//通道数目
var IMaxChannel = 12;
var IMaxIoin = 12;
var IMaxTempSensor = 4;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	
	//通道数目参数
	for (var i = 0; i <= IMaxChannel; ++ i) {
		$("#channelList").append("<option value='"+i+"' selected>"+i+"</option>");
		if(i>0){
			var str = "<dt id=\"dtChannel"+i+"\"><span id=\"labelChannel"+i+"\"></span></dt>";
			str+="<dd id=\"ddChannel"+i+"\">";
			str+="<input id=\"channel"+i+"\" name=\"channel"+i+"\" type=\"text\" class=\"text\" value=\"\" maxlength=\"12\"/>";
			str+="<span id=\"channelWrong"+i+"\" class=\"red\">*</span>";
			str+="</dd>";
			$("#channelParam").children(".setingbox").append(str);
		}
	}
	$("#channelList").change(channelChange);
	
	//IO数目参数
	for (var i = 0; i <= IMaxIoin; ++ i) {
		$("#ioInList").append("<option value='"+i+"' selected>"+i+"</option>");
		if(i>0){
			var str = "<dt id=\"dtIoIn"+i+"\"><span id=\"labelIoIn"+i+"\"></span></dt>";
			str+="<dd id=\"ddIoIn"+i+"\">";
			str+="<input id=\"ioIn"+i+"\" name=\"ioIn"+i+"\" type=\"text\" class=\"text\" value=\"\" maxlength=\"12\"/>";
			str+="<span id=\"ioInWrong"+i+"\" class=\"red\">*</span>";
			str+="</dd>";
			$("#ioInParam").children(".setingbox").append(str);
		}
	}
	$("#ioInList").change(ioInChange);
	//温度传感器
	for (var i = 0; i <= IMaxTempSensor; ++ i) {
		$("#tempSensorList").append("<option value='"+i+"' selected>"+i+"</option>");
		if(i>0){
			var str = "<dt id=\"dtTempSensor"+i+"\"><span id=\"labelTempSensor"+i+"\"></span></dt>";
			str+="<dd id=\"ddTempSensor"+i+"\">";
			str+="<input id=\"tempSensor"+i+"\" name=\"tempSensor"+i+"\" type=\"text\" class=\"text\" value=\"\" maxlength=\"12\"/>";
			str+="<span id=\"tempSensorWrong"+i+"\" class=\"red\">*</span>";
			str+="</dd>";
			$("#tempSensorParam").children(".setingbox").append(str);
		}
	}
	$("#tempSensorList").change(tempSensorChange); 
	
	//加载语言
	loadLang();
	//禁用车辆编号
	diableInput("#idno", true, true);
	//配置失去焦点的事件
	$("#name").blur(checkName);
	
	
	//车牌颜色
	$("#plateColorList").append("<option value='1'>" + parent.lang.vehicle_colorBlue + "</option>");
	$("#plateColorList").append("<option value='2' selected>" + parent.lang.vehicle_colorYellow + "</option>");
	$("#plateColorList").append("<option value='3'>" + parent.lang.vehicle_colorBlack + "</option>");
	$("#plateColorList").append("<option value='4'>" + parent.lang.vehicle_colorWhite + "</option>");
	$("#plateColorList").append("<option value='9'>" + parent.lang.vehicle_colorOther + "</option>");
	 
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
	$("#labelName").text(parent.lang.labelVehiName);
	$("#labelIdno").text(parent.lang.labelIDNO);
	$("#labelSimCard").text(parent.lang.vehicle_labelSimcard);
	$("#labelDriverName").text(parent.lang.vehicle_labelDriverName);
	$("#labelDriverTele").text(parent.lang.vehicle_labelDriverTele);
	$("#labelCompany").text(parent.lang.vehicle_labelCompany);
	$("#labelVehiBand").text(parent.lang.vehicle_labelVehiBand);
	$("#selectBand").text(parent.lang.vehicle_type_select);
	$("#labelVehiType").text(parent.lang.vehicle_labelVehiType);
	$("#selectType").text(parent.lang.vehicle_type_select);
	$("#labelVehiIcon").text(parent.lang.vehicle_labelVehiIcon);
	$("#labelFactoryCode").text(parent.lang.vehicle_labelFactoryCode);
	$("#labelPlateColor").text(parent.lang.vehicle_labelPlateColor);
	$("#labelTerminalType").text(parent.lang.vehicle_labelTerminalType);
	$("#labelTerminalId").text(parent.lang.vehicle_labelTerminalID);
}

function loadIoInParamLang() {
	$("#labelSelIOIn").text(parent.lang.vehicle_labelSelIOIn);
	for (var i = 1; i <= IMaxIoin; ++ i) {
		$("#labelIoIn" + i).text("IO_" + i + parent.lang.colon);
		$("#ioIn" + i).val("IO_" + i);
	}
}

function loadChannelParamLang() {
	$("#labelSelChannel").text(parent.lang.vehicle_labelSelChannel);
	for (var i = 1; i <= IMaxChannel; ++ i) {
		$("#labelChannel" + i).text(parent.lang.channel + i + parent.lang.colon);
		$("#channel" + i).val("CH" + i);
	}
}

function loadTempSensorLang() {
	$("#labelSelTempSensor").text(parent.lang.vehicle_labelSelTempSensor);
	for (var i = 1; i <= IMaxTempSensor; ++ i) {
		$("#labelTempSensor" + i).text(parent.lang.vehicle_tempSensor + i + parent.lang.colon);
		$("#tempSensor" + i).val(parent.lang.temperature + i);
	}
}

function loadModuleLang() {
	$("#spanModuleOilSensor").text(parent.lang.vehicle_moduleOilSensor);
	$("#spanModuleOilControl").text(parent.lang.vehicle_moduleOilControl);
	$("#spanModuleElecControl").text(parent.lang.vehicle_moduleElecControl);
	$("#spanModuleTTSControl").text(parent.lang.vehicle_moduleTTS);
	$("#spanModuleDigitalIntercom").text(parent.lang.vehicle_moduleDigitIntercom);
	$("#spanModuleODB").text("OBD");
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
			$("#channel" + i).val("CH" + i);
		}
	}
	for (var i = sensor + 1; i <= IMaxChannel; i += 1) {
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
	for (var i = ioCount + 1; i <= IMaxIoin; i += 1) {
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
	for (var i = sensor + 1; i <= IMaxTempSensor; i += 1) {
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
	diableInput("#vehiCompany", disable, true);
	diableInput("#vehiBand", disable, true);
	diableInput("#vehiType", disable, true);
	
	diableInput("#plateColorList", disable, true);
	diableInput("#productId", disable, true);
	diableInput("#terminalModel", disable, true);
	diableInput("#terminalId", disable, true);
	
	//通道参数
	diableInput("#channelList", disable, true);
	for (var i = 1; i <= IMaxChannel; i = i + 1) {
		diableInput("#channel" + i, disable, true);
	}
	
	//IO名称
	diableInput("#ioInList", disable, true);
	for (var i = 1; i <= IMaxIoin; i = i + 1) {
		diableInput("#ioIn" + i, disable, true);
	}
	
	//温度传感器
	diableInput("#tempSensorList", disable, true);
	for (var i = 1; i <= IMaxTempSensor; i = i + 1) {
		diableInput("#tempSensor" + i, disable, true);
	}
}

var deviceBrands = null;
var deviceTypes = null;
var typeId = null;
var brandId = null;
function ajaxLoadInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("VehicleAction_get.action?idno=" + getUrlParameter("idno"), function(json,action,success){
		if (success) {
			//基本参数
			$("#name").val(json.vehicle.userAccount.name);
			$("#idno").val(json.vehicle.idno);
			$("#driverName").val(json.vehicle.driverName);
			$("#driverTele").val(json.vehicle.driverTele);
			$("#simCard").val(json.vehicle.simCard);
			$("#vehiCompany").val(json.vehicle.vehiCompany);
			if (json.vehicle.plateColor != null) {
				$("#plateColorList").val(json.vehicle.plateColor);
			}
			if (json.vehicle.productId != null) {
				$("#productId").val(json.vehicle.productId);
			}
			if (json.vehicle.terminalModel != null) {
				$("#terminalModel").val(json.vehicle.terminalModel);
			}
			if (json.vehicle.terminalId != null) {
				$("#terminalId").val(json.vehicle.terminalId);
			}
			
			deviceBrands = json.deviceBrands;
			if(deviceBrands != null){
				for(var i = 0; i < deviceBrands.length; ++i){
					var deviceBrand = deviceBrands[i];
					if(deviceBrand.id == json.vehicle.bandId){
						brandId = json.vehicle.bandId;
					}
				}
				if(json.vehicle.bandId == null || brandId == null){
					$("#vehiBand").append("<option value=" + null + ">" + "" + "</option>");
				}
				
				if(deviceBrands != null){
					for(var i = 0; i < deviceBrands.length; ++i){
						var deviceBrand = deviceBrands[i];
						if(deviceBrand.id == json.vehicle.bandId){
							brandId = json.vehicle.bandId;
							$("#vehiBand").append("<option value=" + deviceBrand.id + " selected>" + deviceBrand.name + "</option>");
						}else{
							$("#vehiBand").append("<option value=" + deviceBrand.id + ">" + deviceBrand.name + "</option>");
						}
					}
				}
			}
			
			if(deviceBrands != null){
				deviceTypes = json.deviceTypes;
				if(deviceTypes != null){
					for(var i = 0; i < deviceTypes.length; ++i){
						var deviceType = deviceTypes[i];
						if(deviceType.brandId == brandId){
							if(deviceType.id == json.vehicle.typeId){
								typeId = json.vehicle.typeId;
								$("#vehiType").append("<option value=" + deviceType.id + " selected>" + deviceType.name + "</option>");
							}else{
								$("#vehiType").append("<option value=" + deviceType.id + ">" + deviceType.name + "</option>");
							}
						}
					}
				}
			}
			
			var icon = 1;
			if (json.vehicle.icon != null) {
				icon = json.vehicle.icon;
			}
			//if (icon > 3) {
			//	$("input[name='iconType']").get(icon - 2).checked = true;
			//} else {
				$("input[name='iconType']").get(icon - 1).checked = true;
			//}
			//通道参数
			$("#channelList").val(json.vehicle.chnCount);
			if (json.vehicle.chnCount > 0) {
				var chnName = json.vehicle.chnName.split(",");
				for (var i = 0; i < json.vehicle.chnCount; i = i + 1) {
					$("#channel" + (i + 1)).val(chnName[i]);
				}
			}
			channelChange();
			//IO名称参数
			$("#ioInList").val(json.vehicle.ioInCount);
			if (json.vehicle.ioInCount > 0) {
				var ioInName = json.vehicle.ioInName.split(",");
				for (var i = 0; i < json.vehicle.ioInCount; i = i + 1) {
					$("#ioIn" + (i + 1)).val(ioInName[i]);
				}
			}
			ioInChange();
			//温度传感器名称
			$("#tempSensorList").val(json.vehicle.tempCount);
			if (json.vehicle.tempCount > 0) {
				var tempName = json.vehicle.tempName.split(",");
				for (var i = 0; i < json.vehicle.tempCount; i = i + 1) {
					$("#tempSensor" + (i + 1)).val(tempName[i]);
				}
			}
			tempSensorChange();
			//模块信息
			var module = json.vehicle.module;
			if (module === null) {
				module = 0;
			}
			var param=parseInt(module).toString(2);
			if(param.length<2) {
				param = '000000000'+param;
			}else if(param.length<3) {
				param = '00000000'+param;
			}else if(param.length<4) {
				param = '0000000'+param;
			}else if(param.length<5) {
				param = '000000'+param;
			}else if(param.length<6) {
				param = '00000'+param;
			}else if(param.length<7) {
				param = '0000'+param;
			}else if(param.length<8) {
				param = '000'+param;
			}else if(param.length<9) {
				param = '00'+param;
			}else if(param.length<10) {
				param = '0'+param;
			}
			if(param.substring(0,1) == 1) {
				$('#module5').attr('checked','checked');
			}
			if(param.substring(5,6) == 1) {
				$('#module4').attr('checked','checked');
			}
			if(param.substring(6,7) == 1) {
				$('#module3').attr('checked','checked');
			}
			if(param.substring(7,8) == 1) {
				$('#module2').attr('checked','checked');
			}
			if(param.substring(8,9) == 1) {
				$('#module1').attr('checked','checked');
			}
			if(param.substring(9,10) == 1) {
				$('#module0').attr('checked','checked');
			}
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

function saveDevBand() {
	$.dialog({id:'addbrand', title:parent.lang.vehicle_vehiBand,content:'url:vehicle/brand_list.html?idno=' + getUrlParameter("idno")
		, min:false, max:false, lock:true, parent: api});
}

function doSelectBrandSuc(id){
	$("#vehiBand").empty();
	for(var i = 0; i < deviceBrands.length; ++i){
		var deviceBrand = deviceBrands[i];
		if(deviceBrand.name != null){
			if(deviceBrand.id == id){
				$("#vehiBand").append("<option value=" + deviceBrand.id + " selected>" + deviceBrand.name + "</option>");
			}else{
				$("#vehiBand").append("<option value=" + deviceBrand.id + ">" + deviceBrand.name + "</option>");
			}
		}
	}
	$("#vehiType").empty();
	for(var i = 0; i < deviceTypes.length; ++i){
		var deviceType = deviceTypes[i];
		if(deviceType.name != null && deviceType.brandId == id){
			if(deviceType.id == typeId){
				$("#vehiType").append("<option value=" + deviceType.id + " selected>" + deviceType.name + "</option>");
			}else{
				$("#vehiType").append("<option value=" + deviceType.id + ">" + deviceType.name + "</option>");
			}
		}
	}
	$.dialog({id:'addbrand'}).close();
}

function ajaxSaveVehile() {
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
	if($("#vehiBand").val() != "null"){
		data.bandId = $.trim($("#vehiBand").val());
	}
	if($("#vehiType").val() != null){
		data.typeId = $.trim($("#vehiType").val());
	}
	data.vehiCompany = $.trim($("#vehiCompany").val());
	
	data.plateColor = parseIntDecimal($("#plateColorList").val());
	data.productId = $.trim($("#productId").val());
	data.terminalId = $.trim($("#terminalId").val());
	data.terminalModel = $.trim($("#terminalModel").val());
	
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
	var module = 0;
	var str = '';
	if ($("#module5").attr("checked")) {
		str += '10000';
	}else{
		str += '00000';
	}
	if ($("#module4").attr("checked")) {
		str += '1';
	}else{
		str += '0';
	}
	if ($("#module3").attr("checked")) {
		str += '1';
	}else{
		str += '0';
	}
	if ($("#module2").attr("checked")) {
		str += '1';
	}else{
		str += '0';
	}
	if ($("#module1").attr("checked")) {
		str += '1';
	}else{
		str += '0';
	}
	if ($("#module0").attr("checked")) {
		str += '1';
	}else{
		str += '0';
	}
	data.module = parseInt(str,2);
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost('VehicleAction_save.action?idno=' + getUrlParameter("idno"), data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.doEditVehiSuc(getUrlParameter("idno"), data);
		}
	});
}

function restVehiBand(id,name){
	$("#vehiBand").empty();
	var flag = true;
	for(var i = 0; i < deviceBrands.length; i++) {
		if(deviceBrands[i].id == id) {
			deviceBrands[i].name = name;
			flag = false;
		}
	}
	if(flag) {
		data = {id:id,name:name};
		deviceBrands.push(data);
		flag = false;
	}
	if(brandId == null){
		$("#vehiBand").append("<option value=" + null + ">" + "" + "</option>");
	}
	for(var i = 0; i < deviceBrands.length; ++i){
		var deviceBrand = deviceBrands[i];
		if(deviceBrand.name != null){
			if(deviceBrand.id == brandId){
				$("#vehiBand").append("<option value=" + deviceBrand.id + " selected>" + deviceBrand.name + "</option>");
			}else{
				$("#vehiBand").append("<option value=" + deviceBrand.id + ">" + deviceBrand.name + "</option>");
			}
		}
	}
	W.restVehiBand(getUrlParameter("idno"),name);
}

function restVehiType(id,data){
	$("#vehiType").empty();
	var flag = true;
	for(var i = 0; i < deviceTypes.length; i++) {
		if(deviceTypes[i].id == id) {
			deviceTypes[i].name = data;
			flag = false;
		}
	}
	if(flag) {
		deviceTypes.push(data);
		flag = false;
	}
	for(var i = 0; i < deviceTypes.length; ++i){
		var deviceType = deviceTypes[i];
		if(deviceType.name != null){
			if(deviceType.name != null && deviceType.brandId == brandId){
				if(deviceType.id == typeId){
					$("#vehiType").append("<option value=" + deviceType.id + " selected>" + deviceType.name + "</option>");
				}else{
					$("#vehiType").append("<option value=" + deviceType.id + ">" + deviceType.name + "</option>");
				}
			}
		}
	}
	W.restVehiType(getUrlParameter("idno"), data.name);
}

function typeChange(){
	brandId = $.trim($("#vehiBand").val());
	$("#vehiType").empty();
	for(var i = 0; i < deviceTypes.length; ++i){
		var deviceType = deviceTypes[i];
		if(deviceType.name != null && deviceType.brandId == brandId){
			if(deviceType.id == typeId){
				$("#vehiType").append("<option value=" + deviceType.id + " selected>" + deviceType.name + "</option>");
			}else{
				$("#vehiType").append("<option value=" + deviceType.id + ">" + deviceType.name + "</option>");
			}
		}
	}
}