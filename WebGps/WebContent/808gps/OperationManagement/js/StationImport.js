var api = frameElement.api, W = api.opener;
var lineDirect = getUrlParameter('lineDirect'); //上下行
var lineId = getUrlParameter('id'); //线路id;
var lineName = decodeURIComponent(getUrlParameter('name')); //线路名称;
$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [[{
			display: parent.lang.save, name : '', pclass : 'importStation',bgcolor : 'gray', hide : false
		}]]
	});
	
	//选择文件
	$('.lableExcel').on('click', onSelectFile);
	//导入
	$('.importStation').on('click', ajaxImportStation);
}); 

//点击上传站点文件
function onSelectFile() {
	$('#uploadFile').click();
}

//加载语言
function loadLang(){
	$("#lableExcel span").text(parent.lang.labelImportExcel);
}

function disableForm(disable) {
	if(disable) {
		$('.lableExcel').unbind('click');
		$('.importStation').unbind('click');
	}else {
		$('.lableExcel').on('click', onSelectFile);
		$('.importStation').on('click', ajaxImportStation);
	}
}

//判断文件
function previewExcel(file) {
	var names = file.value.split("\\");
	var i= names.length;
	var exts = names[i-1].split(".");
	var j = exts.length;
	var ext = $.trim(exts[j-1].toLowerCase());
    if (ext != "xls"){
    	$(file).val("");
    	alert(parent.lang.vehicle_alarmaction_errorFile);
    	return;
    }else {
    	if(exts[0]) {
    		var name_ =  $.trim(exts[0].substring(0, exts[0].length - 1));
    		if((lineDirect == 1 && $.trim(exts[0].toLowerCase()).endWith('s')) ||
    				(lineDirect == 0 && $.trim(exts[0].toLowerCase()).endWith('x'))
    				) {
    			$(file).val("");
    			alert(parent.lang.vehicle_alarmaction_errorFile);
            	return;
    		}
    	}else {
    		$(file).val("");
    		alert(parent.lang.vehicle_alarmaction_errorFile);
        	return;
    	}
    }
}

//判断文件类型
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

//加载导入
function ajaxImportStation() {
	if (!checkExcelFile()) {
		return ;
	}
	$.myajax.showLoading(true, parent.lang.importing);
	disableForm(true);
	$('#uploadForm').ajaxSubmit({
		url:'StandardLineAction_importStationExcel.action?lid='+ lineId,
		type:"post",
		dataType:"JSON",
		cache:false,/*禁用浏览器缓存*/
		resetForm: true,
		clearForm: true,
		success: function(json){
			disableForm(false);
			$.myajax.showLoading(false);
			if(json.result == 0){
				if(json.failedStation && json.failedStation.length > 0) {
					alert(parent.lang.vehicle_importFailed+':'+ json.failedStation.toString());
				}else {
					W.doImportStationSuccess();
				}
			}else {
				showErrorMessage(json.result);
			}
		}
	});
}