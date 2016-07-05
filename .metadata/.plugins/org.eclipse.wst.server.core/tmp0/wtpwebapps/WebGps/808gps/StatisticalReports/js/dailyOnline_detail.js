$(document).ready(function(){
	setTimeout(loadDailyOnlineDetailPage, 50);
});

var searchOpt = new searchOption();

function loadDailyOnlineDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadDailyOnlineDetailPage, 50);
	} else {
		buttonQueryOrExport();
		$('#selectName').flexPanel({
			InputModel : {display: parent.lang.selectCompanyTip,value:'',name : 'vehiIdnos', pid : 'vehiIdnos', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
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
		loadDailyOnlineDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		/*$("#begintime").val(dateCurrentDateString());
		$("#endtime").val(dateCurrentDateString());*/
		$('#combox-vehiIdnos').on('click keyup',selCompany);
		$(".btnQuery").click(queryDailyOnlineDetail);
		$(".btnExport").click(exportDailyOnlineDetail);
		$(".btnExportCSV").click(exportDailyOnlineDetailCSV);
		$(".btnExportPDF").click(exportDailyOnlineDetailPDF);
		var width = 0;
		if(parent.screenWidth >= 1360) {
			width = 'auto';
		}else {
			width = 1060;
			$('#sysuserLogDate').css('width','1100px');
		}
		$("#dailyOnlineDetailTable").flexigrid({
			url: "StandardReportOnlineAction_dailyOnline.action",
			dataType: 'json',
			colModel : [
					{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
					{display: parent.lang.company_name, name : 'name', width : 150, sortable : false, align: 'center'},
					{display: parent.lang.report_date, name : 'beginTime', width : 120, sortable : false, align: 'center', hide: false},
					{display: parent.lang.report_login_rate, name : 'loginRate', width : 100, sortable : false, align: 'center'}
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
	$('#dailyOnlineDetailTable').flexFixHeight();
}

function loadDailyOnlineDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_company_dailyonline_detail);
}

//function disableForm(disable) {
//	searchOpt.disableForm(disable);
//}

function queryDailyOnlineDetail() {
	var query = searchOpt.getQueryDataNew(false);
	if (query === null) {
		return ;
	}
	if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
		alert(parent.lang.report_selectCompanyNullErr);
		return;
	}
	searchOpt.requireParam.vehiIdnos = $('#hidden-vehiIdnos').val();
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
		name: 'type',
		value: 'dailyOnline'
	});
	$('#dailyOnlineDetailTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	//if(name == 'beginTime') {
	//	alert(row[name]);
	//	pos = dateTime2TimeString(row[name]);
//	}else 
	if(name == 'loginRate'){
		var rate = (row[name] * 100 ) ;
		pos = rate.toFixed(2) + "%";
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function exportReport(exportType) {
	var query = searchOpt.getQueryDataNew(false);
	if (query === null) {
		return ;
	}
	if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
		alert(parent.lang.report_selectCompanyNullErr);
		return;
	}
	document.reportForm.action = "StandardReportOnlineAction_summaryExcel.action?type=dailyOnline&exportType="+exportType+"&begintime="+$('#begintime').val()+"&endtime="+$('#endtime').val();
	document.reportForm.submit(); 
}
//导出至excel，导出至csv，导出至pdf
function exportDailyOnlineDetail() {
	exportReport(1);
}

function exportDailyOnlineDetailCSV() {
	exportReport(2);
}

function exportDailyOnlineDetailPDF() {
	exportReport(3);
}

var selIds;
//选择公司
function selCompany() {
	$.dialog({id:'info', title:parent.lang.selectCompanyTitle,content: 'url:StatisticalReports/selectInfo.html?type=selCompany&singleSelect=false&selectAll=true',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}

function doSelectCompany(ids,companyList) {
	if(ids != null && ids == '0') {
		$('#combox-vehiIdnos').val(parent.lang.all_companies);
		$('#hidden-vehiIdnos').val(getNewArrayByArray(parent.companys,'id').toString());
	}else {
		selIds = ids;
		if(ids != null && ids.split(',').length > 0) {
			if(ids.split(',').length > 1) {
				$('#combox-vehiIdnos').val(parent.lang.isSelected + ids.split(',').length);
			}else {
				$('#combox-vehiIdnos').val(companyList);
			}
		}
		$('#hidden-vehiIdnos').val(ids);
	}
	$.dialog({id:'info'}).close();
}

function doExit() {
	$.dialog({id:'info'}).close();
}