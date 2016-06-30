$(document).ready(function(){
	initWebsitteLang();
	//加载语言 
	loadLang();
	//加载下载信息
	ajaxLoadDownload();
});


var downList = null;

function loadLang(){
	$("#spanDownGViewer").text(lang.website_download_gViewer);
	$("#spanDownOther").text(lang.website_download_other);
	showDownList();
}

function showDownList() {
	if (downList != null) {
		var length = downList.length;
		if (length > 3) {
			$("#downOther").show();
		}
		for (var i = 0; i < length; ++ i) {
			var temp = downList[i];
			var index = i + 1;
			$("#liDiv" + index).show();
			$("#liDiv" + index).attr("class", temp.style);
			$("#liName" + index).text(getDownName(temp.name));
			$("#liHref" + index).show();
			$("#liHref" + index).attr("href", temp.url);
			$("#liPart" + index).show();
			$("#liVersion" + index).text(lang.website_download_version);
			$("#liVerValue" + index).text(temp.verValue);
			$("#liVerDate" + index).text(lang.website_download_date);
			$("#liDateValue" + index).text(temp.dateValue);
		}
	}
}

function getDownName(name) {
	var ret = "";
	if (name == "clientWin") {
		ret = lang.website_download_win;
	} else if (name == "clientIos") {
		ret = lang.website_download_ios;
	} else if (name == "androidBaidu") {
		ret = lang.website_download_andriod;
	} else if (name == "androidGoogle") {
		ret = lang.website_download_andriod;
	} else if (name == "player") {
		ret = lang.website_download_gPlayer;
	} else if (name == "mapinfo") {
		ret = lang.website_download_mapinfo;
	}
	return ret;
}

function ajaxLoadDownload() {
	//向服务器发送ajax请求
	$.myajax.jsonGet("LoginAction_download.action?language=" + langCurLocal(), function(json,action,success){
		if (success) {
			if (json.lstDown != null) {
				downList = json.lstDown;
				showDownList();
			}
		}
	}, null);
}
