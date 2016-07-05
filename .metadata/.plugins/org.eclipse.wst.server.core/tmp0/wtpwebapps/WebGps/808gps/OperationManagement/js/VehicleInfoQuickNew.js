var api = frameElement.api, W = api.opener;
var type = getUrlParameter('type');
var devIdno = getUrlParameter('devIdno');
var companys = [];
var users = [];
var sid = null;
var dev_id = null;
var maxCount = 1;
var indexArray = [];
var flag = true;
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
	if(type == 'add' || type == 'edit') {
		ttype = 'input';
	}
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip: '',hide:false,tabshide:false},
				colgroup:{width:['150px','340px']},
				tabs:{
					display: [parent.lang.device_number,parent.lang.plate_number,parent.lang.terminal_type,parent.lang.channel_parameters,parent.lang.vehicle_icons,
					          parent.lang.belong_company_group,parent.lang.user_belongs],
					name : ['device','vehiIDNO','terminal','chn','vehicleIcon','company','user'],
					type:[,ttype,,,,,,],
					length:[,15,,,2,,,]
				}
			}
		]
	
	});
	$('#required-area .panel-head').css('display','none');
	//加载车辆图片
	addVehicleImg();
	addTips('.td-vehiIDNO','*');
	if(!parent.myUserRole.isAdmin() && !parent.myUserRole.isAllowManage()) {
		$('#required-area .td-device').append('<input type="text" id="combox-device" style="width:225px;"/><input type="hidden" id="hidden-device" /><span class="span-tip" style="color:red;">*</span>');
	}else {
		$('#required-area .td-device').append('<input type="text" id="combox-device" onblur="changeVehiIDNO();" style="width:225px;"/><input type="hidden" id="hidden-device" /><span class="select" onclick="selectDevice();" title="'+parent.lang.select+'"></span><span class="span-tip" style="color:red;">*</span>');
	}
	$('#device-info .panel-body .integ_tab .integ_tbody').attr('id','dev_1');
	$('#device-info .panel-body .integ_tab .integ_tbody').attr('data-id','1');
	$('#device-info .panel-body .integ_tab .integ_tbody').addClass('dev_1');
	$('#device-info .panel-body .integ_tab .integ_tbody').attr('data-index','1');

	//加载车辆信息
	ajaxLoadVehicleInfo();

	$('.submit','#toolbar-btn').on('click',VehiSubmit);
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'vehicleinfo'}).close();
	});
	$('.reset','#toolbar-btn').on('click',function(){
		var url = 'OperationManagement/VehicleInfo.html?type='+type;
		if(type == 'edit') {
			url += '&id='+getUrlParameter('id');
		}
		$('.ui_dialog',parent.document).find('iframe').attr('src',url);
	});
	$('#required-area .td-terminal').flexPanel({
		ComBoboxModel :{
			input : {name : 'terminal',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			combox: 
				{name : 'terminal', option : arrayToStr(getType())}
		}	
	});
	$('#select-terminal .ui-menu-item').each(function(){
		$(this).attr('onclick',"changeCHN()");
	});
	$('.td-company').append('<span class="add" onclick="addCompanyInfo();" title="'+parent.lang.add+'"></span>');
	addTips('.td-company','*');
	$('.td-user').append('<a class="add" onclick="addUserInfo();" title="'+parent.lang.add+'"></a>');
	$('.td-terminal').append('<span class="span-tip red">*</span>')
	$('#required-area .td-user').flexPanel({
		ComBoboxModel :{
			input : {name : 'user',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: false},
			combox: 
				{name : 'user', option : arrayToStr(users), preicon: true, multiple: true, multipleTitle: parent.lang.determine}
		}	
	});
	$('#combox-terminal').val(getArrayName(getType(),2));
	$('#hidden-terminal').val(2);
	if(type == 'add') {
		var content = '<div class="dev-group">';
		content += '		<div class="dev-addType">';
		content += '			<input id="radio-single" class="radioDevice" name="radioDevice" type="radio" value="1" checked>';
		content += '			<label for="radio-single">'+parent.lang.single_add+'</label>';
		content += '			<input id="radio-batch" class="radioDevice" name="radioDevice" type="radio" value="2">';
		content += '			<label for="radio-batch">'+parent.lang.batch_add+'</label>';
		content += '		</div>';
		content += '		<div class="td-device">';
		content += '            <span>'+parent.lang.device_number+'</span>';
		content += '			<input name="devID" data-name="devIDNO" id="input-devIDNO" onblur="changeVehiIDNO();" class="dev-bgInput" width="40%" maxlength="20" style="width:185px;">';
		content += '            <span class="select" onclick="selectDevice();" style="margin: 2px 0 -2px 5px;" title="'+parent.lang.select+'"></span><span class="span-tip red devIDNOTip">*</span><span class="dev-item">'+parent.lang.msg_device_tip+'</span>';
		content += '		</div>';
		content += '		<div class="dev-bgInput dev-item">';
		content += '            <span>'+parent.lang.msg_device_bf_tip+'</span>';
		content += '			<input name="devIDbf" data-name="devIDNO" id="input-devIDNObf" class="dev-bgInput" maxlength="4" style="width:53px;">';
		content += '            <span class="span-tip red devIDbfTip">*</span><span>'+parent.lang.msg_device_mid_tip+'</span>';
		content += '			<input name="devIDbg" data-name="devIDNO" id="input-devIDNObg" class="dev-bgInput" maxlength="4" style="width:53px;">';
		content += '            <span class="span-tip red devIDbgTip">*</span><span>'+parent.lang.msg_device_bg_tip+'</span>';
		content += '		</div>';
		content += '    </div>';
		$('.td-device').empty();
		$('.td-device').append(content);
		$('.radioDevice').on('change',function(){
			var value = $("input[name='radioDevice']:checked").val();
			if(value == 1) {
				$('.td-device .select').show();
				$('.dev-group .dev-item').removeClass('show');
				$('.td-vehiIDNO').parent().show();
				$('#input-devIDNO').val('');
				$('#input-vehiIDNO').val('');
			}else {
				$('.td-device .select').hide();
				$('.dev-group .dev-item').addClass('show');
				$('.td-vehiIDNO').parent().hide();
				$('#input-devIDNO').val('');
				$('#input-vehiIDNO').val('');
			}
		});
		if(devIdno){
			$('#input-devIDNO').val(devIdno);
			$('#input-vehiIDNO').val(devIdno);
			$('.dev-addType').hide();
		}
	}
	cleanChar('#input-devIDNO');
}

