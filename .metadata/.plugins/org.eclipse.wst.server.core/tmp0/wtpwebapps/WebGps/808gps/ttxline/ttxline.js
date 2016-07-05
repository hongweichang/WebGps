var rootParent = parent.parent;
var lang = rootParent.lang;
var isInitFinished = false;
var lineList = []; //线路列表
var curLineId = null; //当前监控线路
var lineDirect = 0; //上行 1下行  默认显示上行
var startStationIndex = 0; //开始站点索引
var endStationIndex = 0; //结束站点索引
var x_count = 0; //x轴显示数目
var y_count = 0; //y轴显示数目
var mapStationPixList = new Hashtable();//站点索引, 站点信息(站点的偏移)
var mapStationVehiList = new Hashtable();//站点索引+到站状态,站点信息(车辆集合)
var wayVehicleList = []; //路途中的车辆列表
var isShowStationName = false; //是否显示站点名称

$(document).ready(function () {
	loadReadPage();
});

function loadReadPage() {
	$(document).on('click', '.gj_btn_xq a', function() {
		var index_ = $(this).index();
		var flag_ = false;
		if($(this).hasClass('cur')) {
			$(this).removeClass("cur");
		}else {
			$(this).addClass("cur");//.siblings().removeClass("cur");
			flag_ = true;
		}
		if(index_ == 0) {
			if(flag_) {
				$('.gj_xlxx').addClass("cur");
			}else {
				$('.gj_xlxx').removeClass("cur");
			}
		}else if(index_ == 1) {
		}else if(index_ == 2) {
			isShowStationName = flag_;
			if(isShowStationName) {
				$('.luxian_box .cri em').addClass('cur');
				$('.luxian_box .cri_begin em').addClass('cur');
				$('.luxian_box .cri_end em').addClass('cur');
			}else {
				$('.luxian_box .cri em').removeClass('cur');
				$('.luxian_box .cri_begin em').removeClass('cur');
				$('.luxian_box .cri_end em').removeClass('cur');
			}
		}
	});
	
	setPanelWidth();
	//加载语言
	loadLanguage();
	//点击事件，为了上层拖动窗体
	$(document).bind("click mouseup",function(e){
		doMapDocumentMouseClick();
	});
	$(document).mousemove(function(e){
		doMapDocumentMouseMove(e);
	});
	
	//切换线路上下行
	$(".lu_box .zhan").on('click', switchLineDirect);
	
	loadAllLine();
	isInitFinished = true;
}

//线路图加载成功
function isLoadLineSuc() {
	return isInitFinished;
}

function doMapDocumentMouseClick() {
	if (typeof parent.ttxMapDocumentMouseClick == "function") {
		parent.ttxMapDocumentMouseClick();
	}
}

function doMapDocumentMouseMove(e) {
	if (typeof parent.ttxMapDocumentMouseMove == "function") {
		parent.ttxMapDocumentMouseMove(e);
	}
}

//加载所有线路到导航列表
function loadAllLine() {
	var lineList = rootParent.vehicleManager.getAllLineInfo();
	if(lineList.length > 0) {
		var html_ = [];
		for (var i = 0; i < lineList.length; i++) {
			html_.push('<li data-id="'+ lineList[i].getId() +'"><a href="#">'+ lineList[i].getName() +'</a></li><li>|</li>');
		}
		$('.gj_top ul').append(html_.join(""));
	}
	$('.gj_top ul').bxSlider({
		adaptiveWidth: true,
	 	minSlides: 18,
	  	maxSlides: 18,
	  	slideWidth: 80,
	  	slideMargin: 0,
	  	pager: false,
	  	onSliderLoad: function(currentIndex){
	  		/*var lineId_ = $('.gj_top li').eq(currentIndex).attr('data-id');
	  		var lineInfo_ = rootParent.vehicleManager.getLineInfo(lineId_);//线路信息
	  		if(lineInfo_) {
	  			$(".gj_top h2").text(lineInfo_.getName());
	  		}*/
	  	}
	});
}

//删除线路信息
function deletePreLine(lineId) {
	if(lineId == curLineId) {
		var lineInfo = rootParent.vehicleManager.getLineInfo(lineId);//线路信息
		if(lineInfo) {
			//删除线路信息
			deleteLineInfo();
			//删除站点和车辆信息
			deleteLineVehicleStation();
		}
	}
}

