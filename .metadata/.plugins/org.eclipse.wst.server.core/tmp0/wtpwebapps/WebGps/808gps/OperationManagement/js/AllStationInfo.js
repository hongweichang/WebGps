var api = frameElement.api, W = api.opener;
var ttxMap = null;		//地图对象
var lineInfo = W.lineInfo;  //线路对象
var maxUpSindex = 0;  //上行站点最大编号
var maxDownSindex = 0; //下行站点最大编号
var lineDirect = 0;   //线路方向   0上行   1下行
var upAllStation = []; //上行站点
var downAllStation = []; //下行站点
var moveUpAllStation = []; //移动后的上行站点
var moveDownAllStation = []; //移动后的下行站点
var isMoveUpStation = false; //是否在移动上行站点
var isMoveDownStation = false; //是否在移动下行站点
var mapStationInfo = new Hashtable();//所有站点信息列表 id为键值
var mapType = 3; //百度地图
var lineMapType = 3; //百度地图
var enableMarkerEditing = false; //是否开启线路编辑
var isExistUpPoint = false;  //是否存在上行画线点
var isExistDownPoint = false;  //是否存在下行画线点
var isUpLineChange = false; //上行线路改变
var isDownLineChange = false; //下行线路改变
var lineLngLat = {}; //线路经纬度信息


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
	
	if(parent.toMap == 1) {
		mapType = 0; //谷歌地图
		lineMapType = 0;
	}
	
	//存在上行画线点
	if(lineInfo.upLng && lineInfo.upLat) {
		isExistUpPoint = true;
		lineMapType = lineInfo.mapTp;
		lineLngLat.upLng = lineInfo.upLng;
		lineLngLat.upLat = lineInfo.upLat;
	}
	//存在下行画线点
	if(lineInfo.dnLng && lineInfo.dnLat) {
		isExistDownPoint = true;
		lineMapType = lineInfo.mapTp;
		lineLngLat.dnLng = lineInfo.dnLng;
		lineLngLat.dnLat = lineInfo.dnLat;
	}
	
	//加载语言
	loadLang();
	
	//搜索框
	$('#toolbar-search').flexPanel({
		SerachBarModel :
			{display: parent.lang.line_station_name, name : 'stationName', pfloat : 'left'}
	});
	//初始化按钮
	$('#toolbar-btn').flexPanel({
		ButtonsModel : getBtnModItem()
	});
	
	//初始化上行站点界面
	initUpStationPane();
	//初始化下行站点界面
	initDownStationPane();
	//获取上行站点数据
	loadStationData(0);
	//获取下行站点数据
	loadStationData(1);
	//初始化地图
	initTtxMap();
	//自适应表格
	loadReportTableWidth();
	//处理事件
	//搜索
	$('.toolbar-search .y-btn').on('click', loadQuery);
	$('.toolbar-search .search-input').on('keydown',function(e){
		if(e.keyCode == 13) {
			loadQuery();
		}
	});
	//导出
	$('.btnExport').on('click', exportStationToExcel);
	//导入
	loadImportHtml();
	//切换上下行
	$('.switchStation .switch').on('click', function() {
		switchLineDirect(this);
	});
	//保存移动的站点
	$('.btnMoveSave').on('click', saveMoveStation);
	//取消移动的站点
	$('.btnMoveCancel').on('click', cancelMoveStation);
	//关联站点
	$('.stationRelation').on('click', stationRelation);
}

//获取上下行操作按钮
function getBtnModItem() {
	var mod = [];
	mod.push([{
		display: parent.lang.importExcel, name : '', pclass : 'btnImport',bgcolor : 'gray', hide : false
	}]);
	mod.push([{
		display: parent.lang.exportExcel, name : '', pclass : 'btnExport',bgcolor : 'gray', hide : false
	}]);
	mod.push([{
		display: parent.lang.line_station_relate, name : '', pclass : 'stationRelation',bgcolor : 'gray', hide : false
	}]);
	mod.push([{
		display: parent.lang.line_station_move_save, name : '', pclass : 'btnMoveSave',bgcolor : 'gray', hide : true
	}]);
	mod.push([{
		display: parent.lang.line_station_move_cancel, name : '', pclass : 'btnMoveCancel',bgcolor : 'gray', hide : true
	}]);
	return mod;
}

//初始化上行站点界面
function initUpStationPane() {
	$('#upStationInfoTable').flexigrid({
		url: 'StandardLineAction_loadUserStations.action',
		dataType: 'json',
		colModel : [
			{display: parent.lang.number, name : 'sindex', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.name, name : 'name', width : 120, sortable : false, align: 'center', hide: false},
			{display: parent.lang.direction, name : 'direct', width : 50, sortable : false, align: 'center'},
			{display: parent.lang.type, name : 'type', width : 70, sortable : false, align: 'center'},
			{display: parent.lang.line_direction, name : 'lineDirect', width : 70, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 225, sortable : false, align: 'center'}
			],
		checkbox: true,
		clickRowDefault: false,
		params: false,
		usepager: false,
		autoload: false,
		useRp: false,
		title: false,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: false,
		width: 'auto',
		onSubmit: false,
		height: 'auto'
	});
	$('#upStationInfoTable').flexSelectRowPropFun(function(obj, selRow) {
		selectStationTableProp(obj, selRow);
	});
	$('#upStationInfoTable').flexClickCheckBoxFun(function(obj) {
		clickStationRowCheckbox(obj);
	});
}

