/*每个轨迹里面有一组车辆对象和轨迹点对象
当前播放点位置对象*/
function maptrack(trackId){
	this.id = trackId;						//车辆id
	this.color = "#00FF00";				//轨迹点的颜色
	this.trackPolyLine = new Array();		//拆线变量
	this.trackPolyPoint = new Array();	//拆线的轨迹点
	this.trackLastPoint = null;					//最后一个轨迹点信息
	this.vehicleList = new Array();			//轨迹点对应的车辆列表信息
	this.playVehicle = null;						//播放的标记信息		-1
	this.playReplace = null;						//播放代替的标记
	this.selectVehicle = null;					//选择的标记信息		-2
	this.zIndex = 0;
};

maptrack.prototype.getId = function() {
	return this.id;
};


/********************************************************************************************
 *标记点对象
 ********************************************************************************************/
function mapmarker(id){
	this.id = Number(id);					//id
	this.name = null;							//名称
	this.jindu = null;						//经度
	this.weidu = null;						//纬度
	this.typeId = null;						//标记类型ID
	this.status = null;						//状态
	this.color = null;            //颜色
	this.tabType = null;          //标记类型（点，面，线）
	this.popMarker = null;
	this.nameMarker = null;				//叠加层对象
	this.shape = null;						//图形对象
	this.listenerClick = null;		//监听对象
	this.listenerMousemove = null;		//监听对象
	this.listenerMousedown = null;		//监听对象
	this.listenerMouseup = null;			//监听对象
	this.position = null;					//位置，名称标签的位置
}
mapmarker.prototype.getId = function() {
	return this.id;
};
mapmarker.prototype.setName = function(name){
	this.name = name;
};
mapmarker.prototype.getName = function() {
	return this.name;
};
mapmarker.prototype.getJindu = function() {
	return this.jindu;
};
mapmarker.prototype.getWeidu = function() {
	return this.weidu;
};
mapmarker.prototype.getTypeId = function() {
	return this.typeId;
};
mapmarker.prototype.getAdress = function() {
	return this.adress;
};
mapmarker.prototype.getRemark = function() {
	return this.remark;
};
mapmarker.prototype.getColor = function() {
	return this.color;
};
mapmarker.prototype.getTabType = function() {
	return this.tabType;
};
mapmarker.prototype.setNameMaker = function(maker){
	this.nameMarker = maker;
};
mapmarker.prototype.getNameMaker = function(){
	return this.nameMarker;
};
mapmarker.prototype.setData = function(typeId, jindu, weidu, color, tabType){
	this.typeId = typeId;
	this.jindu=jindu;
	this.weidu=weidu;
	this.color=color;
	this.tabType=tabType;
	this.status=status;
};

function submenuitem(index, name, cls) {
	this.index = index;							//索引
	this.name = name;								//名称
	this.cls = cls;   							//class
}

submenuitem.prototype.getIndex = function(){
	return this.index;
};

submenuitem.prototype.getName = function(){
	return this.name;
};

submenuitem.prototype.setName = function(name){
	this.name = name;
};

submenuitem.prototype.getCls = function(){
	return this.cls;
};

submenuitem.prototype.setCls = function(cls){
	this.cls = cls;
};

//菜单结点类
function menuitem(index, name, popMenu, cls){
	this.index = index;							//索引
	this.name = name;								//名称
	this.popMenu = Number(popMenu);					//单击时是否弹出菜单
	this.submenu = new Array();		//菜单的名称
	this.cls = cls;   							//class
}

menuitem.prototype.getIndex = function(){
	return this.index;
};

menuitem.prototype.setName = function(name){
	this.name = name;
};

menuitem.prototype.getName = function(name){
	return this.name;
};

menuitem.prototype.getCls = function(){
	return this.cls;
};

menuitem.prototype.setCls = function(cls){
	this.cls = cls;
};

menuitem.prototype.getPopMenu = function(name){
	return this.popMenu;
};

menuitem.prototype.getSubMenu = function(index) {
	for (var i = 0; i < this.submenu.length; ++ i){
		if ( this.submenu[i].getIndex() == index ){
			return this.submenu[i];
		}
	}
	return null;
};

