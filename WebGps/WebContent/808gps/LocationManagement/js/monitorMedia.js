/**
 * 媒体文件处理类
 */
function monitorVehicleMedia(){
	this.mapImages = new Hashtable(); //抓拍的图片信息
	this.loadCaptureList = new Hashtable();  //正在抓拍的设备通道
	this.loadCaptureArray = new Array(); //正在抓拍的设备通道
	this.captureErrList = new Hashtable(); //抓拍失败的设备通道
	this.imageWindow = null;   //图片窗口对象
	this.autoPopImage = 1;   //抓拍图片成功后是否弹出窗口，1 是 0 否
	this.clickTableRow = false;  //已点击表格行
	this.oldSelectId = null;   //上一次点击的图片
	this.storageServer = null; //抓拍服务器(存储服务器)
	this.isCapturing = false; //正在抓拍
	this.mediaList = new Hashtable(); //下载完成的录像（或者图片）列表
	this.mediaFileTableObject = null; //媒体文件表格对象
	this.isClickDownImage = false;  //是否点击下载图片
	this.addMediaToEventList = new Array(); //存放待加入媒体列表的媒体数据
	this.serverEventTableObject = null; //系统事件表格对象
	this.mapServerEvent = new Hashtable(); //正在发送的数据列表
	this.addServerEventList = new Array(); //添加到系统事件列表的数据id集合
}

//赋值存储服务器
monitorVehicleMedia.prototype.setStorageServer = function(storageServer) {
	this.storageServer = storageServer;
}

monitorVehicleMedia.prototype.initialize = function(monitorTree, privileges){
	//初始化媒体文件列表
//	if(typeof parent.myUserRole != 'undefined' && parent.myUserRole != null
//			&& parent.myUserRole.isPermit(625)) {
		$('#gps-mediaFiles').show();
		this.initMediaFilesTable();
//	}
	//初始化系统事件列表
	this.initServerEventTable();
}

//初始化抓拍图片列表列表
monitorVehicleMedia.prototype.initMediaFilesTable = function(){
	//车辆，通道，时间，状态（正在抓拍，抓拍成功，抓拍失败）
//	var buttons = [
//   	    {separator: false, hidename: "", name: parent.lang.del, bclass: "delete",
//   	    	bimage: "", tooltip: parent.lang.del, id: "delAlarm",
//   	    	onpress: function() {$("#mediaFilesTable").flexClear();}
//   	    }
//   	];
	this.mediaFileTableObject = $("#mediaFilesTable").flexigrid({
		url: "",	//StandardTrackAction_query.action
		dataType: 'json',
		colModel : [
		    {display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.plate_number, name : 'vehiIdno', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.fileType, name : 'fileType', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.alarm_channel, name : 'channel', width : 60, sortable : false, align: 'center'},
			{display: parent.lang.acceptTime, name : 'time', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.fileTime, name : 'fileTime', width : 200, sortable : false, align: 'center'},
			{display: parent.lang.status, name : 'status', width : 60, sortable : false, align: 'center'},
			{display: parent.lang.rule_alarmType, name : 'recType', width : 80, sortable : false, align: 'center', hide: false},
			{display: parent.lang.alarm_record_size+"(MB)", name : 'fileSize', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.fileLocation, name : 'location', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.fileSrc, name : 'fileSrc', width : 200, sortable : false, align: 'center'}
			],
		usepager: false,
		autoload: false,
		useRp: false,
		singleSelect: true,
//		buttons: buttons,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: true,
		width: 'auto',
		height: 'auto',
		resizable: false
	});
	//本类对象
	var myClass = this;
	this.mediaFileTableObject.flexSetFillCellFun(function(p, row, idx, index) {
		return myClass.fillMediaFilesTable(p, row, idx, index);
	});
	this.mediaFileTableObject.flexSelectRowPropFun(function(obj) {
		myClass.selectFileRowProp(obj);
	});
};

