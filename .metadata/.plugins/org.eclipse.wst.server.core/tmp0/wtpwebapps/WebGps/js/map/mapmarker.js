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
	this.listener = null;					//监听对象
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