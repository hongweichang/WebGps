var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var companys = [];
var simInfos = [];
var sid = null;
var simInfoTree = null;
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
				title :{display: parent.lang.required_information,pid : 'required-area',hide:false,tabshide:false},
				colgroup:{width:['150px','325px','150px','325px']},
				tabs:{
					display: [parent.lang.device_number,'',parent.lang.belong_company,parent.lang.device_type,parent.lang.SIM_card_number,'',parent.lang.device_serial],
					name : ['devIDNO','','company','devType','simInfo','','serial'],
					type:[ttype,'',,,,,ttype],
					length:[,,,,,,40]
				}
			},{
				title :{display: parent.lang.other_information, pclass : 'clearfix',hide:false,tabshide:false},
				colgroup:{width:['150px','325px','150px','325px']},
				tabs:{
					display: [parent.lang.product_brand,parent.lang.product_model,parent.lang.software_version,parent.lang.hardware_version,
					          parent.lang.products_businesses,'',parent.lang.remark,''],
					name : ['brand','model','softwareVer','hardwareVer','factory','','remark',''],
					type:[ttype,ttype,ttype,ttype,ttype,'','textArea',''],
					length:[20,20,20,20,20]
				}
			}
		]
	});
	if(type == 'add' || type == 'edit') {
		addTips('.td-devIDNO','*');
		addTips('.td-company','*');
		addTips('.td-devType','*');
		$('.td-simInfo').append('<span class="span-tip" style="color:red;margin-right:20px;"></span><span style="color:red;">'+parent.lang.vehicle_sim_not_tip+'</span>');
	}
	if(type == 'add') {
		var content = '<div class="dev-group">';
		content += '		<div class="dev-addType">';
		content += '			<input id="radio-single" class="radioDevice" name="radioDevice" type="radio" value="1" checked>';
		content += '			<label for="radio-single">'+parent.lang.single_add+'</label>';
		content += '			<input id="radio-batch" class="radioDevice" name="radioDevice" type="radio" value="2">';
		content += '			<label for="radio-batch">'+parent.lang.batch_add+'</label>';
		content += '		</div>';
		content += '		<div class="dev-input-devIDNO">';
		content += '            <span>'+parent.lang.device_number+'</span>';
		content += '			<input name="devID" data-name="devIDNO" id="input-devIDNO" class="dev-bgInput" width="40%" maxlength="20">';
		content += '            <span class="span-tip red devIDNOTip">*</span><span class="dev-item">'+parent.lang.msg_device_tip+'</span>';
		content += '		</div>';
		content += '		<div class="dev-bgInput dev-item">';
		content += '            <span>'+parent.lang.msg_device_bf_tip+'</span>';
		content += '			<input name="devIDbf" data-name="devIDNO" id="input-devIDNObf" class="dev-bgInput" maxlength="4">';
		content += '            <span class="span-tip red devIDbfTip">*</span><span>'+parent.lang.msg_device_mid_tip+'</span>';
		content += '			<input name="devIDbg" data-name="devIDNO" id="input-devIDNObg" class="dev-bgInput" maxlength="4">';
		content += '            <span class="span-tip red devIDbgTip">*</span><span>'+parent.lang.msg_device_bg_tip+'</span>';
		content += '		</div>';
		content += '    </div>';
		$('.td-devIDNO').empty();
		$('.td-devIDNO').append(content);
		$('.radioDevice').on('change',function(){
			var value = $("input[name='radioDevice']:checked").val();
			if(value == 1) {
				$('.dev-group .dev-item').removeClass('show');
				$('.td-simInfo').parent().show();
			}else {
				$('.dev-group .dev-item').addClass('show');
				$('.td-simInfo').parent().hide();
			}
		});
	}
