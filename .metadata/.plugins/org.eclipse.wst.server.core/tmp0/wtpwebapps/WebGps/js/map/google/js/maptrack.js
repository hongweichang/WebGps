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
