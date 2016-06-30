var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var companys = [];
var sid = null;
var dev_id = null;
var maxCount = 1;
var indexArray = [];
var z_index = 0;
var receipt = null;
 
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
	if(type == 'add' || type == 'edit' || type == 'check') {
		if(type == 'check'){
			but.push({
				display: parent.lang.status_pass, 
				name : '', 
				pclass : 'submit',
				bgcolor : 'gray',
				hide : false
			});
			buttons.push(but);
			but = [];
			but.push({
				display: parent.lang.status_not_pass, 
				name : '', 
				pclass : 'nopass',
				bgcolor : 'gray', 
				hide : false
			});
			buttons.push(but);
		}else{
			but.push({
				display: parent.lang.save, 
				name : '', 
				pclass : 'submit',
				bgcolor : 'gray',
				hide : false
			});
			buttons.push(but);
		}
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
	$('.print','#toolbar-btn').hide();
	
	var ttype = '';	
	if(type == 'add' || type == 'edit' || type == 'check') {
		ttype = 'input';
	}

	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip: '',hide:false,tabshide:false},
				colgroup:{width:['150px','325px','150px','325px']},
				tabs:{
					display: [parent.lang.companyName,'',parent.lang.client_name, parent.lang.contacts_and_phone,parent.lang.client_adress,"",
					    parent.lang.cargo_name,parent.lang.cargo_weight, parent.lang.cargo_num,parent.lang.cargo_volume,
					    parent.lang.freight_invoice_no,parent.lang.scattered_num, parent.lang.box,parent.lang.boxes_num,
					    parent.lang.box_num_one,parent.lang.box_num_two,parent.lang.unit_price,
					    parent.lang.nuclear_fees,parent.lang.collection_costs,parent.lang.servers_style,
					    ],
					name : ['company','','clientName','contactsAndPhone','customerAddress',''
						,'cargoName','cargoWeight','cargoNum','cargoVolume','freightInvoiceNo','scatteredSingleNum','box',
						'boxNum','boxNumOne','boxNumTwo','unitPrice','nuclearFees','collectionCosts','servers'],
					type:[ttype,'',ttype,ttype,ttype,'',ttype,ttype,ttype,ttype,ttype,ttype,'',ttype,ttype,ttype,ttype,ttype,ttype,''],
					length:[,,32,20,256,,64,64,11,11,11,32,32,32,11,32,32,11,11,11]
				}
			}
		]
	
	});
	
	$('#input-company').css('width','225px');
	if($('#input-company').get(0)){
		$('#input-company').get(0).disabled = true;
	}
	if(type == 'add' || type == 'edit' || type == 'check') {
		var servers = getServers(); 
		var box = getBox();
		$('.td-servers').flexPanel({
			ComBoboxModel :{
				input : {name : 'servers',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'servers', option : arrayToStr(servers)}
			}	
		});
		
		$('.td-box').flexPanel({
			ComBoboxModel :{
				input : {name : 'box',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'box', option : arrayToStr(box)}
			}	
		});
		if(type == 'add' || type == 'edit' || type == 'check') {
			addTips('.td-clientName','*');
			addTips('.td-servers','*');
			addTips('.td-cargoName','*');
			addTips('.td-cargoWeight','*');
			if(type == 'add'){
				$('#input-company').val(getArrayName(parent.vehiGroupList, parent.companyId));
				$('#combox-servers').val(getArrayName(servers,0));
				$('#hidden-servers').val(0);
				$('#combox-box').val(getArrayName(box,0));
				$('#hidden-box').val(0);
				$('#explanation').text("说明：该申请依据货票票面记载的信息填记并上报货运中心物流调度。代收费用：需驾驶员向客户代收的费用金额；服务方式：接取或送达。");
			}
		}
	}
	
	ajaxLoadDocumentInfo();
	$('.submit','#toolbar-btn').on('click',function(){ApplySubmit(2)});
	$('.nopass','#toolbar-btn').on('click',function(){ApplySubmit(3)});
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'applyinfo'}).close();
	});
}

function addTips(name,tips) {
	$(name).append('<span class="span-tip red">'+tips+'</span>');
}


function addDisableds(name) {
	if($(name).get(0)) {
		$(name).get(0).disabled = true;
	}
}

function ajaxLoadDocumentInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	if(type != 'add')  {
		var action = 'StandardVehicleAction_findApply.action?id='+getUrlParameter('id');
		$.myajax.jsonGetEx(action, function(json,action,success){
			if (success) {
				receipt = json.receipt;
				loadDocumentInfo(receipt);
			}
		});
	}
	$.myajax.showLoading(false);
	disableForm(false);
}

function getServers() {
	var servers = [];
	servers.push({id:0,name: parent.lang.arrival_gate});
	servers.push({id:1,name: parent.lang.station_to_door});
	return servers;
}

function getBox() {
	var box = [];
	box.push({id:0,name: '20'});
	box.push({id:1,name: '40'});
	return box;
}