monitorVehicleMedia.prototype.getColumnTitle = function(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

//填充媒体文件列表
monitorVehicleMedia.prototype.fillMediaFilesTable = function(p, row, idx, index){
	var name = p.colModel[idx].name;
	var ret = "";
	if(name == 'vehiIdno') {
		ret = row.vehiIdno;
	}else if(name == 'channel') {
		ret = row.channel;
	}else if(name == 'time') {
		ret = row.time;
	}else if(name == 'status') {
		if(row.status == 1) {
			ret = parent.lang.capture_capturing;
		}else {
			ret = row.status;
		}
	}else if(name == 'operator') {
		if(row.status == 1) {
			ret = '<a class="not-downLoad" title="'+parent.lang.capture_capturing+'"></a>';
		}else {
			ret = '<a class="downLoad" onclick="downloadMediaFile('+row.id+');" title="'+parent.lang.download+'"></a>';
		}
		if(row.isMedia) {
			ret += '<a class="playback" onclick="videoFileReplay('+row.id+');" title="'+parent.lang.video_playback+'"></a>';
		}else {
//			pos = '<a class="gray" title="'+tip+'">'+ parent.lang.download +'</a>';
		}
		return ret;
	}else if(name == 'fileSrc') {
		if(row.file) {
			ret = row.file;
		}
	}else if(name == 'fileTime') {
		if(row.fileTime) {
			ret = row.fileTime;
		}
	}else if(name == 'fileType') {
		if(row.srcType != null) {
			if(row.srcType == 1) {
				ret =  parent.lang.rule_picture;//图片
			}else {
				ret =  parent.lang.rule_video; //录像
			}
		}
	}else if(name == 'recType') {
		if(row.recType != null) {
			if(row.recType == 1) {
				ret = parent.lang.monitor_vehiStatusAlarm;//报警
			}else {
				ret = parent.lang.file_normal;//常规
			}
		}
	}else if(name == 'fileSize') {
		if(row.len != null) {
			ret = (Number(row.len)/1024/1024).toFixed(2) + 'MB';
		}
	}else if(name == 'location') {
		if(row.loc == 1) {
			ret = parent.lang.terminalDevice;
		}else if(row.loc == 2) {
			ret = parent.lang.server_storage;
		}else if(row.loc == 4) {
			ret = parent.lang.server_down;
		}
	}  
	return this.getColumnTitle(ret);
}

//选中媒体文件列表
monitorVehicleMedia.prototype.selectFileRowProp = function(obj) {
	var index = $.trim($(obj).attr('data-id'));
	if(!this.clickTableRow) {
		this.popImageIfrme(index);
	}
	this.oldSelectId = index;
	this.clickTableRow = false;
	this.isClickDownImage = false;
}

//点击表格行
monitorVehicleMedia.prototype.selectTableRow = function(rowid) {
	this.clickTableRow = true;
	$('#row'+rowid).click();
}

//弹出图片
monitorVehicleMedia.prototype.popImageIfrme = function(index) {
	var image = this.mapImages.get(Number(index));
	if(image != null && image.src != null && image.src != '') {
		if(this.imageWindow == null) {
			if(!this.isClickDownImage) {
				var myClass = this;
				this.imageWindow = $.dialog({id:'captureImage', title: parent.lang.capture_image, content: 'url:LocationManagement/captureImage.html?index='+index,
					width: '600px', height: '350px', min:true, max:false, lock:false,fixed:false
						, resize:false, close: function(){ 
							myClass.imageWindow = null;
							if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
								popTipsObject.remove('captureImage');
							}
						} });
			}
		}else {
			if(index != this.oldSelectId) {
				if(this.imageWindow.content && (typeof this.imageWindow.content.initImage == 'function')) {
					this.imageWindow.content.initImage(index);
				}
		//		$(this.imageWindow.iframe).attr('src', 'LocationManagement/captureImage.html?index='+index);
			}
			this.imageWindow.show();
		}
		if(typeof popTipsObject != 'undefined' && popTipsObject != null && this.imageWindow != null) {
			popTipsObject.put('captureImage', this.imageWindow);
		}
		if(typeof hidePopTips == 'function'){
			hidePopTips('captureImage');
		}
	}
}

