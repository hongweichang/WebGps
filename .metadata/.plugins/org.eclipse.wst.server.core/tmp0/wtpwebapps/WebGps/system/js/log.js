$(document).ready(function(){
	setTimeout(loadLogPage, 50);
}); 

function loadLogPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadLogPage, 50);
	} else {
		//加载语言
		loadLang();
	}
}

var logType = "sysuser";

function getLogType() {
	return logType;
}

function loadLang(){
	$("#logQueryTitle").text(parent.lang.log_queryTitle);
	$("#liSysUsrLog").text(parent.lang.log_querySysUsr);
	$("#liServerLog").text(parent.lang.log_queryServer);
	updateQueryLogType();
	//加载语言
	loadLogInfoLang();
	//设置查询时间
	$("#sysuserBegintime").val(dateCurDateBeginString());
	$("#sysuserEndtime").val(dateCurrentTimeString());
	$("#sysuserBegintime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}) });
	$("#sysuserEndtime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}) });
	$("#sysuserBtnQuery").click(queryLog);
	$("#serverBegintime").val(dateCurDateBeginString());
	$("#serverEndtime").val(dateCurrentTimeString());
	$("#serverBegintime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}) });
	$("#serverEndtime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd HH:mm:ss'}) });
	$("#serverBtnQuery").click(queryLog);
}

function resizeLogFrame(){
	parent.resizeFrame();
} 

function switchLogPage(page) {
	var allpages = ["sysuser","server"];
	var allnodes = document.getElementsByName('logMenuItem');
	for(var i=0; i<allpages.length; i++){
		if(page == allpages[i]){
			allnodes[i].className = "befor";
			logType = page;
			$("#" + allpages[i] + "LogDate").show();
			$("#" + allpages[i] + "Table").show();
			$("#" + allpages[i] + "Pagination").show();
		}else{
			allnodes[i].className = "";
			$("#" + allpages[i] + "LogDate").hide();
			$("#" + allpages[i] + "Table").hide();
			$("#" + allpages[i] + "Pagination").hide();
		}
	}
	updateQueryLogType();
	parent.resizeFrame();
}

function isQuerySysusrLog() {
	if (logType === "sysuser") {
		return true;
	} else {
		return false;
	}
}

function updateQueryLogType() {
	if (isQuerySysusrLog()) {
		$("#logQueryType").text(parent.lang.log_querySysUsr);
	} else {
		$("#logQueryType").text(parent.lang.log_queryServer);
	}
}