//菜单结点类
function menuitem(index, name, popMenu){
	this.index = Number(index);							//索引
	this.name = name;								//名称
	this.popMenu = Number(popMenu);					//单击时是否弹出菜单
	if (popMenu){
		this.menuName = new Array();		//菜单的名称
	}else{
		this.menuName = null;
	}
}

menuitem.prototype.setName = function(name){
	this.name = name;
};

menuitem.prototype.getName = function(name){
	return this.name;
};

menuitem.prototype.getPopMenu = function(name){
	return this.popMenu;
};

menuitem.prototype.setMenuName = function(index, name){
	this.menuName[Number(index)] = name;
};

menuitem.prototype.getMenuName = function(index){
		return this.menuName[Number(index)];
};

menuitem.prototype.delMenu = function(index){	//从此编号开始的菜单，都进行删除处理
	var count = this.menuName.length;
	var begIndex = Number(index);
	if (count > begIndex) {
		for (var i = begIndex; i < count; ++ i){
			var menu = this.menuName.pop();
			menu = null;
		}
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
	this.jindu = jindu;
	this.weidu = weidu;
	this.speed = speed;
	this.time = time;
	this.statusStr = statusStr;
};

//配置菜单
vehicle.prototype.setMenuitem = function(index, menu){
	this.menuitem[Number(index)] = menu;
};

//获取菜单信息
vehicle.prototype.getMenuitem = function(index){
	return this.menuitem[Number(index)];
};

vehicle.prototype.setPopMarker = function(popmarker){
	this.popMarker = popMarker;
};

vehicle.prototype.getPopMarker = function(){
	return this.popMarker;
};

vehicle.prototype.setNameMarker = function(namemarker){
	this.nameMarker = nameMarker;
};

vehicle.prototype.getNameMarker = function(){
	return this.nameMarker;
};