//初始化下行站点界面
function initDownStationPane() {
	$('#downStationInfoTable').flexigrid({
		url: 'StandardLineAction_loadUserStations.action',
		dataType: 'json',
		colModel : [
			{display: parent.lang.number, name : 'sindex', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.name, name : 'name', width : 120, sortable : false, align: 'center', hide: false},
			{display: parent.lang.direction, name : 'direct', width : 50, sortable : false, align: 'center'},
			{display: parent.lang.type, name : 'type', width : 70, sortable : false, align: 'center'},
			{display: parent.lang.line_direction, name : 'lineDirect', width : 70, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 225, sortable : false, align: 'center'}
			],
		checkbox: true,
		clickRowDefault: false,
		params: false,
		usepager: false,
		autoload: false,
		useRp: false,
		title: false,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: false,
		width: 'auto',
		onSubmit: false,
		height: 'auto'
	});
	$('#downStationInfoTable').flexSelectRowPropFun(function(obj, selRow) {
		selectStationTableProp(obj, selRow);
	});
	$('#downStationInfoTable').flexClickCheckBoxFun(function(obj) {
		clickStationRowCheckbox(obj);
	});
}

//加载语言
function loadLang() {
	$('#upStationTitle').text(parent.lang.line_station_up);
	$('#downStationTitle').text(parent.lang.line_station_down);
}

//获取上下行后台数据
function loadStationData(lineDirect_) {
	var params = [];
	params.push({
		name: 'name',
		value: $.trim($('#toolbar-search .search-input').val())
	});
	params.push({
		name: 'lid',
		value: lineInfo.id
	});
	params.push({
		name: 'direct',
		value: lineDirect_
	});
	params.push({
		name: 'toMap',
		value: parent.toMap
	});
	params.push({
		name: 'pagin',
		value: encodeURIComponent(JSON.stringify({currentPage: 1, pageRecords: 10000}))
	});
	$.myajax.jsonPostEx('StandardLineAction_loadUserStations.action', function(json,action,success){
		if (success) {
			var lngs = [];
			var lats = [];
			if(json.infos) {
				for(var i = 0; i < json.infos.length; i++) {
					var oldInfo = mapStationInfo.get(json.infos[i].id);
					if(oldInfo && oldInfo.isExistMarker) {
						json.infos[i].isExistMarker = oldInfo.isExistMarker;
					}
					mapStationInfo.put(json.infos[i].id, json.infos[i]);
					if((lineDirect_ == 0 && !isExistUpPoint)
							|| (lineDirect_ == 1 && !isExistDownPoint)) {
						lngs.push(getMapLng(json.infos[i].station));
						lats.push(getMapLat(json.infos[i].station));
					}
				}
			}
			//只有两个点才能画线
			if(lngs.length < 2 && lats.length < 2) {
				lngs = [];
				lats = [];
			}
			if(lineDirect_ == 0) {
				if(!isExistUpPoint) {
					lineLngLat.upLng = lngs.toString();
					lineLngLat.upLat = lats.toString();
				}
			}else if(lineDirect_ == 1) {
				if(!isExistDownPoint) {
					lineLngLat.dnLng = lngs.toString();
					lineLngLat.dnLat = lats.toString();
				}
			}
			if(lineDirect_ == 0) {
				upAllStation = json.infos;
				if(upAllStation != null && upAllStation.length > 0) {
					moveUpAllStation = upAllStation.concat();
					maxUpSindex = upAllStation[upAllStation.length-1].sindex + 1;
				}else {
					maxUpSindex = 0;
				}
				addUpStationTableList();
			}else if(lineDirect_ == 1) {
				downAllStation = json.infos;
				if(downAllStation != null && downAllStation.length > 0) {
					moveDownAllStation = downAllStation.concat();
					maxDownSindex = downAllStation[downAllStation.length-1].sindex + 1;
				}else {
					maxDownSindex = 0;
				}
				addDownStationTableList();
			}
		}
	}, null, params);
}

//获取实际经度
function getMapLng(station) {
	if(station.lngIn && station.lngIn != 0) {
		return station.lngIn / 1000000;
	}else {
		return station.lngOut / 1000000;
	}
}

//获取实际纬度
function getMapLat(station) {
	if(station.latIn && station.latIn != 0) {
		return station.latIn / 1000000;
	}else {
		return station.latOut / 1000000;
	}
}

//lineDirect 0上行  1下行
function loadQuery() {
	//是否正在移动站点
	if(!isMoveStation(lineDirect, true)) {
		loadStationData(lineDirect);
	}
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'name') {
		if(row.station && row.station.name) {
			pos = row.station.name;
		}
	}else if(name == 'sindex') {
		pos = row.sindex + 1;
	}else if(name == 'direct') {
		if(row.station) {
			if(row.station.direct == 1) {
				pos = parent.lang.south;
			}else if(row.station.direct == 2) {
				pos = parent.lang.west;
			}else if(row.station.direct == 3) {
				pos = parent.lang.north;
			}else {
				pos = parent.lang.east;
			}
		}
	}else if(name == 'type') {
		if(row.stype == 0) {
			pos = parent.lang.track_qiDian;
		}else if(row.stype == 1) {
			pos = parent.lang.track_zhongDian;
		}else if(row.stype == 2) {
			pos = parent.lang.line_station_big;
		}else if(row.stype == 3) {
			pos = parent.lang.line_station_small;
		}else if(row.stype == 4) {
			pos = parent.lang.line_station_place;
		}else {
			pos = parent.lang.line_station_place_other;
		}
	}else if(name == 'lineDirect') {
		if(row.direct == 1){
			pos = parent.lang.line_down;
		}else {
			pos = parent.lang.line_up;
		}
	}else if(name == 'operator'){
		if(row.station) {
			pos = '<a class="detail" href="javascript:findStationInfo('+row.id+');" title="'+ parent.lang.detailed +'"></a>';
			pos += '<a class="edit" href="javascript:editStationInfo('+row.id+');" title="'+ parent.lang.edit +'"></a>';
			pos += '<a class="delete" href="javascript:delStationInfo('+row.id+');" title="'+ parent.lang.del +'"></a>';
			if((row.direct == 1 && (row.sindex == downAllStation[0].sindex || row.sindex != downAllStation[downAllStation.length - 1].sindex) ||
					(row.direct == 0 && (row.sindex == upAllStation[0].sindex || row.sindex != upAllStation[upAllStation.length - 1].sindex)))) {//最小索引
					pos += '<a class="downLoad" href="javascript:stationMoveDown('+row.id+');" title="'+ parent.lang.line_station_move_down +'"></a>';
			}else {
				pos += '<a class="not-downLoad" href="javascript:;" title="'+ parent.lang.line_station_move_down +'"></a>';
			}
			if((row.direct == 1 && (row.sindex != downAllStation[0].sindex || row.sindex == downAllStation[downAllStation.length - 1].sindex) ||
					row.direct == 0 && (row.sindex != upAllStation[0].sindex || row.sindex == upAllStation[upAllStation.length - 1].sindex))) {//最大索引
				pos += '<a class="upgrade" href="javascript:stationMoveUp('+row.id+');" title="'+ parent.lang.line_station_move_up +'"></a>';
			}else {
				pos += '<a class="not-upgrade" href="javascript:;" title="'+ parent.lang.line_station_move_up +'"></a>';
			}
			return pos;
		}
	}else {
		pos = changeNull(row[name]);
	}
	return getColumnTitle(pos);
}

