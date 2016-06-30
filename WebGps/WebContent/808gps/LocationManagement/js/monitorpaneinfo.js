/**
 * 监控树下方的信息列表类，包括车辆信息，语音，PTZ，颜色
 */

function monitorPaneInfo(){
	this.listenVehiIdno = "";	//监听的车辆信息
	this.listenVehiChn = 0;		//监听的车辆通道信息
	this.isListening = false;	//是否正在监听
	this.talkbackVehiIdno = "";	//对讲的车辆信息
	this.isTalking = false;		//表示是否正在对讲
	this.changeColorTimer = null; //表示调用色彩请求的定时器
	this.showVehiIdno = "";  //显示的车辆车牌号
	this.DEF_PANEINFO_SHOW = "paneInfo";
}

//添加信息界面显示或者隐藏的状态到cookie
monitorPaneInfo.prototype.setCookiePaneInfoShow = function(value) {
	$.cookie(this.DEF_PANEINFO_SHOW, value, { expires: 365 });
}

//获取cookie中信息界面显示或者隐藏的状态
monitorPaneInfo.prototype.getCookiePaneInfoShow = function() {
	return Number($.cookie(this.DEF_PANEINFO_SHOW));
}

monitorPaneInfo.prototype.initPaneInfo = function() {
	var pane = this;
	this.initPaneLang();
	//状态栏切换
	$( ".tab_state" ).tabs({
		activate : function() {
			pane.resizeVehiTree();
			if( !$(".icon_state_box").find("i").hasClass("icon_down") ){
				$(".icon_state_box").find("i").addClass("icon_down");
			}
		}
	});
	//状态展开收缩
	$(".icon_state_box").click(function () {
		var $_index =$(".ui-tabs-active").index(".tab_state_box li");
		if( $(this).find("i").hasClass("icon_down") ){
			pane.setCookiePaneInfoShow(0);
			$(this).find("i").removeClass("icon_down");
			$( ".tab_state > div" ).hide();
			$( ".tab_state" ).tabs("disable",true );
		}else{
			pane.setCookiePaneInfoShow(1);
			$(this).find("i").addClass("icon_down");
			$( ".tab_state > div:eq("+ $_index +")" ).show();
			$( ".tab_state" ).tabs("disable",false );
			//$( ".tab_state > div" ).tabs();
		}
		pane.resizeVehiTree();
	});
	var paneInfoShow = this.getCookiePaneInfoShow();
	if(paneInfoShow != 1) {
		$(".icon_state_box").click();
	}
	
	$('#transfer').addClass('btn_state');
	enterDigital('#spinner');
	$('#spinner').on('keyup',function(){
		if($(this).val() != '' && $(this).val()<1){
			$(this).val(1);
		}else if($(this).val()>128){
			$(this).val(128);
		}
	});
	$('#spinner').on('blur',function(){
		if($(this).val() == ''){
			$(this).val(1);
		}
	});
	$('#btnDefault').on('click',function(){
		if($('#co_0').slider( "value") != 128) {
			$('#co_0').slider( "value", 128);
			$('#state_co_0').val(128);
		}
		if($('#co_1').slider( "value") != 0) {
			$('#co_1').slider( "value", 0);
			$('#state_co_1').val(0);
		}
		if($('#co_2').slider( "value") != 0) {
			$('#co_2').slider( "value", 0);
			$('#state_co_2').val(0);
		}
		if($('#co_3').slider( "value") != 128) {
			$('#co_3').slider( "value", 128);
			$('#state_co_3').val(128);
		}
		if($('#co_4').slider( "value") != 128) {
			$('#co_4').slider( "value", 128);
			$('#state_co_4').val(128);
		}
	});
	this.initPaneDevice();
	this.initPanePtz();
	this.initPaneColor();
	this.initPaneAudio();
	this.setPTZcolorButtonStatus(true);
}

