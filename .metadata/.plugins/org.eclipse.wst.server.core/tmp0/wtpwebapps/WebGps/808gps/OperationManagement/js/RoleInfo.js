var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var uid = getUrlParameter('uid');
var id = getUrlParameter('id');
var companyid = getUrlParameter('companyid');
var companyname = decodeURIComponent(getUrlParameter('companyname'));
var sid = 0; 
var screenWidth = window.screen.availWidth;
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
	
	for(var i = 0; i < parent.companys.length; i++) {
		if(parent.companys[i].id == parent.companyId) {
			sid = parent.companys[i].parentId;
		}
	}
	addCompanyTree(parent.companys,sid);
	if(type == 'add' || type == 'edit') {
		$('.td-company').append('<span class="span-tip red" style="float:left;">*</span>');
		if(parent.myUserRole.isAdmin()) {
			$('.td-company').find('.span-tip').text('');
		}
	}
	
	if(uid != null && type == 'edit' && uid != '') {
		var user_role = '';
		user_role += '<div style="float:left;padding:5px 10px;">';
		user_role += '<span style="float: left;">'+parent.lang.login_account+'</span>';
		user_role += '<input id="input-userAccount" type="text" name="account" disabled>';
		user_role += '</div>';
		user_role += '<div style="float:left;padding:5px 10px;">';
		user_role += '<span style="float: left;">'+parent.lang.user_name+'</span>';
		user_role += '<input id="input-userName" type="text" name="name" disabled>';
		user_role += '</div>';
		$('#user-role').append(user_role);
	}

	$('#spanRoleName').text(parent.lang.role_name);
	$('#allSelect .allSel').attr('title', parent.lang.selectAll);
	$('#allSelect .noSel').attr('title', parent.lang.uncheckAll);
	$('.tipCompany').text(parent.lang.labelCompany);
	$('#allSelect .isAllSel').text(parent.lang.isAllSel);
	$('#spantitle').text(parent.lang.required_information);
	
	$.myajax.jsonGet('StandardRoleAction_getRolePage.action', function(json,action,success){
		if(success) {
			var mod = [];
			var widths = [screenWidth/4+'px',screenWidth/4+'px',screenWidth/4+'px',screenWidth/4+'px'];
			$.each(json.pages,function(i, page){
				var display = [];
				var name = [];
				$.each(page.listSubPrivi,function(j, subPage){
					display.push(getPageDisplay(subPage.privi));
					name.push(subPage.name);
				});
				mod.push({
					title :{display: getPageDisplay(page.privi),pid : page.name, pclass : 'clearfix',hide:false,tabshide:true},
					colgroup:{width: widths},
					tabs: {display: display,name: name}
				});
			});
			$('#info-mid-table').flexPanel({
				CheckBoxGroupModel : mod
			});
			
			/*$('#info-mid-table .panel-head').each(function(){
				var allsel  = '<span id="allSelect">';
					allsel += '	  <span class="allSel">'+parent.lang.selectAll+'</span>';
					allsel += '&nbsp|&nbsp';
					allsel += '	  <span class="noSel">'+parent.lang.uncheckAll+'</span>';
					allsel += '</span>';
				$(this).append(allsel);
			});*/

			if(type == 'add' || type == 'edit') {
				$('#allSelect .allSel').on('click',function(){
					$('#info-mid-table .h3').each(function() {
						$(this).css('background','url(../../js/dxtree/imgs/iconCheckAll.gif) no-repeat scroll 5px 7px');
						$(this).addClass('all');
					});
					$('#info-mid-table input').each(function() {
						this.checked = true;
					});
				});
				$('#allSelect .noSel').on('click',function(){
					$('#info-mid-table .h3').each(function() {
						$(this).css('background','url(../../js/dxtree/imgs/iconUncheckAll.gif) no-repeat scroll 5px 7px');
						$(this).removeClass('all');
					});
					$('#info-mid-table input').each(function() {
						this.checked = false;
					});
				});
			}
	//		cleanSpelChar('.role-name');
			
			$('#info-mid-table .h3').each(function() {
				$(this).on('click',function() {
					if($(this).hasClass('all')){
						$(this).css('background','url(../../js/dxtree/imgs/iconUncheckAll.gif) no-repeat scroll 5px 7px');
						$(this).parent().next('.panel-body').find('input').each(function() {
							this.checked = false;
						});
					}else {
						$(this).css('background','url(../../js/dxtree/imgs/iconCheckAll.gif) no-repeat scroll 5px 7px');
						$(this).parent().next('.panel-body').find('input').each(function() {
							this.checked = true;
						});
					}
					$(this).toggleClass('all');
				});
			}); 
			
			$('#info-mid-table li').each(function() {
				var obj = this;
				$(this).find('input').each(function() {
					$(this).on('click',function() {
						var flag = 0;
						var length = 0;
						$(obj).find('input').each(function() {
							length ++;
							if(this.checked) {
								flag ++;
							}
						});
						if(flag == 0) {
							$(obj).find('.h3').removeClass('all');
							$(obj).find('.h3').css('background','url(../../js/dxtree/imgs/iconUncheckAll.gif) no-repeat scroll 5px 7px');
						}else if(flag == length) {
							$(obj).find('.h3').addClass('all');
							$(obj).find('.h3').css('background','url(../../js/dxtree/imgs/iconCheckAll.gif) no-repeat scroll 5px 7px');
						}else {
							$(obj).find('.h3').removeClass('all');
							$(obj).find('.h3').css('background','url(../../js/dxtree/imgs/iconCheckGray.gif) no-repeat scroll 5px 7px');
						}
					});
				}); 
			});
			
			//加载权限信息
			ajaxLoadRoleInfo();
		};
	}, null);
	
	$('.submit','#toolbar-btn').on('click',function(){
		var data = {};
		var str = '';
		$('#info-mid-table .panel-body input').each(function(){
			var name = $.trim($(this).attr('name'));
			var value = $.trim($("input[name='"+name+"']:checked").val());
			if(value != null && value != '') {
				str += ','+ value;
			}
		});
		if(str != '') {
			str += ','
		}
		if(type == 'edit') {
			data.id = id;
		}
		data.privilege = str;
		data.name = $.trim($('#role-name').val());
		if(data.name == null || data.name == '') {
			$('#role-name').parent().find('.span-tip').text(parent.lang.not_be_empty);
			$('#role-name').focus();
			return;
		}else {
			$('#role-name').parent().find('.span-tip').text('*');
		}
		
		if($('#hidden-company').val() == null || $('#hidden-company').val() == '') {
			if(parent.myUserRole.isAdmin() && ($('#hidden-company').val() == null || $('#hidden-company').val() == '')) {
				$('.td-company').find('.span-tip').text("*");
			}else {
				$('.td-company').find('.span-tip').text(parent.lang.errCompanyNotExists);
				$('#required-area .panel-body').addClass('show');
				$('#combox-company').focus();
				return;
			}
		}
		
		var company = {};
		company.id = $.trim($('#hidden-company').val());
		data.company = company;
		
		var action = 'StandardRoleAction_mergeUserRole.action';
		if(uid != null && uid != '') {
			action += '?uid='+uid;
		}
		disableForm(true);
		$.myajax.showLoading(true, parent.lang.saving);
		$.myajax.jsonPost( action, data, false, function(json, success) {
			disableForm(false);
			$.myajax.showLoading(false);
			if (success) {
				if(uid == null || uid == '') {
					W.doSaveRoleSuc(data);
				}
				W.$.dialog({id:'roleinfo'}).close();
				$.dialog.tips(parent.lang.saveok, 1);
			}
		});
	});
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'roleinfo'}).close();
	});
	$('.reset','#toolbar-btn').on('click',function(){
		if(uid != null && type == 'edit' && uid != '') {
			$('.ui_dialog',parent.document).find('iframe').attr('src','OperationManagement/RoleInfo.html?uid='+uid+'&type=edit');
		}else{
			if(type == 'add') {
				$('.ui_dialog',parent.document).find('iframe').attr('src','OperationManagement/RoleInfo.html?type=add');
			}else if(type == 'edit') {
				$('.ui_dialog',parent.document).find('iframe').attr('src','OperationManagement/RoleInfo.html?id='+ id +'&type=edit');
			}
		}
	});
	
	$('#jbInfo .head-control').on('click',function(){
		$(this).toggleClass('current');
		$(this).parent().next('.panel-body').toggleClass('show');
	});
}

function ajaxLoadRoleInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	if(type == 'add') {
		loadRoleInfo();
	}else {
		var action = '';
		if(type == 'edit' && uid != null && uid != '') {
			action = 'StandardUserAction_findUserAccount.action?id='+uid;
		}else {
			action = 'StandardRoleAction_findUserRole.action?id='+ id;
		}
		$.myajax.jsonGetEx(action, function(json,action,success){
			if (success) {
				if(type == 'edit' && uid != null && uid != '') {
					if (!$.isEmptyObject(json.user)) {
						$('#input-userAccount').val(json.user.act);
						$('#input-userName').val(json.user.nm);
						if(json.user.role != null) {
							id = json.user.role.id;
						}
						loadRoleInfo(json.user.role);
						if(json.user.ism != null && json.user.ism == 1) {
							$('#info-mid-table .panel-body input').each(function(){
								this.disabled = true;
							});
							$('.submit','.btn-group').parent().remove();
						}
					}
				}else {
					if (!$.isEmptyObject(json.role)) {
						loadRoleInfo(json.role);
					}
				}
			}
		});
	}
	$.myajax.showLoading(false);
	disableForm(false);
}

function loadRoleInfo(params) {
	if(type != 'add') {
		var roles = [];
		if(params && params.privilege) {
			roles = params.privilege.split(',');
		}
		if(params && params.name) {
			$("#role-name").val(params.name);
		}
		for(var i = 0; i < roles.length; i++) {
			if($('.checkbox-'+roles[i]).get(0)) {
				$('.checkbox-'+roles[i]).get(0).checked = true;
			}
		}
		if(params.company) {
			if(!parent.myUserRole.isAdmin() && params.company.id == -1) {
				id = '';
				$('#combox-company').val('');
				$('#hidden-company').val('');
			}else {
				$('#combox-company').val(getArrayName(parent.companys,params.company.id));
				$('#hidden-company').val(params.company.id);
			}
		}
		
		checkAllGray();
		if(type != 'edit') {
			$('#info-mid input').each(function(){
				this.disabled = true;
			});
			$('#info-mid-table .h3').each(function() {
				$(this).unbind('click');
			});
			$('#company_tree').remove();
			$('#combox-company').get(0).disabled = true;
			$('#allSelect').remove();
		}
	}else{
		if(companyid != null && companyid != '' && companyname != null && companyname != ''){
			$('#combox-company').val(companyname);
			$('#combox-company').get(0).disabled = true;
			$('#hidden-company').val(companyid);
		}
		$('#info-mid-table li').each(function() {
			if($(this).attr('id') != 'teminal' && $(this).attr('id') != 'operationManagement' && $(this).attr('id') != 'userManagement' && $(this).attr('id') != 'rule') {
				$(this).find('input').each(function() {
					this.checked = true;
				});
				$(this).find('.h3').addClass('all');
				$(this).find('.h3').css('background','url(../../js/dxtree/imgs/iconCheckAll.gif) no-repeat scroll 5px 7px');
			}
		});
	}
}

