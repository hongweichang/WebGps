var vehiTree;   //车辆树
var monitorStatus = null;	//车辆状态监听类，用于获取车辆实时状态
var monitorAlarm = null;

var GFRAME = null;
var Geocoder = null;
var selMap = getUrlParameter("selMap");

$(document).ready(function () {
	initCommon("../js/map/google/theme/");
	//加载地图信息
	GFRAME = new mapframe();
	GFRAME.createMap(false);
	if (selMap == '3') {
		Geocoder = new BMap.Geocoder();
	}
	GFRAME.imagePath = "../js/map/google/image/";
	if (selMap == '3') {
		$('#spanCurMap').text(parent.lang.mapBaidu);
		$('#liMap3').hide();
	} else if (selMap == '0') {
		$('#spanCurMap').text(parent.lang.mapGoogle);
		$('#liMap0').hide();
	}else if (selMap == '1') {
		$('#spanCurMap').text(parent.lang.mapMapInfo);
		$('#liMap1').hide();
	}else if (selMap == '8') {
		$('#spanCurMap').text(parent.lang.mapArcGis);
		$('#liMap8').hide();
	}else if (selMap == '9') {
		$('#spanCurMap').text(parent.lang.mapMapBar);
		$('#liMap9').hide();
	}
	loadReadPage();
});

function loadReadPage() {
	if(GFRAME.isInitSuc==false){
		setTimeout(loadReadPage, 50);
	}else {
		//获取浏览器所在城市  设置中心城市
		if (selMap == '3') {
			var myCity = new BMap.LocalCity();
			myCity.get(function(result) {
				GFRAME.map.centerAndZoom(result.name,GFRAME.trackZoomLevel);
			});
		}else if(selMap == '0') {
			// 添加自定义的控件
		//	GFRAME.map.addControl(new GRulerControl());
			var geolocation = new BMap.Geolocation();  //实例化浏览器定位对象。
			geolocation.getCurrentPosition(function(result){   //定位结果对象会传递给r变量
				if(this.getStatus() == BMAP_STATUS_SUCCESS){  //通过Geolocation类的getStatus()可以判断是否成功定位。
					setCenter(result.point.lng,result.point.lat,GFRAME.trackZoomLevel);  //r对象的point属性也是一个对象，这个对象的lng属性表示经度，lat属性表示纬度。
				}
			//	else {
			//		alert('failed'+this.getStatus());
			//	}        
			},{enableHighAccuracy: true})
		}
		
		loadLang();
		loadPageInfo();
		setPanelWidth();
		monitorStatus = new monitorVehicleStatus();
		monitorStatus.initialize();
		monitorAlarm = new monitorVehicleAlarm();
		monitorAlarm.initialize();
		loadVehiTree();
	//	setTimeout(loadVideo,2000);
	}
}

function loadLang() {
	$('#vehiIdnoOnTree').attr('placeholder',parent.lang.monitor_searchDevice);
	$('#gps_monitor_title').text(parent.lang.monitor_gpsMonitor);
	$('#gps_alarm_title').text(parent.lang.monitor_alarmInfo);
	$('#gps_system_title').text(parent.lang.monitor_systemEvent);
	$('.status-monitor .status-title').text(parent.lang.monitor_labelMonitor);
	$('.status-online .status-title').text(parent.lang.monitor_labelOnline);
	$('.status-alarm .status-title').text(parent.lang.monitor_labelAlarm);
	$('.status-offline .status-title').text(parent.lang.monitor_labelOffline);
	$('.status-parking .status-title').text(parent.lang.monitor_labelParking);
	$('.status-parked .status-title').text(parent.lang.monitor_labelParked);
	$('.status-invalid .status-title').text(parent.lang.monitor_labelInvalid);
	$('#map_baidu').text(parent.lang.mapBaidu);
	$('#map_google').text(parent.lang.mapGoogle);
	$('#map_mapinfo').text(parent.lang.mapMapInfo);
}

