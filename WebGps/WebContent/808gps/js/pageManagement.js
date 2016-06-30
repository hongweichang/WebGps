/**
 * 页面管理类，管理选项卡页面
 */
function pageManagement(pageObj){
	this.mainPageObj = pageObj; //主页面对象
	this.tabManageObj = null; //选项卡管理对象
	this.iframeManageObj = null; //iframe页面管理对象
	this.mapManagePage = new Hashtable(); //管理的页面Map
	this.managePageList = []; //管理的页面集合
	this.currentShowPage = null; //现在显示的页面对象
	this.tabManageWidth = $(this.mainPageObj).width();//选项卡宽度
	this.tabManageBoxWidth = 0; //选项宽度
	this.tabPageWidth = 120; //设置单个选项卡宽度为110px
	this.tabPageSize = 0; //显示多少个选项卡
	this.moveLeft = 0; //移动到左边的序号
	this.moveRight = 0; //移动到右边的序号
	
	//新建一个选项卡管理
	this.initTabManagement();
	//新建一个iframe管理
	this.initIframeManagement();
	//新建事件管理页面高度  onresize
	this.initPageManageResize();
}

/**
 * 新建一个选项卡管理
 */
pageManagement.prototype.initTabManagement = function() {
	this.tabManageObj = document.createElement("div");
	this.tabManageObj.className = 'tabManage';
	//上翻
	var prev = document.createElement("span");
	prev.className = 'tab-page prev';
	//下翻
	var next = document.createElement("span");
	next.className = 'tab-page next';
	
	var div_ul = document.createElement("div");
	div_ul.className = 'tab-box';
	var ul_ = document.createElement("ul");
	$(div_ul).append(ul_);
	
	$(this.tabManageObj).append(prev).append(div_ul).append(next);
	
	$(this.mainPageObj).append(this.tabManageObj);
	
	//调整选项卡集合宽度
	this.initTabManageBoxWidth();
	//给左移右移添加事件
	this.initChangeTabEvent();
}

/**
 * 调整选项卡集合宽度
 */
pageManagement.prototype.initTabManageBoxWidth = function() {
	//初始化宽度为130，如果整个宽度不能整除，则调整到能整除为止
	if(this.tabManageBoxWidth == 0) {
		this.tabManageBoxWidth = $('.tab-box', this.tabManageObj).width();
	}
	if(this.tabManageBoxWidth == 0) {
		this.tabManageBoxWidth = this.tabManageWidth - 35 * 2;
	}
	this.tabPageSize = parseInt(this.tabManageBoxWidth / this.tabPageWidth); //取整数部分
	if(this.tabManageBoxWidth % this.tabPageWidth != 0) {
		this.tabPageWidth = parseInt(this.tabManageBoxWidth / this.tabPageSize);
		var difValue = this.tabManageWidth - this.tabPageWidth * this.tabPageSize;
		$('.tab-box', this.tabManageObj).css("margin", "0px "+ difValue/2 +"px");
	}
	this.moveLeft = 0; //移动到左边的序号
	this.moveRight = this.moveLeft + this.tabPageSize - 1; //移动到右边的序号
}

/**
 * 给左移右移添加事件
 */
pageManagement.prototype.initChangeTabEvent = function() {
	var that = this;
	$('.prev', this.tabManageObj).on('click', function() {
		//选项卡位置
		if(that.managePageList.length > that.tabPageSize && (that.moveLeft > 0 || that.moveRight > that.tabPageSize - 1)) {
			that.moveLeft--;
			that.moveRight--;
			that.tabLeftMoveNumber();
		}
	});
	$('.next', this.tabManageObj).on('click', function() {
		if(that.managePageList.length > that.tabPageSize && (that.moveLeft < (that.managePageList.length - that.tabPageSize) && that.moveRight < that.managePageList.length - 1)) {
			that.moveLeft++;
			that.moveRight++;
			that.tabLeftMoveNumber();
		}
	});
}

/**
 * tabBox 左偏移量
 */
pageManagement.prototype.tabLeftMoveNumber = function() {
	$('.tab-box ul', this.tabManageObj).css('left', - this.moveLeft * this.tabPageWidth);
}

/**
 * 新建一个iframe管理
 */
