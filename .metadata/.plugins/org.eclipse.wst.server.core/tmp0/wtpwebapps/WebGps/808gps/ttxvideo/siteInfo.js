var api = frameElement.api, W = api.opener;
var DEF_Request_Video = 'RequestVideo';
var DEF_Speak = 'Speak';
var DEF_Video_Set = 'VideoSet';
var DEF_Max_Picture = 'MaxPicture';
var DEF_Refresh_Interval = 'RefreshInterval';
var DEF_Alarm_Refresh_Interval = 'AlarmRefInterval';
var DEF_Enable_Marker_Cluster = "EnableMarkerCluster";
var DEF_Max_Cluster_Zoom = "MaxClusterZoom";
var DEF_Min_Cluster_Size = "MinClusterSize";
var infoType = 0;
var reqvideo = 1;
var speakandlisten = 5;
var setvideo = 5;
var picmax = 0;
var refinterval = 10;
var alarmrefinterval = 10;
var enableMarkerCluster = 0;//是否启用点聚合
var maxClusterZoom = 16;//最大聚合级别
var minClusterSize = 2;//最小聚合数量

$(document).ready(function(){
	setTimeout(loadReadyPage, 50);
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
		setPanelWidth();
	}
}

function loadPage(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	
	$('#search-list .storage a').text(parent.lang.video_parameters);
	$('#search-list .offline a').text(parent.lang.map_parameters);
	$('#search-list .damage a').text(parent.lang.alerm_parameters);
	
	loadStorageTable();
	
	//切换事件列表
	$("#search-list li").click(function(){
		infoType = $(this).index();
		$(this).addClass("active").siblings().removeClass("active");
		$("#search-table li").eq(infoType).addClass("active").siblings().removeClass("active");
		loadStorageTable();
	});
}

function loadStorageTable() {
	$('#info-mid-table').empty();
	$('#toolbar-btn').empty();
	var buttons = [];
	var but = [];
	if(infoType == 0 || infoType == 1 || infoType == 2 ) {
		but.push({
			display: parent.lang.save, 
			name : '', 
			pclass : 'submit',
			bgcolor : 'gray',
			hide : false
		});
		buttons.push(but);
	}
	but = [];
	but.push({
		display: parent.lang.close, 
		name : '', 
		pclass : 'close',
		bgcolor : 'gray', 
		hide : false
	});
	buttons.push(but);
	$('#toolbar-btn').flexPanel({
		ButtonsModel : buttons 
	});

	var ttype = '';
	var tips = '';
	if(infoType == 0 || infoType == 1) {
		ttype = 'input';
		tips = '';
	}
	var display = [],name = [],types = [],length = [];
	
	if(infoType == 0) {
		display.push(parent.lang.default_request_video);
		display.push(parent.lang.close_speaking_and_listening);
		display.push(parent.lang.close_video_settings);
		display.push(parent.lang.show_max_picture);
		name.push('requestVideo');
		name.push('speak');
		name.push('videoSet');
		name.push('maxPicture');
		types.push('');
		types.push('');
		types.push('');
		types.push('');
		length.push(20);
		length.push(20);
	}else if(infoType == 1) {
		//gps刷新间隔
		display.push(parent.lang.gps_refresh_interval);
		name.push('refreshInterval');
		types.push('');
		length.push('');
		//标记点聚合参数
		display.push(parent.lang.enable_marker_cluster);
		name.push('markerCluster');
		types.push('');
		length.push('');
		display.push(parent.lang.max_cluster_zoom);
		name.push('maxClusterZoom');
		types.push('');
		length.push('');
		display.push(parent.lang.min_cluster_size);
		name.push('minClusterSize');
		types.push('input');
		length.push(3);
	}else if(infoType == 2) {
		display.push(parent.lang.alarm_refresh_interval);
		name.push('alarmRefInterval');
		types.push('');
	}

	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip:tips,hide:false,tabshide:false, headhide: true},
				colgroup:{width:['150px','325px']},
				tabs: {
					display : display,
					name : name ,
					type : types,
					length: length
				}
			}
		]
	
	});
