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

//追加js到head
function loadScript(src, callback) {
	var otherJScipt = document.createElement("script");
	otherJScipt.setAttribute("type", "text/javascript"); 
	otherJScipt.setAttribute("src", src); 
	var heads = document.getElementsByTagName("head");//追加到head标签内
	if(heads.length) {
		heads[0].appendChild(otherJScipt);
	} else {
    	doc.documentElement.appendChild(otherJScipt);
    }
	//判断服务器 
	if(typeof otherJScipt.onreadystatechange != 'undefined') {
		otherJScipt.onreadystatechange = function () { 
			//IE下的判断，判断是否加载完成 
			if (otherJScipt && (otherJScipt.readyState == "loaded" || otherJScipt.readyState == "complete")) { 
				otherJScipt.onreadystatechange = null; 
				if (callback != null) {
					callback(); 
				}
			} 
		}; 
	}else if(typeof otherJScipt.onload != 'undefined') {
		otherJScipt.onload = function () { 
			otherJScipt.onload = null;
			if (callback != null) {
				callback(); 
			}
		};
	}else {
		if (callback != null) {
			callback(); 
		}
	}
}

function langChange(local) {
	lang_local = local;
	//目前只支持中、英、繁
	if (langIsChinese()) {
		loadScript("js/lang.js", function() {
			lang = new langChinese();
		});
	} else if (langIsTW()) {
		loadScript("js/lang_tw.js", function() {
			lang = new langTW();
		});
/*	} else if (langIsTurkey()) {
		lang = new langTurkey();
	} else if (langIsThai()) {
		lang = new langThai();
	} else if (langIsPt()) {
		lang = new langPortugues();
	} else if (langIsAr()) {
		lang = new langArabic();
	} else if (langIsEs()) {
		lang = new langSpanish();
	}else if (langIsBulgarian()) {
		lang = new langBulgarian();
	} else if (langIsRussian()) {
		lang = new langRussian();*/
	} else if (langIsRomanian()) {
		loadScript("js/lang_ro.js", function() {
			lang = new langRomanian();
		});
	} else {
		loadScript("js/lang_en.js", function() {
			lang = new langEnglish();
		});
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

//初始化默认语言选择
function initSwitchLanguage() {
	var mod = [];
	mod.push({
		display: lang.lang_chinese,
		title: lang.lang_chinese,
		name: 'lang-zh',
		pclass: 'clearfix',
		preicon : true
	});
	mod.push({
		display: lang.lang_english,
		title: lang.lang_english,
		name: 'lang-en',
		pclass: 'clearfix',
		preicon : true
	});
	mod.push({
		display: lang.lang_chineseTW,
		title: lang.lang_chineseTW,
		name: 'lang-tw',
		pclass: 'clearfix',
		preicon : true
	});
	mod.push({
		display: lang.lang_romanian,
		title: lang.lang_romanian,
		name: 'lang-ro',
		pclass: 'clearfix',
		preicon : true
	});
	$('.language').flexPanel({
		TabsModel : mod
	});
	
	$('.language li').on('click', function() {
		$(this).addClass('current').siblings().removeClass("current");
		$('.language ul').removeClass('show');
		$('.wy-mod-lang .carat').removeClass('show');
		langChange($(this).attr('data-tab').split('-')[1]);
		SetCookie("language", $(this).attr('data-tab').split('-')[1]);
		document.location.reload();
	});
	
	$('body').click(function(event) {
		var obj = event.srcElement ? event.srcElement : event.target;
		if(obj != $('.wy-mod-lang .switch-span')[0] && obj != $('.wy-mod-lang .carat')[0]) {
			$('.language ul').removeClass('show');
			$('.wy-mod-lang .carat').removeClass('show');
		}
	});

	if(langCurLocal() == 'zh') {
		$('.lang-zh').addClass('current');
		$(".wy-mod-lang .switch-span").addClass('chineseLang');
	}else if(langCurLocal() == 'tw') {
		$('.lang-tw').addClass('current');
		$(".wy-mod-lang .switch-span").addClass('traditionalLang');
	}else if(langCurLocal() == 'ro') {
		$('.lang-ro').addClass('current');
		$(".wy-mod-lang .switch-span").addClass('romanianLang');
	}else {
		$('.lang-en').addClass('current');
		$(".wy-mod-lang .switch-span").addClass('englishLang');
	}

	$(".englishLang").text(lang.lang_english);
	$(".chineseLang").text(lang.lang_chinese);
	$(".traditionalLang").text(lang.lang_chineseTW);
	$(".romanianLang").text(lang.lang_romanian);
//	$(".switch-span").text(lang.switching);
//	$(".wy-mod-lang H2 .text").text(lang.currentLanguage);

	$('.wy-mod-lang .switch-div').on('click',function() {
		if($('.carat', this).hasClass('show')) {
			$('.language ul').removeClass('show');
			$('.carat', this).removeClass('show');
		}else {
			$('.language ul').addClass('show');
			$('.carat', this).addClass('show');
		}
		var that = this;
		$('.language ul').mouseleave(function(){
			$(this).removeClass('show');
			$('.carat', that).removeClass('show');
		});
	});
}

//初始化华宝语言选择
function initHBSwitchLanguage() {
	var content_ = '';
	if(langCurLocal() == 'zh') {
		$('#currentLang span').text(lang.lang_chinese);
		content_ = '<li data-tab="en"><a href="javascript:;" class="englishLang"><span></span></a></li>';
	}else {
		$('#currentLang span').text(lang.lang_english);
		content_ = '<li data-tab="zh"><a href="javascript:;" class="chineseLang"><span></span></a></li>';
	}
	$('#langBox').append(content_);
	
	$(".englishLang span").text(lang.lang_english);
	$(".chineseLang span").text(lang.lang_chinese);
	
	$('#langBox li').on('click', function() {
		langChange($(this).attr('data-tab'));
		SetCookie("language", $(this).attr('data-tab'));
		document.location.reload();
	});
	
	$(".fy_j").on('mouseover hover', function() {
		$(this).find("ul").show();
	}).on('mouseout', function() {
		$(this).find("ul").hide();
	});
}