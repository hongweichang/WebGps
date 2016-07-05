var api = frameElement.api, W = api.opener;
var vehiIdno = decodeURIComponent(getUrlParameter('vehiIdno'));//车牌号

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
	
	//加载页面控件
	loadPageTable();
	
	//限制不能输入特殊字符
	cleanSpelChar('#input-TaskTag');
	cleanSpelChar('#textArea-remark');
	
	//保存
	$('.btnSave').on('click', ajaxSaveWifiTask);
	//退出
	$('.btnExit').on('click', function() {
		W.$.dialog({id:'downTask'}).close();
	});
}

//加载页面控件
function loadPageTable() {
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: '',pid : 'wifi-download-task',tip: '',hide:false,tabshide: false, headhide: true},
				colgroup:{width:['110px','330px']},
				tabs:{
					display: [parent.lang.plate_number, parent.lang.downloadTaskTag,parent.lang.monitor_task_date,
					          parent.lang.report_beginTime, parent.lang.report_endTime,
					          parent.lang.rule_downType, parent.lang.remark],
					name : ['vehiIdno', 'taskTag', 'taskDay', 'startTime', 'endTime', 'downType', 'remark'],
					type:['','input','input','input','input','','textArea'],
					length:[,240,10,10,10,,240]
				}
			}
		]
	});
	$(".td-vehiIdno").text(vehiIdno);
	$('#input-taskDay').on('click focus',function() {
		WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'});
	});
	$("#input-startTime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'}) });
	$("#input-endTime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'}) });
	$('#input-taskDay').addClass('Wdate');
	$('#input-taskDay').attr('readonly','readonly');
	$('#input-startTime').addClass('Wdate');
	$('#input-startTime').attr('readonly','readonly');
	$('#input-endTime').addClass('Wdate');
	$('#input-endTime').attr('readonly','readonly');
	var date = new Date();
	$("#input-taskDay").val(dateFormat2DateString(date));
	$("#input-startTime").val('00:00:00');
	$("#input-endTime").val('23:59:59');
	
	$('.td-downType').flexPanel({
		ComBoboxModel :{
			button :
			[
				[{
					display: parent.lang.all, name : 'downType', pid : 'downType', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
				}]
			],
			combox: {name : 'downType', option : arrayToStr(getDownTypes())}
		}	
	});
	$('#hidden-downType').val(1)
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.save, name : '', pclass : 'btnSave',
				bgcolor : 'gray', hide : false}],
			[{display: parent.lang.close, name : '', pclass : 'btnExit',
				bgcolor : 'gray', hide : false}]
		]
	});
}

//获取下载类型
function getDownTypes() {
	var downTypes = [];
	downTypes.push({id: 1,name: parent.lang.all});
	downTypes.push({id: 2,name: parent.lang.rule_video});
	downTypes.push({id: 3,name: parent.lang.rule_picture});
	downTypes.push({id: 4,name: parent.lang.rule_alarmVideo});
	downTypes.push({id: 5,name: parent.lang.rule_alarmPicture});
	return downTypes;
}

//保存wifi下载任务
function ajaxSaveWifiTask() {
	var data = {};
	data.vid = vehiIdno;
	
	var taskDay = $.trim($("#input-taskDay").val());
	var begTm = taskDay + ' ' + $.trim($("#input-startTime").val());
	var endTm =taskDay + ' ' + $.trim($("#input-endTime").val());
	if ($.trim(begTm) == '' || $.trim(endTm) == '' || dateCompareStrLongTime(begTm, endTm) > 0) {
		$.dialog.tips(parent.lang.vehicle_alarmaction_timeunvalid, 2);
		return;
	}
	data.btm = dateStrLongTime2Date(begTm);
	data.etm = dateStrLongTime2Date(endTm);
	data.typ = $.trim($('#hidden-downType').val());
	data.lab = $.trim($('#input-taskTag').val());
	if(data.lab.realLength() > 240) {
		$.dialog.tips(parent.lang.downloadTaskTagNotMoreThan, 2);
		$("#input-taskTag").focus();
		return;
	}
	data.mak = $.trim($('#textArea-remark').val());
	if(data.mak.realLength() > 240) {
		$.dialog.tips(parent.lang.monitor_remark_errorMessage, 2);
		$("#textArea-remark").focus();
		return;
	}
	data.atp = 0;
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action = 'StandardDownTaskAction_saveWifiDownTask.action';
	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.doAddSuccess();
		}
	});
}