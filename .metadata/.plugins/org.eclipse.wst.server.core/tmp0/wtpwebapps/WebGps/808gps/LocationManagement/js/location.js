var vehiTree;   //车辆树
var monitorStatus = null;	//车辆状态监听类，用于获取车辆实时状态
var monitorAlarm = null;	//车辆报警监听类，用于获取车辆报警状态
var monitorMenu = null;   //监控树右键菜单处理类
var alarmMotion = null;  //报警联动处理类
var monitorMedia = null; //车辆媒体文件处理类
var paneInfo = null;	//车辆列表下方的信息面板，包括车辆信息，语音，ptz，颜色
var monitorMapTip = null; //车辆在地图的tip处理类
var monitorLine = null;   //监控线路处理类
var ttxMap = null;		//地图对象
var mapWidth = 300;		//地图宽度
var ttxVideo = null;
var lang = parent.lang;
var is_mouse_down = false;
var src_posi_Y = 0, dest_posi_Y = 0, move_Y = 0, destHeight = 30,mapHeight;
var currentPage = "weizhi";
var enableFocusTree = true;
var damageTime = 72;  //定损时长,超时小时数,可以配置
var DEF_DAMAGE_TIME = "damageTime";
var DEF_Request_Video = 'RequestVideo';
var DEF_Video_Set = 'VideoSet';
var DEF_Refresh_Interval = 'RefreshInterval';
var DEF_Alarm_Refresh_Interval = 'AlarmRefInterval';
var refinterval = 0;
var alarmrefinterval = 0;
var popTipsObject = new Hashtable();//页面弹出框对象集合
var DEF_Enable_Marker_Cluster = "EnableMarkerCluster";
var DEF_Max_Cluster_Zoom = "MaxClusterZoom";
var DEF_Min_Cluster_Size = "MinClusterSize";
var isExistOpenEndHandler = false; //树列表是否存在点击节点打开子节点事件

$(document).ready(function () {
	$('body').flexShowLoading(true);
	loadReadPage();
});

function loadReadPage() {
	loadLang();
	loadPageInfo();
	//初始化设备树下方的面板信息
	paneInfo = new monitorPaneInfo();
	paneInfo.initPaneInfo();
	setPanelWidth(fixHeight);
	//车辆媒体文件处理类
	monitorMedia = new monitorVehicleMedia();
	monitorMedia.initialize();
	//车辆状态监听类
	monitorStatus = new monitorVehicleStatus();
	var interval = $.cookie(DEF_Refresh_Interval);
	if(interval != null){
		refinterval = interval * 1000;
		monitorStatus.setFlashStatusInterval(refinterval);
	}
	monitorStatus.initialize();
	//车辆报警监听类
	monitorAlarm = new monitorVehicleAlarm();
	var alarminterval = $.cookie(DEF_Alarm_Refresh_Interval);
	if(alarminterval != null){
		alarmrefinterval = alarminterval * 1000;
		monitorAlarm.setFlashAlarmInterval(alarmrefinterval);
	}
	monitorAlarm.initialize();
	parent.alarmClass = monitorAlarm;
	//监控树右键菜单处理类
	monitorMenu = new monitorTreeMenu();
	monitorMenu.setRoleCls(parent.myUserRole);
	//报警联动处理类
	alarmMotion = new vehicleAlarmMotion();
	alarmMotion.initialize();
	//车辆在地图的tip处理类
	monitorMapTip = new monitorVehicleMapTip();
	monitorMapTip.setRoleCls(parent.myUserRole);
	//监控线路处理类
	if(parent.myUserRole.isManageLine()) {
		monitorLine = new monitorVehicleLine();
		monitorLine.setRoleCls(parent.myUserRole);
		monitorLine.initialize();
		$('#gps-line').addClass('active').show();
		$('#gpsLine').addClass('active');
	}else {
		$('#gps-monitor').addClass('active');
		$('#gpsMonitor').addClass('active');
	}
	//初始化地图
	initTtxMap();
	//初始化视频插件
	initTtxVideo();
	//记载车辆树
	loadVehiTree();
	//获取服务器信息
	getGatewayServer();
	//报警联动
	if(parent.myUserRole.isPermit(661)) {
		$('.icon_alarm_linkage').css('display','inline-block');
	};
	//报警屏蔽
//	if(parent.myUserRole.isPermit(662)) {
		$('.icon_alarm_mask').css('display','inline-block');
//	};
	//加载完成
	$('body').flexShowLoading(false);
}

function loadLang() {
	$('#vehiIdnoOnTree').attr('placeholder',parent.lang.monitor_searchDevice);
	$('#gps_line_title').text(parent.lang.monitor_lineMonitor);
	$('#gps_monitor_title').text(parent.lang.monitor_gpsMonitor);
	$('#gps_alarm_title').text(parent.lang.monitor_alarmInfo);
	$('#gps_mediaFiles_title').text(parent.lang.monitor_mediaFiles);
	$('#gps_system_title').text(parent.lang.monitor_systemEvent);
//	$('#gps-status .status-monitor .status-title').text(parent.lang.monitor_labelMonitor);
//	$('#gps-status .status-online .status-title').text(parent.lang.monitor_labelOnline);
//	$('#gps-status .status-alarm .status-title').text(parent.lang.monitor_labelAlarm);
//	$('#gps-status .status-offline .status-title').text(parent.lang.monitor_labelOffline);
//	$('#gps-status .status-parking .status-title').text(parent.lang.monitor_labelParking);
//	$('#gps-status .status-parked .status-title').text(parent.lang.monitor_labelParked);
//	$('#gps-status .status-invalid .status-title').text(parent.lang.monitor_labelInvalid);
	
	$('#gps-storage .storage-alarm .status-title').text(parent.lang.monitor_labelStorageAlarm);
	$('#gps-storage .storage-online .status-title').text(parent.lang.monitor_labelStorageOnline);
	$('#gps-storage .storage-damage .status-title').text(parent.lang.monitor_labelStorageDamage);
	$('#gps-storage .storage-all .status-title').text(parent.lang.monitor_labelStorageAll);
	$('#gps-storage .storage-onlinerates .status-title').text(parent.lang.monitor_labelStorageOnlineRates);
	$('#gps-storage .storage-damagerates .status-title').text(parent.lang.monitor_labelStorageDamageRates);
	
	$('.onlineMarkSpan').text(parent.lang.monitor_vehicle_online);
	$('.alarmMarkSpan').text(parent.lang.monitor_vehicle_alarm);
	$('.offlineMarkSpan').text(parent.lang.monitor_vehicle_offline);
	$('.parkingMarkSpan').text(parent.lang.monitor_vehicle_parking);
	$('.parkedMarkSpan').text(parent.lang.monitor_vehicle_parked);
	$('.invalidMarkSpan').text(parent.lang.monitor_vehicle_invalid);
}

