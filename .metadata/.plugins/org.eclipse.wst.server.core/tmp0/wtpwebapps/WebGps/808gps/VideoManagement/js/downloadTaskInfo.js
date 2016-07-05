var api = frameElement.api, W = api.opener;
var id = getUrlParameter('id');
var chn = getUrlParameter('chn');
var videoInfo = null;
$(document).ready(function(){
	setTimeout(loadReadyPage, 50);
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}
function loadPage(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip: '',hide:false,tabshide: false, headhide: true},
				colgroup:{width:['120px','320px']},
				tabs:{
					display: [parent.lang.labelBegintime,parent.lang.labelEndtime,parent.lang.labelDownloadTaskTag],
					name : ['startTime','endTime','TaskTag'],
					type:['input','input','input'],
					length:[32,32,240]
				}
			}
		]
	});
	
	$('.td-startTime').append('<span class="startTimeTip red"></span>');
	$('.td-endTime').append('<span class="endTimeTip red"></span>');
	$('.labelTip').text(parent.lang.downloadTaskTip);
	$('.labelTip2').text(parent.lang.downloadTaskSvrTip);
	
	$("#input-startTime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}) });
	$("#input-endTime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}) });
	$('#input-startTime').addClass('Wdate');
	$('#input-startTime').attr('readonly','readonly');
	$('#input-endTime').addClass('Wdate');
	$('#input-endTime').attr('readonly','readonly');
	
	initFileInfo(id, chn);
	
	cleanSpelChar('#input-TaskTag');
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.save, name : '', pclass : 'btnSave',
				bgcolor : 'gray', hide : false}],
		[{display: parent.lang.cancel, name : '', pclass : 'btnCancel',
			bgcolor : 'gray', hide : false}]
		]
	});
	
	$('.btnSave').on('click', doSaveTaskInfo);
	
	$('.btnCancel').on('click',function() {
		W.$.dialog({id:'taskInfo'}).hide();
	});
	
}

//初始化文件信息
function initFileInfo(id, chn_) {
	//获取视频文件信息
	chn = chn_;
	videoInfo = W.videoPlayer.videoFileList.get(Number(id));
	$("#input-startTime").val(videoInfo.beginDate);
	$("#input-endTime").val(videoInfo.endDate);
	$('.startTimeTip').text('(>= '+ videoInfo.beginDate +')');
	$('.endTimeTip').text('(<= '+ videoInfo.endDate +')');
	$('#input-TaskTag').val('');
}

//保存任务
function doSaveTaskInfo() {
	var data = {};
	var begTm = $.trim($("#input-startTime").val());
	var endTm = $.trim($("#input-endTime").val());
	if (dateCompareStrLongTime(begTm, endTm) > 0) {
		$.dialog.tips(parent.lang.vehicle_alarmaction_timeunvalid, 2);
		return;
	}
	data.lab = $.trim($("#input-TaskTag").val());
	if(data.lab.length > 240) {
		$.dialog.tips(parent.lang.downloadTaskTagNotMoreThan, 2);
		$("#input-TaskTag").focus();
		return;
	}
	var moreThanBeg = dateCompareStrLongTime(videoInfo.beginDate, begTm);
	var moreThanEnd = dateCompareStrLongTime(endTm, videoInfo.endDate);
	if (moreThanBeg > 0) {
		$.dialog.tips(parent.lang.timeRangOverDefault, 2);
		$("#input-startTime").focus();
		return;
	}
	data.fbtm  = dateStrLongTime2Date($.trim($("#input-startTime").val()));
	
	if (moreThanEnd > 0) {
		$.dialog.tips(parent.lang.timeRangOverDefault, 2);
		$("#input-endTime").focus();
		return;
	}
	data.fetm  = dateStrLongTime2Date($.trim($("#input-endTime").val()));
	
	if(moreThanBeg < 0 || moreThanEnd < 0) {
		data.dtp = 2;
	}else {
		//设备有直接下载的权限并且不能满足只能分段下载的要求
		if(videoInfo.isDirect && !videoInfo.isSegment) {
			data.dtp = 1;
		}else {
			data.dtp = 2;
		}
	}
	data.sbtm  = dateStrLongTime2Date(videoInfo.beginDate);
	data.setm  = dateStrLongTime2Date(videoInfo.endDate);
	data.did = videoInfo.devIdno;
	data.ftp = 2;
	data.fph = videoInfo.file;
	data.vtp = videoInfo.type;
	data.len = videoInfo.len;
	if(chn != null) {
		data.chn = chn;
	}else {
		data.chn = videoInfo.chn;
	}
	
	var action = 'StandardVideoTrackAction_addDownloadTask.action';
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.doSaveTaskInfoSuc();
		}
	});
}