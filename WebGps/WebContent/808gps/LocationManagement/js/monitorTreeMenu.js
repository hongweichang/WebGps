/**
 * 监控树右键菜单处理类
 * 车辆右键菜单（需要判断用户是否有权限）
 * 	  备注：车辆有如果有两个设备，只有一个设备  有视频，对讲，油量传感器，TTS传感器 属性，	网络流量统计只争对视频设备进行统计
 * 	  一级菜单	
 * 		预览所有视频（有视频设备，并且视频的设备在线）
 * 		停止所有视频（如果有该车辆的视频在预览）
 * 		对讲、监听（有视频设备，并且视频的设备在线）（监听是mic监听）
 * 		图片抓拍（如果单个视频设备（单兵，一般会把通道数目配置成0或1），通道数目为0，并且视频设备在线）
 * 		下发文字信息（有TTS传感器，并且TTS传感器的设备是在线的）
 * 		网络流量（有视频设备）（不管是否在线）
 * 		油量刻度（有油量传感器）（不管是否在线）
 *    设备支持的功能菜单
 *    	808协议	参数配置（在线）
 * 		TTX协议	参数配置（在线），离线升级（不管是否在线），设备信息（在线）
 * 
 *    一个车辆有两个设备的情况（一个视频终端和一个GPS终端）
 * 		一级菜单增加两个		视频终端 和  GPS终端
 *  	  视频终端下面有子菜单	见（设备支持的功能菜单）
 *        GPS终端下面有子菜单	见（设备支持的功能菜单）
 *        
 *    一个车辆下面有一个设备的情况
 * 		则一级菜单增加设备菜单		见（设备支持的功能菜单）
 * 
 * 通道菜单（后面会考虑在通道菜单内增加车辆的一级菜单）
 * 		预览主码流（视频设备，视频设备在线）（如果已经在预览了，则需要切换菜单成停止主码流）
 * 		预览子码流（视频设备，视频设备在线）
 * 		停止所有视频（如果有该车辆的视频在预览）
 * 		对讲（有对讲属性，对讲的设备在线）（如果已经在对讲了，则需要显示成停止对讲菜单）
 * 		监听（有监听属性，监听设备在线）（监听是通道的监听）（如果已经在监听了，则需要切换成菜单停止监听）
 * 		图片抓拍（设备在线）（如果同一视频同一通道的抓拍没有成功，则不往服务器发送抓拍请求）
 * 
 * 对于暂时没开发完成的功能，则提醒用户：下一版本支持此功能
 */
function monitorTreeMenu(){
	this.roleCls = null;  //权限类对象
	this.teamMenuObject = null;  //公司车队菜单选项对象
	this.vehicleMenuObject = null;  //车辆菜单选项对象
	this.channelMenuObject = null;  //通道菜单选项对象
	this.oldRightTreeItem = null;  //上一个右键弹出菜单标识
	this.vehicleItems = [];  //车辆菜单
	this.channelItems = []; //通道菜单
}

//赋值权限类对象
monitorTreeMenu.prototype.setRoleCls = function(roleCls) {
	if(typeof roleCls != 'undefined' && roleCls != null) {
		this.roleCls = roleCls;
	}
}

monitorTreeMenu.prototype.initialize = function(monitorTree, privileges){
	//初始化右键菜单
	if(typeof vehiTree != 'undefined' && vehiTree != null) {
		this.addTeamMenu();
		this.loadVehicleItems();
		this.loadChannelItems();
	}
}

/**
 * 设置公司车队的右键菜单 
 * @param idPrefix   
 * @param vehiIdnos  1,2,3,4,5
 * @param items  菜单集合
 * @param func
 */
monitorTreeMenu.prototype.loadTeamMenu = function(idPrefix, teams, items, func) {
	this.loadCommenMenu(1, idPrefix, teams, items, func);
}


/**
 * 设置车辆的右键菜单 
 * @param idPrefix   
 * @param vehiIdnos  1,2,3,4,5
 * @param items  菜单集合
 * @param func
 */
monitorTreeMenu.prototype.loadVehicleMenu = function(idPrefix, vehiIdnos, items, func) {
	this.loadCommenMenu(2, idPrefix, vehiIdnos, items, func);
}

/**
 * 设置通道的右键菜单 
 * @param idPrefix   
 * @param vehiIdnos  1,2,3,4,5
 * @param items  菜单集合
 * @param func
 */
monitorTreeMenu.prototype.loadChannelMenu = function(idPrefix, channels, items, func) {
	this.loadCommenMenu(3, idPrefix, channels, items, func);
}

/**
 * 设置右键菜单公共属性 
 * @param idPrefix   
 * @param idnos  1,2,3,4,5
 * @param items  菜单集合
 * @param func
 */
monitorTreeMenu.prototype.loadCommenMenu = function(type, idPrefix, idnos, items, func) {
	if(typeof dhtmlXMenuObject != 'undefined') {
		var isExist = false;
		var menu = null;
		if(type == 1) {
			if(this.teamMenuObject == null) {
				this.teamMenuObject = new dhtmlXMenuObject();
			}else {
				isExist = true;
			}
			menu = this.teamMenuObject;
		}else if(type == 2) {
			if(this.vehicleMenuObject == null) {
				this.vehicleMenuObject = new dhtmlXMenuObject();
			}else {
				isExist = true;
			}
			menu = this.vehicleMenuObject;
		}else if(type == 3) {
			if(this.channelMenuObject == null) {
				this.channelMenuObject = new dhtmlXMenuObject();
			}else {
				isExist = true;
			}
			menu = this.channelMenuObject;
		}
		if(menu != null) {
			if(!isExist) {
				menu.idPrefix = idPrefix;
//				menu.topId = "dhxWebMenuTopId";
			    menu.setIconsPath("../../js/dxtree/imgs/menu/");
			    menu.loadStruct("../../js/dxtree/common/vehicleContext.xml");
			    menu._initObj(items,true);
			    menu.renderAsContextMenu();
			  //右键菜单点击事件
			    if(typeof func != 'undefined') {
			    	menu.attachEvent("onClick", func);
			    }
			}
		    if(typeof vehiTree != 'undefined' && vehiTree != null) {
		    	vehiTree.setItemContextMenu(idnos, menu);
		    }
		}
	}
}

//获取车辆树右键菜单对象
monitorTreeMenu.prototype.getItemContextMenu=function(itemId){
	if(itemId != null) {
		if(typeof vehiTree != 'undefined' && vehiTree != null) {
			var temp = vehiTree._globalIdStorageFind(itemId);
			if(temp != null) {
				return temp.cMenu;
			}
		}
	}
	return null;
}

//关闭车辆树右键菜单
monitorTreeMenu.prototype.hideContextMenu=function(itemId){
	if(itemId != null) {
		var menu = this.getItemContextMenu(itemId);
		if(menu != null) {
			menu.hideContextMenu();
		}
	}
}

//判断车辆是否有通道在播放视频
monitorTreeMenu.prototype.vehiChnIsPlaying=function(vehiIdno){
	if(vehiIdno != null) {
		var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
		if(vehicle != null) {
			//存在视频设备
			var vedioDevice = vehicle.getVideoDevice(); //视频设备
			if(vedioDevice != null) {
				var count = vedioDevice.getChnCount();
				if (count <= 0) {
					count = 1;
				}
				if(typeof ttxVideo != 'undefined' && ttxVideo != null) {
					//是否有预览主码流
					for (var i = 0; i < count; i++) {
						if(ttxVideo.isPlaying(vedioDevice.getIdno(), i, ttxVideo.STREAM_MAIN)) {
							return true;
						}
					}
					//如果没有预览主码流，则判断子码流
					for (var i = 0; i < count; i++) {
						if(ttxVideo.isPlaying(vedioDevice.getIdno(), i, ttxVideo.STREAM_SUB)) {
							return true;
						}
					}
				}
			}
		}
	}
	return false;
}