function loadPageInfo() {
	 //pz是车辆列表工具栏的左边参数操作按钮，dh_tips是车辆列表工具栏右边的提示按钮
	 $(".pz,.dh_tips").hover(
	 	function(){
			$(this).find("ul").show();
			},
		function(){
			$(this).find("ul").hide();
	 });
	//so是车辆列表工具栏的搜索弹出框
	 $(".so").hover(
	 	function(){
			$(this).find(".so_box").show();
			},
		function(){
			$(this).find(".so_box").hide();
	});
	//pro_list 车辆列表
	//d_main 主界面
	//slider_btn 车辆列表的展开和伸缩按钮
	//左侧隐藏显示
	$(".slider_btn").click(function(){
		if( (typeof($(".slider_btn").attr("rel"))=="undefined") ){
			$(".pro_list").css("left","-262px");	
			$(".d_main").css("marginLeft","0");
			$(".slider_btn").attr("rel","1");
			$(this).find("i").removeClass("icon_side").addClass("icon_side_right");
		}else{
			$(".pro_list").css("left","0px");
			$(".d_main").css("marginLeft","262px");
			$(".slider_btn").removeAttr("rel");
			$(this).find("i").removeClass("icon_side_right").addClass("icon_side");
		}
	});
	$(".slider_btn").attr("display","none");
	//$('.slider_btn').removeClass("show").addClass("hide");
	//slider_btn_right 视频界面的展开和收缩按钮
	//dm_map 地图窗口
	//dm_video 视频窗口
	//右侧隐藏显示
	$(".slider_btn_right").click(function(){
		if( (typeof($(".slider_btn_right").attr("rel"))=="undefined") ){
			var right = (mapWidth * -1 );
			$(".dm_map").css("right", right + "px");
			$(".dm_video").css("marginRight","0");
			$(".slider_btn_right").attr("rel","1");
			$(this).find("i").removeClass("icon_side_right").addClass("icon_side_left");
		}else{
			$(".dm_map").css("right","0px");
			$(".dm_video").css("marginRight", mapWidth + "px");
			$(".slider_btn_right").removeAttr("rel");
			$(this).find("i").removeClass("icon_side_left").addClass("icon_side_right");
		}
	});
	//位置定位拖动高度
    $(".map_drag_box").mousedown(function(e){
        src_posi_Y = e.pageY;
        is_mouse_down = true;
        $('#mapMoveDiv').show();
    });
    $(document).bind("click mouseup",function(e){
    	ttxMapDocumentMouseClick();
    }).mousemove(function(e){
    	ttxMapDocumentMouseMove(e);
    });
	//列表缩小，放大
	$(".min_s").click(function(){
		$('.gps_box').show();
		if($(this).hasClass("icon_s")){
			$(".map_action").css("height",$(window).height() - 38 < 59 ? $(window).height() - 38 : 59);
			$(".dm_video").height($(window).height() - $('.map_action').height());
			$(".dm_map").height($(window).height() - $('.map_action').height());
			$(".dm_line").height($(window).height() - $('.map_action').height());
			$('.gps_box .flexigrid').each(function() {
				$(this).height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('#gps-storage').height());
				$(this).find(".bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .tDiv').height() - $('#gps-storage').height());
			});
			$(this).removeClass("icon_s").addClass("icon_s_re");
			$(".min_big").removeClass("icon_s_re").addClass("icon_big");
			setTooltip('.icon_s_re', parent.lang.window_windowing);
			setTooltip('.icon_big', parent.lang.window_maximize);
		}else{
			$(".map_action").css("height",$(window).height() - 38 > 260 ? 260 : $(window).height() - 38);
			$(".dm_video").height($(window).height() - $('.map_action').height());
			$(".dm_map").height($(window).height() - $('.map_action').height());
			$(".dm_line").height($(window).height() - $('.map_action').height());
			$('.gps_box .flexigrid').each(function() {
				$(this).height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('#gps-storage').height());
				$(this).find(".bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .tDiv').height() - $('#gps-storage').height());
			});
			$(this).removeClass("icon_s_re").addClass("icon_s");
			setTooltip('.icon_s', parent.lang.window_minimum);
		}
		$('#mapMoveDiv').css("height",$(".map_action").height());
		$('#mapMoveDiv').css("top",$(window).height() - $(".map_action").height());
		fixHeight();
	});
	//列表最大化
	$(".min_big").click(function(){
		$('.gps_box').show();
		if($(this).hasClass("icon_s_re")){
			$(".map_action").css("height",$(window).height() - 38 > 260 ? 260 : $(window).height() - 38);
			$(".dm_video").height($(window).height() - $('.map_action').height());
			$(".dm_map").height($(window).height() - $('.map_action').height());
			$(".dm_line").height($(window).height() - $('.map_action').height());
			$('.gps_box .flexigrid').each(function() {
				$(this).height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('#gps-storage').height());
				$(this).find(".bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .tDiv').height() - $('#gps-storage').height());
			});
			$(this).removeClass("icon_s_re").addClass("icon_big");
			$(".min_s").removeClass("icon_s_re").addClass("icon_s");
			setTooltip('.icon_big', parent.lang.window_maximize);
		}else {
			$(".map_action").css("height",$(window).height());
			$(".dm_video").height($(window).height() - $('.map_action').height());
			$(".dm_map").height($(window).height() - $('.map_action').height());
			$(".dm_line").height($(window).height() - $('.map_action').height());
			$('.gps_box .flexigrid').each(function() {
				$(this).height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('#gps-storage').height());
				$(this).find(".bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .tDiv').height() - $('#gps-storage').height());
			});
			$(".min_s").removeClass("icon_s_re").addClass("icon_s");
			$(this).removeClass("icon_big").addClass("icon_s_re");
			setTooltip('.icon_s_re', parent.lang.window_windowing);
		}
		setTooltip('.icon_s', parent.lang.window_minimum);
		$('#mapMoveDiv').css("height",$(".map_action").height());
		$('#mapMoveDiv').css("top",$(window).height() - $(".map_action").height());
		fixHeight();
	});
	
	setTooltip('.icon_s', parent.lang.window_minimum);
	setTooltip('.icon_s_re', parent.lang.window_windowing);
	setTooltip('.icon_big', parent.lang.window_maximize);
	setTooltip('.icon_alarm_linkage', parent.lang.monitor_alarm_linkage);
	setTooltip('.icon_alarm_mask', parent.lang.monitor_alarm_shield);
	
	//在树列表查询车辆
	$("#vehiIdnoOnTree").on('keyup', findVehicleByTree);
	
	//切换事件列表
	$(".map_action .map_tab li").click(function(){
		var _index2 = $(this).index();
		if($(this).attr('id') != 'gps-export' && $(this).attr('id') != 'gps-status' && $(this).attr('id') != 'gps-storage') {
			$('.gps_box').show();
			$(this).addClass("active").siblings().removeClass("active");
			$(".gps_box li").eq(_index2).addClass("active").siblings().removeClass("active");
			$(".gps_box li").eq(_index2).find('.bDiv').height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .tDiv').height() - $('#gps-storage').height());
			$(this).find('a').css('background-color','#fff');
			if($(".min_big").hasClass("icon_big") && $(".min_s").hasClass("icon_s_re")) {
				$('.min_s').click();
			}
		}
	});
	
	//点击监控参数弹出存储介质等报表
	$('#gps-storage').on('click', queryStorage);
	
	//点击设置报警联动
	$('.icon_alarm_linkage').on('click',setAlarmLinkage);
	
	//点击设置报警屏蔽
	$('.icon_alarm_mask').on('click',setAlarmShielded);
	
	//禁止系统右键
	disableSysRight('body',true);
	//获取设置定损时长
	damageTime = Number($.cookie(DEF_DAMAGE_TIME));
	if(isNaN(damageTime) || damageTime < 24 || damageTime > 240) {
		damageTime = 72;
	}
}

//保存定损时长
function setDamageTime(value) {
	$.cookie(DEF_DAMAGE_TIME, value, { expires: 365 });
}

