var api = frameElement.api, W = api.opener;
var vehiIdno = decodeURIComponent(getUrlParameter('vehiIdno'));//选择的车辆节点
var devIdno = getUrlParameter('devIdno');//设备号
var protocol = getUrlParameter('protocol');//协议类型
var factoryType = getUrlParameter('factoryType');//厂家类型
var showDevIdno = getUrlParameter('showDevIdno') == "true" ? true : false;
var isUpgrade = getUrlParameter('isUpgrade') == "true" ? true : false;
var vehiTeamTree = null;  //车队车辆树类
var gatewayServer = W.gatewayServer; //网关服务器
var selVehiList = [];//new Hashtable(); //选中的待发送车辆
var isSend = true;
var isEdit = false;

$(document).ready(function(){
	loadReadyPage();
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}
function loadPage() {
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	var buttons = [];
	var but = [];
	but.push({
		display: parent.lang.refresh, 
		name : '', 
		pclass : 'refresh',
		bgcolor : 'gray',
		hide : false
	});
	buttons.push(but);
	but = [];
	but.push({
		display: parent.lang.save, 
		name : '', 
		pclass : 'submit',
		bgcolor : 'gray',
		hide : false
	});
	buttons.push(but);
	but = [];
	but.push({
		display: parent.lang.save_to_other, 
		name : '', 
		pclass : 'other',
		bgcolor : 'gray',
		hide : false
	});
	buttons.push(but);
	but = [];
	but.push({
		display: parent.lang.close, 
		name : '', 
		pclass : 'close',
		bgcolor : 'gray', 
		hide : false
	});
	buttons.push(but);
	$('#toolbar-btn').flexPanel({
		ButtonsModel : buttons 
	});
	
	var ttype = 'input';
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip: '',hide:false,tabshide:false},
				colgroup:{width:['140px','450px']},
				tabs:{
					display: [parent.lang.fileType,parent.lang.fileVersionUpgrade,parent.lang.upgrade_filename,parent.lang.filesUploaded,parent.lang.taskCreated],
					name : ['fileType','fileVersion','filename','uploaded','oflTask'],
					type:[,,ttype,ttype,ttype],
					length:[,,,,]
				}
			}
		]
	});
	if(isUpgrade == 'true'){
		$('.td-fileType').parent().hide();
		$('#upgradeTip').text(parent.lang.upgrade_tip);
	}else{
		var types = getFileTypes();
		$('.td-fileType').flexPanel({
			ComBoboxModel :{
				input : {name : 'fileType',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'fileType', option : arrayToStr(types)}
			}	
		});
		$('#combox-fileType').val(getArrayName(types,1));
		$('#hidden-fileType').val(1);
		$('#select-fileType li').each(function() {
			$(this).unbind('click');
			$(this).on('click',function(){
				var id = $.trim($(this).attr('data-index'));
				$('#combox-fileType').val(getArrayName(types,id));
				$('#hidden-fileType').val(id);
				$('#select-fileType').hide();
				isEdit = false;
				initSelectData();
			});
		});
		$('#combox-fileType').css('width','292px');
	}
	$('#required-area .panel-head').css('display','none');
	$('#input-filename').css('float', 'left');
	$('.td-filename').append('<div style="float:left;margin: 2px 5px 0px 10px;"><span class="manage" onclick="manageFile()" title="'+parent.lang.fileManage+'"></span></div>');
	loadFileUpgrade();
	$('.close','#toolbar-btn').on('click',function(){
		W.monitorMenu.upgradeObj = null;
		W.$.dialog({id:'upgrade'}).close();
	});
}
var oflTask = null;
var photo = null;
var config = null;
var oflFiles = [];
var photoFiles = [];
var configFiles = [];