monitorPaneInfo.prototype.initPaneLang = function(){
	$('#state_0 a').text(parent.lang.status);
	$('#state_1 a').text(parent.lang.PTZ);
	$('#state_2 a').text(parent.lang.color);
	$('#state_3 a').text(parent.lang.voice);
	$('#state_vehi b').text(parent.lang.server_name);
	$('#state_devId b').text(parent.lang.device_id);
	$('#state_company b').text(parent.lang.belong_company);
	$('#state_level b').text(parent.lang.motorcade);
	$('#state_status b').text(parent.lang.status);
	$('#state_Gps_time b').text(parent.lang.status_deviceGpsTime);
	$('#state_position b').text(parent.lang.report_position);
	$('#state_speed b').text(parent.lang.monitor_vehiStatusSpeed);
	$('.btn_state1 a').text(parent.lang.defaultValue);
	$('.icon_yt_0').attr('title',parent.lang.left_up);
	$('.icon_yt_1').attr('title',parent.lang.up);
	$('.icon_yt_2').attr('title',parent.lang.right_up);
	$('.icon_yt_3').attr('title',parent.lang.left);
	$('.icon_yt_4').attr('title',parent.lang.automatic_cruise);
	$('.icon_yt_5').attr('title',parent.lang.right);
	$('.icon_yt_6').attr('title',parent.lang.left_down);
	$('.icon_yt_7').attr('title',parent.lang.down);
	$('.icon_yt_8').attr('title',parent.lang.right_down);
	$('.icon_f0_0').attr('title',parent.lang.smaller_focal_length);
	$('.icon_f0_1').attr('title',parent.lang.focal_length_becomes_larger);
	$('.icon_y0_0').attr('title',parent.lang.aperture_down);
	$('.icon_y0_1').attr('title',parent.lang.aperture_zoom);
	$('.icon_k0_0').attr('title',parent.lang.after_adjusting_the_focus);
	$('.icon_k0_1').attr('title',parent.lang.top_notes_of_focus);
	$('.icon_light0_0').attr('title',parent.lang.open_light);
	$('.icon_biao0_1').attr('title',parent.lang.open_wipers);
	$('#transfer').attr('title',parent.lang.call_preset_point);
	$('#set_up').attr('title',parent.lang.set_preset_point);
	$('#delete').attr('title',parent.lang.remove_preset_point);
	$('#transfer').text(parent.lang.transfer);
	$('#set_up').text(parent.lang.set_up);
	$('#delete').text(parent.lang.del);
}

monitorPaneInfo.prototype.resizeVehiTree = function() {
	var _height = $(window).height();
	$("#vehicle_tree").height(_height - $('.pro_list .dh').height() - $('.tab_state').height());
}

monitorPaneInfo.prototype.onSelectInfoTabs = function(event, ui) {
	paneInfo.resizeVehiTree();
	if( !$(".icon_state_box").find("i").hasClass("icon_down") ){
		$(".icon_state_box").find("i").addClass("icon_down");
	}
}

//初始化设备信息
monitorPaneInfo.prototype.initPaneDevice = function(vehiIdno) {
	if(vehiIdno != null){
		this.showVehiIdno = vehiIdno;
		this.setTextAndTitle('#state_vehi span',vehiIdno);
		var vehicle = parent.vehicleManager.getVehicle(vehiIdno);
		if (vehicle == null) {
			return ;
		}
		var devIds = "";
		if(vehicle.devList != null){
			for (var i = 0; i < vehicle.devList.length; i++) {
				devIds += vehicle.devList[i].getIdno();
				if(i != vehicle.devList.length - 1){
					devIds += ",";
				}
			}
		}
		this.setTextAndTitle('#state_devId span',devIds);
		var team = parent.vehicleManager.getTeam(vehicle.parentId);
		var company = null;
		if(team.level == 1) {
			company = team;
			this.setTextAndTitle('#state_level span', '');
		}else {
			if(team.level == 3) {
				team = parent.vehicleManager.getTeam(team.parentId);
			}
			company = parent.vehicleManager.getTeam(team.companyId);
			this.setTextAndTitle('#state_level span',team.name);
		}
		this.setTextAndTitle('#state_company span',company.name);
		this.refreshVehiStatus(vehiIdno,vehicle);
	}else{
		this.showVehiIdno = '';
		this.setTextAndTitle('#state_vehi span','');
		this.setTextAndTitle('#state_devId span','');
		this.setTextAndTitle('#state_company span','');
		this.setTextAndTitle('#state_level span','');
		this.setTextAndTitle('#state_status span','');
		this.setTextAndTitle('#state_Gps_time span','');
//		this.setTextAndTitle('#state_position div','');
		$('#state_position div').html('<span class="maplngLat"></span>');
		this.setTextAndTitle('#state_speed span','');
	}
}

