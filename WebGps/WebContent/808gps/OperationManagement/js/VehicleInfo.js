var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var deviceTreeList = new Array();
var simTreeList = new Array();
var driverTree = null;
var companys = [],sims=[],devices=[],drivers=[];
var sid = null;
var dev_id = null;
var maxCount = 1;
var treeName = null;
var isTreeOut = true;

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
	if(type == 'add' || type == 'edit') {
		ttype = 'input';
	}
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip: '',hide:false,tabshide:false},
				colgroup:{width:['150px','325px','150px','325px']},
				tabs:{
					display: [parent.lang.plate_number,parent.lang.vehicle_color,parent.lang.belong_company,parent.lang.license_plate_type,
					          parent.lang.use_status,parent.lang.driver,parent.lang.vehicle_brand,
						parent.lang.vehicle_type,parent.lang.vehicle_purposes,
						parent.lang.agreement_start_date,parent.lang.agreement_period + parent.lang.agreement_period_unit,
						parent.lang.allowance_days,parent.lang.vehicle_icons,''],
					name : ['vehiIDNO','vehiColor','company','plateType','status','driver','vehiBand',
						'vehiType','vehiUse','payBegin','payPeriod','payDelayDay','vehicleIcon',''],
					type:[ttype,ttype,,,,,ttype,ttype,ttype,ttype,ttype,ttype,,],
					length:[20,10,,,,,20,20,20,10,2,2,,]
				}
			},{
				title :{display: parent.lang.device_information,pid : 'hid-device-info',hide:true,tabshide:true},
				colgroup:{width:['150px','325px','150px','325px']},
				tabs:{
					display: [parent.lang.device_number,'',parent.lang.SIM_card_number,'',
						parent.lang.channel_parameters,'',parent.lang.IOIn_parameters,'',/*parent.lang.IOOut_parameters,'',*/
						parent.lang.temperature_sensor_parameters,'',parent.lang.peripheral_modules,''],
					name : ['device','','simInfo','','chn','','ioIn','',/*'ioOut','',*/'temp','','module',''],
					type:[],
					length:[]
				}
			},{
				title :{display: parent.lang.device_information,pid : 'device-info',hide:false,tabshide:false},
				colgroup:{width:['150px','325px','150px','325px']},
				tabs:{
					display: [parent.lang.device_number,'',parent.lang.SIM_card_number,'',
						parent.lang.channel_parameters,'',parent.lang.IOIn_parameters,'',/*parent.lang.IOOut_parameters,'',*/
						parent.lang.temperature_sensor_parameters,'',parent.lang.peripheral_modules,''],
					name : ['device','','simInfo','','chn','','ioIn','',/*'ioOut','',*/'temp','','module',''],
					type:[],
					length:[]
				}
			}
		]
	
	});
	//加载车辆图片
	addVehicleImg();
//	$('.td-payMonth').append('<input type="checkbox" style="float: left;" name="payMonth" value="1" id="checkbox-payMonth" class="checkbox-payMonth"/>');
	if(type == 'add' || type == 'edit') {
		addTips('.td-vehiIDNO','*');
		addTips('.td-vehiColor','*');
		addTips('.td-company','*');
		addTips('.td-plateType','*');
		addTips('.td-terminalType','*');
		addTips('.td-status','*');
		addTips('.td-driver','');
		$('#device-info .panel-body').append('<div><span id="addDev" class="operat" onclick="addDev()">'+parent.lang.vehicle_addDevice+'</span></div>');
		$('#device-info .panel-body .integ_tab .integ_tbody').prepend('<tr class="tr_dev"><td colspan="4"><input type="hidden" class="input-relation-id"/><span class="dev">'+parent.lang.device+'1('+parent.lang.mainDevice+')</span><span class="delDev operat" onclick="delDev(this)" style="float:right;display:none;">'+parent.lang.del+'</span></th></td>');
		$('#hid-device-info .panel-body .integ_tab .integ_tbody').prepend('<tr class="tr_dev"><td colspan="4"><input type="hidden" class="input-relation-id"/><span class="dev">'+parent.lang.device+'1</span><span class="delDev operat" onclick="delDev(this)" style="float:right;display:none;">'+parent.lang.del+'</span></th></td>');
		if(parent.isAdmin != 0 && parent.isAllowManage == 0) {
			$('#device-info .td-simInfo').append('<span class="span-tip" style="color:red;margin-right:20px;">*</span><span style="color:red;">'+parent.lang.vehicle_sim_not_tip+'</span>');
			$('#device-info .td-device').append('<span class="span-tip" style="color:red;margin-right:20px;">*</span>');
			$('#hid-device-info .td-simInfo').append('<span class="span-tip" style="color:red;margin-right:20px;">*</span><span style="color:red;">'+parent.lang.vehicle_sim_not_tip+'</span>');
			$('#hid-device-info .td-device').append('<span class="span-tip" style="color:red;margin-right:20px;">*</span>');
		}else {
			$('#device-info .td-simInfo').append('<span class="span-tip" style="color:red;margin-right:20px;">*</span><span style="color:red;">'+parent.lang.vehicle_sim_not_tip+'</span>');
			$('#device-info .td-device').append('<span class="span-tip" style="color:red;margin-right:20px;">*</span><span style="color:red;">'+parent.lang.vehicle_device_not_tip+'</span>');
			$('#hid-device-info .td-simInfo').append('<span class="span-tip" style="color:red;margin-right:20px;">*</span><span style="color:red;">'+parent.lang.vehicle_sim_not_tip+'</span>');
			$('#hid-device-info .td-device').append('<span class="span-tip" style="color:red;margin-right:20px;">*</span><span style="color:red;">'+parent.lang.vehicle_device_not_tip+'</span>');
		}
	}else {
		$('#device-info .panel-body .integ_tab .integ_tbody').prepend('<tr class="tr_dev"><td colspan="4"><input type="hidden" class="input-relation-id"/><span class="dev">'+parent.lang.device+'1</span></th></td>');
		$('#hid-device-info .panel-body .integ_tab .integ_tbody').prepend('<tr class="tr_dev"><td colspan="4"><input type="hidden" class="input-relation-id"/><span class="dev">'+parent.lang.device+'1</span></th></td>');
	}
	$('#device-info .panel-body .integ_tab .integ_tbody').attr('id','dev_1');
	$('#device-info .panel-body .integ_tab .integ_tbody').attr('data-id','1');
	$('#device-info .panel-body .integ_tab .integ_tbody').addClass('dev_1');
	$('#device-info .panel-body .integ_tab .integ_tbody').attr('data-index','1');

	//加载车辆信息
	ajaxLoadVehicleInfo();
	
	//限制输入