function loadFileUpgrade(){
	$.myajax.jsonGet('StandardDeviceAction_getFileUpgrade.action?devIdno='+devIdno+'&protocol='+protocol+'&factoryType='+factoryType+'&isUpgrade='+isUpgrade, function(json,action,success){
		if(success) {
			if(isUpgrade){
				oflTask = json.oflTask;
				oflFiles = json.oflFiles;
			}else{
				photo = json.photo;
				config = json.config;
				photoFiles = json.photoFiles;
				configFiles = json.configFiles;
			}
			initSelectData();
			initPageTitle();
			$('.other','#toolbar-btn').on('click',saveToOthers);
			$('.submit','#toolbar-btn').on('click',saveOflTask);
			$('.refresh','#toolbar-btn').on('click',saveRefTask);
		};	
	}, null);
}

function getFileTypes() {
	var fileType = [];
	fileType.push({id:1,name: parent.lang.photo_type});
	fileType.push({id:3,name: parent.lang.config_file});
	return fileType;
}

function getOflFiles() {
	var oflFile = [];
	if(oflFiles != null && oflFiles.length >0){
		for (var i = 0; i < oflFiles.length; i++) {
			oflFile.push({id:oflFiles[i].id,name: oflFiles[i].sp});
		}
	}
	return oflFile;
}

function getPhotoFiles() {
	var photoFile = [];
	if(photoFiles != null && photoFiles.length >0){
		for (var i = 0; i < photoFiles.length; i++) {
			photoFile.push({id:photoFiles[i].id,name: photoFiles[i].sp});
		}
	}
	return photoFile;
}

function getConfigFiles() {
	var configFile = [];
	if(configFiles != null && configFiles.length >0){
		for (var i = 0; i < configFiles.length; i++) {
			configFile.push({id:configFiles[i].id,name: configFiles[i].sp});
		}
	}
	return configFile;
}

function editOflTask(){
	$("#combox-fileVersion").removeAttr("disabled");
	isEdit = true;
}

function saveOflTask(){
	if($("#combox-fileVersion").val() == null || $("#combox-fileVersion").val() == ''){
		if(isUpgrade){
			$.dialog.tips(parent.lang.file_version_upgrade_null,1);
		}else{
			$.dialog.tips(parent.lang.file_description_null,1);
		}
		return;
	}
	var data = {};
	data.did = devIdno;
	if(isUpgrade){
		data.ft = 2;
		if(oflTask != null){
			data.id = oflTask.id;
		}
	}else{
		data.ft = $('#hidden-fileType').val();
		if($('#hidden-fileType').val() == 1){
			if(photo != null){
				data.id = photo.id;
			}
		}else{
			if(config){
				data.id = config.id;
			}
		}
	}
	data.fid = $('#hidden-fileVersion').val();
	data.ct = new Date();
	data.ts = 0;
	var action = 'StandardDeviceAction_saveFileUpgrade.action';
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost( action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.monitorMenu.doSaveOflTaskSuccess();
		}
	});
}

function manageFile(){
	if(devIdno != null && devIdno != '') {
		var device = parent.vehicleManager.getDevice(devIdno);
		var url = 'url:LocationManagement/file_detail.html?vehiIdno='+vehiIdno+'&devIdno='+devIdno+'&protocol='+device.status.protocol+'&factoryType='+device.status.factoryType;
		var title = ""
		if(isUpgrade){
			url += '&fileType=2';
			title = parent.lang.upgrade_file_manage;
		}else{
			url += '&fileType='+$('#hidden-fileType').val();
			title = parent.lang.upload_file_manage;
		}
		$.dialog({id:'upgradeFile', title: title, content: url,
			width: '1000px', height: '600px', min:true, max:false, lock:true,fixed:false
				, resize:false, close: false, parent: api });
	}
}

function saveToOthers(){
	var fileId = $('#hidden-fileVersion').val();
	if(fileId == null || fileId == ""){
		$.dialog.tips(parent.lang.file_version_upgrade_null,1);
		return;
	}
	var url = 'url:LocationManagement/upgradeToOther.html?protocol='+protocol+'&factoryType='+factoryType+'&fileId='+fileId;
	if(isUpgrade){
		url += '&fileType=2';
	}else{
		url += '&fileType='+$('#hidden-fileType').val();
	}
	$.dialog({id:'upgradeToOther', title: parent.lang.rule_selectVehicle, content: url,
		width: '275px', height: '550px', min:true, max:false, lock:true,fixed:false
			, resize:false, close: false, parent: api });
}

