/**
 * 用户的样式
 */
function pageStyle() {
	this.styleId = 1; //默认为样式1
	this.styleObj = null; //默认样式
	this.screenWidth = 0; //电脑分辨率
	this.allDefaultStyles = new Array(); //所有的样式
	this.allStyles = new Array();  //所有的加载样式
	this.isInitFinished = false;  //是否加载完全
	this.init();
}

//获取加载样式Id
pageStyle.prototype.getStyle = function() {
	return this.styleId;
}

//获取加载样式
pageStyle.prototype.loadStyleObj = function() {
	if(this.allStyles && this.styleId) {
		for (var i = 0; i < this.allStyles.length; i++) {
			if(this.allStyles[i].id == this.styleId) {
				this.styleObj = this.allStyles[i];
			}
		}
		if(!this.styleObj) {
			this.styleObj = this.allStyles[0];
		}
	}
}

//初始化
pageStyle.prototype.init = function() {
	this.loadAllDefaultStyles();
	this.loadAllStyles();
	this.screenWidth = window.screen.availWidth;
	if(this.screenWidth < 1024) {
		this.screenWidth = 1024;
	}
}

//加载所有的默认样式
pageStyle.prototype.loadAllDefaultStyles = function() {
	this.allDefaultStyles.push(1);
	this.allDefaultStyles.push(2);
	this.allDefaultStyles.push(3);
}

//加载所有的样式
pageStyle.prototype.loadAllStyles = function() {
	var style_1 = {};
	style_1.id = 1;
	style_1.name = "style-1";
	style_1.title = lang.style_sky_blue;
	style_1.url = "css/login1.css";
	style_1.indexUrl = "css/index1.css";
	this.allStyles.push(style_1);
	var style_2 = {};
	style_2.id = 2;
	style_2.name = "style-2";
	style_2.title = lang.style_black_night;
	style_2.url = "css/login2.css";
	style_2.indexUrl = "css/index2.css";
	this.allStyles.push(style_2);
	var style_3 = {};
	style_3.id = 3;
	style_3.name = "style-3";
	style_3.title = lang.style_grass_green;
	style_3.url = "css/login3.css";
	style_3.indexUrl = "css/index3.css";
	this.allStyles.push(style_3);
}

//所选样式是否在默认样式集合中
pageStyle.prototype.styleInDefaultStyles = function(style_) {
	if(this.allDefaultStyles && style_) {
		for (var i = 0; i < this.allDefaultStyles.length; i++) {
			if(this.allDefaultStyles[i] == style_) {
				return true;
			}
		}
	}
	return false;
}

//所选样式是否在样式集合中
pageStyle.prototype.styleInStyles = function(style_) {
	if(this.allStyles && style_) {
		for (var i = 0; i < this.allStyles.length; i++) {
			if(this.allStyles[i].id == style_) {
				return true;
			}
		}
	}
	return false;
}

/**
 * 加载用户登录界面样式
 * @defaultStyle 默认样式  1，2，3
 */
pageStyle.prototype.initLoginUserStyle = function(defaultStyle) {
	//获取cookie中样式
	this.styleId = GetCookie("style");
	if(!this.styleId || !this.allStyles) {
		this.styleId = defaultStyle;
	}else {
		if(this.allStyles) {
			if(!this.styleInStyles(this.styleId)) {
				if(!this.styleInStyles(defaultStyle)) {
					this.styleId = this.allStyles[0].id;
				}else {
					this.styleId = defaultStyle;
				}
			}
		}
	}
	//如果要加载的样式不在默认样式集合中，则取默认样式第一个
	if(!this.styleInDefaultStyles(this.styleId)) {
		this.styleId = this.allDefaultStyles[0];
	}
	
	if(this.allStyles && this.allStyles.length > 1) {
		//初始化样式选择
		this.initLoginSwitchStyle();
	}else {
		$('.wy-mod-style').hide();
	}
	
	//加载样式
	this.loadStyleObj();
	var that = this;
	this.loadHeadCss(this.styleObj.url, function() {
		that.isInitFinished = true;
		that.loadUserLoginStyle();
	});
}

//加载用户登录界面样式
pageStyle.prototype.loadUserLoginStyle = function() {
	$(".wy-mod-style .switch-span").text(this.styleObj.title);
	if(this.styleId == 2 || this.styleId == 3) {
		$('#_banners .banner2').show();
		if(this.styleId == 3) {
			$("#clientDownload").show();
		}
	}else {
		$('#_focus').show();
		$('.wy-mod-nav-main').show();
		$('#_banners .banner1').show();
		if(this.allStyles && this.allStyles.length > 1) {
			$('.wy-mod-nav').css('width', '1024px');
		}
		$("#clientDownload").show();
		$('.switch-style .'+this.styleObj.name).addClass('current');
	}
	SetCookie("style", this.styleObj.id);
}

/**
 * 初始化样式选择
 */
