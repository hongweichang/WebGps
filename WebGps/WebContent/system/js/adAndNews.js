$(document).ready(function(){
	setTimeout(loadAdPage, 50);
}); 

function loadAdPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadAdPage, 50);
	} else {
		//加载语言
		loadLang();
		var page = getUrlParameter("type");
		if (typeof page == "undefined" || page === null ||  page === "") {
			page = "ad";
		}
		
		$("#adTable").flexigrid({
			url: "SysAdAndNewsAction_list.action",
			dataType: 'json',
			colModel : [
				{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
				{display: parent.lang.IDNO, name : 'id', width : 100, sortable : false, align: 'center'},
				{display: parent.lang.adAndNews_nameTitle, name : 'title', width : 200, sortable : false, align: 'center'},
				{display: parent.lang.adAndNews_releaseDate, name : 'atimeStr', width : 120, sortable : false, align: 'center', hide: false},
				{display: parent.lang.adAndNews_validity, name : 'endTimeStr', width : 120, sortable : false, align: 'center'},
				{display: parent.lang.operator, name : 'operator', width : 200, sortable : false, align: 'center'}
				],
			searchitems : [
				{display: parent.lang.IDNO, name : 'id', isdefault: true},
				{display: parent.lang.adAndNews_nameTitle, name : 'title'}
				],
			sortname: "atime",
			sortorder: "desc",
			checkbox: true,
			idProperty: "id",
			pernumber: parent.lang.pernumber,
			pagestat: parent.lang.pagestatInfo,
			pagefrom: parent.lang.pagefrom,
			pagetext: parent.lang.page,
			pagetotal: parent.lang.pagetotal,
//				checkbox: true,
			findtext: parent.lang.find,
			procmsg: parent.lang.procmsg,
			nomsg : parent.lang.nomsg,
			usepager: true,
			autoload: false,
			title: parent.lang.adAndNews_title,
			useRp: true,
			rp: 15,
			showTableToggleBtn: false,
			width: 1143,
			onSubmit: false,//addFormData,
			height: 400,
//			showToggleBtn: false,
			minwidth: 30, //min width of columns//列的最小宽度
			minheight: 24 //min height of columns//列的最小高度
		});
		
		switchAdAndNewsPage(page, decodeURIComponent(getUrlParameter("name")));
	}
}
var adType = "ad";

function getAdType() {
	adType = $.trim($("#adType").html());
	if(adType == parent.lang.adAndNews_ad){
		return "ad";
	}else{
		return "news";
	}
}

function loadLang(){
	$("#adAndNewsTitle").text(parent.lang.adAndNews_title);
	$("#liAd").text(parent.lang.adAndNews_ad);
	$("#liNews").text(parent.lang.adAndNews_news);
	$("#addAdOrNews").text(parent.lang.add);
	$("#delSelAdOrNews").text(parent.lang.adAndNews_delSelAdOrNews);
	$("#thSelectAll").text(parent.lang.selectAll);
	$("#thIndex").text(parent.lang.index);
	$("#thIDNO").text(parent.lang.IDNO);
	$("#thName").text(parent.lang.adAndNews_nameTitle);
//	$("#thContent").text(parent.lang.content);
	$("#thReleaseDate").text(parent.lang.adAndNews_releaseDate);
	$("#thValidity").text(parent.lang.adAndNews_validity);
	$("#thOperator").text(parent.lang.operator);
	updateAdType();
}