pageManagement.prototype.initIframeManagement = function() {
	this.iframeManageObj = document.createElement("div");
	this.iframeManageObj.className = 'iframeManage';
	$(this.iframeManageObj).height($(this.mainPageObj).height() - $(this.tabManageObj).height());
	
	$(this.mainPageObj).append(this.iframeManageObj);
}

/**
 * 新建事件管理页面高度  onresize
 */
pageManagement.prototype.initPageManageResize = function() {
	var that = this;
	$(window).resize(function() {
		that.pageManageResize();
	});
}

/**
 * 调整页面高度
 */
pageManagement.prototype.pageManageResize = function() {
	$(this.iframeManageObj).height($(this.mainPageObj).height() - $(this.tabManageObj).height());
	$('.iframePage', this.iframeManageObj).height($(this.mainPageObj).height() - $(this.tabManageObj).height());
}

/**
 * 添加一个页面，包含选项卡和一个iframe
 * @param pageId 页面标识
 * @param tabTitle 选项卡标题
 * @param url 页面链接
 */
pageManagement.prototype.addPage = function(pageId, tabTitle, url) {
	var page_ = null;
	if(!this.isPageExists(pageId)) {//不存在页面则新建页面
		page_ = new myManagePage(pageId, tabTitle, url, this.tabPageWidth);
		//添加选项卡到选项卡管理页面
		$('ul', this.tabManageObj).append(page_.getTabObj());
		//添加选项卡到选项卡管理页面
		$(this.iframeManageObj).append(page_.getIframeObj());
		//调整页面高度
		this.pageManageResize();
		//添加对象到集合
		this.mapManagePage.put(pageId, page_);
		this.managePageList.push(pageId);
		if(this.managePageList.length > this.tabPageSize) {
			//设置ul宽度
			$('ul', this.tabManageObj).css('width', this.managePageList.length * this.tabPageWidth);
			this.moveLeft = this.managePageList.length - this.tabPageSize;
			this.moveRight = this.managePageList.length - 1;
			this.tabLeftMoveNumber();
		}
		//给选项卡页面添加点击事件
		this.onClickEvent(page_);
		//给选项卡删除按钮添加点击事件
		this.onDeleteEvent(page_);
	}else {
		page_ = this.mapManagePage.get(pageId);
	}
	if(this.currentShowPage == null || this.currentShowPage.getPageId() != pageId) {
		if(this.currentShowPage) {
			//隐藏刚才的页面
			this.currentShowPage.hide();
		}
		//显示这个页面
		page_.show();
		this.currentShowPage = page_;
		//如果选项不在可视范围内，则移动到可视范围中心
		this.moveTabToShow();
	}
}

/**
 * 如果选项不在可视范围内，则移动到可视范围中心
 * @param type 1删除
 */
pageManagement.prototype.moveTabToShow = function(type) {
	if(this.managePageList.length > this.tabPageSize) {
		var index = this.getPageIndex(this.currentShowPage.getPageId());
		if(index < this.moveLeft) {
			this.moveLeft = index;
			this.moveRight = index + this.tabPageSize - 1;
		}else if(index > this.moveRight - 1) {
			this.moveRight = index;
			this.moveLeft = index - this.tabPageSize + 1;
		}else {
			if(type && type == 1) {
				this.moveLeft = index - this.tabPageSize + 1 < 0 ? 0 : index - this.tabPageSize + 1;
				this.moveRight = this.moveLeft + this.tabPageSize - 1;
			}
		}
	}else {
		this.moveLeft = 0;
		this.moveRight = this.tabPageSize - 1;
	}
	this.tabLeftMoveNumber();
}
/**
 * 给选项卡页面添加点击事件
 */
pageManagement.prototype.onClickEvent = function(page_) {
	var that = this;
	//新建选项卡点击事件
	$(page_.getTabObj()).on('click', function() {
		if(that.currentShowPage != null && that.currentShowPage.getPageId() != page_.getPageId()) {
			//隐藏刚才的页面
			that.currentShowPage.hide();
			//显示这个页面
			page_.show();
			that.currentShowPage = page_;
		}
	});
}

/**
 * 给选项卡删除按钮添加点击事件
 */
pageManagement.prototype.onDeleteEvent = function(page_) {
	var that = this;
	$('.close', page_.getTabObj()).on('click', function() {
		that.deletePage(page_);
	});
}

