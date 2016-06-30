/**
 * 站点信息类
 */
function standardStation(id, name){
	this.id = id;
	this.name = name;
	this.direct = null;  //站点方向
	this.lngIn = null;  //进站经度
	this.latIn = null;  //进站纬度
	this.angleIn = null;  //进站角度 
	this.lngOut = null;  //出站经度
	this.latOut = null;  //出站纬度
	this.angleOut = null; //出站角度
	this.abbr = null;  //简称
	this.remark = null;  //备注
	this.mapLngIn = null;  //进站地图经度
	this.mapLatIn = null;  //进站地图纬度
	this.mapLngOut = null;  //出站地图经度
	this.mapLatOut = null;  //出站地图纬度
}

standardStation.prototype.setStandardStation = function(station){
	this.direct = station.direct;  //站点方向
	this.lngIn = station.lngIn;  //进站经度(1000000放大)
	this.latIn = station.latIn;  //进站纬度(1000000放大)
	this.angleIn = station.angleIn;  //进站角度 
	this.lngOut = station.lngOut;  //出站经度(1000000放大)
	this.latOut = station.latOut;  //出站纬度(1000000放大)
	this.angleOut = station.angleOut; //出站角度
	this.abbr = station.abbr;  //简称
	this.remark = station.remark;  //备注
	
	if(station.lngIn) {
		this.mapLngIn = parseInt(station.lngIn, 10) / 1000000;  //进站地图经度
	}
	if(station.latIn) {
		this.mapLatIn = parseInt(station.latIn, 10) / 1000000;  //进站地图纬度
	}
	if(station.lngOut) {
		this.mapLngOut = parseInt(station.lngOut, 10) / 1000000;  //出站地图经度
	}
	if(station.latOut) {
		this.mapLatOut = parseInt(station.latOut, 10) / 1000000;  //出站地图纬度
	}
};

standardStation.prototype.getId = function(){
	return this.id;
};

standardStation.prototype.getName = function(){
	return this.name;
};

//获取站点方向
standardStation.prototype.getDirect = function(){
	return this.direct;
}

//获取站点方向
standardStation.prototype.getDirectStr = function(){
	if(this.direct == 1) {
		return parent.lang.south;
	}else if(this.direct == 2) {
		return parent.lang.west;
	}else if(this.direct == 3) {
		return parent.lang.north;
	}else {
		return parent.lang.east;
	}
};

//获取进站角度
standardStation.prototype.getAngleIn = function(){
	if(this.angleIn) {
		return this.angleIn;
	}
	return 0;
}

//获取出站角度
standardStation.prototype.getAngleOut = function(){
	if(this.angleOut) {
		return this.angleOut;
	}
	return 0;
}

//获取站点简称
standardStation.prototype.getAbbreviation = function(){
	if(this.abbr) {
		return this.abbr;
	}
	return '';
}

//获取站点备注
standardStation.prototype.getRemark = function(){
	if(this.remark) {
		return this.remark;
	}
	return '';
}

//获取进站地图经度信息
standardStation.prototype.getMapLngIn = function() {
	return this.mapLngIn;
}

//获取进站地图纬度信息
standardStation.prototype.getMapLatIn = function() {
	return this.mapLatIn;
}

//获取出站地图经度信息
standardStation.prototype.getMapLngOut = function() {
	return this.mapLngOut;
}

//获取出站地图纬度信息
standardStation.prototype.getMapLatOut = function() {
	return this.mapLatOut;
}

//获取进站地图经纬度信息
standardStation.prototype.getMapLngLatIn = function(){
	var point = {};
	point.lng = this.mapLngIn;
	point.lat = this.mapLatIn;
	return point;
};

//获取出站地图经纬度信息
standardStation.prototype.getMapLngLatOut = function(){
	var point = {};
	point.lng = this.mapLngOut;
	point.lat = this.mapLatOut;
	return point;
};

//获取进站地图经纬度信息
standardStation.prototype.getMapLngLatInStr = function(){
	return this.mapLatIn + "," + this.mapLngIn;
};