//抓拍图片延时等待
monitorVehicleMedia.prototype.imageCaptureDelay = function(image){
	var image_ = this.mapImages.get(image.id);
	if(image_.status == 1) {
		var myClass = this;
		setTimeout(function() {
			myClass.imageCaptureDelay(image_);
		},1000);
	}else {
		this.imageCapture();
	}
}


//抓拍图片
monitorVehicleMedia.prototype.imageCapture = function(){
	if(this.loadCaptureArray.length > 0) {
		var image = this.loadCaptureArray[0];
		var image_ = this.mapImages.get(image.id);
		var obj = this.mediaFileTableObject.find(this.mediaFileTableObject.flexGetRowid(image.id));
		
		//如果此前抓拍失败，则直接抓拍失败
		if(this.captureErrList.get(image.vehiIdno+'*'+image.channelIndex) != null) {
			var time = dateFormat2TimeString(new Date());
			obj.find('.time div').html(this.getColumnTitle(time));
			obj.find('.status div').html(this.getColumnTitle(parent.lang.capture_fail));
			image_.time = time;
			image_.status = 2;
	    	this.loadCaptureList.remove(image.vehiIdno+'*'+image.channelIndex);
	    	if(this.loadCaptureArray[0].id == image.id) {
	    		this.loadCaptureArray.splice(0,1);
	    	}
		}else {
			var action = 'http://'+ this.storageServer.ip + ':' + this.storageServer.port +'/3/5/callback=getData';
			action += '?Type=1&DevIDNO='+ image.devIdno +'&Chn='+ image.channelIndex;
			var myClass = this;
			$.ajax({  
				type : "post",  
		        url : action,
		        timeout: 120000,
		        data : null, 
		        dataType: "jsonp",
		        success : getData = function(json){
		        	var time = dateFormat2TimeString(new Date());
		    		if(json.result == 0){
		    			obj.find('.operator div').html('<a class="downLoad" onclick="downloadMediaFile('+image_.id+');" title="'+parent.lang.download+'"></a>');
		    			obj.find('.time div').html(myClass.getColumnTitle(time));
		    			obj.find('.status div').html(myClass.getColumnTitle(parent.lang.capture_success));
		    			obj.find('.fileSrc div').html(myClass.getColumnTitle(json.FPATH));
		    			obj.find('.fileTime div').html(myClass.getColumnTitle(time));
		    			obj.find('.location div').html(myClass.getColumnTitle(parent.lang.server_storage));
		    			obj.find('.fileSize div').html(myClass.getColumnTitle((Number(json.FLENGTH)/1024/1024).toFixed(2) + 'MB'));
		    			
		    			image_.time = time;
		    			image_.src = json.FPATH;
		    			image_.offset = json.FOFFSET;
		    			image_.length = json.FLENGTH;
		    			image_.status = 0; 
		    			
		    			if(myClass.autoPopImage != null && myClass.autoPopImage == 1) {
		    				myClass.popImageIfrme(image.id);
		    				this.oldSelectId = image.id;
		    			}
		    		}else {
		    			obj.find('.operator div').html('<a class="gray" title="'+parent.lang.capture_fail+'">'+parent.lang.download+'</a>');
		    			obj.find('.time div').html(myClass.getColumnTitle(time));
		    			obj.find('.status div').html(myClass.getColumnTitle(parent.lang.capture_fail));
		    			image_.time = time;
		    			image_.status = 2;
		    		}
		    		myClass.loadCaptureList.remove(image.vehiIdno+'*'+image.channelIndex);
		    		if(myClass.loadCaptureArray.length > 0 && myClass.loadCaptureArray[0].id == image.id) {
		    			myClass.loadCaptureArray.splice(0,1);
		        	}
		        },  
		        error:function(XHR, textStatus, errorThrown){
		        	var time = dateFormat2TimeString(new Date());
		        	if(errorThrown == 'timeout') {
		        		obj.find('.operator div').html('<a class="gray" title="'+parent.lang.capture_fail+'">'+parent.lang.download+'</a>');
		        		obj.find('.time div').html(myClass.getColumnTitle(time));
		    			obj.find('.status div').html(myClass.getColumnTitle(parent.lang.capture_fail));
		    			image_.time = time;
		    			image_.status = 2;
		    			//加入抓拍失败列表
		    			myClass.captureErrList.put(image.vehiIdno+'*'+image.channelIndex, 1);
		        	}
		        	myClass.loadCaptureList.remove(image.vehiIdno+'*'+image.channelIndex);
		        	if(myClass.loadCaptureArray.length > 0 && myClass.loadCaptureArray[0].id == image.id) {
		        		myClass.loadCaptureArray.splice(0,1);
		        	}
		         } 
			});
		}
		this.imageCaptureDelay(image_);
	}else {
		this.isCapturing = false; //停止抓拍
	}
}