function getColumnTitle(value) {
	return '<span title="'+value+'">'+value+'</span>';
}

//添加上行数据
function addUpStationTableList() {
	if(upAllStation && upAllStation.length > 0) {var json = {};
		json.rows = upAllStation;
		json.pagination = {};
		json.pagination.currentPage = 1;
		json.pagination.pageRecords = 10000;
		json.pagination.totalRecords = 10000;
		
		$('#upStationInfoTable').flexAddDataRowJson(json, false);
		//如果已在地图显示，则勾选
		for(var i = 0; i < upAllStation.length; i++) {
			if(upAllStation[i].isExistMarker) {
				$('#row'+upAllStation[i].id, $('#upStationInfoTable')).click();
			}
		}
		//显示线路到地图
		if(!isExistUpPoint) {
			hideLineOnMap(0);
			showLineOnMap(0);
		}
	}else {
		$('#upStationInfoTable').flexAddData(null, false);
	}
}

//添加下行数据
function addDownStationTableList() {
	if(downAllStation && downAllStation.length > 0) {var json = {};
		json.rows = downAllStation;
		json.pagination = {};
		json.pagination.currentPage = 1;
		json.pagination.pageRecords = 10000;
		json.pagination.totalRecords = 10000;
		
		$('#downStationInfoTable').flexAddDataRowJson(json, false);
		//如果已在地图显示，则勾选
		for(var i = 0; i < downAllStation.length; i++) {
			if(downAllStation[i].isExistMarker) {
				$('#row'+downAllStation[i].id, $('#downStationInfoTable')).click();
			}
		}
		//显示线路到地图
		if(!isExistDownPoint) {
			hideLineOnMap(1);
			showLineOnMap(1);
		}
	}else {
		$('#downStationInfoTable').flexAddData(null, false);
	}
}

//选择表格
function selectStationTableProp(obj, selRow) {
	var info = mapStationInfo.get(Number($(obj).attr('data-id')));
	if(selRow && selRow == 'delAll') {
		if(info) {
			info.isExistMarker = false;
			delMarkerOnMap(info.id);
		}
	}else {
		$(obj).addClass('trSelected');
		$(obj).find("td .selectItem")[0].checked = true;
		var checkAll = true;
		$('tbody tr .selectItem', $(obj).parent().parent().parent().parent()).each(function(){
			if($(this).val() != "" && !this.checked)	{
				checkAll = false;
			}
		});
		if (checkAll) {
			$('table tr .selectAllItem', $(obj).parent().parent().parent().parent())[0].checked = true;
		}
		if(info) {
			var lng = getMapLng(info.station);
			var lat = getMapLat(info.station);
			info.isExistMarker = true;
			addMarkerOnMap(info.id, info.station.name, lng, lat, 1, info.direct);
		}
	}
}

//点击表格复选框
function clickStationRowCheckbox(obj) {
	var info = mapStationInfo.get(Number($(obj).val()));
	if(info) {
		info.isExistMarker = obj.checked;
		if(obj.checked) {
			var lng = getMapLng(info.station);
			var lat = getMapLat(info.station);
			addMarkerOnMap(info.id, info.station.name, lng, lat, 1, info.direct);
		}else {
			delMarkerOnMap(info.id);
		}
	}
}

//地图上显示线路
function showLineOnMap(lineDirect_) {
	if(lineDirect_ == 1){//下行
		$(".showLine").find('.label').attr('title', parent.lang.line_hide_line).text(parent.lang.line_hide_line);
		$(".showLine").removeClass('showLine').addClass('hideLine');
		addMarkerOnMap(Number(lineInfo.id)+1, lineInfo.name, lineLngLat.dnLng.toString(), lineLngLat.dnLat.toString(), 9, 1);
		ttxMap.enableMarkerEditing(Number(lineInfo.id)+1, enableMarkerEditing);
	}else {//上行
		$(".showLine").find('.label').attr('title', parent.lang.line_hide_line).text(parent.lang.line_hide_line);
		$(".showLine").removeClass('showLine').addClass('hideLine');
		addMarkerOnMap(Number(lineInfo.id), lineInfo.name, lineLngLat.upLng.toString(), lineLngLat.upLat.toString(), 9, 0);
		ttxMap.enableMarkerEditing(Number(lineInfo.id), enableMarkerEditing);
	}
}