//	$('#info-mid-table .form-input').each(function() {
//		var name = $(this).attr('data-name');
//		if(name!=null && name!=''&& name!='payPeriod' && name!='payDelayDay' && name != 'payBegin') {
//			cleanSpelChar('.input-'+name);	
//		}
//	});
	enterDigital('.input-payPeriod');
	enterDigital('.input-payDelayDay');

	$('.submit','#toolbar-btn').on('click',VehiSubmit);
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'vehicleinfo'}).close();
	});
	$('.reset','#toolbar-btn').on('click',function(){
		var url = 'OperationManagement/VehicleInfo.html?type='+type;
		if(type == 'edit') {
			url += '&id='+getUrlParameter('id');
		}
		$('.ui_dialog',parent.document).find('iframe').attr('src',url);
	});

	$('body').on('click',function(){
		if(isTreeOut && dev_id && $('#'+treeName+'_tree'+dev_id).css('display') != 'none'){
			if(treeName == 'simInfo') {
				checkTreeParam(simTreeList[dev_id],sims,dev_id,treeName,parent.lang.errSIMNotExists);
			}else if(treeName == 'device') {
				checkTreeParam(deviceTreeList[dev_id],devices,dev_id,treeName,parent.lang.errDeviceNotExists);
			}else if(treeName == 'driver') {
				checkTreeParam(driverTree,drivers,dev_id,treeName,parent.lang.errDriverNotExists);
			}
		} 
		$('#info-body .vehiselect').each(function(){
			var idname = $(this).attr('id');
			var midname = idname.split('_')[0];
			var dex = parseInt(idname.substr((midname+'_tree').length,idname.length));
			if(dex && $(this).attr('id') != treeName+'_tree'+dev_id && $(this).css('display') != 'none') {
				if(midname == 'simInfo') {
					checkTreeParam(simTreeList[dex],sims,dex,midname,parent.lang.errSIMNotExists);
				}else if(midname == 'device') {
					checkTreeParam(deviceTreeList[dex],devices,dex,midname,parent.lang.errDeviceNotExists);
				}else if(midname == 'driver') {
					checkTreeParam(driverTree,drivers,dex,midname,parent.lang.errDriverNotExists);
				}
			}
		});
	});

}

function addTips(name,tips) {
	$(name).append('<span class="span-tip red">'+tips+'</span>');
}

function ajaxLoadVehicleInfo() {
	if(type == 'add') {
		$.myajax.jsonGet('StandardVehicleAction_loadCompanyDeviceList.action', function(json,action,success){
			if(success) {
				companys = json.companys;
				sims=json.sims;
				devices=json.devices;
				drivers=json.drivers;
				loadVehicleInfo();
			};
		}, null);
	}else {
		var action = 'StandardVehicleAction_findVehicle.action?id='+getUrlParameter('id');
		disableForm(true);
		$.myajax.showLoading(true, parent.lang.loading, this);
		$.myajax.jsonGetEx(action, function(json,action,success){
			if (success) {
				var vehicle_ = json.vehicle;
				var relations_ = json.relations;
				if (!$.isEmptyObject(json.vehicle)) {
					if(vehicle_.company.level == 2) {
						vehicle_.company = getParentCompany(parent.vehiGroupList,vehicle_.company.parentId);
					}
					if(type == 'edit') {
						$.myajax.jsonGet('StandardVehicleAction_loadCompanyDeviceList.action', function(json,action,success){
							if(success) {
								companys = json.companys;
								sims=json.sims;
								devices=json.devices;
								drivers=json.drivers;
								loadVehicleInfo(vehicle_,relations_);
							};
						}, null);
					}else {
						loadVehicleInfo(vehicle_,relations_);
					}
				}
			}
			$.myajax.showLoading(false);
			disableForm(false);
		});
	}
}

function loadVehicleInfo(params,relations) {
	if(relations && relations.length > 0) {
		var copy_device = $('#hid-device-info .panel-body .integ_tab .integ_tbody').clone();
		for(var i = 0; i < relations.length; i++) {
			if(type == 'edit') {
				var rlg = true;
				for(var j = 0; j < devices.length; j++) {
					if(relations[i].device != null && devices[j].id == relations[i].device.id) {
						rlg = false;
					}
				}
				if(rlg && relations[i].device != null) {
					var dev = {};
					dev.id = relations[i].device.id;
					dev.name = relations[i].device.devIDNO;
					dev.parentId = relations[i].device.company.id;
					dev.level = relations[i].device.simInfo.id;
					devices.push(dev);
				}
				rlg = true;
				for(var j = 0; j < sims.length; j++) {
					if(relations[i].device.simInfo != null && sims[j].id == relations[i].device.simInfo.id) {
						rlg = false;
					}
				}
				if(rlg && relations[i].device.simInfo != null) {
					var sim = {};
					sim.id = relations[i].device.simInfo.id; 
					sim.name = relations[i].device.simInfo.cardNum;
					sim.parentId = relations[i].device.simInfo.company.id;
					sims.push(sim);
				}
			}
			if(i > 0) {
				maxCount = maxCount + 1;
				copy_device.attr('id','dev_'+maxCount);
				copy_device.attr('data-id',maxCount);
				$('#device-info .panel-body .integ_tab').append(copy_device);
				seartsds();
			}
		}
		for(var i = 0; i < relations.length; i++) {
			var k = i+1;
			$('#device-info .panel-body .integ_tab .dev_'+k+' .input-relation-id').val(relations[i].id);
			if(type == 'edit') {
				addDeviceTree(devices,relations[i].device,i+1);
				if(relations[i].device != null) {
					addSIMTree(sims,relations[i].device.simInfo,i+1);
				}else {
					addSIMTree(sims,null,i+1);
				}
			}else {
				if(relations[i].device != null) {
					$('.dev_'+k+' .td-device').text(relations[i].device.devIDNO);
					if(relations[i].device.simInfo != null) {
						$('.dev_'+k+' .td-simInfo').text(relations[i].device.simInfo.cardNum);
					}
				}
			}
			addVehicleParams('chn',params.chnCount,params.chnName,relations[i].chnAttr,i+1);
			addVehicleParams('ioIn',params.ioInCount,params.ioInName,relations[i].ioInAttr,i+1);
		//	addVehicleParams('ioOut',params.ioOutCount,params.ioOutName,relations[i].ioOutAttr,i+1);
			addVehicleParams('temp',params.tempCount,params.tempName,relations[i].tempAttr,i+1);
			addModule(relations[i].module,i+1);
		}
	}else if(relations && relations.length == 0){
		if(type == 'edit') {
			addDeviceTree(devices,null,1);
			addSIMTree(sims,null,1);
		}else {
			$('.td-device').text('');
			$('.td-simInfo').text('');
		}
		addVehicleParams('chn',params.chnCount,params.chnName,null,1);
		addVehicleParams('ioIn',params.ioInCount,params.ioInName,null,1);
	//	addVehicleParams('ioOut',params.ioOutCount,params.ioOutName,null,1);
		addVehicleParams('temp',params.tempCount,params.tempName,null,1);
		addModule(null,1);
	}
	var plateTypes = getPlateTypes();
	var status = getStatus();
	if(type == 'add' || type == 'edit') {
		for(var i = 0; i < companys.length; i++) {
			if(companys[i].id == parent.companyId) {
				sid = companys[i].parentId;
			}
		}
		addCompanyTree(companys,sid);
		if(type=='add') {
			addDeviceTree(devices,null,1);
			addSIMTree(sims,null,1);
		}
		addDriverTree();
		$('.td-plateType').flexPanel({
			ComBoboxModel :{
				input : {name : 'plateType',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'plateType', option : arrayToStr(plateTypes)}
			}	
		});
			
		$('.td-status').flexPanel({
			ComBoboxModel :{
				input : {name : 'status',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'status', option : arrayToStr(status)}
			}	
		});
		$('.input-payBegin').addClass('Wdate');
		$('.input-payBegin').attr('name','payBegin');
		$('.input-payBegin').attr('id','payBegin');
		$('.input-payBegin').attr('readonly','readonly');
		$('.input-payBegin').css('width','70%'); 
		if(type == 'add') {
		    $(".input-payBegin").val(dateCurDateBeginString());
			$(".input-payBegin").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}); });
			$('#combox-plateType').val(getArrayName(plateTypes,1));
			$('#hidden-plateType').val(1);
			$('#combox-status').val(getArrayName(status,0));
			$('#hidden-status').val(0);
			addVehicleParams('chn',null,null,null,1);
			addVehicleParams('ioIn',null,null,null,1);
		//	addVehicleParams('ioOut',null,null,null,1);
			addVehicleParams('temp',null,null,null,1);
			addModule(null,1);
		}else if(type == 'edit') {
			$('.input-vehiIDNO').val(params.vehiIDNO);
			$('.input-vehiIDNO').get(0).disabled = true;
			$('.td-vehiIDNO').append('<input class="input-id" type="hidden" name="id" value="'+params.id+'"/>');
			if(params.company != null) {
				$('#combox-company').val(params.company.name);
				$('#hidden-company').val(params.company.id);
			}
			$('.input-vehiColor').val(params.vehiColor);
			
			$('#combox-plateType').val(getArrayName(plateTypes,params.plateType));
			$('#hidden-plateType').val(params.plateType);
			
			$('#combox-status').val(getArrayName(status,params.status));
			$('#hidden-status').val(params.status);
			if(params.icon) {
				$('.td-vehicleIcon #icon_'+params.icon+'').get(0).checked = true;
			}
			if(params.driver != null) {
				$('#combox-driver0').val(params.driver.name);
				$('#hidden-driver0').val(params.driver.id);
			}
			$('.input-vehiBand').val(params.vehiBand);
			$('.input-vehiType').val(params.vehiType);
			$('.input-vehiUse').val(params.vehiUse);
			$('.input-payBegin').val(dateFormat2TimeString(new Date(params.payBegin)));
			$(".input-payBegin").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}) });
			
			$('.input-payPeriod').val(params.payPeriod);
			$('.input-payDelayDay').val(params.payDelayDay);
	//		if(params.payMonth == 1) {
	//			$('.checkbox-payMonth').get(0).checked = true;
	//		}
	/*		if(params.device != null) {
				$('#combox-device').val(params.device.devIDNO);
				$('#hidden-device').val(params.device.id);
			}
			if(params.simInfo) {
				$('#combox-simInfo').val(params.simInfo.cardNum);
				$('#hidden-simInfo').val(params.simInfo.id);
			} */
		}
	}else {
		$('.td-vehiIDNO').append(params.vehiIDNO);
		if(params.company != null) {
			$('.td-company').append(params.company.name);
		}
		$('.td-vehiColor').append(params.vehiColor);
		$('.td-plateType').append(getArrayName(plateTypes,params.plateType));
		$('.td-vehicleIcon input').each(function(){
			if(params.icon) {
				$('.td-vehicleIcon #icon_'+params.icon+'').get(0).checked = true;
			}
			this.disabled = true;
		});
		if(params.driver != null) {
			$('.td-driver').append(params.driver.jobNum);
		}
		$('.td-status').append(getArrayName(status,params.status));
		$('.td-vehiBand').append(params.vehiBand);
		$('.td-vehiType').append(params.vehiType);
		$('.td-vehiUse').append(params.vehiUse);
		$('.td-payBegin').val(dateFormat2TimeString(new Date(params.payBegin)));
		$('.td-payPeriod').append(params.payPeriod);
		$('.td-payDelayDay').append(params.payDelayDay);
	//	$('.checkbox-payMonth').get(0).disabled = true;
	//	if(params.payMonth == 1) {
	//		$('.checkbox-payMonth').get(0).checked = true;
	//	}
		$('#info-body .ui-menu-with-icon').each(function(){
			$(this).remove();
		});
	}
}

