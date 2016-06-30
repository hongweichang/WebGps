var apiPane = null;//开放API对象
var pageItems = [];//菜单集合

$(document).ready(function(){
	langInitByUrl();
	apiPane = new apiPage();
	loadReadyPage();
});

function loadReadyPage() {
	if (typeof lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		//加载语言
		loadLang();
		//获取服务器平台信息
		ajaxLoadInformation();
		initApiPageItems();
		loadPage();
	}
}

//加载语言
function loadLang() {
	$('#spanHome').text(lang.open_home);
	$('#spanWeb').text(lang.open_webApi);
	$('#spanPhone').text(lang.open_phoneApi);
	$('#spanWindows').text(lang.open_windowsApi);
	$('#H1Title').text(lang.open_webApiFile);
	$('#spanApiDesc').text(lang.open_webApiDesc);
	document.title = lang.open_webApiFile;
}

//加载页面
function loadPage() {
	if(!pageItems) {
		setTimeout(loadPage, 50);
	}else {
		loadMainPane();
	}
}

//加载主页面
function loadMainPane() {
	var leftContent = '<div class="span3 bs-docs-sidebar">';
	leftContent += '<div class="bs-docs-sidenav">';
	var rightContent = '<div class="span9">';
	for (var i = 0; i < pageItems.length; i++) {
		var pageItem = pageItems[i];
		var title = apiPane.getItemTitle(pageItem.id);
		if(pageItem.id == 1) {//接口说明
			leftContent += '<ul class="nav nav-list">';
			leftContent += '	<li><a href="#sec-'+ pageItem.name +'" class="nav-header menu-first" title="'+ title +'">'+ title +'</a></li>';
			leftContent += '</ul>';
		}else {
			leftContent += '<a href="#sec-'+ pageItem.name +'" class="nav-header menu-first" data-toggle="collapse" title="'+ title +'">'+ title +'</a>';
		}
		rightContent += apiPane.initRightMainPane(pageItem.name, title);
		if(pageItem.privis && pageItem.privis.length > 0) {
			leftContent += '<ul class="nav nav-list in collapse" id="sec-'+ pageItem.name +'">';
			var privis = pageItem.privis;
			for (var j = 0; j < privis.length; j++) {
				var page = privis[j];
				var title_ = apiPane.getItemTitle(page.id);
				leftContent += '<li><a href="#sec-'+ page.name +'" title="'+ title_ +'"><i class="icon-chevron-right"></i>'+ title_ +'</a></li>';
				rightContent += apiPane.initRightPane(page.id, page.name, title_);
			}
			leftContent += '</ul>';
		}
	}
//	leftContent += '			<li class="dropdown"><a href="#" title="向上">向上</a></li>';
	leftContent += '</div>';
	leftContent += '</div>';
	rightContent += "</div>";
	$("#mainPane").append(leftContent + rightContent);
	
	//加载bootstrap js
	addBootstrapJs();
}

//加载bootstrap js
function addBootstrapJs() {
	loadScript('../../bootstrap/js/bootstrap-v2.3.2.min.js', function() {
		//菜单添加滑动点击事件
		$('[data-spy="scroll"]').each(function () {
		   $(this).scrollspy();
		});
	    loadScript('../../bootstrap/js/holder.min.js', null);
//		loadScript('../../bootstrap/js/prettify.js', null);
		loadScript('../../bootstrap/js/application.js', null);
		/*$('a[href^="#"]').click(function(){  
	        var the_id = $(this).attr("href");
	        if(the_id && the_id != '#' && $(the_id).get(0)) {
	        	$('html, body').animate({
	                scrollTop: $(the_id).offset().top
	            }, 'slow');
	        	return false;
	        }
	    });*/
	});
}