//删除线路监控
function deleteLine(lineId) {
	deletePreLine(lineId);
	for (var i = lineList - 1; i >= 0; i--) {
		if(lineList[i] == lineId) {
			lineList.splice(i, 1);
			$('.gj_top ul .line'+lineId).remove();
			break;
		}
	}
	if(lineId == curLineId) {
		curLineId = null;
		lineDirect = 0;
	}
}

//初始化线路
function initLine(lineId) {
	if(curLineId) {
		if(lineId == curLineId) {
			return;
		}
		deletePreLine(curLineId);
	}
	if(!lineId) {
		lineId = curLineId;
	}else {
		lineDirect = 0;
	}
	var lineInfo = rootParent.vehicleManager.getLineInfo(lineId);//线路信息
	if(lineInfo) {
		curLineId = lineId;
		
		if(!lineList.in_array(lineId)) {
			lineList.push(lineId);
//			$('.gj_top ul').append('<li class="line'+lineId+'"><a href="#">'+ lineInfo.getName() +'</a></li>');
		}
		//初始化线路信息
		initLineInfo(lineInfo);
		//初始化站点信息
		initLineStation(lineInfo);
		//是否显示站点名称
		if(isShowStationName) {
			$('.luxian_box em').addClass('cur');
		}else {
			$('.luxian_box em').removeClass('cur');
		}
		//初始化车辆信息
		initLineVehicle(lineInfo);
	}
}

//初始化线路信息
function initLineInfo(lineInfo) {
	var startStationId = 0;
	var endStationId = 0;
	var beginTime = "";
	var endTime = "";
	var normalTime = "";
	var peakTime = "";
	var length = "";
	if(lineDirect == 1) {
		startStationId = lineInfo.getDownLine().getStartStationId();
		endStationId = lineInfo.getDownLine().getEndStationId();
		startStationIndex = lineInfo.getDownLine().getStartStationIndex(); //开始站点索引
		endStationIndex = lineInfo.getDownLine().getEndStationIndex(); //结束站点索引
		beginTime = lineInfo.getDownLine().getFirstTimeStr(); //早班车发出时间
		endTime = lineInfo.getDownLine().getLastTimeStr(); //晚班车发出时间
		normalTime = lineInfo.getDownLine().getItlNormalTimeStr(); //平峰发车间隔
		peakTime = lineInfo.getDownLine().getItlPeakTimeStr(); //高峰发车间隔
		length = lineInfo.getDownLine().getLengthStr(); //路线长度
	}else {
		startStationId = lineInfo.getUpLine().getStartStationId();
		endStationId = lineInfo.getUpLine().getEndStationId();
		startStationIndex = lineInfo.getUpLine().getStartStationIndex(); //开始站点索引
		endStationIndex = lineInfo.getUpLine().getEndStationIndex(); //结束站点索引
		beginTime = lineInfo.getUpLine().getFirstTimeStr(); //早班车发出时间
		endTime = lineInfo.getUpLine().getLastTimeStr(); //晚班车发出时间
		normalTime = lineInfo.getUpLine().getItlNormalTimeStr(); //平峰发车间隔
		peakTime = lineInfo.getUpLine().getItlPeakTimeStr(); //高峰发车间隔
		length = lineInfo.getUpLine().getLengthStr(); //路线长度
	}
	var startStation = null;
	var endStation = null;
	if(startStationId != null) {
		startStation = rootParent.vehicleManager.getStationInfo(startStationId);//站点信息
	}
	if(endStationId != null) {
		endStation = rootParent.vehicleManager.getStationInfo(endStationId);//站点信息
	}
	if(startStation) {
		$('#gj_stratStation').text(startStation.getName());
	}else {
		$('#gj_stratStation').text('');
	}
	if(endStation) {
		$('#gj_endStation').text(endStation.getName());
	}else {
		$('#gj_endStation').text('');
	}
	$('#gj_lineName').text(lineInfo.getName());
	$('.lu_box .zhan').css('display','inline-block');
	
	$('.gj_top .gj_top_title').text(lineInfo.getName());
	
	$('.gj_lx .gj_lx_name').text(lineInfo.getName());
	$('.gj_lx .gj_lx_begin').text(startStation.getName());
	$('.gj_lx .gj_lx_end').text(endStation.getName());
	$('.gj_lx .gj_lx_beginTime').text(beginTime);
	$('.gj_lx .gj_lx_endTime').text(endTime);
	$('.gj_lx .gj_lx_wayCount').text('0');
	$('.gj_lx .gj_lx_waitCount').text('0');
	$('.gj_lx .gj_lx_arrivalCount').text('0');
	
	$('.gj_xlxx .gj_xlxx_peak').text(peakTime);
	$('.gj_xlxx .gj_xlxx_normal').text(normalTime);
	$('.gj_xlxx .gj_xlxx_length').text(length);
}

