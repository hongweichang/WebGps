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
	$('.btnRefresh').on('click', ajaxLoadTpmsInfo);
	//退出
	$('.btnExit').on('click', function() {
		W.monitorMenu.tpmsInfoObj = null;
		W.$.dialog({id:'tpmsInfo'}).close();
	});
	
	$('.td-vehiIdno').text(vehiIdno);
	$('.td-devIdno').text(devIdno);
	
	//加载设备信息
	ajaxLoadTpmsInfo();
}

//加载页面控件
function loadPageTableTools() {
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'requiredInfo',tip: '',hide:false,tabshide: false, headhide: false},
				colgroup:{width:['120px','200px','120px','200px']},
				tabs:{
					display: [parent.lang.plate_number, parent.lang.device_number],
					name : ['vehiIdno', 'devIdno'],
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
			{display: parent.lang.tpmsName, name : 'tpmsName', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.current_voltage + "(V)", name : 'voltage', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.the_current_tire_pressure + "(P)", name : 'pressure', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.current_temperature + "(" + parent.lang.alarm_temperator_unit + ")", name : 'temperature', width : 100, sortable : false, align: 'center', hide: false}
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
		height: 317
	});
	$("#recordStatusTable").flexSetFillCellFun(fillRecordStatusTable);
}

//填充TPMS状态列表
function fillRecordStatusTable(p, row, idx, index){
	var name = p.colModel[idx].name;
	var ret = "";
	if(name == 'index') {
		ret = row.index;
	}else if(name == 'tpmsName') {
		ret = row.tpmsName;
	}else if(name == 'voltage') {
		ret = row.voltage;
	}else if(name == 'pressure') {
		ret = row.pressure;
	}else if(name == 'temperature') {
		ret = row.temperature;
	}
	return getColumnTitle(ret);
}

function getColumnTitle(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

//加载TPMS状态
function loadTpmsInfo(devstaus) {
	var tpmsStatus = [];
	var tirepressure = devstaus.tirepressure;
	var status = tirepressure.split(",");
	if(status[0] && Number(status[0]) > 0) {
		for (var i = 0; i < Number(status[0]); i++) {
			var tpms = {};
			tpms.index = i+1;
			if(i < Number(status[0])/2){
				tpms.tpmsName = parent.lang.left + Number(i+1) ;
				tpms.voltage = Number(status[i*3+1]/10.0);
				tpms.pressure = Number(status[i*3+2]/10.0);
				tpms.temperature = Number(status[i*3+3]/10.0);
			}else{
				tpms.tpmsName = parent.lang.right + Number(i+1-Number(status[0])/2);
				tpms.voltage = Number(status[(i-Number(status[0])/2+10)*3+1]/10.0);
				tpms.pressure = Number(status[(i-Number(status[0])/2+10)*3+2]/10.0);
				tpms.temperature = Number(status[(i-Number(status[0])/2+10)*3+3]/10.0);
			}
			tpmsStatus.push(tpms);
		}
	}
	$('#recordStatusTable').flexAppendRowJson(tpmsStatus, false);
}

//加载设备信息信息
function ajaxLoadTpmsInfo() {
	if(ajaxObject != null) {
		ajaxObject.abort();
	}
	$('#recordStatusTable').flexClear();
	var device = parent.vehicleManager.getDevice(devIdno);
	if(device == null || !device.isOnline()) {
		$.dialog.tips(parent.lang.video_not_online, 1);
		return;
	}
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	$.myajax.jsonGet('StandardDeviceAction_getTpmsStatus.action?devIdno='+devIdno, function(json,action,success){
		if(success) {
			if(json.tpmsStatus){
				loadTpmsInfo(json.tpmsStatus);
			}
			$.myajax.showLoading(false);
        	disableForm(false);
		};	
	}, null);
}

function initTpmsInfo() {
	$('#info-mid-table td').each(function() {
		$(this).empty();
	});
}

//加载页面信息
function initPageInfo(vehiIdno_, devIdno_) {
	vehiIdno = vehiIdno_;
	devIdno = devIdno_;
	//初始化页面数据
	initTpmsInfo();
	$('.td-vehiIdno').text(vehiIdno);
	$('.td-devIdno').text(devIdno);
	ajaxLoadTpmsInfo();
}