//前端抓拍，先加入抓拍列表
monitorVehicleMedia.prototype.beforeImageCapture = function(channelIndex, vehiIdno){
	if(channelIndex != null) {
		var vehiChnIndex = vehiIdno+'*'+channelIndex;
		if(channelIndex == -1) {
			vehiChnIndex = vehiIdno+'*0';
		}
		if(this.loadCaptureList.get(vehiChnIndex) != null) {
			$.dialog.tips(parent.lang.capture_capturing_stop, 2);
			return;
		}
		var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
		if(vehicle != null && vehicle.getDevList() != null) {
			var device = null;
			if(channelIndex == -1) {//视频设备在线且没有通道，默认0通道
				channelIndex = 0;
				device = vehicle.getVideoDevice();
			}else {
				//判断通道是否在视频设备上
				if(vehicle.isChannelVideoDevice(channelIndex)) {
					device = vehicle.getVideoDevice();
				}else {
					device = vehicle.getGpsDevice();
				}
			}
			if(device.isOnline()) {
				var rows = [];
				var image = {};
				image.time = dateFormat2TimeString(new Date());
				image.id = $('#mediaFilesTable tr').length;
				image.vehiIdno = vehicle.getIdno();
				image.devIdno = device.getIdno();
				if(vehicle.channels != null && vehicle.channels.length > 0) {
					image.channel = this.getChnName(vehicle.channels, channelIndex);
				}else {
					image.channel = channelIndex == 0 ? 'CH1': channelIndex;
				}
				image.channelIndex = channelIndex;
				image.status = 1;
				image.srcType = 1; //图片
				rows.push(image);
				this.mediaFileTableObject.flexAppendRowJson(rows, true);
				this.mapImages.put(image.id, image);
				
				this.loadCaptureList.put(vehiChnIndex, image);
				this.loadCaptureArray.push(image);
				
				if(!this.isCapturing) {
					this.isCapturing = true; //正在抓拍
					this.imageCapture();
				}
			}
		}
	}
}

//获取通道名称
monitorVehicleMedia.prototype.getChnName = function(channels, chn) {
	if(channels != null && channels.length > 0) {
		for (var i = 0; i < channels.length; i++) {
			if(channels[i].index == chn) {
				return channels[i].name;
			}
		}
	}
	return "CH"+(Number(chn)+1);
}

//开启向媒体列表添加数据的定时器
monitorVehicleMedia.prototype.runAddMediaToEventTimer = function(){
	//本类对象
	var myClass = this;
	this.flashAddMediaToEventTimer = setTimeout(function () {
		myClass.startAddMediaToEventTime = (new Date()).getTime(); //开始加入媒体列表的时间
		myClass.flashAddMediaToEvent();
	}, 50);
};

//向媒体列表添加数据
monitorVehicleMedia.prototype.flashAddMediaToEvent = function(){
	if(this.addMediaToEventList != null && this.addMediaToEventList.length > 0) {
		//提示字体变红
		this.showMediaMessage();
		
		var rows = [];
		while(rows.length <= 10 && this.addMediaToEventList.length > 0) {
			rows.push(this.addMediaToEventList[0]);
			this.addMediaToEventList.splice(0, 1);
		}
		if(rows.length > 0) {
			//显示到界面上
			this.mediaFileTableObject.flexAppendRowJson(rows, true);
		}
		
		if((new Date()).getTime() - this.startAddMediaToEventTime < 500) {
			this.flashAddMediaToEvent();
		}else {
			this.runAddMediaToEventTimer();
		}
	}else {
		this.flashAddMediaToEventTimer = null;
	}
};

