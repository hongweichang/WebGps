var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var companys = [];
var sid = null;
var dev_id = null;
var maxCount = 1;
var indexArray = [];
var z_index = 0;
 
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
	z_index = $('#ldg_lockmask').css('z-index');
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
						parent.lang.vehicle_type,parent.lang.vehicle_purposes,parent.lang.device_installTime,
						parent.lang.agreement_start_date,parent.lang.agreement_period + parent.lang.agreement_period_unit,
						parent.lang.vehicle_icons,''],
					name : ['vehiIDNO','vehiColor','company','plateType','status','driver','vehiBand',
						'vehiType','vehiUse','install','payBegin','payPeriod','vehicleIcon',''],
					type:[ttype,ttype,,,,,ttype,ttype,ttype,ttype,ttype,ttype,,],
					length:[15,10,,,,,,20,20,10,10,2,]
				}
			},{
				title :{display: parent.lang.document_information,pid : 'operating-info',hide:false,tabshide:false},
				colgroup:{width:['150px','325px','150px','325px']},
				tabs:{
					display: [parent.lang.driving_num,parent.lang.operating_num,parent.lang.driving_end_date,
							parent.lang.operating_end_date],
					name : ['drivingNum','operatingNum','drivingDate','operatingDate'],
					type:[ttype,ttype,ttype,ttype],
					length:[64,64,,]
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
		addTips('.td-company','*');
		addTips('.td-plateType','*');
		addTips('.td-terminalType','*');
		addTips('.td-status','*');
		$('.td-driver').append('<input type="text" id="combox-driver" class="form-input" onclick="selectDriver();" readonly/><input type="hidden" id="hidden-driver"/><span class="add" onclick="addDriver();" style="margin:3px 0px -3px 10px;" title="'+parent.lang.add+'"></span><span class="clear" onclick="clearDriver();" style="margin:3px 0px -3px 10px;" title="'+parent.lang.clear+'"></span>');
		if(parent.myUserRole.isAdmin() || parent.myUserRole.isAllowManage()) {
			$('#device-info .panel-body').append('<div><span id="addDev" class="add" onclick="addDev()" title="'+parent.lang.vehicle_addDevice+'"></span></div>');
			$('#device-info .panel-body .integ_tab .integ_tbody').prepend('<tr class="tr_dev"><td colspan="4"><input type="hidden" class="input-relation-id"/><span class="dev">'+parent.lang.device+'1('+parent.lang.mainDevice+')</span><span class="delDev delete" onclick="delDev(this)" style="float:right;display:none;" title="'+parent.lang.del+'"></span></th></td>');
			$('#hid-device-info .panel-body .integ_tab .integ_tbody').prepend('<tr class="tr_dev"><td colspan="4"><input type="hidden" class="input-relation-id"/><span class="dev">'+parent.lang.device+'1</span><span class="delDev delete" onclick="delDev(this)" style="float:right;display:none;" title="'+parent.lang.del+'"></span></th></td>');
		}else {
			$('#device-info .panel-body .integ_tab .integ_tbody').prepend('<tr class="tr_dev"><td colspan="4"><input type="hidden" class="input-relation-id"/><span class="dev">'+parent.lang.device+'1('+parent.lang.mainDevice+')</span></th></td>');
			$('#hid-device-info .panel-body .integ_tab .integ_tbody').prepend('<tr class="tr_dev"><td colspan="4"><input type="hidden" class="input-relation-id"/><span class="dev">'+parent.lang.device+'1</span></th></td>');
		}
		if(!parent.myUserRole.isAdmin() && !parent.myUserRole.isAllowManage()) {
			$('#device-info .td-device').append('<input type="text" id="combox-device1" readonly style="width:200px;"/><input type="hidden" id="hidden-device1" /><span class="span-tip" style="color:red;margin-right:20px;">*</span>');
			$('#hid-device-info .td-device').append('<input type="text" id="combox-device" readonly style="width:200px;"/><input type="hidden" id="hidden-device"/><span class="span-tip" style="color:red;margin-right:20px;">*</span>');
		}else {
			$('#device-info .td-device').append('<input type="text" id="combox-device1" onclick="selectDevice(1);" readonly style="width:200px;"/><input type="hidden" id="hidden-device1" /><span class="add" onclick="addDevice(1);" style="margin:3px 0px -3px 10px;" title="'+parent.lang.add+'"></span><span class="span-tip" style="color:red;margin-right:20px;">*</span>');
			$('#hid-device-info .td-device').append('<input type="text" id="combox-device" onclick="selectDevice(1);" readonly style="width:200px;"/><input type="hidden" id="hidden-device"/><span class="add" onclick="addDevice(1);" style="margin:3px 0px -3px 10px;" title="'+parent.lang.add+'"></span><span class="span-tip" style="color:red;margin-right:20px;">*</span>');
		}
		$('#device-info .td-simInfo').append('<input type="text" id="combox-simInfo1" onclick="selectSimInfo(1);" readonly style="width:200px;"/><input type="hidden" id="hidden-simInfo1"/><span class="add" onclick="addSimInfo(1);" style="margin:3px 0px -3px 10px;" title="'+parent.lang.add+'"></span>');//<span class="span-tip" style="color:red;margin-right:20px;">*</span>');
		$('#hid-device-info .td-simInfo').append('<input type="text" id="combox-simInfo" onclick="selectSimInfo(1);" readonly style="width:200px;"/><input type="hidden" id="hidden-simInfo"/><span class="add" onclick="addSimInfo(1);" style="margin:3px 0px -3px 10px;" title="'+parent.lang.add+'"></span>');//<span class="span-tip" style="color:red;margin-right:20px;">*</span>');
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
	
	cleanSpelChar('#input-vehiIDNO');
	cleanSpelChar('#input-vehiColor');
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
}

function addTips(name,tips) {
	$(name).append('<span class="span-tip red">'+tips+'</span>');
}

function ajaxLoadVehicleInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	if(type == 'add') {
		$.myajax.jsonGet('StandardCompanyAction_loadUserCompanys.action?type=0', function(json,action,success){
			if(success) {
				companys = json.infos;
				loadVehicleInfo();
			};
		}, null);
	}else {
		var action = 'StandardVehicleAction_findVehicle.action?id='+getUrlParameter('id')+'&type='+type;
		$.myajax.jsonGetEx(action, function(json,action,success){
			if (success) {
				var vehicle = json.vehicle;
				var relations = json.relations;
				if (!$.isEmptyObject(json.vehicle)) {
					if(vehicle.company.level != 1) {
						vehicle.company = getParentCompany(parent.vehiGroupList,vehicle.company.companyId);
					}
					if(type == 'edit') {
						companys = json.companys;
					}
					loadVehicleInfo(vehicle,relations);
				}
			}
		});
	}
	$.myajax.showLoading(false);
	disableForm(false);
}