//隐藏地图上的线路
function hideLineOnMap(lineDirect_) {
	if(lineDirect_ == 1){//下行
		$(".hideLine").find('.label').attr('title', parent.lang.line_show_line).text(parent.lang.line_show_line);
		$(".hideLine").removeClass('hideLine').addClass('showLine');
		delMarkerOnMap(Number(lineInfo.id)+1);
	}else {//上行
		$(".hideLine").find('.label').attr('title', parent.lang.line_show_line).text(parent.lang.line_show_line);
		$(".hideLine").removeClass('hideLine').addClass('showLine');
		delMarkerOnMap(Number(lineInfo.id));
	}
}

//添加所有站点到地图上
function showAllStationOnMap(lineDirect_) {
	if(lineDirect_ == 1){//下行
		if(downAllStation != null && downAllStation.length > 0) {
			for (var i = 0; i < downAllStation.length; i++) {
				if(downAllStation[i].isExistMarker) {
					var lng = getMapLng(downAllStation[i].station);
					var lat = getMapLat(downAllStation[i].station);
					downAllStation[i].isExistMarker = true;
					addMarkerOnMap(downAllStation[i].id, downAllStation[i].station.name, lng, lat, 1, downAllStation[i].direct);
				}
			}
		}
	}else {
		if(upAllStation != null && upAllStation.length > 0) {
			for (var i = 0; i < upAllStation.length; i++) {
				if(upAllStation[i].isExistMarker) {
					var lng = getMapLng(upAllStation[i].station);
					var lat = getMapLat(upAllStation[i].station);
					upAllStation[i].isExistMarker = true;
					addMarkerOnMap(upAllStation[i].id, upAllStation[i].station.name, lng, lat, 1, upAllStation[i].direct);
				}
			}
		}
	}
}

//隐藏所有站点到地图上
function hideAllStationOnMap(lineDirect_) {
	if(lineDirect_ == 1){//下行
		if(downAllStation != null && downAllStation.length > 0) {
			for (var i = 0; i < downAllStation.length; i++) {
				if(downAllStation[i].isExistMarker) {
					delMarkerOnMap(downAllStation[i].id);
				}
			}
		}
	}else {
		if(upAllStation != null && upAllStation.length > 0) {
			for (var i = 0; i < upAllStation.length; i++) {
				if(upAllStation[i].isExistMarker) {
					delMarkerOnMap(upAllStation[i].id);
				}
			}
		}
	}
}

//添加标记到地图
function addMarkerOnMap(markerId, name, lng, lat, type, lineType) {
	if(!$.trim(lng) || !$.trim(lat)) {
		return;
	}
	var isExistMark = false;
	if(ttxMap.findMarker(markerId) != null) {
		isExistMark = true;
	}
	if(!isExistMark) {
		var gps = null;
		if(type == 1) {
			gps = getConvertBaiduGoogle(lng, lat, mapType);
		}else {
			if(lineType == 1 && isExistDownPoint){
				gps = getConvertBaiduGoogle(lng, lat, lineMapType);
			}else if(lineType == 0 && isExistUpPoint){
				gps = getConvertBaiduGoogle(lng, lat, lineMapType);
			}else {
				gps = getConvertBaiduGoogle(lng, lat, mapType);
			}
		}
		ttxMap.insertMarker(markerId);
		if(lineType == 1){//下行
			name += '-' + parent.lang.line_down;
		}else {
			name += '-' + parent.lang.line_up;
		}
		ttxMap.updateMarker(markerId, type, name, gps.lng, gps.lat
				, 0, 'FF0000', null, 0);
	}
	ttxMap.selectMarker(markerId);
}

//经纬度转换，mapType_标记的地图类型
function getConvertBaiduGoogle(jingDu, weiDu, mapType_) {
	var ret = {};
	ret.lng = '';
	ret.lat = '';
	var jingDus = jingDu.toString().split(',');
	var weiDus = weiDu.toString().split(',');
	if(typeof convertBaiduGoogle == 'function') {
		if(mapType_ == 3 && !isBaiduMap()) {//百度转谷歌
			for (var i = 0; i < jingDus.length; i++) {
				var gps = convertBaiduGoogle(weiDus[i], jingDus[i], 1);
				if(i != 0) {
					ret.lng += ',';
					ret.lat += ',';
				}
				ret.lng += gps.lng;
				ret.lat += gps.lat;
			}
		}else if(mapType_ != 3 && isBaiduMap()){//谷歌经纬度转为百度经纬度
			for (var i = 0; i < jingDus.length; i++) {
				var gps = convertBaiduGoogle(weiDus[i], jingDus[i], 2);
				if(i != 0) {
					ret.lng += ',';
					ret.lat += ',';
				}
				ret.lng += gps.lng;
				ret.lat += gps.lat;
			}
		}else {
			ret.lng = jingDu;
			ret.lat = weiDu;
		}
	}else {
		ret.lng = jingDu;
		ret.lat = weiDu;
	}
	return ret;	
}

//是否百度地图
function isBaiduMap() {
	var mapType = parent.getMapType();
	if (mapType == 3) {
		return true;
	} else {
		return false;
	}
}

//删除地图上标记信息
function delMarkerOnMap(markerId) {
	ttxMap.deleteMarker(markerId);
}

//初始化地图
function initTtxMap() {
	ttxMap = new TtxMap('frameMap');
	if(ttxMap != null) {
		ttxMap.initialize(ttxMapLoadSuc);
	}
}

/*
 * 地图加载成功后的回调
 */
