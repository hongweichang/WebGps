var api = frameElement.api, W = api.opener;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	$("#importType").append("<option value='1' selected>"+parent.lang.terminalVehicle+"</option>");
	var options = {    
	    target:        '#output',   
	    dataType:		'json',
	    beforeSubmit:  showRequest,   
	    success:       showResponse   
	};
	$('#uploadForm').submit(function() {   
	    $(this).ajaxSubmit(options);
	    return false;//阻止表单提交   
	});
	ajaxLoadEnableTracker();
}); 

function ajaxLoadEnableTracker() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("SysDeviceAction_serverConfig.action", function(json,action,success){
		$.myajax.showLoading(false);
		disableForm(false);
		if (success) {
			var devType = getCookieDevType();
			if (json.enableTracker) {
				//$("#importType").append("<option value='2'>"+parent.lang.terminalMobile+"</option>");
				//$("#lableMobileTip").show();
				//$("#spanMobileFormat").show();
			} else {
				if (2 == devType) {
					devType = 1;
				}
				//$("#lableMobileTip").hide();
				//$("#spanMobileFormat").hide();
			}
			setTimeout(function() {	$("#importType").val(devType);
				}, 10);
		} else {
			W.doAddExit();
		}
	}, null);
}

function showRequest(formData, jqForm, options) {
//  var queryString = $.param(formData);    
//  alert('queryString==' + queryString);    
    return true;    
}

function showResponse(responseText, statusText) {
	$.myajax.showLoading(false);
	disableForm(false);  
	if (0 == responseText.result) {
		if (responseText.accounts !== null && responseText.accounts.length > 0) {
			alert(parent.lang.device_importFailed);			
		}
		W.doImportSuccess();
	} else {
		showErrorMessage(json.result);
	}
}

function loadLang(){
	$("#lableType").text(parent.lang.device_labelImportType);
	$("#lableExcel").text(parent.lang.device_labelImportExcel);
	$("#lableVehicleTip").text(parent.lang.device_labelImportExcel);
	$("#lableMobileTip").text(parent.lang.device_labelMobileFormat);
	$("#lableVehicleTip").text(parent.lang.device_labelVeicleFormat);
	$("#spanVehicleFormat").text(parent.lang.device_veicleFormat);
	$("#spanMobileFormat").text(parent.lang.device_mobileFormat);
	$("#save").text(parent.lang.save);
}

function disableForm(disable) {
	diableInput("#importType", disable, true);
	diableInput("#importExcel", disable, true);
	disableButton("#save", disable);
}

function checkExcelFile() {
	var file = $("#uploadFile").val();
	if (file !== "") {
		var ext = /\.[^\.]+$/.exec(file);
		if (ext.length > 0 && ext[0].toLowerCase() == ".xls") {
			return true;
		} 
	} 
	alert(parent.lang.device_tipSelectExcelFile);
	return false;
}

function checkParam() {
	var ret = true;
	if (!checkExcelFile()) {
		ret = false;
	}
	
	return ret;
}

function ajaxImportDevice() {
	if (!checkParam()) {
		return ;
	}
	$.myajax.showLoading(true, parent.lang.importing);
	SetCookie("system_deviceType", $.trim($("#importType").val()));
	disableForm(true);
	document.uploadForm.action = "SysDeviceAction_importExcel.action?importType=" + $('#importType').val();
	$('#uploadForm').submit();
}