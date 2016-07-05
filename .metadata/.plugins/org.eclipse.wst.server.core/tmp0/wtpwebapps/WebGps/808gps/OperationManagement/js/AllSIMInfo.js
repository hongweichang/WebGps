$(document).ready(function(){
	setTimeout(loadReadyPage, 50);
});

var sid;
var companys = [];

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}
function loadPage(){
	$('#toolbar-combo-status').flexPanel({
		ComBoboxModel :{
			button :[ [{display: parent.lang.select_status,width:'80px',value:'',name : 'status', pid : 'status', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden:true}] ],
			combox: 
				{name : 'status', option : '2&'+parent.lang.all+'|1&'+parent.lang.enabled+'|0&'+parent.lang.not_enabled+''}
		}	
	});
	$('#toolbar-combo-install').flexPanel({
		ComBoboxModel :{
			button :[ [{display: parent.lang.SIM_install,width:'80px',value:'',name : 'install', pid : 'install', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden:true}] ],
			combox: 
				{name : 'install', option : '2&'+parent.lang.all+'|1&'+parent.lang.installed+'|0&'+parent.lang.unInstall+''}
		}	
	});
	$('#toolbar-search').flexPanel({
		SerachBarModel :
			{display: parent.lang.SIM_card_number, name : 'SIMID', pfloat : 'left'}
	});
	var mod = [[{
		display: parent.lang.show_all_SIM_card, name : '', pclass : 'btnAllSIM',bgcolor : 'gray', hide : false
	}],[{
		display: parent.lang.add, name : '', pclass : 'btnAddSIM',bgcolor : 'gray', hide : false
	}]];
	$('#toolbar-btn').flexPanel({
		ButtonsModel : mod
	});
	companys = parent.companys
	sid = 0;
	for(var i = 0; i < companys.length; i++) {
		if(companys[i].id == parent.companyId) {
			sid = companys[i].parentId;
		}
	}
	addCompanyTree(companys, sid);

	$('#simInfoTable').flexigrid({
		url: 'StandardSIMCardInfoAction_loadSIMInfos.action?type=1',
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.SIM_card_number, name : 'cardNum', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.status, name : 'status', width : 80, sortable : false, align: 'center', hide: false},
			{display: parent.lang.registration_time, name : 'registrationTime', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.SIM_install, name : 'install', width : 60, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 150, sortable : false, align: 'center'}
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
//				checkbox: true,
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
			loadQuery(2);
		}
	});
	$('.btnAllSIM','#toolbar-btn').on('click',function(){
		loadQuery(3);
	});
	$('.btnAddSIM','#toolbar-btn').on('click',function(){
		$.dialog({id:'siminfo', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.SIM_card_information,content: 'url:OperationManagement/SIMInfo.html?type=add',
				width:'975px',height:'300px', min:false, max:false, lock:true});
	});
}

function loadQuery(type) {
	var num = '';
	var status = '';
	var install = '';
	if(type == '1' || type == '2') {
		num = $('#toolbar-search .search-input').val();
		status = $('#toolbar-combo-status #hidden-status').val();
		install = $('#toolbar-combo-install #hidden-install').val();
	}
	
	var params = [];
	params.push({
		name: 'num',
		value: num
	});
	params.push({
		name: 'status',
		value: status
	});
	params.push({
		name: 'install',
		value: install
	});
	params.push({
		name: 'companyId',
		value: $('.td-company #hidden-company').val()
	});
	$('#simInfoTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'company') {
		if(row[name].level == 2 || row[name].level == 3) {
			var company_ = getParentCompany(parent.vehiGroupList,row[name].parentId);
			if(company_) {
				pos = company_.name;
			}
		}else {
			pos = row[name].name;
		}
	}else if(name == 'status') {
		if(row[name] == 1) {
			pos = parent.lang.enabled;
		}else {
			pos = parent.lang.not_enabled;
		}
	}else if(name == 'registrationTime') {
		pos = dateFormat2TimeString(new Date(row[name]));
	}else if(name == 'operator'){
		pos = '<a class="detail" href="javascript:findSIMInfo('+row['id']+');" title="'+ parent.lang.detailed +'"></a>';
		pos += '<a class="edit" href="javascript:editSIMInfo('+row['id']+');" title="'+ parent.lang.edit +'"></a>';
		if(row['install'] == 1) {
			pos += '<a class="not-delete" href="javascript:;" title="'+parent.lang.installed+'"></a>';
		}else {
			pos += '<a class="delete" href="javascript:delSIMInfo('+row['id']+');" title="'+ parent.lang.del +'"></a>';
		}
	}else if(name == 'install') {
		if(row[name] == 1) {
			pos = parent.lang.installed;
		}else {
			pos = parent.lang.unInstall;
		}
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function findSIMInfo(id) {
	$.dialog({id:'siminfo', title:parent.lang.view+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.SIM_card_information,content: 'url:OperationManagement/SIMInfo.html?id='+id+'&type=',
	width:'975px',height:'300px', min:false, max:false, lock:true});
}
function editSIMInfo(id) {
	$.dialog({id:'siminfo', title:parent.lang.edit+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.SIM_card_information,content: 'url:OperationManagement/SIMInfo.html?id='+id+'&type=edit',
		width:'975px',height:'300px', min:false, max:false, lock:true});
}
function delSIMInfo(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet('StandardSIMCardInfoAction_deleteSIMInfo.action?id=' + id, function(json,action,success){
		$.myajax.showLoading(false);
		if(success){
			$('#simInfoTable').flexOptions().flexReload();
		}
	}, null);
}

function doSaveSIMInfoSuc() {
	$('#simInfoTable').flexOptions().flexReload();
	$.dialog({id:'siminfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

/**
 * 公司树双击事件
 */
function companyDblClickEvent() {
	var selId = companyTree.getSelectedItemId();
	if(selId != '*_0' && selId != '*_'+sid) {
		var id =selId.split('_')[1];
		$('#company_tree').hide();
		$('.td-company #combox-company').val(getArrayName(companys,id));
		$('.td-company #hidden-company').val(id);
		$('.td-company .span-tip').text('*');
	}else {
		$('.td-company #combox-company').val(parent.lang.all_companies);
		$('.td-company #hidden-company').val('');
		$('#company_tree').hide();
	}
	loadQuery();
}