//	$('.panel-head').hide();
	$('.submit','#toolbar-btn').on('click',saveManage);
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'manageinfo'}).close();
	});
	
	if(infoType == 0){
		var streamTypes = getStreamTypes();
		var videoRequest = $.cookie(DEF_Request_Video);
		if(videoRequest != null){
			reqvideo = videoRequest;
		}
		$('#select-requestVideo').remove();
		$('.td-requestVideo').flexPanel({
			ComBoboxModel :{
				input : {name : 'requestVideo',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'requestVideo', option : arrayToStr(streamTypes)}
			}	
		});
		
		$('#combox-requestVideo').val(getArrayName(streamTypes,reqvideo));
		$('#hidden-requestVideo').val(reqvideo);
		var speakTimes = getSpeakTimes();
		var speak = $.cookie(DEF_Speak);
		if(speak != null){
			speakandlisten = speak;
		}
		$('#select-speak').remove();
		$('.td-speak').flexPanel({
			ComBoboxModel :{
				input : {name : 'speak',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'speak', option : arrayToStr(speakTimes)}
			}	
		});
		$('#combox-speak').val(getArrayName(speakTimes,speakandlisten));
		$('#hidden-speak').val(speakandlisten);
		var videoSets = getSpeakTimes();
		var video = $.cookie(DEF_Video_Set);
		if(video != null){
			setvideo = video;
		}
		$('#select-videoSet').remove();
		$('.td-videoSet').flexPanel({
			ComBoboxModel :{
				input : {name : 'videoSet',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'videoSet', option : arrayToStr(videoSets)}
			}	
		});
		$('#combox-videoSet').val(getArrayName(videoSets,setvideo));
		$('#hidden-videoSet').val(setvideo);
		var maxPictures = getMaxPictures();
		var picture = $.cookie(DEF_Max_Picture);
		if(picture != null){
			picmax = picture;
		}
		$('#select-maxPicture').remove();
		$('.td-maxPicture').flexPanel({
			ComBoboxModel :{
				input : {name : 'maxPicture',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'maxPicture', option : arrayToStr(maxPictures)}
			}	
		});
		$('#combox-maxPicture').val(getArrayName(maxPictures,picmax));
		$('#hidden-maxPicture').val(picmax);
	}else if(infoType == 1){
		//gps刷新间隔
		var refreshIntervals = getRefreshInterval();
		var interval = $.cookie(DEF_Refresh_Interval);
		if(interval != null){
			refinterval = interval;
		}
		$('#select-refreshInterval').remove();
		$('.td-refreshInterval').flexPanel({
			ComBoboxModel :{
				input : {name : 'refreshInterval',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'refreshInterval', option : arrayToStr(refreshIntervals)}
			}	
		});
		$('#combox-refreshInterval').val(getArrayName(refreshIntervals,refinterval));
		$('#hidden-refreshInterval').val(refinterval);
		//加载标记点聚合参数
		loadMarkerClusterParam();
	}else if(infoType == 2){
		var alarmRefIntervals = getRefreshInterval();
		var alarminterval = $.cookie(DEF_Alarm_Refresh_Interval);
		if(alarminterval != null){
			alarmrefinterval = alarminterval;
		}
		$('#select-alarmRefInterval').remove();
		$('.td-alarmRefInterval').flexPanel({
			ComBoboxModel :{
				input : {name : 'alarmRefInterval',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'alarmRefInterval', option : arrayToStr(alarmRefIntervals)}
			}	
		});
		$('#combox-alarmRefInterval').val(getArrayName(alarmRefIntervals,alarmrefinterval));
		$('#hidden-alarmRefInterval').val(alarmrefinterval);
	}
}