//获取出站地图经纬度信息
standardStation.prototype.getMapLngLatOutStr = function(){
	return this.mapLatOut + "," + this.mapLngOut;
};

/**
 * 解析站点状态
 * @returns
 */
standardStation.prototype.getStationRealStatus = function() {
	var ret = {};
	ret.id =  this.getId();
	ret.name =  this.getName();
	ret.direct = this.getDirectStr(); //站点方向
	ret.mapLngLatInStr = this.getMapLngLatInStr(); //进站地图经纬度信息
	ret.mapLngLatOutStr = this.getMapLngLatOutStr(); //进站地图经纬度信息
	ret.angleIn = this.getAngleIn(); //进站角度
	ret.angleOut = this.getAngleOut(); //出站角度
	ret.abbr = this.getAbbreviation(); //简称
	ret.remark = this.getRemark(); //描述
	//地图经度
	if(this.getMapLngIn()) {
		ret.mapJingDu = this.getMapLngIn();
	}else {
		ret.mapJingDu = this.getMapLngOut();
	}
	//地图纬度
	if(this.getMapLatIn()) {
		ret.mapWeiDu = this.getMapLatIn();
	}else {
		ret.mapWeiDu = this.getMapLatOut();
	}
	
	var html=[];
	//站点简称
	html.push('<span class="b">' + "站点简称：" + '</span>&nbsp;' + ret.abbr);
	//站点方向
	html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + "站点方向：" + '</span>&nbsp;' + ret.direct + '<br/>');
	//进站位置
	html.push('<span class="b">' + "进站位置：" + '</span>&nbsp;' + ret.mapLngLatInStr);
	//进站角度
	html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + "进站角度：" + '</span>&nbsp;' + ret.angleIn + '<br/>');
	//出站位置
	html.push('<span class="b">' + "出站位置：" + '</span>&nbsp;' + ret.mapLngLatOutStr);
	//出站角度
	html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + "出站角度：" + '</span>&nbsp;' + ret.angleOut + '<br/>');
	
	ret.statusString = html.join("");
	return ret;
}

//具体线路上下行
function standardLineMore() {
	this.direct = null; //线路方向
	this.length = null;  //路线长度(单位米)
	this.totalTime = null;  //平均总耗时，单位秒
	this.itlNormalTime = null;  //平峰发车间隔，单位秒
	this.itlPeakTime = null; //高峰发车间隔，单位秒
	this.firstTime = null;  //首班车发车时间，单位秒
	this.lastTime = null;  //末班车发车时间，单位秒
	this.stationSum = null;  //站点数量
	this.jingDu = null;  //画线点经度
	this.weiDu = null;  //画线点纬度
	
	this.startStationId = null; //起点站
	this.startStationIndex = 0; //起点站编号
	this.endStationId = null; //终点站
	this.endStationIndex = 0; //终点站编号
	
	this.stationList = []; //站点id集合
	this.stationJingDu = []; //站点经度集合
	this.stationWeiDu = []; //站点经度集合
}

//设置线路方向
standardLineMore.prototype.setDirect = function(direct){
	this.direct = direct;
}

//获取站点方向
standardLineMore.prototype.getDirect = function(){
	return this.direct;
}

//线路方向
standardLineMore.prototype.getDirectStr = function(){
	if(this.direct == 1) {
		return parent.lang.line_down;
	}else {
		return parent.lang.line_up;
	}
};

//设置路线长度(单位米)
standardLineMore.prototype.setLength = function(length){
	this.length = length;
}

//获取路线长度(单位米)
standardLineMore.prototype.getLength = function(){
	if(this.length) {
		return this.length;
	}
	return 0;
}

//获取路线长度 单位公里
standardLineMore.prototype.getLengthStr = function(){
	if(this.length) {
		return parseInt(this.length, 10)/1000 + parent.lang.km;
	}
	return 0 + parent.lang.km;
}

//设置平均总耗时，单位秒
standardLineMore.prototype.setTotalTime = function(totalTime){
	this.totalTime = totalTime;
}

