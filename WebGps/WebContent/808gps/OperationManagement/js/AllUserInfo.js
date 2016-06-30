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
	$('#onlineClientTip').text(parent.lang.clientOnlineCount);
	getOnlineClientCount();

	var mod = [[{
		display: parent.lang.show_all_users, name : '', pclass : 'btnAllUser',bgcolor : 'gray', hide : false
	}],[{
		display: parent.lang.showClientOnline, name : '', pclass : 'btnOnlineClient',bgcolor : 'gray', hide : false
	}],[{
		display: parent.lang.add, name : '', pclass : 'btnAddUser',bgcolor : 'gray', hide : false
	}]];
	$('#toolbar-search').flexPanel({
		SerachBarModel :
			{display: parent.lang.login_account+'/'+parent.lang.company_name, name : 'myUser', pfloat : 'left'}
	});
	$('#toolbar-btn').flexPanel({
		ButtonsModel : mod
	});

	$('#userInfoTable').flexigrid({
		url: 'StandardUserAction_loadUsers.action?type=1',
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.login_account, name : 'account', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.person_name, name : 'name', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.update_time, name : 'updateTime', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.status, name : 'status', width : 60, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 300, sortable : false, align: 'center'}
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
	
	$('.btnAllUser','#toolbar-btn').on('click',function(){
		loadQuery(3);
	});
	
	$('.btnOnlineClient','#toolbar-btn').on('click',function(){
		$.dialog({id:'online', title:parent.lang.view+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.showClientOnline,content: 'url:OperationManagement/Status.html?type=client',
				width:'975px',height:'500px', min:false, max:false, lock:true});
	});
	
	$('.btnAddUser','#toolbar-btn').on('click',function(){
		$.dialog({id:'userinfo', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.user_information,content: 'url:OperationManagement/UserInfoNew.html?type=add',
				width:'975px',height:'350px', min:false, max:false, lock:true});
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
	$('#userInfoTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'account') {
		pos = row['act'];
	}else if(name == 'name') {
		pos = row['nm'];
	}else if(name == 'updateTime') {
		pos = dateFormat2TimeString(new Date(row['utm']));
	}else if(name == 'company') {
		pos = getArrayName(parent.companys, row['pid']);
	}else if(name == 'status') {
		if(row['stu'] == 0) {
			pos = parent.lang.deactivation;
		}else if(row['stu'] == 1) {
			pos = parent.lang.use;
		}else if(row['stu'] == 2) {
			pos = parent.lang.del;
		}
	}else if(name == 'operator') {
		pos += '<a class="changePWD" href="javascript:changePWD('+row['id']+');" title="'+ parent.lang.modify_password +'"></a>';
		if(row['act'] != parent.account && parent.myUserRole.isPermit(32) && row['at'] != 1) {
			pos += '<a class="changeRole" href="javascript:changeRole('+row['id']+');" title="'+ parent.lang.rights_information +'"></a>';
		}else {
			pos += '<a class="not-changeRole" href="javascript:;" title="'+ parent.lang.errNoPrivilige +'"></a>';
		}
		if(row['at'] != 1){
			pos += '<a class="authorize" href="javascript:vehiclePermit('+row['id']+');" title="'+ parent.lang.vehicle_authorize +'"></a>';
		}else{
			pos += '<a class="not-authorize" href="javascript:" title="'+ parent.lang.errNoPrivilige +'"></a>';
		}
		pos += '<a class="detail" href="javascript:findUserInfo('+row['id']+');" title="'+ parent.lang.detailed +'"></a>';
		pos += '<a class="edit" href="javascript:editUserInfo('+row['id']+');" title="'+ parent.lang.edit +'"></a>';
		if(row['act'] != parent.account && row['at'] != 1) {
			pos += '<a class="delete" href="javascript:delUserInfo('+row['id']+');" title="'+ parent.lang.del +'"></a>';
		}else {
			pos += '<a class="not-delete" href="javascript:;" title="'+ parent.lang.errNoPrivilige +'"></a>';
		}
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function findUserInfo(id) {
	$.dialog({id:'userinfo', title:parent.lang.view+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.user_information,content: 'url:OperationManagement/UserInfoNew.html?id='+id+'&type=',
	width:'975px',height:'200px', min:false, max:false, lock:true});
}
function editUserInfo(id) {
	$.dialog({id:'userinfo', title:parent.lang.edit+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.user_information,content: 'url:OperationManagement/UserInfoNew.html?id='+id+'&type=edit',
		width:'975px',height:'350px', min:false, max:false, lock:true});
}
function delUserInfo(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet('StandardUserAction_deleteUserAccount.action?id=' + id, function(json,action,success){
		$.myajax.showLoading(false);
		if(success){
			$('#userInfoTable').flexOptions().flexReload();
		}
	}, null);
}
function changeRole(id) {
	$.dialog({id:'roleinfo', title:parent.lang.modify_permissions,content: 'url:OperationManagement/RoleInfo.html?uid='+id+'&type=edit',
		width:'975px',height:'625px', min:false, max:false, lock:true});
}
function changePWD(id) {
	$.dialog({id:'setPwd', title:parent.lang.modify_password,content: 'url:OperationManagement/user_password.html?id='+id,
		min:false, max:false, lock:true});
}
function vehiclePermit(id) {
	$.dialog({id:'info', title:parent.lang.vehicle_authorize,content: 'url:OperationManagement/SelectInfo.html?type=vehiclePermit&id='+id+'&singleSelect=false',
	width:'800px',height:'530px', min:false, max:false, lock:true});
//	$.dialog({id:'userinfo', title:parent.lang.vehicle_authorize,content: 'url:OperationManagement/User_Vehi_Permit.html?id='+id,
//		min:false, max:false, lock:true});
}
//获取在线客户端数目
function getOnlineClientCount() {
	$.myajax.jsonGet('StandardUserAction_getOnlineClientCount.action', function(json,action,success){
		if(success) {
			var onlineCount = json.onlineCount;
			$('#onlineClientCount').text(onlineCount);
		};
	}, null);
}
function doExit() {
	$.dialog({id:'info'}).close();
}
function doSaveVehiclePermitSuc() {
	parent.getUserVehicles();
	$.dialog({id:'info'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}
function doVehiclePermitSuc() {
	parent.getUserVehicles();
	$.dialog({id:'userinfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}
function doPasswordSuc() {
	$.dialog({id:'setPwd'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}
function doSaveUserInfoSuc(data) {
	$('#userInfoTable').flexOptions().flexReload();
	$.dialog({id:'userinfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}
