var api = frameElement.api, W = api.opener;
var vehiIdno = decodeURIComponent(getUrlParameter('vehiIdno'));//车牌号
var devIdno = getUrlParameter('devIdno');//设备号
var ajaxObject = null;

$(document).ready(function(){
	loadReadyPage();
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}

function loadPage() {
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;

	//加载页面控件
	loadPageTableTools();
	
	//刷新
	$('.btnRefresh').on('click', ajaxLoadDeviceInfo);
	//退出
	$('.btnExit').on('click', function() {
		W.monitorMenu.deviceInfoObj = null;
		W.$.dialog({id:'deviceInfo'}).close();
	});
	
	$('.td-vehiIdno').text(vehiIdno);
	$('.td-devIdno').text(devIdno);
	
	//加载设备信息
	ajaxLoadDeviceInfo();
}

//加载页面控件
function loadPageTableTools() {
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'requiredInfo',tip: '',hide:false,tabshide: false, headhide: false},
				colgroup:{width:['120px','200px','120px','200px']},
				tabs:{
					display: [parent.lang.plate_number, parent.lang.device_number, parent.lang.versionNumber,
					          parent.lang.wirelessModule, parent.lang.moduleType, parent.lang.wirelessAddr,
					          parent.lang.wifiModule, parent.lang.wifiAddr],
					name : ['vehiIdno', 'devIdno', 'version', 'wireless', 'moduleType', 'wirelessAddr', 'wifi', 'wifiAddr'],
					type:[],
					length:[]
				}
			},
			{
				title :{display: parent.lang.channelStatus,pid : 'recordStatus',tip: '',hide:false,tabshide: false, headhide: false},
				colgroup:{width:['120px','200px','120px','200px']},
				tabs:{
					display: [],
					name : [],
					type:[],
					length:[]
				}
			},
			{
				title :{display: parent.lang.diskStatus,pid : 'hardDisk',tip: '',hide:false,tabshide: false, headhide: false},
				colgroup:{width:['120px','200px','120px','200px']},
				tabs:{
					display: [],
					name : [],
					type:[],
					length:[]
				}
			}
		]
	});
	
	//加载按钮
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.refresh, name : '', pclass : 'btnRefresh',
				bgcolor : 'gray', hide : false}],
			[{display: parent.lang.close, name : '', pclass : 'btnExit',
				bgcolor : 'gray', hide : false}]
		]
	});
	
	//加载录像状态表格
	$('#recordStatus .panel-body').prepend('<div id="recordStatusTable"></div>');
	
	$('#recordStatusTable').flexigrid({
		url: 'xxx',
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.channelName, name : 'chnName', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.videoRecording, name : 'recording', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.alarm_type_video_lost_status, name : 'videoLost', width : 100, sortable : false, align: 'center', hide: false}
			],
		usepager: false,
		autoload: false,
		useRp: false,
		title: false,
		singleSelect: true,
		rp: 15,
		showTableToggleBtn: false,
		showToggleBtn: false,
		resizable: false,
		width: 'auto',
		onSubmit: false,//addFormData,
		height: 110
	});
	$("#recordStatusTable").flexSetFillCellFun(fillRecordStatusTable);
	
	//加载硬盘表格
	$('#hardDisk .panel-body').prepend('<div id="hardDiskTable"></div>');
	
	$('#hardDiskTable').flexigrid({
		url: 'xxx',
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.alarm_disk_all_capacity +'(GB)', name : 'diskAll', width : 150, sortable : false, align: 'center', hide: false},
			{display: parent.lang.alarm_disk_sur_capacity +'(GB)', name : 'diskSub', width : 150, sortable : false, align: 'center', hide: false},
			{display: parent.lang.diskSerialNumber, name : 'number', width : 100, sortable : false, align: 'center', hide: false}
			],
		usepager: false,
		autoload: false,
		useRp: false,
		title: false,
		rp: 15,
		showTableToggleBtn: false,
		showToggleBtn: false,
		resizable: false,
		width: 'auto',
		onSubmit: false,//addFormData,
		height: 60
	});
	$("#hardDiskTable").flexSetFillCellFun(fillHardDiskTable);
}