//删除线路信息
function deleteLineInfo() {
	$('#gj_stratStation').text('');
	$('#gj_endStation').text('');
	$('#gj_lineName').text('');
	$('.lu_box .zhan').css('display','none');
	
	$('.gj_lx .gj_lx_name').text('');
	$('.gj_lx .gj_lx_begin').text('');
	$('.gj_lx .gj_lx_end').text('');
	$('.gj_lx .gj_lx_beginTime').text('');
	$('.gj_lx .gj_lx_endTime').text('');
	$('.gj_lx .gj_lx_wayCount').text('');
	$('.gj_lx .gj_lx_waitCount').text('');
	$('.gj_lx .gj_lx_arrivalCount').text('');
	
	$('.gj_xlxx .gj_xlxx_total').text('');
	$('.gj_xlxx .gj_xlxx_peak').text('');
	$('.gj_xlxx .gj_xlxx_normal').text('');
	$('.gj_xlxx .gj_xlxx_length').text('');
}

//初始化站点信息
function initLineStation(lineInfo) {
	var stationIds = null; //站点id集合
	if(lineDirect == 1) {//下行
		stationIds = lineInfo.getDownLine().getStationList();
	}else {
		stationIds = lineInfo.getUpLine().getStationList();
	}
	var stationList = [];
	if(stationIds != null && stationIds.length > 0) {
		for (var i = 0; i < stationIds.length; i++) {
			var data = {};
			var relationId_ = lineInfo.getId()+'-'+lineDirect+'-'+stationIds[i];
			var relation_ = rootParent.vehicleManager.getStationRelation(relationId_);
			if(relation_) {
				data.sindex = relation_.getStationIndex();
			}
			var station_ = rootParent.vehicleManager.getStationInfo(stationIds[i]);
			if(station_) {
				data.name = station_.getName();
			}
			stationList.push(data);
		}
	}
	loadStation(stationList);
}