pageStyle.prototype.initLoginSwitchStyle = function() {
	var mod = [];
	for (var i = 0; i < this.allStyles.length; i++) {
		mod.push({
			display: this.allStyles[i].title,
			title: this.allStyles[i].title,
			name: this.allStyles[i].name,
			pclass: 'clearfix'
//			preicon : true
		});
	}
	
	$('.switch-style').flexPanel({
		TabsModel : mod
	});
	
	var that = this;
	$('.switch-style li').on('click',function(){
		$(this).addClass('current').siblings().removeClass("current");
		$('.switch-style ul').removeClass('show');
		$('.wy-mod-style .carat').removeClass('show');
		SetCookie("style", $(this).attr('data-tab').split('-')[1]);
		document.location.reload();
	});
	
	$('body').click(function(event) {
		var obj = event.srcElement ? event.srcElement : event.target;
		if(obj != $('.wy-mod-style .switch-span')[0] && obj != $('.wy-mod-style .carat')[0]) {
			$('.switch-style ul').removeClass('show');
			$('.wy-mod-style .carat').removeClass('show');
		}
	});
	
	$('.wy-mod-style .switch-div').on('click',function() {
		if($('.carat', this).hasClass('show')) {
			$('.switch-style ul').removeClass('show');
			$('.carat', this).removeClass('show');
		}else {
			$('.switch-style ul').addClass('show');
			$('.carat', this).addClass('show');
		}
		var that = this;
		$('.switch-style ul').mouseleave(function(){
			$(this).removeClass('show');
			$('.carat', that).removeClass('show');
		});
	});
}

/**
 * 加载用户主界面菜单选择样式
 */
pageStyle.prototype.initIndexItemStyle = function() {
	//获取cookie中样式
	this.styleId = GetCookie("style");
	//如果要加载的样式不在默认样式集合中，则取默认样式第一个
	if(!this.styleInDefaultStyles(this.styleId)) {
		this.styleId = this.allDefaultStyles[0];
	}
	
	//加载样式
	this.loadStyleObj();
	var that = this;
	this.loadHeadCss(this.styleObj.indexUrl, function() {
		that.isInitFinished = true;
		that.loadIndexItemStyle();
	});
}

//加载用户主界面菜单选择样式
pageStyle.prototype.loadIndexItemStyle = function() {
	
}

//修改主界面菜单样式
pageStyle.prototype.setIndexItemWidth = function() {
	if(this.styleId == 3) {
		this.setGreedIndexItemWidth();
	}else {
		this.setComnmonIndexItemWidth();
		if(this.styleId == 2) {
			this.setBlockIndexItemWidth();
		}else {
			this.setBlueIndexItemWidth();
		}
	}
}

//主页面菜单共同样式
pageStyle.prototype.setComnmonIndexItemWidth = function() {
	if(this.screenWidth < 1440 && this.screenWidth > 1280) {
		$('#main-topPanel .logo').css('max-width', '325px');
		$('#main-topPanel #spanTitle').css('font-size', '17px');
		$('#rightTabs').css('margin-left','30px');
	}else if(this.screenWidth <= 1280 && this.screenWidth > 1024) {
		$('#main-topPanel .logo').css('max-width', '275px');
		$('#main-topPanel #spanTitle').css('font-size', '15px');
		$('#rightTabs').css('margin-left','20px');
	}else if(this.screenWidth == 1024) {
		$('#main-topPanel .logo').css('max-width', '240px');
		$('#main-topPanel #spanTitle').css('font-size', '12px');
		$('#rightTabs').css('margin-left','1px');
	}else {
		$('#main-topPanel .logo').css('max-width', '375px');
		$('#main-topPanel #spanTitle').css('font-size', '20px');
		$('#rightTabs').css('margin-left','40px');
	}
}

//修改蓝色主界面菜单样式
pageStyle.prototype.setBlueIndexItemWidth = function() {
	if(this.screenWidth < 1440 && this.screenWidth > 1280) {
		$('.header .nav-bar a').each(function() {
			$(this).css('padding','18px 18px');
		});
		$('#login-out').css('margin-right','20px');
	}else if(this.screenWidth <= 1280 && this.screenWidth > 1024) {
		$('.header .nav-bar a').each(function() {
			$(this).css('padding','18px 16px');
		});
		$('#login-out').css('margin-right','20px');
	}else if(this.screenWidth == 1024) {
		$('.header .nav-bar a').each(function() {
			$(this).css('padding','18px 10px');
		});
		$('#login-out').css('margin-right','20px');
	}else {
		$('.header .nav-bar a').each(function() {
			$(this).css('padding','18px 22px');
		});
		$('#login-out').css('margin-right','30px');
	}
}

//修改黑色主界面菜单样式
pageStyle.prototype.setBlockIndexItemWidth = function() {
	if(this.screenWidth < 1440 && this.screenWidth > 1280) {
		$('.header .nav-bar a').each(function() {
			$(this).css('padding','0px 12px');
		});
	}else if(this.screenWidth <= 1280 && this.screenWidth > 1024) {
		$('.header .nav-bar a').each(function() {
			$(this).css('padding','0px 9px');
		});
	}else if(this.screenWidth == 1024) {
		$('.header .nav-bar a').each(function() {
			$(this).css('padding','0px 6px');
		});
	}else {
		$('.header .nav-bar a').each(function() {
			$(this).css('padding','0px 15px');
		});
	}
}

//修改绿色主界面菜单样式
pageStyle.prototype.setGreedIndexItemWidth = function() {}

//追加CSS文件到head标签内
pageStyle.prototype.loadHeadCss = function(url, callback) {
	var link = document.createElement("link");
	link.setAttribute("type", "text/css");
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("href", url);
	var heads = document.getElementsByTagName("head");
	if(heads.length)  
        heads[0].appendChild(link);
    else {
    	doc.documentElement.appendChild(link);
    }
	//判断服务器 
	if (navigator.userAgent.indexOf("IE") >= 0) { 
		//IE下的事件 
		link.onreadystatechange = function () {
			//IE下的判断，判断是否加载完成 
			if (link && (link.readyState == "loaded" || link.readyState == "complete")) { 
				link.onreadystatechange = null; 
				if (callback != null) {
					callback(); 
				}
			} 
		}; 
	} else { 
		link.onload = function () { 
			link.onload = null; 
			if (callback != null) {
				callback(); 
			}
		}; 
	}
}