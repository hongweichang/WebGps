var lineCompanyTeams = null;
var mapLineInfo = new Hashtable();//所有线路信息列表 线路id为键值
var lineInfo = null;
var curLineId = null;
var lineAdd = false; //添加线路时
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
	$('#toolbar-search').flexPanel({
		SerachBarModel :
			{display: parent.lang.line_name+'/'+parent.lang.company_name, name : 'lineName', pfloat : 'left'}
	});
	var mod = [[{
		display: parent.lang.line_all_lines, name : '', pclass : 'btnAllLine',bgcolor : 'gray', hide : false
	}]];
	mod.push([{
		display: parent.lang.add, name : '', pclass : 'btnAddLine',bgcolor : 'gray', hide : false
	}]);
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : mod
	});
	var width = 0;
	if(parent.screenWidth < 1280) {
		width = 980;
	}else {
		width = 'auto';
	}
	$('#lineInfoTable').flexigrid({
		url: 'StandardLineAction_loadUserLines.action',
		dataType: 'json',
		colModel : [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.line_name, name : 'name', width : 120, sortable : false, align: 'center', hide: false},
			{display: parent.lang.abbreviation, name : 'abbr', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.belong_company, name : 'company', width : 140, sortable : false, align: 'center'},
//			{display: parent.lang.line_ticket_type, name : 'ticket', width : 80, sortable : false, align: 'center'},
//			{display: parent.lang.line_ticket_price, name : 'price', width : 80, sortable : false, align: 'center'},
//			{display: parent.lang.line_start_station, name : 'startSt', width : 100, sortable : false, align: 'center'},
//			{display: parent.lang.line_end_station, name : 'endSt', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.line_up_first_time, name : 'upFirst', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.line_up_end_time, name : 'upLast', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.line_down_first_time, name : 'dnFirst', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.line_down_end_time, name : 'dnLast', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 230, sortable : false, align: 'center'}
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
		checkbox: false,
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		usepager: true,
		autoload: true,
		useRp: true,
		title: false,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: false,
		width: width,
		onSubmit: false,
		onSuccess: loadAllLineInfo,
		height: 'auto'
	});
	loadReportTableWidth();
	
	$('#toolbar-search .y-btn').on('click',function(){
		loadQuery(1);
	});
	$('#toolbar-search .search-input').on('keydown',function(e){
		if(e.keyCode == 13) {
			loadQuery(2);
		}
	});
	$('.btnAllLine').on('click',function(){
		loadQuery(3);
	});
	$('.btnAddLine').on('click', addLineInfo);
	//加载用户公司和车队
	loadUserCompanyTeams();
}

//将所有查询出的线路信息加入缓存
function loadAllLineInfo() {
	//清除
	mapLineInfo.clear();
	//新增
	var data = $('#lineInfoTable').flexGetData();
	if(data && data.rows) {
		for (var i = 0; i < data.rows.length; i++) {
			mapLineInfo.put(data.rows[i].id.toString(), data.rows[i]);
		}
	}
}

//加载用户公司和车队
function loadUserCompanyTeams() {
	$.myajax.jsonGet('StandardLineAction_loadUserCompanyTeams.action', function(json,action,success){
		if(success) {
			lineCompanyTeams = json.infos;
		};
	}, null);
}