function getPlateTypes() {
	var plateTypes = [];
	plateTypes.push({id:1,name: parent.lang.blue_label});
	plateTypes.push({id:2,name: parent.lang.yellow_label});
	plateTypes.push({id:3,name: parent.lang.black_label});
	plateTypes.push({id:4,name: parent.lang.white_label});
	plateTypes.push({id:0,name: parent.lang.other});
	return plateTypes;
}

function getStatus() {
	var status = [];
	status.push({id:0,name: parent.lang.normal});
	status.push({id:1,name: parent.lang.repair});
	status.push({id:2,name: parent.lang.deactivation});
	status.push({id:3,name: parent.lang.arrears});
	return status;
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
	}
}
function simClick(index) {
	var selId = simTreeList[index].getSelectedItemId();
	if(selId != '*_0' && !simTreeList[index].isGroupItem(selId)) {
		$('#simInfo_tree'+index).css('display','none');
		$('#dev_'+index+' .td-simInfo #combox-simInfo'+index).val(getArrayName(sims,selId));
		$('#dev_'+index+' .td-simInfo #hidden-simInfo'+index).val(selId);
		$('#dev_'+index+' .td-simInfo .span-tip').text('*');
	}
}
function deviceClick(index) {
	var selId = deviceTreeList[index].getSelectedItemId();
	if(selId != '*_0' && !deviceTreeList[index].isGroupItem(selId)) {
		$('#device_tree'+index).css('display','none');
		var device = getArrayInfo(devices,selId);
		$('#dev_'+index+' .td-device #combox-device'+index).val(device.name);
		$('#dev_'+index+' .td-device #hidden-device'+index).val(selId);
		$('#dev_'+index+' .td-device .span-tip').text('*');
		var sim = getArrayInfo(sims,device.level);
		if(sim != null) {
			$('#dev_'+index+' .td-simInfo #combox-simInfo'+index).val(sim.name);
			$('#dev_'+index+' .td-simInfo #hidden-simInfo'+index).val(sim.id);
			$('#dev_'+index+' .td-simInfo .span-tip').text('*');
		}else {
			$('#dev_'+index+' .td-simInfo #combox-simInfo'+index).val('');
			$('#dev_'+index+' .td-simInfo #hidden-simInfo'+index).val('');
			$('#dev_'+index+' .td-simInfo .span-tip').text(parent.lang.errDeviceNotExists);
		}
	}
}
function simDblClickEvent(id,obj) {
	var index = 1;
	for(var i = 1; i <= simTreeList.length; i++) {
		if(simTreeList != null && simTreeList[i] == obj) {
			index = i;
		}
	}
	var selId = obj.getSelectedItemId();
	if(selId != '*_0' && !obj.isGroupItem(selId)) {
		$('#simInfo_tree'+index).css('display','none');
		$('#dev_'+index+' .td-simInfo #combox-simInfo'+index).val(getArrayName(sims,selId));
		$('#dev_'+index+' .td-simInfo #hidden-simInfo'+index).val(selId);
		$('#dev_'+index+' .td-simInfo .span-tip').text('*');
	}
}
function deviceDblClickEvent(id,obj) {
	var index = 1;
	for(var i = 1; i <= deviceTreeList.length; i++) {
		if(deviceTreeList != null && deviceTreeList[i] == obj) {
			index = i;
		}
	}
	var selId = obj.getSelectedItemId();
	if(selId != '*_0' && !obj.isGroupItem(selId)) {
		$('#device_tree'+index).css('display','none');
		var device = getArrayInfo(devices,selId);
		$('#dev_'+index+' .td-device #combox-device'+index).val(device.name);
		$('#dev_'+index+' .td-device #hidden-device'+index).val(selId);
		$('#dev_'+index+' .td-device .span-tip').text('*');
		var sim = getArrayInfo(sims,device.level);
		if(sim != null) {
			$('#dev_'+index+' .td-simInfo #combox-simInfo'+index).val(sim.name);
			$('#dev_'+index+' .td-simInfo #hidden-simInfo'+index).val(sim.id);
			$('#dev_'+index+' .td-simInfo .span-tip').text('*');
		}else {
			$('#dev_'+index+' .td-simInfo #combox-simInfo'+index).val('');
			$('#dev_'+index+' .td-simInfo #hidden-simInfo'+index).val('');
			$('#dev_'+index+' .td-simInfo .span-tip').text(parent.lang.errDeviceNotExists);
		}
	}
}
function driverDblClickEvent() {
	var selId = driverTree.getSelectedItemId();
	if(selId != '*_0' && !driverTree.isGroupItem(selId)) {
		$('#driver_tree0').hide();
		$('.td-driver #combox-driver0').val(getArrayName(drivers,selId));
		$('.td-driver #hidden-driver0').val(selId);
		$('.td-driver .span-tip').text('*');
	}
}