function countGroupVehiOnline(treeGroupId) {
	var items = vehiTree.getSubItems(treeGroupId);
	var data = {};
	data.count = 0;
	data.onlineCount = 0;
	
	if(items != null && items != '') {
		var itemIds = items.split(',');
		for (var j = 0; j < itemIds.length; j++) {
			if (vehiTree.isChannelItem(itemIds[j])) {
				continue;
			}
			if(!vehiTree.isGroupItem(itemIds[j]) && itemIds[j] != '') {
				data.count++;
				var vehicle = parent.vehicleManager.getVehicle(itemIds[j]);
				if(vehicle.isOnline()) {
					data.onlineCount++;
				}
			} else {
				var sum = countGroupVehiOnline(itemIds[j]);
				data.count += sum.count;
				data.onlineCount += sum.onlineCount;
			}
		}
	}
	
	if (treeGroupId == vehiTree.getMyRootItemId()) {
		var newName = parent.lang.all_vehicles + '&nbsp;&nbsp;('+ data.onlineCount + '/' + data.count +')';
		vehiTree.setItemText(treeGroupId, newName, vehiTree.getItemTooltip(treeGroupId));
	} else {
		var team = parent.vehicleManager.getTeam(vehiTree.getVehiGroupId(treeGroupId));
		if (team != null) {
			var newName = team.getName() + '&nbsp;&nbsp;('+ data.onlineCount + '/' + data.count +')';
			vehiTree.setItemText(treeGroupId, newName, vehiTree.getItemTooltip(treeGroupId));
		}
	}
	return data;
}

function countGroupVehiOnlineEx() {
	var sid = getCompanySid();
	var teams = [];
	if(parent.myUserRole.isAdmin()) {
		var teams_ = parent.vehicleManager.getAllVehiTeam();
		if(teams_) {
			for (var i = 0; i < teams_.length; i++) {
				if(teams_[i].parentId == sid) {
					teams.push(teams_[i].id);
				}
			}
		}
	}else {
		teams.push(sid);
	}
	var data = {};
	data.count = 0;
	data.onlineCount = 0;
	for (var i = 0; i < teams.length; i++) {
		var sum = countGroupVehiOnlineExResult(teams[i]);
		if(parent.myUserRole.isAdmin()) {
			data.onlineCount += sum.onlineCount;
			data.count += sum.count;
		}
	}
	if(parent.myUserRole.isAdmin()) {
		var treeGroupId = vehiTree.getTreeGroupId(sid);
		var newName = parent.lang.all_vehicles + '&nbsp;&nbsp;('+ data.onlineCount + '/' + data.count +')';
		vehiTree.setItemText(treeGroupId, newName, vehiTree.getItemTooltip(treeGroupId));
	}
}

function countGroupVehiOnlineExResult(sid) {
	var data = {};
	data.count = 0;
	data.onlineCount = 0;
	data.offlineCount = 0;
	if(sid) {
		var team = parent.vehicleManager.getTeam(sid);
		if(team) {
			if(team.getOnlineVehiIdnos()) {
				data.onlineCount = team.getOnlineVehiIdnos().length;
			}
			if(team.getOfflineVehiIdnos()) {
				data.offlineCount = team.getOfflineVehiIdnos().length;
			}
			data.count = data.onlineCount + data.offlineCount;
			
			var childTeams = team.getChildTeams();
			if(childTeams && childTeams.length > 0) {
				for (var i = 0; i < childTeams.length; i++) {
					var sum = countGroupVehiOnlineExResult(childTeams[i]);
					data.onlineCount += sum.onlineCount;
					data.count += sum.count;
				}
			}
			
			var treeGroupId = vehiTree.getTreeGroupId(sid);
			var newName = team.getName() + '&nbsp;&nbsp;('+ data.onlineCount + '/' + data.count +')';
			vehiTree.setItemText(treeGroupId, newName, vehiTree.getItemTooltip(treeGroupId));
		}
	}
	return data;
}

/*
 * 获取公司父结点id
 */
function getCompanySid() {
	var sid = parent.companyId;
	return sid;
}

/*
 * 加载车辆树
 */
function loadVehiTree() {
	$('.pro_list').flexShowLoading(true);
	if(parent.isLoadVehiList && parent.isLoadPermitVehiGroupList) {
		
		//公交线路
		if(parent.myUserRole.isManageLine()) {
			//将所有线路加入线路列表
			monitorLine.loadLineToTable();
		}
		
		//加载完车辆信息，才启动定时器进行刷新车辆状态和报警数据
		monitorAlarm.runAlarmTimer();
		
		$("#vehicle_tree").hide();
		//加载车辆树
		vehiTree = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
		vehiTree.setImagePath("../../js/dxtree/imgs/");
//		vehiTree.enableDragAndDrop(true);
//		vehiTree.setDragHandler(doDragItem);
		vehiTree.enableCheckBoxes(1);
		vehiTree.enableThreeStateCheckboxes(true);
		vehiTree.setOnDblClickHandler(doDbClickTreeVehi); //双击事件
		vehiTree.setOnCheckHandler(doCheckTreeVehi); //选中事件
		vehiTree.setOnClickHandler(doClickTreeVehi); //单击事件
		
		vehiTree.setOnRightClickHandler(rightClickHandlerOnTree);//右键事件
        
		var sid = getCompanySid();
		//动态进行加载车辆列表，避免车辆太多时，造成的页面卡住的问题
		//如果车辆大于1000辆，则加载1000辆，后续点击公司再加载
		if(parent.vehicleList && parent.vehicleList.length > 500) {
			isExistOpenEndHandler = true;
			//加载公司
			vehiTree.fillGroup(parent.vehicleManager.getAllVehiTeam(), sid, parent.lang.all_vehicles, true);
			
			vehiTree.setOnOpenEndHandler(doOpenOrCloseTree); //节点展开/合拢结束事件
			vehiTree.closeAllItems();
			vehiTree.setVehicleList([], true);
		}else {
			//加载公司
			vehiTree.fillGroup(parent.vehicleManager.getAllVehiTeam(), sid, parent.lang.all_vehicles, false);
			
			vehiTree.setVehicleList(parent.vehicleManager.getAllVehicle(), true);
		}
		//每次只加载500毫秒的时间，超过了，则开启另外个定时器，避免界面挂住的情况
		dynamicLoadVehicle();
	}else {
		setTimeout(loadVehiTree,50);
	}
}

//车辆树的右键点击事件
function rightClickHandlerOnTree(itemId) {
	//选中
	vehiTree.selectItem(itemId);
	vehiTree.focusItem(itemId);
	//菜单
	monitorMenu.rightClickHandlerOnTree(itemId);
	////初始化设备信息
	updatePaneVehicleInfo(itemId);
}

function dynamicLoadVehicle() {
	if (!vehiTree.dynamicLoadVehicle()) {
		setTimeout(dynamicLoadVehicle, 80);
	} else {
		//计算数目
//		var sid = getCompanySid();
//		countGroupVehiOnline(vehiTree.getTreeGroupId(sid));
		countGroupVehiOnlineEx();
		//初始化车辆设备数目
		monitorStatus.initVehicleStatusCount();
		//车辆信息加载成功后，才启动定时器刷新车辆状态
		monitorStatus.runStatusTimer();
		
		//
		$("#vehicle_tree").show();
		
		//初始化监控树右键菜单
		monitorMenu.initialize();
		//添加监控树右键菜单
		if(!isExistOpenEndHandler) {
			monitorMenu.addVehicleMenu(vehiTree.loadVehiIdnos.toString());
			monitorMenu.addChannelMenu(vehiTree.channelIndex.toString());
		}
		
		//加载完成
		$('.pro_list').flexShowLoading(false);
	}
}

/*
 * 选中车辆事件
 */
function doCheckTreeVehi(itemId,check) {
	monitorStatus.doCheckVehi(itemId, check);
}

/*
 * 点击车辆转换到车辆所在位置
 */
