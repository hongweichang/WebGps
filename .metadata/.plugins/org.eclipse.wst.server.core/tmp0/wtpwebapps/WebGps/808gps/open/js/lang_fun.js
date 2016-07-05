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
	if (navigator.userAgent.indexOf("IE") >= 0) { 
		//IE下的事件 
		otherJScipt.onreadystatechange = function () { 
			//IE下的判断，判断是否加载完成 
			if (otherJScipt && (otherJScipt.readyState == "loaded" || otherJScipt.readyState == "complete")) { 
				otherJScipt.onreadystatechange = null; 
				if (callback != null) {
					callback(); 
				}
			} 
		}; 
	} else { 
		otherJScipt.onload = function () { 
			otherJScipt.onload = null; 
			if (callback != null) {
				callback(); 
			}
		}; 
	} 
}

function langChange(local) {
	lang_local = local;
	//目前只支持中、英、繁
	if (langIsChinese()) {
		loadScript(getRootPathEx()+"/808gps/open/js/lang.js", function() {
			lang = new langChinese();
		});
	} else {
		loadScript(getRootPathEx()+"/808gps/open/js/lang_en.js", function() {
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

//js获取项目根路径，如： http://localhost:8083/xx
function getRootPathEx(){
//获取当前网址，如： http://localhost:8083/xx/xx/xx.jsp
	var curWwwPath=window.document.location.href;
	//获取主机地址之后的目录，如： xx/xx/xx.jsp
	var pathName=window.document.location.pathname;
	var pos=curWwwPath.indexOf(pathName);
	//获取主机地址，如： http://localhost:8083
	var localhostPaht=curWwwPath.substring(0,pos);
	//获取带"/"的项目名，如：/xx
	var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	return localhostPaht;
}