function addTips(name,tips) {
	$(name).append('<span class="span-tip red">'+tips+'</span>');
}

function changeVehiIDNO(){
	$('#input-vehiIDNO').val($('#input-devIDNO').val());
}

function changeCHN(){
	if(flag && $('#hidden-terminal').val() == 1){
		flag = false;
		$('#required-area #combox-chnCount').val(0);
		$('#required-area #hidden-chnCount').val(0);
		addParamNames('chn',0,1);
	}
}

function addCompanyInfo(){
	$.dialog({id:'companyinfo', title:parent.lang.add +'&nbsp&nbsp&nbsp&nbsp'+parent.lang.company_information ,content: 'url:OperationManagement/CompanyInfo.html?type=add',
		width:'975px',height:'500px', min:false, max:false, lock:true, parent: api});
}

function addUserInfo(){
	var companyid = $('.td-company #hidden-company').val();
	var companyname = $('.td-company #combox-company').val();
	
	var company_ = getArrayInfo(companys, companyid);
	if(company_ != 1) {
		company_ = getArrayInfo(companys, company_.companyId);
		companyid = company_.id;
		companyname = company_.name;
	}
	if(companyid != null && companyid != '' && companyname != null && companyname != ''){
		$.dialog({id:'userinfo', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.user_information,content: 'url:OperationManagement/UserInfoNew.html?type=add&companyid='+companyid+'&companyname='+companyname+'&isVehicle=yes',
			width:'975px',height:'300px', min:false, max:false, lock:true, parent: api});
	}else{
		alert(parent.lang.user_company);
	}
}

function ajaxLoadVehicleInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	if(type == 'add') {
		$.myajax.jsonGet('StandardLoginAction_loadCompanyList.action', function(json,action,success){
			if(success) {
				if(json.companys != null && json.companys.length > 0) {
					for (var i = 0; i < json.companys.length; i++) {
						if(json.companys[i].level != 3) {
							companys.push(json.companys[i]);
						}
					}
				}
				loadVehicleInfo();
			};
		}, null);
	}
	$.myajax.showLoading(false);
	disableForm(false);
}

function getType(){
	var plateTypes = [];
	plateTypes.push({id:1,name: parent.lang.positioning_terminal});
	plateTypes.push({id:2,name: parent.lang.video_terminal});
	return plateTypes;
}

function loadVehicleInfo(params,relations) {
	if(relations && relations.length > 0) {
		for(var i = 0; i < relations.length; i++) {
			var k = i+1;
			$('#device-info .panel-body .integ_tab .input-relation-id').val(relations[i].id);
			if(type == 'edit') {
				if(relations[i].device != null) {
					$(' .td-device #combox-device').val(relations[i].device.devIDNO);
					$(' .td-device #hidden-device').val(relations[i].device.id);
				}
			}else {
				if(relations[i].device != null) {
					$(' .td-device').text(relations[i].device.devIDNO);
				}
			}
			indexArray.push(i+1);
			addVehicleParams('chn',params.chnCount,params.chnName,relations[i].chnAttr,i+1);
		}
	}else if(relations && relations.length == 0){
		if(type != 'edit') {
			$('.td-device').text('');
		}
		indexArray.push(1);
		addVehicleParams('chn',params.chnCount,params.chnName,null,1);
	}
	for(var i = 0; i < companys.length; i++) {
		if(companys[i].id == parent.companyId) {
			sid = companys[i].parentId;
		}
	}
	addCompanyTree(companys,sid);
	$('.td-company #combox-company').attr('placeholder',parent.lang.btnSelectCompanyOrGroup);
	indexArray.push(1);
	addVehicleParams('chn',null,null,null,1);
}
/**
 * 公司树双击事件
 */
function companyDblClickEvent() {
	var selId = companyTree.getSelectedItemId();
	if(selId != '*_0') {
		var id =selId.split('_')[1];
		$('#company_tree').hide();
		$('.td-company #combox-company').val(getArrayName(companys,id));
		$('.td-company #hidden-company').val(id);
		$('.td-company .span-tip').text('*');
		var cid = 0;
		for (var i = 0; i < companys.length; i++) {
			if(companys[i].id == id){
				if(companys[i].level == 1){
					cid = id;
				}else{
					cid = companys[i].companyId;
				}
				break;
			}
		}
		$.myajax.jsonGet('StandardVehicleAction_getUsers.action?companyid=' + cid, function(json,action,success){
			if(success) {
				users = json.users;
				$('.td-user').empty();
				$('#select-user').remove();
				$('#required-area .td-user').flexPanel({
					ComBoboxModel :{
						input : {name : 'user',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: false},
						combox: 
							{name : 'user', option : arrayToStr(getUsers(users)), preicon: true, multiple: true, multipleTitle: parent.lang.determine}
					}	
				});
				/*if(users.length > 0){
					$('.td-user #combox-user').val(users[0].name);
					$('.td-user #hidden-user').val(users[0].id);
				}*/
				$('.td-user').append('<a class="add" onclick="addUserInfo();" title="'+parent.lang.add+'"></a>');
			};
		}, null);
	}else {
		users = [];
		$('.td-company #combox-company').val('');
		$('.td-company #hidden-company').val('');
		$('#company_tree').hide();
		$('.td-user #combox-user').val('');
		$('.td-user #hidden-user').val('');
	}
}

function getUsers(users){
	var accounts = [];
	for(var i = 0; i < users.length; i++){
		accounts.push({id:users[i].id,name: users[i].account});
	}
	return accounts;
}