//单设备菜单显示和隐藏
//device不为空
monitorTreeMenu.prototype.singleDeviceMenuItemShow = function(device) {
	//屏蔽双设备菜单
	$('#vehicleInfo_videoDevice').hide();
	$('#vehicleInfo_GPSDevice').hide();
	
	//下发文字信息   车辆有支持808部标协议的设备
	if (device.isOnline() && device.isTTSSupport()) {
		$('#vehicleInfo_issued_info').show();
	}else {
		$('#vehicleInfo_issued_info').hide();
	}
	//抓拍
	if(device.isVideoDevice() && device.isOnline() && (device.getChnCount() == null || device.getChnCount() == 0)) {
		$('#vehicleInfo_image_capture').show();
	}else {
		$('#vehicleInfo_image_capture').hide();
	}
	//只有TTX(WKP)协议的设备才支持此功能
	if(device.isOnline() && device.isCanFindInfo()) {
		$('#vehicleInfo_device_info').show();
	}else {
		$('#vehicleInfo_device_info').hide();
	}
	//支持设备升级
	if(device.hasOfflineUpgrade()){
		$('#vehicleInfo_issued_file').show();
		if(device.isOnline()) {
			$('#vehicleInfo_online_upgrade').show();
			$('#vehicleInfo_offline_upgrade').hide();
		}else {
			$('#vehicleInfo_online_upgrade').hide();
			$('#vehicleInfo_offline_upgrade').show();
		}
	}else{
		$('#vehicleInfo_online_upgrade').hide();
		$('#vehicleInfo_offline_upgrade').hide();
		$('#vehicleInfo_issued_file').hide();
	}
	//GPS上报间隔
	if(device.isOnline() && device.isCanGPSReportInterval()) {
		$('#vehicleInfo_gps_report_interval').show();
	}else {
		$('#vehicleInfo_gps_report_interval').hide();
	}
	//参数配置
	if(device.isOnline() && (device.isCan808ParamConfig() || device.isCanTtxParamConfig())) {
		$('#vehicleInfo_param_config').show();
	}else {
		$('#vehicleInfo_param_config').hide();
	}
	
	//电话回拨
	if(device.isOnline() && device.isCan808ParamConfig()) {
		$('#vehicleInfo_phone_callback').show();
	}else {
		$('#vehicleInfo_phone_callback').hide();
	}
	
	//3g网络配置
	//$('#vehicleInfo_3G_count').show();
	//$('#vehicleInfo_3G_config').show();
}

//双设备菜单显示和隐藏
//gpsDevice GPS设备
//videoDevice 视频设备
monitorTreeMenu.prototype.doubleDeviceMenuItemShow = function(gpsDevice, videoDevice) {
	//屏蔽单设备属性菜单
	$('#vehicleInfo_issued_info').hide();
	$('#vehicleInfo_device_info').hide();
	$('#vehicleInfo_online_upgrade').hide();
	$('#vehicleInfo_offline_upgrade').hide();
	$('#vehicleInfo_issued_file').hide();
	$('#vehicleInfo_param_config').hide();
	$('#vehicleInfo_phone_callback').hide();
	
	var isExistsGps = false;//是否存在gps设备菜单
	var isExistsVideo = false;//是否存在视频设备菜单
	//抓拍判断存在问题
	if(videoDevice != null && videoDevice.isOnline() && 
			(videoDevice.getChnCount() == null || videoDevice.getChnCount() == 0) && 
			gpsDevice != null && !gpsDevice.isOnline()) {
		$('#vehicleInfo_image_capture').show();
	}else {
		$('#vehicleInfo_image_capture').hide();
	}
	//GPS上报间隔
	if(gpsDevice.isOnline() && gpsDevice.isCanGPSReportInterval()) {
		$('#vehicleInfo_gps_report_interval').show();
	}else {
		$('#vehicleInfo_gps_report_interval').hide();
	}
	
	//下发文字信息   车辆有支持TTS的设备
	if(videoDevice != null && videoDevice.isOnline() && videoDevice.isTTSSupport()) {
		$('#vehicleInfo_issued_info_video').show();
		isExistsVideo = true;
	}else {
		$('#vehicleInfo_issued_info_video').hide();
	}
	//只有TTX(WKP)协议的设备才支持此功能
	if(videoDevice != null && videoDevice.isOnline() && videoDevice.isCanFindInfo()) {
		$('#vehicleInfo_device_info_video').show();
		isExistsVideo = true;
	}else {
		$('#vehicleInfo_device_info_video').hide();
	}
	//参数配置
	if(videoDevice.isOnline() && (videoDevice.isCan808ParamConfig() || videoDevice.isCanTtxParamConfig())) {
		$('#vehicleInfo_param_config_video').show();
		isExistsVideo = true;
	}else {
		$('#vehicleInfo_param_config_video').hide();
	}
	//电话回拨
	if(videoDevice.isOnline() && videoDevice.isCan808ParamConfig()) {
		$('#vehicleInfo_phone_callback_video').show();
		isExistsVideo = true;
	}else {
		$('#vehicleInfo_phone_callback_video').hide();
	}
	//支持设备升级
	if(videoDevice != null && videoDevice.hasOfflineUpgrade()){
		$('#vehicleInfo_issued_file_video').show();
		if(videoDevice.isOnline()) {
			$('#vehicleInfo_online_upgrade_video').show();
			$('#vehicleInfo_offline_upgrade_video').hide();
		}else {
			$('#vehicleInfo_online_upgrade_video').hide();
			$('#vehicleInfo_offline_upgrade_video').show();
		}
		isExistsVideo = true;
	}else{
		$('#vehicleInfo_online_upgrade_video').hide();
		$('#vehicleInfo_offline_upgrade_video').hide();
		$('#vehicleInfo_issued_file_video').hide();
	}
	
	//下发文字信息   车辆有支持TTS的设备
	if(gpsDevice != null && gpsDevice.isOnline() && gpsDevice.isTTSSupport()) {
		$('#vehicleInfo_issued_info_gps').show();
		isExistsGps = true;
	}else {
		$('#vehicleInfo_issued_info_gps').hide();
	}
	//只有TTX(WKP)协议的设备才支持此功能
	if(gpsDevice != null && gpsDevice.isOnline() && gpsDevice.isCanFindInfo()) {
		$('#vehicleInfo_device_info_gps').show();
		isExistsGps = true;
	}else {
		$('#vehicleInfo_device_info_gps').hide();
	}
	//参数配置
	if(gpsDevice.isOnline() && (gpsDevice.isCan808ParamConfig() || gpsDevice.isCanTtxParamConfig())) {
		$('#vehicleInfo_param_config_gps').show();
		isExistsGps = true;
	}else {
		$('#vehicleInfo_param_config_gps').hide();
	}
	//电话回拨
	if(gpsDevice.isOnline() && gpsDevice.isCan808ParamConfig()) {
		$('#vehicleInfo_phone_callback_gps').show();
		isExistsGps = true;
	}else {
		$('#vehicleInfo_phone_callback_gps').hide();
	}
	//支持设备升级
	if(gpsDevice != null && gpsDevice.hasOfflineUpgrade()){
		$('#vehicleInfo_issued_file_gps').show();
		if(gpsDevice.isOnline()) {
			$('#vehicleInfo_online_upgrade_gps').show();
			$('#vehicleInfo_offline_upgrade_gps').hide();
		}else {
			$('#vehicleInfo_online_upgrade_gps').hide();
			$('#vehicleInfo_offline_upgrade_gps').show();
		}
		isExistsGps = true;
	}else{
		$('#vehicleInfo_online_upgrade_gps').hide();
		$('#vehicleInfo_offline_upgrade_gps').hide();
		$('#vehicleInfo_issued_file_gps').hide();
	}
	//显示双设备菜单
	if(isExistsVideo) {//存在视频设备菜单
		$('#vehicleInfo_videoDevice').show();
	}else {
		$('#vehicleInfo_videoDevice').hide();
	}
	if(isExistsGps) {//存在gps设备菜单
		$('#vehicleInfo_GPSDevice').show();
	}else {
		$('#vehicleInfo_GPSDevice').hide();
	}
}