//报警信息来到时
//添加新的媒体录像文件信息
monitorVehicleMedia.prototype.doAddMediaFile = function(data) {
	var vehicle = parent.vehicleManager.getVehicle(data.vehiIdno);
	if(vehicle != null) {
		//添加到表格中
		var media = {};
		media.id = $('#mediaFilesTable tr').length;
		media.vehiIdno = vehicle.getIdno(); //车牌号
		media.devIdno = data.idno; //设备号
		media.time = data.time; //下载完成时间
		media.srcType = data.srcType; //1是图片，2是录像
		media.chn = data.chn;  //通道
		if(vehicle.channels != null && vehicle.channels.length > 0) {
			media.channel = this.getChnName(vehicle.channels, media.chn);
		}else {
			media.channel = 'CH'+(Number(media.chn) + 1);
		}
		media.recType = data.recType; //1表示报警，2还是常规
		media.len = data.size; //文件大小
		media.loc = data.loc;//存储位置 2存储服务器 4下载服务器
		media.file = data.src;  //路径
		media.res = data.res;  //录像时长
		media.bgTime = data.bgTime;  //录像开始时间
		media.svr = data.svr;  //服务器ID
		media.status = parent.lang.downloaded; //已下载
		media.isMedia = true; //是否是下载的媒体文件
		media.endTime = dateTime2TimeString(dateStrLongTime2Date(media.bgTime).getTime() + media.res * 1000);
		media.beg = shortHour2Second(media.bgTime.substring(11, 19));
		media.end = media.beg + media.res;
		if(Number(media.bgTime.substring(8, 10)) != Number(media.endTime.substring(8, 10))) {
			media.fileTime = media.bgTime + ' - ' + media.endTime;
		}else {
			media.fileTime = media.bgTime + ' - ' + media.endTime.substring(11, 19);
		}
		
		this.mediaList.put(media.id, media);
		
		this.addMediaToEventList.push(media);
		//启动添加媒体数据到媒体列表的计时器
		if(this.flashAddMediaToEventTimer == null) {
			this.runAddMediaToEventTimer();
		}
	}
}

//提示新的录像下载完成事件
monitorVehicleMedia.prototype.showMediaMessage = function() {
	//如果当前选择的是  GPS监控  或者 系统事件列表，当接收到录像下载完成时，需要将 媒体文件字体变红，
	//展现已经接收到了事件，及时提示用户
	if(!$('#gps-mediaFiles').hasClass('active')) {
		$('#gps_mediaFiles_title').css('background-color','#FF0000');
	}
}

/**
 * 提交ajax
 */
monitorVehicleMedia.prototype.doAjaxSubmit = function(action, params, callback) {
	var object = $.post(action, {json : JSON.stringify(params)}, function(json, textStatus) {
		if(textStatus == 'timeout'){
			if((typeof showDialogErrorMessage) == 'function') {
				showDialogErrorMessage(3);
			}
		} else if(textStatus == 'error') {
			if((typeof showDialogErrorMessage) == 'function') {
				showDialogErrorMessage(1);
			}
		} else if (textStatus == "success") {
			if(json.result == 0){
				var server = json.server;
				var lstSvrIp = [];
				var lgServer = {};
				lstSvrIp.push(server.clientIp);
				lstSvrIp.push(server.lanip);
				lstSvrIp.push(server.clientIp2);
				lgServer.port = server.clientPort;
				lgServer.ip = getComServerIp(lstSvrIp);
				
				if((typeof callback) == 'function') {
					callback(lgServer);
				}
			} else{
				var mess = '';
				if((typeof showDialogErrorMessage) == 'function') {
					mess = showDialogErrorMessage(json.result, json.cmsserver);
				}
				if(mess != null && mess == '') {
					$.dialog.tips(parent.lang.errorGetServerInfo, 2);
				}
			}
		} else {
			if((typeof showDialogErrorMessage) == 'function') {
				showDialogErrorMessage(4);
			}
		}
		$.myajax.showLoading(false);
	}, 'json');
	return object;
}