//标签赋值
monitorPaneInfo.prototype.setTextAndTitle = function(id,text) {
	$(id).html(text);
	$(id).attr('title',text);
}

monitorPaneInfo.prototype.refreshVehiStatus = function(vehiIdno,vehicle) {
	var vehiId = $.trim($('#state_vehi span').text());
	if(vehiId != null && vehiId != "" && vehiIdno == vehiId){
		var data = vehicle.gpsParseTrackStatus();
		if(data.image == 1){
			this.setTextAndTitle('#state_status span',lang.offline);
		}else if(data.image == 2){
			this.setTextAndTitle('#state_status span',lang.monitor_invalid);
		}else if(data.image == 3){
			this.setTextAndTitle('#state_status span',lang.monitor_vehiStatusAlarm);
		}else if(data.image == 9){
			this.setTextAndTitle('#state_status span',lang.monitor_parkAccon);
		}else if(data.image == 10){
			this.setTextAndTitle('#state_status span',lang.track_parkEvent);
		}else{
			this.setTextAndTitle('#state_status span',lang.online);
		}
		this.setTextAndTitle('#state_Gps_time span',data.gpsTime);
		if (data.isGpsValid) {
		//	$('#state_position div').html(position);
			this.addPanePosition(vehiIdno, data);
			this.setTextAndTitle('#state_speed span',data.speed);
		}else{
			$('#state_position div').html('<span class="maplngLat" title="'+lang.monitor_invalid+'">'+lang.monitor_invalid+'</span>');
//			this.setTextAndTitle('#state_position div',lang.monitor_invalid);
			this.setTextAndTitle('#state_speed span','0(' + lang.monitor_invalid +')');
		}
	}
}

monitorPaneInfo.prototype.initPanePtz = function() {
	//加减选择
	$( "#spinner" ).spinner({
	  min: 1,
	  max: 128,
      step:1,
      numberFormat: "n"
    });
	//云台调节
	$( "#yt_handle" ).slider({
		min: 0,
	    max: 255,
		value: 60,
		orientation: "horizontal",
		range: "min",
		animate: true
	});
	//语言
}

