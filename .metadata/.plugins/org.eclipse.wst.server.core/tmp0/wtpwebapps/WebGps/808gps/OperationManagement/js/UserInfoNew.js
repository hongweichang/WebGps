var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var companyid = getUrlParameter('companyid');
var companyname = decodeURIComponent(getUrlParameter('companyname'));
var companys = [],parentCompanys=[],childCompanys=[];
var roles = [];
var myrole = null;
var sid = null;
var isMine = null;
var oldParentId = null;
var isVehicle = getUrlParameter('isVehicle');
var isNewPermit = 1;
var permitVehi = "";
var user_ = null;
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
		tips = '*';
	}
	var display = [],name = [],types = [],length = [];
	display.push(parent.lang.belong_company);
	display.push('');
	display.push(parent.lang.login_account);
	display.push(parent.lang.user_name);
	name.push('company');
	name.push('');
	name.push('account');
	name.push('name');
	types.push('');
	types.push('');
	types.push(ttype);
	types.push(ttype);
	length.push('');
	length.push('');
	length.push(20);
	length.push(20);
	if(type == 'add') {
		display.push(parent.lang.login_password);
		display.push(parent.lang.confirm_password);
		display.push(parent.lang.validity);
		display.push(parent.lang.role_name+parent.lang.role_assign_permissions);
		name.push('password');
		name.push('confirmPWD');
		name.push('validity');
		name.push('role');
		types.push('password');
		types.push('password');
		types.push(ttype);
		types.push('');
		length.push(20);
		length.push(20);
		if(isVehicle != "yes"){
			display.push(parent.lang.permit_count);
			name.push('permit');
			types.push(ttype);
		}
	}else if(type == 'edit') {
		display.push(parent.lang.validity);
		display.push(parent.lang.status);
		display.push(parent.lang.role_name+parent.lang.role_assign_permissions);
		display.push('');
		name.push('validity');
		name.push('status');
		name.push('role');
		name.push('');
		types.push(ttype);
		types.push('');
		types.push('');
		types.push('');
	}else {
		display.push(parent.lang.validity);
		display.push(parent.lang.status);
		name.push('validity');
		name.push('status');
		types.push(ttype);
		types.push('');
	}

	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip:tips,hide:false,tabshide:false},
				colgroup:{width:['150px','325px','150px','325px']},
				tabs: {
					display : display,
					name : name ,
					type : types,
					length: length
				}
			},{
				title :{display: parent.lang.vehicle_authorize,pid: 'vehicle-authorize',hide:true,tabshide:false},
				colgroup:{},
				tabs:{}
			}
		]
	
	});
	
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
	$('#input-permit').val(0);
	$('#input-permit').attr('readonly','readonly');
	$('.td-permit .span-tip').hide();
	$('.td-permit').append('<a id="givepermit" class="authorize" href="javascript:;" onclick="giveVihiclePermit()" style="margin-left:10px;" title="'+parent.lang.vehicle_authorize+'"></a>');