function ttxMapLoadSuc() {
	if(ttxMap == null) {
		return;
	}
	//禁止工具栏
	ttxMap.enableMapTool(false);
	//禁止右键
	ttxMap.disableSysRight('body',true);
	//修改地图全屏标题
	ttxMap.doSetMapFullTitle(parent.lang.line_edit_line);
	//显示线路信息到地图
	showLineOnMap(lineDirect);
}

/*
 * 处理地图全屏
*/
function ttxMapFullScreen(isFull) {
	//全屏
	if(isFull) {
		$('#allStationInfo').hide();
		$('.dm_map').width(965);
		//修改地图全屏标题
		ttxMap.doSetMapFullTitle(parent.lang.cancel);
		//地图显示保存
		ttxMap.enableMapMoreBtnAdd(true);
		//开启线路编辑
		setTimeout(function() {
			if(lineDirect == 1){//下行
				ttxMap.selectMarker(Number(lineInfo.id)+1);
			}else {//上行
				ttxMap.selectMarker(Number(lineInfo.id));
			}
			enableLineEditing();
		}, 200);
	}else {
		$('#allStationInfo').show();
		$('.dm_map').width(270);
		//取消编辑线路
		editCancelFunc();
		//修改地图全屏标题
		ttxMap.doSetMapFullTitle(parent.lang.line_edit_line);
		//地图隐藏保存
		ttxMap.enableMapMoreBtnAdd(false);
	}
}

/*
 * 重新加载地图
 */
function ttxMapReload() {
	var ldg_lockmask = $('#ldg_lockmask', parent.document).get(0);
	
	$('#frameMap').attr('src', $('#frameMap').attr('src'));
	
	var index = parent.document;
	ttxMap.initialize(function() {
		$('body', index).append(ldg_lockmask);
		//禁止工具栏
		ttxMap.enableMapTool(false);
		//禁止右键
		ttxMap.disableSysRight('body',true);
		//如果正在编辑线路
		if(enableMarkerEditing) {
			ttxMap.doSetMapFullTitle(parent.lang.cancel);
			ttxMap.doSetMapFullIcon(true);
			//地图显示保存
			ttxMap.enableMapMoreBtnAdd(true);
		}else {
			ttxMap.doSetMapFullTitle(parent.lang.line_edit_line);
			ttxMap.doSetMapFullIcon(false);
			//地图隐藏保存
			ttxMap.enableMapMoreBtnAdd(false);
		}
		setTimeout(function() {
			showAllStationOnMap(lineDirect);
			showLineOnMap(lineDirect);
		}, 2000);
	});
}

//处理保存线路编辑
function ttxMapBtnSave() {
	editSaveFunc();
}

//切换线路上下行
function switchLineDirect(obj) {
	lineDirect = $(obj).index();
	//是否正在移动站点
	if(isMoveStation(lineDirect)) {
		showMoveStation(true);
	}else {
		showMoveStation(false);
	}
	if(lineDirect == 1) {//下行
		hideLineOnMap(0);
		showLineOnMap(1);
		hideAllStationOnMap(0);
		showAllStationOnMap(1);
		isDownLineChange = false;
	}else {//上行
		hideLineOnMap(1);
		showLineOnMap(0);
		hideAllStationOnMap(1);
		showAllStationOnMap(0);
		isUpLineChange = false;
	}
	$(obj).addClass("cur").siblings().removeClass("cur");
	$(".station-info li").eq(lineDirect).addClass("cur").siblings().removeClass("cur");
}

//显示编辑路线等按钮
function showLineEditing(open) {
	if(open) {
		$('.enableEditing').addClass('show');
		$('.editCancel').removeClass('show');
		$('.editSave').removeClass('show');
	}else {
		$('.enableEditing').removeClass('show');
		$('.editCancel').addClass('show');
		$('.editSave').addClass('show');
	}
}

//开启编辑线路
function enableLineEditing() {
	showLineEditing(false);
	enableMarkerEditing = true;
	if(lineDirect == 1) {
		ttxMap.enableMarkerEditing(Number(lineInfo.id)+1, enableMarkerEditing);
	}else {
		ttxMap.enableMarkerEditing(Number(lineInfo.id), enableMarkerEditing);
	}
}

//取消编辑线路
function editCancelFunc() {
	showLineEditing(true);
	enableMarkerEditing = false;
	if(lineDirect == 1) {
		if(isDownLineChange) {
			hideLineOnMap(lineDirect);
			showLineOnMap(lineDirect);
		}else {
			ttxMap.enableMarkerEditing(Number(lineInfo.id)+1, enableMarkerEditing);
		}
		isDownLineChange = false;
	}else {
		if(isUpLineChange) {
			hideLineOnMap(lineDirect);
			showLineOnMap(lineDirect);
		}else {
			ttxMap.enableMarkerEditing(Number(lineInfo.id), enableMarkerEditing);
		}
		isUpLineChange = false;
	}
}

