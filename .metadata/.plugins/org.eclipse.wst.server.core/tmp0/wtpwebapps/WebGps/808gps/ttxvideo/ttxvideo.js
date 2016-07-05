var windowLanguage = "cn.xml";

var DEF_WINDOW_NUM = "WindowNum";
var DEF_Max_Picture = 'MaxPicture';
var windowCurNum = 9;		//当前显示数目
var windowMaxNum = 36;	//最多的数目 

var DEF_VIEW_SIZE = "ViewSize";
var DEF_Video_Set = 'VideoSet';
var DEF_Speak = 'Speak';

var viewSize = "full";	//full 4:3  16:9

var DEF_BUFFER_TIME = "BufferTime";	//缓冲时长
var bufferTime = 2;

var rootParent = parent.parent;
var isInitFinished = false;
var lang = rootParent.lang;

var loginServer = null;
var isLoadLoginServer = false;

var ttxPlayer = null;

$(document).ready(function () {
	loadReadPage();
	getServer();
});

function loadReadPage() {
	loadLang();
	setPanelWidth();
	loadVideo();
    $(document).bind("click mouseup",function(e){
    	if (typeof parent.ttxPlayerDocumentMouseClick == "function") {
    		parent.ttxPlayerDocumentMouseClick();
    	}
    }).mousemove(function(e){
    	if (typeof parent.ttxPlayerDocumentMouseMove == "function") {
    		parent.ttxPlayerDocumentMouseMove(e);
    	}
    });
    
    //是否隐藏工具栏
    var hideTool = getUrlParameter("hideTool");
	if(hideTool == null || !hideTool) {
		$('.tv_box').show();
	}
    var showTitle = getUrlParameter("showTitle");
    if(showTitle != null && showTitle) {
    	$('.tv_play').show();
    	$('.tv_play .tv_play_span').show();
    }
    var changeSize = getUrlParameter("changeSize");
    if(changeSize != null && changeSize) {
    	$('.tv_play').show();
    	$('.tv_play .btn_tv_icon').show();
    }
    
    $("#box_top").hide();
    $("#box_bottom").hide();
    $(".icon_num1").click(function() {
    	doSwitchWindow(1);
    });
    $(".icon_num2").click(function() {
    	doSwitchWindow(4);
    });
    $(".icon_num3").click(function() {
    	doSwitchWindow(6);
    });
    $(".icon_num4").click(function() {
    	doSwitchWindow(8);
    });
    $(".icon_num5").click(function() {
    	doSwitchWindow(9);
    });
    $(".icon_num6").click(function() {
    	doSwitchWindow(16);
    });
    var picture = $.cookie(DEF_Max_Picture);
    if(picture && picture == 1){
    	windowMaxNum = 25;
	    $(".icon_num7").click(function() {
	    	doSwitchWindow(25);
	    });
	    $(".icon_num8").parent().hide();
    }else if(picture && picture == 2){
    	windowMaxNum = 36;
    	$(".icon_num7").click(function() {
	    	doSwitchWindow(25);
	    });
	    $(".icon_num8").click(function() {
	    	doSwitchWindow(36);
	    });
    }else {
    	windowMaxNum = 16;
    	$(".icon_num7").parent().hide();
    	$(".icon_num8").parent().hide();
    }
    $(".icon_num9").click(function() {
    	doSite();
    });
	//视频显示比例
	$("#box_viewSize").hover(
		function(){
			$(this).find("ul").show();
			},
		function(){
			$(this).find("ul").hide();
	});
	$("#view4X3").click(function() {
		doViewSize("4:3");
	});
	$("#view16X9").click(function() {
		doViewSize("16:9");
	});
	$("#viewFull").click(function() {
		doViewSize("full");
	});
	//视频显示比例
	$("#box_viewMode").hover(
		function(){
			$(this).find("ul").show();
			},
		function(){
			$(this).find("ul").hide();
	});
	$("#bufferShort").click(function() {
		doBufferTime(2);
	});
	$("#bufferLong").click(function() {
		doBufferTime(8);
	});
	$("#box_capture").hide();
	$("#box_voice").hide();
	$("#icon_voice").click(function() {
		doOpenVoice();
	});
	$(".icon_play_all").click(function() {
		doPlayAll();
	});
	$("#stopAll").click(function() {
		doCloseAll();
	});
	$("#clearAll").click(function() {
		doClearAll();
	});
	//停止视频
	$("#box_stop").hover(
		function(){
			$(this).find("ul").show();
			},
		function(){
			$(this).find("ul").hide();
	});
	$(".btn_tv_icon").click(function(){
		if( $(this).hasClass("btn_tv_min") ){
			$(this).removeClass("btn_tv_min").addClass("btn_tv_max");
			if(typeof parent.doClickHideMap == 'function') {
				parent.doClickHideMap(true);
			}
		}else{
			$(this).removeClass("btn_tv_max").addClass("btn_tv_min");
			if(typeof parent.doClickHideMap == 'function') {
				parent.doClickHideMap(false);
			}
		}
	});
}