//加载站点
function loadStation(stationList) {
	var width_ = $('.gj_luxian').width(); //宽度
	var height_ = $('.gj_luxian').height(); //高度
	mapStationPixList.clear(); //清空
	
	//计算x轴和y轴各分布几个站点
	var length = stationList.length - 2;
	var maxWidth = 2 * width_ + height_;
	var px_ = maxWidth / (length + 1);
	var x, y;
	if(2 * px_ > height_ && length % 2 == 0) {
		x = length + 2;
		y = 0;
	}else {
		for (var i = 1; i < length; i++) {
			var maxWidth_ = (length - i) * px_ / 2;
			var maxHeight_ = (i) * px_;
			if(maxWidth_ <= width_ && maxHeight_ <= height_ + px_) {
				x = length - i + 2;
				y = i - 2;
				if(x % 2 == 1) {
					x = x - 1;
					y = y + 1;
				}
				break;
			}
		}
	}
	x_count = x / 2;
	y_count = y;
	//将站点加入页面
	var border_ = ($('.gj_luxian').outerWidth() - width_) / 2; //边框宽度
	var iwidth_ = 18 / 2; //站点圆半径
	var html_ = [];
	//x轴每个站点长度
	var px_x = width_ / (x / 2 - 1); 
	//加入起点和终点
	x = x + 2;
	//显示上面
	for (var i = 0; i < x / 2; i++) {
		var left = px_x * (i - 1) - iwidth_ - border_/2;
		var top = - iwidth_ - border_/2;
		if(i == 0) {
			left = px_x * (i) - iwidth_ - border_;
			top = 80;
			html_.push('<i class="cri_begin cri'+ stationList[i].sindex +'" style="left: '+ left +'px;top:'+ top +'px;"><em>'+ stationList[i].name +'</em></i>');
		}else {
			html_.push('<i class="cri cri'+ stationList[i].sindex +'" style="left:'+ left +'px;top:'+ top +'px"><em>'+ stationList[i].name +'</em></i>');
		}
		var stationPix_ = mapStationPixList.get(stationList[i].sindex);
		if(!stationPix_) {
			stationPix_ = {};
			mapStationPixList.put(stationList[i].sindex, stationPix_);
		}
		stationPix_.top = top;
		stationPix_.left = left;
	}
	if(y > 0) {
		//y轴每个站点高度
		var px_y = height_ / (y + 1);
		//显示y轴
		var left = width_ - border_;
		for (var i = 0; i < y; i++) {
			var top = px_y * (i+1) - iwidth_;
			html_.push('<i class="cri cri'+ stationList[x / 2 + i].sindex +'" style="left:'+ left +'px;top:'+ top +'px;"><em>'+ stationList[x / 2 + i].name +'</em></i>');
			
			var stationPix_ = mapStationPixList.get(stationList[x / 2 + i].sindex);
			if(!stationPix_) {
				stationPix_ = {};
				mapStationPixList.put(stationList[x / 2 + i].sindex, stationPix_);
			}
			stationPix_.top = top;
			stationPix_.left = left;
		}
	}
	//显示下面
	for (var i = x/2 - 1; i >= 0; i--) {
		var left = px_x * (x/2 - 1 - i - 1) - iwidth_ - border_/2;
		var bottom = - iwidth_ - border_/2;
		if(i == x/2 - 1) {
			left = px_x * (x/2 - 1 - i) - iwidth_ - border_;
			bottom = 80;
			html_.push('<i class="cri_end cri'+ stationList[x / 2 + y + i].sindex +'" style="left:'+ left +'px;bottom:'+ bottom +'px"><em>'+ stationList[x / 2 + y + i].name +'</em></i>');
		}else {
			html_.push('<i class="cri cri'+ stationList[x / 2 + y + i].sindex +'" style="left:'+ left +'px;bottom:'+ bottom +'px"><em>'+ stationList[x / 2 + y + i].name +'</em></i>');
		}
		
		var stationPix_ = mapStationPixList.get(stationList[x / 2 + y + i].sindex);
		if(!stationPix_) {
			stationPix_ = {};
			mapStationPixList.put(stationList[x / 2 + y + i].sindex, stationPix_);
		}
		stationPix_.left = left;
		stationPix_.bottom = bottom;
	}
	html_.push('<i class="c_kong"></i>');
	$('.luxian_box').append(html_.join(""));
}

//初始化车辆信息
function initLineVehicle(lineInfo) {
	//删除所有车辆
	mapStationVehiList.each(function(key, value) {
		$('.car'+key).remove();
	});
	//将车辆信息置空
	mapStationVehiList.clear();//站点索引,站点信息(车辆集合)
	//将路途中车辆列表置空
	wayVehicleList = [];
	//线路下所有车辆
	var vehiIdnos = lineInfo.getVehiIdnoList();
	
	//<i class="car" style="left:150px;">
	//<span class="car_z car_begin"><em class="zi_h">10辆</em></span>
    //<span class="car_z car_end"><em class="zi_h">10辆</em></span>
	if(vehiIdnos && vehiIdnos.length > 0) {
		$('.gj_xlxx .gj_xlxx_total').text(vehiIdnos.length);
		for (var i = 0; i < vehiIdnos.length; i++) {
			var vehiIdno = vehiIdnos[i];
			//先删除车辆，再添加车辆
//			$('.luxian_box .car'+vehiIdno).remove();
			//添加车辆到线路
			addLineVehicle(lineInfo.getId(), vehiIdno);
		}
	}else {
		$('.gj_xlxx .gj_xlxx_total').text(0);
	}
	$('.gj_lx .gj_lx_wayCount').text(wayVehicleList.length);
}

