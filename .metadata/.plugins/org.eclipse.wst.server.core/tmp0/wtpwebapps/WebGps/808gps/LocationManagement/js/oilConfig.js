var api = frameElement.api, W = api.opener;
var vehiIdno = decodeURIComponent(getUrlParameter('vehiIdno'));//选择的车辆节点
var infoType = 0;
var deviceYouLiang = null;
$(document).ready(function(){
	loadReadyPage();
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
		setPanelWidth();
	}
}

function loadPage(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	api.title(parent.lang.oil_config + '&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;' + vehiIdno);
	$('#toolbar-btn1').flexPanel({
		ButtonsModel : [
		     [{display: parent.lang.add, name : '', pclass : 'oilAdd',
		    	 bgcolor : 'gray', hide : false}]
		]
	});
	
	$('#storageTable').flexigrid({
		url: "storageTable",
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.fuel_sensor_value, name : 'fuelSensor', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.corresponding_to_the_amount_of_oil, name : 'acountOfOil', width : 150, sortable : false, align: 'center'}
		],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		usepager: false,
		autoload: true,
		singleSelect: true,
		checkbox: false,
//		title: parent.lang.report_custom_alarm_detail,
		useRp: true,
		idProperty: 'idno',
		showTableToggleBtn: false,
		showToggleBtn: true,
		onSubmit: addStorageInfo,
		width: 'auto',//Math.round(6 * parent.screenWidth/7) - 5,
		height: 'auto'
	});
	$('#search-table .list .flexigrid .pDiv').hide();
	initStatisticData();
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip: '',hide:false,tabshide:false},
				colgroup:{width:['340px','450px']},
				tabs:{
					display: [parent.lang.oil_change],
					name : ['change'],
					type:['input'],
					length:[]
				}
			}
		]
	});
	enterDigital('#input-change');
	$('#input-change').on('blur',function(){
		if($(this).val() == ''){
			$(this).val(10);
		}
		if($(this).val() != '' && $(this).val()<1){
			$(this).val(1);
		}
	});
	
	$('#required-area .panel-head').css('display','none');
	var buttons = [];
	var but = [];
	but.push({
		display: parent.lang.save, 
		name : '', 
		pclass : 'submit',
		bgcolor : 'gray',
		hide : false
	});
	buttons.push(but);
	but = [];
	but.push({
		display: parent.lang.save_to_other, 
		name : '', 
		pclass : 'others',
		bgcolor : 'gray',
		hide : false
	});
	buttons.push(but);
	but = [];
	but.push({
		display: parent.lang.close, 
		name : '', 
		pclass : 'close',
		bgcolor : 'gray', 
		hide : false
	});
	buttons.push(but);
	$('#toolbar-btn2').flexPanel({
		ButtonsModel : buttons 
	});
	$("#storageTable").flexSelectRowPropFun(function(obj) {
		W.addVehicleByTree($(obj).attr('data-id'));
	});
	
}

var rows = [];
var devIdno = "";
var resistance = "";
var oil = "";
var aResistance = [];
var aOil = [];
//初始化数据
function initStatisticData() {
	var vehicle = parent.vehicleManager.mapVehiList.get(vehiIdno);
	if(vehicle.getOilDevice() != null){
		devIdno = vehicle.getOilDevice().idno;
		$.myajax.jsonGet('StandardDeviceAction_getOilConfig.action?devIdno='+devIdno, function(json,action,success){
			if(success) {
				rows = [];
				deviceYouLiang = json.deviceYouLiang;
				if(deviceYouLiang != null){
					resistance = deviceYouLiang.re;
					oil = deviceYouLiang.oil;
					if(resistance != null && resistance != "" && oil != null && oil != ""){
						aResistance = resistance.split(",");
						aOil = oil.split(",");
						for (var i = 0; i < aResistance.length; i++) {
							var row = {};
							row.fuelSensor = aResistance[i];
							row.acountOfOil = aOil[i];
							rows.push(row);
						}
					}
					$('#input-change').val(deviceYouLiang.nc);
				}else{
					$('#input-change').val(2);
				}
				addStorageInfo();
				$('.oilAdd','#toolbar-btn1').on('click',addOilValue);
				$('.others','#toolbar-btn2').on('click',saveToOthers);
				$('.submit','#toolbar-btn2').on('click',saveOilConfig);
				$('.close','#toolbar-btn2').on('click',function(){
					W.monitorMenu.oilConfigObj = null;
					W.$.dialog({id:'oilConfig'}).close();
				});
			};
		}, null);
	}
}

//
function addStorageInfo() {
	if(rows.length >= 0) {
		var param = $('#storageTable').flexGetParams();
		var infos = [];
		for (var i = 0; i < rows.length; i++) {
			infos.push(rows[i]);
		}
		param.rp = rows.length;
		var pagination={currentPage: 1, pageRecords: param.rp, totalRecords: rows.length};
		var json = {};
		json.infos = infos;
		json.pagination = pagination;
		$('#storageTable').flexAddData(json, false);
	}
}