function setMaxPicture(){
	var picture = $.cookie(DEF_Max_Picture);
    if(picture == 0){
    	windowMaxNum = 16;
    	$(".icon_num7").parent().hide();
    	$(".icon_num8").parent().hide();
    }else if(picture == 1){
    	windowMaxNum = 25;
    	$(".icon_num7").parent().show();
	    $(".icon_num7").click(function() {
	    	doSwitchWindow(25);
	    });
	    $(".icon_num8").parent().hide();
    }else if(picture == 2){
    	windowMaxNum = 36;
    	$(".icon_num7").parent().show();
    	$(".icon_num8").parent().show();
    	$(".icon_num7").click(function() {
	    	doSwitchWindow(25);
	    });
	    $(".icon_num8").click(function() {
	    	doSwitchWindow(36);
	    });
    }
}

function loadLang() {
	//setTooltip( ".icon_num1", lang.video_1view);
	//setTooltip( ".icon_num2", lang.video_4view);
	//setTooltip( ".icon_num3", lang.video_6view);
	//setTooltip( ".icon_num4", lang.video_8view);
	//setTooltip( ".icon_num5", lang.video_9view);
	//setTooltip( ".icon_num6", lang.video_16view);
	//setTooltip( ".icon_num7", lang.video_25view);
	//setTooltip( ".icon_num8", lang.video_36view);
	$('.tv_play_span').text(lang.video_play);
	$("#view4X3").html('<i class="icon icon_gou"></i>' + lang.video_size_4X3 + '</a>');
	$("#view16X9").html('<i class="icon icon_gou"></i>' + lang.video_size_16X9 + '</a>');
	$("#viewFull").html('<i class="icon icon_gou"></i>' + lang.video_size_full + '</a>');
	$("#bufferShort").html('<i class="icon icon_gou"></i>' + lang.video_mode_good + '</a>');
	$("#bufferLong").html('<i class="icon icon_gou"></i>' + lang.video_mode_normal + '</a>');
	setTooltip( ".icon_play_all", lang.video_play_all);
	setTooltip( ".icon_num9", lang.param_settings);
	$("#stopAll").html('<i class="icon icon_gou"></i>' + lang.video_stop_all + '</a>');
	$("#clearAll").html('<i class="icon icon_gou"></i>' + lang.video_clear_all + '</a>');
	//setTooltip( ".icon_close_show", lang.video_stop_all);
}

function setTooltip(id, tltle) {
	$( id ).attr("title", tltle);
	$( id ).tooltip();
}

function getServer() {
	$.myajax.jsonGet('StandardLoginAction_getLoginServer.action', function(json,action,success){
		if(success) {
			var server = json.loginServer;
			var lstSvrIp = [];
			lstSvrIp.push(server[0].clientIp);
			lstSvrIp.push(server[0].lanip);
			lstSvrIp.push(server[0].clientIp2);
			loginServer = {};
			loginServer.ip = getComServerIp(lstSvrIp);
			loginServer.port = server[0].clientPort;
			isLoadLoginServer = true;
		} 
	}, null);
}


function setRefinterval() {
	if (typeof parent.setRefinterval == "function") {
		parent.setRefinterval();
	}
}

