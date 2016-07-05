var api = frameElement.api, W = api.opener;
var vehiIdno = decodeURIComponent(getUrlParameter('vehiIdno'));//车牌号
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
	
	$('#labelBeginTime').text(parent.lang.labelBegintime);
	$('#labelEndTime').text(parent.lang.labelEndtime);
	$('#labelStatus').text(parent.lang.monitor_task_status_label);
	$('#labelTaskTag').text(parent.lang.labelDownloadTaskTag);
	
	$('#select-status').flexPanel({
		ComBoboxModel :{
			button :
			[
				[{
					display: parent.lang.all, name : 'status', pid : 'status', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
				}]
			],
			combox: {name : 'status', option : '99&'+parent.lang.all+'|0&'+parent.lang.unfinished+'|1&'+parent.lang.success+'|2&'+parent.lang.failure}
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
	
	//添加新增和删除按钮
	var buttons = [];
	var btn = {};
	btn.separator = false; //分隔器
	btn.hidename = "";
	btn.name = parent.lang.add;
	btn.bclass = "flexAdd";
	btn.bimage = "";
	btn.tooltip = parent.lang.add;
	btn.onpress = addWifiDownloadTask;//新增事件
	btn.id = "add";
	buttons.push(btn);
	
	btn = {};
	btn.separator = true; //分隔器
	buttons.push(btn);
	
	btn = {};
	btn.separator = false; //分隔器
	btn.hidename = "";
	btn.name = parent.lang.batch_deletion;
	btn.bclass = "flexDelete";
	btn.bimage = "";
	btn.tooltip = parent.lang.batch_deletion;
	btn.onpress = batchDelWifiDownloadTask; //批量删除事件
	btn.id = "delete";
	buttons.push(btn);
	
	$('#wifiDownloadTaskTable').flexigrid({
		url: 'StandardDownTaskAction_getWifiDownTaskList.action',
		dataType: 'json',
		colModel : [
		    {display: parent.lang.operator, name : 'operator', width : 50, sortable : false, align: 'center'},
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.report_vehiIdno, name : 'vehiIdno', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.rule_downType, name : 'downType', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.begintime, name : 'beginTime', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.endtime, name : 'endTime', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.status, name : 'status', width : 80, sortable : false, align: 'center', hide: false},
			{display: parent.lang.downloadTaskTag, name : 'taskTag', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.remark, name : 'remark', width : 200, sortable : false, align: 'center', hide: false},
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
		checkbox: true,
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		buttons: buttons,
		usepager: true,
		autoload: false,
		useRp: true,
		title: false,
		params: false,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: true,
		width: 'auto',
		onSubmit: false,
		onSuccess: false,
		height: 'auto'
	});
	
	loadReportTableWidth(fixHeight);
	
	cleanSpelChar('#combox-taskTag');
	
	$('.btnQuery','#toolbar-btn').on('click',function(){
		loadQuery();
	});
	
	//
	initPageInfo(vehiIdno);
}

function fixHeight() {
	$('#wifiDownloadTaskTable').flexFixHeight();
}

//刷新页面数据
function initPageInfo(vehiIdno_) {
	vehiIdno = vehiIdno_;
	//搜索时间
	var begintime = dateCurDateBeginString();
	var endtime = dateCurDateEndString();
	$("#begintime").val(begintime);
	$("#endtime").val(endtime);
	$("#begintime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}) });
	$("#endtime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}) });
	
	$('#label-status').text(parent.lang.all);
	$('#hidden-status').val(99);
	
	$('#combox-taskTag').val('');
	
	loadQuery();
}

//查询数据
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
		name: 'vehiIdno',
		value: vehiIdno
	});
	params.push({
		name: 'label',
		value: taskTag
	});
	$('#wifiDownloadTaskTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function getColumnTitle(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'vehiIdno') {
		if(row['vid']) {
			pos = row['vid'];
		}
	}else if(name == 'taskTag') {
		if(row['lab']) {
			pos = row['lab'];
		}
	}else if(name == 'downType') {
		if(row['typ'] == 1) {
			pos = parent.lang.all;
		}else if(row['typ'] == 2) {
			pos = parent.lang.rule_video;
		}else if(row['typ'] == 3) {
			pos = parent.lang.rule_picture;
		}else if(row['typ'] == 4) {
			pos = parent.lang.rule_alarmVideo;
		}else if(row['typ'] == 5) {
			pos = parent.lang.rule_alarmPicture;
		}
	}else if(name == 'remark') {
		if(row['mak']) {
			pos = row['mak'];
		}
	}else if(name == 'status') {
		if(row['stu'] == 0) {
			pos = parent.lang.unfinished;
		}else if(row['stu'] == 1) {
			pos = parent.lang.success;
		}else if(row['stu'] == 2) {
			pos = parent.lang.failure;
		}
	}else if(name == 'beginTime'){
		if(row['btm'] != null && row['btm'] != '') {
			pos = dateTime2TimeString(row['btm']);
		}
	}else if(name == 'endTime'){
		if(row['etm'] != null && row['etm'] != '') {
			pos = dateTime2TimeString(row['etm']);
		}
	}else if(name == 'operator') {
		pos = '<a class="delete" onclick="delWifiDownloadTask('+row['id']+');" title="'+parent.lang.del+'"></a>';
		return pos;
	}else {
		pos = changeNull(row[name]);
	}
	return getColumnTitle(pos);
}

//新增成功后调用
function doAddSuccess() {
	$.dialog.tips(parent.lang.saveok, 1);
	$.dialog({id:'downTask'}).close();
	$('#wifiDownloadTaskTable').flexOptions().flexReload();
}

//新增WIFi下载任务
function addWifiDownloadTask() {
	$.dialog({id:'downTask', title:parent.lang.add +'&nbsp&nbsp&nbsp&nbsp'+parent.lang.wifi_download_task_settings ,content: 'url:LocationManagement/wifiDownTaskInfo.html?vehiIdno='+encodeURI(vehiIdno),
		width:'450px',height:'330px', min:false, max:false, lock:true, parent: api});
}

//删除报警联动信息
//ids 以,分割
function commentDelTask(ids) {
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet('StandardDownTaskAction_deleteWifiDownTask.action?id=' + ids, function(json,action,success){
		$.myajax.showLoading(false);
		if(success){
			$('#wifiDownloadTaskTable').flexOptions().flexReload();
		}
	}, null);
}

//批量删除WIFi下载任务
function batchDelWifiDownloadTask() {
	var ids = $('#wifiDownloadTaskTable').selectedCheckedRows();
	if(ids.length == 0) {
		$.dialog.tips(parent.lang.errSelectedRequired, 1);
		return;
	}
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	commentDelTask(ids.toString());
}

//删除WIFi下载任务
function delWifiDownloadTask(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	commentDelTask(id.toString());
}