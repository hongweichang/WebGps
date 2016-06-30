var api = frameElement.api, W = api.opener;
var companys = parent.companys;
var type = getUrlParameter('type');
var index = getUrlParameter('index');
var companyId = getUrlParameter('companyId');
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
	if(type == 'device') {
		$('#info-mid-table').flexPanel({
			TableGroupModel :
			[	{
					title :{display: '',pid : 'required-area',tip: '*',hide:false,tabshide:false},
					colgroup:{width:['120px','250px']},
					tabs:{
						display: [parent.lang.device_number,parent.lang.belong_company],
						name : ['devIdno','company'],
						type:['input','input'],
						length:[20,20]
					}
				}
			]
		});	
		cleanChar('#input-devIdno');
		
	}else if(type == 'simInfo') {
		$('#info-mid-table').flexPanel({
			TableGroupModel :
			[	{
					title :{display: '',pid : 'required-area',tip: '*',hide:false,tabshide:false},
					colgroup:{width:['120px','250px']},
					tabs:{
						display: [parent.lang.SIM_card_number,parent.lang.belong_company],
						name : ['simInfo','company'],
						type:['input','input'],
						length:[40,20]
					}
				}
			]
		});	
		cleanChar('#input-simInfo');
	}else if(type == 'driver') {
		$('#info-mid-table').flexPanel({
			TableGroupModel :
			[	{
					title :{display: '',pid : 'required-area',tip: '*',hide:false,tabshide:false},
					colgroup:{width:['120px','250px']},
					tabs:{
						display: [parent.lang.job_number,parent.lang.person_name,parent.lang.ID_number,parent.lang.drivers_license_number,
							parent.lang.contact_details,parent.lang.sex,parent.lang.belong_company],
						name : ['jobNum','name','cardNumber','licenseNum','contact','sex','company'],
						type:['input','input','input','input','input','','input'],
						length:[40,20,18,20,20,,20]
					}
				}
			]
		});
		cleanChar('#input-cardNumber');
		cleanChar('#input-licenseNum');
		cleanChar('#input-contact');
		$('.td-sex').flexPanel({
			ComBoboxModel :{
				input : {name : 'sex',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'sex', option : arrayToStr(getSexs())}
			}	
		});
		$('#combox-sex').val(parent.lang.man);
		$('#hidden-sex').val(1);
	}

	$('#toolbar-btn').flexPanel({
		ButtonsModel :  [[{
			display: parent.lang.save, name : '', pclass : 'save',bgcolor : 'gray', hide : false
		}],[{
			display: parent.lang.close, name : '', pclass : 'close',bgcolor : 'gray', hide : false
		}]]
	});
	if(companyId == null || companyId == '') {
		companyId = parent.companyId==0?1:parent.companyId;
	}
	$('#input-company').val(getArrayName(companys,companyId));
	$('#input-company').get(0).disabled = true;

	$('.save').on('click',saveInfo);

	$('.close').on('click',function() {
		W.doExit();
	});
}

function saveInfo() {
	if(!checkParams()) {
		return;
	}
	var data = {};
	var company = {};
	company.id = companyId;
	company.name = $.trim($('#input-company').val());
	data.company = company;
	if(type == 'device') {
		//判断是否有空格
//		if(isCheckEmpty($('#input-devIdno').val())) {
//			$('#input-devIdno').focus();
//			alert(parent.lang.device_number + ":'" + $('#input-devIdno').val()+"'" + parent.lang.errValueContainSpace);
//			return;
//		}
		data.devIDNO = $.trim($('#input-devIdno').val());
	}else if(type == 'simInfo') {
		//判断是否有空格
//		if(isCheckEmpty($('#input-simInfo').val())) {
//			$('#input-simInfo').focus();
//			alert(parent.lang.SIM_card_number + ":'" + $('#input-simInfo').val()+"'" + parent.lang.errValueContainSpace);
//			return;
//		}
		data.cardNum = $.trim($('#input-simInfo').val());
	}else if(type == 'driver') {
		data.jobNum = $.trim($('#input-jobNum').val());
		data.name = $.trim($('#input-name').val());
		data.contact = $.trim($('#input-contact').val());
		data.cardNumber = $.trim($('#input-cardNumber').val());
		data.licenseNum = $.trim($('#input-licenseNum').val());
		data.sex = $.trim($('#hidden-sex').val());
	}
	var action = 'StandardVehicleAction_addInfo.action?type='+type;
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			if(type == 'device') {
				W.doSaveDeviceSuc(index,json.id,json.name);
			}else if(type == 'simInfo') {
				W.doSaveSimInfoSuc(index,json.id,json.name);
			}else if(type == 'driver') {
				W.doSaveDriverSuc(index,json.id,json.name);
			}
		}
	});
}

function checkParams() {
	var flag = true;
	var i = 0;
	$('#info-mid-table input').each(function() {
		var name = $(this).attr('data-name');
		if($(this).val() == null || $(this).val() == '') {
			$('.td-'+name).find('.span-tip').text(parent.lang.not_be_empty);
			if(i == 0) {
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

function getSexs() {
	var sexs = [];
	sexs.push({id:'1',name: parent.lang.man});
	sexs.push({id:'2',name: parent.lang.woman});
	return sexs;
}
