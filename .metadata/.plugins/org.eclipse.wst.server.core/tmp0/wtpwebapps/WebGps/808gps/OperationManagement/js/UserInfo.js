var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var vehiTree;
var vehiGroupList = null;	//授权车辆列表
var vehiFreeList = null;	//已授权车辆列表
var vehiAllList = null;	//车辆列表
var lastSelectId = null;
var companys = [],parentCompanys=[],childCompanys=[];
var roles = [];
var myrole = null;
var sid = null;
var isMine = null;
var oldParentId = null;
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
		types.push(ttype);
		types.push(ttype);
		types.push(ttype);
		types.push('');
		length.push(20);
		length.push(20);
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
//	cleanSpelChar('input-name');
	cleanChar('.input-account');
	cleanChar('.input-password');
	cleanChar('.input-confirmPWD');
	$('.td-role').find('.span-tip').hide();
	//加载用户信息
	ajaxLoadUserInfo();
	if(type == 'add' || type == 'edit') {
		$('.submit','#toolbar-btn').on('click',function(){
			if(!checkParam()) {
				return;
			}
			var action = 'StandardUserAction_mergeUserAccount.action';
			var data = {};
			if(type == 'edit') {
				data.id = getUrlParameter('id');//$('.input-id').val();
			}
			if(type == 'add') {
				if(!checkPassword()) {
					return;
				}
				data.password = $(".input-password").val();
			}
			if(type == 'add' || type == 'edit') {
				data.name = $('.input-name').val();
				var company = {};
				company.id = $('#hidden-company').val();
				if(company.id != null || company.id != '') {
					data.company =company;
				}
				data.account = $(".input-account").val();
				var role = {};
				role.id = $('#hidden-role').val();
				if(role.id != null || role.id != '') {
					data.role =role;
				}
				data.validity = dateStrLongTime2Date($('.input-validity').val());
				data.status = $('#hidden-status').val();
				var vehicles = (vehiTree.getAllChecked()+'').split(",");
				var permits = [];
				for (var i = 0; i < vehicles.length; i = i + 1) {
					if (!vehiTree.isGroupItem(vehicles[i])) {
						permits.push(vehicles[i]);
					}
				}
				data.permits = permits.toString();
			}
			disableForm(true);
			$.myajax.showLoading(true, parent.lang.saving);
			$.myajax.jsonPost( action, data, false, function(json, success) {
				disableForm(false);
				$.myajax.showLoading(false);
				if (success) {
					W.doSaveUserInfoSuc();
				}
			});
		});
	}
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'userinfo'}).close();
	});
	if(type == 'add' || type == 'edit') {
		$('.reset','#toolbar-btn').on('click',function(){
			var url = 'OperationManagement/UserInfo.html?type='+type;
			if(type == 'edit') {
				url += '&id='+getUrlParameter('id');
			}
			$('.ui_dialog',parent.document).find('iframe').attr('src',url);
		});
	}
}