/**
 * 加载SIM卡树结构
 */
function addSIMTree(sims,simInfo,index) {
	$('#dev_'+index+' .td-simInfo').flexPanel({
		InputModel : {display: parent.lang.select_SIM_card,width:'150px',value:'',name : 'simInfo'+index, pid : 'simInfo'+index, pclass : 'buttom',bgicon : 'true',hidden:true, hide : false} 
	});
	if(simInfo != null) {
		$('#combox-simInfo'+index).val(simInfo.cardNum);
		$('#hidden-simInfo'+index).val(simInfo.id);
	}
	var str = '<div id="simInfo_tree'+index+'" class="vehiselect" style="height:200px;background-color:#f5f5f5;border:1px solid Silver;overflow:auto;position: absolute;display:none;background-color: #fff;border: 1px solid rgba(0, 0, 0, 0.1);box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);"></div>';
	$('#info-body').append(str);
	simTreeList[index] = new dhtmlXTreeObject("simInfo_tree"+index, "100%", "100%", 0);
	simTreeList[index].enableCheckBoxes(false);
	simTreeList[index].enableThreeStateCheckboxes(false);
	simTreeList[index].setImagePath("../../../js/dxtree/imgs/");
	simTreeList[index].fillGroup(companys,sid, parent.lang.all_SIM_card);
	simTreeList[index].fillOther(sims);
	simTreeList[index].setOnDblClickHandler(simDblClickEvent);
	$('#simInfo_tree'+index).css('overflow','auto');
	addTreeEvent('simInfo',simTreeList[index],sims,index);
}

function addTreeEvent(name,tree,items,index) {
	var errtips = '*';
	if(name == 'simInfo') {
		errtips = parent.lang.errSIMNotExists;
	}else if(name == 'device') {
		errtips = parent.lang.errDeviceNotExists;
	}else if(name == 'driver') {
		errtips = parent.lang.errDriverNotExists;
	}
	isTreeOut = true;
	$('#info-mid-table #dev_'+index+' .td-'+name+' #combox-'+name+index+'').on('input propertychange click',function(e){
		dev_id = $(this).parent().parent().parent().parent().parent().parent().attr('data-id');
		$('#'+name+'_tree'+index).css('top',getTop($('#info-mid-table #dev_'+dev_id+' .td-'+name+' .btn-group').get(0)) + $('#info-mid-table #dev_'+dev_id+' .td-'+name+' .btn-group').height() + 'px');
		$('#'+name+'_tree'+index).css('left',getLeft($('#info-mid-table #dev_'+dev_id+' .td-'+name+' .btn-group').get(0)) + 'px');
		$('#'+name+'_tree'+index).css('width',$('#info-mid-table #dev_'+dev_id+' .td-'+name+' .btn-group .item').width()+'px');
		if(e.type == 'click') {
			isTreeOut = false;
			$('#'+name+'_tree'+index).show();
		}
		treeName = name;
		if (searchTimer == null) {
			searchTimer = setTimeout(function() {
				var vname = $.trim($('#info-mid-table #dev_'+dev_id+' .td-'+name+' #combox-'+name+index+'').val());
				if (vname !== "") {
					tree.searchVehicle(vname);
				}
				searchTimer = null;
			}, 200);
		}
	}).on('mouseover',function(){
		isTreeOut = false;
	}).on('mouseout',function(){
		isTreeOut = true;
	});
	$('#info-mid-table #dev_'+index+' .td-'+name+' .bg-icon-'+name+index+'').on('click',function(){
		dev_id = $(this).parent().parent().parent().parent().parent().parent().attr('data-id');
		$('#'+name+'_tree'+index).css('top',getTop($('#info-mid-table #dev_'+dev_id+' .td-'+name+' .btn-group').get(0)) + $('#info-mid-table #dev_'+dev_id+' .td-'+name+' .btn-group').height() + 'px');
		$('#'+name+'_tree'+index).css('left',getLeft($('#info-mid-table #dev_'+dev_id+' .td-'+name+' .btn-group').get(0)) + 'px');
		$('#'+name+'_tree'+index).css('width',$('#info-mid-table #dev_'+dev_id+' .td-'+name+' .btn-group .item').width()+'px');
		if($('#'+name+'_tree'+index).css('display') == 'none') {
			$('#'+name+'_tree'+index).show();
			isTreeOut = false;
			treeName = name;
			if (searchTimer == null) {
				searchTimer = setTimeout(function() {
					var vname = $.trim($('#info-mid-table #dev_'+dev_id+' .td-'+name+' #combox-'+name+'').val());
					if (vname !== "") {
						tree.searchVehicle(vname);
					}
					searchTimer = null;
				}, 200);
			}
		}else {
			checkTreeParam(tree,items,index,name,errtips);
		}
	}).on('mouseover',function(){
		isTreeOut = false;
	}).on('mouseout',function(){
		isTreeOut = true;
	});
	
	
	$('#info-mid-table #dev_'+index+' .td-'+name+' #combox-'+name+index+'').on('keydown',function(e){
		if(e.keyCode == 13) {
			dev_id = $(this).parent().parent().parent().parent().parent().parent().attr('data-id');
			$('#'+name+'_tree'+index).css('top',getTop($('#info-mid-table #dev_'+dev_id+' .td-'+name+' .btn-group').get(0)) + $('#info-mid-table #dev_'+dev_id+' .td-'+name+' .btn-group').height() + 'px');
			$('#'+name+'_tree'+index).css('left',getLeft($('#info-mid-table #dev_'+dev_id+' .td-'+name+' .btn-group').get(0)) + 'px');
			$('#'+name+'_tree'+index).css('width',$('#info-mid-table #dev_'+dev_id+' .td-'+name+' .btn-group .item').width()+'px');
			if($('#'+name+'_tree'+index).css('display') == 'none') {
				$('#'+name+'_tree'+index).show();
				isTreeOut = true;
				treeName = name;
				if (searchTimer == null) {
					searchTimer = setTimeout(function() {
						var vname = $.trim($('#info-mid-table #dev_'+dev_id+' .td-'+name+' #combox-'+name+index+'').val());
						if (vname !== "") {
							var search = tree.searchVehicle(vname);
							$('#info-mid-table #dev_'+dev_id+' .td-'+name).find('.span-tip').text('*');
							if(search == null) {
								$('#info-mid-table #dev_'+dev_id+' .td-'+name+' #hidden-'+name+index+'').val('');
								$('#info-mid-table #dev_'+dev_id+' .td-'+name+' .span-tip').text(errtips);
								isTreeOut = true;
							}
						}else {
							$('#info-mid-table #dev_'+dev_id+' .td-'+name+' #hidden-'+name+index+'').val('');
							$('#info-mid-table #dev_'+dev_id+' .td-'+name+' .span-tip').text(errtips);
							isTreeOut = true;
						}
						searchTimer = null;
					}, 200);
				}
			}else {
				checkTreeParam(tree,items,index,name,errtips);
			}
		}
	});
	
	$('#'+name+'_tree'+index+'').on('mouseover',function(){
		isTreeOut = false;
	}).on('mouseout',function(){
		isTreeOut = true;
	});
}
function checkTreeParam(tree,items,index,name,errtips){
	var sname = $.trim($('#info-mid-table #dev_'+index+' .td-'+name+' #combox-'+name+index+'').val());
	var selId = tree.getSelectedItemId();
	if(selId != '*_0' && !tree.isGroupItem(selId)) {
		var cname = getArrayName(items,selId);
		if(sname == cname) {
			if(name == 'simInfo') {
				simClick(index);
			}else if(name == 'device') {
				deviceClick(index);
			}else if(name == 'driver') {
				driverDblClickEvent();
			}
			isTreeOut = true;
		}else {
			$('#info-mid-table #dev_'+index+' .td-'+name+' #hidden-'+name+index+'').val('');
			$('#info-mid-table #dev_'+index+' .td-'+name+' .span-tip').text(errtips);
			$('#'+name+'_tree'+index).hide();
			isTreeOut = true;
		}
	}else {
		$('#'+name+'_tree'+index).hide();
		$('#info-mid-table #dev_'+index+' .td-'+name+' .span-tip').text(errtips);
		$('#info-mid-table #dev_'+index+' .td-'+name+' #hidden-'+name+index+'').val('');
		isTreeOut = true;
	}
}

