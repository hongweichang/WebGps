var plateTypes = [];
var begin = "";
var end = "";
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
	
	$('#selecttime').flexPanel({
		ComBoboxModel :{
			input : {name : 'selecttime',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			combox: 
				{name : 'selecttime', option : arrayToStr(getSelectTime())}
		}	
	});
	
	$('#select-selecttime li').each(function() {
		var index= $(this).attr('data-index');
		$(this).on('click',function() {
			if(index == 0){
				begin = '';
				end = '';
			}else if(index == 1){
				begin = dateCurrentDateString();
				end = dateWeekAfterDateString();
			}else if(index == 2){
				begin = dateCurrentDateString();
				end = dateMonthAfterDateString();
			}
		});
		if(index == 0) {
			$(this).click();
		}
	});
	
	$('#toolbar-search').flexPanel({
		SerachBarModel :
			{display: parent.lang.plate_number, name : 'devIdno', pfloat : 'left'}
	});
	
	$('#maturityInfoTable').flexigrid({
		url: 'StandardVehicleAction_loadVehicleMaturitys.action',
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.plate_number, name : 'vehiIDNO', width : 80, sortable : false, align: 'center', hide: false},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.license_plate_type, name : 'plateType', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.vehi_safe_end, name : 'safe', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.driving_end_date, name : 'driving', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.operating_end_date, name : 'operating', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.vehi_service_end, name : 'service', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.maturity_status, name : 'status', width : 300, sortable : false, align: 'center'}
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
		autoload: false,
		//checkbox:checkbox,
		useRp: true,
		title: false,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: false,
		width: 'auto',
		onSubmit: false,
		height: 'auto'
	});
	loadReportTableWidth();
	$("#labelSelecttime").text(parent.lang.maturity_date);
	loadQuery();
	$('#toolbar-search .y-btn').on('click',function(){
		loadQuery();
	});
	$('#toolbar-search .search-input').on('keydown',function(e){
		if(e.keyCode == 13) {
			loadQuery();
		}
	});
}

function getSelectTime() {
	var distances = [];
	distances.push({id:0,name:parent.lang.no_maturity});
	distances.push({id:1,name:parent.lang.seven_maturity});
	distances.push({id:2,name:parent.lang.month_maturity});
	return distances;
}

function loadQuery() {
	var name = $.trim($('#toolbar-search .search-input').val());
	var params = [];
	params.push({
		name: 'name',
		value: name
	});
	params.push({
		name: 'begin',
		value: begin
	});
	params.push({
		name: 'end',
		value: end
	});
	$('#maturityInfoTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'company') {
		if(row[name].level == 2) {
			pos = getParentCompany(parent.vehiGroupList,row[name].companyId).name;
		}else {
			pos = getParentCompany(parent.vehiGroupList,row[name].id).name;
		}
	}else if(name == 'plateType') {
		pos = getArrayName(plateTypes, row[name]);
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

function doExit() {
	$.dialog({id:'info'}).close();
}
