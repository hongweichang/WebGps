var api = frameElement.api, W = api.opener;
var alarmId = getUrlParameter('guids');//报警id

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
	
	//限制特殊字符
	cleanSpelChar('#textArea-handleContent');
	//保存
	$('.btnSave').on('click', ajaxSaveAlarmHandle);
	//退出
	$('.btnExit').on('click', function() {
		W.$.dialog({id:'alarmHandle'}).close();
	});
}

//加载页面控件
function loadPageTable() {
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: '',pid : 'vehicle-handle-content',tip: '',hide:false,tabshide: false, headhide: true},
				colgroup:{width:['110px','330px']},
				tabs:{
					display: [parent.lang.report_handle_content],
					name : ['handleContent'],
					type:['textArea'],
					length:[240]
				}
			}
		]
	});
	$('.td-handleContent').append('<span class="red">'+ parent.lang.monitor_messageMoreThan +'</span>');
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.save, name : '', pclass : 'btnSave',
				bgcolor : 'gray', hide : false}],
			[{display: parent.lang.close, name : '', pclass : 'btnExit',
				bgcolor : 'gray', hide : false}]
		]
	});
}

var ajaxObject = null;//发送请求对象
//保存报警处理
function ajaxSaveAlarmHandle() {
	if(alarmId == null || alarmId == '') {
		return;
	}
	var handleContent = $.trim($('#textArea-handleContent').val());
	if(handleContent.realLength() > 240) {
		$.dialog.tips(parent.lang.monitor_handle_content_errorMessage, 1);
		$('#textArea-handleContent').focus();
		return;
	}
	
	//再次发送前取消上一次发送
	if(ajaxObject != null) {
		ajaxObject.abort();
	}
	
	var data = {};
	data.vehiIdnos = alarmId; //报警GUID
	data.condiIdno = handleContent;
	$('body').flexShowLoading(true);
	$.myajax.jsonPost("StandardPositionAction_saveAlarmHandle.action", data, false, function(json, success) {
		$('body').flexShowLoading(false);
		if(success) {
			//报警处理成功后调用
			W.alarmHandleSuccess(alarmId, handleContent);
		}else {
			$.dialog.tips(parent.lang.saveFailure, 1);
		}
	});
}