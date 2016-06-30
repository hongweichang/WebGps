$(document).ready(function(){
	setTimeout(loadUserLogPage, 50);
});

var searchOpt = new searchOption(false, true);
var userLists = [];

$(function() {
	$('.editable-select').editableSelect(
	{
		bg_iframe: true,
		onSelect: function(list_item) {
				
			},
		items_then_scroll: 10
		}
	);	
	//searchOpt.initDeviceQuery();
}); 

function loadUserLogPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadUserLogPage, 50);
	} else {
		//加载语言
		loadUserLogLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$("#btnQuery").click(queryUserLogDetail);
		$("#btnExport").click(exportUserLogDetail);
		//加载用户列表			
		$("#userList").append("<option value='"+0+"' selected>"+parent.lang.usermgr_log_allUser+"</option>");
		ajaxLoadUsers();
	}
}

function loadUserLogLang(){
	searchOpt.loadLang();
	$("#userLogTitle").text(parent.lang.usermgr_navUserLog);
	$("#labelSelectUser").text(parent.lang.usermgr_log_labelUser);
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.usermgr_log_user);
	$("#thDate").text(parent.lang.report_date);
	$("#thEvent").text(parent.lang.usermgr_log_event);
}

function disableForm(disable) {
	searchOpt.disableForm(disable);
	diableInput("#userList", disable, true);
}

function fillSelectUser(users) {
	if (users != null) {
		$.each(users, function (i, fn) {
			$("#userList").append("<option value='"+fn.id+"'>"+fn.userAccount.name+"</option>");
		});
	}
}

function ajaxLoadUsers() {
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("UserLogAction_allUser.action", function(json,action,success){
		if (success) {
			userLists = json.users;
			fillSelectUser(json.users, null);
		}
		$.myajax.showLoading(false);
		disableForm(false);
	}, null);
}

function queryUserLogDetail() {
	var query = searchOpt.getQueryTime(false);
	if (query === null) {
		return ;
	}
	
	disableForm(true);
	//清除之前加载的数据
	$.myajax.cleanTableContent("#userLogDetailTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var action = "UserLogAction_query.action?begintime=" + query.begindate + "&endtime=" + query.enddate
			 + "&mainType=1,3,9" + "&userId=" + $("#userList").val();
	var pagination={currentPage:1, pageRecords:10};
	$.myajax.jsonGetEx(action, doAjaxUserLog, pagination, null);
}

function doCheckQuery() {
	return true;
}

function doAjaxUserLog(json,action,success) {
	var empty = true;
	if (success) {
		if (!$.isEmptyObject(json.logs)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.logs, function (i, fn) {
				var row = $("#userLogTableTemplate").clone();
				row.find("#tdIndex").text(k);
				row.find("#tdName").text(fn.name);
				row.find("#tdDate").text(fn.logtime);
				row.find("#tdEvent").text(fn.content);
				append2Table("#userLogDetailTable", k, row);
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#userLogPagination");
		json.pagination.id = "#userLogPagination";
		json.pagination.tableId = "#userLogDetailTable";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxUserLog, null);
	}
	disableForm(false);
	$.myajax.showLoading(false);
}

function exportUserLogDetail() {
	var query = searchOpt.getQueryTime(false);
	if (query === null) {
		return ;
	}
	
	//向服务器发送ajax请求
	var action = "UserLogAction_detailExcel.action?begintime=" + query.begindate + "&endtime=" + query.enddate
			 + "&mainType=1" + "&userId=" + $("#userList").val();
	document.reportForm.action = action;
	document.reportForm.submit(); 
}