//	cleanSpelChar('input-name');
	cleanCharAndNum('.input-account');
	cleanCharAndNum('.password-password');
	cleanCharAndNum('.password-confirmPWD');
	$('.td-password').append('<span class="red" style="margin-left: 10px;">'+parent.lang.defaultPassword+'</span>');
	//$('.td-role').find('.span-tip').hide();
	//加载用户信息
	ajaxLoadUserInfo();
	if(type == 'add' || type == 'edit') {
		$('.submit','#toolbar-btn').on('click',function(){
			var flag = true;
			if(!checkParam()) {
				flag = false;
			}
			if(user_ == null || user_.at != 1){
				if($('#combox-role').val() == null || $('#hidden-role').val() == null || $('#combox-role').val() == '' || $('#hidden-role').val() == '') {
					$('.td-role').find('.span-tip').text(parent.lang.not_be_empty);
					flag = false;
				}
			}
			
			if(!flag){
				return;
			}
			
			var action = 'StandardUserAction_mergeUserAccount.action';
			var data = {};
			if(type == 'edit') {
				data.id = $.trim(getUrlParameter('id'));//$('.input-id').val();
			}
			if(type == 'add') {
				if(!checkPassword()) {
					return;
				}
				data.password = $.trim($(".password-password").val());
				data.permits = permitVehi;
			}
			if(type == 'add' || type == 'edit') {
				data.name = $.trim($('.input-name').val());
				var company = {};
				company.id = $.trim($('#hidden-company').val());
				if(company.id != null || company.id != '') {
					data.company =company;
				}
				//判断是否有空格
				if(isCheckEmpty($('.input-account').val())) {
					$('.input-account').focus();
					alert(parent.lang.login_account + ":'" + $('.input-account').val()+"'" + parent.lang.errValueContainSpace);
					return;
				}
				data.account = $.trim($(".input-account").val());
				var role = {};
				role.id = $.trim($('#hidden-role').val());
				if(role.id != null || role.id != '') {
					data.role =role;
				}
				if($('#checkbox-digitalIntercom').get(0).checked){
					data.validity = dateStrLongTime2Date($.trim($('.input-validity').val()));
				}else {
					data.validity = '';
				}
				data.status = $.trim($('#hidden-status').val());
			}
			disableForm(true);
			$.myajax.showLoading(true, parent.lang.saving);
			$.myajax.jsonPost( action, data, false, function(json, success) {
				disableForm(false);
				$.myajax.showLoading(false);
				if (success) {
					W.doSaveUserInfoSuc(data);
				}
			});
		});
	}
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'userinfo'}).close();
	});
	if(type == 'add' || type == 'edit') {
		$('.reset','#toolbar-btn').on('click',function(){
			var url = 'OperationManagement/UserInfoNew.html?type='+type;
			if(type == 'edit') {
				url += '&id='+getUrlParameter('id');
			}
			$('.ui_dialog',parent.document).find('iframe').attr('src',url);
		});
	}
	$('#input-account').on('blur',function() {
		$('#input-name').val($.trim($(this).val()));
	});
}

//加载用户信息
function ajaxLoadUserInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	if(type == 'add') {
		var action = 'StandardUserAction_loadCompanyVehicleList.action';
		if(companyid != null && companyid != ''){
			action += '?companyId=' + companyid;
		}
		$.myajax.jsonGet(action, function(json,action,success){
			if(success) {
				companys = json.companys;
				roles = json.roles;
				loadUserInfo();
			};
		}, null);
	}else {
		$.myajax.jsonGetEx('StandardUserAction_findUserAccount.action?id='+getUrlParameter('id'), function(json,action,success){
			if (success) {
				user_ = json.user;
				if (!$.isEmptyObject(user_)) {
					myrole = user_.role;
					var companyId_ = json.company.id;
					if(companyId_) {
						$.myajax.jsonGet('StandardUserAction_loadCompanyVehicleList.action?companyId='+companyId_, function(json,action,success){
							if(success) {
								roles = json.roles;
								companys = json.companys;
								parentCompanys = [];
								childCompanys = [];
								for(var i = 0;i < companys.length; i++) {
									if(companys[i].id == companyId_){
										parentCompanys.push(companys[i]);
										childCompanys.push(companys[i]);
									}
								}
								for(var i = 0;i < parentCompanys.length; i++) {
									getPartCompanys(companys,parentCompanys,parentCompanys[i].parentId);
								}
								for(var i = 0;i < childCompanys.length; i++) {
									getChildCompanys(companys,childCompanys,childCompanys[i].id);
								}
								loadUserInfo(user_);
							}
						}, null);
					}	
				}
			}
		});
	}
	$.myajax.showLoading(false);
	disableForm(false);
}

