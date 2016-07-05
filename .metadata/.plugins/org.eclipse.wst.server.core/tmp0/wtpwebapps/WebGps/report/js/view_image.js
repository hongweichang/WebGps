var api = frameElement.api, W = api.opener;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	ajaxLoadInfo();
}); 

function ajaxLoadInfo() {
	var image = getUrlParameter("url").split(";");
	var length = image.length;
	var last = image[length - 1];
	if (last == "") {
		length = length - 1;
	}
	if (length == 1) {
		$("#showImage").hide();
	} else {
		for (var i = length; i < 3; i += 1) {
			$("#img" + (i + 1)).hide();
		}
	}
	
	showImage(0);
}

function showImage(index) {
	var image = getUrlParameter("url").split(";");
	var ch = image[index].charAt(0);
	var imgSrc;
	if (ch != '/') {
		imgSrc = "/" + image[index];
	} else {
		imgSrc = image[index];
	}
	$("#image").attr("src", imgSrc);
}