monitorPaneInfo.prototype.initPaneColor = function() {
	//亮度控制
	 var monitorPaneInfo = this;
	 var slider_0 = $( "#co_0" ).slider({
	 min: 0,
     max: 255,
     range: "min",
     value: $("#state_co_0").val(),
	 slide:function( event, ui ) {
		 $("#state_co_0").val(ui.value);
		 monitorPaneInfo.setColorControlTimer(monitorPaneInfo);
     },
     orientation: "horizontal",
     range: "min",
     animate: true
   });
	enterDigital('#state_co_0');
	$('#state_co_0').on('keyup',function(){
		if($(this).val() != '' && $(this).val()<0){
			$(this).val(0);
		}else if($(this).val()>255){
			$(this).val(255);
		}
	});
	$('#state_co_0').on('blur',function(){
		if($(this).val() == ''){
			$(this).val(128);
		}
		monitorPaneInfo.setColorControlTimer(monitorPaneInfo);
	});
	  $( "#state_co_0" ).focus(function() {
		  $(this).bind("keyup", function(){
			  slider_0.slider( "value", $("#state_co_0").val() );
		  })
   });
	//对比度控制
	  var slider_1 = $( "#co_1" ).slider({
		 min: -127,
	     max: 127,
	     range: "min",
	     value: $("#state_co_1").val(),
		 slide:function( event, ui ) {
			 $("#state_co_1").val(ui.value);
			 monitorPaneInfo.setColorControlTimer(monitorPaneInfo);
	     },
	     orientation: "horizontal",
	     range: "min",
	     animate: true
	   });
	 enterDigital('#state_co_1');
		$('#state_co_1').on('keyup',function(){
			if($(this).val() != '' && $(this).val()<-127){
				$(this).val(-127);
			}else if($(this).val()>127){
				$(this).val(127);
			}
		});
		$('#state_co_1').on('blur',function(){
			if($(this).val() == ''){
				$(this).val(0);
			}
			monitorPaneInfo.setColorControlTimer(monitorPaneInfo);
		});
	  $( "#state_co_1" ).focus(function() {
		  $(this).bind("keyup", function(){
			  slider_1.slider( "value", $("#state_co_1").val() );
		  })
   });
	//对比度控制
	 var slider_2 = $( "#co_2" ).slider({
		 min: -127,
	     max: 127,
	     range: "min",
	     value: $("#state_co_2").val(),
		 slide:function( event, ui ) {
			 $("#state_co_2").val(ui.value);
			 monitorPaneInfo.setColorControlTimer(monitorPaneInfo);
	     },
	     orientation: "horizontal",
	     range: "min",
	     animate: true
	   });
	 enterDigital('#state_co_2');
	$('#state_co_2').on('keyup',function(){
		if($(this).val() != '' && $(this).val()<-127){
			$(this).val(-127);
		}else if($(this).val()>127){
			$(this).val(127);
		}
	});
	$('#state_co_2').on('blur',function(){
		if($(this).val() == ''){
			$(this).val(0);
		}
		monitorPaneInfo.setColorControlTimer(monitorPaneInfo);
	});
	  $( "#state_co_2" ).focus(function() {
		  $(this).bind("keyup", function(){
			  slider_2.slider( "value", $("#state_co_2").val() );
		  })
   });
	//对比度控制
	 var slider_3 = $( "#co_3" ).slider({
		 min: 0,
	     max: 255,
	     range: "min",
	     value: $("#state_co_3").val(),
		 slide:function( event, ui ) {
			 $("#state_co_3").val(ui.value);
			 monitorPaneInfo.setColorControlTimer(monitorPaneInfo);
	     },
	     orientation: "horizontal",
	     range: "min",
	     animate: true
	   });
		enterDigital('#state_co_3');
		$('#state_co_3').on('keyup',function(){
			if($(this).val() != '' && $(this).val()<0){
				$(this).val(0);
			}else if($(this).val()>255){
				$(this).val(255);
			}
		});
		$('#state_co_3').on('blur',function(){
			if($(this).val() == ''){
				$(this).val(128);
			}
			monitorPaneInfo.setColorControlTimer(monitorPaneInfo);
		});
	  $( "#state_co_3" ).focus(function() {
		  $(this).bind("keyup", function(){
			  slider_3.slider( "value", $("#state_co_3").val() );
		  })
	  });
	//对比度控制
	 var slider_4 = $( "#co_4" ).slider({
		 min: 0,
	     max: 255,
	     range: "min",
	     value: $("#state_co_4").val(),
		 slide:function( event, ui ) {
			 $("#state_co_4").val(ui.value);
			 monitorPaneInfo.setColorControlTimer(monitorPaneInfo);
	     },
	     orientation: "horizontal",
	     range: "min",
	     animate: true
	 });
		enterDigital('#state_co_4');
		$('#state_co_4').on('keyup',function(){
			if($(this).val() != '' && $(this).val()<0){
				$(this).val(0);
			}else if($(this).val()>255){
				$(this).val(255);
			}
		});
		$('#state_co_4').on('blur',function(){
			if($(this).val() == ''){
				$(this).val(128);
			}
			monitorPaneInfo.setColorControlTimer(monitorPaneInfo);
		});
	  $( "#state_co_4" ).focus(function() {
		  $(this).bind("keyup", function(){
			  slider_4.slider( "value", $("#state_co_4").val() );
		  })
	  });
}
	
/*
 * 语音面板
 */
monitorPaneInfo.prototype.initPaneAudio = function() {
	//对讲广播监听切换
	$(".listing_choice label").each(function(index){
		$(this).click(function(){
			$(".listing_box:eq("+ index +")").show().siblings(".listing_box").hide();
		});	
	});
	$("#talkbackTitle").text(lang.talkback);
	$("#talkbackVehicle").html("&nbsp;");
	$("#talkbackTip").html("&nbsp;");
	$("#btnTalkback").html(lang.start);
	var pane = this;
	$("#btnTalkback").click(function () {
		pane.doTalkback("");
	});
	$("#listenTitle").text(lang.monitor);
	$("#listenVehicle").html("&nbsp;");
	$("#listenTip").html("&nbsp;");
	$("#btnListen").html(lang.start);
	$("#btnListen").click(function () {
		pane.doListen("", 0);
	});
}

/*
 * 显示声音面板
 */
