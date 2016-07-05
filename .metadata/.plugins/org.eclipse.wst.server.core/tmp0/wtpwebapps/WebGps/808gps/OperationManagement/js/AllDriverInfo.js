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
	$('#toolbar-search').flexPanel({
		SerachBarModel :
			{display: parent.lang.driver_name+'/'+parent.lang.company_name, name : 'myDriver', pfloat : 'left'}
	});
	var mod = [[{
		display: parent.lang.show_all_drivers, name : '', pclass : 'btnAllDriver',bgcolor : 'gray', hide : false
	}],[{
		display: parent.lang.add, name : '', pclass : 'btnAddDriver',bgcolor : 'gray', hide : false
	}]];
	$('#toolbar-btn').flexPanel({
		ButtonsModel : mod
	});

	$('#driverInfoTable').flexigrid({
		url: 'StandardDriverAction_loadDrivers.action?type=1',
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.job_number, name : 'jobNum', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.person_name, name : 'name', width : 80, sortable : false, align: 'center', hide: false},
			{display: parent.lang.sex, name : 'sex', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.contact_details, name : 'contact', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.validity_of_drivers_license, name : 'validity', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.belong_company, name : 'company', width : 50, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 150, sortable : false, align: 'center'}
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
//			checkbox: true,
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		usepager: true,
		autoload: true,
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
	$('#toolbar-search .y-btn').on('click',function(){
		loadQuery(1);
	});
	$('#toolbar-search .search-input').on('keydown',function(e){
		if(e.keyCode == 13) {
			var name = $(this).val();
			loadQuery(2);
		}
	});
	$('.btnAllDriver','#toolbar-btn').on('click',function(){
		loadQuery(3);
	});
	$('.btnAddDriver','#toolbar-btn').on('click',function(){
		$.dialog({id:'driverinfo', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.driver_information,content: 'url:OperationManagement/DriverInfo.html?type=add',
				width:'975px',height:'400px', min:false, max:false, lock:true});
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
	$('#driverInfoTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'company') {
		pos = row[name].name;
	}else if(name == 'sex') {
		if(row[name] == 1) {
			pos = parent.lang.man;
		}else if(row[name] == 2) {
			pos = parent.lang.woman;
		}
	}else if(name == 'validity') {
		pos = dateFormat2TimeString(new Date(row[name]));
	}else if(name == 'operator'){
		pos = '<a class="detail" href="javascript:findDriverInfo('+row['id']+');" title="'+ parent.lang.detailed +'"></a>';
		pos += '<a class="edit" href="javascript:editDriverInfo('+row['id']+');" title="'+ parent.lang.edit +'"></a>';
		pos += '<a class="delete" href="javascript:delDriverInfo('+row['id']+');" title="'+ parent.lang.del +'"></a>';
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function findDriverInfo(id) {
	$.dialog({id:'driverinfo', title:parent.lang.view+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.driver_information,content: 'url:OperationManagement/DriverInfo.html?id='+id+'&type=',
	width:'975px',height:'250px', min:false, max:false, lock:true});
}
function editDriverInfo(id) {
	$.dialog({id:'driverinfo', title:parent.lang.edit+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.driver_information,content: 'url:OperationManagement/DriverInfo.html?id='+id+'&type=edit',
		width:'975px',height:'400px', min:false, max:false, lock:true});
}
function delDriverInfo(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet('StandardDriverAction_deleteDriver.action?id=' + id, function(json,action,success){
		$.myajax.showLoading(false);
		if(success){
			$('#driverInfoTable').flexOptions().flexReload();
		}
	}, null);
}

function doSaveDriverSuc() {
	$('#driverInfoTable').flexOptions().flexReload();
	$.dialog({id:'driverinfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}