function loadPageInfo() {
	 //pz是车辆列表工具栏的左边参数操作按钮，dh_tips是车辆列表工具栏右边的提示按钮
	 $(".pz,.dh_tips,.tv_box span,.map_select,.box_select").hover(
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
	//slider_btn_right 视频界面的展开和收缩按钮
	//dm_map 地图窗口
	//dm_video 视频窗口
	//右侧隐藏显示
	$(".slider_btn_right").click(function(){
		if( (typeof($(".slider_btn_right").attr("rel"))=="undefined") ){
			$(".dm_map").css("right","-300px");
			$(".dm_video").css("marginRight","0");
			$(".slider_btn_right").attr("rel","1");
			$(this).find("i").removeClass("icon_side_right").addClass("icon_side_left");
		}else{
			$(".dm_map").css("right","0px");
			$(".dm_video").css("marginRight","300px");
			$(".slider_btn_right").removeAttr("rel");
			$(this).find("i").removeClass("icon_side_left").addClass("icon_side_right");
		}
	});
	//位置定位拖动高度
	var src_posi_Y = 0, dest_posi_Y = 0, move_Y = 0, is_mouse_down = false, destHeight = 30,mapHeight;
    $(".map_drag_box").mousedown(function(e){
        src_posi_Y = e.pageY;
        is_mouse_down = true;
    });
    $(document).bind("click mouseup",function(e){
        if(is_mouse_down){
          is_mouse_down = false;
        }
    }).mousemove(function(e){
        dest_posi_Y = e.pageY;
        move_Y = src_posi_Y - dest_posi_Y;
        src_posi_Y = dest_posi_Y;
        destHeight = $(".map_action").height() + move_Y;
		mapHeight = $(".dm_video").height() - move_Y;
        if(is_mouse_down){
            $(".map_action").css("height", destHeight < 39 ? 39 : destHeight);
			$(".map_action").css("height", destHeight > $(window).height() - 39 ? $(window).height() - 39 : destHeight);
			$(".dm_video").css("height", mapHeight < 39 ? 39 : mapHeight);
			$(".dm_map").css("height", mapHeight < 39 ? 39 : mapHeight);
			$(".video_box").height($(".dm_video").height() - $('.dm_video .dh').height());
			$(".map").height($(".dm_map").height() - $('.dm_map .map_btn').height() - 5);
			$(".flexigrid .bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.flexigrid .hDiv').height());
        }
    });
	//列表缩小，放大
	$(".min_s").click(function(){
		if($(this).hasClass("icon_s")){
			$(".map_action").css("height",39);
			$(".dm_video").height($(window).height() - $('.map_action').height());
			$(".dm_map").height($(window).height() - $('.map_action').height());
			$(".video_box").height($(window).height() - $('.map_action').height() - $('.dm_video .dh').height());
			$(".map").height($(window).height() - $('.map_action').height() - $('.dm_map .map_btn').height() - 5);
			$(".flexigrid .bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.flexigrid .hDiv').height());
			$(this).removeClass("icon_s").addClass("icon_s_re");
		}else{
			$(".map_action").css("height",260);
			$(".dm_video").height($(window).height() - $('.map_action').height());
			$(".dm_map").height($(window).height() - $('.map_action').height());
			$(".video_box").height($(window).height() - $('.map_action').height() - $('.dm_video .dh').height());
			$(".map").height($(window).height() - $('.map_action').height() - $('.dm_map .map_btn').height() - 5);
			$(".flexigrid .bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.flexigrid .hDiv').height());
			$(this).removeClass("icon_s_re").addClass("icon_s");
		}
	});
	//列表最大化
	$(".icon_big").click(function(){
		$(".map_action").css("height",$(window).height()- 117);
		$(".dm_video").height($(window).height() - $('.map_action').height());
		$(".dm_map").height($(window).height() - $('.map_action').height());
		$(".video_box").height($(window).height() - $('.map_action').height() - $('.dm_video .dh').height());
		$(".map").height($(window).height() - $('.map_action').height() - $('.dm_map .map_btn').height() - 5);
		$(".flexigrid .bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.flexigrid .hDiv').height());
		$(".min_s").removeClass("icon_s").addClass("icon_s_re");
	});
	//在树列表查询车辆
	$("#vehiIdnoOnTree").on('keyup', findVehicleByTree);
	
	//在地图上查找车辆
	$("#findVehicleOnMap").on('keyup',findVehicleOnMap);
	
	//切换事件列表
	$(".map_action .map_tab li").click(function(){
		var _index2 = $(this).index();
		if($(this).attr('id') != 'gps-export') {
			$(this).addClass("active").siblings().removeClass("active");
			$(".gps_box li").eq(_index2).addClass("active").siblings().removeClass("active");
		}
	});
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

/*
 * 加载车辆树
 */
function loadVehiTree() {
	if(parent.isLoadVehiList && parent.isLoadVehiGroupList) {
		//加载车辆树
		vehiTree = new dhtmlXTreeObject("vehicle_tree", "100%", "100%", 0);
		vehiTree.setImagePath("../../js/dxtree/imgs/");
//		vehiTree.enableDragAndDrop(true);
//		vehiTree.setDragHandler(doDragItem);
		vehiTree.enableCheckBoxes(1);
		vehiTree.enableThreeStateCheckboxes(true);
		vehiTree.setOnDblClickHandler(doSelVehi); //双击事件
		vehiTree.setOnCheckHandler(doCheckTreeVehi); //选中事件
		vehiTree.setOnClickHandler(doClickTreeVehi); //单击事件
//		vehiTree.setOnOpenEndHandler(doOpenOrCloseTree); //节点展开/合拢结束事件
		
		//加载公司
		vehiTree.fillGroup(parent.vehiGroupList, parent.companyId, parent.lang.all_vehicles);
		//加载车辆
		vehiTree.fillVehicleEx(parent.vehicleList, true);
		//计算数目
		countGroupVehiOnline(vehiTree.getTreeGroupId(parent.companyId));
	}else {
		setTimeout(loadVehiTree,50);
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
			monitorStatus.selectVehicle(selId, false, isShowMap, isShowMap);
		} else if (vehiTree.isVehicleItem(selId)) {
			vehiTree.closeAllItems();
			vehiTree.openItem(selId);
			var isShowMap = monitorStatus.findMonitorVehicle(selId);
			monitorStatus.selectVehicle(selId, false, isShowMap, isShowMap);
		}else {
			vehiTree.openItem(selId);
		}
	}
}

//选择车辆，加载视频
function doSelVehi(idno) {
	if(idno.toString().indexOf('*_') < 0) {
		var vehiObj = parent.vehicleManager.getVehicle(idno);
		if(vehiObj == null) {
			var parentIdno = vehiTree.getParentId(idno);
			if(parentIdno.toString().indexOf('*_') < 0) {
				vehiObj = parent.vehicleManager.getVehicle(parentIdno);
				var device = vehiObj.getVideoDevice();
				if(device != null) {
					previewVideoSingle(parentIdno, device.getIdno(), idno);
				}
			}
		}else {
			var device = vehiObj.getVideoDevice();
			if(device != null) {
				var channels = vehiObj.getVehicleChannel();
				previewVideo(idno, device.getIdno(), channels);
			}
		}
	}
}

//节点展开/合拢结束事件
function doOpenOrCloseTree(itemId,check) {
	if(check == -1) {
		//不是车辆则先关闭所有节点
		if(!vehiTree.isVehicleItem(itemId)) {
			vehiTree.closeAllItems();
		}
		//不是根节点就打开父节点
		if(!vehiTree.isRootItem(itemId)) {
			vehiTree.openItem(vehiTree.getParentId(itemId));
		}
	}
}

/*
 * 树列表搜索车辆
 * @param idno
 */
function addVehicleByTree(idno) {
	if(!vehiTree.isItemChecked(idno)) {
		vehiTree.setCheck(idno, true);
		monitorStatus.doCheckVehi(idno, true);
		//要去订阅报警信息
		monitorAlarm.flashVehicleAlarm();
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
			searchVehicleOnMap(name, 'so_tree_vehiList');
		} 
	}, 200);
}

//地图上查找车辆
function findVehicleOnMap() {
	setTimeout(function() {
		$('#so_map_vehiList ul').empty();
		$('#so_map_vehiList').css('border','0 none');
		// 删除地图上搜索出的所有覆盖物
		deleteAllOverlay();
		$('#so_map_vehiList').css('height','auto');
		var name = $.trim($("#findVehicleOnMap").val());
		if (name != "" && parent.vehiGroupList != null) {
			searchVehicleOnMap(name, 'so_map_vehiList');
		} 
	}, 200);
}

/*
* 在地图上查找车辆
*/
function searchVehicleOnMap(name, conId) {
	var index = 0;
	parent.vehicleManager.mapVehiList.each(function(key,value){
		var flag = true;
		if(value.getIdno().indexOf(name) >= 0) {
			$('#'+conId+' ul').append('<li data-id= "'+value.getIdno()+'">'+value.getIdno()+'</li>');
			flag = false;
			index++;
		}
		if(flag) {
			var devList = value.getDevList();
			if(devList != null && devList.length > 0) {
				for (var i = 0; i < devList.length; i++) {
					var device = devList[i];
					if(flag && device.getIdno().indexOf(name) >= 0) {
						$('#'+conId+' ul').append('<li data-id= "'+value.getIdno()+'">'+value.getIdno()+'</li>');
						flag = false;
						index++;
					}
					if(flag && device.getSimCard() != null && device.getSimCard().indexOf(name) >= 0) {
						$('#'+conId+' ul').append('<li data-id= "'+value.getIdno()+'">'+value.getIdno()+'</li>');
						flag = false;
						index++;
					}
				}
			}
		}
		if(flag && value.getDriverName() != null && value.getDriverName().indexOf(name) >= 0) {
			$('#'+conId+' ul').append('<li data-id= "'+value.getIdno()+'">'+value.getIdno()+'</li>');
			flag = false;
			index++;
		}
	});
	if(index > 0) {
		$('#'+conId+'').css('border','1px solid #d6d6d6');
		$('#'+conId+' li').each(function() {
			$(this).on('click',function() {
				if(conId == 'so_map_vehiList') {
					addVehicleByMarker($(this).attr('data-id'));
				}else if(conId == 'so_tree_vehiList') {
					addVehicleByTree($(this).attr('data-id'));
				}
			});	
		});
	}
	if(index > 7) {
		$('#'+conId+'').height(200);
	}
}

/**
 * 选择车辆添加到地图上（覆盖物形式）
 * @param idno
 */
function addVehicleByMarker(idno) {
	if(idno != null) {
		//默认-1，如果不存在已添加
		var selIndex = -1;
		for (var i = 0; i < GFRAME.markerList.length; i++) {
			//已添加
			if(GFRAME.markerList[i].name == idno) {
				selIndex = i;
			}
		}
		if(selIndex == -1) {
			var vehicle = parent.mapVehiList.get(idno);
			var device = vehicle.getValidDevice();
			if(device != null && device.status != null) {
				var status = device.getStatus();
				status.idno = vehicle.getIdno();
				status.gpsTimeStr = dateTime2TimeString(status.gpsTime);
				var data = vehicle.gpsParseTrackStatus();
				var index = GFRAME.markerList.length + 1;
				insertMarker(index);
				updateMarker(index, 1, vehicle.getName(), status.mapJingDu, status.mapWeiDu
						, 1, '00FF00', data.statusString, '');
				selectMarker(index);
			}
		}else {
			selectMarker(selIndex+1);
		}
	}
}

/*
 *设置页面大小
 */
function setPanelWidth() {
	//地图高度不能超出
	var _height = $(window).height();
	$(".pro_list").height(_height);			//左边面板
	$("#vehicle_tree").height(_height - $('.pro_list .dh').height());	//车辆列表
	$(".d_main").height(_height);		//主界面
	$(".dm_video").height(_height - $('.map_action').height());	//视频界面
	$(".dm_map").height(_height - $('.map_action').height());	//地图界面
	
	$(".video_box").height(_height - $('.map_action').height() - $('.dm_video .dh').height());
	$(".map").height(_height - $('.map_action').height() - $('.dm_map .map_btn').height() - 5);
	//事件栏
	$(".flexigrid .bDiv").height($('.map_action').height()- $('.map_drag_box').height() - $('.map_tab').height() - $('.flexigrid .hDiv').height());
	$(".map_action").css("height", $(".map_action").height() > _height - 39 ?   _height - 39 : $(".map_action").height());
	$(".map_action").css("height", $(".map_action").height() < 39 ? 39 : $(".map_action").height());
}

function showMonitorPage(name) {
	if(name == 'weizhi') {
		$('.dm_video').removeClass("show").addClass("hide");
		$('.slider_btn_right').removeClass("show").addClass("hide");
		$('.map_btn .right').removeClass("hide").addClass("show");
		$('.map_btn .left .so').removeClass("hide").addClass("show");
		$('.dm_map').css("width","auto");
		$('.dm_map').css("position","relative");
		$('.dm_map').css("right","0px");
	}else if(name == 'shipin') {
		$('.dm_video').removeClass("hide").addClass("show");
		$('.slider_btn_right').removeClass("hide").addClass("show");
		$('.map_btn .right').removeClass("show").addClass("hide");
		$('.map_btn .left .so').removeClass("show").addClass("hide");
		$('.dm_map').css("width","300px");
		$('.dm_map').css("position","absolute");
		$(".dm_video").css("marginRight","300px");
		$(".slider_btn_right").removeAttr("rel");
		$(".slider_btn_right i").removeClass("icon_side_left").addClass("icon_side_right");
	}
}