monitorPaneInfo.prototype.showPaneAudio = function() {
	$( ".tab_state" ).tabs({active:3});
	var $_index =$(".ui-tabs-active").index(".tab_state_box li");
	if( !$(".icon_state_box").find("i").hasClass("icon_down") ){
		$(".icon_state_box").find("i").addClass("icon_down");
		$( ".tab_state > div:eq("+ $_index +")" ).show();
		$( ".tab_state" ).tabs("disable",false );
		this.resizeVehiTree();
	}
}

/*
 * 对讲，如果选择同一个车辆，当前正在对讲，则停止对讲，如果选择不同车辆，则启动对讲
 */
monitorPaneInfo.prototype.doTalkback = function(vehiIdno) {
	if (vehiIdno != "") {
		//从菜单或者地图上启动对讲
		if (vehiIdno == this.talkbackVehiIdno) {
			if (this.isTalking) {
				//停止对讲
				this.stopTalkback();
			} else {
				this.startTalkback();
			}
		} else {
			//启动对讲
			this.talkbackVehiIdno = vehiIdno;
			this.startTalkback();
		}
	} else {
		//面板上启动或者停止对讲
		if (this.talkbackVehiIdno == "") {
			$.dialog.tips(parent.lang.talkback_selectVehicle, 2);
			return ;
		} else {
			if (this.isTalking) {
				this.stopTalkback();
			} else {
				this.startTalkback();
			}
		}
	}
}

/*
 * 对讲事件
 */
monitorPaneInfo.prototype.onTalkbackMsg = function(type) {
	if (!this.isTalking) {
		return ;
	}
	
	//type == "startRecive" || type == "uploadRecive" || type == "playRecive" || type == "loadRecive" || type == "reciveStreamStop" || type == "reciveNetError"
	if (type == "startRecive" || type == "uploadRecive" || type == "loadRecive") {
		$("#talkbackTip").html(lang.requiring);
	} else if (type == "stopTalk") {
		this.resetTalkback();
	} else if (type == "playRecive") {
		$("#talkbackTip").html(lang.talking);
	} else if (type == "reciveStreamStop" || type == "reciveNetError" || type == "reciveStreamNotFound") {
		$("#talkbackTip").html(lang.requiring);
	} else if (type == "uploadNetClosed" || type == "uploadNetError") {
	} else if (type == "upload") {
	} else if (type == "uploadfull") {
	} else {
		alert(type);
	}
}

/*
 * 启动对讲
 */
monitorPaneInfo.prototype.startTalkback = function() {
	//先将之前的对讲停止了
	if (this.isTalking) {
		this.stopTalkback();
	}
	
	this.showPaneAudio();
	var vehicle = parent.vehicleManager.mapVehiList.get(this.talkbackVehiIdno);
	if (vehicle != null) {
		if(typeof ttxVideo == 'undefined' || ttxVideo == null) {
			return;
		}
		
		//$('input[name="listing"][value=1]').attr("checked",false);
		//$('input[name="listing"][value=0]').attr("checked",'checked');
		//$("#chkListen").attr("checked", false);
		//$("#chkTalkback").attr("checked", true);
		$('input[name=listing]').get(0).checked = true; 
		$(".listing_box:eq(0)").show().siblings(".listing_box").hide();
		this.stopListen();
		//更新车辆信息
		$("#talkbackVehicle").html(vehicle.getName());
		var device = vehicle.getTalkbackDevice();
		if (device == null) {
			$.dialog.tips(parent.lang.device_nosupport, 2);
			return ;
		}
		if (!device.isOnline()) {
			$.dialog.tips(parent.lang.video_not_online, 2);
			return ;
		}
		//判断设备使用流量是否已达上限（视频设备）
		if(vehicle.isOverFlowLimit()) {
			$.dialog.tips(parent.lang.flowDeviceUpperLimit, 1);
			return;
		}
		//启动对讲	//0成功，1表示正在对讲，2表示没有mic，3表示禁用了mic
		var ret = ttxVideo.startTalkback(device.getIdno());
		if (ret == 0) {
			//$("input[name='listing']").attr("disabled", "disabled");
			this.isTalking = true;
			$("#talkbackTip").html(lang.requiring);
			$("#btnTalkback").html(lang.stop);
		} else if (ret == 1) {
			//一般都不会到此接口
		} else if (ret == 2) {
			alert(lang.talkback_noMic);
		} else if (ret == 3) {			
			$.dialog({id:'talkbacktip', title: lang.talkback_openMic, content: 'url:LocationManagement/talkbacktip.html', min:false, max:false, lock:true
					, autoSize:true});
		} else {
			//一般都不会到此接口
			//除非视频插件没有初始化完成
		}
	}
}

