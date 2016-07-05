function loadLogInfoLang(){
	$("#sysuserLabelBegintime").text(parent.lang.labelBegintime);
	$("#sysuserLabelEndtime").text(parent.lang.labelEndtime);
	$("#sysuserBtnQuery").text(parent.lang.query);
	$("#tdSysuserIndex").text(parent.lang.index);
	$("#tdSysuserUserName").text(parent.lang.username);
	$("#tdSysuserContent").text(parent.lang.content);
	$("#tdSysuserTime").text(parent.lang.time);
	
	$("#serverLabelBegintime").text(parent.lang.labelBegintime);
	$("#serverLabelEndtime").text(parent.lang.labelEndtime);
	$("#serverBtnQuery").text(parent.lang.query);
	$("#tdServerIndex").text(parent.lang.index);
	$("#tdServerName").text(parent.lang.server);
	$("#tdServerContent").text(parent.lang.content);
	$("#tdServerTime").text(parent.lang.time);	
}

function checkQueryTime(begintime, endtime) {
	if (!dateIsValidDateTime(begintime)) {
		alert(parent.lang.errQueryTimeFormat);
		return false;
	}
	
	if (!dateIsValidDateTime(endtime)) {
		alert(parent.lang.errQueryTimeFormat);
		return false;
	}
	
	if (dateCompareStrLongTime(begintime, endtime) > 0) {
		alert(parent.lang.errQueryTimeRange);
		return false;
	}
	
	return true;	
}

function getLogTable() {
	return "#" + getLogType() + "Table";
}

var isQuering = false;
var loadDlg;
function queryLog() {
	//判断是否正在查询
	if (isQuering) {
		return;
	}
	var begintime = $("#" + getLogType() + "Begintime").val();
	var endtime = $("#" + getLogType() + "Endtime").val();
	//判断查询条件
	if (!checkQueryTime(begintime, endtime)) {
		return ;
	}
	isQuering = true;
	//清除之前加载的数据
	$.myajax.cleanTableContent(getLogTable());
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var pagination={currentPage:1, pageRecords:10};
	var action = "SysLogAction_querySysuser.action";
	if (!isQuerySysusrLog()) {
		action = "SysLogAction_queryServer.action";
	}
	$.myajax.jsonGet(action + "?begintime=" + begintime +"&endtime=" + endtime
		, doAjaxQueryLog, pagination);
}

//判断是否可以进行查询操作，防止多次查询
//isCheck为true表示进行检查
//为false，则应该配置查询标志位
function doCheckQuery(isCheck) {
	if (isCheck) {
		return !window.isQuering;
	} else {
		window.isQuering = true;
		return true;
	}
}

function doAjaxQueryLog(json,action,success) {
	isQuering = false;
	var empty = true;
	if (success) {
		if (json.log != null && !$.isEmptyObject(json.log)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.log, function (i, fn) {
				var row = $("#" + getLogType() + "TableTemplate").clone();
				row.find("#tdIndex").text(k);
				row.find("#tdUserName").text(fn.name);
				row.find("#tdContent").text(fn.content);
				row.find("#tdTime").text(fn.logtime);
				row.attr("id", "tableTop_" + Math.random());
				if ( (i % 2) == 1) {
					row.attr("class", "tabdata bluebg");
				}
				row.show();
				row.appendTo(getLogTable());
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#" + getLogType() + "Pagination");
		json.pagination.id = "#" + getLogType() + "Pagination";
		json.pagination.tableId = getLogTable();
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxQueryLog);
	}
	$.myajax.showLoading(false);
	resizeLogFrame();
}