//加载标记点聚合参数
function loadMarkerClusterParam() {
	//是否启用点聚合
	var clusterContent = addRadio('markerCluster');
	$('.td-markerCluster').append(clusterContent);
	var enableMarkerCluster_ = $.cookie(DEF_Enable_Marker_Cluster);
	if(enableMarkerCluster_ != null){
		enableMarkerCluster = enableMarkerCluster_;
	}
	//最大聚合级别
	var clusterZooms = getClusterZooms();
	var maxClusterZoom_ = $.cookie(DEF_Max_Cluster_Zoom);
	if(maxClusterZoom_ != null && maxClusterZoom_ != ''){
		maxClusterZoom = maxClusterZoom_;
	}
	$('#select-maxClusterZoom').remove();
	$('.td-maxClusterZoom').flexPanel({
		ComBoboxModel :{
			input : {name : 'maxClusterZoom',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			combox: 
				{name : 'maxClusterZoom', option : arrayToStr(clusterZooms)}
		}
	});
	$('#combox-maxClusterZoom').val(getArrayName(clusterZooms, maxClusterZoom));
	$('#hidden-maxClusterZoom').val(maxClusterZoom);
	//最小聚合数量
	//限制只能输入数字
	$('.td-minClusterSize').append('<span class="red" style="margin-left:5px;color: red;">'+parent.lang.min_cluster_size_tip+'</span>');
	enterDigital('#input-minClusterSize');
	var minClusterSize_ = $.cookie(DEF_Min_Cluster_Size);
	if(minClusterSize_ != null && minClusterSize_ != ''){
		minClusterSize = minClusterSize_;
	}
	$('#input-minClusterSize').val(minClusterSize);
	
	if(enableMarkerCluster == 1) {
		$('#markerCluster-yes').get(0).checked = true;
	}else {
		$('#markerCluster-no').get(0).checked = true;
		$('#combox-maxClusterZoom').get(0).disabled = true;
		diableInput('#input-minClusterSize', true, true);
	}
	//切换启用点聚合事件
	$('.td-markerCluster input').on('click', switchMarkerCluster);
}

//切换启用点聚合事件
function switchMarkerCluster() {
	var temp = $.trim($("input[name='markerCluster']:checked").val());
	//选择视频设备
	if (temp != "1") {
		$('#combox-maxClusterZoom').get(0).disabled = true;
		diableInput('#input-minClusterSize', true, true);
	} else {
		$('#combox-maxClusterZoom').get(0).disabled = false;
		diableInput('#input-minClusterSize', false, true);
	}
}

//改变窗口大小时加载页面
function setPanelWidth() {
	$('#search-list').height($(window).height() - 23);
	$('#search-table').height($(window).height() - 25);
}

//添加 radio选项
function addRadio(name) {
	var content = '';
	content += '<input id="'+name+'-yes" name="'+name+'" type="radio" value="1"/>';
	content += '<label id="label-'+name+'-yes" for="'+name+'-yes">'+parent.lang.yes+'</label>';
	content += '<input id="'+name+'-no" name="'+name+'" type="radio" value="0" style="margin-left: 10px;" checked/>';
	content += '<label id="label-'+name+'-no" for="'+name+'-no">'+parent.lang.no+'</label>';
	return content;
}

function getStreamTypes() {
	var plateTypes = [];
	plateTypes.push({id:1,name: parent.lang.subStream});
	plateTypes.push({id:0,name: parent.lang.main_stream});
	return plateTypes;
}

function getSpeakTimes() {
	var status = [];
	status.push({id:0,name: parent.lang.not_automatic_shutdown});
	status.push({id:1,name: parent.lang.automatic_shutdown_1});
	status.push({id:2,name: parent.lang.automatic_shutdown_2});
	status.push({id:3,name: parent.lang.automatic_shutdown_3});
	status.push({id:4,name: parent.lang.automatic_shutdown_4});
	status.push({id:5,name: parent.lang.automatic_shutdown_5});
	status.push({id:6,name: parent.lang.automatic_shutdown_6});
	status.push({id:7,name: parent.lang.automatic_shutdown_7});
	status.push({id:8,name: parent.lang.automatic_shutdown_8});
	status.push({id:9,name: parent.lang.automatic_shutdown_9});
	status.push({id:10,name: parent.lang.automatic_shutdown_10});
	status.push({id:15,name: parent.lang.automatic_shutdown_15});
	status.push({id:30,name: parent.lang.automatic_shutdown_30});
	status.push({id:45,name: parent.lang.automatic_shutdown_45});
	status.push({id:60,name: parent.lang.automatic_shutdown_60});
	return status;
}

function getMaxPictures() {
	var status = [];
	status.push({id:0,name: parent.lang.show_16_picture});
	status.push({id:1,name: parent.lang.show_25_picture});
	status.push({id:2,name: parent.lang.show_36_picture});
	return status;
}

function getRefreshInterval() {
	var status = [];
	status.push({id:10,name: parent.lang.refresh_interval_10});
	status.push({id:15,name: parent.lang.refresh_interval_15});
	status.push({id:20,name: parent.lang.refresh_interval_20});
	status.push({id:30,name: parent.lang.refresh_interval_30});
	status.push({id:60,name: parent.lang.refresh_interval_60});
	status.push({id:90,name: parent.lang.refresh_interval_90});
	return status;
}

//获取地图缩放级别
function getClusterZooms() {
	var zooms = [];
	if(parent.getMapType() && parent.getMapType() == 3) {
		zooms.push({id: 18,name: "50m"});
		zooms.push({id: 17,name: "100m"});
		zooms.push({id: 16,name: "200m"});
		zooms.push({id: 15,name: "500m"});
		zooms.push({id: 14,name: "1km"});
		zooms.push({id: 13,name: "2km"});
		zooms.push({id: 12,name: "5km"});
		zooms.push({id: 11,name: "10km"});
		zooms.push({id: 10,name: "20km"});
		zooms.push({id: 9,name: "25km"});
		zooms.push({id: 8,name: "50km"});
		zooms.push({id: 7,name: "100km"});
		zooms.push({id: 6,name: "200km"});
		zooms.push({id: 5,name: "500km"});
		zooms.push({id: 4,name: "1000km"});
		zooms.push({id: 3,name: "2000km"});
	}else {
		zooms.push({id: 17,name: "50m"});
		zooms.push({id: 16,name: "100m"});
		zooms.push({id: 15,name: "200m"});
		zooms.push({id: 14,name: "500m"});
		zooms.push({id: 13,name: "1km"});
		zooms.push({id: 12,name: "2km"});
		zooms.push({id: 11,name: "5km"});
		zooms.push({id: 10,name: "10km"});
		zooms.push({id: 9,name: "20km"});
		zooms.push({id: 8,name: "25km"});
		zooms.push({id: 7,name: "50km"});
		zooms.push({id: 6,name: "100km"});
		zooms.push({id: 5,name: "200km"});
		zooms.push({id: 4,name: "500km"});
		zooms.push({id: 3,name: "1000km"});
		zooms.push({id: 2,name: "2000km"});
	}
	return zooms;
}

function saveManage(){
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	if(infoType == 0){
		$.cookie(DEF_Request_Video, $('#hidden-requestVideo').val(), { expires: 365});
		$.cookie(DEF_Speak, $('#hidden-speak').val(), { expires: 365});
		$.cookie(DEF_Video_Set, $('#hidden-videoSet').val(), { expires: 365});
		$.cookie(DEF_Max_Picture, $('#hidden-maxPicture').val(), { expires: 365});
		
		$.cookie(DEF_Request_Video, $('#hidden-requestVideo').val(), { expires: 365, path:"/808gps/"});
		$.cookie(DEF_Speak, $('#hidden-speak').val(), { expires: 365, path:"/808gps/"});
		$.cookie(DEF_Video_Set, $('#hidden-videoSet').val(), { expires: 365, path:"/808gps/"});
		$.cookie(DEF_Max_Picture, $('#hidden-maxPicture').val(), { expires: 365, path:"/808gps/" });
		
		/*$.cookie(DEF_Request_Video, $('#hidden-requestVideo').val(), { expires: 365, path:"/808gps/", domanin: 'localhost' });
		$.cookie(DEF_Speak, $('#hidden-speak').val(), { expires: 365, path:"/808gps/", domanin: 'localhost' });
		$.cookie(DEF_Video_Set, $('#hidden-videoSet').val(), { expires: 365, path:"/808gps/", domanin: 'localhost' });
		$.cookie(DEF_Max_Picture, $('#hidden-maxPicture').val(), { expires: 365, path:"/808gps/", domanin: 'localhost' });*/
		W.setMaxPicture();
		W.setCloseTime();
	}else if(infoType == 1){
		var enableMarkerCluster_ = $.trim($("input[name='markerCluster']:checked").val());
		var maxClusterZoom_ = $.trim($('#hidden-maxClusterZoom').val());
		var minClusterSize_ = $.trim($('#input-minClusterSize').val());
		if(enableMarkerCluster_ == '1') {
			if(Number(minClusterSize_) > 999 || Number(minClusterSize_) < 2) {
				$('#input-minClusterSize').focus();
				disableForm(false);
				$.myajax.showLoading(false, parent.lang.saving);
				$.dialog.tips(parent.lang.min_cluster_size_error, 1);
				return;
			}
		}else {
			maxClusterZoom_ = '';
			minClusterSize_ = '';
		}
		$.cookie(DEF_Enable_Marker_Cluster, enableMarkerCluster_, { expires: 365});
		$.cookie(DEF_Enable_Marker_Cluster, enableMarkerCluster_, { expires: 365, path:"/808gps/" });
		$.cookie(DEF_Min_Cluster_Size, minClusterSize_, { expires: 365});
		$.cookie(DEF_Min_Cluster_Size, minClusterSize_, { expires: 365, path:"/808gps/" });
		$.cookie(DEF_Max_Cluster_Zoom, maxClusterZoom_, { expires: 365});
		$.cookie(DEF_Max_Cluster_Zoom, maxClusterZoom_, { expires: 365, path:"/808gps/" });
		
		$.cookie(DEF_Refresh_Interval, $('#hidden-refreshInterval').val(), { expires: 365});
		$.cookie(DEF_Refresh_Interval, $('#hidden-refreshInterval').val(), { expires: 365, path:"/808gps/" });
		//$.cookie(DEF_Refresh_Interval, $('#hidden-refreshInterval').val(), { expires: 365, path:"/808gps/", domanin: 'localhost' });
		W.setRefinterval();
	}else if(infoType == 2){
	//	$.cookie(DEF_Alarm_Refresh_Interval, $('#hidden-alarmRefInterval').val(), { expires: 365, path:"/808gps/", domanin: 'localhost'});
		$.cookie(DEF_Alarm_Refresh_Interval, $('#hidden-alarmRefInterval').val(), { expires: 365});
		$.cookie(DEF_Alarm_Refresh_Interval, $('#hidden-alarmRefInterval').val(), { expires: 365, path:"/808gps/" });
		W.setAlarmRefinterval();
	}
	disableForm(false);
	$.myajax.showLoading(false, parent.lang.saving);
	W.$.dialog.tips(parent.lang.saveok, 1);
	W.$.dialog({id:'manageinfo'}).close();
}