//保存编辑的线路
function editSaveFunc() {
	var marker = null;
	if(lineDirect == 1) {
		ttxMap.enableMarkerEditing(Number(lineInfo.id)+1, enableMarkerEditing);
		if(isDownLineChange) {
			marker = ttxMap.findMarker(Number(lineInfo.id)+1);
		}
	}else {
		ttxMap.enableMarkerEditing(Number(lineInfo.id), enableMarkerEditing);
		if(isUpLineChange) {
			marker = ttxMap.findMarker(Number(lineInfo.id));
		}
	}
	if(marker != null) {
		var point = marker.shape.getPath();
		//保存线路信息
		var lngs = [];
		var lats = [];
		for (var i = 0; i < point.length; i++) {
			if(isBaiduMap()) {
				lngs.push(point[i].lng.toFixed(6));
				lats.push(point[i].lat.toFixed(6));
			}else {
				lngs.push(point.getAt(i).lng().toFixed(6));
				lats.push(point.getAt(i).lat().toFixed(6));
			}
		}
		if(lineDirect == 1) {
			lineInfo.dnLng = lngs.toString();
			lineInfo.dnLat = lats.toString();
			
			lineLngLat.dnLng = lineInfo.dnLng;
			lineLngLat.dnLat = lineInfo.dnLat;
		}else {
			lineInfo.upLng = lngs.toString();
			lineInfo.upLat = lats.toString();
			
			lineLngLat.upLng = lineInfo.upLng;
			lineLngLat.upLat = lineInfo.upLat;
		}
		lineInfo.mapTp = parent.getMapType();
		lineMapType = lineInfo.mapTp;	
		var action = 'StandardLineAction_mergeLineInfo.action';
		disableForm(true);
		$.myajax.showLoading(true, parent.lang.saving);
		$.myajax.jsonPost( action, lineInfo, false, function(json, success) {
			disableForm(false);
			$.myajax.showLoading(false);
			if (!success) {
				alert(parent.lang.failure);
			}else {
				if(lineDirect == 1) {
					isDownLineChange = false;
					isExistDownPoint = true;
				}else {
					isUpLineChange = false;
					isExistUpPoint = true;
				}
				$.dialog.tips(parent.lang.saveok, 1);
			}
		});
	}
}

//关联已有站点
function stationRelation() {
	//是否正在移动站点
	if(!isMoveStation(lineDirect, true)) {
		var title = parent.lang.associate+'&nbsp&nbsp&nbsp&nbsp';
		var maxSindex = 0;
		if(lineDirect == 1){
			title += parent.lang.line_station_down;
			maxSindex = maxDownSindex;
		}else {
			title += pos = parent.lang.line_station_up;
			maxSindex = maxUpSindex;
		}
		$.dialog({id:'stationinfo', title: title, content: 'url:OperationManagement/SelectInfo.html?type=relationStation&id='+lineInfo.id+'&direct='+ lineDirect+'&maxSindex='+maxSindex +'&singleSelect=true',
			width:'800px',height:'530px', min:false, max:false, lock:true, parent: api});
	}
}

//关联站点成功
function relationSuc() {
	loadStationData(lineDirect);
	$.dialog({id:'stationinfo'}).close();
}

//查询站点信息  id关联id
function findStationInfo(id) {
	$.dialog({id:'stationinfo', title:parent.lang.view+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.line_station_info,content: 'url:OperationManagement/StationInfo.html?id='+id+'&type=&lineDirect='+lineDirect+'&lineId='+lineInfo.id,
	width:'975px',height:'400px', min:false, max:false, lock:true, parent: api});
}

//修改站点信息  id关联id
function editStationInfo(id) {
	//是否正在移动站点
	if(!isMoveStation(lineDirect, true)) {
		$.dialog({id:'stationinfo', title:parent.lang.edit+'&nbsp&nbsp&nbsp&nbsp'+parent.lang.line_station_info,content: 'url:OperationManagement/StationInfo.html?id='+id+'&type=edit&lineDirect='+lineDirect+'&lineId='+lineInfo.id,
			width:'975px',height:'450px', min:false, max:false, lock:true, parent: api});
	}
}

//删除站点信息  id关联id
function delStationInfo(id) {
	//是否正在移动站点
	if(!isMoveStation(lineDirect, true)) {
		if(!confirm(parent.lang.delconfirm)) {
			return ;
		}
		//显示的消息
		$.myajax.showLoading(true, parent.lang.deleting);
		$.myajax.jsonGet('StandardLineAction_deleteStationInfo.action?id=' + id, function(json,action,success){
			$.myajax.showLoading(false);
			if(success){
				//删除地图上的标记
				delMarkerOnMap(id);
				loadStationData(lineDirect);
			}
		}, null);
	}
}

//添加站点成功
function doAddStationSuc() {
	$.dialog.tips(parent.lang.saveok, 1);
	loadStationData(lineDirect);
	$.dialog({id:'stationinfo'}).close();
}