//车辆菜单显示
//vehicle 车辆类    device 设备类
monitorTreeMenu.prototype.vehicleMenuItemShow = function(vehicle, device) {
	//视频、监听、对讲，下发文字信息   单个设备还是双个设备没有关系，放在一级菜单
	//设备升级需要区分单个设备还是又设备
	var videoDevice = vehicle.getVideoDevice(); //视频设备
	if(device != null) {//单设备
		this.singleDeviceMenuItemShow(device);
	}else {//双设备
		var gpsDevice = vehicle.getGpsDevice();//gps设备
		this.doubleDeviceMenuItemShow(gpsDevice, videoDevice);
	}
	//主菜单显示，不显示在gps设备和视频设备
	//存在视频设备
	if(videoDevice != null) {
		if(videoDevice.isOnline()) {//在线
			//预览所有视频
			//车辆有通道在播放视频 
			if(this.vehiChnIsPlaying(vehicle.getIdno())) {
			//	$('#vehicleInfo_preview_all_start').hide();
				$('#vehicleInfo_preview_all_stop').show();
			}else {
				$('#vehicleInfo_preview_all_start').show();
				$('#vehicleInfo_preview_all_stop').hide();
			}
		}else {
			$('#vehicleInfo_preview_all_start').hide();
			$('#vehicleInfo_preview_all_stop').hide();
		}
		//WIFI下载任务设置(808协议没有)
		if(videoDevice.isCanWifiConfig()) {
			$('#vehicleInfo_wifi_download_task').show();
		}else {
			$('#vehicleInfo_wifi_download_task').hide();
		}
	}else {
		$('#vehicleInfo_preview_all_start').hide();
		$('#vehicleInfo_preview_all_stop').hide();
		$('#vehicleInfo_wifi_download_task').hide();
	}
	//支持对讲
	if (typeof paneInfo != 'undefined' && paneInfo != null 
			&& vehicle.isTalkbackSupport() && vehicle.getTalkbackDevice().isOnline()) {
		if (paneInfo.isVehiTalking(vehicle.getName())){
			$('#vehicleInfo_talkback_mic_start').hide();
			$('#vehicleInfo_talkback_mic_stop').show();
		} else {
			$('#vehicleInfo_talkback_mic_start').show();
			$('#vehicleInfo_talkback_mic_stop').hide();
		}
	} else {
		$('#vehicleInfo_talkback_mic_start').hide();
		$('#vehicleInfo_talkback_mic_stop').hide();
	}
	//支持监听
	if (typeof paneInfo != 'undefined' && paneInfo != null 
			&& vehicle.isMonitorSupport() && vehicle.getMonitorDevice().isOnline()) {
		if (paneInfo.isVehiListening(vehicle.getName(), -1)){
			$('#vehicleInfo_monitor_mic_start').hide();
			$('#vehicleInfo_monitor_mic_stop').show();
		} else {
			$('#vehicleInfo_monitor_mic_start').show();
			$('#vehicleInfo_monitor_mic_stop').hide();
		}
	} else {
		$('#vehicleInfo_monitor_mic_start').hide();
		$('#vehicleInfo_monitor_mic_stop').hide();
	}
	//支持油量配置
	var oilDevice = vehicle.getOilDevice();
	if(oilDevice != null){
		$('#vehicleInfo_oil_config').show();
	}else{
		$('#vehicleInfo_oil_config').hide();
	}
	//车辆控制
	if(vehicle.isOnline()) {
		$('#vehicleInfo_vehicle_control').show();
	}else {
		$('#vehicleInfo_vehicle_control').hide();
	}
}


//通道菜单显示
//itemId 通道id
monitorTreeMenu.prototype.channelMenuItemShow = function(itemId) {
	var vehiIdno = vehiTree.getChannelVehiIdno(itemId);
	var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
	if(vehicle != null && vehicle.getDevList() != null) {
		var channelIndex = vehiTree.getChannelIndex(itemId);
		if(vehicle.isOnline()) {
			//判断通道是否在视频设备上
			if(vehicle.isChannelVideoDevice(channelIndex)) {
				device = vehicle.getVideoDevice();
				//通道是否在播放主码流
				if(typeof ttxVideo != 'undefined' && ttxVideo != null && ttxVideo.isPlaying(device.getIdno(), channelIndex, ttxVideo.STREAM_MAIN)) {
					$('#channel_preview_mainstream_channel_start').hide();
					$('#channel_preview_mainstream_channel_stop').show();
				}else {
					$('#channel_preview_mainstream_channel_start').show();
					$('#channel_preview_mainstream_channel_stop').hide();
				}
				//通道是否在播放子码流
				if(typeof ttxVideo != 'undefined' && ttxVideo != null &&  ttxVideo.isPlaying(device.getIdno(), channelIndex, ttxVideo.STREAM_SUB)) {
					$('#channel_preview_substream_channel_start').hide();
					$('#channel_preview_substream_channel_stop').show();
				}else {
					$('#channel_preview_substream_channel_start').show();
					$('#channel_preview_substream_channel_stop').hide();
				}
				$('#channel_recording_channel').show();
			}else {
				device = vehicle.getGpsDevice();
				$('#channel_preview_mainstream_channel_start').hide();
				$('#channel_preview_mainstream_channel_stop').hide();
				$('#channel_preview_substream_channel_start').hide();
				$('#channel_preview_substream_channel_stop').hide();
				$('#channel_recording_channel').hide();
			}
			//停止所有视频
			var videoDevice = vehicle.getVideoDevice(); //视频设备
			if(videoDevice != null && videoDevice.isOnline()) {
				//车辆有通道在播放视频
				if(this.vehiChnIsPlaying(vehiIdno.toString())) {
					$('#channel_preview_all_stop').show();
				}else {
					$('#channel_preview_all_stop').hide();
				}
			}else {
				$('#channel_preview_all_stop').hide();
			}
			
			//抓拍
			//通道所在设备是否在线
			if(!device.isOnline()) {
				$('#channel_image_capture_channel').hide();
			}else {
				$('#channel_image_capture_channel').show();
			}
			//已配置对讲
			if(typeof paneInfo != 'undefined' && paneInfo != null 
					&& device.isTalkbackSupport() && device.isOnline()) {
				if (paneInfo.isVehiTalking(vehicle.getName())){
					$('#channel_talkback_mic_start').hide();
					$('#channel_talkback_mic_stop').show();
				} else {
					$('#channel_talkback_mic_start').show();
					$('#channel_talkback_mic_stop').hide();
				}
			}else {
				$('#channel_talkback_mic_start').hide();
				$('#channel_talkback_mic_stop').hide();
			}
			//已配置监听
			if(typeof paneInfo != 'undefined' && paneInfo != null 
					&& device.isMonitorSupport() && device.isOnline()) {
				if (paneInfo.isVehiListening(vehicle.getName(), channelIndex)){
					$('#channel_monitor_mic_start').hide();
					$('#channel_monitor_mic_stop').show();
				} else {
					$('#channel_monitor_mic_start').show();
					$('#channel_monitor_mic_stop').hide();
				}
			}else {
				$('#channel_monitor_mic_start').hide();
				$('#channel_monitor_mic_stop').hide();
			}
			$('#channel_motion_config_channel').show();
		}else {
			$('#channel_preview_mainstream_channel_start').hide();
			$('#channel_preview_mainstream_channel_stop').hide();
			$('#channel_preview_substream_channel_start').hide();
			$('#channel_preview_substream_channel_stop').hide();
			$('#channel_preview_all_stop').hide();
			$('#channel_image_capture_channel').hide();
			$('#channel_talkback_mic_start').hide();
			$('#channel_talkback_mic_stop').hide();
			$('#channel_monitor_mic_start').hide();
			$('#channel_monitor_mic_stop').hide();
			$('#channel_recording_channel').hide();
			$('#channel_motion_config_channel').hide();
		}
	}
}