function loadVehicleInfo(params,relations) {
	if(relations && relations.length > 0) {
		var copy_device = $('#hid-device-info .panel-body .integ_tab .integ_tbody').clone();
		for(var i = 0; i < relations.length; i++) {
			if(i > 0) {
				maxCount = maxCount + 1;
				copy_device.attr('id','dev_'+maxCount);
				copy_device.attr('data-id',maxCount);
				copy_device.find('#combox-device').attr('id','combox-device'+maxCount);
				copy_device.find('#hidden-device').attr('id','hidden-device'+maxCount);
				if(parent.myUserRole.isAdmin() || parent.myUserRole.isAllowManage()) {
					copy_device.find('.td-device').find('#combox-device'+maxCount).attr('onclick','selectDevice('+maxCount+');');
					copy_device.find('.td-device').find('.add').attr('onclick','addDevice('+maxCount+');');
				}
				copy_device.find('#combox-simInfo').attr('id','combox-simInfo'+maxCount);
				copy_device.find('#hidden-simInfo').attr('id','hidden-simInfo'+maxCount);
				copy_device.find('.td-simInfo').find('#combox-simInfo'+maxCount).attr('onclick','selectSimInfo('+maxCount+');');
				copy_device.find('.td-simInfo').find('.add').attr('onclick','addSimInfo('+maxCount+');');
				$('#device-info .panel-body .integ_tab').append(copy_device);
				seartsds();
				$('#addDev').hide();
			}
		}
		for(var i = 0; i < relations.length; i++) {
			var k = i+1;
			$('#device-info .panel-body .integ_tab .dev_'+k+' .input-relation-id').val(relations[i].id);
			if(type == 'edit') {
				if(relations[i].device != null) {
					$('.dev_'+k+' .td-device #combox-device'+k).val(relations[i].device.devIDNO);
					$('.dev_'+k+' .td-device #hidden-device'+k).val(relations[i].device.id);
					if(relations[i].device.simInfo != null) {
						$('.dev_'+k+' .td-simInfo #combox-simInfo'+k).val(relations[i].device.simInfo.cardNum);
						$('.dev_'+k+' .td-simInfo #hidden-simInfo'+k).val(relations[i].device.simInfo.id);
					}
				}
			}else {
				if(relations[i].device != null) {
					$('.dev_'+k+' .td-device').text(relations[i].device.devIDNO);
					if(relations[i].device.simInfo != null) {
						$('.dev_'+k+' .td-simInfo').text(relations[i].device.simInfo.cardNum);
					}
				}
			}
			indexArray.push(i+1);
			addVehicleParams('chn',params.chnCount,params.chnName,relations[i].chnAttr,i+1);
			addVehicleParams('ioIn',params.ioInCount,params.ioInName,relations[i].ioInAttr,i+1);
		//	addVehicleParams('ioOut',params.ioOutCount,params.ioOutName,relations[i].ioOutAttr,i+1);
			addVehicleParams('temp',params.tempCount,params.tempName,relations[i].tempAttr,i+1);
			addModule(relations[i].module,i+1);
			if(i > 0 && (relations[0].module>>3)&1 > 0 && (relations[1].module>>3)&1 > 0) {
				$('#checkbox-TTSControl1').get(0).disabled = false;
				$('#checkbox-TTSControl2').get(0).disabled = false;
			}
		}
	}else if(relations && relations.length == 0){
		if(type != 'edit') {
			$('.td-device').text('');
			$('.td-simInfo').text('');
		}
		indexArray.push(1);
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
		$('.input-install').addClass('Wdate');
		$('.input-install').attr('name','install');
		$('.input-install').attr('id','install');
		$('.input-install').attr('readonly','readonly');
		$('.input-install').css('width','70%'); 
		$('.input-drivingDate').addClass('Wdate');
		$('.input-drivingDate').attr('name','payBegin');
		$('.input-drivingDate').attr('id','payBegin');
		$('.input-drivingDate').attr('readonly','readonly');
		$('.input-drivingDate').css('width','70%'); 
		$('.input-operatingDate').addClass('Wdate');
		$('.input-operatingDate').attr('name','payBegin');
		$('.input-operatingDate').attr('id','payBegin');
		$('.input-operatingDate').attr('readonly','readonly');
		$('.input-operatingDate').css('width','70%'); 
		if(type == 'add') {
		    $(".input-payBegin").val(dateCurDateBeginString());
			$(".input-payBegin").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}); });
		    $(".input-install").val(dateCurDateBeginString());
			$(".input-install").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}); });
			$(".input-drivingDate").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd'}); });
			$(".input-operatingDate").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd'}); });
			$('#combox-plateType').val(getArrayName(plateTypes,2));
			$('#hidden-plateType').val(2);
			$('#combox-status').val(getArrayName(status,0));
			$('#hidden-status').val(0);
			indexArray.push(1);
			addVehicleParams('chn',null,null,null,1);
			addVehicleParams('ioIn',null,null,null,1);
		//	addVehicleParams('ioOut',null,null,null,1);
			addVehicleParams('temp',null,null,null,1);
			addModule(null,1);
		}else if(type == 'edit') {
			$('.input-vehiIDNO').val(params.vehiIDNO);
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
				$('#combox-driver').val(params.driver.jobNum);
				$('#hidden-driver').val(params.driver.id);
			}
			$('.input-vehiBand').val(params.vehiBand);
			$('.input-vehiType').val(params.vehiType);
			$('.input-vehiUse').val(params.vehiUse);
			$('.input-payBegin').val(dateFormat2TimeString(new Date(params.payBegin)));
			$(".input-payBegin").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}) });
			if(params.stlTm != null && params.stlTm != '1970-01-01 08:00:00'){
			    $(".input-install").val(dateFormat2TimeString(new Date(params.stlTm)));
			}else{
				$(".input-install").val(dateFormat2TimeString(new Date(params.payBegin)));
			}
			$(".input-install").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}); });
			if(!parent.myUserRole.isAdmin() && !parent.myUserRole.isAllowManage()) {
				$(".input-payBegin").get(0).disabled = true;
				$(".input-install").get(0).disabled = true;
			}
			$('.input-drivingNum').val(params.drivingNum);
			if(dateTime2DateString(new Date(params.drivingDate)) == '1970-01-01'){
				$('.input-drivingDate').val('');
			}else{
				$('.input-drivingDate').val(dateTime2DateString(new Date(params.drivingDate)));
			}
			$(".input-drivingDate").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd'}) });
			$('.input-operatingNum').val(params.operatingNum);
			if(dateTime2DateString(new Date(params.operatingDate)) == '1970-01-01'){
				$('.input-drivingDate').val('');
			}else{
				$('.input-drivingDate').val(dateTime2DateString(new Date(params.operatingDate)));
			}
			$(".input-operatingDate").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd'}) });
			
			$('.input-payPeriod').val(params.payPeriod);
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
		$('.td-payBegin').append(dateFormat2TimeString(new Date(params.payBegin)));
		if(params.stlTm != null && params.stlTm != '1970-01-01 08:00:00'){
			$('.td-install').append(dateFormat2TimeString(new Date(params.stlTm)));
		}else{
			$('.td-install').append(dateFormat2TimeString(new Date(params.payBegin)));
		}
		$('.td-drivingNum').append(params.drivingNum);
		$('.td-operatingNum').append(params.operatingNum);
		if(dateTime2DateString(new Date(params.drivingDate)) == '1970-01-01'){
			$('.td-drivingDate').append('');
		}else{
			$('.td-drivingDate').append(dateTime2DateString(new Date(params.drivingDate)));
		}
		if(dateTime2DateString(new Date(params.operatingDate)) == '1970-01-01'){
			$('.td-drivingDate').append('');
		}else{
			$('.td-drivingDate').append(dateTime2DateString(new Date(params.operatingDate)));
		}
		$('.td-payPeriod').append(params.payPeriod);
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
	}else {
		$('.td-company #combox-company').val('');
		$('.td-company #hidden-company').val('');
		$('#company_tree').hide();
	}
}