function loadDocumentInfo(params) {
	var servers = getServers(); 
	var box = getBox();
	if(type == 'edit' || type == 'check') {
		$('.input-company').val(getArrayName(parent.vehiGroupList, params.companyId));
		$('.input-clientName').val(params.clientName);
		$('.input-contactsAndPhone').val(params.contactsAndPhone);
		$('.input-customerAddress').val(params.customerAddress);
		$('.input-cargoName').val(params.cargoName);
		$('.input-cargoWeight').val(params.cargoWeight);
		$('.input-cargoNum').val(params.cargoNum);
		$('.input-cargoVolume').val(params.cargoVolume);
		$('.input-freightInvoiceNo').val(params.freightInvoiceNo);
		$('.input-scatteredSingleNum').val(params.scatteredSingleNum);
		$('#combox-box').val(getArrayName(box,params.box));
		$('#hidden-box').val(params.box);
		$('.input-boxNum').val(params.boxNum);
		$('.input-boxNumOne').val(params.boxNumOne);
		$('.input-boxNumTwo').val(params.boxNumTwo);
		$('.input-unitPrice').val(params.unitPrice);
		$('.input-nuclearFees').val(params.nuclearFees);
		$('.input-collectionCosts').val(params.collectionCosts);
		$('#combox-servers').val(getArrayName(servers,params.servers));
		$('#hidden-servers').val(params.servers);
		$('#explanation').val(params.explanation);
		if(type == 'check'){
			addDisableds('.input-clientName');
			addDisableds('.input-contactsAndPhone');
			addDisableds('.input-customerAddress');
			addDisableds('.input-cargoName');
			addDisableds('.input-cargoWeight');
			addDisableds('.input-cargoNum');
			addDisableds('.input-cargoVolume');
			addDisableds('.input-freightInvoiceNo');
			addDisableds('.input-scatteredSingleNum');
			addDisableds('#combox-box');
			addDisableds('.input-boxNum');
			addDisableds('.input-boxNumOne');
			addDisableds('.input-boxNumTwo');
			addDisableds('.input-unitPrice');
			addDisableds('.input-nuclearFees');
			addDisableds('.input-collectionCosts');
			addDisableds('#combox-servers');
			addDisableds('#explanation');
		}
	}else {
		$('.print','#toolbar-btn').show();
		$('.td-company').append(getArrayName(parent.vehiGroupList, params.companyId));
		$('.td-clientName').append(params.clientName);
		$('.td-contactsAndPhone').append(params.contactsAndPhone);
		$('.td-customerAddress').append(params.customerAddress);
		$('.td-cargoName').append(params.cargoName);
		$('.td-cargoWeight').append(params.cargoWeight);
		$('.td-cargoNum').append(params.cargoNum);
		$('.td-cargoVolume').append(params.cargoVolume);
		$('.td-freightInvoiceNo').append(params.freightInvoiceNo);
		$('.td-scatteredSingleNum').append(params.scatteredSingleNum);
		$('.td-box').append(getArrayName(box,params.box));
		$('.td-boxNum').append(params.boxNum);
		$('.td-boxNumOne').append(params.boxNumOne);
		$('.td-boxNumTwo').append(params.boxNumTwo);
		$('.td-unitPrice').append(params.unitPrice);
		$('.td-nuclearFees').append(params.nuclearFees);
		$('.td-collectionCosts').append(params.collectionCosts);
		$('.td-servers').append(getArrayName(servers,params.servers));
		$('#explanation').val(params.explanation);
		addDisableds('#explanation');
		$('#info-body .ui-menu-with-icon').each(function(){
			$(this).remove();
		});
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
		if(($(this).val() == null || $(this).val() == '') && ( name == 'clientName' || name == 'servers' 
			|| name == 'cargoName'|| name == 'cargoWeight')){
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
	return flag;
}

//保存
function ApplySubmit(pass){
	if(!checkVehiParam()) {
		return;
	}
	var data = {};
	if(type == 'edit' ||type == 'check') {
		data.id = receipt.id;
		data.companyId = receipt.companyId;
		if(type == 'check'){
			if(pass == 2){
				data.status = 2;
			}else if(pass == 3){
				data.status = 3;
			}else{
				data.status = 1;
			}
		}else{
			data.status = 1;
		}
	}else if(type == 'add'){
		data.status = 1;
		data.companyId = parent.companyId;
	}
	data.clientName = $.trim($('.input-clientName').val());
	data.contactsAndPhone = $.trim($('.input-contactsAndPhone').val());
	data.customerAddress = $.trim($('.input-customerAddress').val());
	data.cargoName = $.trim($('.input-cargoName').val());
	data.cargoWeight = $.trim($('.input-cargoWeight').val());
	data.cargoNum = $.trim($('.input-cargoNum').val());
	data.cargoVolume = $.trim($('.input-cargoVolume').val());
	data.freightInvoiceNo = $.trim($('.input-freightInvoiceNo').val());
	data.scatteredSingleNum = $.trim($('.input-scatteredSingleNum').val());
	data.box = $.trim($('#hidden-box').val());
	data.boxNum = $.trim($('.input-boxNum').val());
	data.boxNumOne = $.trim($('.input-boxNumOne').val());
	data.boxNumTwo = $.trim($('.input-boxNumTwo').val());
	data.unitPrice = $.trim($('.input-unitPrice').val());
	data.nuclearFees = $.trim($('.input-nuclearFees').val());
	data.collectionCosts = $.trim($('.input-collectionCosts').val());
	data.servers = $.trim($('#hidden-servers').val());
	data.explanation = $.trim($('#explanation').val());
	data.sendStatus = 0;
	var action = 'StandardVehicleAction_margeApply.action';
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost( action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.doSaveDocumentSuc();
		}
	});
}

function print() {
	$("#info-mid").jqprint();
}