//公司，车队或者线路菜单显示
//itemId 公司车队线路id
monitorTreeMenu.prototype.companyMenuItemShow = function(itemId) {
	var teamId = vehiTree.getVehiGroupId(itemId);
	var team = parent.vehicleManager.getTeam(teamId);
	//公司或者车队要隐藏线路相关信息
	if(team == null || team.getLevel() != 3) {
		$('#team_show_line_up_team').hide();
		$('#team_hide_line_up_team').hide();
		$('#team_show_line_down_team').hide();
		$('#team_hide_line_down_team').hide();
		$('#team_show_line_monitor_team').hide();
		$('#team_hide_line_monitor_team').hide();
	}else {//线路
		if(team.isOnShowUpMap()) {//上行线路已经显示在地图上
			$('#team_show_line_up_team').hide();
			$('#team_hide_line_up_team').show();
		}else {
			$('#team_show_line_up_team').show();
			$('#team_hide_line_up_team').hide();
		}
		if(team.isOnShowDownMap()) {//下行线路已经显示在地图上
			$('#team_show_line_down_team').hide();
			$('#team_hide_line_down_team').show();
		}else {
			$('#team_show_line_down_team').show();
			$('#team_hide_line_down_team').hide();
		}
		if(team.isOnMonitor()) {//线路已经加入线路监控列表
			$('#team_show_line_monitor_team').hide();
			$('#team_hide_line_monitor_team').show();
		}else {
			$('#team_show_line_monitor_team').show();
			$('#team_hide_line_monitor_team').hide();
		}
	}
}

//车辆树的右键点击事件  itemId 节点Id
monitorTreeMenu.prototype.rightClickHandlerOnTree = function(itemId) {
	//隐藏上一个弹出菜单
	this.hideContextMenu(this.oldRightTreeItem);
	if(typeof vehiTree != 'undefined' && vehiTree != null) {
		if(vehiTree.isVehicleItem(itemId)) {//如果选中车辆
			var vehicle = parent.vehicleManager.getVehicle(itemId);
			if(vehicle != null && vehicle.getDevList() != null) {
				if(vehicle.getDevList().length == 1) {
					this.vehicleMenuItemShow(vehicle, vehicle.getDevList()[0]);
				}else {
					this.vehicleMenuItemShow(vehicle);
				}
			}
		}else if(vehiTree.isChannelItem(itemId)) {//选中通道
			this.channelMenuItemShow(itemId);
		}else {//选中公司，车队或者线路
			this.companyMenuItemShow(itemId);
		}
	}
	this.oldRightTreeItem = itemId;
}

//加载通道菜单选项
monitorTreeMenu.prototype.loadChannelItems = function(){
	//通道右键菜单
	this.channelItems = [];
	//有看视频权限
	if(this.roleCls.isPermit(621)) {
		this.channelItems.push({id: 'preview_mainstream_channel_start', text: parent.lang.preview_streamMain/*, img: 'red.gif'*/});
		this.channelItems.push({id: 'preview_mainstream_channel_stop', text: parent.lang.preview_streamMain_stop/*, img: 'red.gif'*/});
		this.channelItems.push({id: 'preview_substream_channel_start', text: parent.lang.preview_streamSub/*, img: 'white.gif'*/});
		this.channelItems.push({id: 'preview_substream_channel_stop', text: parent.lang.preview_streamSub_stop/*, img: 'white.gif'*/});
		this.channelItems.push({id: 'preview_all_stop', text: parent.lang.video_stop_all/*, img: 'red.gif'*/});
	}
	//有抓拍权限
	if(this.roleCls.isPermit(625)) {
		this.channelItems.push({id: 'image_capture_channel', text: parent.lang.frontCapture/*, img: 'yellow.gif'*/});
	}
	//有对讲权限
	if(this.roleCls.isPermit(623)) {
		this.channelItems.push({id: 'talkback_mic_start', text: parent.lang.startTalkback/*, img: 'blue.gif'*/});
		this.channelItems.push({id: 'talkback_mic_stop', text: parent.lang.stopTalkback/*, img: 'blue.gif'*/});
	}
	//有监听权限
	if(this.roleCls.isPermit(624)) {
		this.channelItems.push({id: 'monitor_mic_start', text: parent.lang.startMonitor/*, img: 'green.gif'*/});
		this.channelItems.push({id: 'monitor_mic_stop', text: parent.lang.stopMonitor/*, img: 'green.gif'*/});
	}
	//有录像权限
	if(this.roleCls.isPermit(627)) {
//		this.channelItems.push({id: 'recording_channel', text: parent.lang.startRecording/*, img: 'red.gif'*/});
	}
	//有移动侦测权限
	if(this.roleCls.isPermit(655)) {
///		this.channelItems.push({id: 'motion_config_channel', text: parent.lang.motion_detection_configuration/*, img: 'green.gif'*/});
	}
}

//添加通道菜单
monitorTreeMenu.prototype.addChannelMenu = function(channelIndex) {
	//本类对象
	var myMenu = this;
	this.loadChannelMenu('channel_', channelIndex.toString(), this.channelItems, function(itemId) {
		myMenu.channelMenuClick(itemId);
	});
}

