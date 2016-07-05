var api = frameElement.api, W = api.opener;
var companys = [],parentCompanys=[],childCompanys=[];
var roles = [];
var sid = null;
$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [[{
			display: parent.lang.save, name : '', pclass : 'btnSave',bgcolor : 'gray', hide : false
		}]]
	});
	//加载语言
	loadLang();
	
	
	$("#validityValue").val(dateCurDateBeginString2());
	$("#validityValue").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
	$('#validityValue').get(0).disabled = true;
	
	$('.module').click(function() {
		if($('#checkbox-digitalIntercom').get(0).checked) {
			$('#validityValue').get(0).disabled = false;
		}else {
			$('#validityValue').get(0).disabled = true;
		}
	});
	//配置失去焦点的事件
	$("#name").blur(checkName);
	$("#pwd").blur(checkPwd);
	$("#cpwd").blur(checkCPwd);
	ajaxLoadCompanyVehicleList();

});
function loadLang(){
	$("#account").text(parent.lang.login_account);
	$("#password").text(parent.lang.login_password);
	$("#cpassword").text(parent.lang.confirm_password);
	$("#validity").text(parent.lang.validity);
	$("#company").text(parent.lang.belong_company);
	$("#rolename").text(parent.lang.role_name+parent.lang.role_assign_permissions);
	$("#enable").text(parent.lang.enable);
	$("#newcompany").text(parent.lang.new_company);
	$("#newrole").text(parent.lang.new_role);
}

function ajaxLoadCompanyVehicleList() {
	$.myajax.jsonGet('StandardUserAction_loadCompanyVehicleList.action', function(json,action,success){
		if(success) {
			companys = json.companys;
			roles = json.roles;
			loadUserInfo();
		};
	}, null);
}

function loadUserInfo() {
	for(var i = 0;i < companys.length; i++) {
		if(companys[i].id == parent.companyId) {
			companys.splice(i,1);
		}
	}
	sid = parent.companyId;
	addCompanyTree(companys,sid);
	$('.td-role').flexPanel({
		ComBoboxModel :{
			input : {name : 'role',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			combox: 
				{name : 'role', option : arrayToStr(roles)}
		}	
	});
}

function checkName() {
	if($('#name').val() == null || $('#name').val() == ''){
		$('#nameWrong').text(parent.lang.errStringRequire);
		return false;
	}
	return true;
}

function checkPwd() {
	if($('#pwd').val() == null || $('#pwd').val() == ''){
		$('#pwdWrong').text(parent.lang.errStringRequire);
		return false;
	}
	return true;
}

function checkCPwd() {
	if($('#cpwd').val() == null || $('#cpwd').val() == ''){
		$('#cpwdWrong').text(parent.lang.errStringRequire);
		return false;
	}
	return true;
}

function checkCompany() {
	if($('#hidden-company').val() == null || $.trim($('#hidden-company').val()) == ''){
		return false;
	}
	return true;
}

function checkParam() {
	var ret = true;
	if (!checkName()) {
		ret = false;
	}
	
	if (!checkPwd()) {
		ret = false;
	}
	
	if (!checkCPwd()) {
		ret = false;
	}
	
	if (!checkCompany()) {
		alert(parent.lang.selectCompanyTip);
		ret = false;
	}
	
	return ret;
}

function ajaxSaveUser() {
	if (!checkParam()) {
		return ;
	}

	var data={};
	data.name = $.trim($("#name").val());
	data.account = $.trim($("#name").val());
	if(!checkPassword()) {
		return;
	}
	data.password = $("#pwd").val();
	if($('#checkbox-digitalIntercom').get(0).checked){
		data.validity = dateStrLongTime2Date($('.input-validity').val());
	}else {
		data.validity = '';
	}
	var company = {};
	company.id = $('#hidden-company').val();
	if(company.id != null || company.id != '') {
		data.company =company;
	}
	var role = {};
	role.id = $('#hidden-role').val();
	if(role.id != null || role.id != '') {
		data.role =role;
	}
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action;
	action = 'StandardUserAction_mergeUserAccount.action'
		disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost( action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.doSaveUserInfoSuc();
		}
	});
}

function checkPassword() {
	var pwd = $('#pwd').val();
	var confirmPWD = $('#cpwd').val();
	if(pwd != confirmPWD) {
		$('.confirmPWDTip').text(parent.lang.msg_password_not_same);
		$('.password-confirmPWD').focus();
		return false;
	}
	return true;
}

function addCompanyInfo(){
	$.dialog({id:'companyinfo', title:parent.lang.add +'&nbsp&nbsp&nbsp&nbsp'+parent.lang.company_information ,content: 'url:OperationManagement/CompanyInfo.html?type=add',
		width:'975px',height:'500px', min:false, max:false, lock:true, parent: api});
}

function addRoleInfo(){
	$.dialog({id:'roleinfo', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.rights_information,content: 'url:OperationManagement/RoleInfo.html?type=add',
		width:'975px',height:'600px', min:false, max:false, lock:true, parent: api});
}

/**
 * 公司树双击事件
 */
function companyDblClickEvent() {
	var selId = companyTree.getSelectedItemId();
	if(selId != '*_0' && selId != '*_'+sid) {
		var id =selId.split('_')[1];
		$('#company_tree').hide();
		$('.td-company .span-tip').text('*');
		if(oldCompanyId == null || oldCompanyId != id) {
			oldCompanyId = id;
			$('.td-company #combox-company').val(getArrayName(companys,id));
			$('.td-company #hidden-company').val(id);
		}
	}else {
		$('.td-company #combox-company').val('');
		$('.td-company #hidden-company').val('');
		$('#company_tree').hide();
	}
}

function doSaveCompanySuc(data){
	window.parent.getParentCompanyTeams();
	$.dialog({id:'companyinfo'}).close();
	$.myajax.jsonGet('StandardUserAction_loadCompanyVehicleList.action', function(json,action,success){
		if(success) {
			companys = json.companys;
			for(var i = 0; i < companys.length; i++) {
				if(companys[i].name == data.name) {
					companyTree.insertGroupItem(companyTree.getTreeGroupId(companys[i].parentId),companys[i]);
					$('.td-company #combox-company').val(data.name);
					$('.td-company #hidden-company').val(companys[i].id);
				}
			}
		};
	}, null);
	
}

function doSaveRoleSuc(){
	$.dialog({id:'roleinfo'}).close();
	$('.td-role .btn-group').remove();
	$.myajax.jsonGet('StandardUserAction_loadCompanyVehicleList.action', function(json,action,success){
		if(success) {
			companys = json.companys;
			roles = json.roles;
			$('.td-role').flexPanel({
				ComBoboxModel :{
					input : {name : 'role',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
					combox: 
						{name : 'role', option : arrayToStr(roles)}
				}	
			});
		};
	}, null);
	
}