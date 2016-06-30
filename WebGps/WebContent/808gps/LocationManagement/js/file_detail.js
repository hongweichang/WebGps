var api = frameElement.api, W = api.opener;
var devIdno = getUrlParameter('devIdno');//设备号
var protocol = getUrlParameter('protocol');//协议类型
var factoryType = getUrlParameter('factoryType');//厂家类型
var fileType = getUrlParameter('fileType');//文件类型
var col = [];
$(document).ready(function(){
	setTimeout(loadAlarmDetailPage, 50);
});

var searchOpt = new searchOption(false, true);

function loadAlarmDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadAlarmDetailPage, 50);
	} else {
		$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
		$('#toolbar-btn1').flexPanel({
			ButtonsModel : [
				[{display: parent.lang.search, name : '', pclass : 'btnSearch',
					bgcolor : 'gray', hide : false}]
			]
		});
		$('.slinput').css('margin-top','10px');
		//加载语言
		loadAlarmDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		setCol();
		$("#alarmDetailTable").flexigrid({
			url: "StandardDeviceAction_getFileList.action?begintime="+dateWeekDateBeginString()+"&endtime="+dateCurDateEndString()+'&protocol='+protocol+'&factoryType='+factoryType+'&fileType='+fileType,
			dataType: 'json',
			colModel : col,
			pernumber: parent.lang.pernumber,
			pagestat: parent.lang.pagestatInfo,
			pagefrom: parent.lang.pagefrom,
			pagetext: parent.lang.page,
			pagetotal: parent.lang.pagetotal,
//					checkbox: true,
			findtext: parent.lang.find,
			procmsg: parent.lang.procmsg,
			nomsg : parent.lang.nomsg,
			usepager: true,
			autoload: true,
	//		title: parent.lang.report_custom_alarm_detail,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 'auto',
			onSuccess: function(){
				$('#uploadFile').get(0).disabled = false;	
				//保存事件
				$('.save','#toolbar-btn2').on('click',ajaxUploadFile);
				$(".btnSearch",'#toolbar-btn1').click(queryFileDetail);
				$('#select-version').on('keydown',function(e){
					if(e.keyCode == 13) {
						queryFileDetail();
					}
				});
			},
			onSubmit: false,
			height: 'auto' 
		});
		$('#toolbar-btn2').flexPanel({
			ButtonsModel : [
				[{display: parent.lang.upload, name : '', pclass : 'save',
					bgcolor : 'gray', hide : false}]
			]
		});
		setReportTableWidth(fixHeight);
		$('#begintime').val(dateWeekDateBeginString());
		$('#endtime').val(dateCurDateEndString());
	}
	$('#uploadFile').get(0).disabled = true;
	if(fileType == 1){
		$('#uploadFile').attr('accept','image/jpeg,image/png,image/bmp');
	}else{
		$('#uploadFile').attr('accept','*.*');
	}
}