//添加车辆到线路
function addLineVehicle(lineId, vehiIdno) {
	var vehicle = rootParent.vehicleManager.getVehicle(vehiIdno);
	if(vehicle) {
		//解析车辆状态
		var data = vehicle.gpsParseTrackStatus();
		//如果车辆在线路下
		if(data.lineId == lineId && lineDirect == data.lineDirect && vehicle.isOnline()) {
			var width_ = $('.gj_luxian').width(); //宽度
			var height_ = $('.gj_luxian').height(); //高度
			var border_ = ($('.gj_luxian').outerWidth() - width_) / 2; //边框宽度
			var iwidth_v = 30 / 2; //车辆半径
			var iwidth_s = 18 / 2; //站点圆半径
			//var x_count = 0; //x轴显示数目
			//var y_count = 0; //y轴显示数目
			
			//判断车辆在那个站点，然后添加
			data.stationStatus;//到站状态  1到站 0出站
			data.stationIndex; //站点索引
			
			var top = null;
			var left = null;
			var bottom = null;
			//如果站点索引大于x轴显示数目，则判断是否在y轴
			var stationIndex = parseInt(data.stationIndex, 10);
			
			var stationPix_ = mapStationPixList.get(stationIndex);
			if(!stationPix_) {
				return;
			}
			
			//如果车辆在路途中，并且没有到达终点
			if(stationIndex != endStationIndex) {
				wayVehicleList.push(vehiIdno);
			}
			
			if(stationIndex == startStationIndex) {//在起点
				if(data.stationStatus == 1) {
					top = stationPix_.top;
					left = stationPix_.left;
				}else {
					top = stationPix_.top/2;
					left = stationPix_.left + iwidth_v;
				}
			}else if(stationIndex == endStationIndex) { //在终点
				if(data.stationStatus == 1) {
					bottom = stationPix_.bottom;
				}else {
					bottom = stationPix_.bottom;
				}
				left = stationPix_.left;
			}else {
				var px_x = width_ / (x_count - 1);
				var px_y = height_ / (y_count + 1);
				
				if(data.stationStatus == 1) {
					if(stationPix_.left) {
						left = stationPix_.left;
					}
					if(stationPix_.top) {
						top = stationPix_.top;
						if(top < 0) {
							top = top - iwidth_v - iwidth_s;
						}else {
							if(left) {
								left = left - iwidth_v - iwidth_s;
							}
						}
					}
					if(stationPix_.bottom) {
						bottom = stationPix_.bottom;
						if(bottom < 0) {
							bottom = bottom + iwidth_v + iwidth_s;
						}
					}
				}else {
					if(stationPix_.top) {
						if(stationPix_.top < 0) {//x轴上面
							top = stationPix_.top;
							if(stationPix_.left) {
								left = stationPix_.left + px_x/2;
							}
							if(left > width_) {
								left = stationPix_.left - iwidth_v - iwidth_s;
								top = top + px_y/2;
							}else {
								top = top - iwidth_v - iwidth_s;
							}
						}else {
							top = stationPix_.top + px_y/2;
							if(stationPix_.left) {
								left = stationPix_.left - iwidth_v - iwidth_s;
							}
						}
					}
					if(stationPix_.bottom) {
						if(stationPix_.bottom < 0) {//x轴下面
							if(stationPix_.left < 0) {
								left = stationPix_.left + iwidth_v + iwidth_s;
								bottom = stationPix_.bottom + px_y/2;
							}else {
								left = stationPix_.left - px_x/2;
								bottom = stationPix_.bottom + iwidth_v + iwidth_s;
							}
						}else {
							bottom = stationPix_.bottom;
							if(stationPix_.left) {
								left = stationPix_.left;
							}
						}
					}
				}
			}
			
			//添加车辆到站点中
			var station_ = mapStationVehiList.get(stationIndex+'-'+data.stationStatus);
			if(!station_) {
				station_ = new lineStationEx();
				mapStationVehiList.put(stationIndex+'-'+data.stationStatus, station_);
			}
			station_.addVehiIdno(vehiIdno);
			
			var vehicle_ = document.createElement("i");
			vehicle_.className = "car car"+ stationIndex+'-'+data.stationStatus +"";
			if(left) {
				$(vehicle_).css('left', left);
			}
			if(top) {
				$(vehicle_).css('top', top);
			}
			if(bottom) {
				$(vehicle_).css('bottom', bottom);
			}
			//如果车辆数目大于0，则删除以前的
			var content_ = '';
			if(station_.getVehiIdnoList().length > 1) {
				$('.car'+stationIndex+'-'+data.stationStatus).remove();
				content_ = '<em class="zi_h cur">'+ station_.getVehiIdnoList().length +'辆</em>';
			}else {
				content_ = '<em class="zi_h cur">'+ vehiIdno +'</em>';
			}
			
			$(vehicle_).append(content_);
			$('.luxian_box').append(vehicle_);
		}
	}
}

