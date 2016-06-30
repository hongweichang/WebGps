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
	var mod = [[{
		display: parent.lang.show_all_roles, name : '', pclass : 'btnAllRole',bgcolor : 'gray', hide : false
	}],[{
		display: parent.lang.add, name : '', pclass : 'btnAddRole',bgcolor : 'gray', hide : false
	}]];
	
	$('#toolbar-search').flexPanel({
		SerachBarModel :
			{display: parent.lang.role_name+'/'+parent.lang.company_name, name : 'device', pfloat : 'left'}
	});
	$('#toolbar-btn').flexPanel({
		ButtonsModel : mod
	});

	$('#roleInfoTable').flexigrid({
		url: 'StandardRoleAction_loadRoles.action?type=1',
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.name, name : 'name', width : 80, sortable : false, align: 'center', hide: false},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 150, sortable : false, align: 'center'}
			],
	//searchitems : [
	//	{display: 'sdsdsa', name : 'index', isdefault: true},
	//	{display: 'dsasd', name : 'sim'}
	//	],
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
			loadQuery(2);
		}
	});
	$('.btnAllRole','#toolbar-btn').on('click',function(){
		loadQuery(3);
	});
	$('.btnAddRole','#toolbar-btn').on('click',function(){
		$.dialog({id:'roleinfo', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.rights_information,content: 'url:OperationManagement/RoleInfo.html?type=add',
				width:'975px',height:'600px', min:false, max:false, lock:true});
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
	$('#roleInfoTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'company') {
		pos = row[name].name;
	}else if(name == 'operator'){
		pos += '<a class="detail" href="javascript:findRoleInfo('+row['id']+');" title="'+ parent.lang.detailed +'"></a>';
		pos += '<a class="edit" href="javascript:editRoleInfo('+row['id']+');" title="'+ parent.lang.edit +'"></a>';
		pos += '<a class="delete" href="javascript:delRoleInfo('+row['id']+');" title="'+ parent.lang.del +'"></a>';
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}
function findRoleInfo(id) {
	$.dialog({id:'roleinfo', title:parent.lang.view+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.rights_information,content: 'url:OperationManagement/RoleInfo.html?id='+id+'&type=',
	width:'975px',height:'600px', min:false, max:false, lock:true});
}
function editRoleInfo(id) {
	$.dialog({id:'roleinfo', title:parent.lang.edit+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.rights_information,content: 'url:OperationManagement/RoleInfo.html?id='+id+'&type=edit',
		width:'975px',height:'600px', min:false, max:false, lock:true});
}
function delRoleInfo(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet('StandardRoleAction_deleteUserRole.action?id=' + id, function(json,action,success){
		$.myajax.showLoading(false);
		if(success){
			$('#roleInfoTable').flexOptions().flexReload();
		}
	}, null);
}
//快速分配权限
function quickUserRole(rid,uids) {
	$.dialog({id:'quickUserRole', title:'快速分配权限',content: 'url:OperationManagement/QuickUserRole.html?rid='+rid+'&uids='+uids,
		width:'975px',height:'600px', min:false, max:false, lock:true});
}
function doSaveRoleSuc(data) {
	$('#roleInfoTable').flexOptions().flexReload();
}