//媒体文件列表下载媒体文件
monitorVehicleMedia.prototype.downloadMediaFile = function(id) {
	var media = this.mediaList.get(Number(id));
	if(media != null) {
		this.doDownloadVehicleServer(media);
	}else {
		this.isClickDownImage = true;
		var image = this.mapImages.get(Number(id));
		if(image != null) {
			this.doDownloadImageFileInfo(image);
		}
	}
}

//下载图片文件信息
monitorVehicleMedia.prototype.doDownloadImageFileInfo = function(image) {
	var url = 'http://'+ this.storageServer.ip +':'+ this.storageServer.port +'/3/5?Type=3';
	url += '&FLENGTH='+ image.length;
	url += '&FOFFSET='+ image.offset;
	url += '&FPATH=' + image.src;
	url += '&MTYPE=1';
	if(!isBrowseFirefox() && !isBrowseSafari()) {
		var saveName = image.vehiIdno+ '_' + image.channel + '_' + image.time.replaceAll('-','').replaceAll(':','').replaceAll(' ','');
		url += "&SAVENAME="+ encodeURI(saveName + '.jpg');
	}else {
		var saveName = image.devIdno+ '_' + image.channel + '_' + image.time.replaceAll('-','').replaceAll(':','').replaceAll(' ','');
		url += "&SAVENAME="+ encodeURI(saveName + '.jpg');
	}
	
	window.open(url, "_blank");
}

//获取下载视频文件服务器信息
monitorVehicleMedia.prototype.doDownloadVehicleServer = function(fileInfo) {
	//获取之前先取消上次的请求
	if(this.ajaxDownloadVehicleServerObj != null) {
		this.ajaxDownloadVehicleServerObj.abort();
	}
	
	var param = {};
	if(fileInfo.loc == 1) {
		param.did = fileInfo.devIdno;
	}else {
		param.did = fileInfo.vehiIdno;
	}
	param.loc = fileInfo.loc;
	param.ftp = fileInfo.svr; //
	//数据库取实时服务器信息
	var myClass = this;
	$.myajax.showLoading(true, parent.lang.findDownloadAddress);
	this.ajaxDownloadVehicleServerObj = this.doAjaxSubmit('StandardVideoTrackAction_queryDownloadServer.action', param, function(server) {
		myClass.doDownloadVideoFileInfo(fileInfo, server);
	});
}

//下载视频文件信息
monitorVehicleMedia.prototype.doDownloadVideoFileInfo = function(fileInfo, dwServer) {
	var devIdno = fileInfo.devIdno;
	if(fileInfo.loc != 1) {
		devIdno = fileInfo.vehiIdno;
	}
	
	var url = "http://" + dwServer.ip +':'+ dwServer.port + "/3/5?DownType=3";
	url += "&DevIDNO="+ devIdno;
	url += "&FLENGTH="+ fileInfo.len;
	url += "&FOFFSET=0";
	url += "&MTYPE=1";
	url += "&FPATH="+ fileInfo.file;
	var paths = fileInfo.file.split('/');
	if (paths.length == 1) {
		paths = fileInfo.file.split('\\');
	}
	if(!isBrowseFirefox() && !isBrowseSafari()) {
		var saveName = fileInfo.vehiIdno + "-" + paths[paths.length - 1];
		url += "&SAVENAME="+ encodeURI(saveName);
	}else {
		url += "&SAVENAME="+ encodeURI(paths[paths.length - 1]);
	}
	window.open(url, "_blank");
//	window.location.href = url;
//	location.href = url;
}

//媒体文件列表回放视频
monitorVehicleMedia.prototype.videoFileReplay = function(id) {
	var media = this.mediaList.get(Number(id));
	if(media != null) {
		if(this.videoReplayObj == null) {
			var myClass = this;
			var url = 'url:LocationManagement/videoReplay.html?index='+id;
			this.videoReplayObj = $.dialog({id:'videoReplay', title: parent.lang.video_query, content: url,
				width: '640px', height: '520px', min:true, max:false, lock: false,fixed:false
					, resize:false, close: function() {
						myClass.videoReplayObj = null;
						if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
							popTipsObject.remove('videoReplay');
						}
					} });
		}else {
			if(this.videoReplayObj.content && (typeof this.videoReplayObj.content.loadPageInfo == 'function')) {
				this.videoReplayObj.content.loadPageInfo(id);
			}
			this.videoReplayObj.show();
		}
		
		if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
			popTipsObject.put('videoReplay', this.videoReplayObj);
		}
		if(typeof hidePopTips == 'function'){
			hidePopTips('videoReplay');
		}
	}
}