/*
 * 停止对讲
 */
monitorPaneInfo.prototype.stopTalkback = function() {
	ttxVideo.stopTalkback();
	this.resetTalkback();
}

/*
 * 停止对讲
 */
monitorPaneInfo.prototype.resetTalkback = function() {
	this.isTalking = false;
	$("#talkbackTip").html("&nbsp;");
	//$("input[name='listing']").attr("disabled", false);
	$("#btnTalkback").html(lang.start);
}

/*
 * 判断是否正在对讲
 */
monitorPaneInfo.prototype.isVehiTalking = function (vehiIdno) {
	return (this.talkbackVehiIdno == vehiIdno && this.isTalking) ? true : false;
}

/*
 * 进行监听，，如果选择同一个车辆同一通道，当前正在监听，则停止监听，如果选择不同车辆通道，则启动监听
 */
monitorPaneInfo.prototype.doListen = function(vehiIdno, chn) {
	if (vehiIdno != "") {
		//从菜单或者地图上启动监听
		if (vehiIdno == this.listenVehiIdno && chn == this.listenVehiChn) {
			if (this.isListening) {
				//停止监听
				this.stopListen();
			} else {
				this.startListen();
			}
		} else {
			//启动对讲
			this.listenVehiIdno = vehiIdno;
			this.listenVehiChn = chn;
			this.startListen();
		}
	} else {
		//面板上启动或者停止监听
		if (this.listenVehiIdno == "") {
			$.dialog.tips(parent.lang.listen_selectVehicle, 2);
			return ;
		} else {
			if (this.isListening) {
				this.stopListen();
			} else {
				this.startListen();
			}
		}
	}
}

/*
 * 处理监听的消息
 */
monitorPaneInfo.prototype.onListenMsg = function(type) {
	if (!this.isListening) {
		return;
	}
	
	if (type == "startListen") {
	} else if (type == "stopListen") {
		//主动停止监听
		this.resetListen();
	} else if (type == "listenNetError") {
		$("#listenTip").html(lang.requiring);
	} else if (type == "playListen") {
		$("#listenTip").html(lang.listening);
	} else if (type == "loadListen" || type == "listenStreamNotFound" || type == "listenStreamStop") {
		$("#listenTip").html(lang.requiring);
	} else {
		alert(type);
	}
}

/*
 * 启动监听
 */
monitorPaneInfo.prototype.startListen = function() {
	this.showPaneAudio();
	//先将之前的监听停止了
	if (this.isListening) {
		this.stopListen();
	}
	
	var vehicle = parent.vehicleManager.mapVehiList.get(this.listenVehiIdno);
	if (vehicle != null) {
		this.stopTalkback();
		if(ttxVideo == null) {
			return;
		}
		//$('input[name="listing"][value=0]').eq(0).attr("checked",false);
		//$('input[name="listing"][value=1]').eq(1).attr("checked",'checked');
		//$("#chkTalkback").attr("checked", false);
		//$("#chkListen").attr("checked", true);
		$('input[name=listing]').get(1).checked = true; 
		$(".listing_box:eq(1)").show().siblings(".listing_box").hide();
		//更新车辆信息
		$("#listenVehicle").html(vehicle.getName());
		var device = vehicle.getMonitorDevice();
		if (device == null) {
			$.dialog.tips(parent.lang.device_nosupport, 2);
			return ;
		}
		if (!device.isOnline()) {
			$.dialog.tips(parent.lang.video_not_online, 2);
			return ;
		}
		
		//判断设备使用流量是否已达上限（视频设备）
		if(vehicle.isOverFlowLimit()) {
			$.dialog.tips(parent.lang.flowDeviceUpperLimit, 1);
			return;
		}
		//启动监听
		var ret = ttxVideo.startListen(device.getIdno());
		if (ret == 0) {
			//$("input[name='listing']").attr("disabled", true);
			this.isListening = true;
			$("#listenTip").html(lang.requiring);
			$("#btnListen").html(lang.stop);
		} else {
			//一般都不会到此接口
			//除非视频插件没有初始化完成
		}
	}
}

/*
 * 停止监听
 */