function loadUserInfo(params){
	var sexs = getSex();
	var status = getStatus();
	if(type == 'add') {
		for(var i = 0;i < companys.length; i++) {
			if(companys[i].id == parent.companyId) {
			//	companys.splice(i,1);
				sid = companys[i].parentId;
			}
		}
		//sid = parent.companyId;
	}else {
		companys = parentCompanys;
		sid = parent.companyId;
	}

	if(type == 'add' || type == 'edit') {
		var userRoles = roles;
//		if(type == 'edit' && params.company != null) {
//			for(var i = userRoles.length - 1; i >= 0 ; i--) {
//				if(userRoles[i].parentId != params.company.parentId) {
//					userRoles.splice(i, 1);
//				}
//			}
//		}
		var rlg = true;
		for(var i = 0; i < userRoles.length; i++) {
			if(myrole != null && userRoles[i].id == myrole.id) {
				rlg = false;
			}
		}
		if(rlg && myrole != null) {
			userRoles.push(myrole);
		}
		addCompanyTree(companys,sid);
		
		$('#combox-company').val(getArrayName(companys,parent.companyId));
		$('#hidden-company').val(parent.companyId);
		
		$('.td-role').flexPanel({
			ComBoboxModel :{
				input : {name : 'role',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'role', option : arrayToStr(userRoles)}
			}	
		});
		
		$('.td-sex').flexPanel({
			ComBoboxModel :{
				input : {name : 'sex',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'sex', option : arrayToStr(sexs)}
			}	
		});
		$('.td-status').flexPanel({
			ComBoboxModel :{
				input : {name : 'status',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'status', option : arrayToStr(status)}
			}	
		});

		$('.input-validity').addClass('Wdate');
		$('.input-validity').attr('name','validity');
		$('.input-validity').attr('id','validity');
		$('.input-validity').attr('readonly','readonly');
		$('.input-validity').css('width','70%');
		$('.input-birthday').addClass('Wdate');
		$('.input-birthday').attr('name','birthday');
		$('.input-birthday').attr('id','birthday');
		$('.input-birthday').attr('readonly','readonly');
		$('.input-birthday').css('width','70%');
		if(type == 'add') {
			if(companyid != null && companyid != '' && companyname != null && companyname != ''){
				$('#combox-company').val(companyname);
				$('#combox-company').get(0).disabled = true;
				$('#hidden-company').val(companyid);
			}else{
				if(parent.myUserRole.isPermit(31)){
					$('.td-company').append('<span id = "newcompany" class="add" onclick="addCompanyInfo();" title="'+ parent.lang.add +'"></span>');
				}
			}
			if(parent.myUserRole.isPermit(32)){
				$('.td-role').append('<span id = "newrole" class="add" onclick="addRoleInfo();" title="'+ parent.lang.add +'"></span>');
			}
			$('.password-password').val('000000');
			$('.password-confirmPWD').val('000000');
			$(".input-validity").val(dateCurDateBeginString2());
			$(".input-validity").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
			$('.input-validity').get(0).disabled = true;
			$(".input-birthday").val(dateCurDateBeginString());
			$(".input-birthday").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
		}else if(type == 'edit') {
			isMine = params.ism;
			if(isMine == 1) {
				if(params.company != null) {
					$('#company_tree').remove();
					$('#combox-company').val(getArrayName(parent.companys, params.pid));
					$('#combox-company').get(0).disabled = true;
					$('#hidden-company').val(params.pid);
					$('.td-company .span-tip').remove();
					$('.td-company').append('<span class="red" style="height: 20px;line-height: 20px;margin-left: 10px;">*</span>');
					$('.input-validity').get(0).disabled = true;
				}
			}else {
				if(params.pid != null) {
					$('#combox-company').val(getArrayName(parent.companys, params.pid));
					$('#hidden-company').val(params.pid);
				}
				if(params.at != 1){
					if(parent.myUserRole.isPermit(31)){
						$('.td-company').append('<span id = "newcompany" class="add" onclick="addCompanyInfo();" title="'+ parent.lang.add +'"></span>');
					}
					if(parent.myUserRole.isPermit(32)){
						$('.td-role').append('<span id = "newrole" class="add" onclick="addRoleInfo();" title="'+ parent.lang.add +'"></span>');
					}
				}
			}
			$(".input-account").val(params.act);
		//	$(".input-account").get(0).disabled = true;
			$('.input-name').val(params.nm);
		//	$(".input-name").get(0).disabled = true;
			$('.td-name').append('<input class="input-id" type="hidden" name="id" value="'+params.id+'"/>');
			if(params.vld == null) {
				$(".input-validity").val(dateCurDateBeginString2());
				$(".input-validity").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
				$('.input-validity').get(0).disabled = true;
			}else {
				$('.input-validity').val(dateFormat2TimeString(new Date(params.vld)));
				$('#checkbox-digitalIntercom').get(0).checked = true;
			}
			
			$('.input-validity').click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
			if(params.at != 1){
				if(isMine == 1) {
					$('#select-role').remove();
					if(params.role != null){
						$('#combox-role').val(params.role.name);
						$('#combox-role').get(0).disabled = true;
						$('#hidden-role').val(params.role.id);
						$('.td-role').append('<input id="hidden-role" type="hidden" name="role" data-name="role" value="'+params.role.id+'"/>');
					}else {
						$('.td-role').append('<input id="hidden-role" type="hidden" name="role" data-name="role" value=""/>');
					}
				}else {
					if(params.role != null){
						$('#combox-role').val(params.role.name);
						$('#hidden-role').val(params.role.id);
					}
				}
			}else{
				$('#combox-company').get(0).disabled = true;
				$('.td-role').parent().hide();
			}
			
			$('#combox-status').val(getArrayName(status, params.stu));
			$('#hidden-status').val(params.stu);
	//		$('#combox-sex').val(getArrayName(params.sex));
	//		$('#hidden-sex').val(params.sex);
	//		$('.input-birthday').val(params.birthday);
	//		$(".input-birthday").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
	//		$('.input-linkPhone').val(params.linkPhone);
	//		$('.input-IDCard').val(params.IDCard);
	//		$('#textArea-remark').val(params.remark);
		}
	}else {
		if(params.pid != null) {
			$('.td-company').append(getArrayName(parent.companys, params.pid));
		}
		$(".td-account").append(params.act);
		$('.td-name').append(params.nm);
		if(params.vld != '1970-01-01 08:00:00' && params.vld != null){
			$('.td-validity').empty();
			$('.td-validity').append(dateFormat2TimeString(new Date(params.vld)));
		}else{
			$('.td-validity').append("");
			$('#checkbox-digitalIntercom').hide();
			$('#validityStatus').text(parent.lang.not_enabled);
		}
		if(params.role != null){
			$('.td-role').append(params.role.name);
		}
		$('.td-status').append(getArrayName(status, params.stu));
//		$('.td-sex').append(getSex(params.sex));
//		$('.td-birthday').append(params.birthday);
//		$('.td-linkPhone').append(params.linkPhone);
//		$('#textArea-remark').val(params.remark);
//		$('#textArea-remark').attr('readonly','readonly');
	}
}

