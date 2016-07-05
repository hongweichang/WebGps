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
	var tips = '';
	if(type == 'add' || type == 'edit') {
		ttype = 'input';
		tips = '*';
	}

	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip:tips,hide:false,tabshide:false},
				colgroup:{width:['150px','325px','150px','325px']},
				tabs:{
					display: [parent.lang.job_number,parent.lang.belong_company,parent.lang.person_name,parent.lang.sex,parent.lang.contact_details,parent.lang.ID_number,
					          parent.lang.drivers_license_number,parent.lang.date_of_birth,parent.lang.rushDate,parent.lang.validity_of_drivers_license],
					name : ['jobNum','company','name','sex','contact','cardNumber','licenseNum','birth','rushDate','validity'],
					type:[ttype,'',ttype,'',ttype,ttype,ttype,ttype,ttype,ttype],
					length:[20,,20,,20,18,20,20,20,20]
				}
			}
		]
	
	});
	
	cleanSpelChar('#input-jobNum');
	cleanSpelChar('#input-name');
	cleanChar('#input-contact');
	cleanChar('#input-cardNumber');
	cleanChar('#input-licenseNum');
//	$('#info-mid-table .form-input').each(function() {
//		var name = $(this).attr('data-name');
//		if(name!=null && name!=''&& name!='birth' && name!='rushDate' && name != 'validity') {
//			cleanSpelChar('.input-'+name);	
//		}
//	});

	//加载司机信息
	ajaxLoadDriverInfo();
	$('.input-birth').on('click focus',function() {
		WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d %H:%m:%s'});
	});
	$('.submit','#toolbar-btn').on('click',function(){
		if(!checkParam()) {
			return;
		}
		var data = {};
		if(type == 'edit') {
			data.id = $.trim($('.input-id').val());
		}
		data.jobNum = $.trim($('.input-jobNum').val());
		data.name = $.trim($('.input-name').val());
		data.contact = $.trim($('.input-contact').val());
		data.cardNumber = $.trim($('.input-cardNumber').val());
		data.licenseNum = $.trim($('.input-licenseNum').val());
		var company = {};
		company.id = $.trim($('#hidden-company').val());
		if(company.id != null && company.id != '') {
			data.company = company;
		}
		data.sex = $.trim($('#hidden-sex').val());
		data.birth = dateStrLongTime2Date($('.input-birth').val());
		data.rushDate = dateStrLongTime2Date($('.input-rushDate').val());
		data.validity = dateStrLongTime2Date($('.input-validity').val());
		
		var action = 'StandardDriverAction_mergeDriver.action';
		disableForm(true);
		$.myajax.showLoading(true, parent.lang.saving);
		$.myajax.jsonPost( action, data, false, function(json, success) {
			disableForm(false);
			$.myajax.showLoading(false);
			if (success) {
				W.doSaveDriverSuc();
			}
		});
	});
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'driverinfo'}).close();
	});
	$('.reset','#toolbar-btn').on('click',function(){
		var url = 'OperationManagement/DriverInfo.html?type='+type;
		if(type == 'edit') {
			url += '&id='+getUrlParameter('id');
		}
		$('.ui_dialog',parent.document).find('iframe').attr('src',url);
	});
}

function ajaxLoadDriverInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	if(type == 'add') {
		$.myajax.jsonGet('StandardCompanyAction_loadUserCompanys.action?type=0', function(json,action,success){
			if(success) {
				companys = json.infos;
				loadDriverInfo();
			};
		}, null);
	}else {
		var action = 'StandardDriverAction_findDriver.action?id='+getUrlParameter('id')+'&type='+type;
		$.myajax.jsonGetEx(action, function(json,action,success){
			if (success) {
				var driver = json.driver;
				if (!$.isEmptyObject(json.driver)) {
					if(type == 'edit') {
						var allCompanys = json.companys;
						for(var i = 0;i < allCompanys.length; i++) {
							if(allCompanys[i].id == driver.company.id){
								companys.push(allCompanys[i]);
							};
						}
						for(var i = 0;i < companys.length; i++) {
							getChildCompanys(allCompanys,companys,companys[i].id);
						};
					}
					loadDriverInfo(driver);
				}
			}
		});
	}
	$.myajax.showLoading(false);
	disableForm(false);
}