//获取平均总耗时，单位秒
standardLineMore.prototype.getTotalTime = function(){
	if(this.totalTime) {
		return this.totalTime;
	}
	return 0;
}

//设置平峰发车间隔，单位秒
standardLineMore.prototype.setItlNormalTime = function(itlNormalTime){
	this.itlNormalTime = itlNormalTime;
}

//获取平峰发车间隔，单位秒
standardLineMore.prototype.getItlNormalTime = function(){
	if(this.itlNormalTime) {
		return this.itlNormalTime;
	}
	return 0;
}

//获取平峰发车间隔，单位秒
standardLineMore.prototype.getItlNormalTimeStr = function(){
	if(this.itlNormalTime) {
		return this.itlNormalTime + parent.lang.second;
	}
	return 0 + parent.lang.second;
}

//设置高峰发车间隔，单位秒
standardLineMore.prototype.setItlPeakTime = function(itlPeakTime){
	this.itlPeakTime = itlPeakTime;
}

//获取高峰发车间隔，单位秒
standardLineMore.prototype.getItlPeakTime = function(){
	if(this.itlPeakTime) {
		return this.itlPeakTime;
	}
	return 0;
}

//获取高峰发车间隔，单位秒
standardLineMore.prototype.getItlPeakTimeStr = function(){
	if(this.itlPeakTime) {
		return this.itlPeakTime + parent.lang.second;
	}
	return 0 + parent.lang.second;
}

//设置首班车发车时间，单位秒
standardLineMore.prototype.setFirstTime = function(firstTime){
	this.firstTime = firstTime;
}

//获取首班车发车时间，单位秒
standardLineMore.prototype.getFirstTime = function(){
	if(this.firstTime) {
		return this.firstTime;
	}
	return 0;
}

//获取首班车发车时间，时分秒
standardLineMore.prototype.getFirstTimeStr = function(){
	if(this.firstTime) {
		return this.second2ShortHourEx(this.firstTime);
	}
	return "00:00:00";
}

//设置末班车发车时间，单位秒
standardLineMore.prototype.setLastTime = function(lastTime){
	this.lastTime = lastTime;
}

//末班车发车时间，单位秒
standardLineMore.prototype.getLastTime = function(){
	if(this.lastTime) {
		return this.lastTime;
	}
	return 0;
}

//末班车发车时间，时分秒
standardLineMore.prototype.getLastTimeStr = function(){
	if(this.lastTime) {
		return this.second2ShortHourEx(this.lastTime);
	}
	return "00:00:00";
}

//设置站点数量
standardLineMore.prototype.setStationSum = function(stationSum){
	this.stationSum = stationSum;
}

//站点数量
standardLineMore.prototype.getStationSum = function(){
	if(this.stationSum) {
		return this.stationSum;
	}
	return 0;
}

//设置画线点经度
standardLineMore.prototype.setJingDu = function(jingDu){
	this.jingDu = jingDu;
}

//画线点经度
standardLineMore.prototype.getJingDu = function(){
	if(!this.jingDu) {
		this.jingDu = this.stationJingDu.toString();
	}
	return this.jingDu;
}

//设置画线点纬度
standardLineMore.prototype.setWeiDu = function(weiDu){
	this.weiDu = weiDu;
}

//画线点纬度
standardLineMore.prototype.getWeiDu = function(){
	if(!this.weiDu) {
		this.weiDu = this.stationWeiDu.toString();
	}
	return this.weiDu;
}

//线路是否包含站点
standardLineMore.prototype.isContainStation = function(stationId){
	var sx = String.fromCharCode(2);
	var rt = new RegExp(sx + stationId + sx);
	return rt.test(sx + this.stationList.join(sx) + sx);
}

/**
 * 添加站点id
 * @param station
 * @param stationIndex 站点序号
 */
