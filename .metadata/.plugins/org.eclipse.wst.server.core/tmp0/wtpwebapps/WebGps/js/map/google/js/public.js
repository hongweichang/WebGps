// JavaScript Document
var mousePos = {x:0,y:0};

//根据经纬度的距离获取地图的缩放级
function getRoom(diff){
	var room =    new Array(0,  1,  2, 3, 4, 5, 6,7,8,  9,   10,  11,  12,  13, 14);
	var diffArr = new Array(360,180,90,45,22,11,5,2.5,1.25,0.6,0.3,0.15,0.07,0.03,0);
	for(var i = 0; i < diffArr.length; i ++){
		if((diff - diffArr[i]) >= 0){
			return room[i];
		}
	}	
	return 14;
}
//更新鼠标位置
function mouseCoords(ev){ 
	ev= ev || window.event; 
	if(ev.pageX || ev.pageY){ 
		mousePos = {x:ev.pageX+10, y:ev.pageY+10}; 
	} 
	mousePos = { 
		x:ev.clientX + document.documentElement.scrollLeft - document.body.clientLeft+10,
		y:ev.clientY + document.documentElement.scrollTop   - document.body.clientTop+10
	}; 
	//document.title = mousePos.x+","+mousePos.y;
}

function getCenterPoint(maxJ,minJ,maxW,minW){//通过经纬度获取中心位置和缩放级别
	if(maxJ==minJ&&maxW==minW)return [maxJ,maxW,0];
	var diff = maxJ - minJ;
	if(diff < (maxW - minW))diff = maxW - minW;
	diff = parseInt(10000 * diff)/10000;	
	var centerJ = minJ*1000000+1000000*(maxJ - minJ)/2;
	var centerW = minW*1000000+1000000*(maxW - minW)/2;
	return [centerJ/1000000,centerW/1000000,diff];
}

function distance(lat1,lon1,lat2,lon2,len) {//获取地图上俩个点之间的距离
	var R = 6371; // km (change this constant to get miles)
	var dLat = (lat2-lat1) * Math.PI / 180;
	var dLon = (lon2-lon1) * Math.PI / 180; 
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) * 
		Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	return d+len;
}