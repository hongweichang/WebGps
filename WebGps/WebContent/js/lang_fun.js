var lang_local;	//本地语言
var	lang;	//语言对象，通过调用lang.lable来获取语言信息

//初始化语言，跟据浏览器的语言
function langInitByBrowser() {
	//先从Cookie中获取语言参数
	var local = GetCookie("language");
	if (local == null) {
		//再跟据浏览器语言获取语言参数
		if (navigator.userAgent.indexOf('MSIE') >= 0){
			local = navigator.browserLanguage;
		}else if(navigator.userAgent.indexOf('Firefox') >= 0 || navigator.userAgent.indexOf('Chrome') >= 0 
				|| navigator.userAgent.indexOf('Opera') >= 0 || navigator.userAgent.indexOf('Mozilla') >= 0){
			local = navigator.language;
		} else {
			local = navigator.language;
		}
	   	if (local.indexOf('en') > -1){
	   		local = "en";
	   	} else if(local.indexOf('CN') > -1 || local.indexOf('cn') > -1){
	   		local = "zh";
	   	} else if(local.indexOf('TW') > -1 || local.indexOf('tw') > -1){
	   		local = "tw";
	   	} else if(local.indexOf('TR') > -1 || local.indexOf('tr') > -1){
	   		local = "tr";
	   	} else if(local.indexOf('TH') > -1 || local.indexOf('th') > -1){
	   		local = "th";
	   	} else if(local.indexOf('PT') > -1 || local.indexOf('pt') > -1){
	   		local = "pt";
	   	} else if(local.indexOf('AR') > -1 || local.indexOf('ar') > -1){
	   		local = "ar";
	   	} else if(local.indexOf('es') > -1 || local.indexOf('es') > -1){
	   		local = "es";
	   	} else if(local.indexOf('BG') > -1 || local.indexOf('bg') > -1){
	   		local = "bg";
	   	} else if(local.indexOf('RU') > -1 || local.indexOf('ru') > -1){
	   		local = "ru";
	   	} else if(local.indexOf('RO') > -1 || local.indexOf('ro') > -1){
	   		local = "ro";
	   	} else {
	   		local = "en";	//默认为英文版本
	   	}
	}
  	langChange(local);
}

//初始化语言，跟据Url参数，在URL后面跟着  xxx.html?lang=zh
function langInitByUrl() {
	var local = getUrlParameter("lang");
	if (local == "") {
		langInitByBrowser();
	} else {
		langChange(local);
	}
}

function langChange(local) {
	lang_local = local;
	if (langIsChinese()) {
		lang = new langChinese();
	} else if (langIsTW()) {
		lang = new langTW();
	} else if (langIsTurkey()) {
		lang = new langTurkey();
	} else if (langIsThai()) {
		lang = new langThai();
	} else if (langIsPt()) {
		lang = new langPortugues();
	} else if (langIsAr()) {
		lang = new langArabic();
	} else if (langIsEs()) {
		lang = new langSpanish();
	} else if (langIsBulgarian()) {
		lang = new langBulgarian();
	} else if (langIsRussian()) {
		lang = new langRussian();
	} else if (langIsRomanian()) {
		lang = new langRomanian();
	} else {
		lang = new langEnglish();
	}
}

function langIsChinese() {
	if (lang_local == "zh") {
		return true;
	} else {
		return false;
	}
}

function langIsTW() {
	if (lang_local == "tw") {
		return true;
	} else {
		return false;
	}
}

function langIsTurkey() {
	if (lang_local == "tr") {
		return true;
	} else {
		return false;
	}
}

function langIsThai() {
	if (lang_local == "th") {
		return true;
	} else {
		return false;
	}
}

function langIsPt() {
	if (lang_local == "pt") {
		return true;
	} else {
		return false;
	}
}

function langIsAr() {
	if (lang_local == "ar") {
		return true;
	} else {
		return false;
	}
}

function langIsEs() {
	if (lang_local == "es") {
		return true;
	} else {
		return false;
	}
}

function langIsBulgarian() {
	if (lang_local == "bg") {
		return true;
	} else {
		return false;
	}
}

function langIsRussian() {
	if (lang_local == "ru") {
		return true;
	} else {
		return false;
	}
}

function langIsRomanian() {
	if (lang_local == "ro") {
		return true;
	} else {
		return false;
	}
}

function langCurLocal() {
	return lang_local;
}

function langWdatePickerCurLoacl() {
	if (lang_local == "zh") {
		return "zh-cn";
	} else if (lang_local == "tw") {
		return "zh-tw";
	} else {
		return "en";
	}
}