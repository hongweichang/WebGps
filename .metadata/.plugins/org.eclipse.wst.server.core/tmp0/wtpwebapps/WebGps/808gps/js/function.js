$(document).ready(function(){
	langInitByBrowser();
	loadReadyPage();
});

function loadReadyPage() {
	if (typeof lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		//加载语言 
		loadLang();
		//初始化语言选择
		initSwitchLanguage();
		ajaxLoadDownload();
		ajaxLoadInformation();
	}
}

function loadLang(){
	$("#spanDownClient").text(lang.website_download_now);
	$("#spanHome").text(lang.website_home);
	$("#spanFunction").text(lang.website_function);
	$("#spanOpenApi").text(lang.website_openApi);
	//document.title = lang.title;
	//$("#spanTitle").text(lang.title);
	$("#position-location").text(lang.function_position_location);
	$("#position-location-info").text(lang.function_position_location_info);
	$("#video-surveillance").text(lang.function_video_surveillance);
	$("#video-surveillance-info").append(lang.function_video_surveillance_info);
	$("#download-storage").text(lang.function_download_storage);
	$("#download-storage-info").append(lang.function_download_storage_info);
	$("#image-capture").text(lang.function_image_capture);
	$("#image-capture-info").append(lang.function_image_capture_info);
	$("#track-playback").text(lang.function_track_playback);
	$("#track-playback-info").append(lang.function_track_playback_info);
	$("#voice-intercom").text(lang.function_voice_intercom);
	$("#voice-intercom-info").append(lang.function_voice_intercom_info);
	$("#platforms").text(lang.function_platforms);
	$("#platforms-info").text(lang.function_platforms_info);
	$("#phone").text(lang.function_phone);
	$("#phone-info").text(lang.function_phone_info);
	$("#statistical-reports").text(lang.function_statistical_reports);
	$("#statistical-reports-info").append(lang.function_statistical_reports_info);
	$("#information-management").text(lang.function_information_management);
	$("#information-management-info").text(lang.function_information_management_info);
	$('.pic_text .t1').text(lang.function_user_management);
	$('.pic_text .t2').text(lang.function_vehicle_management);
	$('.pic_text .t3').text(lang.function_ad );
	$('.pic_text .t4').text(lang.function_goods);
}

function ajaxLoadDownload() {
	//向服务器发送ajax请求
	$.myajax.jsonGet("LoginAction_download.action?language=" + langCurLocal(), function(json,action,success){
		if (success) {
			if (typeof json.lstDown != undefined && json.lstDown != null) {
				downList = json.lstDown;
				showDownList();
			}
		}
	}, null);
}

var chineseMainTitle = null;
var englishMainTitle = null;
var twMainTitle = null;
var chineseCopyright = null;
var englishCopyright = null;
var twCopyright = null;
function ajaxLoadInformation() {
	//向服务器发送ajax请求
	$.myajax.jsonGet("StandardLoginAction_information.action", function(json,action,success){
		if (success) {
			chineseMainTitle = json.ChineseMainTitle;
			englishMainTitle = json.EnglishMainTitle;
			twMainTitle = json.TwMainTitle;
			chineseCopyright = json.ChineseCopyright;
			englishCopyright = json.EnglishCopyright;
			twCopyright = json.TwCopyright;
			showTitleAndCopyRight();
		}
	}, null);
}

function showTitleAndCopyRight() {
	if (langIsChinese()) {
		if (chineseMainTitle != null)  {
			document.title = chineseMainTitle;
			$('#spanTitle').text(chineseMainTitle);
		}
		if (chineseCopyright != null) {
			$("#spanCopyright").html(chineseCopyright);
		}
	} else if (langIsTW()){
		if (twMainTitle != null)  {
			document.title = twMainTitle;
			$('#spanTitle').text(twMainTitle);
		}
		if (twCopyright != null) {
			$("#spanCopyright").html(twCopyright);
		}
	} else {
		if (englishMainTitle != null)  {
			document.title = englishMainTitle;
			$('#spanTitle').text(englishMainTitle);
		}
		if (englishCopyright != null) {
			$("#spanCopyright").html(englishCopyright);
		}
	}
}

function showDownList() {
	if (downList != null) {
		$("#clientDownload").show();
		$("#hrefClientDown").attr("href", "../" + downList[0].url);
	}
}