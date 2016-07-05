var api = frameElement.api, W = api.opener;
var videoVehicleList = W.videoVehicleList;
var downloadFileList = new Hashtable();
$(document).ready(function(){
	setTimeout(loadReadyPage, 50);
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}

function loadPage(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	
	$('#labelBeginTime').text(parent.lang.labelFileStartTime);
	$('#labelEndTime').text(parent.lang.labelFileEndTime);
	$('#labelStatus').text(parent.lang.labelDownloadStatus);
	$('#labelVehicle').text(parent.lang.monitor_labelVehicleIdno);
	$('#labelTaskTag').text(parent.lang.labelDownloadTaskTag);
	
	//搜索时间
	var begintime = dateCurDateBeginString();
	var endtime = dateCurDateEndString();
	$("#begintime").val(begintime);
	$("#endtime").val(endtime);
	$("#begintime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}) });
	$("#endtime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}) });
	
	$('#select-status').flexPanel({
		ComBoboxModel :{
			button :
			[
				[{
					display: parent.lang.all, name : 'status', pid : 'status', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
				}]
			],
			combox: {name : 'status', option : '&'+parent.lang.all+'|1&'+parent.lang.noDownload+'|2&'+parent.lang.downloading+'|3&'+parent.lang.downloadFail+'|4&'+parent.lang.downloaded}
		}
	});
	
	$('#selectDevice').flexPanel({
		 ComBoboxModel :{
			 input : {display: parent.lang.selectVehicleTip,name : 'vehiIdnos',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: false},
			 combox: 
					{name : 'vehiIdnos', option : arrayToStr(W.limVehicleList)}
		 }	
	});
	
	$('#selectTaskTag').flexPanel({
		InputModel : {display: parent.lang.labelSearchDownloadTaskTag,value:'',name : 'taskTag', pid : 'taskTag', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
	});
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.query, name : '', pclass : 'btnQuery',
				bgcolor : 'gray', hide : false}]
		]
	});
	
	var params = [];
	params.push({
		name: 'begintime',
		value: begintime
	});
	params.push({
		name: 'endtime',
		value: endtime
	});
	$('#downloadTaskTable').flexigrid({
		url: 'StandardVideoTrackAction_downloadTasklist.action',
		dataType: 'json',
		colModel : [
		    {display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.report_vehiIdno, name : 'vehiIdno', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.submitTime, name : 'submitTime', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.fileStartTime, name : 'fileStartTime', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.fileEndTime, name : 'fileEndTime', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.downloadStartTime, name : 'downloadStartTime', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.downloadEndTime, name : 'downloadEndTime', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.downloadTaskTag, name : 'taskTag', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.alarm_record_type, name : 'videoType', width : 80, sortable : false, align: 'center', hide: false},
			{display: parent.lang.downloadType, name : 'downloadType', width : 80, sortable : false, align: 'center', hide: false},
			{display: parent.lang.alarm_channel, name : 'vehiChn', width : 60, sortable : false, align: 'center'},
			{display: parent.lang.alarm_record_size+"(MB)", name : 'fileSize', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.status, name : 'status', width : 80, sortable : false, align: 'center', hide: false},
			{display: parent.lang.file, name : 'fileSrc', width : 350, sortable : false, align: 'center'}
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
		checkbox: false,
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		buttons: false,
		usepager: true,
		autoload: true,
		useRp: true,
		title: false,
		params: params,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: true,
		width: 'auto',
		onSubmit: false,
		onSuccess: function(obj) {
			loadFileSuccess(obj); //加载成功后获取文件列表
		},
		height: 'auto'
	});
	
	loadReportTableWidth(fixHeight);
	
	cleanSpelChar('#combox-taskTag');
	
	$('.btnQuery','#toolbar-btn').on('click',function(){
		loadQuery();
	});
	
	//点击更多弹出车辆选择
	$('.more_car').on('click', queryMoreVehicle);
	
	/*$('#combox-vehiIdnos').on('keydown',function(e){
		if(e.keyCode == 13) {
			loadQuery();
		}
	});*/
}

