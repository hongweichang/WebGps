/**
 * 开放API页面
 */
function apiPage() {
	if(!langIsChinese()) {
		this.langParam = 'lang=en';
	}else {
		this.langParam = 'lang=zh';
	}
	this.localUrl = 'webApi.html';
	if(getUrlParameter("lang") != '') {
		this.localUrl += '?lang='+ getUrlParameter("lang");
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
apiPage.prototype.initRightMainPane = function(name, title) {
	if(name == 'api-desc') {
		var section = '<section id="sec-'+ name +'">';
		section += '	<div class="page-header">';
		section += '		<h1>'+ title +'</h1>';
		section += '	</div>';
		section += this.getApiTopDescHtml();
		section +='</section>';
		return section;
	}else {
		var section = '<div class="page-header page-title">';
		section += '	<h1>'+ title +'</h1>';
		section += '</div>';
		return section;
	}
}

//获取主要接口说明html
apiPage.prototype.getApiTopDescHtml = function() {
	var ret = '';
	ret += '	<h4>1.'+ lang.open_param_encode +'</h4>';
	ret += '	<p>'+ lang.open_param_encode_1 +'</p>';
	ret += '	<p>'+ lang.open_param_encode_2 +'</p>';
	ret += '	<h4>2.'+ lang.open_HTTP_MIME_type +'</h4>';
	ret += '	<dl>';
	ret += '		<dt>JSON</dt>';
	ret += '			<dd>Content-type: text/html; charset=utf-8</dd>';
	ret += '		<dt>JSONP</dt>';
	ret += '			<dd>Content-type: text/javascript; charset=utf-8</dd>';
	ret += '	</dl>';
	ret += '	<h4 id="param-common">3.'+ lang.open_common_param +'</h4>';
	
	var items = [
	      ['jsession', 'string', lang.yes, lang.open_cb_jsession],
	      ['callback', 'string', lang.no, lang.open_cb_callback]
	  ];
	
	ret += this.loadPaneTable(items, 4);
	ret += '	<p><br/><br/>'+ lang.open_cb_desc +'</p>';
	
	items = [
	         ['retult', 'number', lang.open_cb_ok + '<br/>'+ lang.open_cb_other + lang.open_detail_desc +'<a href="'+ this.localUrl +'#error-code">'+ lang.open_error_code_desc +'</a>'],
	         ['callback', 'string', lang.open_cb_callback_desc]
	  ];
	
	ret += this.loadPaneTable(items, 3);
	ret += '	<p><br/></p>';
	ret += '	<h4 id="error-code">4.'+ lang.open_error_code_desc +'</h4>';
	items = [
	         [1, lang.errClientNotExist],
	         [2, lang.errPassword],
	         [3, lang.errUserDeactivated],
	         [4, lang.errUserExpired],
	         [5, lang.errSessionNotExist],
	         [6, lang.errException],
	         [7, lang.errRequireParam],
	         [8, lang.errorNotOperate],
	         [9, lang.errQueryTimeRange],
	         [10, lang.errQueryTimeThanRange],
	         [11, lang.errDownloadTaskExist]
	  ];
	
	ret += this.loadPaneTable(items, 2);
	return ret;
}

//是否加载的是url链接形式，不是调用flash插件
apiPage.prototype.isLoadWebUrl = function(id) {
	if(( id < 40 || id >= 46) && id != 48) {
		return true;
	}
	return false;
}

//加载右边界面
apiPage.prototype.initRightPane = function(id, name, title) {
	var items = [];
	var section = '<section id="sec-'+ name +'">';
	section += '	<div class="page-header">';
	section += '		<h3>'+ title +'</h3>';
	section += '	</div>';
	section += '	<dl>';
	section += '		<dt>'+ lang.open_interfaceDesc +'</dt>';
	section += '			<dd>'
	section +=  this.getItemApiDescHtml(id, title);
	section += '			</dd>'
	if(this.isLoadWebUrl(id)) {
		section += '		<dt>URL</dt>';
		section += '			<dd>'+ this.getItemUrl(id) +'</dd>';
		section += '		<dt>'+ lang.open_req_type +'</dt>';
		section += '			<dd>GET/POST</dd>';
		section += '		<dt>'+ lang.open_req_param_desc +'</dt>';
		section += '			<dd>';
		section += '				<p>'+ lang.open_one_char + lang.open_common_param +'</p>';
		section += '				<p>'+ lang.open_req_see +'<a href="'+ this.localUrl +'#param-common">'+ lang.open_common_param +'</a></p>';
		section += '				<p>'+ lang.open_two_char + lang.open_private_param +'</p>';
		section += this.getSendParamHtml(id);
		section += '			</dd>';
		section += '		<dt>'+ lang.open_req_exp +'</dt>';
		section += '			<dd>';
		section += this.getItemUrl(id, true);
		section += '			<dd>';
		section += '		<dt>'+ lang.open_cb_param_desc +'</dt>';
		section += '			<dd>';
		section += this.getBackParamHtml(id);
		section += '			</dd>';
		section += '		<dt>'+ lang.open_cb_exp +'</dt>';
		section += '			<dd>';
		section += '				<pre class="prettyprint">';
		section += this.getBackExample(id);
		section += '				</pre>';
		section += '			</dd>';
		if(id == 33) {
			section += '		<dt>'+ lang.open_map_example +'</dt>';
			section += '			<dd>'+ this.getVehicleOnMapExampleHtml() +'</dd>';
		}
	}else {
		section += '		<dt>'+ lang.open_ref_file +'</dt>';
		section += '			<dd>';
		if(id == 41) {
			section += this.getInitVideoFileHtml();
		}else if(id == 42) {
			section += lang.nothing;
		}else {
			section += '			<p>'+ lang.open_req_see +'<a href="'+ this.localUrl +'#sec-video-init">'+ lang.open_initVideo +'</a></p>';
		}
		section += '			</dd>';
		section += '		<dt>'+ lang.open_call_method +'</dt>';
		section += '			<dd>';
		section += this.getVideoFunctionHtml(id);
		section += '			</dd>';
		section += '		<dt>'+ lang.open_op_exp +'</dt>';
		section += '			<dd>';
		section += '				<p>'+ lang.open_one_char + lang.open_op_exp_1 +'</p>';
		section += this.getOperateExampleHtml(id);
		section += '				<p>'+ lang.open_two_char + lang.open_op_js +'</p>';
		section += '				<pre class="prettyprint">';
		section += this.getVideoExampleJsHtml(id);
		section += '				</pre>';
		section += '		</dd>';
	}
	section += '	</dl>';
	section +='</section>';
	return section;
}

//获取每个接口的接口说明Html
apiPage.prototype.getItemApiDescHtml = function(id, title) {
	switch (Number(id)) {
	case 21:
		return title;
	case 22:
		return title;
	case 31:
		return title;
	case 32:
		return title;
	case 33:
		return title;
	case 34:
		return title;
	case 35:
		return title;
	case 36:
		return title;
	case 41:
		return this.getVideoInitApiDescHtml(title);
	case 42:
		return title + '<br/>'+ lang.open_video_page_desc +'<br/>';
	case 43:
	case 44:
	case 45:
		return title + '<br/>'+ lang.open_video_js +'<br/>'+ lang.open_req_see + lang.open_op_js +'<br/>';
	case 46:
		return this.getVideoSearchApiDescHtml(title);
	case 47:
		return this.getVideoDownloadApiDescHtml(title);
	case 48:
		return this.getVideoPlaybackApiDescHtml(title);
	case 49:
		return title + '<br/>'+ lang.open_op_notice + lang.open_op_jsonp +'<br/>'+ lang.open_jsonp_desc +'http://'+this.serverIp+':'+ this.loginServerPort + '/3/1/callback=getData?;<br/>';
	case 51:
		return title + '<br/>'+ lang.open_op_server;
	case 52:
		return this.getVehicleControlApiDescHtml(title);
	case 53:
		return this.getVehicleTTSApiDescHtml(title);
	}
}

//获取发送字段
apiPage.prototype.getSendParamHtml = function(id) {
	var items = [];
	switch (Number(id)) {	
	case 21:
		items = this.getUserLoginSendParamItems();
		break;
	case 22:
		items = this.getUserLogoutSendParamItems();
		break;
	case 31:
		items = this.getVehicleDevIdnoSendParamItems();
		break;
	case 32:
		items = this.getDeviceOnlineSendParamItems();
		break;
	case 33:
		items = this.getDeviceStatusSendParamItems();
		break;
	case 34:
		items = this.getGpsTrackSendParamItems();
		break;
	case 35:
		items = this.getDeviceAlarmSendParamItems();
		break;
	case 36:
		items = this.getUserVehicleSendParamItems();
		break;
	case 46:
		return this.getVideoSearchSendParamHtml();
	case 47:
		return this.getVideoDownloadSendParamHtml();
	case 49:
		return null;
	case 51:
		items = this.getUserServerSendParamItems();
		break;
	case 52:
		return this.getVehicleControlSendParamHtml();
	case 53:
		items = this.getVehicleTTSSendParamItems();
		break;
	}
	return this.loadPaneTable(items, 5);
}

//获取返回字段
apiPage.prototype.getBackParamHtml = function(id) {
	var items = [];
	switch (Number(id)) {
	case 21:
		items = this.getUserLoginBackParamItems();
		break;
	case 22:
		items = this.getUserLogoutBackParamItems();
		break;
	case 31:
		items = this.getVehicleDevIdnoBackParamItems();
		break;
	case 32:
		items = this.getDeviceOnlineBackParamItems();
		break;
	case 33:
		items = this.getDeviceStatusBackParamItems();
		break;
	case 34:
		items = this.getGpsTrackBackParamItems();
		break;
	case 35:
		items = this.getDeviceAlarmBackParamItems();
		break;
	case 36:
		items = this.getUserVehicleBackParamItems();
		break;
	case 46:
		return this.getVideoSearchBackParamHtml();
	case 47:
		return this.getVideoDownloadBackParamHtml();
	case 49:
		return null;
	case 51:
		items = this.getUserServerBackParamItems();
		break;
	case 52:
		return this.getVehicleControlBackParamHtml();
	case 53:
		items = this.getVehicleTTSBackParamItems();
		break;
	}
	return this.loadPaneTable(items, 3);
}

//获取返回实例
apiPage.prototype.getBackExample = function(id) {
	var exp_ = "";
	switch (Number(id)) {
	case 21:
		exp_ = this.getUserLoginBackExample();
		break;
	case 22:
		exp_ = this.getUserLogoutBackExample();
		break;
	case 31:
		exp_ = this.getVehicleDevIdnoBackExample();
		break;
	case 32:
		exp_ = this.getDeviceOnlineBackExample();
		break;
	case 33:
		exp_ = this.getDeviceStatusBackExample();
		break;
	case 34:
		exp_ = this.getGpsTrackBackExample();
		break;
	case 35:
		exp_ = this.getDeviceAlarmBackExample();
		break;
	case 36:
		exp_ = this.getUserVehicleBackExample();
		break;
	case 46:
		return this.getVideoSearchBackExample();
	case 47:
		return this.getVideoDownloadBackExample();
	case 49:
		return '';
	case 51:
		exp_ = this.getUserServerBackExample();
		break;
	case 52:
		exp_ = this.getVehicleControlBackExample();
		break;
	case 53:
		exp_ = this.getVehicleTTSBackExample();
		break;
	}
	var html_ = '{';
	html_ += '<br>&nbsp;&nbsp;"result": 0';
	html_ += exp_;
	html_ += '<br>}';
	return html_;
}

//获取视频插件调用方法字段
apiPage.prototype.getVideoFunctionHtml= function(id) {
	switch (Number(id)) {
	case 41:
		return this.getVideoInitFunctionHtml();
	case 42:
		return this.getVideoLiveHtmlFunctionHtml();
	case 43:
		return this.getVideoLiveJsFunctionHtml();
	case 44:
		return this.getVideoMonitorFunctionHtml();
	case 45:
		return this.getVideoTalkbackFunctionHtml();
	case 48:
		return this.getVideoPlaybackFunctionHtml();
	}
}

//获取视频插件操作示例html
apiPage.prototype.getOperateExampleHtml = function(id) {
	var html_ = "";
	if(id == 42) {
		html_ += '<p>a.'+ lang.open_video_exp_1 +'<br/>'+ lang.open_req_see +'<a href="'+ this.rootPath +'/808gps/open/player/video.html?'+ this.langParam + '&devIdno=500000&jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222' +'" target="blank">'+ this.rootPath +'/808gps/open/player/video.html?'+ this.langParam + '&devIdno=500000&<br/>jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222' +'</a></p>';
		html_ += '<p>b.'+ lang.open_video_exp_2 +'<br/>'+ lang.open_req_see +'<a href="'+ this.rootPath +'/808gps/open/player/video.html?'+ this.langParam + '&vehiIdno=50000000000&jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222' +'" target="blank">'+ this.rootPath +'/808gps/open/player/video.html?'+ this.langParam + '&vehiIdno=50000000000&<br/>jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222' +'</a></p>';
		html_ += '<p>c.'+ lang.open_video_exp_3 +'<br/>'+ lang.open_req_see +'<a href="'+ this.rootPath +'/808gps/open/player/video.html?'+ this.langParam + '&devIdno=500000&account=admin&password=admin' +'" target="blank">'+ this.rootPath +'/808gps/open/player/video.html?'+ this.langParam + '&devIdno=500000&<br/>&account=admin&password=admin' +'</a></p>';
		html_ += '<p>d.'+ lang.open_video_exp_4 +'<br/>'+ lang.open_req_see +'<a href="'+ this.rootPath +'/808gps/open/player/video.html?'+ this.langParam + '&vehiIdno=50000000000&account=admin&password=admin' +'" target="blank">'+ this.rootPath +'/808gps/open/player/video.html?'+ this.langParam + '&vehiIdno=50000000000&<br/>account=admin&password=admin' +'</a></p>';
		html_ += '<p>e.'+ lang.open_video_exp_5 +'<br/>'+ lang.open_req_see +'<a href="'+ this.rootPath +'/808gps/open/player/video.html?'+ this.langParam + '&vehiIdno=50000000000&account=admin&password=admin&close=10' +'" target="blank">'+ this.rootPath +'/808gps/open/player/video.html?'+ this.langParam + '&vehiIdno=50000000000&<br/>account=admin&password=admin&close=10' +'</a></p>';
		html_ += '<p>f.'+ lang.open_video_exp_6 +'<br/>'+ lang.open_req_see +'<a href="'+ this.rootPath +'/808gps/open/player/video.html?'+ this.langParam + '&vehiIdno=50000000000&account=admin&password=admin&channel=3' +'" target="blank">'+ this.rootPath +'/808gps/open/player/video.html?'+ this.langParam + '&vehiIdno=50000000000&<br/>account=admin&password=admin&channel=3' +'</a></p>';
	}else {
		html_ += '<p>'+ lang.open_req_see +'<a href="'+ this.rootPath +'/808gps/open/player/videoExample.html?'+ this.langParam +'" target="blank">'+ this.rootPath +'/808gps/open/player/videoExample.html?'+ this.langParam +'</a></p>';
	}
	return html_;
}

//获取视频插件参考事例js代码
apiPage.prototype.getVideoExampleJsHtml = function(id) {
	switch (Number(id)) {
	case 41:
		return this.getVideoInitExampleJsHtml();
	case 42:
		return '';
	case 43:
		return this.getVideoLiveExampleJsHtml();
	case 44:
		return this.getVideoMonitorExampleJsHtml();
	case 45:
		return this.getVideoTalkbackExampleJsHtml();
	case 48:
		return this.getVideoPlaybackExampleJsHtml();
	}
}

//获取初始化视频插件的接口说明Html
apiPage.prototype.getVideoInitApiDescHtml = function(title) {
	var html_ = title + '<br/>';
	html_ += lang.open_one_char + lang.open_video_init_desc +'<br/>';
	html_ += lang.open_two_char + lang.open_video_ref_js +'<br/>';
	html_ += '&lt;script src="//code.jquery.com/jquery.min.js">&lt;/script><br/>';
	html_ += '&lt;script src="'+ this.rootPath +'/808gps/open/player/swfobject.js">&lt;/script><br/>';
	html_ += lang.open_three_char + lang.open_video_html_ready +'<br/>';
	html_ += '&lt;div id="cmsv6flash">&lt;/div><br/>';
	html_ += lang.open_four_char + lang.open_video_js +'<br/>';
	html_ += ''+ lang.open_req_see + lang.open_op_js +'<br/>';
	return html_;
}

//获取录像查询的接口说明Html
apiPage.prototype.getVideoSearchApiDescHtml = function(title) {
	var html_ = title + '<br/>';
	html_ += lang.open_op_notice +'<br/>';
	html_ += lang.open_one_char + lang.open_op_jsonp +'<br/>';
	html_ += lang.open_jsonp_desc +'http://'+this.serverIp+':'+ this.loginServerPort + '/3/1/callback=getData?;<br/>';
	html_ += lang.open_two_char + lang.open_file_across +'<br/>';
	html_ += lang.open_file_across_1 +'<br/>'
		+'a.'+ lang.open_file_across_2 +'<br/>'
		+'b.'+ lang.open_file_across_3 +'<br/>';
	return html_;
}

//获取录像下载的接口说明Html
apiPage.prototype.getVideoDownloadApiDescHtml = function(title) {
	var html_ = title + '<br/>';
	html_ += lang.open_op_notice +'<br/>';
	html_ += lang.open_one_char + lang.open_op_jsonp +'<br/>';
	html_ += lang.open_jsonp_desc +'http://'+this.serverIp+':'+ this.loginServerPort + '/3/1/callback=getData?;<br/>';
	html_ += lang.open_two_char + lang.open_download_type +'<br/>';
	html_ += 'a.'+ lang.open_download_seg_tit + lang.open_download_seg_desc +'<br/>';
	html_ += '&nbsp;&nbsp;'+ lang.open_download_seg_desc_1 +'<br/>';
	html_ += '&nbsp;&nbsp;'+ lang.open_download_all + lang.open_download_all_desc +'<br/>';
	html_ += '&nbsp;&nbsp;'+ lang.open_download_seg_tit + lang.open_download_seg_desc_2 +'<br/>';
	html_ += 'b.'+ lang.open_download_direct_tit + lang.open_download_direct_desc +'<br/>';
	return html_;
}

//获取录像回放的接口说明Html
apiPage.prototype.getVideoPlaybackApiDescHtml = function(title) {
	var html_ = title + '<br/>';
	html_ += lang.open_op_notice +'<br/>';
	html_ += lang.open_one_char + lang.open_op_jsonp +'<br/>';
	html_ += lang.open_jsonp_desc +'http://'+this.serverIp+':'+ this.loginServerPort + '/3/1/callback=getData?;<br/>';
	html_ += lang.open_two_char + lang.open_video_js +'<br/>';
	html_ += lang.open_req_see + lang.open_op_js +'<br/>';
	return html_;
}

//获取车辆控制的接口说明Html
apiPage.prototype.getVehicleControlApiDescHtml = function(title) {
	var html_ = title + '<br/>';
	html_ += lang.open_op_notice +'<br/>';
	html_ += lang.open_one_char + lang.open_op_jsonp +'<br/>';
	html_ += lang.open_jsonp_desc +'http://'+this.serverIp+':6604/2/7/callback=getData?;<br/>';
	html_ += lang.open_two_char + lang.open_vehicle_ol_rq +'<br/>';
	return html_;
}

//获取车辆TTS的接口说明Html
apiPage.prototype.getVehicleTTSApiDescHtml = function(title) {
	var html_ = title + '<br/>';
	html_ += lang.open_op_notice +'<br/>';
	html_ += lang.open_one_char + lang.open_op_jsonp +'<br/>';
	html_ += lang.open_jsonp_desc +'http://'+this.serverIp+':6604/2/5/callback=getData?;<br/>';
	html_ += lang.open_two_char + lang.open_vehicle_ol_rq +'<br/>';
	return html_;
}

//获取用户登录发送字段
apiPage.prototype.getUserLoginSendParamItems = function() {
	return [
	    ['account', 'string', lang.yes, lang.nothing, lang.open_login_account],
	    ['password', 'string', lang.yes, lang.nothing, lang.open_login_pwd]
	 ];
}

//获取用户注销发送字段
apiPage.prototype.getUserLogoutSendParamItems = function() {
	return this.getDefaultParamItems(5);
}

//获取车辆设备号发送字段
apiPage.prototype.getVehicleDevIdnoSendParamItems = function() {
	return [
		    ['vehiIdno', 'string', lang.yes, lang.nothing, lang.open_vehicle_idno+ '<br/>' +lang.open_vehiIdno_moreTip]
		 ];
}

//获取设备在线状态发送字段
apiPage.prototype.getDeviceOnlineSendParamItems = function() {
	return [
		    ['devIdno', 'string', lang.no, lang.nothing, lang.open_device_idno+ '<br/>' +lang.open_vehiIdno_moreTip+ '<br/>' +lang.open_page_url_vehiIdno],
		    ['vehiIdno', 'string', lang.no, lang.nothing, lang.open_vehicle_idno+ '<br/>' +lang.open_vehiIdno_moreTip+ '<br/>' +lang.open_page_url_devIdno]
		 ];
}

//获取设备/GPS状态发送字段
apiPage.prototype.getDeviceStatusSendParamItems = function() {
	return [
		    ['devIdno', 'string', lang.no, lang.nothing, lang.open_device_idno+ '<br/>' +lang.open_vehiIdno_moreTip+ '<br/>' +lang.open_page_url_vehiIdno],
		    ['vehiIdno', 'string', lang.no, lang.nothing, lang.open_vehicle_idno+ '<br/>' +lang.open_vehiIdno_moreTip+ '<br/>' +lang.open_page_url_devIdno],
		    ['toMap', 'number', lang.no, lang.nothing, lang.open_map_lnglat +'<br/>'+ lang.open_map_lnglat_desc]
		 ];
}

//获取设备历史轨迹发送字段
apiPage.prototype.getGpsTrackSendParamItems = function() {
	return [
		    ['devIdno', 'string', lang.yes, lang.nothing, lang.open_device_idno],
		    ['begintime', 'string', lang.yes, lang.nothing, lang.open_start_time],
		    ['endtime', 'string', lang.yes, lang.nothing, lang.open_end_time +'<br/>'+ lang.open_time_range_1],
		    ['currentPage', 'number', lang.no, lang.nothing, lang.open_page_now +'<br/>'+ lang.open_query_pagin_null],
		    ['pageRecords', 'number', lang.no, lang.nothing, lang.open_page_record +'<br/>'+ lang.open_query_pagin_null],
		    ['toMap', 'number', lang.no, lang.nothing, lang.open_map_lnglat +'<br/>'+ lang.open_map_lnglat_desc]
		 ];
}

//获取设备报警信息发送字段
apiPage.prototype.getDeviceAlarmSendParamItems = function() {
	return [
		    ['devIdno', 'string', lang.no, lang.nothing, lang.open_device_idno+ '<br/>' +lang.open_vehiIdno_moreTip+ '<br/>' +lang.open_page_url_vehiIdno],
		    ['vehiIdno', 'string', lang.no, lang.nothing, lang.open_vehicle_idno+ '<br/>' +lang.open_vehiIdno_moreTip+ '<br/>' +lang.open_page_url_devIdno],
		    ['begintime', 'string', lang.yes, lang.nothing, lang.open_start_time],
		    ['endtime', 'string', lang.yes, lang.nothing, lang.open_end_time +'<br/>'+ lang.open_time_range_2],
		    ['armType', 'string', lang.no, lang.nothing, lang.open_alarm_type +'<br/>'+ lang.open_alarm_type_desc],
		    ['handle', 'number', lang.no, lang.nothing, lang.open_handle_status +'<br/>'+ lang.open_handle_status_desc],
		    ['currentPage', 'number', lang.yes, 1, lang.open_page_now],
		    ['pageRecords', 'number', lang.yes, 10, lang.open_page_record],
		    ['toMap', 'number', lang.no, lang.nothing, lang.open_map_lnglat +'<br/>'+ lang.open_map_lnglat_desc]
		 ];
}

//获取用户车辆信息发送字段
apiPage.prototype.getUserVehicleSendParamItems = function() {
	return this.getDefaultParamItems(5);
}

//获取录像查询发送html
apiPage.prototype.getVideoSearchSendParamHtml = function() {
	var html_ = '<p>a.'+ lang.open_query_ref_server +'</P>';
	var items = [
	        ['DevIDNO', 'string', lang.yes, lang.nothing, lang.open_device_idno +'<br/>'+ lang.open_query_video_idno],
	        ['Location', 'number', lang.yes, lang.nothing, lang.open_query_location +'<br/>'+ lang.open_query_location_desc]
	  ];
	html_ += this.loadPaneTable(items, 5);
	html_ += '<p>b.'+ lang.open_queryRecording +'</P>';
	items = [
		        ['DevIDNO', 'string', lang.yes, lang.nothing, lang.open_device_idno +'<br/>'+ lang.open_query_video_idno],
		        ['LOC', 'number', lang.yes, lang.nothing, lang.open_query_location +'<br/>'+ lang.open_query_location_desc],
		        ['CHN', 'number', lang.yes, lang.nothing, lang.open_query_chn + lang.open_query_begChn +'<br/>'+ lang.open_query_chn_desc],
		        ['YEAR', 'string', lang.yes, lang.nothing, lang.open_query_year],
		        ['MON', 'string', lang.yes, lang.nothing, lang.open_query_month],
		        ['DAY', 'string', lang.yes, lang.nothing, lang.open_query_day],
		        ['RECTYPE', 'number', lang.yes, lang.nothing, lang.open_video_type +'<br/>'+ lang.open_video_type_desc_1],
		        ['FILEATTR', 'number', lang.yes, lang.nothing, lang.open_file_type +'<br/>'+ lang.open_file_type_desc],
		        ['BEG', 'number', lang.yes, lang.nothing, lang.open_start_second +'<br/>'+ lang.open_start_second_desc],
		        ['END', 'number', lang.yes, lang.nothing, lang.open_end_second +'<br/>'+ lang.open_start_second_desc]
		  ];
	html_ += this.loadPaneTable(items, 5);
	return html_;
}

//获取录像下载发送html
apiPage.prototype.getVideoDownloadSendParamHtml = function() {
	var html_ = '<p>a.'+ lang.open_download_seg +'</P>';
	var items = [
	        ['did', 'string', lang.yes, lang.nothing, lang.open_device_idno],
	        ['fbtm', 'string', lang.yes, lang.nothing, lang.open_file_start_time +'<br/>'+ lang.open_file_start_time_desc],
	        ['fetm', 'string', lang.yes, lang.nothing, lang.open_file_end_time +'<br/>'+ lang.open_file_start_time_desc],
	        ['sbtm', 'string', lang.yes, lang.nothing, lang.open_srcfile_start_time],
	        ['setm', 'string', lang.yes, lang.nothing, lang.open_srcfile_end_time],
	        ['lab', 'string', lang.yes, lang.nothing, lang.open_video_tag],
	        ['fph', 'string', lang.yes, lang.nothing, lang.open_video_path],
	        ['vtp', 'number', lang.yes, lang.nothing, lang.open_video_type +'<br/>'+ lang.open_video_type_desc_2],
	        ['len', 'number', lang.yes, lang.nothing, lang.open_file_size],
	        ['chn', 'number', lang.yes, lang.nothing, lang.open_video_chn],
	        ['dtp', 'number', lang.yes, lang.nothing, lang.open_download_type +'<br/>'+ lang.open_download_type_desc]
	  ];
	html_ += this.loadPaneTable(items, 5);
	html_ += '<p>b.'+ lang.open_query_ref_server +'</P>';
	var items = [
	        ['DevIDNO', 'string', lang.yes, lang.nothing, lang.open_device_idno +'<br/>'+ lang.open_query_video_idno],
	        ['FileSvrID', 'number', lang.yes, lang.nothing, lang.open_server_id +'<br/>'+ lang.open_server_id_desc],
	        ['Location', 'number', lang.yes, lang.nothing, lang.open_video_location +'<br/>'+ lang.open_query_location_desc]
	  ];
	html_ += this.loadPaneTable(items, 5);
	html_ += '<p>c.'+ lang.open_downloadRecording +'</P>';
	items = [
		        ['DevIDNO', 'string', lang.yes, lang.nothing, lang.open_device_idno +'<br/>'+ lang.open_query_video_idno],
		        ['FLENGTH', 'number', lang.yes, lang.nothing, lang.open_file_size +'<br/>'+ lang.open_video_find_desc],
		        ['FOFFSET', 'number', lang.yes, lang.nothing, lang.open_video_fill_1],
		        ['MTYPE', 'number', lang.yes, lang.nothing, lang.open_video_fill_2],
		        ['FPATH', 'string', lang.yes, lang.nothing, lang.open_file_path],
		        ['SAVENAME', 'string', lang.yes, lang.nothing, lang.open_download_save_name]
		  ];
	html_ += this.loadPaneTable(items, 5);
	return html_;
}

//获取用户服务器信息发送字段
apiPage.prototype.getUserServerSendParamItems = function() {
	return this.getDefaultParamItems(5);
}

//获取车辆控制发送html
apiPage.prototype.getVehicleControlSendParamHtml = function() {
	var html_ = '<p>a.'+ lang.open_gps_interval +'</P>';
	var items = [
	        ['DevIDNO', 'string', lang.yes, lang.nothing, lang.open_device_idno],
	        ['Time', 'number', lang.yes, lang.nothing, lang.open_gps_interval_time +'<br/>'+ lang.open_gps_interval_time_desc]
	  ];
	html_ += this.loadPaneTable(items, 5);
	html_ += '<p>b.'+ lang.open_other_control +'</P>';
	var items = [
	        ['DevIDNO', 'string', lang.yes, lang.nothing, lang.open_device_idno],
	        ['CtrlType', 'number', lang.yes, lang.nothing,  lang.open_control_type +'<br/>'+ lang.open_control_type_desc],
	        ['Usr', 'string', lang.yes, lang.nothing, lang.open_login_account],
	        ['Pwd', 'string', lang.yes, lang.nothing, lang.open_login_pwd +'<br/>'+ lang.open_login_pwd_desc]
	  ];
	html_ += this.loadPaneTable(items, 5);
	return html_;
}

//获取TTS发送字段
apiPage.prototype.getVehicleTTSSendParamItems = function() {
	return [
		    ['DevIDNO', 'string', lang.yes, lang.nothing, lang.open_device_idno],
		    ['Text', 'string', lang.yes, lang.nothing, lang.open_tts_text +'<br/>'+ lang.open_tts_text_desc]
		 ];
}

//获取用户登录返回字段
apiPage.prototype.getUserLoginBackParamItems = function() {
	return [
		    ['jsession', 'string', lang.open_jsession_id]
		 ];
}

//获取用户注销返回字段
apiPage.prototype.getUserLogoutBackParamItems = function() {
	return this.getDefaultParamItems(3);
}

//获取车辆设备号返回字段
apiPage.prototype.getVehicleDevIdnoBackParamItems = function() {
	return [
		    ['did', 'string', lang.open_device_idno],
		    ['vid', 'string', lang.open_vehicle_idno],
		    ['type', 'number', lang.open_device_type +'<br/>'+ lang.open_device_type_desc]
		 ];
}

//获取设备在线状态返回字段
apiPage.prototype.getDeviceOnlineBackParamItems = function() {
	return [
	        ['did', 'string', lang.open_device_idno],
	        ['vid', 'string', lang.open_vehicle_idno +'<br/>'+ lang.open_query_devIdno_null],
		    ['online', 'number', lang.open_status_online +'<br/>'+ lang.open_status_online_desc]
		 ];
}

//获取设备/GPS状态返回字段
apiPage.prototype.getDeviceStatusBackParamItems = function() {
	return [
		    ['id', 'string', lang.open_device_idno],
		    ['vid', 'string', lang.open_vehicle_idno +'<br/>'+ lang.open_query_devIdno_null],
		    ['lng', 'number', lang.open_status_lng +'<br/>'+ lang.open_status_lng_desc],
		    ['lat', 'number', lang.open_status_lat +'<br/>'+ lang.open_status_lng_desc],
		    ['ft', 'number', lang.open_status_factory],
		    ['sp', 'number', lang.open_status_speed +'<br/>'+ lang.open_status_speed_desc],
		    ['ol', 'number', lang.open_status_online +'<br/>'+ lang.open_status_online_desc],
		    ['gt', 'string', lang.open_status_gpsTime],
		    ['pt', 'number', lang.open_status_protocol],
		    ['dt', 'number', lang.open_status_hard +'<br/>'+ lang.open_status_hard_desc],
		    ['ac', 'number', lang.open_status_audio],
		    ['fdt', 'number', lang.open_status_subFactory],
		    ['net', 'number', lang.open_status_network +'<br/>'+ lang.open_status_network_desc],
		    ['gw', 'string', lang.open_status_server],
		    ['s1', 'number', lang.open_status_status +' 1<br/>'+ lang.open_detail_desc +'<a href="#_'+ lang.open_device_status_desc +'_">'+ lang.open_device_status_desc +'</a>'],
		    ['s2', 'number', lang.open_status_status +' 2<br/>'+ lang.open_detail_desc +'<a href="#_'+ lang.open_device_status_desc +'_">'+ lang.open_device_status_desc +'</a>'],
		    ['s3', 'number', lang.open_status_status +' 3<br/>'+ lang.open_detail_desc +'<a href="#_'+ lang.open_device_status_desc +'_">'+ lang.open_device_status_desc +'</a>'],
		    ['s4', 'number', lang.open_status_status +' 4<br/>'+ lang.open_detail_desc +'<a href="#_'+ lang.open_device_status_desc +'_">'+ lang.open_device_status_desc +'</a>'],
		    ['t1', 'number', lang.open_status_temp +' 1'],
		    ['t2', 'number', lang.open_status_temp +' 2'],
		    ['t3', 'number', lang.open_status_temp +' 3'],
		    ['t4', 'number', lang.open_status_temp +' 4'],
		    ['hx', 'number', lang.open_status_direc +'<br/>'+ lang.open_status_direc_desc],
		    ['mlng', 'string', lang.open_status_mapLng +'<br/>'+ lang.open_status_mapLng_desc],
		    ['mlat', 'string', lang.open_status_mapLat +'<br/>'+ lang.open_status_mapLat_desc],
		    ['pk', 'number', lang.open_status_parkTime +'<br/>'+ lang.open_status_parkTime_desc],
		    ['lc', 'number', lang.open_status_mileage +'<br/>'+ lang.open_status_mileage_desc],
		    ['yl', 'number', lang.open_status_fuel +'<br/>'+ lang.open_status_fuel_desc]
		];
}

//获取设备历史轨迹返回字段
apiPage.prototype.getGpsTrackBackParamItems = function() {
	return [
		    ['tracks', 'Array', lang.open_track_data +'<br/>'+ lang.open_detail_desc +'<a href="'+ this.localUrl +'#sec-vehicle-device-gps">'+ lang.open_getDeviceStatus + lang.open_cb_param_desc +'</a>'],
		    ['totalPages', 'number', lang.open_page_allPage],
		    ['currentPage', 'number', lang.open_page_now],
		    ['pageRecords', 'number', lang.open_page_record],
		    ['totalRecords', 'number', lang.open_page_total]
		];
}

//获取设备报警信息返回字段
apiPage.prototype.getDeviceAlarmBackParamItems = function() {
	return [
		    ['info', 'number', lang.open_alarm_info],
		    ['desc', 'string', lang.open_alarm_desc],
		    ['atp', 'number', lang.open_alarm_type +'<br/>'+ lang.open_detail_desc +'<a href="#_'+ lang.open_device_alarmType_desc +'_">'+ lang.open_device_alarmType_desc +'</a>'],
		    ['did', 'string', lang.open_device_idno],
		    ['vid', 'string', lang.open_vehicle_idno +'<br/>'+ lang.open_query_devIdno_null],
		    ['etm', 'number', lang.open_alarm_endTime],
		    ['stm', 'number', lang.open_alarm_startTime],
		    ['guid', 'string', lang.open_alarm_guid],
		    ['p1', 'number', lang.open_alarm_param +' 1<br/>'+ lang.open_detail_desc +'<a href="#_'+ lang.open_device_alarmParam_desc +'_">'+ lang.open_device_alarmParam_desc +'</a>'],
		    ['p2', 'number', lang.open_alarm_param +' 2<br/>'+ lang.open_detail_desc +'<a href="#_'+ lang.open_device_alarmParam_desc +'_">'+ lang.open_device_alarmParam_desc +'</a>'],
		    ['p3', 'number', lang.open_alarm_param +' 3<br/>'+ lang.open_detail_desc +'<a href="#_'+ lang.open_device_alarmParam_desc +'_">'+ lang.open_device_alarmParam_desc +'</a>'],
		    ['p4', 'number', lang.open_alarm_param +' 4<br/>'+ lang.open_detail_desc +'<a href="#_'+ lang.open_device_alarmParam_desc +'_">'+ lang.open_device_alarmParam_desc +'</a>'],
		    ['img', 'string', lang.open_alarm_img +'<br/>'+ lang.open_alarm_img_desc],
		    ['hd', 'number', lang.open_handle_status +'<br/>'+ lang.open_handle_status_desc_1],
		    ['hdu', 'number', lang.open_alarm_handleId],
		    ['hdc', 'string', lang.open_alarm_handleCont],
		    ['hdt', 'string', lang.open_alarm_handleTime],
		    ['ss1', 'number', lang.open_alarm_begStatus +' 1<br/>'+ lang.open_detail_desc +'<a href="#_'+ lang.open_device_alarmStatus_desc +'_">'+ lang.open_device_alarmStatus_desc +'</a>'],
		    ['ss2', 'number', lang.open_alarm_begStatus +' 2<br/>'+ lang.open_detail_desc +'<a href="#_'+ lang.open_device_alarmStatus_desc +'_">'+ lang.open_device_alarmStatus_desc +'</a>'],
		    ['es1', 'number', lang.open_alarm_endStatus +' 1<br/>'+ lang.open_detail_desc +'<a href="#_'+ lang.open_device_alarmStatus_desc +'_">'+ lang.open_device_alarmStatus_desc +'</a>'],
		    ['es2', 'number', lang.open_alarm_endStatus +' 2<br/>'+ lang.open_detail_desc +'<a href="#_'+ lang.open_device_alarmStatus_desc +'_">'+ lang.open_device_alarmStatus_desc +'</a>'],
		    ['slng', 'number', lang.open_alarm_begLng],
		    ['slat', 'number', lang.open_alarm_begLat],
		    ['elng', 'number', lang.open_alarm_endLng],
		    ['elat', 'number', lang.open_alarm_endLat],
		    ['ssp', 'number', lang.open_alarm_begSpeed +'<br/>'+ lang.open_status_speed_desc],
		    ['esp', 'number', lang.open_alarm_endSpeed +'<br/>'+ lang.open_status_speed_desc],
		    ['slc', 'number', lang.open_alarm_begMileage +'<br/>'+ lang.open_status_mileage_desc],
		    ['elc', 'number', lang.open_alarm_endMileage +'<br/>'+ lang.open_status_mileage_desc],
		    ['smlng', 'string', lang.open_alarm_begMapLng +'<br/>'+ lang.open_status_mapLng_desc],
		    ['smlat', 'string', lang.open_alarm_begMapLat +'<br/>'+ lang.open_status_mapLat_desc],
		    ['emlng', 'string', lang.open_alarm_endMapLng +'<br/>'+ lang.open_status_mapLng_desc],
		    ['emlat', 'string', lang.open_alarm_endMapLat +'<br/>'+ lang.open_status_mapLat_desc],
		    ['totalPages', 'number', lang.open_page_allPage],
		    ['currentPage', 'number', lang.open_page_now],
		    ['pageRecords', 'number', lang.open_page_record],
		    ['totalRecords', 'number', lang.open_page_total]
		];
}

//获取用户车辆信息返回字段
apiPage.prototype.getUserVehicleBackParamItems = function() {
	return [
	        ['id', 'number', lang.open_vehicle_id],
		    ['nm', 'string', lang.open_vehicle_idno],
		    ['ic', 'number', lang.open_vehicle_icon],
		    ['pid', 'number', lang.open_vehicle_company],
		    ['dl', 'Array', lang.open_vehicle_devices +'<br/>'+ lang.open_vehicle_devices_desc],
		    ['id', 'string', lang.open_device_idno],
		    ['pid', 'number', lang.open_vehicle_devCompany],
		    ['ic', 'number', lang.open_vehicle_IO_num],
		    ['io', 'string', lang.open_vehicle_IO_name +'<br/>'+ lang.open_vehicle_name_desc],
		    ['cc', 'number', lang.open_vehicle_chn_num],
		    ['cn', 'string', lang.open_vehicle_chn_name +'<br/>'+ lang.open_vehicle_name_desc],
		    ['tc', 'number', lang.open_vehicle_temp_num],
		    ['tn', 'string', lang.open_vehicle_temp_name +'<br/>'+ lang.open_vehicle_name_desc],
		    ['md', 'number', lang.open_vehicle_module +'<br/>'+ lang.open_vehicle_module_desc],
		    ['sim', 'string', lang.open_vehicle_SIM]
		];
}

//获取录像查询返回html
apiPage.prototype.getVideoSearchBackParamHtml = function() {
	var html_ = '<p>a.'+ lang.open_query_ref_server +'</P>';
	var items = this.getServerBackItems(true);
	html_ += this.loadPaneTable(items, 3);
	html_ += '<p>b.'+ lang.open_queryRecording +'</P>';
	items = [
	    ['result', 'string', lang.open_video_cbId +'<br/>'+ lang.open_video_cbId_desc],
	    ['devIdno', 'string', lang.open_device_idno +'<br/>'+ lang.open_query_video_idno],
	    ['chnMask', 'number', lang.open_video_chnMask +'<br/>'+ lang.open_video_chnMask_desc],
	    ['chn', 'number', lang.open_device_chn + lang.open_query_begChn +'<br>'+ lang.open_device_chn_desc],
        ['beg', 'number', lang.open_file_start_time +'<br/>'+ lang.open_file_start_time_desc_1],
        ['end', 'number', lang.open_file_end_time +'<br/>'+ lang.open_file_end_time_desc],
        ['year', 'number', lang.open_video_year +'<br/>'+ lang.open_video_year_desc],
        ['mon', 'number', lang.open_video_month],
        ['day', 'number', lang.open_video_day],
        ['file', 'string', lang.open_video_fileName],
        ['len', 'number', lang.open_file_size +lang.open_video_lenUnit],
        ['loc', 'number', lang.open_file_location +'<br/>'+ lang.open_query_location_desc],
        ['type', 'number', lang.open_video_type +'<br/>'+ lang.open_video_type_desc_2],
        ['recing', 'number', lang.open_video_recing +'<br/>'+ lang.open_video_recing_desc],
        ['svr', 'number', lang.open_server_id +'<br/>'+ lang.open_video_server_desc],
        ['arm', 'string', lang.open_alarm_info +'<br/>'+ lang.open_video_alarm_desc]
	];
	html_ += this.loadPaneTable(items, 3);
	return html_;
}

//获取录像下载返回html
apiPage.prototype.getVideoDownloadBackParamHtml = function() {
	var html_ = '<p>a.'+ lang.open_download_seg +'</P>';
	var items = this.getDefaultParamItems(3);
	html_ += this.loadPaneTable(items, 3);
	html_ += '<p>b.'+ lang.open_query_ref_server +'</P>';
	items = this.getServerBackItems(true);
	html_ += this.loadPaneTable(items, 3);
	html_ += '<p>c.'+ lang.open_downloadRecording +'</P>';
	items = this.getDefaultParamItems(3);
	html_ += this.loadPaneTable(items, 3);
	return html_;
}

//获取用户服务器返回字段
apiPage.prototype.getUserServerBackParamItems = function() {
	return this.getServerBackItems();
}

//获取车辆控制返回html
apiPage.prototype.getVehicleControlBackParamHtml = function() {
	var html_ = '<p>a.'+ lang.open_gps_interval +'</P>';
	var items = [
	       ['result', 'number', lang.open_video_cbId +'<br/>'+ lang.open_video_cbId_desc]
	   ];
	html_ += this.loadPaneTable(items, 3);
	html_ += '<p>b.'+ lang.open_other_control +'</P>';
	html_ += this.loadPaneTable(items, 3);
	return html_;
}

//获取TTS返回字段
apiPage.prototype.getVehicleTTSBackParamItems = function() {
	return [
		['result', 'number', lang.open_video_cbId +'<br/>'+ lang.open_video_cbId_desc]
	];
}


//获取用户登录返回实例
apiPage.prototype.getUserLoginBackExample = function() {
	return ',<br>&nbsp;&nbsp;"jsession": "cf6b70a3-c82b-4392-8ab6-bbddce336222"';
}

//获取用户注销返回实例
apiPage.prototype.getUserLogoutBackExample = function() {
	return '';
}

//获取车辆设备号返回实例
apiPage.prototype.getVehicleDevIdnoBackExample = function() {
	var ret = ',<br>&nbsp;&nbsp;"devices":[';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;{';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"did":"1234"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"vid":"50000000000"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type":1';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;},';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;{';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"did":"dsdasd21116"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"vid":"50000000000"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type":0';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;}';
	ret += '<br>&nbsp;&nbsp;]';
	return ret;
}

//获取设备在线状态返回实例
apiPage.prototype.getDeviceOnlineBackExample = function() {
	var ret = ',<br>&nbsp;&nbsp;"onlines":[';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;{';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"did":"500000"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"vid": null';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"online":1';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;}';
	ret += '<br>&nbsp;&nbsp;]';
	return ret;
}

//获取设备/GPS状态返回实例
apiPage.prototype.getDeviceStatusBackExample = function() {
	var ret = ',<br>&nbsp;&nbsp;"status":[';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;{';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id":"500000"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"vid": null';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"lng":113921858';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"lat":22568745';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"ft":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sp":520';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"ol":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"gt":"2015-12-14 18:54:58.0"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pt":1';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"dt":1';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"ac":1';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"fdt":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"net":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"gw":"G1"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"s1":805310851';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"s2":1280';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"s3":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"s4":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"t1":-321';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"t2":350';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"t3":-200';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"t4":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"hx":137';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"mlng":"113.926720"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"mlat":"22.565703"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pk":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"lc":161446267';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"yl":101';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;}';
	ret += '<br>&nbsp;&nbsp;]';
	return ret;
}

//获取设备历史轨迹返回实例
apiPage.prototype.getGpsTrackBackExample = function() {
	var ret = ',<br>&nbsp;&nbsp;"tracks":[';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;{';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id":"500000"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"lng":113921858';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"lat":22568745';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"ft":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sp":520';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"ol":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"gt":"2015-12-14 18:54:58.0"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pt":1';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"dt":1';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"ac":1';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"fdt":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"net":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"gw":"G1"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"s1":805310851';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"s2":1280';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"s3":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"s4":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"t1":-321';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"t2":350';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"t3":-200';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"t4":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"hx":137';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"mlng":"113.926720"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"mlat":"22.565703"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pk":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"lc":161446267';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"yl":101';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;}';
	ret += '<br>&nbsp;&nbsp;],';
	ret += '<br>&nbsp;&nbsp;"pagination":';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;{';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"totalPages": 42';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"currentPage": 1';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pageRecords": 50';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"totalRecords": 2078';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sortParams": null';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"hasNextPage": true';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"hasPreviousPage": false';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"nextPage": 2';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"previousPage": 1';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"startRecord": 0';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;}';
	return ret;
}

//获取设备报警信息返回实例
apiPage.prototype.getDeviceAlarmBackExample = function() {
	var ret = ',<br>&nbsp;&nbsp;"alarms":[';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;{';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"info": 0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"desc":""';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"atp":11';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"did":"500000"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"vid":null';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"etm":1451374197000';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"stm":1451374197000';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"guid":"500000EB9B109898F74ADCB1B4446B9FFD2"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"p1":12000';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"p2":6000';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"p3":10000';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"p4":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"img":""';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"hd":1';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"hdu":"admin"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"hdc":"vcxvcvcxv"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"hdt":"2015-12-29 16:50:50"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"ss1":805327235';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"ss2":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"es1":805327235';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"es2":0';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"slng":113850504';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"slat":22628389';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"elng":113850504';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"elat":22628389';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"ssp":990';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"esp":990';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"slc":164338463';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"elc":164338463';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"smlng":"113.861938"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"smlat":"22.631491"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"emlng":"113.861938"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"emlat":"22.631491"';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;}';
	ret += '<br>&nbsp;&nbsp;],';
	ret += '<br>&nbsp;&nbsp;"pagination":';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;{';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"totalPages": 42';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"currentPage": 1';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pageRecords": 50';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"totalRecords": 2078';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sortParams": null';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"hasNextPage": true';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"hasPreviousPage": false';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"nextPage": 2';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"previousPage": 1';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"startRecord": 0';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;}';
	return ret;
}

//获取用户车辆信息返回实例
apiPage.prototype.getUserVehicleBackExample = function() {
	var ret = ',<br>&nbsp;&nbsp;"vehicles":[';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;{';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id":34';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"nm":"50000000001"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"ic":11';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pid":1';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"dl":[';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id":"500000"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pid":2';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"ic":3';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"io":"IO_1,IO_2,IO_3"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"cc":4';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"cn":"CH1,CH2,CH3,CH4"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tc":3';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tn":"TEMP_1,TEMP_2,TEMP_3"';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"md":1568';
	ret += ',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sim":null';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;}';
	ret += '<br>&nbsp;&nbsp;]';
	return ret;
}

//获取录像查询返回实例
apiPage.prototype.getVideoSearchBackExample = function() {
	var ret = 'a.'+ lang.open_query_ref_server;
	ret += '<br>{';
	ret += '<br>&nbsp;&nbsp;"result": 0';
	ret += ',<br>&nbsp;&nbsp;"cmsserver":1';
	ret += this.getServerBackExample();
	ret += '<br>}';
	ret += '<br>b.'+ lang.open_queryRecording;
	ret += '<br>{';
	ret += '<br>&nbsp;&nbsp;"result": 0';
	ret += ',<br>&nbsp;&nbsp;"cmsserver":1';
	ret += ',<br>&nbsp;&nbsp;"files":[';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;{';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"arm": 0';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"beg": 31044';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chn": 1';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chnMask": 0';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"day": 11';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"devIdno": "500000"';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"end": 32842';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"file": "F:/MulMDVR/Record/H20100628-083724P2N2P0.264"';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"len": 23211837';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"loc": 1';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"mon": 1';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"recing": 0';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"svr": 0';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type": 0';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"year": 10';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;}';
	ret += '<br>&nbsp;&nbsp;]';
	ret += '<br>}';
	return ret;
}

//获取录像下载返回实例
apiPage.prototype.getVideoDownloadBackExample = function() {
	var ret = 'a.'+ lang.open_download_seg;
	ret += '<br>{';
	ret += '<br>&nbsp;&nbsp;"result": 0';
	ret += '<br>}';
	ret += '<br>b.'+ lang.open_query_ref_server;
	ret += '<br>{';
	ret += '<br>&nbsp;&nbsp;"result": 0';
	ret += ',<br>&nbsp;&nbsp;"cmsserver":1';
	ret += this.getServerBackExample();
	ret += '<br>}';
	ret += '<br>c.'+ lang.open_download_video;
	return ret;
}

//获取用户服务器信息返回实例
apiPage.prototype.getUserServerBackExample = function() {
	return this.getServerBackExample(1);
}

//获取车辆控制返回实例
apiPage.prototype.getVehicleControlBackExample = function() {
	return '';
}

//获取TTS返回实例
apiPage.prototype.getVehicleTTSBackExample = function() {
	return '';
}

//获取默认的菜单字段
apiPage.prototype.getDefaultParamItems = function(length) {
	var items = [];
	var subItem = [];
	for (var i = 0; i < length; i++) {
		subItem.push('&nbsp');
	}
	items.push(subItem);
	return items;
}

/**
 * 初始化table
 * @param items  字段
 * @param length 长度
 * @param type 类型
 * @returns {String}  
 */
apiPage.prototype.loadPaneTable = function(items, length, type) {
	var ret = '<table border="1" cellspacing="0" cellpadding="0" width="525">';
		ret += this.getDefaultTr(length, type);
	for (var i = 0; i < items.length; i++) {
		ret += this.loadPaneTr(items[i], type);
	}
	ret += '</table>';
	return ret;
}

//获取默认的表头信息
apiPage.prototype.getDefaultTr = function(length, type) {
	var ret = '<tr>';
	if(length == 2) {
		if(type == 1) {
			ret += '	<td width="340">'+ lang.open_table_file +'</td>';
			ret += ' 	<td width="197">'+ lang.open_table_caption +'</td>';
		}else {
			ret += '	<td width="140">'+ lang.open_table_code +'</td>';
			ret += ' 	<td width="397">'+ lang.open_table_caption +'</td>';
		}
	}else if(length == 3) {
		ret += '	<td width="140">'+ lang.open_table_paramName +'</td>';
		ret += ' 	<td width="97">'+ lang.open_table_paramType +'</td>';
		ret += ' 	<td width="300">'+ lang.open_table_desc +'</td>';
	}else if(length == 4) {
		ret += '	<td width="100">'+ lang.open_table_paramName +'</td>';
		ret += ' 	<td width="105">'+ lang.open_table_paramType +'</td>';
		ret += ' 	<td width="68">'+ lang.open_table_iseq +'</td>';
		ret += ' 	<td width="256">'+ lang.open_table_desc +'</td>';
	}else {
		ret += '	<td width="71">'+ lang.open_table_paramName +'</td>';
		ret += ' 	<td width="82">'+ lang.open_table_paramType +'</td>';
		ret += ' 	<td width="75">'+ lang.open_table_iseq +'</td>';
		ret += ' 	<td width="55">'+ lang.open_table_default +'</td>';
		ret += ' 	<td width="242">'+ lang.open_table_desc +'</td>';
	}
	ret += '</tr>';
	return ret;
}

//加载tr
apiPage.prototype.loadPaneTr = function(subItems, type) {
	var ret = '<tr>';
	if(subItems != null) {
		if(subItems.length == 2) {
			var widths = [140, 397];
			if(type == 1) {
				widths = [340, 197];
			}
			for (var i = 0; i < widths.length; i++) {
				ret += ' 	<td width="'+ widths[i] +'">'+ subItems[i] +'</td>';
			}
		}else if(subItems.length == 3) {
			var widths = [140, 97, 300];
			for (var i = 0; i < widths.length; i++) {
				ret += ' 	<td width="'+ widths[i] +'">'+ subItems[i] +'</td>';
			}
		}else if(subItems.length == 4) {
			var widths = [100, 105, 68, 256];
			for (var i = 0; i < widths.length; i++) {
				ret += ' 	<td width="'+ widths[i] +'">'+ subItems[i] +'</td>';
			}
		}else if(subItems.length == 5) {
			var widths = [71, 82, 75, 55, 242];
			for (var i = 0; i < widths.length; i++) {
				ret += ' 	<td width="'+ widths[i] +'">'+ subItems[i] +'</td>';
			}
		}
	}
	ret += '</tr>';
	return ret;
}

//获取初始化视频插件所需文件的html代码
apiPage.prototype.getInitVideoFileHtml = function() {
	var items = [
	         ['<a href="'+ this.rootPath +'/808gps/open/player/player.swf" target="_blank" download="player.swf">'+ this.rootPath +'/808gps/open/player/player.swf</a>', lang.open_init_flash],
	         ['<a href="'+ this.rootPath +'/808gps/open/player/swfobject.js" target="_blank" download="swfobject.js">'+ this.rootPath +'/808gps/open/player/swfobject.js</a>', lang.open_init_js],
	         ['<a href="'+ this.rootPath +'/808gps/open/player/cn.xml" target="_blank" download="cn.xml">'+ this.rootPath +'/808gps/open/player/cn.xml</a>', lang.open_init_cn],
	         ['<a href="'+ this.rootPath +'/808gps/open/player/en.xml" target="_blank" download="en.xml">'+ this.rootPath +'/808gps/open/player/en.xml</a>', lang.open_init_en]
	   ];
	return this.loadPaneTable(items, 2, 1);
}

//获取视频插件初始化调用方法字段
apiPage.prototype.getVideoInitFunctionHtml = function() {
	var html_ = '<p>'+ lang.open_one_char + lang.open_init_func +'&nbsp;&nbsp;embedSWF(playerPath, cmsv6flash, width, height, version, null, null, params, null)</p>';
	var items = [
	         ['playerPath', 'string', lang.yes, lang.nothing, lang.open_init_path +'<br/>'+ lang.open_init_path_desc],
	         ['cmsv6flash', 'string', lang.yes, lang.nothing, lang.open_init_div +'<br/>'+ lang.open_init_div_desc],
	         ['width', 'number', lang.yes, lang.nothing, lang.open_init_width],
	         ['height', 'number', lang.yes, lang.nothing, lang.open_init_height],
	         ['version', 'string', lang.yes, lang.nothing, lang.open_init_version],
	         ['params', 'object', lang.no, lang.nothing, lang.open_init_param +'<br/>'+ lang.open_init_param_desc],
	      ];
	html_ += '<p>' + this.loadPaneTable(items, 5) + '</p>';
	html_ += '<p>'+ lang.open_two_char + lang.open_init_setLang +'&nbsp;&nbsp;setLanguage(languagePath)</p>';
	items = [
	     ['languagePath', 'string', lang.no, lang.open_init_langDef, lang.open_init_langPath +'<br/>'+ lang.open_init_path_desc]  
	  ];
	html_ += '<p>' + this.loadPaneTable(items, 5) + '</p>';
	html_ += '<p>'+ lang.open_three_char + lang.open_init_setWindow +'&nbsp;&nbsp;setWindowNum(windowNum)</p>';
	items = [
	     ['windowNum', 'number', lang.yes, lang.nothing, lang.open_init_windowNum]  
	  ];
	html_ += '<p>' + this.loadPaneTable(items, 5) + '</p>';
	html_ += '<p>'+ lang.open_four_char + lang.open_init_setServer +'&nbsp;&nbsp;setServerInfo(ip, port)</p>';
	items = [
	     ['ip', 'string', lang.yes, lang.nothing, lang.open_init_serverIp],
	     ['port', 'number', lang.yes, lang.nothing, lang.open_init_serverPort]
	  ];
	html_ += this.loadPaneTable(items, 5);
	return html_;
}

//获取播放实时视频(网页集成)调用方法字段
apiPage.prototype.getVideoLiveHtmlFunctionHtml = function() {
	var html_ = '<p>'+ lang.open_page_url_desc +'&nbsp;&nbsp;</p>';
	var items = [
		         ['jsession', 'string', lang.no, lang.nothing, lang.open_jsession_callback +'<br/>'+ lang.open_page_url_account],
		         ['account', 'string', lang.no, lang.nothing, lang.open_login_account +'<br/>'+ lang.open_page_url_jsession +'<br/>'+ lang.open_account_null_desc],
		         ['password', 'string', lang.no, lang.nothing, lang.open_login_pwd],
		         ['devIdno', 'string', lang.no, lang.nothing, lang.open_device_idno +'<br/>'+ lang.open_page_url_vehiIdno],
		         ['vehiIdno', 'string', lang.no, lang.nothing, lang.open_vehicle_idno +'<br/>'+ lang.open_page_url_devIdno],
		         ['channel', 'number', lang.no, lang.nothing, lang.open_page_url_chn +'<br/>'+ lang.open_page_url_chn_desc],
		         ['close', 'number', lang.no, lang.nothing, lang.open_page_url_time],
		         ['lang', 'string', lang.no, 'zh', lang.open_page_url_lang +'<br/>'+ lang.open_page_url_lang_desc]
		      ];
	html_ += '<p>' + this.loadPaneTable(items, 5) + '</p>';
	return html_;
}

//获取播放实时视频(JavaScript)调用方法字段
apiPage.prototype.getVideoLiveJsFunctionHtml = function() {
	var html_ =  '<p>'+ lang.open_one_char + lang.open_video_setTitle +'&nbsp;&nbsp;setVideoInfo(index, title)</p>';
	items = [
	         ['index', 'number', lang.yes, lang.nothing, lang.open_video_index + lang.open_query_begChn],
	         ['title', 'string', lang.no, lang.nothing, lang.open_video_title]
	      ];
	html_ += '<p>' + this.loadPaneTable(items, 5) + '</p>';
	html_ += '<p>'+ lang.open_two_char + lang.open_video_play +'&nbsp;&nbsp;startVideo(index, jsession, devIdno, channel, stream, true)</p>';
	items = [
	     ['index', 'number', lang.yes, lang.nothing, lang.open_video_index + lang.open_query_begChn],
	     ['jsession', 'string', lang.yes, lang.nothing, lang.open_jsession_callback],
	     ['devIdno', 'string', lang.yes, lang.nothing, lang.open_device_idno],
	     ['channel', 'number', lang.yes, lang.nothing, lang.open_device_chn + lang.open_query_begChn],
	     ['stream', 'number', lang.yes, lang.nothing, lang.open_video_stram +'<br/>'+ lang.open_video_stram_desc]
	  ];
	html_ += '<p>' + this.loadPaneTable(items, 5) + '</p>';
	html_ += '<p>'+ lang.open_three_char + lang.open_video_stop +'&nbsp;&nbsp;stopVideo(index)</p>';
	items = [
	      ['index', 'number', lang.yes, lang.nothing, lang.open_video_index + lang.open_query_begChn] 
	  ];
	html_ += '<p>' + this.loadPaneTable(items, 5) + '</p>';
	html_ += '<p>'+ lang.open_four_char + lang.open_video_reset +'&nbsp;&nbsp;reSetVideo(index)</p>';
	items = [
	      ['index', 'number', lang.yes, lang.nothing, lang.open_video_index + lang.open_query_begChn] 
	  ];
	html_ += this.loadPaneTable(items, 5);
	return html_;
}

//获取监听调用方法字段
apiPage.prototype.getVideoMonitorFunctionHtml = function() {
//	var html_ = '<p>（1）设置监听参数&nbsp;&nbsp;setListenParam(1)</p>';
	var html_ = '<p>'+ lang.open_one_char + lang.open_monitor_strat +'&nbsp;&nbsp;startListen(jsession, devIdno, channel, ip, port)</p>';
	var items = [
	     ['jsession', 'string', lang.yes, lang.nothing, lang.open_jsession_callback],
	     ['devIdno', 'string', lang.yes, lang.nothing, lang.open_device_idno],
	     ['channel', 'number', lang.yes, lang.nothing, lang.open_device_chn + lang.open_query_begChn],
	     ['ip', 'string', lang.yes, lang.nothing, lang.open_init_serverIp],
	     ['port', 'number', lang.yes, lang.nothing, lang.open_init_serverPort]
	  ];
	html_ += '<p>' + this.loadPaneTable(items, 5) + '</p>';
	html_ += '<p>'+ lang.open_two_char + lang.open_monitor_stop +'&nbsp;&nbsp;stopListen()</p>';
	return html_;
}

//获取对讲调用方法字段
apiPage.prototype.getVideoTalkbackFunctionHtml = function() {
//	var html_ = '<p>（1）设置对讲参数&nbsp;&nbsp;setTalkParam(1)</p>';
	var html_ = '<p>'+ lang.open_one_char + lang.open_talkback_strat +'&nbsp;&nbsp;startTalkback(jsession, devIdno, 0, ip, port)</p>';
	var items = [
	     ['jsession', 'string', lang.yes, lang.nothing, lang.open_jsession_callback],
	     ['devIdno', 'string', lang.yes, lang.nothing, lang.open_device_idno],
	     ['ip', 'string', lang.yes, lang.nothing, lang.open_init_serverIp],
	     ['port', 'number', lang.yes, lang.nothing, lang.open_init_serverPort]
	  ];
	html_ += '<p>' + this.loadPaneTable(items, 5) + '</p>';
	html_ += '<p>'+ lang.open_two_char + lang.open_talkback_stop +'&nbsp;&nbsp;stopTalkback()</p>';
	return html_;
}

//获取远程回放调用方法字段
apiPage.prototype.getVideoPlaybackFunctionHtml = function() {
	var html_ = '<p>'+ lang.open_one_char + lang.open_playback_server +'</p>';
	var url = 'http://'+this.serverIp+':'+ this.loginServerPort + '/3/1?MediaType=2&DownType=5&jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&Location=1&FileSvrID=0&DevIDNO=500000';
	html_ += '&nbsp;&nbsp;a.'+ lang.open_req_exp_tit +'<a href="'+ url +'" target="_blank">'+ url +'</a>';
	html_ += '<br>&nbsp;&nbsp;b.'+ lang.open_playback_send;
	var items = [
	     ['jsession', 'string', lang.yes, lang.nothing, lang.open_jsession_callback],
	     ['Location', 'number', lang.yes, lang.nothing, lang.open_playback_location +'<br/>'+ lang.open_query_location_desc],
	     ['FileSvrID', 'number', lang.yes, lang.nothing, lang.open_server_id +'<br/>'+ lang.open_server_id_desc],
	     ['DevIDNO', 'string', lang.yes, lang.nothing, lang.open_device_idno +'<br/>'+ lang.open_query_video_idno]
	  ];
	html_ += '&nbsp;&nbsp;' + this.loadPaneTable(items, 5);
	html_ += '&nbsp;&nbsp;c.'+ lang.open_playback_callback;
	items = this.getServerBackItems(true);
	html_ += '&nbsp;&nbsp;' + this.loadPaneTable(items, 3);
	html_ += '<p>'+ lang.open_two_char + lang.open_playback_start +'&nbsp;&nbsp;startVod(index, url)</p>';
	items = [
	     ['index', 'number', lang.yes, lang.nothing, lang.open_video_index + lang.open_query_begChn],
	     ['url', 'string', lang.yes, lang.nothing, lang.open_playback_url +'<br/>'+ lang.open_playback_url_desc_1 +'<br/>'
	      + lang.open_playback_url_desc_2 + '<br/>'
	      + lang.open_playback_url_desc_3 + '<br/>'
	      + lang.open_playback_url_desc_4 + '<br/>'
	      + lang.open_playback_url_desc_5 + '<br/>'
	      + lang.open_playback_url_desc_6 + '<br/>'
	      + lang.open_playback_url_desc_7 + '<br/>'
	      + lang.open_playback_url_desc_8]
	  ];
	html_ += '<p>' + this.loadPaneTable(items, 5) + '</p>';
	html_ += '<p>'+ lang.open_three_char + lang.open_playback_stop +'&nbsp;&nbsp;stopVideo(index);</p>';
	return html_;
}

//获取插件初始化参考js代码html
apiPage.prototype.getVideoInitExampleJsHtml = function(id) {
	var html_ = '<div>var isInitFinished = false;//'+ lang.open_init_video_finish +'</div>';
	html_ += '<div>//'+ lang.open_initVideo +'</div>';
	html_ += '<div>function initPlayerExample() {</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//'+ lang.open_init_param +'</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var params = {</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allowFullscreen: "true",</div>';  
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allowScriptAccess: "always",</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bgcolor: "#FFFFFF",</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;wmode: "transparent"</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;};</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//'+ lang.open_init_video_flash +'</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.embedSWF("player.swf", "cmsv6flash", 400, 400, "11.0.0", null, null, params, null);</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;initFlash();</div>';
	html_ += '<div>}</div>';
	html_ += '<div>//'+ lang.open_init_video_finish +'</div>';
	html_ += '<div>function initFlash() {</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (swfobject.getObjectById("cmsv6flash") == null ||</div>'
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;typeof swfobject.getObjectById("cmsv6flash").setWindowNum == "undefined" ) {</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;setTimeout(initFlash, 50);</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} else {</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//'+ lang.open_init_setLang +'</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.getObjectById("cmsv6flash").setLanguage("cn.xml");</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//'+ lang.open_init_setWindow_1 +'</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.getObjectById("cmsv6flash").setWindowNum(36);</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//'+ lang.open_init_setWindow_2 +'</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.getObjectById("cmsv6flash").setWindowNum(4);</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//'+ lang.open_init_setServer +'</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.getObjectById("cmsv6flash").setServerInfo("'+ this.serverIp +'", "'+ this.loginServerPort +'");</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;isInitFinished = true;</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;}</div>';
	html_ += '<div>}</div>';
	return html_;
}

//获取播放实时视频参考js代码html
apiPage.prototype.getVideoLiveExampleJsHtml = function(id) {
	var html_ = '<div>//'+ lang.open_init_video_call +'</div>';
	html_ += '<div>//'+ lang.open_video_play +'</div>';
	html_ += '<div>function playVideo() {</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//'+ lang.open_video_stop +'</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.getObjectById("cmsv6flash").stopVideo(0);</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//'+ lang.open_video_setTitle +'</div>';  
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.getObjectById("cmsv6flash").setVideoInfo(0, "vehicle1-CH1");</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//'+ lang.open_video_play +'</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.getObjectById("cmsv6flash").startVideo(0, "sdsd-dsad-sd-sd-ad", "123124", 0, 1, true);</div>';
	html_ += '<div>}</div>';
	html_ += '<div>//'+ lang.open_video_stop +'</div>';
	html_ += '<div>function stopVideo() {</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.getObjectById("cmsv6flash").stopVideo(0);</div>';
	html_ += '<div>}</div>';
	html_ += '<div>//'+ lang.open_video_reset +'</div>';
	html_ += '<div>function reSetVideo() {</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.getObjectById("cmsv6flash").reSetVideo(0);</div>';
	html_ += '<div>}</div>';
	return html_;
}

//获取监听参考js代码html
apiPage.prototype.getVideoMonitorExampleJsHtml = function(id) {
	var html_ = '<div>//'+ lang.open_init_video_call +'</div>';
	html_ += '<div>//'+ lang.open_monitor_strat +'</div>';
	html_ += '<div>function startMonitor() {</div>';
//	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//设置监听参数</div>';
//	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.getObjectById("cmsv6flash").setListenParam(1);</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//'+ lang.open_monitor_strat +'</div>';  
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.getObjectById("cmsv6flash").startListen("2131-23-32", "23213", 0, "'+ this.serverIp +'", "'+ this.loginServerPort +'");</div>';
	html_ += '<div>}</div>';
	html_ += '<div>//'+ lang.open_monitor_stop +'</div>';
	html_ += '<div>function stopMonitor() {</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.getObjectById("cmsv6flash").stopListen();</div>';
	html_ += '<div>}</div>';
	return html_;
}

//获取对讲参考js代码html
apiPage.prototype.getVideoTalkbackExampleJsHtml = function(id) {
	var html_ = '<div>//'+ lang.open_init_video_call +'</div>';
	html_ += '<div>//'+ lang.open_talkback_strat +'</div>';
	html_ += '<div>function startTalkback() {</div>';
//	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//设置对讲参数</div>';
//	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.getObjectById("cmsv6flash").setTalkParam(1);</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//'+ lang.open_talkback_strat +'</div>';  
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var ret = swfobject.getObjectById("cmsv6flash").startTalkback("2131-23-32", "23213", 0, "'+ this.serverIp +'", "'+ this.loginServerPort +'");</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//'+ lang.open_talkback_call +'</div>'; 
	html_ += '<div>}</div>';
	html_ += '<div>//'+ lang.open_talkback_stop +'</div>';
	html_ += '<div>function stopTalkback() {</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.getObjectById("cmsv6flash").stopTalkback();</div>';
	html_ += '<div>}</div>';
	return html_;
}

//获取远程回放参考js代码html
apiPage.prototype.getVideoPlaybackExampleJsHtml = function(id) {
	var html_ = '<div>//'+ lang.open_init_video_call +'</div>';
	html_ += '<div>//'+ lang.open_playback_start +'</div>';
	html_ += '<div>function startPlayback() {</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//'+ lang.open_playback_stop +'</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.getObjectById("cmsv6flash").stopVideo(0);</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//'+ lang.open_playback_start +'</div>';  
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var ret = swfobject.getObjectById("cmsv6flash").startVod(0, "http://127.0.0.1:6604/3/5?DownType=5&DevIDNO=10009&FILELOC=1&FILESVR=0&FILECHN=0&FILEBEG=1&FILEEND=100&PLAYIFRM=0&PLAYFILE=/mnt/hgfs/linux/libdvrnet/jni/demo/bin/record/H20121123-112931P3A1P0.avi&PLAYBEG=0&PLAYEND=0&PLAYCHN=0");</div>';
	html_ += '<div>}</div>';
	html_ += '<div>//'+ lang.open_playback_stop +'</div>';
	html_ += '<div>function stopPlayback() {</div>';
	html_ += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swfobject.getObjectById("cmsv6flash").stopVideo(0);</div>';
	html_ += '<div>}</div>';
	return html_;
}

//获取菜单名称
apiPage.prototype.getItemTitle = function(id) {
	switch (Number(id)) {
	case 1:
		return lang.open_interfaceDesc;
	case 2:
		return lang.open_userLoginOrOut;	
	case 21:
		return lang.open_userLogin;
	case 22:
		return lang.open_userLogout;
	case 3:
		return lang.open_vehicleInfo;
	case 31:
		return lang.open_getDevIdnoByVehiIdno;
	case 32:
		return lang.open_getDevOnlineStatus;
	case 33:
		return lang.open_getDeviceStatus;
	case 34:
		return lang.open_getDeviceTrack;
	case 35:
		return lang.open_getDeviceAlarmInfo;
	case 36:
		return lang.open_getUserVehicleInfo;
	case 4:
		return lang.open_videoOperate;
	case 41:
		return lang.open_initVideo;
	case 42:
		return lang.open_realtimeVideo_html;
	case 43:
		return lang.open_realtimeVideo_js;
	case 44:
		return lang.open_monitor;
	case 45:
		return lang.open_talkback;
	case 46:
		return lang.open_queryRecording;
	case 47:
		return lang.open_downloadRecording;
	case 48:
		return lang.open_remotePlayback;
	case 49:
		return lang.open_capture;
	case 5:
		return lang.open_vehicleControlOperate;
	case 51:
		return lang.open_getUserServer;
	case 52:
		return lang.open_vehicleControl;
	case 53:
	    return lang.open_tts;

	case 6:
		return lang.open_mobile_android;
	case 7:
	    return lang.open_mobile_ios;
	}
}

//获取接口url
apiPage.prototype.getItemUrl = function(id, param) {
	var url = '';
	switch (Number(id)) {
	case 1: break;
	case 21:
		url = this.rootPath + '/StandardApiAction_login.action?';
		if(param) {
			url += 'account=admin&amp;password=admin';
			url = '<a href="'+ url +'" target="_blank">'+ url +'</a>';
		}
		break;
	case 22:
		url = this.rootPath + '/StandardApiAction_logout.action?';
		if(param) {
			url += 'jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222';
			url = '<a href="'+ url +'" target="_blank">'+ url +'</a>';
		}
		break;
	case 31:
		url = this.rootPath + '/StandardApiAction_getDeviceByVehicle.action?';
		if(param) {
			url += 'jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&amp;vehiIdno=50000000000';
			url = '<a href="'+ url +'" target="_blank">'+ url +'</a>';
		}
		break;
	case 32:
		url = this.rootPath + '/StandardApiAction_getDeviceOlStatus.action?';
		if(param) {
			url += 'jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&amp;devIdno=500000';
			url = '<a href="'+ url +'" target="_blank">'+ url +'</a>';
		}
		break;
	case 33:
		url = this.rootPath + '/StandardApiAction_getDeviceStatus.action?';
		if(param) {
			url += 'jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&amp;devIdno=500000&amp;toMap=2';
			url = '<a href="'+ url +'" target="_blank">'+ url +'</a>';
		}
		break;
	case 34:
		url = this.rootPath + '/StandardApiAction_queryTrackDetail.action?';
		if(param) {
			url += 'jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&amp;devIdno=500000&amp;begintime=2015-12-25 00:00:00&amp;endtime=2015-12-30 23:59:59';
			url += '&amp;currentPage=1&amp;pageRecords=50&amp;toMap=2';
			url = '<a href="'+ url +'" target="_blank">'+ url +'</a>';
		}
		break;
	case 35:
		url = this.rootPath + '/StandardApiAction_queryAlarmDetail.action?';
		if(param) {
			url += 'jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&amp;devIdno=500000&amp;begintime=2015-12-25 00:00:00&amp;endtime=2015-12-30 23:59:59';
			url += '&amp;armType=2,9,11&amp;handle=1&amp;currentPage=1&amp;pageRecords=50&amp;toMap=2';
			url = '<a href="'+ url +'" target="_blank">'+ url +'</a>';
		}
		break;
	case 36:
		url = this.rootPath + '/StandardApiAction_queryUserVehicle.action?';
		if(param) {
			url += 'jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222';
			url = '<a href="'+ url +'" target="_blank">'+ url +'</a>';
		}
		break;
	case 46:
		url += '<p>'+ lang.open_one_char + lang.open_query_ref_server +'</P>';
		var url1 = 'http://'+this.serverIp+':'+ this.loginServerPort + '/3/1?';
		if(param) {
			url1 += 'MediaType=2&amp;DownType=2&amp;jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&amp;DevIDNO=500000&amp;Location=1';
			url1 = '<a href="'+ url1 +'" target="_blank">'+ url1 +'</a>';
		}
		url += url1
		url += '<p>'+ lang.open_two_char + lang.open_queryRecording +'</P>';
		var url2 = 'http://'+this.serverIp+':6604/3/5?';
		if(param) {
			var url_ = url2 + 'DownType=2&amp;jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&amp;<br/>DevIDNO=500000&amp;LOC=1&CHN=0&amp;YEAR=2014&amp;MON=12&amp;DAY=10&amp;<br/>RECTYPE=1&amp;FILEATTR=2&amp;BEG=0&amp;END=86399';
			url2 += 'DownType=2&amp;jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&amp;DevIDNO=500000&amp;LOC=1&CHN=0&amp;YEAR=2014&amp;MON=12&amp;DAY=10&amp;RECTYPE=1&amp;FILEATTR=2&amp;BEG=0&amp;END=86399';
			url2 = '<a href="'+ url2 +'" target="_blank">'+ url_ +'</a>';
		}
		url += url2;
		break;
	case 47:
		url += '<p>'+ lang.open_one_char + lang.open_download_seg +'</P>';
		var url1 = this.rootPath + '/StandardApiAction_addDownloadTask.action?';
		if(param) {
			url1 += 'jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&amp;did=500000&amp;fbtm=2015-12-25 00:00:00&amp;fetm=2015-12-30 23:59:59';
			url1 += '&amp;sbtm=2015-12-25 00:00:00&amp;setm=2015-12-30 23:59:59&amp;lab=downloadExample&amp;fph=/mnt/hgfs/record/H20121123-112931P3A1P0.avi';
			url1 += '&amp;vtp=1&amp;len=5000&amp;chn=1&amp;dtp=1';
			url1 = '<a href="'+ url1 +'" target="_blank">'+ url1 +'</a>';
		}
		url += url1;
		url += '<p>'+ lang.open_two_char + lang.open_download_direct +'</P>';
		url += 'a.'+ lang.open_query_ref_server +'<br/>';
		var url2 = 'http://'+this.serverIp+':'+ this.loginServerPort + '/3/1?';
		if(param) {
			url2 += 'MediaType=2&amp;DownType=3&amp;jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&amp;DevIDNO=500000&amp;Location=1&amp;FileSvrID=0';
			url2 = '<a href="'+ url2 +'" target="_blank">'+ url2 +'</a>';
		}
		url += url2 + '<br/>';
		url += 'b.'+ lang.open_downloadRecording +'<br/>';
		var url3 = 'http://'+this.serverIp+':6604/3/5?';
		if(param) {
			var url_ = url3 + 'DownType=3&amp;jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&amp;<br/>'
				+'DevIDNO=10008&amp;FLENGTH=325755837&amp;FOFFSET=0&amp;MTYPE=1&amp;<br/>'
				+'FPATH=F:\\Record\\H20100628-083724P2N4P0.264&amp;<br/>'
				+'SAVENAME=H20100628-083724P2N4P0.264';
			url3 += 'DownType=3&amp;jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&amp;'
				+'DevIDNO=10008&amp;FLENGTH=325755837&amp;FOFFSET=0&amp;MTYPE=1&amp;'
				+'FPATH=F:\\Record\\H20100628-083724P2N4P0.264&amp;'
				+'SAVENAME=H20100628-083724P2N4P0.264';
			url3 = '<a href="'+ url3 +'" target="_blank">'+ url_ +'</a>';
		}
		url += url3;
		break;
	case 51:
		url = this.rootPath + '/StandardApiAction_getUserServer.action?';
		if(param) {
			url += 'jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222';
			url = '<a href="'+ url +'" target="_blank">'+ url +'</a>';
		}
		break;
	case 52:
		url += '<p>'+ lang.open_one_char + lang.open_gps_interval +'</P>';
		var url1 = 'http://'+this.serverIp+':6603/2/15?';
		if(param) {
			url1 += 'jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&amp;DevIDNO=500000&amp;Start=1&amp;Type=1&amp;Distance=0&amp;Time=5';
			url1 = '<a href="'+ url1 +'" target="_blank">'+ url1 +'</a>';
		}
		url += url1;
		url += '<p>'+ lang.open_two_char + lang.open_other_control +'</P>';
		var url2 = 'http://'+this.serverIp+':6603/2/7?';
		if(param) {
			var url_ = url2 + 'jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&amp;DevIDNO=500000&amp;<br/>CtrlType=1&amp;Usr=admin&amp;Pwd='+hex_md5('admin');
			url2 += 'jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&amp;DevIDNO=500000&amp;CtrlType=1&amp;Usr=admin&amp;Pwd='+hex_md5('admin');
			url2 = '<a href="'+ url2 +'" target="_blank">'+ url_ +'</a>';
		}
		url += url2;
		break;
	case 53:
		url = 'http://'+this.serverIp+':6603/2/5?';
		if(param) {
			url += 'jsession=cf6b70a3-c82b-4392-8ab6-bbddce336222&amp;DevIDNO=500000&amp;Text=rrrrrvvv';
			url = '<a href="'+ url +'" target="_blank">'+ url +'</a>';
		}
		break;
	}
	
	return url;
}

//获取服务器信息返回字段
apiPage.prototype.getServerBackItems = function(cmsserver) {
	var items = [];
	if(cmsserver) {
		items.push(['result', 'number', lang.open_video_cbId +'<br/>'+ lang.open_video_cbId_desc]);
	}
	items.push(['deviceIp', 'string', lang.open_server_deviceIp]);
	items.push(['deviceIp2', 'string', lang.open_server_deviceIp]);
	items.push(['devicePort', 'number', lang.open_server_devicePort]);
	items.push(['clientIp', 'string', lang.open_server_clientIp]);
	items.push(['clientIp2', 'string', lang.open_server_clientIp]);
	items.push(['clientPort', 'number', lang.open_server_clientPort]);
	items.push(['clientOtherPort', 'string', lang.open_server_clientOtherPort]);
	items.push(['lanip', 'string', lang.open_server_lanIp]);
	items.push(['svrid', 'number', lang.open_server_id]);
	return items;
}

//获取服务器信息返回事例
//type 1 用户  2其他
apiPage.prototype.getServerBackExample = function(type) {
	var ret = ',<br>&nbsp;&nbsp;"server":{';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"clientIp": "192.168.1.15"';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"clientIp2": "192.168.1.15"';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"clientOtherPort": "6617;6618;6619;6620;6621;6622"';
	if(type && type == 1) {
		ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"clientPort": 6603';
	}else {
		ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"clientPort": 6604';
	}
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"deviceIp": "192.168.1.15"';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"deviceIp2": "192.168.1.15"';
	if(type && type == 1) {
		ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"devicePort": 6601';
	}else {
		ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"devicePort": 6602';
	}
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"lanip": "192.168.1.15"';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"svrid": 3';
	ret += '<br>&nbsp;&nbsp;&nbsp;&nbsp;}';
	return ret;
}

//获取车辆设备在地图的位置信息
apiPage.prototype.getVehicleOnMapExampleHtml = function() {
	var mapUrl = this.rootPath +'/808gps/open/map/vehicleMap.html?account=admin&password=admin&devIdno=500000';
	var html_ = '<P>'+ lang.open_one_char +'URL</p>';
	html_ += '<P><a href="'+ mapUrl +'" target="_blank">'+ mapUrl +'</a></p>';
	html_ += '<P>'+ lang.open_two_char + lang.open_map_param_desc +'</p>';
	var items = [
		         ['jsession', 'string', lang.no, lang.nothing, lang.open_jsession_callback +'<br/>'+ lang.open_page_url_account],
		         ['account', 'string', lang.no, lang.nothing, lang.open_login_account +'<br/>'+ lang.open_page_url_jsession +'<br/>'+ lang.open_account_null_desc],
		         ['password', 'string', lang.no, lang.nothing, lang.open_login_pwd],
		         ['devIdno', 'string', lang.no, lang.nothing, lang.open_device_idno +'<br/>'+ lang.open_page_url_vehiIdno],
		         ['vehiIdno', 'string', lang.no, lang.nothing, lang.open_vehicle_idno +'<br/>'+ lang.open_page_url_devIdno],
		         ['lang', 'string', lang.no, 'zh', lang.open_page_url_lang +'<br/>'+ lang.open_page_url_lang_desc]
		      ];
	html_ += '<p>' + this.loadPaneTable(items, 5) + '</p>';
	return html_;
}