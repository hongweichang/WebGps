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
		display: parent.lang.show_all_companies, name : '', pclass : 'btnAllCompany',bgcolor : 'gray', hide : false
		}],[{
			display: parent.lang.add,name : '',pclass : 'btnCompany',bgcolor : 'gray',hide : false
		}]];
	$('#toolbar-search').flexPanel({
		SerachBarModel :
			{display: parent.lang.search_company, name : 'companyIdno', pfloat : 'left'}
	});
	$('#toolbar-btn').flexPanel({
		ButtonsModel : mod
	});
	$('#companyInfoTable').flexigrid({
		url: 'StandardCompanyAction_loadUserCompanys.action?type=1',
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.company_name, name : 'name', width : 200, sortable : false, align: 'center'},
			{display: parent.lang.industry, name : 'industryType', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.company_master, name : 'master', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.contact_person, name : 'linkMan', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.contact_phone, name : 'linkPhone', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.parent_company, name : 'parentName', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 200, sortable : false, align: 'center'}
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
//		checkbox: true,
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
	
	$('.btnAllCompany','#toolbar-btn').on('click',function(){
		loadQuery(3);
	});
	$('.btnCompany','#toolbar-btn').on('click',function(){
		$.dialog({id:'companyinfo', title:parent.lang.add +'&nbsp&nbsp&nbsp&nbsp'+parent.lang.company_information ,content: 'url:OperationManagement/CompanyInfo.html?type=add',
				width:'975px',height:'550px', min:false, max:false, lock:true});
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
	$('#companyInfoTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

var industryTypes = [];
industryTypes.push({id:'1',name:parent.lang.logistics_transportation});
industryTypes.push({id:'2',name:parent.lang.vehicle_rental});
industryTypes.push({id:'3',name:parent.lang.bus_passenger});
industryTypes.push({id:'4',name:parent.lang.taxi});
industryTypes.push({id:'5',name:parent.lang.concrete_car});
industryTypes.push({id:'6',name:parent.lang.special_vehicles});
industryTypes.push({id:'9',name:parent.lang.coal_transportation});
industryTypes.push({id:'8',name:parent.lang.automobile_4S_shop});
industryTypes.push({id:'7',name:parent.lang.engineering_machinery});
industryTypes.push({id:'0',name:parent.lang.other_areas});

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'industryType') {
		pos = getArrayName(industryTypes,row[name]);
	}else if(name == 'master') {
		pos = row['accountName'];
	}else if(name == 'operator'){
		if(parent.myUserRole.isAdmin() || parent.myUserRole.isMaster() || parent.myUserRole.isAllowManage()) {
			pos = '<a class="changePWD" href="javascript:changePWD('+row['accountID']+');" title="'+ parent.lang.modify_password +'"></a>';
		}
		pos += '<a class="detail" href="javascript:findCompanyInfo('+row['id']+');" title="'+ parent.lang.detailed +'"></a>';
		pos += '<a class="edit" href="javascript:editComapnyInfo('+row['id']+');" title="'+ parent.lang.edit +'"></a>';
		if(row['isMine'] == 1) {
			pos += '<a class="not-delete" href="javascript:;" title="'+ parent.lang.errNoPrivilige +'"></a>';
		}else {
			pos += '<a class="delete" href="javascript:delComapnyInfo('+row['id']+');" title="'+ parent.lang.del +'"></a>';
		}
	}else if(name == 'parentName'){
		if(row[name] != null && row[name] != ''){
			pos = row[name];
		}else{
			pos = 'admin';
		}
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function changePWD(id) {
	$.dialog({id:'setPwd', title:parent.lang.modify_password,content: 'url:OperationManagement/user_password.html?id='+id,
		min:false, max:false, lock:true});
}

function findCompanyInfo(id) {
	$.dialog({id:'companyinfo', title:parent.lang.view+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.company_information,content: 'url:OperationManagement/CompanyInfo.html?id='+id+'&type=',
	width:'975px',height:'500px', min:false, max:false, lock:true});
}
function editComapnyInfo(id) {
	$.dialog({id:'companyinfo', title:parent.lang.edit+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.company_information,content: 'url:OperationManagement/CompanyInfo.html?id='+id+'&type=edit',
		width:'975px',height:'530px', min:false, max:false, lock:true});
}
function delComapnyInfo(id) {
	if(!confirm(parent.lang.delconfirm + '\r\n' +parent.lang.delete_before_company)) {
		return ;
	}
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet('StandardCompanyAction_deleteCompany.action?id=' + id, function(json,action,success){
		$.myajax.showLoading(false);
		if(success){
			$('#companyInfoTable').flexOptions().flexReload();
			parent.isChangedVehiGroup = true;
		}
	}, null);
}

function doSaveCompanySuc(data) {
	parent.isChangedVehiGroup = true;
	$('#companyInfoTable').flexOptions().flexReload();
	$.dialog({id:'companyinfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

function doPasswordSuc() {
	$.dialog({id:'setPwd'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}