//加载用户信息
function ajaxLoadUserInfo() {
	if(type == 'add') {
		$.myajax.jsonGet('StandardUserAction_loadCompanyVehicleList.action', function(json,action,success){
			if(success) {
				companys = json.companys;
				roles = json.roles;
				loadUserInfo();
				addVehicleTree(companys,parent.companyId,json.partVehis,null);
			};
		}, null);
	}else {
		disableForm(true);
		$.myajax.showLoading(true, parent.lang.loading, this);
		$.myajax.jsonGetEx('StandardUserAction_findUserAccount.action?id='+getUrlParameter('id'), function(json,action,success){
			if (success) {
				var user_ = json.user;
				if (!$.isEmptyObject(user_)) {
					myrole = user_.role;
					var company_ = json.company;
					var myVehicles_ = json.myVehicles;
					if(company_) {
						$.myajax.jsonGet('StandardUserAction_loadCompanyVehicleList.action', function(json,action,success){
							if(success) {
								roles = json.roles;
								var partVehis = json.partVehis;
								companys = json.companys;
								parentCompanys = [];
								childCompanys = [];
								for(var i = 0;i < companys.length; i++) {
									if(companys[i].id == company_.id){
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
								if(type == 'edit') {
									addVehicleTree(childCompanys,company_.parentId,partVehis,myVehicles_);
							
								}
							}
						}, null);
						oldCompanyId = company_.id;
					}	
				}
			}
			$.myajax.showLoading(false);
			disableForm(false);
		});
	}
}

function loadUserInfo(params){
	var sexs = getSex();
	var status = getStatus();
	if(type == 'add') {
		for(var i = 0;i < companys.length; i++) {
			if(companys[i].id == parent.companyId) {
				companys.splice(i,1);
			}
		}
		sid = parent.companyId;
	}else {
		companys = parentCompanys;
		sid = parent.companyId;
	}

	if(type == 'add' || type == 'edit') {
		var userRoles = roles;
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
			$(".input-validity").val(dateCurDateBeginString());
			$(".input-validity").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
			$(".input-birthday").val(dateCurDateBeginString());
			$(".input-birthday").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
		}else if(type == 'edit') {
			isMine = params.isMine;
			if(isMine == 1) {
				if(params.company != null) {
					$('#company_tree').remove();
					$('#combox-company').val(params.company.name);
					$('#combox-company').get(0).disabled = true;
					$('.td-company').append('<input id="hidden-company" type="hidden" name="company" value="'+params.company.id+'"/>');
				}
			}else {
				if(params.company != null) {
					$('#combox-company').val(params.company.name);
					$('#hidden-company').val(params.company.id);
				}
			}
			$(".input-account").val(params.account);
		//	$(".input-account").get(0).disabled = true;
			$('.input-name').val(params.name);
		//	$(".input-name").get(0).disabled = true;
			$('.td-name').append('<input class="input-id" type="hidden" name="id" value="'+params.id+'"/>');
			$('.input-validity').val(dateFormat2TimeString(new Date(params.validity)));
			$('.input-validity').click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
			if(isMine == 1) {
				$('#select-role').remove();
				if(params.role != null){
					$('#combox-role').val(params.role.name);
					$('#combox-role').get(0).disabled = true;
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
			$('#combox-status').val(getArrayName(status,params.status));
			$('#hidden-status').val(params.status);
	//		$('#combox-sex').val(getArrayName(params.sex));
	//		$('#hidden-sex').val(params.sex);
	//		$('.input-birthday').val(params.birthday);
	//		$(".input-birthday").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
	//		$('.input-linkPhone').val(params.linkPhone);
	//		$('.input-IDCard').val(params.IDCard);
	//		$('#textArea-remark').val(params.remark);
		}
	}else {
		if(params.company != null) {
			$('.td-company').append(params.company.name);
		}
		$(".td-account").append(params.account);
		$('.td-name').append(params.name);
		$('.td-validity').append(dateFormat2TimeString(new Date(params.validity)));
		if(params.role != null){
			$('.td-role').append(params.role.name);
		}
		$('.td-status').append(getArrayName(status,params.status));
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
	var pwd = $('.input-password').val();
	var confirmPWD = $('.input-confirmPWD').val();
	if(pwd != confirmPWD) {
		$('.confirmPWDTip').text(parent.lang.msg_password_not_same);
		$('.input-confirmPWD').focus();
		return false;
	}
	return true;
}

function LoadTreeItem(companys,companyId,partVehis,myVehicles) {
	vehiGroupList = partVehis == null ? [] : partVehis;
	vehiFreeList = myVehicles == null ? [] : myVehicles;
	vehiAllList = partVehis;
	vehiTree.deleteItem(vehiTree.getTreeGroupId(oldParentId), false);
	vehiTree.fillGroup(companys,companyId, parent.lang.all_vehicles);
	vehiTree.fillVehicle(vehiGroupList);
	//更新授权列表
	for (var i = 0; i < vehiFreeList.length; i = i + 1) {
		vehiTree.setCheck(vehiFreeList[i].parentId, true);
	}
	oldParentId = companyId;
}

/**
 * 加载车辆树结构
 */
function addVehicleTree(companys,companyId,partVehis,myVehicles) {
	$('#vehicle-authorize .integ_tab').remove();
	var content = '<div class="vehi-group-area">';
	content += '	<div style="float:left;">';
	content += '		<div>';
	content += '		<span>'+parent.lang.plate_number+'</span>  <input class="unauVehiIdno" style="margin-left:5px;"/>';
	content += '		</div>';
	content += '		<div id="vehicle_tree" class="area">';
	content += '		</div>';
	content += '	</div>';
	content += '</div>';
	$('#vehicle-authorize .panel-body').append(content);
	
	$('#vehicle-authorize').show();
	
	//分配权限的车辆
	vehiTree = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
	vehiTree.enableCheckBoxes(1);
	vehiTree.enableThreeStateCheckboxes(true);
	vehiTree.setImagePath("../../../js/dxtree/imgs/");
	$('#vehicle_tree').css('overflow','auto');

	LoadTreeItem(companys,companyId,partVehis,myVehicles);

	$('.unauVehiIdno').on('input propertychange',function(){
		if (searchTimer == null) {
			searchTimer = setTimeout(function() {
				var name = $.trim($('.unauVehiIdno').val());
				if (name !== "") {
					vehiTree.searchVehicle(name);
				}
				searchTimer = null;
			}, 200);
		}
	});
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
			disableForm(true);
			$.myajax.showLoading(true, parent.lang.loading, this);
			$.myajax.jsonGetEx('StandardUserAction_getPermit.action?cid='+id, function(json,action,success){
				if (success) {
					var company_ = json.company;
					var partVehis_ = json.partVehis;
					var myVehicles_ = json.myVehicles;
					$.myajax.jsonGet('StandardUserAction_loadCompanyVehicleList.action', function(json,action,success){
						if(success) {
							roles = json.roles;
							companys = json.companys;
							parentCompanys = [];
							childCompanys = [];
							for(var i = 0;i < companys.length; i++) {
								if(companys[i].id == company_.id){
									parentCompanys.push(companys[i]);
									childCompanys.push(companys[i]);
								};
							}
							for(var i = 0;i < parentCompanys.length; i++) {
								getPartCompanys(companys,parentCompanys,parentCompanys[i].parentId);
							};
							for(var i = 0;i < childCompanys.length; i++) {
								getChildCompanys(companys,childCompanys,childCompanys[i].id);
							}
							
							LoadTreeItem(childCompanys,company_.parentId,partVehis_,myVehicles_);
							if(isMine != 1) {
								$.myajax.jsonGetEx('StandardRoleAction_loadRoles.action?type=0&cid='+id, function(json,action,success){
									if (success) {
										if (!$.isEmptyObject(json.infos)) {
											var userRoles = json.infos;
											var rlg = true;
											for(var i = 0; i < userRoles.length; i++) {
												if(myrole != null && userRoles[i].id == myrole.id) {
													rlg = false;
												}
											}
											if(rlg && myrole != null) {
												userRoles.push(myrole);
											}
											$('#select-role').remove();
											$('.td-role').empty();
											$('.td-role').flexPanel({
												ComBoboxModel :{
													input : {name : 'role',pclass : 'buttom',bgicon : 'true',hidden: true},
													combox: 
														{name : 'role', option : arrayToStr(userRoles)}
												}	
											});
										}
									}
								});
							}
						};
					}, null);
				}
				$.myajax.showLoading(false);
				disableForm(false);
			});
		}
	}
}
//function disableForm(flag){}