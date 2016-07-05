var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var vehiIdno = decodeURIComponent(getUrlParameter('vehiIdno'));//选择的车辆节点
var applyId = decodeURIComponent(getUrlParameter('applyId'));
var companys = [];
var sid = null;
var dev_id = null;
var maxCount = 1;
var indexArray = [];
var z_index = 0;
var receipt = null;
var apply = null;
 
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
	}else{
		but.push({
			display: parent.lang.issued, 
			name : '', 
			pclass : 'issued',
			bgcolor : 'gray',
			hide : false
		});
		buttons.push(but);
		but = [];
		but.push({
			display: parent.lang.print, 
			name : '', 
			pclass : 'print',
			bgcolor : 'gray', 
			hide : false
		});
		buttons.push(but);
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
	$('.issued','#toolbar-btn').hide();
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
					display: [parent.lang.send_car_num,parent.lang.send_car_people,parent.lang.alarm_driver_name,parent.lang.plate_number,parent.lang.send_car_units,'',
					    parent.lang.send_start_time,parent.lang.send_end_time,parent.lang.start_liCheng,parent.lang.end_liCheng,parent.lang.departure,
					    parent.lang.destination,parent.lang.client_name,parent.lang.contacts_and_phone,parent.lang.client_adress,'',
					    parent.lang.cargo_name,parent.lang.weight,parent.lang.cargo_num,parent.lang.volume,parent.lang.freight_invoice_no,
					    parent.lang.scattered_num,parent.lang.box,parent.lang.boxes_num,parent.lang.box_num_one,parent.lang.box_num_two,
					    parent.lang.ticket_record_mile,parent.lang.actual_mile_acess,parent.lang.unit_price,parent.lang.nuclear_fees,
					    parent.lang.parking_fee,parent.lang.road_toll,parent.lang.collection_costs,parent.lang.servers_style,'安全提示：','',parent.lang.transfer_people_sign,parent.lang.customer_sign
					    ],
					name : 
						['sentCarSingleNum','sentCarPeople','driverName','vehiIDNO','carriageUnit','','sendStartTime','sendEndTime','startLiCheng','endLiCheng',
					        'departure','destination','clientName','contactsAndPhone','customerAddress','','cargoName','cargoWeight','cargoNum',
					        'cargoVolume','freightInvoiceNo','scatteredSingleNum','box','boxNum','boxNumOne','boxNumTwo','ticketRecordMile',
					        'actualMileAcess','unitPrice','nuclearFees','parkingFee','roadToll','collectionCosts','servers','safeTip','','squareTransferReceipt','customerSignRecognition'],
						/*['no','sendCarUnits','sendCarTime','clientName','adress','liCheng','contacts','phone','driverName',
					        'vehiIDNO','freightInvoiceNo','cargoName','servers','transport','weight','volume','box','boxesNum',
					        'transferSignature','shipment','upClose','other','sendCarNotepad','','sendPersonSignature','membersFreight',
					        'remark','','driverSignature','customerSignature'],*/
					type:[ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype
					      ,ttype,ttype,ttype,ttype,ttype,ttype,'',ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype,'','textArea','',ttype,ttype],
					length:[]
				}
			}
		]
	
	});
	$('#textArea-safeTip').attr("maxlength",100);
	$('.td-safeTip').append('<span class="red">100字以内</span>');
	$('#info-mid-table .panel-head').hide();
	if(type == 'add' || type == 'edit') {
		addTips('.td-sentCarSingleNum','*');
		addTips('.td-sentCarPeople','*');
		addTips('.td-sendStartTime','*');
		addTips('.td-clientName','*');
		addTips('.td-customerAddress','*');
		addTips('.td-driverName','*');
		addTips('.td-freightInvoiceNo','*');
		addTips('.td-servers','*');
		$('.input-sendStartTime').addClass('Wdate');
		$('.input-sendStartTime').attr('name','sendStartTime');
		$('.input-sendStartTime').attr('id','sendStartTime');
		$('.input-sendStartTime').attr('readonly','readonly');
		$('.input-sendStartTime').css('width','70%'); 
		$('.input-sendEndTime').addClass('Wdate');
		$('.input-sendEndTime').attr('name','sendEndTime');
		$('.input-sendEndTime').attr('id','sendEndTime');
		$('.input-sendEndTime').attr('readonly','readonly');
		$('.input-sendEndTime').css('width','70%'); 
		$(".input-vehiIDNO").get(0).disabled = true;
	}
	ajaxLoadDocumentInfo();

	$('.submit','#toolbar-btn').on('click',function(){ApplySubmit(2)});
	$('.nopass','#toolbar-btn').on('click',function(){ApplySubmit(3)});
	$('.issued','#toolbar-btn').on('click',issued);
	$('.print','#toolbar-btn').on('click',print);
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'invoiceinfo'}).close();
	});
}

