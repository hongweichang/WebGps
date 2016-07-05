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
	$('#H1Title').text(lang.open_phoneApiFile);
	$('#spanApiDesc').text(lang.open_phoneApiDesc);
	document.title = lang.open_phoneApiFile;
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
		leftContent += '<a href="#sec-'+ pageItem.name +'" class="nav-header menu-first" data-toggle="collapse" title="'+ title +'">'+ title +'</a>';
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
function initApiPageItems() {
	//android api
	var android = initPriviInfo(6, "android-operate");
	android.privis = [];
	android.privis.push(initPriviInfo(61, "android-login"));//登陆
	pageItems.push(android);
	// ios api
	var ios = initPriviInfo(7, "ios-operate");
	ios.privis = [];
	ios.privis.push(initPriviInfo(71, "ios-login"));//登陆
	pageItems.push(ios);
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
				document.title = lang.open_phoneApiFile;
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