function loadDriverInfo(params) {
	var sexs = getSexs();
	if(type == 'add' || type == 'edit') {
		if(type == 'add') {
			for(var i = 0; i < companys.length; i++) {
				if(companys[i].id == parent.companyId) {
					sid = companys[i].parentId;
				}
			}
			addCompanyTree(companys,sid);
		}else {
			sid = params.company.parentId;
			addCompanyTree(companys,sid);
		}
		$('.td-sex').flexPanel({
			ComBoboxModel :{
				input : {name : 'sex',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'sex', option : arrayToStr(sexs)}
			}	
		});
		$('#combox-sex').val(getArrayName(sexs,1));
		$('#hidden-sex').val(1);
		$('.input-birth').addClass('Wdate');
		$('.input-birth').attr('name','birth');
		$('.input-birth').attr('id','birth');
		$('.input-birth').attr('readonly','readonly');
		$('.input-birth').css('width','70%');
		$('.input-rushDate').addClass('Wdate');
		$('.input-rushDate').attr('name','rushDate');
		$('.input-rushDate').attr('id','rushDate');
		$('.input-rushDate').attr('readonly','readonly');
		$('.input-rushDate').css('width','70%');
		$('.input-validity').addClass('Wdate');
		$('.input-validity').attr('name','validity');
		$('.input-validity').attr('id','validity');
		$('.input-validity').attr('readonly','readonly');
		$('.input-validity').css('width','70%');
		if(type == 'add') {
			$(".input-birth").val(dateCurDateBeginString());
			$(".input-birth").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
			$(".input-rushDate").val(dateCurDateBeginString());
			$(".input-rushDate").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
			$(".input-validity").val(dateCurDateBeginString());
			$(".input-validity").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}); });
		//	$('#combox-company').val(getArrayName(companys,parent.companyId));
		//	$('#hidden-company').val(parent.companyId);
		}else if(type == 'edit') {
			$('.input-jobNum').val(params.jobNum);
		//	$('.input-jobNum').get(0).disabled = true;
			$('.td-jobNum').append('<input class="input-id" type="hidden" name="id" value="'+params.id+'"/>');
			$('.input-name').val(params.name);
			$('.input-contact').val(params.contact);
			$('.input-cardNumber').val(params.cardNumber);
			$('.input-licenseNum').val(params.licenseNum);
		//	$('.input-nowAddress').val(params.nowAddress);
			if(params.company != null) {
				$('#combox-company').val(params.company.name);
				$('#hidden-company').val(params.company.id);
			}
			$('#combox-sex').val(getArrayName(sexs,params.sex));
			$('#hidden-sex').val(params.sex);
	//		$('.input-address').val(params.Address);	
	//		$('#textArea-remark').val(params.Remarks);
			$('.input-birth').val(dateFormat2TimeString(new Date(params.birth)));
			$(".input-birth").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
			$('.input-rushDate').val(dateFormat2TimeString(new Date(params.rushDate)));
			$(".input-rushDate").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
			$('.input-validity').val(dateFormat2TimeString(new Date(params.validity)));
			$(".input-validity").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
		}
	}else {
		$('.td-name').text(params.name);
		$('.td-jobNum').text(params.jobNum);
		$('.td-contact').text(params.contact);
		$('.td-cardNumber').text(params.cardNumber);
		$('.td-licenseNum').text(params.licenseNum);
//		$('.td-nowAddress').text(params.nowAddress);
		if(params.company != null) {
			$('.td-company').text(params.company.name);
		}
		$('.td-sex').text(getArrayName(sexs,params.sex));
//		$('.td-address').text(params.Address);
		$('.td-birth').text(dateFormat2TimeString(new Date(params.birth)));
		$('.td-rushDate').text(dateFormat2TimeString(new Date(params.rushDate)));
		$('.td-validity').text(dateFormat2TimeString(new Date(params.validity)));
//		$('#textArea-remark').val(params.Remarks);
//		$('#textArea-remark').attr('readonly','readonly');
	}	
}

function getSexs() {
	var sexs = [];
	sexs.push({id:'1',name: parent.lang.man});
	sexs.push({id:'2',name: parent.lang.woman});
	return sexs;
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
//function disableForm(flag){}
