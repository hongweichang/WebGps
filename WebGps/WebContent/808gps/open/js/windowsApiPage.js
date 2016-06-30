/**
 * 开放Windows API页面
 */
function windowsApiPage() {
	if(!langIsChinese()) {
		this.langParam = 'lang=en';
	}else {
		this.langParam = 'lang=zh';
	}
	this.rootPath = getRootPath();
	if(this.rootPath != '') {
		var paths = window.location.host.split(':');
		this.serverIp = paths[0];
	}
	if(!this.serverIp || this.serverIp == 'localhost') {
		this.serverIp = '127.0.0.1';
	}
	this.loginServerPort = '6605';
}

//加载右边第一菜单
windowsApiPage.prototype.initRightMainPane = function(name, title) {
	var section = '<div class="page-header page-title">';
	section += '	<h1>'+ title +'</h1>';
	section += '</div>';
	return section;
}

//windows sdk
windowsApiPage.prototype.initRightPane_wsdk = function (id, name, title, type) {
    var items = [];
    var section = '<section id="sec-' + name + '">';
    section += '	<div class="page-header">';
    section += '		<h3>' + title + '</h3>';
    section += '	</div>';
    section += '	<dl>';
    var items = this.getFunctionItems(id);
	section += '		<dt>说明</dt>';
    section += '			<dd>'
    section += items.desc;
    section += '			</dd>'
    if(type == 1) {
    	section += '		<dt>调用方法</dt>';
        section += '			<dd>';
        section += this.getFunctionHtml(items.funcItems);
        section += '			</dd>';
        section += '		<dt>方法说明</dt>';
        section += '			<dd>';
        section += this.getFunctionDescHtml(items.funcItems);
        section += '			</dd>';
        section += '		<dt>调用事例</dt>';
        section += '			<dd>';
        section += '				<pre class="prettyprint">';
        section += items.example;
        section += '				</pre>';
        section += '		</dd>';
    }else {
        section += '		<dt>原型</dt>';
        section += '			<dd>' + items.func + '</dd>';
        section += '		<dt>参数</dt>';
        section += '			<dd>';
        section += items.paramItem;
        section += '			</dd>';
        section += '		<dt>返回值</dt>';
        section += '			<dd>';
        section += items.backValue;
        section += '			</dd>';
        section += '		<dt>备注</dt>';
        section += '			<dd>';
        section += '				<pre class="prettyprint">';
        section += items.remark;
        section += '				</pre>';
        section += '			</dd>';
    }
    section += '	</dl>';
    section += '</section>';
    return section;
}

//获取调用方法Html
windowsApiPage.prototype.getFunctionHtml = function(funcItems) {
	var html_ = "";
	if(funcItems) {
		for (var i = 0; i < funcItems.length; i++) {
			html_ += '<p>'+ funcItems[i].title + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + funcItems[i].func +'</p>';
		}
	}
	return html_;
}

//获取方法说明Html
windowsApiPage.prototype.getFunctionDescHtml = function(funcItems) {
	var html_ = "";
	if(funcItems) {
		for (var i = 0; i < funcItems.length; i++) {
			html_ += '<p>'+ funcItems[i].title +'</p>';
			html_ += '<p>参见：<a href="windowsApi.html#sec-'+ funcItems[i].name +'">'+ funcItems[i].func +'</a></p>';
		}
	}
	return html_;
}

//示例
windowsApiPage.prototype.getExampleFunctionItems = function() {
	var items = [];
	items.desc = "用户登录";
	items.funcItems = [];
	items.funcItems.push({name:'getAccount', title: '1.获取用户名', func: 'getAccount'});
	items.funcItems.push({name:'login', title: '2.登录', func: 'login'});
	items.example = "1.获取用户名<br/>";
	items.example += "getAccount<br/>";
	items.example += "2.登录<br/>";
	items.example += "login";
	return items;
}

//示例 获取用户名
windowsApiPage.prototype.getGetAccountFunctionItems = function() {
	var items = [];
	items.desc = "获取用户名";
	items.func = "getAccount";
	items.paramItem = 'nWindow -视频窗口号<br/>';
	items.paramItem += 'nWindow -视频窗口号';
	items.backValue = '成功返回0，否则失败';
	items.remark = "szDevIDNO:设备编号<br/>";
	items.remark += "szDevIDNO:设备编号";
	return items;
}

//示例 登录
windowsApiPage.prototype.getLoginFunctionItems = function() {
	var items = [];
	items.desc = "登录";
	items.func = "login";
	items.paramItem = 'nWindow -视频窗口号<br/>';
	items.paramItem += 'nWindow -视频窗口号';
	items.backValue = '成功返回0，否则失败';
	items.remark = "szDevIDNO:设备编号<br/>";
	items.remark += "szDevIDNO:设备编号";
	return items;
}

//获取方法字段
windowsApiPage.prototype.getFunctionItems = function(id) {
	switch (Number(id)) {
	//login-logout
	case 21:
		return this.getExampleFunctionItems();
	case 71:
		return this.getGetAccountFunctionItems();
	case 72:
		return this.getLoginFunctionItems();
	}
	return [];
}


//获取菜单名称
windowsApiPage.prototype.getItemTitle = function(id) {
	switch (Number(id)) {
        //w_sdk
	case 1:
	    return lang.open_windows_sdk;
        //login-logout
	case 2:
	    return lang.open_wsdk_userLoginOrOut;
	case 21:
	    return lang.open_wsdk_userLogin;
	case 22:
	    return lang.open_wsdk_userLogout;
        //vehicle information
	case 3:
	    return lang.open_wsdk_vehicleInfo;
	case 31:
	    return lang.open_wsdk_getDevIdnoByVehiIdno;
	case 32:
	    return lang.open_wsdk_getDevOnlineStatus;
	case 33:
	    return lang.open_wsdk_getDeviceStatus;
	case 34:
	    return lang.open_wsdk_getDeviceTrack;
	case 35:
	    return lang.open_wsdk_getDeviceAlarmInfo;
        //av
	case 4:
	    return lang.open_wsdk_videoOperate;
	case 41:
	    return lang.open_wsdk_initVideo;
	case 42:
	    return lang.open_wsdk_realtimeVideo_html;
	case 43:
	    return lang.open_wsdk_realtimeVideo_js;
	case 44:
	    return lang.open_wsdk_monitor;
	case 45:
	    return lang.open_wsdk_talkback;
	case 46:
	    return lang.open_wsdk_queryRecording;
	case 47:
	    return lang.open_wsdk_downloadRecording;
	case 48:
	    return lang.open_wsdk_remotePlayback;
	case 49:
	    return lang.open_wsdk_capture;
        //vehicle control
	case 5:
	    return lang.open_wsdk_vehicleControlOperate;
	case 51:
	    return lang.open_wsdk_getUserServer;
	case 52:
	    return lang.open_wsdk_vehicleControl;
	case 53:
	    return lang.open_wsdk_tts;

        //ocx
	case 6:
		return lang.open_windows_ocx;
	case 7:
		return '其他方法';
	case 71:
		return '获取用户名';
	case 72:
		return '登录';
	}
}