function fixHeight() {
	$('#downloadTaskTable').flexFixHeight();
}

function loadQuery() {
	var begintime = $("#begintime").val();
	var endtime = $("#endtime").val();
	if (!dateIsValidDateTime(begintime)) {
		$.dialog.tips(parent.lang.errQueryTimeFormat, 2);
		return false;
	}
	if (!dateIsValidDateTime(endtime)) {
		$.dialog.tips(parent.lang.errQueryTimeFormat, 2);
		return false;
	}
	
	if (dateCompareStrLongTime(begintime, endtime) > 0) {
		$.dialog.tips(parent.lang.errQueryTimeRange, 2);
		return false;
	}
	if (!dateCompareStrLongTimeRange(begintime, endtime, 90)) {
		$.dialog.tips(parent.lang.report_timeRangOver90Day, 2);
		return false;
	} 
	var vehiIdno = $.trim($('#hidden-vehiIdnos').val());
	var devIdno = '';
	//车牌号不为空，获取车辆设备
	if(vehiIdno != null && vehiIdno != '') {
		var vehicle = parent.vehicleManager.getVehicle(vehiIdno.toString());
		var device = vehicle.getVideoDevice();
		devIdno = device.getIdno();
	}
	
	var status = $('#hidden-status').val();
	var taskTag = $('#combox-taskTag').val();
	var params = [];
	params.push({
		name: 'begintime',
		value: begintime
	});
	params.push({
		name: 'endtime',
		value: endtime
	});
	params.push({
		name: 'status',
		value: status
	});
	params.push({
		name: 'devIdno',
		value: devIdno
	});
	params.push({
		name: 'taskTag',
		value: taskTag
	});
	$('#downloadTaskTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function loadFileSuccess(obj) {
	var data = obj.getData();
	if(data != null && data.rows != null) {
		var files = data.rows;
		for (var i = 0; i < files.length; i++) {
			var device = parent.vehicleManager.getDevice(files[i].did);
			if(device != null) {
				files[i].vid = device.getVehiIdno();
			}else {
				files[i].vid = files[i].did;
			}
			downloadFileList.put(Number(files[i].id), files[i]);
		}
	}
}

function getColumnTitle(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'vehiIdno') {
		var device = parent.vehicleManager.getDevice(row['did']);
		if(device != null) {
			pos = device.getVehiIdno();
		}else {
			pos = row['did'];
		}
	}else if(name == 'taskTag') {
		pos = row['lab'];
	}else if(name == 'videoType') {
		if(row['vtp'] == 0) {
			pos = parent.lang.file_normal;
		}else {
			pos = parent.lang.monitor_vehiStatusAlarm;
		}
	}else if(name == 'downloadType') {
		if(row['dtp'] == 1) {
			pos = parent.lang.fileDownload;
		}else {
			pos = parent.lang.segmentDownload;
		}
	}else if(name == 'vehiChn') {
		if(row['chn'] != null) {
			pos = 'CH'+ (Number(row['chn']) + 1);
		}
	}else if(name == 'fileSize') {
		pos = (row['len']/1024/1024).toFixed(2) + 'MB';
	}else if(name == 'status') {
		if(row['stu'] == 1) {
			pos = parent.lang.noDownload;
		}else if(row['stu'] == 2) {
			pos = parent.lang.downloading;
		}else if(row['stu'] == 3) {
			pos = parent.lang.downloadFail;
		}else if(row['stu'] == 4) {
			pos = parent.lang.downloaded;
		}
	}else if(name == 'fileSrc'){
		if(row['dph']) {
			pos = row['dph'];
		}
	}else if(name == 'submitTime'){
		if(row['ctm'] != null && row['ctm'] != '') {
			pos = dateTime2TimeString(row['ctm']);
		}
	}else if(name == 'fileStartTime'){
		if(row['fbtm'] != null && row['fbtm'] != '') {
			pos = dateTime2TimeString(row['fbtm']);
		}
	}else if(name == 'fileEndTime'){
		if(row['fetm'] != null && row['fetm'] != '') {
			pos = dateTime2TimeString(row['fetm']);
		}
	}else if(name == 'downloadStartTime'){
		if(row['dbtm'] != null && row['dbtm'] != '') {
			pos = dateTime2TimeString(row['dbtm']);
		}
	}else if(name == 'downloadEndTime'){
		if(row['detm'] != null && row['detm'] != '') {
			pos = dateTime2TimeString(row['detm']);
		}
	}else if(name == 'operator') {
		if(row['stu'] != 4) {
			var tip = '';
			if(row['stu'] == 1) {
				tip = parent.lang.noDownload;
			}else if(row['stu'] == 2) {
				tip = parent.lang.downloading;
			}else if(row['stu'] == 3) {
				tip = parent.lang.downloadFail;
			}
			pos = '<a class="not-downLoad" title="'+tip+'"></a>';
			pos += '<a class="not-playback" title="'+tip+'"></a>';
		}else {
			pos = '<a class="downLoad" onclick="downloadVideoFile('+row['id']+');" title="'+parent.lang.download+'"></a>';
			pos += '<a class="playback" onclick="videoFileReplay(this,'+row['id']+');" title="'+parent.lang.video_playback+'"></a>';
		}
		return pos;
	}else {
		pos = changeNull(row[name]);
	}
	return getColumnTitle(pos);
}