//	$('#info-mid-table .form-input').each(function() {
//		if($(this).attr('data-name')!=null && $(this).attr('data-name')!='') {
//			cleanSpelChar('.input-'+$(this).attr('data-name'));	
//		}
//	});
//	cleanSpelChar('#input-devIDNO');
	enterDigital('#input-devIDNObf');
	enterDigital('#input-devIDNObg');
	$('.td-serial').find('.span-tip').remove();
	//加载设备信息
	ajaxLoadDeviceInfo();
	
	$('.submit','#toolbar-btn').on('click',function(){
		var data = {};
		var checkDevIdno = function() {
			var flag = true;
			if($('#combox-company').val() == null || $('#combox-company').val() == '' 
				&& $('#hidden-company').val() == null || $('#hidden-company').val() == ''){
				$('.td-company').find('.span-tip').text(parent.lang.not_be_empty);
				$('#required-area .panel-body').addClass('show');
				$(this).focus();
				flag = false;
			}else {
				$('.td-company').find('.span-tip').text('*');
			}
			var value = $("input[name='radioDevice']:checked").val();
			data.devIDNO = $('#input-devIDNO').val();
			if(data.devIDNO == null || data.devIDNO == '') {
				$('.td-devIDNO .devIDNOTip').text(parent.lang.not_be_empty);
				$('#required-area .panel-body').addClass('show');
				$('.td-devIDNO #input-devIDNO').focus();
				flag = false;
			}else {
				$('.td-devIDNO .devIDNOTip').text('*');
			}
			
			if(value == 2) {
				data.idnobf = $('#input-devIDNObf').val();
				data.idnobg = $('#input-devIDNObg').val();
				if(data.idnobf == null || data.idnobf == '') {
					$('.td-devIDNO .devIDbfTip').text(parent.lang.not_be_empty);
					if(flag) {
						$('#required-area .panel-body').addClass('show');
						$('.td-devIDNO #input-devIDNObf').focus();
						flag = false;
					}
				}else {
					$('.td-devIDNO .devIDbfTip').text('*');
				}
				if(data.idnobg == null || data.idnobg == '') {
					$('.td-devIDNO .devIDbgTip').text(parent.lang.not_be_empty);
					if(flag) {
						$('#required-area .panel-body').addClass('show');
						$('.td-devIDNO #input-devIDNObg').focus();
						flag = false;
					}
				}else {
					$('.td-devIDNO .devIDbgTip').text('*');
				}
				
			}
			return flag;
		}
		var blag = true;
		if(type == 'edit') {
			data.id = $('.input-id').val();
			data.devIDNO = $('.input-devIDNO').val();
			if($('#combox-company').val() == null || $('#combox-company').val() == '' 
				&& $('#hidden-company').val() == null || $('#hidden-company').val() == ''){
				$('.td-company').find('.span-tip').text(parent.lang.not_be_empty);
				$('#required-area .panel-body').addClass('show');
				$('#combox-company').focus();
				blag = false;
			}else {
				$('.td-company').find('.span-tip').text('*');
			}
		}else {
			blag = checkDevIdno();
		}
		data.devType = $('#hidden-devType').val();
		if(data.devType == null || data.devType == '') {
			$('.td-devType').find('.span-tip').text(parent.lang.not_be_empty);
			if(blag) {
				$('#required-area .panel-body').addClass('show');
				$('#combox-devType').focus();
				blag = false;
			}
		}else {
			$('.td-devType').find('.span-tip').text('*');
		}
		data.serialID = $('.input-serial').val();
		var simInfo = {};
		simInfo.id = $('#hidden-simInfo').val();
		simInfo.cardNum = $('#combox-simInfo').val();
		data.simInfo = simInfo;
//		if(data.serialID == null || data.serialID == '') {
//			$('.td-serial').find('.span-tip').text(parent.lang.not_be_empty);
//			if(blag) {
//				$('#required-area .panel-body').addClass('show');
////				$('.input-serial').focus();
//				blag = false;
//			}
//		}else {
//			$('.td-serial').find('.span-tip').text('*');
//		}
		if(!blag) {
			return;
		}
		data.brand = $('.input-brand').val();
		data.model = $('.input-model').val();
		data.softwareVer = $('.input-softwareVer').val();
		data.hardwareVer = $('.input-hardwareVer').val();
		data.factory = $('.input-factory').val(); 
		var company = {};
		company.id = $('#hidden-company').val();
		if(company.id != null || company.id != '') {
			data.company = company;
		}
		data.remark = $('#textArea-remark').val();
		
		var action = 'StandardDeviceAction_mergeDevice.action';
		disableForm(true);
		$.myajax.showLoading(true, parent.lang.saving);
		$.myajax.jsonPost( action, data, false, function(json, success) {
			disableForm(false);
			$.myajax.showLoading(false);
			if (success) {
				W.doSaveDeviceSuc();
			}
		});
	});
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'deviceinfo'}).close();
	});
	$('.reset','#toolbar-btn').on('click',function(){
		var url = 'OperationManagement/DeviceInfo.html?type='+type;
		if(type == 'edit') {
			url += '&id='+getUrlParameter('id');
		}
		$('.ui_dialog',parent.document).find('iframe').attr('src',url);
	});

	$('body').on('click',function(){
		if(isTreeOut && $('#simInfo_tree').css('display') != 'none'){
			checkTreeParam(simInfoTree,simInfos,parent.lang.errSIMNotExists);
		}
	});
}

function ajaxLoadDeviceInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	if(type == 'add') {
		$.myajax.jsonGet('StandardDeviceAction_findDevice.action?id='+getUrlParameter('id')+'&type='+type, function(json,action,success){
			if(success) {
				companys = json.companys;
				simInfos = json.simInfos;
				loadDeviceInfo();
			};
		}, null);
	}else {
		var action = 'StandardDeviceAction_findDevice.action?id='+getUrlParameter('id')+'&type='+type;
		$.myajax.jsonGetEx(action, function(json,action,success){
			if (success) {
				var device = json.device;
				if (!$.isEmptyObject(json.device)) {
					if(device.company.level == 2) {
						device.company = getParentCompany(parent.vehiGroupList,device.company.parentId);
					}
					if(type == 'edit') {
						companys = json.companys;
						simInfos = json.simInfos;
						if(device.simInfo != null) {
							var sim = {};
							sim.id = device.simInfo.id;
							sim.name = device.simInfo.cardNum;
							sim.parentId = device.simInfo.company.id;
							simInfos.push(sim);
						}
							
					}
					loadDeviceInfo(device);
				}
			}
		});
	}
	$.myajax.showLoading(false);
	disableForm(false);
}

function loadDeviceInfo(params) {
	var devTypes = getTerminalTypes();
	if(type == 'add' || type == 'edit') {
		$('.td-devType').flexPanel({
			ComBoboxModel :{
				input : {name : 'devType',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'devType', option : arrayToStr(devTypes)}
			}	
		});
		for(var i = 0; i < companys.length; i++) {
			if(companys[i].id == parent.companyId) {
				sid = companys[i].parentId;
			}
		}
		if(type == 'add' || (type == 'edit' && params.install != 1)) {
			addCompanyTree(companys,sid);
		}
		if(type == 'add') {
			addSimInfoTree(simInfos,null);
			$('#combox-devType').val(getArrayName(devTypes,5));
			$('#hidden-devType').val(5);
		}else if(type == 'edit') {
			addSimInfoTree(simInfos,params.simInfo);
			$('.input-devIDNO').val(params.devIDNO);
			$('.input-devIDNO').get(0).disabled = true;
			$('.td-devIDNO').append('<input class="input-id" type="hidden" name="id" value="'+params.id+'"/>');
			$('#combox-devType').val(getArrayName(devTypes,params.devType));
			$('#hidden-devType').val(params.devType);
			$('.input-serial').val(params.serialID);
			$('.input-brand').val(params.brand);
			$('.input-model').val(params.model);
			$('.input-softwareVer').val(params.softwareVer);
			$('.input-hardwareVer').val(params.hardwareVer);
			$('.input-factory').val(params.factory);
			if(params.install == 1) {
				$('.td-company').prepend('<input id="combox-company" value="'+params.company.name+'" disabled/> ');
				$('.td-company').append('<span style="color:red;">'+parent.lang.msg_device_install_tip+'</span>');
				$('.td-company').append('<input id="hidden-company" type="hidden" value="'+params.company.id+'"/>');
			}else {
				if(params.company != null) {
					$('#combox-company').val(params.company.name);	
					$('#hidden-company').val(params.company.id);
				}
			}
			$('#textArea-remark').val(params.remark);
		}
	}else {
		$('.td-devIDNO').text(params.devIDNO);
		$('.td-devType').text(getArrayName(devTypes,params.devType));
		$('.td-serial').text(params.serialID);
		$('.td-simInfo').text(params.simInfo.cardNum);
		$('.td-brand').text(params.brand);
		$('.td-model').text(params.model);
		$('.td-softwareVer').text(params.softwareVer);
		$('.td-hardwareVer').text(params.hardwareVer);
		$('.td-factory').text(params.factory);
		if(params.company != null) {
			$('.td-company').text(params.company.name);
		}
		$('#textArea-remark').val(params.remark);
		$('#textArea-remark').attr('readonly','readonly');
	}
}