standardLineMore.prototype.addStation = function(station, stationIndex){
	if(!this.isContainStation(station.getId())) {
		//添加站点id
		this.stationList.push(station.getId());
		//添加站点经纬度
		if(station.getMapLngIn()) {
			this.stationJingDu.push(station.getMapLngIn());
		}else {
			this.stationJingDu.push(station.getMapLngOut());
		}
		if(station.getMapLatIn()) {
			this.stationWeiDu.push(station.getMapLatIn());
		}else {
			this.stationWeiDu.push(station.getMapLatOut());
		}
		
		if(this.startStationId) {
			if(parseInt(stationIndex) < parseInt(this.startStationIndex)) {
				this.startStationId = station.getId(); //起点站
				this.startStationIndex = stationIndex;
			}
		}else {
			this.startStationId = station.getId(); //起点站
			this.startStationIndex = stationIndex; //起点站编号
		}
		
		if(this.endStationId) {
			if(parseInt(stationIndex) > parseInt(this.endStationIndex)) {
				this.endStationId = station.getId(); //终点站
				this.endStationIndex = stationIndex; //终点站编号
			}
		}else {
			this.endStationId = station.getId(); //终点站
			this.endStationIndex = stationIndex; //终点站编号
		}
	}
}

//获取站点id集合
standardLineMore.prototype.getStationList = function(){
	return this.stationList;
}

//添加站点id集合
standardLineMore.prototype.setStationList = function(stationList){
	this.stationList = stationList;
}

//获取起点站id
standardLineMore.prototype.getStartStationId = function(){
	return this.startStationId;
}

//获取起点站编号
standardLineMore.prototype.getStartStationIndex= function(){
	return this.startStationIndex;
}

//获取终点站id
standardLineMore.prototype.getEndStationId = function(){
	return this.endStationId;
}

//获取终点站编号
standardLineMore.prototype.getEndStationIndex= function(){
	return this.endStationIndex;
}

//转换秒 如  0 = 0:0
standardLineMore.prototype.second2ShortHourEx = function(second) {
	var hour = parseInt(second / 3600, 10);
	var hourStr = hour;
	if (hour < 10) {
		hourStr = "0" + hour;
	}
	var minute = parseInt((second % 3600) / 60, 10);
	var minStr = minute;
	if (minute < 10) {
		minStr = "0" + minute;
	}
	var second = parseInt(second %  60, 10);
	var secStr = second;
	if (second < 10) {
		secStr = "0" + second;
	}
	return hourStr + ":" + minStr + ":" + secStr;
}

/**
 * 线路信息类
 */
function standardLine(id, name){
	this.id = id;
	this.name = name;
	this.parentId = null;  //所属公司
	this.type = null;  //路线类型
	this.ticket = null;  //售票模式
	this.price = null;  //票价(0.1元)
	this.mapType = null;  //地图类型
	this.abbr = null;  //线路简称
	this.remark = null;  //备注
	this.upDirect = null; //上行线路
	this.downDirect = null; //下行线路
	
	this.vehiIdnoList = []; //车牌号集合
}

standardLine.prototype.setStandardLine = function(line){
	this.parentId = line.pid;  //所属公司
	this.type = line.type;  //路线类型
	this.ticket = line.ticket;  //售票模式
	this.price = line.price;  //票价(0.1元)
	this.mapType = line.mapTp;  //地图类型
	this.abbr = line.abbr;  //线路简称
	this.remark = line.remark;  //备注
	
	this.upDirect = new standardLineMore(); //上行线路
	this.upDirect.setDirect(0); //设置上行
	this.upDirect.setLength(line.upLen); //上行路线长度(单位米)
	this.upDirect.setTotalTime(line.upTotalT); //上行平均总耗时，单位秒
	this.upDirect.setItlNormalTime(line.upItlN);//上行平峰发车间隔，单位秒
	this.upDirect.setItlPeakTime(line.upItlP); //上行高峰发车间隔，单位秒
	this.upDirect.setFirstTime(line.upFirst); //上行首班车发车时间，单位秒
	this.upDirect.setLastTime(line.upLast); //上行末班车发车时间，单位秒
	this.upDirect.setStationSum(line.upSum); //上行站点数量
	this.upDirect.setJingDu(line.upLng); //上行画线点经度
	this.upDirect.setWeiDu(line.upLat); //上行画线点纬度
	
	this.downDirect = new standardLineMore(); //下行线路
	this.downDirect.setDirect(1); //设置下行
	this.downDirect.setLength(line.dnLen); //下行路线长度 单位米
	this.downDirect.setTotalTime(line.dnTotalT); //下行平均总耗时，单位秒
	this.downDirect.setItlNormalTime(line.dnItlN);//下行平峰发车间隔，单位秒
	this.downDirect.setItlPeakTime(line.dnItlP); //下行高峰发车间隔，单位秒
	this.downDirect.setFirstTime(line.dnFirst); //下行首班车发车时间，单位秒
	this.downDirect.setLastTime(line.dnLast); //下行末班车发车时间，单位秒
	this.downDirect.setStationSum(line.dnSum); //下行站点数量
	this.downDirect.setJingDu(line.dnLng); //下行画线点经度
	this.downDirect.setWeiDu(line.dnLat); //下行画线点纬度
}

