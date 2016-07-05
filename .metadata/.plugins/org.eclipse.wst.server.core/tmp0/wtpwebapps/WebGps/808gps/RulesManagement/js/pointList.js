var api = frameElement.api, W = api.opener;
$(document).ready(function(){
	setTimeout(loadReadyPage, 50);
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
		setPanelWidth();
	}
}

function loadPage(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//初始化经纬度点信息
	initStatisticData();
	//加载信息到列表中
	loadStorageTable();
}


var rows_lnglat = [];
//初始化数据
function initStatisticData() {
	var jingDus = W.jingdu.split(',');
	var weiDus = W.weidu.split(',');
	if(jingDus != null && weiDus != null){
		for(var i = 0; i < jingDus.length; i++){
			if(jingDus[i] != null && weiDus[i] != null)
			var row = {};
			row.jingDu = jingDus[i];
			row.weiDu = weiDus[i];
			rows_lnglat.push(row);
		}
	}
	isLoadData = true;
}

//添加经纬度点信息
function addPointInfo() {
	if(isLoadData) {
		if(rows_lnglat.length > 0) {
			var param = $('#pointTable').flexGetParams();
			var start = (param.newp - 1) * param.rp;
			var end = param.newp * param.rp;
			var infos = [];
			for (var i = start; i < rows_lnglat.length && i < end; i++) {
				infos.push(rows_lnglat[i]);
			}
			var pagination={currentPage: param.newp, pageRecords: param.rp, totalRecords: rows_lnglat.length};
			var json = {};
			json.infos = infos;
			json.pagination = pagination;
			
			$('#pointTable').flexAddData(json, false);
		}
	}else {
		setTimeout(addPointInfo,50);
	}
}

//加载经纬度点列表
function loadStorageTable() {
	$('#pointTable').flexigrid({
		url: "pointTable",
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.mark_longitude, name : 'jingDu', width : 150, sortable : false, align: 'center', hide: false},
			{display: parent.lang.mark_latitude, name : 'weiDu', width : 150, sortable : false, align: 'center'},
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
		autoload: true,
		singleSelect: true,
		checkbox: false,
		useRp: true,
		rp: 50,
		rpOptions: [20, 50, 100, 150, 200],
		idProperty: 'idno',
		showTableToggleBtn: false,
		showToggleBtn: true,
		onSubmit: addPointInfo,
		width: 'auto',
		height: 'auto'
	});
	/*$("#pointTable").flexSelectRowPropFun(function(obj) {
		W.addVehicleByTree($(obj).attr('data-id'));
	});*/
}

//改变窗口大小时加载页面
function setPanelWidth() {
	$('.flexigrid').each(function() {
		$(this).find(".bDiv").height($(window).height() - 75);
	});
}

function getColumnTitle(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

function fillCellInfo(p, row, idx, index) {
	var name = p.colModel[idx].name;
	var ret = "";
	ret = changeNull(row[name]);
	return getColumnTitle(ret);
}