/**
 * 初始化系统事件列表
 * 主要是记录下发指令
 */
monitorVehicleMedia.prototype.initServerEventTable = function(){
	//本类对象
	var myClass = this;
	var buttons = [
   	    {separator: false, hidename: "", name: parent.lang.clear, bclass: "flexDelete",
   	    	bimage: "", tooltip: parent.lang.clear, id: "serverEventClear",
   	    	onpress: function() {
   	    		myClass.clearServerEventTable();
   	    	}
   	    }
   	];
	this.serverEventTableObject = $("#serverEventTable").flexigrid({
		url: "",	//StandardTrackAction_query.action
		dataType: 'json',
		colModel : [
			{display: parent.lang.plate_number, name : 'vehiIdno', width : 120, sortable : false, align: 'center'},
//			{display: parent.lang.device_number, name : 'devIdno', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.time, name : 'time', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.type, name : 'type', width : 200, sortable : false, align: 'center'},
			{display: parent.lang.status, name : 'status', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.other_information, name : 'other', width : 250, sortable : false, align: 'center'}
			],
		usepager: false,
		autoload: false,
		useRp: false,
		singleSelect: true,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: true,
		buttons: buttons,
		width: 'auto',
		height: 'auto',
		resizable: false
	});
	this.serverEventTableObject.flexSetFillCellFun(function(p, row, idx, index) {
		return myClass.fillServerEventTable(p, row, idx, index);
	});
};

//清空系统事件列表
monitorVehicleMedia.prototype.clearServerEventTable = function(){
	if(this.serverEventTableObject != null) {
		this.serverEventTableObject.flexClear();
	}
	this.addServerEventList = [];
};

//填充系统事件列表
monitorVehicleMedia.prototype.fillServerEventTable = function(p, row, idx, index){
	var name = p.colModel[idx].name;
	var ret = "";
	if(name == 'vehiIdno') {
		ret = row.vehiIdno;
	}else if(name == 'devIdno') {
		ret = row.devIdno;
	}else if(name == 'time') {
		ret = row.time;
	}else if(name == 'type') {
		ret = row.type;
	}else if(name == 'other') {
		ret = row.other;
	}else if(name == 'status') {
		ret = row.status;
	}  
	return this.getColumnTitle(ret);
}

//车辆控制指令发送
monitorVehicleMedia.prototype.doVehicleControl = function(vehiIdno) {
	if(this.vehicleControlObj == null) {
		var myClass = this;
		var url = 'url:LocationManagement/vehicleControl.html?vehiIdno='+encodeURI(vehiIdno);
		this.vehicleControlObj = $.dialog({id:'vehicleControl', title: parent.lang.monitor_vehicleControl +' - ' + vehiIdno, content: url,
			width: '450px', height: '250px', min:true, max:false, lock: false,fixed:false
				, resize:false, close: function() {
					myClass.closeMediaWindow();
					myClass.vehicleControlObj = null;
					if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
						popTipsObject.remove('vehicleControl');
					}
				} });
	}else {
		this.vehicleControlObj.title(parent.lang.monitor_vehicleControl +' - ' + vehiIdno);
		if(this.vehicleControlObj.content && (typeof this.vehicleControlObj.content.initPageInfo == 'function')) {
			this.vehicleControlObj.content.initPageInfo(vehiIdno);
		}
		this.vehicleControlObj.show();
	}
	
	if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
		popTipsObject.put('vehicleControl', this.vehicleControlObj);
	}
	if(typeof hidePopTips == 'function'){
		hidePopTips('vehicleControl');
	}
}