//获取车辆图标
function getVehicleImgCount(index) {
	var checked = '';
	if(index == 1) {
		checked = 'checked';
	}
	var ret = "";
	ret += '<div>';
	ret += '<input type="radio" name="iconType" class="input_none icon_'+ index +'" id="icon_'+ index +'" value="'+ index +'" '+ checked +'>';
	ret += '<label for="icon_'+ index +'"><img src="../images/vehicle/'+ index +'.png"></label>';
	ret += '</div>';
	return ret;
}

//添加车辆图标
function addVehicleImg() {
	var content = '';
	content += getVehicleImgCount(10);
	content += getVehicleImgCount(1);
	content += getVehicleImgCount(2);
	content += getVehicleImgCount(3);
	content += getVehicleImgCount(4);
	content += getVehicleImgCount(5);
	content += getVehicleImgCount(6);
	content += getVehicleImgCount(11);
	content += getVehicleImgCount(12);
	content += getVehicleImgCount(13);
	content += getVehicleImgCount(7);
	content += getVehicleImgCount(8);
	$('.td-vehicleIcon').prepend(content);
}

//添加通道参数
function addVehicleParams(name,vehiSum,vehiName,vehiAttr,index) {
	$('#required-area .td-'+name+'').flexPanel({
		ComBoboxModel :{
			input : {name : ''+name+'Count',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			combox: 
				{name : ''+name+'Count', option : arrayToStr(getCount(name))}
		}	
	});
	
	var str = '<div style="float:left;padding:4px 2px;">';
		str += '<span>'+parent.lang.number_of+'</span></div>';
	$('#required-area .td-'+name+'').prepend(str);
	
	if(type == '') {
		$('#required-area .td-'+name+' #combox-'+name+'Count').get(0).disabled = true;
		$('#select-'+name+'Count').remove();
	}
	var content = '<div class="'+name+'Name">';
	
	if(!vehiSum) {
		vehiSum = 0;
	}
	if(!vehiName) {
		vehiName = '';
		for(var i = 1; i <= 12; i++) {
			if(i != 1) {
				vehiName += ',';
			}
			if(name == 'chn') {
				vehiName += parent.lang.channel+i;
			}
		}
	}
	var vehiCount = 0;
	if(!vehiAttr) {
		vehiAttr = '';
		if(index == 1) {
			if(name == 'chn') {
				vehiCount = 4;
			}
			if(type == 'add') {
				for(var i = 1; i <= vehiCount; i++) {
					var j = (index-1)*vehiCount+i;
					if(i != 1) {
						vehiAttr += ',';
					}
					vehiAttr += j;
				}
			}
		}
	}
	var vehiNames = vehiName.split(',');
	var vehiAttrs = vehiAttr.split(',');
	if(vehiAttr == '') {
		vehiCount = 0;
	}else {
		vehiCount = vehiAttrs.length;
	}
	$('#required-area #combox-'+name+'Count').val(vehiCount);
	$('#required-area #hidden-'+name+'Count').val(vehiCount);
	var disabled = '';
	if(type == '') {
		disabled = 'disabled';
	}
	for(var i = 0; i < vehiCount; i++) {
		var count = vehiAttrs[i];
		if(vehiNames) {
			content += '<div class="peripheral"><input type="text" data="'+vehiNames[count-1]+'" value="'+vehiNames[count-1]+'" '+disabled+'></div>';
		}
	}
	content += '</div>';
	$('#required-area .td-'+name+'').append(content);
	$('#select-'+name+'Count .ui-menu-item').each(function(){
		$(this).attr('onclick',"addParamNames('"+name+"',"+$(this).attr('data-index')+","+index+")");
	});
	if(isBrowseIE7()) {
		$('#select-'+name+'Count .ui-menu-item').each(function(){
			$(this).on('click',function() {
				addParamNames(name,$(this).attr('data-index'),index);
			});
		});
	}
	if((name == 'chn') && indexArray.length > 1 && type != '') {
		if($('#combox-'+name+'Count'+indexArray[0]).val() != 0) {
			$('#combox-'+name+'Count'+indexArray[1]).get(0).disabled = true;
			$('#combox-'+name+'Count'+indexArray[1]).parent().attr('title',parent.lang.notSelChnInTwoDev);
		}
		if($('#combox-'+name+'Count'+indexArray[1]).val() != 0) {
			$('#combox-'+name+'Count'+indexArray[0]).get(0).disabled = true;
			$('#combox-'+name+'Count'+indexArray[0]).parent().attr('title',parent.lang.notSelChnInTwoDev);
		}
	}
}

//添加通道
function addParamNames(name,count,index) {
	$('#required-area .'+name+'Name').empty();
	flag = false;
	var content = '';
	var disabled = '';
	if(type == '') {
		disabled = 'disabled';
	}
	for(var i = 1; i <= count; i++) {
		if(name == 'chn') {
			content += '<div class="peripheral"><input type="text" data="'+parent.lang.channel+i+'" value="'+parent.lang.channel+i+'" '+disabled+'></div>';
		}
	}
	$('#required-area .td-'+name+' .'+name+'Name').append(content);

	//通道参数和温度传感器参数只能有一个存在
	if((name == 'chn') && indexArray.length > 1 && type != '') {
		if(count == 0) {
			$('#combox-'+name+'Count'+indexArray[0]).get(0).disabled = false;
			$('#combox-'+name+'Count'+indexArray[1]).get(0).disabled = false;
			$('#combox-'+name+'Count'+indexArray[0]).parent().removeAttr('title');
			$('#combox-'+name+'Count'+indexArray[1]).parent().removeAttr('title');
		}else {
			for(var i = 0; i < indexArray.length; i++) {
				if(indexArray[i] != index) {
					$('#combox-'+name+'Count'+indexArray[i]).get(0).disabled = true;
					$('#combox-'+name+'Count'+indexArray[i]).parent().attr('title',parent.lang.notSelChnInTwoDev);
				}
			}
		}
	}
}

//通道数目
function getCount(name) {
	var count = [];
	count.push({id:0,name:'0'});
	count.push({id:1,name:'1'});
	count.push({id:2,name:'2'});
	count.push({id:3,name:'3'});
	count.push({id:4,name:'4'});
	count.push({id:5,name:'5'});
	count.push({id:6,name:'6'});
	count.push({id:7,name:'7'});
	count.push({id:8,name:'8'});
	count.push({id:9,name:'9'});
	count.push({id:10,name:'10'});
	count.push({id:11,name:'11'});
	count.push({id:12,name:'12'});
	return count;
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
		if(($(this).val() == null || $(this).val() == '') && (name == 'vehiIDNO' || name == 'company')){
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
	if($('#input-devIDNO').val() == null || $('#input-devIDNO').val() == ''){
		$('.td-device').find('.span-tip').text(parent.lang.not_be_empty);
		$('.td-device').find('.span-tip').addClass('show');
		flag = false;
	}else{
		$('.td-device').find('.span-tip').text('*');
	}
	if($('#combox-terminal').val() == null || $('#combox-terminal').val() == ''){
		$('.td-terminal').find('.span-tip').text(parent.lang.not_be_empty);
		$('.td-terminal').find('.span-tip').addClass('show');
		flag = false;
	}else{
		$('.td-terminal').find('.span-tip').text('*');
	}
	return flag;
}

function VehiSubmit(){
	if(!checkVehiParam()) {
		return;
	}
	var data = {};
	//判断是否有空格
	if(isCheckEmpty($('.input-vehiIDNO').val())) {
		$('.input-vehiIDNO').focus();
		alert(parent.lang.plate_number + ":'" + $('.input-vehiIDNO').val()+"'" + parent.lang.errValueContainSpace);
		return;
	}
	if($('.input-vehiIDNO').val() != '' && $('.input-vehiIDNO').val() != null){
		data.vehiIDNO = $.trim($('.input-vehiIDNO').val());
	}
	var company = {};
	company.id = $.trim($('#hidden-company').val());
	if(company.id != null && company.id != '') {
		data.company = company;
	}
	data.icon = $.trim($("input[name='iconType']:checked").val());
	
	var relations = [];
	var chnCount = 0;
	var chnNames = [];
	var flag = true;
	var relation = {};
	var device = {};
	if(!flag) {
		return;
	}
	if(flag) {
		//判断是否有空格
//		if(isCheckEmpty($('#input-devIDNO').val())) {
//			$('#input-devIDNO').focus();
//			alert(parent.lang.device_number + ":'" + $('#input-devIDNO').val()+"'" + parent.lang.errValueContainSpace);
//			return;
//		}
		device.devIDNO = $.trim($('#input-devIDNO').val());
		var value = $.trim($("input[name='radioDevice']:checked").val());
		if(value == 2) {
			device.idnobf = $.trim($('#input-devIDNObf').val());
			device.idnobg = $.trim($('#input-devIDNObg').val());
			if(device.idnobf == null || device.idnobf == '') {
				$('.td-device .devIDbfTip').text(parent.lang.not_be_empty);
				if(flag) {
					$('#required-area .panel-body').addClass('show');
					$('.td-device #input-devIDNObf').focus();
					flag = false;
				}
			}else {
				$('.td-device .devIDbfTip').text('*');
			}
			if(device.idnobg == null || device.idnobg == '') {
				$('.td-device .devIDbgTip').text(parent.lang.not_be_empty);
				if(flag) {
					$('#required-area .panel-body').addClass('show');
					$('.td-device #input-devIDNObg').focus();
					flag = false;
				}
			}else {
				$('.td-device .devIDbgTip').text('*');
			}
			if(Number(device.idnobg) - Number(device.idnobf) + 1 > 200){
				alert(parent.lang.device_num_limit);
				flag = false;
			}
		}
		if($.trim($('#hidden-terminal').val()) == 1){
			device.devType = 5;
		}else{
			device.devType = 7;
		}
		if(device.devIDNO != null && device.devIDNO != '') {
			relation.device = device;
		}else {
			flag = false;
			$('#combox-device').focus();
			alert(parent.lang.device+parent.lang.not_be_empty);
			return;
		}
	}
	if(!flag) {
		return;
	}
	//通道参数
	var chnAttr = [];
	$('.td-chn .chnName input').each(function(chnIndex) {
		if(flag) {
			if($.trim($(this).val()) == '') {
				flag = false;
				$(this).focus();
				alert($(this).attr('data')+' '+parent.lang.not_be_empty);
				return;
			}else {
				chnNames.push($(this).val());
				chnAttr.push(chnIndex+chnCount+1);
			}
		}
	});
	if(!flag) {
		return;
	}
	chnCount = chnCount + parseIntDecimal($('#hidden-chnCount').val());
	relation.chnAttr = chnAttr.toString();
		
	//外设模块
	var module = {};
	var str = '';
	if($('#hidden-terminal').val() == 1){
		str = '000000101000';
	}else if($('#hidden-terminal').val() == 2){
		str = '000101101001';
	}
	relation.module = parseInt(str,2);
	relations.push(relation);
	if(!flag) {
		return;
	}
	
	if(chnCount > 12) {
		alert(parent.lang.chnCountGreaterThan);
		return;
	}
	
	data.chnCount = chnCount;
	data.chnName = chnNames.toString();
	data.relations = relations;
	
	var action = 'StandardVehicleAction_quickNewVehicle.action';
	if($('#hidden-user').val() != null){
		action += '?userid='+ $.trim($('#hidden-user').val());
	}
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost( action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.doSaveVehicleSuc();
		}
	});
}