/**
 * 加载设备树结构
 */
function addDeviceTree(devices,device,index) {
	$('#dev_'+index+' .td-device').flexPanel({
		InputModel : {display: parent.lang.select_device,width:'150px',value:'',name : 'device'+index, pid : 'device'+index, pclass : 'buttom',bgicon : 'true',hidden:true, hide : false} 
	});
	if(device != null) {
		$('#combox-device'+index).val(device.devIDNO);
		$('#hidden-device'+index).val(device.id);
	}
	var str = '<div id="device_tree'+index+'" class="vehiselect" style="height:200px;background-color:#f5f5f5;border:1px solid Silver;overflow:auto;position: absolute;display:none;background-color: #fff;border: 1px solid rgba(0, 0, 0, 0.1);box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);"></div>';
	$('#info-body').append(str);
	deviceTreeList[index] = new dhtmlXTreeObject("device_tree"+index, "100%", "100%", 0);
	deviceTreeList[index].enableCheckBoxes(false);
	deviceTreeList[index].enableThreeStateCheckboxes(false);
	deviceTreeList[index].setImagePath("../../../js/dxtree/imgs/");
	deviceTreeList[index].fillGroup(companys,sid,parent.lang.all_devices);
	deviceTreeList[index].fillOther(devices);
	deviceTreeList[index].setOnDblClickHandler(deviceDblClickEvent);
	$('#device_tree'+index).css('overflow','auto');
	addTreeEvent('device',deviceTreeList[index],devices,index);
}

/**
 * 加载司机树结构
 */
function addDriverTree() {
	$('.td-driver').flexPanel({
		InputModel : {display: parent.lang.select_driver,width:'150px',value:'',name : 'driver0', pid : 'driver0', pclass : 'buttom',bgicon : 'true',hidden:true, hide : false} 
	});
	$('.td-driver').parent().parent().attr('id','dev_0');
	$('.td-driver').parent().parent().attr('data-id','0');
	driverTree = new dhtmlXTreeObject("driver_tree0", "100%", "100%", 0);
	driverTree.enableCheckBoxes(false);
	driverTree.enableThreeStateCheckboxes(false);
	driverTree.setImagePath("../../../js/dxtree/imgs/");
	driverTree.fillGroup(companys,sid,parent.lang.all_drivers);
	driverTree.fillOther(drivers);
	driverTree.setOnDblClickHandler(driverDblClickEvent);
	$('#driver_tree0').css('overflow','auto');
	addTreeEvent('driver',driverTree,drivers,0);
}

//添加车辆图标
function addVehicleImg() {
	var content = '';
	content += '<input type="radio" name="iconType" class="input_none" id="icon_1" value="1" checked>';
	content += '<img src="../../images/vehicle/1.png">';
	content += '<input type="radio" name="iconType" class="input_none" id="icon_2" value="2">';
	content += '<img src="../../images/vehicle/2.png">';
	content += '<input type="radio" name="iconType" class="input_none" id="icon_3" value="3">';
	content += '<img src="../../images/vehicle/3.gif">';
	content += '<input type="radio" name="iconType" class="input_none" id="icon_4" value="4">';
	content += '<img src="../../images/vehicle/4.gif">';
	content += '<input type="radio" name="iconType" class="input_none" id="icon_5" value="5">';
	content += '<img src="../../images/vehicle/5.gif">';
	content += '<input type="radio" name="iconType" class="input_none" id="icon_6" value="6">';
	content += '<img src="../../images/vehicle/6.gif">';
	content += '<input type="radio" name="iconType" class="input_none" id="icon_7" value="7">';
	content += '<img src="../../images/vehicle/7.gif">';
	content += '<input type="radio" name="iconType" class="input_none" id="icon_8" value="8">';
	content += '<img src="../../images/vehicle/8.gif">';
	$('.td-vehicleIcon').prepend(content);
}