function getSex() {
	var sexs = [];
	sexs.push({id:'1',name: parent.lang.man});
	sexs.push({id:'2',name: parent.lang.woman});
	sexs.push({id:'0',name: parent.lang.unknown});
	return sexs;
}

function getStatus() {
	var status = [];
	status.push({id:'0',name: parent.lang.deactivation});
	status.push({id:'1',name: parent.lang.use});
	status.push({id:'2',name: parent.lang.del});
	return status;
}

function checkPassword() {
	var pwd = $('.password-password').val();
	var confirmPWD = $('.password-confirmPWD').val();
	if(pwd != confirmPWD) {
		$('.confirmPWDTip').text(parent.lang.msg_password_not_same);
		$('.password-confirmPWD').focus();
		return false;
	}
	return true;
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
		$('.td-company #combox-company').val(getArrayName(companys,id));
		$('.td-company #hidden-company').val(id);
		if(companyid != null && companyid == id) {
			isNewPermit = 1;
			return;
		}
		isNewPermit = 0;
		companyid = id;
		$('#input-permit').val(0);
		companyname = getArrayName(companys,id);
		$.myajax.jsonGet('StandardUserAction_loadCompanyVehicleList.action?companyId='+id, function(json,action,success){
			if(success) {
				companys = json.companys;
				roles = json.roles;
				$('.td-role').empty();
				$('#select-role').remove();
				$('.td-role').flexPanel({
					ComBoboxModel :{
						input : {name : 'role',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
						combox: 
							{name : 'role', option : arrayToStr(roles)}
					}	
				});
				if(roles.length > 0){
					$('.td-role #combox-role').val(roles[0].name);
					$('.td-role #hidden-role').val(roles[0].id);
				}
				$('.td-role').append('<span class="span-tip red">*</span><span id = "newrole" class="add" onclick="addRoleInfo();" title="'+ parent.lang.add +'"></span>');
			};
		}, null);
	}else {
		$('.td-company #combox-company').val('');
		$('.td-company #hidden-company').val('');
		$('#company_tree').hide();
		companyid = '';
		companyname = '';
		$('#input-permit').val(0);$('.td-role').empty();
		$('#select-role').remove();
		$('.td-role').flexPanel({
			ComBoboxModel :{
				input : {name : 'role',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'role', option : null}
			}	
		});/*
		for(var i = 0; i < roles.length; i++) {
			if(roles[i].name == data.name){
				$('.td-role #combox-role').val(data.name);
				$('.td-role #hidden-role').val(roles[i].id);
			}
		}*/
		$('.td-role').append('<span class="span-tip red">*</span><span id = "newrole" class="add" onclick="addRoleInfo();" title="'+ parent.lang.add +'"></span>');
	}
}