function setCloseTime(){
	//自动关闭视频时间
	var closevideo = $.cookie(DEF_Video_Set);
	if(closevideo != null){
		closevideo = closevideo * 60 * 1000;
	}else{
		closevideo = 5 * 60 * 1000;
	}
	
	ttxPlayer.setAutoCloseVideoTime(closevideo);
	ttxPlayer.closeVideoWindowTimer();
	
	//自动关闭对讲和监听时间
	var closeSpeak = $.cookie(DEF_Speak);
	if(closeSpeak != null){
		closeSpeak = closeSpeak * 60 * 1000;
	}else{
		closeSpeak = 5 * 60 * 1000;
	}
	
	ttxPlayer.setAutoCloseSpeakTime(closeSpeak);
	ttxPlayer.closeTalkListenWidowTimer();
}

function setAlarmRefinterval(){
	if (typeof parent.setAlarmRefinterval == "function") {
		parent.setAlarmRefinterval();
	}
}

function doSite(){
	$.dialog({id:'manageinfo', title:parent.lang.param_settings ,content: 'url:ttxvideo/siteInfo.html',
		width: '600px', height: '280px', min:false, max:false, lock:true});
}

function setPanelWidth() {
	if (isInitFinished) {
		var _width = document.documentElement.clientWidth;
		var _height = document.documentElement.clientHeight;
	//	var _width = $(window).width();
	//	var _height = $(window).height() - 39;
		$("#cmsv6flash").width(_width);
		$("#cmsv6flash").height(_height - 39);
	} 
}

function isLoadVideoSuc() {
	return isInitFinished;
}

/**
 * 判断clientIp与url是否相同，取相同的clientIp  公用方法
 */
function getLoginServer() {
	if(isLoadLoginServer) {
		serverIp = loginServer.ip;
		serverPort = loginServer.port;
		swfobject.getObjectById('cmsv6flash').setServerInfo(serverIp,serverPort);
		isInitFinished = true;
		setViewSize();
		setBufferTime();
		setPanelWidth();
	}else {
		setTimeout(getLoginServer,50);
	}
}

function loadVideo() {
	//窗口数目
	var curNum = $.cookie(DEF_WINDOW_NUM); 
	if (curNum == null) {
		curNum = 9;
	} else {
		windowCurNum = parseInt(curNum, 10);
	}
	var winNum = getUrlParameter("windowCurNum");
	if(winNum != null && winNum != '') {
		windowCurNum = Number(winNum);
	}
	//视频播放大小
	var size = $.cookie(DEF_VIEW_SIZE); 
	if (size != null) {
		viewSize = size;
	}
	//视频缓冲时间
	var buffTime = $.cookie(DEF_BUFFER_TIME); 
	if (buffTime != null) {
		bufferTime = parseInt(buffTime, 10);
	}
	//初始化视频
	ttxPlayer = new TtxPlayer();
	//自动关闭视频时间
	var closevideo = $.cookie(DEF_Video_Set);
	if(closevideo != null){
		closevideo = closevideo * 60 * 1000;
	}else{
		closevideo = 5 * 60 * 1000;
	}
	//自动关闭对讲和监听时间
	var closeSpeak = $.cookie(DEF_Speak);
	if(closeSpeak != null){
		closeSpeak = closeSpeak * 60 * 1000;
	}else{
		closeSpeak = 5 * 60 * 1000;
	}
	
	ttxPlayer.setAutoCloseVideoTime(closevideo);
	ttxPlayer.setAutoCloseSpeakTime(closeSpeak);
	ttxPlayer.initialize();
	
	//初始化flash
	if(rootParent.langIsChinese()) {
		windowLanguage = './player/cn.xml'; 
	} else {
		windowLanguage = './player/en.xml'; 
	}
    var params = {  
        allowFullscreen: "true",   
        allowScriptAccess: "always",   
        bgcolor: "#FFFFFF",
        wmode: "transparent"
    };
    var width = $(window).width();
    var height = $(window).height() - 39;
	swfobject.embedSWF("./player/player.swf", "cmsv6flash", width, height, "11.0.0", null, null, params, null);
	setTimeout(initFlash, 50);
/*	$(".icon_num8").hide();
	//并发连接数目限制
	if ($.ua().isWebkit) {
		$(".icon_num4").hide();
		$(".icon_num5").hide();
		$(".icon_num6").hide();
		$(".icon_num7").hide();
	} */
}