function selectDevice() {
	var name = $('#input-devIDNO').val();
	$.dialog({id:'info', title:parent.lang.select+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.device_information,content: 'url:OperationManagement/SelectInfo.html?type=device&name='+name+'&singleSelect=true',
		width:'800px',height:'530px', min:false, max:false, lock:true, parent: api});
}

function doSelectDevice(index, id, name,simId,simNum) {
	$('#input-devIDNO').val(name);
	$('#input-vehiIDNO').val(name);
	$.dialog({id:'info'}).close();
}

function doSaveCompanySuc(data){
	parent.isChangedVehiGroup = true;
	$.dialog({id:'companyinfo'}).close();
	$.myajax.jsonGet('StandardCompanyAction_loadUserCompanys.action?type=0', function(json,action,success){
		if(success) {
			companys = json.infos;
			$('.td-company .btn-group').remove();
			$('#company_tree').remove();
			$('body').append('<div id="company_tree" style="height:100px;background-color:#f5f5f5;border:1px solid Silver;overflow:auto;position: absolute;display:none;background-color: #fff;border: 1px solid rgba(0, 0, 0, 0.1);box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);"></div>');
			companyTree = null;
			$('body').unbind('click');
			for(var i = 0; i < companys.length; i++) {
				if(companys[i].id == parent.companyId) {
					sid = companys[i].parentId;
				}
			}
			addCompanyTree(companys,sid);
			$('.td-company #combox-company').attr('placeholder',parent.lang.btnSelectCompanyOrGroup);
			for(var i = 0; i < companys.length; i++) {
				if(companys[i].name == data.name) {
//					companyTree.insertGroupItem(companyTree.getTreeGroupId(companys[i].parentId),companys[i]);
					$('.td-company #combox-company').val(data.name);
					$('.td-company #hidden-company').val(companys[i].id);
					$('.td-company .span-tip').text('*');
					$.myajax.jsonGet('StandardVehicleAction_getUsers.action?companyid=' + companys[i].id, function(json,action,success){
						if(success) {
							users = json.users;
							$('.td-user').empty();
							$('#select-user').remove();
							$('#required-area .td-user').flexPanel({
								ComBoboxModel :{
									input : {name : 'user',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: false},
									combox: 
										{name : 'user', option : arrayToStr(getUsers(users)), preicon: true, multiple: true, multipleTitle: parent.lang.determine}
								}	
							});
							if(users.length > 0){
								$('.td-user #combox-user').val(users[0].name);
								$('.td-user #hidden-user').val(users[0].id);
							}
							$('.td-user').append('<a class="add" onclick="addUserInfo();" title="'+parent.lang.add+'"></a>');
						};
					}, null);
				}
			}
		};
	}, null);
	
}

