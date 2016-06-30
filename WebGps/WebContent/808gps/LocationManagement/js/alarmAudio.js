var api = frameElement.api, W = api.opener;
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
	loadLang();
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.upload, name : '', pclass : 'btnUpload',
				bgcolor : 'gray', hide : false}]
		]
	});
	//如果是ie8，则直接点击选择文件
//	if(isBrowseIE8()) {
//		$('#selectedAudio').hide();
//		$('#selAudio').show();
//	}
	//初始化音频属性
	initAlarmSound();
	
	//初始化发送信息列表
	initAudioTable();
	
	cleanSpelChar('.filename');
	cleanSpelChar('#descText');
	
	//上传音频文件
	$('.btnUpload').on('click', uploadAudioFile);
}

function loadLang() {
	$('#labelUpLoad').text(parent.lang.vehicle_alarmaction_labelUploadAudio);
	$('#spanFileName').text(parent.lang.vehicle_alarmaction_labelFileName);
	$('#spanFileNameTip').text(parent.lang.vehicle_alarmaction_audioFileNameTip);
	$('#messageNotMore').text(parent.lang.monitor_messageMoreThan);
	$('#spanFileDesc').text(parent.lang.vehicle_alarmaction_labelFileDesc);
	$('#audioList').text(parent.lang.vehicle_alarmaction_audioList);
	$('#selectedAudio').append(parent.lang.vehicle_alarmaction_selAudioFile);
	$('#updateAudioTip').text(parent.lang.vehicle_alarmaction_selAudioTip);
}

//初始化发送信息列表
function initAudioTable() {
//	var buttons = [
//  	    {separator: false, hidename: "", name: parent.lang.del, bclass: "delete",
//  	    	bimage: "", tooltip: parent.lang.del, id: "delAlarm",
//  	    	onpress: function() {$("#ttsInfoTable").flexClear();}
//  	    }
//  	];
	$("#audioTable").flexigrid({
		url: "StandardAlarmMotionAction_getAudioPaginList.action",	//StandardTrackAction_query.action
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.alarm_file_name, name : 'name', width : 180, sortable : false, align: 'center'},
			{display: parent.lang.report_log_desc, name : 'desc', width : 320, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'}
			],
			pernumber: parent.lang.pernumber,
			pagestat: parent.lang.pagestatInfo,
			pagefrom: parent.lang.pagefrom,
			pagetext: parent.lang.page,
			pagetotal: parent.lang.pagetotal,
//			checkbox: true,
			findtext: parent.lang.find,
			procmsg: parent.lang.procmsg,
			nomsg : parent.lang.nomsg,
	//		buttons: buttons,
			usepager: true,
			autoload: true,
			useRp: true,
			title: false,
			rp: 15,
			showTableToggleBtn: false,
			showToggleBtn: false,
			width: 760,
			onSubmit: false,
			height: 'auto'
	});
	loadReportTableWidth(fixHeight);
}

function fixHeight() {
	$('#audioTable').flexFixHeight();
}

