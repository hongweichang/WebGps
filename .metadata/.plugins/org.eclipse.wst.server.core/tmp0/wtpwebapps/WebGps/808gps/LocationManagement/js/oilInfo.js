var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var resistance = getUrlParameter('resistance');
var oil = getUrlParameter('oil');
var old_sensor = getUrlParameter('sensor');
var acountOfOil = getUrlParameter('acountOfOil');
$(document).ready(function(){
	setTimeout(loadReadyPage, 50);
});
var aResistance = [];
var aOil = [];
function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}
function loadPage(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;

	var tab_display = [parent.lang.fuel_sensors,parent.lang.corresponding_to_the_amount_of_oil];
	var tab_name = ['sensor','oil'];
	var tab_type = ['input','input'];
	
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip: '',hide:false,tabshide:false},
				colgroup:{width:['120px','250px']},
				tabs:{
					display: tab_display,
					name : tab_name,
					type: tab_type,
				}
			}
		]
	});
	
	enterDigital('#input-sensor');
	enterDigital('#input-oil');
	$('#input-sensor').on('blur',function(){
		if($(this).val() == ''){
			$(this).val(10);
		}
		if($(this).val() != '' && $(this).val()<1){
			$(this).val(1);
		}else if($(this).val()>100000){
			$(this).val(100000);
		}
	});
	$('#input-oil').on('blur',function(){
		if($(this).val() == ''){
			$(this).val(10);
		}
		if($(this).val() != '' && $(this).val()<1){
			$(this).val(1);
		}else if($(this).val()>2000){
			$(this).val(2000);
		}
	});
	$('#input-sensor').css('width',160);
	$('#input-oil').css('width',160);
	$('.td-sensor').append('<span>'+ parent.lang.sensor_tip +'</span>');
	$('.td-oil').append('<span>'+ parent.lang.change_tip +'</span>');
	if(type == 'edit'){
		$('#input-sensor').val(old_sensor);
		$('#input-oil').val(acountOfOil);
	}
	var buttons = [];
	var but = [];
	but.push({
		display: parent.lang.add, 
		name : '', 
		pclass : 'submit',
		bgcolor : 'gray',
		hide : false
	});
	buttons.push(but);
	but = [];
	but.push({
		display: parent.lang.cancel, 
		name : '', 
		pclass : 'close',
		bgcolor : 'gray', 
		hide : false
	});
	buttons.push(but);
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : buttons 
	});
	$('.submit','#toolbar-btn').on('click',saveOilValue);
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'oilInfo'}).close();
	});
}


var aResistance = [];
var aOil = [];
function saveOilValue(){
	var sensor = $('#input-sensor').val();
	var fuel = $('#input-oil').val();
	if(type == 'edit'){
		aResistance = resistance.split(",");
		aOil = oil.split(",");
		resistance = "";
		oil = "";
		for (var i = 0; i < aResistance.length; i++) {
			if(aResistance[i] != old_sensor && aOil[i] != acountOfOil){
				resistance += aResistance[i] + ",";
				oil += aOil[i] + ",";
			}
		}
		resistance = resistance.substring(0,resistance.length-1);
		oil = oil.substring(0,oil.length-1);
	}
	setResistanceOil(sensor,fuel);
}

function setResistanceOil(sensor,fuel){
	var scales = "";
	var oils = "";
	if(sensor == null || sensor == '' || fuel == null || fuel == ''){
		$.dialog.tips(parent.lang.oil_err, 1);
		return;
	}
	if((resistance == null|| resistance == '')&&(oil == null || oil == '')){
		if(sensor > 0 && fuel > 0){
			scales += sensor;
			oils += fuel;
		}else{
			$.dialog.tips(parent.lang.oil_err, 1);
			return;
		}
	}else{
		aResistance = resistance.split(",");
		aOil = oil.split(",");
		if(sensor > Number(aResistance[aResistance.length-1]) && fuel > Number(aOil[aOil.length-1])){
			scales = resistance + "," + sensor;
			oils = oil + "," + fuel;
		}else if(sensor < Number(aResistance[0]) && fuel < Number(aOil[0])){
			scales = sensor + "," + resistance;
			oils = fuel +"," + oil;
		}else{
			scales += aResistance[0];
			oils += aOil[0];
			for (var i = 1; i < aResistance.length; i++) {
				if(Number(aResistance[i-1]) < sensor && sensor < Number(aResistance[i]) && Number(aOil[i-1]) < fuel && fuel < Number(aOil[i])){
					scales += "," + sensor;
					oils += "," + fuel;
				}
				scales += "," + aResistance[i];
				oils += "," + aOil[i];
			}
		}
	}
	if(resistance == scales || oil == oils){
		$.dialog.tips(parent.lang.oil_err, 1);
		return;
	}
	resistance = scales;
	oil = oils;
	W.doSaveOilSuccess(type,resistance,oil);
}
