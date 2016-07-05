var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var isExistChild = false;
var sid = null;
var companys = [];
var accounts = [];
var parentId = null;
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
	var buttons = [];
	var but = [];
	if(type == 'add' || type == 'edit') {
		but.push({
			display: parent.lang.save, 
			name : '', 
			pclass : 'submit',
			bgcolor : 'gray',
			hide : false
		});
		buttons.push(but);
		/*but = [];
		but.push({
			display: parent.lang.reset,
			name : '', 
			pclass : 'reset',
			bgcolor : 'gray', 
			hide : false
		});
		buttons.push(but);*/
	}
	but = [];
	but.push({
		display: parent.lang.close, 
		name : '', 
		pclass : 'close',
		bgcolor : 'gray', 
		hide : false
	});
	buttons.push(but);
	$('#toolbar-btn').flexPanel({
		ButtonsModel : buttons 
	});

	var ttype = '';
	var tips = '';
	if(type == 'add' || type == 'edit') {
		ttype = 'input';
		tips = '';
	}

	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip:tips,hide:false,tabshide:false},
				colgroup:{width:['150px','325px','150px','325px']},
				tabs:{
					display: [parent.lang.companyName,parent.lang.company_master,parent.lang.login_password,parent.lang.confirm_password,parent.lang.validity,parent.lang.organization_code,parent.lang.legal_person,parent.lang.contact_person,
					          parent.lang.contact_phone,parent.lang.parent_company,parent.lang.industry],
					name : ['companyName','abbreviation','password','confirmPWD','validity','organizationCode','legalPerson','linkMan','linkPhone','company','industryType'],
					type:[ttype,ttype,'password','password',ttype,ttype,ttype,ttype,ttype],
					length:[32,20,20,20,,32,20,20,20]
				}
			},{
				title :{display: parent.lang.optional_information,hide:false,tabshide:false},
				colgroup:{width:['150px','325px','150px','325px']},
				tabs:{
					display: [parent.lang.business_license_number,parent.lang.registered_capital,parent.lang.address,'',parent.lang.brief_introduction+parent.lang.companys_business_scope,'',parent.lang.remark,''],
					name : ['businessLicenseNum','registeredCapital','address','','introduction','','remark',''],
					type:[ttype,ttype,ttype,'','textArea','','textArea',''],
					length:[32,20,60]
				}
			}
		]
	});