function doClickTreeVehi() {
	var selId = vehiTree.getSelectedItemId();
	if (selId != null && selId != "") {
		if (vehiTree.isChannelItem(selId)) {
			var vehiId = vehiTree.getChannelVehiIdno(selId);
			//车辆加载到地图上，也会加载到列表中
			var isShowMap = monitorStatus.findMonitorVehicle(vehiId);
			monitorStatus.selectVehicle(vehiId, false, isShowMap, isShowMap);
			if(!isShowMap) {
				updatePaneVehicleInfo(vehiId);
			}
		} else if (vehiTree.isVehicleItem(selId)) {
			//单击车辆结点时，不展开，afu 150628
			//vehiTree.closeAllItems();
			//vehiTree.openItem(selId);
			var isShowMap = monitorStatus.findMonitorVehicle(selId);
			monitorStatus.selectVehicle(selId, false, isShowMap, isShowMap);
			if(!isShowMap) {
				updatePaneVehicleInfo(selId);
			}
		}else {
			vehiTree.openItem(selId);
			monitorStatus.selectedVehiIdno = '';
			updatePaneVehicleInfo(selId);
		}
	}
}

function dynamicLoadVehicleEx(func) {
	if (!vehiTree.dynamicLoadVehicleEx()) {
		setTimeout(function() {
			dynamicLoadVehicleEx(func);
		}, 80);
	} else {
		//添加监控树右键菜单
		monitorMenu.addVehicleMenu(vehiTree.loadVehiIdnos.toString());
		monitorMenu.addChannelMenu(vehiTree.channelIndex.toString());
		//加载完成
		$('.pro_list').flexShowLoading(false);
		if(typeof func == 'function') {
			func();
		}
	}
}

//节点展开/合拢结束事件
function doOpenOrCloseTree(itemId,check) {
	if(check == 1) {
		//如果是分组节点
		if(vehiTree.isGroupItem(itemId)) {
			loadTeamTree(vehiTree.getVehiGroupId(itemId));
		}
	}else {
//		alert(11+','+itemId);
//		alert(vehiTree.isGroupItem(itemId));
	}
//	if(check == -1) {
//		//不是车辆则先关闭所有节点
//		if(!vehiTree.isVehicleItem(itemId)) {
//			vehiTree.closeAllItems();
//		}
//		//不是根节点就打开父节点
//		if(!vehiTree.isRootItem(itemId)) {
//			vehiTree.openItem(vehiTree.getParentId(itemId));
//		}
//	}
}

function loadTeamTree(teamId, func) {
	var team_ = parent.vehicleManager.getTeam(teamId);
	//如果没有加载，则加载  //存在树列表点击打开菜单事件
	if(team_ && !team_.isLoadSuccess() && isExistOpenEndHandler) {
		$('.pro_list').flexShowLoading(true);
		if(!team_.getChildTeams()) {
//			vehiTree.deleteItem(vehiTree.getTreeGroupId(parseInt(teamId,10)+10000), vehiTree.getTreeGroupId(teamId));
			vehiTree.deleteChildItems(vehiTree.getTreeGroupId(teamId));
		}
		team_.setLoadSuccess(true);
		var online_ = team_.getOnlineVehiIdnos();
		var offline_ = team_.getOfflineVehiIdnos();
		var vehiIdnos = [];
		if(online_) {
			vehiIdnos = online_;
		}
		if(offline_) {
			vehiIdnos = vehiIdnos.concat(offline_);
		}
		if(vehiIdnos && vehiIdnos.length > 0) {
			vehiTree.setVehicleList(vehiIdnos, true);
			dynamicLoadVehicleEx(func);
		}else {
			if(typeof func == 'function') {
				func();
			}
			$('.pro_list').flexShowLoading(false);
		}
	}else {
		if(typeof func == 'function') {
			func();
		}
	}
}

/*
 * 树列表搜索车辆
 * @param idno
 */
function addVehicleByTree(idno) {
	if(!vehiTree.isItemChecked(idno)) {
		//如果没有添加到树列表则添加
		var vehicle = parent.vehicleManager.getVehicle(idno);
		if(vehicle) {
			loadTeamTree(vehicle.getParentId(), function() {
				vehiTree.selectItem(idno);
				vehiTree.focusItem(idno);
				vehiTree.setCheck(idno, true);
				monitorStatus.doCheckVehi(idno, true);
			});
		}
		//要去订阅报警信息
	//	monitorAlarm.flashVehicleAlarm();
	}else {
		monitorStatus.selectVehicle(idno, true, true, true);
	}
}

/*
 * 搜索车辆树上的车辆
 */
function findVehicleByTree() {
	setTimeout(function() {
		$('#so_tree_vehiList ul').empty();
		$('#so_tree_vehiList').css('border','0 none');
		$('#so_tree_vehiList').css('height','auto');
		var name = $.trim($("#vehiIdnoOnTree").val());
		if (name != "" && parent.isLoadVehiList) {
			searchVehicleOnMap(name);
		} 
	}, 200);
}

/*
* 在地图上查找车辆
*/
function searchVehicleOnMap(name) {
	var index = 0;
	var tree_vehiList = document.getElementById('so_tree_vehiList');
	var isTop = false;
	parent.vehicleManager.mapVehiList.each(function(key,value){
		if(!isTop) {
			var flag = true;
			if(value.getIdno().indexOfNotCase(name) >= 0) {
				$('ul', tree_vehiList).append('<li data-id= "'+key+'">'+key+'</li>');
				flag = false;
				index++;
			}
			if(flag) {
				var devList = value.getDevList();
				if(devList != null && devList.length > 0) {
					for (var i = 0; i < devList.length; i++) {
						var device = devList[i];
						if(flag && device.getIdno().indexOfNotCase(name) >= 0) {
							$('ul', tree_vehiList).append('<li data-id= "'+key+'">'+key+'</li>');
							flag = false;
							index++;
						}
						if(flag && device.getSimCard() != null && device.getSimCard().indexOfNotCase(name) >= 0) {
							$('ul', tree_vehiList).append('<li data-id= "'+key+'">'+key+'</li>');
							flag = false;
							index++;
						}
					}
				}
			}
			if(flag && value.getDriverName() != null && value.getDriverName().indexOfNotCase(name) >= 0) {
				$('ul', tree_vehiList).append('<li data-id= "'+key+'">'+key+'</li>');
				flag = false;
				index++;
			}
			if(index >= 100) {
				isTop = true;
			}
		}
	});
	if(index > 0) {
		$(tree_vehiList).css('border','1px solid #d6d6d6');
		$('li', tree_vehiList).each(function() {
			$(this).on('click',function() {
				addVehicleByTree($(this).attr('data-id'));
			});	
		});
	}
	if(index > 7) {
		$(tree_vehiList).height(200);
	}
}

function fixHeight() {
	$('#alarmTable').flexFixHeight();
	$('#gpsMonitorTable').flexFixHeight();
	$('#mediaFilesTable').flexFixHeight();
	$('#serverEventTable').flexFixHeight();
}

/*
 *设置页面大小
 */
