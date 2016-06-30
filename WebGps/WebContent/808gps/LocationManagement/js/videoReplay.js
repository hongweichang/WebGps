var api = frameElement.api, W = api.opener;
var index = getUrlParameter('index');//选择播放的录像序号
var ttxVideo = null;    //视频对象
var media = null;

$(document).ready(function () {
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	loadReadPage();
});

function loadReadPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		//禁止系统右键
		disableSysRight('body',true);
		//初始化flash
		initTtxVideo();
		loadPage();
	}
}

//最多加载2分钟，加载失败则不加载
var loadMaxTime = 2 * 60 * 1000;
var bgTime = (new Date()).getTime(); 
function loadPage() {
	if((new Date()).getTime() - bgTime > loadMaxTime) {
		return;
	}
	if(ttxVideo != null && ttxVideo.checkLoadSuc()) {
		loadPageInfo(index);
	}else {
		setTimeout(loadPage, 50);
	}
}

function loadPageInfo(index) {
	media = W.monitorMedia.mediaList.get(Number(index));
	//获取视频文件播放的服务器信息,成功后回放视频文件信息
	var title = media.vehiIdno+' - '+ media.channel +' - '+ media.fileTime;
	//获取视频文件播放的服务器信息,然后播放
	doReplayVehicleServer(media, 0, 0, title);
}

function initTtxVideo() {
	ttxVideo = new TtxVideo("framePreview");
	if(ttxVideo != null) {
		ttxVideo.initialize(ttxVideoLoadSuc);
	}
}

//视频加载成功后的回调
function ttxVideoLoadSuc() {
	if(ttxVideo != null) {
		ttxVideo.disableSysRight('.map_btn',true);
	}
}

var ajaxReplayVehicleServerObj = null;
//获取视频文件播放的服务器信息
function doReplayVehicleServer(media, chn, bgTime, title, isTimeline) {
	//获取之前先取消上次的请求
	if(ajaxReplayVehicleServerObj != null) {
		ajaxReplayVehicleServerObj.abort();
	}
	
	var param = {};
	if(media.loc == 1) {
		param.did = media.devIdno;
	}else {
		param.did = media.vehiIdno;
	}
	param.loc = media.loc;
	param.ftp = media.svr; //
	
	//数据库取实时状态
	W.$.myajax.showLoading(true, parent.lang.findReplayAddress);
	ajaxReplayVehicleServerObj = W.monitorMedia.doAjaxSubmit('StandardVideoTrackAction_queryReplayServer.action', param, function(server) {
		doReplayVideoFileInfo(media, chn, bgTime, title, server, isTimeline);
	});
}

//录像回放视频文件信息
function doReplayVideoFileInfo(media, chn, begTime, title, rpServer, isTimeline) {
	var url = "http://"+ rpServer.ip+':'+rpServer.port +"/3/5?DownType=5";
//		var url = "http://192.168.1.224:8091/3/5?DownType=5";
	if(media.loc == 1) {
		url += "&DevIDNO="+ media.devIdno;
	}else {
		url += "&DevIDNO="+ media.vehiIdno;
	}
	url += "&FILELOC="+ media.loc;
	url += "&FILESVR="+ media.svr;
	url += "&FILECHN="+ media.chn;
	url += "&FILEBEG="+ media.beg;
	url += "&FILEEND="+ media.end;
	url += "&PLAYIFRM=0";
	//表示播放那个通道的录像，文件存在多个通道(先chnMash>0,再chn=98)的录像时使用，如果不存在多个通道，则直接使用0就可以了
	url += "&PLAYCHN="+ chn;
	url += "&PLAYFILE="+ media.file;
	//播放起始的偏移，单位毫秒，相当于文件的开始时间算，0表示从文件开始位置进行播放
	url += "&PLAYBEG="+ (begTime * 1000);
	//播放结束的偏移，单位毫秒，相当文件开始时间算，不得大于文件的总时长  0表示播放到文件结束
	url += "&PLAYEND=0";//+ (fileInfo.relEnd - fileInfo.beg - begTime);
	//视频回放
	if((typeof ttxVideo) != 'undefined' && ttxVideo != null) {
		ttxVideo.setTvplayTitle(title);
		ttxVideo.startVideoReplay(title, url);
	}
}