//搜索
function loadQuery(type) {
	var name = '';
	if(type == '1' || type == '2') {
		name = $('#toolbar-search .search-input').val();
	}
	
	var params = [];
	params.push({
		name: 'name',
		value: name
	});
	$('#lineInfoTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'company') {
		var company = getParentCompany(parent.vehiGroupList, row['pid']);
		if(company) {
			pos = company.name;
		}
	}else if(name == 'ticket') {
		if(row[name] == 1) {
			pos = parent.lang.line_artificial_ticket;
		}else if(row[name] == 2) {
			pos = parent.lang.line_mix_ticket;
		}else if(row[name] == 0) {
			pos = parent.lang.line_no_ticket;
		}
	}else if(name == 'price') {
		if(row[name]) {
			pos = parseInt(row[name], 10) / 10;
		}
	}else if(name == 'operator'){
		pos = '<a class="detail" href="javascript:findLineInfo('+row['id']+');" title="'+ parent.lang.detailed +'"></a>';
		pos += '<a class="edit" href="javascript:editLineInfo('+row['id']+');" title="'+ parent.lang.edit +'"></a>';
		pos += '<a class="authorize" href="javascript:assignVehicle('+row['id']+',\''+row.name+'\');" title="'+ parent.lang.line_assign_vehicle +'"></a>';
		pos += '<a class="manage" href="javascript:stationManage('+row['id']+');" title="'+ parent.lang.line_station_manage +'"></a>';
		pos += '<a class="delete" href="javascript:delLineInfo('+row['id']+');" title="'+ parent.lang.del +'"></a>';
	}else if(name == 'upFirst' || name == 'upLast' || name == 'dnFirst' || name == 'dnLast') {
		if(row[name]){
			pos = second2ShortHourEx(row[name]);
		}
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

//添加线路信息
function addLineInfo() {
	$.dialog({id:'lineinfo', title:parent.lang.add+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.line_info,content: 'url:OperationManagement/LineInfo.html?type=add',
		width:'975px',height:'550px', min:false, max:false, lock:true});
}

//查询线路信息
function findLineInfo(id) {
	$.dialog({id:'lineinfo', title:parent.lang.view+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.line_info,content: 'url:OperationManagement/LineInfo.html?id='+id+'&type=',
	width:'975px',height:'470px', min:false, max:false, lock:true});
}

//修改线路信息
function editLineInfo(id) {
	$.dialog({id:'lineinfo', title:parent.lang.edit+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.line_info,content: 'url:OperationManagement/LineInfo.html?id='+id+'&type=edit',
		width:'975px',height:'550px', min:false, max:false, lock:true});
}

//删除线路
function delLineInfo(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet('StandardLineAction_deleteLineInfo.action?id=' + id, function(json,action,success){
		$.myajax.showLoading(false);
		if(success){
			//刷新公司车队信息信息
			parent.isChangedVehiGroup = true;
			$('#lineInfoTable').flexReload();
		}
	}, null);
}

//保存线路信息成功
function doSaveLineSuc(data, type) {
	//刷新公司车队信息信息
	parent.isChangedVehiGroup = true;
	$('#lineInfoTable').flexReload();
	$.dialog({id:'lineinfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//新增线路成功后跳转到分配车辆到线路
	if(type == 'add' && data) {
		lineAdd = true;
		curLineId = data.id;
		$.dialog({id:'lineinfo', title:data.name + '&nbsp-&nbsp' + parent.lang.line_assign_vehicle,content: 'url:OperationManagement/SelectInfo.html?type=assignLineVehicle&id='+data.id+'&singleSelect=false',
			width:'800px',height:'530px', min:false, max:false, lock:true, close: function() {
				setTimeout(function() {
					stationManage(data.id);
				}, 300);
			}});
	}
}

//关闭线路信息
function doLineInfoExit() {
	$.dialog({id:'lineinfo'}).close();
}

//线路分配车辆
function assignVehicle(lineId, lineName) {
	$.dialog({id:'lineinfo', title:lineName + '&nbsp-&nbsp' + parent.lang.line_assign_vehicle,content: 'url:OperationManagement/SelectInfo.html?type=assignLineVehicle&id='+lineId+'&singleSelect=false',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}

//线路分配车辆退出
function doExit() {
	$.dialog({id:'lineinfo'}).close();
	//如果是新增流程
	if(lineAdd) {
		stationManage(curLineId);
	}
}

//站点管理
function stationManage(id) {
	lineInfo = mapLineInfo.get(id.toString());
	lineInfo.index = undefined;
	$.dialog({id:'station', title:parent.lang.line_station_manage +'&nbsp&nbsp&nbsp&nbsp'+ lineInfo.name,content: 'url:OperationManagement/AllStationInfo.html',
		width:'975px',height:'600px', min:false, max:false, lock:true, close: function() {
			lineAdd = false;
		}});
}