//判断是否全选
function checkAllGray() {
	$('#info-mid-table li').each(function() {
		var flag = 0;
		var length = 0;
		$(this).find('input').each(function() {
			length ++;
			if(this.checked) {
				flag ++;
			}
		});
		if(flag == 0) {
			$(this).find('.h3').removeClass('all');
			$(this).find('.h3').css('background','url(../../js/dxtree/imgs/iconUncheckAll.gif) no-repeat scroll 5px 7px');
		}else if(flag == length) {
			$(this).find('.h3').addClass('all');
			$(this).find('.h3').css('background','url(../../js/dxtree/imgs/iconCheckAll.gif) no-repeat scroll 5px 7px');
		}else {
			$(this).find('.h3').removeClass('all');
			$(this).find('.h3').css('background','url(../../js/dxtree/imgs/iconCheckGray.gif) no-repeat scroll 5px 7px');
		}
	});
}

function getPageDisplay(key) {
	var name = '';
	switch (parseInt(key, 10)) {
	case 10:
		name = parent.lang.playBack;
		break;
	case 11:
		name = parent.lang.location_positioning;
		break;
	case 12:
		name = parent.lang.statistical_reports;
		break;
	case 13:
		name = parent.lang.operations_management;
		break;
	case 14:
		name = parent.lang.Internal_management;
		break;
	case 15:
		name = parent.lang.rule_set;
		break;
	case 16:
		name = parent.lang.track_playback;
		break;
	case 17:
		name = parent.lang.real_time_video;
		break;
	case 20:
		name = parent.lang.operations_management;
		break;
	case 21:
		name = parent.lang.company_info_management;
		break;
	case 22:
		name = parent.lang.role_info_management;
		break;
	case 23:
		name = parent.lang.user_info_management;
		break;
	case 24:
		name = parent.lang.SIM_info_management;
		break;
	case 25:
		name = parent.lang.device_info_management;
		break;
	case 26:
		name = parent.lang.vehicle_info_management;
		break;
	case 27:
		name = parent.lang.driver_info_management;
		break;
	case 28:
		name = parent.lang.vehiTeam_info_management;
	case 29:
		name = parent.lang.vehiSafe_info_management;
		break;
	case 210:
		name = parent.lang.vehiMaturity_info_management;
		break;
	case 211:
		name = parent.lang.document_management;
		break;
	case 212:
		name = parent.lang.line_management;
		break;
	case 30:
		name = parent.lang.audio_and_video_surveillance;
		break;	
	case 31:
		name = parent.lang.video_monitoring;
		break;
	case 32:
		name = parent.lang.sound_playback;
		break;
	case 33:
		name = parent.lang.way_intercom;
		break;
	case 34:
		name = parent.lang.audio_monitoring;
		break;
	case 35:
		name = parent.lang.front_end_capture;
		break;
	case 36:
		name = parent.lang.PTZ_control;
		break;
	case 37:
		name = parent.lang.realtime_video;
		break;
	case 38:
		name = parent.lang.open_PTZ_lights;
		break;
	case 40:
		name = parent.lang.location_positioning;
		break;
	case 41:
		name = parent.lang.manage_my_maps;
		break;
	case 42:
		name = parent.lang.sharing_companies_map;
		break;
	case 43:
		name = parent.lang.map_monitoring;
		break;
	case 44:
		name = parent.lang.track_playback;
		break;
	case 45:
		name = parent.lang.video_query;
		break;	
	case 50:
		name = parent.lang.log_query;
		break;	
	case 51:
		name = parent.lang.alarm_log;
		break;
	case 52:
		name = parent.lang.user_log;
		break;
	case 60:
		name = parent.lang.terminal_control;
		break;
	case 61:
		name = parent.lang.parameter_configuration;
		break;
	case 62:
		name = parent.lang.deviceView;
		break;
	case 63:
		name = parent.lang.remote_upgrade;
		break;
	case 64:
		name = parent.lang.traffic_of_3G_parameter_configuration;
		break;
	case 65:
		name = parent.lang.motion_detection_configuration;
		break;
	case 66:
		name = parent.lang.other_control_include;
		break;
	case 70:
		name = parent.lang.system_configuration;
		break;	
	case 71:
		name = parent.lang.alarm_linkage;
		break;
	case 72:
		name = parent.lang.alarm_shielded;
		break;
	case 73:
		name = parent.lang.system_settings;
		break;
	case 74:
		name = parent.lang.video_settings;
		break;
	case 80:
		name = parent.lang.function_user_management;
		break;	
	case 81:
		name = parent.lang.report_speed_title;
		break;	
	case 82:
		name = parent.lang.report_navNormalTrackDetail;
		break;
	case 83:
		name = parent.lang.report_sms_detail;
		break;
	case 90:
		name = parent.lang.report_login_title;
		break;	
	case 91:
		name = parent.lang.report_vehicle_login_sumary;
		break;
	case 92:
		name = parent.lang.report_vehicle_login_detail;
		break;
	case 93:
		name = parent.lang.report_company_dailyonline_detail;
		break;
	case 94:
		name = parent.lang.report_vehicle_monthlyonline_detail;
		break;
	case 95:
		name = parent.lang.report_online_rate_detail;
		break;
	case 100:
		name = parent.lang.alarm_report;
		break;
	case 101:
		name = parent.lang.report_alarm_summary;
		break;
	case 102:
		name = parent.lang.report_alarm_detail;
		break;
	case 110:
		name = parent.lang.report_navOil;
		break;	
	case 111:
		name = parent.lang.report_navOilTrackDetail;
		break;
	case 112:
		name = parent.lang.report_navOilExceptionDetail;
		break;
	case 120:
		name = parent.lang.report_licheng_title;
		break;	
	case 121:
		name = parent.lang.report_liCheng_summary;
		break;
	case 122:
		name = parent.lang.report_liCheng_detail;
		break;
	case 130:
		name = parent.lang.report_park_title;
		break;	
	case 131:
		name = parent.lang.report_park_summary;
		break;	
	case 132:
		name = parent.lang.report_park_detail;
		break;
	case 140:
		name = parent.lang.report_fence_title;
		break;	
	case 141:
		name = parent.lang.report_fence_summary;
		break;	
	case 142:
		name = parent.lang.report_fence_detail;
		break;
	case 150:
		name = parent.lang.report_storage;
		break;	
	case 151:
		name = parent.lang.report_storage_navAlarmDiskerror;
		break;	
	case 152:
		name = parent.lang.report_storage_navAlarmHighTemperature;
		break;
	case 153:
		name = parent.lang.report_storage_harddiskStatusInformationDetail;
		break;
	case 160:
		name = parent.lang.report_equipment;
		break;	
	case 161:
		name = parent.lang.report_equipment_vehicleReleaseDetails;
		break;	
	case 162:
		name = parent.lang.report_equipment_offlineRecordingEquipmentUpgrade;
		break;
	case 170:
		name = parent.lang.report_media;
		break;
	case 171:
		name = parent.lang.report_vehicle_photo;
		break;
	case 172:
		name = parent.lang.report_vehicle_audio;
		break;
	case 173:
		name = parent.lang.report_vehicle_video;
		break;
	case 180:
		name = parent.lang.report_data;
		break;
	case 181:
		name = parent.lang.report_data;
		break;
	case 190:
		name = parent.lang.statistical_reports;
		break;
	case 191:
		name = parent.lang.report_normal;
		break;
	case 192:
		name = parent.lang.report_login_title;
		break;
	case 193:
		name = parent.lang.alarm_report;
		break;
	case 194:
		name = parent.lang.report_navOil;
		break;
	case 195:
		name = parent.lang.report_licheng_title;
		break;
	case 196:
		name = parent.lang.report_park_title;
		break;
	case 197:
		name = parent.lang.report_fence_title;
		break;
	case 198:
		name = parent.lang.report_storage;
		break;
	case 199:
		name = parent.lang.report_equipment;
		break;
	case 1990:
		name = parent.lang.report_media;
		break;
	case 1991:
		name = parent.lang.report_data;
		break;
	case 1992:
		name = parent.lang.log_query;
		break;
	case 1993:
		name = parent.lang.malfunction_report;
		break;
	case 1994:
		name = parent.lang.video_report;
		break;
	case 1995:
		name = parent.lang.io_report;
		break;
	case 1996:
		name = parent.lang.driving_report;
		break;
	case 1997:
		name = parent.lang.userOnline_report;
		break;
	case 1998:
		name = parent.lang.people_report;
		break;
	case 1999:
		name = parent.lang.temp_report;
		break;
	case 19991:
		name = parent.lang.door_report;
		break;
	case 19992:
		name = parent.lang.signin_report;
		break;
	case 19993:
		name = parent.lang.trip_month_report;
		break;
	case 19994:
		name = parent.lang.trip_daily_report;
		break;
	case 19995:
		name = parent.lang.trip_detail_report;
		break;
	case 19996:
		name = parent.lang.trip_station_report;
		break;
	case 19997:
		name = parent.lang.tire_pressure_monitoring_report;
		break;
	}	
	return name;
}

/**
 * 公司树双击事件
 */
function companyDblClickEvent() {
	var selId = companyTree.getSelectedItemId();
	if(selId != '*_0') {
		var id =selId.split('_')[1];
		$('#company_tree').hide();
		$('.td-company #combox-company').val(getArrayName(parent.companys,id));
		$('.td-company #hidden-company').val(id);
		$('.td-company .span-tip').text('*');
	}else {
		$('.td-company #combox-company').val(''/*parent.lang.all_companies*/);
		$('.td-company #hidden-company').val('');
		$('#company_tree').hide();
	}
}
//function disableForm(flag){}