function doSaveUserInfoSuc(data) {
	$.dialog({id:'userinfo'}).close();
	var id = $('.td-company #hidden-company').val();
	var cid = 0;
	for (var i = 0; i < companys.length; i++) {
		if(companys[i].id == id){
			if(companys[i].level == 1){
				cid = id;
			}else{
				cid = companys[i].companyId;
			}
			break;
		}
	}
	$.myajax.jsonGet('StandardVehicleAction_getUsers.action?companyid=' + cid, function(json,action,success){
		if(success) {
			users = json.users;
			$('.td-user').empty();
			$('#select-user').remove();
			$('#required-area .td-user').flexPanel({
				ComBoboxModel :{
					input : {name : 'user',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: false},
					combox: 
						{name : 'user', option : arrayToStr(getUsers(users)), preicon: true, multiple: true, multipleTitle: parent.lang.determine}
				}	
			});
			for(var i = 0; i < users.length; i++) {
				if(users[i].name == data.name){
					$('.td-user #combox-user').val(data.name);
					$('.td-user #hidden-user').val(users[i].id);
					$('#select-user .ui-menu-item').each(function() {
						if($(this).attr('data-index') == users[i].id) {
							$(this).click();
							return;
						}
					});
				}
			}
			$('.td-user').append('<a class="add" onclick="addUserInfo();" title="'+parent.lang.add+'"></a>');
		};
	}, null);
}

function addDevice(index) {
	var companyId = $('#hidden-company').val();
	$.dialog({id:'info', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.device_information,content: 'url:OperationManagement/AddInfo.html?type=device&index='+index+'&companyId='+companyId,
		width:'410px',height:'200px', min:false, max:false, lock:true, parent: api});
}

function doExit() {
	$.dialog({id:'info'}).close();
}