function addTips(name,tips) {
	$(name).append('<span class="span-tip red">'+tips+'</span>');
}

function getServers() {
	var servers = [];
	servers.push({id:0,name: parent.lang.arrival_gate});
	servers.push({id:1,name: parent.lang.station_to_door});
	return servers;
}

function getTransport() {
	var transport = [];
	transport.push({id:0,name: parent.lang.scattered});
	transport.push({id:1,name: parent.lang.batch});
	transport.push({id:2,name: parent.lang.whole_car});
	transport.push({id:3,name: parent.lang.container});
	return transport;
}

function getBox() {
	var box = [];
	box.push({id:0,name: 'T20'});
	box.push({id:1,name: 'T40'});
	return box;
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
		var action = 'StandardVehicleAction_findInvoice.action?id='+getUrlParameter('id');
		$.myajax.jsonGetEx(action, function(json,action,success){
			if (success) {
				receipt = json.receipt;
				loadDocumentInfo(receipt);
			}
		});
	}else{
		if(applyId){
			disableForm(true);
			$.myajax.showLoading(true, parent.lang.loading, this);
			var action = 'StandardVehicleAction_findApply.action?id='+applyId;
			$.myajax.jsonGetEx(action, function(json,action,success){
				if (success) {
					apply = json.receipt;
					loadDocumentInfo();
				}
			});
			$.myajax.showLoading(false);
			disableForm(false);
		}else{
			loadDocumentInfo();
		}
	}
	$.myajax.showLoading(false);
	disableForm(false);
}

