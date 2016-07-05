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
	//职务
	$("#postList").append("<option value='1' selected>"+parent.lang.postMember+"</option>");
	$("#postList").append("<option value='2' selected>"+parent.lang.postCaptain+"</option>");
	//从服务器查询数据
	ajaxLoadInfo();
}); 

function loadLang(){
	$("#liBasicParam").text(parent.lang.vehicle_basicParam);
	$("#liModuleParam").text(parent.lang.mobile_equipParam);
	loadBasicParamLang();
	loadModuleLang();
	$("#save").text(parent.lang.save);
}

function loadBasicParamLang() {
	$("#labelName").text(parent.lang.mobile_labelName);
	$("#labelIdno").text(parent.lang.mobile_labelIdno);
	$("#labelSex").text(parent.lang.mobile_labelSex);
	$("#spanMale").text(parent.lang.male);
	$("#spanFemale").text(parent.lang.female);
	$("#labelUserIDNO").text(parent.lang.mobile_labelUserIdno);
	$("#labelTelephone").text(parent.lang.mobile_labelTelephone);
	$("#labelPost").text(parent.lang.mobile_labelPost);
	$("#labelCardID").text(parent.lang.mobile_labelCardid);
	$("#labelAddress").text(parent.lang.mobile_labelAddress);
	$("#labelRemarks").text(parent.lang.mobile_labelRemarks);	
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

	var allPage = ["basicParam", "moduleParam"];
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

function disableForm(disable) {
	disableButton("#save", disable);
	//车辆基本参数
	diableInput("#name", disable, true);
	diableInput("#sex_male", disable, true);
	diableInput("#sex_female", disable, true);
	diableInput("#userIdno", disable, true);
	diableInput("#simCard", disable, true);
	diableInput("#postList", disable, true);
	diableInput("#cardID", disable, true);
	diableInput("#address", disable, true);
	diableInput("#remarks", disable, true);
}

function ajaxLoadInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("TerminalMobileAction_get.action?idno=" + getUrlParameter("idno"), function(json,action,success){
		if (success) {
			//基本参数
			$("#name").val(json.terminal.userAccount.name);
			$("#idno").val(json.terminal.idno);
			$("#userIDNO").val(json.terminal.userIDNO);
			$("#simCard").val(json.terminal.simCard);
			$("#postList").val(json.terminal.userPost);
			$("#cardID").val(json.terminal.userCardID);
			$("#address").val(json.terminal.userAddress);
			$("#remarks").val(json.terminal.remarks);
			var sex = 1;
			if (json.terminal.userSex != null) {
				sex = json.terminal.userSex;
			}
			$("input[name='sex']").get(sex - 1).checked = true;
			//模块信息
			var module = json.terminal.module;
			if (module === null) {
				module = 0;
			}
			for (var i = 0; i < 4; i += 1) {
				var temp = (module>>i)&0x1;
				if (temp > 0) {
					$("#module" + i).attr("checked", true);
				}
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

function checkParam() {
	return checkBasicParam() ;
}

function ajaxSaveMobile() {
	if (!checkParam()) {
		return ;
	}

	var data={};
	data.userAccount = {};
	data.idno = getUrlParameter("idno");
	//基本信息
	data.userAccount.name = $.trim($("#name").val());
	data.simCard = $("#simCard").val();
	data.userSex = $("input[name='sex']:checked").val();
	data.userIDNO = $.trim($("#userIDNO").val());
	data.userPost = $("#postList").val();
	data.userCardID = $.trim($("#cardID").val());
	data.userAddress = $.trim($("#address").val());
	data.remarks = $.trim($("#remarks").val());
	//模块信息
	var module = 0;
	for (var i = 0; i < 4; i += 1) {
		if ($("#module" + i).attr("checked")) {
			module |= (1<<i);
		}
	}
	data.module = module;
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost('TerminalMobileAction_save.action?idno=' + getUrlParameter("idno"), data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.doEditMobileSuc(getUrlParameter("idno"), data);
		}
	});
}