standardLine.prototype.getId = function(){
	return this.id;
};

standardLine.prototype.getName = function(){
	return this.name;
};

standardLine.prototype.getParentId = function(){
	return this.parentId;
};

//获取线路类型
standardLine.prototype.getType = function(){
	return this.type;
};

//获取线路类型
standardLine.prototype.getTypeStr = function(){
	if(this.type == 1) {
		return parent.lang.line_type_ring;
	}else if(this.type == 2) {
		return parent.lang.line_type_nine;
	}else {
		return parent.lang.line_type_twoWay;
	}
};

//获取售票模式
standardLine.prototype.getTicketType = function(){
	return this.ticket;
};

//获取售票模式
standardLine.prototype.getTicketTypeStr = function(){
	if(this.ticket == 1) {
		return parent.lang.line_artificial_ticket;
	}else if(this.ticket == 2) {
		return parent.lang.line_mix_ticket;
	}else {
		return parent.lang.line_no_ticket;
	}
};

//获取售票价格
standardLine.prototype.getTicketPrice = function(){
	if(this.price) {
		return parseInt(this.price,10)/10;
	}
	return 0;
};

//获取地图类型
standardLine.prototype.getMapType = function(){
	return this.mapType;
}

//获取线路简称
standardLine.prototype.getAbbreviation = function(){
	if(this.abbr) {
		return this.abbr;
	}
	return '';
}

//获取线路备注
standardLine.prototype.getRemark = function(){
	if(this.remark) {
		return this.remark;
	}
	return '';
}

//获取上行线路信息
standardLine.prototype.getUpLine = function(){
	return this.upDirect;
}

//获取下行线路信息
standardLine.prototype.getDownLine = function(){
	return this.downDirect;
}

//线路是否包含站点
standardLine.prototype.isContainStation = function(stationId, lineDirect){
	if(lineDirect == 1) {
		return this.downDirect.isContainStation(stationId);
	}else {
		return this.upDirect.isContainStation(stationId);
	}
}

/**
 * 添加站点信息
 * @param station  站点信息
 * @param lineDirect 线路上下行 0上行 1下行
 * @param stationIndex 站点序号
 */
standardLine.prototype.addStation = function(station, lineDirect, stationIndex){
	if(lineDirect == 1) {
		this.downDirect.addStation(station, stationIndex);
	}else {
		this.upDirect.addStation(station, stationIndex);
	}
}

//线路是否包含车辆
standardLine.prototype.isContainVehiIdno = function(vehiIdno){
	var sx = String.fromCharCode(2);
	var rt = new RegExp(sx + vehiIdno + sx);
	return rt.test(sx + this.vehiIdnoList.join(sx) + sx);
}

//添加车辆到线路
standardLine.prototype.addvehiIdno = function(vehiIdno){
	if(!this.isContainVehiIdno(vehiIdno)) {
		this.vehiIdnoList.push(vehiIdno);
	}
}

//获取线路下的车牌号
standardLine.prototype.getVehiIdnoList = function(){
	return this.vehiIdnoList;
}

/**
 * 解析线路状态
 * @param lineDirect  上下行 0上行 1下行
 * @returns
 */