function getColumnTitle(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

//填充录像状态列表
function fillRecordStatusTable(p, row, idx, index){
	var name = p.colModel[idx].name;
	var ret = "";
	if(name == 'index') {
		ret = row.index;
	}else if(name == 'chnName') {
		ret = row.chnName;
	}else if(name == 'recording') {
		if(row.record == 1) {
			ret = parent.lang.yes;
		}else {
			ret = parent.lang.no;
		}
	}else if(name == 'videoLost') {
		if(row.videoLost == 1) {
			ret = parent.lang.yes;
		}else {
			ret = parent.lang.no;
		}
	}     
	return getColumnTitle(ret);
}

//填充硬盘列表
function fillHardDiskTable(p, row, idx, index){
	var name = p.colModel[idx].name;
	var ret = "";
	if(name == 'index') {
		ret = row.disk;
	}else if(name == 'diskAll') {
		ret = row.diskAll;
	}else if(name == 'diskSub') {
		ret = row.diskSub;
	}else if(name == 'number') {
		ret = row.number;
	}     
	return getColumnTitle(ret);
}

function getWLanTypeStr(type) {
	var ret = "";
	switch (Number(type)) {
	case 0:
		ret = parent.lang.wLan_2G;
		break;
	case 1:
		ret = parent.lang.wLan_EVDO;
		break;
	case 2:
		ret = parent.lang.wLan_WCDMA;
		break;
	default:
		ret = parent.lang.wLan_2G;
		break;
	}
	return ret;
}

//加载设备信息
function loadDeviceInfo(devstaus) {
	$('.td-version').text(devstaus.Version);
	if(devstaus.WLanActive && devstaus.WLanActive == 1) {
		$('.td-wireless').text(parent.lang.valid);
	}else {
		$('.td-wireless').text(parent.lang.monitor_invalid);
	}
	//无线模块类型
	$('.td-moduleType').text(getWLanTypeStr(devstaus.WLanType));
	$('.td-wirelessAddr').text(devstaus.WLanAddr);
	if(devstaus.WifiActive && devstaus.WifiActive == 1) {
		$('.td-wifi').text(parent.lang.valid);
	}else {
		$('.td-wifi').text(parent.lang.monitor_invalid);
	}
	$('.td-wifiAddr').text(devstaus.WifiAddr);
	//通道数目
	var chnCount = devstaus.ChanNum;
//	$('.td-chnCount').text(devstaus.ChanNum);
	//视频传输数目
//	$('.td-videoCount').text(devstaus.VideoTran);
	//硬盘数目
	var diskNum = devstaus.DiskNum;
//	$('.td-diskCount').text(diskNum);
	
	//录像状态
	var videoStatus = [];
	if(chnCount && chnCount > 0) {
		var record = devstaus.Record;  //录像状态
		var videoLost = devstaus.VideoLost;  //视频丢失状态
		for (var i = 0; i < chnCount; i++) {
			var video = {};
			video.index = i+1;
			video.chnName = 'CH'+(i+1);
			if((record>>i)&1 > 0) {
				video.record = 1;
			}else {
				video.record = 0;
			}
			if((videoLost>>i)&1 > 0) {
				video.videoLost = 1;
			}else {
				video.videoLost = 0;
			}
			
			videoStatus.push(video);
		}
	}
	$('#recordStatusTable').flexAppendRowJson(videoStatus, false);
	
	//硬盘
	var diskInfo = devstaus.DiskInfo; //硬盘信息
	var diskInfos = [];
	if(diskNum && diskNum > 0) {
		for (var i = 0; i < diskNum; i++) {
			if(diskInfo.length > i) {
				var disk = {};
				disk.disk = i+1;
				disk.diskAll = (diskInfo[i].AllVolume/100).toFixed(2);
				disk.diskSub = (diskInfo[i].LeftVolume/100).toFixed(2);
				disk.number = '';
				diskInfos.push(disk);
			}
		}
	}
	$('#hardDiskTable').flexAppendRowJson(diskInfos, false);
}

//加载设备信息信息
function ajaxLoadDeviceInfo() {
	if(ajaxObject != null) {
		ajaxObject.abort();
	}
	$('#recordStatusTable').flexClear();
	$('#hardDiskTable').flexClear();
	var device = parent.vehicleManager.getDevice(devIdno);
	if(device == null || !device.isOnline()) {
		$.dialog.tips(parent.lang.video_not_online, 1);
		return;
	}
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	
	var action = "http://"+ W.userServer.ip +":"+ W.userServer.port +"/2/11/callback=getData?DevIDNO="+ devIdno;
	ajaxObject = $.ajax({
		type : "post",  
        url : action,
        timeout: 120000,
        data : null, 
        dataType: "jsonp",
        success : getData = function(json){
    		if(json.result == 0){
    			loadDeviceInfo(json.devstaus);
    			$.dialog.tips(parent.lang.getDeviceInfoSuccess, 1);
    		}else if(json.result == 1){
    			$.dialog.tips(parent.lang.video_not_online, 1);
    		}else {
    			$.dialog.tips(parent.lang.ErrorGetDeviceInfoFail, 1);
    		}
    		$.myajax.showLoading(false);
    		disableForm(false);
        },  
        error:function(XHR, textStatus, errorThrown){
        	if(errorThrown == 'timeout') {
        		$.dialog.tips(parent.lang.ErrorGetDeviceInfoFail, 1);
        	}
        	$.myajax.showLoading(false);
        	disableForm(false);
         } 
	});
}

function initDeviceInfo() {
	$('#info-mid-table td').each(function() {
		$(this).empty();
	});
}

//加载页面信息
function initPageInfo(vehiIdno_, devIdno_) {
	vehiIdno = vehiIdno_;
	devIdno = devIdno_;
	//初始化页面数据
	initDeviceInfo();
	$('.td-vehiIdno').text(vehiIdno);
	$('.td-devIdno').text(devIdno);
	ajaxLoadDeviceInfo();
}