function setPanelWidth(callBackFun) {
	//地图高度不能超出
	var _height = $(window).height();
	$(".pro_list").height(_height);			//左边面板
	paneInfo.resizeVehiTree();	//车辆列表和信息面板
	//$("#vehicle_tree").height(_height - $('.pro_list .dh').height() - $('.tab_state').height());	//车辆列表
	$(".d_main").height(_height);		//主界面
	//事件栏
//	$(".flexigrid .bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.flexigrid .hDiv').height());
	if($(".min_s").hasClass("icon_s")){
		$(".map_action").css("height",_height - 38 > 260 ? 260 : _height - 38);
	}else {
		$(".map_action").css("height", $(".map_action").height() > _height - 59 ?   _height - 59 : $(".map_action").height());
		$(".map_action").css("height", $(".map_action").height() < 59 ? 59 : $(".map_action").height());
	}
	if($(".min_big").hasClass("icon_s_re")){
		$(".map_action").css("height",_height);
	}else {
		$(".map_action").css("height", $(".map_action").height() > _height - 59 ?   _height - 59 : $(".map_action").height());
		$(".map_action").css("height", $(".map_action").height() < 59 ? 59 : $(".map_action").height());
	}
	$('#mapMoveDiv').css("height",$(".map_action").height());
	$('#mapMoveDiv').css("top",$(window).height() - $(".map_action").height());
	$(".dm_video").height(_height - $('.map_action').height());	//视频界面
	$(".dm_map").height(_height - $('.map_action').height());	//地图界面
	$(".dm_line").height(_height - $('.map_action').height()); //线路监控界面
	$('.gps_box .flexigrid').each(function() {
		$(this).height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('#gps-storage').height());
		$(this).find(".bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .tDiv').height() - $('#gps-storage').height());
	});
	if (typeof callBackFun == "function") {
		callBackFun();
	}
}

function showMonitorPage(name) {
	var _width = $(window).width();
	//左边 262
	//视频和地图按比例进行显示 
	mapWidth = (_width - $(".pro_list").width()) * 25 / 100;
	if (mapWidth < 300) {
		mapWidth = 300;
	} else if (mapWidth > 600) {
		mapWidth = 600;
	}
	mapWidth = parseInt(mapWidth, 10);
	currentPage = name;
	if(name == 'weizhi') {
		$('.dm_line').hide();
		
		$('.dm_video').css("position","absolute");
		$('.dm_video').css("left","-9999px");
	
		$('.dm_map').css("width","auto");
		$('.dm_map').css("position","relative");
		$('.dm_map').css("right","0px");
		
		if (ttxMap != null) {
			ttxMap.hideToolbar(false);
		}
		if(paneInfo != null){
			paneInfo.setPTZcolorButtonStatus(true);
		}
		//$('.slider_btn_right').removeClass("show").addClass("hide");
	}else if(name == 'shipin') {
		$('.dm_line').hide();
		
		$('.dm_map').css("width", mapWidth + "px");
		$('.dm_map').css("position","absolute");
		$('.dm_map').css("right","0px");
		
		$('.dm_video').css("position","relative");
		$('.dm_video').css("left","0px");
		$(".dm_video").css("marginRight", mapWidth + "px");
		
		if (ttxMap != null) {
			ttxMap.hideToolbar(true);
		}
		if(paneInfo != null){
			paneInfo.setButtonForPtzColor();
		}
		//$('.slider_btn_right').removeClass("hide").addClass("show");
		//$(".slider_btn_right").removeAttr("rel");
		//$(".slider_btn_right i").removeClass("icon_side_left").addClass("icon_side_right");
	}else if(name == 'xianlu') {
		$('.dm_map').css("position","absolute");
		$('.dm_map').css("right","-9999px");
		
		$('.dm_video').css("position","absolute");
		$('.dm_video').css("left","-9999px");
		
		$('.dm_line').show();
		
		if (ttxMap != null) {
			ttxMap.hideToolbar(true);
		}
		if(paneInfo != null){
			paneInfo.setButtonForPtzColor();
		}
	}
}

function doDbClickTreeVehi(item) {
	//如果视频窗口没展现，则不响应
	/*if (currentPage == "weizhi") {
		return ;
	}*/
	
	//双击启动视频预览
	if (vehiTree.isChannelItem(item)) {
		//视频权限
		if(parent.myUserRole.isPermit(621)) {
			var channel = vehiTree.getChannelIndex(item);
			previewVideo(vehiTree.getChannelVehiIdno(item), channel);
		}else {
			alert(parent.lang.errNoPrivilige);
		}
	} else if (vehiTree.isVehicleItem(item)) {
		//视频权限
		if(parent.myUserRole.isPermit(621)) {
			previewVideo(item, -1);
		}else {
			alert(parent.lang.errNoPrivilige);
		}
	}else {
		updatePaneVehicleInfo(item);
	}
}

////初始化设备信息
function updatePaneVehicleInfo(item){
	if(vehiTree.isChannelItem(item) || vehiTree.isVehicleItem(item)){
		var vehiIdno = null;
		if(vehiTree.isChannelItem(item)){
			vehiIdno = vehiTree.getChannelVehiIdno(item);
		}else{
			vehiIdno = item;
		}
		paneInfo.initPaneDevice(vehiIdno);
	}else{
		paneInfo.initPaneDevice();
	}
}

function initTtxVideo() {
	ttxVideo = new TtxVideo("framePreview");
	if(ttxVideo != null) {
		ttxVideo.initialize(ttxVideoLoadSuc);
	}
}

//视频加载成功后的回调
function ttxVideoLoadSuc() {
	if(ttxVideo == null) {
		return;
	}
	ttxVideo.disableSysRight('.map_btn',true);
}

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
	ttxMap.enableMyMap(true);
	if(currentPage == 'weizhi') {
		ttxMap.hideToolbar(false);
	} else {
		ttxMap.hideToolbar(true);
	}
	ttxMap.disableSysRight('body',true);
	//初始化地图点聚合参数
	monitorMapTip.loadMarkerClusterParam(true);
	
	//进行添加车辆到地图上的操作
	if(monitorStatus.mapVehicleList != null && monitorStatus.mapVehicleList.size() > 0) {
		monitorStatus.fillVehi2Map();
	}
	//拉框查找车辆的区域标记
	var marker = ttxMap.findMarker(rectangleMarkId);
	if(marker == null && rectangleMark != null) {
		var lngs = rectangleMark.jindu.split(',');
		var lats = rectangleMark.weidu.split(',');
		var gps1 = convertBaiduGoogle(lats[0], lngs[0], parent.toMap);
		rectangleMark.jindu = gps1.lng;
		rectangleMark.weidu = gps1.lat;
		var gps2 = convertBaiduGoogle(lats[1], lngs[1], parent.toMap);
		rectangleMark.jindu += ',' +  gps2.lng;
		rectangleMark.weidu += ',' +  gps2.lat;
		addVehicleRectangleMarker(rectangleMark.id,rectangleMark.name,rectangleMark.jindu,rectangleMark.weidu);
	}
}

/*
 * 处理地图全屏
*/
function ttxMapFullScreen(isFull) {
	fullMapScreen();
}

function ttxMapDocumentMouseClick() {
	if(is_mouse_down){
		$('.gps_box').show();
        is_mouse_down = false;
        $(".dm_video").css("height", mapHeight);
		$(".dm_map").css("height", mapHeight);
		$(".dm_line").css("height", mapHeight);
		
		$(".map_action").css("height", $('#mapMoveDiv').height());
		if(mapHeight <= 38) {
			$(".min_s").removeClass("icon_s_re").addClass("icon_s");
			$(".min_big").removeClass("icon_big").addClass("icon_s_re");
			setTooltip('.icon_s', parent.lang.window_minimum);
			setTooltip('.icon_s_re', parent.lang.window_windowing);
			$(".dm_video").css("height", 0);
			$(".dm_map").css("height", 0);
			$(".dm_line").css("height", 0);
			$(".map_action").css("height",$(window).height());
		}
		
		if(destHeight <= 59) {
			$(".min_s").removeClass("icon_s").addClass("icon_s_re");
			$(".min_big").removeClass("icon_s_re").addClass("icon_big");
			setTooltip('.icon_s_re', parent.lang.window_windowing);
			setTooltip('.icon_big', parent.lang.window_maximize);
		}
		$('.gps_box .flexigrid').each(function() {
			$(this).height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('#gps-storage').height());
			$(this).find(".bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.gps_box .active .flexigrid .hDiv').height() - $('.gps_box .active .flexigrid .tDiv').height() - $('#gps-storage').height());
		});
		$("#mapMoveDiv").css("height", $('.map_action').height());
		$('#mapMoveDiv').css("top",$(window).height() - $('#mapMoveDiv').height());
		$('#mapMoveDiv').hide();
		
		fixHeight();
	}
}