//改变窗口大小时加载页面
function setPanelWidth() {
	$('#search-table').height($(window).height() - 150);
	$('#search-table .flexigrid').each(function() {
		$(this).find(".bDiv").height($('#search-table').height() - $("#search-btn").height() - $('#search-table .active .flexigrid .hDiv').height() - $('#search-table .active .flexigrid .pDiv').height());
	});
}

function fillCellInfo(p, row, idx, index) {
	var name = p.colModel[idx].name;
	var ret = "";
	if(name == 'operator') {
		ret += '<a class="edit" href="javascript:editOil('+row['fuelSensor']+','+row['acountOfOil']+');" title="'+parent.lang.edit+'"></a>&nbsp&nbsp&nbsp&nbsp';
		ret += '<a class="delete" href="javascript:deleteOil('+row['fuelSensor']+','+row['acountOfOil']+');" title="'+parent.lang.del+'"></a>';
	}else if(name == 'position') { 
		if(row.isGpsValid) {
			ret = row.position;
		}else {
			ret = parent.lang.monitor_gpsUnvalid;
		}
	}else {
		ret = changeNull(row[name]);
	}
	return ret;
}

function addOilValue() {
	var url = 'url:LocationManagement/oilInfo.html?type=add&resistance='+resistance+'&oil='+oil;
	$.dialog({id:'oilInfo', title: '', content: url,
		width: '387px', height: '143px', min:true, max:false, lock:true,fixed:false
			, resize:false, close: false, parent: api });
}

function editOil(sensor,acountOfOil){
	var url = 'url:LocationManagement/oilInfo.html?type=edit&resistance='+resistance+'&oil='+oil+'&sensor='+sensor+'&acountOfOil='+acountOfOil;
	$.dialog({id:'oilInfo', title: '', content: url,
		width: '387px', height: '143px', min:true, max:false, lock:true,fixed:false
			, resize:false, close: false, parent: api });
}

function saveToOthers(){
	var timeCount = $('#input-time').val();
	var changeOil = $('#input-change').val();
	var url = 'url:LocationManagement/oilConfigToOther.html?changeOil='+changeOil+'&resistance='+resistance+'&oil='+oil;
	$.dialog({id:'oilToOther', title: parent.lang.rule_selectVehicle, content: url,
		width: '275px', height: '550px', min:true, max:false, lock:true,fixed:false
			, resize:false, close: false, parent: api });
}

function deleteOil(sensor,acountOfOil){
	rows = [];
	if(resistance == sensor || oil == acountOfOil){
		resistance = "";
		oil = "";
		addStorageInfo();
		return;
	}
	aResistance = resistance.split(",");
	aOil = oil.split(",");
	resistance = "";
	oil = "";
	for(var i = 0; i < aResistance.length; i++){
		if (aResistance[i]==sensor || aOil[i]==acountOfOil){
			if(i == aResistance.length-1){
				resistance = resistance.substring(0,resistance.length-1);
				oil = oil.substring(0,oil.length-1);
			}
			continue;
		} 
		if (aResistance[i]==aResistance[aResistance.length-1]){
			resistance += aResistance[i];
			oil += aOil[i];
        } else {
        	resistance += aResistance[i]+",";
        	oil += aOil[i]+",";
        } 
		if(aResistance[i] != "" && aOil[i] != ""){
			var row = {};
			row.fuelSensor = aResistance[i];
			row.acountOfOil = aOil[i];
			rows.push(row);
		}
	}
	addStorageInfo();
}

function saveOilConfig(){
	var data = {};
	if(deviceYouLiang != null){
		data.id = deviceYouLiang.id;
	}
	data.did = devIdno;
	data.nt = 0;
	data.nc = $('#input-change').val();
	data.re = resistance;
	data.oil = oil;
	var action = 'StandardDeviceAction_saveOilConfig.action';
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost( action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.monitorMenu.oilConfigObj = null;
			W.$.dialog({id:'oilConfig'}).close();
			$.dialog.tips(parent.lang.saveok, 1);
		}
	});
}

function doSaveOilSuccess(type,new_resistance,new_oil){
	if(type == 'edit'){
		$.dialog({id:'oilInfo'}).close();
	}
	rows = [];
	aResistance = new_resistance.split(",");
	aOil = new_oil.split(",");
	resistance = "";
	oil = "";
	for(var i = 0; i < aResistance.length; i++){
		if (aResistance[i]==aResistance[aResistance.length-1]){
			resistance += aResistance[i];
			oil += aOil[i];
        } else {
        	resistance += aResistance[i]+",";
        	oil += aOil[i]+",";
        } 
		if(aResistance[i] != "" && aOil[i] != ""){
			var row = {};
			row.fuelSensor = aResistance[i];
			row.acountOfOil = aOil[i];
			rows.push(row);
		}
	}
	addStorageInfo();
}

function ResetOilConfigPage(vIdno){
	vehiIdno = vIdno;
	api.title(parent.lang.oil_config + '&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;' + vehiIdno);
	initStatisticData();
}