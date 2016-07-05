var windowsApiPane = null;//开放API对象
var pageItems = [];//菜单集合

$(document).ready(function(){
	langInitByUrl();
	windowsApiPane = new windowsApiPage();
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
		initWindowsApiPageItems();
		loadPage();
	}
}

//加载语言
function loadLang() {
	$('#spanHome').text(lang.open_home);
	$('#spanWeb').text(lang.open_webApi);
	$('#spanPhone').text(lang.open_phoneApi);
	$('#spanWindows').text(lang.open_windowsApi);
	$('#H1Title').text(lang.open_windowsApiFile);
	$('#spanApiDesc').text(lang.open_windowsApiDesc);
	document.title = lang.open_windowsApiFile;
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
		var title = windowsApiPane.getItemTitle(pageItem.id);
		leftContent += '<a href="#sec-'+ pageItem.name +'" class="nav-header menu-first" data-toggle="collapse" title="'+ title +'">'+ title +'</a>';
		rightContent += windowsApiPane.initRightMainPane(pageItem.name, title);
		if(pageItem.privis && pageItem.privis.length > 0) {
			leftContent += '<ul class="nav nav-list in collapse" id="sec-'+ pageItem.name +'">';
			var privis = pageItem.privis;
			for (var j = 0; j < privis.length; j++) {
				var page = privis[j];
				var title_ = windowsApiPane.getItemTitle(page.id);
				leftContent += '<li><a href="#sec-'+ page.name +'" title="'+ title_ +'"><i class="icon-chevron-right"></i>'+ title_ +'</a></li>';
				rightContent += windowsApiPane.initRightPane_wsdk(page.id, page.name, title_, page.type);
			}
			leftContent += '</ul>';
		}
	}
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
		loadScript('../../bootstrap/js/application.js', null);
	});
}

//初始化页面菜单数组
function initWindowsApiPageItems() {
	//sdk动态链接库
    var sdk = initPriviInfo(1, "wsdk-operate");
    pageItems.push(sdk);

    //用户登录注销
    var userop = initPriviInfo(2, "wsdk-user-operate");
    userop.privis = [];
    userop.privis.push(initPriviInfo(21, "wsdk-user-login")); //登陆
    userop.privis.push(initPriviInfo(22, "wsdk-user-logout")); //退出
    pageItems.push(userop);

    //车辆信息查询
    var vehicleop = initPriviInfo(3, "wsdk-vehicle-operate");
    vehicleop.privis = [];
    vehicleop.privis.push(initPriviInfo(31, "wsdk-vehicle-device-idno")); //获取设备号
    vehicleop.privis.push(initPriviInfo(32, "wsdk-vehicle-device-online")); //设备状态
    vehicleop.privis.push(initPriviInfo(33, "wsdk-vehicle-device-gps")); //设备gps状态
    vehicleop.privis.push(initPriviInfo(34, "wsdk-vehicle-device-track")); //获取设备轨迹（分页）
    vehicleop.privis.push(initPriviInfo(35, "wsdk-vehicle-device-alarm")); //获取报警数据（暂缓）
    pageItems.push(vehicleop);
    //视频相关业务
    var videoop = initPriviInfo(4, "wsdk-video-operate");
    videoop.privis = [];
    videoop.privis.push(initPriviInfo(41, "wsdk-video-init")); //初始化视频插件
    videoop.privis.push(initPriviInfo(42, "wsdk-video-live-html")); //实时视频(网页集成版)
    videoop.privis.push(initPriviInfo(43, "wsdk-video-live-js")); //实时视频(javascript版)
    videoop.privis.push(initPriviInfo(44, "wsdk-video-monitor")); //监听
    videoop.privis.push(initPriviInfo(45, "wsdk-video-talkback")); //对讲
    videoop.privis.push(initPriviInfo(46, "wsdk-video-search")); //录像查询
    videoop.privis.push(initPriviInfo(47, "wsdk-video-download")); //录像下载
    videoop.privis.push(initPriviInfo(48, "wsdk-video-playback")); //远程回放
    videoop.privis.push(initPriviInfo(49, "wsdk-video-img-capture")); //图片抓拍
    pageItems.push(videoop);
    //车辆控制业务
    var vehicontrol = initPriviInfo(5, "wsdk-vehicle-control-operate");
    vehicontrol.privis = [];
    vehicontrol.privis.push(initPriviInfo(51, "wsdk-vehicle-control-server")); //获取用户服务器
    vehicontrol.privis.push(initPriviInfo(52, "wsdk-vehicle-control-op")); //车辆控制
    vehicontrol.privis.push(initPriviInfo(53, "wsdk-vehicle-control-tts")); //tts
    pageItems.push(vehicontrol);

	// ocx控件
	var ocx = initPriviInfo(6, "ocx-operate");
	ocx.privis = [];
	ocx.privis.push(initPriviInfo(61, "ocx-login"));//登陆
	pageItems.push(ocx);
	
	// 其他方法
	var other = initPriviInfo(7, "other-function");
	other.privis = [];
	other.privis.push(initPriviInfo(71, "getAccount", 2));//获取用户名
	other.privis.push(initPriviInfo(72, "login", 2));//登陆
	pageItems.push(other);
}

//获取数组
//@param type 2 具体方法
function initPriviInfo(id, name, type) {
	if(!type) {
		type = 1;
	}
	return {id: id, name : name, type: type};
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
				document.title = lang.open_windowsApiFile;
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