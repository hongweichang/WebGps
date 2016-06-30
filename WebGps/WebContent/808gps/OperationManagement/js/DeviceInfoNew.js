var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var companys = [];
var sid = null;

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
					display: [parent.lang.device_number,'',parent.lang.belong_company,parent.lang.device_type,parent.lang.SIM_card_number,'',parent.lang.device_serial,' '],
					name : ['devIDNO','','company','devType','simInfo','','serial','netAttr'],
					type:[ttype,'',,,,,ttype,],
					length:[,,,,,,40,]
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
		$('.td-simInfo').append('<input type="text" id="combox-simInfo" onclick="selectSimInfo();" readonly style="width:224px;"/><input type="hidden" id="hidden-simInfo"/><span class="add" onclick="addSimInfo();" title="'+parent.lang.add+'"></span><span class="clear" onclick="clearSimInfo();" title="'+parent.lang.clear+'"></span>');
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
	$('.td-netAttr').append('<input type="checkbox" name="netAddrType2" id="netAddrType2" value="1"/><span id="selectAddress2">' + parent.lang.device_selectAddress2 + '</span>');
//	$('#info-mid-table .form-input').each(function() {
//		if($(this).attr('data-name')!=null && $(this).attr('data-name')!='') {
//			cleanSpelChar('.input-'+$(this).attr('data-name'));	
//		}
//	});
//	cleanSpelChar('#input-devIDNO');
	cleanChar('#input-devIDNO');
	enterDigital('#input-devIDNObf');
	enterDigital('#input-devIDNObg');
//	$('.td-serial').find('.span-tip').remove();
	//加载设备信息
	ajaxLoadDeviceInfo();
	
	$('.submit','#toolbar-btn').on('click',devSubmit);
	
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
}

function ajaxLoadDeviceInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	if(type == 'add') {
		$.myajax.jsonGet('StandardCompanyAction_loadUserCompanys.action?type=0', function(json,action,success){
			if(success) {
				companys = json.infos;
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
			var idno = getUrlParameter('devIdno');
			if(idno) {
				$('#input-devIDNO').val(idno);
			}
			$('#combox-devType').val(getArrayName(devTypes,5));
			$('#hidden-devType').val(5);
		}else if(type == 'edit') {
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
			if(params.simInfo != null) {
				$('.td-simInfo #combox-simInfo').val(params.simInfo.cardNum);
				$('.td-simInfo #hidden-simInfo').val(params.simInfo.id);
			}
			if (params.netAddrType == 1) {
				$("#netAddrType2").get(0).checked = true;
			}
			$('#textArea-remark').val(params.remark);
		}
	}else {
		if(params.devIDNO) {
			$('.td-devIDNO').text(params.devIDNO);
		}
		if(params.devType) {
			$('.td-devType').text(getArrayName(devTypes,params.devType));
		}
		if(params.serialID) {
			$('.td-serial').text(params.serialID);
		}
		if(params.simInfo != null) {
			$('.td-simInfo').text(params.simInfo.cardNum);
		}
		if(params.brand) {
			$('.td-brand').text(params.brand);
		}
		if(params.model) {
			$('.td-model').text(params.model);
		}
		if(params.softwareVer) {
			$('.td-softwareVer').text(params.softwareVer);
		}
		if(params.hardwareVer) {
			$('.td-hardwareVer').text(params.hardwareVer);
		}
		if(params.factory) {
			$('.td-factory').text(params.factory);
		}
		if(params.company != null) {
			$('.td-company').text(params.company.name);
		}
		if(params.remark) {
			$('#textArea-remark').val(params.remark);
		}
		
		$('#textArea-remark').attr('readonly','readonly');
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
	}else {
		$('.td-company #combox-company').val('');
		$('.td-company #hidden-company').val('');
		$('#company_tree').hide();
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

function devSubmit() {
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
		
		if($('#input-devIDNO').val() == null || $('#input-devIDNO').val() == '') {
			$('.td-devIDNO .devIDNOTip').text(parent.lang.not_be_empty);
			$('#required-area .panel-body').addClass('show');
			$('.td-devIDNO #input-devIDNO').focus();
			flag = false;
		}else {
			$('.td-devIDNO .devIDNOTip').text('*');
		}
		//判断是否有空格
//		if(isCheckEmpty($('#input-devIDNO').val())) {
//			$('#input-devIDNO').focus();
//			alert(parent.lang.device_number + ":'" + $('#input-devIDNO').val()+"'" + parent.lang.errValueContainSpace);
//			return;
//		}
		data.devIDNO = $.trim($('#input-devIDNO').val());
		if(value == 2) {
			data.idnobf = $.trim($('#input-devIDNObf').val());
			data.idnobg = $.trim($('#input-devIDNObg').val());
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
		data.id = $.trim($('.input-id').val());
		data.devIDNO = $.trim($('.input-devIDNO').val());
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
	data.devType = $.trim($('#hidden-devType').val());
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
	data.serialID = $.trim($('.input-serial').val());
	if ($("#netAddrType2").get(0).checked){
		data.netAddrType = 1;
	} else {
		data.netAddrType = 0;
	}
	var simInfo = {};
	simInfo.id = $.trim($('#hidden-simInfo').val());
	simInfo.cardNum = $.trim($('#combox-simInfo').val());
	data.simInfo = simInfo;
//	if(data.serialID == null || data.serialID == '') {
//		$('.td-serial').find('.span-tip').text(parent.lang.not_be_empty);
//		if(blag) {
//			$('#required-area .panel-body').addClass('show');
////			$('.input-serial').focus();
//			blag = false;
//		}
//	}else {
//		$('.td-serial').find('.span-tip').text('*');
//	}
	if(!blag) {
		return;
	}
	data.brand = $.trim($('.input-brand').val());
	data.model = $.trim($('.input-model').val());
	data.softwareVer = $.trim($('.input-softwareVer').val());
	data.hardwareVer = $.trim($('.input-hardwareVer').val());
	data.factory = $.trim($('.input-factory').val()); 
	var company = {};
	company.id = $.trim($('#hidden-company').val());
	if(company.id != null || company.id != '') {
		data.company = company;
	}
	data.remark = $.trim($('#textArea-remark').val());
	
	var action = 'StandardDeviceAction_mergeDeviceNew.action';
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost( action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.doSaveDeviceSuc();
		}
	});
}

function clearSimInfo() {
	$('#combox-simInfo').val('');
	$('#hidden-simInfo').val('');
}

function selectSimInfo(index) {
	var name = $('#combox-simInfo').val();
	var id = $('#hidden-simInfo').val();
	$.dialog({id:'info', title:parent.lang.select+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.SIM_card_information,content: 'url:OperationManagement/SelectInfo.html?type=simInfo&id='+id+'&name='+name+'&singleSelect=true',
		width:'800px',height:'530px', min:false, max:false, lock:true, parent: api});
}

function addSimInfo(index) {
	var companyId = $('#hidden-company').val();
	$.dialog({id:'info', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.SIM_card_information,content: 'url:OperationManagement/AddInfo.html?type=simInfo&companyId='+companyId,
		width:'410px',height:'200px', min:false, max:false, lock:true, parent: api});
}

function doSelectSimInfo(index, id, name) {
	$('#combox-simInfo').val(name);
	$('#hidden-simInfo').val(id);
	$.dialog({id:'info'}).close();
}

function doSaveSimInfoSuc(index, id, name) {
	$('#combox-simInfo').val(name);
	$('#hidden-simInfo').val(id);
	$.dialog({id:'info'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

function doExit() {
	$.dialog({id:'info'}).close();
}

//function disableForm(flag){}