function getUrlParameter(name){
	if(location.search==''){
		return '';
	}
	
	var o={};
	var search=location.search.replace(/\?/,'');//只替换第一个问号,如果参数中带有问号,当作普通文本
	var s=search.split('&');
	for(var i=0;i<s.length;i++){
		o[s[i].split('=')[0]]=s[i].split('=')[1];
	}
	var ret = '';
	if (o[name]!=undefined) {
		ret = o[name];
	}
	s=ret.split('%26');
	if (s.length > 0) {
		return s[0];
	} else {
		return ret;
	}
}

// JavaScript Document
function loadjscssfile(filename,filetype){
	if(filetype == "js"){
	    var fileref = document.createElement('script');
	    fileref.setAttribute("type","text/javascript");
	    fileref.setAttribute("src",filename);
	}else if(filetype == "css"){
	
	    var fileref = document.createElement('link');
	    fileref.setAttribute("rel","stylesheet");
	    fileref.setAttribute("type","text/css");
	    fileref.setAttribute("href",filename);
	}
   if(typeof fileref != "undefined"){
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }   
}

var initZoom = null;
var initJingDu = null;
var initWeiDu = null;
var initParseAddress = true;
var isChrome = false;
	
//初始化
function initCommon(themePath) {
	var theme = getUrlParameter("theme");
	if (theme == "") {
		theme = "default";
	}
	loadjscssfile(themePath + theme + ".css","css");
	
	var language = getUrlParameter("lang");
	if (language == "english") {
		lang = new languageEnglish();
	} else if (language == "chinese") {
		lang = new languageChinese();
	} else if (language == "thai") {
		lang = new languageThai();
	} else if (language == "chinese traditional") {
		lang = new languageTw();
	} else if (language == "turkey") {
		lang = new languageTurkey();
	} else if (language == "spanish") {
		lang = new languageSpanish();
	} else if (language == "arabic") {
		lang = new languageArabic();		
	} else if (language == "portugues") {
		lang = new languagePortugues();
	} else {
		lang = new languageEnglish();
	}
//	document.getElementById('spanMapBaidu').innerText = lang.mapBaidu;
//	document.getElementById('spanMapGoogle').innerText = lang.mapGoogle;
//	document.getElementById('spanMapMapInfo').innerText = lang.mapMapInfo;

	initZoom = getUrlParameter("zoom");
	initJingDu = getUrlParameter("jingDu");
	initWeiDu = getUrlParameter("weiDu");
	var tool = getUrlParameter("tool");
//	document.getElementById("addPoint").title = lang.addPoint;
//	document.getElementById("addRectangle").title = lang.addRectangle;
//	document.getElementById("addPolygon").title = lang.addPolygon;
//	document.getElementById("addLine").title = lang.addLine;
//	document.getElementById("btnSearch").title = lang.btnSearch;
//	document.getElementById("btnFullScreen").title = lang.fullScreen;
//	document.getElementById("btnCenter").title = lang.btnCenter;
//	document.getElementById("btnExpand").title = lang.expand;
//	if (parseInt(tool)) {
//		document.getElementById('addPoint').style.display = "";
//		document.getElementById('addRectangle').style.display = "";
//		document.getElementById('addPolygon').style.display = "";
//		document.getElementById('addLine').style.display = "";
//		document.getElementById('btnSearch').style.display = "";
//		document.getElementById('btnFullScreen').style.display = "";
//		document.getElementById('btnCenter').style.display = "";
//		document.getElementById('btnExpand').style.display = "";
//		document.getElementById("selectMap").style.display = "";
//	}
//	
	//if ( parseInt(getUrlParameter("parseAddress")) > 0 ) {
		initParseAddress = true;
	//} else {
	//	initParseAddress = false;
	//}
	isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1 ? true : false;
}

function showMapSelect() {
	document.getElementById('mapMenu').className = "h2_cat_type active_cat_type";
}

function hideMapSelect() {
	document.getElementById('mapMenu').className = "h2_cat_type";
}

function showAddressTip(tip) {
	document.getElementById("overVehicleAddress").innerHTML=tip;
}