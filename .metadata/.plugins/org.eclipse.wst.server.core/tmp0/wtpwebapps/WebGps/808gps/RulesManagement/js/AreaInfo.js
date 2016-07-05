var api = frameElement.api, W = api.opener;
var markerId = null;
var markType = null;
var type = 'add';
var jingdu = null;
var weidu = null;
var param = null;
var DEF_MARK_TAB_TYPE = 'TabType';
var tabType = 7;
var tabShare = 0;
var locTypes = null;
var shareTypes = null;


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
	//获取传递过来的参数
	if(api.data) {
		markerId = api.data.markerId;
		markType = api.data.markType;
		jingdu = api.data.jingdu;
		weidu = api.data.weidu;
		param = api.data.param;
	}
    
	if(markerId && markerId != null) {
		type = 'edit';
	}
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel :  [[{
			display: parent.lang.save, name : '', pclass : 'submit',bgcolor : 'gray', hide : false
		}],[{
			display: parent.lang.close, name : '', pclass : 'close',bgcolor : 'gray', hide : false
		}]]
	});
	
	//点改为名称，其他区域名称
	var areaName = parent.lang.rule_areaName;
	if(markType == 1) {
		areaName = parent.lang.name;
	}
	
	$('#info-mid-table').flexPanel({
		TableGroupModel :
		[	{
				title :{display: parent.lang.required_information,pid : 'required-area',tip: '',hide:false,tabshide:false, headhide: true},
				colgroup:{width:['120px','250px']},
				tabs:{
					display: [areaName,parent.lang.mark_color,parent.lang.type,parent.lang.mark_share,
					          parent.lang.mark_longitude,parent.lang.mark_latitude,parent.lang.rule_radius,
					          parent.lang.rule_picture,parent.lang.report_log_desc],
					name : ['areaName','color','type','share','jingDu','weiDu','banJing','image','description'],
					type:['input','input','','','input','input','input',,'textArea'],
					length:[40,,,,11,11,10,,200]
				}
			}
		]
	});
	//特殊字符
	cleanSpelChar('.input-areaName');
	cleanSpelChar('.input-description');
	//只能输入数字
	enterDigital('.input-banJing');
	
	//地点类型
	this.getLocTypes();
	$('.td-type').flexPanel({
		ComBoboxModel :{
			input : {name : 'type',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			combox: 
				{name : 'type', option : arrayToStr(locTypes)}
		}	
	});
	//共享
	this.getShareTypes();
	$('.td-share').flexPanel({
		ComBoboxModel :{
			input : {name : 'share',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
			combox: 
				{name : 'share', option : arrayToStr(shareTypes)}
		}	
	});
	//选择颜色
	$("#input-color").attr('readonly','readonly');
	$('.td-color').append('<input id="hidden-color" type="hidden"/><span id="selectColor" class="select" style=\'margin-left:5px;color: #0068b7;cursor: pointer;\' title="'+parent.lang.select+'"></span>');
	$("#selectColor").bigColorpicker(function(el, color) {
		$('#bigLayout').click(function() {
			if(color) {
				$("#input-color").css("background-color", color);
				$('#hidden-color').val(color.replace('#', ''));
				editMarkChangeParam(color.replace('#', ''));
			}
		});
    });
	$("#input-color").bigColorpicker(function(el, color) {
		$('#bigLayout').click(function() {
			if(color) {
				$(el).css("background-color", color);
		        $('#hidden-color').val(color.replace('#', ''));
				editMarkChangeParam(color.replace('#', ''));
			}
		});
    });
	if(markType == 1) {//点不需要颜色，可在本页面修改经纬度
		$('.td-color').parent().hide();
	}else if(markType != 10) { //圆可在本页面修改经纬度
		//查看经纬度
		$('.td-jingDu').append('<span id="lookPoint" class="view" style=\'margin-left:5px;color: #0068b7;cursor: pointer;\' title="'+parent.lang.view+'"></span>');
		$('#lookPoint').on('click', viewPoint);
		
		$('#input-jingDu').get(0).disabled = true;
		$('#input-weiDu').get(0).disabled = true;
	}
	//上传图片
	var content_ = '<div class="fileitem" style="padding: 05px 10px;">';
	content_ += '<label class="lableImage" id="lableImage" for="uploadFile">'+ parent.lang.select_image;
	content_ += '<input type="file" style="width: 0;height:0;filter:alpha(opacity=0);opacity:0;position:absolute;left:-10000px;" onchange="previewImage(this,document.getElementById(\'picture\'))" class="uploadFile" name="uploadFile" id="uploadFile" accept="image/*"/>';
	content_ += '</label>'
	content_ += '</div>';
	content_ += '<div>';
	content_ += '<img id="picture" style="width:200px;height:100px;border: 1px solid #0071c6;display:none;"></img>';
	content_ += '</div>';
	content_ += '<div style="color:#ff0000;padding-top: 5px;"><span>'+ parent.lang.rule_image_size_error +'</span></div>';
	$('.td-image').append(content_);
	
	//加载区域信息
	if(type == 'edit') {
		this.ajaxLoadAreaInfo();
	}else {
		$("#input-color").css("background-color", '#FF0000');
		$('#hidden-color').val('FF0000');
		var markTabType = $.cookie(DEF_MARK_TAB_TYPE);
		if(markTabType != null){
			tabType = markTabType;
		}
		this.loadAreaInfo();
	}

	$('.submit','#toolbar-btn').on('click', saveMark);
	$('.close','#toolbar-btn').on('click',function(){
		W.$.dialog({id:'areaInfo'}).close();
	});
	if(typeof W.doEditMarkChangeParam == 'function') {
		$('#input-banJing').on('input propertychange', function() {
			var color = $.trim($('#hidden-color').val());
			editMarkChangeParam(color);
		});
	}
}

//修改颜色和半径，改变地图上标记
function editMarkChangeParam(color) {
	if(typeof W.doEditMarkChangeParam == 'function') {
		var marker = {};
		marker.id = markerId;
		marker.markerType = markType;
		marker.jingDu = jingdu;
		marker.weiDu = weidu;
		marker.radius = $.trim($('#input-banJing').val());
		marker.color = color;
		W.doEditMarkChangeParam(marker, type);
	}
}

//数据库后台获取区域信息
function ajaxLoadAreaInfo() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPostEx('StandardLoginAction_findArea.action', function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			$('#input-areaName').val(json.marker.name);
			if(json.marker.color) {
				$("#input-color").css("background-color", '#'+json.marker.color);
				$('#hidden-color').val(json.marker.color);
			}else {
				$("#input-color").css("background-color", '#FF0000');
				$('#hidden-color').val('FF0000');
			}
			if(json.marker.remark) {
				$('#textArea-description').val(json.marker.remark);
			}
			if(json.marker.image) {
				$('#picture').attr('src', '../../'+json.marker.image+'?'+new Date().getTime());
				$('#picture').show();
			}
			tabType = json.marker.type;
			tabShare = json.marker.share;
			jingdu = json.marker.jingDu;
			weidu = json.marker.weiDu;
			param = json.marker.radius;
			
			loadAreaInfo();
		}
	}, null, [{name: 'id',value: markerId}]);
}

