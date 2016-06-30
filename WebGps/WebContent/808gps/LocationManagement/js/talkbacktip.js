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

function loadPage(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	if (parent.langIsChinese()) {//中文
		$('#stp-img1').attr('src', '../images/flash_mic_1.jpg');
		$('#stp-img2').attr('src', '../images/flash_mic_2.jpg');
	}else {
		$('#stp-img1').attr('src', '../images/flash_mic_1_en.jpg');
		$('#stp-img2').attr('src', '../images/flash_mic_2_en.jpg');
	}
	
	$("#step1").html(parent.lang.talkback_flashMicStep1);
	$("#step2").html(parent.lang.talkback_flashMicStep2);
	$("#step3").html(parent.lang.talkback_flashMicStep3);
}