function ttxMapDocumentMouseMove(e) {
	if(is_mouse_down){
		$('.gps_box').show();
		dest_posi_Y = e.pageY;
		move_Y = src_posi_Y - dest_posi_Y;
		src_posi_Y = dest_posi_Y;

		destHeight = $("#mapMoveDiv").height() + move_Y;
    	mapHeight = $(window).height() - destHeight;
		
		if (mapHeight < 2 || destHeight < 59) {
		} else {
			if($(".min_big").hasClass("icon_s_re")){
				$('#mapMoveDiv').css("height", destHeight > $(window).height() ? $(window).height() : destHeight);
			}else {
				$('#mapMoveDiv').css("height",destHeight > $(window).height() - 38 ? $(window).height() - 38 : destHeight);
			}
			
			$('#mapMoveDiv').css("top",$(window).height() - $('#mapMoveDiv').height());
		}
		fixHeight();
	}
}

/*
 * 重新加载地图
 */
function ttxMapReload() {
	monitorStatus.preFillVehi2Map(function() {
		$('#frameMap').attr('src', $('#frameMap').attr('src'));
		if(ttxMap != null) {
			//ttxMap.doReload();
			ttxMap.initialize(function() {
				setTimeout(ttxMapLoadSuc, 5000);
			});
		}
	});
}

/**
 * 地图上车辆Tip进行操作
 * @param vehiIdno  车牌号
 * @param menuId  菜单Id
 * @param popId  子菜单Id
 */
function ttxMapClickmenuitem(vehiIdno, menuId, popId) {
	monitorMapTip.ttxMapClickmenuitem(vehiIdno, menuId, popId);
}

/*
 * 地图上进行画线等操作
 */
function ttxMapDrawMarker(type, jingdu, weidu, param) {
	/*#define MAP_MARKER_TYPE_POINT			1		//自定义点
	#define MAP_MARKER_TYPE_RECTANGLE		2		//矩形
	#define MAP_MARKER_TYPE_POLYGON			3		//多边形
	#define MAP_MARKER_TYPE_SEARCH			4		//搜索车辆(矩形，param=1表示查找当前车辆，param=2表示查找历史车辆)
	#define MAP_MARKER_TYPE_FULLSCREEN		5		//全屏显示
	#define MAP_MARKER_TYPE_EXPAND			6		//扩展、收缩
	#define MAP_MARKER_TYPE_CENTER			7		//配置中心点，经度 +　纬度　＋　级别
	#define MAP_MARKER_TYPE_SWITCH_MAP		8		//切换地图，地图类型MAP_TYPE_GOOGLE, MAP_TYPE_MAPINFO, MAP_TYPE_BAIDU
	#define MAP_MARKER_TYPE_LINE			9		//画线路
	#define MAP_MARKER_TYPE_CIRCLE			10		//圆形
	#define	MAP_MARKER_TYPE_DISTANCE		11		//测距
	#define MAP_MARKER_TYPE_ZOOMIN			12		//拉框放大
	#define	MAP_MARKER_TYPE_ZOOMOUT		13		//拉框缩小
	#define MAP_MARKER_TYPE_CRUISE			14		//漫游
	#define	MAP_MARKER_TYPE_COUNTRY		15		//全国
	#define MAP_MARKER_TYPE_AREA			16		//测量面积
	#define	MAP_MARKER_TYPE_PRINT		17		//打印
	#define MAP_MARKER_TYPE_CAPTURE		18		//截图 */
	
	//alert(type + " - " + jingdu + " - " + weidu + " - " + param);
	if (type == 4) {
		if (param == 1) {
			//查找当前车辆 
			searchVehicleByRectangle(jingdu, weidu, param);
		} else {
			//查找历史车辆
			searchVehicleByRectangle(jingdu, weidu, param);
		}
		//alert(ttxMap.isPointInRect("113.23", "23.43", jingdu, weidu));
	} else if(type == 1 || type == 2 || type == 3 || type == 9 || type == 10){
		//地图上画图操作
	}
}

function ttxPlayerDocumentMouseClick() {
	ttxMapDocumentMouseClick();
//	ttxMap.geocoderAddress("12341324", "113.1234", "23.132412", function(key, jingdu, weidu, address, city) {
//		alert(key + " - " + jingdu + " - " + weidu + " - " + address + " - " + city);
//	});
}

//切换地理位置坐标
function changeMapAddress(obj, jingDu, weiDu, vehiIdno) {
	var position1 = $.trim($(obj).attr('data-position'));
	var position2 = $.trim($(obj).html());
	$(obj).attr('data-position',position2);
	var dataType = $.trim($(obj).attr('data-type'));
	if(dataType == '1') {//点击GPS监控列表
		monitorStatus.isClickPosition = true;
	}
	if(position1 != null && position1 != '') {
		$(obj).html(position1);
		$(obj).attr('title',position1);
		if(dataType == '1') {//点击GPS监控列表
			paneInfo.switchPosition(position1, position2);
		}else if(dataType == '2') {//点击车辆信息
			monitorStatus.switchPosition(position1, position2, vehiIdno);
		}
	}else {
		if(ttxMap != null) {
			ttxMap.geocoderAddress(weiDu+','+jingDu, jingDu, weiDu, function(key, jingDu, weiDu, address, city) {
				$(obj).html(address);
				$(obj).attr('title',address);
				
				if(dataType == '1') {//点击GPS监控列表
					paneInfo.switchPosition(address, position2);
				}else if(dataType == '2') {//点击车辆信息
					monitorStatus.switchPosition(address, position2, vehiIdno);
				}
			});
		}
	}
}

function ttxPlayerDocumentMouseMove(e) {
	ttxMapDocumentMouseMove(e);
}

function ttxPlayerListenMsg(type) {
	paneInfo.onListenMsg(type);
}

function ttxPlayerTalkbackMsg(type) {
	paneInfo.onTalkbackMsg(type);
}

/**
 * 预览视频
 * @param vehiIdno  车牌号
 * @param channel   通道
 * @param stream    码流
 * @param viewCloseTime  关闭时间
 * @param armType  报警信息
 */
