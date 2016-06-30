var api = frameElement.api, W = api.opener;
var devIdno = getUrlParameter("devIdno");
var date = getUrlParameter("date");
var licheng = getUrlParameter("liCheng");

$(document).ready(function(){
	//加载语言
	loadLang();
	$('#licheng1').val(licheng);
	$('#licheng1').attr('disabled','disabled');
}); 

function loadLang(){
	$("#labelLiCheng1").text(parent.lang.monitor_labelLiCheng);
	$("#labelLiCheng2").text(parent.lang.monitor_newLiCheng);
	$("#save").text(parent.lang.save);
}

function disableForm(disable) {
	diableInput("#licheng1", disable, true);
	diableInput("#licheng2", disable, true);
}

function checkParam() {
	var ret = true;
	if(isNaN($('#licheng2').val()*1000)){
		alert(parent.lang.monitor_notLiCheng);
		ret = false;
	}
	return ret;
}

function ajaxSaveLiCheng() {
	if (!checkParam()) {
		return ;
	}

	var action = 'ReportNormalAction_updateDevDaily.action?devIdno=' + devIdno + "&date=" + date +'&licheng=' + $('#licheng2').val()*1000;
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, null, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		//关闭并退出对话框
		if (success) {
			W.doLiChengSuc();
		}
	});
}