function selectFile(id,sp,fn,upl){
	$.dialog({id:'upgradeFile'}).close();
	$('#combox-fileVersion').val(sp);
	$('#hidden-fileVersion').val(id);
	$('#input-filename').val(fn);
	$('#input-uploaded').val(dateTime2TimeString(upl));
}

function saveRefTask(){
	$.myajax.jsonGet('StandardDeviceAction_getFileUpgrade.action?devIdno='+devIdno+'&protocol='+protocol+'&factoryType='+factoryType+'&isUpgrade='+isUpgrade, function(json,action,success){
		if(success) {
			if(isUpgrade){
				oflTask = json.oflTask;
				oflFiles = json.oflFiles;
			}else{
				photo = json.photo;
				config = json.config;
				photoFiles = json.photoFiles;
				configFiles = json.configFiles;
			}
			initSelectData();
			initPageTitle();
		};	
	}, null);
}

function doUploadFileSuccess(id){
	$.dialog({id:'upgradeFile'}).close();
	$.dialog.tips(parent.lang.update_ok, 1);
	$.myajax.jsonGet('StandardDeviceAction_getFileUpgrade.action?devIdno='+devIdno+'&protocol='+protocol+'&factoryType='+factoryType+'&isUpgrade='+isUpgrade, function(json,action,success){
		if(success) {
			if(isUpgrade){
				oflFiles = json.oflFiles;
				if(isEdit || oflTask == null){
					$('#hidden-fileVersion').val(id);
					for (var i = 0; i < oflFiles.length; i++) {
						if(oflFiles[i].id == id){
							$('#combox-fileVersion').val(oflFiles[i].sp);
							$('#input-filename').val(oflFiles[i].fn);
							$('#input-uploaded').val(dateTime2TimeString(oflFiles[i].upl));
						}
					}
					$("#combox-fileVersion").removeAttr("disabled");
					$('#input-oflTask').val('');
				}
			}else if($('#hidden-fileType').val() == 1){
				photoFiles = json.photoFiles;
				if(isEdit || photo == null){
					$('#hidden-fileVersion').val(id);
					for (var i = 0; i < photoFiles.length; i++) {
						if(photoFiles[i].id == id){
							$('#combox-fileVersion').val(photoFiles[i].sp);
							$('#input-filename').val(photoFiles[i].fn);
							$('#input-uploaded').val(dateTime2TimeString(photoFiles[i].upl));
						}
					}
					$("#combox-fileVersion").removeAttr("disabled");
					$('#input-oflTask').val('');
				}
			}else{
				configFiles = json.configFiles;
				if(isEdit || config == null){
					$('#hidden-fileVersion').val(id);
					for (var i = 0; i < configFiles.length; i++) {
						if(configFiles[i].id == id){
							$('#combox-fileVersion').val(configFiles[i].sp);
							$('#input-filename').val(configFiles[i].fn);
							$('#input-uploaded').val(dateTime2TimeString(configFiles[i].upl));
						}
					}
					$("#combox-fileVersion").removeAttr("disabled");
					$('#input-oflTask').val('');
				}
			}
		}
		initSelectData();
		$.dialog.tips(parent.lang.update_ok, 1);
	});
}

function ResetUpgradePage(vIdno,dIdno,proType,facType,showDIdno,upgrade){
	//alert(11111112222);
	vehiIdno = vIdno;//选择的车辆节点
	devIdno = dIdno;//设备号
	protocol = proType;//协议类型
	factoryType = facType;//厂家类型
	showDevIdno = showDIdno;
	isUpgrade = upgrade;
	$.myajax.jsonGet('StandardDeviceAction_getFileUpgrade.action?devIdno='+devIdno+'&protocol='+protocol+'&factoryType='+factoryType+'&isUpgrade='+isUpgrade, function(json,action,success){
		if(success) {
			if(isUpgrade){
				oflTask = json.oflTask;
				oflFiles = json.oflFiles;
			}else{
				photo = json.photo;
				config = json.config;
				photoFiles = json.photoFiles;
				configFiles = json.configFiles;
			}
			initSelectData();
			initPageTitle();
		}
	});
}