//添加sim卡树状表
function addSimInfoTree(sims,simInfo) {
	$('.td-simInfo').flexPanel({
		InputModel : {display: parent.lang.select_SIM_card,width:'150px',value:'',name : 'simInfo', pid : 'simInfo', pclass : 'buttom',bgicon : 'true',hidden:true, hide : false} 
	});
	if(simInfo != null) {
		$('#combox-simInfo').val(simInfo.cardNum);
		$('#hidden-simInfo').val(simInfo.id);
	}
	simInfoTree = new dhtmlXTreeObject("simInfo_tree", "100%", "100%", 0);
	simInfoTree.enableCheckBoxes(false);
	simInfoTree.enableThreeStateCheckboxes(false);
	simInfoTree.setImagePath("../../../js/dxtree/imgs/");
	simInfoTree.fillGroup(companys,sid, parent.lang.all_SIM_card);
	simInfoTree.fillOther(sims);
	simInfoTree.setOnDblClickHandler(simInfoDblClickEvent);
	addTreeEvent(simInfoTree,sims);
}

function simInfoDblClickEvent() {
	var selId = simInfoTree.getSelectedItemId();
	if(selId != '*_0' && !simInfoTree.isGroupItem(selId)) {
		$('#simInfo_tree').css('display','none');
		$('.td-simInfo #combox-simInfo').val(getArrayName(simInfos,selId));
		$('.td-simInfo #hidden-simInfo').val(selId);
		$('.td-simInfo .span-tip').text('*');
	}
}

function simInfoClick() {
	var selId = simInfoTree.getSelectedItemId();
	if(selId != '*_0' && !simInfoTree.isGroupItem(selId)) {
		$('#simInfo_tree').css('display','none');
		$('.td-simInfo #combox-simInfo').val(getArrayName(simInfos,selId));
		$('.td-simInfo #hidden-simInfo').val(selId);
		$('.td-simInfo .span-tip').text('*');
	}
}

