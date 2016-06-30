$(document).ready(function(){
	setTimeout(loadAlarmDetailPage, 50);
});

var searchOpt = new searchOption(false, true);

function loadAlarmDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadAlarmDetailPage, 50);
	} else {
		buttonQueryOrExport();
		$('#selectName').flexPanel({
			InputModel : {display: parent.lang.selectUserTip,value:'',name : 'userId', pid : 'userId', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
		});
		
		$('#selecttime').flexPanel({
			ComBoboxModel :{
				input : {name : 'selecttime',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'selecttime', option : arrayToStr(getSelectTime(1))}
			}	
		});
		
		$('#select-selecttime li').each(function() {
			var index= $(this).attr('data-index');
			$(this).on('click',function() {
				selectTime(index, 1);
			});
			if(index == 0) {
				$(this).click();
			}
		});
		
		//加载语言
		loadAlarmDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$('#combox-userId').on('click keyup',selUserList);
		$(".btnQuery").click(queryAlarmDetail);
		$(".btnExport").click(exportAlarmDetail);
		$(".btnExportCSV").click(exportAlarmDetailCSV);
		$(".btnExportPDF").click(exportAlarmDetailPDF);
		var width = 0;
		if(parent.screenWidth >= 1360) {
			width = 'auto';
		}else {
			width = 1060;
			$('#sysuserLogDate').css('width','1100px');
		}
		$("#userLogTable").flexigrid({
			url: "StandardReportUserOnlineAction_detail.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.login_account, name : 'account', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.person_name, name : 'name', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.belong_company, name : 'company', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.user_login_information, name : 'loginTypeStr', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_beginTime, name : 'beginTime', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_endTime, name : 'endTime', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.report_time, name : 'times', width : 120, sortable : false, align: 'center'}
				],
			pernumber: parent.lang.pernumber,
			pagestat: parent.lang.pagestatInfo,
			pagefrom: parent.lang.pagefrom,
			pagetext: parent.lang.page,
			pagetotal: parent.lang.pagetotal,
			findtext: parent.lang.find,
			procmsg: parent.lang.procmsg,
			nomsg : parent.lang.nomsg,
			usepager: true,
			autoload: false,
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: width,
			onSubmit: false,
			height: 'auto'
		});
		loadReportTableWidth(fixHeight);
	}
}

function fixHeight() {
	$('#userLogTable').flexFixHeight();
}

function loadAlarmDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_userOnline_detail);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryAlarmDetail() {
	var query = searchOpt.getQueryDataNew(false);
	if (query === null) {
		return ;
	}
	if($('#hidden-userId').val() == null || $('#hidden-userId').val() == '') {
		alert(parent.lang.report_selectUserNullErr);
		return;
	}
	var params = [];
	params.push({
		name: 'userId',
		value: $('#hidden-userId').val()
	});
	params.push({
		name: 'begintime',
		value: query.begindate
	});
	params.push({
		name: 'endtime',
		value: query.enddate
	});
	$('#userLogTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'beginTime'){
		pos = dateTime2TimeString(row[name]);
	}else if( name == 'endTime'){
		if(row[name] == null || row[name] == ""){
			pos = dateTime2TimeString(row['beginTime']);
		}else{
			pos = dateTime2TimeString(row[name]);
		}
	}else if(name == 'times') {
		pos = second2ShortHourEx(row[name]);
	}else{
		pos = changeNull(row[name]);
	}
	return pos;
}

function exportReport(exportType) {
	var query = searchOpt.getQueryDataNew(false);
	if (query === null) {
		return ;
	}
	if($('#hidden-userId').val() == null || $('#hidden-userId').val() == '') {
		alert(parent.lang.report_selectUserNullErr);
		return;
	}
	document.reportForm.action = "StandardReportUserOnlineAction_detailExcel.action?exportType="+exportType+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val();
	document.reportForm.submit(); 
}
//导出至excel，导出至csv，导出至pdf
function exportAlarmDetail() {
	exportReport(1);
}

function exportAlarmDetailCSV() {
	exportReport(2);
}

function exportAlarmDetailPDF() {
	exportReport(3);
}

var selIds;
//选择车辆
function selUserList() {
	$.dialog({id:'info', title:parent.lang.selectUserTitle,content: 'url:StatisticalReports/selectInfo.html?type=selUser&singleSelect=true&selectAll=true',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}

function doSelectUser(ids,userList) {
	if(ids != null && ids == '0') {
		$('#combox-userId').val(parent.lang.all_users);
		$('#hidden-userId').val(ids);
	}else {
		selIds = ids;
		$('#combox-userId').val(userList);
		$('#hidden-userId').val(ids);
	}
	$.dialog({id:'info'}).close();
}

function doExit() {
	$.dialog({id:'info'}).close();
}