function previewVideo(vehiIdno, channel , stream, viewCloseTime, armType) {
	//500车 36画面卡死一个窗口需要 500ms+ 6s+
	//9画面 200ms+ 1000ms以下
//	loadConsoleTime(true, 'previewVideo');
	//如果视频窗口没展现，则跳转到视频窗口界面
	if (currentPage == "weizhi") {
		parent.switchTopMenuPage('shipin');
	//	showMonitorPage('shipin');
	}
	
	if(ttxVideo == null) {
		return;
	}
	
	//判断车辆是否存在
	var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
	if (vehicle == null) {
		return ;
	}
	
	//var stream = 1;		//默认预览子码流视频
	if(stream == null){
		var videoRequest = $.cookie(DEF_Request_Video);
		if(videoRequest != null){
			stream = videoRequest;
		}else{
			stream = 1;
		}
	}
	//判断视频设备
	var device = vehicle.getVideoDevice();
	if (device == null) {
		$.dialog.tips(parent.lang.gps_not_support_preview, 1);
//		alert(lang.gps_not_support_preview);	//不是视频设备不支持预览
		return ;
	} 
	if (!device.isOnline()) {
		$.dialog.tips(parent.lang.video_not_online_device, 1);
//		alert(lang.video_not_online_device);	//不是视频设备不支持预览
		return;
	}

	//判断设备使用流量是否已达上限
	if(vehicle.isOverFlowLimit()) {
		$.dialog.tips(parent.lang.flowDeviceUpperLimit, 1);
		return;
	}
	
	var devIdno = device.getIdno();
	var arrChn = [];
	var arrTitle = [];
	if (channel == -1) {
		//如果没有配置通道数目，则认为是通道1
		var count = device.getChnCount();
		if (count <= 0) {
			count = 1;
		}
		for (var i = 0; i < count; ++ i) {
			arrChn.push(i);
			arrTitle.push(vehicle.getName() + " - " + device.getSingleChnName(i));
		}
	} else {
		//判断通道是否在视频设备上
		if(vehicle.isChannelVideoDevice(channel)) {
			arrChn.push(channel);
			arrTitle.push(vehicle.getName() + " - " + device.getSingleChnName(channel));
		}else {
			$.dialog.tips(parent.lang.gps_not_support_preview, 1);
			//alert(lang.gps_not_support_preview);
			return;
		}
	}
	enableFocusTree = false;
	ttxVideo.previewVideo(devIdno, arrChn, stream, arrTitle, viewCloseTime, armType);
	enableFocusTree = true;
//	loadConsoleTime(false, 'previewVideo');
}

//视频窗口选中事件
function ttxPlayerViewSelect(devIdno, channel) {
	var vehicle = parent.vehicleManager.getVehiByDevIdno(devIdno);
	if (vehicle != null) {
		monitorStatus.selectVehicle(vehicle.getIdno(), false, true, true);
		if (enableFocusTree) {
			var device = parent.vehicleManager.getDevice(devIdno);
			if (device != null) {
				//如果没有通道结点，则选中车辆结点
				if (device.getChnCount() == 0) {
					//选中通道结点
					vehiTree.selectItem(vehicle.getIdno());
					vehiTree.focusItem(vehicle.getIdno());
				} else {
					var chnItem = vehiTree.getTreeChannelId(vehicle.getIdno(), channel);
					//选中通道结点
					vehiTree.selectItem(chnItem);
					vehiTree.focusItem(chnItem);
				}
			}
		}
	}
}

/**
 * 如果窗口没有设备信息，则不会调用此方法
 * 视频右键点击前事件（主要是生成视频右键菜单）
 * @param index 窗口下标
 * @param devIdno 设备号
 * @param chn 通道号
 * @param isPreview 是否正在预览
 */
function ttxVideoRightBeforeMsg(index, devIdno, chn, isPreview) {
	if(ttxVideo != null) {
		//添加菜单之前，清空菜单
		ttxVideo.clearVideoMenu(index);
		var vehicle = parent.vehicleManager.getVehiByDevIdno(devIdno);
		if(vehicle != null) {
			if(isPreview) {//如果正在预览
				//添加菜单1.停止预览2.停止所有通道视频3.预览所有通道视频
				ttxVideo.addVideoMenu(index, 'stopVideo', parent.lang.preview_stop_video, 1);
				ttxVideo.addVideoMenu(index, 'stopAllVideo', parent.lang.preview_stop_all_video, 1);
			}else {//如果停止预览
				//添加菜单1.预览所有通道视频
			}
			ttxVideo.addVideoMenu(index, 'startAllVideo', parent.lang.preview_start_all_video, 1);
			//监听 添加开始监听，停止监听
			if (vehicle.isMonitorSupport() && vehicle.getMonitorDevice().isOnline()) {
				if(paneInfo != null && (typeof paneInfo.isVehiListening) == 'function') {
					if (paneInfo.isVehiListening(vehicle.getName(), chn)){//如果窗口在监听
						ttxVideo.addVideoMenu(index, 'stopListen', parent.lang.stopMonitor, 1);
					} else {
						ttxVideo.addVideoMenu(index, 'startListen', parent.lang.startMonitor, 1);
					}
				}
			}
			//对讲 添加开始对讲，停止对讲 
			if (vehicle.isTalkbackSupport() && vehicle.getTalkbackDevice().isOnline()) {
				if(paneInfo != null && (typeof paneInfo.isVehiTalking) == 'function') {
					if (paneInfo.isVehiTalking(vehicle.getName())){//如果窗口在对讲
						ttxVideo.addVideoMenu(index, 'stopTalkback', parent.lang.stopTalkback, 1);
					} else {
						ttxVideo.addVideoMenu(index, 'startTalkback', parent.lang.startTalkback, 1);
					}
				}
			}
		}
	}
}

/**
 * 处理视频右键菜单点击事件
 * @param index
 * @param menuid
 * @param devIdno
 * @param chn
 */
function ttxVideoRightMenuClickMsg(index, menuId, devIdno, chn) {
	if(ttxVideo != null) {
		var vehicle = parent.vehicleManager.getVehiByDevIdno(devIdno);
		if(vehicle != null) {
			if(menuId == 'stopVideo') {//停止预览
				ttxVideo.stopIndexWindowPreview(index);
			} else if(menuId == 'stopAllVideo') {//停止所有通道视频
				if(monitorMenu != null && (typeof monitorMenu.stopAllVehiVideo) == 'function') {
					monitorMenu.stopAllVehiVideo(vehicle.getIdno().toString());
				}
			} else if(menuId == 'startAllVideo') {//预览所有通道视频
				previewVideo(vehicle.getIdno().toString(), -1);
			} else if(menuId == 'startListen' || menuId == 'stopListen') {//监听
				if(paneInfo != null && (typeof paneInfo.doListen) == 'function') {
					paneInfo.doListen(vehicle.getIdno().toString(), chn);
				}
			} else if(menuId == 'startTalkback' || menuId == 'stopTalkback') {//对讲
				if(paneInfo != null && (typeof paneInfo.doTalkback) == 'function') {
					paneInfo.doTalkback(vehicle.getIdno().toString());
				}
			} 
		}
	}
	
}

//拉框查找车辆的区域标记Id
var rectangleMark = null;
var rectangleMarkId = 900000000;

//弹出拉框查找车辆窗口对象
var selVehiRecObj = null;
/**
 * 画矩形查找车辆
 * param 1当前车辆  2历史车辆
 */
function searchVehicleByRectangle(jingdu,weidu,param) {
	var name = parent.lang.mapRectHisCar;
	var width = "800px", height = "400px";
	if(param == 1) {
		var flag = false;
		parent.vehicleManager.mapVehiList.each(function(key,value){
			var point = value.getMapLngLat();
			if(point != null && point.lng != null && point.lat != null && ttxMap != null && ttxMap.isPointInRect(point.lng,point.lat,jingdu,weidu)) {
				flag = true;
			}
		});
		if(!flag) {
			$.dialog.tips(parent.lang.tipNotExistsVehicle, 2);
			return;
		}
		name = parent.lang.mapRectMyCar;
	}else {
		width = "800px";
		height = "600px";
	}
	if(ttxMap != null) {
		addVehicleRectangleMarker(rectangleMarkId,name,jingdu,weidu);
	}
	var url = 'url:LocationManagement/vehicleList.html?type='+param+'&jingdu='+jingdu+'&weidu='+weidu;
	selVehiRecObj = $.dialog({id:'info', title: parent.lang.vehicle_information, content: url,
		width: '900px', height: '600px', min:true, max:false, lock:false,fixed:true, left:'0', top:'0'
			, resize:true, close: closeDelAllMarker });
	if(ttxMap != null) {
		ttxMap.enableSearchbox(false);
	}
	popTipsObject.put('info',selVehiRecObj);
	hidePopTips('info');
}