function initFlash() {
	if (swfobject.getObjectById('cmsv6flash') == null ||
		typeof swfobject.getObjectById('cmsv6flash').setWindowNum == "undefined" ) {
		setTimeout(initFlash, 50);
	} else {
		swfobject.getObjectById('cmsv6flash').setLanguage(windowLanguage);
		//先将全部窗口创建好
		swfobject.getObjectById('cmsv6flash').setWindowNum(windowMaxNum);
		//再配置当前的窗口数目
		swfobject.getObjectById('cmsv6flash').setWindowNum(windowCurNum);
		getLoginServer();
	}
}

/*
 * 取得焦点窗口
 */
function getCurFocusWindow(){
	if (!isInitFinished) {
		return null;
	}
	return ttxPlayer.getCurFocusWindow();
}

function doSwitchWindow(num) {
	windowCurNum = num;
	//保存
	$.cookie(DEF_WINDOW_NUM, this.windowCurNum, { expires: 365 }); 	
	//切换窗口
	if (!isInitFinished) {
		return;
	}
	swfobject.getObjectById('cmsv6flash').setWindowNum(num);
	ttxPlayer.oneMaxMode = false;
}

function doViewSize(size) {
	//保存
	viewSize = size;
	$.cookie(DEF_VIEW_SIZE, viewSize, { expires: 365 }); 
	//更新
	setViewSize();
}

function setViewSize() {
	if (viewSize == "4:3") {
		$("#view4X3 i").addClass("icon_select");	
		$("#view16X9 i").removeClass("icon_select");
		$("#viewFull i").removeClass("icon_select");
	} else if (viewSize == "16:9") {
		$("#view4X3 i").removeClass("icon_select");
		$("#view16X9 i").addClass("icon_select");
		$("#viewFull i").removeClass("icon_select");
	} else {
		$("#view4X3 i").removeClass("icon_select");
		$("#view16X9 i").removeClass("icon_select");
		$("#viewFull i").addClass("icon_select");
	}
	if (!isInitFinished) {
		return ;
	}
	for (var i = 0; i < windowMaxNum; ++ i) {
		swfobject.getObjectById('cmsv6flash').setVideoFrame(i, viewSize);
	}
}

function doBufferTime(time) {
	//保存
	bufferTime = time;
	$.cookie(DEF_BUFFER_TIME, bufferTime, { expires: 365 }); 
	//更新
	setBufferTime();
}

function setBufferTime() {
	if (bufferTime < 5) {
		$("#bufferShort i").addClass("icon_select");	
		$("#bufferLong i").removeClass("icon_select");
	} else {
		$("#bufferShort i").removeClass("icon_select");
		$("#bufferLong i").addClass("icon_select");
	} 
	if (!isInitFinished) {
		return ;
	}	
	for (var i = 0; i < windowMaxNum; ++ i) {
		swfobject.getObjectById('cmsv6flash').setBufferTime(i, bufferTime);
	}
}

/**
* 视频设备通道播放(多个通道)
* @param vehiIdno 车牌号
* @param arrChn	通道列表
* @param stream	码流
* @param arrTitle	标题
* @param viewCloseTime	自动关闭时间
* @param armType 报警信息
*/
function startVideo(devIdno, arrChn, stream, arrTitle, viewCloseTime, armType) {
	if (!isInitFinished) {
		return ;
	}
	ttxPlayer.startVideo(devIdno, arrChn, stream, arrTitle, viewCloseTime, armType);
}

function doPlayAll() {
	if (!isInitFinished) {
		return ;
	}
	ttxPlayer.playAll();
}

function doCloseAll() {
	if (!isInitFinished) {
		return ;
	}
	ttxPlayer.stopAll();
}