function setCol(){
	col.push({display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'});
	col.push({display: parent.lang.operator, name : 'operator', width : 80, sortable : false, align: 'center'});
	col.push({display: parent.lang.alarm_file_name, name : 'fileName', width : 120, sortable : false, align: 'center'});
	if(fileType == 2){
		col.push({display: parent.lang.versionNumber, name : 'verNum', width : 120, sortable : false, align: 'center'});
		col.push({display: parent.lang.versionName, name : 'verName', width : 120, sortable : false, align: 'center'});
	}else{
		col.push({display: parent.lang.fileDescription, name : 'fileDesc', width : 120, sortable : false, align: 'center'});
	}
	col.push({display: parent.lang.filesUploaded, name : 'upDate', width : 120, sortable : false, align: 'center'});
}

function fixHeight() {
	$('#alarmDetailTable').flexFixHeight();
}

function setReportTableWidth(callBackFun) {
	var width = $(window).width();
	var height = $(window).height() - 120;
	if(getTop($('.flexigrid .bDiv').get(0)) == 0) {
		height = height - getTop($('.queryGraph').get(0)) - 30 - 24 - 10;
	}
	if(getTop($('.queryGraph-render').get(0)) == 0) {
		height = height - getTop($('.flexigrid .bDiv').get(0)) - $('.flexigrid .pDiv').height() - 10;
	}
	$('.flexigrid .bDiv').height(height);
	if (typeof callBackFun == "function") {
		callBackFun();
	}
	$('.queryGraph-render').width(width - 80);
	$('.queryGraph-render').height(height);
	$('.queryGraph-render .flotr-canvas').width(width - 80);
	$('.queryGraph-render .flotr-canvas').height(height);
	$('.queryGraph-render .flotr-overlay').width(width - 80);
	$('.queryGraph-render .flotr-overlay').height(height);
}

function loadAlarmDetailLang(){
	searchOpt.loadLang();
	if(fileType == 2){
		$('#labelhandled').text(parent.lang.website_download_version);
		$("#lableExcel").text(parent.lang.select_upgrade_file);
		$('#lableVersionNum').text(parent.lang.report_labelVersionNumber);
	}else{
		$('#labelhandled').text(parent.lang.vehicle_alarmaction_labelFileDesc);
		$("#lableExcel").text(parent.lang.select_upload_file);
		$('#lableVersionNum').text(parent.lang.vehicle_alarmaction_labelFileDesc);
	}
	//$("#save").text(parent.lang.upload);
}

function queryFileDetail() {
	var query = searchOpt.getQueryDataNew(false);
	if (query === null) {
		return ;
	}
	var params = [];
	params.push({
		name: 'json',
		value: encodeURIComponent(JSON.stringify(searchOpt.requireParam))
	});
	params.push({
		name: 'begintime',
		value: query.begindate
	});
	params.push({
		name: 'endtime',
		value: query.enddate
	});
	params.push({
		name: 'protocol',
		value: protocol
	});
	params.push({
		name: 'factoryType',
		value: factoryType
	});
	params.push({
		name: 'fileType',
		value: fileType
	});
	params.push({
		name: 'sp',
		value: $('#select-version').val()
	});
	$('#alarmDetailTable').flexOptions(
			{url: "StandardDeviceAction_getFileList.action",newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	var sp = row['sp'];
	var param = sp.split(',');
	if(name == 'operator'){
		pos += '<a class="select" href="javascript:selectFile('+row['id']+',\''+row['sp']+'\',\''+row['fn']+'\','+row['upl']+');" title="'+parent.lang.select+'"></a>';
	}else if(name == 'fileName'){
		pos += row['fn'];
	}else if( name == 'verNum'){
		pos += param[0];
	}else if(name == 'verName') {
		if(param[1] != null){
			pos += param[1];
		}else{
			pos = "";
		}
	}else if(name == 'upDate') {
		pos += dateTime2TimeString(row['upl']);
	}else if(name =='fileDesc'){
		pos += row['sp'];
	}
	return pos;
}

function selectFile(id,sp,fn,upl) {
	W.selectFile(id,sp,fn,upl);
}

function setVersionNum(){
	var fileName = $('#uploadFile').val();
	var start = fileName.lastIndexOf("\\");
	var end = fileName.lastIndexOf(".");
	$('#versionNum').val(fileName.substring(start+1, end));
}

function ajaxUploadFile(){
	var fileName = $('#uploadFile').val();
	if(fileName == null || fileName == ""){
		if(fileType == 2){	
			$.dialog.tips(parent.lang.upgrade_file_null, 1);
		}else{
			$.dialog.tips(parent.lang.upload_file_null, 1);
		}
		return;
	}
	if(fileType == 1){
		var format = fileName.substring(fileName.lastIndexOf(".")+1, fileName.length);
		if(format != 'jpg' && format != 'jpeg' && format != 'png' && format != 'bmp'){
			$.dialog.tips(parent.lang.photo_format, 1);
			return;
		}
	}
	if($('#versionNum').val() == null || $('#versionNum').val() == ""){
		if(fileType == 2){
			$.dialog.tips(parent.lang.version_num_file_null, 1);
		}else{
			$.dialog.tips(parent.lang.file_desc_null, 1);
		}
		return;
	}
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.uploading);
	$("#uploadForm").ajaxSubmit({
		url:'StandardDeviceAction_uploadFile.action?devIdno='+devIdno+'&protocol='+protocol+'&factoryType='+factoryType+'&param='+$('#versionNum').val()+'&fileType='+fileType,
		type:"post",
		dataType:"JSON",
		cache:false,/*禁用浏览器缓存*/
		resetForm: true,
		clearForm: true,
		success: function(json){
			disableForm(false);
			$.myajax.showLoading(false);
			if(json.result == 0){
				//刷新列表
				//$("#alarmDetailTable").flexReload();
				W.doUploadFileSuccess(json.ID);
			}else if (json.result == 2) {
				//直接跳转到登录界面
				top.window.location = "login.html";
			} else {
				if(json.result == 41) {
					if(fileType == 2){
						alert(parent.lang.file_errImageSize);
					}else{
						alert(parent.lang.photo_errImageSize);
					}
				}else {
					showErrorMessage(json.result);
				}
			}
		},error:function(data){
			disableForm(false);
			$.myajax.showLoading(false);
		}
	});
}