function getColumnTitle(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

//填充tts信息列表
function fillCellInfo(p, row, idx, index){
	var name = p.colModel[idx].name;
	var ret = "";
	if(name == 'name') {
		ret = getColumnTitle(row['sds']+'.mp3');
	}else if(name == 'desc') {
		ret = getColumnTitle(row['dec']);
	}else if(name == 'operator'){
		ret += '<a class="sound" href="javascript:listenAudio('+row['uid']+',\''+row['sds']+'\');" title="'+parent.lang.vehicle_alarmaction_audioListen+'"></a>';
		ret += '<a class="select" href="javascript:selectAudio('+row['id']+',\''+row['sds']+'\');" title="'+parent.lang.select+'"></a>';
		if(row['uid'] != 0) {
			ret += '<a class="delete" href="javascript:deleteAudio('+row['id']+',\''+row['sds']+'\');" title="'+parent.lang.del+'"></a>';
		}
	}else {
		ret = row[name];
	}     
	return ret;
}

//上传音频文件
function uploadAudioFile() {
	//判断参数
	var fileName = $.trim($('.filename').val());
	if(fileName == '') {
		$.dialog.tips(parent.lang.vehicle_alarmaction_fileNameNotNull, 1);
		$(".filename").focus();
		return;
	}
//	var isNum = /[^\w\.\/]/ig;
//	if(isNum.test(fileName)){
//		$.dialog.tips(parent.lang.vehicle_alarmaction_notHaveChinese, 1);
//		$(".filename").focus();
//		return;
//	}
	
	if(fileName.realLength() > 40) {
		$.dialog.tips(parent.lang.vehicle_alarmaction_fileNameNotMoreThan, 1);
		$(".filename").focus();
		return;
	}
	
	//判断描述
	var fileDesc = $.trim($('#descText').val());
	if(fileDesc.realLength() > 240) {
		$.dialog.tips(parent.lang.vehicle_alarmaction_fileDescNotMoreThan, 1);
		$("#descText").focus();
		return;
	}
	//判断文件后缀
	var file = $('#selAudio').val();
	if(file == '') {
		$.dialog.tips(parent.lang.vehicle_alarmaction_fileNotNull, 1);
		return;
	}
	var exts = file.split(".");
	var ext=exts[exts.length - 1].toLowerCase();
    if (ext != "mp3"){
    	$.dialog.tips(parent.lang.vehicle_alarmaction_errorFile, 1);
    	return; 
    }
    disableForm(true);
	$.myajax.showLoading(true, parent.lang.uploading);
	//ajax 提交文件
	$("#audioForm").ajaxSubmit({
		url:'StandardAlarmMotionAction_uploadAudio.action',
		type:"post",
		dataType:"JSON",
		cache:false,/*禁用浏览器缓存*/
		resetForm: true,
		clearForm: true,
		success: function(json){
			disableForm(false);
			$.myajax.showLoading(false);
			if(json.result == 0){
				//刷新列表
				$("#audioTable").flexReload();
				//刷新上级音频文件列表
				var name = fileName +'.mp3';
				W.refreshAddAudioFile(name);
				$.dialog.tips(parent.lang.update_ok, 1);
			}else if (json.result == 2) {
				//直接跳转到登录界面
				top.window.location = "login.html";
			} else {
				if(json.result == 41) {
					alert(parent.lang.vehicle_alarmaction_errImageSize);
				}else {
					showErrorMessage(json.result);
				}
			}
		},error:function(data){
			disableForm(false);
			$.myajax.showLoading(false);
		}
	});
}

//选择音频文件
function selectAudio(id, name) {
	name = name +'.mp3';
	W.doSelSuccess(id, name);
}

//删除音频文件
function deleteAudio(id, name) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost("StandardAlarmMotionAction_deleteAudioFile.action?id="+id, null, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			//刷新列表
			$("#audioTable").flexReload();
			//删除音频文件刷新联动列表
			name = name +'.mp3';
			W.refreshAlarmMotion(name);
		}
	});
}

//初始化声音控件
function initAlarmSound() {
	var audio_div = document.createElement('div');
	audio_div.id = 'alarmAudioDiv';
	$(audio_div).css({'width':'0px','height':'0px'});
	$(audio_div).css("marginLeft",'-1000px');
	var audio = document.createElement("audio");
	//html5支持audio
	if((typeof audio.load) != 'function') {
		$('body').append(audio_div);
	}
}

//  试听音频文件
function listenAudio(uid, name){
	//如果正在播放,跳过
	var audio = document.createElement("audio");
	if(audio != null && (typeof audio.load) == 'function') {
		if(audio.canPlayType("audio/mpeg")) {
			audio.src = 'sounds/' + uid + '/' + audioFileEncodeURI(audioFileEncodeURI(name)) +'.mp3';
		}else if(audio.canPlayType("audio/ogg")) {
			audio.src = 'sounds/'+ uid + '/' + audioFileEncodeURI(audioFileEncodeURI(name)) +'.ogg';
		}
		//音频加载完成后自动播放
		audio.autoplay = true;
	}else {
		//不支持html5  ie8
		$('#alarmAudioDiv #emp3').remove();
		$('#alarmAudioDiv #eogg').remove();
		
		var content = '<embed id="emp3" src="sounds/'+ uid + '/' + audioFileEncodeURI(audioFileEncodeURI(name)) +'.mp3" hidden="no" autostart=true style="width:0px;height:0px;"/>';
		content += '<embed id="eogg" src="sounds/'+ uid + '/' + audioFileEncodeURI(audioFileEncodeURI(name)) +'.ogg" hidden="no" autostart=true style="width:0px;height:0px;"/>';
		 
		$('#alarmAudioDiv').append(content);
	}
}

//图片显示
function previewImage(file) {
	var names = file.value.split("\\");
	var i= names.length;
	var exts = names[i-1].split(".");
	var j = exts.length;
	var ext = exts[j-1].toLowerCase();
    if (ext != "mp3"){
    	 $(file).val("");
    	alert(parent.lang.vehicle_alarmaction_errorFile);
    	return; 
    }
    $('.filename').val(exts[0]);
}