//获取车辆图标
function getVehicleImgCount(index) {
	var checked = '';
	if(index == 1) {
		checked = 'checked';
	}
	var ret = "";
	ret += '<div>';
	ret += '<input type="radio" name="iconType" class="input_none icon_'+ index +'" id="icon_'+ index +'" value="'+ index +'" '+ checked +'>';
	ret += '<label for="icon_'+ index +'"><img src="../images/vehicle/'+ index +'.png"></label>';
	ret += '</div>';
	return ret;
}

//添加车辆图标
function addVehicleImg() {
	var content = '';
	content += getVehicleImgCount(10);
	content += getVehicleImgCount(1);
	content += getVehicleImgCount(2);
	content += getVehicleImgCount(3);
	content += getVehicleImgCount(4);
	content += getVehicleImgCount(5);
	content += getVehicleImgCount(6);
	content += getVehicleImgCount(11);
	content += getVehicleImgCount(12);
	content += getVehicleImgCount(13);
	content += getVehicleImgCount(7);
	content += getVehicleImgCount(8);
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
			if(name == 'chn') {
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
			var vname = vehiNames[count-1];
			if(!vname) {
				if(name == 'chn') {
					vname = parent.lang.channel+count;
				}else if(name == 'ioIn') {
					vname = 'IO_'+count;
				}else if(name == 'ioOut') {
					vname = '断开油路;恢复油路';
				}else if(name == 'temp'){
					vname = parent.lang.temperature+count;
				}
			}
			content += '<div class="peripheral"><input type="text" data="'+vname+'" value="'+vname+'" '+disabled+'></div>';
		}
	}
	content += '</div>';
	$('#device-info #dev_'+index+' .td-'+name+'').append(content);
	$('#select-'+name+'Count'+index+' .ui-menu-item').each(function(){
		$(this).attr('onclick',"addParamNames('"+name+"',"+$(this).attr('data-index')+","+index+")");
	});
	if(isBrowseIE7()) {
		$('#select-'+name+'Count'+index+' .ui-menu-item').each(function(){
			$(this).on('click',function() {
				addParamNames(name,$(this).attr('data-index'),index);
			});
		});
	}
	if((name == 'chn' || name == 'temp') && indexArray.length > 1 && type != '') {
		if($('#combox-'+name+'Count'+indexArray[0]).val() != 0) {
			$('#combox-'+name+'Count'+indexArray[1]).get(0).disabled = true;
			$('#combox-'+name+'Count'+indexArray[1]).parent().attr('title',parent.lang.notSelChnInTwoDev);
		}
		if($('#combox-'+name+'Count'+indexArray[1]).val() != 0) {
			$('#combox-'+name+'Count'+indexArray[0]).get(0).disabled = true;
			$('#combox-'+name+'Count'+indexArray[0]).parent().attr('title',parent.lang.notSelChnInTwoDev);
		}
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

	//通道参数和温度传感器参数只能有一个存在
	if((name == 'chn' || name == 'temp') && indexArray.length > 1 && type != '') {
		if(count == 0) {
			$('#combox-'+name+'Count'+indexArray[0]).get(0).disabled = false;
			$('#combox-'+name+'Count'+indexArray[1]).get(0).disabled = false;
			$('#combox-'+name+'Count'+indexArray[0]).parent().removeAttr('title');
			$('#combox-'+name+'Count'+indexArray[1]).parent().removeAttr('title');
		}else {
			for(var i = 0; i < indexArray.length; i++) {
				if(indexArray[i] != index) {
					$('#combox-'+name+'Count'+indexArray[i]).get(0).disabled = true;
					$('#combox-'+name+'Count'+indexArray[i]).parent().attr('title',parent.lang.notSelChnInTwoDev);
				}
			}
		}
	}
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

//设置外设模块的值
function setDefaultModuleValue(value,index) {
	if(value) {
		var param = parseIntDecimal(value);//.toString(2);
		
		if((param>>11)&1 > 0) {
			$('#checkbox-tpms'+index+'').get(0).checked = true;
		}
		if((param>>10)&1 > 0) {
			$('#checkbox-people'+index+'').get(0).checked = true;
		}
		if((param>>9)&1 > 0) {
			$('#checkbox-odb'+index+'').get(0).checked = true;
		}
		if((param>>8)&1 > 0) {
			$('#checkbox-talkback'+index+'').get(0).checked = true;
		}
		if((param>>7)&1 > 0) {
			$('#checkbox-oilSensor'+index+'').get(0).checked = true;
		}
		if((param>>6)&1 > 0) {
			$('#checkbox-monitor'+index+'').get(0).checked = true;
		}
	//	if(param.substring(4,5) == 1) {
	//		$('#checkbox-capture'+index+'').get(0).checked = true;
	//	}
		if((param>>4)&1 > 0) {
			$('#checkbox-digitalIntercom'+index+'').get(0).checked = true;
		}
		if((param>>3)&1 > 0) {
			$('#checkbox-TTSControl'+index+'').get(0).checked = true;
		}
		if((param>>2)&1 > 0) {
			$('#checkbox-elecControl'+index+'').get(0).checked = true;
		}
		if((param>>1)&1 > 0) {
			$('#checkbox-oilControl'+index+'').get(0).checked = true;
		}
		if(param&0x01 > 0) {
			$('#checkbox-video'+index+'').get(0).checked = true;
		}
	}
}

//添加外设模块
function addModule(value,index) {
	var content = '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="video'+index+'" value="1" id="checkbox-video'+index+'" class="checkbox-video'+index+' video">';
	content += '<label for="checkbox-video'+index+'">'+parent.lang.support_video+'</label>';
	content += '</div>';
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="talkback'+index+'" value="1" id="checkbox-talkback'+index+'" class="checkbox-talkback'+index+' talkback">';
	content += '<label for="checkbox-talkback'+index+'">'+parent.lang.support_talkback+'</label>';
	content += '</div>';
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="monitor'+index+'" value="1" id="checkbox-monitor'+index+'" class="checkbox-monitor'+index+' monitor">';
	content += '<label for="checkbox-monitor'+index+'">'+parent.lang.support_listening+'</label>';
	content += '</div>';
/*	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="capture'+index+'" value="1" id="checkbox-capture'+index+'" class="checkbox-capture'+index+' capture">';
	content += '<label for="checkbox-capture'+index+'">'+parent.lang.support_capture+'</label>';
	content += '</div>';*/
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="TTSControl'+index+'" value="1" id="checkbox-TTSControl'+index+'" class="checkbox-TTSControl'+index+' TTSControl">';
	content += '<label for="checkbox-TTSControl'+index+'">'+parent.lang.moduleTTS+'</label>';
	content += '</div>';
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="oilSensor'+index+'" value="1" id="checkbox-oilSensor'+index+'" class="checkbox-oilSensor'+index+' oilSensor">';
	content += '<label for="checkbox-oilSensor'+index+'">'+parent.lang.moduleOilSensor+'</label>';
	content += '</div>';
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="digitalIntercom'+index+'" value="1" id="checkbox-digitalIntercom'+index+'" class="checkbox-digitalIntercom'+index+' digitalIntercom">';
	content += '<label for="checkbox-digitalIntercom'+index+'">'+parent.lang.moduleDigitIntercom+'</label>';
	content += '</div>';
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="oilControl'+index+'" value="1" id="checkbox-oilControl'+index+'" class="checkbox-oilControl'+index+' oilControl">';
	content += '<label for="checkbox-oilControl'+index+'">'+parent.lang.moduleOilControl+'</label>';
	content += '</div>';
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="elecControl'+index+'" value="1" id="checkbox-elecControl'+index+'" class="checkbox-elecControl'+index+' elecControl">';
	content += '<label for="checkbox-elecControl'+index+'">'+parent.lang.moduleElecControl+'</label>';
	content += '</div>';
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="odb'+index+'" value="1" id="checkbox-odb'+index+'" class="checkbox-odb'+index+' odb">';
	content += '<label for="checkbox-odb'+index+'">OBD</label>';
	content += '</div>';
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="people'+index+'" value="1" id="checkbox-people'+index+'" class="checkbox-people'+index+' people">';
	content += '<label for="checkbox-people'+index+'">'+parent.lang.modulePeople+'</label>';
	content += '</div>';
	content += '<div class="module">';
	content += '<input type="checkbox" style="float: left;" name="tpms'+index+'" value="1" id="checkbox-tpms'+index+'" class="checkbox-tpms'+index+' tpms">';
	content += '<label for="checkbox-tpms'+index+'">'+parent.lang.moduleTpms+'</label>';
	content += '</div>';
	
	$('#device-info #dev_'+index+' .td-module').append(content);
	if(value == null) {
		if(index == 1) {
			value = 329;
		}else {
			value = 0;
		}
	}
	
	setDefaultModuleValue(value,index);
	if(indexArray.length > 1 && type != '') {
		limitModule('video');
		limitModule('oilControl');
		limitModule('elecControl');
	//	limitModule('capture');
		limitModule('oilSensor');
		limitModule('TTSControl');
		limitModule('monitor');
		limitModule('talkback');
		limitModule('digitalIntercom');
		limitModule('odb');
		limitModule('people');
		limitModule('tpms');
	}
	if(type == '') {
		$('#checkbox-video'+index+'').get(0).disabled = true;
		$('#checkbox-oilControl'+index+'').get(0).disabled = true;
		$('#checkbox-elecControl'+index+'').get(0).disabled = true;
	//	$('#checkbox-capture'+index+'').get(0).disabled = true;
		$('#checkbox-monitor'+index+'').get(0).disabled = true;
		$('#checkbox-talkback'+index+'').get(0).disabled = true;
		$('#checkbox-digitalIntercom'+index+'').get(0).disabled = true;
		$('#checkbox-TTSControl'+index+'').get(0).disabled = true;
		$('#checkbox-oilSensor'+index+'').get(0).disabled = true;
		$('#checkbox-odb'+index+'').get(0).disabled = true;
		$('#checkbox-people'+index+'').get(0).disabled = true;
		$('#checkbox-tpms'+index+'').get(0).disabled = true;
	}
}

//给外设限制条件，两个设备不能选择相同外设
function limitModule(name) {
	if($('#checkbox-' + name + indexArray[0]).get(0).checked) {
		$('#checkbox-' + name + indexArray[1]).get(0).disabled = true;
		$('#checkbox-' + name + indexArray[1]).parent().attr('title',parent.lang.notSelModuleInTwoDev);
	}else {
		$('#checkbox-' + name + indexArray[1]).get(0).disabled = false;
		$('#checkbox-' + name + indexArray[1]).parent().removeAttr('title');
	}
	if($('#checkbox-' + name + indexArray[1]).get(0).checked) {
		$('#checkbox-' + name + indexArray[0]).get(0).disabled = true;
		$('#checkbox-' + name + indexArray[0]).parent().attr('title',parent.lang.notSelModuleInTwoDev);
	}else {
		$('#checkbox-' + name + indexArray[0]).get(0).disabled = false;
		$('#checkbox-' + name + indexArray[0]).parent().removeAttr('title');
	}
	$('#checkbox-' + name + indexArray[0]).on('click',function() {
		if(this.checked) {
			$('#checkbox-' + name + indexArray[1]).get(0).disabled = true;
			$('#checkbox-' + name + indexArray[1]).parent().attr('title',parent.lang.notSelModuleInTwoDev);
		}else {
			$('#checkbox-' + name + indexArray[1]).get(0).disabled = false;
			$('#checkbox-' + name + indexArray[1]).parent().removeAttr('title');
		}
	});
	$('#checkbox-' + name + indexArray[1]).on('click',function() {
		if(this.checked) {
			$('#checkbox-' + name + indexArray[0]).get(0).disabled = true;
			$('#checkbox-' + name + indexArray[0]).parent().attr('title',parent.lang.notSelModuleInTwoDev);
		}else {
			$('#checkbox-' + name + indexArray[0]).get(0).disabled = false;
			$('#checkbox-' + name + indexArray[0]).parent().removeAttr('title');
		}
	});
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
			|| name == 'company' || name == 'plateType' || name == 'terminalType'
			|| name == 'status' || name == 'payBegin')){
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

	$('#device-info .integ_tbody .td-device').each(function() {
		if($(this).find('.search-input').val() == '') {
			$(this).find('.span-tip').text(parent.lang.not_be_empty);
			if(flag) {
				$(this).find('.search-input').focus();
			}
			flag = false;
		}else {
			$(this).find('.span-tip').text('*');
		}
	});
	/*$('#device-info .integ_tbody .td-simInfo').each(function() {
		if($(this).find('#combox-simInfo').val() == '') {
			$(this).find('.span-tip').text(parent.lang.not_be_empty);
			if(flag) {
				$(this).find('#combox-simInfo').focus();
			}
			flag = false;
		}else {
			$(this).find('.span-tip').text('*');
		}
	});*/
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
	copy_device.find('#combox-device').attr('id','combox-device'+maxCount);
	copy_device.find('#hidden-device').attr('id','hidden-device'+maxCount);
	copy_device.find('#combox-simInfo').attr('id','combox-simInfo'+maxCount);
	copy_device.find('#hidden-simInfo').attr('id','hidden-simInfo'+maxCount);
	if(parent.myUserRole.isAdmin() || parent.myUserRole.isAllowManage()) {
		copy_device.find('.td-device').find('#combox-device'+maxCount).attr('onclick','selectDevice('+maxCount+');');
		copy_device.find('.td-device').find('.add').attr('onclick','addDevice('+maxCount+');');
	}
	copy_device.find('.td-simInfo').find('#combox-simInfo'+maxCount).attr('onclick','selectSimInfo('+maxCount+');');
	copy_device.find('.td-simInfo').find('.add').attr('onclick','addSimInfo('+maxCount+');');
	$('#device-info .panel-body .integ_tab').append(copy_device);
	seartsds();
	indexArray.push(maxCount);
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
	var i = parseIntDecimal($(obj).parent().parent().parent().attr('data-id'));
	var index = 0;
	for(var j = 0; j < indexArray.length; j++) {
		$('#checkbox-video'+indexArray[j]).unbind('click');
		$('#checkbox-oilControl'+indexArray[j]).unbind('click');
		$('#checkbox-elecControl'+indexArray[j]).unbind('click');
	//	$('#checkbox-capture'+indexArray[j]).unbind('click');
		$('#checkbox-monitor'+indexArray[j]).unbind('click');
		$('#checkbox-talkback'+indexArray[j]).unbind('click');
		$('#checkbox-digitalIntercom'+indexArray[j]).unbind('click');
		$('#checkbox-oilSensor'+indexArray[j]).unbind('click');
		$('#checkbox-TTSControl'+indexArray[j]).unbind('click');
		$('#checkbox-odb'+indexArray[j]).unbind('click');
		$('#checkbox-people'+indexArray[j]).unbind('click');
		$('#checkbox-tpms'+indexArray[j]).unbind('click');

		if(i == indexArray[j]) {
			index = j;
		}else {
			$('#checkbox-video'+indexArray[j]).get(0).disabled = false;
			$('#checkbox-oilControl'+indexArray[j]).get(0).disabled = false;
			$('#checkbox-elecControl'+indexArray[j]).get(0).disabled = false;
		//	$('#checkbox-capture'+indexArray[j]).get(0).disabled = false;
			$('#checkbox-monitor'+indexArray[j]).get(0).disabled = false;
			$('#checkbox-talkback'+indexArray[j]).get(0).disabled = false;
			$('#checkbox-digitalIntercom'+indexArray[j]).get(0).disabled = false;
			$('#checkbox-TTSControl'+indexArray[j]).get(0).disabled = false;
			$('#checkbox-oilSensor'+indexArray[j]).get(0).disabled = false;
			$('#checkbox-odb'+indexArray[j]).get(0).disabled = false;
			$('#checkbox-people'+indexArray[j]).get(0).disabled = false;
			$('#checkbox-tpms'+indexArray[j]).get(0).disabled = false;
			$('#combox-chnCount'+indexArray[j]).get(0).disabled = false;
			$('#combox-tempCount'+indexArray[j]).get(0).disabled = false;
			
			$('#checkbox-video'+indexArray[j]).parent().removeAttr('title');
			$('#checkbox-oilControl'+indexArray[j]).parent().removeAttr('title');
			$('#checkbox-elecControl'+indexArray[j]).parent().removeAttr('title');
		//	$('#checkbox-capture'+indexArray[j]).removeAttr('title');
			$('#checkbox-monitor'+indexArray[j]).parent().removeAttr('title');
			$('#checkbox-talkback'+indexArray[j]).parent().removeAttr('title');
			$('#checkbox-digitalIntercom'+indexArray[j]).parent().removeAttr('title');
			$('#checkbox-TTSControl'+indexArray[j]).parent().removeAttr('title');
			$('#checkbox-oilSensor'+indexArray[j]).parent().removeAttr('title');
			$('#checkbox-odb'+indexArray[j]).parent().removeAttr('title');
			$('#checkbox-people'+indexArray[j]).parent().removeAttr('title');
			$('#checkbox-tpms'+indexArray[j]).parent().removeAttr('title');
			$('#combox-chnCount'+indexArray[j]).parent().removeAttr('title');
			$('#combox-tempCount'+indexArray[j]).parent().removeAttr('title');
		}
	}
	indexArray.splice(index,1)
	$('#select-chnCount'+i).remove();
	$('#select-ioInCount'+i).remove();
//	$('#select-ioOutCount'+i).remove();
	$('#select-tempCount'+i).remove();
	$('#simInfo_tree'+i).remove();
	$('#device_tree'+i).remove();
	$('#addDev').show();
}