//GPS上报间隔
monitorVehicleMedia.prototype.doGpsReportInterval = function(vehiIdno) {
	if(this.reportIntervalObj == null) {
		var myClass = this;
		var url = 'url:LocationManagement/gpsReportInterval.html?vehiIdno='+encodeURI(vehiIdno);
		this.reportIntervalObj = $.dialog({id:'reportInterval', title: parent.lang.monitor_GPS_reporting_interval_settings +' - ' + vehiIdno, content: url,
			width: '450px', height: '130px', min:true, max:false, lock: false,fixed:false
				, resize:false, close: function() {
					myClass.closeMediaWindow();
					myClass.reportIntervalObj = null;
					if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
						popTipsObject.remove('reportInterval');
					}
				} });
	}else {
		this.reportIntervalObj.title(parent.lang.monitor_GPS_reporting_interval_settings +' - ' + vehiIdno);
		if(this.reportIntervalObj.content && (typeof this.reportIntervalObj.content.initPageInfo == 'function')) {
			this.reportIntervalObj.content.initPageInfo(vehiIdno);
		}
		this.reportIntervalObj.show();
	}
	
	if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
		popTipsObject.put('reportInterval', this.reportIntervalObj);
	}
	if(typeof hidePopTips == 'function'){
		hidePopTips('reportInterval');
	}
}

//向系统事件列表添加数据
monitorVehicleMedia.prototype.addServerInfoToEvent = function(data){
	this.showServerInfoMessage();
	if(this.mapServerEvent.get(data.id) == null) {//系统事件列表中不存在
		this.mapServerEvent.put(data.id, data);
	}else {
		this.serverEventTableObject.flexRemoveRow(data.id);
		this.mapServerEvent.remove(data.id);
	}
	this.addServerEventList.push(data.id);
	var rows = [];
	rows.push(data);
	//如果列表数量大于100，则删除最后一条
	if(this.addServerEventList != null && this.addServerEventList.length > 100) {
		this.serverEventTableObject.flexRemoveRow(this.addServerEventList[0]);
		this.addServerEventList.splice(0, 1);
	}
	//添加到表格
	this.serverEventTableObject.flexAppendRowJson(rows, true);
};

//关闭车辆控制窗口后将正在发送的控制赋值为发送失败
monitorVehicleMedia.prototype.closeMediaWindow = function(){
	if(this.mapServerEvent.size() > 0) {
		var rows = [];
		var myClass = this;
		this.mapServerEvent.each(function(id, data) {
			data.time = dateFormat2TimeString(new Date());
			data.status = parent.lang.monitor_sendFail;
			rows.push(data);
			myClass.serverEventTableObject.flexRemoveRow(id);
		});
		this.mapServerEvent.clear();
		this.serverEventTableObject.flexAppendRowJson(rows, true);
	}
};

//gps上报间隔设置成功后调用
monitorVehicleMedia.prototype.setGpsReportIntervalSuccess = function(json, data) {
	data.time = dateFormat2TimeString(new Date());
	if(json) {//回调
		if(json.result == 0){
			$.dialog.tips(parent.lang.monitor_setSuccess, 2);
			data.status = parent.lang.monitor_setSuccess;
		}else if(json.result == 1){
			$.dialog.tips(parent.lang.video_not_online, 2);
			data.status = parent.lang.monitor_setFail;
		}else {
			var mess = '';
			if((typeof showDialogErrorMessage) == 'function') {
				mess = showDialogErrorMessage(json.result, json.cmsserver);
			}
			if(mess != null && mess == '') {
				$.dialog.tips(parent.lang.monitor_setFail, 2);
			}
			data.status = parent.lang.monitor_setFail;
		}
	}else {
		$.dialog.tips(parent.lang.monitor_setFail, 2);
		data.status = parent.lang.monitor_setFail;
	}
	//将数据加入系统列表
	this.addServerInfoToEvent(data);
	//关闭窗口
	this.reportIntervalObj.close();
	this.reportIntervalObj = null;
}

//提示新的录像下载完成事件
monitorVehicleMedia.prototype.showServerInfoMessage = function() {
	//如果当前选择的不是系统事件列表，当接收到系统事件时，需要将 系统事件字体变红，
	//展现已经接收到了事件，及时提示用户
	if(!$('#gps-system').hasClass('active')) {
		$('#gps_system_title').css('background-color','#FF0000');
	}
}