standardLine.prototype.getLineRealStatus = function(lineDirect) {
	var ret = {};
	ret.id =  this.getId();
	ret.name =  this.getName();
	ret.type = this.getTypeStr(); //线路类型
	ret.ticket = this.getTicketTypeStr(); //售票类型
	ret.price = this.getTicketPrice(); //价格
	ret.mapType = this.getMapType(); //地图类型
	ret.abbr = this.getAbbreviation(); //简称
	ret.remark = this.getRemark(); //描述
	
	var lineInfo = null;
	if(lineDirect == 1) {
		lineInfo = this.getDownLine();
		ret.color = '0071C6';
	}else {
		lineInfo = this.getUpLine();
		ret.color = '005600';
	}
	ret.direct = lineInfo.getDirectStr(); //线路上下行
	ret.length = lineInfo.getLengthStr(); //线路长度
	ret.totalTime = lineInfo.getTotalTime(); //平均总耗时，单位秒
	ret.normalTime = lineInfo.getItlNormalTime(); //平峰发车间隔，单位秒
	ret.peakTime = lineInfo.getItlPeakTime();//高峰发车间隔，单位秒
	ret.firstTime = lineInfo.getFirstTimeStr();  //首班车发车时间
	ret.lastTime = lineInfo.getLastTimeStr();  //末班车发车时间
	ret.stationSum = lineInfo.getStationSum();  //站点数量
	ret.mapJingDu = lineInfo.getJingDu();  //画线点经度
	ret.mapWeiDu = lineInfo.getWeiDu();  //画线点纬度
	
	var html=[];
	//线路简称
	html.push('<span class="b">' + "线路简称：" + '</span>&nbsp;' + ret.abbr);
	//线路类型
	html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + "线路类型：" + '</span>&nbsp;' + ret.type + '<br/>');
	//售票类型
	html.push('<span class="b">' + "售票类型：" + '</span>&nbsp;' + ret.ticket);
	//售票价格
	html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + "售票价格：" + '</span>&nbsp;' + ret.price + '<br/>');
	//线路长度
	html.push('<span class="b">' + "线路长度：" + '</span>&nbsp;' + ret.length);
	//全程耗时
	html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + "全程耗时：" + '</span>&nbsp;' + ret.totalTime + '<br/>');
	//平峰发车间隔
	html.push('<span class="b">' + "平峰间隔：" + '</span>&nbsp;' + ret.normalTime);
	//高峰发车间隔
	html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + "高峰间隔：" + '</span>&nbsp;' + ret.peakTime + '<br/>');
	//首班时间
	html.push('<span class="b">' + "首班时间：" + '</span>&nbsp;' + ret.firstTime);
	//末班时间
	html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + "末班时间：" + '</span>&nbsp;' + ret.lastTime + '<br/>');
	
	ret.statusString = html.join("");
	return ret;
}

/**
 * 线路站点关联类
 */
function lineStationRelation(id){
	this.id = id;
	this.lineId = null;  //线路id
	this.lineDirect = null;  //线路方向
	this.stationId = null;  //站点ID
	this.stationIndex = null;  //站点索引 从0开始
	this.stationType = null;  //站点类型
	this.speed = null;  //限制速度 0-无限制 单位0.1KM/S
	this.length = null; //离始发站距离 单位米
}

lineStationRelation.prototype.setLineStationRelation = function(relation){
	this.lineId = relation.lid;  //线路id
	this.lineDirect = relation.direct;  //线路方向
	this.stationId = relation.sid;  //站点ID
	this.stationIndex = relation.sindex;  //站点索引 从0开始
	this.stationType = relation.stype;  //站点类型
	this.speed = relation.speed;  //限制速度 0-无限制 单位0.1KM/S
	this.length = relation.len; //离始发站距离 单位米
}

lineStationRelation.prototype.getId = function(){
	return this.id;
};

//线路id
lineStationRelation.prototype.getLineId = function(){
	return this.lineId;
};

//站点ID
lineStationRelation.prototype.getStationId = function(){
	return this.stationId;
};

//站点索引 从0开始
lineStationRelation.prototype.getStationIndex = function(){
	return this.stationIndex;
};