//获取选中的外设模块
function getSaveModuleValue(name) {
	var module = '0';
	var value = $.trim($("input[name='"+name+"']:checked").val());
	if(value != null && value != '') {
		module = value;
	}
	return module;
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
	//判断是否有空格
	if(isCheckEmpty($('.input-vehiIDNO').val())) {
		$('.input-vehiIDNO').focus();
		alert(parent.lang.plate_number + ":'" + $('.input-vehiIDNO').val()+"'" + parent.lang.errValueContainSpace);
		return;
	}
	data.vehiIDNO = $.trim($('.input-vehiIDNO').val());
	
	if($('.input-vehiColor').val() != null && $('.input-vehiColor').val() != ''){
		data.vehiColor = $.trim($('.input-vehiColor').val());
	}
	var company = {};
	company.id = $.trim($('#hidden-company').val());
	if(company.id != null && company.id != '') {
		data.company = company;
	}
	data.plateType = $.trim($('#hidden-plateType').val());
	data.status = $.trim($('#hidden-status').val());
	var driver = {};
	driver.id = $.trim($('#hidden-driver').val());
	if(driver.id != null && driver.id != '') {
		data.driver = driver;
	}
	data.vehiBand = $.trim($('.input-vehiBand').val());
	data.vehiType = $.trim($('.input-vehiType').val());
	data.vehiUse = $.trim($('.input-vehiUse').val());
	data.payBegin = dateStrLongTime2Date($.trim($('.input-payBegin').val()));
	data.stlTm = dateStrLongTime2Date($.trim($('.input-install').val()));
	data.payPeriod = $.trim($('.input-payPeriod').val());
	data.payDelayDay = $.trim(0);
	data.drivingNum = $.trim($('.input-drivingNum').val());
	if($.trim($('.input-drivingDate').val()) != null && $.trim($('.input-drivingDate').val()) != ''){
		data.drivingDate = dateStrDate2Date($.trim($('.input-drivingDate').val()));
	}else{
		data.drivingDate = dateStrDate2Date('1970-01-01');
	}
	data.operatingNum = $.trim($('.input-operatingNum').val());
	if($.trim($('.input-operatingDate').val()) != null && $.trim($('.input-operatingDate').val()) != ''){
		data.operatingDate = dateStrDate2Date($.trim($('.input-operatingDate').val()));
	}else{
		data.operatingDate = dateStrDate2Date('1970-01-01');
	}
	data.icon = $.trim($("input[name='iconType']:checked").val());
	
	var relations = [];
	var chnCount = 0,ioInCount = 0,ioOutCount = 0,tempCount = 0;
	var chnNames = [],ioInNames = [],ioOutNames = [],tempNames = [];
	var flag = true;
	var allModule = [];
	$('#device-info .integ_tbody').each(function() {
		var devIndex = $.trim($(this).attr('data-id'));
		var relation = {};
		relation.id = $.trim($(this).find('.input-relation-id').val());
		var device = {};
		var simInfo = {};
		if(flag) {
			simInfo.cardNum = $.trim($(this).find('#combox-simInfo'+devIndex).val());
			if(simInfo.cardNum != null && simInfo.cardNum != '') {
				device.simInfo = simInfo;
			}
			/*else {
				flag = false;
				$(this).find('#combox-simInfo'+devIndex).focus();
				alert(parent.lang.sim+parent.lang.not_be_empty);
				return;
			}*/
		}
		if(!flag) {
			return;
		}
		if(flag) {
			device.devIDNO = $.trim($(this).find('#combox-device'+devIndex).val());
			if(device.devIDNO != null && device.devIDNO != '') {
				relation.device = device;
			}else {
				flag = false;
				$(this).find('#combox-device'+devIndex).focus();
				alert(parent.lang.device+parent.lang.not_be_empty);
				return;
			}
		}
		if(!flag) {
			return;
		}
		//通道参数
		var chnAttr = [];
		 $(this).find('.td-chn .chnName input').each(function(chnIndex) {
			if(flag) {
				if($.trim($(this).val()) == '') {
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
		chnCount = chnCount + parseIntDecimal($(this).find('#hidden-chnCount'+devIndex).val());
		relation.chnAttr = chnAttr.toString();
		
		//IO输入
		var ioInAttr = [];
		$(this).find('.td-ioIn .ioInName input').each(function(ioInIndex) {
			if(flag) {
				if($.trim($(this).val()) == '') {
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
		ioInCount  = ioInCount + parseIntDecimal($(this).find('#hidden-ioInCount'+devIndex).val());
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
				if($.trim($(this).val()) == '') {
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
		tempCount  = tempCount + parseIntDecimal($(this).find('#hidden-tempCount'+devIndex).val());
		relation.tempAttr = tempAttr.toString();

		//外设模块
		var module = {};
		module.video = getSaveModuleValue($(this).find('.td-module .module .video').attr('name'));
		module.talkback = getSaveModuleValue($(this).find('.td-module .module .talkback').attr('name'));
		module.monitor = getSaveModuleValue($(this).find('.td-module .module .monitor').attr('name'));
		module.digitalIntercom = getSaveModuleValue($(this).find('.td-module .module .digitalIntercom').attr('name'));
		
		if(module.video != '1' && (module.talkback == '1' || module.monitor == '1')) {
			alert(parent.lang.selThisAfterSelVideo);
			flag = false;
			return;
		}

		module.oilSensor = getSaveModuleValue($(this).find('.td-module .module .oilSensor').attr('name'));
		module.TTSControl = getSaveModuleValue($(this).find('.td-module .module .TTSControl').attr('name'));
	//	module.capture = getSaveModuleValue($(this).find('.td-module .module .capture').attr('name'));
		module.elecControl = getSaveModuleValue($(this).find('.td-module .module .elecControl').attr('name'));
		module.oilControl = getSaveModuleValue($(this).find('.td-module .module .oilControl').attr('name'));
		module.odb = getSaveModuleValue($(this).find('.td-module .module .odb').attr('name'));
		module.people = getSaveModuleValue($(this).find('.td-module .module .people').attr('name'));
		module.tpms = getSaveModuleValue($(this).find('.td-module .module .tpms').attr('name'));
		
		var str = module.tpms + module.people + module.odb + module.talkback + module.oilSensor + module.monitor + '1' + module.digitalIntercom 
				+ module.TTSControl + module.elecControl + module.oilControl + module.video;

		allModule.push(module);
		relation.module = parseInt(str,2);
		relations.push(relation);
	});
	if(!flag) {
		return;
	}
	
	//判断是否有相同的外设  如果两个设备，则必须有个视频设备
	if(allModule.length > 1) {
		var module1 = allModule[0];
		if(module1.video == '0') {
			flag = false;
		}
		var module2 = allModule[1];
		if(module2.video != '0') {
			flag = true;
		}
		if((module1.video == '1' && module1.video == module2.video) || (module1.talkback == '1' && module1.talkback == module2.talkback) 
			|| (module1.oilSensor == '1' && module1.oilSensor == module2.oilSensor) || (module1.monitor == '1' && module1.monitor == module2.monitor)
			|| (module1.digitalIntercom == '1' && module1.digitalIntercom == module2.digitalIntercom)
			|| (module1.elecControl == '1' && module1.elecControl == module2.elecControl) || (module1.oilControl == '1' && module1.oilControl == module2.oilControl)
			|| (module1.odb == '1' && module1.odb == module2.odb) || (module1.people == '1' && module1.people == module2.people) || (module1.tpms == '1' && module1.tpms == module2.tpms)
			|| (module1.TTSControl == '1' && module1.TTSControl == module2.TTSControl)) {
			alert(module1.TTSControl+"=="+ module2.TTSControl);
			flag = false;
			alert(parent.lang.notSelModuleInTwoDev);
			return;
		}
	}
	if(!flag) {
		alert(parent.lang.mustSelVideoDev);
		return;
	}
	
	//判断是否有设备和SIM卡相同
	if(relations.length > 1) {
		for(var i = 0; i < relations.length - 1; i++) {
			for(var j = i+1; j < relations.length; j++) {
				if(relations[i].device != null && relations[j].device != null) {
					if(relations[i].device.devIDNO != null && relations[j].device.devIDNO != null && relations[i].device.devIDNO != '' && relations[j].device.devIDNO != ''
						&& relations[i].device.devIDNO == relations[j].device.devIDNO) {
						flag = false;
						alert(parent.lang.exists_same_device);
						return;
					}
					if(relations[i].device.simInfo != null && relations[j].device.simInfo != null) {
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
		if(relations[0].chnAttr != null && relations[0].chnAttr != '' && relations[1].chnAttr != null && relations[1].chnAttr != '') {
			flag = false;
			alert(parent.lang.selOneChnParam);
			return;
		}
		if(relations[0].tempAttr != null && relations[0].tempAttr != '' && relations[1].tempAttr != null && relations[1].tempAttr != '') {
			flag = false;
			alert(parent.lang.selOneTempParam);
			return;
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
	
	var action = 'StandardVehicleAction_mergeVehicleNew.action';
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

function clearDriver() {
	$('#combox-driver').val('');
	$('#hidden-driver').val('');
}

function selectDriver() {
	var name = $('#combox-driver').val();
	$.dialog({id:'info', title:parent.lang.select+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.driver_information,content: 'url:OperationManagement/SelectInfo.html?type=driver&name='+name+'&singleSelect=true',
		width:'800px',height:'530px', min:false, max:false, lock:true, parent: api});
}

function selectDevice(index) {
	var name = $('#combox-device'+index).val();
	var id = $('#hidden-device'+index).val();
	$.dialog({id:'info', title:parent.lang.select+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.device_information,content: 'url:OperationManagement/SelectInfo.html?type=device&index='+index+'&id='+id+'&name='+name+'&singleSelect=true',
		width:'800px',height:'530px', min:false, max:false, lock:true, parent: api});
}

function selectSimInfo(index) {
	var name = $('#combox-simInfo'+index).val();
	var id = $('#hidden-simInfo'+index).val();
	$.dialog({id:'info', title:parent.lang.select+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.SIM_card_information,content: 'url:OperationManagement/SelectInfo.html?type=simInfo&index='+index+'&id='+id+'&name='+name+'&singleSelect=true',
		width:'800px',height:'530px', min:false, max:false, lock:true, parent: api});
}

function addDriver() {
	var companyId = $('#hidden-company').val();
	$.dialog({id:'info', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.driver_information,content: 'url:OperationManagement/AddInfo.html?type=driver&companyId='+companyId,
		width:'410px',height:'300px', min:false, max:false, lock:true, parent: api});
}

function addDevice(index) {
	var companyId = $('#hidden-company').val();
	$.dialog({id:'info', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.device_information,content: 'url:OperationManagement/AddInfo.html?type=device&index='+index+'&companyId='+companyId,
		width:'410px',height:'200px', min:false, max:false, lock:true, parent: api});
}

function addSimInfo(index) {
	var companyId = $('#hidden-company').val();
	$.dialog({id:'info', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.SIM_card_information,content: 'url:OperationManagement/AddInfo.html?type=simInfo&index='+index+'&companyId='+companyId,
		width:'410px',height:'200px', min:false, max:false, lock:true, parent: api});
}

function doSelectDevice(index, id, name,simId,simNum) {
	$('#combox-device'+index).val(name);
	$('#hidden-device'+index).val(id);
	if(simNum) {
		$('#combox-simInfo'+index).val(simNum);
	}
	if(simId) {
		$('#hidden-simInfo'+index).val(simId);
	}
	$.dialog({id:'info'}).close();
}

function doSelectSimInfo(index, id, name) {
	$('#combox-simInfo'+index).val(name);
	$('#hidden-simInfo'+index).val(id);
	$.dialog({id:'info'}).close();
}

function doSelectDriver(index, id, name) {
	$('#combox-driver').val(name);
	$('#hidden-driver').val(id);
	$.dialog({id:'info'}).close();
}

function doSaveDeviceSuc(index, id, name) {
	$('#combox-device'+index).val(name);
	$('#hidden-device'+index).val(id);
	$.dialog({id:'info'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

function doSaveSimInfoSuc(index, id, name) {
	$('#combox-simInfo'+index).val(name);
	$('#hidden-simInfo'+index).val(id);
	$.dialog({id:'info'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

function doSaveDriverSuc(index, id, name) {
	$('#combox-driver').val(name);
	$('#hidden-driver').val(id);
	$.dialog({id:'info'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

function doExit() {
	$.dialog({id:'info'}).close();
}

//function disableForm(flag){}