//初始化页面菜单数组
function initApiPageItems() {
	//接口说明
	pageItems.push(initPriviInfo(1, "api-desc"));
	//用户登录注销
	var userop = initPriviInfo(2, "user-operate");
	userop.privis = [];
	userop.privis.push(initPriviInfo(21, "user-login"));//登陆
	userop.privis.push(initPriviInfo(22, "user-logout"));//退出
	pageItems.push(userop);
	//车辆信息查询
	var vehicleop = initPriviInfo(3, "vehicle-operate");
	vehicleop.privis = [];
	vehicleop.privis.push(initPriviInfo(36, "vehicle-device-info"));//获取用户授权车辆和设备信息
	vehicleop.privis.push(initPriviInfo(31, "vehicle-device-idno"));//获取设备号
	vehicleop.privis.push(initPriviInfo(32, "vehicle-device-online"));//设备状态
	vehicleop.privis.push(initPriviInfo(33, "vehicle-device-gps"));//设备gps状态
	vehicleop.privis.push(initPriviInfo(34, "vehicle-device-track"));//获取设备轨迹（分页）
	vehicleop.privis.push(initPriviInfo(35, "vehicle-device-alarm"));//获取报警数据（暂缓）
	pageItems.push(vehicleop);
	//视频相关业务
	var videoop = initPriviInfo(4, "video-operate");
	videoop.privis = [];
	videoop.privis.push(initPriviInfo(41, "video-init"));//初始化视频插件
	videoop.privis.push(initPriviInfo(42, "video-live-html"));//实时视频(网页集成版)
	videoop.privis.push(initPriviInfo(43, "video-live-js"));//实时视频(javascript版)
	videoop.privis.push(initPriviInfo(44, "video-monitor"));//监听
	videoop.privis.push(initPriviInfo(45, "video-talkback"));//对讲
	videoop.privis.push(initPriviInfo(46, "video-search"));//录像查询
	videoop.privis.push(initPriviInfo(47, "video-download"));//录像下载
	videoop.privis.push(initPriviInfo(48, "video-playback"));//远程回放
	videoop.privis.push(initPriviInfo(49, "video-img-capture"));//图片抓拍
	pageItems.push(videoop);
	//车辆控制业务
	var vehicontrol = initPriviInfo(5, "vehicle-control-operate");
	vehicontrol.privis = [];
	vehicontrol.privis.push(initPriviInfo(51, "vehicle-control-server"));//获取用户服务器
	vehicontrol.privis.push(initPriviInfo(52, "vehicle-control-op"));//车辆控制
	vehicontrol.privis.push(initPriviInfo(53, "vehicle-control-tts"));//tts
	pageItems.push(vehicontrol);
}

//获取数组
function initPriviInfo(id, name) {
	return {id: id, name : name};
}

//获取服务器平台信息
function ajaxLoadInformation() {
	//向服务器发送ajax请求
	$.ajax({
		url: 'StandardLoginAction_information.action',
		type:"post",
		data: null,
		cache:false,/*禁用浏览器缓存*/
		dataType:"json",
		success:function(json){
			if(json.result == 0){
				document.title = lang.open_webApiFile;
				if (langIsChinese()) {
					if (json.ChineseMainTitle != null)  {
						document.title += '-'+ json.ChineseMainTitle;
						$('#spanTitle').text(json.ChineseMainTitle);
					}
					if (json.ChineseCopyright != null) {
						$("#spanCopyright").html(json.ChineseCopyright);
					}
				} /*else if (langIsTW()){
					if (json.TwMainTitle != null)  {
						document.title += '-'+ json.TwMainTitle;
						$('#spanTitle').text(json.TwMainTitle);
					}
					if (json.TwCopyright != null) {
						$("#spanCopyright").html(json.TwCopyright);
					}
				}*/ else {
					if (json.EnglishMainTitle != null)  {
						document.title += '-'+ json.EnglishMainTitle;
						$('#spanTitle').text(json.EnglishMainTitle);
					}
					if (json.EnglishCopyright != null) {
						$("#spanCopyright").html(json.EnglishCopyright);
					}
				}
			} else {
				alert(lang.errException);
			}
		},error:function(XMLHttpRequest, textStatus, errorThrown){
			if (textStatus != "error") {
				//alert(parent.lang.errSendRequired + " errorThrown:" + errorThrown + ",textStatus:" + textStatus);
			}
			alert(lang.errException);
		}
	});
}