function addTreeEvent(tree,items) {
	var errtips = parent.lang.errSIMNotExists;
	isTreeOut = true;
	$('#info-mid-table .td-simInfo #combox-simInfo').on('input propertychange click',function(e){
		$('#simInfo_tree').css('top',getTop($('#info-mid-table .td-simInfo .btn-group').get(0)) + $('#info-mid-table .td-simInfo .btn-group').height() + 'px');
		$('#simInfo_tree').css('left',getLeft($('#info-mid-table .td-simInfo .btn-group').get(0)) + 'px');
		$('#simInfo_tree').css('width',$('#info-mid-table .td-simInfo .btn-group .item').width()+'px');
		if(e.type == 'click') {
			isTreeOut = false;
			$('#simInfo_tree').show();
		}
		if (searchTimer == null) {
			searchTimer = setTimeout(function() {
				var vname = $.trim($('#info-mid-table .td-simInfo #combox-simInfo').val());
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
	$('#info-mid-table .td-simInfo .bg-icon-simInfo').on('click',function(){
		$('#simInfo_tree').css('top',getTop($('#info-mid-table .td-simInfo .btn-group').get(0)) + $('#info-mid-table .td-simInfo .btn-group').height() + 'px');
		$('#simInfo_tree').css('left',getLeft($('#info-mid-table .td-simInfo .btn-group').get(0)) + 'px');
		$('#simInfo_tree').css('width',$('#info-mid-table .td-simInfo .btn-group .item').width()+'px');
		if($('#simInfo_tree').css('display') == 'none') {
			$('#simInfo_tree').show();
			isTreeOut = false;
			if (searchTimer == null) {
				searchTimer = setTimeout(function() {
					var vname = $.trim($('#info-mid-table .td-simInfo #combox-simInfo').val());
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
	
	
	$('#info-mid-table .td-simInfo #combox-simInfo').on('keydown',function(e){
		if(e.keyCode == 13) {
			$('#simInfo_tree').css('top',getTop($('#info-mid-table .td-simInfo .btn-group').get(0)) + $('#info-mid-table .td-simInfo .btn-group').height() + 'px');
			$('#simInfo_tree').css('left',getLeft($('#info-mid-table .td-simInfo .btn-group').get(0)) + 'px');
			$('#simInfo_tree').css('width',$('#info-mid-table .td-simInfo .btn-group .item').width()+'px');
			if($('#simInfo_tree').css('display') == 'none') {
				$('#simInfo_tree').show();
				isTreeOut = true;
				if (searchTimer == null) {
					searchTimer = setTimeout(function() {
						var vname = $.trim($('#info-mid-table .td-simInfo #combox-simInfo').val());
						if (vname !== "") {
							var search = tree.searchVehicle(vname);
							$('#info-mid-table .td-simInfo').find('.span-tip').text('*');
							if(search == null) {
								$('#info-mid-table .td-simInfo #hidden-simInfo').val('');
								$('#info-mid-table .td-simInfo .span-tip').text(errtips);
								isTreeOut = true;
							}
						}else {
							$('#info-mid-table .td-simInfo #hidden-simInfo').val('');
							$('#info-mid-table .td-simInfo .span-tip').text(errtips);
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
	
	$('#simInfo_tree').on('mouseover',function(){
		isTreeOut = false;
	}).on('mouseout',function(){
		isTreeOut = true;
	});
}

function checkTreeParam(tree,items,errtips){
	var sname = $.trim($('#info-mid-table .td-simInfo #combox-simInfo').val());
	var selId = tree.getSelectedItemId();
	if(selId != '*_0' && !tree.isGroupItem(selId)) {
		var cname = getArrayName(items,selId);
		if(sname == cname) {
			simInfoClick();
			isTreeOut = true;
		}else {
			$('#info-mid-table .td-simInfo #hidden-simInfo').val('');
			$('#info-mid-table .td-simInfo .span-tip').text(errtips);
			$('#simInfo_tree').hide();
			isTreeOut = true;
		}
	}else {
		$('#simInfo_tree').hide();
		$('#info-mid-table .td-simInfo .span-tip').text(errtips);
		$('#info-mid-table .td-simInfo #hidden-simInfo').val('');
		isTreeOut = true;
	}
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

function addTips(name,tips) {
	$(name).append('<span class="span-tip red">'+tips+'</span>');
}

function getTerminalTypes() {
	var terminalTypes = [];
	terminalTypes.push({id:5,name: parent.lang.device_standard});
	terminalTypes.push({id:6,name: parent.lang.device_Beidou});
	terminalTypes.push({id:7,name: parent.lang.device_video});
	terminalTypes.push({id:0,name: parent.lang.other});
	return terminalTypes;
}