function doClearAll() {
	if (!isInitFinished) {
		return ;
	}
	ttxPlayer.clearAll();
}

//启动监听
function startListen(devIdno, chn) {
	if (!isInitFinished) {
		return -1;
	}
	return ttxPlayer.startListen(devIdno, chn);
}

//停止监听
function stopListen() {
	if (!isInitFinished) {
		return ;
	}
	ttxPlayer.stopListen();
}

//启动对讲
function startTalkback(devIdno) {
	if (!isInitFinished) {
		return -1;
	}
	return ttxPlayer.startTalkback(devIdno);
}

//停止对讲
function stopTalkback() {
	if (!isInitFinished) {
		return ;
	}
	ttxPlayer.stopTalkback();
}

/**
 * 是否禁止系统右键  true 禁止
 */
function disableSysRight(id,disable,func) {
	if(disable) {
		if(typeof func != 'undefined' && func != null) {
			$(id).on('contextmenu',func);
		}else {
			$(id).on('contextmenu',function(){return false;});
		}
	}else {
		$(id).unbind('contextmenu');
	}
}

/**
 * 判断通道是否在播放
 */
function isPlaying(devIdno, channel, stream) {
	if (!isInitFinished) {
		return false;
	}
	return ttxPlayer.isPlaying(devIdno, channel, stream);
}

/**
 * 停止此通道的预览
 */
function stopChannelPreview(devIdno, channel, stream) {
	if (!isInitFinished) {
		return ;
	}
	ttxPlayer.stopChannelPreview(devIdno, channel, stream);
};

//设置视频窗口标题
function setTvplayTitle(title) {
	if (!isInitFinished) {
		return ;
	}
	$('.tv_play_span').text(title);	
}

/**
 * 在报警情况下，当前批次的报警是否已经预览整个窗口
 */
function isAlarmPackAll(alarmPackNumber){
	if (!isInitFinished) {
		return true;
	}
	return ttxPlayer.isAlarmPackAll(alarmPackNumber);
};

/**
 * 在报警情况下，当报警结束时，让报警结束类型置空
 */
function setWindowEndArmType(devIdno, endArmType){
	if (!isInitFinished) {
		return;
	}
	ttxPlayer.setWindowEndArmType(devIdno, endArmType);
};

/**
 * 返回视频播放时间
 */
function getVideoWindowTime(){
	if (!isInitFinished) {
		return null;
	}
	return ttxPlayer.getVideoWindowTime();
}

/**
 * 根据链接地址播放回放视频
 * @param url
 */
function startVideoReplay(title, url) {
	if (!isInitFinished) {
		return ;
	}
	ttxPlayer.startVideoReplay(title, url);
}

/**
 * 清除此回放视频窗口的预览
 */
function clearVideoReplay() {
	if (!isInitFinished) {
		return ;
	}
	ttxPlayer.clearVideoReplay();
};

/**
 * 获取回放视频的播放时长
 */
function getVideoPlayTime() {
	if (!isInitFinished) {
		return ;
	}
	return ttxPlayer.getVideoPlayTime();
};

/**
 * 停止窗口所在通道视频
 */
function stopIndexWindowPreview(index) {
	if (!isInitFinished) {
		return ;
	}
	ttxPlayer.stopIndexWindowPreview(index);
};

/**
 * 添加菜单
 * @param 窗口下标
 * @param menuId
 * @param menuName
 * @param part  是否分隔符 1,0
 */
function addVideoMenu(index, menuId, menuName, part) {
	if (!isInitFinished) {
		return ;
	}
	ttxPlayer.addVideoMenu(index, menuId, menuName, part);
};

/**
 *  删除菜单
 *  @param 窗口下标
 *  @param menuId
 */
function delVideoMenu(index, menuId) {
	if (!isInitFinished) {
		return ;
	}
	ttxPlayer.delVideoMenu(index, menuId);
};

/**
 *  清空窗口菜单
 *  @param 窗口下标
 */
function clearVideoMenu(index) {
	if (!isInitFinished) {
		return ;
	}
	ttxPlayer.clearVideoMenu(index);
};