function initPageTitle(){
	var title = vehiIdno;
	if(showDevIdno == 'true'){
		title += '-'+devIdno;
	}
	if(isUpgrade){
		if(oflTask == null){
			title += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+parent.lang.currently_no_upgrade_task;
		}else{
			title += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+parent.lang.upgrade_tasks_exist;
		}
	}else{
		if($('#hidden-fileType').val() == 1){
			if(photo == null){
				title += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+parent.lang.currently_no_upload_task;
			}else{
				title += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+parent.lang.upload_tasks_exist;
			}
		}else{
			if(config == null){
				title += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+parent.lang.currently_no_upload_task;
			}else{
				title += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+parent.lang.upload_tasks_exist;
			}
		}
	}
	api.title(title);
}

function initSelectData(){
	$('.td-fileVersion').empty();
	$('#select-fileVersion').remove();
	var files = [];
	var selectList = [];
	var task = null;
	if(isUpgrade){
		$('.td-fileType').parent().hide();
		$('.td-fileVersion').parent().find('th').text(parent.lang.fileVersionUpgrade);
		$('.td-filename').parent().find('th').text(parent.lang.upgrade_filename);
		$('#upgradeTip').text(parent.lang.upgrade_tip);
		files = getOflFiles();
		selectList = oflFiles;
		task = oflTask;
	}else{
		$('.td-fileType').parent().show();
		$('.td-fileVersion').parent().find('th').text(parent.lang.fileDescription);
		$('.td-filename').parent().find('th').text(parent.lang.alarm_file_name);
		$('#upgradeTip').text(parent.lang.upload_tip);
		if($('#hidden-fileType').val() == 1){
			files = getPhotoFiles();
			selectList = photoFiles;
			task = photo;
		}else{
			files = getConfigFiles();
			selectList = configFiles;
			task = config;
		}
	}
	$('.td-fileVersion').flexPanel({
		ComBoboxModel :{
			input : {name : 'fileVersion',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			combox: 
				{name : 'fileVersion', option : arrayToStr(files)}
		}	
	});
	$('#select-fileVersion li').each(function() {
		$(this).unbind('click');
		$(this).on('click',function(){
			var id = $.trim($(this).attr('data-index'));
			$('#combox-fileVersion').val(getArrayName(files,id));
			$('#hidden-fileVersion').val(id);
			for (var i = 0; i < selectList.length; i++) {
				if(selectList[i].id == id){
					$('#input-filename').val(selectList[i].fn);
					$('#input-uploaded').val(dateTime2TimeString(selectList[i].upl));
					$("#input-oflTask").val('');
				}
			}
			if(task != null){
				$('.td-fileVersion a').text(parent.lang.edit);
			}
			$('#select-fileVersion').hide();
		});
	});
	if(task == null){
		$('#combox-fileVersion').val('');
		$('#hidden-fileVersion').val('');
		$('#input-filename').val('');
		$('#input-uploaded').val('');
		$("#input-oflTask").val('');
	}else{
		$('.td-fileVersion').append('<div style="float:left;margin: 2px 5px 0px 10px;"><span class="edit" onclick="editOflTask()" title="'+parent.lang.edit+'"></span></div>');
		$('#combox-fileVersion').val(getArrayName(files,task.fid));
		$('#hidden-fileVersion').val(task.fid);
		for (var i = 0; i < selectList.length; i++) {
			if(selectList[i].id == task.fid){
				$('#input-filename').val(selectList[i].fn);
				$('#input-uploaded').val(dateTime2TimeString(selectList[i].upl));
			}
		}
		$("#input-oflTask").val(dateTime2TimeString(task.ct));
		$("#combox-fileVersion").attr({"disabled":"disabled"});
	}
	$("#input-filename").attr({"disabled":"disabled"});
	$("#input-uploaded").attr({"disabled":"disabled"});
	$("#input-oflTask").attr({"disabled":"disabled"});
	$('#combox-fileVersion').css('width','292px');
}