//保存站点成功
function doSaveStationSuc(info) {
	if(info.id) {
		if(ttxMap.findMarker(info.id) != null) {
			//删除原有标记
			delMarkerOnMap(info.id);
			//添加标记到地图
			var lng = getMapLng(info.station);
			var lat = getMapLat(info.station);
			addMarkerOnMap(info.id, info.station.name, lng, lat, 1, info.direct);
		}
	}
	loadStationData(lineDirect);
	$.dialog({id:'stationinfo'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

//退出
function doExit() {
	$.dialog({id:'stationinfo'}).close();
}

//站点上移
function stationMoveUp(id) {
	stationMoveComment(id, 0);
}

//站点下移
function stationMoveDown(id) {
	stationMoveComment(id, 1);
}

//站点移动
function stationMoveComment(id, type) {
	showMoveStation(true);
	var curObj = null;  //当前表格行对象
	var lastObject = null; //下一个表格行对象
	var curStation = null; //当前站点
	var lastStation = null; //下一个站点
	var isFirst = false; //操作第二行
	var isEnd = false; //操作最后一行
	var moveAllStation = [];  //站点集合
	if(lineDirect == 1){//下行
		moveAllStation = moveDownAllStation;
		isMoveDownStation = true;
	}else {//上行
		moveAllStation = moveUpAllStation;
		isMoveUpStation = true;
	}
	//获取当前行在Array中的索引
	var curIndex_ = getArrayIndex(moveAllStation, id);
	var index_x = curIndex_;
	curStation = moveAllStation[curIndex_];
	if(type == 0) { //站点上移
		if(curIndex_ == 1) {
			isFirst = true;
		}
		if(curIndex_ == moveAllStation.length - 1) {
			isEnd = true;
		}
		index_x = curIndex_ - 1;
	}else if(type == 1) { //站点下移
		if(curIndex_ == 0) {
			isFirst = true;
		}
		if(curIndex_ == moveAllStation.length - 2) {
			isEnd = true;
		}
		index_x = curIndex_ + 1;
	}
	lastStation = moveAllStation[index_x];
	//
	moveAllStation[curIndex_] = lastStation;
	moveAllStation[index_x] = curStation;
	//获取表格行对象
	if(lineDirect == 1){//下行
		curObj = $($('#downStationInfoTable').flexGetRowid(id)).get(0);
		lastObject = $($('#downStationInfoTable').flexGetRowid(lastStation.id)).get(0);
	}else {
		curObj = $($('#upStationInfoTable').flexGetRowid(id)).get(0);
		lastObject = $($('#upStationInfoTable').flexGetRowid(lastStation.id)).get(0);
	}
	if(curObj != null && lastObject != null && curStation != null && lastStation != null) {
		var curSIndex = curStation.sindex;
		var lastSIndex = lastStation.sindex;
		if(type == 0) { //站点上移
			curStation.sindex = lastSIndex;
			lastStation.sindex = lastSIndex + 1;
		}else if(type == 1) { //站点下移
			curStation.sindex = curSIndex + 1;
			lastStation.sindex = curSIndex;
		}
		$('.sindex div', curObj).text(curStation.sindex+1);
		$('.sindex div', lastObject).text(lastStation.sindex+1);
		
		if(isFirst && isEnd) {
			if(type == 0) { //站点上移
				$('.operator .upgrade', curObj).removeClass('upgrade').
					addClass('not-upgrade').attr('href', 'javascript:;');
				$('.operator .not-downLoad', curObj).removeClass('not-downLoad').
					addClass('downLoad').attr('href', 'javascript:stationMoveDown('+ curStation.id +');');
				
				$('.operator .not-upgrade', lastObject).removeClass('not-upgrade').
					addClass('upgrade').attr('href', 'javascript:stationMoveUp('+ lastStation.id +');');
				$('.operator .downLoad', lastObject).removeClass('downLoad').
					addClass('not-downLoad').attr('href', 'javascript:;');
			}else if(type == 1) { //站点下移
				$('.operator .not-upgrade', curObj).removeClass('not-upgrade').
					addClass('upgrade').attr('href', 'javascript:stationMoveUp('+ curStation.id +');');
				$('.operator .downLoad', curObj).removeClass('downLoad').
					addClass('not-downLoad').attr('href', 'javascript:;');
				
				$('.operator .upgrade', lastObject).removeClass('upgrade').
					addClass('not-upgrade').attr('href', 'javascript:;');
				$('.operator .not-downLoad', lastObject).removeClass('not-downLoad').
					addClass('downLoad').attr('href', 'javascript:stationMoveDown('+ lastStation.id +');');
			}
		}else {
			if(isFirst) {
				if(type == 0) { //站点上移
					$('.operator .upgrade', curObj).removeClass('upgrade').
						addClass('not-upgrade').attr('href', 'javascript:;');
					$('.operator .not-upgrade', lastObject).removeClass('not-upgrade').
						addClass('upgrade').attr('href', 'javascript:stationMoveUp('+ lastStation.id +');');
				}else if(type == 1) { //站点下移
					$('.operator .not-upgrade', curObj).removeClass('not-upgrade').
						addClass('upgrade').attr('href', 'javascript:stationMoveUp('+ curStation.id +');');
					$('.operator .upgrade', lastObject).removeClass('upgrade').
						addClass('not-upgrade').attr('href', 'javascript:;');
				}
			}else if(isEnd) {
				if(type == 0) { //站点上移
					$('.operator .not-downLoad', curObj).removeClass('not-downLoad').
						addClass('downLoad').attr('href', 'javascript:stationMoveDown('+ curStation.id +');');
					$('.operator .downLoad', lastObject).removeClass('downLoad').
						addClass('not-downLoad').attr('href', 'javascript:;');
				}else if(type == 1) { //站点下移
					$('.operator .downLoad', curObj).removeClass('downLoad').
						addClass('not-downLoad').attr('href', 'javascript:;');
					$('.operator .not-downLoad', lastObject).removeClass('not-downLoad').
						addClass('downLoad').attr('href', 'javascript:stationMoveDown('+ lastStation.id +');');
				}
			}
		}
		
		if($(curObj).hasClass('erow')) {
			$(curObj).removeClass('erow');
			$(lastObject).addClass('erow');
		}else {
			$(curObj).addClass('erow');
			$(lastObject).removeClass('erow');
		}
		if(type == 0) { //站点上移
			$(curObj).after(lastObject);
		}else if(type == 1) { //站点下移
			$(curObj).before(lastObject);
		}
	}
}

//保存移动的站点
function saveMoveStation() {
	//正在移动站点
	if(isMoveStation(lineDirect)) {
		showMoveStation(false);
		var moveAllStation_ = [];
		if(lineDirect == 1) {
			isMoveDownStation = false;
			moveAllStation_ = moveDownAllStation;
			downAllStation = moveDownAllStation.concat();
		}else {
			isMoveUpStation = false;
			moveAllStation_ = moveUpAllStation;
			upAllStation = moveUpAllStation.concat();
		}
		if(moveAllStation_ != null && moveAllStation_.length > 0) {
			var data = {};
			var ids = [];
			var indexs = [];
			for (var i = 0; i < moveAllStation_.length; i++) {
				ids.push(moveAllStation_[i].id);
				indexs.push(moveAllStation_[i].sindex);
			}
			data.vehiIdnos = lineInfo.id;
			data.condiIdno = lineDirect;
			data.sourceIdno = ids.toString();
			data.typeIdno = indexs.toString();
			
			var action = 'StandardLineAction_saveMoveStation.action';
			disableForm(true);
			$.myajax.showLoading(true, parent.lang.saving);
			$.myajax.jsonPost( action, data, false, function(json, success) {
				disableForm(false);
				$.myajax.showLoading(false);
				if (!success) {
					alert(parent.lang.failure);
				}
			}); 
		}
	}
}

//取消移动的站点
function cancelMoveStation() {
	//正在移动站点
	if(isMoveStation(lineDirect)) {
		showMoveStation(false);
		if(lineDirect == 1) {
			isMoveDownStation = false;
		}else {
			isMoveUpStation = false;
		}
		loadStationData(lineDirect);
	}
}

//显示站点移动后保存取消按钮
function showMoveStation(show) {
	if(show) {
		if(lineDirect == 1) {
			$('#toolbar-btn .btnMoveSave').addClass('show');
			$('#toolbar-btn .btnMoveCancel').addClass('show');
		}else {
			$('#toolbar-btn .btnMoveSave').addClass('show');
			$('#toolbar-btn .btnMoveCancel').addClass('show');
		}
	}else {
		if(lineDirect == 1) {
			$('#toolbar-btn .btnMoveSave').removeClass('show');
			$('#toolbar-btn .btnMoveCancel').removeClass('show');
		}else {
			$('#toolbar-btn .btnMoveSave').removeClass('show');
			$('#toolbar-btn .btnMoveCancel').removeClass('show');
		}
	}
}

//导出
function exportStationToExcel(){
//	var str = "&format=html&name=reportExample&disposition=inline";
	document.reportForm.action = 'StandardLineAction_excel.action?id='+lineInfo.id+'&direct='+lineDirect;
	document.reportForm.submit(); 
}

//是否正在移动站点
function isMoveStation(lineDirect_, show) {
	if((lineDirect_ == 0 && isMoveUpStation) || (lineDirect_ == 1 && isMoveDownStation)){
		if(show) {
			alert(parent.lang.line_station_error_tip);
		}
		return true;
	}else {
		return false;
	}
}

/**
 * 圆，面和线 改变事件
 */
function markerLineupdate() {
	if(lineDirect == 1){
		isDownLineChange = true;
	}else {
		isUpLineChange = true;
	}
}

//加载导入html
function loadImportHtml() {
	var html_ = '<form action="StandardVehicleAction_importExcel.action" id="uploadForm" name="uploadForm" method="post" enctype="multipart/form-data">';
	html_ += '<label class="lableExcel label" id="lableExcel" for="uploadFile" style="width:60px;cursor:pointer;font-family:arial;">'+parent.lang.importExcel;
	html_ += '<input type="file" style="filter:alpha(opacity=0);opacity:0;width: 0;height:0;position: absolute;left:-1000px;" onchange="previewExcel(this)" class="uploadFile" name="uploadFile" id="uploadFile" accept=".XLS,.xlsx"/>';
	html_ += '</label>';
	html_ += '</form>';
	
	$('.toolbar-btn .btnImport').html(html_);
}

//判断文件
function previewExcel(file) {
	//是否正在移动站点
	if(isMoveStation(lineDirect, true)) {
		$(file).val("");
		return;
	}
	
	var names = file.value.split("\\");
	var i= names.length;
	var exts = names[i-1].split(".");
	var j = exts.length;
	var ext = $.trim(exts[j-1].toLowerCase());
    if (ext != "xls"){
    	$(file).val("");
    	alert(parent.lang.vehicle_alarmaction_errorFile);
    	return;
    }else {
    	if(exts[0]) {
    		var name_ =  $.trim(exts[0].substring(0, exts[0].length - 1));
    		if((lineDirect == 1 && $.trim(exts[0].toLowerCase()).endWith('s')) ||
    				(lineDirect == 0 && $.trim(exts[0].toLowerCase()).endWith('x'))
    				) {
    			$(file).val("");
    			alert(parent.lang.vehicle_alarmaction_errorFile);
            	return;
    		}else {
    			//导入操作
    			ajaxImportStation();
    		}
    	}else {
    		$(file).val("");
    		alert(parent.lang.vehicle_alarmaction_errorFile);
        	return;
    	}
    }
}

//判断文件类型
function checkExcelFile() {
	var file = $("#uploadFile").val();
	if (file !== "") {
		var ext = /\.[^\.]+$/.exec(file);
		if (ext.length > 0 && ext[0].toLowerCase() == ".xls") {
			return true;
		} 
	} 
	alert(parent.lang.vehicle_tipSelectExcelFile);
	return false;
}

//加载导入
function ajaxImportStation() {
	if (!checkExcelFile()) {
		return ;
	}
	$.myajax.showLoading(true, parent.lang.importing);
	disableForm(true);
	$('#uploadForm').ajaxSubmit({
		url:'StandardLineAction_importStationExcel.action?lid='+ lineInfo.id,
		type:"post",
		dataType:"JSON",
		cache:false,/*禁用浏览器缓存*/
		resetForm: true,
		clearForm: true,
		success: function(json){
			disableForm(false);
			$.myajax.showLoading(false);
			if(json.result == 0){
				if(json.failedStation && json.failedStation.length > 0) {
					alert(parent.lang.vehicle_importFailed+':'+ json.failedStation.toString());
				}else {
					//导入成功
					$.dialog.tips(parent.lang.vehicle_importSuccess, 1);
					loadStationData(lineDirect);
				}
			}else {
				showErrorMessage(json.result);
			}
		}
	});
}