//加载区域信息
function loadAreaInfo() {
	$('#combox-type').val(getArrayName(locTypes, tabType));
	$('#hidden-type').val(tabType);
	$('#combox-share').val(getArrayName(shareTypes, tabShare));
	$('#hidden-share').val(tabShare);
	
	if(markType != 10){
		$('.td-banJing').parent().hide();
		if(markType != 1){
			$('.td-jingDu').parent().find('th').text(parent.lang.track_qiDian);
			$('.td-weiDu').parent().find('th').text(parent.lang.track_zhongDian);
			var jingdus = jingdu.split(",");
			var weidus = weidu.split(",");
			$("#input-jingDu").val(jingdus[0]+','+weidus[0]);
			$("#input-weiDu").val(jingdus[jingdus.length-1]+','+weidus[weidus.length-1]);
		}else{
			//只能输入数字和点
			enterDigitalAndPoint('.input-jingDu');
			enterDigitalAndPoint('.input-weiDu');
			$("#input-jingDu").val(jingdu);
			$("#input-weiDu").val(weidu);
		}
	}else{
		//只能输入数字和点
		enterDigitalAndPoint('.input-jingDu');
		enterDigitalAndPoint('.input-weiDu');
		var banjings = param.toString().split(".");
		$("#input-banJing").val(banjings[0]);
		$('.td-banJing').append(parent.lang.mark_banJing);
		$("#input-jingDu").val(jingdu);
		$("#input-weiDu").val(weidu);
	}
}

//查看经纬度信息
function viewPoint(){
	$.dialog({id:'pointinfo', title:parent.lang.mark_vertex,content: 'url:RulesManagement/pointList.html',
		width:'400px',height:'600px', min:false, max:false, lock:true,parent: api});
}

//获取地点类型
function getLocTypes() {
	locTypes = [];
	locTypes.push({id:2,name:parent.lang.mark_type_village});
	locTypes.push({id:3,name:parent.lang.mark_type_factory});
	locTypes.push({id:4,name:parent.lang.mark_type_constructionSite});
	locTypes.push({id:5,name:parent.lang.mark_type_warehouse});
	locTypes.push({id:6,name:parent.lang.mark_type_pier});
	locTypes.push({id:7,name:parent.lang.mark_type_logisticsPark});
	locTypes.push({id:8,name:parent.lang.mark_type_toll});
	locTypes.push({id:9,name:parent.lang.mark_type_trackingPoint});
	locTypes.push({id:10,name:parent.lang.mark_type_workArea});
	locTypes.push({id:11,name:parent.lang.mark_type_regionalInspections});
	locTypes.push({id:12,name:parent.lang.mark_type_other});
}

