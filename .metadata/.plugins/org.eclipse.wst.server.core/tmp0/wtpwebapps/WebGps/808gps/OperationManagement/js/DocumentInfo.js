var plateTypes = [];
var vehiStatus = [];
var intervalProcess = null;
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
	//初始化车牌类型
	initPlateTypes();
	initVehiStatus();
	
	$('#toolbar-combo-status').flexPanel({
		ComBoboxModel :{
			button :
			[
				[{
					display: parent.lang.select_status, name : 'status', pid : 'status', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
				}]
			],
		//	input : {display: '选择状态',width:'60px',value:'',name : 'useType', pid : 'useType', pclass : 'buttom',bgicon : 'true', hide : false},
			combox: {name : 'status', option : arrayToStr(vehiStatus)}
		}	
	});
	
	$('#toolbar-search').flexPanel({
		SerachBarModel :
			{display: parent.lang.plate_number+'/'+parent.lang.device_number, name : 'devIdno', pfloat : 'left'}
	});
	var mod = [];
	if(!parent.myUserRole.isAdmin() && !parent.myUserRole.isFirstCompany()){
		mod = [[{
			display: parent.lang.application_management, name : '', pclass : 'applyManage',bgcolor : 'gray', hide : false
		}]];
	}
	if(parent.myUserRole.isAdmin() || parent.myUserRole.isFirstCompany() || parent.myUserRole.isSecondCompany() || parent.myUserRole.isThreeCompany()){
		mod.push([{
			display: parent.lang.document_management, name : '', pclass : 'receiptManage',bgcolor : 'gray', hide : false
		}]);
	}

	$('#toolbar-btn').flexPanel({
		ButtonsModel : mod
	});
	
	/*var checkbox = false;
	if(parent.myUserRole.isAdmin() || parent.myUserRole.isAllowManage()) {
		checkbox = true;
	}*/
	var width = 0;
	if(parent.screenWidth < 1280) {
		width = 980;
	}else {
		width = 'auto';
	}
	$('#vehicleInfoTable').flexigrid({
		url: 'StandardVehicleAction_loadSendVehicles.action',
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.plate_number, name : 'vehiIDNO', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.license_plate_type, name : 'plateType', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.status, name : 'vehiStatus', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.online_enstime, name : 'lastOnlineTime', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.report_positionCurrent, name : 'position', width : 250, sortable : false, align: 'center'}
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
		usepager: true,
		autoload: true,
		//checkbox:checkbox,
		useRp: true,
		title: false,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: false,
		width: width,
		onSubmit: false,
		height: 'auto'
	});
	loadReportTableWidth();
	$('#toolbar-search .y-btn').on('click',function(){
		loadQuery(1);
	});
	$('#toolbar-search .search-input').on('keydown',function(e){
		if(e.keyCode == 13) {
			loadQuery(2);
		}
	});
	if(!intervalProcess){
		intervalProcess = setInterval( "loadQuery(1)" , 10000 );
	}
	$('.applyManage span').css('width','auto');
	$('.receiptManage span').css('width','auto');
	$('.applyManage').on('click',function(){
		$.dialog({id:'documentinfo', title:parent.lang.application_management,content: 'url:OperationManagement/AllDocumentInfo.html',
			width:'975px',height:'600px', min:false, max:false, lock:true});
	});
	$('.receiptManage').on('click',function(){
		$.dialog({id:'receiptinfo', title:parent.lang.document_management,content: 'url:OperationManagement/AllReceiptInfo.html',
			width:'1025px',height:'600px', min:false, max:false, lock:true});
	});
}

function loadQuery(type) {
	var name = '';
	if(type == '1' || type == '2') {
		name = $('#toolbar-search .search-input').val();
	}
	
	var params = [];
	params.push({
		name: 'name',
		value: name
	});
	params.push({
		name: 'status',
		value: $('#toolbar-combo-status #hidden-status').val()
	});
	var toMap = 2;  //百度地图
	if(!parent.langIsChinese()) {
		toMap = 1; //谷歌地图
	}
	params.push({
		name: 'toMap',
		value: toMap
	});
	$('#vehicleInfoTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'company') {
		pos = getParentCompany(parent.vehiGroupList,row['cid']).name;
	}else if(name == 'vehiIDNO') {
		pos = row['vid'];
	}else if(name == 'vehiStatus') {
		var stu = getArrayName(vehiStatus, row['stu']);
		if(stu != null && stu != '') {
			stu += ',';
		}
		if(row['ol'] != null && row['ol'] == 1) {
			stu += parent.lang.online;
			pos += '<span class="blue" title="'+stu+'">'+ stu +'</a>';
		}else {
			stu += parent.lang.offline;
			pos += '<span title="'+stu+'">'+ stu +'</a>';
		}
	}else if(name == 'lastOnlineTime') {
		if(row['tm']){
			pos = dateTime2DateString(row['tm']);
		}
	}else if(name == 'plateType') {
		pos = getArrayName(plateTypes, row['ptp']);
	}else if (name == 'position') {
		pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + row['vid'] + "', '" + row['jingDu'] + "', '" + row['weiDu'] + "');\">" + changeNull(row[name]) + "</a>";
	}else if(name == 'vehiColor') {
		if(row['cor']){
			pos = row['cor'];
		}
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

//初始化车牌类型
function initPlateTypes() {
	plateTypes.push({id:1,name: parent.lang.blue_label});
	plateTypes.push({id:2,name: parent.lang.yellow_label});
	plateTypes.push({id:3,name: parent.lang.black_label});
	plateTypes.push({id:4,name: parent.lang.white_label});
	plateTypes.push({id:0,name: parent.lang.other});
}

//初始化车辆状态
function initVehiStatus() {
	vehiStatus.push({id:0,name: parent.lang.all});
	vehiStatus.push({id:1,name: parent.lang.load});
	vehiStatus.push({id:2,name: parent.lang.half_load});
	vehiStatus.push({id:3,name: parent.lang.loaded});
	vehiStatus.push({id:4,name: parent.lang.confirm});
	vehiStatus.push({id:5,name: parent.lang.malfunction});
}

function doExit() {
	$.dialog({id:'documentinfo'}).close();
}

function showMapPosition(name, jingDu, weiDu) {
	var url = "";
	if (parent.langIsChinese()) {
		url = 'url:'+getRootPath()+'/map/map_position_baidu.html?toMap=2&isSystem=808gps&name=';
//		url = 'url:report/map_position_cn.html?name=';
	} else {
		url = 'url:'+getRootPath()+'/map/map_position.html?toMap=1&isSystem=808gps&name=';
	}
	
	$.dialog({id:'mapposition', title:parent.lang.report_show_position,content:url + encodeURI(name) + '&jingDu=' + jingDu + '&weiDu=' + weiDu
		, min:false, max:false, lock:true});
}