//加载车辆右键菜单选项
monitorTreeMenu.prototype.loadVehicleItems = function(){
	//右键菜单
	this.vehicleItems = [];//车辆右键菜单
	var videoDeviceItems = []; //视频设备
	var gpsDeviceItems = []; //视频设备
	//有看视频权限
	if(this.roleCls.isPermit(621)) {
		this.vehicleItems.push({id: 'preview_all_start', text: parent.lang.video_play_all/*, img: 'red.gif'*/});
		this.vehicleItems.push({id: 'preview_all_stop', text: parent.lang.video_stop_all/*, img: 'red.gif'*/});
	}
	//有对讲权限
	if(this.roleCls.isPermit(623)) {
		this.vehicleItems.push({id: 'talkback_mic_start', text: parent.lang.startTalkback/*, img: 'blue.gif'*/});
		this.vehicleItems.push({id: 'talkback_mic_stop', text: parent.lang.stopTalkback/*, img: 'blue.gif'*/});
	}
	//有监听权限
	if(this.roleCls.isPermit(624)) {
		this.vehicleItems.push({id: 'monitor_mic_start', text: parent.lang.startMonitor/*, img: 'green.gif'*/});
		this.vehicleItems.push({id: 'monitor_mic_stop', text: parent.lang.stopMonitor/*, img: 'green.gif'*/});
	}
	//下发文字信息
	if(this.roleCls.isPermit(656)) {
		this.vehicleItems.push({id: 'issued_info', text: parent.lang.monitor_send_message/*, img: 'red.gif'*/});
		videoDeviceItems.push({id: 'issued_info_video', text: parent.lang.monitor_send_message/*, img: 'red.gif'*/});
		gpsDeviceItems.push({id: 'issued_info_gps', text: parent.lang.monitor_send_message/*, img: 'red.gif'*/});
	}
	//有抓拍权限
	if(this.roleCls.isPermit(625)) {
		this.vehicleItems.push({id: 'image_capture', text: parent.lang.frontCapture/*, img: 'yellow.gif'*/});
	}
	//电话回拨  808设备
	this.vehicleItems.push({id: 'phone_callback', text: parent.lang.monitor_phone_callback/*, img: 'green.gif'*/});
	videoDeviceItems.push({id: 'phone_callback_video', text: parent.lang.monitor_phone_callback/*, img: 'green.gif'*/});
	gpsDeviceItems.push({id: 'phone_callback_gps', text: parent.lang.monitor_phone_callback/*, img: 'green.gif'*/});
	
	if(this.roleCls.isPermit(656)) {
		//车辆控制
		this.vehicleItems.push({id: 'vehicle_control', text: parent.lang.monitor_vehicleControl/*, img: 'green.gif'*/});
		//GPS上报间隔
		this.vehicleItems.push({id: 'gps_report_interval', text: parent.lang.monitor_GPS_reporting_interval_settings/*, img: 'green.gif'*/});	
	}
	
	//流量配置和统计
	if(this.roleCls.isPermit(654)) {
//		this.vehicleItems.push({id: '3G_count', text: parent.lang.network_traffic_statistic/*, img: 'red.gif'*/});
		this.vehicleItems.push({id: '3G_config', text: parent.lang.traffic_of_3G_parameter_configuration/*, img: 'green.gif'*/});
	}
	//WIFI下载任务设置
	this.vehicleItems.push({id: 'wifi_download_task', text: parent.lang.wifi_download_task_settings/*, img: 'red.gif'*/});
	
	//设备信息查看
	if(this.roleCls.isPermit(652)) {
		this.vehicleItems.push({id: 'device_info', text: parent.lang.device_information/*, img: 'blue.gif'*/});
		videoDeviceItems.push({id: 'device_info_video', text: parent.lang.device_information/*, img: 'red.gif'*/});
		gpsDeviceItems.push({id: 'device_info_gps', text: parent.lang.device_information/*, img: 'red.gif'*/});
	}
	//离线升级和在线升级
	if(this.roleCls.isPermit(653)) {
		this.vehicleItems.push({id: 'online_upgrade', text: parent.lang.monitor_deviceUpgrade/*, img: 'green.gif'*/});
		this.vehicleItems.push({id: 'offline_upgrade', text: parent.lang.offlineUpgrade/*, img: 'green.gif'*/});
		videoDeviceItems.push({id: 'online_upgrade_video', text: parent.lang.monitor_deviceUpgrade/*, img: 'red.gif'*/});
		videoDeviceItems.push({id: 'offline_upgrade_video', text: parent.lang.offlineUpgrade/*, img: 'red.gif'*/});
		gpsDeviceItems.push({id: 'online_upgrade_gps', text: parent.lang.monitor_deviceUpgrade/*, img: 'red.gif'*/});
		gpsDeviceItems.push({id: 'offline_upgrade_gps', text: parent.lang.offlineUpgrade/*, img: 'red.gif'*/});
		//下发文件
		this.vehicleItems.push({id: 'issued_file', text: parent.lang.issuedFile/*, img: 'green.gif'*/});
		videoDeviceItems.push({id: 'issued_file_video', text: parent.lang.issuedFile/*, img: 'red.gif'*/});
		gpsDeviceItems.push({id: 'issued_file_gps', text: parent.lang.issuedFile/*, img: 'red.gif'*/});
	}
	//油量配置
	this.vehicleItems.push({id: 'oil_config', text: parent.lang.oil_config/*, img: 'blue.gif'*/});
	
	//参数配置
	if(this.roleCls.isPermit(651)) {
		this.vehicleItems.push({id: 'param_config', text: parent.lang.monitor_paramConfig/*, img: 'blue.gif'*/});
		videoDeviceItems.push({id: 'param_config_video', text: parent.lang.monitor_paramConfig/*, img: 'red.gif'*/});
		gpsDeviceItems.push({id: 'param_config_gps', text: parent.lang.monitor_paramConfig/*, img: 'red.gif'*/});
	}
	//TPMS
	if(this.roleCls.isPermit(656)) {
		this.vehicleItems.push({id: 'tpms_info', text: 'TPMS'/*, img: 'red.gif'*/});
		videoDeviceItems.push({id: 'tpms_info_video', text: 'TPMS'/*, img: 'red.gif'*/});
		gpsDeviceItems.push({id: 'tpms_info_gps', text: 'TPMS'/*, img: 'red.gif'*/});
	}
	//视频菜单
	this.vehicleItems.push({id: 'videoDevice', text: parent.lang.videoDevice,items: videoDeviceItems});
	//GPS菜单
	this.vehicleItems.push({id: 'GPSDevice', text: parent.lang.gpsDevice,items: gpsDeviceItems});
}

//添加车辆右键菜单
monitorTreeMenu.prototype.addVehicleMenu = function(vehiIdnos) {
	//本类对象
	var myMenu = this;
	this.loadVehicleMenu('vehicleInfo_', vehiIdnos.toString(), this.vehicleItems, function(itemId) {
		myMenu.vehicleMenuClick(itemId);
	});
}

//添加公司和车队菜单
monitorTreeMenu.prototype.addTeamMenu = function(){
	var team = [];
	var vehiTeam = parent.vehicleManager.getAllVehiTeam();
	if(typeof vehiTree != 'undefined' && vehiTree != null) {
		team.push(vehiTree.getTreeGroupId(0));
		for (var i = 0; i < vehiTeam.length; i++) {
			team.push(vehiTree.getTreeGroupId(vehiTeam[i].id));
		}
	}
	
	//公司和车队右键菜单
	var teamItems = [];
	//有下发权限
	if(this.roleCls.isPermit(656)) {
		teamItems.push({id: 'issued_info_team', text: parent.lang.monitor_send_message/*, img: 'red.gif'*/});
	}
//	teamItems.push({id: 'statistics_team', text: '统计', img: 'white.gif'});
	if(this.roleCls.isManageLine()) {
		//显示上行线路
		teamItems.push({id: 'show_line_up_team', text: parent.lang.monitor_show_line_up/*, img: 'red.gif'*/});
		//隐藏上行线路
		teamItems.push({id: 'hide_line_up_team', text: parent.lang.monitor_hide_line_up/*, img: 'red.gif'*/});
		//显示下行线路
		teamItems.push({id: 'show_line_down_team', text: parent.lang.monitor_show_line_down/*, img: 'red.gif'*/});
		//隐藏下行线路
		teamItems.push({id: 'hide_line_down_team', text: parent.lang.monitor_hide_line_down/*, img: 'red.gif'*/});
		//显示线路监控
		teamItems.push({id: 'show_line_monitor_team', text: parent.lang.monitor_show_line_monitor/*, img: 'red.gif'*/});
		//取消线路监控
		teamItems.push({id: 'hide_line_monitor_team', text: parent.lang.monitor_hide_line_monitor/*, img: 'red.gif'*/});
	}
	
	//本类对象
	var myMenu = this;
	this.loadTeamMenu('team_', team.toString(), teamItems, function(itemId) {
		myMenu.teamMenuClick(itemId);
	});
}

//停止车辆是所有正在预览的视频
monitorTreeMenu.prototype.stopAllVehiVideo=function(vehiIdno){
	if(vehiIdno != null) {
		var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
		if(vehicle != null) {
			//存在视频设备
			var vedioDevice = vehicle.getVideoDevice(); //视频设备
			if(vedioDevice != null) {
				var count = vedioDevice.getChnCount();
				if (count <= 0) {
					count = 1;
				}
				if(typeof ttxVideo != 'undefined' && ttxVideo != null) {
					//停止预览主码流
					for (var i = 0; i < count; i++) {
						if(ttxVideo.isPlaying(vedioDevice.getIdno(), i, ttxVideo.STREAM_MAIN)) {
							ttxVideo.stopChannelPreview(vedioDevice.getIdno(), i, ttxVideo.STREAM_MAIN);
						}
					}
					//停止预览子码流
					for (var i = 0; i < count; i++) {
						if(ttxVideo.isPlaying(vedioDevice.getIdno(), i, ttxVideo.STREAM_SUB)) {
							ttxVideo.stopChannelPreview(vedioDevice.getIdno(), i, ttxVideo.STREAM_SUB);
						}
					}
				}
			}
		}
	}
}