//	$('#info-mid-table .form-input').each(function() {
//		if($(this).attr('data-name')!=null && $(this).attr('data-name')!='') {
//			cleanSpelChar('.input-'+$(this).attr('data-name'));	
//		}
//	});
	$('.td-companyName').append('<span class="span-tip red">*</span>');
	$('.td-abbreviation').append('<span class="span-tip red">*</span>');
	//加载公司信息
	ajaxLoadCompanyInfo();
	
	var content = '<div class="module" style="display:inline-block;margin-left:5px;">';
	content += '<input type="checkbox" style="float: left;" name="digitalIntercom" value="1" id="checkbox-digitalIntercom" class="checkbox-digitalIntercom digitalIntercom">';
	content += '<label id="validityStatus" for="checkbox-digitalIntercom">' + parent.lang.enable + '</label>';
	content += '</div>';
	$('.td-validity .span-tip').remove();
	$('.td-validity').append(content);
	$('.td-validity .module').click(function() {
		if($('#checkbox-digitalIntercom').get(0).checked) {
			$('#validity').get(0).disabled = false;
		}else {
			$('#validity').get(0).disabled = true;
		}
	});
	cleanChar('.password-password');
	cleanChar('.password-confirmPWD');
	$('.td-password').append('<span class="red" style="margin-left: 10px;">'+parent.lang.defaultPassword+'</span>');
	cleanSpelChar('#input-companyName');
	cleanSpelChar('#input-abbreviation');
	$('.submit','#toolbar-btn').on('click',function(){
		/*if(!checkCompanyParam()) {
			return;
		}*/
		if($('.input-companyName').val() == null || $('.input-companyName').val() == ''){
			$('.td-companyName').find('.span-tip').text(parent.lang.not_be_empty);
			$('#required-area .panel-body').addClass('show');
			$('.input-companyName').focus();
			return;
		}
		if(getUrlParameter('id') != parent.companyId) {
			if(isExistChild) {
				$('#hidden-company').val(parentId);
			}
			if($('#hidden-company').val() == null || $('#hidden-company').val() == '') {
				if(parent.myUserRole.isAdmin() && ($('#combox-company').val() == null || $('#combox-company').val() == '')) {
					$('.td-company').find('.span-tip').text("*");
				}else {
					$('.td-company').find('.span-tip').text(parent.lang.errCompanyNotExists);
					$('#required-area .panel-body').addClass('show');
					$('#combox-company').focus();
					return;
				}
			}
		}else {
			$('#hidden-company').val(parentId);
		}
		
		var data = {};
		if(type == 'edit') {
			data.id = $.trim(getUrlParameter('id'));
			if($('#hidden-abbreviation').val() == null || $('#hidden-abbreviation').val() == '') {
				$('.td-abbreviation').find('.span-tip').text(parent.lang.not_be_empty);
				$('#required-area .panel-body').addClass('show');
				$('#combox-abbreviation').focus();
				return;
			}
			data.accountID = $('#hidden-abbreviation').val();
		}
		data.name = $.trim($('.input-companyName').val());
		if(type == 'add'){
			if($('.input-abbreviation').val() == null || $('.input-abbreviation').val() == ''){
				$('.td-abbreviation').find('.span-tip').text(parent.lang.not_be_empty);
				$('#required-area .panel-body').addClass('show');
				$('.input-abbreviation').focus();
				return;
			}
			if(!checkPassword()){
				return;
			}
			data.abbreviation = $.trim($('.input-abbreviation').val());
			data.password = $.trim($(".password-password").val());
		}
		data.code = $.trim($('.input-organizationCode').val());
		data.legal = $.trim($('.input-legalPerson').val());
		data.linkMan = $.trim($('.input-linkMan').val());
		data.linkPhone = $.trim($('.input-linkPhone').val());
		if($('.input-linkPhone').val() != null && $('.input-linkPhone').val() != ''){
			if(!checkPhoneValue()) {
				return;
			}
		}
		if($('#checkbox-digitalIntercom').get(0).checked){
			data.validity = dateStrLongTime2Date($.trim($('.input-validity').val()));
		}else {
			data.validity = '';
		}
		data.parentId = $.trim($('#hidden-company').val());
		data.industryType = $.trim($('#hidden-industryType').val());
		data.businessLicenseNum = $.trim($('.input-businessLicenseNum').val());
		data.registeredCapital = $.trim($('.input-registeredCapital').val());
		data.address = $.trim($('.input-address').val());
		data.introduction = $.trim($('#textArea-introduction').val());	
		data.remark = $.trim($('#textArea-remark').val());
		disableForm(true);
		$.myajax.showLoading(true, parent.lang.saving);
		$.myajax.jsonPost('StandardCompanyAction_mergeCompany.action', data, false, function(json, success) {
			disableForm(false);
			$.myajax.showLoading(false);
			if (success) {
				W.doSaveCompanySuc(data);
			}
		});
	});
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'companyinfo'}).close();
	});
	$('.reset','#toolbar-btn').on('click',function(){
		var url = 'OperationManagement/CompanyInfo.html?type='+type;
		if(type == 'edit') {
			url += '&id='+getUrlParameter('id');
		}
		$('.ui_dialog',parent.document).find('iframe').attr('src',url);
	});
}

function checkPassword() {
	var pwd = $('.password-password').val();
	var confirmPWD = $('.password-confirmPWD').val();
	if(pwd != confirmPWD) {
		$.dialog.tips(parent.lang.msg_password_not_same,1);
		$('.password-confirmPWD').focus();
		return false;
	}
	return true;
}

/**
 * 加载公司信息
 */
function ajaxLoadCompanyInfo(){
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	if(type == 'add') {
		$.myajax.jsonGet('StandardCompanyAction_loadUserCompanys.action?type=0', function(json,action,success){
			if(success) {
				companys = json.infos;
				loadCompanyInfo();
			};
		}, null);
	}else {
		$.myajax.jsonGetEx('StandardCompanyAction_findCompany.action?id='+getUrlParameter('id')+'&type='+type, function(json,action,success){
			if (success) {
				isExistChild = json.isExistChild;
				var company = json.company;
				parentId = company.parentId;
				if (!$.isEmptyObject(json.company)) {
					if(type == 'edit') {
						companys = json.companys;
					}
					accounts = json.accountList;
					loadCompanyInfo(company);
				}
			}
		});
	}
	$.myajax.showLoading(false);
	disableForm(false);
}

function getAccounts(){
	var accountList = [];
	for (var i = 0; i < accounts.length; i++) {
		accountList.push({id:accounts[i].id,name:accounts[i].account});
	}
	return accountList;
}

/**
 * 加载公司详细信息
 * @param params
 */