//添加通道参数
function addVehicleParams(name,vehiSum,vehiName,vehiAttr,index) {
	$('#device-info #dev_'+index+' .td-'+name+'').flexPanel({
		ComBoboxModel :{
			input : {name : ''+name+'Count'+index,pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			combox: 
				{name : ''+name+'Count'+index, option : arrayToStr(getCount(name))}
		}	
	});
	
	var str = '<div style="float:left;padding:4px 2px;">';
		str += '<span>'+parent.lang.number_of+'</span></div>';
	$('#device-info #dev_'+index+' .td-'+name+'').prepend(str);
	
	if(type == '') {
		$('#device-info #dev_'+index+' .td-'+name+' #combox-'+name+'Count'+index).get(0).disabled = true;
		$('#select-'+name+'Count').remove();
	}
	var content = '<div class="'+name+'Name">';
	
	if(!vehiSum) {
		vehiSum = 0;
	}
	if(!vehiName) {
		vehiName = '';
		for(var i = 1; i <= 12; i++) {
			if(i != 1) {
				vehiName += ',';
			}
			if(name == 'chn') {
				vehiName += parent.lang.channel+i;
			}else if(name == 'ioIn') {
				vehiName += 'IO_'+i;
			}else if(name == 'ioOut') {
				vehiName += '断开油路;恢复油路';
			}else if(name == 'temp'){
				vehiName += parent.lang.temperature+i;
			}
		}
	}
	var vehiCount = 0;
	if(!vehiAttr) {
		vehiAttr = '';
		if(index == 1) {
			if(name == 'chn' || name == 'ioIn') {
				vehiCount = 4;
			}
			if(type == 'add') {
				for(var i = 1; i <= vehiCount; i++) {
					var j = (index-1)*vehiCount+i;
					if(i != 1) {
						vehiAttr += ',';
					}
					vehiAttr += j;
				}
			}
		}
	}
	var vehiNames = vehiName.split(',');
	var vehiAttrs = vehiAttr.split(',');
	if(vehiAttr == '') {
		vehiCount = 0;
	}else {
		vehiCount = vehiAttrs.length;
	}
	$('#device-info #dev_'+index+' #combox-'+name+'Count'+index).val(vehiCount);
	$('#device-info #dev_'+index+' #hidden-'+name+'Count'+index).val(vehiCount);
	var disabled = '';
	if(type == '') {
		disabled = 'disabled';
	}
	for(var i = 0; i < vehiCount; i++) {
		var count = vehiAttrs[i];
		if(vehiNames) {
			content += '<div class="peripheral"><input type="text" data="'+vehiNames[count-1]+'" value="'+vehiNames[count-1]+'" '+disabled+'></div>';
		}
	}
	content += '</div>';
	$('#device-info #dev_'+index+' .td-'+name+'').append(content);
	$('#select-'+name+'Count'+index+' .ui-menu-item').each(function(){
		$(this).attr('onclick',"addParamNames('"+name+"',"+$(this).attr('data-index')+","+index+")");
	});
	if(isBrowseIE7()) {
		$('#device-info #dev_'+index+' .td-'+name+' #combox-'+name+'Count'+index).on('input propertychange',function(){
			var count = $.trim($(this).val());
			if (count == "") {
				count = 0;
			}
			addParamNames(name,count,index);
		});
	}
}

//添加通道
function addParamNames(name,count,index) {
	var id = $('#select-'+name+'Count'+index+' .ui-menu-item').attr('data-id');
	$('#device-info #'+id+' .'+name+'Name').empty();
	var content = '';
	var disabled = '';
	if(type == '') {
		disabled = 'disabled';
	}
	for(var i = 1; i <= count; i++) {
		if(name == 'chn') {
			content += '<div class="peripheral"><input type="text" data="'+parent.lang.channel+i+'" value="'+parent.lang.channel+i+'" '+disabled+'></div>';
		}else if(name == 'ioIn') {
			content += '<div class="peripheral"><input type="text" data="IO_'+i+'" value="IO_'+i+'" '+disabled+'></div>';
		}else if(name == 'ioOut') {
			content += '<div class="peripheral"><input type="text" data="断开油路;恢复油路" value="断开油路;恢复油路" '+disabled+'></div>';
		}else if(name == 'temp'){
			content += '<div class="peripheral"><input type="text" data="'+parent.lang.temperature+i+'" value="'+parent.lang.temperature+i+'" '+disabled+'></div>';
		}
	}
	$('#device-info #'+id+' .td-'+name+' .'+name+'Name').append(content);
}

//通道数目
function getCount(name) {
	var count = [];
	count.push({id:0,name:'0'});
	count.push({id:1,name:'1'});
	count.push({id:2,name:'2'});
	count.push({id:3,name:'3'});
	count.push({id:4,name:'4'});
	if(name != 'temp') {
		count.push({id:5,name:'5'});
		count.push({id:6,name:'6'});
		count.push({id:7,name:'7'});
		count.push({id:8,name:'8'});
		count.push({id:9,name:'9'});
		count.push({id:10,name:'10'});
		count.push({id:11,name:'11'});
		count.push({id:12,name:'12'});
	}
	return count;
}

//添加外设模块
function addModule(value,index) {
	var content = '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="video'+index+'" value="1" id="checkbox-video'+index+'" class="checkbox-video'+index+'">';
	content += '<label for="checkbox-video'+index+'">'+parent.lang.support_video+'</label>';
	content += '</div>';
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="oilControl'+index+'" value="1" id="checkbox-oilControl'+index+'" class="checkbox-oilControl'+index+'">';
	content += '<label for="checkbox-oilControl'+index+'">'+parent.lang.moduleOilControl+'</label>';
	content += '</div>';
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="elecControl'+index+'" value="1" id="checkbox-elecControl'+index+'" class="checkbox-elecControl'+index+'">';
	content += '<label for="checkbox-elecControl'+index+'">'+parent.lang.moduleElecControl+'</label>';
	content += '</div>';
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="talkback'+index+'" value="1" id="checkbox-talkback'+index+'" class="checkbox-talkback'+index+'">';
	content += '<label for="checkbox-talkback'+index+'">'+parent.lang.support_talkback+'</label>';
	content += '</div>';
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="capture'+index+'" value="1" id="checkbox-capture'+index+'" class="checkbox-capture'+index+'">';
	content += '<label for="checkbox-capture'+index+'">'+parent.lang.support_capture+'</label>';
	content += '</div>';
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="monitor'+index+'" value="1" id="checkbox-monitor'+index+'" class="checkbox-monitor'+index+'">';
	content += '<label for="checkbox-monitor'+index+'">'+parent.lang.support_listening+'</label>';
	content += '</div>';
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="oilSensor'+index+'" value="1" id="checkbox-oilSensor'+index+'" class="checkbox-oilSensor'+index+'">';
	content += '<label for="checkbox-oilSensor'+index+'">'+parent.lang.moduleOilSensor+'</label>';
	content += '</div>';
/*	
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="TTSControl" value="1" id="checkbox-TTSControl" class="checkbox-TTSControl">';
	content += '<label for="checkbox-TTSControl">'+parent.lang.moduleTTS+'</label>';
	content += '</div>';/* 
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="digitalIntercom" value="1" id="checkbox-digitalIntercom" class="checkbox-digitalIntercom">';
	content += '<label for="checkbox-digitalIntercom">'+parent.lang.moduleDigitIntercom+'</label>';
	content += '</div>';*/
	$('#device-info #dev_'+index+' .td-module').append(content);
	if(value == null) {
		if(index == 1) {
			value = 113;
		}else {
			value = 0;
		}
	}
	if(value) {
		var param=parseInt(value).toString(2);
		if(param.length<2) {
			param = '0000000'+param;
		}else if(param.length<3) {
			param = '000000'+param;
		}else if(param.length<4) {
			param = '00000'+param;
		}else if(param.length<5) {
			param = '0000'+param;
		}else if(param.length<6) {
			param = '000'+param;
		}else if(param.length<7) {
			param = '00'+param;
		}else if(param.length<8) {
			param = '0'+param;
		}
		if(type == '') {
			$('#device-info #dev_'+index+' .td-module .checkbox-video'+index+'').get(0).disabled = true;
			$('#device-info #dev_'+index+' .td-module .checkbox-oilControl'+index+'').get(0).disabled = true;
			$('#device-info #dev_'+index+' .td-module .checkbox-elecControl'+index+'').get(0).disabled = true;
			$('#device-info #dev_'+index+' .td-module .checkbox-capture'+index+'').get(0).disabled = true;
			$('#device-info #dev_'+index+' .td-module .checkbox-monitor'+index+'').get(0).disabled = true;
			$('#device-info #dev_'+index+' .td-module .checkbox-talkback'+index+'').get(0).disabled = true;
	//		$('#device-info #dev_'+index+' .td-module .checkbox-digitalIntercom').get(0).disabled = true;
	//		$('#device-info #dev_'+index+' .td-module .checkbox-TTSControl').get(0).disabled = true;
			$('#device-info #dev_'+index+' .td-module .checkbox-oilSensor'+index+'').get(0).disabled = true;
		}
/*		if(param.substring(0,1) == 1) {
			$('#device-info #dev_'+index+' .td-module .checkbox-digitalIntercom').get(0).disabled = true;
		}
		if(param.substring(1,2) == 1) {
			$('#device-info #dev_'+index+' .td-module .checkbox-TTSControl').get(0).checked = true;
		}
		 */
		if(param.substring(0,1) == 1) {
			$('#device-info #dev_'+index+' .td-module .checkbox-oilSensor'+index+'').get(0).checked = true;
		}
		if(param.substring(1,2) == 1) {
			$('#device-info #dev_'+index+' .td-module .checkbox-monitor'+index+'').get(0).checked = true;
		}
		if(param.substring(2,3) == 1) {
			$('#device-info #dev_'+index+' .td-module .checkbox-capture'+index+'').get(0).checked = true;
		}
		if(param.substring(3,4) == 1) {
			$('#device-info #dev_'+index+' .td-module .checkbox-talkback'+index+'').get(0).checked = true;
		}
		if(param.substring(5,6) == 1) {
			$('#device-info #dev_'+index+' .td-module .checkbox-elecControl'+index+'').get(0).checked = true;
		}
		if(param.substring(6,7) == 1) {
			$('#device-info #dev_'+index+' .td-module .checkbox-oilControl'+index+'').get(0).checked = true;
		}
		if(param.substring(7,8) == 1) {
			$('#device-info #dev_'+index+' .td-module .checkbox-video'+index+'').get(0).checked = true;
		}
	}
}

/**
 * 检查数据
 * @returns {Boolean}
 */
function checkVehiParam() {
	var flag = true;
	var i = 0;
	$('#required-area input').each(function(){
		var name = $(this).attr('data-name');
		if(($(this).val() == null || $(this).val() == '') && (name == 'vehiIDNO' 
			|| name == 'vehiColor' || name == 'company' || name == 'plateType' || name == 'terminalType'
			|| name == 'status')){
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
	if(parent.isAdmin == 0 || parent.isAllowManage == 1) {
	/*	$('#device-info .integ_tbody .td-device').each(function() {
			if($(this).find('.search-input').val() == '' && $(this).find('.hidden-search-input').val() == '') {
				$(this).find('.span-tip').text('*');
				if(flag) {
					$(this).find('#combox-device').focus();
				}
				flag = false;
			}
		});
		$('#device-info .integ_tbody .td-simInfo').each(function() {
			if($(this).find('.search-input').val() == '' && $(this).find('.hidden-search-input').val() == '') {
				$(this).find('.span-tip').text('*');
				if(flag) {
					$(this).find('#combox-simInfo').focus();
				}
				flag = false;
			}
		}); */
	}else {
		$('#device-info .integ_tbody .td-device').each(function() {
			if($(this).find('.search-input').val() == '' || $(this).find('.hidden-search-input').val() == '') {
				alert(parent.lang.errDeviceNotExists);
				if(flag) {
					$(this).find('.search-input').focus();
				}
				flag = false;
			}
		});
/*		$('#device-info .integ_tbody .td-simInfo').each(function() {
			if($(this).find('#combox-simInfo').val() == '' || $(this).find('#hidden-simInfo').val() == '') {
				$(this).find('.span-tip').text(parent.lang.errSIMNotExists);
				if(flag) {
					$(this).find('#combox-simInfo').focus();
				}
				flag = false;
			}
		});*/
	}
	return flag;
}

function seartsds() {
	var i = 0;
	var j = 0;
	$('#device-info .panel-body .integ_tab .integ_tbody').each(function(){
		i++;
		$(this).attr('class','integ_tbody dev_'+i);
		$(this).attr('data-index', i);
		if(i == 1) {
			$(this).find('.tr_dev').find('.dev').text(parent.lang.device + i + '('+parent.lang.mainDevice+')');
		}else {
			$(this).find('.tr_dev').find('.dev').text(parent.lang.device + i);
		}
		j = $(this).attr('data-id');
	});
	if(i > 1) {
		$('#device-info .panel-body .integ_tab .integ_tbody .delDev').show();
	}else {
		$('#device-info .panel-body .integ_tab .integ_tbody .delDev').hide();	
	}
	return j;
}
//新增设备信息
function addDev() {
	maxCount = maxCount + 1;
	var copy_device = $('#hid-device-info .panel-body .integ_tab .integ_tbody').clone();
	copy_device.attr('id','dev_'+maxCount);
	copy_device.attr('data-id',maxCount);
	$('#device-info .panel-body .integ_tab').append(copy_device);
	seartsds();
	addDeviceTree(devices,null,maxCount);
	addSIMTree(sims,null,maxCount);
	addVehicleParams('chn',null,null,null,maxCount);
	addVehicleParams('ioIn',null,null,null,maxCount);
//	addVehicleParams('ioOut',null,null,null,maxCount);
	addVehicleParams('temp',null,null,null,maxCount);
	addModule(null,maxCount);
	$('#addDev').hide();
}

//删除设备信息
function delDev(obj){
	$(obj).parent().parent().parent().remove();
	seartsds();
	var i = parseInt($(obj).parent().parent().parent().attr('data-id'));
	$('#select-chnCount'+i).remove();
	$('#select-ioInCount'+i).remove();
//	$('#select-ioOutCount'+i).remove();
	$('#select-tempCount'+i).remove();
	deviceTreeList[i] = null;
	simTreeList[i] = null;
	$('#simInfo_tree'+i).remove();
	$('#device_tree'+i).remove();
	$('#addDev').show();
}

//保存
function VehiSubmit(){
	if(!checkVehiParam()) {
		return;
	}
	var data = {};
	if(type == 'edit') {
		data.id = $('.input-id').val();
	}
	data.vehiIDNO = $('.input-vehiIDNO').val();
	data.vehiColor = $('.input-vehiColor').val();
	var company = {};
	company.id = $('#hidden-company').val();
	if(company.id != null && company.id != '') {
		data.company = company;
	}
	data.plateType = $('#hidden-plateType').val();
	data.status = $('#hidden-status').val();
	var driver = {};
	driver.id = $('#hidden-driver0').val();
	if(driver.id != null && driver.id != '') {
		data.driver = driver;
	}
	data.vehiBand = $('.input-vehiBand').val();
	data.vehiType = $('.input-vehiType').val();
	data.vehiUse = $('.input-vehiUse').val();
	data.payBegin = dateStrLongTime2Date($('.input-payBegin').val());
	data.payPeriod = $('.input-payPeriod').val();
	data.payDelayDay = $('.input-payDelayDay').val();
//	data.payMonth = $('.input-payMonth').val();
//	var payMonth = $("input[name='payMonth']:checked").val();
//	if(payMonth != null && payMonth != '') {
//		data.payMonth = payMonth;
//	}else {
//		data.payMonth = 0;
//	}
	data.icon = $("input[name='iconType']:checked").val();
	
	var relations = [];
	var chnCount = 0,ioInCount = 0,ioOutCount = 0,tempCount = 0;
	var chnNames = [],ioInNames = [],ioOutNames = [],tempNames = [];
	var flag = true;
	$('#device-info .integ_tbody').each(function() {
		var devIndex = $(this).attr('data-id');
		var relation = {};
		relation.id = $(this).find('.input-relation-id').val();
		var device = {};
		var simInfo = {};
		if(flag) {
			simInfo.id = $(this).find('#hidden-simInfo'+devIndex).val();
			if(simInfo.id != null && simInfo.id != '') {
				device.simInfo = simInfo;
			}else {
				simInfo.cardNum = $(this).find('#combox-simInfo'+devIndex).val();
				if(simInfo.cardNum != null && simInfo.cardNum != '') {
					device.simInfo = simInfo;
				}else {
					flag = false;
					$(this).find('#combox-simInfo'+devIndex).focus();
					alert(parent.lang.sim+parent.lang.not_be_empty);
					return;
				}
			}
		}
		if(!flag) {
			return;
		}
		if(flag) {
			device.id = $(this).find('#hidden-device'+devIndex).val();
			if(device.id != null && device.id != '') {
				relation.device = device;
			}else {
				device.devIDNO = $(this).find('#combox-device'+devIndex).val();
				if(device.devIDNO != null && device.devIDNO != '') {
					relation.device = device;
				}else {
					flag = false;
					$(this).find('#combox-device'+devIndex).focus();
					alert(parent.lang.device+parent.lang.not_be_empty);
					return;
				}
			}
		}
		if(!flag) {
			return;
		}
		//通道参数
		var chnAttr = [];
		 $(this).find('.td-chn .chnName input').each(function(chnIndex) {
			if(flag) {
				if($(this).val() == '') {
					flag = false;
					$(this).focus();
					alert($(this).attr('data')+' '+parent.lang.not_be_empty);
					return;
				}else {
					chnNames.push($(this).val());
					chnAttr.push(chnIndex+chnCount+1);
				}
			}
		});
		if(!flag) {
			return;
		}
		chnCount = chnCount + parseInt($(this).find('#hidden-chnCount'+devIndex).val());
		relation.chnAttr = chnAttr.toString();
		
		//IO输入
		var ioInAttr = [];
		$(this).find('.td-ioIn .ioInName input').each(function(ioInIndex) {
			if(flag) {
				if($(this).val() == '') {
					flag = false;
					$(this).focus();
					alert($(this).attr('data')+' '+parent.lang.not_be_empty);
					return;
				}else {
					ioInNames.push($(this).val());
					ioInAttr.push(ioInIndex+ioInCount+1);
				}
			}
		});
		if(!flag) {
			return;
		}
		ioInCount  = ioInCount + parseInt($(this).find('#hidden-ioInCount'+devIndex).val());
		relation.ioInAttr = ioInAttr.toString();

		//IO输出
/*		var ioOutAttr = [];
		$(this).find('.td-ioOut .ioOutName input').each(function(ioOutIndex) {
			if(flag) {
				if($(this).val() == '') {
					flag = false;
					$(this).focus();
					alert($(this).attr('data')+' '+parent.lang.not_be_empty);
					return;
				}else {
					ioOutNames.push($(this).val());
					ioOutAttr.push(ioOutIndex+ioOutCount+1);
				}
			}
		});
		if(!flag) {
			return;
		}
		ioOutCount  = ioOutCount + parseInt($(this).find('#hidden-ioOutCount'+devIndex).val());
		relation.ioOutAttr = ioOutAttr.toString();
*/
		//温度传感
		var tempAttr = [];
		$(this).find('.td-temp .tempName input').each(function(tempIndex) {
			if(flag) {
				if($(this).val() == '') {
					flag = false;
					$(this).focus();
					alert($(this).attr('data')+' '+parent.lang.not_be_empty);
					return;
				}else {
					tempNames.push($(this).val());
					tempAttr.push(tempIndex+tempCount+1);
				}
			}
		});
		if(!flag) {
			return;
		}
		tempCount  = tempCount + parseInt($(this).find('#hidden-tempCount'+devIndex).val());
		relation.tempAttr = tempAttr.toString();

		//外设模块
		var module = '';
		$(this).find('.td-module .module input').each(function(){
			var name = $(this).attr('name');
			var value = $("input[name='"+name+"']:checked").val();
			if(value != null && value != '') {
				module = value + module;
			}else {
				module = '0' + module;
			}
			if(name == 'elecControl'+devIndex) {
				module = '1' + module;
			}
		});
		relation.module = parseInt(module,2);
		relations.push(relation);
	});
	if(!flag) {
		return;
	}
	//判断是否有设备和SIM卡相同
	if(relations.length > 1) {
		for(var i = 0; i < relations.length - 1; i++) {
			for(var j = i+1; j < relations.length; j++) {
				if(relations[i].device != null && relations[j].device != null) {
					if(relations[i].device.id != null && relations[j].device.id != null && relations[i].device.id != '' && relations[j].device.id != ''
						&& relations[i].device.id == relations[j].device.id) {
						flag = false;
						alert(parent.lang.exists_same_device);
						return;
					}
					if(relations[i].device.devIDNO != null && relations[j].device.devIDNO != null && relations[i].device.devIDNO != '' && relations[j].device.devIDNO != ''
						&& relations[i].device.devIDNO == relations[j].device.devIDNO) {
						flag = false;
						alert(parent.lang.exists_same_device);
						return;
					}
					if(relations[i].device.simInfo != null && relations[j].device.simInfo != null) {
						if(relations[i].device.simInfo.id != null && relations[j].device.simInfo.id != null 
							&& relations[i].device.simInfo.id != '' && relations[j].device.simInfo.id != ''
							&& relations[i].device.simInfo.id == relations[j].device.simInfo.id) {
							flag = false;
							alert(parent.lang.exists_same_sim);
							return;
						}
						if(relations[i].device.simInfo.cardNum != null && relations[j].device.simInfo.cardNum != null 
							&& relations[i].device.simInfo.cardNum != '' && relations[j].device.simInfo.cardNum != ''
							&& relations[i].device.simInfo.cardNum == relations[j].device.simInfo.cardNum) {
							flag = false;
							alert(parent.lang.exists_same_sim);
							return;
						}
					}
				
				}	
			}
		}
	}
	if(!flag) {
		return;
	}
	if(chnCount > 12) {
		alert(parent.lang.chnCountGreaterThan);
		return;
	}
	data.chnCount = chnCount;
	data.chnName = chnNames.toString();
	if(ioInCount > 12) {
		alert(parent.lang.ioCountGreaterThan);
		return;
	}
	data.ioInCount = ioInCount;
	data.ioInName = ioInNames.toString();
/*	if(ioOutCount > 12) {
		alert('IO输出数目大于12个，请核对！');
		return;
	}
	data.ioOutCount = ioOutCount;
	data.ioOutName = ioOutNames.toString();
*/
	if(tempCount > 4) {
		alert(parent.lang.tempCountGreaterThan);
		return;
	}
	data.tempCount = tempCount;
	data.tempName = tempNames.toString();
	data.relations = relations;
	
	var action = 'StandardVehicleAction_mergeVehicle.action';
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost( action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.doSaveVehicleSuc();
		}
	});
}
//function disableForm(flag){}