//线路方向
lineStationRelation.prototype.getLineDirect = function(){
	return this.lineDirect;
};

//线路方向
lineStationRelation.prototype.getLineDirectStr = function(){
	if(this.lineDirect == 1) {
		return parent.lang.line_down;
	}else {
		return parent.lang.line_up;
	}
};

//站点类型
lineStationRelation.prototype.getStationType = function(){
	return this.stationType;
};

//站点类型
lineStationRelation.prototype.getStationTypeStr = function(){
	if(this.stationType == 0) {
		return parent.lang.line_station_qiDian;
	}else if(this.stationType == 1) {
		return parent.lang.line_station_zhongDian;
	}else if(this.stationType == 2) {
		return parent.lang.line_station_big;
	}else if(this.stationType == 3) {
		return parent.lang.line_station_small;
	}else if(this.stationType == 4) {
		return parent.lang.line_station_place;
	}else {
		return parent.lang.line_station_place_other;
	}
};

//限制速度 0-无限制 KM/S
lineStationRelation.prototype.getLimitSpeed = function(){
	if(this.speed) {
		return parseInt(this.speed,10) / 10;
	}
	return 0;
};

//离始发站距离 单位米
lineStationRelation.prototype.getLength = function(){
	if(this.length) {
		return this.length;
	}
	return 0;
};

//离始发站距离 单位公里
lineStationRelation.prototype.getLengthStr = function(){
	if(this.length) {
		return parseInt(this.length,10) / 1000;
	}
	return 0;
};

/**
 * 解析站点关联状态
 * @param lineInfo 线路信息
 * @param stationInfo 站点信息
 * @returns
 */
lineStationRelation.prototype.getStationRealStatus = function(lineInfo, stationInfo) {
	var ret = {};
	ret.id =  this.getId();
	ret.stationId = this.getStationId(); //站点id
	ret.lineId = this.getLineId(); //线路id
	ret.lineDirect = this.getLineDirectStr(); //线路类型
	ret.stationIndex = this.getStationIndex(); //站点索引 从0开始
	ret.stationType = this.getStationTypeStr(); //站点类型
	ret.speed = this.getLimitSpeed(); //限制速度 0-无限制 单位0.1KM/S
	ret.length = this.getLengthStr(); //离始发站距离 单位米
	
	var html=[];
	//站点索引
	html.push('<span class="b">' + "站点索引：" + '</span>&nbsp;' + ret.stationIndex);
	//站点类型
	html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + "站点类型：" + '</span>&nbsp;' + ret.stationType + '<br/>');
	//站点信息
	if(stationInfo) {
		var stationRet = stationInfo.getStationRealStatus();
		ret.stationId =  stationRet.id;
		ret.name =  stationRet.name;
		ret.direct = stationRet.direct; //站点方向
		ret.mapLngLatInStr = stationRet.mapLngLatInStr; //进站地图经纬度信息
		ret.mapLngLatOutStr = stationRet.mapLngLatOutStr; //进站地图经纬度信息
		ret.angleIn = stationRet.angleIn; //进站角度
		ret.angleOut = stationRet.angleOut; //出站角度
		ret.abbr = stationRet.abbr; //简称
		ret.remark = stationRet.remark; //描述
		ret.mapJingDu = stationRet.mapJingDu; //地图经度
		ret.mapWeiDu = stationRet.mapWeiDu; //地图纬度
		html.push(stationRet.statusString);
	}
	//限制速度
	html.push('<span class="b">' + "限制速度：" + '</span>&nbsp;' + ret.speed);
	//距始发站
	html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + "距始发站：" + '</span>&nbsp;' + ret.length + '<br/>');
	//线路信息
	if(lineInfo) {
		ret.lineName = lineInfo.getName();
		//所属线路
		html.push('<span class="b">' + "所属线路：" + '</span>&nbsp;' + ret.lineName);
		//线路类型
		html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + "线路类型：" + '</span>&nbsp;' + ret.lineDirect + '<br/>');
	}
	
	ret.statusString = html.join("");
	return ret;
}