//删除站点和车辆信息
function deleteLineVehicleStation() {
	$('.luxian_box').empty();
}

//更新线路状态
function updateLineStatus() {
	if(curLineId) {
		var lineInfo = rootParent.vehicleManager.getLineInfo(curLineId);//线路信息
		if(lineInfo) {
			//初始化车辆信息
			initLineVehicle(lineInfo);
		}
	}
}

//切换线路上下行
function switchLineDirect() {
	if(lineDirect == 1) {
		lineDirect = 0;
		initLine();
	}else {
		lineDirect = 1;
		initLine();
	}
}

/**
 *设置页面大小
 */
function setPanelWidth() {
	var wndWidth = document.documentElement.clientWidth;
	var wndHeight = document.documentElement.clientHeight;
	$(".map_area").css("width", wndWidth);
	$(".map_area").css("height", wndHeight);
//	$(".gj_box_cont").css("width", wndWidth);
	$(".gj_box_cont").css("height", wndHeight - 39);
	$(".gj_luxian").css("width", wndWidth - 200);
}

/*
 * 设置语言信息
*/
function loadLanguage() {
	$('.gj_lx .gj_lx_from').text('从');
	$('.gj_lx .gj_lx_to').text('开往');
	$('.gj_lx .gj_lx_morning').text('早上发出');
	$('.gj_lx .gj_lx_night').text('晚上一班');
	$('.gj_lx .gj_lx_way').text('路途中车辆');
	$('.gj_lx .gj_lx_wayTip').text('辆');
	$('.gj_lx .gj_lx_wait').text('辆待发');
	$('.gj_lx .gj_lx_arrival').text('辆到站');
	
	$('.gj_btn_xq .gj_btn_xq_detail').text('路线详情');
	$('.gj_btn_xq .gj_btn_xq_scheduling').text('显示排班');
	$('.gj_btn_xq .gj_btn_xq_station').text('显示站点');
	
	$('.gj_xlxx .gj_xlxx_title').text('线路详情信息');
	$('.gj_xlxx .gj_xlxx_totalTip').text('总车数：');
	$('.gj_xlxx .gj_xlxx_totalUnit').text('辆');
	$('.gj_xlxx .gj_xlxx_peakTip').text('高峰发车间隔：');
	$('.gj_xlxx .gj_xlxx_normalTip').text('平常发车间隔：');
	$('.gj_xlxx .gj_xlxx_lengthTip').text('线路总长：');
}

function lineStationEx() {
	this.vehiIdnoList = [];
}

//获取车辆
lineStationEx.prototype.getVehiIdnoList = function(){
	return this.vehiIdnoList;
}

//添加车辆
lineStationEx.prototype.addVehiIdno = function(vehiIdno){
	if(!this.isContainVehiIdno(vehiIdno)) {
		this.vehiIdnoList.push(vehiIdno);
	}
}

//删除车辆
lineStationEx.prototype.removeVehiIdno = function(vehiIdno){
	if(!this.isContainVehiIdno(vehiIdno)) {
		for (var i = this.vehiIdnoList - 1; i >= 0; i--) {
			if(this.vehiIdnoList[i] == vehiIdno) {
				this.vehiIdnoList.splice(i, 1);
				break;
			}
		}
	}
}

//站点是否包含车辆
lineStationEx.prototype.isContainVehiIdno = function(vehiIdno){
	var sx = String.fromCharCode(2);
	var rt = new RegExp(sx + vehiIdno + sx);
	return rt.test(sx + this.vehiIdnoList.join(sx) + sx);
}