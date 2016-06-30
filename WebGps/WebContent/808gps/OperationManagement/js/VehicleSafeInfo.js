var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');

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
	var tip = "";
	if(type == 'add' || type == 'edit') {
		tip = '*';
		ttype = 'input';
	}

	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip: tip,hide:false,tabshide:false},
				colgroup:{width:['150px','325px','150px','325px']},
				tabs:{
					display: [parent.lang.plate_number,parent.lang.safe_com,parent.lang.agent,parent.lang.contact_phone,
					          parent.lang.safe_start_time,parent.lang.safe_end_time,parent.lang.safe_count,
					          parent.lang.price,parent.lang.discount,parent.lang.actualPrice,parent.lang.remark,''],
					name : ['vehiIDNO','safecom','agent','phone','startTime','endtime','count','price','discount','actual','remark',''],
					type:[ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype,ttype,'textArea',''],
					length:[20,64,32,20,20,,4,,3,,,]
				}
			}
		]
	});
	if(type == 'add' || type == 'edit') {
		$('.input-startTime').addClass('Wdate');
		$('.input-endtime').addClass('Wdate');
		$('.input-startTime').attr('name','startTime');
		$('.input-startTime').attr('id','startTime');
		$('.input-endtime').attr('name','endtime');
		$('.input-endtime').attr('id','endtime');
		$('.input-startTime').attr('readonly','readonly');
		$('.input-endtime').attr('readonly','readonly');
		$('.input-startTime').css('width','70%'); 
		$('.input-endtime').css('width','70%'); 
		enterDigital('.input-startTime');
		enterDigital('.input-endtimeendtime');
		enterDigital('.input-count');
		enterDigital('.input-price');
		enterDigital('.input-discount');
		$('.input-price').on('input propertychange',function(){
			var price = $('.input-price').val();
			var discount = $('.input-discount').val();
			if(price != null && price != '' && discount != null && discount != ''){
				$('.input-actual').val(price * discount);
			}else{
				$('.input-actual').val('');
			}
		});
		$('.input-discount').on('input propertychange',function(){
			var price = $('.input-price').val();
			var discount = $('.input-discount').val();
			if(price != null && price != '' && discount != null && discount != ''){
				$('.input-actual').val(parseFloat(price * discount)/parseFloat(100));
			}else{
				$('.input-actual').val('');
			}
		});
		$('.td-remark span').hide();
		$('#input-actual').attr('readonly','readonly');
		if(type == 'add'){
			$('#input-vehiIDNO').on('click keyup',selVehicle);
			$('#input-vehiIDNO').attr('readonly','readonly');
			$(".input-startTime").val(dateCurrentDateString());
			$(".input-startTime").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd'}); });
			$(".input-endtime").val(dateCurrentDateString());
			$(".input-endtime").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd'}); });
		}else{
			$('.td-vehiIDNO span').hide();
			$('#input-vehiIDNO').get(0).disabled = true;
		}
	}
	
	ajaxLoadSafeInfo();
	
	$('.submit','#toolbar-btn').on('click',safeSubmit);
	
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'safeinfo'}).close();
	});
}

var safe = null;

function ajaxLoadSafeInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	if(type != 'add') {
		var action = 'StandardVehicleSafeAction_findVehicelSafe.action?id='+getUrlParameter('id')+'&type='+type;
		$.myajax.jsonGetEx(action, function(json,action,success){
			if (success) {
				safe = json.safe;
				if (!$.isEmptyObject(json.safe)) {
					loadSafeInfo(safe);
				}
			}
		});
	}
	$.myajax.showLoading(false);
	disableForm(false);
}

function loadSafeInfo(params) {
	if(type == 'edit') {
		$('.input-vehiIDNO').val(params.vehicle.vehiIDNO);
		$('.input-safecom').val(params.safeCom);
		$('.input-agent').val(params.agent);
		$('.input-phone').val(params.telephone);
		$('.input-startTime').val(dateTime2DateString(new Date(params.startTime)));
		$('.input-endtime').val(dateTime2DateString(new Date(params.endTime)));
		$(".input-startTime").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd'}); });
		$(".input-endtime").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd'}); });
		$('.input-count').val(params.count);
		$('.input-price').val(params.price);
		$('.input-discount').val(params.discount);
		$('.input-actual').val(params.actualPrice);
		$('#textArea-remark').val(params.remark);
	}else {
		$('.td-vehiIDNO').text(params.vehicle.vehiIDNO);
		$('.td-safecom').text(params.safeCom);
		$('.td-agent').text(params.agent);
		$('.td-phone').text(params.telephone);
		$('.input-startTime').val(dateTime2DateString(new Date(params.startTime)));
		$('.input-endtime').val(dateTime2DateString(new Date(params.endTime)));
		$('.td-count').text(params.count);
		$('.td-price').text(params.price);
		$('.td-discount').text(params.discount);
		$('.td-actual').text(params.actualPrice);
		$('#textArea-remark').val(params.remark);
		$('#textArea-remark').attr('readonly','readonly');
	}
}

function checkVehiParam(){
	var flag = true;
	var i = 0;
	$('#required-area input').each(function(){
		var name = $(this).attr('data-name');
		if(($(this).val() == null || $(this).val() == '') && (name == 'vehiIDNO' 
			|| name == 'safecom' || name == 'agent' || name == 'phone' || name == 'actual'
			|| name == 'count' || name == 'price' || name == 'discount' || name == 'startTime' || name == 'endtime')){
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
}

function safeSubmit() {
	if(!checkVehiParam()) {
		return;
	}
	if(dateCompareStrDate($.trim($('.input-endtime').val()),$.trim($('.input-startTime').val())) == -1 
			|| dateCompareStrDate($.trim($('.input-endtime').val()),$.trim($('.input-startTime').val())) == 0){
		$.dialog.tips(parent.lang.safe_date_err,1);
		return;
	}
	var data = {};
	if(safe != null){
		data.id = safe.id;
	}
	var vehicle = {};
	vehicle.vehiIDNO = $('.input-vehiIDNO').val();
	data.vehicle = vehicle;
	data.safeCom = $('.input-safecom').val();
	data.agent = $('.input-agent').val();
	data.telephone = $('.input-phone').val();
	data.startTime = dateStrDate2Date($.trim($('.input-startTime').val()));
	data.endTime = dateStrDate2Date($.trim($('.input-endtime').val()));
	data.count = $('.input-count').val();
	data.price = $('.input-price').val();
	data.discount = $('.input-discount').val();
	data.actualPrice = $('.input-actual').val();
	data.remark = $.trim($('#textArea-remark').val());
	var action = 'StandardVehicleSafeAction_mergeVehicleSafeNew.action';
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost( action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.doSaveVehicleSafeSuc();
		}
	});
}

var selIds;
//选择车辆
function selVehicle() {
	$.dialog({id:'info', title:parent.lang.selectVehicleTitle,content: 'url:StatisticalReports/selectInfo.html?type=selVehicle&singleSelect=true&selectAll=false',
		width:'800px',height:'530px', min:false, max:false, lock:true, parent: api});
}

function doSelectVehicle(ids,vehicleList) {
	selIds = ids;
	$('#input-vehiIDNO').val(vehicleList);
	$.dialog({id:'info'}).close();
}

function doExit() {
	$.dialog({id:'info'}).close();
}