//关闭拉框查找车辆弹出框后执行
function closeDelAllMarker() {
	popTipsObject.remove('info');
	rectangleMark = null;
	if(ttxMap != null) {
		ttxMap.deleteMarker(rectangleMarkId);
		ttxMap.enableSearchbox(true);
	}
}

//拉框查找车辆时添加区域标记
function addVehicleRectangleMarker(index,name,jingdu,weidu) {
	var marker = ttxMap.findMarker(index);
	if(marker != null) {
		ttxMap.deleteMarker(index);
	}
	//加入
	ttxMap.insertMarker(index);
	ttxMap.updateMarker(index, 2,name, jingdu, weidu, '', '00FF00', '', '');
//	ttxMap.selectMarker(index);
	
	marker = ttxMap.findMarker(index);
	rectangleMark = marker;
}

//弹框对象
var storageListObj = null;
//点击监控参数弹出存储介质,离线设备,定损等报表
function queryStorage() {
	if(storageListObj == null) {
		storageListObj = $.dialog({id:'storageList', title: parent.lang.monitor_statusStatistical, content: 'url:LocationManagement/storageList.html',
		width: '800px', height: '400px', min:true, max:false, lock:false,fixed:true
			, resize:true, close: function() {
				storageListObj = null;
				popTipsObject.remove('storageList');
			} });
	}else {
		storageListObj.show();
	}
	popTipsObject.put('storageList', storageListObj);
	hidePopTips('storageList');
}

//弹框对象
var alarmLinkageObj = null;
//点击设置报警联动
function setAlarmLinkage() {
	if(alarmLinkageObj == null) {
		alarmLinkageObj = $.dialog({id:'alarmLinkage', title: parent.lang.monitor_alarm_linkage, content: 'url:LocationManagement/allAlarmLinkage.html',
				width: '800px', height: '500px', min:true, max:false, lock:false,fixed:false/*, left:'100%', top:'0'*/
					, resize:false, close: function() {
						alarmLinkageObj = null;
						popTipsObject.remove('alarmLinkage');
					} });
	}else {
		alarmLinkageObj.show();
	}
	popTipsObject.put('alarmLinkage', alarmLinkageObj);
	hidePopTips('alarmLinkage');
}

//弹框对象
var alarmShieldObj = null;
//点击设置报警屏蔽
function setAlarmShielded() {
	if(alarmShieldObj == null) {
		alarmShieldObj = $.dialog({id:'alarmShield', title: parent.lang.monitor_alarm_shield, content: 'url:LocationManagement/alarmShield.html',
		width: '300px', height: '500px', min:true, max:false, lock:false,fixed:false, left:'100%', top:'0'
			, resize:false, close: function() {
				alarmShieldObj = null;
				popTipsObject.remove('alarmShield');
			} });
	}else {
		alarmShieldObj.show();
	}
	popTipsObject.put('alarmShield', alarmShieldObj);
	hidePopTips('alarmShield');
}

//获取网关服务器和存储服务器
//获取用户服务器
var gatewayServer = null;
var storageServer = null;
var userServer = null;
var isLoadServer = false;
function getGatewayServer() {
	$.myajax.jsonGet('StandardLoginAction_getGateStoServer.action', function(json,action,success){
		if(success) {
			//网关服务器
			var gatewayList = json.gatewayServer;
			var lstSvrIp = [];
			lstSvrIp.push(gatewayList[0].clientIp);
			lstSvrIp.push(gatewayList[0].lanip);
			lstSvrIp.push(gatewayList[0].clientIp2);
			gatewayServer = {};
			gatewayServer.ip = getComServerIp(lstSvrIp);
			gatewayServer.port = gatewayList[0].clientPort;
			//存储服务器
			var storageList = json.storageServer;
			var lstSvrIp2 = [];
			lstSvrIp2.push(storageList[0].clientIp);
			lstSvrIp2.push(storageList[0].lanip);
			lstSvrIp2.push(storageList[0].clientIp2);
			storageServer = {};
			storageServer.ip = getComServerIp(lstSvrIp2);
			storageServer.port = storageList[0].clientPort;
			//赋值存储服务器  车辆媒体文件类
			monitorMedia.setStorageServer(storageServer);
			//用户服务器
			var lstSvrIp3 = [];
			lstSvrIp3.push(json.userServer.clientIp);
			lstSvrIp3.push(json.userServer.lanip);
			lstSvrIp3.push(json.userServer.clientIp2);
			userServer = {};
			userServer.ip = getComServerIp(lstSvrIp3);
			userServer.port = json.userServer.clientPort;
			
			isLoadServer = true;
		};
	}, null);
}

function setRefinterval(){
	var interval = $.cookie(DEF_Refresh_Interval);
	if(interval != null){
		refinterval = interval * 1000;
		monitorStatus.setFlashStatusInterval(refinterval);
	}
	//加载地图点聚合参数
	monitorMapTip.loadMarkerClusterParam();
}

function setAlarmRefinterval(){
	var alarminterval = $.cookie(DEF_Alarm_Refresh_Interval);
	if(alarminterval != null){
		alarmrefinterval = alarminterval * 1000;
		monitorAlarm.setFlashAlarmInterval(alarmrefinterval);
	}
}

function sendPTZControl(value){
	if(ttxVideo == null) {
		return;
	}
	var window = ttxVideo.getCurFocusWindow();
	if(!window.isPreview){
		$.dialog.tips(parent.lang.focus_picture_play_video,1);
		//alert(parent.lang.focus_picture_play_video);
		return;
	}
	if(value == 18){
		$('.icon_yt_4').attr('href','javascript:sendPTZControl(19);');
	}else if(value == 19){
		$('.icon_yt_4').attr('href','javascript:sendPTZControl(18);');
	}
	paneInfo.sendPTZControl(window,value, gatewayServer);
}

//处理视频播放按钮的消息 开始和停止
function ttxPlayerReplayMsg(type){
	paneInfo.setButtonForPtzColor();
}

/*function setButtonClose(){
	paneInfo.setButtonClose();
}*/

//隐藏弹出框
function hidePopTips(name) {
	if(popTipsObject != null && popTipsObject.size() > 0) {
		popTipsObject.each(function(id, value) {
			if(id != name && value != null) {
				if(id != 'info' && id != 'areaInfo' /*&& id != 'issuedInfo' && id != 'upgrade' && id != 'oilConfig'*/) {
					value.hide();
				}else {
					value.close();
				}
			}
		});
	}
}

//媒体文件列表下载媒体文件
function downloadMediaFile(id) {
	monitorMedia.downloadMediaFile(id);
}

//媒体文件列表回放视频
function videoFileReplay(id) {
	monitorMedia.videoFileReplay(id);
}

//添加车辆到地图
function addVehicleToMap(vehiIdno) {
	var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
	if(vehicle != null) {
		var data = vehicle.gpsParseTrackStatus();
		data.id = vehiIdno;
		monitorMapTip.addVehicleToMap(vehicle, data, true);
	}
}

//报警信息列表查询
function doAlarmFind(alarmId) {
	monitorAlarm.doAlarmFind(alarmId);
}

//设置车辆画区域标志
function setVehicleDrowing(flag) {
	monitorMapTip.setVehicleDrowing(flag);
}

/**
* 公交线路  显示线路信息到地图
* isOnShowMap true 显示 false 删除
*/
function displayLineOnMap(lineId, lineDirect, isOnShowMap) {
	monitorLine.displayLineOnMap(lineId, lineDirect, isOnShowMap);
}