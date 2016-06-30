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
					display: [parent.lang.SIM_card_number,parent.lang.belong_company,parent.lang.registration_time,parent.lang.enabled_status],
					name : ['cardNum','company','registrationTime','status'],
					type:[ttype,'',ttype,''],
					length:[20,,10,]
				}
			},{
				title :{display: parent.lang.other_information, pclass : 'clearfix',hide:false,tabshide:false},
				colgroup:{width:['150px','325px','150px','325px']},
				tabs:{
					display: [parent.lang.remark,''],
					name : ['remark',''],
					type:['textArea',''],
					length:[]
				}
			}
		]
	
	});
//	cleanSpelChar('input-cardNum');
	cleanChar('#input-cardNum');
	//加载用户信息
	ajaxLoadSIMInfo();
	
	$('.submit','#toolbar-btn').on('click',function(){
		if(!checkParam()) {
			return;
		}
		var data = {};
		if(type == 'edit') {
			data.id = $.trim($('.input-id').val());
		}
		//判断是否有空格
//		if(isCheckEmpty($('#input-cardNum').val())) {
//			$('#input-cardNum').focus();
//			alert(parent.lang.SIM_card_number + ":'" + $('#input-cardNum').val()+"'" + parent.lang.errValueContainSpace);
//			return;
//		}
		data.cardNum = $.trim($('.input-cardNum').val());
		data.registrationTime = dateStrLongTime2Date($('.input-registrationTime').val());
		data.status = $.trim($('#hidden-status').val());
		data.remark = $.trim($('#textArea-remark').val());
		var company = {};
		company.id = $.trim($('#hidden-company').val());
		if(company.id != null || company.id != '') {
			data.company =company;
		}
		var action = 'StandardSIMCardInfoAction_mergeSIMInfo.action';
		disableForm(true);
		$.myajax.showLoading(true, parent.lang.saving);
		$.myajax.jsonPost(action, data, false, function(json, success) {
			disableForm(false);
			$.myajax.showLoading(false);
			if (success) {
				W.doSaveSIMInfoSuc();
			}
		});
		
	});
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'siminfo'}).close();
	});
	$('.reset','#toolbar-btn').on('click',function(){
		var url = 'OperationManagement/SIMInfo.html?type='+type;
		if(type == 'edit') {
			url += '&id='+getUrlParameter('id');
		}
		$('.ui_dialog',parent.document).find('iframe').attr('src',url);
	});
}

function ajaxLoadSIMInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	if(type == 'add') {
		$.myajax.jsonGet('StandardCompanyAction_loadUserCompanys.action?type=0', function(json,action,success){
			if(success) {
				companys = json.infos;
				loadSIMInfo();
			};
		}, null);
	}else {
		var action = 'StandardSIMCardInfoAction_findSIMInfo.action?id='+getUrlParameter('id')+'&type='+type;
		$.myajax.jsonGetEx(action, function(json,action,success){
			if (success) {
				var sim =json.sim;
				if (!$.isEmptyObject(json.sim)) {
					if(sim.company.level == 2) {
						sim.company = getParentCompany(parent.vehiGroupList,sim.company.parentId);
					}
					if(type == 'edit') {
						companys = json.companys;	
					}
					loadSIMInfo(sim);
				}
			}
		});
	}
	$.myajax.showLoading(false);
	disableForm(false);
}

function loadSIMInfo(params) {
	var status = getStatus();
	if(type == 'add' || type == 'edit') {
		for(var i = 0; i < companys.length; i++) {
			if(companys[i].id == parent.companyId) {
				sid = companys[i].parentId;
			}
		}
		if(type == 'add' || (type == 'edit' && params.install != 1)) {
			addCompanyTree(companys,sid);
			$('.td-status').flexPanel({
				ComBoboxModel :{
					input : {name : 'status',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
					combox: 
						{name : 'status', option : arrayToStr(status)}
				}	
			});
		}
	
		$('.input-registrationTime').addClass('Wdate');
		$('.input-registrationTime').attr('name','registrationTime');
		$('.input-registrationTime').attr('id','registrationTime');
		$('.input-registrationTime').attr('readonly','readonly');
		$('.input-registrationTime').css('width','70%');
		if(type == 'add') {
			$(".input-registrationTime").val(dateCurDateBeginString());
			$(".input-registrationTime").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
		//	$('#combox-company').val(getArrayName(companys,parent.companyId));
		//	$('#hidden-company').val(parent.companyId);
			$('#combox-status').val(getArrayName(status,1));
			$('#hidden-status').val(1);
		}else {
			$('.input-cardNum').val(params.cardNum);
			$('.input-cardNum').get(0).disabled = true;
			$('.td-cardNum').append('<input class="input-id" type="hidden" name="id" value="'+params.id+'"/>');
			$('.input-registrationTime').val(dateFormat2TimeString(new Date(params.registrationTime)));
			$(".input-registrationTime").click(function(){WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'});});
			
			if(params.install == 1) {
				$('.td-status').prepend('<input id="combox-status" value="'+getArrayName(status,params.status)+'" disabled/> ');
				$('.td-status').append('<span style="color:red;">'+parent.lang.msg_SIM_install_tip+'</span>');
				$('.td-status').append('<input id="hidden-status" type="hidden" value="'+params.status+'"/>');
				$('.td-company').prepend('<input id="combox-company" value="'+params.company.name+'" disabled/> ');
				$('.td-company').append('<span style="color:red;">'+parent.lang.msg_SIM_install_tip+'</span>');
				$('.td-company').append('<input id="hidden-company" type="hidden" value="'+params.company.id+'"/>');
			}else {
				if(params.company != null) {
					$('#combox-company').val(params.company.name);	
					$('#hidden-company').val(params.company.id);
				}
				$('#combox-status').val(getArrayName(status,params.status));
				$('#hidden-status').val(params.status);
			}
			$('#textArea-remark').val(params.remark);
		}
	}else {
		$('.td-cardNum').text(params.cardNum);
		$('.td-registrationTime').text(dateFormat2TimeString(new Date(params.registrationTime)));
		$('.td-status').text(getArrayName(status,params.status));
		if(params.company != null) {
			$('.td-company').text(params.company.name);
		}
		$('#textArea-remark').val(params.remark);
		$('#textArea-remark').attr('readonly','readonly');
	}
}

function getStatus() {
	var status = [];
	status.push({id:'1',name: parent.lang.enabled});
	status.push({id:'0',name: parent.lang.not_enabled});
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

//function disableForm(flag){}