//设备菜单点击事件
monitorTreeMenu.prototype.vehicleMenuClick = function(itemId){
	if(itemId != null && itemId != '') {
		var vehiIdno = vehiTree.getSelectedItemId(); //车辆id
		if(itemId == 'preview_all_start') {//预览所有视频
			if((typeof previewVideo) == 'function'/* && (typeof currentPage) != 'undefined' && currentPage != "weizhi"*/) {
				//如果视频窗口没展现，则不响应
				previewVideo(vehiIdno.toString(), -1);
			}
		} else if(itemId == 'preview_all_stop') {//停止所有视频
			this.stopAllVehiVideo(vehiIdno.toString());
		} else if(itemId == 'image_capture') {//前端抓拍
			if(typeof monitorMedia != 'undefined' && monitorMedia != null) {
				monitorMedia.beforeImageCapture(-1, vehiIdno.toString());
			}
		} else if(itemId == 'issued_info' || itemId == 'issued_info_video' || itemId == 'issued_info_gps') { //下发文字信息
			var teamTreeId = vehiTree.getSelectOrParentGroupId(); //公司车队id
			var vehiTeamId = vehiTree.getVehiGroupId(teamTreeId);
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno.toString());
			var devIdno = "";
			if(itemId == 'issued_info_video') {
				var videoDevice = vehicle.getVideoDevice();
				if(videoDevice != null) {
					devIdno = videoDevice.getIdno();
				}
			}else if(itemId == 'issued_info_gps') {
				var gpsDevice = vehicle.getGpsDevice();
				if(gpsDevice != null) {
					devIdno = gpsDevice.getIdno();
				}
			}
			this.issuedInformation(vehiTeamId, vehiIdno.toString(), devIdno);
		} else if (itemId == 'talkback_mic_start' || itemId == 'talkback_mic_stop') {//对讲
			if(typeof paneInfo != 'undefined' && paneInfo != null) {
				paneInfo.doTalkback(vehiIdno.toString());
			}
		} else if (itemId == 'monitor_mic_start' || itemId == 'monitor_mic_stop') {//监听
			if(typeof paneInfo != 'undefined' && paneInfo != null) {
				paneInfo.doListen(vehiIdno.toString(), -1);
			}
		} else if (itemId == 'online_upgrade') {//设备升级（在线）单设备
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			this.offlineUpgrade(vehiIdno,vehicle.devList[0].getIdno(),false,true);
		} else if (itemId == 'offline_upgrade') {//设备离线升级 单设备
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			this.offlineUpgrade(vehiIdno,vehicle.devList[0].getIdno(),false,true);
		} else if (itemId == 'online_upgrade_video') {//设备升级（在线）视频设备
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			this.offlineUpgrade(vehiIdno,vehicle.getVideoDevice().getIdno(),true,true);
		} else if (itemId == 'online_upgrade_gps') {//设备升级（在线）GPS设备
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			this.offlineUpgrade(vehiIdno,vehicle.getGpsDevice().getIdno(),true,true);
		} else if (itemId == 'offline_upgrade_video') {//设备离线升级 视频设备
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			this.offlineUpgrade(vehiIdno,vehicle.getVideoDevice().getIdno(),true,true);
		} else if (itemId == 'offline_upgrade_gps') {//设备离线升级 GPS设备
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			this.offlineUpgrade(vehiIdno,vehicle.getGpsDevice().getIdno(),true,true);
		}else if (itemId == 'issued_file') {//下发文件  单设备
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			this.offlineUpgrade(vehiIdno,vehicle.devList[0].getIdno(),false,false);
		} else if (itemId == 'issued_file_video') {//下发文件 视频设备
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			this.offlineUpgrade(vehiIdno,vehicle.getVideoDevice().getIdno(),true,false);
		} else if (itemId == 'issued_file_gps') {//下发文件 GPS设备
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			this.offlineUpgrade(vehiIdno,vehicle.getGpsDevice().getIdno(),true,false);
		} else if (itemId == 'oil_config') {//油量配置
			this.oilConfig(vehiIdno);
		} else if(itemId == '3G_config') {//网络流量配置(双设备针对视频设备)
			this.deviceFlowConfig(vehiIdno);
		} else if(itemId == 'device_info') {//设备信息
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			var device = vehicle.devList[0];
			this.findDeviceInfo(vehiIdno, device.getIdno());
		} else if(itemId == 'device_info_gps') {//GPS设备信息
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			var device = vehicle.getGpsDevice();
			this.findDeviceInfo(vehiIdno, device.getIdno());
		} else if(itemId == 'device_info_video') {//视频设备信息
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			var device = vehicle.getVideoDevice();
			this.findDeviceInfo(vehiIdno, device.getIdno());
		} else if(itemId == 'vehicle_control') {//车辆控制指令
			if(typeof monitorMedia != 'undefined' && monitorMedia != null) {
				monitorMedia.doVehicleControl(vehiIdno);
			}
		} else if(itemId == 'wifi_download_task') {//WIFI下载任务设置
			//alert(parent.lang.support_next_version);
			this.doWifiDownloadTask(vehiIdno);
		} else if(itemId == 'gps_report_interval') {//GPS上报间隔
			if(typeof monitorMedia != 'undefined' && monitorMedia != null) {
				monitorMedia.doGpsReportInterval(vehiIdno);
			}
		} else if(itemId == 'param_config' || itemId == 'param_config_video'
			 || itemId == 'param_config_gps') {//808参数配置
			//alert(parent.lang.support_next_version);
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			var device = null;
			if(itemId == 'param_config_video') {
				device = vehicle.getVideoDevice();
			}else if(itemId == 'param_config_gps') {
				device = vehicle.getGpsDevice();
			}else {
				device = vehicle.devList[0];
			}
			if(device.isCan808ParamConfig()) {//808参数配置
				this.do808ParamConfig(vehiIdno, device.getIdno());	
			}else {//ttx参数配置
				this.doTtxParamConfig(vehiIdno, device.getIdno());
			}
		} else if(itemId == 'tpms_info' || itemId == 'tpms_info_video'
			 || itemId == 'tpms_info_gps') {//TPMS
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			var device = null;
			if(itemId == 'tpms_info_video') {
				device = vehicle.getVideoDevice();
			}else if(itemId == 'tpms_info_gps') {
				device = vehicle.getGpsDevice();
			}else {
				device = vehicle.devList[0];
			}
			this.findTpmsInfo(vehiIdno, device.getIdno());
		} else if(itemId == 'phone_callback' || itemId == 'phone_callback_video'
			 || itemId == 'phone_callback_gps') {//808电话回拨
			//alert(parent.lang.support_next_version);
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
			var device = null;
			if(itemId == 'phone_callback_video') {
				device = vehicle.getVideoDevice();
			}else if(itemId == 'phone_callback_gps') {
				device = vehicle.getGpsDevice();
			}else {
				device = vehicle.devList[0];
			}
			this.do808PhoneCallback(vehiIdno, device.getIdno());	
		}else {
			alert(parent.lang.support_next_version);
//			alert(itemId);
		}
	}
}

//通道菜单点击事件
monitorTreeMenu.prototype.channelMenuClick = function(itemId){
	if(itemId != null && itemId != '') {
		var channelId = vehiTree.getSelectedItemId(); //通道id
		var vehiIdno = vehiTree.getChannelVehiIdno(channelId);//车辆id
		var channelIndex = vehiTree.getChannelIndex(channelId); //通道号
		if(itemId == 'image_capture_channel') {//前端抓拍
			if(typeof monitorMedia != 'undefined' && monitorMedia != null) {
				monitorMedia.beforeImageCapture(channelIndex, vehiIdno.toString());
			}
		} else if(itemId == 'preview_mainstream_channel_start'){//预览主码流
			if((typeof previewVideo) == 'function' && typeof ttxVideo != 'undefined' && ttxVideo != null) {
				previewVideo(vehiIdno.toString(), channelIndex, ttxVideo.STREAM_MAIN);
			}
		} else if(itemId == 'preview_substream_channel_start'){//预览子码流
			if((typeof previewVideo) == 'function'  && typeof ttxVideo != 'undefined' && ttxVideo != null) {
				previewVideo(vehiIdno.toString(), channelIndex, ttxVideo.STREAM_SUB);
			}
		} else if(itemId == 'preview_mainstream_channel_stop' || itemId == 'preview_substream_channel_stop'){
			var vehicle = parent.vehicleManager.getVehicle(vehiIdno.toString());
			var device = vehicle.getVideoDevice();
			if(typeof ttxVideo != 'undefined' && ttxVideo != null) {
				if(itemId == 'preview_mainstream_channel_stop') {//停止主码流
					ttxVideo.stopChannelPreview(device.getIdno(), channelIndex, ttxVideo.STREAM_MAIN);
				}else {//停止子码流
					ttxVideo.stopChannelPreview(device.getIdno(), channelIndex, ttxVideo.STREAM_SUB);
				}
			}
		} else if(itemId == 'preview_all_stop') { //停止所有视频
			this.stopAllVehiVideo(vehiIdno.toString());
		} else if (itemId == 'talkback_mic_start' || itemId == 'talkback_mic_stop') {//对讲
			if(typeof paneInfo != 'undefined' && paneInfo != null) {
				paneInfo.doTalkback(vehiIdno.toString());
			}
		} else if (itemId == 'monitor_mic_start' || itemId == 'monitor_mic_stop') {//监听
			if(typeof paneInfo != 'undefined' && paneInfo != null) {
				paneInfo.doListen(vehiIdno.toString(), channelIndex);
			}
		}else {
			alert(parent.lang.support_next_version);
//			alert(itemId);
		}
	}
}

