var api = frameElement.api, W = api.opener;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//$("#importType").append("<option value='1' selected>"+parent.lang.terminalVehicle+"</option>");
	var options = {    
	    target:        '#output',   
	    dataType:		'json',
	    beforeSubmit:  showRequest,   
	    success:       showResponse   
	};
	var mod = [[{
		display: parent.lang.download_template, name : '', pclass : 'import',bgcolor : 'gray', hide : false
		}],[{
		display: parent.lang.save, name : '', pclass : 'uploadForm',bgcolor : 'gray', hide : false
		}]];
	$('#toolbar-btn').flexPanel({
		ButtonsModel : mod
	});
	
	$('.import').on('click',function() { 
		$('#downloadForm').submit();
	});
	
	$('.uploadForm').on('click',ajaxImportVehicle);
}); 

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
			$.dialog.tips(parent.lang.vehicle_importFailed,1);
		}else{
			$.dialog.tips(parent.lang.vehicle_importSuccess,1);
		}
		W.doImportSuccess();
	} else {
		showErrorMessage(json.result);
	}
}

function loadLang(){
	//$("#lableType").text(parent.lang.device_labelImportType);
	$("#lableExcel").text(parent.lang.vehicle_labelImportExcel);
	/*$("#lableMobileTip").text(parent.lang.device_labelMobileFormat);
	$("#lableVehicleTip").text(parent.lang.device_labelVeicleFormat);
	$("#spanVehicleFormat").text(parent.lang.device_veicleFormat);
	$("#spanMobileFormat").text(parent.lang.device_mobileFormat);*/
	$("#save").text(parent.lang.save);
}

function disableForm(disable) {
	//diableInput("#importExcel", disable, true);
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
	alert(parent.lang.vehicle_tipSelectExcelFile);
	return false;
}

function checkParam() {
	var ret = true;
	if (!checkExcelFile()) {
		ret = false;
	}
	
	return ret;
}

function ajaxImportVehicle() {
	if (!checkParam()) {
		return ;
	}
	$.myajax.showLoading(true, parent.lang.importing);
	disableForm(true);
	$('#uploadForm').ajaxSubmit({
		url:'StandardVehicleAction_importExcel.action',
		type:"post",
		dataType:"JSON",
		cache:false,/*禁用浏览器缓存*/
		resetForm: true,
		clearForm: true,
		success: function(json){
			disableForm(false);
			$.myajax.showLoading(false);
			if(json.result == 0){
				W.doImportSuccess();
			}else {
				$.dialog.tips(parent.lang.vehicle_importFailed, 1);
			}
		}
	});
}