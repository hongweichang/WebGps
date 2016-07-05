var chineseMainTitle = null;
var englishMainTitle = null;
var twMainTitle = null;
var chineseCopyright = null;
var englishCopyright = null;
var twCopyright = null;

function initWebsitteLang() {
	jQuery.showmenu = function(showbtnid,showboxid) {
		var showmenubtn = $(showbtnid);
		var showmenubox = $(showboxid);
		showmenubtn.mouseenter(function(e){
			var thish = $(this).height();
			var offset = $(this).offset();
			var tipx = offset.left;
			var tipy = offset.top+thish-1;
			//alert(tipx); 
			showmenubox.show().css("left",tipx).css("top",tipy);
			t= setTimeout(function(){showmenubox.hide();},2000);
		  });
		showmenubox.mouseenter(function(){
			clearTimeout(t);
		});
		showmenubox.mouseleave(function(){
			$(this).hide();
		});
	};
	$.showmenu("#showmenu","#menubox");
	
	//初始化语言
	langInitByBrowser();
	//加载语言 
	loadWebsiteLang();
	//
	showLanguage();
	//
	ajaxLoadInformation();
}

function loadWebsiteLang(){
//	document.title = lang.title;
	$("#spanLangChinese").text(lang.lang_chinese);
	$("#spanLangEnglish").text(lang.lang_english);
	$("#spanLangChineseTW").text(lang.lang_chineseTW);
	$("#spanLangTurkey").text(lang.lang_turkey);
	$("#spanLangThai").text(lang.lang_thai);
	$("#spanLangPt").text(lang.lang_portugues);
	$("#spanLangAr").text(lang.lang_arabic);
	$("#spanLangEs").text(lang.lang_spanish);
	$("#spanLangRu").text(lang.lang_russian);
	$("#spanLangBg").text(lang.lang_bulgarian);
	$("#language").text(lang.website_language);
	$("#gpsTitle").text(lang.sysTitle);
	$("#usrLogin").text(lang.login_usrLogin);
	$("#spanHome").text(lang.website_home);
	$("#spanDownload").text(lang.website_download);
	$("#spanQuestion").text(lang.website_question);
	showTitleAndCopyRight();
}

function showTitleAndCopyRight() {
	if (langIsChinese()) {
		if (chineseMainTitle != null)  {
			document.title = chineseMainTitle;
		}
		if (chineseCopyright != null) {
			$("#spanCopyright").html(chineseCopyright);
		}
	} else if (langIsTW()){
		if (twMainTitle != null)  {
			document.title = twMainTitle;
		}
		if (twCopyright != null) {
			$("#spanCopyright").html(twCopyright);
		}
	} else {
		if (englishMainTitle != null)  {
			document.title = englishMainTitle;
		}
		if (englishCopyright != null) {
			$("#spanCopyright").html(englishCopyright);
		}
	}
}

function showLanguage() {
	/*
	if(langIsChinese()) {
		$("#changeChinese").hide();
		$("#changeEnglish").show();
		$("#changeTw").show();
	} else if(langIsTW()) {
		$("#changeChinese").show();
		$("#changeEnglish").show();
		$("#changeTw").hide();
	} else {
		$("#changeChinese").show();
		$("#changeEnglish").hide();
		$("#changeTw").show();
	}*/
}

//切换语言
function switchLanguage(lang) {
	langChange(lang);
	loadWebsiteLang();
	loadLang();
	SetCookie("language", lang);
	showLanguage();
	$("#menubox").hide();
}

function ajaxLoadInformation() {
	//向服务器发送ajax请求
	$.myajax.jsonGet("LoginAction_information.action", function(json,action,success){
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