//下发文字信息
monitorTreeMenu.prototype.issuedInformation = function(vehiTeamId, vehiIdno, devIdno) {
	if(this.issuedInfoObj == null) {
		var url = 'url:LocationManagement/issuedInformation.html?vehiTeamId='+vehiTeamId;
		if(vehiIdno != null && vehiIdno != '') {
			url += '&vehiIdno='+encodeURI(vehiIdno);
		}
		if(devIdno != null && devIdno != '') {
			url += '&devIdno='+devIdno;
		}
		var myMenu = this;
		this.issuedInfoObj = $.dialog({id:'issuedInfo', title: parent.lang.monitor_send_message, content: url,
			width: '800px', height: '600px', min:true, max:false, lock:false,fixed:false
				, resize:false, close: function() {
					myMenu.issuedInfoObj = null;
					if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
						popTipsObject.remove('issuedInfo');
					}
				} });
	}else {
		if(this.issuedInfoObj.content && (typeof this.issuedInfoObj.content.initPageInfo == 'function')) {
			this.issuedInfoObj.content.initPageInfo(vehiTeamId, vehiIdno, devIdno);
		}
		this.issuedInfoObj.show();
	}
	
	if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
		popTipsObject.put('issuedInfo', this.issuedInfoObj);
	}
	if(typeof hidePopTips == 'function'){
		hidePopTips('issuedInfo');
	}
}

//公司车队菜单点击事件
monitorTreeMenu.prototype.teamMenuClick = function(itemId){
	if(itemId != null && itemId != '') {
		var teamTreeId = vehiTree.getSelectedItemId(); //公司车队id
		var vehiTeamId = vehiTree.getVehiGroupId(teamTreeId);
		if(itemId == 'issued_info_team') {//下发文字信息
			this.issuedInformation(vehiTeamId);
		}else if(itemId == 'show_line_up_team' || itemId == 'hide_line_up_team') {
			//显示上行线路到地图   //删除上行线路到地图
			if(typeof monitorLine != 'undefined' && monitorLine != null) {
				if(itemId == 'show_line_up_team') {
					monitorLine.displayLineOnMap(vehiTeamId, 0, true);
				}else {
					monitorLine.displayLineOnMap(vehiTeamId, 0, false);
				}
			}
		}else if(itemId == 'show_line_down_team' || itemId == 'hide_line_down_team') {
			//显示下行线路到地图   //删除下行线路到地图
			if(typeof monitorLine != 'undefined' && monitorLine != null) {
				if(itemId == 'show_line_down_team') {
					monitorLine.displayLineOnMap(vehiTeamId, 1, true);
				}else {
					monitorLine.displayLineOnMap(vehiTeamId, 1, false);
				}
			}
		}else if(itemId == 'show_line_monitor_team' || itemId == 'hide_line_monitor_team') {
			//显示线路监控 //删除线路监控
			if(typeof monitorLine != 'undefined' && monitorLine != null) {
				if(itemId == 'show_line_monitor_team') {
					monitorLine.selectLine(vehiTeamId, true, true);
				}else {
					monitorLine.selectLine(vehiTeamId, false, true);
				}
			}
		}else {
			alert(parent.lang.support_next_version);
		//	alert(itemId);
		}
	}
}

//右键离线升级事件
monitorTreeMenu.prototype.offlineUpgrade = function(vehiIdno,devIdno,showDevIdno, isUpgrade){
	if(devIdno != null && devIdno != '') {
		var device = parent.vehicleManager.getDevice(devIdno);
		if(this.upgradeObj != 'undefined' && this.upgradeObj != null){
			$.dialog.list['upgrade'].content.ResetUpgradePage(vehiIdno,devIdno,device.status.protocol,device.status.factoryType,showDevIdno, isUpgrade);
			this.upgradeObj.show();
		}else {
			var url = 'url:LocationManagement/upgrademation.html?vehiIdno='+encodeURI(vehiIdno)+'&devIdno='+devIdno+'&protocol='+device.status.protocol+'&factoryType='+device.status.factoryType+'&showDevIdno='+showDevIdno+'&isUpgrade='+isUpgrade;
			this.upgradeObj = $.dialog({id:'upgrade', title: parent.lang.monitor_deviceUpgrade, content: url,
				width: '600px', height: '245px', min:true, max:false, lock: false,fixed:false
					, resize:false, close: function() {
						monitorMenu.upgradeObj = null;
						if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
							popTipsObject.remove('upgrade');
						}
					} });
		}
		
		if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
			popTipsObject.put('upgrade', this.upgradeObj);
		}
		if(typeof hidePopTips == 'function'){
			hidePopTips('upgrade');
		}
	}
}

monitorTreeMenu.prototype.findTpmsInfo = function(vehiIdno,devIdno){
	if(this.tpmsInfoObj == null) {
		var myMenu = this;
		var url = 'url:LocationManagement/tpmsInfoFind.html?vehiIdno='+encodeURI(vehiIdno)+'&devIdno='+devIdno;
		this.tpmsInfoObj = $.dialog({id:'tpmsInfo', title: 'TPMS', content: url,
			width: '640px', height: '520px', min:true, max:false, lock: false,fixed:false
				, resize:false, close: function() {
					myMenu.tpmsInfoObj = null;
					if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
						popTipsObject.remove('tpmsInfo');
					}
				} });
	}else {
		if(this.tpmsInfoObj.content && (typeof this.tpmsInfoObj.content.initPageInfo == 'function')) {
			this.tpmsInfoObj.content.initPageInfo(vehiIdno, devIdno);
		}
		this.tpmsInfoObj.show();
	}
	
	if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
		popTipsObject.put('tpmsInfo', this.tpmsInfoObj);
	}
	if(typeof hidePopTips == 'function'){
		hidePopTips('tpmsInfo');
	}
}

monitorTreeMenu.prototype.doSaveOflTaskSuccess = function(){
	this.upgradeObj.close();
	this.upgradeObj = null;
	$.dialog.tips(parent.lang.saveok, 1);
}

//右键油量配置
monitorTreeMenu.prototype.oilConfig = function(vehiIdno){
	if(this.oilConfigObj != 'undefined' && this.oilConfigObj != null){
		$.dialog.list['oilConfig'].content.ResetOilConfigPage(vehiIdno);
		this.oilConfigObj.show();
	}else {
		var url = 'url:LocationManagement/oilConfig.html?vehiIdno='+encodeURI(vehiIdno);
		this.oilConfigObj = $.dialog({id:'oilConfig', title: parent.lang.oil_config, content: url,
			width: '650px', height: '600px', min:true, max:false, lock: false,fixed:false
				, resize:false, close: function() {
					monitorMenu.oilConfigObj = null;
					if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
						popTipsObject.remove('oilConfig');
					}
				} });
	}
	
	if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
		popTipsObject.put('oilConfig', this.oilConfigObj);
	}
	if(typeof hidePopTips == 'function'){
		hidePopTips('oilConfig');
	}
}