function loadCompanyInfo(params) {
	var industryTypes = getIndustryTypes();
	
	
	if(type == 'add' || type == 'edit') {
		var allCompanys = [];
		if(type == 'add') {
			for(var i = 0; i < companys.length; i++) {
				if(companys[i].id == parent.companyId) {
					sid = companys[i].parentId;
				}
			}
		}else if(type == 'edit') {
			allCompanys = parent.companys;
			for(var i = 0;i < companys.length; i++) {
				if(params && companys[i].id == params.id) {
					companys.splice(i, 1);
				}
			}
			for(var i = 0; i < companys.length; i++) {
				if(companys[i].id == parent.companyId) {
					sid = companys[i].parentId;
				}
			}
		}
		
		//添加公司树
		addCompanyTree(companys,sid);
		
		$('.td-industryType').flexPanel({
			ComBoboxModel :{
				input : {name : 'industryType',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'industryType', option : arrayToStr(industryTypes)}
			}	
		});
		$('.input-validity').addClass('Wdate');
		$('.input-validity').attr('name','validity');
		$('.input-validity').attr('id','validity');
		$('.input-validity').attr('readonly','readonly');
		$('.input-validity').css('width','70%');
		$('#input-linkPhone').on('blur',checkPhoneValue);
		if(type == 'add') {
		//	$('#combox-company').val(getArrayName(companys,parent.companyId));
		//	$('#hidden-company').val(parent.companyId);
			$('#combox-industryType').val(getArrayName(industryTypes,1));
			$('#hidden-industryType').val(1);
			$('.password-password').val('000000');
			$('.password-confirmPWD').val('000000');
			$(".input-validity").val(dateCurDateBeginString2());
			$(".input-validity").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
			$('.input-validity').get(0).disabled = true;
			$('.td-company').append('<span class="span-tip red">*</span>');
			if(parent.myUserRole.isAdmin()) {
				$('.td-company').find('.span-tip').text('');
			}
		}else if(type == 'edit') { 
			$('.input-companyName').val(params.name);
		//	$('.input-companyName').get(0).disabled = true;
			$('.td-companyName').append('<input class="input-id" type="hidden" name="id" value="'+params.id+'"/>');
			if(params.accountID){
				$('.input-abbreviation').remove();
				$('.td-abbreviation').flexPanel({
					ComBoboxModel :{
						input : {name : 'abbreviation',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
						combox: 
							{name : 'abbreviation', option : arrayToStr(getAccounts())}
					}	
				});
				for (var i = 0; i < accounts.length; i++) {
					if(accounts[i].id == params.accountID){
						$('#combox-abbreviation').val(accounts[i].account);
						$('#combox-abbreviation').get(0).disabled = true;
						$('#hidden-abbreviation').val(params.accountID);
						if(accounts[i].validity == null) {
							$(".input-validity").val(dateCurDateBeginString2());
							$(".input-validity").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
							$('.input-validity').get(0).disabled = true;
						}else {
							$('.input-validity').val(dateFormat2TimeString(new Date(accounts[i].validity)));
							$('#checkbox-digitalIntercom').get(0).checked = true;
						}
						$('.input-validity').click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
					}
				}
				$('.td-password').parent().hide();
				$('.td-confirmPWD').parent().hide();
				if(params.isMine == 1){
					$('.td-validity').parent().hide();
				}
			}else{
				$('.input-abbreviation').remove();
				$(".input-validity").val(dateCurDateBeginString2());
				$('.input-validity').get(0).disabled = true;
				$('.td-abbreviation').flexPanel({
					ComBoboxModel :{
						input : {name : 'abbreviation',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
						combox: 
							{name : 'abbreviation', option : arrayToStr(getAccounts())}
					}	
				});
				$('#select-abbreviation li').each(function() {
					$(this).on('click',function() {
						var index= $(this).attr('data-index');
						for (var i = 0; i < accounts.length; i++) {
							if(accounts[i].id == index){
								if(accounts[i].validity == null) {
									$(".input-validity").val(dateCurDateBeginString2());
									$(".input-validity").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
									$('.input-validity').get(0).disabled = true;
									$('#checkbox-digitalIntercom').get(0).checked = false;
								}else {
									$('.input-validity').val(dateFormat2TimeString(new Date(accounts[i].validity)));
									$('#checkbox-digitalIntercom').get(0).checked = true;
									$('.input-validity').get(0).disabled = false;
								}
								$('.input-validity').click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
							}
						}
					});
				});
				$('.td-password').parent().hide();
				$('.td-confirmPWD').parent().hide();
				//$('.td-validity').parent().hide();
			}
			$('.input-organizationCode').val(params.code);
			$('.input-legalPerson').val(params.legal);
			$('.input-linkMan').val(params.linkMan);
			$('.input-linkPhone').val(params.linkPhone);
			if(isExistChild) {
				$('#company_tree').remove();
				$('#combox-company').val(params.parentName);
				$('#combox-company').get(0).disabled = true;
				$('#hidden-company').val(params.parentId);
				$('#hidden-company').get(0).disabled = true;
				$('.td-company').append('<span style="color:red;">'+parent.lang.msg_exist_childCompany+'</span>');
			}else {
				if(params.isMine == 1){
					$('#company_tree').remove();
					$('#combox-company').val(params.parentName);
					$('#combox-company').get(0).disabled = true;
					$('#hidden-company').val(params.parentId);
					$('.td-company').append('<span style="color:red;">'+parent.lang.msg_myCompany+'</span>');
				}else {
					$('#combox-company').val(params.parentName);
					$('#hidden-company').val(params.parentId);
					$('.td-company').append('<span class="span-tip red">*</span>');
					if(parent.myUserRole.isAdmin()) {
						$('.td-company').find('.span-tip').text('');
					}
				}
			}
			if(params.level == 2) {
				$(".tr-group-area").show();
			}
			$('#combox-industryType').val(getArrayName(industryTypes,params.industryType));
			$('#hidden-industryType').val(params.industryType);
			$('.input-businessLicenseNum').val(params.businessLicenseNum);
			$('.input-registeredCapital').val(params.registeredCapital);
			$('.input-address').val(params.address);
			$('#textArea-introduction').val(params.introduction);	
			$('#textArea-remark').val(params.remark);
		};
	}else {
		if(params.accountID){
			for (var i = 0; i < accounts.length; i++) {
				if(accounts[i].id == params.accountID){
					$('.td-abbreviation').text(accounts[i].account);
					if(accounts[i].validity != '1970-01-01 08:00:00' && accounts[i].validity != null){
						$('.td-validity').empty();
						$('.td-validity').append(dateFormat2TimeString(new Date(accounts[i].validity)));
					}else{
						$('.td-validity').append("");
						$('#checkbox-digitalIntercom').hide();
						$('#validityStatus').text(parent.lang.not_enabled);
					}
				}
			}
		}
		$('.td-password').parent().hide();
		$('.td-confirmPWD').parent().hide();
		$('.td-companyName').text(params.name);
//		$('.td-abbreviation').text(params.abbreviation);
		$('.td-organizationCode').text(params.code);
		$('.td-legalPerson').text(params.legal);
		$('.td-linkMan').text(params.linkMan);
		$('.td-linkPhone').text(params.linkPhone);
		$('.td-company').text(params.parentName);
		$('.td-industryType').text(getArrayName(industryTypes,params.industryType));
		$('.td-businessLicenseNum').text(params.businessLicenseNum);
		$('.td-registeredCapital').text(params.registeredCapital);
		$('.td-address').text(params.address);
		$('#textArea-introduction').val(params.introduction);
		$('#textArea-introduction').attr('readonly','readonly');
		$('#textArea-remark').val(params.remark);
		$('#textArea-remark').attr('readonly','readonly');
	}
}

function getIndustryTypes() {
	var industryTypes = [];
	industryTypes.push({id:1,name:parent.lang.logistics_transportation});
	industryTypes.push({id:2,name:parent.lang.vehicle_rental});
	industryTypes.push({id:3,name:parent.lang.bus_passenger});
	industryTypes.push({id:4,name:parent.lang.taxi});
	industryTypes.push({id:5,name:parent.lang.concrete_car});
	industryTypes.push({id:6,name:parent.lang.special_vehicles});
	industryTypes.push({id:9,name:parent.lang.coal_transportation});
	industryTypes.push({id:8,name:parent.lang.automobile_4S_shop});
	industryTypes.push({id:7,name:parent.lang.engineering_machinery});
	industryTypes.push({id:0,name:parent.lang.other_areas});
	return industryTypes;
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
		$('.td-company #combox-company').val('');
		$('.td-company #hidden-company').val('');
		$('.td-company .span-tip').text('*');
		$('#company_tree').hide();
	}
}

function checkPhoneValue(){
	var phoneNum = $('#input-linkPhone').val();
	if(phoneNum != null && phoneNum != ''){
		var reg = /^((\d{11})|(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/;
		var flag = reg.test(phoneNum);
		if(!flag){
			alert(parent.lang.please_give_right_phonenum);
			return false;
		}
	}
	return true;
}

/**
 * 检查数据
 * @returns {Boolean}
 */
/*function checkCompanyParam() {
	var flag = true;
	var i = 0;
	$('#required-area input,#required-area textArea').each(function(){
		var name = $(this).attr('data-name');
		if(parent.myUserRole.isAdmin() && name == 'company') {
			$('.td-'+name).find('.span-tip').hide();
		}else if($(this).val() == null || $(this).val() == ''){
			$('.td-'+name).find('.span-tip').text(parent.lang.not_be_empty);
			if(i == 0) {
				$('#required-area .panel-body').addClass('show');
				$(this).focus();
			}
			i++;
		}else {
			$('.td-'+name).find('.span-tip').text('*');
		}
	});
	if(i != 0) {
		flag = false;
	}
	return flag;
}*/	