monitorPaneInfo.prototype.stopListen = function() {
	ttxVideo.stopListen();
	this.resetListen();
}

/*
 * 复位监听
 */
monitorPaneInfo.prototype.resetListen = function() {
	this.isListening = false;
	$("#listenTip").html("&nbsp;");
	//$("input[name='listing']").attr("disabled", false);
	$("#btnListen").html(lang.start);
}

/*
 * 判断是否正在对讲
 */
monitorPaneInfo.prototype.isVehiListening = function (vehiIdno, chn) {
	return (this.listenVehiIdno == vehiIdno && this.listenVehiChn == chn && this.isListening) ? true : false;
}

/*
 * 发送平台请求
 */
monitorPaneInfo.prototype.sendPTZControl = function (window,value,gatewayServer){
	//alert(value);
	var param = 0;
	if(value == 21 || value == 22 || value == 23){
		param = $( "#spinner" ).val();
	}
	var speed = $( "#yt_handle" ).slider('option','value');
	var action = 'http://'+ gatewayServer.ip + ':' + gatewayServer.port +'/2/9/callback=getData';
	action += '?DevIDNO='+ window.devIdno +'&Chn='+ window.channel + '&Command=' + value + '&Speed=' + speed + '&Param=' + param;
	$.ajax({  
		type : "post",  
        url : action,
        timeout: 120000,
        data : null, 
        dataType: "jsonp",
        success : getData = function(json){
        	if(json.result == 0){
        		if(value == 14){
        			$('.icon_light0_0').attr('href','javascript:sendPTZControl(15);');
        			$('.icon_light0_0').addClass('icon_light');
        			$('.icon_light0_0').attr('title',parent.lang.close_light);
        		}else if(value == 15){
        			$('.icon_light0_0').attr('href','javascript:sendPTZControl(14);');
        			$('.icon_light0_0').removeClass('icon_light');
        			$('.icon_light0_0').attr('title',parent.lang.open_light);
        		}else if(value == 16){
        			$('.icon_biao0_1').attr('href','javascript:sendPTZControl(17);');
        			$('.icon_biao0_1').addClass('icon_biao');
        			$('.icon_biao0_1').attr('title',parent.lang.close_wipers);
        		}else if(value == 17){
        			$('.icon_biao0_1').attr('href','javascript:sendPTZControl(16);');
        			$('.icon_biao0_1').removeClass('icon_biao');
        			$('.icon_biao0_1').attr('title',parent.lang.open_wipers);
        		}else if(value == 21){
        			$('#transfer').addClass('btn_state');
        			$('#set_up').removeClass('btn_state');
        			$('#delete').removeClass('btn_state');
        		}else if(value == 22){
        			$('#transfer').removeClass('btn_state');
        			$('#set_up').addClass('btn_state');
        			$('#delete').removeClass('btn_state');
        		}else if(value == 23){
        			$('#transfer').removeClass('btn_state');
        			$('#set_up').removeClass('btn_state');
        			$('#delete').addClass('btn_state');
        		}
        	}else{
        		alert(parent.lang.errSendRequired);
        	}
        },
    	error:function(XHR, textStatus, errorThrown){
        	var time = dateFormat2TimeString(new Date());
        	if(errorThrown == 'timeout') {
        		alert(parent.lang.errTimeout);
        	}
         } 
	});
}

/*
 * 设置色彩请求定时器
 */
monitorPaneInfo.prototype.setColorControlTimer = function(monitorPaneInfo){
	if(monitorPaneInfo.changeColorTimer != null){
		clearTimeout(monitorPaneInfo.changeColorTimer);
		monitorPaneInfo.changeColorTimer = null;
	 }
	monitorPaneInfo.changeColorTimer = setTimeout(function () {
		 monitorPaneInfo.sendPaneColorControl();	
		}, 100);
}

/*
 * 发送色彩请求
 */