function switchAdAndNewsPage(page, name){
	adType = getAdType();
	switchAdPage(page);
	updateAdType();
	var params = [];
	params.push({
		name: 'type',
		value: 1
	});
	params.push({
		name: 'adType',
		value: adType
	});
	params.push({
		name: 'name',
		value: name
	});
	$('#adTable').flexOptions(
			{newp: 1, query: '', qtype: '', params: params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'id') {
		pos = "<a href=\"javascript:editAdOrNewsInfo('" + row[name] + "');\">" + row[name] + "</a>";
	}else if(name == 'title') {
		pos = "<a href=\"javascript:editAdOrNewsInfo('" + row['id'] + "');\">" + row[name] + "</a>";
	}else if(name == 'operator') {
		pos = "<a href=\"javascript:editAdOrNewsInfo('" + row['id'] + "');\">" + parent.lang.edit + "</a> "
		+ "<a href=\"javascript:delAdOrNewsInfo('" + row['id'] + "');\">" + parent.lang.del + "</a>";
	}else if(name == 'atime' || name == 'endTime') {
		pos = dateTime2DateString(row[name]);
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function switchAdPage(page) {
	var allpages = ["ad","news"];
	var allnodes = document.getElementsByName('adMenuItem');
	for(var i=0; i<allpages.length; i++){
		if(page == allpages[i]){
			allnodes[i].className = "befor";
			adType = page;
		}else{
			allnodes[i].className = "";
		}
	}
	updateAdType();
	parent.resizeFrame();
}

function isAdAndNews() {
	if (adType === "ad") {
		return true;
	} else {
		return false;
	}
}

function updateAdType() {
	if (isAdAndNews()) {
		$("#adType").text(parent.lang.adAndNews_ad);
	} else {
		$("#adType").text(parent.lang.adAndNews_news);
	}
}

function doCheckQuery() {
	return true;
}

function addAdOrNews(){
	adType = getAdType();
	var url = "";
	var title = "";
	if(adType == "ad"){
		url = "url:adInfo.html?adType=ad";  
		title = parent.lang.ad_add;
	}else{
		url = "url:adInfo.html?adType=news";
		title = parent.lang.news_add;
	}
	$.dialog({id:'addAdOrNews', title:title,content:url
		, min:false, max:true, lock:true});
}

function editAdOrNewsInfo(id){
	adType = $.trim($("#adType").html());
	var url = "";
	var title = "";
	if(adType == parent.lang.adAndNews_ad){
		url = "url:adInfo.html?id="+id+"&adType=ad";
		title = parent.lang.ad_edit;
	}else{
		url = "url:adInfo.html?id="+id+"&adType=news";
		title = parent.lang.news_edit;
	}
	$.dialog({id:'editAdOrNews', title:title,content:url
		, min:false, max:false, lock:true});
}

function delAdOrNewsInfo(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	//显示的消息
	$.myajax.showLoading(true, parent.lang.deleting);
	adType = getAdType();
	$.myajax.jsonGet("SysAdAndNewsAction_delete.action?id=" + id+"&adType="+adType, function(json,action,success){
		$.myajax.showLoading(false);
		$('#adTable').flexOptions().flexReload();
	}, null);
}

function delSelAdOrNews(){
	var ids = [];//getSelectItem("selectIdList");
	var rows = $('#adTable').selectedRows();
	for(var i = 0;i < rows.length; i++) {
		ids[i] = rows[i][0].RowIdentifier;
	}

	if (ids.length <= 0) {
		alert(parent.lang.errSelectedRequired);
	} else {
		if(!confirm(parent.lang.delconfirm)) {
			return ;
		}
		
		//执行删除操作
		$.myajax.showLoading(true, parent.lang.deleting);
		adType = getAdType();
		$.myajax.jsonGet("SysAdAndNewsAction_delete.action?id=" + ids+"&adType="+adType, function(json,action,success){
			$.myajax.showLoading(false);
			$('#adTable').flexOptions().flexReload();
		}, null);
	}
}

function doEditSuc(idno, json) {
	$.dialog({id:'editAdOrNews'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//查找对应的行数据
	$("#adTable").find("tr").each(function(){
		if (this.id == ("row" + idno)) {
			$(this).find("td").each(function(index){
				switch (index) {
				case 3:
					$(this).find("div").html("<a href=\"javascript:editAdOrNewsInfo('" + json.adOrNews.id + "');\">" + json.adOrNews.title + "</a>");
					break;
				case 4:
					$(this).find("div").html(dateTime2DateString(json.adOrNews.atime));
					break;
				case 5:
					$(this).find("div").html(dateTime2DateString(json.adOrNews.endTime));
					break;
				default:
					break;
				}
			});
		}
	});	
}

function disableForm(disable) {
	
}
function doAddSuc() {
	$.dialog({id:'addAdOrNews'}).close();
	$.dialog.tips(parent.lang.addok, 1);
	$('#adTable').flexOptions(
			{newp: 1, query: '', qtype: ''}).flexReload();
}

function doEditExit() {
	$.dialog({id:'editAdOrNews'}).close();
}