//下载文件
function downloadVideoFile(id) {
	var file = downloadFileList.get(Number(id));
	if(file != null) {
		file.loc = 4;
		file.devIdno = file.did;
		file.vehiIdno = file.vid;
		file.file = file.dph;
		
		W.videoPlayer.doDownloadVehicleServer(file);
	}
}

//录像回放
function videoFileReplay(obj, id) {
	var file = downloadFileList.get(Number(id));
	if(file != null) {
		file.loc = 2;
		file.devIdno = file.did;
		file.vehiIdno = file.vid;
		file.file = file.dph;
//		file.file = 'D:/gStorage/RECORD_FILE/1234/2015-10-17/XXXXXXXX-151017-114600-114600-20010300.grec';
		
		file.yearMonthDay = dateTime2DateString(file.fbtm);
		file.beg = (file.fbtm - dateStrDate2Date(file.yearMonthDay).getTime())/1000;
		file.end = (file.fetm - dateStrDate2Date(file.yearMonthDay).getTime())/1000;
		file.beginDate = dateTime2TimeString(file.fbtm);
		file.endDate = dateTime2TimeString(file.fetm);
//		file.beginDate = "2015-10-17 10:58:59";
//		file.endDate = "2015-10-18 12:58:59";
		
		if(Number(file.beginDate.substring(8, 10)) == Number(file.endDate.substring(8, 10))) {
			file.timeTitle = file.beginDate + ' - ' + W.videoPlayer.videoTimeTable.second2ShortHourEx(file.end);
		}else {
			file.timeTitle = file.beginDate +' - '+ file.endDate;
		}
		
		//获取视频文件播放的服务器信息,成功后回放视频文件信息
		var title = file.vid +' - '+ 'CH'+ (Number(file.chn) + 1) +' - '+ file.timeTitle;
		W.videoPlayer.doReplayVehicleServer(file, 0, 0, title);
	}
}

//弹出车辆选择菜单类对象
var selVehiInfo = null;

//点击更多弹出车辆选择
function queryMoreVehicle() {
	if(selVehiInfo == null) {
		selVehiInfo = $.dialog({id:'vehiInfo', title: parent.lang.btnSelectVehicle, content: 'url:VideoManagement/selectVehicle.html',
			width: '400px', height: '630px', min:true, max:false, lock: true,fixed:false, parent: api
				, resize:false, close: function() {
					selVehiInfo = null;
				} });
	}else {
		selVehiInfo.lock().show().zindex();
	}
}

//选择车辆成功
function doSelectVehicleSuc(vehiIdno) {
	$('#combox-vehiIdnos').val(vehiIdno);
	$('#hidden-vehiIdnos').val(vehiIdno);
	selVehiInfo.hide();
//	$.dialog({id:'vehiInfo'}).close();
}