//右键网络流量配置(双设备针对视频设备)
monitorTreeMenu.prototype.deviceFlowConfig = function(vehiIdno){
	if(this.flowConfigObj == null) {
		var myMenu = this;
		var url = 'url:LocationManagement/deviceFlowConfig.html?vehiIdno='+encodeURI(vehiIdno);
		this.flowConfigObj = $.dialog({id:'flowConfig', title: parent.lang.traffic_of_3G_parameter_configuration +' - ' + vehiIdno, content: url,
			width: '800px', height: '450px', min:true, max:false, lock: false,fixed:false
				, resize:false, close: function() {
					myMenu.flowConfigObj = null;
					if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
						popTipsObject.remove('flowConfig');
					}
				} });
	}else {
		var title = parent.lang.traffic_of_3G_parameter_configuration +' - ' + vehiIdno;
		this.flowConfigObj.title(title);
		if(this.flowConfigObj.content && (typeof this.flowConfigObj.content.initPageInfo == 'function')) {
			this.flowConfigObj.content.initPageInfo(vehiIdno);
		}
		this.flowConfigObj.show();
	}
	
	if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
		popTipsObject.put('flowConfig', this.flowConfigObj);
	}
	if(typeof hidePopTips == 'function'){
		hidePopTips('flowConfig');
	}
}

//右键设备信息查看
monitorTreeMenu.prototype.findDeviceInfo = function(vehiIdno, devIdno) {
	if(this.deviceInfoObj == null) {
		var myMenu = this;
		var url = 'url:LocationManagement/deviceInfoFind.html?vehiIdno='+encodeURI(vehiIdno)+'&devIdno='+devIdno;
		this.deviceInfoObj = $.dialog({id:'deviceInfo', title: parent.lang.device_information, content: url,
			width: '640px', height: '520px', min:true, max:false, lock: false,fixed:false
				, resize:false, close: function() {
					myMenu.deviceInfoObj = null;
					if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
						popTipsObject.remove('deviceInfo');
					}
				} });
	}else {
		if(this.deviceInfoObj.content && (typeof this.deviceInfoObj.content.initPageInfo == 'function')) {
			this.deviceInfoObj.content.initPageInfo(vehiIdno, devIdno);
		}
		this.deviceInfoObj.show();
	}
	
	if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
		popTipsObject.put('deviceInfo', this.deviceInfoObj);
	}
	if(typeof hidePopTips == 'function'){
		hidePopTips('deviceInfo');
	}
}

//WIFI下载任务设置
monitorTreeMenu.prototype.doWifiDownloadTask = function(vehiIdno) {
	if(this.wifiTaskObj == null) {
		var myMenu = this;
		var url = 'url:LocationManagement/wifiDownloadTask.html?vehiIdno='+encodeURI(vehiIdno);
		this.wifiTaskObj = $.dialog({id:'wifiTask', title: parent.lang.wifi_download_task_settings +' - ' + vehiIdno, content: url,
			width: '800px', height: '500px', min:true, max:false, lock: false,fixed:false
				, resize:false, close: function() {
					myMenu.wifiTaskObj = null;
					if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
						popTipsObject.remove('wifiTask');
					}
				} });
	}else {
		this.wifiTaskObj.title(parent.lang.wifi_download_task_settings +' - ' + vehiIdno);
		if(this.wifiTaskObj.content && (typeof this.wifiTaskObj.content.initPageInfo == 'function')) {
			this.wifiTaskObj.content.initPageInfo(vehiIdno);
		}
		this.wifiTaskObj.show();
	}
	
	if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
		popTipsObject.put('wifiTask', this.wifiTaskObj);
	}
	if(typeof hidePopTips == 'function'){
		hidePopTips('wifiTask');
	}
}

//808参数配置
monitorTreeMenu.prototype.do808ParamConfig = function(vehiIdno, devIdno) {
	if(this.paramConfigObj == null) {
		var myMenu = this;
		var url = 'url:LocationManagement/deviceParamConfig.html?vehiIdno='+ encodeURI(vehiIdno)+'&devIdno='+ devIdno;
		this.paramConfigObj = $.dialog({id:'paramConfig', title: parent.lang.monitor_paramConfig +' - ' + vehiIdno, content: url,
			width: '900px', height: '630px', min:true, max:false, lock: false,fixed:false
				, resize:false, close: function() {
					myMenu.paramConfigObj = null;
					if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
						popTipsObject.remove('paramConfig');
					}
				} });
	}else {
		this.paramConfigObj.title(parent.lang.monitor_paramConfig +' - ' + vehiIdno);
		if(this.paramConfigObj.content && (typeof this.paramConfigObj.content.initPageInfo == 'function')) {
			this.paramConfigObj.content.initPageInfo(vehiIdno, devIdno);
		}
		this.paramConfigObj.show();
	}
	
	if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
		popTipsObject.put('paramConfig', this.paramConfigObj);
	}
	if(typeof hidePopTips == 'function'){
		hidePopTips('paramConfig');
	}
}

//ttx参数配置
monitorTreeMenu.prototype.doTtxParamConfig = function(vehiIdno, devIdno) {
	if(this.ttxParamConfigObj == null) {
		var myMenu = this;
		var url = 'url:LocationManagement/deviceParamConfigTtx.html?vehiIdno='+ encodeURI(vehiIdno)+'&devIdno='+ devIdno;
		this.ttxParamConfigObj = $.dialog({id:'ttxParamConfig', title: parent.lang.monitor_paramConfig +' - ' + vehiIdno, content: url,
			width: '700px', height: '600px', min:true, max:false, lock: false,fixed:false
				, resize:false, close: function() {
					myMenu.ttxParamConfigObj = null;
					if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
						popTipsObject.remove('ttxParamConfig');
					}
				} });
	}else {
		this.ttxParamConfigObj.title(parent.lang.monitor_paramConfig +' - ' + vehiIdno);
		if(this.ttxParamConfigObj.content && (typeof this.ttxParamConfigObj.content.initPageInfo == 'function')) {
			this.ttxParamConfigObj.content.initPageInfo(vehiIdno, devIdno);
		}
		this.ttxParamConfigObj.show();
	}
	
	if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
		popTipsObject.put('ttxParamConfig', this.ttxParamConfigObj);
	}
	if(typeof hidePopTips == 'function'){
		hidePopTips('ttxParamConfig');
	}
}

//808电话回拨
monitorTreeMenu.prototype.do808PhoneCallback = function(vehiIdno, devIdno) {
	if(this.phoneCallbackObj == null) {
		var myMenu = this;
		var url = 'url:LocationManagement/phoneCallback.html?vehiIdno='+ encodeURI(vehiIdno)+'&devIdno='+ devIdno;
		this.phoneCallbackObj = $.dialog({id:'phoneCallback', title: parent.lang.monitor_phone_callback +' - ' + vehiIdno, content: url,
			width: '600px', height: '300px', min:true, max:false, lock: false,fixed:false
				, resize:false, close: function() {
					myMenu.phoneCallbackObj = null;
					if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
						popTipsObject.remove('phoneCallback');
					}
				} });
	}else {
		this.phoneCallbackObj.title(parent.lang.monitor_phone_callback +' - ' + vehiIdno);
		if(this.phoneCallbackObj.content && (typeof this.phoneCallbackObj.content.initPageInfo == 'function')) {
			this.phoneCallbackObj.content.initPageInfo(vehiIdno, devIdno);
		}
		this.phoneCallbackObj.show();
	}
	
	if(typeof popTipsObject != 'undefined' && popTipsObject != null) {
		popTipsObject.put('phoneCallback', this.phoneCallbackObj);
	}
	if(typeof hidePopTips == 'function'){
		hidePopTips('phoneCallback');
	}
}