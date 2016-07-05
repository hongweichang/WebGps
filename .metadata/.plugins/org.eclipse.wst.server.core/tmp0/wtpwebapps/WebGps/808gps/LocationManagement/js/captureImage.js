var api = frameElement.api, W = api.opener;
var index = null;
var mapImages = null;
var storageServer = W.storageServer; //存储服务器
var validIndex = 0; //最后一次有效的序号

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

function loadPage() {
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	
	index = Number(getUrlParameter('index'));
	
	$('#wrapper .title .vehiIdno-title').text(parent.lang.monitor_labelVehicleIdno);
	$('#wrapper .title .channel-title').text(parent.lang.capture_labelChannel);
	$('#wrapper .title .time-title').text(parent.lang.labelTime);
	$('#page .preImage').text(parent.lang.PreImage);
	$('#page .nextImage').text(parent.lang.nextImage);
	$('#page .autoTip').text(parent.lang.autoPopImage);
	
	if(W.monitorMedia.autoPopImage != null && W.monitorMedia.autoPopImage == 1) {
		$('#page .popImage input').get(0).checked = true;
	}
	
	initImage(index, true);
	
	$('#page .preImage').on('click', preImage);
	$('#page .nextImage').on('click', nextIMage);
	
	$('#page .popImage input').on('click',function() {
		W.monitorMedia.autoPopImage = $.trim($("input[name='autoPopImage']:checked").val());
	});
}

//父页面调用
function initImage(index_, isClick) {
	mapImages = W.monitorMedia.mapImages;
	index = Number(index_);
	addImage(index, isClick);
}

//显示图片
function addImage(index, isClick) {
	var image = mapImages.get(Number(index));
	if(image != null) {
		if(image.src != null && image.src != '') {
			validIndex = Number(index);
//			storageServer.ip = '192.168.1.222';
			var src = 'http://'+ storageServer.ip +':'+ storageServer.port +'/3/5?Type=3';
			src += '&FLENGTH='+ image.length;
			src += '&FOFFSET='+ image.offset;
			src += '&FPATH=' + image.src;
			src += '&MTYPE=1';
			if(!isBrowseFirefox() && !isBrowseSafari()) {
				var saveName = image.vehiIdno+ '_' + image.channel + '_' + image.time.replaceAll('-','').replaceAll(':','').replaceAll(' ','');
				src += "&SAVENAME="+ encodeURI(saveName);
			}else {
				var saveName = image.devIdno+ '_' + image.channel + '_' + image.time.replaceAll('-','').replaceAll(':','').replaceAll(' ','');
				src += "&SAVENAME="+ encodeURI(saveName);
			}
			$('#image img').attr('src', "");
			$("#image img").width(0);
			$("#image img").height(0);
			$("#image").css('left','125px');
			$("#image").css('top','75px');
			$('#image').attr('title',image.vehiIdno+ '_' + image.channel + '_' + image.time);
			$('#image img').attr('src', src);
			$("#image").animate({left:"50px",top:'30px'});
			$("#image img").animate({width:"500px",height:'230px'});
			
			$('#wrapper .title .idno').text(image.vehiIdno);
			$('#wrapper .title .chn').text(image.channel);
			$('#wrapper .title .time').text(image.time);
			if(isClick) {
				W.monitorMedia.selectTableRow(index);
			}
			return true;
		}
		return false;
	}
	return false;
}

//上一张图片
function preImage() {
	if(index - 1 >= 0) {
		index = index - 1;
		if(!addImage(index, true)) {
			//如果显示的抓拍失败的，则显示下一张
			preImage();
		}
	}else {
		index = validIndex;
	}
}

//下一张图片
function nextIMage() {
	if(index + 1 <  $('tr',W.monitorMedia.mediaFileTableObject).length/*mapImages.size()*/) {
		index = index + 1;
		if(!addImage(index, true)) {
			//如果显示的抓拍失败的，则显示下一张
			nextIMage();
		}
	}else {
		index = validIndex;
	}
}