monitorPaneInfo.prototype.sendPaneColorControl = function(){
	if(typeof ttxVideo == 'undefined' || ttxVideo == null) {
		return;
	}
	//this.changeColorTimer = null;
	var window = ttxVideo.getCurFocusWindow();
	if(!window.isPreview){
		$.dialog.tips(parent.lang.focus_picture_play_video,1);
		return;
	}
	var brightness = $( "#state_co_0" ).val();
	var contrast = $( "#state_co_1" ).val();
	var hue = $( "#state_co_2" ).val();
	var saturate = $( "#state_co_3" ).val();
	var exposure = $( "#state_co_4" ).val();
	var action = 'http://'+ gatewayServer.ip + ':' + gatewayServer.port +'/2/50/callback=getData';
	action += '?DevIDNO='+ window.devIdno +'&Chn='+ window.channel + '&Exposure=' + exposure + '&Brightness=' + brightness + '&Constract=' + contrast + '&Hue=' + hue + '&Saturate=' + saturate;
	$.ajax({  
		type : "post",  
        url : action,
        timeout: 120000,
        data : null, 
        dataType: "jsonp",
        success : getData = function(json){
        	if(json.result == 0){
        		return;
        	}else{
        		alert(parent.lang.errSendRequired);
        	}
        },
    	error:function(XHR, textStatus, errorThrown){
        	var time = dateFormat2TimeString(new Date());
        	if(errorThrown == 'timeout') {
        		alert(parent.lang.errTimeout);
        	}
         }  
	});
}

/*
 * 设置是否禁用云台和色彩按钮
 */
monitorPaneInfo.prototype.setButtonForPtzColor = function(){
	if(typeof ttxVideo != 'undefined' && ttxVideo != null) {
		var window = ttxVideo.getCurFocusWindow();
		if(window && window.isPreview){
			this.setPTZcolorButtonStatus(false);
		}else{
			this.setPTZcolorButtonStatus(true);
		}
	}
}

monitorPaneInfo.prototype.setPTZcolorButtonStatus = function(disabled){
	$( ".icon_yt_box a" ).button({
  		disabled: disabled
	});
	$( ".yt_state2 a" ).button({
  		disabled: disabled
	});
	$( ".btn_state1 a" ).button({
  		disabled: disabled
	});
	$( "#co_0" ).slider({
		disabled: disabled
	});
	$( "#co_1" ).slider({
		disabled: disabled
	});
	$( "#co_2" ).slider({
		disabled: disabled
	});
	$( "#co_3" ).slider({
		disabled: disabled
	});
	$( "#co_4" ).slider({
		disabled: disabled
	});
	$( "#spinner" ).spinner({
		disabled: disabled
	});
	$( "#yt_handle" ).slider({
		disabled: disabled
	});
	if(disabled){
		$('#state_co_0').get(0).disabled = true;
		$('#state_co_1').get(0).disabled = true;
		$('#state_co_2').get(0).disabled = true;
		$('#state_co_3').get(0).disabled = true;
		$('#state_co_4').get(0).disabled = true;
	}else{
		$('#state_co_0').get(0).disabled = false;
		$('#state_co_1').get(0).disabled = false;
		$('#state_co_2').get(0).disabled = false;
		$('#state_co_3').get(0).disabled = false;
		$('#state_co_4').get(0).disabled = false;
	}
}

//添加地理位置信息
monitorPaneInfo.prototype.addPanePosition = function(vehiIdno, data){
	if((typeof monitorStatus) != 'undefined' && monitorStatus != null && monitorStatus.isClickPosition) {
		monitorStatus.isClickPosition = false;
		$('#state_position .maplngLat').attr('changeMapAddress(this,'+data.mapJingDu+','+data.mapWeiDu+',\''+vehiIdno+'\');');
	}else {
		var obj = $('#gpsMonitorTable').find($('#gpsMonitorTable').flexGetRowid(vehiIdno));
		var pos1 = '';
		var pos2 = '';
		if($(obj).length > 0) {
			pos1 = $.trim($(obj).find('.position div .maplngLat').html());
			pos2 = $.trim($(obj).find('.position div .maplngLat').attr('data-position'));
		}
		if(pos1 == '') {
			pos1 = data.position;
		}
		var position = '<span class="maplngLat" data-type="2" data-position="'+ pos2 +'"changeMapAddress(this,'+data.mapJingDu+','+data.mapWeiDu+',\''+vehiIdno+'\');" title="'+ pos1 +'">'+ pos1 +'</span>';
		$('#state_position div').html(position);
	}
}

//刷新地理位置
monitorPaneInfo.prototype.switchPosition = function(pos1, pos2){
	$('#state_position .maplngLat').attr('title', pos1);
	$('#state_position .maplngLat').html(pos1);
	$('#state_position .maplngLat').attr('data-position', pos2);
}