function addCompanyInfo(){
	$.dialog({id:'companyinfo', title:parent.lang.add +'&nbsp&nbsp&nbsp&nbsp'+parent.lang.company_information ,content: 'url:OperationManagement/CompanyInfo.html?type=add',
		width:'975px',height:'500px', min:false, max:false, lock:true, parent: api});
}

function addRoleInfo(){
	companyid = $('.td-company #hidden-company').val();
	companyname = $('.td-company #combox-company').val();
	if(companyid != null && companyid != '' && companyname != null && companyname != ''){
		var url = 'OperationManagement/RoleInfo.html?type=add';
		if(companyid != null && companyid != '' && companyname != null && companyname != ''){
			url += '&companyid='+companyid+'&companyname='+companyname;
		}
		$.dialog({id:'roleinfo', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.rights_information,content: 'url:'+url,
			width:'975px',height:'600px', min:false, max:false, lock:true, parent: api});
	}else{
		alert(parent.lang.user_company);
	}
}

function giveVihiclePermit(){
	companyid = $('.td-company #hidden-company').val();
	companyname = $('.td-company #combox-company').val();
	if(companyid != null && companyid != '' && companyname != null && companyname != ''){
		var url = 'OperationManagement/VehiclePermit.html?type='+isNewPermit;
		if(companyid != null && companyid != '' && companyname != null && companyname != ''){
			url += '&companyid='+companyid+'&companyname='+companyname;
		}
		$.dialog({id:'vehiclePermit', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.rights_information,content: 'url:'+url,
			width:'800px',height:'530px', min:false, max:false, lock:true, parent: api});
	}else{
		alert(parent.lang.user_company);
	}
}

function doSaveCompanySuc(data){
	parent.isChangedVehiGroup = true;
	$.dialog({id:'companyinfo'}).close();
	$.myajax.jsonGet('StandardUserAction_loadCompanyVehicleList.action', function(json,action,success){
		if(success) {
			companys = json.companys;
			for(var i = 0; i < companys.length; i++) {
				if(companys[i].name == data.name) {
					companyTree.insertGroupItem(companyTree.getTreeGroupId(companys[i].parentId),companys[i]);
					$('.td-company #combox-company').val(data.name);
					$('.td-company #hidden-company').val(companys[i].id);
					companyid = companys[i].id;
					$('.td-role').empty();
					$('#select-role').remove();
					$('.td-role').flexPanel({
						ComBoboxModel :{
							input : {name : 'role',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
							combox: 
								{name : 'role', option : null}
						}	
					});
					$('.td-role').append('<span class="span-tip red">*</span><span id = "newrole" class="add" onclick="addRoleInfo();" title="'+ parent.lang.add +'"></span>');
				}
			}
		};
	}, null);
	
}

function doSaveRoleSuc(data){
	companyid = $('.td-company #hidden-company').val();
	$.dialog({id:'roleinfo'}).close();
	$.myajax.jsonGet('StandardUserAction_loadCompanyVehicleList.action?companyId='+companyid, function(json,action,success){
		if(success) {
			companys = json.companys;
			roles = json.roles;
			$('.td-role').empty();
			$('#select-role').remove();
			$('.td-role').flexPanel({
				ComBoboxModel :{
					input : {name : 'role',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
					combox: 
						{name : 'role', option : arrayToStr(roles)}
				}	
			});
			for(var i = 0; i < roles.length; i++) {
				if(roles[i].name == data.name){
					$('.td-role #combox-role').val(data.name);
					$('.td-role #hidden-role').val(roles[i].id);
				}
			}
			$('.td-role').append('<span class="span-tip red">*</span><span id = "newrole" class="add" onclick="addRoleInfo();" title="'+ parent.lang.add +'"></span>');
		};
	}, null);
	
}

function doExit() {
	$.dialog({id:'vehiclePermit'}).close();
}

function setPermitCount(count) {
	$('#input-permit').val(count);
}//function disableForm(flag){}