/**
 * 删除一个页面
 */
pageManagement.prototype.deletePage = function(page_) {
	if(this.mapManagePage.size() > 0) {
		var lastPage = null;
		var curPage = null;
		var pageId = page_.getPageId();
		var index = 0;
		var that = this;
		if(pageId == this.currentShowPage.getPageId()) {
			this.mapManagePage.each(function(key, value) {
				if(pageId == key) {
					curPage = value;
				}
				if(!lastPage && (curPage == null || index == 1)) {
					lastPage = value;
				}
				index++;
			});
			this.currentShowPage.hide();
			this.currentShowPage = lastPage;
			if(this.currentShowPage != null) {
				this.currentShowPage.show();
			}
		}
		page_.remove();
		this.mapManagePage.remove(pageId);
		var pageIndex = this.getPageIndex(pageId);
		this.managePageList.splice(pageIndex, 1);
		//如果选项不在可视范围内，则移动到可视范围中心
		this.moveTabToShow(1);
	}
}

/**
 * 页面是否存在了
 * @param pageId 页面标识
 */
pageManagement.prototype.isPageExists = function(pageId) {
	return this.mapManagePage.containsKey(pageId);
}

/**
 * 取页面在集合的位置
 */
pageManagement.prototype.getPageIndex = function(pageId) {
	for (var i = 0; i < this.managePageList.length; i++) {
		if(this.managePageList[i] == pageId) {
			return i;
		}
	}
	return null;
}


/**
 * 单个页面类，
 */
function myManagePage(pageId, tabTitle, url, tabPageWidth) {
	this.pageId = pageId; //页面标识  一个页面对应一个标识
	this.tabTitle = tabTitle; //选项卡标题
	this.pageUrl = url; //页面iframe对应链接
	this.tabPageWidth = tabPageWidth; //选项卡宽度
	this.tabObj = null;  //选项卡对象
	this.iframeObj = null; //iframe对象
	this.borderWidth = 1; //边线
	this.marginLeft = 1;//左边距
	this.realWidth = this.tabPageWidth - this.borderWidth * 2 - this.marginLeft;
	
	//加载页面
	this.loadManagePage();
}

/**
 * 获取页面标识
 */
myManagePage.prototype.getPageId = function() {
	return this.pageId;
}

/**
 * 获取选项卡对象
 */
myManagePage.prototype.getTabObj = function() {
	return this.tabObj;
}

/**
 * 获取iframe对象
 */
myManagePage.prototype.getIframeObj = function() {
	return this.iframeObj;
}

/**
 * 加载页面
 */
myManagePage.prototype.loadManagePage = function() {
	//加载选项卡
	this.loadTabPage();
	//加载iframe
	this.loadIframePage();
}

/**
 * 加载选项卡
 */
myManagePage.prototype.loadTabPage = function() {
	this.tabObj = document.createElement("li");
	this.tabObj.className = "tabPage";
	var div_a = document.createElement("div");
	div_a.className = "text";
	var a_ = document.createElement("a");
	$(a_).text(this.tabTitle);
	$(a_).attr('title', this.tabTitle);
	$(div_a).append(a_);
	var icon_ = document.createElement("i");
	icon_.className = "close";
	$(this.tabObj).append(div_a).append(icon_).css('width', this.realWidth);
}

/**
 * 加载iframe
 */
myManagePage.prototype.loadIframePage = function() {
	this.iframeObj = document.createElement("div");
	this.iframeObj.className = "iframePage";
	
	var iframe_ = document.createElement("iframe");
	$(iframe_).attr('width', '100%');
	$(iframe_).attr('height', '100%');
	$(iframe_).attr('frameborder', '0');
	$(iframe_).attr('src', this.pageUrl);
	
	$(this.iframeObj).append(iframe_);
}

/**
 * 显示页面
 */
myManagePage.prototype.show = function() {
	$(this.tabObj).addClass('cur');
	$(this.iframeObj).addClass('cur');
}

/**
 * 显示页面
 */
myManagePage.prototype.hide = function() {
	$(this.tabObj).removeClass('cur');
	$(this.iframeObj).removeClass('cur');
}

/**
 * 删除页面
 */
myManagePage.prototype.remove = function() {
	$(this.tabObj).remove();
	$(this.iframeObj).remove();
}