//获取共享类型
function getShareTypes() {
	shareTypes = [];
	shareTypes.push({id:0,name:parent.lang.mark_not_share});
	shareTypes.push({id:1,name:parent.lang.mark_part_share});
	shareTypes.push({id:2,name:parent.lang.mark_all_share});
}

//保存区域信息
function saveMark() {
	//点改为名称，其他区域名称
	var areaName_null = parent.lang.rule_areaName_null;
	if(markType == 1) {
		areaName_null = parent.lang.not_be_empty;
	}
	var data = {};
	data.name = $.trim($('#input-areaName').val());
	if(!data.name){
		$.dialog.tips(areaName_null, 1);
		$('#input-areaName').focus();
		return;
	}
	
	if(type == 'edit') {
		data.id = markerId;
	}
	if(markType == 9){
		data.markerType = 4;
	}else{
		data.markerType = markType;
	}
	data.color = $.trim($('#hidden-color').val());
	if(markType == 1 || markType == 10) {
		data.jingDu = $.trim($('#input-jingDu').val());
		data.weiDu = $.trim($('#input-weiDu').val());
		if(!data.jingDu) {
			$.dialog.tips(parent.lang.rule_jingDuNotNull, 1);
			$('#input-jingDu').focus();
			return;
		}
		if(!data.weiDu) {
			$.dialog.tips(parent.lang.rule_weiDuNotNull, 1);
			$('#input-weiDu').focus();
			return;
		}
		if(parseFloat(data.jingDu) > 180 || parseFloat(data.jingDu) < -180) {
			$.dialog.tips(parent.lang.line_error_param, 1);
			$('#input-jingDu').focus();
			return;
		}
		if(parseFloat(data.weiDu) > 90 || parseFloat(data.weiDu) < -90) {
			$.dialog.tips(parent.lang.line_error_param, 1);
			$('#input-weiDu').focus();
			return;
		}
	}else {
		data.jingDu = jingdu;
		data.weiDu = weidu;
	}
	
	data.remark = $.trim($('#textArea-description').val());
	data.mapType = parent.getMapType();
	data.type = $.trim($('#hidden-type').val());
	data.share = $.trim($('#hidden-share').val());
	if(markType == 10){
		data.radius = $.trim($('#input-banJing').val());
		if(!data.radius || data.radius == 0) {
			$.dialog.tips(parent.lang.rule_radiusNotNull, 1);
			$('#input-banJing').focus();
			return;
		}
		
	}else{
		data.radius = 0;
	}
	var action = '';
	if(type == 'edit') {
		action = 'StandardLoginAction_editMark.action';
	}else {
		action = 'StandardLoginAction_addMark.action';
	}
	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$("#uploadForm").ajaxSubmit({
		url:action,
		type:"post",
		dataType:"JSON",
		data:{json : JSON.stringify(data)},
		cache:false,/*禁用浏览器缓存*/
		success: function(json){
			disableForm(false);
			$.myajax.showLoading(false);
			if(json.result == 0){
				$.cookie(DEF_MARK_TAB_TYPE, data.type, { expires: 365 });
				data.creator = parent.userId;
				data.userID = parent.companyId;
				data.areaId = 0;
				data.parentId = 0;
				data.areaType = 0;
				data.image = json.image;
				if(type == 'edit') {
					W.doEditMarkSuc(data);
				}else {
					data.id = json.markId;
					W.doSaveMarkSuc(data);
				}
			}else if (json.result == 2) {
				//直接跳转到登录界面
				top.window.location = "login.html";
			}else if (json.result == 41) {//大小
				alert(parent.lang.rule_image_size_error);
			}else if (json.result == 42) {//类型
				alert(parent.lang.rule_image_format_error);
			}else {
				showErrorMessage(json.result);
			}
		},error:function(data){
			disableForm(false);
			$.myajax.showLoading(false);
			showErrorMessage(1);
		}
	});
}

//图片显示
function previewImage(file, img) {
	//先怕判断文件类型
	if(!checkImgType(file)) {
		$(file).val("");
		$.dialog.tips(parent.lang.rule_image_format_error, 1);
        return;
	}
	//限制上传1M的图片
	if(!checkImgSize(file, 1)) {
		$(file).val("");
		$.dialog.tips(parent.lang.rule_image_size_error, 1);
		return;
	}
	if (file.files && file.files[0] ) {
		var reader = new FileReader();
		reader.onload = function(evt) {
			img.src=evt.target.result;
		}
		reader.readAsDataURL(file.files[0]);
		$('#picture').show();
	} else if(file.value){ // 兼容IE
//		img.src = "";
		file.select();
		file.blur();
//		var src = document.selection.createRange().text;
//		$(img).attr('src', file.value);
		img.src = file.value;
//		$('#picture').show();
	}
}