menuitem.prototype.setMenuName = function(index, name, cls){
	var smenu = this.getSubMenu(index);
	if (smenu != null) {
		smenu.setName(name);
		smenu.setCls(cls);
	} else {
		var smenuitem = new submenuitem(index, name, cls);
		this.submenu.push(smenuitem);
	}
};

menuitem.prototype.getMenuName = function(index){
	var smenu = this.getSubMenu(index);
	if (smenu != null) {
		return smenu.getName();
	} else {
		return "";
	}
};

menuitem.prototype.delMenu = function(index){	//从此编号开始的菜单，都进行删除处理
	var count = this.submenu.length;
	for (var i = 0; i < count; ++ i){
		var menu = this.submenu.pop();
		if ( menu.getIndex() == index ){
			continue;
		}
		this.submenu.unshift(menu);
	}
};

function vehicle(vehiIdno){
	this.idno = vehiIdno;	//车辆id
	this.name = null;			//车辆名称
	this.label = null;		//标签名称
	this.speed = null;		//速度
	this.jindu = null;		//经度
	this.weidu = null;		//纬度
	this.time = null;		//时间
	this.movetip = true;		//是否鼠标移动时，显示信息
	this.show = true;		//是否显示到地图上
	this.huangXiang = null;	//航向
	this.statusImage = null;	//状态图标
	this.statusStr = null;	//状态
	this.menuitem = new Array();	//菜单
	this.popMarker = null;
	this.nameMarker = null;
	this.trackPolyLine = new Array();		//拆线变量
	this.trackPolyPoint = new Array();	//拆线的轨迹点
	this.trackLastPoint = null;					//最后一个轨迹点信息
	this.icon = 1;		//如果没有配置图标，则默认使用货车车辆图标
	this.point_ = null;
}

vehicle.prototype.getIdno = function() {
	return this.idno;
};

vehicle.prototype.getName = function(){
	return this.name;
};

vehicle.prototype.getLabel = function(){
	return this.label;
};

vehicle.prototype.getSpeed = function(){
	return this.speed;
};

vehicle.prototype.getJindu = function(){
	return this.jindu;
};

vehicle.prototype.getWeidu = function(){
	return this.weidu;
};

vehicle.prototype.getTime = function(){
	return this.time;
};

vehicle.prototype.getStatusStr = function(){
	return this.statusStr;
};

vehicle.prototype.setName = function(name){
	this.name = name;
};

vehicle.prototype.setLabel = function(label){
	this.label = label;
};

//配置车辆状态
vehicle.prototype.setStatus = function(jindu, weidu, speed, time, statusStr){
	if (jindu != "") {
		this.jindu = jindu;
	}
	if (weidu != "") {
		this.weidu = weidu;
	}
	if (jindu != "" && weidu != "") {
		this.point_ = new BMap.Point(jindu, weidu);
	}
	this.speed = speed;
	this.time = time;
	this.statusStr = statusStr;
};

//配置菜单
vehicle.prototype.setMenuitem = function(index, menu){
	var findMenu = this.getMenuitem(index);
	if (findMenu != null) {
		findMenu = menu;
	} else {
		this.menuitem.push(menu);
	}
};

//获取菜单信息
vehicle.prototype.getMenuitem = function(index){
	for (var i = 0; i < this.menuitem.length; ++ i){
		if ( this.menuitem[i].getIndex() == index ){
			return this.menuitem[i];
		}
	}
	return null;
};

//删除菜单信息
vehicle.prototype.delMenuitem = function(index){
	for (var i = 0; i < this.menuitem.length; ++ i){
		if ( this.menuitem[i].getIndex() == index ){
			this.menuitem.splice(i, 1);
		}
	}
};

vehicle.prototype.setPopMarker = function(popmarker){
	this.popMarker = popmarker;
};

vehicle.prototype.getPopMarker = function(){
	return this.popMarker;
};

vehicle.prototype.setNameMarker = function(namemarker){
	this.nameMarker = namemarker;
};

vehicle.prototype.getNameMarker = function(){
	return this.nameMarker;
};

vehicle.prototype.getPosition = function () {
	return this.point_;
};