function loadDocumentInfo(params) {
	var servers = getServers(); 
	var box = getBox();
	if(type == 'add' || type == 'edit' || type == 'check') {
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
		if(type == 'add'){
		    $(".input-sendStartTime").val(dateCurrentTimeString());
			$(".input-sendStartTime").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}); }); 
			$(".input-sendEndTime").val(dateCurrentTimeString());
			$(".input-sendEndTime").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}); });
			$('#textArea-safeTip').val('严格执行出车前、行车中、收车后检查制度，系好安全带，文明驾驶。严禁酒后驾车，严禁驾驶过程中吸烟、使用手机等不文明行为。');
			$('#explanation').text("注：零散货物重量以公斤为单位；批量、整车、集装箱货物以吨为单位。2签认单物流调度留存一联，营业部留存一联，驾驶员携带一联作为与路方工作人员、客户交接的签认凭据并留存；遇代收费用时，驾驶员、" +
					"客户共同签认后交客户留存一份。3、服务方式、箱型等处选择打“√“。4、多批（件）零散货物集中配送时，填记距离最远一单货物信息。 ");
			if(apply){
				$('#combox-servers').val(getArrayName(servers,apply.servers));
				$('#hidden-servers').val(apply.servers);
				$('#combox-box').val(getArrayName(box,apply.box));
				$('#hidden-box').val(apply.box);
				$('.input-clientName').val(apply.clientName);
				$('.input-contactsAndPhone').val(apply.contactsAndPhone);
				$('.input-customerAddress').val(apply.customerAddress);
				$('.input-cargoName').val(apply.cargoName);
				$('.input-cargoWeight').val(apply.cargoWeight);
				$('.input-cargoNum').val(apply.cargoNum);
				$('.input-cargoVolume').val(apply.cargoVolume);
				$('.input-freightInvoiceNo').val(apply.freightInvoiceNo);
				$('.input-scatteredSingleNum').val(apply.scatteredSingleNum);
				$('.input-boxNum').val(apply.boxNum);
				$('.input-boxNumOne').val(apply.boxNumOne);
				$('.input-boxNumTwo').val(apply.boxNumTwo);
				$('.input-unitPrice').val(apply.unitPrice);
				$('.input-nuclearFees').val(apply.nuclearFees);
				$('.input-collectionCosts').val(apply.collectionCosts);
			}else{
				$(".input-vehiIDNO").val(vehiIdno);
				$('#combox-servers').val(getArrayName(servers,0));
				$('#hidden-servers').val(0);
				$('#combox-box').val(getArrayName(box,0));
				$('#hidden-box').val(0);
			}
		}else{
			$('.input-sentCarSingleNum').val(params.sentCarSingleNum);
			$('.input-sentCarPeople').val(params.sentCarPeople);
			$('.input-driverName').val(params.driverName);
			if(params.vehicle){
				$('.input-vehiIDNO').val(params.vehicle.vehiIDNO);
			}else{
				$('.input-vehiIDNO').val('');
			}
			$('.input-carriageUnit').val(params.carriageUnit);
			$('.input-sendStartTime').val(dateFormat2TimeString(new Date(params.sendStartTime)));
			$('.input-sendEndTime').val(dateFormat2TimeString(new Date(params.sendEndTime)));
			$('.input-startLiCheng').val(params.startLiCheng);
			$('.input-endLiCheng').val(params.endLiCheng);
			$('.input-departure').val(params.departure);
			$('.input-destination').val(params.destination);
			$('.input-clientName').val(params.clientName);
			$('.input-contactsAndPhone').val(params.contactsAndPhone);
			$('.input-customerAddress').val(params.customerAddress);
			$('#combox-servers').val(getArrayName(servers,params.servers));
			$('#hidden-servers').val(params.servers);
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
			$('.input-ticketRecordMile').val(params.ticketRecordMile);
			$('.input-actualMileAcess').val(params.actualMileAcess);
			$('.input-unitPrice').val(params.unitPrice);
			$('.input-nuclearFees').val(params.nuclearFees);
			$('.input-parkingFee').val(params.parkingFee);
			$('.input-roadToll').val(params.roadToll);
			$('.input-collectionCosts').val(params.collectionCosts);
			$('.input-squareTransferReceipt').val(params.squareTransferReceipt);
			$('.input-customerSignRecognition').val(params.customerSignRecognition);
			$('#textArea-safeTip').val(params.safeTip);
			$('#explanation').val(params.explanation)
			if(type == 'check'){
				addDisableds('.input-sentCarSingleNum');
				addDisableds('.input-sentCarPeople');
				addDisableds('.input-driverName');
				addDisableds('.input-vehiIDNO');
				addDisableds('.input-carriageUnit');
				addDisableds('.input-sendStartTime');
				addDisableds('.input-sendEndTime');
				addDisableds('.input-startLiCheng');
				addDisableds('.input-endLiCheng');
				addDisableds('.input-departure');
				addDisableds('.input-destination');
				addDisableds('.input-clientName');
				addDisableds('.input-contactsAndPhone');
				addDisableds('.input-customerAddress');
				addDisableds('#combox-servers');
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
				addDisableds('.input-ticketRecordMile');
				addDisableds('.input-actualMileAcess');
				addDisableds('.input-unitPrice');
				addDisableds('.input-nuclearFees');
				addDisableds('.input-parkingFee');
				addDisableds('.input-roadToll');
				addDisableds('.input-collectionCosts');
				addDisableds('.input-squareTransferReceipt');
				addDisableds('.input-customerSignRecognition');
				addDisableds('#textArea-safeTip');
				addDisableds('#explanation');
			}
		}
	}else {
		if( parent.myUserRole.isSecondCompany()||parent.myUserRole.isThreeCompany()){
			$('.issued','#toolbar-btn').show();
		}
		$('.print','#toolbar-btn').show();
		$('.td-sentCarSingleNum').append(params.sentCarSingleNum);
		$('.td-sentCarPeople').append(params.sentCarPeople);
		$('.td-driverName').append(params.driverName);
		if(params.vehicle){
			$('.td-vehiIDNO').append(params.vehicle.vehiIDNO);
		}else{
			$('.td-vehiIDNO').append('');
			$('.issued','#toolbar-btn').hide();
			$('.print','#toolbar-btn').hide();
		}
		$('.td-carriageUnit').append(params.carriageUnit);
		$('.td-sendStartTime').append(dateFormat2TimeString(new Date(params.sendStartTime)));
		$('.td-sendEndTime').append(dateFormat2TimeString(new Date(params.sendEndTime)));
		$('.td-startLiCheng').append(params.startLiCheng);
		$('.td-endLiCheng').append(params.endLiCheng);
		$('.td-departure').append(params.departure);
		$('.td-destination').append(params.destination);
		$('.td-clientName').append(params.clientName);
		$('.td-contactsAndPhone').append(params.contactsAndPhone);
		$('.td-customerAddress').append(params.customerAddress);
		$('.td-servers').append(getArrayName(servers,params.servers));
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
		$('.td-ticketRecordMile').append(params.ticketRecordMile);
		$('.td-actualMileAcess').append(params.actualMileAcess);
		$('.td-unitPrice').append(params.unitPrice);
		$('.td-nuclearFees').append(params.nuclearFees);
		$('.td-parkingFee').append(params.parkingFee);
		$('.td-roadToll').append(params.roadToll);
		$('.td-collectionCosts').append(params.collectionCosts);
		$('.td-squareTransferReceipt').append(params.squareTransferReceipt);
		$('.td-customerSignRecognition').append(params.customerSignRecognition);
		$('#textArea-safeTip').text(params.safeTip);
		$('#explanation').text(params.explanation)
		addDisableds('#textArea-safeTip');
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
		if(($(this).val() == null || $(this).val() == '') && (name == 'sentCarSingleNum' 
			|| name == 'sentCarPeople' || name == 'sendStartTime' || name == 'clientName'
			|| name == 'customerAddress' || name == 'driverName' || name == 'freightInvoiceNo' 
				|| name == 'servers')){
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
		data.receiptId = receipt.receiptId;
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
		if(applyId){
			data.receiptId = applyId;
		}
	}
	data.sentCarSingleNum = $.trim($('.input-sentCarSingleNum').val());
	data.sentCarPeople = $.trim($('.input-sentCarPeople').val());
	data.driverName = $.trim($('.input-driverName').val());
	var vehicle = {};
	vehicle.vehiIDNO = $.trim($('.input-vehiIDNO').val());
	data.vehicle = vehicle;
	data.carriageUnit = $.trim($('.input-carriageUnit').val());
	data.sendStartTime = dateStrLongTime2Date($.trim($('.input-sendStartTime').val()));
	data.sendEndTime = dateStrLongTime2Date($.trim($('.input-sendEndTime').val()));
	data.startLiCheng = $.trim($('.input-startLiCheng').val());
	data.endLiCheng = $.trim($('.input-endLiCheng').val());
	data.departure = $.trim($('.input-departure').val());
	data.destination = $.trim($('.input-destination').val());
	data.clientName = $.trim($('.input-clientName').val());
	data.contactsAndPhone = $.trim($('.input-contactsAndPhone').val());
	data.customerAddress = $.trim($('.input-customerAddress').val());
	data.servers = $.trim($('#hidden-servers').val());
	data.cargoName = $.trim($('.input-cargoName').val());
	data.cargoWeight = $.trim($('#hidden-cargoWeight').val());
	data.cargoNum = $.trim($('.input-cargoNum').val());
	data.cargoVolume = $.trim($('.input-cargoVolume').val());
	data.freightInvoiceNo = $.trim($('.input-freightInvoiceNo').val());
	data.scatteredSingleNum = $.trim($('.input-scatteredSingleNum').val());
	data.box = $.trim($('#hidden-box').val());
	data.boxNum = $.trim($('.input-boxNum').val());
	data.boxNumOne = $.trim($('.input-boxNumOne').val());
	data.boxNumTwo = $.trim($('.input-boxNumTwo').val());
	data.ticketRecordMile = $.trim($('.input-ticketRecordMile').val());
	data.actualMileAcess = $.trim($('.input-actualMileAcess').val());
	data.unitPrice = $.trim($('.input-unitPrice').val());
	data.nuclearFees = $.trim($('.input-nuclearFees').val());
	data.parkingFee = $.trim($('.input-parkingFee').val());
	data.roadToll = $.trim($('.input-roadToll').val());
	data.collectionCosts = $.trim($('.input-collectionCosts').val());
	data.squareTransferReceipt = $.trim($('.input-squareTransferReceipt').val());
	data.customerSignRecognition = $.trim($('.input-customerSignRecognition').val());
	data.safeTip = $.trim($('#textArea-safeTip').val());
	data.explanation = $.trim($('#explanation').val());
	
	var action = 'StandardVehicleAction_margeInvoice.action';
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

function issued(){
	var action = 'StandardVehicleAction_issInvoice.action?id='+getUrlParameter('id');
	$.myajax.jsonGetEx(action, function(json,action,success){
		if (success) {
			W.doIssDocumentSuc();
		}
	});
}