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
	} else if (language == "bulgarian") {
		lang = new languageBulgarian();
	} else {
		lang = new languageEnglish();
	}
	$("#spanMap3").text(lang.mapBaidu);
	$("#spanMap0").text(lang.mapGoogle);
	$("#spanMap1").text(lang.mapMapInfo);
	$("#spanMap8").text(lang.mapArcGis);
	$("#spanMap9").text(lang.mapMapBar);
	
	initZoom = getUrlParameter("zoom");
	initJingDu = getUrlParameter("jingDu");
	initWeiDu = getUrlParameter("weiDu");
	var tool = getUrlParameter("tool");
	
	$("#zoomIn").attr("title", lang.tipZoomIn);
	$("#zoomOut").attr("title", lang.tipZoomOut);
	$("#addCircle").attr("title", lang.tipAddCircle);
	$("#distance").attr("title", lang.tipDistance);
	
	$("#addPoint").attr("title", lang.addPoint);
	$("#addRectangle").attr("title", lang.addRectangle);
	$("#addPolygon").attr("title", lang.addPolygon);
	$("#addLine").attr("title", lang.addLine);

	$("#btnSearch").attr("title", lang.btnSearch);
	$("#btnFullScreen").attr("title", lang.fullScreen);
	$("#btnCenter").attr("title", lang.btnCenter);
	$("#btnExpand").attr("title", lang.expand);
	
	$("#btnCruise").attr("title", lang.tipCruise);
	$("#btnCountry").attr("title", lang.tipCountry);
	$("#btnArea").attr("title", lang.tipArea);
	$("#btnPrint").attr("title", lang.tipPrint);
	$("#btnCapture").attr("title", lang.tipCapture);
	
	if (parseInt(tool)) {
		
		$("#zoomIn").show();
		$("#zoomOut").show();
		$("#addCircle").show();
		$("#distance").show();
		$("#addPoint").show();
		$("#addRectangle").show();
		$("#addPolygon").show();
		$("#addLine").show();
		
		$("#btnSearch").show();
		$("#btnFullScreen").show();
		$("#btnCenter").show();
		$("#btnExpand").show();
		
		$("#btnCruise").show();
		$("#btnCountry").show();
		$("#btnArea").show();
		$("#btnPrint").show();
		$("#btnCapture").show();
		$("#selectMap").show();
	}
	
	if ( parseInt(getUrlParameter("parseAddress")) > 0 ) {
		initParseAddress = true;
	} else {
		initParseAddress = false;
	}
	isChrome = false;//window.navigator.userAgent.indexOf("Chrome") !== -1 ? true : false;
	var maptype = getUrlParameter("maptype");
	if ( maptype != null && maptype != "") {
		var mapValid = maptype.split(",");
		for (var i = 0; i < mapValid.length; ++ i) {
			$("#liMap" + mapValid[i]).css("display", "block");
			//$("#liMap" + mapValid[i]).show();			
		}
	}
	$(".shadow_border_type li").each(function(){
     $(this).mouseenter(showMapSelect);
	});
	$('#mapMenu').mouseenter(showMapSelect);
	$('#mapMenu').mouseleave(hideMapSelect);
}

var intervalMapSelect = null;
function clearMapSelectTimeout() {
	if (intervalMapSelect != null) {
		clearTimeout(intervalMapSelect); intervalMapSelect = null;
	}
}

function showMapSelect(){
  clearMapSelectTimeout();
  $("#mapMenu").addClass("active_cat_type"); 
}

function hideMapSelect(){
	clearMapSelectTimeout();
  intervalMapSelect = setTimeout(function () {
  	$("#mapMenu").removeClass("active_cat_type"); 
		intervalMapSelect = null;
	}, 500);
}

function showAddressTip(tip) {
	document.getElementById("overVehicleAddress").innerHTML=tip;
}

function fullScreen() {
	try {
		if (isChrome) {
			app.sendMessage('OnMapMarker', [5, "", "", ""]);
		} else {
			window.external.OnMapMarker(5, "", "", "");
		}
	} catch(err) {
	}
};

function expand() {
	try {
		if (isChrome) {
			app.sendMessage('OnMapMarker', [6, "", "", ""]);
		} else {
			window.external.OnMapMarker(6, "", "", "");
		}
	} catch(err) {
	}
};

function getToolElement(id) {
	var btn = parseInt(id);	
	var img = "";
	if (1 == btn) {
		img = "addPoint";
	} else if (2 == btn) {
		img = "addRectangle";
	} else if (3 == btn) {
		img = "addPolygon";
	} else if (4 == btn) {
		img = "btnSearch";
	} else if (5 == btn) {
		img = "btnFullScreen";
	} else if (6 == btn) {
		img = "btnExpand";
	} else if (7 == btn) {
		img = "btnCenter";
	} else if (8 == btn) {
		img = "selectMap";
	} else if (9 == btn) {
		img = "addLine";
	} else if (10 == btn) {
		img = "addCircle";
	} else if (11 == btn) {
		img = "distance";
	} else if (12 == btn) {
		img = "zoomIn";
	} else if (13 == btn) {
		img = "zoomOut";
	} else if (14 == btn) {
		img = "btnCruise";
	} else if (15 == btn) {
		img = "btnCountry";
	} else if (16 == btn) {
		img = "btnArea";
	} else if (17 == btn) {
		img = "btnPrint";
	} else if (18 == btn) {
		img = "btnCapture";
	}
	
	return img;
}

function showTool(id, show) {
	var img = getToolElement(id);
	if (parseInt(show)) {
		$("#" + img).show();
	} else {
		$("#" + img).hide();
	}
}

function changeTool(id, normal) {
	var btn = parseInt(id);
	var status = parseInt(normal);
	if (btn == 5) {
		if (status) {
			$("#btnFullScreen").attr("src", GFRAME.imagePath + "fullscreen.gif");
			$("#btnFullScreen").attr("title", lang.fullScreen);
		} else {
			$("#btnFullScreen").attr("src", GFRAME.imagePath + "fullscreen_exit.gif");
			$("#btnFullScreen").attr("title", lang.fullScreenExit);
		}
	} else if (btn == 6) {
		if (status) {
			$("#btnExpand").attr("src", GFRAME.imagePath + "expand.jpg");
			$("#btnExpand").attr("title", lang.expand);
		} else {
			$("#btnExpand").attr("src", GFRAME.imagePath + "expand_exit.jpg");
			$("#btnExpand").attr("title", lang.expandExit);
		}
	}
};