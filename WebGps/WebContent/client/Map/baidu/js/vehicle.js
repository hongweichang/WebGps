function submenuitem(index, name) {
	this.index = Number(index);							//索引
	this.name = name;								//名称
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

//菜单结点类
function menuitem(index, name, popMenu){
	this.index = Number(index);							//索引
	this.name = name;								//名称
	this.popMenu = Number(popMenu);					//单击时是否弹出菜单
	this.submenu = new Array();		//菜单的名称
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

menuitem.prototype.getPopMenu = function(name){
	return this.popMenu;
};

menuitem.prototype.getSubMenu = function(index) {
	for (var i = 0; i < this.submenu.length; ++ i){
		if ( this.submenu[i].getIndex() == Number(index) ){
			return this.submenu[i];
		}
	}
	return null;
};

menuitem.prototype.setMenuName = function(index, name){
	var smenu = this.getSubMenu(index);
	if (smenu != null) {
		smenu.setName(name);
	} else {
		var smenuitem = new submenuitem(index, name);
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
		if ( menu.getIndex() == Number(index) ){
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
	this.groupmarker = null;
	this.groupNameMarker = null;
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
	if (null != this.nameMarker) {
		this.nameMarker.setName(name);
	}
	if (null != this._clusterMarker) {
		this._clusterMarker.setText(name);
	}
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
		if ( this.menuitem[i].getIndex() == Number(index) ){
			return this.menuitem[i];
		}
	}
	return null;
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

vehicle.prototype.setGroupMarker = function(groupmarker){
	this.groupmarker = groupmarker;
};

vehicle.prototype.getGroupMarker = function(){
	return this.groupmarker;
};

vehicle.prototype.setgroupNameMarker = function(groupNameMarker){
	this.groupNameMarker = groupNameMarker;
};

vehicle.prototype.getgroupNameMarker = function(){
	return this.groupNameMarker;
};